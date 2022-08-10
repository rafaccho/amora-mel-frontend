import axios from "axios"
import { Endpoint, MetodoHttp } from "../tipos"

export function useBackend(endpointPrimario: Endpoint) {
    async function service(config: {
        metodo: MetodoHttp,
        endpointSecundario?: any,// Endpoint,
        uuid?: string,
        body?: any,
        filtros?: any,
    }) {
        const urlBase = 'http://192.168.0.216:8000/api/v1'
        // const urlBase = 'https://cors-everywhere-me.herokuapp.com/http://54.224.33.185:8000/api/v1'
        // const urlBase = 'http://localhost:8000/api/v1'

        const url = `${urlBase}/${config.endpointSecundario ? config.endpointSecundario : endpointPrimario}/${config.uuid ? `${config.uuid}/` : ''}`
        // const url = `${urlBase}/${config.endpointSecundario ? config.endpointSecundario : endpointPrimario}/${config.uuid ? `${config.uuid}/` : `${config.filtros}`}`

        return axios[config.metodo](url, config.body || {})
    }

    const todosRegistros = (endpointSecundario?: any, filtros?: any) => service({ metodo: 'get', endpointSecundario, filtros }) // : Endpoint
    const umRegistro = (uuid: string, endpointSecundario?: any) => service({ metodo: 'get', endpointSecundario, uuid }) // : Endpoint
    const criarRegistro = (body: any, endpointSecundario?: any) => service({ metodo: 'post', endpointSecundario, body }) // : Endpoint
    const editarRegistro = (uuid: string, body: any, endpointSecundario?: any) => service({ metodo: 'patch', endpointSecundario, uuid, body }) // : Endpoint
    const deletarRegistro = (uuid: string, endpointSecundario?: any, ) => service({ metodo: 'delete', endpointSecundario, uuid }) // : Endpoint

    return {
        todosRegistros,
        umRegistro,
        criarRegistro,
        editarRegistro,
        deletarRegistro,
    }
}