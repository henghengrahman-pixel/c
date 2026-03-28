document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const applyHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  applyHeader();
  window.addEventListener('scroll', applyHeader, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
