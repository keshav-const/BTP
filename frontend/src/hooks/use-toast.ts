import { useUiStore } from '@/store';

export const useToast = () => {
  const { toasts, addToast, removeToast, clearToasts } = useUiStore();

  return {
    toasts,
    success: (message: string, duration = 3000) =>
      addToast({ type: 'success', message, duration }),
    error: (message: string, duration = 4000) =>
      addToast({ type: 'error', message, duration }),
    info: (message: string, duration = 3000) =>
      addToast({ type: 'info', message, duration }),
    warning: (message: string, duration = 3500) =>
      addToast({ type: 'warning', message, duration }),
    remove: removeToast,
    clear: clearToasts,
  };
};
