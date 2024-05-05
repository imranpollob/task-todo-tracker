"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Task } from "@/components/Task";
import { NewTask } from "@/components/NewTask";
import { Skeleton } from "@/components/ui/skeleton";

import { useTheme } from "next-themes";
import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";

import { numberToTime } from "@/helpers/NumberToTime";

export default function Home() {
  interface Task {
    id: number;
    name: string;
    elapsed_time: number;
  }

  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const toggleTheme = (currentTheme: string | undefined) => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks")
      .then((response) => {
        setTasks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, []);

  const handleAddTime = (id: number, increment: number) => {
    /*
      we need two tables to track the time elapsed for a task
      1. tasks
      2. task_times

      so when this function is called, we need to add a new row to task_times
      with the task_id and the time elapsed

      from the backend, we can calculate the total time for a task by summing
      the elapsed_time column in the task_times table for a given task_id
    */
    // const taskToUpdate = tasks.find((task) => task.id === id);
    // if (taskToUpdate) {
    //   const updatedTime = Math.max(taskToUpdate.elapsed_time + increment, 0);
    //   axios
    //     .put(`http://localhost:8000/api/tasks/${id}`, {
    //       elapsed_time: updatedTime,
    //     })
    //     .then((response) => {
    //       setTasks((tasks) =>
    //         tasks.map((task) =>
    //           task.id === id ? { ...task, elapsed_time: updatedTime } : task
    //         )
    //       );
    //       setTotalTime((prevTotalTime) =>
    //         Math.max(prevTotalTime + increment, 0)
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Failed to update task elapsed_time:", error);
    //     });
    // }
  };

  const handleNameChange = (id: number, newName: string) => {
    axios
      .put(`http://localhost:8000/api/tasks/${id}`, { name: newName })
      .then((response) => {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === id ? { ...task, name: newName } : task
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update task name:", error);
      });
  };

  const handleTaskAdd = (taskName: string) => {
    const newTask = { name: taskName, elapsed_time: 0 };
    axios
      .post(`http://localhost:8000/api/tasks`, newTask)
      .then((response) => {
        const createdTask = response.data.data;
        setTasks((tasks) => [...tasks, createdTask]);
      })
      .catch((error) => {
        console.error("Failed to add new task:", error);
      });
  };

  const handleTaskDelete = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${id}`)
      .then((response) => {
        setTasks((tasks) => tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
      });
  };

  return (
    <div
      key="1"
      className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border border-gray-200 dark:border-gray-800"
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        {loading ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <div className="text-lg font-medium">
            Total Time: {numberToTime(totalTime)}
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border border-gray-200 w-8 h-8"
          onClick={() => toggleTheme(theme)}
        >
          <Icon.Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icon.Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-3">
            <Skeleton className="h-16 mb-2" />
            <Skeleton className="h-16 mb-2" />
            <Skeleton className="h-16 mb-2" />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="space-y-2 p-3">
              {/* Task list */}
              {tasks.map((task, index) => (
                <Task
                  key={index}
                  id={task.id}
                  name={task.name}
                  elapsed_time={task.elapsed_time}
                  addTime={handleAddTime}
                  changeName={handleNameChange}
                  deleteTask={handleTaskDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <NewTask addTask={handleTaskAdd} />
    </div>
  );
}
