/**
 * Blog — Édition Premium 2026
 * Vanilla JS : progress bar, TOC highlight, copy anchor, CTA sticky, scroll reveal
 */

(function () {
  'use strict';

  // --- Reading Progress Bar ---
  var progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    var article = document.querySelector('.blog-prose');
    if (article) {
      window.addEventListener('scroll', function () {
        var rect = article.getBoundingClientRect();
        var articleTop = rect.top + window.scrollY;
        var articleHeight = article.offsetHeight;
        var scrolled = window.scrollY - articleTop;
        var progress = Math.max(0, Math.min(100, (scrolled / (articleHeight - window.innerHeight)) * 100));
        progressBar.style.width = progress + '%';
      }, { passive: true });
    }
  }

  // --- TOC Floating Panel ---
  var tocToggle = document.getElementById('toc-toggle');
  var tocOverlay = document.getElementById('toc-overlay');
  if (tocToggle && tocOverlay) {
    function openToc() {
      tocOverlay.classList.add('is-open');
      tocToggle.setAttribute('aria-expanded', 'true');
    }
    function closeToc() {
      tocOverlay.classList.remove('is-open');
      tocToggle.setAttribute('aria-expanded', 'false');
    }
    tocToggle.addEventListener('click', function () {
      if (tocOverlay.classList.contains('is-open')) {
        closeToc();
      } else {
        openToc();
      }
    });
    tocOverlay.addEventListener('click', function (e) {
      if (e.target === tocOverlay) closeToc();
    });
    // Close on link click (smooth scroll to section)
    var tocLinks = tocOverlay.querySelectorAll('a[href^="#"]');
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeToc();
      });
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tocOverlay.classList.contains('is-open')) {
        closeToc();
      }
    });
  }

  // --- TOC Active Section Highlight ---
  var tocPanel = document.querySelector('.toc-panel');
  if (tocPanel) {
    var headings = document.querySelectorAll('.blog-prose h2, .blog-prose h3');
    var tocAnchors = tocPanel.querySelectorAll('a[href^="#"]');
    if (headings.length > 0 && tocAnchors.length > 0) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tocAnchors.forEach(function (a) {
              a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
      headings.forEach(function (h) {
        if (h.id) observer.observe(h);
      });
    }
  }

  // --- Copy Anchor on Headings ---
  var proseHeadings = document.querySelectorAll('.blog-prose h2[id], .blog-prose h3[id]');
  proseHeadings.forEach(function (heading) {
    var btn = document.createElement('button');
    btn.className = 'heading-anchor';
    btn.setAttribute('aria-label', 'Copier le lien de cette section');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var url = window.location.origin + window.location.pathname + '#' + heading.id;
      navigator.clipboard.writeText(url).then(function () {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        setTimeout(function () {
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
        }, 2000);
      });
    });
    heading.appendChild(btn);
  });

  // --- CTA Sticky Bar ---
  var ctaStickyBar = document.querySelector('.cta-sticky-bar');
  if (ctaStickyBar) {
    var ctaInlines = document.querySelectorAll('.cta-inline');
    var ctaFinal = document.querySelector('.cta-final');

    window.addEventListener('scroll', function () {
      var scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      // Show after 50% scroll
      if (scrollPercent < 50) {
        ctaStickyBar.classList.remove('is-visible');
        return;
      }

      // Hide if an inline CTA or the final CTA is visible
      var anyCtaVisible = false;
      ctaInlines.forEach(function (cta) {
        var rect = cta.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          anyCtaVisible = true;
        }
      });
      if (ctaFinal) {
        var rect = ctaFinal.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          anyCtaVisible = true;
        }
      }

      if (anyCtaVisible) {
        ctaStickyBar.classList.remove('is-visible');
      } else {
        ctaStickyBar.classList.add('is-visible');
      }
    }, { passive: true });
  }

  // --- Scroll Reveal (reuse existing .reveal system) ---
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  // --- Blog List: Category Filters ---
  var filterBtns = document.querySelectorAll('.blog-filter');
  var blogCards = document.querySelectorAll('.blog-card-item');
  if (filterBtns.length > 0 && blogCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.category;
        filterBtns.forEach(function (b) {
          b.classList.remove('bg-indigo', 'text-white', 'border-indigo');
          b.classList.add('text-slate-muted', 'border-slate-border');
        });
        btn.classList.add('bg-indigo', 'text-white', 'border-indigo');
        btn.classList.remove('text-slate-muted', 'border-slate-border');

        blogCards.forEach(function (card) {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
})();
