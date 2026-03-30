import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

export default function Home() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "content", "proto-body.html"),
    "utf8"
  );

  return (
    <>
      <div
        id="proto-root"
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Script src="/js/widgets.js" strategy="afterInteractive" />
      <Script src="/js/app.js" strategy="afterInteractive" />
    </>
  );
}
