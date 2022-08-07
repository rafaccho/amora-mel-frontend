import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { Button } from "../../tags";
import { Endpoint } from "../../tipos";

export function BotoesForm(props: {
    onSalvar: () => void;
    onDeletar: {
        endpoint: Endpoint;
        textoSucesso: string;
        textoErro: string;
    }
    validarCampos: () => boolean;
}) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    
    const { deletarRegistro } = useBackend(props.onDeletar.endpoint)
    const { pathname } = useLocation()

    const urlVoltar = pathname.match('cadastrar/')
        ? pathname.replace('cadastrar/', '')
        : pathname.split('/').splice(0, 3).join('/') + '/'

    const mutation = useMutation(() => deletarRegistro(pathname.split('/')[4]), {
        onSuccess: () => {
            toast.success(props.onDeletar.textoSucesso, DEFAULT_TOAST_CONFIG)
            queryClient.invalidateQueries(props.onDeletar.endpoint)
            navigate(urlVoltar)
        },
        onError: () => {
            toast.error(props.onDeletar.textoErro, DEFAULT_TOAST_CONFIG)
        },
    })

    return (
        <div id="botoes" className="flex justify-end gap-3 my-12">
            <Button className="btn-l" title="Salvar"
                onClick={() => !props.validarCampos() ? toast.error('Preencha todos os campos', DEFAULT_TOAST_CONFIG) : props.onSalvar()}
            />
            <Button className="btn-l" title="Deletar"
                onClick={() => mutation.mutate()}
            />
            <Button className="btn-l" title="Voltar"
                onClick={() => navigate(urlVoltar)} 
            />
        </div>
    )
}