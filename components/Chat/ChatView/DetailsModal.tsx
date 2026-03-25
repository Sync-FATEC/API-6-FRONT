import Button from "../../Button";

interface DetailsModalProps {
  source?: string;
  year?: number;
  intention?: string;
}

export default function DetailsModal({ source, year, intention }: DetailsModalProps) {
  const details = [
    { label: "Fonte", value: source },
    { label: "Ano", value: year },
    { label: "Intenção", value: intention },
  ].filter((item) => item.value);

  return (
    <div className="mt-2 relative inline-block group">
      <div className="cursor-default">
        <Button variant="tertiary" size="sm">
          Mais informações
        </Button>
      </div>

      <div
        className="absolute left-0 top-full pt-2 z-20 
        origin-top-left opacity-0 invisible scale-95 
        group-hover:opacity-100 group-hover:visible group-hover:scale-100 
        transition-all duration-200 ease-out"
      >
        <div className="p-4 bg-white border border-slate-100 shadow-xl rounded-xl">
          <div className="flex flex-col gap-2 text-sm text-slate-700 text-left">
            
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between items-center gap-8">
                <p className="font-medium text-slate-500">{detail.label}</p>
                <span className="whitespace-nowrap">
                  {detail.value}
                </span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}