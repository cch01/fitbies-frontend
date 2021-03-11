import { Button } from '@material-ui/core';
import SingleLineRadioFormField from 'components/forms/SignleLineRadioFormField';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useForm } from 'react-final-form-hooks';

export interface JoinMeetingInput {
  meetingId: string;
  videoOff: boolean;
  muted: boolean;
  passCode?: string | null;
}

export interface JoinMeetingProps {
  onJoinMeeting: (input: JoinMeetingInput) => void;
  meetingId?: string;
  passCode?: string;
}

const JoinMeeting: React.FC<JoinMeetingProps> = observer(({ onJoinMeeting, meetingId, passCode }) => {
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onJoinMeeting,
    initialValues: {
      meetingId, passCode, videoOff: false, muted: false,
    },
  });

  return (
    <div className="flex-column flex-x-center flex-y-center ">
      <div className="h1 text-center max-width-100p py-5">
        Join a meeting
      </div>
      <form onSubmit={handleSubmit} className="px-3 py-2 max-width-450">
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
        <fieldset className="border border-radius-sm p2 mt-2">
          <legend className="h4">Media Settings</legend>
          <SingleLineRadioFormField
            label="Share Webcam"
            form={form}
            name="videoOff"
          />
          <SingleLineRadioFormField
            label="Share Microphone"
            form={form}
            name="muted"
          />
        </fieldset>
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
