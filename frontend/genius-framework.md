My Genius Profile v1.0 Collaborative Development Specification Document
Project Duration: October 27, 2025 - February 16, 2026 (16 weeks)
Target Milestone: Beta Release Ready for Deployment
Organization: Village of Wisdom (VOW)

3. Technical Requirements
   3.1 Frontend Technical Specifications
   Responsible Role: Front-End Developer
   Technology Stack:
   Framework: React 18.x
   State Management: Context API (conversation state) + Local Storage (access codes)
   Styling: Tailwind CSS + Custom CSS for VOW branding
   Build Tool: Vite
   Testing: Jest + React Testing Library
   TR-FE-001: Component Architecture
   src/
   ├── components/
   │ ├── auth/
   │ │ ├── LoginForm.jsx
   │ │ ├── RegisterForm.jsx
   │ │ └── PasswordReset.jsx
   │ ├── chat/
   │ │ ├── ChatInterface.jsx
   │ │ ├── MessageBubble.jsx
   │ │ ├── InputArea.jsx
   │ │ └── TypingIndicator.jsx
   │ ├── profile/
   │ │ ├── ProfilePreview.jsx
   │ │ ├── ProfileSection.jsx
   │ │ └── ProgressIndicator.jsx
   │ ├── common/
   │ │ ├── Header.jsx
   │ │ ├── Footer.jsx
   │ │ ├── ErrorBoundary.jsx
   │ │ └── LoadingSpinner.jsx
   │ └── layout/
   │ ├── DualPaneLayout.jsx
   │ └── MobileLayout.jsx
   ├── contexts/
   │ ├── AuthContext.jsx
   │ └── ConversationContext.jsx
   ├── hooks/
   │ ├── useAuth.js
   │ ├── useConversation.js
   │ └── useWebSocket.js
   ├── services/
   │ ├── api.js
   │ └── websocket.js
   └── utils/
   ├── validators.js
   └── formatters.js
   TR-FE-002: API Integration Patterns
   Use Axios for HTTP requests
   Implement request/response interceptors for auth tokens
   Handle 401 unauthorized with automatic logout
   Retry logic for transient network failures (max 3 attempts)
   Loading states for all async operations
   TR-FE-003: WebSocket Integration
   Establish WebSocket connection on conversation start
   Reconnection logic with exponential backoff
   Heartbeat messages every 30 seconds
   Graceful degradation to polling if WebSocket unavailable
   TR-FE-004: Performance Requirements
   Initial page load: < 3 seconds on 3G connection
   Time to Interactive (TTI): < 5 seconds
   Lighthouse Performance Score: > 90
   Code splitting for route-based lazy loading
   Image optimization with lazy loading
   TR-FE-005: Browser Compatibility
   Chrome 90+
   Firefox 88+
   Safari 14+
   Edge 90+
   Mobile Safari (iOS 14+)
   Chrome Mobile (Android 10+)
   3.2 Backend Technical Specifications
   Responsible Role: Back-End Developer
   Technology Stack:
   Runtime: Node.js 20.x LTS
   Framework: Express 4.x
   Database: MongoDB Atlas (M10 cluster minimum for production)
   Authentication: Passport.js with JWT strategy
   AI Integration: Anthropic Claude API (Sonnet 4.5) or OpenAI GPT-4
   Email Service: SendGrid API
   File Storage: AWS S3 or Google Cloud Storage (for PDFs)
   Testing: Jest + Supertest
   TR-BE-001: API Architecture
   RESTful Endpoints:
   Authentication:
   POST /api/auth/register - Create new user account
   POST /api/auth/login - Authenticate user
   POST /api/auth/logout - Invalidate session
   POST /api/auth/refresh-token - Refresh JWT token
   POST /api/auth/forgot-password - Initiate password reset
   POST /api/auth/reset-password - Complete password reset

Conversations:
POST /api/conversations/start - Initialize new conversation
GET /api/conversations/:id - Retrieve conversation state
POST /api/conversations/:id/message - Send user message
PUT /api/conversations/:id/resume - Resume with access code
GET /api/conversations/:id/progress - Get completion percentage

