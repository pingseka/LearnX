import express from 'express';
import { authorsController } from '../controllers/authors.controller';

const router = express.Router();

router.get('/:id', authorsController.getPublicProfile);

export default router;
