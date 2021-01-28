import { useMutation } from '@apollo/client';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import CreateMeeting, { CreateMeetingInput } from './components/CreateMeeting';
import createMeetingGQL from './graphql/CreateMeeting';

const CreateMeetingPage: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();
  uiStore.setTitle('Host meeting');
  const viewer = authStore.currentViewer;
  const history = useHistory();
  const [runJoinMeetingMutation, { loading }] = useMutation(createMeetingGQL);

  const onCreateMeeting = ({ passCode }: CreateMeetingInput) => {
    runJoinMeetingMutation({ variables: { createMeetingInput: { passCode, initiatorId: viewer._id } } }).then(({ data }) => {
      console.log('create meeting response', data);
      if (!_.isEmpty(data.createMeeting.roomId)) {
        history.push('/meeting', {
          roomId: data.createMeeting.roomId,
          isInitiator: true,
          meetingId: data.createMeeting._id,
        });
      }
    });
  };

  return <CreateMeeting onCreateMeeting={onCreateMeeting} />;
});

export default CreateMeetingPage;
