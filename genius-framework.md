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
confidence: Number, // AI confidence in responscccccbije (0-1)
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
