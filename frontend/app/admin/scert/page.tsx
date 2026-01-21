// app/admin/page.tsx
"use client";

export default function AdminPage() {
  const districts = [
    { name: "PUNE", submissions: 145, pending: 12, approved: 133, status: "✔️" },
    { name: "MUMBAI", submissions: 210, pending: 45, approved: 165, status: "✔️" },
    { name: "NASHIK", submissions: 89, pending: 5, approved: 84, status: "✔️" },
    { name: "NAGPUR", submissions: 112, pending: 20, approved: 92, status: "✔️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">SCERT STATE COMMAND CENTER</h1>
        <p className="text-gray-600 mt-2">Monitoring Educational Progress Across Maharashtra</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="text-2xl font-bold text-blue-600">556</div>
          <div className="text-gray-700 font-medium mt-1">TOTAL SCHOOLS</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="text-2xl font-bold text-green-600">1,240</div>
          <div className="text-gray-700 font-medium mt-1">STATE ISSUES</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="text-2xl font-bold text-purple-600">88%</div>
          <div className="text-gray-700 font-medium mt-1">RESOLUTION RATE</div>
        </div>
      </div>

      {/* District Table */}
      <div className="bg-white rounded-xl shadow border">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">DISTRICT-WISE PERFORMANCE (DIET AUDIT)</h2>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">DISTRICT</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SUBMISSIONS</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">PENDING</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">APPROVED</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {districts.map((district, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{district.name}</td>
                  <td className="px-6 py-4">{district.submissions.toLocaleString()}</td>
                  <td className="px-6 py-4">{district.pending.toLocaleString()}</td>
                  <td className="px-6 py-4">{district.approved.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 text-xl">{district.status}</span>
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
