// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (selectedRole === "teacher") {
      router.push("/teacher");
    } else if (selectedRole === "diet") {
      router.push("/diet");
    } else if (selectedRole === "scert") {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">LOGIN</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedRole("teacher")}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
              selectedRole === "teacher" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-xl font-semibold text-gray-800">TEACHER</div>
            <div className="text-sm text-gray-500 mt-1">AI Teaching Assistant access</div>
          </button>
          
          <button
            onClick={() => setSelectedRole("diet")}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
              selectedRole === "diet" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="text-xl font-semibold text-gray-800">DIET PORTAL</div>
            <div className="text-sm text-gray-500 mt-1">Review pedagogical strategies</div>
          </button>
          
          <button
            onClick={() => setSelectedRole("scert")}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
              selectedRole === "scert" 
                ? "border-purple-500 bg-purple-50" 
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="text-xl font-semibold text-gray-800">SCERT PORTAL</div>
            <div className="text-sm text-gray-500 mt-1">State monitoring dashboard</div>
          </button>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={!selectedRole}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
            selectedRole 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          ENTER PORTAL
        </button>
      </div>
    </div>
  );
}
