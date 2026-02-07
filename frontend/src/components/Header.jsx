import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">Mini Support Desk</span>
          </Link>
          
          <nav className="header-nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Tickets
            </Link>
            <Link 
              to="/tickets/new" 
              className={`nav-link ${location.pathname === '/tickets/new' ? 'active' : ''}`}
            >
              Create Ticket
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
