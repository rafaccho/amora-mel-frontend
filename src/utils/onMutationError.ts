import { toast } from "react-toastify";

export function onMutationError(...args: any[]) {
    if(args[1] === 400) return toast.warn('Este registro está sendo utilizado pelo sistema')
    toast.error("Ocorreu um erro!")
}