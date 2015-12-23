/* jshint ignore:start */
define(['exports', 'module', 'react', 'laxar-patterns', 'wireflow', './graph-helpers'], function (exports, module, _react, _laxarPatterns, _wireflow, _graphHelpers) {'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _patterns = _interopRequireDefault(_laxarPatterns);var _wireflow2 = _interopRequireDefault(_wireflow);var 







   SelectionStore = _wireflow2['default'].selection.SelectionStore;var 
   HistoryStore = _wireflow2['default'].history.HistoryStore;var 
   LayoutStore = _wireflow2['default'].layout.LayoutStore;var _wireflow$graph = _wireflow2['default'].
   graph;var GraphStore = _wireflow$graph.GraphStore;var ActivateVertex = _wireflow$graph.actions.ActivateVertex;var _wireflow$settings = _wireflow2['default'].
   settings;var _wireflow$settings$actions = _wireflow$settings.
   actions;var ChangeMode = _wireflow$settings$actions.ChangeMode;var MinimapResized = _wireflow$settings$actions.MinimapResized;var _wireflow$settings$model = _wireflow$settings.
   model;var Settings = _wireflow$settings$model.Settings;var READ_ONLY = _wireflow$settings$model.READ_ONLY;var READ_WRITE = _wireflow$settings$model.READ_WRITE;var 
   SettingsStore = _wireflow$settings.SettingsStore;var 

   Dispatcher = _wireflow2['default'].Dispatcher;var 
   Graph = _wireflow2['default'].components.Graph;



   function create(context, eventBus, reactRender) {

      var visible = false;
      var domAvailable = false;
      var viewModel = null;
      var viewModelCalculation = null;

      var withIrrelevantWidgets = false;
      var withContainers = true;
      var withFlatCompositions = false;
      var activeComposition = null;

      var publishedSelection = null;

      _patterns['default'].resources.handlerFor(context).
      registerResourceFromFeature('pageInfo', { 
         onUpdateReplace: function onUpdateReplace() {return initializeViewModel(true);} });



      var publishFilter = _patterns['default'].resources.replacePublisherForFeature(context, 'filter', { 
         isOptional: true });


      eventBus.subscribe('didChangeAreaVisibility.' + context.widget.area, function (event, meta) {
         if (!visible && event.visible) {
            visible = true;
            render();}});



      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function replaceFilter(selection, graphModel) {
         var resource = context.features.filter.resource;
         if (!resource || selection === publishedSelection) {
            return;}

         publishedSelection = selection;
         publishFilter((0, _graphHelpers.filterFromSelection)(selection, graphModel));}


      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleIrrelevantWidgets() {
         withIrrelevantWidgets = !withIrrelevantWidgets;
         initializeViewModel(true);}


      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleContainers() {
         withContainers = !withContainers;
         initializeViewModel(true);}


      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleCompositions() {
         withFlatCompositions = !withFlatCompositions;
         initializeViewModel(true);}


      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function initializeViewModel(doReset) {
         if (doReset) {
            viewModel = null;
            clearTimeout(viewModelCalculation);
            viewModelCalculation = null;
            if (visible) {
               render();}}



         if (visible) {
            // setTimeout: used to ensure that the browser shows the spinner before stalling for layout
            viewModelCalculation = viewModelCalculation || setTimeout(function () {
               var pageTypes = (0, _graphHelpers.types)();
               var pageInfo = context.resources.pageInfo;
               var pageGraph = (0, _graphHelpers.graph)(pageInfo, { 
                  withIrrelevantWidgets: withIrrelevantWidgets, 
                  withContainers: withContainers, 
                  compositionDisplay: withFlatCompositions ? 'FLAT' : 'COMPACT', 
                  activeComposition: activeComposition });

               var dispatcher = new Dispatcher(render);
               new HistoryStore(dispatcher);
               var graphStore = new GraphStore(dispatcher, pageGraph, pageTypes);
               var layoutStore = new LayoutStore(dispatcher, graphStore);
               var settingsStore = new SettingsStore(dispatcher, Settings({ mode: READ_ONLY }));
               var selectionStore = new SelectionStore(dispatcher, layoutStore, graphStore);

               dispatcher.register(ActivateVertex, function (_ref) {var vertex = _ref.vertex;
                  console.log('activate: ', vertex.toJS());
                  if (vertex.kind === 'COMPOSITION') {
                     activeComposition = vertex.id;
                     initializeViewModel(true);}});



               viewModel = { graphStore: graphStore, layoutStore: layoutStore, settingsStore: settingsStore, selectionStore: selectionStore, dispatcher: dispatcher };
               render();}, 
            20);}}



      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {
         if (!visible || !domAvailable) {
            return;}


         if (!viewModel) {
            reactRender(
            _React['default'].createElement('div', { className: 'page-inspector-placeholder' }, 
            _React['default'].createElement('i', { className: 'fa fa-cog fa-spin' })));


            initializeViewModel();
            return;}var _viewModel = 








         viewModel;var graphStore = _viewModel.graphStore;var layoutStore = _viewModel.layoutStore;var settingsStore = _viewModel.settingsStore;var selectionStore = _viewModel.selectionStore;var dispatcher = _viewModel.dispatcher;

         replaceFilter(selectionStore.selection, graphStore.graph);


         reactRender(
         _React['default'].createElement('div', { className: 'page-inspector-row form-inline' }, 
         activeComposition || 'nothing', 
         _React['default'].createElement('div', { className: 'text-right' }, 
         _React['default'].createElement('button', { type: 'button', className: 'btn btn-link', 
            title: 'Include widgets without any links to relevant topics?', 
            onClick: toggleIrrelevantWidgets }, 
         _React['default'].createElement('i', { className: 'fa fa-toggle-' + (withIrrelevantWidgets ? 'on' : 'off') }), ' ', 
         _React['default'].createElement('span', null, 'Isolated Widgets')), 
         _React['default'].createElement('button', { type: 'button', className: 'btn btn-link', 
            title: 'Include area-nesting relationships?', 
            onClick: toggleContainers }, 
         _React['default'].createElement('i', { className: 'fa fa-toggle-' + (withContainers ? 'on' : 'off') }), ' ', 
         _React['default'].createElement('span', null, 'Containers')), 
         _React['default'].createElement('button', { type: 'button', className: 'btn btn-link', 
            title: 'Flatten compositions into their runtime contents?', 
            onClick: toggleCompositions }, 
         _React['default'].createElement('i', { className: 'fa fa-toggle-' + (withFlatCompositions ? 'on' : 'off') }), ' ', 
         _React['default'].createElement('span', null, 'Flatten Compositions'))), 

         _React['default'].createElement(Graph, { className: 'nbe-theme-fusebox-app', 
            types: graphStore.types, 
            model: graphStore.graph, 
            layout: layoutStore.layout, 
            measurements: layoutStore.measurements, 
            settings: settingsStore.settings, 
            selection: selectionStore.selection, 
            eventHandler: dispatcher.dispatch })));}




      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { onDomAvailable: function onDomAvailable() {
            domAvailable = true;
            render();} };}module.exports = 



   { 
      name: 'page-inspector-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UtaW5zcGVjdG9yLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRZSxpQkFBYyx5QkFBM0IsU0FBUyxDQUFJLGNBQWM7QUFDaEIsZUFBWSx5QkFBdkIsT0FBTyxDQUFJLFlBQVk7QUFDYixjQUFXLHlCQUFyQixNQUFNLENBQUksV0FBVztBQUNyQixRQUFLLEtBQUksVUFBVSxtQkFBVixVQUFVLEtBQWEsY0FBYyxtQkFBekIsT0FBTyxDQUFJLGNBQWM7QUFDOUMsV0FBUTtBQUNOLFVBQU8sS0FBSSxVQUFVLDhCQUFWLFVBQVUsS0FBRSxjQUFjLDhCQUFkLGNBQWM7QUFDckMsUUFBSyxLQUFJLFFBQVEsNEJBQVIsUUFBUSxLQUFFLFNBQVMsNEJBQVQsU0FBUyxLQUFFLFVBQVUsNEJBQVYsVUFBVTtBQUN4QyxnQkFBYSxzQkFBYixhQUFhOztBQUVmLGFBQVUseUJBQVYsVUFBVTtBQUNJLFFBQUsseUJBQW5CLFVBQVUsQ0FBSSxLQUFLOzs7O0FBSXJCLFlBQVMsTUFBTSxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFHOztBQUUvQyxVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixVQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7QUFFaEMsVUFBSSxxQkFBcUIsR0FBRyxLQUFLLENBQUM7QUFDbEMsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLFVBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDOztBQUU3QixVQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQzs7QUFFOUIsMkJBQVMsU0FBUyxDQUFDLFVBQVUsQ0FBRSxPQUFPLENBQUU7QUFDcEMsaUNBQTJCLENBQUUsVUFBVSxFQUFFO0FBQ3ZDLHdCQUFlLEVBQUUsbUNBQU0s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RUFBRSxXQUFXLENBQUMsWUFBWSxBQUFDO0FBQ3ZDLG9CQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVEsQUFBQztBQUNqQyxxQkFBUyxFQUFFLGNBQWMsQ0FBQyxTQUFTLEFBQUM7QUFDcEMsd0JBQVksRUFBRSxVQUFVLENBQUMsUUFBUSxBQUFDLEdBQUcsQ0FDekMsQ0FDUixDQUFDLENBQ0o7Ozs7Ozs7QUFJRCxhQUFPLEVBQUUsY0FBYyxFQUFFLDBCQUFNO0FBQzVCLHdCQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGtCQUFNLEVBQUUsQ0FBQyxDQUNYLEVBQUUsQ0FBQyxDQUNOOzs7O0FBRWM7QUFDWixVQUFJLEVBQUUsdUJBQXVCO0FBQzdCLGdCQUFVLEVBQUUsQ0FBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBRTtBQUMxRCxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6InBhZ2UtaW5zcGVjdG9yLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgcGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuXG5pbXBvcnQgd2lyZWZsb3cgZnJvbSAnd2lyZWZsb3cnO1xuXG5pbXBvcnQgeyB0eXBlcywgZ3JhcGgsIGxheW91dCwgZmlsdGVyRnJvbVNlbGVjdGlvbiB9IGZyb20gJy4vZ3JhcGgtaGVscGVycyc7XG5cbmNvbnN0IHtcbiAgc2VsZWN0aW9uOiB7IFNlbGVjdGlvblN0b3JlIH0sXG4gIGhpc3Rvcnk6IHsgSGlzdG9yeVN0b3JlIH0sXG4gIGxheW91dDogeyBMYXlvdXRTdG9yZSB9LFxuICBncmFwaDogeyBHcmFwaFN0b3JlLCBhY3Rpb25zOiB7IEFjdGl2YXRlVmVydGV4IH0gfSxcbiAgc2V0dGluZ3M6IHtcbiAgICBhY3Rpb25zOiB7IENoYW5nZU1vZGUsIE1pbmltYXBSZXNpemVkIH0sXG4gICAgbW9kZWw6IHsgU2V0dGluZ3MsIFJFQURfT05MWSwgUkVBRF9XUklURSB9LFxuICAgIFNldHRpbmdzU3RvcmVcbiAgfSxcbiAgRGlzcGF0Y2hlcixcbiAgY29tcG9uZW50czogeyBHcmFwaCB9XG59ID0gd2lyZWZsb3c7XG5cblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIgKSB7XG5cbiAgIGxldCB2aXNpYmxlID0gZmFsc2U7XG4gICBsZXQgZG9tQXZhaWxhYmxlID0gZmFsc2U7XG4gICBsZXQgdmlld01vZGVsID0gbnVsbDtcbiAgIGxldCB2aWV3TW9kZWxDYWxjdWxhdGlvbiA9IG51bGw7XG5cbiAgIGxldCB3aXRoSXJyZWxldmFudFdpZGdldHMgPSBmYWxzZTtcbiAgIGxldCB3aXRoQ29udGFpbmVycyA9IHRydWU7XG4gICBsZXQgd2l0aEZsYXRDb21wb3NpdGlvbnMgPSBmYWxzZTtcbiAgIGxldCBhY3RpdmVDb21wb3NpdGlvbiA9IG51bGw7XG5cbiAgIGxldCBwdWJsaXNoZWRTZWxlY3Rpb24gPSBudWxsO1xuXG4gICBwYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApXG4gICAgICAucmVnaXN0ZXJSZXNvdXJjZUZyb21GZWF0dXJlKCAncGFnZUluZm8nLCB7XG4gICAgICAgICBvblVwZGF0ZVJlcGxhY2U6ICgpID0+IGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKVxuICAgICAgfSApO1xuXG5cbiAgIGNvbnN0IHB1Ymxpc2hGaWx0ZXIgPSBwYXR0ZXJucy5yZXNvdXJjZXMucmVwbGFjZVB1Ymxpc2hlckZvckZlYXR1cmUoIGNvbnRleHQsICdmaWx0ZXInLCB7XG4gICAgICBpc09wdGlvbmFsOiB0cnVlXG4gICB9ICk7XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggYGRpZENoYW5nZUFyZWFWaXNpYmlsaXR5LiR7Y29udGV4dC53aWRnZXQuYXJlYX1gLCAoZXZlbnQsIG1ldGEpID0+IHtcbiAgICAgIGlmKCAhdmlzaWJsZSAmJiBldmVudC52aXNpYmxlICkge1xuICAgICAgICAgdmlzaWJsZSA9IHRydWU7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZXBsYWNlRmlsdGVyKCBzZWxlY3Rpb24sIGdyYXBoTW9kZWwgKSB7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLnJlc291cmNlO1xuICAgICAgaWYoICFyZXNvdXJjZSB8fCBzZWxlY3Rpb24gPT09IHB1Ymxpc2hlZFNlbGVjdGlvbiApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHB1Ymxpc2hlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgICAgIHB1Ymxpc2hGaWx0ZXIoIGZpbHRlckZyb21TZWxlY3Rpb24oIHNlbGVjdGlvbiwgZ3JhcGhNb2RlbCApICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlSXJyZWxldmFudFdpZGdldHMoKSB7XG4gICAgICB3aXRoSXJyZWxldmFudFdpZGdldHMgPSAhd2l0aElycmVsZXZhbnRXaWRnZXRzO1xuICAgICAgaW5pdGlhbGl6ZVZpZXdNb2RlbCggdHJ1ZSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHRvZ2dsZUNvbnRhaW5lcnMoKSB7XG4gICAgICB3aXRoQ29udGFpbmVycyA9ICF3aXRoQ29udGFpbmVycztcbiAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB0b2dnbGVDb21wb3NpdGlvbnMoKSB7XG4gICAgICB3aXRoRmxhdENvbXBvc2l0aW9ucyA9ICF3aXRoRmxhdENvbXBvc2l0aW9ucztcbiAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBpbml0aWFsaXplVmlld01vZGVsKCBkb1Jlc2V0ICkge1xuICAgICAgaWYoIGRvUmVzZXQgKSB7XG4gICAgICAgICB2aWV3TW9kZWwgPSBudWxsO1xuICAgICAgICAgY2xlYXJUaW1lb3V0KCB2aWV3TW9kZWxDYWxjdWxhdGlvbiApO1xuICAgICAgICAgdmlld01vZGVsQ2FsY3VsYXRpb24gPSBudWxsO1xuICAgICAgICAgaWYoIHZpc2libGUgKSB7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoIHZpc2libGUgKSB7XG4gICAgICAgICAvLyBzZXRUaW1lb3V0OiB1c2VkIHRvIGVuc3VyZSB0aGF0IHRoZSBicm93c2VyIHNob3dzIHRoZSBzcGlubmVyIGJlZm9yZSBzdGFsbGluZyBmb3IgbGF5b3V0XG4gICAgICAgICB2aWV3TW9kZWxDYWxjdWxhdGlvbiA9IHZpZXdNb2RlbENhbGN1bGF0aW9uIHx8IHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VUeXBlcyA9IHR5cGVzKCk7XG4gICAgICAgICAgICBjb25zdCBwYWdlSW5mbyA9IGNvbnRleHQucmVzb3VyY2VzLnBhZ2VJbmZvO1xuICAgICAgICAgICAgY29uc3QgcGFnZUdyYXBoID0gZ3JhcGgoIHBhZ2VJbmZvLCB7XG4gICAgICAgICAgICAgICB3aXRoSXJyZWxldmFudFdpZGdldHMsXG4gICAgICAgICAgICAgICB3aXRoQ29udGFpbmVycyxcbiAgICAgICAgICAgICAgIGNvbXBvc2l0aW9uRGlzcGxheTogd2l0aEZsYXRDb21wb3NpdGlvbnMgPyAnRkxBVCcgOiAnQ09NUEFDVCcsXG4gICAgICAgICAgICAgICBhY3RpdmVDb21wb3NpdGlvblxuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgY29uc3QgZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCByZW5kZXIgKTtcbiAgICAgICAgICAgIG5ldyBIaXN0b3J5U3RvcmUoIGRpc3BhdGNoZXIgKTtcbiAgICAgICAgICAgIGNvbnN0IGdyYXBoU3RvcmUgPSBuZXcgR3JhcGhTdG9yZSggZGlzcGF0Y2hlciwgcGFnZUdyYXBoLCBwYWdlVHlwZXMgKTtcbiAgICAgICAgICAgIGNvbnN0IGxheW91dFN0b3JlID0gbmV3IExheW91dFN0b3JlKCBkaXNwYXRjaGVyLCBncmFwaFN0b3JlICk7XG4gICAgICAgICAgICBjb25zdCBzZXR0aW5nc1N0b3JlID0gbmV3IFNldHRpbmdzU3RvcmUoIGRpc3BhdGNoZXIsIFNldHRpbmdzKHsgbW9kZTogUkVBRF9PTkxZIH0pICk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25TdG9yZSA9IG5ldyBTZWxlY3Rpb25TdG9yZSggZGlzcGF0Y2hlciwgbGF5b3V0U3RvcmUsIGdyYXBoU3RvcmUgKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2hlci5yZWdpc3RlciggQWN0aXZhdGVWZXJ0ZXgsICh7IHZlcnRleCB9KSA9PiB7XG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2FjdGl2YXRlOiAnLCB2ZXJ0ZXgudG9KUygpICk7XG4gICAgICAgICAgICAgICBpZiggdmVydGV4LmtpbmQgPT09ICdDT01QT1NJVElPTicgKSB7XG4gICAgICAgICAgICAgICAgICBhY3RpdmVDb21wb3NpdGlvbiA9IHZlcnRleC5pZDtcbiAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgdmlld01vZGVsID0geyBncmFwaFN0b3JlLCBsYXlvdXRTdG9yZSwgc2V0dGluZ3NTdG9yZSwgc2VsZWN0aW9uU3RvcmUsIGRpc3BhdGNoZXIgfTtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgfSwgMjAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICBpZiggIXZpc2libGUgfHwgIWRvbUF2YWlsYWJsZSApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoICF2aWV3TW9kZWwgKSB7XG4gICAgICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYWdlLWluc3BlY3Rvci1wbGFjZWhvbGRlcic+XG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtY29nIGZhLXNwaW4nPjwvaT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTtcbiAgICAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge1xuICAgICAgICAgZ3JhcGhTdG9yZSxcbiAgICAgICAgIGxheW91dFN0b3JlLFxuICAgICAgICAgc2V0dGluZ3NTdG9yZSxcbiAgICAgICAgIHNlbGVjdGlvblN0b3JlLFxuICAgICAgICAgZGlzcGF0Y2hlclxuICAgICAgfSA9IHZpZXdNb2RlbDtcblxuICAgICAgcmVwbGFjZUZpbHRlciggc2VsZWN0aW9uU3RvcmUuc2VsZWN0aW9uLCBncmFwaFN0b3JlLmdyYXBoICk7XG5cblxuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFnZS1pbnNwZWN0b3Itcm93IGZvcm0taW5saW5lJz5cbiAgICAgICAgICAgIHsgYWN0aXZlQ29tcG9zaXRpb24gfHwgJ25vdGhpbmcnIH1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0LXJpZ2h0Jz5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tbGluaydcbiAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJJbmNsdWRlIHdpZGdldHMgd2l0aG91dCBhbnkgbGlua3MgdG8gcmVsZXZhbnQgdG9waWNzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUlycmVsZXZhbnRXaWRnZXRzfVxuICAgICAgICAgICAgICAgICAgPjxpIGNsYXNzTmFtZT17J2ZhIGZhLXRvZ2dsZS0nICsgKCB3aXRoSXJyZWxldmFudFdpZGdldHMgPyAnb24nIDogJ29mZicgKSB9XG4gICAgICAgICAgICAgICAgICA+PC9pPiA8c3Bhbj5Jc29sYXRlZCBXaWRnZXRzPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rJ1xuICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkluY2x1ZGUgYXJlYS1uZXN0aW5nIHJlbGF0aW9uc2hpcHM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlQ29udGFpbmVyc31cbiAgICAgICAgICAgICAgICAgID48aSBjbGFzc05hbWU9eydmYSBmYS10b2dnbGUtJyArICggd2l0aENvbnRhaW5lcnMgPyAnb24nIDogJ29mZicgKSB9XG4gICAgICAgICAgICAgICAgICA+PC9pPiA8c3Bhbj5Db250YWluZXJzPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rJ1xuICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkZsYXR0ZW4gY29tcG9zaXRpb25zIGludG8gdGhlaXIgcnVudGltZSBjb250ZW50cz9cIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVDb21wb3NpdGlvbnN9XG4gICAgICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsnZmEgZmEtdG9nZ2xlLScgKyAoIHdpdGhGbGF0Q29tcG9zaXRpb25zID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgICAgPjwvaT4gPHNwYW4+RmxhdHRlbiBDb21wb3NpdGlvbnM8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxHcmFwaCBjbGFzc05hbWU9J25iZS10aGVtZS1mdXNlYm94LWFwcCdcbiAgICAgICAgICAgICAgICAgICB0eXBlcz17Z3JhcGhTdG9yZS50eXBlc31cbiAgICAgICAgICAgICAgICAgICBtb2RlbD17Z3JhcGhTdG9yZS5ncmFwaH1cbiAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e2xheW91dFN0b3JlLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICBtZWFzdXJlbWVudHM9e2xheW91dFN0b3JlLm1lYXN1cmVtZW50c31cbiAgICAgICAgICAgICAgICAgICBzZXR0aW5ncz17c2V0dGluZ3NTdG9yZS5zZXR0aW5nc31cbiAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb249e3NlbGVjdGlvblN0b3JlLnNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICBldmVudEhhbmRsZXI9e2Rpc3BhdGNoZXIuZGlzcGF0Y2h9IC8+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgcmV0dXJuIHsgb25Eb21BdmFpbGFibGU6ICgpID0+IHtcbiAgICAgIGRvbUF2YWlsYWJsZSA9IHRydWU7XG4gICAgICByZW5kZXIoKTtcbiAgIH0gfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ3BhZ2UtaW5zcGVjdG9yLXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBbICdheENvbnRleHQnLCAnYXhFdmVudEJ1cycsICdheFJlYWN0UmVuZGVyJyBdLFxuICAgY3JlYXRlXG59O1xuIl19
