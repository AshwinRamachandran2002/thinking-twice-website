import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '../components/Navbar';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      {/* Muted mango background with subtle gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.12),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(255,166,43,0.08),transparent_50%)]" />
      
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-[#ffa62b] hover:text-orange-600 underline">
          Return to Home
        </Link>
      </div>
      </div>
    </div>
  );
};

export default NotFound;
