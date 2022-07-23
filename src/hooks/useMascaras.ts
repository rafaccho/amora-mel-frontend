export function useMascara() {
    const setarMascaraCpf = (cpf: string, ocultar = false) => {
        if (cpf) {
            return (
                cpf
                    .replace(/\D/g, '')
                    .replace(/(\d{3})(\d)/, `${ocultar ? '***' : '$1'}.$2`)
                    .replace(/(\d{3})(\d)/, `$1.$2`)
                    .replace(/(\d{3})(\d)/, `$1-$2`)
                    .replace(/(-\d{2})(.*)/, `${ocultar ? '-**' : '$1'}`)
            )
        }

        return ''
    }

    const setarMascaraCnpj = (cnpj: string) => {
        if (cnpj) {
            return (
                cnpj
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2')
                    .replace(/(-\d{2})(.*)/, '$1')
            )
        }

        return ''
    }

    const setarMascaraCelular = (celular: string, international=false) => {
        if (celular) {
            if (international) {
                return (
                    celular
                        .replace(/[^\d+-\s]/gi, '')
                        .replace(/(.{25})(.*)/, '$1')
                )
            }

            return (
                celular
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .replace(/(-\d{4})(.*)/, '$1')
            )
        }

        return ''
    }


    return {
        setarMascaraCpf,
        setarMascaraCnpj,
        setarMascaraCelular,
    }
}