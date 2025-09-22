"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  taskname: z.string().min(1, {
    message: "Task name must be at least 1 characters.",
  }),
});

interface TaskProps {
  addTask: (taskName: string) => void;
}

export function NewTask({ addTask }: TaskProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskname: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addTask(data.taskname);
    form.reset();
  }

  return (
    <div className="py-3 px-4 sm:px-0 border-t border-gray-200 dark:border-gray-800">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl flex items-center justify-between"
        >
          <FormField
            control={form.control}
            name="taskname"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Add new task"
                    {...field}
                    className="w-full"
                    type="text"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="ml-4"
            size="sm"
            variant="outline"
            title="Add task"
          >
            <Icon.CheckIcon className="w-5 h-5" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
