import toast from 'react-hot-toast';

export function showError(e: any) {
  toast?.error(e?.message || e || 'Error occurred, please try again later!');
}

export function showSuccess(mss: string, timeOut: number = 3000) {
  toast.success(mss, { duration: Number(timeOut) });
}

