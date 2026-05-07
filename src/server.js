import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import authRoutes from './routes/authRoutes.js';
import exercisesRoutes from './routes/exercisesRoutes.js';
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5050;

const __filename = fileURLToPath(import.meta.url);
const __directoryname = path.dirname(__filename);
const publicPath = path.join(__directoryname, '../public');

app.use(express.static(publicPath, { index: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/auth');
    //res.sendFile(path.join(publicPath, 'auth.html'))
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.use('/auth', authRoutes);
app.use('/exercises', authMiddleware, exercisesRoutes);

app.listen(PORT, () => {
    console.log('Server is live')
});