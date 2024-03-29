import { useMutation } from '@apollo/client';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import HostMeeting, { HostMeetingInput } from './components/hostMeeting';
import hostMeetingGQL from './graphql/hostMeeting';

const HostMeetingPage: React.FC = observer(() => {
  const { authStore, uiStore, meetingStore } = useStores();
  uiStore.setTitle('Host a meeting');
  const { viewer } = authStore;
  const history = useHistory();
  const [runJoinMeetingMutation, { loading }] = useMutation(hostMeetingGQL);
  meetingStore.reset();

  const onHostMeeting = ({ passCode }: HostMeetingInput) => {
    runJoinMeetingMutation({ variables: { hostMeetingInput: { passCode, initiatorId: viewer._id } } }).then(({ data }) => {
      if (!_.isEmpty(data.hostMeeting.roomId)) {
        meetingStore.setMeeting(data.hostMeeting, viewer._id!, false);
        history.push('/meeting');
      }
    });
  };

  return <HostMeeting onHostMeeting={onHostMeeting} />;
});

export default HostMeetingPage;
