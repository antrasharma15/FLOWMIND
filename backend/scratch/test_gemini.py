import os
import google.genai as genai
from dotenv import load_dotenv

load_dotenv('.env')
api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

print(f"Testing with model: {model_name}")
client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model=model_name,
        contents="Hello, say 'Gemini is active' if you can read this."
    )
    print(f"Response: {response.text.strip()}")
except Exception as e:
    print(f"Error: {e}")
