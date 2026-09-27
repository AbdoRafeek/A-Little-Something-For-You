const $ = (selector) => {

    return document.querySelector(selector);

};


/* =========================================
   ELEMENTS
========================================= */

const loginScreen = $("#loginScreen");

const story = $("#story");

const loginForm = $("#loginForm");

const loginError = $("#loginError");


/* =========================================
   DATE NORMALIZATION
========================================= */

function normalizeDate(value) {

    return value
        .replace(/\s/g, "")
        .replace(/-/g, "/");

}


/* =========================================
   FLOATING PARTICLES
========================================= */

function createParticles(count = 25) {

    const container = $("#particles");

    for (let i = 0; i < count; i++) {

        const particle = document.createElement("span");

        particle.className = "particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            (70 + Math.random() * 35) + "%";

        particle.style.animationDuration =
            (7 + Math.random() * 8) + "s";

        particle.style.animationDelay =
            Math.random() * 5 + "s";

        particle.style.opacity =
            Math.random() * 0.5 + 0.2;

        container.appendChild(particle);


        setTimeout(() => {

            particle.remove();

        }, 18000);

    }

}


/* =========================================
   PHOTO STORY
========================================= */

function initPhotoStory() {

    const container = $("#photoStory");


    CONFIG.photos.forEach((item, index) => {

        const section =
            document.createElement("section");

        section.className =
            "photo-section";


        section.innerHTML = `

            <div class="photo-inner">

                <div class="photo-image-wrap">

                    <img
                        class="photo-image"
                        src="${item.image}"
                        alt="Memory ${index + 1}"
                    >

                </div>


                <div class="photo-number">

                    ${String(index + 1).padStart(2, "0")}

                    /

                    ${String(CONFIG.photos.length).padStart(2, "0")}

                </div>


                <p class="photo-text">

                    ${item.text}

                </p>

            </div>
        `;


        container.appendChild(section);

    });


    /* Intersection Observer */

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },

            {
                threshold: 0.25
            }

        );


    document
        .querySelectorAll(".photo-section")
        .forEach((section) => {

            observer.observe(section);

        });

}


/* =========================================
   VIDEO
========================================= */

function initVideo() {

    const video =
        $("#storyVideo");


    const source =
        video.querySelector("source");


    source.src =
        CONFIG.video;


    video.load();


    $("#videoCaption").textContent =
        CONFIG.text;

}


/* =========================================
   FINAL SECTION
========================================= */

function initFinal() {

    $("#finalPhoto").src =
        CONFIG.finalPhoto;


    $("#finalDate").textContent =
        CONFIG.finalDate;


    $("#finalText").textContent =
        CONFIG.finalText;


    $("#finalTitle").textContent =
        CONFIG.finalTitle;


    $("#finalMessage").textContent =
        CONFIG.finalMessage;


    $("#finalName").textContent =
        CONFIG.finalName;

}


/* =========================================
   AFTER PUZZLE
========================================= */

function initAfterPuzzle() {

    const photo =
        $("#afterPhoto");

    const text =
        $("#afterText");

    const musicText =
        $("#musicText");

    const musicButton =
        $("#musicButton");

    const musicIcon =
        $("#musicIcon");

    const musicLabel =
        $("#musicLabel");


    photo.src =
        CONFIG.afterPuzzle.photo;


    text.textContent =
        CONFIG.afterPuzzle.text;


    musicText.textContent =
        CONFIG.afterPuzzle.musicText;


    const audio =
        new Audio(CONFIG.afterPuzzle.music);


    audio.loop = true;


    let playing = false;


    musicButton.addEventListener(
        "click",
        () => {

            if (!playing) {

                audio
                    .play()
                    .then(() => {

                        playing = true;

                        musicIcon.textContent =
                            "Ⅱ";

                        musicLabel.textContent =
                            "Pause the song";

                    })
                    .catch(() => {

                        musicText.textContent =
                            "Tap again to play the song.";

                    });

            } else {

                audio.pause();

                playing = false;

                musicIcon.textContent =
                    "▶";

                musicLabel.textContent =
                    "Play the song";

            }

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            playing = false;

            musicIcon.textContent =
                "▶";

            musicLabel.textContent =
                "Play the song";

        }
    );

}

let finalMusicAudio = null;

