import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import moment from 'moment';

const JobListing = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs(''));
  }, [dispatch]);

  if (loading) return <div className="text-center mt-20 text-xl text-primary font-semibold">Loading jobs...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Job Openings</h1>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-blue-100 text-primary rounded-lg flex items-center justify-center font-bold text-xl uppercase">
                     {job.company.charAt(0)}
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {job.experienceLevel}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                <h3 className="text-gray-600 font-medium mb-4">{job.company}</h3>
                
                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-2"><DollarSign size={16} /> ${job.salary.toLocaleString()} / year</span>
                  <span className="flex items-center gap-2"><Calendar size={16} /> {moment(job.createdAt).fromNow()}</span>
                </div>
              </div>
              
              <Link 
                to={`/jobs/${job._id}`}
                className="w-full text-center bg-gray-50 hover:bg-gray-100 text-primary font-semibold py-2 px-4 rounded-lg transition-colors"
               >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListing;
