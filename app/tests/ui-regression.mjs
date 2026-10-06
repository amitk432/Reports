import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
const base =
  process.env.TEST_BASE_URL ||
  process.argv.find((arg) => arg.startsWith("--base-url="))?.slice(11) ||
  "http://127.0.0.1:3010";
const output = fileURLToPath(
  new URL("../../Output/UI_Redesign/", import.meta.url),
);
await fs.mkdir(output, { recursive: true });
const expected = JSON.parse(
  await fs.readFile(
    new URL("../../records/index.json", import.meta.url),
    "utf8",
  ),
);
const expectedMilestones =
  expected.timeline.length +
  ["R-066", "R-098"].filter((id) => {
    const r = expected.reports.find((r) => r.id === id);
    return r?.reportedDate && r.reportedDate !== r.date;
  }).length;
const browser = await chromium.launch({
  headless: true,
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const checks = [];
checks.push = (...values) => {
  console.log(...values);
  return Array.prototype.push.apply(checks, values);
};
try {
  await page.goto(base);
  await page
    .getByRole("heading", { name: "A clearer picture of care." })
    .waitFor();
  await page.locator(".scene-canvas canvas").waitFor();
  if (expected.patient.currentCare) {
    assert.match(
      await page.locator(".patient-strip").innerText(),
      /BLK-Max Hospital/,
    );
    assert.match(
      await page.locator(".patient-strip").innerText(),
      /Ventilator support/,
    );
    checks.push(
      "Current BLK-Max ICU and ventilator status is displayed separately from historical medications",
    );
  }
  assert.equal(await page.locator(".organ-tabs button").count(), 5);
  assert.equal(await page.locator(".region-pin").count(), 9);
  await page
    .getByRole("button", {
      name: "Locate Posterior corpus callosum",
      exact: true,
    })
    .click();
  assert.match(
    await page.locator(".location-detail").innerText(),
    /left of the midline/,
  );
  await page
    .getByRole("button", {
      name: "Select location Lateral ventricles & fourth ventricle",
      exact: true,
    })
    .click();
  assert.match(
    await page.locator(".location-detail").innerText(),
    /Minimal blood/,
  );
  await page
    .getByRole("button", { name: "Possible causes", exact: true })
    .click();
  assert.match(
    await page.locator(".cause-explanation").innerText(),
    /Hypoperfusion/,
  );
  assert.match(
    await page.locator(".cause-explanation").innerText(),
    /unconfirmed/,
  );
  await page
    .getByRole("button", { name: "Damage process", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Play illustration", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Pause illustration", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page
    .getByRole("button", { name: "Pause illustration", exact: true })
    .click();
  await page.screenshot({
    path: output + "brain-damage-process-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Locations", exact: true }).click();
  assert.match(
    await page.locator(".diagram-progress").innerText(),
    /Newly mentioned regions do not prove new strokes/,
  );
  checks.push(
    "Five focused diagrams; nine MRI regions; location, possible cause, process animation and dated progression controls work",
  );
  await page.screenshot({
    path: output + "care-overview-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Explore Bloodstream", exact: true })
    .click();
  await page
    .getByRole("heading", {
      name: "Enterobacter cloacae isolated",
      exact: true,
    })
    .waitFor();
  await page.locator(".evidence-link").first().click();
  await page.locator("dialog.viewer[open]").waitFor();
  assert.match(
    await page.locator(".viewer header h2").innerText(),
    /Enterobacter/,
  );
  await page.locator(".document-image img").evaluate((img) => img.decode());
  await page
    .getByRole("button", { name: "Rotate document", exact: true })
    .click();
  assert.match(
    await page.locator(".document-image img").getAttribute("style"),
    /rotate\(90deg\)/,
  );
  await page
    .getByRole("button", { name: "Zoom in document", exact: true })
    .click();
  await page.getByRole("button", { name: "Fit document", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .locator(".viewer header")
    .getByRole("link", { name: "Download", exact: true })
    .click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /\.jpg$/);
  checks.push("3D marker opens the source report and downloads the original");
  await page.getByRole("button", { name: "Close viewer", exact: true }).click();
  for (const name of [
    "Heart & mitral valve",
    "Kidneys",
    "Left hip surgical site",
    "Brain",
  ]) {
    await page
      .getByRole("button", { name: `Explore ${name}`, exact: true })
      .click();
    await page.locator(".scene-canvas canvas").waitFor();
    assert.ok((await page.locator(".region-pin").count()) > 0);
  }
  await page
    .getByRole("link", { name: "Damage & causes", exact: true })
    .click();
  await page.locator(".scene-canvas canvas").waitFor();
  await page.screenshot({
    path: output + "focused-brain-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Toggle auto rotation" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle auto rotation" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("button", { name: "Reset 3D view" }).click();
  const canvas = page.locator(".scene-canvas canvas");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 80,
    box.y + box.height / 2 + 15,
    { steps: 8 },
  );
  await page.mouse.up();
  await page.mouse.wheel(0, -100);
  await page.getByRole("button", { name: "Reset 3D view" }).click();
  checks.push(
    "Focused organ switching, rotation, drag, and zoom controls work",
  );
  await page.getByRole("button", { name: "Add area note" }).click();
  await page.getByLabel("Finding area", { exact: true }).selectOption("hip");
  await page
    .getByLabel("Observation or question")
    .fill("Ask the care team about the previous hip infection.");
  await page
    .getByLabel("Link a source report (optional)")
    .selectOption("R-066");
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", {
      name: "Explore Left hip surgical site",
      exact: true,
    })
    .click();
  await page
    .getByText("Ask the care team about the previous hip infection.", {
      exact: true,
    })
    .waitFor();
  assert.match(await page.locator(".family-note").innerText(), /Family note/);
  await page
    .getByRole("button", { name: "Delete family note", exact: true })
    .click();
  assert.equal(await page.locator(".family-note").count(), 0);
  checks.push("Family area notes persist across reload and can be removed");
  await page
    .getByRole("link", { name: "All reports", exact: false })
    .first()
    .click();
  await page
    .getByRole("heading", { name: "Every report. One place." })
    .waitFor();
  assert.equal(await page.locator(".report-row").count(), 15);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert.match(await page.locator(".pagination").innerText(), /Showing 16–30/);
  await page
    .getByRole("searchbox", { name: "Search reports" })
    .fill("MRI Brain Plain");
  assert.equal(await page.locator(".report-row").count(), 2);
  await page.locator(".report-main").first().click();
  await page.locator("dialog.viewer[open]").waitFor();
  assert.match(
    await page.locator(".viewer header h2").innerText(),
    /MRI Brain Plain/,
  );
  await page.locator(".document-image img").evaluate((img) => img.decode());
  assert.match(
    await page.locator(".document-image img").getAttribute("src"),
    /BLK-Max/,
  );
  await page.getByRole("button", { name: "Close viewer", exact: true }).click();
  checks.push(
    "Both new BLK-Max MRI pages are searchable and the original photograph loads",
  );
  await page
    .getByRole("searchbox", { name: "Search reports" })
    .fill("Enterobacter");
  assert.equal(await page.locator(".report-row").count(), 3);
  await page.locator(".report-main").first().click();
  await page.locator("dialog.viewer[open]").waitFor();
  await page.keyboard.press("Escape");
  await page.locator("dialog.viewer").waitFor({ state: "detached" });
  assert.equal(await page.locator("dialog.viewer").count(), 0);
  await page
    .getByRole("searchbox", { name: "Search reports" })
    .fill("nothing-exists-xxx");
  await page.getByRole("heading", { name: "No matching reports" }).waitFor();
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "More filters" }).click();
  await page.getByRole("checkbox", { name: "Abnormal results" }).check();
  assert.ok((await page.locator(".report-row").count()) > 0);
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .first()
    .click();
  checks.push(
    "Report search, pagination, empty state, filters, and Escape close work",
  );
  await page.screenshot({
    path: output + "reports-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Treatment timeline", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Every step of the care journey." })
    .waitFor();
  assert.equal(
    await page.locator(".timeline-record").count(),
    expected.reports.length,
  );
  assert.equal(
    await page.locator(".timeline-event").count(),
    expectedMilestones,
  );
  await page
    .getByRole("combobox", { name: "Timeline content" })
    .selectOption("milestones");
  assert.equal(await page.locator(".timeline-record").count(), 0);
  assert.equal(
    await page.locator(".timeline-event").count(),
    expectedMilestones,
  );
  await page
    .getByRole("combobox", { name: "Timeline content" })
    .selectOption("all");
  await page
    .getByRole("combobox", { name: "Timeline hospital" })
    .selectOption("Chandra Laxmi Hospital");
  assert.ok(
    (await page.locator(".timeline-record").count()) < expected.reports.length,
  );
  await page
    .getByRole("combobox", { name: "Timeline hospital" })
    .selectOption("");
  await page
    .getByRole("searchbox", { name: "Search timeline" })
    .fill("vancomycin");
  assert.ok((await page.locator(".timeline-event").count()) > 0);
  await page.getByRole("searchbox", { name: "Search timeline" }).fill("");
  await page.locator(".timeline-record summary").first().click();
  assert.ok((await page.locator(".timeline-record[open]").count()) > 0);
  checks.push(
    "Timeline shows every report and milestone, with hospital/content/search filters",
  );
  await page.screenshot({
    path: output + "timeline-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Lab trends", exact: true }).click();
  await page.locator("svg.chart").waitFor();
  assert.ok((await page.locator("svg.chart").count()) > 0);
  await page.locator(".testlist button").first().click();
  await page.getByRole("link", { name: "Care summaries", exact: true }).click();
  await page.locator(".summary-card").first().waitFor();
  assert.equal(
    await page.locator(".summary-card").count(),
    expected.summaries.length,
  );
  await page
    .locator(".summary-card")
    .filter({ hasText: "family review (text)" })
    .getByRole("button", { name: "View summary", exact: true })
    .click();
  await page.locator(".viewer-body pre").waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector(".viewer-body pre")
      ?.textContent.includes("Understanding the ICU reports"),
  );
  await page.keyboard.press("Escape");
  checks.push(
    `Lab trends and all ${expected.summaries.length} prepared summaries remain accessible`,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/#overview");
  await page.locator(".scene-canvas canvas").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page
    .getByRole("button", {
      name: "Locate Right posterior frontal region",
      exact: true,
    })
    .click();
  assert.match(
    await page.locator(".location-detail").innerText(),
    /largest acute infarct/,
  );
  await page
    .getByRole("button", { name: "Damage process", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Play illustration", exact: true })
    .click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: output + "brain-process-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Locations", exact: true }).click();
  await page.screenshot({
    path: output + "care-overview-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Explore Brain", exact: true })
    .click();
  await page.locator(".evidence-link").first().click();
  await page.locator("dialog.viewer[open]").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: output + "report-viewer-mobile.png",
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await page.goto(base + "/#index");
  await page.locator(".report-row").first().waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: output + "reports-mobile.png",
    fullPage: true,
  });
  await page.goto(base + "/#timeline");
  await page.locator(".timeline-record").first().waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  checks.push(
    "Overview, report viewer, library, and timeline fit a 390px mobile viewport",
  );
  assert.deepEqual(errors, []);
  checks.push("No uncaught browser errors");
  await fs.writeFile(
    output + "verification.json",
    JSON.stringify({ base, checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
