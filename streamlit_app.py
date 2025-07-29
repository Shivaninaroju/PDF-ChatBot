import os
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

# Your custom utility functions (PDF loading, chunking, etc.)
from utils import load_pdf, split_documents, create_vector_db

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Allow frontend (browser) to talk to backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this later to specific domains
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve static frontend files from Bolt (adjust folder if needed)
app.mount("/assets", StaticFiles(directory="UI/dist/assets"), name="assets")

@app.get("/")
def serve_homepage():
    return FileResponse("UI/dist/index.html")

# Endpoint: POST /chat
@app.post("/chat")
async def chat_with_pdf(file: UploadFile, question: str = Form(...)):
    try:
        # Save uploaded PDF as temp.pdf
        with open("temp.pdf", "wb") as f:
            f.write(await file.read())

        # Step 1: Load PDF text
        docs = load_pdf("temp.pdf")

        # Step 2: Chunk the text
        chunks = split_documents(docs)

        # Step 3: Embed + store in vector DB
        vector_store = create_vector_db(chunks)

        # Step 4: Load LLM (GROQ)
        llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192",  # or llama3-8b-8192
            temperature=0
        )

        # Step 5: Combine Retriever + LLM → RAG
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=vector_store.as_retriever()
        )

        # Step 6: Get answer
        answer = qa_chain.run(question)

        # Return answer to frontend
        return JSONResponse(content={"answer": answer})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
