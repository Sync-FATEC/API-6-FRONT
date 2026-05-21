import { GEO_ENTITIES } from "@/constants/common";
import { PipelineStatusResponse } from "@/interfaces/services/PipelineService";
import GeoEntitiesTableRow from "./TableRow";
import Icon from "@/components/Icon";

interface Props {
  status?: PipelineStatusResponse;
  selectedEntities: string[];
  setSelectedEntities: (entities: string[]) => void;
}

export default function GeoEntitiesTable({ status, selectedEntities, setSelectedEntities }: Props) {
  const toggle = (key: string) => {
    if (selectedEntities.includes(key)) {
      setSelectedEntities(selectedEntities.filter((entityKey) => entityKey !== key));
    } else {
      setSelectedEntities([...selectedEntities, key]);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div
        className="grid items-center px-4 py-2 text-xs font-medium text-slate-500 bg-slate-50 border-b border-slate-200"
        style={{ gridTemplateColumns: "35% 25% 20% 20%" }}
      >
        <span className="flex items-center gap-1.5">
          <Icon name="gps-pin" size={16} />
          Entidade
        </span>

        <span className="flex items-center gap-1.5">
          <Icon name="script" size={16} />
          Fonte
        </span>

        <span className="flex items-center gap-1.5">
          <Icon name="data" size={16} />
          Registros
        </span>

        <span className="flex items-center gap-1.5">
          <Icon name="clock" size={16} />
          Última atualização
        </span>
      </div>

      {GEO_ENTITIES.map((entity, index) => (
        <GeoEntitiesTableRow
          key={entity.key}
          label={entity.label}
          source={entity.source}
          checked={selectedEntities.includes(entity.key)}
          onToggle={() => toggle(entity.key)}
          info={status?.fontes?.[entity.key]}
          isLast={index === GEO_ENTITIES.length - 1}
        />
      ))}
    </div>
  );
}
