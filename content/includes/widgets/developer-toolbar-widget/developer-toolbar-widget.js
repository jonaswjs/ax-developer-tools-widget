define(['exports', 'module', 'react', 'laxar-patterns'], function (exports, module, _react, _laxarPatterns) {/**
                                                                                                              * Copyright 2016 aixigo AG
                                                                                                              * Released under the MIT license.
                                                                                                              * http://www.laxarjs.org
                                                                                                              */'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);





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
         var 
         TabItem = (function (_React$Component) {_inherits(TabItem, _React$Component);
            function TabItem(properties) {_classCallCheck(this, TabItem);
               _get(Object.getPrototypeOf(TabItem.prototype), 'constructor', this).call(this, properties);
               this.tab = properties.tab;
               this.active = properties.active;
               // This binding is necessary to make `this` work in the callback
               this.activateTab = this.activateTab.bind(this);}_createClass(TabItem, [{ key: 'activateTab', value: 


               function activateTab() {
                  var data = {};
                  data[context.features.tabs.parameter] = this.tab.name;
                  eventBus.publish('navigateRequest._self', { 
                     target: '_self', 
                     data: data });} }, { key: 'render', value: 



               function render() {
                  if (this.active) {
                     return (
                        _React['default'].createElement('li', { 
                           className: 'ax-active' }, 
                        _React['default'].createElement('a', { href: '', onClick: this.activateTab }, this.tab.label)));}


                  return (
                     _React['default'].createElement('li', null, _React['default'].createElement('a', { href: '', onClick: this.activateTab }, this.tab.label)));} }]);return TabItem;})(_React['default'].Component);




         var tabListItems = model.tabs.map(function (tab) {return (
               _React['default'].createElement(TabItem, { key: tab.name, tab: tab, active: model.activeTab && model.activeTab.name === tab.name ? true : false }));});


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUM5QyxrQkFBWSxDQUFDO0FBQ2IsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksdUJBQXVCLEdBQUcsZ0RBQWdELENBQUM7QUFDL0UsVUFBSSx3QkFBd0IsR0FBRyxnRUFBZ0UsQ0FBQztBQUNoRyxVQUFJLDRCQUE0QixHQUFHLDZDQUE2QztBQUM1QywrREFBeUQsQ0FBQztBQUM5RixVQUFJLG1CQUFtQixHQUFHLGdFQUFnRSxDQUFDOztBQUUzRixVQUFJLElBQUksR0FBRztBQUNSLFFBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ25DLFFBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQy9CLFFBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQy9CLENBQUM7OztBQUVGLFVBQUksS0FBSyxHQUFHO0FBQ1QsY0FBSyxFQUFFLElBQUk7QUFDWCxhQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFTLEVBQUUsSUFBSTtBQUNmLG9CQUFXLEVBQUUsS0FBSztBQUNsQixzQkFBYSxFQUFFLEtBQUs7QUFDcEIsd0JBQWUsRUFBRSx3QkFBd0I7QUFDekMsZ0JBQU8sRUFBRSx1QkFBdUIsRUFDbEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkYsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPdkIsNkJBQVcsU0FBUyxDQUFDLFVBQVUsQ0FBRSxPQUFPLENBQUUsQ0FBQywyQkFBMkI7QUFDbkUsWUFBTTtBQUNOO0FBQ0csa0JBQVMsRUFBRSxtQkFBVSxLQUFLLEVBQUc7QUFDMUIsZ0JBQUks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Ozs7QUFFTCxhQUFNLFlBQVksR0FBRyx3Q0FBSyxTQUFTLEVBQUMsY0FBYztBQUNuQyxnQkFBSSxFQUFDLFNBQVM7QUFDdkIscURBQUksdUNBQUcsU0FBUyxFQUFDLHdCQUF3QjtBQUNsQyxpQkFBSyxFQUFDLHVCQUF1QjtBQUM3QixnQkFBSSxFQUFDLDZCQUE2QjtBQUNsQyxrQkFBTSxFQUFDLFFBQVEsR0FBSyxDQUN0Qjs7QUFDSCxxQkFBWTtBQUNaLGNBQUssQ0FBQyxLQUFLLEtBQUssS0FBSztBQUNwQixpREFBSSxTQUFTLEVBQUMsd0JBQXdCLElBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBTSxDQUU1RCxDQUFDOzs7Ozs7QUFJVCxvQkFBVztBQUNSO0FBQ0Usc0JBQWEsRUFBRTtBQUNmLHFCQUFZO0FBQ2IsbUJBQVUsRUFBRSxDQUNQLENBQ1IsQ0FBQyxDQUNKOzs7Ozs7O0FBSUQsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTSxFQUN4QixDQUFDLENBQ0o7Ozs7O0FBR2M7QUFDWixVQUFJLEVBQUUsMEJBQTBCO0FBQ2hDLGdCQUFVLEVBQUUsQ0FBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBRTtBQUMxRCxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImRldmVsb3Blci10b29sYmFyLXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3LmxheGFyanMub3JnXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheFBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcblxuXG4vLyAgICcuLi8uLi9saWIvbGF4YXItZGV2ZWxvcGVyLXRvb2xzL2dyaWQnLFxuLy8gICAnLi4vLi4vbGliL2xheGFyLWRldmVsb3Blci10b29scy93aWRnZXQtb3V0bGluZSdcblxuXG4gICAvKiBnbG9iYWwgY2hyb21lICovXG4gICAvLyBUaGlzIGNvbnRyb2xsZXIgcGVyZm9ybXMgaGVhdnkgRE9NLW1hbmlwdWxhdGlvbiwgd2hpY2ggeW91IHdvdWxkIG5vcm1hbGx5IHB1dCBpbnRvIGEgZGlyZWN0aXZlLlxuICAgLy8gSG93ZXZlciwgb25seSB0aGUgRE9NIG9mIHRoZSBob3N0IGFwcGxpY2F0aW9uIGlzIG1hbmlwdWxhdGVkLCBzbyB0aGlzIGlzIGFjY2VwdGFibGUuXG5cblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIpIHtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIGxldCB2aXNpYmxlID0gZmFsc2U7XG4gICB2YXIgSElOVF9OT19MQVhBUl9FWFRFTlNJT04gPSAnUmVsb2FkIHBhZ2UgdG8gZW5hYmxlIExheGFySlMgZGV2ZWxvcGVyIHRvb2xzISc7XG4gICB2YXIgSElOVF9ESVNBQkxFX1RPR0dMRV9HUklEID0gJ0NvbmZpZ3VyZSBncmlkIHNldHRpbmdzIGluIGFwcGxpY2F0aW9uIHRvIGVuYWJsZSB0aGlzIGZlYXR1cmUhJztcbiAgIHZhciBISU5UX05PX0xBWEFSX0FOWU1PUkVfV0lER0VUID0gJ0Nhbm5vdCBhY2Nlc3MgTGF4YXJKUyBob3N0IHdpbmRvdyAob3IgdGFiKS4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgUmVvcGVuIGxheGFyLWRldmVsb3Blci10b29scyBmcm9tIExheGFySlMgaG9zdCB3aW5kb3cuJztcbiAgIHZhciBISU5UX0NPTkZJR1VSRV9HUklEID0gJ0NvbmZpZ3VyZSBncmlkIHNldHRpbmdzIGluIGFwcGxpY2F0aW9uIHRvIGVuYWJsZSB0aGlzIGZlYXR1cmUhJztcblxuICAgdmFyIFRBQlMgPSBbXG4gICAgICB7IG5hbWU6ICdldmVudHMnLCBsYWJlbDogJ0V2ZW50cycgfSxcbiAgICAgIHsgbmFtZTogJ3BhZ2UnLCBsYWJlbDogJ1BhZ2UnIH0sXG4gICAgICB7IG5hbWU6ICdsb2cnLCBsYWJlbDogJ0xvZycgfVxuICAgXTtcblxuICAgdmFyIG1vZGVsID0ge1xuICAgICAgbGF4YXI6IHRydWUsXG4gICAgICB0YWJzOiBUQUJTLFxuICAgICAgYWN0aXZlVGFiOiBudWxsLFxuICAgICAgZ3JpZE92ZXJsYXk6IGZhbHNlLFxuICAgICAgd2lkZ2V0T3ZlcmxheTogZmFsc2UsXG4gICAgICB0b2dnbGVHcmlkVGl0bGU6IEhJTlRfRElTQUJMRV9UT0dHTEVfR1JJRCxcbiAgICAgIG5vTGF4YXI6IEhJTlRfTk9fTEFYQVJfRVhURU5TSU9OXG4gICB9O1xuXG4gICAvKlxuICAgdmFyIGlzQnJvd3NlcldlYkV4dGVuc2lvbiA9ICggd2luZG93LmNocm9tZSAmJiBjaHJvbWUucnVudGltZSAmJiBjaHJvbWUucnVudGltZS5pZCApO1xuICAgdmFyIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydDtcblxuICAgaWYoICF3aW5kb3cub3BlbmVyICkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgaWYoICFmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgJiYgZXZlbnQucG9ydHMgKSB7XG4gICAgICAgICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9FWFRFTlNJT047XG4gICAgICAgICAgICBmaXJlZm94RXh0ZW5zaW9uTWVzc2FnZVBvcnQgPSBldmVudC5wb3J0c1sgMCBdO1xuICAgICAgICAgICAgZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0LnN0YXJ0KCk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHsgdGV4dDogJ21lc3NhZ2VQb3J0U3RhcnRlZCcgfTtcbiAgICAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSApO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjaGFubmVsID0gSlNPTi5wYXJzZSggZXZlbnQuZGV0YWlsIHx8IGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgIGlmKCBjaGFubmVsLnRleHQgPT09ICdyZWxvYWRlZFBhZ2UnICkge1xuICAgICAgICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0gKTtcbiAgIH1cbiovXG4gICBjb250ZXh0LnJlc291cmNlcyA9IHt9O1xuLypcblxuICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICBtb2RlbC5ub0xheGFyID0gSElOVF9OT19MQVhBUl9BTllNT1JFX1dJREdFVDtcbiAgIH1cbiovXG4gICBheFBhdHRlcm5zLnJlc291cmNlcy5oYW5kbGVyRm9yKCBjb250ZXh0ICkucmVnaXN0ZXJSZXNvdXJjZUZyb21GZWF0dXJlKFxuICAgICAgJ2dyaWQnLFxuICAgICAge1xuICAgICAgICAgb25SZXBsYWNlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICAgICBpZiggZXZlbnQuZGF0YSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgIG1vZGVsLnRvZ2dsZUdyaWRUaXRsZSA9IEhJTlRfQ09ORklHVVJFX0dSSUQ7XG4gICAgICAgICAgICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICBtb2RlbC50b2dnbGVHcmlkVGl0bGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cbiAgICk7XG5cbiAgIGF4UGF0dGVybnMuZmxhZ3MuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyRmxhZyggY29udGV4dC5mZWF0dXJlcy5kZXRhaWxzT24sIHtcbiAgICAgIGluaXRpYWxTdGF0ZTogbW9kZWwubGF4YXIsXG4gICAgICBvbkNoYW5nZTogZnVuY3Rpb24oIG5ld1N0YXRlICkge1xuICAgICAgICAgbW9kZWwubGF4YXIgPSBuZXdTdGF0ZTtcbiAgICAgIH1cbiAgIH0gKTtcbi8qXG4gICBpZiggaXNCcm93c2VyV2ViRXh0ZW5zaW9uICkge1xuICAgICAgY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25OYXZpZ2F0ZWQuYWRkTGlzdGVuZXIoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgbW9kZWwuZ3JpZE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgIG1vZGVsLndpZGdldE92ZXJsYXkgPSBmYWxzZTtcbiAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgIH0gKTtcbiAgIH1cbiovXG4gICBheFBhdHRlcm5zLnZpc2liaWxpdHkuaGFuZGxlckZvciggY29udGV4dCwgeyBvbkFueUFyZWFSZXF1ZXN0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICB2YXIgcHJlZml4ID0gY29udGV4dC5pZCgpICsgJy4nO1xuICAgICAgdmFyIGFjdGl2ZVRhYiA9IG1vZGVsLmFjdGl2ZVRhYjtcbiAgICAgIHJldHVybiBldmVudC52aXNpYmxlICYmIGFjdGl2ZVRhYiAhPT0gbnVsbCAmJiBldmVudC5hcmVhID09PSBwcmVmaXggKyBhY3RpdmVUYWIubmFtZTtcbiAgIH0gfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICdkaWROYXZpZ2F0ZScsIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgIHZhciBuZXdOYW1lID0gZXZlbnQuZGF0YVsgY29udGV4dC5mZWF0dXJlcy50YWJzLnBhcmFtZXRlciBdO1xuICAgICAgdmFyIG5ld1RhYiA9IFRBQlMuZmlsdGVyKCBmdW5jdGlvbiggXyApIHsgcmV0dXJuIF8ubmFtZSA9PT0gbmV3TmFtZTsgfSApWyAwIF07XG4gICAgICBpZiggIW5ld1RhYiApIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuXG4gICAgICBpZiggbW9kZWwuYWN0aXZlVGFiICE9PSBuZXdUYWIgKSB7XG4gICAgICAgICBwdWJsaXNoVmlzaWJpbGl0eSggbW9kZWwuYWN0aXZlVGFiLCBmYWxzZSApO1xuICAgICAgICAgcHVibGlzaFZpc2liaWxpdHkoIG5ld1RhYiwgdHJ1ZSApO1xuICAgICAgfVxuICAgICAgbW9kZWwuYWN0aXZlVGFiID0gbmV3VGFiO1xuXG4gICAgICBmdW5jdGlvbiBwdWJsaXNoVmlzaWJpbGl0eSggdGFiLCB2aXNpYmxlICkge1xuICAgICAgICAgaWYoIHRhYiApIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gY29udGV4dC5pZCgpICsgJy4nICsgdGFiLm5hbWU7XG4gICAgICAgICAgICBheFBhdHRlcm5zLnZpc2liaWxpdHkucmVxdWVzdFB1Ymxpc2hlckZvckFyZWEoIGNvbnRleHQsIGFyZWEgKSggdmlzaWJsZSApO1xuICAgICAgICAgfVxuICAgICAgfVxuICAgfSApO1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoIGBkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eS4ke2NvbnRleHQud2lkZ2V0LmFyZWF9YCwgKGV2ZW50LCBtZXRhKSA9PiB7XG4gICAgIGlmKCAhdmlzaWJsZSAmJiBldmVudC52aXNpYmxlICkge1xuICAgICAgICB2aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgIH1cbiAgfSApO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC5uYXZpZ2F0aW9uJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgZXZlbnRCdXMucHVibGlzaCggJ3dpbGxUYWtlQWN0aW9uLm5hdmlnYXRpb24nLCB7XG4gICAgICAgICBhY3Rpb246ICduYXZpZ2F0aW9uJ1xuICAgICAgfSApO1xuICAgICAgaWYoIG1vZGVsLmdyaWRPdmVybGF5ICkge1xuICAgICAgICAgdG9nZ2xlR3JpZCgpO1xuICAgICAgfVxuICAgICAgaWYoIG1vZGVsLndpZGdldE92ZXJsYXkgKSB7XG4gICAgICAgICB0b2dnbGVXaWRnZXRPdXRsaW5lKCk7XG4gICAgICB9XG4gICAgICBldmVudEJ1cy5wdWJsaXNoKCAnZGlkVGFrZUFjdGlvbi5uYXZpZ2F0aW9uJywge1xuICAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGlvbidcbiAgICAgIH0gKTtcbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gb25DbGlja1RvZ2dsZUdyaWQoKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmdyaWQgKXsgcmV0dXJuOyB9XG4gICAgICB0b2dnbGVHcmlkKCk7XG4gICAgICBtb2RlbC5ncmlkT3ZlcmxheSA9ICFtb2RlbC5ncmlkT3ZlcmxheTtcbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG9uQ2xpY2tUb2dnbGVXaWRnZXRPdXRsaW5lKCkge1xuICAgICAgdG9nZ2xlV2lkZ2V0T3V0bGluZSgpO1xuICAgICAgbW9kZWwud2lkZ2V0T3ZlcmxheSA9ICFtb2RlbC53aWRnZXRPdmVybGF5O1xuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gdG9nZ2xlR3JpZCgpIHtcbiAgICAgIGlmKCB3aW5kb3cub3BlbmVyICkge1xuICAgICAgICAgLyogZ2xvYmFsIGF4RGV2ZWxvcGVyVG9vbHNUb2dnbGVHcmlkICovXG4gICAgICAgICAvL2F4RGV2ZWxvcGVyVG9vbHNUb2dnbGVHcmlkKCBjb250ZXh0LnJlc291cmNlcy5ncmlkICk7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiggaXNCcm93c2VyV2ViRXh0ZW5zaW9uICkge1xuICAgICAgICAgdmFyIGV2ZW50O1xuICAgICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoICd0b29nbGVHcmlkJywge1xuICAgICAgICAgICAgZGV0YWlsOiBKU09OLnN0cmluZ2lmeSggY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApXG4gICAgICAgICB9ICk7XG4gICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydCApIHtcbiAgICAgICAgIHZhciBtZXNzYWdlID0geyB0ZXh0OiAndG9vZ2xlR3JpZCcsIGRhdGE6IGNvbnRleHQucmVzb3VyY2VzLmdyaWQgfTtcbiAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB0b2dnbGVXaWRnZXRPdXRsaW5lKCkge1xuICAgICAgaWYoIHdpbmRvdy5vcGVuZXIgKSB7XG4gICAgICAgICAvKiBnbG9iYWwgYXhEZXZlbG9wZXJUb29sc1RvZ2dsZVdpZGdldE91dGxpbmUgKi9cbiAgICAgICAgIC8vYXhEZXZlbG9wZXJUb29sc1RvZ2dsZVdpZGdldE91dGxpbmUoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmKCBpc0Jyb3dzZXJXZWJFeHRlbnNpb24gKSB7XG4gICAgICAgICB2YXIgZXZlbnQ7XG4gICAgICAgICBldmVudCA9IG5ldyBDdXN0b21FdmVudCggJ3dpZGdldE91dGxpbmUnLCB7IH0gKTtcbiAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiggZmlyZWZveEV4dGVuc2lvbk1lc3NhZ2VQb3J0ICkge1xuICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7IHRleHQ6ICd3aWRnZXRPdXRsaW5lJywgZGF0YToge30gfTtcbiAgICAgICAgIGZpcmVmb3hFeHRlbnNpb25NZXNzYWdlUG9ydC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbnMoKSB7XG4gICAgICAgICBpZiggbW9kZWwubGF4YXIgKSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+IHsgcmVuZGVyR3JpZEJ1dHRvbigpIH0geyByZW5kZXJXaWRnZXRPdXRsaW5lQnV0dG9uKCkgfSA8L2Rpdj47XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckdyaWRCdXR0b24oKSB7XG4gICAgICAgICBpZiggY29udGV4dC5yZXNvdXJjZXMuZ3JpZCApIHtcbiAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGlua1wiXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlPXttb2RlbC50b2dnbGVHcmlkVGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrVG9nZ2xlR3JpZCgpfVxuICAgICAgICAgICAgICAgPjxpIGNsYXNzTmFtZT17ICdmYSBmYS10b2dnbGUtJyArICggbW9kZWwuZ3JpZE92ZXJsYXkgPyAnb24nIDogJ29mZicgKSB9XG4gICAgICAgICAgICAgICA+PC9pPiZuYnNwO3ttb2RlbC5ncmlkT3ZlcmxheSA/ICdUdXJuIG9mZiBncmlkIG92ZXJsYXknIDogJ1R1cm4gb24gZ3JpZCBvdmVybGF5J308L2J1dHRvbj47XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlcldpZGdldE91dGxpbmVCdXR0b24oKSB7XG4gICAgICAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmtcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17b25DbGlja1RvZ2dsZVdpZGdldE91dGxpbmUoKX0+PGkgY2xhc3NOYW1lPXsgJ2ZhIGZhLXRvZ2dsZS0nICsgKCBtb2RlbC53aWRnZXRPdmVybGF5ID8gJ29uJyA6ICdvZmYnICkgfT48L2k+Jm5ic3A7e21vZGVsLndpZGdldE92ZXJsYXkgPyAnVHVybiBvZmYgd2lkZ2V0IG91dGxpbmUnIDogJ1R1cm4gb24gd2lkZ2V0IG91dGxpbmUnfTwvYnV0dG9uPjtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyVGFicygpIHtcbiAgICAgICAgIGlmKCAhbW9kZWwubGF4YXIgKSB7IHJldHVybjsgfVxuICAgICAgICAgY29uc3QgdGFiID0gbW9kZWwudGFicy5maW5kKCAoIHRhYiApID0+IG1vZGVsLmFjdGl2ZVRhYiA9PT0gdGFiICk7XG4gICAgICAgICBjb25zdCBuYW1lID0gdGFiID8gdGFiLm5hbWUgOiAnbm9UYWInO1xuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwLXRhYiBhcHAtdGFiLXBhZ2VcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWF4LXdpZGdldC1hcmVhPXtuYW1lfT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBUYWJJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wZXJ0aWVzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BlcnRpZXMgKTtcbiAgICAgICAgICAgIHRoaXMudGFiID0gcHJvcGVydGllcy50YWI7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHByb3BlcnRpZXMuYWN0aXZlO1xuICAgICAgICAgICAgLy8gVGhpcyBiaW5kaW5nIGlzIG5lY2Vzc2FyeSB0byBtYWtlIGB0aGlzYCB3b3JrIGluIHRoZSBjYWxsYmFja1xuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZVRhYiA9IHRoaXMuYWN0aXZhdGVUYWIuYmluZCggdGhpcyApO1xuICAgICAgICAgfVxuXG4gICAgICAgICBhY3RpdmF0ZVRhYigpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhWyBjb250ZXh0LmZlYXR1cmVzLnRhYnMucGFyYW1ldGVyIF0gPSB0aGlzLnRhYi5uYW1lO1xuICAgICAgICAgICAgZXZlbnRCdXMucHVibGlzaCggJ25hdmlnYXRlUmVxdWVzdC5fc2VsZicsIHtcbiAgICAgICAgICAgICAgIHRhcmdldDogJ19zZWxmJyxcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYoIHRoaXMuYWN0aXZlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdheC1hY3RpdmUnXG4gICAgICAgICAgICAgICAgICA+PGEgaHJlZj1cIlwiIG9uQ2xpY2s9e3RoaXMuYWN0aXZhdGVUYWJ9Pnt0aGlzLnRhYi5sYWJlbH08L2E+PC9saT5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJcIiBvbkNsaWNrPXt0aGlzLmFjdGl2YXRlVGFifT57dGhpcy50YWIubGFiZWx9PC9hPjwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWJMaXN0SXRlbXMgPSBtb2RlbC50YWJzLm1hcCggKCB0YWIgKSA9PlxuICAgICAgICAgICAgPFRhYkl0ZW0ga2V5PXt0YWIubmFtZX0gdGFiPXt0YWJ9IGFjdGl2ZT17ICggbW9kZWwuYWN0aXZlVGFiICYmIG1vZGVsLmFjdGl2ZVRhYi5uYW1lID09PSB0YWIubmFtZSA/IHRydWU6IGZhbHNlICkgfS8+XG4gICAgICAgICApO1xuXG4gICAgICBjb25zdCByZW5kZXJOYXZUYWIgPSA8dWwgIGNsYXNzTmFtZT1cIm5hdiBuYXYtdGFic1wiXG4gICAgICAgICAgICAgICAgICAgICByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cImRldmVsb3Blci10b29sYmFyLWljb25cIlxuICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiTGF4YXJKUyBEb2N1bWVudGF0aW9uXCJcbiAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cDovL3d3dy5sYXhhcmpzLm9yZy9kb2NzXCJcbiAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgeyB0YWJMaXN0SXRlbXMgfVxuICAgICAgICAgICAgeyBtb2RlbC5sYXhhciA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkZXZlbG9wZXItdG9vbGJhci1oaW50XCI+e21vZGVsLm5vTGF4YXJ9PC9saT5cbiAgICAgICAgICAgIH1cbiAgICAgICAgIDwvdWw+O1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICB7IHJlbmRlckJ1dHRvbnMoKSB9XG4gICAgICAgICB7IHJlbmRlck5hdlRhYiB9XG4gICAgICAgICB7cmVuZGVyVGFicygpfVxuICAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZGV2ZWxvcGVyLXRvb2xiYXItd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheEV2ZW50QnVzJywgJ2F4UmVhY3RSZW5kZXInIF0sXG4gICBjcmVhdGVcbn07XG4iXX0=
