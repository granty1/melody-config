(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0a73e32c"],{"3d20":function(t,e,s){},b864:function(t,e,s){"use strict";var i=s("3d20"),o=s.n(i);o.a},f3f8:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("el-row",{staticClass:"row-bg",attrs:{type:"flex",justify:"space-around"}},[s("el-col",{staticClass:"container",attrs:{span:11}},[s("el-card",{staticClass:"box-card item"},[s("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[s("span",[t._v("预览melody.json")])]),s("json-viewer",{attrs:{value:t.melodyJSON,"expand-depth":2,theme:"my-awesome-json-theme"}})],1)],1),s("el-col",{staticClass:"container",attrs:{span:11}},[s("el-card",{staticClass:"box-card item"},[s("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[s("span",[t._v("导入melody.json")])]),s("div",{staticClass:"center"},[s("el-upload",{attrs:{drag:"",multiple:!1,"show-file-list":!1,"auto-upload":!1,accept:".json",action:"","on-change":t.loadJsonFile}},[s("i",{staticClass:"el-icon-upload"}),s("div",{staticClass:"el-upload__text"},[t._v("将文件拖到此处，或"),s("em",[t._v("点击上传")])])])],1)])],1)],1)],1)},o=[],a=s("faef"),l=s("ffad"),n={name:"Import",data(){return{melodyJSON:""}},methods:{loadJsonFile(t){const e=new FileReader;e.readAsText(t.raw),e.onload=()=>{this.$ls.get("config")?this.$confirm("导入会覆盖已存在的配置，是否继续？").then(()=>{this.melodyJSON=JSON.parse(e.result),this.parseHostInJSON(this.melodyJSON),this.copyEndCfg(this.melodyJSON),this.$store.commit("updateServiceConfig",this.melodyJSON)}):(this.melodyJSON=JSON.parse(e.result),this.$store.commit("updateServiceConfig",this.melodyJSON))}},copyEndCfg(t){let e=t.endpoints,s=new a["a"],i=new l["a"];for(let o in e){let t=e[o];this.setExtra(s,t);let a=t.backends;for(let e in a){let t=a[e];this.setExtra(i,t)}}},setExtra(t,e){for(let s in t)if("extra_config"===s){void 0===e["extra_config"]&&(e["extra_config"]={});for(let i in t[s]){let o=t[s][i];void 0===e["extra_config"][i]&&(e["extra_config"][i]=o)}}else void 0===e[s]&&(e[s]=t[s])},parseHostInJSON(t){let e=t.endpoints,s=[];for(let i in e){let t=e[i];for(let e in t)if("backends"===e){let i=t[e];for(let t in i){let e=i[t];for(let t in e.host){let i="";void 0===e.sd||""===e.sd?(i="static - "+e.host[t],e["sd"]="static"):i=e.sd+" - "+e.host[t],-1===s.indexOf(i)&&s.push(i)}}}}this.$store.commit("setAvailableHosts",s)}},mounted(){this.$ls.get("config")?this.melodyJSON=this.$ls.get("config"):this.melodyJSON="暂无配置"}},r=n,d=(s("b864"),s("2877")),c=Object(d["a"])(r,i,o,!1,null,null,null);e["default"]=c.exports},faef:function(t,e,s){"use strict";class i{constructor(){this.endpoint="/new-endpoint",this.method="GET",this.output_encoding="JSON",this.extra_config={melody_ratelimit_router:{},melody_proxy:{},melody_jose_validator:{},melody_jose_signer:{},melody_alert:{}},this.backends=[]}}e["a"]=i},ffad:function(t,e,s){"use strict";class i{constructor(){this.url_pattern="/new-point",this.method="GET",this.extra_config={melody_ratelimit_proxy:{},melody_http:{}},this.host=[],this.encoding="json",this.blacklist=[],this.whitelist=[],this.mapping={},this.is_collection=!1,this.disable_host_sanitize=!1}}e["a"]=i}}]);
//# sourceMappingURL=chunk-0a73e32c.f527b674.js.map