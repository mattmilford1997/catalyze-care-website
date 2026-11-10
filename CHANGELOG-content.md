# Content changelog

Dated log of content edits on catalyzegrowth.co. Each entry lists the date, files or URLs, what changed, and why.

## 2026-11-09

- Forms on `/` (demo-request), `/seo` (seo-inquiry), `/paid-ads` (paid-ads-inquiry), `/referral` (referral-inquiry), `/healthcare-marketing-agency` (agency-inquiry), and `/healthcare-digital-marketing` (digital-marketing-inquiry): added hidden fields for first landing page, first referrer, UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), and `gclid`. Netlify requires the fields in the static HTML to register them.
- `js/site.js`: on the first pageview of a session, a first-party script saves the landing path, document.referrer (origin and path only), and UTM/`gclid` values to sessionStorage without overwriting values already stored, then fills the hidden inputs on load. No cookies, no third-party calls, and no change to visible copy, titles, H1s, URLs, nav, pricing, or Book a Demo. Existing GA4 and generate_lead-on-success behavior is unchanged.
