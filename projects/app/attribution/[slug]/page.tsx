"use client";

import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  MoreVertical,
  Share2,
  Download,
  ArrowUp,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowDownToLine,
  ExternalLink,
  Reply,
  OctagonAlert,
  Loader2,
  Lightbulb,
  Gauge,
  Eye,
  Users,
  MapPinned,
  CalendarClock,
  Settings,
  Grid3X3,
  CircleAlert,
  ChevronsRight,
  FileText,
  UserCircle,
  PanelRightClose,
  PanelRightOpen,
  Bookmark,
  FileChartLine,
  ChartColumn,
  Table2,
  ArrowDownUp,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip as KpiTooltip,
  TooltipContent as KpiTooltipContent,
  TooltipProvider,
  TooltipTrigger as KpiTooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from "recharts";

const sidebarItems = [
  { icon: Gauge, label: "Campaign Overview" },
  { icon: Eye, label: "User Cohort" },
  { icon: Users, label: "Demographic" },
  { icon: MapPinned, label: "Geography" },
  { icon: CalendarClock, label: "Date and Time" },
  { icon: Settings, label: "Settings" },
];

const metrics = [
  { label: "Impressions", value: "98,240,312" },
  { label: "Reach", value: "22,580,000" },
  { label: "Frequency", value: "4.35" },
  { label: "Spend", value: "$380,000.00" },
  { label: "Store Visits", value: "412,836" },
  { label: "Conversion rate", value: "2.94%" },
  { label: "Cost per Store Visits", value: "$0.92" },
];

const KPI_TOOLTIPS: Record<string, string> = {
  Impressions:
    "Total ad impressions delivered during the campaign flight across all partners, tactics, and measured geographies.",
  Reach: "Estimated count of unique users who received at least one impression from this campaign during the flight.",
  Frequency: "Average number of impressions per reached user. Higher values can signal saturation for some cohorts.",
  Spend: "Total media spend attributed to this campaign in the reporting window, before fees unless otherwise noted.",
  "Store Visits":
    "Attributed physical visits to measured store locations tied to exposed users, using the attribution model configured for this study.",
  "Conversion rate":
    "Share of exposed users who completed a store visit after impression delivery, based on the campaign attribution window.",
  "Cost per Store Visits":
    "Spend divided by attributed store visits (CPSV). Use this to compare efficiency across partners, geographies, and time periods.",
};

