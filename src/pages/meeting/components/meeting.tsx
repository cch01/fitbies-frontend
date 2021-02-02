import clsx from 'clsx';
import React, { useState } from 'react';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { useForm } from 'react-final-form-hooks';
import { Message } from 'lib/stores/meetingStore';
import ParticipantStreams from './participantList';
import Video from './video';
import styles from './meeting.module.scss';
import ChatBox from './chatBox';

interface MeetingProps {
  localStream?: MediaStream;
  peerStreams: {[x: string]: MediaStream};
  onSendMessage: (msg: string) => void;
  messages: Message[];
}

const Meeting: React.FC<MeetingProps> = ({
  localStream, peerStreams, messages, onSendMessage,
}) => (
  <div className="flex-row flex-space-evenly height-100p">
    <div className="flex-column flex-3 px-2 flex-x-start flex-y-center">
      <div className="flex-row width-100p flex-space-between">
        <div className="flex-row flex-space-between">
          <div className="square border-radius-sm bg-grey-f width-25 height-25">
            <i className="fas fa-chevron-left" />
          </div>
          <div className="pl-2 h3">{`Meeting initiated by ${'ADMIN'}`}</div>
        </div>
        <div className="flex-row flex-space-around text-center">
          <div className="light-green h4 flex-row text-center flex-y-end flex-x-center">
            <i className="fas fa-plus-circle mr-1 m-auto" />
            Invite user
          </div>
        </div>
      </div>
      {/* TODO: put control btns at the bottom */}
      {localStream && (
        <div className="mt-2 flex-column flex-x-start overflow-hidden border-radius shadow p2 bg-black">
          <div className="object-fit-fill">
            <Video className="min-width-100p min-height-100p overflow-hidden border-radius overflow-hidden" stream={localStream} autoPlay muted />
            <div className="position-absolute bottom height-100px mb-2 z2 flex-row width-100p flex-x-center">
              <div className="circle width-40 height-40 overflow-hidden">
                <div className="blur position-absolute width-100p height-100p bg-grey-7" />
                <div className="white">
                  <i className="fas fa-video-slash h4" />
                </div>
              </div>
              <div className="square border-radius-l bg-grey-f width-55 height-55 white bg-red h3 opacity=75 mx-5">
                <i className="fas fa-phone-slash" />
              </div>
              <div className="circle width-40 height-40 overflow-hidden">
                <div className="blur position-absolute width-100p height-100p bg-grey-7" />
                <div className="white">
                  <i className="fas fa-microphone h4" />
                </div>
              </div>
            </div>
          </div>
          <ParticipantStreams peerStreams={{
            sfsd: localStream, wefdw: localStream, wefwes: localStream, '43r34': localStream, ert34: localStream,
          }}
          />
        </div>
      )}
    </div>
    <div className="height-100p px-1">
      <ChatBox onSendMessage={onSendMessage} messages={messages} />
    </div>
  </div>
);

export default Meeting;
