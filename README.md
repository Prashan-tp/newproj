# Mini Support Desk

A full-stack web application for managing support tickets, built with React and Node.js.

## Features

- ✅ Create, view, update, and delete support tickets
- ✅ Comment system for ticket collaboration
- ✅ Advanced filtering (status, priority, search)
- ✅ Sorting and pagination
- ✅ Responsive design
- ✅ Real-time form validation
- ✅ Optimistic UI updates
- ✅ Clean, accessible interface

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite** - Database (better-sqlite3)
- **Zod** - Schema validation
- **Morgan** - HTTP logging

## Project Structure

```
mini-support-desk/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access
│   │   ├── validators/     # Validation schemas
│   │   ├── middleware/     # Express middleware
│   │   └── scripts/        # Utility scripts
│   └── package.json
│
├── ARCHITECTURE.md          # Architecture documentation
└── README.md               # This file
```

## Prerequisites

- Node.js 18+ and npm

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-support-desk
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database and seed data
npm run seed

# Start development server
npm run dev
```

The backend will run on **http://localhost:3001**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:3000**

### 4. Access the Application

Open your browser and navigate to **http://localhost:3000**

## API Documentation

Once the backend is running, visit **http://localhost:3001/api** for API documentation.

### Key Endpoints

#### Tickets
- `GET /api/tickets` - List all tickets (supports filtering, sorting, pagination)
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

#### Comments
- `GET /api/tickets/:id/comments` - List comments for a ticket
- `POST /api/tickets/:id/comments` - Add a comment to a ticket

### Query Parameters

#### GET /api/tickets
- `q` - Search query (searches title and description)
- `status` - Filter by status (OPEN, IN_PROGRESS, RESOLVED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH)
- `sort` - Sort order (newest, oldest)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example**:
```
GET /api/tickets?status=OPEN&priority=HIGH&sort=newest&page=1&limit=10
```

## Scripts

### Backend

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Data Models

### Ticket
```javascript
{
  id: "uuid",
  title: "string (5-80 chars)",
  description: "string (20-2000 chars)",
  status: "OPEN | IN_PROGRESS | RESOLVED",
  priority: "LOW | MEDIUM | HIGH",
  createdAt: "datetime",
  updatedAt: "datetime"
}
```

### Comment
```javascript
{
  id: "uuid",
  ticketId: "uuid",
  authorName: "string (1-100 chars)",
  message: "string (1-500 chars)",
  createdAt: "datetime"
}
```

## Design Decisions

### State Management: React Query

React Query was chosen for the following reasons:
- **Automatic caching** - Reduces unnecessary API calls
- **Built-in loading/error states** - Simplifies UI state management
- **Optimistic updates** - Better user experience
- **Invalidation** - Easy cache management
- **DevTools** - Excellent debugging experience

### Validation: Zod

Zod provides:
- **Type-safe schemas** - TypeScript-first design
- **Composable validation** - Reusable schemas
- **Detailed error messages** - Better UX
- **Runtime type checking** - Catches errors early

### Database: SQLite

SQLite is ideal for this project because:
- **Zero configuration** - No separate database server
- **Portability** - Single file database
- **Performance** - Fast for small to medium datasets
- **ACID compliance** - Reliable transactions

**Migration Path**: The repository pattern makes it easy to migrate to PostgreSQL if needed.

## Architecture Highlights

### Backend Layers

1. **Routes** - HTTP request handling and validation
2. **Services** - Business logic and orchestration
3. **Repositories** - Data access and persistence

This separation provides:
- Clear responsibilities
- Easy testing
- Flexibility to swap implementations

### Error Handling

- **Client-side validation** - Immediate feedback
- **Server-side validation** - Data integrity
- **User-friendly errors** - Clear error messages
- **Proper HTTP status codes** - RESTful design

### Accessibility

- ARIA labels on form inputs
- Keyboard navigation support
- Semantic HTML elements
- Clear focus indicators
- Error announcements with `role="alert"`

## Development

### Adding a New Feature

1. **Backend**:
   - Add validation schema in `validators/schemas.js`
   - Create repository methods in `repositories/`
   - Add service methods in `services/`
   - Create routes in `routes/`

2. **Frontend**:
   - Add API methods in `lib/api.js`
   - Create React Query hooks in `hooks/`
   - Build UI components
   - Add routes if needed

### Code Style

- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic
- Follow existing patterns

## Testing

Currently, the application uses manual testing. For production:

### Recommended Testing Strategy

**Backend**:
- Unit tests: Services and repositories
- Integration tests: API endpoints
- Tools: Jest, Supertest

**Frontend**:
- Component tests: React Testing Library
- E2E tests: Playwright or Cypress
- Tools: Vitest, Testing Library

## Production Deployment

### Backend

1. Set `NODE_ENV=production`
2. Use a process manager (PM2)
3. Migrate to PostgreSQL
4. Add authentication
5. Implement rate limiting
6. Enable HTTPS

### Frontend

1. Build: `npm run build`
2. Serve static files from `dist/`
3. Configure CDN for assets
4. Set up proper CSP headers

### Environment Variables

**Backend (.env)**:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
```

**Frontend**:
Configure API URL in Vite config for production.

## Troubleshooting

### Backend won't start
- Ensure Node.js 18+ is installed
- Check if port 3001 is available
- Verify `.env` file exists
- Run `npm install` again

### Frontend won't connect to API
- Ensure backend is running on port 3001
- Check Vite proxy configuration
- Clear browser cache

### Database errors
- Delete `database.sqlite` and run `npm run seed` again
- Check file permissions

## Future Enhancements

- [ ] TypeScript migration
- [ ] User authentication
- [ ] File attachments
- [ ] Real-time updates (WebSockets)
- [ ] Email notifications
- [ ] Advanced search (Elasticsearch)
- [ ] Ticket assignment
- [ ] SLA tracking
- [ ] Analytics dashboard
- [ ] Mobile app

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For questions or issues, please create an issue in the repository.
