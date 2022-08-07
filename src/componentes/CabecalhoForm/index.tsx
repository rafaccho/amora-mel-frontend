import { BotoesForm } from "../BotoesForm";

export function CabecalhoForm(props: {
    titulo: string;
    botoesForm: {
        onSalvar: () => void;
        onEditar: () => void;
        onDeletar: () => void;
    }
}) {
    return (
        <div className="header-form">
            <h1 className="t-1 mb-2">{props.titulo}</h1>

            <BotoesForm
                onSalvar={props.botoesForm.onSalvar}
                onEditar={props.botoesForm.onEditar}
                onDeletar={props.botoesForm.onDeletar}
            />

            <div className="mb-8 border-b-4 border-orange-700" />
        </div>
    )
}