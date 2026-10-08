```markdown
# AI-Powered Customer Operations System

An AI-powered customer operations system that automatically receives, analyzes, classifies, and routes customer requests. The system uses Claude AI to understand customer intent, priority, sentiment, and required actions, while keeping human review for sensitive or unclear requests.

## Overview

Customer support teams receive a wide range of requests, from simple questions to urgent complaints and refund requests. Handling every request manually can be time-consuming and inconsistent.

This project automates the initial customer operations process:

- Receives customer requests through a webhook
- Validates incoming requests
- Finds existing customers or creates new customer records
- Uses Claude AI to analyze customer requests
- Classifies intent, priority, and sentiment
- Decides whether human review is required
- Automatically responds to simple requests
- Escalates sensitive or unclear requests to the operations team
- Stores customer and request information in Supabase
- Provides an operations dashboard for monitoring

## Architecture

```text
Customer Request
       │
       ▼
   Webhook
       │
       ▼
Validate Request
       │
       ▼
Find Customer
       │
       ▼
Customer Exists?
     /       \
   Yes        No
    │          │
    ▼          ▼
Customer    Create
Context     Customer
    │          │
    └────┬─────┘
         ▼
   Create Request
         │
         ▼
Claude Request Analyst
         │
         ▼
  Analysis Fields
         │
         ▼
 Save AI Analysis
         │
         ▼
Needs Human Review?
       /      \
     Yes       No
      │         │
      ▼         ▼
Escalate     Auto Handle
to Team          │
      │           ▼
      │     Send Customer Reply
      │           │
      ▼           ▼
Notify        Update Request
Operations    (Resolved Auto)
Team
      │
      ▼
