import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { Button } from "../../tags";
import { useBackend } from "../../hooks/useBackend";
import { Endpoint, QueryModulo } from "../../tipos";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useNavigate } from "react-router-dom";

export function CardRegistro(props: {
    onEditar: () => void,
    titulo: any,
    dados: any,
    endpoint: Endpoint,
    textosDeletar: { erro: string, sucesso: string },
    uuid: string,
    querys?: QueryModulo[],
    query?: QueryModulo,
}) {
    const { deletarRegistro } = useBackend(props.endpoint)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const deletar = useMutation((uuidRegistro: string) => deletarRegistro(uuidRegistro), {
        onSuccess: () => {
            toast.success(props.textosDeletar.sucesso, DEFAULT_TOAST_CONFIG)
            queryClient.invalidateQueries(props.querys)
        },
        onError: () => {
            toast.error(props.textosDeletar.erro, DEFAULT_TOAST_CONFIG)
        },
    })

    const location = '/app' + window.location.href.split('/app')[1] + '/' + 'editar' + '/' + props.uuid
    

    return (
        <div id="card" className="w-full h-96 bg-orange-400 rounded-md overflow-y-auto">
            <div id="card-header" className="bg-orange-700 rounded-md text-center font-bold py-1 sticky top-0">
                {props.titulo}
            </div>

            <div id="corpo-card" className="p-8">
                {
                    Object.keys(props.dados).map((chave: string, index: number) => (
                        <div key={chave} className="flex flex-col mb-4">
                            <b>{chave}</b>
                            <div className="w-full p-1 bg-orange-700 rounded-lg mb-1" />
                            <span>{Object.values(props.dados)[index] as string}</span>
                        </div>
                    ))
                }
            </div>


            <div id="rodape-card" className="p-4 bg-orange-700 sticky bottom-0">
                <div className="w-full flex lg:hidden justify-center gap-6">
                    <Button className="btn-l font-bold" title={"Editar"} onClick={() => {navigate(location);props.onEditar()}} />
                    <Button className="btn-l font-bold" title={"Deletar"} onClick={() => deletar.mutate(props.uuid)} />
                </div>
                
                <div className="w-full hidden lg:flex justify-center gap-6">
                    <Button className="btn-l font-bold" title={"Editar"} onClick={() => props.onEditar()} />
                    <Button className="btn-l font-bold" title={"Deletar"} onClick={() => deletar.mutate(props.uuid)} />
                </div>
            </div>

        </div>
    )
}