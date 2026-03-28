import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-white text-white p-4 shadow-sm rounded-md h-18 mt-3">
      <div className="flex justify-between items-center h-full text-slate-400">
        <p>VISIONA GeoQuery © Todos os direitos reservados. 2026</p>
        <div className="flex gap-3 items-center">
          <Icon name="github" />
          <p>
            Desenvolvido por Team Sync
            <span className="mx-2">•</span>
            API 6° SEM | FATEC SJC
          </p>
        </div>
      </div>
    </footer>
  );
}
