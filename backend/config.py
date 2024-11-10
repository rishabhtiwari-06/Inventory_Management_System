# config.py
import os

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback_secret_key')
