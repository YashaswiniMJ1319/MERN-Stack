export default function ManagerTopbar() {
  return (
    <div className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-[#1A237E]">
        Dashboard Overview
      </h2>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-full flex items-center justify-center text-white font-bold">
          M
        </div>
      </div>
    </div>
  );
}
