import { TextField } from '@material-ui/core';
import clsx from 'clsx';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import React from 'react';
import { useForm } from 'react-final-form-hooks';

interface InvitationModalProps {
  onCloseInviteModal(): void;
  onInviteByEmail(input: any): void;
  showInviteModal: boolean;
  meetingId: string;
  meetingPassCode?: string;
}

const InvitationModal: React.FC<InvitationModalProps> = ({
  meetingPassCode, meetingId, onCloseInviteModal, onInviteByEmail, showInviteModal,
}) => {
  const { form, handleSubmit } = useForm({
    onSubmit: (input) => {
      onInviteByEmail(input);
      form.change('message' as never, undefined);
    },
  });
  return (
    <>
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
              <TextField fullWidth disabled variant="outlined" value={meetingPassCode || ''} margin="dense" />
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
                    autoComplete="email"
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

export default InvitationModal;
