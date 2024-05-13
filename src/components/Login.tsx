"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function Login({
  isLoggedIn,
  showLoginSheet,
  setShowLoginSheet,
  handleLogin,
  handleLogout,
}: {
  isLoggedIn: boolean;
  showLoginSheet: boolean;
  setShowLoginSheet: (showLoginSheet: boolean) => void;
  handleLogin: (email: string, password: string) => any;
  handleLogout: () => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const serverStatus = await handleLogin(data.email, data.password);
      form.reset();
    } catch (error: any) {
      form.setError("password", {
        type: "server",
        message: error.data.message,
      });
      console.error("Login error:", error);
    }
  }

  return (
    <>
      {!isLoggedIn ? (
        <Sheet open={showLoginSheet}>
          <SheetTrigger asChild>
            <Button variant={"outline"} onClick={() => setShowLoginSheet(true)}>
              Login
            </Button>
          </SheetTrigger>
          <SheetContent side={"top"} className="max-w-md mx-auto">
            <SheetHeader className="sm:text-center">
              <SheetTitle>Get Access</SheetTitle>
              <SheetDescription>
                {
                  "Welcome! Enter your details and we'll identify if you're signing up or logging in."
                }
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4 pb-0"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right mt-2">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="col-span-3"
                          placeholder="youremail@example.com"
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right mt-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="col-span-3"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full" type="submit">
                      Enter
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      ) : (
        <Button variant={"outline"} onClick={handleLogout}>
          Logout
        </Button>
      )}
    </>
  );
}
