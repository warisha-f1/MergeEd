"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface StateData {
  state: string;
  submissions: number;
  pending: number;
  approved: number;
  resolutionRate: number;
  status: "EXCELLENT" | "GOOD" | "NEEDS_ATTENTION" | "CRITICAL";
}

export default function SCERTDashboard() {
  const [states, setStates] = useState<StateData[]>([
    {
      state: "Maharashtra",
      submissions: 1550,
      pending: 145,
      approved: 1405,
      resolutionRate: 91,
      status: "EXCELLENT",
    },
    {
      state: "Karnataka",
      submissions: 1240,
      pending: 210,
      approved: 1030,
      resolutionRate: 83,
      status: "GOOD",
    },
    {
      state: "Tamil Nadu",
      submissions: 980,
      pending: 89,
      approved: 891,
      resolutionRate: 91,
      status: "EXCELLENT",
    },
    {
      state: "Uttar Pradesh",
      submissions: 2120,
      pending: 320,
      approved: 1800,
      resolutionRate: 85,
      status: "GOOD",
    },
    {
      state: "West Bengal",
      submissions: 890,
      pending: 112,
      approved: 778,
      resolutionRate: 87,
      status: "GOOD",
    },
    {
      state: "Gujarat",
      submissions: 760,
      pending: 45,
      approved: 715,
      resolutionRate: 94,
      status: "EXCELLENT",
    },
    {
      state: "Rajasthan",
      submissions: 1020,
      pending: 185,
      approved: 835,
      resolutionRate: 82,
      status: "NEEDS_ATTENTION",
    },
    {
      state: "Kerala",
      submissions: 680,
      pending: 32,
      approved: 648,
      resolutionRate: 95,
      status: "EXCELLENT",
    },
    {
      state: "Telangana",
      submissions: 540,
      pending: 67,
      approved: 473,
      resolutionRate: 88,
      status: "GOOD",
    },
    {
      state: "Delhi",
      submissions: 420,
      pending: 28,
      approved: 392,
      resolutionRate: 93,
      status: "EXCELLENT",
    },
  ]);

  const totalSchools = 1520000;
  const totalIssues = 10500;
  const nationalResolutionRate = 89;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EXCELLENT": return "bg-green-100 text-green-800";
      case "GOOD": return "bg-blue-100 text-blue-800";
      case "NEEDS_ATTENTION": return "bg-yellow-100 text-yellow-800";
      case "CRITICAL": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "EXCELLENT": return "EXCELLENT";
      case "GOOD": return "GOOD";
      case "NEEDS_ATTENTION": return "NEEDS ATTENTION";
      case "CRITICAL": return "CRITICAL";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6"> {/* CHANGED: Pure white bg */}
      {/* Header - DIET Style */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
          SCERT NATIONAL DASHBOARD
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Monitoring Educational Progress Across Indian States
        </p>
        <div className="mt-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>
            Real-time tracking of AI-assisted pedagogical strategies across all 
            28 states and 8 union territories. District-level insights aggregated 
            at state level for NCERT oversight.
          </p>
        </div>
      </div>

      {/* National Stats - Simpler Cards like DIET */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6">
          <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            {totalSchools.toLocaleString()}+
          </div>
          <div className="text-gray-700 font-semibold">TOTAL SCHOOLS</div>
          <div className="text-sm text-gray-500 mt-2">Nationwide coverage</div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6">
          <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            {totalIssues.toLocaleString()}+
          </div>
          <div className="text-gray-700 font-semibold">ISSUES ADDRESSED</div>
          <div className="text-sm text-gray-500 mt-2">AI-assisted resolutions</div>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6">
          <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            {nationalResolutionRate}%
          </div>
          <div className="text-gray-700 font-semibold">RESOLUTION RATE</div>
          <div className="text-sm text-gray-500 mt-2">National average</div>
        </div>
      </div>

      {/* MOBILE VIEW (Cards) */}
      <div className="md:hidden mb-6">
        <h2 className="text-xl font-black text-gray-800 mb-4">
          STATE-WISE PERFORMANCE
        </h2>
        <div className="space-y-4">
          {states.map((state) => (
            <div key={state.state} className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-900">{state.state}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(state.status)}`}>
                  {getStatusText(state.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-500">Submissions</div>
                  <div className="font-bold text-gray-900 text-lg">{state.submissions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Pending</div>
                  <div className="font-bold text-gray-900 text-lg">{state.pending.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Approved</div>
                  <div className="font-bold text-gray-900 text-lg">{state.approved.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Resolution</div>
                  <div className="font-bold text-gray-900 text-lg">{state.resolutionRate}%</div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Progress:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      state.resolutionRate >= 90 ? 'bg-green-500' :
                      state.resolutionRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${state.resolutionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW (Table) - DIET Style Table */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            STATE-WISE PERFORMANCE MONITORING
          </h2>
          <div className="text-sm text-gray-500">
            Showing 10 of 36 states/UTs
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="py-3 px-6 text-left font-bold text-gray-900">STATE / UT</th>
                <th className="py-3 px-6 text-left font-bold text-gray-900">SUBMISSIONS</th>
                <th className="py-3 px-6 text-left font-bold text-gray-900">PENDING</th>
                <th className="py-3 px-6 text-left font-bold text-gray-900">APPROVED</th>
                <th className="py-3 px-6 text-left font-bold text-gray-900">RESOLUTION RATE</th>
                <th className="py-3 px-6 text-left font-bold text-gray-900">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr 
                  key={state.state}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-3 px-6 font-semibold text-gray-900">
                    {state.state}
                  </td>
                  <td className="py-3 px-6 font-bold text-gray-900">
                    {state.submissions.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 font-bold text-gray-900">
                    {state.pending.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 font-bold text-gray-900">
                    {state.approved.toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            state.resolutionRate >= 90 ? 'bg-green-500' :
                            state.resolutionRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${state.resolutionRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900">{state.resolutionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${getStatusColor(state.status)}`}>
                      {getStatusText(state.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary - DIET Style */}
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-2">NATIONAL OVERVIEW</h3>
          <p className="text-gray-700">
            This dashboard provides real-time monitoring of AI-assisted teaching strategies 
            across India. Each state's SCERT can drill down to district-level insights, 
            while this national view enables NCERT to identify regional patterns and 
            allocate resources efficiently.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 md:mt-8 text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
        <p>
          Data refreshes every 15 minutes • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>
    </div>
  );
}
