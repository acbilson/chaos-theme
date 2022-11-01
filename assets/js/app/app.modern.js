class t{static _getUrlFromHead(t){const e=Array.from(document.head.children).find(e=>e.rel===t);return null==e?void 0:e.href}static get publish(){return this._getUrlFromHead("publish")}static get auth(){return this._getUrlFromHead("authentication")}}function e(e){if(null==e||null==t.auth)return new Promise(()=>!1);const s=new Headers;return s.append("Authorization",`Bearer ${e}`),fetch(new URL("auth",t.auth),{headers:s}).then(t=>(200===t.status?sessionStorage.setItem("token",e):sessionStorage.removeItem("token"),200===t.status),t=>!1)}class s{constructor(){this._subscribers=new Map}subscribe(t,e){const s=`${t}-${Math.random()}`;return this._subscribers.set(s,e),s}unsubscribe(t){delete this._subscribers[t]}notify(){this._subscribers.forEach((t,e)=>t())}}class i extends s{get value(){return this._value}set value(t){this._value=t,this.notify()}notify(){this._subscribers.forEach((t,e)=>t(this._value))}constructor(){super(),this._value=void 0}}var n=new class{get token(){return sessionStorage.getItem("token")}constructor(){this.isAuthorized$=new i,this.onFieldFilter$=new s,e(this.token).then(t=>this.isAuthorized$.value=t)}},r=new class{constructor(){this._subscription=void 0}get token(){return n.token}authenticate(s,i){return function(s,i){if(null==s||null==i||null==t.auth)return new Promise(()=>!1);const n=new Headers;return n.append("Authorization",`Basic ${btoa(s+":"+i)}`),fetch(new URL("token",t.auth),{headers:n}).then(t=>200===t.status?t.json():null).then(t=>null!==t&&e(null==t?void 0:t.token))}(s,i).then(t=>(n.isAuthorized$.value=t,""),t=>"there was a login error")}unauthenticate(){sessionStorage.removeItem("token"),console.log({token:sessionStorage.getItem("token")}),n.isAuthorized$.value=!1}};class o extends HTMLElement{get username(){return this.querySelector("#username")}get password(){return this.querySelector("#password")}get errors(){return this.querySelector("#errors")}onClick(t){var e,s;t.preventDefault(),t.stopPropagation(),r.authenticate(null==(e=this.username)?void 0:e.value,null==(s=this.password)?void 0:s.value).then(t=>this.errors.innerText=t)}render(){this.innerHTML='\n\t\t\t<label for="username">Username:</label>\n\t\t\t<input\n\t\t\t\tid="username"\n\t\t\t\tname="username"\n\t\t\t\tautocomplete="username"\n\t\t\t\ttype="text"\n\t\t\t/>\n\t\t\t<label for="password">Password:</label>\n\t\t\t<input\n\t\t\t\tid="password"\n\t\t\t\tname="password"\n\t\t\t\tautocomplete="password"\n\t\t\t\ttype="password"\n\t\t\t/>\n\t\t\t<button type="button">Login</button>\n\t\t\t<chaos-logout><p>No logout</p></chaos-logout>\n\t\t\t<label id="errors"></label>\n\t\t\t'}constructor(){super()}connectedCallback(){this.render(),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class l extends HTMLElement{onClick(t){t.preventDefault(),t.stopPropagation(),r.unauthenticate()}constructor(){super(),this._subscription=void 0,this.innerHTML='<button type="button" class="fill">Logout</button>'}connectedCallback(){this._subscription=n.isAuthorized$.subscribe("chaos-logout",t=>{this.innerHTML=t?'<button type="button" class="fill">Logout</button>':'<button type="button" class="fill" hidden>Logout</button>'}),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){n.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("click",t=>this.onClick(t),!1)}}class a extends HTMLElement{get formElement(){return this.querySelector("[slot='chaos-filter-form']")}get selectors(){return Array.from(this.formElement.querySelectorAll("select"))}get filters(){return this.selectors.map(t=>{var e;return{key:t.dataset.match,value:t.options[t.selectedIndex].value,comparator:null!=(e=t.dataset.comparator)?e:"eq"}}).filter(t=>"all"!==t.value)}get fieldsElement(){const t=this.querySelector("[slot='chaos-filter-fields']");return"UL"===t.tagName?t:t.querySelector("ul")}get fieldList(){return Array.from(this.fieldsElement.children)}filterFields(){const t=this.originalFields.filter(t=>this.filters.every(e=>"eq"===e.comparator?t.dataset[e.key]===e.value:"gt"===e.comparator&&Number(t.dataset[e.key])>Number(e.value)));this.fieldsElement.replaceChildren(...t),n.onFieldFilter$.notify()}updateParams(){const t=new URLSearchParams;this.filters.forEach(e=>t.set(e.key,e.value));const e=Array.from(t.entries()).length>0?`${window.location.origin}${window.location.pathname}?${t.toString()}`:`${window.location.origin}${window.location.pathname}`;window.history.pushState({path:e},"",e)}setFiltersFromParams(){const t=new URLSearchParams(window.location.search);this.selectors.filter(e=>t.has(e.dataset.match)).forEach(e=>{const s=t.get(e.dataset.match),i=Array.from(e.options);e.selectedIndex=i.findIndex(t=>t.value===s)})}onSubmit(t){t.preventDefault(),this.filterFields(),this.updateParams()}constructor(){super(),this.originalFields=void 0,this.attachShadow({mode:"open"}).appendChild((()=>{const t=document.createElement("template");return t.innerHTML='\n\t\t\t<slot name="chaos-filter-form"></slot>\n\t\t\t<slot name="chaos-filter-fields"></slot>\n\t\t\t',t.content})().cloneNode(!0)),this.originalFields=this.fieldList,this.setFiltersFromParams(),this.filterFields()}connectedCallback(){this.addEventListener("submit",t=>this.onSubmit(t),!1)}disconnectedCallback(){this.removeEventListener("submit",t=>this.onSubmit(t),!1)}}class h extends HTMLElement{get fieldList(){return this.querySelector("ul")}get fields(){return Array.from(this.fieldList.querySelectorAll("li"))}setFieldAndWidth(){const t=[...this.fields].map(t=>{const e=Array.from(t.children);return{parent:t,attr:e[0],title:e[1]}}).sort((t,e)=>t.title.scrollWidth-e.title.scrollWidth).pop();this.minimumWidth=t.attr.scrollWidth+t.title.scrollWidth,this.widestField=t.parent}constructor(){super(),this.resizer=void 0,this.widestField=void 0,this.minimumWidth=void 0,this._subscription=void 0,this.setFieldAndWidth(),this.resizer=new ResizeObserver(t=>{for(const e of t){const t=e.contentBoxSize[0].inlineSize<=this.minimumWidth;t&&this.fieldList.classList.contains("filter-wide")&&(this.fieldList.classList.remove("filter-wide"),this.fieldList.classList.add("filter-narrow")),!t&&this.fieldList.classList.contains("filter-narrow")&&(this.fieldList.classList.remove("filter-narrow"),this.fieldList.classList.add("filter-wide"))}})}connectedCallback(){this._subscription=n.onFieldFilter$.subscribe("chaos-resizer",()=>{this.resizer.unobserve(this.widestField),this.setFieldAndWidth(),this.resizer.observe(this.widestField)}),this.resizer.observe(this.widestField)}disconnectedCallback(){this.resizer.unobserve(this.widestField),n.onFieldFilter$.unsubscribe(this._subscription)}}class c extends HTMLElement{get logFeedUrl(){return new URL(window.location.origin+window.location.pathname+"index.xml")}get container(){return this.querySelector("#on-this-day")}get button(){return this.querySelector("button")}hide(){this.articles.forEach(t=>this.container.removeChild(t)),this.visible=!1,this.container.hidden=!0,this.button.innerText="Show On This Day"}show(t){t.forEach(t=>this.container.appendChild(t)),this.visible=!0,this.container.hidden=!1,this.button.innerText="Hide On This Day"}cloneArticle(t){const e=e=>t.querySelector(e).firstChild.data,s=document.querySelector("article").cloneNode(!0);s.classList.remove("wrapper-no-center");const i=s.querySelector("ul");return i.querySelector("time").innerText=new Date(e("pubDate")).toISOString().substr(0,10),i.querySelector("[rel='author']").innerText=e("author"),i.querySelector("[rel='bookmark']").href=e("link"),Array.from(s.children).forEach(t=>{t!=i&&s.removeChild(t)}),s.innerHTML+=e("description"),s}getPreviousLogs(){const t=new DOMParser,e=new Date,s=document.createElement("p");return s.innerText=`No previous logs on this date (${e.getMonth()+1}/${e.getDate()})`,s.classList.add("wrapper"),fetch(this.logFeedUrl).then(t=>t.text()).then(e=>t.parseFromString(e,"text/xml")).then(t=>{if(0!==(null==(i=t.getElementsByTagName("parsererror"))?void 0:i.length))return void console.log(`Failed to load XML from ${this.logFeedUrl}`);var i;const n=Array.from(t.getElementsByTagName("pubDate")).filter(t=>{return s=e,i=new Date(t.innerHTML),s.getFullYear()!==i.getFullYear()&&s.getMonth()===i.getMonth()&&s.getDate()===i.getDate();var s,i}).map(t=>this.cloneArticle(t.parentNode));return n.length>0?n:[s]})}async onClick(t){t.preventDefault(),this.visible?this.hide():this.articles?this.show(this.articles):this.getPreviousLogs().then(t=>{this.articles=t,this.show(t)})}render(){this.innerHTML='\n\t\t\t<aside>\n\t\t\t\t<button type="button">Show On This Day</button>\n\t\t\t\t<div id="on-this-day" class="wrapper no-h-padding | flow-m previous-cards" hidden>\n\t\t\t\t</div>\n\t\t\t</aside>\n\t\t'}constructor(){super(),this.visible=void 0,this.template=void 0,this.articles=void 0}connectedCallback(){this.render(),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class d extends HTMLElement{get theme(){return localStorage.getItem("theme")||this.themes.minimal}set theme(t){localStorage.setItem("theme",t),document.documentElement.setAttribute("theme",t)}get themeSelector(){return this.querySelector("select")}get themeOptions(){return Array.from(this.themeSelector.options)}constructor(){super(),this.themes={Minimal:"minimal",Jungle:"jungle",Fall:"fall",Void:"void"}}onThemeChange(t){const e=t.target;this.theme=e.options[e.selectedIndex].value}render(){const t=Object.entries(this.themes).map(([t,e])=>`<option value=${e}>${t}</option>`);this.innerHTML=`\n\t\t<select>\n\t\t\t${t}\n\t\t</select>\n\t\t`}connectedCallback(){this.render(),this.addEventListener("change",t=>this.onThemeChange(t),!1),this.themeSelector.selectedIndex=this.themeOptions.findIndex(t=>t.value===this.theme),document.documentElement.setAttribute("theme",this.theme)}disconnectedCallback(){this.removeEventListener("change",t=>this.onThemeChange(t),!1)}}customElements.define("chaos-login",o),customElements.define("chaos-logout",l),customElements.define("chaos-filter",a),customElements.define("chaos-resizer",h),customElements.define("chaos-on-this-day",c),customElements.define("chaos-color-switch",d);
//# sourceMappingURL=index.modern.js.map
