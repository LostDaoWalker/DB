# Cozy Critters — Animal RPG Discord Bot (JS)

An animal-themed **autobattler RPG** Discord bot built with **Discord.js**, **Components v2**, **SQLite** (fast, local persistence), and **Canvas** battle cards.

## Setup

1) Install Node.js (recommended: **Node 20+**)

2) Install dependencies:

```bash
npm install
```

3) Create `.env` from the example:

```bash
cp .env.example .env
```

Fill in:
- `DISCORD_TOKEN` (your bot token)
- `CLIENT_ID` (application id)
- optional `GUILD_ID` (dev server id for fast command registration)

4) Register slash commands:

```bash
npm run register:commands
```

5) Run the bot:

```bash
npm run start
```

## Commands

- `/start`: choose your animal (your class)
- `/profile`: view level, XP, and stats
- `/battle`: quick cozy autobattle vs an NPC + Canvas battle card
