import { Card, Form, FormSchema, FormType } from '@/components';

export type FormValue = {
  username: string;
  password: string;
};

export type LoginFormProps = {
  onLogin?: (values: FormValue) => Promise<void>;
};

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  return (
    <Card>
      <FormSchema<FormValue>
        layout="vertical"
        onSubmit={async (values) => {
          await onLogin?.(values);
        }}
        config={[
          {
            name: 'username',
            label: 'Username',
            type: FormType.Text,
          },
          {
            name: 'password',
            label: 'password',
            type: FormType.Password,
          },
        ]}
      ></FormSchema>
    </Card>
  );
};
