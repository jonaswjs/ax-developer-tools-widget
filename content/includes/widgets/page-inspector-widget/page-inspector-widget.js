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

      var compositionStack = [];
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

      function enterCompositionInstance(id) {
         console.log('activate: ', id);
         var currentIndex = id ? compositionStack.indexOf(id) : 0;
         if (currentIndex !== -1) {
            compositionStack.splice(id ? currentIndex + 1 : 0, compositionStack.length - currentIndex);} else 

         {
            compositionStack.push(id);}

         activeComposition = id;
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
                  if (vertex.kind === 'COMPOSITION') {
                     enterCompositionInstance(vertex.id);}});



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
         _React['default'].createElement('div', { className: 'text-right' }, 
         _React['default'].createElement('div', { className: 'pull-left' }, renderBreadCrumbs()), 
         _React['default'].createElement('button', { type: 'button', className: 'btn btn-link ', 
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
            eventHandler: dispatcher.dispatch })));



         function renderBreadCrumbs() {
            return [
            _React['default'].createElement('button', { key: _graphHelpers.PAGE_ID, type: 'button', className: 'btn btn-link page-inspector-breadcrumb', 
               onClick: function () {return enterCompositionInstance(null);} }, 
            _React['default'].createElement('i', { className: 'fa fa-home' }))].

            concat(compositionStack.map(function (id) {return (
                  activeComposition === id ? id : 
                  _React['default'].createElement('button', { key: id, type: 'button', className: 'btn btn-link page-inspector-breadcrumb', 
                     onClick: function () {return enterCompositionInstance(id);} }, id));}));}}




      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { onDomAvailable: function onDomAvailable() {
            domAvailable = true;
            render();} };}module.exports = 



   { 
      name: 'page-inspector-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UtaW5zcGVjdG9yLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRZSxpQkFBYyx5QkFBM0IsU0FBUyxDQUFJLGNBQWM7QUFDaEIsZUFBWSx5QkFBdkIsT0FBTyxDQUFJLFlBQVk7QUFDYixjQUFXLHlCQUFyQixNQUFNLENBQUksV0FBVztBQUNyQixRQUFLLEtBQUksVUFBVSxtQkFBVixVQUFVLEtBQWEsY0FBYyxtQkFBekIsT0FBTyxDQUFJLGNBQWM7QUFDOUMsV0FBUTtBQUNOLFVBQU8sS0FBSSxVQUFVLDhCQUFWLFVBQVUsS0FBRSxjQUFjLDhCQUFkLGNBQWM7QUFDckMsUUFBSyxLQUFJLFFBQVEsNEJBQVIsUUFBUSxLQUFFLFNBQVMsNEJBQVQsU0FBUyxLQUFFLFVBQVUsNEJBQVYsVUFBVTtBQUN4QyxnQkFBYSxzQkFBYixhQUFhOztBQUVmLGFBQVUseUJBQVYsVUFBVTtBQUNJLFFBQUsseUJBQW5CLFVBQVUsQ0FBSSxLQUFLOzs7O0FBSXJCLFlBQVMsTUFBTSxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFHOztBQUUvQyxVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixVQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7QUFFaEMsVUFBSSxxQkFBcUIsR0FBRyxLQUFLLENBQUM7QUFDbEMsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksb0JBQW9CLEdBQUcsS0FBSyxDQUFDOztBQUVqQyxVQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMxQixVQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsVUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7O0FBRTlCLDJCQUFTLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFO0FBQ3BDLGlDQUEyQixDQUFF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QUFRLEVBQUMsU0FBUyxFQUFDLHdDQUF3QztBQUN6RSw0QkFBTyxFQUFFLG9CQUFNLHdCQUF3QixDQUFFLEVBQUUsQ0FBRSxFQUFBLEFBQUMsSUFBRyxFQUFFLENBQVcsR0FBQSxDQUM1RSxDQUFFLENBQUMsQ0FDTCxDQUNIOzs7Ozs7O0FBSUQsYUFBTyxFQUFFLGNBQWMsRUFBRSwwQkFBTTtBQUM1Qix3QkFBWSxHQUFHLElBQUksQ0FBQztBQUNwQixrQkFBTSxFQUFFLENBQUMsQ0FDWCxFQUFFLENBQUMsQ0FDTjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUU7QUFDMUQsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJwYWdlLWluc3BlY3Rvci13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcblxuaW1wb3J0IHdpcmVmbG93IGZyb20gJ3dpcmVmbG93JztcblxuaW1wb3J0IHsgdHlwZXMsIGdyYXBoLCBsYXlvdXQsIGZpbHRlckZyb21TZWxlY3Rpb24sIFBBR0VfSUQgfSBmcm9tICcuL2dyYXBoLWhlbHBlcnMnO1xuXG5jb25zdCB7XG4gIHNlbGVjdGlvbjogeyBTZWxlY3Rpb25TdG9yZSB9LFxuICBoaXN0b3J5OiB7IEhpc3RvcnlTdG9yZSB9LFxuICBsYXlvdXQ6IHsgTGF5b3V0U3RvcmUgfSxcbiAgZ3JhcGg6IHsgR3JhcGhTdG9yZSwgYWN0aW9uczogeyBBY3RpdmF0ZVZlcnRleCB9IH0sXG4gIHNldHRpbmdzOiB7XG4gICAgYWN0aW9uczogeyBDaGFuZ2VNb2RlLCBNaW5pbWFwUmVzaXplZCB9LFxuICAgIG1vZGVsOiB7IFNldHRpbmdzLCBSRUFEX09OTFksIFJFQURfV1JJVEUgfSxcbiAgICBTZXR0aW5nc1N0b3JlXG4gIH0sXG4gIERpc3BhdGNoZXIsXG4gIGNvbXBvbmVudHM6IHsgR3JhcGggfVxufSA9IHdpcmVmbG93O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZSggY29udGV4dCwgZXZlbnRCdXMsIHJlYWN0UmVuZGVyICkge1xuXG4gICBsZXQgdmlzaWJsZSA9IGZhbHNlO1xuICAgbGV0IGRvbUF2YWlsYWJsZSA9IGZhbHNlO1xuICAgbGV0IHZpZXdNb2RlbCA9IG51bGw7XG4gICBsZXQgdmlld01vZGVsQ2FsY3VsYXRpb24gPSBudWxsO1xuXG4gICBsZXQgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gZmFsc2U7XG4gICBsZXQgd2l0aENvbnRhaW5lcnMgPSB0cnVlO1xuICAgbGV0IHdpdGhGbGF0Q29tcG9zaXRpb25zID0gZmFsc2U7XG5cbiAgIGxldCBjb21wb3NpdGlvblN0YWNrID0gW107XG4gICBsZXQgYWN0aXZlQ29tcG9zaXRpb24gPSBudWxsO1xuXG4gICBsZXQgcHVibGlzaGVkU2VsZWN0aW9uID0gbnVsbDtcblxuICAgcGF0dGVybnMucmVzb3VyY2VzLmhhbmRsZXJGb3IoIGNvbnRleHQgKVxuICAgICAgLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ3BhZ2VJbmZvJywge1xuICAgICAgICAgb25VcGRhdGVSZXBsYWNlOiAoKSA9PiBpbml0aWFsaXplVmlld01vZGVsKCB0cnVlIClcbiAgICAgIH0gKTtcblxuXG4gICBjb25zdCBwdWJsaXNoRmlsdGVyID0gcGF0dGVybnMucmVzb3VyY2VzLnJlcGxhY2VQdWJsaXNoZXJGb3JGZWF0dXJlKCBjb250ZXh0LCAnZmlsdGVyJywge1xuICAgICAgaXNPcHRpb25hbDogdHJ1ZVxuICAgfSApO1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoIGBkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eS4ke2NvbnRleHQud2lkZ2V0LmFyZWF9YCwgKGV2ZW50LCBtZXRhKSA9PiB7XG4gICAgICBpZiggIXZpc2libGUgJiYgZXZlbnQudmlzaWJsZSApIHtcbiAgICAgICAgIHZpc2libGUgPSB0cnVlO1xuICAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVwbGFjZUZpbHRlciggc2VsZWN0aW9uLCBncmFwaE1vZGVsICkge1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5yZXNvdXJjZTtcbiAgICAgIGlmKCAhcmVzb3VyY2UgfHwgc2VsZWN0aW9uID09PSBwdWJsaXNoZWRTZWxlY3Rpb24gKSB7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwdWJsaXNoZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb247XG4gICAgICBwdWJsaXNoRmlsdGVyKCBmaWx0ZXJGcm9tU2VsZWN0aW9uKCBzZWxlY3Rpb24sIGdyYXBoTW9kZWwgKSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHRvZ2dsZUlycmVsZXZhbnRXaWRnZXRzKCkge1xuICAgICAgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gIXdpdGhJcnJlbGV2YW50V2lkZ2V0cztcbiAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB0b2dnbGVDb250YWluZXJzKCkge1xuICAgICAgd2l0aENvbnRhaW5lcnMgPSAhd2l0aENvbnRhaW5lcnM7XG4gICAgICBpbml0aWFsaXplVmlld01vZGVsKCB0cnVlICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlQ29tcG9zaXRpb25zKCkge1xuICAgICAgd2l0aEZsYXRDb21wb3NpdGlvbnMgPSAhd2l0aEZsYXRDb21wb3NpdGlvbnM7XG4gICAgICBpbml0aWFsaXplVmlld01vZGVsKCB0cnVlICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gZW50ZXJDb21wb3NpdGlvbkluc3RhbmNlKCBpZCApIHtcbiAgICAgIGNvbnNvbGUubG9nKCAnYWN0aXZhdGU6ICcsIGlkICk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZCA/IGNvbXBvc2l0aW9uU3RhY2suaW5kZXhPZiggaWQgKSA6IDA7XG4gICAgICBpZiggY3VycmVudEluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgIGNvbXBvc2l0aW9uU3RhY2suc3BsaWNlKCBpZCA/IGN1cnJlbnRJbmRleCArIDEgOiAwLCBjb21wb3NpdGlvblN0YWNrLmxlbmd0aCAtIGN1cnJlbnRJbmRleCApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICBjb21wb3NpdGlvblN0YWNrLnB1c2goIGlkICk7XG4gICAgICB9XG4gICAgICBhY3RpdmVDb21wb3NpdGlvbiA9IGlkO1xuICAgICAgaW5pdGlhbGl6ZVZpZXdNb2RlbCggdHJ1ZSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGluaXRpYWxpemVWaWV3TW9kZWwoIGRvUmVzZXQgKSB7XG4gICAgICBpZiggZG9SZXNldCApIHtcbiAgICAgICAgIHZpZXdNb2RlbCA9IG51bGw7XG4gICAgICAgICBjbGVhclRpbWVvdXQoIHZpZXdNb2RlbENhbGN1bGF0aW9uICk7XG4gICAgICAgICB2aWV3TW9kZWxDYWxjdWxhdGlvbiA9IG51bGw7XG4gICAgICAgICBpZiggdmlzaWJsZSApIHtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiggdmlzaWJsZSApIHtcbiAgICAgICAgIC8vIHNldFRpbWVvdXQ6IHVzZWQgdG8gZW5zdXJlIHRoYXQgdGhlIGJyb3dzZXIgc2hvd3MgdGhlIHNwaW5uZXIgYmVmb3JlIHN0YWxsaW5nIGZvciBsYXlvdXRcbiAgICAgICAgIHZpZXdNb2RlbENhbGN1bGF0aW9uID0gdmlld01vZGVsQ2FsY3VsYXRpb24gfHwgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFnZVR5cGVzID0gdHlwZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VJbmZvID0gY29udGV4dC5yZXNvdXJjZXMucGFnZUluZm87XG4gICAgICAgICAgICBjb25zdCBwYWdlR3JhcGggPSBncmFwaCggcGFnZUluZm8sIHtcbiAgICAgICAgICAgICAgIHdpdGhJcnJlbGV2YW50V2lkZ2V0cyxcbiAgICAgICAgICAgICAgIHdpdGhDb250YWluZXJzLFxuICAgICAgICAgICAgICAgY29tcG9zaXRpb25EaXNwbGF5OiB3aXRoRmxhdENvbXBvc2l0aW9ucyA/ICdGTEFUJyA6ICdDT01QQUNUJyxcbiAgICAgICAgICAgICAgIGFjdGl2ZUNvbXBvc2l0aW9uXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICBjb25zdCBkaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoIHJlbmRlciApO1xuICAgICAgICAgICAgbmV3IEhpc3RvcnlTdG9yZSggZGlzcGF0Y2hlciApO1xuICAgICAgICAgICAgY29uc3QgZ3JhcGhTdG9yZSA9IG5ldyBHcmFwaFN0b3JlKCBkaXNwYXRjaGVyLCBwYWdlR3JhcGgsIHBhZ2VUeXBlcyApO1xuICAgICAgICAgICAgY29uc3QgbGF5b3V0U3RvcmUgPSBuZXcgTGF5b3V0U3RvcmUoIGRpc3BhdGNoZXIsIGdyYXBoU3RvcmUgKTtcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzU3RvcmUgPSBuZXcgU2V0dGluZ3NTdG9yZSggZGlzcGF0Y2hlciwgU2V0dGluZ3MoeyBtb2RlOiBSRUFEX09OTFkgfSkgKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvblN0b3JlID0gbmV3IFNlbGVjdGlvblN0b3JlKCBkaXNwYXRjaGVyLCBsYXlvdXRTdG9yZSwgZ3JhcGhTdG9yZSApO1xuXG4gICAgICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyKCBBY3RpdmF0ZVZlcnRleCwgKHsgdmVydGV4IH0pID0+IHtcbiAgICAgICAgICAgICAgIGlmKCB2ZXJ0ZXgua2luZCA9PT0gJ0NPTVBPU0lUSU9OJyApIHtcbiAgICAgICAgICAgICAgICAgIGVudGVyQ29tcG9zaXRpb25JbnN0YW5jZSggdmVydGV4LmlkICk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIHZpZXdNb2RlbCA9IHsgZ3JhcGhTdG9yZSwgbGF5b3V0U3RvcmUsIHNldHRpbmdzU3RvcmUsIHNlbGVjdGlvblN0b3JlLCBkaXNwYXRjaGVyIH07XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIH0sIDIwICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgaWYoICF2aXNpYmxlIHx8ICFkb21BdmFpbGFibGUgKSB7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmKCAhdmlld01vZGVsICkge1xuICAgICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFnZS1pbnNwZWN0b3ItcGxhY2Vob2xkZXInPlxuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLWNvZyBmYS1zcGluJz48L2k+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG4gICAgICAgICBpbml0aWFsaXplVmlld01vZGVsKCk7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgIGdyYXBoU3RvcmUsXG4gICAgICAgICBsYXlvdXRTdG9yZSxcbiAgICAgICAgIHNldHRpbmdzU3RvcmUsXG4gICAgICAgICBzZWxlY3Rpb25TdG9yZSxcbiAgICAgICAgIGRpc3BhdGNoZXJcbiAgICAgIH0gPSB2aWV3TW9kZWw7XG5cbiAgICAgIHJlcGxhY2VGaWx0ZXIoIHNlbGVjdGlvblN0b3JlLnNlbGVjdGlvbiwgZ3JhcGhTdG9yZS5ncmFwaCApO1xuXG5cbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhZ2UtaW5zcGVjdG9yLXJvdyBmb3JtLWlubGluZSc+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGV4dC1yaWdodCc+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHVsbC1sZWZ0Jz57IHJlbmRlckJyZWFkQ3J1bWJzKCkgfTwvZGl2PlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rICdcbiAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJJbmNsdWRlIHdpZGdldHMgd2l0aG91dCBhbnkgbGlua3MgdG8gcmVsZXZhbnQgdG9waWNzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUlycmVsZXZhbnRXaWRnZXRzfVxuICAgICAgICAgICAgICAgICAgPjxpIGNsYXNzTmFtZT17J2ZhIGZhLXRvZ2dsZS0nICsgKCB3aXRoSXJyZWxldmFudFdpZGdldHMgPyAnb24nIDogJ29mZicgKSB9XG4gICAgICAgICAgICAgICAgICA+PC9pPiA8c3Bhbj5Jc29sYXRlZCBXaWRnZXRzPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rJ1xuICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkluY2x1ZGUgYXJlYS1uZXN0aW5nIHJlbGF0aW9uc2hpcHM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlQ29udGFpbmVyc31cbiAgICAgICAgICAgICAgICAgID48aSBjbGFzc05hbWU9eydmYSBmYS10b2dnbGUtJyArICggd2l0aENvbnRhaW5lcnMgPyAnb24nIDogJ29mZicgKSB9XG4gICAgICAgICAgICAgICAgICA+PC9pPiA8c3Bhbj5Db250YWluZXJzPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rJ1xuICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkZsYXR0ZW4gY29tcG9zaXRpb25zIGludG8gdGhlaXIgcnVudGltZSBjb250ZW50cz9cIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVDb21wb3NpdGlvbnN9XG4gICAgICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsnZmEgZmEtdG9nZ2xlLScgKyAoIHdpdGhGbGF0Q29tcG9zaXRpb25zID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgICAgPjwvaT4gPHNwYW4+RmxhdHRlbiBDb21wb3NpdGlvbnM8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxHcmFwaCBjbGFzc05hbWU9J25iZS10aGVtZS1mdXNlYm94LWFwcCdcbiAgICAgICAgICAgICAgICAgICB0eXBlcz17Z3JhcGhTdG9yZS50eXBlc31cbiAgICAgICAgICAgICAgICAgICBtb2RlbD17Z3JhcGhTdG9yZS5ncmFwaH1cbiAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e2xheW91dFN0b3JlLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICBtZWFzdXJlbWVudHM9e2xheW91dFN0b3JlLm1lYXN1cmVtZW50c31cbiAgICAgICAgICAgICAgICAgICBzZXR0aW5ncz17c2V0dGluZ3NTdG9yZS5zZXR0aW5nc31cbiAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb249e3NlbGVjdGlvblN0b3JlLnNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICBldmVudEhhbmRsZXI9e2Rpc3BhdGNoZXIuZGlzcGF0Y2h9IC8+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckJyZWFkQ3J1bWJzKCkge1xuICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtQQUdFX0lEfSB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rIHBhZ2UtaW5zcGVjdG9yLWJyZWFkY3J1bWInXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGVudGVyQ29tcG9zaXRpb25JbnN0YW5jZSggbnVsbCApfT5cbiAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPSdmYSBmYS1ob21lJz48L2k+XG4gICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgXS5jb25jYXQoIGNvbXBvc2l0aW9uU3RhY2subWFwKCBpZCA9PlxuICAgICAgICAgICAgYWN0aXZlQ29tcG9zaXRpb24gPT09IGlkID8gaWQgOlxuICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2lkfSB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1saW5rIHBhZ2UtaW5zcGVjdG9yLWJyZWFkY3J1bWInXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGVudGVyQ29tcG9zaXRpb25JbnN0YW5jZSggaWQgKX0+eyBpZCB9PC9idXR0b24+XG4gICAgICAgICkgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4geyBvbkRvbUF2YWlsYWJsZTogKCkgPT4ge1xuICAgICAgZG9tQXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgIHJlbmRlcigpO1xuICAgfSB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAncGFnZS1pbnNwZWN0b3Itd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheEV2ZW50QnVzJywgJ2F4UmVhY3RSZW5kZXInIF0sXG4gICBjcmVhdGVcbn07XG4iXX0=
