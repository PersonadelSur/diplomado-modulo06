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
  const sectionHeaders = document.querySelectorAll('.glossary-h3');
  const noResults = document.getElementById('no-results');
  let activeCat = 'todo';

  function updateSectionHeaders() {
    // Cada h3.glossary-h3 agrupa todo lo que viene después hasta el próximo h3.
    // Si ningún .glossary-item del grupo quedó visible, marcamos el header
    // como "colapsado" (señal visual) en vez de dejarlo suelto sin contexto.
    sectionHeaders.forEach((h3) => {
      let el = h3.nextElementSibling;
      let anyVisible = false;
      while (el && !el.classList.contains('glossary-h3')) {
        if (el.classList.contains('glossary-item')) {
          if (!el.classList.contains('hidden')) anyVisible = true;
        } else if (el.querySelector && el.querySelector('.glossary-item:not(.hidden)')) {
          anyVisible = true;
        }
        el = el.nextElementSibling;
      }
      h3.classList.toggle('collapsed', !anyVisible);
    });
  }

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
    updateSectionHeaders();
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
