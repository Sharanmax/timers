// validateTimerForm.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTimerForm, TimerFormData } from './validation';
import { toast } from 'sonner';

// 1) Mock the Sonner toast so we can inspect calls
vi.mock('sonner', () => {
  return {
    toast: {
      error: vi.fn(),
      dismiss: vi.fn(),
    },
  };
});

describe('validateTimerForm', () => {
  const toastError = toast.error as unknown as ReturnType<typeof vi.fn>;

  // Resets mock calls before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false and shows error if title is empty', () => {
    const data: TimerFormData = {
      title: '',
      description: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'desktop');
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Title is required', {
      position: 'top-right',
      action: {
        label: 'Close',
        onClick: expect.any(Function),
      },
    });
  });

  it('returns false and shows error if title is over 50 characters', () => {
    const data: TimerFormData = {
      title: 'A'.repeat(51), // 51 chars
      description: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'mobile');
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Title must be less than 50 characters', {
      position: 'bottom-center',
      action: {
        label: 'Close',
        onClick: expect.any(Function),
      },
    });
  });

  it('returns false if time values are negative', () => {
    const data: TimerFormData = {
      title: 'Hello',
      description: '',
      hours: -1,
      minutes: 0,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'desktop');
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Time values cannot be negative', {
      position: 'top-right',
      action: {
        label: 'Close',
        onClick: expect.any(Function),
      },
    });
  });

  it('returns false if minutes or seconds exceed 59', () => {
    const data: TimerFormData = {
      title: 'Hello',
      description: '',
      hours: 0,
      minutes: 60,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'mobile');
    expect(result).toBe(false);
    // Note the 'bottom-center' position for 'mobile'
    expect(toastError).toHaveBeenCalledWith(
      'Minutes and seconds must be between 0 and 59',
      {
        position: 'bottom-center',
        action: {
          label: 'Close',
          onClick: expect.any(Function),
        },
      }
    );
  });

  it('returns false if total time is 0', () => {
    const data: TimerFormData = {
      title: 'Hello',
      description: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'desktop');
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Please set a time greater than 0', {
      position: 'top-right',
      action: {
        label: 'Close',
        onClick: expect.any(Function),
      },
    });
  });

  it('returns false if total time exceeds 24 hours', () => {
    const data: TimerFormData = {
      title: 'Hello',
      description: '',
      hours: 25, 
      minutes: 0,
      seconds: 0,
    };

    const result = validateTimerForm(data, 'desktop');
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Timer cannot exceed 24 hours', {
      position: 'top-right',
      action: {
        label: 'Close',
        onClick: expect.any(Function),
      },
    });
  });

  it('returns true and does not call toast if inputs are valid', () => {
    const data: TimerFormData = {
      title: 'Valid Title',
      description: 'Optional desc',
      hours: 1,
      minutes: 30,
      seconds: 15,
    };

    const result = validateTimerForm(data, 'mobile');
    expect(result).toBe(true);
    // toast.error should NOT have been called
    expect(toastError).not.toHaveBeenCalled();
  });
});