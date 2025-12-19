import React from 'react';
import { GRID_INFO } from '@/stores/gridStore';
import { GridSlot } from './GridSlot';
import dayjs from 'dayjs';

interface TimeColumnProps {
  hours: number[];
}

export function TimeColumn({
  hours }: TimeColumnProps) {
  const minutes = Array.from({ length: 60 / GRID_INFO.SLOT_INTERVAL_MINUTES }, (_, i) => i * GRID_INFO.SLOT_INTERVAL_MINUTES);
  return (
    <div className="flex-1 flex flex-col relative text-neutral-400 text-[10px] font-mono">
      {/* Column Headers (Minutes) */}
      <div className="flex border-b bg-neutral-50">
        {/* Empty corner cell */}
        <div className="w-12 border-r" />
        {/* Minute Labels */}
        {minutes.map((min) => (
          <div
            key={min}
            className="flex-1 text-center py-1 border-r"
          >
            :{min.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Rows */}
      {hours.map((hour) => {
        const currentTime = dayjs();
        return (
          <div 
            className="flex-1 flex min-h-2 border-b"
          >
            {/* Time Label */}
            <div className="w-12 flex items-center justify-center bg-neutral-50">
              {hour}
            </div>

            {/* Slot Container */}
            <div className="flex-1 flex relative">
              {minutes.map((_, seg) => {
                return (
                  <GridSlot hour={hour} seg={seg} />
                );
              })}

              {/* Vertical Time Cursor */}
              { currentTime.hour() === hour && (
                <div
                  className="absolute top-0 bottom-0 z-40 pointer-events-none"
                  style={{
                    left: `${((currentTime.minute() % 60) / 60) * 100}%`,
                  }}
                >
                  <div className="absolute inset-y-0 -left-px w-0.5 bg-red-500 shadow-[0_0_2px_rgba(239,68,68,0.5)]"></div>
                  <div className="absolute top-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>
                  <div className="absolute bottom-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full translate-y-1/2"></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
