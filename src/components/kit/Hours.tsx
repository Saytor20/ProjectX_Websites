/**
 * Hours Component
 * 
 * Displays restaurant operating hours with timezone support.
 * Shows current status (open/closed) and handles multiple time slots per day.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HoursProps, OpeningHours, TimeSlot } from './types';

export const Hours: React.FC<HoursProps> = ({
  hours,
  timezone,
  variant = 'detailed',
  showTimezone = false,
  className = '',
  'data-testid': testId = 'hours',
  locale = 'en',
  direction = 'ltr',
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [nextChange, setNextChange] = useState<{ time: string; action: string } | null>(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Day names in different locales
  const dayNames = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  };

  const dayKeys: (keyof OpeningHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Convert time string to minutes since midnight
  const timeToMinutes = useCallback((timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  // Convert minutes to time string
  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  // Format time for display
  const formatTime = useCallback((timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (locale === 'ar') {
      // Arabic 24-hour format
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      // English 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }, [locale]);

  // Check if restaurant is currently open
  const checkOpenStatus = useCallback(() => {
    const now = new Date();
    const currentDay = dayKeys[now.getDay()];
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    const todayHours = hours[currentDay];
    if (!todayHours || todayHours.length === 0) {
      setIsOpen(false);
      setNextChange(null);
      return;
    }

    // Check if currently within any time slot
    let currentlyOpen = false;
    let nextOpenTime: number | null = null;
    let nextCloseTime: number | null = null;

    for (const slot of todayHours) {
      const openTime = timeToMinutes(slot.open);
      const closeTime = timeToMinutes(slot.close);
      
      if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
        currentlyOpen = true;
        nextCloseTime = closeTime;
        break;
      } else if (currentTimeInMinutes < openTime) {
        if (nextOpenTime === null || openTime < nextOpenTime) {
          nextOpenTime = openTime;
        }
      }
    }

    setIsOpen(currentlyOpen);

    // Set next change information
    if (currentlyOpen && nextCloseTime !== null) {
      setNextChange({
        time: formatTime(minutesToTime(nextCloseTime)),
        action: locale === 'ar' ? 'يغلق في' : 'Closes at',
      });
    } else if (!currentlyOpen && nextOpenTime !== null) {
      setNextChange({
        time: formatTime(minutesToTime(nextOpenTime)),
        action: locale === 'ar' ? 'يفتح في' : 'Opens at',
      });
    } else if (!currentlyOpen) {
      // Check tomorrow's hours
      const tomorrowDay = dayKeys[(now.getDay() + 1) % 7];
      const tomorrowHours = hours[tomorrowDay];
      if (tomorrowHours && tomorrowHours.length > 0) {
        setNextChange({
          time: formatTime(tomorrowHours[0].open),
          action: locale === 'ar' ? 'يفتح غداً في' : 'Opens tomorrow at',
        });
      } else {
        setNextChange(null);
      }
    }
  }, [hours, timeToMinutes, minutesToTime, formatTime, locale]);

  useEffect(() => {
    checkOpenStatus();
  }, [currentTime, checkOpenStatus]);

  const renderTimeSlots = useCallback((slots: TimeSlot[]) => {
    if (!slots.length) {
      return <span className="hours__closed">{locale === 'ar' ? 'مغلق' : 'Closed'}</span>;
    }

    return (
      <div className="hours__slots">
        {slots.map((slot, index) => (
          <span key={index} className="hours__slot">
            {formatTime(slot.open)} - {formatTime(slot.close)}
          </span>
        ))}
      </div>
    );
  }, [formatTime, locale]);

  const hoursClasses = [
    'hours',
    `hours--${variant}`,
    `hours--${direction}`,
    isOpen ? 'hours--open' : 'hours--closed',
    className,
  ].filter(Boolean).join(' ');

  // Today-only variant
  if (variant === 'today-only') {
    const today = dayKeys[currentTime.getDay()];
    const todayHours = hours[today];
    const todayName = dayNames[locale][currentTime.getDay()];

    return (
      <div 
        className={hoursClasses}
        data-testid={testId}
        dir={direction}
      >
        <div className="hours__today">
          <div className="hours__status">
            <span className={`hours__status-indicator ${isOpen ? 'hours__status-indicator--open' : 'hours__status-indicator--closed'}`}>
              {isOpen ? (locale === 'ar' ? 'مفتوح الآن' : 'Open now') : (locale === 'ar' ? 'مغلق الآن' : 'Closed now')}
            </span>
            {nextChange && (
              <span className="hours__next-change">
                {nextChange.action} {nextChange.time}
              </span>
            )}
          </div>
          
          <div className="hours__today-schedule">
            <span className="hours__today-day">{todayName}</span>
            {renderTimeSlots(todayHours || [])}
          </div>
        </div>

        {showTimezone && (
          <div className="hours__timezone">
            {locale === 'ar' ? 'التوقيت:' : 'Timezone:'} {timezone}
          </div>
        )}
      </div>
    );
  }

  // Compact and detailed variants
  return (
    <div 
      className={hoursClasses}
      data-testid={testId}
      dir={direction}
    >
      {variant === 'detailed' && (
        <div className="hours__status">
          <span className={`hours__status-indicator ${isOpen ? 'hours__status-indicator--open' : 'hours__status-indicator--closed'}`}>
            {isOpen ? (locale === 'ar' ? 'مفتوح الآن' : 'Open now') : (locale === 'ar' ? 'مغلق الآن' : 'Closed now')}
          </span>
          {nextChange && (
            <span className="hours__next-change">
              {nextChange.action} {nextChange.time}
            </span>
          )}
        </div>
      )}

      <div className="hours__schedule">
        <h3 className="hours__title">
          {locale === 'ar' ? 'ساعات العمل' : 'Opening Hours'}
        </h3>
        
        <div className="hours__list" role="list">
          {dayKeys.map((dayKey, index) => {
            const daySchedule = hours[dayKey];
            const dayName = dayNames[locale][index];
            const isToday = index === currentTime.getDay();
            
            return (
              <div 
                key={dayKey}
                className={`hours__day ${isToday ? 'hours__day--today' : ''}`}
                role="listitem"
              >
                <span className="hours__day-name">
                  {dayName}
                  {isToday && (
                    <span className="hours__today-badge">
                      {locale === 'ar' ? '(اليوم)' : '(Today)'}
                    </span>
                  )}
                </span>
                <span className="hours__day-schedule">
                  {renderTimeSlots(daySchedule || [])}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showTimezone && (
        <div className="hours__timezone">
          {locale === 'ar' ? 'التوقيت:' : 'Timezone:'} {timezone}
        </div>
      )}

      {/* JSON-LD structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OpeningHoursSpecification",
            "openingHours": dayKeys.map((dayKey, index) => {
              const daySchedule = hours[dayKey];
              if (!daySchedule || daySchedule.length === 0) return null;
              
              const dayName = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][index];
              return daySchedule.map(slot => `${dayName} ${slot.open}-${slot.close}`);
            }).filter(Boolean).flat()
          })
        }}
      />
    </div>
  );
};