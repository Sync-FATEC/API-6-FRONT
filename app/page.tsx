import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex gap-3 flex-1 min-h-0">
      <div className="w-[25%] flex flex-col min-h-0">
        <Chat />
      </div>

      <div className="w-[75%] bg-white rounded-lg p-6 shadow-sm min-h-0"></div>
    </div>
  );
}