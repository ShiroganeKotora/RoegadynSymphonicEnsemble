// Roegadyn Symphonic Ensemble — shared front-end behaviour

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Song metadata — keep the source as an explicit <br>-separated field.
  document.querySelectorAll('.song-row > div:first-child').forEach(details => {
    const source = details.querySelector('.song-row__meta:nth-of-type(3)');
    if (!source) return;

    const separatorIndex = source.textContent.indexOf('：');
    if (separatorIndex === -1) return;

    const label = source.textContent.slice(0, separatorIndex + 1);
    const value = source.textContent.slice(separatorIndex + 1).trim();
    source.classList.add('song-row__meta--source');
    source.replaceChildren(label, document.createElement('br'), value);
  });

  // Song metadata — split "label：value" into a two-line catalog treatment.
  document.querySelectorAll('.song-row__meta:not(.song-row__meta--source)').forEach(meta => {
    const separatorIndex = meta.textContent.indexOf('：');
    if (separatorIndex === -1) return;

    const label = document.createElement('span');
    label.className = 'song-row__meta-label';
    label.textContent = meta.textContent.slice(0, separatorIndex);

    const value = document.createElement('span');
    value.className = 'song-row__meta-value';
    value.textContent = meta.textContent.slice(separatorIndex + 1);

    if (label.textContent === '演奏時間' && value.textContent.startsWith('約')) {
      const approximate = document.createElement('span');
      approximate.className = 'song-row__duration-prefix';
      approximate.textContent = '約';
      value.replaceChildren(approximate, value.textContent.slice(1));
    }

    meta.replaceChildren(label, value);
  });

  // Song filter (songs.html only) — two independent tiers: type + formation
  const songRows = document.querySelectorAll('.song-row');
  const typeButtons = document.querySelectorAll('.filter-btn[data-filter-type]');
  const formationButtons = document.querySelectorAll('.filter-btn[data-filter-formation]');

  if (songRows.length && (typeButtons.length || formationButtons.length)) {
    let activeType = 'all';
    let activeFormation = 'all';

    const applyFilters = () => {
      songRows.forEach(row => {
        const types = (row.dataset.type || '').split(' ');
        const formations = (row.dataset.formation || '').split(' ');
        const typeMatch = activeType === 'all' || types.includes(activeType);
        const formationMatch = activeFormation === 'all' || formations.includes(activeFormation);
        row.style.display = (typeMatch && formationMatch) ? '' : 'none';
      });
    };

    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeType = btn.dataset.filterType;
        applyFilters();
      });
    });

    formationButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        formationButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeFormation = btn.dataset.filterFormation;
        applyFilters();
      });
    });
  }
});
