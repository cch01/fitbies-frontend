import { useStores } from 'hooks/useStores';
import React, {
  createRef, RefObject, useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { useMeeting } from 'hooks/useMeeting';
import { useSubscription } from '@apollo/client';
import { useUserMedia } from 'hooks/useUserMedia';
import LoadingScreen from 'components/loadingScreen';
import { observer } from 'mobx-react-lite';
import meetingChannel from './graphql/meetingChannel';
import Meeting from './components/meeting';

const MeetingPage: React.FC = observer(() => {
  const history = useHistory();

  const count = useRef<number>(1);
  // eslint-disable-next-line no-plusplus
  console.warn('rerender meeting page', count.current++);
  const { authStore, meetingStore, uiStore } = useStores();
  uiStore.setTitle(`Meeting with ${meetingStore.initiator?.nickname}`);
  const {
    meetingId,
    roomId,
    isInitiator,
    currentMessages,
    currentParticipants,
    joinersStreams,
    messages,
  } = meetingStore;
  useEffect(() => {
    (_.isNil(roomId || meetingId)) && history.push('/landing');
  });
  const userId = authStore.viewer._id!;
  const {
    data: meetingChannelData, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({ width: 640, height: 360 });

  userMediaError && console.log('err', userMediaError);
  console.log('meetingId', meetingStore.meetingId);
  const { loading: meetingLoading } = useMeeting({
    isInitiator,
    localMediaStream: stream!,
    targetId: roomId!,
    userId,
    addVideoStream: meetingStore.addVideoStream,
    addCallObject: meetingStore.addCallObject,
    onPeerConnected: (peer) => meetingStore.setPeer(peer),
  });

  useEffect(() => {
    console.log('peer changed!!!');
    if (!isInitiator && meetingStore.peer && stream) {
      console.log('fire connection');
      meetingStore.connectToPeer(roomId!, stream);
      meetingStore.getJoinerIds(userId)
        .forEach((id) => meetingStore.connectToPeer(id, stream));
    }
  }, [meetingStore.peer]);

  useEffect(() => {
    if (meetingChannelData?.meetingChannel) {
      console.log('channel event come!');
      meetingStore.eventDispatcher(meetingChannelData.meetingChannel);
    }
  }, [meetingChannelData]);

  useEffect(() => {
    if (!_.isEmpty(currentMessages)) {
      console.log('new message!');
      console.log(currentMessages);
    }
  }, [currentMessages]);

  if (meetingLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Meeting messages={messages} onSendMessage={(msg: string) => {}} localStream={stream} peerStreams={joinersStreams} />
    </>
  );
});

export default MeetingPage;
