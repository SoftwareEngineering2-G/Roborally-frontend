"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(100)
    .trim(),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(100)
    .trim(),
});

type FormData = z.infer<typeof formSchema>;

export const SignIn = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormData) => {
    console.log("Login data:", data);
    // TODO: Implement actual login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 circuit-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
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
            <CardTitle className="text-3xl font-bold text-neon-magenta">
              RoboRally
            </CardTitle>
            <CardDescription className="text-lg text-chrome-light">
              Power up your robot and enter the arena
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <>
                        <Label
                          htmlFor="username"
                          className="text-chrome-light font-medium"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your pilot name"
                          {...field}
                          required
                          className="bg-surface-dark border-neon-teal/30 focus:border-neon-teal focus:ring-neon-teal text-foreground placeholder:text-metallic"
                        />
                      </>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <Label
                          htmlFor="password"
                          className="text-chrome-light font-medium"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your access code"
                          {...field}
                          required
                          className="bg-surface-dark border-neon-teal/30 focus:border-neon-teal focus:ring-neon-teal text-foreground placeholder:text-metallic"
                        />
                      </>
                    )}
                  />
                </div>
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
                        Connecting...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-metallic">
                Don't have an account?{" "}
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
      </motion.div>
    </div>
  );
};
