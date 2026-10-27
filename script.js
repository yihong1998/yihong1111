const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const dialog = document.querySelector('.project-dialog');
const closeDialog = document.querySelector('.dialog-close');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? '打开导航' : '关闭导航');
  nav.classList.toggle('is-open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
  nav.classList.remove('is-open');
}));

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('is-active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible++;
  });
  document.querySelector('.empty-state').hidden = visible > 0;
}));

function showProject(card) {
  const info = card.querySelector('.project-data');
  const put = (selector, value) => { dialog.querySelector(selector).textContent = value; };
  put('.dialog-kind', info.dataset.kind); put('.dialog-year', info.dataset.year);
  put('#dialog-title', info.dataset.title); put('.dialog-subtitle', info.dataset.subtitle);
  put('.dialog-description', info.textContent.trim()); put('.dialog-runtime', info.dataset.runtime);
  dialog.querySelector('.dialog-image').style.backgroundImage = `url("${info.dataset.image}")`;
  dialog.showModal();
}
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => showProject(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showProject(card); }
  });
});
function hideDialog() { if (dialog.open) dialog.close(); }
closeDialog.addEventListener('click', hideDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) hideDialog(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealTargets.forEach(target => observer.observe(target));
} else revealTargets.forEach(target => target.classList.add('is-visible'));
