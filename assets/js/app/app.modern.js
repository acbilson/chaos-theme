var t,e,s;function n(t){return Array.from(document.head.children).find(e=>e.rel===t).href}function i(t){const e=n("publish");if(null==t||!e)return new Promise((t,e)=>t(!1));const s=new Headers;return s.append("Authorization",`Bearer ${t}`),fetch(new URL("auth",e),{headers:s}).then(e=>200===e.status&&(sessionStorage.setItem("token",t),!0),t=>!1)}!function(t){t.CREATING="Create",t.EDITING="Edit",t.SAVING="Save"}(t||(t={})),function(t){t.TEXT="text",t.LIST="list",t.BOOLEAN="boolean",t.FILE="file"}(e||(e={})),function(t){t.PLANT="plant",t.QUIP="quip",t.LOG="log",t.STONE="stone"}(s||(s={}));class r{constructor(){this._subscribers=new Map}subscribe(t,e){const s=`${t}-${Math.random()}`;return this._subscribers.set(s,e),s}unsubscribe(t){delete this._subscribers[t]}notify(){this._subscribers.forEach((t,e)=>t())}}class o extends r{get value(){return this._value}set value(t){this._value=t,this.notify()}notify(){this._subscribers.forEach((t,e)=>t(this._value))}constructor(){super(),this._value=void 0}}var a,l=new class{get token(){return sessionStorage.getItem("token")}get mastodonToken(){return sessionStorage.getItem("mastotoken")}constructor(){this.isAuthorized$=new o,this.isMastodonAuthorized$=new o,this.onFieldFilter$=new r,i(this.token).then(t=>{this.isAuthorized$.value=t}),window.addEventListener("message",t=>{if(t.isTrusted&&t.data){const e=document.location.href;(function(t,e,s){const i=n("publish");if(!i)return new Promise((t,e)=>t(!1));const r=new Headers;return r.append("Authorization",`Bearer ${t}`),r.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL(`mastodon/redirect?code=${e}&redirect=${s}`,i),{headers:r}).then(t=>200===t.status?t.json():null).then(t=>t).then(t=>null!=(null==t?void 0:t.token)&&(sessionStorage.setItem("mastotoken",t.token),!0),t=>!1)})(this.token,t.data,e).then(t=>{this.isMastodonAuthorized$.value=t})}});const t=new URLSearchParams(document.location.search);t.has("code")&&(window.opener.postMessage(t.get("code"),document.location.origin),window.close())}};!function(t){t.PUBLISH="publish-service",t.AUTH="auth-service",t.MASTOAUTH="masto-auth-service",t.SEARCH="search-service",t.STORE="store-state"}(a||(a={}));const h=new Map([[a.PUBLISH,new class{create(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token passed to create"}));const s=n("publish");if(!s)return new Promise(t=>t({success:!1,message:"missing publish uri in head"}));const i=new Headers;return i.append("Authorization",`Bearer ${t}`),i.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",s),{method:"POST",body:JSON.stringify(e),headers:i}).then(t=>200===t.status?t.json():null).then(t=>t)}createPhoto(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token passed to create photo"}));const s=n("publish");if(!s)return new Promise(t=>t({success:!1,message:"missing publish uri in head"}));const i=new FormData;i.append("photo",e.files[0]);const r=new Headers;return r.append("Authorization",`Bearer ${t}`),fetch(new URL("photo",s),{method:"POST",body:i,headers:r}).then(t=>200===t.status?t.json():null).then(t=>t)}read(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token passed to read"}));const s=n("publish");if(!s)return new Promise(t=>t({success:!1,message:"missing publish uri in head"}));const i=new Headers;return i.append("Authorization",`Bearer ${t}`),fetch(new URL(`file?path=${e}`,s),{headers:i}).then(t=>200===t.status?t.json():null).then(t=>t)}update(t,e){null==t&&new Promise((t,e)=>t({success:!1,message:"no token passed to update"}));const s=n("publish");if(!s)return new Promise(t=>t({success:!1,message:"missing publish uri in head"}));const i=new Headers;return i.append("Authorization",`Bearer ${t}`),i.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("file",s),{method:"PUT",body:JSON.stringify(e),headers:i}).then(t=>200===t.status?t.json():null).then(t=>t)}}],[a.AUTH,new class{authenticate(t,e){if(null==t||null==e)return new Promise(t=>t("missing authentication arguments"));const s=n("authentication");if(!s)return new Promise(t=>t("missing authentication uri in head"));const r=new Headers;return r.append("Authorization",`Basic ${btoa(t+":"+e)}`),fetch(new URL("token",s),{headers:r}).then(t=>200===t.status?t.json():null).then(t=>t).then(t=>null===(null==t?void 0:t.token)?"there was a login error":i(t.token).then(t=>(l.isAuthorized$.value=t,"")),t=>"there was a login error")}unauthenticate(){sessionStorage.removeItem("token"),l.isAuthorized$.value=!1}}],[a.MASTOAUTH,new class{authenticate(t,e){if(null==t||null==e)return new Promise(t=>t("missing authentication arguments"));const s=n("authentication");if(!s)return new Promise(t=>t("missing authentication uri in head"));const i=new Headers;return i.append("Authorization",`Bearer ${t}`),fetch(new URL(`mastodon/auth?redirect=${e}`,s),{headers:i}).then(t=>200===t.status?t.json():null).then(t=>t).then(t=>null==(null==t?void 0:t.authenticationUri)?"failed to retrieve authentication URI":(window.open(t.authenticationUri,"_blank"),""))}unauthenticate(t,e){if(null==t||null==e)return new Promise(t=>t("missing authentication arguments"));const s=n("authentication");if(!s)return new Promise(t=>t("missing authentication uri in head"));const i={token:e},r=new Headers;return r.append("Authorization",`Bearer ${t}`),r.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("mastodon/revoke",s),{method:"POST",body:JSON.stringify(i),headers:r}).then(t=>200===t.status?t.json():null).then(t=>t).then(t=>t.success?(sessionStorage.removeItem("mastotoken"),l.isMastodonAuthorized$.value=!1,""):t.message)}}],[a.SEARCH,new class{query(t){const e=n("search");if(!e)return new Promise(t=>t({success:!1,message:"missing search uri in head",content:[]}));const s=new Headers;return s.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL(`search?q=${t}`,e),{headers:s}).then(t=>200===t.status?t.json():null).then(t=>t)}sites(){const t=n("search");if(!t)return new Promise(t=>t({success:!1,message:"missing search uri in head",content:[]}));const e=new Headers;return e.append("Content-Type","application/json; charset=UTF-8"),fetch(new URL("sites",t),{headers:e}).then(t=>200===t.status?t.json():null).then(t=>t)}}],[a.STORE,l]]);function c(t){return new CustomEvent("chaos-request",{bubbles:!0,composed:!0,detail:t})}class u extends HTMLElement{get username(){return this.querySelector("#username")}get password(){return this.querySelector("#password")}get errors(){return this.querySelector("#errors")}onClick(t){var e,s;const n=t.target;"button"===(null==n?void 0:n.type)&&(t.preventDefault(),t.stopPropagation(),this._auth.authenticate(null==(e=this.username)?void 0:e.value,null==(s=this.password)?void 0:s.value).then(t=>this.errors.innerText=t))}render(){this.innerHTML='\n\t\t\t<label for="username">Username:</label>\n\t\t\t<input\n\t\t\t\tid="username"\n\t\t\t\tname="username"\n\t\t\t\tautocomplete="username"\n\t\t\t\ttype="text"\n\t\t\t/>\n\t\t\t<label for="password">Password:</label>\n\t\t\t<input\n\t\t\t\tid="password"\n\t\t\t\tname="password"\n\t\t\t\tautocomplete="password"\n\t\t\t\ttype="password"\n\t\t\t/>\n\t\t\t<button id="login" type="button">Login</button>\n\t\t\t<chaos-logout><p>No logout</p></chaos-logout>\n\t\t\t<label id="errors"></label>\n\t\t'}constructor(){super(),this._auth=void 0}connectedCallback(){this.render(),this.dispatchEvent(c({instance:a.AUTH,callback:t=>this._auth=t})),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class d extends HTMLElement{onClick(t){t.preventDefault(),t.stopPropagation(),this._auth.unauthenticate()}constructor(){super(),this._auth=void 0,this._store=void 0,this._subscription=void 0}connectedCallback(){this.innerHTML='<button type="button" class="fill" hidden>Logout</button>';const t=c({instance:a.AUTH,callback:t=>this._auth=t}),e=c({instance:a.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this.dispatchEvent(e),this._subscription=this._store.isAuthorized$.subscribe("chaos-logout",t=>{this.innerHTML=t?'<button type="button" class="fill">Logout</button>':'<button type="button" class="fill" hidden>Logout</button>'}),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("click",t=>this.onClick(t),!1)}}class p extends HTMLElement{get errors(){return this.querySelector("#errors")}get redirectUri(){return document.location.href}onClick(t){const e=t.target;"button"===(null==e?void 0:e.type)&&(t.preventDefault(),t.stopPropagation(),this._mastoauth.authenticate(this._store.token,this.redirectUri).then(t=>this.errors.innerText=t))}constructor(){super(),this._mastoauth=void 0,this._store=void 0,this._subscription=void 0,this._defaultHTML='\n\t\t<button type="button" class="fill" hidden>Login to Mastodon</button>\n\t\t<label id="errors"></label>\n\t'}connectedCallback(){this.innerHTML=this._defaultHTML,this.dispatchEvent(c({instance:a.MASTOAUTH,callback:t=>this._mastoauth=t})),this.dispatchEvent(c({instance:a.STORE,callback:t=>this._store=t})),this._subscription=this._store.isAuthorized$.subscribe("chaos-masto-login",t=>{this.innerHTML=t?'\n\t\t\t\t\t<button type="button" class="fill">Login to Mastodon</button>\n\t\t\t\t\t<chaos-masto-logout></chaos-masto-logout>\n\t\t\t\t\t<label id="errors"></label>\n\t\t\t\t\t':this._defaultHTML}),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("click",t=>this.onClick(t),!1)}}class m extends HTMLElement{onClick(t){t.preventDefault(),t.stopPropagation(),this._mastoauth.unauthenticate(this._store.token,this._store.mastodonToken)}constructor(){super(),this._mastoauth=void 0,this._store=void 0,this._subscription=void 0,this._defaultHTML='<button type="button" class="fill" hidden>Logout</button>'}connectedCallback(){this.innerHTML=this._defaultHTML,this.dispatchEvent(c({instance:a.MASTOAUTH,callback:t=>this._mastoauth=t})),this.dispatchEvent(c({instance:a.STORE,callback:t=>this._store=t})),this._subscription=this._store.isMastodonAuthorized$.subscribe("chaos-masto-logout",t=>{this.innerHTML=t?'<button type="button" class="fill">Logout</button>':this._defaultHTML}),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this._store.isMastodonAuthorized$.unsubscribe(this._subscription),this.removeEventListener("click",t=>this.onClick(t),!1)}}class g extends HTMLElement{get formElement(){return this.querySelector("[slot='chaos-filter-form']")}get selectors(){return Array.from(this.formElement.querySelectorAll("select"))}get filters(){return this.selectors.map(t=>{var e;return{key:t.dataset.match,value:t.options[t.selectedIndex].value,comparator:null!=(e=t.dataset.comparator)?e:"eq"}}).filter(t=>"all"!==t.value)}get fieldsElement(){const t=this.querySelector("[slot='chaos-filter-fields']");return"UL"===t.tagName?t:t.querySelector("ul")}get fieldList(){return Array.from(this.fieldsElement.children)}filterFields(){const t=this.originalFields.filter(t=>this.filters.every(e=>"eq"===e.comparator?t.dataset[e.key]===e.value:"gt"===e.comparator&&Number(t.dataset[e.key])>Number(e.value)));this.fieldsElement.replaceChildren(...t),l.onFieldFilter$.notify()}updateParams(){const t=new URLSearchParams;this.filters.forEach(e=>t.set(e.key,e.value));const e=Array.from(t.entries()).length>0?`${window.location.origin}${window.location.pathname}?${t.toString()}`:`${window.location.origin}${window.location.pathname}`;window.history.pushState({path:e},"",e)}setFiltersFromParams(){const t=new URLSearchParams(window.location.search);this.selectors.filter(e=>t.has(e.dataset.match)).forEach(e=>{const s=t.get(e.dataset.match),n=Array.from(e.options);e.selectedIndex=n.findIndex(t=>t.value===s)})}onSubmit(t){t.preventDefault(),this.filterFields(),this.updateParams()}constructor(){super(),this.originalFields=void 0,this.attachShadow({mode:"open"}).appendChild((()=>{const t=document.createElement("template");return t.innerHTML='\n\t\t\t<slot name="chaos-filter-form"></slot>\n\t\t\t<slot name="chaos-filter-fields"></slot>\n\t\t\t',t.content})().cloneNode(!0)),this.originalFields=this.fieldList,this.setFiltersFromParams(),this.filterFields()}connectedCallback(){this.addEventListener("submit",t=>this.onSubmit(t),!1)}disconnectedCallback(){this.removeEventListener("submit",t=>this.onSubmit(t),!1)}}class b extends HTMLElement{get fieldList(){return this.querySelector("ul")}get fields(){return Array.from(this.fieldList.querySelectorAll("li"))}setFieldAndWidth(){const t=[...this.fields].map(t=>{const e=Array.from(t.children);return{parent:t,attr:e[0],title:e[1]}}).sort((t,e)=>t.title.scrollWidth-e.title.scrollWidth).pop();this.minimumWidth=t.attr.scrollWidth+t.title.scrollWidth,this.widestField=t.parent}constructor(){super(),this.resizer=void 0,this.widestField=void 0,this.minimumWidth=void 0,this._subscription=void 0,this.setFieldAndWidth(),this.resizer=new ResizeObserver(t=>{for(const e of t){const t=e.contentBoxSize[0].inlineSize<=this.minimumWidth;t&&this.fieldList.classList.contains("filter-wide")&&(this.fieldList.classList.remove("filter-wide"),this.fieldList.classList.add("filter-narrow")),!t&&this.fieldList.classList.contains("filter-narrow")&&(this.fieldList.classList.remove("filter-narrow"),this.fieldList.classList.add("filter-wide"))}})}connectedCallback(){this._subscription=l.onFieldFilter$.subscribe("chaos-resizer",()=>{this.resizer.unobserve(this.widestField),this.setFieldAndWidth(),this.resizer.observe(this.widestField)}),this.resizer.observe(this.widestField)}disconnectedCallback(){this.resizer.unobserve(this.widestField),l.onFieldFilter$.unsubscribe(this._subscription)}}class v extends HTMLElement{get logFeedUrl(){return new URL(window.location.origin+"/logs/index.xml")}get logUrl(){return new URL(window.location.origin+"/logs")}get container(){return this.querySelector("#on-this-day")}get button(){return this.querySelector("button")}hide(){this.articles.forEach(t=>this.container.removeChild(t)),this.visible=!1,this.container.hidden=!0,this.button.innerText="Show On This Day"}show(t){t.forEach(t=>this.container.appendChild(t)),this.visible=!0,this.container.hidden=!1,this.button.innerText="Hide On This Day"}fetchArticleTemplate(){const t=new DOMParser;return fetch(this.logUrl).then(t=>t.text()).then(e=>t.parseFromString(e,"text/html")).then(t=>t.querySelector("article").cloneNode(!0))}fetchLogFeed(){const t=new DOMParser;return fetch(this.logFeedUrl).then(t=>t.text()).then(e=>t.parseFromString(e,"text/xml")).then(t=>{return 0!==(null==(e=t.getElementsByTagName("parsererror"))?void 0:e.length)?(console.log(`Failed to load XML from ${this.logFeedUrl}`),null):t;var e})}cloneArticle(t,e){const s=e=>t.querySelector(e).firstChild.data;e.classList.remove("wrapper-no-center");const n=e.querySelector("header>ul");return Array.from(e.children).filter(t=>"header"!==t.tagName.toLowerCase()).forEach(t=>e.removeChild(t)),n.querySelector("time").innerText=new Date(s("pubDate")).toISOString().substr(0,10),n.querySelector("[rel='author']").innerText=s("author"),n.querySelector("[rel='bookmark']").href=s("link"),e.innerHTML+=s("description"),e}async getPreviousLogs(){new DOMParser;const t=new Date,e=document.createElement("p");e.innerText=`No previous logs on this date (${t.getMonth()+1}/${t.getDate()})`,e.classList.add("wrapper");const s=await this.fetchLogFeed(),n=await this.fetchArticleTemplate(),i=Array.from(s.getElementsByTagName("pubDate")).filter(e=>{return s=t,n=new Date(e.innerHTML),s.getFullYear()!==n.getFullYear()&&s.getMonth()===n.getMonth()&&s.getDate()===n.getDate();var s,n}).map(t=>this.cloneArticle(t.parentNode,n.cloneNode(!0)));return i.length>0?i:[e]}async onClick(t){t.preventDefault(),this.visible?this.hide():this.articles?this.show(this.articles):this.getPreviousLogs().then(t=>{this.articles=t,this.show(t)})}render(){this.innerHTML='\n\t\t\t<aside>\n\t\t\t\t<button type="button">Show On This Day</button>\n\t\t\t\t<div id="on-this-day" class="wrapper no-h-padding | flow-m previous-cards" hidden>\n\t\t\t\t</div>\n\t\t\t</aside>\n\t\t'}constructor(){super(),this.visible=void 0,this.template=void 0,this.articles=void 0}connectedCallback(){this.render(),this.addEventListener("click",t=>this.onClick(t),!1)}disconnectedCallback(){this.removeEventListener("click",t=>this.onClick(t),!1)}}class f extends HTMLElement{get theme(){return localStorage.getItem("theme")||this.themes.minimal}set theme(t){localStorage.setItem("theme",t),document.documentElement.setAttribute("theme",t)}get themeSelector(){return this.querySelector("select")}get themeOptions(){return Array.from(this.themeSelector.options)}constructor(){super(),this.themes={Minimal:"minimal",Jungle:"jungle",Fall:"fall",Void:"void"}}onThemeChange(t){const e=t.target;this.theme=e.options[e.selectedIndex].value}render(){const t=Object.entries(this.themes).map(([t,e])=>`<option value=${e}>${t}</option>`);this.innerHTML=`\n\t\t<select>\n\t\t\t${t}\n\t\t</select>\n\t\t`}connectedCallback(){this.render(),this.addEventListener("change",t=>this.onThemeChange(t),!1),this.themeSelector.selectedIndex=this.themeOptions.findIndex(t=>t.value===this.theme),document.documentElement.setAttribute("theme",this.theme)}disconnectedCallback(){this.removeEventListener("change",t=>this.onThemeChange(t),!1)}}class y extends HTMLElement{get isNew(){return this._isNew}set isNew(e){this._isNew=e;const s=this.getButton(t.EDITING),n=this.getButton(t.CREATING);e?(s.classList.remove("selected-panel-type"),n.classList.add("selected-panel-type")):(s.classList.add("selected-panel-type"),n.classList.remove("selected-panel-type"))}get panelType(){return this.getAttribute("data-panel-type")}getButton(t){return this.querySelector(`button#${t}`)}getCharacterCount(){return this.querySelector("#character-count")}get panelOptions(){return Array.from(this.querySelectorAll("chaos-panel-option")||[])}get syndicateOption(){return this.panelOptions.find(t=>"syndicate"===t.key)}get photoOption(){return this.panelOptions.find(t=>"photo"===t.key)}get contents(){var t;return(null==(t=this.querySelector("textarea"))?void 0:t.value)||""}set contents(t){this.querySelector("textarea").innerText=t}get errorMsg(){var t;return(null==(t=this.querySelector("#error-message"))?void 0:t.innerText)||""}set errorMsg(t){this.querySelector("#error-message").innerText=t}get frontmatter(){return 0===this.panelOptions.length?{}:this.panelOptions.reduce((t,e)=>{const s=e.getModel();return null!=s&&s.key&&null!=s&&s.value&&(t[s.key]=s.value),t},{})}get filePath(){return document.location.pathname}get shouldHaveOptions(){return this._typesWithOptions.includes(this.panelType)}updateChaosPanelOptions(t,e){const s=this.panelOptions,n=t=>s.find(e=>e.getAttribute("data-key")===t),i=n("path");i&&(i.value=t,i.readonly=!0),Object.keys(e).forEach(t=>{const s=n(t);s&&(s.value=e[t])})}clearChaosPanelOptions(){this.panelOptions.forEach(t=>t.value=null)}startUpdate(){return this._pub.read(this._store.token,this.filePath).then(t=>{t.success?(this.contents=t.content.body,this.updateChaosPanelOptions(t.content.path,t.content.frontmatter),this.isNew=!1):this.errorMsg=t.message})}startCreate(){this.contents="",this.clearChaosPanelOptions(),this.isNew=!0}updateFile(){const t=this.frontmatter;let e;return"path"in t?(e=t.path,delete t.path):this.shouldHaveOptions||(e=this.getFilePath()),t.lastmod=(new Date).toISOString(),this._pub.update(this._store.token,{body:this.contents,token:this._store.mastodonToken,path:e,frontmatter:t}).then(t=>{t.success?(this.contents=t.content.body,this.errorMsg="success"):this.errorMsg=t.message},t=>this.errorMsg=t.toString())}getFilePath(){switch(this.panelType){case s.PLANT:case s.STONE:default:return this.filePath;case s.QUIP:case s.LOG:return function(t){const e=t=>t<10?`0${t}`:t.toString(),n=new Date,i=n.getFullYear().toString(),r=e(n.getMonth()+1),o=n.getDate(),a=e(n.getHours()),l=e(n.getMinutes()),h=e(n.getSeconds());return t===s.LOG?`/logs/${i}/${r}/${i}${r}${o}-${a}${l}${h}`:`/quips/${i}${r}${o}-${a}${l}${h}`}(this.panelType)}}createFile(){var t;const e=this.frontmatter;let s;"path"in e&&this.shouldHaveOptions?(s=e.path,delete e.path):s=this.getFilePath();const n=new Date;e.date=function(t){var e;return[t.getFullYear(),(e=t.getMonth()+1)<10?`0${e}`:e.toString(),t.getDate()].join("-")}(n),e.lastmod=n.toISOString(),null!=(t=this.photoOption)&&t.value&&"https://images.alexbilson.dev/"!=this.photoOption.value?this._pub.createPhoto(this._store.token,this.photoOption.input).then(t=>{this.errorMsg=t.message},t=>this.errorMsg=t.toString()):delete e.photo,this._pub.create(this._store.token,{body:this.contents,token:this._store.mastodonToken,frontmatter:e,path:s}).then(t=>{t.success&&(this.contents=t.content.body,this.updateChaosPanelOptions(t.content.path,t.content.frontmatter),this.errorMsg=t.message),this.errorMsg=t.message},t=>this.errorMsg=t.toString())}validate(){const t=this.panelOptions.map(t=>t.getModel()).filter(t=>t.required).some(t=>!t.value);return!this.shouldHaveOptions||!t||(this.errorMsg="Not all required fields have values",!1)}render(){return`\n\t\t\t<form class="wrapper">\n\t\t\t\t<fieldset id="panel-buttons">\n\t\t\t\t\t${Object.keys(t).map(e=>`<button id="${t[e]}"\n\t\t\t\t${t[e]==t.SAVING?'type="submit" disabled':""}\n\t\t\t\t>${t[e]}</button>`).join("")}\n\t\t\t\t</fieldset>\n\t\t\t\t<fieldset>${this._initialMarkup}</fieldset>\n\t\t\t\t<div>\n\t\t\t\t\t<p><span id="character-count">0</span> characters</p>\n\t\t\t\t\t<p id="error-message"></p>\n\t\t\t\t</div>\n\t\t\t\t<textarea>${this.contents}</textarea>\n\t\t\t</form>\n\t\t`}onButtonClick(e){switch(e.preventDefault(),e.submitter.id){case t.CREATING:this.startCreate();break;case t.EDITING:this.startUpdate();break;case t.SAVING:this.validate()&&(this.isNew?this.createFile():this.updateFile());break;default:this.errorMsg="selected an unknown button status"}}onKeyUp(e){e.preventDefault();const s=e.target;this.getButton(t.SAVING).disabled=s.value.length<=0,this.getCharacterCount().innerText=s.value.length.toString()}constructor(){super(),this._pub=void 0,this._store=void 0,this._subscriptions={auth:null,mastodon:null},this._typesWithOptions=[s.PLANT,s.STONE],this._initialMarkup=void 0,this._isNew=!0,this._initialMarkup=this.innerHTML,this.innerHTML=""}connectedCallback(){const t=c({instance:a.PUBLISH,callback:t=>this._pub=t}),e=c({instance:a.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this.dispatchEvent(e),this._subscriptions.auth=this._store.isAuthorized$.subscribe("chaos-panel",t=>{this.innerHTML=t?this.render():"<span hidden>Not authorized to view panel</span>"}),this.syndicateOption&&(this._subscriptions.mastodon=this._store.isMastodonAuthorized$.subscribe("chaos-panel",t=>this.syndicateOption.readonly=!t)),this.addEventListener("submit",t=>this.onButtonClick(t)),this.addEventListener("keyup",t=>this.onKeyUp(t))}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscriptions.auth),this._store.isMastodonAuthorized$.unsubscribe(this._subscriptions.mastodon),this.removeEventListener("submit",t=>this.onButtonClick(t)),this.removeEventListener("keyup",t=>this.onKeyUp(t))}}class w extends HTMLElement{get key(){return this.getAttribute("data-key")}get label(){return this.getAttribute("data-label")}get input(){return this.querySelector("input")}get inputType(){switch(this.type){case e.TEXT:case e.LIST:case e.BOOLEAN:default:return"text";case e.FILE:return"file"}}get value(){const t=this.getAttribute("data-value")||"";switch(this.type){case e.TEXT:default:return t;case e.LIST:return t.includes(",")?t.replaceAll(" ","").split(","):[t.trim()];case e.BOOLEAN:return["true","yes"].includes(t.toLowerCase());case e.FILE:return`https://images.alexbilson.dev/${t.substring(12,t.length)}`}}set value(t){this.setAttribute("data-value",String(t)),this.type!==e.FILE&&(this.input.value=String(t))}get required(){return!!this.getAttribute("data-required")}get readonly(){return!!this.getAttribute("data-readonly")}set readonly(t){this.setAttribute("data-readonly",String(t)),this.input.readOnly=t}get type(){const t=this.getAttribute("data-type");return t?e[t.toUpperCase()]:e.TEXT}getModel(){return{key:this.key,name:this.label,value:this.value,required:this.required,type:this.type}}onEdit(t){t.preventDefault(),this.value=t.target.value}render(){return`\n\t\t\t<li class="panel-option spread-btwn${this.required?" required":""}">\n\t\t\t\t<label for="${this.label}">${this.label}</label>\n\t\t\t\t<span>${this.required?"(required)":""}\n\t\t\t\t<input type="${this.inputType}"\n\t\t\t\t\t${this.label?`name="${this.label}"`:""}\n\t\t\t\t\t${this.value?`value="${this.value}"`:""}\n\t\t\t\t\t${this.readonly?"disabled":""}\n\t\t\t\t\t${this.type==e.FILE?'accept="image/*"':""}\n\t\t\t\t/></span>\n\t\t\t</li>\n\t\t`}constructor(){super(),this._store=void 0,this._subscription=void 0}connectedCallback(){const t=c({instance:a.STORE,callback:t=>this._store=t});this.dispatchEvent(t),this._subscription=this._store.isAuthorized$.subscribe("chaos-panel-option",t=>{this.innerHTML=t?this.render():"<span hidden>Not authorized to view panel option</span>"}),this.addEventListener("input",t=>this.onEdit(t))}disconnectedCallback(){this._store.isAuthorized$.unsubscribe(this._subscription),this.removeEventListener("input",t=>this.onEdit(t))}}class L extends HTMLElement{get searchContainer(){return this.querySelector("ul#container")}get sitesContainer(){return this.querySelector("#sites")}get queryElement(){return this.querySelector("input#q")}get errorMsg(){var t;return(null==(t=this.querySelector("#error-message"))?void 0:t.innerText)||""}set errorMsg(t){this.querySelector("#error-message").innerText=t}constructor(){super(),this._search=void 0,this.render()}getQueryFromParams(){return new URLSearchParams(window.location.search).get("q")}setSearchResults(t){var e=t.map(t=>{var e=document.createElement("template");return e.innerHTML=`\n\t\t\t<li><p class="spread">\n\t\t\t\t<span>${t.author}</span>\n\t\t\t\t<a href="${t.id}">${t.title}</a>\n\t\t\t\t</p>\n\t\t\t\t${t.content}\n\t\t\t</li>`,e.content.cloneNode(!0)});this.searchContainer.replaceChildren(...e)}getSites(){this._search.sites().then(t=>{if(t.success){var e=t.content.map(t=>{var e=document.createElement("template");return e.innerHTML=`\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>${t.author}</td>\n\t\t\t\t\t\t<td>${t.url}</td>\n\t\t\t\t\t\t<td>${t.pages}</td>\n\t\t\t\t\t</tr>`,e.content.cloneNode(!0)});this.sitesContainer.replaceChildren(...e)}})}queryBy(t){t&&this._search.query(t).then(e=>{e.success&&(this.setSearchResults(e.content),this.updateParams(t)),this.errorMsg=e.message},t=>this.errorMsg=t.toString())}updateParams(t){const e=new URLSearchParams;e.set("q",t);const s=`${window.location.origin}${window.location.pathname}?${e.toString()}`;window.history.pushState({path:s},"",s)}onSubmit(t){t.preventDefault(),this.queryBy(this.queryElement.value)}render(){this.innerHTML='\n\t\t<div class="wrapper flow-s">\n\t\t\t<form class="spread">\n\t\t\t\t<input type="text" id="q" name="q" placeholder="Search my index..."></input>\n\t\t\t\t<button type="submit">Search</button>\n\t\t\t</form>\n\n\t\t\t<p id="error-message"></p>\n\n\t\t\t<details>\n\t\t\t\t<summary>Index Built From</summary>\n\t\t\t\t<table>\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t\t<th>URL</th>\n\t\t\t\t\t\t\t<th>Page Count</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody id="sites"></tbody>\n\t\t\t\t</table>\n\t\t\t</details>\n\n\t\t\t<ul id="container" class="fill-list flow-s" role="list"></ul>\n\t\t</div>\n\t\t'}connectedCallback(){const t=c({instance:a.SEARCH,callback:t=>this._search=t});this.dispatchEvent(t),this.addEventListener("submit",t=>this.onSubmit(t),!1);const e=this.getQueryFromParams();e&&(this.queryElement.value=e,this.queryBy(e)),this.getSites()}disconnectedCallback(){this.removeEventListener("submit",t=>this.onSubmit(t),!1)}}document.addEventListener("chaos-request",t=>{const e=t.detail,s=h.get(e.instance);e.callback(s)}),customElements.define("chaos-login",u),customElements.define("chaos-logout",d),customElements.define("chaos-masto-login",p),customElements.define("chaos-masto-logout",m),customElements.define("chaos-filter",g),customElements.define("chaos-resizer",b),customElements.define("chaos-on-this-day",v),customElements.define("chaos-color-switch",f),customElements.define("chaos-panel",y),customElements.define("chaos-panel-option",w),customElements.define("chaos-search",L);
//# sourceMappingURL=index.modern.js.map
