import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

function loadProtoBodyHtml(): string {
  const publicPath = path.join(process.cwd(), "public", "proto-body.html");
  const legacyPath = path.join(process.cwd(), "content", "proto-body.html");
  try {
    if (fs.existsSync(publicPath)) {
      return fs.readFileSync(publicPath, "utf8");
    }
    return fs.readFileSync(legacyPath, "utf8");
  } catch (err) {
    console.error(
      "[ai-first-riskv2] Missing prototype body. Tried:",
      publicPath,
      "and",
      legacyPath,
      err
    );
    return `<div class="panel" role="alert" style="padding:2rem;margin:1rem;font-family:system-ui,sans-serif">
      <p><strong>Prototype markup not found.</strong> Ensure <code>public/proto-body.html</code> exists in the deployment.</p>
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
