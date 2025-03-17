"use client";  // ✅ Ensure this is at the top for client-side components
import { useRouter } from "next/navigation";  // ✅ Correct import
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
  const router = useRouter();  // ✅ Now using next/navigation
  const pathname = usePathname();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== href) {
      const targetElement = e.currentTarget as HTMLElement;
      targetElement.classList.add("transition-active");
      
      setTimeout(() => {
        animatePageOut(href, router);  
      }, 50);
    }
  };
  
  return (
    <span className={`cursor-pointer transition-link ${className}`} onClick={handleClick}>
      {children || label}
    </span>
  );
};

export default TransitionLink;
