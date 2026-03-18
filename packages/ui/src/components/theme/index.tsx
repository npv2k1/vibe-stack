import { ThemeProps } from '../types';

export const theme: ThemeProps = {
  Button: {
    default: {
      className:
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-medium shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
    },
    variant: {
      primary: {
        className: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500/50',
      },
      secondary: {
        className:
          'border-slate-200 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300/70',
      },
      ghost: {
        className: 'bg-transparent text-slate-700 shadow-none hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-300/60',
      },
      danger: {
        className: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/50',
      },
      success: {
        className: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500/50',
      },
    },
  },
};
