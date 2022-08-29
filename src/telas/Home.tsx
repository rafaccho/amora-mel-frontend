import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { AiFillEye, AiOutlineCheck, AiOutlineSelect } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from "react-toastify";
import { Modal } from "../componentes/Modal";
import { DEFAULT_TOAST_CONFIG } from "../constantes";
import { useBackend } from "../hooks/useBackend";
import { Fornecedor, Pedido, PedidoItem, Produto, ProdutoAbaixoEstoqueMinimo, ProdutoFornecedor } from "../interfaces";
import { Button } from "../tags";

export function Home() {
    // uuid em exibição
    const [uuidPedidoExibicao, setUuidPedidoExibicao] = useState('');

    // states do modais
    const [modalAberto, setModalAberto] = useState(false);
    const [modalPedidosAberto, setModalPedidosAberto] = useState(false);
    const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
    const [modalComprasAberto, setModalComprasAberto] = useState(false);
    const [modalAndamentoPedidoAberto, setModalAndamentoPedidoAberto] = useState(false);

    // status do form de compras
    const [produtoCompra, setProdutoCompra] = useState("");
    const [precoProdutoCompra, setPrecoProdutoCompra] = useState("");
    const [fornecedorCompra, setFornecedorCompra] = useState("");
    const [produtoEstaSendoSelecionadoFornecedor, setProdutoEstaSendoSelecionadoFornecedor] = useState('');
    const [uuidprodutoEstaSendoSelecionadoFornecedor, setUuidProdutoEstaSendoSelecionadoFornecedor] = useState('');
    const [uuidPedidoItemEstaSendoSelecionadoFornecedor, setUuidPedidoItemEstaSendoSelecionadoFornecedor] = useState('');
    // const [fornecedorProdutoItemPedido, setFornecedorProdutoItemPedido] = useState<{}>({});

    // refs do modais
    const exibicaoPedidosModal = useRef<HTMLDivElement>(null)
    const exibicaoItensPedidoModal = useRef<HTMLDivElement>(null)
    const tabelaPedidosAbertos = useRef<HTMLTableElement>(null)

    // ref do form de compra
    const inputsCompra = useRef<HTMLDivElement>(null)
    const exibicaoDadosCompra = useRef<HTMLDivElement>(null)
    const exibicaoSelecaoFornecedorCompra = useRef<HTMLDivElement>(null)

    const btnEmitirPedido = useRef<HTMLButtonElement>(null)

    // refs dos toats
    const toastEmissaoPedido = useRef<any>(null)
    const toastCancelamentoPedido = useRef<any>(null)
    const toastFinalizacaoPedido = useRef<any>(null)
    const toastAssociarFornecedorAoProdutoCompra = useRef<any>(null)

    const { todosRegistros, criarRegistro, editarRegistro } = useBackend('pedidos')

    const queryClient = useQueryClient()

    // querys dos pedidos e dos dados dos pedidos
    const { data: dadosPedidosEmitidos, refetch: refreshPedidosEmitidos } = useQuery('pedidos-emitidos', () => todosRegistros(undefined, `status=E`))
    const { data: dadosPedidosAbertos, refetch: refreshPedidosAbertos } = useQuery('pedidos-abertos', () => todosRegistros(undefined, `status=A`))
    const { data: dadosPedidosFinalizados } = useQuery('pedidos-finalizados', () => todosRegistros(undefined, `status=F`))
    const { data: dadosProdutosAbaixoEstoqueMinimo, refetch: refreshProdutosAbaixoEstoqueMinimo } = useQuery('produtos-abaixo-estoque-minimo', () => todosRegistros("produtos_abaixo_estoque_minimo"))
    const { data: dadosFornecedoresProduto } = useQuery(['produto-fornecedores', `produto=${uuidprodutoEstaSendoSelecionadoFornecedor}`], () => todosRegistros("produto_fornecedores", `produto=${uuidprodutoEstaSendoSelecionadoFornecedor}`))
    const { data: dadosPedidosCancelados } = useQuery('pedidos-cancelados', () => todosRegistros(undefined, `status=C`))
    const { data: dadosPedidoExibicao, refetch: refreshPedidoExibicao } = useQuery(
        ['pedido-exibicao', `pedido=${uuidPedidoExibicao}`],
        () => todosRegistros("pedidos_itens", `pedido=${uuidPedidoExibicao}`),
        { enabled: uuidPedidoExibicao != '' }
    )

    // mutations quanto aos status dos pedidos
    const { mutate: emitirPedido, isLoading: estaEmitindoPedido } = useMutation((uuid: string) => editarRegistro(uuid, { status: "E" }), {
        onSuccess: (response: any) => {
            const uuid = response.data.uuid
            refreshPedidosAbertos()
            refreshPedidosEmitidos()
            queryClient.removeQueries(['pedidos-emitidos', 'pedidos-abertos'])
            atualizarToastEmissaoPedido(uuid)
            zerarFormCompra()
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })
    const { mutate: cancelarPedido } = useMutation(() => editarRegistro(uuidPedidoExibicao, { status: "C" }), {
        onSuccess: (response: any) => {
            const uuid = response.data.uuid
            refreshPedidosAbertos()
            refreshPedidosEmitidos()
            queryClient.removeQueries(['pedidos-cancelados', 'pedidos-emitidos'])
            atualizarToastCancelamentoPedido(uuid)
            zerarFormCompra()
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })
    const { mutate: finalizarPedido } = useMutation(() => editarRegistro(uuidPedidoExibicao, { status: "F" }), {
        onSuccess: (response: any) => {
            const uuid = response.data.uuid
            refreshPedidosAbertos()
            refreshPedidosEmitidos()
            queryClient.removeQueries(['pedidos-finalizados', 'pedidos-emitidos'])
            atualizarToastFinalizacaoPedido(uuid)
            zerarFormCompra()
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })

    // mutate de compra do produto
    const { mutate: comprarProduto } = useMutation((uuidItemPedido: string) => criarRegistro({
        pedido: uuidPedidoExibicao,
        item_pedido: uuidItemPedido,
        preco_produto: parseFloat(precoProdutoCompra),
        produto: produtoCompra,
        fornecedor: fornecedorCompra,
    }, 'compra_pedido_item'), {
        onSuccess: (response: any) => {
            const data = response.data as Pedido
            toast.success(`Pedido ${data.uuid} emitido com sucesso`, DEFAULT_TOAST_CONFIG)

            refreshPedidosAbertos()
            refreshPedidosEmitidos()
            zerarFormCompra()

            queryClient.removeQueries(['pedido-exibicao', `pedido=${uuidPedidoExibicao}`])
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })
    const { mutate: associarFornecedorAoProdutoCompra } = useMutation((uuidFornecedor: string) => editarRegistro(uuidPedidoItemEstaSendoSelecionadoFornecedor, { fornecedor: uuidFornecedor }, 'pedidos_itens'), {
        onSuccess: (response: any) => {
            const nome = response.data.nome
            atualizarToastAssociarFornecedorAoProdutoCompra()
            queryClient.removeQueries(['pedido-exibicao', `pedido=${uuidPedidoExibicao}`])
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        },
    })

    const zerarFormCompra = () => {
        setProdutoCompra('')
        setFornecedorCompra('')
        setPrecoProdutoCompra('')
    }

    // funções para fechar os modais
    const abrirFecharModal = () => { zerarFormCompra(); setModalAberto(!modalAberto) }
    const abrirFecharModalPedidos = () => { zerarFormCompra(); setModalPedidosAberto(!modalPedidosAberto) }
    const abrirFecharModalEstoque = () => { zerarFormCompra(); setModalEstoqueAberto(!modalEstoqueAberto) }
    const abrirFecharModalCompras = () => { zerarFormCompra(); setModalComprasAberto(!modalComprasAberto) }
    const abrirFecharModalAndamentoPedidoAberto = () => { zerarFormCompra(); setModalAndamentoPedidoAberto(!modalAndamentoPedidoAberto) }

    // componentes badges para cada tipo de status de pedido
    const badgesStatus = {
        "E": <span className="p-1 rounded-lg bg-yellow-200 font-bold text-yellow-900">Emitido</span>,
        "A": <span className="p-1 rounded-lg bg-green-200 font-bold text-green-900">Aberto</span>,
        "C": <span className="p-1 rounded-lg bg-red-200 font-bold text-red-900">Cancelado</span>,
        "F": <span className="p-1 rounded-lg bg-sky-200 font-bold text-sky-900">Finalizado</span>,
    }

    // funções para exibir e atualizar os toasts de mudança de status dos pedidos
    const abrirToastEmissaoPedido = (uuid: string) => toastEmissaoPedido.current = toast.loading(`Emitido Pedido ${uuid.split('-')[0]}...`)
    const atualizarToastEmissaoPedido = (uuid: string) => toast.update(toastEmissaoPedido.current, { type: 'success', render: `Pedido ${uuid.split('-')[0]} Emitido!`, ...DEFAULT_TOAST_CONFIG })

    const abrirToastCancelamentoPedido = (uuid: string) => toastCancelamentoPedido.current = toast.loading(`Cancelando Pedido ${uuid.split('-')[0]}...`)
    const atualizarToastCancelamentoPedido = (uuid: string) => toast.update(toastCancelamentoPedido.current, { type: 'success', render: `Pedido ${uuid.split('-')[0]} Cancelado!`, ...DEFAULT_TOAST_CONFIG })

    const abrirToastFinalizacaoPedido = (uuid: string) => toastFinalizacaoPedido.current = toast.loading(`Finalizando Pedido ${uuid.split('-')[0]}...`)
    const atualizarToastFinalizacaoPedido = (uuid: string) => toast.update(toastFinalizacaoPedido.current, { type: 'success', render: `Pedido ${uuid.split('-')[0]} Finalizado!`, ...DEFAULT_TOAST_CONFIG })

    const abrirToastAssociarFornecedorAoProdutoCompra = (nome: string) => toastAssociarFornecedorAoProdutoCompra.current = toast.loading(`Associando Fornecedor ${nome}...`)
    const atualizarToastAssociarFornecedorAoProdutoCompra = () => toast.update(toastAssociarFornecedorAoProdutoCompra.current, { type: 'success', render: `Fornecedor Associado!`, ...DEFAULT_TOAST_CONFIG })

    /* const someHtml = '<div><strong>blablabla<strong><p>another blbla</p/></div>'
    <div className="Container" dangerouslySetInnerHTML={{__html: someHtml}}></div> */
    
    return (
        <div className="p-5">
            <h1 className="t-1">Home</h1>

            <div className="w-full flex gap-5 justify-end mt-8">
                <Button titulo="Pedidos" className="botao-azul-1" onClick={abrirFecharModalPedidos} />
                <Button titulo="Estoque" className="botao-azul-1" onClick={abrirFecharModalEstoque} />
                {/* <Button titulo="Compras" className="botao-azul-1" onClick={abrirFecharModalCompras} /> */}
            </div>

            <div className="grid grid-cols-12 gap-8 mt-12">

                <div className="col-span-12 lg:col-span-6">
                    <h1 className="t-2 ml-3">Pedidos emitidos - Total: {dadosPedidosEmitidos?.data.count}</h1>

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
                    <h1 className="t-2 ml-3">Pedidos cancelados - Total: {dadosPedidosCancelados?.data.count}</h1>

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
                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium" /* whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} */ onClick={() => {
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


                <div className="col-span-12 lg:col-span-6">
                    <h1 className="t-2 ml-3">Pedidos finalizados - Total: {dadosPedidosFinalizados?.data.count}</h1>

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
                                    dadosPedidosFinalizados?.data.results.map((pedido: Pedido) => (
                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium" onClick={() => abrirFecharModal()}>
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
                                        <Button ref={btnEmitirPedido} titulo="Emitir" className="mt-10 md:mt-0 relative bottom-0 botao-azul-1"
                                            onClick={() => {
                                                if(estaEmitindoPedido) return

                                                let inputs = tabelaPedidosAbertos.current?.querySelectorAll('input')
                                                if (inputs) {
                                                    let inputsCheckados = Array.from(inputs)
                                                    inputsCheckados = inputsCheckados.filter((input: HTMLInputElement) => input.checked == true)

                                                    if (!inputsCheckados.length) {
                                                        return toast.warn("Nenhum pedido foi selecionado", DEFAULT_TOAST_CONFIG)
                                                    }

                                                    for (let input = 0; input < inputsCheckados.length; input++) {
                                                        const uuidPedido = inputsCheckados[input].id
                                                        abrirToastEmissaoPedido(uuidPedido)
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
                                                            <td className="coluna-grid text-left">{pedido.produto.nome}</td>
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
                                <h1 className="t-2 ml-3">Produtos abaixo do estoque mínimo</h1>

                                <div className="flex justify-end">
                                    <Button titulo="Atualizar" className="mt-10 md:mt-0 relative bottom-0 botao-azul-1"
                                        onClick={async () => {
                                            const requisicao = toast.loading(`Atualizando...`)

                                            await refreshProdutosAbaixoEstoqueMinimo()

                                            toast.update(requisicao, {
                                                type: 'success',
                                                render: 'Dados atualizados!',
                                                ...DEFAULT_TOAST_CONFIG
                                            })
                                        }}
                                    />
                                </div>

                                <div className="shadow rounded-lg mt-10 overflow-auto">
                                    <table ref={tabelaPedidosAbertos} className="min-w-full divide-y divide-blue-900">

                                        <thead className="bg-blue-200">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Nome</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Estoque mínimo</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Em estoque</th>
                                                {/* <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th> */}
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-blue-900">
                                            {
                                                dadosProdutosAbaixoEstoqueMinimo?.data.results.map((produtoEstoque: ProdutoAbaixoEstoqueMinimo) => (
                                                    <motion.tr key={produtoEstoque.uuid} className="bg-blue-200 text-blue-900 font-medium" /* whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} */>
                                                        <td className="coluna-grid">{produtoEstoque.produto.nome}</td>
                                                        <td className="coluna-grid">{produtoEstoque.estoque_minimo}</td>
                                                        <td className="coluna-grid">{produtoEstoque.em_estoque}</td>
                                                    </motion.tr>
                                                ))
                                            }
                                        </tbody>

                                    </table>
                                </div>
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

                                <div ref={exibicaoDadosCompra}>

                                    <div className="h-full">
                                        <div className="flex justify-between mb-12">
                                            <h1 className="t-2 mt-1 ml-3">Itens pedido {uuidPedidoExibicao.split('-')[0]}</h1>
                                            <div className="flex gap-8">
                                                {
                                                    dadosPedidoExibicao?.data.results.filter((pedido: PedidoItem) => pedido.comprado === "N").length === 0 &&
                                                    <Button titulo="Finalizar pedido" className="botao-azul-1"
                                                        onClick={() => {
                                                            abrirToastFinalizacaoPedido(uuidPedidoExibicao)
                                                            finalizarPedido()
                                                            abrirFecharModalAndamentoPedidoAberto()
                                                        }} />
                                                }

                                                {
                                                    dadosPedidoExibicao?.data.results.filter((pedido: PedidoItem) => pedido.comprado === "S").length === 0 &&
                                                    <Button titulo="Cancelar pedido" className="botao-azul-1"
                                                        onClick={() => {
                                                            abrirToastCancelamentoPedido(uuidPedidoExibicao)
                                                            cancelarPedido()
                                                            abrirFecharModalAndamentoPedidoAberto()
                                                        }} />
                                                }
                                            </div>
                                        </div>

                                        <h1 className="t-3 ml-6">Compra dos Produtos</h1>

                                        <div ref={inputsCompra} className="inputs mt-12 ml-6">

                                            <div className="col-span-6 lg:col-span-3">
                                                <label>Produto <i className="text-rose-700">*</i></label>
                                                <select value={produtoCompra} onChange={e => setProdutoCompra(e.target.value)} required>
                                                    <option value="">Selecione</option>
                                                    {
                                                        dadosPedidoExibicao?.data.results.map((pedido: PedidoItem) => {
                                                            return pedido.comprado === "N"
                                                                ? <option value={pedido.produto.uuid}>{pedido.produto.nome}</option>
                                                                : <></>
                                                        }
                                                        )
                                                    }
                                                </select>
                                            </div>

                                            <div className="col-span-6 lg:col-span-2">
                                                <label>Preço <i className="text-rose-700">*</i></label>
                                                <input type="number" className="text-end" value={precoProdutoCompra} onChange={e => setPrecoProdutoCompra(e.target.value)} required />
                                            </div>

                                            <div className="col-span-6 lg:col-span-1">
                                                <Button titulo="Realizar Compra" className="botao-azul-1 mt-6"
                                                    onClick={() => {
                                                        const todosInputs = inputsCompra.current!.querySelectorAll('input')
                                                        const todosSelects = inputsCompra.current!.querySelectorAll('select')

                                                        Array.from(todosInputs).forEach(input => {
                                                            const inputEstaValido = input.checkValidity()
                                                            !inputEstaValido ? input.classList.add('invalidado') : input.classList.remove('invalidado')
                                                            return inputEstaValido
                                                        })

                                                        Array.from(todosSelects).forEach(select => {
                                                            const inputEstaValido = select.checkValidity()
                                                            !inputEstaValido ? select.classList.add('invalidado') : select.classList.remove('invalidado')
                                                            return inputEstaValido
                                                        })

                                                        if (!produtoCompra || !precoProdutoCompra || document.querySelector('.invalidado')) return toast.warn("Preencha todos os campos!", DEFAULT_TOAST_CONFIG)

                                                        const pedidoItem = dadosPedidoExibicao?.data.results.find((pedido: Pedido) => pedido.produto.uuid === produtoCompra) as PedidoItem

                                                        if (!pedidoItem.fornecedor) return toast.warn("Associe um fornecedor ao item!", DEFAULT_TOAST_CONFIG)
                                                        comprarProduto(pedidoItem.uuid)
                                                    }}
                                                />
                                            </div>

                                        </div>

                                        <div className="border-b-4 border-blue-900 mt-12" />

                                        <div className="shadow rounded-lg mt-10 overflow-auto">
                                            <table className="min-w-full divide-y divide-blue-900">

                                                <thead className="bg-blue-200">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Comprado</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Produto</th>
                                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Quantidade</th>
                                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">fornecedor</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white divide-y divide-blue-900">
                                                    {
                                                        dadosPedidoExibicao?.data.results.map((pedido: PedidoItem) => (
                                                            <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium" >
                                                                <td className="coluna-grid flex justify-center">{pedido.comprado === "S" ? <AiOutlineCheck /> : <BsXLg />}</td>
                                                                <td className="coluna-grid text-left">{pedido.produto.nome}</td>
                                                                <td className="coluna-grid text-center">{pedido.quantidade}</td>
                                                                <td className="coluna-grid flex justify-center cursor-pointer"
                                                                    onClick={() => {
                                                                        // queryClient.removeQueries([['pedido-exibicao', `pedido=${uuidPedidoExibicao}`], 'pedido-exibicao', `pedido=${uuidPedidoExibicao}`])
                                                                        setProdutoEstaSendoSelecionadoFornecedor(pedido.produto.nome)
                                                                        setUuidProdutoEstaSendoSelecionadoFornecedor(pedido.produto.uuid)
                                                                        setUuidPedidoItemEstaSendoSelecionadoFornecedor(pedido.uuid)

                                                                        exibicaoSelecaoFornecedorCompra.current?.classList.remove("hidden")
                                                                        exibicaoDadosCompra.current?.classList.add("hidden")
                                                                    }}
                                                                >
                                                                    {
                                                                        pedido.fornecedor
                                                                            ? pedido.fornecedor.nome
                                                                            : <AiOutlineSelect />
                                                                    }
                                                                </td>
                                                            </motion.tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>

                                </div>

                                <div ref={exibicaoSelecaoFornecedorCompra} className="hidden">
                                    <div className="flex justify-between">
                                        <h1 className="t-2 ml-3">Fornecedores Produto {produtoEstaSendoSelecionadoFornecedor}</h1>

                                        <Button titulo="Voltar" className="relative bottom-0 botao-azul-1"
                                            onClick={() => {
                                                exibicaoDadosCompra.current?.classList.remove("hidden")
                                                exibicaoSelecaoFornecedorCompra.current?.classList.add("hidden")
                                            }}
                                        />
                                    </div>


                                    <div className="shadow rounded-lg mt-10 overflow-auto">
                                        <table className="min-w-full divide-y divide-blue-900">

                                            <thead className="bg-blue-200">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Nome</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">CFP/CNPJ</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">CEP</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Bairro</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Número</th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-blue-900">
                                                {
                                                    dadosFornecedoresProduto?.data.results.map((produtoFornecedor: ProdutoFornecedor) => (
                                                        <motion.tr key={produtoFornecedor.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer"
                                                            onClick={() => {
                                                                abrirToastAssociarFornecedorAoProdutoCompra(produtoFornecedor.fornecedor.nome)
                                                                associarFornecedorAoProdutoCompra(produtoFornecedor.fornecedor.uuid)
                                                                exibicaoDadosCompra.current?.classList.remove("hidden")
                                                                exibicaoSelecaoFornecedorCompra.current?.classList.add("hidden")
                                                            }}
                                                        >
                                                            <td className="coluna-grid text-left">{produtoFornecedor.fornecedor.nome}</td>
                                                            <td className="coluna-grid text-left">{produtoFornecedor.fornecedor.cpf_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</td>
                                                            <td className="coluna-grid text-left">{produtoFornecedor.fornecedor.cep}</td>
                                                            <td className="coluna-grid text-left">{produtoFornecedor.fornecedor.bairro}</td>
                                                            <td className="coluna-grid text-left">{produtoFornecedor.fornecedor.numero}</td>
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
