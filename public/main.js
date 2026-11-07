const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const popup = document.getElementById('sitePopup');
const popupHidden = localStorage.getItem('CathrineSlimPopupClosed');
if (popup && popupHidden === 'yes') popup.classList.add('hidden');

document.querySelectorAll('[data-close-popup]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (popup) popup.classList.add('hidden');
    localStorage.setItem('CathrineSlimPopupClosed', 'yes');
  });
});
