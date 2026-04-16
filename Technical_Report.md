# CineQuest - Technical Restoration Report

**Prepared For:** Software Construction Examination (SYE3209)
**Project Name:** CineQuest Movie Discovery Platform
**Date:** April 2026

---

## Group Members - Team 10

| Reg Number | Name |
| :--- | :--- |
| M23B23/006 | GENO Owor Joshua |
| S23B23/057 | SSEBATTA Allan Kagimu |
| S23B23/046 | NZIRIGA Isaac Nickson |
| S24B23/032 | OWINO Esther |
| S24B23/069 | MUSOKE Nestroy |
| M24B23/024 | NABUUMA Andrea |
| S24B23/016 | KAYONGO Aloysious |
| M23B23/010 | MUWANGUZI Priscila Denise |
| M24B23/013 | MUGOYA Andrew |
| M23B23/026 | MWEBEMBEZI Nicole Mbabazi |

---

## 1. Introduction
The CineQuest Movie Discovery Platform is a full-stack Next.js and Django application designed to provide users with an engaging mechanism for exploring cinematic content. Initially, the project repository was in a broken, non-functional state characterized by misconfigured backend settings, faulty TypeScript schemas, semantic routing errors, and non-operational interfaces.

This report outlines the systematic restoration of the CineQuest platform, documenting the identification of critical limitations, the implementation of sophisticated software engineering fixes, refactoring of legacy code, and the integration of a novel "Smart Mood Discovery" feature. The primary objective of this undertaking was to elevate the application to production-ready standards by enforcing rigorous coding practices, ensuring end-to-end type safety, and instituting comprehensive test coverage.

---

## 2. Evaluation of Limitations & Resolution Strategies

Upon initial analysis of the fragmented repository, the team identified and resolved several critical limitations.

### 2.1 Backend Misconfigurations & Security
- **Limitation**: The Django application failed to boot due to improperly named modules (`movie` vs `movies`), absent Cross-Origin Resource Sharing (CORS) configurations, and critical security vulnerabilities (hardcoded `SECRET_KEY`).
- **Resolution**: The team modified `settings.py` to securely load the secret key via python-decouple `.env` variables. We implemented `django-cors-headers` to permit cross-origin requests from the Next.js frontend development server (`localhost:3000`). Application namespace anomalies were corrected within `INSTALLED_APPS`, allowing migration and synchronization commands to execute successfully.

### 2.2 API Semantic & Structural Failures
- **Limitation**: Core search (`movies/search_movies`) and trending API endpoints were arbitrarily restricted to `POST` requests despite being idempotent retrieval operations, violating RESTful paradigms and causing 405 Method Not Allowed exceptions.
- **Resolution**: The view constraints were redecorated to accept `GET` requests, and the team refactored redundant computational logic while instituting standard query parameter structures. 

### 2.3 Frontend Rendering & Type Violations
- **Limitation**: In Next.js, crucial data layers collapsed due to improper state initialization (state expecting Arrays received undefined objects) causing fatal length-checking UI errors. Additionally, `WatchlistItem` lacked proper TypeScript declaration, yielding severe transpilation blocks.
- **Resolution**: Definitive interfaces were created within `types/movie.ts`. The team audited all occurrences of search logic to implement null-coalescing fallbacks (`data.results || []`), entirely neutralizing the blank-screen visibility bug.

### 2.4 Dashboard Synchronization & User Interactions
- **Resolution**: The team implemented a robust bidirectional synchronization layer. Frontend handlers were refactored to asynchronously transmit interaction events via `recommendationsAPI.trackInteraction` and `recommendationsAPI.addToWatchlist`. Additionally, a server-side state hydration step was added to the detail view initialization, ensuring that the interface remains consistent with the backend database for all authenticated sessions.

### 2.5 Security Audit & Environmental Integrity
- **Limitation**: A comprehensive security audit revealed that the application was vulnerable to environment-failure scenarios due to hardcoded fallbacks for the `SECRET_KEY` in `settings.py`. Additionally, user session persistence was limited to active tabs (sessionStorage).
- **Resolution**: The team solidified the backend security by removing insecure fallbacks and enforcing strict environment variable checks. We further conducted an authentication audit, documenting recommendations for moving toward `localStorage` or `HttpOnly` cookies to improve user retention and cross-session persistence.

