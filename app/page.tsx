import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

function loadProtoBodyHtml(): string {
  const filePath = path.join(process.cwd(), "content", "proto-body.html");
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("[ai-first-riskv2] Missing prototype body:", filePath, err);
    return `<div class="panel" role="alert" style="padding:2rem;margin:1rem;font-family:system-ui,sans-serif">
      <p><strong>Prototype markup not found.</strong> Deploy the <code>content/</code> folder next to the app (e.g. add <code>COPY content</code> in Docker).</p>
    </div>`;
  }
}

export default function Home() {
  const html = loadProtoBodyHtml();

  return (
    <>
      <div
        id="proto-root"
        className="proto-shell"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Script src="/js/widgets.js" strategy="afterInteractive" />
      <Script src="/js/app.js" strategy="afterInteractive" />
    </>
  );
}
