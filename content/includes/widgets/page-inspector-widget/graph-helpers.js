/* jshint ignore:start */
define(['exports', 'wireflow', 'laxar'], function (exports, _wireflow, _laxar) {'use strict';Object.defineProperty(exports, '__esModule', { value: true });var _slicedToArray = (function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i['return']) _i['return']();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();exports.graph = graph;exports.layout = layout;exports.types = types;exports.filterFromSelection = filterFromSelection;function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _wireflow2 = _interopRequireDefault(_wireflow);



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
    */
   function graph(pageInfo, options) {var _options$withIrrelevantWidgets = 





      options.withIrrelevantWidgets;var withIrrelevantWidgets = _options$withIrrelevantWidgets === undefined ? false : _options$withIrrelevantWidgets;var _options$withContainers = options.withContainers;var withContainers = _options$withContainers === undefined ? true : _options$withContainers;var _options$compositionDisplay = options.compositionDisplay;var compositionDisplay = _options$compositionDisplay === undefined ? 'FLAT' : _options$compositionDisplay;

      var PAGE_ID = '.';var 

      pageReference = 



      pageInfo.pageReference;var pageDefinitions = pageInfo.pageDefinitions;var widgetDescriptors = pageInfo.widgetDescriptors;var compositionDefinitions = pageInfo.compositionDefinitions;
      var page = pageDefinitions[pageReference][compositionDisplay];


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

            var ports = identifyPorts(compositionInstance.features, definition.features);

            vertices[id] = { 
               id: id, 
               label: id, 
               kind: 'COMPOSITION', 
               ports: ports };}



         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

         function identifyPorts(value, schema, path, ports) {
            if (!path && !ports) {
               console.log('CLOG IDENT PORTS', value, schema); // :TODO: DELETE ME
            }
            path = path || [];
            ports = ports || { inbound: [], outbound: [] };
            if (!value || !schema) {
               return;}


            if (value.enabled === false) {
               // feature can be disabled, and was disabled
               return;}

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
            label: 'Page ' + pageReference, 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYXBoLWhlbHBlcnMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFNLGNBQWMsR0FBRyxXQUFXLENBQUM7Ozs7QUFJdkIsY0FBVyx5QkFEckIsTUFBTSxDQUNILEtBQUs7OztBQUdDLGFBQVUseUJBRG5CLEtBQUssQ0FDSCxLQUFLOzs7O0FBSVQsT0FBTSxTQUFTLEdBQUc7QUFDZixjQUFRLEVBQUU7QUFDUCxlQUFNLEVBQUUsS0FBSztBQUNiLGNBQUssRUFBRSxXQUFXLEVBQ3BCOztBQUNELFVBQUksRUFBRTtBQUNILGNBQUssRUFBRSxPQUFPO0FBQ2QsZUFBTSxFQUFFLEtBQUssRUFDZjs7QUFDRCxZQUFNLEVBQUU7QUFDTCxjQUFLLEVBQUUsU0FBUztBQUNoQixlQUFNLEVBQUUsS0FBSyxFQUNmOztBQUNELGVBQVMsRUFBRTtBQUNSLGVBQU0sRUFBRSxLQUFLO0FBQ2IsY0FBSyxFQUFFLFdBQVc7QUFDbEIsbUJBQVUsRUFBRSxVQUFVLEVBQ3hCLEVBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlSyxZQUFTLEtBQUssQ0FBRSxRQUFRLEVBQUUsT0FBTyxFQUFHOzs7Ozs7QUFNcEMsYUFBTyxDQUhSLHFCQUFxQixLQUFyQixxQkFBcUIsa0RBQUcsS0FBSyxnRUFHNUIsT0FBTyxDQUZSLGNBQWMsS0FBZCxjQUFjLDJDQUFHLElBQUksNkRBRXBCLE9BQU8sQ0FEUixrQkFBa0IsS0FBbEIsa0JBQWtCLCtDQUFHLE1BQU07O0FBRzlCLFVBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQzs7QUFFakIsbUJBQWE7Ozs7QUFJWixjQUFRLENBSlQsYUFBYSxLQUNiLGVBQWUsR0FHZCxRQUFRLENBSFQsZUFBZSxLQUNmLGlCQUFpQixHQUVoQixRQUFRLENBRlQsaUJBQWlCLEtBQ2pCLHNCQUFzQixHQUNyQixRQUFRLENBRFQsc0JBQXNCO0FBRXpCLFVBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBRSxhQUFhLENBQUUsQ0FBRSxrQkFBa0IsQ0FBRSxDQUFDOzs7QUFHcEUsVUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsc0JBQWdCLEVBQUUsQ0FBQztBQUNuQixVQUFJLGNBQWMsRUFBRztBQUNsQiwyQkFBa0IsRUFBRSxDQUFDLENBQ3ZCOztBQUNELFVBQUksQ0FBQyxxQkFBcUIsRUFBRztBQUMxQiwrQkFBc0IsQ0FBRSxjQUFjLENBQUUsQ0FBQyxDQUMzQzs7QUFDRCxxQkFBZSxFQUFFLENBQUM7O0FBRWxCLGFBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUU7QUFDOUIsaUJBQVEsRUFBUixRQUFRO0FBQ1IsY0FBSyxFQUFMLEtBQUssRUFDUCxDQUFFLENBQUM7Ozs7Ozs7QUFNSixlQUFTLGdCQUFnQixHQUFHO0FBQ3pCLGVBQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDLE9BQU8sQ0FBRSxVQUFBLFFBQVEsRUFBSTtBQUM1QyxnQkFBSSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBQSxZQUFZLEVBQUk7QUFDN0MsbUJBQUksUUFBUSxDQUFFLFlBQVksQ0FBRSxFQUFHO0FBQzVCLHVDQUFxQixDQUFFLFlBQVksRUFBRSxRQUFRLENBQUUsQ0FBQyxDQUNsRDs7QUFDSSxtQkFBSSxhQUFhLENBQUUsWUFBWSxDQUFFLEVBQUc7QUFDdEMsNENBQTBCLENBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBRSxDQUFDLENBQ3ZEOztBQUNJLG1CQUFJLFFBQVEsQ0FBRSxZQUFZLENBQUUsRUFBRztBQUNqQyx1Q0FBcUIsQ0FBRSxZQUFZLEVBQUUsUUFBUSxDQUFFLENBQUMsQ0FDbEQsQ0FDSCxDQUFFLENBQUMsQ0FDTixDQUFFLENBQUM7Ozs7Ozs7QUFJSixrQkFBUyxxQkFBcUIsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFHO0FBQ2hELG9CQUFRLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBRSxHQUFHO0FBQ3JCLGlCQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDYixvQkFBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFO0FBQ2hCLG1CQUFJLEVBQUUsUUFBUTtBQUNkLG9CQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFDdEMsQ0FBQyxDQUNKOzs7Ozs7QUFJRCxrQkFBUyxxQkFBcUIsQ0FBRSxjQUFjLEVBQUUsUUFBUSxFQUFHO0FBQ3hELGdCQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBRSxjQUFjLENBQUMsTUFBTSxDQUFFLENBQUM7O0FBRTlELGdCQUFNLEtBQUssR0FBRztBQUNYLHFCQUFNLEVBQUUsUUFBUTtBQUNoQix1QkFBUSxFQUFFLFVBQVUsRUFDdEIsQ0FBQzs7O0FBRU0sY0FBRSxHQUFLLGNBQWMsQ0FBckIsRUFBRTtBQUNWLGdCQUFNLEtBQUssR0FBRyxhQUFhLENBQUUsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFFLENBQUM7QUFDNUUsb0JBQVEsQ0FBRSxFQUFFLENBQUUsR0FBRztBQUNkLGlCQUFFLEVBQUUsRUFBRTtBQUNOLG9CQUFLLEVBQUUsRUFBRTtBQUNULG1CQUFJLEVBQUUsS0FBSyxDQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFFO0FBQzFDLG9CQUFLLEVBQUUsS0FBSyxFQUNkLENBQUMsQ0FDSjs7Ozs7O0FBSUQsa0JBQVMsMEJBQTBCLENBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFHO0FBQzFELGNBQUUsR0FBSyxtQkFBbUIsQ0FBMUIsRUFBRTtBQUNWLGdCQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBRSxhQUFhLENBQUUsQ0FBRSxFQUFFLENBQUUsQ0FBQyxPQUFPLENBQUM7O0FBRXpFLGdCQUFNLEtBQUssR0FBRyxhQUFhLENBQUUsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUUsQ0FBQzs7QUFFakYsb0JBQVEsQ0FBRSxFQUFFLENBQUUsR0FBRztBQUNkLGlCQUFFLEVBQUUsRUFBRTtBQUNOLG9CQUFLLEVBQUUsRUFBRTtBQUNULG1CQUFJLEVBQUUsYUFBYTtBQUNuQixvQkFBSyxFQUFFLEtBQUssRUFDZCxDQUFDLENBQ0o7Ozs7OztBQUlELGtCQUFTLGFBQWEsQ0FBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUc7QUFDbEQsZ0JBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUc7QUFDbkIsc0JBQU8sQ0FBQyxHQUFHLENBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBRSxDQUFDO2FBQ25EO0FBQ0QsZ0JBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xCLGlCQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDL0MsZ0JBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUc7QUFDckIsc0JBQU8sQ0FDVDs7O0FBRUQsZ0JBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUc7O0FBRTNCLHNCQUFPLENBQ1Q7O0FBQ0QsZ0JBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU07QUFDdkMsa0JBQU0sQ0FBQyxNQUFNLEtBQUssT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFBLEFBQUUsRUFBRztBQUNuRSxtQkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxHQUFHLGFBQWEsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUN2RixtQkFBSSxDQUFDLElBQUksRUFBRyxDQUFFLE9BQU8sQ0FBRTtBQUN2QixtQkFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDbEMsbUJBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7QUFDL0IsbUJBQU0sRUFBRSxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7QUFDN0Isb0JBQUssQ0FBRSxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFFLENBQUMsSUFBSSxDQUFFO0FBQ2hFLHVCQUFLLEVBQUwsS0FBSyxFQUFFLEVBQUUsRUFBRixFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUN6QixDQUFFLENBQUM7O0FBQ0osbUJBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFFLE1BQU0sQ0FBRSxFQUFHO0FBQzlCLHVCQUFLLENBQUUsTUFBTSxDQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQ3ZELENBQ0g7Ozs7QUFFRCxnQkFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFHO0FBQ2pELHFCQUFNLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDOUMsc0JBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUUsR0FBRyxDQUFFLElBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDO0FBQy9FLCtCQUFhLENBQUUsS0FBSyxDQUFFLEdBQUcsQ0FBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUUsR0FBRyxDQUFFLENBQUUsRUFBRSxLQUFLLENBQUUsQ0FBQyxDQUMvRSxDQUFFLENBQUMsQ0FDTjs7O0FBQ0QsZ0JBQUksTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUc7QUFDM0Isb0JBQUssQ0FBQyxPQUFPLENBQUUsVUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFLO0FBQ3pCLCtCQUFhLENBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFFLENBQUMsQ0FBRSxDQUFFLEVBQUUsS0FBSyxDQUFFLENBQUMsQ0FDbkUsQ0FBRSxDQUFDLENBQ047OztBQUNELG1CQUFPLEtBQUssQ0FBQyxDQUNmOzs7OztBQUlELGtCQUFTLGFBQWEsa0RBQVMsS0FBUCxJQUFJO0FBQ3pCLG1CQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRztBQUNoQix5QkFBTyxJQUFJLENBQUMsQ0FDZDs7QUFDRCxtQkFBTSxXQUFXLEdBQUcsSUFBSSxDQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUM7QUFDNUMsbUJBQUksQ0FBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBRSxDQUFDLE9BQU8sQ0FBRSxXQUFXLENBQUUsS0FBSyxDQUFDLENBQUMsRUFBRztBQUNsRSx5QkFBTyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FDbkM7O0FBQ0QsbUJBQUksV0FBVyxLQUFLLFdBQVcsRUFBRztBQUMvQix5QkFBTyxRQUFRLENBQUMsQ0FDbEI7O0FBQ3FCLG1CQUFJLENBQUMsS0FBSyxDQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxlQVBoRCxXQUFXLGlDQVFuQixDQUFBLENBRUg7Ozs7Ozs7QUFJRCxlQUFTLGtCQUFrQixHQUFHO0FBQzNCLGFBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQzs7QUFFNUIsaUJBQVEsQ0FBRSxPQUFPLENBQUUsR0FBSTtBQUNwQixtQkFBTyxFQUFQLE9BQU87QUFDUCxpQkFBSyxFQUFFLE9BQU8sR0FBRyxhQUFhO0FBQzlCLGdCQUFJLEVBQUUsTUFBTTtBQUNaLGlCQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFDdEMsQ0FBQzs7O0FBRUYsZUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUMsT0FBTyxDQUFFLFVBQUEsUUFBUSxFQUFJO0FBQzVDLHNCQUFVLENBQUUsUUFBUSxDQUFFLENBQUM7QUFDdkIsZ0JBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBRSxRQUFRLENBQUUsQ0FBQztBQUNwQyxnQkFBSSxDQUFDLEtBQUssRUFBRztBQUNWLHNCQUFPLENBQ1Q7OztBQUVELGdCQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUM3QixnQkFBSSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUU7QUFDbEIsa0JBQU0sQ0FBRSxVQUFBLElBQUksRUFBSTtBQUNkLHNCQUFPLGFBQWEsQ0FBRSxJQUFJLENBQUU7QUFDekIsaUNBQWtCLEtBQUssU0FBUztBQUNoQyxtQkFBSSxDQUFDLENBQ1YsQ0FBRTs7QUFDRixtQkFBTyxDQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ2YsbUJBQUksUUFBUSxDQUFFLElBQUksQ0FBQyxFQUFFLENBQUUsRUFBRztBQUN2Qiw4QkFBWSxDQUFFLFFBQVEsQ0FBRSxJQUFJLENBQUMsRUFBRSxDQUFFLEVBQUUsUUFBUSxDQUFFLENBQUM7QUFDOUMsa0NBQWdCLEdBQUcsSUFBSSxDQUFDLENBQzFCLENBQ0gsQ0FBRSxDQUFDOzs7QUFDUCxnQkFBSSxnQkFBZ0IsRUFBRztBQUNwQiw4QkFBZSxDQUFFLEtBQUssRUFBRSxRQUFRLENBQUUsQ0FBQyxDQUNyQyxDQUNILENBQUUsQ0FBQzs7OztBQUVKLGtCQUFTLFNBQVMsQ0FBRSxRQUFRLEVBQUc7QUFDNUIsZ0JBQUksUUFBUSxDQUFDLE9BQU8sQ0FBRSxHQUFHLENBQUUsS0FBSyxDQUFDLENBQUMsRUFBRztBQUNsQyxzQkFBTyxRQUFRLENBQUUsT0FBTyxDQUFFLENBQUMsQ0FDN0I7O0FBQ0QsZ0JBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBQztBQUNoRSxtQkFBTyxRQUFRLENBQUUsTUFBTSxDQUFFLENBQUMsQ0FDNUI7OztBQUVELGtCQUFTLGVBQWUsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFHO0FBQzFDLGtCQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUU7QUFDNUIsaUJBQUUsRUFBRSxZQUFZLEdBQUcsUUFBUTtBQUMzQixtQkFBSSxFQUFFLGNBQWM7QUFDcEIscUJBQU0sRUFBRSxVQUFVLENBQUUsUUFBUSxDQUFFO0FBQzlCLG9CQUFLLEVBQUUsUUFBUSxFQUNqQixDQUFFLENBQUMsQ0FDTjs7OztBQUVELGtCQUFTLFlBQVksQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFHO0FBQ3ZDLGtCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUU7QUFDM0IsaUJBQUUsRUFBRSxrQkFBa0I7QUFDdEIsbUJBQUksRUFBRSxjQUFjO0FBQ3BCLHFCQUFNLEVBQUUsVUFBVSxDQUFFLFFBQVEsQ0FBRTtBQUM5QixvQkFBSyxFQUFFLFFBQVEsRUFDakIsQ0FBRSxDQUFDLENBQ047Ozs7QUFFRCxrQkFBUyxVQUFVLENBQUUsUUFBUSxFQUFHO0FBQzdCLGdCQUFNLEVBQUUsR0FBRyxVQUFVLENBQUUsUUFBUSxDQUFFLENBQUM7QUFDbEMsaUJBQUssQ0FBRSxFQUFFLENBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRixFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDOUM7OztBQUVELGtCQUFTLFVBQVUsQ0FBRSxRQUFRLEVBQUc7QUFDN0IsbUJBQU8sY0FBYyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FDekMsQ0FDSDs7Ozs7O0FBSUQsZUFBUyxzQkFBc0IsQ0FBRSxjQUFjLEVBQUc7QUFDL0MsYUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFlBQUc7QUFDQSxtQkFBTyxDQUFDLE9BQU8sQ0FBRSxVQUFBLEVBQUUsRUFBSSxDQUFFLE9BQU8sUUFBUSxDQUFFLEVBQUUsQ0FBRSxDQUFDLENBQUUsQ0FBRSxDQUFDO0FBQ3BELDJCQUFlLEVBQUUsQ0FBQztBQUNsQixtQkFBTyxHQUFHLElBQUksRUFBRSxDQUFDLENBQ25CO0FBQVEsZ0JBQU8sQ0FBQyxNQUFNLEVBQUc7O0FBRTFCLGtCQUFTLElBQUksR0FBRztBQUNiLGdCQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDckIsa0JBQU0sQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLENBQUMsT0FBTyxDQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3JDLG1CQUFNLEtBQUssR0FBRyxRQUFRLENBQUUsR0FBRyxDQUFFLENBQUMsS0FBSyxDQUFDO0FBQ3BDLG1CQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLGNBQWMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFHO0FBQ2xELHNCQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFFLFVBQUEsQ0FBQyxVQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQSxDQUFFLEVBQUc7QUFDMUMsOEJBQVMsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFHLENBQUMsQ0FDekIsQ0FDSCxDQUNILENBQUUsQ0FBQzs7OztBQUNKLG1CQUFPLFNBQVMsQ0FBQyxDQUNuQixDQUNIOzs7Ozs7QUFJRCxlQUFTLGVBQWUsR0FBRztBQUN4QixhQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkIsZUFBTSxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBQSxNQUFNLEVBQUk7QUFDckMsZ0JBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBRSxLQUFLLENBQUUsTUFBTSxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUM7QUFDL0MsZ0JBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLENBQUMsTUFBTSxDQUFFLFVBQVUsQ0FBRSxNQUFNLENBQUUsQ0FBRSxDQUFDO0FBQ3ZFLGdCQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBRSxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUUsTUFBTSxDQUFFLENBQUUsQ0FBQztBQUNuRSxnQkFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdEMsZ0JBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxHQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxBQUFDLENBQUM7QUFDMUYsZ0JBQUksQ0FBQyxPQUFPLEVBQUc7QUFDWixzQkFBTyxDQUNUOzs7QUFFRCxtQkFBTyxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsQ0FBQztBQUN2QixtQkFBTyxDQUFDLE1BQU0sQ0FBRSxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBQSxRQUFRLEVBQUk7QUFDMUMsbUJBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBRSxRQUFRLENBQUUsQ0FBQyxLQUFLLENBQUM7QUFDekMsb0JBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBQyxRQUFRLENBQUUsQ0FBQyxPQUFPLENBQUUsVUFBQSxJQUFJLEVBQUk7QUFDckQsc0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDNUQsQ0FBRSxDQUFDLENBQ04sQ0FBRSxDQUFDLENBQ04sQ0FBRSxDQUFDOzs7O0FBQ0osZ0JBQU8sQ0FBQyxPQUFPLENBQUUsVUFBQSxFQUFFLEVBQUksQ0FBRSxPQUFPLEtBQUssQ0FBRSxFQUFFLENBQUUsQ0FBQyxDQUFFLENBQUUsQ0FBQzs7QUFFakQsa0JBQVMsVUFBVSxDQUFFLE1BQU0sRUFBRztBQUMzQixtQkFBTyxVQUFVLFFBQVEsRUFBRztBQUN6QixzQkFBTyxRQUFRLENBQUUsUUFBUSxDQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUEsQ0FBRSxDQUFDLENBQ25GLENBQUMsQ0FDSjs7OztBQUVELGtCQUFTLFFBQVEsQ0FBRSxNQUFNLEVBQUc7QUFDekIsbUJBQU8sVUFBVSxRQUFRLEVBQUc7QUFDekIsc0JBQU8sUUFBUSxDQUFFLFFBQVEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFBLENBQUUsQ0FBQyxDQUNwRixDQUFDLENBQ0osQ0FDSDs7Ozs7O0lBSUg7Ozs7O0FBSUQsWUFBUyxhQUFhLENBQUUsWUFBWSxFQUFHO0FBQ3BDLGFBQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FDcEM7OztBQUVELFlBQVMsUUFBUSxDQUFFLFlBQVksRUFBRztBQUMvQixhQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQy9COzs7QUFFRCxZQUFTLFFBQVEsQ0FBRSxZQUFZLEVBQUc7QUFDL0IsYUFBTyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUMvQjs7O0FBRUQsWUFBUyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRztBQUNyQixhQUFPLFlBQVc7QUFDZixnQkFBTyxDQUFDLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQyxDQUNsRSxDQUFDLENBQ0o7Ozs7OztBQUlNLFlBQVMsTUFBTSxDQUFFLEtBQUssRUFBRztBQUM3QixhQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFO0FBQ2hDLGlCQUFRLEVBQUUsRUFBRTtBQUNaLGNBQUssRUFBRSxFQUFFLEVBQ1gsQ0FBRSxDQUFDLENBQ047Ozs7OztBQUlNLFlBQVMsS0FBSyxHQUFHO0FBQ3JCLGFBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUUsU0FBUyxDQUFFLENBQUMsQ0FDL0M7Ozs7O0FBSU0sWUFBUyxtQkFBbUIsQ0FBRSxTQUFTLEVBQUUsVUFBVSxFQUFHO0FBQzFELFVBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3ZCLGVBQU0sQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFFLDJEQUFuQyxJQUFJLHlCQUFFLEtBQUs7QUFDbkIsZ0JBQU8sQUFBRSxJQUFJLEtBQUssV0FBVyxHQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUNwRSxDQUFFO0FBQUMsVUFBSSxFQUFFLENBQUM7O0FBRVgsVUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUUsVUFBQSxRQUFRLEVBQUk7QUFDckMsbUJBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRSxLQUFoRCxFQUFFLDRCQUFGLEVBQUUsS0FBRSxJQUFJLDRCQUFKLElBQUk7QUFDaEIsZ0JBQU8sQUFBRSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLEdBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQzNGLENBQUUsQ0FBQzs7O0FBRUosYUFBTztBQUNKLGVBQU0sRUFBTixNQUFNO0FBQ04scUJBQVksRUFBWixZQUFZLEVBQ2QsQ0FBQyxDQUNKIiwiZmlsZSI6ImdyYXBoLWhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgd2lyZWZsb3cgZnJvbSAnd2lyZWZsb3cnO1xuXG5pbXBvcnQgeyBvYmplY3QgfSBmcm9tICdsYXhhcic7XG5cbmNvbnN0IFRZUEVfQ09OVEFJTkVSID0gJ0NPTlRBSU5FUic7XG5cbmNvbnN0IHtcbiAgbGF5b3V0OiB7XG4gICAgIG1vZGVsOiBsYXlvdXRNb2RlbFxuICB9LFxuICBncmFwaDoge1xuICAgIG1vZGVsOiBncmFwaE1vZGVsXG4gIH1cbn0gPSB3aXJlZmxvdztcblxuY29uc3QgZWRnZVR5cGVzID0ge1xuICAgUkVTT1VSQ0U6IHtcbiAgICAgIGhpZGRlbjogZmFsc2UsXG4gICAgICBsYWJlbDogJ1Jlc291cmNlcydcbiAgIH0sXG4gICBGTEFHOiB7XG4gICAgICBsYWJlbDogJ0ZsYWdzJyxcbiAgICAgIGhpZGRlbjogZmFsc2VcbiAgIH0sXG4gICBBQ1RJT046IHtcbiAgICAgIGxhYmVsOiAnQWN0aW9ucycsXG4gICAgICBoaWRkZW46IGZhbHNlXG4gICB9LFxuICAgQ09OVEFJTkVSOiB7XG4gICAgICBoaWRkZW46IGZhbHNlLFxuICAgICAgbGFiZWw6ICdDb250YWluZXInLFxuICAgICAgb3duaW5nUG9ydDogJ291dGJvdW5kJ1xuICAgfVxufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB3aXJlZmxvdyBncmFwaCBmcm9tIGEgZ2l2ZW4gcGFnZS93aWRnZXQgaW5mb3JtYXRpb24gbW9kZWwuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhZ2VJbmZvXG4gKiBAcGFyYW0ge0Jvb2xlYW49ZmFsc2V9IHBhZ2VJbmZvLndpdGhJcnJlbGV2YW50V2lkZ2V0c1xuICogICBJZiBzZXQgdG8gYHRydWVgLCB3aWRnZXRzIHdpdGhvdXQgYW55IHJlbGV2YW5jZSB0byBhY3Rpb25zL3Jlc291cmNlcy9mbGFncyBhcmUgcmVtb3ZlZC5cbiAqICAgQ29udGFpbmVycyBvZiB3aWRnZXRzICh0aGF0IGFyZSByZWxldmFudCBieSB0aGlzIG1lYXN1cmUpIGFyZSBrZXB0LlxuICogQHBhcmFtIHtCb29sZWFuPWZhbHNlfSBwYWdlSW5mby53aXRoQ29udGFpbmVyc1xuICogICBJZiBzZXQgdG8gYHRydWVgLCBDb250YWluZXIgcmVsYXRpb25zaGlwcyBhcmUgaW5jbHVkZWQgaW4gdGhlIGdyYXBoIHJlcHJlc2VudGF0aW9uLlxuICogQHBhcmFtIHtTdHJpbmc9J0ZMQVQnfSBwYWdlSW5mby5jb21wb3NpdGlvbkRpc3BsYXlcbiAqICAgSWYgc2V0IHRvIGAnQ09NUEFDVCdgIChkZWZhdWx0KSwgY29tcG9zaXRpb25zIGFyZSByZXByZXNlbnRlZCBieSBhbiBpbnN0YW5jZSBub2RlLCByZWZsZWN0aW5nIHRoZWlyIGRldmVsb3BtZW50LXRpbWUgbW9kZWwuXG4gKiAgIElmIHNldCB0byBgJ0ZMQVQnYCwgY29tcG9zaXRpb25zIGFyZSByZXBsYWNlZCByZWN1cnNpdmVseSBieSB0aGVpciBjb25maWd1cmVkIGV4cGFuc2lvbiwgcmVmbGVjdGluZyB0aGVpciBydW4tdGltZSBtb2RlbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyYXBoKCBwYWdlSW5mbywgb3B0aW9ucyApIHtcblxuICAgY29uc3Qge1xuICAgICAgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gZmFsc2UsXG4gICAgICB3aXRoQ29udGFpbmVycyA9IHRydWUsXG4gICAgICBjb21wb3NpdGlvbkRpc3BsYXkgPSAnRkxBVCdcbiAgIH0gPSBvcHRpb25zO1xuXG4gICBjb25zdCBQQUdFX0lEID0gJy4nO1xuICAgY29uc3Qge1xuICAgICAgcGFnZVJlZmVyZW5jZSxcbiAgICAgIHBhZ2VEZWZpbml0aW9ucyxcbiAgICAgIHdpZGdldERlc2NyaXB0b3JzLFxuICAgICAgY29tcG9zaXRpb25EZWZpbml0aW9uc1xuICAgfSA9IHBhZ2VJbmZvO1xuICAgY29uc3QgcGFnZSA9IHBhZ2VEZWZpbml0aW9uc1sgcGFnZVJlZmVyZW5jZSBdWyBjb21wb3NpdGlvbkRpc3BsYXkgXTtcblxuXG4gICBjb25zdCB2ZXJ0aWNlcyA9IHt9O1xuICAgY29uc3QgZWRnZXMgPSB7fTtcblxuICAgaWRlbnRpZnlWZXJ0aWNlcygpO1xuICAgaWYoIHdpdGhDb250YWluZXJzICkge1xuICAgICAgaWRlbnRpZnlDb250YWluZXJzKCk7XG4gICB9XG4gICBpZiggIXdpdGhJcnJlbGV2YW50V2lkZ2V0cyApIHtcbiAgICAgIHBydW5lSXJyZWxldmFudFdpZGdldHMoIHdpdGhDb250YWluZXJzICk7XG4gICB9XG4gICBwcnVuZUVtcHR5RWRnZXMoKTtcblxuICAgcmV0dXJuIGdyYXBoTW9kZWwuY29udmVydC5ncmFwaCgge1xuICAgICAgdmVydGljZXMsXG4gICAgICBlZGdlc1xuICAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBpZGVudGlmeVZlcnRpY2VzKCkge1xuICAgICAgT2JqZWN0LmtleXMoIHBhZ2UuYXJlYXMgKS5mb3JFYWNoKCBhcmVhTmFtZSA9PiB7XG4gICAgICAgICBwYWdlLmFyZWFzWyBhcmVhTmFtZSBdLmZvckVhY2goIHBhZ2VBcmVhSXRlbSA9PiB7XG4gICAgICAgICAgICBpZiggaXNXaWRnZXQoIHBhZ2VBcmVhSXRlbSApICkge1xuICAgICAgICAgICAgICAgcHJvY2Vzc1dpZGdldEluc3RhbmNlKCBwYWdlQXJlYUl0ZW0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCBpc0NvbXBvc2l0aW9uKCBwYWdlQXJlYUl0ZW0gKSApIHtcbiAgICAgICAgICAgICAgIHByb2Nlc3NDb21wb3NpdGlvbkluc3RhbmNlKCBwYWdlQXJlYUl0ZW0sIGFyZWFOYW1lICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCBpc0xheW91dCggcGFnZUFyZWFJdGVtICkgKSB7XG4gICAgICAgICAgICAgICBwcm9jZXNzTGF5b3V0SW5zdGFuY2UoIHBhZ2VBcmVhSXRlbSwgYXJlYU5hbWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0gKTtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0xheW91dEluc3RhbmNlKCBsYXlvdXQsIGFyZWFOYW1lICkge1xuICAgICAgICAgdmVydGljZXNbIGxheW91dC5pZCBdID0ge1xuICAgICAgICAgICAgaWQ6IGxheW91dC5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBsYXlvdXQuaWQsXG4gICAgICAgICAgICBraW5kOiAnTEFZT1VUJyxcbiAgICAgICAgICAgIHBvcnRzOiB7IGluYm91bmQ6IFtdLCBvdXRib3VuZDogW10gfVxuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc1dpZGdldEluc3RhbmNlKCB3aWRnZXRJbnN0YW5jZSwgYXJlYU5hbWUgKSB7XG4gICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gd2lkZ2V0RGVzY3JpcHRvcnNbIHdpZGdldEluc3RhbmNlLndpZGdldCBdO1xuXG4gICAgICAgICBjb25zdCBraW5kcyA9IHtcbiAgICAgICAgICAgIHdpZGdldDogJ1dJREdFVCcsXG4gICAgICAgICAgICBhY3Rpdml0eTogJ0FDVElWSVRZJ1xuICAgICAgICAgfTtcblxuICAgICAgICAgY29uc3QgeyBpZCB9ID0gd2lkZ2V0SW5zdGFuY2U7XG4gICAgICAgICBjb25zdCBwb3J0cyA9IGlkZW50aWZ5UG9ydHMoIHdpZGdldEluc3RhbmNlLmZlYXR1cmVzLCBkZXNjcmlwdG9yLmZlYXR1cmVzICk7XG4gICAgICAgICB2ZXJ0aWNlc1sgaWQgXSA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBpZCxcbiAgICAgICAgICAgIGtpbmQ6IGtpbmRzWyBkZXNjcmlwdG9yLmludGVncmF0aW9uLnR5cGUgXSxcbiAgICAgICAgICAgIHBvcnRzOiBwb3J0c1xuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0NvbXBvc2l0aW9uSW5zdGFuY2UoIGNvbXBvc2l0aW9uSW5zdGFuY2UsIGFyZWFOYW1lICkge1xuICAgICAgICAgY29uc3QgeyBpZCB9ID0gY29tcG9zaXRpb25JbnN0YW5jZTtcbiAgICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBjb21wb3NpdGlvbkRlZmluaXRpb25zWyBwYWdlUmVmZXJlbmNlIF1bIGlkIF0uQ09NUEFDVDtcblxuICAgICAgICAgY29uc3QgcG9ydHMgPSBpZGVudGlmeVBvcnRzKCBjb21wb3NpdGlvbkluc3RhbmNlLmZlYXR1cmVzLCBkZWZpbml0aW9uLmZlYXR1cmVzICk7XG5cbiAgICAgICAgIHZlcnRpY2VzWyBpZCBdID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGlkLFxuICAgICAgICAgICAga2luZDogJ0NPTVBPU0lUSU9OJyxcbiAgICAgICAgICAgIHBvcnRzOiBwb3J0c1xuICAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaWRlbnRpZnlQb3J0cyggdmFsdWUsIHNjaGVtYSwgcGF0aCwgcG9ydHMgKSB7XG4gICAgICAgICBpZiggIXBhdGggJiYgIXBvcnRzICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coICdDTE9HIElERU5UIFBPUlRTJywgdmFsdWUsIHNjaGVtYSApOyAvLyA6VE9ETzogREVMRVRFIE1FXG4gICAgICAgICB9XG4gICAgICAgICBwYXRoID0gcGF0aCB8fCBbXTtcbiAgICAgICAgIHBvcnRzID0gcG9ydHMgfHwgeyBpbmJvdW5kOiBbXSwgb3V0Ym91bmQ6IFtdIH07XG4gICAgICAgICBpZiggIXZhbHVlIHx8ICFzY2hlbWEgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKCB2YWx1ZS5lbmFibGVkID09PSBmYWxzZSApIHtcbiAgICAgICAgICAgIC8vIGZlYXR1cmUgY2FuIGJlIGRpc2FibGVkLCBhbmQgd2FzIGRpc2FibGVkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdzdHJpbmcnICYmIHNjaGVtYS5heFJvbGUgJiZcbiAgICAgICAgICAgICAoIHNjaGVtYS5mb3JtYXQgPT09ICd0b3BpYycgfHwgc2NoZW1hLmZvcm1hdCA9PT0gJ2ZsYWctdG9waWMnICkgKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLmF4UGF0dGVybiA/IHNjaGVtYS5heFBhdHRlcm4udG9VcHBlckNhc2UoKSA6IGluZmVyRWRnZVR5cGUoIHBhdGggKTtcbiAgICAgICAgICAgIGlmKCAhdHlwZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBjb25zdCBlZGdlSWQgPSB0eXBlICsgJzonICsgdmFsdWU7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHBhdGguam9pbiggJy4nICk7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICBwYXRoLmpvaW4oICc6JyApO1xuICAgICAgICAgICAgcG9ydHNbIHNjaGVtYS5heFJvbGUgPT09ICdvdXRsZXQnID8gJ291dGJvdW5kJyA6ICdpbmJvdW5kJyBdLnB1c2goIHtcbiAgICAgICAgICAgICAgIGxhYmVsLCBpZCwgdHlwZSwgZWRnZUlkXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICBpZiggZWRnZUlkICYmICFlZGdlc1sgZWRnZUlkIF0gKSB7XG4gICAgICAgICAgICAgICBlZGdlc1sgZWRnZUlkIF0gPSB7IHR5cGUsIGlkOiBlZGdlSWQsIGxhYmVsOiB2YWx1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnICYmIHNjaGVtYS5wcm9wZXJ0aWVzICkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNjaGVtYS5wcm9wZXJ0aWVzICkuZm9yRWFjaCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5U2NoZW1hID0gc2NoZW1hLnByb3BlcnRpZXNbIGtleSBdIHx8IHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcztcbiAgICAgICAgICAgICAgIGlkZW50aWZ5UG9ydHMoIHZhbHVlWyBrZXkgXSwgcHJvcGVydHlTY2hlbWEsIHBhdGguY29uY2F0KCBbIGtleSBdICksIHBvcnRzICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggc2NoZW1hLnR5cGUgPT09ICdhcnJheScgKSB7XG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKCAoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgaWRlbnRpZnlQb3J0cyggaXRlbSwgc2NoZW1hLml0ZW1zLCBwYXRoLmNvbmNhdCggWyBpIF0gKSwgcG9ydHMgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybiBwb3J0cztcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaW5mZXJFZGdlVHlwZSggcGF0aCApIHtcbiAgICAgICAgIGlmKCAhcGF0aC5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgIH1cbiAgICAgICAgIGNvbnN0IGxhc3RTZWdtZW50ID0gcGF0aFsgcGF0aC5sZW5ndGggLSAxIF07XG4gICAgICAgICBpZiggWyAnYWN0aW9uJywgJ2ZsYWcnLCAncmVzb3VyY2UnIF0uaW5kZXhPZiggbGFzdFNlZ21lbnQgKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdFNlZ21lbnQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCBsYXN0U2VnbWVudCA9PT0gJ29uQWN0aW9ucycgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0FDVElPTic7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gaW5mZXJFZGdlVHlwZSggcGF0aC5zbGljZSggMCwgcGF0aC5sZW5ndGggLSAxICkgKTtcbiAgICAgIH1cblxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBpZGVudGlmeUNvbnRhaW5lcnMoKSB7XG4gICAgICBjb25zdCB0eXBlID0gVFlQRV9DT05UQUlORVI7XG5cbiAgICAgIHZlcnRpY2VzWyBQQUdFX0lEIF0gPSAge1xuICAgICAgICAgUEFHRV9JRCxcbiAgICAgICAgIGxhYmVsOiAnUGFnZSAnICsgcGFnZVJlZmVyZW5jZSxcbiAgICAgICAgIGtpbmQ6ICdQQUdFJyxcbiAgICAgICAgIHBvcnRzOiB7IGluYm91bmQ6IFtdLCBvdXRib3VuZDogW10gfVxuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmtleXMoIHBhZ2UuYXJlYXMgKS5mb3JFYWNoKCBhcmVhTmFtZSA9PiB7XG4gICAgICAgICBpbnNlcnRFZGdlKCBhcmVhTmFtZSApO1xuICAgICAgICAgY29uc3Qgb3duZXIgPSBmaW5kT3duZXIoIGFyZWFOYW1lICk7XG4gICAgICAgICBpZiggIW93bmVyICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgY29udGFpbnNBbnl0aGluZyA9IGZhbHNlO1xuICAgICAgICAgcGFnZS5hcmVhc1sgYXJlYU5hbWUgXVxuICAgICAgICAgICAgLmZpbHRlciggaXRlbSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gaXNDb21wb3NpdGlvbiggaXRlbSApID9cbiAgICAgICAgICAgICAgICAgIGNvbXBvc2l0aW9uRGlzcGxheSA9PT0gJ0NPTVBBQ1QnIDpcbiAgICAgICAgICAgICAgICAgIHRydWU7XG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIC5mb3JFYWNoKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgIGlmKCB2ZXJ0aWNlc1sgaXRlbS5pZCBdICkge1xuICAgICAgICAgICAgICAgICAgaW5zZXJ0VXBsaW5rKCB2ZXJ0aWNlc1sgaXRlbS5pZCBdLCBhcmVhTmFtZSApO1xuICAgICAgICAgICAgICAgICAgY29udGFpbnNBbnl0aGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICBpZiggY29udGFpbnNBbnl0aGluZyApIHtcbiAgICAgICAgICAgIGluc2VydE93bmVyUG9ydCggb3duZXIsIGFyZWFOYW1lICk7XG4gICAgICAgICB9XG4gICAgICB9ICk7XG5cbiAgICAgIGZ1bmN0aW9uIGZpbmRPd25lciggYXJlYU5hbWUgKSB7XG4gICAgICAgICBpZiggYXJlYU5hbWUuaW5kZXhPZiggJy4nICkgPT09IC0xICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyBQQUdFX0lEIF07XG4gICAgICAgICB9XG4gICAgICAgICBjb25zdCBwcmVmaXggPSBhcmVhTmFtZS5zbGljZSggMCwgYXJlYU5hbWUubGFzdEluZGV4T2YoICcuJyApICk7XG4gICAgICAgICByZXR1cm4gdmVydGljZXNbIHByZWZpeCBdO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbnNlcnRPd25lclBvcnQoIHZlcnRleCwgYXJlYU5hbWUgKSB7XG4gICAgICAgICB2ZXJ0ZXgucG9ydHMub3V0Ym91bmQudW5zaGlmdCgge1xuICAgICAgICAgICAgaWQ6ICdDT05UQUlORVI6JyArIGFyZWFOYW1lLFxuICAgICAgICAgICAgdHlwZTogVFlQRV9DT05UQUlORVIsXG4gICAgICAgICAgICBlZGdlSWQ6IGFyZWFFZGdlSWQoIGFyZWFOYW1lICksXG4gICAgICAgICAgICBsYWJlbDogYXJlYU5hbWVcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5zZXJ0VXBsaW5rKCB2ZXJ0ZXgsIGFyZWFOYW1lICkge1xuICAgICAgICAgdmVydGV4LnBvcnRzLmluYm91bmQudW5zaGlmdCgge1xuICAgICAgICAgICAgaWQ6ICdDT05UQUlORVI6YW5jaG9yJyxcbiAgICAgICAgICAgIHR5cGU6IFRZUEVfQ09OVEFJTkVSLFxuICAgICAgICAgICAgZWRnZUlkOiBhcmVhRWRnZUlkKCBhcmVhTmFtZSApLFxuICAgICAgICAgICAgbGFiZWw6ICdhbmNob3InXG4gICAgICAgICB9ICk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGluc2VydEVkZ2UoIGFyZWFOYW1lICkge1xuICAgICAgICAgY29uc3QgaWQgPSBhcmVhRWRnZUlkKCBhcmVhTmFtZSApO1xuICAgICAgICAgZWRnZXNbIGlkIF0gPSB7IGlkLCB0eXBlLCBsYWJlbDogYXJlYU5hbWUgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXJlYUVkZ2VJZCggYXJlYU5hbWUgKSB7XG4gICAgICAgICByZXR1cm4gVFlQRV9DT05UQUlORVIgKyAnOicgKyBhcmVhTmFtZTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcHJ1bmVJcnJlbGV2YW50V2lkZ2V0cyggd2l0aENvbnRhaW5lcnMgKSB7XG4gICAgICBsZXQgdG9QcnVuZSA9IFtdO1xuICAgICAgZG8ge1xuICAgICAgICAgdG9QcnVuZS5mb3JFYWNoKCBpZCA9PiB7IGRlbGV0ZSB2ZXJ0aWNlc1sgaWQgXTsgfSApO1xuICAgICAgICAgcHJ1bmVFbXB0eUVkZ2VzKCk7XG4gICAgICAgICB0b1BydW5lID0gbWFyaygpO1xuICAgICAgfSB3aGlsZSggdG9QcnVuZS5sZW5ndGggKTtcblxuICAgICAgZnVuY3Rpb24gbWFyaygpIHtcbiAgICAgICAgIGNvbnN0IHBydW5lTGlzdCA9IFtdO1xuICAgICAgICAgT2JqZWN0LmtleXMoIHZlcnRpY2VzICkuZm9yRWFjaCggdklkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcnRzID0gdmVydGljZXNbIHZJZCBdLnBvcnRzO1xuICAgICAgICAgICAgaWYoIHBvcnRzLmluYm91bmQubGVuZ3RoIDw9IHdpdGhDb250YWluZXJzID8gMSA6IDAgKSB7XG4gICAgICAgICAgICAgICBpZiggcG9ydHMub3V0Ym91bmQuZXZlcnkoIF8gPT4gIV8uZWRnZUlkICkgKSB7XG4gICAgICAgICAgICAgICAgICBwcnVuZUxpc3QucHVzaCggdklkICApO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSApO1xuICAgICAgICAgcmV0dXJuIHBydW5lTGlzdDtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcHJ1bmVFbXB0eUVkZ2VzKCkge1xuICAgICAgY29uc3QgdG9QcnVuZSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoIGVkZ2VzICkuZm9yRWFjaCggZWRnZUlkID0+IHtcbiAgICAgICAgIGNvbnN0IHR5cGUgPSBlZGdlVHlwZXNbIGVkZ2VzWyBlZGdlSWQgXS50eXBlIF07XG4gICAgICAgICBjb25zdCBzb3VyY2VzID0gT2JqZWN0LmtleXMoIHZlcnRpY2VzICkuZmlsdGVyKCBpc1NvdXJjZU9mKCBlZGdlSWQgKSApO1xuICAgICAgICAgY29uc3Qgc2lua3MgPSBPYmplY3Qua2V5cyggdmVydGljZXMgKS5maWx0ZXIoIGlzU2lua09mKCBlZGdlSWQgKSApO1xuICAgICAgICAgY29uc3QgaGFzU291cmNlcyA9IHNvdXJjZXMubGVuZ3RoID4gMDtcbiAgICAgICAgIGNvbnN0IGhhc1NpbmtzID0gc2lua3MubGVuZ3RoID4gMDtcbiAgICAgICAgIGNvbnN0IGlzRW1wdHkgPSB0eXBlLm93bmluZ1BvcnQgPyAoIWhhc1NvdXJjZXMgfHwgIWhhc1NpbmtzKSA6ICghaGFzU291cmNlcyAmJiAhaGFzU2lua3MpO1xuICAgICAgICAgaWYoICFpc0VtcHR5ICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0b1BydW5lLnB1c2goIGVkZ2VJZCApO1xuICAgICAgICAgc291cmNlcy5jb25jYXQoIHNpbmtzICkuZm9yRWFjaCggdmVydGV4SWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9ydHMgPSB2ZXJ0aWNlc1sgdmVydGV4SWQgXS5wb3J0cztcbiAgICAgICAgICAgIHBvcnRzLmluYm91bmQuY29uY2F0KCBwb3J0cy5vdXRib3VuZCApLmZvckVhY2goIHBvcnQgPT4ge1xuICAgICAgICAgICAgICAgcG9ydC5lZGdlSWQgPSBwb3J0LmVkZ2VJZCA9PT0gZWRnZUlkID8gbnVsbCA6IHBvcnQuZWRnZUlkO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuICAgICAgfSApO1xuICAgICAgdG9QcnVuZS5mb3JFYWNoKCBpZCA9PiB7IGRlbGV0ZSBlZGdlc1sgaWQgXTsgfSApO1xuXG4gICAgICBmdW5jdGlvbiBpc1NvdXJjZU9mKCBlZGdlSWQgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHZlcnRleElkICkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnRpY2VzWyB2ZXJ0ZXhJZCBdLnBvcnRzLmluYm91bmQuc29tZSggcG9ydCA9PiBwb3J0LmVkZ2VJZCA9PT0gZWRnZUlkICk7XG4gICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc1NpbmtPZiggZWRnZUlkICkge1xuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB2ZXJ0ZXhJZCApIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJ0aWNlc1sgdmVydGV4SWQgXS5wb3J0cy5vdXRib3VuZC5zb21lKCBwb3J0ID0+IHBvcnQuZWRnZUlkID09PSBlZGdlSWQgKTtcbiAgICAgICAgIH07XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gaXNDb21wb3NpdGlvbiggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLmNvbXBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBpc1dpZGdldCggcGFnZUFyZWFJdGVtICkge1xuICAgcmV0dXJuICEhcGFnZUFyZWFJdGVtLndpZGdldDtcbn1cblxuZnVuY3Rpb24gaXNMYXlvdXQoIHBhZ2VBcmVhSXRlbSApIHtcbiAgIHJldHVybiAhIXBhZ2VBcmVhSXRlbS5sYXlvdXQ7XG59XG5cbmZ1bmN0aW9uIGVpdGhlciggZiwgZyApIHtcbiAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSB8fCBnLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgIH07XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXQoIGdyYXBoICkge1xuICAgcmV0dXJuIGxheW91dE1vZGVsLmNvbnZlcnQubGF5b3V0KCB7XG4gICAgICB2ZXJ0aWNlczoge30sXG4gICAgICBlZGdlczoge31cbiAgIH0gKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVzKCkge1xuICAgcmV0dXJuIGdyYXBoTW9kZWwuY29udmVydC50eXBlcyggZWRnZVR5cGVzICk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJGcm9tU2VsZWN0aW9uKCBzZWxlY3Rpb24sIGdyYXBoTW9kZWwgKSB7XG4gICBjb25zdCB0b3BpY3MgPSBzZWxlY3Rpb24uZWRnZXMuZmxhdE1hcCggZWRnZUlkID0+IHtcbiAgICAgIGNvbnN0IFsgdHlwZSwgdG9waWMgXSA9IGVkZ2VJZC5zcGxpdCggJzonICk7XG4gICAgICByZXR1cm4gKCB0eXBlID09PSAnQ09OVEFJTkVSJyApID8gW10gOiBbeyBwYXR0ZXJuOiB0eXBlLCB0b3BpYyB9XTtcbiAgIH0gKS50b0pTKCk7XG5cbiAgIGNvbnN0IHBhcnRpY2lwYW50cyA9IHNlbGVjdGlvbi52ZXJ0aWNlcy5mbGF0TWFwKCB2ZXJ0ZXhJZCA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBraW5kIH0gPSBncmFwaE1vZGVsLnZlcnRpY2VzLmdldCggdmVydGV4SWQgKTtcbiAgICAgIHJldHVybiAoIGtpbmQgPT09ICdQQUdFJyB8fCBraW5kID09PSAnTEFZT1VUJyApID8gW10gOiBbeyBraW5kLCBwYXJ0aWNpcGFudDogdmVydGV4SWQgfV07XG4gICB9ICk7XG5cbiAgIHJldHVybiB7XG4gICAgICB0b3BpY3MsXG4gICAgICBwYXJ0aWNpcGFudHNcbiAgIH07XG59XG4iXX0=
