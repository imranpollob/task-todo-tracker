"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Task } from "@/components/Task";
import { NewTask } from "@/components/NewTask";
import { Login } from "@/components/Login";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

import { useTheme } from "next-themes";
import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";

import { numberToTime } from "@/helpers/NumberToTime";
import { getCustomDate, getTimeDifference } from "@/helpers/DateHelper";

export default function Home() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const { isLoggedIn, setIsLoggedIn } = useAuth();

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
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [dayPointer, setDayPointer] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

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

  const fetchTasks = (day: number = 0) => {
    axios
      .get(`${apiURL}/tasks?day=${day}`)
      .then((response) => {
        setTasks(response.data.data);

        const totalTime = response.data.data.reduce(
          (acc: number, task: Task) => acc + task.elapsed_time,
          0
        );

        setTotalTime(totalTime);

        setLoading(false);

        if (response.data.latest_task_time) {
          setLastUpdated(getTimeDifference(response.data.latest_task_time));
        }
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
          day: dayPointer,
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
          setLastUpdated("0s");
          setBackendWorking(false);
        })
        .catch((error) => {
          console.error("Failed to update task elapsed_time:", error);
          setBackendWorking(false);
        });
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    if (backendWorking) {
      return;
    }
    setBackendWorking(true);
    axios
      .put(`${apiURL}/tasks/${id}`, { name: newName })
      .then((response) => {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === id ? { ...task, name: newName } : task
          )
        );
        setBackendWorking(false);
      })
      .catch((error) => {
        console.error("Failed to update task name:", error);
        setBackendWorking(false);
      });
  };

  const handleTaskAdd = (taskName: string) => {
    const newTask = { name: taskName, elapsed_time: 0 };
    if (backendWorking) {
      return;
    }
    setBackendWorking(true);
    axios
      .post(`${apiURL}/tasks`, newTask)
      .then((response) => {
        const createdTask = response.data.data;
        setTasks((tasks) => [...tasks, createdTask]);
        setBackendWorking(false);
      })
      .catch((error) => {
        console.error("Failed to add new task:", error);
        setBackendWorking(false);
      });
  };

  const handleTaskDelete = (id: number) => {
    if (backendWorking) {
      return;
    }
    setBackendWorking(true);
    axios
      .delete(`${apiURL}/tasks/${id}`)
      .then((response) => {
        setTasks((tasks) => tasks.filter((task) => task.id !== id));
        setBackendWorking(false);
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
        setBackendWorking(false);
      });
  };

  const handleLogin = (email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (backendWorking) {
        reject("Backend is already working.");
      }
      setBackendWorking(true);
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
          setShowLoginSheet(false);
          fetchTasks();
          setBackendWorking(false);
          resolve(response);
        })
        .catch((error) => {
          setBackendWorking(false);
          reject(error.response);
        });
    });
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    axios.defaults.headers.common["Authorization"] = "";
    setIsLoggedIn(false);
    setTasks([]);
    setTotalTime(0);
    setLastUpdated("");
    setLoading(true);
  };

  const handleToday = () => {
    setDayPointer(0);
    fetchTasks();
  };

  const handlePreviousDay = () => {
    const newDayPointer = dayPointer - 1;
    setDayPointer(newDayPointer);
    fetchTasks(newDayPointer);
  };

  const handleNextDay = () => {
    const newDayPointer = dayPointer + 1;
    setDayPointer(newDayPointer);
    fetchTasks(newDayPointer);
  };

  return (
    <div
      key="1"
      className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border border-gray-200 dark:border-gray-800"
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        {isLoggedIn ? (
          loading ? (
            <Skeleton className="h-8 w-40" />
          ) : (
            <div className="text-lg font-medium">
              Total Time: {numberToTime(totalTime)}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last Updated: {lastUpdated ? lastUpdated + " ago" : "Never"}
              </p>
            </div>
          )
        ) : (
          <div className="text-lg font-medium">Task Tracker</div>
        )}

        <div className="flex items-center justify-between">
          <Login
            isLoggedIn={isLoggedIn}
            showLoginSheet={showLoginSheet}
            setShowLoginSheet={setShowLoginSheet}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border border-gray-200 w-8 h-8 ml-4"
            onClick={() => toggleTheme(theme)}
          >
            <Icon.Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon.Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {isLoggedIn ? (
          loading ? (
            <div className="p-3">
              <Skeleton className="h-16 mb-2" />
              <Skeleton className="h-16 mb-2" />
              <Skeleton className="h-16 mb-2" />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="space-y-2 p-3">
                {tasks.length ? (
                  tasks.map((task, index) => (
                    <Task
                      key={index}
                      id={task.id}
                      name={task.name}
                      elapsed_time={task.elapsed_time}
                      addTime={handleAddTime}
                      changeName={handleNameChange}
                      deleteTask={handleTaskDelete}
                    />
                  ))
                ) : (
                  <>
                    <p className="text-2xl text-center mt-10 text-gray-900 dark:text-gray-50 font-medium">
                      So Empty
                    </p>
                    <p className="text-center text-gray-900 dark:text-gray-50">
                      Add a task by using the form below
                    </p>
                  </>
                )}
              </div>
            </div>
          )
        ) : (
          <p className="text-2xl text-center mt-10 text-gray-900 dark:text-gray-50 font-medium">
            Please Login First
          </p>
        )}
      </div>

      {isLoggedIn && (
        <>
          <NewTask addTask={handleTaskAdd} />
          <div className="flex justify-between mx-2 mb-2">
            <Button
              variant="outline"
              className="pl-2"
              onClick={handlePreviousDay}
            >
              <Icon.ChevronLeft className="h-4 w-6" />{" "}
              {getCustomDate(dayPointer - 1)}
            </Button>
            <Button variant="outline" onClick={handleToday}>
              Today
            </Button>
            <Button
              variant="outline"
              disabled={dayPointer >= 0}
              className="pr-2"
              onClick={handleNextDay}
            >
              {getCustomDate(dayPointer + 1)}{" "}
              <Icon.ChevronRight className="h-4 w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
