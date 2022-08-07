import { Painel } from "../../componentes/Painel"

export const PainelProduto = () => (
    <Painel
        titulo="Produtos"
        grid={{
            exibicaoDadosConfig: [
                { coluna: 'Codigo', chaveApi: 'codigo' },
                { coluna: 'Nome', chaveApi: 'nome' },
                { coluna: 'Unidade 1', chaveApi: 'unidade1' },
                { coluna: 'Quantidade 1', chaveApi: 'quantidade1' },
                { coluna: 'Unidade 2', chaveApi: 'unidade2' },
                { coluna: 'Quantidade 2', chaveApi: 'quantidade2' },
            ],
            requisicaoConfig: {
                endpoint: 'produtos',
            }
        }}
    />
)