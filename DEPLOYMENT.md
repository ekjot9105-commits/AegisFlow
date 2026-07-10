# Deployment Guide

AegisFlow is configured for scalable deployment using Netlify for the frontend and Render for the FastAPI backend.

## Environment Variables

### Backend (`.env`)
```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Security
SECRET_KEY=generate_a_secure_random_string

# Environment Configuration
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.netlify.app
```

### Frontend (`.env`)
```env
VITE_API_URL=https://your-backend-domain.onrender.com/api/v1
```

*(Note: Never expose actual API keys or secrets in version control.)*

## Frontend Deployment (Netlify)

1. Connect your GitHub repository to [Netlify](https://www.netlify.com/).
2. Configure the Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add the required Environment Variables in the Netlify dashboard (`VITE_API_URL`).
4. Trigger a deploy. Netlify will handle building and serving the static assets.

## Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the settings:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set the Environment Variables (`GEMINI_API_KEY`, `SECRET_KEY`, `CORS_ORIGINS`).
5. Deploy. Render will expose the backend URL to link with your frontend.

## Local Production Build

To test the production build locally:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Run the backend:
   ```bash
   cd backend
   ENVIRONMENT=production uvicorn main:app --host 0.0.0.0 --port 8000
   ```
