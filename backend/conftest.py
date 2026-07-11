import os
import sys

# Mock required environment variables before any modules are loaded
os.environ["JWT_SECRET"] = "test_jwt_secret"
os.environ["GOOGLE_API_KEY"] = "test_google_api_key"

# Ensure the parent directory of 'backend' is resolvable by pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
