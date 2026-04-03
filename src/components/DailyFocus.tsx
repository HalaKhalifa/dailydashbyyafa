import { useState, useEffect } from "react";
import { Target, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DailyFocusProps {
  dateContext?: string;
}

const DailyFocus = ({ dateContext }: DailyFocusProps) => {
  const todayKey = new Date().toISOString().split("T")[0];
  const activeDate = dateContext || todayKey;
  const storageKey = `daily-dash-focus-${activeDate}`;

  const [focus, setFocus] = useState("");
  const [saved, setSaved] = useState<string | null>(() => {
    return localStorage.getItem(storageKey);
  });
  const [editing, setEditing] = useState(!saved);

  useEffect(() => {
    const freshSaved = localStorage.getItem(storageKey);
    setSaved(freshSaved);
    setFocus(freshSaved || "");
    setEditing(!freshSaved);
  }, [activeDate, storageKey]);

  useEffect(() => {
    if (saved) {
      localStorage.setItem(storageKey, saved);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [saved, storageKey]);

  const save = () => {
    const trimmed = focus.trim();
    if (trimmed) {
      setSaved(trimmed);
      setEditing(false);
    }
  };

  const displayDate = new Date(activeDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
            <Target size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Main Focus</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{displayDate}</p>
          </div>
        </div>
        {saved && !editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            className="text-xs font-bold uppercase tracking-wider h-8 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Pencil size={14} className="mr-2" />
            Edit
          </Button>
        )}
      </div>

      {saved && !editing ? (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 flex items-start gap-4 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={48} className="text-primary fill-primary" />
            </div>
            <Sparkles size={24} className="text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 relative z-10">
              <p className="text-xl font-semibold text-foreground leading-snug">{saved}</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">You've got this! Focus on the goal. ✨</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative">
             <input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="What's your main focus today?"
              className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm font-medium transition-all focus:ring-4 focus:ring-primary/10 hover:border-primary/30 outline-none pr-32 shadow-sm"
              autoFocus
            />
            <Button
              onClick={save}
              className="absolute right-2 top-2 bottom-2 rounded-xl px-6 text-xs font-bold uppercase tracking-wider h-auto shadow-sm transition-all hover:translate-y-[-1px]"
              size="sm"
            >
              Confirm
            </Button>
          </div>
          <p className="text-xs text-muted-foreground px-2 font-medium italic">
            "Energy flows where attention goes."
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyFocus;

