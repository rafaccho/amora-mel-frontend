import axios from "axios"
import { Endpoint, MetodoHttp } from "../tipos"

export function useBackend(endpointPrimario: Endpoint) {
    async function service(config: {
        metodo: MetodoHttp,
        endpointSecundario?: Endpoint,
        uuid?: string,
        body?: any,
        filtros?: string,
    }) {
        const urlBase = 'http://localhost:8000/api/v1'
        // const urlBase = 'http://192.168.0.216:8000/api/v1'
        // const urlBase = 'https://cors-everywhere-me.herokuapp.com/http://54.224.33.185:8000/api/v1'

        const url = `${urlBase}/${config.endpointSecundario ? config.endpointSecundario : endpointPrimario}/${config.uuid ? `${config.uuid}/` : config.filtros ? `?${config.filtros}` : ''}`
        return axios[config.metodo](url, config.body || {})
    }

    /* Serviços do CRUD dos registros */
    const todosRegistros = (endpointSecundario?: Endpoint, filtros?: any) => service({ metodo: 'get', endpointSecundario, filtros })
    const umRegistro = (uuid: string, endpointSecundario?: Endpoint) => service({ metodo: 'get', endpointSecundario, uuid })
    const criarRegistro = (body: any, endpointSecundario?: Endpoint) => service({ metodo: 'post', endpointSecundario, body })
    const editarRegistro = (uuid: string, body: any, endpointSecundario?: Endpoint) => service({ metodo: 'patch', endpointSecundario, uuid, body })
    const deletarRegistro = (uuid: string, endpointSecundario?: Endpoint, ) => service({ metodo: 'delete', endpointSecundario, uuid })

    /* Serviço de autenticação */
    const login = (body: {usuario: string, senha: string}) => service({ metodo: 'post', body })

    return {
        todosRegistros,
        umRegistro,
        criarRegistro,
        editarRegistro,
        deletarRegistro,
        login
    }
}