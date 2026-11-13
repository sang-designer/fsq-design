// Mock signal data for the attribution notification flow.
// Alert types follow the client-facing alert list: each one answers a question clients ask us.

export type Severity = "critical" | "warning" | "positive" | "info";
export type SignalKind = "ranking" | "change" | "trend" | "lift" | "delivery" | "reminder" | "spend" | "sufficiency" | "report";

export type SignalPoint = { label: string; value: number; low: number; high: number };

export type AlertGroup = "Performance and metrics" | "Delivery and pacing" | "Report status";
export const ALERT_GROUPS: AlertGroup[] = ["Performance and metrics", "Delivery and pacing", "Report status"];

/** The client-facing alert types customers can turn on, off, and tune on the Alerts page. */
export const ALERT_TYPES: { kind: SignalKind; group: AlertGroup; title: string; type: "Alert" | "Reminder"; question: string; description: string }[] = [
  { kind: "ranking", group: "Performance and metrics", type: "Alert", title: "Stack-ranking shifts", question: "Who moved in my rankings?", description: "When a partner, cut or other item moves up or down a ranking you follow." },
  { kind: "change", group: "Performance and metrics", type: "Alert", title: "Metric changes", question: "Did anything big change this week?", description: "When a metric you pick changes week over week by more than your chosen percentage." },
  { kind: "trend", group: "Performance and metrics", type: "Alert", title: "Core metric trends", question: "Is performance heading the right way?", description: "When Lift, Conv. rate, CPIV or CPV keeps moving the same way for several weeks." },
  { kind: "lift", group: "Performance and metrics", type: "Alert", title: "Lift results", question: "Do I have results to share?", description: "When lift becomes reportable, or a section's behavioral lift index rises above 100." },
  { kind: "delivery", group: "Delivery and pacing", type: "Alert", title: "Impression pace changes", question: "Is delivery on track?", description: "When impressions slow sharply or spike." },
  { kind: "sufficiency", group: "Delivery and pacing", type: "Alert", title: "Sufficiency pacing", question: "Will this report have enough data?", description: "When impressions or sample aren't on pace to reach sufficiency by the end of the campaign." },
  { kind: "reminder", group: "Delivery and pacing", type: "Reminder", title: "Campaign ending soon", question: "Have I sent everything you need?", description: "As a campaign nears its end date, a reminder to share every placement ID with Foursquare." },
  { kind: "spend", group: "Delivery and pacing", type: "Reminder", title: "Final spend and impressions due", question: "What do I owe Foursquare, and when?", description: "3 days before final spend and impression counts are due." },
  { kind: "report", group: "Report status", type: "Alert", title: "Reports not yet at sample", question: "Is my report ready yet?", description: "When a report hasn't reached sample, with its estimated ready date and pacing against the feasibility estimate." },
];

/** Reminders are about dates and to-dos, not a measured change, so they skip confidence and scope. */
export const isReminder = (k: SignalKind) => k === "reminder" || k === "spend";

export const KIND_LABEL: Record<SignalKind, string> = Object.fromEntries(ALERT_TYPES.map((t) => [t.kind, t.title])) as Record<SignalKind, string>;

export type Signal = {
  id: string;
  campaignSlug: string;
  campaignName: string;
  campaignLogo: string;
  logoColor: string;
  kind: SignalKind;
  severity: Severity;
  metric: string;
  /** Short, scannable: what + how much + where. */
  headline: string;
  /** One plain sentence a customer could forward to their boss. */
  summary: string;
  scope: { dimension: string; value: string };
  change: number; // percent, signed
  comparison: string;
  current: string;
  previous: string;
  /** How unusual this is, in plain words. */
  unusualness: string;
  confidence: "High" | "Medium" | "Low";
  minutesAgo: number;
  series: SignalPoint[];
  /** Replaces the % change wherever a percentage doesn't fit (rank moves, days left). */
  badge?: string;
  breakdown?: { label: string; change: number; share: string }[];
  ranking?: { label: string; from: number; to: number; value: string }[];
  indices?: { label: string; value: number }[];
  checklist?: { label: string; detail: string; done: boolean }[];
  checklistTitle?: string;
  checklistAside?: string;
  /** Progress toward a target by a deadline (sample sufficiency). */
  pace?: { unit: string; today: number; projected: number; needed: number; deadline: string; title?: string };
  drivers?: { text: string; confidence: "High" | "Medium" | "Low" }[];
  impact: string;
  recommendation: string;
  askPrompt?: string;
  cta?: { label: string; href: string };
  ruleName: string;
  /** Signals that share a root cause are bundled under one parent. */
  related?: string[];
};

