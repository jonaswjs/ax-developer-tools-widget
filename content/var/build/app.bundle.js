webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';__webpack_require__(16);
	var _laxar = __webpack_require__(18);
	
	var _laxarReactAdapter = __webpack_require__(62);var reactAdapter = _interopRequireWildcard(_laxarReactAdapter);
	
	var _artifactsFlowMainThemeDefault = __webpack_require__(243);var _artifactsFlowMainThemeDefault2 = _interopRequireDefault(_artifactsFlowMainThemeDefault);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}
	
	var config = {
	   name: 'LaxarJS Developer Tools',
	   router: {
	      query: {
	         enabled: true },
	
	      pagejs: {
	         hashbang: true } },
	
	
	   flow: {
	      name: 'main' },
	
	   logging: {
	      threshold: 'TRACE' },
	
	   theme: 'default',
	   tooling: {
	      enabled: true } };
	
	
	
	(0, _laxar.bootstrap)(document.querySelector('[data-ax-page]'), {
	   widgetAdapters: [reactAdapter],
	   configuration: config,
	   artifacts: _artifactsFlowMainThemeDefault2.default });

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.technology = undefined;
	exports.bootstrap = bootstrap;
	
	var _reactDom = __webpack_require__(63);
	
	var ReactDom = _interopRequireWildcard(_reactDom);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Copyright 2016 aixigo AG
	                                                                                                                                                                                                     * Released under the MIT license.
	                                                                                                                                                                                                     * http://laxarjs.org/license
	                                                                                                                                                                                                     */
	
	/**
	 * Implements the LaxarJS adapter API for the integration technology "react":
	 * https://github.com/LaxarJS/laxar/blob/master/docs/manuals/adapters.md
	 *
	 * @module laxar-react-adapter
	 */
	
	var noOp = function noOp() {};
	
	var technology = exports.technology = 'react';
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function bootstrap(_ref, _ref2) {
	   var widgets = _ref.widgets;
	   var widgetLoader = _ref2.widgetLoader;
	   var adapterErrors = widgetLoader.adapterErrors;
	
	   var widgetModules = {};
	   var activitySet = {};
	   widgets.forEach(function (_ref3) {
	      var descriptor = _ref3.descriptor,
	          module = _ref3.module;
	
	      widgetModules[descriptor.name] = module;
	      if (descriptor.integration.type === 'activity') {
	         activitySet[descriptor.name] = true;
	      }
	   });
	
	   return {
	      create: create,
	      technology: technology
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function create(_ref4) {
	      var widgetName = _ref4.widgetName,
	          anchorElement = _ref4.anchorElement,
	          services = _ref4.services,
	          onBeforeControllerCreation = _ref4.onBeforeControllerCreation;
	
	
	      var domAttached = false;
	      var onDomAvailable = null;
	      createController();
	      return {
	         domAttachTo: domAttachTo,
	         domDetach: domDetach
	      };
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function createController() {
	         // backwards compatibility with old-style AMD widgets:
	         var module = widgetModules[widgetName].default || widgetModules[widgetName];
	         if (!module) {
	            throw adapterErrors.unknownWidget({ technology: technology, widgetName: widgetName });
	         }
	
	         var reactServices = {
	            axReactRender: function axReactRender(componentInstance) {
	               if (domAttached) {
	                  ReactDom.render(componentInstance, anchorElement);
	               }
	            }
	         };
	
	         var injectionsByName = {};
	         var injections = (module.injections || []).map(function (injection) {
	            var value = reactServices[injection] || services[injection];
	            if (value === undefined) {
	               throw adapterErrors.unknownInjection({ technology: technology, injection: injection, widgetName: widgetName });
	            }
	            if (injection === 'axReactRender' && activitySet[widgetName]) {
	               throw adapterErrors.activityAccessingDom({ technology: technology, injection: injection, widgetName: widgetName });
	            }
	            injectionsByName[injection] = value;
	            return value;
	         });
	         onBeforeControllerCreation(injectionsByName);
	
	         var _ref5 = module.create.apply(module, _toConsumableArray(injections)) || {};
	
	         var _ref5$onDomAvailable = _ref5.onDomAvailable;
	         onDomAvailable = _ref5$onDomAvailable === undefined ? noOp : _ref5$onDomAvailable;
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function domAttachTo(areaElement) {
	         domAttached = true;
	         areaElement.appendChild(anchorElement);
	         onDomAvailable();
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function domDetach() {
	         domAttached = false;
	         var parent = anchorElement.parentNode;
	         if (parent) {
	            parent.removeChild(anchorElement);
	         }
	      }
	   }
	}

/***/ },
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	/* global __resourceQuery */
	module.exports = __webpack_require__( 244 );


/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	   aliases: {
	      themes: { "default.theme": 0, "default": 0 },
	      layouts: { tools: 0 },
	      controls: {},
	      flows: { main: 0 },
	      pages: { tools: 0 },
	      widgets: { "host-connector-widget": 0, "events-display-widget": 1 }
	   },
	   flows: [
	      {
	         descriptor: { name: "main" },
	         definition: {
	            places: {
	               entry: { patterns: [ "/" ], redirectTo: "tools", defaultParameters: {} },
	               tools: {
	                  patterns: [ "/tools/:tabId", "/tools" ],
	                  page: "tools",
	                  defaultParameters: {}
	               }
	            },
	            redirectOn: {}
	         }
	      }
	   ],
	   themes: [
	      {
	         descriptor: { name: "default.theme" },
	         assets: {
	            "css/theme.css": {
	               url: __webpack_require__( 245 )
	            }
	         }
	      }
	   ],
	   pages: [
	      {
	         descriptor: { name: "tools" },
	         definition: {
	            layout: "tools",
	            areas: {
	               activities: [
	                  {
	                     widget: "host-connector-widget",
	                     features: {
	                        events: { stream: "eventBusItems" },
	                        log: { stream: "logItems" },
	                        pageInfo: { resource: "pageInfo" },
	                        grid: { resource: "gridSettings" },
	                        laxarApplication: { flag: "isLaxarApplication" },
	                        development: { liveReload: true }
	                     },
	                     enabled: true,
	                     id: "hostConnectorWidget-id0"
	                  }
	               ],
	               tabsevents: [
	                  {
	                     widget: "events-display-widget",
	                     features: {
	                        events: { stream: "eventBusItems", bufferSize: 5000 },
	                        filter: {
	                           resource: "eventFilter",
	                           hidePatterns: [ "visibility", "i18n" ],
	                           hideSources: [],
	                           hideInteractions: [ "subscribe", "unsubscribe" ]
	                        }
	                     },
	                     enabled: true,
	                     id: "eventsDisplayWidget-id1"
	                  }
	               ]
	            }
	         }
	      }
	   ],
	   layouts: [
	      {
	         descriptor: { name: "tools" },
	         assets: {
	            "default.theme": {
	               "tools.html": {
	                  content: __webpack_require__( 261 )
	               },
	               "css/tools.css": {
	                  url: __webpack_require__( 262 )
	               }
	            }
	         }
	      }
	   ],
	   widgets: [
	      {
	         descriptor: {
	            name: "host-connector-widget",
	            description: "Connects the contents of the development window to the AxDeveloperToolsWidget",
	            integration: { technology: "plain", type: "widget" },
	            features: {
	               $schema: "http://json-schema.org/draft-04/schema#",
	               type: "object",
	               properties: {
	                  events: {
	                     type: "object",
	                     description: "Publish a stream of event bus activity through wrapper events.",
	                     properties: {
	                        stream: {
	                           type: "string",
	                           description: "The topic through which to publish event items.",
	                           "default": null
	                        }
	                     },
	                     additionalProperties: false
	                  },
	                  log: {
	                     type: "object",
	                     description: "Publish a stream of log items through wrapper events.",
	                     properties: {
	                        stream: {
	                           type: "string",
	                           description: "The topic through which to publish log items.",
	                           "default": null
	                        }
	                     },
	                     additionalProperties: false
	                  },
	                  pageInfo: {
	                     type: "object",
	                     description: "Publish the current page for inspection.",
	                     properties: {
	                        resource: {
	                           type: "string",
	                           description: "The topic through which to publish the current page.",
	                           "default": null,
	                           format: "topic",
	                           axRole: "outlet"
	                        }
	                     },
	                     additionalProperties: false
	                  },
	                  grid: {
	                     type: "object",
	                     description: "Publish application-specific grid configuration set by the host application.",
	                     properties: {
	                        resource: {
	                           type: "string",
	                           description: "A resource through which to publish grid settings.",
	                           "default": null,
	                           format: "topic",
	                           axRole: "outlet"
	                        }
	                     },
	                     additionalProperties: false
	                  },
	                  development: {
	                     type: "object",
	                     properties: { liveReload: { type: "boolean", "default": true } },
	                     additionalProperties: false
	                  },
	                  laxarApplication: {
	                     type: "object",
	                     description: "Publish the state of the inspected window. True if a LaxarJS application is running.",
	                     required: [ "flag" ],
	                     properties: {
	                        flag: {
	                           type: "string",
	                           format: "flag-topic",
	                           description: "The topic through which to publish the current state."
	                        }
	                     },
	                     additionalProperties: false
	                  }
	               },
	               additionalProperties: false
	            },
	            controls: [],
	            compatibility: []
	         },
	         module: __webpack_require__( 265 ),
	         assets: { "default.theme": {} }
	      },
	      {
	         descriptor: {
	            name: "events-display-widget",
	            description: "Displays events from the event bus.",
	            integration: { technology: "react", type: "widget" },
	            features: {
	               $schema: "http://json-schema.org/draft-04/schema#",
	               type: "object",
	               requires: [ "events" ],
	               properties: {
	                  events: {
	                     type: "object",
	                     description: "Display event bus activity received through wrapper events.",
	                     requires: [ "stream" ],
	                     properties: {
	                        stream: {
	                           type: "string",
	                           description: "The event topic through which to gather events."
	                        },
	                        bufferSize: {
	                           type: "integer",
	                           description: "Maximum number of event items to keep in memory.",
	                           "default": 5000
	                        }
	                     },
	                     additionalProperties: false
	                  },
	                  filter: {
	                     type: "object",
	                     description: "Controls filter settings",
	                     properties: {
	                        hidePatterns: {
	                           type: "array",
	                           description: "Controls pattern-related default filter settings",
	                           "default": [ "visibility", "i18n" ]
	                        },
	                        hideSources: {
	                           type: "array",
	                           description: "Controls source-related default filter settings",
	                           "default": []
	                        },
	                        hideInteractions: {
	                           type: "array",
	                           description: "Controls interaction-related default filter settings",
	                           "default": [ "subscribe", "unsubscribe" ]
	                        },
	                        resource: {
	                           type: "string",
	                           description: "The event topic through which to receive filter information",
	                           format: "topic",
	                           axRole: "inlet"
	                        }
	                     },
	                     additionalProperties: false
	                  }
	               },
	               additionalProperties: false
	            },
	            controls: [],
	            compatibility: []
	         },
	         module: __webpack_require__( 266 ),
	         assets: {
	            "default.theme": {
	               "events-display-widget.html": {
	                  content: __webpack_require__( 420 )
	               },
	               "css/events-display-widget.css": {
	                  url: __webpack_require__( 421 )
	               }
	            }
	         }
	      }
	   ],
	   controls: []
	};

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	var resource = __webpack_require__( 246 );
	module.exports = typeof resource === 'string' ? resource : null;

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(247);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(260)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./theme.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./theme.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(248)();
	// imports
	
	
	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  /* IE < 9\n      The two src data are needed to circumvent a bug in IE for the rendering of the text.\n      IE9+ supports the type format *.woff. */\n  src: url(" + __webpack_require__(249) + ");\n  /* IE9 Compat Modes */\n  src: url(" + __webpack_require__(250) + "?#iefix&v=4.3.0) format(\"embedded-opentype\");\n  /* IE6-IE8 */\n  src: url(" + __webpack_require__(251) + "#fontawesomeregular) format(\"svg\"), url(" + __webpack_require__(252) + ") format(\"woff2\"), url(" + __webpack_require__(253) + ") format(\"woff\"), url(" + __webpack_require__(254) + ") format(\"truetype\");\n  /* Safari, Android, iOS */\n  /* To avoid a bug in Webkit-Browsers set all font-* properties to normal. */\n  font-weight: normal;\n  font-style: normal;\n  font-variant: normal;\n}\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-transform: translate(0, 0);\n      -ms-transform: translate(0, 0);\n          transform: translate(0, 0);\n}\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-fw {\n  width: 1.2857142857em;\n  text-align: center;\n}\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.1428571429em;\n  list-style-type: none;\n}\n\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  position: absolute;\n  left: -2.1428571429em;\n  width: 2.1428571429em;\n  top: 0.1428571429em;\n  text-align: center;\n}\n\n.fa-li.fa-lg {\n  left: -1.8571428571em;\n}\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em;\n}\n\n.pull-right {\n  float: right;\n}\n\n.pull-left {\n  float: left;\n}\n\n.fa.pull-left {\n  margin-right: .3em;\n}\n\n.fa.pull-right {\n  margin-left: .3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n\n.fa-rotate-90 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle;\n}\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n\n.fa-stack-1x {\n  line-height: inherit;\n}\n\n.fa-stack-2x {\n  font-size: 2em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\";\n}\n\n.fa-music:before {\n  content: \"\\F001\";\n}\n\n.fa-search:before {\n  content: \"\\F002\";\n}\n\n.fa-envelope-o:before {\n  content: \"\\F003\";\n}\n\n.fa-heart:before {\n  content: \"\\F004\";\n}\n\n.fa-star:before {\n  content: \"\\F005\";\n}\n\n.fa-star-o:before {\n  content: \"\\F006\";\n}\n\n.fa-user:before {\n  content: \"\\F007\";\n}\n\n.fa-film:before {\n  content: \"\\F008\";\n}\n\n.fa-th-large:before {\n  content: \"\\F009\";\n}\n\n.fa-th:before {\n  content: \"\\F00A\";\n}\n\n.fa-th-list:before {\n  content: \"\\F00B\";\n}\n\n.fa-check:before {\n  content: \"\\F00C\";\n}\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\";\n}\n\n.fa-search-plus:before {\n  content: \"\\F00E\";\n}\n\n.fa-search-minus:before {\n  content: \"\\F010\";\n}\n\n.fa-power-off:before {\n  content: \"\\F011\";\n}\n\n.fa-signal:before {\n  content: \"\\F012\";\n}\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\";\n}\n\n.fa-trash-o:before {\n  content: \"\\F014\";\n}\n\n.fa-home:before {\n  content: \"\\F015\";\n}\n\n.fa-file-o:before {\n  content: \"\\F016\";\n}\n\n.fa-clock-o:before {\n  content: \"\\F017\";\n}\n\n.fa-road:before {\n  content: \"\\F018\";\n}\n\n.fa-download:before {\n  content: \"\\F019\";\n}\n\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\";\n}\n\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\";\n}\n\n.fa-inbox:before {\n  content: \"\\F01C\";\n}\n\n.fa-play-circle-o:before {\n  content: \"\\F01D\";\n}\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\";\n}\n\n.fa-refresh:before {\n  content: \"\\F021\";\n}\n\n.fa-list-alt:before {\n  content: \"\\F022\";\n}\n\n.fa-lock:before {\n  content: \"\\F023\";\n}\n\n.fa-flag:before {\n  content: \"\\F024\";\n}\n\n.fa-headphones:before {\n  content: \"\\F025\";\n}\n\n.fa-volume-off:before {\n  content: \"\\F026\";\n}\n\n.fa-volume-down:before {\n  content: \"\\F027\";\n}\n\n.fa-volume-up:before {\n  content: \"\\F028\";\n}\n\n.fa-qrcode:before {\n  content: \"\\F029\";\n}\n\n.fa-barcode:before {\n  content: \"\\F02A\";\n}\n\n.fa-tag:before {\n  content: \"\\F02B\";\n}\n\n.fa-tags:before {\n  content: \"\\F02C\";\n}\n\n.fa-book:before {\n  content: \"\\F02D\";\n}\n\n.fa-bookmark:before {\n  content: \"\\F02E\";\n}\n\n.fa-print:before {\n  content: \"\\F02F\";\n}\n\n.fa-camera:before {\n  content: \"\\F030\";\n}\n\n.fa-font:before {\n  content: \"\\F031\";\n}\n\n.fa-bold:before {\n  content: \"\\F032\";\n}\n\n.fa-italic:before {\n  content: \"\\F033\";\n}\n\n.fa-text-height:before {\n  content: \"\\F034\";\n}\n\n.fa-text-width:before {\n  content: \"\\F035\";\n}\n\n.fa-align-left:before {\n  content: \"\\F036\";\n}\n\n.fa-align-center:before {\n  content: \"\\F037\";\n}\n\n.fa-align-right:before {\n  content: \"\\F038\";\n}\n\n.fa-align-justify:before {\n  content: \"\\F039\";\n}\n\n.fa-list:before {\n  content: \"\\F03A\";\n}\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\";\n}\n\n.fa-indent:before {\n  content: \"\\F03C\";\n}\n\n.fa-video-camera:before {\n  content: \"\\F03D\";\n}\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\";\n}\n\n.fa-pencil:before {\n  content: \"\\F040\";\n}\n\n.fa-map-marker:before {\n  content: \"\\F041\";\n}\n\n.fa-adjust:before {\n  content: \"\\F042\";\n}\n\n.fa-tint:before {\n  content: \"\\F043\";\n}\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\";\n}\n\n.fa-share-square-o:before {\n  content: \"\\F045\";\n}\n\n.fa-check-square-o:before {\n  content: \"\\F046\";\n}\n\n.fa-arrows:before {\n  content: \"\\F047\";\n}\n\n.fa-step-backward:before {\n  content: \"\\F048\";\n}\n\n.fa-fast-backward:before {\n  content: \"\\F049\";\n}\n\n.fa-backward:before {\n  content: \"\\F04A\";\n}\n\n.fa-play:before {\n  content: \"\\F04B\";\n}\n\n.fa-pause:before {\n  content: \"\\F04C\";\n}\n\n.fa-stop:before {\n  content: \"\\F04D\";\n}\n\n.fa-forward:before {\n  content: \"\\F04E\";\n}\n\n.fa-fast-forward:before {\n  content: \"\\F050\";\n}\n\n.fa-step-forward:before {\n  content: \"\\F051\";\n}\n\n.fa-eject:before {\n  content: \"\\F052\";\n}\n\n.fa-chevron-left:before {\n  content: \"\\F053\";\n}\n\n.fa-chevron-right:before {\n  content: \"\\F054\";\n}\n\n.fa-plus-circle:before {\n  content: \"\\F055\";\n}\n\n.fa-minus-circle:before {\n  content: \"\\F056\";\n}\n\n.fa-times-circle:before {\n  content: \"\\F057\";\n}\n\n.fa-check-circle:before {\n  content: \"\\F058\";\n}\n\n.fa-question-circle:before {\n  content: \"\\F059\";\n}\n\n.fa-info-circle:before {\n  content: \"\\F05A\";\n}\n\n.fa-crosshairs:before {\n  content: \"\\F05B\";\n}\n\n.fa-times-circle-o:before {\n  content: \"\\F05C\";\n}\n\n.fa-check-circle-o:before {\n  content: \"\\F05D\";\n}\n\n.fa-ban:before {\n  content: \"\\F05E\";\n}\n\n.fa-arrow-left:before {\n  content: \"\\F060\";\n}\n\n.fa-arrow-right:before {\n  content: \"\\F061\";\n}\n\n.fa-arrow-up:before {\n  content: \"\\F062\";\n}\n\n.fa-arrow-down:before {\n  content: \"\\F063\";\n}\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\";\n}\n\n.fa-expand:before {\n  content: \"\\F065\";\n}\n\n.fa-compress:before {\n  content: \"\\F066\";\n}\n\n.fa-plus:before {\n  content: \"\\F067\";\n}\n\n.fa-minus:before {\n  content: \"\\F068\";\n}\n\n.fa-asterisk:before {\n  content: \"\\F069\";\n}\n\n.fa-exclamation-circle:before {\n  content: \"\\F06A\";\n}\n\n.fa-gift:before {\n  content: \"\\F06B\";\n}\n\n.fa-leaf:before {\n  content: \"\\F06C\";\n}\n\n.fa-fire:before {\n  content: \"\\F06D\";\n}\n\n.fa-eye:before {\n  content: \"\\F06E\";\n}\n\n.fa-eye-slash:before {\n  content: \"\\F070\";\n}\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\";\n}\n\n.fa-plane:before {\n  content: \"\\F072\";\n}\n\n.fa-calendar:before {\n  content: \"\\F073\";\n}\n\n.fa-random:before {\n  content: \"\\F074\";\n}\n\n.fa-comment:before {\n  content: \"\\F075\";\n}\n\n.fa-magnet:before {\n  content: \"\\F076\";\n}\n\n.fa-chevron-up:before {\n  content: \"\\F077\";\n}\n\n.fa-chevron-down:before {\n  content: \"\\F078\";\n}\n\n.fa-retweet:before {\n  content: \"\\F079\";\n}\n\n.fa-shopping-cart:before {\n  content: \"\\F07A\";\n}\n\n.fa-folder:before {\n  content: \"\\F07B\";\n}\n\n.fa-folder-open:before {\n  content: \"\\F07C\";\n}\n\n.fa-arrows-v:before {\n  content: \"\\F07D\";\n}\n\n.fa-arrows-h:before {\n  content: \"\\F07E\";\n}\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\";\n}\n\n.fa-twitter-square:before {\n  content: \"\\F081\";\n}\n\n.fa-facebook-square:before {\n  content: \"\\F082\";\n}\n\n.fa-camera-retro:before {\n  content: \"\\F083\";\n}\n\n.fa-key:before {\n  content: \"\\F084\";\n}\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\";\n}\n\n.fa-comments:before {\n  content: \"\\F086\";\n}\n\n.fa-thumbs-o-up:before {\n  content: \"\\F087\";\n}\n\n.fa-thumbs-o-down:before {\n  content: \"\\F088\";\n}\n\n.fa-star-half:before {\n  content: \"\\F089\";\n}\n\n.fa-heart-o:before {\n  content: \"\\F08A\";\n}\n\n.fa-sign-out:before {\n  content: \"\\F08B\";\n}\n\n.fa-linkedin-square:before {\n  content: \"\\F08C\";\n}\n\n.fa-thumb-tack:before {\n  content: \"\\F08D\";\n}\n\n.fa-external-link:before {\n  content: \"\\F08E\";\n}\n\n.fa-sign-in:before {\n  content: \"\\F090\";\n}\n\n.fa-trophy:before {\n  content: \"\\F091\";\n}\n\n.fa-github-square:before {\n  content: \"\\F092\";\n}\n\n.fa-upload:before {\n  content: \"\\F093\";\n}\n\n.fa-lemon-o:before {\n  content: \"\\F094\";\n}\n\n.fa-phone:before {\n  content: \"\\F095\";\n}\n\n.fa-square-o:before {\n  content: \"\\F096\";\n}\n\n.fa-bookmark-o:before {\n  content: \"\\F097\";\n}\n\n.fa-phone-square:before {\n  content: \"\\F098\";\n}\n\n.fa-twitter:before {\n  content: \"\\F099\";\n}\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\";\n}\n\n.fa-github:before {\n  content: \"\\F09B\";\n}\n\n.fa-unlock:before {\n  content: \"\\F09C\";\n}\n\n.fa-credit-card:before {\n  content: \"\\F09D\";\n}\n\n.fa-rss:before {\n  content: \"\\F09E\";\n}\n\n.fa-hdd-o:before {\n  content: \"\\F0A0\";\n}\n\n.fa-bullhorn:before {\n  content: \"\\F0A1\";\n}\n\n.fa-bell:before {\n  content: \"\\F0F3\";\n}\n\n.fa-certificate:before {\n  content: \"\\F0A3\";\n}\n\n.fa-hand-o-right:before {\n  content: \"\\F0A4\";\n}\n\n.fa-hand-o-left:before {\n  content: \"\\F0A5\";\n}\n\n.fa-hand-o-up:before {\n  content: \"\\F0A6\";\n}\n\n.fa-hand-o-down:before {\n  content: \"\\F0A7\";\n}\n\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\";\n}\n\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\";\n}\n\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\";\n}\n\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\";\n}\n\n.fa-globe:before {\n  content: \"\\F0AC\";\n}\n\n.fa-wrench:before {\n  content: \"\\F0AD\";\n}\n\n.fa-tasks:before {\n  content: \"\\F0AE\";\n}\n\n.fa-filter:before {\n  content: \"\\F0B0\";\n}\n\n.fa-briefcase:before {\n  content: \"\\F0B1\";\n}\n\n.fa-arrows-alt:before {\n  content: \"\\F0B2\";\n}\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\";\n}\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\";\n}\n\n.fa-cloud:before {\n  content: \"\\F0C2\";\n}\n\n.fa-flask:before {\n  content: \"\\F0C3\";\n}\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\";\n}\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\";\n}\n\n.fa-paperclip:before {\n  content: \"\\F0C6\";\n}\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\";\n}\n\n.fa-square:before {\n  content: \"\\F0C8\";\n}\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\";\n}\n\n.fa-list-ul:before {\n  content: \"\\F0CA\";\n}\n\n.fa-list-ol:before {\n  content: \"\\F0CB\";\n}\n\n.fa-strikethrough:before {\n  content: \"\\F0CC\";\n}\n\n.fa-underline:before {\n  content: \"\\F0CD\";\n}\n\n.fa-table:before {\n  content: \"\\F0CE\";\n}\n\n.fa-magic:before {\n  content: \"\\F0D0\";\n}\n\n.fa-truck:before {\n  content: \"\\F0D1\";\n}\n\n.fa-pinterest:before {\n  content: \"\\F0D2\";\n}\n\n.fa-pinterest-square:before {\n  content: \"\\F0D3\";\n}\n\n.fa-google-plus-square:before {\n  content: \"\\F0D4\";\n}\n\n.fa-google-plus:before {\n  content: \"\\F0D5\";\n}\n\n.fa-money:before {\n  content: \"\\F0D6\";\n}\n\n.fa-caret-down:before {\n  content: \"\\F0D7\";\n}\n\n.fa-caret-up:before {\n  content: \"\\F0D8\";\n}\n\n.fa-caret-left:before {\n  content: \"\\F0D9\";\n}\n\n.fa-caret-right:before {\n  content: \"\\F0DA\";\n}\n\n.fa-columns:before {\n  content: \"\\F0DB\";\n}\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\";\n}\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\";\n}\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\";\n}\n\n.fa-envelope:before {\n  content: \"\\F0E0\";\n}\n\n.fa-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\";\n}\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\";\n}\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\";\n}\n\n.fa-comment-o:before {\n  content: \"\\F0E5\";\n}\n\n.fa-comments-o:before {\n  content: \"\\F0E6\";\n}\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\";\n}\n\n.fa-sitemap:before {\n  content: \"\\F0E8\";\n}\n\n.fa-umbrella:before {\n  content: \"\\F0E9\";\n}\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\";\n}\n\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\";\n}\n\n.fa-exchange:before {\n  content: \"\\F0EC\";\n}\n\n.fa-cloud-download:before {\n  content: \"\\F0ED\";\n}\n\n.fa-cloud-upload:before {\n  content: \"\\F0EE\";\n}\n\n.fa-user-md:before {\n  content: \"\\F0F0\";\n}\n\n.fa-stethoscope:before {\n  content: \"\\F0F1\";\n}\n\n.fa-suitcase:before {\n  content: \"\\F0F2\";\n}\n\n.fa-bell-o:before {\n  content: \"\\F0A2\";\n}\n\n.fa-coffee:before {\n  content: \"\\F0F4\";\n}\n\n.fa-cutlery:before {\n  content: \"\\F0F5\";\n}\n\n.fa-file-text-o:before {\n  content: \"\\F0F6\";\n}\n\n.fa-building-o:before {\n  content: \"\\F0F7\";\n}\n\n.fa-hospital-o:before {\n  content: \"\\F0F8\";\n}\n\n.fa-ambulance:before {\n  content: \"\\F0F9\";\n}\n\n.fa-medkit:before {\n  content: \"\\F0FA\";\n}\n\n.fa-fighter-jet:before {\n  content: \"\\F0FB\";\n}\n\n.fa-beer:before {\n  content: \"\\F0FC\";\n}\n\n.fa-h-square:before {\n  content: \"\\F0FD\";\n}\n\n.fa-plus-square:before {\n  content: \"\\F0FE\";\n}\n\n.fa-angle-double-left:before {\n  content: \"\\F100\";\n}\n\n.fa-angle-double-right:before {\n  content: \"\\F101\";\n}\n\n.fa-angle-double-up:before {\n  content: \"\\F102\";\n}\n\n.fa-angle-double-down:before {\n  content: \"\\F103\";\n}\n\n.fa-angle-left:before {\n  content: \"\\F104\";\n}\n\n.fa-angle-right:before {\n  content: \"\\F105\";\n}\n\n.fa-angle-up:before {\n  content: \"\\F106\";\n}\n\n.fa-angle-down:before {\n  content: \"\\F107\";\n}\n\n.fa-desktop:before {\n  content: \"\\F108\";\n}\n\n.fa-laptop:before {\n  content: \"\\F109\";\n}\n\n.fa-tablet:before {\n  content: \"\\F10A\";\n}\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\";\n}\n\n.fa-circle-o:before {\n  content: \"\\F10C\";\n}\n\n.fa-quote-left:before {\n  content: \"\\F10D\";\n}\n\n.fa-quote-right:before {\n  content: \"\\F10E\";\n}\n\n.fa-spinner:before {\n  content: \"\\F110\";\n}\n\n.fa-circle:before {\n  content: \"\\F111\";\n}\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\";\n}\n\n.fa-github-alt:before {\n  content: \"\\F113\";\n}\n\n.fa-folder-o:before {\n  content: \"\\F114\";\n}\n\n.fa-folder-open-o:before {\n  content: \"\\F115\";\n}\n\n.fa-smile-o:before {\n  content: \"\\F118\";\n}\n\n.fa-frown-o:before {\n  content: \"\\F119\";\n}\n\n.fa-meh-o:before {\n  content: \"\\F11A\";\n}\n\n.fa-gamepad:before {\n  content: \"\\F11B\";\n}\n\n.fa-keyboard-o:before {\n  content: \"\\F11C\";\n}\n\n.fa-flag-o:before {\n  content: \"\\F11D\";\n}\n\n.fa-flag-checkered:before {\n  content: \"\\F11E\";\n}\n\n.fa-terminal:before {\n  content: \"\\F120\";\n}\n\n.fa-code:before {\n  content: \"\\F121\";\n}\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\";\n}\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\";\n}\n\n.fa-location-arrow:before {\n  content: \"\\F124\";\n}\n\n.fa-crop:before {\n  content: \"\\F125\";\n}\n\n.fa-code-fork:before {\n  content: \"\\F126\";\n}\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\";\n}\n\n.fa-question:before {\n  content: \"\\F128\";\n}\n\n.fa-info:before {\n  content: \"\\F129\";\n}\n\n.fa-exclamation:before {\n  content: \"\\F12A\";\n}\n\n.fa-superscript:before {\n  content: \"\\F12B\";\n}\n\n.fa-subscript:before {\n  content: \"\\F12C\";\n}\n\n.fa-eraser:before {\n  content: \"\\F12D\";\n}\n\n.fa-puzzle-piece:before {\n  content: \"\\F12E\";\n}\n\n.fa-microphone:before {\n  content: \"\\F130\";\n}\n\n.fa-microphone-slash:before {\n  content: \"\\F131\";\n}\n\n.fa-shield:before {\n  content: \"\\F132\";\n}\n\n.fa-calendar-o:before {\n  content: \"\\F133\";\n}\n\n.fa-fire-extinguisher:before {\n  content: \"\\F134\";\n}\n\n.fa-rocket:before {\n  content: \"\\F135\";\n}\n\n.fa-maxcdn:before {\n  content: \"\\F136\";\n}\n\n.fa-chevron-circle-left:before {\n  content: \"\\F137\";\n}\n\n.fa-chevron-circle-right:before {\n  content: \"\\F138\";\n}\n\n.fa-chevron-circle-up:before {\n  content: \"\\F139\";\n}\n\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\";\n}\n\n.fa-html5:before {\n  content: \"\\F13B\";\n}\n\n.fa-css3:before {\n  content: \"\\F13C\";\n}\n\n.fa-anchor:before {\n  content: \"\\F13D\";\n}\n\n.fa-unlock-alt:before {\n  content: \"\\F13E\";\n}\n\n.fa-bullseye:before {\n  content: \"\\F140\";\n}\n\n.fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n\n.fa-ellipsis-v:before {\n  content: \"\\F142\";\n}\n\n.fa-rss-square:before {\n  content: \"\\F143\";\n}\n\n.fa-play-circle:before {\n  content: \"\\F144\";\n}\n\n.fa-ticket:before {\n  content: \"\\F145\";\n}\n\n.fa-minus-square:before {\n  content: \"\\F146\";\n}\n\n.fa-minus-square-o:before {\n  content: \"\\F147\";\n}\n\n.fa-level-up:before {\n  content: \"\\F148\";\n}\n\n.fa-level-down:before {\n  content: \"\\F149\";\n}\n\n.fa-check-square:before {\n  content: \"\\F14A\";\n}\n\n.fa-pencil-square:before {\n  content: \"\\F14B\";\n}\n\n.fa-external-link-square:before {\n  content: \"\\F14C\";\n}\n\n.fa-share-square:before {\n  content: \"\\F14D\";\n}\n\n.fa-compass:before {\n  content: \"\\F14E\";\n}\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\";\n}\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\";\n}\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\";\n}\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\";\n}\n\n.fa-gbp:before {\n  content: \"\\F154\";\n}\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\";\n}\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\";\n}\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\";\n}\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\";\n}\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\";\n}\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\";\n}\n\n.fa-file:before {\n  content: \"\\F15B\";\n}\n\n.fa-file-text:before {\n  content: \"\\F15C\";\n}\n\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\";\n}\n\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\";\n}\n\n.fa-sort-amount-asc:before {\n  content: \"\\F160\";\n}\n\n.fa-sort-amount-desc:before {\n  content: \"\\F161\";\n}\n\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\";\n}\n\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\";\n}\n\n.fa-thumbs-up:before {\n  content: \"\\F164\";\n}\n\n.fa-thumbs-down:before {\n  content: \"\\F165\";\n}\n\n.fa-youtube-square:before {\n  content: \"\\F166\";\n}\n\n.fa-youtube:before {\n  content: \"\\F167\";\n}\n\n.fa-xing:before {\n  content: \"\\F168\";\n}\n\n.fa-xing-square:before {\n  content: \"\\F169\";\n}\n\n.fa-youtube-play:before {\n  content: \"\\F16A\";\n}\n\n.fa-dropbox:before {\n  content: \"\\F16B\";\n}\n\n.fa-stack-overflow:before {\n  content: \"\\F16C\";\n}\n\n.fa-instagram:before {\n  content: \"\\F16D\";\n}\n\n.fa-flickr:before {\n  content: \"\\F16E\";\n}\n\n.fa-adn:before {\n  content: \"\\F170\";\n}\n\n.fa-bitbucket:before {\n  content: \"\\F171\";\n}\n\n.fa-bitbucket-square:before {\n  content: \"\\F172\";\n}\n\n.fa-tumblr:before {\n  content: \"\\F173\";\n}\n\n.fa-tumblr-square:before {\n  content: \"\\F174\";\n}\n\n.fa-long-arrow-down:before {\n  content: \"\\F175\";\n}\n\n.fa-long-arrow-up:before {\n  content: \"\\F176\";\n}\n\n.fa-long-arrow-left:before {\n  content: \"\\F177\";\n}\n\n.fa-long-arrow-right:before {\n  content: \"\\F178\";\n}\n\n.fa-apple:before {\n  content: \"\\F179\";\n}\n\n.fa-windows:before {\n  content: \"\\F17A\";\n}\n\n.fa-android:before {\n  content: \"\\F17B\";\n}\n\n.fa-linux:before {\n  content: \"\\F17C\";\n}\n\n.fa-dribbble:before {\n  content: \"\\F17D\";\n}\n\n.fa-skype:before {\n  content: \"\\F17E\";\n}\n\n.fa-foursquare:before {\n  content: \"\\F180\";\n}\n\n.fa-trello:before {\n  content: \"\\F181\";\n}\n\n.fa-female:before {\n  content: \"\\F182\";\n}\n\n.fa-male:before {\n  content: \"\\F183\";\n}\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\";\n}\n\n.fa-sun-o:before {\n  content: \"\\F185\";\n}\n\n.fa-moon-o:before {\n  content: \"\\F186\";\n}\n\n.fa-archive:before {\n  content: \"\\F187\";\n}\n\n.fa-bug:before {\n  content: \"\\F188\";\n}\n\n.fa-vk:before {\n  content: \"\\F189\";\n}\n\n.fa-weibo:before {\n  content: \"\\F18A\";\n}\n\n.fa-renren:before {\n  content: \"\\F18B\";\n}\n\n.fa-pagelines:before {\n  content: \"\\F18C\";\n}\n\n.fa-stack-exchange:before {\n  content: \"\\F18D\";\n}\n\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\";\n}\n\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\";\n}\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\";\n}\n\n.fa-dot-circle-o:before {\n  content: \"\\F192\";\n}\n\n.fa-wheelchair:before {\n  content: \"\\F193\";\n}\n\n.fa-vimeo-square:before {\n  content: \"\\F194\";\n}\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\";\n}\n\n.fa-plus-square-o:before {\n  content: \"\\F196\";\n}\n\n.fa-space-shuttle:before {\n  content: \"\\F197\";\n}\n\n.fa-slack:before {\n  content: \"\\F198\";\n}\n\n.fa-envelope-square:before {\n  content: \"\\F199\";\n}\n\n.fa-wordpress:before {\n  content: \"\\F19A\";\n}\n\n.fa-openid:before {\n  content: \"\\F19B\";\n}\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\";\n}\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\";\n}\n\n.fa-yahoo:before {\n  content: \"\\F19E\";\n}\n\n.fa-google:before {\n  content: \"\\F1A0\";\n}\n\n.fa-reddit:before {\n  content: \"\\F1A1\";\n}\n\n.fa-reddit-square:before {\n  content: \"\\F1A2\";\n}\n\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\";\n}\n\n.fa-stumbleupon:before {\n  content: \"\\F1A4\";\n}\n\n.fa-delicious:before {\n  content: \"\\F1A5\";\n}\n\n.fa-digg:before {\n  content: \"\\F1A6\";\n}\n\n.fa-pied-piper:before {\n  content: \"\\F1A7\";\n}\n\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\";\n}\n\n.fa-drupal:before {\n  content: \"\\F1A9\";\n}\n\n.fa-joomla:before {\n  content: \"\\F1AA\";\n}\n\n.fa-language:before {\n  content: \"\\F1AB\";\n}\n\n.fa-fax:before {\n  content: \"\\F1AC\";\n}\n\n.fa-building:before {\n  content: \"\\F1AD\";\n}\n\n.fa-child:before {\n  content: \"\\F1AE\";\n}\n\n.fa-paw:before {\n  content: \"\\F1B0\";\n}\n\n.fa-spoon:before {\n  content: \"\\F1B1\";\n}\n\n.fa-cube:before {\n  content: \"\\F1B2\";\n}\n\n.fa-cubes:before {\n  content: \"\\F1B3\";\n}\n\n.fa-behance:before {\n  content: \"\\F1B4\";\n}\n\n.fa-behance-square:before {\n  content: \"\\F1B5\";\n}\n\n.fa-steam:before {\n  content: \"\\F1B6\";\n}\n\n.fa-steam-square:before {\n  content: \"\\F1B7\";\n}\n\n.fa-recycle:before {\n  content: \"\\F1B8\";\n}\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\";\n}\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\";\n}\n\n.fa-tree:before {\n  content: \"\\F1BB\";\n}\n\n.fa-spotify:before {\n  content: \"\\F1BC\";\n}\n\n.fa-deviantart:before {\n  content: \"\\F1BD\";\n}\n\n.fa-soundcloud:before {\n  content: \"\\F1BE\";\n}\n\n.fa-database:before {\n  content: \"\\F1C0\";\n}\n\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\";\n}\n\n.fa-file-word-o:before {\n  content: \"\\F1C2\";\n}\n\n.fa-file-excel-o:before {\n  content: \"\\F1C3\";\n}\n\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\";\n}\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\";\n}\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\";\n}\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\";\n}\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\";\n}\n\n.fa-file-code-o:before {\n  content: \"\\F1C9\";\n}\n\n.fa-vine:before {\n  content: \"\\F1CA\";\n}\n\n.fa-codepen:before {\n  content: \"\\F1CB\";\n}\n\n.fa-jsfiddle:before {\n  content: \"\\F1CC\";\n}\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\";\n}\n\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\";\n}\n\n.fa-ra:before,\n.fa-rebel:before {\n  content: \"\\F1D0\";\n}\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\";\n}\n\n.fa-git-square:before {\n  content: \"\\F1D2\";\n}\n\n.fa-git:before {\n  content: \"\\F1D3\";\n}\n\n.fa-hacker-news:before {\n  content: \"\\F1D4\";\n}\n\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\";\n}\n\n.fa-qq:before {\n  content: \"\\F1D6\";\n}\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\";\n}\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\";\n}\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\";\n}\n\n.fa-history:before {\n  content: \"\\F1DA\";\n}\n\n.fa-genderless:before,\n.fa-circle-thin:before {\n  content: \"\\F1DB\";\n}\n\n.fa-header:before {\n  content: \"\\F1DC\";\n}\n\n.fa-paragraph:before {\n  content: \"\\F1DD\";\n}\n\n.fa-sliders:before {\n  content: \"\\F1DE\";\n}\n\n.fa-share-alt:before {\n  content: \"\\F1E0\";\n}\n\n.fa-share-alt-square:before {\n  content: \"\\F1E1\";\n}\n\n.fa-bomb:before {\n  content: \"\\F1E2\";\n}\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\";\n}\n\n.fa-tty:before {\n  content: \"\\F1E4\";\n}\n\n.fa-binoculars:before {\n  content: \"\\F1E5\";\n}\n\n.fa-plug:before {\n  content: \"\\F1E6\";\n}\n\n.fa-slideshare:before {\n  content: \"\\F1E7\";\n}\n\n.fa-twitch:before {\n  content: \"\\F1E8\";\n}\n\n.fa-yelp:before {\n  content: \"\\F1E9\";\n}\n\n.fa-newspaper-o:before {\n  content: \"\\F1EA\";\n}\n\n.fa-wifi:before {\n  content: \"\\F1EB\";\n}\n\n.fa-calculator:before {\n  content: \"\\F1EC\";\n}\n\n.fa-paypal:before {\n  content: \"\\F1ED\";\n}\n\n.fa-google-wallet:before {\n  content: \"\\F1EE\";\n}\n\n.fa-cc-visa:before {\n  content: \"\\F1F0\";\n}\n\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\";\n}\n\n.fa-cc-discover:before {\n  content: \"\\F1F2\";\n}\n\n.fa-cc-amex:before {\n  content: \"\\F1F3\";\n}\n\n.fa-cc-paypal:before {\n  content: \"\\F1F4\";\n}\n\n.fa-cc-stripe:before {\n  content: \"\\F1F5\";\n}\n\n.fa-bell-slash:before {\n  content: \"\\F1F6\";\n}\n\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\";\n}\n\n.fa-trash:before {\n  content: \"\\F1F8\";\n}\n\n.fa-copyright:before {\n  content: \"\\F1F9\";\n}\n\n.fa-at:before {\n  content: \"\\F1FA\";\n}\n\n.fa-eyedropper:before {\n  content: \"\\F1FB\";\n}\n\n.fa-paint-brush:before {\n  content: \"\\F1FC\";\n}\n\n.fa-birthday-cake:before {\n  content: \"\\F1FD\";\n}\n\n.fa-area-chart:before {\n  content: \"\\F1FE\";\n}\n\n.fa-pie-chart:before {\n  content: \"\\F200\";\n}\n\n.fa-line-chart:before {\n  content: \"\\F201\";\n}\n\n.fa-lastfm:before {\n  content: \"\\F202\";\n}\n\n.fa-lastfm-square:before {\n  content: \"\\F203\";\n}\n\n.fa-toggle-off:before {\n  content: \"\\F204\";\n}\n\n.fa-toggle-on:before {\n  content: \"\\F205\";\n}\n\n.fa-bicycle:before {\n  content: \"\\F206\";\n}\n\n.fa-bus:before {\n  content: \"\\F207\";\n}\n\n.fa-ioxhost:before {\n  content: \"\\F208\";\n}\n\n.fa-angellist:before {\n  content: \"\\F209\";\n}\n\n.fa-cc:before {\n  content: \"\\F20A\";\n}\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\";\n}\n\n.fa-meanpath:before {\n  content: \"\\F20C\";\n}\n\n.fa-buysellads:before {\n  content: \"\\F20D\";\n}\n\n.fa-connectdevelop:before {\n  content: \"\\F20E\";\n}\n\n.fa-dashcube:before {\n  content: \"\\F210\";\n}\n\n.fa-forumbee:before {\n  content: \"\\F211\";\n}\n\n.fa-leanpub:before {\n  content: \"\\F212\";\n}\n\n.fa-sellsy:before {\n  content: \"\\F213\";\n}\n\n.fa-shirtsinbulk:before {\n  content: \"\\F214\";\n}\n\n.fa-simplybuilt:before {\n  content: \"\\F215\";\n}\n\n.fa-skyatlas:before {\n  content: \"\\F216\";\n}\n\n.fa-cart-plus:before {\n  content: \"\\F217\";\n}\n\n.fa-cart-arrow-down:before {\n  content: \"\\F218\";\n}\n\n.fa-diamond:before {\n  content: \"\\F219\";\n}\n\n.fa-ship:before {\n  content: \"\\F21A\";\n}\n\n.fa-user-secret:before {\n  content: \"\\F21B\";\n}\n\n.fa-motorcycle:before {\n  content: \"\\F21C\";\n}\n\n.fa-street-view:before {\n  content: \"\\F21D\";\n}\n\n.fa-heartbeat:before {\n  content: \"\\F21E\";\n}\n\n.fa-venus:before {\n  content: \"\\F221\";\n}\n\n.fa-mars:before {\n  content: \"\\F222\";\n}\n\n.fa-mercury:before {\n  content: \"\\F223\";\n}\n\n.fa-transgender:before {\n  content: \"\\F224\";\n}\n\n.fa-transgender-alt:before {\n  content: \"\\F225\";\n}\n\n.fa-venus-double:before {\n  content: \"\\F226\";\n}\n\n.fa-mars-double:before {\n  content: \"\\F227\";\n}\n\n.fa-venus-mars:before {\n  content: \"\\F228\";\n}\n\n.fa-mars-stroke:before {\n  content: \"\\F229\";\n}\n\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\";\n}\n\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\";\n}\n\n.fa-neuter:before {\n  content: \"\\F22C\";\n}\n\n.fa-facebook-official:before {\n  content: \"\\F230\";\n}\n\n.fa-pinterest-p:before {\n  content: \"\\F231\";\n}\n\n.fa-whatsapp:before {\n  content: \"\\F232\";\n}\n\n.fa-server:before {\n  content: \"\\F233\";\n}\n\n.fa-user-plus:before {\n  content: \"\\F234\";\n}\n\n.fa-user-times:before {\n  content: \"\\F235\";\n}\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\";\n}\n\n.fa-viacoin:before {\n  content: \"\\F237\";\n}\n\n.fa-train:before {\n  content: \"\\F238\";\n}\n\n.fa-subway:before {\n  content: \"\\F239\";\n}\n\n.fa-medium:before {\n  content: \"\\F23A\";\n}\n\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\n\nbody {\n  margin: 0;\n}\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n[hidden],\ntemplate {\n  display: none;\n}\n\na {\n  background-color: transparent;\n}\n\na:active,\na:hover {\n  outline: 0;\n}\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\ndfn {\n  font-style: italic;\n}\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\nsmall {\n  font-size: 80%;\n}\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nimg {\n  border: 0;\n}\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\nfigure {\n  margin: 1em 40px;\n}\n\nhr {\n  -moz-box-sizing: content-box;\n       box-sizing: content-box;\n  height: 0;\n}\n\npre {\n  overflow: auto;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0;\n}\n\nbutton {\n  overflow: visible;\n}\n\nbutton,\nselect {\n  text-transform: none;\n}\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\ninput {\n  line-height: normal;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  -moz-box-sizing: border-box;\n       box-sizing: border-box;\n  padding: 0;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  -moz-box-sizing: content-box;\n       box-sizing: content-box;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\nlegend {\n  border: 0;\n  padding: 0;\n}\n\ntextarea {\n  overflow: auto;\n}\n\noptgroup {\n  font-weight: bold;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n  a[href]:after {\n    content: \" (\" attr(href) \")\";\n  }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\";\n  }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\";\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n  thead {\n    display: table-header-group;\n  }\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n  img {\n    max-width: 100% !important;\n  }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n  .navbar {\n    display: none;\n  }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important;\n  }\n  .label {\n    border: 1px solid #000;\n  }\n  .table {\n    border-collapse: collapse !important;\n  }\n  .table td,\n  .table th {\n    background-color: #fff !important;\n  }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important;\n  }\n}\n\n* {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n*:before,\n*:after {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: transparent;\n}\n\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.428571429;\n  color: #333333;\n  background-color: #fff;\n}\n\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\na {\n  color: #337ab7;\n  text-decoration: none;\n}\n\na:hover, a:focus {\n  color: #23527c;\n  text-decoration: underline;\n}\n\na:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  vertical-align: middle;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\n.img-rounded {\n  border-radius: 6px;\n}\n\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.428571429;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto;\n}\n\n.img-circle {\n  border-radius: 50%;\n}\n\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #eeeeee;\n}\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n\n[role=\"button\"] {\n  cursor: pointer;\n}\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1 small,\nh1 .small, h2 small,\nh2 .small, h3 small,\nh3 .small, h4 small,\nh4 .small, h5 small,\nh5 .small, h6 small,\nh6 .small,\n.h1 small,\n.h1 .small, .h2 small,\n.h2 .small, .h3 small,\n.h3 .small, .h4 small,\n.h4 .small, .h5 small,\n.h5 .small, .h6 small,\n.h6 .small {\n  font-weight: normal;\n  line-height: 1;\n  color: #777777;\n}\n\nh1, .h1,\nh2, .h2,\nh3, .h3 {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n\nh1 small,\nh1 .small, .h1 small,\n.h1 .small,\nh2 small,\nh2 .small, .h2 small,\n.h2 .small,\nh3 small,\nh3 .small, .h3 small,\n.h3 .small {\n  font-size: 65%;\n}\n\nh4, .h4,\nh5, .h5,\nh6, .h6 {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n\nh4 small,\nh4 .small, .h4 small,\n.h4 .small,\nh5 small,\nh5 .small, .h5 small,\n.h5 .small,\nh6 small,\nh6 .small, .h6 small,\n.h6 .small {\n  font-size: 75%;\n}\n\nh1, .h1 {\n  font-size: 36px;\n}\n\nh2, .h2 {\n  font-size: 30px;\n}\n\nh3, .h3 {\n  font-size: 24px;\n}\n\nh4, .h4 {\n  font-size: 18px;\n}\n\nh5, .h5 {\n  font-size: 14px;\n}\n\nh6, .h6 {\n  font-size: 12px;\n}\n\np {\n  margin: 0 0 10px;\n}\n\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4;\n}\n\n@media (min-width: 768px) {\n  .lead {\n    font-size: 21px;\n  }\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nmark,\n.mark {\n  background-color: #fcf8e3;\n  padding: .2em;\n}\n\n.text-left {\n  text-align: left;\n}\n\n.text-right {\n  text-align: right;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.text-justify {\n  text-align: justify;\n}\n\n.text-nowrap {\n  white-space: nowrap;\n}\n\n.text-lowercase {\n  text-transform: lowercase;\n}\n\n.text-uppercase, .initialism {\n  text-transform: uppercase;\n}\n\n.text-capitalize {\n  text-transform: capitalize;\n}\n\n.text-muted {\n  color: #777777;\n}\n\n.text-primary {\n  color: #337ab7;\n}\n\na.text-primary:hover,\na.text-primary:focus {\n  color: #286090;\n}\n\n.text-success {\n  color: #3c763d;\n}\n\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c;\n}\n\n.text-info {\n  color: #31708f;\n}\n\na.text-info:hover,\na.text-info:focus {\n  color: #245269;\n}\n\n.text-warning {\n  color: #8a6d3b;\n}\n\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c;\n}\n\n.text-danger {\n  color: #a94442;\n}\n\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534;\n}\n\n.bg-primary {\n  color: #fff;\n}\n\n.bg-primary {\n  background-color: #337ab7;\n}\n\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #286090;\n}\n\n.bg-success {\n  background-color: #dff0d8;\n}\n\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3;\n}\n\n.bg-info {\n  background-color: #d9edf7;\n}\n\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee;\n}\n\n.bg-warning {\n  background-color: #fcf8e3;\n}\n\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5;\n}\n\n.bg-danger {\n  background-color: #f2dede;\n}\n\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9;\n}\n\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #eeeeee;\n}\n\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\n\nul ul,\nul ol,\nol ul,\nol ol {\n  margin-bottom: 0;\n}\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px;\n}\n\n.list-inline > li {\n  display: inline-block;\n  padding-left: 5px;\n  padding-right: 5px;\n}\n\ndl {\n  margin-top: 0;\n  margin-bottom: 20px;\n}\n\ndt,\ndd {\n  line-height: 1.428571429;\n}\n\ndt {\n  font-weight: bold;\n}\n\ndd {\n  margin-left: 0;\n}\n\n.dl-horizontal dd:before, .dl-horizontal dd:after {\n  content: \" \";\n  display: table;\n}\n\n.dl-horizontal dd:after {\n  clear: both;\n}\n\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .dl-horizontal dd {\n    margin-left: 180px;\n  }\n}\n\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #777777;\n}\n\n.initialism {\n  font-size: 90%;\n}\n\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #eeeeee;\n}\n\nblockquote p:last-child,\nblockquote ul:last-child,\nblockquote ol:last-child {\n  margin-bottom: 0;\n}\n\nblockquote footer,\nblockquote small,\nblockquote .small {\n  display: block;\n  font-size: 80%;\n  line-height: 1.428571429;\n  color: #777777;\n}\n\nblockquote footer:before,\nblockquote small:before,\nblockquote .small:before {\n  content: '\\2014   \\A0';\n}\n\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #eeeeee;\n  border-left: 0;\n  text-align: right;\n}\n\n.blockquote-reverse footer:before,\n.blockquote-reverse small:before,\n.blockquote-reverse .small:before,\nblockquote.pull-right footer:before,\nblockquote.pull-right small:before,\nblockquote.pull-right .small:before {\n  content: '';\n}\n\n.blockquote-reverse footer:after,\n.blockquote-reverse small:after,\n.blockquote-reverse .small:after,\nblockquote.pull-right footer:after,\nblockquote.pull-right small:after,\nblockquote.pull-right .small:after {\n  content: '\\A0   \\2014';\n}\n\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.428571429;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n}\n\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px;\n}\n\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n\nkbd kbd {\n  padding: 0;\n  font-size: 100%;\n  font-weight: bold;\n  box-shadow: none;\n}\n\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.428571429;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #333333;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n\npre code {\n  padding: 0;\n  font-size: inherit;\n  color: inherit;\n  white-space: pre-wrap;\n  background-color: transparent;\n  border-radius: 0;\n}\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n\n.container:before, .container:after {\n  content: \" \";\n  display: table;\n}\n\n.container:after {\n  clear: both;\n}\n\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n  }\n}\n\n@media (min-width: 992px) {\n  .container {\n    width: 970px;\n  }\n}\n\n@media (min-width: 1200px) {\n  .container {\n    width: 1170px;\n  }\n}\n\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n\n.container-fluid:before, .container-fluid:after {\n  content: \" \";\n  display: table;\n}\n\n.container-fluid:after {\n  clear: both;\n}\n\n.row {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n\n.row:before, .row:after {\n  content: \" \";\n  display: table;\n}\n\n.row:after {\n  clear: both;\n}\n\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left;\n}\n\n.col-xs-1 {\n  width: 8.3333333333%;\n}\n\n.col-xs-2 {\n  width: 16.6666666667%;\n}\n\n.col-xs-3 {\n  width: 25%;\n}\n\n.col-xs-4 {\n  width: 33.3333333333%;\n}\n\n.col-xs-5 {\n  width: 41.6666666667%;\n}\n\n.col-xs-6 {\n  width: 50%;\n}\n\n.col-xs-7 {\n  width: 58.3333333333%;\n}\n\n.col-xs-8 {\n  width: 66.6666666667%;\n}\n\n.col-xs-9 {\n  width: 75%;\n}\n\n.col-xs-10 {\n  width: 83.3333333333%;\n}\n\n.col-xs-11 {\n  width: 91.6666666667%;\n}\n\n.col-xs-12 {\n  width: 100%;\n}\n\n.col-xs-pull-0 {\n  right: auto;\n}\n\n.col-xs-pull-1 {\n  right: 8.3333333333%;\n}\n\n.col-xs-pull-2 {\n  right: 16.6666666667%;\n}\n\n.col-xs-pull-3 {\n  right: 25%;\n}\n\n.col-xs-pull-4 {\n  right: 33.3333333333%;\n}\n\n.col-xs-pull-5 {\n  right: 41.6666666667%;\n}\n\n.col-xs-pull-6 {\n  right: 50%;\n}\n\n.col-xs-pull-7 {\n  right: 58.3333333333%;\n}\n\n.col-xs-pull-8 {\n  right: 66.6666666667%;\n}\n\n.col-xs-pull-9 {\n  right: 75%;\n}\n\n.col-xs-pull-10 {\n  right: 83.3333333333%;\n}\n\n.col-xs-pull-11 {\n  right: 91.6666666667%;\n}\n\n.col-xs-pull-12 {\n  right: 100%;\n}\n\n.col-xs-push-0 {\n  left: auto;\n}\n\n.col-xs-push-1 {\n  left: 8.3333333333%;\n}\n\n.col-xs-push-2 {\n  left: 16.6666666667%;\n}\n\n.col-xs-push-3 {\n  left: 25%;\n}\n\n.col-xs-push-4 {\n  left: 33.3333333333%;\n}\n\n.col-xs-push-5 {\n  left: 41.6666666667%;\n}\n\n.col-xs-push-6 {\n  left: 50%;\n}\n\n.col-xs-push-7 {\n  left: 58.3333333333%;\n}\n\n.col-xs-push-8 {\n  left: 66.6666666667%;\n}\n\n.col-xs-push-9 {\n  left: 75%;\n}\n\n.col-xs-push-10 {\n  left: 83.3333333333%;\n}\n\n.col-xs-push-11 {\n  left: 91.6666666667%;\n}\n\n.col-xs-push-12 {\n  left: 100%;\n}\n\n.col-xs-offset-0 {\n  margin-left: 0%;\n}\n\n.col-xs-offset-1 {\n  margin-left: 8.3333333333%;\n}\n\n.col-xs-offset-2 {\n  margin-left: 16.6666666667%;\n}\n\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n\n.col-xs-offset-4 {\n  margin-left: 33.3333333333%;\n}\n\n.col-xs-offset-5 {\n  margin-left: 41.6666666667%;\n}\n\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n\n.col-xs-offset-7 {\n  margin-left: 58.3333333333%;\n}\n\n.col-xs-offset-8 {\n  margin-left: 66.6666666667%;\n}\n\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n\n.col-xs-offset-10 {\n  margin-left: 83.3333333333%;\n}\n\n.col-xs-offset-11 {\n  margin-left: 91.6666666667%;\n}\n\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left;\n  }\n  .col-sm-1 {\n    width: 8.3333333333%;\n  }\n  .col-sm-2 {\n    width: 16.6666666667%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-4 {\n    width: 33.3333333333%;\n  }\n  .col-sm-5 {\n    width: 41.6666666667%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-7 {\n    width: 58.3333333333%;\n  }\n  .col-sm-8 {\n    width: 66.6666666667%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-10 {\n    width: 83.3333333333%;\n  }\n  .col-sm-11 {\n    width: 91.6666666667%;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-pull-1 {\n    right: 8.3333333333%;\n  }\n  .col-sm-pull-2 {\n    right: 16.6666666667%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-4 {\n    right: 33.3333333333%;\n  }\n  .col-sm-pull-5 {\n    right: 41.6666666667%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-7 {\n    right: 58.3333333333%;\n  }\n  .col-sm-pull-8 {\n    right: 66.6666666667%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-10 {\n    right: 83.3333333333%;\n  }\n  .col-sm-pull-11 {\n    right: 91.6666666667%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-push-1 {\n    left: 8.3333333333%;\n  }\n  .col-sm-push-2 {\n    left: 16.6666666667%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-4 {\n    left: 33.3333333333%;\n  }\n  .col-sm-push-5 {\n    left: 41.6666666667%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-7 {\n    left: 58.3333333333%;\n  }\n  .col-sm-push-8 {\n    left: 66.6666666667%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-10 {\n    left: 83.3333333333%;\n  }\n  .col-sm-push-11 {\n    left: 91.6666666667%;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0%;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.3333333333%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.6666666667%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.3333333333%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.6666666667%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.3333333333%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.6666666667%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.3333333333%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.6666666667%;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left;\n  }\n  .col-md-1 {\n    width: 8.3333333333%;\n  }\n  .col-md-2 {\n    width: 16.6666666667%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-4 {\n    width: 33.3333333333%;\n  }\n  .col-md-5 {\n    width: 41.6666666667%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-7 {\n    width: 58.3333333333%;\n  }\n  .col-md-8 {\n    width: 66.6666666667%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-10 {\n    width: 83.3333333333%;\n  }\n  .col-md-11 {\n    width: 91.6666666667%;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-pull-1 {\n    right: 8.3333333333%;\n  }\n  .col-md-pull-2 {\n    right: 16.6666666667%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-4 {\n    right: 33.3333333333%;\n  }\n  .col-md-pull-5 {\n    right: 41.6666666667%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-7 {\n    right: 58.3333333333%;\n  }\n  .col-md-pull-8 {\n    right: 66.6666666667%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-10 {\n    right: 83.3333333333%;\n  }\n  .col-md-pull-11 {\n    right: 91.6666666667%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-push-1 {\n    left: 8.3333333333%;\n  }\n  .col-md-push-2 {\n    left: 16.6666666667%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-4 {\n    left: 33.3333333333%;\n  }\n  .col-md-push-5 {\n    left: 41.6666666667%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-7 {\n    left: 58.3333333333%;\n  }\n  .col-md-push-8 {\n    left: 66.6666666667%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-10 {\n    left: 83.3333333333%;\n  }\n  .col-md-push-11 {\n    left: 91.6666666667%;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0%;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.3333333333%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.6666666667%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.3333333333%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.6666666667%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.3333333333%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.6666666667%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.3333333333%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.6666666667%;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left;\n  }\n  .col-lg-1 {\n    width: 8.3333333333%;\n  }\n  .col-lg-2 {\n    width: 16.6666666667%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-4 {\n    width: 33.3333333333%;\n  }\n  .col-lg-5 {\n    width: 41.6666666667%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-7 {\n    width: 58.3333333333%;\n  }\n  .col-lg-8 {\n    width: 66.6666666667%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-10 {\n    width: 83.3333333333%;\n  }\n  .col-lg-11 {\n    width: 91.6666666667%;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-pull-1 {\n    right: 8.3333333333%;\n  }\n  .col-lg-pull-2 {\n    right: 16.6666666667%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-4 {\n    right: 33.3333333333%;\n  }\n  .col-lg-pull-5 {\n    right: 41.6666666667%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-7 {\n    right: 58.3333333333%;\n  }\n  .col-lg-pull-8 {\n    right: 66.6666666667%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-10 {\n    right: 83.3333333333%;\n  }\n  .col-lg-pull-11 {\n    right: 91.6666666667%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-push-1 {\n    left: 8.3333333333%;\n  }\n  .col-lg-push-2 {\n    left: 16.6666666667%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-4 {\n    left: 33.3333333333%;\n  }\n  .col-lg-push-5 {\n    left: 41.6666666667%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-7 {\n    left: 58.3333333333%;\n  }\n  .col-lg-push-8 {\n    left: 66.6666666667%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-10 {\n    left: 83.3333333333%;\n  }\n  .col-lg-push-11 {\n    left: 91.6666666667%;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0%;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.3333333333%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.6666666667%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.3333333333%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.6666666667%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.3333333333%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.6666666667%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.3333333333%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.6666666667%;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n}\n\ntable {\n  background-color: transparent;\n}\n\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #777777;\n  text-align: left;\n}\n\nth {\n  text-align: left;\n}\n\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px;\n}\n\n.table > thead > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > th,\n.table > tbody > tr > td,\n.table > tfoot > tr > th,\n.table > tfoot > tr > td {\n  padding: 8px;\n  line-height: 1.428571429;\n  vertical-align: top;\n  border-top: 1px solid #ddd;\n}\n\n.table > thead > tr > th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #ddd;\n}\n\n.table > caption + thead > tr:first-child > th,\n.table > caption + thead > tr:first-child > td,\n.table > colgroup + thead > tr:first-child > th,\n.table > colgroup + thead > tr:first-child > td,\n.table > thead:first-child > tr:first-child > th,\n.table > thead:first-child > tr:first-child > td {\n  border-top: 0;\n}\n\n.table > tbody + tbody {\n  border-top: 2px solid #ddd;\n}\n\n.table .table {\n  background-color: #fff;\n}\n\n.table-condensed > thead > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > th,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > th,\n.table-condensed > tfoot > tr > td {\n  padding: 5px;\n}\n\n.table-bordered {\n  border: 1px solid #ddd;\n}\n\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td,\n.table-bordered > tbody > tr > th,\n.table-bordered > tbody > tr > td,\n.table-bordered > tfoot > tr > th,\n.table-bordered > tfoot > tr > td {\n  border: 1px solid #ddd;\n}\n\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td {\n  border-bottom-width: 2px;\n}\n\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5;\n}\n\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column;\n}\n\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell;\n}\n\n.table > thead > tr > td.active, .table > thead > tr > td.ax-active,\n.table > thead > tr > th.active,\n.table > thead > tr > th.ax-active,\n.table > thead > tr.active > td,\n.table > thead > tr.ax-active > td,\n.table > thead > tr.active > th,\n.table > thead > tr.ax-active > th,\n.table > tbody > tr > td.active,\n.table > tbody > tr > td.ax-active,\n.table > tbody > tr > th.active,\n.table > tbody > tr > th.ax-active,\n.table > tbody > tr.active > td,\n.table > tbody > tr.ax-active > td,\n.table > tbody > tr.active > th,\n.table > tbody > tr.ax-active > th,\n.table > tfoot > tr > td.active,\n.table > tfoot > tr > td.ax-active,\n.table > tfoot > tr > th.active,\n.table > tfoot > tr > th.ax-active,\n.table > tfoot > tr.active > td,\n.table > tfoot > tr.ax-active > td,\n.table > tfoot > tr.active > th,\n.table > tfoot > tr.ax-active > th {\n  background-color: #f5f5f5;\n}\n\n.table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > td.ax-active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr > th.ax-active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr.ax-active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr:hover > .ax-active,\n.table-hover > tbody > tr.active:hover > th,\n.table-hover > tbody > tr.ax-active:hover > th {\n  background-color: #e8e8e8;\n}\n\n.table > thead > tr > td.success,\n.table > thead > tr > th.success,\n.table > thead > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr > td.success,\n.table > tbody > tr > th.success,\n.table > tbody > tr.success > td,\n.table > tbody > tr.success > th,\n.table > tfoot > tr > td.success,\n.table > tfoot > tr > th.success,\n.table > tfoot > tr.success > td,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8;\n}\n\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6;\n}\n\n.table > thead > tr > td.info,\n.table > thead > tr > th.info,\n.table > thead > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr > td.info,\n.table > tbody > tr > th.info,\n.table > tbody > tr.info > td,\n.table > tbody > tr.info > th,\n.table > tfoot > tr > td.info,\n.table > tfoot > tr > th.info,\n.table > tfoot > tr.info > td,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7;\n}\n\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3;\n}\n\n.table > thead > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr > td.warning,\n.table > tbody > tr > th.warning,\n.table > tbody > tr.warning > td,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr > td.warning,\n.table > tfoot > tr > th.warning,\n.table > tfoot > tr.warning > td,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3;\n}\n\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc;\n}\n\n.table > thead > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr > td.danger,\n.table > tbody > tr > th.danger,\n.table > tbody > tr.danger > td,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr > td.danger,\n.table > tfoot > tr > th.danger,\n.table > tfoot > tr.danger > td,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede;\n}\n\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc;\n}\n\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%;\n}\n\n@media screen and (max-width: 767px) {\n  .table-responsive {\n    width: 100%;\n    margin-bottom: 15px;\n    overflow-y: hidden;\n    -ms-overflow-style: -ms-autohiding-scrollbar;\n    border: 1px solid #ddd;\n  }\n  .table-responsive > .table {\n    margin-bottom: 0;\n  }\n  .table-responsive > .table > thead > tr > th,\n  .table-responsive > .table > thead > tr > td,\n  .table-responsive > .table > tbody > tr > th,\n  .table-responsive > .table > tbody > tr > td,\n  .table-responsive > .table > tfoot > tr > th,\n  .table-responsive > .table > tfoot > tr > td {\n    white-space: nowrap;\n  }\n  .table-responsive > .table-bordered {\n    border: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0;\n  }\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n    border-bottom: 0;\n  }\n}\n\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0;\n}\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5;\n}\n\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold;\n}\n\ninput[type=\"search\"] {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal;\n}\n\ninput[type=\"file\"] {\n  display: block;\n}\n\ninput[type=\"range\"] {\n  display: block;\n  width: 100%;\n}\n\nselect[multiple],\nselect[size] {\n  height: auto;\n}\n\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.428571429;\n  color: #555555;\n}\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.428571429;\n  color: #555555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n}\n\n.form-control:focus {\n  border-color: #66afe9;\n  outline: 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n}\n\n.form-control::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.form-control:-ms-input-placeholder {\n  color: #999;\n}\n\n.form-control::-webkit-input-placeholder {\n  color: #999;\n}\n\n.form-control::-ms-expand {\n  border: 0;\n  background-color: transparent;\n}\n\n.form-control[disabled], .form-control[readonly],\nfieldset[disabled] .form-control {\n  background-color: #eeeeee;\n  opacity: 1;\n}\n\n.form-control[disabled],\nfieldset[disabled] .form-control {\n  cursor: not-allowed;\n}\n\ntextarea.form-control {\n  height: auto;\n}\n\ninput[type=\"search\"] {\n  -webkit-appearance: none;\n}\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px;\n  }\n  input[type=\"date\"].input-sm, .input-group-sm > input[type=\"date\"].form-control,\n  .input-group-sm > input[type=\"date\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-sm input[type=\"date\"],\n  input[type=\"time\"].input-sm,\n  .input-group-sm > input[type=\"time\"].form-control,\n  .input-group-sm > input[type=\"time\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-sm\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-sm,\n  .input-group-sm > input[type=\"datetime-local\"].form-control,\n  .input-group-sm > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-sm\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-sm,\n  .input-group-sm > input[type=\"month\"].form-control,\n  .input-group-sm > input[type=\"month\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-sm\n  input[type=\"month\"] {\n    line-height: 30px;\n  }\n  input[type=\"date\"].input-lg, .input-group-lg > input[type=\"date\"].form-control,\n  .input-group-lg > input[type=\"date\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-lg input[type=\"date\"],\n  input[type=\"time\"].input-lg,\n  .input-group-lg > input[type=\"time\"].form-control,\n  .input-group-lg > input[type=\"time\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-lg\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-lg,\n  .input-group-lg > input[type=\"datetime-local\"].form-control,\n  .input-group-lg > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-lg\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-lg,\n  .input-group-lg > input[type=\"month\"].form-control,\n  .input-group-lg > input[type=\"month\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-lg\n  input[type=\"month\"] {\n    line-height: 46px;\n  }\n}\n\n.form-group {\n  margin-bottom: 15px;\n}\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n\n.radio label,\n.checkbox label {\n  min-height: 20px;\n  padding-left: 20px;\n  margin-bottom: 0;\n  font-weight: normal;\n  cursor: pointer;\n}\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9;\n}\n\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px;\n}\n\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer;\n}\n\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px;\n}\n\ninput[type=\"radio\"][disabled], input[type=\"radio\"].disabled, input[type=\"radio\"][disabled],\ninput[type=\"radio\"].ax-disabled,\nfieldset[disabled] input[type=\"radio\"],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"checkbox\"].disabled,\ninput[type=\"checkbox\"][disabled],\ninput[type=\"checkbox\"].ax-disabled,\nfieldset[disabled]\ninput[type=\"checkbox\"] {\n  cursor: not-allowed;\n}\n\n.radio-inline.disabled, .radio-inline[disabled],\n.radio-inline.ax-disabled,\nfieldset[disabled] .radio-inline,\n.checkbox-inline.disabled,\n.checkbox-inline[disabled],\n.checkbox-inline.ax-disabled,\nfieldset[disabled]\n.checkbox-inline {\n  cursor: not-allowed;\n}\n\n.radio.disabled label, .radio[disabled] label,\n.radio.ax-disabled label,\nfieldset[disabled] .radio label,\n.checkbox.disabled label, .checkbox[disabled] label,\n.checkbox.ax-disabled label,\nfieldset[disabled]\n.checkbox label {\n  cursor: not-allowed;\n}\n\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 34px;\n}\n\n.form-control-static.input-lg, .input-group-lg > .form-control-static.form-control,\n.input-group-lg > .form-control-static.input-group-addon,\n.input-group-lg > .input-group-btn > .form-control-static.btn, .form-control-static.input-sm, .input-group-sm > .form-control-static.form-control,\n.input-group-sm > .form-control-static.input-group-addon,\n.input-group-sm > .input-group-btn > .form-control-static.btn {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.input-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n\nselect.input-sm, .input-group-sm > select.form-control,\n.input-group-sm > select.input-group-addon,\n.input-group-sm > .input-group-btn > select.btn {\n  height: 30px;\n  line-height: 30px;\n}\n\ntextarea.input-sm, .input-group-sm > textarea.form-control,\n.input-group-sm > textarea.input-group-addon,\n.input-group-sm > .input-group-btn > textarea.btn,\nselect[multiple].input-sm,\n.input-group-sm > select[multiple].form-control,\n.input-group-sm > select[multiple].input-group-addon,\n.input-group-sm > .input-group-btn > select[multiple].btn {\n  height: auto;\n}\n\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px;\n}\n\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto;\n}\n\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n.input-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n\nselect.input-lg, .input-group-lg > select.form-control,\n.input-group-lg > select.input-group-addon,\n.input-group-lg > .input-group-btn > select.btn {\n  height: 46px;\n  line-height: 46px;\n}\n\ntextarea.input-lg, .input-group-lg > textarea.form-control,\n.input-group-lg > textarea.input-group-addon,\n.input-group-lg > .input-group-btn > textarea.btn,\nselect[multiple].input-lg,\n.input-group-lg > select[multiple].form-control,\n.input-group-lg > select[multiple].input-group-addon,\n.input-group-lg > .input-group-btn > select[multiple].btn {\n  height: auto;\n}\n\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px;\n}\n\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto;\n}\n\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n\n.has-feedback {\n  position: relative;\n}\n\n.has-feedback .form-control {\n  padding-right: 42.5px;\n}\n\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none;\n}\n\n.input-lg + .form-control-feedback, .input-group-lg > .form-control + .form-control-feedback,\n.input-group-lg > .input-group-addon + .form-control-feedback,\n.input-group-lg > .input-group-btn > .btn + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px;\n}\n\n.input-sm + .form-control-feedback, .input-group-sm > .form-control + .form-control-feedback,\n.input-group-sm > .input-group-addon + .form-control-feedback,\n.input-group-sm > .input-group-btn > .btn + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d;\n}\n\n.has-success .form-control {\n  border-color: #3c763d;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n\n.has-success .form-control:focus {\n  border-color: #2b542c;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n}\n\n.has-success .input-group-addon {\n  color: #3c763d;\n  border-color: #3c763d;\n  background-color: #dff0d8;\n}\n\n.has-success .form-control-feedback {\n  color: #3c763d;\n}\n\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b;\n}\n\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n\n.has-warning .form-control:focus {\n  border-color: #66512c;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n}\n\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #fcf8e3;\n}\n\n.has-warning .form-control-feedback {\n  color: #8a6d3b;\n}\n\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442;\n}\n\n.has-error .form-control {\n  border-color: #a94442;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n\n.has-error .form-control:focus {\n  border-color: #843534;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n}\n\n.has-error .input-group-addon {\n  color: #a94442;\n  border-color: #a94442;\n  background-color: #f2dede;\n}\n\n.has-error .form-control-feedback {\n  color: #a94442;\n}\n\n.has-feedback label ~ .form-control-feedback {\n  top: 25px;\n}\n\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0;\n}\n\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373;\n}\n\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .form-inline .form-control-static {\n    display: inline-block;\n  }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .form-inline .input-group .input-group-addon,\n  .form-inline .input-group .input-group-btn,\n  .form-inline .input-group .form-control {\n    width: auto;\n  }\n  .form-inline .input-group > .form-control {\n    width: 100%;\n  }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio label,\n  .form-inline .checkbox label {\n    padding-left: 0;\n  }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px;\n}\n\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px;\n}\n\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n\n.form-horizontal .form-group:before, .form-horizontal .form-group:after {\n  content: \" \";\n  display: table;\n}\n\n.form-horizontal .form-group:after {\n  clear: both;\n}\n\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px;\n  }\n}\n\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px;\n}\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px;\n  }\n}\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px;\n  }\n}\n\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  -ms-touch-action: manipulation;\n      touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.428571429;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.btn:focus, .btn.focus, .btn:active:focus, .btn:active.focus, .btn.active:focus, .btn.ax-active:focus, .btn.active.focus, .btn.focus.ax-active {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\n.btn:hover, .btn:focus, .btn.focus {\n  color: #333;\n  text-decoration: none;\n}\n\n.btn:active, .btn.active, .btn.ax-active {\n  outline: 0;\n  background-image: none;\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n\n.btn.disabled, .btn[disabled],\n.btn.ax-disabled, .btn[disabled],\nfieldset[disabled] .btn {\n  cursor: not-allowed;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  box-shadow: none;\n}\n\na.btn.disabled, a.btn[disabled],\na.btn.ax-disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none;\n}\n\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n\n.btn-default:focus, .btn-default.focus {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #8c8c8c;\n}\n\n.btn-default:hover {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n\n.btn-default:active, .btn-default.active, .btn-default.ax-active,\n.open > .btn-default.dropdown-toggle {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n\n.btn-default:active:hover, .btn-default:active:focus, .btn-default:active.focus, .btn-default.active:hover, .btn-default.ax-active:hover, .btn-default.active:focus, .btn-default.ax-active:focus, .btn-default.active.focus, .btn-default.focus.ax-active,\n.open > .btn-default.dropdown-toggle:hover,\n.open > .btn-default.dropdown-toggle:focus,\n.open > .btn-default.dropdown-toggle.focus {\n  color: #333;\n  background-color: #d4d4d4;\n  border-color: #8c8c8c;\n}\n\n.btn-default:active, .btn-default.active, .btn-default.ax-active,\n.open > .btn-default.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-default.disabled:hover, .btn-default[disabled]:hover,\n.btn-default.ax-disabled:hover, .btn-default.disabled:focus, .btn-default[disabled]:focus,\n.btn-default.ax-disabled:focus, .btn-default.disabled.focus, .btn-default.focus[disabled],\n.btn-default.focus.ax-disabled, .btn-default[disabled]:hover, .btn-default[disabled]:focus, .btn-default[disabled].focus,\nfieldset[disabled] .btn-default:hover,\nfieldset[disabled] .btn-default:focus,\nfieldset[disabled] .btn-default.focus {\n  background-color: #fff;\n  border-color: #ccc;\n}\n\n.btn-default .badge {\n  color: #fff;\n  background-color: #333;\n}\n\n.btn-primary {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #2e6da4;\n}\n\n.btn-primary:focus, .btn-primary.focus {\n  color: #fff;\n  background-color: #286090;\n  border-color: #122b40;\n}\n\n.btn-primary:hover {\n  color: #fff;\n  background-color: #286090;\n  border-color: #204d74;\n}\n\n.btn-primary:active, .btn-primary.active, .btn-primary.ax-active,\n.open > .btn-primary.dropdown-toggle {\n  color: #fff;\n  background-color: #286090;\n  border-color: #204d74;\n}\n\n.btn-primary:active:hover, .btn-primary:active:focus, .btn-primary:active.focus, .btn-primary.active:hover, .btn-primary.ax-active:hover, .btn-primary.active:focus, .btn-primary.ax-active:focus, .btn-primary.active.focus, .btn-primary.focus.ax-active,\n.open > .btn-primary.dropdown-toggle:hover,\n.open > .btn-primary.dropdown-toggle:focus,\n.open > .btn-primary.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #204d74;\n  border-color: #122b40;\n}\n\n.btn-primary:active, .btn-primary.active, .btn-primary.ax-active,\n.open > .btn-primary.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-primary.disabled:hover, .btn-primary[disabled]:hover,\n.btn-primary.ax-disabled:hover, .btn-primary.disabled:focus, .btn-primary[disabled]:focus,\n.btn-primary.ax-disabled:focus, .btn-primary.disabled.focus, .btn-primary.focus[disabled],\n.btn-primary.focus.ax-disabled, .btn-primary[disabled]:hover, .btn-primary[disabled]:focus, .btn-primary[disabled].focus,\nfieldset[disabled] .btn-primary:hover,\nfieldset[disabled] .btn-primary:focus,\nfieldset[disabled] .btn-primary.focus {\n  background-color: #337ab7;\n  border-color: #2e6da4;\n}\n\n.btn-primary .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #4cae4c;\n}\n\n.btn-success:focus, .btn-success.focus {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #255625;\n}\n\n.btn-success:hover {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #398439;\n}\n\n.btn-success:active, .btn-success.active, .btn-success.ax-active,\n.open > .btn-success.dropdown-toggle {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #398439;\n}\n\n.btn-success:active:hover, .btn-success:active:focus, .btn-success:active.focus, .btn-success.active:hover, .btn-success.ax-active:hover, .btn-success.active:focus, .btn-success.ax-active:focus, .btn-success.active.focus, .btn-success.focus.ax-active,\n.open > .btn-success.dropdown-toggle:hover,\n.open > .btn-success.dropdown-toggle:focus,\n.open > .btn-success.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #398439;\n  border-color: #255625;\n}\n\n.btn-success:active, .btn-success.active, .btn-success.ax-active,\n.open > .btn-success.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-success.disabled:hover, .btn-success[disabled]:hover,\n.btn-success.ax-disabled:hover, .btn-success.disabled:focus, .btn-success[disabled]:focus,\n.btn-success.ax-disabled:focus, .btn-success.disabled.focus, .btn-success.focus[disabled],\n.btn-success.focus.ax-disabled, .btn-success[disabled]:hover, .btn-success[disabled]:focus, .btn-success[disabled].focus,\nfieldset[disabled] .btn-success:hover,\nfieldset[disabled] .btn-success:focus,\nfieldset[disabled] .btn-success.focus {\n  background-color: #5cb85c;\n  border-color: #4cae4c;\n}\n\n.btn-success .badge {\n  color: #5cb85c;\n  background-color: #fff;\n}\n\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n\n.btn-info:focus, .btn-info.focus {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #1b6d85;\n}\n\n.btn-info:hover {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n\n.btn-info:active, .btn-info.active, .btn-info.ax-active,\n.open > .btn-info.dropdown-toggle {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n\n.btn-info:active:hover, .btn-info:active:focus, .btn-info:active.focus, .btn-info.active:hover, .btn-info.ax-active:hover, .btn-info.active:focus, .btn-info.ax-active:focus, .btn-info.active.focus, .btn-info.focus.ax-active,\n.open > .btn-info.dropdown-toggle:hover,\n.open > .btn-info.dropdown-toggle:focus,\n.open > .btn-info.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #269abc;\n  border-color: #1b6d85;\n}\n\n.btn-info:active, .btn-info.active, .btn-info.ax-active,\n.open > .btn-info.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-info.disabled:hover, .btn-info[disabled]:hover,\n.btn-info.ax-disabled:hover, .btn-info.disabled:focus, .btn-info[disabled]:focus,\n.btn-info.ax-disabled:focus, .btn-info.disabled.focus, .btn-info.focus[disabled],\n.btn-info.focus.ax-disabled, .btn-info[disabled]:hover, .btn-info[disabled]:focus, .btn-info[disabled].focus,\nfieldset[disabled] .btn-info:hover,\nfieldset[disabled] .btn-info:focus,\nfieldset[disabled] .btn-info.focus {\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n\n.btn-info .badge {\n  color: #5bc0de;\n  background-color: #fff;\n}\n\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n\n.btn-warning:focus, .btn-warning.focus {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #985f0d;\n}\n\n.btn-warning:hover {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n\n.btn-warning:active, .btn-warning.active, .btn-warning.ax-active,\n.open > .btn-warning.dropdown-toggle {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n\n.btn-warning:active:hover, .btn-warning:active:focus, .btn-warning:active.focus, .btn-warning.active:hover, .btn-warning.ax-active:hover, .btn-warning.active:focus, .btn-warning.ax-active:focus, .btn-warning.active.focus, .btn-warning.focus.ax-active,\n.open > .btn-warning.dropdown-toggle:hover,\n.open > .btn-warning.dropdown-toggle:focus,\n.open > .btn-warning.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #d58512;\n  border-color: #985f0d;\n}\n\n.btn-warning:active, .btn-warning.active, .btn-warning.ax-active,\n.open > .btn-warning.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-warning.disabled:hover, .btn-warning[disabled]:hover,\n.btn-warning.ax-disabled:hover, .btn-warning.disabled:focus, .btn-warning[disabled]:focus,\n.btn-warning.ax-disabled:focus, .btn-warning.disabled.focus, .btn-warning.focus[disabled],\n.btn-warning.focus.ax-disabled, .btn-warning[disabled]:hover, .btn-warning[disabled]:focus, .btn-warning[disabled].focus,\nfieldset[disabled] .btn-warning:hover,\nfieldset[disabled] .btn-warning:focus,\nfieldset[disabled] .btn-warning.focus {\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n\n.btn-warning .badge {\n  color: #f0ad4e;\n  background-color: #fff;\n}\n\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n\n.btn-danger:focus, .btn-danger.focus {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #761c19;\n}\n\n.btn-danger:hover {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n\n.btn-danger:active, .btn-danger.active, .btn-danger.ax-active,\n.open > .btn-danger.dropdown-toggle {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n\n.btn-danger:active:hover, .btn-danger:active:focus, .btn-danger:active.focus, .btn-danger.active:hover, .btn-danger.ax-active:hover, .btn-danger.active:focus, .btn-danger.ax-active:focus, .btn-danger.active.focus, .btn-danger.focus.ax-active,\n.open > .btn-danger.dropdown-toggle:hover,\n.open > .btn-danger.dropdown-toggle:focus,\n.open > .btn-danger.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #ac2925;\n  border-color: #761c19;\n}\n\n.btn-danger:active, .btn-danger.active, .btn-danger.ax-active,\n.open > .btn-danger.dropdown-toggle {\n  background-image: none;\n}\n\n.btn-danger.disabled:hover, .btn-danger[disabled]:hover,\n.btn-danger.ax-disabled:hover, .btn-danger.disabled:focus, .btn-danger[disabled]:focus,\n.btn-danger.ax-disabled:focus, .btn-danger.disabled.focus, .btn-danger.focus[disabled],\n.btn-danger.focus.ax-disabled, .btn-danger[disabled]:hover, .btn-danger[disabled]:focus, .btn-danger[disabled].focus,\nfieldset[disabled] .btn-danger:hover,\nfieldset[disabled] .btn-danger:focus,\nfieldset[disabled] .btn-danger.focus {\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n\n.btn-danger .badge {\n  color: #d9534f;\n  background-color: #fff;\n}\n\n.btn-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0;\n}\n\n.btn-link, .btn-link:active, .btn-link.active, .btn-link.ax-active, .btn-link[disabled],\nfieldset[disabled] .btn-link {\n  background-color: transparent;\n  box-shadow: none;\n}\n\n.btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {\n  border-color: transparent;\n}\n\n.btn-link:hover, .btn-link:focus {\n  color: #23527c;\n  text-decoration: underline;\n  background-color: transparent;\n}\n\n.btn-link[disabled]:hover, .btn-link[disabled]:focus,\nfieldset[disabled] .btn-link:hover,\nfieldset[disabled] .btn-link:focus {\n  color: #777777;\n  text-decoration: none;\n}\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n\n.btn-xs, .btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n\n.btn-block {\n  display: block;\n  width: 100%;\n}\n\n.btn-block + .btn-block {\n  margin-top: 5px;\n}\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear;\n}\n\n.fade.in {\n  opacity: 1;\n}\n\n.collapse {\n  display: none;\n}\n\n.collapse.in {\n  display: block;\n}\n\ntr.collapse.in {\n  display: table-row;\n}\n\ntbody.collapse.in {\n  display: table-row-group;\n}\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease;\n}\n\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url(" + __webpack_require__(255) + ");\n  src: url(" + __webpack_require__(255) + "?#iefix) format(\"embedded-opentype\"), url(" + __webpack_require__(256) + ") format(\"woff2\"), url(" + __webpack_require__(257) + ") format(\"woff\"), url(" + __webpack_require__(258) + ") format(\"truetype\"), url(" + __webpack_require__(259) + "#glyphicons_halflingsregular) format(\"svg\");\n}\n\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.glyphicon-asterisk:before {\n  content: \"*\";\n}\n\n.glyphicon-plus:before {\n  content: \"+\";\n}\n\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20AC\";\n}\n\n.glyphicon-minus:before {\n  content: \"\\2212\";\n}\n\n.glyphicon-cloud:before {\n  content: \"\\2601\";\n}\n\n.glyphicon-envelope:before {\n  content: \"\\2709\";\n}\n\n.glyphicon-pencil:before {\n  content: \"\\270F\";\n}\n\n.glyphicon-glass:before {\n  content: \"\\E001\";\n}\n\n.glyphicon-music:before {\n  content: \"\\E002\";\n}\n\n.glyphicon-search:before {\n  content: \"\\E003\";\n}\n\n.glyphicon-heart:before {\n  content: \"\\E005\";\n}\n\n.glyphicon-star:before {\n  content: \"\\E006\";\n}\n\n.glyphicon-star-empty:before {\n  content: \"\\E007\";\n}\n\n.glyphicon-user:before {\n  content: \"\\E008\";\n}\n\n.glyphicon-film:before {\n  content: \"\\E009\";\n}\n\n.glyphicon-th-large:before {\n  content: \"\\E010\";\n}\n\n.glyphicon-th:before {\n  content: \"\\E011\";\n}\n\n.glyphicon-th-list:before {\n  content: \"\\E012\";\n}\n\n.glyphicon-ok:before {\n  content: \"\\E013\";\n}\n\n.glyphicon-remove:before {\n  content: \"\\E014\";\n}\n\n.glyphicon-zoom-in:before {\n  content: \"\\E015\";\n}\n\n.glyphicon-zoom-out:before {\n  content: \"\\E016\";\n}\n\n.glyphicon-off:before {\n  content: \"\\E017\";\n}\n\n.glyphicon-signal:before {\n  content: \"\\E018\";\n}\n\n.glyphicon-cog:before {\n  content: \"\\E019\";\n}\n\n.glyphicon-trash:before {\n  content: \"\\E020\";\n}\n\n.glyphicon-home:before {\n  content: \"\\E021\";\n}\n\n.glyphicon-file:before {\n  content: \"\\E022\";\n}\n\n.glyphicon-time:before {\n  content: \"\\E023\";\n}\n\n.glyphicon-road:before {\n  content: \"\\E024\";\n}\n\n.glyphicon-download-alt:before {\n  content: \"\\E025\";\n}\n\n.glyphicon-download:before {\n  content: \"\\E026\";\n}\n\n.glyphicon-upload:before {\n  content: \"\\E027\";\n}\n\n.glyphicon-inbox:before {\n  content: \"\\E028\";\n}\n\n.glyphicon-play-circle:before {\n  content: \"\\E029\";\n}\n\n.glyphicon-repeat:before {\n  content: \"\\E030\";\n}\n\n.glyphicon-refresh:before {\n  content: \"\\E031\";\n}\n\n.glyphicon-list-alt:before {\n  content: \"\\E032\";\n}\n\n.glyphicon-lock:before {\n  content: \"\\E033\";\n}\n\n.glyphicon-flag:before {\n  content: \"\\E034\";\n}\n\n.glyphicon-headphones:before {\n  content: \"\\E035\";\n}\n\n.glyphicon-volume-off:before {\n  content: \"\\E036\";\n}\n\n.glyphicon-volume-down:before {\n  content: \"\\E037\";\n}\n\n.glyphicon-volume-up:before {\n  content: \"\\E038\";\n}\n\n.glyphicon-qrcode:before {\n  content: \"\\E039\";\n}\n\n.glyphicon-barcode:before {\n  content: \"\\E040\";\n}\n\n.glyphicon-tag:before {\n  content: \"\\E041\";\n}\n\n.glyphicon-tags:before {\n  content: \"\\E042\";\n}\n\n.glyphicon-book:before {\n  content: \"\\E043\";\n}\n\n.glyphicon-bookmark:before {\n  content: \"\\E044\";\n}\n\n.glyphicon-print:before {\n  content: \"\\E045\";\n}\n\n.glyphicon-camera:before {\n  content: \"\\E046\";\n}\n\n.glyphicon-font:before {\n  content: \"\\E047\";\n}\n\n.glyphicon-bold:before {\n  content: \"\\E048\";\n}\n\n.glyphicon-italic:before {\n  content: \"\\E049\";\n}\n\n.glyphicon-text-height:before {\n  content: \"\\E050\";\n}\n\n.glyphicon-text-width:before {\n  content: \"\\E051\";\n}\n\n.glyphicon-align-left:before {\n  content: \"\\E052\";\n}\n\n.glyphicon-align-center:before {\n  content: \"\\E053\";\n}\n\n.glyphicon-align-right:before {\n  content: \"\\E054\";\n}\n\n.glyphicon-align-justify:before {\n  content: \"\\E055\";\n}\n\n.glyphicon-list:before {\n  content: \"\\E056\";\n}\n\n.glyphicon-indent-left:before {\n  content: \"\\E057\";\n}\n\n.glyphicon-indent-right:before {\n  content: \"\\E058\";\n}\n\n.glyphicon-facetime-video:before {\n  content: \"\\E059\";\n}\n\n.glyphicon-picture:before {\n  content: \"\\E060\";\n}\n\n.glyphicon-map-marker:before {\n  content: \"\\E062\";\n}\n\n.glyphicon-adjust:before {\n  content: \"\\E063\";\n}\n\n.glyphicon-tint:before {\n  content: \"\\E064\";\n}\n\n.glyphicon-edit:before {\n  content: \"\\E065\";\n}\n\n.glyphicon-share:before {\n  content: \"\\E066\";\n}\n\n.glyphicon-check:before {\n  content: \"\\E067\";\n}\n\n.glyphicon-move:before {\n  content: \"\\E068\";\n}\n\n.glyphicon-step-backward:before {\n  content: \"\\E069\";\n}\n\n.glyphicon-fast-backward:before {\n  content: \"\\E070\";\n}\n\n.glyphicon-backward:before {\n  content: \"\\E071\";\n}\n\n.glyphicon-play:before {\n  content: \"\\E072\";\n}\n\n.glyphicon-pause:before {\n  content: \"\\E073\";\n}\n\n.glyphicon-stop:before {\n  content: \"\\E074\";\n}\n\n.glyphicon-forward:before {\n  content: \"\\E075\";\n}\n\n.glyphicon-fast-forward:before {\n  content: \"\\E076\";\n}\n\n.glyphicon-step-forward:before {\n  content: \"\\E077\";\n}\n\n.glyphicon-eject:before {\n  content: \"\\E078\";\n}\n\n.glyphicon-chevron-left:before {\n  content: \"\\E079\";\n}\n\n.glyphicon-chevron-right:before {\n  content: \"\\E080\";\n}\n\n.glyphicon-plus-sign:before {\n  content: \"\\E081\";\n}\n\n.glyphicon-minus-sign:before {\n  content: \"\\E082\";\n}\n\n.glyphicon-remove-sign:before {\n  content: \"\\E083\";\n}\n\n.glyphicon-ok-sign:before {\n  content: \"\\E084\";\n}\n\n.glyphicon-question-sign:before {\n  content: \"\\E085\";\n}\n\n.glyphicon-info-sign:before {\n  content: \"\\E086\";\n}\n\n.glyphicon-screenshot:before {\n  content: \"\\E087\";\n}\n\n.glyphicon-remove-circle:before {\n  content: \"\\E088\";\n}\n\n.glyphicon-ok-circle:before {\n  content: \"\\E089\";\n}\n\n.glyphicon-ban-circle:before {\n  content: \"\\E090\";\n}\n\n.glyphicon-arrow-left:before {\n  content: \"\\E091\";\n}\n\n.glyphicon-arrow-right:before {\n  content: \"\\E092\";\n}\n\n.glyphicon-arrow-up:before {\n  content: \"\\E093\";\n}\n\n.glyphicon-arrow-down:before {\n  content: \"\\E094\";\n}\n\n.glyphicon-share-alt:before {\n  content: \"\\E095\";\n}\n\n.glyphicon-resize-full:before {\n  content: \"\\E096\";\n}\n\n.glyphicon-resize-small:before {\n  content: \"\\E097\";\n}\n\n.glyphicon-exclamation-sign:before {\n  content: \"\\E101\";\n}\n\n.glyphicon-gift:before {\n  content: \"\\E102\";\n}\n\n.glyphicon-leaf:before {\n  content: \"\\E103\";\n}\n\n.glyphicon-fire:before {\n  content: \"\\E104\";\n}\n\n.glyphicon-eye-open:before {\n  content: \"\\E105\";\n}\n\n.glyphicon-eye-close:before {\n  content: \"\\E106\";\n}\n\n.glyphicon-warning-sign:before {\n  content: \"\\E107\";\n}\n\n.glyphicon-plane:before {\n  content: \"\\E108\";\n}\n\n.glyphicon-calendar:before {\n  content: \"\\E109\";\n}\n\n.glyphicon-random:before {\n  content: \"\\E110\";\n}\n\n.glyphicon-comment:before {\n  content: \"\\E111\";\n}\n\n.glyphicon-magnet:before {\n  content: \"\\E112\";\n}\n\n.glyphicon-chevron-up:before {\n  content: \"\\E113\";\n}\n\n.glyphicon-chevron-down:before {\n  content: \"\\E114\";\n}\n\n.glyphicon-retweet:before {\n  content: \"\\E115\";\n}\n\n.glyphicon-shopping-cart:before {\n  content: \"\\E116\";\n}\n\n.glyphicon-folder-close:before {\n  content: \"\\E117\";\n}\n\n.glyphicon-folder-open:before {\n  content: \"\\E118\";\n}\n\n.glyphicon-resize-vertical:before {\n  content: \"\\E119\";\n}\n\n.glyphicon-resize-horizontal:before {\n  content: \"\\E120\";\n}\n\n.glyphicon-hdd:before {\n  content: \"\\E121\";\n}\n\n.glyphicon-bullhorn:before {\n  content: \"\\E122\";\n}\n\n.glyphicon-bell:before {\n  content: \"\\E123\";\n}\n\n.glyphicon-certificate:before {\n  content: \"\\E124\";\n}\n\n.glyphicon-thumbs-up:before {\n  content: \"\\E125\";\n}\n\n.glyphicon-thumbs-down:before {\n  content: \"\\E126\";\n}\n\n.glyphicon-hand-right:before {\n  content: \"\\E127\";\n}\n\n.glyphicon-hand-left:before {\n  content: \"\\E128\";\n}\n\n.glyphicon-hand-up:before {\n  content: \"\\E129\";\n}\n\n.glyphicon-hand-down:before {\n  content: \"\\E130\";\n}\n\n.glyphicon-circle-arrow-right:before {\n  content: \"\\E131\";\n}\n\n.glyphicon-circle-arrow-left:before {\n  content: \"\\E132\";\n}\n\n.glyphicon-circle-arrow-up:before {\n  content: \"\\E133\";\n}\n\n.glyphicon-circle-arrow-down:before {\n  content: \"\\E134\";\n}\n\n.glyphicon-globe:before {\n  content: \"\\E135\";\n}\n\n.glyphicon-wrench:before {\n  content: \"\\E136\";\n}\n\n.glyphicon-tasks:before {\n  content: \"\\E137\";\n}\n\n.glyphicon-filter:before {\n  content: \"\\E138\";\n}\n\n.glyphicon-briefcase:before {\n  content: \"\\E139\";\n}\n\n.glyphicon-fullscreen:before {\n  content: \"\\E140\";\n}\n\n.glyphicon-dashboard:before {\n  content: \"\\E141\";\n}\n\n.glyphicon-paperclip:before {\n  content: \"\\E142\";\n}\n\n.glyphicon-heart-empty:before {\n  content: \"\\E143\";\n}\n\n.glyphicon-link:before {\n  content: \"\\E144\";\n}\n\n.glyphicon-phone:before {\n  content: \"\\E145\";\n}\n\n.glyphicon-pushpin:before {\n  content: \"\\E146\";\n}\n\n.glyphicon-usd:before {\n  content: \"\\E148\";\n}\n\n.glyphicon-gbp:before {\n  content: \"\\E149\";\n}\n\n.glyphicon-sort:before {\n  content: \"\\E150\";\n}\n\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\E151\";\n}\n\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\E152\";\n}\n\n.glyphicon-sort-by-order:before {\n  content: \"\\E153\";\n}\n\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\E154\";\n}\n\n.glyphicon-sort-by-attributes:before {\n  content: \"\\E155\";\n}\n\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\E156\";\n}\n\n.glyphicon-unchecked:before {\n  content: \"\\E157\";\n}\n\n.glyphicon-expand:before {\n  content: \"\\E158\";\n}\n\n.glyphicon-collapse-down:before {\n  content: \"\\E159\";\n}\n\n.glyphicon-collapse-up:before {\n  content: \"\\E160\";\n}\n\n.glyphicon-log-in:before {\n  content: \"\\E161\";\n}\n\n.glyphicon-flash:before {\n  content: \"\\E162\";\n}\n\n.glyphicon-log-out:before {\n  content: \"\\E163\";\n}\n\n.glyphicon-new-window:before {\n  content: \"\\E164\";\n}\n\n.glyphicon-record:before {\n  content: \"\\E165\";\n}\n\n.glyphicon-save:before {\n  content: \"\\E166\";\n}\n\n.glyphicon-open:before {\n  content: \"\\E167\";\n}\n\n.glyphicon-saved:before {\n  content: \"\\E168\";\n}\n\n.glyphicon-import:before {\n  content: \"\\E169\";\n}\n\n.glyphicon-export:before {\n  content: \"\\E170\";\n}\n\n.glyphicon-send:before {\n  content: \"\\E171\";\n}\n\n.glyphicon-floppy-disk:before {\n  content: \"\\E172\";\n}\n\n.glyphicon-floppy-saved:before {\n  content: \"\\E173\";\n}\n\n.glyphicon-floppy-remove:before {\n  content: \"\\E174\";\n}\n\n.glyphicon-floppy-save:before {\n  content: \"\\E175\";\n}\n\n.glyphicon-floppy-open:before {\n  content: \"\\E176\";\n}\n\n.glyphicon-credit-card:before {\n  content: \"\\E177\";\n}\n\n.glyphicon-transfer:before {\n  content: \"\\E178\";\n}\n\n.glyphicon-cutlery:before {\n  content: \"\\E179\";\n}\n\n.glyphicon-header:before {\n  content: \"\\E180\";\n}\n\n.glyphicon-compressed:before {\n  content: \"\\E181\";\n}\n\n.glyphicon-earphone:before {\n  content: \"\\E182\";\n}\n\n.glyphicon-phone-alt:before {\n  content: \"\\E183\";\n}\n\n.glyphicon-tower:before {\n  content: \"\\E184\";\n}\n\n.glyphicon-stats:before {\n  content: \"\\E185\";\n}\n\n.glyphicon-sd-video:before {\n  content: \"\\E186\";\n}\n\n.glyphicon-hd-video:before {\n  content: \"\\E187\";\n}\n\n.glyphicon-subtitles:before {\n  content: \"\\E188\";\n}\n\n.glyphicon-sound-stereo:before {\n  content: \"\\E189\";\n}\n\n.glyphicon-sound-dolby:before {\n  content: \"\\E190\";\n}\n\n.glyphicon-sound-5-1:before {\n  content: \"\\E191\";\n}\n\n.glyphicon-sound-6-1:before {\n  content: \"\\E192\";\n}\n\n.glyphicon-sound-7-1:before {\n  content: \"\\E193\";\n}\n\n.glyphicon-copyright-mark:before {\n  content: \"\\E194\";\n}\n\n.glyphicon-registration-mark:before {\n  content: \"\\E195\";\n}\n\n.glyphicon-cloud-download:before {\n  content: \"\\E197\";\n}\n\n.glyphicon-cloud-upload:before {\n  content: \"\\E198\";\n}\n\n.glyphicon-tree-conifer:before {\n  content: \"\\E199\";\n}\n\n.glyphicon-tree-deciduous:before {\n  content: \"\\E200\";\n}\n\n.glyphicon-cd:before {\n  content: \"\\E201\";\n}\n\n.glyphicon-save-file:before {\n  content: \"\\E202\";\n}\n\n.glyphicon-open-file:before {\n  content: \"\\E203\";\n}\n\n.glyphicon-level-up:before {\n  content: \"\\E204\";\n}\n\n.glyphicon-copy:before {\n  content: \"\\E205\";\n}\n\n.glyphicon-paste:before {\n  content: \"\\E206\";\n}\n\n.glyphicon-alert:before {\n  content: \"\\E209\";\n}\n\n.glyphicon-equalizer:before {\n  content: \"\\E210\";\n}\n\n.glyphicon-king:before {\n  content: \"\\E211\";\n}\n\n.glyphicon-queen:before {\n  content: \"\\E212\";\n}\n\n.glyphicon-pawn:before {\n  content: \"\\E213\";\n}\n\n.glyphicon-bishop:before {\n  content: \"\\E214\";\n}\n\n.glyphicon-knight:before {\n  content: \"\\E215\";\n}\n\n.glyphicon-baby-formula:before {\n  content: \"\\E216\";\n}\n\n.glyphicon-tent:before {\n  content: \"\\26FA\";\n}\n\n.glyphicon-blackboard:before {\n  content: \"\\E218\";\n}\n\n.glyphicon-bed:before {\n  content: \"\\E219\";\n}\n\n.glyphicon-apple:before {\n  content: \"\\F8FF\";\n}\n\n.glyphicon-erase:before {\n  content: \"\\E221\";\n}\n\n.glyphicon-hourglass:before {\n  content: \"\\231B\";\n}\n\n.glyphicon-lamp:before {\n  content: \"\\E223\";\n}\n\n.glyphicon-duplicate:before {\n  content: \"\\E224\";\n}\n\n.glyphicon-piggy-bank:before {\n  content: \"\\E225\";\n}\n\n.glyphicon-scissors:before {\n  content: \"\\E226\";\n}\n\n.glyphicon-bitcoin:before {\n  content: \"\\E227\";\n}\n\n.glyphicon-btc:before {\n  content: \"\\E227\";\n}\n\n.glyphicon-xbt:before {\n  content: \"\\E227\";\n}\n\n.glyphicon-yen:before {\n  content: \"\\A5\";\n}\n\n.glyphicon-jpy:before {\n  content: \"\\A5\";\n}\n\n.glyphicon-ruble:before {\n  content: \"\\20BD\";\n}\n\n.glyphicon-rub:before {\n  content: \"\\20BD\";\n}\n\n.glyphicon-scale:before {\n  content: \"\\E230\";\n}\n\n.glyphicon-ice-lolly:before {\n  content: \"\\E231\";\n}\n\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\E232\";\n}\n\n.glyphicon-education:before {\n  content: \"\\E233\";\n}\n\n.glyphicon-option-horizontal:before {\n  content: \"\\E234\";\n}\n\n.glyphicon-option-vertical:before {\n  content: \"\\E235\";\n}\n\n.glyphicon-menu-hamburger:before {\n  content: \"\\E236\";\n}\n\n.glyphicon-modal-window:before {\n  content: \"\\E237\";\n}\n\n.glyphicon-oil:before {\n  content: \"\\E238\";\n}\n\n.glyphicon-grain:before {\n  content: \"\\E239\";\n}\n\n.glyphicon-sunglasses:before {\n  content: \"\\E240\";\n}\n\n.glyphicon-text-size:before {\n  content: \"\\E241\";\n}\n\n.glyphicon-text-color:before {\n  content: \"\\E242\";\n}\n\n.glyphicon-text-background:before {\n  content: \"\\E243\";\n}\n\n.glyphicon-object-align-top:before {\n  content: \"\\E244\";\n}\n\n.glyphicon-object-align-bottom:before {\n  content: \"\\E245\";\n}\n\n.glyphicon-object-align-horizontal:before {\n  content: \"\\E246\";\n}\n\n.glyphicon-object-align-left:before {\n  content: \"\\E247\";\n}\n\n.glyphicon-object-align-vertical:before {\n  content: \"\\E248\";\n}\n\n.glyphicon-object-align-right:before {\n  content: \"\\E249\";\n}\n\n.glyphicon-triangle-right:before {\n  content: \"\\E250\";\n}\n\n.glyphicon-triangle-left:before {\n  content: \"\\E251\";\n}\n\n.glyphicon-triangle-bottom:before {\n  content: \"\\E252\";\n}\n\n.glyphicon-triangle-top:before {\n  content: \"\\E253\";\n}\n\n.glyphicon-console:before {\n  content: \"\\E254\";\n}\n\n.glyphicon-superscript:before {\n  content: \"\\E255\";\n}\n\n.glyphicon-subscript:before {\n  content: \"\\E256\";\n}\n\n.glyphicon-menu-left:before {\n  content: \"\\E257\";\n}\n\n.glyphicon-menu-right:before {\n  content: \"\\E258\";\n}\n\n.glyphicon-menu-down:before {\n  content: \"\\E259\";\n}\n\n.glyphicon-menu-up:before {\n  content: \"\\E260\";\n}\n\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent;\n}\n\n.dropup,\n.dropdown {\n  position: relative;\n}\n\n.dropdown-toggle:focus {\n  outline: 0;\n}\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box;\n}\n\n.dropdown-menu.pull-right {\n  right: 0;\n  left: auto;\n}\n\n.dropdown-menu .divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n\n.dropdown-menu > li > a {\n  display: block;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  line-height: 1.428571429;\n  color: #333333;\n  white-space: nowrap;\n}\n\n.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #262626;\n  background-color: #f5f5f5;\n}\n\n.dropdown-menu > .active > a, .dropdown-menu > .ax-active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .ax-active > a:hover, .dropdown-menu > .active > a:focus, .dropdown-menu > .ax-active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #337ab7;\n}\n\n.dropdown-menu > .disabled > a, .dropdown-menu > [disabled] > a, .dropdown-menu >\n.ax-disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > [disabled] > a:hover, .dropdown-menu >\n.ax-disabled > a:hover, .dropdown-menu > .disabled > a:focus, .dropdown-menu > [disabled] > a:focus, .dropdown-menu >\n.ax-disabled > a:focus {\n  color: #777777;\n}\n\n.dropdown-menu > .disabled > a:hover, .dropdown-menu > [disabled] > a:hover, .dropdown-menu >\n.ax-disabled > a:hover, .dropdown-menu > .disabled > a:focus, .dropdown-menu > [disabled] > a:focus, .dropdown-menu >\n.ax-disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed;\n}\n\n.open > .dropdown-menu {\n  display: block;\n}\n\n.open > a {\n  outline: 0;\n}\n\n.dropdown-menu-right {\n  left: auto;\n  right: 0;\n}\n\n.dropdown-menu-left {\n  left: 0;\n  right: auto;\n}\n\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.428571429;\n  color: #777777;\n  white-space: nowrap;\n}\n\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990;\n}\n\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto;\n}\n\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\";\n}\n\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px;\n}\n\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    right: 0;\n    left: auto;\n  }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto;\n  }\n}\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  float: left;\n}\n\n.btn-group > .btn:hover, .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active, .btn-group > .btn.ax-active,\n.btn-group-vertical > .btn:hover,\n.btn-group-vertical > .btn:focus,\n.btn-group-vertical > .btn:active,\n.btn-group-vertical > .btn.active,\n.btn-group-vertical > .btn.ax-active {\n  z-index: 2;\n}\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px;\n}\n\n.btn-toolbar {\n  margin-left: -5px;\n}\n\n.btn-toolbar:before, .btn-toolbar:after {\n  content: \" \";\n  display: table;\n}\n\n.btn-toolbar:after {\n  clear: both;\n}\n\n.btn-toolbar .btn,\n.btn-toolbar .btn-group,\n.btn-toolbar .input-group {\n  float: left;\n}\n\n.btn-toolbar > .btn,\n.btn-toolbar > .btn-group,\n.btn-toolbar > .input-group {\n  margin-left: 5px;\n}\n\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0;\n}\n\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.btn-group > .btn-group {\n  float: left;\n}\n\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0;\n}\n\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px;\n}\n\n.btn-group > .btn-lg + .dropdown-toggle, .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px;\n}\n\n.btn-group.open .dropdown-toggle {\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n\n.btn-group.open .dropdown-toggle.btn-link {\n  box-shadow: none;\n}\n\n.btn .caret {\n  margin-left: 0;\n}\n\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0;\n}\n\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 5px 5px;\n}\n\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%;\n}\n\n.btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {\n  content: \" \";\n  display: table;\n}\n\n.btn-group-vertical > .btn-group:after {\n  clear: both;\n}\n\n.btn-group-vertical > .btn-group > .btn {\n  float: none;\n}\n\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0;\n}\n\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate;\n}\n\n.btn-group-justified > .btn,\n.btn-group-justified > .btn-group {\n  float: none;\n  display: table-cell;\n  width: 1%;\n}\n\n.btn-group-justified > .btn-group .btn {\n  width: 100%;\n}\n\n.btn-group-justified > .btn-group .dropdown-menu {\n  left: auto;\n}\n\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.input-group[class*=\"col-\"] {\n  float: none;\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.input-group .form-control {\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n\n.input-group .form-control:focus {\n  z-index: 3;\n}\n\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell;\n}\n\n.input-group-addon:not(:first-child):not(:last-child),\n.input-group-btn:not(:first-child):not(:last-child),\n.input-group .form-control:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #555555;\n  text-align: center;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n\n.input-group-addon.input-sm,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .input-group-addon.btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  border-radius: 3px;\n}\n\n.input-group-addon.input-lg,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .input-group-addon.btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  border-radius: 6px;\n}\n\n.input-group-addon input[type=\"radio\"],\n.input-group-addon input[type=\"checkbox\"] {\n  margin-top: 0;\n}\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.input-group-addon:first-child {\n  border-right: 0;\n}\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.input-group-addon:last-child {\n  border-left: 0;\n}\n\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap;\n}\n\n.input-group-btn > .btn {\n  position: relative;\n}\n\n.input-group-btn > .btn + .btn {\n  margin-left: -1px;\n}\n\n.input-group-btn > .btn:hover, .input-group-btn > .btn:focus, .input-group-btn > .btn:active {\n  z-index: 2;\n}\n\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group {\n  margin-right: -1px;\n}\n\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group {\n  z-index: 2;\n  margin-left: -1px;\n}\n\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n\n.nav:before, .nav:after {\n  content: \" \";\n  display: table;\n}\n\n.nav:after {\n  clear: both;\n}\n\n.nav > li {\n  position: relative;\n  display: block;\n}\n\n.nav > li > a {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n}\n\n.nav > li > a:hover, .nav > li > a:focus {\n  text-decoration: none;\n  background-color: #eeeeee;\n}\n\n.nav > li.disabled > a, .nav > li[disabled] > a, .nav >\nli.ax-disabled > a {\n  color: #777777;\n}\n\n.nav > li.disabled > a:hover, .nav > li[disabled] > a:hover, .nav >\nli.ax-disabled > a:hover, .nav > li.disabled > a:focus, .nav > li[disabled] > a:focus, .nav >\nli.ax-disabled > a:focus {\n  color: #777777;\n  text-decoration: none;\n  background-color: transparent;\n  cursor: not-allowed;\n}\n\n.nav .open > a, .nav .open > a:hover, .nav .open > a:focus {\n  background-color: #eeeeee;\n  border-color: #337ab7;\n}\n\n.nav .nav-divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n\n.nav > li > a > img {\n  max-width: none;\n}\n\n.nav-tabs {\n  border-bottom: 1px solid #ddd;\n}\n\n.nav-tabs > li {\n  float: left;\n  margin-bottom: -1px;\n}\n\n.nav-tabs > li > a {\n  margin-right: 2px;\n  line-height: 1.428571429;\n  border: 1px solid transparent;\n  border-radius: 4px 4px 0 0;\n}\n\n.nav-tabs > li > a:hover {\n  border-color: #eeeeee #eeeeee #ddd;\n}\n\n.nav-tabs > li.active > a, .nav-tabs > li.ax-active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.ax-active > a:hover, .nav-tabs > li.active > a:focus, .nav-tabs > li.ax-active > a:focus {\n  color: #555555;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-bottom-color: transparent;\n  cursor: default;\n}\n\n.nav-pills > li {\n  float: left;\n}\n\n.nav-pills > li > a {\n  border-radius: 4px;\n}\n\n.nav-pills > li + li {\n  margin-left: 2px;\n}\n\n.nav-pills > li.active > a, .nav-pills > li.ax-active > a, .nav-pills > li.active > a:hover, .nav-pills > li.ax-active > a:hover, .nav-pills > li.active > a:focus, .nav-pills > li.ax-active > a:focus {\n  color: #fff;\n  background-color: #337ab7;\n}\n\n.nav-stacked > li {\n  float: none;\n}\n\n.nav-stacked > li + li {\n  margin-top: 2px;\n  margin-left: 0;\n}\n\n.nav-justified, .nav-tabs.nav-justified {\n  width: 100%;\n}\n\n.nav-justified > li, .nav-tabs.nav-justified > li {\n  float: none;\n}\n\n.nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n  text-align: center;\n  margin-bottom: 5px;\n}\n\n.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n\n@media (min-width: 768px) {\n  .nav-justified > li, .nav-tabs.nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n\n.nav-tabs-justified, .nav-tabs.nav-justified {\n  border-bottom: 0;\n}\n\n.nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n\n.nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a, .nav-tabs-justified > .ax-active > a, .nav-tabs.nav-justified > .ax-active > a,\n.nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n.nav-tabs-justified > .ax-active > a:hover, .nav-tabs.nav-justified > .ax-active > a:hover,\n.nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus,\n.nav-tabs-justified > .ax-active > a:focus, .nav-tabs.nav-justified > .ax-active > a:focus {\n  border: 1px solid #ddd;\n}\n\n@media (min-width: 768px) {\n  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a, .nav-tabs-justified > .ax-active > a, .nav-tabs.nav-justified > .ax-active > a,\n  .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs-justified > .ax-active > a:hover, .nav-tabs.nav-justified > .ax-active > a:hover,\n  .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus,\n  .nav-tabs-justified > .ax-active > a:focus, .nav-tabs.nav-justified > .ax-active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n\n.tab-content > .tab-pane {\n  display: none;\n}\n\n.tab-content > .active, .tab-content > .ax-active {\n  display: block;\n}\n\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n}\n\n.navbar:before, .navbar:after {\n  content: \" \";\n  display: table;\n}\n\n.navbar:after {\n  clear: both;\n}\n\n@media (min-width: 768px) {\n  .navbar {\n    border-radius: 4px;\n  }\n}\n\n.navbar-header:before, .navbar-header:after {\n  content: \" \";\n  display: table;\n}\n\n.navbar-header:after {\n  clear: both;\n}\n\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left;\n  }\n}\n\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch;\n}\n\n.navbar-collapse:before, .navbar-collapse:after {\n  content: \" \";\n  display: table;\n}\n\n.navbar-collapse:after {\n  clear: both;\n}\n\n.navbar-collapse.in {\n  overflow-y: auto;\n}\n\n@media (min-width: 768px) {\n  .navbar-collapse {\n    width: auto;\n    border-top: 0;\n    box-shadow: none;\n  }\n  .navbar-collapse.collapse {\n    display: block !important;\n    height: auto !important;\n    padding-bottom: 0;\n    overflow: visible !important;\n  }\n  .navbar-collapse.in {\n    overflow-y: visible;\n  }\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-static-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px;\n}\n\n@media (max-device-width: 480px) and (orientation: landscape) {\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    max-height: 200px;\n  }\n}\n\n.container > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-header,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n\n@media (min-width: 768px) {\n  .container > .navbar-header,\n  .container > .navbar-collapse,\n  .container-fluid > .navbar-header,\n  .container-fluid > .navbar-collapse {\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px;\n}\n\n@media (min-width: 768px) {\n  .navbar-static-top {\n    border-radius: 0;\n  }\n}\n\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n\n@media (min-width: 768px) {\n  .navbar-fixed-top,\n  .navbar-fixed-bottom {\n    border-radius: 0;\n  }\n}\n\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px;\n}\n\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0;\n}\n\n.navbar-brand {\n  float: left;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n  height: 50px;\n}\n\n.navbar-brand:hover, .navbar-brand:focus {\n  text-decoration: none;\n}\n\n.navbar-brand > img {\n  display: block;\n}\n\n@media (min-width: 768px) {\n  .navbar > .container .navbar-brand,\n  .navbar > .container-fluid .navbar-brand {\n    margin-left: -15px;\n  }\n}\n\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n\n.navbar-toggle:focus {\n  outline: 0;\n}\n\n.navbar-toggle .icon-bar {\n  display: block;\n  width: 22px;\n  height: 2px;\n  border-radius: 1px;\n}\n\n.navbar-toggle .icon-bar + .icon-bar {\n  margin-top: 4px;\n}\n\n@media (min-width: 768px) {\n  .navbar-toggle {\n    display: none;\n  }\n}\n\n.navbar-nav {\n  margin: 7.5px -15px;\n}\n\n.navbar-nav > li > a {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  line-height: 20px;\n}\n\n@media (max-width: 767px) {\n  .navbar-nav .open .dropdown-menu {\n    position: static;\n    float: none;\n    width: auto;\n    margin-top: 0;\n    background-color: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n  .navbar-nav .open .dropdown-menu > li > a,\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 25px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    line-height: 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-nav .open .dropdown-menu > li > a:focus {\n    background-image: none;\n  }\n}\n\n@media (min-width: 768px) {\n  .navbar-nav {\n    float: left;\n    margin: 0;\n  }\n  .navbar-nav > li {\n    float: left;\n  }\n  .navbar-nav > li > a {\n    padding-top: 15px;\n    padding-bottom: 15px;\n  }\n}\n\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n\n@media (min-width: 768px) {\n  .navbar-form .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control-static {\n    display: inline-block;\n  }\n  .navbar-form .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .navbar-form .input-group .input-group-addon,\n  .navbar-form .input-group .input-group-btn,\n  .navbar-form .input-group .form-control {\n    width: auto;\n  }\n  .navbar-form .input-group > .form-control {\n    width: 100%;\n  }\n  .navbar-form .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio,\n  .navbar-form .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio label,\n  .navbar-form .checkbox label {\n    padding-left: 0;\n  }\n  .navbar-form .radio input[type=\"radio\"],\n  .navbar-form .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .navbar-form .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n\n@media (max-width: 767px) {\n  .navbar-form .form-group {\n    margin-bottom: 5px;\n  }\n  .navbar-form .form-group:last-child {\n    margin-bottom: 0;\n  }\n}\n\n@media (min-width: 768px) {\n  .navbar-form {\n    width: auto;\n    border: 0;\n    margin-left: 0;\n    margin-right: 0;\n    padding-top: 0;\n    padding-bottom: 0;\n    box-shadow: none;\n  }\n}\n\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n\n.navbar-btn.btn-sm, .btn-group-sm > .navbar-btn.btn {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n\n.navbar-btn.btn-xs, .btn-group-xs > .navbar-btn.btn {\n  margin-top: 14px;\n  margin-bottom: 14px;\n}\n\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px;\n}\n\n@media (min-width: 768px) {\n  .navbar-text {\n    float: left;\n    margin-left: 15px;\n    margin-right: 15px;\n  }\n}\n\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important;\n  }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px;\n  }\n  .navbar-right ~ .navbar-right {\n    margin-right: 0;\n  }\n}\n\n.navbar-default {\n  background-color: #f8f8f8;\n  border-color: #e7e7e7;\n}\n\n.navbar-default .navbar-brand {\n  color: #777;\n}\n\n.navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {\n  color: #5e5e5e;\n  background-color: transparent;\n}\n\n.navbar-default .navbar-text {\n  color: #777;\n}\n\n.navbar-default .navbar-nav > li > a {\n  color: #777;\n}\n\n.navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {\n  color: #333;\n  background-color: transparent;\n}\n\n.navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .ax-active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .ax-active > a:hover, .navbar-default .navbar-nav > .active > a:focus, .navbar-default .navbar-nav > .ax-active > a:focus {\n  color: #555;\n  background-color: #e7e7e7;\n}\n\n.navbar-default .navbar-nav > .disabled > a, .navbar-default .navbar-nav > [disabled] > a, .navbar-default .navbar-nav >\n.ax-disabled > a, .navbar-default .navbar-nav > .disabled > a:hover, .navbar-default .navbar-nav > [disabled] > a:hover, .navbar-default .navbar-nav >\n.ax-disabled > a:hover, .navbar-default .navbar-nav > .disabled > a:focus, .navbar-default .navbar-nav > [disabled] > a:focus, .navbar-default .navbar-nav >\n.ax-disabled > a:focus {\n  color: #ccc;\n  background-color: transparent;\n}\n\n.navbar-default .navbar-toggle {\n  border-color: #ddd;\n}\n\n.navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {\n  background-color: #ddd;\n}\n\n.navbar-default .navbar-toggle .icon-bar {\n  background-color: #888;\n}\n\n.navbar-default .navbar-collapse,\n.navbar-default .navbar-form {\n  border-color: #e7e7e7;\n}\n\n.navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {\n  background-color: #e7e7e7;\n  color: #555;\n}\n\n@media (max-width: 767px) {\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n    color: #777;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #333;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .navbar-default .navbar-nav .open .dropdown-menu > .ax-active > a, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .ax-active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus, .navbar-default .navbar-nav .open .dropdown-menu > .ax-active > a:focus {\n    color: #555;\n    background-color: #e7e7e7;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > [disabled] > a, .navbar-default .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > [disabled] > a:hover, .navbar-default .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus, .navbar-default .navbar-nav .open .dropdown-menu > [disabled] > a:focus, .navbar-default .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a:focus {\n    color: #ccc;\n    background-color: transparent;\n  }\n}\n\n.navbar-default .navbar-link {\n  color: #777;\n}\n\n.navbar-default .navbar-link:hover {\n  color: #333;\n}\n\n.navbar-default .btn-link {\n  color: #777;\n}\n\n.navbar-default .btn-link:hover, .navbar-default .btn-link:focus {\n  color: #333;\n}\n\n.navbar-default .btn-link[disabled]:hover, .navbar-default .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-default .btn-link:hover,\nfieldset[disabled] .navbar-default .btn-link:focus {\n  color: #ccc;\n}\n\n.navbar-inverse {\n  background-color: #222;\n  border-color: #090909;\n}\n\n.navbar-inverse .navbar-brand {\n  color: #9d9d9d;\n}\n\n.navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {\n  color: #fff;\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-text {\n  color: #9d9d9d;\n}\n\n.navbar-inverse .navbar-nav > li > a {\n  color: #9d9d9d;\n}\n\n.navbar-inverse .navbar-nav > li > a:hover, .navbar-inverse .navbar-nav > li > a:focus {\n  color: #fff;\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-nav > .active > a, .navbar-inverse .navbar-nav > .ax-active > a, .navbar-inverse .navbar-nav > .active > a:hover, .navbar-inverse .navbar-nav > .ax-active > a:hover, .navbar-inverse .navbar-nav > .active > a:focus, .navbar-inverse .navbar-nav > .ax-active > a:focus {\n  color: #fff;\n  background-color: #090909;\n}\n\n.navbar-inverse .navbar-nav > .disabled > a, .navbar-inverse .navbar-nav > [disabled] > a, .navbar-inverse .navbar-nav >\n.ax-disabled > a, .navbar-inverse .navbar-nav > .disabled > a:hover, .navbar-inverse .navbar-nav > [disabled] > a:hover, .navbar-inverse .navbar-nav >\n.ax-disabled > a:hover, .navbar-inverse .navbar-nav > .disabled > a:focus, .navbar-inverse .navbar-nav > [disabled] > a:focus, .navbar-inverse .navbar-nav >\n.ax-disabled > a:focus {\n  color: #444;\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-toggle {\n  border-color: #333;\n}\n\n.navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus {\n  background-color: #333;\n}\n\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #fff;\n}\n\n.navbar-inverse .navbar-collapse,\n.navbar-inverse .navbar-form {\n  border-color: #101010;\n}\n\n.navbar-inverse .navbar-nav > .open > a, .navbar-inverse .navbar-nav > .open > a:hover, .navbar-inverse .navbar-nav > .open > a:focus {\n  background-color: #090909;\n  color: #fff;\n}\n\n@media (max-width: 767px) {\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n    border-color: #090909;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n    background-color: #090909;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n    color: #9d9d9d;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #fff;\n    background-color: transparent;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .ax-active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .ax-active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus, .navbar-inverse .navbar-nav .open .dropdown-menu > .ax-active > a:focus {\n    color: #fff;\n    background-color: #090909;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > [disabled] > a, .navbar-inverse .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > [disabled] > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus, .navbar-inverse .navbar-nav .open .dropdown-menu > [disabled] > a:focus, .navbar-inverse .navbar-nav .open .dropdown-menu >\n  .ax-disabled > a:focus {\n    color: #444;\n    background-color: transparent;\n  }\n}\n\n.navbar-inverse .navbar-link {\n  color: #9d9d9d;\n}\n\n.navbar-inverse .navbar-link:hover {\n  color: #fff;\n}\n\n.navbar-inverse .btn-link {\n  color: #9d9d9d;\n}\n\n.navbar-inverse .btn-link:hover, .navbar-inverse .btn-link:focus {\n  color: #fff;\n}\n\n.navbar-inverse .btn-link[disabled]:hover, .navbar-inverse .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-inverse .btn-link:hover,\nfieldset[disabled] .navbar-inverse .btn-link:focus {\n  color: #444;\n}\n\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n\n.breadcrumb > li {\n  display: inline-block;\n}\n\n.breadcrumb > li + li:before {\n  content: \"/\\A0\";\n  padding: 0 5px;\n  color: #ccc;\n}\n\n.breadcrumb > .active, .breadcrumb > .ax-active {\n  color: #777777;\n}\n\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px;\n}\n\n.pagination > li {\n  display: inline;\n}\n\n.pagination > li > a,\n.pagination > li > span {\n  position: relative;\n  float: left;\n  padding: 6px 12px;\n  line-height: 1.428571429;\n  text-decoration: none;\n  color: #337ab7;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  margin-left: -1px;\n}\n\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-bottom-left-radius: 4px;\n  border-top-left-radius: 4px;\n}\n\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-bottom-right-radius: 4px;\n  border-top-right-radius: 4px;\n}\n\n.pagination > li > a:hover, .pagination > li > a:focus,\n.pagination > li > span:hover,\n.pagination > li > span:focus {\n  z-index: 2;\n  color: #23527c;\n  background-color: #eeeeee;\n  border-color: #ddd;\n}\n\n.pagination > .active > a, .pagination > .ax-active > a, .pagination > .active > a:hover, .pagination > .ax-active > a:hover, .pagination > .active > a:focus, .pagination > .ax-active > a:focus,\n.pagination > .active > span,\n.pagination > .ax-active > span,\n.pagination > .active > span:hover,\n.pagination > .ax-active > span:hover,\n.pagination > .active > span:focus,\n.pagination > .ax-active > span:focus {\n  z-index: 3;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n  cursor: default;\n}\n\n.pagination > .disabled > span, .pagination > [disabled] > span, .pagination >\n.ax-disabled > span,\n.pagination > .disabled > span:hover,\n.pagination > [disabled] > span:hover,\n.pagination >\n.ax-disabled > span:hover,\n.pagination > .disabled > span:focus,\n.pagination > [disabled] > span:focus,\n.pagination >\n.ax-disabled > span:focus,\n.pagination > .disabled > a,\n.pagination > [disabled] > a,\n.pagination >\n.ax-disabled > a,\n.pagination > .disabled > a:hover,\n.pagination > [disabled] > a:hover,\n.pagination >\n.ax-disabled > a:hover,\n.pagination > .disabled > a:focus,\n.pagination > [disabled] > a:focus,\n.pagination >\n.ax-disabled > a:focus {\n  color: #777777;\n  background-color: #fff;\n  border-color: #ddd;\n  cursor: not-allowed;\n}\n\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px;\n}\n\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px;\n}\n\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px;\n}\n\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px;\n}\n\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  list-style: none;\n  text-align: center;\n}\n\n.pager:before, .pager:after {\n  content: \" \";\n  display: table;\n}\n\n.pager:after {\n  clear: both;\n}\n\n.pager li {\n  display: inline;\n}\n\n.pager li > a,\n.pager li > span {\n  display: inline-block;\n  padding: 5px 14px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 15px;\n}\n\n.pager li > a:hover,\n.pager li > a:focus {\n  text-decoration: none;\n  background-color: #eeeeee;\n}\n\n.pager .next > a,\n.pager .next > span {\n  float: right;\n}\n\n.pager .previous > a,\n.pager .previous > span {\n  float: left;\n}\n\n.pager .disabled > a, .pager [disabled] > a, .pager\n.ax-disabled > a,\n.pager .disabled > a:hover,\n.pager [disabled] > a:hover,\n.pager\n.ax-disabled > a:hover,\n.pager .disabled > a:focus,\n.pager [disabled] > a:focus,\n.pager\n.ax-disabled > a:focus,\n.pager .disabled > span,\n.pager [disabled] > span,\n.pager\n.ax-disabled > span {\n  color: #777777;\n  background-color: #fff;\n  cursor: not-allowed;\n}\n\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em;\n}\n\n.label:empty {\n  display: none;\n}\n\n.btn .label {\n  position: relative;\n  top: -1px;\n}\n\na.label:hover, a.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.label-default {\n  background-color: #777777;\n}\n\n.label-default[href]:hover, .label-default[href]:focus {\n  background-color: #5e5e5e;\n}\n\n.label-primary {\n  background-color: #337ab7;\n}\n\n.label-primary[href]:hover, .label-primary[href]:focus {\n  background-color: #286090;\n}\n\n.label-success {\n  background-color: #5cb85c;\n}\n\n.label-success[href]:hover, .label-success[href]:focus {\n  background-color: #449d44;\n}\n\n.label-info {\n  background-color: #5bc0de;\n}\n\n.label-info[href]:hover, .label-info[href]:focus {\n  background-color: #31b0d5;\n}\n\n.label-warning {\n  background-color: #f0ad4e;\n}\n\n.label-warning[href]:hover, .label-warning[href]:focus {\n  background-color: #ec971f;\n}\n\n.label-danger {\n  background-color: #d9534f;\n}\n\n.label-danger[href]:hover, .label-danger[href]:focus {\n  background-color: #c9302c;\n}\n\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #777777;\n  border-radius: 10px;\n}\n\n.badge:empty {\n  display: none;\n}\n\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n\n.btn-xs .badge, .btn-group-xs > .btn .badge,\n.btn-group-xs > .btn .badge {\n  top: 0;\n  padding: 1px 5px;\n}\n\n.list-group-item.active > .badge, .list-group-item.ax-active > .badge,\n.nav-pills > .active > a > .badge,\n.nav-pills > .ax-active > a > .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n\n.list-group-item > .badge {\n  float: right;\n}\n\n.list-group-item > .badge + .badge {\n  margin-right: 5px;\n}\n\n.nav-pills > li > a > .badge {\n  margin-left: 3px;\n}\n\na.badge:hover, a.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #eeeeee;\n}\n\n.jumbotron h1,\n.jumbotron .h1 {\n  color: inherit;\n}\n\n.jumbotron p {\n  margin-bottom: 15px;\n  font-size: 21px;\n  font-weight: 200;\n}\n\n.jumbotron > hr {\n  border-top-color: #d5d5d5;\n}\n\n.container .jumbotron,\n.container-fluid .jumbotron {\n  border-radius: 6px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n\n.jumbotron .container {\n  max-width: 100%;\n}\n\n@media screen and (min-width: 768px) {\n  .jumbotron {\n    padding-top: 48px;\n    padding-bottom: 48px;\n  }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    padding-left: 60px;\n    padding-right: 60px;\n  }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    font-size: 63px;\n  }\n}\n\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.428571429;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out;\n}\n\n.thumbnail > img,\n.thumbnail a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.thumbnail .caption {\n  padding: 9px;\n  color: #333333;\n}\n\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active,\na.thumbnail.ax-active {\n  border-color: #337ab7;\n}\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n\n.progress {\n  overflow: hidden;\n  height: 20px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #337ab7;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -webkit-transition: width 0.6s ease;\n  transition: width 0.6s ease;\n}\n\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px;\n}\n\n.progress.active .progress-bar, .progress.ax-active .progress-bar,\n.progress-bar.active,\n.progress-bar.ax-active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  animation: progress-bar-stripes 2s linear infinite;\n}\n\n.progress-bar-success {\n  background-color: #5cb85c;\n}\n\n.progress-striped .progress-bar-success {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n\n.progress-bar-info {\n  background-color: #5bc0de;\n}\n\n.progress-striped .progress-bar-info {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n\n.progress-bar-warning {\n  background-color: #f0ad4e;\n}\n\n.progress-striped .progress-bar-warning {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n\n.progress-bar-danger {\n  background-color: #d9534f;\n}\n\n.progress-striped .progress-bar-danger {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n\n.media {\n  margin-top: 15px;\n}\n\n.media:first-child {\n  margin-top: 0;\n}\n\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden;\n}\n\n.media-body {\n  width: 10000px;\n}\n\n.media-object {\n  display: block;\n}\n\n.media-object.img-thumbnail {\n  max-width: none;\n}\n\n.media-right,\n.media > .pull-right {\n  padding-left: 10px;\n}\n\n.media-left,\n.media > .pull-left {\n  padding-right: 10px;\n}\n\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top;\n}\n\n.media-middle {\n  vertical-align: middle;\n}\n\n.media-bottom {\n  vertical-align: bottom;\n}\n\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n\n.media-list {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0;\n}\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n\n.list-group-item:first-child {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n}\n\n.list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n\na.list-group-item,\nbutton.list-group-item {\n  color: #555;\n}\n\na.list-group-item .list-group-item-heading,\nbutton.list-group-item .list-group-item-heading {\n  color: #333;\n}\n\na.list-group-item:hover, a.list-group-item:focus,\nbutton.list-group-item:hover,\nbutton.list-group-item:focus {\n  text-decoration: none;\n  color: #555;\n  background-color: #f5f5f5;\n}\n\nbutton.list-group-item {\n  width: 100%;\n  text-align: left;\n}\n\n.list-group-item.disabled, .list-group-item[disabled],\n.list-group-item.ax-disabled, .list-group-item.disabled:hover, .list-group-item[disabled]:hover,\n.list-group-item.ax-disabled:hover, .list-group-item.disabled:focus, .list-group-item[disabled]:focus,\n.list-group-item.ax-disabled:focus {\n  background-color: #eeeeee;\n  color: #777777;\n  cursor: not-allowed;\n}\n\n.list-group-item.disabled .list-group-item-heading, .list-group-item[disabled] .list-group-item-heading,\n.list-group-item.ax-disabled .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading, .list-group-item[disabled]:hover .list-group-item-heading,\n.list-group-item.ax-disabled:hover .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading, .list-group-item[disabled]:focus .list-group-item-heading,\n.list-group-item.ax-disabled:focus .list-group-item-heading {\n  color: inherit;\n}\n\n.list-group-item.disabled .list-group-item-text, .list-group-item[disabled] .list-group-item-text,\n.list-group-item.ax-disabled .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text, .list-group-item[disabled]:hover .list-group-item-text,\n.list-group-item.ax-disabled:hover .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text, .list-group-item[disabled]:focus .list-group-item-text,\n.list-group-item.ax-disabled:focus .list-group-item-text {\n  color: #777777;\n}\n\n.list-group-item.active, .list-group-item.ax-active, .list-group-item.active:hover, .list-group-item.ax-active:hover, .list-group-item.active:focus, .list-group-item.ax-active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n\n.list-group-item.active .list-group-item-heading, .list-group-item.ax-active .list-group-item-heading,\n.list-group-item.active .list-group-item-heading > small, .list-group-item.ax-active .list-group-item-heading > small,\n.list-group-item.active .list-group-item-heading > .small, .list-group-item.ax-active .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading, .list-group-item.ax-active:hover .list-group-item-heading,\n.list-group-item.active:hover .list-group-item-heading > small, .list-group-item.ax-active:hover .list-group-item-heading > small,\n.list-group-item.active:hover .list-group-item-heading > .small, .list-group-item.ax-active:hover .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading, .list-group-item.ax-active:focus .list-group-item-heading,\n.list-group-item.active:focus .list-group-item-heading > small, .list-group-item.ax-active:focus .list-group-item-heading > small,\n.list-group-item.active:focus .list-group-item-heading > .small, .list-group-item.ax-active:focus .list-group-item-heading > .small {\n  color: inherit;\n}\n\n.list-group-item.active .list-group-item-text, .list-group-item.ax-active .list-group-item-text, .list-group-item.active:hover .list-group-item-text, .list-group-item.ax-active:hover .list-group-item-text, .list-group-item.active:focus .list-group-item-text, .list-group-item.ax-active:focus .list-group-item-text {\n  color: #c7ddef;\n}\n\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n}\n\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d;\n}\n\na.list-group-item-success .list-group-item-heading,\nbutton.list-group-item-success .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-success:hover, a.list-group-item-success:focus,\nbutton.list-group-item-success:hover,\nbutton.list-group-item-success:focus {\n  color: #3c763d;\n  background-color: #d0e9c6;\n}\n\na.list-group-item-success.active, a.list-group-item-success.ax-active, a.list-group-item-success.active:hover, a.list-group-item-success.ax-active:hover, a.list-group-item-success.active:focus, a.list-group-item-success.ax-active:focus,\nbutton.list-group-item-success.active,\nbutton.list-group-item-success.ax-active,\nbutton.list-group-item-success.active:hover,\nbutton.list-group-item-success.ax-active:hover,\nbutton.list-group-item-success.active:focus,\nbutton.list-group-item-success.ax-active:focus {\n  color: #fff;\n  background-color: #3c763d;\n  border-color: #3c763d;\n}\n\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7;\n}\n\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f;\n}\n\na.list-group-item-info .list-group-item-heading,\nbutton.list-group-item-info .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-info:hover, a.list-group-item-info:focus,\nbutton.list-group-item-info:hover,\nbutton.list-group-item-info:focus {\n  color: #31708f;\n  background-color: #c4e3f3;\n}\n\na.list-group-item-info.active, a.list-group-item-info.ax-active, a.list-group-item-info.active:hover, a.list-group-item-info.ax-active:hover, a.list-group-item-info.active:focus, a.list-group-item-info.ax-active:focus,\nbutton.list-group-item-info.active,\nbutton.list-group-item-info.ax-active,\nbutton.list-group-item-info.active:hover,\nbutton.list-group-item-info.ax-active:hover,\nbutton.list-group-item-info.active:focus,\nbutton.list-group-item-info.ax-active:focus {\n  color: #fff;\n  background-color: #31708f;\n  border-color: #31708f;\n}\n\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n}\n\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b;\n}\n\na.list-group-item-warning .list-group-item-heading,\nbutton.list-group-item-warning .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-warning:hover, a.list-group-item-warning:focus,\nbutton.list-group-item-warning:hover,\nbutton.list-group-item-warning:focus {\n  color: #8a6d3b;\n  background-color: #faf2cc;\n}\n\na.list-group-item-warning.active, a.list-group-item-warning.ax-active, a.list-group-item-warning.active:hover, a.list-group-item-warning.ax-active:hover, a.list-group-item-warning.active:focus, a.list-group-item-warning.ax-active:focus,\nbutton.list-group-item-warning.active,\nbutton.list-group-item-warning.ax-active,\nbutton.list-group-item-warning.active:hover,\nbutton.list-group-item-warning.ax-active:hover,\nbutton.list-group-item-warning.active:focus,\nbutton.list-group-item-warning.ax-active:focus {\n  color: #fff;\n  background-color: #8a6d3b;\n  border-color: #8a6d3b;\n}\n\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede;\n}\n\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442;\n}\n\na.list-group-item-danger .list-group-item-heading,\nbutton.list-group-item-danger .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-danger:hover, a.list-group-item-danger:focus,\nbutton.list-group-item-danger:hover,\nbutton.list-group-item-danger:focus {\n  color: #a94442;\n  background-color: #ebcccc;\n}\n\na.list-group-item-danger.active, a.list-group-item-danger.ax-active, a.list-group-item-danger.active:hover, a.list-group-item-danger.ax-active:hover, a.list-group-item-danger.active:focus, a.list-group-item-danger.ax-active:focus,\nbutton.list-group-item-danger.active,\nbutton.list-group-item-danger.ax-active,\nbutton.list-group-item-danger.active:hover,\nbutton.list-group-item-danger.ax-active:hover,\nbutton.list-group-item-danger.active:focus,\nbutton.list-group-item-danger.ax-active:focus {\n  color: #fff;\n  background-color: #a94442;\n  border-color: #a94442;\n}\n\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3;\n}\n\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n\n.panel-body {\n  padding: 15px;\n}\n\n.panel-body:before, .panel-body:after {\n  content: \" \";\n  display: table;\n}\n\n.panel-body:after {\n  clear: both;\n}\n\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n\n.panel-heading > .dropdown .dropdown-toggle {\n  color: inherit;\n}\n\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit;\n}\n\n.panel-title > a,\n.panel-title > small,\n.panel-title > .small,\n.panel-title > small > a,\n.panel-title > .small > a {\n  color: inherit;\n}\n\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0;\n}\n\n.panel > .list-group .list-group-item,\n.panel > .panel-collapse > .list-group .list-group-item {\n  border-width: 1px 0;\n  border-radius: 0;\n}\n\n.panel > .list-group:first-child .list-group-item:first-child,\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n  border-top: 0;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n\n.panel > .list-group:last-child .list-group-item:last-child,\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n  border-bottom: 0;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0;\n}\n\n.list-group + .panel-footer {\n  border-top-width: 0;\n}\n\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0;\n}\n\n.panel > .table caption,\n.panel > .table-responsive > .table caption,\n.panel > .panel-collapse > .table caption {\n  padding-left: 15px;\n  padding-right: 15px;\n}\n\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n\n.panel > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n  border-top-left-radius: 3px;\n}\n\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n  border-top-right-radius: 3px;\n}\n\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n\n.panel > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n  border-bottom-left-radius: 3px;\n}\n\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n  border-bottom-right-radius: 3px;\n}\n\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd;\n}\n\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0;\n}\n\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0;\n}\n\n.panel > .table-bordered > thead > tr > th:first-child,\n.panel > .table-bordered > thead > tr > td:first-child,\n.panel > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-bordered > tfoot > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n  border-left: 0;\n}\n\n.panel > .table-bordered > thead > tr > th:last-child,\n.panel > .table-bordered > thead > tr > td:last-child,\n.panel > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-bordered > tfoot > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n  border-right: 0;\n}\n\n.panel > .table-bordered > thead > tr:first-child > td,\n.panel > .table-bordered > thead > tr:first-child > th,\n.panel > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-bordered > tbody > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n  border-bottom: 0;\n}\n\n.panel > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-bordered > tfoot > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n  border-bottom: 0;\n}\n\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0;\n}\n\n.panel-group {\n  margin-bottom: 20px;\n}\n\n.panel-group .panel {\n  margin-bottom: 0;\n  border-radius: 4px;\n}\n\n.panel-group .panel + .panel {\n  margin-top: 5px;\n}\n\n.panel-group .panel-heading {\n  border-bottom: 0;\n}\n\n.panel-group .panel-heading + .panel-collapse > .panel-body,\n.panel-group .panel-heading + .panel-collapse > .list-group {\n  border-top: 1px solid #ddd;\n}\n\n.panel-group .panel-footer {\n  border-top: 0;\n}\n\n.panel-group .panel-footer + .panel-collapse .panel-body {\n  border-bottom: 1px solid #ddd;\n}\n\n.panel-default {\n  border-color: #ddd;\n}\n\n.panel-default > .panel-heading {\n  color: #333333;\n  background-color: #f5f5f5;\n  border-color: #ddd;\n}\n\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ddd;\n}\n\n.panel-default > .panel-heading .badge {\n  color: #f5f5f5;\n  background-color: #333333;\n}\n\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ddd;\n}\n\n.panel-primary {\n  border-color: #337ab7;\n}\n\n.panel-primary > .panel-heading {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #337ab7;\n}\n\n.panel-primary > .panel-heading .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #337ab7;\n}\n\n.panel-success {\n  border-color: #d6e9c6;\n}\n\n.panel-success > .panel-heading {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n}\n\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #d6e9c6;\n}\n\n.panel-success > .panel-heading .badge {\n  color: #dff0d8;\n  background-color: #3c763d;\n}\n\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #d6e9c6;\n}\n\n.panel-info {\n  border-color: #bce8f1;\n}\n\n.panel-info > .panel-heading {\n  color: #31708f;\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n}\n\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #bce8f1;\n}\n\n.panel-info > .panel-heading .badge {\n  color: #d9edf7;\n  background-color: #31708f;\n}\n\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #bce8f1;\n}\n\n.panel-warning {\n  border-color: #faebcc;\n}\n\n.panel-warning > .panel-heading {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n}\n\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #faebcc;\n}\n\n.panel-warning > .panel-heading .badge {\n  color: #fcf8e3;\n  background-color: #8a6d3b;\n}\n\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #faebcc;\n}\n\n.panel-danger {\n  border-color: #ebccd1;\n}\n\n.panel-danger > .panel-heading {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #ebccd1;\n}\n\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ebccd1;\n}\n\n.panel-danger > .panel-heading .badge {\n  color: #f2dede;\n  background-color: #a94442;\n}\n\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ebccd1;\n}\n\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n\n.well blockquote {\n  border-color: #ddd;\n  border-color: rgba(0, 0, 0, 0.15);\n}\n\n.well-lg {\n  padding: 24px;\n  border-radius: 6px;\n}\n\n.well-sm {\n  padding: 9px;\n  border-radius: 3px;\n}\n\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20);\n}\n\n.close:hover, .close:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n}\n\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none;\n}\n\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n\n.alert h4 {\n  margin-top: 0;\n  color: inherit;\n}\n\n.alert .alert-link {\n  font-weight: bold;\n}\n\n.alert > p,\n.alert > ul {\n  margin-bottom: 0;\n}\n\n.alert > p + p {\n  margin-top: 5px;\n}\n\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px;\n}\n\n.alert-dismissable .close,\n.alert-dismissible .close {\n  position: relative;\n  top: -2px;\n  right: -21px;\n  color: inherit;\n}\n\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n  color: #3c763d;\n}\n\n.alert-success hr {\n  border-top-color: #c9e2b3;\n}\n\n.alert-success .alert-link {\n  color: #2b542c;\n}\n\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n  color: #31708f;\n}\n\n.alert-info hr {\n  border-top-color: #a6e1ec;\n}\n\n.alert-info .alert-link {\n  color: #245269;\n}\n\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n  color: #8a6d3b;\n}\n\n.alert-warning hr {\n  border-top-color: #f7e1b5;\n}\n\n.alert-warning .alert-link {\n  color: #66512c;\n}\n\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebccd1;\n  color: #a94442;\n}\n\n.alert-danger hr {\n  border-top-color: #e4b9c0;\n}\n\n.alert-danger .alert-link {\n  color: #843534;\n}\n\n.modal-open {\n  overflow: hidden;\n}\n\n.modal {\n  display: none;\n  overflow: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  -webkit-overflow-scrolling: touch;\n  outline: 0;\n}\n\n.modal.fade .modal-dialog {\n  -webkit-transform: translate(0, -25%);\n  -ms-transform: translate(0, -25%);\n  transform: translate(0, -25%);\n  -webkit-transition: -webkit-transform 0.3s ease-out;\n  transition: -webkit-transform 0.3s ease-out;\n  transition: transform 0.3s ease-out;\n  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;\n}\n\n.modal.in .modal-dialog {\n  -webkit-transform: translate(0, 0);\n  -ms-transform: translate(0, 0);\n  transform: translate(0, 0);\n}\n\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px;\n}\n\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  background-clip: padding-box;\n  outline: 0;\n}\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000;\n}\n\n.modal-backdrop.fade {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.modal-backdrop.in {\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n}\n\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5;\n}\n\n.modal-header:before, .modal-header:after {\n  content: \" \";\n  display: table;\n}\n\n.modal-header:after {\n  clear: both;\n}\n\n.modal-header .close {\n  margin-top: -2px;\n}\n\n.modal-title {\n  margin: 0;\n  line-height: 1.428571429;\n}\n\n.modal-body {\n  position: relative;\n  padding: 15px;\n}\n\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5;\n}\n\n.modal-footer:before, .modal-footer:after {\n  content: \" \";\n  display: table;\n}\n\n.modal-footer:after {\n  clear: both;\n}\n\n.modal-footer .btn + .btn {\n  margin-left: 5px;\n  margin-bottom: 0;\n}\n\n.modal-footer .btn-group .btn + .btn {\n  margin-left: -1px;\n}\n\n.modal-footer .btn-block + .btn-block {\n  margin-left: 0;\n}\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll;\n}\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto;\n  }\n  .modal-content {\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n  }\n  .modal-sm {\n    width: 300px;\n  }\n}\n\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px;\n  }\n}\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.428571429;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 12px;\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.tooltip.in {\n  opacity: 0.9;\n  filter: alpha(opacity=90);\n}\n\n.tooltip.top {\n  margin-top: -3px;\n  padding: 5px 0;\n}\n\n.tooltip.right {\n  margin-left: 3px;\n  padding: 0 5px;\n}\n\n.tooltip.bottom {\n  margin-top: 3px;\n  padding: 5px 0;\n}\n\n.tooltip.left {\n  margin-left: -3px;\n  padding: 0 5px;\n}\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 4px;\n}\n\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n\n.tooltip.top-left .tooltip-arrow {\n  bottom: 0;\n  right: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000;\n}\n\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000;\n}\n\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.428571429;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 14px;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n}\n\n.popover.top {\n  margin-top: -10px;\n}\n\n.popover.right {\n  margin-left: 10px;\n}\n\n.popover.bottom {\n  margin-top: 10px;\n}\n\n.popover.left {\n  margin-left: -10px;\n}\n\n.popover-title {\n  margin: 0;\n  padding: 8px 14px;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0;\n}\n\n.popover-content {\n  padding: 9px 14px;\n}\n\n.popover > .arrow, .popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n\n.popover > .arrow {\n  border-width: 11px;\n}\n\n.popover > .arrow:after {\n  border-width: 10px;\n  content: \"\";\n}\n\n.popover.top > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-bottom-width: 0;\n  border-top-color: #999999;\n  border-top-color: rgba(0, 0, 0, 0.25);\n  bottom: -11px;\n}\n\n.popover.top > .arrow:after {\n  content: \" \";\n  bottom: 1px;\n  margin-left: -10px;\n  border-bottom-width: 0;\n  border-top-color: #fff;\n}\n\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-left-width: 0;\n  border-right-color: #999999;\n  border-right-color: rgba(0, 0, 0, 0.25);\n}\n\n.popover.right > .arrow:after {\n  content: \" \";\n  left: 1px;\n  bottom: -10px;\n  border-left-width: 0;\n  border-right-color: #fff;\n}\n\n.popover.bottom > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999999;\n  border-bottom-color: rgba(0, 0, 0, 0.25);\n  top: -11px;\n}\n\n.popover.bottom > .arrow:after {\n  content: \" \";\n  top: 1px;\n  margin-left: -10px;\n  border-top-width: 0;\n  border-bottom-color: #fff;\n}\n\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999999;\n  border-left-color: rgba(0, 0, 0, 0.25);\n}\n\n.popover.left > .arrow:after {\n  content: \" \";\n  right: 1px;\n  border-right-width: 0;\n  border-left-color: #fff;\n  bottom: -10px;\n}\n\n.carousel {\n  position: relative;\n}\n\n.carousel-inner {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n}\n\n.carousel-inner > .item {\n  display: none;\n  position: relative;\n  -webkit-transition: 0.6s ease-in-out left;\n  transition: 0.6s ease-in-out left;\n}\n\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n  line-height: 1;\n}\n\n@media all and (transform-3d), (-webkit-transform-3d) {\n  .carousel-inner > .item {\n    -webkit-transition: -webkit-transform 0.6s ease-in-out;\n    transition: -webkit-transform 0.6s ease-in-out;\n    transition: transform 0.6s ease-in-out;\n    transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;\n    -webkit-backface-visibility: hidden;\n    backface-visibility: hidden;\n    -webkit-perspective: 1000px;\n    perspective: 1000px;\n  }\n  .carousel-inner > .item.next, .carousel-inner > .item.active.right, .carousel-inner > .item.right.ax-active {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    left: 0;\n  }\n  .carousel-inner > .item.prev, .carousel-inner > .item.active.left, .carousel-inner > .item.left.ax-active {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    left: 0;\n  }\n  .carousel-inner > .item.next.left, .carousel-inner > .item.prev.right, .carousel-inner > .item.active, .carousel-inner > .item.ax-active {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    left: 0;\n  }\n}\n\n.carousel-inner > .active, .carousel-inner > .ax-active,\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  display: block;\n}\n\n.carousel-inner > .active, .carousel-inner > .ax-active {\n  left: 0;\n}\n\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.carousel-inner > .next {\n  left: 100%;\n}\n\n.carousel-inner > .prev {\n  left: -100%;\n}\n\n.carousel-inner > .next.left,\n.carousel-inner > .prev.right {\n  left: 0;\n}\n\n.carousel-inner > .active.left, .carousel-inner > .left.ax-active {\n  left: -100%;\n}\n\n.carousel-inner > .active.right, .carousel-inner > .right.ax-active {\n  left: 100%;\n}\n\n.carousel-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 15%;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  background-color: transparent;\n}\n\n.carousel-control.left {\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\n}\n\n.carousel-control.right {\n  left: auto;\n  right: 0;\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\n}\n\n.carousel-control:hover, .carousel-control:focus {\n  outline: 0;\n  color: #fff;\n  text-decoration: none;\n  opacity: 0.9;\n  filter: alpha(opacity=90);\n}\n\n.carousel-control .icon-prev,\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-left,\n.carousel-control .glyphicon-chevron-right {\n  position: absolute;\n  top: 50%;\n  margin-top: -10px;\n  z-index: 5;\n  display: inline-block;\n}\n\n.carousel-control .icon-prev,\n.carousel-control .glyphicon-chevron-left {\n  left: 50%;\n  margin-left: -10px;\n}\n\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-right {\n  right: 50%;\n  margin-right: -10px;\n}\n\n.carousel-control .icon-prev,\n.carousel-control .icon-next {\n  width: 20px;\n  height: 20px;\n  line-height: 1;\n  font-family: serif;\n}\n\n.carousel-control .icon-prev:before {\n  content: '\\2039';\n}\n\n.carousel-control .icon-next:before {\n  content: '\\203A';\n}\n\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  margin-left: -30%;\n  padding-left: 0;\n  list-style: none;\n  text-align: center;\n}\n\n.carousel-indicators li {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin: 1px;\n  text-indent: -999px;\n  border: 1px solid #fff;\n  border-radius: 10px;\n  cursor: pointer;\n  background-color: #000 \\9;\n  background-color: transparent;\n}\n\n.carousel-indicators .active, .carousel-indicators .ax-active {\n  margin: 0;\n  width: 12px;\n  height: 12px;\n  background-color: #fff;\n}\n\n.carousel-caption {\n  position: absolute;\n  left: 15%;\n  right: 15%;\n  bottom: 20px;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n}\n\n.carousel-caption .btn {\n  text-shadow: none;\n}\n\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px;\n  }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px;\n  }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px;\n  }\n  .carousel-caption {\n    left: 20%;\n    right: 20%;\n    padding-bottom: 30px;\n  }\n  .carousel-indicators {\n    bottom: 20px;\n  }\n}\n\n.clearfix:before, .clearfix:after {\n  content: \" \";\n  display: table;\n}\n\n.clearfix:after {\n  clear: both;\n}\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.pull-right {\n  float: right !important;\n}\n\n.pull-left {\n  float: left !important;\n}\n\n.hide {\n  display: none !important;\n}\n\n.show, .ax-show {\n  display: block !important;\n}\n\n.invisible, .ax-invisible {\n  visibility: hidden;\n}\n\n.text-hide, .ax-text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n\n.hidden, .ax-hide, .ax-omitted {\n  display: none !important;\n}\n\n.affix {\n  position: fixed;\n}\n\n@-ms-viewport {\n  width: device-width;\n}\n\n.visible-xs {\n  display: none !important;\n}\n\n.visible-sm {\n  display: none !important;\n}\n\n.visible-md {\n  display: none !important;\n}\n\n.visible-lg {\n  display: none !important;\n}\n\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important;\n}\n\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important;\n  }\n  table.visible-xs {\n    display: table !important;\n  }\n  tr.visible-xs {\n    display: table-row !important;\n  }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important;\n  }\n}\n\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important;\n  }\n}\n\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important;\n  }\n}\n\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important;\n  }\n  table.visible-sm {\n    display: table !important;\n  }\n  tr.visible-sm {\n    display: table-row !important;\n  }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important;\n  }\n}\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important;\n  }\n}\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important;\n  }\n}\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important;\n  }\n  table.visible-md {\n    display: table !important;\n  }\n  tr.visible-md {\n    display: table-row !important;\n  }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important;\n  }\n}\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important;\n  }\n}\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important;\n  }\n}\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important;\n  }\n  table.visible-lg {\n    display: table !important;\n  }\n  tr.visible-lg {\n    display: table-row !important;\n  }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important;\n  }\n}\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important;\n  }\n}\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important;\n  }\n}\n\n.visible-print {\n  display: none !important;\n}\n\n@media print {\n  .visible-print {\n    display: block !important;\n  }\n  table.visible-print {\n    display: table !important;\n  }\n  tr.visible-print {\n    display: table-row !important;\n  }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important;\n  }\n}\n\n.visible-print-block {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-block {\n    display: block !important;\n  }\n}\n\n.visible-print-inline {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-inline {\n    display: inline !important;\n  }\n}\n\n.visible-print-inline-block {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media print {\n  .hidden-print {\n    display: none !important;\n  }\n}\n\n@-webkit-keyframes ax-spin-around {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes ax-spin-around {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n.ax-invisible {\n  visibility: hidden !important;\n}\n\n[readonly],\n.ax-readonly {\n  color: #555555 !important;\n  cursor: default !important;\n}\n\n[disabled],\n.ax-disabled {\n  cursor: default !important;\n  pointer-events: none;\n  color: #555555 !important;\n}\n\n.ax-error {\n  color: #a94442 !important;\n}\n\nselect[readonly], select.ax-readonly,\ntextarea[readonly],\ntextarea.ax-readonly,\ninput[type=\"text\"][readonly],\ninput[type=\"text\"].ax-readonly {\n  background: #777777;\n  border-color: #555555;\n}\n\nselect[disabled], select.ax-disabled,\ntextarea[disabled],\ntextarea.ax-disabled,\ninput[type=\"text\"][disabled],\ninput[type=\"text\"].ax-disabled {\n  background: #777777;\n  border-color: #555555;\n}\n\nselect.ax-error,\ntextarea.ax-error,\ninput[type=\"text\"].ax-error {\n  background: transparent;\n  border-color: #a94442;\n}\n\n.table .ax-error {\n  color: #a94442 !important;\n}\n\n.table input[type=\"text\"][readonly],\n.table input[type=\"text\"][readonly] .ax-error, .table input[type=\"text\"].ax-readonly,\n.table input[type=\"text\"].ax-readonly .ax-error, .table input[type=\"text\"][disabled],\n.table input[type=\"text\"][disabled] .ax-error, .table input[type=\"text\"].ax-disabled,\n.table input[type=\"text\"].ax-disabled .ax-error {\n  border-color: transparent !important;\n}\n\n.ax-icon-previous:before {\n  content: \"\\F0A8\";\n}\n\n.ax-icon-previous-primary:before {\n  content: \"\\F0A8\";\n}\n\n.ax-icon-next:before {\n  content: \"\\F0A9\";\n}\n\n.ax-icon-next-primary:before {\n  content: \"\\F0A9\";\n}\n\n.ax-icon-add:before {\n  content: \"\\F067\";\n}\n\n.ax-icon-delete:before {\n  content: \"\\F057\";\n}\n\n.ax-icon-ok:before {\n  content: \"\\F058\";\n}\n\n.ax-icon-apply:before {\n  content: \"\\F058\";\n}\n\n.ax-icon-cancel:before {\n  content: \"\\F057\";\n}\n\n.ax-icon-yes:before {\n  content: \"\\F058\";\n}\n\n.ax-icon-no:before {\n  content: \"\\F057\";\n}\n\n.ax-icon-finish:before {\n  content: \"\\F058\";\n}\n\n.ax-icon-info:before {\n  content: \"\\F05A\";\n}\n\n.ax-icon-warn:before {\n  content: \"\\F071\";\n}\n\n.ax-icon-help:before {\n  content: \"\\F059\";\n}\n\n.ax-icon-print:before {\n  content: \"\\F02F\";\n}\n\n.ax-text-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=theme.css.map */", ""]);
	
	// exports


/***/ },
/* 248 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-b3c2f0.eot";

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-b3c2f0.eot";

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-2b3c8b.svg";

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-574ea2.woff2";

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-507970.woff";

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/fontawesome-webfont-27cf1f.ttf";

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/glyphicons-halflings-regular-86b6f6.eot";

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/glyphicons-halflings-regular-ca35b6.woff2";

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/glyphicons-halflings-regular-278e49.woff";

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/glyphicons-halflings-regular-44bc18.ttf";

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/glyphicons-halflings-regular-de51a8.svg";

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 261 */
/***/ function(module, exports) {

	module.exports = "<div class=\"fluid-container\">\n   <div class=\"app-toolbar\">\n      <div data-ax-widget-area=\"toolbar\"></div>\n   </div>\n   <div data-ax-widget-area=\"tabsevents\"></div>\n   <div style=\"height: 200px\" data-ax-widget-area=\"tabspage\"></div>\n   <div data-ax-widget-area=\"tabslog\"></div>\n</div>\n"

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	var resource = __webpack_require__( 263 );
	module.exports = typeof resource === 'string' ? resource : null;

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(264);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(260)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./tools.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./tools.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(248)();
	// imports
	
	
	// module
	exports.push([module.id, "@charset \"UTF-8\";\n\nhtml, body {\n   height: 100%;\n}\n\n.tools-layout .app-toolbar {\n   height: 35px;\n}\n\n.tools-layout .nav {\n   height: 42px;\n}\n\n.tools-layout .app-tab {\n   height: calc( 100vh - 42px );\n   position: relative;\n}\n\n.tools-layout .app-tab-content {\n  border: 1px solid #ddd;\n  border-top: none;\n  padding: 20px;\n  margin-bottom: 20px;\n}\n", ""]);
	
	// exports


/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict'; /**
	               * Copyright 2016 aixigo AG
	               * Released under the MIT license.
	               * http://laxarjs.org/license
	               */
	
	/* global chrome */
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function (ax) {
	   'use strict';
	
	   var REFRESH_DELAY_MS = 100;
	
	   //Security wrapper denied access to property "buffers" on privileged Javascript object.
	   //Support for exposing privileged objects to untrusted content via __exposedProps__ is being
	   //gradually removed - use WebIDL bindings or Components.utils.cloneInto instead.
	   // Note that only the first denied property access from a given global object will be reported.
	
	   var controller = function controller(context, eventBus) {
	      var pageInfoVersion = -1;
	      var timeout;
	      var lastIndexByStream = {};
	      var isLaxarApplication;
	      var isBrowserWebExtension = window.chrome && chrome.runtime && chrome.runtime.id;
	      // If the development server is used and we don't want the development window to be reloaded each
	      // time something changes during development, we shutdown live reload here.
	      if (window.LiveReload && !context.features.development.liveReload) {
	         window.LiveReload.shutDown();
	      }
	
	      eventBus.subscribe('endLifecycleRequest', function () {
	         if (timeout) {
	            window.clearTimeout(timeout);
	         }
	      });
	
	      if (window.opener) {
	         eventBus.subscribe('beginLifecycleRequest', function () {
	            publishLaxarApplicationFlag(true);
	            tryPublishData();
	         });
	      } else
	      {
	         eventBus.subscribe('beginLifecycleRequest', function () {
	            publishLaxarApplicationFlag(false);
	            window.addEventListener('message', extensionEventListener);
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function extensionEventListener(event) {
	         var channel = JSON.parse(event.detail || event.data);
	         if (channel.text === 'noLaxarDeveloperToolsApi') {
	            publishLaxarApplicationFlag(false);
	            return;
	         }
	         var channelGridSettings = channel && channel.gridSettings;
	         if (context.features.grid.resource) {
	            publishGridSettings(channelGridSettings);
	         }
	         if (channel && channel.pageInfoVersion > pageInfoVersion) {
	            publishAndSetPageInfoVersion(channel.pageInfo, channel.pageInfoVersion);
	         }
	         var buffers = channel && channel.buffers;
	         if (buffers) {
	            publishStream('events', buffers);
	            publishStream('log', buffers);
	            publishLaxarApplicationFlag(true);
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function tryPublishData() {
	         try {
	            var channel = window.opener.axDeveloperTools;
	            publishDataOrHandleException(channel, false);
	         }
	         catch (exception) {
	            publishDataOrHandleException(undefined, true);
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function publishDataOrHandleException(channel, isException) {
	         if (isException) {
	            publishLaxarApplicationFlag(false);
	         } else
	         {
	            var channelGridSettings = channel && channel.gridSettings;
	            if (context.features.grid.resource) {
	               publishGridSettings(channelGridSettings);
	            }
	            publishLaxarApplicationFlag(true);
	            checkForData();
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function publishGridSettings(channelGridSettings) {
	         if (!channelGridSettings) {
	            channelGridSettings = null;
	         }
	         eventBus.publish('didReplace.' + context.features.grid.resource, {
	            resource: context.features.grid.resource,
	            data: channelGridSettings });
	
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function checkForData() {
	         try {
	            var channel = window.opener.axDeveloperTools;
	            checkForDataOrHandleException(channel, false);
	         } catch (e) {
	            checkForDataOrHandleException(undefined, true);
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function checkForDataOrHandleException(channel, isException) {
	         if (isException) {
	            publishLaxarApplicationFlag(false);
	         } else
	         {
	            var buffers = channel && channel.buffers;
	            if (buffers) {
	               publishStream('events', buffers);
	               publishStream('log', buffers);
	            }
	            if (channel && channel.pageInfoVersion > pageInfoVersion) {
	               publishAndSetPageInfoVersion(channel.pageInfo, channel.pageInfoVersion);
	            }
	            publishLaxarApplicationFlag(true);
	            timeout = window.setTimeout(checkForData, REFRESH_DELAY_MS);
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function publishAndSetPageInfoVersion(pageInfo, version) {
	         pageInfoVersion = version;
	         eventBus.publish('didReplace.' + context.features.pageInfo.resource, {
	            resource: context.features.pageInfo.resource,
	            data: pageInfo });
	
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function publishStream(bufferFeature, buffers) {
	         var buffer = buffers[bufferFeature];
	         var lastIndex = lastIndexByStream[bufferFeature] || -1;
	         var events = buffer.
	         filter(function (_) {return lastIndex < _.index;}).
	         map(function (_) {return JSON.parse(_.json);});
	         if (!events.length) {
	            return;
	         }
	         eventBus.publish('didProduce.' + context.features[bufferFeature].stream, {
	            stream: context.features[bufferFeature].stream,
	            data: events });
	
	         lastIndexByStream[bufferFeature] = buffer[buffer.length - 1].index;
	         navigation(events);
	      }
	
	      /////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function navigation(events) {
	         events.forEach(function (event) {
	            if (event.action === 'publish' && event.event.substr(0, 11) === 'didNavigate') {
	               eventBus.publish('takeActionRequest.navigation', {
	                  action: 'navigation' });
	
	            }
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function publishLaxarApplicationFlag(state) {
	         if (isLaxarApplication !== state) {
	            eventBus.publish('didChangeFlag.' + context.features.laxarApplication.flag + '.' + state, {
	               flag: context.features.laxarApplication.flag,
	               state: state });
	
	            isLaxarApplication = state;
	            if (isBrowserWebExtension) {
	               chrome.runtime.sendMessage({
	                  active: state,
	                  id: chrome.devtools.inspectedWindow.tabId });
	
	            }
	         }
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return {
	      name: 'host-connector-widget',
	      injections: ['axContext', 'axEventBus'],
	      create: controller };
	
	
	
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
	
	
	
	
	
	var _react = __webpack_require__(267);var _react2 = _interopRequireDefault(_react);
	var _laxarPatterns = __webpack_require__(268);var axPatterns = _interopRequireWildcard(_laxarPatterns);
	var _moment = __webpack_require__(279);var _moment2 = _interopRequireDefault(_moment);
	var _tracker = __webpack_require__(389);var _tracker2 = _interopRequireDefault(_tracker);
	var _AutoAffix = __webpack_require__(390);var _AutoAffix2 = _interopRequireDefault(_AutoAffix);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;} /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */function create(context, reactRender) {'use strict';
	
	   var view = {
	      showPatterns: false };
	
	
	   var settingGroups = ['patterns', 'interactions', 'sources'];
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   var patternTopics = {
	      RESOURCE: ['didReplace', 'didUpdate'],
	      ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'],
	      FLAG: ['didChangeFlag'],
	      CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   context.resources = {};
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   var patterns = [
	   {
	      name: 'lifecycle',
	      eventTypes: ['endLifecycle', 'beginLifecycle'] },
	
	   {
	      name: 'navigation',
	      eventTypes: ['navigate'] },
	
	   {
	      name: 'resources',
	      eventTypes: ['replace', 'update', 'validate', 'save'] },
	
	   {
	      name: 'actions',
	      eventTypes: ['takeAction'] },
	
	   {
	      name: 'flags',
	      eventTypes: ['changeFlag'] },
	
	   {
	      name: 'i18n',
	      eventTypes: ['changeLocale'] },
	
	   {
	      name: 'visibility',
	      eventTypes: ['changeAreaVisibility', 'changeWidgetVisibility'] },
	
	   {
	      name: 'other',
	      eventTypes: [] }];
	
	
	
	   var settings = setDefaults({
	      namePattern: '',
	      visibleEventsLimit: 100,
	      patterns: {},
	      interactions: {
	         subscribe: true,
	         publish: true,
	         deliver: true,
	         unsubscribe: true },
	
	      sources: {
	         widgets: true,
	         runtime: true } },
	
	   patterns);
	
	   var model = {
	      patterns: patterns,
	      index: 0,
	      eventInfos: [],
	      visibleEventInfos: [],
	      problemSummary: {
	         count: 0,
	         eventInfos: [] },
	
	      selectionEventInfo: null,
	      settings: settings };
	
	
	   axPatterns.resources.handlerFor(context).registerResourceFromFeature('filter', {
	      onUpdateReplace: function onUpdateReplace() {runFilters();render();},
	      isOptional: true });
	
	
	   if (context.features.events.stream) {
	      context.eventBus.subscribe('didProduce.' + context.features.events.stream, function (event) {
	         if (Array.isArray(event.data) && event.data.length) {
	            event.data.forEach(addEvent);
	         } else
	         {
	            addEvent(event.data);
	         }
	         runFilters();
	         render();
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function setDefaults(settings, patterns) {
	      settingGroups.forEach(function (groupName) {
	         var group = settings[groupName];
	         for (var name in group) {
	            if (group.hasOwnProperty(name)) {
	               group[name] = true;
	            }
	         }
	      });
	      patterns.forEach(function (patternInfo) {
	         settings.patterns[patternInfo.name] = true;
	      });
	      context.features.filter.hidePatterns.forEach(function (pattern) {
	         settings.patterns[pattern] = false;
	      });
	      context.features.filter.hideSources.forEach(function (pattern) {
	         settings.sources[pattern] = false;
	      });
	      context.features.filter.hideInteractions.forEach(function (pattern) {
	         settings.interactions[pattern] = false;
	      });
	      return settings;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function addEvent(eventInfo) {
	      var completeEventInfo = {
	         index: ++model.index,
	         interaction: eventInfo.action,
	         cycleId: eventInfo.cycleId > -1 ? eventInfo.cycleId : '-',
	         eventObject: eventInfo.eventObject || {},
	         formattedEvent: JSON.stringify(eventInfo.eventObject, null, 3),
	         formattedTime: {
	            upper: (0, _moment2.default)(eventInfo.time).format('HH:mm'),
	            lower: (0, _moment2.default)(eventInfo.time).format('ss.SSS') },
	
	         name: eventInfo.event || '?',
	         pattern: pattern((eventInfo.event || '?').toLowerCase()),
	         showDetails: false,
	         source: (eventInfo.source || '?').replace(/^widget\./, ''),
	         target: (eventInfo.target || '?').replace(/^-$/, ''),
	         time: eventInfo.time,
	         selected: false,
	         sourceType: (eventInfo.source || '?').indexOf('widget.') === 0 ? 'widgets' : 'runtime',
	         problems: _tracker2.default.track(eventInfo) };
	
	
	      model.eventInfos.unshift(completeEventInfo);
	      if (completeEventInfo.problems.length) {
	         refreshProblemSummary();
	      }
	
	      if (model.eventInfos.length > context.features.events.bufferSize) {
	         var removedInfo = model.eventInfos.pop();
	         if (removedInfo.problems.length) {
	            refreshProblemSummary();
	         }
	      }
	
	      function pattern(eventName) {
	         var matchingPatthern = model.patterns.filter(function (pattern) {
	            return pattern.eventTypes.some(function (eventType) {
	               return eventName.indexOf(eventType.toLowerCase()) !== -1;
	            });
	         });
	         return matchingPatthern.length ? matchingPatthern[0].name : 'other';
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function runFilters() {
	      var settings = model.settings;
	      var numVisible = 0;
	
	      var searchRegExp = null;
	      if (settings.namePattern) {
	         try {
	            searchRegExp = new RegExp(settings.namePattern, 'gi');
	         }
	         catch (e) {/* ignore invalid search pattern */}
	      }
	
	      model.visibleEventInfos = model.eventInfos.filter(function (eventInfo) {
	         if (settings.visibleEventsLimit !== null && numVisible >= settings.visibleEventsLimit) {
	            return false;
	         }
	         if (!settings.interactions[eventInfo.interaction]) {
	            return false;
	         }
	         if (!settings.patterns[eventInfo.pattern]) {
	            return false;
	         }
	         if (!settings.sources[eventInfo.sourceType]) {
	            return false;
	         }
	         if (!matchesFilterResource(eventInfo)) {
	            return false;
	         }
	         if (!matchesSearchExpression(eventInfo, searchRegExp)) {
	            return false;
	         }
	         ++numVisible;
	         return true;
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function filterBySearch(event) {
	      settings.namePattern = event.target.value;
	      runFilters();
	      render();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function limitEvents(event) {
	      if (event.target.value === '') {
	         settings.visibleEventsLimit = null;
	      }
	      var value = Number(event.target.value);
	      if (!Number.isInteger(value)) {return;}
	      if (value >= 0 && value <= 5000) {
	         settings.visibleEventsLimit = event.target.value;
	      }
	      runFilters();
	      render();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function refreshProblemSummary() {
	      var eventInfos = model.eventInfos.filter(function (info) {
	         return info.problems.length > 0;
	      });
	
	      model.problemSummary = {
	         hasProblems: eventInfos.length > 0,
	         eventInfos: eventInfos };
	
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function matchesSearchExpression(eventInfo, searchRegExp) {
	      return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target].
	      some(function (field) {
	         var matches = searchRegExp.test(field);
	         searchRegExp.lastIndex = 0;
	         return !!matches;
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function matchesFilterResource(eventInfo) {
	      if (!context.resources.filter) {
	         return true;
	      }
	
	      var filterTopics = context.resources.filter.topics || [];
	      var filterParticipants = context.resources.filter.participants || [];
	      if (!filterTopics.length && !filterParticipants.length) {
	         return true;
	      }
	
	      var matchesTopicFilter = filterTopics.
	      some(function (item) {
	         var prefixes = patternTopics[item.pattern];
	         return prefixes.some(function (prefix) {
	            var topic = prefix + '.' + item.topic;
	            return eventInfo.name === topic || eventInfo.name.indexOf(topic + '.') === 0;
	         });
	      });
	
	      var matchesParticipantsFilter = ['target', 'source'].some(function (field) {
	         var value = eventInfo[field];
	         return filterParticipants.
	         map(function (_) {return _.participant;}).
	         some(isSuffixOf(value));
	      });
	
	      return matchesTopicFilter || matchesParticipantsFilter;
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function isSuffixOf(value) {
	         return function (_) {
	            var tail = '#' + _;
	            return value.length >= tail.length && value.indexOf(tail) === value.length - tail.length;
	         };
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function onSettingsChanged(type, group, name, state) {
	      var settings = model.settings;
	      var patterns = model.patterns;
	      switch (type) {
	         case 'ONE':
	            settings[group][name] = !state;
	            break;
	         case 'ON':
	            changeAll(true);
	            break;
	         case 'OFF':
	            changeAll(false);
	            break;
	         case 'DEFAULTS':
	            settings = setDefaults(settings, patterns);
	            break;}
	
	
	      runFilters();
	
	      render();
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function changeAll(enable) {
	         ['patterns', 'interactions', 'sources'].forEach(function (_group) {
	            Object.keys(settings[_group]).forEach(function (_name) {
	               settings[_group][_name] = enable;
	            });
	         });
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function clearFilters() {
	      model.settings.namePattern = '';
	      model.settings.visibleEventsLimit = null;
	      onSettingsChanged('ON');
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function discardEvents() {
	      model.eventInfos = [];
	      model.selectionEventInfo = null;
	      runFilters();
	      refreshProblemSummary();
	      render();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function handleSelection(selectedEvent) {
	      if (selectedEvent.selected) {
	         model.selectionEventInfo = null;
	         model.visibleEventInfos.forEach(function (event) {
	            event.selected = false;
	         });
	         render();
	         return;
	      }
	
	      model.visibleEventInfos.forEach(function (event) {
	         if (event.index === selectedEvent.index) {
	            model.selectionEventInfo = event;
	            event.selected = true;
	            return;
	         }
	         event.selected = inSelection(event, selectedEvent);
	      });
	
	      render();
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function inSelection(eventInfo, selectionEventInfo) {
	         if (!selectionEventInfo) {
	            return false;
	         }
	
	         return eventInfo === selectionEventInfo ||
	         eventInfo.cycleId === selectionEventInfo.cycleId &&
	         eventInfo.source === selectionEventInfo.source &&
	         eventInfo.name === selectionEventInfo.name;
	
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   PatternsHtmlIcon = function (_React$Component) {_inherits(PatternsHtmlIcon, _React$Component);
	
	      function PatternsHtmlIcon(props) {_classCallCheck(this, PatternsHtmlIcon);var _this = _possibleConstructorReturn(this, (PatternsHtmlIcon.__proto__ || Object.getPrototypeOf(PatternsHtmlIcon)).call(this,
	         props));
	         _this.props = props;
	
	         switch (props.name) {
	            case 'lifecycle':
	               _this.iconClass = 'fa fa-recycle';
	               break;
	            case 'navigation':
	               _this.iconClass = 'fa fa-location-arrow';
	               break;
	            case 'resources':
	               _this.iconClass = 'fa fa-file-text-o';
	               break;
	            case 'actions':
	               _this.iconClass = 'fa fa-rocket';
	               break;
	            case 'flags':
	               _this.iconClass = 'fa fa-flag';
	               break;
	            case 'i18n':
	               _this.iconClass = 'fa fa-globe';
	               break;
	            case 'visibility':
	               _this.iconClass = 'fa fa-eye';
	               break;
	            default:
	               _this.iconClass = '';}return _this;
	
	      }_createClass(PatternsHtmlIcon, [{ key: 'render', value: function render()
	
	         {
	            return (
	               _react2.default.createElement('i', { className: this.iconClass }));
	
	
	         } }]);return PatternsHtmlIcon;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   NumberOfEvents = function (_React$Component2) {_inherits(NumberOfEvents, _React$Component2);
	      function NumberOfEvents(props) {_classCallCheck(this, NumberOfEvents);var _this2 = _possibleConstructorReturn(this, (NumberOfEvents.__proto__ || Object.getPrototypeOf(NumberOfEvents)).call(this,
	         props));
	         _this2.props = props;return _this2;
	      }_createClass(NumberOfEvents, [{ key: 'render', value: function render()
	
	         {
	            if (this.props.numberOfEvents === 0) {
	               return (
	                  _react2.default.createElement('div', { className: 'text-large' },
	                     _react2.default.createElement('h4', { className: 'text-primary' }, 'Empty Events List'),
	                     _react2.default.createElement('p', null, _react2.default.createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...')));
	
	
	            }
	
	            if (this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {
	               return (
	                  _react2.default.createElement('div', { className: 'text-large' },
	                     _react2.default.createElement('h4', { className: 'text-primary' }, '0/', this.props.numberOfEvents, ' Event Items'),
	                     _react2.default.createElement('p', null, 'No events matching current filters.'),
	                     _react2.default.createElement('p', null,
	                        _react2.default.createElement('button', { type: 'button',
	                              className: 'btn btn-sm btn-primary',
	                              onClick: this.props.clearFilters }, 'Show All'))));
	
	
	
	
	            }
	
	            return (
	               _react2.default.createElement('div', { className: 'text-large' },
	                  _react2.default.createElement('h4', { className: 'text-primary' },
	                     this.props.numberOfVisibleEvents, '/', this.props.numberOfEvents, ' Events')));
	
	
	
	
	         } }]);return NumberOfEvents;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   FiltersAndLimitForm = function (_React$Component3) {_inherits(FiltersAndLimitForm, _React$Component3);
	      function FiltersAndLimitForm(props) {_classCallCheck(this, FiltersAndLimitForm);return _possibleConstructorReturn(this, (FiltersAndLimitForm.__proto__ || Object.getPrototypeOf(FiltersAndLimitForm)).call(this,
	         props));
	      }_createClass(FiltersAndLimitForm, [{ key: 'render', value: function render()
	
	         {
	            var searchId = context.id('search');
	            var limitId = context.id('limit');
	
	            return (
	               _react2.default.createElement('div', { className: 'form-group form-group-sm' },
	                  this.props.searchRegExp,
	                  _react2.default.createElement('label', { htmlFor: searchId },
	                     _react2.default.createElement('small', null, 'Filters:')),
	
	                  _react2.default.createElement('input', { className: 'form-control input-sm',
	                     placeholder: 'Search (RegExp)',
	                     id: searchId,
	                     type: 'text',
	                     value: this.props.searchRegExp,
	                     onChange: this.props.filterBySearch }),
	                  _react2.default.createElement('label', { htmlFor: limitId },
	                     _react2.default.createElement('small', null, 'Limit:')),
	
	                  _react2.default.createElement('input', {
	                     className: 'form-control input-sm',
	                     type: 'text',
	                     id: limitId,
	                     placeholder: '0-5000',
	                     maxLength: 4,
	                     value: this.props.limit,
	                     onChange: this.props.limitEvents })));
	
	
	
	         } }]);return FiltersAndLimitForm;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   SettingsToggleButton = function (_React$Component4) {_inherits(SettingsToggleButton, _React$Component4);
	      function SettingsToggleButton(props) {_classCallCheck(this, SettingsToggleButton);var _this4 = _possibleConstructorReturn(this, (SettingsToggleButton.__proto__ || Object.getPrototypeOf(SettingsToggleButton)).call(this,
	         props));
	         _this4.props = props;
	         _this4.handleClick = _this4.handleClick.bind(_this4);return _this4;
	      }_createClass(SettingsToggleButton, [{ key: 'handleClick', value: function handleClick(
	
	         e) {
	            this.props.onSettingsChanged('ONE', this.props.type, this.props.text, this.props.enabled);
	            e.stopPropagation();
	         } }, { key: 'render', value: function render()
	
	         {
	            var toggleClassNames = 'fa pull-right ax-event-setting-toggle' + (
	            this.props.enabled ? ' fa-toggle-on' : ' fa-toggle-off');
	            return (
	               _react2.default.createElement('button', {
	                     type: 'button',
	                     className: 'btn btn-link ax-event-setting-toggle',
	                     onClick: this.handleClick }, this.props.icon &&
	                  _react2.default.createElement('span', { className: 'ax-event-pattern' }, _react2.default.createElement(PatternsHtmlIcon, { name: this.props.text })),
	                  this.props.text, ' ', _react2.default.createElement('i', { className: toggleClassNames })));
	
	
	         } }]);return SettingsToggleButton;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   SelectFiltersButton = function (_React$Component5) {_inherits(SelectFiltersButton, _React$Component5);
	      function SelectFiltersButton(props) {_classCallCheck(this, SelectFiltersButton);var _this5 = _possibleConstructorReturn(this, (SelectFiltersButton.__proto__ || Object.getPrototypeOf(SelectFiltersButton)).call(this,
	         props));
	         _this5.props = props;
	         _this5.state = { showPatterns: false };
	         _this5.allOnClick = _this5.allOnClick.bind(_this5);
	         _this5.allOffClick = _this5.allOffClick.bind(_this5);
	         _this5.defaultsClick = _this5.defaultsClick.bind(_this5);return _this5;
	      }_createClass(SelectFiltersButton, [{ key: 'allOnClick', value: function allOnClick(
	
	         e) {
	            this.props.onSettingsChanged('ON');
	            e.stopPropagation();
	         } }, { key: 'allOffClick', value: function allOffClick(
	
	         e) {
	            this.props.onSettingsChanged('OFF');
	            e.stopPropagation();
	         } }, { key: 'defaultsClick', value: function defaultsClick(
	
	
	         e) {
	            this.props.onSettingsChanged('DEFAULTS');
	            e.stopPropagation();
	         } }, { key: 'render', value: function render()
	
	         {var _this6 = this;
	            var handleMouseEnter = function handleMouseEnter() {return _this6.setState({ showPatterns: true });};
	            var handleMouseLeave = function handleMouseLeave() {return _this6.setState({ showPatterns: false });};
	
	            var patternsButtons = this.props.patterns.map(function (pattern) {
	               return (
	                  _react2.default.createElement(SettingsToggleButton, { key: pattern.name,
	                     type: 'patterns',
	                     text: pattern.name,
	                     icon: true,
	                     enabled: _this6.props.settings.patterns[pattern.name],
	                     onSettingsChanged: _this6.props.onSettingsChanged }));
	
	            });
	
	            var interactionsButtons = Object.keys(this.props.settings.interactions).map(function (interaction) {
	               return (
	                  _react2.default.createElement(SettingsToggleButton, { key: interaction,
	                     type: 'interactions',
	                     text: interaction,
	                     enabled: _this6.props.settings.interactions[interaction],
	                     onSettingsChanged: _this6.props.onSettingsChanged }));
	
	            });
	
	            var sourceButtons = Object.keys(this.props.settings.sources).map(function (source) {
	               return (
	                  _react2.default.createElement(SettingsToggleButton, { key: source,
	                     type: 'sources',
	                     text: source,
	                     enabled: _this6.props.settings.sources[source],
	                     onSettingsChanged: _this6.props.onSettingsChanged }));
	
	            });
	
	            var commandBar =
	            _react2.default.createElement('div', { className: 'pull-right' },
	               _react2.default.createElement('button', { type: 'button',
	                     onClick: this.allOnClick,
	                     className: 'btn btn-xs btn-primary' }, 'All On'),
	
	               _react2.default.createElement('button', { type: 'button',
	                     onClick: this.allOffClick,
	                     className: 'btn btn-xs btn-primary' }, 'All Off'),
	
	               _react2.default.createElement('button', { type: 'button',
	                     onClick: this.defaultsClick,
	                     className: 'btn btn-xs' }, 'Defaults'));
	
	
	
	
	            return (
	               _react2.default.createElement('div', { className: this.state.showPatterns ? 'btn-group btn-group-sm open' : 'btn-group btn-group-sm',
	                     onMouseEnter: handleMouseEnter,
	                     onMouseLeave: handleMouseLeave },
	                  _react2.default.createElement('button', { type: 'button',
	                        className: 'btn btn-default dropdown-toggle',
	                        'data-toggle': 'dropdown',
	                        'aria-expanded': view.showPatterns }, 'More ',
	                     _react2.default.createElement('span', { className: 'caret' })),
	
	                  _react2.default.createElement('div', { className: 'dropdown-menu container col-lg-6', role: 'menu' },
	
	                     _react2.default.createElement('div', { className: 'row' },
	                        _react2.default.createElement('div', { className: 'ax-event-settings-col first' },
	                           _react2.default.createElement('h4', null, 'Patterns'),
	                           _react2.default.createElement('div', null, patternsButtons)),
	
	
	                        _react2.default.createElement('div', { className: 'ax-event-settings-col last' },
	                           _react2.default.createElement('h4', null, 'Interactions'),
	                           _react2.default.createElement('div', null, interactionsButtons),
	
	                           _react2.default.createElement('br', null),
	                           _react2.default.createElement('h4', null, 'Sources'),
	                           _react2.default.createElement('div', null, sourceButtons))),
	
	
	
	
	                     _react2.default.createElement('div', { className: 'row' },
	                        _react2.default.createElement('div', { className: 'ax-event-settings-col first' }, '\xA0'),
	                        _react2.default.createElement('div', { className: 'ax-event-settings-col last' },
	                           commandBar)))));
	
	
	
	
	
	
	         } }]);return SelectFiltersButton;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   DiscardEventsButton = function (_React$Component6) {_inherits(DiscardEventsButton, _React$Component6);
	      function DiscardEventsButton(props) {_classCallCheck(this, DiscardEventsButton);var _this7 = _possibleConstructorReturn(this, (DiscardEventsButton.__proto__ || Object.getPrototypeOf(DiscardEventsButton)).call(this,
	         props));
	         _this7.props = props;
	         _this7.handleClick = _this7.handleClick.bind(_this7);return _this7;
	      }_createClass(DiscardEventsButton, [{ key: 'handleClick', value: function handleClick(
	
	         e) {
	            e.stopPropagation();
	            this.props.onDiscard();
	         } }, { key: 'render', value: function render()
	
	         {
	            var classNames = 'btn btn-primary btn-sm';
	
	            if (this.props.eventInfosLength === 0) {
	               classNames = classNames + ' ax-disabled';
	            }
	            return _react2.default.createElement('button', { className: classNames,
	                  type: 'button',
	                  onClick: this.handleClick }, 'Discard Events');
	         } }]);return DiscardEventsButton;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   ShowDetailsButton = function (_React$Component7) {_inherits(ShowDetailsButton, _React$Component7);
	      function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);var _this8 = _possibleConstructorReturn(this, (ShowDetailsButton.__proto__ || Object.getPrototypeOf(ShowDetailsButton)).call(this,
	         props));
	         _this8.props = props;
	         _this8.handleClick = _this8.handleClick.bind(_this8);return _this8;
	      }_createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(
	
	         e) {
	            this.props.onNameChanged();
	            e.stopPropagation();
	         } }, { key: 'render', value: function render()
	
	         {
	            return _react2.default.createElement('button', { type: 'button',
	                  className: 'btn-link btn-info',
	                  onClick: this.handleClick },
	               _react2.default.createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, '\xA0'));
	
	         } }]);return ShowDetailsButton;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   EventCell = function (_React$Component8) {_inherits(EventCell, _React$Component8);
	      function EventCell(props) {_classCallCheck(this, EventCell);var _this9 = _possibleConstructorReturn(this, (EventCell.__proto__ || Object.getPrototypeOf(EventCell)).call(this,
	         props));
	         _this9.props = props;return _this9;
	      }_createClass(EventCell, [{ key: 'render', value: function render()
	
	         {
	            var splitPoint = this.props.content.indexOf(this.props.separator);
	            if (splitPoint === -1) {
	               return _react2.default.createElement('td', null, _react2.default.createElement('span', null, this.props.content));
	            }
	            return _react2.default.createElement('td', null,
	               _react2.default.createElement('span', null, this.props.content.substring(0, splitPoint)), _react2.default.createElement('br', null),
	               _react2.default.createElement('span', null, this.props.content.substring(splitPoint + 1, this.props.content.length)));
	
	
	         } }]);return EventCell;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   EventBody = function (_React$Component9) {_inherits(EventBody, _React$Component9);
	      function EventBody(props) {_classCallCheck(this, EventBody);var _this10 = _possibleConstructorReturn(this, (EventBody.__proto__ || Object.getPrototypeOf(EventBody)).call(this,
	         props));
	         _this10.props = props;
	         _this10.state = {
	            showDetails: false };
	
	         _this10.handleName = _this10.handleName.bind(_this10);
	         _this10.handleClick = _this10.handleClick.bind(_this10);return _this10;
	      }_createClass(EventBody, [{ key: 'handleName', value: function handleName()
	
	         {
	            this.setState({ showDetails: !this.state.showDetails });
	         } }, { key: 'handleClick', value: function handleClick(
	
	         e) {
	            this.props.onSelection(this.props.event);
	         }
	
	         //////////////////////////////////////////////////////////////////////////////////////////////////
	      }, { key: 'render', value: function render()
	         {
	            var cssClassName = 'ax-event-pattern-' + this.props.event.pattern +
	            ' ax-event-interaction-' + this.props.event.interaction + (
	            this.props.event.selected ? ' ax-event-selected' : '') + (
	            this.props.event.problems.length ? ' ax-event-has-problems' : '');
	            var eventSummaryRow =
	            _react2.default.createElement('tr', { className: 'ax-event-summary' },
	               _react2.default.createElement('td', { className: 'ax-col-pattern-icon',
	                     title: this.props.event.pattern }, _react2.default.createElement(PatternsHtmlIcon, { name: this.props.event.pattern })),
	
	               _react2.default.createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction),
	               _react2.default.createElement('td', { className: 'ax-col-payload-icon' },
	                  this.props.event.interaction == 'publish' &&
	                  _react2.default.createElement(ShowDetailsButton, { showDetails: this.state.showDetails,
	                     onNameChanged: this.handleName })),
	
	
	               _react2.default.createElement(EventCell, { content: this.props.event.name, separator: '.' }),
	               _react2.default.createElement(EventCell, { content: this.props.event.source, separator: '#' }),
	               _react2.default.createElement(EventCell, { content: this.props.event.target, separator: '#' }),
	               _react2.default.createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId),
	               _react2.default.createElement('td', { className: 'text-right' }, _react2.default.createElement('span', null, this.props.event.formattedTime.upper), _react2.default.createElement('br', null),
	                  _react2.default.createElement('span', null, this.props.event.formattedTime.lower)));
	
	
	
	
	            ///////////////////////////////////////////////////////////////////////////////////////////////
	
	            function detailsRow(show, formattedEvent) {
	               if (!show) {
	                  return _react2.default.createElement('tr', null);
	               }
	               return _react2.default.createElement('tr', { className: 'ax-event-payload' },
	                  _react2.default.createElement('td', { colSpan: '3' }),
	                  _react2.default.createElement('td', { colSpan: '5' },
	                     _react2.default.createElement('pre', null, formattedEvent)));
	
	
	            }
	
	            ///////////////////////////////////////////////////////////////////////////////////////////////
	
	            function eventProblems(problems) {
	               if (problems.length === 0) {
	                  return _react2.default.createElement('tr', null);
	               }
	               var listOfProblems = problems.map(function (problem) {
	                  return (
	                     _react2.default.createElement('li', { key: problem.description, className: 'ax-event-problem' },
	                        _react2.default.createElement('i', { className: 'fa fa-warning' }), ' ', problem.description));
	
	
	               });
	               return (
	                  _react2.default.createElement('tr', { className: 'ax-event-payload' },
	                     _react2.default.createElement('td', { colSpan: '3' }),
	                     _react2.default.createElement('td', { colSpan: '5' },
	                        _react2.default.createElement('ul', null,
	                           listOfProblems))));
	
	
	
	
	            }
	
	            ///////////////////////////////////////////////////////////////////////////////////////////////
	
	            return (
	               _react2.default.createElement('tbody', { className: cssClassName,
	                     onClick: this.handleClick },
	                  eventSummaryRow,
	                  eventProblems(this.props.event.problems),
	                  detailsRow(this.state.showDetails, this.props.event.formattedEvent)));
	
	
	         } }]);return EventBody;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   EventListTable = function (_React$Component10) {_inherits(EventListTable, _React$Component10);
	      function EventListTable(props) {_classCallCheck(this, EventListTable);var _this11 = _possibleConstructorReturn(this, (EventListTable.__proto__ || Object.getPrototypeOf(EventListTable)).call(this,
	         props));
	         _this11.props = props;return _this11;
	      }_createClass(EventListTable, [{ key: 'render', value: function render()
	
	         {var _this12 = this;
	            var events = this.props.events.map(function (event) {
	               return (
	                  _react2.default.createElement(EventBody, { event: event,
	                     key: event.index,
	                     viewPatternsByName: view.patternsByName,
	                     selectionEventInfo: _this12.props.selectionEventInfo,
	                     onSelection: _this12.props.onSelection }));
	
	
	            });
	
	            /////////////////////////////////////////////////////////////////////////////////////////////////////
	
	            return (
	               _react2.default.createElement('table', { className: 'table' },
	                  _react2.default.createElement('colgroup', null,
	                     _react2.default.createElement('col', { className: 'ax-col-pattern-icon' }),
	                     _react2.default.createElement('col', { className: 'ax-col-interaction' }),
	                     _react2.default.createElement('col', { className: 'ax-col-payload-icon' }),
	                     _react2.default.createElement('col', { className: 'ax-col-name' }),
	                     _react2.default.createElement('col', { className: 'ax-col-source' }),
	                     _react2.default.createElement('col', { className: 'ax-col-target' }),
	                     _react2.default.createElement('col', { className: 'ax-col-cycle' }),
	                     _react2.default.createElement('col', { className: 'ax-col-timestamp' })),
	
	                  _react2.default.createElement('thead', null,
	                     _react2.default.createElement('tr', null,
	                        _react2.default.createElement('th', null, '\xA0'),
	                        _react2.default.createElement('th', null, 'Action'),
	                        _react2.default.createElement('th', null, '\xA0'),
	                        _react2.default.createElement('th', null, 'Event Name'),
	                        _react2.default.createElement('th', null, 'Source'),
	                        _react2.default.createElement('th', null, 'Target'),
	                        _react2.default.createElement('th', { className: 'text-right' }, 'Cycle'),
	                        _react2.default.createElement('th', { className: 'text-right' }, 'Time', _react2.default.createElement('i', { className: 'fa fa-long-arrow-up' })))),
	
	
	                  events));
	
	
	         } }]);return EventListTable;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   ProblemListTable = function (_React$Component11) {_inherits(ProblemListTable, _React$Component11);
	      function ProblemListTable(props) {_classCallCheck(this, ProblemListTable);var _this13 = _possibleConstructorReturn(this, (ProblemListTable.__proto__ || Object.getPrototypeOf(ProblemListTable)).call(this,
	         props));
	         _this13.props = props;return _this13;
	      }_createClass(ProblemListTable, [{ key: 'render', value: function render()
	
	         {
	            var eventList = this.props.problemSummary.eventInfos.map(function (event) {
	               var problemList = event.problems.map(function (problem) {
	                  return (
	                     _react2.default.createElement('li', { key: problem.description,
	                           className: 'ax-event-problem' },
	                        _react2.default.createElement('i', { className: 'fa fa-warning ax-error' }), problem.description));
	
	
	               });
	               return (
	                  _react2.default.createElement('li', { key: event.index },
	                     _react2.default.createElement('h5', null, _react2.default.createElement('strong', null, event.name), ' ', _react2.default.createElement('em', null, '(source: ', event.source, ')')),
	                     _react2.default.createElement('ul', null,
	                        problemList)));
	
	
	
	            });
	
	            return (
	               _react2.default.createElement('div', { className: 'text-large' },
	                  _react2.default.createElement('h4', { className: 'text-primary ax-error' }, this.props.problemSummary.eventInfos.length, '/', this.props.eventInfos.length, ' Events with Problems'),
	                  _react2.default.createElement('ul', null,
	                     eventList),
	
	                  _react2.default.createElement('p', { className: 'ax-event-problems-explanation' }, 'Events with problems are marked ',
	                     _react2.default.createElement('strong', { className: 'ax-error' }, 'red'), ' in the events table. Filter by event/source as needed.')));
	
	
	
	
	         } }]);return ProblemListTable;}(_react2.default.Component);
	
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	   var
	   EventDisplayElement = function (_React$Component12) {_inherits(EventDisplayElement, _React$Component12);
	      function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);var _this14 = _possibleConstructorReturn(this, (EventDisplayElement.__proto__ || Object.getPrototypeOf(EventDisplayElement)).call(this,
	         props));
	         _this14.props = props;return _this14;
	      }_createClass(EventDisplayElement, [{ key: 'render', value: function render()
	
	         {
	            if (this.props.visibleEventInfosLength === 0) {
	               return _react2.default.createElement('div', null);
	            }
	            return (
	               _react2.default.createElement(EventListTable, { selectionEventInfo: this.props.selectionEventInfo,
	                  onSelection: this.props.onSelection,
	                  events: this.props.events }));
	
	
	         } }]);return EventDisplayElement;}(_react2.default.Component);
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function render() {
	      reactRender(
	      _react2.default.createElement('div', null,
	         _react2.default.createElement(_AutoAffix2.default, null,
	            _react2.default.createElement('div', { className: 'ax-affix-area' },
	               _react2.default.createElement(NumberOfEvents, { numberOfVisibleEvents: model.visibleEventInfos.length,
	                  numberOfEvents: model.eventInfos.length,
	                  clearFilters: clearFilters }),
	
	               _react2.default.createElement('div', { className: 'ax-button-wrapper form-inline' },
	                  _react2.default.createElement(FiltersAndLimitForm, { name: settings.namePattern,
	                     filterBySearch: filterBySearch,
	                     limit: settings.visibleEventsLimit,
	                     limitEvents: limitEvents }),
	
	                  _react2.default.createElement(SelectFiltersButton, { patterns: model.patterns,
	                     settings: model.settings,
	                     onSettingsChanged: onSettingsChanged }),
	
	                  _react2.default.createElement(DiscardEventsButton, { eventInfosLength: model.eventInfos.length,
	                     onDiscard: discardEvents })))),
	
	
	
	
	         model.problemSummary.hasProblems &&
	         _react2.default.createElement(ProblemListTable, { problemSummary: model.problemSummary,
	            eventInfos: model.eventInfos }),
	
	         _react2.default.createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length,
	            events: model.visibleEventInfos,
	            onSelection: handleSelection,
	            selectionEventInfo: model.selectionEventInfo })));
	
	
	
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return {
	      onDomAvailable: render };
	
	}exports.default =
	
	{
	   name: 'events-display-widget',
	   injections: ['axContext', 'axReactRender', 'axFlowService'],
	   create: create };

/***/ },
/* 267 */,
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.visibility = exports.validation = exports.resources = exports.patches = exports.json = exports.i18n = exports.flags = exports.errors = exports.actions = undefined;
	
	
	
	
	var _actions = __webpack_require__(269);var actions = _interopRequireWildcard(_actions);
	var _errors = __webpack_require__(270);var errors = _interopRequireWildcard(_errors);
	var _flags = __webpack_require__(271);var flags = _interopRequireWildcard(_flags);
	var _i18n = __webpack_require__(272);var i18n = _interopRequireWildcard(_i18n);
	var _json = __webpack_require__(273);var json = _interopRequireWildcard(_json);
	var _patches = __webpack_require__(275);var patches = _interopRequireWildcard(_patches);
	var _resources = __webpack_require__(276);var resources = _interopRequireWildcard(_resources);
	var _validation = __webpack_require__(277);var validation = _interopRequireWildcard(_validation);
	var _visibility = __webpack_require__(278);var visibility = _interopRequireWildcard(_visibility);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}exports.
	
	
	actions = actions;exports.
	errors = errors;exports.
	flags = flags;exports.
	i18n = i18n;exports.
	json = json;exports.
	patches = patches;exports.
	resources = resources;exports.
	validation = validation;exports.
	visibility = visibility; /**
	                          * Copyright 2016 aixigo AG
	                          * Released under the MIT license.
	                          * http://laxarjs.org/license
	                          */

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.OUTCOME_SUCCESS = exports.OUTCOME_ERROR = exports.handlerFor = exports.connectPublisherToFeature = exports.publisherForFeature = exports.publisher = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */
	/**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * This module provides helpers for patterns regarding *takeActionRequest*, *willTakeAction* and
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * *didTakeAction* events.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @module actions
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */
	var _laxar = __webpack_require__(18);
	
	var DELIVER_TO_SENDER = { deliverToSender: false };
	
	var OUTCOME_SUCCESS = 'SUCCESS';
	var OUTCOME_ERROR = 'ERROR';
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a function to publish `takeActionRequest` events for a given action feature. The
	 * action to publish is expected to be at the key `action` under the given feature path.
	 *
	 * Apart from that this function works just like {@link publisher}.
	 *
	 * @param {Object} scope
	 *    the scope the publisher works on. Needs at least an EventBus instance as `eventBus` property
	 * @param {String} feature
	 *    the feature to take the action name from
	 * @param {Object} [optionalOptions]
	 *    options for the publisher
	 * @param {Boolean} optionalOptions.deliverToSender
	 *    the value is forward to `eventBus.publishAndGatherReplies`: if `true` the event will also be
	 *    delivered to the publisher. Default is `false`
	 * @param {Function} optionalOptions.onSuccess
	 *    a function that is called when the overall outcome yields "SUCCESS"
	 * @param {Function} optionalOptions.onError
	 *    a function that is called when the overall outcome yields "ERROR"
	 * @param {Function} optionalOptions.onComplete
	 *    a function that is called always, independently of the overall outcome
	 *
	 * @return {Function}
	 *    the publisher as described above
	 */
	function publisherForFeature(scope, feature, optionalOptions) {
	   var action = _laxar.object.path(scope.features, feature + '.action', null);
	   return publisher(scope, action, optionalOptions);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and return a function to publish `takeActionRequest` events for a given action. The outcomes of
	 * all given `didTakeAction` events are interpreted and optional callbacks according to the overall outcome
	 * are called. Interpretation is simple: If at least one `didTakeAction` event yields the outcome "ERROR",
	 * the overall outcome is also erroneous. In any other case the overall outcome will be successful.
	 *
	 * The promise returned by the publisher is resolved, if the overall outcome is successful and rejected if
	 * the outcome is erroneous. All callbacks, be it the `on*` handlers or the then handlers of the promise,
	 * will receive the list of events and meta information of all `didTakeAction` events
	 * (see `EventBus#publishAndGatherReplies()` for details).
	 *
	 * Example:
	 * ```js
	 * publisher = actions.publisher( scope, 'save', {
	 *    onSuccess: function() { closeApplication(); },
	 *    onError: function() { displayError(); }
	 * } );
	 *
	 * $button.on( 'click', publisher );
	 * ```
	 *
	 * @param {Object} scope
	 *    the scope the publisher works on. Needs at least an EventBus instance as `eventBus` property
	 * @param {String} action
	 *    the action to publish on call of the publisher
	 * @param {Object} [optionalOptions]
	 *    options for the publisher
	 * @param {Boolean} optionalOptions.deliverToSender
	 *    the value is forward to `eventBus.publishAndGatherReplies`: if `true` the event will also be
	 *    delivered to the publisher. Default is `false`
	 * @param {Function} optionalOptions.onSuccess
	 *    a function that is called when the overall outcome yields "SUCCESS"
	 * @param {Function} optionalOptions.onError
	 *    a function that is called when the overall outcome yields "ERROR"
	 * @param {Function} optionalOptions.onComplete
	 *    a function that is called always, independently of the overall outcome
	 *
	 * @return {Function}
	 *    the publisher as described above
	 */
	function publisher(scope, action, optionalOptions) {
	   (0, _laxar.assert)(scope).hasType(Object).hasProperty('eventBus');
	   (0, _laxar.assert)(action).hasType(String).isNotNull();
	
	   var options = _laxar.object.options(optionalOptions, {
	      deliverToSender: false,
	      onSuccess: function onSuccess() {},
	      onError: function onError() {},
	      onComplete: function onComplete() {} });
	
	
	   (0, _laxar.assert)(options.onSuccess).hasType(Function).isNotNull();
	   (0, _laxar.assert)(options.onError).hasType(Function).isNotNull();
	   (0, _laxar.assert)(options.onComplete).hasType(Function).isNotNull();
	
	   var eventBusOptions = {
	      deliverToSender: options.deliverToSender };
	
	   if (options.timeout > 0) {
	      eventBusOptions.pendingDidTimeout = options.timeout;
	   }
	
	   return function (optionalEvent) {
	      var event = _laxar.object.options(optionalEvent, { action: action });
	
	      return scope.eventBus.
	      publishAndGatherReplies('takeActionRequest.' + action, event, eventBusOptions).
	      then(function (didResponses) {
	         var failed = didResponses.some(function (response) {
	            return response.event.outcome === OUTCOME_ERROR;
	         });
	
	         options.onComplete(didResponses.slice(0));
	
	         if (failed) {
	            options.onError(didResponses.slice(0));
	            throw didResponses;
	         }
	
	         options.onSuccess(didResponses.slice(0));
	         return didResponses;
	      });
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates an action publisher for a given feature and makes it available as a scope/context property.
	 *
	 * The publisher is created under ``scope[ `actions.${feature}` ]``, where `scope` and `feature`
	 * are the arguments passed to this function. If an action topic has been configured for the given feature,
	 * the action publisher is created using `publisherForFeature`. Otherwise, it is a noop-function.
	 *
	 * @param {Object} scope
	 *    the scope/context to connect to. Needs at least an EventBus instance as `eventBus` property
	 * @param {String} feature
	 *    the feature to take the action name from
	 * @param {Object} [optionalOptions]
	 *    options for the publisher, as documented under `publisherForFeature`
	 */
	function connectPublisherToFeature(scope, feature, optionalOptions) {
	   var topic = _laxar.object.path(scope.features, feature);
	   var publisher = topic ? publisherForFeature(scope, feature, optionalOptions) : function () {};
	   _laxar.object.setPath(scope, 'actions.' + feature, publisher);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a new action handler instance for `takeActionRequest` events. It handles sending of an optional
	 * `willTakeAction` event and the final, possibly later asynchronously following `didTakeAction` event.
	 *
	 * @param {Object} scope
	 *    the scope the handler should work with. It is expected to find an `eventBus` property there with
	 *    which it can do the event handling
	 *
	 * @return {ActionHandler}
	 *    an action handler instance
	 */
	function handlerFor(scope) {
	   (0, _laxar.assert)(scope).hasType(Object).hasProperty('eventBus');
	
	   return new ActionHandler(scope);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/**
	 * @constructor
	 * @private
	 */
	function ActionHandler(scope) {
	   this.scope = scope;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers a handler for `takeActionRequest` events with actions from a feature. It is assumed that the
	 * given feature has an `onActions` property, which is a set of actions to listen to. The set may be empty,
	 * `null` or `undefined`, in which case the handler simply won't be attached to any event.
	 *
	 * Apart from that this function works just like {@link ActionHandler#registerActions}.
	 *
	 * Example:
	 * Consider the following configuration for a widget:
	 * ```json
	 * {
	 *    "features": {
	 *       "open": {
	 *          "onActions": [ "openAction1", "openAction2" ]
	 *       },
	 *       "save": {
	 *          "onActions": [ "save" ]
	 *       }
	 *    }
	 * }
	 * ```
	 * An example using that would be:
	 * ```js
	 * actions.handlerFor( scope )
	 *    .registerActionsFromFeature( 'open', function( event, meta ) {
	 *       somethingSynchronous();
	 *       return actions.OUTCOME_SUCCESS;
	 *    } )
	 *    .registerActionsFromFeature( 'save', function( event, meta ) {
	 *       return $q.when( somethingAsynchronous() );
	 *    } );
	 * ```
	 *
	 * @param {String} feature
	 *    the feature to read the actions to watch from
	 * @param {Function} handler
	 *    the handler to call whenever a `takeActionRequest` event with matching action is received
	 *
	 * @return {ActionHandler}
	 *    this instance for chaining
	 */
	ActionHandler.prototype.registerActionsFromFeature = function (feature, handler) {
	   var actions = _laxar.object.path(this.scope.features, feature + '.onActions') || [];
	   return this.registerActions(actions, handler);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers a handler for `takeActionRequest` events for a set of actions. The set may be empty, in
	 * which case the handler simply won't be attached to any event.
	 *
	 * The handler is assumed to be a function that receives the event and meta object of the underlying
	 * `takeActionRequest` event when called. In order to send the correct `didTakeAction` event as response,
	 * the return value of the handler is interpreted according to the following rules:
	 *
	 * - the handler throws an error
	 *   - the `didTakeAction` event is sent with outcome `ERROR`
	 *   - the error is re-thrown
	 * - the handler returns a simple value or a promise, that is later resolved with a value
	 *   - if the value is a plain object, it is used as basis for the event object and
	 *     - if the object has a property `outcome` with value `ERROR`, the `didTakeAction` event is sent with
	 *       outcome `ERROR`
	 *   - otherwise, or if the value is no plain object, the `didTakeAction` event is sent with outcome
	 *     `SUCCESS`
	 * - the handler returns a promise, that is later rejected with a value
	 *   - if the value is a plain object, it is used as basis for the event object and
	 *     - if the object has a property `outcome` with value `SUCCESS`, the `didTakeAction` event is sent with
	 *     outcome `SUCCESS`
	 *   - otherwise, or if the value is no plain object, the `didTakeAction` event is sent with outcome `ERROR`
	 *
	 * So basically simple return values or resolved promises are assumed to be successful if they don't state
	 * otherwise, while rejected promises are assumed to be erroneous, if they don't state otherwise.
	 *
	 * Example:
	 * ```js
	 * actions.handlerFor( scope )
	 *    .registerActions( [ 'open' ], function( event, meta ) {
	 *       return 42
	 *    } )
	 *    .registerActions( [ 'save' ], function( event, meta ) {
	 *       return $q.when( { resultValue: 42 } );
	 *    } );
	 * ```
	 *
	 * @param {String[]} actions
	 *    a set of actions to watch
	 * @param {Function} handler
	 *    the handler to call whenever a `takeActionRequest` event with matching action is received
	 *
	 * @return {ActionHandler}
	 *    this instance for chaining
	 */
	ActionHandler.prototype.registerActions = function (actions, handler) {
	   (0, _laxar.assert)(actions).hasType(Array).isNotNull();
	   (0, _laxar.assert)(handler).hasType(Function).isNotNull();
	
	   var self = this;
	   actions.forEach(function (action) {
	      self.scope.eventBus.subscribe('takeActionRequest.' + action, function (event, meta) {
	         callHandler(self.scope.eventBus, action, handler, event, meta);
	      });
	   });
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function callHandler(eventBus, action, handler, event, meta) {
	   eventBus.publish('willTakeAction.' + action, { action: action }, DELIVER_TO_SENDER);
	
	   var responseEvent = { action: action, outcome: OUTCOME_SUCCESS };
	
	   var returnValue = void 0;
	   try {
	      returnValue = handler(event, meta);
	   }
	   catch (error) {
	      responseEvent.outcome = OUTCOME_ERROR;
	
	      eventBus.publish('didTakeAction.' + action + '.' + OUTCOME_ERROR, responseEvent, DELIVER_TO_SENDER);
	      throw error;
	   }
	
	   Promise.resolve(returnValue).
	   then(function (promiseValue) {
	      if (isObject(promiseValue)) {
	         responseEvent.outcome =
	         promiseValue.outcome === OUTCOME_ERROR ? OUTCOME_ERROR : OUTCOME_SUCCESS;
	      }
	
	      return promiseValue;
	   }, function (promiseValue) {
	      responseEvent.outcome = OUTCOME_ERROR;
	      if (isObject(promiseValue)) {
	         responseEvent.outcome =
	         promiseValue.outcome === OUTCOME_SUCCESS ? OUTCOME_SUCCESS : OUTCOME_ERROR;
	      }
	
	      return promiseValue;
	   }).
	   then(function (promiseValue) {
	      responseEvent = _laxar.object.options(responseEvent, promiseValue);
	      var eventName = 'didTakeAction.' + action + '.' + responseEvent.outcome;
	      eventBus.publish(eventName, responseEvent, DELIVER_TO_SENDER);
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function isObject(value) {
	   return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	publisher = publisher;exports.
	publisherForFeature = publisherForFeature;exports.
	connectPublisherToFeature = connectPublisherToFeature;exports.
	handlerFor = handlerFor;exports.
	OUTCOME_ERROR = OUTCOME_ERROR;exports.
	OUTCOME_SUCCESS = OUTCOME_SUCCESS;

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.errorPublisherForFeature = undefined;
	
	
	
	
	
	
	
	
	
	var _laxar = __webpack_require__(18);
	
	
	/**
	                                * Creates and returns a function to publish didEncounterError events related to a specific feature.
	                                * Generated events will not be delivered to the sender.
	                                *
	                                * The returned publisher function takes these arguments:
	                                * - `code`: a generic code that identifies the failing operation (such as 'HTTP_PUT', 'HTTP_GET')
	                                * - `messagePath`: to lookup a human-readable message under this publisher's feature configuration
	                                * - `data`: additional information to be used for substituting in the message, It should contain the
	                                *   fields `resource` and `location` if applicable.
	                                * - `cause`: more diagnostic information on the error's cause, such as the underlying HTTP status code
	                                *
	                                * @param {Object} scope
	                                *    the scope the publisher works on
	                                * @param {String} featurePath
	                                *    the configuration path for (i18n) error-messages to publish
	                                * @param {Object} [options]
	                                *    an optional object with additional configuration
	                                * @param {Function} options.localizer
	                                *    a function such as `i18nHandler.localize` to prepare messages
	                                *
	                                * @return {Function}
	                                *    a publisher function with four arguments as described above
	                                */
	function errorPublisherForFeature(scope, featurePath, options) {
	  (0, _laxar.assert)(scope).hasType(Object).isNotNull();
	  (0, _laxar.assert)(scope.eventBus).hasType(Object).isNotNull();
	  (0, _laxar.assert)(options).hasType(Object);
	
	  var localizer = options && options.localizer;
	  (0, _laxar.assert)(localizer).hasType(Function);
	
	  var featureConfiguration = _laxar.object.path(scope.features, featurePath);
	  (0, _laxar.assert)(featureConfiguration).hasType(Object).isNotNull();
	
	  return function (code, messagePath) {var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var cause = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var rawMessage = _laxar.object.path(featureConfiguration, messagePath);
	    (0, _laxar.assert)(rawMessage).isNotNull();
	
	    var message = _laxar.string.format(localizer ? localizer(rawMessage) : rawMessage, [], data);
	    var event = { code: code, message: message, data: data, cause: cause };
	    scope.eventBus.publish('didEncounterError.' + code, event, { deliverToSender: false });
	  };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */ /**
	     * This module provides helpers for patterns regarding *didEncounterError* events.
	     *
	     * @module errors
	     */exports.errorPublisherForFeature = errorPublisherForFeature;

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.handlerFor = undefined;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;}; /**
	                                                                                                                                                                                                                                                                                                                                                                   * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                   * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                   * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                   */
	/**
	                                                                                                                                                                                                                                                                                                                                                                       * This module provides helpers for patterns regarding *didChangeFlag* events.
	                                                                                                                                                                                                                                                                                                                                                                       *
	                                                                                                                                                                                                                                                                                                                                                                       * @module flags
	                                                                                                                                                                                                                                                                                                                                                                       */
	var _laxar = __webpack_require__(18);
	
	/**
	                                * Creates a new handler instance for didChangeFlag events, on which one can attach a listener for
	                                * accumulated flag changes. Assume for example a feature like `disableOn`, which defines a set of flags,
	                                * where a `true` state of any of the flags disables the widget. The developer shouldn't care about single
	                                * flag states but should only be notified, if a change of one flag leads to a change of the accumulated
	                                * "any flag should be true" state.
	                                *
	                                * Additionally it is possible to let the handler set the current state of the accumulated flag on a given
	                                * scope property.
	                                *
	                                * @param {Object} scope
	                                *    the scope the handler should work with. It is expected to find an `eventBus` property there with
	                                *    which it can do the event handling
	                                *
	                                * @return {FlagHandler}
	                                *    a flag handler instance
	                                */
	function handlerFor(scope) {
	   return new FlagHandler(scope);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/**
	 *
	 * @param scope
	 *
	 * @constructor
	 * @private
	 */
	function FlagHandler(scope) {
	   this.scope = scope;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers a flag or a set of flags from the given feature. In contrast to the `ResourceHandler` here
	 * the complete attribute path to the flag(s) must be provided. This is due to the fact that there is no
	 * convention on names for flags on a feature, as there can coexist multiple flags for one feature, each
	 * influencing a different aspect of this feature.
	 *
	 * @param {String} featurePath
	 *    the attribute path to the configured flag(s) within the feature map
	 * @param {Object|Function} [optionalOptions]
	 *    options and callbacks to use. If a function is passed, it is used as the `onChange` option.
	 * @param {Boolean} optionalOptions.initialState
	 *    the optional initial state of the accumulated state. If not given each non-inverted flag is initially
	 *    assumed to be `false` and `true`, if it is inverted
	 * @param {Function|Function[]} optionalOptions.onChange
	 *    a function or a list of functions to call whenever the accumulated state of the flags changes. It
	 *    receives the new state as first argument and its previous state as second argument
	 * @param {String} optionalOptions.scopeKey
	 *    the key to set the current accumulated state on in the scope. If not given, nothing happens. For
	 *    example `flags.myFlag` would set `scope.flags.myFlag` to the currently valid accumulated state
	 * @param {String} optionalOptions.predicate
	 *    one of these:
	 *    - `any`: if any of the flag's states is `true`, the accumulated state is `true`. This is the default
	 *    - `all`: if all of the flag's states are `true`, the accumulated state is `true`
	 *
	 * @return {FlagHandler}
	 *    this instance for chaining
	 */
	FlagHandler.prototype.registerFlagFromFeature = function (featurePath, optionalOptions) {
	   return this.registerFlag(_laxar.object.path(this.scope.features, featurePath, []), optionalOptions);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers a flag or a set of flags given as argument. Even `undefined`, `null` or an empty array
	 * are handled gracefully and treated as an empty set of flags, thus never changing their states.
	 *
	 * The new accumulated state is set on `scope.flags` if that is defined. Otherwise it is set on
	 * `scope.model`.
	 *
	 * @param {String|String[]} possibleFlags
	 *    one or a list of flags to watch
	 * @param {Object|Function} [optionalOptions]
	 *    options and callbacks to use. If a function is passed, it is used as the `onChange` option.
	 * @param {Boolean} optionalOptions.initialState
	 *    the optional initial state of the accumulated state. If not given each non-inverted flag is initially
	 *    assumed to be `false` and `true`, if it is inverted
	 * @param {Function|Function[]} optionalOptions.onChange
	 *    a function or a list of functions to call whenever the accumuated state of the flags changes. It
	 *    receives the new state as first argument and its previous state as second argument
	 * @param {String} optionalOptions.scopeKey
	 *    the key to set the current accumulated state on in the scope. If not given, nothing happens. For
	 *    example `flags.myFlag` would set `scope.flags.myFlag` to the currently valid accumulated state
	 * @param {String} optionalOptions.predicate
	 *    one of these:
	 *    - `any`: if any of the flag's sates is `true`, the accumulated state is `true`. This is the default
	 *    - `all`: if all of the flag's states are `true`, the accumulated state is `true`
	 *
	 * @return {FlagHandler}
	 *    this instance for chaining
	 */
	FlagHandler.prototype.registerFlag = function (possibleFlags, optionalOptions) {var _this = this;
	
	   var options = _extends({
	      predicate: 'any' },
	   typeof optionalOptions === 'function' ? { onChange: optionalOptions } : optionalOptions);
	
	
	   var scope = this.scope;
	   var applyToScope = 'scopeKey' in options ?
	   function (state) {_laxar.object.setPath(scope, options.scopeKey, state);} :
	   function () {};
	
	   var flags = processFlags(possibleFlags);
	   var changeHandler = processChangeHandlers(options.onChange);
	   var oldState = typeof options.initialState === 'boolean' ?
	   options.initialState : evaluateState(flags, options.predicate);
	
	   applyToScope(oldState);
	
	   flags.forEach(function (flag) {
	      _this.scope.eventBus.subscribe('didChangeFlag.' + flag.name, function (event) {
	         flag.state = flag.negated ? !event.state : event.state;
	
	         var newState = evaluateState(flags, options.predicate);
	         if (newState !== oldState) {
	            applyToScope(newState);
	            changeHandler(newState, oldState);
	            oldState = newState;
	         }
	      });
	   });
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processFlags(flags) {
	   if (!flags) {
	      return [];
	   }
	
	   var flagArr = Array.isArray(flags) ? flags : [flags];
	   return flagArr.map(function (flagExpression) {
	      var negated = flagExpression.indexOf('!') === 0;
	      return {
	         name: negated ? flagExpression.substr(1) : flagExpression,
	         negated: negated,
	         state: negated // always the state after applying a possible negation
	      };
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processChangeHandlers(handlers) {
	   if (!handlers) {
	      return function () {};
	   }
	
	   var handlerArr = Array.isArray(handlers) ? handlers : [handlers];
	   return function (newValue, oldValue) {
	      handlerArr.forEach(function (handler) {
	         handler(newValue, oldValue);
	      });
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var evaluators = {
	   any: function any(previousValue, flag) {return previousValue === null ? flag.state : flag.state || previousValue;},
	   all: function all(previousValue, flag) {return previousValue === null ? flag.state : flag.state && previousValue;} };
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function evaluateState(flags, predicate) {
	   var state = flags.reduce(evaluators[predicate], null);
	   return state === null ? false : state;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	handlerFor = handlerFor;

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.handlerFor = undefined;
	
	
	
	
	
	
	
	
	
	var _laxar = __webpack_require__(18);
	
	/**
	                                * Obtain a handler which applies didChangeLocale-events to the given scope.
	                                *
	                                * @param {Object} scope
	                                *    the scope instance for which i18n-state should be managed
	                                * @param {Object} i18n
	                                *    a laxarjs i18n service instance
	                                * @param {String} [optionalI18nPath]
	                                *    an optional path within the scope (default: `'i18n'`) where to store i18n-state
	                                *
	                                * @return {I18nHandler}
	                                *    a handler which manages the i18n-object on the scope, and which allows to register for locale
	                                *    changes, by topic or by feature
	                                */
	function handlerFor(scope, i18n, optionalI18nPath) {
	   var i18nPath = optionalI18nPath || 'i18n';
	   prepareScopeI18n();
	
	   var callbacksByLocale = {};
	
	   function handleLocaleChangeEvent(event) {
	      var locale = event.locale;
	      var tags = _laxar.object.path(scope, i18nPath).tags;
	      var previousTag = tags[locale];
	      if (previousTag !== event.languageTag) {
	         tags[locale] = event.languageTag;
	         callbacksByLocale[locale].forEach(function (cb) {return cb(event, previousTag);});
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    *
	    * @name I18nHandler
	    * @constructor
	    * @private
	    */
	   var handler = {
	
	      /**
	                    * Manage changes to the given locale(s).
	                    *
	                    * @param {String|String[]} possibleLocales
	                    *    zero, one or more locale topics to manage
	                    * @param {Object} [optionalOptions]
	                    *    an optional configuration object
	                    * @param {Function|Function[]} optionalOptions.onChange
	                    *    a function or a list of functions to call whenever one of the locales changes
	                    *    It receives the event which triggered the change as the first argument, and the previous
	                    *    language-tag as the second argument
	                    *
	                    * @return {Object}
	                    *    this instance for chaining
	                    *
	                    * @memberOf I18nHandler
	                    */
	      registerLocale: function registerLocale(possibleLocales, optionalOptions) {
	         var locales = possibleLocales;
	         if (!Array.isArray(possibleLocales)) {
	            locales = possibleLocales ? [possibleLocales] : [];
	         }
	         locales.forEach(function (locale) {
	            if (!callbacksByLocale[locale]) {
	               callbacksByLocale[locale] = [];
	               scope.eventBus.subscribe('didChangeLocale.' + locale, handleLocaleChangeEvent);
	            }
	            var onChange = (optionalOptions || {}).onChange;
	            if (onChange) {
	               callbacksByLocale[locale] = callbacksByLocale[locale].concat(
	               Array.isArray(onChange) ? onChange : [onChange]);
	
	            }
	         });
	         return handler;
	      },
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Look for the given feature path within the feature configuration and register for changes to the
	       * corresponding locale. If there is a key 'locale' at the given feature, that entry is used.
	       * Otherwise, the entire configuration path has to be specified.
	       *
	       * @param {String} featurePath  A feature path for the current scope.
	       * @param {Object} [optionalOptions]  An optional configuration object.
	       *
	       * @return {Object}
	       *    this instance for chaining
	       *
	       * @memberOf I18nHandler
	       */
	      registerLocaleFromFeature: function registerLocaleFromFeature(featurePath, optionalOptions) {
	         var entry = _laxar.object.path(scope.features, featurePath);
	         return handler.registerLocale(entry.locale || entry, optionalOptions || {});
	      },
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      scopeLocaleFromFeature: function scopeLocaleFromFeature(featurePath, options) {
	         var entry = _laxar.object.path(scope.features, featurePath);
	         _laxar.object.path(scope, i18nPath).locale = entry.locale || entry;
	         return handler.registerLocale(_laxar.object.path(scope, i18nPath).locale, options || {});
	      },
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      localizer: function localizer(fallback) {
	         var model = _laxar.object.path(scope, i18nPath);
	         function partial(i18nValue) {
	            if (typeof i18nValue === 'string') {return i18nValue;}
	            var tag = model.tags[model.locale];
	            return tag ? i18n.localizer(tag, fallback)(i18nValue) : fallback;
	         }
	         partial.format = function () {var _i18n$localizer;return (
	               (_i18n$localizer = i18n.localizer(model.tags[model.locale])).format.apply(_i18n$localizer, arguments));};
	         return partial;
	      } };
	
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function prepareScopeI18n() {
	      var result = _laxar.object.path(scope, i18nPath);
	      if (!result) {
	         result = {};
	         _laxar.object.setPath(scope, i18nPath, result);
	      }
	      if (!result.tags) {
	         result.tags = {};
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return handler;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */ /**
	     * This module provides helpers for patterns regarding *didChangeLocale* events.
	     *
	     * @module i18n
	     */exports.handlerFor = handlerFor;

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.createPatch = exports.applyPatch = exports.pathToPointer = exports.pointerToPath = exports.setPointer = exports.getPointer = undefined;
	
	
	
	
	
	
	
	
	
	
	var _fastJsonPatch = __webpack_require__(274);var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);
	var _laxar = __webpack_require__(18);var ax = _interopRequireWildcard(_laxar);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
	
	/**
	                                                                                                                                                                                                                                                                                                                                                                                                                                      * Lookup a nested object using an rfc-6901 JSON pointer.
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param {Object|Array=} object
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *    the object in which to lookup an entry
	                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param {String} pointer
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *    a valid JSON pointer conforming to rfc-6901
	                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param {*} fallback
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *    a value to return if the JSON pointer does not point to any value within the object
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                      * @return {*}
	                                                                                                                                                                                                                                                                                                                                                                                                                                      *    the value found at the JSON pointer, or the fallback value
	                                                                                                                                                                                                                                                                                                                                                                                                                                      */ /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                          * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                          * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                          */ /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                              * This module provides helpers for dealing with patches for JSON structures, specifically regarding
	                                                                                                                                                                                                                                                                                                                                                                                                                                              * [RFC 6901](https://tools.ietf.org/html/rfc6901) and [RFC 6902](https://tools.ietf.org/html/rfc6902).
	                                                                                                                                                                                                                                                                                                                                                                                                                                              *
	                                                                                                                                                                                                                                                                                                                                                                                                                                              * @module json
	                                                                                                                                                                                                                                                                                                                                                                                                                                              */function getPointer(object, pointer, fallback) {var keys = pointer.split('/');var len = keys.length;var usesEscapes = pointer.indexOf('~') !== -1;var subTree = object;for (var i = 1; i < len; ++i) {if (object === undefined) {return fallback;
	      }
	
	      if (Array.isArray(object)) {
	         var index = parseInt(keys[i], 10);
	         subTree = subTree[index];
	      } else
	      {
	         var key = keys[i];
	         if (usesEscapes) {
	            // unescape masked chars ('/', '~'):
	            key = key.replace(/~1/g, '/').replace(/~0/g, '~');
	         }
	         subTree = subTree[key];
	      }
	   }
	   return subTree === undefined ? fallback : subTree;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Set a nested item within a structure using an rfc-6901 JSON pointer. Missing containers along the path
	 * will be created (using laxar.object.setPath). The object is modified in-place.
	 *
	 * JSON pointer segments of the type '/-' (for appending to an array) are not supported. You can use a
	 * single JSON patch 'add' operation to achieve the desired effect.
	 *
	 * @param {Object|Array} object
	 *    the object in which to lookup an entry
	 * @param {String} pointer
	 *    a valid JSON pointer conforming to rfc-6901
	 * @param {*} value
	 *    the value to set at the place indicated by the pointer
	 *
	 * @return {Object|Array}
	 *    the modified object (for chaining)
	 */
	function setPointer(object, pointer, value) {
	   var path = pointerToPath(pointer);
	   return ax.object.setPath(object, path, value);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Transform an rfc-6901 JSON pointer into a laxar object path.
	 *
	 * @param {String} pointer
	 *    a valid JSON pointer conforming to rfc-6901
	 *
	 * @return {String}
	 *    a path that can be used with laxar.object.path
	 */
	function pointerToPath(pointer) {
	   var keys = pointer.split('/').slice(1);
	   if (pointer.indexOf('~') !== -1) {
	      var len = keys.length;
	      for (var i = 0; i < len; ++i) {
	         keys[i] = keys[i].replace(/~1/g, '/').replace(/~0/g, '~');
	      }
	   }
	   return keys.join('.');
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Transform a laxar object path into an rfc-6901 JSON pointer.
	 *
	 * @param {String} path
	 *    a LaxarJS object path where segments are separated using '.'
	 *
	 * @return {String}
	 *    a valid JSON pointer conforming to rfc-6901
	 */
	function pathToPointer(path) {
	   if (path === '') {
	      return '';
	   }
	   var keys = path.split('.');
	   if (path.indexOf('/') !== -1 || path.indexOf('~') !== -1) {
	      var len = keys.length;
	      for (var i = 0; i < len; ++i) {
	         keys[i] = keys[i].replace(/~/g, '~0').replace(/\//g, '~1');
	      }
	   }
	   var relativePointer = keys.join('/');
	   return '/' + relativePointer;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Calls fast-json-patch to apply the given rfc-6902 JSON patch sequence in-place. If the patch sequence
	 * fails to apply, the behavior is undefined.
	 *
	 * @param {Object|Array} object
	 *    the object to patch (in-place)
	 * @param {Array} patches
	 *    a sequence of patches as defined by rfc-6902
	 */
	function applyPatch(object, patches) {
	   _fastJsonPatch2.default.apply(object, patches);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Calls fast-json-patch to create a rfc-6902 conform JSON patch sequence.
	 *
	 * @param {Object|Array} fromState
	 *    the state on which to base the list of patches
	 * @param {Object|Array} toState
	 *    the target state: the desired result of applying the newly created patches to the `fromState`
	 *
	 * @return {Array}
	 *    a sequence of patches as defined by rfc-6902
	 */
	function createPatch(fromState, toState) {
	   return _fastJsonPatch2.default.compare(fromState, toState);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	
	getPointer = getPointer;exports.
	setPointer = setPointer;exports.
	pointerToPath = pointerToPath;exports.
	pathToPointer = pathToPointer;exports.
	
	applyPatch = applyPatch;exports.
	createPatch = createPatch;

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * https://github.com/Starcounter-Jack/JSON-Patch
	 * json-patch-duplex.js version: 1.1.4
	 * (c) 2013 Joachim Wester
	 * MIT license
	 */
	var jsonpatch;
	(function (jsonpatch) {
	    var _objectKeys = function (obj) {
	        if (_isArray(obj)) {
	            var keys = new Array(obj.length);
	            for (var k = 0; k < keys.length; k++) {
	                keys[k] = "" + k;
	            }
	            return keys;
	        }
	        if (Object.keys) {
	            return Object.keys(obj);
	        }
	        var keys = [];
	        for (var i in obj) {
	            if (obj.hasOwnProperty(i)) {
	                keys.push(i);
	            }
	        }
	        return keys;
	    };
	    function _equals(a, b) {
	        switch (typeof a) {
	            case 'undefined': //backward compatibility, but really I think we should return false
	            case 'boolean':
	            case 'string':
	            case 'number':
	                return a === b;
	            case 'object':
	                if (a === null)
	                    return b === null;
	                if (_isArray(a)) {
	                    if (!_isArray(b) || a.length !== b.length)
	                        return false;
	                    for (var i = 0, l = a.length; i < l; i++)
	                        if (!_equals(a[i], b[i]))
	                            return false;
	                    return true;
	                }
	                var bKeys = _objectKeys(b);
	                var bLength = bKeys.length;
	                if (_objectKeys(a).length !== bLength)
	                    return false;
	                for (var i = 0; i < bLength; i++)
	                    if (!_equals(a[i], b[i]))
	                        return false;
	                return true;
	            default:
	                return false;
	        }
	    }
	    /* We use a Javascript hash to store each
	     function. Each hash entry (property) uses
	     the operation identifiers specified in rfc6902.
	     In this way, we can map each patch operation
	     to its dedicated function in efficient way.
	     */
	    /* The operations applicable to an object */
	    var objOps = {
	        add: function (obj, key) {
	            obj[key] = this.value;
	        },
	        remove: function (obj, key) {
	            var removed = obj[key];
	            delete obj[key];
	            return removed;
	        },
	        replace: function (obj, key) {
	            var removed = obj[key];
	            obj[key] = this.value;
	            return removed;
	        },
	        move: function (obj, key, tree) {
	            var getOriginalDestination = { op: "_get", path: this.path };
	            apply(tree, [getOriginalDestination]);
	            // In case value is moved up and overwrites its ancestor
	            var original = getOriginalDestination.value === undefined ?
	                undefined : JSON.parse(JSON.stringify(getOriginalDestination.value));
	            var temp = { op: "_get", path: this.from };
	            apply(tree, [temp]);
	            apply(tree, [
	                { op: "remove", path: this.from }
	            ]);
	            apply(tree, [
	                { op: "add", path: this.path, value: temp.value }
	            ]);
	            return original;
	        },
	        copy: function (obj, key, tree) {
	            var temp = { op: "_get", path: this.from };
	            apply(tree, [temp]);
	            apply(tree, [
	                { op: "add", path: this.path, value: temp.value }
	            ]);
	        },
	        test: function (obj, key) {
	            return _equals(obj[key], this.value);
	        },
	        _get: function (obj, key) {
	            this.value = obj[key];
	        }
	    };
	    /* The operations applicable to an array. Many are the same as for the object */
	    var arrOps = {
	        add: function (arr, i) {
	            arr.splice(i, 0, this.value);
	            // this may be needed when using '-' in an array
	            return i;
	        },
	        remove: function (arr, i) {
	            var removedList = arr.splice(i, 1);
	            return removedList[0];
	        },
	        replace: function (arr, i) {
	            var removed = arr[i];
	            arr[i] = this.value;
	            return removed;
	        },
	        move: objOps.move,
	        copy: objOps.copy,
	        test: objOps.test,
	        _get: objOps._get
	    };
	    /* The operations applicable to object root. Many are the same as for the object */
	    var rootOps = {
	        add: function (obj) {
	            rootOps.remove.call(this, obj);
	            for (var key in this.value) {
	                if (this.value.hasOwnProperty(key)) {
	                    obj[key] = this.value[key];
	                }
	            }
	        },
	        remove: function (obj) {
	            var removed = {};
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    removed[key] = obj[key];
	                    objOps.remove.call(this, obj, key);
	                }
	            }
	            return removed;
	        },
	        replace: function (obj) {
	            var removed = apply(obj, [
	                { op: "remove", path: this.path }
	            ]);
	            apply(obj, [
	                { op: "add", path: this.path, value: this.value }
	            ]);
	            return removed[0];
	        },
	        move: objOps.move,
	        copy: objOps.copy,
	        test: function (obj) {
	            return (JSON.stringify(obj) === JSON.stringify(this.value));
	        },
	        _get: function (obj) {
	            this.value = obj;
	        }
	    };
	    function escapePathComponent(str) {
	        if (str.indexOf('/') === -1 && str.indexOf('~') === -1)
	            return str;
	        return str.replace(/~/g, '~0').replace(/\//g, '~1');
	    }
	    function _getPathRecursive(root, obj) {
	        var found;
	        for (var key in root) {
	            if (root.hasOwnProperty(key)) {
	                if (root[key] === obj) {
	                    return escapePathComponent(key) + '/';
	                }
	                else if (typeof root[key] === 'object') {
	                    found = _getPathRecursive(root[key], obj);
	                    if (found != '') {
	                        return escapePathComponent(key) + '/' + found;
	                    }
	                }
	            }
	        }
	        return '';
	    }
	    function getPath(root, obj) {
	        if (root === obj) {
	            return '/';
	        }
	        var path = _getPathRecursive(root, obj);
	        if (path === '') {
	            throw new Error("Object not found in root");
	        }
	        return '/' + path;
	    }
	    var beforeDict = [];
	    var Mirror = (function () {
	        function Mirror(obj) {
	            this.observers = [];
	            this.obj = obj;
	        }
	        return Mirror;
	    }());
	    var ObserverInfo = (function () {
	        function ObserverInfo(callback, observer) {
	            this.callback = callback;
	            this.observer = observer;
	        }
	        return ObserverInfo;
	    }());
	    function getMirror(obj) {
	        for (var i = 0, ilen = beforeDict.length; i < ilen; i++) {
	            if (beforeDict[i].obj === obj) {
	                return beforeDict[i];
	            }
	        }
	    }
	    function getObserverFromMirror(mirror, callback) {
	        for (var j = 0, jlen = mirror.observers.length; j < jlen; j++) {
	            if (mirror.observers[j].callback === callback) {
	                return mirror.observers[j].observer;
	            }
	        }
	    }
	    function removeObserverFromMirror(mirror, observer) {
	        for (var j = 0, jlen = mirror.observers.length; j < jlen; j++) {
	            if (mirror.observers[j].observer === observer) {
	                mirror.observers.splice(j, 1);
	                return;
	            }
	        }
	    }
	    function unobserve(root, observer) {
	        observer.unobserve();
	    }
	    jsonpatch.unobserve = unobserve;
	    function deepClone(obj) {
	        switch (typeof obj) {
	            case "object":
	                return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
	            case "undefined":
	                return null; //this is how JSON.stringify behaves for array items
	            default:
	                return obj; //no need to clone primitives
	        }
	    }
	    function observe(obj, callback) {
	        var patches = [];
	        var root = obj;
	        var observer;
	        var mirror = getMirror(obj);
	        if (!mirror) {
	            mirror = new Mirror(obj);
	            beforeDict.push(mirror);
	        }
	        else {
	            observer = getObserverFromMirror(mirror, callback);
	        }
	        if (observer) {
	            return observer;
	        }
	        observer = {};
	        mirror.value = deepClone(obj);
	        if (callback) {
	            observer.callback = callback;
	            observer.next = null;
	            var dirtyCheck = function () {
	                generate(observer);
	            };
	            var fastCheck = function () {
	                clearTimeout(observer.next);
	                observer.next = setTimeout(dirtyCheck);
	            };
	            if (typeof window !== 'undefined') {
	                if (window.addEventListener) {
	                    window.addEventListener('mouseup', fastCheck);
	                    window.addEventListener('keyup', fastCheck);
	                    window.addEventListener('mousedown', fastCheck);
	                    window.addEventListener('keydown', fastCheck);
	                    window.addEventListener('change', fastCheck);
	                }
	                else {
	                    document.documentElement.attachEvent('onmouseup', fastCheck);
	                    document.documentElement.attachEvent('onkeyup', fastCheck);
	                    document.documentElement.attachEvent('onmousedown', fastCheck);
	                    document.documentElement.attachEvent('onkeydown', fastCheck);
	                    document.documentElement.attachEvent('onchange', fastCheck);
	                }
	            }
	        }
	        observer.patches = patches;
	        observer.object = obj;
	        observer.unobserve = function () {
	            generate(observer);
	            clearTimeout(observer.next);
	            removeObserverFromMirror(mirror, observer);
	            if (typeof window !== 'undefined') {
	                if (window.removeEventListener) {
	                    window.removeEventListener('mouseup', fastCheck);
	                    window.removeEventListener('keyup', fastCheck);
	                    window.removeEventListener('mousedown', fastCheck);
	                    window.removeEventListener('keydown', fastCheck);
	                }
	                else {
	                    document.documentElement.detachEvent('onmouseup', fastCheck);
	                    document.documentElement.detachEvent('onkeyup', fastCheck);
	                    document.documentElement.detachEvent('onmousedown', fastCheck);
	                    document.documentElement.detachEvent('onkeydown', fastCheck);
	                }
	            }
	        };
	        mirror.observers.push(new ObserverInfo(callback, observer));
	        return observer;
	    }
	    jsonpatch.observe = observe;
	    function generate(observer) {
	        var mirror;
	        for (var i = 0, ilen = beforeDict.length; i < ilen; i++) {
	            if (beforeDict[i].obj === observer.object) {
	                mirror = beforeDict[i];
	                break;
	            }
	        }
	        _generate(mirror.value, observer.object, observer.patches, "");
	        if (observer.patches.length) {
	            apply(mirror.value, observer.patches);
	        }
	        var temp = observer.patches;
	        if (temp.length > 0) {
	            observer.patches = [];
	            if (observer.callback) {
	                observer.callback(temp);
	            }
	        }
	        return temp;
	    }
	    jsonpatch.generate = generate;
	    // Dirty check if obj is different from mirror, generate patches and update mirror
	    function _generate(mirror, obj, patches, path) {
	        var newKeys = _objectKeys(obj);
	        var oldKeys = _objectKeys(mirror);
	        var changed = false;
	        var deleted = false;
	        //if ever "move" operation is implemented here, make sure this test runs OK: "should not generate the same patch twice (move)"
	        for (var t = oldKeys.length - 1; t >= 0; t--) {
	            var key = oldKeys[t];
	            var oldVal = mirror[key];
	            if (obj.hasOwnProperty(key) && !(obj[key] === undefined && oldVal !== undefined && _isArray(obj) === false)) {
	                var newVal = obj[key];
	                if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
	                    _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key));
	                }
	                else {
	                    if (oldVal !== newVal) {
	                        changed = true;
	                        patches.push({ op: "replace", path: path + "/" + escapePathComponent(key), value: deepClone(newVal) });
	                    }
	                }
	            }
	            else {
	                patches.push({ op: "remove", path: path + "/" + escapePathComponent(key) });
	                deleted = true; // property has been deleted
	            }
	        }
	        if (!deleted && newKeys.length == oldKeys.length) {
	            return;
	        }
	        for (var t = 0; t < newKeys.length; t++) {
	            var key = newKeys[t];
	            if (!mirror.hasOwnProperty(key) && obj[key] !== undefined) {
	                patches.push({ op: "add", path: path + "/" + escapePathComponent(key), value: deepClone(obj[key]) });
	            }
	        }
	    }
	    var _isArray;
	    if (Array.isArray) {
	        _isArray = Array.isArray;
	    }
	    else {
	        _isArray = function (obj) {
	            return obj.push && typeof obj.length === 'number';
	        };
	    }
	    //3x faster than cached /^\d+$/.test(str)
	    function isInteger(str) {
	        var i = 0;
	        var len = str.length;
	        var charCode;
	        while (i < len) {
	            charCode = str.charCodeAt(i);
	            if (charCode >= 48 && charCode <= 57) {
	                i++;
	                continue;
	            }
	            return false;
	        }
	        return true;
	    }
	    /**
	     * Apply a json-patch operation on an object tree
	     * Returns an array of results of operations.
	     * Each element can either be a boolean (if op == 'test') or
	     * the removed object (operations that remove things)
	     * or just be undefined
	     */
	    function apply(tree, patches, validate) {
	        var results = [], p = 0, plen = patches.length, patch, key;
	        while (p < plen) {
	            patch = patches[p];
	            p++;
	            // Find the object
	            var path = patch.path || "";
	            var keys = path.split('/');
	            var obj = tree;
	            var t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift
	            var len = keys.length;
	            var existingPathFragment = undefined;
	            while (true) {
	                key = keys[t];
	                if (validate) {
	                    if (existingPathFragment === undefined) {
	                        if (obj[key] === undefined) {
	                            existingPathFragment = keys.slice(0, t).join('/');
	                        }
	                        else if (t == len - 1) {
	                            existingPathFragment = patch.path;
	                        }
	                        if (existingPathFragment !== undefined) {
	                            this.validator(patch, p - 1, tree, existingPathFragment);
	                        }
	                    }
	                }
	                t++;
	                if (key === undefined) {
	                    if (t >= len) {
	                        results.push(rootOps[patch.op].call(patch, obj, key, tree)); // Apply patch
	                        break;
	                    }
	                }
	                if (_isArray(obj)) {
	                    if (key === '-') {
	                        key = obj.length;
	                    }
	                    else {
	                        if (validate && !isInteger(key)) {
	                            throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", p - 1, patch.path, patch);
	                        }
	                        key = parseInt(key, 10);
	                    }
	                    if (t >= len) {
	                        if (validate && patch.op === "add" && key > obj.length) {
	                            throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", p - 1, patch.path, patch);
	                        }
	                        results.push(arrOps[patch.op].call(patch, obj, key, tree)); // Apply patch
	                        break;
	                    }
	                }
	                else {
	                    if (key && key.indexOf('~') != -1)
	                        key = key.replace(/~1/g, '/').replace(/~0/g, '~'); // escape chars
	                    if (t >= len) {
	                        results.push(objOps[patch.op].call(patch, obj, key, tree)); // Apply patch
	                        break;
	                    }
	                }
	                obj = obj[key];
	            }
	        }
	        return results;
	    }
	    jsonpatch.apply = apply;
	    function compare(tree1, tree2) {
	        var patches = [];
	        _generate(tree1, tree2, patches, '');
	        return patches;
	    }
	    jsonpatch.compare = compare;
	    // provide scoped __extends for TypeScript's `extend` keyword so it will not provide global one during compilation
	    function __extends(d, b) {
	        for (var p in b)
	            if (b.hasOwnProperty(p))
	                d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    }
	    var JsonPatchError = (function (_super) {
	        __extends(JsonPatchError, _super);
	        function JsonPatchError(message, name, index, operation, tree) {
	            _super.call(this, message);
	            this.message = message;
	            this.name = name;
	            this.index = index;
	            this.operation = operation;
	            this.tree = tree;
	        }
	        return JsonPatchError;
	    }(Error));
	    jsonpatch.JsonPatchError = JsonPatchError;
	    /**
	     * Recursively checks whether an object has any undefined values inside.
	     */
	    function hasUndefined(obj) {
	        if (obj === undefined) {
	            return true;
	        }
	        if (typeof obj == "array" || typeof obj == "object") {
	            for (var i in obj) {
	                if (hasUndefined(obj[i])) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    /**
	     * Validates a single operation. Called from `jsonpatch.validate`. Throws `JsonPatchError` in case of an error.
	     * @param {object} operation - operation object (patch)
	     * @param {number} index - index of operation in the sequence
	     * @param {object} [tree] - object where the operation is supposed to be applied
	     * @param {string} [existingPathFragment] - comes along with `tree`
	     */
	    function validator(operation, index, tree, existingPathFragment) {
	        if (typeof operation !== 'object' || operation === null || _isArray(operation)) {
	            throw new JsonPatchError('Operation is not an object', 'OPERATION_NOT_AN_OBJECT', index, operation, tree);
	        }
	        else if (!objOps[operation.op]) {
	            throw new JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', index, operation, tree);
	        }
	        else if (typeof operation.path !== 'string') {
	            throw new JsonPatchError('Operation `path` property is not a string', 'OPERATION_PATH_INVALID', index, operation, tree);
	        }
	        else if (operation.path.indexOf('/') !== 0 && operation.path.length > 0) {
	            // paths that aren't emptystring should start with "/"
	            throw new JsonPatchError('Operation `path` property must start with "/"', 'OPERATION_PATH_INVALID', index, operation, tree);
	        }
	        else if ((operation.op === 'move' || operation.op === 'copy') && typeof operation.from !== 'string') {
	            throw new JsonPatchError('Operation `from` property is not present (applicable in `move` and `copy` operations)', 'OPERATION_FROM_REQUIRED', index, operation, tree);
	        }
	        else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && operation.value === undefined) {
	            throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_REQUIRED', index, operation, tree);
	        }
	        else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && hasUndefined(operation.value)) {
	            throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED', index, operation, tree);
	        }
	        else if (tree) {
	            if (operation.op == "add") {
	                var pathLen = operation.path.split("/").length;
	                var existingPathLen = existingPathFragment.split("/").length;
	                if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
	                    throw new JsonPatchError('Cannot perform an `add` operation at the desired path', 'OPERATION_PATH_CANNOT_ADD', index, operation, tree);
	                }
	            }
	            else if (operation.op === 'replace' || operation.op === 'remove' || operation.op === '_get') {
	                if (operation.path !== existingPathFragment) {
	                    throw new JsonPatchError('Cannot perform the operation at a path that does not exist', 'OPERATION_PATH_UNRESOLVABLE', index, operation, tree);
	                }
	            }
	            else if (operation.op === 'move' || operation.op === 'copy') {
	                var existingValue = { op: "_get", path: operation.from, value: undefined };
	                var error = jsonpatch.validate([existingValue], tree);
	                if (error && error.name === 'OPERATION_PATH_UNRESOLVABLE') {
	                    throw new JsonPatchError('Cannot perform the operation from a path that does not exist', 'OPERATION_FROM_UNRESOLVABLE', index, operation, tree);
	                }
	            }
	        }
	    }
	    jsonpatch.validator = validator;
	    /**
	     * Validates a sequence of operations. If `tree` parameter is provided, the sequence is additionally validated against the object tree.
	     * If error is encountered, returns a JsonPatchError object
	     * @param sequence
	     * @param tree
	     * @returns {JsonPatchError|undefined}
	     */
	    function validate(sequence, tree) {
	        try {
	            if (!_isArray(sequence)) {
	                throw new JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
	            }
	            if (tree) {
	                tree = JSON.parse(JSON.stringify(tree)); //clone tree so that we can safely try applying operations
	                apply.call(this, tree, sequence, true);
	            }
	            else {
	                for (var i = 0; i < sequence.length; i++) {
	                    this.validator(sequence[i], i);
	                }
	            }
	        }
	        catch (e) {
	            if (e instanceof JsonPatchError) {
	                return e;
	            }
	            else {
	                throw e;
	            }
	        }
	    }
	    jsonpatch.validate = validate;
	})(jsonpatch || (jsonpatch = {}));
	if (true) {
	    exports.apply = jsonpatch.apply;
	    exports.observe = jsonpatch.observe;
	    exports.unobserve = jsonpatch.unobserve;
	    exports.generate = jsonpatch.generate;
	    exports.compare = jsonpatch.compare;
	    exports.validate = jsonpatch.validate;
	    exports.validator = jsonpatch.validator;
	    exports.JsonPatchError = jsonpatch.JsonPatchError;
	}
	else {
	    var exports = {};
	    var isBrowser = true;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = jsonpatch;
	/*
	When in browser, setting `exports = {}`
	fools other modules into thinking they're
	running in a node environment, which breaks
	some of them. Here is super light wieght fix.
	*/
	if (isBrowser) {
	    exports = undefined;
	}


/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.merge = exports.create = exports.apply = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /**
	                                                                                                                                                                                                                                                                                                                                                                                                                 * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                 * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                 * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                 */
	/**
	                                                                                                                                                                                                                                                                                                                                                                                                                     * Module for old-style LaxarJS patches used with the didUpdate event.
	                                                                                                                                                                                                                                                                                                                                                                                                                     *
	                                                                                                                                                                                                                                                                                                                                                                                                                     * @module patches
	                                                                                                                                                                                                                                                                                                                                                                                                                     */
	var _laxar = __webpack_require__(18);
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Applies all patches given as mapping from object path to new value. If a path fragment doesn't exist
	 * it is automatically inserted, using an array if the next key would be an integer. If a value is
	 * appended to an array all values in between are set to `null`.
	 *
	 * This patch format cannot express all operations. Use `json.applyPatch` instead.
	 *
	 * @deprecated since v1.1
	 *
	 * @param {Object} obj
	 *    the object to apply the patches on
	 * @param {Object} patches
	 *    the mapping of paths to new values
	 */
	function apply(obj, patches) {
	   var patchMap = void 0;
	   if (Array.isArray(patches)) {
	      patchMap = {};
	      var arr = patches;
	      arr.forEach(function (value, key) {
	         if (value !== undefined) {
	            patchMap[key] = value;
	         }
	      });
	   } else
	   {
	      patchMap = patches;
	   }
	
	   // We sort the keys by length. Thus deeply nested attributes are not overwritten by patches applied to
	   // one of their parents.
	   Object.keys(patches).
	   sort(function (a, b) {return a.length - b.length;}).
	   forEach(function (path) {return _laxar.object.setPath(obj, path, patches[path]);});
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a map of patches that describe the difference between to objects or arrays. Each entry is a
	 * path mapped to the changed value. This map can be applied to another object using `applyPatches`.
	 *
	 * Properties that start with '$$' are ignored when creating patches, so that for example the $$hashCode
	 * added by AngularJS ngRepeat is ignored.
	 *
	 * This patch format cannot express all operations. Use `json.createPatch` instead.
	 *
	 * @deprecated since v1.1
	 *
	 * @param {Object} result
	 *    the resulting object the patch map should establish
	 * @param {Object} base
	 *    the object used to base the patches upon
	 *
	 * @return {Object}
	 *    the mapping of path to patch-value
	 */
	function create(result, base) {
	   var targetType = type(result);
	   var subjectType = type(base);
	   if (targetType !== 'array' && targetType !== 'object') {
	      return null;
	   }
	
	   if (targetType !== subjectType) {
	      return _laxar.object.deepClone(result);
	   }
	   var patches = {};
	
	   function createPatchesRecursively(result, base, path) {
	      for (var key in result) {
	         if (result.hasOwnProperty(key) && (key.charAt(0) !== '$' || key.charAt(1) !== '$')) {
	            var val = result[key];
	            var nextPath = path.concat(key);
	            if (base[key] == null) {
	               patches[nextPath.join('.')] = clean(_laxar.object.deepClone(val));
	            } else
	            if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
	               createPatchesRecursively(val, base[key], nextPath);
	            } else
	            if (val !== base[key]) {
	               patches[nextPath.join('.')] = val;
	            }
	         }
	      }
	
	      for (var _key in base) {
	         if (base.hasOwnProperty(_key)) {
	            if (!(_key in result)) {
	               patches[path.concat(_key).join('.')] = null;
	            }
	         }
	      }
	   }
	   createPatchesRecursively(result, base, []);
	
	   return patches;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Merges two patch maps and returns the result. When properties exist in both patch maps, properties
	 * within the second map overwrite those found within the first one.
	 *
	 * This patch format cannot express all operations.
	 * Concatenate `json.createPatch` sequences instead of using this method.
	 *
	 * @deprecated since v1.1
	 *
	 * @param {Object} first
	 *    first map to merge
	 * @param {Object} second
	 *    second map to merge
	 *
	 * @return {Object}
	 *    the result of the merging
	 */
	function merge(first, second) {
	   var resultMap = {};
	   var firstKeys = Object.keys(first);
	   var secondKeys = Object.keys(second);
	   firstKeys.forEach(function (firstKey) {
	      // we first collect all properties in first, that won't be overwritten by changes in the second
	      // patch map.
	      for (var i = 0; i < secondKeys.length; ++i) {
	         // thus completely matching keys and keys that are finer than one in the second map are ignored
	         if (firstKey === secondKeys[i] || firstKey.indexOf(secondKeys[i] + '.') === 0) {
	            return;
	         }
	      }
	
	      resultMap[firstKey] = first[firstKey];
	   });
	
	   secondKeys.forEach(function (secondKey) {
	      // we know only have keys that are absolutely finer than those in the first patch map OR affect a
	      // completely different property that should be patched.
	      for (var i = 0; i < firstKeys.length; ++i) {
	         var firstKey = firstKeys[i];
	         var firstKeyAsPathFragment = firstKey + '.';
	         if (secondKey.indexOf(firstKeyAsPathFragment) === 0) {
	            // here we found a finer change in the second patch map that needs to be merged into the more
	            // general change of the first patch map
	            var patch = {};
	            patch[secondKey.replace(firstKeyAsPathFragment, '')] = second[secondKey];
	            var change = first[firstKey];
	            apply(change, patch);
	            resultMap[firstKey] = change;
	
	            return;
	         }
	      }
	
	      resultMap[secondKey] = second[secondKey];
	   });
	
	   return resultMap;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function type(object) {
	   if (object === null) {
	      return 'null';
	   }
	   if (object === undefined) {
	      return 'undefined';
	   }
	
	   var tmp = Object.prototype.toString.call(object).split(' ')[1];
	   if (!tmp) {
	      return undefined;
	   }
	   return tmp.substr(0, tmp.length - 1).toLowerCase();
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function clean(object) {
	   if (object === null) {
	      return object;
	   }
	   for (var key in object) {
	      if (object.hasOwnProperty(key)) {
	         if (key.charAt(0) === '$' && key.charAt(1) === '$') {
	            delete object[key];
	         } else
	         if (_typeof(object[key]) === 'object') {
	            clean(object[key]);
	         }
	      }
	   }
	   return object;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	apply = apply;exports.
	create = create;exports.
	merge = merge;

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.handlerFor = exports.isSame = exports.updatePublisherForFeature = exports.replacePublisherForFeature = exports.updateHandler = exports.replaceHandler = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;}; /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */
	/**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * This module provides helpers for patterns regarding *didReplace* and *didUpdate* events.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * Definition of the `context` object mentioned throughout this api:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * In the simplest case this can be the AngularJS `$scope` passed into a widget. Technically this can be
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * any object exposing these three properties:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * - `eventBus`: The event bus instance used for event subscriptions and publishing events
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * - `features`: The configuration of the widget, used for automagical resource handling
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * - `resources`: An object where all registered resources and updates to them are written to. Will be
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *   added if it doesn't exist.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @module resources
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */
	var _fastJsonPatch = __webpack_require__(274);var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);
	var _laxar = __webpack_require__(18);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a simple handler function for didReplace events. Replaces will be written to
	 * `context.resources` under the given value for `modelKey`.
	 *
	 * @param {Object} context
	 *    the context the handler works on
	 * @param {String} modelKey
	 *    the property of `context.resources` the handler writes replaces to
	 *
	 * @return {Function}
	 *    the handler function
	 */
	function replaceHandler(context, modelKey) {
	   (0, _laxar.assert)(context).hasType(Object).isNotNull();
	   (0, _laxar.assert)(modelKey).hasType(String).isNotNull();
	
	   var resourceBucket = provideResourceBucket(context);
	   return function (event) {
	      if (resourceBucket[modelKey] == null && event.data == null) {
	         return false;
	      }
	
	      resourceBucket[modelKey] = event.data;
	      return true;
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a simple handler function for didUpdate events. Updates will be written to
	 * `context.resources` under the given value for `modelKey`.
	 *
	 * @param {Object} context
	 *    the context the handler works on
	 * @param {String} modelKey
	 *    the property of `context.resources` the handler applies updates to
	 *
	 * @return {Function}
	 *    the handler function
	 */
	function updateHandler(context, modelKey) {
	   (0, _laxar.assert)(context).hasType(Object).isNotNull();
	   (0, _laxar.assert)(modelKey).hasType(String).isNotNull();
	
	   var resourceBucket = provideResourceBucket(context);
	   return function (event) {
	      if (resourceBucket[modelKey] != null && Array.isArray(event.patches)) {
	         _fastJsonPatch2.default.apply(resourceBucket[modelKey], event.patches);
	         return true;
	      }
	
	      return false;
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a function to publish didReplace events for the resource found as feature
	 * configuration. Resolution of the `featurePath` argument works just as explained in the documentation for
	 * {@link ResourceHandler#registerResourceFromFeature}. The publisher returns the promise returned by
	 * the underlying event bus call.
	 *
	 * @param {Object} context
	 *    the context the publisher works on
	 * @param {String} featurePath
	 *    the property of `context.features` the publisher reads the resource name from
	 * @param {Object} [optionalOptions]
	 *    options for the publisher
	 * @param {Boolean} optionalOptions.deliverToSender
	 *    the value is forwarded to `eventBus.publish`: if `true` the event will also be delivered to the
	 *    publisher. Default is `false`
	 * @param {Boolean} optionalOptions.isOptional
	 *    if `true`, don't throw an error if `featurePath.resource` is missing. Instead return a publisher
	 *    that doesn't do anything when called. Default is `false`.
	 *
	 * @return {Function}
	 *    the publisher function. Takes the data to publish as single argument
	 */
	function replacePublisherForFeature(context, featurePath, optionalOptions) {
	   (0, _laxar.assert)(context).hasType(Object).isNotNull();
	   (0, _laxar.assert)(context.eventBus).hasType(Object).isNotNull();
	
	   var options = _extends({ deliverToSender: false }, optionalOptions);
	
	   var resourceName = _laxar.object.path(context.features, featurePath + '.resource');
	   if (!resourceName && options.isOptional) {
	      return function () {return Promise.resolve();};
	   }
	   (0, _laxar.assert)(resourceName).hasType(String).isNotNull();
	
	   return function (replacement) {
	      return context.eventBus.publish('didReplace.' + resourceName, {
	         resource: resourceName,
	         data: replacement },
	      {
	         deliverToSender: !!options.deliverToSender });
	
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a function to publish didUpdate events for the resource found as feature
	 * configuration. Resolution of the `featurePath` argument works just as explained in the documentation for
	 * {@link ResourceHandler#registerResourceFromFeature}. The publisher returns the promise returned by
	 * the underlying event bus call. The returned function only accepts one argument, which is the JSON patch
	 * sequence conforming to [RFC 6902](https://tools.ietf.org/html/rfc6902).
	 *
	 * Example:
	 * ```js
	 * const publisher = resources.updatePublisherForFeature( context, path );
	 * publisher( [
	 *    { op: 'remove', path: '/accounts/2' },
	 *    { op: 'replace', path: '/contacts/hans/number', value: '+49 123 4563432' }
	 * ] );
	 * ```
	 *
	 * Additionally the returned function has a method `compareAndPublish` that accepts the previous version of
	 * a resource as first argument and the current version of the resource as second argument. It then creates
	 * the JSON patch sequence itself and sends the according didUpdate event. It also returns the promise
	 * returned by the underlying event bus call.
	 *
	 * Example:
	 * ```js
	 * const publisher = resources.updatePublisherForFeature( context, path );
	 * publisher.compareAndPublish( obsoleteVersion, currentVersion );
	 * ```
	 *
	 * Note that a generic generation of patches might lead to strange, large patch sequences, especially when
	 * removing entries. The diff library doesn't know about identities and as such won't recognize where a
	 * specific element was removed. As a consequence instead of generating a remove operation, this could
	 * result in a very large number of replace operations that shift the properties from successors to the
	 * front in order to overwrite instead of remove the entry.
	 * In such cases one is better off by manually creating a patch with operation remove, as the knowledge
	 * about the domain is available at the user of this publisher.
	 *
	 * @param {Object} context
	 *    the context the publisher works on
	 * @param {String} featurePath
	 *    the property of `context.features` the publisher reads the resource name from
	 * @param {Object} [optionalOptions]
	 *    options for the publisher
	 * @param {Boolean} optionalOptions.deliverToSender
	 *    the value is forward to `eventBus.publish`: if `true` the event will also be delivered to the
	 *    publisher. Default is `false`
	 * @param {Boolean} optionalOptions.isOptional
	 *    if `true`, don't throw an error if `featurePath.resource` is missing. Instead return a publisher
	 *    that doesn't do anything when called. Default is `false`.
	 *
	 * @return {Function}
	 *    the publisher function as described above
	 */
	function updatePublisherForFeature(context, featurePath, optionalOptions) {
	   (0, _laxar.assert)(context).hasType(Object).isNotNull();
	   (0, _laxar.assert)(context.eventBus).hasType(Object).isNotNull();
	
	   var options = _extends({ deliverToSender: false }, optionalOptions);
	
	   var resource = _laxar.object.path(context.features, featurePath + '.resource');
	   if (!resource && options.isOptional) {
	      var noopPublisher = function noopPublisher() {return Promise.resolve();};
	      noopPublisher.compareAndPublish = noopPublisher;
	      return noopPublisher;
	   }
	   (0, _laxar.assert)(resource).hasType(String).isNotNull();
	
	   var publisher = function publisher(patches) {
	      (0, _laxar.assert)(patches).hasType(Array).isNotNull();
	
	      if (!patches || !patches.length) {
	         context.log.trace(
	         'updatePublisher: Not sending empty didUpdate to resource "[0]" from sender "[1]".',
	         resource, (context.widget || { id: 'unknown' }).id);
	
	         return Promise.resolve();
	      }
	
	      var meta = { deliverToSender: !!options.deliverToSender };
	      return context.eventBus.publish('didUpdate.' + resource, { resource: resource, patches: patches }, meta);
	   };
	
	   publisher.compareAndPublish = function (from, to) {return publisher(_fastJsonPatch2.default.compare(from, to));};
	
	   return publisher;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a new handler instance for didReplace and didUpdate events. It already handles setting of the
	 * resource data on didReplace in the context.resources property and updating that data on didUpdate events.
	 *
	 * @param {Object} context
	 *    the context the handler should work with. It expects to find an `eventBus` property there with which
	 *    it can do the event handling
	 *
	 * @return {ResourceHandler}
	 *    a resource handler instance
	 */
	function handlerFor(context) {
	   return new ResourceHandler(context);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function ResourceHandler(context) {
	   this.context_ = context;
	   this.externalHandlers_ = {};
	   this.modelHandlers_ = {};
	   this.waitingFor_ = [];
	   this.allReplacedCallback_ = function () {};
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers default event handlers for a feature. The `feature` argument is interpreted as attribute
	 * path to an object having a `resource` property of type string holding the name of the resource to
	 * register the handler for. All replacements and updates will be written to `context.resources` by the
	 * rules written at `options.modelKey` doc.
	 *
	 * Example:
	 * Consider the following configuration:
	 * ```json
	 * {
	 *    "features": {
	 *       "someFeature": {
	 *          "someResourceConfig": {
	 *             "resource": "myResource"
	 *          }
	 *       }
	 *    }
	 * }
	 * ```
	 *
	 * The corresponding call, using an AngularJS Scope as context, would be (providing none of the options):
	 *
	 * ```js
	 * patterns.resources.handlerFor( $scope )
	 *    .registerResourceFromFeature( 'someFeature.someResourceConfig' );
	 * ```
	 *
	 * @param {String} featurePath
	 *    the attribute path to the feature for the resource
	 * @param {Object|Function} [optionalOptions]
	 *    options and callbacks to use. If a function is passed, it is used as the `onUpdateReplace` option.
	 * @param {Function|Function[]} optionalOptions.onReplace
	 *    a function or a list of functions to call when a didReplace event is received. Each function
	 *    receives the event object as argument. If `options.omitFirstReplace` is `true`, it is only called
	 *    first the second time a didReplace event occurs
	 * @param {Function|Function[]} optionalOptions.onUpdate
	 *    a function or a list of functions to call when a didUpdate event is received. Each function
	 *    receives the event object as argument
	 * @param {Function|Function[]} optionalOptions.onUpdateReplace
	 *    a function or a list of functions to call when a didUpdate or a didReplace event is received. Each
	 *    function receives the event object as argument. If `options.omitFirstReplace` is `true`, it is
	 *    not called for the first received didReplace event
	 * @param {Boolean} optionalOptions.omitFirstReplace
	 *    if `true` `options.onReplace` is only called after the
	 *    first time a didReplace event occurred. Default is `false`
	 * @param {String} optionalOptions.modelKey
	 *    the key to use for the resource in `context.resources`. If not given the last path fragment of
	 *    `featurePath` is used. For example if the path is `myfeature.superResource` the key will be
	 *    `superResource`
	 * @param {Boolean} optionalOptions.isOptional
	 *    if set to `true`, missing configuration for this resource is silently ignored and no handlers
	 *    are registered. If set to `false`, an error will be raised in this case (default is `false`)
	 *
	 * @return {ResourceHandler}
	 *    this instance for chaining
	 */
	ResourceHandler.prototype.registerResourceFromFeature = function (featurePath, optionalOptions) {
	   var resource = _laxar.object.path(this.context_.features, featurePath + '.resource', null);
	   var options = _extends({
	      isOptional: false },
	   typeof optionalOptions === 'function' ? { onUpdateReplace: optionalOptions } : optionalOptions);
	
	   if (resource === null && options.isOptional) {
	      return this;
	   }
	   (0, _laxar.assert)(resource).isNotNull('Could not find resource configuration in features for "' + featurePath + '"');
	
	   if (!options.modelKey) {
	      options.modelKey = featurePath.substr(featurePath.lastIndexOf('.') + 1);
	   }
	
	   return this.registerResource(resource, options);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers default event handlers for a known resource name. All replacements and updates will be
	 * written to `context.resources`.
	 *
	 * @param {String} resource
	 *    the resource the handler should be registered for
	 * @param {Object|Function} [optionalOptions]
	 *    options and callbacks to use. If a function is passed, it is used as the `onUpdateReplace` option.
	 * @param {Function|Function[]} optionalOptions.onReplace
	 *    a function or a list of functions to call when a didReplace event is received. Each function
	 *    receives the event object as argument. If `options.omitFirstReplace` is `true`, it is only called
	 *    first the second time a didReplace event occurs
	 * @param {Function|Function[]} optionalOptions.onUpdate
	 *    a function or a list of functions to call when a didUpdate event is received. Each function
	 *    receives the event object as argument
	 * @param {Function|Function[]} optionalOptions.onUpdateReplace
	 *    a function or a list of functions to call when a didUpdate or a didReplace event is received. Each
	 *    function receives the event object as argument. If `options.omitFirstReplace` is `true`, it is
	 *    only called first for didReplace events the second time such an event occurs
	 * @param {Boolean} optionalOptions.omitFirstReplace
	 *    if `true` `options.onReplace` is only called after the first time a didReplace event occurred.
	 *    Default is `false`
	 * @param {String} optionalOptions.modelKey
	 *    the key to use for the resource in `context.resources`. If not given the value of `resource` is
	 *    used
	 *
	 * @return {ResourceHandler}
	 *    this instance for chaining
	 */
	ResourceHandler.prototype.registerResource = function (resource, optionalOptions) {
	   (0, _laxar.assert)(resource).hasType(String).isNotNull();
	
	   var options = _extends({
	      omitFirstReplace: false,
	      modelKey: resource },
	   typeof optionalOptions === 'function' ? { onUpdateReplace: optionalOptions } : optionalOptions);
	
	
	   this.waitingFor_.push(resource);
	   registerResourceHandlers(this, resource, options);
	
	   if (!(resource in this.modelHandlers_)) {
	      this.modelHandlers_[resource] = {};
	   }
	
	   registerForReplace(this, resource, options);
	   registerForUpdate(this, resource, options);
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Registers a callback that is called once all resources were initially replaced. If more resource
	 * handlers are registered before all relevant didReplace events were received, those are also waited
	 * for.
	 *
	 * @param {Function} callback
	 *     the function to call
	 * @param {Boolean} [optionalOptions]
	 *    an optional set of parameters to specify watch behavior
	 * @param {Boolean} optionalOptions.watch
	 *    if `true`, the callback will be called again whenever resources are modified after all were
	 *    replaced at least once
	 *
	 * @return {ResourceHandler}
	 *    this instance for chaining
	 */
	ResourceHandler.prototype.whenAllWereReplaced = function (callback, optionalOptions) {
	   (0, _laxar.assert)(callback).hasType(Function).isNotNull();
	
	   this.allReplacedCallback_ = optionalOptions && optionalOptions.watch ? callback : onceCallback;
	
	   return this;
	
	   function onceCallback() {
	      callback();
	      this.allReplacedCallback_ = function () {};
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Allows to find out if there are still outstanding resources, or if all resources have been replaced.
	 * Can be used in update-/replace-handlers to determine if all dependencies are satisfied.
	 *
	 * @return {Boolean}
	 *    `true` if all resources registered with this handler (so far) have been replaced at least once,
	 *    `false` if there are still outstanding resources
	 */
	ResourceHandler.prototype.wereAllReplaced = function () {
	   return !this.waitingFor_.length;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function registerResourceHandlers(self, resource, options) {
	   if (!self.externalHandlers_[resource]) {
	      self.externalHandlers_[resource] = {
	         onReplace: [],
	         onUpdate: [] };
	
	   }
	
	   appendFunctionOrArrayOfFunctions(self.externalHandlers_[resource].onUpdate, options.onUpdate);
	   appendFunctionOrArrayOfFunctions(self.externalHandlers_[resource].onUpdate, options.onUpdateReplace);
	
	   var replaceHandlers = [];
	   appendFunctionOrArrayOfFunctions(replaceHandlers, options.onReplace);
	   appendFunctionOrArrayOfFunctions(replaceHandlers, options.onUpdateReplace);
	
	   if (options.omitFirstReplace) {
	      replaceHandlers = replaceHandlers.map(function (handler) {return ignoringFirstCall(handler);});
	   }
	
	   function ignoringFirstCall(f) {
	      var ignore = true;
	      return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
	         if (ignore) {
	            ignore = false;
	            return;
	         }
	         f.apply(self, args);
	      };
	   }
	
	   appendFunctionOrArrayOfFunctions(self.externalHandlers_[resource].onReplace, replaceHandlers);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function registerForReplace(self, resource, options) {
	   var handler = replaceHandler(self.context_, options.modelKey);
	   if (self.modelHandlers_[resource].onReplace) {
	      self.modelHandlers_[resource].onReplace.push(handler);
	      return;
	   }
	   self.modelHandlers_[resource].onReplace = [handler];
	
	   self.context_.eventBus.subscribe('didReplace.' + resource, function (event, meta) {
	      var changed = self.modelHandlers_[resource].onReplace.
	      reduce(function (changed, handler) {return handler(event, meta) || changed;}, false);
	
	      if (!changed) {return;}
	
	      try {
	         self.externalHandlers_[resource].onReplace.forEach(function (handler) {return handler(event, meta);});
	      } finally
	      {
	         self.waitingFor_ = self.waitingFor_.filter(function (topic) {return topic !== resource;});
	         if (!self.waitingFor_.length) {
	            self.allReplacedCallback_();
	         }
	      }
	
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function registerForUpdate(self, resource, options) {
	   var handler = updateHandler(self.context_, options.modelKey);
	   if (self.modelHandlers_[resource].onUpdate) {
	      self.modelHandlers_[resource].onUpdate.push(handler);
	      return;
	   }
	   self.modelHandlers_[resource].onUpdate = [handler];
	
	   self.context_.eventBus.subscribe('didUpdate.' + resource, function (event, meta) {
	      var changed = self.modelHandlers_[resource].onUpdate.
	      reduce(function (changed, handler) {return handler(event, meta) || changed;}, false);
	
	      if (!changed) {return;}
	
	      try {
	         self.externalHandlers_[resource].onUpdate.forEach(function (handler) {return handler(event, meta);});
	      } finally
	      {
	         if (!self.waitingFor_.length) {
	            self.allReplacedCallback_();
	         }
	      }
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function appendFunctionOrArrayOfFunctions(target, funcOrArray) {
	   if (typeof funcOrArray === 'function') {
	      target.push(funcOrArray);
	      return;
	   }
	
	   if (Array.isArray(funcOrArray)) {
	      Array.prototype.push.apply(target, funcOrArray);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function provideResourceBucket(context) {
	   if (!context.hasOwnProperty('resources') || _typeof(context.resources) !== 'object') {
	      context.resources = {};
	   }
	
	   return context.resources;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Tests if two objects represent the same resource.
	 *
	 * The test takes place as follows:
	 *  - Let value of `counter` be zero.
	 *  - For each attribute (or attribute path) in `attribute` test the following:
	 *    - If both objects contain the attribute (or a defined value at the given path), check for
	 *       identity using `===`.
	 *       - If this check is negative, skip further testing and let the result of the function be `false`.
	 *       - If it is positive, increment `counter`.
	 *    - If none of the objects contains the attribute (or a defined value at the given path), skip to
	 *       the next attribute.
	 *    - If the attribute (or a defined value at the given path) exist only in one of the objects, skip
	 *       further testing and let the result of the function be `false`.
	 *  - If all attributes have been tested and the value of `counter` is greater than zero, let the result
	 *    of the function be `true`, `false` otherwise.
	 *
	 * @param {Object} resourceA
	 *    the first object to test
	 * @param {Object} resourceB
	 *    the second object to test
	 * @param {String[]} compareAttributes
	 *    the list of attributes determining resource identity
	 *
	 * @return {Boolean}
	 *    `true` if both objects are assumed to represent the same resource, `false` otherwise
	 */
	function isSame(resourceA, resourceB, compareAttributes) {
	   if (resourceA == null || resourceB == null) {
	      return false;
	   }
	
	   var matches = 0;
	   for (var i = 0; i < compareAttributes.length; ++i) {
	      var key = compareAttributes[i];
	      if (key.indexOf('.') !== -1) {
	         // Compare using object.path (only if needed, for performance):
	         var valueA = _laxar.object.path(resourceA, key);
	         var valueB = _laxar.object.path(resourceB, key);
	         if (valueA === undefined && valueB === undefined) {
	            continue;
	         }
	         if (valueA === valueB) {
	            ++matches;
	         } else
	         {
	            return false;
	         }
	      } else
	      {
	         if (!(key in resourceA) && !(key in resourceB)) {
	            continue;
	         }
	         if (resourceA[key] === resourceB[key]) {
	            ++matches;
	         } else
	         {
	            return false;
	         }
	      }
	   }
	   return matches > 0;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	replaceHandler = replaceHandler;exports.
	updateHandler = updateHandler;exports.
	replacePublisherForFeature = replacePublisherForFeature;exports.
	updatePublisherForFeature = updatePublisherForFeature;exports.
	isSame = isSame;exports.
	handlerFor = handlerFor;

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.handlerFor = exports.errorEvent = exports.successEvent = undefined;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var _laxar = __webpack_require__(18);
	
	/**
	                                * Creates and returns an event resembling a successful validation result.
	                                *
	                                * @param {String} resource
	                                *    name of the validated resource
	                                * @param {...Object|String|String[]|Object[]} htmlMessages
	                                *    messages associated with the result. They should have the structure as described in the module
	                                *
	                                * @return {Object}
	                                *    the validation event
	                                */
	function successEvent(resource) {for (var _len = arguments.length, htmlMessages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {htmlMessages[_key - 1] = arguments[_key];}
	   return createEvent(resource, messagesFromArgs(htmlMessages), 'SUCCESS');
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns an event resembling the result of a validation with errors.
	 *
	 * @param {String} resource
	 *    name of the validated resource
	 * @param {...Object|String|String[]|Object[]} htmlMessages
	 *    messages associated with the result. They should have the structure as described in the module
	 *
	 * @return {Object}
	 *    the validation event
	 */ /**
	     * Copyright 2014-2015 aixigo AG
	     * Released under the MIT license.
	     * http://laxarjs.org/license
	     */ /**
	         * This module provides helpers for patterns regarding *validateRequest*, *willValidate* and
	         * *didValidate* events.
	         *
	         * Validation messages can have one of the following structures:
	         * - A simple html message object (locale to string mapping). It will get a default level of *ERROR*.
	         * - A html message object as required by the messages widget consisting of a html message object under the
	         *   key *htmlMessage* and a level under the key *level*.
	         *
	         * @module validation
	         */function errorEvent(resource) {for (var _len2 = arguments.length, htmlMessages = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {htmlMessages[_key2 - 1] = arguments[_key2];}return createEvent(resource, messagesFromArgs(htmlMessages), 'ERROR');} //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Creates and returns a new handler for `validateRequest` events for a given context. It handles sending
	 * of `willValidate` and `didValidate` events, including the output of the given `validator` function.
	 *
	 * @param {Object} context
	 *    the context the handler should work with. It expects to find an `eventBus` property, with which
	 *    it can do the event handling
	 * @param {Object} configuration
	 *    a laxarjs configuration, from which to get the default validation error message
	 * @param {Object} log
	 *    a laxarjs logger, to log validation errors
	 *
	 * @return {ValidationHandler}
	 *    the validation handler instance for the given context
	 */function handlerFor(context, configuration, log) {(0, _laxar.assert)(context).hasType(Object).hasProperty('eventBus');(0, _laxar.assert)(configuration).hasType(Object).hasProperty('get');(0, _laxar.assert)(log).hasType(Object).hasProperty('error');var eventBus = context.eventBus; /**
	                                                                                                                                                                                                                                                                                             * @name ValidationHandler
	                                                                                                                                                                                                                                                                                             */
	   var api = {
	      registerResourceFromFeature: registerResourceFromFeature,
	      registerResource: registerResource };
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a validator for `validateRequest` events for a resource configured under the given feature.
	    * It is assumed that the given feature has a `resource` property with the name of the resource to
	    * validate. If the property is not found, an assertion will fail. If on the other hand the option
	    * `isOptional` is given as `true`, this is ignored and nothing good or bad happens.
	    *
	    * Apart from that this function works just like {@link ValidationHandler#registerResource}.
	    *
	    * Example:
	    * Consider the following configuration for a widget:
	    * ```json
	    * {
	    *    "features": {
	    *       "amount": {
	    *          "resource": "theAmount"
	    *       }
	    *    }
	    * }
	    * ```
	    * An example using that would be:
	    * ```js
	    * validation.handlerFor( context )
	    *    .registerResourceFromFeature( 'amount', function( event, meta ) {
	    *       if( isAmountValid() ) {
	    *          return null;
	    *       }
	    *       return 'The given amount is not valid';
	    *    } );
	    * ```
	    *
	    * @param {String} featurePath
	    *    the feature to read the resource to validate from
	    * @param {Function} validator
	    *    the validator function called upon `validateRequest` for the given resource
	    * @param {Object} [optionalOptions]
	    *    options to use
	    * @param {Boolean} optionalOptions.isOptional
	    *    if `true` a non-configured feature is simply ignored. Otherwise this results in an error
	    *    (default is `false`)
	    *
	    * @return {ValidationHandler}
	    *    this instance for chaining
	    *
	    * @memberOf ValidationHandler
	    */
	   function registerResourceFromFeature(featurePath, validator, optionalOptions) {
	      (0, _laxar.assert)(featurePath).hasType(String).isNotNull();
	      (0, _laxar.assert)(validator).hasType(Function).isNotNull();
	
	      var options = _laxar.object.options(optionalOptions, { isOptional: false });
	
	      var resource = _laxar.object.path(context.features, featurePath + '.resource', null);
	      if (resource === null && options.isOptional) {
	         return api;
	      }
	      (0, _laxar.assert)(resource).
	      isNotNull('Could not find resource configuration in features for "' + featurePath + '"');
	
	      return registerResource(resource, validator);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a validator for `validateRequest` events for the given resource.
	    *
	    * The validator must be a function, that handles the actual validation necessary for the resource. The
	    * validation result is always signaled through one or more generated error messages or the absence of
	    * these messages. So valid results may be a string, an i18n object, an array of the former, `null` or
	    * an empty array. `null` and an empty array signal a successful validation.
	    *
	    * The validator receives the event object for the `validateRequest` event and its according `meta` object.
	    *
	    * The way these messages are returned by the validator may be one of two ways, depending on the nature
	    * of the validation:
	    *
	    * - if the validation can be handled synchronously, the result should simply be returned directly
	    * - in case the validation is asynchronous, a promise must be returned, which must be resolved with the
	    *   same kind of values as for the synchronous case
	    *
	    * If the validator throws an error or the promise is rejected, this is treated as a failed validation.
	    * Since this is due to a programming error, the error or rejection cause will be logged and a
	    * configurable message will instead be send in the `didValidate` event. The message is assumed to be
	    * found in the global configuration at `lib.laxar-patterns.validation.i18nHtmlExceptionMessage` as string
	    * or i18n object. If it cannot be found, an empty string is send as message.
	    *
	    * Example:
	    * ```js
	    * validation.handlerFor( context, configuration, log, i18n )
	    *    .registerResource( 'theAmount', function( event, meta ) {
	    *       return context.resources.theAmount > 1000;
	    *    } )
	    *    .registerResource( 'currentUser', function( event, meta ) {
	    *       return fetchUserValidityRules()
	    *          .then( function( rules ) {
	    *             return context.resources.currentUser.meets( rules );
	    *          } )
	    *          .then( function( valid ) {
	    *             return valid ? null : 'The current user isn\'t valid for some reason. Do something!';
	    *          } );
	    *    } );
	    * ```
	    *
	    * @param {String} resource
	    *    the resource to validate
	    * @param {Function} validator
	    *    the validator function called upon `validateRequest` for the given resource
	    *
	    * @return {ValidationHandler}
	    *    this instance for chaining
	    *
	    * @memberOf ValidationHandler
	    */
	   function registerResource(resource, validator) {
	      (0, _laxar.assert)(resource).hasType(String).isNotNull();
	      (0, _laxar.assert)(validator).hasType(Function).isNotNull();
	
	      eventBus.subscribe('validateRequest.' + resource, function (event, meta) {
	         callValidator(resource, validator.bind(null, event, meta));
	      });
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // eslint-disable-next-line valid-jsdoc
	   /** @private */
	   function callValidator(resource, validator) {
	      eventBus.publish('willValidate.' + resource, { resource: resource });
	      try {
	         var returnValue = validator();
	
	         Promise.resolve(returnValue).
	         then(function (result) {
	            var wrap = function wrap(_) {return _ ? [_] : null;};
	            var messages = Array.isArray(result) ? result : wrap(result);
	            var event = messages && messages.length > 0 ?
	            errorEvent(resource, messages) :
	            successEvent(resource);
	
	            eventBus.publish('didValidate.' + resource + '.' + event.outcome, event);
	         }).
	         catch(handleError.bind(null, resource));
	      }
	      catch (err) {
	         handleError(resource, err);
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // eslint-disable-next-line valid-jsdoc
	   /** @private */
	   function handleError(resource, err) {
	      var logMessage = err && err.message ? err.message : err;
	      log.error('Error handling validateRequest for resource "[0]": [1]', resource, logMessage);
	      if (err) {
	         log.error('Stacktrace for previous error: [0]', err.stack || 'unavailable');
	      }
	
	      var message = configuration.get('lib.laxar-patterns.validation.i18nHtmlExceptionMessage', '');
	      eventBus.publish('didValidate.' + resource + '.ERROR', errorEvent(resource, message));
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return api;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function createEvent(resource, htmlMessages, outcome) {
	   var data = htmlMessages && htmlMessages.length ?
	   htmlMessages.map(function (msg) {
	      if (msg.htmlMessage && msg.level) {
	         return msg;
	      }
	
	      return {
	         htmlMessage: msg,
	         level: 'ERROR' };
	
	   }) : [];
	
	   return { resource: resource, data: data, outcome: outcome };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */
	function messagesFromArgs(messageArguments) {
	   if (messageArguments && Array.isArray(messageArguments[0])) {
	      return messageArguments[0];
	   }
	   return messageArguments;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	successEvent = successEvent;exports.
	errorEvent = errorEvent;exports.
	handlerFor = handlerFor;

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.requestPublisherForArea = exports.requestPublisherForWidget = exports.handlerFor = undefined;
	
	
	
	
	
	
	
	
	
	
	var _laxar = __webpack_require__(18);
	
	/**
	                                * Creates a new handler instance for `didChangeAreaVisibility` events.
	                                *
	                                * @param {Object} scope
	                                *    the scope the handler should work with. It is expected to find an `eventBus` property there with
	                                *    which it can do the event handling. The visibility handler will manage the boolean scope property
	                                *    `isVisible` which can be used to determine the visibility state of the entire widget
	                                * @param {Object} [optionalOptions]
	                                *    additional options to pass to the visibility handler
	                                * @param {Function} optionalOptions.onChange
	                                *    a handler to call when a `didChangeAreaVisibility` request for this widget's container was received,
	                                *    and the visibility of this widget was changed
	                                * @param {Function} optionalOptions.onShow
	                                *    a handler to call when a `didChangeAreaVisibility` request for this widget's container was received,
	                                *    and the visibility of this widget was changed to `true`
	                                * @param {Function} optionalOptions.onHide
	                                *    a handler to call when a `didChangeAreaVisibility` request for this widget's container was received,
	                                *    and the visibility of this widget was changed to `false`
	                                * @param {Function} optionalOptions.onAnyAreaRequest
	                                *    a handler for any `changeAreaVisibilityRequest` to this widget's areas
	                                *    The handler must
	                                *     * _either_ return `true`/`false` to indicate visibility synchronously
	                                *     * _or_ issue a will/did-response for the area when called
	                                *
	                                * @return {VisibilityHandler}
	                                *    a visibility handler instance
	                                */
	function handlerFor(scope, optionalOptions) {
	   return new VisibilityHandler(scope, optionalOptions);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/** @private */ /**
	                 * Copyright 2016 aixigo AG
	                 * Released under the MIT license.
	                 * http://laxarjs.org/license
	                 */ /**
	                     * This module provides helpers for patterns regarding *changeAreaVisibilityRequest* and
	                     * *didChangeAreaVisibility* events.
	                     *
	                     * @module visibility
	                     */function VisibilityHandler(scope, optionalOptions) {this.scope = scope;scope.isVisible = false;var options = _laxar.object.options(optionalOptions, {});if (options.onAnyAreaRequest) {var requestEvent = 'changeAreaVisibilityRequest.' + scope.widget.id;scope.eventBus.subscribe(requestEvent, responder(this, options.onAnyAreaRequest));
	   }
	
	   var didEvent = 'didChangeAreaVisibility.' + scope.widget.area;
	   scope.eventBus.subscribe(didEvent, function (event) {
	      var wasVisible = scope.isVisible || false;
	      scope.isVisible = event.visible;
	      if (wasVisible === event.visible) {
	         return;
	      }
	      if (options.onChange) {
	         options.onChange(event);
	      }
	      if (options.onShow && event.visible) {
	         options.onShow(event);
	      } else
	      if (options.onHide && !event.visible) {
	         options.onHide(event);
	      }
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Handle change-visibility-requests for a specific area, using a callback.
	 *
	 * @param {String} areaName
	 *    the name of the area for which to handle visibility events
	 * @param {Object=} optionalOptions
	 *    additional options to pass to the visibility handler
	 * @param {Function=} optionalOptions.onRequest
	 *    a callback for any `changeAreaVisibilityRequest` to this area. The callback may issue a
	 *    will/did-response for the area when called, or return a boolean which causes the visibility handler
	 *    to respond accordingly. This should not be used in conjunction with the global
	 *    `onAnyAreaRequest`-option of the handler
	 *
	 * @return {VisibilityHandler}
	 *    this instance for chaining
	 */
	VisibilityHandler.prototype.registerArea = function (areaName, optionalOptions) {
	   var options = _laxar.object.options(optionalOptions, {});
	   if (options.onRequest) {
	      var requestEvent = 'changeAreaVisibilityRequest.' + areaName;
	      this.scope.eventBus.subscribe(requestEvent, responder(this, options.onRequest));
	   }
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function responder(self, callback) {
	   return function (event) {
	      var result = callback(event);
	      if (result === true || result === false) {
	         var didEvent = 'didChangeAreaVisibility.' + event.area + '.' + result;
	         self.scope.eventBus.publish(didEvent, {
	            area: event.area,
	            visible: result },
	         { deliverToSender: false });
	      }
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Publishes `changeWidgetVisibilityRequest` events.
	 *
	 * @param {Object} scope
	 *    a scope (with `widget` and `eventBus` properties)
	 *
	 * @return {Function}
	 *    a function of boolean that requests for widget visibility to be set to the given state
	 */
	function requestPublisherForWidget(scope) {
	   return function (visible) {
	      var eventName = 'changeWidgetVisibilityRequest.' + scope.widget.id + '.' + visible;
	      return scope.eventBus.publishAndGatherReplies(eventName, {
	         widget: scope.widget.id,
	         visible: visible },
	      { deliverToSender: false });
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Publishes `changeAreaVisibilityRequest` events.
	 *
	 * @param {Object} scope
	 *    a scope (with an `eventBus` property)
	 * @param {String} area
	 *    the name of a widget area whose visibility is to be controlled by the function returned
	 *
	 * @return {Function}
	 *    a function of boolean that requests for the given area's visibility to be set to the given state
	 */
	function requestPublisherForArea(scope, area) {
	   return function (visible) {
	      var eventName = 'changeAreaVisibilityRequest.' + area + '.' + visible;
	      var meta = { deliverToSender: false };
	      return scope.eventBus.publishAndGatherReplies(eventName, { area: area, visible: visible }, meta);
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	exports.
	
	handlerFor = handlerFor;exports.
	requestPublisherForWidget = requestPublisherForWidget;exports.
	requestPublisherForArea = requestPublisherForArea;

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
	//! version : 2.17.1
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com
	
	;(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    global.moment = factory()
	}(this, (function () { 'use strict';
	
	var hookCallback;
	
	function hooks () {
	    return hookCallback.apply(null, arguments);
	}
	
	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback (callback) {
	    hookCallback = callback;
	}
	
	function isArray(input) {
	    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	}
	
	function isObject(input) {
	    // IE8 will treat undefined and null as object if it wasn't for
	    // input != null
	    return input != null && Object.prototype.toString.call(input) === '[object Object]';
	}
	
	function isObjectEmpty(obj) {
	    var k;
	    for (k in obj) {
	        // even if its not own property I'd still call it non-empty
	        return false;
	    }
	    return true;
	}
	
	function isNumber(input) {
	    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
	}
	
	function isDate(input) {
	    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	}
	
	function map(arr, fn) {
	    var res = [], i;
	    for (i = 0; i < arr.length; ++i) {
	        res.push(fn(arr[i], i));
	    }
	    return res;
	}
	
	function hasOwnProp(a, b) {
	    return Object.prototype.hasOwnProperty.call(a, b);
	}
	
	function extend(a, b) {
	    for (var i in b) {
	        if (hasOwnProp(b, i)) {
	            a[i] = b[i];
	        }
	    }
	
	    if (hasOwnProp(b, 'toString')) {
	        a.toString = b.toString;
	    }
	
	    if (hasOwnProp(b, 'valueOf')) {
	        a.valueOf = b.valueOf;
	    }
	
	    return a;
	}
	
	function createUTC (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, true).utc();
	}
	
	function defaultParsingFlags() {
	    // We need to deep clone this object.
	    return {
	        empty           : false,
	        unusedTokens    : [],
	        unusedInput     : [],
	        overflow        : -2,
	        charsLeftOver   : 0,
	        nullInput       : false,
	        invalidMonth    : null,
	        invalidFormat   : false,
	        userInvalidated : false,
	        iso             : false,
	        parsedDateParts : [],
	        meridiem        : null
	    };
	}
	
	function getParsingFlags(m) {
	    if (m._pf == null) {
	        m._pf = defaultParsingFlags();
	    }
	    return m._pf;
	}
	
	var some;
	if (Array.prototype.some) {
	    some = Array.prototype.some;
	} else {
	    some = function (fun) {
	        var t = Object(this);
	        var len = t.length >>> 0;
	
	        for (var i = 0; i < len; i++) {
	            if (i in t && fun.call(this, t[i], i, t)) {
	                return true;
	            }
	        }
	
	        return false;
	    };
	}
	
	var some$1 = some;
	
	function isValid(m) {
	    if (m._isValid == null) {
	        var flags = getParsingFlags(m);
	        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
	            return i != null;
	        });
	        var isNowValid = !isNaN(m._d.getTime()) &&
	            flags.overflow < 0 &&
	            !flags.empty &&
	            !flags.invalidMonth &&
	            !flags.invalidWeekday &&
	            !flags.nullInput &&
	            !flags.invalidFormat &&
	            !flags.userInvalidated &&
	            (!flags.meridiem || (flags.meridiem && parsedParts));
	
	        if (m._strict) {
	            isNowValid = isNowValid &&
	                flags.charsLeftOver === 0 &&
	                flags.unusedTokens.length === 0 &&
	                flags.bigHour === undefined;
	        }
	
	        if (Object.isFrozen == null || !Object.isFrozen(m)) {
	            m._isValid = isNowValid;
	        }
	        else {
	            return isNowValid;
	        }
	    }
	    return m._isValid;
	}
	
	function createInvalid (flags) {
	    var m = createUTC(NaN);
	    if (flags != null) {
	        extend(getParsingFlags(m), flags);
	    }
	    else {
	        getParsingFlags(m).userInvalidated = true;
	    }
	
	    return m;
	}
	
	function isUndefined(input) {
	    return input === void 0;
	}
	
	// Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties = hooks.momentProperties = [];
	
	function copyConfig(to, from) {
	    var i, prop, val;
	
	    if (!isUndefined(from._isAMomentObject)) {
	        to._isAMomentObject = from._isAMomentObject;
	    }
	    if (!isUndefined(from._i)) {
	        to._i = from._i;
	    }
	    if (!isUndefined(from._f)) {
	        to._f = from._f;
	    }
	    if (!isUndefined(from._l)) {
	        to._l = from._l;
	    }
	    if (!isUndefined(from._strict)) {
	        to._strict = from._strict;
	    }
	    if (!isUndefined(from._tzm)) {
	        to._tzm = from._tzm;
	    }
	    if (!isUndefined(from._isUTC)) {
	        to._isUTC = from._isUTC;
	    }
	    if (!isUndefined(from._offset)) {
	        to._offset = from._offset;
	    }
	    if (!isUndefined(from._pf)) {
	        to._pf = getParsingFlags(from);
	    }
	    if (!isUndefined(from._locale)) {
	        to._locale = from._locale;
	    }
	
	    if (momentProperties.length > 0) {
	        for (i in momentProperties) {
	            prop = momentProperties[i];
	            val = from[prop];
	            if (!isUndefined(val)) {
	                to[prop] = val;
	            }
	        }
	    }
	
	    return to;
	}
	
	var updateInProgress = false;
	
	// Moment prototype object
	function Moment(config) {
	    copyConfig(this, config);
	    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	    if (!this.isValid()) {
	        this._d = new Date(NaN);
	    }
	    // Prevent infinite loop in case updateOffset creates new moment
	    // objects.
	    if (updateInProgress === false) {
	        updateInProgress = true;
	        hooks.updateOffset(this);
	        updateInProgress = false;
	    }
	}
	
	function isMoment (obj) {
	    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	}
	
	function absFloor (number) {
	    if (number < 0) {
	        // -0 -> 0
	        return Math.ceil(number) || 0;
	    } else {
	        return Math.floor(number);
	    }
	}
	
	function toInt(argumentForCoercion) {
	    var coercedNumber = +argumentForCoercion,
	        value = 0;
	
	    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	        value = absFloor(coercedNumber);
	    }
	
	    return value;
	}
	
	// compare two arrays, return the number of differences
	function compareArrays(array1, array2, dontConvert) {
	    var len = Math.min(array1.length, array2.length),
	        lengthDiff = Math.abs(array1.length - array2.length),
	        diffs = 0,
	        i;
	    for (i = 0; i < len; i++) {
	        if ((dontConvert && array1[i] !== array2[i]) ||
	            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	            diffs++;
	        }
	    }
	    return diffs + lengthDiff;
	}
	
	function warn(msg) {
	    if (hooks.suppressDeprecationWarnings === false &&
	            (typeof console !==  'undefined') && console.warn) {
	        console.warn('Deprecation warning: ' + msg);
	    }
	}
	
	function deprecate(msg, fn) {
	    var firstTime = true;
	
	    return extend(function () {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(null, msg);
	        }
	        if (firstTime) {
	            var args = [];
	            var arg;
	            for (var i = 0; i < arguments.length; i++) {
	                arg = '';
	                if (typeof arguments[i] === 'object') {
	                    arg += '\n[' + i + '] ';
	                    for (var key in arguments[0]) {
	                        arg += key + ': ' + arguments[0][key] + ', ';
	                    }
	                    arg = arg.slice(0, -2); // Remove trailing comma and space
	                } else {
	                    arg = arguments[i];
	                }
	                args.push(arg);
	            }
	            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	            firstTime = false;
	        }
	        return fn.apply(this, arguments);
	    }, fn);
	}
	
	var deprecations = {};
	
	function deprecateSimple(name, msg) {
	    if (hooks.deprecationHandler != null) {
	        hooks.deprecationHandler(name, msg);
	    }
	    if (!deprecations[name]) {
	        warn(msg);
	        deprecations[name] = true;
	    }
	}
	
	hooks.suppressDeprecationWarnings = false;
	hooks.deprecationHandler = null;
	
	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}
	
	function set (config) {
	    var prop, i;
	    for (i in config) {
	        prop = config[i];
	        if (isFunction(prop)) {
	            this[i] = prop;
	        } else {
	            this['_' + i] = prop;
	        }
	    }
	    this._config = config;
	    // Lenient ordinal parsing accepts just a number in addition to
	    // number + (possibly) stuff coming from _ordinalParseLenient.
	    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
	}
	
	function mergeConfigs(parentConfig, childConfig) {
	    var res = extend({}, parentConfig), prop;
	    for (prop in childConfig) {
	        if (hasOwnProp(childConfig, prop)) {
	            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                res[prop] = {};
	                extend(res[prop], parentConfig[prop]);
	                extend(res[prop], childConfig[prop]);
	            } else if (childConfig[prop] != null) {
	                res[prop] = childConfig[prop];
	            } else {
	                delete res[prop];
	            }
	        }
	    }
	    for (prop in parentConfig) {
	        if (hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])) {
	            // make sure changes to properties don't modify parent config
	            res[prop] = extend({}, res[prop]);
	        }
	    }
	    return res;
	}
	
	function Locale(config) {
	    if (config != null) {
	        this.set(config);
	    }
	}
	
	var keys;
	
	if (Object.keys) {
	    keys = Object.keys;
	} else {
	    keys = function (obj) {
	        var i, res = [];
	        for (i in obj) {
	            if (hasOwnProp(obj, i)) {
	                res.push(i);
	            }
	        }
	        return res;
	    };
	}
	
	var keys$1 = keys;
	
	var defaultCalendar = {
	    sameDay : '[Today at] LT',
	    nextDay : '[Tomorrow at] LT',
	    nextWeek : 'dddd [at] LT',
	    lastDay : '[Yesterday at] LT',
	    lastWeek : '[Last] dddd [at] LT',
	    sameElse : 'L'
	};
	
	function calendar (key, mom, now) {
	    var output = this._calendar[key] || this._calendar['sameElse'];
	    return isFunction(output) ? output.call(mom, now) : output;
	}
	
	var defaultLongDateFormat = {
	    LTS  : 'h:mm:ss A',
	    LT   : 'h:mm A',
	    L    : 'MM/DD/YYYY',
	    LL   : 'MMMM D, YYYY',
	    LLL  : 'MMMM D, YYYY h:mm A',
	    LLLL : 'dddd, MMMM D, YYYY h:mm A'
	};
	
	function longDateFormat (key) {
	    var format = this._longDateFormat[key],
	        formatUpper = this._longDateFormat[key.toUpperCase()];
	
	    if (format || !formatUpper) {
	        return format;
	    }
	
	    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	        return val.slice(1);
	    });
	
	    return this._longDateFormat[key];
	}
	
	var defaultInvalidDate = 'Invalid date';
	
	function invalidDate () {
	    return this._invalidDate;
	}
	
	var defaultOrdinal = '%d';
	var defaultOrdinalParse = /\d{1,2}/;
	
	function ordinal (number) {
	    return this._ordinal.replace('%d', number);
	}
	
	var defaultRelativeTime = {
	    future : 'in %s',
	    past   : '%s ago',
	    s  : 'a few seconds',
	    m  : 'a minute',
	    mm : '%d minutes',
	    h  : 'an hour',
	    hh : '%d hours',
	    d  : 'a day',
	    dd : '%d days',
	    M  : 'a month',
	    MM : '%d months',
	    y  : 'a year',
	    yy : '%d years'
	};
	
	function relativeTime (number, withoutSuffix, string, isFuture) {
	    var output = this._relativeTime[string];
	    return (isFunction(output)) ?
	        output(number, withoutSuffix, string, isFuture) :
	        output.replace(/%d/i, number);
	}
	
	function pastFuture (diff, output) {
	    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	}
	
	var aliases = {};
	
	function addUnitAlias (unit, shorthand) {
	    var lowerCase = unit.toLowerCase();
	    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}
	
	function normalizeUnits(units) {
	    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}
	
	function normalizeObjectUnits(inputObject) {
	    var normalizedInput = {},
	        normalizedProp,
	        prop;
	
	    for (prop in inputObject) {
	        if (hasOwnProp(inputObject, prop)) {
	            normalizedProp = normalizeUnits(prop);
	            if (normalizedProp) {
	                normalizedInput[normalizedProp] = inputObject[prop];
	            }
	        }
	    }
	
	    return normalizedInput;
	}
	
	var priorities = {};
	
	function addUnitPriority(unit, priority) {
	    priorities[unit] = priority;
	}
	
	function getPrioritizedUnits(unitsObj) {
	    var units = [];
	    for (var u in unitsObj) {
	        units.push({unit: u, priority: priorities[u]});
	    }
	    units.sort(function (a, b) {
	        return a.priority - b.priority;
	    });
	    return units;
	}
	
	function makeGetSet (unit, keepTime) {
	    return function (value) {
	        if (value != null) {
	            set$1(this, unit, value);
	            hooks.updateOffset(this, keepTime);
	            return this;
	        } else {
	            return get(this, unit);
	        }
	    };
	}
	
	function get (mom, unit) {
	    return mom.isValid() ?
	        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	}
	
	function set$1 (mom, unit, value) {
	    if (mom.isValid()) {
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	    }
	}
	
	// MOMENTS
	
	function stringGet (units) {
	    units = normalizeUnits(units);
	    if (isFunction(this[units])) {
	        return this[units]();
	    }
	    return this;
	}
	
	
	function stringSet (units, value) {
	    if (typeof units === 'object') {
	        units = normalizeObjectUnits(units);
	        var prioritized = getPrioritizedUnits(units);
	        for (var i = 0; i < prioritized.length; i++) {
	            this[prioritized[i].unit](units[prioritized[i].unit]);
	        }
	    } else {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units](value);
	        }
	    }
	    return this;
	}
	
	function zeroFill(number, targetLength, forceSign) {
	    var absNumber = '' + Math.abs(number),
	        zerosToFill = targetLength - absNumber.length,
	        sign = number >= 0;
	    return (sign ? (forceSign ? '+' : '') : '-') +
	        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	}
	
	var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
	
	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
	
	var formatFunctions = {};
	
	var formatTokenFunctions = {};
	
	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken (token, padded, ordinal, callback) {
	    var func = callback;
	    if (typeof callback === 'string') {
	        func = function () {
	            return this[callback]();
	        };
	    }
	    if (token) {
	        formatTokenFunctions[token] = func;
	    }
	    if (padded) {
	        formatTokenFunctions[padded[0]] = function () {
	            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	        };
	    }
	    if (ordinal) {
	        formatTokenFunctions[ordinal] = function () {
	            return this.localeData().ordinal(func.apply(this, arguments), token);
	        };
	    }
	}
	
	function removeFormattingTokens(input) {
	    if (input.match(/\[[\s\S]/)) {
	        return input.replace(/^\[|\]$/g, '');
	    }
	    return input.replace(/\\/g, '');
	}
	
	function makeFormatFunction(format) {
	    var array = format.match(formattingTokens), i, length;
	
	    for (i = 0, length = array.length; i < length; i++) {
	        if (formatTokenFunctions[array[i]]) {
	            array[i] = formatTokenFunctions[array[i]];
	        } else {
	            array[i] = removeFormattingTokens(array[i]);
	        }
	    }
	
	    return function (mom) {
	        var output = '', i;
	        for (i = 0; i < length; i++) {
	            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	        }
	        return output;
	    };
	}
	
	// format date using native date object
	function formatMoment(m, format) {
	    if (!m.isValid()) {
	        return m.localeData().invalidDate();
	    }
	
	    format = expandFormat(format, m.localeData());
	    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
	
	    return formatFunctions[format](m);
	}
	
	function expandFormat(format, locale) {
	    var i = 5;
	
	    function replaceLongDateFormatTokens(input) {
	        return locale.longDateFormat(input) || input;
	    }
	
	    localFormattingTokens.lastIndex = 0;
	    while (i >= 0 && localFormattingTokens.test(format)) {
	        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	        localFormattingTokens.lastIndex = 0;
	        i -= 1;
	    }
	
	    return format;
	}
	
	var match1         = /\d/;            //       0 - 9
	var match2         = /\d\d/;          //      00 - 99
	var match3         = /\d{3}/;         //     000 - 999
	var match4         = /\d{4}/;         //    0000 - 9999
	var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2      = /\d\d?/;         //       0 - 99
	var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	var match1to3      = /\d{1,3}/;       //       0 - 999
	var match1to4      = /\d{1,4}/;       //       0 - 9999
	var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999
	
	var matchUnsigned  = /\d+/;           //       0 - inf
	var matchSigned    = /[+-]?\d+/;      //    -inf - inf
	
	var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z
	
	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123
	
	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
	
	
	var regexes = {};
	
	function addRegexToken (token, regex, strictRegex) {
	    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	        return (isStrict && strictRegex) ? strictRegex : regex;
	    };
	}
	
	function getParseRegexForToken (token, config) {
	    if (!hasOwnProp(regexes, token)) {
	        return new RegExp(unescapeFormat(token));
	    }
	
	    return regexes[token](config._strict, config._locale);
	}
	
	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s) {
	    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	        return p1 || p2 || p3 || p4;
	    }));
	}
	
	function regexEscape(s) {
	    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	
	var tokens = {};
	
	function addParseToken (token, callback) {
	    var i, func = callback;
	    if (typeof token === 'string') {
	        token = [token];
	    }
	    if (isNumber(callback)) {
	        func = function (input, array) {
	            array[callback] = toInt(input);
	        };
	    }
	    for (i = 0; i < token.length; i++) {
	        tokens[token[i]] = func;
	    }
	}
	
	function addWeekParseToken (token, callback) {
	    addParseToken(token, function (input, array, config, token) {
	        config._w = config._w || {};
	        callback(input, config._w, config, token);
	    });
	}
	
	function addTimeToArrayFromToken(token, input, config) {
	    if (input != null && hasOwnProp(tokens, token)) {
	        tokens[token](input, config._a, config, token);
	    }
	}
	
	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;
	var WEEK = 7;
	var WEEKDAY = 8;
	
	var indexOf;
	
	if (Array.prototype.indexOf) {
	    indexOf = Array.prototype.indexOf;
	} else {
	    indexOf = function (o) {
	        // I know
	        var i;
	        for (i = 0; i < this.length; ++i) {
	            if (this[i] === o) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}
	
	var indexOf$1 = indexOf;
	
	function daysInMonth(year, month) {
	    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	}
	
	// FORMATTING
	
	addFormatToken('M', ['MM', 2], 'Mo', function () {
	    return this.month() + 1;
	});
	
	addFormatToken('MMM', 0, 0, function (format) {
	    return this.localeData().monthsShort(this, format);
	});
	
	addFormatToken('MMMM', 0, 0, function (format) {
	    return this.localeData().months(this, format);
	});
	
	// ALIASES
	
	addUnitAlias('month', 'M');
	
	// PRIORITY
	
	addUnitPriority('month', 8);
	
	// PARSING
	
	addRegexToken('M',    match1to2);
	addRegexToken('MM',   match1to2, match2);
	addRegexToken('MMM',  function (isStrict, locale) {
	    return locale.monthsShortRegex(isStrict);
	});
	addRegexToken('MMMM', function (isStrict, locale) {
	    return locale.monthsRegex(isStrict);
	});
	
	addParseToken(['M', 'MM'], function (input, array) {
	    array[MONTH] = toInt(input) - 1;
	});
	
	addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	    var month = config._locale.monthsParse(input, token, config._strict);
	    // if we didn't find a month name, mark the date as invalid.
	    if (month != null) {
	        array[MONTH] = month;
	    } else {
	        getParsingFlags(config).invalidMonth = input;
	    }
	});
	
	// LOCALES
	
	var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	function localeMonths (m, format) {
	    if (!m) {
	        return this._months;
	    }
	    return isArray(this._months) ? this._months[m.month()] :
	        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	}
	
	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	function localeMonthsShort (m, format) {
	    if (!m) {
	        return this._monthsShort;
	    }
	    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	}
	
	function handleStrictParse(monthName, format, strict) {
	    var i, ii, mom, llc = monthName.toLocaleLowerCase();
	    if (!this._monthsParse) {
	        // this is not used
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	        for (i = 0; i < 12; ++i) {
	            mom = createUTC([2000, i]);
	            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	        }
	    }
	
	    if (strict) {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}
	
	function localeMonthsParse (monthName, format, strict) {
	    var i, mom, regex;
	
	    if (this._monthsParseExact) {
	        return handleStrictParse.call(this, monthName, format, strict);
	    }
	
	    if (!this._monthsParse) {
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	    }
	
	    // TODO: add sorting
	    // Sorting makes sure if one month (or abbr) is a prefix of another
	    // see sorting in computeMonthsParse
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        if (strict && !this._longMonthsParse[i]) {
	            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	        }
	        if (!strict && !this._monthsParse[i]) {
	            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (!strict && this._monthsParse[i].test(monthName)) {
	            return i;
	        }
	    }
	}
	
	// MOMENTS
	
	function setMonth (mom, value) {
	    var dayOfMonth;
	
	    if (!mom.isValid()) {
	        // No op
	        return mom;
	    }
	
	    if (typeof value === 'string') {
	        if (/^\d+$/.test(value)) {
	            value = toInt(value);
	        } else {
	            value = mom.localeData().monthsParse(value);
	            // TODO: Another silent failure?
	            if (!isNumber(value)) {
	                return mom;
	            }
	        }
	    }
	
	    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	    return mom;
	}
	
	function getSetMonth (value) {
	    if (value != null) {
	        setMonth(this, value);
	        hooks.updateOffset(this, true);
	        return this;
	    } else {
	        return get(this, 'Month');
	    }
	}
	
	function getDaysInMonth () {
	    return daysInMonth(this.year(), this.month());
	}
	
	var defaultMonthsShortRegex = matchWord;
	function monthsShortRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsShortStrictRegex;
	        } else {
	            return this._monthsShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsShortRegex')) {
	            this._monthsShortRegex = defaultMonthsShortRegex;
	        }
	        return this._monthsShortStrictRegex && isStrict ?
	            this._monthsShortStrictRegex : this._monthsShortRegex;
	    }
	}
	
	var defaultMonthsRegex = matchWord;
	function monthsRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsStrictRegex;
	        } else {
	            return this._monthsRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            this._monthsRegex = defaultMonthsRegex;
	        }
	        return this._monthsStrictRegex && isStrict ?
	            this._monthsStrictRegex : this._monthsRegex;
	    }
	}
	
	function computeMonthsParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }
	
	    var shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom;
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        shortPieces.push(this.monthsShort(mom, ''));
	        longPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.monthsShort(mom, ''));
	    }
	    // Sorting makes sure if one month (or abbr) is a prefix of another it
	    // will match the longer piece.
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 12; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	    }
	    for (i = 0; i < 24; i++) {
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }
	
	    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._monthsShortRegex = this._monthsRegex;
	    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	}
	
	// FORMATTING
	
	addFormatToken('Y', 0, 0, function () {
	    var y = this.year();
	    return y <= 9999 ? '' + y : '+' + y;
	});
	
	addFormatToken(0, ['YY', 2], 0, function () {
	    return this.year() % 100;
	});
	
	addFormatToken(0, ['YYYY',   4],       0, 'year');
	addFormatToken(0, ['YYYYY',  5],       0, 'year');
	addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');
	
	// ALIASES
	
	addUnitAlias('year', 'y');
	
	// PRIORITIES
	
	addUnitPriority('year', 1);
	
	// PARSING
	
	addRegexToken('Y',      matchSigned);
	addRegexToken('YY',     match1to2, match2);
	addRegexToken('YYYY',   match1to4, match4);
	addRegexToken('YYYYY',  match1to6, match6);
	addRegexToken('YYYYYY', match1to6, match6);
	
	addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	addParseToken('YYYY', function (input, array) {
	    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	});
	addParseToken('YY', function (input, array) {
	    array[YEAR] = hooks.parseTwoDigitYear(input);
	});
	addParseToken('Y', function (input, array) {
	    array[YEAR] = parseInt(input, 10);
	});
	
	// HELPERS
	
	function daysInYear(year) {
	    return isLeapYear(year) ? 366 : 365;
	}
	
	function isLeapYear(year) {
	    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}
	
	// HOOKS
	
	hooks.parseTwoDigitYear = function (input) {
	    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	};
	
	// MOMENTS
	
	var getSetYear = makeGetSet('FullYear', true);
	
	function getIsLeapYear () {
	    return isLeapYear(this.year());
	}
	
	function createDate (y, m, d, h, M, s, ms) {
	    //can't just apply() to create a date:
	    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	    var date = new Date(y, m, d, h, M, s, ms);
	
	    //the date constructor remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	        date.setFullYear(y);
	    }
	    return date;
	}
	
	function createUTCDate (y) {
	    var date = new Date(Date.UTC.apply(null, arguments));
	
	    //the Date.UTC function remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	        date.setUTCFullYear(y);
	    }
	    return date;
	}
	
	// start-of-first-week - start-of-year
	function firstWeekOffset(year, dow, doy) {
	    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	        fwd = 7 + dow - doy,
	        // first-week day local weekday -- which local weekday is fwd
	        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
	
	    return -fwdlw + fwd - 1;
	}
	
	//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	    var localWeekday = (7 + weekday - dow) % 7,
	        weekOffset = firstWeekOffset(year, dow, doy),
	        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	        resYear, resDayOfYear;
	
	    if (dayOfYear <= 0) {
	        resYear = year - 1;
	        resDayOfYear = daysInYear(resYear) + dayOfYear;
	    } else if (dayOfYear > daysInYear(year)) {
	        resYear = year + 1;
	        resDayOfYear = dayOfYear - daysInYear(year);
	    } else {
	        resYear = year;
	        resDayOfYear = dayOfYear;
	    }
	
	    return {
	        year: resYear,
	        dayOfYear: resDayOfYear
	    };
	}
	
	function weekOfYear(mom, dow, doy) {
	    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	        resWeek, resYear;
	
	    if (week < 1) {
	        resYear = mom.year() - 1;
	        resWeek = week + weeksInYear(resYear, dow, doy);
	    } else if (week > weeksInYear(mom.year(), dow, doy)) {
	        resWeek = week - weeksInYear(mom.year(), dow, doy);
	        resYear = mom.year() + 1;
	    } else {
	        resYear = mom.year();
	        resWeek = week;
	    }
	
	    return {
	        week: resWeek,
	        year: resYear
	    };
	}
	
	function weeksInYear(year, dow, doy) {
	    var weekOffset = firstWeekOffset(year, dow, doy),
	        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	}
	
	// FORMATTING
	
	addFormatToken('w', ['ww', 2], 'wo', 'week');
	addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');
	
	// ALIASES
	
	addUnitAlias('week', 'w');
	addUnitAlias('isoWeek', 'W');
	
	// PRIORITIES
	
	addUnitPriority('week', 5);
	addUnitPriority('isoWeek', 5);
	
	// PARSING
	
	addRegexToken('w',  match1to2);
	addRegexToken('ww', match1to2, match2);
	addRegexToken('W',  match1to2);
	addRegexToken('WW', match1to2, match2);
	
	addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	    week[token.substr(0, 1)] = toInt(input);
	});
	
	// HELPERS
	
	// LOCALES
	
	function localeWeek (mom) {
	    return weekOfYear(mom, this._week.dow, this._week.doy).week;
	}
	
	var defaultLocaleWeek = {
	    dow : 0, // Sunday is the first day of the week.
	    doy : 6  // The week that contains Jan 1st is the first week of the year.
	};
	
	function localeFirstDayOfWeek () {
	    return this._week.dow;
	}
	
	function localeFirstDayOfYear () {
	    return this._week.doy;
	}
	
	// MOMENTS
	
	function getSetWeek (input) {
	    var week = this.localeData().week(this);
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}
	
	function getSetISOWeek (input) {
	    var week = weekOfYear(this, 1, 4).week;
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}
	
	// FORMATTING
	
	addFormatToken('d', 0, 'do', 'day');
	
	addFormatToken('dd', 0, 0, function (format) {
	    return this.localeData().weekdaysMin(this, format);
	});
	
	addFormatToken('ddd', 0, 0, function (format) {
	    return this.localeData().weekdaysShort(this, format);
	});
	
	addFormatToken('dddd', 0, 0, function (format) {
	    return this.localeData().weekdays(this, format);
	});
	
	addFormatToken('e', 0, 0, 'weekday');
	addFormatToken('E', 0, 0, 'isoWeekday');
	
	// ALIASES
	
	addUnitAlias('day', 'd');
	addUnitAlias('weekday', 'e');
	addUnitAlias('isoWeekday', 'E');
	
	// PRIORITY
	addUnitPriority('day', 11);
	addUnitPriority('weekday', 11);
	addUnitPriority('isoWeekday', 11);
	
	// PARSING
	
	addRegexToken('d',    match1to2);
	addRegexToken('e',    match1to2);
	addRegexToken('E',    match1to2);
	addRegexToken('dd',   function (isStrict, locale) {
	    return locale.weekdaysMinRegex(isStrict);
	});
	addRegexToken('ddd',   function (isStrict, locale) {
	    return locale.weekdaysShortRegex(isStrict);
	});
	addRegexToken('dddd',   function (isStrict, locale) {
	    return locale.weekdaysRegex(isStrict);
	});
	
	addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	    var weekday = config._locale.weekdaysParse(input, token, config._strict);
	    // if we didn't get a weekday name, mark the date as invalid
	    if (weekday != null) {
	        week.d = weekday;
	    } else {
	        getParsingFlags(config).invalidWeekday = input;
	    }
	});
	
	addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	    week[token] = toInt(input);
	});
	
	// HELPERS
	
	function parseWeekday(input, locale) {
	    if (typeof input !== 'string') {
	        return input;
	    }
	
	    if (!isNaN(input)) {
	        return parseInt(input, 10);
	    }
	
	    input = locale.weekdaysParse(input);
	    if (typeof input === 'number') {
	        return input;
	    }
	
	    return null;
	}
	
	function parseIsoWeekday(input, locale) {
	    if (typeof input === 'string') {
	        return locale.weekdaysParse(input) % 7 || 7;
	    }
	    return isNaN(input) ? null : input;
	}
	
	// LOCALES
	
	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	function localeWeekdays (m, format) {
	    if (!m) {
	        return this._weekdays;
	    }
	    return isArray(this._weekdays) ? this._weekdays[m.day()] :
	        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	}
	
	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	function localeWeekdaysShort (m) {
	    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	}
	
	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	function localeWeekdaysMin (m) {
	    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	}
	
	function handleStrictParse$1(weekdayName, format, strict) {
	    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._minWeekdaysParse = [];
	
	        for (i = 0; i < 7; ++i) {
	            mom = createUTC([2000, 1]).day(i);
	            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	        }
	    }
	
	    if (strict) {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}
	
	function localeWeekdaysParse (weekdayName, format, strict) {
	    var i, mom, regex;
	
	    if (this._weekdaysParseExact) {
	        return handleStrictParse$1.call(this, weekdayName, format, strict);
	    }
	
	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._minWeekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._fullWeekdaysParse = [];
	    }
	
	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already
	
	        mom = createUTC([2000, 1]).day(i);
	        if (strict && !this._fullWeekdaysParse[i]) {
	            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
	            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
	            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
	        }
	        if (!this._weekdaysParse[i]) {
	            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	            return i;
	        }
	    }
	}
	
	// MOMENTS
	
	function getSetDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	    if (input != null) {
	        input = parseWeekday(input, this.localeData());
	        return this.add(input - day, 'd');
	    } else {
	        return day;
	    }
	}
	
	function getSetLocaleDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	    return input == null ? weekday : this.add(input - weekday, 'd');
	}
	
	function getSetISODayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	
	    // behaves the same as moment#day except
	    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	    // as a setter, sunday should belong to the previous week.
	
	    if (input != null) {
	        var weekday = parseIsoWeekday(input, this.localeData());
	        return this.day(this.day() % 7 ? weekday : weekday - 7);
	    } else {
	        return this.day() || 7;
	    }
	}
	
	var defaultWeekdaysRegex = matchWord;
	function weekdaysRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysStrictRegex;
	        } else {
	            return this._weekdaysRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            this._weekdaysRegex = defaultWeekdaysRegex;
	        }
	        return this._weekdaysStrictRegex && isStrict ?
	            this._weekdaysStrictRegex : this._weekdaysRegex;
	    }
	}
	
	var defaultWeekdaysShortRegex = matchWord;
	function weekdaysShortRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysShortStrictRegex;
	        } else {
	            return this._weekdaysShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	        }
	        return this._weekdaysShortStrictRegex && isStrict ?
	            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	    }
	}
	
	var defaultWeekdaysMinRegex = matchWord;
	function weekdaysMinRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysMinStrictRegex;
	        } else {
	            return this._weekdaysMinRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	        }
	        return this._weekdaysMinStrictRegex && isStrict ?
	            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	    }
	}
	
	
	function computeWeekdaysParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }
	
	    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom, minp, shortp, longp;
	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, 1]).day(i);
	        minp = this.weekdaysMin(mom, '');
	        shortp = this.weekdaysShort(mom, '');
	        longp = this.weekdays(mom, '');
	        minPieces.push(minp);
	        shortPieces.push(shortp);
	        longPieces.push(longp);
	        mixedPieces.push(minp);
	        mixedPieces.push(shortp);
	        mixedPieces.push(longp);
	    }
	    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	    // will match the longer piece.
	    minPieces.sort(cmpLenRev);
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 7; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }
	
	    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._weekdaysShortRegex = this._weekdaysRegex;
	    this._weekdaysMinRegex = this._weekdaysRegex;
	
	    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	}
	
	// FORMATTING
	
	function hFormat() {
	    return this.hours() % 12 || 12;
	}
	
	function kFormat() {
	    return this.hours() || 24;
	}
	
	addFormatToken('H', ['HH', 2], 0, 'hour');
	addFormatToken('h', ['hh', 2], 0, hFormat);
	addFormatToken('k', ['kk', 2], 0, kFormat);
	
	addFormatToken('hmm', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	});
	
	addFormatToken('hmmss', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});
	
	addFormatToken('Hmm', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2);
	});
	
	addFormatToken('Hmmss', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});
	
	function meridiem (token, lowercase) {
	    addFormatToken(token, 0, 0, function () {
	        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	    });
	}
	
	meridiem('a', true);
	meridiem('A', false);
	
	// ALIASES
	
	addUnitAlias('hour', 'h');
	
	// PRIORITY
	addUnitPriority('hour', 13);
	
	// PARSING
	
	function matchMeridiem (isStrict, locale) {
	    return locale._meridiemParse;
	}
	
	addRegexToken('a',  matchMeridiem);
	addRegexToken('A',  matchMeridiem);
	addRegexToken('H',  match1to2);
	addRegexToken('h',  match1to2);
	addRegexToken('HH', match1to2, match2);
	addRegexToken('hh', match1to2, match2);
	
	addRegexToken('hmm', match3to4);
	addRegexToken('hmmss', match5to6);
	addRegexToken('Hmm', match3to4);
	addRegexToken('Hmmss', match5to6);
	
	addParseToken(['H', 'HH'], HOUR);
	addParseToken(['a', 'A'], function (input, array, config) {
	    config._isPm = config._locale.isPM(input);
	    config._meridiem = input;
	});
	addParseToken(['h', 'hh'], function (input, array, config) {
	    array[HOUR] = toInt(input);
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('Hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	});
	addParseToken('Hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	});
	
	// LOCALES
	
	function localeIsPM (input) {
	    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	    // Using charAt should be more compatible.
	    return ((input + '').toLowerCase().charAt(0) === 'p');
	}
	
	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem (hours, minutes, isLower) {
	    if (hours > 11) {
	        return isLower ? 'pm' : 'PM';
	    } else {
	        return isLower ? 'am' : 'AM';
	    }
	}
	
	
	// MOMENTS
	
	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet('Hours', true);
	
	// months
	// week
	// weekdays
	// meridiem
	var baseConfig = {
	    calendar: defaultCalendar,
	    longDateFormat: defaultLongDateFormat,
	    invalidDate: defaultInvalidDate,
	    ordinal: defaultOrdinal,
	    ordinalParse: defaultOrdinalParse,
	    relativeTime: defaultRelativeTime,
	
	    months: defaultLocaleMonths,
	    monthsShort: defaultLocaleMonthsShort,
	
	    week: defaultLocaleWeek,
	
	    weekdays: defaultLocaleWeekdays,
	    weekdaysMin: defaultLocaleWeekdaysMin,
	    weekdaysShort: defaultLocaleWeekdaysShort,
	
	    meridiemParse: defaultLocaleMeridiemParse
	};
	
	// internal storage for locale config files
	var locales = {};
	var localeFamilies = {};
	var globalLocale;
	
	function normalizeLocale(key) {
	    return key ? key.toLowerCase().replace('_', '-') : key;
	}
	
	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names) {
	    var i = 0, j, next, locale, split;
	
	    while (i < names.length) {
	        split = normalizeLocale(names[i]).split('-');
	        j = split.length;
	        next = normalizeLocale(names[i + 1]);
	        next = next ? next.split('-') : null;
	        while (j > 0) {
	            locale = loadLocale(split.slice(0, j).join('-'));
	            if (locale) {
	                return locale;
	            }
	            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                //the next array item is better than a shallower substring of this one
	                break;
	            }
	            j--;
	        }
	        i++;
	    }
	    return null;
	}
	
	function loadLocale(name) {
	    var oldLocale = null;
	    // TODO: Find a better way to register and load all the locales in Node
	    if (!locales[name] && (typeof module !== 'undefined') &&
	            module && module.exports) {
	        try {
	            oldLocale = globalLocale._abbr;
	            __webpack_require__(280)("./" + name);
	            // because defineLocale currently also sets the global locale, we
	            // want to undo that for lazy loaded locales
	            getSetGlobalLocale(oldLocale);
	        } catch (e) { }
	    }
	    return locales[name];
	}
	
	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function getSetGlobalLocale (key, values) {
	    var data;
	    if (key) {
	        if (isUndefined(values)) {
	            data = getLocale(key);
	        }
	        else {
	            data = defineLocale(key, values);
	        }
	
	        if (data) {
	            // moment.duration._locale = moment._locale = data;
	            globalLocale = data;
	        }
	    }
	
	    return globalLocale._abbr;
	}
	
	function defineLocale (name, config) {
	    if (config !== null) {
	        var parentConfig = baseConfig;
	        config.abbr = name;
	        if (locales[name] != null) {
	            deprecateSimple('defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                    'an existing locale. moment.defineLocale(localeName, ' +
	                    'config) should only be used for creating a new locale ' +
	                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	            parentConfig = locales[name]._config;
	        } else if (config.parentLocale != null) {
	            if (locales[config.parentLocale] != null) {
	                parentConfig = locales[config.parentLocale]._config;
	            } else {
	                if (!localeFamilies[config.parentLocale]) {
	                    localeFamilies[config.parentLocale] = [];
	                }
	                localeFamilies[config.parentLocale].push({
	                    name: name,
	                    config: config
	                });
	                return null;
	            }
	        }
	        locales[name] = new Locale(mergeConfigs(parentConfig, config));
	
	        if (localeFamilies[name]) {
	            localeFamilies[name].forEach(function (x) {
	                defineLocale(x.name, x.config);
	            });
	        }
	
	        // backwards compat for now: also set the locale
	        // make sure we set the locale AFTER all child locales have been
	        // created, so we won't end up with the child locale set.
	        getSetGlobalLocale(name);
	
	
	        return locales[name];
	    } else {
	        // useful for testing
	        delete locales[name];
	        return null;
	    }
	}
	
	function updateLocale(name, config) {
	    if (config != null) {
	        var locale, parentConfig = baseConfig;
	        // MERGE
	        if (locales[name] != null) {
	            parentConfig = locales[name]._config;
	        }
	        config = mergeConfigs(parentConfig, config);
	        locale = new Locale(config);
	        locale.parentLocale = locales[name];
	        locales[name] = locale;
	
	        // backwards compat for now: also set the locale
	        getSetGlobalLocale(name);
	    } else {
	        // pass null for config to unupdate, useful for tests
	        if (locales[name] != null) {
	            if (locales[name].parentLocale != null) {
	                locales[name] = locales[name].parentLocale;
	            } else if (locales[name] != null) {
	                delete locales[name];
	            }
	        }
	    }
	    return locales[name];
	}
	
	// returns locale data
	function getLocale (key) {
	    var locale;
	
	    if (key && key._locale && key._locale._abbr) {
	        key = key._locale._abbr;
	    }
	
	    if (!key) {
	        return globalLocale;
	    }
	
	    if (!isArray(key)) {
	        //short-circuit everything else
	        locale = loadLocale(key);
	        if (locale) {
	            return locale;
	        }
	        key = [key];
	    }
	
	    return chooseLocale(key);
	}
	
	function listLocales() {
	    return keys$1(locales);
	}
	
	function checkOverflow (m) {
	    var overflow;
	    var a = m._a;
	
	    if (a && getParsingFlags(m).overflow === -2) {
	        overflow =
	            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	            -1;
	
	        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	            overflow = DATE;
	        }
	        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	            overflow = WEEK;
	        }
	        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	            overflow = WEEKDAY;
	        }
	
	        getParsingFlags(m).overflow = overflow;
	    }
	
	    return m;
	}
	
	// iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	
	var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;
	
	var isoDates = [
	    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	    ['YYYY-DDD', /\d{4}-\d{3}/],
	    ['YYYY-MM', /\d{4}-\d\d/, false],
	    ['YYYYYYMMDD', /[+-]\d{10}/],
	    ['YYYYMMDD', /\d{8}/],
	    // YYYYMM is NOT allowed by the standard
	    ['GGGG[W]WWE', /\d{4}W\d{3}/],
	    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	    ['YYYYDDD', /\d{7}/]
	];
	
	// iso time formats and regexes
	var isoTimes = [
	    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	    ['HH:mm', /\d\d:\d\d/],
	    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	    ['HHmmss', /\d\d\d\d\d\d/],
	    ['HHmm', /\d\d\d\d/],
	    ['HH', /\d\d/]
	];
	
	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;
	
	// date from iso format
	function configFromISO(config) {
	    var i, l,
	        string = config._i,
	        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	        allowTime, dateFormat, timeFormat, tzFormat;
	
	    if (match) {
	        getParsingFlags(config).iso = true;
	
	        for (i = 0, l = isoDates.length; i < l; i++) {
	            if (isoDates[i][1].exec(match[1])) {
	                dateFormat = isoDates[i][0];
	                allowTime = isoDates[i][2] !== false;
	                break;
	            }
	        }
	        if (dateFormat == null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[3]) {
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(match[3])) {
	                    // match[2] should be 'T' or space
	                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                    break;
	                }
	            }
	            if (timeFormat == null) {
	                config._isValid = false;
	                return;
	            }
	        }
	        if (!allowTime && timeFormat != null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[4]) {
	            if (tzRegex.exec(match[4])) {
	                tzFormat = 'Z';
	            } else {
	                config._isValid = false;
	                return;
	            }
	        }
	        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	        configFromStringAndFormat(config);
	    } else {
	        config._isValid = false;
	    }
	}
	
	// date from iso format or fallback
	function configFromString(config) {
	    var matched = aspNetJsonRegex.exec(config._i);
	
	    if (matched !== null) {
	        config._d = new Date(+matched[1]);
	        return;
	    }
	
	    configFromISO(config);
	    if (config._isValid === false) {
	        delete config._isValid;
	        hooks.createFromInputFallback(config);
	    }
	}
	
	hooks.createFromInputFallback = deprecate(
	    'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
	    'which is not reliable across all browsers and versions. Non ISO date formats are ' +
	    'discouraged and will be removed in an upcoming major release. Please refer to ' +
	    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	    function (config) {
	        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	    }
	);
	
	// Pick the first defined of two or three arguments.
	function defaults(a, b, c) {
	    if (a != null) {
	        return a;
	    }
	    if (b != null) {
	        return b;
	    }
	    return c;
	}
	
	function currentDateArray(config) {
	    // hooks is actually the exported moment object
	    var nowValue = new Date(hooks.now());
	    if (config._useUTC) {
	        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	    }
	    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	}
	
	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray (config) {
	    var i, date, input = [], currentDate, yearToUse;
	
	    if (config._d) {
	        return;
	    }
	
	    currentDate = currentDateArray(config);
	
	    //compute day of the year from weeks and weekdays
	    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	        dayOfYearFromWeekInfo(config);
	    }
	
	    //if the day of the year is set, figure out what it is
	    if (config._dayOfYear) {
	        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
	
	        if (config._dayOfYear > daysInYear(yearToUse)) {
	            getParsingFlags(config)._overflowDayOfYear = true;
	        }
	
	        date = createUTCDate(yearToUse, 0, config._dayOfYear);
	        config._a[MONTH] = date.getUTCMonth();
	        config._a[DATE] = date.getUTCDate();
	    }
	
	    // Default to current date.
	    // * if no year, month, day of month are given, default to today
	    // * if day of month is given, default month and year
	    // * if month is given, default only year
	    // * if year is given, don't default anything
	    for (i = 0; i < 3 && config._a[i] == null; ++i) {
	        config._a[i] = input[i] = currentDate[i];
	    }
	
	    // Zero out whatever was not defaulted, including time
	    for (; i < 7; i++) {
	        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	    }
	
	    // Check for 24:00:00.000
	    if (config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0) {
	        config._nextDay = true;
	        config._a[HOUR] = 0;
	    }
	
	    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	    // Apply timezone offset from input. The actual utcOffset can be changed
	    // with parseZone.
	    if (config._tzm != null) {
	        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	    }
	
	    if (config._nextDay) {
	        config._a[HOUR] = 24;
	    }
	}
	
	function dayOfYearFromWeekInfo(config) {
	    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;
	
	    w = config._w;
	    if (w.GG != null || w.W != null || w.E != null) {
	        dow = 1;
	        doy = 4;
	
	        // TODO: We need to take the current isoWeekYear, but that depends on
	        // how we interpret now (local, utc, fixed offset). So create
	        // a now version of current config (take local/utc/offset flags, and
	        // create now).
	        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
	        week = defaults(w.W, 1);
	        weekday = defaults(w.E, 1);
	        if (weekday < 1 || weekday > 7) {
	            weekdayOverflow = true;
	        }
	    } else {
	        dow = config._locale._week.dow;
	        doy = config._locale._week.doy;
	
	        var curWeek = weekOfYear(createLocal(), dow, doy);
	
	        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
	
	        // Default to current week.
	        week = defaults(w.w, curWeek.week);
	
	        if (w.d != null) {
	            // weekday -- low day numbers are considered next week
	            weekday = w.d;
	            if (weekday < 0 || weekday > 6) {
	                weekdayOverflow = true;
	            }
	        } else if (w.e != null) {
	            // local weekday -- counting starts from begining of week
	            weekday = w.e + dow;
	            if (w.e < 0 || w.e > 6) {
	                weekdayOverflow = true;
	            }
	        } else {
	            // default to begining of week
	            weekday = dow;
	        }
	    }
	    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	        getParsingFlags(config)._overflowWeeks = true;
	    } else if (weekdayOverflow != null) {
	        getParsingFlags(config)._overflowWeekday = true;
	    } else {
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }
	}
	
	// constant that refers to the ISO standard
	hooks.ISO_8601 = function () {};
	
	// date from string and format string
	function configFromStringAndFormat(config) {
	    // TODO: Move this to another part of the creation flow to prevent circular deps
	    if (config._f === hooks.ISO_8601) {
	        configFromISO(config);
	        return;
	    }
	
	    config._a = [];
	    getParsingFlags(config).empty = true;
	
	    // This array is used to make a Date, either with `new Date` or `Date.UTC`
	    var string = '' + config._i,
	        i, parsedInput, tokens, token, skipped,
	        stringLength = string.length,
	        totalParsedInputLength = 0;
	
	    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
	
	    for (i = 0; i < tokens.length; i++) {
	        token = tokens[i];
	        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	        // console.log('token', token, 'parsedInput', parsedInput,
	        //         'regex', getParseRegexForToken(token, config));
	        if (parsedInput) {
	            skipped = string.substr(0, string.indexOf(parsedInput));
	            if (skipped.length > 0) {
	                getParsingFlags(config).unusedInput.push(skipped);
	            }
	            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	            totalParsedInputLength += parsedInput.length;
	        }
	        // don't parse if it's not a known token
	        if (formatTokenFunctions[token]) {
	            if (parsedInput) {
	                getParsingFlags(config).empty = false;
	            }
	            else {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	            addTimeToArrayFromToken(token, parsedInput, config);
	        }
	        else if (config._strict && !parsedInput) {
	            getParsingFlags(config).unusedTokens.push(token);
	        }
	    }
	
	    // add remaining unparsed input length to the string
	    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	    if (string.length > 0) {
	        getParsingFlags(config).unusedInput.push(string);
	    }
	
	    // clear _12h flag if hour is <= 12
	    if (config._a[HOUR] <= 12 &&
	        getParsingFlags(config).bigHour === true &&
	        config._a[HOUR] > 0) {
	        getParsingFlags(config).bigHour = undefined;
	    }
	
	    getParsingFlags(config).parsedDateParts = config._a.slice(0);
	    getParsingFlags(config).meridiem = config._meridiem;
	    // handle meridiem
	    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
	
	    configFromArray(config);
	    checkOverflow(config);
	}
	
	
	function meridiemFixWrap (locale, hour, meridiem) {
	    var isPm;
	
	    if (meridiem == null) {
	        // nothing to do
	        return hour;
	    }
	    if (locale.meridiemHour != null) {
	        return locale.meridiemHour(hour, meridiem);
	    } else if (locale.isPM != null) {
	        // Fallback
	        isPm = locale.isPM(meridiem);
	        if (isPm && hour < 12) {
	            hour += 12;
	        }
	        if (!isPm && hour === 12) {
	            hour = 0;
	        }
	        return hour;
	    } else {
	        // this is not supposed to happen
	        return hour;
	    }
	}
	
	// date from string and array of format strings
	function configFromStringAndArray(config) {
	    var tempConfig,
	        bestMoment,
	
	        scoreToBeat,
	        i,
	        currentScore;
	
	    if (config._f.length === 0) {
	        getParsingFlags(config).invalidFormat = true;
	        config._d = new Date(NaN);
	        return;
	    }
	
	    for (i = 0; i < config._f.length; i++) {
	        currentScore = 0;
	        tempConfig = copyConfig({}, config);
	        if (config._useUTC != null) {
	            tempConfig._useUTC = config._useUTC;
	        }
	        tempConfig._f = config._f[i];
	        configFromStringAndFormat(tempConfig);
	
	        if (!isValid(tempConfig)) {
	            continue;
	        }
	
	        // if there is any input that was not parsed add a penalty for that format
	        currentScore += getParsingFlags(tempConfig).charsLeftOver;
	
	        //or tokens
	        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
	
	        getParsingFlags(tempConfig).score = currentScore;
	
	        if (scoreToBeat == null || currentScore < scoreToBeat) {
	            scoreToBeat = currentScore;
	            bestMoment = tempConfig;
	        }
	    }
	
	    extend(config, bestMoment || tempConfig);
	}
	
	function configFromObject(config) {
	    if (config._d) {
	        return;
	    }
	
	    var i = normalizeObjectUnits(config._i);
	    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	        return obj && parseInt(obj, 10);
	    });
	
	    configFromArray(config);
	}
	
	function createFromConfig (config) {
	    var res = new Moment(checkOverflow(prepareConfig(config)));
	    if (res._nextDay) {
	        // Adding is smart enough around DST
	        res.add(1, 'd');
	        res._nextDay = undefined;
	    }
	
	    return res;
	}
	
	function prepareConfig (config) {
	    var input = config._i,
	        format = config._f;
	
	    config._locale = config._locale || getLocale(config._l);
	
	    if (input === null || (format === undefined && input === '')) {
	        return createInvalid({nullInput: true});
	    }
	
	    if (typeof input === 'string') {
	        config._i = input = config._locale.preparse(input);
	    }
	
	    if (isMoment(input)) {
	        return new Moment(checkOverflow(input));
	    } else if (isDate(input)) {
	        config._d = input;
	    } else if (isArray(format)) {
	        configFromStringAndArray(config);
	    } else if (format) {
	        configFromStringAndFormat(config);
	    }  else {
	        configFromInput(config);
	    }
	
	    if (!isValid(config)) {
	        config._d = null;
	    }
	
	    return config;
	}
	
	function configFromInput(config) {
	    var input = config._i;
	    if (input === undefined) {
	        config._d = new Date(hooks.now());
	    } else if (isDate(input)) {
	        config._d = new Date(input.valueOf());
	    } else if (typeof input === 'string') {
	        configFromString(config);
	    } else if (isArray(input)) {
	        config._a = map(input.slice(0), function (obj) {
	            return parseInt(obj, 10);
	        });
	        configFromArray(config);
	    } else if (typeof(input) === 'object') {
	        configFromObject(config);
	    } else if (isNumber(input)) {
	        // from milliseconds
	        config._d = new Date(input);
	    } else {
	        hooks.createFromInputFallback(config);
	    }
	}
	
	function createLocalOrUTC (input, format, locale, strict, isUTC) {
	    var c = {};
	
	    if (locale === true || locale === false) {
	        strict = locale;
	        locale = undefined;
	    }
	
	    if ((isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)) {
	        input = undefined;
	    }
	    // object construction must be done this way.
	    // https://github.com/moment/moment/issues/1423
	    c._isAMomentObject = true;
	    c._useUTC = c._isUTC = isUTC;
	    c._l = locale;
	    c._i = input;
	    c._f = format;
	    c._strict = strict;
	
	    return createFromConfig(c);
	}
	
	function createLocal (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, false);
	}
	
	var prototypeMin = deprecate(
	    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other < this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);
	
	var prototypeMax = deprecate(
	    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other > this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);
	
	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn, moments) {
	    var res, i;
	    if (moments.length === 1 && isArray(moments[0])) {
	        moments = moments[0];
	    }
	    if (!moments.length) {
	        return createLocal();
	    }
	    res = moments[0];
	    for (i = 1; i < moments.length; ++i) {
	        if (!moments[i].isValid() || moments[i][fn](res)) {
	            res = moments[i];
	        }
	    }
	    return res;
	}
	
	// TODO: Use [].sort instead?
	function min () {
	    var args = [].slice.call(arguments, 0);
	
	    return pickBy('isBefore', args);
	}
	
	function max () {
	    var args = [].slice.call(arguments, 0);
	
	    return pickBy('isAfter', args);
	}
	
	var now = function () {
	    return Date.now ? Date.now() : +(new Date());
	};
	
	function Duration (duration) {
	    var normalizedInput = normalizeObjectUnits(duration),
	        years = normalizedInput.year || 0,
	        quarters = normalizedInput.quarter || 0,
	        months = normalizedInput.month || 0,
	        weeks = normalizedInput.week || 0,
	        days = normalizedInput.day || 0,
	        hours = normalizedInput.hour || 0,
	        minutes = normalizedInput.minute || 0,
	        seconds = normalizedInput.second || 0,
	        milliseconds = normalizedInput.millisecond || 0;
	
	    // representation for dateAddRemove
	    this._milliseconds = +milliseconds +
	        seconds * 1e3 + // 1000
	        minutes * 6e4 + // 1000 * 60
	        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	    // Because of dateAddRemove treats 24 hours as different from a
	    // day when working around DST, we need to store them separately
	    this._days = +days +
	        weeks * 7;
	    // It is impossible translate months into days without knowing
	    // which months you are are talking about, so we have to store
	    // it separately.
	    this._months = +months +
	        quarters * 3 +
	        years * 12;
	
	    this._data = {};
	
	    this._locale = getLocale();
	
	    this._bubble();
	}
	
	function isDuration (obj) {
	    return obj instanceof Duration;
	}
	
	function absRound (number) {
	    if (number < 0) {
	        return Math.round(-1 * number) * -1;
	    } else {
	        return Math.round(number);
	    }
	}
	
	// FORMATTING
	
	function offset (token, separator) {
	    addFormatToken(token, 0, 0, function () {
	        var offset = this.utcOffset();
	        var sign = '+';
	        if (offset < 0) {
	            offset = -offset;
	            sign = '-';
	        }
	        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	    });
	}
	
	offset('Z', ':');
	offset('ZZ', '');
	
	// PARSING
	
	addRegexToken('Z',  matchShortOffset);
	addRegexToken('ZZ', matchShortOffset);
	addParseToken(['Z', 'ZZ'], function (input, array, config) {
	    config._useUTC = true;
	    config._tzm = offsetFromString(matchShortOffset, input);
	});
	
	// HELPERS
	
	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;
	
	function offsetFromString(matcher, string) {
	    var matches = (string || '').match(matcher);
	
	    if (matches === null) {
	        return null;
	    }
	
	    var chunk   = matches[matches.length - 1] || [];
	    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	    var minutes = +(parts[1] * 60) + toInt(parts[2]);
	
	    return minutes === 0 ?
	      0 :
	      parts[0] === '+' ? minutes : -minutes;
	}
	
	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input, model) {
	    var res, diff;
	    if (model._isUTC) {
	        res = model.clone();
	        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
	        // Use low-level api, because this fn is low-level api.
	        res._d.setTime(res._d.valueOf() + diff);
	        hooks.updateOffset(res, false);
	        return res;
	    } else {
	        return createLocal(input).local();
	    }
	}
	
	function getDateOffset (m) {
	    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	    // https://github.com/moment/moment/pull/1871
	    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	}
	
	// HOOKS
	
	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	hooks.updateOffset = function () {};
	
	// MOMENTS
	
	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset (input, keepLocalTime) {
	    var offset = this._offset || 0,
	        localAdjust;
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    if (input != null) {
	        if (typeof input === 'string') {
	            input = offsetFromString(matchShortOffset, input);
	            if (input === null) {
	                return this;
	            }
	        } else if (Math.abs(input) < 16) {
	            input = input * 60;
	        }
	        if (!this._isUTC && keepLocalTime) {
	            localAdjust = getDateOffset(this);
	        }
	        this._offset = input;
	        this._isUTC = true;
	        if (localAdjust != null) {
	            this.add(localAdjust, 'm');
	        }
	        if (offset !== input) {
	            if (!keepLocalTime || this._changeInProgress) {
	                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
	            } else if (!this._changeInProgress) {
	                this._changeInProgress = true;
	                hooks.updateOffset(this, true);
	                this._changeInProgress = null;
	            }
	        }
	        return this;
	    } else {
	        return this._isUTC ? offset : getDateOffset(this);
	    }
	}
	
	function getSetZone (input, keepLocalTime) {
	    if (input != null) {
	        if (typeof input !== 'string') {
	            input = -input;
	        }
	
	        this.utcOffset(input, keepLocalTime);
	
	        return this;
	    } else {
	        return -this.utcOffset();
	    }
	}
	
	function setOffsetToUTC (keepLocalTime) {
	    return this.utcOffset(0, keepLocalTime);
	}
	
	function setOffsetToLocal (keepLocalTime) {
	    if (this._isUTC) {
	        this.utcOffset(0, keepLocalTime);
	        this._isUTC = false;
	
	        if (keepLocalTime) {
	            this.subtract(getDateOffset(this), 'm');
	        }
	    }
	    return this;
	}
	
	function setOffsetToParsedOffset () {
	    if (this._tzm != null) {
	        this.utcOffset(this._tzm);
	    } else if (typeof this._i === 'string') {
	        var tZone = offsetFromString(matchOffset, this._i);
	        if (tZone != null) {
	            this.utcOffset(tZone);
	        }
	        else {
	            this.utcOffset(0, true);
	        }
	    }
	    return this;
	}
	
	function hasAlignedHourOffset (input) {
	    if (!this.isValid()) {
	        return false;
	    }
	    input = input ? createLocal(input).utcOffset() : 0;
	
	    return (this.utcOffset() - input) % 60 === 0;
	}
	
	function isDaylightSavingTime () {
	    return (
	        this.utcOffset() > this.clone().month(0).utcOffset() ||
	        this.utcOffset() > this.clone().month(5).utcOffset()
	    );
	}
	
	function isDaylightSavingTimeShifted () {
	    if (!isUndefined(this._isDSTShifted)) {
	        return this._isDSTShifted;
	    }
	
	    var c = {};
	
	    copyConfig(c, this);
	    c = prepareConfig(c);
	
	    if (c._a) {
	        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	        this._isDSTShifted = this.isValid() &&
	            compareArrays(c._a, other.toArray()) > 0;
	    } else {
	        this._isDSTShifted = false;
	    }
	
	    return this._isDSTShifted;
	}
	
	function isLocal () {
	    return this.isValid() ? !this._isUTC : false;
	}
	
	function isUtcOffset () {
	    return this.isValid() ? this._isUTC : false;
	}
	
	function isUtc () {
	    return this.isValid() ? this._isUTC && this._offset === 0 : false;
	}
	
	// ASP.NET json date format regex
	var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;
	
	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	// and further modified to allow for strings containing both week and day
	var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;
	
	function createDuration (input, key) {
	    var duration = input,
	        // matching against regexp is expensive, do it on demand
	        match = null,
	        sign,
	        ret,
	        diffRes;
	
	    if (isDuration(input)) {
	        duration = {
	            ms : input._milliseconds,
	            d  : input._days,
	            M  : input._months
	        };
	    } else if (isNumber(input)) {
	        duration = {};
	        if (key) {
	            duration[key] = input;
	        } else {
	            duration.milliseconds = input;
	        }
	    } else if (!!(match = aspNetRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y  : 0,
	            d  : toInt(match[DATE])                         * sign,
	            h  : toInt(match[HOUR])                         * sign,
	            m  : toInt(match[MINUTE])                       * sign,
	            s  : toInt(match[SECOND])                       * sign,
	            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	        };
	    } else if (!!(match = isoRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y : parseIso(match[2], sign),
	            M : parseIso(match[3], sign),
	            w : parseIso(match[4], sign),
	            d : parseIso(match[5], sign),
	            h : parseIso(match[6], sign),
	            m : parseIso(match[7], sign),
	            s : parseIso(match[8], sign)
	        };
	    } else if (duration == null) {// checks for null or undefined
	        duration = {};
	    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));
	
	        duration = {};
	        duration.ms = diffRes.milliseconds;
	        duration.M = diffRes.months;
	    }
	
	    ret = new Duration(duration);
	
	    if (isDuration(input) && hasOwnProp(input, '_locale')) {
	        ret._locale = input._locale;
	    }
	
	    return ret;
	}
	
	createDuration.fn = Duration.prototype;
	
	function parseIso (inp, sign) {
	    // We'd normally use ~~inp for this, but unfortunately it also
	    // converts floats to ints.
	    // inp may be undefined, so careful calling replace on it.
	    var res = inp && parseFloat(inp.replace(',', '.'));
	    // apply sign while we're at it
	    return (isNaN(res) ? 0 : res) * sign;
	}
	
	function positiveMomentsDifference(base, other) {
	    var res = {milliseconds: 0, months: 0};
	
	    res.months = other.month() - base.month() +
	        (other.year() - base.year()) * 12;
	    if (base.clone().add(res.months, 'M').isAfter(other)) {
	        --res.months;
	    }
	
	    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));
	
	    return res;
	}
	
	function momentsDifference(base, other) {
	    var res;
	    if (!(base.isValid() && other.isValid())) {
	        return {milliseconds: 0, months: 0};
	    }
	
	    other = cloneWithOffset(other, base);
	    if (base.isBefore(other)) {
	        res = positiveMomentsDifference(base, other);
	    } else {
	        res = positiveMomentsDifference(other, base);
	        res.milliseconds = -res.milliseconds;
	        res.months = -res.months;
	    }
	
	    return res;
	}
	
	// TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction, name) {
	    return function (val, period) {
	        var dur, tmp;
	        //invert the arguments, but complain about it
	        if (period !== null && !isNaN(+period)) {
	            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	            tmp = val; val = period; period = tmp;
	        }
	
	        val = typeof val === 'string' ? +val : val;
	        dur = createDuration(val, period);
	        addSubtract(this, dur, direction);
	        return this;
	    };
	}
	
	function addSubtract (mom, duration, isAdding, updateOffset) {
	    var milliseconds = duration._milliseconds,
	        days = absRound(duration._days),
	        months = absRound(duration._months);
	
	    if (!mom.isValid()) {
	        // No op
	        return;
	    }
	
	    updateOffset = updateOffset == null ? true : updateOffset;
	
	    if (milliseconds) {
	        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	    }
	    if (days) {
	        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	    }
	    if (months) {
	        setMonth(mom, get(mom, 'Month') + months * isAdding);
	    }
	    if (updateOffset) {
	        hooks.updateOffset(mom, days || months);
	    }
	}
	
	var add      = createAdder(1, 'add');
	var subtract = createAdder(-1, 'subtract');
	
	function getCalendarFormat(myMoment, now) {
	    var diff = myMoment.diff(now, 'days', true);
	    return diff < -6 ? 'sameElse' :
	            diff < -1 ? 'lastWeek' :
	            diff < 0 ? 'lastDay' :
	            diff < 1 ? 'sameDay' :
	            diff < 2 ? 'nextDay' :
	            diff < 7 ? 'nextWeek' : 'sameElse';
	}
	
	function calendar$1 (time, formats) {
	    // We want to compare the start of today, vs this.
	    // Getting start-of-today depends on whether we're local/utc/offset or not.
	    var now = time || createLocal(),
	        sod = cloneWithOffset(now, this).startOf('day'),
	        format = hooks.calendarFormat(this, sod) || 'sameElse';
	
	    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);
	
	    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
	}
	
	function clone () {
	    return new Moment(this);
	}
	
	function isAfter (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() > localInput.valueOf();
	    } else {
	        return localInput.valueOf() < this.clone().startOf(units).valueOf();
	    }
	}
	
	function isBefore (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() < localInput.valueOf();
	    } else {
	        return this.clone().endOf(units).valueOf() < localInput.valueOf();
	    }
	}
	
	function isBetween (from, to, units, inclusivity) {
	    inclusivity = inclusivity || '()';
	    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	}
	
	function isSame (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input),
	        inputMs;
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(units || 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() === localInput.valueOf();
	    } else {
	        inputMs = localInput.valueOf();
	        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	    }
	}
	
	function isSameOrAfter (input, units) {
	    return this.isSame(input, units) || this.isAfter(input,units);
	}
	
	function isSameOrBefore (input, units) {
	    return this.isSame(input, units) || this.isBefore(input,units);
	}
	
	function diff (input, units, asFloat) {
	    var that,
	        zoneDelta,
	        delta, output;
	
	    if (!this.isValid()) {
	        return NaN;
	    }
	
	    that = cloneWithOffset(input, this);
	
	    if (!that.isValid()) {
	        return NaN;
	    }
	
	    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
	
	    units = normalizeUnits(units);
	
	    if (units === 'year' || units === 'month' || units === 'quarter') {
	        output = monthDiff(this, that);
	        if (units === 'quarter') {
	            output = output / 3;
	        } else if (units === 'year') {
	            output = output / 12;
	        }
	    } else {
	        delta = this - that;
	        output = units === 'second' ? delta / 1e3 : // 1000
	            units === 'minute' ? delta / 6e4 : // 1000 * 60
	            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	            delta;
	    }
	    return asFloat ? output : absFloor(output);
	}
	
	function monthDiff (a, b) {
	    // difference in months
	    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	        // b is in (anchor - 1 month, anchor + 1 month)
	        anchor = a.clone().add(wholeMonthDiff, 'months'),
	        anchor2, adjust;
	
	    if (b - anchor < 0) {
	        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor - anchor2);
	    } else {
	        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor2 - anchor);
	    }
	
	    //check for negative zero, return zero if negative zero
	    return -(wholeMonthDiff + adjust) || 0;
	}
	
	hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
	
	function toString () {
	    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	}
	
	function toISOString () {
	    var m = this.clone().utc();
	    if (0 < m.year() && m.year() <= 9999) {
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            return this.toDate().toISOString();
	        } else {
	            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        }
	    } else {
	        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	    }
	}
	
	/**
	 * Return a human readable representation of a moment that can
	 * also be evaluated to get a new moment which is the same
	 *
	 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	 */
	function inspect () {
	    if (!this.isValid()) {
	        return 'moment.invalid(/* ' + this._i + ' */)';
	    }
	    var func = 'moment';
	    var zone = '';
	    if (!this.isLocal()) {
	        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	        zone = 'Z';
	    }
	    var prefix = '[' + func + '("]';
	    var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
	    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
	    var suffix = zone + '[")]';
	
	    return this.format(prefix + year + datetime + suffix);
	}
	
	function format (inputString) {
	    if (!inputString) {
	        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
	    }
	    var output = formatMoment(this, inputString);
	    return this.localeData().postformat(output);
	}
	
	function from (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}
	
	function fromNow (withoutSuffix) {
	    return this.from(createLocal(), withoutSuffix);
	}
	
	function to (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}
	
	function toNow (withoutSuffix) {
	    return this.to(createLocal(), withoutSuffix);
	}
	
	// If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale (key) {
	    var newLocaleData;
	
	    if (key === undefined) {
	        return this._locale._abbr;
	    } else {
	        newLocaleData = getLocale(key);
	        if (newLocaleData != null) {
	            this._locale = newLocaleData;
	        }
	        return this;
	    }
	}
	
	var lang = deprecate(
	    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	    function (key) {
	        if (key === undefined) {
	            return this.localeData();
	        } else {
	            return this.locale(key);
	        }
	    }
	);
	
	function localeData () {
	    return this._locale;
	}
	
	function startOf (units) {
	    units = normalizeUnits(units);
	    // the following switch intentionally omits break keywords
	    // to utilize falling through the cases.
	    switch (units) {
	        case 'year':
	            this.month(0);
	            /* falls through */
	        case 'quarter':
	        case 'month':
	            this.date(1);
	            /* falls through */
	        case 'week':
	        case 'isoWeek':
	        case 'day':
	        case 'date':
	            this.hours(0);
	            /* falls through */
	        case 'hour':
	            this.minutes(0);
	            /* falls through */
	        case 'minute':
	            this.seconds(0);
	            /* falls through */
	        case 'second':
	            this.milliseconds(0);
	    }
	
	    // weeks are a special case
	    if (units === 'week') {
	        this.weekday(0);
	    }
	    if (units === 'isoWeek') {
	        this.isoWeekday(1);
	    }
	
	    // quarters are also special
	    if (units === 'quarter') {
	        this.month(Math.floor(this.month() / 3) * 3);
	    }
	
	    return this;
	}
	
	function endOf (units) {
	    units = normalizeUnits(units);
	    if (units === undefined || units === 'millisecond') {
	        return this;
	    }
	
	    // 'date' is an alias for 'day', so it should be considered as such.
	    if (units === 'date') {
	        units = 'day';
	    }
	
	    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	}
	
	function valueOf () {
	    return this._d.valueOf() - ((this._offset || 0) * 60000);
	}
	
	function unix () {
	    return Math.floor(this.valueOf() / 1000);
	}
	
	function toDate () {
	    return new Date(this.valueOf());
	}
	
	function toArray () {
	    var m = this;
	    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}
	
	function toObject () {
	    var m = this;
	    return {
	        years: m.year(),
	        months: m.month(),
	        date: m.date(),
	        hours: m.hours(),
	        minutes: m.minutes(),
	        seconds: m.seconds(),
	        milliseconds: m.milliseconds()
	    };
	}
	
	function toJSON () {
	    // new Date(NaN).toJSON() === null
	    return this.isValid() ? this.toISOString() : null;
	}
	
	function isValid$1 () {
	    return isValid(this);
	}
	
	function parsingFlags () {
	    return extend({}, getParsingFlags(this));
	}
	
	function invalidAt () {
	    return getParsingFlags(this).overflow;
	}
	
	function creationData() {
	    return {
	        input: this._i,
	        format: this._f,
	        locale: this._locale,
	        isUTC: this._isUTC,
	        strict: this._strict
	    };
	}
	
	// FORMATTING
	
	addFormatToken(0, ['gg', 2], 0, function () {
	    return this.weekYear() % 100;
	});
	
	addFormatToken(0, ['GG', 2], 0, function () {
	    return this.isoWeekYear() % 100;
	});
	
	function addWeekYearFormatToken (token, getter) {
	    addFormatToken(0, [token, token.length], 0, getter);
	}
	
	addWeekYearFormatToken('gggg',     'weekYear');
	addWeekYearFormatToken('ggggg',    'weekYear');
	addWeekYearFormatToken('GGGG',  'isoWeekYear');
	addWeekYearFormatToken('GGGGG', 'isoWeekYear');
	
	// ALIASES
	
	addUnitAlias('weekYear', 'gg');
	addUnitAlias('isoWeekYear', 'GG');
	
	// PRIORITY
	
	addUnitPriority('weekYear', 1);
	addUnitPriority('isoWeekYear', 1);
	
	
	// PARSING
	
	addRegexToken('G',      matchSigned);
	addRegexToken('g',      matchSigned);
	addRegexToken('GG',     match1to2, match2);
	addRegexToken('gg',     match1to2, match2);
	addRegexToken('GGGG',   match1to4, match4);
	addRegexToken('gggg',   match1to4, match4);
	addRegexToken('GGGGG',  match1to6, match6);
	addRegexToken('ggggg',  match1to6, match6);
	
	addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	    week[token.substr(0, 2)] = toInt(input);
	});
	
	addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	    week[token] = hooks.parseTwoDigitYear(input);
	});
	
	// MOMENTS
	
	function getSetWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy);
	}
	
	function getSetISOWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input, this.isoWeek(), this.isoWeekday(), 1, 4);
	}
	
	function getISOWeeksInYear () {
	    return weeksInYear(this.year(), 1, 4);
	}
	
	function getWeeksInYear () {
	    var weekInfo = this.localeData()._week;
	    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	}
	
	function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	    var weeksTarget;
	    if (input == null) {
	        return weekOfYear(this, dow, doy).year;
	    } else {
	        weeksTarget = weeksInYear(input, dow, doy);
	        if (week > weeksTarget) {
	            week = weeksTarget;
	        }
	        return setWeekAll.call(this, input, week, weekday, dow, doy);
	    }
	}
	
	function setWeekAll(weekYear, week, weekday, dow, doy) {
	    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
	
	    this.year(date.getUTCFullYear());
	    this.month(date.getUTCMonth());
	    this.date(date.getUTCDate());
	    return this;
	}
	
	// FORMATTING
	
	addFormatToken('Q', 0, 'Qo', 'quarter');
	
	// ALIASES
	
	addUnitAlias('quarter', 'Q');
	
	// PRIORITY
	
	addUnitPriority('quarter', 7);
	
	// PARSING
	
	addRegexToken('Q', match1);
	addParseToken('Q', function (input, array) {
	    array[MONTH] = (toInt(input) - 1) * 3;
	});
	
	// MOMENTS
	
	function getSetQuarter (input) {
	    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	}
	
	// FORMATTING
	
	addFormatToken('D', ['DD', 2], 'Do', 'date');
	
	// ALIASES
	
	addUnitAlias('date', 'D');
	
	// PRIOROITY
	addUnitPriority('date', 9);
	
	// PARSING
	
	addRegexToken('D',  match1to2);
	addRegexToken('DD', match1to2, match2);
	addRegexToken('Do', function (isStrict, locale) {
	    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	});
	
	addParseToken(['D', 'DD'], DATE);
	addParseToken('Do', function (input, array) {
	    array[DATE] = toInt(input.match(match1to2)[0], 10);
	});
	
	// MOMENTS
	
	var getSetDayOfMonth = makeGetSet('Date', true);
	
	// FORMATTING
	
	addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');
	
	// ALIASES
	
	addUnitAlias('dayOfYear', 'DDD');
	
	// PRIORITY
	addUnitPriority('dayOfYear', 4);
	
	// PARSING
	
	addRegexToken('DDD',  match1to3);
	addRegexToken('DDDD', match3);
	addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	    config._dayOfYear = toInt(input);
	});
	
	// HELPERS
	
	// MOMENTS
	
	function getSetDayOfYear (input) {
	    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	}
	
	// FORMATTING
	
	addFormatToken('m', ['mm', 2], 0, 'minute');
	
	// ALIASES
	
	addUnitAlias('minute', 'm');
	
	// PRIORITY
	
	addUnitPriority('minute', 14);
	
	// PARSING
	
	addRegexToken('m',  match1to2);
	addRegexToken('mm', match1to2, match2);
	addParseToken(['m', 'mm'], MINUTE);
	
	// MOMENTS
	
	var getSetMinute = makeGetSet('Minutes', false);
	
	// FORMATTING
	
	addFormatToken('s', ['ss', 2], 0, 'second');
	
	// ALIASES
	
	addUnitAlias('second', 's');
	
	// PRIORITY
	
	addUnitPriority('second', 15);
	
	// PARSING
	
	addRegexToken('s',  match1to2);
	addRegexToken('ss', match1to2, match2);
	addParseToken(['s', 'ss'], SECOND);
	
	// MOMENTS
	
	var getSetSecond = makeGetSet('Seconds', false);
	
	// FORMATTING
	
	addFormatToken('S', 0, 0, function () {
	    return ~~(this.millisecond() / 100);
	});
	
	addFormatToken(0, ['SS', 2], 0, function () {
	    return ~~(this.millisecond() / 10);
	});
	
	addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	addFormatToken(0, ['SSSS', 4], 0, function () {
	    return this.millisecond() * 10;
	});
	addFormatToken(0, ['SSSSS', 5], 0, function () {
	    return this.millisecond() * 100;
	});
	addFormatToken(0, ['SSSSSS', 6], 0, function () {
	    return this.millisecond() * 1000;
	});
	addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	    return this.millisecond() * 10000;
	});
	addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	    return this.millisecond() * 100000;
	});
	addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	    return this.millisecond() * 1000000;
	});
	
	
	// ALIASES
	
	addUnitAlias('millisecond', 'ms');
	
	// PRIORITY
	
	addUnitPriority('millisecond', 16);
	
	// PARSING
	
	addRegexToken('S',    match1to3, match1);
	addRegexToken('SS',   match1to3, match2);
	addRegexToken('SSS',  match1to3, match3);
	
	var token;
	for (token = 'SSSS'; token.length <= 9; token += 'S') {
	    addRegexToken(token, matchUnsigned);
	}
	
	function parseMs(input, array) {
	    array[MILLISECOND] = toInt(('0.' + input) * 1000);
	}
	
	for (token = 'S'; token.length <= 9; token += 'S') {
	    addParseToken(token, parseMs);
	}
	// MOMENTS
	
	var getSetMillisecond = makeGetSet('Milliseconds', false);
	
	// FORMATTING
	
	addFormatToken('z',  0, 0, 'zoneAbbr');
	addFormatToken('zz', 0, 0, 'zoneName');
	
	// MOMENTS
	
	function getZoneAbbr () {
	    return this._isUTC ? 'UTC' : '';
	}
	
	function getZoneName () {
	    return this._isUTC ? 'Coordinated Universal Time' : '';
	}
	
	var proto = Moment.prototype;
	
	proto.add               = add;
	proto.calendar          = calendar$1;
	proto.clone             = clone;
	proto.diff              = diff;
	proto.endOf             = endOf;
	proto.format            = format;
	proto.from              = from;
	proto.fromNow           = fromNow;
	proto.to                = to;
	proto.toNow             = toNow;
	proto.get               = stringGet;
	proto.invalidAt         = invalidAt;
	proto.isAfter           = isAfter;
	proto.isBefore          = isBefore;
	proto.isBetween         = isBetween;
	proto.isSame            = isSame;
	proto.isSameOrAfter     = isSameOrAfter;
	proto.isSameOrBefore    = isSameOrBefore;
	proto.isValid           = isValid$1;
	proto.lang              = lang;
	proto.locale            = locale;
	proto.localeData        = localeData;
	proto.max               = prototypeMax;
	proto.min               = prototypeMin;
	proto.parsingFlags      = parsingFlags;
	proto.set               = stringSet;
	proto.startOf           = startOf;
	proto.subtract          = subtract;
	proto.toArray           = toArray;
	proto.toObject          = toObject;
	proto.toDate            = toDate;
	proto.toISOString       = toISOString;
	proto.inspect           = inspect;
	proto.toJSON            = toJSON;
	proto.toString          = toString;
	proto.unix              = unix;
	proto.valueOf           = valueOf;
	proto.creationData      = creationData;
	
	// Year
	proto.year       = getSetYear;
	proto.isLeapYear = getIsLeapYear;
	
	// Week Year
	proto.weekYear    = getSetWeekYear;
	proto.isoWeekYear = getSetISOWeekYear;
	
	// Quarter
	proto.quarter = proto.quarters = getSetQuarter;
	
	// Month
	proto.month       = getSetMonth;
	proto.daysInMonth = getDaysInMonth;
	
	// Week
	proto.week           = proto.weeks        = getSetWeek;
	proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
	proto.weeksInYear    = getWeeksInYear;
	proto.isoWeeksInYear = getISOWeeksInYear;
	
	// Day
	proto.date       = getSetDayOfMonth;
	proto.day        = proto.days             = getSetDayOfWeek;
	proto.weekday    = getSetLocaleDayOfWeek;
	proto.isoWeekday = getSetISODayOfWeek;
	proto.dayOfYear  = getSetDayOfYear;
	
	// Hour
	proto.hour = proto.hours = getSetHour;
	
	// Minute
	proto.minute = proto.minutes = getSetMinute;
	
	// Second
	proto.second = proto.seconds = getSetSecond;
	
	// Millisecond
	proto.millisecond = proto.milliseconds = getSetMillisecond;
	
	// Offset
	proto.utcOffset            = getSetOffset;
	proto.utc                  = setOffsetToUTC;
	proto.local                = setOffsetToLocal;
	proto.parseZone            = setOffsetToParsedOffset;
	proto.hasAlignedHourOffset = hasAlignedHourOffset;
	proto.isDST                = isDaylightSavingTime;
	proto.isLocal              = isLocal;
	proto.isUtcOffset          = isUtcOffset;
	proto.isUtc                = isUtc;
	proto.isUTC                = isUtc;
	
	// Timezone
	proto.zoneAbbr = getZoneAbbr;
	proto.zoneName = getZoneName;
	
	// Deprecations
	proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);
	
	function createUnix (input) {
	    return createLocal(input * 1000);
	}
	
	function createInZone () {
	    return createLocal.apply(null, arguments).parseZone();
	}
	
	function preParsePostFormat (string) {
	    return string;
	}
	
	var proto$1 = Locale.prototype;
	
	proto$1.calendar        = calendar;
	proto$1.longDateFormat  = longDateFormat;
	proto$1.invalidDate     = invalidDate;
	proto$1.ordinal         = ordinal;
	proto$1.preparse        = preParsePostFormat;
	proto$1.postformat      = preParsePostFormat;
	proto$1.relativeTime    = relativeTime;
	proto$1.pastFuture      = pastFuture;
	proto$1.set             = set;
	
	// Month
	proto$1.months            =        localeMonths;
	proto$1.monthsShort       =        localeMonthsShort;
	proto$1.monthsParse       =        localeMonthsParse;
	proto$1.monthsRegex       = monthsRegex;
	proto$1.monthsShortRegex  = monthsShortRegex;
	
	// Week
	proto$1.week = localeWeek;
	proto$1.firstDayOfYear = localeFirstDayOfYear;
	proto$1.firstDayOfWeek = localeFirstDayOfWeek;
	
	// Day of Week
	proto$1.weekdays       =        localeWeekdays;
	proto$1.weekdaysMin    =        localeWeekdaysMin;
	proto$1.weekdaysShort  =        localeWeekdaysShort;
	proto$1.weekdaysParse  =        localeWeekdaysParse;
	
	proto$1.weekdaysRegex       =        weekdaysRegex;
	proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
	proto$1.weekdaysMinRegex    =        weekdaysMinRegex;
	
	// Hours
	proto$1.isPM = localeIsPM;
	proto$1.meridiem = localeMeridiem;
	
	function get$1 (format, index, field, setter) {
	    var locale = getLocale();
	    var utc = createUTC().set(setter, index);
	    return locale[field](utc, format);
	}
	
	function listMonthsImpl (format, index, field) {
	    if (isNumber(format)) {
	        index = format;
	        format = undefined;
	    }
	
	    format = format || '';
	
	    if (index != null) {
	        return get$1(format, index, field, 'month');
	    }
	
	    var i;
	    var out = [];
	    for (i = 0; i < 12; i++) {
	        out[i] = get$1(format, i, field, 'month');
	    }
	    return out;
	}
	
	// ()
	// (5)
	// (fmt, 5)
	// (fmt)
	// (true)
	// (true, 5)
	// (true, fmt, 5)
	// (true, fmt)
	function listWeekdaysImpl (localeSorted, format, index, field) {
	    if (typeof localeSorted === 'boolean') {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }
	
	        format = format || '';
	    } else {
	        format = localeSorted;
	        index = format;
	        localeSorted = false;
	
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }
	
	        format = format || '';
	    }
	
	    var locale = getLocale(),
	        shift = localeSorted ? locale._week.dow : 0;
	
	    if (index != null) {
	        return get$1(format, (index + shift) % 7, field, 'day');
	    }
	
	    var i;
	    var out = [];
	    for (i = 0; i < 7; i++) {
	        out[i] = get$1(format, (i + shift) % 7, field, 'day');
	    }
	    return out;
	}
	
	function listMonths (format, index) {
	    return listMonthsImpl(format, index, 'months');
	}
	
	function listMonthsShort (format, index) {
	    return listMonthsImpl(format, index, 'monthsShort');
	}
	
	function listWeekdays (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	}
	
	function listWeekdaysShort (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	}
	
	function listWeekdaysMin (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	}
	
	getSetGlobalLocale('en', {
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (toInt(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});
	
	// Side effect imports
	hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
	hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);
	
	var mathAbs = Math.abs;
	
	function abs () {
	    var data           = this._data;
	
	    this._milliseconds = mathAbs(this._milliseconds);
	    this._days         = mathAbs(this._days);
	    this._months       = mathAbs(this._months);
	
	    data.milliseconds  = mathAbs(data.milliseconds);
	    data.seconds       = mathAbs(data.seconds);
	    data.minutes       = mathAbs(data.minutes);
	    data.hours         = mathAbs(data.hours);
	    data.months        = mathAbs(data.months);
	    data.years         = mathAbs(data.years);
	
	    return this;
	}
	
	function addSubtract$1 (duration, input, value, direction) {
	    var other = createDuration(input, value);
	
	    duration._milliseconds += direction * other._milliseconds;
	    duration._days         += direction * other._days;
	    duration._months       += direction * other._months;
	
	    return duration._bubble();
	}
	
	// supports only 2.0-style add(1, 's') or add(duration)
	function add$1 (input, value) {
	    return addSubtract$1(this, input, value, 1);
	}
	
	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function subtract$1 (input, value) {
	    return addSubtract$1(this, input, value, -1);
	}
	
	function absCeil (number) {
	    if (number < 0) {
	        return Math.floor(number);
	    } else {
	        return Math.ceil(number);
	    }
	}
	
	function bubble () {
	    var milliseconds = this._milliseconds;
	    var days         = this._days;
	    var months       = this._months;
	    var data         = this._data;
	    var seconds, minutes, hours, years, monthsFromDays;
	
	    // if we have a mix of positive and negative values, bubble down first
	    // check: https://github.com/moment/moment/issues/2166
	    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	            (milliseconds <= 0 && days <= 0 && months <= 0))) {
	        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	        days = 0;
	        months = 0;
	    }
	
	    // The following code bubbles up values, see the tests for
	    // examples of what that means.
	    data.milliseconds = milliseconds % 1000;
	
	    seconds           = absFloor(milliseconds / 1000);
	    data.seconds      = seconds % 60;
	
	    minutes           = absFloor(seconds / 60);
	    data.minutes      = minutes % 60;
	
	    hours             = absFloor(minutes / 60);
	    data.hours        = hours % 24;
	
	    days += absFloor(hours / 24);
	
	    // convert days to months
	    monthsFromDays = absFloor(daysToMonths(days));
	    months += monthsFromDays;
	    days -= absCeil(monthsToDays(monthsFromDays));
	
	    // 12 months -> 1 year
	    years = absFloor(months / 12);
	    months %= 12;
	
	    data.days   = days;
	    data.months = months;
	    data.years  = years;
	
	    return this;
	}
	
	function daysToMonths (days) {
	    // 400 years have 146097 days (taking into account leap year rules)
	    // 400 years have 12 months === 4800
	    return days * 4800 / 146097;
	}
	
	function monthsToDays (months) {
	    // the reverse of daysToMonths
	    return months * 146097 / 4800;
	}
	
	function as (units) {
	    var days;
	    var months;
	    var milliseconds = this._milliseconds;
	
	    units = normalizeUnits(units);
	
	    if (units === 'month' || units === 'year') {
	        days   = this._days   + milliseconds / 864e5;
	        months = this._months + daysToMonths(days);
	        return units === 'month' ? months : months / 12;
	    } else {
	        // handle milliseconds separately because of floating point math errors (issue #1867)
	        days = this._days + Math.round(monthsToDays(this._months));
	        switch (units) {
	            case 'week'   : return days / 7     + milliseconds / 6048e5;
	            case 'day'    : return days         + milliseconds / 864e5;
	            case 'hour'   : return days * 24    + milliseconds / 36e5;
	            case 'minute' : return days * 1440  + milliseconds / 6e4;
	            case 'second' : return days * 86400 + milliseconds / 1000;
	            // Math.floor prevents floating point math errors here
	            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	            default: throw new Error('Unknown unit ' + units);
	        }
	    }
	}
	
	// TODO: Use this.as('ms')?
	function valueOf$1 () {
	    return (
	        this._milliseconds +
	        this._days * 864e5 +
	        (this._months % 12) * 2592e6 +
	        toInt(this._months / 12) * 31536e6
	    );
	}
	
	function makeAs (alias) {
	    return function () {
	        return this.as(alias);
	    };
	}
	
	var asMilliseconds = makeAs('ms');
	var asSeconds      = makeAs('s');
	var asMinutes      = makeAs('m');
	var asHours        = makeAs('h');
	var asDays         = makeAs('d');
	var asWeeks        = makeAs('w');
	var asMonths       = makeAs('M');
	var asYears        = makeAs('y');
	
	function get$2 (units) {
	    units = normalizeUnits(units);
	    return this[units + 's']();
	}
	
	function makeGetter(name) {
	    return function () {
	        return this._data[name];
	    };
	}
	
	var milliseconds = makeGetter('milliseconds');
	var seconds      = makeGetter('seconds');
	var minutes      = makeGetter('minutes');
	var hours        = makeGetter('hours');
	var days         = makeGetter('days');
	var months       = makeGetter('months');
	var years        = makeGetter('years');
	
	function weeks () {
	    return absFloor(this.days() / 7);
	}
	
	var round = Math.round;
	var thresholds = {
	    s: 45,  // seconds to minute
	    m: 45,  // minutes to hour
	    h: 22,  // hours to day
	    d: 26,  // days to month
	    M: 11   // months to year
	};
	
	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	}
	
	function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
	    var duration = createDuration(posNegDuration).abs();
	    var seconds  = round(duration.as('s'));
	    var minutes  = round(duration.as('m'));
	    var hours    = round(duration.as('h'));
	    var days     = round(duration.as('d'));
	    var months   = round(duration.as('M'));
	    var years    = round(duration.as('y'));
	
	    var a = seconds < thresholds.s && ['s', seconds]  ||
	            minutes <= 1           && ['m']           ||
	            minutes < thresholds.m && ['mm', minutes] ||
	            hours   <= 1           && ['h']           ||
	            hours   < thresholds.h && ['hh', hours]   ||
	            days    <= 1           && ['d']           ||
	            days    < thresholds.d && ['dd', days]    ||
	            months  <= 1           && ['M']           ||
	            months  < thresholds.M && ['MM', months]  ||
	            years   <= 1           && ['y']           || ['yy', years];
	
	    a[2] = withoutSuffix;
	    a[3] = +posNegDuration > 0;
	    a[4] = locale;
	    return substituteTimeAgo.apply(null, a);
	}
	
	// This function allows you to set the rounding function for relative time strings
	function getSetRelativeTimeRounding (roundingFunction) {
	    if (roundingFunction === undefined) {
	        return round;
	    }
	    if (typeof(roundingFunction) === 'function') {
	        round = roundingFunction;
	        return true;
	    }
	    return false;
	}
	
	// This function allows you to set a threshold for relative time strings
	function getSetRelativeTimeThreshold (threshold, limit) {
	    if (thresholds[threshold] === undefined) {
	        return false;
	    }
	    if (limit === undefined) {
	        return thresholds[threshold];
	    }
	    thresholds[threshold] = limit;
	    return true;
	}
	
	function humanize (withSuffix) {
	    var locale = this.localeData();
	    var output = relativeTime$1(this, !withSuffix, locale);
	
	    if (withSuffix) {
	        output = locale.pastFuture(+this, output);
	    }
	
	    return locale.postformat(output);
	}
	
	var abs$1 = Math.abs;
	
	function toISOString$1() {
	    // for ISO strings we do not use the normal bubbling rules:
	    //  * milliseconds bubble up until they become hours
	    //  * days do not bubble at all
	    //  * months bubble up until they become years
	    // This is because there is no context-free conversion between hours and days
	    // (think of clock changes)
	    // and also not between days and months (28-31 days per month)
	    var seconds = abs$1(this._milliseconds) / 1000;
	    var days         = abs$1(this._days);
	    var months       = abs$1(this._months);
	    var minutes, hours, years;
	
	    // 3600 seconds -> 60 minutes -> 1 hour
	    minutes           = absFloor(seconds / 60);
	    hours             = absFloor(minutes / 60);
	    seconds %= 60;
	    minutes %= 60;
	
	    // 12 months -> 1 year
	    years  = absFloor(months / 12);
	    months %= 12;
	
	
	    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	    var Y = years;
	    var M = months;
	    var D = days;
	    var h = hours;
	    var m = minutes;
	    var s = seconds;
	    var total = this.asSeconds();
	
	    if (!total) {
	        // this is the same as C#'s (Noda) and python (isodate)...
	        // but not other JS (goog.date)
	        return 'P0D';
	    }
	
	    return (total < 0 ? '-' : '') +
	        'P' +
	        (Y ? Y + 'Y' : '') +
	        (M ? M + 'M' : '') +
	        (D ? D + 'D' : '') +
	        ((h || m || s) ? 'T' : '') +
	        (h ? h + 'H' : '') +
	        (m ? m + 'M' : '') +
	        (s ? s + 'S' : '');
	}
	
	var proto$2 = Duration.prototype;
	
	proto$2.abs            = abs;
	proto$2.add            = add$1;
	proto$2.subtract       = subtract$1;
	proto$2.as             = as;
	proto$2.asMilliseconds = asMilliseconds;
	proto$2.asSeconds      = asSeconds;
	proto$2.asMinutes      = asMinutes;
	proto$2.asHours        = asHours;
	proto$2.asDays         = asDays;
	proto$2.asWeeks        = asWeeks;
	proto$2.asMonths       = asMonths;
	proto$2.asYears        = asYears;
	proto$2.valueOf        = valueOf$1;
	proto$2._bubble        = bubble;
	proto$2.get            = get$2;
	proto$2.milliseconds   = milliseconds;
	proto$2.seconds        = seconds;
	proto$2.minutes        = minutes;
	proto$2.hours          = hours;
	proto$2.days           = days;
	proto$2.weeks          = weeks;
	proto$2.months         = months;
	proto$2.years          = years;
	proto$2.humanize       = humanize;
	proto$2.toISOString    = toISOString$1;
	proto$2.toString       = toISOString$1;
	proto$2.toJSON         = toISOString$1;
	proto$2.locale         = locale;
	proto$2.localeData     = localeData;
	
	// Deprecations
	proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
	proto$2.lang = lang;
	
	// Side effect imports
	
	// FORMATTING
	
	addFormatToken('X', 0, 0, 'unix');
	addFormatToken('x', 0, 0, 'valueOf');
	
	// PARSING
	
	addRegexToken('x', matchSigned);
	addRegexToken('X', matchTimestamp);
	addParseToken('X', function (input, array, config) {
	    config._d = new Date(parseFloat(input, 10) * 1000);
	});
	addParseToken('x', function (input, array, config) {
	    config._d = new Date(toInt(input));
	});
	
	// Side effect imports
	
	
	hooks.version = '2.17.1';
	
	setHookCallback(createLocal);
	
	hooks.fn                    = proto;
	hooks.min                   = min;
	hooks.max                   = max;
	hooks.now                   = now;
	hooks.utc                   = createUTC;
	hooks.unix                  = createUnix;
	hooks.months                = listMonths;
	hooks.isDate                = isDate;
	hooks.locale                = getSetGlobalLocale;
	hooks.invalid               = createInvalid;
	hooks.duration              = createDuration;
	hooks.isMoment              = isMoment;
	hooks.weekdays              = listWeekdays;
	hooks.parseZone             = createInZone;
	hooks.localeData            = getLocale;
	hooks.isDuration            = isDuration;
	hooks.monthsShort           = listMonthsShort;
	hooks.weekdaysMin           = listWeekdaysMin;
	hooks.defineLocale          = defineLocale;
	hooks.updateLocale          = updateLocale;
	hooks.locales               = listLocales;
	hooks.weekdaysShort         = listWeekdaysShort;
	hooks.normalizeUnits        = normalizeUnits;
	hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	hooks.calendarFormat        = getCalendarFormat;
	hooks.prototype             = proto;
	
	return hooks;
	
	})));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)(module)))

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./af": 281,
		"./af.js": 281,
		"./ar": 282,
		"./ar-dz": 283,
		"./ar-dz.js": 283,
		"./ar-ly": 284,
		"./ar-ly.js": 284,
		"./ar-ma": 285,
		"./ar-ma.js": 285,
		"./ar-sa": 286,
		"./ar-sa.js": 286,
		"./ar-tn": 287,
		"./ar-tn.js": 287,
		"./ar.js": 282,
		"./az": 288,
		"./az.js": 288,
		"./be": 289,
		"./be.js": 289,
		"./bg": 290,
		"./bg.js": 290,
		"./bn": 291,
		"./bn.js": 291,
		"./bo": 292,
		"./bo.js": 292,
		"./br": 293,
		"./br.js": 293,
		"./bs": 294,
		"./bs.js": 294,
		"./ca": 295,
		"./ca.js": 295,
		"./cs": 296,
		"./cs.js": 296,
		"./cv": 297,
		"./cv.js": 297,
		"./cy": 298,
		"./cy.js": 298,
		"./da": 299,
		"./da.js": 299,
		"./de": 300,
		"./de-at": 301,
		"./de-at.js": 301,
		"./de.js": 300,
		"./dv": 302,
		"./dv.js": 302,
		"./el": 303,
		"./el.js": 303,
		"./en-au": 304,
		"./en-au.js": 304,
		"./en-ca": 305,
		"./en-ca.js": 305,
		"./en-gb": 306,
		"./en-gb.js": 306,
		"./en-ie": 307,
		"./en-ie.js": 307,
		"./en-nz": 308,
		"./en-nz.js": 308,
		"./eo": 309,
		"./eo.js": 309,
		"./es": 310,
		"./es-do": 311,
		"./es-do.js": 311,
		"./es.js": 310,
		"./et": 312,
		"./et.js": 312,
		"./eu": 313,
		"./eu.js": 313,
		"./fa": 314,
		"./fa.js": 314,
		"./fi": 315,
		"./fi.js": 315,
		"./fo": 316,
		"./fo.js": 316,
		"./fr": 317,
		"./fr-ca": 318,
		"./fr-ca.js": 318,
		"./fr-ch": 319,
		"./fr-ch.js": 319,
		"./fr.js": 317,
		"./fy": 320,
		"./fy.js": 320,
		"./gd": 321,
		"./gd.js": 321,
		"./gl": 322,
		"./gl.js": 322,
		"./he": 323,
		"./he.js": 323,
		"./hi": 324,
		"./hi.js": 324,
		"./hr": 325,
		"./hr.js": 325,
		"./hu": 326,
		"./hu.js": 326,
		"./hy-am": 327,
		"./hy-am.js": 327,
		"./id": 328,
		"./id.js": 328,
		"./is": 329,
		"./is.js": 329,
		"./it": 330,
		"./it.js": 330,
		"./ja": 331,
		"./ja.js": 331,
		"./jv": 332,
		"./jv.js": 332,
		"./ka": 333,
		"./ka.js": 333,
		"./kk": 334,
		"./kk.js": 334,
		"./km": 335,
		"./km.js": 335,
		"./ko": 336,
		"./ko.js": 336,
		"./ky": 337,
		"./ky.js": 337,
		"./lb": 338,
		"./lb.js": 338,
		"./lo": 339,
		"./lo.js": 339,
		"./lt": 340,
		"./lt.js": 340,
		"./lv": 341,
		"./lv.js": 341,
		"./me": 342,
		"./me.js": 342,
		"./mi": 343,
		"./mi.js": 343,
		"./mk": 344,
		"./mk.js": 344,
		"./ml": 345,
		"./ml.js": 345,
		"./mr": 346,
		"./mr.js": 346,
		"./ms": 347,
		"./ms-my": 348,
		"./ms-my.js": 348,
		"./ms.js": 347,
		"./my": 349,
		"./my.js": 349,
		"./nb": 350,
		"./nb.js": 350,
		"./ne": 351,
		"./ne.js": 351,
		"./nl": 352,
		"./nl-be": 353,
		"./nl-be.js": 353,
		"./nl.js": 352,
		"./nn": 354,
		"./nn.js": 354,
		"./pa-in": 355,
		"./pa-in.js": 355,
		"./pl": 356,
		"./pl.js": 356,
		"./pt": 357,
		"./pt-br": 358,
		"./pt-br.js": 358,
		"./pt.js": 357,
		"./ro": 359,
		"./ro.js": 359,
		"./ru": 360,
		"./ru.js": 360,
		"./se": 361,
		"./se.js": 361,
		"./si": 362,
		"./si.js": 362,
		"./sk": 363,
		"./sk.js": 363,
		"./sl": 364,
		"./sl.js": 364,
		"./sq": 365,
		"./sq.js": 365,
		"./sr": 366,
		"./sr-cyrl": 367,
		"./sr-cyrl.js": 367,
		"./sr.js": 366,
		"./ss": 368,
		"./ss.js": 368,
		"./sv": 369,
		"./sv.js": 369,
		"./sw": 370,
		"./sw.js": 370,
		"./ta": 371,
		"./ta.js": 371,
		"./te": 372,
		"./te.js": 372,
		"./tet": 373,
		"./tet.js": 373,
		"./th": 374,
		"./th.js": 374,
		"./tl-ph": 375,
		"./tl-ph.js": 375,
		"./tlh": 376,
		"./tlh.js": 376,
		"./tr": 377,
		"./tr.js": 377,
		"./tzl": 378,
		"./tzl.js": 378,
		"./tzm": 379,
		"./tzm-latn": 380,
		"./tzm-latn.js": 380,
		"./tzm.js": 379,
		"./uk": 381,
		"./uk.js": 381,
		"./uz": 382,
		"./uz.js": 382,
		"./vi": 383,
		"./vi.js": 383,
		"./x-pseudo": 384,
		"./x-pseudo.js": 384,
		"./yo": 385,
		"./yo.js": 385,
		"./zh-cn": 386,
		"./zh-cn.js": 386,
		"./zh-hk": 387,
		"./zh-hk.js": 387,
		"./zh-tw": 388,
		"./zh-tw.js": 388
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 280;


/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Afrikaans [af]
	//! author : Werner Mollentze : https://github.com/wernerm
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var af = moment.defineLocale('af', {
	    months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
	    weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
	    weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
	    meridiemParse: /vm|nm/i,
	    isPM : function (input) {
	        return /^nm$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'vm' : 'VM';
	        } else {
	            return isLower ? 'nm' : 'NM';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Vandag om] LT',
	        nextDay : '[Môre om] LT',
	        nextWeek : 'dddd [om] LT',
	        lastDay : '[Gister om] LT',
	        lastWeek : '[Laas] dddd [om] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'oor %s',
	        past : '%s gelede',
	        s : '\'n paar sekondes',
	        m : '\'n minuut',
	        mm : '%d minute',
	        h : '\'n uur',
	        hh : '%d ure',
	        d : '\'n dag',
	        dd : '%d dae',
	        M : '\'n maand',
	        MM : '%d maande',
	        y : '\'n jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
	    },
	    week : {
	        dow : 1, // Maandag is die eerste dag van die week.
	        doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
	    }
	});
	
	return af;
	
	})));


/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic [ar]
	//! author : Abdel Said: https://github.com/abdelsaid
	//! author : Ahmed Elkhatib
	//! author : forabi https://github.com/forabi
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '١',
	    '2': '٢',
	    '3': '٣',
	    '4': '٤',
	    '5': '٥',
	    '6': '٦',
	    '7': '٧',
	    '8': '٨',
	    '9': '٩',
	    '0': '٠'
	};
	var numberMap = {
	    '١': '1',
	    '٢': '2',
	    '٣': '3',
	    '٤': '4',
	    '٥': '5',
	    '٦': '6',
	    '٧': '7',
	    '٨': '8',
	    '٩': '9',
	    '٠': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
	    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
	    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
	    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
	    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
	    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    'كانون الثاني يناير',
	    'شباط فبراير',
	    'آذار مارس',
	    'نيسان أبريل',
	    'أيار مايو',
	    'حزيران يونيو',
	    'تموز يوليو',
	    'آب أغسطس',
	    'أيلول سبتمبر',
	    'تشرين الأول أكتوبر',
	    'تشرين الثاني نوفمبر',
	    'كانون الأول ديسمبر'
	];
	
	var ar = moment.defineLocale('ar', {
	    months : months,
	    monthsShort : months,
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم عند الساعة] LT',
	        nextDay: '[غدًا عند الساعة] LT',
	        nextWeek: 'dddd [عند الساعة] LT',
	        lastDay: '[أمس عند الساعة] LT',
	        lastWeek: 'dddd [عند الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'بعد %s',
	        past : 'منذ %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ar;
	
	})));


/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Algeria) [ar-dz]
	//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var arDz = moment.defineLocale('ar-dz', {
	    months : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 4  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return arDz;
	
	})));


/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Lybia) [ar-ly]
	//! author : Ali Hmer: https://github.com/kikoanis
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '1',
	    '2': '2',
	    '3': '3',
	    '4': '4',
	    '5': '5',
	    '6': '6',
	    '7': '7',
	    '8': '8',
	    '9': '9',
	    '0': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
	    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
	    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
	    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
	    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
	    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    'يناير',
	    'فبراير',
	    'مارس',
	    'أبريل',
	    'مايو',
	    'يونيو',
	    'يوليو',
	    'أغسطس',
	    'سبتمبر',
	    'أكتوبر',
	    'نوفمبر',
	    'ديسمبر'
	];
	
	var arLy = moment.defineLocale('ar-ly', {
	    months : months,
	    monthsShort : months,
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم عند الساعة] LT',
	        nextDay: '[غدًا عند الساعة] LT',
	        nextWeek: 'dddd [عند الساعة] LT',
	        lastDay: '[أمس عند الساعة] LT',
	        lastWeek: 'dddd [عند الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'بعد %s',
	        past : 'منذ %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return arLy;
	
	})));


/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Morocco) [ar-ma]
	//! author : ElFadili Yassine : https://github.com/ElFadiliY
	//! author : Abdel Said : https://github.com/abdelsaid
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var arMa = moment.defineLocale('ar-ma', {
	    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
	    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
	    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return arMa;
	
	})));


/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Saudi Arabia) [ar-sa]
	//! author : Suhail Alkowaileet : https://github.com/xsoh
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '١',
	    '2': '٢',
	    '3': '٣',
	    '4': '٤',
	    '5': '٥',
	    '6': '٦',
	    '7': '٧',
	    '8': '٨',
	    '9': '٩',
	    '0': '٠'
	};
	var numberMap = {
	    '١': '1',
	    '٢': '2',
	    '٣': '3',
	    '٤': '4',
	    '٥': '5',
	    '٦': '6',
	    '٧': '7',
	    '٨': '8',
	    '٩': '9',
	    '٠': '0'
	};
	
	var arSa = moment.defineLocale('ar-sa', {
	    months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    preparse: function (string) {
	        return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return arSa;
	
	})));


/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale  :  Arabic (Tunisia) [ar-tn]
	//! author : Nader Toukabri : https://github.com/naderio
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var arTn = moment.defineLocale('ar-tn', {
	    months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'في %s',
	        past: 'منذ %s',
	        s: 'ثوان',
	        m: 'دقيقة',
	        mm: '%d دقائق',
	        h: 'ساعة',
	        hh: '%d ساعات',
	        d: 'يوم',
	        dd: '%d أيام',
	        M: 'شهر',
	        MM: '%d أشهر',
	        y: 'سنة',
	        yy: '%d سنوات'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return arTn;
	
	})));


/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Azerbaijani [az]
	//! author : topchiyev : https://github.com/topchiyev
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var suffixes = {
	    1: '-inci',
	    5: '-inci',
	    8: '-inci',
	    70: '-inci',
	    80: '-inci',
	    2: '-nci',
	    7: '-nci',
	    20: '-nci',
	    50: '-nci',
	    3: '-üncü',
	    4: '-üncü',
	    100: '-üncü',
	    6: '-ncı',
	    9: '-uncu',
	    10: '-uncu',
	    30: '-uncu',
	    60: '-ıncı',
	    90: '-ıncı'
	};
	
	var az = moment.defineLocale('az', {
	    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
	    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
	    weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
	    weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
	    weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bugün saat] LT',
	        nextDay : '[sabah saat] LT',
	        nextWeek : '[gələn həftə] dddd [saat] LT',
	        lastDay : '[dünən] LT',
	        lastWeek : '[keçən həftə] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s əvvəl',
	        s : 'birneçə saniyyə',
	        m : 'bir dəqiqə',
	        mm : '%d dəqiqə',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir gün',
	        dd : '%d gün',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir il',
	        yy : '%d il'
	    },
	    meridiemParse: /gecə|səhər|gündüz|axşam/,
	    isPM : function (input) {
	        return /^(gündüz|axşam)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'gecə';
	        } else if (hour < 12) {
	            return 'səhər';
	        } else if (hour < 17) {
	            return 'gündüz';
	        } else {
	            return 'axşam';
	        }
	    },
	    ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '-ıncı';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return az;
	
	})));


/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Belarusian [be]
	//! author : Dmitry Demidov : https://github.com/demidov91
	//! author: Praleska: http://praleska.pro/
	//! Author : Menelion Elensúle : https://github.com/Oire
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
	        'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
	        'dd': 'дзень_дні_дзён',
	        'MM': 'месяц_месяцы_месяцаў',
	        'yy': 'год_гады_гадоў'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'хвіліна' : 'хвіліну';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? 'гадзіна' : 'гадзіну';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	
	var be = moment.defineLocale('be', {
	    months : {
	        format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
	        standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
	    },
	    monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
	    weekdays : {
	        format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
	        standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
	        isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
	    },
	    weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
	    weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY г.',
	        LLL : 'D MMMM YYYY г., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
	    },
	    calendar : {
	        sameDay: '[Сёння ў] LT',
	        nextDay: '[Заўтра ў] LT',
	        lastDay: '[Учора ў] LT',
	        nextWeek: function () {
	            return '[У] dddd [ў] LT';
	        },
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return '[У мінулую] dddd [ў] LT';
	                case 1:
	                case 2:
	                case 4:
	                    return '[У мінулы] dddd [ў] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'праз %s',
	        past : '%s таму',
	        s : 'некалькі секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithPlural,
	        hh : relativeTimeWithPlural,
	        d : 'дзень',
	        dd : relativeTimeWithPlural,
	        M : 'месяц',
	        MM : relativeTimeWithPlural,
	        y : 'год',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /ночы|раніцы|дня|вечара/,
	    isPM : function (input) {
	        return /^(дня|вечара)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночы';
	        } else if (hour < 12) {
	            return 'раніцы';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечара';
	        }
	    },
	    ordinalParse: /\d{1,2}-(і|ы|га)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
	            case 'D':
	                return number + '-га';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return be;
	
	})));


/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bulgarian [bg]
	//! author : Krasen Borisov : https://github.com/kraz
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var bg = moment.defineLocale('bg', {
	    months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
	    monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
	    weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
	    weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
	    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[Днес в] LT',
	        nextDay : '[Утре в] LT',
	        nextWeek : 'dddd [в] LT',
	        lastDay : '[Вчера в] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[В изминалата] dddd [в] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[В изминалия] dddd [в] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'след %s',
	        past : 'преди %s',
	        s : 'няколко секунди',
	        m : 'минута',
	        mm : '%d минути',
	        h : 'час',
	        hh : '%d часа',
	        d : 'ден',
	        dd : '%d дни',
	        M : 'месец',
	        MM : '%d месеца',
	        y : 'година',
	        yy : '%d години'
	    },
	    ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-ев';
	        } else if (last2Digits === 0) {
	            return number + '-ен';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-ти';
	        } else if (lastDigit === 1) {
	            return number + '-ви';
	        } else if (lastDigit === 2) {
	            return number + '-ри';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-ми';
	        } else {
	            return number + '-ти';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return bg;
	
	})));


/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bengali [bn]
	//! author : Kaushik Gandhi : https://github.com/kaushikgandhi
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '১',
	    '2': '২',
	    '3': '৩',
	    '4': '৪',
	    '5': '৫',
	    '6': '৬',
	    '7': '৭',
	    '8': '৮',
	    '9': '৯',
	    '0': '০'
	};
	var numberMap = {
	    '১': '1',
	    '২': '2',
	    '৩': '3',
	    '৪': '4',
	    '৫': '5',
	    '৬': '6',
	    '৭': '7',
	    '৮': '8',
	    '৯': '9',
	    '০': '0'
	};
	
	var bn = moment.defineLocale('bn', {
	    months : 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
	    monthsShort : 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
	    weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
	    weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
	    weekdaysMin : 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm সময়',
	        LTS : 'A h:mm:ss সময়',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm সময়',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm সময়'
	    },
	    calendar : {
	        sameDay : '[আজ] LT',
	        nextDay : '[আগামীকাল] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[গতকাল] LT',
	        lastWeek : '[গত] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s পরে',
	        past : '%s আগে',
	        s : 'কয়েক সেকেন্ড',
	        m : 'এক মিনিট',
	        mm : '%d মিনিট',
	        h : 'এক ঘন্টা',
	        hh : '%d ঘন্টা',
	        d : 'এক দিন',
	        dd : '%d দিন',
	        M : 'এক মাস',
	        MM : '%d মাস',
	        y : 'এক বছর',
	        yy : '%d বছর'
	    },
	    preparse: function (string) {
	        return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'রাত' && hour >= 4) ||
	                (meridiem === 'দুপুর' && hour < 5) ||
	                meridiem === 'বিকাল') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'রাত';
	        } else if (hour < 10) {
	            return 'সকাল';
	        } else if (hour < 17) {
	            return 'দুপুর';
	        } else if (hour < 20) {
	            return 'বিকাল';
	        } else {
	            return 'রাত';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return bn;
	
	})));


/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tibetan [bo]
	//! author : Thupten N. Chakrishar : https://github.com/vajradog
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '༡',
	    '2': '༢',
	    '3': '༣',
	    '4': '༤',
	    '5': '༥',
	    '6': '༦',
	    '7': '༧',
	    '8': '༨',
	    '9': '༩',
	    '0': '༠'
	};
	var numberMap = {
	    '༡': '1',
	    '༢': '2',
	    '༣': '3',
	    '༤': '4',
	    '༥': '5',
	    '༦': '6',
	    '༧': '7',
	    '༨': '8',
	    '༩': '9',
	    '༠': '0'
	};
	
	var bo = moment.defineLocale('bo', {
	    months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
	    monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
	    weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
	    weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
	    weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[དི་རིང] LT',
	        nextDay : '[སང་ཉིན] LT',
	        nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
	        lastDay : '[ཁ་སང] LT',
	        lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ལ་',
	        past : '%s སྔན་ལ',
	        s : 'ལམ་སང',
	        m : 'སྐར་མ་གཅིག',
	        mm : '%d སྐར་མ',
	        h : 'ཆུ་ཚོད་གཅིག',
	        hh : '%d ཆུ་ཚོད',
	        d : 'ཉིན་གཅིག',
	        dd : '%d ཉིན་',
	        M : 'ཟླ་བ་གཅིག',
	        MM : '%d ཟླ་བ',
	        y : 'ལོ་གཅིག',
	        yy : '%d ལོ'
	    },
	    preparse: function (string) {
	        return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
	                (meridiem === 'ཉིན་གུང' && hour < 5) ||
	                meridiem === 'དགོང་དག') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'མཚན་མོ';
	        } else if (hour < 10) {
	            return 'ཞོགས་ཀས';
	        } else if (hour < 17) {
	            return 'ཉིན་གུང';
	        } else if (hour < 20) {
	            return 'དགོང་དག';
	        } else {
	            return 'མཚན་མོ';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return bo;
	
	})));


/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Breton [br]
	//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function relativeTimeWithMutation(number, withoutSuffix, key) {
	    var format = {
	        'mm': 'munutenn',
	        'MM': 'miz',
	        'dd': 'devezh'
	    };
	    return number + ' ' + mutation(format[key], number);
	}
	function specialMutationForYears(number) {
	    switch (lastNumber(number)) {
	        case 1:
	        case 3:
	        case 4:
	        case 5:
	        case 9:
	            return number + ' bloaz';
	        default:
	            return number + ' vloaz';
	    }
	}
	function lastNumber(number) {
	    if (number > 9) {
	        return lastNumber(number % 10);
	    }
	    return number;
	}
	function mutation(text, number) {
	    if (number === 2) {
	        return softMutation(text);
	    }
	    return text;
	}
	function softMutation(text) {
	    var mutationTable = {
	        'm': 'v',
	        'b': 'v',
	        'd': 'z'
	    };
	    if (mutationTable[text.charAt(0)] === undefined) {
	        return text;
	    }
	    return mutationTable[text.charAt(0)] + text.substring(1);
	}
	
	var br = moment.defineLocale('br', {
	    months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
	    monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
	    weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
	    weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
	    weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h[e]mm A',
	        LTS : 'h[e]mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [a viz] MMMM YYYY',
	        LLL : 'D [a viz] MMMM YYYY h[e]mm A',
	        LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
	    },
	    calendar : {
	        sameDay : '[Hiziv da] LT',
	        nextDay : '[Warc\'hoazh da] LT',
	        nextWeek : 'dddd [da] LT',
	        lastDay : '[Dec\'h da] LT',
	        lastWeek : 'dddd [paset da] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'a-benn %s',
	        past : '%s \'zo',
	        s : 'un nebeud segondennoù',
	        m : 'ur vunutenn',
	        mm : relativeTimeWithMutation,
	        h : 'un eur',
	        hh : '%d eur',
	        d : 'un devezh',
	        dd : relativeTimeWithMutation,
	        M : 'ur miz',
	        MM : relativeTimeWithMutation,
	        y : 'ur bloaz',
	        yy : specialMutationForYears
	    },
	    ordinalParse: /\d{1,2}(añ|vet)/,
	    ordinal : function (number) {
	        var output = (number === 1) ? 'añ' : 'vet';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return br;
	
	})));


/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bosnian [bs]
	//! author : Nedim Cholich : https://github.com/frontyard
	//! based on (hr) translation by Bojan Marković
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}
	
	var bs = moment.defineLocale('bs', {
	    months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[jučer u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return bs;
	
	})));


/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Catalan [ca]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ca = moment.defineLocale('ca', {
	    months : 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
	    monthsShort : 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
	    weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
	    weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextDay : function () {
	            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastDay : function () {
	            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'd\'aquí %s',
	        past : 'fa %s',
	        s : 'uns segons',
	        m : 'un minut',
	        mm : '%d minuts',
	        h : 'una hora',
	        hh : '%d hores',
	        d : 'un dia',
	        dd : '%d dies',
	        M : 'un mes',
	        MM : '%d mesos',
	        y : 'un any',
	        yy : '%d anys'
	    },
	    ordinalParse: /\d{1,2}(r|n|t|è|a)/,
	    ordinal : function (number, period) {
	        var output = (number === 1) ? 'r' :
	            (number === 2) ? 'n' :
	            (number === 3) ? 'r' :
	            (number === 4) ? 't' : 'è';
	        if (period === 'w' || period === 'W') {
	            output = 'a';
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return ca;
	
	})));


/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Czech [cs]
	//! author : petrbela : https://github.com/petrbela
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
	var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minuty' : 'minut');
	            } else {
	                return result + 'minutami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodin');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dny' : 'dní');
	            } else {
	                return result + 'dny';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'měsíce' : 'měsíců');
	            } else {
	                return result + 'měsíci';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'let');
	            } else {
	                return result + 'lety';
	            }
	            break;
	    }
	}
	
	var cs = moment.defineLocale('cs', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParse : (function (months, monthsShort) {
	        var i, _monthsParse = [];
	        for (i = 0; i < 12; i++) {
	            // use custom parser to solve problem with July (červenec)
	            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	        }
	        return _monthsParse;
	    }(months, monthsShort)),
	    shortMonthsParse : (function (monthsShort) {
	        var i, _shortMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
	        }
	        return _shortMonthsParse;
	    }(monthsShort)),
	    longMonthsParse : (function (months) {
	        var i, _longMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
	        }
	        return _longMonthsParse;
	    }(months)),
	    weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
	    weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
	    weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm',
	        l : 'D. M. YYYY'
	    },
	    calendar : {
	        sameDay: '[dnes v] LT',
	        nextDay: '[zítra v] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v neděli v] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [v] LT';
	                case 3:
	                    return '[ve středu v] LT';
	                case 4:
	                    return '[ve čtvrtek v] LT';
	                case 5:
	                    return '[v pátek v] LT';
	                case 6:
	                    return '[v sobotu v] LT';
	            }
	        },
	        lastDay: '[včera v] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minulou neděli v] LT';
	                case 1:
	                case 2:
	                    return '[minulé] dddd [v] LT';
	                case 3:
	                    return '[minulou středu v] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [v] LT';
	                case 6:
	                    return '[minulou sobotu v] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'před %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse : /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return cs;
	
	})));


/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chuvash [cv]
	//! author : Anatoly Mironov : https://github.com/mirontoli
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var cv = moment.defineLocale('cv', {
	    months : 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
	    monthsShort : 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
	    weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
	    weekdaysShort : 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
	    weekdaysMin : 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
	        LLL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
	        LLLL : 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
	    },
	    calendar : {
	        sameDay: '[Паян] LT [сехетре]',
	        nextDay: '[Ыран] LT [сехетре]',
	        lastDay: '[Ӗнер] LT [сехетре]',
	        nextWeek: '[Ҫитес] dddd LT [сехетре]',
	        lastWeek: '[Иртнӗ] dddd LT [сехетре]',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (output) {
	            var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
	            return output + affix;
	        },
	        past : '%s каялла',
	        s : 'пӗр-ик ҫеккунт',
	        m : 'пӗр минут',
	        mm : '%d минут',
	        h : 'пӗр сехет',
	        hh : '%d сехет',
	        d : 'пӗр кун',
	        dd : '%d кун',
	        M : 'пӗр уйӑх',
	        MM : '%d уйӑх',
	        y : 'пӗр ҫул',
	        yy : '%d ҫул'
	    },
	    ordinalParse: /\d{1,2}-мӗш/,
	    ordinal : '%d-мӗш',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return cv;
	
	})));


/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Welsh [cy]
	//! author : Robert Allen : https://github.com/robgallen
	//! author : https://github.com/ryangreaves
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var cy = moment.defineLocale('cy', {
	    months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
	    monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
	    weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
	    weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
	    weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    // time formats are the same as en-gb
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[Heddiw am] LT',
	        nextDay: '[Yfory am] LT',
	        nextWeek: 'dddd [am] LT',
	        lastDay: '[Ddoe am] LT',
	        lastWeek: 'dddd [diwethaf am] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'mewn %s',
	        past: '%s yn ôl',
	        s: 'ychydig eiliadau',
	        m: 'munud',
	        mm: '%d munud',
	        h: 'awr',
	        hh: '%d awr',
	        d: 'diwrnod',
	        dd: '%d diwrnod',
	        M: 'mis',
	        MM: '%d mis',
	        y: 'blwyddyn',
	        yy: '%d flynedd'
	    },
	    ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
	    // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
	    ordinal: function (number) {
	        var b = number,
	            output = '',
	            lookup = [
	                '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
	                'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
	            ];
	        if (b > 20) {
	            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
	                output = 'fed'; // not 30ain, 70ain or 90ain
	            } else {
	                output = 'ain';
	            }
	        } else if (b > 0) {
	            output = lookup[b];
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return cy;
	
	})));


/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Danish [da]
	//! author : Ulrik Nielsen : https://github.com/mrbase
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var da = moment.defineLocale('da', {
	    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
	    weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
	    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd [d.] D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[I dag kl.] LT',
	        nextDay : '[I morgen kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[I går kl.] LT',
	        lastWeek : '[sidste] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'få sekunder',
	        m : 'et minut',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dage',
	        M : 'en måned',
	        MM : '%d måneder',
	        y : 'et år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return da;
	
	})));


/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German [de]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elensúle: https://github.com/Oire
	//! author : Mikolaj Dadela : https://github.com/mik01aj
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}
	
	var de = moment.defineLocale('de', {
	    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return de;
	
	})));


/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German (Austria) [de-at]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elensúle: https://github.com/Oire
	//! author : Martin Groller : https://github.com/MadMG
	//! author : Mikolaj Dadela : https://github.com/mik01aj
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}
	
	var deAt = moment.defineLocale('de-at', {
	    months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return deAt;
	
	})));


/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maldivian [dv]
	//! author : Jawish Hameed : https://github.com/jawish
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var months = [
	    'ޖެނުއަރީ',
	    'ފެބްރުއަރީ',
	    'މާރިޗު',
	    'އޭޕްރީލު',
	    'މޭ',
	    'ޖޫން',
	    'ޖުލައި',
	    'އޯގަސްޓު',
	    'ސެޕްޓެމްބަރު',
	    'އޮކްޓޯބަރު',
	    'ނޮވެމްބަރު',
	    'ޑިސެމްބަރު'
	];
	var weekdays = [
	    'އާދިއްތަ',
	    'ހޯމަ',
	    'އަންގާރަ',
	    'ބުދަ',
	    'ބުރާސްފަތި',
	    'ހުކުރު',
	    'ހޮނިހިރު'
	];
	
	var dv = moment.defineLocale('dv', {
	    months : months,
	    monthsShort : months,
	    weekdays : weekdays,
	    weekdaysShort : weekdays,
	    weekdaysMin : 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
	    longDateFormat : {
	
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/M/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /މކ|މފ/,
	    isPM : function (input) {
	        return 'މފ' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'މކ';
	        } else {
	            return 'މފ';
	        }
	    },
	    calendar : {
	        sameDay : '[މިއަދު] LT',
	        nextDay : '[މާދަމާ] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[އިއްޔެ] LT',
	        lastWeek : '[ފާއިތުވި] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ތެރޭގައި %s',
	        past : 'ކުރިން %s',
	        s : 'ސިކުންތުކޮޅެއް',
	        m : 'މިނިޓެއް',
	        mm : 'މިނިޓު %d',
	        h : 'ގަޑިއިރެއް',
	        hh : 'ގަޑިއިރު %d',
	        d : 'ދުވަހެއް',
	        dd : 'ދުވަސް %d',
	        M : 'މަހެއް',
	        MM : 'މަސް %d',
	        y : 'އަހަރެއް',
	        yy : 'އަހަރު %d'
	    },
	    preparse: function (string) {
	        return string.replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/,/g, '،');
	    },
	    week : {
	        dow : 7,  // Sunday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return dv;
	
	})));


/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Greek [el]
	//! author : Aggelos Karalias : https://github.com/mehiel
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}
	
	
	var el = moment.defineLocale('el', {
	    monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
	    monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
	    months : function (momentToFormat, format) {
	        if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
	            return this._monthsGenitiveEl[momentToFormat.month()];
	        } else {
	            return this._monthsNominativeEl[momentToFormat.month()];
	        }
	    },
	    monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
	    weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
	    weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
	    weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'μμ' : 'ΜΜ';
	        } else {
	            return isLower ? 'πμ' : 'ΠΜ';
	        }
	    },
	    isPM : function (input) {
	        return ((input + '').toLowerCase()[0] === 'μ');
	    },
	    meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendarEl : {
	        sameDay : '[Σήμερα {}] LT',
	        nextDay : '[Αύριο {}] LT',
	        nextWeek : 'dddd [{}] LT',
	        lastDay : '[Χθες {}] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 6:
	                    return '[το προηγούμενο] dddd [{}] LT';
	                default:
	                    return '[την προηγούμενη] dddd [{}] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    calendar : function (key, mom) {
	        var output = this._calendarEl[key],
	            hours = mom && mom.hours();
	        if (isFunction(output)) {
	            output = output.apply(mom);
	        }
	        return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
	    },
	    relativeTime : {
	        future : 'σε %s',
	        past : '%s πριν',
	        s : 'λίγα δευτερόλεπτα',
	        m : 'ένα λεπτό',
	        mm : '%d λεπτά',
	        h : 'μία ώρα',
	        hh : '%d ώρες',
	        d : 'μία μέρα',
	        dd : '%d μέρες',
	        M : 'ένας μήνας',
	        MM : '%d μήνες',
	        y : 'ένας χρόνος',
	        yy : '%d χρόνια'
	    },
	    ordinalParse: /\d{1,2}η/,
	    ordinal: '%dη',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4st is the first week of the year.
	    }
	});
	
	return el;
	
	})));


/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Australia) [en-au]
	//! author : Jared Morse : https://github.com/jarcoal
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var enAu = moment.defineLocale('en-au', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return enAu;
	
	})));


/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Canada) [en-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var enCa = moment.defineLocale('en-ca', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'YYYY-MM-DD',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY h:mm A',
	        LLLL : 'dddd, MMMM D, YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});
	
	return enCa;
	
	})));


/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (United Kingdom) [en-gb]
	//! author : Chris Gedrim : https://github.com/chrisgedrim
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var enGb = moment.defineLocale('en-gb', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return enGb;
	
	})));


/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Ireland) [en-ie]
	//! author : Chris Cartlidge : https://github.com/chriscartlidge
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var enIe = moment.defineLocale('en-ie', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return enIe;
	
	})));


/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (New Zealand) [en-nz]
	//! author : Luke McGregor : https://github.com/lukemcgregor
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var enNz = moment.defineLocale('en-nz', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return enNz;
	
	})));


/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Esperanto [eo]
	//! author : Colin Dean : https://github.com/colindean
	//! komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
	//!          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var eo = moment.defineLocale('eo', {
	    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
	    weekdays : 'Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato'.split('_'),
	    weekdaysShort : 'Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Ĵa_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D[-an de] MMMM, YYYY',
	        LLL : 'D[-an de] MMMM, YYYY HH:mm',
	        LLLL : 'dddd, [la] D[-an de] MMMM, YYYY HH:mm'
	    },
	    meridiemParse: /[ap]\.t\.m/i,
	    isPM: function (input) {
	        return input.charAt(0).toLowerCase() === 'p';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'p.t.m.' : 'P.T.M.';
	        } else {
	            return isLower ? 'a.t.m.' : 'A.T.M.';
	        }
	    },
	    calendar : {
	        sameDay : '[Hodiaŭ je] LT',
	        nextDay : '[Morgaŭ je] LT',
	        nextWeek : 'dddd [je] LT',
	        lastDay : '[Hieraŭ je] LT',
	        lastWeek : '[pasinta] dddd [je] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'je %s',
	        past : 'antaŭ %s',
	        s : 'sekundoj',
	        m : 'minuto',
	        mm : '%d minutoj',
	        h : 'horo',
	        hh : '%d horoj',
	        d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
	        dd : '%d tagoj',
	        M : 'monato',
	        MM : '%d monatoj',
	        y : 'jaro',
	        yy : '%d jaroj'
	    },
	    ordinalParse: /\d{1,2}a/,
	    ordinal : '%da',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return eo;
	
	})));


/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish [es]
	//! author : Julio Napurí : https://github.com/julionc
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
	
	var es = moment.defineLocale('es', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un año',
	        yy : '%d años'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return es;
	
	})));


/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish (Dominican Republic) [es-do]
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
	
	var esDo = moment.defineLocale('es-do', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY h:mm A',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un año',
	        yy : '%d años'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return esDo;
	
	})));


/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Estonian [et]
	//! author : Henry Kehlmann : https://github.com/madhenry
	//! improvements : Illimar Tambek : https://github.com/ragulka
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
	        'm' : ['ühe minuti', 'üks minut'],
	        'mm': [number + ' minuti', number + ' minutit'],
	        'h' : ['ühe tunni', 'tund aega', 'üks tund'],
	        'hh': [number + ' tunni', number + ' tundi'],
	        'd' : ['ühe päeva', 'üks päev'],
	        'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
	        'MM': [number + ' kuu', number + ' kuud'],
	        'y' : ['ühe aasta', 'aasta', 'üks aasta'],
	        'yy': [number + ' aasta', number + ' aastat']
	    };
	    if (withoutSuffix) {
	        return format[key][2] ? format[key][2] : format[key][1];
	    }
	    return isFuture ? format[key][0] : format[key][1];
	}
	
	var et = moment.defineLocale('et', {
	    months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
	    monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
	    weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
	    weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
	    weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
	    longDateFormat : {
	        LT   : 'H:mm',
	        LTS : 'H:mm:ss',
	        L    : 'DD.MM.YYYY',
	        LL   : 'D. MMMM YYYY',
	        LLL  : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[Täna,] LT',
	        nextDay  : '[Homme,] LT',
	        nextWeek : '[Järgmine] dddd LT',
	        lastDay  : '[Eile,] LT',
	        lastWeek : '[Eelmine] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s pärast',
	        past   : '%s tagasi',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : '%d päeva',
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return et;
	
	})));


/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Basque [eu]
	//! author : Eneko Illarramendi : https://github.com/eillarra
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var eu = moment.defineLocale('eu', {
	    months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
	    monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
	    weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
	    weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY[ko] MMMM[ren] D[a]',
	        LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
	        LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
	        l : 'YYYY-M-D',
	        ll : 'YYYY[ko] MMM D[a]',
	        lll : 'YYYY[ko] MMM D[a] HH:mm',
	        llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
	    },
	    calendar : {
	        sameDay : '[gaur] LT[etan]',
	        nextDay : '[bihar] LT[etan]',
	        nextWeek : 'dddd LT[etan]',
	        lastDay : '[atzo] LT[etan]',
	        lastWeek : '[aurreko] dddd LT[etan]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s barru',
	        past : 'duela %s',
	        s : 'segundo batzuk',
	        m : 'minutu bat',
	        mm : '%d minutu',
	        h : 'ordu bat',
	        hh : '%d ordu',
	        d : 'egun bat',
	        dd : '%d egun',
	        M : 'hilabete bat',
	        MM : '%d hilabete',
	        y : 'urte bat',
	        yy : '%d urte'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return eu;
	
	})));


/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Persian [fa]
	//! author : Ebrahim Byagowi : https://github.com/ebraminio
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '۱',
	    '2': '۲',
	    '3': '۳',
	    '4': '۴',
	    '5': '۵',
	    '6': '۶',
	    '7': '۷',
	    '8': '۸',
	    '9': '۹',
	    '0': '۰'
	};
	var numberMap = {
	    '۱': '1',
	    '۲': '2',
	    '۳': '3',
	    '۴': '4',
	    '۵': '5',
	    '۶': '6',
	    '۷': '7',
	    '۸': '8',
	    '۹': '9',
	    '۰': '0'
	};
	
	var fa = moment.defineLocale('fa', {
	    months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	    monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	    weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	    weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	    weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /قبل از ظهر|بعد از ظهر/,
	    isPM: function (input) {
	        return /بعد از ظهر/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'قبل از ظهر';
	        } else {
	            return 'بعد از ظهر';
	        }
	    },
	    calendar : {
	        sameDay : '[امروز ساعت] LT',
	        nextDay : '[فردا ساعت] LT',
	        nextWeek : 'dddd [ساعت] LT',
	        lastDay : '[دیروز ساعت] LT',
	        lastWeek : 'dddd [پیش] [ساعت] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'در %s',
	        past : '%s پیش',
	        s : 'چندین ثانیه',
	        m : 'یک دقیقه',
	        mm : '%d دقیقه',
	        h : 'یک ساعت',
	        hh : '%d ساعت',
	        d : 'یک روز',
	        dd : '%d روز',
	        M : 'یک ماه',
	        MM : '%d ماه',
	        y : 'یک سال',
	        yy : '%d سال'
	    },
	    preparse: function (string) {
	        return string.replace(/[۰-۹]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    ordinalParse: /\d{1,2}م/,
	    ordinal : '%dم',
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12 // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return fa;
	
	})));


/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Finnish [fi]
	//! author : Tarmo Aidantausta : https://github.com/bleadof
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
	var numbersFuture = [
	        'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
	        numbersPast[7], numbersPast[8], numbersPast[9]
	    ];
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = '';
	    switch (key) {
	        case 's':
	            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
	        case 'm':
	            return isFuture ? 'minuutin' : 'minuutti';
	        case 'mm':
	            result = isFuture ? 'minuutin' : 'minuuttia';
	            break;
	        case 'h':
	            return isFuture ? 'tunnin' : 'tunti';
	        case 'hh':
	            result = isFuture ? 'tunnin' : 'tuntia';
	            break;
	        case 'd':
	            return isFuture ? 'päivän' : 'päivä';
	        case 'dd':
	            result = isFuture ? 'päivän' : 'päivää';
	            break;
	        case 'M':
	            return isFuture ? 'kuukauden' : 'kuukausi';
	        case 'MM':
	            result = isFuture ? 'kuukauden' : 'kuukautta';
	            break;
	        case 'y':
	            return isFuture ? 'vuoden' : 'vuosi';
	        case 'yy':
	            result = isFuture ? 'vuoden' : 'vuotta';
	            break;
	    }
	    result = verbalNumber(number, isFuture) + ' ' + result;
	    return result;
	}
	function verbalNumber(number, isFuture) {
	    return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
	}
	
	var fi = moment.defineLocale('fi', {
	    months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
	    monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
	    weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
	    weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'Do MMMM[ta] YYYY',
	        LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
	        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
	        l : 'D.M.YYYY',
	        ll : 'Do MMM YYYY',
	        lll : 'Do MMM YYYY, [klo] HH.mm',
	        llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
	    },
	    calendar : {
	        sameDay : '[tänään] [klo] LT',
	        nextDay : '[huomenna] [klo] LT',
	        nextWeek : 'dddd [klo] LT',
	        lastDay : '[eilen] [klo] LT',
	        lastWeek : '[viime] dddd[na] [klo] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s päästä',
	        past : '%s sitten',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return fi;
	
	})));


/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Faroese [fo]
	//! author : Ragnar Johannesen : https://github.com/ragnar123
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var fo = moment.defineLocale('fo', {
	    months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
	    weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
	    weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D. MMMM, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Í dag kl.] LT',
	        nextDay : '[Í morgin kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[Í gjár kl.] LT',
	        lastWeek : '[síðstu] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'um %s',
	        past : '%s síðani',
	        s : 'fá sekund',
	        m : 'ein minutt',
	        mm : '%d minuttir',
	        h : 'ein tími',
	        hh : '%d tímar',
	        d : 'ein dagur',
	        dd : '%d dagar',
	        M : 'ein mánaði',
	        MM : '%d mánaðir',
	        y : 'eitt ár',
	        yy : '%d ár'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return fo;
	
	})));


/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French [fr]
	//! author : John Fischer : https://github.com/jfroffice
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var fr = moment.defineLocale('fr', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : '');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return fr;
	
	})));


/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Canada) [fr-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var frCa = moment.defineLocale('fr-ca', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    }
	});
	
	return frCa;
	
	})));


/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Switzerland) [fr-ch]
	//! author : Gaspard Bucher : https://github.com/gaspard
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var frCh = moment.defineLocale('fr-ch', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return frCh;
	
	})));


/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Frisian [fy]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');
	
	var fy = moment.defineLocale('fy', {
	    months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
	    weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
	    weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[hjoed om] LT',
	        nextDay: '[moarn om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[juster om] LT',
	        lastWeek: '[ôfrûne] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'oer %s',
	        past : '%s lyn',
	        s : 'in pear sekonden',
	        m : 'ien minút',
	        mm : '%d minuten',
	        h : 'ien oere',
	        hh : '%d oeren',
	        d : 'ien dei',
	        dd : '%d dagen',
	        M : 'ien moanne',
	        MM : '%d moannen',
	        y : 'ien jier',
	        yy : '%d jierren'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return fy;
	
	})));


/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Scottish Gaelic [gd]
	//! author : Jon Ashdown : https://github.com/jonashdown
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var months = [
	    'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
	];
	
	var monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];
	
	var weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];
	
	var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];
	
	var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];
	
	var gd = moment.defineLocale('gd', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParseExact : true,
	    weekdays : weekdays,
	    weekdaysShort : weekdaysShort,
	    weekdaysMin : weekdaysMin,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[An-diugh aig] LT',
	        nextDay : '[A-màireach aig] LT',
	        nextWeek : 'dddd [aig] LT',
	        lastDay : '[An-dè aig] LT',
	        lastWeek : 'dddd [seo chaidh] [aig] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ann an %s',
	        past : 'bho chionn %s',
	        s : 'beagan diogan',
	        m : 'mionaid',
	        mm : '%d mionaidean',
	        h : 'uair',
	        hh : '%d uairean',
	        d : 'latha',
	        dd : '%d latha',
	        M : 'mìos',
	        MM : '%d mìosan',
	        y : 'bliadhna',
	        yy : '%d bliadhna'
	    },
	    ordinalParse : /\d{1,2}(d|na|mh)/,
	    ordinal : function (number) {
	        var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return gd;
	
	})));


/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Galician [gl]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var gl = moment.defineLocale('gl', {
	    months : 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
	    monthsShort : 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mé_xo_ve_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        lastDay : function () {
	            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
	        },
	        lastWeek : function () {
	            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (str) {
	            if (str.indexOf('un') === 0) {
	                return 'n' + str;
	            }
	            return 'en ' + str;
	        },
	        past : 'hai %s',
	        s : 'uns segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'unha hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un ano',
	        yy : '%d anos'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return gl;
	
	})));


/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hebrew [he]
	//! author : Tomer Cohen : https://github.com/tomer
	//! author : Moshe Simantov : https://github.com/DevelopmentIL
	//! author : Tal Ater : https://github.com/TalAter
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var he = moment.defineLocale('he', {
	    months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
	    monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
	    weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
	    weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
	    weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [ב]MMMM YYYY',
	        LLL : 'D [ב]MMMM YYYY HH:mm',
	        LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
	        l : 'D/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[היום ב־]LT',
	        nextDay : '[מחר ב־]LT',
	        nextWeek : 'dddd [בשעה] LT',
	        lastDay : '[אתמול ב־]LT',
	        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'בעוד %s',
	        past : 'לפני %s',
	        s : 'מספר שניות',
	        m : 'דקה',
	        mm : '%d דקות',
	        h : 'שעה',
	        hh : function (number) {
	            if (number === 2) {
	                return 'שעתיים';
	            }
	            return number + ' שעות';
	        },
	        d : 'יום',
	        dd : function (number) {
	            if (number === 2) {
	                return 'יומיים';
	            }
	            return number + ' ימים';
	        },
	        M : 'חודש',
	        MM : function (number) {
	            if (number === 2) {
	                return 'חודשיים';
	            }
	            return number + ' חודשים';
	        },
	        y : 'שנה',
	        yy : function (number) {
	            if (number === 2) {
	                return 'שנתיים';
	            } else if (number % 10 === 0 && number !== 10) {
	                return number + ' שנה';
	            }
	            return number + ' שנים';
	        }
	    },
	    meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
	    isPM : function (input) {
	        return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 5) {
	            return 'לפנות בוקר';
	        } else if (hour < 10) {
	            return 'בבוקר';
	        } else if (hour < 12) {
	            return isLower ? 'לפנה"צ' : 'לפני הצהריים';
	        } else if (hour < 18) {
	            return isLower ? 'אחה"צ' : 'אחרי הצהריים';
	        } else {
	            return 'בערב';
	        }
	    }
	});
	
	return he;
	
	})));


/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hindi [hi]
	//! author : Mayank Singhal : https://github.com/mayanksinghal
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};
	
	var hi = moment.defineLocale('hi', {
	    months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
	    monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
	    weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
	    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm बजे',
	        LTS : 'A h:mm:ss बजे',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm बजे',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm बजे'
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[कल] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[कल] LT',
	        lastWeek : '[पिछले] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s में',
	        past : '%s पहले',
	        s : 'कुछ ही क्षण',
	        m : 'एक मिनट',
	        mm : '%d मिनट',
	        h : 'एक घंटा',
	        hh : '%d घंटे',
	        d : 'एक दिन',
	        dd : '%d दिन',
	        M : 'एक महीने',
	        MM : '%d महीने',
	        y : 'एक वर्ष',
	        yy : '%d वर्ष'
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
	    meridiemParse: /रात|सुबह|दोपहर|शाम/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'रात') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'सुबह') {
	            return hour;
	        } else if (meridiem === 'दोपहर') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'शाम') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'रात';
	        } else if (hour < 10) {
	            return 'सुबह';
	        } else if (hour < 17) {
	            return 'दोपहर';
	        } else if (hour < 20) {
	            return 'शाम';
	        } else {
	            return 'रात';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return hi;
	
	})));


/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Croatian [hr]
	//! author : Bojan Marković : https://github.com/bmarkovic
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}
	
	var hr = moment.defineLocale('hr', {
	    months : {
	        format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
	        standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
	    },
	    monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[jučer u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return hr;
	
	})));


/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hungarian [hu]
	//! author : Adam Brunner : https://github.com/adambrunner
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
	function translate(number, withoutSuffix, key, isFuture) {
	    var num = number,
	        suffix;
	    switch (key) {
	        case 's':
	            return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
	        case 'm':
	            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'mm':
	            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'h':
	            return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'hh':
	            return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'd':
	            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'dd':
	            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'M':
	            return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'MM':
	            return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'y':
	            return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
	        case 'yy':
	            return num + (isFuture || withoutSuffix ? ' év' : ' éve');
	    }
	    return '';
	}
	function week(isFuture) {
	    return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
	}
	
	var hu = moment.defineLocale('hu', {
	    months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
	    monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
	    weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
	    weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
	    weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY.MM.DD.',
	        LL : 'YYYY. MMMM D.',
	        LLL : 'YYYY. MMMM D. H:mm',
	        LLLL : 'YYYY. MMMM D., dddd H:mm'
	    },
	    meridiemParse: /de|du/i,
	    isPM: function (input) {
	        return input.charAt(1).toLowerCase() === 'u';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower === true ? 'de' : 'DE';
	        } else {
	            return isLower === true ? 'du' : 'DU';
	        }
	    },
	    calendar : {
	        sameDay : '[ma] LT[-kor]',
	        nextDay : '[holnap] LT[-kor]',
	        nextWeek : function () {
	            return week.call(this, true);
	        },
	        lastDay : '[tegnap] LT[-kor]',
	        lastWeek : function () {
	            return week.call(this, false);
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s múlva',
	        past : '%s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return hu;
	
	})));


/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Armenian [hy-am]
	//! author : Armendarabyan : https://github.com/armendarabyan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var hyAm = moment.defineLocale('hy-am', {
	    months : {
	        format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
	        standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
	    },
	    monthsShort : 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
	    weekdays : 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
	    weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
	    weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY թ.',
	        LLL : 'D MMMM YYYY թ., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY թ., HH:mm'
	    },
	    calendar : {
	        sameDay: '[այսօր] LT',
	        nextDay: '[վաղը] LT',
	        lastDay: '[երեկ] LT',
	        nextWeek: function () {
	            return 'dddd [օրը ժամը] LT';
	        },
	        lastWeek: function () {
	            return '[անցած] dddd [օրը ժամը] LT';
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s հետո',
	        past : '%s առաջ',
	        s : 'մի քանի վայրկյան',
	        m : 'րոպե',
	        mm : '%d րոպե',
	        h : 'ժամ',
	        hh : '%d ժամ',
	        d : 'օր',
	        dd : '%d օր',
	        M : 'ամիս',
	        MM : '%d ամիս',
	        y : 'տարի',
	        yy : '%d տարի'
	    },
	    meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
	    isPM: function (input) {
	        return /^(ցերեկվա|երեկոյան)$/.test(input);
	    },
	    meridiem : function (hour) {
	        if (hour < 4) {
	            return 'գիշերվա';
	        } else if (hour < 12) {
	            return 'առավոտվա';
	        } else if (hour < 17) {
	            return 'ցերեկվա';
	        } else {
	            return 'երեկոյան';
	        }
	    },
	    ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'DDD':
	            case 'w':
	            case 'W':
	            case 'DDDo':
	                if (number === 1) {
	                    return number + '-ին';
	                }
	                return number + '-րդ';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return hyAm;
	
	})));


/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Indonesian [id]
	//! author : Mohammad Satrio Utomo : https://github.com/tyok
	//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var id = moment.defineLocale('id', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|siang|sore|malam/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'siang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sore' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'siang';
	        } else if (hours < 19) {
	            return 'sore';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Besok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kemarin pukul] LT',
	        lastWeek : 'dddd [lalu pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lalu',
	        s : 'beberapa detik',
	        m : 'semenit',
	        mm : '%d menit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return id;
	
	})));


/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Icelandic [is]
	//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function plural(n) {
	    if (n % 100 === 11) {
	        return true;
	    } else if (n % 10 === 1) {
	        return false;
	    }
	    return true;
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
	        case 'm':
	            return withoutSuffix ? 'mínúta' : 'mínútu';
	        case 'mm':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
	            } else if (withoutSuffix) {
	                return result + 'mínúta';
	            }
	            return result + 'mínútu';
	        case 'hh':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
	            }
	            return result + 'klukkustund';
	        case 'd':
	            if (withoutSuffix) {
	                return 'dagur';
	            }
	            return isFuture ? 'dag' : 'degi';
	        case 'dd':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'dagar';
	                }
	                return result + (isFuture ? 'daga' : 'dögum');
	            } else if (withoutSuffix) {
	                return result + 'dagur';
	            }
	            return result + (isFuture ? 'dag' : 'degi');
	        case 'M':
	            if (withoutSuffix) {
	                return 'mánuður';
	            }
	            return isFuture ? 'mánuð' : 'mánuði';
	        case 'MM':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'mánuðir';
	                }
	                return result + (isFuture ? 'mánuði' : 'mánuðum');
	            } else if (withoutSuffix) {
	                return result + 'mánuður';
	            }
	            return result + (isFuture ? 'mánuð' : 'mánuði');
	        case 'y':
	            return withoutSuffix || isFuture ? 'ár' : 'ári';
	        case 'yy':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
	            }
	            return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
	    }
	}
	
	var is = moment.defineLocale('is', {
	    months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
	    weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
	    weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
	    weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
	    },
	    calendar : {
	        sameDay : '[í dag kl.] LT',
	        nextDay : '[á morgun kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[í gær kl.] LT',
	        lastWeek : '[síðasta] dddd [kl.] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'eftir %s',
	        past : 'fyrir %s síðan',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : 'klukkustund',
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return is;
	
	})));


/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Italian [it]
	//! author : Lorenzo : https://github.com/aliem
	//! author: Mattia Larentis: https://github.com/nostalgiaz
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var it = moment.defineLocale('it', {
	    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
	    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
	    weekdays : 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
	    weekdaysShort : 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
	    weekdaysMin : 'Do_Lu_Ma_Me_Gi_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Oggi alle] LT',
	        nextDay: '[Domani alle] LT',
	        nextWeek: 'dddd [alle] LT',
	        lastDay: '[Ieri alle] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[la scorsa] dddd [alle] LT';
	                default:
	                    return '[lo scorso] dddd [alle] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
	        },
	        past : '%s fa',
	        s : 'alcuni secondi',
	        m : 'un minuto',
	        mm : '%d minuti',
	        h : 'un\'ora',
	        hh : '%d ore',
	        d : 'un giorno',
	        dd : '%d giorni',
	        M : 'un mese',
	        MM : '%d mesi',
	        y : 'un anno',
	        yy : '%d anni'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal: '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return it;
	
	})));


/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Japanese [ja]
	//! author : LI Long : https://github.com/baryon
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ja = moment.defineLocale('ja', {
	    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
	    weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
	    weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
	    longDateFormat : {
	        LT : 'Ah時m分',
	        LTS : 'Ah時m分s秒',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY年M月D日',
	        LLL : 'YYYY年M月D日Ah時m分',
	        LLLL : 'YYYY年M月D日Ah時m分 dddd'
	    },
	    meridiemParse: /午前|午後/i,
	    isPM : function (input) {
	        return input === '午後';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '午前';
	        } else {
	            return '午後';
	        }
	    },
	    calendar : {
	        sameDay : '[今日] LT',
	        nextDay : '[明日] LT',
	        nextWeek : '[来週]dddd LT',
	        lastDay : '[昨日] LT',
	        lastWeek : '[前週]dddd LT',
	        sameElse : 'L'
	    },
	    ordinalParse : /\d{1,2}日/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '日';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s後',
	        past : '%s前',
	        s : '数秒',
	        m : '1分',
	        mm : '%d分',
	        h : '1時間',
	        hh : '%d時間',
	        d : '1日',
	        dd : '%d日',
	        M : '1ヶ月',
	        MM : '%dヶ月',
	        y : '1年',
	        yy : '%d年'
	    }
	});
	
	return ja;
	
	})));


/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Javanese [jv]
	//! author : Rony Lantip : https://github.com/lantip
	//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var jv = moment.defineLocale('jv', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
	    weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /enjing|siyang|sonten|ndalu/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'enjing') {
	            return hour;
	        } else if (meridiem === 'siyang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'enjing';
	        } else if (hours < 15) {
	            return 'siyang';
	        } else if (hours < 19) {
	            return 'sonten';
	        } else {
	            return 'ndalu';
	        }
	    },
	    calendar : {
	        sameDay : '[Dinten puniko pukul] LT',
	        nextDay : '[Mbenjang pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kala wingi pukul] LT',
	        lastWeek : 'dddd [kepengker pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'wonten ing %s',
	        past : '%s ingkang kepengker',
	        s : 'sawetawis detik',
	        m : 'setunggal menit',
	        mm : '%d menit',
	        h : 'setunggal jam',
	        hh : '%d jam',
	        d : 'sedinten',
	        dd : '%d dinten',
	        M : 'sewulan',
	        MM : '%d wulan',
	        y : 'setaun',
	        yy : '%d taun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return jv;
	
	})));


/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Georgian [ka]
	//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ka = moment.defineLocale('ka', {
	    months : {
	        standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
	        format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
	    },
	    monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
	    weekdays : {
	        standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
	        format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
	        isFormat: /(წინა|შემდეგ)/
	    },
	    weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
	    weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[დღეს] LT[-ზე]',
	        nextDay : '[ხვალ] LT[-ზე]',
	        lastDay : '[გუშინ] LT[-ზე]',
	        nextWeek : '[შემდეგ] dddd LT[-ზე]',
	        lastWeek : '[წინა] dddd LT-ზე',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
	                s.replace(/ი$/, 'ში') :
	                s + 'ში';
	        },
	        past : function (s) {
	            if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
	                return s.replace(/(ი|ე)$/, 'ის წინ');
	            }
	            if ((/წელი/).test(s)) {
	                return s.replace(/წელი$/, 'წლის წინ');
	            }
	        },
	        s : 'რამდენიმე წამი',
	        m : 'წუთი',
	        mm : '%d წუთი',
	        h : 'საათი',
	        hh : '%d საათი',
	        d : 'დღე',
	        dd : '%d დღე',
	        M : 'თვე',
	        MM : '%d თვე',
	        y : 'წელი',
	        yy : '%d წელი'
	    },
	    ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
	    ordinal : function (number) {
	        if (number === 0) {
	            return number;
	        }
	        if (number === 1) {
	            return number + '-ლი';
	        }
	        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
	            return 'მე-' + number;
	        }
	        return number + '-ე';
	    },
	    week : {
	        dow : 1,
	        doy : 7
	    }
	});
	
	return ka;
	
	})));


/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kazakh [kk]
	//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var suffixes = {
	    0: '-ші',
	    1: '-ші',
	    2: '-ші',
	    3: '-ші',
	    4: '-ші',
	    5: '-ші',
	    6: '-шы',
	    7: '-ші',
	    8: '-ші',
	    9: '-шы',
	    10: '-шы',
	    20: '-шы',
	    30: '-шы',
	    40: '-шы',
	    50: '-ші',
	    60: '-шы',
	    70: '-ші',
	    80: '-ші',
	    90: '-шы',
	    100: '-ші'
	};
	
	var kk = moment.defineLocale('kk', {
	    months : 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
	    monthsShort : 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
	    weekdays : 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
	    weekdaysShort : 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
	    weekdaysMin : 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бүгін сағат] LT',
	        nextDay : '[Ертең сағат] LT',
	        nextWeek : 'dddd [сағат] LT',
	        lastDay : '[Кеше сағат] LT',
	        lastWeek : '[Өткен аптаның] dddd [сағат] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ішінде',
	        past : '%s бұрын',
	        s : 'бірнеше секунд',
	        m : 'бір минут',
	        mm : '%d минут',
	        h : 'бір сағат',
	        hh : '%d сағат',
	        d : 'бір күн',
	        dd : '%d күн',
	        M : 'бір ай',
	        MM : '%d ай',
	        y : 'бір жыл',
	        yy : '%d жыл'
	    },
	    ordinalParse: /\d{1,2}-(ші|шы)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return kk;
	
	})));


/***/ },
/* 335 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Cambodian [km]
	//! author : Kruy Vanna : https://github.com/kruyvanna
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var km = moment.defineLocale('km', {
	    months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
	    monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
	    weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
	        nextDay: '[ស្អែក ម៉ោង] LT',
	        nextWeek: 'dddd [ម៉ោង] LT',
	        lastDay: '[ម្សិលមិញ ម៉ោង] LT',
	        lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: '%sទៀត',
	        past: '%sមុន',
	        s: 'ប៉ុន្មានវិនាទី',
	        m: 'មួយនាទី',
	        mm: '%d នាទី',
	        h: 'មួយម៉ោង',
	        hh: '%d ម៉ោង',
	        d: 'មួយថ្ងៃ',
	        dd: '%d ថ្ងៃ',
	        M: 'មួយខែ',
	        MM: '%d ខែ',
	        y: 'មួយឆ្នាំ',
	        yy: '%d ឆ្នាំ'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return km;
	
	})));


/***/ },
/* 336 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Korean [ko]
	//! author : Kyungwook, Park : https://github.com/kyungw00k
	//! author : Jeeeyul Lee <jeeeyul@gmail.com>
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ko = moment.defineLocale('ko', {
	    months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
	    monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
	    weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
	    weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
	    weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
	    longDateFormat : {
	        LT : 'A h시 m분',
	        LTS : 'A h시 m분 s초',
	        L : 'YYYY.MM.DD',
	        LL : 'YYYY년 MMMM D일',
	        LLL : 'YYYY년 MMMM D일 A h시 m분',
	        LLLL : 'YYYY년 MMMM D일 dddd A h시 m분'
	    },
	    calendar : {
	        sameDay : '오늘 LT',
	        nextDay : '내일 LT',
	        nextWeek : 'dddd LT',
	        lastDay : '어제 LT',
	        lastWeek : '지난주 dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s 후',
	        past : '%s 전',
	        s : '몇 초',
	        ss : '%d초',
	        m : '일분',
	        mm : '%d분',
	        h : '한 시간',
	        hh : '%d시간',
	        d : '하루',
	        dd : '%d일',
	        M : '한 달',
	        MM : '%d달',
	        y : '일 년',
	        yy : '%d년'
	    },
	    ordinalParse : /\d{1,2}일/,
	    ordinal : '%d일',
	    meridiemParse : /오전|오후/,
	    isPM : function (token) {
	        return token === '오후';
	    },
	    meridiem : function (hour, minute, isUpper) {
	        return hour < 12 ? '오전' : '오후';
	    }
	});
	
	return ko;
	
	})));


/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kyrgyz [ky]
	//! author : Chyngyz Arystan uulu : https://github.com/chyngyz
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	
	var suffixes = {
	    0: '-чү',
	    1: '-чи',
	    2: '-чи',
	    3: '-чү',
	    4: '-чү',
	    5: '-чи',
	    6: '-чы',
	    7: '-чи',
	    8: '-чи',
	    9: '-чу',
	    10: '-чу',
	    20: '-чы',
	    30: '-чу',
	    40: '-чы',
	    50: '-чү',
	    60: '-чы',
	    70: '-чи',
	    80: '-чи',
	    90: '-чу',
	    100: '-чү'
	};
	
	var ky = moment.defineLocale('ky', {
	    months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
	    monthsShort : 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
	    weekdays : 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
	    weekdaysShort : 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
	    weekdaysMin : 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бүгүн саат] LT',
	        nextDay : '[Эртең саат] LT',
	        nextWeek : 'dddd [саат] LT',
	        lastDay : '[Кече саат] LT',
	        lastWeek : '[Өткен аптанын] dddd [күнү] [саат] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ичинде',
	        past : '%s мурун',
	        s : 'бирнече секунд',
	        m : 'бир мүнөт',
	        mm : '%d мүнөт',
	        h : 'бир саат',
	        hh : '%d саат',
	        d : 'бир күн',
	        dd : '%d күн',
	        M : 'бир ай',
	        MM : '%d ай',
	        y : 'бир жыл',
	        yy : '%d жыл'
	    },
	    ordinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ky;
	
	})));


/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Luxembourgish [lb]
	//! author : mweimerskirch : https://github.com/mweimerskirch
	//! author : David Raison : https://github.com/kwisatz
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eng Minutt', 'enger Minutt'],
	        'h': ['eng Stonn', 'enger Stonn'],
	        'd': ['een Dag', 'engem Dag'],
	        'M': ['ee Mount', 'engem Mount'],
	        'y': ['ee Joer', 'engem Joer']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}
	function processFutureTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'a ' + string;
	    }
	    return 'an ' + string;
	}
	function processPastTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'viru ' + string;
	    }
	    return 'virun ' + string;
	}
	/**
	 * Returns true if the word before the given number loses the '-n' ending.
	 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
	 *
	 * @param number {integer}
	 * @returns {boolean}
	 */
	function eifelerRegelAppliesToNumber(number) {
	    number = parseInt(number, 10);
	    if (isNaN(number)) {
	        return false;
	    }
	    if (number < 0) {
	        // Negative Number --> always true
	        return true;
	    } else if (number < 10) {
	        // Only 1 digit
	        if (4 <= number && number <= 7) {
	            return true;
	        }
	        return false;
	    } else if (number < 100) {
	        // 2 digits
	        var lastDigit = number % 10, firstDigit = number / 10;
	        if (lastDigit === 0) {
	            return eifelerRegelAppliesToNumber(firstDigit);
	        }
	        return eifelerRegelAppliesToNumber(lastDigit);
	    } else if (number < 10000) {
	        // 3 or 4 digits --> recursively check first digit
	        while (number >= 10) {
	            number = number / 10;
	        }
	        return eifelerRegelAppliesToNumber(number);
	    } else {
	        // Anything larger than 4 digits: recursively check first n-3 digits
	        number = number / 1000;
	        return eifelerRegelAppliesToNumber(number);
	    }
	}
	
	var lb = moment.defineLocale('lb', {
	    months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
	    weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
	    weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm [Auer]',
	        LTS: 'H:mm:ss [Auer]',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm [Auer]',
	        LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
	    },
	    calendar: {
	        sameDay: '[Haut um] LT',
	        sameElse: 'L',
	        nextDay: '[Muer um] LT',
	        nextWeek: 'dddd [um] LT',
	        lastDay: '[Gëschter um] LT',
	        lastWeek: function () {
	            // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
	            switch (this.day()) {
	                case 2:
	                case 4:
	                    return '[Leschten] dddd [um] LT';
	                default:
	                    return '[Leschte] dddd [um] LT';
	            }
	        }
	    },
	    relativeTime : {
	        future : processFutureTime,
	        past : processPastTime,
	        s : 'e puer Sekonnen',
	        m : processRelativeTime,
	        mm : '%d Minutten',
	        h : processRelativeTime,
	        hh : '%d Stonnen',
	        d : processRelativeTime,
	        dd : '%d Deeg',
	        M : processRelativeTime,
	        MM : '%d Méint',
	        y : processRelativeTime,
	        yy : '%d Joer'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal: '%d.',
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return lb;
	
	})));


/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lao [lo]
	//! author : Ryan Hart : https://github.com/ryanhart2
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var lo = moment.defineLocale('lo', {
	    months : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
	    monthsShort : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
	    weekdays : 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
	    weekdaysShort : 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
	    weekdaysMin : 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'ວັນdddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
	    isPM: function (input) {
	        return input === 'ຕອນແລງ';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ຕອນເຊົ້າ';
	        } else {
	            return 'ຕອນແລງ';
	        }
	    },
	    calendar : {
	        sameDay : '[ມື້ນີ້ເວລາ] LT',
	        nextDay : '[ມື້ອື່ນເວລາ] LT',
	        nextWeek : '[ວັນ]dddd[ໜ້າເວລາ] LT',
	        lastDay : '[ມື້ວານນີ້ເວລາ] LT',
	        lastWeek : '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ອີກ %s',
	        past : '%sຜ່ານມາ',
	        s : 'ບໍ່ເທົ່າໃດວິນາທີ',
	        m : '1 ນາທີ',
	        mm : '%d ນາທີ',
	        h : '1 ຊົ່ວໂມງ',
	        hh : '%d ຊົ່ວໂມງ',
	        d : '1 ມື້',
	        dd : '%d ມື້',
	        M : '1 ເດືອນ',
	        MM : '%d ເດືອນ',
	        y : '1 ປີ',
	        yy : '%d ປີ'
	    },
	    ordinalParse: /(ທີ່)\d{1,2}/,
	    ordinal : function (number) {
	        return 'ທີ່' + number;
	    }
	});
	
	return lo;
	
	})));


/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lithuanian [lt]
	//! author : Mindaugas Mozūras : https://github.com/mmozuras
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var units = {
	    'm' : 'minutė_minutės_minutę',
	    'mm': 'minutės_minučių_minutes',
	    'h' : 'valanda_valandos_valandą',
	    'hh': 'valandos_valandų_valandas',
	    'd' : 'diena_dienos_dieną',
	    'dd': 'dienos_dienų_dienas',
	    'M' : 'mėnuo_mėnesio_mėnesį',
	    'MM': 'mėnesiai_mėnesių_mėnesius',
	    'y' : 'metai_metų_metus',
	    'yy': 'metai_metų_metus'
	};
	function translateSeconds(number, withoutSuffix, key, isFuture) {
	    if (withoutSuffix) {
	        return 'kelios sekundės';
	    } else {
	        return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
	    }
	}
	function translateSingular(number, withoutSuffix, key, isFuture) {
	    return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
	}
	function special(number) {
	    return number % 10 === 0 || (number > 10 && number < 20);
	}
	function forms(key) {
	    return units[key].split('_');
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    if (number === 1) {
	        return result + translateSingular(number, withoutSuffix, key[0], isFuture);
	    } else if (withoutSuffix) {
	        return result + (special(number) ? forms(key)[1] : forms(key)[0]);
	    } else {
	        if (isFuture) {
	            return result + forms(key)[1];
	        } else {
	            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
	        }
	    }
	}
	var lt = moment.defineLocale('lt', {
	    months : {
	        format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
	        standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
	        isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
	    },
	    monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
	    weekdays : {
	        format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
	        standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
	        isFormat: /dddd HH:mm/
	    },
	    weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
	    weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY [m.] MMMM D [d.]',
	        LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY [m.] MMMM D [d.]',
	        lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
	    },
	    calendar : {
	        sameDay : '[Šiandien] LT',
	        nextDay : '[Rytoj] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[Vakar] LT',
	        lastWeek : '[Praėjusį] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'po %s',
	        past : 'prieš %s',
	        s : translateSeconds,
	        m : translateSingular,
	        mm : translate,
	        h : translateSingular,
	        hh : translate,
	        d : translateSingular,
	        dd : translate,
	        M : translateSingular,
	        MM : translate,
	        y : translateSingular,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}-oji/,
	    ordinal : function (number) {
	        return number + '-oji';
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return lt;
	
	})));


/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Latvian [lv]
	//! author : Kristaps Karlsons : https://github.com/skakri
	//! author : Jānis Elmeris : https://github.com/JanisE
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var units = {
	    'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
	    'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
	    'h': 'stundas_stundām_stunda_stundas'.split('_'),
	    'hh': 'stundas_stundām_stunda_stundas'.split('_'),
	    'd': 'dienas_dienām_diena_dienas'.split('_'),
	    'dd': 'dienas_dienām_diena_dienas'.split('_'),
	    'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
	    'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
	    'y': 'gada_gadiem_gads_gadi'.split('_'),
	    'yy': 'gada_gadiem_gads_gadi'.split('_')
	};
	/**
	 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
	 */
	function format(forms, number, withoutSuffix) {
	    if (withoutSuffix) {
	        // E.g. "21 minūte", "3 minūtes".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
	    } else {
	        // E.g. "21 minūtes" as in "pēc 21 minūtes".
	        // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
	    }
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    return number + ' ' + format(units[key], number, withoutSuffix);
	}
	function relativeTimeWithSingular(number, withoutSuffix, key) {
	    return format(units[key], number, withoutSuffix);
	}
	function relativeSeconds(number, withoutSuffix) {
	    return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
	}
	
	var lv = moment.defineLocale('lv', {
	    months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
	    weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY.',
	        LL : 'YYYY. [gada] D. MMMM',
	        LLL : 'YYYY. [gada] D. MMMM, HH:mm',
	        LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
	    },
	    calendar : {
	        sameDay : '[Šodien pulksten] LT',
	        nextDay : '[Rīt pulksten] LT',
	        nextWeek : 'dddd [pulksten] LT',
	        lastDay : '[Vakar pulksten] LT',
	        lastWeek : '[Pagājušā] dddd [pulksten] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'pēc %s',
	        past : 'pirms %s',
	        s : relativeSeconds,
	        m : relativeTimeWithSingular,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithSingular,
	        hh : relativeTimeWithPlural,
	        d : relativeTimeWithSingular,
	        dd : relativeTimeWithPlural,
	        M : relativeTimeWithSingular,
	        MM : relativeTimeWithPlural,
	        y : relativeTimeWithSingular,
	        yy : relativeTimeWithPlural
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return lv;
	
	})));


/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Montenegrin [me]
	//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jednog minuta'],
	        mm: ['minut', 'minuta', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mjesec', 'mjeseca', 'mjeseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};
	
	var me = moment.defineLocale('me', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sjutra u] LT',
	
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[juče u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[prošle] [nedjelje] [u] LT',
	                '[prošlog] [ponedjeljka] [u] LT',
	                '[prošlog] [utorka] [u] LT',
	                '[prošle] [srijede] [u] LT',
	                '[prošlog] [četvrtka] [u] LT',
	                '[prošlog] [petka] [u] LT',
	                '[prošle] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mjesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return me;
	
	})));


/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maori [mi]
	//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var mi = moment.defineLocale('mi', {
	    months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
	    monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
	    monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
	    weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
	    weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
	    weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY [i] HH:mm',
	        LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
	    },
	    calendar: {
	        sameDay: '[i teie mahana, i] LT',
	        nextDay: '[apopo i] LT',
	        nextWeek: 'dddd [i] LT',
	        lastDay: '[inanahi i] LT',
	        lastWeek: 'dddd [whakamutunga i] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'i roto i %s',
	        past: '%s i mua',
	        s: 'te hēkona ruarua',
	        m: 'he meneti',
	        mm: '%d meneti',
	        h: 'te haora',
	        hh: '%d haora',
	        d: 'he ra',
	        dd: '%d ra',
	        M: 'he marama',
	        MM: '%d marama',
	        y: 'he tau',
	        yy: '%d tau'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal: '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return mi;
	
	})));


/***/ },
/* 344 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Macedonian [mk]
	//! author : Borislav Mickov : https://github.com/B0k0
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var mk = moment.defineLocale('mk', {
	    months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
	    monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
	    weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
	    weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
	    weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[Денес во] LT',
	        nextDay : '[Утре во] LT',
	        nextWeek : '[Во] dddd [во] LT',
	        lastDay : '[Вчера во] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[Изминатата] dddd [во] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[Изминатиот] dddd [во] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'после %s',
	        past : 'пред %s',
	        s : 'неколку секунди',
	        m : 'минута',
	        mm : '%d минути',
	        h : 'час',
	        hh : '%d часа',
	        d : 'ден',
	        dd : '%d дена',
	        M : 'месец',
	        MM : '%d месеци',
	        y : 'година',
	        yy : '%d години'
	    },
	    ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-ев';
	        } else if (last2Digits === 0) {
	            return number + '-ен';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-ти';
	        } else if (lastDigit === 1) {
	            return number + '-ви';
	        } else if (lastDigit === 2) {
	            return number + '-ри';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-ми';
	        } else {
	            return number + '-ти';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return mk;
	
	})));


/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malayalam [ml]
	//! author : Floyd Pink : https://github.com/floydpink
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ml = moment.defineLocale('ml', {
	    months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
	    monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
	    weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
	    weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm -നു',
	        LTS : 'A h:mm:ss -നു',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm -നു',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm -നു'
	    },
	    calendar : {
	        sameDay : '[ഇന്ന്] LT',
	        nextDay : '[നാളെ] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[ഇന്നലെ] LT',
	        lastWeek : '[കഴിഞ്ഞ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s കഴിഞ്ഞ്',
	        past : '%s മുൻപ്',
	        s : 'അൽപ നിമിഷങ്ങൾ',
	        m : 'ഒരു മിനിറ്റ്',
	        mm : '%d മിനിറ്റ്',
	        h : 'ഒരു മണിക്കൂർ',
	        hh : '%d മണിക്കൂർ',
	        d : 'ഒരു ദിവസം',
	        dd : '%d ദിവസം',
	        M : 'ഒരു മാസം',
	        MM : '%d മാസം',
	        y : 'ഒരു വർഷം',
	        yy : '%d വർഷം'
	    },
	    meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'രാത്രി' && hour >= 4) ||
	                meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
	                meridiem === 'വൈകുന്നേരം') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'രാത്രി';
	        } else if (hour < 12) {
	            return 'രാവിലെ';
	        } else if (hour < 17) {
	            return 'ഉച്ച കഴിഞ്ഞ്';
	        } else if (hour < 20) {
	            return 'വൈകുന്നേരം';
	        } else {
	            return 'രാത്രി';
	        }
	    }
	});
	
	return ml;
	
	})));


/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Marathi [mr]
	//! author : Harshad Kale : https://github.com/kalehv
	//! author : Vivek Athalye : https://github.com/vnathalye
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};
	
	function relativeTimeMr(number, withoutSuffix, string, isFuture)
	{
	    var output = '';
	    if (withoutSuffix) {
	        switch (string) {
	            case 's': output = 'काही सेकंद'; break;
	            case 'm': output = 'एक मिनिट'; break;
	            case 'mm': output = '%d मिनिटे'; break;
	            case 'h': output = 'एक तास'; break;
	            case 'hh': output = '%d तास'; break;
	            case 'd': output = 'एक दिवस'; break;
	            case 'dd': output = '%d दिवस'; break;
	            case 'M': output = 'एक महिना'; break;
	            case 'MM': output = '%d महिने'; break;
	            case 'y': output = 'एक वर्ष'; break;
	            case 'yy': output = '%d वर्षे'; break;
	        }
	    }
	    else {
	        switch (string) {
	            case 's': output = 'काही सेकंदां'; break;
	            case 'm': output = 'एका मिनिटा'; break;
	            case 'mm': output = '%d मिनिटां'; break;
	            case 'h': output = 'एका तासा'; break;
	            case 'hh': output = '%d तासां'; break;
	            case 'd': output = 'एका दिवसा'; break;
	            case 'dd': output = '%d दिवसां'; break;
	            case 'M': output = 'एका महिन्या'; break;
	            case 'MM': output = '%d महिन्यां'; break;
	            case 'y': output = 'एका वर्षा'; break;
	            case 'yy': output = '%d वर्षां'; break;
	        }
	    }
	    return output.replace(/%d/i, number);
	}
	
	var mr = moment.defineLocale('mr', {
	    months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
	    monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
	    weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
	    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm वाजता',
	        LTS : 'A h:mm:ss वाजता',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm वाजता',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm वाजता'
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[उद्या] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[काल] LT',
	        lastWeek: '[मागील] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future: '%sमध्ये',
	        past: '%sपूर्वी',
	        s: relativeTimeMr,
	        m: relativeTimeMr,
	        mm: relativeTimeMr,
	        h: relativeTimeMr,
	        hh: relativeTimeMr,
	        d: relativeTimeMr,
	        dd: relativeTimeMr,
	        M: relativeTimeMr,
	        MM: relativeTimeMr,
	        y: relativeTimeMr,
	        yy: relativeTimeMr
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'रात्री') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'सकाळी') {
	            return hour;
	        } else if (meridiem === 'दुपारी') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'सायंकाळी') {
	            return hour + 12;
	        }
	    },
	    meridiem: function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'रात्री';
	        } else if (hour < 10) {
	            return 'सकाळी';
	        } else if (hour < 17) {
	            return 'दुपारी';
	        } else if (hour < 20) {
	            return 'सायंकाळी';
	        } else {
	            return 'रात्री';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return mr;
	
	})));


/***/ },
/* 347 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms]
	//! author : Weldan Jamili : https://github.com/weldan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ms = moment.defineLocale('ms', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ms;
	
	})));


/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms-my]
	//! note : DEPRECATED, the correct one is [ms]
	//! author : Weldan Jamili : https://github.com/weldan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var msMy = moment.defineLocale('ms-my', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return msMy;
	
	})));


/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Burmese [my]
	//! author : Squar team, mysquar.com
	//! author : David Rossellat : https://github.com/gholadr
	//! author : Tin Aung Lin : https://github.com/thanyawzinmin
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '၁',
	    '2': '၂',
	    '3': '၃',
	    '4': '၄',
	    '5': '၅',
	    '6': '၆',
	    '7': '၇',
	    '8': '၈',
	    '9': '၉',
	    '0': '၀'
	};
	var numberMap = {
	    '၁': '1',
	    '၂': '2',
	    '၃': '3',
	    '၄': '4',
	    '၅': '5',
	    '၆': '6',
	    '၇': '7',
	    '၈': '8',
	    '၉': '9',
	    '၀': '0'
	};
	
	var my = moment.defineLocale('my', {
	    months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
	    monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
	    weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
	    weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
	    weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
	
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[ယနေ.] LT [မှာ]',
	        nextDay: '[မနက်ဖြန်] LT [မှာ]',
	        nextWeek: 'dddd LT [မှာ]',
	        lastDay: '[မနေ.က] LT [မှာ]',
	        lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'လာမည့် %s မှာ',
	        past: 'လွန်ခဲ့သော %s က',
	        s: 'စက္ကန်.အနည်းငယ်',
	        m: 'တစ်မိနစ်',
	        mm: '%d မိနစ်',
	        h: 'တစ်နာရီ',
	        hh: '%d နာရီ',
	        d: 'တစ်ရက်',
	        dd: '%d ရက်',
	        M: 'တစ်လ',
	        MM: '%d လ',
	        y: 'တစ်နှစ်',
	        yy: '%d နှစ်'
	    },
	    preparse: function (string) {
	        return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return my;
	
	})));


/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Norwegian Bokmål [nb]
	//! authors : Espen Hovlandsdal : https://github.com/rexxars
	//!           Sigurd Gartmann : https://github.com/sigurdga
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var nb = moment.defineLocale('nb', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
	    weekdaysShort : 'sø._ma._ti._on._to._fr._lø.'.split('_'),
	    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[i dag kl.] LT',
	        nextDay: '[i morgen kl.] LT',
	        nextWeek: 'dddd [kl.] LT',
	        lastDay: '[i går kl.] LT',
	        lastWeek: '[forrige] dddd [kl.] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'noen sekunder',
	        m : 'ett minutt',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dager',
	        M : 'en måned',
	        MM : '%d måneder',
	        y : 'ett år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return nb;
	
	})));


/***/ },
/* 351 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nepalese [ne]
	//! author : suvash : https://github.com/suvash
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};
	
	var ne = moment.defineLocale('ne', {
	    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
	    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
	    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
	    weekdaysMin : 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'Aको h:mm बजे',
	        LTS : 'Aको h:mm:ss बजे',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, Aको h:mm बजे',
	        LLLL : 'dddd, D MMMM YYYY, Aको h:mm बजे'
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'राति') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'बिहान') {
	            return hour;
	        } else if (meridiem === 'दिउँसो') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'साँझ') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 3) {
	            return 'राति';
	        } else if (hour < 12) {
	            return 'बिहान';
	        } else if (hour < 16) {
	            return 'दिउँसो';
	        } else if (hour < 20) {
	            return 'साँझ';
	        } else {
	            return 'राति';
	        }
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[भोलि] LT',
	        nextWeek : '[आउँदो] dddd[,] LT',
	        lastDay : '[हिजो] LT',
	        lastWeek : '[गएको] dddd[,] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%sमा',
	        past : '%s अगाडि',
	        s : 'केही क्षण',
	        m : 'एक मिनेट',
	        mm : '%d मिनेट',
	        h : 'एक घण्टा',
	        hh : '%d घण्टा',
	        d : 'एक दिन',
	        dd : '%d दिन',
	        M : 'एक महिना',
	        MM : '%d महिना',
	        y : 'एक बर्ष',
	        yy : '%d बर्ष'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ne;
	
	})));


/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch [nl]
	//! author : Joris Röling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');
	
	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
	
	var nl = moment.defineLocale('nl', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	
	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
	
	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,
	
	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : 'één minuut',
	        mm : '%d minuten',
	        h : 'één uur',
	        hh : '%d uur',
	        d : 'één dag',
	        dd : '%d dagen',
	        M : 'één maand',
	        MM : '%d maanden',
	        y : 'één jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return nl;
	
	})));


/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch (Belgium) [nl-be]
	//! author : Joris Röling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');
	
	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
	
	var nlBe = moment.defineLocale('nl-be', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	
	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
	
	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,
	
	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : 'één minuut',
	        mm : '%d minuten',
	        h : 'één uur',
	        hh : '%d uur',
	        d : 'één dag',
	        dd : '%d dagen',
	        M : 'één maand',
	        MM : '%d maanden',
	        y : 'één jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return nlBe;
	
	})));


/***/ },
/* 354 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nynorsk [nn]
	//! author : https://github.com/mechuwind
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var nn = moment.defineLocale('nn', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
	    weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
	    weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[I dag klokka] LT',
	        nextDay: '[I morgon klokka] LT',
	        nextWeek: 'dddd [klokka] LT',
	        lastDay: '[I går klokka] LT',
	        lastWeek: '[Føregåande] dddd [klokka] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s sidan',
	        s : 'nokre sekund',
	        m : 'eit minutt',
	        mm : '%d minutt',
	        h : 'ein time',
	        hh : '%d timar',
	        d : 'ein dag',
	        dd : '%d dagar',
	        M : 'ein månad',
	        MM : '%d månader',
	        y : 'eit år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return nn;
	
	})));


/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Punjabi (India) [pa-in]
	//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '੧',
	    '2': '੨',
	    '3': '੩',
	    '4': '੪',
	    '5': '੫',
	    '6': '੬',
	    '7': '੭',
	    '8': '੮',
	    '9': '੯',
	    '0': '੦'
	};
	var numberMap = {
	    '੧': '1',
	    '੨': '2',
	    '੩': '3',
	    '੪': '4',
	    '੫': '5',
	    '੬': '6',
	    '੭': '7',
	    '੮': '8',
	    '੯': '9',
	    '੦': '0'
	};
	
	var paIn = moment.defineLocale('pa-in', {
	    // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
	    months : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
	    monthsShort : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
	    weekdays : 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
	    weekdaysShort : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
	    weekdaysMin : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ਵਜੇ',
	        LTS : 'A h:mm:ss ਵਜੇ',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ਵਜੇ',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
	    },
	    calendar : {
	        sameDay : '[ਅਜ] LT',
	        nextDay : '[ਕਲ] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[ਕਲ] LT',
	        lastWeek : '[ਪਿਛਲੇ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ਵਿੱਚ',
	        past : '%s ਪਿਛਲੇ',
	        s : 'ਕੁਝ ਸਕਿੰਟ',
	        m : 'ਇਕ ਮਿੰਟ',
	        mm : '%d ਮਿੰਟ',
	        h : 'ਇੱਕ ਘੰਟਾ',
	        hh : '%d ਘੰਟੇ',
	        d : 'ਇੱਕ ਦਿਨ',
	        dd : '%d ਦਿਨ',
	        M : 'ਇੱਕ ਮਹੀਨਾ',
	        MM : '%d ਮਹੀਨੇ',
	        y : 'ਇੱਕ ਸਾਲ',
	        yy : '%d ਸਾਲ'
	    },
	    preparse: function (string) {
	        return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
	    meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'ਰਾਤ') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'ਸਵੇਰ') {
	            return hour;
	        } else if (meridiem === 'ਦੁਪਹਿਰ') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'ਸ਼ਾਮ') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ਰਾਤ';
	        } else if (hour < 10) {
	            return 'ਸਵੇਰ';
	        } else if (hour < 17) {
	            return 'ਦੁਪਹਿਰ';
	        } else if (hour < 20) {
	            return 'ਸ਼ਾਮ';
	        } else {
	            return 'ਰਾਤ';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return paIn;
	
	})));


/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Polish [pl]
	//! author : Rafal Hirsz : https://github.com/evoL
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
	var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
	function plural(n) {
	    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
	}
	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'minuta' : 'minutę';
	        case 'mm':
	            return result + (plural(number) ? 'minuty' : 'minut');
	        case 'h':
	            return withoutSuffix  ? 'godzina'  : 'godzinę';
	        case 'hh':
	            return result + (plural(number) ? 'godziny' : 'godzin');
	        case 'MM':
	            return result + (plural(number) ? 'miesiące' : 'miesięcy');
	        case 'yy':
	            return result + (plural(number) ? 'lata' : 'lat');
	    }
	}
	
	var pl = moment.defineLocale('pl', {
	    months : function (momentToFormat, format) {
	        if (format === '') {
	            // Hack: if format empty we know this is used to generate
	            // RegExp by moment. Give then back both valid forms of months
	            // in RegExp ready format.
	            return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
	        } else if (/D MMMM/.test(format)) {
	            return monthsSubjective[momentToFormat.month()];
	        } else {
	            return monthsNominative[momentToFormat.month()];
	        }
	    },
	    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
	    weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
	    weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
	    weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Dziś o] LT',
	        nextDay: '[Jutro o] LT',
	        nextWeek: '[W] dddd [o] LT',
	        lastDay: '[Wczoraj o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[W zeszłą niedzielę o] LT';
	                case 3:
	                    return '[W zeszłą środę o] LT';
	                case 6:
	                    return '[W zeszłą sobotę o] LT';
	                default:
	                    return '[W zeszły] dddd [o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : '%s temu',
	        s : 'kilka sekund',
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : '1 dzień',
	        dd : '%d dni',
	        M : 'miesiąc',
	        MM : translate,
	        y : 'rok',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return pl;
	
	})));


/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese [pt]
	//! author : Jefferson : https://github.com/jalex79
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var pt = moment.defineLocale('pt', {
	    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
	    weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : 'há %s',
	        s : 'segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um mês',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return pt;
	
	})));


/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese (Brazil) [pt-br]
	//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var ptBr = moment.defineLocale('pt-br', {
	    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
	    weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : '%s atrás',
	        s : 'poucos segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um mês',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal : '%dº'
	});
	
	return ptBr;
	
	})));


/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Romanian [ro]
	//! author : Vlad Gurdiga : https://github.com/gurdiga
	//! author : Valentin Agachi : https://github.com/avaly
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	            'mm': 'minute',
	            'hh': 'ore',
	            'dd': 'zile',
	            'MM': 'luni',
	            'yy': 'ani'
	        },
	        separator = ' ';
	    if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
	        separator = ' de ';
	    }
	    return number + separator + format[key];
	}
	
	var ro = moment.defineLocale('ro', {
	    months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
	    monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
	    weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
	    weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[azi la] LT',
	        nextDay: '[mâine la] LT',
	        nextWeek: 'dddd [la] LT',
	        lastDay: '[ieri la] LT',
	        lastWeek: '[fosta] dddd [la] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'peste %s',
	        past : '%s în urmă',
	        s : 'câteva secunde',
	        m : 'un minut',
	        mm : relativeTimeWithPlural,
	        h : 'o oră',
	        hh : relativeTimeWithPlural,
	        d : 'o zi',
	        dd : relativeTimeWithPlural,
	        M : 'o lună',
	        MM : relativeTimeWithPlural,
	        y : 'un an',
	        yy : relativeTimeWithPlural
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ro;
	
	})));


/***/ },
/* 360 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Russian [ru]
	//! author : Viktorminator : https://github.com/Viktorminator
	//! Author : Menelion Elensúle : https://github.com/Oire
	//! author : Коренберг Марк : https://github.com/socketpair
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
	        'hh': 'час_часа_часов',
	        'dd': 'день_дня_дней',
	        'MM': 'месяц_месяца_месяцев',
	        'yy': 'год_года_лет'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'минута' : 'минуту';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];
	
	// http://new.gramota.ru/spravka/rules/139-prop : § 103
	// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
	// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
	var ru = moment.defineLocale('ru', {
	    months : {
	        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
	        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
	    },
	    monthsShort : {
	        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
	        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
	        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
	    },
	    weekdays : {
	        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
	        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
	        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
	    },
	    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
	    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,
	
	    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
	    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
	
	    // копия предыдущего
	    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
	
	    // полные названия с падежами
	    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
	
	    // Выражение, которое соотвествует только сокращённым формам
	    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY г.',
	        LLL : 'D MMMM YYYY г., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
	    },
	    calendar : {
	        sameDay: '[Сегодня в] LT',
	        nextDay: '[Завтра в] LT',
	        lastDay: '[Вчера в] LT',
	        nextWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[В следующее] dddd [в] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[В следующий] dddd [в] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[В следующую] dddd [в] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[Во] dddd [в] LT';
	                } else {
	                    return '[В] dddd [в] LT';
	                }
	            }
	        },
	        lastWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[В прошлое] dddd [в] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[В прошлый] dddd [в] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[В прошлую] dddd [в] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[Во] dddd [в] LT';
	                } else {
	                    return '[В] dddd [в] LT';
	                }
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'через %s',
	        past : '%s назад',
	        s : 'несколько секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : 'час',
	        hh : relativeTimeWithPlural,
	        d : 'день',
	        dd : relativeTimeWithPlural,
	        M : 'месяц',
	        MM : relativeTimeWithPlural,
	        y : 'год',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /ночи|утра|дня|вечера/i,
	    isPM : function (input) {
	        return /^(дня|вечера)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночи';
	        } else if (hour < 12) {
	            return 'утра';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечера';
	        }
	    },
	    ordinalParse: /\d{1,2}-(й|го|я)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            case 'w':
	            case 'W':
	                return number + '-я';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ru;
	
	})));


/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Northern Sami [se]
	//! authors : Bård Rolstad Henriksen : https://github.com/karamell
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	
	var se = moment.defineLocale('se', {
	    months : 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
	    monthsShort : 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
	    weekdays : 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
	    weekdaysShort : 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
	    weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'MMMM D. [b.] YYYY',
	        LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
	        LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[otne ti] LT',
	        nextDay: '[ihttin ti] LT',
	        nextWeek: 'dddd [ti] LT',
	        lastDay: '[ikte ti] LT',
	        lastWeek: '[ovddit] dddd [ti] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s geažes',
	        past : 'maŋit %s',
	        s : 'moadde sekunddat',
	        m : 'okta minuhta',
	        mm : '%d minuhtat',
	        h : 'okta diimmu',
	        hh : '%d diimmut',
	        d : 'okta beaivi',
	        dd : '%d beaivvit',
	        M : 'okta mánnu',
	        MM : '%d mánut',
	        y : 'okta jahki',
	        yy : '%d jagit'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return se;
	
	})));


/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Sinhalese [si]
	//! author : Sampath Sitinamaluwa : https://github.com/sampathsris
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	/*jshint -W100*/
	var si = moment.defineLocale('si', {
	    months : 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
	    monthsShort : 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
	    weekdays : 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
	    weekdaysShort : 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
	    weekdaysMin : 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'a h:mm',
	        LTS : 'a h:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY MMMM D',
	        LLL : 'YYYY MMMM D, a h:mm',
	        LLLL : 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
	    },
	    calendar : {
	        sameDay : '[අද] LT[ට]',
	        nextDay : '[හෙට] LT[ට]',
	        nextWeek : 'dddd LT[ට]',
	        lastDay : '[ඊයේ] LT[ට]',
	        lastWeek : '[පසුගිය] dddd LT[ට]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%sකින්',
	        past : '%sකට පෙර',
	        s : 'තත්පර කිහිපය',
	        m : 'මිනිත්තුව',
	        mm : 'මිනිත්තු %d',
	        h : 'පැය',
	        hh : 'පැය %d',
	        d : 'දිනය',
	        dd : 'දින %d',
	        M : 'මාසය',
	        MM : 'මාස %d',
	        y : 'වසර',
	        yy : 'වසර %d'
	    },
	    ordinalParse: /\d{1,2} වැනි/,
	    ordinal : function (number) {
	        return number + ' වැනි';
	    },
	    meridiemParse : /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
	    isPM : function (input) {
	        return input === 'ප.ව.' || input === 'පස් වරු';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'ප.ව.' : 'පස් වරු';
	        } else {
	            return isLower ? 'පෙ.ව.' : 'පෙර වරු';
	        }
	    }
	});
	
	return si;
	
	})));


/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovak [sk]
	//! author : Martin Minka : https://github.com/k2s
	//! based on work of petrbela : https://github.com/petrbela
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
	var monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minúty' : 'minút');
	            } else {
	                return result + 'minútami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodín');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dni' : 'dní');
	            } else {
	                return result + 'dňami';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'mesiace' : 'mesiacov');
	            } else {
	                return result + 'mesiacmi';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'rokov');
	            } else {
	                return result + 'rokmi';
	            }
	            break;
	    }
	}
	
	var sk = moment.defineLocale('sk', {
	    months : months,
	    monthsShort : monthsShort,
	    weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
	    weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
	    weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[dnes o] LT',
	        nextDay: '[zajtra o] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [o] LT';
	                case 3:
	                    return '[v stredu o] LT';
	                case 4:
	                    return '[vo štvrtok o] LT';
	                case 5:
	                    return '[v piatok o] LT';
	                case 6:
	                    return '[v sobotu o] LT';
	            }
	        },
	        lastDay: '[včera o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minulú nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[minulý] dddd [o] LT';
	                case 3:
	                    return '[minulú stredu o] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [o] LT';
	                case 6:
	                    return '[minulú sobotu o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'pred %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return sk;
	
	})));


/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovenian [sl]
	//! author : Robert Sedovšek : https://github.com/sedovsek
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
	        case 'm':
	            return withoutSuffix ? 'ena minuta' : 'eno minuto';
	        case 'mm':
	            if (number === 1) {
	                result += withoutSuffix ? 'minuta' : 'minuto';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'minute' : 'minutami';
	            } else {
	                result += withoutSuffix || isFuture ? 'minut' : 'minutami';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'ena ura' : 'eno uro';
	        case 'hh':
	            if (number === 1) {
	                result += withoutSuffix ? 'ura' : 'uro';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'uri' : 'urama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'ure' : 'urami';
	            } else {
	                result += withoutSuffix || isFuture ? 'ur' : 'urami';
	            }
	            return result;
	        case 'd':
	            return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
	        case 'dd':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'dan' : 'dnem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
	            } else {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
	            }
	            return result;
	        case 'M':
	            return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
	        case 'MM':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
	            } else {
	                result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
	            }
	            return result;
	        case 'y':
	            return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
	        case 'yy':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'leto' : 'letom';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'leti' : 'letoma';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'leta' : 'leti';
	            } else {
	                result += withoutSuffix || isFuture ? 'let' : 'leti';
	            }
	            return result;
	    }
	}
	
	var sl = moment.defineLocale('sl', {
	    months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
	    weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
	    weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danes ob] LT',
	        nextDay  : '[jutri ob] LT',
	
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v] [nedeljo] [ob] LT';
	                case 3:
	                    return '[v] [sredo] [ob] LT';
	                case 6:
	                    return '[v] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[v] dddd [ob] LT';
	            }
	        },
	        lastDay  : '[včeraj ob] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[prejšnjo] [nedeljo] [ob] LT';
	                case 3:
	                    return '[prejšnjo] [sredo] [ob] LT';
	                case 6:
	                    return '[prejšnjo] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prejšnji] dddd [ob] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'čez %s',
	        past   : 'pred %s',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : processRelativeTime,
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return sl;
	
	})));


/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Albanian [sq]
	//! author : Flakërim Ismani : https://github.com/flakerimi
	//! author : Menelion Elensúle : https://github.com/Oire
	//! author : Oerd Cukalla : https://github.com/oerd
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var sq = moment.defineLocale('sq', {
	    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
	    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
	    weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
	    weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
	    weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /PD|MD/,
	    isPM: function (input) {
	        return input.charAt(0) === 'M';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        return hours < 12 ? 'PD' : 'MD';
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Sot në] LT',
	        nextDay : '[Nesër në] LT',
	        nextWeek : 'dddd [në] LT',
	        lastDay : '[Dje në] LT',
	        lastWeek : 'dddd [e kaluar në] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'në %s',
	        past : '%s më parë',
	        s : 'disa sekonda',
	        m : 'një minutë',
	        mm : '%d minuta',
	        h : 'një orë',
	        hh : '%d orë',
	        d : 'një ditë',
	        dd : '%d ditë',
	        M : 'një muaj',
	        MM : '%d muaj',
	        y : 'një vit',
	        yy : '%d vite'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return sq;
	
	})));


/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian [sr]
	//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jedne minute'],
	        mm: ['minut', 'minute', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mesec', 'meseca', 'meseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};
	
	var sr = moment.defineLocale('sr', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sutra u] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedelju] [u] LT';
	                case 3:
	                    return '[u] [sredu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[juče u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[prošle] [nedelje] [u] LT',
	                '[prošlog] [ponedeljka] [u] LT',
	                '[prošlog] [utorka] [u] LT',
	                '[prošle] [srede] [u] LT',
	                '[prošlog] [četvrtka] [u] LT',
	                '[prošlog] [petka] [u] LT',
	                '[prošle] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'pre %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return sr;
	
	})));


/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian Cyrillic [sr-cyrl]
	//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var translator = {
	    words: { //Different grammatical cases
	        m: ['један минут', 'једне минуте'],
	        mm: ['минут', 'минуте', 'минута'],
	        h: ['један сат', 'једног сата'],
	        hh: ['сат', 'сата', 'сати'],
	        dd: ['дан', 'дана', 'дана'],
	        MM: ['месец', 'месеца', 'месеци'],
	        yy: ['година', 'године', 'година']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};
	
	var srCyrl = moment.defineLocale('sr-cyrl', {
	    months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
	    monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
	    monthsParseExact: true,
	    weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
	    weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
	    weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[данас у] LT',
	        nextDay: '[сутра у] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[у] [недељу] [у] LT';
	                case 3:
	                    return '[у] [среду] [у] LT';
	                case 6:
	                    return '[у] [суботу] [у] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[у] dddd [у] LT';
	            }
	        },
	        lastDay  : '[јуче у] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[прошле] [недеље] [у] LT',
	                '[прошлог] [понедељка] [у] LT',
	                '[прошлог] [уторка] [у] LT',
	                '[прошле] [среде] [у] LT',
	                '[прошлог] [четвртка] [у] LT',
	                '[прошлог] [петка] [у] LT',
	                '[прошле] [суботе] [у] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'за %s',
	        past   : 'пре %s',
	        s      : 'неколико секунди',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'дан',
	        dd     : translator.translate,
	        M      : 'месец',
	        MM     : translator.translate,
	        y      : 'годину',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return srCyrl;
	
	})));


/***/ },
/* 368 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : siSwati [ss]
	//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	
	var ss = moment.defineLocale('ss', {
	    months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
	    monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
	    weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
	    weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
	    weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Namuhla nga] LT',
	        nextDay : '[Kusasa nga] LT',
	        nextWeek : 'dddd [nga] LT',
	        lastDay : '[Itolo nga] LT',
	        lastWeek : 'dddd [leliphelile] [nga] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'nga %s',
	        past : 'wenteka nga %s',
	        s : 'emizuzwana lomcane',
	        m : 'umzuzu',
	        mm : '%d emizuzu',
	        h : 'lihora',
	        hh : '%d emahora',
	        d : 'lilanga',
	        dd : '%d emalanga',
	        M : 'inyanga',
	        MM : '%d tinyanga',
	        y : 'umnyaka',
	        yy : '%d iminyaka'
	    },
	    meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'ekuseni';
	        } else if (hours < 15) {
	            return 'emini';
	        } else if (hours < 19) {
	            return 'entsambama';
	        } else {
	            return 'ebusuku';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'ekuseni') {
	            return hour;
	        } else if (meridiem === 'emini') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
	            if (hour === 0) {
	                return 0;
	            }
	            return hour + 12;
	        }
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : '%d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return ss;
	
	})));


/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swedish [sv]
	//! author : Jens Alm : https://github.com/ulmus
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var sv = moment.defineLocale('sv', {
	    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
	    weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
	    weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Idag] LT',
	        nextDay: '[Imorgon] LT',
	        lastDay: '[Igår] LT',
	        nextWeek: '[På] dddd LT',
	        lastWeek: '[I] dddd[s] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : 'för %s sedan',
	        s : 'några sekunder',
	        m : 'en minut',
	        mm : '%d minuter',
	        h : 'en timme',
	        hh : '%d timmar',
	        d : 'en dag',
	        dd : '%d dagar',
	        M : 'en månad',
	        MM : '%d månader',
	        y : 'ett år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}(e|a)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'e' :
	            (b === 1) ? 'a' :
	            (b === 2) ? 'a' :
	            (b === 3) ? 'e' : 'e';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return sv;
	
	})));


/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swahili [sw]
	//! author : Fahad Kassim : https://github.com/fadsel
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var sw = moment.defineLocale('sw', {
	    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
	    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
	    weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[leo saa] LT',
	        nextDay : '[kesho saa] LT',
	        nextWeek : '[wiki ijayo] dddd [saat] LT',
	        lastDay : '[jana] LT',
	        lastWeek : '[wiki iliyopita] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s baadaye',
	        past : 'tokea %s',
	        s : 'hivi punde',
	        m : 'dakika moja',
	        mm : 'dakika %d',
	        h : 'saa limoja',
	        hh : 'masaa %d',
	        d : 'siku moja',
	        dd : 'masiku %d',
	        M : 'mwezi mmoja',
	        MM : 'miezi %d',
	        y : 'mwaka mmoja',
	        yy : 'miaka %d'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return sw;
	
	})));


/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tamil [ta]
	//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var symbolMap = {
	    '1': '௧',
	    '2': '௨',
	    '3': '௩',
	    '4': '௪',
	    '5': '௫',
	    '6': '௬',
	    '7': '௭',
	    '8': '௮',
	    '9': '௯',
	    '0': '௦'
	};
	var numberMap = {
	    '௧': '1',
	    '௨': '2',
	    '௩': '3',
	    '௪': '4',
	    '௫': '5',
	    '௬': '6',
	    '௭': '7',
	    '௮': '8',
	    '௯': '9',
	    '௦': '0'
	};
	
	var ta = moment.defineLocale('ta', {
	    months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
	    monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
	    weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
	    weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
	    weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, HH:mm',
	        LLLL : 'dddd, D MMMM YYYY, HH:mm'
	    },
	    calendar : {
	        sameDay : '[இன்று] LT',
	        nextDay : '[நாளை] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[நேற்று] LT',
	        lastWeek : '[கடந்த வாரம்] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s இல்',
	        past : '%s முன்',
	        s : 'ஒரு சில விநாடிகள்',
	        m : 'ஒரு நிமிடம்',
	        mm : '%d நிமிடங்கள்',
	        h : 'ஒரு மணி நேரம்',
	        hh : '%d மணி நேரம்',
	        d : 'ஒரு நாள்',
	        dd : '%d நாட்கள்',
	        M : 'ஒரு மாதம்',
	        MM : '%d மாதங்கள்',
	        y : 'ஒரு வருடம்',
	        yy : '%d ஆண்டுகள்'
	    },
	    ordinalParse: /\d{1,2}வது/,
	    ordinal : function (number) {
	        return number + 'வது';
	    },
	    preparse: function (string) {
	        return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // refer http://ta.wikipedia.org/s/1er1
	    meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 2) {
	            return ' யாமம்';
	        } else if (hour < 6) {
	            return ' வைகறை';  // வைகறை
	        } else if (hour < 10) {
	            return ' காலை'; // காலை
	        } else if (hour < 14) {
	            return ' நண்பகல்'; // நண்பகல்
	        } else if (hour < 18) {
	            return ' எற்பாடு'; // எற்பாடு
	        } else if (hour < 22) {
	            return ' மாலை'; // மாலை
	        } else {
	            return ' யாமம்';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'யாமம்') {
	            return hour < 2 ? hour : hour + 12;
	        } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
	            return hour;
	        } else if (meridiem === 'நண்பகல்') {
	            return hour >= 10 ? hour : hour + 12;
	        } else {
	            return hour + 12;
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return ta;
	
	})));


/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Telugu [te]
	//! author : Krishna Chaitanya Thota : https://github.com/kcthota
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var te = moment.defineLocale('te', {
	    months : 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
	    monthsShort : 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
	    weekdaysShort : 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
	    weekdaysMin : 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[నేడు] LT',
	        nextDay : '[రేపు] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[నిన్న] LT',
	        lastWeek : '[గత] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s లో',
	        past : '%s క్రితం',
	        s : 'కొన్ని క్షణాలు',
	        m : 'ఒక నిమిషం',
	        mm : '%d నిమిషాలు',
	        h : 'ఒక గంట',
	        hh : '%d గంటలు',
	        d : 'ఒక రోజు',
	        dd : '%d రోజులు',
	        M : 'ఒక నెల',
	        MM : '%d నెలలు',
	        y : 'ఒక సంవత్సరం',
	        yy : '%d సంవత్సరాలు'
	    },
	    ordinalParse : /\d{1,2}వ/,
	    ordinal : '%dవ',
	    meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'రాత్రి') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'ఉదయం') {
	            return hour;
	        } else if (meridiem === 'మధ్యాహ్నం') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'సాయంత్రం') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'రాత్రి';
	        } else if (hour < 10) {
	            return 'ఉదయం';
	        } else if (hour < 17) {
	            return 'మధ్యాహ్నం';
	        } else if (hour < 20) {
	            return 'సాయంత్రం';
	        } else {
	            return 'రాత్రి';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return te;
	
	})));


/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tetun Dili (East Timor) [tet]
	//! author : Joshua Brooks : https://github.com/joshbrooks
	//! author : Onorio De J. Afonso : https://github.com/marobo
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var tet = moment.defineLocale('tet', {
	    months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
	    weekdaysMin : 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Ohin iha] LT',
	        nextDay: '[Aban iha] LT',
	        nextWeek: 'dddd [iha] LT',
	        lastDay: '[Horiseik iha] LT',
	        lastWeek: 'dddd [semana kotuk] [iha] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'iha %s',
	        past : '%s liuba',
	        s : 'minutu balun',
	        m : 'minutu ida',
	        mm : 'minutus %d',
	        h : 'horas ida',
	        hh : 'horas %d',
	        d : 'loron ida',
	        dd : 'loron %d',
	        M : 'fulan ida',
	        MM : 'fulan %d',
	        y : 'tinan ida',
	        yy : 'tinan %d'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return tet;
	
	})));


/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Thai [th]
	//! author : Kridsada Thanabulpong : https://github.com/sirn
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var th = moment.defineLocale('th', {
	    months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
	    monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
	    weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
	    weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY เวลา H:mm',
	        LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
	    },
	    meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
	    isPM: function (input) {
	        return input === 'หลังเที่ยง';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ก่อนเที่ยง';
	        } else {
	            return 'หลังเที่ยง';
	        }
	    },
	    calendar : {
	        sameDay : '[วันนี้ เวลา] LT',
	        nextDay : '[พรุ่งนี้ เวลา] LT',
	        nextWeek : 'dddd[หน้า เวลา] LT',
	        lastDay : '[เมื่อวานนี้ เวลา] LT',
	        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'อีก %s',
	        past : '%sที่แล้ว',
	        s : 'ไม่กี่วินาที',
	        m : '1 นาที',
	        mm : '%d นาที',
	        h : '1 ชั่วโมง',
	        hh : '%d ชั่วโมง',
	        d : '1 วัน',
	        dd : '%d วัน',
	        M : '1 เดือน',
	        MM : '%d เดือน',
	        y : '1 ปี',
	        yy : '%d ปี'
	    }
	});
	
	return th;
	
	})));


/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tagalog (Philippines) [tl-ph]
	//! author : Dan Hagman : https://github.com/hagmandan
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var tlPh = moment.defineLocale('tl-ph', {
	    months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
	    monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
	    weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
	    weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
	    weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'MM/D/YYYY',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY HH:mm',
	        LLLL : 'dddd, MMMM DD, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: 'LT [ngayong araw]',
	        nextDay: '[Bukas ng] LT',
	        nextWeek: 'LT [sa susunod na] dddd',
	        lastDay: 'LT [kahapon]',
	        lastWeek: 'LT [noong nakaraang] dddd',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'sa loob ng %s',
	        past : '%s ang nakalipas',
	        s : 'ilang segundo',
	        m : 'isang minuto',
	        mm : '%d minuto',
	        h : 'isang oras',
	        hh : '%d oras',
	        d : 'isang araw',
	        dd : '%d araw',
	        M : 'isang buwan',
	        MM : '%d buwan',
	        y : 'isang taon',
	        yy : '%d taon'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return tlPh;
	
	})));


/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Klingon [tlh]
	//! author : Dominika Kruk : https://github.com/amaranthrose
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');
	
	function translateFuture(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'leS' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'waQ' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'nem' :
	    time + ' pIq';
	    return time;
	}
	
	function translatePast(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'Hu’' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'wen' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'ben' :
	    time + ' ret';
	    return time;
	}
	
	function translate(number, withoutSuffix, string, isFuture) {
	    var numberNoun = numberAsNoun(number);
	    switch (string) {
	        case 'mm':
	            return numberNoun + ' tup';
	        case 'hh':
	            return numberNoun + ' rep';
	        case 'dd':
	            return numberNoun + ' jaj';
	        case 'MM':
	            return numberNoun + ' jar';
	        case 'yy':
	            return numberNoun + ' DIS';
	    }
	}
	
	function numberAsNoun(number) {
	    var hundred = Math.floor((number % 1000) / 100),
	    ten = Math.floor((number % 100) / 10),
	    one = number % 10,
	    word = '';
	    if (hundred > 0) {
	        word += numbersNouns[hundred] + 'vatlh';
	    }
	    if (ten > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
	    }
	    if (one > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[one];
	    }
	    return (word === '') ? 'pagh' : word;
	}
	
	var tlh = moment.defineLocale('tlh', {
	    months : 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
	    monthsShort : 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[DaHjaj] LT',
	        nextDay: '[wa’leS] LT',
	        nextWeek: 'LLL',
	        lastDay: '[wa’Hu’] LT',
	        lastWeek: 'LLL',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : translateFuture,
	        past : translatePast,
	        s : 'puS lup',
	        m : 'wa’ tup',
	        mm : translate,
	        h : 'wa’ rep',
	        hh : translate,
	        d : 'wa’ jaj',
	        dd : translate,
	        M : 'wa’ jar',
	        MM : translate,
	        y : 'wa’ DIS',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return tlh;
	
	})));


/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Turkish [tr]
	//! authors : Erhan Gundogan : https://github.com/erhangundogan,
	//!           Burak Yiğit Kaya: https://github.com/BYK
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var suffixes = {
	    1: '\'inci',
	    5: '\'inci',
	    8: '\'inci',
	    70: '\'inci',
	    80: '\'inci',
	    2: '\'nci',
	    7: '\'nci',
	    20: '\'nci',
	    50: '\'nci',
	    3: '\'üncü',
	    4: '\'üncü',
	    100: '\'üncü',
	    6: '\'ncı',
	    9: '\'uncu',
	    10: '\'uncu',
	    30: '\'uncu',
	    60: '\'ıncı',
	    90: '\'ıncı'
	};
	
	var tr = moment.defineLocale('tr', {
	    months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
	    monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
	    weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
	    weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
	    weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bugün saat] LT',
	        nextDay : '[yarın saat] LT',
	        nextWeek : '[haftaya] dddd [saat] LT',
	        lastDay : '[dün] LT',
	        lastWeek : '[geçen hafta] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s önce',
	        s : 'birkaç saniye',
	        m : 'bir dakika',
	        mm : '%d dakika',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir gün',
	        dd : '%d gün',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir yıl',
	        yy : '%d yıl'
	    },
	    ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '\'ıncı';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return tr;
	
	})));


/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Talossan [tzl]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v
	//! author : Iustì Canun
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
	// This is currently too difficult (maybe even impossible) to add.
	var tzl = moment.defineLocale('tzl', {
	    months : 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
	    weekdays : 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
	    weekdaysShort : 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
	    weekdaysMin : 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM [dallas] YYYY',
	        LLL : 'D. MMMM [dallas] YYYY HH.mm',
	        LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
	    },
	    meridiemParse: /d\'o|d\'a/i,
	    isPM : function (input) {
	        return 'd\'o' === input.toLowerCase();
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'd\'o' : 'D\'O';
	        } else {
	            return isLower ? 'd\'a' : 'D\'A';
	        }
	    },
	    calendar : {
	        sameDay : '[oxhi à] LT',
	        nextDay : '[demà à] LT',
	        nextWeek : 'dddd [à] LT',
	        lastDay : '[ieiri à] LT',
	        lastWeek : '[sür el] dddd [lasteu à] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'osprei %s',
	        past : 'ja%s',
	        s : processRelativeTime,
	        m : processRelativeTime,
	        mm : processRelativeTime,
	        h : processRelativeTime,
	        hh : processRelativeTime,
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's': ['viensas secunds', '\'iensas secunds'],
	        'm': ['\'n míut', '\'iens míut'],
	        'mm': [number + ' míuts', '' + number + ' míuts'],
	        'h': ['\'n þora', '\'iensa þora'],
	        'hh': [number + ' þoras', '' + number + ' þoras'],
	        'd': ['\'n ziua', '\'iensa ziua'],
	        'dd': [number + ' ziuas', '' + number + ' ziuas'],
	        'M': ['\'n mes', '\'iens mes'],
	        'MM': [number + ' mesen', '' + number + ' mesen'],
	        'y': ['\'n ar', '\'iens ar'],
	        'yy': [number + ' ars', '' + number + ' ars']
	    };
	    return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
	}
	
	return tzl;
	
	})));


/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight [tzm]
	//! author : Abdel Said : https://github.com/abdelsaid
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var tzm = moment.defineLocale('tzm', {
	    months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
	    monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
	    weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
	        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
	        nextWeek: 'dddd [ⴴ] LT',
	        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
	        lastWeek: 'dddd [ⴴ] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
	        past : 'ⵢⴰⵏ %s',
	        s : 'ⵉⵎⵉⴽ',
	        m : 'ⵎⵉⵏⵓⴺ',
	        mm : '%d ⵎⵉⵏⵓⴺ',
	        h : 'ⵙⴰⵄⴰ',
	        hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
	        d : 'ⴰⵙⵙ',
	        dd : '%d oⵙⵙⴰⵏ',
	        M : 'ⴰⵢoⵓⵔ',
	        MM : '%d ⵉⵢⵢⵉⵔⵏ',
	        y : 'ⴰⵙⴳⴰⵙ',
	        yy : '%d ⵉⵙⴳⴰⵙⵏ'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return tzm;
	
	})));


/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight Latin [tzm-latn]
	//! author : Abdel Said : https://github.com/abdelsaid
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var tzmLatn = moment.defineLocale('tzm-latn', {
	    months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
	    monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
	    weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[asdkh g] LT',
	        nextDay: '[aska g] LT',
	        nextWeek: 'dddd [g] LT',
	        lastDay: '[assant g] LT',
	        lastWeek: 'dddd [g] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dadkh s yan %s',
	        past : 'yan %s',
	        s : 'imik',
	        m : 'minuḍ',
	        mm : '%d minuḍ',
	        h : 'saɛa',
	        hh : '%d tassaɛin',
	        d : 'ass',
	        dd : '%d ossan',
	        M : 'ayowr',
	        MM : '%d iyyirn',
	        y : 'asgas',
	        yy : '%d isgasn'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return tzmLatn;
	
	})));


/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Ukrainian [uk]
	//! author : zemlanin : https://github.com/zemlanin
	//! Author : Menelion Elensúle : https://github.com/Oire
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
	        'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
	        'dd': 'день_дні_днів',
	        'MM': 'місяць_місяці_місяців',
	        'yy': 'рік_роки_років'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'хвилина' : 'хвилину';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? 'година' : 'годину';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	function weekdaysCaseReplace(m, format) {
	    var weekdays = {
	        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
	        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
	        'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
	    },
	    nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
	        'accusative' :
	        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
	            'genitive' :
	            'nominative');
	    return weekdays[nounCase][m.day()];
	}
	function processHoursFunction(str) {
	    return function () {
	        return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
	    };
	}
	
	var uk = moment.defineLocale('uk', {
	    months : {
	        'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
	        'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
	    },
	    monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
	    weekdays : weekdaysCaseReplace,
	    weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY р.',
	        LLL : 'D MMMM YYYY р., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY р., HH:mm'
	    },
	    calendar : {
	        sameDay: processHoursFunction('[Сьогодні '),
	        nextDay: processHoursFunction('[Завтра '),
	        lastDay: processHoursFunction('[Вчора '),
	        nextWeek: processHoursFunction('[У] dddd ['),
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return processHoursFunction('[Минулої] dddd [').call(this);
	                case 1:
	                case 2:
	                case 4:
	                    return processHoursFunction('[Минулого] dddd [').call(this);
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'за %s',
	        past : '%s тому',
	        s : 'декілька секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : 'годину',
	        hh : relativeTimeWithPlural,
	        d : 'день',
	        dd : relativeTimeWithPlural,
	        M : 'місяць',
	        MM : relativeTimeWithPlural,
	        y : 'рік',
	        yy : relativeTimeWithPlural
	    },
	    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
	    meridiemParse: /ночі|ранку|дня|вечора/,
	    isPM: function (input) {
	        return /^(дня|вечора)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночі';
	        } else if (hour < 12) {
	            return 'ранку';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечора';
	        }
	    },
	    ordinalParse: /\d{1,2}-(й|го)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});
	
	return uk;
	
	})));


/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Uzbek [uz]
	//! author : Sardor Muminov : https://github.com/muminoff
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var uz = moment.defineLocale('uz', {
	    months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
	    monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
	    weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
	    weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
	    weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'D MMMM YYYY, dddd HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бугун соат] LT [да]',
	        nextDay : '[Эртага] LT [да]',
	        nextWeek : 'dddd [куни соат] LT [да]',
	        lastDay : '[Кеча соат] LT [да]',
	        lastWeek : '[Утган] dddd [куни соат] LT [да]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'Якин %s ичида',
	        past : 'Бир неча %s олдин',
	        s : 'фурсат',
	        m : 'бир дакика',
	        mm : '%d дакика',
	        h : 'бир соат',
	        hh : '%d соат',
	        d : 'бир кун',
	        dd : '%d кун',
	        M : 'бир ой',
	        MM : '%d ой',
	        y : 'бир йил',
	        yy : '%d йил'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return uz;
	
	})));


/***/ },
/* 383 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Vietnamese [vi]
	//! author : Bang Nguyen : https://github.com/bangnk
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var vi = moment.defineLocale('vi', {
	    months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
	    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
	    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /sa|ch/i,
	    isPM : function (input) {
	        return /^ch$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'sa' : 'SA';
	        } else {
	            return isLower ? 'ch' : 'CH';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM [năm] YYYY',
	        LLL : 'D MMMM [năm] YYYY HH:mm',
	        LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
	        l : 'DD/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hôm nay lúc] LT',
	        nextDay: '[Ngày mai lúc] LT',
	        nextWeek: 'dddd [tuần tới lúc] LT',
	        lastDay: '[Hôm qua lúc] LT',
	        lastWeek: 'dddd [tuần rồi lúc] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s tới',
	        past : '%s trước',
	        s : 'vài giây',
	        m : 'một phút',
	        mm : '%d phút',
	        h : 'một giờ',
	        hh : '%d giờ',
	        d : 'một ngày',
	        dd : '%d ngày',
	        M : 'một tháng',
	        MM : '%d tháng',
	        y : 'một năm',
	        yy : '%d năm'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return vi;
	
	})));


/***/ },
/* 384 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Pseudo [x-pseudo]
	//! author : Andrew Hood : https://github.com/andrewhood125
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var xPseudo = moment.defineLocale('x-pseudo', {
	    months : 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
	    monthsShort : 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
	    weekdaysShort : 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
	    weekdaysMin : 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[T~ódá~ý át] LT',
	        nextDay : '[T~ómó~rró~w át] LT',
	        nextWeek : 'dddd [át] LT',
	        lastDay : '[Ý~ést~érdá~ý át] LT',
	        lastWeek : '[L~ást] dddd [át] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'í~ñ %s',
	        past : '%s á~gó',
	        s : 'á ~féw ~sécó~ñds',
	        m : 'á ~míñ~úté',
	        mm : '%d m~íñú~tés',
	        h : 'á~ñ hó~úr',
	        hh : '%d h~óúrs',
	        d : 'á ~dáý',
	        dd : '%d d~áýs',
	        M : 'á ~móñ~th',
	        MM : '%d m~óñt~hs',
	        y : 'á ~ýéár',
	        yy : '%d ý~éárs'
	    },
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return xPseudo;
	
	})));


/***/ },
/* 385 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Yoruba Nigeria [yo]
	//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var yo = moment.defineLocale('yo', {
	    months : 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
	    monthsShort : 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
	    weekdays : 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
	    weekdaysShort : 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
	    weekdaysMin : 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Ònì ni] LT',
	        nextDay : '[Ọ̀la ni] LT',
	        nextWeek : 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
	        lastDay : '[Àna ni] LT',
	        lastWeek : 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ní %s',
	        past : '%s kọjá',
	        s : 'ìsẹjú aayá die',
	        m : 'ìsẹjú kan',
	        mm : 'ìsẹjú %d',
	        h : 'wákati kan',
	        hh : 'wákati %d',
	        d : 'ọjọ́ kan',
	        dd : 'ọjọ́ %d',
	        M : 'osù kan',
	        MM : 'osù %d',
	        y : 'ọdún kan',
	        yy : 'ọdún %d'
	    },
	    ordinalParse : /ọjọ́\s\d{1,2}/,
	    ordinal : 'ọjọ́ %d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return yo;
	
	})));


/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (China) [zh-cn]
	//! author : suupic : https://github.com/suupic
	//! author : Zeno Zeng : https://github.com/zenozeng
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var zhCn = moment.defineLocale('zh-cn', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah点mm分',
	        LTS : 'Ah点m分s秒',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah点mm分',
	        LLLL : 'YYYY年MMMD日ddddAh点mm分',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah点mm分',
	        llll : 'YYYY年MMMD日ddddAh点mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' ||
	                meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        } else {
	            // '中午'
	            return hour >= 11 ? hour : hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : function () {
	            return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
	        },
	        nextDay : function () {
	            return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
	        },
	        lastDay : function () {
	            return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
	        },
	        nextWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]';
	            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	        },
	        lastWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
	            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	        },
	        sameElse : 'LL'
	    },
	    ordinalParse: /\d{1,2}(日|月|周)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '日';
	            case 'M':
	                return number + '月';
	            case 'w':
	            case 'W':
	                return number + '周';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s内',
	        past : '%s前',
	        s : '几秒',
	        m : '1 分钟',
	        mm : '%d 分钟',
	        h : '1 小时',
	        hh : '%d 小时',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 个月',
	        MM : '%d 个月',
	        y : '1 年',
	        yy : '%d 年'
	    },
	    week : {
	        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
	
	return zhCn;
	
	})));


/***/ },
/* 387 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Hong Kong) [zh-hk]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris
	//! author : Konstantin : https://github.com/skfd
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var zhHk = moment.defineLocale('zh-hk', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah點mm分',
	        LTS : 'Ah點m分s秒',
	        L : 'YYYY年MMMD日',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah點mm分',
	        LLLL : 'YYYY年MMMD日ddddAh點mm分',
	        l : 'YYYY年MMMD日',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah點mm分',
	        llll : 'YYYY年MMMD日ddddAh點mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '中午') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(日|月|週)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '日';
	            case 'M' :
	                return number + '月';
	            case 'w' :
	            case 'W' :
	                return number + '週';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s內',
	        past : '%s前',
	        s : '幾秒',
	        m : '1 分鐘',
	        mm : '%d 分鐘',
	        h : '1 小時',
	        hh : '%d 小時',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 個月',
	        MM : '%d 個月',
	        y : '1 年',
	        yy : '%d 年'
	    }
	});
	
	return zhHk;
	
	})));


/***/ },
/* 388 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Taiwan) [zh-tw]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris
	
	;(function (global, factory) {
	    true ? factory(__webpack_require__(279)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';
	
	
	var zhTw = moment.defineLocale('zh-tw', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah點mm分',
	        LTS : 'Ah點m分s秒',
	        L : 'YYYY年MMMD日',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah點mm分',
	        LLLL : 'YYYY年MMMD日ddddAh點mm分',
	        l : 'YYYY年MMMD日',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah點mm分',
	        llll : 'YYYY年MMMD日ddddAh點mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '中午') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(日|月|週)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '日';
	            case 'M' :
	                return number + '月';
	            case 'w' :
	            case 'W' :
	                return number + '週';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s內',
	        past : '%s前',
	        s : '幾秒',
	        m : '1 分鐘',
	        mm : '%d 分鐘',
	        h : '1 小時',
	        hh : '%d 小時',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 個月',
	        MM : '%d 個月',
	        y : '1 年',
	        yy : '%d 年'
	    }
	});
	
	return zhTw;
	
	})));


/***/ },
/* 389 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict'; /**
	               * Copyright 2016 aixigo AG
	               * Released under the MIT license.
	               * http://laxarjs.org/license
	               */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(18),
	__webpack_require__(268)], __WEBPACK_AMD_DEFINE_RESULT__ = function (ax, patterns) {
	
	   var LIFECYCLE = 'lifecycle';
	   var ACTION = 'action';
	   var FLAG = 'flag';
	   var RESOURCE = 'resource';
	   var ERROR = 'error';
	   var OTHER = 'other';
	
	
	   var types = {
	      beginLifecycleRequest: LIFECYCLE,
	
	      takeActionRequest: ACTION,
	      willTakeAction: ACTION,
	      didTakeAction: ACTION,
	
	      didChangeFlag: FLAG,
	
	      didReplace: RESOURCE,
	      didUpdate: RESOURCE,
	      validateRequest: RESOURCE,
	      willValidate: RESOURCE,
	      didValidate: RESOURCE,
	      saveRequest: RESOURCE,
	      willSave: RESOURCE,
	      didSave: RESOURCE,
	
	      didEncounterError: ERROR };
	
	
	   var states = {
	      resource: {},
	      action: {},
	      flag: {} };
	
	
	   // developer API:
	   return {
	      state: function state() {
	         return ax.object.deepClone(states);
	      },
	      track: track };
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function eventType(eventItem) {
	      var topics = eventItem.event.split('.');
	      var verb = topics[0];
	      return types[verb] || OTHER;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function eventPatternTopic(eventItem) {
	      var topics = eventItem.event.split('.');
	      return topics[1];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function track(eventItem) {
	      if (eventItem.action !== 'publish') {
	         return [];
	      }
	
	      var sender = (eventItem.source || 'unknown').replace(/.*#(.*)/g, '$1');
	      var topics = eventItem.event.split('.');
	      var verb = topics[0];
	      var patternTopic = eventPatternTopic(eventItem);
	      var payload = eventItem.eventObject;
	
	      if (!patternTopic) {
	         return [{ description: 'Event has an invalid name: The second topic is missing!' }];
	      }
	      if (!payload) {
	         return [{ description: 'Event has no payload!' }];
	      }
	
	      var type = eventType(eventItem);
	      if (type === LIFECYCLE) {
	         return resetEvents();
	      }
	      if (type === RESOURCE) {
	         return trackResourceEvent(payload, sender, verb, patternTopic);
	      }
	      if (type === ACTION) {
	         return trackActionEvent(payload, sender, verb, patternTopic);
	      }
	      if (type === FLAG) {
	         return trackFlagEvent(payload, sender, verb, patternTopic);
	      }
	      return [];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function resetEvents() {
	      states = {
	         resource: {},
	         action: {},
	         flag: {} };
	
	      return [];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function trackActionEvent(payload, subject, verb, actionName) {
	      var problems = [];
	      if (!payload.action) {
	         problems.push({ description: 'Event is missing "action" field in payload.' });
	      }
	
	      var state = states.action[actionName] = states.action[actionName] || {
	         state: 'inactive',
	         numRequests: 0,
	         requestedBy: null,
	         outstandingReplies: {} };
	
	
	      switch (verb) {
	
	         case 'takeActionRequest':
	            state.state = 'active';
	            state.requestedBy = subject;
	            ++state.numRequests;
	            return problems;
	
	         case 'willTakeAction':
	            if (!state.outstandingReplies.hasOwnProperty(subject)) {
	               state.outstandingReplies[subject] = 0;
	            }
	            ++state.outstandingReplies[subject];
	            return problems;
	
	         case 'didTakeAction':
	            if (state.outstandingReplies.hasOwnProperty(subject)) {
	               --state.outstandingReplies[subject];
	               if (state.outstandingReplies[subject] === 0) {
	                  delete state.outstandingReplies[subject];
	               }
	            }
	
	            if (Object.keys(state.outstandingReplies).length === 0) {
	               state.state = 'inactive';
	            }
	            return problems;
	
	         default:
	            return problems;}
	
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function trackFlagEvent(payload, sender, verb, flagName) {
	      var problems = [];
	      if (!payload.flag) {
	         problems.push({ description: 'Event is missing "flag" field in payload.' });
	      }
	
	      states.flag[flagName] = states.flag[flagName] || {
	         state: undefined,
	         lastModificationBy: null };
	
	
	      if (verb === 'didChangeFlag') {
	         if (payload.state === undefined) {
	            problems.push({ description: 'Event is missing "state" field in payload.' });
	            return problems;
	         }
	         states.flag[flagName].state = payload.state;
	         states.flag[flagName].lastModificationBy = sender;
	      }
	
	      return problems;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function trackResourceEvent(payload, sender, verb, resourceName) {
	      var problems = [];
	      if (!payload.resource) {
	         problems.push({ description: 'Event is missing "resource" field in payload.' });
	      }
	      var state;
	
	      switch (verb) {
	
	         case 'didReplace':
	            if (payload.data === undefined) {
	               problems.push({ description: 'didReplace event-payload is missing "data" field.' });
	            }
	            state = states.resource[resourceName] = states.resource[resourceName] || {
	               state: 'replaced',
	               master: sender,
	               lastModificationBy: null,
	               value: null };
	
	            if (state.master !== sender) {
	               problems.push({ description: ax.string.format(
	                  'master/master conflict: for resource `[0]` (first master: [1], second master: [2])',
	                  [resourceName, state.master, sender]) });
	
	            }
	            state.lastModificationBy = sender;
	            state.value = payload.data;
	            return problems;
	
	         case 'didUpdate':
	            state = states.resource[resourceName];
	            if (!state) {
	               problems.push({
	                  description: 'Sender "' + sender + '" sent didUpdate without prior didReplace.' });
	
	            } else
	            if (state.value === null || state.value === undefined) {
	               problems.push({
	                  description: 'Sender "' + sender + '" sent didUpdate, but resource is ' + state.value });
	
	            }
	            if (!payload.patches) {
	               problems.push({
	                  description: 'Sender "' + sender + '" sent didUpdate without patches field.' });
	
	            }
	            if (problems.length) {
	               return problems;
	            }
	
	            state.lastModificationBy = sender;
	            try {
	               patterns.json.applyPatch(state.value, payload.patches);
	            }
	            catch (error) {
	               problems.push({
	                  description: 'Failed to apply patch sequence in didUpdate from "' + sender + '"' });
	
	            }
	            return problems;
	
	         default:
	            return problems;}
	
	   }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ax-affix-area\"\n     ax-affix\n     ax-affix-offset-top=\"100\">\n\n     <div ng-if=\"!model.eventInfos.length\"\n          class=\"text-large\">\n        <h4 class=\"text-primary\">Empty Events List</h4>\n        <p><i class=\"fa fa-clock-o\"></i> Waiting for events from host application...</p>\n     </div>\n\n     <div ng-if=\"model.eventInfos.length && !model.visibleEventInfos.length\"\n          class=\"text-large\">\n        <h4 class=\"text-primary\">0/{{ model.eventInfos.length }} Event Items</h4>\n        <p>No events matching current filters.</p>\n        <p><button type=\"button\"\n                   class=\"btn btn-sm btn-primary\"\n                   ng-click=\"commands.clearFilters()\">Show All</button></p>\n     </div>\n\n     <div ng-if=\"model.problemSummary.hasProblems\"\n          class=\"text-large\">\n        <h4 class=\"text-primary ax-error\">{{ model.problemSummary.eventInfos.length }}/{{ model.eventInfos.length }} Events with Problems</h4>\n        <ul>\n           <li ng-repeat=\"event in model.problemSummary.eventInfos\">\n              <h5><strong>{{ event.name }}</strong> <em>(source: {{ event.source }})</em></h5>\n              <ul>\n                 <li ng-repeat=\"problem in event.problems track by problem.description\"\n                    class=\"ax-event-problem\">\n                    <i class=\"fa fa-warning ax-error\"></i> {{ problem.description }}\n                 </li>\n              </ul>\n           </li>\n        </ul>\n        <p class=\"ax-event-problems-explanation\">\n           Events with problems are marked <strong class=\"ax-error\">red</strong> in the events table.\n           Filter by event/source as needed.\n        </p>\n     </div>\n\n\n     <div ng-if=\"model.visibleEventInfos.length\"\n          class=\"text-large\">\n        <h4 class=\"text-primary\">{{ model.visibleEventInfos.length }}/{{ model.eventInfos.length }} Events</h4>\n     </div>\n\n   <div class=\"ax-button-wrapper form-inline\">\n\n      <div class=\"form-group form-group-sm\">\n         <label ax-for=\"'search'\"><small>Filters:</small></label>\n         <input class=\"form-control input-sm\"\n                placeholder=\"Search (RegExp)\"\n                ax-id=\"'search'\"\n                ng-model=\"model.settings.namePattern\">\n\n         <label ax-for=\"'limit'\"><small>Limit:</small></label>\n         <input class=\"form-control input-sm\"\n                ax-id=\"'limit'\"\n                ng-model=\"model.settings.visibleEventsLimit\"\n                ng-model-options=\"{ updateOn: 'default' }\"\n                ax-input=\"integer\"\n                ax-input-minimum-value=\"0\"\n                ax-input-maximum-value=\"features.events.bufferSize\"\n                placeholder=\"0-{{ features.events.bufferSize }}\"\n                maxlength=\"4\">\n      </div>\n\n      <!-- Filters menu -->\n      <div class=\"btn-group btn-group-sm\"\n           ng-class=\"{ 'open': view.showPatterns }\"\n           ng-mouseenter=\"view.showPatterns = true\"\n           ng-mouseleave=\"view.showPatterns = false\">\n         <button type=\"button\"\n                 class=\"btn btn-default dropdown-toggle\"\n                 data-toggle=\"dropdown\"\n                 aria-expanded=\"{{ view.showPatterns }}\">\n            More <span class=\"caret\"></span>\n         </button>\n         <div class=\"dropdown-menu container col-lg-6\" role=\"menu\">\n\n            <div class=\"row\">\n               <div class=\"ax-event-settings-col first\">\n                  <h4>Patterns</h4>\n                  <div ng-repeat=\"pattern in model.patterns track by pattern.name\">\n                     <button\n                        type=\"button\"\n                        class=\"btn btn-link ax-event-setting-toggle\"\n                        ng-click=\"model.settings.patterns[ pattern.name ] = !model.settings.patterns[ pattern.name ]\">\n                        <span class=\"ax-event-pattern\" ng-bind-html=\"pattern.htmlIcon\"></span>\n                        {{ pattern.name }}\n                        <i class=\"fa pull-right ax-event-setting-toggle\"\n                           ng-class=\"{ 'fa-toggle-off': !model.settings.patterns[ pattern.name ], 'fa-toggle-on': model.settings.patterns[ pattern.name ] }\"></i>\n                     </button>\n                  </div>\n               </div>\n\n               <div class=\"ax-event-settings-col last\">\n                  <h4>Interactions</h4>\n                  <div ng-repeat=\"(interaction, enabled) in model.settings.interactions track by interaction\">\n                     <button\n                        type=\"button\"\n                        class=\"btn btn-link ax-event-setting-toggle\"\n                        ng-click=\"model.settings.interactions[ interaction ] = !enabled\"\n                        >{{ interaction }}<i class=\"fa pull-right ax-event-setting-toggle\"\n                                        ng-class=\"{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }\"></i>\n                     </button>\n                  </div>\n\n                  <br>\n                  <h4>Sources</h4>\n                  <div ng-repeat=\"(source, enabled) in model.settings.sources track by source\">\n                     <button\n                        type=\"button\"\n                        class=\"btn btn-link ax-event-setting-toggle\"\n                        ng-click=\"model.settings.sources[ source ] = !enabled\"\n                        >{{ source }}<i class=\"fa pull-right ax-event-setting-toggle\"\n                                        ng-class=\"{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }\"></i>\n                     </button>\n                  </div>\n               </div>\n\n            </div>\n\n            <div class=\"row\">\n               <div class=\"ax-event-settings-col first\">&nbsp;</div>\n               <div class=\"ax-event-settings-col last\">\n                  <div class=\"pull-right\">\n                     <button type=\"button\" class=\"btn btn-xs btn-primary\" ng-click=\"commands.setAll( true )\">All On</button>\n                     <button type=\"button\" class=\"btn btn-xs btn-primary\" ng-click=\"commands.setAll( false )\">All Off</button>\n                     <button type=\"button\" class=\"btn btn-xs\" ng-click=\"commands.setDefaults()\">Defaults</button>\n                  </div>\n               </div>\n            </div>\n\n         </div>\n      </div>\n\n      <button class=\"btn btn-primary btn-sm\"\n              type=\"button\"\n              ng-class=\"{ 'ax-disabled': !model.eventInfos.length }\"\n              ng-click=\"commands.discard()\">Discard Events</button>\n   </div>\n\n   <div class=\"form-inline events-display-filter-items\" ng-if=\"resources.filter.topics.length || resources.filter.participants.length\">\n      <a class=\"btn btn-xs btn-link\" href=\"#/tools/page\">Page selection</a>\n      <span class=\"btn btn-xs btn-info\"\n            ng-repeat=\"item in resources.filter.topics track by item.topic\"\n            ng-class=\"'ax-events-display-pattern-' + item.pattern\">\n            {{item.topic}}\n      </span><span class=\"btn btn-xs btn-info\"\n            ng-repeat=\"item in resources.filter.participants track by item.participant\"\n            ng-class=\"'ax-events-display-kind-' + item.kind\">\n            {{item.participant}}\n      </span>\n   </div>\n</div>\n\n<table ng-if=\"model.visibleEventInfos.length\"\n       class=\"table\">\n   <colgroup>\n      <col class=\"ax-col-pattern-icon\">\n      <col class=\"ax-col-interaction\">\n      <col class=\"ax-col-payload-icon\">\n      <col class=\"ax-col-name\">\n\n      <col class=\"ax-col-source\">\n      <col class=\"ax-col-target\">\n      <col class=\"ax-col-cycle\">\n      <col class=\"ax-col-timestamp\">\n   </colgroup>\n   <thead>\n      <tr>\n         <th>&nbsp;</th>\n         <th>Action</th>\n         <th>&nbsp;</th>\n         <th>Event Name</th>\n\n         <th>Source</th>\n         <th>Target</th>\n         <th class=\"text-right\">Cycle</th>\n         <th class=\"text-right\">Time<i class=\"fa fa-long-arrow-up\"></i></th>\n      </tr>\n   </thead>\n   <tbody ng-repeat=\"event in model.visibleEventInfos\"\n          ng-class=\"'ax-event-pattern-' + event.pattern +\n                    ' ax-event-interaction-' + event.interaction +\n                    ( event.selected ? ' ax-event-selected' : '' ) +\n                    ( event.problems.length ? ' ax-event-has-problems' : '' )\"\n          ng-click=\"commands.select( event )\">\n      <tr class=\"ax-event-summary\">\n         <td class=\"ax-col-pattern-icon\"\n             title=\"{{ event.pattern }}\"\n             ng-bind-html=\"view.patternsByName[ event.pattern ].htmlIcon\"></td>\n         <td class=\"ax-col-interaction\">{{event.interaction}}</td>\n         <td class=\"ax-col-payload-icon\">\n            <button type=\"button\" class=\"btn-link btn-info\"\n                    ng-if=\"event.interaction == 'publish' && !event.showDetails\"\n                    ng-click=\"event.showDetails = true; $event.stopPropagation();\"><i class=\"fa fa-plus-square\">&nbsp;</i></button>\n            <button type=\"button\" class=\"btn-link btn-info\"\n                    ng-if=\"event.interaction == 'publish' && event.showDetails\"\n                    ng-click=\"event.showDetails = false; $event.stopPropagation();\"><i class=\"fa fa-minus-square\" >&nbsp;</i></button>\n         </td>\n         <td ng-bind-html=\"event.htmlName\"></td>\n         <td ng-bind-html=\"event.htmlSource\"></td>\n         <td ng-bind-html=\"event.htmlTarget\"></td>\n         <td class=\"ax-col-cycle text-right\">{{event.cycleId}}</td>\n         <td class=\"text-right\"><span>{{event.formattedTime.upper}}</span><br /><span>{{event.formattedTime.lower}}</span></td>\n      </tr>\n      <tr class=\"ax-event-payload\"\n          ng-if=\"event.problems.length\">\n         <td colspan=\"3\"></td>\n         <td colspan=\"5\">\n            <ul>\n               <li ng-repeat=\"problem in event.problems track by problem.description\"\n                   class=\"ax-event-problem\">\n                  <i class=\"fa fa-warning\"></i> {{ problem.description }}\n               </li>\n            </ul>\n         </td>\n      </tr>\n      <tr class=\"ax-event-payload\"\n          ng-if=\"event.showDetails\">\n         <td colspan=\"3\"></td>\n         <td colspan=\"5\" ><pre>{{event.formattedEvent}}</pre></td>\n      </tr>\n   </tbody>\n</table>\n"

/***/ },
/* 421 */
/***/ function(module, exports, __webpack_require__) {

	var resource = __webpack_require__( 422 );
	module.exports = typeof resource === 'string' ? resource : null;

/***/ },
/* 422 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(423);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(260)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./events-display-widget.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./events-display-widget.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 423 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(248)();
	// imports
	
	
	// module
	exports.push([module.id, ".events-display-widget .ax-button-wrapper {\n   padding: 8px 8px;\n}\n\n.events-display-widget .ax-affix-area {\n   top: 0;\n   left: 0;\n   right: 0;\n   background-color: rgba(255, 255, 255, 0.8);\n   border-bottom: 1px solid #CCC;\n   box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);\n   text-align: right;\n}\n\n.events-display-widget [data-ax-id=\"'limit'\"] {\n   width: 60px;\n   text-align: right;\n}\n\n.events-display-widget .fa-toggle-on {\n   color: #5cb85c;\n}\n\n.events-display-widget .fa-toggle-off,\n.events-display-widget .fa-toggle-on {\n   margin-left: -30px;\n}\n\n.events-display-widget .dropdown-menu {\n   margin: 0;\n   right: 0;\n   left: auto;\n   min-width: 400px;\n   max-width: 430px;\n   padding: 0 30px 30px;\n}\n\n.events-display-widget .ax-event-settings-col {\n   float: left;\n   width: 170px;\n}\n\n.events-display-widget .ax-event-settings-col {\n   margin-top: 30px;\n   margin-right: 30px;\n}\n\n.events-display-widget .ax-event-settings-col.last {\n   margin-right: -30px;\n}\n\n.events-display-widget button.ax-event-setting-toggle {\n   text-align: left;\n   width: 170px;\n   border-bottom: 1px solid #ddd;\n}\n\n.events-display-widget button.ax-event-setting-toggle:hover,\n.events-display-widget button.ax-event-setting-toggle:active {\n   text-decoration: none;\n}\n\n.events-display-widget .ax-event-pattern {\n   display: inline-block;\n   width: 18px;\n}\n\n.events-display-widget i.ax-event-setting-toggle {\n   width: 18px;\n   padding-top: 3px;\n}\n\n.events-display-widget .events-display-filter-items {\n   line-height: 200%;\n   padding-right: 8px;\n}\n\n.events-display-widget .events-display-filter-items .btn-info {\n   color: white;\n   margin-left: 4px;\n   border: none;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-kind-ACTIVITY {\n   background: #4fb04f;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-kind-WIDGET {\n   background: #f90;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-pattern-RESOURCE {\n   background: #673ab7;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-pattern-FLAG {\n   background: #4caf50;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-pattern-ACTION {\n   background: #ef6c00;\n}\n\n.events-display-widget .events-display-filter-items .ax-events-display-pattern-CONTAINER {\n   background: #4285f4;\n}\n\n.events-display-widget h4 {\n   padding-left: 8px;\n   margin-top: 0;\n}\n\n.events-display-widget .ax-event-problems-explanation {\n   padding-left: 8px;\n   margin-bottom: 24px;\n}\n\n.events-display-widget colgroup .ax-col-pattern-icon {\n   width: 32px;\n}\n\n@media (min-width: 992px) {\n   .events-display-widget colgroup .ax-col-interaction {\n      width: 80px;\n   }\n}\n\n.events-display-widget colgroup .ax-col-payload-icon {\n   width: 16px;\n}\n\n@media (min-width: 992px) {\n   .events-display-widget colgroup .ax-col-name {\n      width: 300px;\n   }\n}\n\n@media (min-width: 992px) {\n   .events-display-widget colgroup .ax-col-source,\n   .events-display-widget colgroup .ax-col-target {\n      width: 140px;\n   }\n}\n\n@media (min-width: 1200px) {\n   .events-display-widget colgroup .ax-col-source,\n   .events-display-widget colgroup .ax-col-target {\n      width: 200px;\n   }\n}\n\n.events-display-widget colgroup .ax-col-cycle {\n   width: 60px;\n}\n\n.events-display-widget colgroup .ax-col-timestamp {\n   width: 60px;\n}\n\n.events-display-widget .table {\n   table-layout: fixed;\n}\n\n.events-display-widget .table tbody, .events-display-widget .table tr, .events-display-widget .table td {\n   border: none;\n   vertical-align: bottom;\n}\n\n.events-display-widget .table tr.ax-event-summary td span:first-child {\n   font-size: 80%;\n   font-weight: bold;\n   color: #999;\n}\n\n.events-display-widget .table tr.ax-event-summary td span:last-child {\n   font-weight: normal;\n   font-size: 110%;\n   color: #333;\n}\n\n.events-display-widget .table tbody.ax-event-interaction-publish {\n   background: #f9f9f9;\n}\n\n.events-display-widget .table tbody.ax-event-interaction-publish td.ax-col-interaction {\n   font-weight: bold;\n}\n\n.events-display-widget .table tbody.ax-event-interaction-publish.ax-event-pattern-navigation td:first-child {\n   background: #ffefbf;\n}\n\n.events-display-widget .table tbody.ax-event-interaction-publish.ax-event-pattern-navigation td:first-child + td {\n   background: -webkit-linear-gradient(left, #ffefbf 0%, transparent 32%);\n   background: linear-gradient(to right, #ffefbf 0%, transparent 32%);\n}\n\n.events-display-widget .table tbody.ax-event-interaction-subscribe,\n.events-display-widget .table tbody.ax-event-interaction-unsubscribe {\n   color: #999;\n}\n\n.events-display-widget .table tr.ax-event-summary td {\n   border-top: 1px solid #ddd;\n}\n\n.events-display-widget .table tr.ax-event-payload > td {\n   padding-top: 0;\n   padding-right: 0;\n   padding-bottom: 0;\n}\n\n.events-display-widget .table td.ax-col-pattern-icon {\n   background: #eee;\n   color: #aaa;\n   text-align: center;\n   font-size: 14px;\n   padding-top: 7px;\n   cursor: default;\n}\n\n.events-display-widget .table td.ax-col-payload-icon {\n   padding-right: 0;\n   text-align: right;\n}\n\n.events-display-widget .table tbody tr.ax-event-summary:hover td {\n   background: #337ab7 !important;\n}\n\n.events-display-widget .table tbody tr.ax-event-summary:hover td,\n.events-display-widget .table tbody tr.ax-event-summary:hover td * {\n   color: white !important;\n}\n\n.events-display-widget .table tbody tr:hover td.ax-col-pattern-icon {\n   background: #286090;\n}\n\n.events-display-widget .table tbody.ax-event-selected tr.ax-event-summary td {\n   border-top-color: #337ab7;\n}\n\n.events-display-widget .table tbody.ax-event-selected tr {\n   background: #b8d0e5 !important;\n}\n\n.events-display-widget .table tbody.ax-event-selected tr.ax-event-payload:hover td {\n   background: #b8d0e5 !important;\n   color: #337ab7 !important;\n}\n\n.events-display-widget .table tbody.ax-event-selected td.ax-col-pattern-icon {\n   background: #93b8d7;\n}\n\n.events-display-widget .table tbody.ax-event-selected td.ax-col-cycle {\n   font-weight: bold;\n}\n\n.events-display-widget .table tbody.ax-event-selected.ax-event-interaction-publish, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-deliver, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-publish .ax-col-pattern-icon, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-deliver .ax-col-pattern-icon {\n   color: #337ab7;\n}\n\n.events-display-widget .table tbody.ax-event-selected.ax-event-interaction-subscribe, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-unsubscribe, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-subscribe .ax-col-pattern-icon, .events-display-widget .table tbody.ax-event-selected.ax-event-interaction-unsubscribe .ax-col-pattern-icon {\n   color: #577894;\n}\n\n.events-display-widget .table tbody.ax-event-has-problems {\n   background: #f7e4e4;\n}\n\n.events-display-widget .table tbody.ax-event-has-problems .ax-col-pattern-icon {\n   background: #e09795;\n   color: #aa3532;\n}\n\n.events-display-widget .table tbody.ax-event-has-problems .ax-event-problem {\n   font-weight: bold;\n}\n\n.events-display-widget .table td.ax-col-cycle {\n   text-align: right;\n}\n\n.events-display-widget .table td {\n   word-wrap: break-word;\n   font-size: 12px;\n}\n\n.events-display-widget .table td .btn-link {\n   border: 0;\n   padding: 0;\n   margin: 0;\n}\n\n.events-display-widget .table td b {\n   color: #449d44;\n   text-decoration: underline;\n}\n\n.events-display-widget .table pre {\n   margin: 0;\n   border: none;\n   border-radius: 0;\n   background: inherit;\n   padding: 1em 0;\n   font-family: monospace;\n   font-size: 12px;\n   max-height: 0;\n   -webkit-animation: show-pre-animation .3s ease forwards;\n   animation: show-pre-animation .3s ease forwards;\n}\n\n@-webkit-keyframes show-pre-animation {\n   from {\n      max-height: 0;\n   }\n   to {\n      max-height: 400px;\n   }\n}\n\n@keyframes show-pre-animation {\n   from {\n      max-height: 0;\n   }\n   to {\n      max-height: 400px;\n   }\n}\n\n.events-display-widget .fa-folder-close,\n.events-display-widget .fa-folder-open {\n   cursor: pointer;\n}\n\n.events-display-widget li.ax-event-problem {\n   list-style-type: none;\n}\n\n.events-display-widget .text-large {\n   padding: 8px;\n   float: left;\n}\n", ""]);
	
	// exports


/***/ }
]);
//# sourceMappingURL=app.bundle.js.map