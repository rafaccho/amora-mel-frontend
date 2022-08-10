import { useQuery } from 'react-query'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Filtros } from '../Filtros'
import { useBackend } from "../../hooks/useBackend"
import { Button } from '../../tags'
import { Endpoint } from "../../tipos"
import { BackendResponse, ExibicaoDadoConfig } from "../../interfaces";
import { useState } from 'react'

export function Grid(props: {
    exibicaoDadosConfig: ExibicaoDadoConfig[],
    requisicaoConfig: {
        endpoint: Endpoint,
        filtros?: string,
    },
    refresh?: () => void,
    naoExibirCodigo?: boolean,
}) {
    const [ filtros, setFiltros ] = useState('')
    const [ paginalAtual, setPaginalAtual ] = useState(1)
    const [ totalPaginas, setTotalPaginas ] = useState('')
    
    const navigate = useNavigate()
    const { todosRegistros } = useBackend(props.requisicaoConfig.endpoint)
    const query = useQuery(props.requisicaoConfig.endpoint, () => todosRegistros({filtros: props.requisicaoConfig!.filtros}))

    function calcularQuantidadePaginas() {
        const dadosResponse = query.data?.data as BackendResponse
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
                refresh={props.refresh}
            />

            <div className="my-8" />

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden rounded-lg">

                            <table className="min-w-full divide-y divide-orange-900">

                                <thead className="bg-orange-600">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>

                                        {
                                            props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoConfig) => (
                                                <th key={dadoExibicao.coluna + dadoExibicao.chaveApi} scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">
                                                    {dadoExibicao.coluna}
                                                </th>
                                            ))
                                        }

                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-orange-900">
                                    {
                                        query.data?.data.results.map((registro: any) => (
                                            <motion.tr key={registro.uuid} className="bg-orange-400 hover:bg-orange-300 cursor-pointer"
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} 
                                                onClick={() => navigate(`editar/${registro.uuid}/`)}
                                            >

                                                <td className="coluna-grid" />
                                                <td className="coluna-grid truncate">{registro.uuid}</td>
                                                { props.naoExibirCodigo && <td className="coluna-grid truncate">{registro.codigo}</td> }

                                                {
                                                    props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoConfig) => (
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
                    <Button className="btn-l w-24 flex justify-center pt-3" title={<AiOutlineArrowLeft />} />
                    <span className='font-bold font-sans'>{paginalAtual} de {calcularQuantidadePaginas()}</span>
                    <Button className="btn-l w-24 flex justify-center pt-3" title={<AiOutlineArrowRight />} />
                </div>
            </div>

        </div>
    )
}