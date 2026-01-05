import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scroll-positions";

export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Restore scroll position
  useEffect(() => {
    const positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

    if (navigationType === "POP") {
      // Back / Forward
      const savedY = positions[location.key];
      if (savedY !== undefined) {
        window.scrollTo({ top: savedY, behavior: "auto" });
      }
    } else {
      // New navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location, navigationType]);

  // Save scroll position
  useEffect(() => {
    const savePosition = () => {
      const positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

      positions[location.key] = window.scrollY;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    };

    window.addEventListener("scroll", savePosition);
    return () => window.removeEventListener("scroll", savePosition);
  }, [location]);

  return null;
}
