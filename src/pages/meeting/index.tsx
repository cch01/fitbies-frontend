import { useStores } from 'hooks/useStores';
import React, {
  createRef, RefObject, useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { useMeeting } from 'hooks/useMeeting';
import { useSubscription } from '@apollo/client';
import { useUserMedia } from 'hooks/useUserMedia';
// import { useUserMediaFromContext } from '@vardius/react-user-media';
import Meeting from './components';
import meetingChannel from './graphql/meetingChannel';
import Video from './components/Video';

interface MeetingPageProps {
  isInitiator?: boolean
}

interface MeetingPageStates {
  roomId: string;
  meetingId: string;
}

const MeetingPage: React.FC<MeetingPageProps> = ({ isInitiator = false }) => {
  const history = useHistory();
  const { roomId, meetingId } = useLocation<MeetingPageStates>().state;
  console.log(roomId);
  console.log(meetingId);
  const { authStore } = useStores();
  const userId = authStore.currentViewer._id!;
  const {
    loading, data, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  console.log('subscription data');
  console.log(data);

  const { error: userMediaError, streamRef } = useUserMedia({});

  userMediaError && console.log('err', userMediaError);

  const {
    connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
  } = useMeeting({
    isInitiator: true, localMediaStream: streamRef.current, targetId: roomId, userId,
  });

  useEffect(() => {
    (_.isNil(roomId)) && history.push('/');
  });

  !isInitiator && connectToPeer(roomId);

  // TODO subscription channel

  // const room = peer.connect(roomId, streamRef.current as MediaStream);

  return (
    <>
      <Video stream={streamRef.current!} autoPlay />
    </>
  );
};

export default MeetingPage;
