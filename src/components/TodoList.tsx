import { useState, useRef } from "react";
import { Check, Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import { useTasks, Priority } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TodoList = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTask, updatePriority } = useTasks();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addTask(trimmed, priority);
    setInput("");
    inputRef.current?.focus();
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      updateTask(id, trimmed);
    }
    setEditingId(null);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "high": return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50 dark:text-red-400";
      case "medium": return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 dark:text-blue-400";
      case "low": return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900/50 dark:text-green-400";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Today's Tasks</h2>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
          {tasks.filter(t => !t.done).length} active
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What needs to be done?"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
          />
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <Button
            onClick={handleAdd}
            size="icon"
            className="rounded-xl h-[42px] w-[42px] shadow-sm hover:translate-y-[-1px] transition-all"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Check className="text-muted-foreground opacity-20" size={32} />
            </div>
            <p className="text-sm font-medium text-foreground">No tasks yet — add one!</p>
            <p className="text-xs text-muted-foreground mt-1">Break your day into manageable bites.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-left-4",
                task.done ? "opacity-60 grayscale-[0.2]" : "hover:border-primary/30 hover:shadow-md hover:translate-x-1"
              )}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
                  task.done
                    ? "bg-primary border-primary scale-90"
                    : "border-border hover:border-primary/50"
                )}
              >
                {task.done && <Check size={14} className="text-primary-foreground animate-in zoom-in duration-300" />}
              </button>

              {editingId === task.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => saveEdit(task.id)} className="p-1 text-primary hover:bg-primary/10 rounded-md">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-500 truncate",
                        task.done && "line-through text-muted-foreground"
                      )}
                    >
                      {task.text}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border",
                        getPriorityColor(task.priority)
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(task.id, task.text)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;

