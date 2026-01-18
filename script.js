// Letter Sign Language Converter - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('textInput');
    const signOutput = document.getElementById('signOutput');
    const englishBtn = document.getElementById('englishBtn');
    const arabicBtn = document.getElementById('arabicBtn');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const wordCountEl = document.getElementById('wordCount');
    const letterCountEl = document.getElementById('letterCount');
    
    // App State
    let currentLanguage = 'en';
    let wordCount = 0;
    let letterCount = 0;
    const IMAGE_BASE_PATH = 'images';
    
    // Character mapping for Arabic letters
    const arabicCharMap = {
        'ا': 'ALEF', 'أ': 'ALEF_HAMZA_ABOVE', 'إ': 'ALEF_HAMZA_BELOW', 'آ': 'ALEF_MADDA',
        'ب': 'BA', 'ت': 'TA', 'ث': 'THA',
        'ج': 'JEEM', 'ح': 'HA', 'خ': 'KHA',
        'د': 'DAL', 'ذ': 'THAL', 'ر': 'RA', 'ز': 'ZAY',
        'س': 'SEEN', 'ش': 'SHEEN', 'ص': 'SAD', 'ض': 'DAD',
        'ط': 'TAH', 'ظ': 'ZAH', 'ع': 'AIN', 'غ': 'GHAIN',
        'ف': 'FA', 'ق': 'QAF', 'ك': 'KAF', 'ل': 'LAM',
        'م': 'MEEM', 'ن': 'NOON', 'ه': 'HA2',
        'و': 'WAW', 'ي': 'YEH', 'ى': 'ALEF_MAKSURA',
        'ة': 'TEH_MARBUTA', 'ئ': 'YEH_HAMZA_ABOVE', 'ؤ': 'WAW_HAMZA'
    };
    
    // Language settings
    const languageSettings = {
        en: {
            placeholder: "Type your text here... For example: 'He is playing football'",
            direction: 'ltr',
            font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        ar: {
            placeholder: "اكتب النص هنا... على سبيل المثال: 'هو يلعب كرة القدم'",
            direction: 'rtl',
            font: "'Arial', 'Segoe UI', 'Tahoma', sans-serif"
        }
    };
    
    // Initialize the app
    function initApp() {
        setLanguage('en');
        setupEventListeners();
        updateCounters();
    }
    
    // Set language
    function setLanguage(lang) {
        currentLanguage = lang;
        
        // Update button states
        englishBtn.classList.toggle('active', lang === 'en');
        arabicBtn.classList.toggle('active', lang === 'ar');
        
        // Update textarea
        const settings = languageSettings[lang];
        textInput.placeholder = settings.placeholder;
        textInput.style.direction = settings.direction;
        textInput.style.fontFamily = settings.font;
        
        if (lang === 'ar') {
            textInput.classList.add('rtl');
        } else {
            textInput.classList.remove('rtl');
        }
        
        // Clear output when language changes
        clearOutput();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        englishBtn.addEventListener('click', () => setLanguage('en'));
        arabicBtn.addEventListener('click', () => setLanguage('ar'));
        convertBtn.addEventListener('click', convertText);
        clearBtn.addEventListener('click', clearAll);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            // Ctrl/Cmd + Enter to convert
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                convertText();
            }
            
            // Ctrl/Cmd + L to clear
            if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
                event.preventDefault();
                clearAll();
            }
            
            // Escape to clear focus
            if (event.key === 'Escape') {
                textInput.blur();
            }
        });
        
        // Update counters on input
        textInput.addEventListener('input', updateCounters);
    }
    
    // Update word and letter counters
    function updateCounters() {
        const text = textInput.value.trim();
        
        // Count words
        const words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount = words.length;
        
        // Count letters (excluding spaces)
        letterCount = text.replace(/\s+/g, '').length;
        
        // Update display
        wordCountEl.textContent = wordCount;
        letterCountEl.textContent = letterCount;
    }
    
    // Convert text to letter signs
    async function convertText() {
        const text = textInput.value.trim();
        
        if (!text) {
            showError('Please enter some text to convert!');
            return;
        }
        
        // Clear previous output
        clearOutput();
        
        // Split text into words
        const words = text.split(/[\s,.!?;:]+/).filter(word => word.length > 0);
        
        if (words.length === 0) {
            showError('No valid words found. Please enter some text.');
            return;
        }
        
        // Show loading state
        const originalBtnText = convertBtn.innerHTML;
        convertBtn.innerHTML = '<div class="loading"></div> Converting...';
        convertBtn.disabled = true;
        
        try {
            // Process each word
            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                await createWordDisplay(words[wordIndex], wordIndex);
            }
            
            // Add copy button
            addCopyButton();
            
        } catch (error) {
            console.error('Conversion error:', error);
            showError('An error occurred while converting. Please try again.');
        } finally {
            // Reset button
            convertBtn.innerHTML = originalBtnText;
            convertBtn.disabled = false;
        }
    }
    
    // Create word display with letters
    async function createWordDisplay(word, wordIndex) {
        return new Promise((resolve) => {
            // Create word container
            const wordContainer = document.createElement('div');
            wordContainer.className = 'word-container';
            wordContainer.style.animationDelay = `${wordIndex * 0.1}s`;
            
            // Create word header
            const wordHeader = document.createElement('div');
            wordHeader.className = 'word-text';
            
            // Add word
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordHeader.appendChild(wordSpan);
            
            // Add language indicator
            const langIndicator = document.createElement('span');
            langIndicator.className = 'language-indicator';
            langIndicator.textContent = currentLanguage === 'en' ? 'ENGLISH' : 'ARABIC';
            langIndicator.title = `Language: ${currentLanguage === 'en' ? 'English' : 'Arabic'}`;
            wordHeader.appendChild(langIndicator);
            
            // Add word number
            const wordNumber = document.createElement('span');
            wordNumber.className = 'language-indicator';
            wordNumber.textContent = `Word ${wordIndex + 1} of ${wordCount}`;
            wordNumber.title = `Word position: ${wordIndex + 1}`;
            wordHeader.appendChild(wordNumber);
            
            wordContainer.appendChild(wordHeader);
            
            // Create letters container
            const lettersContainer = document.createElement('div');
            lettersContainer.className = 'letters-container';
            
            // Process each letter
            const letters = word.split('');
            const letterPromises = [];
            
            letters.forEach((letter, letterIndex) => {
                const promise = createLetterElement(lettersContainer, letter, letterIndex, letters.length);
                letterPromises.push(promise);
            });
            
            // Wait for all letters to be created
            Promise.all(letterPromises).then(() => {
                wordContainer.appendChild(lettersContainer);
                signOutput.appendChild(wordContainer);
                resolve();
            });
        });
    }
    
    // Create letter element
    async function createLetterElement(container, letter, index, totalLetters) {
        return new Promise((resolve) => {
            // Create letter group
            const letterGroup = document.createElement('div');
            letterGroup.className = 'letter-group';
            letterGroup.style.animationDelay = `${index * 0.1}s`;
            
            // Get display letter and filename
            const displayLetter = currentLanguage === 'en' ? letter.toUpperCase() : letter;
            const fileName = getFileNameForLetter(letter);
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'letter-image-container';
            
            // Create image element
            const img = document.createElement('img');
            img.className = 'letter-sign-image';
            img.alt = `Sign language for letter ${displayLetter}`;
            img.title = `Letter: ${displayLetter}`;
            img.dataset.letter = displayLetter;
            img.dataset.filename = fileName;
            
            // Set image source
            const imagePath = `${IMAGE_BASE_PATH}/${currentLanguage}/${fileName}.png`;
            img.src = imagePath;
            
            // Create fallback text (shown if image fails to load)
            const fallbackText = document.createElement('div');
            fallbackText.className = 'letter-fallback';
            fallbackText.textContent = displayLetter;
            fallbackText.style.display = 'none'; // Hidden by default
            
            // Handle image load
            img.onload = function() {
                // Image loaded successfully
                img.style.display = 'block';
                fallbackText.style.display = 'none';
                imageContainer.classList.add('has-image');
                imageContainer.classList.remove('loading', 'failed');
                
                // Update format indicator
                updateFormatIndicator(letterGroup, 'PNG');
                resolve();
            };
            
            // Handle image error
            img.onerror = function() {
                // Image failed to load
                img.style.display = 'none';
                fallbackText.style.display = 'block';
                imageContainer.classList.add('failed');
                imageContainer.classList.remove('loading', 'has-image');
                
                // Update format indicator
                updateFormatIndicator(letterGroup, 'TEXT');
                resolve();
            };
            
            // Add image and fallback to container
            imageContainer.appendChild(img);
            imageContainer.appendChild(fallbackText);
            
            // Add click to copy functionality
            imageContainer.addEventListener('click', function() {
                copyToClipboard(displayLetter);
                showMessage(`Copied: ${displayLetter}`);
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
            
            // Create letter label
            const letterLabel = document.createElement('div');
            letterLabel.className = 'letter-label';
            letterLabel.textContent = `Letter ${index + 1}`;
            
            // Add to group
            letterGroup.appendChild(imageContainer);
            letterGroup.appendChild(letterLabel);
            
            // Add to container
            container.appendChild(letterGroup);
            
            // Add separator (except for last letter)
            if (index < totalLetters - 1) {
                const separator = document.createElement('div');
                separator.className = 'letter-separator';
                container.appendChild(separator);
            }
        });
    }
    
    // Get filename for letter
    function getFileNameForLetter(letter) {
        if (currentLanguage === 'en') {
            // English: uppercase letters
            return letter.toUpperCase();
        } else {
            // Arabic: use mapping or the letter itself
            return arabicCharMap[letter] || letter;
        }
    }
    
    // Update format indicator
    function updateFormatIndicator(letterGroup, format) {
        const letterLabel = letterGroup.querySelector('.letter-label');
        if (letterLabel) {
            // Remove existing format indicator
            const existingIndicator = letterLabel.querySelector('.format-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Add new format indicator
            const formatSpan = document.createElement('span');
            formatSpan.className = `format-indicator format-${format.toLowerCase()}`;
            formatSpan.textContent = format;
            formatSpan.title = `Image format: ${format}`;
            letterLabel.appendChild(formatSpan);
        }
    }
    
    // Add copy button to output
    function addCopyButton() {
        // Remove existing copy button if any
        const existingBtn = document.querySelector('.copy-btn');
        if (existingBtn) existingBtn.remove();
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy All Letters';
        
        copyBtn.addEventListener('click', function() {
            const allLetters = Array.from(document.querySelectorAll('.letter-sign-image, .letter-fallback'))
                .map(el => el.dataset?.letter || el.textContent)
                .filter(Boolean)
                .join('');
            
            copyToClipboard(allLetters);
            showMessage('All letters copied to clipboard!');
        });
        
        signOutput.appendChild(copyBtn);
    }
    
    // Clear all content
    function clearAll() {
        textInput.value = '';
        clearOutput();
        updateCounters();
        textInput.focus();
    }
    
    // Clear output area
    function clearOutput() {
        signOutput.innerHTML = `
            <div class="placeholder-text">
                <i class="fas fa-arrow-up"></i><br>
                Your converted text will appear here with letter sign images...
            </div>
        `;
    }
    
    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: #ffecec;
            color: #e74c3c;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            border-left: 4px solid #e74c3c;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        signOutput.innerHTML = '';
        signOutput.appendChild(errorDiv);
    }
    
    // Show temporary message
    function showMessage(message) {
        // Remove existing message if any
        const existingMsg = document.querySelector('.temp-message');
        if (existingMsg) existingMsg.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'temp-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #1a2980;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the app
    initApp();
});