"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type AdaptiveSelectProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function AdaptiveSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  className
}: AdaptiveSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-white/15 bg-white/5",
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 7 5 6 5-6'/%3E%3C/svg%3E\")]",
          "bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-9 text-sm text-slate-100 shadow-sm",
          "transition-all duration-200 focus:border-blue-300/50 focus:bg-white/[0.07] focus:outline-none",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-transparent focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]",
          "disabled:cursor-not-allowed disabled:opacity-50 md:hidden [&>option]:bg-white [&>option]:text-slate-900"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="relative hidden md:block">
        <button
          id={id ? `${id}-desktop` : undefined}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]",
            "px-3 text-left text-sm text-slate-100 shadow-[0_10px_30px_rgba(2,6,23,0.18)] transition-all duration-200",
            "hover:border-cyan-300/35 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:ring-offset-2 focus:ring-offset-transparent",
            open ? "border-cyan-300/40 bg-white/[0.07] shadow-[0_0_0_4px_rgba(56,189,248,0.12)]" : "",
            disabled ? "cursor-not-allowed opacity-50" : ""
          )}
        >
          <span className={cn("truncate", !selectedOption ? "text-slate-400" : "text-slate-100")}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-slate-300 transition-transform duration-200", open ? "rotate-180" : "")} />
        </button>

        {open ? (
          <div
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/12 bg-slate-950/95 p-2 shadow-[0_20px_60px_rgba(2,6,23,0.42)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                !selectedOption ? "bg-cyan-500/12 text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <span>{placeholder}</span>
              {!selectedOption ? <Check className="h-4 w-4 text-cyan-200" /> : null}
            </button>

            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isSelected ? "bg-cyan-500/12 text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 text-cyan-200" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
