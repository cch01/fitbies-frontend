import { Button } from '@material-ui/core';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useForm } from 'react-final-form-hooks';

export interface CreateMeetingInput {
  passCode?: string;
}

const CreateMeeting: React.FC<{onCreateMeeting: (input: CreateMeetingInput) => void}> = observer(({ onCreateMeeting }) => {
  const { form, handleSubmit, submitting } = useForm({ onSubmit: onCreateMeeting });
  return (
    <div className="flex-column flex-x-center flex-y-center ">
      <div className="h1 text-center max-width-100p py-5">
        Host a meeting
      </div>
      <form noValidate onSubmit={handleSubmit} className="px-3 py-3 max-width-450">
        <SingleLineFormField
          form={form}
          variant="outlined"
          margin="normal"
          fullWidth
          name="passCode"
          label="Pass Code (optional)"
        />
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

export default CreateMeeting;
