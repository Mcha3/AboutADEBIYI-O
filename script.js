// script.js - save as script.js
// Handles testimonial posting and UI small behaviors

document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (small)
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      if (nav.style.display === "flex") {
        nav.style.display = "none";
      } else {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.gap = "0.5rem";
      }
    });
  }

  // Testimonials: load from localStorage and post new
  const commentsKey = "my_site_comments_v1";
  const commentsEl = document.getElementById("comments");
  const form = document.getElementById("commentForm");

  function loadComments() {
    const raw = localStorage.getItem(commentsKey);
    let comments = [];
    try {
      comments = raw ? JSON.parse(raw) : [];
    } catch (e) {
      comments = [];
    }
    renderComments(comments);
  }

  function saveComments(comments) {
    localStorage.setItem(commentsKey, JSON.stringify(comments));
  }

  function renderComments(comments) {
    commentsEl.innerHTML = "";
    if (!comments.length) {
      commentsEl.innerHTML = "<p class='muted'>No comments yet — be the first to leave one!</p>";
      return;
    }
    comments.slice().reverse().forEach(c => {
      const div = document.createElement("div");
      div.className = "comment";
      div.innerHTML = `<div class="meta"><strong>${escapeHtml(c.name)}</strong> • <span class="muted">${new Date(c.time).toLocaleString()}</span></div>
                       <div class="body">${escapeHtml(c.text)}</div>`;
      commentsEl.appendChild(div);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const text = form.comment.value.trim();
    if (!name || !text) return;

    const raw = localStorage.getItem(commentsKey);
    let comments = raw ? JSON.parse(raw) : [];
    comments.push({ name, text, time: new Date().toISOString() });
    saveComments(comments);
    renderComments(comments);
    form.reset();
  });

  loadComments();
});
// === DARK MODE TOGGLE ===
const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Load saved theme or system preference
if (currentTheme === 'dark' || 
   (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
