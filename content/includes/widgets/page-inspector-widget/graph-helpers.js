/* jshint ignore:start */
define(['exports', 'wireflow', 'laxar'], function (exports, _wireflow, _laxar) {'use strict';Object.defineProperty(exports, '__esModule', { value: true });var _slicedToArray = (function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i['return']) _i['return']();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();exports.graph = graph;exports.layout = layout;exports.types = types;exports.compositionStack = compositionStack;exports.filterFromSelection = filterFromSelection;function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _wireflow2 = _interopRequireDefault(_wireflow);



   var TYPE_CONTAINER = 'CONTAINER';var 



   layoutModel = _wireflow2['default'].layout.model;var 


   graphModel = _wireflow2['default'].graph.model;



   var edgeTypes = { 
      RESOURCE: { 
         hidden: false, 
         label: 'Resources' }, 

      FLAG: { 
         label: 'Flags', 
         hidden: false }, 

      ACTION: { 
         label: 'Actions', 
         hidden: false }, 

      CONTAINER: { 
         hidden: false, 
         label: 'Container', 
         owningPort: 'outbound' } };



   var PAGE_ID = '.';exports.PAGE_ID = PAGE_ID;

   /**
    * Create a wireflow graph from a given page/widget information model.
    *
    * @param {Object} pageInfo
    * @param {Boolean=false} pageInfo.withIrrelevantWidgets
    *   If set to `true`, widgets without any relevance to actions/resources/flags are removed.
    *   Containers of widgets (that are relevant by this measure) are kept.
    * @param {Boolean=false} pageInfo.withContainers
    *   If set to `true`, Container relationships are included in the graph representation.
    * @param {String='FLAT'} pageInfo.compositionDisplay
    *   If set to `'COMPACT'` (default), compositions are represented by an instance node, reflecting their development-time model.
    *   If set to `'FLAT'`, compositions are replaced recursively by their configured expansion, reflecting their run-time model.
    * @param {String=null} pageInfo.activeComposition
    *   If set, generate a graph for the contents of the given composition, rather than for the page.
    */
   function graph(pageInfo, options) {var _options$withIrrelevantWidgets = 






      options.withIrrelevantWidgets;var withIrrelevantWidgets = _options$withIrrelevantWidgets === undefined ? false : _options$withIrrelevantWidgets;var _options$withContainers = options.withContainers;var withContainers = _options$withContainers === undefined ? true : _options$withContainers;var _options$compositionDisplay = options.compositionDisplay;var compositionDisplay = _options$compositionDisplay === undefined ? 'FLAT' : _options$compositionDisplay;var _options$activeComposition = options.activeComposition;var activeComposition = _options$activeComposition === undefined ? null : _options$activeComposition;var 


      pageReference = 



      pageInfo.pageReference;var pageDefinitions = pageInfo.pageDefinitions;var widgetDescriptors = pageInfo.widgetDescriptors;var compositionDefinitions = pageInfo.compositionDefinitions;
      var page = activeComposition ? 
      compositionDefinitions[pageReference][activeComposition][compositionDisplay] : 
      pageDefinitions[pageReference][compositionDisplay];
      console.log('>> PageInfo', pageInfo); // :TODO: DELETE ME
      console.log('>> options', options); // :TODO: DELETE ME
      console.log('>> page', page); // :TODO: DELETE ME


      var vertices = {};
      var edges = {};

      identifyVertices();
      if (withContainers) {
         identifyContainers();}

      if (!withIrrelevantWidgets) {
         pruneIrrelevantWidgets(withContainers);}

      pruneEmptyEdges();

      return graphModel.convert.graph({ 
         vertices: vertices, 
         edges: edges });


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function identifyVertices() {
         Object.keys(page.areas).forEach(function (areaName) {
            page.areas[areaName].forEach(function (pageAreaItem) {
               if (isWidget(pageAreaItem)) {
                  processWidgetInstance(pageAreaItem, areaName);} else 

               if (isComposition(pageAreaItem)) {
                  processCompositionInstance(pageAreaItem, areaName);} else 

               if (isLayout(pageAreaItem)) {
                  processLayoutInstance(pageAreaItem, areaName);}});});




         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function processLayoutInstance(layout, areaName) {
            vertices[layout.id] = { 
               id: layout.id, 
               label: layout.id, 
               kind: 'LAYOUT', 
               ports: { inbound: [], outbound: [] } };}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function processWidgetInstance(widgetInstance, areaName) {
            var descriptor = widgetDescriptors[widgetInstance.widget];

            var kinds = { 
               widget: 'WIDGET', 
               activity: 'ACTIVITY' };var 


            id = widgetInstance.id;
            var ports = identifyPorts(widgetInstance.features, descriptor.features);
            vertices[id] = { 
               id: id, 
               label: id, 
               kind: kinds[descriptor.integration.type], 
               ports: ports };}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function processCompositionInstance(compositionInstance, areaName) {var 
            id = compositionInstance.id;
            var definition = compositionDefinitions[pageReference][id].COMPACT;

            var schema = definition.features.type ? 
            definition.features : 
            { type: 'object', properties: definition.features };

            var ports = identifyPorts(
            compositionInstance.features || {}, 
            _laxar.object.options(schema));


            /*
            console.log(
               "IDENT COMPOSITION PORTS\n",
               object.deepClone( compositionInstance ), '\n',
               object.deepClone( compositionInstance.features || {} ), '\n',
               object.deepClone( schema ), '\n -----> ',
               object.deepClone( ports )
            );\
            */

            vertices[id] = { 
               id: id, 
               label: id, 
               kind: 'COMPOSITION', 
               ports: ports };}



         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

         function identifyPorts(value, schema, path, ports) {
            path = path || [];
            ports = ports || { inbound: [], outbound: [] };
            if (!value || !schema) {
               return ports;}


            if (value.enabled === false) {
               // feature can be disabled, and was disabled
               return ports;}

            if (schema.type === 'string' && schema.axRole && (
            schema.format === 'topic' || schema.format === 'flag-topic')) {
               var type = schema.axPattern ? schema.axPattern.toUpperCase() : inferEdgeType(path);
               if (!type) {return;}
               var edgeId = type + ':' + value;
               var label = path.join('.');
               var id = path.join(':');
               ports[schema.axRole === 'outlet' ? 'outbound' : 'inbound'].push({ 
                  label: label, id: id, type: type, edgeId: edgeId });

               if (edgeId && !edges[edgeId]) {
                  edges[edgeId] = { type: type, id: edgeId, label: value };}}



            if (schema.type === 'object' && schema.properties) {
               Object.keys(schema.properties).forEach(function (key) {
                  var propertySchema = schema.properties[key] || schema.additionalProperties;
                  identifyPorts(value[key], propertySchema, path.concat([key]), ports);});}


            if (schema.type === 'array') {
               value.forEach(function (item, i) {
                  identifyPorts(item, schema.items, path.concat([i]), ports);});}


            return ports;}


         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

         function inferEdgeType(_x) {var _again = true;_function: while (_again) {var path = _x;_again = false;
               if (!path.length) {
                  return null;}

               var lastSegment = path[path.length - 1];
               if (['action', 'flag', 'resource'].indexOf(lastSegment) !== -1) {
                  return lastSegment.toUpperCase();}

               if (lastSegment === 'onActions') {
                  return 'ACTION';}_x = 

               path.slice(0, path.length - 1);_again = true;lastSegment = undefined;continue _function;}}}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function identifyContainers() {
         var type = TYPE_CONTAINER;

         vertices[PAGE_ID] = { 
            PAGE_ID: PAGE_ID, 
            label: activeComposition ? activeComposition : 'Page ' + pageReference, 
            kind: 'PAGE', 
            ports: { inbound: [], outbound: [] } };


         Object.keys(page.areas).forEach(function (areaName) {
            insertEdge(areaName);
            var owner = findOwner(areaName);
            if (!owner) {
               return;}


            var containsAnything = false;
            page.areas[areaName].
            filter(function (item) {
               return isComposition(item) ? 
               compositionDisplay === 'COMPACT' : 
               true;}).

            forEach(function (item) {
               if (vertices[item.id]) {
                  insertUplink(vertices[item.id], areaName);
                  containsAnything = true;}});


            if (containsAnything) {
               insertOwnerPort(owner, areaName);}});



         function findOwner(areaName) {
            if (areaName.indexOf('.') === -1) {
               return vertices[PAGE_ID];}

            var prefix = areaName.slice(0, areaName.lastIndexOf('.'));
            return vertices[prefix];}


         function insertOwnerPort(vertex, areaName) {
            vertex.ports.outbound.unshift({ 
               id: 'CONTAINER:' + areaName, 
               type: TYPE_CONTAINER, 
               edgeId: areaEdgeId(areaName), 
               label: areaName });}



         function insertUplink(vertex, areaName) {
            vertex.ports.inbound.unshift({ 
               id: 'CONTAINER:anchor', 
               type: TYPE_CONTAINER, 
               edgeId: areaEdgeId(areaName), 
               label: 'anchor' });}



         function insertEdge(areaName) {
            var id = areaEdgeId(areaName);
            edges[id] = { id: id, type: type, label: areaName };}


         function areaEdgeId(areaName) {
            return TYPE_CONTAINER + ':' + areaName;}}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function pruneIrrelevantWidgets(withContainers) {
         var toPrune = [];
         do {
            toPrune.forEach(function (id) {delete vertices[id];});
            pruneEmptyEdges();
            toPrune = mark();} while (
         toPrune.length);

         function mark() {
            var pruneList = [];
            Object.keys(vertices).forEach(function (vId) {
               var ports = vertices[vId].ports;
               if (ports.inbound.length <= withContainers ? 1 : 0) {
                  if (ports.outbound.every(function (_) {return !_.edgeId;})) {
                     pruneList.push(vId);}}});



            return pruneList;}}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function pruneEmptyEdges() {
         var toPrune = [];
         Object.keys(edges).forEach(function (edgeId) {
            var type = edgeTypes[edges[edgeId].type];
            var sources = Object.keys(vertices).filter(isSourceOf(edgeId));
            var sinks = Object.keys(vertices).filter(isSinkOf(edgeId));
            var hasSources = sources.length > 0;
            var hasSinks = sinks.length > 0;
            var isEmpty = type.owningPort ? !hasSources || !hasSinks : !hasSources && !hasSinks;
            if (!isEmpty) {
               return;}


            toPrune.push(edgeId);
            sources.concat(sinks).forEach(function (vertexId) {
               var ports = vertices[vertexId].ports;
               ports.inbound.concat(ports.outbound).forEach(function (port) {
                  port.edgeId = port.edgeId === edgeId ? null : port.edgeId;});});});



         toPrune.forEach(function (id) {delete edges[id];});

         function isSourceOf(edgeId) {
            return function (vertexId) {
               return vertices[vertexId].ports.inbound.some(function (port) {return port.edgeId === edgeId;});};}



         function isSinkOf(edgeId) {
            return function (vertexId) {
               return vertices[vertexId].ports.outbound.some(function (port) {return port.edgeId === edgeId;});};}}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   }


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isComposition(pageAreaItem) {
      return !!pageAreaItem.composition;}


   function isWidget(pageAreaItem) {
      return !!pageAreaItem.widget;}


   function isLayout(pageAreaItem) {
      return !!pageAreaItem.layout;}


   function either(f, g) {
      return function () {
         return f.apply(this, arguments) || g.apply(this, arguments);};}



   //////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function layout(graph) {
      return layoutModel.convert.layout({ 
         vertices: {}, 
         edges: {} });}



   //////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function types() {
      return graphModel.convert.types(edgeTypes);}


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function compositionStack(compositionInstanceId) {
      return [];}


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function filterFromSelection(selection, graphModel) {
      var topics = selection.edges.flatMap(function (edgeId) {var _edgeId$split = 
         edgeId.split(':');var _edgeId$split2 = _slicedToArray(_edgeId$split, 2);var type = _edgeId$split2[0];var topic = _edgeId$split2[1];
         return type === 'CONTAINER' ? [] : [{ pattern: type, topic: topic }];}).
      toJS();

      var participants = selection.vertices.flatMap(function (vertexId) {var _graphModel$vertices$get = 
         graphModel.vertices.get(vertexId);var id = _graphModel$vertices$get.id;var kind = _graphModel$vertices$get.kind;
         return kind === 'PAGE' || kind === 'LAYOUT' ? [] : [{ kind: kind, participant: vertexId }];});


      return { 
         topics: topics, 
         participants: participants };}});
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FDM0YsQ0FBRSxDQUFDOzs7QUFFSixhQUFPO0FBQ0osZUFBTSxFQUFOLE1BQU07QUFDTixxQkFBWSxFQUFaLFlBQVksRUFDZCxDQUFDLENBQ0oiLCJmaWxlIjoiZ3JhcGgtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB3aXJlZmxvdyBmcm9tICd3aXJlZmxvdyc7XG5cbmltcG9ydCB7IG9iamVjdCB9IGZyb20gJ2xheGFyJztcblxuY29uc3QgVFlQRV9DT05UQUlORVIgPSAnQ09OVEFJTkVSJztcblxuY29uc3Qge1xuICBsYXlvdXQ6IHtcbiAgICAgbW9kZWw6IGxheW91dE1vZGVsXG4gIH0sXG4gIGdyYXBoOiB7XG4gICAgbW9kZWw6IGdyYXBoTW9kZWxcbiAgfVxufSA9IHdpcmVmbG93O1xuXG5jb25zdCBlZGdlVHlwZXMgPSB7XG4gICBSRVNPVVJDRToge1xuICAgICAgaGlkZGVuOiBmYWxzZSxcbiAgICAgIGxhYmVsOiAnUmVzb3VyY2VzJ1xuICAgfSxcbiAgIEZMQUc6IHtcbiAgICAgIGxhYmVsOiAnRmxhZ3MnLFxuICAgICAgaGlkZGVuOiBmYWxzZVxuICAgfSxcbiAgIEFDVElPTjoge1xuICAgICAgbGFiZWw6ICdBY3Rpb25zJyxcbiAgICAgIGhpZGRlbjogZmFsc2VcbiAgIH0sXG4gICBDT05UQUlORVI6IHtcbiAgICAgIGhpZGRlbjogZmFsc2UsXG4gICAgICBsYWJlbDogJ0NvbnRhaW5lcicsXG4gICAgICBvd25pbmdQb3J0OiAnb3V0Ym91bmQnXG4gICB9XG59O1xuXG5leHBvcnQgY29uc3QgUEFHRV9JRCA9ICcuJztcblxuLyoqXG4gKiBDcmVhdGUgYSB3aXJlZmxvdyBncmFwaCBmcm9tIGEgZ2l2ZW4gcGFnZS93aWRnZXQgaW5mb3JtYXRpb24gbW9kZWwuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhZ2VJbmZvXG4gKiBAcGFyYW0ge0Jvb2xlYW49ZmFsc2V9IHBhZ2VJbmZvLndpdGhJcnJlbGV2YW50V2lkZ2V0c1xuICogICBJZiBzZXQgdG8gYHRydWVgLCB3aWRnZXRzIHdpdGhvdXQgYW55IHJlbGV2YW5jZSB0byBhY3Rpb25zL3Jlc291cmNlcy9mbGFncyBhcmUgcmVtb3ZlZC5cbiAqICAgQ29udGFpbmVycyBvZiB3aWRnZXRzICh0aGF0IGFyZSByZWxldmFudCBieSB0aGlzIG1lYXN1cmUpIGFyZSBrZXB0LlxuICogQHBhcmFtIHtCb29sZWFuPWZhbHNlfSBwYWdlSW5mby53aXRoQ29udGFpbmVyc1xuICogICBJZiBzZXQgdG8gYHRydWVgLCBDb250YWluZXIgcmVsYXRpb25zaGlwcyBhcmUgaW5jbHVkZWQgaW4gdGhlIGdyYXBoIHJlcHJlc2VudGF0aW9uLlxuICogQHBhcmFtIHtTdHJpbmc9J0ZMQVQnfSBwYWdlSW5mby5jb21wb3NpdGlvbkRpc3BsYXlcbiAqICAgSWYgc2V0IHRvIGAnQ09NUEFDVCdgIChkZWZhdWx0KSwgY29tcG9zaXRpb25zIGFyZSByZXByZXNlbnRlZCBieSBhbiBpbnN0YW5jZSBub2RlLCByZWZsZWN0aW5nIHRoZWlyIGRldmVsb3BtZW50LXRpbWUgbW9kZWwuXG4gKiAgIElmIHNldCB0byBgJ0ZMQVQnYCwgY29tcG9zaXRpb25zIGFyZSByZXBsYWNlZCByZWN1cnNpdmVseSBieSB0aGVpciBjb25maWd1cmVkIGV4cGFuc2lvbiwgcmVmbGVjdGluZyB0aGVpciBydW4tdGltZSBtb2RlbC5cbiAqIEBwYXJhbSB7U3RyaW5nPW51bGx9IHBhZ2VJbmZvLmFjdGl2ZUNvbXBvc2l0aW9uXG4gKiAgIElmIHNldCwgZ2VuZXJhdGUgYSBncmFwaCBmb3IgdGhlIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBjb21wb3NpdGlvbiwgcmF0aGVyIHRoYW4gZm9yIHRoZSBwYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JhcGgoIHBhZ2VJbmZvLCBvcHRpb25zICkge1xuXG4gICBjb25zdCB7XG4gICAgICB3aXRoSXJyZWxldmFudFdpZGdldHMgPSBmYWxzZSxcbiAgICAgIHdpdGhDb250YWluZXJzID0gdHJ1ZSxcbiAgICAgIGNvbXBvc2l0aW9uRGlzcGxheSA9ICdGTEFUJyxcbiAgICAgIGFjdGl2ZUNvbXBvc2l0aW9uID0gbnVsbFxuICAgfSA9IG9wdGlvbnM7XG5cbiAgIGNvbnN0IHtcbiAgICAgIHBhZ2VSZWZlcmVuY2UsXG4gICAgICBwYWdlRGVmaW5pdGlvbnMsXG4gICAgICB3aWRnZXREZXNjcmlwdG9ycyxcbiAgICAgIGNvbXBvc2l0aW9uRGVmaW5pdGlvbnNcbiAgIH0gPSBwYWdlSW5mbztcbiAgIGNvbnN0IHBhZ2UgPSBhY3RpdmVDb21wb3NpdGlvbiA/XG4gICAgICBjb21wb3NpdGlvbkRlZmluaXRpb25zWyBwYWdlUmVmZXJlbmNlIF1bIGFjdGl2ZUNvbXBvc2l0aW9uIF1bIGNvbXBvc2l0aW9uRGlzcGxheSBdIDpcbiAgICAgIHBhZ2VEZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdWyBjb21wb3NpdGlvbkRpc3BsYXkgXTtcbiAgIGNvbnNvbGUubG9nKCAnPj4gUGFnZUluZm8nLCBwYWdlSW5mbyApOyAvLyA6VE9ETzogREVMRVRFIE1FXG4gICBjb25zb2xlLmxvZyggJz4+IG9wdGlvbnMnLCBvcHRpb25zICk7IC8vIDpUT0RPOiBERUxFVEUgTUVcbiAgIGNvbnNvbGUubG9nKCAnPj4gcGFnZScsIHBhZ2UgKTsgLy8gOlRPRE86IERFTEVURSBNRVxuXG5cbiAgIGNvbnN0IHZlcnRpY2VzID0ge307XG4gICBjb25zdCBlZGdlcyA9IHt9O1xuXG4gICBpZGVudGlmeVZlcnRpY2VzKCk7XG4gICBpZiggd2l0aENvbnRhaW5lcnMgKSB7XG4gICAgICBpZGVudGlmeUNvbnRhaW5lcnMoKTtcbiAgIH1cbiAgIGlmKCAhd2l0aElycmVsZXZhbnRXaWRnZXRzICkge1xuICAgICAgcHJ1bmVJcnJlbGV2YW50V2lkZ2V0cyggd2l0aENvbnRhaW5lcnMgKTtcbiAgIH1cbiAgIHBydW5lRW1wdHlFZGdlcygpO1xuXG4gICByZXR1cm4gZ3JhcGhNb2RlbC5jb252ZXJ0LmdyYXBoKCB7XG4gICAgICB2ZXJ0aWNlcyxcbiAgICAgIGVkZ2VzXG4gICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGlkZW50aWZ5VmVydGljZXMoKSB7XG4gICAgICBPYmplY3Qua2V5cyggcGFnZS5hcmVhcyApLmZvckVhY2goIGFyZWFOYW1lID0+IHtcbiAgICAgICAgIHBhZ2UuYXJlYXNbIGFyZWFOYW1lIF0uZm9yRWFjaCggcGFnZUFyZWFJdGVtID0+IHtcbiAgICAgICAgICAgIGlmKCBpc1dpZGdldCggcGFnZUFyZWFJdGVtICkgKSB7XG4gICAgICAgICAgICAgICBwcm9jZXNzV2lkZ2V0SW5zdGFuY2UoIHBhZ2VBcmVhSXRlbSwgYXJlYU5hbWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIGlzQ29tcG9zaXRpb24oIHBhZ2VBcmVhSXRlbSApICkge1xuICAgICAgICAgICAgICAgcHJvY2Vzc0NvbXBvc2l0aW9uSW5zdGFuY2UoIHBhZ2VBcmVhSXRlbSwgYXJlYU5hbWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIGlzTGF5b3V0KCBwYWdlQXJlYUl0ZW0gKSApIHtcbiAgICAgICAgICAgICAgIHByb2Nlc3NMYXlvdXRJbnN0YW5jZSggcGFnZUFyZWFJdGVtLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSApO1xuICAgICAgfSApO1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzTGF5b3V0SW5zdGFuY2UoIGxheW91dCwgYXJlYU5hbWUgKSB7XG4gICAgICAgICB2ZXJ0aWNlc1sgbGF5b3V0LmlkIF0gPSB7XG4gICAgICAgICAgICBpZDogbGF5b3V0LmlkLFxuICAgICAgICAgICAgbGFiZWw6IGxheW91dC5pZCxcbiAgICAgICAgICAgIGtpbmQ6ICdMQVlPVVQnLFxuICAgICAgICAgICAgcG9ydHM6IHsgaW5ib3VuZDogW10sIG91dGJvdW5kOiBbXSB9XG4gICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzV2lkZ2V0SW5zdGFuY2UoIHdpZGdldEluc3RhbmNlLCBhcmVhTmFtZSApIHtcbiAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSB3aWRnZXREZXNjcmlwdG9yc1sgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0IF07XG5cbiAgICAgICAgIGNvbnN0IGtpbmRzID0ge1xuICAgICAgICAgICAgd2lkZ2V0OiAnV0lER0VUJyxcbiAgICAgICAgICAgIGFjdGl2aXR5OiAnQUNUSVZJVFknXG4gICAgICAgICB9O1xuXG4gICAgICAgICBjb25zdCB7IGlkIH0gPSB3aWRnZXRJbnN0YW5jZTtcbiAgICAgICAgIGNvbnN0IHBvcnRzID0gaWRlbnRpZnlQb3J0cyggd2lkZ2V0SW5zdGFuY2UuZmVhdHVyZXMsIGRlc2NyaXB0b3IuZmVhdHVyZXMgKTtcbiAgICAgICAgIHZlcnRpY2VzWyBpZCBdID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGlkLFxuICAgICAgICAgICAga2luZDoga2luZHNbIGRlc2NyaXB0b3IuaW50ZWdyYXRpb24udHlwZSBdLFxuICAgICAgICAgICAgcG9ydHM6IHBvcnRzXG4gICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzQ29tcG9zaXRpb25JbnN0YW5jZSggY29tcG9zaXRpb25JbnN0YW5jZSwgYXJlYU5hbWUgKSB7XG4gICAgICAgICBjb25zdCB7IGlkIH0gPSBjb21wb3NpdGlvbkluc3RhbmNlO1xuICAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IGNvbXBvc2l0aW9uRGVmaW5pdGlvbnNbIHBhZ2VSZWZlcmVuY2UgXVsgaWQgXS5DT01QQUNUO1xuXG4gICAgICAgICBjb25zdCBzY2hlbWEgPSBkZWZpbml0aW9uLmZlYXR1cmVzLnR5cGUgP1xuICAgICAgICAgICAgZGVmaW5pdGlvbi5mZWF0dXJlcyA6XG4gICAgICAgICAgICB7IHR5cGU6ICdvYmplY3QnLCBwcm9wZXJ0aWVzOiBkZWZpbml0aW9uLmZlYXR1cmVzIH07XG5cbiAgICAgICAgIGNvbnN0IHBvcnRzID0gaWRlbnRpZnlQb3J0cyhcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uSW5zdGFuY2UuZmVhdHVyZXMgfHwge30sXG4gICAgICAgICAgICBvYmplY3Qub3B0aW9ucyggc2NoZW1hIClcbiAgICAgICAgICk7XG5cbiAgICAgICAgIC8qXG4gICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiSURFTlQgQ09NUE9TSVRJT04gUE9SVFNcXG5cIixcbiAgICAgICAgICAgIG9iamVjdC5kZWVwQ2xvbmUoIGNvbXBvc2l0aW9uSW5zdGFuY2UgKSwgJ1xcbicsXG4gICAgICAgICAgICBvYmplY3QuZGVlcENsb25lKCBjb21wb3NpdGlvbkluc3RhbmNlLmZlYXR1cmVzIHx8IHt9ICksICdcXG4nLFxuICAgICAgICAgICAgb2JqZWN0LmRlZXBDbG9uZSggc2NoZW1hICksICdcXG4gLS0tLS0+ICcsXG4gICAgICAgICAgICBvYmplY3QuZGVlcENsb25lKCBwb3J0cyApXG4gICAgICAgICApO1xcXG4gICAgICAgICAqL1xuXG4gICAgICAgICB2ZXJ0aWNlc1sgaWQgXSA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBpZCxcbiAgICAgICAgICAgIGtpbmQ6ICdDT01QT1NJVElPTicsXG4gICAgICAgICAgICBwb3J0czogcG9ydHNcbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGlkZW50aWZ5UG9ydHMoIHZhbHVlLCBzY2hlbWEsIHBhdGgsIHBvcnRzICkge1xuICAgICAgICAgcGF0aCA9IHBhdGggfHwgW107XG4gICAgICAgICBwb3J0cyA9IHBvcnRzIHx8IHsgaW5ib3VuZDogW10sIG91dGJvdW5kOiBbXSB9O1xuICAgICAgICAgaWYoICF2YWx1ZSB8fCAhc2NoZW1hICkge1xuICAgICAgICAgICAgcmV0dXJuIHBvcnRzO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggdmFsdWUuZW5hYmxlZCA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAvLyBmZWF0dXJlIGNhbiBiZSBkaXNhYmxlZCwgYW5kIHdhcyBkaXNhYmxlZFxuICAgICAgICAgICAgcmV0dXJuIHBvcnRzO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnc3RyaW5nJyAmJiBzY2hlbWEuYXhSb2xlICYmXG4gICAgICAgICAgICAgKCBzY2hlbWEuZm9ybWF0ID09PSAndG9waWMnIHx8IHNjaGVtYS5mb3JtYXQgPT09ICdmbGFnLXRvcGljJyApICkge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHNjaGVtYS5heFBhdHRlcm4gPyBzY2hlbWEuYXhQYXR0ZXJuLnRvVXBwZXJDYXNlKCkgOiBpbmZlckVkZ2VUeXBlKCBwYXRoICk7XG4gICAgICAgICAgICBpZiggIXR5cGUgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc3QgZWRnZUlkID0gdHlwZSArICc6JyArIHZhbHVlO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBwYXRoLmpvaW4oICcuJyApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSAgcGF0aC5qb2luKCAnOicgKTtcbiAgICAgICAgICAgIHBvcnRzWyBzY2hlbWEuYXhSb2xlID09PSAnb3V0bGV0JyA/ICdvdXRib3VuZCcgOiAnaW5ib3VuZCcgXS5wdXNoKCB7XG4gICAgICAgICAgICAgICBsYWJlbCwgaWQsIHR5cGUsIGVkZ2VJZFxuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgaWYoIGVkZ2VJZCAmJiAhZWRnZXNbIGVkZ2VJZCBdICkge1xuICAgICAgICAgICAgICAgZWRnZXNbIGVkZ2VJZCBdID0geyB0eXBlLCBpZDogZWRnZUlkLCBsYWJlbDogdmFsdWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnb2JqZWN0JyAmJiBzY2hlbWEucHJvcGVydGllcyApIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBzY2hlbWEucHJvcGVydGllcyApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVNjaGVtYSA9IHNjaGVtYS5wcm9wZXJ0aWVzWyBrZXkgXSB8fCBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXM7XG4gICAgICAgICAgICAgICBpZGVudGlmeVBvcnRzKCB2YWx1ZVsga2V5IF0sIHByb3BlcnR5U2NoZW1hLCBwYXRoLmNvbmNhdCggWyBrZXkgXSApLCBwb3J0cyApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnYXJyYXknICkge1xuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCggKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgICAgIGlkZW50aWZ5UG9ydHMoIGl0ZW0sIHNjaGVtYS5pdGVtcywgcGF0aC5jb25jYXQoIFsgaSBdICksIHBvcnRzICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gcG9ydHM7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGluZmVyRWRnZVR5cGUoIHBhdGggKSB7XG4gICAgICAgICBpZiggIXBhdGgubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICB9XG4gICAgICAgICBjb25zdCBsYXN0U2VnbWVudCA9IHBhdGhbIHBhdGgubGVuZ3RoIC0gMSBdO1xuICAgICAgICAgaWYoIFsgJ2FjdGlvbicsICdmbGFnJywgJ3Jlc291cmNlJyBdLmluZGV4T2YoIGxhc3RTZWdtZW50ICkgIT09IC0xICkge1xuICAgICAgICAgICAgcmV0dXJuIGxhc3RTZWdtZW50LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggbGFzdFNlZ21lbnQgPT09ICdvbkFjdGlvbnMnICkge1xuICAgICAgICAgICAgcmV0dXJuICdBQ1RJT04nO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGluZmVyRWRnZVR5cGUoIHBhdGguc2xpY2UoIDAsIHBhdGgubGVuZ3RoIC0gMSApICk7XG4gICAgICB9XG5cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaWRlbnRpZnlDb250YWluZXJzKCkge1xuICAgICAgY29uc3QgdHlwZSA9IFRZUEVfQ09OVEFJTkVSO1xuXG4gICAgICB2ZXJ0aWNlc1sgUEFHRV9JRCBdID0ge1xuICAgICAgICAgUEFHRV9JRCxcbiAgICAgICAgIGxhYmVsOiBhY3RpdmVDb21wb3NpdGlvbiA/IGFjdGl2ZUNvbXBvc2l0aW9uIDogKCAnUGFnZSAnICsgcGFnZVJlZmVyZW5jZSApLFxuICAgICAgICAga2luZDogJ1BBR0UnLFxuICAgICAgICAgcG9ydHM6IHsgaW5ib3VuZDogW10sIG91dGJvdW5kOiBbXSB9XG4gICAgICB9O1xuXG4gICAgICBPYmplY3Qua2V5cyggcGFnZS5hcmVhcyApLmZvckVhY2goIGFyZWFOYW1lID0+IHtcbiAgICAgICAgIGluc2VydEVkZ2UoIGFyZWFOYW1lICk7XG4gICAgICAgICBjb25zdCBvd25lciA9IGZpbmRPd25lciggYXJlYU5hbWUgKTtcbiAgICAgICAgIGlmKCAhb3duZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjb250YWluc0FueXRoaW5nID0gZmFsc2U7XG4gICAgICAgICBwYWdlLmFyZWFzWyBhcmVhTmFtZSBdXG4gICAgICAgICAgICAuZmlsdGVyKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBpc0NvbXBvc2l0aW9uKCBpdGVtICkgP1xuICAgICAgICAgICAgICAgICAgY29tcG9zaXRpb25EaXNwbGF5ID09PSAnQ09NUEFDVCcgOlxuICAgICAgICAgICAgICAgICAgdHJ1ZTtcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgLmZvckVhY2goIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgaWYoIHZlcnRpY2VzWyBpdGVtLmlkIF0gKSB7XG4gICAgICAgICAgICAgICAgICBpbnNlcnRVcGxpbmsoIHZlcnRpY2VzWyBpdGVtLmlkIF0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICAgICAgICBjb250YWluc0FueXRoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIGlmKCBjb250YWluc0FueXRoaW5nICkge1xuICAgICAgICAgICAgaW5zZXJ0T3duZXJQb3J0KCBvd25lciwgYXJlYU5hbWUgKTtcbiAgICAgICAgIH1cbiAgICAgIH0gKTtcblxuICAgICAgZnVuY3Rpb24gZmluZE93bmVyKCBhcmVhTmFtZSApIHtcbiAgICAgICAgIGlmKCBhcmVhTmFtZS5pbmRleE9mKCAnLicgKSA9PT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVydGljZXNbIFBBR0VfSUQgXTtcbiAgICAgICAgIH1cbiAgICAgICAgIGNvbnN0IHByZWZpeCA9IGFyZWFOYW1lLnNsaWNlKCAwLCBhcmVhTmFtZS5sYXN0SW5kZXhPZiggJy4nICkgKTtcbiAgICAgICAgIHJldHVybiB2ZXJ0aWNlc1sgcHJlZml4IF07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGluc2VydE93bmVyUG9ydCggdmVydGV4LCBhcmVhTmFtZSApIHtcbiAgICAgICAgIHZlcnRleC5wb3J0cy5vdXRib3VuZC51bnNoaWZ0KCB7XG4gICAgICAgICAgICBpZDogJ0NPTlRBSU5FUjonICsgYXJlYU5hbWUsXG4gICAgICAgICAgICB0eXBlOiBUWVBFX0NPTlRBSU5FUixcbiAgICAgICAgICAgIGVkZ2VJZDogYXJlYUVkZ2VJZCggYXJlYU5hbWUgKSxcbiAgICAgICAgICAgIGxhYmVsOiBhcmVhTmFtZVxuICAgICAgICAgfSApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbnNlcnRVcGxpbmsoIHZlcnRleCwgYXJlYU5hbWUgKSB7XG4gICAgICAgICB2ZXJ0ZXgucG9ydHMuaW5ib3VuZC51bnNoaWZ0KCB7XG4gICAgICAgICAgICBpZDogJ0NPTlRBSU5FUjphbmNob3InLFxuICAgICAgICAgICAgdHlwZTogVFlQRV9DT05UQUlORVIsXG4gICAgICAgICAgICBlZGdlSWQ6IGFyZWFFZGdlSWQoIGFyZWFOYW1lICksXG4gICAgICAgICAgICBsYWJlbDogJ2FuY2hvcidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5zZXJ0RWRnZSggYXJlYU5hbWUgKSB7XG4gICAgICAgICBjb25zdCBpZCA9IGFyZWFFZGdlSWQoIGFyZWFOYW1lICk7XG4gICAgICAgICBlZGdlc1sgaWQgXSA9IHsgaWQsIHR5cGUsIGxhYmVsOiBhcmVhTmFtZSB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcmVhRWRnZUlkKCBhcmVhTmFtZSApIHtcbiAgICAgICAgIHJldHVybiBUWVBFX0NPTlRBSU5FUiArICc6JyArIGFyZWFOYW1lO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBwcnVuZUlycmVsZXZhbnRXaWRnZXRzKCB3aXRoQ29udGFpbmVycyApIHtcbiAgICAgIGxldCB0b1BydW5lID0gW107XG4gICAgICBkbyB7XG4gICAgICAgICB0b1BydW5lLmZvckVhY2goIGlkID0+IHsgZGVsZXRlIHZlcnRpY2VzWyBpZCBdOyB9ICk7XG4gICAgICAgICBwcnVuZUVtcHR5RWRnZXMoKTtcbiAgICAgICAgIHRvUHJ1bmUgPSBtYXJrKCk7XG4gICAgICB9IHdoaWxlKCB0b1BydW5lLmxlbmd0aCApO1xuXG4gICAgICBmdW5jdGlvbiBtYXJrKCkge1xuICAgICAgICAgY29uc3QgcHJ1bmVMaXN0ID0gW107XG4gICAgICAgICBPYmplY3Qua2V5cyggdmVydGljZXMgKS5mb3JFYWNoKCB2SWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9ydHMgPSB2ZXJ0aWNlc1sgdklkIF0ucG9ydHM7XG4gICAgICAgICAgICBpZiggcG9ydHMuaW5ib3VuZC5sZW5ndGggPD0gd2l0aENvbnRhaW5lcnMgPyAxIDogMCApIHtcbiAgICAgICAgICAgICAgIGlmKCBwb3J0cy5vdXRib3VuZC5ldmVyeSggXyA9PiAhXy5lZGdlSWQgKSApIHtcbiAgICAgICAgICAgICAgICAgIHBydW5lTGlzdC5wdXNoKCB2SWQgICk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICB9ICk7XG4gICAgICAgICByZXR1cm4gcHJ1bmVMaXN0O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBwcnVuZUVtcHR5RWRnZXMoKSB7XG4gICAgICBjb25zdCB0b1BydW5lID0gW107XG4gICAgICBPYmplY3Qua2V5cyggZWRnZXMgKS5mb3JFYWNoKCBlZGdlSWQgPT4ge1xuICAgICAgICAgY29uc3QgdHlwZSA9IGVkZ2VUeXBlc1sgZWRnZXNbIGVkZ2VJZCBdLnR5cGUgXTtcbiAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBPYmplY3Qua2V5cyggdmVydGljZXMgKS5maWx0ZXIoIGlzU291cmNlT2YoIGVkZ2VJZCApICk7XG4gICAgICAgICBjb25zdCBzaW5rcyA9IE9iamVjdC5rZXlzKCB2ZXJ0aWNlcyApLmZpbHRlciggaXNTaW5rT2YoIGVkZ2VJZCApICk7XG4gICAgICAgICBjb25zdCBoYXNTb3VyY2VzID0gc291cmNlcy5sZW5ndGggPiAwO1xuICAgICAgICAgY29uc3QgaGFzU2lua3MgPSBzaW5rcy5sZW5ndGggPiAwO1xuICAgICAgICAgY29uc3QgaXNFbXB0eSA9IHR5cGUub3duaW5nUG9ydCA/ICghaGFzU291cmNlcyB8fCAhaGFzU2lua3MpIDogKCFoYXNTb3VyY2VzICYmICFoYXNTaW5rcyk7XG4gICAgICAgICBpZiggIWlzRW1wdHkgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRvUHJ1bmUucHVzaCggZWRnZUlkICk7XG4gICAgICAgICBzb3VyY2VzLmNvbmNhdCggc2lua3MgKS5mb3JFYWNoKCB2ZXJ0ZXhJZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3J0cyA9IHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzO1xuICAgICAgICAgICAgcG9ydHMuaW5ib3VuZC5jb25jYXQoIHBvcnRzLm91dGJvdW5kICkuZm9yRWFjaCggcG9ydCA9PiB7XG4gICAgICAgICAgICAgICBwb3J0LmVkZ2VJZCA9IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgPyBudWxsIDogcG9ydC5lZGdlSWQ7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9ICk7XG4gICAgICB9ICk7XG4gICAgICB0b1BydW5lLmZvckVhY2goIGlkID0+IHsgZGVsZXRlIGVkZ2VzWyBpZCBdOyB9ICk7XG5cbiAgICAgIGZ1bmN0aW9uIGlzU291cmNlT2YoIGVkZ2VJZCApIHtcbiAgICAgICAgIHJldHVybiBmdW5jdGlvbiggdmVydGV4SWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVydGljZXNbIHZlcnRleElkIF0ucG9ydHMuaW5ib3VuZC5zb21lKCBwb3J0ID0+IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgKTtcbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzU2lua09mKCBlZGdlSWQgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHZlcnRleElkICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzLm91dGJvdW5kLnNvbWUoIHBvcnQgPT4gcG9ydC5lZGdlSWQgPT09IGVkZ2VJZCApO1xuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBpc0NvbXBvc2l0aW9uKCBwYWdlQXJlYUl0ZW0gKSB7XG4gICByZXR1cm4gISFwYWdlQXJlYUl0ZW0uY29tcG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIGlzV2lkZ2V0KCBwYWdlQXJlYUl0ZW0gKSB7XG4gICByZXR1cm4gISFwYWdlQXJlYUl0ZW0ud2lkZ2V0O1xufVxuXG5mdW5jdGlvbiBpc0xheW91dCggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLmxheW91dDtcbn1cblxuZnVuY3Rpb24gZWl0aGVyKCBmLCBnICkge1xuICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGYuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApIHx8IGcuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgfTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGxheW91dCggZ3JhcGggKSB7XG4gICByZXR1cm4gbGF5b3V0TW9kZWwuY29udmVydC5sYXlvdXQoIHtcbiAgICAgIHZlcnRpY2VzOiB7fSxcbiAgICAgIGVkZ2VzOiB7fVxuICAgfSApO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZXMoKSB7XG4gICByZXR1cm4gZ3JhcGhNb2RlbC5jb252ZXJ0LnR5cGVzKCBlZGdlVHlwZXMgKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2l0aW9uU3RhY2soIGNvbXBvc2l0aW9uSW5zdGFuY2VJZCApIHtcbiAgIHJldHVybiBbXTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckZyb21TZWxlY3Rpb24oIHNlbGVjdGlvbiwgZ3JhcGhNb2RlbCApIHtcbiAgIGNvbnN0IHRvcGljcyA9IHNlbGVjdGlvbi5lZGdlcy5mbGF0TWFwKCBlZGdlSWQgPT4ge1xuICAgICAgY29uc3QgWyB0eXBlLCB0b3BpYyBdID0gZWRnZUlkLnNwbGl0KCAnOicgKTtcbiAgICAgIHJldHVybiAoIHR5cGUgPT09ICdDT05UQUlORVInICkgPyBbXSA6IFt7IHBhdHRlcm46IHR5cGUsIHRvcGljIH1dO1xuICAgfSApLnRvSlMoKTtcblxuICAgY29uc3QgcGFydGljaXBhbnRzID0gc2VsZWN0aW9uLnZlcnRpY2VzLmZsYXRNYXAoIHZlcnRleElkID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGtpbmQgfSA9IGdyYXBoTW9kZWwudmVydGljZXMuZ2V0KCB2ZXJ0ZXhJZCApO1xuICAgICAgcmV0dXJuICgga2luZCA9PT0gJ1BBR0UnIHx8IGtpbmQgPT09ICdMQVlPVVQnICkgPyBbXSA6IFt7IGtpbmQsIHBhcnRpY2lwYW50OiB2ZXJ0ZXhJZCB9XTtcbiAgIH0gKTtcblxuICAgcmV0dXJuIHtcbiAgICAgIHRvcGljcyxcbiAgICAgIHBhcnRpY2lwYW50c1xuICAgfTtcbn1cbiJdfQ==
