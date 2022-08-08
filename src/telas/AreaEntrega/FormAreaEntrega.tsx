import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TiArrowBackOutline } from 'react-icons/ti'

import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { AreaEntrega, Fornecedor, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";
import { criarUrlVoltar } from "../../utils/criarUrlVoltar";
import { CabecalhoForm } from "../../componentes/CabecalhoForm";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";


export function FormAreaEntrega() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [fornecedor, setFornecedor] = useState('')

    const [rua, setRua] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [complemento, setComplemento] = useState('')
    const [estado, setEstado] = useState('MG')

    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro, todosRegistros } = useBackend('areas_entregas')
    const navigate = useNavigate()

    const { data: dadosAreaEntrega, status: statusAreaEntrega } = useQuery(
        'areaEntrega',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )

    const { data: registrosFornecedores, isLoading: carregandoFornecedores, status: statusFornecedores } = useQuery(
        'fornecedores',
        () => todosRegistros("fornecedores")
    )

    const queryClient = useQueryClient()

    const dados = {
        nome,
        codigo,
        fornecedor,
        rua,
        bairro,
        numero,
        cep,
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['areasEntregas'])
            toast.success('Área de Entrega salva com sucesso!', DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosAreaEntrega) {
            const dados = dadosAreaEntrega.data as AreaEntrega

            setCodigo(dados.codigo)
            setUuid(dados.uuid)
            setNome(dados.nome)

            setFornecedor(dados.fornecedor)
            setRua(dados.rua)
            setBairro(dados.bairro)
            setNumero(dados.numero)
            setCep(dados.cep)
            setComplemento(dados.complemento)
            setEstado(dados.estado)
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
        statusFornecedores === "success" && setFornecedores(registrosFornecedores.data.results as Fornecedor[])
    }, [statusFornecedores, carregandoFornecedores])


    useEffect(() => {
        pathname.match('editar/') && dadosAreaEntrega && preencherDados()
    }, [dadosAreaEntrega])

    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Área de Entrega" : `Editar Área de Entrega ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onDeletar: {
                            endpoint: 'areas_entregas',
                            textoSucesso: "Área de Entrega deletada com sucesso!",
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
                        ? statusAreaEntrega === 'success'
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

                        <div className="col-span-5 md:col-span-3 lg:col-span-3">
                            <label>Código</label>
                            <input type="number"
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-3 lg:col-span-3">
                            <label>Nome</label>
                            <input type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <label>Fornecedor <i className="text-rose-700">*</i></label>
                            <select name="fornecedor" id="uf" value={fornecedor} onChange={e => setFornecedor(e.target.value)} required>
                                <option value="">
                                    {
                                        statusFornecedores === "loading"
                                            ? "Carregando..."
                                            : fornecedores.length === 0
                                                ? "Não existem Fornecedores cadastrados"
                                                : "Selecione"
                                    }
                                </option>
                                {fornecedores.map((fornecedor: Fornecedor) => <option key={fornecedor.uuid} value={fornecedor.uuid}>{fornecedor.nome}</option>)}
                            </select>
                        </div>

                        <div className="col-span-4 md:col-span-3 lg:col-span-2">
                            <label>CEP <i className="text-rose-700">*</i></label>
                            <input type="number" required
                                value={cep}
                                onChange={e => setCep(e.target.value)}
                                onBlur={async e => {
                                    if (cep.replace("-", "").length !== 8) return toast.error("CEP inválido", DEFAULT_TOAST_CONFIG)

                                    const requisicao = toast.loading('Buscando dados do CEP')

                                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                                        .then(res => {
                                            if (res.status !== 200) return toast.update(requisicao, {
                                                type: 'error',
                                                render: 'CEP não encontrado',
                                                isLoading: false,
                                            })

                                            return res.json()
                                        })
                                        .then((dadosCep: ViacepResponse) => {
                                            toast.update(requisicao, {
                                                type: 'success',
                                                render: 'Dados de endereço carregados',
                                                ...DEFAULT_TOAST_CONFIG
                                            })

                                            setRua(dadosCep.logradouro)
                                            setBairro(dadosCep.bairro)
                                            setEstado(dadosCep.uf)
                                        })
                                }}
                            />
                        </div>

                        <div className="col-span-8 md:col-span-5 lg:col-span-4">
                            <label>Rua <i className="text-rose-700">*</i></label>
                            <input type="text" value={rua} onChange={e => setRua(e.target.value)} required />
                        </div>

                        <div className="col-span-7 md:col-span-4 lg:col-span-3">
                            <label>Estado <i className="text-rose-700">*</i></label>
                            <select name="uf" id="uf" value={estado} onChange={e => setEstado(e.target.value)} required >
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="EX">Exterior</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option></select>
                        </div>

                        <div className="col-span-5 md:col-span-3">
                            <label>Número <i className="text-rose-700">*</i></label>
                            <input type="text" value={numero} onChange={e => setNumero(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label>Bairro <i className="text-rose-700">*</i></label>
                            <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <label>Complemento</label>
                            <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} />
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}