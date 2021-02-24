import { useMutation } from '@apollo/client';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParams } from 'use-query-params';
import _ from 'lodash';
import LoadingScreen from 'components/loadingScreen';
import JoinMeeting, { JoinRoomInput } from './components/joinMeeting';
import joinMeetingGQL from './graphql/joinMeeting';

const JoinMeetingPage: React.FC = observer(() => {
  const { authStore, meetingStore, uiStore } = useStores();
  uiStore.setTitle('Join a meeting');

  const { viewer } = authStore;
  const history = useHistory();
  const [{ mid, passcode }] = useQueryParams({ mid: StringParam, passcode: StringParam });
  const [runJoinMeetingMutation, { loading }] = useMutation(joinMeetingGQL);

  meetingStore.reset();

  const onJoinMeeting = ({ meetingId, passCode }: JoinRoomInput) => {
    runJoinMeetingMutation({ variables: { joinMeetingInput: { meetingId, passCode, joinerId: viewer._id } } }).then(({ data }) => {
      if (!_.isEmpty(data.joinMeeting.roomId)) {
        meetingStore.setMeeting(data.joinMeeting, viewer._id!, true);
        history.push('/meeting');
      }
    });
  };

  if (viewer && mid) {
    onJoinMeeting({ meetingId: mid, passCode: passcode });
  }

  return loading ? <LoadingScreen /> : <JoinMeeting onJoinMeeting={onJoinMeeting} />;
});

export default JoinMeetingPage;
