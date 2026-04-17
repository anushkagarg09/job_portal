import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Find Your <span className="text-primary">Dream Job</span> Today
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Connecting talented professionals with top companies. Create an account, build your profile, and start applying to hundreds of latest jobs.
      </p>

      <div className="w-full max-w-3xl flex bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="flex-grow flex items-center pl-4">
            <Search className="text-gray-400 mr-2" size={24} />
            <input 
                type="text" 
                placeholder="Search for job title, keyword or company..." 
                className="w-full py-4 px-2 focus:outline-none text-gray-700"
            />
        </div>
        <button className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 transition-colors">
            Search
        </button>
      </div>

      <div className="mt-12 flex gap-4">
        <Link to="/signup" className="text-primary font-medium hover:underline">
            Are you a recruiter? Post a job instead.
        </Link>
      </div>
    </div>
  );
};

export default Home;
