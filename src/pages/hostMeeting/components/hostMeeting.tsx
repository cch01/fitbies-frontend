import { Button } from '@material-ui/core';
import SingleLineRadioFormField from 'components/forms/SignleLineRadioFormField';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useForm } from 'react-final-form-hooks';

export interface HostMeetingInput {
  selfMuted: boolean;
  selfVideoOff: boolean;
  meetingVideoOff: boolean;
  meetingMuted: boolean;
  passCode?: string;

}

const HostMeeting: React.FC<{onHostMeeting: (input: HostMeetingInput) => void}> = observer(({ onHostMeeting }) => {
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onHostMeeting,
    initialValues: {
      meetingVideoOff: false,
      meetingMuted: false,
      selfVideoOff: false,
      selfMuted: false,
    },
  });
  return (
    <div className="flex-column flex-x-center flex-y-center ">
      <div className="h1 text-center max-width-100p py-5">
        Host a meeting
      </div>
      <form noValidate onSubmit={handleSubmit} className="px-3 py-3 min-width-450">
        <SingleLineFormField
          form={form}
          variant="outlined"
          margin="normal"
          fullWidth
          name="passCode"
          label="Pass Code (optional)"
        />
        <fieldset className="border border-radius-sm p2">
          <legend className="h4">Meeting Settings</legend>
          <SingleLineRadioFormField
            label="Disable Webcam"
            form={form}
            name="meetingVideoOff"
          />
          <SingleLineRadioFormField
            label="Muted"
            form={form}
            name="meetingMuted"
          />
        </fieldset>
        <fieldset className="border border-radius-sm p2 mt-2">
          <legend className="h4">Self Media Settings</legend>
          <SingleLineRadioFormField
            label="Disable Webcam"
            form={form}
            name="selfVideoOff"
          />
          <SingleLineRadioFormField
            label="Muted"
            form={form}
            name="selfMuted"
          />
        </fieldset>
        <Button
          type="submit"
          style={{ marginTop: 20 }}
          fullWidth
          variant="contained"
          color="primary"
        >
          Host
        </Button>
      </form>
    </div>
  );
});

export default HostMeeting;
