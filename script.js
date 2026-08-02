// Módulo 6 — interacciones compartidas

document.addEventListener('DOMContentLoaded', () => {
  // Marca el link de nav activo según la URL actual
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // Copiar prompts al portapapeles
  document.querySelectorAll('.prompt-box').forEach((box) => {
    box.addEventListener('click', () => {
      const text = box.dataset.prompt || box.textContent;
      navigator.clipboard?.writeText(text.trim()).then(() => {
        box.classList.add('copied');
        setTimeout(() => box.classList.remove('copied'), 1600);
      });
    });
  });

  // Glosario: buscador + filtros por categoría
  const searchInput = document.getElementById('glossary-search');
  const chips = document.querySelectorAll('.filter-chip');
  const items = document.querySelectorAll('.glossary-item');
  const noResults = document.getElementById('no-results');
  let activeCat = 'todo';

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    let visibleCount = 0;
    items.forEach((item) => {
      const cat = item.dataset.cat || '';
      const text = item.textContent.toLowerCase();
      const matchesCat = activeCat === 'todo' || cat === activeCat;
      const matchesQ = !q || text.includes(q);
      const show = matchesCat && matchesQ;
      item.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });
});
