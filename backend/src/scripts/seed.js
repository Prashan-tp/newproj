import db, { initializeDatabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize database first
initializeDatabase();

// Clear existing data
db.exec('DELETE FROM comments');
db.exec('DELETE FROM tickets');

const tickets = [
  {
    id: uuidv4(),
    title: 'Login page not loading',
    description: 'When I try to access the login page, I get a blank screen. I have tried clearing my cache and using different browsers but the issue persists.',
    status: 'OPEN',
    priority: 'HIGH'
  },
  {
    id: uuidv4(),
    title: 'Unable to export reports',
    description: 'The export to PDF feature is not working on the reports page. When I click the export button, nothing happens. This is blocking my monthly reporting workflow.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM'
  },
  {
    id: uuidv4(),
    title: 'Profile picture upload fails',
    description: 'I am trying to upload a profile picture but getting an error message saying "File too large" even though my image is only 500KB. The documentation says files up to 5MB are supported.',
    status: 'RESOLVED',
    priority: 'LOW'
  },
  {
    id: uuidv4(),
    title: 'Search functionality returns incorrect results',
    description: 'The search feature is returning results that do not match my search query. For example, searching for "invoices" returns customer records instead. This is very confusing and makes it hard to find what I need.',
    status: 'OPEN',
    priority: 'HIGH'
  },
  {
    id: uuidv4(),
    title: 'Email notifications not being sent',
    description: 'I have enabled email notifications in my settings, but I am not receiving any emails when new tickets are assigned to me. I have checked my spam folder as well.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM'
  },
  {
    id: uuidv4(),
    title: 'Dashboard widgets not displaying data',
    description: 'The dashboard widgets are showing "No data available" even though there is data in the system. Refreshing the page does not help.',
    status: 'OPEN',
    priority: 'LOW'
  },
  {
    id: uuidv4(),
    title: 'Mobile app crashes on startup',
    description: 'The mobile application crashes immediately after opening on my Android device. I have tried reinstalling the app but the problem continues. Device model: Samsung Galaxy S21, Android version 13.',
    status: 'OPEN',
    priority: 'HIGH'
  },
  {
    id: uuidv4(),
    title: 'API rate limit too restrictive',
    description: 'The current API rate limit of 100 requests per minute is too low for our use case. We need to make about 500 requests per minute during peak hours. Can this be increased?',
    status: 'RESOLVED',
    priority: 'MEDIUM'
  },
  {
    id: uuidv4(),
    title: 'Two-factor authentication not working',
    description: 'I have set up two-factor authentication but I am not receiving the verification codes. I have tried with both SMS and authenticator app options.',
    status: 'IN_PROGRESS',
    priority: 'HIGH'
  },
  {
    id: uuidv4(),
    title: 'Feature request: Dark mode',
    description: 'It would be great to have a dark mode option in the application. This would be easier on the eyes during long working sessions, especially in low-light environments.',
    status: 'OPEN',
    priority: 'LOW'
  }
];

const insertTicket = db.prepare(`
  INSERT INTO tickets (id, title, description, status, priority, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))
`);

// Insert tickets with varied timestamps
tickets.forEach((ticket, index) => {
  const daysAgo = `-${index * 2} days`;
  insertTicket.run(
    ticket.id,
    ticket.title,
    ticket.description,
    ticket.status,
    ticket.priority,
    daysAgo,
    daysAgo
  );
});

// Add comments to some tickets
const comments = [
  {
    ticketId: tickets[0].id,
    authorName: 'John Doe',
    message: 'I am experiencing the same issue. This started happening after the latest update.'
  },
  {
    ticketId: tickets[0].id,
    authorName: 'Support Team',
    message: 'Thank you for reporting this. Our team is investigating the issue and will update you soon.'
  },
  {
    ticketId: tickets[1].id,
    authorName: 'Jane Smith',
    message: 'We have identified the root cause and are working on a fix. Expected resolution by end of day.'
  },
  {
    ticketId: tickets[2].id,
    authorName: 'Support Team',
    message: 'This issue has been fixed. Please try uploading your profile picture again.'
  },
  {
    ticketId: tickets[2].id,
    authorName: 'Original Reporter',
    message: 'Confirmed! The upload works now. Thank you for the quick fix!'
  },
  {
    ticketId: tickets[4].id,
    authorName: 'Tech Support',
    message: 'We found a configuration issue with the email service. Working on resolving it now.'
  }
];

const insertComment = db.prepare(`
  INSERT INTO comments (id, ticket_id, author_name, message, created_at)
  VALUES (?, ?, ?, ?, datetime('now', ?))
`);

comments.forEach((comment, index) => {
  const hoursAgo = `-${index * 3} hours`;
  insertComment.run(
    uuidv4(),
    comment.ticketId,
    comment.authorName,
    comment.message,
    hoursAgo
  );
});

console.log('✅ Database seeded successfully!');
console.log(`   Created ${tickets.length} tickets`);
console.log(`   Created ${comments.length} comments`);

process.exit(0);
