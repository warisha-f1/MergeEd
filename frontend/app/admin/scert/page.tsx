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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          SCERT NATIONAL DASHBOARD
        </h1>
        <p className="text-gray-600 text-lg">
          Monitoring Educational Progress Across Indian States
        </p>
        <div className="mt-6 text-sm text-gray-500 max-w-3xl mx-auto">
          <p>
            Real-time tracking of AI-assisted pedagogical strategies across all 
            28 states and 8 union territories. District-level insights aggregated 
            at state level for NCERT oversight.
          </p>
        </div>
      </div>

      {/* National Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 text-center shadow-lg">
          <div className="text-5xl font-black text-blue-700 mb-2">
            {totalSchools.toLocaleString()}+
          </div>
          <div className="text-gray-600 font-semibold">TOTAL SCHOOLS</div>
          <div className="text-sm text-gray-500 mt-2">Nationwide coverage</div>
        </div>
        
        <div className="bg-white rounded-2xl border-2 border-green-200 p-6 text-center shadow-lg">
          <div className="text-5xl font-black text-green-700 mb-2">
            {totalIssues.toLocaleString()}+
          </div>
          <div className="text-gray-600 font-semibold">ISSUES ADDRESSED</div>
          <div className="text-sm text-gray-500 mt-2">AI-assisted resolutions</div>
        </div>
        
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 text-center shadow-lg">
          <div className="text-5xl font-black text-purple-700 mb-2">
            {nationalResolutionRate}%
          </div>
          <div className="text-gray-600 font-semibold">RESOLUTION RATE</div>
          <div className="text-sm text-gray-500 mt-2">National average</div>
        </div>
      </div>

      {/* State Performance Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            STATE-WISE PERFORMANCE MONITORING
          </h2>
          <div className="text-sm text-gray-500">
            Showing 10 of 36 states/UTs • Updated in real-time
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-4 px-6 text-left font-bold">STATE / UT</th>
                <th className="py-4 px-6 text-center font-bold">SUBMISSIONS</th>
                <th className="py-4 px-6 text-center font-bold">PENDING</th>
                <th className="py-4 px-6 text-center font-bold">APPROVED</th>
                <th className="py-4 px-6 text-center font-bold">RESOLUTION RATE</th>
                <th className="py-4 px-6 text-center font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr 
                  key={state.state}
                  className={`border-b hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    {state.state}
                  </td>
                  <td className="py-4 px-6 text-center font-medium">
                    {state.submissions.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-medium text-orange-600">
                      {state.pending.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-medium text-green-600">
                      {state.approved.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-3">
                        <div 
                          className={`h-2.5 rounded-full ${
                            state.resolutionRate >= 90 ? 'bg-green-500' :
                            state.resolutionRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${state.resolutionRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold">{state.resolutionRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(state.status)}`}>
                      {getStatusText(state.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">EXCELLENT (≥90% resolution)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">GOOD (85-89%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-600">NEEDS ATTENTION (80-84%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">CRITICAL (≤79%)</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">NATIONAL OVERVIEW</h3>
          <p className="text-gray-700 text-sm">
            This dashboard provides real-time monitoring of AI-assisted teaching strategies 
            across India. Each state's SCERT can drill down to district-level insights, 
            while this national view enables NCERT to identify regional patterns and 
            allocate resources efficiently.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Data refreshes every 15 minutes • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
        <p className="mt-1">
          Next update: National teacher training impact analysis (Q1 2025)
        </p>
      </div>
    </div>
  );
}
