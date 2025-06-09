// This function runs when the entire page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- PUZZLE DATA ---
    // In a real app, this might be loaded from a server.
    // For our free version, we define the puzzles right here.
    const puzzles = [
        {
            root: "GRAPH",
            extras: "SICOLE",
            // The complete list of valid answers for this puzzle
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
    // We need to get references to all the parts of our page we want to interact with.
    const rootWordDisplay = document.getElementById('root-word-display');
    const extraLettersDisplay = document.getElementById('extra-letters-display');
    const wordInput = document.getElementById('word-input');
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
        // Pick a puzzle based on the current day
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        currentPuzzle = puzzles[dayOfYear % puzzles.length];

        // Combine root and extra letters to get all allowed letters
        allowedLetters = new Set((currentPuzzle.root + currentPuzzle.extras).split(''));

        // Display the puzzle on the screen
        displayPuzzle();
        setupProgressBars();
    }

    // --- DISPLAY FUNCTIONS ---
    function displayPuzzle() {
        // Clear any previous puzzle
        rootWordDisplay.innerHTML = '';
        extraLettersDisplay.innerHTML = '';

        // Create and display the squares for the root word
        currentPuzzle.root.split('').forEach(letter => {
            const square = document.createElement('div');
            square.className = 'letter-square';
            square.textContent = letter.toUpperCase();
            rootWordDisplay.appendChild(square);
        });

        // Create and display the squares for the extra letters
        currentPuzzle.extras.split('').forEach(letter => {
            const square = document.createElement('div');
            square.className = 'letter-square';
            square.textContent = letter.toUpperCase();
            extraLettersDisplay.appendChild(square);
        });
    }
    
    function setupProgressBars() {
        progressSection.innerHTML = '';
        const wordLengths = {}; // Object to store counts for each word length

        // Group solutions by their length
        currentPuzzle.solutions.forEach(word => {
            const len = word.length;
            if (!wordLengths[len]) {
                wordLengths[len] = { total: 0, found: 0 };
            }
            wordLengths[len].total++;
        });

        // Create a progress bar for each length
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
        const word = wordInput.value.toUpperCase();
        
        // Clear the message area and input field
        displayMessage('');
        wordInput.value = '';

        // --- Validation Checks ---
        if (word.length < 5) {
            displayMessage("Word must be at least 5 letters long.");
            return;
        }
        if (foundWords.includes(word)) {
            displayMessage("Already found!");
            return;
        }
        if (!currentPuzzle.solutions.includes(word.toLowerCase())) {
            displayMessage("Not in the word list.");
            return;
        }

        // If all checks pass, it's a valid word!
        foundWords.push(word);
        
        // Add word to the found list UI
        const listItem = document.createElement('li');
        listItem.textContent = word;
        foundWordsList.appendChild(listItem);
        
        // Sort the list alphabetically
        const sortedItems = Array.from(foundWordsList.getElementsByTagName('li')).sort((a, b) => a.textContent.localeCompare(b.textContent));
        sortedItems.forEach(item => foundWordsList.appendChild(item));
        
        // Update counts and progress bar
        foundWordsCountSpan.textContent = foundWords.length;
        updateProgressBar(word.length);
    }
    
    function updateProgressBar(len) {
        const progressBar = document.getElementById(`progress-${len}`);
        let found = parseInt(progressBar.dataset.found) + 1;
        const total = parseInt(progressBar.dataset.total);
        
        progressBar.dataset.found = found;
        progressBar.style.width = `${(found / total) * 100}%`;
        progressBar.textContent = `${found}/${total}`;
    }

    function displayMessage(msg) {
        messageArea.textContent = msg;
    }

    // --- EVENT LISTENERS ---
    // Listen for click on the submit button
    submitButton.addEventListener('click', handleSubmit);

    // Listen for the "Enter" key being pressed in the input field
    wordInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    // --- START THE GAME ---
    initGame();
});
