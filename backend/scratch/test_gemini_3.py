import os
import google.genai as genai
from dotenv import load_dotenv

load_dotenv('.env')
api_key = os.getenv("GEMINI_API_KEY")
model_name = "gemini-3.1-flash-lite"

print(f"Testing with model: {model_name}")
client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model=model_name,
        contents="Hello, say 'Gemini 3.1 is active' if you can read this."
    )
    if response and response.text:
        print(f"Response: {response.text.strip()}")
    else:
        print("Empty response object or no text.")
except Exception as e:
    print(f"Error: {e}")
