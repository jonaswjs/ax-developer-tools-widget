define(['exports', 'module', 'react', 'laxar-patterns'], function (exports, module, _react, _laxarPatterns) {/**
                                                                                                              * Copyright 2016 aixigo AG
                                                                                                              * Released under the MIT license.
                                                                                                              * http://www.laxarjs.org
                                                                                                              */'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);





   //   '../../lib/laxar-developer-tools/grid',
   //   '../../lib/laxar-developer-tools/widget-outline'


   /* global chrome */
   // This controller performs heavy DOM-manipulation, which you would normally put into a directive.
   // However, only the DOM of the host application is manipulated, so this is acceptable.


   function create(context, eventBus, reactRender) {
      'use strict';
      var visible = false;
      var HINT_NO_LAXAR_EXTENSION = 'Reload page to enable LaxarJS developer tools!';
      var HINT_DISABLE_TOGGLE_GRID = 'Configure grid settings in application to enable this feature!';
      var HINT_NO_LAXAR_ANYMORE_WIDGET = 'Cannot access LaxarJS host window (or tab).' + 
      ' Reopen laxar-developer-tools from LaxarJS host window.';
      var HINT_CONFIGURE_GRID = 'Configure grid settings in application to enable this feature!';

      var TABS = [
      { name: 'events', label: 'Events' }, 
      { name: 'page', label: 'Page' }, 
      { name: 'log', label: 'Log' }];


      var model = { 
         laxar: true, 
         tabs: TABS, 
         activeTab: null, 
         gridOverlay: false, 
         widgetOverlay: false, 
         toggleGridTitle: HINT_DISABLE_TOGGLE_GRID, 
         noLaxar: HINT_NO_LAXAR_EXTENSION };


      /*
      var isBrowserWebExtension = ( window.chrome && chrome.runtime && chrome.runtime.id );
      var firefoxExtensionMessagePort;
       if( !window.opener ) {
         window.addEventListener( 'message', function( event ) {
            if( !firefoxExtensionMessagePort && event.ports ) {
               model.noLaxar = HINT_NO_LAXAR_EXTENSION;
               firefoxExtensionMessagePort = event.ports[ 0 ];
               firefoxExtensionMessagePort.start();
               var message = { text: 'messagePortStarted' };
               firefoxExtensionMessagePort.postMessage( JSON.stringify( message ) );
            } else {
               var channel = JSON.parse( event.detail || event.data );
               if( channel.text === 'reloadedPage' ) {
                  model.gridOverlay = false;
                  model.widgetOverlay = false;
                  $scope.$apply();
               }
            }
         } );
      }
      */

      context.resources = {};
      /*
      
         if( window.opener ) {
            model.noLaxar = HINT_NO_LAXAR_ANYMORE_WIDGET;
         }
      */
      _axPatterns['default'].resources.handlerFor(context).registerResourceFromFeature(
      'grid', 
      { 
         onReplace: function onReplace(event) {
            if (event.data === null) {
               model.toggleGridTitle = HINT_CONFIGURE_GRID;
               model.gridOverlay = false;} else 

            {
               model.toggleGridTitle = '';}} });





      _axPatterns['default'].flags.handlerFor(context).registerFlag(context.features.detailsOn, { 
         initialState: model.laxar, 
         onChange: function onChange(newState) {
            model.laxar = newState;} });


      /*
         if( isBrowserWebExtension ) {
            chrome.devtools.network.onNavigated.addListener( function() {
               model.gridOverlay = false;
               model.widgetOverlay = false;
               $scope.$apply();
            } );
         }
      */
      _axPatterns['default'].visibility.handlerFor(context, { onAnyAreaRequest: function onAnyAreaRequest(event) {
            var prefix = context.id() + '.';
            var activeTab = model.activeTab;
            return event.visible && activeTab !== null && event.area === prefix + activeTab.name;} });


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      eventBus.subscribe('didNavigate', function (event) {
         var newName = event.data[context.features.tabs.parameter];
         var newTab = TABS.filter(function (_) {return _.name === newName;})[0];
         if (!newTab) {
            return;}



         if (model.activeTab !== newTab) {
            publishVisibility(model.activeTab, false);
            publishVisibility(newTab, true);}

         model.activeTab = newTab;

         function publishVisibility(tab, visible) {
            if (tab) {
               var area = context.id() + '.' + tab.name;
               _axPatterns['default'].visibility.requestPublisherForArea(context, area)(visible);}}});




      eventBus.subscribe('didChangeAreaVisibility.' + context.widget.area, function (event, meta) {
         if (!visible && event.visible) {
            visible = true;
            render();}});



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      eventBus.subscribe('takeActionRequest.navigation', function (event) {
         eventBus.publish('willTakeAction.navigation', { 
            action: 'navigation' });

         if (model.gridOverlay) {
            toggleGrid();}

         if (model.widgetOverlay) {
            toggleWidgetOutline();}

         eventBus.publish('didTakeAction.navigation', { 
            action: 'navigation' });});



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function activateTab(tab) {
         var data = {};
         data[context.features.tabs.parameter] = tab.name;
         eventBus.publish('navigateRequest._self', { 
            target: '_self', 
            data: data });}

      ;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function onClickToggleGrid() {
         if (!context.resources.grid) {return;}
         toggleGrid();
         model.gridOverlay = !model.gridOverlay;}
      ;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function onClickToggleWidgetOutline() {
         toggleWidgetOutline();
         model.widgetOverlay = !model.widgetOverlay;}
      ;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleGrid() {
         if (window.opener) {
            /* global axDeveloperToolsToggleGrid */
            //axDeveloperToolsToggleGrid( context.resources.grid );
            return;}

         if (isBrowserWebExtension) {
            var event;
            event = new CustomEvent('toogleGrid', { 
               detail: JSON.stringify(context.resources.grid) });

            window.dispatchEvent(event);} else 

         if (firefoxExtensionMessagePort) {
            var message = { text: 'toogleGrid', data: context.resources.grid };
            firefoxExtensionMessagePort.postMessage(JSON.stringify(message));}}



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleWidgetOutline() {
         if (window.opener) {
            /* global axDeveloperToolsToggleWidgetOutline */
            //axDeveloperToolsToggleWidgetOutline();
            return;}

         if (isBrowserWebExtension) {
            var event;
            event = new CustomEvent('widgetOutline', {});
            window.dispatchEvent(event);} else 

         if (firefoxExtensionMessagePort) {
            var message = { text: 'widgetOutline', data: {} };
            firefoxExtensionMessagePort.postMessage(JSON.stringify(message));}}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {

         function renderButtons() {
            if (model.laxar) {
               return _React['default'].createElement('div', { className: 'pull-right' }, ' ', renderGridButton(), ' ', renderWidgetOutlineButton(), ' ');}

            return;}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderGridButton() {
            if (context.resources.grid) {
               return _React['default'].createElement('button', { className: 'btn btn-link', 
                  title: model.toggleGridTitle, 
                  type: 'button', 
                  onClick: onClickToggleGrid() }, 
               _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.gridOverlay ? 'on' : 'off') }), ' ', 
               model.gridOverlay ? 'Turn off grid overlay' : 'Turn on grid overlay');}

            return;}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderWidgetOutlineButton() {
            return _React['default'].createElement('button', { className: 'btn btn-link', type: 'button', onClick: onClickToggleWidgetOutline() }, _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.widgetOverlay ? 'on' : 'off') }), ' ', model.widgetOverlay ? 'Turn off widget outline' : 'Turn on widget outline');}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderTabs() {
            if (!model.laxar) {return;}
            var tab = model.tabs.find(function (tab) {return model.activeTab === tab;});
            var name = tab ? tab.name : 'noTab';
            return (
               _React['default'].createElement('div', { className: 'app-tab app-tab-page', 
                  'data-ax-widget-area': name }));}





         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         var tabListItems = model.tabs.map(function (tab) {return (
               _React['default'].createElement('li', { 
                  className: model.activeTab && model.activeTab.name === tab.name ? 'ax-active' : '', 
                  key: tab.name }, 
               _React['default'].createElement('a', { href: '', onClick: activateTab(tab) }, tab.label)));});


         var renderNavTab = _React['default'].createElement('ul', { className: 'nav nav-tabs', 
            role: 'tablist' }, 
         _React['default'].createElement('li', null, _React['default'].createElement('a', { className: 'developer-toolbar-icon', 
            title: 'LaxarJS Documentation', 
            href: 'http://www.laxarjs.org/docs', 
            target: '_blank' })), 

         tabListItems, 
         model.laxar === false && 
         _React['default'].createElement('li', { className: 'developer-toolbar-hint' }, model.noLaxar));



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         reactRender(
         _React['default'].createElement('div', null, 
         renderButtons(), 
         renderNavTab, 
         renderTabs()));}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 




   { 
      name: 'developer-toolbar-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUM5QyxrQkFBWSxDQUFDO0FBQ2IsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksdUJBQXVCLEdBQUcsZ0RBQWdELENBQUM7QUFDL0UsVUFBSSx3QkFBd0IsR0FBRyxnRUFBZ0UsQ0FBQztBQUNoRyxVQUFJLDRCQUE0QixHQUFHLDZDQUE2QztBQUM1QywrREFBeUQsQ0FBQztBQUM5RixVQUFJLG1CQUFtQixHQUFHLGdFQUFnRSxDQUFDOztBQUUzRixVQUFJLElBQUksR0FBRztBQUNSLFFBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ25DLFFBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQy9CLFFBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQy9CLENBQUM7OztBQUVGLFVBQUksS0FBSyxHQUFHO0FBQ1QsY0FBSyxFQUFFLElBQUk7QUFDWCxhQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFTLEVBQUUsSUFBSTtBQUNmLG9CQUFXLEVBQUUsS0FBSztBQUNsQixzQkFBYSxFQUFFLEtBQUs7QUFDcEIsd0JBQWUsRUFBRSx3QkFBd0I7QUFDekMsZ0JBQU8sRUFBRSx1QkFBdUIsRUFDbEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkYsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPdkIsNkJBQVcsU0FBUyxDQUFDLFVBQVUsQ0FBRSxPQUFPLENBQUUsQ0FBQywyQkFBMkI7QUFDbkUsWUFBTTtBQUNOO0FBQ0csa0JBQVMsRUFBRSxtQkFBVSxLQUFLLEVBQUc7QUFDMUIsZ0JBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUc7QUFDdkIsb0JBQUssQ0FBQyxlQUFlLEdBQUcsbUJBQW1CLENBQUM7QUFDNUMsb0JBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQzVCOztBQUNJO0FBQ0Ysb0JBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQzdCLENBQ0gsRUFDSCxDQUNILENBQUM7Ozs7OztBQUVGLDZCQUFXLEtBQUssQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsWUFBWSxDQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQzlFLHFCQUFZLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDekIsaUJBQVEsRUFBRSxrQkFBVSxRQUFRLEVBQUc7QUFDNUIsaUJBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQ3pCLEVBQ0gsQ0FBRSxDQUFDOzs7Ozs7Ozs7Ozs7QUFVSiw2QkFBVyxVQUFVLENBQUMsVUFBVSxDQUFFLE9BQU8sRUFBRSxFQUFFLGdCQUFnQixFQUFFLDBCQUFVLEtBQUssRUFBRztBQUM5RSxnQkFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNoQyxnQkFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUNoQyxtQkFBTyxLQUFLLENBQUMsT0FBTyxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUN2RixFQUFFLENBQUUsQ0FBQzs7Ozs7QUFJTixjQUFRLENBQUMsU0FBUyxDQUFFLGFBQWEsRUFBRSxVQUFVLEtBQUssRUFBRztBQUNsRCxhQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO0FBQzVELGFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFDLEVBQUcsQ0FBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUUsQ0FBRSxDQUFFLENBQUMsQ0FBRSxDQUFDO0FBQzlFLGFBQUksQ0FBQyxNQUFNLEVBQUc7QUFDWCxtQkFBTyxDQUNUOzs7O0FBR0QsYUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRztBQUM5Qiw2QkFBaUIsQ0FBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBRSxDQUFDO0FBQzVDLDZCQUFpQixDQUFFLE1BQU0sRUFBRSxJQUFJLENBQUUsQ0FBQyxDQUNwQzs7QUFDRCxjQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQzs7QUFFekIsa0JBQVMsaUJBQWlCLENBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRztBQUN4QyxnQkFBSSxHQUFHLEVBQUc7QUFDUCxtQkFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3pDLHNDQUFXLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFLENBQUUsT0FBTyxDQUFFLENBQUMsQ0FDNUUsQ0FDSCxDQUNILENBQUUsQ0FBQzs7Ozs7QUFFSixjQUFRLENBQUMsU0FBUyw4QkFBNkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUksVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFLO0FBQ3JGLGFBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRztBQUM3QixtQkFBTyxHQUFHLElBQUksQ0FBQztBQUNmLGtCQUFNLEVBQUUsQ0FBQyxDQUNYLENBQ0gsQ0FBRSxDQUFDOzs7Ozs7QUFJSCxjQUFRLENBQUMsU0FBUyxDQUFFLDhCQUE4QixFQUFFLFVBQVUsS0FBSyxFQUFHO0FBQ25FLGlCQUFRLENBQUMsT0FBTyxDQUFFLDJCQUEyQixFQUFFO0FBQzVDLGtCQUFNLEVBQUUsWUFBWSxFQUN0QixDQUFFLENBQUM7O0FBQ0osYUFBSSxLQUFLLENBQUMsV0FBVyxFQUFHO0FBQ3JCLHNCQUFVLEVBQUUsQ0FBQyxDQUNmOztBQUNELGFBQUksS0FBSyxDQUFDLGFBQWEsRUFBRztBQUN2QiwrQkFBbUIsRUFBRSxDQUFDLENBQ3hCOztBQUNELGlCQUFRLENBQUMsT0FBTyxDQUFFLDBCQUEwQixFQUFFO0FBQzNDLGtCQUFNLEVBQUUsWUFBWSxFQUN0QixDQUFFLENBQUMsQ0FDTixDQUFFLENBQUM7Ozs7OztBQUlKLGVBQVMsV0FBVyxDQUFFLEdBQUcsRUFBRztBQUN6QixhQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxhQUFJLENBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUNuRCxpQkFBUSxDQUFDLE9BQU8sQ0FBRSx1QkFBdUIsRUFBRTtBQUN4QyxrQkFBTSxFQUFFLE9BQU87QUFDZixnQkFBSSxFQUFFLElBQUksRUFDWixDQUFFLENBQUMsQ0FDTjs7QUFBQSxPQUFDOzs7O0FBSUYsZUFBUyxpQkFBaUIsR0FBRztBQUMxQixhQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBRSxPQUFPLENBQUU7QUFDeEMsbUJBQVUsRUFBRSxDQUFDO0FBQ2IsY0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FDekM7QUFBQSxPQUFDOzs7O0FBSUYsZUFBUywwQkFBMEIsR0FBRztBQUNuQyw0QkFBbUIsRUFBRSxDQUFDO0FBQ3RCLGNBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQzdDO0FBQUEsT0FBQzs7OztBQUlGLGVBQVMsVUFBVSxHQUFHO0FBQ25CLGFBQUksTUFBTSxDQUFDLE1BQU0sRUFBRzs7O0FBR2pCLG1CQUFPLENBQ1Q7O0FBQ0QsYUFBSSxxQkFBcUIsRUFBRztBQUN6QixnQkFBSSxLQUFLLENBQUM7QUFDVixpQkFBSyxHQUFHLElBQUksV0FBVyxDQUFFLFlBQVksRUFBRTtBQUNwQyxxQkFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUUsRUFDbEQsQ0FBRSxDQUFDOztBQUNKLGtCQUFNLENBQUMsYUFBYSxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQ2hDOztBQUNJLGFBQUksMkJBQTJCLEVBQUc7QUFDcEMsZ0JBQUksT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuRSx1Q0FBMkIsQ0FBQyxXQUFXLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxPQUFPLENBQUUsQ0FBRSxDQUFDLENBQ3ZFLENBQ0g7Ozs7OztBQUlELGVBQVMsbUJBQW1CLEdBQUc7QUFDNUIsYUFBSSxNQUFNLENBQUMsTUFBTSxFQUFHOzs7QUFHakIsbUJBQU8sQ0FDVDs7QUFDRCxhQUFJLHFCQUFxQixFQUFHO0FBQ3pCLGdCQUFJLEtBQUssQ0FBQztBQUNWLGlCQUFLLEdBQUcsSUFBSSxXQUFXLENBQUUsZUFBZSxFQUFFLEVBQUcsQ0FBRSxDQUFDO0FBQ2hELGtCQUFNLENBQUMsYUFBYSxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQ2hDOztBQUNJLGFBQUksMkJBQTJCLEVBQUc7QUFDcEMsZ0JBQUksT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDbEQsdUNBQTJCLENBQUMsV0FBVyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsT0FBTyxDQUFFLENBQUUsQ0FBQyxDQUN2RSxDQUNIOzs7Ozs7QUFJRCxlQUFTLE1BQU0sR0FBRzs7QUFFZixrQkFBUyxhQUFhLEdBQUc7QUFDdEIsZ0JBQUksS0FBSyxDQUFDLEtBQUssRUFBRztBQUNmLHNCQUFPLHlDQUFLLFNBQVMsRUFBQyxZQUFZLFNBQUksZ0JBQWdCLEVBQUUsT0FBSyx5QkFBeUIsRUFBRSxNQUFTLENBQUMsQ0FDcEc7O0FBQ0QsbUJBQU8sQ0FDVDs7Ozs7QUFJRCxrQkFBUyxnQkFBZ0IsR0FBRztBQUN6QixnQkFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRztBQUMxQixzQkFBTyw0Q0FBUSxTQUFTLEVBQUMsY0FBYztBQUMvQix1QkFBSyxFQUFFLEtBQUssQ0FBQyxlQUFlLEFBQUM7QUFDN0Isc0JBQUksRUFBQyxRQUFRO0FBQ2IseUJBQU8sRUFBRSxpQkFBaUIsRUFBRSxBQUFDO0FBQ2pDLHNEQUFHLFNBQVMsRUFBRyxlQUFlLElBQUssS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFBLEFBQUUsQUFBRSxHQUNuRTtBQUFPLG9CQUFLLENBQUMsV0FBVyxHQUFHLHVCQUF1QixHQUFHLHNCQUFzQixDQUFVLENBQUMsQ0FDaEc7O0FBQ0QsbUJBQU8sQ0FDVDs7Ozs7QUFJRCxrQkFBUyx5QkFBeUIsR0FBRztBQUNsQyxtQkFBTyw0Q0FBUSxTQUFTLEVBQUMsY0FBYyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEFBQUMsSUFBQyx1Q0FBRyxTQUFTLEVBQUcsZUFBZSxJQUFLLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQSxBQUFFLEFBQUUsR0FBSyxPQUFPLEtBQUssQ0FBQyxhQUFhLEdBQUcseUJBQXlCLEdBQUcsd0JBQXdCLENBQVUsQ0FBQyxDQUN6UTs7Ozs7QUFJRCxrQkFBUyxVQUFVLEdBQUc7QUFDbkIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFHLENBQUUsT0FBTyxDQUFFO0FBQzlCLGdCQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFFLEdBQUcsVUFBTSxLQUFLLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBQSxDQUFFLENBQUM7QUFDbEUsZ0JBQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUN0QztBQUNHLHdEQUFLLFNBQVMsRUFBQyxzQkFBc0I7QUFDN0IseUNBQXFCLElBQUksQUFBQyxHQUM1QixFQUVQLENBQ0o7Ozs7Ozs7O0FBSUQsYUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBRSxHQUFHO0FBQ3BDO0FBQ0EsMkJBQVMsRUFBSyxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxHQUFFLEVBQUUsQUFBSTtBQUN4RixxQkFBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEFBQUM7QUFDYixzREFBRyxJQUFJLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLENBQUUsR0FBRyxDQUFFLEFBQUMsSUFBRSxHQUFHLENBQUMsS0FBSyxDQUFLLENBQUssR0FBQSxDQUMvRCxDQUFDOzs7QUFFTCxhQUFNLFlBQVksR0FBRyx3Q0FBSyxTQUFTLEVBQUMsY0FBYztBQUNuQyxnQkFBSSxFQUFDLFNBQVM7QUFDdkIscURBQUksdUNBQUcsU0FBUyxFQUFDLHdCQUF3QjtBQUNsQyxpQkFBSyxFQUFDLHVCQUF1QjtBQUM3QixnQkFBSSxFQUFDLDZCQUE2QjtBQUNsQyxrQkFBTSxFQUFDLFFBQVEsR0FBSyxDQUN0Qjs7QUFDSCxxQkFBWTtBQUNaLGNBQUssQ0FBQyxLQUFLLEtBQUssS0FBSztBQUNwQixpREFBSSxTQUFTLEVBQUMsd0JBQXdCLElBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBTSxDQUU1RCxDQUFDOzs7Ozs7QUFJVCxvQkFBVztBQUNSO0FBQ0Usc0JBQWEsRUFBRTtBQUNmLHFCQUFZO0FBQ2IsbUJBQVUsRUFBRSxDQUNQLENBQ1IsQ0FBQyxDQUNKOzs7Ozs7O0FBSUQsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTSxFQUN4QixDQUFDLENBQ0o7Ozs7O0FBR2M7QUFDWixVQUFJLEVBQUUsMEJBQTBCO0FBQ2hDLGdCQUFVLEVBQUUsQ0FBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBRTtBQUMxRCxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3LmxheGFyanMub3JnXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheFBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcblxuXG4vLyAgICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL2dyaWQnLFxuLy8gICAnLi4vLi4vbGliL2xheGFyLWRldmVsb3Blci10b29scy93aWRnZXQtb3V0bGluZSdcblxuXG4gICAvKiBnbG9iYWwgY2hyb21lICovXG4gICAvLyBUaGlzIGNvbnRyb2xsZXIgcGVyZm9ybXMgaGVhdnkgRE9NLW1hbmlwdWxhdGlvbiwgd2hpY2ggeW91IHdvdWxkIG5vcm1hbGx5IHB1dCBpbnRvIGEgZGlyZWN0aXZlLlxuICAgLy8gSG93ZXZlciwgb25seSB0aGUgRE9NIG9mIHRoZSBob3N0IGFwcGxpY2F0aW9uIGlzIG1hbmlwdWxhdGVkLCBzbyB0aGlzIGlzIGFjY2VwdGFibGUuXG5cblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIpIHtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIGxldCB2aXNpYmxlID0gZmFsc2U7XG4gICB2YXIgSElOVF9OT19MQVhBUl9FWFRFTlNJT04gPSAnUmVsb2FkIHBhZ2UgdG8gZW5hYmxlIExheGFySlMgZGV2ZWxvcGVyIHRvb2xzISc7XG4gICB2YXIgSElOVF9ESVNBQkxFX1RPR0dMRV9HUklEID0gJ0NvbmZpZ3VyZSBncmlkIHNldHRpbmdzIGluIGFwcGxpY2F0aW9uIHRvIGVuYWJsZSB0aGlzIGZlYXR1cmUhJztcbiAgIHZhciBISU5UX05PX0xBWEFSX0FOWU1PUkVfV0lER0VUID0gJ0Nhbm5vdCBhY2Nlc3MgTGF4YXJKUyBob3N0IHdpbmRvdyAob3IgdGFiKS4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgUmVvcGVuIGxheGFyLWRldmVsb3Blci10b29scyBmcm9tIExheGFySlMgaG9zdCB3aW5kb3cuJztcbiAgIHZhciBISU5UX0NPTkZJR1VSRV9HUklEID0gJ0NvbmZpZ3VyZSBncmlkIHNldHRpbmdzIGluIGFwcGxpY2F0aW9uIHRvIGVuYWJsZSB0aGlzIGZlYXR1cmUhJztcblxuICAgdmFyIFRBQlMgPSBbXG4gICAgICB7IG5hbWU6ICdldmVudHMnLCBsYWJlbDogJ0V2ZW50cycgfSxcbiAgICAgIHsgbmFtZTogJ3BhZ2UnLCBsYWJlbDogJ1BhZ2UnIH0sXG4gICAgICB7IG5hbWU6ICdsb2cnLCBsYWJlbDogJ0xvZycgfVxuICAgXTtcblxuICAgdmFyIG1vZGVsID0ge1xuICAgICAgbGF4YXI6IHRydWUsXG4gICAgICB0YWJzOiBUQUJTLFxuICAgICAgYWN0aXZlVGFiOiBudWxsLFxuICAgICAgZ3JpZE92ZXJsYXk6IGZhbHNlLFxuICAgICAgd2lkZ2V0T3ZlcmxheTogZmFsc2UsXG4gICAgICB0b2dnbGVHcmlkVGl0bGU6IEhJTlRfRElTQUJMRV9UT0dHTEVfR1JJRCxcbiAgICAgIG5vTGF4YXI6IEhJTlRfTk9fTEFYQVJfRVhURU5TSU9OXG4gICB9O1xuXG4gICAvKlxuICAgdmFyIGlzQnJvd3NlcldlYkV4dGVuc2lvbiA9ICggd2luZG93LmNocm9tZSAmJiBjaHJvbWUucnVudGltZSAmJiBjaHJvbWUucnVudGltZS5pZCApO1xuICAgdmFyIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydDtcblxuICAgaWYoICF3aW5kb3cub3BlbmVyICkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgaWYoICFmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgJiYgZXZlbnQucG9ydHMgKSB7XG4gICAgICAgICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9FWFRFTlNJT047XG4gICAgICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgPSBldmVudC5wb3J0c1sgMCBdO1xuICAgICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnN0YXJ0KCk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ21lc3NhZ2VQb3J0U3RhcnRlZCcgfTtcbiAgICAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSApO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjaGFubmVsID0gSlNPTi5wYXJzZSggZXZlbnQuZGV0YWlsIHx8IGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgIGlmKCBjaGFubmVsLnRleHQgPT09ICdyZWxvYWRlZFBhZ2UnICkge1xuICAgICAgICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0gKTtcbiAgIH1cbiovXG4gICBjb250ZXh0LnJlc291cmNlcyA9IHt9O1xuLypcblxuICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9BTllNT1JFX1dJREdFVDtcbiAgIH1cbiovXG4gICBheFBhdHRlcm5zLnJlc291cmNlcy5oYW5kbGVyRm9yKCBjb250ZXh0ICkucmVnaXN0ZXJSZXNvdXJjZUZyb21GZWF0dXJlKFxuICAgICAgJ2dyaWQnLFxuICAgICAge1xuICAgICAgICAgb25SZXBsYWNlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICAgICBpZiggZXZlbnQuZGF0YSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgIG1vZGVsLnRvZ2dsZUdyaWRUaXRsZSA9IEhJTlRfQ09ORklHVVJFX0dSSUQ7XG4gICAgICAgICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICBtb2RlbC50b2dnbGVHcmlkVGl0bGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cbiAgICk7XG5cbiAgIGF4UGF0dGVybnMuZmxhZ3MuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyRmxhZyggY29udGV4dC5mZWF0dXJlcy5kZXRhaWxzT24sIHtcbiAgICAgIGluaXRpYWxTdGF0ZTogbW9kZWwubGF4YXIsXG4gICAgICBvbkNoYW5nZTogZnVuY3Rpb24oIG5ld1N0YXRlICkge1xuICAgICAgICAgbW9kZWwubGF4YXIgPSBuZXdTdGF0ZTtcbiAgICAgIH1cbiAgIH0gKTtcbi8qXG4gICBpZiggaXNCcm93c2VyV2ViRXh0ZW5zaW9uICkge1xuICAgICAgY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25OYXZpZ2F0ZWQuYWRkTGlzdGVuZXIoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgIH0gKTtcbiAgIH1cbiovXG4gICBheFBhdHRlcm5zLnZpc2liaWxpdHkuaGFuZGxlckZvciggY29udGV4dCwgeyBvbkFueUFyZWFSZXF1ZXN0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICB2YXIgcHJlZml4ID0gY29udGV4dC5pZCgpICsgJy4nO1xuICAgICAgdmFyIGFjdGl2ZVRhYiA9IG1vZGVsLmFjdGl2ZVRhYjtcbiAgICAgIHJldHVybiBldmVudC52aXNpYmxlICYmIGFjdGl2ZVRhYiAhPT0gbnVsbCAmJiBldmVudC5hcmVhID09PSBwcmVmaXggKyBhY3RpdmVUYWIubmFtZTtcbiAgIH0gfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICdkaWROYXZpZ2F0ZScsIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgIHZhciBuZXdOYW1lID0gZXZlbnQuZGF0YVsgY29udGV4dC5mZWF0dXJlcy50YWJzLnBhcmFtZXRlciBdO1xuICAgICAgdmFyIG5ld1RhYiA9IFRBQlMuZmlsdGVyKCBmdW5jdGlvbiggXyApIHsgcmV0dXJuIF8ubmFtZSA9PT0gbmV3TmFtZTsgfSApWyAwIF07XG4gICAgICBpZiggIW5ld1RhYiApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuXG4gICAgICBpZiggbW9kZWwuYWN0aXZlVGFiICE9PSBuZXdUYWIgKSB7XG4gICAgICAgICBwdWJsaXNoVmlzaWJpbGl0eSggbW9kZWwuYWN0aXZlVGFiLCBmYWxzZSApO1xuICAgICAgICAgcHVibGlzaFZpc2liaWxpdHkoIG5ld1RhYiwgdHJ1ZSApO1xuICAgICAgfVxuICAgICAgbW9kZWwuYWN0aXZlVGFiID0gbmV3VGFiO1xuXG4gICAgICBmdW5jdGlvbiBwdWJsaXNoVmlzaWJpbGl0eSggdGFiLCB2aXNpYmxlICkge1xuICAgICAgICAgaWYoIHRhYiApIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gY29udGV4dC5pZCgpICsgJy4nICsgdGFiLm5hbWU7XG4gICAgICAgICAgICBheFBhdHRlcm5zLnZpc2liaWxpdHkucmVxdWVzdFB1Ymxpc2hlckZvckFyZWEoIGNvbnRleHQsIGFyZWEgKSggdmlzaWJsZSApO1xuICAgICAgICAgfVxuICAgICAgfVxuICAgfSApO1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoIGBkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eS4ke2NvbnRleHQud2lkZ2V0LmFyZWF9YCwgKGV2ZW50LCBtZXRhKSA9PiB7XG4gICAgIGlmKCAhdmlzaWJsZSAmJiBldmVudC52aXNpYmxlICkge1xuICAgICAgICB2aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgIH1cbiAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC5uYXZpZ2F0aW9uJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3dpbGxUYWtlQWN0aW9uLm5hdmlnYXRpb24nLCB7XG4gICAgICAgICBhY3Rpb246ICduYXZpZ2F0aW9uJ1xuICAgICAgfSApO1xuICAgICAgaWYoIG1vZGVsLmdyaWRPdmVybGF5ICkge1xuICAgICAgICAgdG9nZ2xlR3JpZCgpO1xuICAgICAgfVxuICAgICAgaWYoIG1vZGVsLndpZGdldE92ZXJsYXkgKSB7XG4gICAgICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICB9XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi5uYXZpZ2F0aW9uJywge1xuICAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGlvbidcbiAgICAgIH0gKTtcbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gYWN0aXZhdGVUYWIoIHRhYiApIHtcbiAgICAgIHZhciBkYXRhID0ge307XG4gICAgICBkYXRhWyBjb250ZXh0LmZlYXR1cmVzLnRhYnMucGFyYW1ldGVyIF0gPSB0YWIubmFtZTtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICduYXZpZ2F0ZVJlcXVlc3QuX3NlbGYnLCB7XG4gICAgICAgICB0YXJnZXQ6ICdfc2VsZicsXG4gICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9ICk7XG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBvbkNsaWNrVG9nZ2xlR3JpZCgpIHtcbiAgICAgIGlmKCAhY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApeyByZXR1cm47IH1cbiAgICAgIHRvZ2dsZUdyaWQoKTtcbiAgICAgIG1vZGVsLmdyaWRPdmVybGF5ID0gIW1vZGVsLmdyaWRPdmVybGF5O1xuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gb25DbGlja1RvZ2dsZVdpZGdldE91dGxpbmUoKSB7XG4gICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICBtb2RlbC53aWRnZXRPdmVybGF5ID0gIW1vZGVsLndpZGdldE92ZXJsYXk7XG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB0b2dnbGVHcmlkKCkge1xuICAgICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICAgICAvKiBnbG9iYWwgYXhEZXZlbG9wZXJUb29sc1RvZ2dsZUdyaWQgKi9cbiAgICAgICAgIC8vYXhEZXZlbG9wZXJUb29sc1RvZ2dsZUdyaWQoIGNvbnRleHQucmVzb3VyY2VzLmdyaWQgKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAgICAgICB2YXIgZXZlbnQ7XG4gICAgICAgICBldmVudCA9IG5ldyBDdXN0b21FdmVudCggJ3Rvb2dsZUdyaWQnLCB7XG4gICAgICAgICAgICBkZXRhaWw6IEpTT04uc3RyaW5naWZ5KCBjb250ZXh0LnJlc291cmNlcy5ncmlkIClcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiggZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0ICkge1xuICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7IHRleHQ6ICd0b29nbGVHcmlkJywgZGF0YTogY29udGV4dC5yZXNvdXJjZXMuZ3JpZCB9O1xuICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHRvZ2dsZVdpZGdldE91dGxpbmUoKSB7XG4gICAgICBpZiggd2luZG93Lm9wZW5lciApIHtcbiAgICAgICAgIC8qIGdsb2JhbCBheERldmVsb3BlclRvb2xzVG9nZ2xlV2lkZ2V0T3V0bGluZSAqL1xuICAgICAgICAgLy9heERldmVsb3BlclRvb2xzVG9nZ2xlV2lkZ2V0T3V0bGluZSgpO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYoIGlzQnJvd3NlcldlYkV4dGVuc2lvbiApIHtcbiAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCAnd2lkZ2V0T3V0bGluZScsIHsgfSApO1xuICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgKSB7XG4gICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ3dpZGdldE91dGxpbmUnLCBkYXRhOiB7fSB9O1xuICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQnV0dG9ucygpIHtcbiAgICAgICAgIGlmKCBtb2RlbC5sYXhhciApIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj4geyByZW5kZXJHcmlkQnV0dG9uKCkgfSB7IHJlbmRlcldpZGdldE91dGxpbmVCdXR0b24oKSB9IDwvZGl2PjtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyR3JpZEJ1dHRvbigpIHtcbiAgICAgICAgIGlmKCBjb250ZXh0LnJlc291cmNlcy5ncmlkICkge1xuICAgICAgICAgICAgcmV0dXJuIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e21vZGVsLnRvZ2dsZUdyaWRUaXRsZX1cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tUb2dnbGVHcmlkKCl9XG4gICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsgJ2ZhIGZhLXRvZ2dsZS0nICsgKCBtb2RlbC5ncmlkT3ZlcmxheSA/ICdvbicgOiAnb2ZmJyApIH1cbiAgICAgICAgICAgICAgID48L2k+Jm5ic3A7e21vZGVsLmdyaWRPdmVybGF5ID8gJ1R1cm4gb2ZmIGdyaWQgb3ZlcmxheScgOiAnVHVybiBvbiBncmlkIG92ZXJsYXknfTwvYnV0dG9uPjtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyV2lkZ2V0T3V0bGluZUJ1dHRvbigpIHtcbiAgICAgICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGlua1wiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtvbkNsaWNrVG9nZ2xlV2lkZ2V0T3V0bGluZSgpfT48aSBjbGFzc05hbWU9eyAnZmEgZmEtdG9nZ2xlLScgKyAoIG1vZGVsLndpZGdldE92ZXJsYXkgPyAnb24nIDogJ29mZicgKSB9PjwvaT4mbmJzcDt7bW9kZWwud2lkZ2V0T3ZlcmxheSA/ICdUdXJuIG9mZiB3aWRnZXQgb3V0bGluZScgOiAnVHVybiBvbiB3aWRnZXQgb3V0bGluZSd9PC9idXR0b24+O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJUYWJzKCkge1xuICAgICAgICAgaWYoICFtb2RlbC5sYXhhciApIHsgcmV0dXJuOyB9XG4gICAgICAgICBjb25zdCB0YWIgPSBtb2RlbC50YWJzLmZpbmQoICggdGFiICkgPT4gbW9kZWwuYWN0aXZlVGFiID09PSB0YWIgKTtcbiAgICAgICAgIGNvbnN0IG5hbWUgPSB0YWIgPyB0YWIubmFtZSA6ICdub1RhYic7XG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHAtdGFiIGFwcC10YWItcGFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtYXgtd2lkZ2V0LWFyZWE9e25hbWV9PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGNvbnN0IHRhYkxpc3RJdGVtcyA9IG1vZGVsLnRhYnMubWFwKCAoIHRhYiApID0+XG4gICAgICAgICAgICA8bGlcbiAgICAgICAgICAgIGNsYXNzTmFtZT17ICggbW9kZWwuYWN0aXZlVGFiICYmIG1vZGVsLmFjdGl2ZVRhYi5uYW1lID09PSB0YWIubmFtZSA/ICdheC1hY3RpdmUnOiAnJyApIH1cbiAgICAgICAgICAgIGtleT17dGFiLm5hbWV9XG4gICAgICAgICAgICA+PGEgaHJlZj1cIlwiIG9uQ2xpY2s9e2FjdGl2YXRlVGFiKCB0YWIgKX0+e3RhYi5sYWJlbH08L2E+PC9saT5cbiAgICAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlbmRlck5hdlRhYiA9IDx1bCAgY2xhc3NOYW1lPVwibmF2IG5hdi10YWJzXCJcbiAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPVwiZGV2ZWxvcGVyLXRvb2xiYXItaWNvblwiXG4gICAgICAgICAgICAgICAgICAgdGl0bGU9XCJMYXhhckpTIERvY3VtZW50YXRpb25cIlxuICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwOi8vd3d3LmxheGFyanMub3JnL2RvY3NcIlxuICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiPjwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICB7IHRhYkxpc3RJdGVtcyB9XG4gICAgICAgICAgICB7IG1vZGVsLmxheGFyID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRldmVsb3Blci10b29sYmFyLWhpbnRcIj57bW9kZWwubm9MYXhhcn08L2xpPlxuICAgICAgICAgICAgfVxuICAgICAgICAgPC91bD47XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgIHsgcmVuZGVyQnV0dG9ucygpIH1cbiAgICAgICAgIHsgcmVuZGVyTmF2VGFiIH1cbiAgICAgICAgIHtyZW5kZXJUYWJzKCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdkZXZlbG9wZXItdG9vbGJhci13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4RXZlbnRCdXMnLCAnYXhSZWFjdFJlbmRlcicgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
