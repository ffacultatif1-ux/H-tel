document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // MENU MOBILE
  // -----------------------------
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // -----------------------------
  // DIAPORAMA DE 5 IMAGES
  // -----------------------------
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dotsWrap = document.getElementById("sliderDots");
  const prev = document.getElementById("prevSlide");
  const next = document.getElementById("nextSlide");
  let current = 0;
  let timer;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Afficher l'image ${index + 1}`);
    dot.addEventListener("click", () => {
      current = index;
      showSlide(current);
      restartSlider();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll("button")];

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  function restartSlider() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5500);
  }

  next.addEventListener("click", () => { nextSlide(); restartSlider(); });
  prev.addEventListener("click", () => { prevSlide(); restartSlider(); });

  showSlide(0);
  restartSlider();

  // -----------------------------
  // ANIMATION AU SCROLL
  // -----------------------------
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(el => observer.observe(el));

  // -----------------------------
  // BARRE DE PROGRESSION
  // -----------------------------
  const progress = document.getElementById("scrollProgress");

  function updateProgress() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${ratio * 100}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // -----------------------------
  // FORMULAIRE -> WHATSAPP
  // -----------------------------
  const form = document.getElementById("reservationForm");
  const formNote = document.getElementById("formNote");
  const whatsappNumber = "242065269213";

  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");

  const today = new Date().toISOString().split("T")[0];
  checkin.min = today;
  checkout.min = today;

  checkin.addEventListener("change", () => {
    checkout.min = checkin.value;
    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
  });

  document.querySelectorAll(".reserve-link").forEach(link => {
    link.addEventListener("click", () => {
      const roomName = link.dataset.room;
      const roomSelect = document.getElementById("room");
      [...roomSelect.options].forEach(option => {
        if (option.textContent.startsWith(roomName)) {
          roomSelect.value = option.textContent;
        }
      });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const arrival = checkin.value;
    const departure = checkout.value;
    const room = document.getElementById("room").value;
    const guests = document.getElementById("guests").value;
    const message = document.getElementById("message").value.trim();

    if (!arrival || !departure || departure <= arrival) {
      formNote.textContent = "Vérifie les dates : le départ doit être après l'arrivée.";
      return;
    }

    const whatsappMessage = [
      "Bonjour Hôtel du Doeru 👋",
      "",
      "Je souhaite faire une demande de réservation.",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Arrivée : ${arrival}`,
      `Départ : ${departure}`,
      `Chambre : ${room}`,
      `Nombre de personnes : ${guests}`,
      message ? `Demande complémentaire : ${message}` : "",
      "",
      "Merci de me confirmer la disponibilité et les modalités de paiement."
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    formNote.textContent = "Ouverture de WhatsApp…";
    window.open(url, "_blank", "noopener,noreferrer");
  });

  // -----------------------------
  // ANNÉE AUTOMATIQUE
  // -----------------------------
  document.getElementById("year").textContent = new Date().getFullYear();
});


/* ===== MOTION DESIGN V2 ===== */
const pageLoader=document.getElementById("pageLoader");
window.addEventListener("load",()=>setTimeout(()=>pageLoader?.classList.add("loaded"),450));
const motionHeader=document.querySelector(".site-header");
const updateMotionHeader=()=>motionHeader?.classList.toggle("scrolled",window.scrollY>35);
window.addEventListener("scroll",updateMotionHeader,{passive:true});updateMotionHeader();

const cursorGlow=document.getElementById("cursorGlow");
if(cursorGlow&&matchMedia("(hover:hover) and (pointer:fine)").matches){
  window.addEventListener("pointermove",e=>{
    cursorGlow.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:420,fill:"forwards",easing:"ease-out"});
  },{passive:true});
}

if(matchMedia("(hover:hover) and (pointer:fine)").matches){
  const mascot = document.querySelector(".hotel-mascot");

  if (mascot) {
    window.addEventListener("pointermove", e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      mascot.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
      mascot.style.setProperty("--tilt-x", `${(-y).toFixed(2)}deg`);
    }, { passive: true });
  }

  document.querySelectorAll(".product-card,.service-card,.conference-card,.breakfast-card").forEach(card=>{
    let frameId = null;

    const updateTilt = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        card.style.transform = `perspective(1100px) translateY(-10px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) scale(1.01)`;
        card.style.boxShadow = `0 26px 55px rgba(11,47,53,.12), ${(-x * 20).toFixed(1)}px ${(-y * 20).toFixed(1)}px 30px rgba(196,154,90,.08)`;
      });
    };

    card.addEventListener("pointermove", updateTilt);
    card.addEventListener("pointerleave", () => {
      if (frameId) cancelAnimationFrame(frameId);
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}

if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  const slides=document.querySelectorAll(".hero-slide");
  const handleHeroParallax = () => {
    const y = Math.min(window.scrollY, window.innerHeight * 0.9);
    slides.forEach(slide => {
      slide.style.backgroundPosition = `center calc(50% + ${y * 0.08}px)`;
    });
  };

  window.addEventListener("scroll", handleHeroParallax, { passive: true });
  handleHeroParallax();
}
