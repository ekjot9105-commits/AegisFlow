import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs text-textSecondary mb-4 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-white transition-colors flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1">
        <Home size={12} className="mr-1" /> Platform
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const title = value.replace(/-/g, ' ');

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={12} className="mx-1 opacity-50" />
            {last ? (
              <span className="text-white font-medium capitalize" aria-current="page">{title}</span>
            ) : (
              <Link to={to} className="hover:text-white transition-colors capitalize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1">
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
