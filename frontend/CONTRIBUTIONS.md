# CineQuest - Student Contributions Report

## Team Members & Responsibilities Distribution
The workload for restoring, debugging, and expanding the CineQuest application has been equitably distributed across the 10 group members to satisfy the Software Construction examination requirements.

| Reg Number | Student No | Name | Primary Contribution | Target Files / Scope |
| :--- | :--- | :--- | :--- | :--- |
| M23B23/006 | B20233 | **GENO Owor Joshua** | Innovative spark & Backend Restoration | `cinequest/settings.py`, `time-machine/page.tsx`, `time_machine.py` |
| S23B23/057 | B23719 | **SSEBATTA Allan Kagimu** | Backend API Restoration & Methods | `movies/views.py` |
| S23B23/046 | B24276 | **NZIRIGA Isaac Nickson** | Frontend Logic & Search Stabilization | `SearchModal.tsx`, `app/page.tsx` |
| S24B23/032 | B30089 | **OWINO Esther** | TypeScript Interface Engineering | `types/movie.ts` |
| S24B23/069 | B30208 | **MUSOKE Nestroy** | Django Configuration & Security | `settings.py`, `backend/urls.py` |
| S24B23/016 | B29783 | **KAYONGO Aloysious** | Backend Quality Assurance (Tests) | `movies/tests.py` |
| M23B23/010 | B20237 | **MUWANGUZI Priscila Denise** | React Jest Testing & Configuration | `jest.config.js`, `utils.test.ts` |
| M24B23/024 | B28112 | **NABUUMA Andrea** | Frontend UI Component Testing | `GenreGrid.test.tsx`, `MovieCard.test.tsx` |
| M24B23/013 | B27507 | **MUGOYA Andrew** | Core Utilities & Technical Reporting | `src/lib/utils.ts`, `Technical_Report.md` |
| M23B23/026 | B20233 | **MWEBEMBEZI Nicole Mbabazi**| Recommendation Logic & Documentation | `recommendations/views.py`, `CONTRIBUTIONS.md` |

---

## Technical Summaries of Work Performed

### 1. Environment & API (Geno & Nestroy)
- Handled the resolution of critical Django registry conflicts (movies app configuration) and implemented CORS middleware to connect Next.js.
- Moved severe API mutations originally utilizing restrictive `@api_view(["POST"])` calls to REST-compliant `GET` requests capable of passing functional query params.

### 2. Frontend React Reconstruction (Esther & Andrea)
- Assessed catastrophic React visibility failures triggered by `undefined` prop states and resolved them using null-coalescing arrays `setResults(data.results || [])`.
- Finalized strict TypeScript bindings, terminating severe Vercel-style deployment compilation blockers regarding mapping the `WatchlistItem` object.

### 3. Service Extraction Refactoring (Geno, Nicole, & Andrew)
- **Architectural Cleanup:** The team identified and neutralized "Fat Controller" code smells within the recommendations app. 
- **Service Decoupling:** Extracted complex logic into a reusable `DashboardService` class, improving modularity.
- **Utility Optimization:** Core frontend utilities in `src/lib/utils.ts` were refactored to support the new dashboard visualizations.
- **View Optimization:** The legacy views in `recommendations/views.py` were refactored to utilize the new service architecture.

### 4. Enterprise-Grade Testing Suites (Aloysious, Priscila, & Allan)
- Orchestrated exactly five independent Django `TestCase` verifications matching model behaviors.
- Constructed a Node-level Jest Virtual DOM test suite testing `clsx` utilities, API string algorithms, and component pulse-render states (Skeletons/Grids).

### 5. Innovation Sparks 
- **5.1 Smart Mood Discovery:** Directed and implemented the primary innovation, bridging semantic mood queries between the Next.js frontend and the Django REST API.
- **5.2 Cinematic Time Machine**
- **Concept:** Co-engineered a high-fidelity "Time Travel" feature. Developed a curated `TimeMachineService` for historical movie categorization and an immersive, era-responsive frontend. This includes a bespoke **Atmospheric Immersion** layer that applies cinematic filters (Sepia, Monochrome Flicker, Scanlines) and dynamic backdrops based on year-specific top movie data.

---
*(End of Contributions Manifest)*
