import { Button } from "@/components/Button";
import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";
import { RISK_CONFIG } from "@/constants/chat";
import { MAP_SOURCES } from "@/constants/map";
import { useDownloadReport } from "@/hooks/useDownloadReport";
import {
  IAmeacaEncontrada,
  IImovelInfo,
  INotaRisco,
  TipoAmeaca,
} from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";

interface Props {
  imovel: IImovelInfo;
  ameacas: IAmeacaEncontrada[];
  risco?: INotaRisco | null;
}

const AMEACA_CONFIG: Record<
  TipoAmeaca,
  { label: string; icon: IconName; mapSource: keyof typeof MAP_SOURCES }
> = {
  queimada: { label: "Focos de queimada", icon: "flame", mapSource: "queimadas" },
  desmatamento_deter: {
    label: "Alertas DETER",
    icon: "axe",
    mapSource: "deter",
  },
  desmatamento_prodes: {
    label: "Desmatamento PRODES",
    icon: "axe",
    mapSource: "prodes",
  },
  terra_indigena: {
    label: "Terras Indígenas",
    icon: "leaf",
    mapSource: "funai",
  },
  unidade_conservacao: {
    label: "Unidades de Conservação",
    icon: "shield",
    mapSource: "icmbio",
  },
  quilombola: { label: "Territórios quilombolas", icon: "fist", mapSource: "palmares" },
};

function formatarDetalhe(a: IAmeacaEncontrada): string {
  switch (a.tipo) {
    case "queimada": {
      const partes: string[] = [];
      if (a.dentro_imovel && a.dentro_imovel > 0) {
        partes.push(`${a.dentro_imovel} dentro do imóvel`);
      } else if (a.distancia_min_km != null) {
        partes.push(`a ${a.distancia_min_km.toFixed(2)} km`);
      }
      if (a.frp_medio && a.frp_medio > 0) {
        partes.push(`FRP médio ${a.frp_medio.toFixed(1)} MW`);
      }
      return partes.join(" · ");
    }
    case "desmatamento_deter":
    case "desmatamento_prodes": {
      const partes: string[] = [];
      const area = a.area_intersecao_km2 ?? a.area_hist_km2;
      if (area && area > 0) {
        partes.push(`${(area * 100).toFixed(2)} ha dentro`);
      }
      if (a.distancia_min_km != null) {
        partes.push(`a ${a.distancia_min_km.toFixed(2)} km`);
      }
      return partes.join(" · ");
    }
    case "terra_indigena": {
      if (a.sobrepoe && a.sobreposicoes && a.sobreposicoes.length > 0) {
        return `Sobreposição: ${a.sobreposicoes.map((s) => s.nome).join(", ")}`;
      }
      if (a.proximas_10km && a.proximas_10km > 0) {
        return `${a.proximas_10km} a menos de 10 km`;
      }
      return "";
    }
    case "unidade_conservacao": {
      const partes: string[] = ["no município"];
      if (a.protecao_integral && a.protecao_integral > 0) {
        partes.push(`${a.protecao_integral} de proteção integral`);
      }
      return partes.join(" · ");
    }
    case "quilombola":
      return "no município";
    default:
      return "";
  }
}

function obterQuantidade(a: IAmeacaEncontrada): number {
  if (a.tipo === "terra_indigena") {
    const sobr = a.sobreposicoes?.length ?? 0;
    return sobr + (a.proximas_10km ?? 0);
  }
  return a.quantidade ?? 0;
}

function ehGrave(a: IAmeacaEncontrada): boolean {
  if (a.tipo === "terra_indigena" && a.sobrepoe) return true;
  if (a.tipo === "queimada" && (a.dentro_imovel ?? 0) > 0) return true;
  if (a.tipo === "desmatamento_deter" && (a.area_intersecao_km2 ?? 0) > 0) return true;
  if (a.tipo === "desmatamento_prodes" && (a.area_hist_km2 ?? 0) > 0) return true;
  return false;
}

function AmeacaRow({ ameaca }: { ameaca: IAmeacaEncontrada }) {
  const cfg = AMEACA_CONFIG[ameaca.tipo];
  if (!cfg) return null;

  const sourceConfig = MAP_SOURCES[cfg.mapSource];
  const cor = sourceConfig?.color ?? "#334155";
  const quantidade = obterQuantidade(ameaca);
  const detalhe = formatarDetalhe(ameaca);
  const grave = ehGrave(ameaca);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-md transition-colors",
        grave ? "bg-red-50" : "bg-slate-50"
      )}
    >
      <div
        className="relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: grave ? cor : `${cor}20` }}
      >
        <Icon name={cfg.icon} size={18} style={{ color: grave ? "#FFFFFF" : cor }} />

        {grave && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-red-50"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {quantidade > 0 && <span className="tabular-nums">{quantidade}</span>}
            {quantidade > 0 && " "}
            {cfg.label}
          </span>
        </div>
        {detalhe && (
          <div
            className={cn(
              "text-xs font-medium mt-0.5 truncate",
              grave ? "text-red-400" : "text-slate-500"
            )}
          >
            {detalhe}
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default function ImovelAmeacasCard({ imovel, ameacas, risco }: Props) {
  const temAmeacas = ameacas && ameacas.length > 0;
  const sicarCfg = MAP_SOURCES.sicar;
  const riscoCfg = risco ? (RISK_CONFIG[risco.nivel] ?? RISK_CONFIG.sem_dados) : null;
  const { mutate: downloadReport, isPending } = useDownloadReport();

  return (
    <div className="mt-4 mb-2 animate-pop-in-up rounded-lg overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-3 border-slate-100 bg-slate-50">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: sicarCfg.color }}
        >
          <Icon name={sicarCfg.icon} size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Imóvel Rural
          </div>
          <div className="text-xs font-medium text-slate-400 truncate" title={imovel.cod_imovel}>
            {imovel.cod_imovel}
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-slate-50 rounded-md py-3 px-4 w-full text-xs">
          <h5 className=" w-full font-semibold uppercase tracking-wider text-slate-400">
            Entidades Detectadas
          </h5>
          <span className=" font-semibold text-slate-500">
            {String(ameacas.length).padStart(2, "0")}
          </span>
        </div>

        {temAmeacas ? (
          ameacas.map((a, idx) => <AmeacaRow key={idx} ameaca={a} />)
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <Icon name="check" size={18} className="text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              Nenhum problema ambiental detectado na região
            </span>
          </div>
        )}

        {risco && risco.nivel !== "sem_dados" && riscoCfg && (
          <div className="flex flex-col gap-3 w-full mt-1">
            <div
              className={cn(
                "flex flex-1 justify-between gap-2 px-3 py-2 rounded-md text-sm font-semibold",
                riscoCfg.badge
              )}
            >
              <span>Risco {riscoCfg.label}</span>
              <span className="font-bold">{risco.nota}/100</span>
            </div>

            <Button
              size="sm"
              onClick={() => downloadReport(imovel.cod_imovel)}
              isLoading={isPending}
            >
              Baixar relatório completo
              <Icon name="download" size={20} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
