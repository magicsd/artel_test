function os() {
  return "shared";
}
function Ln(r) {
  var e, t, n = "";
  if (typeof r == "string" || typeof r == "number") n += r;
  else if (typeof r == "object") if (Array.isArray(r)) {
    var o = r.length;
    for (e = 0; e < o; e++) r[e] && (t = Ln(r[e])) && (n && (n += " "), n += t);
  } else for (t in r) r[t] && (n && (n += " "), n += t);
  return n;
}
function or() {
  for (var r, e, t = 0, n = "", o = arguments.length; t < o; t++) (r = arguments[t]) && (e = Ln(r)) && (n && (n += " "), n += e);
  return n;
}
const Pt = "-", sr = (r) => {
  const e = ar(r), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = r;
  return {
    getClassGroupId: (a) => {
      const l = a.split(Pt);
      return l[0] === "" && l.length !== 1 && l.shift(), Tn(l, e) || ir(a);
    },
    getConflictingClassGroupIds: (a, l) => {
      const u = t[a] || [];
      return l && n[a] ? [...u, ...n[a]] : u;
    }
  };
}, Tn = (r, e) => {
  if (r.length === 0)
    return e.classGroupId;
  const t = r[0], n = e.nextPart.get(t), o = n ? Tn(r.slice(1), n) : void 0;
  if (o)
    return o;
  if (e.validators.length === 0)
    return;
  const i = r.join(Pt);
  return e.validators.find(({
    validator: a
  }) => a(i))?.classGroupId;
}, Wt = /^\[(.+)\]$/, ir = (r) => {
  if (Wt.test(r)) {
    const e = Wt.exec(r)[1], t = e?.substring(0, e.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, ar = (r) => {
  const {
    theme: e,
    classGroups: t
  } = r, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const o in t)
    bt(t[o], n, o, e);
  return n;
}, bt = (r, e, t, n) => {
  r.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? e : Xt(e, o);
      i.classGroupId = t;
      return;
    }
    if (typeof o == "function") {
      if (lr(o)) {
        bt(o(n), e, t, n);
        return;
      }
      e.validators.push({
        validator: o,
        classGroupId: t
      });
      return;
    }
    Object.entries(o).forEach(([i, a]) => {
      bt(a, Xt(e, i), t, n);
    });
  });
}, Xt = (r, e) => {
  let t = r;
  return e.split(Pt).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, lr = (r) => r.isThemeGetter, ur = (r) => {
  if (r < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (i, a) => {
    t.set(i, a), e++, e > r && (e = 0, n = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let a = t.get(i);
      if (a !== void 0)
        return a;
      if ((a = n.get(i)) !== void 0)
        return o(i, a), a;
    },
    set(i, a) {
      t.has(i) ? t.set(i, a) : o(i, a);
    }
  };
}, vt = "!", wt = ":", cr = wt.length, fr = (r) => {
  const {
    prefix: e,
    experimentalParseClassName: t
  } = r;
  let n = (o) => {
    const i = [];
    let a = 0, l = 0, u = 0, d;
    for (let b = 0; b < o.length; b++) {
      let A = o[b];
      if (a === 0 && l === 0) {
        if (A === wt) {
          i.push(o.slice(u, b)), u = b + cr;
          continue;
        }
        if (A === "/") {
          d = b;
          continue;
        }
      }
      A === "[" ? a++ : A === "]" ? a-- : A === "(" ? l++ : A === ")" && l--;
    }
    const p = i.length === 0 ? o : o.substring(u), h = dr(p), x = h !== p, v = d && d > u ? d - u : void 0;
    return {
      modifiers: i,
      hasImportantModifier: x,
      baseClassName: h,
      maybePostfixModifierPosition: v
    };
  };
  if (e) {
    const o = e + wt, i = n;
    n = (a) => a.startsWith(o) ? i(a.substring(o.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: a,
      maybePostfixModifierPosition: void 0
    };
  }
  if (t) {
    const o = n;
    n = (i) => t({
      className: i,
      parseClassName: o
    });
  }
  return n;
}, dr = (r) => r.endsWith(vt) ? r.substring(0, r.length - 1) : r.startsWith(vt) ? r.substring(1) : r, pr = (r) => {
  const e = Object.fromEntries(r.orderSensitiveModifiers.map((n) => [n, !0]));
  return (n) => {
    if (n.length <= 1)
      return n;
    const o = [];
    let i = [];
    return n.forEach((a) => {
      a[0] === "[" || e[a] ? (o.push(...i.sort(), a), i = []) : i.push(a);
    }), o.push(...i.sort()), o;
  };
}, hr = (r) => ({
  cache: ur(r.cacheSize),
  parseClassName: fr(r),
  sortModifiers: pr(r),
  ...sr(r)
}), gr = /\s+/, mr = (r, e) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: i
  } = e, a = [], l = r.trim().split(gr);
  let u = "";
  for (let d = l.length - 1; d >= 0; d -= 1) {
    const p = l[d], {
      isExternal: h,
      modifiers: x,
      hasImportantModifier: v,
      baseClassName: b,
      maybePostfixModifierPosition: A
    } = t(p);
    if (h) {
      u = p + (u.length > 0 ? " " + u : u);
      continue;
    }
    let $ = !!A, B = n($ ? b.substring(0, A) : b);
    if (!B) {
      if (!$) {
        u = p + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (B = n(b), !B) {
        u = p + (u.length > 0 ? " " + u : u);
        continue;
      }
      $ = !1;
    }
    const D = i(x).join(":"), Q = v ? D + vt : D, F = Q + B;
    if (a.includes(F))
      continue;
    a.push(F);
    const T = o(B, $);
    for (let H = 0; H < T.length; ++H) {
      const X = T[H];
      a.push(Q + X);
    }
    u = p + (u.length > 0 ? " " + u : u);
  }
  return u;
};
function yr() {
  let r = 0, e, t, n = "";
  for (; r < arguments.length; )
    (e = arguments[r++]) && (t = _n(e)) && (n && (n += " "), n += t);
  return n;
}
const _n = (r) => {
  if (typeof r == "string")
    return r;
  let e, t = "";
  for (let n = 0; n < r.length; n++)
    r[n] && (e = _n(r[n])) && (t && (t += " "), t += e);
  return t;
};
function br(r, ...e) {
  let t, n, o, i = a;
  function a(u) {
    const d = e.reduce((p, h) => h(p), r());
    return t = hr(d), n = t.cache.get, o = t.cache.set, i = l, l(u);
  }
  function l(u) {
    const d = n(u);
    if (d)
      return d;
    const p = mr(u, t);
    return o(u, p), p;
  }
  return function() {
    return i(yr.apply(null, arguments));
  };
}
const re = (r) => {
  const e = (t) => t[r] || [];
  return e.isThemeGetter = !0, e;
}, An = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, jn = /^\((?:(\w[\w-]*):)?(.+)\)$/i, vr = /^\d+\/\d+$/, wr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, xr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Sr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, kr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Er = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Re = (r) => vr.test(r), z = (r) => !!r && !Number.isNaN(Number(r)), we = (r) => !!r && Number.isInteger(Number(r)), ht = (r) => r.endsWith("%") && z(r.slice(0, -1)), me = (r) => wr.test(r), Or = () => !0, Cr = (r) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  xr.test(r) && !Sr.test(r)
), Nn = () => !1, Rr = (r) => kr.test(r), Pr = (r) => Er.test(r), Lr = (r) => !S(r) && !k(r), Tr = (r) => Ae(r, In, Nn), S = (r) => An.test(r), Ee = (r) => Ae(r, zn, Cr), gt = (r) => Ae(r, $r, z), Qt = (r) => Ae(r, $n, Nn), _r = (r) => Ae(r, Mn, Pr), Ze = (r) => Ae(r, Dn, Rr), k = (r) => jn.test(r), Ie = (r) => je(r, zn), Ar = (r) => je(r, Mr), Jt = (r) => je(r, $n), jr = (r) => je(r, In), Nr = (r) => je(r, Mn), et = (r) => je(r, Dn, !0), Ae = (r, e, t) => {
  const n = An.exec(r);
  return n ? n[1] ? e(n[1]) : t(n[2]) : !1;
}, je = (r, e, t = !1) => {
  const n = jn.exec(r);
  return n ? n[1] ? e(n[1]) : t : !1;
}, $n = (r) => r === "position" || r === "percentage", Mn = (r) => r === "image" || r === "url", In = (r) => r === "length" || r === "size" || r === "bg-size", zn = (r) => r === "length", $r = (r) => r === "number", Mr = (r) => r === "family-name", Dn = (r) => r === "shadow", Ir = () => {
  const r = re("color"), e = re("font"), t = re("text"), n = re("font-weight"), o = re("tracking"), i = re("leading"), a = re("breakpoint"), l = re("container"), u = re("spacing"), d = re("radius"), p = re("shadow"), h = re("inset-shadow"), x = re("text-shadow"), v = re("drop-shadow"), b = re("blur"), A = re("perspective"), $ = re("aspect"), B = re("ease"), D = re("animate"), Q = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], F = () => [
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
  ], T = () => [...F(), k, S], H = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", "contain", "none"], _ = () => [k, S, u], V = () => [Re, "full", "auto", ..._()], oe = () => [we, "none", "subgrid", k, S], pe = () => ["auto", {
    span: ["full", we, k, S]
  }, we, k, S], le = () => [we, "auto", k, S], te = () => ["auto", "min", "max", "fr", k, S], ne = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], se = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], U = () => ["auto", ..._()], Z = () => [Re, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ..._()], R = () => [r, k, S], Y = () => [...F(), Jt, Qt, {
    position: [k, S]
  }], f = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], m = () => ["auto", "cover", "contain", jr, Tr, {
    size: [k, S]
  }], C = () => [ht, Ie, Ee], w = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    d,
    k,
    S
  ], L = () => ["", z, Ie, Ee], q = () => ["solid", "dashed", "dotted", "double"], N = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], G = () => [z, ht, Jt, Qt], J = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    b,
    k,
    S
  ], ue = () => ["none", z, k, S], ye = () => ["none", z, k, S], be = () => [z, k, S], ve = () => [Re, "full", ..._()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [me],
      breakpoint: [me],
      color: [Or],
      container: [me],
      "drop-shadow": [me],
      ease: ["in", "out", "in-out"],
      font: [Lr],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [me],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [me],
      shadow: [me],
      spacing: ["px", z],
      text: [me],
      "text-shadow": [me],
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
        aspect: ["auto", "square", Re, S, k, $]
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
        columns: [z, S, k, l]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Q()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Q()
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
        object: T()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: H()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": H()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": H()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: X()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": X()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": X()
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
        inset: V()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": V()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": V()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: V()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: V()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: V()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: V()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: V()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: V()
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
        z: [we, "auto", k, S]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Re, "full", "auto", l, ..._()]
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
        flex: [z, Re, "auto", "initial", "none", S]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", z, k, S]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", z, k, S]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [we, "first", "last", "none", k, S]
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
        col: pe()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": le()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": le()
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
        row: pe()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": le()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": le()
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
        gap: _()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": _()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": _()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ne(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...se(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...se()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ne()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...se(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...se(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ne()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...se(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...se()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: _()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: _()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: _()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: _()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: _()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: _()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: _()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: _()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: _()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: U()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: U()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: U()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: U()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: U()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: U()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: U()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: U()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: U()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": _()
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
        "space-y": _()
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
        size: Z()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [l, "screen", ...Z()]
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
          ...Z()
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
          ...Z()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Z()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Z()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Z()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", t, Ie, Ee]
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
        font: [n, k, gt]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", ht, S]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Ar, S, e]
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
        "line-clamp": [z, "none", k, gt]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ..._()
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
        placeholder: R()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: R()
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
        decoration: [...q(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [z, "from-font", "auto", k, Ee]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: R()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [z, "auto", k, S]
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
        indent: _()
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
        bg: Y()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: f()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: m()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, we, k, S],
          radial: ["", k, S],
          conic: [we, k, S]
        }, Nr, _r]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: R()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: C()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: C()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: C()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: R()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: R()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: R()
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
        border: L()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": L()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": L()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": L()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": L()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": L()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": L()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": L()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": L()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": L()
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
        "divide-y": L()
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
        border: [...q(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...q(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: R()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": R()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": R()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": R()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": R()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": R()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": R()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": R()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": R()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: R()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...q(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [z, k, S]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", z, Ie, Ee]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: R()
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
          et,
          Ze
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: R()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", h, et, Ze]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": R()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: L()
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
        ring: R()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [z, Ee]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": R()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": L()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": R()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", x, et, Ze]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": R()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [z, k, S]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...N(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": N()
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
        "mask-linear": [z]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": G()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": G()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": R()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": R()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": G()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": G()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": R()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": R()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": G()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": G()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": R()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": R()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": G()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": G()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": R()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": R()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": G()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": G()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": R()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": R()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": G()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": G()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": R()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": R()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": G()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": G()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": R()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": R()
      }],
      "mask-image-radial": [{
        "mask-radial": [k, S]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": G()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": G()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": R()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": R()
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
        "mask-radial-at": F()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [z]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": G()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": G()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": R()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": R()
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
        mask: Y()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: f()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: m()
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
        brightness: [z, k, S]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [z, k, S]
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
          et,
          Ze
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": R()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", z, k, S]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [z, k, S]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", z, k, S]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [z, k, S]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", z, k, S]
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
        "backdrop-brightness": [z, k, S]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [z, k, S]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", z, k, S]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [z, k, S]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", z, k, S]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [z, k, S]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [z, k, S]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", z, k, S]
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
        "border-spacing": _()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": _()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": _()
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
        duration: [z, "initial", k, S]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", B, k, S]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [z, k, S]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", D, k, S]
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
        perspective: [A, k, S]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": T()
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
        scale: ye()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ye()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ye()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ye()
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
        skew: be()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": be()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": be()
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
        origin: T()
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
        translate: ve()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ve()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ve()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ve()
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
        accent: R()
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
        caret: R()
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
        "scroll-m": _()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": _()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": _()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": _()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": _()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": _()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": _()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": _()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": _()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": _()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": _()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": _()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": _()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": _()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": _()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": _()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": _()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": _()
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
        fill: ["none", ...R()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [z, Ie, Ee, gt]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...R()]
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
}, zr = /* @__PURE__ */ br(Ir);
function ss(...r) {
  return zr(or(r));
}
const j = (r) => typeof r == "string", ze = () => {
  let r, e;
  const t = new Promise((n, o) => {
    r = n, e = o;
  });
  return t.resolve = r, t.reject = e, t;
}, Zt = (r) => r == null ? "" : "" + r, Dr = (r, e, t) => {
  r.forEach((n) => {
    e[n] && (t[n] = e[n]);
  });
}, Fr = /###/g, en = (r) => r && r.indexOf("###") > -1 ? r.replace(Fr, ".") : r, tn = (r) => !r || j(r), Fe = (r, e, t) => {
  const n = j(e) ? e.split(".") : e;
  let o = 0;
  for (; o < n.length - 1; ) {
    if (tn(r)) return {};
    const i = en(n[o]);
    !r[i] && t && (r[i] = new t()), Object.prototype.hasOwnProperty.call(r, i) ? r = r[i] : r = {}, ++o;
  }
  return tn(r) ? {} : {
    obj: r,
    k: en(n[o])
  };
}, nn = (r, e, t) => {
  const {
    obj: n,
    k: o
  } = Fe(r, e, Object);
  if (n !== void 0 || e.length === 1) {
    n[o] = t;
    return;
  }
  let i = e[e.length - 1], a = e.slice(0, e.length - 1), l = Fe(r, a, Object);
  for (; l.obj === void 0 && a.length; )
    i = `${a[a.length - 1]}.${i}`, a = a.slice(0, a.length - 1), l = Fe(r, a, Object), l?.obj && typeof l.obj[`${l.k}.${i}`] < "u" && (l.obj = void 0);
  l.obj[`${l.k}.${i}`] = t;
}, Ur = (r, e, t, n) => {
  const {
    obj: o,
    k: i
  } = Fe(r, e, Object);
  o[i] = o[i] || [], o[i].push(t);
}, rt = (r, e) => {
  const {
    obj: t,
    k: n
  } = Fe(r, e);
  if (t && Object.prototype.hasOwnProperty.call(t, n))
    return t[n];
}, Hr = (r, e, t) => {
  const n = rt(r, t);
  return n !== void 0 ? n : rt(e, t);
}, Fn = (r, e, t) => {
  for (const n in e)
    n !== "__proto__" && n !== "constructor" && (n in r ? j(r[n]) || r[n] instanceof String || j(e[n]) || e[n] instanceof String ? t && (r[n] = e[n]) : Fn(r[n], e[n], t) : r[n] = e[n]);
  return r;
}, Pe = (r) => r.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var Kr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const Vr = (r) => j(r) ? r.replace(/[&<>"'\/]/g, (e) => Kr[e]) : r;
class qr {
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
const Gr = [" ", ",", "?", "!", ";"], Br = new qr(20), Yr = (r, e, t) => {
  e = e || "", t = t || "";
  const n = Gr.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0);
  if (n.length === 0) return !0;
  const o = Br.getRegExp(`(${n.map((a) => a === "?" ? "\\?" : a).join("|")})`);
  let i = !o.test(r);
  if (!i) {
    const a = r.indexOf(t);
    a > 0 && !o.test(r.substring(0, a)) && (i = !0);
  }
  return i;
}, xt = (r, e, t = ".") => {
  if (!r) return;
  if (r[e])
    return Object.prototype.hasOwnProperty.call(r, e) ? r[e] : void 0;
  const n = e.split(t);
  let o = r;
  for (let i = 0; i < n.length; ) {
    if (!o || typeof o != "object")
      return;
    let a, l = "";
    for (let u = i; u < n.length; ++u)
      if (u !== i && (l += t), l += n[u], a = o[l], a !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof a) > -1 && u < n.length - 1)
          continue;
        i += u - i + 1;
        break;
      }
    o = a;
  }
  return o;
}, Ue = (r) => r?.replace("_", "-"), Wr = {
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
class ot {
  constructor(e, t = {}) {
    this.init(e, t);
  }
  init(e, t = {}) {
    this.prefix = t.prefix || "i18next:", this.logger = e || Wr, this.options = t, this.debug = t.debug;
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
    return o && !this.debug ? null : (j(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[t](e));
  }
  create(e) {
    return new ot(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new ot(this.logger, e);
  }
}
var de = new ot();
class at {
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
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([o, i]) => {
      for (let a = 0; a < i; a++)
        o(...t);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([o, i]) => {
      for (let a = 0; a < i; a++)
        o.apply(o, [e, ...t]);
    });
  }
}
class rn extends at {
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
    const i = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, a = o.ignoreJSONStructure !== void 0 ? o.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let l;
    e.indexOf(".") > -1 ? l = e.split(".") : (l = [e, t], n && (Array.isArray(n) ? l.push(...n) : j(n) && i ? l.push(...n.split(i)) : l.push(n)));
    const u = rt(this.data, l);
    return !u && !t && !n && e.indexOf(".") > -1 && (e = l[0], t = l[1], n = l.slice(2).join(".")), u || !a || !j(n) ? u : xt(this.data?.[e]?.[t], n, i);
  }
  addResource(e, t, n, o, i = {
    silent: !1
  }) {
    const a = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator;
    let l = [e, t];
    n && (l = l.concat(a ? n.split(a) : n)), e.indexOf(".") > -1 && (l = e.split("."), o = t, t = l[1]), this.addNamespaces(t), nn(this.data, l, o), i.silent || this.emit("added", e, t, n, o);
  }
  addResources(e, t, n, o = {
    silent: !1
  }) {
    for (const i in n)
      (j(n[i]) || Array.isArray(n[i])) && this.addResource(e, t, i, n[i], {
        silent: !0
      });
    o.silent || this.emit("added", e, t, n);
  }
  addResourceBundle(e, t, n, o, i, a = {
    silent: !1,
    skipCopy: !1
  }) {
    let l = [e, t];
    e.indexOf(".") > -1 && (l = e.split("."), o = n, n = t, t = l[1]), this.addNamespaces(t);
    let u = rt(this.data, l) || {};
    a.skipCopy || (n = JSON.parse(JSON.stringify(n))), o ? Fn(u, n, i) : u = {
      ...u,
      ...n
    }, nn(this.data, l, u), a.silent || this.emit("added", e, t, n);
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
var Un = {
  processors: {},
  addPostProcessor(r) {
    this.processors[r.name] = r;
  },
  handle(r, e, t, n, o) {
    return r.forEach((i) => {
      e = this.processors[i]?.process(e, t, n, o) ?? e;
    }), e;
  }
};
const Hn = Symbol("i18next/PATH_KEY");
function Xr() {
  const r = [], e = /* @__PURE__ */ Object.create(null);
  let t;
  return e.get = (n, o) => (t?.revoke?.(), o === Hn ? r : (r.push(o), t = Proxy.revocable(n, e), t.proxy)), Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function St(r, e) {
  const {
    [Hn]: t
  } = r(Xr());
  return t.join(e?.keySeparator ?? ".");
}
const on = {}, sn = (r) => !j(r) && typeof r != "boolean" && typeof r != "number";
class st extends at {
  constructor(e, t = {}) {
    super(), Dr(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = de.create("translator");
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
    let i = t.ns || this.options.defaultNS || [];
    const a = n && e.indexOf(n) > -1, l = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !Yr(e, n, o);
    if (a && !l) {
      const u = e.match(this.interpolator.nestingRegexp);
      if (u && u.length > 0)
        return {
          key: e,
          namespaces: j(i) ? [i] : i
        };
      const d = e.split(n);
      (n !== o || n === o && this.options.ns.indexOf(d[0]) > -1) && (i = d.shift()), e = d.join(o);
    }
    return {
      key: e,
      namespaces: j(i) ? [i] : i
    };
  }
  translate(e, t, n) {
    let o = typeof t == "object" ? {
      ...t
    } : t;
    if (typeof o != "object" && this.options.overloadTranslationOptionHandler && (o = this.options.overloadTranslationOptionHandler(arguments)), typeof o == "object" && (o = {
      ...o
    }), o || (o = {}), e == null) return "";
    typeof e == "function" && (e = St(e, {
      ...this.options,
      ...o
    })), Array.isArray(e) || (e = [String(e)]);
    const i = o.returnDetails !== void 0 ? o.returnDetails : this.options.returnDetails, a = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, {
      key: l,
      namespaces: u
    } = this.extractFromKey(e[e.length - 1], o), d = u[u.length - 1];
    let p = o.nsSeparator !== void 0 ? o.nsSeparator : this.options.nsSeparator;
    p === void 0 && (p = ":");
    const h = o.lng || this.language, x = o.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (h?.toLowerCase() === "cimode")
      return x ? i ? {
        res: `${d}${p}${l}`,
        usedKey: l,
        exactUsedKey: l,
        usedLng: h,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(o)
      } : `${d}${p}${l}` : i ? {
        res: l,
        usedKey: l,
        exactUsedKey: l,
        usedLng: h,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(o)
      } : l;
    const v = this.resolve(e, o);
    let b = v?.res;
    const A = v?.usedKey || l, $ = v?.exactUsedKey || l, B = ["[object Number]", "[object Function]", "[object RegExp]"], D = o.joinArrays !== void 0 ? o.joinArrays : this.options.joinArrays, Q = !this.i18nFormat || this.i18nFormat.handleAsObject, F = o.count !== void 0 && !j(o.count), T = st.hasDefaultValue(o), H = F ? this.pluralResolver.getSuffix(h, o.count, o) : "", X = o.ordinal && F ? this.pluralResolver.getSuffix(h, o.count, {
      ordinal: !1
    }) : "", _ = F && !o.ordinal && o.count === 0, V = _ && o[`defaultValue${this.options.pluralSeparator}zero`] || o[`defaultValue${H}`] || o[`defaultValue${X}`] || o.defaultValue;
    let oe = b;
    Q && !b && T && (oe = V);
    const pe = sn(oe), le = Object.prototype.toString.apply(oe);
    if (Q && oe && pe && B.indexOf(le) < 0 && !(j(D) && Array.isArray(oe))) {
      if (!o.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const te = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(A, oe, {
          ...o,
          ns: u
        }) : `key '${l} (${this.language})' returned an object instead of string.`;
        return i ? (v.res = te, v.usedParams = this.getUsedParamsDetails(o), v) : te;
      }
      if (a) {
        const te = Array.isArray(oe), ne = te ? [] : {}, se = te ? $ : A;
        for (const U in oe)
          if (Object.prototype.hasOwnProperty.call(oe, U)) {
            const Z = `${se}${a}${U}`;
            T && !b ? ne[U] = this.translate(Z, {
              ...o,
              defaultValue: sn(V) ? V[U] : void 0,
              joinArrays: !1,
              ns: u
            }) : ne[U] = this.translate(Z, {
              ...o,
              joinArrays: !1,
              ns: u
            }), ne[U] === Z && (ne[U] = oe[U]);
          }
        b = ne;
      }
    } else if (Q && j(D) && Array.isArray(b))
      b = b.join(D), b && (b = this.extendTranslation(b, e, o, n));
    else {
      let te = !1, ne = !1;
      !this.isValidLookup(b) && T && (te = !0, b = V), this.isValidLookup(b) || (ne = !0, b = l);
      const U = (o.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && ne ? void 0 : b, Z = T && V !== b && this.options.updateMissing;
      if (ne || te || Z) {
        if (this.logger.log(Z ? "updateKey" : "missingKey", h, d, l, Z ? V : b), a) {
          const m = this.resolve(l, {
            ...o,
            keySeparator: !1
          });
          m && m.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let R = [];
        const Y = this.languageUtils.getFallbackCodes(this.options.fallbackLng, o.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && Y && Y[0])
          for (let m = 0; m < Y.length; m++)
            R.push(Y[m]);
        else this.options.saveMissingTo === "all" ? R = this.languageUtils.toResolveHierarchy(o.lng || this.language) : R.push(o.lng || this.language);
        const f = (m, C, w) => {
          const L = T && w !== b ? w : U;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(m, d, C, L, Z, o) : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(m, d, C, L, Z, o), this.emit("missingKey", m, d, C, b);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && F ? R.forEach((m) => {
          const C = this.pluralResolver.getSuffixes(m, o);
          _ && o[`defaultValue${this.options.pluralSeparator}zero`] && C.indexOf(`${this.options.pluralSeparator}zero`) < 0 && C.push(`${this.options.pluralSeparator}zero`), C.forEach((w) => {
            f([m], l + w, o[`defaultValue${w}`] || V);
          });
        }) : f(R, l, V));
      }
      b = this.extendTranslation(b, e, o, v, n), ne && b === l && this.options.appendNamespaceToMissingKey && (b = `${d}${p}${l}`), (ne || te) && this.options.parseMissingKeyHandler && (b = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${d}${p}${l}` : l, te ? b : void 0, o));
    }
    return i ? (v.res = b, v.usedParams = this.getUsedParamsDetails(o), v) : b;
  }
  extendTranslation(e, t, n, o, i) {
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
      const u = j(e) && (n?.interpolation?.skipOnVariables !== void 0 ? n.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let d;
      if (u) {
        const h = e.match(this.interpolator.nestingRegexp);
        d = h && h.length;
      }
      let p = n.replace && !j(n.replace) ? n.replace : n;
      if (this.options.interpolation.defaultVariables && (p = {
        ...this.options.interpolation.defaultVariables,
        ...p
      }), e = this.interpolator.interpolate(e, p, n.lng || this.language || o.usedLng, n), u) {
        const h = e.match(this.interpolator.nestingRegexp), x = h && h.length;
        d < x && (n.nest = !1);
      }
      !n.lng && o && o.res && (n.lng = this.language || o.usedLng), n.nest !== !1 && (e = this.interpolator.nest(e, (...h) => i?.[0] === h[0] && !n.context ? (this.logger.warn(`It seems you are nesting recursively key: ${h[0]} in key: ${t[0]}`), null) : this.translate(...h, t), n)), n.interpolation && this.interpolator.reset();
    }
    const a = n.postProcess || this.options.postProcess, l = j(a) ? [a] : a;
    return e != null && l?.length && n.applyPostProcessor !== !1 && (e = Un.handle(l, e, t, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...o,
        usedParams: this.getUsedParamsDetails(n)
      },
      ...n
    } : n, this)), e;
  }
  resolve(e, t = {}) {
    let n, o, i, a, l;
    return j(e) && (e = [e]), e.forEach((u) => {
      if (this.isValidLookup(n)) return;
      const d = this.extractFromKey(u, t), p = d.key;
      o = p;
      let h = d.namespaces;
      this.options.fallbackNS && (h = h.concat(this.options.fallbackNS));
      const x = t.count !== void 0 && !j(t.count), v = x && !t.ordinal && t.count === 0, b = t.context !== void 0 && (j(t.context) || typeof t.context == "number") && t.context !== "", A = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng);
      h.forEach(($) => {
        this.isValidLookup(n) || (l = $, !on[`${A[0]}-${$}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(l) && (on[`${A[0]}-${$}`] = !0, this.logger.warn(`key "${o}" for languages "${A.join(", ")}" won't get resolved as namespace "${l}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), A.forEach((B) => {
          if (this.isValidLookup(n)) return;
          a = B;
          const D = [p];
          if (this.i18nFormat?.addLookupKeys)
            this.i18nFormat.addLookupKeys(D, p, B, $, t);
          else {
            let F;
            x && (F = this.pluralResolver.getSuffix(B, t.count, t));
            const T = `${this.options.pluralSeparator}zero`, H = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (x && (t.ordinal && F.indexOf(H) === 0 && D.push(p + F.replace(H, this.options.pluralSeparator)), D.push(p + F), v && D.push(p + T)), b) {
              const X = `${p}${this.options.contextSeparator || "_"}${t.context}`;
              D.push(X), x && (t.ordinal && F.indexOf(H) === 0 && D.push(X + F.replace(H, this.options.pluralSeparator)), D.push(X + F), v && D.push(X + T));
            }
          }
          let Q;
          for (; Q = D.pop(); )
            this.isValidLookup(n) || (i = Q, n = this.getResource(B, $, Q, t));
        }));
      });
    }), {
      res: n,
      usedKey: o,
      exactUsedKey: i,
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
    const t = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], n = e.replace && !j(e.replace);
    let o = n ? e.replace : e;
    if (n && typeof e.count < "u" && (o.count = e.count), this.options.interpolation.defaultVariables && (o = {
      ...this.options.interpolation.defaultVariables,
      ...o
    }), !n) {
      o = {
        ...o
      };
      for (const i of t)
        delete o[i];
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
class an {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = de.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = Ue(e), !e || e.indexOf("-") < 0) return null;
    const t = e.split("-");
    return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(t.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = Ue(e), !e || e.indexOf("-") < 0) return e;
    const t = e.split("-");
    return this.formatLanguageCode(t[0]);
  }
  formatLanguageCode(e) {
    if (j(e) && e.indexOf("-") > -1) {
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
      const i = this.getLanguagePartFromCode(n);
      if (this.isSupportedCode(i)) return t = i;
      t = this.options.supportedLngs.find((a) => {
        if (a === i) return a;
        if (!(a.indexOf("-") < 0 && i.indexOf("-") < 0) && (a.indexOf("-") > 0 && i.indexOf("-") < 0 && a.substring(0, a.indexOf("-")) === i || a.indexOf(i) === 0 && i.length > 1))
          return a;
      });
    }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t;
  }
  getFallbackCodes(e, t) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(t)), j(e) && (e = [e]), Array.isArray(e)) return e;
    if (!t) return e.default || [];
    let n = e[t];
    return n || (n = e[this.getScriptPartFromCode(t)]), n || (n = e[this.formatLanguageCode(t)]), n || (n = e[this.getLanguagePartFromCode(t)]), n || (n = e.default), n || [];
  }
  toResolveHierarchy(e, t) {
    const n = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e), o = [], i = (a) => {
      a && (this.isSupportedCode(a) ? o.push(a) : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`));
    };
    return j(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && i(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && i(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && i(this.getLanguagePartFromCode(e))) : j(e) && i(this.formatLanguageCode(e)), n.forEach((a) => {
      o.indexOf(a) < 0 && i(this.formatLanguageCode(a));
    }), o;
  }
}
const ln = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, un = {
  select: (r) => r === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class Qr {
  constructor(e, t = {}) {
    this.languageUtils = e, this.options = t, this.logger = de.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, t) {
    this.rules[e] = t;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, t = {}) {
    const n = Ue(e === "dev" ? "en" : e), o = t.ordinal ? "ordinal" : "cardinal", i = JSON.stringify({
      cleanedCode: n,
      type: o
    });
    if (i in this.pluralRulesCache)
      return this.pluralRulesCache[i];
    let a;
    try {
      a = new Intl.PluralRules(n, {
        type: o
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), un;
      if (!e.match(/-|_/)) return un;
      const u = this.languageUtils.getLanguagePartFromCode(e);
      a = this.getRule(u, t);
    }
    return this.pluralRulesCache[i] = a, a;
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
    return n || (n = this.getRule("dev", t)), n ? n.resolvedOptions().pluralCategories.sort((o, i) => ln[o] - ln[i]).map((o) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ""}${o}`) : [];
  }
  getSuffix(e, t, n = {}) {
    const o = this.getRule(e, n);
    return o ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${o.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", t, n));
  }
}
const cn = (r, e, t, n = ".", o = !0) => {
  let i = Hr(r, e, t);
  return !i && o && j(t) && (i = xt(r, t, n), i === void 0 && (i = xt(e, t, n))), i;
}, mt = (r) => r.replace(/\$/g, "$$$$");
class Jr {
  constructor(e = {}) {
    this.logger = de.create("interpolator"), this.options = e, this.format = e?.interpolation?.format || ((t) => t), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: t,
      escapeValue: n,
      useRawValueToEscape: o,
      prefix: i,
      prefixEscaped: a,
      suffix: l,
      suffixEscaped: u,
      formatSeparator: d,
      unescapeSuffix: p,
      unescapePrefix: h,
      nestingPrefix: x,
      nestingPrefixEscaped: v,
      nestingSuffix: b,
      nestingSuffixEscaped: A,
      nestingOptionsSeparator: $,
      maxReplaces: B,
      alwaysFormat: D
    } = e.interpolation;
    this.escape = t !== void 0 ? t : Vr, this.escapeValue = n !== void 0 ? n : !0, this.useRawValueToEscape = o !== void 0 ? o : !1, this.prefix = i ? Pe(i) : a || "{{", this.suffix = l ? Pe(l) : u || "}}", this.formatSeparator = d || ",", this.unescapePrefix = p ? "" : h || "-", this.unescapeSuffix = this.unescapePrefix ? "" : p || "", this.nestingPrefix = x ? Pe(x) : v || Pe("$t("), this.nestingSuffix = b ? Pe(b) : A || Pe(")"), this.nestingOptionsSeparator = $ || ",", this.maxReplaces = B || 1e3, this.alwaysFormat = D !== void 0 ? D : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (t, n) => t?.source === n ? (t.lastIndex = 0, t) : new RegExp(n, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, t, n, o) {
    let i, a, l;
    const u = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, d = (v) => {
      if (v.indexOf(this.formatSeparator) < 0) {
        const B = cn(t, u, v, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(B, void 0, n, {
          ...o,
          ...t,
          interpolationkey: v
        }) : B;
      }
      const b = v.split(this.formatSeparator), A = b.shift().trim(), $ = b.join(this.formatSeparator).trim();
      return this.format(cn(t, u, A, this.options.keySeparator, this.options.ignoreJSONStructure), $, n, {
        ...o,
        ...t,
        interpolationkey: A
      });
    };
    this.resetRegExp();
    const p = o?.missingInterpolationHandler || this.options.missingInterpolationHandler, h = o?.interpolation?.skipOnVariables !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (v) => mt(v)
    }, {
      regex: this.regexp,
      safeValue: (v) => this.escapeValue ? mt(this.escape(v)) : mt(v)
    }].forEach((v) => {
      for (l = 0; i = v.regex.exec(e); ) {
        const b = i[1].trim();
        if (a = d(b), a === void 0)
          if (typeof p == "function") {
            const $ = p(e, i, o);
            a = j($) ? $ : "";
          } else if (o && Object.prototype.hasOwnProperty.call(o, b))
            a = "";
          else if (h) {
            a = i[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${b} for interpolating ${e}`), a = "";
        else !j(a) && !this.useRawValueToEscape && (a = Zt(a));
        const A = v.safeValue(a);
        if (e = e.replace(i[0], A), h ? (v.regex.lastIndex += a.length, v.regex.lastIndex -= i[0].length) : v.regex.lastIndex = 0, l++, l >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, t, n = {}) {
    let o, i, a;
    const l = (u, d) => {
      const p = this.nestingOptionsSeparator;
      if (u.indexOf(p) < 0) return u;
      const h = u.split(new RegExp(`${p}[ ]*{`));
      let x = `{${h[1]}`;
      u = h[0], x = this.interpolate(x, a);
      const v = x.match(/'/g), b = x.match(/"/g);
      ((v?.length ?? 0) % 2 === 0 && !b || b.length % 2 !== 0) && (x = x.replace(/'/g, '"'));
      try {
        a = JSON.parse(x), d && (a = {
          ...d,
          ...a
        });
      } catch (A) {
        return this.logger.warn(`failed parsing options string in nesting for key ${u}`, A), `${u}${p}${x}`;
      }
      return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, u;
    };
    for (; o = this.nestingRegexp.exec(e); ) {
      let u = [];
      a = {
        ...n
      }, a = a.replace && !j(a.replace) ? a.replace : a, a.applyPostProcessor = !1, delete a.defaultValue;
      const d = /{.*}/.test(o[1]) ? o[1].lastIndexOf("}") + 1 : o[1].indexOf(this.formatSeparator);
      if (d !== -1 && (u = o[1].slice(d).split(this.formatSeparator).map((p) => p.trim()).filter(Boolean), o[1] = o[1].slice(0, d)), i = t(l.call(this, o[1].trim(), a), a), i && o[0] === e && !j(i)) return i;
      j(i) || (i = Zt(i)), i || (this.logger.warn(`missed to resolve ${o[1]} for nesting ${e}`), i = ""), u.length && (i = u.reduce((p, h) => this.format(p, h, n.lng, {
        ...n,
        interpolationkey: o[1].trim()
      }), i.trim())), e = e.replace(o[0], i), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Zr = (r) => {
  let e = r.toLowerCase().trim();
  const t = {};
  if (r.indexOf("(") > -1) {
    const n = r.split("(");
    e = n[0].toLowerCase().trim();
    const o = n[1].substring(0, n[1].length - 1);
    e === "currency" && o.indexOf(":") < 0 ? t.currency || (t.currency = o.trim()) : e === "relativetime" && o.indexOf(":") < 0 ? t.range || (t.range = o.trim()) : o.split(";").forEach((a) => {
      if (a) {
        const [l, ...u] = a.split(":"), d = u.join(":").trim().replace(/^'+|'+$/g, ""), p = l.trim();
        t[p] || (t[p] = d), d === "false" && (t[p] = !1), d === "true" && (t[p] = !0), isNaN(d) || (t[p] = parseInt(d, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: t
  };
}, fn = (r) => {
  const e = {};
  return (t, n, o) => {
    let i = o;
    o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey] && (i = {
      ...i,
      [o.interpolationkey]: void 0
    });
    const a = n + JSON.stringify(i);
    let l = e[a];
    return l || (l = r(Ue(n), o), e[a] = l), l(t);
  };
}, eo = (r) => (e, t, n) => r(Ue(t), n)(e);
class to {
  constructor(e = {}) {
    this.logger = de.create("formatter"), this.options = e, this.init(e);
  }
  init(e, t = {
    interpolation: {}
  }) {
    this.formatSeparator = t.interpolation.formatSeparator || ",";
    const n = t.cacheInBuiltFormats ? fn : eo;
    this.formats = {
      number: n((o, i) => {
        const a = new Intl.NumberFormat(o, {
          ...i
        });
        return (l) => a.format(l);
      }),
      currency: n((o, i) => {
        const a = new Intl.NumberFormat(o, {
          ...i,
          style: "currency"
        });
        return (l) => a.format(l);
      }),
      datetime: n((o, i) => {
        const a = new Intl.DateTimeFormat(o, {
          ...i
        });
        return (l) => a.format(l);
      }),
      relativetime: n((o, i) => {
        const a = new Intl.RelativeTimeFormat(o, {
          ...i
        });
        return (l) => a.format(l, i.range || "day");
      }),
      list: n((o, i) => {
        const a = new Intl.ListFormat(o, {
          ...i
        });
        return (l) => a.format(l);
      })
    };
  }
  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t;
  }
  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = fn(t);
  }
  format(e, t, n, o = {}) {
    const i = t.split(this.formatSeparator);
    if (i.length > 1 && i[0].indexOf("(") > 1 && i[0].indexOf(")") < 0 && i.find((l) => l.indexOf(")") > -1)) {
      const l = i.findIndex((u) => u.indexOf(")") > -1);
      i[0] = [i[0], ...i.splice(1, l)].join(this.formatSeparator);
    }
    return i.reduce((l, u) => {
      const {
        formatName: d,
        formatOptions: p
      } = Zr(u);
      if (this.formats[d]) {
        let h = l;
        try {
          const x = o?.formatParams?.[o.interpolationkey] || {}, v = x.locale || x.lng || o.locale || o.lng || n;
          h = this.formats[d](l, v, {
            ...p,
            ...o,
            ...x
          });
        } catch (x) {
          this.logger.warn(x);
        }
        return h;
      } else
        this.logger.warn(`there was no format function for ${d}`);
      return l;
    }, e);
  }
}
const no = (r, e) => {
  r.pending[e] !== void 0 && (delete r.pending[e], r.pendingCount--);
};
class ro extends at {
  constructor(e, t, n, o = {}) {
    super(), this.backend = e, this.store = t, this.services = n, this.languageUtils = n.languageUtils, this.options = o, this.logger = de.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = o.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = o.maxRetries >= 0 ? o.maxRetries : 5, this.retryTimeout = o.retryTimeout >= 1 ? o.retryTimeout : 350, this.state = {}, this.queue = [], this.backend?.init?.(n, o.backend, o);
  }
  queueLoad(e, t, n, o) {
    const i = {}, a = {}, l = {}, u = {};
    return e.forEach((d) => {
      let p = !0;
      t.forEach((h) => {
        const x = `${d}|${h}`;
        !n.reload && this.store.hasResourceBundle(d, h) ? this.state[x] = 2 : this.state[x] < 0 || (this.state[x] === 1 ? a[x] === void 0 && (a[x] = !0) : (this.state[x] = 1, p = !1, a[x] === void 0 && (a[x] = !0), i[x] === void 0 && (i[x] = !0), u[h] === void 0 && (u[h] = !0)));
      }), p || (l[d] = !0);
    }), (Object.keys(i).length || Object.keys(a).length) && this.queue.push({
      pending: a,
      pendingCount: Object.keys(a).length,
      loaded: {},
      errors: [],
      callback: o
    }), {
      toLoad: Object.keys(i),
      pending: Object.keys(a),
      toLoadLanguages: Object.keys(l),
      toLoadNamespaces: Object.keys(u)
    };
  }
  loaded(e, t, n) {
    const o = e.split("|"), i = o[0], a = o[1];
    t && this.emit("failedLoading", i, a, t), !t && n && this.store.addResourceBundle(i, a, n, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = t ? -1 : 2, t && n && (this.state[e] = 0);
    const l = {};
    this.queue.forEach((u) => {
      Ur(u.loaded, [i], a), no(u, e), t && u.errors.push(t), u.pendingCount === 0 && !u.done && (Object.keys(u.loaded).forEach((d) => {
        l[d] || (l[d] = {});
        const p = u.loaded[d];
        p.length && p.forEach((h) => {
          l[d][h] === void 0 && (l[d][h] = !0);
        });
      }), u.done = !0, u.errors.length ? u.callback(u.errors) : u.callback());
    }), this.emit("loaded", l), this.queue = this.queue.filter((u) => !u.done);
  }
  read(e, t, n, o = 0, i = this.retryTimeout, a) {
    if (!e.length) return a(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: t,
        fcName: n,
        tried: o,
        wait: i,
        callback: a
      });
      return;
    }
    this.readingCalls++;
    const l = (d, p) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const h = this.waitingReads.shift();
        this.read(h.lng, h.ns, h.fcName, h.tried, h.wait, h.callback);
      }
      if (d && p && o < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, t, n, o + 1, i * 2, a);
        }, i);
        return;
      }
      a(d, p);
    }, u = this.backend[n].bind(this.backend);
    if (u.length === 2) {
      try {
        const d = u(e, t);
        d && typeof d.then == "function" ? d.then((p) => l(null, p)).catch(l) : l(null, d);
      } catch (d) {
        l(d);
      }
      return;
    }
    return u(e, t, l);
  }
  prepareLoading(e, t, n = {}, o) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), o && o();
    j(e) && (e = this.languageUtils.toResolveHierarchy(e)), j(t) && (t = [t]);
    const i = this.queueLoad(e, t, n, o);
    if (!i.toLoad.length)
      return i.pending.length || o(), null;
    i.toLoad.forEach((a) => {
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
    const n = e.split("|"), o = n[0], i = n[1];
    this.read(o, i, "read", void 0, void 0, (a, l) => {
      a && this.logger.warn(`${t}loading namespace ${i} for language ${o} failed`, a), !a && l && this.logger.log(`${t}loaded namespace ${i} for language ${o}`, l), this.loaded(e, a, l);
    });
  }
  saveMissing(e, t, n, o, i, a = {}, l = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(t)) {
      this.logger.warn(`did not save key "${n}" as the namespace "${t}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(n == null || n === "")) {
      if (this.backend?.create) {
        const u = {
          ...a,
          isUpdate: i
        }, d = this.backend.create.bind(this.backend);
        if (d.length < 6)
          try {
            let p;
            d.length === 5 ? p = d(e, t, n, o, u) : p = d(e, t, n, o), p && typeof p.then == "function" ? p.then((h) => l(null, h)).catch(l) : l(null, p);
          } catch (p) {
            l(p);
          }
        else
          d(e, t, n, o, l, u);
      }
      !e || !e[0] || this.store.addResource(e[0], t, n, o);
    }
  }
}
const dn = () => ({
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
    if (typeof r[1] == "object" && (e = r[1]), j(r[1]) && (e.defaultValue = r[1]), j(r[2]) && (e.tDescription = r[2]), typeof r[2] == "object" || typeof r[3] == "object") {
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
}), pn = (r) => (j(r.ns) && (r.ns = [r.ns]), j(r.fallbackLng) && (r.fallbackLng = [r.fallbackLng]), j(r.fallbackNS) && (r.fallbackNS = [r.fallbackNS]), r.supportedLngs?.indexOf?.("cimode") < 0 && (r.supportedLngs = r.supportedLngs.concat(["cimode"])), typeof r.initImmediate == "boolean" && (r.initAsync = r.initImmediate), r), tt = () => {
}, oo = (r) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(r)).forEach((t) => {
    typeof r[t] == "function" && (r[t] = r[t].bind(r));
  });
};
class He extends at {
  constructor(e = {}, t) {
    if (super(), this.options = pn(e), this.services = {}, this.logger = de, this.modules = {
      external: []
    }, oo(this), t && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, t), this;
      setTimeout(() => {
        this.init(e, t);
      }, 0);
    }
  }
  init(e = {}, t) {
    this.isInitializing = !0, typeof e == "function" && (t = e, e = {}), e.defaultNS == null && e.ns && (j(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const n = dn();
    this.options = {
      ...n,
      ...this.options,
      ...pn(e)
    }, this.options.interpolation = {
      ...n.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator);
    const o = (d) => d ? typeof d == "function" ? new d() : d : null;
    if (!this.options.isClone) {
      this.modules.logger ? de.init(o(this.modules.logger), this.options) : de.init(null, this.options);
      let d;
      this.modules.formatter ? d = this.modules.formatter : d = to;
      const p = new an(this.options);
      this.store = new rn(this.options.resources, this.options);
      const h = this.services;
      h.logger = de, h.resourceStore = this.store, h.languageUtils = p, h.pluralResolver = new Qr(p, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== n.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), d && (!this.options.interpolation.format || this.options.interpolation.format === n.interpolation.format) && (h.formatter = o(d), h.formatter.init && h.formatter.init(h, this.options), this.options.interpolation.format = h.formatter.format.bind(h.formatter)), h.interpolator = new Jr(this.options), h.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, h.backendConnector = new ro(o(this.modules.backend), h.resourceStore, h, this.options), h.backendConnector.on("*", (v, ...b) => {
        this.emit(v, ...b);
      }), this.modules.languageDetector && (h.languageDetector = o(this.modules.languageDetector), h.languageDetector.init && h.languageDetector.init(h, this.options.detection, this.options)), this.modules.i18nFormat && (h.i18nFormat = o(this.modules.i18nFormat), h.i18nFormat.init && h.i18nFormat.init(this)), this.translator = new st(this.services, this.options), this.translator.on("*", (v, ...b) => {
        this.emit(v, ...b);
      }), this.modules.external.forEach((v) => {
        v.init && v.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, t || (t = tt), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const d = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      d.length > 0 && d[0] !== "dev" && (this.options.lng = d[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((d) => {
      this[d] = (...p) => this.store[d](...p);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((d) => {
      this[d] = (...p) => (this.store[d](...p), this);
    });
    const l = ze(), u = () => {
      const d = (p, h) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), l.resolve(h), t(p, h);
      };
      if (this.languages && !this.isInitialized) return d(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, d);
    };
    return this.options.resources || !this.options.initAsync ? u() : setTimeout(u, 0), l;
  }
  loadResources(e, t = tt) {
    let n = t;
    const o = j(e) ? e : this.language;
    if (typeof e == "function" && (n = e), !this.options.resources || this.options.partialBundledLanguages) {
      if (o?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return n();
      const i = [], a = (l) => {
        if (!l || l === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(l).forEach((d) => {
          d !== "cimode" && i.indexOf(d) < 0 && i.push(d);
        });
      };
      o ? a(o) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((u) => a(u)), this.options.preload?.forEach?.((l) => a(l)), this.services.backendConnector.load(i, this.options.ns, (l) => {
        !l && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), n(l);
      });
    } else
      n(null);
  }
  reloadResources(e, t, n) {
    const o = ze();
    return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), n || (n = tt), this.services.backendConnector.reload(e, t, (i) => {
      o.resolve(), n(i);
    }), o;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && Un.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
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
    const n = ze();
    this.emit("languageChanging", e);
    const o = (l) => {
      this.language = l, this.languages = this.services.languageUtils.toResolveHierarchy(l), this.resolvedLanguage = void 0, this.setResolvedLanguage(l);
    }, i = (l, u) => {
      u ? this.isLanguageChangingTo === e && (o(u), this.translator.changeLanguage(u), this.isLanguageChangingTo = void 0, this.emit("languageChanged", u), this.logger.log("languageChanged", u)) : this.isLanguageChangingTo = void 0, n.resolve((...d) => this.t(...d)), t && t(l, (...d) => this.t(...d));
    }, a = (l) => {
      !e && !l && this.services.languageDetector && (l = []);
      const u = j(l) ? l : l && l[0], d = this.store.hasLanguageSomeTranslations(u) ? u : this.services.languageUtils.getBestMatchFromCodes(j(l) ? [l] : l);
      d && (this.language || o(d), this.translator.language || this.translator.changeLanguage(d), this.services.languageDetector?.cacheUserLanguage?.(d)), this.loadResources(d, (p) => {
        i(p, d);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? a(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(a) : this.services.languageDetector.detect(a) : a(e), n;
  }
  getFixedT(e, t, n) {
    const o = (i, a, ...l) => {
      let u;
      typeof a != "object" ? u = this.options.overloadTranslationOptionHandler([i, a].concat(l)) : u = {
        ...a
      }, u.lng = u.lng || o.lng, u.lngs = u.lngs || o.lngs, u.ns = u.ns || o.ns, u.keyPrefix !== "" && (u.keyPrefix = u.keyPrefix || n || o.keyPrefix);
      const d = this.options.keySeparator || ".";
      let p;
      return u.keyPrefix && Array.isArray(i) ? p = i.map((h) => (typeof h == "function" && (h = St(h, {
        ...this.options,
        ...a
      })), `${u.keyPrefix}${d}${h}`)) : (typeof i == "function" && (i = St(i, {
        ...this.options,
        ...a
      })), p = u.keyPrefix ? `${u.keyPrefix}${d}${i}` : i), this.t(p, u);
    };
    return j(e) ? o.lng = e : o.lngs = e, o.ns = t, o.keyPrefix = n, o;
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
    const n = t.lng || this.resolvedLanguage || this.languages[0], o = this.options ? this.options.fallbackLng : !1, i = this.languages[this.languages.length - 1];
    if (n.toLowerCase() === "cimode") return !0;
    const a = (l, u) => {
      const d = this.services.backendConnector.state[`${l}|${u}`];
      return d === -1 || d === 0 || d === 2;
    };
    if (t.precheck) {
      const l = t.precheck(this, a);
      if (l !== void 0) return l;
    }
    return !!(this.hasResourceBundle(n, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || a(n, e) && (!o || a(i, e)));
  }
  loadNamespaces(e, t) {
    const n = ze();
    return this.options.ns ? (j(e) && (e = [e]), e.forEach((o) => {
      this.options.ns.indexOf(o) < 0 && this.options.ns.push(o);
    }), this.loadResources((o) => {
      n.resolve(), t && t(o);
    }), n) : (t && t(), Promise.resolve());
  }
  loadLanguages(e, t) {
    const n = ze();
    j(e) && (e = [e]);
    const o = this.options.preload || [], i = e.filter((a) => o.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a));
    return i.length ? (this.options.preload = o.concat(i), this.loadResources((a) => {
      n.resolve(), t && t(a);
    }), n) : (t && t(), Promise.resolve());
  }
  dir(e) {
    if (e || (e = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const o = new Intl.Locale(e);
      if (o && o.getTextInfo) {
        const i = o.getTextInfo();
        if (i && i.direction) return i.direction;
      }
    } catch {
    }
    const t = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], n = this.services?.languageUtils || new an(dn());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : t.indexOf(n.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, t) {
    return new He(e, t);
  }
  cloneInstance(e = {}, t = tt) {
    const n = e.forkResourceStore;
    n && delete e.forkResourceStore;
    const o = {
      ...this.options,
      ...e,
      isClone: !0
    }, i = new He(o);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (i.logger = i.logger.clone(e)), ["store", "services", "language"].forEach((l) => {
      i[l] = this[l];
    }), i.services = {
      ...this.services
    }, i.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, n) {
      const l = Object.keys(this.store.data).reduce((u, d) => (u[d] = {
        ...this.store.data[d]
      }, u[d] = Object.keys(u[d]).reduce((p, h) => (p[h] = {
        ...u[d][h]
      }, p), u[d]), u), {});
      i.store = new rn(l, o), i.services.resourceStore = i.store;
    }
    return i.translator = new st(i.services, o), i.translator.on("*", (l, ...u) => {
      i.emit(l, ...u);
    }), i.init(o, t), i.translator.options = o, i.translator.backendConnector.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, i;
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
const ie = He.createInstance();
ie.createInstance = He.createInstance;
ie.createInstance;
ie.dir;
ie.init;
ie.loadResources;
ie.reloadResources;
ie.use;
ie.changeLanguage;
ie.getFixedT;
ie.t;
ie.exists;
ie.setDefaultNamespace;
ie.hasLoadedNamespace;
ie.loadNamespaces;
ie.loadLanguages;
var is = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function so(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var nt = { exports: {} }, M = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hn;
function io() {
  if (hn) return M;
  hn = 1;
  var r = Symbol.for("react.transitional.element"), e = Symbol.for("react.portal"), t = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), i = Symbol.for("react.consumer"), a = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), h = Symbol.iterator;
  function x(f) {
    return f === null || typeof f != "object" ? null : (f = h && f[h] || f["@@iterator"], typeof f == "function" ? f : null);
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
  }, b = Object.assign, A = {};
  function $(f, m, C) {
    this.props = f, this.context = m, this.refs = A, this.updater = C || v;
  }
  $.prototype.isReactComponent = {}, $.prototype.setState = function(f, m) {
    if (typeof f != "object" && typeof f != "function" && f != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, f, m, "setState");
  }, $.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function B() {
  }
  B.prototype = $.prototype;
  function D(f, m, C) {
    this.props = f, this.context = m, this.refs = A, this.updater = C || v;
  }
  var Q = D.prototype = new B();
  Q.constructor = D, b(Q, $.prototype), Q.isPureReactComponent = !0;
  var F = Array.isArray, T = { H: null, A: null, T: null, S: null }, H = Object.prototype.hasOwnProperty;
  function X(f, m, C, w, L, q) {
    return C = q.ref, {
      $$typeof: r,
      type: f,
      key: m,
      ref: C !== void 0 ? C : null,
      props: q
    };
  }
  function _(f, m) {
    return X(
      f.type,
      m,
      void 0,
      void 0,
      void 0,
      f.props
    );
  }
  function V(f) {
    return typeof f == "object" && f !== null && f.$$typeof === r;
  }
  function oe(f) {
    var m = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(C) {
      return m[C];
    });
  }
  var pe = /\/+/g;
  function le(f, m) {
    return typeof f == "object" && f !== null && f.key != null ? oe("" + f.key) : m.toString(36);
  }
  function te() {
  }
  function ne(f) {
    switch (f.status) {
      case "fulfilled":
        return f.value;
      case "rejected":
        throw f.reason;
      default:
        switch (typeof f.status == "string" ? f.then(te, te) : (f.status = "pending", f.then(
          function(m) {
            f.status === "pending" && (f.status = "fulfilled", f.value = m);
          },
          function(m) {
            f.status === "pending" && (f.status = "rejected", f.reason = m);
          }
        )), f.status) {
          case "fulfilled":
            return f.value;
          case "rejected":
            throw f.reason;
        }
    }
    throw f;
  }
  function se(f, m, C, w, L) {
    var q = typeof f;
    (q === "undefined" || q === "boolean") && (f = null);
    var N = !1;
    if (f === null) N = !0;
    else
      switch (q) {
        case "bigint":
        case "string":
        case "number":
          N = !0;
          break;
        case "object":
          switch (f.$$typeof) {
            case r:
            case e:
              N = !0;
              break;
            case p:
              return N = f._init, se(
                N(f._payload),
                m,
                C,
                w,
                L
              );
          }
      }
    if (N)
      return L = L(f), N = w === "" ? "." + le(f, 0) : w, F(L) ? (C = "", N != null && (C = N.replace(pe, "$&/") + "/"), se(L, m, C, "", function(ue) {
        return ue;
      })) : L != null && (V(L) && (L = _(
        L,
        C + (L.key == null || f && f.key === L.key ? "" : ("" + L.key).replace(
          pe,
          "$&/"
        ) + "/") + N
      )), m.push(L)), 1;
    N = 0;
    var G = w === "" ? "." : w + ":";
    if (F(f))
      for (var J = 0; J < f.length; J++)
        w = f[J], q = G + le(w, J), N += se(
          w,
          m,
          C,
          q,
          L
        );
    else if (J = x(f), typeof J == "function")
      for (f = J.call(f), J = 0; !(w = f.next()).done; )
        w = w.value, q = G + le(w, J++), N += se(
          w,
          m,
          C,
          q,
          L
        );
    else if (q === "object") {
      if (typeof f.then == "function")
        return se(
          ne(f),
          m,
          C,
          w,
          L
        );
      throw m = String(f), Error(
        "Objects are not valid as a React child (found: " + (m === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : m) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return N;
  }
  function U(f, m, C) {
    if (f == null) return f;
    var w = [], L = 0;
    return se(f, w, "", "", function(q) {
      return m.call(C, q, L++);
    }), w;
  }
  function Z(f) {
    if (f._status === -1) {
      var m = f._result;
      m = m(), m.then(
        function(C) {
          (f._status === 0 || f._status === -1) && (f._status = 1, f._result = C);
        },
        function(C) {
          (f._status === 0 || f._status === -1) && (f._status = 2, f._result = C);
        }
      ), f._status === -1 && (f._status = 0, f._result = m);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var R = typeof reportError == "function" ? reportError : function(f) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var m = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof f == "object" && f !== null && typeof f.message == "string" ? String(f.message) : String(f),
        error: f
      });
      if (!window.dispatchEvent(m)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", f);
      return;
    }
    console.error(f);
  };
  function Y() {
  }
  return M.Children = {
    map: U,
    forEach: function(f, m, C) {
      U(
        f,
        function() {
          m.apply(this, arguments);
        },
        C
      );
    },
    count: function(f) {
      var m = 0;
      return U(f, function() {
        m++;
      }), m;
    },
    toArray: function(f) {
      return U(f, function(m) {
        return m;
      }) || [];
    },
    only: function(f) {
      if (!V(f))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return f;
    }
  }, M.Component = $, M.Fragment = t, M.Profiler = o, M.PureComponent = D, M.StrictMode = n, M.Suspense = u, M.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, M.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, M.cache = function(f) {
    return function() {
      return f.apply(null, arguments);
    };
  }, M.cloneElement = function(f, m, C) {
    if (f == null)
      throw Error(
        "The argument must be a React element, but you passed " + f + "."
      );
    var w = b({}, f.props), L = f.key, q = void 0;
    if (m != null)
      for (N in m.ref !== void 0 && (q = void 0), m.key !== void 0 && (L = "" + m.key), m)
        !H.call(m, N) || N === "key" || N === "__self" || N === "__source" || N === "ref" && m.ref === void 0 || (w[N] = m[N]);
    var N = arguments.length - 2;
    if (N === 1) w.children = C;
    else if (1 < N) {
      for (var G = Array(N), J = 0; J < N; J++)
        G[J] = arguments[J + 2];
      w.children = G;
    }
    return X(f.type, L, void 0, void 0, q, w);
  }, M.createContext = function(f) {
    return f = {
      $$typeof: a,
      _currentValue: f,
      _currentValue2: f,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, f.Provider = f, f.Consumer = {
      $$typeof: i,
      _context: f
    }, f;
  }, M.createElement = function(f, m, C) {
    var w, L = {}, q = null;
    if (m != null)
      for (w in m.key !== void 0 && (q = "" + m.key), m)
        H.call(m, w) && w !== "key" && w !== "__self" && w !== "__source" && (L[w] = m[w]);
    var N = arguments.length - 2;
    if (N === 1) L.children = C;
    else if (1 < N) {
      for (var G = Array(N), J = 0; J < N; J++)
        G[J] = arguments[J + 2];
      L.children = G;
    }
    if (f && f.defaultProps)
      for (w in N = f.defaultProps, N)
        L[w] === void 0 && (L[w] = N[w]);
    return X(f, q, void 0, void 0, null, L);
  }, M.createRef = function() {
    return { current: null };
  }, M.forwardRef = function(f) {
    return { $$typeof: l, render: f };
  }, M.isValidElement = V, M.lazy = function(f) {
    return {
      $$typeof: p,
      _payload: { _status: -1, _result: f },
      _init: Z
    };
  }, M.memo = function(f, m) {
    return {
      $$typeof: d,
      type: f,
      compare: m === void 0 ? null : m
    };
  }, M.startTransition = function(f) {
    var m = T.T, C = {};
    T.T = C;
    try {
      var w = f(), L = T.S;
      L !== null && L(C, w), typeof w == "object" && w !== null && typeof w.then == "function" && w.then(Y, R);
    } catch (q) {
      R(q);
    } finally {
      T.T = m;
    }
  }, M.unstable_useCacheRefresh = function() {
    return T.H.useCacheRefresh();
  }, M.use = function(f) {
    return T.H.use(f);
  }, M.useActionState = function(f, m, C) {
    return T.H.useActionState(f, m, C);
  }, M.useCallback = function(f, m) {
    return T.H.useCallback(f, m);
  }, M.useContext = function(f) {
    return T.H.useContext(f);
  }, M.useDebugValue = function() {
  }, M.useDeferredValue = function(f, m) {
    return T.H.useDeferredValue(f, m);
  }, M.useEffect = function(f, m) {
    return T.H.useEffect(f, m);
  }, M.useId = function() {
    return T.H.useId();
  }, M.useImperativeHandle = function(f, m, C) {
    return T.H.useImperativeHandle(f, m, C);
  }, M.useInsertionEffect = function(f, m) {
    return T.H.useInsertionEffect(f, m);
  }, M.useLayoutEffect = function(f, m) {
    return T.H.useLayoutEffect(f, m);
  }, M.useMemo = function(f, m) {
    return T.H.useMemo(f, m);
  }, M.useOptimistic = function(f, m) {
    return T.H.useOptimistic(f, m);
  }, M.useReducer = function(f, m, C) {
    return T.H.useReducer(f, m, C);
  }, M.useRef = function(f) {
    return T.H.useRef(f);
  }, M.useState = function(f) {
    return T.H.useState(f);
  }, M.useSyncExternalStore = function(f, m, C) {
    return T.H.useSyncExternalStore(
      f,
      m,
      C
    );
  }, M.useTransition = function() {
    return T.H.useTransition();
  }, M.version = "19.0.0", M;
}
var De = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
De.exports;
var gn;
function ao() {
  return gn || (gn = 1, (function(r, e) {
    process.env.NODE_ENV !== "production" && (function() {
      function t(s, c) {
        Object.defineProperty(i.prototype, s, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              c[0],
              c[1]
            );
          }
        });
      }
      function n(s) {
        return s === null || typeof s != "object" ? null : (s = Lt && s[Lt] || s["@@iterator"], typeof s == "function" ? s : null);
      }
      function o(s, c) {
        s = (s = s.constructor) && (s.displayName || s.name) || "ReactClass";
        var g = s + "." + c;
        Tt[g] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          c,
          s
        ), Tt[g] = !0);
      }
      function i(s, c, g) {
        this.props = s, this.context = c, this.refs = ut, this.updater = g || _t;
      }
      function a() {
      }
      function l(s, c, g) {
        this.props = s, this.context = c, this.refs = ut, this.updater = g || _t;
      }
      function u(s) {
        return "" + s;
      }
      function d(s) {
        try {
          u(s);
          var c = !1;
        } catch {
          c = !0;
        }
        if (c) {
          c = console;
          var g = c.error, y = typeof Symbol == "function" && Symbol.toStringTag && s[Symbol.toStringTag] || s.constructor.name || "Object";
          return g.call(
            c,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            y
          ), u(s);
        }
      }
      function p(s) {
        if (s == null) return null;
        if (typeof s == "function")
          return s.$$typeof === tr ? null : s.displayName || s.name || null;
        if (typeof s == "string") return s;
        switch (s) {
          case J:
            return "Fragment";
          case G:
            return "Portal";
          case ye:
            return "Profiler";
          case ue:
            return "StrictMode";
          case qe:
            return "Suspense";
          case lt:
            return "SuspenseList";
        }
        if (typeof s == "object")
          switch (typeof s.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), s.$$typeof) {
            case ve:
              return (s.displayName || "Context") + ".Provider";
            case be:
              return (s._context.displayName || "Context") + ".Consumer";
            case Ve:
              var c = s.render;
              return s = s.displayName, s || (s = c.displayName || c.name || "", s = s !== "" ? "ForwardRef(" + s + ")" : "ForwardRef"), s;
            case Ne:
              return c = s.displayName || null, c !== null ? c : p(s.type) || "Memo";
            case $e:
              c = s._payload, s = s._init;
              try {
                return p(s(c));
              } catch {
              }
          }
        return null;
      }
      function h(s) {
        return typeof s == "string" || typeof s == "function" || s === J || s === ye || s === ue || s === qe || s === lt || s === er || typeof s == "object" && s !== null && (s.$$typeof === $e || s.$$typeof === Ne || s.$$typeof === ve || s.$$typeof === be || s.$$typeof === Ve || s.$$typeof === nr || s.getModuleId !== void 0);
      }
      function x() {
      }
      function v() {
        if (Me === 0) {
          At = console.log, jt = console.info, Nt = console.warn, $t = console.error, Mt = console.group, It = console.groupCollapsed, zt = console.groupEnd;
          var s = {
            configurable: !0,
            enumerable: !0,
            value: x,
            writable: !0
          };
          Object.defineProperties(console, {
            info: s,
            log: s,
            warn: s,
            error: s,
            group: s,
            groupCollapsed: s,
            groupEnd: s
          });
        }
        Me++;
      }
      function b() {
        if (Me--, Me === 0) {
          var s = { configurable: !0, enumerable: !0, writable: !0 };
          Object.defineProperties(console, {
            log: he({}, s, { value: At }),
            info: he({}, s, { value: jt }),
            warn: he({}, s, { value: Nt }),
            error: he({}, s, { value: $t }),
            group: he({}, s, { value: Mt }),
            groupCollapsed: he({}, s, { value: It }),
            groupEnd: he({}, s, { value: zt })
          });
        }
        0 > Me && console.error(
          "disabledDepth fell below zero. This is a bug in React. Please file an issue."
        );
      }
      function A(s) {
        if (ct === void 0)
          try {
            throw Error();
          } catch (g) {
            var c = g.stack.trim().match(/\n( *(at )?)/);
            ct = c && c[1] || "", Dt = -1 < g.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < g.stack.indexOf("@") ? "@unknown:0:0" : "";
          }
        return `
` + ct + s + Dt;
      }
      function $(s, c) {
        if (!s || ft) return "";
        var g = dt.get(s);
        if (g !== void 0) return g;
        ft = !0, g = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
        var y = null;
        y = I.H, I.H = null, v();
        try {
          var E = {
            DetermineComponentFrameRoot: function() {
              try {
                if (c) {
                  var ce = function() {
                    throw Error();
                  };
                  if (Object.defineProperty(ce.prototype, "props", {
                    set: function() {
                      throw Error();
                    }
                  }), typeof Reflect == "object" && Reflect.construct) {
                    try {
                      Reflect.construct(ce, []);
                    } catch (ge) {
                      var Je = ge;
                    }
                    Reflect.construct(s, [], ce);
                  } else {
                    try {
                      ce.call();
                    } catch (ge) {
                      Je = ge;
                    }
                    s.call(ce.prototype);
                  }
                } else {
                  try {
                    throw Error();
                  } catch (ge) {
                    Je = ge;
                  }
                  (ce = s()) && typeof ce.catch == "function" && ce.catch(function() {
                  });
                }
              } catch (ge) {
                if (ge && Je && typeof ge.stack == "string")
                  return [ge.stack, Je.stack];
              }
              return [null, null];
            }
          };
          E.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
          var P = Object.getOwnPropertyDescriptor(
            E.DetermineComponentFrameRoot,
            "name"
          );
          P && P.configurable && Object.defineProperty(
            E.DetermineComponentFrameRoot,
            "name",
            { value: "DetermineComponentFrameRoot" }
          );
          var O = E.DetermineComponentFrameRoot(), W = O[0], K = O[1];
          if (W && K) {
            var ee = W.split(`
`), ae = K.split(`
`);
            for (O = P = 0; P < ee.length && !ee[P].includes(
              "DetermineComponentFrameRoot"
            ); )
              P++;
            for (; O < ae.length && !ae[O].includes(
              "DetermineComponentFrameRoot"
            ); )
              O++;
            if (P === ee.length || O === ae.length)
              for (P = ee.length - 1, O = ae.length - 1; 1 <= P && 0 <= O && ee[P] !== ae[O]; )
                O--;
            for (; 1 <= P && 0 <= O; P--, O--)
              if (ee[P] !== ae[O]) {
                if (P !== 1 || O !== 1)
                  do
                    if (P--, O--, 0 > O || ee[P] !== ae[O]) {
                      var ke = `
` + ee[P].replace(
                        " at new ",
                        " at "
                      );
                      return s.displayName && ke.includes("<anonymous>") && (ke = ke.replace("<anonymous>", s.displayName)), typeof s == "function" && dt.set(s, ke), ke;
                    }
                  while (1 <= P && 0 <= O);
                break;
              }
          }
        } finally {
          ft = !1, I.H = y, b(), Error.prepareStackTrace = g;
        }
        return ee = (ee = s ? s.displayName || s.name : "") ? A(ee) : "", typeof s == "function" && dt.set(s, ee), ee;
      }
      function B(s) {
        if (s == null) return "";
        if (typeof s == "function") {
          var c = s.prototype;
          return $(
            s,
            !(!c || !c.isReactComponent)
          );
        }
        if (typeof s == "string") return A(s);
        switch (s) {
          case qe:
            return A("Suspense");
          case lt:
            return A("SuspenseList");
        }
        if (typeof s == "object")
          switch (s.$$typeof) {
            case Ve:
              return s = $(s.render, !1), s;
            case Ne:
              return B(s.type);
            case $e:
              c = s._payload, s = s._init;
              try {
                return B(s(c));
              } catch {
              }
          }
        return "";
      }
      function D() {
        var s = I.A;
        return s === null ? null : s.getOwner();
      }
      function Q(s) {
        if (Ye.call(s, "key")) {
          var c = Object.getOwnPropertyDescriptor(s, "key").get;
          if (c && c.isReactWarning) return !1;
        }
        return s.key !== void 0;
      }
      function F(s, c) {
        function g() {
          Ft || (Ft = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            c
          ));
        }
        g.isReactWarning = !0, Object.defineProperty(s, "key", {
          get: g,
          configurable: !0
        });
      }
      function T() {
        var s = p(this.type);
        return Ht[s] || (Ht[s] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), s = this.props.ref, s !== void 0 ? s : null;
      }
      function H(s, c, g, y, E, P) {
        return g = P.ref, s = {
          $$typeof: N,
          type: s,
          key: c,
          props: P,
          _owner: E
        }, (g !== void 0 ? g : null) !== null ? Object.defineProperty(s, "ref", {
          enumerable: !1,
          get: T
        }) : Object.defineProperty(s, "ref", { enumerable: !1, value: null }), s._store = {}, Object.defineProperty(s._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(s, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
      }
      function X(s, c) {
        return c = H(
          s.type,
          c,
          void 0,
          void 0,
          s._owner,
          s.props
        ), c._store.validated = s._store.validated, c;
      }
      function _(s, c) {
        if (typeof s == "object" && s && s.$$typeof !== rr) {
          if (Be(s))
            for (var g = 0; g < s.length; g++) {
              var y = s[g];
              V(y) && oe(y, c);
            }
          else if (V(s))
            s._store && (s._store.validated = 1);
          else if (g = n(s), typeof g == "function" && g !== s.entries && (g = g.call(s), g !== s))
            for (; !(s = g.next()).done; )
              V(s.value) && oe(s.value, c);
        }
      }
      function V(s) {
        return typeof s == "object" && s !== null && s.$$typeof === N;
      }
      function oe(s, c) {
        if (s._store && !s._store.validated && s.key == null && (s._store.validated = 1, c = pe(c), !Kt[c])) {
          Kt[c] = !0;
          var g = "";
          s && s._owner != null && s._owner !== D() && (g = null, typeof s._owner.tag == "number" ? g = p(s._owner.type) : typeof s._owner.name == "string" && (g = s._owner.name), g = " It was passed a child from " + g + ".");
          var y = I.getCurrentStack;
          I.getCurrentStack = function() {
            var E = B(s.type);
            return y && (E += y() || ""), E;
          }, console.error(
            'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
            c,
            g
          ), I.getCurrentStack = y;
        }
      }
      function pe(s) {
        var c = "", g = D();
        return g && (g = p(g.type)) && (c = `

Check the render method of \`` + g + "`."), c || (s = p(s)) && (c = `

Check the top-level render call using <` + s + ">."), c;
      }
      function le(s) {
        var c = { "=": "=0", ":": "=2" };
        return "$" + s.replace(/[=:]/g, function(g) {
          return c[g];
        });
      }
      function te(s, c) {
        return typeof s == "object" && s !== null && s.key != null ? (d(s.key), le("" + s.key)) : c.toString(36);
      }
      function ne() {
      }
      function se(s) {
        switch (s.status) {
          case "fulfilled":
            return s.value;
          case "rejected":
            throw s.reason;
          default:
            switch (typeof s.status == "string" ? s.then(ne, ne) : (s.status = "pending", s.then(
              function(c) {
                s.status === "pending" && (s.status = "fulfilled", s.value = c);
              },
              function(c) {
                s.status === "pending" && (s.status = "rejected", s.reason = c);
              }
            )), s.status) {
              case "fulfilled":
                return s.value;
              case "rejected":
                throw s.reason;
            }
        }
        throw s;
      }
      function U(s, c, g, y, E) {
        var P = typeof s;
        (P === "undefined" || P === "boolean") && (s = null);
        var O = !1;
        if (s === null) O = !0;
        else
          switch (P) {
            case "bigint":
            case "string":
            case "number":
              O = !0;
              break;
            case "object":
              switch (s.$$typeof) {
                case N:
                case G:
                  O = !0;
                  break;
                case $e:
                  return O = s._init, U(
                    O(s._payload),
                    c,
                    g,
                    y,
                    E
                  );
              }
          }
        if (O) {
          O = s, E = E(O);
          var W = y === "" ? "." + te(O, 0) : y;
          return Be(E) ? (g = "", W != null && (g = W.replace(qt, "$&/") + "/"), U(E, c, g, "", function(ee) {
            return ee;
          })) : E != null && (V(E) && (E.key != null && (O && O.key === E.key || d(E.key)), g = X(
            E,
            g + (E.key == null || O && O.key === E.key ? "" : ("" + E.key).replace(
              qt,
              "$&/"
            ) + "/") + W
          ), y !== "" && O != null && V(O) && O.key == null && O._store && !O._store.validated && (g._store.validated = 2), E = g), c.push(E)), 1;
        }
        if (O = 0, W = y === "" ? "." : y + ":", Be(s))
          for (var K = 0; K < s.length; K++)
            y = s[K], P = W + te(y, K), O += U(
              y,
              c,
              g,
              P,
              E
            );
        else if (K = n(s), typeof K == "function")
          for (K === s.entries && (Vt || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), Vt = !0), s = K.call(s), K = 0; !(y = s.next()).done; )
            y = y.value, P = W + te(y, K++), O += U(
              y,
              c,
              g,
              P,
              E
            );
        else if (P === "object") {
          if (typeof s.then == "function")
            return U(
              se(s),
              c,
              g,
              y,
              E
            );
          throw c = String(s), Error(
            "Objects are not valid as a React child (found: " + (c === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : c) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return O;
      }
      function Z(s, c, g) {
        if (s == null) return s;
        var y = [], E = 0;
        return U(s, y, "", "", function(P) {
          return c.call(g, P, E++);
        }), y;
      }
      function R(s) {
        if (s._status === -1) {
          var c = s._result;
          c = c(), c.then(
            function(g) {
              (s._status === 0 || s._status === -1) && (s._status = 1, s._result = g);
            },
            function(g) {
              (s._status === 0 || s._status === -1) && (s._status = 2, s._result = g);
            }
          ), s._status === -1 && (s._status = 0, s._result = c);
        }
        if (s._status === 1)
          return c = s._result, c === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            c
          ), "default" in c || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            c
          ), c.default;
        throw s._result;
      }
      function Y() {
        var s = I.H;
        return s === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), s;
      }
      function f() {
      }
      function m(s) {
        if (We === null)
          try {
            var c = ("require" + Math.random()).slice(0, 7);
            We = (r && r[c]).call(
              r,
              "timers"
            ).setImmediate;
          } catch {
            We = function(y) {
              Bt === !1 && (Bt = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var E = new MessageChannel();
              E.port1.onmessage = y, E.port2.postMessage(void 0);
            };
          }
        return We(s);
      }
      function C(s) {
        return 1 < s.length && typeof AggregateError == "function" ? new AggregateError(s) : s[0];
      }
      function w(s, c) {
        c !== Xe - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), Xe = c;
      }
      function L(s, c, g) {
        var y = I.actQueue;
        if (y !== null)
          if (y.length !== 0)
            try {
              q(y), m(function() {
                return L(s, c, g);
              });
              return;
            } catch (E) {
              I.thrownErrors.push(E);
            }
          else I.actQueue = null;
        0 < I.thrownErrors.length ? (y = C(I.thrownErrors), I.thrownErrors.length = 0, g(y)) : c(s);
      }
      function q(s) {
        if (!pt) {
          pt = !0;
          var c = 0;
          try {
            for (; c < s.length; c++) {
              var g = s[c];
              do {
                I.didUsePromise = !1;
                var y = g(!1);
                if (y !== null) {
                  if (I.didUsePromise) {
                    s[c] = g, s.splice(0, c);
                    return;
                  }
                  g = y;
                } else break;
              } while (!0);
            }
            s.length = 0;
          } catch (E) {
            s.splice(0, c + 1), I.thrownErrors.push(E);
          } finally {
            pt = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var N = Symbol.for("react.transitional.element"), G = Symbol.for("react.portal"), J = Symbol.for("react.fragment"), ue = Symbol.for("react.strict_mode"), ye = Symbol.for("react.profiler"), be = Symbol.for("react.consumer"), ve = Symbol.for("react.context"), Ve = Symbol.for("react.forward_ref"), qe = Symbol.for("react.suspense"), lt = Symbol.for("react.suspense_list"), Ne = Symbol.for("react.memo"), $e = Symbol.for("react.lazy"), er = Symbol.for("react.offscreen"), Lt = Symbol.iterator, Tt = {}, _t = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(s) {
          o(s, "forceUpdate");
        },
        enqueueReplaceState: function(s) {
          o(s, "replaceState");
        },
        enqueueSetState: function(s) {
          o(s, "setState");
        }
      }, he = Object.assign, ut = {};
      Object.freeze(ut), i.prototype.isReactComponent = {}, i.prototype.setState = function(s, c) {
        if (typeof s != "object" && typeof s != "function" && s != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, s, c, "setState");
      }, i.prototype.forceUpdate = function(s) {
        this.updater.enqueueForceUpdate(this, s, "forceUpdate");
      };
      var Se = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, Ge;
      for (Ge in Se)
        Se.hasOwnProperty(Ge) && t(Ge, Se[Ge]);
      a.prototype = i.prototype, Se = l.prototype = new a(), Se.constructor = l, he(Se, i.prototype), Se.isPureReactComponent = !0;
      var Be = Array.isArray, tr = Symbol.for("react.client.reference"), I = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null
      }, Ye = Object.prototype.hasOwnProperty, nr = Symbol.for("react.client.reference"), Me = 0, At, jt, Nt, $t, Mt, It, zt;
      x.__reactDisabledLog = !0;
      var ct, Dt, ft = !1, dt = new (typeof WeakMap == "function" ? WeakMap : Map)(), rr = Symbol.for("react.client.reference"), Ft, Ut, Ht = {}, Kt = {}, Vt = !1, qt = /\/+/g, Gt = typeof reportError == "function" ? reportError : function(s) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var c = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof s == "object" && s !== null && typeof s.message == "string" ? String(s.message) : String(s),
            error: s
          });
          if (!window.dispatchEvent(c)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", s);
          return;
        }
        console.error(s);
      }, Bt = !1, We = null, Xe = 0, Qe = !1, pt = !1, Yt = typeof queueMicrotask == "function" ? function(s) {
        queueMicrotask(function() {
          return queueMicrotask(s);
        });
      } : m;
      e.Children = {
        map: Z,
        forEach: function(s, c, g) {
          Z(
            s,
            function() {
              c.apply(this, arguments);
            },
            g
          );
        },
        count: function(s) {
          var c = 0;
          return Z(s, function() {
            c++;
          }), c;
        },
        toArray: function(s) {
          return Z(s, function(c) {
            return c;
          }) || [];
        },
        only: function(s) {
          if (!V(s))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return s;
        }
      }, e.Component = i, e.Fragment = J, e.Profiler = ye, e.PureComponent = l, e.StrictMode = ue, e.Suspense = qe, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = I, e.act = function(s) {
        var c = I.actQueue, g = Xe;
        Xe++;
        var y = I.actQueue = c !== null ? c : [], E = !1;
        try {
          var P = s();
        } catch (K) {
          I.thrownErrors.push(K);
        }
        if (0 < I.thrownErrors.length)
          throw w(c, g), s = C(I.thrownErrors), I.thrownErrors.length = 0, s;
        if (P !== null && typeof P == "object" && typeof P.then == "function") {
          var O = P;
          return Yt(function() {
            E || Qe || (Qe = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(K, ee) {
              E = !0, O.then(
                function(ae) {
                  if (w(c, g), g === 0) {
                    try {
                      q(y), m(function() {
                        return L(
                          ae,
                          K,
                          ee
                        );
                      });
                    } catch (ce) {
                      I.thrownErrors.push(ce);
                    }
                    if (0 < I.thrownErrors.length) {
                      var ke = C(
                        I.thrownErrors
                      );
                      I.thrownErrors.length = 0, ee(ke);
                    }
                  } else K(ae);
                },
                function(ae) {
                  w(c, g), 0 < I.thrownErrors.length && (ae = C(
                    I.thrownErrors
                  ), I.thrownErrors.length = 0), ee(ae);
                }
              );
            }
          };
        }
        var W = P;
        if (w(c, g), g === 0 && (q(y), y.length !== 0 && Yt(function() {
          E || Qe || (Qe = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), I.actQueue = null), 0 < I.thrownErrors.length)
          throw s = C(I.thrownErrors), I.thrownErrors.length = 0, s;
        return {
          then: function(K, ee) {
            E = !0, g === 0 ? (I.actQueue = y, m(function() {
              return L(
                W,
                K,
                ee
              );
            })) : K(W);
          }
        };
      }, e.cache = function(s) {
        return function() {
          return s.apply(null, arguments);
        };
      }, e.cloneElement = function(s, c, g) {
        if (s == null)
          throw Error(
            "The argument must be a React element, but you passed " + s + "."
          );
        var y = he({}, s.props), E = s.key, P = s._owner;
        if (c != null) {
          var O;
          e: {
            if (Ye.call(c, "ref") && (O = Object.getOwnPropertyDescriptor(
              c,
              "ref"
            ).get) && O.isReactWarning) {
              O = !1;
              break e;
            }
            O = c.ref !== void 0;
          }
          O && (P = D()), Q(c) && (d(c.key), E = "" + c.key);
          for (W in c)
            !Ye.call(c, W) || W === "key" || W === "__self" || W === "__source" || W === "ref" && c.ref === void 0 || (y[W] = c[W]);
        }
        var W = arguments.length - 2;
        if (W === 1) y.children = g;
        else if (1 < W) {
          O = Array(W);
          for (var K = 0; K < W; K++)
            O[K] = arguments[K + 2];
          y.children = O;
        }
        for (y = H(s.type, E, void 0, void 0, P, y), E = 2; E < arguments.length; E++)
          _(arguments[E], y.type);
        return y;
      }, e.createContext = function(s) {
        return s = {
          $$typeof: ve,
          _currentValue: s,
          _currentValue2: s,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, s.Provider = s, s.Consumer = {
          $$typeof: be,
          _context: s
        }, s._currentRenderer = null, s._currentRenderer2 = null, s;
      }, e.createElement = function(s, c, g) {
        if (h(s))
          for (var y = 2; y < arguments.length; y++)
            _(arguments[y], s);
        else {
          if (y = "", (s === void 0 || typeof s == "object" && s !== null && Object.keys(s).length === 0) && (y += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), s === null) var E = "null";
          else
            Be(s) ? E = "array" : s !== void 0 && s.$$typeof === N ? (E = "<" + (p(s.type) || "Unknown") + " />", y = " Did you accidentally export a JSX literal instead of a component?") : E = typeof s;
          console.error(
            "React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
            E,
            y
          );
        }
        var P;
        if (y = {}, E = null, c != null)
          for (P in Ut || !("__self" in c) || "key" in c || (Ut = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), Q(c) && (d(c.key), E = "" + c.key), c)
            Ye.call(c, P) && P !== "key" && P !== "__self" && P !== "__source" && (y[P] = c[P]);
        var O = arguments.length - 2;
        if (O === 1) y.children = g;
        else if (1 < O) {
          for (var W = Array(O), K = 0; K < O; K++)
            W[K] = arguments[K + 2];
          Object.freeze && Object.freeze(W), y.children = W;
        }
        if (s && s.defaultProps)
          for (P in O = s.defaultProps, O)
            y[P] === void 0 && (y[P] = O[P]);
        return E && F(
          y,
          typeof s == "function" ? s.displayName || s.name || "Unknown" : s
        ), H(s, E, void 0, void 0, D(), y);
      }, e.createRef = function() {
        var s = { current: null };
        return Object.seal(s), s;
      }, e.forwardRef = function(s) {
        s != null && s.$$typeof === Ne ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof s != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          s === null ? "null" : typeof s
        ) : s.length !== 0 && s.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          s.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), s != null && s.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var c = { $$typeof: Ve, render: s }, g;
        return Object.defineProperty(c, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return g;
          },
          set: function(y) {
            g = y, s.name || s.displayName || (Object.defineProperty(s, "name", { value: y }), s.displayName = y);
          }
        }), c;
      }, e.isValidElement = V, e.lazy = function(s) {
        return {
          $$typeof: $e,
          _payload: { _status: -1, _result: s },
          _init: R
        };
      }, e.memo = function(s, c) {
        h(s) || console.error(
          "memo: The first argument must be a component. Instead received: %s",
          s === null ? "null" : typeof s
        ), c = {
          $$typeof: Ne,
          type: s,
          compare: c === void 0 ? null : c
        };
        var g;
        return Object.defineProperty(c, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return g;
          },
          set: function(y) {
            g = y, s.name || s.displayName || (Object.defineProperty(s, "name", { value: y }), s.displayName = y);
          }
        }), c;
      }, e.startTransition = function(s) {
        var c = I.T, g = {};
        I.T = g, g._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var y = s(), E = I.S;
          E !== null && E(g, y), typeof y == "object" && y !== null && typeof y.then == "function" && y.then(f, Gt);
        } catch (P) {
          Gt(P);
        } finally {
          c === null && g._updatedFibers && (s = g._updatedFibers.size, g._updatedFibers.clear(), 10 < s && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), I.T = c;
        }
      }, e.unstable_useCacheRefresh = function() {
        return Y().useCacheRefresh();
      }, e.use = function(s) {
        return Y().use(s);
      }, e.useActionState = function(s, c, g) {
        return Y().useActionState(
          s,
          c,
          g
        );
      }, e.useCallback = function(s, c) {
        return Y().useCallback(s, c);
      }, e.useContext = function(s) {
        var c = Y();
        return s.$$typeof === be && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), c.useContext(s);
      }, e.useDebugValue = function(s, c) {
        return Y().useDebugValue(s, c);
      }, e.useDeferredValue = function(s, c) {
        return Y().useDeferredValue(s, c);
      }, e.useEffect = function(s, c) {
        return Y().useEffect(s, c);
      }, e.useId = function() {
        return Y().useId();
      }, e.useImperativeHandle = function(s, c, g) {
        return Y().useImperativeHandle(s, c, g);
      }, e.useInsertionEffect = function(s, c) {
        return Y().useInsertionEffect(s, c);
      }, e.useLayoutEffect = function(s, c) {
        return Y().useLayoutEffect(s, c);
      }, e.useMemo = function(s, c) {
        return Y().useMemo(s, c);
      }, e.useOptimistic = function(s, c) {
        return Y().useOptimistic(s, c);
      }, e.useReducer = function(s, c, g) {
        return Y().useReducer(s, c, g);
      }, e.useRef = function(s) {
        return Y().useRef(s);
      }, e.useState = function(s) {
        return Y().useState(s);
      }, e.useSyncExternalStore = function(s, c, g) {
        return Y().useSyncExternalStore(
          s,
          c,
          g
        );
      }, e.useTransition = function() {
        return Y().useTransition();
      }, e.version = "19.0.0", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(De, De.exports)), De.exports;
}
var mn;
function lo() {
  return mn || (mn = 1, process.env.NODE_ENV === "production" ? nt.exports = io() : nt.exports = ao()), nt.exports;
}
var fe = lo();
const yn = /* @__PURE__ */ so(fe), uo = (r, e, t, n) => {
  const o = [t, {
    code: e,
    ...n || {}
  }];
  if (r?.services?.logger?.forward)
    return r.services.logger.forward(o, "warn", "react-i18next::", !0);
  Oe(o[0]) && (o[0] = `react-i18next:: ${o[0]}`), r?.services?.logger?.warn ? r.services.logger.warn(...o) : console?.warn && console.warn(...o);
}, bn = {}, kt = (r, e, t, n) => {
  Oe(t) && bn[t] || (Oe(t) && (bn[t] = /* @__PURE__ */ new Date()), uo(r, e, t, n));
}, Kn = (r, e) => () => {
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
}, Et = (r, e, t) => {
  r.loadNamespaces(e, Kn(r, t));
}, vn = (r, e, t, n) => {
  if (Oe(t) && (t = [t]), r.options.preload && r.options.preload.indexOf(e) > -1) return Et(r, t, n);
  t.forEach((o) => {
    r.options.ns.indexOf(o) < 0 && r.options.ns.push(o);
  }), r.loadLanguages(e, Kn(r, n));
}, co = (r, e, t = {}) => !e.languages || !e.languages.length ? (kt(e, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
  languages: e.languages
}), !0) : e.hasLoadedNamespace(r, {
  lng: t.lng,
  precheck: (n, o) => {
    if (t.bindI18n && t.bindI18n.indexOf("languageChanging") > -1 && n.services.backendConnector.backend && n.isLanguageChangingTo && !o(n.isLanguageChangingTo, r)) return !1;
  }
}), Oe = (r) => typeof r == "string", fo = (r) => typeof r == "object" && r !== null, po = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, ho = {
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
}, go = (r) => ho[r], mo = (r) => r.replace(po, go);
let Ot = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: mo
};
const yo = (r = {}) => {
  Ot = {
    ...Ot,
    ...r
  };
}, bo = () => Ot;
let Vn;
const vo = (r) => {
  Vn = r;
}, wo = () => Vn, xo = {
  type: "3rdParty",
  init(r) {
    yo(r.options.react), vo(r);
  }
}, So = fe.createContext();
class ko {
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
const Eo = (r, e) => {
  const t = fe.useRef();
  return fe.useEffect(() => {
    t.current = r;
  }, [r, e]), t.current;
}, qn = (r, e, t, n) => r.getFixedT(e, t, n), Oo = (r, e, t, n) => fe.useCallback(qn(r, e, t, n), [r, e, t, n]), Co = (r, e = {}) => {
  const {
    i18n: t
  } = e, {
    i18n: n,
    defaultNS: o
  } = fe.useContext(So) || {}, i = t || n || wo();
  if (i && !i.reportNamespaces && (i.reportNamespaces = new ko()), !i) {
    kt(i, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
    const F = (H, X) => Oe(X) ? X : fo(X) && Oe(X.defaultValue) ? X.defaultValue : Array.isArray(H) ? H[H.length - 1] : H, T = [F, {}, !1];
    return T.t = F, T.i18n = {}, T.ready = !1, T;
  }
  i.options.react?.wait && kt(i, "DEPRECATED_OPTION", "useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
  const a = {
    ...bo(),
    ...i.options.react,
    ...e
  }, {
    useSuspense: l,
    keyPrefix: u
  } = a;
  let d = r || o || i.options?.defaultNS;
  d = Oe(d) ? [d] : d || ["translation"], i.reportNamespaces.addUsedNamespaces?.(d);
  const p = (i.isInitialized || i.initializedStoreOnce) && d.every((F) => co(F, i, a)), h = Oo(i, e.lng || null, a.nsMode === "fallback" ? d : d[0], u), x = () => h, v = () => qn(i, e.lng || null, a.nsMode === "fallback" ? d : d[0], u), [b, A] = fe.useState(x);
  let $ = d.join();
  e.lng && ($ = `${e.lng}${$}`);
  const B = Eo($), D = fe.useRef(!0);
  fe.useEffect(() => {
    const {
      bindI18n: F,
      bindI18nStore: T
    } = a;
    D.current = !0, !p && !l && (e.lng ? vn(i, e.lng, d, () => {
      D.current && A(v);
    }) : Et(i, d, () => {
      D.current && A(v);
    })), p && B && B !== $ && D.current && A(v);
    const H = () => {
      D.current && A(v);
    };
    return F && i?.on(F, H), T && i?.store.on(T, H), () => {
      D.current = !1, i && F && F?.split(" ").forEach((X) => i.off(X, H)), T && i && T.split(" ").forEach((X) => i.store.off(X, H));
    };
  }, [i, $]), fe.useEffect(() => {
    D.current && p && A(x);
  }, [i, u, p]);
  const Q = [b, i, p];
  if (Q.t = b, Q.i18n = i, Q.ready = p, p || !p && !l) return Q;
  throw new Promise((F) => {
    e.lng ? vn(i, e.lng, d, () => F()) : Et(i, d, () => F());
  });
}, {
  slice: Ro,
  forEach: Po
} = [];
function Lo(r) {
  return Po.call(Ro.call(arguments, 1), (e) => {
    if (e)
      for (const t in e)
        r[t] === void 0 && (r[t] = e[t]);
  }), r;
}
function To(r) {
  return typeof r != "string" ? !1 : [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i].some((t) => t.test(r));
}
const wn = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, _o = function(r, e) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  }, o = encodeURIComponent(e);
  let i = `${r}=${o}`;
  if (n.maxAge > 0) {
    const a = n.maxAge - 0;
    if (Number.isNaN(a)) throw new Error("maxAge should be a Number");
    i += `; Max-Age=${Math.floor(a)}`;
  }
  if (n.domain) {
    if (!wn.test(n.domain))
      throw new TypeError("option domain is invalid");
    i += `; Domain=${n.domain}`;
  }
  if (n.path) {
    if (!wn.test(n.path))
      throw new TypeError("option path is invalid");
    i += `; Path=${n.path}`;
  }
  if (n.expires) {
    if (typeof n.expires.toUTCString != "function")
      throw new TypeError("option expires is invalid");
    i += `; Expires=${n.expires.toUTCString()}`;
  }
  if (n.httpOnly && (i += "; HttpOnly"), n.secure && (i += "; Secure"), n.sameSite)
    switch (typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite) {
      case !0:
        i += "; SameSite=Strict";
        break;
      case "lax":
        i += "; SameSite=Lax";
        break;
      case "strict":
        i += "; SameSite=Strict";
        break;
      case "none":
        i += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  return n.partitioned && (i += "; Partitioned"), i;
}, xn = {
  create(r, e, t, n) {
    let o = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    t && (o.expires = /* @__PURE__ */ new Date(), o.expires.setTime(o.expires.getTime() + t * 60 * 1e3)), n && (o.domain = n), document.cookie = _o(r, e, o);
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
var Ao = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(r) {
    let {
      lookupCookie: e
    } = r;
    if (e && typeof document < "u")
      return xn.read(e) || void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(r, e) {
    let {
      lookupCookie: t,
      cookieMinutes: n,
      cookieDomain: o,
      cookieOptions: i
    } = e;
    t && typeof document < "u" && xn.create(t, r, n, o, i);
  }
}, jo = {
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
      const i = n.substring(1).split("&");
      for (let a = 0; a < i.length; a++) {
        const l = i[a].indexOf("=");
        l > 0 && i[a].substring(0, l) === e && (t = i[a].substring(l + 1));
      }
    }
    return t;
  }
}, No = {
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
        const i = o.substring(1);
        if (e) {
          const a = i.split("&");
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
let Le = null;
const Sn = () => {
  if (Le !== null) return Le;
  try {
    if (Le = typeof window < "u" && window.localStorage !== null, !Le)
      return !1;
    const r = "i18next.translate.boo";
    window.localStorage.setItem(r, "foo"), window.localStorage.removeItem(r);
  } catch {
    Le = !1;
  }
  return Le;
};
var $o = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(r) {
    let {
      lookupLocalStorage: e
    } = r;
    if (e && Sn())
      return window.localStorage.getItem(e) || void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(r, e) {
    let {
      lookupLocalStorage: t
    } = e;
    t && Sn() && window.localStorage.setItem(t, r);
  }
};
let Te = null;
const kn = () => {
  if (Te !== null) return Te;
  try {
    if (Te = typeof window < "u" && window.sessionStorage !== null, !Te)
      return !1;
    const r = "i18next.translate.boo";
    window.sessionStorage.setItem(r, "foo"), window.sessionStorage.removeItem(r);
  } catch {
    Te = !1;
  }
  return Te;
};
var Mo = {
  name: "sessionStorage",
  lookup(r) {
    let {
      lookupSessionStorage: e
    } = r;
    if (e && kn())
      return window.sessionStorage.getItem(e) || void 0;
  },
  cacheUserLanguage(r, e) {
    let {
      lookupSessionStorage: t
    } = e;
    t && kn() && window.sessionStorage.setItem(t, r);
  }
}, Io = {
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
        for (let i = 0; i < t.length; i++)
          e.push(t[i]);
      n && e.push(n), o && e.push(o);
    }
    return e.length > 0 ? e : void 0;
  }
}, zo = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(r) {
    let {
      htmlTag: e
    } = r, t;
    const n = e || (typeof document < "u" ? document.documentElement : null);
    return n && typeof n.getAttribute == "function" && (t = n.getAttribute("lang")), t;
  }
}, Do = {
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
}, Fo = {
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
let Gn = !1;
try {
  document.cookie, Gn = !0;
} catch {
}
const Bn = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
Gn || Bn.splice(1, 1);
const Uo = () => ({
  order: Bn,
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
class Yn {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector", this.detectors = {}, this.init(e, t);
  }
  init() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = e, this.options = Lo(t, this.options || {}, Uo()), typeof this.options.convertDetectedLanguage == "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1 && (this.options.convertDetectedLanguage = (o) => o.replace("-", "_")), this.options.lookupFromUrlIndex && (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex), this.i18nOptions = n, this.addDetector(Ao), this.addDetector(jo), this.addDetector($o), this.addDetector(Mo), this.addDetector(Io), this.addDetector(zo), this.addDetector(Do), this.addDetector(Fo), this.addDetector(No);
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
    }), t = t.filter((n) => n != null && !To(n)).map((n) => this.options.convertDetectedLanguage(n)), this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes ? t : t.length > 0 ? t[0] : null;
  }
  cacheUserLanguage(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    t && (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(e) > -1 || t.forEach((n) => {
      this.detectors[n] && this.detectors[n].cacheUserLanguage(e, this.options);
    }));
  }
}
Yn.type = "languageDetector";
function Ct(r) {
  "@babel/helpers - typeof";
  return Ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ct(r);
}
function Wn() {
  return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : Ct(XMLHttpRequest)) === "object";
}
function Ho(r) {
  return !!r && typeof r.then == "function";
}
function Ko(r) {
  return Ho(r) ? r : Promise.resolve(r);
}
function En(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(r);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(r, o).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function On(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? En(Object(t), !0).forEach(function(n) {
      Vo(r, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : En(Object(t)).forEach(function(n) {
      Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return r;
}
function Vo(r, e, t) {
  return (e = qo(e)) in r ? Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : r[e] = t, r;
}
function qo(r) {
  var e = Go(r, "string");
  return Ce(e) == "symbol" ? e : e + "";
}
function Go(r, e) {
  if (Ce(r) != "object" || !r) return r;
  var t = r[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(r, e);
    if (Ce(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(r);
}
function Ce(r) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ce(r);
}
var xe = typeof fetch == "function" ? fetch : void 0;
typeof global < "u" && global.fetch ? xe = global.fetch : typeof window < "u" && window.fetch && (xe = window.fetch);
var Ke;
Wn() && (typeof global < "u" && global.XMLHttpRequest ? Ke = global.XMLHttpRequest : typeof window < "u" && window.XMLHttpRequest && (Ke = window.XMLHttpRequest));
var it;
typeof ActiveXObject == "function" && (typeof global < "u" && global.ActiveXObject ? it = global.ActiveXObject : typeof window < "u" && window.ActiveXObject && (it = window.ActiveXObject));
typeof xe != "function" && (xe = void 0);
if (!xe && !Ke && !it)
  try {
    import("./browser-ponyfill-p_xj49YZ.js").then((r) => r.b).then(function(r) {
      xe = r.default;
    }).catch(function() {
    });
  } catch {
  }
var Rt = function(e, t) {
  if (t && Ce(t) === "object") {
    var n = "";
    for (var o in t)
      n += "&" + encodeURIComponent(o) + "=" + encodeURIComponent(t[o]);
    if (!n) return e;
    e = e + (e.indexOf("?") !== -1 ? "&" : "?") + n.slice(1);
  }
  return e;
}, Cn = function(e, t, n, o) {
  var i = function(u) {
    if (!u.ok) return n(u.statusText || "Error", {
      status: u.status
    });
    u.text().then(function(d) {
      n(null, {
        status: u.status,
        data: d
      });
    }).catch(n);
  };
  if (o) {
    var a = o(e, t);
    if (a instanceof Promise) {
      a.then(i).catch(n);
      return;
    }
  }
  typeof fetch == "function" ? fetch(e, t).then(i).catch(n) : xe(e, t).then(i).catch(n);
}, Rn = !1, Bo = function(e, t, n, o) {
  e.queryStringParams && (t = Rt(t, e.queryStringParams));
  var i = On({}, typeof e.customHeaders == "function" ? e.customHeaders() : e.customHeaders);
  typeof window > "u" && typeof global < "u" && typeof global.process < "u" && global.process.versions && global.process.versions.node && (i["User-Agent"] = "i18next-http-backend (node/".concat(global.process.version, "; ").concat(global.process.platform, " ").concat(global.process.arch, ")")), n && (i["Content-Type"] = "application/json");
  var a = typeof e.requestOptions == "function" ? e.requestOptions(n) : e.requestOptions, l = On({
    method: n ? "POST" : "GET",
    body: n ? e.stringify(n) : void 0,
    headers: i
  }, Rn ? {} : a), u = typeof e.alternateFetch == "function" && e.alternateFetch.length >= 1 ? e.alternateFetch : void 0;
  try {
    Cn(t, l, o, u);
  } catch (d) {
    if (!a || Object.keys(a).length === 0 || !d.message || d.message.indexOf("not implemented") < 0)
      return o(d);
    try {
      Object.keys(a).forEach(function(p) {
        delete l[p];
      }), Cn(t, l, o, u), Rn = !0;
    } catch (p) {
      o(p);
    }
  }
}, Yo = function(e, t, n, o) {
  n && Ce(n) === "object" && (n = Rt("", n).slice(1)), e.queryStringParams && (t = Rt(t, e.queryStringParams));
  try {
    var i = Ke ? new Ke() : new it("MSXML2.XMLHTTP.3.0");
    i.open(n ? "POST" : "GET", t, 1), e.crossDomain || i.setRequestHeader("X-Requested-With", "XMLHttpRequest"), i.withCredentials = !!e.withCredentials, n && i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.overrideMimeType && i.overrideMimeType("application/json");
    var a = e.customHeaders;
    if (a = typeof a == "function" ? a() : a, a)
      for (var l in a)
        i.setRequestHeader(l, a[l]);
    i.onreadystatechange = function() {
      i.readyState > 3 && o(i.status >= 400 ? i.statusText : null, {
        status: i.status,
        data: i.responseText
      });
    }, i.send(n);
  } catch (u) {
    console && console.log(u);
  }
}, Wo = function(e, t, n, o) {
  if (typeof n == "function" && (o = n, n = void 0), o = o || function() {
  }, xe && t.indexOf("file:") !== 0)
    return Bo(e, t, n, o);
  if (Wn() || typeof ActiveXObject == "function")
    return Yo(e, t, n, o);
  o(new Error("No fetch and no xhr implementation found!"));
};
function _e(r) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, _e(r);
}
function Pn(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(r);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(r, o).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function yt(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Pn(Object(t), !0).forEach(function(n) {
      Xn(r, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : Pn(Object(t)).forEach(function(n) {
      Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return r;
}
function Xo(r, e) {
  if (!(r instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function Qo(r, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, Qn(n.key), n);
  }
}
function Jo(r, e, t) {
  return e && Qo(r.prototype, e), Object.defineProperty(r, "prototype", { writable: !1 }), r;
}
function Xn(r, e, t) {
  return (e = Qn(e)) in r ? Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : r[e] = t, r;
}
function Qn(r) {
  var e = Zo(r, "string");
  return _e(e) == "symbol" ? e : e + "";
}
function Zo(r, e) {
  if (_e(r) != "object" || !r) return r;
  var t = r[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(r, e);
    if (_e(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(r);
}
var es = function() {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/add/{{lng}}/{{ns}}",
    parse: function(t) {
      return JSON.parse(t);
    },
    stringify: JSON.stringify,
    parsePayload: function(t, n, o) {
      return Xn({}, n, o || "");
    },
    parseLoadPayload: function(t, n) {
    },
    request: Wo,
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
}, Jn = (function() {
  function r(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Xo(this, r), this.services = e, this.options = t, this.allOptions = n, this.type = "backend", this.init(e, t, n);
  }
  return Jo(r, [{
    key: "init",
    value: function(t) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (this.services = t, this.options = yt(yt(yt({}, es()), this.options || {}), o), this.allOptions = i, this.services && this.options.reloadInterval) {
        var a = setInterval(function() {
          return n.reload();
        }, this.options.reloadInterval);
        _e(a) === "object" && typeof a.unref == "function" && a.unref();
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
    value: function(t, n, o, i, a) {
      var l = this, u = this.options.loadPath;
      typeof this.options.loadPath == "function" && (u = this.options.loadPath(t, o)), u = Ko(u), u.then(function(d) {
        if (!d) return a(null, {});
        var p = l.services.interpolator.interpolate(d, {
          lng: t.join("+"),
          ns: o.join("+")
        });
        l.loadUrl(p, a, n, i);
      });
    }
  }, {
    key: "loadUrl",
    value: function(t, n, o, i) {
      var a = this, l = typeof o == "string" ? [o] : o, u = typeof i == "string" ? [i] : i, d = this.options.parseLoadPayload(l, u);
      this.options.request(this.options, t, d, function(p, h) {
        if (h && (h.status >= 500 && h.status < 600 || !h.status)) return n("failed loading " + t + "; status code: " + h.status, !0);
        if (h && h.status >= 400 && h.status < 500) return n("failed loading " + t + "; status code: " + h.status, !1);
        if (!h && p && p.message) {
          var x = p.message.toLowerCase(), v = ["failed", "fetch", "network", "load"].find(function($) {
            return x.indexOf($) > -1;
          });
          if (v)
            return n("failed loading " + t + ": " + p.message, !0);
        }
        if (p) return n(p, !1);
        var b, A;
        try {
          typeof h.data == "string" ? b = a.options.parse(h.data, o, i) : b = h.data;
        } catch {
          A = "failed parsing " + t + " to json";
        }
        if (A) return n(A, !1);
        n(null, b);
      });
    }
  }, {
    key: "create",
    value: function(t, n, o, i, a) {
      var l = this;
      if (this.options.addPath) {
        typeof t == "string" && (t = [t]);
        var u = this.options.parsePayload(n, o, i), d = 0, p = [], h = [];
        t.forEach(function(x) {
          var v = l.options.addPath;
          typeof l.options.addPath == "function" && (v = l.options.addPath(x, n));
          var b = l.services.interpolator.interpolate(v, {
            lng: x,
            ns: n
          });
          l.options.request(l.options, b, u, function(A, $) {
            d += 1, p.push(A), h.push($), d === t.length && typeof a == "function" && a(p, h);
          });
        });
      }
    }
  }, {
    key: "reload",
    value: function() {
      var t = this, n = this.services, o = n.backendConnector, i = n.languageUtils, a = n.logger, l = o.language;
      if (!(l && l.toLowerCase() === "cimode")) {
        var u = [], d = function(h) {
          var x = i.toResolveHierarchy(h);
          x.forEach(function(v) {
            u.indexOf(v) < 0 && u.push(v);
          });
        };
        d(l), this.allOptions.preload && this.allOptions.preload.forEach(function(p) {
          return d(p);
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
Jn.type = "backend";
const Zn = "common", ts = {
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
ie.use(Jn).use(Yn).use(xo).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS: Zn,
  ns: ["common", "auth", "navigation"],
  interpolation: {
    escapeValue: !1
  },
  resources: ts,
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
const ns = (r) => Co(r ?? Zn), rs = () => {
  const { i18n: r } = ns(), e = (t) => {
    r.changeLanguage(t);
  };
  return {
    currentLanguage: r.language,
    changeLanguage: e,
    languages: ["en", "ru"]
  };
}, as = ({ className: r }) => {
  const { currentLanguage: e, changeLanguage: t, languages: n } = rs();
  return /* @__PURE__ */ yn.createElement(
    "select",
    {
      value: e,
      onChange: (o) => t(o.target.value),
      className: r
    },
    n.map((o) => /* @__PURE__ */ yn.createElement("option", { key: o, value: o }, o.toUpperCase()))
  );
};
export {
  as as L,
  ss as a,
  rs as b,
  is as c,
  so as g,
  ie as i,
  os as s,
  ns as u
};
