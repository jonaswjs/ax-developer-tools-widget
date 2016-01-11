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

         vertices[PAGE_ID] = rootVertex();

         Object.keys(page.areas).forEach(function (areaName) {
            page.areas[areaName].forEach(function (pageAreaItem) {
               if (isWidget(pageAreaItem)) {
                  processWidgetInstance(pageAreaItem, areaName);} else 

               if (isComposition(pageAreaItem)) {
                  processCompositionInstance(pageAreaItem, areaName);} else 

               if (isLayout(pageAreaItem)) {
                  processLayoutInstance(pageAreaItem, areaName);}});});




         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function rootVertex() {
            var ports = identifyPorts({}, {});
            console.log("ROOT", activeComposition);
            if (activeComposition) {
               // find composition instance in embedding page/composition:
               [pageDefinitions[pageReference]].
               concat(Object.
               keys(compositionDefinitions[pageReference]).
               map(function (key) {return compositionDefinitions[pageReference][key];})).

               forEach(function (pagelike) {
                  console.log("pagelike", pagelike);
                  var areas = pagelike.COMPACT.areas;
                  Object.keys(areas).
                  forEach(function (name) {return areas[name].
                     filter(function (item) {return item.id === activeComposition;}).
                     forEach(function (item) {
                        var features = item.features;
                        var schema = page.features;
                        console.log("f / s", _laxar.object.deepClone(features), _laxar.object.deepClone(schema));
                        ports = identifyPorts(features, schema);
                        console.log("f/s ports", _laxar.object.deepClone(ports));});});});}





            return { 
               PAGE_ID: PAGE_ID, 
               label: '[root] ' + (activeComposition ? activeComposition : pageReference), 
               kind: 'PAGE', 
               ports: ports };}



         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            if (areaName.indexOf('.') <= 0) {
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
               return vertices[vertexId].ports.outbound.some(function (port) {return port.edgeId === edgeId;});};}}}






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
//# sourceMappingURL=data:application/json;base64,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QUFDckMsbUJBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRSxLQUFoRCxFQUFFLDRCQUFGLEVBQUUsS0FBRSxJQUFJLDRCQUFKLElBQUk7QUFDaEIsZ0JBQU8sQUFBRSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLEdBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQzNGLENBQUUsQ0FBQzs7O0FBRUosYUFBTztBQUNKLGVBQU0sRUFBTixNQUFNO0FBQ04scUJBQVksRUFBWixZQUFZLEVBQ2QsQ0FBQyxDQUNKIiwiZmlsZSI6ImdyYXBoLWhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgd2lyZWZsb3cgZnJvbSAnd2lyZWZsb3cnO1xuXG5pbXBvcnQgeyBvYmplY3QgfSBmcm9tICdsYXhhcic7XG5cbmNvbnN0IFRZUEVfQ09OVEFJTkVSID0gJ0NPTlRBSU5FUic7XG5cbmNvbnN0IHtcbiAgbGF5b3V0OiB7XG4gICAgIG1vZGVsOiBsYXlvdXRNb2RlbFxuICB9LFxuICBncmFwaDoge1xuICAgIG1vZGVsOiBncmFwaE1vZGVsXG4gIH1cbn0gPSB3aXJlZmxvdztcblxuY29uc3QgZWRnZVR5cGVzID0ge1xuICAgUkVTT1VSQ0U6IHtcbiAgICAgIGhpZGRlbjogZmFsc2UsXG4gICAgICBsYWJlbDogJ1Jlc291cmNlcydcbiAgIH0sXG4gICBGTEFHOiB7XG4gICAgICBsYWJlbDogJ0ZsYWdzJyxcbiAgICAgIGhpZGRlbjogZmFsc2VcbiAgIH0sXG4gICBBQ1RJT046IHtcbiAgICAgIGxhYmVsOiAnQWN0aW9ucycsXG4gICAgICBoaWRkZW46IGZhbHNlXG4gICB9LFxuICAgQ09OVEFJTkVSOiB7XG4gICAgICBoaWRkZW46IGZhbHNlLFxuICAgICAgbGFiZWw6ICdDb250YWluZXInLFxuICAgICAgb3duaW5nUG9ydDogJ291dGJvdW5kJ1xuICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IFBBR0VfSUQgPSAnLic7XG5cbi8qKlxuICogQ3JlYXRlIGEgd2lyZWZsb3cgZ3JhcGggZnJvbSBhIGdpdmVuIHBhZ2Uvd2lkZ2V0IGluZm9ybWF0aW9uIG1vZGVsLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWdlSW5mb1xuICogQHBhcmFtIHtCb29sZWFuPWZhbHNlfSBwYWdlSW5mby53aXRoSXJyZWxldmFudFdpZGdldHNcbiAqICAgSWYgc2V0IHRvIGB0cnVlYCwgd2lkZ2V0cyB3aXRob3V0IGFueSByZWxldmFuY2UgdG8gYWN0aW9ucy9yZXNvdXJjZXMvZmxhZ3MgYXJlIHJlbW92ZWQuXG4gKiAgIENvbnRhaW5lcnMgb2Ygd2lkZ2V0cyAodGhhdCBhcmUgcmVsZXZhbnQgYnkgdGhpcyBtZWFzdXJlKSBhcmUga2VwdC5cbiAqIEBwYXJhbSB7Qm9vbGVhbj1mYWxzZX0gcGFnZUluZm8ud2l0aENvbnRhaW5lcnNcbiAqICAgSWYgc2V0IHRvIGB0cnVlYCwgQ29udGFpbmVyIHJlbGF0aW9uc2hpcHMgYXJlIGluY2x1ZGVkIGluIHRoZSBncmFwaCByZXByZXNlbnRhdGlvbi5cbiAqIEBwYXJhbSB7U3RyaW5nPSdGTEFUJ30gcGFnZUluZm8uY29tcG9zaXRpb25EaXNwbGF5XG4gKiAgIElmIHNldCB0byBgJ0NPTVBBQ1QnYCAoZGVmYXVsdCksIGNvbXBvc2l0aW9ucyBhcmUgcmVwcmVzZW50ZWQgYnkgYW4gaW5zdGFuY2Ugbm9kZSwgcmVmbGVjdGluZyB0aGVpciBkZXZlbG9wbWVudC10aW1lIG1vZGVsLlxuICogICBJZiBzZXQgdG8gYCdGTEFUJ2AsIGNvbXBvc2l0aW9ucyBhcmUgcmVwbGFjZWQgcmVjdXJzaXZlbHkgYnkgdGhlaXIgY29uZmlndXJlZCBleHBhbnNpb24sIHJlZmxlY3RpbmcgdGhlaXIgcnVuLXRpbWUgbW9kZWwuXG4gKiBAcGFyYW0ge1N0cmluZz1udWxsfSBwYWdlSW5mby5hY3RpdmVDb21wb3NpdGlvblxuICogICBJZiBzZXQsIGdlbmVyYXRlIGEgZ3JhcGggZm9yIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gY29tcG9zaXRpb24sIHJhdGhlciB0aGFuIGZvciB0aGUgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyYXBoKCBwYWdlSW5mbywgb3B0aW9ucyApIHtcblxuICAgY29uc3Qge1xuICAgICAgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gZmFsc2UsXG4gICAgICB3aXRoQ29udGFpbmVycyA9IHRydWUsXG4gICAgICBjb21wb3NpdGlvbkRpc3BsYXkgPSAnRkxBVCcsXG4gICAgICBhY3RpdmVDb21wb3NpdGlvbiA9IG51bGxcbiAgIH0gPSBvcHRpb25zO1xuXG4gICBjb25zdCB7XG4gICAgICBwYWdlUmVmZXJlbmNlLFxuICAgICAgcGFnZURlZmluaXRpb25zLFxuICAgICAgd2lkZ2V0RGVzY3JpcHRvcnMsXG4gICAgICBjb21wb3NpdGlvbkRlZmluaXRpb25zXG4gICB9ID0gcGFnZUluZm87XG4gICBjb25zdCBwYWdlID0gYWN0aXZlQ29tcG9zaXRpb24gP1xuICAgICAgY29tcG9zaXRpb25EZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdWyBhY3RpdmVDb21wb3NpdGlvbiBdWyBjb21wb3NpdGlvbkRpc3BsYXkgXSA6XG4gICAgICBwYWdlRGVmaW5pdGlvbnNbIHBhZ2VSZWZlcmVuY2UgXVsgY29tcG9zaXRpb25EaXNwbGF5IF07XG4gICBjb25zb2xlLmxvZyggJz4+IFBhZ2VJbmZvJywgcGFnZUluZm8gKTsgLy8gOlRPRE86IERFTEVURSBNRVxuICAgY29uc29sZS5sb2coICc+PiBvcHRpb25zJywgb3B0aW9ucyApOyAvLyA6VE9ETzogREVMRVRFIE1FXG4gICBjb25zb2xlLmxvZyggJz4+IHBhZ2UnLCBwYWdlICk7IC8vIDpUT0RPOiBERUxFVEUgTUVcblxuXG4gICBjb25zdCB2ZXJ0aWNlcyA9IHt9O1xuICAgY29uc3QgZWRnZXMgPSB7fTtcblxuXG4gICBpZGVudGlmeVZlcnRpY2VzKCk7XG4gICBpZiggd2l0aENvbnRhaW5lcnMgKSB7XG4gICAgICBpZGVudGlmeUNvbnRhaW5lcnMoKTtcbiAgIH1cbiAgIGlmKCAhd2l0aElycmVsZXZhbnRXaWRnZXRzICkge1xuICAgICAgcHJ1bmVJcnJlbGV2YW50V2lkZ2V0cyggd2l0aENvbnRhaW5lcnMgKTtcbiAgIH1cbiAgIHBydW5lRW1wdHlFZGdlcygpO1xuXG4gICByZXR1cm4gZ3JhcGhNb2RlbC5jb252ZXJ0LmdyYXBoKCB7XG4gICAgICB2ZXJ0aWNlcyxcbiAgICAgIGVkZ2VzXG4gICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGlkZW50aWZ5VmVydGljZXMoKSB7XG5cbiAgICAgIHZlcnRpY2VzWyBQQUdFX0lEIF0gPSByb290VmVydGV4KCk7XG5cbiAgICAgIE9iamVjdC5rZXlzKCBwYWdlLmFyZWFzICkuZm9yRWFjaCggYXJlYU5hbWUgPT4ge1xuICAgICAgICAgcGFnZS5hcmVhc1sgYXJlYU5hbWUgXS5mb3JFYWNoKCBwYWdlQXJlYUl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYoIGlzV2lkZ2V0KCBwYWdlQXJlYUl0ZW0gKSApIHtcbiAgICAgICAgICAgICAgIHByb2Nlc3NXaWRnZXRJbnN0YW5jZSggcGFnZUFyZWFJdGVtLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiggaXNDb21wb3NpdGlvbiggcGFnZUFyZWFJdGVtICkgKSB7XG4gICAgICAgICAgICAgICBwcm9jZXNzQ29tcG9zaXRpb25JbnN0YW5jZSggcGFnZUFyZWFJdGVtLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiggaXNMYXlvdXQoIHBhZ2VBcmVhSXRlbSApICkge1xuICAgICAgICAgICAgICAgcHJvY2Vzc0xheW91dEluc3RhbmNlKCBwYWdlQXJlYUl0ZW0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9ICk7XG4gICAgICB9ICk7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHJvb3RWZXJ0ZXgoKSB7XG4gICAgICAgICBsZXQgcG9ydHMgPSBpZGVudGlmeVBvcnRzKCB7fSwge30gKTtcbiAgICAgICAgIGNvbnNvbGUubG9nKCBcIlJPT1RcIiwgYWN0aXZlQ29tcG9zaXRpb24gKTtcbiAgICAgICAgIGlmKCBhY3RpdmVDb21wb3NpdGlvbiApIHtcbiAgICAgICAgICAgIC8vIGZpbmQgY29tcG9zaXRpb24gaW5zdGFuY2UgaW4gZW1iZWRkaW5nIHBhZ2UvY29tcG9zaXRpb246XG4gICAgICAgICAgICBbIHBhZ2VEZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdIF1cbiAgICAgICAgICAgICAgIC5jb25jYXQoIE9iamVjdFxuICAgICAgICAgICAgICAgICAgLmtleXMoIGNvbXBvc2l0aW9uRGVmaW5pdGlvbnNbIHBhZ2VSZWZlcmVuY2UgXSApXG4gICAgICAgICAgICAgICAgICAubWFwKCBrZXkgPT4gY29tcG9zaXRpb25EZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdWyBrZXkgXSApXG4gICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAuZm9yRWFjaCggcGFnZWxpa2UgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwicGFnZWxpa2VcIiwgcGFnZWxpa2UgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZWFzID0gcGFnZWxpa2UuQ09NUEFDVC5hcmVhcztcbiAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBhcmVhcyApXG4gICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCggbmFtZSA9PiBhcmVhc1sgbmFtZSBdXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBpdGVtID0+IGl0ZW0uaWQgPT09IGFjdGl2ZUNvbXBvc2l0aW9uIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVzID0gaXRlbS5mZWF0dXJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjaGVtYSA9IHBhZ2UuZmVhdHVyZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJmIC8gc1wiLCBvYmplY3QuZGVlcENsb25lKCBmZWF0dXJlcyApLCBvYmplY3QuZGVlcENsb25lKCBzY2hlbWEgKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9ydHMgPSBpZGVudGlmeVBvcnRzKCBmZWF0dXJlcywgc2NoZW1hICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJmL3MgcG9ydHNcIiwgb2JqZWN0LmRlZXBDbG9uZSggcG9ydHMgKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgUEFHRV9JRCxcbiAgICAgICAgICAgIGxhYmVsOiAnW3Jvb3RdICcgKyAoIGFjdGl2ZUNvbXBvc2l0aW9uID8gYWN0aXZlQ29tcG9zaXRpb24gOiBwYWdlUmVmZXJlbmNlICksXG4gICAgICAgICAgICBraW5kOiAnUEFHRScsXG4gICAgICAgICAgICBwb3J0c1xuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0xheW91dEluc3RhbmNlKCBsYXlvdXQsIGFyZWFOYW1lICkge1xuICAgICAgICAgdmVydGljZXNbIGxheW91dC5pZCBdID0ge1xuICAgICAgICAgICAgaWQ6IGxheW91dC5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBsYXlvdXQuaWQsXG4gICAgICAgICAgICBraW5kOiAnTEFZT1VUJyxcbiAgICAgICAgICAgIHBvcnRzOiB7IGluYm91bmQ6IFtdLCBvdXRib3VuZDogW10gfVxuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc1dpZGdldEluc3RhbmNlKCB3aWRnZXRJbnN0YW5jZSwgYXJlYU5hbWUgKSB7XG4gICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gd2lkZ2V0RGVzY3JpcHRvcnNbIHdpZGdldEluc3RhbmNlLndpZGdldCBdO1xuXG4gICAgICAgICBjb25zdCBraW5kcyA9IHtcbiAgICAgICAgICAgIHdpZGdldDogJ1dJREdFVCcsXG4gICAgICAgICAgICBhY3Rpdml0eTogJ0FDVElWSVRZJ1xuICAgICAgICAgfTtcblxuICAgICAgICAgY29uc3QgeyBpZCB9ID0gd2lkZ2V0SW5zdGFuY2U7XG4gICAgICAgICBjb25zdCBwb3J0cyA9IGlkZW50aWZ5UG9ydHMoIHdpZGdldEluc3RhbmNlLmZlYXR1cmVzLCBkZXNjcmlwdG9yLmZlYXR1cmVzICk7XG4gICAgICAgICB2ZXJ0aWNlc1sgaWQgXSA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBpZCxcbiAgICAgICAgICAgIGtpbmQ6IGtpbmRzWyBkZXNjcmlwdG9yLmludGVncmF0aW9uLnR5cGUgXSxcbiAgICAgICAgICAgIHBvcnRzOiBwb3J0c1xuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0NvbXBvc2l0aW9uSW5zdGFuY2UoIGNvbXBvc2l0aW9uSW5zdGFuY2UsIGFyZWFOYW1lICkge1xuICAgICAgICAgY29uc3QgeyBpZCB9ID0gY29tcG9zaXRpb25JbnN0YW5jZTtcbiAgICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBjb21wb3NpdGlvbkRlZmluaXRpb25zWyBwYWdlUmVmZXJlbmNlIF1bIGlkIF0uQ09NUEFDVDtcblxuICAgICAgICAgY29uc3Qgc2NoZW1hID0gZGVmaW5pdGlvbi5mZWF0dXJlcy50eXBlID9cbiAgICAgICAgICAgIGRlZmluaXRpb24uZmVhdHVyZXMgOlxuICAgICAgICAgICAgeyB0eXBlOiAnb2JqZWN0JywgcHJvcGVydGllczogZGVmaW5pdGlvbi5mZWF0dXJlcyB9O1xuXG4gICAgICAgICBjb25zdCBwb3J0cyA9IGlkZW50aWZ5UG9ydHMoXG4gICAgICAgICAgICBjb21wb3NpdGlvbkluc3RhbmNlLmZlYXR1cmVzIHx8IHt9LFxuICAgICAgICAgICAgb2JqZWN0Lm9wdGlvbnMoIHNjaGVtYSApXG4gICAgICAgICApO1xuXG4gICAgICAgICB2ZXJ0aWNlc1sgaWQgXSA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBpZCxcbiAgICAgICAgICAgIGtpbmQ6ICdDT01QT1NJVElPTicsXG4gICAgICAgICAgICBwb3J0czogcG9ydHNcbiAgICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGlkZW50aWZ5UG9ydHMoIHZhbHVlLCBzY2hlbWEsIHBhdGgsIHBvcnRzICkge1xuICAgICAgICAgcGF0aCA9IHBhdGggfHwgW107XG4gICAgICAgICBwb3J0cyA9IHBvcnRzIHx8IHsgaW5ib3VuZDogW10sIG91dGJvdW5kOiBbXSB9O1xuICAgICAgICAgaWYoICF2YWx1ZSB8fCAhc2NoZW1hICkge1xuICAgICAgICAgICAgcmV0dXJuIHBvcnRzO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggdmFsdWUuZW5hYmxlZCA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAvLyBmZWF0dXJlIGNhbiBiZSBkaXNhYmxlZCwgYW5kIHdhcyBkaXNhYmxlZFxuICAgICAgICAgICAgcmV0dXJuIHBvcnRzO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnc3RyaW5nJyAmJiBzY2hlbWEuYXhSb2xlICYmXG4gICAgICAgICAgICAgKCBzY2hlbWEuZm9ybWF0ID09PSAndG9waWMnIHx8IHNjaGVtYS5mb3JtYXQgPT09ICdmbGFnLXRvcGljJyApICkge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHNjaGVtYS5heFBhdHRlcm4gPyBzY2hlbWEuYXhQYXR0ZXJuLnRvVXBwZXJDYXNlKCkgOiBpbmZlckVkZ2VUeXBlKCBwYXRoICk7XG4gICAgICAgICAgICBpZiggIXR5cGUgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc3QgZWRnZUlkID0gdHlwZSArICc6JyArIHZhbHVlO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBwYXRoLmpvaW4oICcuJyApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSAgcGF0aC5qb2luKCAnOicgKTtcbiAgICAgICAgICAgIHBvcnRzWyBzY2hlbWEuYXhSb2xlID09PSAnb3V0bGV0JyA/ICdvdXRib3VuZCcgOiAnaW5ib3VuZCcgXS5wdXNoKCB7XG4gICAgICAgICAgICAgICBsYWJlbCwgaWQsIHR5cGUsIGVkZ2VJZFxuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgaWYoIGVkZ2VJZCAmJiAhZWRnZXNbIGVkZ2VJZCBdICkge1xuICAgICAgICAgICAgICAgZWRnZXNbIGVkZ2VJZCBdID0geyB0eXBlLCBpZDogZWRnZUlkLCBsYWJlbDogdmFsdWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnb2JqZWN0JyAmJiBzY2hlbWEucHJvcGVydGllcyApIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBzY2hlbWEucHJvcGVydGllcyApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVNjaGVtYSA9IHNjaGVtYS5wcm9wZXJ0aWVzWyBrZXkgXSB8fCBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXM7XG4gICAgICAgICAgICAgICBpZGVudGlmeVBvcnRzKCB2YWx1ZVsga2V5IF0sIHByb3BlcnR5U2NoZW1hLCBwYXRoLmNvbmNhdCggWyBrZXkgXSApLCBwb3J0cyApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoIHNjaGVtYS50eXBlID09PSAnYXJyYXknICkge1xuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCggKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgICAgIGlkZW50aWZ5UG9ydHMoIGl0ZW0sIHNjaGVtYS5pdGVtcywgcGF0aC5jb25jYXQoIFsgaSBdICksIHBvcnRzICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gcG9ydHM7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGluZmVyRWRnZVR5cGUoIHBhdGggKSB7XG4gICAgICAgICBpZiggIXBhdGgubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICB9XG4gICAgICAgICBjb25zdCBsYXN0U2VnbWVudCA9IHBhdGhbIHBhdGgubGVuZ3RoIC0gMSBdO1xuICAgICAgICAgaWYoIFsgJ2FjdGlvbicsICdmbGFnJywgJ3Jlc291cmNlJyBdLmluZGV4T2YoIGxhc3RTZWdtZW50ICkgIT09IC0xICkge1xuICAgICAgICAgICAgcmV0dXJuIGxhc3RTZWdtZW50LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggbGFzdFNlZ21lbnQgPT09ICdvbkFjdGlvbnMnICkge1xuICAgICAgICAgICAgcmV0dXJuICdBQ1RJT04nO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGluZmVyRWRnZVR5cGUoIHBhdGguc2xpY2UoIDAsIHBhdGgubGVuZ3RoIC0gMSApICk7XG4gICAgICB9XG5cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaWRlbnRpZnlDb250YWluZXJzKCkge1xuICAgICAgY29uc3QgdHlwZSA9IFRZUEVfQ09OVEFJTkVSO1xuXG4gICAgICBPYmplY3Qua2V5cyggcGFnZS5hcmVhcyApLmZvckVhY2goIGFyZWFOYW1lID0+IHtcbiAgICAgICAgIGluc2VydEVkZ2UoIGFyZWFOYW1lICk7XG4gICAgICAgICBjb25zdCBvd25lciA9IGZpbmRPd25lciggYXJlYU5hbWUgKTtcbiAgICAgICAgIGlmKCAhb3duZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjb250YWluc0FueXRoaW5nID0gZmFsc2U7XG4gICAgICAgICBwYWdlLmFyZWFzWyBhcmVhTmFtZSBdXG4gICAgICAgICAgICAuZmlsdGVyKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiBpc0NvbXBvc2l0aW9uKCBpdGVtICkgP1xuICAgICAgICAgICAgICAgICAgY29tcG9zaXRpb25EaXNwbGF5ID09PSAnQ09NUEFDVCcgOlxuICAgICAgICAgICAgICAgICAgdHJ1ZTtcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgLmZvckVhY2goIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgaWYoIHZlcnRpY2VzWyBpdGVtLmlkIF0gKSB7XG4gICAgICAgICAgICAgICAgICBpbnNlcnRVcGxpbmsoIHZlcnRpY2VzWyBpdGVtLmlkIF0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICAgICAgICBjb250YWluc0FueXRoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIGlmKCBjb250YWluc0FueXRoaW5nICkge1xuICAgICAgICAgICAgaW5zZXJ0T3duZXJQb3J0KCBvd25lciwgYXJlYU5hbWUgKTtcbiAgICAgICAgIH1cbiAgICAgIH0gKTtcblxuICAgICAgZnVuY3Rpb24gZmluZE93bmVyKCBhcmVhTmFtZSApIHtcbiAgICAgICAgIGlmKCBhcmVhTmFtZS5pbmRleE9mKCAnLicgKSA8PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyBQQUdFX0lEIF07XG4gICAgICAgICB9XG4gICAgICAgICBjb25zdCBwcmVmaXggPSBhcmVhTmFtZS5zbGljZSggMCwgYXJlYU5hbWUubGFzdEluZGV4T2YoICcuJyApICk7XG4gICAgICAgICByZXR1cm4gdmVydGljZXNbIHByZWZpeCBdO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbnNlcnRPd25lclBvcnQoIHZlcnRleCwgYXJlYU5hbWUgKSB7XG4gICAgICAgICB2ZXJ0ZXgucG9ydHMub3V0Ym91bmQudW5zaGlmdCgge1xuICAgICAgICAgICAgaWQ6ICdDT05UQUlORVI6JyArIGFyZWFOYW1lLFxuICAgICAgICAgICAgdHlwZTogVFlQRV9DT05UQUlORVIsXG4gICAgICAgICAgICBlZGdlSWQ6IGFyZWFFZGdlSWQoIGFyZWFOYW1lICksXG4gICAgICAgICAgICBsYWJlbDogYXJlYU5hbWVcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5zZXJ0VXBsaW5rKCB2ZXJ0ZXgsIGFyZWFOYW1lICkge1xuICAgICAgICAgdmVydGV4LnBvcnRzLmluYm91bmQudW5zaGlmdCgge1xuICAgICAgICAgICAgaWQ6ICdDT05UQUlORVI6YW5jaG9yJyxcbiAgICAgICAgICAgIHR5cGU6IFRZUEVfQ09OVEFJTkVSLFxuICAgICAgICAgICAgZWRnZUlkOiBhcmVhRWRnZUlkKCBhcmVhTmFtZSApLFxuICAgICAgICAgICAgbGFiZWw6ICdhbmNob3InXG4gICAgICAgICB9ICk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGluc2VydEVkZ2UoIGFyZWFOYW1lICkge1xuICAgICAgICAgY29uc3QgaWQgPSBhcmVhRWRnZUlkKCBhcmVhTmFtZSApO1xuICAgICAgICAgZWRnZXNbIGlkIF0gPSB7IGlkLCB0eXBlLCBsYWJlbDogYXJlYU5hbWUgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXJlYUVkZ2VJZCggYXJlYU5hbWUgKSB7XG4gICAgICAgICByZXR1cm4gVFlQRV9DT05UQUlORVIgKyAnOicgKyBhcmVhTmFtZTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcHJ1bmVJcnJlbGV2YW50V2lkZ2V0cyggd2l0aENvbnRhaW5lcnMgKSB7XG4gICAgICBsZXQgdG9QcnVuZSA9IFtdO1xuICAgICAgZG8ge1xuICAgICAgICAgdG9QcnVuZS5mb3JFYWNoKCBpZCA9PiB7IGRlbGV0ZSB2ZXJ0aWNlc1sgaWQgXTsgfSApO1xuICAgICAgICAgcHJ1bmVFbXB0eUVkZ2VzKCk7XG4gICAgICAgICB0b1BydW5lID0gbWFyaygpO1xuICAgICAgfSB3aGlsZSggdG9QcnVuZS5sZW5ndGggKTtcblxuICAgICAgZnVuY3Rpb24gbWFyaygpIHtcbiAgICAgICAgIGNvbnN0IHBydW5lTGlzdCA9IFtdO1xuICAgICAgICAgT2JqZWN0LmtleXMoIHZlcnRpY2VzICkuZm9yRWFjaCggdklkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcnRzID0gdmVydGljZXNbIHZJZCBdLnBvcnRzO1xuICAgICAgICAgICAgaWYoIHBvcnRzLmluYm91bmQubGVuZ3RoIDw9IHdpdGhDb250YWluZXJzID8gMSA6IDAgKSB7XG4gICAgICAgICAgICAgICBpZiggcG9ydHMub3V0Ym91bmQuZXZlcnkoIF8gPT4gIV8uZWRnZUlkICkgKSB7XG4gICAgICAgICAgICAgICAgICBwcnVuZUxpc3QucHVzaCggdklkICApO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSApO1xuICAgICAgICAgcmV0dXJuIHBydW5lTGlzdDtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcHJ1bmVFbXB0eUVkZ2VzKCkge1xuICAgICAgY29uc3QgdG9QcnVuZSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoIGVkZ2VzICkuZm9yRWFjaCggZWRnZUlkID0+IHtcbiAgICAgICAgIGNvbnN0IHR5cGUgPSBlZGdlVHlwZXNbIGVkZ2VzWyBlZGdlSWQgXS50eXBlIF07XG4gICAgICAgICBjb25zdCBzb3VyY2VzID0gT2JqZWN0LmtleXMoIHZlcnRpY2VzICkuZmlsdGVyKCBpc1NvdXJjZU9mKCBlZGdlSWQgKSApO1xuICAgICAgICAgY29uc3Qgc2lua3MgPSBPYmplY3Qua2V5cyggdmVydGljZXMgKS5maWx0ZXIoIGlzU2lua09mKCBlZGdlSWQgKSApO1xuICAgICAgICAgY29uc3QgaGFzU291cmNlcyA9IHNvdXJjZXMubGVuZ3RoID4gMDtcbiAgICAgICAgIGNvbnN0IGhhc1NpbmtzID0gc2lua3MubGVuZ3RoID4gMDtcbiAgICAgICAgIGNvbnN0IGlzRW1wdHkgPSB0eXBlLm93bmluZ1BvcnQgPyAoIWhhc1NvdXJjZXMgfHwgIWhhc1NpbmtzKSA6ICghaGFzU291cmNlcyAmJiAhaGFzU2lua3MpO1xuICAgICAgICAgaWYoICFpc0VtcHR5ICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0b1BydW5lLnB1c2goIGVkZ2VJZCApO1xuICAgICAgICAgc291cmNlcy5jb25jYXQoIHNpbmtzICkuZm9yRWFjaCggdmVydGV4SWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9ydHMgPSB2ZXJ0aWNlc1sgdmVydGV4SWQgXS5wb3J0cztcbiAgICAgICAgICAgIHBvcnRzLmluYm91bmQuY29uY2F0KCBwb3J0cy5vdXRib3VuZCApLmZvckVhY2goIHBvcnQgPT4ge1xuICAgICAgICAgICAgICAgcG9ydC5lZGdlSWQgPSBwb3J0LmVkZ2VJZCA9PT0gZWRnZUlkID8gbnVsbCA6IHBvcnQuZWRnZUlkO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuICAgICAgfSApO1xuICAgICAgdG9QcnVuZS5mb3JFYWNoKCBpZCA9PiB7IGRlbGV0ZSBlZGdlc1sgaWQgXTsgfSApO1xuXG4gICAgICBmdW5jdGlvbiBpc1NvdXJjZU9mKCBlZGdlSWQgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHZlcnRleElkICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzLmluYm91bmQuc29tZSggcG9ydCA9PiBwb3J0LmVkZ2VJZCA9PT0gZWRnZUlkICk7XG4gICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc1NpbmtPZiggZWRnZUlkICkge1xuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB2ZXJ0ZXhJZCApIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJ0aWNlc1sgdmVydGV4SWQgXS5wb3J0cy5vdXRib3VuZC5zb21lKCBwb3J0ID0+IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgKTtcbiAgICAgICAgIH07XG4gICAgICB9XG4gICB9XG5cbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gaXNDb21wb3NpdGlvbiggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLmNvbXBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBpc1dpZGdldCggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLndpZGdldDtcbn1cblxuZnVuY3Rpb24gaXNMYXlvdXQoIHBhZ2VBcmVhSXRlbSApIHtcbiAgIHJldHVybiAhIXBhZ2VBcmVhSXRlbS5sYXlvdXQ7XG59XG5cbmZ1bmN0aW9uIGVpdGhlciggZiwgZyApIHtcbiAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSB8fCBnLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgIH07XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXQoIGdyYXBoICkge1xuICAgcmV0dXJuIGxheW91dE1vZGVsLmNvbnZlcnQubGF5b3V0KCB7XG4gICAgICB2ZXJ0aWNlczoge30sXG4gICAgICBlZGdlczoge31cbiAgIH0gKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVzKCkge1xuICAgcmV0dXJuIGdyYXBoTW9kZWwuY29udmVydC50eXBlcyggZWRnZVR5cGVzICk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NpdGlvblN0YWNrKCBjb21wb3NpdGlvbkluc3RhbmNlSWQgKSB7XG4gICByZXR1cm4gW107XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJGcm9tU2VsZWN0aW9uKCBzZWxlY3Rpb24sIGdyYXBoTW9kZWwgKSB7XG4gICBjb25zdCB0b3BpY3MgPSBzZWxlY3Rpb24uZWRnZXMuZmxhdE1hcCggZWRnZUlkID0+IHtcbiAgICAgIGNvbnN0IFsgdHlwZSwgdG9waWMgXSA9IGVkZ2VJZC5zcGxpdCggJzonICk7XG4gICAgICByZXR1cm4gKCB0eXBlID09PSAnQ09OVEFJTkVSJyApID8gW10gOiBbeyBwYXR0ZXJuOiB0eXBlLCB0b3BpYyB9XTtcbiAgIH0gKS50b0pTKCk7XG5cbiAgIGNvbnN0IHBhcnRpY2lwYW50cyA9IHNlbGVjdGlvbi52ZXJ0aWNlcy5mbGF0TWFwKCB2ZXJ0ZXhJZCA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBraW5kIH0gPSBncmFwaE1vZGVsLnZlcnRpY2VzLmdldCggdmVydGV4SWQgKTtcbiAgICAgIHJldHVybiAoIGtpbmQgPT09ICdQQUdFJyB8fCBraW5kID09PSAnTEFZT1VUJyApID8gW10gOiBbeyBraW5kLCBwYXJ0aWNpcGFudDogdmVydGV4SWQgfV07XG4gICB9ICk7XG5cbiAgIHJldHVybiB7XG4gICAgICB0b3BpY3MsXG4gICAgICBwYXJ0aWNpcGFudHNcbiAgIH07XG59XG4iXX0=
