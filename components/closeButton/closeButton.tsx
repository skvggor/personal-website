"use client";

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1 rounded-full hover:bg-sky-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/50 flex-shrink-0 text-sky-300"
      aria-label="Close announcement"
      title="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}
