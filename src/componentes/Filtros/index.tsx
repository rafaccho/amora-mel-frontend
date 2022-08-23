import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi'
import { BsSearch } from 'react-icons/bs'
import { Button } from "../../tags";
import { toast } from 'react-toastify';
import { DEFAULT_TOAST_CONFIG } from '../../constantes';
import { useQueryClient } from 'react-query';

export function Filtros(props: { refresh: any, endpoint: string, filtro: string, setFiltro: any }) {
    const navigate = useNavigate()
    return (
        <div id="filtros">
            <div className="grid grid-cols-12 gap-5">

                <div className="col-span-10 md:col-span-12 lg:col-span-8">
                    <input type="text" placeholder="Pesquise qualquer coisa..." value={props.filtro} onChange={e => props.setFiltro(e.target.value)} />
                </div>

                <div className="col-span-2 md:col-span-4 lg:col-span-1 flex justify-center md:justify-end">
                    <Button className="botao-azul-1 pb-3 w-full flex justify-center pt-3" titulo={<BsSearch />}
                        onClick={async () => {
                            /* queryClient.invalidateQueries([props.endpoint])
                            props.refresh()
                            const requisicao = toast.loading(`Pesquisando...`)

                            toast.update(requisicao, {
                                type: 'success',
                                render: 'Dados atualizados!',
                                ...DEFAULT_TOAST_CONFIG
                            }) */
                        }}
                    />
                </div>

                <div className="col-span-8 md:col-span-4 lg:col-span-2 lg:order-last flex justify-center md:justify-end">
                    <Button className="botao-azul-1 w-full font-medium" titulo="Adicionar" onClick={() => navigate('cadastrar/')} />
                </div>

                <div className="col-span-4 md:col-span-4 lg:col-span-1 flex justify-center md:justify-end">
                    <Button className="botao-azul-1 pb-3 w-full flex justify-center pt-3" titulo={<FiRefreshCw />}
                        onClick={() => {
                        }}
                    />
                </div>

            </div>
        </div>
    )
}