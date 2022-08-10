import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";
import { CabecalhoForm } from "../../componentes/CabecalhoForm";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { criarUrlVoltar } from "../../utils/criarUrlVoltar";
import { Produto } from "../../interfaces";

export function FormAgrupamentos(props: {
    entidade: "G" | "S"
}) {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [grupo, setGrupo] = useState('')

    const inputs = useRef<HTMLDivElement>(null)

    const { uuidEdit } = useParams()
    const { pathname } = useLocation()
    const { criarRegistro, editarRegistro, umRegistro } = useBackend('agrupamentos')
    const navigate = useNavigate()

    const { data: dadosAgrupamento, status: statusAgrupamento } = useQuery(
        props.entidade === "G" ? 'grupos' : "subgrupos",
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: uuidEdit !== undefined }
    )

    const { data: dadosGrupos, status: statusGrupos } = useQuery(
        'grupos-select',
        () => umRegistro(uuidEdit ? uuidEdit : uuid),
        { enabled: props.entidade === "G" }
    )

    const queryClient = useQueryClient()

    const dados = {
        codigo,
        nome,
        descricao,
        entidade: props.entidade
    }

    const mutation = useMutation(() => uuidEdit ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            queryClient.invalidateQueries(['produtos'])
            toast.success(`${props.entidade === "G" ? 'Grupo' : "Subgrupo"} salvo com sucesso!`, DEFAULT_TOAST_CONFIG)
            navigate(criarUrlVoltar(pathname))
        },
        onError: () => {
            toast.error("Ocorreu um erro!", DEFAULT_TOAST_CONFIG)
        }
    })

    function preencherDados(): void {
        if (dadosAgrupamento) {
            const dados = dadosAgrupamento.data as Produto

            setCodigo(dados.codigo)
            setUuid(dados.uuid)
            setNome(dados.nome)
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
        pathname.match('editar/') && dadosAgrupamento && preencherDados()
    }, [dadosAgrupamento])

    return (
        <div className="p-5">

            <div className="cabecalho-form">
                <CabecalhoForm
                    titulo={pathname.match('cadastrar/') ? "Cadastro de Grupos" : `Editar Produto ${uuidEdit?.split('-')[0]}`}
                    botoesForm={{
                        onSalvar: () => mutation.mutate(),
                        onDeletar: {
                            endpoint: 'agrupamentos',
                            textoSucesso: `${props.entidade === "G" ? 'Grupo' : "Subgrupo"} deletado com sucesso!`,
                            textoErro: "Ocorreu um erro!",
                        },
                        validarCampos,
                    }}
                />
            </div>

            {statusAgrupamento === 'loading' && <Loading />}

            {statusAgrupamento === 'error' && <Error />}

            {
                (
                    uuidEdit !== undefined
                        ? statusAgrupamento === 'success'
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

                    <div className="col-span-12 md:col-span-5 lg:col-span-5">
                        <label>Descrição <i className="text-rose-700">*</i></label>
                        <input type="text"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            required
                        />
                    </div>

                    {/* <select name="grupo" id="grupo" value={grupo} onChange={e => setGrupo(e.target.value)} required>
                        <option value="">
                            {
                                statusProdutos === "loading"
                                    ? "Carregando..."
                                    : produtos.length === 0
                                        ? "Não existem grupos cadastrados"
                                        : "Selecione"
                            }
                        </option>
                        {dadosGrupos.map((grupo: Grupo) => <option key={grupo.uuid} value={grupo.uuid}>{grupo.nome}</option>)}
                    </select> */}

                </div>
            }
        </div>
    )
}