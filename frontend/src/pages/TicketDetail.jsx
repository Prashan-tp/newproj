import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket, useUpdateTicket, useDeleteTicket } from '../hooks/useTickets';
import { useComments, useCreateComment } from '../hooks/useComments';
import { format } from 'date-fns';
import './TicketDetail.css';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticket, isLoading, error } = useTicket(id);
  const { data: commentsData } = useComments(id);
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const createComment = useCreateComment(id);

  const [commentForm, setCommentForm] = useState({
    authorName: '',
    message: '',
  });
  const [commentErrors, setCommentErrors] = useState({});

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicket.mutateAsync({
        id,
        data: { status: newStatus },
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket.mutateAsync(id);
        navigate('/');
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const validateCommentForm = () => {
    const errors = {};
    
    if (!commentForm.authorName.trim()) {
      errors.authorName = 'Name is required';
    } else if (commentForm.authorName.length > 100) {
      errors.authorName = 'Name must be at most 100 characters';
    }

    if (!commentForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (commentForm.message.length > 500) {
      errors.message = 'Message must be at most 500 characters';
    }

    setCommentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!validateCommentForm()) {
      return;
    }

    try {
      await createComment.mutateAsync(commentForm);
      setCommentForm({ authorName: '', message: '' });
      setCommentErrors({});
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error loading ticket</h2>
          <p>{error.message}</p>
          <Link to="/" className="btn btn-primary">
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const comments = commentsData?.data || [];

  return (
    <div className="container">
      <div className="ticket-detail-page">
        <div className="breadcrumb">
          <Link to="/">Tickets</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{ticket.title}</span>
        </div>

        <div className="ticket-detail-card card">
          <div className="ticket-detail-header">
            <div className="ticket-detail-title-section">
              <h1>{ticket.title}</h1>
              <div className="ticket-badges">
                <span className={`badge badge-${ticket.status.toLowerCase().replace('_', '-')}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            
            <div className="ticket-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={deleteTicket.isPending}
              >
                {deleteTicket.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <div className="ticket-meta">
            <span>Created {format(new Date(ticket.createdAt), 'PPpp')}</span>
            {ticket.updatedAt !== ticket.createdAt && (
              <span>• Updated {format(new Date(ticket.updatedAt), 'PPpp')}</span>
            )}
          </div>

          <div className="ticket-description">
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>

          <div className="status-update-section">
            <h3>Update Status</h3>
            <div className="status-buttons">
              {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  className={`btn ${
                    ticket.status === status ? 'btn-primary' : 'btn-secondary'
                  } btn-sm`}
                  onClick={() => handleStatusChange(status)}
                  disabled={updateTicket.isPending || ticket.status === status}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="comments-section card">
          <h2>Comments ({comments.length})</h2>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="authorName" className="label">
                Your Name <span className="required">*</span>
              </label>
              <input
                id="authorName"
                type="text"
                className="input"
                value={commentForm.authorName}
                onChange={(e) => {
                  setCommentForm({ ...commentForm, authorName: e.target.value });
                  if (commentErrors.authorName) {
                    setCommentErrors({ ...commentErrors, authorName: '' });
                  }
                }}
                placeholder="Enter your name"
                maxLength={100}
                aria-invalid={!!commentErrors.authorName}
              />
              {commentErrors.authorName && (
                <div className="error-text" role="alert">{commentErrors.authorName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message" className="label">
                Comment <span className="required">*</span>
              </label>
              <textarea
                id="message"
                className="textarea"
                value={commentForm.message}
                onChange={(e) => {
                  setCommentForm({ ...commentForm, message: e.target.value });
                  if (commentErrors.message) {
                    setCommentErrors({ ...commentErrors, message: '' });
                  }
                }}
                placeholder="Add your comment..."
                rows={3}
                maxLength={500}
                aria-invalid={!!commentErrors.message}
              />
              <div className="char-count">{commentForm.message.length}/500</div>
              {commentErrors.message && (
                <div className="error-text" role="alert">{commentErrors.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={createComment.isPending}
            >
              {createComment.isPending ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="empty-comments">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong className="comment-author">{comment.authorName}</strong>
                    <span className="comment-date">
                      {format(new Date(comment.createdAt), 'PPpp')}
                    </span>
                  </div>
                  <p className="comment-message">{comment.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
