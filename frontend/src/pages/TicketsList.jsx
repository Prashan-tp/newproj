import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { format } from 'date-fns';
import './TicketsList.css';

export default function TicketsList() {
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    priority: '',
    sort: 'newest',
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useTickets(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error loading tickets</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const tickets = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="container">
      <div className="tickets-list-page">
        <div className="page-header">
          <h1>Support Tickets</h1>
          <Link to="/tickets/new" className="btn btn-primary">
            Create Ticket
          </Link>
        </div>

        <div className="filters-section card">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search" className="label">Search</label>
              <input
                id="search"
                type="text"
                className="input"
                placeholder="Search by title or description..."
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                className="select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="priority" className="label">Priority</label>
              <select
                id="priority"
                className="select"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort" className="label">Sort By</label>
              <select
                id="sort"
                className="select"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No tickets found</div>
            <p className="empty-state-text">
              {filters.q || filters.status || filters.priority
                ? 'Try adjusting your filters'
                : 'Create your first ticket to get started'}
            </p>
            {!filters.q && !filters.status && !filters.priority && (
              <Link to="/tickets/new" className="btn btn-primary">
                Create Ticket
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="ticket-card"
                >
                  <div className="ticket-header">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <div className="ticket-badges">
                      <span className={`badge badge-${ticket.status.toLowerCase().replace('_', '-')}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p className="ticket-description">
                    {ticket.description.length > 150
                      ? `${ticket.description.substring(0, 150)}...`
                      : ticket.description}
                  </p>
                  <div className="ticket-footer">
                    <span className="ticket-date">
                      Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
