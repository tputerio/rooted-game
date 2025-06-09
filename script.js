document.addEventListener('DOMContentLoaded', () => {

    // --- PUZZLE DATA ---
    const puzzles = [
        {
            root: "GRAPH",
            extras: "SICOLE",
            solutions: ["GRAPHS", "GRAPHIC", "HOLOGRAPH", "GRAPHICS", "GRAPHICAL", "CHOREOGRAPH"]
        },
        {
            root: "TRACT",
            extras: "SONIED",
            solutions: [
                "TRACTS", "RETRACT", "DETRACT", "ATTRACT", "TRACTOR", "RETRACTS", "DETRACTS", "ATTRACTS", "CONTRACT", 
                "DISTRACT", "TRACTORS", "TRACTION", "ATTRACTION", "CONTRACTS", "DISTRACTS", "TRACTIONS", "DETRACTION", 
                "RETRACTION", "RETRACTED", "ATTRACTIONS", "CONTRACTION", "DISTRACTION", "CONTRACTIONS", "DISTRACTIONS"
            ]
        },
        {
            root: "PORT",
            extras: "ASIDUE",
            solutions: ["SPORTE", "DUPORT", "AIRPOT", "PASSPORT", "RAPPORT", "DEPORT", "IMPORT", "EXPORT", "REPORT", "SUPPORT"]
        }
    ];

    // --- GETTING HTML ELEMENTS ---
    const rootWordDisplay = document.getElementById('root-word-display');
    const extraLettersDisplay = document.getElementById('extra-letters-display');
    const hiddenWordInput = document.getElementById('hidden-word-input');
    const textDisplayContainer = document.getElementById('text-display-container');
    const typedTextDisplay = document.getElementById('typed-text-display');
    const messageArea = document.getElementById('message-area');
    const progressSection = document.getElementById('progress-section');
    const foundWordsSummarySpan = document.getElementById('found-words-summary');
    const howToPlayButton = document.getElementById('how-to-play-button');
    const modal = document.getElementById('how-to-play-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    let currentPuzzle;
    let allowedLetters;
    let foundWords = [];

    // --- INITIALIZE THE GAME ---
    function initGame() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        currentPuzzle = puzzles[dayOfYear % puzzles.length];
        allowedLetters = new Set((currentPuzzle.root + currentPuzzle.extras).toUpperCase().split(''));
        displayPuzzle();
        setupProgressBars();
        updateFoundWordsSummary();
        hiddenWordInput.focus();
    }

    // --- DISPLAY FUNCTIONS ---
    function displayPuzzle() {
        rootWordDisplay.innerHTML = '';
        extraLettersDisplay.innerHTML = '';
        currentPuzzle.root.split('').forEach(letter => createLetterSquare(letter, rootWordDisplay));
        currentPuzzle.extras.split('').forEach(letter => createLetterSquare(letter, extraLettersDisplay));
    }

    function createLetterSquare(letter, container) {
        const square = document.createElement('div');
        square.className = 'letter-square';
        square.textContent = letter.toUpperCase();
        container.appendChild(square);
    }
    
    function setupProgressBars() {
        progressSection.innerHTML = '';
        const wordLengths = {};

        currentPuzzle.solutions.forEach(word => {
            const len = word.length;
            if (!wordLengths[len]) wordLengths[len] = { total: 0 };
            wordLengths[len].total++;
        });

        Object.keys(wordLengths).sort((a,b) => a-b).forEach(len => {
            const total = wordLengths[len].total;
            const entry = document.createElement('div');
            entry.className = 'progress-entry';
            entry.innerHTML = `
                <div class="progress-bar-container">
                    <div class="progress-label">${len}-Letter Words</div>
                    <div class="progress-bar-background">
                        <div class="progress-bar-inner" id="progress-${len}" data-found="0" data-total="${total}">0/${total}</div>
                    </div>
                    <span class="celebration-emoji" id="celebrate-${len}">✨</span>
                </div>
                <ul class="found-words-for-length" id="found-words-${len}"></ul>
            `;
            progressSection.appendChild(entry);
        });
    }

    // --- GAME LOGIC ---
    function handleSubmit() {
        const word = hiddenWordInput.value.toUpperCase();
        
        displayMessage('');
        hiddenWordInput.value = '';
        typedTextDisplay.innerHTML = '';

        if (word.length < 5) return; 
        if (!word.includes(currentPuzzle.root.toUpperCase())) {
            displayMessage("Word must contain the root.");
            return;
        }
        if (!validateAllLettersUsedAreAllowed(word)) {
             displayMessage("Word contains invalid letters.");
             return;
        }
        if (foundWords.includes(word)) {
            displayMessage("Already found!");
            return;
        }
        if (!currentPuzzle.solutions.includes(word)) {
            displayMessage("Not in the word list.");
            return;
        }

        foundWords.push(word);
        
        const wordList = document.getElementById(`found-words-${word.length}`);
        if(wordList) {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordList.appendChild(listItem);
        }
        
        updateProgressBar(word.length);
        updateFoundWordsSummary();
    }
    
    // --- HELPER & UPDATE FUNCTIONS ---
    function updateFoundWordsSummary() {
        foundWordsSummarySpan.textContent = `${foundWords.length} of ${currentPuzzle.solutions.length}`;
    }

    function updateProgressBar(len) {
        const progressBar = document.getElementById(`progress-${len}`);
        if (progressBar) {
            let found = parseInt(progressBar.dataset.found) + 1;
            const total = parseInt(progressBar.dataset.total);
            
            progressBar.dataset.found = found;
            progressBar.style.width = `${(found / total) * 100}%`;
            progressBar.textContent = `${found}/${total}`;

            if (found === total) {
                triggerCelebration(len);
            }
        }
    }

    function triggerCelebration(len) {
        const emoji = document.getElementById(`celebrate-${len}`);
        emoji.classList.add('celebrate');
        setTimeout(() => emoji.classList.remove('celebrate'), 700);
    }

    function displayMessage(msg) {
        messageArea.textContent = msg;
        setTimeout(() => messageArea.textContent = '', 2000);
    }

    function handleInputStyling() {
        const currentText = hiddenWordInput.value.toUpperCase();
        typedTextDisplay.innerHTML = ''; 

        for (const letter of currentText) {
            const span = document.createElement('span');
            span.textContent = letter;
            span.className = allowedLetters.has(letter) ? 'valid-letter' : 'invalid-letter';
            typedTextDisplay.appendChild(span);
        }
    }

    function validateAllLettersUsedAreAllowed(word) {
        return [...word].every(letter => allowedLetters.has(letter));
    }

    // --- EVENT LISTENERS ---
    textDisplayContainer.addEventListener('click', () => hiddenWordInput.focus());
    hiddenWordInput.addEventListener('input', handleInputStyling);
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') handleSubmit();
    });

    // Modal listeners
    howToPlayButton.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    modal.addEventListener('click', (event) => {
        if (event.target === modal) { 
            modal.classList.add('hidden');
        }
    });

    // --- START THE GAME ---
    initGame();
});
