// app/diet/page.tsx
"use client";

import { useState } from "react";

export default function DietPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">DIET DASHBOARD</h1>
        <p className="text-gray-600 mt-2">Reviewing AI-Generated Pedagogical Strategies</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-700 font-medium">Approved</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-gray-700 font-medium">Pending</div>
            </div>
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-gray-700 font-medium">Rejected</div>
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PENDING SUBMISSIONS (1)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">TEACHER ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">LANGUAGE</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ISSUE</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">TCH_RKAWN44</td>
                    <td className="px-4 py-4">English</td>
                    <td className="px-4 py-4">learning</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        PENDING
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">
                          VIEW
                        </button>
                        <button 
                          onClick={() => setSelectedSubmission("TCH_RKAWN44")}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          REVIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Approved */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">RECENTLY APPROVED</h2>
            <p className="text-gray-500 italic">No approved submissions yet.</p>
          </div>
        </div>

        {/* Right Column - Review Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">REVIEW PANEL</h2>
            {selectedSubmission ? (
              <div className="space-y-4">
                <p className="text-gray-700">Reviewing submission: <strong>{selectedSubmission}</strong></p>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-green-100 text-green-800 rounded-lg font-medium">
                    Approve
                  </button>
                  <button className="w-full p-3 bg-red-100 text-red-800 rounded-lg font-medium">
                    Reject
                  </button>
                  <button className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg font-medium">
                    Request Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Select a submission to review</p>
                <p className="text-sm text-gray-500">
                  Click "REVIEW" on any pending submission to start evaluation
                </p>
              </div>
            )}
          </div>

          {/* DIET Officer Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">DIET Officer</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">ID:</p>
                <p className="font-bold text-gray-800">DIET_OFFICER_001</p>
              </div>
              <p className="text-gray-600">
                Review AI-generated strategies and provide feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
