"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Task } from "@/components/Task";
import { NewTask } from "@/components/NewTask";
import { Skeleton } from "@/components/ui/skeleton";

import { useTheme } from "next-themes";
import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { numberToTime } from "@/helpers/NumberToTime";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function Home() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  interface Task {
    id: number;
    name: string;
    elapsed_time: number;
  }

  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [backendWorking, setBackendWorking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleTheme = (currentTheme: string | undefined) => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    const token = Cookies.get("auth_token");

    if (token) {
      // meaning user is logged in
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLoggedIn(true);
      fetchTasks();
    } else {
      setLoading(true);
      // show login/registration popup
    }
  }, []);

  const fetchTasks = () => {
    axios
      .get(`${apiURL}/tasks`)
      .then((response) => {
        setTasks(response.data.data);
        const totalTime = response.data.data.reduce(
          (acc: number, task: Task) => acc + task.elapsed_time,
          0
        );
        setTotalTime(totalTime);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(true);
      });
  };

  const handleAddTime = (id: number, increment: number) => {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (taskToUpdate) {
      const updatedTime = taskToUpdate.elapsed_time + increment;
      if (updatedTime < 0 || backendWorking) {
        return;
      }
      setBackendWorking(true);
      axios
        .post(`${apiURL}/tasks/${id}/addtime`, {
          elapsed_time: increment,
        })
        .then((response) => {
          setTasks((tasks) =>
            tasks.map((task) =>
              task.id === id ? { ...task, elapsed_time: updatedTime } : task
            )
          );
          setTotalTime((prevTotalTime) =>
            Math.max(prevTotalTime + increment, 0)
          );
          setBackendWorking(false);
        })
        .catch((error) => {
          console.error("Failed to update task elapsed_time:", error);
        });
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    axios
      .put(`${apiURL}/tasks/${id}`, { name: newName })
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
      .post(`${apiURL}/tasks`, newTask)
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
      .delete(`${apiURL}/tasks/${id}`)
      .then((response) => {
        setTasks((tasks) => tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
      });
  };

  const handleRegistration = (email: string, password: string) => {
    axios
      .post(`${apiURL}/register`, { email, password })
      .then((response) => {
        console.log("Registered successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to register:", error);
      });
  };

  const handleLogin = (email: string, password: string) => {
    // geting laravel sanctum csrf token
    // axios.get(`${process.env.NEXT_PUBLIC_CSRF_URL}/sanctum/csrf-cookie`);

    // login
    axios
      .post(`${apiURL}/login`, { email, password })
      .then((response) => {
        Cookies.set("auth_token", response.data.data.auth_token, {
          expires: 30, // 30 days
        });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.auth_token}`;
        setIsLoggedIn(true);
        fetchTasks();
      })
      .catch((error) => {
        console.error("Failed to login:", error);
      });
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    axios.defaults.headers.common["Authorization"] = "";
    setIsLoggedIn(false);
    setTasks([]);
    setTotalTime(0);
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

        {!isLoggedIn ? (
          <Button
            variant={"outline"}
            onClick={() => handleLogin("a@a.com", "123")}
          >
            Login
          </Button>
        ) : (
          <Button variant={"outline"} onClick={handleLogout}>
            Logout
          </Button>
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

      {isLoggedIn && <NewTask addTask={handleTaskAdd} />}
    </div>
  );
}
