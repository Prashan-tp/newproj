# Visual Application Guide

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     MINI SUPPORT DESK                        │
│                  http://localhost:3000                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      TICKETS LIST PAGE                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Filters: [Search] [Status▼] [Priority▼] [Sort▼]     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │ 🎫 Login page not loading      [HIGH]│                   │
│  │    When I try to access...     [OPEN]│ ──────┐          │
│  │    Created Feb 7, 2026               │       │          │
│  └──────────────────────────────────────┘       │          │
│                                                  │          │
│  ┌──────────────────────────────────────┐       │          │
│  │ 🎫 Export reports fails      [MEDIUM]│       │          │
│  │    The export to PDF...  [IN_PROGRESS│       │          │
│  │    Created Feb 5, 2026               │       ▼          │
│  └──────────────────────────────────────┘   Click opens     │
│                                             Ticket Detail    │
│  [Previous]  Page 1 of 2  [Next]                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TICKET DETAIL PAGE                        │
│  Tickets / Login page not loading                           │
│                                                              │
│  Login page not loading              [OPEN] [HIGH] [Delete] │
│  Created Feb 7, 2026 at 10:30 AM                           │
│                                                              │
│  Description:                                               │
│  When I try to access the login page, I get a blank        │
│  screen. I have tried clearing my cache...                  │
│                                                              │
│  Update Status:                                             │
│  [OPEN] [IN PROGRESS] [RESOLVED]  ← Click to change        │
│  ───────────────────────────────────────────────────────   │
│                                                              │
│  Comments (2):                                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Your Name]                                         │   │
│  │ [Comment text area...]                              │   │
│  │ [Add Comment]                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ John Doe          Feb 7, 2026 at 10:45 AM          │   │
│  │ I am experiencing the same issue...                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Support Team      Feb 7, 2026 at 11:00 AM          │   │
│  │ Thank you for reporting. We're investigating...     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
Frontend (React)                    Backend (Node.js)
─────────────────                   ─────────────────

┌──────────────┐                    ┌──────────────┐
│   Browser    │                    │   Express    │
│              │                    │   Server     │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │ HTTP Request                      │
       │ GET /api/tickets?status=OPEN      │
       ├──────────────────────────────────>│
       │                                   │
       │                            ┌──────▼───────┐
       │                            │    Routes    │
       │                            │  (tickets.js)│
       │                            └──────┬───────┘
       │                                   │
       │                                   │ Validate Query
       │                                   │ (Zod Schema)
       │                                   │
       │                            ┌──────▼───────┐
       │                            │   Services   │
       │                            │(ticketService│
       │                            └──────┬───────┘
       │                                   │
       │                                   │ Business Logic
       │                                   │
       │                            ┌──────▼───────┐
       │                            │ Repositories │
       │                            │(ticketRepo)  │
       │                            └──────┬───────┘
       │                                   │
       │                                   │ SQL Query
       │                                   │
       │                            ┌──────▼───────┐
       │                            │    SQLite    │
       │                            │   Database   │
       │                            └──────┬───────┘
       │                                   │
       │                                   │ Return Data
       │                                   │
       │   JSON Response                   │
       │   { tickets: [...] }              │
       │<──────────────────────────────────┤
       │                                   │
┌──────▼───────┐
│ React Query  │
│   (Cache)    │
└──────┬───────┘
       │
       │ Update State
       │
┌──────▼───────┐
│  Component   │
│   Re-render  │
└──────────────┘
```

## File Organization

```
mini-support-desk/
│
├── 📄 README.md              ← Start here!
├── 📄 ARCHITECTURE.md        ← Design decisions
├── 📄 PROJECT_SUMMARY.md     ← Quick overview
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/         ← Database setup
│   │   │   └── database.js
│   │   │
│   │   ├── 📁 routes/         ← API endpoints
│   │   │   ├── tickets.js
│   │   │   └── comments.js
│   │   │
│   │   ├── 📁 services/       ← Business logic
│   │   │   ├── ticketService.js
│   │   │   └── commentService.js
│   │   │
│   │   ├── 📁 repositories/   ← Database queries
│   │   │   ├── ticketRepository.js
│   │   │   └── commentRepository.js
│   │   │
│   │   ├── 📁 validators/     ← Zod schemas
│   │   │   └── schemas.js
│   │   │
│   │   ├── 📁 middleware/     ← Express middleware
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   │
│   │   ├── 📁 scripts/        ← Utilities
│   │   │   └── seed.js        ← Sample data
│   │   │
│   │   └── index.js           ← Server entry
│   │
│   ├── .env                   ← Configuration
│   └── package.json
│
└── 📁 frontend/
    ├── 📁 src/
    │   ├── 📁 components/     ← Reusable UI
    │   │   ├── Header.jsx
    │   │   └── Header.css
    │   │
    │   ├── 📁 pages/          ← Route components
    │   │   ├── TicketsList.jsx
    │   │   ├── TicketDetail.jsx
    │   │   └── CreateTicket.jsx
    │   │
    │   ├── 📁 hooks/          ← React Query hooks
    │   │   ├── useTickets.js
    │   │   └── useComments.js
    │   │
    │   ├── 📁 lib/            ← Utilities
    │   │   └── api.js         ← Axios client
    │   │
    │   ├── App.jsx            ← Router setup
    │   ├── main.jsx           ← Entry point
    │   └── index.css          ← Global styles
    │
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Request/Response Examples

### 1. Get All Tickets
```
Request:
GET /api/tickets?status=OPEN&priority=HIGH&page=1&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Login page not loading",
      "description": "When I try to access...",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2026-02-07T10:30:00Z",
      "updatedAt": "2026-02-07T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Create Ticket
```
Request:
POST /api/tickets
{
  "title": "New issue",
  "description": "Detailed description here with at least 20 characters",
  "priority": "MEDIUM"
}

Response:
{
  "success": true,
  "data": {
    "id": "new-uuid-here",
    "title": "New issue",
    "description": "Detailed description...",
    "status": "OPEN",
    "priority": "MEDIUM",
    "createdAt": "2026-02-07T12:00:00Z",
    "updatedAt": "2026-02-07T12:00:00Z"
  }
}
```

### 3. Add Comment
```
Request:
POST /api/tickets/{ticket-id}/comments
{
  "authorName": "John Doe",
  "message": "This is my comment on the ticket"
}

Response:
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "ticketId": "ticket-uuid",
    "authorName": "John Doe",
    "message": "This is my comment on the ticket",
    "createdAt": "2026-02-07T12:05:00Z"
  }
}
```

### 4. Error Response
```
Request:
POST /api/tickets
{
  "title": "Bad",  // Too short
  "description": "Short",  // Too short
  "priority": "URGENT"  // Invalid
}

