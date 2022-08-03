import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardRegistro } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { Produto } from "../../interfaces";
import { Button } from "../../tags";


export function PainelProduto() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [quantidade1, setQuantidade1] = useState<string | number>('')
    const [unidade1, setUnidade1] = useState('')
    const [quantidade2, setQuantidade2] = useState<string | number>('')
    const [unidade2, setUnidade2] = useState('')
    const [preco, setPreco] = useState('')
    const [produtos, setProdutos] = useState<Produto[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const dados = {
        nome,
        preco,
        unidade: unidade1,
        quantidade: quantidade1,

        // unidade1,
        // unidade2,

        // quantidade1,
        // quantidade2,
    }

    const { criarRegistro, editarRegistro, todosRegistros, deletarRegistro } = useBackend('produtos')

    const queryClient = useQueryClient()

    const mutation = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos'])
            toast.success('Produto cadastrado com sucesso!', DEFAULT_TOAST_CONFIG)
            limparCampos()
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

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

    const {
        data: registrosProdutos,
        status: statusProdutos,
        isLoading: carregandoProdutos,
        isRefetching: refeshingProdutos,
    } = useQuery('produtos', () => todosRegistros('produtos'))

    function limparCampos(): void {
        setCodigo('')
        setUuid('')
        setNome('')
        setQuantidade1('')
        setUnidade1('')
        setQuantidade2('')
        setUnidade2('')
        setPreco('')
    }

    useEffect(() => {
        statusProdutos === "success" && setProdutos(registrosProdutos.data.results as Produto[])
    }, [statusProdutos, carregandoProdutos, refeshingProdutos])

    return (
        <div className="w-full max-w-full p-5">
            <h1 className="t-1 mb-2">Produtos</h1>

            <div className="grid grid-cols-12 mt-12 lg:gap-12">

                <div id="registros" className="col-span-12 lg:col-span-9">
                    <Filtros refetch={() => ''} />

                    <div id="cards" className="grid grid-cols-12 gap-5 mt-12">
                        { statusProdutos === "loading" && <Loading /> }
                        { statusProdutos === "error" && <Error /> }
                        {
                            statusProdutos === "success" &&
                            produtos.map((produto: Produto) => (
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    <CardRegistro
                                        key={produto.uuid}
                                        titulo={produto.nome}
                                        uuid={produto.uuid}
                                        endpoint={'produtos'}
                                        textosDeletar={{
                                            sucesso: "Produto excluído com sucesso!",
                                            erro: "Ocorreu um erro ao excluir o produto!",
                                        }}
                                        query={'produtos'}
                                        dados={{
                                            "Identificador": produto.uuid,
                                            "Código": produto.codigo,
                                            "Nome": produto.nome,
                                            "Preço": produto.preco,
                                            "Unidade 1": produto.unidade1,
                                            "Quantidade 1": produto.quantidade1,
                                            "Unidade 2": produto.unidade2,
                                            "Quantidade 2": produto.quantidade2,
                                        }}
                                        onEditar={() => {
                                            setCodigo(produto.codigo)
                                            setUuid(produto.uuid)

                                            setPreco(`${produto.preco}`)

                                            setQuantidade1(produto.quantidade1)
                                            setQuantidade2(produto.quantidade2)

                                            setUnidade1(produto.unidade1)
                                            setUnidade2(produto.unidade2)
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {
                            !produtos.length && statusProdutos === "success" &&
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                <span>Não existem registros...</span>
                            </div>
                        }

                    </div>
                </div>

                <div ref={inputs} id="formulario" className="hidden lg:block col-span-3">
                    <div className="inputs">

                        <div className="col-span-12">
                            <h1 className="t-3 mb-5">Informações Principais</h1>
                        </div>

                        <div className="col-span-12">
                            <label>Identificador </label>
                            <input type="text" value={uuid} readOnly disabled />
                        </div>

                        <div className="col-span-12">
                            <label>Código</label>
                            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Nome <i className="text-rose-700">*</i></label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Preço <i className="text-rose-700">*</i></label>
                            <input type="text" value={preco} onChange={e => setPreco(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Quantidade 1 <i className="text-rose-700">*</i></label>
                            <input type="text" value={quantidade1} onChange={e => setQuantidade1(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 1 <i className="text-rose-700">*</i></label>
                            <input type="text" value={unidade1} onChange={e => setUnidade1(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Quantidade 2</label>
                            <input type="text" value={quantidade2} onChange={e => setQuantidade2(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 2</label>
                            <input type="text" value={unidade2} onChange={e => setUnidade2(e.target.value)} />
                        </div>


                        <div className="col-span-12">
                            <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                                className="btn-l flex justify-center pt-3 w-full font-bold"
                                onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : mutation.mutate()}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}