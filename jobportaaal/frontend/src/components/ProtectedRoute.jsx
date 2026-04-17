import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && userInfo.role !== roleRequired) {
    // Redirect to their appropriate dashboard if they have the wrong role
    return <Navigate to={userInfo.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
