import { cn } from "@/lib/utils";

/**
 * @author Sachin Baral 2025-09-15 08:43:34 +0200 3
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
