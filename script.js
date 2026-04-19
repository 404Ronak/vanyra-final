/* ============================================================
   VANYRA — script.js
   Collection filter + Product page + Contact form
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     PRODUCT DATA
     ---------------------------------------------------------- */
  const PRODUCTS = {
    "forest-bowl": {
      name:     "Forest Bowl",
      price:    "₹4,800",
      ship:     "Ready to Ship — dispatched within 3 business days.",
      image:    "https://images.unsplash.com/photo-1610701596007-11502849e13f?w=1000&q=90",
      story:    "<p>A shallow curve that catches morning light. Hand-turned from a single piece of teak sourced from the Dang forest reserve, each bowl holds the grain of its origin.</p><p>No two bowls are identical — the wood decides.</p>",
      delivery: "Shipped in linen wrap. Natural oils only. Avoid prolonged water contact.",
    },
    "bamboo-tray": {
      name:     "Bamboo Tray",
      price:    "₹3,200",
      ship:     "Made to Order — allow 10–14 days.",
      image:    "https://images.unsplash.com/photo-1600585152220-90363fe27e38?w=1000&q=90",
      story:    "<p>For objects you want to see, not store away. Woven bamboo base, hardwood frame — a quiet surface for daily rituals.</p>",
      delivery: "Wipe with a dry cloth. Avoid direct sunlight for extended periods.",
    },
    "river-spoon": {
      name:     "River Spoon Set",
      price:    "₹2,400",
      ship:     "Ready to Ship — dispatched within 3 business days.",
      image:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=90",
      story:    "<p>Cool to the touch — shaped for daily ceremony. Each spoon in the set is carved individually, following the grain rather than against it.</p>",
      delivery: "Hand wash only. Rub with coconut oil monthly to preserve finish.",
    },
    "dusk-vessel": {
      name:     "Dusk Vessel",
      price:    "₹6,200",
      ship:     "Made to Order — allow 14–21 days.",
      image:    "https://images.unsplash.com/photo-1615876234884-f3139a52330b?w=1000&q=90",
      story:    "<p>Tall silence — for stems or standing alone. Turned on a slow lathe over two days, the vessel's proportions are resolved entirely by feel.</p>",
      delivery: "Interior sealed. Suitable for dried stems. Not waterproof.",
    },
    "monsoon-board": {
      name:     "Monsoon Board",
      price:    "₹5,400",
      ship:     "Ready to Ship — dispatched within 3 business days.",
      image:    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=90",
      story:    "<p>Generous grain — meant to be shared. The board is cut from a single slab, allowing the natural edge to define one side.</p>",
      delivery: "Oil with food-safe mineral oil before first use. Hand wash only.",
    },
    "amber-box": {
      name:     "Amber Keepsake Box",
      price:    "₹3,900",
      ship:     "Made to Order — allow 10–14 days.",
      image:    "https://images.unsplash.com/photo-1611485988300-b7530defb8e2?w=1000&q=90",
      story:    "<p>A quiet lid — for letters and small treasures. Dovetail joints, no glue. The fit tightens with humidity, loosens in dry air — the wood breathes.</p>",
      delivery: "Do not store in direct heat. Interior unfinished — the wood scent is intentional.",
    },
  };

  /* ----------------------------------------------------------
     PAGE LOAD
     ---------------------------------------------------------- */
  window.addEventListener("load", () => {
    document.body.classList.add("is-loaded");
  });

  /* ----------------------------------------------------------
     HEADER: scroll state
     ---------------------------------------------------------- */
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     MENU TOGGLE
     ---------------------------------------------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.getElementById("site-menu");

  if (menuToggle && menuOverlay) {
    const openMenu = () => {
      menuOverlay.hidden = false;
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      // focus first link
      const firstLink = menuOverlay.querySelector("a");
      if (firstLink) setTimeout(() => firstLink.focus(), 50);
    };
    const closeMenu = () => {
      menuOverlay.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    const isOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.addEventListener("click", () => (isOpen() ? closeMenu() : openMenu()));

    // Close on nav link click
    menuOverlay.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) { closeMenu(); menuToggle.focus(); }
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----------------------------------------------------------
     PAGE TRANSITION
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href");
    // Only internal links, not anchors
    if (!href || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("http")) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("is-page-exit");
      setTimeout(() => { window.location.href = href; }, 360);
    });
  });

  /* ----------------------------------------------------------
     COLLECTION FILTER
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const collectionItems = document.querySelectorAll(".collection-item");

  if (filterBtns.length && collectionItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active state
        filterBtns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.dataset.filter;

        collectionItems.forEach((item, i) => {
          const shipMatch = item.dataset.ship === filter;
          const catMatch  = item.dataset.cat  === filter;
          const show      = filter === "all" || shipMatch || catMatch;

          if (show) {
            item.classList.remove("is-hidden");
            // Stagger re-appearance
            item.style.transitionDelay = `${i * 0.06}s`;
            item.style.opacity  = "1";
            item.style.transform = "none";
          } else {
            item.classList.add("is-hidden");
            item.style.transitionDelay = "0s";
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     PRODUCT PAGE
     ---------------------------------------------------------- */
  const productRoot    = document.getElementById("product-root");
  const productMissing = document.getElementById("product-missing");

  if (productRoot) {
    const params = new URLSearchParams(window.location.search);
    const key    = params.get("p") || "";
    const data   = PRODUCTS[key];

    if (data) {
      const img      = document.getElementById("product-image");
      const nameEl   = document.getElementById("product-name");
      const priceEl  = document.getElementById("product-price");
      const shipEl   = document.getElementById("product-ship");
      const storyEl  = document.getElementById("product-story");
      const delivEl  = document.getElementById("product-delivery");
      const bcName   = document.getElementById("product-bc-name");

      if (img)     { img.src = data.image; img.alt = data.name; }
      if (nameEl)  nameEl.textContent  = data.name;
      if (priceEl) priceEl.textContent = data.price;
      if (shipEl)  shipEl.textContent  = data.ship;
      if (storyEl) storyEl.innerHTML   = data.story;
      if (delivEl) delivEl.textContent = data.delivery;
      if (bcName)  bcName.textContent  = data.name;

      document.title = `${data.name} — VANYRA`;

      if (img) {
        img.onload = () => productRoot.classList.add("is-ready");
        if (img.complete) productRoot.classList.add("is-ready");
      }
    } else {
      productRoot.hidden = true;
      if (productMissing) productMissing.hidden = false;
    }

    // Buy button
    const buyBtn = document.getElementById("product-buy");
    if (buyBtn && data) {
      buyBtn.addEventListener("click", () => {
        buyBtn.textContent = "Request sent ✓";
        buyBtn.disabled = true;
      });
    }
  }

  /* ----------------------------------------------------------
     CONTACT FORM
     ---------------------------------------------------------- */
  const form       = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      // Simulate async send
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = "Message received. We will reply within two business days.";
          formStatus.style.color = "var(--gold)";
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = "Send message"; }
      }, 1200);
    });
  }

})();
