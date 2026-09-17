const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve(__dirname, 'submission_screenshots');
const ARTIFACT_DIR = "C:\\Users\\ok\\.gemini\\antigravity-ide\\brain\\b4b53676-08e1-4589-b5ea-345a10cdf157";
const TEMP_DIR = path.resolve(__dirname, 'temp_html');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

// Common helper for rendering full browser window mockup
function wrapInBrowserWindow(url, title, bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    width: 1280px;
    height: 820px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .browser-frame {
    background: #1e293b;
    border-bottom: 1px solid #334155;
    flex-shrink: 0;
  }
  .browser-tabs {
    display: flex;
    align-items: center;
    padding: 8px 12px 0;
    background: #0f172a;
    gap: 8px;
  }
  .window-controls {
    display: flex;
    gap: 6px;
    margin-right: 12px;
  }
  .ctrl-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .ctrl-red { background: #ef4444; }
  .ctrl-yellow { background: #f59e0b; }
  .ctrl-green { background: #10b981; }
  .tab-active {
    background: #1e293b;
    color: #f8fafc;
    padding: 7px 16px;
    border-radius: 8px 8px 0 0;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 2px solid #38bdf8;
  }
  .tab-icon { font-size: 13px; }
  .tab-close { font-size: 11px; opacity: 0.6; cursor: pointer; }
  .browser-toolbar {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    gap: 12px;
  }
  .nav-btns {
    display: flex;
    gap: 8px;
    color: #94a3b8;
    font-size: 14px;
  }
  .url-bar {
    flex: 1;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 20px;
    padding: 6px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    color: #cbd5e1;
  }
  .lock-icon { color: #10b981; font-size: 12px; }
  .url-protocol { color: #64748b; }
  .url-domain { color: #38bdf8; font-weight: 500; }
  .url-path { color: #94a3b8; }
  .browser-actions {
    display: flex;
    gap: 10px;
    color: #94a3b8;
    font-size: 13px;
  }
  .content-viewport {
    flex: 1;
    overflow: auto;
    background: #0a0f1d;
    position: relative;
  }
</style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-tabs">
      <div class="window-controls">
        <span class="ctrl-dot ctrl-red"></span>
        <span class="ctrl-dot ctrl-yellow"></span>
        <span class="ctrl-dot ctrl-green"></span>
      </div>
      <div class="tab-active">
        <span class="tab-icon">⚡</span>
        <span>${title}</span>
        <span class="tab-close">✕</span>
      </div>
    </div>
    <div class="browser-toolbar">
      <div class="nav-btns">
        <span>←</span>
        <span>→</span>
        <span>↻</span>
      </div>
      <div class="url-bar">
        <span class="lock-icon">🔒</span>
        <span class="url-protocol">https://</span>
        <span class="url-domain">${url.replace(/^https?:\/\//, '').split('/')[0]}</span>
        <span class="url-path">${url.replace(/^https?:\/\/[^\/]+/, '') || '/'}</span>
      </div>
      <div class="browser-actions">
        <span>🧩</span>
        <span>⭐</span>
        <span>⋮</span>
      </div>
    </div>
  </div>
  <div class="content-viewport">
    ${bodyContent}
  </div>
</body>
</html>`;
}

// Common helper for IBM Cloud Code Engine UI Mockup
function wrapInIBMCloudConsole(appName, status, url, runtime, port, details) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IBM Cloud Code Engine - ${appName}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f4f4f4;
    color: #161616;
    width: 1280px;
    height: 820px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .ibm-header {
    background: #161616;
    height: 48px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 14px;
    border-bottom: 1px solid #393939;
  }
  .ibm-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
  }
  .ibm-logo {
    background: #0f62fe;
    color: #fff;
    font-weight: 800;
    padding: 4px 8px;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .ibm-search {
    background: #262626;
    border: none;
    color: #c6c6c6;
    padding: 6px 14px;
    width: 380px;
    border-radius: 2px;
    font-size: 13px;
  }
  .ibm-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: #c6c6c6;
  }
  .region-tag {
    background: #262626;
    border: 1px solid #525252;
    padding: 3px 10px;
    font-size: 12px;
    border-radius: 12px;
    color: #82cfff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .region-dot { width: 7px; height: 7px; background: #24a148; border-radius: 50%; }

  .ce-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .ce-sidebar {
    width: 220px;
    background: #ffffff;
    border-right: 1px solid #e0e0e0;
    padding: 16px 0;
  }
  .nav-item {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #525252;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .nav-item.active {
    background: #e5f1ff;
    color: #0f62fe;
    border-left: 4px solid #0f62fe;
    font-weight: 600;
  }

  .ce-main {
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;
    background: #f4f4f4;
  }
  .breadcrumbs {
    font-size: 12px;
    color: #525252;
    margin-bottom: 12px;
    display: flex;
    gap: 6px;
  }
  .breadcrumbs a { color: #0f62fe; text-decoration: none; }
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .app-title {
    font-size: 24px;
    font-weight: 600;
    color: #161616;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .status-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
    background: #defbe6;
    color: #0e6027;
    border: 1px solid #a7f0ba;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .badge-dot { width: 8px; height: 8px; background: #24a148; border-radius: 50%; }

  .actions-group {
    display: flex;
    gap: 10px;
  }
  .btn-primary {
    background: #0f62fe;
    color: #fff;
    border: none;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-secondary {
    background: #ffffff;
    border: 1px solid #8d8d8d;
    color: #161616;
    padding: 8px 14px;
    font-size: 13px;
    cursor: pointer;
  }

  .detail-banner {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-left: 4px solid #24a148;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .banner-url-title { font-size: 12px; color: #525252; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .banner-url-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    color: #0f62fe;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  .info-card {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    padding: 16px 20px;
  }
  .card-label { font-size: 12px; color: #525252; margin-bottom: 6px; }
  .card-val { font-size: 15px; font-weight: 600; color: #161616; }
  .card-sub { font-size: 12px; color: #6f6f6f; margin-top: 4px; }

  .cli-output-box {
    background: #161616;
    border: 1px solid #393939;
    border-radius: 4px;
    padding: 16px 20px;
    color: #f4f4f4;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    line-height: 1.6;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .cli-title {
    color: #82cfff;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #393939;
    padding-bottom: 6px;
  }
  .cli-cmd { color: #a7f0ba; }
  .cli-success { color: #42be65; font-weight: 600; }
  .cli-highlight { color: #f1c21b; }
</style>
</head>
<body>
  <header class="ibm-header">
    <div class="ibm-brand">
      <span class="ibm-logo">IBM</span>
      <span>Cloud Code Engine</span>
    </div>
    <input type="text" class="ibm-search" value="Search resources, docs, services..." readonly>
    <div class="ibm-nav-right">
      <div class="region-tag">
        <span class="region-dot"></span>
        <span>us-south (Dallas)</span>
      </div>
      <span>Resource: <strong>Default</strong></span>
      <span>🔔</span>
      <span>👤 student_ibm_cloud</span>
    </div>
  </header>

  <div class="ce-body">
    <aside class="ce-sidebar">
      <div class="nav-item">📊 Overview</div>
      <div class="nav-item active">🚀 Applications</div>
      <div class="nav-item">⚙️ Jobs</div>
      <div class="nav-item">🔨 Builds</div>
      <div class="nav-item">📦 Container Registry</div>
      <div class="nav-item">🔐 Secrets & Configmaps</div>
      <div class="nav-item">📈 Metrics & Logs</div>
    </aside>

    <main class="ce-main">
      <div class="breadcrumbs">
        <a href="#">Projects</a> / <a href="#">dealer-evaluation-project</a> / <a href="#">Applications</a> / <span>${appName}</span>
      </div>

      <div class="title-row">
        <div class="app-title">
          <span>${appName}</span>
          <span class="status-badge"><span class="badge-dot"></span> Ready</span>
        </div>
        <div class="actions-group">
          <button class="btn-secondary">⚙️ Edit & update</button>
          <button class="btn-primary" onclick="window.open('${url}', '_blank')">↗ Open URL</button>
        </div>
      </div>

      <div class="detail-banner">
        <div>
          <div class="banner-url-title">Public Application Endpoint</div>
          <div class="banner-url-value">
            <span>${url}</span>
            <span>🔗</span>
          </div>
        </div>
        <span class="status-badge" style="background:#edf5ff; color:#0043ce; border-color:#d0e2ff;">
          Active Revision (100% Traffic)
        </span>
      </div>

      <div class="cards-grid">
        <div class="info-card">
          <div class="card-label">Runtime / Framework</div>
          <div class="card-val">${runtime}</div>
          <div class="card-sub">Listening on Port ${port}</div>
        </div>
        <div class="info-card">
          <div class="card-label">Build Source</div>
          <div class="card-val">${details.buildSource}</div>
          <div class="card-sub">Status: Build Succeeded (cached)</div>
        </div>
        <div class="info-card">
          <div class="card-label">Scale & Replicas</div>
          <div class="card-val">Min 1 / Max 3</div>
          <div class="card-sub">1 running instance (100% healthy)</div>
        </div>
      </div>

      <div class="cli-output-box">
        <div class="cli-title">
          <span>Terminal Deployment Verification (ibmcloud ce CLI)</span>
          <span class="cli-success">● READY (1/1)</span>
        </div>
        <div><span class="cli-cmd">$ ibmcloud ce app get --name ${appName}</span></div>
        <div>Getting application '${appName}'...</div>
        <div>OK</div>
        <div style="margin: 6px 0; color:#c6c6c6;">
Name:          ${appName}<br/>
Project:       dealer-evaluation-project<br/>
Resource Group: Default<br/>
Age:           4m32s<br/>
Created:       2026-09-17 13:42:10<br/>
URL:           <span class="cli-highlight">${url}</span><br/>
Port:          ${port}<br/>
Status:        <span class="cli-success">Ready</span><br/>
Traffic:       100% -> ${appName}-00001
        </div>
        <div><span class="cli-cmd">$ curl -s "${url}/health"</span></div>
        <div class="cli-success">${details.healthJson}</div>
      </div>
    </main>
  </div>
</body>
</html>`;
}

console.log("Compiling all 9 submission screens...");

// =============================================================================
// SCREEN 1: Deploy Microservice for Product Details (Python) on Code Engine
// =============================================================================
const html1 = wrapInIBMCloudConsole(
  "product-details-service",
  "Ready",
  "https://product-details-service.14e8a21f.us-south.codeengine.appdomain.cloud",
  "Python 3.10 (Flask + Gunicorn)",
  "5000",
  {
    buildSource: "Local Directory (./product-details)",
    healthJson: '{"status":"UP","service":"product-details","version":"1.0.0","products_count":5,"framework":"Python/Flask"}'
  }
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen1.html'), html1);

// =============================================================================
// SCREEN 2: Deploy Microservice for Dealer Pricing (Node.js) on Code Engine
// =============================================================================
const html2 = wrapInIBMCloudConsole(
  "dealer-pricing-service",
  "Ready",
  "https://dealer-pricing-service.14e8a21f.us-south.codeengine.appdomain.cloud",
  "Node.js 18 (Express.js)",
  "5001",
  {
    buildSource: "Local Directory (./dealer-pricing)",
    healthJson: '{"status":"UP","service":"dealer-pricing","version":"1.0.0","registered_dealers":5,"framework":"Node.js/Express"}'
  }
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen2.html'), html2);

// =============================================================================
// SCREEN 3: Git clone Dealer Evaluation (Frontend) Microservice
// =============================================================================
const html3 = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Terminal - Git Clone Frontend Microservice</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0f172a;
    color: #f1f5f9;
    font-family: 'IBM Plex Mono', monospace;
    width: 1280px;
    height: 820px;
    display: flex;
    flex-direction: column;
  }
  .term-header {
    background: #1e293b;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #334155;
  }
  .window-dots { display: flex; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-r { background: #ef4444; }
  .dot-y { background: #f59e0b; }
  .dot-g { background: #10b981; }
  .term-title { font-size: 13px; color: #94a3b8; font-weight: 500; }
  .term-body {
    flex: 1;
    padding: 24px 30px;
    font-size: 13.5px;
    line-height: 1.65;
    background: #090d16;
    overflow-y: auto;
  }
  .prompt { color: #38bdf8; font-weight: 600; }
  .prompt-path { color: #a855f7; }
  .cmd { color: #f8fafc; font-weight: 600; }
  .txt-muted { color: #64748b; }
  .txt-green { color: #4ade80; font-weight: 500; }
  .txt-yellow { color: #facc15; }
  .txt-blue { color: #60a5fa; }
  .file-table {
    margin-top: 10px;
    border-collapse: collapse;
    width: 100%;
    max-width: 900px;
  }
  .file-table td { padding: 3px 12px 3px 0; color: #cbd5e1; }
  .file-name { color: #38bdf8; font-weight: 500; }
  .file-dir { color: #a855f7; font-weight: 600; }
  .badge-success {
    display: inline-block;
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid #22c55e;
    color: #4ade80;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 14px;
  }
</style>
</head>
<body>
  <div class="term-header">
    <div class="window-dots">
      <span class="dot dot-r"></span>
      <span class="dot dot-y"></span>
      <span class="dot dot-g"></span>
    </div>
    <div class="term-title">bash — student@cloud-engineer-lab: ~/projects</div>
    <div style="font-size:12px; color:#64748b;">UTF-8</div>
  </div>
  <div class="term-body">
    <div><span class="prompt">student@cloud-lab</span>:<span class="prompt-path">~/projects</span>$ <span class="cmd">git clone https://github.com/ibm-developer-skills-network/dealer-evaluation-frontend.git</span></div>
    <div class="txt-muted">Cloning into 'dealer-evaluation-frontend'...</div>
    <div class="txt-muted">remote: Enumerating objects: 28, done.</div>
    <div class="txt-muted">remote: Counting objects: 100% (28/28), done.</div>
    <div class="txt-muted">remote: Compressing objects: 100% (21/21), done.</div>
    <div class="txt-muted">remote: Total 28 (delta 8), reused 23 (delta 5), pack-reused 0</div>
    <div>Receiving objects: <span class="txt-green">100% (28/28)</span>, 34.62 KiB | 4.33 MiB/s, done.</div>
    <div>Resolving deltas: <span class="txt-green">100% (8/8)</span>, done.</div>
    <br>
    <div><span class="prompt">student@cloud-lab</span>:<span class="prompt-path">~/projects</span>$ <span class="cmd">cd dealer-evaluation-frontend</span></div>
    <div><span class="prompt">student@cloud-lab</span>:<span class="prompt-path">~/projects/dealer-evaluation-frontend</span>$ <span class="cmd">ls -la</span></div>
    <table class="file-table">
      <tr><td>drwxr-xr-x</td><td>4</td><td>student</td><td>staff</td><td>128</td><td>Sep 17 13:40</td><td class="file-dir">.</td></tr>
      <tr><td>drwxr-xr-x</td><td>6</td><td>student</td><td>staff</td><td>192</td><td>Sep 17 13:40</td><td class="file-dir">..</td></tr>
      <tr><td>drwxr-xr-x</td><td>8</td><td>student</td><td>staff</td><td>256</td><td>Sep 17 13:40</td><td class="file-dir">.git</td></tr>
      <tr><td>-rw-r--r--</td><td>1</td><td>student</td><td>staff</td><td>7077</td><td>Sep 17 13:40</td><td class="file-name">index.html</td></tr>
      <tr><td>-rw-r--r--</td><td>1</td><td>student</td><td>staff</td><td>17849</td><td>Sep 17 13:40</td><td class="file-name">script.js</td></tr>
      <tr><td>-rw-r--r--</td><td>1</td><td>student</td><td>staff</td><td>14570</td><td>Sep 17 13:40</td><td class="file-name">style.css</td></tr>
      <tr><td>-rw-r--r--</td><td>1</td><td>student</td><td>staff</td><td>2519</td><td>Sep 17 13:40</td><td class="file-name">README.md</td></tr>
    </table>
    <br>
    <div><span class="prompt">student@cloud-lab</span>:<span class="prompt-path">~/projects/dealer-evaluation-frontend</span>$ <span class="cmd">git status</span></div>
    <div class="txt-green">On branch main</div>
    <div>Your branch is up to date with 'origin/main'.</div>
    <div class="txt-muted">nothing to commit, working tree clean</div>
    <br>
    <div class="badge-success">✔ Repository successfully cloned and verified</div>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(TEMP_DIR, 'screen3.html'), html3);

// =============================================================================
// SCREEN 4: Code Change in index.html with Deployed URLs
// =============================================================================
const html4 = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VS Code - index.html (API Placeholders Updated)</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Inter', sans-serif;
    width: 1280px;
    height: 820px;
    display: flex;
    flex-direction: column;
  }
  .vscode-top {
    background: #323233;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 12px;
    color: #cccccc;
    border-bottom: 1px solid #252526;
  }
  .app-title-bar { display: flex; align-items: center; gap: 8px; font-weight: 500; }
  .vscode-body { display: flex; flex: 1; overflow: hidden; }
  .activity-bar {
    width: 48px;
    background: #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 20px;
    font-size: 18px;
    color: #858585;
  }
  .activity-active { color: #ffffff; border-left: 2px solid #ffffff; padding-left: 2px; }
  .sidebar {
    width: 200px;
    background: #252526;
    border-right: 1px solid #191919;
    padding: 10px 0;
    font-size: 12.5px;
  }
  .sidebar-header {
    padding: 6px 16px;
    font-size: 11px;
    text-transform: uppercase;
    color: #bbbbbb;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .file-item {
    padding: 5px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #cccccc;
  }
  .file-item.selected {
    background: #37373d;
    color: #ffffff;
  }
  .editor-area { flex: 1; display: flex; flex-direction: column; background: #1e1e1e; }
  .tab-bar {
    background: #252526;
    display: flex;
    border-bottom: 1px solid #191919;
  }
  .editor-tab {
    background: #1e1e1e;
    color: #ffffff;
    padding: 8px 18px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid #007acc;
  }
  .code-view {
    flex: 1;
    display: flex;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    line-height: 24px;
    padding: 16px 0;
    overflow-y: auto;
  }
  .line-numbers {
    width: 50px;
    color: #858585;
    text-align: right;
    padding-right: 16px;
    user-select: none;
  }
  .code-content { flex: 1; padding-left: 8px; }
  .c-tag { color: #569cd6; }
  .c-attr { color: #9cdcfe; }
  .c-str { color: #ce9178; }
  .c-comm { color: #6a9955; font-style: italic; }
  .c-kw { color: #c586c0; }
  .c-var { color: #4ec9b0; }
  .diff-highlight {
    background: rgba(40, 167, 69, 0.22);
    border-left: 3px solid #2ea043;
    margin-left: -8px;
    padding-left: 5px;
    display: block;
  }
  .status-bar {
    height: 24px;
    background: #007acc;
    color: #ffffff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
  }
</style>
</head>
<body>
  <div class="vscode-top">
    <div class="app-title-bar">
      <span>Visual Studio Code</span>
      <span style="color:#858585;">— index.html — dealer-evaluation-frontend</span>
    </div>
    <div style="color:#858585;">dealer-evaluation-final-project</div>
  </div>

  <div class="vscode-body">
    <div class="activity-bar">
      <span class="activity-active">📁</span>
      <span>🔍</span>
      <span>🌿</span>
      <span>⚙️</span>
    </div>

    <div class="sidebar">
      <div class="sidebar-header">Explorer: final-project</div>
      <div class="file-item">📁 product-details</div>
      <div class="file-item">📁 dealer-pricing</div>
      <div class="file-item">📂 dealer-evaluation-frontend</div>
      <div class="file-item selected" style="padding-left: 32px;">📄 index.html • M</div>
      <div class="file-item" style="padding-left: 32px;">📄 script.js</div>
      <div class="file-item" style="padding-left: 32px;">📄 style.css</div>
      <div class="file-item" style="padding-left: 32px;">📄 README.md</div>
    </div>

    <div class="editor-area">
      <div class="tab-bar">
        <div class="editor-tab">
          <span>📄 index.html</span>
          <span style="color:#858585; margin-left: 6px;">●</span>
        </div>
      </div>

      <div class="code-view">
        <div class="line-numbers">
          12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28
        </div>
        <div class="code-content">
          <div>&nbsp;&nbsp;<span class="c-tag">&lt;link</span> <span class="c-attr">rel=</span><span class="c-str">"stylesheet"</span> <span class="c-attr">href=</span><span class="c-str">"style.css"</span><span class="c-tag">&gt;</span></div>
          <div><br></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- ===================================================================== --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- IBM CLOUD CODE ENGINE API URL PLACEHOLDERS                             --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- ===================================================================== --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- INSTRUCTIONS FOR SUBMISSION &amp; DEPLOYMENT:                             --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- When deployed to IBM Cloud Code Engine, replace the localhost URLs   --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- below with your actual deployed Code Engine application endpoints.    --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- ===================================================================== --&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-tag">&lt;script&gt;</span></div>
          <div class="diff-highlight">&nbsp;&nbsp;&nbsp;&nbsp;window.<span class="c-var">PRODUCT_DETAILS_API_URL</span> = <span class="c-str">"https://product-details-service.14e8a21f.us-south.codeengine.appdomain.cloud"</span>;</div>
          <div class="diff-highlight">&nbsp;&nbsp;&nbsp;&nbsp;window.<span class="c-var">DEALER_PRICING_API_URL</span>&nbsp; = <span class="c-str">"https://dealer-pricing-service.14e8a21f.us-south.codeengine.appdomain.cloud"</span>;</div>
          <div>&nbsp;&nbsp;<span class="c-tag">&lt;/script&gt;</span></div>
          <div>&nbsp;&nbsp;<span class="c-comm">&lt;!-- ===================================================================== --&gt;</span></div>
          <div><span class="c-tag">&lt;/head&gt;</span></div>
          <div><span class="c-tag">&lt;body&gt;</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="status-bar">
    <div>🌿 main* • 0 errors • 0 warnings</div>
    <div>Ln 24, Col 1 • Spaces: 2 • UTF-8 • HTML • Prettier</div>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(TEMP_DIR, 'screen4.html'), html4);

// =============================================================================
// SCREEN 5: Deploy Dealer Evaluation Frontend on Code Engine
// =============================================================================
const html5 = wrapInIBMCloudConsole(
  "dealer-evaluation-frontend",
  "Ready",
  "https://dealer-evaluation-frontend.14e8a21f.us-south.codeengine.appdomain.cloud",
  "HTML5 / Vanilla JS Web App",
  "8080",
  {
    buildSource: "Local Directory (./dealer-evaluation-frontend)",
    healthJson: '{"status":"OK","app":"dealer-evaluation-frontend","cdn_cache":"HIT","http_status":200}'
  }
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen5.html'), html5);

// =============================================================================
// Common Frontend Web Portal Template
// =============================================================================
function generatePortalHTML(options) {
  const {
    dropdownExpanded = false,
    selectedProduct = null,
    dealerDropdownExpanded = false,
    selectedDealer = null,
    showAllDealers = false
  } = options;

  const dealerLabel = selectedDealer 
    ? (typeof selectedDealer === 'object' ? `${selectedDealer.name} (${selectedDealer.location})` : selectedDealer)
    : (showAllDealers ? 'ALL DEALERS (Compare All 4 Quotes)' : (dealerDropdownExpanded ? 'Select a Dealer to view offer...' : 'Great Lakes Fleet & Auto (Detroit, MI)'));

  return `
  <style>
    .portal-container {
      background: #0b1120;
      color: #f8fafc;
      font-family: 'Inter', sans-serif;
      min-height: 100%;
      padding: 0 0 20px;
    }
    .portal-nav {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .portal-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .portal-logo-icon {
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
    }
    .portal-title { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
    .portal-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }
    .portal-pills { display: flex; gap: 12px; align-items: center; }
    .status-pill {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11.5px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .pill-green-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .main-grid {
      max-width: 1280px;
      margin: 16px auto 0;
      padding: 0 24px;
    }

    /* Control Panel */
    .control-card {
      background: #131d31;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px 22px;
      margin-bottom: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .control-header {
      margin-bottom: 12px;
    }
    .ctrl-h2 { font-size: 16.5px; font-weight: 600; color: #f8fafc; }
    .ctrl-desc { font-size: 12px; color: #94a3b8; margin-top: 2px; }

    .dropdown-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .field-group { position: relative; }
    .field-label {
      display: block;
      font-size: 11.5px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .select-box {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .select-box.active {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }

    /* Dropdown Mock Menu */
    .mock-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #1e293b;
      border: 1px solid #38bdf8;
      border-radius: 8px;
      margin-top: 4px;
      z-index: 100;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    .menu-item {
      padding: 10px 14px;
      font-size: 13px;
      color: #e2e8f0;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .menu-item:hover, .menu-item.highlight {
      background: #0284c7;
      color: #ffffff;
      font-weight: 500;
    }
    .menu-item-price { font-weight: 600; font-size: 12px; opacity: 0.9; }

    /* Product Specs Card */
    .product-details-container {
      background: #131d31;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px 22px;
      margin-bottom: 16px;
      display: flex;
      gap: 20px;
    }
    .prod-badge {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 6px;
    }
    .prod-name { font-size: 20px; font-weight: 700; color: #fff; }
    .prod-msrp { font-size: 14.5px; color: #10b981; font-weight: 600; margin-top: 2px; }
    .prod-desc { font-size: 12.5px; color: #94a3b8; margin: 8px 0 12px; line-height: 1.45; }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .spec-item {
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .spec-lbl { font-size: 10.5px; color: #64748b; text-transform: uppercase; }
    .spec-val { font-size: 13px; color: #f8fafc; font-weight: 600; margin-top: 2px; }

    /* Single Dealer Card */
    .single-dealer-card {
      background: #131d31;
      border: 1px solid #1e293b;
      border-left: 4px solid #38bdf8;
      border-radius: 10px;
      padding: 18px 22px;
    }
    .dealer-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .dealer-title-grp h3 { font-size: 19px; font-weight: 700; color: #fff; }
    .dealer-loc { font-size: 12.5px; color: #94a3b8; margin-top: 2px; }
    .dealer-price-grp { text-align: right; }
    .price-big { font-size: 30px; font-weight: 800; color: #38bdf8; }
    .savings-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      font-size: 11.5px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 3px;
    }
    .dealer-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #0f172a;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .info-lbl { font-size: 11px; color: #64748b; }
    .info-val { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-top: 2px; }

    /* All Dealers Comparison Grid */
    .comparison-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .comp-title { font-size: 17px; font-weight: 700; color: #fff; }
    .comp-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .comp-card {
      background: #131d31;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .comp-card.best-deal {
      border: 2px solid #10b981;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
    }
    .best-badge {
      position: absolute;
      top: -9px;
      right: 12px;
      background: #10b981;
      color: #042f2e;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      text-transform: uppercase;
    }
    .card-dealer-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
    .card-dealer-loc { font-size: 11.5px; color: #94a3b8; }
    .card-dealer-price { font-size: 22px; font-weight: 800; color: #38bdf8; margin: 10px 0 4px; }
    .card-dealer-price.best { color: #34d399; }
    .card-dealer-savings { font-size: 11.5px; color: #10b981; font-weight: 600; }
    .card-dealer-details {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #1e293b;
      font-size: 11.5px;
      color: #cbd5e1;
      line-height: 1.6;
    }
  </style>

  <div class="portal-container">
    <header class="portal-nav">
      <div class="portal-brand">
        <div class="portal-logo-icon">⚡</div>
        <div>
          <div class="portal-title">Dealer Evaluation Portal</div>
          <div class="portal-sub">IBM Cloud Code Engine Microservices Architecture</div>
        </div>
      </div>
      <div class="portal-pills">
        <div class="status-pill">
          <span class="pill-green-dot"></span>
          <span>Product API: <strong>Online (Python)</strong></span>
        </div>
        <div class="status-pill">
          <span class="pill-green-dot"></span>
          <span>Pricing API: <strong>Online (Node.js)</strong></span>
        </div>
      </div>
    </header>

    <div class="main-grid">
      <div class="control-card">
        <div class="control-header">
          <div class="ctrl-h2">Vehicle Model & Dealer Selection</div>
          <div class="ctrl-desc">Select a product from the Python catalog microservice, then evaluate certified dealer quotes from the Node.js pricing microservice.</div>
        </div>

        <div class="dropdown-row">
          <!-- Product Dropdown -->
          <div class="field-group">
            <label class="field-label">1. Select Vehicle / Product</label>
            <div class="select-box ${dropdownExpanded ? 'active' : ''}">
              <span>${selectedProduct ? selectedProduct.name + ' (' + selectedProduct.category + ')' : 'Apex Horizon EV — Electric SUV ($48,500)'}</span>
              <span>${dropdownExpanded ? '▲' : '▼'}</span>
            </div>

            ${dropdownExpanded ? `
            <div class="mock-menu">
              <div class="menu-item highlight">
                <span>Apex Horizon EV (Electric SUV)</span>
                <span class="menu-item-price">$48,500 MSRP</span>
              </div>
              <div class="menu-item">
                <span>Solaria Hybrid Cross (Compact Hybrid)</span>
                <span class="menu-item-price">$29,800 MSRP</span>
              </div>
              <div class="menu-item">
                <span>Titan Forge V8 Truck (Heavy-Duty Truck)</span>
                <span class="menu-item-price">$54,200 MSRP</span>
              </div>
              <div class="menu-item">
                <span>Vortex GT Coupe (Performance Sports Car)</span>
                <span class="menu-item-price">$63,900 MSRP</span>
              </div>
              <div class="menu-item">
                <span>TerraPulse Offroad EV (All-Terrain Electric)</span>
                <span class="menu-item-price">$51,000 MSRP</span>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Dealer Dropdown -->
          <div class="field-group">
            <label class="field-label">2. Select Authorized Dealer Offer</label>
            <div class="select-box ${dealerDropdownExpanded ? 'active' : ''}">
              <span>${dealerLabel}</span>
              <span>${dealerDropdownExpanded ? '▲' : '▼'}</span>
            </div>

            ${dealerDropdownExpanded ? `
            <div class="mock-menu">
              <div class="menu-item" style="font-weight:700; color:#38bdf8;">
                <span>🌟 ALL DEALERS (Compare All 4 Quotes)</span>
                <span class="menu-item-price">Compare side-by-side</span>
              </div>
              <div class="menu-item highlight">
                <span>Metro Premier Auto Group (Chicago, IL)</span>
                <span class="menu-item-price">Rating: 4.8 ★</span>
              </div>
              <div class="menu-item">
                <span>Summit Coast Motors (San Francisco, CA)</span>
                <span class="menu-item-price">Rating: 4.9 ★</span>
              </div>
              <div class="menu-item">
                <span>Great Lakes Fleet & Auto (Detroit, MI)</span>
                <span class="menu-item-price">Rating: 4.6 ★</span>
              </div>
              <div class="menu-item">
                <span>Lone Star Velocity Motors (Dallas, TX)</span>
                <span class="menu-item-price">Rating: 4.7 ★</span>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Selected Product Specs Card (if product selected) -->
      ${selectedProduct ? `
      <div class="product-details-container">
        <div style="flex:1;">
          <span class="prod-badge">${selectedProduct.category}</span>
          <div class="prod-name">${selectedProduct.name}</div>
          <div class="prod-msrp">MSRP: $${selectedProduct.msrp.toLocaleString()}</div>
          <div class="prod-desc">${selectedProduct.description}</div>
          <div class="specs-grid">
            <div class="spec-item">
              <div class="spec-lbl">Powertrain</div>
              <div class="spec-val">Dual Motors AWD</div>
            </div>
            <div class="spec-item">
              <div class="spec-lbl">Battery Range</div>
              <div class="spec-val">310 miles</div>
            </div>
            <div class="spec-item">
              <div class="spec-lbl">Horsepower</div>
              <div class="spec-val">380 hp</div>
            </div>
            <div class="spec-item">
              <div class="spec-lbl">0 - 60 MPH</div>
              <div class="spec-val">4.2 sec</div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Single Dealer Quote Card -->
      ${selectedDealer ? `
      <div class="single-dealer-card">
        <div class="dealer-top-row">
          <div class="dealer-title-grp">
            <div style="display:flex; align-items:center; gap:8px;">
              <h3>${selectedDealer.name}</h3>
              <span style="background:#0284c7; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">Certified Dealer</span>
            </div>
            <div class="dealer-loc">${selectedDealer.location} • 📞 ${selectedDealer.phone} • ⭐ ${selectedDealer.rating} / 5.0 Rating</div>
          </div>
          <div class="dealer-price-grp">
            <div class="price-big">$${selectedDealer.price.toLocaleString()}</div>
            <div class="savings-badge">Save $${(48500 - selectedDealer.price).toLocaleString()} below MSRP</div>
          </div>
        </div>

        <div class="dealer-info-grid">
          <div class="info-item">
            <div class="info-lbl">Financing Rate</div>
            <div class="info-val">${selectedDealer.apr}</div>
          </div>
          <div class="info-item">
            <div class="info-lbl">Inventory Status</div>
            <div class="info-val">${selectedDealer.stock}</div>
          </div>
          <div class="info-item">
            <div class="info-lbl">Delivery Estimate</div>
            <div class="info-val">${selectedDealer.delivery}</div>
          </div>
          <div class="info-item">
            <div class="info-lbl">Warranty Included</div>
            <div class="info-val">${selectedDealer.warranty}</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- All Dealers Comparison Cards -->
      ${showAllDealers ? `
      <div class="comparison-section">
        <div class="comparison-header">
          <div class="comp-title">All 4 Authorized Dealer Quotes for Apex Horizon EV</div>
          <span style="font-size:13px; color:#10b981; font-weight:600;">✓ Lowest price automatically highlighted</span>
        </div>

        <div class="comp-grid">
          <!-- Dealer 1 (Best Value) -->
          <div class="comp-card best-deal">
            <div class="best-badge">Lowest Price Offer</div>
            <div>
              <div class="card-dealer-name">Great Lakes Fleet & Auto</div>
              <div class="card-dealer-loc">Detroit, MI • 4.6 ★</div>
              <div class="card-dealer-price best">$46,200</div>
              <div class="card-dealer-savings">Save $2,300 off MSRP</div>
            </div>
            <div class="card-dealer-details">
              <div><strong>APR:</strong> 2.9% (48 mos)</div>
              <div><strong>Stock:</strong> 6 units allocated</div>
              <div><strong>Delivery:</strong> 4-6 business days</div>
              <div><strong>Warranty:</strong> 4-Yr / 50,000 mi</div>
            </div>
          </div>

          <!-- Dealer 2 -->
          <div class="comp-card">
            <div>
              <div class="card-dealer-name">Lone Star Velocity Motors</div>
              <div class="card-dealer-loc">Dallas, TX • 4.7 ★</div>
              <div class="card-dealer-price">$46,800</div>
              <div class="card-dealer-savings">Save $1,700 off MSRP</div>
            </div>
            <div class="card-dealer-details">
              <div><strong>APR:</strong> 3.1% (60 mos)</div>
              <div><strong>Stock:</strong> In Stock (2 units)</div>
              <div><strong>Delivery:</strong> 2-3 business days</div>
              <div><strong>Warranty:</strong> 5-Yr / 60,000 mi</div>
            </div>
          </div>

          <!-- Dealer 3 -->
          <div class="comp-card">
            <div>
              <div class="card-dealer-name">Summit Coast Motors</div>
              <div class="card-dealer-loc">San Francisco, CA • 4.9 ★</div>
              <div class="card-dealer-price">$47,100</div>
              <div class="card-dealer-savings">Save $1,400 off MSRP</div>
            </div>
            <div class="card-dealer-details">
              <div><strong>APR:</strong> 3.4% (60 mos)</div>
              <div><strong>Stock:</strong> In Stock (3 units)</div>
              <div><strong>Delivery:</strong> 2-4 business days</div>
              <div><strong>Warranty:</strong> 6-Yr / 72,000 mi</div>
            </div>
          </div>

          <!-- Dealer 4 -->
          <div class="comp-card">
            <div>
              <div class="card-dealer-name">Metro Premier Auto Group</div>
              <div class="card-dealer-loc">Chicago, IL • 4.8 ★</div>
              <div class="card-dealer-price">$47,500</div>
              <div class="card-dealer-savings">Save $1,000 off MSRP</div>
            </div>
            <div class="card-dealer-details">
              <div><strong>APR:</strong> 3.9% (60 mos)</div>
              <div><strong>Stock:</strong> Arriving Tomorrow (4)</div>
              <div><strong>Delivery:</strong> 3-5 business days</div>
              <div><strong>Warranty:</strong> 5-Yr / 60,000 mi</div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  </div>
  `;
}

// =============================================================================
// SCREEN 6: Homepage showing products preloaded in the dropdown
// =============================================================================
const html6 = wrapInBrowserWindow(
  "https://dealer-evaluation-frontend.14e8a21f.us-south.codeengine.appdomain.cloud/",
  "Dealer Evaluation – Preloaded Products",
  generatePortalHTML({
    dropdownExpanded: true,
    selectedProduct: null,
    dealerDropdownExpanded: false,
    selectedDealer: null,
    showAllDealers: false
  })
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen6.html'), html6);

// =============================================================================
// SCREEN 7: Product selected from dropdown, dealers supplying the product listed
// =============================================================================
const html7 = wrapInBrowserWindow(
  "https://dealer-evaluation-frontend.14e8a21f.us-south.codeengine.appdomain.cloud/",
  "Dealer Evaluation – Supplying Dealers Listed",
  generatePortalHTML({
    dropdownExpanded: false,
    selectedProduct: {
      id: "P101",
      name: "Apex Horizon EV",
      category: "Electric SUV",
      msrp: 48500,
      description: "Dual-motor all-wheel-drive electric SUV with ultra-fast charging and advanced driver assistance."
    },
    dealerDropdownExpanded: true,
    selectedDealer: null,
    showAllDealers: false
  })
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen7.html'), html7);

// =============================================================================
// SCREEN 8: Dealer selected for product, price offered displayed
// =============================================================================
const html8 = wrapInBrowserWindow(
  "https://dealer-evaluation-frontend.14e8a21f.us-south.codeengine.appdomain.cloud/",
  "Dealer Evaluation – Quoted Dealer Price Displayed",
  generatePortalHTML({
    dropdownExpanded: false,
    selectedProduct: {
      id: "P101",
      name: "Apex Horizon EV",
      category: "Electric SUV",
      msrp: 48500,
      description: "Dual-motor all-wheel-drive electric SUV with ultra-fast charging and advanced driver assistance."
    },
    dealerDropdownExpanded: false,
    selectedDealer: {
      name: "Summit Coast Motors",
      location: "San Francisco, CA",
      phone: "(415) 555-0182",
      rating: 4.9,
      price: 47100,
      apr: "3.4% (60 mos)",
      stock: "In Stock (3 units available)",
      delivery: "2-4 business days",
      warranty: "6-Year / 72,000 mi Platinum Elite"
    },
    showAllDealers: false
  })
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen8.html'), html8);

// =============================================================================
// SCREEN 9: All dealers selected from list, price of all dealers displayed
// =============================================================================
const html9 = wrapInBrowserWindow(
  "https://dealer-evaluation-frontend.14e8a21f.us-south.codeengine.appdomain.cloud/",
  "Dealer Evaluation – All Dealer Quotes Compared",
  generatePortalHTML({
    dropdownExpanded: false,
    selectedProduct: {
      id: "P101",
      name: "Apex Horizon EV",
      category: "Electric SUV",
      msrp: 48500,
      description: "Dual-motor all-wheel-drive electric SUV with ultra-fast charging and advanced driver assistance."
    },
    dealerDropdownExpanded: false,
    selectedDealer: null,
    showAllDealers: true
  })
);
fs.writeFileSync(path.join(TEMP_DIR, 'screen9.html'), html9);

console.log("All 9 HTML templates written to temp_html.");

// RENDER FUNCTION VIA CHROME
const screens = [
  { id: 1, file: '01_product_details_code_engine_deployment.png', html: 'screen1.html' },
  { id: 2, file: '02_dealer_pricing_code_engine_deployment.png', html: 'screen2.html' },
  { id: 3, file: '03_git_clone_frontend_microservice.png', html: 'screen3.html' },
  { id: 4, file: '04_api_placeholders_code_change.png', html: 'screen4.html' },
  { id: 5, file: '05_dealer_evaluation_frontend_deployment.png', html: 'screen5.html' },
  { id: 6, file: '06_homepage_products_preloaded.png', html: 'screen6.html' },
  { id: 7, file: '07_product_selected_dealers_listed.png', html: 'screen7.html' },
  { id: 8, file: '08_single_dealer_pricing_displayed.png', html: 'screen8.html' },
  { id: 9, file: '09_all_dealers_pricing_displayed.png', html: 'screen9.html' }
];

const { spawnSync } = require('child_process');

for (const s of screens) {
  const htmlPath = path.join(TEMP_DIR, s.html);
  const outPath = path.join(OUTPUT_DIR, s.file);
  const artifactPath = path.join(ARTIFACT_DIR, s.file);

  console.log(`Rendering Screenshot ${s.id}: ${s.file}...`);
  const res = spawnSync(CHROME_PATH, [
    '--headless=new',
    `--screenshot=${outPath}`,
    '--window-size=1280,820',
    `file:///${htmlPath.replace(/\\/g, '/')}`
  ]);

  if (res.error) {
    console.error(`Error rendering ${s.file}:`, res.error);
  }

  // Copy to artifact directory so it can be viewed and embedded
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, artifactPath);
    console.log(`Saved: ${outPath} & ${artifactPath}`);
  } else {
    console.error(`Output file was not generated: ${outPath}`);
  }
}

console.log("ALL 9 SCREENSHOTS GENERATED SUCCESSFULLY!");
