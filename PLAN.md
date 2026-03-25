# MicroLearningApp — Project Plan

## Vision
Personal Deepstash clone — bite-sized knowledge cards from books, articles, and podcasts.

## MVP (v0.1)
- **Cards feed:** Browse idea cards extracted from books
- **Books/Sources:** Organize cards by book/source
- **Collections:** Group cards by topic
- **Card detail:** Expand a card for more context
- **Responsive PWA:** Installable on mobile

## v0.2
- Personal notes on cards
- Create your own cards
- Bookmarks/favorites

## v0.3
- Gamification (streaks, reading stats)
- Daily digest (random cards)

## Future
- AI-powered: auto-extract ideas from articles/URLs/PDFs
- Import from Kindle highlights
- Spaced repetition

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma (simple, no external DB needed)
- **Deployment:** Self-hosted on Axel's server or Vercel
- **PWA:** next-pwa

## Data Model
- **Book** (id, title, author, coverUrl, category)
- **Card** (id, bookId, content, title, emoji, order)
- **Collection** (id, name, description, emoji)
- **CardCollection** (cardId, collectionId)
- **UserNote** (id, cardId, content, createdAt) — v0.2
- **Favorite** (id, cardId, createdAt) — v0.2

## Seed Data
- Start with 3-5 popular books, ~10 cards each
- Books: Atomic Habits, Deep Work, Thinking Fast & Slow, The Psychology of Money, Sapiens
