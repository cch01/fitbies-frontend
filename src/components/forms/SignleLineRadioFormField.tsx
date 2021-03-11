import React, { ChangeEvent } from 'react';
import { Switch, withStyles } from '@material-ui/core';
import { FormRenderProps, useField, useForm } from 'react-final-form-hooks';
import * as _ from 'lodash';
import { FormApi } from 'final-form';
import { blue } from '@material-ui/core/colors';

export interface SingleLineRadioFormFieldProps {
  form: FormApi<any, any>;
  name: string;
  label: string;
  defaultValue?: boolean;
  hidden?: boolean;
  onChange?: (event: any) => void;
  [x:string]: any;
}

const BlueSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: blue[700],
    },
    '&$checked + $track': {
      backgroundColor: blue[700],
    },
  },
  checked: {},
  track: {},
})(Switch);

const SingleLineRadioFormField:React.FC<SingleLineRadioFormFieldProps> = ({
  defaultValue = false, form, name, label, hidden, onChange, ...props
}: SingleLineRadioFormFieldProps) => {
  const field = useField(name, form);
  const _onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (_.isFunction(onChange)) onChange(event);
    field.input.onChange(event);
  };

  if (hidden) {
    return null;
  }

  return (
    <div {...props} className="flex-row flex-space-between">
      <div className="h4">{`${label}: `}</div>
      <BlueSwitch
        {...field.input}
        onChange={_onChange}
        value={field.input.value || false}
        size="medium"
      />
    </div>
  );
};

export default SingleLineRadioFormField;
