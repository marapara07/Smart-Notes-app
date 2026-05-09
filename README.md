# Smart Notes Application

## Project Description

Smart Notes is a full-stack notes management application with AI features. Users can register, log in, create, edit, delete and organize notes. The app uses Google Gemini for AI-generated summaries, AI-generated tags, semantic search and “Ask Your Notes” functionality.

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```

Backend runs on:

```txt
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

### AI
- Google Gemini API
- Gemini text generation
- Gemini embeddings

---

## API Description

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in user |
| GET | `/api/auth/me` | Get logged-in user |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all user notes |
| GET | `/api/notes/:id` | Get one note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/summarize` | Generate note summary |
| POST | `/api/ai/generate-tags` | Generate note tags |
| POST | `/api/ai/semantic-search` | Search notes by meaning |
| POST | `/api/ai/ask-notes` | Ask questions about notes |

---

## Database Structure

The app uses MongoDB Atlas with two main collections.

### Users Collection

```json
{
  "name": "String",
  "email": "String",
  "password": "Hashed password"
}
```

### Notes Collection

```json
{
  "userId": "ObjectId",
  "title": "String",
  "content": "String",
  "summary": "String",
  "tags": ["String"],
  "embedding": ["Number"]
}
```

---

## AI Features Explanation

The application includes two main AI generation features:

1. **AI Summary Generation**  
   Gemini generates a short summary based on the note content.

2. **AI Tag Generation**  
   Gemini generates relevant tags for the note.

The app also includes semantic search and Ask Your Notes using embeddings.

---

## How Embeddings / RAG Are Implemented

When a note is created or updated, the backend sends the note content to Gemini Embeddings. The returned embedding vector is stored in MongoDB.

For semantic search, the search query is also converted into an embedding. The backend compares the query embedding with stored note embeddings using cosine similarity and returns the most relevant notes.

For Ask Your Notes, the app retrieves the most relevant notes first, then sends them as context to Gemini. Gemini generates an answer based on those retrieved notes. This is the RAG pipeline.

---

## Limitations

- The app supports only text notes.
- There is no file upload.
- Notes cannot be shared between users.
- Semantic search may be less accurate for very short notes.
- The app is not deployed online yet.

---

## Future Improvements

- Add folders and categories.
- Add file and image uploads.
- Add collaborative notes.
- Add dark mode.
- Deploy the app online.
- Add a dedicated vector database.