export type MetodoHttp = 'get' | 'post' | 'put' | 'delete' | 'patch'
export type Endpoint = 'pedidos' | 'areas_entregas' | 'fornecedores' | 'lojas' | 'produtos' | 'produto_fornecedores' | 'compras' | 'areas_entregas_produto' | 'agrupamentos' | 'login'
export type PedidoStatus = 'A' | 'P' | 'B' | 'F' | 'C' 
export type UnidadeLoja = 'FA' | 'CN' | 'UN' | 'FL'
export type SimNao = 'S' | 'N'
export type Estado = 'RO' | 'AC' | 'AM' | 'RR' | 'PA' | 'AP' | 'TO' | 'MA' | 'PI' | 'CE' | 'RN' | 'PB' | 'PE' | 'AL' | 'SE' | 'BA' | 'MG' | 'ES' | 'RJ' | 'SP' | 'PR' | 'SC' | 'RS' | 'MS' | 'MT' | 'GO' | 'DF'
export type ReponseStatus = 200 | 201 | 400 | 404 | 500