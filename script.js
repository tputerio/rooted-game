document.addEventListener('DOMContentLoaded', () => {

    // --- PUZZLE DATA ---
    const puzzles = [
        { root: "GRAPH", extras: "SICOLE", solutions: ["GRAPHS", "GRAPHIC", "HOLOGRAPH", "GRAPHICS", "GRAPHICAL", "CHOREOGRAPH"] },
        { root: "TRACT", extras: "SONIED", solutions: ["TRACTS", "RETRACT", "DETRACT", "ATTRACT", "TRACTOR", "RETRACTS", "DETRACTS", "ATTRACTS", "CONTRACT", "DISTRACT", "TRACTORS", "TRACTION", "ATTRACTION", "CONTRACTS", "DISTRACTS", "TRACTIONS", "DETRACTION", "RETRACTION", "RETRACTED", "ATTRACTIONS", "CONTRACTION", "DISTRACTION", "CONTRACTIONS", "DISTRACTIONS"] },
        { root: "PORT", extras: "ASIDUE", solutions: ["SPORTE", "DUPORT", "AIRPOT", "PASSPORT", "RAPPORT", "DEPORT", "IMPORT", "EXPORT", "REPORT", "SUPPORT"] }
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
    const deleteButton = document.getElementById('delete-button');
    const shuffleButton = document.getElementById('shuffle-button');
    const submitButton = document.getElementById('submit-button');
    const resultsToggle = document.getElementById('results-toggle');
    const collapsibleContent = document.getElementById('collapsible-content');
    const toggleArrow = document.getElementById('toggle-arrow');

    let currentPuzzle;
    let allowedLetters;
    let currentExtraLetters;
    let foundWords = [];

    // --- INITIALIZE THE GAME ---
    function initGame() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        currentPuzzle = puzzles[dayOfYear % puzzles.length];
        currentExtraLetters = currentPuzzle.extras.toUpperCase().split('');
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
        currentPuzzle.root.toUpperCase().split('').forEach(letter => createLetterSquare(letter, rootWordDisplay, true));
        currentExtraLetters.forEach(letter => createLetterSquare(letter, extraLettersDisplay, false));
    }

    function createLetterSquare(letter, container, isRoot) {
        const square = document.createElement('button'); // Changed to button for better accessibility
        square.className = 'letter-square';
        if (isRoot) square.classList.add('root');
        square.textContent = letter;
        square.dataset.letter = letter; // Store letter in data attribute
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
            entry.innerHTML = `<div class="progress-bar-container"><div class="progress-label">${len}-Letter Words</div><div class="progress-bar-background"><div class="progress-bar-inner" id="progress-${len}" data-found="0" data-total="${total}">0/${total}</div></div></div>`;
            progressSection.appendChild(entry);
        });
    }

    // --- GAME LOGIC ---
    function handleSubmit() {
        const word = hiddenWordInput.value.toUpperCase();
        displayMessage('');
        
        if (word.length < 5) {
            clearInput();
            return; 
        }
        if (!word.includes(currentPuzzle.root.toUpperCase())) {
            displayMessage("Word must contain the root.");
            clearInput();
            return;
        }
        if (!validateAllLettersUsedAreAllowed(word)) {
             displayMessage("Word contains invalid letters.");
             clearInput();
             return;
        }
        if (foundWords.includes(word)) {
            displayMessage("Already found!");
            clearInput();
            return;
        }
        if (!currentPuzzle.solutions.includes(word)) {
            displayMessage("Not in the word list.");
            clearInput();
            return;
        }

        foundWords.push(word);
        updateProgressBar(word.length);
        updateFoundWordsSummary();
        clearInput();
    }
    
    // --- HELPER & UPDATE FUNCTIONS ---
    function clearInput() {
        hiddenWordInput.value = '';
        typedTextDisplay.innerHTML = '';
    }

    function updateFoundWordsSummary() {
        foundWordsSummarySpan.textContent = `${foundWords.length} of ${currentPuzzle.solutions.length} words found`;
    }

    function updateProgressBar(len) {
        const progressBar = document.getElementById(`progress-${len}`);
        if (progressBar) {
            let found = parseInt(progressBar.dataset.found) + 1;
            const total = parseInt(progressBar.dataset.total);
            progressBar.dataset.found = found;
            progressBar.style.width = `${(found / total) * 100}%`;
            progressBar.textContent = `${found}/${total}`;
        }
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
    
    function shuffleExtraLetters() {
        for (let i = currentExtraLetters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentExtraLetters[i], currentExtraLetters[j]] = [currentExtraLetters[j], currentExtraLetters[i]];
        }
        displayPuzzle(); // Redisplay the shuffled letters
    }

    // --- EVENT LISTENERS ---
    textDisplayContainer.addEventListener('click', () => hiddenWordInput.focus());
    hiddenWordInput.addEventListener('input', handleInputStyling);

    // Button click listeners
    deleteButton.addEventListener('click', () => {
        hiddenWordInput.value = hiddenWordInput.value.slice(0, -1);
        handleInputStyling();
    });
    shuffleButton.addEventListener('click', shuffleExtraLetters);
    submitButton.addEventListener('click', handleSubmit);

    // Add click listeners to letter squares
    document.addEventListener('click', (event) => {
        if (event.target.matches('.letter-square')) {
            const letter = event.target.dataset.letter;
            hiddenWordInput.value += letter;
            handleInputStyling();
            
            // "Click" animation
            event.target.classList.add('clicked');
            setTimeout(() => event.target.classList.remove('clicked'), 100);
        }
    });

    // Keyboard animation listeners
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') submitButton.classList.add('pressed');
        if (event.key === 'Backspace') deleteButton.classList.add('pressed');
    });
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            submitButton.classList.remove('pressed');
            handleSubmit();
        }
        if (event.key === 'Backspace') deleteButton.classList.remove('pressed');
    });

    // Modal listeners
    howToPlayButton.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.classList.add('hidden');
    });

    // Collapsible progress listener
    resultsToggle.addEventListener('click', () => {
        collapsibleContent.classList.toggle('expanded');
        toggleArrow.style.transform = collapsibleContent.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // --- START THE GAME ---
    initGame();
});
