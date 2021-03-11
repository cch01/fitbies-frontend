import { useStores } from 'hooks/useStores';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { useMeeting } from 'hooks/useMeeting';
import { useSubscription } from 'hooks/useSubscription';
import { useMutation } from '@apollo/client';
import { useUserMedia } from 'hooks/useUserMedia';
import LoadingScreen from 'components/loadingScreen';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import meetingStore from 'lib/stores/meetingStore';
import meetingChannel from './graphql/meetingChannel';
import Meeting from './components/meeting';
import sendMeetingMessageGQL from './graphql/sendMeetingMessage';
import inviteMeetingGQL from './graphql/inviteMeeting';

// TODO toggleMeetingMedia, toggleParticipantMediaGQL, msg receive not re-rendering, mute/cut media from disabled participant
interface MeetingState {
  videoOff?: boolean
  muted?: boolean
}

const MeetingPage: React.FC = React.memo(observer(() => {
  const { authStore, meetingStore, uiStore } = useStores();
  const selfMediaSettings = useLocation<MeetingState>().state;
  const { videoOff: meetingVideoOff, muted: meetingMuted } = meetingStore;
  const history = useHistory();
  const [muted, setMuted] = useState<boolean>(selfMediaSettings?.muted ?? false);
  const [videoOff, setVideoOff] = useState<boolean>(selfMediaSettings?.videoOff ?? false);

  uiStore.setTitle(`Meeting with ${meetingStore.initiator?.nickname}`);
  const {
    meetingId,
    meetingPassCode,
    peerRoomId,
    isInitiator,
    isJoining,
    participants,
    joinersStreams,
    messages,
    initiator,
  } = meetingStore;

  useEffect(() => {
    (_.isNil(peerRoomId || meetingId)) && history.push('/landing');
  });

  const userId = authStore.viewer._id!;

  const { data: meetingChannelData, loading } = useSubscription({ query: meetingChannel, variables: { userId, meetingId }, fetchPolicy: 'network-only' },
    (errs) => errs?.forEach((_err) => {
      console.log(_err);
      toast.error(_err.message ?? 'Something went wrong');
    }));

  const [sendMeetingMessage] = useMutation(sendMeetingMessageGQL);
  const [inviteMeeting] = useMutation(inviteMeetingGQL, {
    onCompleted: () => toast.success('Invitation sent'),
    onError: () => toast.error('Something went wrong'),
  });

  // TODO fix cam in use even not in meeting page sometimes
  const { error: userMediaError, stream, loading: streamLoading } = useUserMedia({ width: 640, height: 360 });

  userMediaError && console.log('err', userMediaError);

  const { loading: meetingLoading } = useMeeting({
    isInitiator,
    localMediaStream: stream!,
    targetId: peerRoomId!,
    userId,
    addVideoStream: meetingStore.addVideoStream,
    addCallObject: meetingStore.addCallObject,
    onPeerConnected: (peer) => meetingStore.setPeer(peer),
    onError: (err) => {
      console.log(err);
      toast.error('Something went wrong');
      history.push('/landing');
    },
  });

  useEffect(() => {
    console.log('peer changed!!!');
    if (isJoining && meetingStore.peer && stream) {
      console.log('fire connection');
      if (!isInitiator) {
        meetingStore.connectToPeer(peerRoomId!, stream);
      }
      meetingStore.getJoinerIds(userId)
        .forEach((id) => meetingStore.connectToPeer(id, stream));
    }
  }, [meetingStore.peer]);

  useEffect(() => {
    if (meetingChannelData?.meetingChannel) {
      meetingStore.eventDispatcher(meetingChannelData.meetingChannel);
    }
  }, [meetingChannelData]);

  useEffect(() => {
    if (!stream) {
      return;
    }
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !meetingVideoOff && !videoOff;
    });

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !meetingMuted && !muted;
    });
  }, [stream, videoOff, muted]);

  const onToggleMic = () => { setMuted((val) => !val); };
  const onToggleCam = () => { setVideoOff((val) => !val); };

  const onSendMessage = (input: Record<string, string>): void => {
    const { message } = input;
    if (!message) return;
    sendMeetingMessage({ variables: { sendMeetingMessageInput: { userId, meetingId, content: message } } });
  };

  const onInviteByEmail = (input: Record<string, string>): void => {
    inviteMeeting({ variables: { inviteMeetingInput: { userId, email: input.email, meetingId } } });
  };

  const onLeaveMeeting = (): void => {
    meetingStore.disconnectServer();
    meetingStore.reset();
    history.replace('/landing');
  };

  if (meetingLoading || streamLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Meeting
        onInviteByEmail={onInviteByEmail}
        isInitiator={isInitiator}
        meetingId={meetingId!}
        meetingPassCode={meetingPassCode}
        initiatorName={initiator?.nickname}
        messages={messages}
        localStream={stream}
        peerStreams={joinersStreams}
        onLeaveMeeting={onLeaveMeeting}
        onSendMessage={onSendMessage}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
        meetingVideoOff={meetingVideoOff}
        meetingMuted={meetingMuted}
        muted={muted}
        videoOff={videoOff}
      />
    </>
  );
}));

export default MeetingPage;
