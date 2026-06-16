import { useToastStore } from "@/stores/toast.store";

export function toastSuccess(title: string, description?: string) {
  useToastStore.getState().addToast({ title, description, type: "success" });
}

export function toastError(title: string, description?: string) {
  useToastStore.getState().addToast({ title, description, type: "error" });
}

export function toastInfo(title: string) {
  useToastStore.getState().addToast({ title, type: "info" });
}
