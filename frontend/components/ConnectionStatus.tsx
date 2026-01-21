// components/ConnectionStatus.tsx
"use client";

import { useState, useEffect } from "react";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState("Just now");

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = () => {
    setLastSync(new Date().toLocaleTimeString());
    setIsOnline(true);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Connection Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Network Status:</span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isOnline ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {isOnline ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Last Updated:</span>
          <span className="text-blue-600 font-medium">{lastSync}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Server:</span>
          <span className="text-gray-800">online</span>
        </div>
      </div>
      
      <button 
        onClick={handleSync}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
      >
        Refresh Data
      </button>
    </div>
  );
}
