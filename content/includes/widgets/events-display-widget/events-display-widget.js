define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker'], function (exports, module, _react, _laxarPatterns, _moment, _tracker) {/**
                                                                                                                                                        * Copyright 2016 aixigo AG
                                                                                                                                                        * Released under the MIT license.
                                                                                                                                                        * http://laxarjs.org/license
                                                                                                                                                        */'use strict';function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _React = _interopRequireDefault(_react);var _patterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);







   function create(context, eventBus, reactRender, flowService) {
      'use strict';

      var settingGroups = ['patterns', 'interactions', 'sources'];

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      Controller.$inject = ['$scope', '$sanitize'];

      function Controller($scope, $sanitize) {
         'use strict';
         $scope.resources = {};

         var resourceHandler = _patterns['default'].resources.handlerFor($scope).registerResourceFromFeature('filter', { 
            onUpdateReplace: runFilters, 
            isOptional: true });


         $scope.model = { 
            patterns: [
            { name: 'lifecycle', htmlIcon: '<i class="fa fa-recycle"></i>', eventTypes: [
               'endLifecycle', 'beginLifecycle'] }, 

            { name: 'navigation', htmlIcon: '<i class="fa fa-location-arrow"></i>', eventTypes: [
               'navigate'] }, 

            { name: 'resources', htmlIcon: '<i class="fa fa-file-text-o"></i>', eventTypes: [
               'replace', 'update', 'validate', 'save'] }, 

            { name: 'actions', htmlIcon: '<i class="fa fa-rocket"></i>', eventTypes: [
               'takeAction'] }, 

            { name: 'flags', htmlIcon: '<i class="fa fa-flag"></i>', eventTypes: [
               'changeFlag'] }, 

            { name: 'i18n', htmlIcon: '<i class="fa fa-globe"></i>', eventTypes: [
               'changeLocale'] }, 

            { name: 'visibility', htmlIcon: '<i class="fa fa-eye"></i>', eventTypes: [
               'changeAreaVisibility', 'changeWidgetVisibility'] }, 

            { name: 'other', htmlIcon: '&nbsp;', eventTypes: [] }], 

            index: 0, 
            eventInfos: [], 
            visibleEventInfos: [], 
            problemSummary: { 
               count: 0, 
               eventInfos: [] }, 

            selectionEventInfo: null, 
            settings: { 
               namePattern: '', 
               visibleEventsLimit: 100, 
               patterns: {}, 
               interactions: { 
                  subscribe: true, 
                  publish: true, 
                  deliver: true, 
                  unsubscribe: true }, 

               sources: { 
                  widgets: true, 
                  runtime: true } } };




         $scope.view = { 
            showPatterns: false, 
            patternsByName: (function () {
               var result = {};
               $scope.model.patterns.forEach(function (pattern) {
                  result[pattern.name] = pattern;});

               return result;})() };



         $scope.commands = { 
            setAll: function setAll(toValue) {
               settingGroups.forEach(function (groupName) {
                  var group = $scope.model.settings[groupName];
                  ng.forEach(group, function (_, name) {
                     group[name] = toValue;});});}, 



            setDefaults: function setDefaults() {
               settingGroups.forEach(function (groupName) {
                  var group = $scope.model.settings[groupName];
                  ng.forEach(group, function (_, name) {
                     group[name] = true;});});


               $scope.model.patterns.forEach(function (patternInfo) {
                  $scope.model.settings.patterns[patternInfo.name] = true;});

               $scope.features.filter.hidePatterns.forEach(function (pattern) {
                  $scope.model.settings.patterns[pattern] = false;});

               $scope.features.filter.hideSources.forEach(function (pattern) {
                  $scope.model.settings.sources[pattern] = false;});

               $scope.features.filter.hideInteractions.forEach(function (pattern) {
                  $scope.model.settings.interactions[pattern] = false;});}, 


            clearFilters: function clearFilters() {
               $scope.model.settings.namePattern = '';
               $scope.model.settings.visibleEventsLimit = null;
               $scope.commands.setAll(true);}, 

            select: function select(eventInfo) {
               $scope.model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
               runFilters();}, 

            discard: function discard() {
               $scope.model.eventInfos = [];
               $scope.model.selectionEventInfo = null;
               runFilters();
               refreshProblemSummary();}, 

            runFilters: runFilters };


         $scope.commands.setDefaults();

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         if ($scope.features.events.stream) {
            $scope.eventBus.subscribe('didProduce.' + $scope.features.events.stream, function (event) {
               if (Array.isArray(event.data) && event.data.length) {
                  event.data.forEach(addEvent);} else 

               {
                  addEvent(event.data);}

               runFilters();});}



         $scope.$watch('model.settings', runFilters, true);

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function addEvent(eventInfo) {

            var completeEventInfo = { 
               index: ++$scope.model.index, 
               interaction: eventInfo.action, 
               cycleId: eventInfo.cycleId > -1 ? eventInfo.cycleId : '-', 
               eventObject: eventInfo.eventObject || {}, 
               formattedEvent: JSON.stringify(eventInfo.eventObject, null, 3), 
               formattedTime: { 
                  upper: (0, _moment2['default'])(eventInfo.time).format('HH:mm'), 
                  lower: (0, _moment2['default'])(eventInfo.time).format('ss.SSS') }, 

               name: eventInfo.event || '?', 
               pattern: pattern((eventInfo.event || '?').toLowerCase()), 
               showDetails: false, 
               source: (eventInfo.source || '?').replace(/^widget\./, ''), 
               target: (eventInfo.target || '?').replace(/^-$/, ''), 
               time: eventInfo.time, 
               selected: false, 
               sourceType: (eventInfo.source || '?').indexOf('widget.') === 0 ? 'widgets' : 'runtime', 
               problems: _tracker2['default'].track(eventInfo) };


            $scope.model.eventInfos.unshift(completeEventInfo);
            if (completeEventInfo.problems.length) {
               refreshProblemSummary();}


            if ($scope.model.eventInfos.length > $scope.features.events.bufferSize) {
               var removedInfo = $scope.model.eventInfos.pop();
               if (removedInfo.problems.length) {
                  refreshProblemSummary();}}



            function pattern(eventName) {
               var matchingPatthern = $scope.model.patterns.filter(function (pattern) {
                  return pattern.eventTypes.some(function (eventType) {
                     return eventName.indexOf(eventType.toLowerCase()) !== -1;});});


               return matchingPatthern.length ? matchingPatthern[0].name : 'other';}}




         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function refreshProblemSummary() {
            var eventInfos = $scope.model.eventInfos.filter(function (info) {
               return info.problems.length > 0;});


            $scope.model.problemSummary = { 
               hasProblems: eventInfos.length > 0, 
               eventInfos: eventInfos };}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function runFilters() {
            var settings = $scope.model.settings;
            var numVisible = 0;

            var searchRegExp = null;
            if (settings.namePattern) {
               try {
                  searchRegExp = new RegExp(settings.namePattern, 'gi');} 

               catch (e) {/* ignore invalid search pattern */}}

            var selectionEventInfo = $scope.model.selectionEventInfo;

            $scope.model.visibleEventInfos = $scope.model.eventInfos.filter(function (eventInfo) {
               if (settings.visibleEventsLimit !== null && numVisible >= settings.visibleEventsLimit) {
                  return false;}

               if (!settings.interactions[eventInfo.interaction]) {
                  return false;}

               if (!settings.patterns[eventInfo.pattern]) {
                  return false;}

               if (!settings.sources[eventInfo.sourceType]) {
                  return false;}

               if (!matchesFilterResource(eventInfo)) {
                  return false;}

               if (!matchesSearchExpression(eventInfo, searchRegExp)) {
                  return false;}

               ++numVisible;
               return true;});


            // modify matches in place
            $scope.model.visibleEventInfos.forEach(function (eventInfo) {
               eventInfo.htmlName = htmlValue(eventInfo.name, searchRegExp, '.');
               eventInfo.htmlSource = htmlValue(eventInfo.source, searchRegExp, '#');
               eventInfo.htmlTarget = htmlValue(eventInfo.target, searchRegExp, '#');
               eventInfo.selected = !!selectionEventInfo && inSelection(eventInfo, selectionEventInfo);});}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function matchesSearchExpression(eventInfo, searchRegExp) {
            return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target].
            some(function (field) {
               var matches = searchRegExp.test(field);
               searchRegExp.lastIndex = 0;
               return !!matches;});}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         var patternTopics = { 
            RESOURCE: ['didReplace', 'didUpdate'], 
            ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'], 
            FLAG: ['didChangeFlag'], 
            CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };


         function matchesFilterResource(eventInfo) {
            if (!$scope.resources.filter) {
               return true;}


            var filterTopics = $scope.resources.filter.topics || [];
            var filterParticipants = $scope.resources.filter.participants || [];
            if (!filterTopics.length && !filterParticipants.length) {
               return true;}


            var matchesTopicFilter = filterTopics.
            some(function (item) {
               var prefixes = patternTopics[item.pattern];
               return prefixes.some(function (prefix) {
                  var topic = prefix + '.' + item.topic;
                  return eventInfo.name === topic || eventInfo.name.indexOf(topic + '.') === 0;});});



            var matchesParticipantsFilter = ['target', 'source'].some(function (field) {
               var value = eventInfo[field];
               return filterParticipants.
               map(function (_) {return _.participant;}).
               some(isSuffixOf(value));});


            return matchesTopicFilter || matchesParticipantsFilter;

            function isSuffixOf(value) {
               return function (_) {
                  var tail = '#' + _;
                  return value.length >= tail.length && value.indexOf(tail) === value.length - tail.length;};}}




         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function htmlValue(value, searchRegExp, splitCharacter) {
            var html = $sanitize(value);
            var wasSplit = false;
            if (!searchRegExp) {
               return wrap(split(html, false));}


            var parts = [];
            var match;
            var lastIndex = 0;
            var limit = 1;
            while (limit-- && (match = searchRegExp.exec(html)) !== null) {
               if (match.index > lastIndex) {
                  parts.push(split(html.substring(lastIndex, match.index), false));}

               parts.push('<b>');
               parts.push(split(match[0], true));
               parts.push('</b>');
               lastIndex = searchRegExp.lastIndex;}

            searchRegExp.lastIndex = 0;
            parts.push(split(html.substring(lastIndex, html.length)));
            return wrap(parts.join(''));

            function wrap(whole) {
               return '<span>' + whole + '</span>';}


            function split(part, isBold) {
               if (!splitCharacter || wasSplit) {
                  return part;}


               var splitPoint = part.indexOf(splitCharacter);
               if (splitPoint === -1) {
                  return part;}


               wasSplit = true;
               return part.substring(0, splitPoint) + (
               isBold ? '</b>' : '') + '</span><br /><span>' + (isBold ? '<b>' : '') + 
               part.substring(splitPoint + 1, part.length);}}



         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function inSelection(eventInfo, selectionEventInfo) {
            if (!selectionEventInfo) {
               return false;}


            return eventInfo === selectionEventInfo || 
            eventInfo.cycleId === selectionEventInfo.cycleId && 
            eventInfo.source === selectionEventInfo.source && 
            eventInfo.name === selectionEventInfo.name;}}





      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return ng.module('eventsDisplayWidget', ['ngSanitize']).
      controller('EventsDisplayWidgetController', Controller);

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axEventBus', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFHO0FBQzVELGtCQUFZLENBQUM7O0FBRWIsVUFBSSxhQUFhLEdBQUcsQ0FBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBRSxDQUFDOzs7O0FBSTlELGdCQUFVLENBQUMsT0FBTyxHQUFHLENBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBRSxDQUFDOztBQUUvQyxlQUFTLFVBQVUsQ0FBRSxNQUFNLEVBQUUsU0FBUyxFQUFHO0FBQ3RDLHFCQUFZLENBQUM7QUFDYixlQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsYUFBSSxlQUFlLEdBQUcscUJBQVMsU0FBUyxDQUFDLFVBQVUsQ0FBRSxNQUFNLENBQUUsQ0FBQywyQkFBMkIsQ0FBRSxRQUFRLEVBQUU7QUFDbEcsMkJBQWUsRUFBRSxVQUFVO0FBQzNCLHNCQUFVLEVBQUUsSUFBSSxFQUNsQixDQUFFLENBQUM7OztBQUVKLGVBQU0sQ0FBQyxLQUFLLEdBQUc7QUFDWixvQkFBUSxFQUFFO0FBQ1AsY0FBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSwrQkFBK0IsRUFBRSxVQUFVLEVBQUU7QUFDekUsNkJBQWMsRUFBRSxnQkFBZ0IsQ0FDbEMsRUFBRTs7QUFDSCxjQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLHNDQUFzQyxFQUFFLFVBQVUsRUFBRTtBQUNqRix5QkFBVSxDQUNaLEVBQUU7O0FBQ0gsY0FBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxtQ0FBbUMsRUFBRSxVQUFVLEVBQUU7QUFDN0Usd0JBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FDekMsRUFBRTs7QUFDSCxjQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFB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LENBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBRTtBQUM5RCxpQkFBSyxFQUFFLFVBQVUsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxFQUNqRixDQUFDLENBQ0o7Ozs7OztBQUlELGFBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBRSxxQkFBcUIsRUFBRSxDQUFFLFlBQVksQ0FBRSxDQUFFO0FBQ3ZELGdCQUFVLENBQUUsK0JBQStCLEVBQUUsVUFBVSxDQUFFLENBQUM7Ozs7QUFJOUQsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTSxFQUN4QixDQUFDLENBQ0o7Ozs7QUFFYztBQUNaLFVBQUksRUFBRSx1QkFBdUI7QUFDN0IsZ0JBQVUsRUFBRSxDQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBRTtBQUMzRSxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vbGF4YXJqcy5vcmcvbGljZW5zZVxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgcGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcblxuXG5mdW5jdGlvbiBjcmVhdGUoIGNvbnRleHQsIGV2ZW50QnVzLCByZWFjdFJlbmRlciwgZmxvd1NlcnZpY2UgKSB7XG4gICAndXNlIHN0cmljdCc7XG5cbiAgIHZhciBzZXR0aW5nR3JvdXBzID0gWyAncGF0dGVybnMnLCAnaW50ZXJhY3Rpb25zJywgJ3NvdXJjZXMnIF07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIENvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckc2FuaXRpemUnIF07XG5cbiAgIGZ1bmN0aW9uIENvbnRyb2xsZXIoICRzY29wZSwgJHNhbml0aXplICkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgJHNjb3BlLnJlc291cmNlcyA9IHt9O1xuXG4gICAgICB2YXIgcmVzb3VyY2VIYW5kbGVyID0gcGF0dGVybnMucmVzb3VyY2VzLmhhbmRsZXJGb3IoICRzY29wZSApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgICAgIG9uVXBkYXRlUmVwbGFjZTogcnVuRmlsdGVycyxcbiAgICAgICAgIGlzT3B0aW9uYWw6IHRydWVcbiAgICAgIH0gKTtcblxuICAgICAgJHNjb3BlLm1vZGVsID0ge1xuICAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2xpZmVjeWNsZScsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1yZWN5Y2xlXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICAgICdlbmRMaWZlY3ljbGUnLCAnYmVnaW5MaWZlY3ljbGUnXG4gICAgICAgICAgICBdIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICduYXZpZ2F0aW9uJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWxvY2F0aW9uLWFycm93XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICAgICduYXZpZ2F0ZSdcbiAgICAgICAgICAgIF0gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3Jlc291cmNlcycsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1maWxlLXRleHQtb1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAgICAncmVwbGFjZScsICd1cGRhdGUnLCAndmFsaWRhdGUnLCAnc2F2ZSdcbiAgICAgICAgICAgIF0gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2FjdGlvbnMnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtcm9ja2V0XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICAgICd0YWtlQWN0aW9uJ1xuICAgICAgICAgICAgXSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZmxhZ3MnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZmxhZ1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAgICAnY2hhbmdlRmxhZydcbiAgICAgICAgICAgIF0gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2kxOG4nLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZ2xvYmVcIj48L2k+JywgZXZlbnRUeXBlczogW1xuICAgICAgICAgICAgICAgJ2NoYW5nZUxvY2FsZSdcbiAgICAgICAgICAgIF0gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3Zpc2liaWxpdHknLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZXllXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICAgICdjaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdjaGFuZ2VXaWRnZXRWaXNpYmlsaXR5J1xuICAgICAgICAgICAgXSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnb3RoZXInLCBodG1sSWNvbjogJyZuYnNwOycsIGV2ZW50VHlwZXM6IFtdIH1cbiAgICAgICAgIF0sXG4gICAgICAgICBpbmRleDogMCxcbiAgICAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgICAgIH0sXG4gICAgICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnZpZXcgPSB7XG4gICAgICAgICBzaG93UGF0dGVybnM6IGZhbHNlLFxuICAgICAgICAgcGF0dGVybnNCeU5hbWU6ICggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAkc2NvcGUubW9kZWwucGF0dGVybnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICAgICByZXN1bHRbIHBhdHRlcm4ubmFtZSBdID0gcGF0dGVybjtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICB9ICkoKVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNvbW1hbmRzID0ge1xuICAgICAgICAgc2V0QWxsOiBmdW5jdGlvbiggdG9WYWx1ZSApIHtcbiAgICAgICAgICAgIHNldHRpbmdHcm91cHMuZm9yRWFjaCggZnVuY3Rpb24oIGdyb3VwTmFtZSApIHtcbiAgICAgICAgICAgICAgIHZhciBncm91cCA9ICRzY29wZS5tb2RlbC5zZXR0aW5nc1sgZ3JvdXBOYW1lIF07XG4gICAgICAgICAgICAgICBuZy5mb3JFYWNoKCBncm91cCwgZnVuY3Rpb24oIF8sIG5hbWUgKSB7XG4gICAgICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0sXG4gICAgICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSAkc2NvcGUubW9kZWwuc2V0dGluZ3NbIGdyb3VwTmFtZSBdO1xuICAgICAgICAgICAgICAgbmcuZm9yRWFjaCggZ3JvdXAsIGZ1bmN0aW9uKCBfLCBuYW1lICkge1xuICAgICAgICAgICAgICAgICAgZ3JvdXBbIG5hbWUgXSA9IHRydWU7XG4gICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAkc2NvcGUubW9kZWwucGF0dGVybnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm5JbmZvICkge1xuICAgICAgICAgICAgICAgJHNjb3BlLm1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuSW5mby5uYW1lIF0gPSB0cnVlO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgJHNjb3BlLmZlYXR1cmVzLmZpbHRlci5oaWRlUGF0dGVybnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUubW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgJHNjb3BlLmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgICAgICRzY29wZS5tb2RlbC5zZXR0aW5ncy5zb3VyY2VzWyBwYXR0ZXJuIF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICRzY29wZS5mZWF0dXJlcy5maWx0ZXIuaGlkZUludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgICAgICRzY29wZS5tb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSxcbiAgICAgICAgIGNsZWFyRmlsdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUubW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm4gPSAnJztcbiAgICAgICAgICAgICRzY29wZS5tb2RlbC5zZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRzLnNldEFsbCggdHJ1ZSApO1xuICAgICAgICAgfSxcbiAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgICAgICAgICRzY29wZS5tb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBldmVudEluZm8uc2VsZWN0ZWQgPyBudWxsIDogZXZlbnRJbmZvO1xuICAgICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgfSxcbiAgICAgICAgIGRpc2NhcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLm1vZGVsLmV2ZW50SW5mb3MgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5tb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICAgICB9LFxuICAgICAgICAgcnVuRmlsdGVyczogcnVuRmlsdGVyc1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNvbW1hbmRzLnNldERlZmF1bHRzKCk7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGlmKCAkc2NvcGUuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSApIHtcbiAgICAgICAgICRzY29wZS5ldmVudEJ1cy5zdWJzY3JpYmUoICdkaWRQcm9kdWNlLicgKyAkc2NvcGUuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSwgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIGV2ZW50LmRhdGEgKSAmJiBldmVudC5kYXRhLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuZm9yRWFjaCggYWRkRXZlbnQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgYWRkRXZlbnQoIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLiR3YXRjaCggJ21vZGVsLnNldHRpbmdzJywgcnVuRmlsdGVycywgdHJ1ZSApO1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBhZGRFdmVudCggZXZlbnRJbmZvICkge1xuXG4gICAgICAgICB2YXIgY29tcGxldGVFdmVudEluZm8gPSB7XG4gICAgICAgICAgICBpbmRleDogKyskc2NvcGUubW9kZWwuaW5kZXgsXG4gICAgICAgICAgICBpbnRlcmFjdGlvbjogZXZlbnRJbmZvLmFjdGlvbixcbiAgICAgICAgICAgIGN5Y2xlSWQ6IGV2ZW50SW5mby5jeWNsZUlkID4gLTEgPyBldmVudEluZm8uY3ljbGVJZCA6ICctJyxcbiAgICAgICAgICAgIGV2ZW50T2JqZWN0OiBldmVudEluZm8uZXZlbnRPYmplY3QgfHwge30sXG4gICAgICAgICAgICBmb3JtYXR0ZWRFdmVudDogSlNPTi5zdHJpbmdpZnkoIGV2ZW50SW5mby5ldmVudE9iamVjdCwgbnVsbCwgMyApLFxuICAgICAgICAgICAgZm9ybWF0dGVkVGltZToge1xuICAgICAgICAgICAgICAgdXBwZXI6IG1vbWVudCggZXZlbnRJbmZvLnRpbWUgKS5mb3JtYXQoICdISDptbScgKSxcbiAgICAgICAgICAgICAgIGxvd2VyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnc3MuU1NTJyApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogZXZlbnRJbmZvLmV2ZW50IHx8ICc/JyxcbiAgICAgICAgICAgIHBhdHRlcm46IHBhdHRlcm4oIChldmVudEluZm8uZXZlbnQgfHwgJz8nKS50b0xvd2VyQ2FzZSgpICksXG4gICAgICAgICAgICBzaG93RGV0YWlsczogZmFsc2UsXG4gICAgICAgICAgICBzb3VyY2U6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5yZXBsYWNlKCAvXndpZGdldFxcLi8sICcnICksXG4gICAgICAgICAgICB0YXJnZXQ6ICggZXZlbnRJbmZvLnRhcmdldCB8fCAnPycgKS5yZXBsYWNlKCAvXi0kLywgJycgKSxcbiAgICAgICAgICAgIHRpbWU6IGV2ZW50SW5mby50aW1lLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc291cmNlVHlwZTogKCBldmVudEluZm8uc291cmNlIHx8ICc/JyApLmluZGV4T2YoICd3aWRnZXQuJyApID09PSAwID8gJ3dpZGdldHMnIDogJ3J1bnRpbWUnLFxuICAgICAgICAgICAgcHJvYmxlbXM6IHRyYWNrZXIudHJhY2soIGV2ZW50SW5mbyApXG4gICAgICAgICB9O1xuXG4gICAgICAgICAkc2NvcGUubW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggJHNjb3BlLm1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoID4gJHNjb3BlLmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgICAgdmFyIHJlbW92ZWRJbmZvID0gJHNjb3BlLm1vZGVsLmV2ZW50SW5mb3MucG9wKCk7XG4gICAgICAgICAgICBpZiggcmVtb3ZlZEluZm8ucHJvYmxlbXMubGVuZ3RoICkge1xuICAgICAgICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGZ1bmN0aW9uIHBhdHRlcm4oIGV2ZW50TmFtZSApIHtcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ1BhdHRoZXJuID0gJHNjb3BlLm1vZGVsLnBhdHRlcm5zLmZpbHRlciggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gcGF0dGVybi5ldmVudFR5cGVzLnNvbWUoIGZ1bmN0aW9uKCBldmVudFR5cGUgKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lLmluZGV4T2YoIGV2ZW50VHlwZS50b0xvd2VyQ2FzZSgpICkgIT09IC0xO1xuICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoaW5nUGF0dGhlcm4ubGVuZ3RoID8gbWF0Y2hpbmdQYXR0aGVyblsgMCBdLm5hbWUgOiAnb3RoZXInO1xuICAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpIHtcbiAgICAgICAgIHZhciBldmVudEluZm9zID0gJHNjb3BlLm1vZGVsLmV2ZW50SW5mb3MuZmlsdGVyKCBmdW5jdGlvbiggaW5mbyApIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvLnByb2JsZW1zLmxlbmd0aCA+IDA7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgICRzY29wZS5tb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBydW5GaWx0ZXJzKCkge1xuICAgICAgICAgdmFyIHNldHRpbmdzID0gJHNjb3BlLm1vZGVsLnNldHRpbmdzO1xuICAgICAgICAgdmFyIG51bVZpc2libGUgPSAwO1xuXG4gICAgICAgICB2YXIgc2VhcmNoUmVnRXhwID0gbnVsbDtcbiAgICAgICAgIGlmKCBzZXR0aW5ncy5uYW1lUGF0dGVybiApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKCBzZXR0aW5ncy5uYW1lUGF0dGVybiwgJ2dpJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2goIGUgKSB7IC8qIGlnbm9yZSBpbnZhbGlkIHNlYXJjaCBwYXR0ZXJuICovIH1cbiAgICAgICAgIH1cbiAgICAgICAgIHZhciBzZWxlY3Rpb25FdmVudEluZm8gPSAkc2NvcGUubW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvO1xuXG4gICAgICAgICAkc2NvcGUubW9kZWwudmlzaWJsZUV2ZW50SW5mb3MgPSAkc2NvcGUubW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGV2ZW50SW5mby5pbnRlcmFjdGlvbiBdICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoICFzZXR0aW5ncy5wYXR0ZXJuc1sgZXZlbnRJbmZvLnBhdHRlcm4gXSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCAhc2V0dGluZ3Muc291cmNlc1sgZXZlbnRJbmZvLnNvdXJjZVR5cGUgXSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgLy8gbW9kaWZ5IG1hdGNoZXMgaW4gcGxhY2VcbiAgICAgICAgICRzY29wZS5tb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5mb3JFYWNoKCBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmh0bWxOYW1lID0gaHRtbFZhbHVlKCBldmVudEluZm8ubmFtZSwgc2VhcmNoUmVnRXhwLCAnLicgKTtcbiAgICAgICAgICAgIGV2ZW50SW5mby5odG1sU291cmNlID0gaHRtbFZhbHVlKCBldmVudEluZm8uc291cmNlLCBzZWFyY2hSZWdFeHAsICcjJyApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmh0bWxUYXJnZXQgPSBodG1sVmFsdWUoIGV2ZW50SW5mby50YXJnZXQsIHNlYXJjaFJlZ0V4cCwgJyMnICk7XG4gICAgICAgICAgICBldmVudEluZm8uc2VsZWN0ZWQgPSAhIXNlbGVjdGlvbkV2ZW50SW5mbyAmJiBpblNlbGVjdGlvbiggZXZlbnRJbmZvLCBzZWxlY3Rpb25FdmVudEluZm8gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkge1xuICAgICAgICAgcmV0dXJuICFzZWFyY2hSZWdFeHAgfHwgWyBldmVudEluZm8ubmFtZSwgZXZlbnRJbmZvLnNvdXJjZSwgZXZlbnRJbmZvLnRhcmdldCBdXG4gICAgICAgICAgICAuc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBzZWFyY2hSZWdFeHAudGVzdCggZmllbGQgKTtcbiAgICAgICAgICAgICAgIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgcmV0dXJuICEhbWF0Y2hlcztcbiAgICAgICAgICAgIH0gKTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgdmFyIHBhdHRlcm5Ub3BpY3MgPSB7XG4gICAgICAgICBSRVNPVVJDRTogWyAnZGlkUmVwbGFjZScsICdkaWRVcGRhdGUnIF0sXG4gICAgICAgICBBQ1RJT046IFsgJ3Rha2VBY3Rpb25SZXF1ZXN0JywgJ3dpbGxUYWtlQWN0aW9uJywgJ2RpZFRha2VBY3Rpb24nIF0sXG4gICAgICAgICBGTEFHOiBbICdkaWRDaGFuZ2VGbGFnJyBdLFxuICAgICAgICAgQ09OVEFJTkVSOiBbICdjaGFuZ2VBcmVhVmlzaWJpbGl0eVJlcXVlc3QnLCAnd2lsbENoYW5nZUFyZWFWaXNpYmlsaXR5JywgJ2RpZENoYW5nZUFyZWFWaXNpYmlsaXR5JyBdXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBtYXRjaGVzRmlsdGVyUmVzb3VyY2UoIGV2ZW50SW5mbyApIHtcbiAgICAgICAgIGlmKCAhJHNjb3BlLnJlc291cmNlcy5maWx0ZXIgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIH1cblxuICAgICAgICAgdmFyIGZpbHRlclRvcGljcyA9ICRzY29wZS5yZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB8fCBbXTtcbiAgICAgICAgIHZhciBmaWx0ZXJQYXJ0aWNpcGFudHMgPSAkc2NvcGUucmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMgfHwgW107XG4gICAgICAgICBpZiggIWZpbHRlclRvcGljcy5sZW5ndGggJiYgIWZpbHRlclBhcnRpY2lwYW50cy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIH1cblxuICAgICAgICAgdmFyIG1hdGNoZXNUb3BpY0ZpbHRlciA9IGZpbHRlclRvcGljc1xuICAgICAgICAgICAgLnNvbWUoIGZ1bmN0aW9uKCBpdGVtICkge1xuICAgICAgICAgICAgICAgdmFyIHByZWZpeGVzID0gcGF0dGVyblRvcGljc1sgaXRlbS5wYXR0ZXJuIF07XG4gICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ZXMuc29tZSggZnVuY3Rpb24oIHByZWZpeCApIHtcbiAgICAgICAgICAgICAgICAgIHZhciB0b3BpYyA9IHByZWZpeCArICcuJyArIGl0ZW0udG9waWM7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRJbmZvLm5hbWUgPT09IHRvcGljIHx8IGV2ZW50SW5mby5uYW1lLmluZGV4T2YoIHRvcGljICsgJy4nICkgPT09IDA7XG4gICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgIHZhciBtYXRjaGVzUGFydGljaXBhbnRzRmlsdGVyID0gWyAndGFyZ2V0JywgJ3NvdXJjZScgXS5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBldmVudEluZm9bIGZpZWxkIF07XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyUGFydGljaXBhbnRzXG4gICAgICAgICAgICAgICAubWFwKCBmdW5jdGlvbiggXyApIHsgcmV0dXJuIF8ucGFydGljaXBhbnQ7IH0gKVxuICAgICAgICAgICAgICAgLnNvbWUoIGlzU3VmZml4T2YoIHZhbHVlICkgKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgcmV0dXJuIG1hdGNoZXNUb3BpY0ZpbHRlciB8fCBtYXRjaGVzUGFydGljaXBhbnRzRmlsdGVyO1xuXG4gICAgICAgICBmdW5jdGlvbiBpc1N1ZmZpeE9mKCB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggXyApIHtcbiAgICAgICAgICAgICAgIHZhciB0YWlsID0gJyMnICsgXztcbiAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gdGFpbC5sZW5ndGggJiYgdmFsdWUuaW5kZXhPZiggdGFpbCApID09PSB2YWx1ZS5sZW5ndGggLSB0YWlsLmxlbmd0aDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGh0bWxWYWx1ZSggdmFsdWUsIHNlYXJjaFJlZ0V4cCwgc3BsaXRDaGFyYWN0ZXIgKSB7XG4gICAgICAgICB2YXIgaHRtbCA9ICRzYW5pdGl6ZSggdmFsdWUgKTtcbiAgICAgICAgIHZhciB3YXNTcGxpdCA9IGZhbHNlO1xuICAgICAgICAgaWYoICFzZWFyY2hSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCggc3BsaXQoIGh0bWwsIGZhbHNlICkgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgdmFyIHBhcnRzID0gW107XG4gICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICB2YXIgbGFzdEluZGV4ID0gMDtcbiAgICAgICAgIHZhciBsaW1pdCA9IDE7XG4gICAgICAgICB3aGlsZSggbGltaXQtLSAmJiAoIG1hdGNoID0gc2VhcmNoUmVnRXhwLmV4ZWMoIGh0bWwgKSApICE9PSBudWxsICkge1xuICAgICAgICAgICAgaWYoIG1hdGNoLmluZGV4ID4gbGFzdEluZGV4ICkge1xuICAgICAgICAgICAgICAgcGFydHMucHVzaCggc3BsaXQoIGh0bWwuc3Vic3RyaW5nKCBsYXN0SW5kZXgsIG1hdGNoLmluZGV4ICksIGZhbHNlICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnRzLnB1c2goICc8Yj4nICk7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKCBzcGxpdCggbWF0Y2hbIDAgXSwgdHJ1ZSApICk7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKCAnPC9iPicgKTtcbiAgICAgICAgICAgIGxhc3RJbmRleCA9IHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXg7XG4gICAgICAgICB9XG4gICAgICAgICBzZWFyY2hSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICAgICAgIHBhcnRzLnB1c2goIHNwbGl0KCBodG1sLnN1YnN0cmluZyggbGFzdEluZGV4LCBodG1sLmxlbmd0aCApICkgKTtcbiAgICAgICAgIHJldHVybiB3cmFwKCBwYXJ0cy5qb2luKCAnJyApICk7XG5cbiAgICAgICAgIGZ1bmN0aW9uIHdyYXAoIHdob2xlICkge1xuICAgICAgICAgICAgcmV0dXJuICc8c3Bhbj4nICsgd2hvbGUgKyAnPC9zcGFuPic7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGZ1bmN0aW9uIHNwbGl0KCBwYXJ0LCBpc0JvbGQgKSB7XG4gICAgICAgICAgICBpZiggIXNwbGl0Q2hhcmFjdGVyIHx8IHdhc1NwbGl0ICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzcGxpdFBvaW50ID0gcGFydC5pbmRleE9mKCBzcGxpdENoYXJhY3RlciApO1xuICAgICAgICAgICAgaWYoIHNwbGl0UG9pbnQgPT09IC0xICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdhc1NwbGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0LnN1YnN0cmluZyggMCwgc3BsaXRQb2ludCApICtcbiAgICAgICAgICAgICAgICggaXNCb2xkID8gJzwvYj4nIDogJycgKSArICc8L3NwYW4+PGJyIC8+PHNwYW4+JyArICggaXNCb2xkID8gJzxiPicgOiAnJyApICtcbiAgICAgICAgICAgICAgIHBhcnQuc3Vic3RyaW5nKCBzcGxpdFBvaW50ICsgMSwgcGFydC5sZW5ndGggKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgICAgKTtcbiAgICAgIH1cblxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzZXBhcmF0ZSggbGFiZWwsIHNlcGFyYXRvciwgZGVmYXVsdFRleHQgKSB7XG4gICAgICB2YXIgbmFtZSA9IGxhYmVsIHx8IGRlZmF1bHRUZXh0O1xuICAgICAgdmFyIHNwbGl0UG9pbnQgPSBuYW1lLmluZGV4T2YoIHNlcGFyYXRvciApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIHVwcGVyOiBzcGxpdFBvaW50ID09PSAtMSA/IG5hbWUgOiBuYW1lLnN1YnN0ciggMCwgc3BsaXRQb2ludCApLFxuICAgICAgICAgbG93ZXI6IHNwbGl0UG9pbnQgPT09IC0xID8gZGVmYXVsdFRleHQgOiBuYW1lLnN1YnN0ciggc3BsaXRQb2ludCwgbmFtZS5sZW5ndGggKVxuICAgICAgfTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgcmV0dXJuIG5nLm1vZHVsZSggJ2V2ZW50c0Rpc3BsYXlXaWRnZXQnLCBbICduZ1Nhbml0aXplJyBdIClcbiAgICAgIC5jb250cm9sbGVyKCAnRXZlbnRzRGlzcGxheVdpZGdldENvbnRyb2xsZXInLCBDb250cm9sbGVyICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZXZlbnRzLWRpc3BsYXktd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheEV2ZW50QnVzJywgJ2F4UmVhY3RSZW5kZXInLCAnYXhGbG93U2VydmljZScgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
