<<<<<<< HEAD
'use client'

import { useToast } from '@/hooks/use-toast'
=======
"use client";

import { useToast } from "@/hooks/use-toast";
>>>>>>> origin/staging
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
<<<<<<< HEAD
} from '@/components/ui/toast'
=======
} from "@/components/ui/toast";
>>>>>>> origin/staging

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