function initFinalMusic() {

    const button = $("#finalMusicButton");
    const icon = $("#finalMusicIcon");
    const label = $("#finalMusicLabel");
    const text = $("#finalMusicText");

    if (!button) return;

     finalMusicAudio = new Audio(CONFIG.finalMusic);

      const audio = finalMusicAudio;
      audio.preload = "auto";

    if (text) {
        text.textContent =
            CONFIG.finalMusicText || "";
    }

    button.addEventListener("click", async () => {

        try {

            if (audio.paused) {

                await audio.play();

                icon.textContent = "Ⅱ";
                label.textContent = "Pause the song";

            } else {

                audio.pause();

                icon.textContent = "▶";
                label.textContent = "Play the song";

            }

        } catch (error) {

            console.error(
                "Final music playback failed:",
                error
            );

            if (text) {
                text.textContent =
                    "Tap again to play the song.";
            }

        }

    });

    audio.addEventListener("ended", () => {

        icon.textContent = "▶";
        label.textContent = "Play the song";

    });

}

/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    const copy = [...array];


    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}


/* =========================================
   PUZZLE
========================================= */

function initPuzzle() {

    const board =
        $("#puzzleBoard");

    const piecesContainer =
        $("#puzzlePieces");

    const countElement =
        $("#puzzleCount");

    const complete =
        $("#puzzleComplete");

    const message =
        $("#puzzleMessage");


    const total = 9;

    let placed = 0;


    const positions =
        Array.from(
            { length: total },
            (_, i) => i
        );


    const shuffled =
        shuffle(positions);


    /* -------------------------
       CREATE BOARD
    ------------------------- */

    for (let i = 0; i < total; i++) {

        const slot =
            document.createElement("div");


        slot.className =
            "puzzle-slot";


        slot.dataset.position =
            i;


        board.appendChild(slot);

    }


    /* -------------------------
       CREATE PIECES
    ------------------------- */

    shuffled.forEach((correctPosition) => {

        const piece =
            document.createElement("div");


        piece.className =
            "puzzle-piece";


        piece.draggable = true;


        piece.dataset.position =
            correctPosition;


        const row =
            Math.floor(correctPosition / 3);


        const col =
            correctPosition % 3;


        piece.style.backgroundImage =
            `url("${CONFIG.puzzleImage}")`;


        piece.style.backgroundSize =
            "300% 300%";


        piece.style.backgroundPosition =
            `${col * 50}% ${row * 50}%`;


        piecesContainer.appendChild(piece);

    });


    let dragged = null;


    /* -------------------------
       UPDATE COUNTER
    ------------------------- */

    function updateCount() {

        countElement.textContent =
            `${placed} / ${total}`;

    }


    /* -------------------------
       DRAG START
    ------------------------- */

    piecesContainer.addEventListener(
        "dragstart",
        (event) => {

            const piece =
                event.target.closest(
                    ".puzzle-piece"
                );


            if (!piece) return;


            dragged = piece;


            piece.classList.add(
                "dragging"
            );


            event.dataTransfer.setData(
                "text/plain",
                piece.dataset.position
            );

        }
    );


    /* -------------------------
       DRAG END
    ------------------------- */

    piecesContainer.addEventListener(
        "dragend",
        () => {

            if (dragged) {

                dragged.classList.remove(
                    "dragging"
                );

            }


            dragged = null;

        }
    );


    /* -------------------------
       DRAG OVER
    ------------------------- */

    board.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();


            const slot =
                event.target.closest(
                    ".puzzle-slot"
                );


            if (slot) {

                slot.classList.add(
                    "over"
                );

            }

        }
    );


    /* -------------------------
       DRAG LEAVE
    ------------------------- */

    board.addEventListener(
        "dragleave",
        (event) => {

            const slot =
                event.target.closest(
                    ".puzzle-slot"
                );


            if (slot) {

                slot.classList.remove(
                    "over"
                );

            }

        }
    );


    /* -------------------------
       DROP
    ------------------------- */

    board.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();


            const slot =
                event.target.closest(
                    ".puzzle-slot"
                );


            if (
                !slot ||
                !dragged ||
                slot.classList.contains("filled")
            ) {

                return;

            }


            slot.classList.remove(
                "over"
            );


            const correct =
                slot.dataset.position ===
                dragged.dataset.position;


            /* Wrong place */

            if (!correct) {

                wrongPieceAnimation(
                    dragged
                );

                return;

            }


            /* Correct place */

            placePiece(
                slot,
                dragged
            );

        }
    );


    /* =====================================
       MOBILE / TOUCH FALLBACK
    ===================================== */

    let selectedPiece = null;


    piecesContainer.addEventListener(
        "click",
        (event) => {

            const piece =
                event.target.closest(
                    ".puzzle-piece"
                );


            if (!piece) return;


            document
                .querySelectorAll(".puzzle-piece")
                .forEach((p) => {

                    p.style.outline = "";

                });


            selectedPiece = piece;


            piece.style.outline =
                "2px solid rgba(233,138,169,.8)";

        }
    );


    board.addEventListener(
        "click",
        (event) => {

            const slot =
                event.target.closest(
                    ".puzzle-slot"
                );


            if (
                !slot ||
                !selectedPiece ||
                slot.classList.contains("filled")
            ) {

                return;

            }


            const correct =
                slot.dataset.position ===
                selectedPiece.dataset.position;


            if (!correct) {

                wrongPieceAnimation(
                    selectedPiece
                );

                return;

            }


            placePiece(
                slot,
                selectedPiece
            );


            selectedPiece = null;

        }
    );


    /* =====================================
       WRONG PIECE
    ===================================== */

    function wrongPieceAnimation(piece) {

        piece.animate(

            [

                {

                    transform:
                        "translateX(0)"

                },

                {

                    transform:
                        "translateX(-6px)"

                },

                {

                    transform:
                        "translateX(6px)"

                },

                {

                    transform:
                        "translateX(0)"

                }

            ],

            {

                duration: 220

            }

        );

    }


    /* =====================================
       PLACE PIECE
    ===================================== */

    function placePiece(
        slot,
        piece
    ) {

        const clone =
            piece.cloneNode(true);


        clone.draggable = false;


        clone.style.width =
            "100%";


        clone.style.height =
            "100%";


        clone.style.borderRadius =
            "0";


        clone.style.cursor =
            "default";


        clone.style.outline =
            "";


        slot.appendChild(
            clone
        );


        slot.classList.add(
            "filled"
        );


        piece.remove();


        placed++;


        updateCount();


        /* Puzzle finished */

        if (placed === total) {

            setTimeout(() => {

                complete.classList.remove(
                    "hidden"
                );


                message.textContent =
                    CONFIG.puzzleMessage;


                burst();


            }, 450);

        }

    }


    updateCount();

}


