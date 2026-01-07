import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

export default function InstallButton({ isMobile = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the browser's default bar
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If the app is already installed, the event won't fire.
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // If the prompt isn't supported or already triggered, show nothing
  if (!deferredPrompt) return null;

  // Desktop Shortcut Style
  if (!isMobile) {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-sm text-orange-400 border border-orange-500/20 hover:bg-gray-800 transition"
      >
        <FiDownload size={18} />
        Install App
      </button>
    );
  }

  // Mobile Bold Style
  return (
    <div className="px-4 py-2">
      <button
        onClick={handleInstall}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-bold bg-orange-500 text-black shadow-lg animate-pulse"
      >
        <FiDownload size={20} />
        INSTALL APP
      </button>
    </div>
  );
}
