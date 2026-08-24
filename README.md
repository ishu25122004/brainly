# Brainly — Your AI-Powered Second Brain

Brainly is a full-stack web application that acts as your digital "Second Brain." It allows you to save, organize, and interact with your digital content (links, YouTube videos, PDFs, and tweets). Using advanced AI (Google Gemini) and Retrieval-Augmented Generation (RAG), Brainly understands your saved content and allows you to chat contextually with your own knowledge base.

## 🚀 Features

- **Multi-Format Content Storage:** Save web links, YouTube videos, Twitter (X) posts, and upload PDF documents.
- **AI Knowledge Extraction:** Automatically scrapes web links, parses PDFs, and downloads YouTube transcripts in the background.
- **Contextual AI Chat:** Chat directly with your "Second Brain." The app uses vector embeddings and cosine similarity to find the most relevant saved content and answers your questions based *only* on what you've saved.
- **Public Brain Sharing:** Generate a secure, read-only public link to share your curated knowledge base with others.
- **Robust Security:** Built with enterprise-standard security practices, including JWT authentication, `bcrypt` password hashing, and strict `zod` payload validation.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State & Routing:** React Hooks, React Router DOM
- **UI Components:** Custom glassmorphism design with responsive sidebars and modals.

### Backend
- **Server:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **AI Integration:** Google Gemini API ( `@google/genai` )
- **Data Processing:** `pdf-parse` (for documents), `youtube-transcript` (for videos), `cheerio` (for web scraping).

## 📂 Project Structure

The project is structured as a monorepo with two main directories:

- `/brainly` - The Express/Node.js backend API.
- `/brainly-frontend/vite-project` - The React/Vite frontend application.

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)
- Google Gemini API Key

### 1. Setup the Backend
```bash
cd brainly
npm install
```
Create a `.env` file in the `/brainly` directory with the following keys:
```env
MONGO_URI=your_mongodb_connection_string
JWT_PASSWORD=your_super_secret_jwt_password
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 2. Setup the Frontend
```bash
cd brainly-frontend/vite-project
npm install
```
Create a `.env` file in the `/brainly-frontend/vite-project` directory:
```env
VITE_BACKEND_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
```

### 3. Usage
Navigate to `http://localhost:5173` in your browser. Create an account, start saving links and documents, and click the "Chat with Brain" button to interact with your data!
