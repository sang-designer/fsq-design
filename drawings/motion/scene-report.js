const { seg, lerp, eo, eio, clamp01 } = kit;
// Sheet 1, the campaign report page. Camera keys are in stage-sheet units (content sits 100 right of the sheet's left edge).
kit.scene('report', {
  init(kit) {
    this.S = W.build(kit, 'report', (D) => {
      const { at, mk, tx, dimH, dimV, callout, rad, nb, rr, slotLabel, title, xbox, detailRef, brk, table, notes, grid, A, HAT } = D;
      D.cam([{ t: 0, cx: 900, cy: 236, z: 3.3 }, { t: 2.3, cx: 908, cy: 240, z: 3.12 },
        { t: 4.2, cx: 1100, cy: 372, z: 1.62 }, { t: 5.2, cx: 1102, cy: 376, z: 1.59 },
        { t: 6.4, cx: 760, cy: 600, z: 1.05 }, { t: 7.4, cx: 470, cy: 790, z: 1.5 }, { t: 7.9, cx: 472, cy: 792, z: 1.48 },
        { t: 9.4, cx: 950, cy: 530, z: 0.998 }, { t: 13, cx: 950, cy: 530, z: 0.988 }]);
      const k = .42, { X, Y, r, ln } = D.plan(650, 150, k);
      /* ---- 1 · close-up: frame, masthead, KPI cards ---- */
      at(-1.3, 0, 2.6); { const x0 = X(0), y0 = Y(0), w = 1440 * k, h = 900 * k; mk('path', { d: 'M' + x0 + ',' + (y0 + h * .6) + ' V' + y0 + ' H' + (x0 + w) + ' V' + (y0 + h) + ' H' + x0 + ' Z', class: 'obj' }); }
      at(-0.9, .15, .9); ln(0, 56, 1440, 56); ln(0, 100, 1440, 100); ln(48, 100, 48, 900);
      at(-0.3, .2, .5); r(48, 14, 169, 28, 2, 'slot', 'Logo · hug'); r(16, 68, 483, 20, 2, 'slot', 'Breadcrumb slot · flex', 'l'); r(8, 112, 31, 28, 8, 'hug');
      at(0.55, .1, .5); r(80, 124, 328, 28, 2, 'slot', 'Title slot · flex', 'l');
      at(0.75, .09, .6); for (let i = 0; i < 7; i++) r(80 + i * 184, 172, 172, 78, 10, 'well');
      at(1.05, .05, .45); for (let i = 0; i < 7; i++) { r(93 + i * 184, 185, 90, 16, 2, 'slot'); r(93 + i * 184, 213, 120, 24, 2, 'slot'); }
      at(1.45, .1, .5); r(80, 274, 59, 16, 2, 'slot'); [[147, 228], [383, 289], [680, 166]].forEach(([x, w]) => r(x, 266, w, 32, 16, 'hug'));
      const ty = Y(-28);
      at(1.6, .07, .45); dimH(X(0), X(48), ty, Y(0), Y(14), 'S1'); dimH(X(48), X(217), ty, null, Y(14), 'HUG', { c: 'dts' });
      at(1.85, .08, .45); const lx = X(-40); dimV(Y(0), Y(56), lx, X(0), X(0), 'H1', { side: 'l' }); dimV(Y(56), Y(100), lx, null, X(0), 'H2', { side: 'l' }); dimV(Y(100), Y(322), lx, null, X(0), 'H6', { side: 'l' });
      /* ---- 2 · pull back: the rest of the plan ---- */
      at(2.3, .06, .45); [1131, 1183, 1235, 1287].forEach(x => r(x, 10, 36, 36, 8, 'hug')); ln(1339, 10, 1339, 46); r(1356, 10, 36, 36, 8, 'hug');
      at(2.5, .07, .45); r(1185, 62, 32, 32, 8, 'hug'); r(1225, 62, 32, 32, 8, 'hug'); r(1269, 62, 155, 32, 8, 'hug', 'Primary'); r(1380, 124, 28, 28, 8, 'hug');
      at(2.6, .12, .7); ln(48, 322, 1440, 322, 'ph'); ln(1140, 322, 1140, 900); ln(48, 795, 1140, 795); ln(0, 855, 48, 855, 'ph');
      at(2.85, .1, .5); r(80, 347, 1028, 256, 2, 'slot', 'Report content slot · fill');
      at(3.0, .08, .55); r(80, 812, 1028, 66, 10, 'hug'); r(96, 824, 940, 20, 2, 'slot', 'Composer slot · fill', 'l'); mk('circle', { cx: X(1080), cy: Y(856), r: 16 * k, class: 'obj' }); r(6, 864, 35, 28, 8, 'hug');
      at(3.1, .06, .5); ln(1141, 372, 1440, 372); mk('line', { x1: X(1157), y1: Y(370), x2: X(1229), y2: Y(370), class: 'cut' }); r(1157, 384, 252, 20, 2, 'slot');
      [[416, 58], [482, 122], [612, 154], [774, 82]].forEach(([y, h]) => r(1157, y, 252, h, 10, 'well')); slotLabel(X(1157), Y(530), 252 * k, 30, 'Prompt cards', '');
      at(3.35, .05, .4); dimH(X(217), X(1131), ty, null, null, 'FLEX', { c: 'dts' }); dimH(X(1131), X(1392), ty, null, Y(10), 'HUG · SEE DETAIL E', { c: 'dts' }); dimH(X(1392), X(1440), ty, null, Y(0), 'S1');
      const by = Y(930);
      at(3.55, .04, .4); dimH(X(0), X(48), by, Y(900), Y(900), 'WR', { below: true }); dimH(X(48), X(80), by, null, Y(878), 'S3', { below: true }); dimH(X(80), X(1108), by, null, Y(878), 'FLEX', { below: true, c: 'dts' }); dimH(X(1108), X(1140), by, Y(878), null, 'S3', { below: true }); dimH(X(1140), X(1440), by, Y(900), Y(900), 'WP', { below: true });
      at(3.8, .05, .45); dimH(X(0), X(1440), Y(968), Y(944), Y(944), 'W  (REF 1440)', { below: true });
      at(3.9, .06, .45); dimV(Y(322), Y(900), lx, null, X(0), 'FLEX', { side: 'l', c: 'dts' }); dimV(Y(0), Y(900), X(-112), X(-44), X(-44), '(REF 900)');
      at(4.0, .06, .4); const rx = X(1440) + 18; dimV(Y(322), Y(372), rx, X(1440), X(1440), 'H11', { side: 'r' }); dimV(Y(372), Y(416), rx, null, X(1409), 'H12', { side: 'r' });
      at(4.15, .05, .35); nb(X(700), Y(28), 1); nb(X(36), Y(500), 2); nb(X(1180), Y(220), 3); nb(X(1340), Y(138), 4); nb(X(870), Y(282), 6); nb(X(560), Y(770), 7); nb(X(1290), Y(700), 8);
      at(4.35, .06, .45); detailRef(X(166), Y(211), 26, 'DETAIL A', X(300), Y(420)); detailRef(X(244), Y(137), 22, 'DETAIL B', X(480), Y(150)); detailRef(X(265), Y(282), 22, 'DETAIL C', X(560), Y(420)); detailRef(X(1070), Y(845), 24, 'DETAIL D', X(940), Y(735)); detailRef(X(1262), Y(28), 26, 'DETAIL E', X(1000), Y(30));
      at(4.6, .1, .5); title(X(720), Y(968) + 34, 'Plan view · campaign report', 'Scale 0.42:1 · reference 1440 × 900 · KPI expanded');
      /* ---- 3 · layers lift into the exploded view ---- */
      const { P, G, lift } = D.iso(.12, 320, 918), gap = 50;
      at(5.0, .14, .8); rr(0, 0, 1440, 900, 0, 'thin', G(0)); { const g = G(gap); rr(0, 0, 1440, 56, 0, 'obj', g); rr(0, 56, 1440, 44, 0, 'obj', g); } rr(0, 100, 48, 800, 0, 'hug', G(gap * 2));
      lift(gap * 3, 5.25, g => { rr(48, 100, 1392, 222, 0, 'obj', g); for (let i = 0; i < 7; i++) rr(80 + i * 184, 172, 172, 78, 10, 'well', g); [[147, 228], [383, 289], [680, 166]].forEach(([x, w]) => rr(x, 266, w, 32, 16, 'hug', g)); });
      lift(gap * 4, 5.4, g => { rr(48, 322, 1092, 578, 0, 'obj', g); rr(80, 347, 1028, 256, 2, 'slot', g); rr(80, 812, 1028, 66, 10, 'hug', g); });
      lift(gap * 5, 5.55, g => { rr(1140, 322, 300, 578, 0, 'obj', g); [[416, 58], [482, 122], [612, 154], [774, 82]].forEach(([y, h]) => rr(1157, y, 252, h, 10, 'well', g)); });
      at(6.7, 0, .6); { const g = G(gap * 6); const e = rr(1000, 60, 420, 460, 12, 'hs', g); e.setAttribute('fill', HAT); rr(1000, 60, 420, 460, 12, 'thin', g); }
      at(6.95, .025, .45); const LX = 236;
      [[[0, 900], 'L0 · Viewport', '1440 × 900 ref'], [[0, 100], 'L1 · Chrome', 'Masthead H1 · bar H2'], [[0, 900], 'L2 · Rail', 'WR · fixed'], [[48, 322], 'L3 · KPI section', 'H6 · collapsible'], [[48, 900], 'L4 · Report', 'Content · composer'], [[1140, 900], 'L5 · Prompt panel', 'WP · own scroll'], [[1000, 520], 'L6 · Overlays', 'Signals popover · drawer']].forEach(([[x, y], t, st], i) => {
        const z = gap * i, p1 = P(x, y, z), ly = P(0, 900, z)[1]; mk('circle', { cx: p1[0], cy: p1[1], r: 1.8, class: 'dot' }); mk('polyline', { points: p1[0] + ',' + p1[1] + ' ' + (LX + 12) + ',' + ly + ' ' + LX + ',' + ly, class: 'lead' });
        tx(LX - 4, ly - 2, t, 'vt', { 'text-anchor': 'end' }); tx(LX - 4, ly + 11, st, 'dts', { 'text-anchor': 'end' }); });
      at(7.55, .1, .5); title(300, 1012, 'Exploded view', 'Axonometric · z gaps not to scale');
      /* ---- 4 · out to the whole sheet ---- */
      at(7.85, 0, 1.6); D.border();
      at(8.5, .04, .4); notes([[1, 'MASTHEAD AND BAR ARE FIXED HEIGHT. BODY FILLS 100VH.'], [2, 'RAIL WR AND PANEL WP ARE FIXED. REPORT FLEXES.'], [3, 'KPI CARDS ARE FIXED WK. ROW HUGS, LEFT-ALIGNED.'], [4, 'COLLAPSE REMOVES CARDS AND SIGNAL CHIPS TOGETHER.'], [5, 'COLLAPSED HEADER H7 = 2·S5 + H3. SEE DETAIL B.'], [6, 'SIGNAL CHIPS HUG. STRIP HIDES WHEN NO SIGNALS.'], [7, 'COMPOSER PINS TO THE BOTTOM OF THE REPORT.'], [8, 'PROMPT PANEL SCROLLS ON ITS OWN. TABS STAY.'], [0, 'NARROW WIDTHS AND CARD WRAP [TBD].']]);
      { const s = .25, gx = 60, gy = 326; at(8.75, .03, .4);
        const end = grid(gx, gy, s, [[48, 'WR', 'hat'], [32, '', ''], [1028, 'Report · flex', ''], [32, '', ''], [300, 'Panel · WP', 'hat']]);
        let x = gx; [[48, 'WR'], [32, 'S3'], [1028, 'FLEX'], [32, 'S3'], [300, 'WP']].forEach(([w, l], i) => { dimH(x, x + w * s, gy + 52, gy + 30, gy + 30, l, { below: true, c: l === 'FLEX' ? 'dts' : 'dt', dx: i === 0 ? -12 : i === 1 ? 8 : i === 3 ? 6 : 0 }); x += w * s; });
        dimH(gx, end, gy - 16, gy, gy, 'W · FILL VIEWPORT', { c: 'dts' });
        const ky = gy + 96; let kx = gx + 80 * s; for (let i = 0; i < 7; i++) { rr(kx, ky, 172 * s, 20, 2, 'hug'); kx += 184 * s; }
        rr(gx + 48 * s, ky - 8, 1392 * s, 36, 0, 'ph');
        dimH(gx + 80 * s, gx + 252 * s, ky + 40, ky + 20, ky + 20, 'WK', { below: true }); dimH(gx + 252 * s, gx + 264 * s, ky + 40, ky + 20, ky + 20, 'S7', { below: true, dx: 8 });
        dimH(gx + (80 + 7 * 172 + 6 * 12) * s, gx + 1408 * s, ky + 40, ky + 20, null, 'HUG REMAINDER', { below: true, c: 'dts' });
        nb(gx + 1408 * s + 12, ky + 10, 3); nb(end + 12, gy + 15, 2); title(gx + 180, ky + 74, 'Column grid', 'Scale 0.25:1 · W = 1440 ref'); }
      at(8.9, .003, .25); { let y = table(1390, 86, 'Spacing', [['S1', 'page-pad-x', '48'], ['S3', 'section-pad-x', '32'], ['S4', 'section-pad-y', '24'], ['S5', 'collapsed-pad-y', '8'], ['S6', 'title-gap', '20'], ['S7', 'kpi-gap', '12'], ['S8', 'strip-gap', '16'], ['S9', 'chip-gap', '8'], ['S10', 'card-pad', '12'], ['S11', 'card-stack', '4'], ['S12', 'icon-gap', '16'], ['S14', 'composer-pad-y', '16'], ['S17', 'chip-pad-x', '12'], ['S18', 'send-inset', '12'], ['S19', 'composer-pad-r', '48']]);
        y = table(1390, y, 'Size', [['H1', 'masthead-h', '56'], ['H2', 'bar-h', '44'], ['H3', 'title-h', '28'], ['H8', 'kpi-line', '24'], ['H4', 'kpi-card', '2S10+2H8+S11+2B = 78'], ['H5', 'chip-h', '32'], ['H6', 'kpi-section', '2S4+H3+S6+H4+S8+H5 = 222'], ['H7', 'kpi-collapsed', '2S5+H3 = 44'], ['H9', 'composer-zone', '106 REF'], ['H10', 'composer-h', '66'], ['H11', 'panel-tabs', '49 REF'], ['H12', 'panel-sub', '44 REF'], ['Z1', 'mast-btn', '36'], ['Z3', 'info-btn', '24'], ['Z4', 'send-btn', '32'], ['I1', 'icon', '16'], ['B', 'border', '1']]);
        y = table(1390, y, 'Width', [['W', 'page-w', 'FILL · 1440 REF'], ['WR', 'rail-w', '48'], ['WP', 'panel-w', '300'], ['WK', 'kpi-w', '172 · FIXED']]);
        table(1390, y, 'Radius', [['R1', 'r-card', '10'], ['R2', 'r-control', '8'], ['R3', 'r-info', '6'], ['R4', 'r-pill', 'h ÷ 2']]); }
      { const q = .8, BX = 600, BY = 684, w = 190, Yb = v => BY + v * q; at(9.1, .03, .4);
        rr(BX, Yb(0), w, 222 * q, 0, 'obj'); brk(BX + w, Yb(0), Yb(222));
        rr(BX + 32 * q, Yb(24), 150, 28 * q, 2, 'slot'); slotLabel(BX + 32 * q, Yb(24), 150, 28 * q, 'Title slot', 'l');
        rr(BX + 32 * q, Yb(72), 172 * q, 78 * q, 10 * q, 'well'); slotLabel(BX + 32 * q, Yb(72), 172 * q, 78 * q, 'KPI card');
        rr(BX + 32 * q, Yb(166), 120, 32 * q, 16 * q, 'hug'); slotLabel(BX + 32 * q, Yb(166), 120, 32 * q, 'Signal chip');
        [[0, 24, 'S4'], [24, 52, 'H3'], [52, 72, 'S6'], [72, 150, 'H4'], [150, 166, 'S8'], [166, 198, 'H5'], [198, 222, 'S4']].forEach(([a, b, l]) => dimV(Yb(a), Yb(b), BX + w + 22, BX + w - 2, BX + w - 2, l, { side: 'r' }));
        dimV(Yb(0), Yb(222), BX - 14, BX, BX, 'H6'); dimH(BX, BX + 32 * q, Yb(0) - 12, Yb(0), Yb(24), 'S3', { dx: -6 }); nb(BX + w - 20, Yb(110), 4);
        const CX = BX + 290; rr(CX, Yb(0), w, 44 * q, 0, 'obj'); brk(CX + w, Yb(0), Yb(44));
        rr(CX + 32 * q, Yb(8), 150, 28 * q, 2, 'slot'); slotLabel(CX + 32 * q, Yb(8), 150, 28 * q, 'Title slot', 'l');
        [[0, 8, 'S5'], [8, 36, 'H3'], [36, 44, 'S5']].forEach(([a, b, l]) => dimV(Yb(a), Yb(b), CX + w + 22, CX + w - 2, CX + w - 2, l, { side: 'r' }));
        dimV(Yb(0), Yb(44), CX - 14, CX, CX, 'H7', { side: 'l' }); nb(CX + w - 20, Yb(22), 5);
        tx(CX + w / 2, Yb(62), 'COLLAPSED', 'dts', { 'text-anchor': 'middle' }); tx(BX + w / 2, Yb(240), 'EXPANDED', 'dts', { 'text-anchor': 'middle' });
        title(BX + 250, Yb(262) + 4, 'Detail B · KPI section states', 'Scale 0.8:1 · H6 → H7 on collapse'); }
      { const q = 1.5, AX = 880, AY = 772, P2 = (x, y) => [AX + x * q, AY + y * q]; at(9.35, .03, .4);
        rr(AX, AY, 172 * q, 78 * q, 10 * q, 'obj');
        rr(P2(13, 13)[0], P2(13, 13)[1], 118 * q, 24 * q, 2, 'slot'); slotLabel(P2(13, 13)[0], P2(13, 13)[1], 118 * q, 24 * q, 'Label slot · flex', 'l');
        rr(P2(135, 13)[0], P2(135, 13)[1], 24 * q, 24 * q, 6 * q, 'hug'); xbox(P2(141, 19)[0], P2(141, 19)[1], 12 * q, 12 * q);
        rr(P2(13, 41)[0], P2(13, 41)[1], 146 * q, 24 * q, 2, 'slot'); slotLabel(P2(13, 41)[0], P2(13, 41)[1], 146 * q, 24 * q, 'Value slot · fill', 'l');
        [[1, 13, 'S10'], [13, 37, 'H8'], [37, 41, 'S11'], [41, 65, 'H8'], [65, 77, 'S10']].forEach(([a, b, l]) => dimV(AY + a * q, AY + b * q, AX + 172 * q + 16, AX + 172 * q, AX + 172 * q, l, { side: 'r' }));
        dimH(AX, AX + 172 * q, AY - 16, AY, AY, 'WK'); dimH(P2(135, 0)[0], P2(159, 0)[0], AY + 78 * q + 16, AY + 78 * q, AY + 78 * q, 'Z3', { below: true }); dimH(P2(159, 0)[0], P2(172, 0)[0], AY + 78 * q + 16, null, AY + 78 * q, 'S10', { below: true, dx: 12 });
        rad(AX, AY, 10 * q, 'tl', 'R1', 12); callout(P2(135, 13)[0] + 2, P2(135, 13)[1] + 2, P2(122, 0)[0], AY - 30, 'R3', -1);
        title(AX + 129, AY + 78 * q + 56, 'Detail A · KPI card', 'Scale 1.5:1 · H4 = 2·S10 + 2·H8 + S11 + 2·B'); }
      { const CX = 620, CY = 966; at(9.6, .04, .4);
        rr(CX, CY, 200, 32, 16, 'hug'); mk('circle', { cx: CX + 16, cy: CY + 16, r: 4, class: 'obj' });
        rr(CX + 28, CY + 8, 100, 16, 2, 'slot'); slotLabel(CX + 28, CY + 8, 100, 16, 'Label · flex', 'l'); rr(CX + 152, CY + 8, 36, 16, 2, 'slot'); slotLabel(CX + 152, CY + 8, 36, 16, 'Δ');
        dimH(CX, CX + 12, CY - 14, CY + 12, null, 'S17', { dx: -8 }); dimH(CX + 20, CX + 28, CY - 14, null, CY + 8, 'S9', { dx: 6 }); dimH(CX + 188, CX + 200, CY - 14, null, CY + 12, 'S17', { dx: 8 });
        dimV(CY, CY + 32, CX + 216, CX + 200, CX + 200, 'H5', { side: 'r' }); callout(CX + 20, CY + 29, CX - 10, CY + 50, 'R4', -1);
        tx(CX + 100, CY + 50, 'DETAIL C · SIGNAL CHIP', 'vt', { 'text-anchor': 'middle' }); tx(CX + 100, CY + 63, 'SCALE 1:1 · HUG', 'dts', { 'text-anchor': 'middle' }); nb(CX + 226, CY - 10, 6); }
      { const DX = 1176, DY = 678, w = 140; at(9.8, .035, .4);
        mk('line', { x1: DX - 20, y1: DY, x2: DX + w + 20, y2: DY, class: 'thin' });
        rr(DX, DY + 16, w, 66, 10, 'hug'); brk(DX, DY + 16, DY + 82);
        rr(DX + 20, DY + 28, w - 68, 20, 2, 'slot'); slotLabel(DX + 20, DY + 28, w - 68, 20, 'Input slot · flex', 'l');
        mk('circle', { cx: DX + w - 28, cy: DY + 60, r: 16, class: 'obj' }); xbox(DX + w - 34, DY + 54, 12, 12);
        dimV(DY, DY + 16, DX + w + 20, DX + w + 2, DX + w + 2, 'S14', { side: 'r' }); dimV(DY + 16, DY + 82, DX + w + 20, null, DX + w + 2, 'H10', { side: 'r' }); dimV(DY + 82, DY + 98, DX + w + 20, null, DX + w + 2, 'S14', { side: 'r' });
        dimH(DX + w - 44, DX + w - 12, DY + 112, DY + 76, DY + 76, 'Z4', { below: true }); dimH(DX + w - 12, DX + w, DY + 112, DY + 60, DY + 82, 'S18', { below: true, dx: 10 });
        dimH(DX + w - 48, DX + w, DY + 4, DY + 16, DY + 16, 'S19', { dy: -2 }); nb(DX - 12, DY + 60, 7);
        title(DX + w / 2 + 30, DY + 160, 'Detail D · composer', 'Scale 1:1 · R1 · pinned bottom'); }
      { const m2 = .65, EX = 1172, EY = 914; at(10.0, .03, .4);
        [0, 52, 104, 156, 225].forEach(x => { rr(EX + x * m2, EY, 36 * m2, 36 * m2, 8 * m2, 'hug'); xbox(EX + (x + 10) * m2, EY + 10 * m2, 16 * m2, 16 * m2); });
        mk('line', { x1: EX + 208 * m2, y1: EY - 4, x2: EX + 208 * m2, y2: EY + 36 * m2 + 4, class: 'thin' });
        dimH(EX, EX + 36 * m2, EY - 12, EY, EY, 'Z1', { dx: -4 }); dimH(EX + 36 * m2, EX + 52 * m2, EY - 12, null, EY, 'S12', { dx: 4, dy: -10 }); dimH(EX + 208 * m2, EX + 225 * m2, EY - 12, EY - 4, EY, 'S12', { dy: -10 });
        dimH(EX + 261 * m2, EX + 292 * m2, EY + 36 * m2 + 14, EY + 36 * m2, null, 'S1', { below: true, dx: 6 });
        mk('line', { x1: EX + 292 * m2, y1: EY - 8, x2: EX + 292 * m2, y2: EY + 40, class: 'ph' }); rad(EX + 261 * m2, EY + 36 * m2, 8 * m2, 'br', 'R2', 10);
        title(EX + 100, EY + 68, 'Detail E · masthead actions', 'Scale 0.65:1 · I1 centered in Z1'); }
    });
  },
  render(t, kit) { W.paint(this.S, t, kit); },
});
