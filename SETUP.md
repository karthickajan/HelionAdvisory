# Helion Decap CMS Setup Guide

## Files to add to repo

```
repo/
├── admin/
│   ├── index.html        ← Decap admin UI
│   └── config.yml        ← post field definitions
├── posts/
│   ├── most-late-problems-in-biotech-actually-start-early.md
│   ├── platform-products-dont-fail-in-the-lab.md
│   ├── why-strong-data-doesnt-save-a-weak-development-narrative.md
│   └── the-most-dangerous-words-in-drug-development.md
├── posts-loader.js       ← fetches + parses markdown
├── index-perspectives-snippet.js  ← replaces hardcoded cards
└── blog.html             ← replace existing blog.html
```

---

## Step 1 — Push all files to GitHub

Upload all the above files to the HelionAdvisory repo maintaining the folder structure.

---

## Step 2 — Enable Netlify Identity

1. Go to app.netlify.com
2. Click "Add new site" → "Import an existing project" → Connect to GitHub → select HelionAdvisory repo
3. Build settings: leave blank (no build command, publish directory = /)
4. Deploy site
5. Go to Site Settings → Identity → Enable Identity
6. Under Registration → set to "Invite only"
7. Under Git Gateway → Enable Git Gateway
8. Invite Senthil: Identity tab → Invite users → enter senthil@helionadvisory.net

---

## Step 3 — Update index.html Perspectives section

Find the hardcoded Perspectives cards grid in index.html.
Add an `id="perspectivesGrid"` to the grid container div.
Add `id="perspectivesViewAll"` to the "View All" button/link.

Before the closing </body> tag add:
```html
<script src="posts-loader.js"></script>
<script src="index-perspectives-snippet.js"></script>
```

Also add Netlify Identity widget to <head>:
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

---

## Step 4 — Test

1. Go to helionadvisory.net/blog.html — posts should load
2. Go to helionadvisory.net/admin — Decap CMS admin should appear
3. Log in with Senthil's email (he'll get an invite email to set password)
4. Create a test post → publish → verify it appears on blog.html

---

## How Senthil uses it

1. Go to helionadvisory.net/admin
2. Log in with email + password
3. Click "Perspectives" in sidebar
4. Click "New Perspectives" to create
5. Fill in: Title, Category (dropdown), Read Time, Body (rich text editor)
6. Toggle "Visible" off to hide without deleting
7. Click "Publish" — post goes live in ~30 seconds

---

## Pricing to charge

- Setup fee: ₹8,000–12,000 one-time
- Optional monthly maintenance: ₹2,000–3,000/month
- Decap CMS: Free forever
- Netlify free tier: Free forever (100GB bandwidth/month)
