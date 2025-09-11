function Io() {
  return "shared";
}
function sn(r) {
  var e, t, n = "";
  if (typeof r == "string" || typeof r == "number") n += r;
  else if (typeof r == "object") if (Array.isArray(r)) {
    var o = r.length;
    for (e = 0; e < o; e++) r[e] && (t = sn(r[e])) && (n && (n += " "), n += t);
  } else for (t in r) r[t] && (n && (n += " "), n += t);
  return n;
}
function In() {
  for (var r, e, t = 0, n = "", o = arguments.length; t < o; t++) (r = arguments[t]) && (e = sn(r)) && (n && (n += " "), n += e);
  return n;
}
const pt = "-", Mn = (r) => {
  const e = Fn(r), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = r;
  return {
    getClassGroupId: (a) => {
      const l = a.split(pt);
      return l[0] === "" && l.length !== 1 && l.shift(), an(l, e) || Dn(a);
    },
    getConflictingClassGroupIds: (a, l) => {
      const u = t[a] || [];
      return l && n[a] ? [...u, ...n[a]] : u;
    }
  };
}, an = (r, e) => {
  if (r.length === 0)
    return e.classGroupId;
  const t = r[0], n = e.nextPart.get(t), o = n ? an(r.slice(1), n) : void 0;
  if (o)
    return o;
  if (e.validators.length === 0)
    return;
  const s = r.join(pt);
  return e.validators.find(({
    validator: a
  }) => a(s))?.classGroupId;
}, Rt = /^\[(.+)\]$/, Dn = (r) => {
  if (Rt.test(r)) {
    const e = Rt.exec(r)[1], t = e?.substring(0, e.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, Fn = (r) => {
  const {
    theme: e,
    classGroups: t
  } = r, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const o in t)
    rt(t[o], n, o, e);
  return n;
}, rt = (r, e, t, n) => {
  r.forEach((o) => {
    if (typeof o == "string") {
      const s = o === "" ? e : Ct(e, o);
      s.classGroupId = t;
      return;
    }
    if (typeof o == "function") {
      if (zn(o)) {
        rt(o(n), e, t, n);
        return;
      }
      e.validators.push({
        validator: o,
        classGroupId: t
      });
      return;
    }
    Object.entries(o).forEach(([s, a]) => {
      rt(a, Ct(e, s), t, n);
    });
  });
}, Ct = (r, e) => {
  let t = r;
  return e.split(pt).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, zn = (r) => r.isThemeGetter, Un = (r) => {
  if (r < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (s, a) => {
    t.set(s, a), e++, e > r && (e = 0, n = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let a = t.get(s);
      if (a !== void 0)
        return a;
      if ((a = n.get(s)) !== void 0)
        return o(s, a), a;
    },
    set(s, a) {
      t.has(s) ? t.set(s, a) : o(s, a);
    }
  };
}, ot = "!", st = ":", Hn = st.length, Vn = (r) => {
  const {
    prefix: e,
    experimentalParseClassName: t
  } = r;
  let n = (o) => {
    const s = [];
    let a = 0, l = 0, u = 0, f;
    for (let y = 0; y < o.length; y++) {
      let T = o[y];
      if (a === 0 && l === 0) {
        if (T === st) {
          s.push(o.slice(u, y)), u = y + Hn;
          continue;
        }
        if (T === "/") {
          f = y;
          continue;
        }
      }
      T === "[" ? a++ : T === "]" ? a-- : T === "(" ? l++ : T === ")" && l--;
    }
    const p = s.length === 0 ? o : o.substring(u), h = Kn(p), x = h !== p, v = f && f > u ? f - u : void 0;
    return {
      modifiers: s,
      hasImportantModifier: x,
      baseClassName: h,
      maybePostfixModifierPosition: v
    };
  };
  if (e) {
    const o = e + st, s = n;
    n = (a) => a.startsWith(o) ? s(a.substring(o.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: a,
      maybePostfixModifierPosition: void 0
    };
  }
  if (t) {
    const o = n;
    n = (s) => t({
      className: s,
      parseClassName: o
    });
  }
  return n;
}, Kn = (r) => r.endsWith(ot) ? r.substring(0, r.length - 1) : r.startsWith(ot) ? r.substring(1) : r, qn = (r) => {
  const e = Object.fromEntries(r.orderSensitiveModifiers.map((n) => [n, !0]));
  return (n) => {
    if (n.length <= 1)
      return n;
    const o = [];
    let s = [];
    return n.forEach((a) => {
      a[0] === "[" || e[a] ? (o.push(...s.sort(), a), s = []) : s.push(a);
    }), o.push(...s.sort()), o;
  };
}, Gn = (r) => ({
  cache: Un(r.cacheSize),
  parseClassName: Vn(r),
  sortModifiers: qn(r),
  ...Mn(r)
}), Bn = /\s+/, Yn = (r, e) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: s
  } = e, a = [], l = r.trim().split(Bn);
  let u = "";
  for (let f = l.length - 1; f >= 0; f -= 1) {
    const p = l[f], {
      isExternal: h,
      modifiers: x,
      hasImportantModifier: v,
      baseClassName: y,
      maybePostfixModifierPosition: T
    } = t(p);
    if (h) {
      u = p + (u.length > 0 ? " " + u : u);
      continue;
    }
    let A = !!T, K = n(A ? y.substring(0, T) : y);
    if (!K) {
      if (!A) {
        u = p + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (K = n(y), !K) {
        u = p + (u.length > 0 ? " " + u : u);
        continue;
      }
      A = !1;
    }
    const U = s(x).join(":"), H = v ? U + ot : U, M = H + K;
    if (a.includes(M))
      continue;
    a.push(M);
    const R = o(K, A);
    for (let V = 0; V < R.length; ++V) {
      const W = R[V];
      a.push(H + W);
    }
    u = p + (u.length > 0 ? " " + u : u);
  }
  return u;
};
function Wn() {
  let r = 0, e, t, n = "";
  for (; r < arguments.length; )
    (e = arguments[r++]) && (t = ln(e)) && (n && (n += " "), n += t);
  return n;
}
const ln = (r) => {
  if (typeof r == "string")
    return r;
  let e, t = "";
  for (let n = 0; n < r.length; n++)
    r[n] && (e = ln(r[n])) && (t && (t += " "), t += e);
  return t;
};
function Xn(r, ...e) {
  let t, n, o, s = a;
  function a(u) {
    const f = e.reduce((p, h) => h(p), r());
    return t = Gn(f), n = t.cache.get, o = t.cache.set, s = l, l(u);
  }
  function l(u) {
    const f = n(u);
    if (f)
      return f;
    const p = Yn(u, t);
    return o(u, p), p;
  }
  return function() {
    return s(Wn.apply(null, arguments));
  };
}
const re = (r) => {
  const e = (t) => t[r] || [];
  return e.isThemeGetter = !0, e;
}, un = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, cn = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Qn = /^\d+\/\d+$/, Jn = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Zn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, er = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, tr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, nr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ke = (r) => Qn.test(r), I = (r) => !!r && !Number.isNaN(Number(r)), he = (r) => !!r && Number.isInteger(Number(r)), Ze = (r) => r.endsWith("%") && I(r.slice(0, -1)), de = (r) => Jn.test(r), rr = () => !0, or = (r) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Zn.test(r) && !er.test(r)
), fn = () => !1, sr = (r) => tr.test(r), ir = (r) => nr.test(r), ar = (r) => !S(r) && !k(r), lr = (r) => Pe(r, hn, fn), S = (r) => un.test(r), ye = (r) => Pe(r, gn, or), et = (r) => Pe(r, pr, I), Pt = (r) => Pe(r, dn, fn), ur = (r) => Pe(r, pn, ir), He = (r) => Pe(r, mn, sr), k = (r) => cn.test(r), Le = (r) => _e(r, gn), cr = (r) => _e(r, hr), _t = (r) => _e(r, dn), fr = (r) => _e(r, hn), dr = (r) => _e(r, pn), Ve = (r) => _e(r, mn, !0), Pe = (r, e, t) => {
  const n = un.exec(r);
  return n ? n[1] ? e(n[1]) : t(n[2]) : !1;
}, _e = (r, e, t = !1) => {
  const n = cn.exec(r);
  return n ? n[1] ? e(n[1]) : t : !1;
}, dn = (r) => r === "position" || r === "percentage", pn = (r) => r === "image" || r === "url", hn = (r) => r === "length" || r === "size" || r === "bg-size", gn = (r) => r === "length", pr = (r) => r === "number", hr = (r) => r === "family-name", mn = (r) => r === "shadow", gr = () => {
  const r = re("color"), e = re("font"), t = re("text"), n = re("font-weight"), o = re("tracking"), s = re("leading"), a = re("breakpoint"), l = re("container"), u = re("spacing"), f = re("radius"), p = re("shadow"), h = re("inset-shadow"), x = re("text-shadow"), v = re("drop-shadow"), y = re("blur"), T = re("perspective"), A = re("aspect"), K = re("ease"), U = re("animate"), H = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], M = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], R = () => [...M(), k, S], V = () => ["auto", "hidden", "clip", "visible", "scroll"], W = () => ["auto", "contain", "none"], C = () => [k, S, u], Q = () => [ke, "full", "auto", ...C()], oe = () => [he, "none", "subgrid", k, S], X = () => ["auto", {
    span: ["full", he, k, S]
  }, he, k, S], ie = () => [he, "auto", k, S], te = () => ["auto", "min", "max", "fr", k, S], Z = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], ne = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], q = () => ["auto", ...C()], ee = () => [ke, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...C()], O = () => [r, k, S], ae = () => [...M(), _t, Pt, {
    position: [k, S]
  }], c = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], g = () => ["auto", "cover", "contain", fr, lr, {
    size: [k, S]
  }], E = () => [Ze, Le, ye], w = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    f,
    k,
    S
  ], _ = () => ["", I, Le, ye], G = () => ["solid", "dashed", "dotted", "double"], j = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], B = () => [I, Ze, _t, Pt], J = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    y,
    k,
    S
  ], ue = () => ["none", I, k, S], we = () => ["none", I, k, S], xe = () => [I, k, S], me = () => [ke, "full", ...C()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [de],
      breakpoint: [de],
      color: [rr],
      container: [de],
      "drop-shadow": [de],
      ease: ["in", "out", "in-out"],
      font: [ar],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [de],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [de],
      shadow: [de],
      spacing: ["px", I],
      text: [de],
      "text-shadow": [de],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", ke, S, k, A]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [I, S, k, l]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": H()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": H()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: R()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: V()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": V()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": V()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: W()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": W()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": W()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: Q()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": Q()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": Q()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: Q()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: Q()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: Q()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: Q()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: Q()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: Q()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [he, "auto", k, S]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [ke, "full", "auto", l, ...C()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [I, ke, "auto", "initial", "none", S]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", I, k, S]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", I, k, S]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [he, "first", "last", "none", k, S]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": oe()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: X()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ie()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ie()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": oe()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: X()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ie()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ie()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": te()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": te()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: C()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": C()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": C()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Z(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...ne(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...ne()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Z()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...ne(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...ne(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Z()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...ne(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...ne()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: C()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: C()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: C()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: C()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: C()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: C()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: C()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: C()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: C()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: q()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: q()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: q()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: q()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: q()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: q()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: q()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: q()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: q()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": C()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": C()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: ee()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [l, "screen", ...ee()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          l,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...ee()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          l,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...ee()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...ee()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ee()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...ee()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", t, Le, ye]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [n, k, et]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ze, S]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [cr, S, e]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, k, S]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [I, "none", k, et]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          s,
          ...C()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", k, S]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", k, S]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: O()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: O()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...G(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [I, "from-font", "auto", k, ye]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: O()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [I, "auto", k, S]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: C()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", k, S]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", k, S]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: ae()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: c()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: g()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, he, k, S],
          radial: ["", k, S],
          conic: [he, k, S]
        }, dr, ur]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: O()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: E()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: E()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: E()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: O()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: O()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: O()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: w()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": w()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": w()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": w()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": w()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": w()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": w()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": w()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": w()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": w()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": w()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": w()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": w()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": w()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": w()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: _()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": _()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": _()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": _()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": _()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": _()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": _()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": _()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": _()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": _()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": _()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...G(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...G(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: O()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": O()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": O()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": O()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": O()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": O()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": O()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": O()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": O()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: O()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...G(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [I, k, S]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", I, Le, ye]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: O()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          p,
          Ve,
          He
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: O()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", h, Ve, He]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": O()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: _()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: O()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [I, ye]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": O()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": _()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": O()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", x, Ve, He]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": O()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [I, k, S]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...j(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": j()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [I]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": B()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": B()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": O()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": O()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": B()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": B()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": O()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": O()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": B()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": B()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": O()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": O()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": B()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": B()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": O()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": O()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": B()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": B()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": O()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": O()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": B()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": B()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": O()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": O()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": B()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": B()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": O()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": O()
      }],
      "mask-image-radial": [{
        "mask-radial": [k, S]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": B()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": B()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": O()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": O()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": M()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [I]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": B()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": B()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": O()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": O()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: ae()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: c()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: g()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", k, S]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          k,
          S
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: J()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [I, k, S]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [I, k, S]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          v,
          Ve,
          He
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": O()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", I, k, S]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [I, k, S]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", I, k, S]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [I, k, S]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", I, k, S]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          k,
          S
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": J()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [I, k, S]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [I, k, S]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", I, k, S]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [I, k, S]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", I, k, S]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [I, k, S]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [I, k, S]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", I, k, S]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": C()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": C()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": C()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", k, S]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [I, "initial", k, S]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", K, k, S]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [I, k, S]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", U, k, S]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [T, k, S]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": R()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: ue()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ue()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ue()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ue()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: we()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": we()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": we()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": we()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: xe()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": xe()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": xe()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [k, S, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: R()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: me()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": me()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": me()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": me()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: O()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: O()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", k, S]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": C()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": C()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": C()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": C()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": C()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": C()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": C()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": C()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": C()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": C()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": C()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": C()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": C()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": C()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": C()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": C()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": C()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": C()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", k, S]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...O()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [I, Le, ye, et]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...O()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, mr = /* @__PURE__ */ Xn(gr);
function Mo(...r) {
  return mr(In(r));
}
const L = (r) => typeof r == "string", Te = () => {
  let r, e;
  const t = new Promise((n, o) => {
    r = n, e = o;
  });
  return t.resolve = r, t.reject = e, t;
}, Lt = (r) => r == null ? "" : "" + r, yr = (r, e, t) => {
  r.forEach((n) => {
    e[n] && (t[n] = e[n]);
  });
}, br = /###/g, Tt = (r) => r && r.indexOf("###") > -1 ? r.replace(br, ".") : r, At = (r) => !r || L(r), je = (r, e, t) => {
  const n = L(e) ? e.split(".") : e;
  let o = 0;
  for (; o < n.length - 1; ) {
    if (At(r)) return {};
    const s = Tt(n[o]);
    !r[s] && t && (r[s] = new t()), Object.prototype.hasOwnProperty.call(r, s) ? r = r[s] : r = {}, ++o;
  }
  return At(r) ? {} : {
    obj: r,
    k: Tt(n[o])
  };
}, jt = (r, e, t) => {
  const {
    obj: n,
    k: o
  } = je(r, e, Object);
  if (n !== void 0 || e.length === 1) {
    n[o] = t;
    return;
  }
  let s = e[e.length - 1], a = e.slice(0, e.length - 1), l = je(r, a, Object);
  for (; l.obj === void 0 && a.length; )
    s = `${a[a.length - 1]}.${s}`, a = a.slice(0, a.length - 1), l = je(r, a, Object), l?.obj && typeof l.obj[`${l.k}.${s}`] < "u" && (l.obj = void 0);
  l.obj[`${l.k}.${s}`] = t;
}, vr = (r, e, t, n) => {
  const {
    obj: o,
    k: s
  } = je(r, e, Object);
  o[s] = o[s] || [], o[s].push(t);
}, Ge = (r, e) => {
  const {
    obj: t,
    k: n
  } = je(r, e);
  if (t && Object.prototype.hasOwnProperty.call(t, n))
    return t[n];
}, wr = (r, e, t) => {
  const n = Ge(r, t);
  return n !== void 0 ? n : Ge(e, t);
}, yn = (r, e, t) => {
  for (const n in e)
    n !== "__proto__" && n !== "constructor" && (n in r ? L(r[n]) || r[n] instanceof String || L(e[n]) || e[n] instanceof String ? t && (r[n] = e[n]) : yn(r[n], e[n], t) : r[n] = e[n]);
  return r;
}, Oe = (r) => r.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var xr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const Sr = (r) => L(r) ? r.replace(/[&<>"'\/]/g, (e) => xr[e]) : r;
class kr {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const t = this.regExpMap.get(e);
    if (t !== void 0)
      return t;
    const n = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, n), this.regExpQueue.push(e), n;
  }
}
const Or = [" ", ",", "?", "!", ";"], Er = new kr(20), Rr = (r, e, t) => {
  e = e || "", t = t || "";
  const n = Or.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0);
  if (n.length === 0) return !0;
  const o = Er.getRegExp(`(${n.map((a) => a === "?" ? "\\?" : a).join("|")})`);
  let s = !o.test(r);
  if (!s) {
    const a = r.indexOf(t);
    a > 0 && !o.test(r.substring(0, a)) && (s = !0);
  }
  return s;
}, it = (r, e, t = ".") => {
  if (!r) return;
  if (r[e])
    return Object.prototype.hasOwnProperty.call(r, e) ? r[e] : void 0;
  const n = e.split(t);
  let o = r;
  for (let s = 0; s < n.length; ) {
    if (!o || typeof o != "object")
      return;
    let a, l = "";
    for (let u = s; u < n.length; ++u)
      if (u !== s && (l += t), l += n[u], a = o[l], a !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof a) > -1 && u < n.length - 1)
          continue;
        s += u - s + 1;
        break;
      }
    o = a;
  }
  return o;
}, Ne = (r) => r?.replace("_", "-"), Cr = {
  type: "logger",
  log(r) {
    this.output("log", r);
  },
  warn(r) {
    this.output("warn", r);
  },
  error(r) {
    this.output("error", r);
  },
  output(r, e) {
    console?.[r]?.apply?.(console, e);
  }
};
class Be {
  constructor(e, t = {}) {
    this.init(e, t);
  }
  init(e, t = {}) {
    this.prefix = t.prefix || "i18next:", this.logger = e || Cr, this.options = t, this.debug = t.debug;
  }
  log(...e) {
    return this.forward(e, "log", "", !0);
  }
  warn(...e) {
    return this.forward(e, "warn", "", !0);
  }
  error(...e) {
    return this.forward(e, "error", "");
  }
  deprecate(...e) {
    return this.forward(e, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, t, n, o) {
    return o && !this.debug ? null : (L(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[t](e));
  }
  create(e) {
    return new Be(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new Be(this.logger, e);
  }
}
var fe = new Be();
class Xe {
  constructor() {
    this.observers = {};
  }
  on(e, t) {
    return e.split(" ").forEach((n) => {
      this.observers[n] || (this.observers[n] = /* @__PURE__ */ new Map());
      const o = this.observers[n].get(t) || 0;
      this.observers[n].set(t, o + 1);
    }), this;
  }
  off(e, t) {
    if (this.observers[e]) {
      if (!t) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(t);
    }
  }
  emit(e, ...t) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([o, s]) => {
      for (let a = 0; a < s; a++)
        o(...t);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([o, s]) => {
      for (let a = 0; a < s; a++)
        o.apply(o, [e, ...t]);
    });
  }
}
class Nt extends Xe {
  constructor(e, t = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = e || {}, this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const t = this.options.ns.indexOf(e);
    t > -1 && this.options.ns.splice(t, 1);
  }
  getResource(e, t, n, o = {}) {
    const s = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, a = o.ignoreJSONStructure !== void 0 ? o.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let l;
    e.indexOf(".") > -1 ? l = e.split(".") : (l = [e, t], n && (Array.isArray(n) ? l.push(...n) : L(n) && s ? l.push(...n.split(s)) : l.push(n)));
    const u = Ge(this.data, l);
    return !u && !t && !n && e.indexOf(".") > -1 && (e = l[0], t = l[1], n = l.slice(2).join(".")), u || !a || !L(n) ? u : it(this.data?.[e]?.[t], n, s);
  }
  addResource(e, t, n, o, s = {
    silent: !1
  }) {
    const a = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator;
    let l = [e, t];
    n && (l = l.concat(a ? n.split(a) : n)), e.indexOf(".") > -1 && (l = e.split("."), o = t, t = l[1]), this.addNamespaces(t), jt(this.data, l, o), s.silent || this.emit("added", e, t, n, o);
  }
  addResources(e, t, n, o = {
    silent: !1
  }) {
    for (const s in n)
      (L(n[s]) || Array.isArray(n[s])) && this.addResource(e, t, s, n[s], {
        silent: !0
      });
    o.silent || this.emit("added", e, t, n);
  }
  addResourceBundle(e, t, n, o, s, a = {
    silent: !1,
    skipCopy: !1
  }) {
    let l = [e, t];
    e.indexOf(".") > -1 && (l = e.split("."), o = n, n = t, t = l[1]), this.addNamespaces(t);
    let u = Ge(this.data, l) || {};
    a.skipCopy || (n = JSON.parse(JSON.stringify(n))), o ? yn(u, n, s) : u = {
      ...u,
      ...n
    }, jt(this.data, l, u), a.silent || this.emit("added", e, t, n);
  }
  removeResourceBundle(e, t) {
    this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit("removed", e, t);
  }
  hasResourceBundle(e, t) {
    return this.getResource(e, t) !== void 0;
  }
  getResourceBundle(e, t) {
    return t || (t = this.options.defaultNS), this.getResource(e, t);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const t = this.getDataByLanguage(e);
    return !!(t && Object.keys(t) || []).find((o) => t[o] && Object.keys(t[o]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var bn = {
  processors: {},
  addPostProcessor(r) {
    this.processors[r.name] = r;
  },
  handle(r, e, t, n, o) {
    return r.forEach((s) => {
      e = this.processors[s]?.process(e, t, n, o) ?? e;
    }), e;
  }
};
const vn = Symbol("i18next/PATH_KEY");
function Pr() {
  const r = [], e = /* @__PURE__ */ Object.create(null);
  let t;
  return e.get = (n, o) => (t?.revoke?.(), o === vn ? r : (r.push(o), t = Proxy.revocable(n, e), t.proxy)), Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function at(r, e) {
  const {
    [vn]: t
  } = r(Pr());
  return t.join(e?.keySeparator ?? ".");
}
const $t = {}, It = (r) => !L(r) && typeof r != "boolean" && typeof r != "number";
class Ye extends Xe {
  constructor(e, t = {}) {
    super(), yr(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = fe.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e, t = {
    interpolation: {}
  }) {
    const n = {
      ...t
    };
    return e == null ? !1 : this.resolve(e, n)?.res !== void 0;
  }
  extractFromKey(e, t) {
    let n = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator;
    n === void 0 && (n = ":");
    const o = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator;
    let s = t.ns || this.options.defaultNS || [];
    const a = n && e.indexOf(n) > -1, l = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !Rr(e, n, o);
    if (a && !l) {
      const u = e.match(this.interpolator.nestingRegexp);
      if (u && u.length > 0)
        return {
          key: e,
          namespaces: L(s) ? [s] : s
        };
      const f = e.split(n);
      (n !== o || n === o && this.options.ns.indexOf(f[0]) > -1) && (s = f.shift()), e = f.join(o);
    }
    return {
      key: e,
      namespaces: L(s) ? [s] : s
    };
  }
  translate(e, t, n) {
    let o = typeof t == "object" ? {
      ...t
    } : t;
    if (typeof o != "object" && this.options.overloadTranslationOptionHandler && (o = this.options.overloadTranslationOptionHandler(arguments)), typeof o == "object" && (o = {
      ...o
    }), o || (o = {}), e == null) return "";
    typeof e == "function" && (e = at(e, {
      ...this.options,
      ...o
    })), Array.isArray(e) || (e = [String(e)]);
    const s = o.returnDetails !== void 0 ? o.returnDetails : this.options.returnDetails, a = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, {
      key: l,
      namespaces: u
    } = this.extractFromKey(e[e.length - 1], o), f = u[u.length - 1];
    let p = o.nsSeparator !== void 0 ? o.nsSeparator : this.options.nsSeparator;
    p === void 0 && (p = ":");
    const h = o.lng || this.language, x = o.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (h?.toLowerCase() === "cimode")
      return x ? s ? {
        res: `${f}${p}${l}`,
        usedKey: l,
        exactUsedKey: l,
        usedLng: h,
        usedNS: f,
        usedParams: this.getUsedParamsDetails(o)
      } : `${f}${p}${l}` : s ? {
        res: l,
        usedKey: l,
        exactUsedKey: l,
        usedLng: h,
        usedNS: f,
        usedParams: this.getUsedParamsDetails(o)
      } : l;
    const v = this.resolve(e, o);
    let y = v?.res;
    const T = v?.usedKey || l, A = v?.exactUsedKey || l, K = ["[object Number]", "[object Function]", "[object RegExp]"], U = o.joinArrays !== void 0 ? o.joinArrays : this.options.joinArrays, H = !this.i18nFormat || this.i18nFormat.handleAsObject, M = o.count !== void 0 && !L(o.count), R = Ye.hasDefaultValue(o), V = M ? this.pluralResolver.getSuffix(h, o.count, o) : "", W = o.ordinal && M ? this.pluralResolver.getSuffix(h, o.count, {
      ordinal: !1
    }) : "", C = M && !o.ordinal && o.count === 0, Q = C && o[`defaultValue${this.options.pluralSeparator}zero`] || o[`defaultValue${V}`] || o[`defaultValue${W}`] || o.defaultValue;
    let oe = y;
    H && !y && R && (oe = Q);
    const X = It(oe), ie = Object.prototype.toString.apply(oe);
    if (H && oe && X && K.indexOf(ie) < 0 && !(L(U) && Array.isArray(oe))) {
      if (!o.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const te = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(T, oe, {
          ...o,
          ns: u
        }) : `key '${l} (${this.language})' returned an object instead of string.`;
        return s ? (v.res = te, v.usedParams = this.getUsedParamsDetails(o), v) : te;
      }
      if (a) {
        const te = Array.isArray(oe), Z = te ? [] : {}, ne = te ? A : T;
        for (const q in oe)
          if (Object.prototype.hasOwnProperty.call(oe, q)) {
            const ee = `${ne}${a}${q}`;
            R && !y ? Z[q] = this.translate(ee, {
              ...o,
              defaultValue: It(Q) ? Q[q] : void 0,
              joinArrays: !1,
              ns: u
            }) : Z[q] = this.translate(ee, {
              ...o,
              joinArrays: !1,
              ns: u
            }), Z[q] === ee && (Z[q] = oe[q]);
          }
        y = Z;
      }
    } else if (H && L(U) && Array.isArray(y))
      y = y.join(U), y && (y = this.extendTranslation(y, e, o, n));
    else {
      let te = !1, Z = !1;
      !this.isValidLookup(y) && R && (te = !0, y = Q), this.isValidLookup(y) || (Z = !0, y = l);
      const q = (o.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && Z ? void 0 : y, ee = R && Q !== y && this.options.updateMissing;
      if (Z || te || ee) {
        if (this.logger.log(ee ? "updateKey" : "missingKey", h, f, l, ee ? Q : y), a) {
          const g = this.resolve(l, {
            ...o,
            keySeparator: !1
          });
          g && g.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let O = [];
        const ae = this.languageUtils.getFallbackCodes(this.options.fallbackLng, o.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && ae && ae[0])
          for (let g = 0; g < ae.length; g++)
            O.push(ae[g]);
        else this.options.saveMissingTo === "all" ? O = this.languageUtils.toResolveHierarchy(o.lng || this.language) : O.push(o.lng || this.language);
        const c = (g, E, w) => {
          const _ = R && w !== y ? w : q;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(g, f, E, _, ee, o) : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(g, f, E, _, ee, o), this.emit("missingKey", g, f, E, y);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && M ? O.forEach((g) => {
          const E = this.pluralResolver.getSuffixes(g, o);
          C && o[`defaultValue${this.options.pluralSeparator}zero`] && E.indexOf(`${this.options.pluralSeparator}zero`) < 0 && E.push(`${this.options.pluralSeparator}zero`), E.forEach((w) => {
            c([g], l + w, o[`defaultValue${w}`] || Q);
          });
        }) : c(O, l, Q));
      }
      y = this.extendTranslation(y, e, o, v, n), Z && y === l && this.options.appendNamespaceToMissingKey && (y = `${f}${p}${l}`), (Z || te) && this.options.parseMissingKeyHandler && (y = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${f}${p}${l}` : l, te ? y : void 0, o));
    }
    return s ? (v.res = y, v.usedParams = this.getUsedParamsDetails(o), v) : y;
  }
  extendTranslation(e, t, n, o, s) {
    if (this.i18nFormat?.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...n
      }, n.lng || this.language || o.usedLng, o.usedNS, o.usedKey, {
        resolved: o
      });
    else if (!n.skipInterpolation) {
      n.interpolation && this.interpolator.init({
        ...n,
        interpolation: {
          ...this.options.interpolation,
          ...n.interpolation
        }
      });
      const u = L(e) && (n?.interpolation?.skipOnVariables !== void 0 ? n.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let f;
      if (u) {
        const h = e.match(this.interpolator.nestingRegexp);
        f = h && h.length;
      }
      let p = n.replace && !L(n.replace) ? n.replace : n;
      if (this.options.interpolation.defaultVariables && (p = {
        ...this.options.interpolation.defaultVariables,
        ...p
      }), e = this.interpolator.interpolate(e, p, n.lng || this.language || o.usedLng, n), u) {
        const h = e.match(this.interpolator.nestingRegexp), x = h && h.length;
        f < x && (n.nest = !1);
      }
      !n.lng && o && o.res && (n.lng = this.language || o.usedLng), n.nest !== !1 && (e = this.interpolator.nest(e, (...h) => s?.[0] === h[0] && !n.context ? (this.logger.warn(`It seems you are nesting recursively key: ${h[0]} in key: ${t[0]}`), null) : this.translate(...h, t), n)), n.interpolation && this.interpolator.reset();
    }
    const a = n.postProcess || this.options.postProcess, l = L(a) ? [a] : a;
    return e != null && l?.length && n.applyPostProcessor !== !1 && (e = bn.handle(l, e, t, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...o,
        usedParams: this.getUsedParamsDetails(n)
      },
      ...n
    } : n, this)), e;
  }
  resolve(e, t = {}) {
    let n, o, s, a, l;
    return L(e) && (e = [e]), e.forEach((u) => {
      if (this.isValidLookup(n)) return;
      const f = this.extractFromKey(u, t), p = f.key;
      o = p;
      let h = f.namespaces;
      this.options.fallbackNS && (h = h.concat(this.options.fallbackNS));
      const x = t.count !== void 0 && !L(t.count), v = x && !t.ordinal && t.count === 0, y = t.context !== void 0 && (L(t.context) || typeof t.context == "number") && t.context !== "", T = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng);
      h.forEach((A) => {
        this.isValidLookup(n) || (l = A, !$t[`${T[0]}-${A}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(l) && ($t[`${T[0]}-${A}`] = !0, this.logger.warn(`key "${o}" for languages "${T.join(", ")}" won't get resolved as namespace "${l}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), T.forEach((K) => {
          if (this.isValidLookup(n)) return;
          a = K;
          const U = [p];
          if (this.i18nFormat?.addLookupKeys)
            this.i18nFormat.addLookupKeys(U, p, K, A, t);
          else {
            let M;
            x && (M = this.pluralResolver.getSuffix(K, t.count, t));
            const R = `${this.options.pluralSeparator}zero`, V = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (x && (t.ordinal && M.indexOf(V) === 0 && U.push(p + M.replace(V, this.options.pluralSeparator)), U.push(p + M), v && U.push(p + R)), y) {
              const W = `${p}${this.options.contextSeparator || "_"}${t.context}`;
              U.push(W), x && (t.ordinal && M.indexOf(V) === 0 && U.push(W + M.replace(V, this.options.pluralSeparator)), U.push(W + M), v && U.push(W + R));
            }
          }
          let H;
          for (; H = U.pop(); )
            this.isValidLookup(n) || (s = H, n = this.getResource(K, A, H, t));
        }));
      });
    }), {
      res: n,
      usedKey: o,
      exactUsedKey: s,
      usedLng: a,
      usedNS: l
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, t, n, o = {}) {
    return this.i18nFormat?.getResource ? this.i18nFormat.getResource(e, t, n, o) : this.resourceStore.getResource(e, t, n, o);
  }
  getUsedParamsDetails(e = {}) {
    const t = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], n = e.replace && !L(e.replace);
    let o = n ? e.replace : e;
    if (n && typeof e.count < "u" && (o.count = e.count), this.options.interpolation.defaultVariables && (o = {
      ...this.options.interpolation.defaultVariables,
      ...o
    }), !n) {
      o = {
        ...o
      };
      for (const s of t)
        delete o[s];
    }
    return o;
  }
  static hasDefaultValue(e) {
    const t = "defaultValue";
    for (const n in e)
      if (Object.prototype.hasOwnProperty.call(e, n) && t === n.substring(0, t.length) && e[n] !== void 0)
        return !0;
    return !1;
  }
}
class Mt {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = fe.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = Ne(e), !e || e.indexOf("-") < 0) return null;
    const t = e.split("-");
    return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(t.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = Ne(e), !e || e.indexOf("-") < 0) return e;
    const t = e.split("-");
    return this.formatLanguageCode(t[0]);
  }
  formatLanguageCode(e) {
    if (L(e) && e.indexOf("-") > -1) {
      let t;
      try {
        t = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let t;
    return e.forEach((n) => {
      if (t) return;
      const o = this.formatLanguageCode(n);
      (!this.options.supportedLngs || this.isSupportedCode(o)) && (t = o);
    }), !t && this.options.supportedLngs && e.forEach((n) => {
      if (t) return;
      const o = this.getScriptPartFromCode(n);
      if (this.isSupportedCode(o)) return t = o;
      const s = this.getLanguagePartFromCode(n);
      if (this.isSupportedCode(s)) return t = s;
      t = this.options.supportedLngs.find((a) => {
        if (a === s) return a;
        if (!(a.indexOf("-") < 0 && s.indexOf("-") < 0) && (a.indexOf("-") > 0 && s.indexOf("-") < 0 && a.substring(0, a.indexOf("-")) === s || a.indexOf(s) === 0 && s.length > 1))
          return a;
      });
    }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t;
  }
  getFallbackCodes(e, t) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(t)), L(e) && (e = [e]), Array.isArray(e)) return e;
    if (!t) return e.default || [];
    let n = e[t];
    return n || (n = e[this.getScriptPartFromCode(t)]), n || (n = e[this.formatLanguageCode(t)]), n || (n = e[this.getLanguagePartFromCode(t)]), n || (n = e.default), n || [];
  }
  toResolveHierarchy(e, t) {
    const n = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e), o = [], s = (a) => {
      a && (this.isSupportedCode(a) ? o.push(a) : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`));
    };
    return L(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && s(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && s(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && s(this.getLanguagePartFromCode(e))) : L(e) && s(this.formatLanguageCode(e)), n.forEach((a) => {
      o.indexOf(a) < 0 && s(this.formatLanguageCode(a));
    }), o;
  }
}
const Dt = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, Ft = {
  select: (r) => r === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class _r {
  constructor(e, t = {}) {
    this.languageUtils = e, this.options = t, this.logger = fe.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, t) {
    this.rules[e] = t;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, t = {}) {
    const n = Ne(e === "dev" ? "en" : e), o = t.ordinal ? "ordinal" : "cardinal", s = JSON.stringify({
      cleanedCode: n,
      type: o
    });
    if (s in this.pluralRulesCache)
      return this.pluralRulesCache[s];
    let a;
    try {
      a = new Intl.PluralRules(n, {
        type: o
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), Ft;
      if (!e.match(/-|_/)) return Ft;
      const u = this.languageUtils.getLanguagePartFromCode(e);
      a = this.getRule(u, t);
    }
    return this.pluralRulesCache[s] = a, a;
  }
  needsPlural(e, t = {}) {
    let n = this.getRule(e, t);
    return n || (n = this.getRule("dev", t)), n?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(e, t, n = {}) {
    return this.getSuffixes(e, n).map((o) => `${t}${o}`);
  }
  getSuffixes(e, t = {}) {
    let n = this.getRule(e, t);
    return n || (n = this.getRule("dev", t)), n ? n.resolvedOptions().pluralCategories.sort((o, s) => Dt[o] - Dt[s]).map((o) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ""}${o}`) : [];
  }
  getSuffix(e, t, n = {}) {
    const o = this.getRule(e, n);
    return o ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${o.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", t, n));
  }
}
const zt = (r, e, t, n = ".", o = !0) => {
  let s = wr(r, e, t);
  return !s && o && L(t) && (s = it(r, t, n), s === void 0 && (s = it(e, t, n))), s;
}, tt = (r) => r.replace(/\$/g, "$$$$");
class Lr {
  constructor(e = {}) {
    this.logger = fe.create("interpolator"), this.options = e, this.format = e?.interpolation?.format || ((t) => t), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: t,
      escapeValue: n,
      useRawValueToEscape: o,
      prefix: s,
      prefixEscaped: a,
      suffix: l,
      suffixEscaped: u,
      formatSeparator: f,
      unescapeSuffix: p,
      unescapePrefix: h,
      nestingPrefix: x,
      nestingPrefixEscaped: v,
      nestingSuffix: y,
      nestingSuffixEscaped: T,
      nestingOptionsSeparator: A,
      maxReplaces: K,
      alwaysFormat: U
    } = e.interpolation;
    this.escape = t !== void 0 ? t : Sr, this.escapeValue = n !== void 0 ? n : !0, this.useRawValueToEscape = o !== void 0 ? o : !1, this.prefix = s ? Oe(s) : a || "{{", this.suffix = l ? Oe(l) : u || "}}", this.formatSeparator = f || ",", this.unescapePrefix = p ? "" : h || "-", this.unescapeSuffix = this.unescapePrefix ? "" : p || "", this.nestingPrefix = x ? Oe(x) : v || Oe("$t("), this.nestingSuffix = y ? Oe(y) : T || Oe(")"), this.nestingOptionsSeparator = A || ",", this.maxReplaces = K || 1e3, this.alwaysFormat = U !== void 0 ? U : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (t, n) => t?.source === n ? (t.lastIndex = 0, t) : new RegExp(n, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, t, n, o) {
    let s, a, l;
    const u = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, f = (v) => {
      if (v.indexOf(this.formatSeparator) < 0) {
        const K = zt(t, u, v, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(K, void 0, n, {
          ...o,
          ...t,
          interpolationkey: v
        }) : K;
      }
      const y = v.split(this.formatSeparator), T = y.shift().trim(), A = y.join(this.formatSeparator).trim();
      return this.format(zt(t, u, T, this.options.keySeparator, this.options.ignoreJSONStructure), A, n, {
        ...o,
        ...t,
        interpolationkey: T
      });
    };
    this.resetRegExp();
    const p = o?.missingInterpolationHandler || this.options.missingInterpolationHandler, h = o?.interpolation?.skipOnVariables !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (v) => tt(v)
    }, {
      regex: this.regexp,
      safeValue: (v) => this.escapeValue ? tt(this.escape(v)) : tt(v)
    }].forEach((v) => {
      for (l = 0; s = v.regex.exec(e); ) {
        const y = s[1].trim();
        if (a = f(y), a === void 0)
          if (typeof p == "function") {
            const A = p(e, s, o);
            a = L(A) ? A : "";
          } else if (o && Object.prototype.hasOwnProperty.call(o, y))
            a = "";
          else if (h) {
            a = s[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${y} for interpolating ${e}`), a = "";
        else !L(a) && !this.useRawValueToEscape && (a = Lt(a));
        const T = v.safeValue(a);
        if (e = e.replace(s[0], T), h ? (v.regex.lastIndex += a.length, v.regex.lastIndex -= s[0].length) : v.regex.lastIndex = 0, l++, l >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, t, n = {}) {
    let o, s, a;
    const l = (u, f) => {
      const p = this.nestingOptionsSeparator;
      if (u.indexOf(p) < 0) return u;
      const h = u.split(new RegExp(`${p}[ ]*{`));
      let x = `{${h[1]}`;
      u = h[0], x = this.interpolate(x, a);
      const v = x.match(/'/g), y = x.match(/"/g);
      ((v?.length ?? 0) % 2 === 0 && !y || y.length % 2 !== 0) && (x = x.replace(/'/g, '"'));
      try {
        a = JSON.parse(x), f && (a = {
          ...f,
          ...a
        });
      } catch (T) {
        return this.logger.warn(`failed parsing options string in nesting for key ${u}`, T), `${u}${p}${x}`;
      }
      return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, u;
    };
    for (; o = this.nestingRegexp.exec(e); ) {
      let u = [];
      a = {
        ...n
      }, a = a.replace && !L(a.replace) ? a.replace : a, a.applyPostProcessor = !1, delete a.defaultValue;
      const f = /{.*}/.test(o[1]) ? o[1].lastIndexOf("}") + 1 : o[1].indexOf(this.formatSeparator);
      if (f !== -1 && (u = o[1].slice(f).split(this.formatSeparator).map((p) => p.trim()).filter(Boolean), o[1] = o[1].slice(0, f)), s = t(l.call(this, o[1].trim(), a), a), s && o[0] === e && !L(s)) return s;
      L(s) || (s = Lt(s)), s || (this.logger.warn(`missed to resolve ${o[1]} for nesting ${e}`), s = ""), u.length && (s = u.reduce((p, h) => this.format(p, h, n.lng, {
        ...n,
        interpolationkey: o[1].trim()
      }), s.trim())), e = e.replace(o[0], s), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Tr = (r) => {
  let e = r.toLowerCase().trim();
  const t = {};
  if (r.indexOf("(") > -1) {
    const n = r.split("(");
    e = n[0].toLowerCase().trim();
    const o = n[1].substring(0, n[1].length - 1);
    e === "currency" && o.indexOf(":") < 0 ? t.currency || (t.currency = o.trim()) : e === "relativetime" && o.indexOf(":") < 0 ? t.range || (t.range = o.trim()) : o.split(";").forEach((a) => {
      if (a) {
        const [l, ...u] = a.split(":"), f = u.join(":").trim().replace(/^'+|'+$/g, ""), p = l.trim();
        t[p] || (t[p] = f), f === "false" && (t[p] = !1), f === "true" && (t[p] = !0), isNaN(f) || (t[p] = parseInt(f, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: t
  };
}, Ut = (r) => {
  const e = {};
  return (t, n, o) => {
    let s = o;
    o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey] && (s = {
      ...s,
      [o.interpolationkey]: void 0
    });
    const a = n + JSON.stringify(s);
    let l = e[a];
    return l || (l = r(Ne(n), o), e[a] = l), l(t);
  };
}, Ar = (r) => (e, t, n) => r(Ne(t), n)(e);
class jr {
  constructor(e = {}) {
    this.logger = fe.create("formatter"), this.options = e, this.init(e);
  }
  init(e, t = {
    interpolation: {}
  }) {
    this.formatSeparator = t.interpolation.formatSeparator || ",";
    const n = t.cacheInBuiltFormats ? Ut : Ar;
    this.formats = {
      number: n((o, s) => {
        const a = new Intl.NumberFormat(o, {
          ...s
        });
        return (l) => a.format(l);
      }),
      currency: n((o, s) => {
        const a = new Intl.NumberFormat(o, {
          ...s,
          style: "currency"
        });
        return (l) => a.format(l);
      }),
      datetime: n((o, s) => {
        const a = new Intl.DateTimeFormat(o, {
          ...s
        });
        return (l) => a.format(l);
      }),
      relativetime: n((o, s) => {
        const a = new Intl.RelativeTimeFormat(o, {
          ...s
        });
        return (l) => a.format(l, s.range || "day");
      }),
      list: n((o, s) => {
        const a = new Intl.ListFormat(o, {
          ...s
        });
        return (l) => a.format(l);
      })
    };
  }
  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t;
  }
  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = Ut(t);
  }
  format(e, t, n, o = {}) {
    const s = t.split(this.formatSeparator);
    if (s.length > 1 && s[0].indexOf("(") > 1 && s[0].indexOf(")") < 0 && s.find((l) => l.indexOf(")") > -1)) {
      const l = s.findIndex((u) => u.indexOf(")") > -1);
      s[0] = [s[0], ...s.splice(1, l)].join(this.formatSeparator);
    }
    return s.reduce((l, u) => {
      const {
        formatName: f,
        formatOptions: p
      } = Tr(u);
      if (this.formats[f]) {
        let h = l;
        try {
          const x = o?.formatParams?.[o.interpolationkey] || {}, v = x.locale || x.lng || o.locale || o.lng || n;
          h = this.formats[f](l, v, {
            ...p,
            ...o,
            ...x
          });
        } catch (x) {
          this.logger.warn(x);
        }
        return h;
      } else
        this.logger.warn(`there was no format function for ${f}`);
      return l;
    }, e);
  }
}
const Nr = (r, e) => {
  r.pending[e] !== void 0 && (delete r.pending[e], r.pendingCount--);
};
class $r extends Xe {
  constructor(e, t, n, o = {}) {
    super(), this.backend = e, this.store = t, this.services = n, this.languageUtils = n.languageUtils, this.options = o, this.logger = fe.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = o.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = o.maxRetries >= 0 ? o.maxRetries : 5, this.retryTimeout = o.retryTimeout >= 1 ? o.retryTimeout : 350, this.state = {}, this.queue = [], this.backend?.init?.(n, o.backend, o);
  }
  queueLoad(e, t, n, o) {
    const s = {}, a = {}, l = {}, u = {};
    return e.forEach((f) => {
      let p = !0;
      t.forEach((h) => {
        const x = `${f}|${h}`;
        !n.reload && this.store.hasResourceBundle(f, h) ? this.state[x] = 2 : this.state[x] < 0 || (this.state[x] === 1 ? a[x] === void 0 && (a[x] = !0) : (this.state[x] = 1, p = !1, a[x] === void 0 && (a[x] = !0), s[x] === void 0 && (s[x] = !0), u[h] === void 0 && (u[h] = !0)));
      }), p || (l[f] = !0);
    }), (Object.keys(s).length || Object.keys(a).length) && this.queue.push({
      pending: a,
      pendingCount: Object.keys(a).length,
      loaded: {},
      errors: [],
      callback: o
    }), {
      toLoad: Object.keys(s),
      pending: Object.keys(a),
      toLoadLanguages: Object.keys(l),
      toLoadNamespaces: Object.keys(u)
    };
  }
  loaded(e, t, n) {
    const o = e.split("|"), s = o[0], a = o[1];
    t && this.emit("failedLoading", s, a, t), !t && n && this.store.addResourceBundle(s, a, n, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = t ? -1 : 2, t && n && (this.state[e] = 0);
    const l = {};
    this.queue.forEach((u) => {
      vr(u.loaded, [s], a), Nr(u, e), t && u.errors.push(t), u.pendingCount === 0 && !u.done && (Object.keys(u.loaded).forEach((f) => {
        l[f] || (l[f] = {});
        const p = u.loaded[f];
        p.length && p.forEach((h) => {
          l[f][h] === void 0 && (l[f][h] = !0);
        });
      }), u.done = !0, u.errors.length ? u.callback(u.errors) : u.callback());
    }), this.emit("loaded", l), this.queue = this.queue.filter((u) => !u.done);
  }
  read(e, t, n, o = 0, s = this.retryTimeout, a) {
    if (!e.length) return a(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: t,
        fcName: n,
        tried: o,
        wait: s,
        callback: a
      });
      return;
    }
    this.readingCalls++;
    const l = (f, p) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const h = this.waitingReads.shift();
        this.read(h.lng, h.ns, h.fcName, h.tried, h.wait, h.callback);
      }
      if (f && p && o < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, t, n, o + 1, s * 2, a);
        }, s);
        return;
      }
      a(f, p);
    }, u = this.backend[n].bind(this.backend);
    if (u.length === 2) {
      try {
        const f = u(e, t);
        f && typeof f.then == "function" ? f.then((p) => l(null, p)).catch(l) : l(null, f);
      } catch (f) {
        l(f);
      }
      return;
    }
    return u(e, t, l);
  }
  prepareLoading(e, t, n = {}, o) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), o && o();
    L(e) && (e = this.languageUtils.toResolveHierarchy(e)), L(t) && (t = [t]);
    const s = this.queueLoad(e, t, n, o);
    if (!s.toLoad.length)
      return s.pending.length || o(), null;
    s.toLoad.forEach((a) => {
      this.loadOne(a);
    });
  }
  load(e, t, n) {
    this.prepareLoading(e, t, {}, n);
  }
  reload(e, t, n) {
    this.prepareLoading(e, t, {
      reload: !0
    }, n);
  }
  loadOne(e, t = "") {
    const n = e.split("|"), o = n[0], s = n[1];
    this.read(o, s, "read", void 0, void 0, (a, l) => {
      a && this.logger.warn(`${t}loading namespace ${s} for language ${o} failed`, a), !a && l && this.logger.log(`${t}loaded namespace ${s} for language ${o}`, l), this.loaded(e, a, l);
    });
  }
  saveMissing(e, t, n, o, s, a = {}, l = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(t)) {
      this.logger.warn(`did not save key "${n}" as the namespace "${t}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(n == null || n === "")) {
      if (this.backend?.create) {
        const u = {
          ...a,
          isUpdate: s
        }, f = this.backend.create.bind(this.backend);
        if (f.length < 6)
          try {
            let p;
            f.length === 5 ? p = f(e, t, n, o, u) : p = f(e, t, n, o), p && typeof p.then == "function" ? p.then((h) => l(null, h)).catch(l) : l(null, p);
          } catch (p) {
            l(p);
          }
        else
          f(e, t, n, o, l, u);
      }
      !e || !e[0] || this.store.addResource(e[0], t, n, o);
    }
  }
}
const Ht = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (r) => {
    let e = {};
    if (typeof r[1] == "object" && (e = r[1]), L(r[1]) && (e.defaultValue = r[1]), L(r[2]) && (e.tDescription = r[2]), typeof r[2] == "object" || typeof r[3] == "object") {
      const t = r[3] || r[2];
      Object.keys(t).forEach((n) => {
        e[n] = t[n];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (r) => r,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), Vt = (r) => (L(r.ns) && (r.ns = [r.ns]), L(r.fallbackLng) && (r.fallbackLng = [r.fallbackLng]), L(r.fallbackNS) && (r.fallbackNS = [r.fallbackNS]), r.supportedLngs?.indexOf?.("cimode") < 0 && (r.supportedLngs = r.supportedLngs.concat(["cimode"])), typeof r.initImmediate == "boolean" && (r.initAsync = r.initImmediate), r), Ke = () => {
}, Ir = (r) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(r)).forEach((t) => {
    typeof r[t] == "function" && (r[t] = r[t].bind(r));
  });
};
class $e extends Xe {
  constructor(e = {}, t) {
    if (super(), this.options = Vt(e), this.services = {}, this.logger = fe, this.modules = {
      external: []
    }, Ir(this), t && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, t), this;
      setTimeout(() => {
        this.init(e, t);
      }, 0);
    }
  }
  init(e = {}, t) {
    this.isInitializing = !0, typeof e == "function" && (t = e, e = {}), e.defaultNS == null && e.ns && (L(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const n = Ht();
    this.options = {
      ...n,
      ...this.options,
      ...Vt(e)
    }, this.options.interpolation = {
      ...n.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator);
    const o = (f) => f ? typeof f == "function" ? new f() : f : null;
    if (!this.options.isClone) {
      this.modules.logger ? fe.init(o(this.modules.logger), this.options) : fe.init(null, this.options);
      let f;
      this.modules.formatter ? f = this.modules.formatter : f = jr;
      const p = new Mt(this.options);
      this.store = new Nt(this.options.resources, this.options);
      const h = this.services;
      h.logger = fe, h.resourceStore = this.store, h.languageUtils = p, h.pluralResolver = new _r(p, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== n.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), f && (!this.options.interpolation.format || this.options.interpolation.format === n.interpolation.format) && (h.formatter = o(f), h.formatter.init && h.formatter.init(h, this.options), this.options.interpolation.format = h.formatter.format.bind(h.formatter)), h.interpolator = new Lr(this.options), h.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, h.backendConnector = new $r(o(this.modules.backend), h.resourceStore, h, this.options), h.backendConnector.on("*", (v, ...y) => {
        this.emit(v, ...y);
      }), this.modules.languageDetector && (h.languageDetector = o(this.modules.languageDetector), h.languageDetector.init && h.languageDetector.init(h, this.options.detection, this.options)), this.modules.i18nFormat && (h.i18nFormat = o(this.modules.i18nFormat), h.i18nFormat.init && h.i18nFormat.init(this)), this.translator = new Ye(this.services, this.options), this.translator.on("*", (v, ...y) => {
        this.emit(v, ...y);
      }), this.modules.external.forEach((v) => {
        v.init && v.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, t || (t = Ke), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const f = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      f.length > 0 && f[0] !== "dev" && (this.options.lng = f[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((f) => {
      this[f] = (...p) => this.store[f](...p);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((f) => {
      this[f] = (...p) => (this.store[f](...p), this);
    });
    const l = Te(), u = () => {
      const f = (p, h) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), l.resolve(h), t(p, h);
      };
      if (this.languages && !this.isInitialized) return f(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, f);
    };
    return this.options.resources || !this.options.initAsync ? u() : setTimeout(u, 0), l;
  }
  loadResources(e, t = Ke) {
    let n = t;
    const o = L(e) ? e : this.language;
    if (typeof e == "function" && (n = e), !this.options.resources || this.options.partialBundledLanguages) {
      if (o?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return n();
      const s = [], a = (l) => {
        if (!l || l === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(l).forEach((f) => {
          f !== "cimode" && s.indexOf(f) < 0 && s.push(f);
        });
      };
      o ? a(o) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((u) => a(u)), this.options.preload?.forEach?.((l) => a(l)), this.services.backendConnector.load(s, this.options.ns, (l) => {
        !l && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), n(l);
      });
    } else
      n(null);
  }
  reloadResources(e, t, n) {
    const o = Te();
    return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), n || (n = Ke), this.services.backendConnector.reload(e, t, (s) => {
      o.resolve(), n(s);
    }), o;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && bn.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1)) {
      for (let t = 0; t < this.languages.length; t++) {
        const n = this.languages[t];
        if (!(["cimode", "dev"].indexOf(n) > -1) && this.store.hasLanguageSomeTranslations(n)) {
          this.resolvedLanguage = n;
          break;
        }
      }
      !this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e));
    }
  }
  changeLanguage(e, t) {
    this.isLanguageChangingTo = e;
    const n = Te();
    this.emit("languageChanging", e);
    const o = (l) => {
      this.language = l, this.languages = this.services.languageUtils.toResolveHierarchy(l), this.resolvedLanguage = void 0, this.setResolvedLanguage(l);
    }, s = (l, u) => {
      u ? this.isLanguageChangingTo === e && (o(u), this.translator.changeLanguage(u), this.isLanguageChangingTo = void 0, this.emit("languageChanged", u), this.logger.log("languageChanged", u)) : this.isLanguageChangingTo = void 0, n.resolve((...f) => this.t(...f)), t && t(l, (...f) => this.t(...f));
    }, a = (l) => {
      !e && !l && this.services.languageDetector && (l = []);
      const u = L(l) ? l : l && l[0], f = this.store.hasLanguageSomeTranslations(u) ? u : this.services.languageUtils.getBestMatchFromCodes(L(l) ? [l] : l);
      f && (this.language || o(f), this.translator.language || this.translator.changeLanguage(f), this.services.languageDetector?.cacheUserLanguage?.(f)), this.loadResources(f, (p) => {
        s(p, f);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? a(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(a) : this.services.languageDetector.detect(a) : a(e), n;
  }
  getFixedT(e, t, n) {
    const o = (s, a, ...l) => {
      let u;
      typeof a != "object" ? u = this.options.overloadTranslationOptionHandler([s, a].concat(l)) : u = {
        ...a
      }, u.lng = u.lng || o.lng, u.lngs = u.lngs || o.lngs, u.ns = u.ns || o.ns, u.keyPrefix !== "" && (u.keyPrefix = u.keyPrefix || n || o.keyPrefix);
      const f = this.options.keySeparator || ".";
      let p;
      return u.keyPrefix && Array.isArray(s) ? p = s.map((h) => (typeof h == "function" && (h = at(h, {
        ...this.options,
        ...a
      })), `${u.keyPrefix}${f}${h}`)) : (typeof s == "function" && (s = at(s, {
        ...this.options,
        ...a
      })), p = u.keyPrefix ? `${u.keyPrefix}${f}${s}` : s), this.t(p, u);
    };
    return L(e) ? o.lng = e : o.lngs = e, o.ns = t, o.keyPrefix = n, o;
  }
  t(...e) {
    return this.translator?.translate(...e);
  }
  exists(...e) {
    return this.translator?.exists(...e);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e, t = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const n = t.lng || this.resolvedLanguage || this.languages[0], o = this.options ? this.options.fallbackLng : !1, s = this.languages[this.languages.length - 1];
    if (n.toLowerCase() === "cimode") return !0;
    const a = (l, u) => {
      const f = this.services.backendConnector.state[`${l}|${u}`];
      return f === -1 || f === 0 || f === 2;
    };
    if (t.precheck) {
      const l = t.precheck(this, a);
      if (l !== void 0) return l;
    }
    return !!(this.hasResourceBundle(n, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || a(n, e) && (!o || a(s, e)));
  }
  loadNamespaces(e, t) {
    const n = Te();
    return this.options.ns ? (L(e) && (e = [e]), e.forEach((o) => {
      this.options.ns.indexOf(o) < 0 && this.options.ns.push(o);
    }), this.loadResources((o) => {
      n.resolve(), t && t(o);
    }), n) : (t && t(), Promise.resolve());
  }
  loadLanguages(e, t) {
    const n = Te();
    L(e) && (e = [e]);
    const o = this.options.preload || [], s = e.filter((a) => o.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a));
    return s.length ? (this.options.preload = o.concat(s), this.loadResources((a) => {
      n.resolve(), t && t(a);
    }), n) : (t && t(), Promise.resolve());
  }
  dir(e) {
    if (e || (e = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const o = new Intl.Locale(e);
      if (o && o.getTextInfo) {
        const s = o.getTextInfo();
        if (s && s.direction) return s.direction;
      }
    } catch {
    }
    const t = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], n = this.services?.languageUtils || new Mt(Ht());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : t.indexOf(n.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, t) {
    return new $e(e, t);
  }
  cloneInstance(e = {}, t = Ke) {
    const n = e.forkResourceStore;
    n && delete e.forkResourceStore;
    const o = {
      ...this.options,
      ...e,
      isClone: !0
    }, s = new $e(o);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (s.logger = s.logger.clone(e)), ["store", "services", "language"].forEach((l) => {
      s[l] = this[l];
    }), s.services = {
      ...this.services
    }, s.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, n) {
      const l = Object.keys(this.store.data).reduce((u, f) => (u[f] = {
        ...this.store.data[f]
      }, u[f] = Object.keys(u[f]).reduce((p, h) => (p[h] = {
        ...u[f][h]
      }, p), u[f]), u), {});
      s.store = new Nt(l, o), s.services.resourceStore = s.store;
    }
    return s.translator = new Ye(s.services, o), s.translator.on("*", (l, ...u) => {
      s.emit(l, ...u);
    }), s.init(o, t), s.translator.options = o, s.translator.backendConnector.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, s;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const se = $e.createInstance();
se.createInstance = $e.createInstance;
se.createInstance;
se.dir;
se.init;
se.loadResources;
se.reloadResources;
se.use;
se.changeLanguage;
se.getFixedT;
se.t;
se.exists;
se.setDefaultNamespace;
se.hasLoadedNamespace;
se.loadNamespaces;
se.loadLanguages;
var Do = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Mr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var qe = { exports: {} }, N = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Kt;
function Dr() {
  if (Kt) return N;
  Kt = 1;
  var r = Symbol.for("react.transitional.element"), e = Symbol.for("react.portal"), t = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), s = Symbol.for("react.consumer"), a = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), h = Symbol.iterator;
  function x(c) {
    return c === null || typeof c != "object" ? null : (c = h && c[h] || c["@@iterator"], typeof c == "function" ? c : null);
  }
  var v = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, y = Object.assign, T = {};
  function A(c, g, E) {
    this.props = c, this.context = g, this.refs = T, this.updater = E || v;
  }
  A.prototype.isReactComponent = {}, A.prototype.setState = function(c, g) {
    if (typeof c != "object" && typeof c != "function" && c != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, c, g, "setState");
  }, A.prototype.forceUpdate = function(c) {
    this.updater.enqueueForceUpdate(this, c, "forceUpdate");
  };
  function K() {
  }
  K.prototype = A.prototype;
  function U(c, g, E) {
    this.props = c, this.context = g, this.refs = T, this.updater = E || v;
  }
  var H = U.prototype = new K();
  H.constructor = U, y(H, A.prototype), H.isPureReactComponent = !0;
  var M = Array.isArray, R = { H: null, A: null, T: null, S: null, V: null }, V = Object.prototype.hasOwnProperty;
  function W(c, g, E, w, _, G) {
    return E = G.ref, {
      $$typeof: r,
      type: c,
      key: g,
      ref: E !== void 0 ? E : null,
      props: G
    };
  }
  function C(c, g) {
    return W(
      c.type,
      g,
      void 0,
      void 0,
      void 0,
      c.props
    );
  }
  function Q(c) {
    return typeof c == "object" && c !== null && c.$$typeof === r;
  }
  function oe(c) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + c.replace(/[=:]/g, function(E) {
      return g[E];
    });
  }
  var X = /\/+/g;
  function ie(c, g) {
    return typeof c == "object" && c !== null && c.key != null ? oe("" + c.key) : g.toString(36);
  }
  function te() {
  }
  function Z(c) {
    switch (c.status) {
      case "fulfilled":
        return c.value;
      case "rejected":
        throw c.reason;
      default:
        switch (typeof c.status == "string" ? c.then(te, te) : (c.status = "pending", c.then(
          function(g) {
            c.status === "pending" && (c.status = "fulfilled", c.value = g);
          },
          function(g) {
            c.status === "pending" && (c.status = "rejected", c.reason = g);
          }
        )), c.status) {
          case "fulfilled":
            return c.value;
          case "rejected":
            throw c.reason;
        }
    }
    throw c;
  }
  function ne(c, g, E, w, _) {
    var G = typeof c;
    (G === "undefined" || G === "boolean") && (c = null);
    var j = !1;
    if (c === null) j = !0;
    else
      switch (G) {
        case "bigint":
        case "string":
        case "number":
          j = !0;
          break;
        case "object":
          switch (c.$$typeof) {
            case r:
            case e:
              j = !0;
              break;
            case p:
              return j = c._init, ne(
                j(c._payload),
                g,
                E,
                w,
                _
              );
          }
      }
    if (j)
      return _ = _(c), j = w === "" ? "." + ie(c, 0) : w, M(_) ? (E = "", j != null && (E = j.replace(X, "$&/") + "/"), ne(_, g, E, "", function(ue) {
        return ue;
      })) : _ != null && (Q(_) && (_ = C(
        _,
        E + (_.key == null || c && c.key === _.key ? "" : ("" + _.key).replace(
          X,
          "$&/"
        ) + "/") + j
      )), g.push(_)), 1;
    j = 0;
    var B = w === "" ? "." : w + ":";
    if (M(c))
      for (var J = 0; J < c.length; J++)
        w = c[J], G = B + ie(w, J), j += ne(
          w,
          g,
          E,
          G,
          _
        );
    else if (J = x(c), typeof J == "function")
      for (c = J.call(c), J = 0; !(w = c.next()).done; )
        w = w.value, G = B + ie(w, J++), j += ne(
          w,
          g,
          E,
          G,
          _
        );
    else if (G === "object") {
      if (typeof c.then == "function")
        return ne(
          Z(c),
          g,
          E,
          w,
          _
        );
      throw g = String(c), Error(
        "Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(c).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return j;
  }
  function q(c, g, E) {
    if (c == null) return c;
    var w = [], _ = 0;
    return ne(c, w, "", "", function(G) {
      return g.call(E, G, _++);
    }), w;
  }
  function ee(c) {
    if (c._status === -1) {
      var g = c._result;
      g = g(), g.then(
        function(E) {
          (c._status === 0 || c._status === -1) && (c._status = 1, c._result = E);
        },
        function(E) {
          (c._status === 0 || c._status === -1) && (c._status = 2, c._result = E);
        }
      ), c._status === -1 && (c._status = 0, c._result = g);
    }
    if (c._status === 1) return c._result.default;
    throw c._result;
  }
  var O = typeof reportError == "function" ? reportError : function(c) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var g = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof c == "object" && c !== null && typeof c.message == "string" ? String(c.message) : String(c),
        error: c
      });
      if (!window.dispatchEvent(g)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", c);
      return;
    }
    console.error(c);
  };
  function ae() {
  }
  return N.Children = {
    map: q,
    forEach: function(c, g, E) {
      q(
        c,
        function() {
          g.apply(this, arguments);
        },
        E
      );
    },
    count: function(c) {
      var g = 0;
      return q(c, function() {
        g++;
      }), g;
    },
    toArray: function(c) {
      return q(c, function(g) {
        return g;
      }) || [];
    },
    only: function(c) {
      if (!Q(c))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return c;
    }
  }, N.Component = A, N.Fragment = t, N.Profiler = o, N.PureComponent = U, N.StrictMode = n, N.Suspense = u, N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = R, N.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(c) {
      return R.H.useMemoCache(c);
    }
  }, N.cache = function(c) {
    return function() {
      return c.apply(null, arguments);
    };
  }, N.cloneElement = function(c, g, E) {
    if (c == null)
      throw Error(
        "The argument must be a React element, but you passed " + c + "."
      );
    var w = y({}, c.props), _ = c.key, G = void 0;
    if (g != null)
      for (j in g.ref !== void 0 && (G = void 0), g.key !== void 0 && (_ = "" + g.key), g)
        !V.call(g, j) || j === "key" || j === "__self" || j === "__source" || j === "ref" && g.ref === void 0 || (w[j] = g[j]);
    var j = arguments.length - 2;
    if (j === 1) w.children = E;
    else if (1 < j) {
      for (var B = Array(j), J = 0; J < j; J++)
        B[J] = arguments[J + 2];
      w.children = B;
    }
    return W(c.type, _, void 0, void 0, G, w);
  }, N.createContext = function(c) {
    return c = {
      $$typeof: a,
      _currentValue: c,
      _currentValue2: c,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, c.Provider = c, c.Consumer = {
      $$typeof: s,
      _context: c
    }, c;
  }, N.createElement = function(c, g, E) {
    var w, _ = {}, G = null;
    if (g != null)
      for (w in g.key !== void 0 && (G = "" + g.key), g)
        V.call(g, w) && w !== "key" && w !== "__self" && w !== "__source" && (_[w] = g[w]);
    var j = arguments.length - 2;
    if (j === 1) _.children = E;
    else if (1 < j) {
      for (var B = Array(j), J = 0; J < j; J++)
        B[J] = arguments[J + 2];
      _.children = B;
    }
    if (c && c.defaultProps)
      for (w in j = c.defaultProps, j)
        _[w] === void 0 && (_[w] = j[w]);
    return W(c, G, void 0, void 0, null, _);
  }, N.createRef = function() {
    return { current: null };
  }, N.forwardRef = function(c) {
    return { $$typeof: l, render: c };
  }, N.isValidElement = Q, N.lazy = function(c) {
    return {
      $$typeof: p,
      _payload: { _status: -1, _result: c },
      _init: ee
    };
  }, N.memo = function(c, g) {
    return {
      $$typeof: f,
      type: c,
      compare: g === void 0 ? null : g
    };
  }, N.startTransition = function(c) {
    var g = R.T, E = {};
    R.T = E;
    try {
      var w = c(), _ = R.S;
      _ !== null && _(E, w), typeof w == "object" && w !== null && typeof w.then == "function" && w.then(ae, O);
    } catch (G) {
      O(G);
    } finally {
      R.T = g;
    }
  }, N.unstable_useCacheRefresh = function() {
    return R.H.useCacheRefresh();
  }, N.use = function(c) {
    return R.H.use(c);
  }, N.useActionState = function(c, g, E) {
    return R.H.useActionState(c, g, E);
  }, N.useCallback = function(c, g) {
    return R.H.useCallback(c, g);
  }, N.useContext = function(c) {
    return R.H.useContext(c);
  }, N.useDebugValue = function() {
  }, N.useDeferredValue = function(c, g) {
    return R.H.useDeferredValue(c, g);
  }, N.useEffect = function(c, g, E) {
    var w = R.H;
    if (typeof E == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return w.useEffect(c, g);
  }, N.useId = function() {
    return R.H.useId();
  }, N.useImperativeHandle = function(c, g, E) {
    return R.H.useImperativeHandle(c, g, E);
  }, N.useInsertionEffect = function(c, g) {
    return R.H.useInsertionEffect(c, g);
  }, N.useLayoutEffect = function(c, g) {
    return R.H.useLayoutEffect(c, g);
  }, N.useMemo = function(c, g) {
    return R.H.useMemo(c, g);
  }, N.useOptimistic = function(c, g) {
    return R.H.useOptimistic(c, g);
  }, N.useReducer = function(c, g, E) {
    return R.H.useReducer(c, g, E);
  }, N.useRef = function(c) {
    return R.H.useRef(c);
  }, N.useState = function(c) {
    return R.H.useState(c);
  }, N.useSyncExternalStore = function(c, g, E) {
    return R.H.useSyncExternalStore(
      c,
      g,
      E
    );
  }, N.useTransition = function() {
    return R.H.useTransition();
  }, N.version = "19.1.1", N;
}
var Ae = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Ae.exports;
var qt;
function Fr() {
  return qt || (qt = 1, (function(r, e) {
    process.env.NODE_ENV !== "production" && (function() {
      function t(i, d) {
        Object.defineProperty(s.prototype, i, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              d[0],
              d[1]
            );
          }
        });
      }
      function n(i) {
        return i === null || typeof i != "object" ? null : (i = xe && i[xe] || i["@@iterator"], typeof i == "function" ? i : null);
      }
      function o(i, d) {
        i = (i = i.constructor) && (i.displayName || i.name) || "ReactClass";
        var m = i + "." + d;
        me[m] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          d,
          i
        ), me[m] = !0);
      }
      function s(i, d, m) {
        this.props = i, this.context = d, this.refs = Qe, this.updater = m || ht;
      }
      function a() {
      }
      function l(i, d, m) {
        this.props = i, this.context = d, this.refs = Qe, this.updater = m || ht;
      }
      function u(i) {
        return "" + i;
      }
      function f(i) {
        try {
          u(i);
          var d = !1;
        } catch {
          d = !0;
        }
        if (d) {
          d = console;
          var m = d.error, b = typeof Symbol == "function" && Symbol.toStringTag && i[Symbol.toStringTag] || i.constructor.name || "Object";
          return m.call(
            d,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            b
          ), u(i);
        }
      }
      function p(i) {
        if (i == null) return null;
        if (typeof i == "function")
          return i.$$typeof === Tn ? null : i.displayName || i.name || null;
        if (typeof i == "string") return i;
        switch (i) {
          case c:
            return "Fragment";
          case E:
            return "Profiler";
          case g:
            return "StrictMode";
          case j:
            return "Suspense";
          case B:
            return "SuspenseList";
          case we:
            return "Activity";
        }
        if (typeof i == "object")
          switch (typeof i.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), i.$$typeof) {
            case ae:
              return "Portal";
            case _:
              return (i.displayName || "Context") + ".Provider";
            case w:
              return (i._context.displayName || "Context") + ".Consumer";
            case G:
              var d = i.render;
              return i = i.displayName, i || (i = d.displayName || d.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
            case J:
              return d = i.displayName || null, d !== null ? d : p(i.type) || "Memo";
            case ue:
              d = i._payload, i = i._init;
              try {
                return p(i(d));
              } catch {
              }
          }
        return null;
      }
      function h(i) {
        if (i === c) return "<>";
        if (typeof i == "object" && i !== null && i.$$typeof === ue)
          return "<...>";
        try {
          var d = p(i);
          return d ? "<" + d + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      function x() {
        var i = F.A;
        return i === null ? null : i.getOwner();
      }
      function v() {
        return Error("react-stack-top-frame");
      }
      function y(i) {
        if (De.call(i, "key")) {
          var d = Object.getOwnPropertyDescriptor(i, "key").get;
          if (d && d.isReactWarning) return !1;
        }
        return i.key !== void 0;
      }
      function T(i, d) {
        function m() {
          bt || (bt = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            d
          ));
        }
        m.isReactWarning = !0, Object.defineProperty(i, "key", {
          get: m,
          configurable: !0
        });
      }
      function A() {
        var i = p(this.type);
        return wt[i] || (wt[i] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), i = this.props.ref, i !== void 0 ? i : null;
      }
      function K(i, d, m, b, P, z, $, Y) {
        return m = z.ref, i = {
          $$typeof: O,
          type: i,
          key: d,
          props: z,
          _owner: P
        }, (m !== void 0 ? m : null) !== null ? Object.defineProperty(i, "ref", {
          enumerable: !1,
          get: A
        }) : Object.defineProperty(i, "ref", { enumerable: !1, value: null }), i._store = {}, Object.defineProperty(i._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(i, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.defineProperty(i, "_debugStack", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: $
        }), Object.defineProperty(i, "_debugTask", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: Y
        }), Object.freeze && (Object.freeze(i.props), Object.freeze(i)), i;
      }
      function U(i, d) {
        return d = K(
          i.type,
          d,
          void 0,
          void 0,
          i._owner,
          i.props,
          i._debugStack,
          i._debugTask
        ), i._store && (d._store.validated = i._store.validated), d;
      }
      function H(i) {
        return typeof i == "object" && i !== null && i.$$typeof === O;
      }
      function M(i) {
        var d = { "=": "=0", ":": "=2" };
        return "$" + i.replace(/[=:]/g, function(m) {
          return d[m];
        });
      }
      function R(i, d) {
        return typeof i == "object" && i !== null && i.key != null ? (f(i.key), M("" + i.key)) : d.toString(36);
      }
      function V() {
      }
      function W(i) {
        switch (i.status) {
          case "fulfilled":
            return i.value;
          case "rejected":
            throw i.reason;
          default:
            switch (typeof i.status == "string" ? i.then(V, V) : (i.status = "pending", i.then(
              function(d) {
                i.status === "pending" && (i.status = "fulfilled", i.value = d);
              },
              function(d) {
                i.status === "pending" && (i.status = "rejected", i.reason = d);
              }
            )), i.status) {
              case "fulfilled":
                return i.value;
              case "rejected":
                throw i.reason;
            }
        }
        throw i;
      }
      function C(i, d, m, b, P) {
        var z = typeof i;
        (z === "undefined" || z === "boolean") && (i = null);
        var $ = !1;
        if (i === null) $ = !0;
        else
          switch (z) {
            case "bigint":
            case "string":
            case "number":
              $ = !0;
              break;
            case "object":
              switch (i.$$typeof) {
                case O:
                case ae:
                  $ = !0;
                  break;
                case ue:
                  return $ = i._init, C(
                    $(i._payload),
                    d,
                    m,
                    b,
                    P
                  );
              }
          }
        if ($) {
          $ = i, P = P($);
          var Y = b === "" ? "." + R($, 0) : b;
          return mt(P) ? (m = "", Y != null && (m = Y.replace(St, "$&/") + "/"), C(P, d, m, "", function(pe) {
            return pe;
          })) : P != null && (H(P) && (P.key != null && ($ && $.key === P.key || f(P.key)), m = U(
            P,
            m + (P.key == null || $ && $.key === P.key ? "" : ("" + P.key).replace(
              St,
              "$&/"
            ) + "/") + Y
          ), b !== "" && $ != null && H($) && $.key == null && $._store && !$._store.validated && (m._store.validated = 2), P = m), d.push(P)), 1;
        }
        if ($ = 0, Y = b === "" ? "." : b + ":", mt(i))
          for (var D = 0; D < i.length; D++)
            b = i[D], z = Y + R(b, D), $ += C(
              b,
              d,
              m,
              z,
              P
            );
        else if (D = n(i), typeof D == "function")
          for (D === i.entries && (xt || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), xt = !0), i = D.call(i), D = 0; !(b = i.next()).done; )
            b = b.value, z = Y + R(b, D++), $ += C(
              b,
              d,
              m,
              z,
              P
            );
        else if (z === "object") {
          if (typeof i.then == "function")
            return C(
              W(i),
              d,
              m,
              b,
              P
            );
          throw d = String(i), Error(
            "Objects are not valid as a React child (found: " + (d === "[object Object]" ? "object with keys {" + Object.keys(i).join(", ") + "}" : d) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return $;
      }
      function Q(i, d, m) {
        if (i == null) return i;
        var b = [], P = 0;
        return C(i, b, "", "", function(z) {
          return d.call(m, z, P++);
        }), b;
      }
      function oe(i) {
        if (i._status === -1) {
          var d = i._result;
          d = d(), d.then(
            function(m) {
              (i._status === 0 || i._status === -1) && (i._status = 1, i._result = m);
            },
            function(m) {
              (i._status === 0 || i._status === -1) && (i._status = 2, i._result = m);
            }
          ), i._status === -1 && (i._status = 0, i._result = d);
        }
        if (i._status === 1)
          return d = i._result, d === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            d
          ), "default" in d || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            d
          ), d.default;
        throw i._result;
      }
      function X() {
        var i = F.H;
        return i === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), i;
      }
      function ie() {
      }
      function te(i) {
        if (Fe === null)
          try {
            var d = ("require" + Math.random()).slice(0, 7);
            Fe = (r && r[d]).call(
              r,
              "timers"
            ).setImmediate;
          } catch {
            Fe = function(b) {
              Ot === !1 && (Ot = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var P = new MessageChannel();
              P.port1.onmessage = b, P.port2.postMessage(void 0);
            };
          }
        return Fe(i);
      }
      function Z(i) {
        return 1 < i.length && typeof AggregateError == "function" ? new AggregateError(i) : i[0];
      }
      function ne(i, d) {
        d !== ze - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), ze = d;
      }
      function q(i, d, m) {
        var b = F.actQueue;
        if (b !== null)
          if (b.length !== 0)
            try {
              ee(b), te(function() {
                return q(i, d, m);
              });
              return;
            } catch (P) {
              F.thrownErrors.push(P);
            }
          else F.actQueue = null;
        0 < F.thrownErrors.length ? (b = Z(F.thrownErrors), F.thrownErrors.length = 0, m(b)) : d(i);
      }
      function ee(i) {
        if (!Je) {
          Je = !0;
          var d = 0;
          try {
            for (; d < i.length; d++) {
              var m = i[d];
              do {
                F.didUsePromise = !1;
                var b = m(!1);
                if (b !== null) {
                  if (F.didUsePromise) {
                    i[d] = m, i.splice(0, d);
                    return;
                  }
                  m = b;
                } else break;
              } while (!0);
            }
            i.length = 0;
          } catch (P) {
            i.splice(0, d + 1), F.thrownErrors.push(P);
          } finally {
            Je = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var O = Symbol.for("react.transitional.element"), ae = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), w = Symbol.for("react.consumer"), _ = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), j = Symbol.for("react.suspense"), B = Symbol.for("react.suspense_list"), J = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), we = Symbol.for("react.activity"), xe = Symbol.iterator, me = {}, ht = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(i) {
          o(i, "forceUpdate");
        },
        enqueueReplaceState: function(i) {
          o(i, "replaceState");
        },
        enqueueSetState: function(i) {
          o(i, "setState");
        }
      }, gt = Object.assign, Qe = {};
      Object.freeze(Qe), s.prototype.isReactComponent = {}, s.prototype.setState = function(i, d) {
        if (typeof i != "object" && typeof i != "function" && i != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, i, d, "setState");
      }, s.prototype.forceUpdate = function(i) {
        this.updater.enqueueForceUpdate(this, i, "forceUpdate");
      };
      var le = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, Me;
      for (Me in le)
        le.hasOwnProperty(Me) && t(Me, le[Me]);
      a.prototype = s.prototype, le = l.prototype = new a(), le.constructor = l, gt(le, s.prototype), le.isPureReactComponent = !0;
      var mt = Array.isArray, Tn = Symbol.for("react.client.reference"), F = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null,
        actQueue: null,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, De = Object.prototype.hasOwnProperty, yt = console.createTask ? console.createTask : function() {
        return null;
      };
      le = {
        react_stack_bottom_frame: function(i) {
          return i();
        }
      };
      var bt, vt, wt = {}, An = le.react_stack_bottom_frame.bind(
        le,
        v
      )(), jn = yt(h(v)), xt = !1, St = /\/+/g, kt = typeof reportError == "function" ? reportError : function(i) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var d = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof i == "object" && i !== null && typeof i.message == "string" ? String(i.message) : String(i),
            error: i
          });
          if (!window.dispatchEvent(d)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", i);
          return;
        }
        console.error(i);
      }, Ot = !1, Fe = null, ze = 0, Ue = !1, Je = !1, Et = typeof queueMicrotask == "function" ? function(i) {
        queueMicrotask(function() {
          return queueMicrotask(i);
        });
      } : te;
      le = Object.freeze({
        __proto__: null,
        c: function(i) {
          return X().useMemoCache(i);
        }
      }), e.Children = {
        map: Q,
        forEach: function(i, d, m) {
          Q(
            i,
            function() {
              d.apply(this, arguments);
            },
            m
          );
        },
        count: function(i) {
          var d = 0;
          return Q(i, function() {
            d++;
          }), d;
        },
        toArray: function(i) {
          return Q(i, function(d) {
            return d;
          }) || [];
        },
        only: function(i) {
          if (!H(i))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return i;
        }
      }, e.Component = s, e.Fragment = c, e.Profiler = E, e.PureComponent = l, e.StrictMode = g, e.Suspense = j, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, e.__COMPILER_RUNTIME = le, e.act = function(i) {
        var d = F.actQueue, m = ze;
        ze++;
        var b = F.actQueue = d !== null ? d : [], P = !1;
        try {
          var z = i();
        } catch (D) {
          F.thrownErrors.push(D);
        }
        if (0 < F.thrownErrors.length)
          throw ne(d, m), i = Z(F.thrownErrors), F.thrownErrors.length = 0, i;
        if (z !== null && typeof z == "object" && typeof z.then == "function") {
          var $ = z;
          return Et(function() {
            P || Ue || (Ue = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(D, pe) {
              P = !0, $.then(
                function(Se) {
                  if (ne(d, m), m === 0) {
                    try {
                      ee(b), te(function() {
                        return q(
                          Se,
                          D,
                          pe
                        );
                      });
                    } catch ($n) {
                      F.thrownErrors.push($n);
                    }
                    if (0 < F.thrownErrors.length) {
                      var Nn = Z(
                        F.thrownErrors
                      );
                      F.thrownErrors.length = 0, pe(Nn);
                    }
                  } else D(Se);
                },
                function(Se) {
                  ne(d, m), 0 < F.thrownErrors.length && (Se = Z(
                    F.thrownErrors
                  ), F.thrownErrors.length = 0), pe(Se);
                }
              );
            }
          };
        }
        var Y = z;
        if (ne(d, m), m === 0 && (ee(b), b.length !== 0 && Et(function() {
          P || Ue || (Ue = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), F.actQueue = null), 0 < F.thrownErrors.length)
          throw i = Z(F.thrownErrors), F.thrownErrors.length = 0, i;
        return {
          then: function(D, pe) {
            P = !0, m === 0 ? (F.actQueue = b, te(function() {
              return q(
                Y,
                D,
                pe
              );
            })) : D(Y);
          }
        };
      }, e.cache = function(i) {
        return function() {
          return i.apply(null, arguments);
        };
      }, e.captureOwnerStack = function() {
        var i = F.getCurrentStack;
        return i === null ? null : i();
      }, e.cloneElement = function(i, d, m) {
        if (i == null)
          throw Error(
            "The argument must be a React element, but you passed " + i + "."
          );
        var b = gt({}, i.props), P = i.key, z = i._owner;
        if (d != null) {
          var $;
          e: {
            if (De.call(d, "ref") && ($ = Object.getOwnPropertyDescriptor(
              d,
              "ref"
            ).get) && $.isReactWarning) {
              $ = !1;
              break e;
            }
            $ = d.ref !== void 0;
          }
          $ && (z = x()), y(d) && (f(d.key), P = "" + d.key);
          for (Y in d)
            !De.call(d, Y) || Y === "key" || Y === "__self" || Y === "__source" || Y === "ref" && d.ref === void 0 || (b[Y] = d[Y]);
        }
        var Y = arguments.length - 2;
        if (Y === 1) b.children = m;
        else if (1 < Y) {
          $ = Array(Y);
          for (var D = 0; D < Y; D++)
            $[D] = arguments[D + 2];
          b.children = $;
        }
        for (b = K(
          i.type,
          P,
          void 0,
          void 0,
          z,
          b,
          i._debugStack,
          i._debugTask
        ), P = 2; P < arguments.length; P++)
          z = arguments[P], H(z) && z._store && (z._store.validated = 1);
        return b;
      }, e.createContext = function(i) {
        return i = {
          $$typeof: _,
          _currentValue: i,
          _currentValue2: i,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, i.Provider = i, i.Consumer = {
          $$typeof: w,
          _context: i
        }, i._currentRenderer = null, i._currentRenderer2 = null, i;
      }, e.createElement = function(i, d, m) {
        for (var b = 2; b < arguments.length; b++) {
          var P = arguments[b];
          H(P) && P._store && (P._store.validated = 1);
        }
        if (b = {}, P = null, d != null)
          for (D in vt || !("__self" in d) || "key" in d || (vt = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), y(d) && (f(d.key), P = "" + d.key), d)
            De.call(d, D) && D !== "key" && D !== "__self" && D !== "__source" && (b[D] = d[D]);
        var z = arguments.length - 2;
        if (z === 1) b.children = m;
        else if (1 < z) {
          for (var $ = Array(z), Y = 0; Y < z; Y++)
            $[Y] = arguments[Y + 2];
          Object.freeze && Object.freeze($), b.children = $;
        }
        if (i && i.defaultProps)
          for (D in z = i.defaultProps, z)
            b[D] === void 0 && (b[D] = z[D]);
        P && T(
          b,
          typeof i == "function" ? i.displayName || i.name || "Unknown" : i
        );
        var D = 1e4 > F.recentlyCreatedOwnerStacks++;
        return K(
          i,
          P,
          void 0,
          void 0,
          x(),
          b,
          D ? Error("react-stack-top-frame") : An,
          D ? yt(h(i)) : jn
        );
      }, e.createRef = function() {
        var i = { current: null };
        return Object.seal(i), i;
      }, e.forwardRef = function(i) {
        i != null && i.$$typeof === J ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof i != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          i === null ? "null" : typeof i
        ) : i.length !== 0 && i.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          i.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), i != null && i.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var d = { $$typeof: G, render: i }, m;
        return Object.defineProperty(d, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return m;
          },
          set: function(b) {
            m = b, i.name || i.displayName || (Object.defineProperty(i, "name", { value: b }), i.displayName = b);
          }
        }), d;
      }, e.isValidElement = H, e.lazy = function(i) {
        return {
          $$typeof: ue,
          _payload: { _status: -1, _result: i },
          _init: oe
        };
      }, e.memo = function(i, d) {
        i == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          i === null ? "null" : typeof i
        ), d = {
          $$typeof: J,
          type: i,
          compare: d === void 0 ? null : d
        };
        var m;
        return Object.defineProperty(d, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return m;
          },
          set: function(b) {
            m = b, i.name || i.displayName || (Object.defineProperty(i, "name", { value: b }), i.displayName = b);
          }
        }), d;
      }, e.startTransition = function(i) {
        var d = F.T, m = {};
        F.T = m, m._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var b = i(), P = F.S;
          P !== null && P(m, b), typeof b == "object" && b !== null && typeof b.then == "function" && b.then(ie, kt);
        } catch (z) {
          kt(z);
        } finally {
          d === null && m._updatedFibers && (i = m._updatedFibers.size, m._updatedFibers.clear(), 10 < i && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), F.T = d;
        }
      }, e.unstable_useCacheRefresh = function() {
        return X().useCacheRefresh();
      }, e.use = function(i) {
        return X().use(i);
      }, e.useActionState = function(i, d, m) {
        return X().useActionState(
          i,
          d,
          m
        );
      }, e.useCallback = function(i, d) {
        return X().useCallback(i, d);
      }, e.useContext = function(i) {
        var d = X();
        return i.$$typeof === w && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), d.useContext(i);
      }, e.useDebugValue = function(i, d) {
        return X().useDebugValue(i, d);
      }, e.useDeferredValue = function(i, d) {
        return X().useDeferredValue(i, d);
      }, e.useEffect = function(i, d, m) {
        i == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        var b = X();
        if (typeof m == "function")
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return b.useEffect(i, d);
      }, e.useId = function() {
        return X().useId();
      }, e.useImperativeHandle = function(i, d, m) {
        return X().useImperativeHandle(i, d, m);
      }, e.useInsertionEffect = function(i, d) {
        return i == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), X().useInsertionEffect(i, d);
      }, e.useLayoutEffect = function(i, d) {
        return i == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), X().useLayoutEffect(i, d);
      }, e.useMemo = function(i, d) {
        return X().useMemo(i, d);
      }, e.useOptimistic = function(i, d) {
        return X().useOptimistic(i, d);
      }, e.useReducer = function(i, d, m) {
        return X().useReducer(i, d, m);
      }, e.useRef = function(i) {
        return X().useRef(i);
      }, e.useState = function(i) {
        return X().useState(i);
      }, e.useSyncExternalStore = function(i, d, m) {
        return X().useSyncExternalStore(
          i,
          d,
          m
        );
      }, e.useTransition = function() {
        return X().useTransition();
      }, e.version = "19.1.1", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(Ae, Ae.exports)), Ae.exports;
}
var Gt;
function zr() {
  return Gt || (Gt = 1, process.env.NODE_ENV === "production" ? qe.exports = Dr() : qe.exports = Fr()), qe.exports;
}
var ce = zr();
const Bt = /* @__PURE__ */ Mr(ce), Ur = (r, e, t, n) => {
  const o = [t, {
    code: e,
    ...n || {}
  }];
  if (r?.services?.logger?.forward)
    return r.services.logger.forward(o, "warn", "react-i18next::", !0);
  be(o[0]) && (o[0] = `react-i18next:: ${o[0]}`), r?.services?.logger?.warn ? r.services.logger.warn(...o) : console?.warn && console.warn(...o);
}, Yt = {}, lt = (r, e, t, n) => {
  be(t) && Yt[t] || (be(t) && (Yt[t] = /* @__PURE__ */ new Date()), Ur(r, e, t, n));
}, wn = (r, e) => () => {
  if (r.isInitialized)
    e();
  else {
    const t = () => {
      setTimeout(() => {
        r.off("initialized", t);
      }, 0), e();
    };
    r.on("initialized", t);
  }
}, ut = (r, e, t) => {
  r.loadNamespaces(e, wn(r, t));
}, Wt = (r, e, t, n) => {
  if (be(t) && (t = [t]), r.options.preload && r.options.preload.indexOf(e) > -1) return ut(r, t, n);
  t.forEach((o) => {
    r.options.ns.indexOf(o) < 0 && r.options.ns.push(o);
  }), r.loadLanguages(e, wn(r, n));
}, Hr = (r, e, t = {}) => !e.languages || !e.languages.length ? (lt(e, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
  languages: e.languages
}), !0) : e.hasLoadedNamespace(r, {
  lng: t.lng,
  precheck: (n, o) => {
    if (t.bindI18n && t.bindI18n.indexOf("languageChanging") > -1 && n.services.backendConnector.backend && n.isLanguageChangingTo && !o(n.isLanguageChangingTo, r)) return !1;
  }
}), be = (r) => typeof r == "string", Vr = (r) => typeof r == "object" && r !== null, Kr = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, qr = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
}, Gr = (r) => qr[r], Br = (r) => r.replace(Kr, Gr);
let ct = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: Br
};
const Yr = (r = {}) => {
  ct = {
    ...ct,
    ...r
  };
}, Wr = () => ct;
let xn;
const Xr = (r) => {
  xn = r;
}, Qr = () => xn, Jr = {
  type: "3rdParty",
  init(r) {
    Yr(r.options.react), Xr(r);
  }
}, Zr = ce.createContext();
class eo {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(e) {
    e.forEach((t) => {
      this.usedNamespaces[t] || (this.usedNamespaces[t] = !0);
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const to = (r, e) => {
  const t = ce.useRef();
  return ce.useEffect(() => {
    t.current = r;
  }, [r, e]), t.current;
}, Sn = (r, e, t, n) => r.getFixedT(e, t, n), no = (r, e, t, n) => ce.useCallback(Sn(r, e, t, n), [r, e, t, n]), ro = (r, e = {}) => {
  const {
    i18n: t
  } = e, {
    i18n: n,
    defaultNS: o
  } = ce.useContext(Zr) || {}, s = t || n || Qr();
  if (s && !s.reportNamespaces && (s.reportNamespaces = new eo()), !s) {
    lt(s, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
    const M = (V, W) => be(W) ? W : Vr(W) && be(W.defaultValue) ? W.defaultValue : Array.isArray(V) ? V[V.length - 1] : V, R = [M, {}, !1];
    return R.t = M, R.i18n = {}, R.ready = !1, R;
  }
  s.options.react?.wait && lt(s, "DEPRECATED_OPTION", "useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
  const a = {
    ...Wr(),
    ...s.options.react,
    ...e
  }, {
    useSuspense: l,
    keyPrefix: u
  } = a;
  let f = r || o || s.options?.defaultNS;
  f = be(f) ? [f] : f || ["translation"], s.reportNamespaces.addUsedNamespaces?.(f);
  const p = (s.isInitialized || s.initializedStoreOnce) && f.every((M) => Hr(M, s, a)), h = no(s, e.lng || null, a.nsMode === "fallback" ? f : f[0], u), x = () => h, v = () => Sn(s, e.lng || null, a.nsMode === "fallback" ? f : f[0], u), [y, T] = ce.useState(x);
  let A = f.join();
  e.lng && (A = `${e.lng}${A}`);
  const K = to(A), U = ce.useRef(!0);
  ce.useEffect(() => {
    const {
      bindI18n: M,
      bindI18nStore: R
    } = a;
    U.current = !0, !p && !l && (e.lng ? Wt(s, e.lng, f, () => {
      U.current && T(v);
    }) : ut(s, f, () => {
      U.current && T(v);
    })), p && K && K !== A && U.current && T(v);
    const V = () => {
      U.current && T(v);
    };
    return M && s?.on(M, V), R && s?.store.on(R, V), () => {
      U.current = !1, s && M && M?.split(" ").forEach((W) => s.off(W, V)), R && s && R.split(" ").forEach((W) => s.store.off(W, V));
    };
  }, [s, A]), ce.useEffect(() => {
    U.current && p && T(x);
  }, [s, u, p]);
  const H = [y, s, p];
  if (H.t = y, H.i18n = s, H.ready = p, p || !p && !l) return H;
  throw new Promise((M) => {
    e.lng ? Wt(s, e.lng, f, () => M()) : ut(s, f, () => M());
  });
}, {
  slice: oo,
  forEach: so
} = [];
function io(r) {
  return so.call(oo.call(arguments, 1), (e) => {
    if (e)
      for (const t in e)
        r[t] === void 0 && (r[t] = e[t]);
  }), r;
}
function ao(r) {
  return typeof r != "string" ? !1 : [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i].some((t) => t.test(r));
}
const Xt = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, lo = function(r, e) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  }, o = encodeURIComponent(e);
  let s = `${r}=${o}`;
  if (n.maxAge > 0) {
    const a = n.maxAge - 0;
    if (Number.isNaN(a)) throw new Error("maxAge should be a Number");
    s += `; Max-Age=${Math.floor(a)}`;
  }
  if (n.domain) {
    if (!Xt.test(n.domain))
      throw new TypeError("option domain is invalid");
    s += `; Domain=${n.domain}`;
  }
  if (n.path) {
    if (!Xt.test(n.path))
      throw new TypeError("option path is invalid");
    s += `; Path=${n.path}`;
  }
  if (n.expires) {
    if (typeof n.expires.toUTCString != "function")
      throw new TypeError("option expires is invalid");
    s += `; Expires=${n.expires.toUTCString()}`;
  }
  if (n.httpOnly && (s += "; HttpOnly"), n.secure && (s += "; Secure"), n.sameSite)
    switch (typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite) {
      case !0:
        s += "; SameSite=Strict";
        break;
      case "lax":
        s += "; SameSite=Lax";
        break;
      case "strict":
        s += "; SameSite=Strict";
        break;
      case "none":
        s += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  return n.partitioned && (s += "; Partitioned"), s;
}, Qt = {
  create(r, e, t, n) {
    let o = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    t && (o.expires = /* @__PURE__ */ new Date(), o.expires.setTime(o.expires.getTime() + t * 60 * 1e3)), n && (o.domain = n), document.cookie = lo(r, e, o);
  },
  read(r) {
    const e = `${r}=`, t = document.cookie.split(";");
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      for (; o.charAt(0) === " "; ) o = o.substring(1, o.length);
      if (o.indexOf(e) === 0) return o.substring(e.length, o.length);
    }
    return null;
  },
  remove(r, e) {
    this.create(r, "", -1, e);
  }
};
var uo = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(r) {
    let {
      lookupCookie: e
    } = r;
    if (e && typeof document < "u")
      return Qt.read(e) || void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(r, e) {
    let {
      lookupCookie: t,
      cookieMinutes: n,
      cookieDomain: o,
      cookieOptions: s
    } = e;
    t && typeof document < "u" && Qt.create(t, r, n, o, s);
  }
}, co = {
  name: "querystring",
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(r) {
    let {
      lookupQuerystring: e
    } = r, t;
    if (typeof window < "u") {
      let {
        search: n
      } = window.location;
      !window.location.search && window.location.hash?.indexOf("?") > -1 && (n = window.location.hash.substring(window.location.hash.indexOf("?")));
      const s = n.substring(1).split("&");
      for (let a = 0; a < s.length; a++) {
        const l = s[a].indexOf("=");
        l > 0 && s[a].substring(0, l) === e && (t = s[a].substring(l + 1));
      }
    }
    return t;
  }
}, fo = {
  name: "hash",
  // Deconstruct the options object and extract the lookupHash property and the lookupFromHashIndex property
  lookup(r) {
    let {
      lookupHash: e,
      lookupFromHashIndex: t
    } = r, n;
    if (typeof window < "u") {
      const {
        hash: o
      } = window.location;
      if (o && o.length > 2) {
        const s = o.substring(1);
        if (e) {
          const a = s.split("&");
          for (let l = 0; l < a.length; l++) {
            const u = a[l].indexOf("=");
            u > 0 && a[l].substring(0, u) === e && (n = a[l].substring(u + 1));
          }
        }
        if (n) return n;
        if (!n && t > -1) {
          const a = o.match(/\/([a-zA-Z-]*)/g);
          return Array.isArray(a) ? a[typeof t == "number" ? t : 0]?.replace("/", "") : void 0;
        }
      }
    }
    return n;
  }
};
let Ee = null;
const Jt = () => {
  if (Ee !== null) return Ee;
  try {
    if (Ee = typeof window < "u" && window.localStorage !== null, !Ee)
      return !1;
    const r = "i18next.translate.boo";
    window.localStorage.setItem(r, "foo"), window.localStorage.removeItem(r);
  } catch {
    Ee = !1;
  }
  return Ee;
};
var po = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(r) {
    let {
      lookupLocalStorage: e
    } = r;
    if (e && Jt())
      return window.localStorage.getItem(e) || void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(r, e) {
    let {
      lookupLocalStorage: t
    } = e;
    t && Jt() && window.localStorage.setItem(t, r);
  }
};
let Re = null;
const Zt = () => {
  if (Re !== null) return Re;
  try {
    if (Re = typeof window < "u" && window.sessionStorage !== null, !Re)
      return !1;
    const r = "i18next.translate.boo";
    window.sessionStorage.setItem(r, "foo"), window.sessionStorage.removeItem(r);
  } catch {
    Re = !1;
  }
  return Re;
};
var ho = {
  name: "sessionStorage",
  lookup(r) {
    let {
      lookupSessionStorage: e
    } = r;
    if (e && Zt())
      return window.sessionStorage.getItem(e) || void 0;
  },
  cacheUserLanguage(r, e) {
    let {
      lookupSessionStorage: t
    } = e;
    t && Zt() && window.sessionStorage.setItem(t, r);
  }
}, go = {
  name: "navigator",
  lookup(r) {
    const e = [];
    if (typeof navigator < "u") {
      const {
        languages: t,
        userLanguage: n,
        language: o
      } = navigator;
      if (t)
        for (let s = 0; s < t.length; s++)
          e.push(t[s]);
      n && e.push(n), o && e.push(o);
    }
    return e.length > 0 ? e : void 0;
  }
}, mo = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(r) {
    let {
      htmlTag: e
    } = r, t;
    const n = e || (typeof document < "u" ? document.documentElement : null);
    return n && typeof n.getAttribute == "function" && (t = n.getAttribute("lang")), t;
  }
}, yo = {
  name: "path",
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(r) {
    let {
      lookupFromPathIndex: e
    } = r;
    if (typeof window > "u") return;
    const t = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    return Array.isArray(t) ? t[typeof e == "number" ? e : 0]?.replace("/", "") : void 0;
  }
}, bo = {
  name: "subdomain",
  lookup(r) {
    let {
      lookupFromSubdomainIndex: e
    } = r;
    const t = typeof e == "number" ? e + 1 : 1, n = typeof window < "u" && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
    if (n)
      return n[t];
  }
};
let kn = !1;
try {
  document.cookie, kn = !0;
} catch {
}
const On = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
kn || On.splice(1, 1);
const vo = () => ({
  order: On,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  // cache user language
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'
  convertDetectedLanguage: (r) => r
});
class En {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector", this.detectors = {}, this.init(e, t);
  }
  init() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = e, this.options = io(t, this.options || {}, vo()), typeof this.options.convertDetectedLanguage == "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1 && (this.options.convertDetectedLanguage = (o) => o.replace("-", "_")), this.options.lookupFromUrlIndex && (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex), this.i18nOptions = n, this.addDetector(uo), this.addDetector(co), this.addDetector(po), this.addDetector(ho), this.addDetector(go), this.addDetector(mo), this.addDetector(yo), this.addDetector(bo), this.addDetector(fo);
  }
  addDetector(e) {
    return this.detectors[e.name] = e, this;
  }
  detect() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order, t = [];
    return e.forEach((n) => {
      if (this.detectors[n]) {
        let o = this.detectors[n].lookup(this.options);
        o && typeof o == "string" && (o = [o]), o && (t = t.concat(o));
      }
    }), t = t.filter((n) => n != null && !ao(n)).map((n) => this.options.convertDetectedLanguage(n)), this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes ? t : t.length > 0 ? t[0] : null;
  }
  cacheUserLanguage(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    t && (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(e) > -1 || t.forEach((n) => {
      this.detectors[n] && this.detectors[n].cacheUserLanguage(e, this.options);
    }));
  }
}
En.type = "languageDetector";
function ft(r) {
  "@babel/helpers - typeof";
  return ft = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ft(r);
}
function Rn() {
  return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : ft(XMLHttpRequest)) === "object";
}
function wo(r) {
  return !!r && typeof r.then == "function";
}
function xo(r) {
  return wo(r) ? r : Promise.resolve(r);
}
function en(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(r);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(r, o).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function tn(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? en(Object(t), !0).forEach(function(n) {
      So(r, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : en(Object(t)).forEach(function(n) {
      Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return r;
}
function So(r, e, t) {
  return (e = ko(e)) in r ? Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : r[e] = t, r;
}
function ko(r) {
  var e = Oo(r, "string");
  return ve(e) == "symbol" ? e : e + "";
}
function Oo(r, e) {
  if (ve(r) != "object" || !r) return r;
  var t = r[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(r, e);
    if (ve(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(r);
}
function ve(r) {
  "@babel/helpers - typeof";
  return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ve(r);
}
var ge = typeof fetch == "function" ? fetch : void 0;
typeof global < "u" && global.fetch ? ge = global.fetch : typeof window < "u" && window.fetch && (ge = window.fetch);
var Ie;
Rn() && (typeof global < "u" && global.XMLHttpRequest ? Ie = global.XMLHttpRequest : typeof window < "u" && window.XMLHttpRequest && (Ie = window.XMLHttpRequest));
var We;
typeof ActiveXObject == "function" && (typeof global < "u" && global.ActiveXObject ? We = global.ActiveXObject : typeof window < "u" && window.ActiveXObject && (We = window.ActiveXObject));
typeof ge != "function" && (ge = void 0);
if (!ge && !Ie && !We)
  try {
    import("./browser-ponyfill-Cz5t-vz2.js").then((r) => r.b).then(function(r) {
      ge = r.default;
    }).catch(function() {
    });
  } catch {
  }
var dt = function(e, t) {
  if (t && ve(t) === "object") {
    var n = "";
    for (var o in t)
      n += "&" + encodeURIComponent(o) + "=" + encodeURIComponent(t[o]);
    if (!n) return e;
    e = e + (e.indexOf("?") !== -1 ? "&" : "?") + n.slice(1);
  }
  return e;
}, nn = function(e, t, n, o) {
  var s = function(u) {
    if (!u.ok) return n(u.statusText || "Error", {
      status: u.status
    });
    u.text().then(function(f) {
      n(null, {
        status: u.status,
        data: f
      });
    }).catch(n);
  };
  if (o) {
    var a = o(e, t);
    if (a instanceof Promise) {
      a.then(s).catch(n);
      return;
    }
  }
  typeof fetch == "function" ? fetch(e, t).then(s).catch(n) : ge(e, t).then(s).catch(n);
}, rn = !1, Eo = function(e, t, n, o) {
  e.queryStringParams && (t = dt(t, e.queryStringParams));
  var s = tn({}, typeof e.customHeaders == "function" ? e.customHeaders() : e.customHeaders);
  typeof window > "u" && typeof global < "u" && typeof global.process < "u" && global.process.versions && global.process.versions.node && (s["User-Agent"] = "i18next-http-backend (node/".concat(global.process.version, "; ").concat(global.process.platform, " ").concat(global.process.arch, ")")), n && (s["Content-Type"] = "application/json");
  var a = typeof e.requestOptions == "function" ? e.requestOptions(n) : e.requestOptions, l = tn({
    method: n ? "POST" : "GET",
    body: n ? e.stringify(n) : void 0,
    headers: s
  }, rn ? {} : a), u = typeof e.alternateFetch == "function" && e.alternateFetch.length >= 1 ? e.alternateFetch : void 0;
  try {
    nn(t, l, o, u);
  } catch (f) {
    if (!a || Object.keys(a).length === 0 || !f.message || f.message.indexOf("not implemented") < 0)
      return o(f);
    try {
      Object.keys(a).forEach(function(p) {
        delete l[p];
      }), nn(t, l, o, u), rn = !0;
    } catch (p) {
      o(p);
    }
  }
}, Ro = function(e, t, n, o) {
  n && ve(n) === "object" && (n = dt("", n).slice(1)), e.queryStringParams && (t = dt(t, e.queryStringParams));
  try {
    var s = Ie ? new Ie() : new We("MSXML2.XMLHTTP.3.0");
    s.open(n ? "POST" : "GET", t, 1), e.crossDomain || s.setRequestHeader("X-Requested-With", "XMLHttpRequest"), s.withCredentials = !!e.withCredentials, n && s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), s.overrideMimeType && s.overrideMimeType("application/json");
    var a = e.customHeaders;
    if (a = typeof a == "function" ? a() : a, a)
      for (var l in a)
        s.setRequestHeader(l, a[l]);
    s.onreadystatechange = function() {
      s.readyState > 3 && o(s.status >= 400 ? s.statusText : null, {
        status: s.status,
        data: s.responseText
      });
    }, s.send(n);
  } catch (u) {
    console && console.log(u);
  }
}, Co = function(e, t, n, o) {
  if (typeof n == "function" && (o = n, n = void 0), o = o || function() {
  }, ge && t.indexOf("file:") !== 0)
    return Eo(e, t, n, o);
  if (Rn() || typeof ActiveXObject == "function")
    return Ro(e, t, n, o);
  o(new Error("No fetch and no xhr implementation found!"));
};
function Ce(r) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ce(r);
}
function on(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(r);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(r, o).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function nt(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? on(Object(t), !0).forEach(function(n) {
      Cn(r, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : on(Object(t)).forEach(function(n) {
      Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return r;
}
function Po(r, e) {
  if (!(r instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function _o(r, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, Pn(n.key), n);
  }
}
function Lo(r, e, t) {
  return e && _o(r.prototype, e), Object.defineProperty(r, "prototype", { writable: !1 }), r;
}
function Cn(r, e, t) {
  return (e = Pn(e)) in r ? Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : r[e] = t, r;
}
function Pn(r) {
  var e = To(r, "string");
  return Ce(e) == "symbol" ? e : e + "";
}
function To(r, e) {
  if (Ce(r) != "object" || !r) return r;
  var t = r[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(r, e);
    if (Ce(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(r);
}
var Ao = function() {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/add/{{lng}}/{{ns}}",
    parse: function(t) {
      return JSON.parse(t);
    },
    stringify: JSON.stringify,
    parsePayload: function(t, n, o) {
      return Cn({}, n, o || "");
    },
    parseLoadPayload: function(t, n) {
    },
    request: Co,
    reloadInterval: typeof window < "u" ? !1 : 3600 * 1e3,
    customHeaders: {},
    queryStringParams: {},
    crossDomain: !1,
    withCredentials: !1,
    overrideMimeType: !1,
    requestOptions: {
      mode: "cors",
      credentials: "same-origin",
      cache: "default"
    }
  };
}, _n = (function() {
  function r(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Po(this, r), this.services = e, this.options = t, this.allOptions = n, this.type = "backend", this.init(e, t, n);
  }
  return Lo(r, [{
    key: "init",
    value: function(t) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (this.services = t, this.options = nt(nt(nt({}, Ao()), this.options || {}), o), this.allOptions = s, this.services && this.options.reloadInterval) {
        var a = setInterval(function() {
          return n.reload();
        }, this.options.reloadInterval);
        Ce(a) === "object" && typeof a.unref == "function" && a.unref();
      }
    }
  }, {
    key: "readMulti",
    value: function(t, n, o) {
      this._readAny(t, t, n, n, o);
    }
  }, {
    key: "read",
    value: function(t, n, o) {
      this._readAny([t], t, [n], n, o);
    }
  }, {
    key: "_readAny",
    value: function(t, n, o, s, a) {
      var l = this, u = this.options.loadPath;
      typeof this.options.loadPath == "function" && (u = this.options.loadPath(t, o)), u = xo(u), u.then(function(f) {
        if (!f) return a(null, {});
        var p = l.services.interpolator.interpolate(f, {
          lng: t.join("+"),
          ns: o.join("+")
        });
        l.loadUrl(p, a, n, s);
      });
    }
  }, {
    key: "loadUrl",
    value: function(t, n, o, s) {
      var a = this, l = typeof o == "string" ? [o] : o, u = typeof s == "string" ? [s] : s, f = this.options.parseLoadPayload(l, u);
      this.options.request(this.options, t, f, function(p, h) {
        if (h && (h.status >= 500 && h.status < 600 || !h.status)) return n("failed loading " + t + "; status code: " + h.status, !0);
        if (h && h.status >= 400 && h.status < 500) return n("failed loading " + t + "; status code: " + h.status, !1);
        if (!h && p && p.message) {
          var x = p.message.toLowerCase(), v = ["failed", "fetch", "network", "load"].find(function(A) {
            return x.indexOf(A) > -1;
          });
          if (v)
            return n("failed loading " + t + ": " + p.message, !0);
        }
        if (p) return n(p, !1);
        var y, T;
        try {
          typeof h.data == "string" ? y = a.options.parse(h.data, o, s) : y = h.data;
        } catch {
          T = "failed parsing " + t + " to json";
        }
        if (T) return n(T, !1);
        n(null, y);
      });
    }
  }, {
    key: "create",
    value: function(t, n, o, s, a) {
      var l = this;
      if (this.options.addPath) {
        typeof t == "string" && (t = [t]);
        var u = this.options.parsePayload(n, o, s), f = 0, p = [], h = [];
        t.forEach(function(x) {
          var v = l.options.addPath;
          typeof l.options.addPath == "function" && (v = l.options.addPath(x, n));
          var y = l.services.interpolator.interpolate(v, {
            lng: x,
            ns: n
          });
          l.options.request(l.options, y, u, function(T, A) {
            f += 1, p.push(T), h.push(A), f === t.length && typeof a == "function" && a(p, h);
          });
        });
      }
    }
  }, {
    key: "reload",
    value: function() {
      var t = this, n = this.services, o = n.backendConnector, s = n.languageUtils, a = n.logger, l = o.language;
      if (!(l && l.toLowerCase() === "cimode")) {
        var u = [], f = function(h) {
          var x = s.toResolveHierarchy(h);
          x.forEach(function(v) {
            u.indexOf(v) < 0 && u.push(v);
          });
        };
        f(l), this.allOptions.preload && this.allOptions.preload.forEach(function(p) {
          return f(p);
        }), u.forEach(function(p) {
          t.allOptions.ns.forEach(function(h) {
            o.read(p, h, "read", null, null, function(x, v) {
              x && a.warn("loading namespace ".concat(h, " for language ").concat(p, " failed"), x), !x && v && a.log("loaded namespace ".concat(h, " for language ").concat(p), v), o.loaded("".concat(p, "|").concat(h), x, v);
            });
          });
        });
      }
    }
  }]);
})();
_n.type = "backend";
const Ln = "common", jo = {
  en: {
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      next: "Next",
      previous: "Previous",
      close: "Close",
      open: "Open",
      yes: "Yes",
      no: "No"
    },
    auth: {
      login: "Login",
      logout: "Logout",
      register: "Register",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember Me"
    },
    navigation: {
      home: "Home",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      help: "Help",
      about: "About"
    }
  },
  ru: {
    common: {
      welcome: "Добро пожаловать",
      loading: "Загрузка...",
      error: "Ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      create: "Создать",
      update: "Обновить",
      search: "Поиск",
      filter: "Фильтр",
      sort: "Сортировка",
      next: "Далее",
      previous: "Назад",
      close: "Закрыть",
      open: "Открыть",
      yes: "Да",
      no: "Нет"
    },
    auth: {
      login: "Войти",
      logout: "Выйти",
      register: "Регистрация",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      forgotPassword: "Забыли пароль?",
      rememberMe: "Запомнить меня"
    },
    navigation: {
      home: "Главная",
      dashboard: "Панель управления",
      profile: "Профиль",
      settings: "Настройки",
      help: "Помощь",
      about: "О нас"
    }
  }
};
se.use(_n).use(En).use(Jr).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS: Ln,
  ns: ["common", "auth", "navigation"],
  interpolation: {
    escapeValue: !1
  },
  resources: jo,
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"]
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  react: {
    useSuspense: !1
  }
});
const No = (r) => ro(r ?? Ln), $o = () => {
  const { i18n: r } = No(), e = (t) => {
    r.changeLanguage(t);
  };
  return {
    currentLanguage: r.language,
    changeLanguage: e,
    languages: ["en", "ru"]
  };
}, Fo = ({ className: r }) => {
  const { currentLanguage: e, changeLanguage: t, languages: n } = $o();
  return /* @__PURE__ */ Bt.createElement(
    "select",
    {
      value: e,
      onChange: (o) => t(o.target.value),
      className: r
    },
    n.map((o) => /* @__PURE__ */ Bt.createElement("option", { key: o, value: o }, o.toUpperCase()))
  );
};
export {
  Fo as L,
  Mo as a,
  $o as b,
  Do as c,
  Mr as g,
  se as i,
  Io as s,
  No as u
};
