import clsx from 'clsx';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { Message, MessageType } from 'lib/stores/meetingStore';
import React, { createRef, useEffect, useState } from 'react';
import { useForm } from 'react-final-form-hooks';
import styles from './infoPanel.module.scss';
import MessageList from './messageList';

interface InfoPanelProps {
  onSendMessage: (input: any) => void;
  messages: Message[];
  [x: string]: any;
}
const InfoPanel: React.FC<InfoPanelProps> = ({ onSendMessage, messages }) => {
  const [isMessageTab, setIsMessageTab] = useState<boolean>(true);
  const { form, handleSubmit } = useForm({
    onSubmit: (input) => {
      onSendMessage(input);
      form.change('message' as never, undefined);
    },
  });
  const chatContainer = createRef<HTMLDivElement >();
  const checkInputAndSubmit = (e:React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
      e.preventDefault();
    }
  };
  const scrollDownWhenMessage = () => {
    const scroll = chatContainer.current!.scrollHeight
      - chatContainer.current!.clientHeight;
    chatContainer.current!.scrollTo(0, scroll);
  };

  useEffect(() => { scrollDownWhenMessage(); }, [messages.length]);

  return (
    <div className="flex-column bg-grey-f border-radius px-2 height-100p">
      <div className="height-60 z2">
        <div className="flex-row my-2">
          <div className={styles['panel-title']}>Group Chat</div>
          <div className="flex-2 flex-row flex-x-end">
            <button type="button" onClick={() => setIsMessageTab(true)} className={clsx('btn-pale-green ', { disabled: !isMessageTab })}>Messages</button>
            <button type="button" onClick={() => setIsMessageTab(false)} className={clsx('btn-pale-green ml-3 ', { disabled: isMessageTab })}>Participants</button>
          </div>
        </div>
      </div>
      {isMessageTab && (
      <>
        <div className="overflow-scroll width-100p height-100p transition" ref={chatContainer}>
          <MessageList messages={messages} />
        </div>
        <div className="border-radius height-60 mb-2 z2">
          <form onSubmit={handleSubmit} className="height-60 width-100p border-radius flex-row flex-x-center flex-y-center bg-white shadow overflow-hidden">
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
                onKeyPress={checkInputAndSubmit}
              />
            </div>
            <button type="submit" className="ml-2 border-radius-sm square h5 bg-light-green border-light-green pale-green height-35 width-35">
              <i className="fas fa-paper-plane h4" />
            </button>
          </form>
        </div>
      </>
      )}
    </div>
  );
};

export default InfoPanel;