Profiles:
GET /api/profiles/:id - Retrieve completed profile
GET /api/profiles/:id/download - Generate and download PDF
POST /api/profiles/:id/email - Email profile to user

Analytics:
POST /api/analytics/event - Track user interaction event
GET /api/analytics/summary - Admin: aggregate analytics
WebSocket Events:
Client → Server:

- user_message: { conversationId, message }
- typing_start: { conversationId }
- typing_stop: { conversationId }

Server → Client:

- ai_response: { message, profileUpdate, progress }
- ai_thinking: { status: "processing" }
- error: { code, message }
- profile_updated: { section, content }
  TR-BE-002: Database Schema (MongoDB)
  Users Collection:
  {
  \_id: ObjectId,
  email: String (indexed, unique),
  passwordHash: String,
  role: String (enum: ['student', 'parent', 'educator']),
  firstName: String,
  lastName: String,
  createdAt: Date,
  lastLogin: Date,
  emailVerified: Boolean,
  oauthProvider: String (optional),
  oauthId: String (optional)
  }
  Conversations Collection:
  {
  \_id: ObjectId,
  userId: ObjectId (ref: Users),
  accessCode: String (indexed, unique, 8-char alphanumeric),
  status: String (enum: ['in_progress', 'completed', 'abandoned']),
  currentElement: String (one of 6 Genius Elements),
  questionSequence: Number,
  messagesCount: Number,
  studentName: String,
  studentGrade: String,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date (nullable),
  expiresAt: Date (90 days from updatedAt)
  }
  Messages Collection:
  {
  \_id: ObjectId,
  conversationId: ObjectId (ref: Conversations),
  sender: String (enum: ['user', 'ai']),
  content: String,
  timestamp: Date,
  elementContext: String (current Genius Element),
  metadata: {
  processingTime: Number (ms),
  aiModel: String,
  tokensUsed: Number
  }
  }
  Profiles Collection:
  {
  \_id: ObjectId,
  conversationId: ObjectId (ref: Conversations, unique),
  userId: ObjectId (ref: Users),
  studentName: String,
  studentGrade: String,
  elements: {
  interestAwareness: String,
  racialCulturalPride: String,
  canDoAttitude: String,
  multiculturalNavigation: String,
  selectiveTrust: String,
  socialJustice: String
  },
  fullProfileText: String,
  generatedAt: Date,
  lastEmailedAt: Date (nullable),
  downloadCount: Number,
  pdfUrl: String (S3/GCS link)
  }
  Analytics Collection:
  {
  \_id: ObjectId,
  eventType: String (indexed),
  userId: ObjectId (ref: Users, nullable),
  conversationId: ObjectId (ref: Conversations, nullable),
  timestamp: Date (indexed),
  metadata: Object,
  sessionId: String,
  userAgent: String,
  ipAddress: String (hashed for privacy)
  }
  TR-BE-003: AI Integration Specifications
  Prompt Engineering Requirements:
  System prompt establishes culturally responsive persona
  Context includes: current Genius Element, previous responses, student age
  Temperature: 0.7 (balance consistency and natural variation)
  Max tokens: 500 per response
  Streaming enabled for real-time display
  AI Safety and Content Filtering:
  Input validation for inappropriate content
  Output moderation checks before displaying to user
  Fallback responses for AI service outages
  Rate limiting: 60 requests per minute per user
  AI Response Structure:
  {
  message: String, // Conversational response to user
  profileUpdate: { // Updates to apply to profile
  element: String,
  content: String
  },
  nextQuestion: String, // Next question to ask (if applicable)
  completionSignal: Boolean, // True if element section complete
  metadata: {
  confidence: Number, // AI confidence in response (0-1)
  tokensUsed: Number
  }
  }
  TR-BE-004: Security Requirements
  HTTPS only in production
  JWT tokens expire after 24 hours
  Refresh tokens expire after 30 days
  Password hashing: bcrypt with 12 rounds
  Rate limiting: 100 requests per 15 minutes per IP
  CORS configuration: Whitelist frontend domain only
  Input sanitization: All user inputs sanitized before processing
  SQL/NoSQL injection prevention: Parameterized queries only
  XSS protection: Content Security Policy headers
  CSRF tokens for state-changing operations
  TR-BE-005: Performance and Scalability
  API response time target: < 500ms (excluding AI processing)
  Database query optimization: Appropriate indexes on all query fields
  Caching strategy: Redis for session data and frequent queries
  Connection pooling: MongoDB connection pool size 10-50
  Horizontal scaling: Stateless API design for load balancing
  Monitoring: New Relic or Datadog integration
  3.3 AI Research & Refinement Technical Requirements
  Responsible Role: AI Research & Refinement Lead
  TR-AI-001: Conversation Flow Design
  Genius Elements Question Banks:
  Develop 5-7 questions per element (30-42 questions total pool)
  Create age-appropriate variants:
  Ages 3-5: Simple language, parent-led
  Ages 6-10: Elementary-level vocabulary
  Ages 11-14: Pre-teen/middle school appropriate
  Ages 15-18: High school/young adult language
  Question Sequencing Logic:
  Establish primary question path (18-question minimum)
  Define follow-up trigger conditions for unclear responses
  Create branch points for different age groups
  Design transition messages between Genius Elements
  TR-AI-002: Cultural Responsiveness Framework
  VOW Parent Fellow Validation Process:
  Conduct 4 focus groups (Early Childhood, K-8 Traditional, K-8 Alternative, High School)
  Test conversation flows with 20-30 families across demographics
  Collect feedback on:
  Language appropriateness and cultural resonance
  Question clarity and relevance
  AI persona warmth and authenticity
  Profile output accuracy and usefulness
  Cultural Affirmation Principles:
  Avoid deficit-based language ("struggles with" → "developing skills in")
  Recognize code-switching as a strength, not confusion
  Honor diverse family structures and caregiving arrangements
  Celebrate cultural identity and heritage connections
  Frame selective trust as wisdom, not defiance
  TR-AI-003: Prompt Engineering Standards
  System Prompt Template:
  You are a warm, culturally affirming guide helping families articulate their child's unique genius. You are speaking with [ROLE: student/parent/educator] about [STUDENT_NAME], a [GRADE]-grader.

