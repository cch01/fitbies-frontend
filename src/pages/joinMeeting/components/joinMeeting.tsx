import { Button } from '@material-ui/core';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useForm } from 'react-final-form-hooks';

export interface JoinRoomInput {
  meetingId: string;
  passCode?: string | null;
}

const JoinMeeting: React.FC<{onJoinMeeting: (input: JoinRoomInput) => void}> = observer(({ onJoinMeeting }) => {
  const { form, handleSubmit, submitting } = useForm({ onSubmit: onJoinMeeting });

  return (
    <div className="flex-column flex-x-center flex-y-center ">
      <div className="h1 text-center max-width-100p py-5">
        Join a meeting
      </div>
      <form onSubmit={handleSubmit} className="px-3 py-3 max-width-450">
        <SingleLineFormField
          form={form}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Meeting ID"
          name="meetingId"
          autoFocus
        />
        <SingleLineFormField
          form={form}
          variant="outlined"
          margin="normal"
          fullWidth
          name="passCode"
          label="Pass Code (if any)"
        />
        <Button
          type="submit"
          style={{ marginTop: 20 }}
          fullWidth
          variant="contained"
          color="primary"
        >
          Join
        </Button>
      </form>
    </div>
  );
});

export default JoinMeeting;
