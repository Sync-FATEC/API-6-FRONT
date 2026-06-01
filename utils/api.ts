/**
 * Retorna o caminho relativo para a API (/api).
 * Isso garante que todas as requisições normais do frontend no navegador
 * sejam feitas de forma relativa para a própria origem segura (HTTPS),
 * eliminando completamente problemas de Mixed Content (HTTP/HTTPS mistos)
 * e contornando problemas de pré-avaliação do Next.js no build.
 */
export function getApiBaseUrl(): string {
  return "/api";
}

/**
 * Retorna a URL base do projeto absoluta (com o domínio atual do navegador)
 * para a geração de links do QGIS, garantindo que o link seja HTTPS no deploy.
 * 
 * IMPORTANTE: Esta função DEVE SER USADA APENAS no navegador (client-side).
 * Para SSR, use window.location.origin que estará disponível após hidratação.
 */
export function getProjectBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback seguro: retorna raiz relativa para SSR
  // Nunca use URLs hardcoded que causem Mixed Content
  return "";
}

/**
 * Retorna a URL da API absoluta para exibições e ações externas que necessitem
 * de caminho completo (como no catálogo do QGIS).
 */
export function getQgisApiBaseUrl(): string {
  return `${getProjectBaseUrl()}/api`;
}
