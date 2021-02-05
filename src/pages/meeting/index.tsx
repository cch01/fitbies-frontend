import { useStores } from 'hooks/useStores';
import React, {
  createRef, RefObject, useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { useMeeting } from 'hooks/useMeeting';
import { useMutation, useSubscription } from '@apollo/client';
import { useUserMedia } from 'hooks/useUserMedia';
import LoadingScreen from 'components/loadingScreen';
import { observer } from 'mobx-react-lite';
import meetingChannel from './graphql/meetingChannel';
import Meeting from './components/meeting';
import sendMeetingMessage from './graphql/sendMeetingMessage';
import leaveMeeting from './graphql/leaveMeeting';

const MeetingPage: React.FC = React.memo(observer(() => {
  const history = useHistory();
  const [stopSubscription, setStopSubscription] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const count = useRef<number>(1);
  // eslint-disable-next-line no-plusplus
  console.warn('rerender meeting page', count.current++);
  const { authStore, meetingStore, uiStore } = useStores();
  uiStore.setTitle(`Meeting with ${meetingStore.initiator?.nickname}`);
  const {
    meetingId,
    meetingPassCode,
    roomId,
    isInitiator,
    currentMessages,
    currentParticipants,
    joinersStreams,
    messages,
    initiator,
  } = meetingStore;
  useEffect(() => {
    (_.isNil(roomId || meetingId)) && history.push('/landing');
  });
  const userId = authStore.viewer._id!;
  const {
    data: meetingChannelData, error: meetingChannelError,
  } = useSubscription(meetingChannel, { variables: { userId, meetingId }, skip: stopSubscription });

  const [runSendMeetingMessageMutation] = useMutation(sendMeetingMessage);

  const [runLeaveMeetingMutation] = useMutation(leaveMeeting);

  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({
    video: isCamOn, audio: isMicOn, width: 640, height: 360,
  });

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
    return setStopSubscription(true);
  }, [meetingChannelData]);

  useEffect(() => {
    if (!_.isEmpty(currentMessages)) {
      console.log('new message!');
      console.log(currentMessages);
    }
  }, [currentMessages]);

  const onToggleMic = () => { setIsMicOn((val) => !val); };
  const onToggleCam = () => { setIsCamOn((val) => !val); };

  const onSendMessage = (input: Record<string, string>): void => {
    const { message } = input;
    if (!message) return;
    console.log({ userId, meetingId, content: message });
    runSendMeetingMessageMutation({ variables: { sendMeetingMessageInput: { userId, meetingId, content: message } } });
  };

  const onLeaveMeeting = (): void => {
    console.log('Leave meeting pressed');
    runLeaveMeetingMutation({ variables: { userId, meetingId } });
    meetingStore.reset();
    history.replace('/landing');
  };

  if (meetingLoading || streamLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Meeting
        isInitiator={isInitiator}
        meetingId={meetingId!}
        meetingPassCode={meetingPassCode}
        initiatorName={initiator!.nickname}
        messages={messages}
        localStream={stream}
        peerStreams={joinersStreams}
        onLeaveMeeting={onLeaveMeeting}
        onSendMessage={onSendMessage}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
        isMicOn={isMicOn}
        isCamOn={isCamOn}
      />
    </>
  );
}));

export default MeetingPage;
