import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const getExercises = db.prepare(`
                SELECT * FROM guitar_exercises WHERE user_id = ?
            `);
        const exercises = getExercises.all(req.userId);
        res.status(200).json({exercises});
    }   catch(err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({message: "fail"});
    }
    
});

router.post('/create_exercise', (req, res) => {
    try {
        const addExercise = db.prepare("INSERT INTO guitar_exercises(user_id, title, type, duration) VALUES(?, ?, ?, ?)");
        const result = addExercise.run(req.userId, req.body.title, req.body.type, req.body.duration);
        res.status(200).json({message: "success"});
    } catch(err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({message: "fail"});
    }
});

router.post('/update_exercise/:id', (req, res) => {
    try {
        const exerciseId = req.params.id;
        const completedValue = req.body.completed;
        const updateExercise = db.prepare(`
                UPDATE guitar_exercises SET completed = ? WHERE id = ?
            `);
        updateExercise.run(completedValue, exerciseId);
        res.status(200).json({message: "success"});
    } catch(err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({message: "fail"});
    }
});

router.post('/edit/:id', (req, res) => {
    try {
        const exerciseId = req.params.id;
        const editExercise = db.prepare(`
            UPDATE guitar_exercises SET title = ?, type = ?, duration = ? WHERE id = ?
            `);
        editExercise.run(req.body.title, req.body.type, req.body.duration, exerciseId);
        res.status(200).json({ message: "Exercise edited successfully."});
    } catch(err) {
        res.status(500).json({ message: "Could not edit exercise."});
    }
});

export default router;