export function conversorFloat(valor: string): number {
  return parseFloat(valor.replace(',', '.'));
}

export function conversorString(valor: number): string {
  return valor.toString().replace('.', ',');
}