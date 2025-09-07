const header = document.querySelector("header");
const toggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const overlay = document.getElementById("drawer-overlay");
const logo = document.getElementById("logo");
const carousel = document.getElementById("eventsCarousel");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
    logo.src = "img/logo-1.png";
  } else {
    header.classList.remove("scrolled");
    logo.src = "img/logo-2.png";
  }
});

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  overlay.classList.toggle("show");
  toggle.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  navLinks.classList.remove("show");
  overlay.classList.remove("show");
  toggle.classList.remove("active");
});
// Events


function updateCarousel(index) {
  const cardWidth = carousel.offsetWidth;
  carousel.scrollTo({
    left: cardWidth * index,
    behavior: "smooth",
  });

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const idx = parseInt(dot.getAttribute("data-index"));
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
