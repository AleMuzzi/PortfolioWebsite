/**
 * Plausible Analytics — Clean Custom Events
 *
 * Plausible already handles:
 *   - Pageviews (hash-based routing via hashBasedRouting: true)
 *   - Unique visitors, bounce rate, session duration
 *   - Referrer / UTM attribution
 *
 * These custom events track meaningful user decisions and engagement signals
 * that Plausible can't infer on its own.
 */

// Plausible injects window.plausible
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

// ─── Session state (reset on page reload) ───────────────────────────────────
let sessionStart = Date.now();
let firstSection: string | null = null;
let lastSection: string | null = null;
let maxScrollDepth = 0;
let scrollTracked = new Set<number>();

// ─── Core tracker ────────────────────────────────────────────────────────────
function track(event: string, props: Record<string, string | number | boolean> = {}) {
  window.plausible?.(event, { props });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Page section viewed — fires on first view and last view per session */
export function trackSection(section: string) {
  if (!firstSection) firstSection = section;
  lastSection = section;
  track('section_view', { section, first: firstSection === section });
}

/** Language switch */
export function trackLanguageToggle(from: string, to: string) {
  track('language_toggle', { from, to, return_visitor: false }); // flag updated on next load
}

/** Mobile warning dismissed — fires once per session */
export function trackMobileWarningDismissed() {
  track('mobile_warning_dismissed');
}

/** Digital Twin opened — distinguishes desktop overlay vs mobile takeover */
export function trackDigitalTwinOpen(context: 'desktop_overlay' | 'mobile_takeover' | 'terminal_easter_egg') {
  track('digital_twin_open', { context });
}

/** Quick-start chip clicked inside Digital Twin */
export function trackDigitalTwinQuickStart(label: string) {
  track('digital_twin_quick_start', { label });
}

/** Project card clicked in grid */
export function trackProjectClick(name: string, lang: string) {
  track('project_click', { project: name, lang });
}

/** Experience card clicked */
export function trackExperienceClick(name: string, lang: string) {
  track('experience_click', { experience: name, lang });
}

/** Sandro message sent */
export function trackSandroSend(messageLength: number) {
  track('sandro_send', { message_length: messageLength });
}

/** Sandro response received */
export function trackSandroResponse(ms: number, chars: number) {
  track('sandro_response', { response_ms: ms, response_chars: chars });
}

/** Sandro chat cleared */
export function trackSandroClear() {
  track('sandro_clear');
}

/** Tag modal — item clicked (project or experience) */
export function trackTagModalItemClick(name: string, type: 'project' | 'experience', tag: string) {
  track('tag_modal_item_click', { name, item_type: type, tag });
}

/** Filter modal opened */
export function trackFilterModalOpen() {
  track('filter_modal_open');
}

/** Filter modal — tag toggled */
export function trackFilterTagToggle(tag: string, active: boolean) {
  track('filter_tag_toggle', { tag, active });
}

/** Filter modal — clear all clicked */
export function trackFilterClear() {
  track('filter_clear');
}

/** Tag clicked on a project card (opens TagModal) */
export function trackTagClick(tag: string, source: 'project_card' | 'experience_card') {
  track('tag_click', { tag, source });
}

/** Tag modal opened */
export function trackTagModalOpen(tag: string) {
  track('tag_modal_open', { tag });
}

/** Contact link clicked — actionable conversion signal */
export function trackContactClick(platform: 'email' | 'linkedin' | 'github') {
  track('contact_click', { platform });
}

/** Terminal easter egg interactions */
export function trackTerminalOpen() {
  track('terminal_open');
}
export function trackTerminalCommand(cmd: string) {
  track('terminal_command', { cmd });
}

/** Scroll depth — fires at 25%, 50%, 75%, 90% (once each) */
export function trackScrollDepth(percent: number) {
  const milestones = [25, 50, 75, 90];
  for (const m of milestones) {
    if (percent >= m && !scrollTracked.has(m)) {
      scrollTracked.add(m);
      track('scroll_depth', { depth: m, section: lastSection ?? 'unknown' });
    }
  }
  if (percent > maxScrollDepth) maxScrollDepth = percent;
}

/** Session summary — call on page unload / visibility change */
export function trackSessionEnd() {
  const durationSecs = Math.round((Date.now() - sessionStart) / 1000);
  track('session_end', {
    duration: durationSecs,
    max_scroll: maxScrollDepth,
    entry_section: firstSection ?? 'unknown',
    exit_section: lastSection ?? 'unknown',
  });
}
