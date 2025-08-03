# Chat With Your PDF - RAG Assistant

A modern, AI-powered document intelligence system that transforms PDF documents into interactive, conversational knowledge bases using Retrieval-Augmented Generation (RAG) technology.

## 🚀 Features

- **Smart PDF Processing**: Upload and process PDF documents with advanced text extraction
- **RAG Technology**: Uses retrieval-augmented generation for accurate, context-aware responses
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Chat**: Interactive chat interface with streaming responses
- **FastAPI Ready**: Structured for easy integration with FastAPI backend
- **Professional Design**: Premium SaaS-level design suitable for portfolios and presentations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Vite** for development and building

### Backend Integration Points
- **FastAPI** - Python web framework
- **LangChain** - LLM application framework
- **FAISS** - Vector similarity search
- **HuggingFace** - Transformer models and embeddings
- **OpenAI GPT** - Language model for responses

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Hero.tsx         # Landing page hero section
│   ├── About.tsx        # Project information
│   ├── Features.tsx     # Feature showcase
│   ├── Technologies.tsx # Tech stack display
│   ├── Testimonials.tsx # Use cases and testimonials
│   ├── Contact.tsx      # Contact form
│   ├── Footer.tsx       # Site footer
│   └── LoadingSpinner.tsx # Loading component
├── pages/
│   └── ChatPage.tsx     # Main chat interface
├── lib/
│   ├── utils.ts         # Utility functions
│   └── api.ts           # API service layer
└── App.tsx              # Main application component
```

## 🔧 FastAPI Integration

The frontend is structured to easily connect with a FastAPI backend. Key integration points:

### API Endpoints Expected

```python
# Backend endpoints to implement
POST /api/upload-pdf     # PDF file upload and processing
POST /api/chat          # Chat message handling
POST /api/contact       # Contact form submission
GET  /api/download-report # Project report download
GET  /health            # Health check
```

### Environment Configuration

Copy `.env.example` to `.env` and update the API base URL:

```bash
VITE_API_BASE_URL=http://localhost:8000  # Your FastAPI backend URL
```

### API Service Usage

The `src/lib/api.ts` file provides a complete API service layer:

```typescript
import { apiService } from './lib/api';

// Upload PDF
const result = await apiService.uploadPdf(file);

// Send chat message
const response = await apiService.sendChatMessage({
  message: "What is this document about?",
  session_id: "user_session_123"
});

// Submit contact form
await apiService.submitContactForm(formData);
```

## 🚀 Getting Started

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Update VITE_API_BASE_URL to match your FastAPI backend
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🎨 Design Features

- **Dark Theme**: Professional dark theme with vibrant accent colors
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects
- **Glassmorphism**: Modern glassmorphic design elements
- **Professional Layout**: SaaS-level design suitable for portfolios

## 🔗 Backend Implementation Guide

To complete the full-stack application, implement a FastAPI backend with:

1. **PDF Processing**: Text extraction and chunking
2. **Embeddings**: Generate vector embeddings using sentence transformers
3. **Vector Store**: FAISS database for similarity search
4. **RAG Pipeline**: LangChain-based retrieval and generation
5. **API Endpoints**: RESTful API matching the frontend expectations

## 📱 Demo Features

- **Interactive Chat**: Upload PDFs and ask questions
- **Responsive Design**: Works on all devices
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error management
- **Professional UI**: Premium design suitable for presentations

## 🤝 Contributing

This project is designed to be a complete showcase of modern AI application development. Feel free to use it as a template for your own RAG-based applications.

## 📄 License

This project is open source and available under the MIT License.

---

**Ready for FastAPI Integration** ⚡

This frontend is fully prepared to connect with a FastAPI backend. All API calls are properly structured and documented for easy backend implementation.
