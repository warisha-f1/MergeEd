"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface Submission {
  id: number;
  teacher_id: string;
  problem: string;
  language: string;
  infrastructure: string;
  status: string;
  raw_message?: string;
  strategy?: string;
  created_at: string;
  diet_officer?: string;
  feedback?: string;
}

export default function DietDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [officerId] = useState("DIET_OFFICER_001"); // In real app, get from auth

  // Fetch submissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getPendingSubmissions();
        setSubmissions(data);
      } catch (err: any) {
        console.error("Failed to load submissions:", err);
        setError(err.message || "Failed to load submissions");
        setSubmissions([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const approve = async (id: number) => {
    try {
      await apiService.approveRecord(id, officerId, feedback);
      setSubmissions((prev) =>
        prev.map((item) => 
          item.id === id ? { ...item, status: "Approved" } : item
        )
      );
      setSelectedSubmission(null);
      setFeedback("");
      alert("Submission approved successfully!");
    } catch (err: any) {
      console.error("Approval failed:", err);
      alert(`Approval failed: ${err.message || "Unknown error"}`);
    }
  };

  const reject = async (id: number) => {
    try {
      await apiService.rejectRecord(id, officerId, feedback);
      setSubmissions((prev) =>
        prev.map((item) => 
          item.id === id ? { ...item, status: "Rejected" } : item
        )
      );
      setSelectedSubmission(null);
      setFeedback("");
      alert("Submission rejected!");
    } catch (err: any) {
      console.error("Rejection failed:", err);
      alert(`Rejection failed: ${err.message || "Unknown error"}`);
    }
  };

  const viewDetails = async (id: number) => {
    try {
      const detail = await apiService.getSubmissionDetail(id);
      setSelectedSubmission(detail);
    } catch (err: any) {
      console.error("Failed to load details:", err);
      alert(`Failed to load details: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#90AB8B] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-[#1f3d2b]"></div>
          <p className="mt-4 font-bold">Loading submissions...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#90AB8B] p-8">
        <div className="mb-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-5 shadow-[4px_4px_0px_0px_#1f3d2b]">
          <h1 className="text-2xl font-black uppercase">DIET Dashboard</h1>
          <p className="text-sm font-bold">Reviewing AI-Generated Pedagogical Strategies</p>
        </div>
        <div className="bg-red-100 border-2 border-red-400 text-red-800 p-4 rounded-xl">
          <p className="font-bold">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#90AB8B] p-4 md:p-8 text-black font-medium">
      {/* Header */}
      <div className="mb-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-5 shadow-[4px_4px_0px_0px_#1f3d2b]">
        <h1 className="text-2xl font-black uppercase">DIET Dashboard</h1>
        <p className="text-sm font-bold">Reviewing AI-Generated Pedagogical Strategies</p>
        <div className="mt-2 flex gap-4 text-xs">
          <span className="bg-green-400 px-3 py-1 rounded-full border-2 border-black">
            Approved: {submissions.filter(s => s.status === "Approved").length}
          </span>
          <span className="bg-yellow-300 px-3 py-1 rounded-full border-2 border-black">
            Pending: {submissions.filter(s => s.status === "Pending").length}
          </span>
          <span className="bg-red-400 px-3 py-1 rounded-full border-2 border-black">
            Rejected: {submissions.filter(s => s.status === "Rejected").length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b]">
            <div className="p-4 bg-[#1f3d2b] text-white font-black text-center tracking-widest uppercase">
              Pending Submissions ({submissions.filter(s => s.status === "Pending").length})
            </div>
            
            {submissions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-bold text-lg">No pending submissions</p>
                <p className="text-gray-600 mt-2">All submissions have been reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#cfeedd] font-black border-b-[4px] border-[#1f3d2b]">
                    <tr>
                      <th className="p-4 text-left">TEACHER ID</th>
                      <th className="p-4 text-left">LANGUAGE</th>
                      <th className="p-4 text-left">ISSUE</th>
                      <th className="p-4 text-left">STATUS</th>
                      <th className="p-4 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions
                      .filter(item => item.status === "Pending")
                      .map((item) => (
                      <tr key={item.id} className="border-t border-[#1f3d2b]/20 hover:bg-[#cfeedd]/50">
                        <td className="p-4 font-black uppercase">{item.teacher_id}</td>
                        <td className="p-4 font-bold">{item.language}</td>
                        <td className="p-4">
                          <div className="max-w-[200px] truncate" title={item.problem}>
                            {item.problem}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black border-2 border-black ${
                            item.status === 'Approved' ? 'bg-green-400' : 
                            item.status === 'Rejected' ? 'bg-red-400' : 'bg-yellow-300'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button 
                            onClick={() => viewDetails(item.id)}
                            className="rounded-full bg-blue-500 px-4 py-2 font-black text-xs border-2 border-black hover:bg-blue-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_#000]"
                          >
                            VIEW
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedSubmission(item);
                              setFeedback("");
                            }}
                            className="rounded-full bg-[#6f9b77] px-4 py-2 font-black text-xs border-2 border-black hover:bg-green-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_#000]"
                          >
                            REVIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recently Approved */}
          <div className="mt-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b]">
            <div className="p-4 bg-[#1f3d2b] text-white font-black text-center tracking-widest uppercase">
              Recently Approved
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {submissions
                  .filter(item => item.status === "Approved")
                  .slice(0, 5)
                  .map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-[#1f3d2b]">
                    <div>
                      <span className="font-black">{item.teacher_id}</span>
                      <span className="mx-2">•</span>
                      <span className="font-bold">{item.language}</span>
                      <span className="mx-2">•</span>
                      <span>{item.problem}</span>
                    </div>
                    <span className="bg-green-400 px-3 py-1 rounded-full text-xs font-black border-2 border-black">
                      APPROVED
                    </span>
                  </div>
                ))}
                {submissions.filter(item => item.status === "Approved").length === 0 && (
                  <p className="text-center text-gray-600 py-4">No approved submissions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Panel */}
        <div>
          <div className="rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b] sticky top-6">
            <div className="p-4 bg-[#1f3d2b] text-white font-black text-center tracking-widest uppercase">
              Review Panel
            </div>
            
            {selectedSubmission ? (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-black text-lg mb-2">Teacher Submission</h3>
                  <div className="bg-white p-4 rounded-xl border-2 border-[#1f3d2b]">
                    <p className="font-bold mb-1">ID: {selectedSubmission.teacher_id}</p>
                    <p className="mb-1">
                      <span className="font-bold">Issue:</span> {selectedSubmission.problem}
                    </p>
                    <p className="mb-1">
                      <span className="font-bold">Language:</span> {selectedSubmission.language}
                    </p>
                    <p className="mb-1">
                      <span className="font-bold">Infrastructure:</span> {selectedSubmission.infrastructure}
                    </p>
                    <p className="mt-3 text-sm">
                      <span className="font-bold">Query:</span> {selectedSubmission.raw_message}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-black text-lg mb-2">AI Strategy</h3>
                  <div className="bg-white p-4 rounded-xl border-2 border-[#1f3d2b] max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{selectedSubmission.strategy}</pre>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-2">Your Feedback (Optional)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add comments or suggestions..."
                    className="w-full p-3 border-2 border-[#1f3d2b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9b77] min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approve(selectedSubmission.id)}
                    className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl border-2 border-black hover:bg-green-700 transition-all shadow-[4px_4px_0px_0px_#1f3d2b]"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => reject(selectedSubmission.id)}
                    className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl border-2 border-black hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_#1f3d2b]"
                  >
                    REJECT
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setFeedback("");
                  }}
                  className="w-full mt-4 bg-gray-400 text-white font-black py-3 rounded-xl border-2 border-black hover:bg-gray-500 transition-all"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📋</div>
                <p className="font-bold">Select a submission to review</p>
                <p className="text-sm text-gray-600 mt-2">
                  Click "REVIEW" on any pending submission to start evaluation
                </p>
              </div>
            )}
          </div>

          {/* Officer Info */}
          <div className="mt-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-6 shadow-[4px_4px_0px_0px_#1f3d2b]">
            <h3 className="font-black mb-3">DIET Officer</h3>
            <div className="bg-white p-4 rounded-xl border-2 border-[#1f3d2b]">
              <p className="font-bold">ID: {officerId}</p>
              <p className="text-sm mt-2">
                Review AI-generated strategies and provide approval with feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
