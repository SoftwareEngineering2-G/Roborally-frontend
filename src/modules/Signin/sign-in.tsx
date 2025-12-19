"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ElectricBorder from "@/components/ElectricBorder/electric-border";
import { useSigninMutation } from "@/redux/api/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast-handler";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(100).trim(),
  password: z.string().min(4, "Password must be at least 4 characters").max(100).trim(),
});

type FormData = z.infer<typeof formSchema>;

/**
 * @author Sachin Baral 2025-09-15 08:43:34 +0200 46
 */
export const SignIn = () => {
  const [signin, { isLoading, error, isSuccess, data }] = useSigninMutation();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    await signin({
      username: data.username,
      password: data.password,
    });
  };

  // Handle success
  useEffect(() => {
    if (isSuccess && data) {
      // Store username AND JWT token in localStorage
      localStorage.setItem("username", data.username);
      localStorage.setItem("jwt_token", data.token);

      showSuccessToast(
        "Pilot Authenticated",
        "Welcome back to the RoboRally arena! Robot systems online."
      );

      // Redirect to main page
      router.push("/");
    }
  }, [isSuccess, data, router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showErrorToast(error, "Failed to authenticate pilot");
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
          <Card className="glass-panel glow-teal">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center glow-teal"
              >
                <Zap className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-neon-magenta">RoboRally</CardTitle>
              <CardDescription className="text-lg text-chrome-light">
                Power up your robot and enter the arena
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-chrome-light font-medium">Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your pilot name"
                            {...field}
                            className="bg-surface-dark border-neon-teal/30 focus:border-neon-teal focus:ring-neon-teal text-foreground placeholder:text-metallic"
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
                        <FormLabel className="text-chrome-light font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your access code"
                            {...field}
                            className="bg-surface-dark border-neon-teal/30 focus:border-neon-teal focus:ring-neon-teal text-foreground placeholder:text-metallic"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-secondary hover:glow-magenta text-accent-foreground font-bold py-3 text-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
              <div className="mt-6 text-center">
                <p className="text-metallic">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-neon-magenta hover:text-neon-blue transition-colors font-medium"
                  >
                    Sign Up
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
