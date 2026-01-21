// components/ConnectionStatus.tsx
"use client";

import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  
  // Get backend URL from environment or use Render URL as fallback
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://mergeed.onrender.com";

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const health = await apiService.checkHealth();
      setIsConnected(health);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Connection check failed:", error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getConnectionColor = () => {
    if (isChecking) return "bg-yellow-500";
    return isConnected ? "bg-green-500" : "bg-red-500";
  };

  const getConnectionText = () => {
    if (isChecking) return "Checking connection...";
    return isConnected ? "Connected to Backend" : "Backend Disconnected";
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${getConnectionColor()} animate-pulse`}
              />
              <span className="font-semibold text-gray-800">
                {getConnectionText()}
              </span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showDetails ? "▲" : "▼"}
            </button>
          </div>

          {lastChecked && (
            <div className="text-xs text-gray-500 mt-1">
              Last checked: {lastChecked}
            </div>
          )}
        </div>

        {/* Details */}
        {showDetails && (
          <div className="p-4 bg-white">
            {!isConnected ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-semibold text-red-700 mb-1">
                  Connection Issues
                </h5>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Backend server is not reachable</li>
                  <li>• Make sure server is running</li>
                  <li>• Check network / firewall settings</li>
                  <li>• Verify backend URL: {backendUrl}</li>
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                Backend is reachable and healthy
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={checkConnection}
                disabled={isChecking}
                className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md disabled:opacity-50"
              >
                {isChecking ? "Checking..." : "Refresh"}
              </button>

              <button
                onClick={() => window.open(backendUrl, "_blank")}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md"
              >
                Open Backend
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <span>Backend: {backendUrl.replace('https://', '').replace('http://', '')}</span>
          <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}
