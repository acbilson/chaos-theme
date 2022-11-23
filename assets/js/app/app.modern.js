class t{static _getUrlFromHead(t){const e=Array.from(document.head.children).find(e=>e.rel===t);return null==e?void 0:e.href}static get publish(){return this._getUrlFromHead("publish")}static get auth(){return this._getUrlFromHead("authentication")}}var e,s,i;function n(e){if(null==e||null==t.auth)return new Promise((t,e)=>t(!1));const s=new Headers;return s.append("Authorization",`Bearer ${e}`),fetch(new URL("auth",t.auth),{headers:s}).then(t=>(200===t.status?sessionStorage.setItem("token",e):sessionStorage.removeItem("token"),200===t.status),t=>!1)}function r(t){const e=Array.from(document.head.children).find(e=>e.rel===t);return null==e?void 0:e.href}!function(t){t.CREATING="Create",t.EDITING="Edit",t.SAVING="Save"}(e||(e={})),function(t){t.TEXT="text",t.LIST="list"}(s||(s={})),function(t){t.PLANT="plant",t.QUIP="quip",t.LOG="log",t.STONE="stone"}(i||(i={}));class o{constructor(){this._subscribers=new Map}subscribe(t,e){const s=`${t}-${Math.random()}`;return this._subscribers.set(s,e),s}unsubscribe(t){delete this._subscribers[t]}notify(){this._subscribers.forEach((t,e)=>t())}}class a extends o{get value(){return this._value}set value(t){this._value=t,this.notify()}notify(){this._subscribers.forEach((t,e)=>t(this._value))}constructor(){super(),this._value=void 0}}var l,h=new class{get token(){return sessionStorage.getItem("token")}get publishUri(){return r("publish")}get authUri(){return r("authentication")}constructor(){this.isAuthorized$=new a,this.onFieldFilter$=new o,n(this.token).then(t=>{this.isAuthorized$.value=t})}};!function(t){t.PUBLISH="publish-service",t.AUTH="auth-service",t.STORE="store-state"}(l||(l={}));const u=new Map([[l.PUBLISH,new class{create(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token retrieved for update"}));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),s.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",h.publishUri),{method:"POST",body:JSON.stringify(e),headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}read(t,e){null==t&&new Promise((t,e)=>t(null));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),fetch(new URL(`file?path=${e}`,h.publishUri),{headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}update(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token retrieved for update"}));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),s.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",h.publishUri),{method:"PUT",body:JSON.stringify(e),headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}}],[l.AUTH,new class{authenticate(e,s){return function(e,s){if(null==e||null==s||null==t.auth)return new Promise(()=>!1);const i=new Headers;return i.append("Authorization",`Basic ${btoa(e+":"+s)}`),fetch(new URL("token",t.auth),{headers:i}).then(t=>200===t.status?t.json():null).then(t=>null!==t&&n(null==t?void 0:t.token))}(e,s).then(t=>(h.isAuthorized$.value=t,""),t=>"there was a login error")}unauthenticate(){sessionStorage.removeItem("token"),h.isAuthorized$.value=!1}}],[l.STORE,h]]);function c(t){return new CustomEvent("chaos-request",{bubbles:!0,composed:!0,detail:t})}class d extends HTMLElement{get username(){return this.querySelector("#username")}get password(){return this.querySelector("#password")}get errors(){return this.querySelector("#errors")}onClick(t){var e,s;t.preventDefault(),t.stopPropagation(),this._auth.authenticate(null==(e=this.username)?void 0:e.value,null==(s=this.password)?void 0:s.value).then(t=>this.errors.innerText=t)}render(){this.innerHTML='\n\t\t\t<label for="username">Username:</label>\n\t\t\t<input\n\t\t\t\tid="username"\n\t\t\t\tname="username"\n\t\t\t\tautocomplete="username"\n\t\t\t\ttype="text"\n\t\t\t/>\n\t\t\t<label for="password">Password:</label>\n\t\t\t<input\n\t\t\t\tid="password"\n\t\t\t\tname="password"\n\t\t\t\tautocomplete="password"\n\t\t\t\ttype="password"\n\t\t\t/>\n\t\t\t<button type="button">Login</button>\n\t\t\t<chaos-logout><p>No logout</p></chaos-logout>\n\t\t\t<label id="errors"></label>\n\t\t\t'}constructor(){super(),this._auth=void 0}connectedCallback(){this.render();const t=c({instance:l.AUTH,callback:t=>this._auth=t});this.dispatchEvent(t),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class p extends HTMLElement{onClick(t){t.preventDefault(),t.stopPropagation(),this._auth.unauthenticate()}constructor(){super(),this._auth=void 0,this._store=void 0,this._subscription=void 0}connectedCallback(){this.innerHTML='<button type="button" class="fill" hidden>Logout</button>';const t=c({instance:l.AUTH,callback:t=>this._auth=t}),e=c({instance:l.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this.dispatchEvent(e),this._subscription=this._store.isAuthorized$.subscribe("chaos-panel",t=>{this.innerHTML=t?'<button type="button" class="fill">Logout</button>':'<button type="button" class="fill" hidden>Logout</button>'}),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("click",t=>this.onClick(t),!1)}}class m extends HTMLElement{get formElement(){return this.querySelector("[slot='chaos-filter-form']")}get selectors(){return Array.from(this.formElement.querySelectorAll("select"))}get filters(){return this.selectors.map(t=>{var e;return{key:t.dataset.match,value:t.options[t.selectedIndex].value,comparator:null!=(e=t.dataset.comparator)?e:"eq"}}).filter(t=>"all"!==t.value)}get fieldsElement(){const t=this.querySelector("[slot='chaos-filter-fields']");return"UL"===t.tagName?t:t.querySelector("ul")}get fieldList(){return Array.from(this.fieldsElement.children)}filterFields(){const t=this.originalFields.filter(t=>this.filters.every(e=>"eq"===e.comparator?t.dataset[e.key]===e.value:"gt"===e.comparator&&Number(t.dataset[e.key])>Number(e.value)));this.fieldsElement.replaceChildren(...t),h.onFieldFilter$.notify()}updateParams(){const t=new URLSearchParams;this.filters.forEach(e=>t.set(e.key,e.value));const e=Array.from(t.entries()).length>0?`${window.location.origin}${window.location.pathname}?${t.toString()}`:`${window.location.origin}${window.location.pathname}`;window.history.pushState({path:e},"",e)}setFiltersFromParams(){const t=new URLSearchParams(window.location.search);this.selectors.filter(e=>t.has(e.dataset.match)).forEach(e=>{const s=t.get(e.dataset.match),i=Array.from(e.options);e.selectedIndex=i.findIndex(t=>t.value===s)})}onSubmit(t){t.preventDefault(),this.filterFields(),this.updateParams()}constructor(){super(),this.originalFields=void 0,this.attachShadow({mode:"open"}).appendChild((()=>{const t=document.createElement("template");return t.innerHTML='\n\t\t\t<slot name="chaos-filter-form"></slot>\n\t\t\t<slot name="chaos-filter-fields"></slot>\n\t\t\t',t.content})().cloneNode(!0)),this.originalFields=this.fieldList,this.setFiltersFromParams(),this.filterFields()}connectedCallback(){this.addEventListener("submit",t=>this.onSubmit(t),!1)}disconnectedCallback(){this.removeEventListener("submit",t=>this.onSubmit(t),!1)}}class b extends HTMLElement{get fieldList(){return this.querySelector("ul")}get fields(){return Array.from(this.fieldList.querySelectorAll("li"))}setFieldAndWidth(){const t=[...this.fields].map(t=>{const e=Array.from(t.children);return{parent:t,attr:e[0],title:e[1]}}).sort((t,e)=>t.title.scrollWidth-e.title.scrollWidth).pop();this.minimumWidth=t.attr.scrollWidth+t.title.scrollWidth,this.widestField=t.parent}constructor(){super(),this.resizer=void 0,this.widestField=void 0,this.minimumWidth=void 0,this._subscription=void 0,this.setFieldAndWidth(),this.resizer=new ResizeObserver(t=>{for(const e of t){const t=e.contentBoxSize[0].inlineSize<=this.minimumWidth;t&&this.fieldList.classList.contains("filter-wide")&&(this.fieldList.classList.remove("filter-wide"),this.fieldList.classList.add("filter-narrow")),!t&&this.fieldList.classList.contains("filter-narrow")&&(this.fieldList.classList.remove("filter-narrow"),this.fieldList.classList.add("filter-wide"))}})}connectedCallback(){this._subscription=h.onFieldFilter$.subscribe("chaos-resizer",()=>{this.resizer.unobserve(this.widestField),this.setFieldAndWidth(),this.resizer.observe(this.widestField)}),this.resizer.observe(this.widestField)}disconnectedCallback(){this.resizer.unobserve(this.widestField),h.onFieldFilter$.unsubscribe(this._subscription)}}class g extends HTMLElement{get logFeedUrl(){return new URL(window.location.origin+window.location.pathname+"index.xml")}get container(){return this.querySelector("#on-this-day")}get button(){return this.querySelector("button")}hide(){this.articles.forEach(t=>this.container.removeChild(t)),this.visible=!1,this.container.hidden=!0,this.button.innerText="Show On This Day"}show(t){t.forEach(t=>this.container.appendChild(t)),this.visible=!0,this.container.hidden=!1,this.button.innerText="Hide On This Day"}cloneArticle(t){const e=e=>t.querySelector(e).firstChild.data,s=document.querySelector("article").cloneNode(!0);s.classList.remove("wrapper-no-center");const i=s.querySelector("ul");return i.querySelector("time").innerText=new Date(e("pubDate")).toISOString().substr(0,10),i.querySelector("[rel='author']").innerText=e("author"),i.querySelector("[rel='bookmark']").href=e("link"),Array.from(s.children).forEach(t=>{t!=i&&s.removeChild(t)}),s.innerHTML+=e("description"),s}getPreviousLogs(){const t=new DOMParser,e=new Date,s=document.createElement("p");return s.innerText=`No previous logs on this date (${e.getMonth()+1}/${e.getDate()})`,s.classList.add("wrapper"),fetch(this.logFeedUrl).then(t=>t.text()).then(e=>t.parseFromString(e,"text/xml")).then(t=>{if(0!==(null==(i=t.getElementsByTagName("parsererror"))?void 0:i.length))return void console.log(`Failed to load XML from ${this.logFeedUrl}`);var i;const n=Array.from(t.getElementsByTagName("pubDate")).filter(t=>{return s=e,i=new Date(t.innerHTML),s.getFullYear()!==i.getFullYear()&&s.getMonth()===i.getMonth()&&s.getDate()===i.getDate();var s,i}).map(t=>this.cloneArticle(t.parentNode));return n.length>0?n:[s]})}async onClick(t){t.preventDefault(),this.visible?this.hide():this.articles?this.show(this.articles):this.getPreviousLogs().then(t=>{this.articles=t,this.show(t)})}render(){this.innerHTML='\n\t\t\t<aside>\n\t\t\t\t<button type="button">Show On This Day</button>\n\t\t\t\t<div id="on-this-day" class="wrapper no-h-padding | flow-m previous-cards" hidden>\n\t\t\t\t</div>\n\t\t\t</aside>\n\t\t'}constructor(){super(),this.visible=void 0,this.template=void 0,this.articles=void 0}connectedCallback(){this.render(),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class v extends HTMLElement{get theme(){return localStorage.getItem("theme")||this.themes.minimal}set theme(t){localStorage.setItem("theme",t),document.documentElement.setAttribute("theme",t)}get themeSelector(){return this.querySelector("select")}get themeOptions(){return Array.from(this.themeSelector.options)}constructor(){super(),this.themes={Minimal:"minimal",Jungle:"jungle",Fall:"fall",Void:"void"}}onThemeChange(t){const e=t.target;this.theme=e.options[e.selectedIndex].value}render(){const t=Object.entries(this.themes).map(([t,e])=>`<option value=${e}>${t}</option>`);this.innerHTML=`\n\t\t<select>\n\t\t\t${t}\n\t\t</select>\n\t\t`}connectedCallback(){this.render(),this.addEventListener("change",t=>this.onThemeChange(t),!1),this.themeSelector.selectedIndex=this.themeOptions.findIndex(t=>t.value===this.theme),document.documentElement.setAttribute("theme",this.theme)}disconnectedCallback(){this.removeEventListener("change",t=>this.onThemeChange(t),!1)}}class f extends HTMLElement{get isNew(){return this._isNew}set isNew(t){this._isNew=t;const s=this.getButton(e.EDITING),i=this.getButton(e.CREATING);t?(s.classList.remove("selected-panel-type"),i.classList.add("selected-panel-type")):(s.classList.add("selected-panel-type"),i.classList.remove("selected-panel-type"))}get panelType(){return this.getAttribute("data-panel-type")}getButton(t){return this.querySelector(`button#${t}`)}get panelOptions(){return Array.from(this.querySelectorAll("chaos-panel-option")||[])}get contents(){var t;return(null==(t=this.querySelector("textarea"))?void 0:t.value)||""}set contents(t){this.querySelector("textarea").innerText=t}get errorMsg(){var t;return(null==(t=this.querySelector("#error-message"))?void 0:t.innerText)||""}set errorMsg(t){this.querySelector("#error-message").innerText=t}get frontmatter(){return 0===this.panelOptions.length?{}:this.panelOptions.reduce((t,e)=>{const s=e.getModel();return null!=s&&s.key&&null!=s&&s.value&&(t[s.key]=s.value),t},{})}get filePath(){return document.location.pathname}get shouldHaveOptions(){return this._typesWithOptions.includes(this.panelType)}updateChaosPanelOptions(t,e){const s=this.panelOptions,i=t=>s.find(e=>e.getAttribute("data-key")===t),n=i("path");n&&(n.value=t,n.readonly=!0),Object.keys(e).forEach(t=>{const s=i(t);s&&(s.value=e[t])})}clearChaosPanelOptions(){this.panelOptions.forEach(t=>t.value=null)}startUpdate(){return this._pub.read(this._store.token,this.filePath).then(t=>{t.success?(this.contents=t.content.body,this.updateChaosPanelOptions(t.content.path,t.content.frontmatter),this.isNew=!1):this.errorMsg=t.message})}startCreate(){this.contents="",this.clearChaosPanelOptions(),this.isNew=!0}updateFile(){const t=this.frontmatter;let e;return"path"in t?(e=t.path,delete t.path):this.shouldHaveOptions||(e=this.getFilePath()),t.lastmod=(new Date).toISOString(),this._pub.update(this._store.token,{path:e,body:this.contents,frontmatter:t}).then(t=>{t.success?(this.contents=t.content.body,this.errorMsg="success"):this.errorMsg=t.message},t=>this.errorMsg=t.toString())}getFilePath(){switch(this.panelType){case i.PLANT:case i.STONE:default:return this.filePath;case i.QUIP:case i.LOG:return function(t){const e=t=>t<10?`0${t}`:t.toString(),s=new Date,n=s.getFullYear().toString(),r=e(s.getMonth()+1),o=s.getDate(),a=e(s.getHours()),l=e(s.getMinutes()),h=e(s.getSeconds());return t===i.LOG?`/logs/${n}/${r}/${n}${r}${o}-${a}${l}${h}`:`/quips/${n}${r}${o}-${a}${l}${h}`}(this.panelType)}}createFile(){const t=this.frontmatter;let e;"path"in t&&this.shouldHaveOptions?(e=t.path,delete t.path):e=this.getFilePath();const s=new Date;t.date=function(t){var e;return[t.getFullYear(),(e=t.getMonth()+1)<10?`0${e}`:e.toString(),t.getDate()].join("-")}(s),t.lastmod=s.toISOString(),this._pub.create(this._store.token,{body:this.contents,frontmatter:t,path:e}).then(t=>{t.success&&(this.contents=t.content.body,this.updateChaosPanelOptions(t.content.path,t.content.frontmatter),this.errorMsg=t.message),this.errorMsg=t.message},t=>this.errorMsg=t.toString())}validate(){const t=this.panelOptions.map(t=>t.getModel()).filter(t=>t.required).some(t=>!t.value);return!this.shouldHaveOptions||!t||(this.errorMsg="Not all required fields have values",!1)}render(){return`\n\t\t\t<form class="wrapper">\n\t\t\t\t<fieldset id="panel-buttons">\n\t\t\t\t\t${Object.keys(e).map(t=>`<button id="${e[t]}"\n\t\t\t\t${e[t]==e.SAVING?'type="submit" disabled':""}\n\t\t\t\t>${e[t]}</button>`).join("")}\n\t\t\t\t</fieldset>\n\t\t\t\t<fieldset>${this._initialMarkup}</fieldset>\n\t\t\t\t<p id="error-message"></p>\n\t\t\t\t<textarea>${this.contents}</textarea>\n\t\t\t</form>\n\t\t`}onButtonClick(t){switch(t.preventDefault(),t.submitter.id){case e.CREATING:this.startCreate();break;case e.EDITING:this.startUpdate();break;case e.SAVING:this.validate()&&(this.isNew?this.createFile():this.updateFile());break;default:this.errorMsg="selected an unknown button status"}}onKeyUp(t){t.preventDefault();const s=t.target;this.getButton(e.SAVING).disabled=s.value.length<=0}constructor(){super(),this._pub=void 0,this._store=void 0,this._subscription=void 0,this._typesWithOptions=[i.PLANT,i.STONE],this._initialMarkup=void 0,this._isNew=!0,this._initialMarkup=this.innerHTML,this.innerHTML=""}connectedCallback(){const t=c({instance:l.PUBLISH,callback:t=>this._pub=t}),e=c({instance:l.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this.dispatchEvent(e),this._subscription=this._store.isAuthorized$.subscribe("chaos-panel",t=>{this.innerHTML=t?this.render():"<span hidden>Not authorized to view panel</span>"}),this.addEventListener("submit",t=>this.onButtonClick(t)),this.addEventListener("keyup",t=>this.onKeyUp(t))}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("submit",t=>this.onButtonClick(t)),this.removeEventListener("keyup",t=>this.onKeyUp(t))}}class y extends HTMLElement{get key(){return this.getAttribute("data-key")}get label(){return this.getAttribute("data-label")}get input(){return this.querySelector("input")}get value(){return this.getAttribute("data-value")||""}set value(t){this.setAttribute("data-value",t),this.input.value=t}get required(){return!!this.getAttribute("data-required")}get readonly(){return!!this.getAttribute("data-readonly")}set readonly(t){this.setAttribute("data-readonly",String(t)),this.input.readOnly=t}get type(){const t=this.getAttribute("data-type");return t?s[t.toUpperCase()]:s.TEXT}valueByType(){switch(this.type){case s.TEXT:default:return this.value;case s.LIST:return this.value.includes(",")?this.value.replaceAll(" ","").split(","):[this.value.trim()]}}getModel(){return{key:this.key,name:this.label,value:this.valueByType(),required:this.required,type:this.type}}onEdit(t){t.preventDefault(),this.value=t.target.value}render(){return`\n\t\t\t<li class="panel-option spread-btwn${this.required?" required":""}">\n\t\t\t\t<label for="${this.label}">${this.label}</label>\n\t\t\t\t<span>${this.required?"(required)":""}\n\t\t\t\t<input\n\t\t\t\t\t${this.label?'name="this.label"':""}\n\t\t\t\t\t${this.type?'type="this.type"':""}\n\t\t\t\t\t${this.value?'value="this.value"':""}\n\t\t\t\t\t${this.readonly?"disabled":""}\n\t\t\t\t/></span>\n\t\t\t</li>\n\t\t`}constructor(){super(),this._store=void 0,this._subscription=void 0}connectedCallback(){const t=c({instance:l.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this._subscription=this._store.isAuthorized$.subscribe("chaos-panel-option",t=>{this.innerHTML=t?this.render():"<span hidden>Not authorized to view panel option</span>"}),this.addEventListener("keyup",t=>this.onEdit(t))}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("keyup",t=>this.onEdit(t))}}document.addEventListener("chaos-request",t=>{const e=t.detail,s=u.get(e.instance);e.callback(s)}),customElements.define("chaos-login",d),customElements.define("chaos-logout",p),customElements.define("chaos-filter",m),customElements.define("chaos-resizer",b),customElements.define("chaos-on-this-day",g),customElements.define("chaos-color-switch",v),customElements.define("chaos-panel",f),customElements.define("chaos-panel-option",y);
//# sourceMappingURL=index.modern.js.map
