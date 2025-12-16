from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import langextract as lx
import json
import tempfile
import os
import requests
from bs4 import BeautifulSoup
import re
from langextract.core.data import ExampleData, Extraction

app = FastAPI(title="Super Extractor API", description="LangExtract API wrapper for Super Extractor")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1234"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def scrape_webpage(url: str) -> str:
    """Scrape text content from a webpage URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'lxml')

        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer", "aside"]):
            script.decompose()

        # Get text content
        text = soup.get_text()

        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)

        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse webpage: {str(e)}")

class ExtractionRequest(BaseModel):
    text: str
    prompt_description: str
    model_id: str
    examples: list = []  # Simplified, can expand

class URLExtractionRequest(BaseModel):
    url: str
    prompt_description: str
    model_id: str
    examples: list = []  # Simplified, can expand

@app.post("/extract")
async def extract_text(request: ExtractionRequest):
    try:
        # For now, simple extraction without examples
        result = lx.extract(
            text_or_documents=request.text,
            prompt_description=request.prompt_description,
            model_id=request.model_id,
            examples=request.examples
        )
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-file")
async def extract_file(file: UploadFile = File(...), prompt_description: str = "", model_id: str = "gemini-2.5-flash"):
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Read file content (assuming text)
        with open(tmp_path, 'r') as f:
            text = f.read()

        os.unlink(tmp_path)  # Clean up

        result = lx.extract(
            text_or_documents=text,
            prompt_description=prompt_description,
            model_id=model_id
        )
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-url")
async def extract_url(request: URLExtractionRequest):
    try:
        # Scrape content from URL
        scraped_text = scrape_webpage(request.url)

        if not scraped_text.strip():
            raise HTTPException(status_code=400, detail="No readable text content found on the webpage")

        # Create proper ExampleData objects
        examples = []
        if request.examples:
            # Convert the provided examples to ExampleData objects
            for ex in request.examples:
                extractions = []
                if isinstance(ex.get('extractions'), dict):
                    # Convert dict to Extraction objects
                    for key, value in ex['extractions'].items():
                        extractions.append(Extraction(
                            extraction_class=key,
                            extraction_text=str(value)
                        ))
                examples.append(ExampleData(
                    text=ex.get('text', ''),
                    extractions=extractions
                ))
        else:
            # Provide a default example for basic extraction
            examples = [ExampleData(
                text="This is a sample webpage with content to extract information from.",
                extractions=[Extraction(
                    extraction_class="title",
                    extraction_text="Sample Title"
                )]
            )]

        # Extract information using LangExtract
        try:
            result = lx.extract(
                text_or_documents=scraped_text,
                prompt_description=request.prompt_description,
                model_id=request.model_id,
                examples=examples
            )
        except Exception as extract_error:
            if "API key" in str(extract_error) or "api_key" in str(extract_error):
                # Provide a mock response for demo purposes when no API key is available
                result = {
                    "extractions": [
                        {
                            "extraction_class": "title",
                            "extraction_text": "Example Title (Demo - API key required for actual extraction)",
                            "char_interval": {"start": 0, "end": 13}
                        }
                    ]
                }
            else:
                raise extract_error

        return {
            "result": result,
            "url": request.url,
            "scraped_text_length": len(scraped_text),
            "scraped_text_preview": scraped_text[:500] + "..." if len(scraped_text) > 500 else scraped_text
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.get("/providers")
async def get_providers():
    # Return available providers from langextract
    # This is simplified; in reality, query langextract registry
    return {
        "providers": [
            {"id": "gemini", "name": "Google Gemini", "models": ["gemini-2.5-flash", "gemini-1.5-pro"]},
            {"id": "ollama", "name": "Ollama (Local)", "models": ["llama2", "mistral"]},
            {"id": "openai", "name": "OpenAI", "models": ["gpt-4", "gpt-3.5-turbo"]}
        ]
    }