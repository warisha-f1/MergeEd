import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#90AB8B]">
      {/* Main Login Card - The entry point for the Institutional Flow */}
      <div className="w-[380px] rounded-2xl border-[5px] border-[#1f3d2b] bg-[#bfe6cc] p-10 text-center shadow-[8px_8px_0px_0px_#1f3d2b]">
        
        {/* Title: Part of the 'Security & Sessions' module requirement [cite: 2025-11-17] */}
        <h1 className="mb-10 text-2xl font-black tracking-widest text-black uppercase">
          LOGIN
        </h1>

        {/* Navigation Buttons to different Roles */}
        <div className="flex flex-col gap-6">
          
          {/* TEACHER: Entry point for Curriculum Engine [cite: 2025-11-17] */}
          <Link href="/teacher">
            <button className="w-full rounded-full bg-[#6f9b77] py-4 text-sm font-black text-black border-[3px] border-[#1f3d2b] hover:bg-[#5f8b67] transition shadow-[4px_4px_0px_0px_#1f3d2b] active:translate-y-1">
              TEACHER
            </button>
          </Link>

          {/* DIET: Entry point for Approvals & Oversight [cite: 2025-11-17] */}
          <Link href="/admin/diet">
            <button className="w-full rounded-full bg-[#6f9b77] py-4 text-sm font-black text-black border-[3px] border-[#1f3d2b] hover:bg-[#5f8b67] transition shadow-[4px_4px_0px_0px_#1f3d2b] active:translate-y-1">
              DIET PORTAL
            </button>
          </Link>

          {/* SCERT: Entry point for State Observability [cite: 2025-11-17] */}
          <Link href="/admin/scert">
            <button className="w-full rounded-full bg-[#6f9b77] py-4 text-sm font-black text-black border-[3px] border-[#1f3d2b] hover:bg-[#5f8b67] transition shadow-[4px_4px_0px_0px_#1f3d2b] active:translate-y-1">
              SCERT PORTAL
            </button>
          </Link>

        </div>
      </div>
    </main>
  );
}