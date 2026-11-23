# Content changelog

Dated log of content edits on catalyzegrowth.co. Each entry lists the date, files or URLs, what changed, and why.

## 2026-11-23 (bug fix: restore homepage form reCAPTCHA)

Not a content batch. No copy, title, meta, H1, URL, nav, footer, price, or fax changes.

- `/` (index.html), form `demo-request`: restored Netlify reCAPTCHA the same way service-page forms have it (`data-netlify-recaptcha="true"` on the form, plus a `div data-netlify-recaptcha`). The `netlify-honeypot="bot-field"` attribute and hidden honeypot field were already present and were left in place. Hidden `form-name`, visible fields, first-landing/referrer/UTM capture, and the `/thank-you` redirect are unchanged.
- Why: PR #30 (live Sep 25) removed homepage reCAPTCHA for mobile speed. Since then Netlify flagged 584 homepage submissions as spam and 0 as verified. Service-page forms that kept reCAPTCHA were not hit the same way.
- Speed: Netlify injects a synchronous `https://www.google.com/recaptcha/api.js` into the recaptcha div at deploy time, so the script cannot be deferred or lazy-loaded without dropping that div and risking form detection or verification. The injected script sits at the bottom of the homepage, after the main content, as on the service pages. Lighthouse before/after is in the PR.

## 2026-11-23 (biweekly reviewed batch: service page upgrades only)

Change type: one kind only. Added one sourced, answer-first section with a table to two existing service pages that already target Top 5 terms. No title, meta description, H1, URL, nav, footer, form, schema, price, or Book a Demo change. No existing copy was removed or reworded, no figures were removed, and no fax wording was touched or added. No new URLs, no redirects, no merges.

- `/healthcare-marketing-agency` (healthcare-marketing-agency.html), target term "healthcare marketing agency".
  - Before: fees for the three services appeared only inside one prose paragraph under "The three channels, one map". No minimum terms for SEO or paid ads, no month one work, and no timeline for judging results on the page.
  - After: new H3 "What does a healthcare marketing agency cost with Catalyze Care, and what happens in month one?" with a one line lead and a table (Service, Monthly fee, Minimum term, First month work, How to judge it) for referral $5,000 (3 months), SEO $799 (6 months), paid ads $2,500 plus media (3 months). Inserted directly before "How to evaluate a healthcare marketing agency".
  - Sources (our own published pages): fees and terms from /pricing; first month work and how each channel is judged from /how-catalyze-care-works (steps 3 and 4).
  - Why: Top 5 Plan (Nov 17) says upgrade the existing healthcare marketing agency page with pricing and process. Prices go in a table per the QA checklist. Case studies were left out because no real client data is available (house rule).
- `/referral` (referral.html), target terms "healthcare referral marketing" (GSC top page for that query) and "physician referral marketing".
  - Before: process shown only as four one line steps (Identify, Engage, Convert, Optimize). No month by month plan, no timeline to first referrals, and nothing on what to count each month.
  - After: new section `#first-90-days` between "Our Process" and "Pricing", with H2 "What happens in the first 90 days of physician referral marketing?", a lead line, a Month 1/2/3 table (What we do, What to count), and two short paragraphs: the ongoing cadence (first visit note within 48 hours, quarterly capacity update, call when a referrer goes quiet) and the $5,000/month, 3 month minimum fee that covers the first quarter.
  - Sources (our own published posts): /blog/healthcare-referral-marketing-first-90-days (month 1 to 3 work, fields, 7 day close the loop) and /blog/referral-nurture-cadence-referring-offices (48 hour first visit note, quarterly capacity update, fading referrer call).
  - Why: Top 5 Plan asks for the work, timeline to first referrals, and price on the physician referral marketing page. One page per intent (CoS G3), so the existing referral service page is upgraded instead of adding a URL.

Control pages (left untouched this cycle, compare against them): `/healthcare-referral-marketing`, `/seo`, `/seo-for-healthcare-practices`, `/healthcare-digital-marketing`. `/paid-ads` and `/paid-ads-for-healthcare-practices` are on hold and also untouched.

GSC baselines (property https://catalyzegrowth.co/, web, 28 days Oct 25 to Nov 21 2026, page dimension, pulled Nov 23 2026 PT). Recheck 14 days after go-live on an equal 28 day window.

| Page | Role | Impressions | Clicks | CTR | Avg position |
|---|---|---:|---:|---:|---:|
| /healthcare-marketing-agency | changed | 106 | 1 | 0.94% | 7.72 |
| /referral | changed | 97 | 0 | 0% | 19.56 |
| /healthcare-referral-marketing | control | 69 | 0 | 0% | 32.99 |
| /seo | control | 85 | 0 | 0% | 38.16 |
| /seo-for-healthcare-practices | control | 55 | 0 | 0% | 29.89 |
| /healthcare-digital-marketing | control | 2,721 | 0 | 0% | 48.95 |
| /paid-ads-for-healthcare-practices | hold | 157 | 0 | 0% | 47.70 |
| /paid-ads | hold | no rows | | | |

Query baselines (same window): healthcare marketing agency 14.0 (2 impressions); physician referral marketing 39.7 (129 impressions, top page /blog/what-is-healthcare-referral-marketing); healthcare referral marketing 27.3 (71 impressions, top page /referral); paid ads for healthcare practices and behavioral health marketing agency had no impressions. Bing AI Performance was not checked (needs a Bing sign-in).

## 2026-11-09

- Forms on `/` (demo-request), `/seo` (seo-inquiry), `/paid-ads` (paid-ads-inquiry), `/referral` (referral-inquiry), `/healthcare-marketing-agency` (agency-inquiry), and `/healthcare-digital-marketing` (digital-marketing-inquiry): added hidden fields for first landing page, first referrer, UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), and `gclid`. Netlify requires the fields in the static HTML to register them.
- `js/site.js`: on the first pageview of a session, a first-party script saves the landing path, document.referrer (origin and path only), and UTM/`gclid` values to sessionStorage without overwriting values already stored, then fills the hidden inputs on load. No cookies, no third-party calls, and no change to visible copy, titles, H1s, URLs, nav, pricing, or Book a Demo. Existing GA4 and generate_lead-on-success behavior is unchanged.
