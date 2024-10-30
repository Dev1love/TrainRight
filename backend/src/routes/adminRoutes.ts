import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/users', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Admin route' });
});

export const adminRoutes = router; 