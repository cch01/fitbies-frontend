import { useMutation } from '@apollo/client';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParams } from 'use-query-params';
import _ from 'lodash';
import JoinMeeting, { JoinRoomInput } from './components/joinMeeting';
import joinMeetingGQL from './graphql/joinMeeting';

const JoinMeetingPage: React.FC = observer(() => {
  const { authStore, meetingStore } = useStores();
  const viewer = authStore.currentViewer;
  const history = useHistory();
  const [queries] = useQueryParams({ mId: StringParam, pass: StringParam });
  const [runJoinMeetingMutation, { loading }] = useMutation(joinMeetingGQL);

  const onJoinMeeting = ({ meetingId, passCode }: JoinRoomInput) => {
    runJoinMeetingMutation({ variables: { joinMeetingInput: { meetingId, passCode, joinerId: viewer._id } } }).then(({ data }) => {
      console.log('join response', data);
      if (!_.isEmpty(data.joinMeeting.roomId)) {
        meetingStore.setMeeting(data.joinMeeting, viewer._id!);
        history.push('/meeting', { roomId: data.joinMeeting.roomId, meetingId });
      }
    });
  };

  return <JoinMeeting onJoinMeeting={onJoinMeeting} />;
});

export default JoinMeetingPage;
