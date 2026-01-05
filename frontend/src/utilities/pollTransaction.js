export function pollTransaction({
  reference,
  fetcher,
  interval = 5000,
  timeout = 120000,
  onSuccess,
  onFailure,
  onTimeout,
}) {
  const start = Date.now();

  const timer = setInterval(async () => {
    try {
      const tx = await fetcher(reference);

      if (tx.status === "completed") {
        clearInterval(timer);
        onSuccess(tx);
      }

      if (tx.status === "failed") {
        clearInterval(timer);
        onFailure(tx);
      }

      if (Date.now() - start > timeout) {
        clearInterval(timer);
        onTimeout();
      }
    } catch {
      // silent retry
    }
  }, interval);

  return () => clearInterval(timer);
}