function KpiMetricCard({
  label,
  value,
  animationDelayMs,
}: {
  label: string;
  value: string;
  animationDelayMs?: number;
}) {
  const description = KPI_TOOLTIPS[label] ?? `${label} for the selected reporting period.`;
  return (
    <div
      data-kpi-metric-card
      className={cn(
        "hover-lift animate-kpi-entrance rounded-lg border border-border bg-white p-3 text-left shadow-sm outline-none",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}
      style={animationDelayMs != null ? { animationDelay: `${animationDelayMs}ms` } : undefined}
    >
      <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
        <span>{label}</span>
        <KpiTooltip>
          <KpiTooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label={`${label}: more info`}
            >
              <Info className="size-3 shrink-0" aria-hidden />
            </button>
          </KpiTooltipTrigger>
          <KpiTooltipContent side="top" className="max-w-[260px]">
            <p className="text-xs font-semibold leading-snug text-foreground">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </KpiTooltipContent>
        </KpiTooltip>
      </div>
      <p className="mt-1 text-base font-semibold tabular-nums text-[#171417]">{value}</p>
    </div>
  );
}

const suggestedPrompts = [
  "What is the overall campaign performance insights?",
  "Which specific pockets\u2014including partners, tactics, audiences, or geographies\u2014are showing positive lift with \u226560% confidence but are currently underweighted in our delivery?",
  "Why did incrementality drop from [Q2] to [Q3]? Specifically, was the decline driven by a shift in delivery away from high-performing partners and tactics, or by an increase in control group conversion rates making lift harder to achieve?",
  "Beyond the main campaign view, what granular shifts occurred across DMAs, age groups, timing (Day/Hour), and audience segments that explain our performance delta?",
  "Show me the geography analysis.",
  "Show me the demographics analysis.",
  "Show me the date and time analysis.",
  "Show me key optimization opportunities.",
  "Show me campaign performance by cohort.",
  "Show me partner performance comparison.",
  "Show me all partners performance metrics table.",
  "Key Insight & Recommendations.",
];

const partners = [
  "AdTheorent",
  "Nexxen",
  "Settings",
  "Teads",
  "Pandora",
  "Zeta",
  "Epsilon",
  "Snap",
];

const partnerTabs = ["Overview", "User Cohort", "Demographics", "Geography", "Date and Time"];

const partnerMetrics: Record<string, { label: string; value: string }[]> = {
  AdTheorent: [
    { label: "Impressions", value: "23,408,453" },
    { label: "Reach", value: "1,335,380" },
    { label: "Frequency", value: "3.26" },
    { label: "Spend", value: "$300,178.40" },
    { label: "Store Visits", value: "578,464" },
    { label: "Conversion rate", value: "3.08%" },
    { label: "Cost per Store Visits", value: "3.01%" },
  ],
  default: [
    { label: "Impressions", value: "18,204,322" },
    { label: "Reach", value: "1,102,440" },
    { label: "Frequency", value: "3.84" },
    { label: "Spend", value: "$245,620.10" },
    { label: "Store Visits", value: "412,338" },
    { label: "Conversion rate", value: "2.94%" },
    { label: "Cost per Store Visits", value: "2.87%" },
  ],
};

const partnerSummaries: Record<string, string> = {
  AdTheorent: `**Overall Performance**: Best-in-class \u2013 93% lift presence with High Frequenters

By Customer Cohort:
   - High Frequenters: 93% lift presence | +15.0% avg lift | 488M imps
   - Medium Frequenters: 0% lift presence | -35% avg lift
   - Low Frequenters: 0% lift presence | -39% avg lift
   - Non-Customers: 0% lift presence | -44% avg lift

**CVR-Lift Pattern:** POSITIVE correlation
   - High CVR campaigns (>14.3%): 80% had lift
   - Low CVR campaigns (\u226414.3%): 67% had lift
   - **Insight**: High CVR signals genuine engagement, not oversaturation

Ad Frequency Sweet Spot:
   - Campaigns with lift: 4.2 avg frequency
   - Campaigns without lift: 13.4 avg frequency
   - Optimal range: 4-6 exposures`,
  default: `**Overall Performance**: Moderate \u2013 lift varies by cohort and frequency

By Customer Cohort:
   - High Frequenters: 64% lift presence | +8.2% avg lift
   - Medium Frequenters: 12% lift presence | -18% avg lift
   - Low Frequenters: 3% lift presence | -28% avg lift
   - Non-Customers: 1% lift presence | -36% avg lift

**CVR-Lift Pattern:** Mixed correlation
   - High CVR campaigns: 52% had lift
   - Low CVR campaigns: 41% had lift
   - **Insight**: Performance depends heavily on audience targeting

Ad Frequency Sweet Spot:
   - Campaigns with lift: 3.8 avg frequency
   - Campaigns without lift: 11.2 avg frequency
   - Optimal range: 3-5 exposures`,
};

const partnerPrompts = [
  "Show me the geography analysis.",
  "Show me the demographics analysis.",
  "Show me the date and time analysis.",
  "Show me key optimization opportunities.",
  "Show me campaign performance by cohort.",
  "Key Insight & Recommendations.",
];

const initialSummary = `**QSR Brand Q2 2026 Media Reality**: Your media is fundamentally about driving visit frequency among existing high-frequenting customers (72.3% of all lift), NOT acquiring new or lapsed customers (2-5% lift presence). Partners and ad frequency must be optimized accordingly.

**Critical Insights**
1. Customer Cohort Dominance
   - High Frequenter customers: 72.3% of campaigns show lift
   - Medium/Low/Non-customers: 2-5% of campaigns show lift
   - Implication: Media drives repeat visits among loyalists. This is where ROI lives \u2013 but expectations must align.
2. Ad Frequency Ceiling Effect (Among High Frequenters)
   - Sweet spot: 3-5 ad exposures (84% lift presence)
   - Ceiling: 6+ exposures (drops to 58% lift presence)
   - Implication: Overexposure kills incrementality even with best customers
3. The CVR Paradox
   - Some partners: High CVR = LESS lift (Epsilon, Programmatic)
   - Other partners: High CVR = MORE lift (Nexxen, Viant)
   - Explanation: CVR measures different things \u2013 either "sure things" (existing propensity) or "persuadables" (genuine behavior change)
4. Partner Performance Spectrum
   - \u2B50 Scale: Nexxen (89% lift with High Frequenters), Viant (85%)
   - \u2192 Maintain: Adtheorent (61%)
   - \u26A0 Reduce: Epsilon (34%), Starcom Programmatic (26%)`;

const promptResponses: Record<string, { title: string; content: string }> = {
  "What is the overall campaign performance insights?": {
    title: "Campaign Performance Summary",
    content: `Based on the current page context, here's a breakdown of the GasBuddy campaign:

**Key Metrics**
   - **Total Spend:** $12,073
   - **Impressions:** 704,546
   - **Reach:** 240,185
   - **Frequency:** 2.93%
   - **Conversion Rate (CVR):** 4.46%
   - **Total Visits:** 31,388
   - **Cost per Store Visit (CPSV):** $0.38
   - **Brand Visit Rate (BVR) Lift:** 3.07%
   - **Lift Visits:** 934
   - **Cost per Lift Visit (CPLV):** $12.93

**Key Takeaway**
1. Focus targeting on the High and Medium cohorts
2. Prioritize campaigns during mid-week (Wednesday/Thursday)
3. Target the 18-24 and 25-34 age groups for best performance`,
  },
  "Which specific pockets\u2014including partners, tactics, audiences, or geographies\u2014are showing positive lift with \u226560% confidence but are currently underweighted in our delivery?": {
    title: "Underweighted High-Confidence Pockets",
    content: `Based on the attribution data, the following pockets show strong lift (\u226560% confidence) but are receiving disproportionately low delivery:

**Partner-Level Opportunities**
   - **Pandora:** 93% lift presence among High Frequenters, but only 8% of total spend allocated
   - **Twitter/X:** 88% lift presence, receiving just 5% of budget
   - **TikTok:** 54% lift with 18-34 demo, under-indexed at 3% spend share

**Geographic Pockets**
   - **DMA: Chicago** \u2013 72% lift confidence, 4.2% delivery share (vs 8.1% population share)
   - **DMA: Houston** \u2013 68% lift confidence, 2.9% delivery share (vs 5.3% population share)
   - **DMA: Phoenix** \u2013 61% lift confidence, 1.8% delivery share

**Audience Segments**
   - **High Frequenters, 25-34:** 81% lift, only 12% of impressions
   - **Medium Frequenters, 18-24:** 65% lift, only 6% of impressions

**Recommendation**
1. Reallocate 15-20% of Epsilon/Programmatic budget toward Pandora and Twitter
2. Increase geo-targeting weight for Chicago and Houston DMAs
3. Create dedicated audience segments for the underweighted cohorts above`,
  },
  "Why did incrementality drop from [Q2] to [Q3]? Specifically, was the decline driven by a shift in delivery away from high-performing partners and tactics, or by an increase in control group conversion rates making lift harder to achieve?": {
    title: "Q2 to Q3 Incrementality Analysis",
    content: `The incrementality decline from Q2 to Q3 is driven by **both factors**, but the primary driver is control group behavior:

**Control Group Shift (Primary \u2013 ~62% of decline)**
   - Q2 control group CVR: 2.14%
   - Q3 control group CVR: 3.87% (+81% increase)
   - Seasonal fast-food traffic naturally rose in Q3 (back-to-school, football season)
   - This compressed the measurable lift delta

**Delivery Mix Shift (Secondary \u2013 ~38% of decline)**
   - High-lift partners (Pandora, Twitter) share dropped from 18% \u2192 11% of spend
   - Low-lift Programmatic share increased from 22% \u2192 34%
   - Frequency among High Frequenters rose from 4.1 \u2192 6.8 (past the sweet spot)

**Net Impact**
   - Q2 incremental lift rate: 3.82%
   - Q3 incremental lift rate: 2.41% (-37%)
   - Estimated recoverable lift if mix corrected: ~3.1%

**Recommendation**
1. Adjust Q4 benchmarks to account for seasonal baseline shifts
2. Restore partner mix to Q2 allocation ratios
3. Cap frequency at 6 exposures per user`,
  },
  "Beyond the main campaign view, what granular shifts occurred across DMAs, age groups, timing (Day/Hour), and audience segments that explain our performance delta?": {
    title: "Granular Performance Delta Analysis",
    content: `Here is a multi-dimensional breakdown of the performance shifts:

**DMA-Level Shifts**
   - **Top gainers:** Atlanta (+42% lift), Dallas (+28% lift), Miami (+19% lift)
   - **Top decliners:** New York (-31% lift), LA (-24% lift), San Francisco (-18% lift)
   - Urban-dense DMAs saw control group spikes; suburban DMAs held steady

**Age Group Performance**
   - **18-24:** Lift increased Q2\u2192Q3 by +15% (strongest cohort)
   - **25-34:** Stable, -2% change
   - **35-44:** Declined -22%, likely due to frequency saturation
   - **45+:** Declined -34%, lowest response to digital partners

**Day/Hour Timing Patterns**
   - **Best days:** Wednesday (4.8% lift), Thursday (4.2% lift)
   - **Worst days:** Saturday (1.1% lift), Sunday (0.8% lift)
   - **Peak hours:** 11am-1pm (lunch) and 5pm-7pm (dinner)
   - Weekend delivery was over-indexed at 35% of spend vs 15% of lift contribution

**Audience Segment Shifts**
   - High Frequenters: Stable lift but frequency ceiling hit
   - Medium Frequenters: Emerging opportunity, +18% lift Q2\u2192Q3
   - Non-customers: Minimal lift (<1%), not cost-effective

**Recommendation**
1. Shift 20% of weekend budget to mid-week dayparts
2. Reduce 45+ targeting, increase 18-24 allocation
3. Pilot Medium Frequenter-specific creative`,
  },
  "Show me the geography analysis.": {
    title: "Geography Analysis",
    content: `**Top Performing DMAs by Lift Rate**
   - **Atlanta:** 5.2% lift rate | 892K impressions | $0.28 CPSV
   - **Dallas-Fort Worth:** 4.8% lift rate | 1.1M impressions | $0.31 CPSV
   - **Chicago:** 4.5% lift rate | 2.3M impressions | $0.34 CPSV
   - **Houston:** 4.1% lift rate | 780K impressions | $0.29 CPSV
   - **Miami:** 3.9% lift rate | 650K impressions | $0.36 CPSV

**Underperforming DMAs**
   - **New York:** 1.2% lift rate | 8.4M impressions | $0.72 CPSV
   - **Los Angeles:** 1.5% lift rate | 6.1M impressions | $0.68 CPSV
   - **San Francisco:** 0.9% lift rate | 1.8M impressions | $0.84 CPSV

**Key Insight**
   - Mid-size metros outperform mega-metros by 3x on CPSV
   - Top 5 DMAs represent only 22% of spend but drive 41% of lift visits
   - NY and LA consume 38% of budget but generate only 14% of incremental visits

**Recommendation**
1. Cap NY/LA spend at 25% of total and redistribute to top 5 DMAs
2. Test expansion into secondary markets (Nashville, Charlotte, Austin)`,
  },
  "Show me the demographics analysis.": {
    title: "Demographics Analysis",
    content: `**Performance by Age Group**
   - **18-24:** 5.1% lift rate | 22% of impressions | Best CPLV at $8.40
   - **25-34:** 4.3% lift rate | 31% of impressions | CPLV $10.20
   - **35-44:** 2.8% lift rate | 26% of impressions | CPLV $16.50
   - **45-54:** 1.4% lift rate | 14% of impressions | CPLV $28.70
   - **55+:** 0.6% lift rate | 7% of impressions | CPLV $52.30

**Performance by Gender**
   - **Female:** 3.8% lift rate, 58% of conversions
   - **Male:** 2.9% lift rate, 42% of conversions

**Household Income Segments**
   - **<$50K:** 4.2% lift \u2013 highest response rate
   - **$50K-$100K:** 3.5% lift
   - **$100K+:** 1.8% lift \u2013 lowest response rate

**Key Insight**
   - Under-35 cohorts deliver 3.5x better CPLV than 45+
   - 55+ segment consumes 7% of budget but contributes <1% of lift
   - Female audiences convert 31% more efficiently

**Recommendation**
1. Shift 45+ budget allocation to 18-34 cohorts
2. Create female-skewed creative variants for top partners
3. Test income-based bidding adjustments in programmatic`,
  },
  "Show me the date and time analysis.": {
    title: "Date and Time Analysis",
    content: `**Day of Week Performance**
   - **Monday:** 3.4% lift | 14% of spend
   - **Tuesday:** 3.8% lift | 13% of spend
   - **Wednesday:** 4.8% lift | 12% of spend \u2b50 Best day
   - **Thursday:** 4.2% lift | 13% of spend
   - **Friday:** 2.9% lift | 16% of spend
   - **Saturday:** 1.1% lift | 18% of spend
   - **Sunday:** 0.8% lift | 14% of spend

**Hour of Day Performance (Top Windows)**
   - **11am-1pm:** 5.2% lift rate (lunch daypart)
   - **5pm-7pm:** 4.6% lift rate (dinner daypart)
   - **7am-9am:** 3.1% lift rate (breakfast)
   - **9pm-12am:** 1.2% lift rate (late night)

**Seasonal Trends**
   - Q2 avg lift: 3.82% \u2192 Q3 avg lift: 2.41%
   - Back-to-school period (Aug 15-Sep 15) saw highest control group activity
   - Best performing flight: June 1-30 (4.1% lift)

**Key Insight**
   - Weekend spend (32% of budget) drives only 12% of lift
   - Lunch + dinner dayparts deliver 68% of all incremental visits
   - Mid-week concentration could improve overall CPSV by ~40%

**Recommendation**
1. Reduce weekend delivery to 15% of budget
2. Concentrate 60%+ of impressions in lunch/dinner dayparts
3. Implement day-parting rules across all programmatic partners`,
  },
  "Show me key optimization opportunities.": {
    title: "Key Optimization Opportunities",
    content: `Based on the full campaign analysis, here are the top optimization levers ranked by estimated impact:

**1. Partner Reallocation (Est. +28% lift improvement)**
   - Scale Pandora from 8% \u2192 18% of spend
   - Scale Twitter from 5% \u2192 12% of spend
   - Reduce Epsilon from 15% \u2192 6% of spend
   - Reduce Starcom Programmatic from 20% \u2192 10%

**2. Frequency Capping (Est. +15% efficiency gain)**
   - Implement hard cap at 6 exposures per user per flight
   - Current avg frequency: 6.8 (above optimal 3-6 range)
   - Expected savings: ~$180K in wasted impressions

**3. Daypart Optimization (Est. +22% CPSV improvement)**
   - Shift to lunch (11am-1pm) and dinner (5pm-7pm) concentration
   - Reduce late-night and weekend delivery
   - Estimated CPSV reduction from $0.38 \u2192 $0.29

**4. Geo Rebalancing (Est. +18% lift improvement)**
   - Reduce NY/LA from 38% \u2192 25% of spend
   - Increase Atlanta, Dallas, Chicago, Houston allocation
   - Test Nashville, Charlotte, Austin as expansion markets

**5. Audience Mix Refinement (Est. +12% efficiency)**
   - Increase 18-34 from 53% \u2192 70% of targeting
   - Reduce 45+ from 21% \u2192 8%
   - Pilot Medium Frequenter campaigns

**Total Estimated Impact**
   - Current CPSV: $0.38 \u2192 Projected CPSV: $0.24
   - Current incremental lift: 2.41% \u2192 Projected: 3.6%
   - Estimated additional lift visits: +1,840 per flight`,
  },
  "Show me campaign performance by cohort.": {
    title: "Campaign Performance by Cohort",
    content: `**Customer Cohort Breakdown**

**High Frequenters (Visit 4+ times/month)**
   - Lift Presence: 78.5% of campaigns
   - Avg Lift Rate: 4.2%
   - Impressions Share: 45%
   - CPLV: $8.90
   - Best Partner: Pandora (93% lift)

**Medium Frequenters (Visit 1-3 times/month)**
   - Lift Presence: 34% of campaigns
   - Avg Lift Rate: 2.1%
   - Impressions Share: 28%
   - CPLV: $14.50
   - Best Partner: TikTok (48% lift)

**Low Frequenters (Visit <1 time/month)**
   - Lift Presence: 3% of campaigns
   - Avg Lift Rate: 0.4%
   - Impressions Share: 18%
   - CPLV: $68.20
   - Best Partner: None significant

**Non-Customers**
   - Lift Presence: 1% of campaigns
   - Avg Lift Rate: 0.1%
   - Impressions Share: 9%
   - CPLV: $142.00
   - Not cost-effective for current objectives

**Key Insight**
   - High Frequenters are 16x more cost-efficient than Low Frequenters
   - Medium Frequenters represent the best growth opportunity
   - 27% of budget is spent on Low/Non cohorts generating <4% of lift

**Recommendation**
1. Reallocate Low/Non-customer budget to High and Medium cohorts
2. Develop Medium Frequenter-specific creative and offers
3. Use High Frequenter campaigns as the benchmark for partner evaluation`,
  },
  "Show me partner performance comparison.": {
    title: "Partner Performance Analysis",
    content: `**Partner Ranking by Lift Effectiveness**

**Tier 1 \u2013 Scale (High lift, high confidence)**
   - **Pandora:** 93% lift presence | CPLV $6.20 | 8% spend share
   - **Twitter/X:** 88% lift presence | CPLV $7.80 | 5% spend share
   - Recommendation: Increase to 15-20% each

**Tier 2 \u2013 Maintain (Moderate lift, stable)**
   - **Snap:** 64% lift presence | CPLV $11.40 | 10% spend share
   - **TikTok:** 54% lift presence | CPLV $13.20 | 7% spend share
   - Recommendation: Hold current allocation, test creative optimization

**Tier 3 \u2013 Reduce (Low lift or negative ROI)**
   - **Epsilon:** 38% lift presence | CPLV $24.60 | 15% spend share
   - **Starcom Programmatic:** 29% lift presence | CPLV $31.80 | 20% spend share
   - **Display Network:** 22% lift presence | CPLV $38.40 | 12% spend share
   - Recommendation: Reduce to maintenance levels (5-8% each)

**The CVR Paradox Explained**
   - Epsilon shows high CVR (6.2%) but LOW lift \u2013 reaching people who would visit anyway
   - Pandora shows moderate CVR (3.1%) but HIGHEST lift \u2013 genuinely changing behavior
   - Implication: CVR alone is misleading; always pair with incrementality metrics

**Budget Reallocation Model**
   - Current weighted CPLV: $18.40
   - Optimized weighted CPLV: $10.20
   - Projected savings per flight: ~$245K at same visit volume`,
  },
  "Key Insight & Recommendations.": {
    title: "Key Insights & Recommendations",
    content: `**Executive Summary**

Your QSR Brand Q2 2026 Campaign reached 22.6M users with 98.2M impressions, generating 413K store visits at a 2.94% conversion rate. Incrementality analysis reveals significant optimization opportunities.

**Top 5 Insights**
1. **Your media drives loyalty, not acquisition** \u2013 72.3% of lift comes from High Frequenters. Reframe success metrics around visit frequency, not new customer acquisition.
2. **Partner mix is suboptimal** \u2013 Top-performing partners (Nexxen, Viant) receive only 15% of budget while underperformers (Epsilon, Programmatic) receive 32%.
3. **Frequency ceiling is real** \u2013 Beyond 5 exposures, lift drops 26%. Current avg frequency of 4.35 is near optimal.
4. **Timing matters more than you think** \u2013 Mid-week lunch/dinner dayparts deliver 65% of lift but receive only 38% of impressions.
5. **Geography is mispriced** \u2013 Mega-metros (NY, LA) cost 3x more per lift visit than mid-size markets.

**Recommended Actions (Priority Order)**
1. Reallocate partner budget: Scale Nexxen/Viant to 35% combined, reduce Epsilon/Programmatic to 12% combined
2. Maintain frequency cap near 5 per user per flight across all partners
3. Shift 20% of weekend budget to Wednesday/Thursday lunch and dinner dayparts
4. Reduce NY/LA allocation from 35% to 22%, redistribute to top 5 mid-size DMAs
5. Launch Medium Frequenter pilot program with Adtheorent

**Projected Impact**
   - CPSV improvement: $0.38 \u2192 $0.24 (-37%)
   - Incremental lift improvement: 2.41% \u2192 3.6% (+49%)
   - Additional lift visits per flight: +1,840
   - Annual budget savings at current volume: ~$980K`,
  },
  "Show me all partners performance metrics table.": {
    title: "All Partners Performance Metrics",
    content: `**Campaign Performance Metrics by Partner**

| Rank | Partner | Spend | Store Visits | CPSV | Lift Rate |
|------|---------|-------|--------------|------|-----------|
| 1 | The Trade Desk | $105,000 | 98,450 | $1.07 | **5.1%** |
| 2 | Viant | $84,000 | 89,240 | $0.94 | **4.8%** |
| 3 | DV360 | $98,000 | 92,180 | $1.06 | **4.6%** |
| 4 | Adtheorent | $70,000 | 72,836 | $0.96 | **3.2%** |
| 5 | Amazon DSP | $63,000 | 68,920 | **$0.91** | **2.9%** |
| **—** | **TOTAL** | **$420,000** | **421,626** | **$0.996** | **4.12%** |

**Performance Insights:**

🏆 **Top Performer:** The Trade Desk leads with 5.1% lift rate  
💰 **Best Efficiency:** Amazon DSP delivers lowest CPSV at $0.91  
📈 **Balanced Excellence:** Viant combines strong lift (4.8%) with competitive efficiency  
⚠️ **Optimization Target:** Adtheorent shows potential for lift rate improvement  

**Key Recommendations:**
✅ **Scale Up:** Increase The Trade Desk allocation (+10-15%)  
✅ **Maintain:** Hold Viant and DV360 at current performance levels  
💡 **Optimize:** Test Amazon DSP creative refresh to boost incrementality  
🎯 **Monitor:** Review Adtheorent frequency caps and targeting precision`,
  },
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  title?: string;
};

function useTypewriter(text: string, speed: number = 8) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsComplete(false);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx <= text.length) {
        setDisplayed(text.slice(0, idx));
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, isComplete };
}

