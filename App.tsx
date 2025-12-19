import React, { useState, useCallback, useEffect, useMemo } from 'react';

// Components
import { HeaderSection } from './components/HeaderSection';
import { TimeGrid } from './components/TimeGrid';
import { TodoPanel } from './components/TodoPanel';
import { EraserTool } from './components/EraserTool';
import { MarkerSet } from './components/MarkerSet';
import dayjs from 'dayjs';


export default function App() {

  // --- Dynamic Cursor ---
  // const cursorStyle = useMemo(
  //   () => getCursorStyle(tool, categories),
  //   [tool, categories]
  // );

  return (
      <div
        className="flex h-screen w-screen overflow-hidden 
        gap-8 p-4 items-center justify-center relative
        bg-gray-800"
      >
        {/* --- LEFT PANEL: DAILY PLANNER --- */}
        <div className="h-full paper-stack max-w-5xl flex-1 relative flex flex-col bg-white">
          <HeaderSection title="sprintly" date={dayjs().format('dddd, MMMM D')} />
          {/* Grid Content Container */}
          <div className="h-full flex-1 flex">
              <TimeGrid />
          </div>
        </div>

        {/* --- RIGHT PANEL: TOOLS --- */}
        <div className="h-full flex flex-col w-1/6 z-20 py-4 gap-4">
          <TodoPanel/>

          <EraserTool/>

          <MarkerSet/>
        </div>
      </div>
  );
}
