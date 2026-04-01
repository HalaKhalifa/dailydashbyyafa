import { useState, useRef } from "react";
import { Check, Plus, Pencil, Trash2, X } from "lucide-react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, done: false },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (trimmed) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t))
      );
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">To-Do List</h2>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task…"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button
          onClick={addTask}
          className="rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
        </button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No tasks yet. Add one above!
          </p>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-2 rounded-lg bg-card px-3 py-2.5 animate-fade-in"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                task.done
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {task.done && <Check size={12} className="text-primary-foreground" />}
            </button>

            {editingId === task.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button onClick={saveEdit} className="text-primary hover:opacity-70">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:opacity-70">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-sm transition-all ${
                    task.done
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.text}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
