import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  // grab the video, poster image and controls
  const heroVideo = document.querySelector(".hero-img video");
  const heroPoster = document.querySelector(".hero-poster");
  const videoControls = document.querySelector(".video-controls");
  const soundToggle = document.querySelector(".sound-toggle");
  const soundOnIcon = document.querySelector(".sound-on");
  const soundOffIcon = document.querySelector(".sound-off");
  
  // Ensure poster image is visible initially
  if (heroPoster) {
    heroPoster.style.display = 'block';
  }
  
  // Store video state
  let videoPausedTime = 0;
  let isVideoPlaying = false;
  let isSoundOn = false;

  // Video loading error handling
  if (heroVideo) {
    heroVideo.addEventListener('error', (e) => {
      console.error('Video loading error:', e);
      // Fallback: hide video and show fallback image
      if (heroPoster) {
        heroPoster.style.display = 'block';
      }
      heroVideo.style.display = 'none';
      if (videoControls) {
        videoControls.style.display = 'none';
      }
    });

    heroVideo.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
      // Don't autoplay initially - wait for scroll
    });

    // Sound toggle functionality
    soundToggle.addEventListener('click', () => {
      isSoundOn = !isSoundOn;
      heroVideo.muted = !isSoundOn;
      
      if (isSoundOn) {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
      } else {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
      }
    });
  }

  let scrollTriggerInstance = null;

  const initAnimations = () => {
    if (scrollTriggerInstance) scrollTriggerInstance.kill();

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * p}%`,
          scale: 0.25 + 0.75 * p,
          rotation: -15 + 15 * p,
        });

        // Control video playback based on scroll position
        if (heroVideo && heroPoster && videoControls) {
          if (p > 0.1 && !isVideoPlaying) {
            // Start playing video when scrolled down enough
            isVideoPlaying = true;
            heroPoster.style.display = 'none';
            heroVideo.style.display = 'block';
            videoControls.style.display = 'block';
            heroVideo.currentTime = videoPausedTime;
            
            // Use a small timeout to prevent play() being interrupted by rapid scroll events
            setTimeout(() => {
              if (isVideoPlaying) {
                heroVideo.play().catch(err => {
                  console.warn('Video play failed:', err);
                  // Fallback for autoplay restrictions
                  heroVideo.muted = true;
                  heroVideo.play().catch(() => {
                    // If still failing, keep poster visible
                    heroPoster.style.display = 'block';
                    heroVideo.style.display = 'none';
                    isVideoPlaying = false;
                  });
                });
              }
            }, 100);
            
            heroVideo.classList.add('playing');
          } else if (p <= 0.1 && isVideoPlaying) {
            // Pause video when back at top
            isVideoPlaying = false;
            videoPausedTime = heroVideo.currentTime;
            
            // Use a small timeout to prevent race conditions
            setTimeout(() => {
              if (!isVideoPlaying) {
                heroVideo.pause();
                heroVideo.classList.remove('playing');
                heroVideo.style.display = 'none';
                videoControls.style.display = 'none';
                heroPoster.style.display = 'block';
              }
            }, 50);
          }
        }
      },
    });

    // Additional scroll trigger to handle when user scrolls away from hero section
    ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top top",
      end: "bottom top",
      onLeave: () => {
        // User scrolled away from hero section - pause video
        if (heroVideo && isVideoPlaying) {
          videoPausedTime = heroVideo.currentTime;
          heroVideo.pause();
          heroVideo.classList.remove('playing');
          heroVideo.style.display = 'none';
          videoControls.style.display = 'none';
          heroPoster.style.display = 'block';
          isVideoPlaying = false;
        }
      },
      onEnterBack: () => {
        // User scrolled back to hero section - resume video
        if (heroVideo && !isVideoPlaying) {
          heroPoster.style.display = 'none';
          heroVideo.style.display = 'block';
          videoControls.style.display = 'block';
          heroVideo.currentTime = videoPausedTime;
          heroVideo.play().catch(err => {
            console.warn('Video resume failed:', err);
            heroVideo.muted = true;
            heroVideo.play();
          });
          heroVideo.classList.add('playing');
          isVideoPlaying = true;
        }
      }
    });
  };

  initAnimations();
  window.addEventListener("resize", initAnimations);
});
