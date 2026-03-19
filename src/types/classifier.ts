export interface IntentBucket {
  id: string;
  name: string;
  description: string;
  confidenceThreshold: number;
  temperature: number;
  status: 'active' | 'draft' | 'disabled';
  examples: string[];
  signals: string[];
  ragResponse: string;
  followUpQuestions: string;
}

export type BucketSection = 'definition' | 'examples' | 'signals' | 'rag' | 'followup';

export const BUCKET_SECTIONS: { key: BucketSection; label: string }[] = [
  { key: 'definition', label: 'Definition' },
  { key: 'examples', label: 'Examples' },
  { key: 'signals', label: 'Signal Words' },
  { key: 'rag', label: 'RAG Response' },
  { key: 'followup', label: 'Follow-up Questions' },
];

export const SAMPLE_BUCKETS: IntentBucket[] = [
  {
    id: '1',
    name: 'Billing & Payments',
    description: 'Queries related to invoices, subscriptions, payment methods, and pricing changes.',
    confidenceThreshold: 8,
    temperature: 0.4,
    status: 'active',
    examples: [
      'How do I upgrade my subscription?',
      'Can I pay with PayPal?',
      'Where is my latest invoice?',
      'Why was I charged twice?',
    ],
    signals: ['pricing', 'billing', 'invoice', 'upgrade', 'payment', 'credit card', 'subscription'],
    ragResponse: 'You are a billing support specialist. When responding to billing queries:\n1. Always verify the customer\'s account status first\n2. Provide specific pricing details when available\n3. Link to the billing portal for self-service actions\n4. Escalate complex refund cases to human agents',
    followUpQuestions: 'After resolving a billing query, ask:\n- "Is there anything else regarding your account I can help with?"\n- "Would you like me to set up automatic payment reminders?"',
  },
  {
    id: '2',
    name: 'Technical Support',
    description: 'Queries about bugs, errors, API issues, and technical troubleshooting.',
    confidenceThreshold: 7,
    temperature: 0.3,
    status: 'active',
    examples: [
      'My API calls are returning 500 errors',
      'The dashboard won\'t load',
      'How do I reset my API key?',
    ],
    signals: ['error', 'bug', 'API', 'crash', 'broken', 'not working', 'debug'],
    ragResponse: 'You are a technical support agent. Prioritize:\n1. Identifying the error type and scope\n2. Checking for known issues\n3. Providing step-by-step troubleshooting\n4. Collecting diagnostic information if escalation is needed',
    followUpQuestions: 'After troubleshooting:\n- "Has this resolved your issue?"\n- "Would you like me to create a support ticket for further investigation?"',
  },
  {
    id: '3',
    name: 'Account Management',
    description: 'Queries about account settings, profile updates, and access control.',
    confidenceThreshold: 8,
    temperature: 0.5,
    status: 'draft',
    examples: [
      'How do I change my email address?',
      'I want to add a team member',
      'How do I enable two-factor authentication?',
    ],
    signals: ['account', 'profile', 'settings', 'password', 'team', '2FA', 'permissions'],
    ragResponse: 'You are an account management specialist. Follow these guidelines:\n1. Verify user identity through established protocols\n2. Guide users through self-service options first\n3. Document all account changes made',
    followUpQuestions: 'After account changes:\n- "Would you like to review your security settings?"\n- "Is there anything else about your account you\'d like to update?"',
  },
  {
    id: '4',
    name: 'Product Onboarding',
    description: 'Queries from new users about getting started, setup, and initial configuration.',
    confidenceThreshold: 7,
    temperature: 0.6,
    examples: [
      'How do I get started?',
      'What should I set up first?',
      'Is there a quickstart guide?',
    ],
    signals: ['getting started', 'setup', 'onboarding', 'new', 'first time', 'tutorial', 'guide'],
    ragResponse: 'You are an onboarding specialist. Your goal is to:\n1. Assess the user\'s experience level\n2. Provide a personalized onboarding path\n3. Highlight key features relevant to their use case',
    followUpQuestions: 'During onboarding:\n- "What is your primary use case?"\n- "Would you like a guided tour of the dashboard?"',
  },
];

export const SAMPLE_MAIN_PROMPT = `You are an intelligent query intent classifier for a SaaS customer support platform. Your role is to analyze incoming user queries and route them to the most appropriate intent bucket based on the content, context, and language signals present in the message.

Classification Rules:
1. Analyze the semantic meaning of the query, not just keyword matching
2. Consider the user's likely intent and desired outcome
3. If a query could match multiple buckets, choose the one with the highest contextual relevance
4. Assign a confidence score (0-100) for each classification
5. If no bucket matches with sufficient confidence, route to the "General Inquiry" fallback

Output Format:
{
  "intent": "<bucket_name>",
  "confidence": <score>,
  "reasoning": "<brief explanation>"
}

Important: Always maintain a professional, helpful tone. Never expose internal routing logic to end users.`;