Your goals:

1. Ask thoughtful questions about the 6 Genius Elements
2. Celebrate strengths and avoid deficit framing
3. Use age-appropriate language for [AGE_GROUP]
4. Build on previous responses to go deeper
5. Create a strengths-based profile educators will understand

Current Genius Element: [ELEMENT_NAME]
Previous responses summary: [CONTEXT]

Cultural responsiveness reminders:

- Recognize diverse family structures
- Honor cultural identity and heritage
- Frame code-switching as adaptability
- Celebrate selective trust as wisdom
- Avoid clinical or deficit language
  Dynamic Context Injection:
  Include last 3 Q&A pairs in prompt
  Inject summary of completed Genius Elements
  Add student demographic context (age, grade)
  Reference any stated preferences or concerns
  TR-AI-004: Profile Generation Guidelines
  Profile Synthesis Requirements:
  Aggregate all responses across 6 Genius Elements
  Generate cohesive narrative (not bullet points)
  Maintain strengths-based framing throughout
  Include specific examples from conversation
  Write in 3rd person for educator audience
  Target length: 500-800 words (100-150 words per element)
  Profile Quality Checks:
  No repetition of exact phrases from user responses
  No deficit language ("deficits," "struggles," "problems")
  Varied sentence structure (not formulaic)
  Coherent transitions between elements
  Actionable insights for educators
  TR-AI-005: Testing and Iteration Protocol
  Pre-Launch Testing:
  Week 1-2: Focus groups to test conversation flows
  Week 3-4: Individual family testing sessions (n=10)
  Week 5-6: Refinement based on feedback
  Week 7-8: Second round testing with updated flows
  Success Metrics:
  Conversation completion rate > 70%
  User satisfaction score > 4.0/5.0
  Profile accuracy rating by parents > 4.5/5.0
  Cultural responsiveness rating > 4.5/5.0
  Time to complete: 15-30 minutes average
