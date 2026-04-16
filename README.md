# CineQuest: The Human-Centric Movie Discovery Platform

![CineQuest Landing](/api/placeholder/1200/400)

CineQuest is a premium, full-stack cinematic exploration platform designed to solve "Choice Paralysis." It transforms raw metadata from The Movie Database (TMDB) into an intuitive, emotionally resonant discovery experience.

Developed as a Project-Based Examination for SYE3209: Software Construction at Uganda Christian University (Easter 2026 Semester).

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

## Key Features

- **Smart Mood Discovery**: A custom innovation that curates movies based on emotional states (e.g., "Adrenaline Rush", "Rainy Day Melancholy") rather than just static genres.
- **Cinematic Time Machine**: A high-fidelity discovery engine that allows users to travel through cinematic history (1888–2024) with era-specific visual filters and dynamic historical context.
- **Real-time Analytics**: Dynamic dashboard tracking trending titles and user preference matrices.
- **Advanced Semantic Search**: Resolves search visibility issues and handles complex query parameters with zero-crash fallbacks.
- **Secure Watchlist**: Persistently track "to-watch" lists and marked-viewing history.
- **Multi-Dimensional Discovery**: Explore via Genres, Trending Windows, and Top-Rated cinematic categories.

---

## Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion (Animations).
- **Backend**: Django REST Framework (DRF), Python 3.x.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Testing**: Jest & React Testing Library (Frontend), Django TestCase (Backend).
- **API**: Integrated with [TMDB v3 API](https://www.themoviedb.org/documentation/api).

---

## Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure Environment
cp .env.example .env  # Or create a .env file
# Add your TMDB_API_KEY and DJANGO_SECRET_KEY

# Prepare Database
python manage.py migrate
python manage.py sync_movies --genres
python manage.py sync_movies --trending 2

# Start Server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to start exploring.

---

## Quality Assurance

### Backend Unit Tests
We maintain 5 core unit tests covering Model integrity and URL constructors.
```bash
python manage.py test
```

### Frontend Component Tests
We maintain 3 behavioral tests using Jest for utility logic and UI rendering.
```bash
npm test
```

---

## Contributors & Work Distribution

Detailed work distribution, including specific code-file assignments for each member, can be found in the [**CONTRIBUTIONS.md**](./CONTRIBUTIONS.md) file.

**Technical Documentation:** Technical Report [**PDF/MD**](./Technical_Report.md)

---

## Academic Credentials
- **Course**: Software Construction (SYE3209)
- **Institution**: Uganda Christian University
- **Faculty**: Engineering, Design, and Technology
- **Department**: Computing and Technology
- **Date**: April 2026

---

## License
Released under the MIT License. For academic evaluation purposes only.
