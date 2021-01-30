import { useStores } from 'hooks/useStores';
import React, {
  createRef, RefObject, useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { useMeeting } from 'hooks/useMeeting';
import { useSubscription } from '@apollo/client';
import { useUserMedia } from 'hooks/useUserMedia';
import { onError } from '@apollo/client/link/error';
import LoadingScreen from 'components/loadingScreen';
import Meeting from './components';
import meetingChannel from './graphql/meetingChannel';
import Video from './components/Video';
import ParticipantList from './components/ParticipantList';

interface MeetingPageStates {
  roomId: string;
  meetingId: string;
  isInitiator?: boolean
}

const MeetingPage: React.FC = () => {
  const history = useHistory();
  const { roomId, meetingId, isInitiator = false } = useLocation<MeetingPageStates>().state;
  useEffect(() => {
    (_.isNil(roomId || meetingId)) && history.push('/');
  });
  const count = useRef<number>(1);
  console.warn('rerender meeting page', count.current + 1);
  const { authStore } = useStores();
  const userId = authStore.currentViewer._id!;
  const {
    data: meetingChannelData, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({});

  userMediaError && console.log('err', userMediaError);

  const { loading: meetingLoading, result: meetingResult } = useMeeting({
    isInitiator,
    localMediaStream: stream!,
    targetId: roomId,
    userId,
  });

  const {
    removeVideoStream, connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
  } = meetingResult!;

  useEffect(() => {
    if (!isInitiator && !meetingLoading && meetingResult) {
      console.log('fire');
      connectToPeer(roomId);
    }
  }, [meetingLoading]);

  useEffect(() => {

  }, [meetingChannelData]);

  if (meetingLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Video stream={stream} />
      <ParticipantList peerStreams={peerStreams!} />
    </>
  );
};

export default MeetingPage;
