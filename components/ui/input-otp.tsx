<<<<<<< HEAD
'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '@/lib/utils'
=======
"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";
>>>>>>> origin/staging

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
<<<<<<< HEAD
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName
=======
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName,
>>>>>>> origin/staging
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
<<<<<<< HEAD
))
InputOTP.displayName = 'InputOTP'
=======
));
InputOTP.displayName = "InputOTP";
>>>>>>> origin/staging

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'
=======
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";
>>>>>>> origin/staging

const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
<<<<<<< HEAD
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className
=======
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
>>>>>>> origin/staging
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
<<<<<<< HEAD
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'
=======
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
>>>>>>> origin/staging

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
<<<<<<< HEAD
))
InputOTPSeparator.displayName = 'InputOTPSeparator'
=======
));
InputOTPSeparator.displayName = "InputOTPSeparator";
>>>>>>> origin/staging

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
