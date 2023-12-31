import React, { useEffect, useState } from 'react';
import { ICountdown, ICountdownResult } from '../types';

export const useCountdown = ({ initialTimeInSeconds, dependencies = []  }: ICountdown): ICountdownResult => {
  const [timeInSeconds, setTimeInSeconds] = useState<number>(initialTimeInSeconds);

  useEffect(() => {
    const intervalId = setInterval(():void => {
      setTimeInSeconds((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const minutes:number = Math.floor(timeInSeconds / 60);
  const seconds:number = timeInSeconds % 60;

  const displayMinutes:string | number = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds:string | number = seconds < 10 ? `0${seconds}` : seconds;

  return {
    displayTime: `${displayMinutes}:${displaySeconds}`,
    isExpired: timeInSeconds < 0,
  };
};