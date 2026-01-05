export async function copyToClipboard(text, setFunction) {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    // Reset after 2 seconds
    setFunction(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}
