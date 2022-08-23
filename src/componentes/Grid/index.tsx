import { useQuery } from 'react-query'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Filtros } from '../Filtros'
import { useBackend } from "../../hooks/useBackend"
import { Button } from '../../tags'
import { Endpoint } from "../../tipos"
import { BackendResponse, ExibicaoDadoGridConfig } from "../../interfaces";
import { useState } from 'react'

export function Grid(props: {
    exibicaoDadosConfig: ExibicaoDadoGridConfig[],
    requisicaoConfig: {
        endpoint: Endpoint,
        filtros?: string,
    },
    refresh?: () => void,
    naoExibirCodigo?: boolean,
}) {
    const [ filtro, setFiltro ] = useState('')
    const [ paginalAtual, setPaginalAtual ] = useState(1)
    const [ totalPaginas, setTotalPaginas ] = useState(0)
    
    const navigate = useNavigate()

    const { todosRegistros } = useBackend(props.requisicaoConfig.endpoint)
    const {
        data,
        refetch
    } = useQuery(
        [props.requisicaoConfig.endpoint, props.requisicaoConfig.filtros || '', `&search=${filtro}`],
        () => todosRegistros(undefined, props.requisicaoConfig.filtros ? props.requisicaoConfig.filtros + `&search=${filtro}` : /* queryClient.invalidateQueries([props.endpoint])
        props.refresh()
        const requisicao = toast.loading(`Pesquisando...`)

        toast.update(requisicao, {
            type: 'success',
            render: 'Dados atualizados!',
            ...DEFAULT_TOAST_CONFIG
        }) */'' + `&search=${filtro}`),
    )


    function calcularQuantidadePaginas() {
        const dadosResponse = data?.data as BackendResponse
        let quantidadeTotalPaginas;

        if(dadosResponse) {
            const divisao = dadosResponse.count / 8

            if (divisao < 1) quantidadeTotalPaginas = 1
            else if (divisao % 1 === 0) quantidadeTotalPaginas = divisao
            else quantidadeTotalPaginas = Math.floor(divisao) + 1
        }
        return quantidadeTotalPaginas
    }

    return (
        <div id={`grid-${props.requisicaoConfig.endpoint}`} className="w-full">

            <Filtros
                refresh={refetch}
                endpoint={props.requisicaoConfig.endpoint}
                filtro={filtro}
                setFiltro={setFiltro}
            />

            <div className="my-8" />

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden rounded-lg">

                            <table className="min-w-full divide-y divide-blue-900">

                                <thead className="bg-blue-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>

                                        {
                                            props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoGridConfig) => (
                                                <th key={dadoExibicao.coluna + dadoExibicao.chaveApi} scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">
                                                    {dadoExibicao.coluna}
                                                </th>
                                            ))
                                        }

                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-blue-900">
                                    {
                                        data?.data.results.map((registro: any) => (
                                            <motion.tr key={registro.uuid} className="bg-blue-200 cursor-pointer"
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} 
                                                onClick={() => navigate(`editar/${registro.uuid}/`)}
                                            >

                                                <td className="coluna-grid" />
                                                <td className="coluna-grid truncate">{registro.uuid}</td>
                                                { props.naoExibirCodigo && <td className="coluna-grid truncate">{registro.codigo}</td> }

                                                {
                                                    props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoGridConfig) => (
                                                        <td key={dadoExibicao.chaveApi + dadoExibicao.coluna} className="coluna-grid">
                                                            {registro[dadoExibicao.chaveApi]}
                                                        </td>
                                                    ))
                                                }

                                            </motion.tr>
                                        ))
                                    }
                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>
            </div>

            <div className="my-8" />

            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center md:justify-end gap-14">
                    <Button className="botao-azul-1 w-24 flex justify-center pt-3" titulo={<AiOutlineArrowLeft />} />
                    <span className='font-bold font-sans text-blue-700'>{paginalAtual} de {calcularQuantidadePaginas() || 0}</span>
                    <Button className="botao-azul-1 w-24 flex justify-center pt-3" titulo={<AiOutlineArrowRight />} />
                </div>
            </div>

        </div>
    )
}