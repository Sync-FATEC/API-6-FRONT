import { toast as sonnerToast } from "sonner"

type ToastType = "success" | "warning" | "error"

function createToast(type: ToastType) {
  return (title: string, description?: string) => {
    sonnerToast[type](title, { description })
  }
}

export const toast = {
  success: createToast("success"),
  warning: createToast("warning"),
  error: createToast("error"),
}
