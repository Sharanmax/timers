import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { Timer } from '../types/timer';
import { useTimerStore } from '../store/useTimerStore';
import { validateTimerForm } from '../utils/validation';
import { useScreenType } from '../hooks/screenType';

interface TimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    /**
     * If present, we are editing this existing timer.
     * If omitted or null, we are adding a new timer.
     */
    timer?: Timer | null;
}

export const TimerModal: React.FC<TimerModalProps> = ({
    isOpen,
    onClose,
    timer,
}) => {
    const isEditMode = !!timer;

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [touched, setTouched] = useState({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
    });

    const screenType = useScreenType();
    const { addTimer, editTimer } = useTimerStore();

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && timer) {
                setTitle(timer.title);
                setDescription(timer.description);

                const h = Math.floor(timer.duration / 3600);
                const m = Math.floor((timer.duration % 3600) / 60);
                const s = timer.duration % 60;

                setHours(h);
                setMinutes(m);
                setSeconds(s);
            } else {
                // Adding a new timer - reset fields
                setTitle('');
                setDescription('');
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            }

            // Reset touched states each time we open
            setTouched({
                title: false,
                hours: false,
                minutes: false,
                seconds: false,
            });
        }
    }, [isOpen, isEditMode, timer]);

    // If modal is not open, don’t render anything
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate input
        if (!validateTimerForm({ title, description, hours, minutes, seconds }, screenType)) {
            return;
        }

        // If valid, calculate total seconds
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (isEditMode && timer) {
            // Editing existing timer
            editTimer(timer.id, {
                title: title.trim(),
                description: description.trim(),
                duration: totalSeconds,
                remainingTime: totalSeconds, // optionally reset
                isRunning: false,            // optionally reset
            });
        } else {
            // Adding a brand-new timer
            addTimer({
                title: title.trim(),
                description: description.trim(),
                duration: totalSeconds,
                remainingTime: totalSeconds,
                isRunning: false,
            });
        }

        // Close the modal
        onClose();
    };

    const handleClose = () => {
        onClose();
        // Optionally reset touched here if desired
        setTouched({
            title: false,
            hours: false,
            minutes: false,
            seconds: false,
        });
    };

    // For dynamic styling & messages
    const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
    const isTitleValid = title.trim().length > 0 && title.length <= 50;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">
                            {isEditMode ? 'Edit Timer' : 'Add New Timer'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setTouched({ ...touched, title: true })}
                            maxLength={50}
                            // Uniform input styles
                            className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-50${touched.title && !isTitleValid
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                }`}
                            placeholder="Enter timer title"
                        />
                        {touched.title && !isTitleValid && (
                            <p className="mt-1 text-sm text-red-500">
                                Title is required and must be &le; 50 characters
                            </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {title.length}/50 characters
                        </p>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-smfocus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter timer description (optional)"
                        />
                    </div>

                    {/* Duration (Hours / Minutes / Seconds) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Hours */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Hours</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={hours}
                                    onChange={(e) =>
                                        setHours(Math.min(23, parseInt(e.target.value) || 0))
                                    }
                                    onBlur={() => setTouched({ ...touched, hours: true })}
                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearw-full px-3 py-2 border border-gray-300 rounded-md shadow-smfocus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {/* Minutes */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) =>
                                        setMinutes(Math.min(59, parseInt(e.target.value) || 0))
                                    }
                                    onBlur={() => setTouched({ ...touched, minutes: true })}
                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appeaw-full px-3 py-2 border border-gray-300 rounded-md shadow-smfocus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {/* Seconds */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={seconds}
                                    onChange={(e) =>
                                        setSeconds(Math.min(59, parseInt(e.target.value) || 0))
                                    }
                                    onBlur={() => setTouched({ ...touched, seconds: true })}
                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-smfocus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {touched.hours && touched.minutes && touched.seconds && !isTimeValid && (
                            <p className="mt-2 text-sm text-red-500">
                                Please set a duration greater than 0
                            </p>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-700"
                        >
                            {isEditMode ? 'Save Changes' : 'Add Timer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