/* =========================================
   CONFETTI / BURST
========================================= */

function burst() {

    const symbols = [

        "✦",

        "♡",

        "✧",

        "·"

    ];


    for (let i = 0; i < 35; i++) {

        const element =
            document.createElement("span");


        element.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        element.style.position =
            "fixed";


        element.style.left =
            Math.random() * 100 + "vw";


        element.style.top =
            "45vh";


        element.style.color =
            Math.random() > 0.5
                ? "#e98aa9"
                : "#fff";


        element.style.fontSize =
            (8 + Math.random() * 18) + "px";


        element.style.zIndex =
            "100";


        document.body.appendChild(
            element
        );


        element.animate(

            [

                {

                    transform:
                        "translate(0,0) scale(1)",

                    opacity: 1

                },


                {

                    transform:
                        `translate(
                            ${(Math.random() - 0.5) * 260}px,
                            ${-100 - Math.random() * 420}px
                        )
                        scale(.2)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    900 + Math.random() * 900,

                easing:
                    "cubic-bezier(.2,.7,.2,1)"

            }

        );


        setTimeout(() => {

            element.remove();

        }, 2200);

    }

}

/* =========================================
   TYPEWRITER EFFECT
========================================= */

function typeWriter(element, text, options = {}) {

    if (!element || !text) return;

    if (element.dataset.typed === "true") {
        return;
    }

    element.dataset.typing = "true";

    const speed =
        options.speed || 35;

    const startDelay =
        options.delay || 0;

    const preserveLineBreaks =
        options.preserveLineBreaks !== false;


    /*
       Save original text
    */

    const originalText = text;


    /*
       Clear element
    */

    element.textContent = "";


    /*
       Start typing
    */

    setTimeout(() => {

        let index = 0;


        function typeNext() {

            if (index >= originalText.length) {

                element.textContent =
                    originalText;

                element.dataset.typing = "false";
                element.dataset.typed = "true";

                return;

            }


            const character =
                originalText[index];


            /*
               Preserve normal line breaks
            */

            if (
                preserveLineBreaks &&
                character === "\n"
            ) {

                element.appendChild(
                    document.createElement("br")
                );

            } else {

                element.appendChild(
                    document.createTextNode(
                        character
                    )
                );

            }


            index++;


            /*
               Slightly different speed
               to make the typing feel natural
            */

            let nextSpeed = speed;

            if (character === ".") {
                nextSpeed = speed + 180;
            }

            else if (character === ",") {
                nextSpeed = speed + 100;
            }

            else if (character === "!" || character === "?") {
                nextSpeed = speed + 160;
            }

            else if (character === "\n") {
                nextSpeed = speed + 250;
            }


            setTimeout(
                typeNext,
                nextSpeed
            );

        }


        typeNext();

    }, startDelay);

}


/* =========================================
   TYPEWRITER OBSERVER
========================================= */

function observeTyping(
    element,
    text,
    options = {}
) {

    if (!element) return;


    /*
       Store original text
       so we don't lose it
    */

    const originalText = text;


    /*
       Prevent the observer from
       triggering multiple times
    */

    let started = false;


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting &&
                        !started
                    ) {

                        started = true;

                        typeWriter(
                            element,
                            originalText,
                            options
                        );


                        observer.unobserve(
                            element
                        );

                    }

                });

            },

            {
                threshold:
                    options.threshold || 0.25
            }

        );


    observer.observe(element);

}


/* =========================================
   INIT TYPING EFFECTS
========================================= */

function initTypingEffects() {


    /* =====================================
       INTRO
    ===================================== */

    const introTitle =
        document.querySelector(
            ".intro-title"
        );


    if (introTitle) {

        const introText =
            introTitle.textContent.trim();


        typeWriter(
            introTitle,
            introText,
            {
                speed: 45,
                delay: 500
            }
        );

    }


    /* =====================================
       PHOTO TEXTS
    ===================================== */

    document
        .querySelectorAll(".photo-section")
        .forEach((section) => {

            const text =
                section.querySelector(
                    ".photo-text"
                );


            if (!text) return;


            const originalText =
                text.textContent.trim();


            text.textContent = "";


            observeTyping(
                text,
                originalText,
                {
                    speed: 35,
                    threshold: 0.35
                }
            );

        });


    /* =====================================
       VIDEO CAPTION
    ===================================== */

    const videoCaption =
        $("#videoCaption");


    if (videoCaption) {

        const originalText =
            videoCaption.textContent.trim();


        videoCaption.textContent = "";


        observeTyping(
            videoCaption,
            originalText,
            {
                speed: 38,
                threshold: 0.4
            }
        );

    }


    /* =====================================
       PUZZLE MESSAGE
    ===================================== */

    const puzzleMessage =
        $("#puzzleMessage");


    if (puzzleMessage) {

        /*
           Puzzle message is handled
           when the puzzle is completed.
        */

        puzzleMessage.dataset
            .typingReady = "true";

    }


    /* =====================================
       AFTER PUZZLE TEXT
    ===================================== */

    const afterText =
        $("#afterText");


    if (afterText) {

        const originalText =
            afterText.textContent.trim();


        afterText.textContent = "";


        observeTyping(
            afterText,
            originalText,
            {
                speed: 30,
                threshold: 0.35
            }
        );

    }


    /* =====================================
       MUSIC TEXT
    ===================================== */

    const musicText =
        $("#musicText");


    if (musicText) {

        const originalText =
            musicText.textContent.trim();


        musicText.textContent = "";


        observeTyping(
            musicText,
            originalText,
            {
                speed: 38,
                threshold: 0.45
            }
        );

    }


    /* =====================================
       FINAL DATE
    ===================================== */

    const finalDate =
        $("#finalDate");


    if (finalDate) {

        const originalText =
            finalDate.textContent.trim();


        finalDate.textContent = "";


        observeTyping(
            finalDate,
            originalText,
            {
                speed: 55,
                threshold: 0.5
            }
        );

    }


    /* =====================================
       FINAL TEXT
    ===================================== */

    const finalText =
        $("#finalText");


    if (finalText) {

        const originalText =
            finalText.textContent.trim();


        finalText.textContent = "";


        observeTyping(
            finalText,
            originalText,
            {
                speed: 28,
                threshold: 0.3
            }
        );

    }


    /* =====================================
       FINAL TITLE
    ===================================== */

    const finalTitle =
        $("#finalTitle");


    if (finalTitle) {

        const originalText =
            finalTitle.textContent.trim();


        finalTitle.textContent = "";


        observeTyping(
            finalTitle,
            originalText,
            {
                speed: 50,
                threshold: 0.5
            }
        );

    }


    /* =====================================
       FINAL MESSAGE
    ===================================== */

    const finalMessage =
        $("#finalMessage");


    if (finalMessage) {

        const originalText =
            finalMessage.textContent.trim();


        finalMessage.textContent = "";


        observeTyping(
            finalMessage,
            originalText,
            {
                speed: 40,
                threshold: 0.5
            }
        );

    }


    /* =====================================
       FINAL NAME
    ===================================== */

    const finalName =
        $("#finalName");


    if (finalName) {

        const originalText =
            finalName.textContent.trim();


        finalName.textContent = "";


        observeTyping(
            finalName,
            originalText,
            {
                speed: 55,
                threshold: 0.5
            }
        );

    }

}

/* =========================================
   SHOW STORY
========================================= */

function showStory() {

    loginScreen.classList.add(
        "hidden"
    );


    story.classList.remove(
        "hidden"
    );


    document.body.style.overflowX =
        "hidden";


    /* Initialize everything */

    initPhotoStory();

    initVideo();

    initFinal();

    initPuzzle();

    initAfterPuzzle();

    initFinalMusic();

    initTypingEffects();


    /* Initial particles */

    createParticles(45);


    /* Keep adding particles */

    setInterval(() => {

        createParticles(7);

    }, 5000);


    window.scrollTo({

        top: 0,

        behavior: "instant"

    });

}


/* =========================================
   LOGIN
========================================= */

loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const username =
            $("#username").value.trim();


        const password =
            $("#password").value;


        if (
            username === CONFIG.username &&
            password === CONFIG.password
        ) {

            loginError.textContent =
                "";


            showStory();


            return;

        }


        loginError.textContent =
            "That's not it... try again.";


        $("#password").value =
            "";

    }
);


/* =========================================
   SECRET DATE
========================================= */

$("#dateForm").addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const entered =
            normalizeDate(
                $("#dateInput").value
            );


        const correct =
            normalizeDate(
                CONFIG.secretDate
            );


        if (entered === correct) {

            $("#dateError").textContent =
                "";


            $("#unlocked").classList.remove(
                "hidden"
            );


            burst();


            setTimeout(() => {

                $("#unlocked").scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }, 250);


            return;

        }


        $("#dateError").textContent =
            "Not quite... think again.";

    }
);


/* =========================================
   DATE INPUT FORMAT
========================================= */
/* =========================================
   DATE INPUT FORMAT
========================================= */

$("#dateInput").addEventListener(
    "input",
    (event) => {

        let value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 8);


        if (value.length > 4) {

            value =
                value.replace(
                    /^(\d{2})(\d{2})(\d{1,4}).*/,
                    "$1/$2/$3"
                );

        }


        else if (value.length > 2) {

            value =
                value.replace(
                    /^(\d{2})(\d{1,2})/,
                    "$1/$2"
                );

        }


        event.target.value =
            value;


        /* =========================================
           AUTO PLAY FINAL SONG
        ========================================= */

        const entered =
            normalizeDate(value);

        const correct =
            normalizeDate(CONFIG.secretDate);


        if (
            entered === correct &&
            value.length === 10 &&
            finalMusicAudio
        ) {

            finalMusicAudio
                .play()
                .then(() => {

                    const icon =
                        $("#finalMusicIcon");

                    const label =
                        $("#finalMusicLabel");


                    if (icon)
                        icon.textContent =
                            "Ⅱ";


                    if (label)
                        label.textContent =
                            "Pause the song";

                })
                .catch((error) => {

                    console.error(
                        "Auto music playback failed:",
                        error
                    );

                });

        }

    }
);


/* =========================================
   CONTINUE AFTER PUZZLE
========================================= */

$("#continueBtn").addEventListener(
    "click",
    () => {

        document
            .querySelector(".date-section")
            .scrollIntoView({

                behavior: "smooth"

            });

    }
);
