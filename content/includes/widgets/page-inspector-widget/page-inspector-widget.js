/* jshint ignore:start */
define(['exports', 'module', 'react', 'laxar-patterns', 'wireflow', './graph-helpers'], function (exports, module, _react, _laxarPatterns, _wireflow, _graphHelpers) {'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _patterns = _interopRequireDefault(_laxarPatterns);var _wireflow2 = _interopRequireDefault(_wireflow);var 







   SelectionStore = _wireflow2['default'].selection.SelectionStore;var 
   HistoryStore = _wireflow2['default'].history.HistoryStore;var 
   LayoutStore = _wireflow2['default'].layout.LayoutStore;var 
   GraphStore = _wireflow2['default'].graph.GraphStore;var _wireflow$settings = _wireflow2['default'].
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
                  compositionDisplay: withFlatCompositions ? 'FLAT' : 'COMPACT' });

               var dispatcher = new Dispatcher(render);
               new HistoryStore(dispatcher);
               var graphStore = new GraphStore(dispatcher, pageGraph, pageTypes);
               var layoutStore = new LayoutStore(dispatcher, graphStore);
               var settingsStore = new SettingsStore(dispatcher, Settings({ mode: READ_ONLY }));
               var selectionStore = new SelectionStore(dispatcher, layoutStore, graphStore);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UtaW5zcGVjdG9yLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRZSxpQkFBYyx5QkFBM0IsU0FBUyxDQUFJLGNBQWM7QUFDaEIsZUFBWSx5QkFBdkIsT0FBTyxDQUFJLFlBQVk7QUFDYixjQUFXLHlCQUFyQixNQUFNLENBQUksV0FBVztBQUNaLGFBQVUseUJBQW5CLEtBQUssQ0FBSSxVQUFVO0FBQ25CLFdBQVE7QUFDTixVQUFPLEtBQUksVUFBVSw4QkFBVixVQUFVLEtBQUUsY0FBYyw4QkFBZCxjQUFjO0FBQ3JDLFFBQUssS0FBSSxRQUFRLDRCQUFSLFFBQVEsS0FBRSxTQUFTLDRCQUFULFNBQVMsS0FBRSxVQUFVLDRCQUFWLFVBQVU7QUFDeEMsZ0JBQWEsc0JBQWIsYUFBYTs7QUFFZixhQUFVLHlCQUFWLFVBQVU7QUFDSSxRQUFLLHlCQUFuQixVQUFVLENBQUksS0FBSzs7OztBQUlyQixZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRzs7QUFFL0MsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN6QixVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsVUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7O0FBRWhDLFVBQUkscUJBQXFCLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLFVBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixVQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQzs7QUFFakMsVUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7O0FBRTlCLDJCQUFTLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFO0FBQ3BDLGlDQUEyQixDQUFFLFVBQVUsRUFBRTtBQUN2Qyx3QkFBZSxFQUFFLG1DQUFNLG1CQUFtQixDQUFFLElBQUksQ0FBRSxFQUFBLEVBQ3BELENBQUUsQ0FBQzs7OztBQUdQLFVBQU0sYUFBYSxHQUFH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LXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgcGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuXG5pbXBvcnQgd2lyZWZsb3cgZnJvbSAnd2lyZWZsb3cnO1xuXG5pbXBvcnQgeyB0eXBlcywgZ3JhcGgsIGxheW91dCwgZmlsdGVyRnJvbVNlbGVjdGlvbiB9IGZyb20gJy4vZ3JhcGgtaGVscGVycyc7XG5cbmNvbnN0IHtcbiAgc2VsZWN0aW9uOiB7IFNlbGVjdGlvblN0b3JlIH0sXG4gIGhpc3Rvcnk6IHsgSGlzdG9yeVN0b3JlIH0sXG4gIGxheW91dDogeyBMYXlvdXRTdG9yZSB9LFxuICBncmFwaDogeyBHcmFwaFN0b3JlIH0sXG4gIHNldHRpbmdzOiB7XG4gICAgYWN0aW9uczogeyBDaGFuZ2VNb2RlLCBNaW5pbWFwUmVzaXplZCB9LFxuICAgIG1vZGVsOiB7IFNldHRpbmdzLCBSRUFEX09OTFksIFJFQURfV1JJVEUgfSxcbiAgICBTZXR0aW5nc1N0b3JlXG4gIH0sXG4gIERpc3BhdGNoZXIsXG4gIGNvbXBvbmVudHM6IHsgR3JhcGggfVxufSA9IHdpcmVmbG93O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZSggY29udGV4dCwgZXZlbnRCdXMsIHJlYWN0UmVuZGVyICkge1xuXG4gICBsZXQgdmlzaWJsZSA9IGZhbHNlO1xuICAgbGV0IGRvbUF2YWlsYWJsZSA9IGZhbHNlO1xuICAgbGV0IHZpZXdNb2RlbCA9IG51bGw7XG4gICBsZXQgdmlld01vZGVsQ2FsY3VsYXRpb24gPSBudWxsO1xuXG4gICBsZXQgd2l0aElycmVsZXZhbnRXaWRnZXRzID0gZmFsc2U7XG4gICBsZXQgd2l0aENvbnRhaW5lcnMgPSB0cnVlO1xuICAgbGV0IHdpdGhGbGF0Q29tcG9zaXRpb25zID0gZmFsc2U7XG5cbiAgIGxldCBwdWJsaXNoZWRTZWxlY3Rpb24gPSBudWxsO1xuXG4gICBwYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApXG4gICAgICAucmVnaXN0ZXJSZXNvdXJjZUZyb21GZWF0dXJlKCAncGFnZUluZm8nLCB7XG4gICAgICAgICBvblVwZGF0ZVJlcGxhY2U6ICgpID0+IGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKVxuICAgICAgfSApO1xuXG5cbiAgIGNvbnN0IHB1Ymxpc2hGaWx0ZXIgPSBwYXR0ZXJucy5yZXNvdXJjZXMucmVwbGFjZVB1Ymxpc2hlckZvckZlYXR1cmUoIGNvbnRleHQsICdmaWx0ZXInLCB7XG4gICAgICBpc09wdGlvbmFsOiB0cnVlXG4gICB9ICk7XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggYGRpZENoYW5nZUFyZWFWaXNpYmlsaXR5LiR7Y29udGV4dC53aWRnZXQuYXJlYX1gLCAoZXZlbnQsIG1ldGEpID0+IHtcbiAgICAgIGlmKCAhdmlzaWJsZSAmJiBldmVudC52aXNpYmxlICkge1xuICAgICAgICAgdmlzaWJsZSA9IHRydWU7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZXBsYWNlRmlsdGVyKCBzZWxlY3Rpb24sIGdyYXBoTW9kZWwgKSB7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLnJlc291cmNlO1xuICAgICAgaWYoICFyZXNvdXJjZSB8fCBzZWxlY3Rpb24gPT09IHB1Ymxpc2hlZFNlbGVjdGlvbiApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHB1Ymxpc2hlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgICAgIHB1Ymxpc2hGaWx0ZXIoIGZpbHRlckZyb21TZWxlY3Rpb24oIHNlbGVjdGlvbiwgZ3JhcGhNb2RlbCApICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlSXJyZWxldmFudFdpZGdldHMoKSB7XG4gICAgICB3aXRoSXJyZWxldmFudFdpZGdldHMgPSAhd2l0aElycmVsZXZhbnRXaWRnZXRzO1xuICAgICAgaW5pdGlhbGl6ZVZpZXdNb2RlbCggdHJ1ZSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHRvZ2dsZUNvbnRhaW5lcnMoKSB7XG4gICAgICB3aXRoQ29udGFpbmVycyA9ICF3aXRoQ29udGFpbmVycztcbiAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB0b2dnbGVDb21wb3NpdGlvbnMoKSB7XG4gICAgICB3aXRoRmxhdENvbXBvc2l0aW9ucyA9ICF3aXRoRmxhdENvbXBvc2l0aW9ucztcbiAgICAgIGluaXRpYWxpemVWaWV3TW9kZWwoIHRydWUgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBpbml0aWFsaXplVmlld01vZGVsKCBkb1Jlc2V0ICkge1xuICAgICAgaWYoIGRvUmVzZXQgKSB7XG4gICAgICAgICB2aWV3TW9kZWwgPSBudWxsO1xuICAgICAgICAgY2xlYXJUaW1lb3V0KCB2aWV3TW9kZWxDYWxjdWxhdGlvbiApO1xuICAgICAgICAgdmlld01vZGVsQ2FsY3VsYXRpb24gPSBudWxsO1xuICAgICAgICAgaWYoIHZpc2libGUgKSB7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoIHZpc2libGUgKSB7XG4gICAgICAgICAvLyBzZXRUaW1lb3V0OiB1c2VkIHRvIGVuc3VyZSB0aGF0IHRoZSBicm93c2VyIHNob3dzIHRoZSBzcGlubmVyIGJlZm9yZSBzdGFsbGluZyBmb3IgbGF5b3V0XG4gICAgICAgICB2aWV3TW9kZWxDYWxjdWxhdGlvbiA9IHZpZXdNb2RlbENhbGN1bGF0aW9uIHx8IHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VUeXBlcyA9IHR5cGVzKCk7XG4gICAgICAgICAgICBjb25zdCBwYWdlSW5mbyA9IGNvbnRleHQucmVzb3VyY2VzLnBhZ2VJbmZvO1xuICAgICAgICAgICAgY29uc3QgcGFnZUdyYXBoID0gZ3JhcGgoIHBhZ2VJbmZvLCB7XG4gICAgICAgICAgICAgICB3aXRoSXJyZWxldmFudFdpZGdldHMsXG4gICAgICAgICAgICAgICB3aXRoQ29udGFpbmVycyxcbiAgICAgICAgICAgICAgIGNvbXBvc2l0aW9uRGlzcGxheTogd2l0aEZsYXRDb21wb3NpdGlvbnMgPyAnRkxBVCcgOiAnQ09NUEFDVCdcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlciggcmVuZGVyICk7XG4gICAgICAgICAgICBuZXcgSGlzdG9yeVN0b3JlKCBkaXNwYXRjaGVyICk7XG4gICAgICAgICAgICBjb25zdCBncmFwaFN0b3JlID0gbmV3IEdyYXBoU3RvcmUoIGRpc3BhdGNoZXIsIHBhZ2VHcmFwaCwgcGFnZVR5cGVzICk7XG4gICAgICAgICAgICBjb25zdCBsYXlvdXRTdG9yZSA9IG5ldyBMYXlvdXRTdG9yZSggZGlzcGF0Y2hlciwgZ3JhcGhTdG9yZSApO1xuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3NTdG9yZSA9IG5ldyBTZXR0aW5nc1N0b3JlKCBkaXNwYXRjaGVyLCBTZXR0aW5ncyh7IG1vZGU6IFJFQURfT05MWSB9KSApO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uU3RvcmUgPSBuZXcgU2VsZWN0aW9uU3RvcmUoIGRpc3BhdGNoZXIsIGxheW91dFN0b3JlLCBncmFwaFN0b3JlICk7XG5cbiAgICAgICAgICAgIHZpZXdNb2RlbCA9IHsgZ3JhcGhTdG9yZSwgbGF5b3V0U3RvcmUsIHNldHRpbmdzU3RvcmUsIHNlbGVjdGlvblN0b3JlLCBkaXNwYXRjaGVyIH07XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIH0sIDIwICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgaWYoICF2aXNpYmxlIHx8ICFkb21BdmFpbGFibGUgKSB7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmKCAhdmlld01vZGVsICkge1xuICAgICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFnZS1pbnNwZWN0b3ItcGxhY2Vob2xkZXInPlxuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLWNvZyBmYS1zcGluJz48L2k+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG4gICAgICAgICBpbml0aWFsaXplVmlld01vZGVsKCk7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgIGdyYXBoU3RvcmUsXG4gICAgICAgICBsYXlvdXRTdG9yZSxcbiAgICAgICAgIHNldHRpbmdzU3RvcmUsXG4gICAgICAgICBzZWxlY3Rpb25TdG9yZSxcbiAgICAgICAgIGRpc3BhdGNoZXJcbiAgICAgIH0gPSB2aWV3TW9kZWw7XG5cbiAgICAgIHJlcGxhY2VGaWx0ZXIoIHNlbGVjdGlvblN0b3JlLnNlbGVjdGlvbiwgZ3JhcGhTdG9yZS5ncmFwaCApO1xuXG5cbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhZ2UtaW5zcGVjdG9yLXJvdyBmb3JtLWlubGluZSc+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGV4dC1yaWdodCc+XG4gICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdidG4gYnRuLWxpbmsnXG4gICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiSW5jbHVkZSB3aWRnZXRzIHdpdGhvdXQgYW55IGxpbmtzIHRvIHJlbGV2YW50IHRvcGljcz9cIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVJcnJlbGV2YW50V2lkZ2V0c31cbiAgICAgICAgICAgICAgICAgID48aSBjbGFzc05hbWU9eydmYSBmYS10b2dnbGUtJyArICggd2l0aElycmVsZXZhbnRXaWRnZXRzID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgICAgPjwvaT4gPHNwYW4+SXNvbGF0ZWQgV2lkZ2V0czwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tbGluaydcbiAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJJbmNsdWRlIGFyZWEtbmVzdGluZyByZWxhdGlvbnNoaXBzP1wiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUNvbnRhaW5lcnN9XG4gICAgICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsnZmEgZmEtdG9nZ2xlLScgKyAoIHdpdGhDb250YWluZXJzID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgICAgPjwvaT4gPHNwYW4+Q29udGFpbmVyczwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tbGluaydcbiAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJGbGF0dGVuIGNvbXBvc2l0aW9ucyBpbnRvIHRoZWlyIHJ1bnRpbWUgY29udGVudHM/XCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlQ29tcG9zaXRpb25zfVxuICAgICAgICAgICAgICAgICAgPjxpIGNsYXNzTmFtZT17J2ZhIGZhLXRvZ2dsZS0nICsgKCB3aXRoRmxhdENvbXBvc2l0aW9ucyA/ICdvbicgOiAnb2ZmJyApIH1cbiAgICAgICAgICAgICAgICAgID48L2k+IDxzcGFuPkZsYXR0ZW4gQ29tcG9zaXRpb25zPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8R3JhcGggY2xhc3NOYW1lPSduYmUtdGhlbWUtZnVzZWJveC1hcHAnXG4gICAgICAgICAgICAgICAgICAgdHlwZXM9e2dyYXBoU3RvcmUudHlwZXN9XG4gICAgICAgICAgICAgICAgICAgbW9kZWw9e2dyYXBoU3RvcmUuZ3JhcGh9XG4gICAgICAgICAgICAgICAgICAgbGF5b3V0PXtsYXlvdXRTdG9yZS5sYXlvdXR9XG4gICAgICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRzPXtsYXlvdXRTdG9yZS5tZWFzdXJlbWVudHN9XG4gICAgICAgICAgICAgICAgICAgc2V0dGluZ3M9e3NldHRpbmdzU3RvcmUuc2V0dGluZ3N9XG4gICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uPXtzZWxlY3Rpb25TdG9yZS5zZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyPXtkaXNwYXRjaGVyLmRpc3BhdGNofSAvPlxuICAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7IG9uRG9tQXZhaWxhYmxlOiAoKSA9PiB7XG4gICAgICBkb21BdmFpbGFibGUgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICB9IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdwYWdlLWluc3BlY3Rvci13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4RXZlbnRCdXMnLCAnYXhSZWFjdFJlbmRlcicgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
