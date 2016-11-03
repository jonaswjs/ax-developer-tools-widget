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


      /*
         ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
         $scope.activateTab = function( tab ) {
            var data = {};
            data[ context.features.tabs.parameter ] = tab.name;
            eventBus.publish( 'navigateRequest._self', {
               target: '_self',
               data: data
            } );
         };
      
         ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
         $scope.toggleGrid = function() {
            if( !context.resources.grid ){ return; }
            toggleGrid();
            model.gridOverlay = !model.gridOverlay;
         };
      
         ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
         $scope.toggleWidgetOutline = function() {
            toggleWidgetOutline();
            model.widgetOverlay = !model.widgetOverlay;
         };
      
         ////////////////////////////////////////////////////////////////////////////////////////////////////////
      */
      // function toggleGrid() {
      //    if( window.opener ) {
      //       /* global axDeveloperToolsToggleGrid */
      //       axDeveloperToolsToggleGrid( context.resources.grid );
      //       return;
      //    }
      //    if( isBrowserWebExtension ) {
      //       var event;
      //       event = new CustomEvent( 'toogleGrid', {
      //          detail: JSON.stringify( context.resources.grid )
      //       } );
      //       window.dispatchEvent( event );
      //    }
      //    else if( firefoxExtensionMessagePort ) {
      //       var message = { text: 'toogleGrid', data: context.resources.grid };
      //       firefoxExtensionMessagePort.postMessage( JSON.stringify( message ) );
      //    }
      // }
      //
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // function toggleWidgetOutline() {
      //    if( window.opener ) {
      //       /* global axDeveloperToolsToggleWidgetOutline */
      //       axDeveloperToolsToggleWidgetOutline();
      //       return;
      //    }
      //    if( isBrowserWebExtension ) {
      //       var event;
      //       event = new CustomEvent( 'widgetOutline', { } );
      //       window.dispatchEvent( event );
      //    }
      //    else if( firefoxExtensionMessagePort ) {
      //       var message = { text: 'widgetOutline', data: {} };
      //       firefoxExtensionMessagePort.postMessage( JSON.stringify( message ) );
      //    }
      // }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {

         function renderButtons() {
            if (model.laxar) {
               return _React['default'].createElement('div', { className: 'pull-right' }, ' ', renderGridButton(), ' ', renderWidgetOutlineButton(), ' ');}

            return;}


         function renderGridButton() {
            if (resources.grid) {
               return _React['default'].createElement('button', { className: 'btn btn-link', 
                  title: model.toggleGridTitle, 
                  type: 'button', 
                  onClick: toggleGrid }, 
               _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.gridOverlay ? 'on' : 'off') }), ' (model.gridOverlay ? \'Turn off grid overlay\' : \'Turn on grid overlay\')');}


            return;}


         function renderWidgetOutlineButton() {
            return _React['default'].createElement('button', { className: 'btn btn-link', 
               type: 'button', 
               onClick: toggleWidgetOutline }, 
            _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.widgetOverlay ? 'on' : 'off') }), ' (model.widgetOverlay ? \'Turn off widget outline\' : \'Turn on widget outline\')');}



         function renderTabs() {
            if (!model.laxar) {return;}
            var tab = model.tabs.find(function (tab) {return model.activeTab === tab;});
            return _React['default'].createElement('div', { className: 'app-tab app-tab-page', 
               'data-ax-widget-area': true, 
               'data-ax-widget-area-binding': tab.name });}


         function renderTabList() {
            var listItems = model.tabs.map(function (tab) {return (
                  _React['default'].createElement('li', { 
                     className: model.activeTab.name === tab.name ? 'ax-active' : '' }, 
                  _React['default'].createElement('a', { href: '', onClick: activateTab(tab) }, tab.label)));});

            return listItems;}




         reactRender(
         //   { renderButtons() }

         _React['default'].createElement('ul', { className: 'nav nav-tabs', 
            role: 'tablist' }, 
         _React['default'].createElement('li', null, _React['default'].createElement('a', { className: 'developer-toolbar-icon', 
            title: 'LaxarJS Documentation', 
            href: 'http://www.laxarjs.org/docs', 
            target: '_blank' })), 

         renderTabList(), 
         model.laxar === false && 
         _React['default'].createElement('li', { className: 'developer-toolbar-hint' }, model.noLaxar))


         //{ renderTabs }
         );}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 




   { 
      name: 'developer-toolbar-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUM5QyxrQkFBWSxDQUFDO0FBQ2IsVUFBSSx1QkFBdUIsR0FBRyxnREFBZ0QsQ0FBQztBQUMvRSxVQUFJLHdCQUF3QixHQUFHLGdFQUFnRSxDQUFDO0FBQ2hHLFVBQUksNEJBQTRCLEdBQUcsNkNBQTZDO0FBQzVDLCtEQUF5RCxDQUFDO0FBQzlGLFVBQUksbUJBQW1CLEdBQUcsZ0VBQWdFLENBQUM7O0FBRTNGLFVBQUksSUFBSSxHQUFHO0FBQ1IsUUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDbkMsUUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDL0IsUUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FDL0IsQ0FBQzs7O0FBRUYsVUFBSSxLQUFLLEdBQUc7QUFDVCxjQUFLLEVBQUUsSUFBSTtBQUNYLGFBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQVMsRUFBRSxJQUFJO0FBQ2Ysb0JBQVcsRUFBRSxLQUFLO0FBQ2xCLHNCQUFhLEVBQUUsS0FBSztBQUNwQix3QkFBZSxFQUFFLHdCQUF3QjtBQUN6QyxnQkFBTyxFQUFFLHVCQUF1QixFQUNsQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCRixhQUFPLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU92Qiw2QkFBVyxTQUFTLENBQUMsVUFBVSxDQUFFLE9BQU8sQ0FBRSxDQUFDLDJCQUEyQjtBQUNuRSxZQUFNO0FBQ047QUFDRyxrQkFBUyxFQUFFLG1CQUFVLEtBQUssRUFBRztBQUMxQixnQkFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRztB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dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3LmxheGFyanMub3JnXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheFBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcblxuXG4vLyAgICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL2dyaWQnLFxuLy8gICAnLi4vLi4vbGliL2xheGFyLWRldmVsb3Blci10b29scy93aWRnZXQtb3V0bGluZSdcblxuXG4gICAvKiBnbG9iYWwgY2hyb21lICovXG4gICAvLyBUaGlzIGNvbnRyb2xsZXIgcGVyZm9ybXMgaGVhdnkgRE9NLW1hbmlwdWxhdGlvbiwgd2hpY2ggeW91IHdvdWxkIG5vcm1hbGx5IHB1dCBpbnRvIGEgZGlyZWN0aXZlLlxuICAgLy8gSG93ZXZlciwgb25seSB0aGUgRE9NIG9mIHRoZSBob3N0IGFwcGxpY2F0aW9uIGlzIG1hbmlwdWxhdGVkLCBzbyB0aGlzIGlzIGFjY2VwdGFibGUuXG5cblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIpIHtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIHZhciBISU5UX05PX0xBWEFSX0VYVEVOU0lPTiA9ICdSZWxvYWQgcGFnZSB0byBlbmFibGUgTGF4YXJKUyBkZXZlbG9wZXIgdG9vbHMhJztcbiAgIHZhciBISU5UX0RJU0FCTEVfVE9HR0xFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuICAgdmFyIEhJTlRfTk9fTEFYQVJfQU5ZTU9SRV9XSURHRVQgPSAnQ2Fubm90IGFjY2VzcyBMYXhhckpTIGhvc3Qgd2luZG93IChvciB0YWIpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBSZW9wZW4gbGF4YXItZGV2ZWxvcGVyLXRvb2xzIGZyb20gTGF4YXJKUyBob3N0IHdpbmRvdy4nO1xuICAgdmFyIEhJTlRfQ09ORklHVVJFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuXG4gICB2YXIgVEFCUyA9IFtcbiAgICAgIHsgbmFtZTogJ2V2ZW50cycsIGxhYmVsOiAnRXZlbnRzJyB9LFxuICAgICAgeyBuYW1lOiAncGFnZScsIGxhYmVsOiAnUGFnZScgfSxcbiAgICAgIHsgbmFtZTogJ2xvZycsIGxhYmVsOiAnTG9nJyB9XG4gICBdO1xuXG4gICB2YXIgbW9kZWwgPSB7XG4gICAgICBsYXhhcjogdHJ1ZSxcbiAgICAgIHRhYnM6IFRBQlMsXG4gICAgICBhY3RpdmVUYWI6IG51bGwsXG4gICAgICBncmlkT3ZlcmxheTogZmFsc2UsXG4gICAgICB3aWRnZXRPdmVybGF5OiBmYWxzZSxcbiAgICAgIHRvZ2dsZUdyaWRUaXRsZTogSElOVF9ESVNBQkxFX1RPR0dMRV9HUklELFxuICAgICAgbm9MYXhhcjogSElOVF9OT19MQVhBUl9FWFRFTlNJT05cbiAgIH07XG5cbiAgIC8qXG4gICB2YXIgaXNCcm93c2VyV2ViRXh0ZW5zaW9uID0gKCB3aW5kb3cuY2hyb21lICYmIGNocm9tZS5ydW50aW1lICYmIGNocm9tZS5ydW50aW1lLmlkICk7XG4gICB2YXIgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0O1xuXG4gICBpZiggIXdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21lc3NhZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICBpZiggIWZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCAmJiBldmVudC5wb3J0cyApIHtcbiAgICAgICAgICAgIG1vZGVsLm5vTGF4YXIgPSBISU5UX05PX0xBWEFSX0VYVEVOU0lPTjtcbiAgICAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCA9IGV2ZW50LnBvcnRzWyAwIF07XG4gICAgICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQuc3RhcnQoKTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0geyB0ZXh0OiAnbWVzc2FnZVBvcnRTdGFydGVkJyB9O1xuICAgICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNoYW5uZWwgPSBKU09OLnBhcnNlKCBldmVudC5kZXRhaWwgfHwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgaWYoIGNoYW5uZWwudGV4dCA9PT0gJ3JlbG9hZGVkUGFnZScgKSB7XG4gICAgICAgICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgfVxuKi9cbiAgIGNvbnRleHQucmVzb3VyY2VzID0ge307XG4vKlxuXG4gICBpZiggd2luZG93Lm9wZW5lciApIHtcbiAgICAgIG1vZGVsLm5vTGF4YXIgPSBISU5UX05PX0xBWEFSX0FOWU1PUkVfV0lER0VUO1xuICAgfVxuKi9cbiAgIGF4UGF0dGVybnMucmVzb3VyY2VzLmhhbmRsZXJGb3IoIGNvbnRleHQgKS5yZWdpc3RlclJlc291cmNlRnJvbUZlYXR1cmUoXG4gICAgICAnZ3JpZCcsXG4gICAgICB7XG4gICAgICAgICBvblJlcGxhY2U6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgICAgIGlmKCBldmVudC5kYXRhID09PSBudWxsICkge1xuICAgICAgICAgICAgICAgbW9kZWwudG9nZ2xlR3JpZFRpdGxlID0gSElOVF9DT05GSUdVUkVfR1JJRDtcbiAgICAgICAgICAgICAgIG1vZGVsLmdyaWRPdmVybGF5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgIG1vZGVsLnRvZ2dsZUdyaWRUaXRsZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfVxuICAgKTtcblxuICAgYXhQYXR0ZXJucy5mbGFncy5oYW5kbGVyRm9yKCBjb250ZXh0ICkucmVnaXN0ZXJGbGFnKCBjb250ZXh0LmZlYXR1cmVzLmRldGFpbHNPbiwge1xuICAgICAgaW5pdGlhbFN0YXRlOiBtb2RlbC5sYXhhcixcbiAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiggbmV3U3RhdGUgKSB7XG4gICAgICAgICBtb2RlbC5sYXhhciA9IG5ld1N0YXRlO1xuICAgICAgfVxuICAgfSApO1xuLypcbiAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAgICBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vbk5hdmlnYXRlZC5hZGRMaXN0ZW5lciggZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgfSApO1xuICAgfVxuKi9cbiAgIGF4UGF0dGVybnMudmlzaWJpbGl0eS5oYW5kbGVyRm9yKCBjb250ZXh0LCB7IG9uQW55QXJlYVJlcXVlc3Q6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgIHZhciBwcmVmaXggPSBjb250ZXh0LmlkKCkgKyAnLic7XG4gICAgICB2YXIgYWN0aXZlVGFiID0gbW9kZWwuYWN0aXZlVGFiO1xuICAgICAgcmV0dXJuIGV2ZW50LnZpc2libGUgJiYgYWN0aXZlVGFiICE9PSBudWxsICYmIGV2ZW50LmFyZWEgPT09IHByZWZpeCArIGFjdGl2ZVRhYi5uYW1lO1xuICAgfSB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ2RpZE5hdmlnYXRlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgdmFyIG5ld05hbWUgPSBldmVudC5kYXRhWyBjb250ZXh0LmZlYXR1cmVzLnRhYnMucGFyYW1ldGVyIF07XG4gICAgICB2YXIgbmV3VGFiID0gVEFCUy5maWx0ZXIoIGZ1bmN0aW9uKCBfICkgeyByZXR1cm4gXy5uYW1lID09PSBuZXdOYW1lOyB9IClbIDAgXTtcbiAgICAgIGlmKCAhbmV3VGFiICkge1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuYWN0aXZlVGFiICE9PSBuZXdUYWIgKSB7XG4gICAgICAgICBwdWJsaXNoVmlzaWJpbGl0eSggbW9kZWwuYWN0aXZlVGFiLCBmYWxzZSApO1xuICAgICAgICAgcHVibGlzaFZpc2liaWxpdHkoIG5ld1RhYiwgdHJ1ZSApO1xuICAgICAgfVxuICAgICAgbW9kZWwuYWN0aXZlVGFiID0gbmV3VGFiO1xuXG4gICAgICBmdW5jdGlvbiBwdWJsaXNoVmlzaWJpbGl0eSggdGFiLCB2aXNpYmxlICkge1xuICAgICAgICAgaWYoIHRhYiApIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gY29udGV4dC5pZCgpICsgJy4nICsgdGFiLm5hbWU7XG4gICAgICAgICAgICBheFBhdHRlcm5zLnZpc2liaWxpdHkucmVxdWVzdFB1Ymxpc2hlckZvckFyZWEoIGNvbnRleHQsIGFyZWEgKSggdmlzaWJsZSApO1xuICAgICAgICAgfVxuICAgICAgfVxuICAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC5uYXZpZ2F0aW9uJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3dpbGxUYWtlQWN0aW9uLm5hdmlnYXRpb24nLCB7XG4gICAgICAgICBhY3Rpb246ICduYXZpZ2F0aW9uJ1xuICAgICAgfSApO1xuICAgICAgaWYoIG1vZGVsLmdyaWRPdmVybGF5ICkge1xuICAgICAgICAgdG9nZ2xlR3JpZCgpO1xuICAgICAgfVxuICAgICAgaWYoIG1vZGVsLndpZGdldE92ZXJsYXkgKSB7XG4gICAgICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICB9XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi5uYXZpZ2F0aW9uJywge1xuICAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGlvbidcbiAgICAgIH0gKTtcbiAgIH0gKTtcbi8qXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAkc2NvcGUuYWN0aXZhdGVUYWIgPSBmdW5jdGlvbiggdGFiICkge1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGRhdGFbIGNvbnRleHQuZmVhdHVyZXMudGFicy5wYXJhbWV0ZXIgXSA9IHRhYi5uYW1lO1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ25hdmlnYXRlUmVxdWVzdC5fc2VsZicsIHtcbiAgICAgICAgIHRhcmdldDogJ19zZWxmJyxcbiAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0gKTtcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICRzY29wZS50b2dnbGVHcmlkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmdyaWQgKXsgcmV0dXJuOyB9XG4gICAgICB0b2dnbGVHcmlkKCk7XG4gICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9ICFtb2RlbC5ncmlkT3ZlcmxheTtcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICRzY29wZS50b2dnbGVXaWRnZXRPdXRsaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICBtb2RlbC53aWRnZXRPdmVybGF5ID0gIW1vZGVsLndpZGdldE92ZXJsYXk7XG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuKi9cbiAgIC8vIGZ1bmN0aW9uIHRvZ2dsZUdyaWQoKSB7XG4gICAvLyAgICBpZiggd2luZG93Lm9wZW5lciApIHtcbiAgIC8vICAgICAgIC8qIGdsb2JhbCBheERldmVsb3BlclRvb2xzVG9nZ2xlR3JpZCAqL1xuICAgLy8gICAgICAgYXhEZXZlbG9wZXJUb29sc1RvZ2dsZUdyaWQoIGNvbnRleHQucmVzb3VyY2VzLmdyaWQgKTtcbiAgIC8vICAgICAgIHJldHVybjtcbiAgIC8vICAgIH1cbiAgIC8vICAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAvLyAgICAgICB2YXIgZXZlbnQ7XG4gICAvLyAgICAgICBldmVudCA9IG5ldyBDdXN0b21FdmVudCggJ3Rvb2dsZUdyaWQnLCB7XG4gICAvLyAgICAgICAgICBkZXRhaWw6IEpTT04uc3RyaW5naWZ5KCBjb250ZXh0LnJlc291cmNlcy5ncmlkIClcbiAgIC8vICAgICAgIH0gKTtcbiAgIC8vICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgLy8gICAgfVxuICAgLy8gICAgZWxzZSBpZiggZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0ICkge1xuICAgLy8gICAgICAgdmFyIG1lc3NhZ2UgPSB7IHRleHQ6ICd0b29nbGVHcmlkJywgZGF0YTogY29udGV4dC5yZXNvdXJjZXMuZ3JpZCB9O1xuICAgLy8gICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAvLyAgICB9XG4gICAvLyB9XG4gICAvL1xuICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgIC8vXG4gICAvLyBmdW5jdGlvbiB0b2dnbGVXaWRnZXRPdXRsaW5lKCkge1xuICAgLy8gICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAvLyAgICAgICAvKiBnbG9iYWwgYXhEZXZlbG9wZXJUb29sc1RvZ2dsZVdpZGdldE91dGxpbmUgKi9cbiAgIC8vICAgICAgIGF4RGV2ZWxvcGVyVG9vbHNUb2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAvLyAgICAgICByZXR1cm47XG4gICAvLyAgICB9XG4gICAvLyAgICBpZiggaXNCcm93c2VyV2ViRXh0ZW5zaW9uICkge1xuICAgLy8gICAgICAgdmFyIGV2ZW50O1xuICAgLy8gICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoICd3aWRnZXRPdXRsaW5lJywgeyB9ICk7XG4gICAvLyAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgIC8vICAgIH1cbiAgIC8vICAgIGVsc2UgaWYoIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCApIHtcbiAgIC8vICAgICAgIHZhciBtZXNzYWdlID0geyB0ZXh0OiAnd2lkZ2V0T3V0bGluZScsIGRhdGE6IHt9IH07XG4gICAvLyAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KCBtZXNzYWdlICkgKTtcbiAgIC8vICAgIH1cbiAgIC8vIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICBmdW5jdGlvbiByZW5kZXJCdXR0b25zKCkge1xuICAgICAgICAgaWYoIG1vZGVsLmxheGFyICkge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPiB7IHJlbmRlckdyaWRCdXR0b24oKSB9IHsgcmVuZGVyV2lkZ2V0T3V0bGluZUJ1dHRvbigpIH0gPC9kaXY+O1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJHcmlkQnV0dG9uKCkge1xuICAgICAgICAgaWYoIHJlc291cmNlcy5ncmlkICkge1xuICAgICAgICAgICAgcmV0dXJuIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e21vZGVsLnRvZ2dsZUdyaWRUaXRsZX1cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUdyaWR9XG4gICAgICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsgJ2ZhIGZhLXRvZ2dsZS0nICsgKCBtb2RlbC5ncmlkT3ZlcmxheSA/ICdvbicgOiAnb2ZmJyApIH1cbiAgICAgICAgICAgICAgID48L2k+Jm5ic3A7KG1vZGVsLmdyaWRPdmVybGF5ID8gJ1R1cm4gb2ZmIGdyaWQgb3ZlcmxheScgOiAnVHVybiBvbiBncmlkIG92ZXJsYXknKTwvYnV0dG9uPjtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyV2lkZ2V0T3V0bGluZUJ1dHRvbigpIHtcbiAgICAgICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGlua1wiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVXaWRnZXRPdXRsaW5lfVxuICAgICAgICAgICAgICAgPjxpIGNsYXNzTmFtZT17ICdmYSBmYS10b2dnbGUtJyArICggbW9kZWwud2lkZ2V0T3ZlcmxheSA/ICdvbicgOiAnb2ZmJyApIH1cbiAgICAgICAgICAgICAgID48L2k+Jm5ic3A7KG1vZGVsLndpZGdldE92ZXJsYXkgPyAnVHVybiBvZmYgd2lkZ2V0IG91dGxpbmUnIDogJ1R1cm4gb24gd2lkZ2V0IG91dGxpbmUnKTwvYnV0dG9uPjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyVGFicygpIHtcbiAgICAgICAgIGlmKCAhbW9kZWwubGF4YXIgKSB7IHJldHVybjsgfVxuICAgICAgICAgY29uc3QgdGFiID0gbW9kZWwudGFicy5maW5kKCAoIHRhYiApID0+IG1vZGVsLmFjdGl2ZVRhYiA9PT0gdGFiICk7XG4gICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJhcHAtdGFiIGFwcC10YWItcGFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtYXgtd2lkZ2V0LWFyZWFcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1heC13aWRnZXQtYXJlYS1iaW5kaW5nPXt0YWIubmFtZX0+PC9kaXY+O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJUYWJMaXN0KCkge1xuICAgICAgICAgY29uc3QgbGlzdEl0ZW1zID0gbW9kZWwudGFicy5tYXAoICggdGFiICkgPT5cbiAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgY2xhc3NOYW1lPXsgKCBtb2RlbC5hY3RpdmVUYWIubmFtZSA9PT0gdGFiLm5hbWUgPyAnYXgtYWN0aXZlJzogJycgKSB9XG4gICAgICAgICAgICA+PGEgaHJlZj1cIlwiIG9uQ2xpY2s9e2FjdGl2YXRlVGFiKCB0YWIgKX0+e3RhYi5sYWJlbH08L2E+PC9saT5cbiAgICAgICAgICk7XG4gICAgICAgICByZXR1cm4gbGlzdEl0ZW1zO1xuICAgICAgfVxuXG5cblxuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAvLyAgIHsgcmVuZGVyQnV0dG9ucygpIH1cblxuICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXYtdGFic1wiXG4gICAgICAgICAgICAgcm9sZT1cInRhYmxpc3RcIj5cbiAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJkZXZlbG9wZXItdG9vbGJhci1pY29uXCJcbiAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkxheGFySlMgRG9jdW1lbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgaHJlZj1cImh0dHA6Ly93d3cubGF4YXJqcy5vcmcvZG9jc1wiXG4gICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHsgcmVuZGVyVGFiTGlzdCgpIH1cbiAgICAgICAgICAgIHsgbW9kZWwubGF4YXIgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGV2ZWxvcGVyLXRvb2xiYXItaGludFwiPnttb2RlbC5ub0xheGFyfTwvbGk+XG4gICAgICAgICAgICB9XG4gICAgICAgICA8L3VsPlxuICAgICAgICAgLy97IHJlbmRlclRhYnMgfVxuXG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZGV2ZWxvcGVyLXRvb2xiYXItd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheEV2ZW50QnVzJywgJ2F4UmVhY3RSZW5kZXInIF0sXG4gICBjcmVhdGVcbn07XG4iXX0=
