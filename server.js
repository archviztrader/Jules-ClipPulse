import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Mock video generation endpoint
app.post('/generate', (req, res) => {
    const { character, setting, lighting, mood, engine } = req.body;
    
    // Simulate processing time
    setTimeout(() => {
        const mockVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
        
        res.json({
            success: true,
            video_url: mockVideoUrl,
            metadata: {
                character,
                setting,
                lighting,
                mood,
                engine,
                duration: '5s',
                resolution: '1280x720'
            }
        });
    }, 2000);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ClipPulse backend is running' });
});

app.listen(PORT, () => {
    console.log(`ClipPulse backend server running on http://localhost:${PORT}`);
});