Update Request
(Pending Review)
```

## Tech Stack

| Technology | Purpose |
|---|---|
| **n8n** | Workflow automation and orchestration |
| **Claude AI** | Customer request analysis and routing decisions |
| **Supabase** | Customer and request database |
| **Gmail** | Customer replies and internal notifications |
| **Webhook / APIs** | Customer request intake and data exchange |
| **Next.js** | Dashboard frontend |
| **React** | UI development |
| **TypeScript** | Frontend development |
| **Tailwind CSS** | Dashboard styling |
| **Vercel** | Dashboard deployment |
| **Git & GitHub** | Version control |
| **Antigravity** | AI-assisted frontend development |

## Key Features

### 1. Customer Request Intake

The system accepts customer requests through a POST webhook.

Example request:

```json
{
  "name": "Nibhi",
  "email": "gargnibhi@gmail.com",
  "subject": "Urgent refund request",
  "message": "I received a damaged product and I want a refund immediately."
}
```

### 2. Customer Identification

The workflow searches the Supabase `customers` table using the customer's email.

- If the customer exists, their existing information is reused.
- If the customer does not exist, a new customer record is created automatically.

### 3. AI Request Analysis

Claude analyzes the customer request using the customer information, request details, and predefined business knowledge.

The AI returns:

- **Intent**
- **Priority**
- **Sentiment**
- **Summary**
- **Recommended action**
- **Human review requirement**
- **Missing information**

### 4. Automated vs Human Handling

The system decides how the request should be handled.

#### Automatic Handling

Simple questions that can be answered confidently using the available business knowledge are handled automatically.

For example:

> "What are your store timings?"

The system generates a customer-facing response and sends it through Gmail.

#### Human Review

Sensitive, unclear, high-risk, or incomplete requests can be escalated to the operations team.

For example:

> "I received a damaged product and want a refund immediately."

The operations team receives an internal Gmail notification containing the AI analysis and original customer message.

### 5. Supabase Database

The system uses Supabase as the operational data source.

#### Customers Table

```text
id
name
email
created_at
```

#### Requests Table

```text
id
customer_id
email
message
intent
priority
sentiment
summary
recommended_action
human_review_required
status
created_at
updated_at
```

### 6. Gmail Communication

Gmail is used for two types of communication:

- Customer-facing replies for automatically handled requests
- Internal notifications for requests requiring human review

### 7. Operations Dashboard

The project includes a Next.js dashboard for monitoring customer operations.

The dashboard provides:

- Request overview
- Customer request queue
- Request status
- Priority
- Intent
- Sentiment
- Human-review filtering
- Request details
- Customer directory
- Search and filtering

### Dashboard

**Live Dashboard:**  
https://customer-operations-ai.vercel.app/

## Business Rules

Claude is provided with predefined business knowledge, including:

### Store

- Monday–Saturday: 10 AM–8 PM
- Sunday: Closed
- Customer support: Monday–Saturday, 9 AM–6 PM

### Returns

- Returns are accepted within 7 days of delivery.
- Damaged products are eligible for return.
- Customers should provide their order number and photos of the damaged product.
- Refunds above ₹10,000 require human approval.

### Shipping

- Standard delivery: 3–7 business days
- Express delivery: 1–2 business days

### Refunds

- Refunds are returned to the original payment method.
- Refund processing normally takes 5–7 business days.

The AI is instructed not to invent business information and to request human review when sufficient information is not available.

## Example Workflow

### Human Review Example

**Customer request:**

```text
I received a damaged product and I am very unhappy.
I want a refund immediately.
```

Claude can identify:

```text
Intent: Refund
Priority: High
Sentiment: Negative
Human Review: Required
```

The operations team then receives an internal notification with the relevant customer and request information.

### Automatic Handling Example

**Customer request:**

```text
Hi, I would like to know your store timings.
```

The AI can answer this using the provided business knowledge, so the request is automatically handled and a response is sent to the customer.

## Error and Edge Case Handling

The workflow includes handling for:

- Invalid or incomplete customer requests
- New customers
- Missing information
- Sensitive or high-risk requests
- AI/API failures
- Human-review cases

Invalid requests are stopped during validation instead of continuing through the complete workflow.

AI/API failures appear as failed workflow executions in n8n rather than being treated as successful decisions.

## Security

- Supabase secret credentials are kept server-side in n8n.
- The frontend uses only the Supabase publishable/anonymous key.
- Environment variables are used for configuration.
- `.env.local` is excluded from Git.
- API keys and secrets are not committed to GitHub.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nibhi16/customer-operations-ai.git
cd customer-operations-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit `.env.local` or any secret credentials.

### 4. Run the development server

```bash
npm run dev
```

The dashboard will be available at:

```text
http://localhost:3000
```

## n8n Workflow

The main automation workflow is called:

```text
Customer Operations AI
```

The workflow connects the webhook, validation, Supabase, Claude, Gmail, and routing logic into a single customer operations pipeline.

## Testing

The system was tested using:

1. Human-review refund requests
2. Automatic store-information requests
3. New customer requests
4. Invalid/incomplete input
5. Missing information

The workflow was verified through n8n execution history, Gmail notifications, Supabase records, and the dashboard.

### Human Review Test

A damaged-product refund request was submitted with high urgency and negative sentiment.

Expected behaviour:

```text
Intent → Refund
Priority → High
Sentiment → Negative
Human Review → Required
```

The request was escalated to the operations team, an internal Gmail notification was sent, and the request was marked as `Pending Review`.

### Automatic Handling Test

A customer asked:

```text
Hi, I would like to know your store timings.
```

The request was classified as a simple information request and handled automatically using the provided business knowledge. A customer reply was sent through Gmail and the request was marked as `Resolved Auto`.

### New Customer Test

A request from an email address that was not already present in Supabase was tested.

The workflow:

1. Searched for the customer
2. Found no existing record
3. Created a new customer
4. Created the request
5. Sent the request to Claude for analysis
6. Continued through the appropriate routing path

## Deployment

The Next.js dashboard is deployed using Vercel.

**Dashboard:**  
https://customer-operations-ai.vercel.app/

The source code is maintained in GitHub.

## Project Goal

The goal of this project was to build an end-to-end AI-assisted customer operations system where AI handles predictable requests while keeping humans involved when decisions require additional judgement.

The system combines workflow automation, AI decision-making, database management, email communication, and operational monitoring into one workflow.
```
