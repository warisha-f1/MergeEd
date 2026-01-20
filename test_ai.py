# test_ai.py in MERGEED-BACKEND folder
import sys
import os
sys.path.append('.')

from app.services.ai_service import AIService

print("🧪 Testing AI Service...")
ai = AIService()

if ai.model:
    print("\n🧪 Testing strategy generation...")
    test_params = {
        "problem": "engagement",
        "language": "Hindi",
        "infrastructure": "Low",
        "raw_message": "Students are bored in Hindi class"
    }
    
    strategy = ai.generate_strategy(test_params)
    print("\n" + "=" * 50)
    print("GENERATED STRATEGY:")
    print("=" * 50)
    print(strategy)
else:
    print("\n❌ AI model not available. Check errors above.")