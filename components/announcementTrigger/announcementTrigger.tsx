"use client";

interface AnnouncementTriggerProps {
  onClick: () => void;
}

export default function AnnouncementTrigger({
  onClick,
}: AnnouncementTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        fixed
        top-3
        right-3
        z-50
        p-2
        text-xl
        bg-gray-950
        border
        border-gray-800
        rounded-none
        shadow-lg
        hover:scale-110
        hover:border-sky-500
        transition-all
        focus:outline-none
        focus:ring-2
        focus:ring-sky-400/50
      `}
      aria-label="Show announcement"
      title="Show announcement"
    >
      🔔
    </button>
  );
}
