import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { protect, isRecruiter } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs) // Public, but can also filter by myJobs for recruiters if protected
  .post(protect, isRecruiter, createJob);

router.post('/my-jobs', protect, isRecruiter, async (req, res) => {
    // Quick detour route just for recruiter's jobs
    req.query.myJobs = 'true';
    return getJobs(req, res);
});

router.route('/:id')
  .get(getJobById)
  .put(protect, isRecruiter, updateJob)
  .delete(protect, isRecruiter, deleteJob);

export default router;