Response:
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be at least 5 characters"
    },
    {
      "field": "description",
      "message": "Description must be at least 20 characters"
    },
    {
      "field": "priority",
      "message": "Priority must be LOW, MEDIUM, or HIGH"
    }
  ]
}
```

## State Management Flow (React Query)

```
User Action (e.g., Create Ticket)
        │
        ▼
┌─────────────────┐
│  Component      │
│  calls mutation │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Query    │
│  Mutation Hook  │
└────────┬────────┘
         │
         │ Makes API call
         ▼
┌─────────────────┐
│   API Client    │
│   (axios)       │
└────────┬────────┘
         │
         │ HTTP POST
         ▼
┌─────────────────┐
│   Backend API   │
│   Creates ticket│
└────────┬────────┘
         │
         │ Returns new ticket
         ▼
┌─────────────────┐
│  React Query    │
│  Updates cache  │
│  Invalidates    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Components     │
│  Re-render with │
│  new data       │
└─────────────────┘
```

## Testing Checklist

### ✅ Manual Testing Steps

**Tickets List:**
- [ ] All tickets display correctly
- [ ] Search filters tickets by title/description
- [ ] Status filter works (OPEN, IN_PROGRESS, RESOLVED)
- [ ] Priority filter works (LOW, MEDIUM, HIGH)
- [ ] Sort by newest/oldest works
- [ ] Pagination navigates correctly
- [ ] Empty state shows when no tickets match

**Create Ticket:**
- [ ] Form validation shows errors under 5 chars (title)
- [ ] Form validation shows errors under 20 chars (description)
- [ ] Character counters update correctly
- [ ] Can select priority
- [ ] Submit creates ticket and redirects
- [ ] Cancel button returns to list

**Ticket Detail:**
- [ ] Ticket details display correctly
- [ ] Status can be changed
- [ ] Delete works with confirmation
- [ ] Comments display in order
- [ ] Can add new comment
- [ ] Comment form validates

**API:**
- [ ] All endpoints return correct status codes
- [ ] Validation errors are clear
- [ ] 404 for non-existent tickets
- [ ] Pagination works correctly

## Quick Reference

### Common Tasks

**Start both servers:**
```bash
./start.sh
```

**Reseed database:**
```bash
cd backend
npm run seed
```

**Check API health:**
```bash
curl http://localhost:3001/health
```

**View all endpoints:**
```bash
curl http://localhost:3001/api
```

### Port Configuration

- Frontend: `3000` (Vite dev server)
- Backend: `3001` (Express server)
- Database: SQLite file (no port)

### Key URLs

- App: http://localhost:3000
- API: http://localhost:3001/api
- Health: http://localhost:3001/health
- Docs: http://localhost:3001/api
