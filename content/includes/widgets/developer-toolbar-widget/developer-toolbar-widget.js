define(['exports', 'module', 'react', 'laxar-patterns', '../../lib/laxar-developer-tools/grid', '../../lib/laxar-developer-tools/widget-outline'], function (exports, module, _react, _laxarPatterns, _libLaxarDeveloperToolsGrid, _libLaxarDeveloperToolsWidgetOutline) {/**
                                                                                                                                                                                                                                                                           * Copyright 2016 aixigo AG
                                                                                                                                                                                                                                                                           * Released under the MIT license.
                                                                                                                                                                                                                                                                           * http://www.laxarjs.org
                                                                                                                                                                                                                                                                           */'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);







   function create(context, eventBus, reactRender, flowService) {
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



      var isBrowserWebExtension = window.chrome && chrome.runtime && chrome.runtime.id;
      var firefoxExtensionMessagePort;

      if (!window.opener) {
         window.addEventListener('message', function (event) {
            if (!firefoxExtensionMessagePort && event.ports) {
               model.noLaxar = HINT_NO_LAXAR_EXTENSION;
               firefoxExtensionMessagePort = event.ports[0];
               firefoxExtensionMessagePort.start();
               var message = { text: 'messagePortStarted' };
               firefoxExtensionMessagePort.postMessage(JSON.stringify(message));} else 
            {
               var channel = JSON.parse(event.detail || event.data);
               if (channel.text === 'reloadedPage') {
                  model.gridOverlay = false;
                  model.widgetOverlay = false;
                  $scope.$apply();}}});}





      context.resources = {};

      if (window.opener) {
         model.noLaxar = HINT_NO_LAXAR_ANYMORE_WIDGET;}


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



      if (isBrowserWebExtension) {
         chrome.devtools.network.onNavigated.addListener(function () {
            model.gridOverlay = false;
            model.widgetOverlay = false;
            render();});}



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
               _axPatterns['default'].visibility.requestPublisherForArea(context, area)(visible);}}


         render();});


      eventBus.subscribe('didChangeAreaVisibility.' + context.widget.area, function (event, meta) {
         if (!visible && event.visible) {
            visible = true;
            render();}});



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      eventBus.subscribe('takeActionRequest.navigation', function (event) {
         eventBus.publish('willTakeAction.navigation', { 
            action: 'navigation' });

         if (model.gridOverlay) {
            toggleGrid();}

         if (model.widgetOverlay) {
            toggleWidgetOutline();}

         eventBus.publish('didTakeAction.navigation', { 
            action: 'navigation' });

         render();});


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function onClickToggleGrid() {
         if (!context.resources.grid) {return;}
         toggleGrid();
         model.gridOverlay = !model.gridOverlay;
         render();}
      ;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function onClickToggleWidgetOutline() {
         toggleWidgetOutline();
         model.widgetOverlay = !model.widgetOverlay;
         render();}
      ;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function toggleGrid() {
         if (window.opener) {
            /* global axDeveloperToolsToggleGrid */
            axDeveloperToolsToggleGrid(context.resources.grid);
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
            axDeveloperToolsToggleWidgetOutline();
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
         var gridButton = '';
         if (context.resources.grid) {
            gridButton = 
            _React['default'].createElement('button', { className: 'btn btn-link', 
               title: model.toggleGridTitle, 
               type: 'button', 
               onClick: onClickToggleGrid }, 
            _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.gridOverlay ? 'on' : 'off') }), ' ', 
            model.gridOverlay ? 'Turn off grid overlay' : 'Turn on grid overlay');}



         var widgetOutlineButton = 
         _React['default'].createElement('button', { 
            className: 'btn btn-link', 
            type: 'button', 
            onClick: onClickToggleWidgetOutline }, 
         _React['default'].createElement('i', { className: 'fa fa-toggle-' + (model.widgetOverlay ? 'on' : 'off') }), ' ', 
         model.widgetOverlay ? 'Turn off widget outline' : 'Turn on widget outline');


         var optionButtons = '';
         if (model.laxar) {
            optionButtons = _React['default'].createElement('div', { className: 'pull-right' }, 
            gridButton, ' ', widgetOutlineButton);}



         var widgetArea = '';
         if (model.laxar) {
            var tab = model.tabs.find(function (tab) {return model.activeTab === tab;});
            var _name = tab ? tab.name : 'noTab';
            widgetArea = 
            _React['default'].createElement('div', { className: 'app-tab app-tab-page', 
               'data-ax-widget-area': _name });}




         var tabListItems = model.tabs.map(function (tab) {
            var url = flowService.constructAbsoluteUrl('tools', { 'tab': tab.name });
            if (model.activeTab && model.activeTab.name === tab.name) {
               return (
                  _React['default'].createElement('li', { key: tab.name, className: 'ax-active' }, 
                  _React['default'].createElement('a', { href: url }, 
                  tab.label)));} else 


            {
               return (
                  _React['default'].createElement('li', { key: tab.name }, 
                  _React['default'].createElement('a', { href: url }, 
                  tab.label)));}});




         var navTab = 
         _React['default'].createElement('ul', { className: 'nav nav-tabs', role: 'tablist' }, 
         _React['default'].createElement('li', null, _React['default'].createElement('a', { className: 'developer-toolbar-icon', 
            title: 'LaxarJS Documentation', 
            href: 'http://www.laxarjs.org/docs', 
            target: '_blank' })), 

         tabListItems, 
         model.laxar === false && 
         _React['default'].createElement('li', { className: 'developer-toolbar-hint' }, model.noLaxar));




         reactRender(
         _React['default'].createElement('div', null, 
         optionButtons, 
         navTab, 
         widgetArea));}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'developer-toolbar-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFHO0FBQzVELGtCQUFZLENBQUM7QUFDYixVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSx1QkFBdUIsR0FBRyxnREFBZ0QsQ0FBQztBQUMvRSxVQUFJLHdCQUF3QixHQUFHLGdFQUFnRSxDQUFDO0FBQ2hHLFVBQUksNEJBQTRCLEdBQUcsNkNBQTZDO0FBQzVDLCtEQUF5RCxDQUFDO0FBQzlGLFVBQUksbUJBQW1CLEdBQUcsZ0VBQWdFLENBQUM7O0FBRTNGLFVBQUksSUFBSSxHQUFHO0FBQ1IsUUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDbkMsUUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDL0IsUUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FDL0IsQ0FBQzs7O0FBRUYsVUFBSSxLQUFLLEdBQUc7QUFDVCxjQUFLLEVBQUUsSUFBSTtBQUNYLGFBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQVMsRUFBRSxJQUFJO0FBQ2Ysb0JBQVcsRUFBRSxLQUFLO0FBQ2xCLHNCQUFhLEVBQUUsS0FBSztBQUNwQix3QkFBZSxFQUFFLHdCQUF3QjtBQUN6QyxnQkFBTyxFQUFFLHVCQUF1QixFQUNsQyxDQUFDOzs7O0FBR0YsVUFBSSxxQkFBcUIsR0FBSyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEFBQUUsQ0FBQztBQUNyRixVQUFJLDJCQUEyQixDQUFDOztBQUVoQyxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRztBQUNsQixlQUFNLENBQUMsZ0JB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Q0FBQyxDQUNKOzs7Ozs7O0FBSUQsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTSxFQUN4QixDQUFDLENBQ0o7Ozs7QUFFYztBQUNaLFVBQUksRUFBRSwwQkFBMEI7QUFDaEMsZ0JBQVUsRUFBRSxDQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBRTtBQUMzRSxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3LmxheGFyanMub3JnXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheFBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcblxuaW1wb3J0ICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL2dyaWQnO1xuaW1wb3J0ICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL3dpZGdldC1vdXRsaW5lJztcblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIsIGZsb3dTZXJ2aWNlICkge1xuICAgJ3VzZSBzdHJpY3QnO1xuICAgbGV0IHZpc2libGUgPSBmYWxzZTtcbiAgIHZhciBISU5UX05PX0xBWEFSX0VYVEVOU0lPTiA9ICdSZWxvYWQgcGFnZSB0byBlbmFibGUgTGF4YXJKUyBkZXZlbG9wZXIgdG9vbHMhJztcbiAgIHZhciBISU5UX0RJU0FCTEVfVE9HR0xFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuICAgdmFyIEhJTlRfTk9fTEFYQVJfQU5ZTU9SRV9XSURHRVQgPSAnQ2Fubm90IGFjY2VzcyBMYXhhckpTIGhvc3Qgd2luZG93IChvciB0YWIpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBSZW9wZW4gbGF4YXItZGV2ZWxvcGVyLXRvb2xzIGZyb20gTGF4YXJKUyBob3N0IHdpbmRvdy4nO1xuICAgdmFyIEhJTlRfQ09ORklHVVJFX0dSSUQgPSAnQ29uZmlndXJlIGdyaWQgc2V0dGluZ3MgaW4gYXBwbGljYXRpb24gdG8gZW5hYmxlIHRoaXMgZmVhdHVyZSEnO1xuXG4gICB2YXIgVEFCUyA9IFtcbiAgICAgIHsgbmFtZTogJ2V2ZW50cycsIGxhYmVsOiAnRXZlbnRzJyB9LFxuICAgICAgeyBuYW1lOiAncGFnZScsIGxhYmVsOiAnUGFnZScgfSxcbiAgICAgIHsgbmFtZTogJ2xvZycsIGxhYmVsOiAnTG9nJyB9XG4gICBdO1xuXG4gICB2YXIgbW9kZWwgPSB7XG4gICAgICBsYXhhcjogdHJ1ZSxcbiAgICAgIHRhYnM6IFRBQlMsXG4gICAgICBhY3RpdmVUYWI6IG51bGwsXG4gICAgICBncmlkT3ZlcmxheTogZmFsc2UsXG4gICAgICB3aWRnZXRPdmVybGF5OiBmYWxzZSxcbiAgICAgIHRvZ2dsZUdyaWRUaXRsZTogSElOVF9ESVNBQkxFX1RPR0dMRV9HUklELFxuICAgICAgbm9MYXhhcjogSElOVF9OT19MQVhBUl9FWFRFTlNJT05cbiAgIH07XG5cblxuICAgdmFyIGlzQnJvd3NlcldlYkV4dGVuc2lvbiA9ICggd2luZG93LmNocm9tZSAmJiBjaHJvbWUucnVudGltZSAmJiBjaHJvbWUucnVudGltZS5pZCApO1xuICAgdmFyIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydDtcblxuICAgaWYoICF3aW5kb3cub3BlbmVyICkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgaWYoICFmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgJiYgZXZlbnQucG9ydHMgKSB7XG4gICAgICAgICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9FWFRFTlNJT047XG4gICAgICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgPSBldmVudC5wb3J0c1sgMCBdO1xuICAgICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnN0YXJ0KCk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ21lc3NhZ2VQb3J0U3RhcnRlZCcgfTtcbiAgICAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSApO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjaGFubmVsID0gSlNPTi5wYXJzZSggZXZlbnQuZGV0YWlsIHx8IGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgIGlmKCBjaGFubmVsLnRleHQgPT09ICdyZWxvYWRlZFBhZ2UnICkge1xuICAgICAgICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0gKTtcbiAgIH1cblxuICAgY29udGV4dC5yZXNvdXJjZXMgPSB7fTtcblxuICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9BTllNT1JFX1dJREdFVDtcbiAgIH1cblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZShcbiAgICAgICdncmlkJyxcbiAgICAgIHtcbiAgICAgICAgIG9uUmVwbGFjZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgICAgaWYoIGV2ZW50LmRhdGEgPT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICBtb2RlbC50b2dnbGVHcmlkVGl0bGUgPSBISU5UX0NPTkZJR1VSRV9HUklEO1xuICAgICAgICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgbW9kZWwudG9nZ2xlR3JpZFRpdGxlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG4gICApO1xuXG4gICBheFBhdHRlcm5zLmZsYWdzLmhhbmRsZXJGb3IoIGNvbnRleHQgKS5yZWdpc3RlckZsYWcoIGNvbnRleHQuZmVhdHVyZXMuZGV0YWlsc09uLCB7XG4gICAgICBpbml0aWFsU3RhdGU6IG1vZGVsLmxheGFyLFxuICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uKCBuZXdTdGF0ZSApIHtcbiAgICAgICAgIG1vZGVsLmxheGFyID0gbmV3U3RhdGU7XG4gICAgICB9XG4gICB9ICk7XG5cbiAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAgICBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vbk5hdmlnYXRlZC5hZGRMaXN0ZW5lciggZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgcmVuZGVyKClcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgYXhQYXR0ZXJucy52aXNpYmlsaXR5LmhhbmRsZXJGb3IoIGNvbnRleHQsIHsgb25BbnlBcmVhUmVxdWVzdDogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgdmFyIHByZWZpeCA9IGNvbnRleHQuaWQoKSArICcuJztcbiAgICAgIHZhciBhY3RpdmVUYWIgPSBtb2RlbC5hY3RpdmVUYWI7XG4gICAgICByZXR1cm4gZXZlbnQudmlzaWJsZSAmJiBhY3RpdmVUYWIgIT09IG51bGwgJiYgZXZlbnQuYXJlYSA9PT0gcHJlZml4ICsgYWN0aXZlVGFiLm5hbWU7XG4gICB9IH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkTmF2aWdhdGUnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICB2YXIgbmV3TmFtZSA9IGV2ZW50LmRhdGFbIGNvbnRleHQuZmVhdHVyZXMudGFicy5wYXJhbWV0ZXIgXTtcblxuICAgICAgdmFyIG5ld1RhYiA9IFRBQlMuZmlsdGVyKCBmdW5jdGlvbiggXyApIHsgcmV0dXJuIF8ubmFtZSA9PT0gbmV3TmFtZTsgfSApWyAwIF07XG4gICAgICBpZiggIW5ld1RhYiApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoIG1vZGVsLmFjdGl2ZVRhYiAhPT0gbmV3VGFiICkge1xuICAgICAgICAgcHVibGlzaFZpc2liaWxpdHkoIG1vZGVsLmFjdGl2ZVRhYiwgZmFsc2UgKTtcbiAgICAgICAgIHB1Ymxpc2hWaXNpYmlsaXR5KCBuZXdUYWIsIHRydWUgKTtcbiAgICAgIH1cbiAgICAgIG1vZGVsLmFjdGl2ZVRhYiA9IG5ld1RhYjtcblxuICAgICAgZnVuY3Rpb24gcHVibGlzaFZpc2liaWxpdHkoIHRhYiwgdmlzaWJsZSApIHtcbiAgICAgICAgIGlmKCB0YWIgKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IGNvbnRleHQuaWQoKSArICcuJyArIHRhYi5uYW1lO1xuICAgICAgICAgICAgYXhQYXR0ZXJucy52aXNpYmlsaXR5LnJlcXVlc3RQdWJsaXNoZXJGb3JBcmVhKCBjb250ZXh0LCBhcmVhICkoIHZpc2libGUgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlbmRlcigpO1xuICAgfSApO1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoIGBkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eS4ke2NvbnRleHQud2lkZ2V0LmFyZWF9YCwgKGV2ZW50LCBtZXRhKSA9PiB7XG4gICAgIGlmKCAhdmlzaWJsZSAmJiBldmVudC52aXNpYmxlICkge1xuICAgICAgICB2aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgIH1cbiAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC5uYXZpZ2F0aW9uJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3dpbGxUYWtlQWN0aW9uLm5hdmlnYXRpb24nLCB7XG4gICAgICAgICBhY3Rpb246ICduYXZpZ2F0aW9uJ1xuICAgICAgfSApO1xuICAgICAgaWYoIG1vZGVsLmdyaWRPdmVybGF5ICkge1xuICAgICAgICAgdG9nZ2xlR3JpZCgpO1xuICAgICAgfVxuICAgICAgaWYoIG1vZGVsLndpZGdldE92ZXJsYXkgKSB7XG4gICAgICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICB9XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi5uYXZpZ2F0aW9uJywge1xuICAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGlvbidcbiAgICAgIH0gKTtcbiAgICAgIHJlbmRlcigpO1xuICAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBvbkNsaWNrVG9nZ2xlR3JpZCgpIHtcbiAgICAgIGlmKCAhY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApeyByZXR1cm47IH1cbiAgICAgIHRvZ2dsZUdyaWQoKTtcbiAgICAgIG1vZGVsLmdyaWRPdmVybGF5ID0gIW1vZGVsLmdyaWRPdmVybGF5O1xuICAgICAgcmVuZGVyKCk7XG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBvbkNsaWNrVG9nZ2xlV2lkZ2V0T3V0bGluZSgpIHtcbiAgICAgIHRvZ2dsZVdpZGdldE91dGxpbmUoKTtcbiAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSAhbW9kZWwud2lkZ2V0T3ZlcmxheTtcbiAgICAgIHJlbmRlcigpO1xuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlR3JpZCgpIHtcbiAgICAgIGlmKCB3aW5kb3cub3BlbmVyICkge1xuICAgICAgICAgLyogZ2xvYmFsIGF4RGV2ZWxvcGVyVG9vbHNUb2dnbGVHcmlkICovXG4gICAgICAgICBheERldmVsb3BlclRvb2xzVG9nZ2xlR3JpZCggY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYoIGlzQnJvd3NlcldlYkV4dGVuc2lvbiApIHtcbiAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCAndG9vZ2xlR3JpZCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogSlNPTi5zdHJpbmdpZnkoIGNvbnRleHQucmVzb3VyY2VzLmdyaWQgKVxuICAgICAgICAgfSApO1xuICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgKSB7XG4gICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ3Rvb2dsZUdyaWQnLCBkYXRhOiBjb250ZXh0LnJlc291cmNlcy5ncmlkIH07XG4gICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KCBtZXNzYWdlICkgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlV2lkZ2V0T3V0bGluZSgpIHtcbiAgICAgIGlmKCB3aW5kb3cub3BlbmVyICkge1xuICAgICAgICAgLyogZ2xvYmFsIGF4RGV2ZWxvcGVyVG9vbHNUb2dnbGVXaWRnZXRPdXRsaW5lICovXG4gICAgICAgICBheERldmVsb3BlclRvb2xzVG9nZ2xlV2lkZ2V0T3V0bGluZSgpO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYoIGlzQnJvd3NlcldlYkV4dGVuc2lvbiApIHtcbiAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCAnd2lkZ2V0T3V0bGluZScsIHsgfSApO1xuICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgKSB7XG4gICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ3dpZGdldE91dGxpbmUnLCBkYXRhOiB7fSB9O1xuICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIGxldCBncmlkQnV0dG9uID0gJyc7XG4gICAgICBpZiggY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApIHtcbiAgICAgICAgIGdyaWRCdXR0b24gPSAoXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGlua1wiXG4gICAgICAgICAgICAgICAgIHRpdGxlPXttb2RlbC50b2dnbGVHcmlkVGl0bGV9XG4gICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrVG9nZ2xlR3JpZH1cbiAgICAgICAgICAgID48aSBjbGFzc05hbWU9eyAnZmEgZmEtdG9nZ2xlLScgKyAoIG1vZGVsLmdyaWRPdmVybGF5ID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgPjwvaT4mbmJzcDt7bW9kZWwuZ3JpZE92ZXJsYXkgPyAnVHVybiBvZmYgZ3JpZCBvdmVybGF5JyA6ICdUdXJuIG9uIGdyaWQgb3ZlcmxheSd9PC9idXR0b24+XG4gICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3aWRnZXRPdXRsaW5lQnV0dG9uID0gKFxuICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17b25DbGlja1RvZ2dsZVdpZGdldE91dGxpbmV9XG4gICAgICAgICAgICA+PGkgY2xhc3NOYW1lPXsgJ2ZhIGZhLXRvZ2dsZS0nICsgKCBtb2RlbC53aWRnZXRPdmVybGF5ID8gJ29uJyA6ICdvZmYnICkgfVxuICAgICAgICAgICAgPjwvaT4mbmJzcDt7bW9kZWwud2lkZ2V0T3ZlcmxheSA/ICdUdXJuIG9mZiB3aWRnZXQgb3V0bGluZScgOiAnVHVybiBvbiB3aWRnZXQgb3V0bGluZSd9PC9idXR0b24+XG4gICAgICApO1xuXG4gICAgICBsZXQgb3B0aW9uQnV0dG9ucyA9ICcnO1xuICAgICAgaWYoIG1vZGVsLmxheGFyICkge1xuICAgICAgICAgb3B0aW9uQnV0dG9ucyA9IDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgeyBncmlkQnV0dG9uIH0geyB3aWRnZXRPdXRsaW5lQnV0dG9uIH1cbiAgICAgICAgIDwvZGl2PjtcbiAgICAgIH1cblxuICAgICAgbGV0IHdpZGdldEFyZWEgPSAnJztcbiAgICAgIGlmKCBtb2RlbC5sYXhhciApIHtcbiAgICAgICAgIGNvbnN0IHRhYiA9IG1vZGVsLnRhYnMuZmluZCggKCB0YWIgKSA9PiBtb2RlbC5hY3RpdmVUYWIgPT09IHRhYiApO1xuICAgICAgICAgY29uc3QgbmFtZSA9IHRhYiA/IHRhYi5uYW1lIDogJ25vVGFiJztcbiAgICAgICAgIHdpZGdldEFyZWEgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcC10YWIgYXBwLXRhYi1wYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1heC13aWRnZXQtYXJlYT17bmFtZX0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhYkxpc3RJdGVtcyA9IG1vZGVsLnRhYnMubWFwKCAoIHRhYiApID0+IHtcbiAgICAgICAgIGNvbnN0IHVybCA9IGZsb3dTZXJ2aWNlLmNvbnN0cnVjdEFic29sdXRlVXJsKCAndG9vbHMnLCB7ICd0YWInOiB0YWIubmFtZSB9IClcbiAgICAgICAgIGlmKCBtb2RlbC5hY3RpdmVUYWIgJiYgbW9kZWwuYWN0aXZlVGFiLm5hbWUgPT09IHRhYi5uYW1lICkge1xuICAgICAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgICAgPGxpIGtleT17dGFiLm5hbWV9IGNsYXNzTmFtZT0nYXgtYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgPjxhIGhyZWY9e3VybH1cbiAgICAgICAgICAgICAgICAgID57dGFiLmxhYmVsfTwvYT48L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgICAgPGxpIGtleT17dGFiLm5hbWV9XG4gICAgICAgICAgICAgICAgICA+PGEgaHJlZj17dXJsfVxuICAgICAgICAgICAgICAgICAgPnt0YWIubGFiZWx9PC9hPjwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfSApO1xuXG4gICAgICBjb25zdCBuYXZUYWIgPSAoXG4gICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdi10YWJzXCIgcm9sZT1cInRhYmxpc3RcIj5cbiAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJkZXZlbG9wZXItdG9vbGJhci1pY29uXCJcbiAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkxheGFySlMgRG9jdW1lbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgaHJlZj1cImh0dHA6Ly93d3cubGF4YXJqcy5vcmcvZG9jc1wiXG4gICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHsgdGFiTGlzdEl0ZW1zIH1cbiAgICAgICAgICAgIHsgbW9kZWwubGF4YXIgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGV2ZWxvcGVyLXRvb2xiYXItaGludFwiPnttb2RlbC5ub0xheGFyfTwvbGk+XG4gICAgICAgICAgICB9XG4gICAgICAgICA8L3VsPlxuICAgICAgKTtcblxuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgeyBvcHRpb25CdXR0b25zIH1cbiAgICAgICAgICAgIHsgbmF2VGFiIH1cbiAgICAgICAgICAgIHsgd2lkZ2V0QXJlYSB9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZGV2ZWxvcGVyLXRvb2xiYXItd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheEV2ZW50QnVzJywgJ2F4UmVhY3RSZW5kZXInLCAnYXhGbG93U2VydmljZScgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
