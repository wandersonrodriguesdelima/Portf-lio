// =========================================
// 01. ATIVAÇÃO DO JAVASCRIPT
// =========================================

document.documentElement.classList.add("js-enabled");

// =========================================
// 02. ELEMENTOS PRINCIPAIS
// =========================================

const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const yearElement = document.querySelector("#current-year");

// =========================================
// 03. ANO AUTOMÁTICO NO RODAPÉ
// =========================================

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// =========================================
// 04. MENU RESPONSIVO
// =========================================

function closeMenu() {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");

  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );

    navigation.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  // Fecha o menu ao selecionar uma seção.
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha o menu ao clicar fora dele.
  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navigation.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Fecha o menu com a tecla ESC.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Fecha o menu ao voltar para uma tela maior.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

// =========================================
// 05. CABEÇALHO AO ROLAR A PÁGINA
// =========================================

function updateHeader() {
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();

// =========================================
// 06. ANIMAÇÕES DE ENTRADA
// =========================================

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Sem suporte a IntersectionObserver, tudo permanece visível.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// =========================================
// 07. IDENTIFICAÇÃO DA SEÇÃO ATUAL
// =========================================

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navLinks.forEach((link) => {
          const linkTarget = link.getAttribute("href");

          const isCurrent = linkTarget === `#${currentId}`;

          link.classList.toggle("active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// =========================================
// 08. FALLBACK PARA CONTEÚDO VISÍVEL
// =========================================

// Se ocorrer algum problema durante a inicialização,
// evita que os elementos fiquem escondidos.

window.addEventListener("load", () => {
  revealElements.forEach((element) => {
    if (!element.classList.contains("visible")) {
      const rect = element.getBoundingClientRect();

      if (rect.top < window.innerHeight) {
        element.classList.add("visible");
      }
    }
  });
});
