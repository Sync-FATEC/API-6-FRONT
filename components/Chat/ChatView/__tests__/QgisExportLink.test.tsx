/**
 * Testes do componente QgisExportLink.
 *
 * Regras de negocio cobertas:
 * 1. Nao renderiza nada quando nao ha url nem urlsGrupos.
 * 2. Renderiza linha unica quando url principal eh fornecida.
 * 3. URL relativa eh convertida para absoluta usando localhost por padrao.
 * 4. URL absoluta passa direto sem prefixo.
 * 5. Renderiza uma linha por item em urlsGrupos.
 * 6. Botao de copiar coloca a URL no clipboard e mostra feedback (icone troca).
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QgisExportLink from "../QgisExportLink";

// ---------------------------------------------------------------------------
// Mock do toast (sonner) — efeito colateral irrelevante para o comportamento.
// ---------------------------------------------------------------------------
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Builders / Object Mothers
// ---------------------------------------------------------------------------
const umUrlGrupo = (overrides: Partial<{ rotulo: string; url: string }> = {}) => ({
  rotulo: "Campinas",
  url: "/api/geo/queimadas?municipio=Campinas",
  ...overrides,
});

const setarClipboardMock = () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText },
  });
  return writeText;
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Renderizacao condicional
// ---------------------------------------------------------------------------

describe("QgisExportLink — renderizacao condicional", () => {
  it("deve nao renderizar nada quando url e urlsGrupos estao ausentes", () => {
    const { container } = render(<QgisExportLink />);
    expect(container).toBeEmptyDOMElement();
  });

  it("deve nao renderizar nada quando url eh null e urlsGrupos eh array vazio", () => {
    const { container } = render(<QgisExportLink url={null} urlsGrupos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("deve renderizar o card de exportacao quando url principal eh fornecida", () => {
    render(<QgisExportLink url="/api/geo/queimadas?municipio=Ubatuba" />);
    expect(screen.getByText(/Abrir no QGIS/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Copiar URL/i }),
    ).toBeInTheDocument();
  });

  it("deve renderizar uma linha por item quando urlsGrupos tem multiplos elementos", () => {
    const urlsGrupos = [
      umUrlGrupo({ rotulo: "Campinas", url: "/api/geo/queimadas?municipio=Campinas" }),
      umUrlGrupo({ rotulo: "Sorocaba", url: "/api/geo/queimadas?municipio=Sorocaba" }),
    ];
    render(<QgisExportLink urlsGrupos={urlsGrupos} />);

    expect(screen.getByText("Campinas")).toBeInTheDocument();
    expect(screen.getByText("Sorocaba")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Copiar URL/i })).toHaveLength(2);
  });

  it("deve mostrar quantidade de camadas no subtitulo quando ha multiplos grupos", () => {
    const urlsGrupos = [
      umUrlGrupo({ rotulo: "Campinas" }),
      umUrlGrupo({ rotulo: "Sorocaba" }),
      umUrlGrupo({ rotulo: "Ubatuba" }),
    ];
    render(<QgisExportLink urlsGrupos={urlsGrupos} />);
    expect(screen.getByText(/3 camadas disponíveis/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Resolucao de URL relativa -> absoluta
// ---------------------------------------------------------------------------

describe("QgisExportLink — resolucao de URL", () => {
  it("deve apontar o link de abrir para URL absoluta com localhost quando entrada eh relativa", () => {
    render(<QgisExportLink url="/api/geo/queimadas?municipio=Ubatuba" />);
    const link = screen.getByTitle(/Abrir GeoJSON em nova aba/i) as HTMLAnchorElement;
    expect(link.href).toBe("http://127.0.0.1:8000/api/geo/queimadas?municipio=Ubatuba");
  });

  it("deve preservar URL absoluta inalterada quando entrada ja vem com http", () => {
    const urlAbsoluta = "https://api.exemplo.com/api/geo/quilombolas";
    render(<QgisExportLink url={urlAbsoluta} />);
    const link = screen.getByTitle(/Abrir GeoJSON em nova aba/i) as HTMLAnchorElement;
    expect(link.href).toBe(urlAbsoluta);
  });
});

// ---------------------------------------------------------------------------
// Acao de copiar
// ---------------------------------------------------------------------------

describe("QgisExportLink — botao copiar", () => {
  it("deve copiar a URL absoluta para o clipboard quando o botao eh clicado", async () => {
    const writeText = setarClipboardMock();
    render(<QgisExportLink url="/api/geo/queimadas?municipio=Ubatuba" />);

    await userEvent.click(screen.getByRole("button", { name: /Copiar URL/i }));

    expect(writeText).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/geo/queimadas?municipio=Ubatuba",
    );
  });

  it("deve copiar URL especifica do grupo quando o botao da linha do grupo eh clicado", async () => {
    const writeText = setarClipboardMock();
    const urlsGrupos = [
      umUrlGrupo({ rotulo: "Campinas", url: "/api/geo/queimadas?municipio=Campinas" }),
      umUrlGrupo({ rotulo: "Sorocaba", url: "/api/geo/queimadas?municipio=Sorocaba" }),
    ];
    render(<QgisExportLink urlsGrupos={urlsGrupos} />);

    const botoesCopiar = screen.getAllByRole("button", { name: /Copiar URL/i });
    await userEvent.click(botoesCopiar[1]);

    expect(writeText).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/geo/queimadas?municipio=Sorocaba",
    );
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("deve trocar o texto do botao para Copiado apos o clique com sucesso", async () => {
    setarClipboardMock();
    render(<QgisExportLink url="/api/geo/queimadas" />);

    await userEvent.click(screen.getByRole("button", { name: /Copiar URL/i }));

    expect(
      await screen.findByRole("button", { name: /Copiado/i }),
    ).toBeInTheDocument();
  });

  it("deve chamar toast.success quando a copia funciona", async () => {
    setarClipboardMock();
    const { toast } = await import("sonner");
    render(<QgisExportLink url="/api/geo/queimadas" />);

    await userEvent.click(screen.getByRole("button", { name: /Copiar URL/i }));

    expect(toast.success).toHaveBeenCalledWith(
      "URL copiada",
      expect.objectContaining({ description: expect.stringContaining("Camada principal") }),
    );
  });

  it("deve chamar toast.error quando o clipboard rejeita a escrita", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const { toast } = await import("sonner");
    render(<QgisExportLink url="/api/geo/queimadas" />);

    await userEvent.click(screen.getByRole("button", { name: /Copiar URL/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Falha ao copiar",
      expect.any(Object),
    );
  });
});

// ---------------------------------------------------------------------------
// Link "abrir em nova aba"
// ---------------------------------------------------------------------------

describe("QgisExportLink — link de abrir", () => {
  it("deve renderizar um link com target _blank apontando para a URL absoluta", () => {
    render(<QgisExportLink url="/api/geo/queimadas" />);
    const link = screen.getByTitle(/Abrir GeoJSON em nova aba/i) as HTMLAnchorElement;
    expect(link.tagName).toBe("A");
    expect(link.target).toBe("_blank");
    expect(link.href).toBe("http://127.0.0.1:8000/api/geo/queimadas");
  });
});
