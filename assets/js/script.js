'use strict';


const splashScreen = document.getElementById("splashScreen");
const splashViewBtn = document.getElementById("splashViewBtn");

if (splashScreen) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const splashDuration = prefersReducedMotion ? 1200 : 3200;
  const splashFadeDuration = prefersReducedMotion ? 250 : 1400;
  let isSplashClosed = false;

  const closeSplash = function () {
    if (isSplashClosed) return;
    isSplashClosed = true;

    splashScreen.classList.add("is-fading");
    splashScreen.classList.add("hidden");
    document.body.classList.remove("is-loading");
    document.body.classList.add("splash-done");

    window.setTimeout(function () {
      splashScreen.remove();
    }, splashFadeDuration + 80);
  };

  window.setTimeout(closeSplash, splashDuration);

  if (splashViewBtn) {
    splashViewBtn.addEventListener("click", closeSplash);
  }
}



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const pageShortcutButtons = document.querySelectorAll("[data-open-page]");

const openPage = function (pageName) {
  const targetPage = pageName.trim().toLowerCase();
  let hasMatch = false;

  for (let i = 0; i < pages.length; i++) {
    if (targetPage === pages[i].dataset.page) {
      hasMatch = true;
      break;
    }
  }

  if (!hasMatch) return;

  for (let i = 0; i < pages.length; i++) {
    if (targetPage === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }

  window.scrollTo(0, 0);
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    openPage(this.textContent);
  });
}

for (let i = 0; i < pageShortcutButtons.length; i++) {
  pageShortcutButtons[i].addEventListener("click", function () {
    openPage(this.dataset.openPage);
  });
}

// avatar modal logic
const avatar = document.querySelector("#avatar"); // the <img> inside avatar-box
const avatarModal = document.getElementById("avatarModal");
const closeAvatarModalBtn = document.getElementById("closeAvatarModal");

if (avatar) {
  avatar.addEventListener("click", () => {
    avatarModal.style.display = "block";
  });
}

if (closeAvatarModalBtn) {
  closeAvatarModalBtn.addEventListener("click", () => {
    avatarModal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target === avatarModal) {
    avatarModal.style.display = "none";
  }
});
