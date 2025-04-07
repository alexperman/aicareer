# 🧾 PRD: **Persona** (Working Title)

---

## ✨ TL;DR Summary (For Stakeholders)

> **Persona** is an AI-driven career companion that transforms raw work artifacts into structured, interactive career assets. It's chat-first, profile-centric, and monetizable through coaching, APIs, and talent discovery.

---

## 🎯 Goals

### Business Goals
- Showcase value of agentic UX through a useful career assistant
- Acquire and retain career-switchers, freelancers, and laid-off talent
- Unlock virality through shareable public profiles
- Monetize via coaching, premium UX, and talent tools

### User Goals
- Turn resumes, GitHub links, or portfolios into structured career graphs
- Understand strengths, gaps, and career positioning
- Simulate interviews and get actionable, specific feedback
- Build and share beautiful, public profiles
- Return frequently to refine and iterate their profile

### Non-Goals
- Not a job board or applicant tracking system
- Not a traditional resume builder

---

## 🧠 Defensibility Signals

- **Longitudinal data** on career progression (a unique, evolving profile)
- **Fine-tuned interview simulation** feedback loop
- **LangGraph modularity** opens up a future partner tool ecosystem
- **Career identity layer** that bridges raw user data with agentic memory

---

## 👥 User Personas

1. **Maya (Mid-Career Designer)**  
   Pivoting into product. Needs narrative polish + interview coaching.

2. **Leo (Recent Grad, No Resume)**  
   Has GitHub, Notion—but no resume. Wants to build from scratch.

3. **Jules (Freelancer with Many Gigs)**  
   Needs help turning scattered projects into a cohesive brand.

4. **Sam (Laid-Off Engineer)**  
   Seeks immediate polish + warm-up for fast interview cycles.

---

## 🧍‍♀️ User Stories

- I want to upload a resume or link to GitHub and get a usable career profile.
- I want help refining my story and discovering job-fit gaps.
- I want to simulate interviews tailored to my target roles.
- I want to publish role-specific versions of my profile.
- I want to track who’s viewing and sharing my public page.

---

## 🧭 UX Flow Diagram

```text
[ Upload Resume/GitHub ] 
      ↓
[ Agent Onboarding Chat ] 
      ↓
[ Skill Graph + Enriched Profile ] 
      ↓
[ Job Matching ↔ Interview Sim ] 
      ↓
[ Export + Publish Public Profile ]
```

---

## 📖 Narrative

**Meet Maya.** A talented designer aiming for product roles. She uploads an outdated resume, and the AI Companion kicks in—asking clarifying questions, identifying her transferable skills, and suggesting language that maps better to PM roles.

It flags 5 open roles aligned with her trajectory, runs a behavioral interview simulation, and gives feedback. After a few tweaks, Maya publishes a tailored version of her new profile—and starts getting inbound messages.

The AI Companion isn’t just a parser—it’s **a strategic career co-pilot**.

---

## 📊 Success Metrics

- Profile creation rate (% of uploads → profile built)
- Profile shares & link click-throughs
- Return sessions in 30 days
- Interview simulation feedback completion
- Skill accuracy feedback score
- % job matches saved/bookmarked
- Conversion to Pro for coaching/tools

---

## 🛠 Required Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **LangGraph Agent** | LangGraph | DAG-based orchestration of agent flows |
| Tool Runtime | MCP (Model Content Protocol) | Stateless tools over stdio/HTTP |
| Resume Parsing | spaCy + LangChain | Extract structured experience |
| LLMs | OpenAI, Anthropic | Chat UX, skill inference, interview sim |
| Job Matching | Embeddings + filters | Vector search + structured match |
| Frontend | React.js + Tailwind | Conversational UI, dashboards |
| Public Profiles | Next.js | Static export & CDN hosting |
| Storage | PostgreSQL, Redis, S3 | Profile, memory, files |
| Observability | Prometheus + Sentry | Tool + LLM monitoring |
| Security | AES-256, prompt protection | Safe LLM UX + opt-in data |

