# Editing guide

A short, plain-language guide to changing the BOTZ website. Everything here is done in the admin at **/admin** — no code needed.

## The basics: draft, preview, publish

- Every page and most settings have **Save draft** and **Publish**. Drafts are invisible to visitors.
- Use **Preview** (or the **Live preview** button on pages) to see the draft exactly as visitors will see it. A yellow bar at the top reminds you it is a draft.
- Click **Publish** when you are happy. Visitors see the change within seconds.
- Switch language with the **language selector at the top of the editor** (Հայերեն / English / Русский). Each language is saved separately; prices and structure are shared.

## Undo anything: versions and restore

- Open any page or setting and click **Versions** (top right). You can compare versions side by side.
- Click a version and choose **Restore**. This creates a *new* draft from the old one — nothing is lost, and you can still publish or discard it.

## Pages and sections

- **Content → Pages** lists every page. Click **Create new** to add a page; give it a title and an address (slug), e.g. `seo` → /en/seo.
- A page is built from **sections**. Use **Add section** to insert: Hero, Statement + text, Text, Image/video, Service cards, Package preview, Interactive pricing, Package comparison, Find-my-package guide, Process steps, FAQ, Contact section, Call to action, Portfolio/testimonials/blog list.
- Drag sections by the handle to **reorder**. Use the row menu to **duplicate** or **remove**. Tick **Hide this section** in *Section layout* to hide it without deleting.
- *Section layout* sets background (page, soft surface, inverse, orange), alignment, width, spacing and an optional `#anchor` for links.
- Wrap words in `*asterisks*` in headings to make them orange.
- **Published languages** (right side of a page): untick a language while its translation is not ready. Visitors then see a clear “not available yet” link instead of a half-translated page.
- Changing the address of a published page automatically creates a **redirect** from the old address (see **Website → Redirects**).

## Packages and prices

- **Packages & pricing → Packages & prices** holds every package, price, inclusion, exclusion and add-on. It is **one document**, so prices, scopes and labels always go live together and the comparison, guide, estimates and pages always agree.
- Prices are monthly amounts in AMD for 1, 3, 6, 9 and 12 months. **Leave a price empty to make that term unavailable** (it then shows “Not available” and cannot be selected). Totals and savings are calculated automatically — never type them.
- **Inclusions** are rows with a feature key, status (Included / Not included / Not specified / Replaced), quantity, optional “up to” maximum, cadence and a description in each language. A package that *inherits* another (e.g. Gold inherits Dominance) shows everything from the parent; a row with the same feature key **replaces** the parent's row.
- **Bundles** list their component packages but keep their own price.
- **Feature labels** (tab) name each comparable inclusion once for all packages.
- **Approval state** must be **Approved** before you can publish. Use the **Private review** tab for notes and the review checklist — they are never shown on the website.
- **Right now:** the website shows the original prices and package names. The detailed revised scopes are waiting as a draft marked *Proposed*. Review them (Preview → Pricing page), tick off the checklist, set *Approved*, then **Publish**.

## Find-my-package guide

- **Packages & pricing → Find-my-package guide**: edit questions, answers and rules.
- Each **rule** says: when these answers are given, add *points* to a package and show a *reason*. The package with the most points that fits the budget and term is suggested; others appear as alternatives. Budget answers have a maximum monthly amount; term answers have a number of months.

## Contacts, phone, WhatsApp, routing

- **Website → Site settings → Contacts & routing**: phone, WhatsApp number, email, Instagram (leave empty to hide it everywhere), and the contact people.
- For each person (Mariam, Edgar) choose which services they handle. The website routes SMM to Mariam, SEO and Website to Edgar, and lets visitors pick either for combined plans. A package can override this in its *Contact* field.
- *Mobile sticky contact bar* switches the phone bar on/off and chooses its buttons.

## Leads

- **Leads → Leads** lists every saved inquiry with the selected package and prices (recalculated by the server at submission).
- Set **Status** (New, Contacted, Proposal sent, Won, Lost) and **Assigned to**. Add **Private notes**; the **Activity** list records who changed what and when.
- Use **Filters** (status, service, person, language, date) and search. Administrators can **Export CSV** with the current filters, and delete leads.
- The **Email notification** box shows whether the team email was sent. If it says *Failed* or *Email not configured*, the inquiry is still saved — just follow it up from here.
- WhatsApp and phone clicks are not leads; they only appear in analytics.

## Shared estimates

- Visitors can share a read-only estimate link. **Leads → Estimates** lists them; tick **Revoked** or change **Expires at** to switch a link off. Expiry length is in *Site settings → Forms & estimates*.
- If prices change later, an old link says so and offers to recalculate with current prices.

## Images and videos

- **Content → Media**: upload PNG, JPEG, WebP, AVIF, GIF, MP4 or WebM (max 50 MB). Organise them in **folders**.
- Always fill **Alt text** in each language. Set a **focal point** so cropping keeps the important part.
- To replace an image, upload the new one and select it where the old one was used.
- A file that is still used somewhere **cannot be deleted**; the message lists where it is used. Open a file to see its *Usage*.

## Design and brand

- **Website → Design & brand**: logos (light theme, dark theme, B mark, favicon), colours for the **light and dark themes separately**, fonts, heading size, button and card rounding, and **Animation** (Off / Subtle / Expressive).
- The site refuses colour combinations that are too hard to read, and tells you which pair to fix.
- Visitors who ask their device for reduced motion never see animations.

## Menus, footer and small texts

- **Website → Menus & footer**: header links, header button, footer columns and statement. Links to *Work* and *Blog* appear only when those sections have published content.
- **Website → Interface text** (three screens: general, pricing, forms & guide): every button, label, form message and error, in each language. Keep `{placeholders}` exactly as they are.

## Search engines and sharing

- Each page has an **SEO** tab: title, description, social image (with a live search preview), *Hide from search engines*, and an optional canonical override.
- *Site settings → Search & social*: title suffix, default description and image, “Allow search engines to index the site”, extra blocked paths, and truthful organisation details. The sitemap and robots.txt update automatically.

## Portfolio, testimonials and blog

- These stay **hidden until you publish real items**. Case studies and testimonials cannot be published until **Client permission is confirmed** is ticked; results can only be saved when marked verified, with a timeframe and context.

## Translation report

- **Tools → Translation report** lists every text that exists in one language but is empty in another (drafts included), with a link to fix it.

## Users

- **Administration → Users** (administrators only): invite colleagues and set their role — *Administrator*, *Editor* (content, packages, settings) or *Sales* (leads).

## What you cannot change without a developer

- Adding new **types** of sections or new fields (the existing sections cover the pages; new kinds need code).
- Adding a **fourth language**, or more than the two contact-person slots (Mariam, Edgar — their names and details are editable).
- The pricing **terms** offered are fixed at 1, 3, 6, 9 and 12 months (any term can be made unavailable per package).
- Fonts are chosen from a list of tested options that support Armenian, Russian and English.
- The analytics provider and email server are set by the hosting environment, not in the admin.
