"use client";

import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 10;

      if (scrollingDown && currentScrollY > scrollThreshold) {
        setIsVisible(false);
      } else if (!scrollingDown) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return isVisible;
}
