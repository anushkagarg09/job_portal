import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../redux/slices/jobSlice';
import api from '../services/api';
import { Briefcase, MapPin, DollarSign, Calendar, Target, ChevronLeft } from 'lucide-react';
import moment from 'moment';

const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { job, loading, error } = useSelector((state) => state.jobs);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage(null);
    try {
      await api.post(`/applications/${id}/apply`);
      setApplyMessage({ type: 'success', text: 'Application submitted successfully!' });
    } catch (err) {
      setApplyMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading job details...</div>;
  if (error || !job) return <div className="text-center mt-20 text-red-500">{error || 'Job not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/jobs" className="text-primary hover:underline flex items-center mb-6">
        <ChevronLeft size={20} /> Back to Jobs
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex justify-between items-start mb-6 align-top">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-primary font-semibold mb-4">{job.company}</p>
          </div>
          {userInfo?.role === 'candidate' && (
             <button 
                onClick={handleApply}
                disabled={applying}
                className="btn-primary"
             >
                {applying ? 'Applying...' : 'Apply Now'}
             </button>
          )}
          {userInfo?.role === 'recruiter' && job.postedBy?._id === userInfo._id && (
              <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded">Your Posting</span>
          )}
        </div>
        
        {applyMessage && (
            <div className={`p-4 mb-6 rounded-md ${applyMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {applyMessage.text}
            </div>
        )}

        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600"><MapPin /> {job.location}</div>
          <div className="flex items-center gap-2 text-gray-600"><DollarSign /> ${job.salary.toLocaleString()}/year</div>
          <div className="flex items-center gap-2 text-gray-600"><Calendar /> {moment(job.createdAt).fromNow()}</div>
          <div className="flex items-center gap-2 text-gray-600"><Target /> {job.experienceLevel}</div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
          </div>
        </div>

        {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {job.skillsRequired.map((skill, index) => (
                     <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                         {skill}
                     </span>
                 ))}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
