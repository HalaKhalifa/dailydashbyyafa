import { useState, useEffect } from "react";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}

// Key for storage: daily-dash-v2-tasks
// Map of date string (YYYY-MM-DD) to Task array
type TaskMap = Record<string, Task[]>;

export const useTasks = (dateContext?: string) => {
  const today = new Date().toISOString().split("T")[0];
  const activeDate = dateContext || today;

  const [taskMap, setTaskMap] = useState<TaskMap>(() => {
    const saved = localStorage.getItem("daily-dash-v2-tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse task map", e);
      }
    }

    // Migration logic for old "daily-dash-tasks"
    const oldSaved = localStorage.getItem("daily-dash-tasks");
    if (oldSaved) {
      try {
        const oldTasks = JSON.parse(oldSaved);
        // Move old tasks to today's date
        return { [today]: oldTasks };
      } catch (e) {
        console.error("Failed to migrate old tasks", e);
      }
    }

    return {};
  });

  useEffect(() => {
    localStorage.setItem("daily-dash-v2-tasks", JSON.stringify(taskMap));
  }, [taskMap]);

  const tasks = taskMap[activeDate] || [];

  const setTasksForDate = (newTasks: Task[]) => {
    setTaskMap((prev) => ({
      ...prev,
      [activeDate]: newTasks,
    }));
  };

  const addTask = (text: string, priority: Priority = "medium") => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    };
    setTasksForDate([newTask, ...tasks]);
  };

  const toggleTask = (id: string): boolean => {
    let wasJustCompleted = false;
    setTaskMap((prev) => {
      const currentTasks = prev[activeDate] || [];
      const updatedTasks = currentTasks.map((t) => {
        if (t.id === id) {
          if (!t.done) wasJustCompleted = true;
          return { ...t, done: !t.done };
        }
        return t;
      });
      return { ...prev, [activeDate]: updatedTasks };
    });
    return wasJustCompleted;
  };

  const deleteTask = (id: string) => {
    setTasksForDate(tasks.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, text: string) => {
    setTasksForDate(tasks.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const updatePriority = (id: string, priority: Priority) => {
    setTasksForDate(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));
  };

  const reorderTasks = (newOrder: Task[]) => {
    setTasksForDate(newOrder);
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    updatePriority,
    reorderTasks,
    activeDate,
  };
};
