import { NextRequest, NextResponse } from "next/server";
import { TOKEN_KEY } from "@/constants/auth";

/**
 * Proxy - Autenticação + Redireciona /api/* para o backend
 * 
 * Fluxo:
 * Cliente (navegador HTTPS) → Vercel /api/v1/... → Este proxy → ALB HTTP
 * 
 * Benefícios:
 * - Elimina Mixed Content (navegador vê HTTPS)
 * - Headers e tokens passam intactos
 * - Autenticação mantida nas rotas protegidas
 */

// Raiz do backend lida do ambiente. O `pathname` já inclui `/api/...`, então
// removemos um eventual sufixo `/api` de NEXT_PUBLIC_API_URL para não duplicar.
// Prioridade: BACKEND_URL (server) > NEXT_PUBLIC_API_URL > fallback de produção.
const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://asg-backend-alb-85114170.us-east-1.elb.amazonaws.com"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
const AUTH_ENABLED = true;
const PUBLIC_ROUTES = ["/login", "/redefinir-senha"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // =========================================================================
  // 1. PROXY DE API
  // =========================================================================
  if (pathname.startsWith("/api/")) {
    return await handleApiProxy(request, pathname, search);
  }

  // =========================================================================
  // 2. AUTENTICAÇÃO
  // =========================================================================
  if (!AUTH_ENABLED) return NextResponse.next();

  const token = request.cookies.get(TOKEN_KEY)?.value;

  // Normaliza o caminho removendo a barra no final
  const cleanPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(cleanPathname);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * Handle para proxy de requisições API
 */
async function handleApiProxy(
  request: NextRequest,
  pathname: string,
  search: string
) {
  const backendUrl = `${BACKEND_URL}${pathname}${search}`;

  try {
    // Prepara headers
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");

    // Prepara opções
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: headers,
    };

    // Adiciona body se necessário (para POST, PUT, PATCH, DELETE)
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      } catch (error) {
        console.error(`[API Proxy] Erro ao ler body da requisição:`, error);
      }
    }

    // Requisição ao backend
    const backendResponse = await fetch(backendUrl, fetchOptions);
    const responseBody = await backendResponse.text();
    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    // Copia headers importantes
    const headersToProxy = [
      "content-type",
      "content-length",
      "cache-control",
      "set-cookie",
      "access-control-allow-origin",
      "access-control-allow-credentials",
    ];

    headersToProxy.forEach((header) => {
      const value = backendResponse.headers.get(header);
      if (value) {
        response.headers.set(header, value);
      }
    });

    return response;
  } catch (error) {
    console.error(`[API Proxy] Erro ao acessar ${backendUrl}:`, error);
    return NextResponse.json(
      { detail: "Erro ao conectar ao backend" },
      { status: 502 }
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.json$).*)"],
};
