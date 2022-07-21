import { Button } from "../../tags";

export function CardAreaEntrega(props: {
    onEditar: () => void,
    // onSalvar: () => void,
    titulo: any,
    dados: any,
}) {
    return (
        <div id="card" className="w-full h-52 bg-orange-400 rounded-md overflow-y-auto">
            <div id="card-header" className="bg-orange-600 rounded-md text-center font-bold py-1">
                {props.titulo}
            </div>

            <div id="card-body" className="p-4">

                {
                    Object.keys(props.dados).map((key: string, index: number) => (
                        <div key={key} className="flex flex-col mb-4">
                            <b>{key}</b>

                            <div className="w-full p-1 bg-orange-700 rounded-lg mb-1" />
                            <span>{Object.values(props.dados)[index] as string}</span>
                        </div>
                    ))
                }

                <div className="w-full flex justify-center">
                    <Button className="btn-l font-bold" title={"Editar"} onClick={() => props.onEditar()} />
                </div>

            </div>
        </div>
    )
}