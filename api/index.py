import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app

# Vercel needs a handler for Serverless Functions
# The FastAPI app instance is imported directly
