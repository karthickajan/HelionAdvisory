// ─── Helion Posts Loader ───────────────────────────────────────────
// Fetches markdown posts from /posts/ folder and renders them
// Used by both index.html (first 4) and blog.html (all posts)

const POSTS_INDEX = [
  'dose-escalation-cmc’s-missing-link',
  'extractables-leachables-a-hidden-risk-in-biologics-development',
  'most-late-problems-in-biotech-actually-start-early',
  'platform-products-dont-fail-in-the-lab',
  'regulatory-narratives-start-in-the-lab-notebook',
  'risk-assessment-the-missing-engine-in-many-qbd-programs',
  'target-product-profile-wishlist-or-weapon',
  'testing-platform-products-dont-fail-in-the-lab-they-fail-at-the-interfaces',
  'the-most-dangerous-words-in-drug-development',
  'why-strong-data-doesnt-save-a-weak-development-narrative'
];

// Simple markdown to HTML parser (no external lib needed)
function parseMarkdown(md) {
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs (double newline)
    .replace(/\n\n(?!<)/g, '</p><p>')
    .replace(/^(?!<)/, '<p>')
    .replace(/(?!>)$/, '</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[uh][1-3l])/g, '$1')
    .replace(/(<\/[uh][1-3l]>)<\/p>/g, '$1');
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = jsyaml.load(match[1]);
  return { meta, body: match[2].trim() };
}

// Fetch a single post
async function fetchPost(slug) {
  try {
    const base = window.location.hostname === 'localhost' ? '' : '';
    const res = await fetch(`/posts/${slug}.md`);
    if (!res.ok) return null;
    const text = await res.text();
    const { meta, body } = parseFrontmatter(text);
    return {
      slug,
      title: meta.title || '',
      cat: meta.cat || '',
      meta: meta.meta || '',
      date: meta.date || '',
      visible: meta.visible !== 'false' && meta.visible !== false,
      body: parseMarkdown(body)
    };
  } catch (e) {
    console.warn(`Could not load post: ${slug}`, e);
    return null;
  }
}

// Fetch all posts
async function fetchAllPosts() {
  const results = await Promise.all(POSTS_INDEX.map(fetchPost));
  return results
    .filter(p => p && p.visible !== false && p.visible !== 'false')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Render a post card (for index + blog listing)
function renderCard(post, linkPrefix = '') {
  return `
    <article class="perspective-card" data-slug="${post.slug}" style="cursor:pointer;">
      <div class="perspective-cat">${post.cat}</div>
      <h3 class="perspective-title">${post.title}</h3>
      <div class="perspective-meta">${post.meta}</div>
      <a class="perspective-read" data-slug="${post.slug}">Read →</a>
    </article>
  `;
}

// Render full post body (for modal / blog detail)
function renderPostDetail(post) {
  return `
    <div class="post-detail">
      <div class="post-detail-cat">${post.cat}</div>
      <h1 class="post-detail-title">${post.title}</h1>
      <div class="post-detail-meta">${post.meta}</div>
      <div class="post-detail-body">${post.body}</div>
    </div>
  `;
}
