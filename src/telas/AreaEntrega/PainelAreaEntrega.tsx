import { Painel } from "../../componentes/Painel"

export const PainelAreaEntrega = () => (
    <Painel
        titulo="Áreas de entrega"
        grid={{
            exibicaoDadosConfig: [
                { coluna: 'Codigo', chaveApi: 'codigo' },
                { coluna: 'Nome', chaveApi: 'nome' },
                { coluna: 'Fornecedor', chaveApi: 'fornecedor' },
                { coluna: 'CEP', chaveApi: 'cep' },
                { coluna: 'Bairro', chaveApi: 'bairro' },
                { coluna: 'Rua', chaveApi: 'rua' },
            ],
            requisicaoConfig: {
                endpoint: 'areas_entregas',
            }
        }}
    />
)