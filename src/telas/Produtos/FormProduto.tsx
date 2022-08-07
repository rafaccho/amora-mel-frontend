import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { Produto } from "../../interfaces";
import { CabecalhoForm } from "../../componentes/CabecalhoForm";

export function FormProduto() {
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

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()


    const { criarRegistro, editarRegistro, umRegistro } = useBackend('produtos')

    const {
        data: dadosProduto,
        status: statusProduto,
        isLoading: carregandoProduto,
        isRefetching: refeshingProduto,
    } = useQuery('produtos', () => umRegistro(''))

    const queryClient = useQueryClient()

    const dados = {
        nome,
        preco,
        unidade1,
        unidade2,
        quantidade1,
        quantidade2,
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos'])
            toast.success('Produto cadastrado com sucesso!', DEFAULT_TOAST_CONFIG)
            limparCampos()
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
        console.log(pathname.match('editar/') )
        dadosProduto && pathname.match('editar/') && preencherDados()
    }, [dadosProduto])

    
    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo="Cadastro de Produtos"
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        // onEditar: () => mutation.mutate(),
                        onDeletar: () => {

                        },
                    }}
                />
            </div>

            { carregandoProduto && <Loading /> }

            { statusProduto === 'error' && <Error /> }

            {
                dadosProduto &&
                <div className="inputs">

                    <div className="col-span-12 md:col-span-5 lg:col-span-4">
                        <label>Nome</label>
                        <input type="text" />
                    </div>

                    <div className="col-span-12 md:col-span-4 lg:col-span-2">
                        <label>Preço</label>
                        <input type="text" className="text-right" />
                    </div>

                    <div className="col-span-12 md:col-span-3 lg:col-span-1">
                        <label>Unidade Pri.</label>
                        <input type="text" />
                    </div>

                    <div className="col-span-12 md:col-span-4 lg:col-span-1">
                        <label>Quantidade</label>
                        <input type="text" className="text-right" />
                    </div>

                    <div className="col-span-12 md:col-span-3 lg:col-span-1">
                        <label>Unidade Item</label>
                        <input type="text" />
                    </div>

                    <div className="col-span-12 md:col-span-4 lg:col-span-1">
                        <label>Quantidade</label>
                        <input type="text" className="text-right" />
                    </div>

                </div>
            }

        </div>
    )
}
