import { toast } from "react-toastify";
import { ReponseStatus } from "../tipos";

export function promisseHandler(statusResponse: ReponseStatus, objCallbackStatus: { [Status in ReponseStatus]?: () => void }) {
    console.log(objCallbackStatus, statusResponse, objCallbackStatus[statusResponse],);
    
    const callback = objCallbackStatus[statusResponse];
    if (callback) callback();
    else toast.error(`Erro ao processar requisição. Status: ${statusResponse}`)   
}