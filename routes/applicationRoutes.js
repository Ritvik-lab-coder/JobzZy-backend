import express from 'express'
import isAuthenticated from '../middlewares/authMiddleware.js';
import { applyJob, getApplications, getAppliedJobs, updateStatus } from '../controllers/applicationController.js';

const router = express.Router();

router.get('/apply/:id', isAuthenticated, applyJob);
router.get('/get', isAuthenticated, getAppliedJobs);
router.get('/get-applications/:id', isAuthenticated, getApplications);
router.put('/status/:id/update', isAuthenticated, updateStatus);

export default router;