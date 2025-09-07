const header = document.querySelector("header");
const toggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const overlay = document.getElementById("drawer-overlay");
const logo = document.getElementById("logo");
const carousel = document.getElementById("eventsCarousel");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;

// Scroll header effect
if (header && logo) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      logo.src = "img/logo-1.png";
    } else {
      header.classList.remove("scrolled");
      logo.src = "img/logo-2.png";
    }
  });
}

// Drawer toggle
if (toggle && navLinks && overlay) {
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
}

// Carousel (basic safe check)
if (carousel && dots.length > 0) {
  // تقدر تكمل هنا كود الكاروسيل وانت مطمئن إن العناصر موجودة
}
