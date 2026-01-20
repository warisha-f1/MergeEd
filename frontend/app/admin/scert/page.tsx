"use client";
import { useState } from "react";

export default function ScertDashboard() {
  const [districts] = useState([
    { name: "Pune", total: 145, pending: 12, approved: 133 },
    { name: "Mumbai", total: 210, pending: 45, approved: 165 },
    { name: "Nashik", total: 89, pending: 5, approved: 84 },
    { name: "Nagpur", total: 112, pending: 20, approved: 92 },
  ]);

  const stats = [
    { label: "Total Schools", value: "556", color: "bg-[#bfe6cc]" },
    { label: "State Issues", value: "1,240", color: "bg-[#F6F3C2]" },
    { label: "Resolution Rate", value: "88%", color: "bg-[#6f9b77]" },
  ];

  return (
    <main className="min-h-screen bg-[#90AB8B] p-4 md:p-8 text-black">
      {/* --- HEADER --- */}
      <div className="mb-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-6 shadow-[4px_4px_0px_0px_#1f3d2b]">
        <h1 className="text-2xl font-black uppercase">SCERT State Command Center</h1>
        <p className="font-bold text-sm">Monitoring Educational Progress Across Maharashtra</p>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} border-[4px] border-[#1f3d2b] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#1f3d2b]`}>
            <p className="text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- DISTRICT MONITORING TABLE --- */}
      <div className="rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b]">
        <div className="p-4 bg-[#1f3d2b] text-white font-black text-center tracking-widest uppercase">
          District-Wise Performance (DIET Audit)
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#cfeedd] border-b-[4px] border-[#1f3d2b]">
            <tr>
              <th className="p-4 text-left font-black">DISTRICT</th>
              <th className="p-4 text-center font-black">SUBMISSIONS</th>
              <th className="p-4 text-center font-black">PENDING</th>
              <th className="p-4 text-center font-black">APPROVED</th>
              <th className="p-4 text-center font-black">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d, i) => (
              <tr key={i} className="border-t border-[#1f3d2b]/30">
                <td className="p-4 font-black uppercase">{d.name}</td>
                <td className="p-4 text-center font-bold">{d.total}</td>
                <td className="p-4 text-center font-bold text-red-700">{d.pending}</td>
                <td className="p-4 text-center font-bold text-green-800">{d.approved}</td>
                <td className="p-4 text-center">
                  <div className="w-full bg-white rounded-full h-3 border border-black overflow-hidden">
                    <div 
                      className="bg-[#6f9b77] h-full border-r border-black" 
                      style={{ width: `${(d.approved / d.total) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- STATE-WIDE CHALLENGE SUMMARY --- */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#f6f3c2] border-[4px] border-[#1f3d2b] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#1f3d2b]">
          <h2 className="font-black mb-4 uppercase">Top State Challenges</h2>
          <ul className="space-y-3">
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Learning Gaps</span>
              <span className="text-red-600">42%</span>
            </li>
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Student Absenteeism</span>
              <span className="text-orange-600">30%</span>
            </li>
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Infrastructure Needs</span>
              <span className="text-blue-600">28%</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}