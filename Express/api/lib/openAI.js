import { OpenAI } from "openai/client.js"
dotenv.config({});

client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

audio_file