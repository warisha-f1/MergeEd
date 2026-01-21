// app/teacher/page.tsx
"use client";

import { useState } from "react";
import ConnectionStatus from "@components/ConnectionStatus";

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-6">
      {/* Teacher Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Portal</h1>
        <p className="text-gray-600 mt-2">
          Manage your classroom, track student progress, and access teaching resources.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Teacher Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards for Teachers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-xl font-bold text-blue-600">42</div>
              <div className="text-gray-700">Total Students</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-xl font-bold text-green-600">85%</div>
              <div className="text-gray-700">Average Attendance</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-xl font-bold text-purple-600">18</div>
              <div className="text-gray-700">Pending Assignments</div>
            </div>
          </div>

          {/* Classroom Content */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">Mathematics</div>
                  <div className="text-sm text-gray-600">Grade 9 • Room 203</div>
                </div>
                <div className="text-gray-700">9:00 AM - 10:00 AM</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div>
                  <div className="font-medium">Science Lab</div>
                  <div className="text-sm text-gray-600">Grade 10 • Lab 101</div>
                </div>
                <div className="text-gray-700">11:00 AM - 12:30 PM</div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
            <ul className="space-y-3">
              <li className="flex items-center p-3 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <div>Assignment graded: Algebra Test</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </li>
              <li className="flex items-center p-3 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <div>New student enrolled: Rohan Sharma</div>
                  <div className="text-sm text-gray-500">Yesterday</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Connection Status & Tools */}
        <div className="space-y-6">
          <ConnectionStatus />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-blue-50 rounded border">
                Create New Assignment
              </button>
              <button className="w-full text-left p-3 hover:bg-green-50 rounded border">
                Mark Attendance
              </button>
              <button className="w-full text-left p-3 hover:bg-purple-50 rounded border">
                Upload Lesson Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
