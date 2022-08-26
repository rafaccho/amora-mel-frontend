import { useQuery } from 'react-query'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Filtros } from '../Filtros'
import { useBackend } from "../../hooks/useBackend"
import { Button } from '../../tags'
import { Endpoint } from "../../tipos"
import { BackendResponse, ExibicaoDadoGridConfig } from "../../interfaces";
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { DEFAULT_TOAST_CONFIG } from '../../constantes'

export function Grid(props: {
    exibicaoDadosConfig: ExibicaoDadoGridConfig[],
    requisicaoConfig: {
        endpoint: Endpoint,
        filtros?: string,
    },
    refresh?: () => void,
    naoExibirCodigo?: boolean,
}) {
    const [filtroInput, setFiltroInput] = useState('')
    const [paginalAtual, setPaginalAtual] = useState(1)
    const [pagina, setPagina] = useState('1')

    const inputFiltro = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()
    const location = useLocation()

    let filtro = props.requisicaoConfig.filtros ? props.requisicaoConfig.filtros + `&search=${filtroInput}` : `page=${pagina}&search=${filtroInput}`

    const { todosRegistros } = useBackend(props.requisicaoConfig.endpoint)
    const {
        data,
        refetch
    } = useQuery(
        [props.requisicaoConfig.endpoint, filtro],
        () => todosRegistros(undefined, filtro),
    )

    function calcularQuantidadePaginas() {
        const dadosResponse = data?.data as BackendResponse
        let quantidadeTotalPaginas;

        if (dadosResponse) {
            const divisao = dadosResponse.count / 8

            if (divisao < 1) quantidadeTotalPaginas = 1
            else if (divisao % 1 === 0) quantidadeTotalPaginas = divisao
            else quantidadeTotalPaginas = Math.floor(divisao) + 1
        }
        return quantidadeTotalPaginas
    }

    useEffect(() => {
        setFiltroInput('')
        if (inputFiltro.current) inputFiltro.current.value = ''
    }, [location.pathname])

    return (
        <div id={`grid-${props.requisicaoConfig.endpoint}`} className="w-full">

            <Filtros
                refresh={refetch}
                endpoint={props.requisicaoConfig.endpoint}
                filtro={filtroInput}
                setFiltro={setFiltroInput}
                refInputFiltro={inputFiltro}
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
                                                {props.naoExibirCodigo && <td className="coluna-grid truncate">{registro.codigo}</td>}

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
                    <Button className="botao-azul-1 w-24 flex justify-center pt-3" titulo={<AiOutlineArrowLeft />}
                        onClick={() => {
                            const numPagina = data?.data.previous
                            if (paginalAtual === 1 || !numPagina) return toast.warn('Você está na primeira página', DEFAULT_TOAST_CONFIG)
                            if (numPagina) {
                                setPaginalAtual(paginalAtual - 1)
                                try { setPagina(numPagina.split('?')[1].match(/\d/)[0]) }
                                catch (e) { setPagina('1') }
                            }
                        }}
                    />
                    <span className='font-bold font-sans text-blue-700'>{paginalAtual} de {calcularQuantidadePaginas() || 0}</span>
                    <Button className="botao-azul-1 w-24 flex justify-center pt-3" titulo={<AiOutlineArrowRight />}
                        onClick={() => {
                            const numPagina = data?.data.next
                            if (paginalAtual === calcularQuantidadePaginas() || !numPagina) return toast.warn('Você está na última página', DEFAULT_TOAST_CONFIG)
                            if (numPagina) {
                                setPaginalAtual(paginalAtual + 1)
                                setPagina(numPagina.split('?')[1].match(/\d/)[0])
                            }
                        }}
                    />
                </div>
            </div>

        </div>
    )
}