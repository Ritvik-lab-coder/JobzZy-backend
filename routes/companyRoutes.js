import express from 'express'
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/companyControllers.js';
import isAuthenticated from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/company-update/:id', singleUpload, isAuthenticated, updateCompany);

export default router;