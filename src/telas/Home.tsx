import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../componentes/Modal";
import { DEFAULT_TOAST_CONFIG } from "../constantes";
import { useBackend } from "../hooks/useBackend";
import { Pedido, PedidoItem } from "../interfaces";
import { Button } from "../tags";

export function Home() {
    const [uuidPedidoExibicao, setUuidPedidoExibicao] = useState('');

    const [modalAberto, setModalAberto] = useState(false);
    const [modalPedidosAberto, setModalPedidosAberto] = useState(false);
    const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
    const [modalComprasAberto, setModalComprasAberto] = useState(false);
    const [modalAndamentoPedidoAberto, setModalAndamentoPedidoAberto] = useState(false);

    const [pedidosEmitidos, setPedidosEmitidos] = useState<Pedido[]>([])
    const [pedidosAbertos, setPedidosAbertos] = useState<Pedido[]>([])
    const [itensExbicao, setItensExbicao] = useState<PedidoItem[]>([])


    const exibicaoPedidosModal = useRef<HTMLDivElement>(null)
    const exibicaoItensPedidoModal = useRef<HTMLDivElement>(null)
    const tabelaPedidosAbertos = useRef<HTMLTableElement>(null)


    const { todosRegistros, umRegistro, editarRegistro } = useBackend('pedidos')

    const queryClient = useQueryClient()

    const { data: dadosPedidosEmitidos, status: statusPedidosEmitidos, refetch: refreshPedidosEmitidos } = useQuery(
        'pedidos-emitidos',
        () => todosRegistros(undefined, `status=E`)
    )

    const { data: dadosPedidosAbertos, status: statusPedidosAbertos, refetch: refreshPedidosAbertos } = useQuery(
        'pedidos-abertos',
        () => todosRegistros(undefined, `status=A`)
    )

    const { data: dadosPedidosCancelados, status: statusPedidosCancelados, refetch: refreshPedidosCancelados } = useQuery(
        'pedidos-cancelados',
        () => todosRegistros(undefined, `status=C`)
    )

    const { data: dadosPedidoExibicao, status: statusPedidoExibicao, refetch: refreshPedidoExibicao, isRefetching: estaRefreshingPedidoExibicao } = useQuery(
        ['pedido-exibicao', `pedido=${uuidPedidoExibicao}`],
        () => todosRegistros("pedidos_itens", `pedido=${uuidPedidoExibicao}`),
        { enabled: uuidPedidoExibicao != '' }
    )

    const { mutate: emitirPedido } = useMutation((uuid: string) => editarRegistro(uuid, { status: "E" }), {
        onSuccess: (response: any) => {
            const data = response.data as Pedido

            toast.success(`Pedido ${data.uuid} emitido com sucesso`, DEFAULT_TOAST_CONFIG)
            refreshPedidosAbertos()
            refreshPedidosEmitidos()
            queryClient.removeQueries(['pedidos-emitidos', 'pedidos-abertos']) // queryClient.invalidateQueries(['pedidos-emitidos', 'pedidos-abertos'])

        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })

    const abrirFecharModal = () => setModalAberto(!modalAberto)
    const abrirFecharModalPedidos = () => setModalPedidosAberto(!modalPedidosAberto)
    const abrirFecharModalEstoque = () => setModalEstoqueAberto(!modalEstoqueAberto)
    const abrirFecharModalCompras = () => setModalComprasAberto(!modalComprasAberto)
    const abrirFecharModalAndamentoPedidoAberto = () => setModalAndamentoPedidoAberto(!modalAndamentoPedidoAberto)

    const badgesStatus = {
        "E": <span className="p-1 rounded-lg bg-yellow-200 font-bold text-yellow-900">Emitido</span>,
        "A": <span className="p-1 rounded-lg bg-green-200 font-bold text-green-900">Aberto</span>,
        "C": <span className="p-1 rounded-lg bg-red-200 font-bold text-red-900">Cancelado</span>,
        "F": <span className="p-1 rounded-lg bg-sky-200 font-bold text-sky-900">Finalizado</span>,
    }

    useEffect(() => {
        statusPedidosEmitidos === "success" && setPedidosEmitidos(dadosPedidosEmitidos!.data.results as Pedido[])
    }, [statusPedidosEmitidos])

    useEffect(() => {
        statusPedidosAbertos === "success" && setPedidosEmitidos(dadosPedidosAbertos!.data.results as Pedido[])
    }, [statusPedidosAbertos])

    useEffect(() => {
        statusPedidoExibicao === "success" && setItensExbicao(dadosPedidosEmitidos!.data.results as PedidoItem[])
    }, [statusPedidoExibicao, estaRefreshingPedidoExibicao, uuidPedidoExibicao])

    return (
        <div className="p-5">
            <h1 className="t-1">Home</h1>

            <div className="w-full flex gap-5 justify-end mt-8">
                <Button titulo="Pedidos" className="botao-azul-1" onClick={abrirFecharModalPedidos} />
                {/* <Button titulo="Estoque" className="botao-azul-1" onClick={abrirFecharModalEstoque} /> */}
                {/* <Button titulo="Compras" className="botao-azul-1" onClick={abrirFecharModalCompras} /> */}
            </div>

            <div className="grid grid-cols-12 gap-8 mt-12">

                <div className="col-span-12 lg:col-span-6">
                    <h1 className="t-2 ml-3">Pedidos emitidos</h1>

                    <div className="shadow rounded-lg mt-10 overflow-auto">
                        <table className="min-w-full divide-y divide-blue-900">

                            <thead className="bg-blue-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Emitido em</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-blue-900">
                                {
                                    dadosPedidosEmitidos?.data.results.map((pedido: Pedido) => (
                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer"
                                            onClick={async () => {
                                                abrirFecharModalAndamentoPedidoAberto()

                                                setUuidPedidoExibicao(pedido.uuid)
                                                const requisicao = toast.loading(`Buscando dados pedido ${pedido.uuid.split('-')[0]}`)
                                                await refreshPedidoExibicao()

                                                toast.update(requisicao, {
                                                    type: 'success',
                                                    render: 'Dados carregados!',
                                                    ...DEFAULT_TOAST_CONFIG
                                                })

                                            }}
                                        >
                                            <td className="coluna-grid">{badgesStatus[pedido.status]}</td>
                                            <td className="coluna-grid text-right">{pedido.data_criacao.split('-').reverse().join('/')}</td>
                                            <td className="coluna-grid truncate"><span className="w-12 trucante">{pedido.uuid}</span></td>
                                        </motion.tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>

                </div>

                <div className="col-span-12 lg:col-span-6">
                    <h1 className="t-2 ml-3">Pedidos cancelados</h1>

                    <div className="shadow rounded-lg mt-10 overflow-auto">
                        <table className="min-w-full divide-y divide-blue-900">

                            <thead className="bg-blue-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Emitido em</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-blue-900">
                                {
                                    dadosPedidosCancelados?.data.results.map((pedido: Pedido) => (
                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" /* whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} */ onClick={() => {
                                            // navigate('visualizar-pedido/' + pedido.uuid + '/')
                                            abrirFecharModal()
                                        }}>
                                            <td className="coluna-grid">{badgesStatus[pedido.status]}</td>
                                            <td className="coluna-grid text-right">{pedido.data_criacao.split('-').reverse().join('/')}</td>
                                            <td className="coluna-grid truncate"><span className="w-12 trucante">{pedido.uuid}</span></td>
                                        </motion.tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>

            <div id="modais">

                <div id="modal-pedidos" className="flex flex-col items-center justify-center">
                    {
                        modalPedidosAberto &&
                        <Modal fecharModal={abrirFecharModalPedidos} template={
                            <div>
                                <div ref={exibicaoItensPedidoModal}>
                                    <h1 className="t-2 ml-3">Pedidos a serem emitidos</h1>

                                    <div className="flex justify-end">
                                        <Button titulo="Emitir" className="mt-10 md:mt-0 relative bottom-0 botao-azul-1"
                                            onClick={() => {
                                                let inputs = tabelaPedidosAbertos.current?.querySelectorAll('input')

                                                if (inputs) {
                                                    let inputsCheckados = Array.from(inputs)
                                                    inputsCheckados = inputsCheckados.filter((input: HTMLInputElement) => input.checked == true)

                                                    if (!inputsCheckados.length) toast.warn("Nenhum pedido foi selecionado", DEFAULT_TOAST_CONFIG)

                                                    for (let input = 0; input < inputsCheckados.length; input++) {
                                                        const uuidPedido = inputsCheckados[input].id
                                                        emitirPedido(uuidPedido)
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="shadow rounded-lg mt-10 overflow-auto">
                                        <table ref={tabelaPedidosAbertos} className="min-w-full divide-y divide-blue-900">

                                            <thead className="bg-blue-200">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap" />
                                                    <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap" />
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Criado em</th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-blue-900">
                                                {
                                                    dadosPedidosAbertos?.data.results.map((pedido: Pedido) => (
                                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium" /* whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} */>
                                                            <td className="coluna-grid"><input id={pedido.uuid} type="checkbox" /></td>
                                                            <td className="coluna-grid cursor-pointer"
                                                                onClick={async () => {
                                                                    setUuidPedidoExibicao(pedido.uuid)
                                                                    const requisicao = toast.loading(`Buscando dados pedido ${pedido.uuid.split('-')[0]}`)
                                                                    await refreshPedidoExibicao()

                                                                    toast.update(requisicao, {
                                                                        type: 'success',
                                                                        render: 'Dados carregados!',
                                                                        ...DEFAULT_TOAST_CONFIG
                                                                    })

                                                                    exibicaoItensPedidoModal.current?.classList.add("hidden")
                                                                    exibicaoPedidosModal.current?.classList.remove("hidden")
                                                                }}
                                                            ><AiFillEye size={22} /> </td>
                                                            <td className="coluna-grid">{badgesStatus[pedido.status]}</td>
                                                            <td className="coluna-grid truncate">{pedido.uuid}</td>
                                                            <td className="coluna-grid text-left">{pedido.data_criacao.split('-').reverse().join('/')}</td>
                                                        </motion.tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </div>


                                <div ref={exibicaoPedidosModal} className="hidden h-full">
                                    <div className="flex justify-between">
                                        <h1 className="t-2 ml-3">Itens pedido {uuidPedidoExibicao.split('-')[0]}</h1>

                                        <Button titulo="Voltar" className="relative bottom-0 botao-azul-1"
                                            onClick={() => {
                                                queryClient.removeQueries([['pedido-exibicao', `pedido=${uuidPedidoExibicao}`], 'pedido-exibicao', `pedido=${uuidPedidoExibicao}`])
                                                exibicaoItensPedidoModal.current?.classList.remove("hidden")
                                                exibicaoPedidosModal.current?.classList.add("hidden")
                                            }}
                                        />
                                    </div>

                                    <div className="shadow rounded-lg mt-10 overflow-auto">
                                        <table className="min-w-full divide-y divide-blue-900">

                                            <thead className="bg-blue-200">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Produto</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Quantidade</th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-blue-900">
                                                {
                                                    dadosPedidoExibicao?.data.results.map((pedido: PedidoItem) => (
                                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" >
                                                            <td className="coluna-grid text-left">{pedido.produto}</td>
                                                            <td className="coluna-grid text-left">{pedido.quantidade}</td>
                                                        </motion.tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                            </div>
                        }
                        />
                    }

                </div>


                <div id="modal-estoque" className="flex flex-col items-center justify-center">
                    {
                        modalEstoqueAberto &&
                        <Modal fecharModal={abrirFecharModalEstoque} template={
                            <div>

                            </div>
                        }
                        />
                    }

                </div>

                <div id="modal-compra" className="flex flex-col items-center justify-center">
                    {
                        modalComprasAberto &&
                        <Modal fecharModal={abrirFecharModalCompras} template={
                            <div>

                            </div>
                        }
                        />
                    }

                </div>

                <div id="modal-andamento-pedido" className="flex flex-col items-center justify-center">
                    {
                        modalAndamentoPedidoAberto &&
                        <Modal fecharModal={abrirFecharModalAndamentoPedidoAberto} template={
                            <div>

                                <div className="h-full">
                                    <div className="flex justify-between">
                                        <h1 className="t-2 ml-3">Itens pedido {uuidPedidoExibicao.split('-')[0]}</h1>

                                        {/* <Button titulo="Voltar" className="relative bottom-0 botao-azul-1"
                                            onClick={() => {
                                                queryClient.removeQueries([['pedido-exibicao', `pedido=${uuidPedidoExibicao}`], 'pedido-exibicao', `pedido=${uuidPedidoExibicao}`])
                                                exibicaoItensPedidoModal.current?.classList.remove("hidden")
                                                exibicaoPedidosModal.current?.classList.add("hidden")
                                            }}
                                        /> */}
                                    </div>

                                    <div className="shadow rounded-lg mt-10 overflow-auto">
                                        <table className="min-w-full divide-y divide-blue-900">

                                            <thead className="bg-blue-200">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Produto</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Quantidade</th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-blue-900">
                                                {
                                                    dadosPedidoExibicao?.data.results.map((pedido: PedidoItem) => (
                                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" >
                                                            <td className="coluna-grid text-left">{pedido.produto}</td>
                                                            <td className="coluna-grid text-left">{pedido.quantidade}</td>
                                                        </motion.tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                            </div>
                        }
                        />
                    }

                </div>

            </div>
        </div>
    )
}
