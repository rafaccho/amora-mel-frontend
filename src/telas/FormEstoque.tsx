import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { DEFAULT_TOAST_CONFIG } from "../constantes";
import { useBackend } from "../hooks/useBackend";
import { AreaEntrega, Pedido, Produto } from "../interfaces";
import { criarUrlVoltar } from "../utils/criarUrlVoltar";
import { CabecalhoForm } from "../componentes/CabecalhoForm";
import { Loading } from "../componentes/Loading";
import { Error } from "../componentes/Error";


export function FormEstoque() {
    const [uuid, setUuid] = useState('')
    const [produto, setProduto] = useState('')
    const [quantidade, setQuantidade] = useState('')

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [areasEntregas, setAreasEntregas] = useState<AreaEntrega[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro, todosRegistros } = useBackend('estoques')

    const navigate = useNavigate()

    const { data: dadosEstoque, status: statusEstoque } = useQuery(
        'estoque',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )

    const { data: dadosProduto, status: statusProduto } = useQuery(
        'produto',
        () => umRegistro(uuidEdit ? uuidEdit : uuid, 'produtos'),
        { enabled: uuidEdit !== undefined }
    )

    const { data: dadosProdutos, status: statusProdutos } = useQuery(
        'produtos',
        () => todosRegistros('produtos'),
    )

    const queryClient = useQueryClient()

    const dados = {
        produto,
        quantidade,
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
        if (dadosEstoque) {
            const dados = dadosEstoque.data as Pedido

            setUuid(dados.uuid)
            setProduto(dados.produto)
            setQuantidade(`${dados.quantidade}`)
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
        pathname.match('editar/') && dadosEstoque && preencherDados()
    }, [dadosEstoque])


    useEffect(() => {
        console.log(statusProdutos);
        
        statusProdutos === "success" && console.log(dadosProdutos!.data)
        statusProdutos === "success" && setProdutos(dadosProdutos!.data.results as Produto[])
    }, [statusProdutos])

    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Estoque" : `Editar Estoque ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onDeletar: {
                            endpoint: 'estoques',
                            textoSucesso: "Estoque deletado com sucesso!",
                            textoErro: "Ocorreu um erro!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusEstoque === 'loading' && <Loading />}
            {statusEstoque === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusEstoque === 'success'
                        : pathname.match('cadastrar/')
                ) &&
                <div ref={inputs} id="formulario" className="p-5">
                    <div className="inputs">

                        <div className="col-span-5 md:col-span-4 lg:col-span-4">
                            <label>Identificador</label>
                            <input type="text"
                                value={uuid}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-8 md:col-span-3">
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

                        <div className="col-span-4 md:col-span-2">
                            <label>Quantidade <i className="text-rose-700">*</i></label>
                            <input type="number" className="text-right"
                                value={quantidade}
                                onChange={e => setQuantidade(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}