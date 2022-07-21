import { useNavigate } from "react-router-dom";

export function BotoesForm() {
    const navigate = useNavigate()

    return (
        <div id="botoes" className="flex justify-end gap-3 mb-12">
            <button className="btn-l">Salvar</button>
            <button className="btn-l">Editar</button>
            <button onClick={() => navigate("/app/produtos/")} className="btn-l">Voltar</button>
        </div>
    )
}