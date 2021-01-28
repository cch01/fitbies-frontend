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
import { onError } from '@apollo/client/link/error';
import Meeting from './components';
import meetingChannel from './graphql/meetingChannel';
import Video from './components/Video';

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
  console.log(roomId);
  console.log(meetingId);
  const { authStore } = useStores();
  const userId = authStore.currentViewer._id!;
  // const {
  //   loading, data, error: meetingChannelError,
  // } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  // console.log(data);

  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({});

  userMediaError && console.log('err', userMediaError);

  const {
    connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
  } = useMeeting({
    isInitiator, localMediaStream: stream!, targetId: roomId, userId,
  });

  // !isInitiator && connectToPeer(peer, roomId);

  // const room = peer.connect(roomId, streamRef.current as MediaStream);

  return (
    <>
      {!streamLoading && <Video stream={stream} autoPlay />}
    </>
  );
};

export default MeetingPage;
