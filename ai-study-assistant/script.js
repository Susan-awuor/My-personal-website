document.addEventListener("DOMContentLoaded", function () {
    const studyForm = document.getElementById("studyForm");
    const resultPanel = document.getElementById("resultPanel");
    const generatedPrompt = document.getElementById("generatedPrompt");
    const copyPromptButton = document.getElementById("copyPrompt");
    const copyStatus = document.getElementById("copyStatus");

    if (window.lucide) {
        window.lucide.createIcons();
    }

    if (!studyForm || !resultPanel || !generatedPrompt || !copyPromptButton || !copyStatus) return;

    studyForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!studyForm.reportValidity()) return;

        const topic = document.getElementById("topic").value.trim();
        const mode = document.getElementById("mode").value;
        const level = document.getElementById("level").selectedOptions[0].textContent;
        const duration = document.getElementById("duration").value;
        const goal = document.getElementById("goal").value.trim() || "Make useful progress and know what to do next.";
        const includeQuiz = document.getElementById("includeQuiz").checked;
        const modeInstructions = {
            tutor: {
                role: "a patient, encouraging tutor",
                guidance: "Explain the key idea in plain language, use a relatable example, and guide me through a small practice task. Give hints before solutions and ask one question at a time."
            },
            coding: {
                role: "a careful coding mentor",
                guidance: "Help me reason through the code, explain tradeoffs, and show a small example. Help debug errors step by step and let me attempt changes before giving a complete solution."
            },
            writing: {
                role: "a thoughtful writing coach",
                guidance: "Help me plan and improve my own writing. Consider audience, purpose, structure, and tone. Point out unclear claims and suggest revisions with brief explanations instead of replacing my work."
            },
            research: {
                role: "a careful research guide",
                guidance: "Turn the topic into useful research questions and search terms. Separate established facts from uncertainty, suggest credible source types, and never invent citations or URLs."
            },
            quiz: {
                role: "an encouraging quiz maker",
                guidance: "Create five questions matched to my level and goal, mixing recall and application. Ask one question at a time, wait for my answer, then explain the reasoning without giving away later answers."
            },
            brainstorm: {
                role: "a practical brainstorming partner",
                guidance: "Generate several distinct options, explain a useful tradeoff for each, and help me shortlist ideas against my goal. State assumptions and include at least one simple, low-cost option."
            },
            language: {
                role: "a patient language practice partner",
                guidance: "Adapt the conversation to my level. Ask one short question at a time, let me answer, then correct mistakes kindly with a brief explanation and a natural example."
            },
            image: {
                role: "a visual prompt designer",
                guidance: "Turn my idea into a clear image-generation prompt. Specify subject, composition, setting, mood, color palette, lighting, and aspect ratio. Describe visual qualities rather than imitating a living artist, and avoid adding text unless I request it."
            }
        };
        const selectedMode = modeInstructions[mode] || modeInstructions.tutor;
        const promptLines = [
            "Act as " + selectedMode.role + ".",
            "Topic or task: " + topic + ".",
            "My current level: " + level + ".",
            "Time available: " + duration + " minutes.",
            "Desired result: " + goal,
            "",
            selectedMode.guidance,
            mode === "quiz" || mode === "image" || !includeQuiz
                ? null
                : "If it suits this task, finish with three quick knowledge-check questions and wait for my answers before showing solutions.",
            "",
            "Be clear and supportive. Do not invent facts or sources; say when you are uncertain. Help me think and learn rather than simply doing the work for me."
        ].filter(function (line) {
            return line !== null;
        });

        generatedPrompt.value = promptLines.join("\n");
        resultPanel.hidden = false;
        copyStatus.textContent = "";
        resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    copyPromptButton.addEventListener("click", async function () {
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                throw new Error("Clipboard access is unavailable.");
            }

            await navigator.clipboard.writeText(generatedPrompt.value);
            copyStatus.textContent = "Prompt copied.";
        } catch {
            generatedPrompt.focus();
            generatedPrompt.select();
            const copied = document.execCommand("copy");
            generatedPrompt.setSelectionRange(0, 0);
            copyStatus.textContent = copied
                ? "Prompt copied."
                : "Select the prompt text and copy it to continue.";
        }
    });
});
