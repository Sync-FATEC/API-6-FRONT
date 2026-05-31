/**
 * Testes do componente QgisExportLink.
 *
 * Regras de negocio cobertas:
 * 1. Nao renderiza nada quando nao ha url nem urlsGrupos.
 * 2. Renderiza botao de copiar quando url principal ou urlsGrupos sao fornecidos.
 * 3. URL relativa eh convertida para absoluta usando localhost por padrao.
 * 4. URL absoluta passa direto sem prefixo.
 * 5. Multiplos urlsGrupos sao copiados juntos separados por quebra de linha.
 * 6. Botao de copiar coloca a URL no clipboard e mostra feedback (muda classes).
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

  it("deve renderizar o botao de copiar quando url principal eh fornecida", () => {
    render(<QgisExportLink url="/api/geo/queimadas?municipio=Ubatuba" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("deve renderizar o botao de copiar quando urlsGrupos tem elementos", () => {
    const urlsGrupos = [
      umUrlGrupo({ rotulo: "Campinas", url: "/api/geo/queimadas?municipio=Campinas" }),
    ];
    render(<QgisExportLink urlsGrupos={urlsGrupos} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Resolucao de URL relativa -> absoluta & Acao de copiar
// ---------------------------------------------------------------------------

describe("QgisExportLink — botao copiar", () => {
  it("deve copiar a URL absoluta para o clipboard quando o botao eh clicado", async () => {
    const writeText = setarClipboardMock();
    render(<QgisExportLink url="/api/geo/queimadas?municipio=Ubatuba" />);

    const botao = screen.getByRole("button");
    await userEvent.click(botao);

    expect(writeText).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/geo/queimadas?municipio=Ubatuba"
    );
  });

  it("deve preservar URL absoluta inalterada quando entrada ja vem com http", async () => {
    const writeText = setarClipboardMock();
    const urlAbsoluta = "https://api.exemplo.com/api/geo/quilombolas";
    render(<QgisExportLink url={urlAbsoluta} />);

    const botao = screen.getByRole("button");
    await userEvent.click(botao);

    expect(writeText).toHaveBeenCalledWith(urlAbsoluta);
  });

  it("deve copiar todas as URLs dos grupos unidas por quebra de linha quando clicado", async () => {
    const writeText = setarClipboardMock();
    const urlsGrupos = [
      umUrlGrupo({ rotulo: "Campinas", url: "/api/geo/queimadas?municipio=Campinas" }),
      umUrlGrupo({ rotulo: "Sorocaba", url: "/api/geo/queimadas?municipio=Sorocaba" }),
    ];
    render(<QgisExportLink urlsGrupos={urlsGrupos} />);

    const botao = screen.getByRole("button");
    await userEvent.click(botao);

    expect(writeText).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/geo/queimadas?municipio=Campinas\nhttp://127.0.0.1:8000/api/geo/queimadas?municipio=Sorocaba"
    );
  });

  it("deve mudar a classe do botao para indicar sucesso apos o clique", async () => {
    setarClipboardMock();
    render(<QgisExportLink url="/api/geo/queimadas" />);

    const botao = screen.getByRole("button");
    expect(botao).toHaveClass("text-slate-500");

    await userEvent.click(botao);

    expect(botao).toHaveClass("text-success");
  });

  it("deve chamar toast.success quando a copia funciona", async () => {
    setarClipboardMock();
    const { toast } = await import("sonner");
    render(<QgisExportLink url="/api/geo/queimadas" />);

    const botao = screen.getByRole("button");
    await userEvent.click(botao);

    expect(toast.success).toHaveBeenCalledWith(
      "URL copiado",
      expect.objectContaining({
        description: "Cole no QGIS em Layer > Add Vector Layer > Protocol HTTP(S).",
      })
    );
  });

  it("deve chamar toast.error quando o clipboard rejeita a escrita", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const { toast } = await import("sonner");
    render(<QgisExportLink url="/api/geo/queimadas" />);

    const botao = screen.getByRole("button");
    await userEvent.click(botao);

    expect(toast.error).toHaveBeenCalledWith(
      "Falha ao copiar",
      expect.objectContaining({
        description: "Tente novamente.",
      })
    );
  });
});
