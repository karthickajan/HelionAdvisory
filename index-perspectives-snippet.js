// ─── Drop this script at the bottom of index.html ───────────────────
// Replaces hardcoded Perspectives cards with dynamic posts from /posts/
// Requires posts-loader.js to be loaded first
//
// Uses the EXISTING blog-card class structure from index.html so all
// existing CSS (desktop grid, mobile carousel, hover effects) keeps working.

(async function initPerspectives() {
  const grid = document.getElementById('blog-grid');
  const viewAllEl = document.getElementById('perspectivesViewAll');
  const dotsContainer = document.getElementById('blog-dots');
  if (!grid) return;

  // Show loading state
  grid.innerHTML = '<div class="blog-card reveal up" style="grid-column:1/-1;text-align:center;padding:40px 0;font-family:\'DM Mono\',monospace;font-size:0.7rem;letter-spacing:0.1em;color:rgba(255,255,255,0.3);text-transform:uppercase;">Loading perspectives…</div>';

  const posts = await fetchAllPosts();
  const first4 = posts.slice(0, 4);

  if (!first4.length) {
    grid.innerHTML = '';
    return;
  }

  // Render cards using existing blog-card class structure
  grid.innerHTML = first4.map((post, i) => `
    <div class="blog-card reveal up" data-post="${i}" data-slug="${post.slug}" style="cursor:pointer;">
      <div>
        <div class="blog-card-cat">${post.cat}</div>
        <div class="blog-card-title">${post.title}</div>
        <div class="blog-card-summary">${post.body.replace(/<[^>]+>/g,' ').substring(0,160).trim()}…</div>
      </div>
      <div class="blog-card-meta">
        <span>${post.meta}</span>
        <a href="#" class="blog-card-read" data-slug="${post.slug}">Read →</a>
      </div>
    </div>
  `).join('');

  // Rebuild mobile carousel dots and re-init scroll/click listeners
  if (dotsContainer) {
    dotsContainer.innerHTML = first4.map((_, i) =>
      `<button class="blog-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to post ${i + 1}"></button>`
    ).join('');

    // Re-attach dot + scroll listeners (the original IIFE ran before cards existed)
    const newDots = dotsContainer.querySelectorAll('.blog-dot');

    function getActiveIndex() {
      const cards = grid.querySelectorAll(':scope > .blog-card');
      if (!cards.length) return 0;
      const containerCenter = grid.scrollLeft + grid.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      const idx = getActiveIndex();
      newDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    }

    grid.addEventListener('scroll', updateDots, { passive: true });

    newDots.forEach(dot => {
      dot.addEventListener('click', function() {
        const idx = parseInt(this.dataset.index, 10);
        const cards = grid.querySelectorAll(':scope > .blog-card');
        if (!cards[idx]) return;
        const cardCenter = cards[idx].offsetLeft + cards[idx].offsetWidth / 2;
        const scrollTarget = cardCenter - grid.offsetWidth / 2;
        grid.scrollTo({ left: scrollTarget, behavior: 'smooth' });
      });
    });
  }

  // Wire up click → open blog modal (reuse existing #blog-modal)
  grid.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const slug = card.dataset.slug;
      const post = posts.find(p => p.slug === slug);
      if (post) openDynamicBlogModal(post);
    });
  });

  // Register hover cursor class (matches existing behavior)
  grid.querySelectorAll('.blog-card, .blog-card-read').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Update View All count
  if (viewAllEl && posts.length > 4) {
    viewAllEl.innerHTML = `View All (${posts.length}) <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>`;
  }
})();

// Open post using existing #blog-modal
function openDynamicBlogModal(post) {
  const blogModal = document.getElementById('blog-modal');
  if (!blogModal) return;
  document.getElementById('blog-modal-title').textContent = post.title;
  document.getElementById('blog-modal-meta').innerHTML = '<span>' + post.cat + '</span> &nbsp;·&nbsp; ' + post.meta;
  document.getElementById('blog-modal-body').innerHTML = post.body;
  blogModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  blogModal.scrollTop = 0;
  // Hide pill nav and progress bar behind modal
  var pillNav = document.getElementById('pill-nav');
  var progressBar = document.getElementById('progress-bar');
  if (pillNav) pillNav.style.display = 'none';
  if (progressBar) progressBar.style.display = 'none';
}

// closeBlogModal is already defined in index.html — no need to redefine
