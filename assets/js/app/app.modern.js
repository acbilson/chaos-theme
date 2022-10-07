function t(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var l=t.length-1;l>=0;l--)(n=t[l])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o}const e=window,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},l=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const h=window,u=h.trustedTypes,d=u?u.emptyScript:"",c=h.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:v};class $ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;null!==(e=this.h)&&void 0!==e||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))}),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const n=this[t];this[e]=i,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{s?t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):i.forEach(s=>{const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)})})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=_){var i;const n=this.constructor._$Ep(t,s);if(void 0!==n&&!0===s.reflect){const r=(void 0!==(null===(i=s.converter)||void 0===i?void 0:i.toAttribute)?s.converter:p).toAttribute(e,s.type);this._$El=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$El=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=i.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:p;this._$El=n,this[n]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var f;$.finalized=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:$}),(null!==(a=h.reactiveElementVersions)&&void 0!==a?a:h.reactiveElementVersions=[]).push("1.4.1");const y=window,g=y.trustedTypes,m=g?g.createPolicy("lit-html",{createHTML:t=>t}):void 0,A=`lit$${(Math.random()+"").slice(9)}$`,b="?"+A,S=`<${b}>`,w=document,E=(t="")=>w.createComment(t),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,k=/-->/g,O=/>/g,x=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),U=/'/g,N=/"/g,H=/^(?:script|style|textarea|title)$/i,R=(t,...e)=>({_$litType$:1,strings:t,values:e}),M=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),I=new WeakMap,L=w.createTreeWalker(w,129,null,!1),D=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":"",o=T;for(let e=0;e<s;e++){const s=t[e];let l,a,h=-1,u=0;for(;u<s.length&&(o.lastIndex=u,a=o.exec(s),null!==a);)u=o.lastIndex,o===T?"!--"===a[1]?o=k:void 0!==a[1]?o=O:void 0!==a[2]?(H.test(a[2])&&(n=RegExp("</"+a[2],"g")),o=x):void 0!==a[3]&&(o=x):o===x?">"===a[0]?(o=null!=n?n:T,h=-1):void 0===a[1]?h=-2:(h=o.lastIndex-a[2].length,l=a[1],o=void 0===a[3]?x:'"'===a[3]?N:U):o===N||o===U?o=x:o===k||o===O?o=T:(o=x,n=void 0);const d=o===x&&t[e+1].startsWith("/>")?" ":"";r+=o===T?s+S:h>=0?(i.push(l),s.slice(0,h)+"$lit$"+s.slice(h)+A+d):s+A+(-2===h?(i.push(void 0),e):d)}const l=r+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==m?m.createHTML(l):l,i]};class j{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,l=this.parts,[a,h]=D(t,e);if(this.el=j.createElement(a,s),L.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=L.nextNode())&&l.length<o;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(A)){const s=h[r++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+"$lit$").split(A),e=/([.?@])?(.*)/.exec(s);l.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?W:"?"===e[1]?J:"@"===e[1]?K:G})}else l.push({type:6,index:n})}for(const e of t)i.removeAttribute(e)}if(H.test(i.tagName)){const t=i.textContent.split(A),e=t.length-1;if(e>0){i.textContent=g?g.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],E()),L.nextNode(),l.push({type:2,index:++n});i.append(t[e],E())}}}else if(8===i.nodeType)if(i.data===b)l.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(A,t+1));)l.push({type:7,index:n}),t+=A.length-1}n++}}static createElement(t,e){const s=w.createElement("template");return s.innerHTML=t,s}}function q(t,e,s=t,i){var n,r,o,l;if(e===M)return e;let a=void 0!==i?null===(n=s._$Cl)||void 0===n?void 0:n[i]:s._$Cu;const h=C(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==h&&(null===(r=null==a?void 0:a._$AO)||void 0===r||r.call(a,!1),void 0===h?a=void 0:(a=new h(t),a._$AT(t,s,i)),void 0!==i?(null!==(o=(l=s)._$Cl)&&void 0!==o?o:l._$Cl=[])[i]=a:s._$Cu=a),void 0!==a&&(e=q(t,a._$AS(t,e.values),a,i)),e}class B{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:s},parts:i}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:w).importNode(s,!0);L.currentNode=n;let r=L.nextNode(),o=0,l=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new F(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new Z(r,this,t)),this.v.push(e),a=i[++l]}o!==(null==a?void 0:a.index)&&(r=L.nextNode(),o++)}return n}m(t){let e=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class F{constructor(t,e,s,i){var n;this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$C_=null===(n=null==i?void 0:i.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$C_}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),C(t)?t===z||null==t||""===t?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==M&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):(t=>P(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.O(t):this.$(t)}S(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}$(t){this._$AH!==z&&C(this._$AH)?this._$AA.nextSibling.data=t:this.k(w.createTextNode(t)),this._$AH=t}T(t){var e;const{values:s,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=j.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.m(s);else{const t=new B(n,this),e=t.p(this.options);t.m(s),this.k(e),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new j(t)),e}O(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new F(this.S(E()),this.S(E()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$C_=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class G{constructor(t,e,s,i,n){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=z}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=q(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==M,r&&(this._$AH=t);else{const i=t;let o,l;for(t=n[0],o=0;o<n.length-1;o++)l=q(this,i[s+o],e,o),l===M&&(l=this._$AH[o]),r||(r=!C(l)||l!==this._$AH[o]),l===z?t=z:t!==z&&(t+=(null!=l?l:"")+n[o+1]),this._$AH[o]=l}r&&!i&&this.P(t)}P(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class W extends G{constructor(){super(...arguments),this.type=3}P(t){this.element[this.name]=t===z?void 0:t}}const V=g?g.emptyScript:"";class J extends G{constructor(){super(...arguments),this.type=4}P(t){t&&t!==z?this.element.setAttribute(this.name,V):this.element.removeAttribute(this.name)}}class K extends G{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=q(this,t,e,0))&&void 0!==s?s:z)===M)return;const i=this._$AH,n=t===z&&i!==z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==z&&(i===z||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const Q=y.litHtmlPolyfillSupport;var X,Y;null==Q||Q(j,F),(null!==(f=y.litHtmlVersions)&&void 0!==f?f:y.litHtmlVersions=[]).push("2.3.1");class tt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,n;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let o=r._$litPart$;if(void 0===o){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;r._$litPart$=o=new F(e.insertBefore(E(),t),t,void 0,null!=s?s:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return M}}tt.finalized=!0,tt._$litElement$=!0,null===(X=globalThis.litElementHydrateSupport)||void 0===X||X.call(globalThis,{LitElement:tt});const et=globalThis.litElementPolyfillSupport;null==et||et({LitElement:tt}),(null!==(Y=globalThis.litElementVersions)&&void 0!==Y?Y:globalThis.litElementVersions=[]).push("3.2.2");const st=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:s,elements:i}=e;return{kind:s,elements:i,finisher(e){customElements.define(t,e)}}})(t,e),it=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(s){s.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(s){s.createProperty(e.key,t)}};function nt(t){return(e,s)=>void 0!==s?((t,e,s)=>{e.constructor.createProperty(s,t)})(t,e,s):it(t,e)}function rt(t){return nt({...t,state:!0})}class ot{static _getUrlFromHead(t){const e=Array.from(document.head.children).find(e=>e.rel===t);return null==e?void 0:e.href}static get publish(){return this._getUrlFromHead("publish")}static get auth(){return this._getUrlFromHead("authentication")}}function lt(t){if(null==t||null==ot.auth)return new Promise(()=>!1);const e=new Headers;return e.append("Authorization",`Bearer ${t}`),fetch(new URL("auth",ot.auth),{headers:e}).then(e=>(200===e.status?sessionStorage.setItem("token",t):sessionStorage.removeItem("token"),200===e.status),t=>!1)}class at{constructor(){this._subscribers=new Map,this._value=void 0}get value(){return this._value}set value(t){this._value=t,this.notify()}subscribe(t,e){const s=`${t}-${Math.random()}`;return this._subscribers.set(s,e),s}unsubscribe(t){delete this._subscribers[t]}notify(){this._subscribers.forEach((t,e)=>t(this._value))}}var ht=new class{get token(){return sessionStorage.getItem("token")}constructor(){this.isAuthorized$=new at,lt(this.token).then(t=>this.isAuthorized$.value=t)}};class ut{get isAuthorized(){return this._isAuthorized}get token(){return ht.token}authenticate(t,e){return function(t,e){if(null==t||null==e||null==ot.auth)return new Promise(()=>!1);const s=new Headers;return s.append("Authorization",`Basic ${btoa(t+":"+e)}`),fetch(new URL("token",ot.auth),{headers:s}).then(t=>200===t.status?t.json():null).then(t=>null!==t&&lt(null==t?void 0:t.token))}(t,e).then(t=>(ht.isAuthorized$.value=t,""),t=>"there was a login error")}unauthenticate(){sessionStorage.removeItem("token"),ht.isAuthorized$.value=!1}constructor(t,e){this._host=void 0,this._hostName=void 0,this._subscription=void 0,this._isAuthorized=void 0,(this._host=t).addController(this),this._hostName=e}hostConnected(){this._subscription=ht.isAuthorized$.subscribe(this._hostName,t=>{this._isAuthorized=t,this._host.requestUpdate()})}hostDisconnected(){ht.isAuthorized$.unsubscribe(this._subscription)}}let dt,ct=t=>t,pt=class extends tt{constructor(...t){super(...t),this._auth=new ut(this,"auth-login"),this.msg=""}get _username(){var t,e,s;return null!=(t=null==(e=this.renderRoot)||null==(s=e.querySelector("#username"))?void 0:s.value)?t:null}get _password(){var t,e,s;return null!=(t=null==(e=this.renderRoot)||null==(s=e.querySelector("#password"))?void 0:s.value)?t:null}_authenticate(){this._auth.authenticate(this._username,this._password).then(t=>this.msg)}render(){return R(dt||(dt=ct`
			<label for="username">Username:</label>
			<input id="username" name="username" autocomplete="username" type="text" />
			<label for="password">Password:</label>
			<input id="password" name="password" autocomplete="password" type="password" />
			<button @click="${0}">Login</button>
			<label>${0}</label>
		`),this._authenticate,this.msg)}};t([rt()],pt.prototype,"msg",void 0),pt=t([st("auth-login")],pt);let vt,_t,$t=t=>t,ft=class extends tt{constructor(...t){super(...t),this._auth=new ut(this,"auth-logout")}_logout(){this._auth.unauthenticate()}render(){return this._auth.isAuthorized?R(vt||(vt=$t` <button @click="${0}">Logout</button> `),this._logout):R(_t||(_t=$t`<span hidden></span>`))}};ft=t([st("auth-logout")],ft);const yt=t=>(...e)=>({_$litDirective$:t,values:e});class gt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const mt=yt(class extends gt{constructor(t){var e;if(super(t),1!==t.type||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var s,i;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!(null===(s=this.st)||void 0===s?void 0:s.has(t))&&this.nt.add(t);return this.render(e)}const n=t.element.classList;this.nt.forEach(t=>{t in e||(n.remove(t),this.nt.delete(t))});for(const t in e){const s=!!e[t];s===this.nt.has(t)||(null===(i=this.st)||void 0===i?void 0:i.has(t))||(s?(n.add(t),this.nt.add(t)):(n.remove(t),this.nt.delete(t)))}return M}}),At=yt(class extends gt{constructor(t){var e;if(super(t),1!==t.type||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,s)=>{const i=t[s];return null==i?e:e+`${s=s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.vt){this.vt=new Set;for(const t in e)this.vt.add(t);return this.render(e)}this.vt.forEach(t=>{null==e[t]&&(this.vt.delete(t),t.includes("-")?s.removeProperty(t):s[t]="")});for(const t in e){const i=e[t];null!=i&&(this.vt.add(t),t.includes("-")?s.setProperty(t,i):s[t]=i)}return M}});var bt,St,wt;!function(t){t.CREATING="Create",t.EDITING="Edit"}(bt||(bt={})),function(t){t.TEXT="text",t.LIST="list"}(St||(St={})),function(t){t.PLANT="plant",t.QUIP="quip",t.LOG="log",t.STONE="stone"}(wt||(wt={}));class Et{read(t,e){null==t&&new Promise(()=>null);const s=new Headers;return s.append("Authorization",`Bearer ${t}`),fetch(new URL(`file?path=${e}`,ot.publish),{headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}update(t,e){null==t&&new Promise(()=>({success:!1,message:"no token retrieved for update"}));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),s.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",ot.publish),{method:"PUT",body:JSON.stringify(e),headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}create(t,e){null==t&&new Promise(()=>({success:!1,message:"no token retrieved for update"}));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),s.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",ot.publish),{method:"POST",body:JSON.stringify(e),headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}constructor(t){this._host=void 0,(this._host=t).addController(this)}hostConnected(){}hostDisconnected(){}}let Ct,Pt,Tt,kt,Ot,xt,Ut,Nt=t=>t,Ht=(Ct=class extends tt{constructor(...t){super(...t),this._auth=new ut(this,"app-panel"),this._pub=new Et(this),this._typesWithOptions=[wt.PLANT,wt.STONE],this.panelType=wt.PLANT,this.editContents=void 0,this.canSave=!1,this.status=bt.CREATING,this.message=void 0}get _panelOptions(){const t=this.renderRoot.querySelector("slot"),e=null==t?void 0:t.assignedElements({flatten:!0}),s=Array.from(e).find(t=>"options"===t.slot);return s?Array.from(s.querySelectorAll("app-panel-option")):[]}get _frontmatter(){return 0===this._panelOptions.length?{}:this._panelOptions.reduce((t,e)=>{const s=e.getModel();return null!=s&&s.key&&null!=s&&s.value&&(t[s.key]=s.value),t},{})}get _content(){var t,e;const s=null==(t=this.renderRoot)?void 0:t.querySelector("#content");return null!=(e=null==s?void 0:s.value)?e:null}get _filePath(){return document.location.pathname}get _shouldHaveOptions(){return this._typesWithOptions.includes(this.panelType)}updatePanelOptions(t,e){if(!this._shouldHaveOptions)return;const s=this._panelOptions,i=s.find(t=>"path"===t.key);i&&(i.value=t,i.readonly=!0),Object.keys(e).forEach(t=>{const i=s.find(e=>e.key===t);i&&(i.value=e[t])})}clearPanelOptions(){this._shouldHaveOptions&&this._panelOptions.forEach(t=>t.value=null)}startUpdate(){this._pub.read(this._auth.token,this._filePath).then(t=>{t.success?(this.editContents=t.content.body,this.updatePanelOptions(t.content.path,t.content.frontmatter),this.status=bt.EDITING):this.message=t.message})}startCreate(){this.editContents="",this.clearPanelOptions(),this.status=bt.CREATING}updateFile(){const t=this._frontmatter;"path"in t?delete t.path:this._getFilePath(),t.lastmod=(new Date).toISOString(),this._pub.update(this._auth.token,{path:this._filePath,body:this._content,frontmatter:t}).then(t=>{t.success?(this.editContents=t.content.body,this.message="success"):this.message=t.message},t=>this.message=t.toString())}_getFilePathByDate(){const t=t=>t<10?`0${t}`:t.toString(),e=new Date,s=e.getFullYear().toString(),i=t(e.getMonth()+1),n=e.getDate(),r=t(e.getHours()),o=t(e.getMinutes()),l=t(e.getSeconds());return this.panelType===wt.LOG?`/logs/${s}/${i}/${s}${i}${n}-${r}${o}${l}`:`/quips/${s}${i}${n}-${r}${o}${l}`}_getSimpleDate(t){const e=t.getFullYear(),s=(t=>t<10?`0${t}`:t.toString())(t.getMonth()+1);return[e,s,t.getDate()].join("-")}_getFilePath(){switch(this.panelType){case wt.PLANT:case wt.STONE:default:return this._filePath;case wt.QUIP:case wt.LOG:return this._getFilePathByDate()}}createFile(){const t=this._frontmatter;let e;"path"in t?(e=t.path,delete t.path):e=this._getFilePath();const s=new Date;t.date=this._getSimpleDate(s),t.lastmod=s.toISOString(),this._pub.create(this._auth.token,{body:this._content,frontmatter:t,path:e}).then(t=>{t.success?(this.editContents=t.content.body,this.updatePanelOptions(t.content.path,t.content.frontmatter),this.message="success"):this.message=t.message},t=>this.message=t.toString())}saveFile(){const t=this._panelOptions.map(t=>t.getModel()),e=t.filter(t=>t.required).some(t=>!t.value);if(this._shouldHaveOptions&&e)return this.message="Not all required fields have values",void console.log({options:t});switch(this.status){case bt.CREATING:this.createFile();break;case bt.EDITING:this.updateFile();break;default:this.message=`Not saving, status was ${this.status}`}}setStatus(t){const e=bt[t.target.id];switch(e){case bt.CREATING:default:this.startCreate();break;case bt.EDITING:this.startUpdate()}this.status=e}editing(t){this.canSave=t.target.value.length>0}renderPanelType(){const t=Object.keys(bt).map(t=>R(Pt||(Pt=Nt`<li
				class="${0}"
			>
				<button id="${0}">${0}</button>
			</li>`),mt({selected:this.status==bt[t]}),t,bt[t]));return R(Tt||(Tt=Nt`<ul @click="${0}" class="panel-types">
			${0}
		</ul>`),this.setStatus,t)}renderEditor(){return R(kt||(kt=Nt`<textarea
			@keyup="${0}"
			id="content"
			class="edit-content"
		>
${0}</textarea
		>`),this.editing,this.editContents)}render(){return this._auth.isAuthorized?R(xt||(xt=Nt`
			<details>
				<summary>Admin Panel - ${0}</summary>
				${0}
				<slot name="options"></slot>
				<p
					?hidden="${0}"
					style="${0}"
				>
					${0}
				</p>
				${0}
				<button @click="${0}" ?disabled="${0}">
					Save
				</button>
			</details>
		`),this.panelType,this.renderPanelType(),!this.message,At({color:"success"===this.message?"green":"red"}),this.message,this.renderEditor(),this.saveFile,!this.canSave):R(Ot||(Ot=Nt`<span hidden>Not authorized to view panel</span>`))}},Ct.styles=[o(Ut||(Ut=Nt`
			.panel-types {
				list-style: none;
				display: flex;
				flex-flow: row nowrap;
			}
			.selected {
				background-color: blue;
			}
			.edit-content {
				width: 100%;
				height: -webkit-fill-available;
			}
		`))],Ct);t([nt({attribute:"panel-type"})],Ht.prototype,"panelType",void 0),t([rt()],Ht.prototype,"editContents",void 0),t([rt()],Ht.prototype,"canSave",void 0),t([rt()],Ht.prototype,"status",void 0),t([rt()],Ht.prototype,"message",void 0),Ht=t([st("app-panel")],Ht);let Rt,Mt,zt,It,Lt,Dt=t=>t,jt=(Rt=class extends tt{constructor(...t){super(...t),this.key=void 0,this.label=void 0,this.value=void 0,this.required=void 0,this.type=void 0,this.readonly=void 0}get _inputType(){return"text"}get _value(){var t,e;const s=null==(t=this.renderRoot)?void 0:t.querySelector("input");return null!=(e=null==s?void 0:s.value)?e:null}valueByType(){switch(this.type){case St.TEXT:default:return this._value;case St.LIST:return this._value.includes(",")?this._value.replaceAll(" ","").split(","):[this._value.trim()]}}getModel(){return{key:this.key,name:this.label,value:this.valueByType(),required:this.required,type:this.type}}render(){return R(Mt||(Mt=Dt`
			<div class="panel-option">
				<label class="panel-label" for="${0}">${0}</label>
				<input
					class="panel-input"
					name="${0}"
					type="${0}"
					value="${0}"
					?disabled="${0}"
				/>
				${0}
			</div>
		`),this.label,this.label,this.label,this._inputType,this.value,this.readonly,R(this.required?zt||(zt=Dt`<span class="required">(required)</span>`):It||(It=Dt`<span></span>`)))}},Rt.styles=[o(Lt||(Lt=Dt`
			.panel-option {
				width: 50%;
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
			}
			.panel-label {
				white-space: nowrap;
				margin-right: 12px;
			}
			.panel-input {
				width: 100%;
			}
			.required {
				color: red;
				margin-left: 12px;
			}
		`))],Rt);t([nt()],jt.prototype,"key",void 0),t([nt()],jt.prototype,"label",void 0),t([nt()],jt.prototype,"value",void 0),t([nt()],jt.prototype,"required",void 0),t([nt()],jt.prototype,"type",void 0),t([nt()],jt.prototype,"readonly",void 0),jt=t([st("app-panel-option")],jt);export{pt as AuthLogin,ft as AuthLogout,Ht as Panel,jt as PanelOption};
//# sourceMappingURL=index.modern.js.map
