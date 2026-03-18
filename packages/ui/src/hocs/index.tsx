import { UIProvider } from '@/providers';

export const withUIProvider = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    return (
      <UIProvider>
        <Component {...props} />
      </UIProvider>
    );
  };
};
