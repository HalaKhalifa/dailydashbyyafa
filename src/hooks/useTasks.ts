import { useState, useEffect } from "react";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("daily-dash-tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tasks", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("daily-dash-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, priority: Priority = "medium") => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, text: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    );
  };

  const updatePriority = (id: string, priority: Priority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    updatePriority,
  };
};
