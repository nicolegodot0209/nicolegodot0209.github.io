//// Animation
const elements = document.querySelectorAll(".scroll-reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Stop watching this element so it only animates once.
      observer.unobserve(entry.target);
    }
  });
}, {
    threshold: 0.35
});

// Start watching each element separately.
elements.forEach((element) => {
  observer.observe(element);
});