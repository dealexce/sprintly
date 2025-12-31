import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";

type SpanInputProps = {
  id: string;
  defaultValue: string;
  onSave: (value: string) => void;
  className?: string;
};

export default function SpanInput({
  id,
  defaultValue,
  onSave,
  className,
}: SpanInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const save = () => {
    onSave(inputRef.current?.value || "");
    inputRef.current?.blur();
  };

  return (
    <input
      id={id}
      defaultValue={defaultValue}
      ref={inputRef}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
      }}
      onBlur={save}
      className={clsx(className, `field-sizing-content rounded outline-none`)}
    />
  );
}
