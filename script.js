// ==========================================
// THE PRESSURE TO KEEP UP
// Main JavaScript
// ==========================================


// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobileNav");

if (menuButton && mobileNav) {

    menuButton.addEventListener("click", function () {

        const isOpen = mobileNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    const mobileLinks = mobileNav.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileNav.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


// ==========================================
// 2. CHECK-IN EXPERIENCE
// ==========================================

const questionScreens =
    document.querySelectorAll(".question-screen[data-question]");

const nextQuestionButton =
    document.getElementById("nextQuestion");

const previousQuestionButton =
    document.getElementById("previousQuestion");

const questionCounter =
    document.getElementById("questionCounter");

const questionPercent =
    document.getElementById("questionPercent");

const checkinProgress =
    document.getElementById("checkinProgress");

const questionControls =
    document.getElementById("questionControls");

const checkinResult =
    document.getElementById("checkinResult");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const selectionMessage =
    document.getElementById("selectionMessage");


// Only run this code when we are on checkin.html
if (
    questionScreens.length > 0 &&
    nextQuestionButton &&
    previousQuestionButton
) {

    let currentQuestion = 0;

    const answers =
        new Array(questionScreens.length).fill(null);


    // ======================================
    // SHOW CURRENT QUESTION
    // ======================================

    function showQuestion(index) {

        questionScreens.forEach(function (screen) {

            screen.classList.remove("active");

        });


        questionScreens[index].classList.add("active");


        const questionNumber = index + 1;

        const percentage = Math.round(
            (questionNumber / questionScreens.length) * 100
        );


        questionCounter.textContent =
            `Question ${questionNumber} of ${questionScreens.length}`;

        questionPercent.textContent =
            `${percentage}%`;

        checkinProgress.style.width =
            `${percentage}%`;


        // Disable Back on Question 1

        previousQuestionButton.disabled =
            index === 0;


        // Continue only works after selecting an answer

        nextQuestionButton.disabled =
            answers[index] === null;


        // Change button text on final question

        if (index === questionScreens.length - 1) {

            nextQuestionButton.innerHTML = `
                See My Reflection

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        } else {

            nextQuestionButton.innerHTML = `
                Continue

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        }


        if (answers[index] === null) {

            selectionMessage.textContent =
                "Choose the answer that feels closest to you.";

        } else {

            selectionMessage.textContent =
                "Answer selected. Continue when you're ready.";

        }

    }


    // ======================================
    // SELECT ANSWERS
    // ======================================

    questionScreens.forEach(
        function (screen, questionIndex) {

            const answerButtons =
                screen.querySelectorAll(".answer-card");


            answerButtons.forEach(function (button) {

                // Initial accessibility state

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );


                button.addEventListener(
                    "click",
                    function () {

                        // Remove selected style
                        // from the other answers

                        answerButtons.forEach(
                            function (otherButton) {

                                otherButton.classList.remove(
                                    "selected"
                                );

                                otherButton.setAttribute(
                                    "aria-pressed",
                                    "false"
                                );

                            }
                        );


                        // Select clicked answer

                        button.classList.add("selected");

                        button.setAttribute(
                            "aria-pressed",
                            "true"
                        );


                        // Remember answer

                        answers[questionIndex] =
                            Number(button.dataset.value);


                        // Enable Continue

                        nextQuestionButton.disabled =
                            false;


                        selectionMessage.textContent =
                            "Answer selected. Continue when you're ready.";

                    }
                );

            });

        }
    );


    // ======================================
    // CONTINUE BUTTON
    // ======================================

    nextQuestionButton.addEventListener(
        "click",
        function () {

            // Do nothing if unanswered

            if (answers[currentQuestion] === null) {
                return;
            }


            // Go to next question

            if (
                currentQuestion <
                questionScreens.length - 1
            ) {

                currentQuestion++;

                showQuestion(currentQuestion);

            } else {

                // Finished Question 3

                showCheckinResult();

            }

        }
    );


    // ======================================
    // BACK BUTTON
    // ======================================

    previousQuestionButton.addEventListener(
        "click",
        function () {

            if (currentQuestion > 0) {

                currentQuestion--;

                showQuestion(currentQuestion);

            }

        }
    );


    // ======================================
    // FINAL CHECK-IN REFLECTION
    // ======================================

    function showCheckinResult() {

        questionScreens.forEach(function (screen) {

            screen.classList.remove("active");

        });


        const total = answers.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


        /*
        IMPORTANT:

        This number is NOT a psychological score.

        We only use the answers to choose
        a relevant reflection message.
        */


        // Mostly "Rarely"

        if (total <= 1) {

            resultTitle.textContent =
                "You seem able to keep some distance from comparison.";

            resultDescription.textContent =
                "Your answers suggest that other people's posts may not strongly shape how you see yourself most of the time. Even so, comparison can appear in subtle ways. The next activity will help you recognize what it can look like in everyday situations.";

        }


        // Mixed answers

        else if (total <= 3) {

            resultTitle.textContent =
                "Comparison may show up from time to time.";

            resultDescription.textContent =
                "Your answers suggest that social media comparison can sometimes influence how you think about your progress, appearance, or online reactions. Noticing when this happens can make it easier to separate your own values from the pressure to keep up.";

        }


        // More frequent comparison

        else {

            resultTitle.textContent =
                "Social comparison may be worth noticing more closely.";

            resultDescription.textContent =
                "Your answers suggest that what you see or receive online may sometimes influence how you evaluate yourself. This is not a diagnosis or judgment. It is simply an invitation to notice when someone else's appearance, progress, or validation begins to become the measurement of your own.";

        }


        // Show result

        checkinResult.classList.add("active");


        // Hide Back / Continue controls

        questionControls.style.display =
            "none";


        // Complete progress

        questionCounter.textContent =
            "Check-In Complete";

        questionPercent.textContent =
            "100%";

        checkinProgress.style.width =
            "100%";

    }


    // ======================================
    // INITIALIZE CHECK-IN
    // ======================================

    showQuestion(0);

}
// ==========================================
// 3. SCENARIO EXPERIENCE
// ==========================================

const scenarioScreens =
    document.querySelectorAll(".scenario-screen[data-scenario]");

const previousScenarioButton =
    document.getElementById("previousScenario");

const nextScenarioButton =
    document.getElementById("nextScenario");

const scenarioCounter =
    document.getElementById("scenarioCounter");

const scenarioProgress =
    document.getElementById("scenarioProgress");

const scenarioControls =
    document.getElementById("scenarioControls");

const scenarioComplete =
    document.getElementById("scenarioComplete");

const scenarioMessage =
    document.getElementById("scenarioMessage");

const scenarioDots =
    document.querySelectorAll(".scenario-dots span");


if (
    scenarioScreens.length > 0 &&
    previousScenarioButton &&
    nextScenarioButton
) {

    let currentScenario = 0;

    const scenarioAnswers =
        new Array(scenarioScreens.length).fill(null);


    // --------------------------------------
    // Reflection messages
    // --------------------------------------

    const feedbackMessages = {

        comparison:
            "Notice what happened: the post became a measurement for your own life. Comparison can make another person's moment feel like evidence that you are behind, even though the two lives may have completely different circumstances.",

        mixed:
            "Two feelings can exist at the same time. You can genuinely appreciate someone else's experience while also noticing that it creates pressure in you. Recognizing that tension is part of self-awareness.",

        grounded:
            "This response keeps the post separate from your own worth. You can notice someone else's experience without automatically turning it into a standard that your life must meet."

    };


    // --------------------------------------
    // Show scenario
    // --------------------------------------

    function showScenario(index) {

        scenarioScreens.forEach(function (screen) {
            screen.classList.remove("active");
        });


        scenarioScreens[index].classList.add("active");


        const scenarioNumber = index + 1;

        const percentage = Math.round(
            (
                scenarioNumber /
                scenarioScreens.length
            ) * 100
        );


        scenarioCounter.textContent =
            `Scenario ${scenarioNumber} of ${scenarioScreens.length}`;

        scenarioProgress.style.width =
            `${percentage}%`;


        previousScenarioButton.disabled =
            index === 0;


        nextScenarioButton.disabled =
            scenarioAnswers[index] === null;


        // Update progress dots

        scenarioDots.forEach(
            function (dot, dotIndex) {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );


        // Final button text

        if (
            index ===
            scenarioScreens.length - 1
        ) {

            nextScenarioButton.innerHTML = `
                Finish Scenarios

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        } else {

            nextScenarioButton.innerHTML = `
                Continue

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        }


        if (scenarioAnswers[index] === null) {

            scenarioMessage.textContent =
                "Choose the thought that feels closest.";

        } else {

            scenarioMessage.textContent =
                "Reflection revealed. Continue when you're ready.";

        }

    }


    // --------------------------------------
    // Select a reaction
    // --------------------------------------

    scenarioScreens.forEach(
        function (screen, scenarioIndex) {

            const choices =
                screen.querySelectorAll(".scenario-choice");

            const feedbackBox =
                screen.querySelector(".scenario-feedback");


            choices.forEach(function (choice) {

                choice.setAttribute(
                    "aria-pressed",
                    "false"
                );


                choice.addEventListener(
                    "click",
                    function () {

                        choices.forEach(
                            function (otherChoice) {

                                otherChoice.classList.remove(
                                    "selected"
                                );

                                otherChoice.setAttribute(
                                    "aria-pressed",
                                    "false"
                                );

                            }
                        );


                        choice.classList.add("selected");

                        choice.setAttribute(
                            "aria-pressed",
                            "true"
                        );


                        const feedbackType =
                            choice.dataset.feedback;


                        scenarioAnswers[scenarioIndex] =
                            feedbackType;


                        feedbackBox.textContent =
                            feedbackMessages[feedbackType];

                        feedbackBox.classList.add(
                            "visible"
                        );


                        nextScenarioButton.disabled =
                            false;


                        scenarioMessage.textContent =
                            "Notice the reflection, then continue when you're ready.";

                    }
                );

            });

        }
    );


    // --------------------------------------
    // Continue
    // --------------------------------------

    nextScenarioButton.addEventListener(
        "click",
        function () {

            if (
                scenarioAnswers[currentScenario]
                === null
            ) {
                return;
            }


            if (
                currentScenario <
                scenarioScreens.length - 1
            ) {

                currentScenario++;

                showScenario(currentScenario);

            } else {

                showScenarioCompletion();

            }

        }
    );


    // --------------------------------------
    // Back
    // --------------------------------------

    previousScenarioButton.addEventListener(
        "click",
        function () {

            if (currentScenario > 0) {

                currentScenario--;

                showScenario(currentScenario);

            }

        }
    );


    // --------------------------------------
    // Completion
    // --------------------------------------

    function showScenarioCompletion() {

        scenarioScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        scenarioComplete.classList.add("active");


        scenarioControls.style.display =
            "none";


        scenarioCounter.textContent =
            "Scenarios Complete";


        scenarioProgress.style.width =
            "100%";


        scenarioDots.forEach(
            function (dot) {

                dot.classList.add("active");

            }
        );

    }


    // Start

    showScenario(0);

}
// ==========================================
// 4. THE PATTERN
// ==========================================

const cycleSteps =
    document.querySelectorAll(".cycle-step");

const patternInfo =
    document.querySelector(".pattern-info");

const patternNumber =
    document.getElementById("patternNumber");

const patternStatus =
    document.getElementById("patternStatus");

const patternIcon =
    document.getElementById("patternIcon");

const patternTitle =
    document.getElementById("patternTitle");

const patternDescription =
    document.getElementById("patternDescription");

const patternExample =
    document.getElementById("patternExample");

const patternStepCount =
    document.getElementById("patternStepCount");

const patternPrevious =
    document.getElementById("patternPrevious");

const patternNext =
    document.getElementById("patternNext");


if (
    cycleSteps.length > 0 &&
    patternInfo &&
    patternPrevious &&
    patternNext
) {

    let currentPatternStep = 0;


    // --------------------------------------
    // Content for each step
    // --------------------------------------

    const patternContent = [

        {
            status: "SEE",
            icon: "◉",

            title:
                "You see someone else's life.",

            description:
                "A post gives you a small, selected glimpse of another person's appearance, achievement, relationship, lifestyle, or success.",

            example:
                "“They seem to have everything together.”"
        },


        {
            status: "COMPARE",
            icon: "⇄",

            title:
                "Their life becomes a reference point.",

            description:
                "Instead of simply observing the post, you begin placing their experience beside your own. Their progress, appearance, or lifestyle can start to feel like a standard.",

            example:
                "“They're already there. Why am I not?”"
        },


        {
            status: "JUDGE",
            icon: "◇",

            title:
                "Comparison turns inward.",

            description:
                "The difference between their post and your current reality may become a judgment about yourself. You may feel behind, unattractive, unsuccessful, or not good enough.",

            example:
                "“Maybe I'm the one who isn't doing enough.”"
        },


        {
            status: "PRESENT",
            icon: "✦",

            title:
                "You may change what others see.",

            description:
                "Pressure can influence how you present yourself online. You might carefully select, edit, hide, or emphasize parts of your life to create a particular impression.",

            example:
                "“I want people to see me differently.”"
        },


        {
            status: "VALIDATE",
            icon: "♡",

            title:
                "Reactions can begin to feel meaningful.",

            description:
                "Likes, views, comments, and other reactions may temporarily reassure you that the version of yourself you presented is accepted or valued.",

            example:
                "“People liked it. Maybe I look okay after all.”"
        },


        {
            status: "REPEAT",
            icon: "↻",

            title:
                "Then the comparison begins again.",

            description:
                "The reassurance may not last. More scrolling brings more people to compare with, creating another opportunity to question your progress, appearance, or worth.",

            example:
                "“Maybe I need to keep up a little more.”"
        }

    ];


    // --------------------------------------
    // Show step
    // --------------------------------------

    function showPatternStep(index) {

        currentPatternStep = index;

        const content =
            patternContent[index];


        // Highlight selected step

        cycleSteps.forEach(
            function (step, stepIndex) {

                step.classList.toggle(
                    "active",
                    stepIndex === index
                );

                step.setAttribute(
                    "aria-pressed",
                    stepIndex === index
                );

            }
        );


        // Restart information animation

        patternInfo.classList.remove("animate");

        void patternInfo.offsetWidth;

        patternInfo.classList.add("animate");


        // Change information

        patternNumber.textContent =
            `STEP ${String(index + 1).padStart(2, "0")}`;

        patternStatus.textContent =
            content.status;

        patternIcon.textContent =
            content.icon;

        patternTitle.textContent =
            content.title;

        patternDescription.textContent =
            content.description;

        patternExample.textContent =
            content.example;

        patternStepCount.textContent =
            `${index + 1} / ${patternContent.length}`;


        // Previous / Next state

        patternPrevious.disabled =
            index === 0;

        patternNext.disabled =
            index === patternContent.length - 1;

    }


    // --------------------------------------
    // Click cycle step
    // --------------------------------------

    cycleSteps.forEach(
        function (step, index) {

            step.addEventListener(
                "click",
                function () {

                    showPatternStep(index);

                }
            );

        }
    );


    // --------------------------------------
    // Previous arrow
    // --------------------------------------

    patternPrevious.addEventListener(
        "click",
        function () {

            if (currentPatternStep > 0) {

                showPatternStep(
                    currentPatternStep - 1
                );

            }

        }
    );


    // --------------------------------------
    // Next arrow
    // --------------------------------------

    patternNext.addEventListener(
        "click",
        function () {

            if (
                currentPatternStep <
                patternContent.length - 1
            ) {

                showPatternStep(
                    currentPatternStep + 1
                );

            }

        }
    );


    // Initialize

    showPatternStep(0);

}
// ==========================================
// 5. PRIVATE REFLECTION JOURNAL
// ==========================================

const reflectionScreens =
    document.querySelectorAll(
        ".reflection-screen[data-reflection]"
    );

const previousReflectionButton =
    document.getElementById("previousReflection");

const nextReflectionButton =
    document.getElementById("nextReflection");

const reflectionCounter =
    document.getElementById("reflectionCounter");

const reflectionProgress =
    document.getElementById("reflectionProgress");

const reflectionControls =
    document.getElementById("reflectionControls");

const reflectionComplete =
    document.getElementById("reflectionComplete");

const reflectionMessage =
    document.getElementById("reflectionMessage");

const reflectionDots =
    document.querySelectorAll(".journal-dots span");

const reflectionTextareas =
    document.querySelectorAll(".reflection-textarea");


if (
    reflectionScreens.length > 0 &&
    previousReflectionButton &&
    nextReflectionButton
) {

    let currentReflection = 0;


    // ======================================
    // SHOW REFLECTION
    // ======================================

    function showReflection(index) {

        reflectionScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        reflectionScreens[index]
            .classList
            .add("active");


        const number = index + 1;

        const percentage = Math.round(
            (
                number /
                reflectionScreens.length
            ) * 100
        );


        reflectionCounter.textContent =
            `Reflection ${number} of ${reflectionScreens.length}`;

        reflectionProgress.style.width =
            `${percentage}%`;


        previousReflectionButton.disabled =
            index === 0;


        reflectionDots.forEach(
            function (dot, dotIndex) {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );


        if (
            index ===
            reflectionScreens.length - 1
        ) {

            nextReflectionButton.innerHTML = `
                Finish Reflection

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        } else {

            nextReflectionButton.innerHTML = `
                Continue

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        }

    }


    // ======================================
    // CHARACTER COUNTERS
    // ======================================

    reflectionTextareas.forEach(
        function (textarea) {

            const journalPaper =
                textarea.closest(".journal-paper");

            const counter =
                journalPaper.querySelector(
                    ".character-count"
                );


            function updateCharacterCount() {

                counter.textContent =
                    `${textarea.value.length} / 800`;

            }


            textarea.addEventListener(
                "input",
                updateCharacterCount
            );


            updateCharacterCount();

        }
    );


    // ======================================
    // NEXT
    // ======================================

    nextReflectionButton.addEventListener(
        "click",
        function () {

            if (
                currentReflection <
                reflectionScreens.length - 1
            ) {

                currentReflection++;

                showReflection(
                    currentReflection
                );

            } else {

                finishReflection();

            }

        }
    );


    // ======================================
    // BACK
    // ======================================

    previousReflectionButton.addEventListener(
        "click",
        function () {

            if (currentReflection > 0) {

                currentReflection--;

                showReflection(
                    currentReflection
                );

            }

        }
    );


    // ======================================
    // COMPLETE
    // ======================================

    function finishReflection() {

        reflectionScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        reflectionComplete
            .classList
            .add("active");


        reflectionControls.style.display =
            "none";


        reflectionCounter.textContent =
            "Reflection Complete";


        reflectionProgress.style.width =
            "100%";


        reflectionDots.forEach(
            function (dot) {

                dot.classList.add("active");

            }
        );

    }


    // ======================================
    // INITIALIZE
    // ======================================

    showReflection(0);

}
// ==========================================
// 6. BOUNDARY ACTION PLAN
// ==========================================

const boundaryScreens =
    document.querySelectorAll(
        ".boundary-screen[data-boundary-screen]"
    );

const boundaryOptions =
    document.querySelectorAll(".boundary-option");

const focusOptions =
    document.querySelectorAll(".focus-option");

const customBoundary =
    document.getElementById("customBoundary");

const customFocus =
    document.getElementById("customFocus");

const previousBoundary =
    document.getElementById("previousBoundary");

const nextBoundary =
    document.getElementById("nextBoundary");

const boundaryControls =
    document.getElementById("boundaryControls");

const boundaryStepText =
    document.getElementById("boundaryStepText");

const boundaryMessage =
    document.getElementById("boundaryMessage");

const boundaryProgress =
    document.getElementById("boundaryProgress");

const builderSteps =
    document.querySelectorAll(".builder-steps span");

const commitmentBoundary =
    document.getElementById("commitmentBoundary");

const commitmentFocus =
    document.getElementById("commitmentFocus");


if (
    boundaryScreens.length > 0 &&
    previousBoundary &&
    nextBoundary
) {

    let currentBoundaryStep = 0;

    let selectedBoundary = "";
    let selectedFocus = "";


    // ======================================
    // SHOW SCREEN
    // ======================================

    function showBoundaryScreen(index) {

        currentBoundaryStep = index;


        boundaryScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        boundaryScreens[index]
            .classList
            .add("active");


        boundaryStepText.textContent =
            `Step ${index + 1} of 3`;


        const percentage =
            ((index + 1) / 3) * 100;


        boundaryProgress.style.width =
            `${percentage}%`;


        builderSteps.forEach(
            function (step, stepIndex) {

                step.classList.toggle(
                    "active",
                    stepIndex === index
                );

            }
        );


        previousBoundary.disabled =
            index === 0;


        // Step 1

        if (index === 0) {

            nextBoundary.disabled =
                selectedBoundary === "";

            boundaryMessage.textContent =
                selectedBoundary
                    ? "Boundary selected. Continue when you're ready."
                    : "Choose one option to continue.";

        }


        // Step 2

        if (index === 1) {

            nextBoundary.disabled =
                selectedFocus === "";

            boundaryMessage.textContent =
                selectedFocus
                    ? "Focus selected. Continue when you're ready."
                    : "Choose what you want to focus on.";

        }


        // Step 3

        if (index === 2) {

            createCommitment();

            boundaryControls.style.display =
                "none";

        } else {

            boundaryControls.style.display =
                "grid";

        }

    }


    // ======================================
    // SELECT BOUNDARY
    // ======================================

    boundaryOptions.forEach(
        function (option) {

            option.setAttribute(
                "aria-pressed",
                "false"
            );


            option.addEventListener(
                "click",
                function () {

                    boundaryOptions.forEach(
                        function (otherOption) {

                            otherOption.classList.remove(
                                "selected"
                            );

                            otherOption.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    option.classList.add(
                        "selected"
                    );

                    option.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    selectedBoundary =
                        option.dataset.boundary;


                    if (customBoundary) {
                        customBoundary.value = "";
                    }


                    nextBoundary.disabled =
                        false;


                    boundaryMessage.textContent =
                        "Boundary selected. Continue when you're ready.";

                }
            );

        }
    );


    // ======================================
    // CUSTOM BOUNDARY
    // ======================================

    if (customBoundary) {

        customBoundary.addEventListener(
            "input",
            function () {

                const value =
                    customBoundary.value.trim();


                if (value !== "") {

                    boundaryOptions.forEach(
                        function (option) {

                            option.classList.remove(
                                "selected"
                            );

                            option.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    selectedBoundary = value;

                    nextBoundary.disabled =
                        false;


                    boundaryMessage.textContent =
                        "Custom boundary added. Continue when you're ready.";

                } else {

                    selectedBoundary = "";

                    nextBoundary.disabled =
                        true;


                    boundaryMessage.textContent =
                        "Choose one option to continue.";

                }

            }
        );

    }


    // ======================================
    // SELECT FOCUS
    // ======================================

    focusOptions.forEach(
        function (option) {

            option.setAttribute(
                "aria-pressed",
                "false"
            );


            option.addEventListener(
                "click",
                function () {

                    focusOptions.forEach(
                        function (otherOption) {

                            otherOption.classList.remove(
                                "selected"
                            );

                            otherOption.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    option.classList.add(
                        "selected"
                    );

                    option.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    selectedFocus =
                        option.dataset.focus;


                    if (customFocus) {
                        customFocus.value = "";
                    }


                    nextBoundary.disabled =
                        false;


                    boundaryMessage.textContent =
                        "Focus selected. Continue when you're ready.";

                }
            );

        }
    );


    // ======================================
    // CUSTOM FOCUS
    // ======================================

    if (customFocus) {

        customFocus.addEventListener(
            "input",
            function () {

                const value =
                    customFocus.value.trim();


                if (value !== "") {

                    focusOptions.forEach(
                        function (option) {

                            option.classList.remove(
                                "selected"
                            );

                            option.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    selectedFocus = value;

                    nextBoundary.disabled =
                        false;


                    boundaryMessage.textContent =
                        "Custom focus added. Continue when you're ready.";

                } else {

                    selectedFocus = "";

                    nextBoundary.disabled =
                        true;


                    boundaryMessage.textContent =
                        "Choose what you want to focus on.";

                }

            }
        );

    }


    // ======================================
    // CREATE COMMITMENT
    // ======================================

    function createCommitment() {

        commitmentBoundary.textContent =
            selectedBoundary ||
            "choose a healthier boundary";


        commitmentFocus.textContent =
            selectedFocus ||
            "what matters to me";

    }


    // ======================================
    // NEXT
    // ======================================

    nextBoundary.addEventListener(
        "click",
        function () {

            if (
                currentBoundaryStep === 0 &&
                selectedBoundary === ""
            ) {
                return;
            }


            if (
                currentBoundaryStep === 1 &&
                selectedFocus === ""
            ) {
                return;
            }


            if (currentBoundaryStep < 2) {

                showBoundaryScreen(
                    currentBoundaryStep + 1
                );

            }

        }
    );


    // ======================================
    // BACK
    // ======================================

    previousBoundary.addEventListener(
        "click",
        function () {

            if (currentBoundaryStep > 0) {

                showBoundaryScreen(
                    currentBoundaryStep - 1
                );

            }

        }
    );


    // ======================================
    // INITIALIZE
    // ======================================

    showBoundaryScreen(0);

}
// ==========================================
// 7. FINAL CHECK-IN / TAKEAWAY
// ==========================================

const takeawayScreens =
    document.querySelectorAll(
        ".takeaway-screen[data-takeaway]"
    );

const previousTakeaway =
    document.getElementById("previousTakeaway");

const nextTakeaway =
    document.getElementById("nextTakeaway");

const takeawayCounter =
    document.getElementById("takeawayCounter");

const takeawayProgress =
    document.getElementById("takeawayProgress");

const takeawayControls =
    document.getElementById("takeawayControls");

const takeawayComplete =
    document.getElementById("takeawayComplete");

const takeawayMessage =
    document.getElementById("takeawayMessage");

const takeawayDots =
    document.querySelectorAll(".takeaway-dots span");

const finalReminder =
    document.getElementById("finalReminder");

const anotherReminder =
    document.getElementById("anotherReminder");


if (
    takeawayScreens.length > 0 &&
    previousTakeaway &&
    nextTakeaway
) {

    let currentTakeaway = 0;

    const takeawayAnswers =
        new Array(takeawayScreens.length).fill(null);


    // ======================================
    // FEEDBACK
    // ======================================

    const takeawayFeedback = {

        strong:
            "Yes — this reflects the key idea. The issue is not simply seeing another person's experience. The pressure appears when their experience becomes a standard for judging your own worth, progress, or choices.",

        developing:
            "Look again at what is being measured. A useful question is: am I simply observing something online, or am I turning it into a standard for what my own life should look like?"

    };


    // ======================================
    // SHOW QUESTION
    // ======================================

    function showTakeaway(index) {

        currentTakeaway = index;


        takeawayScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        takeawayScreens[index]
            .classList
            .add("active");


        const number = index + 1;

        const percentage =
            (number / takeawayScreens.length) * 100;


        takeawayCounter.textContent =
            `Question ${number} of ${takeawayScreens.length}`;


        takeawayProgress.style.width =
            `${percentage}%`;


        previousTakeaway.disabled =
            index === 0;


        nextTakeaway.disabled =
            takeawayAnswers[index] === null;


        takeawayDots.forEach(
            function (dot, dotIndex) {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );


        if (
            index ===
            takeawayScreens.length - 1
        ) {

            nextTakeaway.innerHTML = `
                Finish

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        } else {

            nextTakeaway.innerHTML = `
                Continue

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            `;

        }


        if (
            takeawayAnswers[index] === null
        ) {

            takeawayMessage.textContent =
                "Choose one response.";

        } else {

            takeawayMessage.textContent =
                "Reflection revealed. Continue when you're ready.";

        }

    }


    // ======================================
    // ANSWER SELECTION
    // ======================================

    takeawayScreens.forEach(
        function (screen, screenIndex) {

            const options =
                screen.querySelectorAll(
                    ".takeaway-option"
                );

            const feedback =
                screen.querySelector(
                    ".takeaway-feedback"
                );


            options.forEach(
                function (option) {

                    option.setAttribute(
                        "aria-pressed",
                        "false"
                    );


                    option.addEventListener(
                        "click",
                        function () {

                            options.forEach(
                                function (otherOption) {

                                    otherOption
                                        .classList
                                        .remove("selected");

                                    otherOption.setAttribute(
                                        "aria-pressed",
                                        "false"
                                    );

                                }
                            );


                            option.classList.add(
                                "selected"
                            );

                            option.setAttribute(
                                "aria-pressed",
                                "true"
                            );


                            const understanding =
                                option.dataset.understanding;


                            takeawayAnswers[screenIndex] =
                                understanding;


                            feedback.textContent =
                                takeawayFeedback[
                                    understanding
                                ];


                            feedback.classList.add(
                                "visible"
                            );


                            nextTakeaway.disabled =
                                false;


                            takeawayMessage.textContent =
                                "Notice the reflection, then continue.";

                        }
                    );

                }
            );

        }
    );


    // ======================================
    // NEXT
    // ======================================

    nextTakeaway.addEventListener(
        "click",
        function () {

            if (
                takeawayAnswers[currentTakeaway]
                === null
            ) {
                return;
            }


            if (
                currentTakeaway <
                takeawayScreens.length - 1
            ) {

                showTakeaway(
                    currentTakeaway + 1
                );

            } else {

                finishTakeaway();

            }

        }
    );


    // ======================================
    // BACK
    // ======================================

    previousTakeaway.addEventListener(
        "click",
        function () {

            if (currentTakeaway > 0) {

                showTakeaway(
                    currentTakeaway - 1
                );

            }

        }
    );


    // ======================================
    // FINISH
    // ======================================

    function finishTakeaway() {

        takeawayScreens.forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


        takeawayComplete
            .classList
            .add("active");


        takeawayControls.style.display =
            "none";


        takeawayCounter.textContent =
            "Reflection Complete";


        takeawayProgress.style.width =
            "100%";


        takeawayDots.forEach(
            function (dot) {

                dot.classList.add("active");

            }
        );

    }


    // ======================================
    // INITIALIZE
    // ======================================

    showTakeaway(0);

}


/* =========================================
   RANDOM REMINDER
========================================= */

if (
    anotherReminder &&
    finalReminder
) {

    const reminders = [

        "Someone else's milestone is not a deadline for your own.",

        "Your life does not need to look like someone else's to have value.",

        "You don't have to edit yourself to become worthy of being seen.",

        "A number on a screen cannot measure your value.",

        "Protecting your peace can also be a form of progress.",

        "Accept where you are. Learn from where you've been. Keep becoming who you want to be."

    ];


    let previousReminder = 0;


    anotherReminder.addEventListener(
        "click",
        function () {

            let randomIndex;


            do {

                randomIndex =
                    Math.floor(
                        Math.random() *
                        reminders.length
                    );

            } while (
                randomIndex === previousReminder &&
                reminders.length > 1
            );


            previousReminder =
                randomIndex;


            finalReminder.classList.add(
                "changing"
            );


            setTimeout(
                function () {

                    finalReminder.textContent =
                        `“${reminders[randomIndex]}”`;


                    finalReminder.classList.remove(
                        "changing"
                    );

                },
                220
            );

        }
    );

}