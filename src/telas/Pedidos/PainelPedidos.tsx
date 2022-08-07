import { Painel } from "../../componentes/Painel"

export const PainelPedidos = () => (
    <Painel
        titulo="Pedidos"
        grid={{
            exibicaoDadosConfig: [
                { coluna: 'Fornecedor', chaveApi: 'fornecedor', mascara: () => '' },
                { coluna: 'Produto', chaveApi: 'produto' },
                { coluna: 'quantidade', chaveApi: 'quantidade' },
            ],
            requisicaoConfig: {
                endpoint: 'pedidos',
            }
        }}
    />
)