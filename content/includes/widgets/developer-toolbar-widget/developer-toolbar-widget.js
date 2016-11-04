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
            return _React['default'].createElement('button', { className: 'btn btn-link', 
               type: 'button', 
               onClick: onClickToggleWidgetOutline() }, 
            _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.widgetOverlay ? 'on' : 'off') }), ' ', 
            model.widgetOverlay ? 'Turn off widget outline' : 'Turn on widget outline');}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderTabs() {
            if (!model.laxar) {return;}
            var tab = model.tabs.find(function (tab) {return model.activeTab === tab;});
            return _React['default'].createElement('div', { className: 'app-tab app-tab-page', 
               'data-ax-widget-area': true, 
               'data-ax-widget-area-binding': tab ? tab.name : tab });}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderTabList() {
            var listItems = model.tabs.map(function (tab) {return (
                  _React['default'].createElement('li', { 
                     className: model.activeTab && model.activeTab.name === tab.name ? 'ax-active' : '', 
                     key: tab.name }, 
                  _React['default'].createElement('a', { href: '', onClick: activateTab(tab) }, tab.label)));});

            return listItems;}


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function renderNavTab() {
            return _React['default'].createElement('ul', { className: 'nav nav-tabs', 
               role: 'tablist' }, 
            _React['default'].createElement('li', null, _React['default'].createElement('a', { className: 'developer-toolbar-icon', 
               title: 'LaxarJS Documentation', 
               href: 'http://www.laxarjs.org/docs', 
               target: '_blank' })), 

            renderTabList(), 
            model.laxar === false && 
            _React['default'].createElement('li', { className: 'developer-toolbar-hint' }, model.noLaxar));}




         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         reactRender(
         _React['default'].createElement('div', null, 
         renderButtons(), 
         renderNavTab(), 
         renderTabs()));}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 




   { 
      name: 'developer-toolbar-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUM5QyxrQkFBWSxDQUFDO0FBQ2IsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksdUJBQXVCLEdBQUcsZ0RBQWdELENBQUM7QUFDL0UsVUFBSSx3QkFBd0IsR0FBRyxnRUFBZ0UsQ0FBQztBQUNoRyxVQUFJLDRCQUE0QixHQUFHLDZDQUE2QztBQUM1QywrREFBeUQsQ0FBQztBQUM5RixVQUFJLG1CQUFtQixHQUFHLGdFQUFnRSxDQUFDOztBQUUzRixVQUFJLElBQUksR0FBRztBQUNSLFFBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ25DLFFBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQy9CLFFBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQy9CLENBQUM7OztBQUVGLFVBQUksS0FBSyxHQUFHO0FBQ1QsY0FBSyxFQUFFLElBQUk7QUFDWCxhQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFTLEVBQUUsSUFBSTtBQUNmLG9CQUFXLEVBQUUsS0FBSztBQUNsQixzQkFBYSxFQUFFLEtBQUs7QUFDcEIsd0JBQWUsRUFBRSx3QkFBd0I7QUFDekMsZ0JBQU8sRUFBRSx1QkFBdUIsRUFDbEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkYsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPdkIsNkJBQVcsU0FBUyxDQUFDLFVBQVUsQ0FBRSxPQUFPLENBQUUsQ0FBQywyQkFBMkI7QUFDbkUsWUFBTTtBQUNOO0FBQ0csa0JBQVMsRUFBRSxtQkFBVSxLQUFLLEVBQUc7QUFDMUIsZ0JBQUks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QVcsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFFO0FBQzFELFlBQU0sRUFBTixNQUFNLEVBQ1IiLCJmaWxlIjoiZGV2ZWxvcGVyLXRvb2xiYXItd2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBhaXhpZ28gQUdcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cubGF4YXJqcy5vcmdcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuXG5cbi8vICAgJy4uLy4uL2xpYi9sYXhhci1kZXZlbG9wZXItdG9vbHMvZ3JpZCcsXG4vLyAgICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL3dpZGdldC1vdXRsaW5lJ1xuXG5cbiAgIC8qIGdsb2JhbCBjaHJvbWUgKi9cbiAgIC8vIFRoaXMgY29udHJvbGxlciBwZXJmb3JtcyBoZWF2eSBET00tbWFuaXB1bGF0aW9uLCB3aGljaCB5b3Ugd291bGQgbm9ybWFsbHkgcHV0IGludG8gYSBkaXJlY3RpdmUuXG4gICAvLyBIb3dldmVyLCBvbmx5IHRoZSBET00gb2YgdGhlIGhvc3QgYXBwbGljYXRpb24gaXMgbWFuaXB1bGF0ZWQsIHNvIHRoaXMgaXMgYWNjZXB0YWJsZS5cblxuXG5mdW5jdGlvbiBjcmVhdGUoIGNvbnRleHQsIGV2ZW50QnVzLCByZWFjdFJlbmRlcikge1xuICAgJ3VzZSBzdHJpY3QnO1xuICAgbGV0IHZpc2libGUgPSBmYWxzZTtcbiAgIHZhciBISU5UX05PX0xBWEFSX0VYVEVOU0lPTiA9ICdSZWxvYWQgcGFnZSB0byBlbmFibGUgTGF4YXJKUyBkZXZlbG9wZXIgdG9vbHMhJztcbiAgIHZhciBISU5UX0RJU0FCTEVfVE9HR0xFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuICAgdmFyIEhJTlRfTk9fTEFYQVJfQU5ZTU9SRV9XSURHRVQgPSAnQ2Fubm90IGFjY2VzcyBMYXhhckpTIGhvc3Qgd2luZG93IChvciB0YWIpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBSZW9wZW4gbGF4YXItZGV2ZWxvcGVyLXRvb2xzIGZyb20gTGF4YXJKUyBob3N0IHdpbmRvdy4nO1xuICAgdmFyIEhJTlRfQ09ORklHVVJFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuXG4gICB2YXIgVEFCUyA9IFtcbiAgICAgIHsgbmFtZTogJ2V2ZW50cycsIGxhYmVsOiAnRXZlbnRzJyB9LFxuICAgICAgeyBuYW1lOiAncGFnZScsIGxhYmVsOiAnUGFnZScgfSxcbiAgICAgIHsgbmFtZTogJ2xvZycsIGxhYmVsOiAnTG9nJyB9XG4gICBdO1xuXG4gICB2YXIgbW9kZWwgPSB7XG4gICAgICBsYXhhcjogdHJ1ZSxcbiAgICAgIHRhYnM6IFRBQlMsXG4gICAgICBhY3RpdmVUYWI6IG51bGwsXG4gICAgICBncmlkT3ZlcmxheTogZmFsc2UsXG4gICAgICB3aWRnZXRPdmVybGF5OiBmYWxzZSxcbiAgICAgIHRvZ2dsZUdyaWRUaXRsZTogSElOVF9ESVNBQkxFX1RPR0dMRV9HUklELFxuICAgICAgbm9MYXhhcjogSElOVF9OT19MQVhBUl9FWFRFTlNJT05cbiAgIH07XG5cbiAgIC8qXG4gICB2YXIgaXNCcm93c2VyV2ViRXh0ZW5zaW9uID0gKCB3aW5kb3cuY2hyb21lICYmIGNocm9tZS5ydW50aW1lICYmIGNocm9tZS5ydW50aW1lLmlkICk7XG4gICB2YXIgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0O1xuXG4gICBpZiggIXdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21lc3NhZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICBpZiggIWZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCAmJiBldmVudC5wb3J0cyApIHtcbiAgICAgICAgICAgIG1vZGVsLm5vTGF4YXIgPSBISU5UX05PX0xBWEFSX0VYVEVOU0lPTjtcbiAgICAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCA9IGV2ZW50LnBvcnRzWyAwIF07XG4gICAgICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQuc3RhcnQoKTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0geyB0ZXh0OiAnbWVzc2FnZVBvcnRTdGFydGVkJyB9O1xuICAgICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNoYW5uZWwgPSBKU09OLnBhcnNlKCBldmVudC5kZXRhaWwgfHwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgaWYoIGNoYW5uZWwudGV4dCA9PT0gJ3JlbG9hZGVkUGFnZScgKSB7XG4gICAgICAgICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuKi9cbiAgIGNvbnRleHQucmVzb3VyY2VzID0ge307XG4vKlxuXG4gICBpZiggd2luZG93Lm9wZW5lciApIHtcbiAgICAgIG1vZGVsLm5vTGF4YXIgPSBISU5UX05PX0xBWEFSX0FOWU1PUkVfV0lER0VUO1xuICAgfVxuKi9cbiAgIGF4UGF0dGVybnMucmVzb3VyY2VzLmhhbmRsZXJGb3IoIGNvbnRleHQgKS5yZWdpc3RlclJlc291cmNlRnJvbUZlYXR1cmUoXG4gICAgICAnZ3JpZCcsXG4gICAgICB7XG4gICAgICAgICBvblJlcGxhY2U6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgICAgIGlmKCBldmVudC5kYXRhID09PSBudWxsICkge1xuICAgICAgICAgICAgICAgbW9kZWwudG9nZ2xlR3JpZFRpdGxlID0gSElOVF9DT05GSUdVUkVfR1JJRDtcbiAgICAgICAgICAgICAgIG1vZGVsLmdyaWRPdmVybGF5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgIG1vZGVsLnRvZ2dsZUdyaWRUaXRsZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfVxuICAgKTtcblxuICAgYXhQYXR0ZXJucy5mbGFncy5oYW5kbGVyRm9yKCBjb250ZXh0ICkucmVnaXN0ZXJGbGFnKCBjb250ZXh0LmZlYXR1cmVzLmRldGFpbHNPbiwge1xuICAgICAgaW5pdGlhbFN0YXRlOiBtb2RlbC5sYXhhcixcbiAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiggbmV3U3RhdGUgKSB7XG4gICAgICAgICBtb2RlbC5sYXhhciA9IG5ld1N0YXRlO1xuICAgICAgfVxuICAgfSApO1xuLypcbiAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAgICBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vbk5hdmlnYXRlZC5hZGRMaXN0ZW5lciggZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgfSApO1xuICAgfVxuKi9cbiAgIGF4UGF0dGVybnMudmlzaWJpbGl0eS5oYW5kbGVyRm9yKCBjb250ZXh0LCB7IG9uQW55QXJlYVJlcXVlc3Q6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgIHZhciBwcmVmaXggPSBjb250ZXh0LmlkKCkgKyAnLic7XG4gICAgICB2YXIgYWN0aXZlVGFiID0gbW9kZWwuYWN0aXZlVGFiO1xuICAgICAgcmV0dXJuIGV2ZW50LnZpc2libGUgJiYgYWN0aXZlVGFiICE9PSBudWxsICYmIGV2ZW50LmFyZWEgPT09IHByZWZpeCArIGFjdGl2ZVRhYi5uYW1lO1xuICAgfSB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ2RpZE5hdmlnYXRlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgdmFyIG5ld05hbWUgPSBldmVudC5kYXRhWyBjb250ZXh0LmZlYXR1cmVzLnRhYnMucGFyYW1ldGVyIF07XG4gICAgICB2YXIgbmV3VGFiID0gVEFCUy5maWx0ZXIoIGZ1bmN0aW9uKCBfICkgeyByZXR1cm4gXy5uYW1lID09PSBuZXdOYW1lOyB9IClbIDAgXTtcbiAgICAgIGlmKCAhbmV3VGFiICkge1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG5cbiAgICAgIGlmKCBtb2RlbC5hY3RpdmVUYWIgIT09IG5ld1RhYiApIHtcbiAgICAgICAgIHB1Ymxpc2hWaXNpYmlsaXR5KCBtb2RlbC5hY3RpdmVUYWIsIGZhbHNlICk7XG4gICAgICAgICBwdWJsaXNoVmlzaWJpbGl0eSggbmV3VGFiLCB0cnVlICk7XG4gICAgICB9XG4gICAgICBtb2RlbC5hY3RpdmVUYWIgPSBuZXdUYWI7XG5cbiAgICAgIGZ1bmN0aW9uIHB1Ymxpc2hWaXNpYmlsaXR5KCB0YWIsIHZpc2libGUgKSB7XG4gICAgICAgICBpZiggdGFiICkge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSBjb250ZXh0LmlkKCkgKyAnLicgKyB0YWIubmFtZTtcbiAgICAgICAgICAgIGF4UGF0dGVybnMudmlzaWJpbGl0eS5yZXF1ZXN0UHVibGlzaGVyRm9yQXJlYSggY29udGV4dCwgYXJlYSApKCB2aXNpYmxlICk7XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9ICk7XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggYGRpZENoYW5nZUFyZWFWaXNpYmlsaXR5LiR7Y29udGV4dC53aWRnZXQuYXJlYX1gLCAoZXZlbnQsIG1ldGEpID0+IHtcbiAgICAgaWYoICF2aXNpYmxlICYmIGV2ZW50LnZpc2libGUgKSB7XG4gICAgICAgIHZpc2libGUgPSB0cnVlO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgfVxuICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ3Rha2VBY3Rpb25SZXF1ZXN0Lm5hdmlnYXRpb24nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnd2lsbFRha2VBY3Rpb24ubmF2aWdhdGlvbicsIHtcbiAgICAgICAgIGFjdGlvbjogJ25hdmlnYXRpb24nXG4gICAgICB9ICk7XG4gICAgICBpZiggbW9kZWwuZ3JpZE92ZXJsYXkgKSB7XG4gICAgICAgICB0b2dnbGVHcmlkKCk7XG4gICAgICB9XG4gICAgICBpZiggbW9kZWwud2lkZ2V0T3ZlcmxheSApIHtcbiAgICAgICAgIHRvZ2dsZVdpZGdldE91dGxpbmUoKTtcbiAgICAgIH1cbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRUYWtlQWN0aW9uLm5hdmlnYXRpb24nLCB7XG4gICAgICAgICBhY3Rpb246ICduYXZpZ2F0aW9uJ1xuICAgICAgfSApO1xuICAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBhY3RpdmF0ZVRhYiggdGFiICkge1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGRhdGFbIGNvbnRleHQuZmVhdHVyZXMudGFicy5wYXJhbWV0ZXIgXSA9IHRhYi5uYW1lO1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ25hdmlnYXRlUmVxdWVzdC5fc2VsZicsIHtcbiAgICAgICAgIHRhcmdldDogJ19zZWxmJyxcbiAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0gKTtcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG9uQ2xpY2tUb2dnbGVHcmlkKCkge1xuICAgICAgaWYoICFjb250ZXh0LnJlc291cmNlcy5ncmlkICl7IHJldHVybjsgfVxuICAgICAgdG9nZ2xlR3JpZCgpO1xuICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSAhbW9kZWwuZ3JpZE92ZXJsYXk7XG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBvbkNsaWNrVG9nZ2xlV2lkZ2V0T3V0bGluZSgpIHtcbiAgICAgIHRvZ2dsZVdpZGdldE91dGxpbmUoKTtcbiAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSAhbW9kZWwud2lkZ2V0T3ZlcmxheTtcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHRvZ2dsZUdyaWQoKSB7XG4gICAgICBpZiggd2luZG93Lm9wZW5lciApIHtcbiAgICAgICAgIC8qIGdsb2JhbCBheERldmVsb3BlclRvb2xzVG9nZ2xlR3JpZCAqL1xuICAgICAgICAgLy9heERldmVsb3BlclRvb2xzVG9nZ2xlR3JpZCggY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYoIGlzQnJvd3NlcldlYkV4dGVuc2lvbiApIHtcbiAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCAndG9vZ2xlR3JpZCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogSlNPTi5zdHJpbmdpZnkoIGNvbnRleHQucmVzb3VyY2VzLmdyaWQgKVxuICAgICAgICAgfSApO1xuICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgKSB7XG4gICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ3Rvb2dsZUdyaWQnLCBkYXRhOiBjb250ZXh0LnJlc291cmNlcy5ncmlkIH07XG4gICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KCBtZXNzYWdlICkgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlV2lkZ2V0T3V0bGluZSgpIHtcbiAgICAgIGlmKCB3aW5kb3cub3BlbmVyICkge1xuICAgICAgICAgLyogZ2xvYmFsIGF4RGV2ZWxvcGVyVG9vbHNUb2dnbGVXaWRnZXRPdXRsaW5lICovXG4gICAgICAgICAvL2F4RGV2ZWxvcGVyVG9vbHNUb2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiggaXNCcm93c2VyV2ViRXh0ZW5zaW9uICkge1xuICAgICAgICAgdmFyIGV2ZW50O1xuICAgICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoICd3aWRnZXRPdXRsaW5lJywgeyB9ICk7XG4gICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCApIHtcbiAgICAgICAgIHZhciBtZXNzYWdlID0geyB0ZXh0OiAnd2lkZ2V0T3V0bGluZScsIGRhdGE6IHt9IH07XG4gICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KCBtZXNzYWdlICkgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJCdXR0b25zKCkge1xuICAgICAgICAgaWYoIG1vZGVsLmxheGFyICkge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPiB7IHJlbmRlckdyaWRCdXR0b24oKSB9IHsgcmVuZGVyV2lkZ2V0T3V0bGluZUJ1dHRvbigpIH0gPC9kaXY+O1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJHcmlkQnV0dG9uKCkge1xuICAgICAgICAgaWYoIGNvbnRleHQucmVzb3VyY2VzLmdyaWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmtcIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17bW9kZWwudG9nZ2xlR3JpZFRpdGxlfVxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja1RvZ2dsZUdyaWQoKX1cbiAgICAgICAgICAgICAgID48aSBjbGFzc05hbWU9eyAnZmEgZmEtdG9nZ2xlLScgKyAoIG1vZGVsLmdyaWRPdmVybGF5ID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgPjwvaT4mbmJzcDt7bW9kZWwuZ3JpZE92ZXJsYXkgPyAnVHVybiBvZmYgZ3JpZCBvdmVybGF5JyA6ICdUdXJuIG9uIGdyaWQgb3ZlcmxheSd9PC9idXR0b24+O1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJXaWRnZXRPdXRsaW5lQnV0dG9uKCkge1xuICAgICAgICAgcmV0dXJuIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tUb2dnbGVXaWRnZXRPdXRsaW5lKCl9XG4gICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsgJ2ZhIGZhLXRvZ2dsZS0nICsgKCBtb2RlbC53aWRnZXRPdmVybGF5ID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgICAgPjwvaT4mbmJzcDt7bW9kZWwud2lkZ2V0T3ZlcmxheSA/ICdUdXJuIG9mZiB3aWRnZXQgb3V0bGluZScgOiAnVHVybiBvbiB3aWRnZXQgb3V0bGluZSd9PC9idXR0b24+O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJUYWJzKCkge1xuICAgICAgICAgaWYoICFtb2RlbC5sYXhhciApIHsgcmV0dXJuOyB9XG4gICAgICAgICBjb25zdCB0YWIgPSBtb2RlbC50YWJzLmZpbmQoICggdGFiICkgPT4gbW9kZWwuYWN0aXZlVGFiID09PSB0YWIgKTtcbiAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImFwcC10YWIgYXBwLXRhYi1wYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1heC13aWRnZXQtYXJlYVxuICAgICAgICAgICAgICAgICAgICBkYXRhLWF4LXdpZGdldC1hcmVhLWJpbmRpbmc9e3RhYiA/IHRhYi5uYW1lIDogdGFiIH0+PC9kaXY+O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJUYWJMaXN0KCkge1xuICAgICAgICAgY29uc3QgbGlzdEl0ZW1zID0gbW9kZWwudGFicy5tYXAoICggdGFiICkgPT5cbiAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgY2xhc3NOYW1lPXsgKCBtb2RlbC5hY3RpdmVUYWIgJiYgbW9kZWwuYWN0aXZlVGFiLm5hbWUgPT09IHRhYi5uYW1lID8gJ2F4LWFjdGl2ZSc6ICcnICkgfVxuICAgICAgICAgICAga2V5PXt0YWIubmFtZX1cbiAgICAgICAgICAgID48YSBocmVmPVwiXCIgb25DbGljaz17YWN0aXZhdGVUYWIoIHRhYiApfT57dGFiLmxhYmVsfTwvYT48L2xpPlxuICAgICAgICAgKTtcbiAgICAgICAgIHJldHVybiBsaXN0SXRlbXM7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlck5hdlRhYigpIHtcbiAgICAgICAgIHJldHVybiA8dWwgIGNsYXNzTmFtZT1cIm5hdiBuYXYtdGFic1wiXG4gICAgICAgICAgICAgICAgICAgICByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cImRldmVsb3Blci10b29sYmFyLWljb25cIlxuICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiTGF4YXJKUyBEb2N1bWVudGF0aW9uXCJcbiAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cDovL3d3dy5sYXhhcmpzLm9yZy9kb2NzXCJcbiAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgeyByZW5kZXJUYWJMaXN0KCkgfVxuICAgICAgICAgICAgeyBtb2RlbC5sYXhhciA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkZXZlbG9wZXItdG9vbGJhci1oaW50XCI+e21vZGVsLm5vTGF4YXJ9PC9saT5cbiAgICAgICAgICAgIH1cbiAgICAgICAgIDwvdWw+O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICB7IHJlbmRlckJ1dHRvbnMoKSB9XG4gICAgICAgICB7IHJlbmRlck5hdlRhYigpIH1cbiAgICAgICAgIHtyZW5kZXJUYWJzKCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdkZXZlbG9wZXItdG9vbGJhci13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4RXZlbnRCdXMnLCAnYXhSZWFjdFJlbmRlcicgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
