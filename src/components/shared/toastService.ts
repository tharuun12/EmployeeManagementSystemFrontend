import { toast, ToastOptions } from "react-toastify";

const DEFAULT_OPTS: ToastOptions = {
  position: "top-right",
  autoClose: 500, 
  pauseOnHover: true,
  draggable: true,
};


export const notifySuccess = (msg: string, opts?: ToastOptions) =>
  toast.success(msg, { ...DEFAULT_OPTS, ...opts });

export const notifyError = (msg: string, opts?: ToastOptions) =>
  toast.error(msg, { ...DEFAULT_OPTS, ...opts });

export const notifyInfo = (msg: string, opts?: ToastOptions) =>
  toast.info(msg, { ...DEFAULT_OPTS, ...opts });
