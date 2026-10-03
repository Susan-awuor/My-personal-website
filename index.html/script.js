
document.addEventListener("DOMContentLoaded", function () {
    // ==============================
    // MOBILE MENU
    // ==============================
    const menuButton = document.getElementById("menuButton");
    const navMenu = document.getElementById("navMenu");

    function setMenuState(isOpen) {
        if (!navMenu) return;

        navMenu.classList.toggle("active", isOpen);

        if (menuButton) {
            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
        }
    }

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", function () {
            const isOpen = !navMenu.classList.contains("active");
            setMenuState(isOpen);
        });
    }

    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 850) {
                setMenuState(false);
            }
        });
    });

    // ==============================
    // ACTIVE NAV HIGHLIGHT
    // ==============================
    const sections = [...document.querySelectorAll("section[id]")];

    function activateNavLink() {
        const scrollPosition = window.scrollY + 140;

        let currentId = "home";

        sections.forEach(function (section) {
            if (scrollPosition >= section.offsetTop) {
                currentId = section.getAttribute("id");
            }
        });

        navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + currentId;
            link.classList.toggle("active", isActive);
        });
    }

    window.addEventListener("scroll", activateNavLink, { passive: true });
    activateNavLink();

    // ==============================
    // APP-LIKE REVEAL ANIMATIONS
    // ==============================
    const revealItems = document.querySelectorAll(
        ".section, .skill-card, .project, .timeline-item, .about-card, .contact-box"
    );

    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealItems.forEach(function (item) {
        item.classList.add("reveal");
        revealObserver.observe(item);
    });

    // ==============================
    // CONTACT FORM
    // ==============================
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");
            const submitButton = contactForm.querySelector("button[type='submit']");

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formMessage.textContent = "Please complete all fields before sending.";
                formMessage.style.color = "#fca5a5";
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            formMessage.style.color = "#86efac";
            formMessage.textContent = "Sending your message...";

            setTimeout(function () {
                const name = nameInput.value.trim() || "friend";
                formMessage.textContent = "Thanks, " + name + "! Your message was received.";

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Send Message →";
                }

                contactForm.reset();
            }, 700);
        });
    }

    // ==============================
    // FOOTER YEAR
    // ==============================
    const year = new Date().getFullYear();
    const copyright = document.querySelector(".copyright");

    if (copyright) {
        copyright.textContent = "© " + year + " Susan Awuor. All rights reserved.";
    }
});
