import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, isCandidate, isRecruiter } from '../middlewares/auth.js';

const router = express.Router();

// Candidate Routes
router.post('/:jobId/apply', protect, isCandidate, applyForJob);
router.get('/my-applications', protect, isCandidate, getMyApplications);

// Recruiter Routes
router.get('/job/:jobId', protect, isRecruiter, getJobApplications);
router.put('/:id/status', protect, isRecruiter, updateApplicationStatus);

export default router;
