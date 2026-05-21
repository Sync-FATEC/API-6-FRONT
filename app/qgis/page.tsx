"use client";

import dynamic from "next/dynamic";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import LayerSelector from "@/components/Qgis/LayerSelector";
import LayerFilterForm from "@/components/Qgis/LayerFilterForm";
import UrlPreview from "@/components/Qgis/UrlPreview";
import QgisInstructions from "@/components/Qgis/QgisInstructions";
import PreviewStats from "@/components/Qgis/PreviewStats";
import { useQgis } from "@/components/Qgis/useQgis";
import Icon from "@/components/Icon";

const PreviewMap = dynamic(() => import("@/components/Qgis/PreviewMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
      <LoadingSpinner />
    </div>
  ),
});

export default function QgisPage() {
  const {
    catalogo,
    catalogoLoading,
    catalogoError,
    selecionada,
    valores,
    setValores,
    url,
    preview,
    loadingPreview,
    handleSelectCamada,
    handleReset,
    handlePreview,
    handleDownload,
  } = useQgis();

  if (catalogoLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (catalogoError || !catalogo) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-white rounded-lg shadow-sm p-8">
        <Icon name="info" size={32} className="text-danger" />
        <p className="font-semibold text-slate-700">
          Não foi possível carregar o catálogo de camadas.
        </p>
        <p className="text-sm text-slate-500">
          Verifique se o backend está em execução em{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded">/api/geo/catalogo</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-1 min-h-0 p-3">
      <aside className="w-[25%] flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4 min-h-0 overflow-hidden">
          <h1 className="text-xl font-semibold text-primary mb-1">Integração QGIS</h1>
          <LayerSelector
            camadas={catalogo.camadas}
            selecionada={selecionada}
            onSelect={handleSelectCamada}
          />
        </div>
      </aside>

      <section className="w-[25%] flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm flex flex-col gap-4 min-h-0 overflow-hidden">
          {selecionada ? (
            <>
              <LayerFilterForm
                camada={selecionada}
                valores={valores}
                onChange={setValores}
                onReset={handleReset}
              />

              <div className="h-px bg-slate-100" />

              <UrlPreview
                url={url}
                onPreview={handlePreview}
                onDownload={handleDownload}
                loading={loadingPreview}
              />

              <div className="mt-auto pt-2">
                <QgisInstructions />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-sm text-slate-500">
              Selecione uma camada à esquerda para configurar a exportação.
            </div>
          )}
        </div>
      </section>

      <section className="w-[50%] flex flex-col min-h-0">
        {preview ? (
          <div className="bg-white rounded-lg shadow-sm h-full w-full relative overflow-hidden">
            <PreviewStats preview={preview} />
            <PreviewMap data={preview.data} camada={selecionada} />
          </div>
        ) : (
          <EmptyMapState
            loading={loadingPreview}
            onPreview={handlePreview}
            hasCamada={!!selecionada}
          />
        )}
      </section>
    </div>
  );
}

function EmptyMapState({
  loading,
  onPreview,
  hasCamada,
}: {
  loading: boolean;
  onPreview: () => void;
  hasCamada: boolean;
}) {
  return (
    <div className="flex bg-white rounded-lg p-6 shadow-sm h-full justify-center items-center">
      <div className="flex flex-col gap-4 max-w-3xl w-full items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
          <Icon name="world" size={40} className="text-primary" />
        </div>
        <h3 className="font-semibold text-2xl text-slate-700">
          Pré-visualize a camada antes de copiar
        </h3>
        <p className="text-base text-slate-500 max-w-lg leading-relaxed">
          Configure os filtros e clique em <strong>Mapa</strong> para validar visualmente o GeoJSON
          antes de colar a URL no QGIS.
        </p>
        {hasCamada && (
          <button
            onClick={onPreview}
            disabled={loading}
            className="mt-2 flex items-center gap-2 rounded-lg bg-primary text-white font-semibold px-6 py-3 hover:bg-primary-600 transition disabled:opacity-50 cursor-pointer"
          >
            <Icon name="map" size={20} />
            {loading ? "Carregando..." : "Pré-visualizar agora"}
          </button>
        )}
      </div>
    </div>
  );
}
