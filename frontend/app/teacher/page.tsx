// app/teacher/page.tsx
"use client";

import { useState } from "react";

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "ai", text: "Hello! I'm your AI Teaching Assistant.", time: "09:22 PM" },
    { id: 2, sender: "user", text: "Student's are not understanding English grammar.", time: "09:23 PM" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Teaching Assistant</h1>
        <p className="text-gray-600 mt-2">Personalized strategies for your classroom</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 font-medium ${
            activeTab === "chat" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium ${
            activeTab === "history" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 font-medium ${
            activeTab === "resources" 
              ? "border-b-2 border-blue-500 text-blue-500" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Resources
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">Describe your classroom challenge and I'll help you.</p>
              <p className="text-sm text-gray-500 mt-1">09:22 PM</p>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.sender === "ai" 
                      ? "bg-gray-50" 
                      : "bg-blue-50 ml-8"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{msg.text}</p>
                    <span className="text-sm text-gray-500">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Strategy */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">AI TEACHING STRATEGY</h3>
            <div className="p-3 bg-yellow-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-yellow-800">Fallback Mode</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Context:</p>
                <p className="font-medium">English | learning | Medium Infrastructure</p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">Teacher II</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Live
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last checked:</span>
                <span className="font-medium">9:23:25 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backend:</span>
                <span className="font-mono text-gray-800">192.168.0.100:3333</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
