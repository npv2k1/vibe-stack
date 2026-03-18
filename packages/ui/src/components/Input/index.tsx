import { TextInput } from './TextInput';

export * from './Input.type';
export * from './TextInput';
export * from './NumberInput';
export * from './SelectInput';
export * from './CheckBoxInput';
export * from './RadioInput';
export * from './SwitchInput';
export * from './FileInput';
export * from './DateInput';
export * from './DateRangeInput';
export * from './MonthYearInput';
export * from './DateTimeInput';
export * from './PasswordInput';
export * from './Codemirror';
export * from './AvatarInput';
export * from './CodeInput';
export * from './MarkdownEditor';

export const Input = ({ ...props }) => {
  return <TextInput {...props} />;
};
