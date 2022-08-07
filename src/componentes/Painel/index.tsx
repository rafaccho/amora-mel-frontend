import { Grid } from "../../componentes/Grid";
import { Endpoint } from "../../tipos";
import { ExibicaoDadoConfig } from "../../interfaces";



export function Painel(props: {
    titulo: string,
    grid: {
        exibicaoDadosConfig: ExibicaoDadoConfig[],
        requisicaoConfig: { endpoint: Endpoint }
    }
}) {

return (
    <div className="w-full max-w-full p-5">
    <h1 className="t-1 mb-2">{props.titulo}</h1>

        <div className="grid grid-cols-1 mt-12">

        <div id="registros" className="col-span-1">

            <Grid
                exibicaoDadosConfig={[
                    { coluna: 'Codigo', chaveApi: 'codigo' },
                    { coluna: 'Nome', chaveApi: 'nome' },
                    { coluna: 'Unidade 1', chaveApi: 'unidade1' },
                    { coluna: 'Quantidade 1', chaveApi: 'quantidade1' },
                    { coluna: 'Unidade 2', chaveApi: 'unidade2' },
                    { coluna: 'Quantidade 2', chaveApi: 'quantidade2' },
                ]}
                requisicaoConfig={{
                    endpoint: 'produtos',
                }}
            />
        </div>

    </div>
</div>
)
}