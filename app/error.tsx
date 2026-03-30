"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="panel" style={{ padding: "2rem", margin: "1rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Something went wrong</h2>
      <pre
        style={{
          fontSize: 12,
          overflow: "auto",
          padding: "1rem",
          background: "#1a1d26",
          color: "#e8eaef",
          borderRadius: 8,
        }}
      >
        {error.message}
      </pre>
      <button
        type="button"
        onClick={() => reset()}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Try again
      </button>
    </div>
  );
}
