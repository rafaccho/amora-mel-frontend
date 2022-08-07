import { useNavigate, useLocation } from "react-router-dom";

export function BotoesForm(props: {
    onSalvar: () => void;
    onDeletar: () => void;
}) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const urlVoltar = pathname.match('cadastrar/')
        ? pathname.replace('cadastrar/', '')
        : pathname.split('/').splice(0, 3).join('/') + '/'

    return (
        <div id="botoes" className="flex justify-end gap-3 my-12">
            <button className="btn-l"
                onClick={() => props.onSalvar()}
            >Salvar</button>
            <button className="btn-l"
                onClick={() => props.onSalvar()}
            >Editar</button>
            <button className="btn-l"
                onClick={() => props.onDeletar()}
            >Deletar</button>
            <button onClick={() => navigate(urlVoltar)} className="btn-l">Voltar</button>
        </div>
    )
}