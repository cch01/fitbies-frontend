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
    <div className="flex-column flex-5 px-2 flex-x-center flex-y-center">
      <div className="flex-row width-100p flex-space-between px-1">
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

      {localStream && (
        <div className="width-100p mt-2 bg-contain flex-column flex-x-start overflow-hidden flex-space-evenly">
          <Video className="min-width-100p min-height-100p width-auto height-auto border-radius overflow-hidden" stream={localStream} autoPlay muted />
          <ParticipantStreams peerStreams={peerStreams} />
        </div>
      )}
    </div>
    <div className="flex-2 height-100p px-1">
      <ChatBox className="height-100p px-1 flex-2" onSendMessage={onSendMessage} messages={messages} />
    </div>
  </div>
);

export default Meeting;
