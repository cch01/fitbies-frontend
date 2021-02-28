import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Message } from 'lib/stores/meetingStore';
import _ from 'lodash';
import Video from './video';
import InfoPanel from './infoPanel';
import InvitationModal from './invitationModal';

interface MeetingProps {
  localStream?: MediaStream;
  peerStreams: {[x: string]: MediaStream};
  onSendMessage: (input: any) => void;
  onLeaveMeeting: () => void;
  onToggleCam: () => void;
  onToggleMic: () => void;
  onInviteByEmail: (input: any) => void;
  isMicOn: boolean;
  isCamOn: boolean;
  initiatorName: string | undefined;
  messages: Message[];
  meetingId: string;
  meetingPassCode?: string;
  isInitiator: boolean;
}
const Meeting: React.FC<MeetingProps> = ({
  localStream,
  peerStreams,
  messages,
  onSendMessage,
  onLeaveMeeting,
  onToggleMic,
  onToggleCam,
  onInviteByEmail,
  isMicOn,
  isCamOn,
  initiatorName,
  meetingId,
  meetingPassCode,
  isInitiator,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const onOpenInviteModal = () => setShowInviteModal(true);
  const onCloseInviteModal = () => setShowInviteModal(false);

  const onPopAlert = (e: any) => {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    if (window.confirm('Do you want to leave the meeting ?')) {
      onLeaveMeeting();
    }
    window.history.pushState(null, '', window.location.pathname);
  };

  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', onPopAlert);
    return () => {
      window.removeEventListener('popstate', onPopAlert);
    };
  }, []);

  return (
    <>
      <div className="flex-row flex-space-evenly height-100p flex-y-start">
        <div className="flex-column pr-2 flex-70p flex-x-start flex-y-center">
          <div className="flex-row width-100p flex-space-between">
            <div className="h3">{`Meeting initiated by ${initiatorName}`}</div>
            <div className="flex-row flex-space-around text-center pointer" role="button" tabIndex={0} onMouseUp={onOpenInviteModal}>
              <div className="light-green h4 flex-row text-center flex-y-end flex-x-center">
                <i className="fas fa-plus-circle mr-1 m-auto" />
                Invite user
              </div>
            </div>
          </div>
          <div className="mt-2 py-2 flex-column flex-x-center flex-y-center flex-grow-1 width-100p overflow-hidden border-radius shadow p2 bg-black">
            <Video className={clsx({ hide: !localStream }, 'border-radius overflow-hidden width-100p')} stream={localStream} autoPlay muted />
            <div className={clsx({ hide: _.isEmpty(peerStreams) }, 'flex-row flex-0 flex-space-around mt-1 max-height-25p')}>
              {Object.keys(peerStreams).map((participantId) => {
                if (!peerStreams[participantId]) {
                  return null;
                }
                return <div key={participantId} className="overflow-hidden border-radius border-white mx-1 width-auto height-100p"><Video className="height-100p border-radius overflow-hidden width-100p" key={participantId} stream={peerStreams[participantId]} autoPlay muted={false} /></div>;
              })}
            </div>
            <div className="position-absolute bottom height-100px mb-2 z2 flex-row width-100p flex-x-center">
              <div
                role="button"
                tabIndex={0}
                onMouseUp={onToggleCam}
                className="hoverEnlarge transition circle width-40 height-40 overflow-hidden"
              >
                <div className="blur position-absolute width-100p height-100p bg-grey-7" />
                <div className="white">
                  <i className={`fas ${isCamOn ? 'fa-video-slash' : 'fa-video'} h4`} />
                </div>
              </div>
              <div
                role="button"
                tabIndex={-1}
                onMouseUp={onLeaveMeeting}
                className="hoverEnlarge transition square border-radius-l bg-grey-f width-55 height-55 white bg-red h3 opacity=75 mx-5"
              >
                <i className="fas fa-phone-slash" />
              </div>
              <div
                role="button"
                tabIndex={-2}
                onMouseUp={onToggleMic}
                className="circle width-40 height-40 overflow-hidden hoverEnlarge transition"
              >
                <div className="blur position-absolute width-100p height-100p bg-grey-7" />
                <div className="white">
                  <i className={`fas ${isMicOn ? 'fa-microphone-slash' : 'fa-microphone'} h4`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="height-100p max-width-350">
          <InfoPanel onSendMessage={onSendMessage} messages={messages} />
        </div>
      </div>
      <InvitationModal
        onCloseInviteModal={onCloseInviteModal}
        onInviteByEmail={onInviteByEmail}
        meetingId={meetingId}
        meetingPassCode={meetingPassCode}
        showInviteModal={showInviteModal}
      />
    </>
  );
};

export default Meeting;
