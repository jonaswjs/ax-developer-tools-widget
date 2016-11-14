define(['exports', 'module', 'react', 'laxar', 'moment'], function (exports, module, _react, _laxar, _moment) {/**
                                                                                                                * Copyright 2016 aixigo AG
                                                                                                                * Released under the MIT license.
                                                                                                                * http://laxarjs.org/license
                                                                                                                */'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _ax = _interopRequireDefault(_laxar);var _moment2 = _interopRequireDefault(_moment);





   function create(context, eventBus, reactRender) {
      'use strict';

      var model = { 
         messages: [] };


      var commands = { 
         discard: function discard() {
            model.messages.length = 0;} };



      if (context.features.log.stream) {
         eventBus.subscribe('didProduce.' + context.features.log.stream, function (event) {
            if (Array.isArray(event.data)) {
               event.data.forEach(displayLogMessage);} else 

            {
               displayLogMessage(event.data);}});}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function displayLogMessage(message) {
         model.messages.unshift({ 
            text: _ax['default'].string.format(message.text, message.replacements), 
            level: message.level, 
            time: message.time, 
            location: message.sourceInfo.file + ':' + message.sourceInfo.line });


         while (model.messages.length > context.features.log.bufferSize) {
            model.messages.pop();}}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {

         function formatTime(date) {
            return (0, _moment2['default'])(date).format('YYYY-MM-DD HH:mm:ss.SSS');}


         var messages = model.messages.map(function (message) {return (
               _React['default'].createElement('tr', null, 
               _React['default'].createElement('td', null, message.level), 
               _React['default'].createElement('td', null, message.text), 
               _React['default'].createElement('td', null, message.location), 
               _React['default'].createElement('td', null, formatTime(message.time))));});



         reactRender(
         _React['default'].createElement('div', null, 
         _React['default'].createElement('div', { className: 'ax-affix-area', 
            'ax-affix': true, 
            'ax-affix-offset-top': '100' }, 
         _React['default'].createElement('div', { className: 'ax-button-wrapper' }, 
         _React['default'].createElement('button', { 
            type: 'button', 
            className: (!model.messages.length ? 'ax-disabled' : '') + "btn btn-primary btn-sm", 
            onClick: 'commands.discard' }, 'Clear'))), 




         !model.messages.length && 
         _React['default'].createElement('div', { className: 'text-large' }, 
         _React['default'].createElement('h4', { className: 'text-primary' }, 'No Log Messages'), 
         _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for messages from host application...')), 



         model.messages.length && 
         _React['default'].createElement('table', { className: 'table table-striped table-hover' }, 
         _React['default'].createElement('thead', null, 
         _React['default'].createElement('tr', null, 
         _React['default'].createElement('th', null, 'Level'), 
         _React['default'].createElement('th', null, 'Message'), 
         _React['default'].createElement('th', null, 'Location'), 
         _React['default'].createElement('th', null, 'Time'))), 


         _React['default'].createElement('tbody', null, 
         messages))));}








      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'log-display-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVVBLFlBQVMsTUFBTSxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFHO0FBQy9DLGtCQUFZLENBQUM7O0FBRWIsVUFBSSxLQUFLLEdBQUc7QUFDVCxpQkFBUSxFQUFFLEVBQUUsRUFDZCxDQUFDOzs7QUFFRixVQUFJLFFBQVEsR0FBRztBQUNaLGdCQUFPLEVBQUUsbUJBQVc7QUFDakIsaUJBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUM1QixFQUNILENBQUM7Ozs7QUFFRixVQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRztBQUMvQixpQkFBUSxDQUFDLFNBQVMsQ0FBRyxhQUFhLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsS0FBSyxFQUFHO0FBQ2pGLGdCQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxFQUFHO0FBQy9CLG9CQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsQ0FBRSxDQUFDLENBQzFDOztBQUNJO0FBQ0YsZ0NBQWlCLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQ2xDLENBQ0gsQ0FBRSxDQUFDLENBQ047Ozs7Ozs7QUFJRCxlQUFTLGlCQUFpQixDQUFFLE9BQU8sRUFBRztBQUNuQyxjQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBRTtBQUNyQixnQkFBSSxFQUFFLGVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUU7QUFDNUQsaUJBQUssRUFBRSxPQUFPLENBQUMsS0FBSztBQUNwQixnQkFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0FBQ2xCLG9CQUFRLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUNuRSxDQUFFLENBQUM7OztBQUVKLGdCQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRztBQUM5RCxpQkFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUN2QixDQUNIOzs7Ozs7QUFJRCxlQUFTLE1BQU0sR0FBRzs7QUFFZixrQkFBUyxVQUFVLENBQUUsSUFBSSxFQUFHO0FBQ3pCLG1CQUFPLHlCQUFRLElBQUksQ0FBRSxDQUFDLE1BQU0sQ0FBRSx5QkFBeUIsQ0FBRSxDQUFBLENBQzNEOzs7QUFFRCxhQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBRSxVQUFFLE9BQU87QUFDM0M7QUFDRywyREFBSyxPQUFPLENBQUMsS0FBSyxDQUFNO0FBQ3hCLDJEQUFLLE9BQU8sQ0FBQyxJQUFJLENBQU07QUFDdkIsMkRBQUssT0FBTyxDQUFDLFFBQVEsQ0FBTTtBQUMzQiwyREFBSyxVQUFVLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFNLENBQ25DLEdBQUEsQ0FDUCxDQUFDOzs7O0FBRUYsb0JBQVc7QUFDUjtBQUNHLGtEQUFLLFNBQVMsRUFBQyxlQUFlO0FBQ3pCLDRCQUFRO0FBQ1IsbUNBQW9CLEtBQUs7QUFDM0Isa0RBQUssU0FBUyxFQUFDLG1CQUFtQjtBQUMvQjtBQUNHLGdCQUFJLEVBQUMsUUFBUTtBQUNiLHFCQUFTLEVBQUcsQ0FBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLGFBQWEsR0FBRyxFQUFFLENBQUEsR0FBSyx3QkFBd0IsQUFBRTtBQUN4RixtQkFBTyxFQUFDLGtCQUFrQixZQUNYLENBQ2YsQ0FDSDs7Ozs7QUFFSixVQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTTtBQUNyQixrREFBSyxTQUFTLEVBQUMsWUFBWTtBQUN4QixpREFBSSxTQUFTLEVBQUMsY0FBYyxzQkFBcUI7QUFDakQsb0RBQUcsdUNBQUcsU0FBUyxFQUFDLGVBQWUsR0FBSyxtREFBa0QsQ0FDbkY7Ozs7QUFHUCxjQUFLLENBQUMsUUFBUSxDQUFDLE1BQU07QUFDcEIsb0RBQU8sU0FBUyxFQUFDLGlDQUFpQztBQUMvQztBQUNHO0FBQ0csNkRBQWM7QUFDZCwrREFBZ0I7QUFDaEIsZ0VBQWlCO0FBQ2pCLDREQUFhLENBQ1gsQ0FDQTs7O0FBQ1I7QUFDSyxpQkFBUSxDQUNMLENBQ0gsQ0FFUixDQUNSLENBQUMsQ0FFSjs7Ozs7Ozs7Ozs7QUFJRCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNLEVBQ3hCLENBQUMsQ0FDSjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLG9CQUFvQjtBQUMxQixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUU7QUFDMUQsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJsb2ctZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4IGZyb20gJ2xheGFyJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCBldmVudEJ1cywgcmVhY3RSZW5kZXIgKSB7XG4gICAndXNlIHN0cmljdCc7XG5cbiAgIHZhciBtb2RlbCA9IHtcbiAgICAgIG1lc3NhZ2VzOiBbXVxuICAgfTtcblxuICAgdmFyIGNvbW1hbmRzID0ge1xuICAgICAgZGlzY2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5tZXNzYWdlcy5sZW5ndGggPSAwO1xuICAgICAgfVxuICAgfTtcblxuICAgaWYoIGNvbnRleHQuZmVhdHVyZXMubG9nLnN0cmVhbSApIHtcbiAgICAgIGV2ZW50QnVzLnN1YnNjcmliZSggICdkaWRQcm9kdWNlLicgKyBjb250ZXh0LmZlYXR1cmVzLmxvZy5zdHJlYW0sIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBldmVudC5kYXRhICkgKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goIGRpc3BsYXlMb2dNZXNzYWdlICk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlMb2dNZXNzYWdlKCBldmVudC5kYXRhICk7XG4gICAgICAgICB9XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGRpc3BsYXlMb2dNZXNzYWdlKCBtZXNzYWdlICkge1xuICAgICAgbW9kZWwubWVzc2FnZXMudW5zaGlmdCgge1xuICAgICAgICAgdGV4dDogYXguc3RyaW5nLmZvcm1hdCggbWVzc2FnZS50ZXh0LCBtZXNzYWdlLnJlcGxhY2VtZW50cyApLFxuICAgICAgICAgbGV2ZWw6IG1lc3NhZ2UubGV2ZWwsXG4gICAgICAgICB0aW1lOiBtZXNzYWdlLnRpbWUsXG4gICAgICAgICBsb2NhdGlvbjogbWVzc2FnZS5zb3VyY2VJbmZvLmZpbGUgKyAnOicgKyBtZXNzYWdlLnNvdXJjZUluZm8ubGluZVxuICAgICAgfSApO1xuXG4gICAgICB3aGlsZSggbW9kZWwubWVzc2FnZXMubGVuZ3RoID4gY29udGV4dC5mZWF0dXJlcy5sb2cuYnVmZmVyU2l6ZSApIHtcbiAgICAgICAgIG1vZGVsLm1lc3NhZ2VzLnBvcCgpO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUoIGRhdGUgKSB7XG4gICAgICAgICByZXR1cm4gbW9tZW50KCBkYXRlICkuZm9ybWF0KCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnIClcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBtb2RlbC5tZXNzYWdlcy5tYXAoICggbWVzc2FnZSApID0+XG4gICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQ+e21lc3NhZ2UubGV2ZWx9PC90ZD5cbiAgICAgICAgICAgIDx0ZD57bWVzc2FnZS50ZXh0fTwvdGQ+XG4gICAgICAgICAgICA8dGQ+e21lc3NhZ2UubG9jYXRpb259PC90ZD5cbiAgICAgICAgICAgIDx0ZD57Zm9ybWF0VGltZSggbWVzc2FnZS50aW1lICl9PC90ZD5cbiAgICAgICAgIDwvdHI+XG4gICAgICApO1xuXG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWFmZml4LWFyZWFcIlxuICAgICAgICAgICAgICAgICBheC1hZmZpeFxuICAgICAgICAgICAgICAgICBheC1hZmZpeC1vZmZzZXQtdG9wPVwiMTAwXCI+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWJ1dHRvbi13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17ICggIW1vZGVsLm1lc3NhZ2VzLmxlbmd0aCA/ICdheC1kaXNhYmxlZCcgOiAnJyApICsgXCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgfVxuICAgICAgICAgICAgICAgICAgICAgb25DbGljaz1cImNvbW1hbmRzLmRpc2NhcmRcIlxuICAgICAgICAgICAgICAgICAgICAgPkNsZWFyPC9idXR0b24+XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7ICFtb2RlbC5tZXNzYWdlcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPk5vIExvZyBNZXNzYWdlczwvaDQ+XG4gICAgICAgICAgICAgICAgICA8cD48aSBjbGFzc05hbWU9XCJmYSBmYS1jbG9jay1vXCI+PC9pPiBXYWl0aW5nIGZvciBtZXNzYWdlcyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeyBtb2RlbC5tZXNzYWdlcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWhvdmVyXCI+XG4gICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+TGV2ZWw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1lc3NhZ2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkxvY2F0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5UaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgeyBtZXNzYWdlcyB9XG4gICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIH1cbiAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcblxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ2xvZy1kaXNwbGF5LXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBbICdheENvbnRleHQnLCAnYXhFdmVudEJ1cycsICdheFJlYWN0UmVuZGVyJyBdLFxuICAgY3JlYXRlXG59O1xuIl19
