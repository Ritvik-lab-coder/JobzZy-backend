import express from 'express'
import isAuthenticated from '../middlewares/authMiddleware.js';
import { getAllJobs, getJobById, getRecruiterJobs, postJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/get', isAuthenticated, getAllJobs);
router.get('/get-recruiter-jobs', isAuthenticated, getRecruiterJobs);
router.get('/get/:id', isAuthenticated, getJobById);

export default router;