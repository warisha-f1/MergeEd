import os
import re
import json
from typing import Dict, Any
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.0-pro")
        
        try:
            self.model = genai.GenerativeModel(self.model_name)
            print(f"✅ Gemini AI initialized with model: {self.model_name}")
        except Exception as e:
            print(f"❌ Gemini initialization failed: {e}")
            self.model = None
    
    def extract_parameters(self, user_message: str) -> Dict[str, Any]:
        """
        Use Gemini to intelligently extract teaching context
        """
        if not self.model:
            return self._fallback_extract(user_message)
        
        try:
            prompt = f"""Extract teaching context from this teacher's message. Return ONLY valid JSON with these keys:
            - "problem" (string): Main teaching challenge (e.g., "absenteeism", "engagement", "learning_gaps", "behavior", "resources", "other")
            - "language" (string): Subject language (e.g., "English", "Hindi", "Marathi", "Bengali", etc.)
            - "infrastructure" (string): "Low", "Medium", or "High"
            - "raw_message" (string): The original message
            
            Teacher's message: "{user_message}"
            
            Example response: {{"problem": "engagement", "language": "Hindi", "infrastructure": "Medium", "raw_message": "original message here"}}
            """
            
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.1,
                    "max_output_tokens": 200,
                }
            )
            
            # Parse JSON response
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            params = json.loads(response_text)
            return params
            
        except Exception as e:
            print(f"Gemini extraction failed: {e}")
            return self._fallback_extract(user_message)
    
    def _fallback_extract(self, user_message: str) -> Dict[str, Any]:
        """
        Fallback keyword extraction if Gemini fails
        """
        user_message_lower = user_message.lower()
        
        # Extract problem type
        problem_keywords = {
            'absenteeism': ['absent', 'skip', 'missing', 'attendance', 'not coming', 'absentee'],
            'engagement': ['boring', 'engage', 'interest', 'motivate', 'attention', 'focus', 'participation'],
            'learning': ['learn', 'understand', 'concept', 'difficult', 'hard', 'not getting', 'confused'],
            'behavior': ['discipline', 'behavior', 'rude', 'noisy', 'disruptive', 'fight'],
            'infrastructure': ['tech', 'computer', 'internet', 'device', 'lab', 'facility', 'equipment'],
            'resources': ['book', 'material', 'resource', 'tool', 'supply', 'stationery']
        }
        
        problem = "other"
        for key, keywords in problem_keywords.items():
            if any(keyword in user_message_lower for keyword in keywords):
                problem = key
                break
        
        # Extract language
        language = "English"
        language_keywords = {
            'bengali': ['bengali', 'bangla', 'bengal'],
            'hindi': ['hindi'],
            'marathi': ['marathi'],
            'tamil': ['tamil'],
            'telugu': ['telugu'],
            'kannada': ['kannada'],
            'malayalam': ['malayalam'],
            'english': ['english', 'inglish']
        }
        for lang, keywords in language_keywords.items():
            if any(keyword in user_message_lower for keyword in keywords):
                language = lang
                break
        
        # Extract infrastructure level
        infrastructure = "Medium"
        infra_words = user_message_lower.split()
        if any(word in ['low', 'basic', 'poor', 'none', 'no', 'without', 'limited'] for word in infra_words):
            infrastructure = "Low"
        elif any(word in ['high', 'advanced', 'good', 'excellent', 'full', 'complete', 'smart'] for word in infra_words):
            infrastructure = "High"
        
        return {
            "problem": problem,
            "language": language.capitalize(),
            "infrastructure": infrastructure,
            "raw_message": user_message
        }
    
    def generate_strategy(self, params: Dict[str, Any]) -> str:
        """
        Generate personalized teaching strategy using Gemini
        """
        if not self.model:
            return self._fallback_strategy(params)
        
        try:
            problem = params.get("problem", "other")
            language = params.get("language", "English")
            infrastructure = params.get("infrastructure", "Medium")
            raw_message = params.get("raw_message", "")
            
            prompt = f"""You are an expert AI teaching assistant for Indian schools. Generate a practical, actionable teaching strategy.

CONTEXT:
- Subject Language: {language}
- Main Problem: {problem}
- Infrastructure Level: {infrastructure}
- Teacher's Query: "{raw_message}"

REQUIREMENTS:
1. Provide SPECIFIC, PRACTICAL strategies (not generic advice)
2. Include 2-3 actionable steps the teacher can implement immediately
3. Suggest resources appropriate for {infrastructure} infrastructure level
4. Mention how to adapt for {language} language teaching
5. Include assessment ideas to measure progress
6. Keep it encouraging and supportive
7. Use bullet points and clear sections
8. Maximum 400 words

FORMAT:
Start with: "🧠 **AI TEACHING STRATEGY**"

Include these sections:
1. **Quick Wins** (2 things to try tomorrow)
2. **Detailed Approach** (step-by-step plan)
3. **Resources Needed** (matching {infrastructure} infrastructure)
4. **Assessment Ideas**
5. **Expected Timeline**

Remember: Be specific to {language} teaching and {problem} problem."""
            
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 1000,
                    "top_p": 0.9,
                }
            )
            
            return response.text.strip()
            
        except Exception as e:
            print(f"Gemini strategy generation failed: {e}")
            return self._fallback_strategy(params)
    
    def _fallback_strategy(self, params: Dict[str, Any]) -> str:
        """Fallback strategy if Gemini fails"""
        problem = params.get("problem", "other")
        language = params.get("language", "English")
        infrastructure = params.get("infrastructure", "Medium")
        
        return f"""🧠 **AI TEACHING STRATEGY** (Fallback Mode)

**Context:** {language} | {problem} | {infrastructure} Infrastructure

📋 **QUICK WINS** (Try tomorrow):
1. **Warm-up Activity**: Start class with a 5-minute {language} word game
2. **Peer Teaching**: Pair students to explain concepts to each other

🔍 **DETAILED APPROACH**:
- Break lessons into 15-minute chunks with mini-activities
- Use visual aids (charts, drawings) for {language} concepts
- Implement think-pair-share discussions

🛠️ **RESOURCES NEEDED** ({infrastructure} infrastructure):
- Basic: Paper, markers, flashcards
- Medium: Projector, audio player
- High: Digital tools, interactive apps

📊 **ASSESSMENT IDEAS**:
- Weekly 5-question quizzes
- Peer feedback sessions
- Learning journals

⏱️ **TIMELINE**:
Week 1: Implement 1-2 strategies
Week 2: Gather student feedback
Week 3: Adjust and expand

💡 **Need specific help?** Describe your exact classroom situation for more tailored advice."""