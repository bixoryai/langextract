# Super Extractor

A modern web interface for LangExtract, powered by Bixory AI.

## Features

- **AI-Powered Extraction**: Use advanced LLMs (Gemini, Ollama, OpenAI) to extract structured information from text
- **User-Friendly Interface**: Clean, responsive design with intuitive controls
- **Multiple Providers**: Choose from various AI models based on your needs
- **Real-time Results**: Instant extraction with visual feedback

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker

1. Clone the repository and navigate to the root:
   ```bash
   cd /workspaces/langextract
   ```

2. Start the services:
   ```bash
   docker-compose up --build
   ```

3. Open your browser to `http://localhost:3000`

### Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Quick Launch Script

For convenience, you can use the provided `start.sh` script to launch both frontend and backend simultaneously:

```bash
./start.sh
```

This will start:
- Backend on `http://localhost:8111`
- Frontend on `http://localhost:1234`

Press `Ctrl+C` to stop both services.

## API Endpoints

- `GET /providers` - List available LLM providers
- `POST /extract` - Extract information from text
- `POST /extract-file` - Extract from uploaded file

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **AI**: LangExtract library
- **Deployment**: Docker

## Contributing

Built with ❤️ by Bixory AI