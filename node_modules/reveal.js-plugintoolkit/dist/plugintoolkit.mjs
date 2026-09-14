import e from "deepmerge";
//#region \0rolldown/runtime.js
var t = Object.defineProperty, n = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = [
	".js",
	".min.js",
	".mjs"
], i = (() => {
	let e = import.meta;
	if (typeof e?.url == "string" && e.url !== "") return e.url;
	let t = typeof document < "u" ? document.currentScript : null;
	return t && "src" in t && t.src ? t.src : "";
})(), a = (e) => {
	let t = e.lastIndexOf("/");
	return t === -1 ? "" : e.slice(0, t + 1);
}, o = (e) => {
	let t = e.split(/[?#]/)[0];
	return t.slice(t.lastIndexOf("/") + 1);
}, s = (e, t) => r.some((n) => e === `${t}${n}`), c = [
	/\/@fs\//,
	/\/@id\//,
	/\/\.vite\/deps\//,
	/[?&][vt]=/
], l = (e) => c.some((t) => t.test(e)), u = (e) => {
	if (typeof document < "u") {
		let t = r.map((t) => `script[src$="${e}${t}"]`).join(", "), n = document.querySelector(t)?.getAttribute("src");
		if (n) return { directory: a(n) };
	}
	return i && !l(i) && s(o(i), e) ? { directory: a(i) } : { directory: null };
}, d = (e) => u(e).directory !== null, f = /* @__PURE__ */ new Map(), ee = (e = "") => {
	let t = f.get(e);
	if (t) return t;
	let n = typeof window < "u", r = typeof document < "u", i = import.meta, a = !1;
	try {
		a = typeof module < "u" && !!module?.hot;
	} catch {}
	let o = !1;
	try {
		o = !!i?.hot;
	} catch {}
	let s = a || o, c = !1;
	try {
		c = i?.env?.DEV === !0;
	} catch {}
	let l = e !== "" && d(e), u = {
		hasResolvableSource: l,
		hasWindow: n,
		hasDocument: r,
		isBundled: !l,
		isDevelopment: s || c,
		hasHMR: s,
		isViteDev: c
	};
	return f.set(e, u), u;
}, te = class {
	defaultConfig;
	pluginInit;
	pluginId;
	mergedConfig = null;
	userConfigData = null;
	data = {};
	constructor(e, t, n) {
		typeof e == "string" ? (this.pluginId = e, this.pluginInit = t, this.defaultConfig = n || {}) : (this.pluginId = e.id, this.pluginInit = e.init, this.defaultConfig = e.defaultConfig || {});
	}
	initializeConfig(t) {
		let n = this.defaultConfig, r = t.getConfig()[this.pluginId] || {};
		this.userConfigData = r, this.mergedConfig = e(n, r, {
			arrayMerge: (e, t) => t,
			clone: !0
		});
	}
	getCurrentConfig() {
		if (!this.mergedConfig) throw Error("Plugin configuration has not been initialized");
		return this.mergedConfig;
	}
	getData() {
		return Object.keys(this.data).length > 0 ? this.data : void 0;
	}
	get userConfig() {
		return this.userConfigData || {};
	}
	getEnvironmentInfo = () => ee(this.pluginId);
	init(e) {
		if (this.initializeConfig(e), this.pluginInit) return this.pluginInit(this, e, this.getCurrentConfig());
	}
	createInterface(e = {}) {
		return {
			id: this.pluginId,
			init: (e) => this.init(e),
			getConfig: () => this.getCurrentConfig(),
			getData: () => this.getData(),
			...e
		};
	}
}, p = "data-css-id", m = (e, t) => new Promise((n, r) => {
	let i = document.createElement("link");
	i.rel = "stylesheet", i.href = t, i.setAttribute(p, e);
	let a = setTimeout(() => {
		i.parentNode && i.parentNode.removeChild(i), r(/* @__PURE__ */ Error(`[${e}] Timeout loading CSS from: ${t}`));
	}, 5e3);
	i.onload = () => {
		clearTimeout(a), n();
	}, i.onerror = () => {
		clearTimeout(a), i.parentNode && i.parentNode.removeChild(i), r(/* @__PURE__ */ Error(`[${e}] Failed to load CSS from: ${t}`));
	}, document.head.appendChild(i);
}), ne = (e) => document.querySelectorAll(`[${p}="${e}"]`).length > 0, re = 1e4, ie = (e) => Promise.resolve(g(e)), h = (e) => new Promise((t) => {
	if (g(e)) return t(!0);
	if (typeof MutationObserver > "u") return t(!1);
	let n = !1, r = (e) => {
		n || (n = !0, i.disconnect(), clearTimeout(o), window.removeEventListener("load", a), t(e));
	}, i = new MutationObserver(() => {
		g(e) && r(!0);
	});
	i.observe(document.documentElement, {
		childList: !0,
		subtree: !0,
		attributeFilter: ["href", "rel"]
	});
	let a = () => requestAnimationFrame(() => r(g(e)));
	document.readyState === "complete" ? a() : window.addEventListener("load", a, { once: !0 });
	let o = setTimeout(() => r(g(e)), re);
}), g = (e) => {
	if (ne(e)) return !0;
	try {
		return window.getComputedStyle(document.documentElement).getPropertyValue(`--cssimported-${e}`).trim() !== "";
	} catch {
		return !1;
	}
}, ae = "--r-main-color", _ = () => {
	if (typeof document > "u" || typeof window > "u") return !1;
	try {
		return getComputedStyle(document.documentElement).getPropertyValue(ae).trim() !== "";
	} catch {
		return !1;
	}
}, v = (e = 1e3) => _() ? Promise.resolve(!0) : new Promise((t) => {
	let n = Date.now() + e, r = () => {
		if (_()) {
			t(!0);
			return;
		}
		if (Date.now() >= n) {
			t(!1);
			return;
		}
		setTimeout(r, 16);
	};
	r();
}), oe = () => _(), se = ((e) => new Proxy(e, { get: (e, t) => {
	if (t in e) return e[t];
	let n = t.toString();
	if (typeof console[n] == "function") return (...t) => {
		e.debugLog(n, ...t);
	};
} }))(new class {
	debugMode = !1;
	label = "DEBUG";
	groupDepth = 0;
	initialize(e, t = "DEBUG") {
		this.debugMode = e, this.label = t;
	}
	group = (...e) => {
		this.debugLog("group", ...e), this.groupDepth++;
	};
	groupCollapsed = (...e) => {
		this.debugLog("groupCollapsed", ...e), this.groupDepth++;
	};
	groupEnd = () => {
		this.groupDepth > 0 && (this.groupDepth--, this.debugLog("groupEnd"));
	};
	error = (...e) => {
		let t = this.debugMode;
		this.debugMode = !0, this.formatAndLog(console.error, e), this.debugMode = t;
	};
	table = (e, t, n) => {
		if (this.debugMode) try {
			typeof e == "string" && t !== void 0 && typeof t != "string" ? (this.groupDepth === 0 ? console.log(`[${this.label}]: ${e}`) : console.log(e), n ? console.table(t, n) : console.table(t)) : (this.groupDepth === 0 && console.log(`[${this.label}]: Table data`), typeof t == "object" && Array.isArray(t) ? console.table(e, t) : console.table(e));
		} catch (t) {
			console.error(`[${this.label}]: Error showing table:`, t), console.log(`[${this.label}]: Raw data:`, e);
		}
	};
	formatAndLog = (e, t) => {
		if (this.debugMode) try {
			this.groupDepth > 0 ? e.call(console, ...t) : t.length > 0 && typeof t[0] == "string" ? e.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : e.call(console, `[${this.label}]:`, ...t);
		} catch (e) {
			console.error(`[${this.label}]: Error in logging:`, e), console.log(`[${this.label}]: Original log data:`, ...t);
		}
	};
	debugLog(e, ...t) {
		let n = console[e];
		if (!this.debugMode && e !== "error" || typeof n != "function") return;
		let r = n;
		if (e === "group" || e === "groupCollapsed") {
			t.length > 0 && typeof t[0] == "string" ? r.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : r.call(console, `[${this.label}]:`, ...t);
			return;
		}
		if (e === "groupEnd") {
			r.call(console);
			return;
		}
		if (e === "table") {
			t.length === 1 ? this.table(t[0]) : t.length === 2 ? (t[0], this.table(t[0], t[1])) : t.length >= 3 && this.table(t[0], t[1], t[2]);
			return;
		}
		this.groupDepth > 0 ? r.call(console, ...t) : t.length > 0 && typeof t[0] == "string" ? r.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : r.call(console, `[${this.label}]:`, ...t);
	}
}()), ce = /* @__PURE__ */ new Set(), y = (e, t) => {
	let n = `${e}::${t}`;
	ce.has(n) || (ce.add(n), console.warn(`[${e}] ${t}`));
}, le = (e) => [`dist/plugin/${e}/${e}.css`, `plugin/${e}/${e}.css`], ue = (e) => typeof e == "string" && e.trim() !== "", b = async (e, t) => {
	let { cssautoload: n, csspath: r, debug: i = !1 } = t;
	if (n === !1 || r === !1) return i && console.log(`[${e}] CSS loading is switched off`), { status: "skipped" };
	if (ue(r)) {
		let t = r.trim(), n = g(e), a = n && !!document.querySelector(`[data-css-id="${e}"]`);
		try {
			return await m(e, t), i && console.log(`[${e}] CSS loaded from: ${t}`), n && y(e, `Loaded CSS from ${t}, but a stylesheet for this plugin was already on the page (${a ? "a tagged <link>" : "an import or inline <style>"}) — csspath adds one, it cannot remove one. Both are live and the cascade decides. Remove the other import or <link>, or drop csspath.`), {
				status: "loaded",
				path: t
			};
		} catch {
			return console.warn(`[${e}] Could not load CSS from: ${t}`), {
				status: "failed",
				path: t
			};
		}
	}
	if (g(e)) return i && console.log(`[${e}] CSS is already imported, skipping`), { status: "present" };
	let { directory: a } = u(e);
	if (a !== null || n === !0) {
		let t = [...a === null ? [] : [`${a}${e}.css`], ...le(e)].filter((e, t, n) => n.indexOf(e) === t);
		for (let n of t) try {
			return await m(e, n), i && console.log(`[${e}] CSS loaded from: ${n}`), {
				status: "loaded",
				path: n
			};
		} catch {
			i && console.log(`[${e}] No CSS at: ${n}`);
		}
		return console.warn(`[${e}] Could not load CSS. Tried: ${t.join(", ")}. Import the stylesheet yourself, or set csspath to where it is.`), { status: "failed" };
	}
	return h(e).then((t) => {
		t || y(e, `CSS could not be autoloaded here, because the plugin is part of a bundle. Import it once in your own code: import 'reveal.js-${e}/${e}.css'`);
	}), { status: "advised" };
};
async function de(e, t) {
	if ("getEnvironmentInfo" in e && t) {
		let n = e, r = n.userConfig, i = "cssautoload" in r && r.cssautoload !== "auto" ? t.cssautoload : void 0;
		return b(n.pluginId, {
			...t,
			cssautoload: i
		});
	}
	let { id: n, cssautoload: r, csspath: i, debug: a } = e;
	return b(n, {
		cssautoload: r === "auto" ? void 0 : r,
		csspath: i,
		debug: a
	});
}
//#endregion
//#region src/utils/plugin-tools/event-tools.ts
var fe = /* @__PURE__ */ n({
	addDirectionEvents: () => w,
	addMoreDirectionEvents: () => T,
	addScrollModeEvents: () => E
}), x = Symbol.for("reveal.js-plugintoolkit.directionEvents"), S = Symbol.for("reveal.js-plugintoolkit.scrollModeEvents"), C = (e, t, n) => {
	Object.defineProperty(e, t, {
		value: n,
		configurable: !0,
		enumerable: !1,
		writable: !1
	});
}, w = (e) => {
	if (e[x]) return;
	let [t, n] = [0, 0];
	e.on("slidechanged", (r) => {
		let { indexh: i, indexv: a, previousSlide: o, currentSlide: s } = r;
		i !== t && e.dispatchEvent({
			type: "slidechanged-h",
			data: {
				previousSlide: o,
				currentSlide: s,
				indexh: i,
				indexv: a
			}
		}), a !== n && i === t && e.dispatchEvent({
			type: "slidechanged-v",
			data: {
				previousSlide: o,
				currentSlide: s,
				indexh: i,
				indexv: a
			}
		}), [t, n] = [i, a];
	}), C(e, x, !0);
}, T = w, E = (e) => {
	if (e[S]) return () => {};
	let t = e.getViewportElement();
	if (!t) return console.warn("[plugintoolkit]: Could not find viewport element"), () => {};
	let n = () => t.classList.contains("reveal-scroll"), r = n(), i = new MutationObserver(() => {
		let t = n();
		if (t !== r) {
			let n = e.getCurrentSlide(), { h: i, v: a } = e.getIndices();
			e.dispatchEvent({
				type: t ? "scrollmode-enter" : "scrollmode-exit",
				data: {
					currentSlide: n,
					previousSlide: null,
					indexh: i,
					indexv: a
				}
			}), r = t;
		}
	});
	i.observe(t, {
		attributes: !0,
		attributeFilter: ["class"]
	});
	let a = () => {
		i.disconnect(), delete e[S];
	};
	return C(e, S, a), a;
}, pe = /* @__PURE__ */ n({
	SectionType: () => me,
	getSectionType: () => M,
	getStack: () => j,
	isHorizontal: () => A,
	isSection: () => D,
	isStack: () => O,
	isVertical: () => k
}), me = /* @__PURE__ */ function(e) {
	return e.HORIZONTAL = "horizontal", e.STACK = "stack", e.VERTICAL = "vertical", e.INVALID = "invalid", e;
}({}), D = (e) => e instanceof HTMLElement && e.tagName === "SECTION", O = (e) => D(e) ? Array.from(e.children).some((e) => e instanceof HTMLElement && e.tagName === "SECTION") : !1, k = (e) => D(e) ? e.parentElement instanceof HTMLElement && e.parentElement.tagName === "SECTION" : !1, A = (e) => D(e) && !k(e) && !O(e), j = (e) => {
	if (!D(e)) return null;
	if (k(e)) {
		let t = e.parentElement;
		if (t instanceof HTMLElement && O(t)) return t;
	}
	return null;
}, M = (e) => D(e) ? k(e) ? "vertical" : O(e) ? "stack" : "horizontal" : "invalid", he = /* @__PURE__ */ n({
	isJSON: () => N,
	toJSONString: () => P
}), N = (e) => {
	try {
		return JSON.parse(e) && !!e;
	} catch {
		return !1;
	}
}, P = (e) => {
	if (e == null) return "";
	let t = e;
	if (typeof t == "string" && (t = t.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'")), N(e)) return e;
	if (typeof e == "object") return JSON.stringify(e, null, 2);
	if (typeof e == "string") {
		let t = e.trim().replace(/'/g, "\"");
		return t.charAt(0) === "{" ? t : `{${t}}`;
	}
	return "";
}, ge = /* @__PURE__ */ n({
	copyDataAttributes: () => F,
	createNode: () => I
}), F = (e, t, n) => {
	for (let r of Array.from(e.attributes)) r.nodeName.startsWith("data") && (!n || r.nodeName !== n) && t.setAttribute(r.nodeName, r.nodeValue || "");
}, I = (e) => document.createRange().createContextualFragment(e).firstElementChild, _e = /* @__PURE__ */ n({ sanitizeText: () => L }), L = (e) => e.toLowerCase().replace(/\s+/g, "").replace(/[^\p{L}\p{N}-]/gu, ""), ve = /* @__PURE__ */ n({ addThemeColor: () => W }), R = Symbol.for("reveal.js-plugintoolkit.themeColor"), z = "has-light-background", B = "has-dark-background", ye = "--c-theme-color", be = "--c-theme-heading-color", xe = {
	text: "section",
	heading: "h1"
}, Se = "c-theme-inverted", Ce = "reveal-scroll", we = "stack", Te = (e, t, n) => {
	Object.defineProperty(e, t, {
		value: n,
		configurable: !0,
		enumerable: !1,
		writable: !1
	});
}, Ee = (e) => {
	let t = e.getElementsByClassName("slides")[0];
	if (!t) return null;
	let n = document.createElement("section"), r = document.createElement(xe.heading);
	n.appendChild(r), t.appendChild(n);
	let i = () => ({
		text: getComputedStyle(n).getPropertyValue("color"),
		heading: getComputedStyle(r).getPropertyValue("color")
	}), a = i();
	n.classList.add(z);
	let o = i(), s = "dark";
	return o.text === a.text && o.heading === a.heading && (s = "light", n.classList.remove(z), n.classList.add(B), o = i()), n.remove(), {
		theme: s,
		text: {
			regular: a.text,
			inverse: o.text
		},
		heading: {
			regular: a.heading,
			inverse: o.heading
		}
	};
}, V = (e, t) => e?.classList.contains(t) ?? !1, De = (e, t, n) => {
	let r = V(n, Ce) ? n : t;
	if (V(r, z)) return "light";
	if (V(r, B)) return "dark";
	let i = e.getCurrentSlide?.()?.parentElement ?? null;
	if (i && V(i, we)) {
		if (V(i, z)) return "light";
		if (V(i, B)) return "dark";
	}
	return null;
}, H = (e, t, n) => {
	let r = De(e, t, e.getViewportElement());
	return n.theme === "dark" ? r === "light" : r === "dark";
}, U = (e, t, n) => {
	let r = (e) => n ? e.inverse : e.regular;
	e.style.setProperty(ye, r(t.text)), e.style.setProperty(be, r(t.heading)), e.classList.toggle(Se, n);
}, Oe = async (e, { timeout: t = 1e3 }) => {
	let n = e.getRevealElement();
	if (!n) return null;
	let r = e.getViewportElement() ?? n;
	await v(t);
	let i = Ee(n);
	if (!i) return null;
	let a = H(e, n, i);
	U(r, i, a);
	let o = () => {
		let t = H(e, n, i);
		t !== a && (a = t, U(r, i, t));
	}, s = new MutationObserver(o);
	return s.observe(n, {
		attributes: !0,
		attributeFilter: ["class"]
	}), r !== n && s.observe(r, {
		attributes: !0,
		attributeFilter: ["class"]
	}), e.on("slidechanged", o), i;
}, W = (e, t = {}) => {
	let n = e[R];
	if (n) return n;
	let r = Oe(e, t);
	return Te(e, R, r), r;
}, ke = /* @__PURE__ */ n({ addSlideStates: () => Fe }), G = Symbol.for("reveal.js-plugintoolkit.slideStates"), Ae = "reveal-scroll", K = "data-toolkit-stack-state", je = (e, t, n) => {
	Object.defineProperty(e, t, {
		value: n,
		configurable: !0,
		enumerable: !1,
		writable: !1
	});
}, q = (e) => (e ?? "").split(" ").filter(Boolean), J = (e) => Array.from(new Set(e)), Me = (e) => e.classList.contains(Ae), Y = (e) => {
	if (e.querySelector(".scroll-page")) return !1;
	for (let t of Array.from(e.querySelectorAll(".slides > section"))) {
		let e = t.querySelectorAll(":scope > section");
		if (!e.length) continue;
		let n = t.getAttribute("data-state");
		for (let t of Array.from(e)) n ? t.setAttribute(K, n) : t.removeAttribute(K);
	}
	return !0;
}, X = (e) => {
	if (!e) return [];
	let t = e.parentElement;
	return J([...t?.tagName === "SECTION" ? q(t.getAttribute("data-state")) : q(e.getAttribute(K)), ...q(e.getAttribute("data-state"))]);
}, Z = (e, t, n, { dispatch: r }) => {
	let i = X(n);
	for (let e of t.applied) i.includes(e) || t.host.classList.remove(e);
	for (let n of i) t.host.classList.add(n), r && !t.applied.includes(n) && e.dispatchEvent({ type: n });
	t.applied = i;
}, Ne = (e) => {
	e.warned || e.stacksRead || e.revealElement.querySelector(".scroll-page section[data-index-v]:not([data-index-v=\"0\"])") && (e.warned = !0, console.warn("[plugintoolkit]: addSlideStates was called after the deck had already switched to scroll view, so the states of stacks are unknown until it leaves scroll view once. Slides still get their own states. Call it from a plugin's init to avoid this."));
}, Pe = (e) => {
	let t = e.getRevealElement();
	if (!t) return null;
	let n = e.getViewportElement() ?? t, r = Me(n), i = {
		revealElement: t,
		host: n,
		inScrollView: r,
		applied: [],
		regularStates: r ? [] : X(e.getCurrentSlide()),
		switching: !1,
		stacksRead: Y(t),
		warned: !1
	};
	r && (Ne(i), Z(e, i, e.getCurrentSlide(), { dispatch: !1 }));
	let a = () => {
		let r = Me(n);
		r !== i.inScrollView && (i.inScrollView = r, r ? (Ne(i), i.applied = J([...i.applied, ...i.regularStates]), i.switching = !0, queueMicrotask(() => {
			i.switching = !1;
		}), Z(e, i, e.getCurrentSlide(), { dispatch: !1 })) : (Z(e, i, e.getCurrentSlide(), { dispatch: !1 }), i.applied = [], i.regularStates = X(e.getCurrentSlide()), i.stacksRead = Y(t) || i.stacksRead));
	};
	return new MutationObserver(a).observe(n, {
		attributes: !0,
		attributeFilter: ["class"]
	}), e.on("ready", () => {
		a(), i.inScrollView ? Z(e, i, e.getCurrentSlide(), { dispatch: !1 }) : (i.regularStates = X(e.getCurrentSlide()), i.stacksRead = Y(t) || i.stacksRead);
	}), e.on("slidechanged", (t) => {
		a();
		let { currentSlide: n } = t, r = n ?? e.getCurrentSlide();
		i.inScrollView ? Z(e, i, r, { dispatch: !i.switching }) : i.regularStates = X(r);
	}), i;
}, Fe = (e) => {
	if (e[G]) return;
	let t = Pe(e);
	t && je(e, G, t);
}, Ie = /* @__PURE__ */ n({ addAnchor: () => $ }), Le = "data-toolkit-anchor", Re = "--toolkit-anchor-height", Q = (e) => e.getConfig(), ze = (e) => Q(e).view === "print" || /print-pdf/i.test(window.location.search) || document.documentElement.classList.contains("print-pdf"), Be = (e, t, n, r, i) => {
	let { style: a } = t, o = r === "top";
	a.setProperty("display", i.print !== "keep" && ze(e) ? "none" : "block"), a.setProperty("height", "0"), a.setProperty("margin", "0"), a.setProperty("padding", "0"), a.setProperty("z-index", String(i.zIndex ?? 2)), n ? (a.setProperty("position", "sticky"), a.setProperty("inset-inline", "auto"), a.setProperty("top", o ? "0" : "100%"), a.setProperty("bottom", o ? "100%" : "0")) : (a.setProperty("position", "fixed"), a.setProperty("inset-inline", "0"), a.setProperty("top", o ? "0" : "auto"), a.setProperty("bottom", o ? "auto" : "0")), Q(e).rtl ? a.setProperty("direction", "rtl") : a.removeProperty("direction");
}, $ = (e, t = {}) => {
	let n = e.getRevealElement();
	if (!n) return null;
	let r = t.edge === "bottom" ? "bottom" : "top", i = e.getViewportElement() ?? document.body, a = i === n, o = document.createElement("div");
	o.setAttribute(Le, r), t.className && (o.className = t.className);
	let s = () => Be(e, o, a, r, t);
	s(), n.appendChild(o), new MutationObserver(s).observe(n, {
		attributes: !0,
		attributeFilter: ["class"]
	}), e.on("ready", s);
	let c = () => o.style.setProperty(Re, `${i.clientHeight}px`);
	return c(), new ResizeObserver(c).observe(i), o;
}, Ve = /* @__PURE__ */ n({
	addAnchor: () => $,
	addDirectionEvents: () => w,
	addMoreDirectionEvents: () => T,
	addScrollModeEvents: () => E,
	addSlideStates: () => Fe,
	addThemeColor: () => W,
	copyDataAttributes: () => F,
	createNode: () => I,
	getSectionType: () => M,
	getStack: () => j,
	isHorizontal: () => A,
	isJSON: () => N,
	isSection: () => D,
	isStack: () => O,
	isVertical: () => k,
	sanitizeText: () => L,
	toJSONString: () => P
});
//#endregion
export { te as PluginBase, g as checkCssImported, he as configTools, ge as domTools, fe as eventTools, u as findPluginSource, d as hasResolvableSource, ie as isCssImported, oe as isThemeApplied, de as pluginCSS, se as pluginDebug, Ve as pluginTools, Ie as positionTools, pe as sectionTools, ke as stateTools, _e as textTools, ve as themeTools, y as warnOnce, h as whenCssImported, v as whenThemeApplied };
