import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-lg">
      <div className="max-w-6xl mx-auto py-4 gap-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl max-sm:text-2xl font-extrabold text-gray-900 tracking-tight"
        >
          <Zap className="inline max-sm:hidden h-8 w-8 text-amber-500 mr-2 mb-1" />
          <span className="text-indigo-700">Auto</span>Blog
        </Link>

        <div className="text-sm max-sm:text-xs font-medium text-indigo-700 text-center">
          Automated Content Generation Site
        </div>
      </div>
    </header>
  );
};

export default Header;
