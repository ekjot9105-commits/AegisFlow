import os
import sys
import logging

logger = logging.getLogger(__name__)

class Settings:
    """
    Centralized configuration manager.
    Fails fast if required security credentials are missing.
    """
    def __init__(self):
        # Fail fast on missing JWT_SECRET
        self.JWT_SECRET = os.getenv("JWT_SECRET")
        if not self.JWT_SECRET:
            logger.critical("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing. Halting startup.")
            sys.exit(1)

        # Fail fast on missing GOOGLE_API_KEY
        self.GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
        if not self.GOOGLE_API_KEY:
            logger.critical("CRITICAL ERROR: GOOGLE_API_KEY environment variable is missing. Halting startup.")
            sys.exit(1)

settings = Settings()
