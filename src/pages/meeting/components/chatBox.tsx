import SingleLineFormField from 'components/forms/SingleLineFormField';
import { Message, MessageType } from 'lib/stores/meetingStore';
import React, { useState } from 'react';
import { useForm } from 'react-final-form-hooks';
import styles from './chatBox.module.scss';
import MessageList from './messageList';

interface chatBoxProps {
  onSendMessage: (input: any) => void;
  messages: Message[];
  [x: string]: any;
}
const chatBox: React.FC<chatBoxProps> = ({ onSendMessage, messages }) => {
  const [isMessageTab, setIsMessageTab] = useState<boolean>(true);
  const { form, handleSubmit } = useForm({
    onSubmit: (input) => {
      onSendMessage(input);
      form.change('message' as never, undefined);
    },
  });

  const msgs:Message[] = [
    {
      content: 'hihi', senderId: '1234', nickname: 'Terry', sentAt: new Date(), type: MessageType.SELF_CHAT,
    },
    {
      content: 'you ar good boy', senderId: '12345', nickname: 'Leo', sentAt: new Date(), type: MessageType.TEAM_CHAT,
    },
    {
      content: 'System hihi', senderId: '1231234', sentAt: new Date(), type: MessageType.SYSTEM,
    },
    {
      content: 'you ar good boy', senderId: '12345', nickname: 'Leo', sentAt: new Date(), type: MessageType.TEAM_CHAT,
    },
    {
      content: 'you ar  dyhntyuktdyhdrthytr hihisdfgsdfgvsdfvsr evservservedyfnryujmrtdyhntyuktdyhdrthytr  od boy', senderId: '12345', nickname: 'Leo', sentAt: new Date(), type: MessageType.TEAM_CHAT,
    },
    {
      content: 'dfgj sergf stdh sdg sdrg serg serg rseg ', senderId: '1231234', sentAt: new Date(), type: MessageType.SYSTEM,
    },
    {
      content: 'System  herthertyhj erth erth erth erth dgfbdfhjg drtj dfth jfydgj dtyh ndfkjdrtyh rstdh drth rthgdtfrsderfvsdfvsdrfvsdf', senderId: '1231234', sentAt: new Date(), type: MessageType.SYSTEM,
    },
    {
      content: 'sdvcs sedf sdf sdf sd', senderId: '1234', nickname: 'Terry', sentAt: new Date(), type: MessageType.SELF_CHAT,
    },
    {
      content: 'hihsdfvsdergbsrtghdsi', senderId: '1234', nickname: 'Terry', sentAt: new Date(), type: MessageType.SELF_CHAT,
    },
    {
      content: 'hihi', senderId: '1234', nickname: 'Terry', sentAt: new Date(), type: MessageType.SELF_CHAT,
    },
  ];
  // TODO: some blur effect on top, chat bubbles
  return (
  // styles['chat-main-container']
    <div className="flex-column bg-grey-f border-radius px-2 height-100p">
      <div className="height-60 flex-1 z2">
        <div className="flex-row my-2">
          <div className={styles['panel-title']}>Group Chat</div>
          <div className="flex-2 flex-row flex-x-end">
            <button type="button" onMouseUp={() => setIsMessageTab(true)} className="btn-pale-green" disabled={!isMessageTab}>Messages</button>
            <button type="button" onMouseUp={() => setIsMessageTab(false)} className="btn-pale-green ml-3" disabled={isMessageTab}>Participants</button>
          </div>
        </div>
      </div>
      <div className="overflow-scroll position-absolute height-100p width-100p"><MessageList messages={messages} /></div>
      <div className="flex-1 border-radius height-60 mb-2 z2">
        <form onSubmit={handleSubmit} className="width-100p border-radius flex-row flex-x-center flex-y-center bg-white shadow overflow-hidden">
          <div className="width-80p flex-x-center flex-y-center overflow-scroll">
            <SingleLineFormField
              form={form}
              multiline
              rows={2}
              variant="filled"
              placeholder="Write your message..."
              name="message"
              autoFocus
              size="medium"
              margin="none"
              InputProps={{
                style: {
                  backgroundColor: 'white',
                },
                disableUnderline: true,
              }}
            />
          </div>
          <button type="submit" className="ml-2 border-radius-sm square h5 bg-light-green border-light-green pale-green height-35 width-35">
            <i className="fas fa-paper-plane h4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default chatBox;
