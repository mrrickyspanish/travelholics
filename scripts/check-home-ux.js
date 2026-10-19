#!/usr/bin/env node
/** Browser regression checks. Network writes are intercepted with synthetic data. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.UX_BASE_URL || 'http://localhost:3000';
const widths = [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560];
const sections = ['hero', 'adventure-shelf', 'about', 'how-it-works', 'ocean-pause', 'testimonials', 'cruise-lines', 'group-trips', 'videos', 'contact', 'shop-strip'];

async function ready(page, path = '/') {
  const response = await page.goto(base + path, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, `${path} should load`);
  await page.evaluate(() => document.fonts.ready);
}
async function visible(locator) { await locator.waitFor({ state: 'visible' }); }

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
      page.setDefaultTimeout(15000);
      await ready(page);
      await visible(page.locator('header').getByRole('button', { name: 'Open navigation menu' }));
      assert.equal(await page.locator('#hero a').first().getAttribute('href'), '/group-cruises');
      assert.equal(await page.locator('#hero').getByRole('link', { name: 'Plan my cruise', exact: true }).getAttribute('href'), '/#contact');
      assert.deepEqual(await page.locator('main > section').evaluateAll(items => items.map(el => el.id)), sections);
      assert.equal(await page.locator('#destination-discovery').count(), 1, 'legacy destinations fragment must survive');
      assert.equal(await page.locator('#proof').count(), 1, 'one proof set');
      assert.equal(await page.locator('iframe').count(), 0, 'players must not load on arrival');
      // Settle lazy media and fonts before measuring the full page budget.
      for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => scrollTo(0, 0));
      const measurements = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        height: document.documentElement.scrollHeight,
        portrait: document.querySelector('#about img').getBoundingClientRect().top + scrollY,
        sections: Object.fromEntries([...document.querySelectorAll('main > section')].map(el => [el.id, Math.ceil(el.getBoundingClientRect().height)])),
      }));
      assert.equal(measurements.overflow, false, `page overflow at ${width}`);
      if (width === 1440) {
        // The owner wants one prominent topic with a preview of the next.
        assert(measurements.height <= 7600, 'desktop height budget'); assert(measurements.portrait < 1500, 'desktop portrait reach');
        for (const [id, limit] of Object.entries({ 'how-it-works': 800, testimonials: 800, 'group-trips': 740, videos: 900 })) assert(measurements.sections[id] <= limit, `${id}: desktop section height`);
      }
      if (width === 390) {
        assert(measurements.height <= 8800, 'mobile height budget'); assert(measurements.portrait < 2532, 'mobile portrait reach');
        for (const [id, limit] of Object.entries({ 'how-it-works': 900, testimonials: 800, 'group-trips': 650, contact: 1200 })) assert(measurements.sections[id] <= limit, `${id}: mobile section should remain compact`);
      }
      if (width === 768) assert(measurements.height <= 7200, 'tablet height budget');
      if (width >= 1024) {
        const panel = await page.locator('.home-group-panel').boundingBox();
        assert(Math.abs(panel.x) < 1 && Math.abs(panel.width - width) < 1, `desktop group panel spans the viewport at ${width}`);
        for (const id of ['about', 'how-it-works', 'testimonials', 'group-trips', 'videos', 'contact']) assert(measurements.sections[id] >= 900 * .74, `${id}: major topic gets its own space`);
      }
      const coastal = page.locator('#ocean-pause');
      assert.equal(await coastal.locator('video').count(), 0, 'coastal divider uses a sharp still image');
      const dividerHeight = await coastal.evaluate(el => el.getBoundingClientRect().height);
      assert(Math.abs(dividerHeight - Math.min(272, Math.max(142.8, width * .153))) < 1, 'divider is 15% shorter');
      const overlaps = await page.locator('.group-trip-moment').evaluateAll(items => {
        const rects = items.map(el => el.getBoundingClientRect());
        return rects.some((a, i) => rects.slice(i + 1).some(b => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top));
      });
      assert.equal(overlaps, false, `collage overlap at ${width}`);
      const planningRail = page.locator('#planning-steps');
      const nextStep = page.getByRole('button', { name: 'Next planning steps', exact: true });
      const railFrame = await planningRail.boundingBox();
      const nextFrame = await nextStep.boundingBox();
      assert(nextFrame.x >= railFrame.x + railFrame.width, 'process arrow sits beyond the visible cards');
      assert(Math.abs(nextFrame.y + nextFrame.height / 2 - railFrame.y - railFrame.height / 2) < 2, 'process arrow aligns with the middle of the cards');
      assert.equal(await planningRail.evaluate(el => getComputedStyle(el).scrollbarWidth), 'none', 'process rail hides its native scrollbar');
      assert(await page.getByRole('button', { name: 'Previous planning steps', exact: true, includeHidden: true }).isDisabled(), 'Back stays disabled at the first step');
      for (let step = 0; step < 3 && await nextStep.isEnabled(); step++) {
        await nextStep.click();
        // Scroll events update the end-control state on the next paint.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      }
      assert(await nextStep.isDisabled(), `planning rail reaches its end at ${width}`);
      assert(await planningRail.evaluate(el => {
        const frame = el.getBoundingClientRect(); const last = el.lastElementChild.getBoundingClientRect();
        return last.left >= frame.left - 2 && last.right <= frame.right + 2;
      }), `last planning step stays reachable at ${width}`);
      const endPosition = await planningRail.evaluate(el => el.scrollLeft);
      await planningRail.focus();
      await page.keyboard.press('ArrowLeft');
      assert(await planningRail.evaluate((el, end) => el.scrollLeft < end, endPosition), 'planning rail supports keyboard navigation');
      if (width === 390) {
        const keyboardPosition = await planningRail.evaluate(el => el.scrollLeft);
        await page.getByRole('button', { name: 'Previous planning steps', exact: true }).click();
        assert(await planningRail.evaluate((el, previous) => el.scrollLeft < previous, keyboardPosition), 'quiet Back control reaches earlier steps');
      }
      if (width === 390) {
        await page.evaluate(() => document.querySelectorAll('footer details').forEach(el => { el.open = true; }));
        const undersized = await page.evaluate(() => [...document.querySelectorAll('a,button,input:not([type=hidden]),select,textarea,summary')]
          .filter(el => !el.closest('[aria-hidden=true]') && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
          .map(el => ({ name: el.getAttribute('aria-label') || el.textContent.trim().slice(0, 40) || el.id, rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => rect.width < 43.9 || rect.height < 43.9).map(({ name }) => name));
        assert.deepEqual(undersized, [], 'all visible mobile targets should be at least 44px');
      }
      console.log(`✓ layout ${width}px: ${measurements.height}px; portrait at ${Math.round(measurements.portrait)}px`);
      await page.close();
    }

    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    // Never send a lead, notification, or database write during browser checks.
    let emailCalls = 0;
    let failEmail = true;
    let payload;
    await page.route('**/rest/v1/cruise_inquiries**', route => route.fulfill({ status: 201, contentType: 'application/json', body: '[]', headers: { 'access-control-allow-origin': '*' } }));
    await page.route('**/api/send-email', route => {
      emailCalls++;
      payload = route.request().postDataJSON();
      return route.fulfill({ status: failEmail ? 500 : 200, contentType: 'application/json', body: JSON.stringify(failEmail ? { error: 'Synthetic delivery failure' } : { success: true }) });
    });
    await ready(page, '/?utm_source=ux-check&utm_campaign=family-and-groups');
    const opener = page.getByRole('button', { name: 'Open navigation menu' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Site navigation' });
    await visible(dialog);
    assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'focus should enter menu');
    await dialog.locator('a').first().focus();
    await page.keyboard.press('Shift+Tab');
    assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'backward focus stays in menu');
    await page.keyboard.press('Tab');
    assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'forward focus stays in menu');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert(await opener.evaluate(el => el === document.activeElement), 'menu returns focus');
    assert.equal(await page.locator('.home-sticky-cta').count(), 0, 'sticky CTA hidden in hero');
    await page.evaluate(() => scrollTo(0, document.getElementById('about').offsetTop));
    await visible(page.locator('.home-sticky-cta'));
    await page.locator('.home-sticky-cta a').click();
    await page.locator('.home-sticky-cta').waitFor({ state: 'detached' });
    const submit = page.locator('#contact').getByRole('button', { name: 'Start planning my trip' });
    await submit.click();
    assert.equal(await page.locator('#firstName').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#firstName').getAttribute('aria-describedby'), 'firstName-error');
    assert(await page.locator('#firstName').evaluate(el => el === document.activeElement), 'first invalid field gets focus');
    assert.equal(emailCalls, 0, 'invalid form must not submit');
    await page.locator('#firstName').fill('Alex');
    await page.locator('#lastName').fill('Example');
    await page.locator('#email').fill('invalid');
    await page.locator('#destination').selectOption('Not Sure Yet');
    await page.locator('#timing').selectOption('Just exploring options');
    await page.locator('#message').fill('Planning a family cruise for four.');
    await submit.click();
    assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
    assert.equal(emailCalls, 0);
    await page.locator('#email').fill('alex@example.com');
    await submit.click();
    await visible(page.getByText('We could not send your inquiry right now.', { exact: false }));
    assert.equal(await page.locator('#firstName').inputValue(), 'Alex', 'failure preserves input');
    assert.equal(await page.locator('#message').inputValue(), 'Planning a family cruise for four.');
    failEmail = false;
    await submit.click();
    await visible(page.getByRole('heading', { name: 'Now the fun part starts.' }));
    assert.equal(emailCalls, 2, 'one email attempt per valid submission');
    assert(payload.message.includes('utm_source=ux-check'), 'campaign attribution survives contact navigation');
    assert(await page.getByRole('heading', { name: 'Now the fun part starts.' }).evaluate(el => el === document.activeElement), 'success receives focus');
    assert.equal(await page.locator('canvas').count(), 0, 'reduced motion disables confetti');
    await page.evaluate(() => document.getElementById('shop-strip').scrollIntoView());
    assert.equal(await page.locator('.home-sticky-cta').count(), 0, 'sticky CTA stays hidden after contact');
    await page.route('**/embed/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Intercepted player</title>' }));
    await page.locator('.home-featured-video button').click();
    await visible(page.locator('.home-featured-video iframe'));
    assert.equal(await page.locator('iframe').count(), 1, 'click mounts only the selected player');
    console.log('✓ menu focus, sticky CTA, validation, delivery failure/retry, attribution, success focus, reduced motion, click-to-play');
    await page.close();

    const motionPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    motionPage.setDefaultTimeout(15000);
    await ready(motionPage);
    const stage = motionPage.locator('#testimonials > .home-container');
    await motionPage.waitForFunction(() => document.querySelector('#testimonials > .home-container').dataset.sectionEntrance === 'waiting');
    assert.equal(await stage.evaluate(el => getComputedStyle(el).opacity), '1', 'entrance content stays fully visible');
    assert(Math.abs(await stage.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a) - .94) < .001, 'desktop sections start visibly smaller');
    const layoutHeight = await motionPage.evaluate(() => document.documentElement.scrollHeight);
    await motionPage.evaluate(() => scrollTo(0, document.getElementById('testimonials').offsetTop - innerHeight * .7));
    await motionPage.waitForFunction(() => document.querySelector('#testimonials > .home-container').dataset.sectionEntrance === 'growing');
    const partialScale = await stage.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
    assert(partialScale > .94 && partialScale < .99, 'growth follows scroll position while the next section approaches');
    await motionPage.waitForTimeout(850);
    assert(Math.abs(await stage.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a) - partialScale) < .001, 'growth holds when scrolling stops');
    await motionPage.evaluate(() => scrollTo(0, document.getElementById('testimonials').offsetTop - innerHeight * .15));
    await motionPage.waitForFunction(() => document.querySelector('#testimonials > .home-container').dataset.sectionEntrance === 'complete');
    assert.equal(await stage.evaluate(el => getComputedStyle(el).transform), 'none', 'section reaches full size and releases its transform');
    assert.equal(await motionPage.evaluate(() => document.documentElement.scrollHeight), layoutHeight, 'section scaling does not change layout height');
    await motionPage.locator('#ocean-pause').scrollIntoViewIfNeeded();
    const coastImage = motionPage.locator('#ocean-pause img');
    await motionPage.waitForFunction(() => document.querySelector('#ocean-pause img').complete && document.querySelector('#ocean-pause img').naturalWidth > 0);
    const imageUrl = new URL(await coastImage.evaluate(el => el.currentSrc));
    assert(Number(imageUrl.searchParams.get('w')) >= 1440, 'desktop coastal image is delivered without upscaling');
    assert.equal(imageUrl.searchParams.get('q'), '90', 'coastal image uses high quality encoding');
    const coastTop = await motionPage.locator('#ocean-pause').evaluate(el => el.getBoundingClientRect().top + scrollY);
    const coastOffsets = [];
    for (const position of [.7, .15]) {
      await motionPage.evaluate(({ top, position }) => scrollTo(0, top - innerHeight * position), { top: coastTop, position });
      await motionPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const strip = await motionPage.locator('#ocean-pause').boundingBox();
      const media = await motionPage.locator('.home-ocean-media').boundingBox();
      assert(media.y <= strip.y && media.y + media.height >= strip.y + strip.height, 'parallax image fills the strip throughout its travel');
      coastOffsets.push(await motionPage.locator('.home-ocean-media').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42));
    }
    assert(coastOffsets[1] - coastOffsets[0] > 60, 'coastal strip has visible parallax as the page scrolls');
    await motionPage.locator('#hero').scrollIntoViewIfNeeded();
    await motionPage.locator('#testimonials').scrollIntoViewIfNeeded();
    assert.equal(await stage.getAttribute('data-section-entrance'), 'complete', 'section entrances do not replay');
    await motionPage.locator('#firstName').focus();
    assert.equal(await motionPage.locator('#contact > .home-container').getAttribute('data-section-entrance'), 'complete', 'keyboard focus settles the section immediately');
    await motionPage.emulateMedia({ reducedMotion: 'reduce' });
    await motionPage.waitForFunction(() => getComputedStyle(document.querySelector('.home-ocean-media')).transform === 'none');
    await motionPage.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
    assert.equal(await motionPage.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'changing motion preference stops all effects');
    console.log('✓ scroll-driven growth, steady scale when idle, stable layout, sharp coastal image, keyboard focus, live reduced-motion changes');
    await motionPage.close();

    for (const mode of ['no-js', 'reduced-motion']) {
      const p = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced-motion' ? 'reduce' : 'no-preference' });
      await ready(p);
      const invisible = await p.locator('main h1, main h2, main blockquote').evaluateAll(items => items.filter(el => !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })).map(el => el.textContent));
      assert.deepEqual(invisible, [], `${mode}: reading content stays visible`);
      assert.equal(await p.locator('#ocean-pause video').count(), 0, `${mode}: coast remains a still image`);
      if (mode === 'no-js') await visible(p.getByRole('link', { name: 'Email directly instead' }));
      else {
        for (const section of await p.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
        assert.equal(await p.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'reduced motion has no running animations');
      }
      console.log(`✓ ${mode}: visible content and usable fallback`);
      await p.close();
    }
    // Client navigation also checks that homepage CSS does not leak to shared pages.
    const shared = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await ready(shared);
    await shared.locator('#hero a').first().click();
    await shared.waitForURL('**/group-cruises');
    await visible(shared.locator('h1'));
    assert.equal(await shared.locator('main').count(), 1);
    assert.equal(await shared.locator('.home-mobile-optimized').count(), 0);
    for (const path of ['/duck-hunt', '/shop', '/videos', '/admin/login']) {
      await ready(shared, path);
      assert.equal(await shared.locator('.home-mobile-optimized').count(), 0);
    }
    console.log('✓ shared routes: group cruises, Duck Hunt, shop, videos, admin login');
    await shared.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
