import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary font-bold text-xl gap-2">
              <Briefcase size={24} />
              JobPorta<span className="text-secondary">al</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {userInfo ? (
              <>
                <span className="text-gray-600 font-medium">Hello, {userInfo.name}</span>
                <Link to={userInfo.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard'} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                  <User size={18} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
