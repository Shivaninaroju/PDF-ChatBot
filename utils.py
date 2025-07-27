# utils.py

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

import os
from dotenv import load_dotenv
load_dotenv()


# Load PDF and return document objects
def load_pdf(path):
    loader = PyPDFLoader(path)
    return loader.load()


# Split long documents into smaller chunks
def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(documents)


# Create a vector database from document chunks
def create_vector_db(chunks):
    # ✅ Use HuggingFaceEmbeddings (no need for OpenAI key)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(chunks, embedding=embeddings)
    return vector_store


# Save the vector store locally
def save_vector_db(vector_store, path="vector_store"):
    vector_store.save_local(path)


# Load the saved vector store
def load_vector_db(path="vector_store"):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)
