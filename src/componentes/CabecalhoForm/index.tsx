import { BotoesForm } from "../BotoesForm";
import { Endpoint } from "../../tipos";

export function CabecalhoForm(props: {
    titulo: string;
    botoesForm: {
        onSalvar: () => void,
        onDeletar: {
            endpoint: Endpoint;
            textoSucesso: string;
            textoErro: string;
        },
        validarCampos: () => boolean,
    }
}) {
    return (
        <div className="header-form">
            <h1 className="t-1 mb-2">{props.titulo}</h1>

            <BotoesForm
                onSalvar={props.botoesForm.onSalvar}
                onDeletar={props.botoesForm.onDeletar}
                validarCampos={props.botoesForm.validarCampos}
            />

            <div className="mb-8 border-b-4 border-orange-700" />
        </div>
    )
}