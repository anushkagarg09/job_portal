import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';

const RecruiterDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('postings');
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  // Job Post Form State
  const [jobForm, setJobForm] = useState({ title: '', description: '', company: userInfo.companyName || '', location: '', salary: '', experienceLevel: 'Mid', skillsRequired: '' });
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState('');

  // View Applicants State
  const [viewingJob, setViewingJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    if (activeTab === 'postings' && !viewingJob) {
      fetchMyJobs();
    }
  }, [activeTab, viewingJob]);

  const fetchMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.post('/jobs/my-jobs'); // using the detour route I created
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostMessage('');
    try {
      await api.post('/jobs', jobForm);
      setPostMessage({ type: 'success', text: 'Job posted successfully!' });
      setJobForm({ title: '', description: '', company: userInfo.companyName || '', location: '', salary: '', experienceLevel: 'Mid', skillsRequired: '' });
      setTimeout(() => setActiveTab('postings'), 2000);
    } catch(err) {
      setPostMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post job.' });
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchMyJobs();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleViewApplicants = async (job) => {
    setViewingJob(job);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      setApplicants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      // Update local state
      setApplicants(applicants.map(app => app._id === appId ? { ...app, status } : app));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="h-20 w-20 bg-primary text-white rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4 uppercase">
                 {userInfo.companyName ? userInfo.companyName.charAt(0) : userInfo.name.charAt(0)}
             </div>
             <h2 className="text-center font-bold text-lg text-gray-800">{userInfo.name}</h2>
             <p className="text-center text-sm font-medium text-primary mb-6">{userInfo.companyName}</p>
             
             <div className="space-y-2">
                 <button onClick={() => {setActiveTab('postings'); setViewingJob(null);}} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'postings' ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>My Jobs</button>
                 <button onClick={() => {setActiveTab('postNew'); setViewingJob(null);}} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'postNew' ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Post a Job</button>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
           {activeTab === 'postings' && !viewingJob && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-gray-800">My Job Postings</h2>
                       <button onClick={() => setActiveTab('postNew')} className="flex items-center gap-1 btn-primary text-sm py-1.5 px-3"><Plus size={16}/> New Job</button>
                   </div>
                   
                   {loadingJobs ? <p>Loading your jobs...</p> : jobs.length === 0 ? <p className="text-gray-500">You haven't posted any jobs yet.</p> : (
                       <div className="space-y-4">
                           {jobs.map(job => (
                               <div key={job._id} className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                                   <div>
                                       <h3 className="text-lg font-bold text-gray-900"><Link to={`/jobs/${job._id}`} className="hover:underline hover:text-primary">{job.title}</Link></h3>
                                       <p className="text-sm text-gray-500 mt-1">{job.location} • ${job.salary.toLocaleString()}/yr</p>
                                   </div>
                                   <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                       <button onClick={() => handleViewApplicants(job)} className="flex items-center gap-1 text-sm bg-blue-50 text-primary hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors"><Users size={16}/> Applicants</button>
                                       <button onClick={() => handleDeleteJob(job._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           )}

           {activeTab === 'postNew' && !viewingJob && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h2>
                   {postMessage && <div className={`p-3 rounded mb-6 ${postMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{postMessage.text}</div>}
                   <form onSubmit={handlePostJob} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                               <input type="text" required className="input-field" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="Software Engineer" />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Company</label>
                               <input type="text" required className="input-field" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                               <input type="text" required className="input-field" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="Remote, New York, etc."/>
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Salary (Yearly $)</label>
                               <input type="number" required className="input-field" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="120000" />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Experience Level</label>
                               <select className="input-field" value={jobForm.experienceLevel} onChange={e => setJobForm({...jobForm, experienceLevel: e.target.value})}>
                                   <option>Entry Level</option>
                                   <option>Mid Level</option>
                                   <option>Senior Level</option>
                                   <option>Director</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-2">Required Skills (Comma separated)</label>
                               <input type="text" className="input-field" value={jobForm.skillsRequired} onChange={e => setJobForm({...jobForm, skillsRequired: e.target.value})} placeholder="React, Node, MongoDB" />
                           </div>
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
                           <textarea required className="input-field h-40 resize-none" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Describe the role, responsibilities, and perks..."></textarea>
                       </div>
                       <button type="submit" disabled={posting} className="btn-primary w-full md:w-auto px-8">
                           {posting ? 'Posting...' : 'Post Job'}
                       </button>
                   </form>
               </div>
           )}

           {viewingJob && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                   <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                       <div>
                           <h2 className="text-2xl font-bold text-gray-800">Applicants for {viewingJob.title}</h2>
                           <p className="text-sm text-gray-500 mt-1">{applicants.length} candidates applied</p>
                       </div>
                       <button onClick={() => setViewingJob(null)} className="text-primary font-medium hover:underline">Back to Jobs</button>
                   </div>
                   
                   {loadingApplicants ? <p>Loading applicants...</p> : applicants.length === 0 ? <p className="text-gray-500">No applicants yet for this position.</p> : (
                       <div className="space-y-6">
                           {applicants.map(app => (
                               <div key={app._id} className="border border-gray-200 rounded-lg p-6">
                                   <div className="flex justify-between items-start mb-4">
                                       <div className="flex items-center gap-4">
                                           <div className="h-12 w-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                                               {app.applicant?.name.charAt(0)}
                                           </div>
                                           <div>
                                               <h3 className="text-lg font-bold text-gray-900">{app.applicant?.name}</h3>
                                               <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                                           </div>
                                       </div>
                                       <div>
                                           {app.status === 'applied' ? (
                                               <div className="flex gap-2">
                                                   <button onClick={() => handleUpdateStatus(app._id, 'shortlisted')} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded transition-colors">Shortlist</button>
                                                   <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded transition-colors">Reject</button>
                                               </div>
                                           ) : (
                                               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                   {app.status}
                                               </span>
                                           )}
                                       </div>
                                   </div>
                                   
                                   {app.applicant?.skills && app.applicant.skills.length > 0 && (
                                       <div className="mb-4">
                                           <p className="text-xs font-bold text-gray-500 uppercase mb-2">Skills</p>
                                           <div className="flex flex-wrap gap-1">
                                               {app.applicant.skills.map(s => <span key={s} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{s}</span>)}
                                           </div>
                                       </div>
                                   )}
                                   
                                   <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                                       {app.applicant?.resumeUrl && (
                                           <a href={`http://localhost:5000${app.applicant.resumeUrl}`} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">View Resume</a>
                                       )}
                                       <span className="text-gray-400">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard
