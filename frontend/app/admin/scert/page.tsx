"use client";

import { useState } from "react";

interface StateData {
  state: string;
  submissions: number;
  pending: number;
  approved: number;
  resolutionRate: number;
  status: "EXCELLENT" | "GOOD" | "NEEDS_ATTENTION" | "CRITICAL";
}

export default function AdminPage() {
  const [states] = useState<StateData[]>([
    { state: "Maharashtra", submissions: 1550, pending: 145, approved: 1405, resolutionRate: 91, status: "EXCELLENT" },
    { state: "Karnataka", submissions: 1240, pending: 210, approved: 1030, resolutionRate: 83, status: "GOOD" },
    { state: "Tamil Nadu", submissions: 980, pending: 89, approved: 891, resolutionRate: 91, status: "EXCELLENT" },
    { state: "Uttar Pradesh", submissions: 2120, pending: 320, approved: 1800, resolutionRate: 85, status: "GOOD" },
    { state: "West Bengal", submissions: 890, pending: 112, approved: 778, resolutionRate: 87, status: "GOOD" },
  ]);

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Monitoring Educational Progress Across Indian States
        </h1>
        <p className="text-gray-600">
          Real-time tracking of AI-assisted pedagogical strategies across all 28 states and 8 union territories.
          District-level insights aggregated at state level for NCERT oversight.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">1,520,000+</div>
          <div className="text-gray-700 font-medium mt-1">TOTAL SCHOOLS</div>
          <div className="text-sm text-gray-500">Nationwide coverage</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">10,500+</div>
          <div className="text-gray-700 font-medium mt-1">ISSUES ADDRESSED</div>
          <div className="text-sm text-gray-500">AI-assisted resolutions</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">89%</div>
          <div className="text-gray-700 font-medium mt-1">RESOLUTION RATE</div>
          <div className="text-sm text-gray-500">National average</div>
        </div>
      </div>

      {/* State Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">STATE-WISE PERFORMANCE MONITORING</h2>
          <p className="text-gray-600 mt-1">Showing 10 of 36 states/UTs</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATE / UT</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SUBMISSIONS</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">PENDING</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">APPROVED</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">RESOLUTION RATE</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {states.map((state, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{state.state}</td>
                  <td className="px-6 py-4">{state.submissions.toLocaleString()}</td>
                  <td className="px-6 py-4">{state.pending.toLocaleString()}</td>
                  <td className="px-6 py-4">{state.approved.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-medium w-10">{state.resolutionRate}%</span>
                      <div className="ml-2 w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            state.resolutionRate >= 90 ? 'bg-green-500' :
                            state.resolutionRate >= 80 ? 'bg-blue-500' :
                            state.resolutionRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${state.resolutionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      state.status === "EXCELLENT" ? "bg-green-100 text-green-800" :
                      state.status === "GOOD" ? "bg-blue-100 text-blue-800" :
                      state.status === "NEEDS_ATTENTION" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {state.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
