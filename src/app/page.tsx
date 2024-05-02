"use client";

import { useState } from "react";

import { Task } from "@/components/Task";

import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { numberToTime } from "@/helpers/NumberToTime";

export default function Home() {
  interface Task {
    name: string;
    time: number;
  }

  const [tasks, setTasks] = useState<Task[]>([
    { name: "Research", time: 0 },
    { name: "Hustle", time: 0 },
    { name: "Gaming", time: 0 },
    { name: "Sleep", time: 0 },
  ]);
  const [totalTime, setTotalTime] = useState(0);

  const handleAddTime = (taskName: string, increment: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.name === taskName
          ? { ...task, time: Math.max(task.time + increment, 0) }
          : task
      )
    );

    setTotalTime((prevTotalTime) => Math.max(prevTotalTime + increment, 0));
  };

  const handleNameChange = (taskName: string, newName: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.name === taskName ? { ...task, name: newName } : task
      )
    );
  };

  return (
    <div
      key="1"
      className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border border-gray-200 "
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="text-lg font-medium">
          Total Time: {numberToTime(totalTime)}
        </div>
        <Button
          className="rounded-full border border-gray-200 w-8 h-8 "
          size="icon"
          variant="ghost"
        >
          <Icon.SunIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-2 p-3">
            {/* Task list */}
            {tasks.map((task, index) => (
              <Task
                key={index}
                name={task.name}
                time={task.time}
                addTime={handleAddTime}
                changeName={handleNameChange}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 ">
        <div className="flex-1">
          <Input className="w-full" placeholder="Add new task" type="text" />
        </div>
        <Button className="ml-4" size="sm" variant="outline">
          <Icon.CheckIcon className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
