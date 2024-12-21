import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (
  data: TimerFormData,
  screenType: 'desktop' | 'mobile'
): boolean => {
  const { title, hours, minutes, seconds } = data;

  const showError = (message: string) => {
    toast.error(message, {
      position: screenType === 'desktop' ? 'top-right' : 'bottom-center',
      action: {
        label: 'Close',
        onClick: () => toast.dismiss(),
      },
    });
  };

  if (!title.trim()) {
    showError('Title is required');
    return false;
  }

  if (title.length > 50) {
    showError('Title must be less than 50 characters');
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    showError('Time values cannot be negative');
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    showError('Minutes and seconds must be between 0 and 59');
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    showError('Please set a time greater than 0');
    return false;
  }

  if (totalSeconds > 86400) {
    showError('Timer cannot exceed 24 hours');
    return false;
  }

  return true;
};