import validator from 'validator';
import _ from 'lodash';

export const isNumber = (msg?: string) => (value: any) => ((Number.isNaN(value)) ? (msg) || 'Must be a number' : null);

export const isPercentage = (msg?: string) => (value: any) => (typeof value !== 'number' || value < 0 || value > 100 ? (msg) || 'Must be in range 0 - 100%' : null);

export const isTel = (msg?: string) => (value: any) => ((!/^[23456789][0-9]{7}$/g.test(value)) ? (msg) || 'Must be a phone number' : null);

export const isEmail = (msg?: string) => (value: any) => ((!validator.isEmail(value)) ? (msg) || 'Must be email' : null);

export const isRequired = (msg?: string) => (value: any) => {
  if (typeof value === 'boolean') return null;
  if (typeof value === 'number') return null;
  return !value ? (msg) || 'Required' : null;
};

export const isBoolean = (msg?: string) => (value: any) => {
  if (typeof value === 'boolean') return null;
  return (msg) || 'should be a boolean';
};

export const isFirstElementEmpty = (msg?: string) => (value: any) => ((!_.get(value, '[0]')) ? (msg) ? [msg] : ['Required'] : null);

export const isSameAs = (target: any, msg?: string) => (value: any) => (target !== value ? msg || 'Not match new password' : null);

export const isRegexValid = (regex: RegExp, msg?: string) => (value: any) => {
  if (_.isEmpty(value)) return null;
  return !regex.test(value) ? (msg) || ['Input is not valid'] : null;
};
export default (data: Record<any, any>, rules: Record<any, any>) => {
  const validationResultArray = Object.keys(rules).map((_field) => rules[_field].reduce((acc: any, fn: any) => {
    if (acc.value) {
      return acc;
    }
    return {
      key: _field,
      value: fn(data[_field]),
    };
  }, {
    key: null,
    value: null,
  }));
  const validationResultObject = validationResultArray.reduce((acc, _result) => {
    if (_result.value) {
      acc[_result.key] = _result.value;
    }
    return acc;
  }, {});
  return validationResultObject;
};
