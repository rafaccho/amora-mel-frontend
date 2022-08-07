export function criarUrlVoltar(url: string): string {
  return url.match('cadastrar/')
  ? url.replace('cadastrar/', '')
  : url.split('/').splice(0, 3).join('/') + '/'
}