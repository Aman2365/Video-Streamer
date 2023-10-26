import { AxiosError } from "axios";
import router from "next/router";
import toast from "react-hot-toast";

export function handleAPIError(e: any) {
  if (!e || !e.statusCode) return;
    const statusCode: number = e.statusCode;
    const message: string = e.message;
    switch (statusCode) {
      case 500:
        toast.error('Server Error!');
        break;
      case 404:
        toast.error(message || 'Not Found!');
        break;
      case 403:
        toast.error(message || 'error');
        break;
      case 400:
        toast.error(message || 'Not Found!');
        break;
      case 401:
        // router.push('/');
        window.location.replace("/");
        break;
      default:
        toast.error(message || 'failed');
        break;
    }
  }