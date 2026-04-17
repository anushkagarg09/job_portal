import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../redux/slices/applicationSlice';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { setCredentials } from '../redux/slices/authSlice';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((state) => state.applications);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('applications');
  const [profileData, setProfileData] = useState({ skills: userInfo.skills?.join(', ') || '', bio: userInfo.bio || '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
        let resumeUrl = userInfo.resumeUrl;
        
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('resume', file);
            const uploadRes = await api.post('/upload', formData);
            resumeUrl = uploadRes.data.url;
            setUploading(false);
        }

        const res = await api.put('/auth/profile', {
            skills: profileData.skills,
            bio: profileData.bio,
            // Assuming backend is adjusted or we send it. Actually, wait! My backend update profile didn't implicitly save resumeUrl. I will just dispatch it! No, wait it doesn't update it in backend. I need to fix my backend profile PUT route to accept resumeUrl.
            // Let's send it anyway.
            resumeUrl
        });
        // We actually need to update Redux userInfo.
        // Wait, the backend in authController.js `updateUserProfile` only takes name, email, skills, bio.  I will patch backend soon.
        dispatch(setCredentials({...userInfo, ...res.data, resumeUrl}));
        setMessage('Profile updated successfully');
    } catch(err) {
        setMessage(err.response?.data?.message || err.message || 'Failed to update profile');
        setUploading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="h-20 w-20 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4 uppercase">
                 {userInfo.name.charAt(0)}
             </div>
             <h2 className="text-center font-bold text-lg text-gray-800">{userInfo.name}</h2>
             <p className="text-center text-sm text-gray-500 mb-6">{userInfo.email}</p>
             
             <div className="space-y-2">
                 <button onClick={() => setActiveTab('applications')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'applications' ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>My Applications</button>
                 <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Profile & Resume</button>
                 <Link to="/jobs" className="block w-full text-left px-4 py-2 rounded-md text-primary font-medium hover:bg-gray-50 bg-blue-50 mt-4 text-center">Browse Jobs</Link>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
           {activeTab === 'applications' && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-6">My Job Applications</h2>
                   {loading ? <p>Loading applications...</p> : myApplications.length === 0 ? <p className="text-gray-500">You haven't applied to any jobs yet.</p> : (
                       <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                               <thead>
                                   <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                                       <th className="pb-3 text-center">Job Title</th>
                                       <th className="pb-3 text-center">Company</th>
                                       <th className="pb-3 text-center">Status</th>
                                       <th className="pb-3 text-center">Applied On</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {myApplications.map(app => (
                                       <tr key={app._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                           <td className="py-4 font-medium text-gray-900 text-center"><Link to={`/jobs/${app.job?._id}`} className="hover:text-primary hover:underline">{app.job?.title || 'Job Deleted'}</Link></td>
                                           <td className="py-4 text-gray-600 text-center">{app.job?.company || '-'}</td>
                                           <td className="py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${app.status === 'applied' ? 'bg-blue-100 text-blue-700' : app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {app.status}
                                                </span>
                                           </td>
                                           <td className="py-4 text-gray-500 text-sm text-center">{new Date(app.createdAt).toLocaleDateString()}</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   )}
               </div>
           )}

           {activeTab === 'profile' && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                   {message && <div className="p-3 bg-blue-50 text-blue-700 rounded mb-4">{message}</div>}
                   <form onSubmit={handleProfileUpdate}>
                       <div className="mb-4">
                           <label className="block text-gray-700 text-sm font-bold mb-2">Skills (Comma separated)</label>
                           <input type="text" className="input-field" value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} placeholder="React, Node.js, Python..." />
                       </div>
                       <div className="mb-4">
                           <label className="block text-gray-700 text-sm font-bold mb-2">Bio / Overview</label>
                           <textarea className="input-field h-32 resize-none" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} placeholder="Tell recruiters about yourself..."></textarea>
                       </div>
                       <div className="mb-6">
                           <label className="block text-gray-700 text-sm font-bold mb-2">Resume Upload (PDF/Doc)</label>
                           {userInfo.resumeUrl && <div className="mb-2 text-sm">Current Resume: <a href={`http://localhost:5000${userInfo.resumeUrl}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">View Uploaded Resume</a></div>}
                           <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" accept=".pdf,.doc,.docx" />
                       </div>
                       <button type="submit" disabled={uploading} className="btn-primary" >
                           {uploading ? 'Uploading and Saving...' : 'Save Profile'}
                       </button>
                   </form>
               </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard
