import clsx from 'clsx';
import React, { useState } from 'react';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { useForm } from 'react-final-form-hooks';
import { Message } from 'lib/stores/meetingStore';
import _ from 'lodash';
import { toJS } from 'mobx';
import { TextField } from '@material-ui/core';
import ParticipantStreams from './participantStreams';
import Video from './video';
import styles from './meeting.module.scss';
import InfoPanel from './infoPanel';

// TODO: change all dependent components to using HIDE
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
// TODO: alrt to confirm leaving when pre page
// TODO: REFACTOR!!!
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
  const { form, handleSubmit } = useForm({
    onSubmit: (input) => {
      onInviteByEmail(input);
      form.change('message' as never, undefined);
    },
  });
  // TODO modal
  const onOpenInviteModal = () => setShowInviteModal(true);
  const onCloseInviteModal = () => setShowInviteModal(false);
  return (
    <>
      <div className="flex-row flex-space-evenly height-100p flex-y-start">
        <div className="flex-column pr-2 flex-70p flex-x-start flex-y-center">
          <div className="flex-row width-100p flex-space-between">
            <div className="flex-row flex-space-between">
              <div className="h3">{`Meeting initiated by ${initiatorName}`}</div>
            </div>
            <div className="flex-row flex-space-around text-center pointer" role="button" tabIndex={0} onMouseUp={onOpenInviteModal}>
              <div className="light-green h4 flex-row text-center flex-y-end flex-x-center">
                <i className="fas fa-plus-circle mr-1 m-auto" />
                Invite user
              </div>
            </div>

          </div>
          <div className="mt-2 py-2 flex-column flex-x-center flex-y-center flex-grow-1 width-100p overflow-hidden border-radius shadow p2 bg-black">
            {localStream && <Video className="border-radius overflow-hidden width-100p" stream={localStream} autoPlay muted />}
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
      <div
        className={clsx({ hide: !showInviteModal },
          'position-fixed z3 fullwidth height-100p backdrop-filter transition flex-column flex-y-center flex-x-center overflow-x-hidden')}
        role="dialog"
      />
      <div className={clsx({ hide: !showInviteModal }, 'top position-absolute z3 mt-15p width-100p height-100p')}>
        <div
          style={{
            position: 'relative',
            margin: '0 auto',
            top: '25%',
          }}
          className="bg-white max-height-350 max-width-550 p4 border-radius flex-column flex-space-around"
        >
          <div className="flex-row flex-x-end pointer" aria-label="Close" role="button" tabIndex={0} onMouseUp={onCloseInviteModal}><i className="fas fa-window-close h2" /></div>
          <div className="flex-column mt-2 flex-space-around">
            <div className="h4">Share the meeting information to joiners or invite them by email.</div>
            <div className="flex-row flex-y-center flex-x-center mt-2 fullwidth">
              <p className="mr-2 inline-block nowrap">Meeting id: </p>
              <TextField
                disabled
                fullWidth
                value={meetingId}
                variant="outlined"
                placeholder="Write your message..."
                name="message"
                size="small"
                margin="dense"
                className="inline-block"
              />
            </div>
            <div className={clsx({ hide: !meetingPassCode }, 'flex-row flex-y-center flex-x-center mt-2 fullwidth')}>
              <p className="mr-2 nowrap">Pass code: </p>
              <TextField fullWidth disabled variant="outlined" value={meetingPassCode} margin="dense" />
            </div>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
              <div className="flex-row flex-y-center flex-x-center mt-2 fullwidth">
                <div className="width-100p flex-x-center flex-y-center overflow-hidden">
                  <SingleLineFormField
                    form={form}
                    name="email"
                    type="email"
                    label="Invite by email"
                    autoFocus
                    size="small"
                    margin="dense"
                    autoComplete
                    required
                  />
                </div>
                <button type="submit" className="mt-1 ml-2 border-radius-sm square h5 bg-light-green border-light-green pale-green height-35 width-35">
                  <i className="fas fa-paper-plane h4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meeting;