function SummarizingDots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d % 5) + 1), 400);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-sm text-muted-foreground">Summarizing{".".repeat(dots)}</span>;
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === "") { elements.push(<div key={key++} className="h-3" />); continue; }

    const fmt = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\u2B50/g, '&#11088;')
      .replace(/\u2192/g, '&#8594;')
      .replace(/\u26A0/g, '&#9888;');

    if (line.startsWith("   - ")) {
      elements.push(
        <div key={key++} className="ml-8 flex gap-2 text-sm leading-6 text-[#171417]">
          <span className="shrink-0 text-muted-foreground">&bull;</span>
          <span dangerouslySetInnerHTML={{ __html: fmt.replace("   - ", "") }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/);
      if (m) elements.push(
        <div key={key++} className="mt-1 text-sm font-semibold leading-6 text-[#171417]">
          <span dangerouslySetInnerHTML={{ __html: `${m[1]}. ${m[2].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}` }} />
        </div>
      );
    } else {
      elements.push(
        <div key={key++} className="text-sm leading-6 text-[#171417]">
          <span dangerouslySetInnerHTML={{ __html: fmt }} />
        </div>
      );
    }
  }
  return <>{elements}</>;
}

function TypewriterMessage({ content, title, onComplete }: { content: string; title?: string; onComplete?: () => void }) {
  const { displayed, isComplete } = useTypewriter(content, 6);
  const calledRef = useRef(false);

  useEffect(() => {
    if (isComplete && onComplete && !calledRef.current) {
      calledRef.current = true;
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold text-[#171417]">{title}</h3>}
      <div>
        <MarkdownRenderer text={displayed} />
        {!isComplete && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#212be9]" />}
      </div>
    </div>
  );
}

type ReportFile = {
  name: string;
  format: "pdf" | "xlsx";
  status: "generating" | "ready" | "error";
  progress?: number;
  downloadedAt?: string;
};

const userCohortData: Record<"Flight" | "Weekly" | "Monthly", { category: string; impressionIndex: number; bvrLiftIndex: number }[]> = {
  Flight: [
    { category: "Not a customer", impressionIndex: 112, bvrLiftIndex: 78 },
    { category: "High", impressionIndex: 35, bvrLiftIndex: 72 },
    { category: "Medium", impressionIndex: 88, bvrLiftIndex: 113 },
    { category: "Low", impressionIndex: 108, bvrLiftIndex: 142 },
    { category: "Other", impressionIndex: 30, bvrLiftIndex: 38 },
  ],
  Weekly: [
    { category: "Not a customer", impressionIndex: 98, bvrLiftIndex: 65 },
    { category: "High", impressionIndex: 52, bvrLiftIndex: 84 },
    { category: "Medium", impressionIndex: 74, bvrLiftIndex: 96 },
    { category: "Low", impressionIndex: 120, bvrLiftIndex: 130 },
    { category: "Other", impressionIndex: 42, bvrLiftIndex: 48 },
  ],
  Monthly: [
    { category: "Not a customer", impressionIndex: 105, bvrLiftIndex: 82 },
    { category: "High", impressionIndex: 44, bvrLiftIndex: 68 },
    { category: "Medium", impressionIndex: 92, bvrLiftIndex: 108 },
    { category: "Low", impressionIndex: 115, bvrLiftIndex: 136 },
    { category: "Other", impressionIndex: 36, bvrLiftIndex: 44 },
  ],
};

const dayOfWeekData: Record<"Day of week" | "Hour of day", { category: string; keyOne: number; keyTwo: number }[]> = {
  "Day of week": [
    { category: "Monday", keyOne: 34, keyTwo: 75 },
    { category: "Tuesday", keyOne: 72, keyTwo: 112 },
    { category: "Wednesday", keyOne: 110, keyTwo: 112 },
    { category: "Thursday", keyOne: 148, keyTwo: 108 },
    { category: "Friday", keyOne: 34, keyTwo: 38 },
  ],
  "Hour of day": [
    { category: "6am–9am", keyOne: 42, keyTwo: 58 },
    { category: "9am–12pm", keyOne: 88, keyTwo: 102 },
    { category: "12pm–3pm", keyOne: 120, keyTwo: 95 },
    { category: "3pm–6pm", keyOne: 105, keyTwo: 130 },
    { category: "6pm–9pm", keyOne: 72, keyTwo: 85 },
    { category: "9pm–12am", keyOne: 38, keyTwo: 42 },
  ],
};

function DateTimeChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-[#171417]">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold tabular-nums text-[#171417]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function CohortChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-[#171417]">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold tabular-nums text-[#171417]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

const demoAgeData: Record<"Flight" | "Weekly" | "Monthly", { category: string; impressionIndex: number; bvrLiftIndex: number }[]> = {
  Flight: [
    { category: "18 - 24", impressionIndex: 112, bvrLiftIndex: 78 },
    { category: "25 - 34", impressionIndex: 35, bvrLiftIndex: 75 },
    { category: "35 - 44", impressionIndex: 82, bvrLiftIndex: 110 },
    { category: "45 - 54", impressionIndex: 108, bvrLiftIndex: 148 },
    { category: "> 54", impressionIndex: 34, bvrLiftIndex: 38 },
  ],
  Weekly: [
    { category: "18 - 24", impressionIndex: 104, bvrLiftIndex: 70 },
    { category: "25 - 34", impressionIndex: 42, bvrLiftIndex: 68 },
    { category: "35 - 44", impressionIndex: 76, bvrLiftIndex: 98 },
    { category: "45 - 54", impressionIndex: 118, bvrLiftIndex: 138 },
    { category: "> 54", impressionIndex: 40, bvrLiftIndex: 44 },
  ],
  Monthly: [
    { category: "18 - 24", impressionIndex: 108, bvrLiftIndex: 74 },
    { category: "25 - 34", impressionIndex: 38, bvrLiftIndex: 72 },
    { category: "35 - 44", impressionIndex: 80, bvrLiftIndex: 104 },
    { category: "45 - 54", impressionIndex: 112, bvrLiftIndex: 144 },
    { category: "> 54", impressionIndex: 36, bvrLiftIndex: 42 },
  ],
};

const demoGenderData = [
  { category: "Male", keyOne: 108, keyTwo: 76 },
  { category: "Female", keyOne: 34, keyTwo: 72 },
];

const demoAgeTableData = [
  { age: "18 - 24", impressionIndex: 193, bvrLiftIndex: 6.22, cvr: 9.33 },
  { age: "25 - 34", impressionIndex: 176, bvrLiftIndex: 6.22, cvr: 9.33 },
  { age: "35 - 44", impressionIndex: 115, bvrLiftIndex: 6.22, cvr: 9.33 },
  { age: "45 - 54", impressionIndex: 58, bvrLiftIndex: 6.22, cvr: 9.33 },
  { age: "> 54", impressionIndex: 57, bvrLiftIndex: 6.22, cvr: 9.33 },
];

const demoGenderTableData = [
  { gender: "Male", impressionIndex: 193, bvrLiftIndex: 6.22, cvr: 9.33 },
  { gender: "Female", impressionIndex: 176, bvrLiftIndex: 6.22, cvr: 9.33 },
];

const cohortTableData = [
  { cohort: "Not a customer", impressionIndex: 212, bvrLiftIndex: 4.18, cvr: 7.62 },
  { cohort: "High", impressionIndex: 156, bvrLiftIndex: 8.44, cvr: 12.10 },
  { cohort: "Medium", impressionIndex: 188, bvrLiftIndex: 6.92, cvr: 9.85 },
  { cohort: "Low", impressionIndex: 142, bvrLiftIndex: 5.31, cvr: 8.47 },
  { cohort: "Other", impressionIndex: 68, bvrLiftIndex: 3.55, cvr: 6.21 },
];

const geoStateData: Record<"Flight" | "Weekly" | "Monthly", { state: string; abbr: string; index: number }[]> = {
  Flight: [
    { state: "Alabama", abbr: "AL", index: 145 }, { state: "Alaska", abbr: "AK", index: 80 }, { state: "Arizona", abbr: "AZ", index: 110 },
    { state: "Arkansas", abbr: "AR", index: 95 }, { state: "California", abbr: "CA", index: 165 }, { state: "Colorado", abbr: "CO", index: 130 },
    { state: "Connecticut", abbr: "CT", index: 175 }, { state: "Delaware", abbr: "DE", index: 120 }, { state: "Florida", abbr: "FL", index: 155 },
    { state: "Georgia", abbr: "GA", index: 140 }, { state: "Hawaii", abbr: "HI", index: 70 }, { state: "Idaho", abbr: "ID", index: 88 },
    { state: "Illinois", abbr: "IL", index: 185 }, { state: "Indiana", abbr: "IN", index: 125 }, { state: "Iowa", abbr: "IA", index: 105 },
    { state: "Kansas", abbr: "KS", index: 195 }, { state: "Kentucky", abbr: "KY", index: 115 }, { state: "Louisiana", abbr: "LA", index: 100 },
    { state: "Maine", abbr: "ME", index: 90 }, { state: "Maryland", abbr: "MD", index: 160 }, { state: "Massachusetts", abbr: "MA", index: 180 },
    { state: "Michigan", abbr: "MI", index: 150 }, { state: "Minnesota", abbr: "MN", index: 170 }, { state: "Mississippi", abbr: "MS", index: 135 },
    { state: "Missouri", abbr: "MO", index: 120 }, { state: "Montana", abbr: "MT", index: 85 }, { state: "Nebraska", abbr: "NE", index: 200 },
    { state: "Nevada", abbr: "NV", index: 95 }, { state: "New Hampshire", abbr: "NH", index: 110 }, { state: "New Jersey", abbr: "NJ", index: 165 },
    { state: "New Mexico", abbr: "NM", index: 75 }, { state: "New York", abbr: "NY", index: 190 }, { state: "North Carolina", abbr: "NC", index: 145 },
    { state: "North Dakota", abbr: "ND", index: 210 }, { state: "Ohio", abbr: "OH", index: 140 }, { state: "Oklahoma", abbr: "OK", index: 155 },
    { state: "Oregon", abbr: "OR", index: 100 }, { state: "Pennsylvania", abbr: "PA", index: 150 }, { state: "Rhode Island", abbr: "RI", index: 130 },
    { state: "South Carolina", abbr: "SC", index: 125 }, { state: "South Dakota", abbr: "SD", index: 205 }, { state: "Tennessee", abbr: "TN", index: 135 },
    { state: "Texas", abbr: "TX", index: 160 }, { state: "Utah", abbr: "UT", index: 90 }, { state: "Vermont", abbr: "VT", index: 105 },
    { state: "Virginia", abbr: "VA", index: 170 }, { state: "Washington", abbr: "WA", index: 115 }, { state: "West Virginia", abbr: "WV", index: 145 },
    { state: "Wisconsin", abbr: "WI", index: 180 }, { state: "Wyoming", abbr: "WY", index: 78 },
  ],
  Weekly: [
    { state: "Alabama", abbr: "AL", index: 138 }, { state: "Alaska", abbr: "AK", index: 72 }, { state: "Arizona", abbr: "AZ", index: 118 },
    { state: "Arkansas", abbr: "AR", index: 88 }, { state: "California", abbr: "CA", index: 172 }, { state: "Colorado", abbr: "CO", index: 122 },
    { state: "Connecticut", abbr: "CT", index: 168 }, { state: "Delaware", abbr: "DE", index: 128 }, { state: "Florida", abbr: "FL", index: 162 },
    { state: "Georgia", abbr: "GA", index: 148 }, { state: "Hawaii", abbr: "HI", index: 65 }, { state: "Idaho", abbr: "ID", index: 92 },
    { state: "Illinois", abbr: "IL", index: 178 }, { state: "Indiana", abbr: "IN", index: 132 }, { state: "Iowa", abbr: "IA", index: 112 },
    { state: "Kansas", abbr: "KS", index: 188 }, { state: "Kentucky", abbr: "KY", index: 108 }, { state: "Louisiana", abbr: "LA", index: 105 },
    { state: "Maine", abbr: "ME", index: 85 }, { state: "Maryland", abbr: "MD", index: 155 }, { state: "Massachusetts", abbr: "MA", index: 175 },
    { state: "Michigan", abbr: "MI", index: 142 }, { state: "Minnesota", abbr: "MN", index: 165 }, { state: "Mississippi", abbr: "MS", index: 128 },
    { state: "Missouri", abbr: "MO", index: 115 }, { state: "Montana", abbr: "MT", index: 82 }, { state: "Nebraska", abbr: "NE", index: 192 },
    { state: "Nevada", abbr: "NV", index: 102 }, { state: "New Hampshire", abbr: "NH", index: 115 }, { state: "New Jersey", abbr: "NJ", index: 158 },
    { state: "New Mexico", abbr: "NM", index: 82 }, { state: "New York", abbr: "NY", index: 185 }, { state: "North Carolina", abbr: "NC", index: 152 },
    { state: "North Dakota", abbr: "ND", index: 202 }, { state: "Ohio", abbr: "OH", index: 135 }, { state: "Oklahoma", abbr: "OK", index: 148 },
    { state: "Oregon", abbr: "OR", index: 108 }, { state: "Pennsylvania", abbr: "PA", index: 145 }, { state: "Rhode Island", abbr: "RI", index: 125 },
    { state: "South Carolina", abbr: "SC", index: 118 }, { state: "South Dakota", abbr: "SD", index: 198 }, { state: "Tennessee", abbr: "TN", index: 142 },
    { state: "Texas", abbr: "TX", index: 155 }, { state: "Utah", abbr: "UT", index: 85 }, { state: "Vermont", abbr: "VT", index: 98 },
    { state: "Virginia", abbr: "VA", index: 162 }, { state: "Washington", abbr: "WA", index: 108 }, { state: "West Virginia", abbr: "WV", index: 138 },
    { state: "Wisconsin", abbr: "WI", index: 172 }, { state: "Wyoming", abbr: "WY", index: 75 },
  ],
  Monthly: [
    { state: "Alabama", abbr: "AL", index: 142 }, { state: "Alaska", abbr: "AK", index: 76 }, { state: "Arizona", abbr: "AZ", index: 114 },
    { state: "Arkansas", abbr: "AR", index: 92 }, { state: "California", abbr: "CA", index: 168 }, { state: "Colorado", abbr: "CO", index: 126 },
    { state: "Connecticut", abbr: "CT", index: 172 }, { state: "Delaware", abbr: "DE", index: 124 }, { state: "Florida", abbr: "FL", index: 158 },
    { state: "Georgia", abbr: "GA", index: 144 }, { state: "Hawaii", abbr: "HI", index: 68 }, { state: "Idaho", abbr: "ID", index: 90 },
    { state: "Illinois", abbr: "IL", index: 182 }, { state: "Indiana", abbr: "IN", index: 128 }, { state: "Iowa", abbr: "IA", index: 108 },
    { state: "Kansas", abbr: "KS", index: 192 }, { state: "Kentucky", abbr: "KY", index: 112 }, { state: "Louisiana", abbr: "LA", index: 102 },
    { state: "Maine", abbr: "ME", index: 88 }, { state: "Maryland", abbr: "MD", index: 158 }, { state: "Massachusetts", abbr: "MA", index: 178 },
    { state: "Michigan", abbr: "MI", index: 146 }, { state: "Minnesota", abbr: "MN", index: 168 }, { state: "Mississippi", abbr: "MS", index: 132 },
    { state: "Missouri", abbr: "MO", index: 118 }, { state: "Montana", abbr: "MT", index: 84 }, { state: "Nebraska", abbr: "NE", index: 196 },
    { state: "Nevada", abbr: "NV", index: 98 }, { state: "New Hampshire", abbr: "NH", index: 112 }, { state: "New Jersey", abbr: "NJ", index: 162 },
    { state: "New Mexico", abbr: "NM", index: 78 }, { state: "New York", abbr: "NY", index: 188 }, { state: "North Carolina", abbr: "NC", index: 148 },
    { state: "North Dakota", abbr: "ND", index: 206 }, { state: "Ohio", abbr: "OH", index: 138 }, { state: "Oklahoma", abbr: "OK", index: 152 },
    { state: "Oregon", abbr: "OR", index: 104 }, { state: "Pennsylvania", abbr: "PA", index: 148 }, { state: "Rhode Island", abbr: "RI", index: 128 },
    { state: "South Carolina", abbr: "SC", index: 122 }, { state: "South Dakota", abbr: "SD", index: 202 }, { state: "Tennessee", abbr: "TN", index: 138 },
    { state: "Texas", abbr: "TX", index: 158 }, { state: "Utah", abbr: "UT", index: 88 }, { state: "Vermont", abbr: "VT", index: 102 },
    { state: "Virginia", abbr: "VA", index: 166 }, { state: "Washington", abbr: "WA", index: 112 }, { state: "West Virginia", abbr: "WV", index: 142 },
    { state: "Wisconsin", abbr: "WI", index: 176 }, { state: "Wyoming", abbr: "WY", index: 76 },
  ],
};

function getGeoColor(index: number) {
  const min = 60, max = 220;
  const t = Math.max(0, Math.min(1, (index - min) / (max - min)));
  const r = Math.round(220 - t * 190);
  const g = Math.round(225 - t * 175);
  const b = Math.round(255 - t * 50);
  return `rgb(${r},${g},${b})`;
}

function CampaignSystemError() {
  const router = useRouter();
  const pathname = usePathname();

  const handleRetry = () => {
    router.replace(pathname);
    router.refresh();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-lg border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">We couldn&apos;t load this campaign</CardTitle>
          <CardDescription>
            The attribution workspace is temporarily unavailable. Your data is safe; please try again shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert variant="destructive">
            <OctagonAlert />
            <AlertTitle>System error</AlertTitle>
            <AlertDescription>
              The analysis service did not respond. Check your network connection. If this keeps happening, contact
              your Foursquare representative with the time you saw this message.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" asChild>
              <Link href="/attribution">Back to campaigns</Link>
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleRetry}
              className="gap-2 bg-[#212be9] text-white hover:bg-[#1a22c4] hover:shadow-lg hover:shadow-[#212be9]/20"
            >
              <RefreshCw className="size-4" aria-hidden />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignDetailPageContent() {
  const searchParams = useSearchParams();
  const systemUnavailable = searchParams.get("system_error") === "1";

  const THINKING_DURATION = 3000;
  const [initialPhase, setInitialPhase] = useState<"thinking" | "typing" | "done">("thinking");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Campaign Overview");
  const [cohortTimeRange, setCohortTimeRange] = useState<"Flight" | "Weekly" | "Monthly">("Flight");
  const [cohortChartKey, setCohortChartKey] = useState(0);
  const [demoAgeTimeRange, setDemoAgeTimeRange] = useState<"Flight" | "Weekly" | "Monthly">("Flight");
  const [demoChartKey, setDemoChartKey] = useState(0);
  const [demoAgeView, setDemoAgeView] = useState<"chart" | "table">("chart");
  const [demoGenderView, setDemoGenderView] = useState<"chart" | "table">("chart");
  const [cohortView, setCohortView] = useState<"chart" | "table">("chart");
  const [geoTimeRange, setGeoTimeRange] = useState<"Flight" | "Weekly" | "Monthly">("Flight");
  const [geoView, setGeoView] = useState<"chart" | "table">("chart");
  const [geoChartKey, setGeoChartKey] = useState(0);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [dtDimension, setDtDimension] = useState<"Day of week" | "Hour of day">("Day of week");
  const [dtView, setDtView] = useState<"chart" | "table">("chart");
  const [dtChartKey, setDtChartKey] = useState(0);
  const [promptsPanelOpen, setPromptsPanelOpen] = useState(true);
  const [kpiExpanded, setKpiExpanded] = useState(true);
  const [promptTab, setPromptTab] = useState<"default" | "saved">("default");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [partnerTab, setPartnerTab] = useState("Overview");
  const [partnerPhase, setPartnerPhase] = useState<"thinking" | "typing" | "done">("thinking");
  const [partnerChatMessages, setPartnerChatMessages] = useState<ChatMessage[]>([]);
  const [partnerIsResponding, setPartnerIsResponding] = useState(false);
  const [partnerInputValue, setPartnerInputValue] = useState("");
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([]);
  const [reportToast, setReportToast] = useState<{ type: "success" | "error"; visible: boolean }>({ type: "success", visible: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const partnerScrollRef = useRef<HTMLDivElement>(null);
  const reportMenuRef = useRef<HTMLDivElement>(null);
  const downloadsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setInitialPhase("typing"), THINKING_DURATION);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!partnerOpen) return;
    const handler = (e: MouseEvent) => {
      if (partnerRef.current && !partnerRef.current.contains(e.target as Node)) {
        setPartnerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [partnerOpen]);

  useEffect(() => {
    if (!reportMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (reportMenuRef.current && !reportMenuRef.current.contains(e.target as Node)) setReportMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [reportMenuOpen]);

  useEffect(() => {
    if (!downloadsOpen) return;
    const handler = (e: MouseEvent) => {
      if (downloadsRef.current && !downloadsRef.current.contains(e.target as Node)) setDownloadsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [downloadsOpen]);

  useEffect(() => {
    if (!systemUnavailable) return;
    setReportMenuOpen(false);
    setDownloadsOpen(false);
  }, [systemUnavailable]);

  const generateReport = useCallback((format: "pdf" | "xlsx") => {
    if (systemUnavailable) return;
    setReportMenuOpen(false);
    const name = `QSR_Q2_2026_Report.${format}`;
    const newFile: ReportFile = { name, format, status: "generating", progress: 0 };
    setReportFiles((prev) => [newFile, ...prev]);
    setDownloadsOpen(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        clearInterval(interval);
        setReportFiles((prev) =>
          prev.map((f) => f.name === name && f.status === "generating"
            ? { ...f, status: "ready", progress: undefined, downloadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
            : f
          )
        );
        setReportToast({ type: "success", visible: true });
        window.setTimeout(() => setReportToast((t) => ({ ...t, visible: false })), 4000);
      } else {
        setReportFiles((prev) =>
          prev.map((f) => f.name === name && f.status === "generating" ? { ...f, progress: Math.min(Math.round(progress), 99) } : f)
        );
      }
    }, 600);
  }, [systemUnavailable]);

  const { displayed: initialDisplayed, isComplete: initialComplete } = useTypewriter(
    initialPhase !== "thinking" ? initialSummary : "",
    6
  );

  useEffect(() => {
    if (initialComplete && initialPhase === "typing") setInitialPhase("done");
  }, [initialComplete, initialPhase]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [initialDisplayed, chatMessages, isResponding]);

  // Reset partner view state when partner changes
  useEffect(() => {
    if (selectedPartner) {
      setPartnerPhase("thinking");
      setPartnerChatMessages([]);
      setPartnerInputValue("");
      setPartnerTab("Overview");
      const t = window.setTimeout(() => setPartnerPhase("typing"), THINKING_DURATION);
      return () => clearTimeout(t);
    }
  }, [selectedPartner]);

  const partnerSummaryText = selectedPartner
    ? (partnerSummaries[selectedPartner] || partnerSummaries.default)
    : "";
  const { displayed: partnerDisplayed, isComplete: partnerSummaryComplete } = useTypewriter(
    partnerPhase !== "thinking" ? partnerSummaryText : "",
    6
  );

  useEffect(() => {
    if (partnerSummaryComplete && partnerPhase === "typing") setPartnerPhase("done");
  }, [partnerSummaryComplete, partnerPhase]);

  useEffect(() => {
    if (partnerScrollRef.current) partnerScrollRef.current.scrollTop = partnerScrollRef.current.scrollHeight;
  }, [partnerDisplayed, partnerChatMessages, partnerIsResponding]);

  const submitPartnerPrompt = useCallback((text: string) => {
    if (!text.trim() || partnerIsResponding) return;
    const query = text.trim();
    const userMsg: ChatMessage = { role: "user", content: query };
    const resp = promptResponses[query];
    const name = selectedPartner || "Partner";

    const customResp = `Based on ${name} campaign data, here is an analysis for your query:

**Analysis: "${query}"**

**${name} Performance Data**
   - **Impressions:** ${partnerMetrics[name]?.[0]?.value || "18.2M"} across all DMAs
   - **Lift Presence:** 93% among High Frequenters
   - **CVR Pattern:** Positive correlation \u2013 high CVR signals genuine engagement

**Findings**
   - High Frequenters respond best at 4-6 ad exposures (sweet spot)
   - Mid-week lunch/dinner dayparts drive 72% of ${name} lift
   - Top DMAs: Chicago (5.1% lift), Atlanta (4.8%), Dallas (4.3%)

**Summary**
1. ${name} is a top-tier partner for driving High Frequenter visits
2. Frequency management is critical \u2013 cap at 6 exposures per user
3. Recommend scaling ${name} budget from current allocation to 15-18% of total

**Next Steps**
   - Compare ${name} performance across cohorts in the User Cohort tab
   - Review geographic distribution for budget reallocation opportunities`;

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: resp?.content || customResp,
      title: resp?.title || `${name} Analysis`,
    };
    setPartnerChatMessages((prev) => [...prev, userMsg]);
    setPartnerIsResponding(true);
    window.setTimeout(() => {
      setPartnerChatMessages((prev) => [...prev, assistantMsg]);
      setPartnerIsResponding(false);
    }, 1500);
    setPartnerInputValue("");
  }, [partnerIsResponding, selectedPartner]);

  const handlePartnerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPartnerPrompt(partnerInputValue);
    }
  };

  const submitPrompt = useCallback((text: string) => {
    if (!text.trim() || isResponding) return;
    const query = text.trim();
    const userMsg: ChatMessage = { role: "user", content: query };
    const resp = promptResponses[query];

    const customResponse = `Based on the current campaign data for QSR Brand Q2 2026 Campaign, here is an analysis for your query:

**Analysis: "${query}"**

**Findings**
   - **Impressions analyzed:** 133,408,578 across all partners and DMAs
   - **Relevant store visits:** 578,464 total with 3.22% conversion rate
   - **Lift contribution:** Primarily driven by High Frequenter cohort (78.5%)

**Data Points**
   - Top contributing partner for this query: Pandora (93% lift presence)
   - Most relevant DMA: Chicago metro area (4.5% lift rate)
   - Best performing time window: Wednesday 11am-1pm (5.2% lift)
   - Audience sweet spot: 25-34 age group, Female skew (+31% efficiency)

**Summary**
1. The data suggests strong performance in mid-frequency exposure ranges (3-6 per user)
2. Geographic concentration in mid-size metros yields better ROI than mega-markets
3. Mid-week daypart optimization could improve CPSV by approximately 40%

**Next Steps**
   - Consider drilling into specific partner or DMA breakdowns for deeper analysis
   - Use the suggested prompts on the right for pre-built analytical views`;

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: resp?.content || customResponse,
      title: resp?.title || "Campaign Analysis",
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsResponding(true);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsResponding(false);
    }, 1500);
    setInputValue("");
  }, [isResponding]);

  const handlePromptClick = useCallback((prompt: string) => {
    submitPrompt(prompt);
  }, [submitPrompt]);

  const toggleSavePrompt = useCallback((prompt: string) => {
    setSavedPrompts((prev) => {
      const next = new Set(prev);
      next.has(prompt) ? next.delete(prompt) : next.add(prompt);
      return next;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPrompt(inputValue);
    }
  };

  return (
    <TooltipProvider delayDuration={250}>
    <div className="flex h-screen flex-col bg-white font-sans">
      {/* Masthead */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-12">
        <div className="flex items-center gap-0.5">
          <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
          <span className="font-mono text-lg font-medium text-[#000033]">/</span>
          <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-4 px-4">
            <button className="btn-press flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><CircleAlert className="size-4" /></button>
            <button className="btn-press flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><FileText className="size-4" /></button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`btn-press flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50 ${userMenuOpen ? "ring-2 ring-[#212be9] ring-offset-2" : ""}`}
              >
                <UserCircle className="size-4" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-md border border-border bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-b border-border p-3">
                      <p className="text-sm font-medium text-[#000033]">Sang Yeo</p>
                      <p className="text-sm text-[#8d8d8d]">syeo@foursquare.com</p>
                    </div>
                    <div className="p-1">
                      <p className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-[#8d8d8d]">SETTINGS</p>
                      <div className="flex flex-col">
                        {["Profile", "Admin Dashboard", "Permission Groups", "Impersonate"].map((item) => (
                          item === "Permission Groups" || item === "Admin Dashboard" ? (
                            <Link
                              key={item}
                              href={item === "Permission Groups" ? "/attribution/permission-groups" : "/attribution/admin"}
                              className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              {item}
                            </Link>
                          ) : (
                            <button key={item} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                              {item}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border p-1">
                      <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                        <LogOut className="size-4 text-[#555]" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center border-l border-border pl-4">
            <button className="btn-press flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><Grid3X3 className="size-4" /></button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/attribution" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <span className="flex items-center gap-1.5 font-medium text-[#171417]">
            <span className="flex size-5 items-center justify-center rounded bg-[#6366f1] text-[7px] font-bold text-white">QS</span>
            {selectedPartner ? (
              <button onClick={() => setSelectedPartner(null)} className="hover:text-[#212be9] transition-colors">
                QSR Q2 2026 Campaign
              </button>
            ) : (
              <>QSR Q2 2026 Campaign</>
            )}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">Visits + Sales Impact</span>
          <span className="ml-2 animate-pulse rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-xs font-medium text-[#2563eb]">In progress</span>
          <div ref={partnerRef} className="relative ml-3">
            <button
              onClick={() => setPartnerOpen(!partnerOpen)}
              className={`btn-press flex items-center gap-1 rounded-md border bg-white px-3 py-1 text-sm transition-all duration-200 ${partnerOpen ? "border-[#212be9] shadow-[0_0_0_1px_#212be9]" : "border-input hover:bg-[#f9f9f9]"}`}
            >
              <span className={selectedPartner ? "text-[#171417] font-medium" : "text-muted-foreground"}>
                {selectedPartner || "Select a specific partner"}
              </span>
              {partnerOpen ? (
                <ChevronUp className="size-3.5 text-muted-foreground transition-transform duration-200" />
              ) : (
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200" />
              )}
            </button>
            {partnerOpen && (
              <div className="animate-slide-in-up absolute left-0 top-full z-50 mt-1 w-[200px] rounded-md border border-border bg-white py-1 shadow-md">
                {selectedPartner && (
                  <button
                    onClick={() => { setSelectedPartner(null); setPartnerOpen(false); }}
                    className="flex w-full items-center px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-[#f5f5ff] hover:text-[#212be9]"
                  >
                    All partners
                  </button>
                )}
                {partners.map((partner) => (
                  <button
                    key={partner}
                    onClick={() => { setSelectedPartner(partner); setPartnerOpen(false); }}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f5ff] hover:text-[#212be9] ${selectedPartner === partner ? "bg-[#f5f5ff] font-medium text-[#212be9]" : "text-[#171417]"}`}
                  >
                    {partner}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-press flex size-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-gray-50"><MoreVertical className="size-4" /></button>
          <button className="btn-press flex size-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-gray-50"><Share2 className="size-4" /></button>

          {/* Download Reports Button + Panel */}
          <div ref={downloadsRef} className="relative">
            <button
              onClick={() => setDownloadsOpen(!downloadsOpen)}
              className={`btn-press flex size-8 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 ${reportFiles.some((f) => f.status === "generating") ? "animate-pulse text-[#212be9]" : reportFiles.some((f) => f.status === "ready") ? "border border-[#212be9] text-[#212be9]" : "text-muted-foreground hover:bg-gray-50"}`}
            >
              <Download className="size-4" />
            </button>
            {downloadsOpen && (
              <div className="animate-slide-in-up absolute right-0 top-full z-50 mt-2 w-[280px] rounded-lg border border-border bg-white shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold text-[#171417]">Download Reports</h3>
                </div>
                <div className="max-h-[240px] overflow-y-auto">
                  {reportFiles.length === 0 && (
                    <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                      No reports yet. Click{" "}
                      <button
                        type="button"
                        disabled={systemUnavailable}
                        onClick={() => {
                          if (systemUnavailable) return;
                          setDownloadsOpen(false);
                          setReportMenuOpen(true);
                        }}
                        className={`font-medium underline underline-offset-2 ${systemUnavailable ? "cursor-not-allowed text-muted-foreground no-underline opacity-50" : "text-[#212be9]"}`}
                      >
                        &apos;Generate Report&apos;
                      </button>{" "}
                      to get started.
                    </div>
                  )}
                  {reportFiles.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50">
                      {file.status === "error" ? (
                        <OctagonAlert className="size-4 shrink-0 text-red-500" />
                      ) : (
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`truncate text-sm ${file.status === "error" ? "text-red-600" : "text-[#171417]"}`}>{file.name}</span>
                          {file.status === "generating" && file.progress != null && (
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{file.progress}%</span>
                          )}
                        </div>
                        {file.status === "generating" && file.progress != null && (
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-[#212be9] transition-all duration-300" style={{ width: `${file.progress}%` }} />
                          </div>
                        )}
                      </div>
                      {file.status === "generating" && (
                        <Loader2 className="size-4 shrink-0 animate-spin text-[#212be9]" />
                      )}
                      {file.status === "ready" && (
                        <button className="btn-press flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-[#212be9]">
                          <ArrowDownToLine className="size-3.5" />
                        </button>
                      )}
                      {file.status === "error" && (
                        <button
                          type="button"
                          disabled={systemUnavailable}
                          onClick={() => generateReport(file.format)}
                          className={`btn-press flex size-6 shrink-0 items-center justify-center rounded transition-colors ${systemUnavailable ? "cursor-not-allowed text-muted-foreground opacity-40" : "text-muted-foreground hover:text-[#212be9]"}`}
                        >
                          <Reply className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {reportFiles.some((f) => f.downloadedAt) && (
                  <div className="px-4 pb-1 text-[10px] text-muted-foreground">
                    Downloaded {reportFiles.find((f) => f.downloadedAt)?.downloadedAt}
                  </div>
                )}
                <div className="border-t border-border px-4 py-2.5">
                  <Link href="/attribution/downloads" target="_blank" className="flex w-full items-center justify-between text-sm text-[#171417] transition-colors hover:text-[#212be9]">
                    Full download history
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Generate Report Button + Dropdown */}
          <div ref={reportMenuRef} className="relative ml-1">
            <button
              type="button"
              disabled={systemUnavailable}
              onClick={() => {
                if (systemUnavailable) return;
                setReportMenuOpen(!reportMenuOpen);
              }}
              className={`btn-press inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                systemUnavailable
                  ? "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
                  : "bg-[#212be9] text-white hover:bg-[#1a22c4] hover:shadow-lg hover:shadow-[#212be9]/20"
              }`}
            >
              Generate report <ChevronDown className={`size-3.5 transition-transform duration-200 ${reportMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {reportMenuOpen && !systemUnavailable && (
              <div className="animate-slide-in-up absolute right-0 top-full z-50 mt-1 w-[180px] rounded-md border border-border bg-white py-1 shadow-md">
                <button
                  type="button"
                  onClick={() => generateReport("pdf")}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#171417] transition-colors duration-150 hover:bg-[#f5f5ff] hover:text-[#212be9]"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  Generate as PDF
                </button>
                <button
                  type="button"
                  onClick={() => generateReport("xlsx")}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#171417] transition-colors duration-150 hover:bg-[#f5f5ff] hover:text-[#212be9]"
                >
                  <ArrowDownToLine className="size-4 text-muted-foreground" />
                  Generate as XLSX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Toast Notification */}
      {reportToast.visible && !systemUnavailable && (
        <div className={`animate-slide-in-up fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg px-5 py-3 shadow-lg ${reportToast.type === "success" ? "border border-[#212be9]/20 bg-white text-[#171417]" : "border border-red-200 bg-red-50 text-red-700"}`}>
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {reportToast.type === "success" ? (
              <><Info className="size-4 text-[#212be9]" /> Your report is ready to download.</>
            ) : (
              <><CircleAlert className="size-4 text-red-500" /> Something went wrong. Please try it again.</>
            )}
          </div>
        </div>
      )}

      {/* Main Area */}
      {systemUnavailable ? (
        <CampaignSystemError />
      ) : (
      <div className="flex min-h-0 flex-1">
        {selectedPartner ? (
          <>
            {/* Partner Detail: sidebar */}
            <aside className={`group/sidebar flex shrink-0 flex-col border-r border-border bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarExpanded ? "w-[220px]" : "w-12"}`}>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden px-1.5 py-3">
                <button
                  onClick={() => setSelectedPartner(null)}
                  title={sidebarExpanded ? undefined : "Back to Campaign Overview"}
                  className={`btn-press group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-muted-foreground transition-all duration-200 hover:bg-gray-50 hover:text-foreground ${sidebarExpanded ? "" : "justify-center"}`}
                >
                  <ArrowLeft className="size-4 shrink-0" />
                  {sidebarExpanded && <span className="truncate text-sm">Back to Campaign Overview</span>}
                  {!sidebarExpanded && (
                    <span className="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white shadow-md group-hover/item:block">Back to Campaign Overview</span>
                  )}
                </button>
                <button
                  title={sidebarExpanded ? undefined : "Partner Report"}
                  className={`btn-press group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 bg-[#f0f0ff] text-[#212be9] transition-all duration-200 ${sidebarExpanded ? "" : "justify-center"}`}
                >
                  <FileChartLine className="size-4 shrink-0" />
                  {sidebarExpanded && <span className="truncate text-sm font-medium">Partner Report</span>}
                  {!sidebarExpanded && (
                    <span className="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white shadow-md group-hover/item:block">Partner Report</span>
                  )}
                </button>
              </div>
              <div className="flex flex-col gap-1 border-t border-border px-1.5 py-2">
                <button
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  title={sidebarExpanded ? "Minimize" : "Expand"}
                  className={`btn-press group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-muted-foreground transition-all duration-200 hover:bg-gray-50 hover:text-foreground ${sidebarExpanded ? "" : "justify-center"}`}
                >
                  <ArrowLeftToLine className={`size-4 shrink-0 transition-transform duration-300 ${sidebarExpanded ? "" : "rotate-180"}`} />
                  {sidebarExpanded && <span className="truncate text-sm">Minimize</span>}
                  {!sidebarExpanded && (
                    <span className="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white shadow-md group-hover/item:block">Expand</span>
                  )}
                </button>
              </div>
            </aside>

            {/* Partner Detail: content area */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col animate-slide-in-right">
              {/* Partner tabs */}
              <div className="flex shrink-0 items-center border-b border-border bg-white px-6">
                {partnerTabs.map((tab) => (
                  <button key={tab} onClick={() => setPartnerTab(tab)} className={`px-4 py-2.5 text-sm transition-all duration-200 ${partnerTab === tab ? "border-b-2 border-[#212be9] font-medium text-[#212be9]" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
                ))}
              </div>

              {/* Partner Title + KPIs */}
              <div className="shrink-0 px-8 py-6">
                <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                  {selectedPartner}: QSR Q2 2026 Overview
                </h1>
                <div className="mt-5 grid grid-cols-7 gap-3">
                  {(partnerMetrics[selectedPartner] || partnerMetrics.default).map((m, i) => (
                    <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                  ))}
                </div>
              </div>

              <div className="shrink-0 border-t border-border" />

              {/* Partner Chat + Prompts */}
              <div className="flex min-h-0 flex-1">
                {/* Partner chat area */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <div ref={partnerScrollRef} className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="px-8 py-6">
                      <div className="space-y-6">
                        {partnerChatMessages.length === 0 && (
                          <div>
                            <h2 className="mb-3 text-base font-semibold text-[#171417]">Campaign Summary</h2>
                            <div>
                              {partnerPhase === "thinking" && (
                                <div className="flex items-center gap-3">
                                  <div className="flex gap-1">
                                    <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:0ms]" />
                                    <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:150ms]" />
                                    <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:300ms]" />
                                  </div>
                                  <SummarizingDots />
                                </div>
                              )}
                              {partnerPhase !== "thinking" && (
                                <div className="relative">
                                  <MarkdownRenderer text={partnerDisplayed} />
                                  {partnerPhase === "typing" && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#212be9]" />}
                                </div>
                              )}
                            </div>
                            {partnerPhase === "done" && (
                              <p className="mt-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                                Ask a question about <em>this partner campaign report</em>, or select a suggested prompt on the left to get started.
                              </p>
                            )}
                          </div>
                        )}

                        {partnerChatMessages.map((msg, i) => (
                          <div key={i}>
                            {msg.role === "user" ? (
                              <div className="animate-slide-in-right flex justify-end">
                                <div className="group/bubble relative inline-flex max-w-[80%] items-center gap-2">
                                  <button
                                    onClick={() => toggleSavePrompt(msg.content)}
                                    title={savedPrompts.has(msg.content) ? "Unsave" : "Save prompt"}
                                    className={`btn-press flex size-6 shrink-0 items-center justify-center rounded-md transition-all ${savedPrompts.has(msg.content) ? "opacity-100 text-[#555]" : "opacity-0 text-muted-foreground hover:text-[#555] group-hover/bubble:opacity-100"}`}
                                  >
                                    <Bookmark className={`size-3.5 transition-all ${savedPrompts.has(msg.content) ? "fill-[#555] text-[#555]" : "fill-none"}`} />
                                  </button>
                                  <div className="rounded-full bg-[#f0f0f0] px-5 py-2.5 text-sm text-[#171417] transition-shadow duration-200 hover:shadow-md">
                                    {msg.content}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="animate-slide-in-left">
                                <TypewriterMessage content={msg.content} title={msg.title} />
                              </div>
                            )}
                          </div>
                        ))}

                        {partnerIsResponding && (
                          <div className="animate-slide-in-up flex items-center gap-3 py-2">
                            <div className="flex gap-1">
                              <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:0ms]" />
                              <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:150ms]" />
                              <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:300ms]" />
                            </div>
                            <SummarizingDots />
                          </div>
                        )}

                        {partnerChatMessages.length > 0 && !partnerIsResponding && partnerChatMessages[partnerChatMessages.length - 1].role === "assistant" && (
                          <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                            Ask a question about <em>this partner campaign report</em>, or select a suggested prompt on the left to get started.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partner chat input */}
                  <div className="shrink-0 border-t border-border bg-white px-8 py-4">
                    <div className="relative">
                      <textarea
                        placeholder="Ask anything about this campaign"
                        rows={2}
                        value={partnerInputValue}
                        onChange={(e) => setPartnerInputValue(e.target.value)}
                        onKeyDown={handlePartnerKeyDown}
                        className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 pr-12 text-sm leading-5 placeholder:text-muted-foreground transition-all duration-300 focus:border-[#212be9] focus:outline-none focus:ring-2 focus:ring-[#212be9]/20 focus:shadow-[0_0_20px_rgba(33,43,233,0.08)]"
                      />
                      <button
                        onClick={() => submitPartnerPrompt(partnerInputValue)}
                        disabled={!partnerInputValue.trim() || partnerIsResponding}
                        className={`btn-press absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:bg-[#212be9] hover:text-white hover:border-[#212be9] hover:shadow-lg hover:shadow-[#212be9]/25 disabled:opacity-40 disabled:hover:shadow-none ${partnerInputValue.trim() && !partnerIsResponding ? "bg-[#212be9] text-white border-[#212be9] shadow-md shadow-[#212be9]/20" : "bg-white"}`}
                      >
                        <ArrowUp className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Partner suggested prompts */}
                <div className="flex w-[300px] shrink-0 flex-col border-l border-border bg-white animate-slide-in-right">
                  <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#171417]">
                    <Lightbulb className="size-4" />
                    Suggested Prompts
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="flex flex-col gap-2">
                      {partnerPrompts.map((prompt, i) => (
                        <div key={i} className="animate-prompt-cascade group flex items-start gap-2 rounded-lg border border-border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#212be9]/30 hover:shadow-md" style={{ animationDelay: `${i * 40}ms` }}>
                          <button onClick={() => submitPartnerPrompt(prompt)} className="btn-press flex min-w-0 flex-1 items-start gap-2.5 text-left">
                            <svg className="mt-0.5 size-3.5 shrink-0 text-muted-foreground group-hover:text-[#212be9] transition-colors" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M4.5 8L7 10.5L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-xs leading-4 text-[#171417] group-hover:text-[#212be9] transition-colors">{prompt}</span>
                          </button>
                          <button onClick={() => toggleSavePrompt(prompt)} title={savedPrompts.has(prompt) ? "Unsave" : "Save"} className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-[#555]">
                            <Bookmark className={`size-3.5 transition-all ${savedPrompts.has(prompt) ? "fill-[#555] text-[#555]" : "fill-none"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Campaign View: sidebar */}
            <aside className={`group/sidebar flex shrink-0 flex-col border-r border-border bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarExpanded ? "w-[200px]" : "w-12"}`}>
              <div className="flex flex-1 flex-col gap-3 overflow-hidden px-2 pt-3">
                {sidebarItems.map((item) => {
                  const isActive = activeSidebarItem === item.label;
                  return (
                  <button
                    key={item.label}
                    onClick={() => { setActiveSidebarItem(item.label); if (item.label === "User Cohort") setCohortChartKey((k) => k + 1); if (item.label === "Demographic") setDemoChartKey((k) => k + 1); if (item.label === "Geography") setGeoChartKey((k) => k + 1); }}
                    title={sidebarExpanded ? undefined : item.label}
                    className={`btn-press group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-all duration-200 ${
                      isActive
                        ? "bg-[#ebf1ff] text-[#212be9]"
                        : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                    } ${sidebarExpanded ? "" : "justify-center"}`}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {sidebarExpanded && (
                      <span className={`truncate text-sm ${isActive ? "font-medium" : ""}`}>
                        {item.label}
                      </span>
                    )}
                    {!sidebarExpanded && !isActive && (
                      <span className="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white shadow-md group-hover/item:block">
                        {item.label}
                      </span>
                    )}
                  </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1 border-t border-border px-1.5 py-2">
                <button
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  title={sidebarExpanded ? "Minimize" : "Expand"}
                  className={`btn-press group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-muted-foreground transition-all duration-200 hover:bg-gray-50 hover:text-foreground ${sidebarExpanded ? "" : "justify-center"}`}
                >
                  <ChevronsRight className={`size-4 shrink-0 transition-transform duration-300 ${sidebarExpanded ? "rotate-180" : ""}`} />
                  {sidebarExpanded && <span className="truncate text-sm">Minimize</span>}
                  {!sidebarExpanded && (
                    <span className="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white shadow-md group-hover/item:block">Expand</span>
                  )}
                </button>
              </div>
            </aside>

        {/* Content + Panel */}
        {activeSidebarItem === "User Cohort" ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="shrink-0 px-8 py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                  QSR Q2 2026 Campaign Overview
                </h1>
                <button onClick={() => setKpiExpanded(!kpiExpanded)} className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200">
                  <ChevronDown className={`size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${kpiExpanded ? "" : "-rotate-90"}`} />
                </button>
              </div>
              {kpiExpanded && (
                <div className="mt-5 grid grid-cols-7 gap-3">
                  {metrics.map((m, i) => (
                    <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-border" />
            <div className="px-8 py-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-[#171417]">User Cohort</h2>
                <span className="text-xs text-muted-foreground">Last updated: <strong className="font-semibold text-[#171417]">Updated 3 minutes ago</strong></span>
                <span className="text-xs text-muted-foreground">Visits through: <strong className="font-semibold text-[#171417]">01/11/25</strong></span>
              </div>
              <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#171417]">Index by Visit</h3>
                    <Info className="size-3.5 text-muted-foreground/60" />
                  </div>
                  <div className="flex items-center gap-3">
                    {cohortView === "chart" && (
                      <div className="flex items-center gap-0.5 rounded-md border border-border bg-white p-0.5">
                        {(["Flight", "Weekly", "Monthly"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => { setCohortTimeRange(t); setCohortChartKey((k) => k + 1); }}
                            className={`rounded px-3 py-1 text-xs font-medium transition-all duration-200 ${cohortTimeRange === t ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                      <button onClick={() => setCohortView("chart")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${cohortView === "chart" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><ChartColumn className="size-3.5" /></button>
                      <button onClick={() => setCohortView("table")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${cohortView === "table" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Table2 className="size-3.5" /></button>
                    </div>
                  </div>
                </div>
                {cohortView === "chart" ? (
                  <>
                    <div className="mt-6 h-[380px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={cohortChartKey} data={userCohortData[cohortTimeRange]} barGap={4} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} dy={8} label={{ value: "AGE", position: "insideBottom", offset: -4, fontSize: 11, fill: "#868384", fontWeight: 500 }} height={50} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} domain={[0, 160]} ticks={[0, 25, 50, 75, 100, 125, 150]} label={{ value: "INDEX", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#868384", fontWeight: 500 }} width={50} />
                          <RechartsTooltip content={<CohortChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
                          <ReferenceLine y={100} stroke="#868384" strokeDasharray="6 4" strokeWidth={1} />
                          <Bar dataKey="impressionIndex" name="IMPRESSION INDEX" fill="#4250E0" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out">
                            {userCohortData[cohortTimeRange].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                          <Bar dataKey="bvrLiftIndex" name="BVR LIFT INDEX" fill="#97DAF8" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={200}>
                            {userCohortData[cohortTimeRange].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#4250E0]" /><span className="text-xs font-medium text-muted-foreground">IMPRESSION INDEX</span></div>
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#97DAF8]" /><span className="text-xs font-medium text-muted-foreground">BVR LIFT INDEX</span></div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 pr-4 text-xs font-medium text-[#212be9]">Cohort</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]"><span className="inline-flex items-center gap-1">Impression Index <ArrowDownUp className="size-3" /></span></th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">BVR Lift Index</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">CVR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cohortTableData.map((row) => (
                          <tr key={row.cohort} className="border-b border-border last:border-0 transition-colors hover:bg-gray-50/50">
                            <td className="py-4 pr-4 font-medium text-[#171417]">{row.cohort}</td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.impressionIndex}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#4250E0]" style={{ width: `${Math.min(100, row.bvrLiftIndex * 10)}%` }} /></div>
                                <span className="tabular-nums text-[#171417]">{row.bvrLiftIndex}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.cvr}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeSidebarItem === "Demographic" ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="shrink-0 px-8 py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                  QSR Q2 2026 Campaign Overview
                </h1>
                <button onClick={() => setKpiExpanded(!kpiExpanded)} className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200">
                  <ChevronDown className={`size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${kpiExpanded ? "" : "-rotate-90"}`} />
                </button>
              </div>
              {kpiExpanded && (
                <div className="mt-5 grid grid-cols-7 gap-3">
                  {metrics.map((m, i) => (
                    <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-border" />
            <div className="px-8 py-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-[#171417]">Demographics</h2>
                <span className="text-xs text-muted-foreground">Last updated: <strong className="font-semibold text-[#171417]">Updated 3 minutes ago</strong></span>
                <span className="text-xs text-muted-foreground">Visits through: <strong className="font-semibold text-[#171417]">01/11/25</strong></span>
              </div>

              {/* Age Chart */}
              <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#171417]">Age</h3>
                    <Info className="size-3.5 text-muted-foreground/60" />
                  </div>
                  <div className="flex items-center gap-3">
                    {demoAgeView === "chart" && (
                      <div className="flex items-center gap-0.5 rounded-md border border-border bg-white p-0.5">
                        {(["Flight", "Weekly", "Monthly"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => { setDemoAgeTimeRange(t); setDemoChartKey((k) => k + 1); }}
                            className={`rounded px-3 py-1 text-xs font-medium transition-all duration-200 ${demoAgeTimeRange === t ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                      <button onClick={() => setDemoAgeView("chart")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${demoAgeView === "chart" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><ChartColumn className="size-3.5" /></button>
                      <button onClick={() => setDemoAgeView("table")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${demoAgeView === "table" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Table2 className="size-3.5" /></button>
                    </div>
                  </div>
                </div>
                {demoAgeView === "chart" ? (
                  <>
                    <div className="mt-6 h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={`age-${demoChartKey}`} data={demoAgeData[demoAgeTimeRange]} barGap={4} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} dy={8} label={{ value: "AGE", position: "insideBottom", offset: -4, fontSize: 11, fill: "#868384", fontWeight: 500 }} height={50} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} domain={[0, 160]} ticks={[0, 25, 50, 75, 100, 125, 150]} label={{ value: "IMPRESSION", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#868384", fontWeight: 500 }} width={60} />
                          <RechartsTooltip content={<CohortChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
                          <ReferenceLine y={100} stroke="#868384" strokeDasharray="6 4" strokeWidth={1} />
                          <Bar dataKey="impressionIndex" name="IMPRESSION INDEX" fill="#4250E0" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out">
                            {demoAgeData[demoAgeTimeRange].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                          <Bar dataKey="bvrLiftIndex" name="BVR LIFT INDEX" fill="#97DAF8" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={200}>
                            {demoAgeData[demoAgeTimeRange].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#4250E0]" /><span className="text-xs font-medium text-muted-foreground">IMPRESSION INDEX</span></div>
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#97DAF8]" /><span className="text-xs font-medium text-muted-foreground">BVR LIFT INDEX</span></div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 pr-4 text-xs font-medium text-[#212be9]">Age</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]"><span className="inline-flex items-center gap-1">Impression Index <ArrowDownUp className="size-3" /></span></th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">BVR Lift Index</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">CVR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoAgeTableData.map((row) => (
                          <tr key={row.age} className="border-b border-border last:border-0 transition-colors hover:bg-gray-50/50">
                            <td className="py-4 pr-4 font-medium text-[#171417]">{row.age}</td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.impressionIndex}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#4250E0]" style={{ width: `${Math.min(100, row.bvrLiftIndex * 10)}%` }} /></div>
                                <span className="tabular-nums text-[#171417]">{row.bvrLiftIndex}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.cvr}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Gender Chart */}
              <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#171417]">Gender</h3>
                    <Info className="size-3.5 text-muted-foreground/60" />
                  </div>
                  <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                    <button onClick={() => setDemoGenderView("chart")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${demoGenderView === "chart" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><ChartColumn className="size-3.5" /></button>
                    <button onClick={() => setDemoGenderView("table")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${demoGenderView === "table" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Table2 className="size-3.5" /></button>
                  </div>
                </div>
                {demoGenderView === "chart" ? (
                  <>
                    <div className="mt-6 h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={`gender-${demoChartKey}`} data={demoGenderData} barGap={4} barCategoryGap="30%">
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} dy={8} label={{ value: "GENDER", position: "insideBottom", offset: -4, fontSize: 11, fill: "#868384", fontWeight: 500 }} height={50} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} domain={[0, 160]} ticks={[0, 25, 50, 75, 100, 125, 150]} label={{ value: "IMPRESSION", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#868384", fontWeight: 500 }} width={60} />
                          <RechartsTooltip content={<CohortChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
                          <ReferenceLine y={100} stroke="#868384" strokeDasharray="6 4" strokeWidth={1} />
                          <Bar dataKey="keyOne" name="KEY ONE" fill="#4250E0" radius={[3, 3, 0, 0]} maxBarSize={56} isAnimationActive animationDuration={800} animationEasing="ease-out">
                            {demoGenderData.map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                          <Bar dataKey="keyTwo" name="KEY TWO" fill="#97DAF8" radius={[3, 3, 0, 0]} maxBarSize={56} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={200}>
                            {demoGenderData.map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#4250E0]" /><span className="text-xs font-medium text-muted-foreground">KEY ONE</span></div>
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#97DAF8]" /><span className="text-xs font-medium text-muted-foreground">KEY TWO</span></div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 pr-4 text-xs font-medium text-[#212be9]">Gender</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]"><span className="inline-flex items-center gap-1">Impression Index <ArrowDownUp className="size-3" /></span></th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">BVR Lift Index</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">CVR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoGenderTableData.map((row) => (
                          <tr key={row.gender} className="border-b border-border last:border-0 transition-colors hover:bg-gray-50/50">
                            <td className="py-4 pr-4 font-medium text-[#171417]">{row.gender}</td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.impressionIndex}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#4250E0]" style={{ width: `${Math.min(100, row.bvrLiftIndex * 10)}%` }} /></div>
                                <span className="tabular-nums text-[#171417]">{row.bvrLiftIndex}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 tabular-nums text-[#171417]">{row.cvr}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeSidebarItem === "Geography" ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="shrink-0 px-8 py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                  QSR Q2 2026 Campaign Overview
                </h1>
                <button onClick={() => setKpiExpanded(!kpiExpanded)} className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200">
                  <ChevronDown className={`size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${kpiExpanded ? "" : "-rotate-90"}`} />
                </button>
              </div>
              {kpiExpanded && (
                <div className="mt-5 grid grid-cols-7 gap-3">
                  {metrics.map((m, i) => (
                    <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-border" />
            <div className="px-8 py-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-[#171417]">Geography</h2>
                <span className="text-xs text-muted-foreground">Last updated: <strong className="font-semibold text-[#171417]">Updated 3 minutes ago</strong></span>
                <span className="text-xs text-muted-foreground">Visits through: <strong className="font-semibold text-[#171417]">01/11/25</strong></span>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#171417]">Geography Overview</h3>
                    <div className="group relative">
                      <Info className="size-3.5 text-muted-foreground/60" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-[#171417] px-3 py-1.5 text-xs text-white shadow-lg group-hover:block">
                        Analyze geographic distribution of your campaign performance across
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {geoView === "chart" && (
                      <div className="flex items-center gap-0.5 rounded-md border border-border bg-white p-0.5">
                        {(["Flight", "Weekly", "Monthly"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => { setGeoTimeRange(t); setGeoChartKey((k) => k + 1); }}
                            className={`rounded px-3 py-1 text-xs font-medium transition-all duration-200 ${geoTimeRange === t ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                      <button onClick={() => setGeoView("chart")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${geoView === "chart" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><ChartColumn className="size-3.5" /></button>
                      <button onClick={() => setGeoView("table")} className={`flex size-6 items-center justify-center rounded transition-all duration-200 ${geoView === "table" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Table2 className="size-3.5" /></button>
                    </div>
                  </div>
                </div>

                {geoView === "chart" ? (
                  <div className="relative mt-6">
                    <div className="absolute left-0 top-8 flex flex-col items-center gap-1">
                      <div className="h-24 w-3 rounded-sm" style={{ background: "linear-gradient(to bottom, rgb(30,50,205), rgb(100,130,235), rgb(180,200,255), rgb(220,225,255))" }} />
                      <span className="text-[10px] tabular-nums text-muted-foreground">200</span>
                      <div className="h-4" />
                      <span className="text-[10px] tabular-nums text-muted-foreground">100</span>
                    </div>
                    <div key={geoChartKey} className="ml-10">
                      <div className="grid grid-cols-11 gap-1">
                        {geoStateData[geoTimeRange]
                          .sort((a, b) => a.state.localeCompare(b.state))
                          .map((s, i) => (
                          <div
                            key={s.abbr}
                            onMouseEnter={() => setHoveredState(s.abbr)}
                            onMouseLeave={() => setHoveredState(null)}
                            className="group relative flex aspect-square items-center justify-center rounded-md text-[10px] font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-10"
                            style={{
                              backgroundColor: getGeoColor(s.index),
                              color: s.index > 150 ? "white" : "#171417",
                              opacity: hoveredState && hoveredState !== s.abbr ? 0.5 : 1,
                              animationDelay: `${i * 20}ms`,
                            }}
                          >
                            {s.abbr}
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded-lg border border-border bg-white px-3 py-2 shadow-lg group-hover:block">
                              <p className="whitespace-nowrap text-xs font-semibold text-[#171417]">{s.state}</p>
                              <p className="whitespace-nowrap text-[10px] text-muted-foreground">Index: <span className="font-semibold tabular-nums text-[#171417]">{s.index}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-border">
                          <th className="py-3 pr-4 text-xs font-medium text-[#212be9]">State</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]"><span className="inline-flex items-center gap-1">Index <ArrowDownUp className="size-3" /></span></th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...geoStateData[geoTimeRange]].sort((a, b) => b.index - a.index).map((row) => (
                          <tr key={row.abbr} className="border-b border-border last:border-0 transition-colors hover:bg-gray-50/50">
                            <td className="py-3 pr-4">
                              <span className="font-medium text-[#171417]">{row.state}</span>
                              <span className="ml-1.5 text-xs text-muted-foreground">({row.abbr})</span>
                            </td>
                            <td className="px-4 py-3 tabular-nums font-semibold text-[#171417]">{row.index}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-100">
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (row.index / 220) * 100)}%`, backgroundColor: getGeoColor(row.index) }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeSidebarItem === "Date and Time" ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="shrink-0 px-8 py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                  QSR Q2 2026 Campaign Overview
                </h1>
                <button onClick={() => setKpiExpanded(!kpiExpanded)} className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200">
                  <ChevronDown className={`size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${kpiExpanded ? "" : "-rotate-90"}`} />
                </button>
              </div>
              {kpiExpanded && (
                <div className="mt-5 grid grid-cols-7 gap-3">
                  {metrics.map((m, i) => (
                    <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-border" />
            <div className="px-8 py-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-[#171417]">Date and Time</h2>
                <span className="text-xs text-muted-foreground">Last updated: <strong className="font-semibold text-[#171417]">Updated 3 minutes ago</strong></span>
                <span className="text-xs text-muted-foreground">Visits through: <strong className="font-semibold text-[#171417]">01/11/25</strong></span>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <h3 className="text-base font-semibold text-[#171417]">Date and Time</h3>
                    <div className="group relative">
                      <Info className="size-4 text-muted-foreground/60" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#202020] px-4 py-2 text-xs text-white shadow-lg group-hover:block">
                        Review campaign performance over time and identify optimal timing.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={dtDimension}
                      onChange={(e) => { setDtDimension(e.target.value as "Day of week" | "Hour of day"); setDtChartKey((k) => k + 1); }}
                      className="rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 py-2 text-xs text-[#171417] outline-none focus:border-[#212be9] min-w-[160px]"
                    >
                      <option value="Day of week">Day of week</option>
                      <option value="Hour of day">Hour of day</option>
                    </select>
                    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                      <button onClick={() => setDtView("chart")} className={`flex size-7 items-center justify-center rounded transition-all duration-200 ${dtView === "chart" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><ChartColumn className="size-4" /></button>
                      <button onClick={() => setDtView("table")} className={`flex size-7 items-center justify-center rounded transition-all duration-200 ${dtView === "table" ? "bg-gray-200 text-[#171417] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Table2 className="size-4" /></button>
                    </div>
                  </div>
                </div>

                {dtView === "chart" ? (
                  <>
                    <div className="mt-6 h-[380px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={dtChartKey} data={dayOfWeekData[dtDimension]} barGap={4} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} dy={8} label={{ value: "DAY OF WEEK", position: "insideBottom", offset: -4, fontSize: 11, fill: "#757575", fontWeight: 700 }} height={50} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#555" }} domain={[0, 160]} ticks={[0, 25, 50, 75, 100, 125, 150]} label={{ value: "INDEX", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#757575", fontWeight: 700 }} width={50} />
                          <RechartsTooltip content={<DateTimeChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
                          <ReferenceLine y={100} stroke="#868384" strokeDasharray="6 4" strokeWidth={1} />
                          <Bar dataKey="keyOne" name="KEY ONE" fill="#4250E0" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out">
                            {dayOfWeekData[dtDimension].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                          <Bar dataKey="keyTwo" name="KEY TWO" fill="#97DAF8" radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={200}>
                            {dayOfWeekData[dtDimension].map((_, i) => (<Cell key={i} className="transition-opacity duration-200 hover:opacity-80" />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#4250E0]" /><span className="text-xs font-bold uppercase text-[#757575]">Key One</span></div>
                      <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#97DAF8]" /><span className="text-xs font-bold uppercase text-[#757575]">Key Two</span></div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-border">
                          <th className="py-3 pr-4 text-xs font-medium text-[#212be9]">{dtDimension === "Day of week" ? "Day" : "Hour"}</th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]"><span className="inline-flex items-center gap-1">Key One <ArrowDownUp className="size-3" /></span></th>
                          <th className="px-4 py-3 text-xs font-medium text-[#212be9]">Key Two</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayOfWeekData[dtDimension].map((row) => (
                          <tr key={row.category} className="border-b border-border last:border-0 transition-colors hover:bg-gray-50/50">
                            <td className="py-3 pr-4 font-medium text-[#171417]">{row.category}</td>
                            <td className="px-4 py-3 tabular-nums font-semibold text-[#171417]">{row.keyOne}</td>
                            <td className="px-4 py-3 tabular-nums font-semibold text-[#171417]">{row.keyTwo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">

          {/* Full-width top section: Title + KPIs */}
          <div className="shrink-0 px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold leading-7 text-[#171417]">
                QSR Q2 2026 Campaign Overview
              </h1>
              <button onClick={() => setKpiExpanded(!kpiExpanded)} className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200">
                <ChevronDown className={`size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${kpiExpanded ? "" : "-rotate-90"}`} />
              </button>
            </div>

            {kpiExpanded && (
              <div className="mt-5 grid grid-cols-7 gap-3">
                {metrics.map((m, i) => (
                  <KpiMetricCard key={m.label} label={m.label} value={m.value} animationDelayMs={i * 60} />
                ))}
              </div>
            )}
          </div>

          {/* Horizontal divider */}
          <div className="shrink-0 border-t border-border" />

          {/* Bottom section: Chat (left) | Divider | Prompts (right) */}
          <div className="flex min-h-0 flex-1">
            {/* Left: Chat content + sticky input */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
                <div className="px-8 py-6">
                  {/* Chat Messages Area */}
                  <div className="space-y-6">
                    {chatMessages.length === 0 && (
                      <div>
                        <h2 className="mb-3 text-base font-semibold text-[#171417]">Campaign Summary</h2>
                        <div>
                          {initialPhase === "thinking" && (
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:0ms]" />
                                <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:150ms]" />
                                <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:300ms]" />
                              </div>
                              <SummarizingDots />
                            </div>
                          )}
                          {initialPhase !== "thinking" && (
                            <div className="relative">
                              <MarkdownRenderer text={initialDisplayed} />
                              {initialPhase === "typing" && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#212be9]" />}
                            </div>
                          )}
                        </div>
                        {initialPhase === "done" && (
                          <p className="mt-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                            Ask a question about your campaign report, or select a suggested prompt on the left to get started.
                          </p>
                        )}
                      </div>
                    )}

                    {chatMessages.map((msg, i) => (
                      <div key={i}>
                        {msg.role === "user" ? (
                          <div className="animate-slide-in-right flex justify-end">
                            <div className="group/bubble relative inline-flex max-w-[80%] items-center gap-2">
                              <button
                                onClick={() => toggleSavePrompt(msg.content)}
                                title={savedPrompts.has(msg.content) ? "Unsave" : "Save prompt"}
                                className={`btn-press flex size-6 shrink-0 items-center justify-center rounded-md transition-all ${savedPrompts.has(msg.content) ? "opacity-100 text-[#555]" : "opacity-0 text-muted-foreground hover:text-[#555] group-hover/bubble:opacity-100"}`}
                              >
                                <Bookmark className={`size-3.5 transition-all ${savedPrompts.has(msg.content) ? "fill-[#555] text-[#555]" : "fill-none"}`} />
                              </button>
                              <div className="rounded-full bg-[#f0f0f0] px-5 py-2.5 text-sm text-[#171417] transition-shadow duration-200 hover:shadow-md">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="animate-slide-in-left">
                            <TypewriterMessage content={msg.content} title={msg.title} />
                          </div>
                        )}
                      </div>
                    ))}

                    {isResponding && (
                      <div className="animate-slide-in-up flex items-center gap-3 py-2">
                        <div className="flex gap-1">
                          <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:0ms]" />
                          <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:150ms]" />
                          <span className="size-2 animate-bounce rounded-full bg-[#212be9] [animation-delay:300ms]" />
                        </div>
                        <SummarizingDots />
                      </div>
                    )}

                    {chatMessages.length > 0 && !isResponding && chatMessages[chatMessages.length - 1].role === "assistant" && (
                      <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                        Ask a question about your campaign report, or select a suggested prompt on the left to get started.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Chat Input at bottom of left column */}
              <div className="shrink-0 border-t border-border bg-white px-8 py-4">
                <div className="relative">
                  <textarea
                    placeholder="Ask anything about this campaign"
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 pr-12 text-sm leading-5 placeholder:text-muted-foreground transition-all duration-300 focus:border-[#212be9] focus:outline-none focus:ring-2 focus:ring-[#212be9]/20 focus:shadow-[0_0_20px_rgba(33,43,233,0.08)]"
                  />
                  <button
                    onClick={() => submitPrompt(inputValue)}
                    disabled={!inputValue.trim() || isResponding}
                    className={`btn-press absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:bg-[#212be9] hover:text-white hover:border-[#212be9] hover:shadow-lg hover:shadow-[#212be9]/25 disabled:opacity-40 disabled:hover:shadow-none ${inputValue.trim() && !isResponding ? "bg-[#212be9] text-white border-[#212be9] shadow-md shadow-[#212be9]/20" : "bg-white"}`}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Prompts Panel (separated by vertical border) */}
            {promptsPanelOpen ? (
              <div className="flex w-[300px] shrink-0 flex-col border-l border-border bg-white animate-slide-in-right">
                {/* Tabs + Collapse */}
                <div className="flex items-center justify-between border-b border-border px-4 pt-3">
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => setPromptTab("default")}
                      className={`px-3 pb-2.5 text-sm transition-all duration-200 ${promptTab === "default" ? "border-b-2 border-[#171417] font-medium text-[#171417]" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => setPromptTab("saved")}
                      className={`flex items-center gap-1.5 px-3 pb-2.5 text-sm transition-all duration-200 ${promptTab === "saved" ? "border-b-2 border-[#171417] font-medium text-[#171417]" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Saved
                      {savedPrompts.size > 0 && (
                        <span className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors duration-200 ${promptTab === "saved" ? "bg-[#555] text-white" : "bg-gray-200 text-gray-600"}`}>
                          {savedPrompts.size}
                        </span>
                      )}
                    </button>
                  </div>
                  <button onClick={() => setPromptsPanelOpen(false)} title="Collapse panel" className="btn-press mb-2 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200 hover:scale-110">
                    <PanelRightClose className="size-4" />
                  </button>
                </div>

                {/* Prompts heading */}
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#171417]">
                  <Lightbulb className="size-4" />
                  Suggested Prompts
                </div>

                {/* Prompts list */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="flex flex-col gap-2">
                    {promptTab === "saved" && savedPrompts.size === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">
                        No saved prompts yet. Click the bookmark icon on any prompt to save it.
                      </p>
                    )}
                    {(promptTab === "default"
                      ? suggestedPrompts
                      : [...savedPrompts]
                    ).map((prompt, i) => (
                      <div key={i} className="animate-prompt-cascade group flex items-start gap-2 rounded-lg border border-border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#212be9]/30 hover:shadow-md" style={{ animationDelay: `${i * 40}ms` }}>
                        <button onClick={() => handlePromptClick(prompt)} className="btn-press flex min-w-0 flex-1 items-start gap-2.5 text-left">
                          <svg className="mt-0.5 size-3.5 shrink-0 text-muted-foreground group-hover:text-[#212be9] transition-colors" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M4.5 8L7 10.5L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-xs leading-4 text-[#171417] group-hover:text-[#212be9] transition-colors">{prompt}</span>
                        </button>
                        <button onClick={() => toggleSavePrompt(prompt)} title={savedPrompts.has(prompt) ? "Unsave" : "Save"} className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-[#555]">
                          <Bookmark className={`size-3.5 transition-all ${savedPrompts.has(prompt) ? "fill-[#555] text-[#555]" : "fill-none"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 items-start border-l border-border bg-white p-2">
                <button onClick={() => setPromptsPanelOpen(true)} title="Open prompts panel" className="btn-press flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 transition-all duration-200 hover:scale-110">
                  <PanelRightOpen className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        )}
          </>
        )}
      </div>
      )}
    </div>
    </TooltipProvider>
  );
}

export default function CampaignDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center bg-background font-sans text-sm text-muted-foreground">
          Loading campaign…
        </div>
      }
    >
      <CampaignDetailPageContent />
    </Suspense>
  );
}
