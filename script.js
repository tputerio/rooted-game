// This function runs when the entire page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- PUZZLE DATA ---
    const puzzles = [
        {
            root: "GRAPH",
            extras: "SICOLE",
            // The complete list of valid answers for this puzzle - must be uppercase
            solutions: ["GRAPHS", "GRAPHIC", "HOLOGRAPH", "GRAPHICS", "GRAPHICAL", "CHOREOGRAPH"]
        },
        {
            root: "TRACT",
            extras: "SONIED",
            solutions: [
                "TRACTS", "RETRACT", "DETRACT", "ATTRACT", "TRACTOR", "RETRACTS", "DETRACTS", "ATTRACTS", "CONTRACT", 
                "DISTRACT", "TRACTORS", "TRACTION", "ATTRACTION", "CONTRACTS", "DISTRACTS", "TRACTIONS", "DETRACTION", 
                "RETRACTION", "ATTRACTIONS", "CONTRACTION", "DISTRACTION", "CONTRACTIONS", "DISTRACTIONS"
            ]
        },
        {
            root: "PORT",
            extras: "ASIDUE",
            solutions: ["SPORTE", "DUPORT", "AIRPOT", "PASSPORT", "RAPPORT", "DEPORT", "IMPORT", "EXPORT", "REPORT", "SUPPORT"]
        }
        // You can add more puzzle objects here!
    ];

    // --- GETTING HTML ELEMENTS ---
    const rootWordDisplay = document.getElementById('root-word-display');
    const extraLettersDisplay = document.getElementById('extra-letters-display');
    const hiddenWordInput = document.getElementById('hidden-word-input'); // The real (hidden) input
    const textDisplayContainer = document.getElementById('text-display-container'); // The fake input container
    const typedTextDisplay = document.getElementById('typed-text-display'); // The span that shows the typed text
    const submitButton = document.getElementById('submit-button');
    const messageArea = document.getElementById('message-area');
    const progressSection = document.getElementById('progress-section');
    const foundWordsList = document.getElementById('found-words-list');
    const foundWordsCountSpan = document.getElementById('found-words-count');

    let currentPuzzle;
    let allowedLetters;
    let foundWords = [];

    // --- INITIALIZE THE GAME ---
    function initGame() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        currentPuzzle = puzzles[dayOfYear % puzzles.length];
        allowedLetters = new Set((currentPuzzle.root + currentPuzzle.extras).split(''));
        displayPuzzle();
        setupProgressBars();
        // Focus the hidden input by default
        hiddenWordInput.focus();
    }

    // --- DISPLAY FUNCTIONS ---
    function displayPuzzle() {
        rootWordDisplay.innerHTML = '';
        extraLettersDisplay.innerHTML = '';

        currentPuzzle.root.split('').forEach(letter => {
            const square = document.createElement('div');
            square.className = 'letter-square';
            square.textContent = letter.toUpperCase();
            rootWordDisplay.appendChild(square);
        });

        currentPuzzle.extras.split('').forEach(letter => {
            const square = document.createElement('div');
            square.className = 'letter-square';
            square.textContent = letter.toUpperCase();
            extraLettersDisplay.appendChild(square);
        });
    }
    
    function setupProgressBars() {
        progressSection.innerHTML = '';
        const wordLengths = {};

        currentPuzzle.solutions.forEach(word => {
            const len = word.length;
            if (!wordLengths[len]) {
                wordLengths[len] = { total: 0, found: 0 };
            }
            wordLengths[len].total++;
        });

        Object.keys(wordLengths).sort((a,b) => a-b).forEach(len => {
            const total = wordLengths[len].total;
            const container = document.createElement('div');
            container.className = 'progress-bar-container';
            container.innerHTML = `
                <div class="progress-label">${len}-Letter Words</div>
                <div class="progress-bar-background">
                    <div class="progress-bar-inner" id="progress-${len}" data-found="0" data-total="${total}">0/${total}</div>
                </div>
            `;
            progressSection.appendChild(container);
        });
    }

    // --- GAME LOGIC ---
    function handleSubmit() {
        // Get the value from the hidden input field
        const word = hiddenWordInput.value.toUpperCase();
        
        displayMessage('');
        // Clear both the hidden input and the visual display
        hiddenWordInput.value = '';
        typedTextDisplay.textContent = '';


        // --- Validation Checks ---
        if (word.length < 5) {
            displayMessage("Word must be at least 5 letters long.");
            return;
        }
        if (foundWords.includes(word)) {
            displayMessage("Already found!");
            return;
        }
        
        // **BUG FIX**: Check the uppercase word against the solutions array.
        // The .includes() method is case-sensitive, so we ensure both are uppercase.
        if (!currentPuzzle.solutions.includes(word)) {
            displayMessage("Not in the word list.");
            return;
        }

        // If all checks pass, it's a valid word!
        foundWords.push(word);
        
        const listItem = document.createElement('li');
        listItem.textContent = word;
        foundWordsList.appendChild(listItem);
        
        const sortedItems = Array.from(foundWordsList.getElementsByTagName('li')).sort((a, b) => a.textContent.localeCompare(b.textContent));
        sortedItems.forEach(item => foundWordsList.appendChild(item));
        
        foundWordsCountSpan.textContent = foundWords.length;
        updateProgressBar(word.length);
    }
    
    function updateProgressBar(len) {
        const progressBar = document.getElementById(`progress-${len}`);
        if (progressBar) { // Make sure the progress bar exists
            let found = parseInt(progressBar.dataset.found) + 1;
            const total = parseInt(progressBar.dataset.total);
            
            progressBar.dataset.found = found;
            progressBar.style.width = `${(found / total) * 100}%`;
            progressBar.textContent = `${found}/${total}`;
        }
    }

    function displayMessage(msg) {
        messageArea.textContent = msg;
    }

    // --- EVENT LISTENERS ---
    submitButton.addEventListener('click', handleSubmit);

    // Make it so clicking the display area focuses the hidden input
    textDisplayContainer.addEventListener('click', () => {
        hiddenWordInput.focus();
    });

    // Sync the hidden input's value with the visual display
    hiddenWordInput.addEventListener('input', () => {
        typedTextDisplay.textContent = hiddenWordInput.value.toUpperCase();
    });
    
    // Listen for the "Enter" key on the whole page, which is better for accessibility
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    // --- START THE GAME ---
    initGame();
});
