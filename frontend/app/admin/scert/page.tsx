"use client";
import { useState } from "react";

export default function ScertDashboard() {
  const [states] = useState([
    { name: "Andhra Pradesh", total: 145, pending: 12, approved: 133 },
    { name: "Arunachal Pradesh", total: 89, pending: 5, approved: 84 },
    { name: "Assam", total: 112, pending: 20, approved: 92 },
    { name: "Bihar", total: 210, pending: 45, approved: 165 },
    { name: "Chhattisgarh", total: 95, pending: 10, approved: 85 },
    { name: "Goa", total: 45, pending: 2, approved: 43 },
    { name: "Gujarat", total: 180, pending: 15, approved: 165 },
    { name: "Haryana", total: 130, pending: 18, approved: 112 },
    { name: "Himachal Pradesh", total: 75, pending: 4, approved: 71 },
    { name: "Jharkhand", total: 105, pending: 22, approved: 83 },
    { name: "Karnataka", total: 195, pending: 30, approved: 165 },
    { name: "Kerala", total: 155, pending: 8, approved: 147 },
    { name: "Madhya Pradesh", total: 220, pending: 40, approved: 180 },
    { name: "Maharashtra", total: 250, pending: 35, approved: 215 },
    { name: "Manipur", total: 65, pending: 12, approved: 53 },
    { name: "Meghalaya", total: 70, pending: 9, approved: 61 },
    { name: "Mizoram", total: 55, pending: 3, approved: 52 },
    { name: "Nagaland", total: 60, pending: 7, approved: 53 },
    { name: "Odisha", total: 140, pending: 18, approved: 122 },
    { name: "Punjab", total: 125, pending: 10, approved: 115 },
    { name: "Rajasthan", total: 230, pending: 42, approved: 188 },
    { name: "Sikkim", total: 40, pending: 1, approved: 39 },
    { name: "Tamil Nadu", total: 215, pending: 25, approved: 190 },
    { name: "Telangana", total: 150, pending: 20, approved: 130 },
    { name: "Tripura", total: 62, pending: 6, approved: 56 },
    { name: "Uttar Pradesh", total: 310, pending: 65, approved: 245 },
    { name: "Uttarakhand", total: 82, pending: 8, approved: 74 },
    { name: "West Bengal", total: 205, pending: 38, approved: 167 },
    { name: "A&N Islands (UT)", total: 35, pending: 2, approved: 33 },
    { name: "Chandigarh (UT)", total: 42, pending: 3, approved: 39 },
    { name: "D&N Haveli & Daman & Diu (UT)", total: 48, pending: 5, approved: 43 },
    { name: "Delhi (NCT)", total: 190, pending: 25, approved: 165 },
    { name: "Jammu & Kashmir (UT)", total: 115, pending: 15, approved: 100 },
    { name: "Ladakh (UT)", total: 30, pending: 4, approved: 26 },
    { name: "Lakshadweep (UT)", total: 25, pending: 1, approved: 24 },
    { name: "Puducherry (UT)", total: 52, pending: 4, approved: 48 },
  ]);

  const stats = [
    { label: "Total Schools", value: "1.5M+", color: "bg-[#bfe6cc]" },
    { label: "National Issues", value: "14,240", color: "bg-[#F6F3C2]" },
    { label: "Resolution Rate", value: "91%", color: "bg-[#6f9b77]" },
  ];

  return (
    <main className="min-h-screen bg-[#90AB8B] p-4 md:p-8 text-black font-sans">
      {/* --- HEADER --- */}
      <div className="mb-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-6 shadow-[4px_4px_0px_0px_#1f3d2b]">
        <h1 className="text-2xl font-black uppercase">SCERT National Command Center</h1>
        <p className="font-bold text-sm">Monitoring Educational Progress Across India</p>
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

      {/* --- STATE MONITORING TABLE --- */}
      <div className="rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b]">
        <div className="p-4 bg-[#1f3d2b] text-white font-black text-center tracking-widest uppercase">
          State-Wise Performance (Audit)
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-sm">
            <thead className="bg-[#cfeedd] border-b-[4px] border-[#1f3d2b] sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-black">STATE / UT</th>
                <th className="p-4 text-center font-black">SUBMISSIONS</th>
                <th className="p-4 text-center font-black">PENDING</th>
                <th className="p-4 text-center font-black">APPROVED</th>
                <th className="p-4 text-center font-black">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s, i) => (
                <tr key={i} className="border-t border-[#1f3d2b]/30 bg-[#bfe6cc] hover:bg-[#a8d9b9] transition-colors">
                  <td className="p-4 font-black uppercase">{s.name}</td>
                  <td className="p-4 text-center font-bold">{s.total}</td>
                  <td className="p-4 text-center font-bold text-red-700">{s.pending}</td>
                  <td className="p-4 text-center font-bold text-green-800">{s.approved}</td>
                  <td className="p-4 text-center min-w-[120px]">
                    <div className="w-full bg-white rounded-full h-3 border border-black overflow-hidden">
                      <div 
                        className="bg-[#6f9b77] h-full border-r border-black" 
                        style={{ width: `${(s.approved / s.total) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- NATIONAL CHALLENGE SUMMARY --- */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#f6f3c2] border-[4px] border-[#1f3d2b] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#1f3d2b]">
          <h2 className="font-black mb-4 uppercase">Top National Challenges</h2>
          <ul className="space-y-3">
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Digital Divide</span>
              <span className="text-red-600">45%</span>
            </li>
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Teacher Vacancy</span>
              <span className="text-orange-600">32%</span>
            </li>
            <li className="flex justify-between font-bold border-b border-black pb-1">
              <span>Foundational Literacy</span>
              <span className="text-blue-600">23%</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
