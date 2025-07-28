document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const originalSlides = Array.from(track.children);
    const visibleSlides = 3;
    const totalSlides = originalSlides.length;
    const nextButton = document.querySelector(".carousel-button.next");
    const prevButton = document.querySelector(".carousel-button.prev");
    const dotsNav = document.querySelector(".carousel-dots");

    let currentIndex = 0;
    let slideWidth;

    // Clone first few slides to the end
    for (let i = 0; i < visibleSlides; i++) {
        const clone = originalSlides[i].cloneNode(true);
        track.appendChild(clone);
    }

    const allSlides = Array.from(track.children); // includes clones

    // Create one dot per original slide (not clone)
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dotsNav.appendChild(dot);
    }

    const dots = Array.from(dotsNav.children);

    function updateCarousel(jump = false) {
        slideWidth = allSlides[0].getBoundingClientRect().width + 10; // 10px gap
        track.style.transition = jump ? "none" : "transform 0.5s ease-in-out";
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Update active dot (modulo ensures clones wrap around)
        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentIndex % totalSlides]?.classList.add("active");
    }

    function goToNextSlide() {
        currentIndex++;
        updateCarousel();

        // If we're at the clone (past real slides), jump back to real first slide
        if (currentIndex === totalSlides) {
            setTimeout(() => {
                currentIndex = 0;
                updateCarousel(true);
            }, 500); // after transition
        }
    }

    function goToPrevSlide() {
        if (currentIndex === 0) {
            currentIndex = totalSlides;
            updateCarousel(true);
            setTimeout(() => {
                currentIndex = totalSlides - 1;
                updateCarousel();
            }, 50);
        } else {
            currentIndex--;
            updateCarousel();
        }
    }

    nextButton.addEventListener("click", () => {
        goToNextSlide();
        resetAutoscroll();
    });

    prevButton.addEventListener("click", () => {
        goToPrevSlide();
        resetAutoscroll();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateCarousel();
            resetAutoscroll();
        });
    });

    window.addEventListener("resize", () => updateCarousel(true));

    let intervalId;

    function startAutoscroll() {
        intervalId = setInterval(() => {
            goToNextSlide();

            // If we're jumping to the start, reset scroll after the jump completes
            if (currentIndex === totalSlides) {
                clearInterval(intervalId);
                setTimeout(() => {
                    startAutoscroll(); // restart only after jump finishes
                }, 500); // match transition duration
            }
        }, 3750);
    }

    function resetAutoscroll() {
        clearInterval(intervalId);
        startAutoscroll();
    }

    updateCarousel();
    startAutoscroll();
});


// SEO-friendly enhancement: optional analytics or lazy loading
document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded");
});
