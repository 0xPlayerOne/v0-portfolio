<<<<<<< HEAD
import * as React from 'react'

import { cn } from '@/lib/utils'
=======
import * as React from "react";

import { cn } from "@/lib/utils";
>>>>>>> origin/staging

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
<<<<<<< HEAD
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
=======
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
>>>>>>> origin/staging
        )}
        ref={ref}
        {...props}
      />
<<<<<<< HEAD
    )
  }
)
Input.displayName = 'Input'
=======
    );
  },
);
Input.displayName = "Input";
>>>>>>> origin/staging

export { Input };
