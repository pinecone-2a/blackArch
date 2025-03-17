"use client";
import { useRouter } from "next/router"; // Correct import from 'next/router'
import { animatePageOut } from "./animations";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
}

const TransitionLink = ({ href, label, children, className = "" }: Props) => {
  const router = useRouter(); // This is the NextRouter type now
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== href) {
      // Add an active class for styling during transition
      const targetElement = e.currentTarget as HTMLElement;
      targetElement.classList.add("transition-active");

      // Small delay before animation starts to allow for visual feedback
      setTimeout(() => {
        animatePageOut(href, router); // This should work correctly with NextRouter
      }, 50);
    }
  };

  return (
    <span
      className={`cursor-pointer transition-link ${className}`}
      onClick={handleClick}
    >
      {children || label}
    </span>
  );
};

export default TransitionLink;
