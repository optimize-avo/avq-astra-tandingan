import clsx from 'clsx';

// Inline SVG brand marks for ChatGPT / Gemini / Perplexity.
// Kept simple — single-color, currentColor-friendly for ADS theming.

export function ChatGPTIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-label="ChatGPT">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.787a4.5 4.5 0 0 1-.676 8.105V12.43a.79.79 0 0 0-.407-.685zm2.01-3.013l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

export function GeminiIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-label="Gemini">
      <path
        fill="currentColor"
        d="M12 0c-.7 3.4-3.1 6.6-6.3 8C2.5 9.4 0 11 0 12c0 1 .9 2 2.7 3.1 4 2 7 5 8.4 8.9.3 0 .6 0 .9 0 .3-3.9 4.4-6.9 8.4-8.9C23.1 14 24 13 24 12c0-1-2.5-2.6-5.7-4-3.2-1.4-5.6-4.6-6.3-8z"
      />
    </svg>
  );
}

export function PerplexityIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Perplexity">
      <path d="M3 4v16M21 4v16" />
      <path d="M3 6c4 0 4 12 9 12s5-12 9-12" />
      <path d="M3 18c4 0 4-12 9-12s5 12 9 12" />
    </svg>
  );
}

export const LLM_ICONS = {
  ChatGPT: ChatGPTIcon,
  Gemini: GeminiIcon,
  Perplexity: PerplexityIcon,
} as const;

import type { LLM } from '@/data/dummy';

export function LLMIcon({ llm, className, size = 14 }: { llm: LLM; className?: string; size?: number }) {
  const Icon = LLM_ICONS[llm];
  return <Icon className={clsx(className)} size={size} />;
}
