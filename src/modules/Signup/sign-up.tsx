"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { UserPlus, Loader2, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import ElectricBorder from "@/components/ElectricBorder/electric-border";
import { useSignupMutation } from "@/redux/api/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast-handler";

const formSchema = z.object({
  username: z.string().min(2).max(100).trim().nonempty(),
  password: z.string().min(4).max(100).trim().nonempty(),
  birthday: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export const Signup = () => {
  const [signup, { isLoading, error, isSuccess, data }] = useSignupMutation();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      birthday: new Date(),
    },
  });

  const onSubmit = async (data: FormData) => {
    await signup({
      username: data.username,
      password: data.password,
      birthday: format(data.birthday, "yyyy-MM-dd"),
    });
  };

  // Handle success
  useEffect(() => {
    if (isSuccess && data) {
      // Store username AND JWT token in localStorage
      localStorage.setItem("username", data.username);
      localStorage.setItem("jwt_token", data.token);

      showSuccessToast(
        "Pilot Registration Complete",
        "Welcome to the RoboRally arena! You can now command your robot."
      );

      // Redirect to main page
      router.push("/");
    }
  }, [isSuccess, data, router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showErrorToast(error, "Failed to create pilot profile");
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 circuit-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={1}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <Card className="glass-panel glow-magenta">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center glow-magenta"
              >
                <UserPlus className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-neon-magenta">
                Join RoboRally
              </CardTitle>
              <CardDescription className="text-lg text-chrome-light">
                Create your pilot profile and command your robot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-chrome-light font-medium">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Choose your pilot name"
                            {...field}
                            className="bg-surface-dark border-neon-magenta/30 focus:border-neon-magenta focus:ring-neon-magenta text-foreground placeholder:text-metallic"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-chrome-light font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Secure access code"
                            {...field}
                            className="bg-surface-dark border-neon-magenta/30 focus:border-neon-magenta focus:ring-neon-magenta text-foreground placeholder:text-metallic"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-chrome-light font-medium">
                          Date of birth
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"default"}
                                className={
                                  "bg-transparent hover:bg-transparent text-foreground border-1 border-neon-magenta/30 justify-start text-left "
                                }
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Your date of birth is used to calculate your age.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-secondary hover:glow-magenta text-accent-foreground font-bold py-3 text-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
              <div className="mt-6 text-center">
                <p className="text-metallic">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-neon-magenta hover:text-neon-blue transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </ElectricBorder>
      </motion.div>
    </div>
  );
};
