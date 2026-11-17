const { seg, lerp, eo, eio, clamp01 } = kit;
// Sheet 2, the campaign setup page. Same sheet tools as the report; opens on the step nav and title bar.
kit.scene('setup', {
  init(kit) {
    this.S = W.build(kit, 'setup', (D) => {
      const { at, mk, tx, dimH, dimV, callout, rad, nb, rr, slotLabel, title, xbox, detailRef, brk, table, notes, grid, HAT } = D;
      D.cam([{ t: 0, cx: 870, cy: 222, z: 3.2 }, { t: 2.3, cx: 878, cy: 226, z: 3.04 },
        { t: 4.2, cx: 1100, cy: 372, z: 1.62 }, { t: 5.2, cx: 1102, cy: 376, z: 1.59 },
        { t: 6.4, cx: 760, cy: 600, z: 1.05 }, { t: 7.4, cx: 470, cy: 800, z: 1.55 }, { t: 7.9, cx: 472, cy: 802, z: 1.53 },
        { t: 9.4, cx: 950, cy: 530, z: 0.998 }, { t: 13, cx: 950, cy: 530, z: 0.988 }]);
      const k = .42, { X, Y, r, ln } = D.plan(650, 150, k);
      /* ---- 1 · close-up: frame, header, title bar, step nav ---- */
      at(-1.3, 0, 2.6); { const x0 = X(0), y0 = Y(0), w = 1440 * k, h = 900 * k; mk('path', { d: 'M' + x0 + ',' + (y0 + h * .6) + ' V' + y0 + ' H' + (x0 + w) + ' V' + (y0 + h) + ' H' + x0 + ' Z', class: 'obj' }); }
      at(-0.9, .15, .9); ln(0, 56, 1440, 56); ln(0, 110, 1440, 110); rr(X(0), Y(108), 1440 * k, 2 * k + 1, 0, 'hug');
      at(-0.3, .15, .5); r(48, 14, 166, 28, 2, 'slot', 'Logo · hug'); [[278, 105], [383, 166], [549, 73]].forEach(([x, w]) => r(x, 17, w, 22, 2, 'slot'));
      at(0.25, .1, .5); mk('line', { x1: X(278), y1: Y(55), x2: X(383), y2: Y(55), class: 'cut' }); rr(X(0), Y(108), 120 * k, 2 * k + 1, 0, 'ink');
      at(0.45, .1, .5); r(48, 66, 56, 32, 2, 'slot'); r(116, 72, 32, 21, 10, 'hug');
      at(0.7, .12, .55); for (let i = 0; i < 5; i++) r(48, 134 + 44 * i, 280, 36, 8, i ? 'thin' : 'well');
      at(1.05, .06, .45); for (let i = 0; i < 5; i++) { r(68, 142 + 44 * i, 200, 20, 2, 'slot'); mk('circle', { cx: X(304), cy: Y(152 + 44 * i), r: 8 * k, class: 'thin' }); }
      const ty = Y(-28);
      at(1.5, .07, .45); dimH(X(0), X(48), ty, Y(0), Y(14), 'S1'); dimH(X(48), X(214), ty, null, Y(14), 'HUG', { c: 'dts' }); dimH(X(214), X(278), ty, null, Y(17), 'S4');
      at(1.8, .08, .45); const lx = X(-40); dimV(Y(0), Y(56), lx, X(0), X(0), 'H1', { side: 'l' }); dimV(Y(56), Y(108), lx, null, X(0), 'H2', { side: 'l' }); callout(X(10), Y(109), X(-60), Y(150), 'HP', -1);
      /* ---- 2 · pull back: the rest of the plan ---- */
      at(2.3, .07, .45); r(1222, 68, 69, 28, 8, 'hug'); r(1307, 68, 85, 28, 8, 'hug');
      at(2.45, .08, .5); r(48, 394, 140, 24, 2, 'slot'); r(48, 434, 280, 58, 10, 'slot', 'Drop · fill'); r(48, 500, 280, 16, 2, 'slot');
      at(2.6, .1, .5); r(352, 134, 1040, 28, 2, 'slot', 'Section title slot · fill', 'l'); r(352, 166, 1040, 40, 2, 'slot', 'Description slot · fill', 'l');
      at(2.85, .07, .5); r(352, 230, 560, 20, 2, 'slot'); r(352, 256, 476, 36, 8, 'hug'); r(840, 256, 72, 36, 8, 'hug');
      at(3.05, .06, .5); [352, 707, 1061].forEach(x => { r(x, 316, 331, 20, 2, 'slot'); r(x, 342, 331, 36, 8, 'hug'); });
      at(3.25, .08, .5); ln(352, 402, 1392, 402); r(352, 427, 200, 20, 2, 'slot'); r(352, 463, 1040, 80, 10, 'slot', 'Upload drop zone · fill'); r(352, 559, 300, 20, 2, 'slot');
      at(3.45, .08, .5); r(352, 619, 280, 20, 2, 'slot'); r(352, 655, 234, 38, 8, 'hug', 'Secondary · hug');
      at(3.6, .08, .5); ln(352, 804, 1392, 804, 'ph'); r(352, 820, 60, 38, 8, 'thin', 'Back'); r(1169, 821, 223, 36, 8, 'hug', 'Primary · hug');
      at(3.5, .05, .4); dimH(X(278), X(622), ty, null, Y(17), 'TABS · HUG', { c: 'dts' }); dimH(X(622), X(1392), ty, null, null, 'FLEX', { c: 'dts' }); dimH(X(1392), X(1440), ty, null, Y(0), 'S1');
      const by = Y(930);
      at(3.7, .04, .4); dimH(X(0), X(48), by, Y(900), Y(900), 'S1', { below: true }); dimH(X(48), X(328), by, Y(516), Y(516), 'WS', { below: true }); dimH(X(328), X(352), by, null, null, 'S3', { below: true }); dimH(X(352), X(1392), by, Y(858), Y(858), 'FLEX', { below: true, c: 'dts' }); dimH(X(1392), X(1440), by, null, Y(900), 'S1', { below: true });
      at(3.9, .05, .45); dimH(X(0), X(1440), Y(968), Y(944), Y(944), 'W  (REF 1440)', { below: true });
      at(4.0, .06, .45); dimV(Y(110), Y(900), lx, null, X(0), 'FLEX', { side: 'l', c: 'dts' }); dimV(Y(0), Y(900), X(-112), X(-44), X(-44), '(REF 900)'); dimV(Y(110), Y(134), X(1440) + 18, X(1440), X(1392), 'S2', { side: 'r' });
      at(4.15, .05, .35); nb(X(1000), Y(28), 1); nb(X(170), Y(82), 2); nb(X(310), Y(170), 4); nb(X(1240), Y(326), 5); nb(X(1300), Y(402), 6); nb(X(440), Y(840), 7); nb(X(760), Y(840), 8);
      at(4.35, .06, .45); detailRef(X(188), Y(152), 30, 'DETAIL A', X(680), Y(40)); detailRef(X(840), Y(274), 26, 'DETAIL B', X(1000), Y(210)); detailRef(X(1300), Y(82), 24, 'DETAIL C', X(1180), Y(170)); detailRef(X(352), Y(503), 24, 'DETAIL D', X(240), Y(600)); detailRef(X(1300), Y(840), 24, 'DETAIL E', X(1120), Y(760));
      at(4.6, .1, .5); title(X(720), Y(968) + 34, 'Plan view · campaign setup', 'Scale 0.42:1 · reference 1440 × 900 · step 1 with manual form');
      /* ---- 3 · layers lift ---- */
      const { P, G, lift } = D.iso(.12, 320, 918), gap = 64;
      at(5.0, .14, .8); rr(0, 0, 1440, 900, 0, 'thin', G(0)); { const g = G(gap); rr(0, 0, 1440, 56, 0, 'obj', g); rr(0, 56, 1440, 52, 0, 'obj', g); rr(0, 108, 1440, 2, 0, 'hug', g); }
      lift(gap * 2, 5.25, g => { rr(48, 134, 280, 382, 0, 'thin', g); for (let i = 0; i < 5; i++) rr(48, 134 + 44 * i, 280, 36, 8, i ? 'thin' : 'well', g); rr(48, 434, 280, 58, 10, 'slot', g); });
      lift(gap * 3, 5.4, g => { rr(352, 134, 1040, 670, 0, 'obj', g); rr(352, 256, 476, 36, 8, 'hug', g); [352, 707, 1061].forEach(x => rr(x, 342, 331, 36, 8, 'hug', g)); rr(352, 463, 1040, 80, 10, 'slot', g); });
      lift(gap * 4, 5.55, g => { rr(352, 804, 1040, 70, 0, 'thin', g); rr(352, 820, 60, 38, 8, 'thin', g); rr(1169, 821, 223, 36, 8, 'hug', g); });
      at(6.95, .03, .45); const LX = 236;
      [[[0, 900], 'L0 · Viewport', '1440 × 900 ref'], [[0, 110], 'L1 · Chrome', 'Header · title bar · HP'], [[48, 516], 'L2 · Step nav', 'WS · attachments'], [[352, 804], 'L3 · Step content', 'Fields · drop zone'], [[352, 874], 'L4 · Footer', 'Back · continue']].forEach(([[x, y], t, st], i) => {
        const z = gap * i, p1 = P(x, y, z), ly = P(0, 900, z)[1]; mk('circle', { cx: p1[0], cy: p1[1], r: 1.8, class: 'dot' }); mk('polyline', { points: p1[0] + ',' + p1[1] + ' ' + (LX + 12) + ',' + ly + ' ' + LX + ',' + ly, class: 'lead' });
        tx(LX - 4, ly - 2, t, 'vt', { 'text-anchor': 'end' }); tx(LX - 4, ly + 11, st, 'dts', { 'text-anchor': 'end' }); });
      at(7.55, .1, .5); title(300, 1012, 'Exploded view', 'Axonometric · z gaps not to scale');
      /* ---- 4 · out to the whole sheet ---- */
      at(7.85, 0, 1.6); D.border();
      at(8.5, .04, .4); notes([[1, 'HEADER CARRIES PRODUCT NAV. NO MASTHEAD ICONS.'], [2, 'TITLE BAR HUGS. PROGRESS LINE HP SITS UNDER IT.'], [3, 'STEP NAV WS IS FIXED. MAIN FLEXES.'], [4, 'ONE ACTIVE STEP. TRAILING GLYPH SHOWS STATE.'], [5, 'FIELD ROW SPLITS 3 EQUAL FLEX COLUMNS, GAP S16.'], [6, 'BLOCKS SPLIT BY A 1 PX RULE, S17 EACH SIDE.'], [7, 'BACK IS H5 + 2·B = 38. CONTINUE IS H5 = 36. VERIFY.'], [8, 'FOOTER: BACK START, CONTINUE END, FLEX BETWEEN.'], [0, 'SUB-STEPS (MAP PARTNERS, TAXONOMIES) REUSE THIS FRAME.']]);
      { const s = .25, gx = 60, gy = 326; at(8.75, .03, .4);
        const end = grid(gx, gy, s, [[48, '', ''], [280, 'Steps · WS', 'hat'], [24, '', ''], [1040, 'Main · flex', ''], [48, '', '']]);
        let x = gx; [[48, 'S1'], [280, 'WS'], [24, 'S3'], [1040, 'FLEX'], [48, 'S1']].forEach(([w, l], i) => { dimH(x, x + w * s, gy + 52, gy + 30, gy + 30, l, { below: true, c: l === 'FLEX' ? 'dts' : 'dt', dx: i === 0 ? -8 : i === 2 ? 6 : i === 4 ? 8 : 0 }); x += w * s; });
        dimH(gx, end, gy - 16, gy, gy, 'W · FILL VIEWPORT', { c: 'dts' }); nb(end + 12, gy + 15, 3);
        const fy = gy + 112, fx = gx + 352 * s; rr(fx, fy, 560 * s, 20, 2, 'hug'); tx(fx + 70, fy + 14, 'WF', 'sl', { 'text-anchor': 'middle' });
        [0, 1, 2].forEach(i => rr(fx + i * 355 * s, fy + 34, 331 * s, 20, 2, 'hug'));
        dimH(fx, fx + 331 * s, fy + 76, fy + 54, fy + 54, 'FLEX', { below: true, c: 'dts' }); dimH(fx + 331 * s, fx + 355 * s, fy + 76, fy + 54, fy + 54, 'S16', { below: true, dx: 6 });
        dimH(fx, fx + 1040 * s, fy - 14, fy, null, 'MAIN', { c: 'dts' }); nb(fx + 1040 * s + 12, fy + 44, 5); title(gx + 180, fy + 114, 'Column grid', 'Scale 0.25:1 · W = 1440 ref'); }
      at(8.9, .003, .25); { let y = table(1390, 86, 'Spacing', [['S1', 'page-pad-x', '48'], ['S2', 'body-pad-y', '24'], ['S3', 'col-gap', '24'], ['S4', 'nav-gap', '64'], ['S6', 'title-pad-y', '10'], ['S7', 'action-gap', '16'], ['S8', 'step-gap', '8'], ['S9', 'step-pad-x', '16'], ['S10', 'step-pad-y', '8'], ['S11', 'glyph-gap', '10'], ['S14', 'label-gap', '6'], ['S15', 'control-gap', '12'], ['S16', 'field-row-gap', '24'], ['S17', 'rule-gap', '24'], ['S19', 'drop-label-gap', '16'], ['S20', 'footer-pad-y', '16'], ['S22', 'input-pad-x', '12'], ['S23', 'pill-gap', '12'], ['S24', 'label-inset', '4']]);
        y = table(1390, y, 'Size', [['H1', 'header-h', '56'], ['H13', 'title-line', '32'], ['H2', 'titlebar-h', '2S6+H13 = 52'], ['HP', 'progress-h', '2'], ['H9', 'line-h', '20'], ['H3', 'step-h', '2S10+H9 = 36'], ['H5', 'control-h', '36'], ['H6', 'back-h', 'H5+2B = 38'], ['H7', 'drop-h', '80'], ['I1', 'glyph', '16'], ['B', 'border', '1']]);
        y = table(1390, y, 'Width', [['W', 'page-w', 'FILL · 1440 REF'], ['WS', 'step-nav-w', '280'], ['WF', 'field-w', '560']]);
        table(1390, y, 'Radius', [['R1', 'r-control', '8'], ['R2', 'r-drop', '10'], ['R4', 'r-pill', 'h ÷ 2']]); }
      { const AX = 610, AY = 690, w = 280, h = 36; at(9.1, .03, .4);
        rr(AX, AY, w, h, 8, 'well'); rr(AX + 20, AY + 8, w - 62, 20, 2, 'slot'); slotLabel(AX + 20, AY + 8, w - 62, 20, 'Step label · flex', 'l'); rr(AX + w - 32, AY + 10, 16, 16, 0, 'thin');
        rr(AX, AY + h + 8, w, h, 8, 'thin'); rr(AX + 20, AY + h + 16, w - 62, 20, 2, 'slot');
        dimH(AX, AX + 16, AY - 14, AY, AY + 8, 'S9', { dx: -6 }); dimH(AX + 16, AX + 20, AY - 14, null, AY + 8, 'S24', { dx: 14, dy: -12 });
        dimH(AX + w - 42, AX + w - 32, AY - 14, AY + 8, AY + 10, 'S11', { dx: -14 }); dimH(AX + w - 32, AX + w - 16, AY - 14, null, AY + 10, 'I1', { dy: -12 }); dimH(AX + w - 16, AX + w, AY - 14, null, AY, 'S9', { dx: 8 });
        dimV(AY, AY + 8, AX + w + 16, AX + w, AX + w, 'S10', { side: 'r' }); dimV(AY + 8, AY + 28, AX + w + 16, null, AX + w, 'H9', { side: 'r' }); dimV(AY + 28, AY + h, AX + w + 16, null, AX + w, 'S10', { side: 'r' }); dimV(AY, AY + h, AX + w + 52, AX + w + 30, AX + w + 30, 'H3', { side: 'r' });
        dimV(AY + h, AY + h + 8, AX + w + 16, null, AX + w, 'S8', { side: 'r' }); dimH(AX, AX + w, AY + 2 * h + 24, AY + 2 * h + 8, AY + 2 * h + 8, 'WS', { below: true }); rad(AX, AY, 8, 'tl', 'R1', 12);
        const gy = AY + 2 * h + 68; [['TODO', 0], ['ACTIVE', 1], ['WORKING', 2], ['DONE', 3], ['ERROR', 4]].forEach(([l, n], i) => { const cx = AX + 30 + i * 76, cy = gy;
          if (n === 0) mk('circle', { cx: cx, cy: cy, r: 8, class: 'thin', style: 'stroke-dasharray:2 2' });
          if (n === 1) mk('circle', { cx: cx, cy: cy, r: 8, class: 'thin', style: 'stroke-dasharray:3 1.5' });
          if (n === 2) mk('path', { d: 'M' + (cx + 8) + ',' + cy + ' A8 8 0 1 1 ' + cx + ',' + (cy - 8), class: 'thin' });
          if (n === 3) mk('path', { d: 'M' + (cx - 7) + ',' + cy + ' l5,5 l9,-10', class: 'thin' });
          if (n === 4) { mk('circle', { cx: cx, cy: cy, r: 8, class: 'thin' }); mk('path', { d: 'M' + cx + ',' + (cy - 4) + ' v5 M' + cx + ',' + (cy + 3) + ' v1.5', class: 'thin' }); }
          tx(cx, cy + 22, l, 'dts', { 'text-anchor': 'middle' }); });
        nb(AX + w + 30, gy - 24, 4); title(AX + w / 2, gy + 50, 'Detail A · step row', 'Scale 1:1 · trailing glyph I1 by state'); }
      { const q = .6, BX = 1010, BY = 692, W2 = 560 * q; at(9.35, .03, .4);
        rr(BX, BY, W2, 20 * q, 2, 'slot'); slotLabel(BX, BY, W2, 20 * q, 'Label slot · hug', 'l');
        rr(BX, BY + 26 * q, 476 * q, 36 * q, 8 * q, 'obj'); rr(BX + 12 * q, BY + 34 * q, 300 * q, 20 * q, 2, 'slot'); slotLabel(BX + 12 * q, BY + 34 * q, 300 * q, 20 * q, 'Value slot', 'l');
        rr(BX + 488 * q, BY + 26 * q, 72 * q, 36 * q, 8 * q, 'hug'); slotLabel(BX + 488 * q, BY + 26 * q, 72 * q, 36 * q, 'Verify');
        dimV(BY, BY + 20 * q, BX - 14, BX, BX, ''); dimV(BY + 20 * q, BY + 26 * q, BX - 14, null, BX, 'S14', { side: 'l' }); dimV(BY + 26 * q, BY + 62 * q, BX - 14, null, BX, 'H5', { side: 'l' });
        const b = BY + 62 * q + 16; dimH(BX, BX + 12 * q, b, BY + 62 * q, BY + 54 * q, 'S22', { below: true, dx: -8 }); dimH(BX + 12 * q, BX + 476 * q, b, null, null, 'FLEX', { below: true, c: 'dts' }); dimH(BX + 476 * q, BX + 488 * q, b, BY + 62 * q, BY + 62 * q, 'S15', { below: true }); dimH(BX + 488 * q, BX + W2, b, null, BY + 62 * q, 'HUG', { below: true, c: 'dts' });
        dimH(BX, BX + W2, BY - 14, BY, BY, 'WF'); rad(BX + W2, BY + 26 * q, 8 * q, 'tr', 'R1', 12); title(BX + W2 / 2, BY + 62 * q + 60, 'Detail B · field + action', 'Scale 0.6:1 · label → control'); }
      { const CX = 1010, CY = 828; at(9.6, .03, .4);
        mk('line', { x1: CX - 10, y1: CY, x2: CX + 330, y2: CY, class: 'thin' }); mk('line', { x1: CX - 10, y1: CY + 52, x2: CX + 330, y2: CY + 52, class: 'thin' }); rr(CX - 10, CY + 52, 340, 2, 0, 'hug'); rr(CX - 10, CY + 52, 60, 2, 0, 'ink');
        rr(CX + 40, CY + 10, 56, 32, 2, 'slot'); slotLabel(CX + 40, CY + 10, 56, 32, 'Title'); rr(CX + 108, CY + 16, 32, 21, 10.5, 'hug');
        rr(CX + 178, CY + 12, 62, 28, 8, 'hug'); rr(CX + 256, CY + 12, 74, 28, 8, 'hug');
        dimV(CY, CY + 10, CX + 18, CX + 40, CX + 40, 'S6', { side: 'l' }); dimV(CY + 10, CY + 42, CX + 18, null, CX + 40, 'H13', { side: 'l' }); dimV(CY + 42, CY + 52, CX + 18, null, CX + 40, 'S6', { side: 'l' });
        dimV(CY + 52, CY + 54, CX + 346, CX + 330, CX + 330, 'HP', { side: 'r' });
        dimH(CX + 96, CX + 108, CY + 72, CY + 44, CY + 40, 'S23', { below: true }); dimH(CX + 240, CX + 256, CY + 72, CY + 42, CY + 42, 'S7', { below: true }); brk(CX + 150, CY + 10, CY + 42);
        title(CX + 170, CY + 100, 'Detail C · title bar', 'Scale 1:1 · H2 = 2·S6 + H13'); }
      { const q = .6, DX = 610, DY = 912; at(9.8, .04, .4);
        mk('line', { x1: DX, y1: DY, x2: DX + 300, y2: DY, class: 'thin' }); rr(DX, DY + 24 * q, 120, 20 * q, 2, 'slot');
        rr(DX, DY + 60 * q, 300, 80 * q, 10 * q, 'slot'); slotLabel(DX, DY + 60 * q, 300, 80 * q, 'Drop zone · fill · dashed 2B');
        dimV(DY, DY + 24 * q, DX - 12, DX, DX, 'S17', { side: 'l' }); dimV(DY + 44 * q, DY + 60 * q, DX - 12, null, DX, 'S19', { side: 'l' }); dimV(DY + 60 * q, DY + 140 * q, DX + 312, DX + 300, DX + 300, 'H7', { side: 'r' }); rad(DX, DY + 140 * q, 10 * q, 'bl', 'R2', 10);
        tx(DX + 150, DY + 106, 'DETAIL D · UPLOAD BLOCK', 'vt', { 'text-anchor': 'middle' }); tx(DX + 150, DY + 119, 'SCALE 0.6:1 · RULE → LABEL → DROP', 'dts', { 'text-anchor': 'middle' }); nb(DX + 320, DY, 6); }
      { const q = .7, EX = 1010, EY = 968; at(10.0, .04, .4);
        mk('line', { x1: EX, y1: EY - 16 * q, x2: EX + 340, y2: EY - 16 * q, class: 'ph' });
        rr(EX, EY, 60 * q, 38 * q, 8 * q, 'obj'); slotLabel(EX, EY, 60 * q, 38 * q, 'Back'); rr(EX + 340 - 223 * q, EY + q, 223 * q, 36 * q, 8 * q, 'hug'); slotLabel(EX + 340 - 223 * q, EY + q, 223 * q, 36 * q, 'Primary · hug');
        dimH(EX + 60 * q, EX + 340 - 223 * q, EY + 19 * q, null, null, 'FLEX', { c: 'dts' });
        dimV(EY, EY + 38 * q, EX - 12, EX, EX, 'H6', { side: 'l' }); dimV(EY + q, EY + 37 * q, EX + 352, EX + 340, EX + 340, 'H5', { side: 'r' }); dimV(EY - 16 * q, EY, EX + 352, EX + 340, EX + 340, 'S20', { side: 'r' }); nb(EX - 30, EY - 8, 7);
        tx(EX + 170, EY + 38 * q + 18, 'DETAIL E · FOOTER ACTIONS', 'vt', { 'text-anchor': 'middle' }); tx(EX + 170, EY + 38 * q + 31, 'SCALE 0.7:1 · START / END', 'dts', { 'text-anchor': 'middle' }); }
    });
  },
  render(t, kit) { W.paint(this.S, t, kit); },
});
