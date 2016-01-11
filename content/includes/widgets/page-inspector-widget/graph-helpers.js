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






      options.withIrrelevantWidgets;var withIrrelevantWidgets = _options$withIrrelevantWidgets === undefined ? false : _options$withIrrelevantWidgets;var _options$withContainers = options.withContainers;var withContainers = _options$withContainers === undefined ? true : _options$withContainers;var _options$compositionDisplay = options.compositionDisplay;var compositionDisplay = _options$compositionDisplay === undefined ? 'FLAT' : _options$compositionDisplay;var _options$activeComposition = options.activeComposition;var activeComposition = _options$activeComposition === undefined ? null : _options$activeComposition;

      var PAGE_ID = '.';var 

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
//# sourceMappingURL=data:application/json;base64,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QUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUMzRixDQUFFLENBQUM7OztBQUVKLGFBQU87QUFDSixlQUFNLEVBQU4sTUFBTTtBQUNOLHFCQUFZLEVBQVosWUFBWSxFQUNkLENBQUMsQ0FDSiIsImZpbGUiOiJncmFwaC1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdpcmVmbG93IGZyb20gJ3dpcmVmbG93JztcblxuaW1wb3J0IHsgb2JqZWN0IH0gZnJvbSAnbGF4YXInO1xuXG5jb25zdCBUWVBFX0NPTlRBSU5FUiA9ICdDT05UQUlORVInO1xuXG5jb25zdCB7XG4gIGxheW91dDoge1xuICAgICBtb2RlbDogbGF5b3V0TW9kZWxcbiAgfSxcbiAgZ3JhcGg6IHtcbiAgICBtb2RlbDogZ3JhcGhNb2RlbFxuICB9XG59ID0gd2lyZWZsb3c7XG5cbmNvbnN0IGVkZ2VUeXBlcyA9IHtcbiAgIFJFU09VUkNFOiB7XG4gICAgICBoaWRkZW46IGZhbHNlLFxuICAgICAgbGFiZWw6ICdSZXNvdXJjZXMnXG4gICB9LFxuICAgRkxBRzoge1xuICAgICAgbGFiZWw6ICdGbGFncycsXG4gICAgICBoaWRkZW46IGZhbHNlXG4gICB9LFxuICAgQUNUSU9OOiB7XG4gICAgICBsYWJlbDogJ0FjdGlvbnMnLFxuICAgICAgaGlkZGVuOiBmYWxzZVxuICAgfSxcbiAgIENPTlRBSU5FUjoge1xuICAgICAgaGlkZGVuOiBmYWxzZSxcbiAgICAgIGxhYmVsOiAnQ29udGFpbmVyJyxcbiAgICAgIG93bmluZ1BvcnQ6ICdvdXRib3VuZCdcbiAgIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgd2lyZWZsb3cgZ3JhcGggZnJvbSBhIGdpdmVuIHBhZ2Uvd2lkZ2V0IGluZm9ybWF0aW9uIG1vZGVsLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWdlSW5mb1xuICogQHBhcmFtIHtCb29sZWFuPWZhbHNlfSBwYWdlSW5mby53aXRoSXJyZWxldmFudFdpZGdldHNcbiAqICAgSWYgc2V0IHRvIGB0cnVlYCwgd2lkZ2V0cyB3aXRob3V0IGFueSByZWxldmFuY2UgdG8gYWN0aW9ucy9yZXNvdXJjZXMvZmxhZ3MgYXJlIHJlbW92ZWQuXG4gKiAgIENvbnRhaW5lcnMgb2Ygd2lkZ2V0cyAodGhhdCBhcmUgcmVsZXZhbnQgYnkgdGhpcyBtZWFzdXJlKSBhcmUga2VwdC5cbiAqIEBwYXJhbSB7Qm9vbGVhbj1mYWxzZX0gcGFnZUluZm8ud2l0aENvbnRhaW5lcnNcbiAqICAgSWYgc2V0IHRvIGB0cnVlYCwgQ29udGFpbmVyIHJlbGF0aW9uc2hpcHMgYXJlIGluY2x1ZGVkIGluIHRoZSBncmFwaCByZXByZXNlbnRhdGlvbi5cbiAqIEBwYXJhbSB7U3RyaW5nPSdGTEFUJ30gcGFnZUluZm8uY29tcG9zaXRpb25EaXNwbGF5XG4gKiAgIElmIHNldCB0byBgJ0NPTVBBQ1QnYCAoZGVmYXVsdCksIGNvbXBvc2l0aW9ucyBhcmUgcmVwcmVzZW50ZWQgYnkgYW4gaW5zdGFuY2Ugbm9kZSwgcmVmbGVjdGluZyB0aGVpciBkZXZlbG9wbWVudC10aW1lIG1vZGVsLlxuICogICBJZiBzZXQgdG8gYCdGTEFUJ2AsIGNvbXBvc2l0aW9ucyBhcmUgcmVwbGFjZWQgcmVjdXJzaXZlbHkgYnkgdGhlaXIgY29uZmlndXJlZCBleHBhbnNpb24sIHJlZmxlY3RpbmcgdGhlaXIgcnVuLXRpbWUgbW9kZWwuXG4gKiBAcGFyYW0ge1N0cmluZz1udWxsfSBwYWdlSW5mby5hY3RpdmVDb21wb3NpdGlvblxuICogICBJZiBzZXQsIGdlbmVyYXRlIGEgZ3JhcGggZm9yIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gY29tcG9zaXRpb24sIHJhdGhlciB0aGFuIGZvciB0aGUgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyYXBoKCBwYWdlSW5mbywgb3B0aW9ucyApIHtcblxuICAgY29uc3Qge1xuICAgICAgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gZmFsc2UsXG4gICAgICB3aXRoQ29udGFpbmVycyA9IHRydWUsXG4gICAgICBjb21wb3NpdGlvbkRpc3BsYXkgPSAnRkxBVCcsXG4gICAgICBhY3RpdmVDb21wb3NpdGlvbiA9IG51bGxcbiAgIH0gPSBvcHRpb25zO1xuXG4gICBjb25zdCBQQUdFX0lEID0gJy4nO1xuICAgY29uc3Qge1xuICAgICAgcGFnZVJlZmVyZW5jZSxcbiAgICAgIHBhZ2VEZWZpbml0aW9ucyxcbiAgICAgIHdpZGdldERlc2NyaXB0b3JzLFxuICAgICAgY29tcG9zaXRpb25EZWZpbml0aW9uc1xuICAgfSA9IHBhZ2VJbmZvO1xuICAgY29uc3QgcGFnZSA9IGFjdGl2ZUNvbXBvc2l0aW9uID9cbiAgICAgIGNvbXBvc2l0aW9uRGVmaW5pdGlvbnNbIHBhZ2VSZWZlcmVuY2UgXVsgYWN0aXZlQ29tcG9zaXRpb24gXVsgY29tcG9zaXRpb25EaXNwbGF5IF0gOlxuICAgICAgcGFnZURlZmluaXRpb25zWyBwYWdlUmVmZXJlbmNlIF1bIGNvbXBvc2l0aW9uRGlzcGxheSBdO1xuICAgY29uc29sZS5sb2coICc+PiBQYWdlSW5mbycsIHBhZ2VJbmZvICk7IC8vIDpUT0RPOiBERUxFVEUgTUVcbiAgIGNvbnNvbGUubG9nKCAnPj4gb3B0aW9ucycsIG9wdGlvbnMgKTsgLy8gOlRPRE86IERFTEVURSBNRVxuICAgY29uc29sZS5sb2coICc+PiBwYWdlJywgcGFnZSApOyAvLyA6VE9ETzogREVMRVRFIE1FXG5cblxuICAgY29uc3QgdmVydGljZXMgPSB7fTtcbiAgIGNvbnN0IGVkZ2VzID0ge307XG5cbiAgIGlkZW50aWZ5VmVydGljZXMoKTtcbiAgIGlmKCB3aXRoQ29udGFpbmVycyApIHtcbiAgICAgIGlkZW50aWZ5Q29udGFpbmVycygpO1xuICAgfVxuICAgaWYoICF3aXRoSXJyZWxldmFudFdpZGdldHMgKSB7XG4gICAgICBwcnVuZUlycmVsZXZhbnRXaWRnZXRzKCB3aXRoQ29udGFpbmVycyApO1xuICAgfVxuICAgcHJ1bmVFbXB0eUVkZ2VzKCk7XG5cbiAgIHJldHVybiBncmFwaE1vZGVsLmNvbnZlcnQuZ3JhcGgoIHtcbiAgICAgIHZlcnRpY2VzLFxuICAgICAgZWRnZXNcbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaWRlbnRpZnlWZXJ0aWNlcygpIHtcbiAgICAgIE9iamVjdC5rZXlzKCBwYWdlLmFyZWFzICkuZm9yRWFjaCggYXJlYU5hbWUgPT4ge1xuICAgICAgICAgcGFnZS5hcmVhc1sgYXJlYU5hbWUgXS5mb3JFYWNoKCBwYWdlQXJlYUl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYoIGlzV2lkZ2V0KCBwYWdlQXJlYUl0ZW0gKSApIHtcbiAgICAgICAgICAgICAgIHByb2Nlc3NXaWRnZXRJbnN0YW5jZSggcGFnZUFyZWFJdGVtLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiggaXNDb21wb3NpdGlvbiggcGFnZUFyZWFJdGVtICkgKSB7XG4gICAgICAgICAgICAgICBwcm9jZXNzQ29tcG9zaXRpb25JbnN0YW5jZSggcGFnZUFyZWFJdGVtLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiggaXNMYXlvdXQoIHBhZ2VBcmVhSXRlbSApICkge1xuICAgICAgICAgICAgICAgcHJvY2Vzc0xheW91dEluc3RhbmNlKCBwYWdlQXJlYUl0ZW0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9ICk7XG4gICAgICB9ICk7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NMYXlvdXRJbnN0YW5jZSggbGF5b3V0LCBhcmVhTmFtZSApIHtcbiAgICAgICAgIHZlcnRpY2VzWyBsYXlvdXQuaWQgXSA9IHtcbiAgICAgICAgICAgIGlkOiBsYXlvdXQuaWQsXG4gICAgICAgICAgICBsYWJlbDogbGF5b3V0LmlkLFxuICAgICAgICAgICAga2luZDogJ0xBWU9VVCcsXG4gICAgICAgICAgICBwb3J0czogeyBpbmJvdW5kOiBbXSwgb3V0Ym91bmQ6IFtdIH1cbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NXaWRnZXRJbnN0YW5jZSggd2lkZ2V0SW5zdGFuY2UsIGFyZWFOYW1lICkge1xuICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IHdpZGdldERlc2NyaXB0b3JzWyB3aWRnZXRJbnN0YW5jZS53aWRnZXQgXTtcblxuICAgICAgICAgY29uc3Qga2luZHMgPSB7XG4gICAgICAgICAgICB3aWRnZXQ6ICdXSURHRVQnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICdBQ1RJVklUWSdcbiAgICAgICAgIH07XG5cbiAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHdpZGdldEluc3RhbmNlO1xuICAgICAgICAgY29uc3QgcG9ydHMgPSBpZGVudGlmeVBvcnRzKCB3aWRnZXRJbnN0YW5jZS5mZWF0dXJlcywgZGVzY3JpcHRvci5mZWF0dXJlcyApO1xuICAgICAgICAgdmVydGljZXNbIGlkIF0gPSB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogaWQsXG4gICAgICAgICAgICBraW5kOiBraW5kc1sgZGVzY3JpcHRvci5pbnRlZ3JhdGlvbi50eXBlIF0sXG4gICAgICAgICAgICBwb3J0czogcG9ydHNcbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NDb21wb3NpdGlvbkluc3RhbmNlKCBjb21wb3NpdGlvbkluc3RhbmNlLCBhcmVhTmFtZSApIHtcbiAgICAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbXBvc2l0aW9uSW5zdGFuY2U7XG4gICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gY29tcG9zaXRpb25EZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdWyBpZCBdLkNPTVBBQ1Q7XG5cbiAgICAgICAgIGNvbnN0IHNjaGVtYSA9IGRlZmluaXRpb24uZmVhdHVyZXMudHlwZSA/XG4gICAgICAgICAgICBkZWZpbml0aW9uLmZlYXR1cmVzIDpcbiAgICAgICAgICAgIHsgdHlwZTogJ29iamVjdCcsIHByb3BlcnRpZXM6IGRlZmluaXRpb24uZmVhdHVyZXMgfTtcblxuICAgICAgICAgY29uc3QgcG9ydHMgPSBpZGVudGlmeVBvcnRzKFxuICAgICAgICAgICAgY29tcG9zaXRpb25JbnN0YW5jZS5mZWF0dXJlcyB8fCB7fSxcbiAgICAgICAgICAgIG9iamVjdC5vcHRpb25zKCBzY2hlbWEgKVxuICAgICAgICAgKTtcblxuICAgICAgICAgLypcbiAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJJREVOVCBDT01QT1NJVElPTiBQT1JUU1xcblwiLFxuICAgICAgICAgICAgb2JqZWN0LmRlZXBDbG9uZSggY29tcG9zaXRpb25JbnN0YW5jZSApLCAnXFxuJyxcbiAgICAgICAgICAgIG9iamVjdC5kZWVwQ2xvbmUoIGNvbXBvc2l0aW9uSW5zdGFuY2UuZmVhdHVyZXMgfHwge30gKSwgJ1xcbicsXG4gICAgICAgICAgICBvYmplY3QuZGVlcENsb25lKCBzY2hlbWEgKSwgJ1xcbiAtLS0tLT4gJyxcbiAgICAgICAgICAgIG9iamVjdC5kZWVwQ2xvbmUoIHBvcnRzIClcbiAgICAgICAgICk7XFxcbiAgICAgICAgICovXG5cbiAgICAgICAgIHZlcnRpY2VzWyBpZCBdID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGlkLFxuICAgICAgICAgICAga2luZDogJ0NPTVBPU0lUSU9OJyxcbiAgICAgICAgICAgIHBvcnRzOiBwb3J0c1xuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaWRlbnRpZnlQb3J0cyggdmFsdWUsIHNjaGVtYSwgcGF0aCwgcG9ydHMgKSB7XG4gICAgICAgICBwYXRoID0gcGF0aCB8fCBbXTtcbiAgICAgICAgIHBvcnRzID0gcG9ydHMgfHwgeyBpbmJvdW5kOiBbXSwgb3V0Ym91bmQ6IFtdIH07XG4gICAgICAgICBpZiggIXZhbHVlIHx8ICFzY2hlbWEgKSB7XG4gICAgICAgICAgICByZXR1cm4gcG9ydHM7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKCB2YWx1ZS5lbmFibGVkID09PSBmYWxzZSApIHtcbiAgICAgICAgICAgIC8vIGZlYXR1cmUgY2FuIGJlIGRpc2FibGVkLCBhbmQgd2FzIGRpc2FibGVkXG4gICAgICAgICAgICByZXR1cm4gcG9ydHM7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdzdHJpbmcnICYmIHNjaGVtYS5heFJvbGUgJiZcbiAgICAgICAgICAgICAoIHNjaGVtYS5mb3JtYXQgPT09ICd0b3BpYycgfHwgc2NoZW1hLmZvcm1hdCA9PT0gJ2ZsYWctdG9waWMnICkgKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLmF4UGF0dGVybiA/IHNjaGVtYS5heFBhdHRlcm4udG9VcHBlckNhc2UoKSA6IGluZmVyRWRnZVR5cGUoIHBhdGggKTtcbiAgICAgICAgICAgIGlmKCAhdHlwZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBjb25zdCBlZGdlSWQgPSB0eXBlICsgJzonICsgdmFsdWU7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHBhdGguam9pbiggJy4nICk7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICBwYXRoLmpvaW4oICc6JyApO1xuICAgICAgICAgICAgcG9ydHNbIHNjaGVtYS5heFJvbGUgPT09ICdvdXRsZXQnID8gJ291dGJvdW5kJyA6ICdpbmJvdW5kJyBdLnB1c2goIHtcbiAgICAgICAgICAgICAgIGxhYmVsLCBpZCwgdHlwZSwgZWRnZUlkXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICBpZiggZWRnZUlkICYmICFlZGdlc1sgZWRnZUlkIF0gKSB7XG4gICAgICAgICAgICAgICBlZGdlc1sgZWRnZUlkIF0gPSB7IHR5cGUsIGlkOiBlZGdlSWQsIGxhYmVsOiB2YWx1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnICYmIHNjaGVtYS5wcm9wZXJ0aWVzICkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNjaGVtYS5wcm9wZXJ0aWVzICkuZm9yRWFjaCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5U2NoZW1hID0gc2NoZW1hLnByb3BlcnRpZXNbIGtleSBdIHx8IHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcztcbiAgICAgICAgICAgICAgIGlkZW50aWZ5UG9ydHMoIHZhbHVlWyBrZXkgXSwgcHJvcGVydHlTY2hlbWEsIHBhdGguY29uY2F0KCBbIGtleSBdICksIHBvcnRzICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdhcnJheScgKSB7XG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKCAoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgaWRlbnRpZnlQb3J0cyggaXRlbSwgc2NoZW1hLml0ZW1zLCBwYXRoLmNvbmNhdCggWyBpIF0gKSwgcG9ydHMgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybiBwb3J0cztcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaW5mZXJFZGdlVHlwZSggcGF0aCApIHtcbiAgICAgICAgIGlmKCAhcGF0aC5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgIH1cbiAgICAgICAgIGNvbnN0IGxhc3RTZWdtZW50ID0gcGF0aFsgcGF0aC5sZW5ndGggLSAxIF07XG4gICAgICAgICBpZiggWyAnYWN0aW9uJywgJ2ZsYWcnLCAncmVzb3VyY2UnIF0uaW5kZXhPZiggbGFzdFNlZ21lbnQgKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdFNlZ21lbnQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCBsYXN0U2VnbWVudCA9PT0gJ29uQWN0aW9ucycgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0FDVElPTic7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gaW5mZXJFZGdlVHlwZSggcGF0aC5zbGljZSggMCwgcGF0aC5sZW5ndGggLSAxICkgKTtcbiAgICAgIH1cblxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBpZGVudGlmeUNvbnRhaW5lcnMoKSB7XG4gICAgICBjb25zdCB0eXBlID0gVFlQRV9DT05UQUlORVI7XG5cbiAgICAgIHZlcnRpY2VzWyBQQUdFX0lEIF0gPSAge1xuICAgICAgICAgUEFHRV9JRCxcbiAgICAgICAgIGxhYmVsOiBhY3RpdmVDb21wb3NpdGlvbiA/IGFjdGl2ZUNvbXBvc2l0aW9uIDogKCAnUGFnZSAnICsgcGFnZVJlZmVyZW5jZSApLFxuICAgICAgICAga2luZDogJ1BBR0UnLFxuICAgICAgICAgcG9ydHM6IHsgaW5ib3VuZDogW10sIG91dGJvdW5kOiBbXSB9XG4gICAgICB9O1xuXG4gICAgICBPYmplY3Qua2V5cyggcGFnZS5hcmVhcyApLmZvckVhY2goIGFyZWFOYW1lID0+IHtcbiAgICAgICAgIGluc2VydEVkZ2UoIGFyZWFOYW1lICk7XG4gICAgICAgICBjb25zdCBvd25lciA9IGZpbmRPd25lciggYXJlYU5hbWUgKTtcbiAgICAgICAgIGlmKCAhb3duZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjb250YWluc0FueXRoaW5nID0gZmFsc2U7XG4gICAgICAgICBwYWdlLmFyZWFzWyBhcmVhTmFtZSBdXG4gICAgICAgICAgICAuZmlsdGVyKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBpc0NvbXBvc2l0aW9uKCBpdGVtICkgP1xuICAgICAgICAgICAgICAgICAgY29tcG9zaXRpb25EaXNwbGF5ID09PSAnQ09NUEFDVCcgOlxuICAgICAgICAgICAgICAgICAgdHJ1ZTtcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgLmZvckVhY2goIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgaWYoIHZlcnRpY2VzWyBpdGVtLmlkIF0gKSB7XG4gICAgICAgICAgICAgICAgICBpbnNlcnRVcGxpbmsoIHZlcnRpY2VzWyBpdGVtLmlkIF0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICAgICAgICBjb250YWluc0FueXRoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIGlmKCBjb250YWluc0FueXRoaW5nICkge1xuICAgICAgICAgICAgaW5zZXJ0T3duZXJQb3J0KCBvd25lciwgYXJlYU5hbWUgKTtcbiAgICAgICAgIH1cbiAgICAgIH0gKTtcblxuICAgICAgZnVuY3Rpb24gZmluZE93bmVyKCBhcmVhTmFtZSApIHtcbiAgICAgICAgIGlmKCBhcmVhTmFtZS5pbmRleE9mKCAnLicgKSA9PT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVydGljZXNbIFBBR0VfSUQgXTtcbiAgICAgICAgIH1cbiAgICAgICAgIGNvbnN0IHByZWZpeCA9IGFyZWFOYW1lLnNsaWNlKCAwLCBhcmVhTmFtZS5sYXN0SW5kZXhPZiggJy4nICkgKTtcbiAgICAgICAgIHJldHVybiB2ZXJ0aWNlc1sgcHJlZml4IF07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGluc2VydE93bmVyUG9ydCggdmVydGV4LCBhcmVhTmFtZSApIHtcbiAgICAgICAgIHZlcnRleC5wb3J0cy5vdXRib3VuZC51bnNoaWZ0KCB7XG4gICAgICAgICAgICBpZDogJ0NPTlRBSU5FUjonICsgYXJlYU5hbWUsXG4gICAgICAgICAgICB0eXBlOiBUWVBFX0NPTlRBSU5FUixcbiAgICAgICAgICAgIGVkZ2VJZDogYXJlYUVkZ2VJZCggYXJlYU5hbWUgKSxcbiAgICAgICAgICAgIGxhYmVsOiBhcmVhTmFtZVxuICAgICAgICAgfSApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbnNlcnRVcGxpbmsoIHZlcnRleCwgYXJlYU5hbWUgKSB7XG4gICAgICAgICB2ZXJ0ZXgucG9ydHMuaW5ib3VuZC51bnNoaWZ0KCB7XG4gICAgICAgICAgICBpZDogJ0NPTlRBSU5FUjphbmNob3InLFxuICAgICAgICAgICAgdHlwZTogVFlQRV9DT05UQUlORVIsXG4gICAgICAgICAgICBlZGdlSWQ6IGFyZWFFZGdlSWQoIGFyZWFOYW1lICksXG4gICAgICAgICAgICBsYWJlbDogJ2FuY2hvcidcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5zZXJ0RWRnZSggYXJlYU5hbWUgKSB7XG4gICAgICAgICBjb25zdCBpZCA9IGFyZWFFZGdlSWQoIGFyZWFOYW1lICk7XG4gICAgICAgICBlZGdlc1sgaWQgXSA9IHsgaWQsIHR5cGUsIGxhYmVsOiBhcmVhTmFtZSB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcmVhRWRnZUlkKCBhcmVhTmFtZSApIHtcbiAgICAgICAgIHJldHVybiBUWVBFX0NPTlRBSU5FUiArICc6JyArIGFyZWFOYW1lO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBwcnVuZUlycmVsZXZhbnRXaWRnZXRzKCB3aXRoQ29udGFpbmVycyApIHtcbiAgICAgIGxldCB0b1BydW5lID0gW107XG4gICAgICBkbyB7XG4gICAgICAgICB0b1BydW5lLmZvckVhY2goIGlkID0+IHsgZGVsZXRlIHZlcnRpY2VzWyBpZCBdOyB9ICk7XG4gICAgICAgICBwcnVuZUVtcHR5RWRnZXMoKTtcbiAgICAgICAgIHRvUHJ1bmUgPSBtYXJrKCk7XG4gICAgICB9IHdoaWxlKCB0b1BydW5lLmxlbmd0aCApO1xuXG4gICAgICBmdW5jdGlvbiBtYXJrKCkge1xuICAgICAgICAgY29uc3QgcHJ1bmVMaXN0ID0gW107XG4gICAgICAgICBPYmplY3Qua2V5cyggdmVydGljZXMgKS5mb3JFYWNoKCB2SWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9ydHMgPSB2ZXJ0aWNlc1sgdklkIF0ucG9ydHM7XG4gICAgICAgICAgICBpZiggcG9ydHMuaW5ib3VuZC5sZW5ndGggPD0gd2l0aENvbnRhaW5lcnMgPyAxIDogMCApIHtcbiAgICAgICAgICAgICAgIGlmKCBwb3J0cy5vdXRib3VuZC5ldmVyeSggXyA9PiAhXy5lZGdlSWQgKSApIHtcbiAgICAgICAgICAgICAgICAgIHBydW5lTGlzdC5wdXNoKCB2SWQgICk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICB9ICk7XG4gICAgICAgICByZXR1cm4gcHJ1bmVMaXN0O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBwcnVuZUVtcHR5RWRnZXMoKSB7XG4gICAgICBjb25zdCB0b1BydW5lID0gW107XG4gICAgICBPYmplY3Qua2V5cyggZWRnZXMgKS5mb3JFYWNoKCBlZGdlSWQgPT4ge1xuICAgICAgICAgY29uc3QgdHlwZSA9IGVkZ2VUeXBlc1sgZWRnZXNbIGVkZ2VJZCBdLnR5cGUgXTtcbiAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBPYmplY3Qua2V5cyggdmVydGljZXMgKS5maWx0ZXIoIGlzU291cmNlT2YoIGVkZ2VJZCApICk7XG4gICAgICAgICBjb25zdCBzaW5rcyA9IE9iamVjdC5rZXlzKCB2ZXJ0aWNlcyApLmZpbHRlciggaXNTaW5rT2YoIGVkZ2VJZCApICk7XG4gICAgICAgICBjb25zdCBoYXNTb3VyY2VzID0gc291cmNlcy5sZW5ndGggPiAwO1xuICAgICAgICAgY29uc3QgaGFzU2lua3MgPSBzaW5rcy5sZW5ndGggPiAwO1xuICAgICAgICAgY29uc3QgaXNFbXB0eSA9IHR5cGUub3duaW5nUG9ydCA/ICghaGFzU291cmNlcyB8fCAhaGFzU2lua3MpIDogKCFoYXNTb3VyY2VzICYmICFoYXNTaW5rcyk7XG4gICAgICAgICBpZiggIWlzRW1wdHkgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRvUHJ1bmUucHVzaCggZWRnZUlkICk7XG4gICAgICAgICBzb3VyY2VzLmNvbmNhdCggc2lua3MgKS5mb3JFYWNoKCB2ZXJ0ZXhJZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3J0cyA9IHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzO1xuICAgICAgICAgICAgcG9ydHMuaW5ib3VuZC5jb25jYXQoIHBvcnRzLm91dGJvdW5kICkuZm9yRWFjaCggcG9ydCA9PiB7XG4gICAgICAgICAgICAgICBwb3J0LmVkZ2VJZCA9IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgPyBudWxsIDogcG9ydC5lZGdlSWQ7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9ICk7XG4gICAgICB9ICk7XG4gICAgICB0b1BydW5lLmZvckVhY2goIGlkID0+IHsgZGVsZXRlIGVkZ2VzWyBpZCBdOyB9ICk7XG5cbiAgICAgIGZ1bmN0aW9uIGlzU291cmNlT2YoIGVkZ2VJZCApIHtcbiAgICAgICAgIHJldHVybiBmdW5jdGlvbiggdmVydGV4SWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVydGljZXNbIHZlcnRleElkIF0ucG9ydHMuaW5ib3VuZC5zb21lKCBwb3J0ID0+IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgKTtcbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzU2lua09mKCBlZGdlSWQgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHZlcnRleElkICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzLm91dGJvdW5kLnNvbWUoIHBvcnQgPT4gcG9ydC5lZGdlSWQgPT09IGVkZ2VJZCApO1xuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBpc0NvbXBvc2l0aW9uKCBwYWdlQXJlYUl0ZW0gKSB7XG4gICByZXR1cm4gISFwYWdlQXJlYUl0ZW0uY29tcG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIGlzV2lkZ2V0KCBwYWdlQXJlYUl0ZW0gKSB7XG4gICByZXR1cm4gISFwYWdlQXJlYUl0ZW0ud2lkZ2V0O1xufVxuXG5mdW5jdGlvbiBpc0xheW91dCggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLmxheW91dDtcbn1cblxuZnVuY3Rpb24gZWl0aGVyKCBmLCBnICkge1xuICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGYuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApIHx8IGcuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgfTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGxheW91dCggZ3JhcGggKSB7XG4gICByZXR1cm4gbGF5b3V0TW9kZWwuY29udmVydC5sYXlvdXQoIHtcbiAgICAgIHZlcnRpY2VzOiB7fSxcbiAgICAgIGVkZ2VzOiB7fVxuICAgfSApO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZXMoKSB7XG4gICByZXR1cm4gZ3JhcGhNb2RlbC5jb252ZXJ0LnR5cGVzKCBlZGdlVHlwZXMgKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2l0aW9uU3RhY2soIGNvbXBvc2l0aW9uSW5zdGFuY2VJZCApIHtcbiAgIHJldHVybiBbXTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckZyb21TZWxlY3Rpb24oIHNlbGVjdGlvbiwgZ3JhcGhNb2RlbCApIHtcbiAgIGNvbnN0IHRvcGljcyA9IHNlbGVjdGlvbi5lZGdlcy5mbGF0TWFwKCBlZGdlSWQgPT4ge1xuICAgICAgY29uc3QgWyB0eXBlLCB0b3BpYyBdID0gZWRnZUlkLnNwbGl0KCAnOicgKTtcbiAgICAgIHJldHVybiAoIHR5cGUgPT09ICdDT05UQUlORVInICkgPyBbXSA6IFt7IHBhdHRlcm46IHR5cGUsIHRvcGljIH1dO1xuICAgfSApLnRvSlMoKTtcblxuICAgY29uc3QgcGFydGljaXBhbnRzID0gc2VsZWN0aW9uLnZlcnRpY2VzLmZsYXRNYXAoIHZlcnRleElkID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGtpbmQgfSA9IGdyYXBoTW9kZWwudmVydGljZXMuZ2V0KCB2ZXJ0ZXhJZCApO1xuICAgICAgcmV0dXJuICgga2luZCA9PT0gJ1BBR0UnIHx8IGtpbmQgPT09ICdMQVlPVVQnICkgPyBbXSA6IFt7IGtpbmQsIHBhcnRpY2lwYW50OiB2ZXJ0ZXhJZCB9XTtcbiAgIH0gKTtcblxuICAgcmV0dXJuIHtcbiAgICAgIHRvcGljcyxcbiAgICAgIHBhcnRpY2lwYW50c1xuICAgfTtcbn1cbiJdfQ==