---

## 🧱 Design Patterns

### 🔁 LangGraph Orchestration
- Graph = nodes (tools) + memory state
- Branching logic for conditional flows (e.g. no resume → ask LinkedIn)
- Persistent session memory

### ⚙️ Modular Tools (MCP)
- Stateless micro-tools
- JSON I/O, health checks
- Example: `skill_inferencer.py`

```json
{
  "input": { "experiences": [...] },
  "output": {
    "skills": ["Prototyping", "Agile"],
    "confidence_scores": [0.9, 0.7]
  }
}
```

### 🎯 Deterministic vs. Generative Roles

| Feature | Tech |
|--------|------|
| Resume parsing | Deterministic NLP |
| Skill inference | LLM + embeddings |
| Interview simulation | Conversational LLM |
| Public profile writing | Generative LLM |
| Job matching | Hybrid (filters + semantic search) |

---

## 🧾 Technical Specifications

### LangGraph Flow
- Defined in Python
- Nodes = tools: parse, infer, match, simulate, publish
- Memory layer = Redis (short-term), Postgres (long-term)
- Preset workflows: “Job Seeker”, “Freelancer”, “Career Switcher”

### Job Matching
- OpenAI embeddings + Pinecone vector DB
- Hybrid filters: location, salary, keywords
- Configurable preference weights by user

### Interview Simulator
- Mode select: Behavioral, Technical, Case
- Feedback loop per response
- Optional role-specific scenarios (Google PM, FAANG SDE, etc.)

### Profile Export
- Supports multiple variants: “PM Profile”, “Freelance Profile”
- Custom domains (optional)
- View analytics dashboard

---

## 🔐 Security & Governance

- AES-256 encryption at rest
- Prompt injection protection + scoped memory
- User consent for inferred/enriched data
- LLM moderation of public copy
- Opt-in public publishing with preview

---

## 💰 Monetization Strategy

- **Pro Plan:** Interview sim, insights, profile variants
- **Talent Layer:** Recruiter tools, search, warm outreach
- **Partner Marketplace:** Add-ons (e.g., GitHub highlighter, resume grammar coach)
- **Long-Term:** White-label to bootcamps, career coaches

---

## 🪜 Milestones & Sequencing

### Phase 1 – MVP (XX weeks)
- Resume upload → parsing → profile builder
- Basic job match + single public export
- LangGraph orchestration MVP

### Phase 2 – Coaching + Memory (XX weeks)
- Interview simulator
- Redis memory integration
- Skill gap analysis & suggestion engine

### Phase 3 – Growth + Marketplace (XX weeks)
- Recruiter beta tools
- Partner tool plug-ins
- Multi-profile support + analytics

---

## 🧩 Optional Enhancements

### 1. **Highlight Agent Autonomy**
The agent is built to **adapt and recover** from off-script user interactions. If a user decides to engage outside of the predefined workflow (e.g., switching topics mid-interview), the agent can smoothly adjust by re-routing, referencing past steps in memory, or intelligently requesting clarifications.

### 2. **TAM Estimate**
The **career tooling market** is estimated at **$X billion**, with a strong overlap across resume builders, job boards, and coaching tools. We occupy a unique position at the intersection of all three, offering a full-stack solution for both users and recruiters.

### 3. **Public Profile Enhancement**
The public profile isn't just a static resume—it’s **interactive**. It includes:
- **Real-time edits** users can make to adjust their narrative.
- **Social elements** such as comments or "likes" from potential recruiters, peers, or mentors.
- **Behavioral analytics** that track who’s viewed and shared the profile, enabling virality.
- **Comparison with other public profiles** to benchmark user strengths and areas of improvement.

### 4. **Branding Hook: Persona**
We will brand this product as **Persona**—a nod to career identity and transformation. This name embodies the essence of crafting and refining one's professional narrative, while being catchy and memorable.

