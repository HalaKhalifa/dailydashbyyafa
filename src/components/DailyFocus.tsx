import { useState } from "react";
import { Target, Sparkles } from "lucide-react";

const DailyFocus = () => {
  const [focus, setFocus] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const save = () => {
    const trimmed = focus.trim();
    if (trimmed) {
      setSaved(trimmed);
      setEditing(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Target size={20} className="text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Daily Focus</h2>
      </div>
      <p className="text-sm text-muted-foreground">{today}</p>

      {saved && !editing ? (
        <div className="animate-fade-in">
          <div className="rounded-lg bg-card border border-border p-4 flex items-start gap-3">
            <Sparkles size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground font-medium">{saved}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
              >
                Change focus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 animate-fade-in">
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="What's your main focus today?"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={save}
            className="self-start rounded-lg bg-accent px-4 py-2 text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Set Focus
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyFocus;
