import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://mergeed.onrendor.com";

export interface Submission {
  id: number;
  teacher_id: string;
  problem: string;
  language: string;
  infrastructure: string;
  status: string;
  created_at: string;
  raw_message?: string;
  strategy?: string;
  diet_officer?: string;
  feedback?: string;
}

class ApiService {
  constructor() {
    axios.defaults.baseURL = API_BASE;
    axios.defaults.timeout = 15000;
    axios.defaults.headers.common["Content-Type"] = "application/json";
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await axios.get("/health");
      return res.status === 200;
    } catch {
      return false;
    }
  }

  // TEACHER ENDPOINTS
  async getTeacherSubmissions(teacherId: string): Promise<Submission[]> {
    try {
      const res = await axios.get<Submission[]>(
        `/teachers/${teacherId}/submissions`
      );
      return res.data;
    } catch (error: any) {
      console.error("Error fetching teacher submissions:", error);
      // Return empty array for offline mode
      return [];
    }
  }

  async askAI(teacherId: string, message: string) {
    try {
      const res = await axios.post(`/teachers/chat`, {
        teacher_id: teacherId,
        message,
      });
      return res.data;
    } catch (error: any) {
      console.error("Error asking AI:", error);
      // Return mock response for offline mode
      return {
        success: true,
        submission_id: Date.now(),
        strategy: "I understand you're asking about: " + message + "\n\nIn offline mode, please try again when backend is connected.",
        extracted_params: {
          problem: "General",
          language: "English",
          infrastructure: "Medium",
          raw_message: message
        }
      };
    }
  }

  // DIET ENDPOINTS
  async getPendingSubmissions(): Promise<Submission[]> {
    try {
      const res = await axios.get<Submission[]>("/approvals/submissions?status=Pending");
      return res.data;
    } catch (error: any) {
      console.error("Error fetching pending submissions:", error);
      // Return sample data for offline mode
      return [
        {
          id: 1,
          teacher_id: "TCH_001",
          problem: "Student absenteeism in Hindi classes",
          language: "Hindi",
          infrastructure: "Low",
          status: "Pending",
          raw_message: "Many students are not attending Hindi classes regularly.",
          strategy: "Sample strategy for absenteeism",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          teacher_id: "TCH_002",
          problem: "Low engagement in English classes",
          language: "English",
          infrastructure: "Medium",
          status: "Pending",
          raw_message: "Students find English grammar lessons boring.",
          strategy: "Sample strategy for engagement",
          created_at: new Date().toISOString(),
        }
      ];
    }
  }

  async getSubmissionDetail(submissionId: number): Promise<Submission> {
    try {
      const res = await axios.get<Submission>(`/approvals/submissions/${submissionId}`);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching submission detail:", error);
      // Return mock data for offline mode
      return {
        id: submissionId,
        teacher_id: "TCH_SAMPLE",
        problem: "Sample Problem",
        language: "English",
        infrastructure: "Medium",
        status: "Pending",
        raw_message: "This is sample data because backend is offline.",
        strategy: "Sample strategy for testing.",
        created_at: new Date().toISOString(),
      };
    }
  }

  async approveRecord(submissionId: number, officerId: string, feedback: string = "") {
    try {
      const res = await axios.post(`/approvals/submissions/${submissionId}/approve`, {
        officer_id: officerId,
        feedback
      });
      return res.data;
    } catch (error: any) {
      console.error("Error approving record:", error);
      // Return success for offline mode
      return {
        success: true,
        message: "Approved (offline mode)",
        submission: {
          id: submissionId,
          status: "Approved"
        }
      };
    }
  }

  async rejectRecord(submissionId: number, officerId: string, feedback: string = "") {
    try {
      const res = await axios.post(`/approvals/submissions/${submissionId}/reject`, {
        officer_id: officerId,
        feedback
      });
      return res.data;
    } catch (error: any) {
      console.error("Error rejecting record:", error);
      // Return success for offline mode
      return {
        success: true,
        message: "Rejected (offline mode)",
        submission: {
          id: submissionId,
          status: "Rejected"
        }
      };
    }
  }

  // For Teacher Records Page
  async generateTraining(data: {
    language: string;
    problem: string;
    infrastructure: string;
  }) {
    try {
      const res = await axios.post("/teachers/chat", {
        teacher_id: "TEMP_TEACHER_" + Math.random().toString(36).substring(7),
        message: `Problem: ${data.problem}, Language: ${data.language}, Infrastructure: ${data.infrastructure}`
      });
      return res.data;
    } catch (error: any) {
      console.error("Error generating training:", error);
      // Return mock strategy for offline mode
      return {
        success: true,
        submission_id: Date.now(),
        strategy: `⭐ **AI TEACHING STRATEGY** ⭐

**Context:** ${data.language} | ${data.problem} | ${data.infrastructure} Infrastructure

🔍 **RECOMMENDED APPROACH:**
1. Assess current student understanding levels in ${data.language}
2. Create differentiated activities for ${data.problem.toLowerCase()}
3. Implement peer learning strategies
4. Use available ${data.infrastructure.toLowerCase()} infrastructure effectively
5. Monitor progress weekly

💡 **Offline Mode:** This is a sample strategy. Connect to backend for personalized AI suggestions.`,
        extracted_params: {
          problem: data.problem,
          language: data.language,
          infrastructure: data.infrastructure,
          raw_message: `Problem: ${data.problem}, Language: ${data.language}`
        }
      };
    }
  }

  // GET all submissions (for SCERT)
  async getAllSubmissions() {
    try {
      const res = await axios.get("/approvals/submissions");
      return res.data;
    } catch (error: any) {
      console.error("Error getting all submissions:", error);
      return [];
    }
  }

  // GET stats (for SCERT)
  async getStats() {
    try {
      const res = await axios.get("/approvals/stats");
      return res.data;
    } catch (error: any) {
      console.error("Error getting stats:", error);
      return {
        total: 5,
        pending: 2,
        approved: 3,
        rejected: 0
      };
    }
  }
}

export const apiService = new ApiService();
