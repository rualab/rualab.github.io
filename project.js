/* project.js */
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top  = `${e.clientY}px`;
});
document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

@media (max-width: 768px) {
  .proj-header { padding: 16px 20px; }
  .proj-hero { height: 56vw; min-height: 220px; }
  .proj-hero-overlay { padding: 20px; }
  .proj-hero-title { font-size: clamp(28px, 7vw, 48px); }
  .proj-main { padding: 40px 20px 60px; gap: 40px; }
  .proj-meta-row { flex-direction: column; gap: 16px; }
  .proj-meta-item { border-right: none; border-bottom: 0.5px solid var(--border); padding: 0 0 16px; }
  .proj-meta-item:last-child { border-bottom: none; padding-left: 0; }
  .proj-body { grid-template-columns: 1fr; gap: 24px; }
  .proj-grid { grid-template-columns: 1fr; }
  .proj-img-half, .proj-img-third { grid-column: span 1; }
  .proj-process-grid { grid-template-columns: 1fr; gap: 24px; }
  .proj-nav-title { font-size: clamp(20px, 5vw, 28px); }
}