---

## 3. Code Refactoring & Quality Enhancements

In accordance with clean code methodologies, the legacy codebase underwent extensive refactoring to improve maintainability and readability.

- **View Layer Deflation**: The `dashboard_stats` function originally contained overly convoluted aggregation queries, evaluating likes, dislikes, and preference weightings in a single monolithic block exceeding 100 lines. 
- **Service Extraction**: The team neutralized this "Fat Controller" code smell by abstracting the querying logic into a dedicated `DashboardService` class. This refactor reduced the view function to declarative invocations, drastically boosting the modularity, reusability, and readability of the application.
- **Maintainability Integrations**: The Service layer was fully annotated with standard Python docstrings, clarifying the input expectations and expected response dictionary structures for future development teams.

---

## 4. Testing & Quality Assurance

To guarantee system resilience, the group integrated automated testing suites on both architectural flanks:
- **Backend (Django `TestCase`)**: We authored five distinct unit tests simulating object behavior and property method generation on the `Genre`, `Person`, `Movie`, and `WatchProvider` datasets.
- **Frontend (Jest & React Testing Library)**: The team engineered an extensive Jest evaluation layer assessing utility string-formatting algorithms alongside snapshot-equivalent render verifications for core UI modules.

## 5. Innovation Sparks (Group Contributions)

### 5.1 Smart Mood Discovery
- **Problem Solved**: Traditional genre exploration forces users to categorize their desires broadly. The team developed the Smart Mood system to bypass analytical choices, allowing users to query recommendations through emotional states (e.g., "Adrenaline Rush", "Date Night").
- **Implementation Strategy**: A bidirectional matrix was architected spanning both the frontend UI and the backend API. Impactful frontend tiles transmit emotional slug tags downstream into a custom backend handler. The Django layer subsequently maps this semantic input to algorithmic TMDB classifications.

### 5.2 Cinematic Time Machine (Lead: Geno)
- **Concept**: A high-fidelity discovery engine that allows users to travel through cinematic history (1888–2024). This feature provides unique historical context for every year and utilizes era-responsive UI themes to match the aesthetic of the chosen time period.
- **Atmospheric Immersion**: The team engineered a bespoke "Temporal DNA" layer that applies era-specific visual filters. This includes **Grayscale Flicker** for the Silent Era, **Vignetted Sepia** for the Golden Age, and **Cathode-Ray Scanlines** for the Digital/Retro eras.
- **Dynamic Background Logic**: We implemented a reactive backdrop system that fetches and blurs the year's "Box Office Titan" poster in real-time, creating a localized, immersive cinematic environment for every year visited.
- **Architectural Mapping**: We implemented a dedicated `TimeMachineService` on the backend that algorithmically categorizes films into distinct cultural buckets. On the frontend, an immersive Timeline component was developed using Framer Motion to facilitate seamless "Time Travel" transitions.

### 5.3 Hands-Free Global Voice Navigation
- **Inclusion & Accessibility**: To bridge the accessibility gap for users with motor impairments, the team engineered a comprehensive **Voice Navigation System**. This system utilizes the Web Speech API to provide hands-free control over the entire platform.
- **Semantic Command Engine**: We implemented a custom `useVoiceNavigation` hook capable of parsing natural language intents. Users can navigate use semantic phrases such as *"Take me home"*, *"Show my stats"*, or *"Browse categories"* to trigger complex route transitions.
- **Integrated Voice Search**: The system uniquely bridges navigation and discovery. Users can execute active searches by commanding the assistant to *"Search for [Movie Title]"*, which automatically opens the modal, populates the query, and fetches results without requiring a single keystroke.
- **Visual Feedback System**: A bespoke `VoiceWaves` animation component was developed to provide real-time visual confirmation of the assistant's listening state, maintaining a premium, "smart-home" aesthetic.

---

## 6. Conclusion
The CineQuest project transitions from an inoperative codebase into a secure, thoroughly tested, and modularly resilient full-stack platform. The restoration process performed by the team validates strict adherence to modern Web Architecture paradigms, bridging Next.js performance components with robust Django services. The inclusion of **Integrated Voice Discovery** and the **Cinematic Time Machine** demonstrates the group's technical versatility in delivering both high-performance backend systems and innovative, accessible frontend experiences.
