import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const animatePageIn = () => {
  const banners = [
    document.getElementById("banner-1"),
    document.getElementById("banner-2"),
    document.getElementById("banner-3"),
    document.getElementById("banner-4"),
  ].filter(Boolean);

  if (banners.length) {
    const tl = gsap.timeline();
    
    tl.set(banners, { yPercent: 0, opacity: 1 })
      .to(banners, {
        yPercent: 100,
        stagger: 0.15,
        duration: 1,
        ease: "power3.inOut",
      });
  }
};

export const animatePageOut = (href: string, router: AppRouterInstance) => {
  const banners = [
    document.getElementById("banner-1"),
    document.getElementById("banner-2"),
    document.getElementById("banner-3"),
    document.getElementById("banner-4"),
  ].filter(Boolean);

  if (banners.length) {
    const tl = gsap.timeline();
    
    tl.set(banners, { yPercent: -100, opacity: 0 })
      .to(banners, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => router.push(href),
      });
  }
};