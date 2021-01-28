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
    data, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId } });

  useEffect(() => { console.log(data); }, [data]);
  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({});

  userMediaError && console.log('err', userMediaError);

  const { loading: meetingLoading, result } = useMeeting({
    streamLoading,
    isInitiator,
    localMediaStream: stream!,
    targetId: roomId,
    userId,
  });

  useEffect(() => {
    if (!isInitiator && !meetingLoading && result) {
      console.log('fire');
      result?.connectToPeer(roomId);
    }
  }, [meetingLoading]);

  if (meetingLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Video stream={stream} />
      <ParticipantList peerStreams={result?.peerStreams!} />
    </>
  );
};

export default MeetingPage;
