# Architecture Documentation

## High-Level Architecture

### System Overview
The Mini Support Desk is a full-stack web application built with a clear separation between frontend and backend components. The architecture follows modern best practices with a layered approach for maintainability and scalability.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Pages     │  │  Components  │  │    Hooks     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │ React Query │                      │
│                    └──────┬──────┘                      │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │  API Client │                      │
│                    └──────┬──────┘                      │
└───────────────────────────┼─────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────┼─────────────────────────────┐
│                    ┌──────▼──────┐                      │
│                    │   Routes    │                      │
│                    └──────┬──────┘                      │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │  Services   │   (Business Logic)   │
│                    └──────┬──────┘                      │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │Repositories │   (Data Access)      │
│                    └──────┬──────┘                      │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │   SQLite    │   (Database)         │
│                    └─────────────┘                      │
│                    Backend (Node.js)                    │
└─────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layer Design

The backend follows a three-layer architecture:

#### 1. Routes Layer (Controllers)
- **Responsibility**: Handle HTTP requests/responses, input validation
- **Location**: `src/routes/`
- **Key Features**:
  - Express route definitions
  - Request/response mapping
  - Middleware integration (validation, error handling)
  - No business logic

#### 2. Service Layer
- **Responsibility**: Business logic, orchestration
- **Location**: `src/services/`
- **Key Features**:
  - Domain operations
  - Transaction coordination
  - Error handling and validation
  - Independent of HTTP layer

#### 3. Repository Layer
- **Responsibility**: Data access and persistence
- **Location**: `src/repositories/`
- **Key Features**:
  - SQL query execution
  - Data mapping (DB ↔ Application models)
  - Database-specific logic
  - No business rules

### Why This Layering?

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Layers can be tested independently
3. **Maintainability**: Changes in one layer don't cascade
4. **Flexibility**: Can swap database or API framework with minimal changes

## Data Model Decisions

### Ticket Entity
```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK(status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
  priority TEXT CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Design Decisions**:
- **UUID as Primary Key**: Better for distributed systems, prevents enumeration attacks
- **Enum Constraints**: Database-level validation for status/priority
- **Timestamps**: Auto-managed creation and update times
- **Denormalized**: No separate user table (simplification for MVP)

### Comment Entity
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
```

**Design Decisions**:
- **Foreign Key with CASCADE**: Deleting a ticket removes all comments
- **Simple Author Model**: String name instead of user reference (MVP simplification)
- **Chronological Order**: Comments ordered by creation time

### Indexes
```sql
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
```

**Reasoning**:
- Filter and sort operations are common on status, priority, and date
- Foreign key lookups benefit from indexing

## Frontend Architecture

### State Management: React Query

**Why React Query?**
1. **Server State Management**: Perfect for API-driven apps
2. **Built-in Caching**: Reduces unnecessary API calls
3. **Optimistic Updates**: Better UX for mutations
4. **Loading/Error States**: Automatic state management
5. **Pagination Support**: Built-in pagination helpers

**Alternatives Considered**:
- **Redux**: Too heavy for this use case, overkill for server state
- **Zustand**: Better for client state, but React Query is superior for API data
- **Context API**: Would require manual implementation of caching, loading states

### Component Structure

```
src/
├── components/         # Reusable UI components
│   └── Header.jsx
├── pages/             # Route-level components
│   ├── TicketsList.jsx
│   ├── TicketDetail.jsx
│   └── CreateTicket.jsx
├── hooks/             # Custom React hooks
│   ├── useTickets.js
│   └── useComments.js
└── lib/               # Utilities
    └── api.js         # API client
```

**Feature-Based Organization**: As the app grows, move to feature folders:
```
src/
├── features/
│   ├── tickets/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/
│   └── comments/
│       ├── components/
│       └── hooks/
```

## Scalability Considerations

### Current Implementation

1. **Pagination**
   - Backend: Offset-based pagination
   - Default: 10 tickets, 20 comments per page
   - Prevents loading all data at once

2. **Search Performance**
   - Server-side search using SQL LIKE
   - Indexes on commonly searched fields
   - Could move to full-text search (FTS5) for better performance

3. **Database**
   - SQLite for simplicity
   - Single-file, embedded database
   - Good for <100K records

### Scaling to Production

#### Database Scaling
**Problem**: SQLite doesn't support concurrent writes well
**Solution**: Migrate to PostgreSQL
- Update repositories (minimal changes due to layering)
- Use connection pooling (pg-pool)
- Add read replicas for read-heavy workload

#### Search Scaling
**Problem**: LIKE queries slow with large datasets
**Options**:
1. **PostgreSQL Full-Text Search**: Good for <1M records
2. **Elasticsearch**: For advanced search, faceting, fuzzy matching
3. **Algolia**: Managed solution, fastest time-to-market

#### Application Scaling
**Horizontal Scaling**:
- Stateless API design enables load balancing
- Add Redis for session management if needed
- Use PM2 or Docker for multi-process deployment

