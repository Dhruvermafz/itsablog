/**
 * TabButton
 * A compact pill-style tab button used in navigation tab bars.
 */
export function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center sm:justify-start gap-0 sm:gap-2 
      px-3 sm:px-5 py-2 sm:py-2.5 rounded-3xl transition-all text-sm font-medium
      min-w-[44px] sm:min-w-0
      ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}

      {/* Hide label on mobile, show on sm+ */}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
