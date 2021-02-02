import clsx from 'clsx';
import { Message, MessageType } from 'lib/stores/meetingStore';
import React, { useState } from 'react';
import randomColor from 'randomcolor';
import styles from './messageList.module.scss';

interface MessageListProps {
  messages: Message[];
}
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  const assignColor = (msg: Message):void => {
    if (userColors[`${msg.senderId}`] || msg.type === MessageType.SYSTEM) return;
    setUserColors((val) => ({ ...val, [`${msg.senderId}`]: randomColor() }));
  };

  const messageList = messages.map((msg) => {
    assignColor(msg);
    if (msg.type === MessageType.SYSTEM) {
      return <SystemMessage message={msg} />;
    }
    if (msg.type === MessageType.SELF_CHAT) {
      return <SelfMessage iconColor={userColors[`${msg.senderId}`]} message={msg} />;
    }
    return <TeamMessage iconColor={userColors[`${msg.senderId}`]} message={msg} />;
  });

  return (
    <div className="flex-column flex-y-start noscrollbar">
      {messageList}
    </div>
  );
};
export default MessageList;

const SelfMessage: React.FC<{message: Message, iconColor: string}> = ({ message, iconColor }) => (
  <div className="flex-column flex-y-end width-100p">
    <div className="span black text-middle text-left mr-3">You</div>
    <div className={clsx(styles['chat-bubble'], styles['self-msg'])}>
      {message.content}
    </div>
  </div>
);

const TeamMessage: React.FC<{message: Message, iconColor: string}> = ({ message, iconColor }) => (
  <div className="flex-row width-100p">
    <div className="flex-column flex-x-start" style={{ marginTop: 60 }}>
      <div className="circle width-30 height-30 self-flex-y-end " style={{ backgroundColor: iconColor }}>
        <div className="h2" style={{ fontWeight: 700 }}>{message.nickname!.charAt(0).toUpperCase()}</div>
      </div>
    </div>
    <div className="flex-column flex-x-start width-100p">
      <div className="span black text-middle text-left">{message.nickname}</div>
      <div className={clsx(styles['chat-bubble'], styles['team-msg'])}>
        <div className="mt-1">{message.content}</div>
      </div>
    </div>
  </div>
);

const SystemMessage: React.FC<{message: Message}> = ({ message }) => <div className={styles['system-msg']}>{message.content}</div>;