const wk = ["Feb 9", "Feb 16", "Feb 23", "Mar 2", "Mar 9", "Mar 16", "Mar 23", "Mar 30"];
function series(values: number[], band: number): SignalPoint[] {
  // Expected band follows a smoothed baseline of the earlier weeks.
  return values.map((v, i) => {
    const prior = values.slice(Math.max(0, i - 3), i);
    const base = prior.length ? prior.reduce((a, b) => a + b, 0) / prior.length : v;
    return { label: wk[wk.length - values.length + i], value: v, low: +(base * (1 - band)).toFixed(2), high: +(base * (1 + band)).toFixed(2) };
  });
}

const QSR = { campaignSlug: "qsr-q2-2026", campaignName: "QSR Q2 2026 Campaign", campaignLogo: "QS", logoColor: "#6366f1" };
const MCS = { campaignSlug: "mcdonalds-summer", campaignName: "Mcdonald's Summer Campaign", campaignLogo: "M", logoColor: "#FFC72C" };
const MCD = { campaignSlug: "mcdonalds-q3-fall", campaignName: "McDonald's Q3 Fall Campaign", campaignLogo: "M", logoColor: "#FFC72C" };

export const SIGNALS: Signal[] = [
  {
    id: "sig-ne-impr",
    ...QSR,
    kind: "delivery",
    severity: "warning",
    metric: "Impressions",
    headline: "Impressions slowed 5.2% week over week in the Northeast",
    summary:
      "Northeast delivered 1.21M fewer impressions than last week, almost all of it from Snap in the New York DMA. Other regions held steady.",
    scope: { dimension: "Region", value: "Northeast" },
    change: -5.2,
    comparison: "vs. prior week",
    current: "22.1M",
    previous: "23.3M",
    unusualness: "Outside the normal range for this region. The usual weekly swing is ±2.1%.",
    confidence: "High",
    minutesAgo: 0,
    series: series([21.4, 22.0, 22.6, 22.9, 23.1, 23.4, 23.3, 22.1], 0.03),
    breakdown: [
      { label: "New York DMA", change: -11.4, share: "71% of the drop" },
      { label: "Boston DMA", change: -4.0, share: "18% of the drop" },
      { label: "Philadelphia DMA", change: -1.2, share: "9% of the drop" },
      { label: "Hartford DMA", change: 0.6, share: "Steady" },
    ],
    drivers: [
      { text: "Snap paused delivery in the New York DMA from Thu to Sun while a creative was re-approved.", confidence: "High" },
      { text: "Cold weather lowered mobile sessions across the Northeast that weekend (−3% market-wide).", confidence: "Medium" },
    ],
    impact:
      "If it continues, the Northeast ends the flight about 1.9% under its impression goal. Lift is not affected yet: NY is your least efficient DMA.",
    recommendation:
      "Confirm the Snap creative is live again. Consider moving the paused NY budget to Atlanta or Dallas, where lift is 3 to 4 times higher.",
    askPrompt: "Why did impressions slow down 5.2% week over week in the Northeast?",
    ruleName: "Impression pace changes",
    related: ["sig-snap-ny"],
  },
  {
    id: "sig-sample-pace",
    ...QSR,
    kind: "sufficiency",
    severity: "warning",
    metric: "Exposed sample",
    headline: "Sample isn't on pace to be big enough by Jun 30",
    summary:
      "At today's pace the campaign reaches 540K exposed devices by Jun 30, 10% short of the 600K needed to report lift with confidence for every partner.",
    scope: { dimension: "Campaign", value: "All partners" },
    change: -10.0,
    comparison: "",
    current: "540K",
    previous: "Projected by Jun 30. 600K needed.",
    unusualness: "Yelp and Epsilon are furthest behind. The campaign as a whole will still have enough sample to report lift.",
    confidence: "Medium",
    minutesAgo: 60 * 7,
    series: [],
    badge: "10% short",
    pace: { unit: "exposed devices", today: 412, projected: 540, needed: 600, deadline: "Jun 30" },
    breakdown: [
      { label: "Yelp", change: -34.0, share: "Projected 34% short" },
      { label: "Epsilon", change: -27.0, share: "Projected 27% short" },
      { label: "Zeta", change: -8.0, share: "Projected 8% short" },
      { label: "Snap", change: 12.0, share: "On pace" },
    ],
    impact: "Lift for Yelp and Epsilon may not reach confidence, so they'd show visits but not lift in the final report.",
    recommendation: "Raise Yelp and Epsilon delivery by about 20%, or combine them into one group for lift reporting.",
    askPrompt: "Will we reach a large enough sample by the end of the campaign?",
    ruleName: "Sufficiency pacing",
  },
  {
    id: "sig-report-sample",
    ...QSR,
    kind: "report",
    severity: "info",
    metric: "Custom report · Dining Out",
    headline: "Your Dining Out custom report hasn't reached sample yet",
    summary:
      "The report has 186K of the 250K exposed devices it needs. At today's pace it's ready around Jun 12, a week later than the feasibility estimate.",
    scope: { dimension: "Report", value: "Dining Out audience" },
    change: 0,
    comparison: "",
    current: "Jun 12",
    previous: "Estimated ready date, 7 days after the Jun 5 feasibility estimate",
    unusualness: "Delivery to the Dining Out audience is 12% under plan, mostly on Yelp.",
    confidence: "Medium",
    minutesAgo: 60 * 20,
    series: [],
    badge: "Ready ~Jun 12",
    pace: { unit: "exposed devices", today: 186, projected: 262, needed: 250, deadline: "Jun 30", title: "Progress to sample" },
    breakdown: [
      { label: "Yelp", change: -21.0, share: "Behind plan" },
      { label: "Pandora", change: -6.0, share: "Slightly behind" },
      { label: "Snap", change: 4.0, share: "On plan" },
    ],
    impact: "Until it reaches sample, the report shows visits but not lift for this audience.",
    recommendation: "No action needed to finish by Jun 30. To get it sooner, raise Yelp delivery to the Dining Out audience.",
    askPrompt: "When will my Dining Out custom report be ready?",
    ruleName: "Reports not yet at sample",
  },
  {
    id: "sig-final-spend",
    ...MCS,
    kind: "spend",
    severity: "warning",
    metric: "Final numbers submitted",
    headline: "Final spend and impressions are due in 3 days",
    summary:
      "Final spend and impression counts for Mcdonald's Summer Campaign are due Aug 15. We use them to calculate cost per visit and ROAS in your final report.",
    scope: { dimension: "Campaign", value: "All partners" },
    change: 0,
    comparison: "",
    current: "2 of 4",
    previous: "Partners submitted. Due Aug 15",
    unusualness: "",
    confidence: "High",
    minutesAgo: 60 * 4,
    series: [],
    badge: "3 days left",
    checklistTitle: "Final spend and impressions",
    checklistAside: "2 still needed",
    checklist: [
      { label: "Snap", detail: "Submitted Aug 8", done: true },
      { label: "Pandora", detail: "Submitted Aug 9", done: true },
      { label: "Teads", detail: "Not submitted", done: false },
      { label: "Zeta", detail: "Not submitted", done: false },
    ],
    impact: "Without final numbers, cost metrics in the final report use planned spend, which may not match what you paid.",
    recommendation: "Send Teads and Zeta final spend and impression counts by Aug 15.",
    cta: { label: "Submit final numbers", href: "/attribution/edit" },
    ruleName: "Final spend and impressions due",
  },
  {
    id: "sig-mcd-placements",
    ...MCD,
    kind: "reminder",
    severity: "critical",
    metric: "Placement IDs shared",
    headline: "Campaign ends in 5 days. 2 placement IDs haven't been shared yet",
    summary:
      "McDonald's Q3 Fall ends Sep 25. Visits from placements we don't have IDs for can't be measured, so they won't show up in your final report.",
    scope: { dimension: "Campaign", value: "All partners" },
    change: 0,
    comparison: "",
    current: "10 of 12",
    previous: "Campaign ends Sep 25",
    unusualness: "",
    confidence: "High",
    minutesAgo: 60 * 3,
    series: [],
    badge: "5 days left",
    checklist: [
      { label: "Snap · Fall Value Menu", detail: "Shared Aug 2", done: true },
      { label: "Pandora · Audio 30s", detail: "Shared Aug 2", done: true },
      { label: "Teads · Outstream video", detail: "Not shared", done: false },
      { label: "Zeta · CTV retargeting", detail: "Not shared", done: false },
    ],
    impact: "About 14% of planned impressions would be left out of the final report.",
    recommendation: "Ask Teads and Zeta for their placement IDs, then add them to the campaign before Sep 25.",
    cta: { label: "Add placement IDs", href: "/attribution/edit" },
    ruleName: "Campaign ending soon",
  },
  {
    id: "sig-atl-lift",
    ...QSR,
    kind: "change",
    severity: "positive",
    metric: "Lift",
    headline: "Lift up 18% week over week in Atlanta",
    summary:
      "Atlanta's visit lift rose to 5.2%, past your 15% alert and the highest of any DMA this flight, while cost per visit held at $0.28.",
    scope: { dimension: "DMA", value: "Atlanta" },
    change: 18.1,
    comparison: "vs. prior week",
    current: "5.2%",
    previous: "4.4%",
    unusualness: "Above your 15% week-over-week alert. A new high for this campaign.",
    confidence: "High",
    minutesAgo: 60 * 5,
    series: series([3.6, 3.8, 3.9, 4.1, 4.2, 4.3, 4.4, 5.2], 0.06),
    breakdown: [
      { label: "Yelp", change: 31.0, share: "44% of the gain" },
      { label: "Pandora", change: 22.4, share: "32% of the gain" },
      { label: "AdTheorent", change: 9.8, share: "19% of the gain" },
      { label: "Snap", change: 1.2, share: "Steady" },
    ],
    drivers: [
      { text: "The new lunch-daypart creative launched Mar 24 and is driving most of the gain.", confidence: "High" },
      { text: "Audiences aged 45 to 54 are over-performing and now make up 22% of impressions here.", confidence: "Medium" },
    ],
    impact: "About 2,100 extra incremental visits this week.",
    recommendation: "Scale it: Atlanta can take about 15% more budget before frequency passes 5.",
    askPrompt: "What drove the 18% lift increase in Atlanta this week?",
    ruleName: "Metric changes",
  },
  {
    id: "sig-partner-rank",
    ...QSR,
    kind: "ranking",
    severity: "info",
    metric: "Lift by partner",
    headline: "Pandora moved to #1 for lift, passing AdTheorent",
    summary:
      "Pandora's lift rose to 5.31% this week and overtook AdTheorent, which led for the first 6 weeks. Spotify climbed two places to #4.",
    scope: { dimension: "Cut", value: "Partners" },
    change: 0,
    comparison: "this week",
    current: "#1",
    previous: "#2 last week",
    unusualness: "The first change at the top of the partner ranking this flight.",
    confidence: "High",
    minutesAgo: 60 * 9,
    series: series([4.1, 4.3, 4.4, 4.6, 4.7, 4.82, 5.0, 5.31], 0.05),
    badge: "#2 → #1",
    ranking: [
      { label: "Pandora", from: 2, to: 1, value: "5.31%" },
      { label: "AdTheorent", from: 1, to: 2, value: "5.24%" },
      { label: "Yelp", from: 3, to: 3, value: "5.14%" },
      { label: "Spotify", from: 6, to: 4, value: "4.12%" },
      { label: "Nexxen", from: 4, to: 5, value: "4.08%" },
      { label: "Zeta", from: 5, to: 6, value: "3.92%" },
    ],
    drivers: [
      { text: "Pandora's new 30-second audio spot started running on Mar 24.", confidence: "Medium" },
      { text: "AdTheorent's frequency rose to 4.1, and lift usually softens above 4.", confidence: "Medium" },
    ],
    impact: "Pandora now delivers the most incremental visits per dollar of any partner ($16.97 per incremental visit).",
    recommendation: "Consider shifting 5 to 10% of budget toward Pandora while its lift is rising.",
    askPrompt: "Why did Pandora overtake AdTheorent in the partner lift ranking?",
    ruleName: "Stack-ranking shifts",
  },
  {
    id: "sig-index-100",
    ...QSR,
    kind: "lift",
    severity: "positive",
    metric: "Behavioral lift index",
    headline: "3 audience sections now index above 100 on behavioral lift",
    summary:
      "Low Frequenters, Medium Frequenters and adults aged 45 to 54 are all driving more lift than average. Two of them crossed 100 this week.",
    scope: { dimension: "Section", value: "Audiences" },
    change: 0,
    comparison: "this week",
    current: "3",
    previous: "sections above 100",
    unusualness: "Medium Frequenters and 45–54 crossed 100 this week. Low Frequenters have been above 100 all flight.",
    confidence: "High",
    minutesAgo: 60 * 26,
    series: [],
    badge: "3 above 100",
    indices: [
      { label: "Low Frequenters", value: 142 },
      { label: "45–54", value: 148 },
      { label: "Medium Frequenters", value: 113 },
      { label: "35–44", value: 98 },
      { label: "Not a customer", value: 78 },
      { label: "18–24", value: 74 },
    ],
    impact: "These three sections get 41% of impressions but drive 63% of lift.",
    recommendation: "Shift more delivery toward Low and Medium Frequenters, and away from non-customers.",
    askPrompt: "Show me campaign performance by cohort.",
    ruleName: "Lift results",
  },
  {
    id: "sig-mcd-lift-ready",
    ...MCD,
    kind: "lift",
    severity: "positive",
    metric: "Lift",
    headline: "Lift is now measurable in your McDonald's Q3 Fall report",
    summary:
      "Exposed visitors are now visiting 3.4% more than the control group, at 90% confidence. Lift numbers will appear in your report from today.",
    scope: { dimension: "Report", value: "Campaign" },
    change: 3.4,
    comparison: "vs. control",
    current: "3.4%",
    previous: "Not measurable last week",
    unusualness: "Reached 90% confidence after 4 weeks in flight.",
    confidence: "High",
    minutesAgo: 60 * 50,
    series: [],
    badge: "Ready",
    impact: "You can now compare partners, DMAs and audiences by lift, not just by visits.",
    recommendation: "Open the report to see which partners are driving the lift.",
    askPrompt: "What is the overall campaign performance insights?",
    ruleName: "Lift results",
  },
  {
    id: "sig-cpiv-trend",
    ...QSR,
    kind: "trend",
    severity: "warning",
    metric: "CPIV",
    headline: "Cost per incremental visit has risen 3 weeks in a row",
    summary:
      "CPIV went from $18.40 to $21.14 over three weeks, a 15% increase. Conversion rate is steady, so the cost rise comes from weaker lift.",
    scope: { dimension: "Campaign", value: "All partners" },
    change: 14.9,
    comparison: "over 3 weeks",
    current: "$21.14",
    previous: "$18.40",
    unusualness: "The longest rising streak on this campaign so far.",
    confidence: "Medium",
    minutesAgo: 60 * 75,
    series: series([18.6, 18.2, 18.5, 18.3, 18.4, 19.3, 20.2, 21.14], 0.04),
    breakdown: [
      { label: "Snap", change: 24.0, share: "46% of the increase" },
      { label: "iHeartRadio", change: 16.5, share: "28% of the increase" },
      { label: "Epsilon", change: 9.2, share: "14% of the increase" },
    ],
    drivers: [{ text: "Snap and iHeartRadio frequency passed 5 per user. After that, more ads stop adding visits.", confidence: "Medium" }],
    impact: "About $6.8K more spend per week for the same number of incremental visits.",
    recommendation: "Cap frequency at 5 on Snap and iHeartRadio.",
    askPrompt: "Why has cost per incremental visit risen three weeks in a row?",
    ruleName: "Core metric trends",
  },
  {
    id: "sig-snap-ny",
    ...QSR,
    kind: "delivery",
    severity: "info",
    metric: "Impressions",
    headline: "Snap delivery paused in New York DMA for 4 days",
    summary: "Snap reported no impressions in the New York DMA from Mar 26 to Mar 29. Delivery started again Mar 30.",
    scope: { dimension: "Partner", value: "Snap" },
    change: -100,
    comparison: "Mar 26 – Mar 29",
    current: "0",
    previous: "310K / day",
    unusualness: "This is the first gap in delivery on this campaign.",
    confidence: "High",
    minutesAgo: 60 * 30,
    series: series([310, 305, 312, 318, 0, 0, 0, 0], 0.05),
    breakdown: [{ label: "New York DMA", change: -100, share: "Only affected market" }],
    drivers: [{ text: "Snap held the creative for policy re-review (ticket SNP-44821).", confidence: "High" }],
    impact: "This explains most of the Northeast impression slowdown.",
    recommendation: "No action needed. Delivery has started again.",
    askPrompt: "Show me Snap performance.",
    ruleName: "Impression pace changes",
  },
];

