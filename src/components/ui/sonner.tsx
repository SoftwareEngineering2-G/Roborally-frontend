"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <>
      {/* Custom keyframes for ultra-flashy effects */}
      <style jsx global>{`
        @keyframes toast-slide-in {
          0% {
            transform: translateX(100%) scale(0.8) rotateY(45deg);
            opacity: 0;
            filter: blur(4px);
          }
          50% {
            transform: translateX(-10px) scale(1.05) rotateY(-5deg);
            filter: blur(0px);
          }
          100% {
            transform: translateX(0) scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes cyber-pulse {
          0%,
          100% {
            box-shadow: 0 0 5px hsl(var(--neon-teal) / 0.5),
              0 0 10px hsl(var(--neon-teal) / 0.3),
              0 0 15px hsl(var(--neon-teal) / 0.1),
              inset 0 1px 0 hsl(var(--neon-teal) / 0.2);
            border-color: hsl(var(--neon-teal) / 0.6);
          }
          50% {
            box-shadow: 0 0 20px hsl(var(--neon-teal) / 0.8),
              0 0 30px hsl(var(--neon-teal) / 0.6),
              0 0 40px hsl(var(--neon-teal) / 0.4),
              0 0 50px hsl(var(--neon-teal) / 0.2),
              inset 0 1px 0 hsl(var(--neon-teal) / 0.4);
            border-color: hsl(var(--neon-teal));
            transform: scale(1.02);
          }
        }

        @keyframes success-flash {
          0%,
          100% {
            box-shadow: 0 0 10px hsl(var(--neon-lime) / 0.6),
              0 0 20px hsl(var(--neon-lime) / 0.4),
              0 0 30px hsl(var(--neon-lime) / 0.2),
              inset 0 0 20px hsl(var(--neon-lime) / 0.1);
          }
          50% {
            box-shadow: 0 0 25px hsl(var(--neon-lime) / 1),
              0 0 35px hsl(var(--neon-lime) / 0.8),
              0 0 45px hsl(var(--neon-lime) / 0.6),
              0 0 60px hsl(var(--neon-lime) / 0.4),
              inset 0 0 30px hsl(var(--neon-lime) / 0.2);
            transform: scale(1.05);
          }
        }

        @keyframes error-alert {
          0%,
          100% {
            box-shadow: 0 0 10px hsl(var(--neon-magenta) / 0.7),
              0 0 20px hsl(var(--neon-magenta) / 0.5),
              0 0 30px hsl(var(--neon-magenta) / 0.3);
          }
          25%,
          75% {
            box-shadow: 0 0 30px hsl(var(--neon-magenta) / 1),
              0 0 40px hsl(var(--neon-magenta) / 0.8),
              0 0 50px hsl(var(--neon-magenta) / 0.6),
              0 0 70px hsl(var(--neon-magenta) / 0.4);
            transform: scale(1.03) translateX(2px);
          }
          50% {
            transform: scale(1.03) translateX(-2px);
          }
        }

        @keyframes data-stream {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>

      <Sonner
        theme="dark"
        className="toaster group"
        position="top-right"
        toastOptions={{
          classNames: {
            toast: `
              group toast 
              group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-surface-dark group-[.toaster]:via-surface-dark group-[.toaster]:to-surface-medium/50
              group-[.toaster]:text-foreground 
              group-[.toaster]:border-2 
              group-[.toaster]:border-neon-teal/40 
              group-[.toaster]:backdrop-blur-md 
              group-[.toaster]:rounded-2xl 
              group-[.toaster]:relative
              group-[.toaster]:overflow-hidden
              group-[.toaster]:font-bold
              group-[.toaster]:tracking-wide
              group-[.toaster]:animate-[toast-slide-in_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)]
              group-[.toaster]:shadow-[0_0_20px_hsl(var(--neon-teal)/0.3),inset_0_1px_0_hsl(var(--chrome-light)/0.1)]

              data-[type=success]:group-[.toaster]:border-neon-lime/60 
              data-[type=success]:group-[.toaster]:animate-[success-flash_2s_ease-in-out_infinite]
              data-[type=success]:group-[.toaster]:bg-gradient-to-br 
              data-[type=success]:group-[.toaster]:from-surface-dark 
              data-[type=success]:group-[.toaster]:via-neon-lime/5 
              data-[type=success]:group-[.toaster]:to-surface-dark

              data-[type=error]:group-[.toaster]:border-neon-magenta/60 
              data-[type=error]:group-[.toaster]:animate-[error-alert_1.5s_ease-in-out_infinite]
              data-[type=error]:group-[.toaster]:bg-gradient-to-br 
              data-[type=error]:group-[.toaster]:from-surface-dark 
              data-[type=error]:group-[.toaster]:via-neon-magenta/5 
              data-[type=error]:group-[.toaster]:to-surface-dark

              data-[type=loading]:group-[.toaster]:animate-[cyber-pulse_1.5s_ease-in-out_infinite]
              data-[type=loading]:group-[.toaster]:bg-gradient-to-br
              data-[type=loading]:group-[.toaster]:from-surface-dark
              data-[type=loading]:group-[.toaster]:via-neon-teal/10
              data-[type=loading]:group-[.toaster]:to-surface-dark

              before:group-[.toaster]:content-['']
              before:group-[.toaster]:absolute
              before:group-[.toaster]:inset-0
              before:group-[.toaster]:bg-gradient-to-r
              before:group-[.toaster]:from-transparent
              before:group-[.toaster]:via-neon-teal/10
              before:group-[.toaster]:to-transparent
              before:group-[.toaster]:animate-[data-stream_3s_linear_infinite]
              before:group-[.toaster]:pointer-events-none

              after:group-[.toaster]:content-['']
              after:group-[.toaster]:absolute
              after:group-[.toaster]:top-0
              after:group-[.toaster]:left-0
              after:group-[.toaster]:right-0
              after:group-[.toaster]:h-[1px]
              after:group-[.toaster]:bg-gradient-to-r
              after:group-[.toaster]:from-transparent
              after:group-[.toaster]:via-neon-teal/60
              after:group-[.toaster]:to-transparent
              after:group-[.toaster]:pointer-events-none
            `,
            description: `
              group-[.toast]:text-chrome-light 
              group-[.toast]:text-sm 
              group-[.toast]:font-medium
              group-[.toast]:tracking-wider
              group-[.toast]:opacity-90
            `,
            actionButton: `
              group-[.toast]:bg-gradient-to-r 
              group-[.toast]:from-neon-teal 
              group-[.toast]:to-neon-blue
              group-[.toast]:text-background 
              group-[.toast]:font-bold
              group-[.toast]:tracking-wider
              group-[.toast]:border-2
              group-[.toast]:border-neon-teal/50
              group-[.toast]:rounded-lg 
              group-[.toast]:px-4
              group-[.toast]:py-2
              group-[.toast]:transition-all 
              group-[.toast]:duration-300
              group-[.toast]:hover:scale-105
              group-[.toast]:hover:shadow-[0_0_20px_hsl(var(--neon-teal)/0.8)]
              group-[.toast]:hover:border-neon-teal
              group-[.toast]:active:scale-95
              group-[.toast]:relative
              group-[.toast]:overflow-hidden
              
              before:group-[.toast]:content-['']
              before:group-[.toast]:absolute
              before:group-[.toast]:inset-0
              before:group-[.toast]:bg-gradient-to-r
              before:group-[.toast]:from-transparent
              before:group-[.toast]:via-white/20
              before:group-[.toast]:to-transparent
              before:group-[.toast]:translate-x-[-100%]
              before:group-[.toast]:transition-transform
              before:group-[.toast]:duration-500
              hover:before:group-[.toast]:translate-x-[100%]
            `,
            cancelButton: `
              group-[.toast]:bg-gradient-to-r 
              group-[.toast]:from-surface-medium 
              group-[.toast]:to-surface-light
              group-[.toast]:text-chrome-light 
              group-[.toast]:font-medium
              group-[.toast]:border
              group-[.toast]:border-chrome-dark/50
              group-[.toast]:rounded-lg 
              group-[.toast]:px-4
              group-[.toast]:py-2
              group-[.toast]:transition-all 
              group-[.toast]:duration-300
              group-[.toast]:hover:bg-surface-light
              group-[.toast]:hover:text-foreground
              group-[.toast]:hover:border-chrome-light/50
              group-[.toast]:hover:scale-105
              group-[.toast]:active:scale-95
            `,
            title: `
              group-[.toast]:text-foreground 
              group-[.toast]:font-black
              group-[.toast]:text-lg
              group-[.toast]:tracking-wider
              group-[.toast]:uppercase
              group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-teal)/0.5)]
              
              data-[type=success]:group-[.toast]:text-neon-lime 
              data-[type=success]:group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-lime)/0.8)]
              data-[type=success]:group-[.toast]:animate-pulse
              
              data-[type=error]:group-[.toast]:text-neon-magenta 
              data-[type=error]:group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-magenta)/0.8)]
              
              data-[type=loading]:group-[.toast]:text-neon-teal
              data-[type=loading]:group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-teal)/0.8)]
            `,
            icon: `
              group-[.toast]:text-2xl
              group-[.toast]:drop-shadow-[0_0_6px_hsl(var(--neon-teal)/0.6)]
              group-[.toast]:animate-pulse
              
              data-[type=success]:group-[.toast]:text-neon-lime 
              data-[type=success]:group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-lime)/0.8)]
              data-[type=success]:group-[.toast]:animate-bounce
              
              data-[type=error]:group-[.toast]:text-neon-magenta 
              data-[type=error]:group-[.toast]:drop-shadow-[0_0_8px_hsl(var(--neon-magenta)/0.8)]
              data-[type=error]:group-[.toast]:animate-pulse
              
              data-[type=loading]:group-[.toast]:text-neon-teal
              data-[type=loading]:group-[.toast]:animate-spin
            `,
          },
          style: {
            fontFamily: "var(--font-tomorrow)",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
