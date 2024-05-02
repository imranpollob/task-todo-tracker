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

import { numberToTime } from "@/helpers/NumberToTime";

const FormSchema = z.object({
  taskname: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
});

interface TaskProps {
  name: string;
  time: number;
  addTime: (taskName: string, taskTime: number) => void;
  changeName: (taskName: string, newName: string) => void;
}

export function Task({ name, time, addTime, changeName }: TaskProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskname: name,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    changeName(name, data.taskname);
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <div className="flex flex-col items-start p-3 border border-gray-200 shadow-md">
      <div className="flex justify-between w-full items-center">
        <div className="font-medium">{name}</div>
        <div className="text-gray-500">{numberToTime(time)}</div>
      </div>
      <div className="flex items-center space-x-6 mt-2">
        <button onClick={() => addTime(name, 30)}>
          <Icon.CirclePlus className="w-5 h-5 text-gray-500" />
        </button>
        <button onClick={() => addTime(name, -30)}>
          <Icon.CircleMinus className="w-5 h-5 text-gray-500" />
        </button>

        <Sheet key="top">
          <SheetTrigger asChild>
            <button>
              <Icon.Pencil className="w-5 h-5 text-gray-500" />
            </button>
          </SheetTrigger>

          <SheetContent side="top" className="max-w-md mx-auto">
            <SheetHeader>
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
                        <Input
                          placeholder="shadcn"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter>
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