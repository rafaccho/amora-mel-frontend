import { toast } from "react-toastify";
import { ReponseCodigoStatus } from "../tipos";

export function promisseHandler(statusResponse: ReponseCodigoStatus, objCallbackStatus: { [Status in ReponseCodigoStatus]?: () => void }) {
    const callback = objCallbackStatus[statusResponse]

    if (callback) callback();
    else toast.error(`Erro ao processar requisição. Status: ${statusResponse}`)   
}