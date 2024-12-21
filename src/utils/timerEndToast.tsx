import { toast } from 'sonner';
import { Timer } from '../types/timer';
import { TimerAudio } from './audio';

export function showTimerEndToast(timer: Timer, position?: 'top-right' | 'bottom-center') {
    TimerAudio.getInstance().play().catch(console.error);

    // Show toast
    toast.success(`Timer "${timer.title}" has ended!`, {
        duration: Infinity,
        position: position ?? 'top-right',
        action: {
            label: 'Dismiss',
            onClick: () => {
                TimerAudio.getInstance().stop();
            },
        },
    });
}
