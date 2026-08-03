const categoryLabels = {
  idea: '随想',
  research: '研究',
  build: '构建笔记',
};

const postAliases = {
  'context-is-the-moat': 'ai-era-context-dividend',
};

const blogThemeToggle = document.getElementById('blogThemeToggle');
const savedBlogTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function setBlogTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  blogThemeToggle.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

setBlogTheme(savedBlogTheme);
blogThemeToggle.addEventListener('click', () => {
  setBlogTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date(`${date}T00:00:00`));
}

function postCard(post) {
  const tags = post.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  return `
    <article class="blog-card" data-category="${escapeHtml(post.category)}">
      <a class="blog-card-link" href="blog.html?post=${encodeURIComponent(post.slug)}">
        <div class="blog-card-meta">
          <span class="blog-card-category">${categoryLabels[post.category] || post.category}</span>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>${escapeHtml(post.readTime)}</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="blog-card-tags">${tags}</div>
      </a>
    </article>`;
}

async function loadPosts() {
  const response = await fetch('blog/posts/index.json');
  if (!response.ok) throw new Error('无法读取文章目录');
  return response.json();
}

function renderIndex(posts) {
  const grid = document.getElementById('blogGrid');
  const count = document.getElementById('postCount');
  const empty = document.getElementById('blogEmpty');
  let activeFilter = 'all';

  function applyFilter(filter) {
    activeFilter = filter;
    const visible = filter === 'all' ? posts : posts.filter(post => post.category === filter);
    grid.innerHTML = visible.map(postCard).join('');
    count.textContent = `${visible.length} 篇公开文章`;
    empty.hidden = visible.length !== 0;
    document.querySelectorAll('.blog-filter').forEach(button => {
      button.classList.toggle('active', button.dataset.filter === activeFilter);
    });
  }

  document.getElementById('blogFilters').addEventListener('click', event => {
    const button = event.target.closest('.blog-filter');
    if (button) applyFilter(button.dataset.filter);
  });
  applyFilter(activeFilter);
}

async function renderArticle(posts, slug) {
  const post = posts.find(item => item.slug === slug);
  if (!post) throw new Error('没有找到这篇文章');

  document.getElementById('blogIndexHeader').hidden = true;
  document.getElementById('blogIndexView').hidden = true;
  document.getElementById('blogArticleView').hidden = false;
  document.title = `${post.title} | Amber Zhou`;
  document.getElementById('articleTitle').textContent = post.title;
  document.getElementById('articleExcerpt').textContent = post.excerpt;
  document.getElementById('articleMeta').innerHTML = `
    <span class="blog-card-category">${categoryLabels[post.category] || post.category}</span>
    <time datetime="${post.date}">${formatDate(post.date)}</time>
    <span>${escapeHtml(post.readTime)}</span>`;

  const response = await fetch(`blog/posts/${post.slug}.md`);
  if (!response.ok) throw new Error('无法读取文章内容');
  const markdown = await response.text();
  document.getElementById('articleContent').innerHTML = marked.parse(markdown);
}

async function initBlog() {
  try {
    const posts = await loadPosts();
    const requestedSlug = new URLSearchParams(window.location.search).get('post');
    const slug = postAliases[requestedSlug] || requestedSlug;
    if (requestedSlug && requestedSlug !== slug) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('post', slug);
      window.history.replaceState({}, '', nextUrl);
    }
    if (slug) await renderArticle(posts, slug);
    else renderIndex(posts);
  } catch (error) {
    const target = document.getElementById('blogArticleView').hidden
      ? document.getElementById('blogGrid')
      : document.getElementById('articleContent');
    target.innerHTML = `<p class="blog-empty">${escapeHtml(error.message)}</p>`;
  }
}

initBlog();