export const SEVERITY_META: Record<Severity, { label: string; fg: string; bg: string; ring: string }> = {
  critical: { label: "Act now", fg: "#b42318", bg: "#fef3f2", ring: "#fecdca" },
  warning: { label: "Watch", fg: "#b54708", bg: "#fffaeb", ring: "#fedf89" },
  positive: { label: "Win", fg: "#067647", bg: "#ecfdf3", ring: "#abefc6" },
  info: { label: "Update", fg: "#175cd3", bg: "#eff8ff", ring: "#b2ddff" },
};

export function timeAgo(minutes: number) {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.round(minutes / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

/** A signal that arrives while the user is in the app (for the live toast). */
export const LIVE_SIGNAL_ID = "sig-ne-impr";

/** Answers the campaign chat gives when opened from a signal. */
export const SIGNAL_ASK_RESPONSES: Record<string, { title: string; content: string }> = {
  "When will my Dining Out custom report be ready?": {
    title: "Dining Out report: ready date",
    content: `**Short answer:** around **Jun 12**, a week later than the Jun 5 feasibility estimate.

**Where it stands**
   - **Sample today:** 186K of the 250K exposed devices needed (74%)
   - **Projected by Jun 30:** 262K, so it will reach sample before the campaign ends

**Why it's later than planned**
   - **Yelp:** delivering 21% under plan to the Dining Out audience
   - **Pandora:** 6% under plan
   - **Snap:** 4% ahead of plan

**What you'll see until then**
   - Visits for the Dining Out audience, but not lift.

**To get it sooner**
1. Raise Yelp delivery to the Dining Out audience by about 25%. That brings the ready date to about Jun 7.`,
  },
  "Will we reach a large enough sample by the end of the campaign?": {
    title: "Sample pace",
    content: `**Short answer:** the campaign as a whole will have enough sample to report lift, but two partners probably won't.

**Where you stand**
   - **Today:** 412K exposed devices
   - **Projected by Jun 30:** 540K
   - **Needed for lift on every partner:** 600K

**Partners at risk**
   - **Yelp:** projected 34% short
   - **Epsilon:** projected 27% short
   - **Zeta:** projected 8% short. Likely fine if delivery holds.

**Options**
1. Raise Yelp and Epsilon delivery by about 20% for the rest of the flight.
2. Or report Yelp and Epsilon together as one group, which reaches the sample needed by about Jun 12.`,
  },
  "Why did impressions slow down 5.2% week over week in the Northeast?": {
    title: "Northeast impressions: what changed",
    content: `**Short answer:** almost all of the slowdown came from one partner in one market. Snap delivered nothing in the New York DMA from Mar 26 to Mar 29 while a creative went through policy re-review.

**Where the 1.21M missing impressions came from**
   - **New York DMA:** −11.4% (71% of the drop), Snap only
   - **Boston DMA:** −4.0% (18%), a weather-driven dip in mobile sessions
   - **Philadelphia DMA:** −1.2% (9%), within normal range
   - **Hartford DMA:** +0.6%, steady

**Does it matter?**
   - Lift was **not** affected. NY is your least efficient DMA at 1.2% lift.
   - If the gap isn't made up, the Northeast ends about **1.9% under** its impression goal.

**Recommendation**
1. Confirm the Snap creative is live again. Delivery started again on Mar 30.
2. Instead of catching up in NY, move the paused budget (about $4.2K) to **Atlanta** or **Dallas**, where lift is 3 to 4 times higher.`,
  },
  "What drove the 18% lift increase in Atlanta this week?": {
    title: "Atlanta: lift up 18%",
    content: `**Short answer:** the new lunch-daypart creative (live Mar 24) is working, especially on Yelp and Pandora.

**What moved**
   - **Lift:** 4.4% → **5.2%** (+18%), the highest DMA this flight
   - **Cost per visit:** steady at **$0.28**
   - **Incremental visits:** about **2,100** more this week

**Who drove it**
   - **Yelp:** +31% lift (44% of the gain)
   - **Pandora:** +22% lift (32% of the gain)
   - **Audiences aged 45 to 54:** now 22% of Atlanta impressions and over-indexing on lift

**Recommendation**
1. Raise Atlanta budget by about 15%. Frequency is 3.8, so it has room before it saturates at 5.
2. Run the lunch creative in Dallas and Houston next. They have similar audiences.`,
  },
  "Why did Pandora overtake AdTheorent in the partner lift ranking?": {
    title: "Partner ranking: Pandora moves to #1",
    content: `**Short answer:** Pandora's lift kept climbing after its new audio spot launched, while AdTheorent's lift softened as its frequency rose.

**This week's lift ranking**
   1. **Pandora:** 5.31% (was #2)
   2. **AdTheorent:** 5.24% (was #1)
   3. **Yelp:** 5.14%
   4. **Spotify:** 4.12% (up from #6)

**What changed**
   - **Pandora:** lift up 10% since the 30-second spot launched on Mar 24
   - **AdTheorent:** frequency reached 4.1 per user, and lift usually softens above 4

**Recommendation**
1. Shift 5 to 10% of budget toward Pandora while its lift is rising.
2. Cap AdTheorent frequency at 4 to bring its lift back up.`,
  },
  "Why has cost per incremental visit risen three weeks in a row?": {
    title: "CPIV: three weeks of increases",
    content: `**Short answer:** too much frequency on two partners. Once people see an ad more than about 5 times, extra impressions stop adding visits, so each incremental visit costs more.

**What moved**
   - **CPIV:** $18.40 → **$21.14** over three weeks (+15%)
   - **Conversion rate:** steady at 2.94%
   - **Snap:** +24% CPIV (46% of the increase)
   - **iHeartRadio:** +16.5% (28%)

**Recommendation**
1. Cap Snap and iHeartRadio at 5 impressions per user.
2. Expect CPIV to return to about **$18.50** within two weeks, saving about $6.8K per week.`,
  },
};
