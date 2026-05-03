"use client";

import type {CSSProperties} from "react";
import {useEffect} from "react";
import Image from "next/image";
import Link from "next/link";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  background: "linear-gradient(180deg, #ffffff 0%, #f6f9ff 100%)",
  color: "#132968",
  fontFamily:
    'var(--font-plus-jakarta-sans, "Plus Jakarta Sans"), "PingFang SC", "Microsoft YaHei", sans-serif',
};

const wrapStyle: CSSProperties = {
  display: "grid",
  minHeight: "100vh",
  placeItems: "center",
  padding: "24px",
};

const panelStyle: CSSProperties = {
  width: "min(760px, 100%)",
  border: "1px solid rgba(32, 62, 143, 0.1)",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.96)",
  boxShadow: "0 26px 54px -42px rgba(20, 44, 119, 0.28)",
  padding: "clamp(28px, 7vw, 56px)",
  textAlign: "center",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "18px",
  fontSize: "24px",
  fontWeight: 800,
  lineHeight: 1,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 8vw, 56px)",
  fontWeight: 800,
  letterSpacing: "-0.05em",
  lineHeight: 1,
};

const copyStyle: CSSProperties = {
  maxWidth: "560px",
  margin: "16px auto 0",
  color: "#6f7ea9",
  fontSize: "16px",
  lineHeight: 1.75,
};

const actionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "12px",
  marginTop: "24px",
};

const primaryStyle: CSSProperties = {
  minHeight: "48px",
  border: 0,
  borderRadius: "999px",
  background: "linear-gradient(135deg, #2563ff 0%, #1a43c9 100%)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 800,
  padding: "0 20px",
};

const secondaryStyle: CSSProperties = {
  display: "inline-flex",
  minHeight: "48px",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(37, 99, 255, 0.16)",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#0e2f9a",
  fontWeight: 800,
  padding: "0 20px",
  textDecoration: "none",
};

const referenceStyle: CSSProperties = {
  marginTop: "18px",
  color: "#7b89af",
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: "12px",
  overflowWrap: "anywhere",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={pageStyle}>
        <main style={wrapStyle}>
          <section style={panelStyle}>
            <div style={brandStyle} aria-label="yaoshun toys">
              <Image alt="" height={34} src="/favicon-rounded-192.png" style={{borderRadius: "9px"}} width={34} />
              <span style={{color: "#2563ff"}}>yaoshun</span>
              <span style={{color: "#ff9700"}}>toys</span>
            </div>
            <h1 style={titleStyle}>The site needs a quick retry</h1>
            <p style={copyStyle}>
              A critical fallback caught an unexpected issue before the normal page shell could render.
              Try again, or return to the homepage and continue from there.
            </p>
            <div style={actionsStyle}>
              <button style={primaryStyle} type="button" onClick={reset}>
                Try Again
              </button>
              <Link style={secondaryStyle} href="/en">
                Back to Home
              </Link>
            </div>
            {error.digest ? <p style={referenceStyle}>Reference: {error.digest}</p> : null}
          </section>
        </main>
      </body>
    </html>
  );
}
