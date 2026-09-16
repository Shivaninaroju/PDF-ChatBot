import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader



def get_embeddings():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")



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
    embeddings = get_embeddings()
    vector_store = FAISS.from_documents(chunks, embedding=embeddings)
    return vector_store


# Save the vector store locally
def save_vector_db(vector_store, path="vector_store"):
    vector_store.save_local(path)


# Load the saved vector store
def load_vector_db(path="vector_store"):
    if not os.path.exists(path) or not os.listdir(path):
        return None
    embeddings = get_embeddings()
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)

