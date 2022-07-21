import { BotoesForm } from "../BotoesForm";

export function CabecalhoForm(props: {title: string}) {
    return (
        <div className="p-5">
                        <h1 className="t-1 mb-8">{props.title}</h1>

<BotoesForm />

        </div>
    )
}