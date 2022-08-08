import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { AreaEntrega, Pedido, Produto } from "../../interfaces";
import { criarUrlVoltar } from "../../utils/criarUrlVoltar";
import { CabecalhoForm } from "../../componentes/CabecalhoForm";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";


export function FormPedidos() {
    const [uuid, setUuid] = useState('')
    const [loja, setLoja] = useState('')
    const [produto, setProduto] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [areaEntrega, setAreaEntrega] = useState('')
    const [status, setStatus] = useState('')

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [areasEntregas, setAreasEntregas] = useState<AreaEntrega[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro, todosRegistros } = useBackend('pedidos')
    const navigate = useNavigate()

    const { data: dadosPedido, status: statusPedido } = useQuery(
        'pedidos',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )


    const { data: dadosProduto, status: statusProduto } = useQuery(
        'produto',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )

    const { data: dadosAreaEntrega, status: statusAreaEntrega } = useQuery(
        'areaEntrega',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )


    const { data: dadosProdutos, status: statusProdutos } = useQuery(
        'produtos',
        () => todosRegistros(),
    )

    const { data: dadosAreasEntregas, status: statusAreasEntregas } = useQuery(
        'areasEntregas',
        () => todosRegistros(),
    )

    const queryClient = useQueryClient()

    const dados = {
        loja,
        produto,
        quantidade,
        area_entrega: areaEntrega,
        status,
    }

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

    function preencherDados(): void {
        if (dadosPedido) {
            const dados = dadosPedido.data as Pedido

            setUuid(dados.uuid)
            setLoja(dados.loja)
            setProduto(dados.produto)
            // setQuantidade(dados.quantidade)
            setAreaEntrega(dados.area_entrega)
            setStatus(dados.status)
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
        statusProduto === "success" && setProdutos(dadosProdutos!.data.results as Produto[])
    }, [statusProduto])

    useEffect(() => {
        statusAreasEntregas === "success" && setAreasEntregas(dadosProdutos!.data.results as AreaEntrega[])
    }, [statusAreasEntregas])

    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Fornecedor" : `Editar Fornecedor ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onDeletar: {
                            endpoint: 'fornecedores',
                            textoSucesso: "Fornecedor deletado com sucesso!",
                            textoErro: "Ocorreu um erro!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusAreaEntrega === 'loading' && <Loading />}
            {statusAreaEntrega === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusPedido === 'success'
                        : pathname.match('cadastrar/')
                ) &&
                <div ref={inputs} id="formulario" className="p-5">
                    <div className="inputs">

                        <div className="col-span-7 md:col-span-4 lg:col-span-4">
                            <label>Identificador</label>
                            <input type="text"
                                value={uuid}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-7 md:col-span-4 lg:col-span-3">
                            <label>Loja <i className="text-rose-700">*</i></label>
                            <select name="loja" id="loja" value={loja} onChange={e => setLoja(e.target.value)} required>
                                <option defaultValue="">Selecione</option>
                                <option value="FA">Fábrica</option>
                                <option value="CN">Cidade Nova</option>
                                <option value="UN">União</option>
                                <option value="FL">Floresta</option>
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <label>Produto <i className="text-rose-700">*</i></label>
                            <select name="fornecedor" id="uf" value={produto} onChange={e => setProduto(e.target.value)} required>
                                <option value="">
                                    {
                                        statusProdutos === "loading"
                                            ? "Carregando..."
                                            : produtos.length === 0
                                                ? "Não existem produtos cadastrados"
                                                : "Selecione"
                                    }
                                </option>
                                {produtos.map((produto: Produto) => <option key={produto.uuid} value={produto.uuid}>{produto.nome}</option>)}
                            </select>
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}