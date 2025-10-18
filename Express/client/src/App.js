import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const mediaRecorderRef = useRef(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cleanup recorder on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setStatus('requesting-mic');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setChunks([]);

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setChunks(prev => [...prev, e.data]);
        }
      };

      mr.onstop = async () => {
        try {
          setStatus('uploading');
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const form = new FormData();
          form.append('audio', blob, 'recording.webm');

          const res = await fetch('/api/transcribe', { method: 'POST', body: form });
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || 'Upload failed');
          setResult(json);
          setStatus('done');
        } catch (err) {
          setError(err.message || String(err));
          setStatus('error');
        }
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setStatus('recording');
      setRecording(true);
    } catch (err) {
      setError(err.message || String(err));
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="App" style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Rant & Reflect 🎧</h1>
      <p>Press record, speak for a few seconds, then stop to transcribe and analyze emotion.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={startRecording} disabled={recording || status === 'requesting-mic'}>
          {status === 'requesting-mic' ? 'Requesting mic…' : 'Start Recording'}
        </button>
        <button onClick={stopRecording} disabled={!recording}>Stop</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ textAlign: 'left' }}>
          <h3>Result</h3>
          <p><strong>Transcription:</strong> {result.text}</p>
          <p><strong>Emotion:</strong> {result.emotion} {result.confidence ? `(intensity ${result.confidence})` : ''}</p>
          <p style={{ color: '#666' }}>
            {result.timestamp} • {result.processingTime} • {result.fileSize}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
