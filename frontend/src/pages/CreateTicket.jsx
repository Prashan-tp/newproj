import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTicket } from '../hooks/useTickets';
import './CreateTicket.css';

export default function CreateTicket() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.title.length < 5 || formData.title.length > 80) {
      newErrors.title = 'Title must be between 5 and 80 characters';
    }

    if (formData.description.length < 20 || formData.description.length > 2000) {
      newErrors.description = 'Description must be between 20 and 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const ticket = await createTicket.mutateAsync(formData);
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="container">
      <div className="create-ticket-page">
        <div className="page-header">
          <h1>Create New Ticket</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-group">
              <label htmlFor="title" className="label">
                Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                maxLength={80}
                aria-describedby={errors.title ? 'title-error' : undefined}
                aria-invalid={!!errors.title}
              />
              <div className="char-count">
                {formData.title.length}/80 characters
              </div>
              {errors.title && (
                <div id="title-error" className="error-text" role="alert">
                  {errors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the issue..."
                rows={6}
                maxLength={2000}
                aria-describedby={errors.description ? 'description-error' : undefined}
                aria-invalid={!!errors.description}
              />
              <div className="char-count">
                {formData.description.length}/2000 characters
              </div>
              {errors.description && (
                <div id="description-error" className="error-text" role="alert">
                  {errors.description}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="label">
                Priority <span className="required">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                className="select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <div className="help-text">
                Choose the urgency level of this issue
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createTicket.isPending}
              >
                {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
