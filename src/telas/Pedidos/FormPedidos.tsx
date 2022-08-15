import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { AreaEntrega, Pedido, PedidoItem, Produto } from "../../interfaces";
import { criarUrlVoltar } from "../../utils/criarUrlVoltar";
import { CabecalhoForm } from "../../componentes/CabecalhoForm";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";
import { Button } from "../../tags";


export function FormPedidos() {
    const [uuid, setUuid] = useState('')
    const [numeroPedido, setNumeroPedido] = useState('')
    const [loja, setLoja] = useState('')
    const [produto, setProduto] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [areaEntrega, setAreaEntrega] = useState('')
    const [status, setStatus] = useState('')
    const [uuidItemPedido, setUuidItemPedido] = useState('')

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [itensPedido, setItensPedido] = useState<PedidoItem[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const dados = {
        loja,
        produto,
        quantidade,
        area_entrega: areaEntrega,
    }

    const dadosItem = (uuidPedidoPai: string) => ({
        produto: produto,
        quantidade,
        pedido: uuidPedidoPai,
    })

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()

    const { criarRegistro, editarRegistro, umRegistro, todosRegistros, deletarRegistro } = useBackend('pedidos')

    const { data: dadosProdutos, status: statusProdutos, isRefetching: refreshingProdutos } = useQuery('produtos', () => todosRegistros('produtos'))
    const { data: dadosPedido, status: statusPedido } = useQuery('pedido', () => umRegistro(uuidEdit ? uuidEdit : uuid), { enabled: uuidEdit !== undefined })
    const { data: dadosItensPedidos, status: statusItensPedidos, isRefetching: refreshingItensPedido } = useQuery(['produtos-pedido', `pedido=${uuid}`], () => todosRegistros("pedidos_itens", `pedido=${uuid}`), { enabled: uuid !== "" })

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['pedidos'])
            toast.success('Pedido salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    // const mutationItem = useMutation(() => uuidEdit ? editarRegistro(uuid, dadosItem(uuid), "pedidos_itens") : criarRegistro(dadosItem(uuid), "pedidos_itens"), {
    const mutationItem = useMutation(() => uuidItemPedido ? editarRegistro(uuidItemPedido, dadosItem(uuid), "pedidos_itens") : criarRegistro(dadosItem(uuid), "pedidos_itens"), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos-pedido'])
            toast.success('Produto incluido com sucesso!', DEFAULT_TOAST_CONFIG)
            setProduto("")
            setQuantidade("")
            setUuidItemPedido("")
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    const mutationExcluirItem = useMutation((uuid: string) => deletarRegistro(uuid, "pedidos_itens"), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos-pedido'])
            toast.success('Produto excluído com sucesso!', DEFAULT_TOAST_CONFIG)
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    const mutationCriarPedidoEPedidoItem = useMutation(async () => await criarRegistro(dados).then(res => criarRegistro(dadosItem(res.data.uuid), 'pedidos_itens')), {
        onSuccess: (response) => {
            queryClient.invalidateQueries('produtos-pedido')
            toast.success('Produto incluido com sucesso!', DEFAULT_TOAST_CONFIG)

            // navigate(`/app/pedidos/editar/${response.data.uuid}/`)

            setProduto("")
            setQuantidade("")
            setUuid(response.data.pedido)
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosPedido) {
            const dados = dadosPedido.data as Pedido

            setUuid(dados.uuid)
            setLoja(dados.loja)
            // setStatus(dados.status)
        }
    }

    function validarCampos(): boolean {
        const todosInputs = inputs.current!.querySelectorAll('input')
        const todosSelects = inputs.current!.querySelectorAll('select')

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

        return !(document.querySelector('.invalidado'))
    }

    useEffect(() => {
        pathname.match('editar/') && dadosPedido && preencherDados()
    }, [dadosPedido])

    useEffect(() => {
        statusProdutos === "success" && setProdutos(dadosProdutos!.data.results as Produto[])
    }, [statusProdutos, refreshingProdutos])

    useEffect(() => {
        statusItensPedidos === "success" && setItensPedido(dadosItensPedidos!.data.results as PedidoItem[])
    }, [statusItensPedidos, refreshingItensPedido])

    console.log(dadosItensPedidos);
    queryClient.removeQueries(['produtos-pedido', 'pedidos', 'pedidos_itens'])


    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Pedido" : `Editar Pedido ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onVoltar: () => {
                            // queryClient.invalidateQueries(['pedidos', 'produtos-pedido', 'pedido'])
                            queryClient.removeQueries(['pedidos', 'produtos-pedido', 'pedido', 'produtos'])
                        },
                        onDeletar: {
                            endpoint: 'pedidos',
                            textoSucesso: "Pedido deletado com sucesso!",
                            textoErro: "Ocorreu um erro!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusPedido === 'loading' && <Loading />}
            {statusPedido === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusPedido === 'success'
                        : pathname.match('cadastrar/')
                ) &&
                <div ref={inputs} id="formulario" className="p-5">
                    <div className="inputs">

                        <div className="col-span-5 md:col-span-4 lg:col-span-2">
                            <label>Identificador</label>
                            <input type="text"
                                value={uuid}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-7 md:col-span-4 lg:col-span-2">
                            <label>Loja <i className="text-rose-700">*</i></label>
                            <select name="loja" id="loja" value={loja} required
                                onChange={e => {
                                    setLoja(e.target.value)
                                    e.target.disabled = true
                                }}
                            >
                                <option value="">Selecione</option>
                                <option value="FA">Fábrica</option>
                                <option value="CN">Cidade Nova</option>
                                <option value="UN">União</option>
                                <option value="FL">Floresta</option>
                            </select>
                        </div>

                        <div className="col-span-8 md:col-span-4">
                            <label>Produto <i className="text-rose-700">*</i></label>
                            <select name="fornecedor" id="uf" value={produto} onChange={e => setProduto(e.target.value)} required>
                                <option value="">Selecione</option>
                                {produtos.map((produto: Produto) => <option key={produto.uuid} value={produto.uuid}>{produto.nome}</option>)}
                                {/* {produtos.map((produto: Produto) => <option key={produto.uuid} value={`${produto.uuid}_${produto.nome}`}>{produto.nome}</option>)} */}
                            </select>
                        </div>

                        <div className="col-span-4 md:col-span-2">
                            <label>Quantidade <i className="text-rose-700">*</i></label>
                            <input type="number" className="text-right" required
                                value={quantidade}
                                onChange={e => setQuantidade(e.target.value)}
                            />
                        </div>

                    </div>

                    <br /><br />

                    <Button titulo={uuidItemPedido ? "Salvar produto" : "Incluir produto"} className="botao-azul-1 m"
                        onClick={() => {
                            if (!validarCampos()) {
                                toast.error("Preencha os campos obrigatórios!", DEFAULT_TOAST_CONFIG)
                                console.log("ENTREI 1")
                            }
                            else if (!uuid) {
                                mutationCriarPedidoEPedidoItem.mutate()
                                console.log("ENTREI 2")
                            }
                            else {
                                mutationItem.mutate()
                                console.log("ENTREI 3")
                            }
                        }}
                    />

                    <br /><br /><br />

                    <div>
                        <table className="min-w-full divide-y divide-blue-900">
                            <thead className="bg-blue-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">N °</th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">
                                        Produto
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap">
                                        Quantidade
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap" />
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-black font-extrabold uppercase tracking-wider whitespace-nowrap" />

                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-blue-900">
                                {
                                    itensPedido.map((itemPedido: PedidoItem, index: number) => (
                                        <tr key={itemPedido.uuid} className="bg-blue-200 cursor-pointer">
                                            <td className="coluna-grid truncate">{index}</td>
                                            <td className="coluna-grid">{itemPedido.produto}</td>
                                            <td className="coluna-grid">{itemPedido.quantidade}</td>
                                            <td className="coluna-grid"
                                                onClick={() => {
                                                    setUuidItemPedido(itemPedido.uuid)
                                                    setProduto(itemPedido.produto)
                                                    setQuantidade(itemPedido.quantidade)
                                                }}
                                            >Editar</td>

                                            <td className="coluna-grid"
                                                onClick={() => {
                                                    if (itemPedido.uuid === uuidItemPedido) {
                                                        setUuidItemPedido('')
                                                        setQuantidade('')
                                                        setProduto('')
                                                    }

                                                    mutationExcluirItem.mutate(itemPedido.uuid)
                                                }}
                                            >Excluir</td>

                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>

                    </div>

                </div>
            }

        </div >
    )
}