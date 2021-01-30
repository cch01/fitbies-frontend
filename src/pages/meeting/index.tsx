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
import Video from './components/Video';
import ParticipantList from './components/ParticipantList';

interface MeetingPageStates {
  roomId: string;
  meetingId: string;
  isInitiator?: boolean
}

const MeetingPage: React.FC = observer(() => {
  const history = useHistory();
  const { roomId, meetingId, isInitiator = false } = useLocation<MeetingPageStates>().state;
  useEffect(() => {
    (_.isNil(roomId || meetingId)) && history.push('/');
  });
  const count = useRef<number>(1);
  console.warn('rerender meeting page', count.current + 1);
  const { authStore, meetingStore } = useStores();
  const userId = authStore.currentViewer._id!;
  const {
    data: meetingChannelData, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({});

  userMediaError && console.log('err', userMediaError);
  console.log('meetingId', meetingStore.meetingId);
  const { loading: meetingLoading } = useMeeting({
    isInitiator,
    localMediaStream: stream!,
    targetId: roomId,
    userId,
    addVideoStream: meetingStore.addVideoStream,
    addCallObject: meetingStore.addCallObject,
    onPeerConnected: (peer) => meetingStore.setPeer(peer),
  });

  useEffect(() => {
    console.log('peer changed!!!');
    if (!isInitiator && meetingStore.peer && stream) {
      console.log('fire connection');
      meetingStore.connectToPeer(roomId, stream);
      meetingStore.getJoinerIds(userId)
        .map((id) => meetingStore.connectToPeer(id, stream));
    }
  }, [meetingStore.peer]);

  useEffect(() => {
    if (meetingChannelData.meetingChannel) {
      meetingStore;
    }
  }, [meetingChannelData]);

  if (meetingLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Video stream={stream} />
      <ParticipantList peerStreams={meetingStore.joinersStreams!} />
      <button type="button" onClick={() => meetingStore.disconnectPeer('6003fe9c8c5bc400d1a13a07')}>Disconnect with cch02</button>
      <button type="button" onClick={() => meetingStore.removeVideoStream('6003fe9c8c5bc400d1a13a07')}>remove stream of cch02</button>
    </>
  );
});

export default MeetingPage;
