import { Endpoint, MetodoHttp } from "../tipos"

export function useBackend(endpoint?: Endpoint) {
    async function _fetcher(config: { method: MetodoHttp, uuid?: string, endpoint2?: Endpoint | undefined, body?: any }) {
        // const urlBase = 'http://192.168.0.216:8000/api/v1'
        // const urlBase = 'http://localhost:8000/api/v1'
        // const urlBase = 'http://54.224.33.185:8000/api/v1'
        const urlBase = 'https://cors-everywhere-me.herokuapp.com/http://54.224.33.185:8000/api/v1'

        const init = {
            method: config.method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(config.body),
        }

        var url = `${urlBase}/${endpoint}/${config.uuid ? `${config.uuid}/` : ''}`

        return await fetch(url, init).then(async res => {
            const status = res.status
            const obj = await res.json()
            return {...obj, status}
        })
    }

    const todosRegistros = (endpoint2?: Endpoint) => _fetcher({ method: "GET", endpoint2: endpoint2 ? endpoint2 : undefined })
    const umRegistro = (uuid: string, endpoint2?: Endpoint) => _fetcher({ method: "GET", uuid, endpoint2: endpoint2 ? endpoint2 : undefined })
    const criarRegistro = (body: any, endpoint2?: Endpoint) => _fetcher({ method: "POST", body, endpoint2: endpoint2 ? endpoint2 : undefined })
    const editarRegistro = (uuid: string, body: any, endpoint2?: Endpoint) => _fetcher({ method: "PATCH", uuid, body, endpoint2: endpoint2 ? endpoint2 : undefined })
    const deletarRegistro = (uuid: string, endpoint2?: Endpoint) => _fetcher({ method: "DELETE", uuid, endpoint2: endpoint2 ? endpoint2 : undefined })

    return {
        todosRegistros,
        umRegistro,
        criarRegistro,
        editarRegistro,
        deletarRegistro,
    }
}