export function LoadingView() {
  return (
    <section
      aria-live="polite"
      aria-label="Loading"
      className="site-container flex min-h-screen items-center justify-center py-0"
    >
      <div className="flex items-center justify-center">
        <div className="relative flex h-11 w-11 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-[rgba(37,99,255,0.14)]" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2563ff] animate-spin" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563ff]" />
        </div>
      </div>
    </section>
  );
}
