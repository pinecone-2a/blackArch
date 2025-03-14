import gsap from "gsap";
// Animation for page exit
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextRouter } from "next/router"; // Import NextRouters
// Create banner elements if they don't exist
const ensureBannerElements = () => {
  const bannerIds = ["banner-1", "banner-2", "banner-3", "banner-4"];
  let allBannersExist = true;
  
  bannerIds.forEach(id => {
    if (!document.getElementById(id)) {
      allBannersExist = false;
      // Create the missing banner element
      const banner = document.createElement("div");
      banner.id = id;
      banner.className = `z-50 fixed top-0 ${
        id === "banner-1" ? "left-0 w-1/4" :
        id === "banner-2" ? "left-1/4 w-1/4" :
        id === "banner-3" ? "left-2/4 w-1/4" :
        "left-3/4 w-1/4"
      }`;
      document.body.appendChild(banner);
    }
  });
  
  return bannerIds.map(id => document.getElementById(id));
};

// Animation for page entry
export const animatePageIn = () => {
  const bannerElements = ensureBannerElements();
  
  const tl = gsap.timeline();
  
  // Ensure banners are visible and in the starting position
  tl.set(bannerElements, { 
    yPercent: 0,
    display: "block"
  });
  
  // Animate the banners out of view
  tl.to(bannerElements, {
    yPercent: 100,
    duration: 0.8,
    ease: "power2.inOut",
    stagger: 0.1,
    onComplete: () => {
      // After animation, set display to none to avoid blocking interactions
      gsap.set(bannerElements, { display: "none" });
    }
  });
  
  // Animate the content in
  const content = document.querySelector('.flex.flex-col.items-center');
  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.4
    });
    
    // Staggered animation for form elements
    const formElements = content.querySelectorAll('input, button, h1, p, a');
    gsap.from(formElements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.out",
      delay: 0.6
    });
  }
};


export const animatePageOut = (href: string, router: any) => {
  const bannerElements = ensureBannerElements();
  
  // Animate content out first
  const content = document.querySelector('.flex.flex-col.items-center');
  if (content) {
    gsap.to(content, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power1.in"
    });
  }
  
  // Create a timeline for banner animations
  const tl = gsap.timeline({
    onComplete: () => {
      console.log("Animation complete, navigating to:", href);
      router.push(href);
    }
  });
  
  // Make banners visible again and set initial position (off-screen)
  tl.set(bannerElements, { 
    yPercent: -100,
    display: "block"
  });
  
  // Animate the banners into view
  tl.to(bannerElements, {
    yPercent: 0,
    duration: 0.8,
    ease: "power2.inOut",
    stagger: 0.1
  });
  
  // Add a safety timeout
  const safetyTimeout = setTimeout(() => {
    console.log("Safety navigation triggered");
    router.push(href);
    clearTimeout(safetyTimeout);
  }, 1200);
};