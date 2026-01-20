"use client";

import { useState, Suspense, useEffect, useRef, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { apiService } from "@/MergeEd/frontend/services/api";

/* =========================
   TYPES
========================= */

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  id?: number;
}

interface Student {
  id: string;
  name: string;
  attendance: string;
  status: string;
}

/* =========================
   COMPONENT
========================= */

function RecordsContent() {
  const searchParams = useSearchParams();
  const problem = searchParams.get("problem") || "Learning Gaps";
  const lang = searchParams.get("lang") || "Marathi";

  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: `Hello! I see you're facing '${problem}' in your ${lang} class. How can I help?`,
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const students: Student[] = [
    { id: "S101", name: "Rahul Sharma", attendance: "90%", status: "Needs Help" },
    { id: "S102", name: "Anjali Patil", attendance: "95%", status: "Good" },
    { id: "S103", name: "Amit Vichare", attendance: "60%", status: "At Risk" },
  ];

  /* =========================
     INITIAL AI STRATEGY - FIXED
  ========================= */

  useEffect(() => {
    const generateInitialStrategy = async () => {
      try {
        setIsGenerating(true);
        const response = await apiService.generateTraining({
          language: lang,
          problem,
          infrastructure: "Medium",
        });

        // FIXED: Check if response has strategy
        if (response && response.strategy) {
          setChatHistory([
            { 
              role: "ai", 
              text: response.strategy, 
              id: Date.now() 
            },
          ]);
        } else {
          // Fallback if no strategy in response
          setChatHistory([
            { 
              role: "ai", 
              text: `Hello! I see you're facing '${problem}' in your ${lang} class. I'm ready to help with your classroom challenge. Please describe your specific issue.`, 
              id: Date.now() 
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load initial AI strategy:", error);
        // Fallback message
        setChatHistory([
          { 
            role: "ai", 
            text: `Hello! I see you're facing '${problem}' in your ${lang} class. How can I help? (Offline Mode)`, 
            id: Date.now() 
          },
        ]);
      } finally {
        setIsGenerating(false);
      }
    };

    generateInitialStrategy();
  }, [problem, lang]);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  /* =========================
     SEND MESSAGE - FIXED
  ========================= */

  const handleSendMessage = async () => {
    if (!query.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: query,
      id: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setQuery("");
    setIsGenerating(true);

    try {
      const response = await apiService.generateTraining({
        language: lang,
        problem,
        infrastructure: "Medium",
      });

      // FIXED: Check if response has strategy
      if (response && response.strategy) {
        const aiMsg: ChatMessage = {
          role: "ai",
          text: response.strategy,
          id: Date.now() + 1,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          role: "ai",
          text: "I couldn't generate a strategy. Please try rephrasing your question.",
          id: Date.now() + 1,
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        role: "ai",
        text: ` Error: ${error.message || "Failed to generate response. Please check your connection."}`,
        id: Date.now() + 1,
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* =========================
     MESSAGE RENDER
  ========================= */

  const renderMessage = (text: string, isAI: boolean) => (
    <div
      className={`p-4 rounded-2xl text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-[90%] text-black ${
        isAI ? "bg-[#bfe6cc] self-start" : "bg-[#6f9b77] self-end"
      }`}
    >
      {text.split("\n").map((line, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {line}
        </p>
      ))}
    </div>
  );

  /* =========================
     UI
  ========================= */

  return (
    <main className="min-h-screen bg-[#90AB8B] p-4 md:p-8 flex flex-col lg:flex-row gap-6 text-black font-medium">
      {/* STUDENT RECORDS */}
      <div className="flex-1">
        <div className="mb-6 rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] p-5 shadow-[4px_4px_0px_0px_#1f3d2b]">
          <h1 className="text-xl font-black uppercase">Student Records</h1>
          <p className="text-sm font-bold">
            Problem: {problem} | Language: {lang}
          </p>
          {isGenerating && (
            <p className="text-xs text-yellow-600 mt-1">
              ⏳ AI is generating initial strategy...
            </p>
          )}
        </div>

        <div className="rounded-2xl border-[4px] border-[#1f3d2b] bg-[#bfe6cc] overflow-x-auto shadow-[4px_4px_0px_0px_#1f3d2b]">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-[#cfeedd] border-b-[4px] border-[#1f3d2b]">
              <tr>
                <th className="p-4 text-left font-black">ID</th>
                <th className="p-4 text-left font-black">STUDENT NAME</th>
                <th className="p-4 text-left font-black">ATTENDANCE</th>
                <th className="p-4 text-left font-black">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-[#1f3d2b]/30">
                  <td className="p-4 font-bold">{s.id}</td>
                  <td className="p-4 font-black uppercase">{s.name}</td>
                  <td className="p-4 font-bold">{s.attendance}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black border-2 border-black ${
                        s.status === "Needs Help"
                          ? "bg-yellow-300"
                          : s.status === "At Risk"
                          ? "bg-red-300"
                          : "bg-green-400"
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI CHAT */}
      <div className="w-full lg:w-96 flex flex-col h-[600px] rounded-2xl border-[4px] border-[#1f3d2b] bg-[#F6F3C2] overflow-hidden shadow-[8px_8px_0px_0px_#1f3d2b]">
        <div className="bg-[#1f3d2b] p-4 text-white font-black text-center">
          AI ASSISTANT
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
        >
          {chatHistory.map((chat, i) => (
            <div
              key={chat.id || i}
              className={chat.role === "ai" ? "self-start" : "self-end"}
            >
              {renderMessage(chat.text, chat.role === "ai")}
            </div>
          ))}
          {isGenerating && (
            <div className="self-start">
              <div className="p-4 rounded-2xl text-sm font-bold border-2 border-black bg-[#bfe6cc]">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse">●</div>
                </div>
                <p className="text-xs mt-1">AI is thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t-[4px] border-[#1f3d2b] flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for teaching strategies..."
            className="flex-1 text-sm font-bold outline-none p-2 border border-gray-300 rounded"
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={isGenerating || !query.trim()}
            className="bg-[#1f3d2b] text-white px-4 py-2 rounded-lg font-black text-xs disabled:opacity-50 hover:bg-[#2a4a3c] transition-colors"
          >
            {isGenerating ? "SENDING..." : "SEND"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================
   EXPORT
========================= */

export default function TeacherRecordsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#90AB8B] flex items-center justify-center">
          <div className="text-black font-bold text-xl animate-pulse">
            Loading AI Assistant...
          </div>
        </div>
      }
    >
      <RecordsContent />
    </Suspense>
  );
}