import { Painel } from "../../componentes/Painel"

export const PainelFornecedor = () => (
    <Painel
        titulo="Fornecedores"
        grid={{
            exibicaoDadosConfig: [
                { coluna: 'Codigo', chaveApi: 'codigo' },
                { coluna: 'Nome', chaveApi: 'nome' },
                { coluna: 'CPF/CNPJ', chaveApi: 'cpf_cnpj' },
                { coluna: 'CEP', chaveApi: 'cep' },
                { coluna: 'Bairro', chaveApi: 'bairro' },
                { coluna: 'Rua', chaveApi: 'rua' },
            ],
            requisicaoConfig: {
                endpoint: 'fornecedores',
            }
        }}
    />
)