// The drawing sheet. Each scene builds one sheet with these tools and paints it as a pure function of t.
window.W = {
  build(kit, id, draw) {
    const NS = 'http://www.w3.org/2000/svg';
    const root = kit.h('<div class="ground"><div class="dw-cam ' + id + '-cam"></div></div>');
    kit.stage.append(root);
    const camEl = root.querySelector('.dw-cam');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1900 1060'); svg.setAttribute('width', '1900'); svg.setAttribute('height', '1060'); svg.setAttribute('class', 'dw-svg ' + id + '-sheet');
    camEl.appendChild(svg);
    const S = { cam: camEl.style, reg: [], morph: [], keys: [], speed: 0.8, flat: [1, 0, 0, 1, 0, 0], iso: [1, 0, 0, 1, 0, 0] };
    let sv = svg, CUR = { a: 0, s: 0, d: .6, i: 0 }, noreg = 0;
    const at = (a, s, d) => { CUR = { a: a, s: s || 0, d: d || .6, i: 0 }; };
    const kind = (e, t) => { if (t === 'text') return 'f'; const c = ' ' + (e.getAttribute('class') || '') + ' ';
      if (/ (slot|ph|cl|env|hs) /.test(c) || (e.getAttribute('fill') || '').indexOf('url') === 0) return 'f'; return 'd'; };
    function mk(t, a, p) { const e = document.createElementNS(NS, t); for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]); (p || sv).appendChild(e);
      if (!noreg && t !== 'g') { const s = CUR.a + CUR.i * CUR.s; CUR.i++; const k = kind(e, t); if (k === 'd') e.setAttribute('pathLength', '1'); e.style.opacity = 0; S.reg.push({ e: e, a: s, b: s + CUR.d, k: k, last: -1 }); }
      return e; }
    function tx(x, y, s, c, a, p) { const t = mk('text', Object.assign({ x: x, y: y, class: c || 'dt' }, a || {}), p); t.textContent = s; return t; }
    noreg = 1; const defs = mk('defs', {}); const m = mk('marker', { id: id + '-ar', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, defs);
    mk('path', { d: 'M0,1.7 L10,5 L0,8.3 z', class: 'arrow' }, m);
    const pt = mk('pattern', { id: id + '-hat', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs); mk('line', { x1: 0, y1: 0, x2: 0, y2: 5, class: 'hl' }, pt);
    const sheet = mk('g', { class: id + '-content', transform: 'translate(100 0)' }); noreg = 0;
    const A = 'url(#' + id + '-ar)', HAT = 'url(#' + id + '-hat)';
    function dimH(x1, x2, y, e1, e2, l, o) { o = o || {}; [[x1, e1], [x2, e2]].forEach(([x, e]) => { if (e == null) return; const s = Math.sign(y - e) || 1; mk('line', { x1: x, y1: e + s * 3, x2: x, y2: y + s * 5, class: 'ext' }); });
      if (x2 - x1 >= 28) mk('line', { x1: x1, y1: y, x2: x2, y2: y, class: 'dl', 'marker-start': A, 'marker-end': A }); else { mk('line', { x1: x1 - 13, y1: y, x2: x1, y2: y, class: 'dl', 'marker-end': A }); mk('line', { x1: x2 + 13, y1: y, x2: x2, y2: y, class: 'dl', 'marker-end': A }); }
      if (l) tx((x1 + x2) / 2 + (o.dx || 0), (o.below ? y + 13 : y - 4) + (o.dy || 0), l, o.c || 'dt', { 'text-anchor': 'middle' }); }
    function dimV(y1, y2, x, e1, e2, l, o) { o = o || {}; [[y1, e1], [y2, e2]].forEach(([y, e]) => { if (e == null) return; const s = Math.sign(x - e) || 1; mk('line', { x1: e + s * 3, y1: y, x2: x + s * 5, y2: y, class: 'ext' }); });
      if (y2 - y1 >= 28) mk('line', { x1: x, y1: y1, x2: x, y2: y2, class: 'dl', 'marker-start': A, 'marker-end': A }); else { mk('line', { x1: x, y1: y1 - 13, x2: x, y2: y1, class: 'dl', 'marker-end': A }); mk('line', { x1: x, y1: y2 + 13, x2: x, y2: y2, class: 'dl', 'marker-end': A }); }
      if (!l) return; const c = (y1 + y2) / 2; if (o.side) { const r = o.side === 'r'; tx(r ? x + 6 : x - 6, c + 4, l, o.c || 'dt', { 'text-anchor': r ? 'start' : 'end' }); } else tx(x - 5, c, l, o.c || 'dt', { 'text-anchor': 'middle', transform: 'rotate(-90 ' + (x - 5) + ' ' + c + ')' }); }
    function callout(px, py, ex, ey, l, dir, c) { const s = dir || (ex >= px ? 1 : -1); mk('circle', { cx: px, cy: py, r: 1.8, class: 'dot' }); mk('polyline', { points: px + ',' + py + ' ' + ex + ',' + ey + ' ' + (ex + s * 10) + ',' + ey, class: 'lead' }); tx(ex + s * 14, ey + 4, l, c || 'dt', { 'text-anchor': s > 0 ? 'start' : 'end' }); }
    function rad(cx, cy, r, c, l, L) { const sx = c.indexOf('l') > -1 ? -1 : 1, sy = c.indexOf('t') > -1 ? -1 : 1; const ox = cx - sx * r, oy = cy - sy * r; const px = ox + sx * r * Math.SQRT1_2, py = oy + sy * r * Math.SQRT1_2; callout(px, py, px + sx * L, py + sy * L, l, sx); }
    function nb(x, y, n) { mk('rect', { x: x - 6, y: y - 6, width: 12, height: 12, class: 'nb' }); tx(x, y + 3.5, String(n), 'nbt', { 'text-anchor': 'middle' }); }
    function rr(x, y, w, h, r, c, p) { return mk('rect', { x: x, y: y, width: w, height: h, rx: r, class: c }, p); }
    function slotLabel(x, y, w, h, l, al, p) { tx(al === 'l' ? x + 6 : x + w / 2, y + h / 2 + 3.2, l, 'sl', { 'text-anchor': al === 'l' ? 'start' : 'middle' }, p); }
    function title(x, y, t, s) { tx(x, y, t, 'vt', { 'text-anchor': 'middle' }); if (s) tx(x, y + 14, s, 'dts', { 'text-anchor': 'middle' }); }
    function xbox(x, y, w, h, p) { mk('rect', { x: x, y: y, width: w, height: h, class: 'thin' }, p); mk('path', { d: 'M' + x + ',' + y + ' l' + w + ',' + h + ' M' + (x + w) + ',' + y + ' l' + (-w) + ',' + h, class: 'thin' }, p); }
    function detailRef(cx, cy, r, lbl, lx, ly) { mk('circle', { cx: cx, cy: cy, r: r, class: 'ph' }); const a = Math.atan2(ly - cy, lx - cx); mk('line', { x1: cx + r * Math.cos(a), y1: cy + r * Math.sin(a), x2: lx, y2: ly, class: 'lead' }); tx(lx + (lx < cx ? -4 : 4), ly + 4, lbl, 'dts', { 'text-anchor': lx < cx ? 'end' : 'start' }); }
    function brk(x, y1, y2) { const m2 = (y1 + y2) / 2; mk('path', { d: 'M' + x + ',' + (y1 - 6) + ' L' + x + ',' + (m2 - 8) + ' l6,4 l-12,8 l6,4 L' + x + ',' + (y2 + 6), class: 'thin', fill: 'none' }); }
    function table(x, y, ttl, rows) { const ws = [32, 90, 152], rh = 17; tx(x, y - 8, ttl, 'vt');
      [['Code', 'Variable', 'Value']].concat(rows).forEach((r, i) => { let c2 = x; r.forEach((c, j) => { mk('rect', { x: c2, y: y + i * rh, width: ws[j], height: rh, class: 'thin' }); tx(c2 + (j ? ws[j] / 2 : 5), y + i * rh + 12, c, i ? 'tc' : 'th', { 'text-anchor': j ? 'middle' : 'start' }); c2 += ws[j]; }); });
      return y + (rows.length + 1) * rh + 34; }
    function notes(list) { tx(50, 58, 'NOTES:', 'nth'); tx(112, 58, '(UNLESS OTHERWISE SPECIFIED)', 'nt');
      list.forEach(([n, t], i) => { const y = 88 + i * 24; if (n) { nb(56, y - 4, n); tx(72, y, t, 'nt'); } else tx(50, y, t, 'nt'); }); }
    function grid(gx, gy, s, cols) { let x = gx; const h = 30; cols.forEach(([w, l, cls]) => { const e = mk('rect', { x: x, y: gy, width: w * s, height: h, class: cls === 'hat' ? 'hs' : 'thin' }); if (cls === 'hat') e.setAttribute('fill', HAT); if (w * s > 36 && l) tx(x + w * s / 2, gy + h / 2 + 4, l, 'sl', { 'text-anchor': 'middle' }); x += w * s; }); return x; }
    function plan(PX, PY, k) { S.flat = [k, 0, 0, k, PX, PY]; const X = v => PX + v * k, Y = v => PY + v * k;
      return { X, Y, r: (x, y, w, h, rx, c, l, al) => { rr(X(x), Y(y), w * k, h * k, rx * k, c); if (l) slotLabel(X(x), Y(y), w * k, h * k, l, al); },
        ln: (x1, y1, x2, y2, c) => mk('line', { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), class: c || 'thin' }) }; }
    // The exploded view: static layers draw in place, lifting layers morph from the plan's matrix to the axonometric one.
    function iso(sc, TX, TY) { const ia = .94 * sc, ib = .17 * sc, ic = -.34 * sc, id2 = .47 * sc; S.iso = [ia, ib, ic, id2, TX, TY]; const u = 1 / Math.sqrt(ia * id2 - ib * ic);
      return { P: (x, y, z) => [TX + ia * x + ic * y, TY + ib * x + id2 * y - z],
        G: z => { const g = mk('g', { transform: 'matrix(' + ia + ',' + ib + ',' + ic + ',' + id2 + ',' + TX + ',' + (TY - z) + ')' }); g.style.setProperty('--u', u); return g; },
        lift: (z, a0, fill) => { noreg = 1; const g = mk('g', { class: id + '-layer' }); g.style.opacity = 0; fill(g); noreg = 0; S.morph.push({ g: g, z: z, a: a0 }); } }; }
    sv = sheet;
    draw({ at, mk, tx, dimH, dimV, callout, rad, nb, rr, slotLabel, title, xbox, detailRef, brk, table, notes, grid, plan, iso, A, HAT,
      cam: keys => { S.keys = keys; }, speed: v => { S.speed = v; },
      border: () => { sv = svg; const e = mk('rect', { x: 20, y: 20, width: 1860, height: 1020, rx: 16, class: 'border' }); sv = sheet; return e; } });
    return S;
  },
  paint(S, t, kit) {
    const { seg, lerp, eo, eio, clamp01 } = kit;
    t = t / S.speed;
    const K = S.keys; let i = 0; while (i < K.length - 2 && t > K[i + 1].t) i++;
    const c0 = K[i], c1 = K[i + 1], p = eio(seg(t, c0.t, c1.t));
    const z = Math.exp(lerp(Math.log(c0.z), Math.log(c1.z), p)), cx = lerp(c0.cx, c1.cx, p), cy = lerp(c0.cy, c1.cy, p);
    S.cam.transform = 'translate(' + (960 - cx * z) + 'px,' + (540 - cy * z) + 'px) scale(' + z + ')';
    for (const it of S.reg) {
      let v = clamp01((t - it.a) / (it.b - it.a)); v = Math.round(v * 400) / 400;
      if (v === it.last) continue; it.last = v; const s = it.e.style;
      if (it.k === 'f') { s.opacity = eo(v); continue; }
      const e = eio(v); s.opacity = Math.min(1, v * 6);
      if (v >= 1) { s.strokeDasharray = ''; s.strokeDashoffset = ''; } else { s.strokeDasharray = '1 2'; s.strokeDashoffset = 1 - e; }
      s.fillOpacity = eo(seg(v, .55, 1));
    }
    const F = S.flat, I = S.iso;
    for (const m of S.morph) {
      const v = eio(seg(t, m.a, m.a + 1.5)), M = F.map((f, n) => lerp(f, I[n], v));
      M[5] -= m.z * v;
      m.g.style.opacity = eo(seg(t, m.a + 0.05, m.a + 0.5));
      const fo = eo(seg(t, m.a + 0.55, m.a + 1.25));
      if (fo !== m.fo) { m.fo = fo; m.fills = m.fills || m.g.querySelectorAll('.obj,.well,.hug'); m.fills.forEach(e => { e.style.fillOpacity = fo; }); }
      m.g.setAttribute('transform', 'matrix(' + M.join(',') + ')');
      m.g.style.setProperty('--u', 1 / Math.sqrt(Math.abs(M[0] * M[3] - M[1] * M[2])));
    }
  },
};
