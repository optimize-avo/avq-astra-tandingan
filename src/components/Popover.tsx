import { ReactNode, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: 'left' | 'right';
  width?: number | string;
  className?: string;
}

export function Popover({ trigger, children, align = 'right', width = 320, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className={clsx('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={clsx(
            'absolute top-full mt-2 z-40 glass-strong rounded-lg border border-navy-edge shadow-2xl fade-up',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          style={{ width }}
          onClick={(e) => e.stopPropagation()}
        >
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: ReactNode;
}

export function Dropdown({
  trigger,
  items,
  value,
  onSelect,
  align = 'right',
  width = 240,
}: {
  trigger: ReactNode;
  items: DropdownItem[];
  value?: string;
  onSelect: (id: string) => void;
  align?: 'left' | 'right';
  width?: number;
}) {
  return (
    <Popover
      align={align}
      width={width}
      trigger={trigger}
    >
      {(close) => (
        <div className="py-1 max-h-80 overflow-y-auto">
          {items.map((it) => {
            const active = value === it.id;
            return (
              <button
                key={it.id}
                onClick={() => {
                  onSelect(it.id);
                  close();
                }}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  active
                    ? 'bg-avo-teal/10 text-avo-teal'
                    : 'text-text-secondary hover:bg-navy-elevated/50 hover:text-text-bright'
                )}
              >
                {it.icon}
                <span className="flex-1 truncate">{it.label}</span>
                {it.badge !== undefined && (
                  <span className="text-[10px] font-mono text-text-muted">{it.badge}</span>
                )}
                {active && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-avo-teal" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </Popover>
  );
}
