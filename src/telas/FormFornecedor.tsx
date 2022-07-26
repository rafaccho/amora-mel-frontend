import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { DEFAULT_TOAST_CONFIG } from "../constantes";
import { useBackend } from "../hooks/useBackend";
import { AreaEntrega, Fornecedor, ViacepResponse } from "../interfaces";
import { criarUrlVoltar } from "../utils/criarUrlVoltar";
import { CabecalhoForm } from "../componentes/CabecalhoForm";
import { Loading } from "../componentes/Loading";
import { Error } from "../componentes/Error";


export function FormFornecedor() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [cpfCnpj, setCpfCnpj] = useState('')

    const [rua, setRua] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [complemento, setComplemento] = useState('')
    const [estado, setEstado] = useState('MG')

    const [areaEntrega, setAreaEntrega] = useState('')

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro, todosRegistros } = useBackend('fornecedores')
    const navigate = useNavigate()

    const { data: dadosAreaEntrega, status: statusAreaEntrega } = useQuery(['area_entregas'], () => todosRegistros('areas_entregas'))
    const { data: dadosFornecedor, status: statusFornecedadosFornecedor } = useQuery(['fornecedor', uuidEdit], () => umRegistro(uuidEdit ? uuidEdit : ''))
    

    const queryClient = useQueryClient()

    const dados = {
        nome,
        codigo,
        cpf_cnpj: cpfCnpj,
        rua,
        bairro,
        numero,
        cep,
        area_entrega: areaEntrega
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['fornecedores', uuidEdit])
            toast.success('Área de Entrega salva com sucesso!', DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosFornecedor) {
            const dados = dadosFornecedor.data as Fornecedor

            if (!uuid) {
                setCodigo(dados.codigo)
                setUuid(dados.uuid)
                setNome(dados.nome)

                setCpfCnpj(dados.cpf_cnpj)
                setRua(dados.rua)
                setBairro(dados.bairro)
                setNumero(dados.numero)
                setCep(dados.cep)
                setComplemento(dados.complemento)
                setEstado(dados.estado)
                setAreaEntrega(dados.area_entrega.uuid)
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
        pathname.match('editar/') && dadosFornecedor && preencherDados()
    }, [dadosFornecedor])

    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Fornecedor" : `Editar Fornecedor ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onVoltar: () => {
                            queryClient.invalidateQueries('fornecedores')
                        },
                        onDeletar: {
                            endpoint: 'fornecedores',
                            textoSucesso: "Fornecedor deletado com sucesso!",
                            textoErro: "Ocorreu um erro!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusFornecedadosFornecedor === 'loading' && <Loading />}
            {statusFornecedadosFornecedor === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusFornecedadosFornecedor === 'success'
                        : pathname.match('cadastrar/')
                ) &&
                <div ref={inputs} id="formulario" className="p-5">
                    <div className="inputs">

                        <div className="col-span-12 md:col-span-4 lg:col-span-4">
                            <label>Identificador</label>
                            <input type="text"
                                value={uuid}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-12 md:col-span-3 lg:col-span-3">
                            <label>Código</label>
                            <input type="number" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <label>Nome <i className="text-rose-700">*</i></label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <label>CPF\CNPJ <i className="text-rose-700">*</i></label>
                            <input type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} required />
                        </div>


                        <div className="col-span-12 md:col-span-3 lg:col-span-2">
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

                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <label>Rua <i className="text-rose-700">*</i></label>
                            <input type="text" value={rua} onChange={e => setRua(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-4 lg:col-span-3">
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
                                <option value="TO">Tocantins</option>
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <label>Número <i className="text-rose-700">*</i></label>
                            <input type="text" value={numero} onChange={e => setNumero(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-5 lg:col-span-4">
                            <label>Bairro <i className="text-rose-700">*</i></label>
                            <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} required />
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <label>Complemento</label>
                            <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} />
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <label>Área de Entrega <i className="text-rose-700">*</i></label>
                            <select name="fornecedor" id="uf" value={areaEntrega} onChange={e => setAreaEntrega(e.target.value)} required>
                                <option value="">Selecione</option>
                                {dadosAreaEntrega?.data.results.map((areaEntrega: AreaEntrega) => <option key={areaEntrega.uuid} value={areaEntrega.uuid}>{areaEntrega.nome}</option>)}
                            </select>
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}