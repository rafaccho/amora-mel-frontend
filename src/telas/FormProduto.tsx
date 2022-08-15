import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading } from "../componentes/Loading";
import { Error } from "../componentes/Error";
import { CabecalhoForm } from "../componentes/CabecalhoForm";
import { DEFAULT_TOAST_CONFIG } from "../constantes";
import { useBackend } from "../hooks/useBackend";
import { criarUrlVoltar } from "../utils/criarUrlVoltar";
import { Produto } from "../interfaces";

export function FormProduto() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [quantidade1, setQuantidade1] = useState<string | number>('')
    const [unidade1, setUnidade1] = useState('')
    const [quantidade2, setQuantidade2] = useState<string | number>('')
    const [unidade2, setUnidade2] = useState('')
    const [estoqueMinimo, setEstoqueMinimo] = useState<string | number>('')

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro } = useBackend('produtos')
    const navigate = useNavigate()

    const { data: dadosProduto, status: statusProduto } = useQuery(
        'produto',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )

    const queryClient = useQueryClient()

    const dados = {
        codigo,
        nome,
        unidade1,
        unidade2,
        quantidade1,
        quantidade2,
        estoque_minimo: estoqueMinimo
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos'])
            toast.success('Produto salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosProduto) {
            const dados = dadosProduto.data as Produto

            setCodigo(dados.codigo)
            setUuid(dados.uuid)
            setNome(dados.nome)
            setQuantidade1(dados.quantidade1)
            setUnidade1(dados.unidade1)
            setQuantidade2(dados.quantidade2)
            setUnidade2(dados.unidade2)
            setEstoqueMinimo(dados.estoque_minimo)
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
        pathname.match('editar/') && dadosProduto && preencherDados()
    }, [dadosProduto])


    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Produtos" : `Editar Produto ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onVoltar: () => {
                            queryClient.removeQueries('produtos')
                        },
                        onDeletar: {
                            endpoint: 'produtos',
                            textoSucesso: "Produto deletado com sucesso!",
                            textoErro: "Ocorreu um erro ao deletar o produto!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusProduto === 'loading' && <Loading />}

            {statusProduto === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusProduto === 'success'
                        : pathname.match('cadastrar/')
                ) &&
                <div ref={inputs} className="inputs">

                    <div className="col-span-7 md:col-span-2 lg:col-span-3">
                        <label>Identificador</label>
                        <input type="text"
                            value={uuid}
                            readOnly
                            disabled
                        />
                    </div>

                    <div className="col-span-5 md:col-span-2 lg:col-span-2">
                        <label>Código</label>
                        <input type="number"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-5 lg:col-span-5">
                        <label>Nome <i className="text-rose-700">*</i></label>
                        <input type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <label>Unidade 1 <i className="text-rose-700">*</i></label>
                        <input type="text"
                            value={unidade1}
                            onChange={e => setUnidade1(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-4 lg:col-span-2">
                        <label>Quantidade 1 <i className="text-rose-700">*</i></label>
                        <input type="number" className="text-right"
                            value={quantidade1}
                            onChange={e => setQuantidade1(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <label>Unidade 2 <i className="text-rose-700">*</i></label>
                        <input type="text"
                            value={unidade2}
                            onChange={e => setUnidade2(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-4 lg:col-span-2">
                        <label>Quantidade 2 <i className="text-rose-700">*</i></label>
                        <input type="number" className="text-right"
                            value={quantidade2}
                            onChange={e => setQuantidade2(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-4 lg:col-span-2">
                        <label>Estoque Mínimo <i className="text-rose-700">*</i></label>
                        <input type="number" className="text-right"
                            value={estoqueMinimo}
                            onChange={e => setEstoqueMinimo(e.target.value)}
                            required
                        />
                    </div>

                </div>
            }

        </div>
    )
}
