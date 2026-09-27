# Muhammad Jawad | Applied AI Developer

**Turning ideas into intelligent products.**

A personal portfolio showcasing practical AI applications, agentic research systems, Python tools, and workflow automation. Built with a responsive interface, interactive project sections, and motion designed for desktop and mobile.

[GitHub](https://github.com/jawad-hua) · [LinkedIn](https://www.linkedin.com/in/muhammad-jawad-ai/) · [Email](mailto:jawadmjawad06@gmail.com) · [Download CV](site/assets/Muhammad-Jawad-CV.pdf)

## Overview

This portfolio brings together selected projects, technical capabilities, services, and contact information in one place. The design pairs a dark interface with lime accents, clear typography, an animated network globe, and expandable project case studies.

## Features

- **Responsive layout:** adapts to desktop, tablet, and mobile screens.
- **Animated mobile navigation:** hamburger menu with keyboard support, Escape-to-close behavior, and managed focus.
- **Interactive motion:** canvas network visualization, section reveals, and animated project elements.
- **Motion preferences:** respects reduced-motion settings and pauses relevant animations when the page is hidden.
- **Project case studies:** expandable explanations of the problem, approach, and implementation.
- **Resume access:** downloadable PDF and an About-section preview link.
- **Professional contact options:** WhatsApp, email, LinkedIn, and GitHub.
- **Search metadata:** canonical URLs, social sharing metadata, structured data, sitemap, and robots configuration.
- **Environment-aware builds:** production indexing enabled; Vercel preview builds marked `noindex, nofollow`.

## Selected Projects

| Project | Focus | Demo |
| --- | --- | --- |
| AI Video Studio | AI-assisted short-form video workflows, voiceovers, subtitles, and rendering | [Open application](https://ai-video-studio-sigma-murex.vercel.app) |
| ResearchMind AI | AI-assisted research and document workflows | [Open application](https://researchmind-aibyjawad.streamlit.app/) |
| MathGPT | Multimodal mathematics assistance with step-by-step explanations | [Open application](https://mathgptbyjawad.streamlit.app/) |
| DocShield | Document inspection, file-signature verification, text extraction, and OCR | [Open application](https://jawad-docsshield.streamlit.app/) |

Some demos use Streamlit hosting and may need to wake up after inactivity. Each project has its own codebase; this repository contains the portfolio website.

## Services Presented

- AI applications and agentic workflows
- Python and workflow automation
- FastAPI services and API integrations
- AI video and content automation

## Portfolio Technology

| Layer | Technology |
| --- | --- |
| Page structure | HTML5 |
| Design | CSS3, responsive layouts, custom animations |
| Interactivity | Vanilla JavaScript, Canvas API, Intersection Observer |
| Build | Node.js, built-in filesystem modules |
| Hosting configuration | Vercel |

The portfolio has no third-party npm dependencies. The technologies listed inside its project cards describe those separate applications.

## Repository Structure

| Path | Purpose |
| --- | --- |
| `site/index.html` | Portfolio content, sections, links, and metadata |
| `site/style.css` | Styling, responsive layouts, and CSS animations |
| `site/app.js` | Canvas visualization and page interactions |
| `site/navigation.js` | Mobile navigation behavior |
| `site/assets/Muhammad-Jawad-CV.pdf` | Downloadable resume |
| `site/og.png` | Social sharing image |
| `site/apple-touch-icon.png` | Touch icon |
| `site/robots.txt` | Crawler rules |
| `site/sitemap.xml` | Sitemap |
| `site/404.html` | Not-found page |
| `build.mjs` | Static build and deployment URL replacement |
| `vercel.json` | Vercel build configuration |
| `public/` | Generated deployment output; excluded from version control |

## Run Locally

Open a terminal in the repository root. With Python installed, serve the source:

```bash
python -m http.server 8080 --directory site
```

Open **http://localhost:8080** in your browser. On systems where Python uses the `python3` command, use that instead.

### Production Build

Install Node.js to run the build. Supply your actual public HTTPS origin as `SITE_URL`.

**Windows PowerShell:**

```powershell
$env:SITE_URL = "https://your-domain.com"
npm run build
python -m http.server 8080 --directory public
```

**macOS / Linux:**

```bash
SITE_URL=https://your-domain.com npm run build
python3 -m http.server 8080 --directory public
```

Replace the example domain with your own. The build writes the deployable website to `public/`.

## Deploy to Vercel

Import this GitHub repository into Vercel and use these settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root (`./`) |
| Build Command | `node build.mjs` |
| Output Directory | `public` |

Keep access to Vercel System Environment Variables enabled. The build uses `SITE_URL` when provided, otherwise `VERCEL_PROJECT_PRODUCTION_URL`.

For a custom domain, connect it in the Vercel project domain settings, configure the DNS records shown by Vercel, set the Production `SITE_URL` to the intended primary HTTPS origin, and redeploy.

The build updates canonical, social, and sitemap URLs. The previous hosting URL in source files is a replacement marker; deploy the generated `public/` directory.

Production pages allow indexing. Non-production Vercel builds block indexing. Search engine indexing is not guaranteed or immediate.

## Customize

1. Edit `site/index.html` to update the introduction, services, projects, or contact links.
2. Edit `site/style.css` to change the design and responsive behavior.
3. Replace `site/assets/Muhammad-Jawad-CV.pdf` using the same filename to update the resume.
4. Update `site/og.png` when changing the social sharing artwork.
5. Rebuild and review the deployed website on both desktop and mobile.

## Validation

The exported package passed JavaScript syntax checks, mobile navigation interaction checks, local asset path checks, CV byte verification, and production/preview indexing checks. Browser visual testing was unavailable in the build environment; a final review on real devices is recommended.

## Contact

**Muhammad Jawad — Applied AI Developer**  
Based in Pakistan · Open to remote opportunities, freelance projects, and collaboration.

- **Email:** [jawadmjawad06@gmail.com](mailto:jawadmjawad06@gmail.com)
- **WhatsApp:** [Start a conversation](https://wa.me/923298636377)
- **LinkedIn:** [muhammad-jawad-ai](https://www.linkedin.com/in/muhammad-jawad-ai/)
- **GitHub:** [jawad-hua](https://github.com/jawad-hua)
