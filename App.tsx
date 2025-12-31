import React from "react";

// Components
import { HeaderSection } from "./components/HeaderSection";
import { TimeGrid } from "./components/Grid";
import { TodoPanel } from "./components/TodoPanel";
import { EraserTool } from "./components/EraserTool";
import { MarkerSet } from "./components/MarkerSet";
// Stores
import { useGridStore } from "./stores/gridStore";
// Libraries
import dayjs from "dayjs";
import { DragDropProvider } from "@dnd-kit/react";

export default function App() {
  const addTodoToSlot = useGridStore((state) => state.addTodoToSlot);
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        const { source, target } = event.operation;
        if (source?.type === "todo" && target?.type === "slot") {
          addTodoToSlot(target.data.hour, target.data.seg, source.data.id);
        }
      }}
    >
      <div
        className="flex h-screen w-screen overflow-hidden 
        gap-8 p-4 items-center justify-center relative
        bg-neutral-800"
      >
        {/* --- LEFT PANEL: DAILY PLANNER --- */}
        <div className="h-full paper-stack max-w-5xl flex-1 relative flex flex-col bg-white">
          <HeaderSection
            title="sprintly"
            date={dayjs().format("dddd, MMMM D")}
          />
          {/* Grid Content Container */}
          <div className="h-full flex-1 flex">
            <TimeGrid />
          </div>
        </div>

        {/* --- RIGHT PANEL: TOOLS --- */}
        <div className="h-full flex flex-col w-1/6 min-w-fit z-20 py-4 gap-4 ">
          <TodoPanel />

          <EraserTool />

          <MarkerSet />
        </div>
      </div>
    </DragDropProvider>
  );
}
