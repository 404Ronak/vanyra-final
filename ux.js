/**
 * VANYRA — lightweight UX behaviors (no framework)
 * Tactile press states, reduced-motion respect for optional flourishes.
 */
(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function bindPress(el) {
    if (!el || el.dataset.premiumPressBound === "1") return;
    el.dataset.premiumPressBound = "1";

    var clear = function () {
      el.classList.remove("is-pressed");
    };

    el.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      el.classList.add("is-pressed");
    });
    el.addEventListener("mouseup", clear);
    el.addEventListener("mouseleave", clear);
    el.addEventListener("blur", clear);

    el.addEventListener(
      "touchstart",
      function () {
        el.classList.add("is-pressed");
      },
      { passive: true }
    );
    el.addEventListener("touchend", clear);
    el.addEventListener("touchcancel", clear);
  }

  function initPressTargets() {
    document.querySelectorAll(".btn, .filter-btn, .menu-toggle").forEach(bindPress);
  }

  function initAnchorButtons() {
    document.querySelectorAll('a.btn[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function () {
        window.setTimeout(clearPressed, 400);
      });
    });
  }

  function clearPressed() {
    document.querySelectorAll(".is-pressed").forEach(function (el) {
      el.classList.remove("is-pressed");
    });
  }

  function initLuxuryMotionClass() {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("reduce-motion");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initLuxuryMotionClass();
      initPressTargets();
      initAnchorButtons();
    });
  } else {
    initLuxuryMotionClass();
    initPressTargets();
    initAnchorButtons();
  }
})();

