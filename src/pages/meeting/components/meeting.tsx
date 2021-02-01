import clsx from 'clsx';
import React, { useState } from 'react';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { useForm } from 'react-final-form-hooks';
import { Message } from 'lib/stores/meetingStore';
import ParticipantList from './participantList';
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
          <div className="square border-radius-sm bg-grey-f width-25 height-25">{' < '}</div>
          <div className="pl-2 h3">{`Meeting initiated by ${'ADMIN'}`}</div>
        </div>
        <div className="flex-row flex-space-around">
          <div className="border-radius square h4 bg-light-green border-light-green pale-green width-25 height-25">+</div>
          <div className="pl-2 light-green h4 flex-row flex-y-center flex-x-center">Invite user</div>
        </div>
      </div>

      {localStream && (
        <div className="width-100p height-100p mt-2 bg-contain flex-row flex-x-center flex-y-center overflow-hidden">
          <Video className="width-100p height-100p border-radius m1" stream={localStream} autoPlay muted />
        </div>
      )}
    </div>
    <div>
      <ParticipantList peerStreams={peerStreams} />
    </div>
    <div className="flex-2 height-100p px-1">
      <ChatBox className="height-100p px-1 flex-2" onSendMessage={onSendMessage} messages={messages} />
    </div>
  </div>
);

export default Meeting;
