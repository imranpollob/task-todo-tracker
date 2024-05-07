"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { numberToTime } from "@/helpers/NumberToTime";

const FormSchema = z.object({
  taskname: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
});

interface TaskProps {
  id: number;
  name: string;
  elapsed_time: number;
  addTime: (id: number, taskTime: number) => void;
  changeName: (id: number, newName: string) => void;
  deleteTask: (id: number) => void;
}

export function Task({
  id,
  name,
  elapsed_time,
  addTime,
  changeName,
  deleteTask,
}: TaskProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskname: name,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    changeName(id, data.taskname);
  }

  return (
    <div className="flex flex-col items-start p-3 border border-gray-200 dark:border-gray-800 shadow-md">
      <div className="flex justify-between w-full items-center">
        <div className="font-medium">{name}</div>
        <div className="text-gray-500 dark:text-gray-300">
          {numberToTime(elapsed_time)}
        </div>
      </div>
      <div className="flex items-center space-x-6 mt-2">
        <button title="Add 30 mintues" onClick={() => addTime(id, 30)}>
          <Icon.CirclePlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <button title="Minus 30 minutes" onClick={() => addTime(id, -30)}>
          <Icon.CircleMinus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <Sheet>
          <SheetTrigger asChild>
            <button
              title="Edit task"
              onClick={() => form.setValue("taskname", name)}
            >
              <Icon.Pencil className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </SheetTrigger>

          <SheetContent side="top" className="max-w-md mx-auto">
            <SheetHeader className="sm:text-center">
              <SheetTitle>Configure Task</SheetTitle>
              <SheetDescription>Edit or delete the task</SheetDescription>
            </SheetHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4 pb-0"
              >
                <FormField
                  control={form.control}
                  name="taskname"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right mt-2">
                        Task Name
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} className="col-span-3" />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />
                <SheetFooter className=" sm:flex-col-reverse sm:space-x-0 ">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="mt-2">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure to delete the task?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <SheetClose asChild>
                          <AlertDialogAction onClick={() => deleteTask(id)}>
                            Continue
                          </AlertDialogAction>
                        </SheetClose>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