#### Caching Strategy
```
Browser Cache (React Query)
        ↓
CDN (Static Assets)
        ↓
Redis Cache (API Responses)
        ↓
Database
```

**Implementation**:
- Add Redis for frequently accessed tickets
- Cache-aside pattern
- TTL: 5 minutes for ticket lists, 1 hour for resolved tickets

#### Performance Optimizations
1. **Query Optimization**:
   - Add compound indexes: `(status, priority, created_at)`
   - Use EXPLAIN QUERY PLAN to identify slow queries

2. **API Optimization**:
   - Implement ETags for conditional requests
   - Add compression middleware (gzip)
   - Rate limiting per IP/API key

3. **Frontend Optimization**:
   - Code splitting by route
   - Lazy load components
   - Virtual scrolling for long lists

## Reliability

### Error Handling Strategy

**Backend**:
```javascript
try {
  // Operation
} catch (error) {
  // Log error
  logger.error(error);
  // Return user-friendly message
  throw new AppError('User-friendly message', statusCode);
}
```

**Frontend**:
- React Query handles API errors
- Toast notifications for user feedback
- Graceful degradation (show partial data)

### Validation

**Multi-Layer Validation**:
1. **Client-Side**: Immediate feedback, better UX
2. **API Layer**: Zod schemas, prevents bad data
3. **Database**: Constraints, last line of defense

### Edge Cases Handled

1. **Concurrent Updates**: Last-write-wins (acceptable for MVP)
2. **Empty States**: Friendly messages, call-to-action
3. **Network Failures**: React Query retries, error messages
4. **Invalid UUIDs**: Validation middleware catches early
5. **Missing Resources**: 404 responses with helpful messages

### Monitoring (Production)

**Metrics to Track**:
- Request rate, response time
- Error rate by endpoint
- Database query performance
- Cache hit rate

**Tools**:
- Winston/Pino for logging
- Prometheus for metrics
- Sentry for error tracking

## Security Considerations

### Current Implementation

1. **Input Validation**: Zod schemas prevent injection
2. **SQL Injection**: Parameterized queries (prepared statements)
3. **CORS**: Configured for frontend origin
4. **Rate Limiting**: TODO for production

### Production Enhancements

1. **Authentication**: JWT or session-based auth
2. **Authorization**: Role-based access control (RBAC)
3. **HTTPS**: TLS/SSL for all traffic
4. **API Keys**: For programmatic access
5. **CSRF Protection**: For state-changing operations
6. **Helmet.js**: Security headers

## Tradeoffs

### What We Built
- ✅ Clean architecture with clear layers
- ✅ Input validation at multiple levels
- ✅ Pagination for scalability
- ✅ Comprehensive error handling
- ✅ Accessibility basics (ARIA labels, keyboard nav)

### What We Skipped (And Why)

1. **TypeScript**
   - **Tradeoff**: Development speed vs type safety
   - **Decision**: JavaScript for faster MVP, TS in production
   - **Impact**: Faster initial development, but more runtime errors

2. **Authentication**
   - **Tradeoff**: Security vs complexity
   - **Decision**: Skip for demo (would add JWT/sessions in production)
   - **Impact**: Anyone can create/edit tickets

3. **Real-time Updates**
   - **Tradeoff**: UX vs complexity
   - **Decision**: Polling/manual refresh instead of WebSockets
   - **Impact**: Users must refresh to see others' changes

4. **Soft Delete**
   - **Tradeoff**: Data recovery vs simplicity
   - **Decision**: Hard delete for simplicity
   - **Impact**: Deleted tickets cannot be recovered

5. **File Attachments**
   - **Tradeoff**: Feature richness vs scope
   - **Decision**: Text-only for MVP
   - **Impact**: Users can't attach screenshots/documents

6. **Email Notifications**
   - **Tradeoff**: Engagement vs infrastructure
   - **Decision**: No notifications in MVP
   - **Impact**: Users must check app for updates

7. **Comprehensive Testing**
   - **Tradeoff**: Quality vs time
   - **Decision**: Manual testing only
   - **Impact**: Regression risks, but faster delivery

8. **Docker/Deployment**
   - **Tradeoff**: Portability vs simplicity
   - **Decision**: Local development only
   - **Impact**: Manual setup required, not production-ready

## Future Enhancements

**Phase 2**:
- TypeScript migration
- Authentication & authorization
- Comprehensive test suite
- File attachments
- Email notifications

**Phase 3**:
- Real-time updates (WebSockets)
- Advanced search (Elasticsearch)
- Analytics dashboard
- Mobile app
- Ticket assignment & workflows

## Conclusion

This architecture provides a solid foundation that balances simplicity with scalability. The layered backend design allows for easy evolution, while React Query on the frontend provides excellent developer experience and performance. The system is production-ready with the enhancements outlined in the Security and Scaling sections.
