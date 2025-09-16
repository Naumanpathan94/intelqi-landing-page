import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  const navOverlay = document.querySelector(".nav-overlay");
  const openLabel = document.querySelector(".open-label");
  const closeLabel = document.querySelector(".close-label");
  const videoContainer = document.querySelector(".video-container");
  const video = document.getElementById("aboutVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playLabel = document.querySelector(".play-label");
  const pauseLabel = document.querySelector(".pause-label");
  let isMenuOpen = false;
  let isAnimating = false;
  let scrollY = 0;

  // Video control functions
  const togglePlayPause = () => {
    if (video.paused) {
      video.play().catch(e => console.log('Play failed:', e));
      playPauseBtn.classList.add("playing");
      videoContainer.classList.add("playing");
      
      // Animate labels with GSAP like the menu button
      gsap.to(playLabel, {
        y: "-1rem",
        duration: 0.3,
      });
      gsap.to(pauseLabel, {
        y: "-1rem",
        duration: 0.3,
      });
    } else {
      video.pause();
      playPauseBtn.classList.remove("playing");
      videoContainer.classList.remove("playing");
      
      // Animate labels back
      gsap.to(playLabel, {
        y: "0rem",
        duration: 0.3,
      });
      gsap.to(pauseLabel, {
        y: "0rem",
        duration: 0.3,
      });
    }
  };

  // Video event listeners
  playPauseBtn.addEventListener("click", togglePlayPause);

  // Video ended event
  video.addEventListener("ended", () => {
    playPauseBtn.classList.remove("playing");
    videoContainer.classList.remove("playing");
    
    // Reset labels to initial position
    gsap.to(playLabel, {
      y: "0rem",
      duration: 0.3,
    });
    gsap.to(pauseLabel, {
      y: "0rem",
      duration: 0.3,
    });
  });

  menuToggleBtn.addEventListener("click", () => {
    if (isAnimating) {
      gsap.killTweensOf([navOverlay, openLabel, closeLabel, videoContainer]);
      isAnimating = false;
    }

    if (!isMenuOpen) {
      isAnimating = true;

      navOverlay.style.pointerEvents = "all";
      menuToggleBtn.classList.add("menu-open");
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      gsap.to(openLabel, {
        y: "-1rem",
        duration: 0.3,
      });

      gsap.to(closeLabel, {
        y: "-1rem",
        duration: 0.3,
      });

      gsap.to(navOverlay, {
        opacity: 1,
        duration: 0.3,
      });

      gsap.to(videoContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "power4.out",
        onComplete: () => {
          isAnimating = false;
        },
      });

      gsap.to([".nav-footer-item-header", ".nav-footer-item-copy"], {
        opacity: 1,
        y: "0%",
        duration: 0.75,
        stagger: 0.075,
        ease: "power4.out",
      });

      isMenuOpen = true;
    } else {
      isAnimating = true;
      navOverlay.style.pointerEvents = "none";
      menuToggleBtn.classList.remove("menu-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);

      // Pause video when closing
      video.pause();
      playPauseBtn.classList.remove("playing");
      videoContainer.classList.remove("playing");
      
      // Reset video button labels
      gsap.to(playLabel, {
        y: "0rem",
        duration: 0.3,
      });
      gsap.to(pauseLabel, {
        y: "0rem",
        duration: 0.3,
      });

      gsap.to(openLabel, {
        y: "0rem",
        duration: 0.3,
      });

      gsap.to(closeLabel, {
        y: "0rem",
        duration: 0.3,
      });

      gsap.to(videoContainer, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in",
      });

      gsap.to(navOverlay, {
        opacity: 0,
        duration: 0.3,
        delay: 0.2,
        onComplete: () => {
          gsap.set([".nav-footer-item-header", ".nav-footer-item-copy"], {
            opacity: 0,
            y: "100%",
          });
          isAnimating = false;
        },
      });

      isMenuOpen = false;
    }
  });
});
