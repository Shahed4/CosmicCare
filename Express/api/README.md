# 🎧 Rant & Reflect — Backend API

An AI-powered self-therapy application backend that transcribes user speech and analyzes emotional tone in real-time using **OpenAI Whisper** and **Google Gemini**.

---

## 🚀 Features

- **Speech-to-Text**: Convert audio recordings to text using OpenAI Whisper API
- **Emotion Analysis**: Analyze emotional tone using Google Gemini AI
- **Multi-format Support**: Accepts `.mp3`, `.wav`, `.m4a`, `.webm`, and `.ogg` audio files
- **RESTful API**: Clean, structured endpoints with proper error handling
- **Real-time Processing**: Fast audio transcription and emotion detection
- **Structured Logging**: Color-coded console logs for easy debugging

---

## 📦 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **AI Services**:
  - OpenAI Whisper (Speech-to-Text)
  - Google Gemini (Emotion Analysis)
- **File Upload**: Multer
- **Environment**: dotenv
- **CORS**: Enabled for frontend integration

---

## 📂 Project Structure

```
api/
├── controllers/
│   └── transcribeController.js    # Request handling logic
├── services/
│   ├── whisperService.js          # OpenAI Whisper integration
│   └── geminiService.js           # Google Gemini integration
├── middlewares/
│   └── uploadMiddleware.js        # Multer file upload config
├── routes/
│   └── transcribeRoute.js         # API route definitions
├── utils/
│   └── logger.js                  # Logging utility
├── lib/
│   └── openAI.js                  # (Legacy - can be removed)
├── .env                           # Environment variables
├── .gitignore
├── package.json
├── server.js                      # Express app entry point
└── README.md
```

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```bash
cd api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
OPENAI_KEY=your_openai_api_key_here
GEMINI_KEY=your_gemini_api_key_here
ALLOWED_ORIGIN=http://localhost:3000
```

### 4️⃣ Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npx nodemon server.js
```

---

## 🌐 API Endpoints

### **1. Health Check**

**GET** `/api/health`

Returns server health status and uptime.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T16:20:00Z",
  "uptime": 123.456
}
```

---

### **2. Transcribe & Analyze Audio**

**POST** `/api/transcribe`

Upload an audio file to get transcription and emotion analysis.

**Request:**
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `audio` (file field)

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/transcribe \
  -F "audio=@recording.mp3"
```

**Example using JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await fetch('http://localhost:5000/api/transcribe', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

**Success Response (200):**
```json
{
  "text": "I feel like nothing is going my way today.",
  "emotion": "frustrated",
  "confidence": "7",
  "timestamp": "2025-10-18T16:20:00Z",
  "processingTime": "3.45s",
  "fileSize": "245.67 KB"
}
```

**Error Responses:**

**400 - No File Provided:**
```json
{
  "error": true,
  "message": "No audio file provided",
  "code": "NO_FILE"
}
```

**400 - No Speech Detected:**
```json
{
  "error": true,
  "message": "No speech detected in audio file",
  "code": "NO_SPEECH"
}
```

**400 - File Too Large:**
```json
{
  "error": true,
  "message": "File size exceeds 25MB limit",
  "code": "FILE_TOO_LARGE"
}
```

**500 - Transcription Failed:**
```json
{
  "error": true,
  "message": "Speech-to-text conversion failed",
  "code": "WHISPER_ERROR",
  "details": "API error message"
}
```

---

## 🧪 Testing the API

### Using Postman or Insomnia:

1. Create a new **POST** request to `http://localhost:5000/api/transcribe`
2. Set body type to **form-data**
3. Add a field named `audio` with type **File**
4. Upload an audio file (`.mp3`, `.wav`, etc.)
5. Send the request

### Using a Test Audio File:

Record a quick voice memo on your phone or use a test file, then:

```bash
curl -X POST http://localhost:5000/api/transcribe \
  -F "audio=@path/to/your/audio.mp3"
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `OPENAI_KEY` | OpenAI API key for Whisper | **Yes** |
| `GEMINI_KEY` | Google Gemini API key | **Yes** |
| `ALLOWED_ORIGIN` | CORS allowed origin (default: http://localhost:3000) | No |

---

## 📊 Response Schema

All successful transcription responses follow this structure:

```typescript
{
  text: string;           // Transcribed speech
  emotion: string;        // Detected emotion (e.g., "calm", "anxious")
  confidence: string;     // Intensity score (1-10)
  timestamp: string;      // ISO 8601 timestamp
  processingTime: string; // Time taken (e.g., "3.45s")
  fileSize: string;       // Upload size (e.g., "245.67 KB")
}
```

---

## 🛡️ Error Handling

The API uses consistent error responses:

```json
{
  "error": true,
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": "Optional technical details"
}
```

**Error Codes:**
- `NO_FILE` - No audio file in request
- `NO_SPEECH` - Audio contains no detectable speech
- `FILE_TOO_LARGE` - File exceeds 25MB
- `WHISPER_ERROR` - OpenAI Whisper API failure
- `GEMINI_ERROR` - Google Gemini API failure
- `INTERNAL_ERROR` - Unexpected server error

---

## 🚦 Supported Audio Formats

- `.mp3` (MPEG Audio)
- `.wav` (Waveform Audio)
- `.m4a` (MPEG-4 Audio)
- `.webm` (WebM Audio)
- `.ogg` (Ogg Vorbis)

**Maximum file size**: 25 MB (OpenAI Whisper constraint)

---

## 🔮 Future Enhancements

- [ ] Real-time streaming transcription (WebSocket)
- [ ] User authentication & session management
- [ ] Database integration for transcript history
- [ ] Emotion trend analysis over time
- [ ] Multi-language support
- [ ] Rate limiting & API key management
- [ ] Batch processing for multiple files
- [ ] Export transcripts as PDF/JSON

---

## 🐛 Troubleshooting

### "No speech detected" error
- Ensure audio file contains clear speech
- Check audio isn't corrupted or silent
- Try a different audio format

### Whisper API errors
- Verify `OPENAI_KEY` is valid
- Check OpenAI account has credits
- Ensure file size < 25MB

### Gemini API errors
- Verify `GEMINI_KEY` is valid
- Check Google Cloud project is configured
- Enable Generative Language API in Google Cloud Console

---

## 📝 License

MIT License - feel free to use this project for learning or production.

---

## 👨‍💻 Author

Built with ❤️ for self-reflection and mental wellness.

**Questions or feedback?** Open an issue or submit a PR!

---

## 🙏 Acknowledgments

- **OpenAI** for the Whisper speech recognition model
- **Google** for the Gemini generative AI platform
- **Express.js** community for excellent documentation

---

**Happy Ranting & Reflecting! 🎧✨**
