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
import { Agrupamento, Fornecedor, Produto, ProdutoFornecedor } from "../interfaces";
import { Button } from "../tags";
import { BsTrashFill } from "react-icons/bs";

export function FormProduto() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [quantidade1, setQuantidade1] = useState<string | number>('')
    const [unidade1, setUnidade1] = useState('')
    const [quantidade2, setQuantidade2] = useState<string | number>('')
    const [unidade2, setUnidade2] = useState('')
    const [estoqueMinimo, setEstoqueMinimo] = useState<string | number>('')
    const [grupo, setGrupo] = useState('')
    const [subgrupo, setSubgrupo] = useState('')
    const [fornecedor, setFornecedor] = useState('')

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro, todosRegistros, deletarRegistro } = useBackend('produtos')
    const navigate = useNavigate()

    const { data: dadosProduto, status: statusProduto } = useQuery(['produto', uuidEdit], () => umRegistro(uuidEdit ? uuidEdit : uuid))
    const { data: dadosGrupos } = useQuery('grupo', () => todosRegistros('agrupamentos', 'entidade=G'))
    const { data: dadosSubgrupos } = useQuery('subgrupo', () => todosRegistros('agrupamentos', 'entidade=S'))
    const { data: dadosProdutoFornecedores } = useQuery(['produto_fornecedores', uuidEdit], () => todosRegistros('produto_fornecedores', `produto=${uuidEdit}`))
    const { data: dadosFornecedores } = useQuery('fornecedores', () => todosRegistros('fornecedores'))

    const queryClient = useQueryClient()

    const dados = {
        codigo,
        nome,
        unidade1,
        unidade2: unidade2 || null,
        quantidade1,
        quantidade2: quantidade2 || null,
        grupo,
        subgrupo,
        estoque_minimo: estoqueMinimo,
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos', uuidEdit])
            toast.success('Produto salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    const dadosProdutoFornecedor = {
        produto: uuidEdit,
        fornecedor: fornecedor,
    }

    const associarProdutoFornecedor = useMutation(() => criarRegistro(dadosProdutoFornecedor, "produto_fornecedores"), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produto_fornecedores'])
            toast.success('Fornecedor associado com sucesso!', DEFAULT_TOAST_CONFIG)
            setFornecedor('')
        },
        onError: () => {
            toast.warn("Este fornecedor já foi associado!", DEFAULT_TOAST_CONFIG)
            setFornecedor('')
        }
    })

    const desassociarProdutoFornecedor = useMutation((uuid: string) => deletarRegistro(uuid, "produto_fornecedores"), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produto_fornecedores', uuidEdit])
            toast.success('Fornecedor desassociado com sucesso!', DEFAULT_TOAST_CONFIG)
        },
        onError: () => {
            toast.warn("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosProduto) {
            const dados = dadosProduto.data as Produto

            if (!uuid) {
                setCodigo(dados.codigo)
                setUuid(dados.uuid)
                setNome(dados.nome)
                setQuantidade1(dados.quantidade1)
                setUnidade1(dados.unidade1)
                setQuantidade2(dados.quantidade2)
                setUnidade2(dados.unidade2)
                setEstoqueMinimo(dados.estoque_minimo)
                setGrupo(dados.grupo ? dados.grupo.uuid : "")
                setSubgrupo(dados.subgrupo ? dados.subgrupo.uuid : "")
            }
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
                            queryClient.invalidateQueries('produtos')
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

                    <div className="col-span-5 md:col-span-3 lg:col-span-2">
                        <label>Código</label>
                        <input type="number"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-7 lg:col-span-5">
                        <label>Nome <i className="text-rose-700">*</i></label>
                        <input type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-12 md:col-span-3 lg:col-span-2">
                        <label>Estoque Mínimo <i className="text-rose-700">*</i></label>
                        <input type="number" className="text-right"
                            value={estoqueMinimo}
                            onChange={e => setEstoqueMinimo(e.target.value)}
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

                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <label>Quantidade 1 <i className="text-rose-700">*</i></label>
                        <input type="number" className="text-right"
                            value={quantidade1}
                            onChange={e => setQuantidade1(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <label>Unidade 2</label>
                        <input type="text"
                            value={unidade2}
                            onChange={e => setUnidade2(e.target.value)}
                        />
                    </div>

                    <div className="col-span-6 md:col-span-4 lg:col-span-2">
                        <label>Quantidade 2</label>
                        <input type="number" className="text-right"
                            value={quantidade2}
                            onChange={e => setQuantidade2(e.target.value)}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <label>Grupo</label>
                        <select value={grupo} onChange={e => setGrupo(e.target.value)}>
                            <option value="">Selecione</option>
                            {dadosGrupos?.data.results.map((grupo: Agrupamento) => <option key={grupo.uuid} value={grupo.uuid}>{grupo.nome}</option>)}
                        </select>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <label>Subgrupo</label>
                        <select value={subgrupo} onChange={e => setSubgrupo(e.target.value)}>
                            <option value="">Selecione</option>
                            {dadosSubgrupos?.data.results.map((subgrupo: Agrupamento) => <option key={subgrupo.uuid} value={subgrupo.uuid}>{subgrupo.nome}</option>)}
                        </select>
                    </div>

                    {
                        uuidEdit &&
                        <div className="col-span-12" />

                    }
                    {
                        uuidEdit &&
                        <div className="col-span-12 md:col-span-4">
                            <label>Fornecedor</label>
                            <select value={fornecedor} onChange={e => setFornecedor(e.target.value)}>
                                <option value="">Selecione</option>
                                {dadosFornecedores?.data.results.map((fornecedor: Fornecedor) => <option key={fornecedor.uuid} value={fornecedor.uuid}>{fornecedor.nome}</option>)}
                            </select>
                        </div>
                    }

                    {
                        uuidEdit &&
                        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex items-center pt-5">
                            <Button titulo="Associar fornecedor" className="botao-azul-1 w-full"
                                onClick={() => {
                                    if (fornecedor === "") return toast.warn('Selecione um fornecedor', DEFAULT_TOAST_CONFIG)
                                    else if (uuidEdit) return associarProdutoFornecedor.mutate()
                                }}
                            />
                        </div>
                    }

                    {
                        uuidEdit &&
                        <div className="col-span-12 shadow rounded-lg mt-4 overflow-auto">
                            <table className="min-w-full divide-y divide-blue-900">

                                <thead className="bg-blue-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">#</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Nome</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">CEP</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Cidade</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Bairro</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Área de Entrega</th>
                                        <th scope="col" className="px-6 py-3 text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap"></th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-blue-900">
                                    {
                                        dadosProdutoFornecedores?.data.results.map((produtoFornecedor: ProdutoFornecedor, index: number) => (
                                            <tr key={produtoFornecedor.uuid} className="bg-blue-200 text-blue-900 font-medium">
                                                <td className="coluna-grid text-center">{index + 1}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.nome}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.cpf_cnpj}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.cep}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.cidade}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.bairro}</td>
                                                <td className="coluna-grid text-center">{produtoFornecedor.fornecedor.area_entrega.nome}</td>
                                                <td className="coluna-grid text-center"onClick={() => desassociarProdutoFornecedor.mutate(produtoFornecedor.uuid) } ><BsTrashFill /></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>

                            </table>
                        </div>
                    }

                </div>
            }

        </div>
    )
}