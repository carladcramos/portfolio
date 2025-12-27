// Update current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize Ramen Express Modal
    initRamenExpressModal();
    
    // Initialize SACE LADY Modal
    initSaceLadyModal();
    
    // Initialize typing effect
    initTypingEffect();
});

// ========================================
// TYPING EFFECT FUNCTIONALITY
// ========================================

// ========================================
// TYPING EFFECT FUNCTIONALITY
// ========================================

function initTypingEffect() {
    const typingTextElement = document.querySelector('.typing-text');
    if (!typingTextElement) return;
    
    /**
     * Phrases to cycle through (without "I'm" prefix)
     * These will appear after the static "I'm" text
     */
    const phrases = [
        "4th year IT student",
        "Front-end Developer",
        "UI/UX designer"
    ];
    
    // Animation state variables
    let currentPhraseIndex = 0;  // Current phrase in the array
    let currentCharIndex = 0;    // Current character position in phrase
    let isDeleting = false;      // Whether we're typing or deleting
    
    // Timing configuration
    const typingSpeed = 100;      // milliseconds per character when typing
    const deletingSpeed = 50;    // milliseconds per character when deleting (faster)
    const pauseAfterTyping = 1500; // pause after finishing typing (1.5 seconds)
    const pauseAfterDeleting = 500; // pause after finishing deleting (0.5 seconds)
    
    /**
     * Main typing/deleting loop function
     * 
     * This function handles the complete animation cycle:
     * 1. Types the current phrase letter by letter
     * 2. Pauses when phrase is complete
     * 3. Deletes the phrase letter by letter
     * 4. Moves to next phrase and repeats
     * 
     * Uses recursive setTimeout for smooth, non-blocking animation
     */
    function typeText() {
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (!isDeleting) {
            // TYPING STATE: Add characters one by one
            if (currentCharIndex < currentPhrase.length) {
                // Add next character to the display
                typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                // Continue typing after delay
                setTimeout(typeText, typingSpeed);
            } else {
                // Finished typing the entire phrase
                // Switch to deleting state after pause
                isDeleting = true;
                setTimeout(typeText, pauseAfterTyping);
            }
        } else {
            // DELETING STATE: Remove characters one by one
            if (currentCharIndex > 0) {
                // Remove last character from display
                typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                // Continue deleting after delay
                setTimeout(typeText, deletingSpeed);
            } else {
                // Finished deleting the phrase
                // Move to next phrase and start typing again
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; // Loop back to first phrase
                setTimeout(typeText, pauseAfterDeleting);
            }
        }
    }
    
    // Start the typing effect animation loop
    typeText();
}

// ========================================
// RAMEN EXPRESS MODAL FUNCTIONALITY
// ========================================

function initRamenExpressModal() {
    const modal = document.getElementById('ramen-express-modal');
    const openButton = document.querySelector('[data-modal="ramen-express-modal"]');
    const closeButton = modal.querySelector('.portfolio-modal-close');
    const overlay = modal.querySelector('.portfolio-modal-overlay');
    const prevButton = modal.querySelector('.slideshow-prev');
    const nextButton = modal.querySelector('.slideshow-next');
    const indicators = modal.querySelectorAll('.indicator');
    const slides = modal.querySelectorAll('.slideshow-slide');
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Open modal
    if (openButton) {
        openButton.addEventListener('click', function() {
            openModal();
        });
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        // Reset to first slide when closing
        currentSlide = 0;
        updateSlideshow();
    }
    
    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        currentSlide = 0;
        updateSlideshow();
    }
    
    // Close button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close on overlay click (but not when clicking inside modal)
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Prevent modal from closing when clicking inside
    const modalContainer = modal.querySelector('.portfolio-modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        
        // Arrow key navigation
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                goToPreviousSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
            }
        }
    });
    
    // Update slideshow display
    function updateSlideshow() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Navigate to next slide
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideshow();
    }
    
    // Navigate to previous slide
    function goToPreviousSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlideshow();
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', goToNextSlide);
    }
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', goToPreviousSlide);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            updateSlideshow();
        });
    });
    
    // Touch swipe support
    const slideshowContainer = modal.querySelector('.slideshow-images');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                goToNextSlide();
            } else {
                // Swipe right - previous slide
                goToPreviousSlide();
            }
        }
    }
}

// ========================================
// SACE LADY MODAL FUNCTIONALITY
// ========================================

function initSaceLadyModal() {
    const modal = document.getElementById('sace-lady-modal');
    if (!modal) return;
    
    const openButton = document.querySelector('[data-modal="sace-lady-modal"]');
    const closeButton = modal.querySelector('.portfolio-modal-close');
    const overlay = modal.querySelector('.portfolio-modal-overlay');
    const prevButton = modal.querySelector('.slideshow-prev');
    const nextButton = modal.querySelector('.slideshow-next');
    const indicators = modal.querySelectorAll('.indicator');
    const slides = modal.querySelectorAll('.slideshow-slide');
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Open modal
    if (openButton) {
        openButton.addEventListener('click', function() {
            openModal();
        });
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        currentSlide = 0;
        updateSlideshow();
    }
    
    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        currentSlide = 0;
        updateSlideshow();
    }
    
    // Close button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                goToPreviousSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
            }
        }
    });
    
    // Update slideshow display
    function updateSlideshow() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Navigate to next slide
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideshow();
    }
    
    // Navigate to previous slide
    function goToPreviousSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlideshow();
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', goToNextSlide);
    }
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', goToPreviousSlide);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            updateSlideshow();
        });
    });
    
    // Touch swipe support
    const slideshowContainer = modal.querySelector('.slideshow-images');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNextSlide();
            } else {
                goToPreviousSlide();
            }
        }
    }
    
    // Prevent modal from closing when clicking inside
    const modalContainer = modal.querySelector('.portfolio-modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

