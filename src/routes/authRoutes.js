import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../../public');

router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, '/auth.html'));
});

router.post('/register', (req, res) => {
    const {username, password} = req.body;
    try {
        const registerUser = db.prepare(`
            INSERT INTO users(username, password) VALUES(?,?)
            `);
        const hashedPassword = bcrypt.hashSync(password, 7);
        const result = registerUser.run(username, hashedPassword);
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.MY_SECRET);
        res.status(201).json({message: "success", token: token, userId: result.lastInsertRowid});
    } catch(err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({message: "fail"});
    }
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    try {
        const loginUser = db.prepare(`
            SELECT * FROM users WHERE username=?
            `);
        const user = loginUser.get(username);
        if(!user) return res.status(401).json({message: "No user found"});
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if(isPasswordCorrect) {
            const token = jwt.sign({id: user.id}, process.env.MY_SECRET);
            res.status(200).json({message: "success", token: token});
        }   else res.status(403).json({message: "Incorrect password"});
    } catch(err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({message: "fail"});
    }
});

export default router;