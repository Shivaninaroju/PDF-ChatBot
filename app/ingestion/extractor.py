import os
from typing import List
from langchain_core.documents import Document
from app.core.logging import logger

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

try:
    from pypdf import PdfReader
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


def extract_text_from_pdf(file_path: str, document_name: str) -> List[Document]:
    """
    Extracts text page-by-page from a PDF file using PyMuPDF (fitz) primary with pypdf fallback.
    Returns a list of LangChain Document objects with rich page-level metadata.
    """
    documents: List[Document] = []

    # 1. Primary Engine: PyMuPDF (Fast & Accurate)
    if PYMUPDF_AVAILABLE:
        try:
            doc = fitz.open(file_path)
            for page_num, page in enumerate(doc, start=1):
                text = page.get_text("text").strip()
                if text:
                    documents.append(
                        Document(
                            page_content=text,
                            metadata={
                                "source": document_name,
                                "document_name": document_name,
                                "page_number": page_num,
                                "total_pages": len(doc),
                            }
                        )
                    )
            doc.close()
            if documents:
                logger.info(f"Successfully extracted {len(documents)} pages using PyMuPDF for {document_name}")
                return documents
        except Exception as e:
            logger.warning(f"PyMuPDF extraction failed for {document_name}: {e}. Trying fallback...")

    # 2. Fallback Engine: pypdf
    if PYPDF_AVAILABLE:
        try:
            reader = PdfReader(file_path)
            for page_num, page in enumerate(reader.pages, start=1):
                text = (page.extract_text() or "").strip()
                if text:
                    documents.append(
                        Document(
                            page_content=text,
                            metadata={
                                "source": document_name,
                                "document_name": document_name,
                                "page_number": page_num,
                                "total_pages": len(reader.pages),
                            }
                        )
                    )
            logger.info(f"Successfully extracted {len(documents)} pages using pypdf for {document_name}")
            return documents
        except Exception as e:
            logger.error(f"pypdf extraction failed for {document_name}: {e}")

    logger.error(f"Could not extract any text from PDF: {document_name}")
    return documents
