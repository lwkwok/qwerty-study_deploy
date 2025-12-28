
let ALL_WORDS = [];
let WORDS = [];
let current = 0;
let currentChapter = 0;
let phonicsMode = 'natural'; // 'natural' or 'chunked'
const CHAPTER_SIZE = 20;
const rainbowColors = [
    '#e53935', // red
    '#fb8c00', // orange
    '#fdd835', // yellow
    '#43a047', // green
    '#1e88e5', // blue
    '#8e24aa', // purple
    '#00bcd4', // cyan
];

function renderWord(word) {
    const wordDiv = document.getElementById('word');
    if (phonicsMode === 'natural' || !word.namebreak) {
        wordDiv.className = 'word';
        wordDiv.textContent = word.name;
    } else {
        // Chunked mode
        wordDiv.className = 'chunked-phonics';
        wordDiv.innerHTML = '';
        const chunks = word.namebreak.split('-');
        chunks.forEach((chunk, i) => {
            const span = document.createElement('span');
            span.className = 'chunk';
            span.textContent = chunk;
            span.style.color = rainbowColors[i % rainbowColors.length];
            wordDiv.appendChild(span);
            if (i < chunks.length - 1) {
                const hyphen = document.createElement('span');
                hyphen.className = 'hyphen';
                hyphen.textContent = '-';
                wordDiv.appendChild(hyphen);
            }
        });
    }
}

function showWord(idx) {
    const word = WORDS[idx];
    if (!word) return;
    renderWord(word);
    document.getElementById('pos').textContent = word.pos ? word.pos : '';
    document.getElementById('definition').textContent = word.trans[0] || '';
    // Previous
    if (WORDS[idx - 1]) {
        document.getElementById('prevWord').textContent = WORDS[idx - 1].name;
        document.getElementById('prevDef').textContent = (WORDS[idx - 1].trans[0] || '').slice(0, 40) + (WORDS[idx - 1].trans[0].length > 40 ? '...' : '');
    } else {
        document.getElementById('prevWord').textContent = '';
        document.getElementById('prevDef').textContent = '';
    }
    // Next
    if (WORDS[idx + 1]) {
        document.getElementById('nextWord').textContent = WORDS[idx + 1].name;
        document.getElementById('nextDef').textContent = (WORDS[idx + 1].trans[0] || '').slice(0, 40) + (WORDS[idx + 1].trans[0].length > 40 ? '...' : '');
    } else {
        document.getElementById('nextWord').textContent = '';
        document.getElementById('nextDef').textContent = '';
    }
    // Update toggle button label
    const toggleBtn = document.getElementById('phonicsToggle');
    if (toggleBtn) {
        if (phonicsMode === 'natural') {
            toggleBtn.textContent = 'Natural Phonics';
            toggleBtn.classList.remove('active');
        } else {
            toggleBtn.textContent = 'Chunked Phonics';
            toggleBtn.classList.add('active');
        }
    }
}

document.getElementById('prevBtn').onclick = function() {
    if (current > 0) {
        current--;
        showWord(current);
    }
};
document.getElementById('nextBtn').onclick = function() {
    if (current < WORDS.length - 1) {
        current++;
        showWord(current);
    }
};

// Keyboard navigation
window.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        if (current > 0) {
            current--;
            showWord(current);
        }
    } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        if (current < WORDS.length - 1) {
            current++;
            showWord(current);
        }
    } else if (e.code === 'Space' || e.key === ' ') {
        // Prevent page scroll
        e.preventDefault();
        playAudio();
    } else if (e.key.toLowerCase() === 'n') {
        // Toggle Chunked Phonics
        const toggleBtn = document.getElementById('phonicsToggle');
        if (toggleBtn) toggleBtn.click();
    }
});

// Audio playback
function playAudio() {
    const word = WORDS[current];
    if (!word) return;
    // Use browser TTS
    if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(word.name);
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    } else {
        alert('Speech synthesis not supported in this browser.');
    }
}
document.getElementById('audioBtn').onclick = playAudio;
document.getElementById('phonicsToggle').onclick = function() {
    phonicsMode = (phonicsMode === 'natural') ? 'chunked' : 'natural';
    showWord(current);
};

// Wait for words.js to load WORDS, then show first word

function tryShowFirstWord() {
    if (WORDS.length > 0 && document.getElementById('word')) {
        showWord(current);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const fetchUrl = 'dicts/4000_Essential_English_Words-meaning.json';
    fetch(fetchUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error('HTTP error ' + res.status + ': ' + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            ALL_WORDS = data;
            setupChapters();
        })
        .catch(err => {
            const wordDiv = document.getElementById('word');
            if (wordDiv) {
                wordDiv.textContent = 'Failed to load words: ' + err;
            }
        });
});

function setupChapters() {
    const chapterSelect = document.getElementById('chapterSelect');
    if (!chapterSelect) return;
    // Clear any old options
    chapterSelect.innerHTML = '';
    const numChapters = Math.ceil(ALL_WORDS.length / CHAPTER_SIZE);
    for (let i = 0; i < numChapters; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Chapter ${String(i + 1).padStart(2, '0')}`;
        chapterSelect.appendChild(opt);
    }
    chapterSelect.addEventListener('change', function() {
        setChapter(parseInt(this.value, 10));
    });
    setChapter(0);
}

function setChapter(chapterIdx) {
    currentChapter = chapterIdx;
    WORDS = ALL_WORDS.slice(chapterIdx * CHAPTER_SIZE, (chapterIdx + 1) * CHAPTER_SIZE);
    current = 0;
    showWord(current);
}
