import React from "react"


export function useValidacao() {
    function validarCampos(inputs: HTMLDivElement): boolean {
        const todosInputs = inputs!.querySelectorAll('input')
        Array.from(todosInputs).forEach(input => {
            const inputEstaValido = input.checkValidity()
            !inputEstaValido ? input.classList.add('invalidado') : input.classList.remove('invalidado')
            return inputEstaValido
        })

        return !(document.querySelector('.invalidado'))
    }

    function validarCampo(input: any): boolean {
        const inputEstaValido = input.checkValidity()
        !inputEstaValido ? input.classList.add('invalidado') : input.classList.remove('invalidado')

        return input.classList.contains('invalidado')
    }

    return {
        validarCampos,
        validarCampo
    }
}