import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { Button } from "../../tags";

export function BotoesForm(props: {
    onSalvar: () => void;
    onDeletar: () => void;
    validarCampos: () => boolean;
}) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const urlVoltar = pathname.match('cadastrar/')
        ? pathname.replace('cadastrar/', '')
        : pathname.split('/').splice(0, 3).join('/') + '/'

    return (
        <div id="botoes" className="flex justify-end gap-3 my-12">
            <Button className="btn-l" title="Salvar"
                onClick={() => !props.validarCampos() ? toast.error('Preencha todos os campos', DEFAULT_TOAST_CONFIG) : props.onSalvar()}
            />
            <Button className="btn-l" title="Editar"
                onClick={() => props.onSalvar()}
            />
            <Button className="btn-l" title="Deletar"
                onClick={() => props.onDeletar()}
            />
            <Button className="btn-l" title="Voltar"
                onClick={() => navigate(urlVoltar)} 
            />
        </div>
    )
}