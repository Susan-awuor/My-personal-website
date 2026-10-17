
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


    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const submitButton = contactForm.querySelector("button[type='submit']");
            const submission = {
                name: name,
                message: message,
                _subject: "New website message from " + name
            };

            if (email) submission.email = email;

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            formMessage.style.color = "#91a5bb";
            formMessage.textContent = "Sending your message...";

            try {
                const response = await fetch("https://formsubmit.co/ajax/sawuor79@gamil.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(submission)
                });
                const result = await response.json();

                if (!response.ok || ![true, "true"].includes(result.success)) {
                    throw new Error("The form service rejected the submission.");
                }

                formMessage.style.color = "#86efac";
                formMessage.textContent = "Thanks, " + name + ". Your message was submitted to Susan.";
                contactForm.reset();
            } catch {
                formMessage.style.color = "#fca5a5";
                formMessage.textContent = "Your message could not be sent. Please try again later.";
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Send Message →";
                }
            }
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

    // ==============================
    // STUDY PLANNER
    // ==============================
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");

    if (taskForm && taskList) {
        const taskInput = document.getElementById("taskInput");
        const taskDueDate = document.getElementById("taskDueDate");
        const taskPriority = document.getElementById("taskPriority");
        const taskProgress = document.getElementById("taskProgress");
        const plannerDate = document.getElementById("plannerDate");
        const plannerMessage = document.getElementById("plannerMessage");
        const emptyState = document.getElementById("emptyState");
        const starterPlanButton = document.getElementById("starterPlanButton");
        const clearCompletedButton = document.getElementById("clearCompletedButton");
        const taskFilters = document.getElementById("taskFilters");
        const filterButtons = taskFilters.querySelectorAll("[data-filter]");
        const storageKey = "susan-study-planner-tasks";
        let tasks = [];
        let currentFilter = "all";

        plannerDate.textContent = new Intl.DateTimeFormat(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        }).format(new Date());

        try {
            const savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
            if (Array.isArray(savedTasks)) {
                tasks = savedTasks.filter(function (task) {
                    return task && typeof task.id === "string" &&
                        typeof task.title === "string" &&
                        typeof task.completed === "boolean";
                }).slice(0, 100).map(function (task) {
                    return {
                        id: task.id,
                        title: task.title,
                        completed: task.completed,
                        dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
                        priority: ["low", "normal", "high"].includes(task.priority) ? task.priority : "normal"
                    };
                });
            }
        } catch {
            plannerMessage.textContent = "Browser storage is unavailable. Tasks may not be saved after you leave.";
        }

        function saveTasks() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(tasks));
                plannerMessage.textContent = "";
            } catch {
                plannerMessage.textContent = "Browser storage is unavailable. Tasks may not be saved after you leave.";
            }
        }

        function createTask(title, dueDate, priority) {
            const id = window.crypto && window.crypto.randomUUID
                ? window.crypto.randomUUID()
                : Date.now().toString(36) + Math.random().toString(36).slice(2);

            return { id: id, title: title, completed: false, dueDate: dueDate, priority: priority };
        }

        function getLocalDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return year + "-" + month + "-" + day;
        }

        function getGoogleCalendarUrl(task) {
            const [year, month, day] = task.dueDate.split("-").map(Number);
            const endDate = getLocalDateString(new Date(year, month - 1, day + 1)).replace(/-/g, "");
            const eventDetails = new URLSearchParams({
                action: "TEMPLATE",
                text: task.title,
                dates: task.dueDate.replace(/-/g, "") + "/" + endDate,
                details: "Study task. Priority: " + task.priority + ". Created with Susan's Study Planner."
            });

            return "https://calendar.google.com/calendar/render?" + eventDetails.toString();
        }

        function renderTasks() {
            taskList.replaceChildren();

            const visibleTasks = tasks.filter(function (task) {
                if (currentFilter === "active") return !task.completed;
                if (currentFilter === "completed") return task.completed;
                return true;
            });

            visibleTasks.forEach(function (task) {
                const item = document.createElement("li");
                item.className = "task-item" + (task.completed ? " completed" : "");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.setAttribute("aria-label", "Mark " + task.title + (task.completed ? " active" : " complete"));
                checkbox.addEventListener("change", function () {
                    task.completed = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                const content = document.createElement("div");
                content.className = "task-content";
                const title = document.createElement("span");
                title.className = "task-title";
                title.textContent = task.title;
                content.append(title);

                const details = document.createElement("div");
                details.className = "task-details";
                const priority = document.createElement("span");
                priority.className = "task-priority priority-" + task.priority;
                priority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
                details.append(priority);

                if (task.dueDate) {
                    const [year, month, day] = task.dueDate.split("-").map(Number);
                    const dueDate = document.createElement("time");
                    dueDate.dateTime = task.dueDate;
                    dueDate.className = "task-due-date" + (!task.completed && task.dueDate < getLocalDateString(new Date()) ? " overdue" : "");
                    dueDate.textContent = "Due " + new Intl.DateTimeFormat(undefined, {
                        month: "short",
                        day: "numeric"
                    }).format(new Date(year, month - 1, day));
                    details.append(dueDate);

                    const calendarLink = document.createElement("a");
                    calendarLink.className = "task-calendar-link";
                    calendarLink.href = getGoogleCalendarUrl(task);
                    calendarLink.target = "_blank";
                    calendarLink.rel = "noopener noreferrer";
                    calendarLink.setAttribute("aria-label", "Add " + task.title + " to Google Calendar");
                    calendarLink.title = "Add to Google Calendar";
                    calendarLink.innerHTML = '<i data-lucide="calendar-plus" aria-hidden="true"></i>';
                    details.append(calendarLink);
                }

                content.append(details);

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "remove-task-button";
                removeButton.setAttribute("aria-label", "Delete " + task.title);
                removeButton.title = "Delete task";
                removeButton.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
                removeButton.addEventListener("click", function () {
                    tasks = tasks.filter(function (savedTask) {
                        return savedTask.id !== task.id;
                    });
                    saveTasks();
                    renderTasks();
                });

                item.append(checkbox, content, removeButton);
                taskList.append(item);
            });

            const completedCount = tasks.filter(function (task) {
                return task.completed;
            }).length;
            taskProgress.textContent = completedCount + " of " + tasks.length + " tasks complete";
            emptyState.hidden = visibleTasks.length > 0;
            if (!visibleTasks.length && tasks.length) {
                emptyState.textContent = currentFilter === "active" ? "All tasks are complete." : "No completed tasks yet.";
            } else {
                emptyState.textContent = "No tasks yet. Add one small step to get started.";
            }
            starterPlanButton.hidden = tasks.length > 0;
            clearCompletedButton.hidden = completedCount === 0;
            taskFilters.hidden = tasks.length === 0;
            filterButtons.forEach(function (button) {
                const isSelected = button.dataset.filter === currentFilter;
                button.classList.toggle("is-selected", isSelected);
                button.setAttribute("aria-pressed", String(isSelected));
            });

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        taskForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const title = taskInput.value.trim();
            if (!title) return;

            tasks.unshift(createTask(title, taskDueDate.value, taskPriority.value));
            currentFilter = "all";
            saveTasks();
            renderTasks();
            taskForm.reset();
            taskInput.focus();
        });

        starterPlanButton.addEventListener("click", function () {
            const starterTasks = [
                "Choose one skill you want to grow",
                "Complete one short lesson or tutorial",
                "Practice by building something small"
            ];

            tasks = starterTasks.map(function (title) {
                return createTask(title, "", "normal");
            }).concat(tasks);
            currentFilter = "all";
            saveTasks();
            renderTasks();
            plannerMessage.textContent = "Starter plan added. Adjust each step to fit your goal.";
        });

        clearCompletedButton.addEventListener("click", function () {
            if (!tasks.some(function (task) { return task.completed; })) return;

            tasks = tasks.filter(function (task) {
                return !task.completed;
            });
            saveTasks();
            renderTasks();
            plannerMessage.textContent = "Completed tasks cleared.";
        });

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                currentFilter = button.dataset.filter;
                renderTasks();
            });
        });

        renderTasks();

        const timerDisplay = document.getElementById("timerDisplay");
        const timerProgress = document.getElementById("timerProgress");
        const timerTrack = document.getElementById("timerTrack");
        const timerMessage = document.getElementById("timerMessage");
        const timerToggle = document.getElementById("timerToggle");
        const timerReset = document.getElementById("timerReset");
        const focusDuration = 25 * 60;
        let remainingSeconds = focusDuration;
        let timerInterval = null;
        let timerEndTime = 0;

        function updateTimerDisplay() {
            const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
            const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
            timerDisplay.textContent = minutes + ":" + seconds;
            timerProgress.style.width = (remainingSeconds / focusDuration * 100) + "%";
            timerTrack.setAttribute("aria-valuenow", String(remainingSeconds));
        }

        function setTimerButton(label, icon, ariaLabel) {
            timerToggle.setAttribute("aria-label", ariaLabel);
            timerToggle.innerHTML = '<i data-lucide="' + icon + '" aria-hidden="true"></i><span>' + label + "</span>";
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        function stopTimer() {
            window.clearInterval(timerInterval);
            timerInterval = null;
        }

        function tickTimer() {
            remainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
            updateTimerDisplay();

            if (remainingSeconds === 0) {
                stopTimer();
                setTimerButton("Start again", "play", "Start another focus session");
                timerMessage.textContent = "Focus session complete. Take a short break.";
            }
        }

        timerToggle.addEventListener("click", function () {
            if (timerInterval) {
                remainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
                stopTimer();
                updateTimerDisplay();
                setTimerButton("Resume", "play", "Resume focus session");
                timerMessage.textContent = "Timer paused.";
                return;
            }

            if (remainingSeconds === 0) {
                remainingSeconds = focusDuration;
                updateTimerDisplay();
            }

            timerEndTime = Date.now() + remainingSeconds * 1000;
            timerInterval = window.setInterval(tickTimer, 250);
            setTimerButton("Pause", "pause", "Pause focus session");
            timerMessage.textContent = "Focus session in progress.";
        });

        timerReset.addEventListener("click", function () {
            stopTimer();
            remainingSeconds = focusDuration;
            updateTimerDisplay();
            setTimerButton("Start", "play", "Start focus session");
            timerMessage.textContent = "Timer reset. Start when you are ready.";
        });

        updateTimerDisplay();
    }
});
