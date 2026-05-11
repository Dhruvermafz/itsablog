import { TabButton } from "./TabButton";

/**
 * TabBar
 * A pill-style horizontal tab navigation bar.
 */
export function TabBar({ tabs = [], activeTab, onChange }) {
  return (
    <div
      className="
        flex items-center gap-2
        bg-muted/50 rounded-3xl p-1

        overflow-x-auto
        scrollbar-hide

        w-full
        sm:w-auto
      "
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        />
      ))}
    </div>
  );
}
