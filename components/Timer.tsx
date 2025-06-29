"use client"
import React from 'react'
import { useState, useEffect } from 'react'

// Timer component
const Timer = () => {
    // State for input time (string or null)
    const [Time, setTime] = useState<(null | string)>(null)
    // State for seconds left
    const [seconds, setSeconds] = useState(0)
    // State to track if timer is running
    const [isRunning, setIsRunning] = useState(false)
    // State for audio volume
    const [volume, setVolume] = useState(0)

    // Helper to format seconds as mm:ss
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Start or pause the timer
    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true)
            if (Time) {
                // Parse input as mm:ss or seconds
                const timeParts = Time.split(':').map(part => parseInt(part, 10));
                if (timeParts.length === 2) {
                    setSeconds(timeParts[0] * 60 + timeParts[1]);
                } else {
                    setSeconds(parseInt(Time, 10));
                }
            } else {
                setSeconds(0);
            }
        } else {
            setIsRunning(false)
        }
    }

    // Play notification sound
    const playAudio = () => {
        const audio = new Audio('/audio/notification.mp3');
        audio.play().catch(error => console.error('Error playing audio:', error));
        audio.volume = volume; // Set the volume from state
    }

    // Load volume from localStorage on mount
    useEffect(() => {
        const storedVolume = localStorage.getItem('timerVolume');
        if (storedVolume) {
            const parsedVolume = parseFloat(storedVolume);
            setVolume(parsedVolume);
            (window as any).__timerVolume = parsedVolume;
        } else {
            setVolume(1); // Default volume
            (window as any).__timerVolume = 1;
        }
    }, []);

    // Save volume to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('timerVolume', String(volume));
        (window as any).__timerVolume = volume;
    }, [volume]);

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && seconds !== null) {
            // Decrement seconds every second
            interval = setInterval(() => {
                setSeconds(prev => (prev > 0 ? prev - 1 : 0));
                setTime(formatTime(seconds > 0 ? seconds - 1 : 0));
            }, 1000);
        }
        // When timer reaches zero, stop and play sound
        if (seconds === 0 && isRunning) {
            setIsRunning(false);
            playAudio();
            setTime('00:00');
        }

        // Cleanup interval on unmount or dependency change
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, seconds]);

    return (
        <div className='flex flex-col items-center justify-center'>
            {/* Time input */}
            <input
                placeholder='00:00'
                disabled={isRunning}
                className='text-7xl text-center font-bold focus:outline-none'
                type="text"
                value={Time ?? ''}
                onChange={(e) => setTime(e.target.value)}
            />
            {/* Start/Pause button */}
            <button
                className='mt-4 cursor-pointer rounded px-4 py-2 text-white'
                onClick={handleStart}
            >
                {isRunning ? 'Pause Timer' : 'Start Timer'}
            </button>
            {/* Volume control */}
            <div className="mt-4 flex fixed bottom-0 mb-5 items-center gap-2">
                <label htmlFor="volume" className="text-lg">Volume</label>
                <input
                    id="volume"
                    type="range"
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={e => {
                        const volume = parseFloat(e.target.value);
                        setVolume(volume);
                    }}
                    className="w-32 accent-stone-600"
                />
            </div>
        </div>
    )
}

export default Timer