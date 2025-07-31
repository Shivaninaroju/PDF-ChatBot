import os
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from utils import load_pdf, split_documents, create_vector_db, load_vector_db

load_dotenv()
app = FastAPI()

# Allow frontend on localhost:5173 (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve static files if needed
app.mount("/assets", StaticFiles(directory="UI/dist/assets"), name="assets")

@app.get("/")
def serve_homepage():
    return FileResponse("UI/dist/index.html")

# Load pre-embedded vector DB for static QnA
try:
    vector_store = load_vector_db()
except Exception as e:
    vector_store = None
    print("❌ Failed to load vector store:", e)

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(req: QuestionRequest):
    if not vector_store:
        return JSONResponse(status_code=500, content={"error": "Vector DB not loaded."})

    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama3-70b-8192",
        temperature=0
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vector_store.as_retriever()
    )

    result = qa_chain.run(req.question)
    return {"answer": result}

@app.post("/chat")
async def chat_with_uploaded_pdf(file: UploadFile, question: str = Form(...)):
    try:
        with open("temp.pdf", "wb") as f:
            f.write(await file.read())

        docs = load_pdf("temp.pdf")
        chunks = split_documents(docs)
        vector = create_vector_db(chunks)

        llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192",
            temperature=0
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=vector.as_retriever()
        )

        result = qa_chain.run(question)
        return {"answer": result}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
