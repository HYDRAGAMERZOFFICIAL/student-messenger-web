import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret');
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (err) {
        res.status(400).json({ message: 'Error registering user' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (err) {
        res.status(400).json({ message: 'Error logging in' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map