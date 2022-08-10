import { Grid } from "../../componentes/Grid";
import { Endpoint } from "../../tipos";
import { ExibicaoDadoConfig } from "../../interfaces";



export function Painel(props: {
    titulo: string,
    grid: {
        exibicaoDadosConfig: ExibicaoDadoConfig[],
        requisicaoConfig: { endpoint: Endpoint, filtros?: string, }
    }
}) {

    return (
        <div className="w-full max-w-full p-5">
            <h1 className="t-1 mb-2">{props.titulo}</h1>

            <div className="grid grid-cols-1 mt-12">

                <div id="registros" className="col-span-1">

                    <Grid
                        exibicaoDadosConfig={props.grid.exibicaoDadosConfig}
                        requisicaoConfig={props.grid.requisicaoConfig}
                    />
                </div>

            </div>
        </div>
    )
}