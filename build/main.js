!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("ReduxManagerLib",[],n):"object"==typeof exports?exports.ReduxManagerLib=n():t.ReduxManagerLib=n()}(window,function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=1)}([function(t,n){},function(t,n,e){"use strict";function r(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]}function o(t){return function n(e){return 0===arguments.length||r(e)?n:t.apply(this,arguments)}}e.r(n);function u(t){return function n(e,u){switch(arguments.length){case 0:return n;case 1:return r(e)?n:o(function(n){return t(e,n)});default:return r(e)&&r(u)?n:r(e)?o(function(n){return t(n,u)}):r(u)?o(function(n){return t(e,n)}):t(e,u)}}}function c(t,n){switch(t){case 0:return function(){return n.apply(this,arguments)};case 1:return function(t){return n.apply(this,arguments)};case 2:return function(t,e){return n.apply(this,arguments)};case 3:return function(t,e,r){return n.apply(this,arguments)};case 4:return function(t,e,r,o){return n.apply(this,arguments)};case 5:return function(t,e,r,o,u){return n.apply(this,arguments)};case 6:return function(t,e,r,o,u,c){return n.apply(this,arguments)};case 7:return function(t,e,r,o,u,c,i){return n.apply(this,arguments)};case 8:return function(t,e,r,o,u,c,i,a){return n.apply(this,arguments)};case 9:return function(t,e,r,o,u,c,i,a,f){return n.apply(this,arguments)};case 10:return function(t,e,r,o,u,c,i,a,f,l){return n.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}}function i(t,n,e){return function(){for(var o=[],u=0,a=t,f=0;f<n.length||u<arguments.length;){var l;f<n.length&&(!r(n[f])||u>=arguments.length)?l=n[f]:(l=arguments[u],u+=1),o[f]=l,r(l)||(a-=1),f+=1}return a<=0?e.apply(this,o):c(a,i(t,o,e))}}var a=u(function(t,n){return 1===t?o(n):c(t,i(t,[],n))});var f=Array.isArray||function(t){return null!=t&&t.length>=0&&"[object Array]"===Object.prototype.toString.call(t)};function l(t){return"function"==typeof t["@@transducer/step"]}function p(t,n,e){return function(){if(0===arguments.length)return e();var r=Array.prototype.slice.call(arguments,0),o=r.pop();if(!f(o)){for(var u=0;u<t.length;){if("function"==typeof o[t[u]])return o[t[u]].apply(o,r);u+=1}if(l(o))return n.apply(null,r)(o)}return e.apply(this,arguments)}}var s={init:function(){return this.xf["@@transducer/init"]()},result:function(t){return this.xf["@@transducer/result"](t)}};function y(t,n){for(var e=0,r=n.length,o=Array(r);e<r;)o[e]=t(n[e]),e+=1;return o}function d(t){return"[object String]"===Object.prototype.toString.call(t)}var b=o(function(t){return!!f(t)||!!t&&("object"==typeof t&&(!d(t)&&(1===t.nodeType?!!t.length:0===t.length||t.length>0&&(t.hasOwnProperty(0)&&t.hasOwnProperty(t.length-1)))))}),E=function(){function t(t){this.f=t}return t.prototype["@@transducer/init"]=function(){throw new Error("init not implemented on XWrap")},t.prototype["@@transducer/result"]=function(t){return t},t.prototype["@@transducer/step"]=function(t,n){return this.f(t,n)},t}();function h(t){return new E(t)}var S=u(function(t,n){return c(t.length,function(){return t.apply(n,arguments)})});function m(t,n,e){for(var r=e.next();!r.done;){if((n=t["@@transducer/step"](n,r.value))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}r=e.next()}return t["@@transducer/result"](n)}function v(t,n,e,r){return t["@@transducer/result"](e[r](S(t["@@transducer/step"],t),n))}var g="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";function w(t,n,e){if("function"==typeof t&&(t=h(t)),b(e))return function(t,n,e){for(var r=0,o=e.length;r<o;){if((n=t["@@transducer/step"](n,e[r]))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}r+=1}return t["@@transducer/result"](n)}(t,n,e);if("function"==typeof e["fantasy-land/reduce"])return v(t,n,e,"fantasy-land/reduce");if(null!=e[g])return m(t,n,e[g]());if("function"==typeof e.next)return m(t,n,e);if("function"==typeof e.reduce)return v(t,n,e,"reduce");throw new TypeError("reduce: list must be array or iterable")}var A=function(){function t(t,n){this.xf=n,this.f=t}return t.prototype["@@transducer/init"]=s.init,t.prototype["@@transducer/result"]=s.result,t.prototype["@@transducer/step"]=function(t,n){return this.xf["@@transducer/step"](t,this.f(n))},t}(),j=u(function(t,n){return new A(t,n)});function O(t,n){return Object.prototype.hasOwnProperty.call(n,t)}var _=Object.prototype.toString,T=function(){return"[object Arguments]"===_.call(arguments)?function(t){return"[object Arguments]"===_.call(t)}:function(t){return O("callee",t)}},C=!{toString:null}.propertyIsEnumerable("toString"),I=["constructor","valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],U=function(){return arguments.propertyIsEnumerable("length")}(),R=function(t,n){for(var e=0;e<t.length;){if(t[e]===n)return!0;e+=1}return!1},x=o("function"!=typeof Object.keys||U?function(t){if(Object(t)!==t)return[];var n,e,r=[],o=U&&T(t);for(n in t)!O(n,t)||o&&"length"===n||(r[r.length]=n);if(C)for(e=I.length-1;e>=0;)O(n=I[e],t)&&!R(r,n)&&(r[r.length]=n),e-=1;return r}:function(t){return Object(t)!==t?[]:Object.keys(t)}),D=u(p(["fantasy-land/map","map"],j,function(t,n){switch(Object.prototype.toString.call(n)){case"[object Function]":return a(n.length,function(){return t.call(this,n.apply(this,arguments))});case"[object Object]":return w(function(e,r){return e[r]=t(n[r]),e},{},x(n));default:return y(t,n)}})),L=u(function(t,n){for(var e=n,r=0;r<t.length;){if(null==e)return;e=e[t[r]],r+=1}return e}),P=u(function(t,n){return L([t],n)});Number.isInteger;var F=o(function(t){return a(t.length,t)});function M(t){return new RegExp(t.source,(t.global?"g":"")+(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.sticky?"y":"")+(t.unicode?"u":""))}var k=o(function(t){return null===t?"Null":void 0===t?"Undefined":Object.prototype.toString.call(t).slice(8,-1)});function H(t,n,e,r){var o=function(o){for(var u=n.length,c=0;c<u;){if(t===n[c])return e[c];c+=1}for(var i in n[c+1]=t,e[c+1]=o,t)o[i]=r?H(t[i],n,e,!0):t[i];return o};switch(k(t)){case"Object":return o({});case"Array":return o([]);case"Date":return new Date(t.valueOf());case"RegExp":return M(t);default:return t}}var N=o(function(t){return null!=t&&"function"==typeof t.clone?t.clone():H(t,[],[],!0)});var G=function(t){return(t<10?"0":"")+t};Date.prototype.toISOString;function q(t){return t}var z="function"==typeof Object.assign?Object.assign:function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(t),e=1,r=arguments.length;e<r;){var o=arguments[e];if(null!=o)for(var u in o)O(u,o)&&(n[u]=o[u]);e+=1}return n},K=u(function(t,n){var e={};return e[t]=n,e});Array,String,Object;var W=u(function(t,n){for(var e={},r={},o=0,u=t.length;o<u;)r[t[o]]=1,o+=1;for(var c in n)r.hasOwnProperty(c)||(e[c]=n[c]);return e});var X="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff";String.prototype.trim;function B(t){return(B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function J(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function Q(t,n){return!n||"object"!==B(n)&&"function"!=typeof n?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):n}function V(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&$(t,n)}function Y(t){var n="function"==typeof Map?new Map:void 0;return(Y=function(t){if(null===t||!function(t){return-1!==Function.toString.call(t).indexOf("[native code]")}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e)}function e(){return Z(t,arguments,tt(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),$(e,t)})(t)}function Z(t,n,e){return(Z=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct:function(t,n,e){var r=[null];r.push.apply(r,n);var o=new(Function.bind.apply(t,r));return e&&$(o,e.prototype),o}).apply(null,arguments)}function $(t,n){return($=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function tt(t){return(tt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var nt=function(t){function n(t){var e;return J(this,n),(e=Q(this,tt(n).call(this,t))).name="ModuleInitializationTypeError",e}return V(n,Y(Error)),n}(),et=function(t){function n(t){var e;return J(this,n),(e=Q(this,tt(n).call(this,t))).name="UnexpectedRuntimeError",e}return V(n,Y(Error)),n}();function rt(t,n){var e=new window.CustomEvent("unexpectedruntimeerror",{detail:{error:new et(t),details:n}});document.dispatchEvent(e)}function ot(){document.addEventListener("unexpectedruntimeerror",function(t){console.log(t.detail),console.log(t.detail.error)})}function ut(t){return(ut="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ct(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{additionalContains:"functions"};if(!at(t))throw new nt("Expected an object or undefined, instead received ".concat(ut(t),": ").concat(t));if(it(t)&&!ft(t.customErrorHandler))throw new nt("Expected an 'customErrorHandler' to be a function, instead received ".concat(ut(t.customErrorHandler),": ").concat(t.customErrorHandler));if(it(t)){if(!at(t.additional))throw new nt("Expected 'options.additional' to be an object, instead received ".concat(ut(t.additional),": ").concat(t.additional));Object.values(t.additional||{}).forEach(function(t){var e="strings"===n.additionalContains?"string":"function";if(ut(t)!==e)throw new nt("Expected 'options.additional' to be an object containing functions, instead received  ".concat(ut(t),": ").concat(t))})}}function it(t){return"object"===ut(t)&&!Array.isArray(t)&&t}function at(t){return void 0===t||it(t)}function ft(t){return void 0===t||"function"==typeof t}function lt(t){return"string"==typeof t&&""!==t}function pt(t){return"function"==typeof t}function st(t){return function(t){if(Array.isArray(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function yt(t){return(yt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var dt=function(t,n){if(null===t)throw new nt("bindSelectorsToState expects a string or function as its 0th argument, instead it received ".concat(yt(t),": ").concat(t+""));if(!lt(t)&&!pt(t))throw new nt("bindSelectorsToState expects a string or function as its 0th argument, instead it received ".concat(yt(t),": ").concat(t+""));if(console.log("subStateGetter",t),lt(t)?t=P(t):pt(t)&&(t=t),!it(n))throw new nt("bindSelectorsToState expects an object as its 0th argument, instead it received ".concat(yt(t),": ").concat(t+""));var e=D(function(n){var r=yt(n);if("undefined"===r)throw new TypeError("Selector is of type 'undefined'");return"function"===r?function(n){return function(){for(var e=arguments.length,r=new Array(e),o=0;o<e;o++)r[o]=arguments[o];var u=t(r[0]),c=r.slice(1)||[],i=[u].concat(st(c));return n.apply(void 0,st(i))}}(n):"object"===r?e(n):void 0});return e(n)};function bt(t,n){rt(t,n)}function Et(t){return(Et="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var ht=function(t,n){if("string"!=typeof t||""===t)throw new nt("'modelName' is required to be a non-empty string, instead got ".concat(Et(t)," : ").concat(t));ct(n,{additionalContains:"strings"}),n=n||{};var e=D(function(n){return"".concat(t,"/").concat(n)})({CREATE:"CREATE",CREATE__SUCCESS:"CREATE__SUCCESS",CREATE__FAILURE:"CREATE__FAILURE",READ:"READ",READ__SUCCESS:"READ__SUCCESS",READ__FAILURE:"READ__FAILURE",UPDATE:"UPDATE",UPDATE__SUCCESS:"UPDATE__SUCCESS",UPDATE__FAILURE:"UPDATE__FAILURE",DELETE:"DELETE",DELETE__SUCCESS:"DELETE__SUCCESS",DELETE__FAILURE:"DELETE__FAILURE"});return Object.assign(e,n.additional||{})};function St(t){return(St="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var mt=F(function(t,n,e,r){var o=r.toUpperCase(),u=o+"__SUCCESS",c=o+"__FAILURE";if([o,u,c].forEach(function(n){if(!t[n])throw new TypeError('"'.concat(n,'" is not found in the actionTypes object'))}),!n[r])throw new TypeError('"'.concat(r,'" is not found in the restApi object'));return function(i){return function(a){try{a({type:t[o],payload:i});var f=n[r](i);return function(t){if("object"!==St(t)||"function"!=typeof t.then)throw new TypeError("Expected a promise, but instead received ".concat(St(t)," : ").concat(t,". Check if your rest api function returns a promise."))}(f),f.then(function(n){a({type:t[u],payload:n})}).catch(function(n){a({type:t[c],error:n})})}catch(n){e(n,{crudMethod:r,payload:i,actionTyp:t[o],actionTypeKey:o})}}}});var vt=function(t,n,e){if(!t)throw new nt("'actionTypes' is required as an argument");if(!n)throw new nt("'restApiInstance' is required as an argument");ct(e=e||{});var r=e&&e.customErrorHandler||bt,o=N(t),u=N(n),c=mt(o,u,r),i={create:c("create"),read:c("read"),update:c("update"),delete:c("delete")};return Object.assign(i,e.additional||{})};function gt(t){return(gt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function wt(t){return function(t){if(Array.isArray(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function At(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{},r=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.forEach(function(n){jt(t,n,e[n])})}return t}function jt(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var Ot={IDLE:"IDLE",LOADING:"LOADING",SUCCESS:"SUCCESS",FAILURE:"FAILURE"};var _t=function(t,n){var e;!function(t){if(!it(t))throw new nt("'actionTypes' must be a valid ActionTypes object");["CREATE","READ","UPDATE","DELETE"].reduce(function(t,n){return wt(t).concat([n,n+"__SUCCESS",n+"__FAILURE"])},[]).forEach(function(n){if(!t[n])throw new nt('"'.concat(n,'" is not found in actionTypes'))})}(t),ct(n),function(t){if(it(t)&&t.hasOwnProperty("defaultState")&&!it(t.defaultState))throw new TypeError("Expected options.defaultState to be an object, instead received: ".concat(gt(t.defaultState),": ").concat(t.defaultState))}(n);var r=(n=n||{})&&n.customErrorHandler||Rt,o=Object.assign((jt(e={},t.CREATE,Tt("create")),jt(e,t.READ,Tt("read")),jt(e,t.UPDATE,Tt("update")),jt(e,t.DELETE,Tt("delete")),jt(e,t.CREATE__SUCCESS,Ct("create")),jt(e,t.READ__SUCCESS,Ct("read")),jt(e,t.UPDATE__SUCCESS,Ct("update")),jt(e,t.DELETE__SUCCESS,Ut),jt(e,t.CREATE__FAILURE,It("create")),jt(e,t.READ__FAILURE,It("read")),jt(e,t.UPDATE__FAILURE,It("update")),jt(e,t.DELETE__FAILURE,It("delete")),e),n.additional||{}),u=n&&n.defaultState||{};return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:At({byId:{},error:null,create:Ot.IDLE,read:Ot.IDLE,update:Ot.IDLE,delete:Ot.IDLE},u),n=arguments.length>1?arguments[1]:void 0;try{return function(t){if(!at(t))throw new TypeError("'state' must be an object or undefined. Instead received: "+t)}(t),function(t){if(!it(t)||!t.type)throw new TypeError("'not a valid action'")}(n),o[n.type]?o[n.type](t,n):t}catch(e){return r(e,{state:t,action:n})}}};function Tt(t){return function(n,e){var r;return At({},n,(jt(r={},t,Ot.LOADING),jt(r,"error",null),r))}}function Ct(t){return function(n,e){var r;return At({},n,(jt(r={byId:At({},n.byId,e.payload.byId)},t,Ot.SUCCESS),jt(r,"error",null),r))}}function It(t){return function(n,e){var r;if(!e.error)throw new TypeError("failure action needs to have an 'error' attribute");return At({},n,(jt(r={},t,Ot.FAILURE),jt(r,"error",e.error),r))}}function Ut(t,n){var e=Array.isArray(n.payload.ids)?n.payload.ids:[n.payload.id];return At({},t,{byId:W(e,t.byId),delete:Ot.SUCCESS,error:null})}function Rt(t,n){var e=n.state,r=n.action;try{return rt(t,{state:e,action:r}),At({},e,{error:t})}catch(t){rt(t,{state:e,action:r})}}e(0);function xt(t){return(xt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var Dt=function(t){ct(t);var n=t&&t.customErrorHandler||bt,e=t&&t.additional||{};return Object.assign({getAll:function(t,e){try{return Lt(t),Mt(e),"map"===e?t.byId:Object.values(t.byId)}catch(r){return n(r,{state:t,format:e,selector:"getAll"}),"map"===e?{}:[]}},getOne:function(t,e){try{return Lt(t),Ft(e),t.byId[e]}catch(r){return n(r,{state:t,id:e,selector:"getOne"}),{}}},getSome:function(t,e,r){try{return Lt(t),function(t){if(!Array.isArray(t)||0===t.length)throw new TypeError("Expected ids to be a non-empty array of strings or a numbers, instead receive ".concat(xt(t)," ").concat(t));t.forEach(Ft)}(e),Mt(r),"map"===r?e.reduce(function(n,e){return Object.assign(n,function(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}({},e,t.byId[e]))},{}):e.map(function(n){return t.byId[n]})}catch(o){return n(o,{state:t,ids:e,format:r,selector:"getSome"}),"map"===r?{}:[]}},getError:function(t){try{return Lt(t),t.error}catch(e){return n(e,{state:t,selector:"getSome"}),{}}},getOperationStates:function(t){try{return Lt(t),{create:t.create,read:t.read,update:t.update,delete:t.delete}}catch(e){return n(e,{state:t,selector:"getOperationStates"}),{}}}},e)};function Lt(t){if(!Pt(t)||0===Object.keys(t).length)throw new TypeError("Expected state to be a valid State object, instead received ".concat(xt(t),": ").concat(""+t));if(!Pt(t.byId))throw new TypeError("Expected state to have a 'byId' property, instead received ".concat(xt(t),": ").concat(t));["create","read","update","delete"].forEach(function(n){if("string"!=typeof t[n])throw new TypeError("Expected state to have an '".concat(n,"' property to be a string, instead received ").concat(xt(t),": ").concat(t))})}function Pt(t){return"object"===xt(t)&&!Array.isArray(t)&&t}function Ft(t){if(!function(t){if(""===t)return!1;if("string"!=typeof t&&"number"!=typeof t)return!1;return!0}(t))throw new TypeError("Expected id to be a non-empty string or a number, instead receive ".concat(xt(t)," ").concat(t))}function Mt(t){if(void 0!==t&&"map"!==t&&"array"!==t)throw new TypeError('Expected format to be "array" or "map", instead receive '.concat(xt(t)," ").concat(t))}e.d(n,"actionTypesFactory",function(){return ht}),e.d(n,"actionCreatorsFactory",function(){return vt}),e.d(n,"reducerFactory",function(){return _t}),e.d(n,"selectorsFactory",function(){return Dt}),e.d(n,"attachAnUnexpectedErrorLogger",function(){return ot}),e.d(n,"dispatchAnUnexpectedErrorEvent",function(){return rt}),e.d(n,"ModuleInitializationTypeError",function(){return nt}),e.d(n,"bindSelectorsToState",function(){return dt}),e.d(n,"isOptionalObject",function(){return at}),e.d(n,"isObject",function(){return it}),e.d(n,"isOptionalFunction",function(){return ft})}])});