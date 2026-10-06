const __pluginConfig =  {
  "name": "windy-plugin-helo-routes",
  "version": "1.0.0",
  "icon": "🧭",
  "title": "HELO Routes",
  "description": "HELO routes with waypoint wind forecast from 2000 to 6000 ft.",
  "author": "Diogo",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "desktopWidth": 390,
  "routerPath": "/helo-routes",
  "private": true,
  "built": 1791310945052,
  "builtReadable": "2026-10-06T18:22:25.052Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} name
 * @returns {SVGElement}
 */
function svg_element(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}
/** */
class HtmlTag {
	/**
	 * @private
	 * @default false
	 */
	is_svg = false;
	/** parent for creating node */
	e = undefined;
	/** html tag nodes */
	n = undefined;
	/** target */
	t = undefined;
	/** anchor */
	a = undefined;
	constructor(is_svg = false) {
		this.is_svg = is_svg;
		this.e = this.n = null;
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	c(html) {
		this.h(html);
	}

	/**
	 * @param {string} html
	 * @param {HTMLElement | SVGElement} target
	 * @param {HTMLElement | SVGElement} anchor
	 * @returns {void}
	 */
	m(html, target, anchor = null) {
		if (!this.e) {
			if (this.is_svg)
				this.e = svg_element(/** @type {keyof SVGElementTagNameMap} */ (target.nodeName));
			/** #7364  target for <template> may be provided as #document-fragment(11) */ else
				this.e = element(
					/** @type {keyof HTMLElementTagNameMap} */ (
						target.nodeType === 11 ? 'TEMPLATE' : target.nodeName
					)
				);
			this.t =
				target.tagName !== 'TEMPLATE'
					? target
					: /** @type {HTMLTemplateElement} */ (target).content;
			this.c(html);
		}
		this.i(anchor);
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	h(html) {
		this.e.innerHTML = html;
		this.n = Array.from(
			this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes
		);
	}

	/**
	 * @returns {void} */
	i(anchor) {
		for (let i = 0; i < this.n.length; i += 1) {
			insert(this.t, this.n[i], anchor);
		}
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	p(html) {
		this.d();
		this.h(html);
		this.i(this.a);
	}

	/**
	 * @returns {void} */
	d() {
		this.n.forEach(detach);
	}
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    title: 'HELO Routes'};

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1dyaz31", ".intro.svelte-1dyaz31{margin:10px 12px 14px;padding:10px 12px;border-radius:8px;background:rgba(128, 128, 128, 0.12)}.intro-title.svelte-1dyaz31{font-weight:700;font-size:13px;letter-spacing:0.6px;margin-bottom:4px}.intro-text.svelte-1dyaz31{font-size:12px;line-height:1.45;opacity:0.82}.status.svelte-1dyaz31,.error.svelte-1dyaz31{margin:10px 12px;padding:9px 10px;border-radius:6px;font-size:12px}.status.svelte-1dyaz31{background:rgba(80, 150, 255, 0.12)}.error.svelte-1dyaz31{background:rgba(220, 70, 70, 0.15)}.route-card.svelte-1dyaz31{margin:0 10px 14px;border:1px solid rgba(128, 128, 128, 0.25);border-radius:9px;overflow:hidden}.route-header.svelte-1dyaz31{display:flex;justify-content:space-between;align-items:center;padding:9px 10px 5px;font-weight:700}.route-name.svelte-1dyaz31{font-size:14px}.route-distance.svelte-1dyaz31{font-size:12px;opacity:0.8}.route-meta.svelte-1dyaz31{display:flex;gap:12px;padding:0 10px 8px;font-size:10px;opacity:0.65}.waypoint-card.svelte-1dyaz31{margin:0 8px 8px;padding:8px;border-radius:7px;background:rgba(128, 128, 128, 0.08)}.waypoint-header.svelte-1dyaz31{margin-bottom:6px}.wp-name.svelte-1dyaz31{display:inline-block;font-weight:700;margin-right:7px}.wp-coords.svelte-1dyaz31{font-size:10px;opacity:0.65}.wind-table.svelte-1dyaz31{font-family:monospace;font-size:12px}.wind-head.svelte-1dyaz31,.wind-row.svelte-1dyaz31{display:grid;grid-template-columns:75px 1fr;align-items:center}.wind-head.svelte-1dyaz31{padding:3px 4px;font-size:10px;font-weight:700;opacity:0.6;border-bottom:1px solid rgba(128, 128, 128, 0.2)}.wind-row.svelte-1dyaz31{min-height:28px;padding:1px 4px}.alt.svelte-1dyaz31{white-space:nowrap}.wind-cell.svelte-1dyaz31{display:flex;align-items:center;gap:7px}.wind-dir.svelte-1dyaz31{width:34px}.wind-speed.svelte-1dyaz31{width:45px}.no-data.svelte-1dyaz31{padding:7px 4px;font-size:11px;opacity:0.7}.controls.svelte-1dyaz31{display:flex;gap:8px;margin:4px 10px 12px}button.svelte-1dyaz31{border:0;border-radius:6px;padding:9px 10px;cursor:pointer;font-size:11px;font-weight:700}.action-button.svelte-1dyaz31{flex:1}.clear-button.svelte-1dyaz31{opacity:0.75}button.svelte-1dyaz31:disabled{opacity:0.5;cursor:default}.footer.svelte-1dyaz31{margin:0 12px 14px;font-size:10px;line-height:1.45;opacity:0.55}.helo-tooltip{min-width:190px;font-family:Arial, sans-serif}.tooltip-title{font-weight:700;font-size:13px;letter-spacing:0.6px;margin-bottom:8px}.tooltip-head,.tooltip-wind-row{display:grid;grid-template-columns:65px 1fr;align-items:center}.tooltip-head{font-size:9px;font-weight:700;opacity:0.6;padding-bottom:3px;border-bottom:1px solid rgba(128, 128, 128, 0.25)}.tooltip-wind-row{min-height:27px;font-family:monospace;font-size:12px}.tooltip-wind{display:flex;align-items:center;gap:6px}.tooltip-wind svg{display:block;flex:0 0 auto}.tooltip-no-data{padding-top:6px;font-size:11px;opacity:0.7}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	return child_ctx;
}

// (23:20) 
function create_if_block_3(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*error*/ ctx[2]);
			attr(div, "class", "error svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 4) set_data(t, /*error*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (21:4) {#if loading}
function create_if_block_2(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Loading wind forecast...";
			attr(div, "class", "status svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (48:20) {#if wp.altitudes.length > 0}
function create_if_block(ctx) {
	let div1;
	let div0;
	let t3;
	let t4;
	let if_block_anchor;
	let each_value_2 = ensure_array_like(/*wp*/ ctx[18].wind);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let if_block = /*wp*/ ctx[18].wind.length === 0 && !/*loading*/ ctx[1] && create_if_block_1();

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			div0.innerHTML = `<span>ALT</span> <span>WIND</span>`;
			t3 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "wind-head svelte-1dyaz31");
			attr(div1, "class", "wind-table svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			insert(target, t4, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*routes, pad3, windArrowSvg*/ 1) {
				each_value_2 = ensure_array_like(/*wp*/ ctx[18].wind);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}

			if (/*wp*/ ctx[18].wind.length === 0 && !/*loading*/ ctx[1]) {
				if (if_block) ; else {
					if_block = create_if_block_1();
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
				detach(t4);
				detach(if_block_anchor);
			}

			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d(detaching);
		}
	};
}

// (55:28) {#each wp.wind as w}
function create_each_block_2(ctx) {
	let div;
	let span0;
	let t0_value = /*w*/ ctx[21].altitudeFt + "";
	let t0;
	let t1;
	let t2;
	let span3;
	let html_tag;
	let raw_value = windArrowSvg(/*w*/ ctx[21].directionFrom, 24) + "";
	let t3;
	let span1;
	let t4_value = pad3(/*w*/ ctx[21].directionFrom) + "";
	let t4;
	let t5;
	let t6;
	let span2;
	let t7_value = /*w*/ ctx[21].speedKt.toFixed(0) + "";
	let t7;
	let t8;
	let t9;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = text(" ft");
			t2 = space();
			span3 = element("span");
			html_tag = new HtmlTag(false);
			t3 = space();
			span1 = element("span");
			t4 = text(t4_value);
			t5 = text("°");
			t6 = space();
			span2 = element("span");
			t7 = text(t7_value);
			t8 = text(" kt");
			t9 = space();
			attr(span0, "class", "alt svelte-1dyaz31");
			html_tag.a = t3;
			attr(span1, "class", "wind-dir svelte-1dyaz31");
			attr(span2, "class", "wind-speed svelte-1dyaz31");
			attr(span3, "class", "wind-cell svelte-1dyaz31");
			attr(div, "class", "wind-row svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(span0, t0);
			append(span0, t1);
			append(div, t2);
			append(div, span3);
			html_tag.m(raw_value, span3);
			append(span3, t3);
			append(span3, span1);
			append(span1, t4);
			append(span1, t5);
			append(span3, t6);
			append(span3, span2);
			append(span2, t7);
			append(span2, t8);
			append(div, t9);
		},
		p(ctx, dirty) {
			if (dirty & /*routes*/ 1 && t0_value !== (t0_value = /*w*/ ctx[21].altitudeFt + "")) set_data(t0, t0_value);
			if (dirty & /*routes*/ 1 && raw_value !== (raw_value = windArrowSvg(/*w*/ ctx[21].directionFrom, 24) + "")) html_tag.p(raw_value);
			if (dirty & /*routes*/ 1 && t4_value !== (t4_value = pad3(/*w*/ ctx[21].directionFrom) + "")) set_data(t4, t4_value);
			if (dirty & /*routes*/ 1 && t7_value !== (t7_value = /*w*/ ctx[21].speedKt.toFixed(0) + "")) set_data(t7, t7_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (67:24) {#if wp.wind.length === 0 && !loading}
function create_if_block_1(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Wind data unavailable for this waypoint.";
			attr(div, "class", "no-data svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (39:12) {#each route.waypoints as wp}
function create_each_block_1(ctx) {
	let div2;
	let div1;
	let div0;
	let span0;
	let t0_value = /*wp*/ ctx[18].name + "";
	let t0;
	let t1;
	let span1;
	let t2_value = formatDms(/*wp*/ ctx[18].lat, /*wp*/ ctx[18].lon) + "";
	let t2;
	let t3;
	let if_block = /*wp*/ ctx[18].altitudes.length > 0 && create_if_block(ctx);

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			if (if_block) if_block.c();
			attr(span0, "class", "wp-name svelte-1dyaz31");
			attr(span1, "class", "wp-coords svelte-1dyaz31");
			attr(div1, "class", "waypoint-header svelte-1dyaz31");
			attr(div2, "class", "waypoint-card svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			append(div1, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(div2, t3);
			if (if_block) if_block.m(div2, null);
		},
		p(ctx, dirty) {
			if (dirty & /*routes*/ 1 && t0_value !== (t0_value = /*wp*/ ctx[18].name + "")) set_data(t0, t0_value);
			if (dirty & /*routes*/ 1 && t2_value !== (t2_value = formatDms(/*wp*/ ctx[18].lat, /*wp*/ ctx[18].lon) + "")) set_data(t2, t2_value);

			if (/*wp*/ ctx[18].altitudes.length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div2, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if (if_block) if_block.d();
		}
	};
}

// (27:4) {#each routes as route}
function create_each_block(ctx) {
	let div2;
	let div0;
	let span0;
	let t0_value = /*route*/ ctx[15].name + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*route*/ ctx[15].distanceNm.toFixed(1) + "";
	let t2;
	let t3;
	let t4;
	let div1;
	let span2;
	let t5;
	let t6_value = /*route*/ ctx[15].bearingDeg.toFixed(0) + "";
	let t6;
	let t7;
	let t8;
	let span3;
	let t9_value = /*route*/ ctx[15].waypoints.length + "";
	let t9;
	let t10;
	let t11;
	let each_value_1 = ensure_array_like(/*route*/ ctx[15].waypoints);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = text(" NM");
			t4 = space();
			div1 = element("div");
			span2 = element("span");
			t5 = text("BRG ");
			t6 = text(t6_value);
			t7 = text("°");
			t8 = space();
			span3 = element("span");
			t9 = text(t9_value);
			t10 = text(" waypoints");
			t11 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span0, "class", "route-name svelte-1dyaz31");
			attr(span1, "class", "route-distance svelte-1dyaz31");
			attr(div0, "class", "route-header svelte-1dyaz31");
			attr(div1, "class", "route-meta svelte-1dyaz31");
			attr(div2, "class", "route-card svelte-1dyaz31");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(span1, t3);
			append(div2, t4);
			append(div2, div1);
			append(div1, span2);
			append(span2, t5);
			append(span2, t6);
			append(span2, t7);
			append(div1, t8);
			append(div1, span3);
			append(span3, t9);
			append(span3, t10);
			append(div2, t11);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*routes*/ 1 && t0_value !== (t0_value = /*route*/ ctx[15].name + "")) set_data(t0, t0_value);
			if (dirty & /*routes*/ 1 && t2_value !== (t2_value = /*route*/ ctx[15].distanceNm.toFixed(1) + "")) set_data(t2, t2_value);
			if (dirty & /*routes*/ 1 && t6_value !== (t6_value = /*route*/ ctx[15].bearingDeg.toFixed(0) + "")) set_data(t6, t6_value);
			if (dirty & /*routes*/ 1 && t9_value !== (t9_value = /*route*/ ctx[15].waypoints.length + "")) set_data(t9, t9_value);

			if (dirty & /*routes, loading, pad3, windArrowSvg, formatDms*/ 3) {
				each_value_1 = ensure_array_like(/*route*/ ctx[15].waypoints);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let t3;
	let div4;
	let t9;
	let t10;
	let t11;
	let div5;
	let button0;
	let t12_value = (/*loading*/ ctx[1] ? 'LOADING...' : '↻ UPDATE FORECAST') + "";
	let t12;
	let t13;
	let button1;
	let t15;
	let div6;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*loading*/ ctx[1]) return create_if_block_2;
		if (/*error*/ ctx[2]) return create_if_block_3;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);
	let each_value = ensure_array_like(/*routes*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[3]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[3]}`;
			t3 = space();
			div4 = element("div");

			div4.innerHTML = `<div class="intro-title svelte-1dyaz31">HELO ROUTE PLANNER</div> <div class="intro-text svelte-1dyaz31">Wind forecast at HP2, using ECMWF. Wind direction is shown as
            <strong>FROM</strong> direction.</div>`;

			t9 = space();
			if (if_block) if_block.c();
			t10 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t11 = space();
			div5 = element("div");
			button0 = element("button");
			t12 = text(t12_value);
			t13 = space();
			button1 = element("button");
			button1.textContent = "CLEAR BOX";
			t15 = space();
			div6 = element("div");
			div6.textContent = "Wind source: Open-Meteo (ECMWF IFS 0.25°). Wind at each altitude is\n        interpolated from the 1000, 925, 850 and 700 hPa levels using their\n        geopotential heights.";
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
			attr(div4, "class", "intro svelte-1dyaz31");
			attr(button0, "class", "action-button svelte-1dyaz31");
			button0.disabled = /*loading*/ ctx[1];
			attr(button1, "class", "clear-button svelte-1dyaz31");
			attr(div5, "class", "controls svelte-1dyaz31");
			attr(div6, "class", "footer svelte-1dyaz31");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(section, t3);
			append(section, div4);
			append(section, t9);
			if (if_block) if_block.m(section, null);
			append(section, t10);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(section, null);
				}
			}

			append(section, t11);
			append(section, div5);
			append(div5, button0);
			append(button0, t12);
			append(div5, t13);
			append(div5, button1);
			append(section, t15);
			append(section, div6);

			if (!mounted) {
				dispose = [
					listen(div1, "click", /*click_handler*/ ctx[7]),
					listen(button0, "click", /*reloadForecast*/ ctx[5]),
					listen(button1, "click", /*clearMap*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(section, t10);
				}
			}

			if (dirty & /*routes, loading, pad3, windArrowSvg, formatDms*/ 3) {
				each_value = ensure_array_like(/*routes*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(section, t11);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*loading*/ 2 && t12_value !== (t12_value = (/*loading*/ ctx[1] ? 'LOADING...' : '↻ UPDATE FORECAST') + "")) set_data(t12, t12_value);

			if (dirty & /*loading*/ 2) {
				button0.disabled = /*loading*/ ctx[1];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if (if_block) {
				if_block.d();
			}

			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

const OVERLAY_TOP = 70;
const OVERLAY_LEFT = 10;
const OVERLAY_OPACITY = 0.75;
const OVERLAY_TITLE = 'VENTO EM ROTA';

function pad3(value) {
	return Math.round(value).toString().padStart(3, '0');
}

function formatDms(lat, lon) {
	const latText = decimalToDms(lat, true);
	const lonText = decimalToDms(lon, false);
	return `${latText}  ${lonText}`;
}

function decimalToDms(value, latitude) {
	const abs = Math.abs(value);
	const degrees = Math.floor(abs);
	const minutesDecimal = (abs - degrees) * 60;
	const minutes = Math.floor(minutesDecimal);
	const seconds = (minutesDecimal - minutes) * 60;

	const hemi = latitude
	? value >= 0 ? 'N' : 'S'
	: value >= 0 ? 'E' : 'W';

	return `${degrees.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'${seconds.toFixed(1).padStart(4, '0')}"${hemi}`;
}

function windArrowSvg(directionFrom, size = 24) {
	const toDirection = (directionFrom + 180) % 360;

	return `
            <svg
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                class="wind-arrow"
                aria-label="Wind from ${pad3(directionFrom)} degrees"
            >
                <g transform="rotate(${toDirection} 12 12)">
                    <line x1="12" y1="20" x2="12" y2="5"
                        stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round"/>
                    <path d="M7 10 L12 4 L17 10"
                        fill="none" stroke="currentColor"
                        stroke-width="2.2" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </g>
            </svg>
        `;
}

function haversineNm(a, b) {
	const R = 3440.065;
	const lat1 = a.lat * Math.PI / 180;
	const lat2 = b.lat * Math.PI / 180;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLon = (b.lon - a.lon) * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

function bearingDeg(a, b) {
	const lat1 = a.lat * Math.PI / 180;
	const lat2 = b.lat * Math.PI / 180;
	const dLon = (b.lon - a.lon) * Math.PI / 180;
	const y = Math.sin(dLon) * Math.cos(lat2);
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
	return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function boxHtml(wp) {
	const rows = wp.wind.map(w => `
            <div class="tooltip-wind-row">
                <span class="tooltip-alt">${w.altitudeFt} ft</span>
                <span class="tooltip-wind">
                    ${windArrowSvg(w.directionFrom, 22)}
                    <strong>${pad3(w.directionFrom)}°</strong>
                    <span>${w.speedKt.toFixed(0)} kt</span>
                </span>
            </div>
        `).join('');

	return `
            <div class="helo-tooltip">
                <div class="tooltip-title">${OVERLAY_TITLE}</div>
                <div class="tooltip-head">
                    <span>ALT</span><span>WIND</span>
                </div>
                ${rows || '<div class="tooltip-no-data">Wind data unavailable</div>'}
            </div>
        `;
}

function instance($$self, $$props, $$invalidate) {
	const { title } = config;

	let routes = [
		{
			name: 'HELO1',
			waypoints: [
				{
					name: 'HP1',
					lat: 6.966667,
					lon: -58.083333,
					altitudes: [],
					wind: [],
					showMarker: false,
					showInOverlay: false
				},
				{
					name: 'HP2',
					lat: 7.466667,
					lon: -57.45,
					altitudes: [2000, 3000, 4000, 5000, 6000, 7000],
					wind: [],
					showMarker: true,
					showInOverlay: true
				}
			],
			distanceNm: 0,
			bearingDeg: 0
		},
		{
			name: 'HELO2',
			waypoints: [
				{
					name: 'HP3',
					lat: 7.283333,
					lon: -57.266667,
					altitudes: [],
					wind: [],
					showMarker: true,
					showInOverlay: false
				},
				{
					name: 'HP4',
					lat: 6.783333,
					lon: -57.916667,
					altitudes: [],
					wind: [],
					showMarker: false,
					showInOverlay: false
				}
			],
			distanceNm: 0,
			bearingDeg: 0
		}
	];

	let loading = false;
	let error = '';

	function calculateRouteGeometry() {
		for (const route of routes) {
			route.distanceNm = haversineNm(route.waypoints[0], route.waypoints[1]);
			route.bearingDeg = bearingDeg(route.waypoints[0], route.waypoints[1]);
		}

		$$invalidate(0, routes);
	}

	async function loadWaypointWind(wp) {
		if (wp.altitudes.length === 0) {
			wp.wind = [];
			return;
		}

		const levels = [1000, 925, 850, 700];

		const vars = levels.flatMap(l => [
			`wind_speed_${l}hPa`,
			`wind_direction_${l}hPa`,
			`geopotential_height_${l}hPa`
		]).join(',');

		const url = `https://api.open-meteo.com/v1/forecast?latitude=${wp.lat}&longitude=${wp.lon}` + `&hourly=${vars}&models=ecmwf_ifs025&wind_speed_unit=kn` + `&forecast_days=2&timezone=UTC`;
		const res = await fetch(url);
		if (!res.ok) throw new Error('Open-Meteo HTTP ' + res.status);
		const json = await res.json();
		const h = json.hourly;
		const now = Date.now();
		let idx = 0;
		let best = Infinity;

		h.time.forEach((t, i) => {
			const diff = Math.abs(Date.parse(t + 'Z') - now);

			if (diff < best) {
				best = diff;
				idx = i;
			}
		});

		const profile = [];

		for (const l of levels) {
			const spd = h[`wind_speed_${l}hPa`]?.[idx];
			const dir = h[`wind_direction_${l}hPa`]?.[idx];
			const z = h[`geopotential_height_${l}hPa`]?.[idx];
			if (spd == null || dir == null || z == null) continue;
			const rad = dir * Math.PI / 180;

			profile.push({
				z,
				u: -spd * Math.sin(rad),
				v: -spd * Math.cos(rad)
			});
		}

		profile.sort((a, b) => a.z - b.z);
		const result = [];

		for (const altFt of wp.altitudes) {
			const zt = altFt * 0.3048;

			for (let i = 0; i < profile.length - 1; i++) {
				const a = profile[i];
				const b = profile[i + 1];

				if (zt >= a.z && zt <= b.z) {
					const f = (zt - a.z) / (b.z - a.z);
					const u = a.u + f * (b.u - a.u);
					const v = a.v + f * (b.v - a.v);
					const speedKt = Math.sqrt(u * u + v * v);
					const directionFrom = (Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360;

					result.push({
						altitudeFt: altFt,
						directionFrom,
						speedKt
					});

					break;
				}
			}
		}

		wp.wind = result;
		$$invalidate(0, routes);
	}

	function removeOverlay() {
		document.getElementById('helo-wind-overlay')?.remove();
	}

	function updateOverlay() {
		removeOverlay();
		const el = document.createElement('div');
		el.id = 'helo-wind-overlay';

		el.style.cssText = `
            position: fixed;
            top: ${OVERLAY_TOP}px;
            left: ${OVERLAY_LEFT}px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
        `;

		for (const route of routes) {
			for (const wp of route.waypoints) {
				if (!wp.showInOverlay) continue;
				const box = document.createElement('div');

				box.style.cssText = `
                    background: rgba(255, 255, 255, ${OVERLAY_OPACITY});
                    color: #111;
                    border-radius: 8px;
                    padding: 8px 10px;
                    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
                `;

				box.innerHTML = boxHtml(wp);
				el.appendChild(box);
			}
		}

		document.body.appendChild(el);
	}

	function removeMapElements() {
		for (const route of routes) {
			if (route.line) {
				map.removeLayer(route.line);
				route.line = undefined;
			}

			for (const wp of route.waypoints) {
				if (wp.marker) {
					map.removeLayer(wp.marker);
					wp.marker = undefined;
				}
			}
		}
	}

	function drawMap() {
		clearMap();

		updateOverlay();
	}

	function clearMap() {
		removeMapElements();
		removeOverlay();
	}

	async function reloadForecast() {
		$$invalidate(1, loading = true);
		$$invalidate(2, error = '');

		try {
			for (const route of routes) {
				for (const wp of route.waypoints) {
					await loadWaypointWind(wp);
				}
			}

			calculateRouteGeometry();
			drawMap();
		} catch(e) {
			console.error('[HELO Routes] Forecast error:', e);
			$$invalidate(2, error = 'Could not load the wind forecast. Check the browser console for details.');
			calculateRouteGeometry();
			drawMap();
		} finally {
			$$invalidate(1, loading = false);
		}
	}

	const onopen = () => {
		calculateRouteGeometry();
		drawMap();
		reloadForecast();
	};

	onMount(() => {
		calculateRouteGeometry();
		drawMap();
	});

	onDestroy(() => {
		removeMapElements();
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	return [routes, loading, error, title, clearMap, reloadForecast, onopen, click_handler];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 6 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[6];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
