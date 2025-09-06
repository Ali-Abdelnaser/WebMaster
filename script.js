const header = document.querySelector("header");
const toggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});


// Events
const carousel = document.getElementById('eventsCarousel');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function updateCarousel(index) {
  const cardWidth = carousel.offsetWidth;
  carousel.scrollTo({
    left: cardWidth * index,
    behavior: 'smooth',
  });

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.getAttribute('data-index'));
    updateCarousel(idx);
    resetAuto();
  });
});

let autoScroll = setInterval(() => {
  currentIndex = (currentIndex + 1) % dots.length;
  updateCarousel(currentIndex);
}, 5000);

function resetAuto() {
  clearInterval(autoScroll);
  autoScroll = setInterval(() => {
    currentIndex = (currentIndex + 1) % dots.length;
    updateCarousel(currentIndex);
  }, 5000);
}
