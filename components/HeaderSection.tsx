import React from 'react';

interface HeaderSectionProps {
  title: string;
  date: string;
}

export function HeaderSection({ title, date }: HeaderSectionProps) {
  return (
    <div className="h-16 border-b-2 border-stone-200 flex items-center justify-between px-6 bg-white shrink-0">
      <div>
        <h1 className="font-mono text-3xl text-stone-800">{title}</h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">
          {date}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full border-4 border-stone-200 bg-stone-100 flex items-center justify-center opacity-50">
        <div className="w-6 h-6 rounded-full bg-stone-300"></div>
      </div>
    </div>
  );
}
