"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { apiService, type Submission } from "@/MergeEd/frontend/services/api";
import ConnectionStatus from "@/MergeEd/frontend/components/ConnectionStatus";

/* =========================
   TYPES
========================= */
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  language: string;
  link?: string;
  tags: string[];
}

/* =========================
   COMPONENT
========================= */
export default function TeacherPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      text:
        "Hello! I'm your AI Teaching Assistant.\n\n" +
        "Describe your classroom challenge and I'll help you.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const [teacherId, setTeacherId] = useState<string>("");

  const [activeTab, setActiveTab] =
    useState<"chat" | "history" | "resources">("chat");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const stored = localStorage.getItem("teacherId");
    if (stored) {
      setTeacherId(stored);
    } else {
      const id =
        "TCH_" + Math.random().toString(36).substring(2, 9).toUpperCase();
      localStorage.setItem("teacherId", id);
      setTeacherId(id);
    }
  }, []);

  /* =========================
     LOAD RESOURCES
  ========================= */
  useEffect(() => {
    if (activeTab !== "resources") return;
    
    // Sample resources data
    const sampleResources: Resource[] = [
      {
        id: 1,
        title: "Interactive Lesson Plan Template",
        description: "Editable template for creating engaging lesson plans with timing, activities, and assessment.",
        category: "lesson-plans",
        language: "All",
        link: "#",
        tags: ["template", "planning", "editable"]
      },
      {
        id: 2,
        title: "Hindi Grammar Worksheets",
        description: "Printable worksheets for Hindi grammar topics - karak, kaal, ling, vachan.",
        category: "worksheets",
        language: "Hindi",
        link: "#",
        tags: ["grammar", "printable", "exercises"]
      },
      {
        id: 3,
        title: "English Vocabulary Games",
        description: "10 classroom games to build English vocabulary - suitable for all ages.",
        category: "activities",
        language: "English",
        link: "#",
        tags: ["games", "vocabulary", "interactive"]
      },
      {
        id: 4,
        title: "Math Teaching Strategies",
        description: "Visual methods for teaching difficult math concepts to diverse learners.",
        category: "strategies",
        language: "All",
        link: "#",
        tags: ["math", "visual", "differentiation"]
      },
      {
        id: 5,
        title: "Classroom Management Guide",
        description: "Proven techniques for maintaining positive classroom environment.",
        category: "management",
        language: "All",
        link: "#",
        tags: ["discipline", "engagement", "routines"]
      },
      {
        id: 6,
        title: "Marathi Storytelling Cards",
        description: "Printable story cards with Marathi folk tales for language development.",
        category: "worksheets",
        language: "Marathi",
        link: "#",
        tags: ["stories", "printable", "cultural"]
      },
      {
        id: 7,
        title: "Assessment Rubrics",
        description: "Ready-to-use rubrics for evaluating student projects and presentations.",
        category: "assessment",
        language: "All",
        link: "#",
        tags: ["evaluation", "grading", "feedback"]
      },
      {
        id: 8,
        title: "Science Experiment Videos",
        description: "Low-cost science experiments using everyday materials.",
        category: "videos",
        language: "English",
        link: "#",
        tags: ["science", "experiments", "videos"]
      },
      {
        id: 9,
        title: "Parent Communication Templates",
        description: "Email and SMS templates for effective parent-teacher communication.",
        category: "communication",
        language: "All",
        link: "#",
        tags: ["parents", "communication", "templates"]
      },
      {
        id: 10,
        title: "Digital Teaching Tools Guide",
        description: "Free digital tools for online and blended learning environments.",
        category: "technology",
        language: "All",
        link: "#",
        tags: ["digital", "tools", "free"]
      },
      {
        id: 11,
        title: "Bengali Alphabet Charts",
        description: "Colorful charts for teaching Bengali alphabet and pronunciation.",
        category: "visual-aids",
        language: "Bengali",
        link: "#",
        tags: ["alphabet", "charts", "beginners"]
      },
      {
        id: 12,
        title: "Differentiated Instruction Strategies",
        description: "Methods to adapt teaching for students with different learning needs.",
        category: "strategies",
        language: "All",
        link: "#",
        tags: ["inclusion", "adaptation", "personalized"]
      }
    ];
    
    setResources(sampleResources);
  }, [activeTab]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     LOAD SUBMISSIONS
  ========================= */
  useEffect(() => {
    if (!teacherId || activeTab !== "history") return;

    const load = async () => {
      try {
        const data = await apiService.getTeacherSubmissions(teacherId);
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to load submissions:", err);
        setSubmissions([]);
      }
    };

    load();
  }, [activeTab, teacherId]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!input.trim() || isLoading || !teacherId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await apiService.askAI(teacherId, userMsg.text);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: res.strategy || "No response from AI.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: `Error: ${err.message || "Backend not reachable"}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* =========================
     STATUS COLOR
  ========================= */
  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-[#9BC264]";
      case "rejected":
        return "bg-red-200";
      case "pending":
        return "bg-yellow-200";
      default:
        return "bg-gray-200";
    }
  };

  /* =========================
     FILTER RESOURCES
  ========================= */
  const filteredResources = selectedCategory === "all" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const categories = [
    { id: "all", name: "All Resources", count: resources.length },
    { id: "lesson-plans", name: "Lesson Plans", count: resources.filter(r => r.category === "lesson-plans").length },
    { id: "worksheets", name: "Worksheets", count: resources.filter(r => r.category === "worksheets").length },
    { id: "activities", name: "Activities", count: resources.filter(r => r.category === "activities").length },
    { id: "strategies", name: "Teaching Strategies", count: resources.filter(r => r.category === "strategies").length },
    { id: "assessment", name: "Assessment", count: resources.filter(r => r.category === "assessment").length },
    { id: "management", name: "Classroom Management", count: resources.filter(r => r.category === "management").length },
    { id: "technology", name: "Technology", count: resources.filter(r => r.category === "technology").length },
  ];

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-[#6f9b77] p-4 text-black">
      <ConnectionStatus />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#FFFDCE] rounded-xl p-6 mb-6 border border-black-300 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">AI Teaching Assistant</h1>
              <p className="text-sm text-gray-600">
                Personalized strategies for your classroom
              </p>
            </div>

            {teacherId && (
              <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-300 text-sm font-semibold">
                Teacher ID: <span className="text-green-700">{teacherId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-2">
          {["chat", "history", "resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-t-lg border border-b-0 ${
                activeTab === tab
                  ? "bg-green-100 font-bold border-green-300 text-green-700"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
            <div className="h-[400px] overflow-y-auto space-y-4 p-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      m.sender === "user"
                        ? "bg-green-100 border border-green-200"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AI is thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Describe your classroom problem (e.g., 'Students are not understanding English grammar')..."
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Your Previous Submissions</h2>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No submissions yet.</p>
                <p className="text-sm text-gray-400 mt-1">Your chat conversations will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s.id} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <strong className="text-gray-800">{s.language}</strong>
                        <p className="text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="italic text-sm text-gray-600 mb-2 truncate">
                      "{s.raw_message?.substring(0, 100)}..."
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <b>AI Strategy:</b> {s.strategy?.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESOURCES - UPDATED WITH ACTUAL CONTENT */}
        {activeTab === "resources" && (
          <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Teaching Resources</h2>
              <div className="text-sm text-gray-500">
                {filteredResources.length} resources available
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Category:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {resource.language}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          {resource.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => alert(`Downloading: ${resource.title}`)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => alert(`Preview: ${resource.title}`)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No resources found</h3>
                <p className="text-gray-500 mb-4">Try selecting a different category or check back later.</p>
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Show All Resources
                </button>
              </div>
            )}

            {/* Resource Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Resource Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
                  <p className="text-sm text-gray-600">Total Resources</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {Array.from(new Set(resources.map(r => r.language))).length}
                  </p>
                  <p className="text-sm text-gray-600">Languages Covered</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {Array.from(new Set(resources.map(r => r.category))).length}
                  </p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Array.from(new Set(resources.flatMap(r => r.tags))).length}
                  </p>
                  <p className="text-sm text-gray-600">Unique Tags</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2"> How to use these resources:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Download</strong> worksheets and modify as needed for your class</li>
                <li>• <strong>Adapt</strong> lesson plans to fit your teaching style and student needs</li>
                <li>• <strong>Combine</strong> different resources for comprehensive lesson packages</li>
                <li>• <strong>Share</strong> with colleagues and collaborate on improvements</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}