document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".main-nav a");

  if (!menuToggle || !mainNav || !navOverlay) return;

  const openMenu = () => {
    menuToggle.classList.add("active");
    mainNav.classList.add("active");
    navOverlay.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  };

  const closeMenu = () => {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.contains("active");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  navOverlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
});

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale"
);

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* ==========================
         FORM
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const reservationForm = document.querySelector("#reservation-form");
  const messageElement = document.querySelector(".form-toast");

  if (!reservationForm || !messageElement) return;

  const messageInput = reservationForm.querySelector("#message");
  const nameInput = reservationForm.querySelector("#name");
  const emailInput = reservationForm.querySelector("#email");
  const phoneInput = reservationForm.querySelector("#phone");
  const dateInput = reservationForm.querySelector("#date");
  const timeInput = reservationForm.querySelector("#time");
  const guestsInput = reservationForm.querySelector("#guests");
  const submitButton = reservationForm.querySelector(
    'button[type="submit"]'
  );

  let toastTimer;

  const showMessage = (text, type) => {
    clearTimeout(toastTimer);

    messageElement.textContent = text;
    messageElement.className = `form-toast ${type} show`;

    toastTimer = setTimeout(() => {
      messageElement.classList.remove("show");
    }, 3000);
  };

  const clearMessage = () => {
    clearTimeout(toastTimer);
    messageElement.textContent = "";
    messageElement.className = "form-toast";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9+\s()-]{8,20}$/.test(phone);
  };

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  dateInput.min = getToday();
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRFg53ISdeIZ4-y-rmWnabLwag0P8jwOzYbMF74yhfBxAOKwkAdtiawve2Abdk_rCijA/exec";
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;
    const guests = Number(guestsInput.value);
    const message = messageInput.value.trim();

    if (name.length < 2) {
      showMessage("Please enter a valid full name.", "error");
      nameInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (!isValidPhone(phone)) {
      showMessage("Please enter a valid phone number.", "error");
      phoneInput.focus();
      return;
    }

    if (!date) {
      showMessage("Please choose a reservation date.", "error");
      dateInput.focus();
      return;
    }

    if (date < getToday()) {
      showMessage("The reservation date cannot be in the past.", "error");
      dateInput.focus();
      return;
    }

    if (!time) {
      showMessage("Please choose a reservation time.", "error");
      timeInput.focus();
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      showMessage("Guests must be between 1 and 12.", "error");
      guestsInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

 fetch(SCRIPT_URL, {
  method: "POST",
  headers: {
  "Content-Type": "text/plain;charset=utf-8",
},
  body: JSON.stringify({
    name,
    email,
    phone,
    date,
    time,
    guests,
    message,
  }),
})
.then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not OK");
  }
  return response.json();
})  
    .then((data) => {
    if (data.status === "success") {
    showMessage("Reservation sent successfully!", "success");
    reservationForm.reset();
    dateInput.min = getToday();
    } else {
    showMessage("Something went wrong. Please try again.", "error");
    }
  })
.catch((error) => {
  console.error("Reservation error:", error);
  showMessage("Connection error. Please try again.", "error");
})
  .finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Request Reservation";
  });
  });
  });