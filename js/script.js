(function () {
  "use strict";

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { /* matchMedia unsupported — proceed with animations on */ }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- parallax (Rellax.js, if available) ---------- */
  if (typeof Rellax === "function" && !reduceMotion && document.querySelector(".rellax")) {
    try {
      new Rellax(".rellax", { center: true });
    } catch (e) { /* library present but failed to init — fail silently, layout stays static */ }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var answer = btn.nextElementSibling;

      document.querySelectorAll(".faq-q").forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------- contact form (submits to Formspree, no backend needed) ---------- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        note.textContent = "Συμπλήρωσε τα υποχρεωτικά πεδία πριν την αποστολή.";
        note.style.color = "#a5432f";
        return;
      }

      var endpointNotConfigured = form.action.indexOf("YOUR_FORM_ID") !== -1;
      if (endpointNotConfigured) {
        note.style.color = "#a5432f";
        note.textContent = "Η φόρμα δεν έχει συνδεθεί ακόμη με το Formspree — αντικατέστησε το YOUR_FORM_ID στο index.html με το δικό σου form ID.";
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      note.style.color = "";
      note.textContent = "Αποστολή...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            note.style.color = "";
            note.textContent = "Ευχαριστούμε! Το μήνυμα στάλθηκε — θα λάβεις απάντηση εντός 24 ωρών.";
            form.reset();
          } else {
            response.json().then(function (data) {
              var msg = data && data.errors && data.errors.length ? data.errors.map(function (er) { return er.message; }).join(", ") : "Κάτι πήγε στραβά.";
              note.style.color = "#a5432f";
              note.textContent = "Δεν στάλθηκε το μήνυμα: " + msg + " Δοκίμασε ξανά αργότερα.";
            });
          }
        })
        .catch(function () {
          note.style.color = "#a5432f";
          note.textContent = "Πρόβλημα σύνδεσης. Δοκίμασε ξανά αργότερα.";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* =========================================================
     Everything below touches elements that live INSIDE the
     injected header.html / footer.html. Those are fetched
     asynchronously (see include-header.js / include-footer.js),
     so this part waits for both to finish before it runs —
     otherwise getElementById would just return null.
     ========================================================= */
  var headerReady = window.headerReady || Promise.resolve();
  var footerReady = window.footerReady || Promise.resolve();

  Promise.all([headerReady, footerReady]).then(function () {
    /* ---------- footer year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

        /* ---------- mobile menu ---------- */
    var siteHeader = document.getElementById("site-header");
    var menuToggle = document.getElementById("menu-toggle");
    var mainNav = document.getElementById("main-nav");
    var headerInner = siteHeader ? siteHeader.querySelector(".header-inner") : null;
    var headerCta = siteHeader ? siteHeader.querySelector(".header-cta") : null;
    var mobileQuery = window.matchMedia("(max-width: 980px)");

    // #main-nav is position:fixed on mobile. .site-header uses
    // backdrop-filter / transform / will-change (for the hide-on-scroll
    // effect), and each of those turns an element into a "containing
    // block" for any position:fixed descendant. That meant the nav's
    // top:88px/bottom:0 were being measured against the header's own
    // ~88px-tall box instead of the real viewport, collapsing the open
    // menu down to a single visible row. Moving #main-nav out to be a
    // sibling of <header> (not a descendant) fixes that. On desktop it's
    // moved back inside .header-inner so the normal flex row layout
    // (brand / nav / CTA) is unaffected.
    function placeNav() {
      if (!mainNav || !siteHeader) return;
      if (mobileQuery.matches) {
        if (mainNav.parentNode !== document.body) {
          siteHeader.insertAdjacentElement("afterend", mainNav);
        }
      } else if (headerInner && headerCta) {
        if (mainNav.parentNode !== headerInner) {
          headerInner.insertBefore(mainNav, headerCta);
        }
      }
    }
    placeNav();
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", placeNav);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(placeNav); // Safari < 14 fallback
    }

    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", function () {
        var isOpen = mainNav.classList.toggle("open");
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.setAttribute("aria-label", isOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
      });
      mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mainNav.classList.remove("open");
          menuToggle.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* ---------- hide header on scroll down, show on scroll up ---------- */
    // var siteHeader = document.getElementById("site-header");
    console.log("siteHeader:", siteHeader);
    if (siteHeader) {
      var lastScrollY = window.scrollY || window.pageYOffset;
      var ticking = false;
      var THRESHOLD = 4; // px of movement needed before reacting — kills jitter

      function updateHeader() {
        var currentY = window.scrollY || window.pageYOffset;
        var delta = currentY - lastScrollY;
        if (currentY <= 80) {
          console.log("near top, showing header");
          siteHeader.classList.remove("header-hidden");
        } else if (delta > THRESHOLD) {
          console.log("scroll down, hiding header");
          siteHeader.classList.add("header-hidden");
        } else if (delta < -THRESHOLD) {
          console.log("scroll up, showing header");
          siteHeader.classList.remove("header-hidden");
        }

        lastScrollY = currentY;
        ticking = false;
      }

      window.addEventListener("scroll", function () {
        if (!ticking) {
          console.log("scroll event, requesting animation frame");
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      }, { passive: true });
    }
  });
})();

