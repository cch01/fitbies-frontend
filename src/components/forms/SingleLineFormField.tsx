import React, { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { FormRenderProps, useField, useForm } from 'react-final-form-hooks';
import * as _ from 'lodash';
import { FormApi } from 'final-form';

export interface SingleLineFormFieldProps {
  form: FormApi<any, any>;
  name: string;
  label?: string;
  margin?: 'normal' | 'none' | 'dense' | undefined;
  type?: any;
  hidden?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  onChange?: (event: any) => void;
  [x:string]: any;
}

const SingleLineFormField:React.FC<SingleLineFormFieldProps> = ({
  form, name, label, margin = 'normal', type = 'text', hidden, onChange, variant = 'outlined', ...props
}: SingleLineFormFieldProps) => {
  const field = useField(name, form);
  const _onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (_.isFunction(onChange)) onChange(event);
    if (type === 'number') {
      if (event.target.value === '' || _.isNil(event.target.value)) return field.input.onChange('');

      return field.input.onChange(Number(event.target.value));
    }
    field.input.onChange(event);
    return undefined;
  };

  if (hidden) {
    return null;
  }

  return (
    <TextField
      {...field.input}
      onChange={_onChange}
      value={field.input.value || ''}
      margin={margin}
      label={label}
      fullWidth
      type={type}
      size="small"
      variant={variant}
      error={!!field.meta.touched && !!field.meta.error}
      helperText={(field.meta.touched) ? field.meta.error : null}
      {...props}
    />
  );
};

export default SingleLineFormField;
