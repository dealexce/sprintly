import React from 'react';
import { TimeColumn } from './TimeColumn';

export function TimeGrid() {
  const amHours = Array.from({ length: 12 }, (_, i) => i);
  const pmHours = Array.from({ length: 12 }, (_, i) => i + 12);

  return (
    <div className="flex-1 flex">
      <TimeColumn
          hours={amHours}
      />
      <TimeColumn
          hours={pmHours}
        />
    </div>
  );
}
