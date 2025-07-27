# streamlit_a
import streamlit as st
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from utils import load_pdf, split_documents, create_vector_db, save_vector_db, load_vector_db

import os
from dotenv import load_dotenv
load_dotenv()  # Load GROQ API key from .env file

# Set up Streamlit UI
st.set_page_config(page_title="Chat With Your PDF", layout="centered")
st.title("📄 Chat With Your PDF (RAG Project)")
st.markdown("Upload a PDF and ask anything based on it!")

# Upload the PDF file
pdf = st.file_uploader("Upload your PDF", type="pdf")

# Streamlit session state to store vector database
if "vector_store" not in st.session_state:
    st.session_state.vector_store = None

# When a PDF is uploaded
if pdf is not None:
    with st.spinner("Reading and processing your PDF..."):
        # Save uploaded file as temp.pdf
        temp_path = "temp.pdf"
        with open(temp_path, "wb") as f:
            f.write(pdf.read())

        # Step 1: Load the PDF using PyMuPDF (in utils.py)
        docs = load_pdf(temp_path)

        # Step 2: Split the PDF into chunks (in utils.py)
        chunks = split_documents(docs)

        # Step 3: Create embeddings and vector DB (in utils.py)
        vector_store = create_vector_db(chunks)

        # Step 4 (Optional): Save DB locally for future use (in utils.py)
        save_vector_db(vector_store)

        # Step 5: Store in session state
        st.session_state.vector_store = vector_store
        st.success("✅ PDF processed and embedded successfully!")

# Input box for asking questions
question = st.text_input("Ask a question based on your PDF:")

# When both PDF is loaded and question is asked
if st.session_state.vector_store and question:
    with st.spinner("Generating answer..."):
        # Load LLM using GROQ
        llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192",  # You can also try "llama3-8b-8192"
            temperature=0
        )

        # Create a RetrievalQA chain (LLM + Vector Store Retriever)
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=st.session_state.vector_store.as_retriever()
        )

        # Get the answer
        answer = qa_chain.run(question)

        # Show the answer
        st.markdown("### 🧠 Answer:")
        st.markdown(answer)
