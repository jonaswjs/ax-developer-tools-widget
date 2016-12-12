define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker'], function (exports, module, _react, _laxarPatterns, _moment, _tracker) {/**
                                                                                                                                                        * Copyright 2016 aixigo AG
                                                                                                                                                        * Released under the MIT license.
                                                                                                                                                        * http://laxarjs.org/license
                                                                                                                                                        */'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);







   function create(context, reactRender, flowService) {
      'use strict';

      var settingGroups = ['patterns', 'interactions', 'sources'];

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      context.resources = {};

      _axPatterns['default'].resources.handlerFor(context).registerResourceFromFeature('filter', { 
         onUpdateReplace: runFilters, 
         isOptional: true });


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function runFilters() {
         var settings = model.settings;
         var numVisible = 0;

         var searchRegExp = null;
         if (settings.namePattern) {
            try {
               searchRegExp = new RegExp(settings.namePattern, 'gi');} 

            catch (e) {/* ignore invalid search pattern */}}

         var selectionEventInfo = model.selectionEventInfo;

         model.visibleEventInfos = model.eventInfos.filter(function (eventInfo) {
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
         model.visibleEventInfos.forEach(function (eventInfo) {
            eventInfo.htmlName = htmlValue(eventInfo.name, searchRegExp, '.');
            eventInfo.htmlSource = htmlValue(eventInfo.source, searchRegExp, '#');
            eventInfo.htmlTarget = htmlValue(eventInfo.target, searchRegExp, '#');
            eventInfo.selected = !!selectionEventInfo && inSelection(eventInfo, selectionEventInfo);});}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      var model = { 
         patterns: [
         { 
            name: 'lifecycle', htmlIcon: '<i class="fa fa-recycle"></i>', eventTypes: [
            'endLifecycle', 'beginLifecycle'] }, 


         { 
            name: 'navigation', htmlIcon: '<i class="fa fa-location-arrow"></i>', eventTypes: [
            'navigate'] }, 


         { 
            name: 'resources', htmlIcon: '<i class="fa fa-file-text-o"></i>', eventTypes: [
            'replace', 'update', 'validate', 'save'] }, 


         { 
            name: 'actions', htmlIcon: '<i class="fa fa-rocket"></i>', eventTypes: [
            'takeAction'] }, 


         { 
            name: 'flags', htmlIcon: '<i class="fa fa-flag"></i>', eventTypes: [
            'changeFlag'] }, 


         { 
            name: 'i18n', htmlIcon: '<i class="fa fa-globe"></i>', eventTypes: [
            'changeLocale'] }, 


         { 
            name: 'visibility', htmlIcon: '<i class="fa fa-eye"></i>', eventTypes: [
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




      var view = { 
         showPatterns: false };


      var commands = { 
         setAll: function setAll(toValue) {
            settingGroups.forEach(function (groupName) {
               var group = model.settings[groupName];
               for (var _name in group) {
                  if (group.hasOwnProperty[_name]) {
                     group[_name] = toValue;}}});}, 




         setDefaults: function setDefaults() {
            settingGroups.forEach(function (groupName) {
               var group = model.settings[groupName];
               for (var _name2 in group) {
                  if (group.hasOwnProperty[_name2]) {
                     group[_name2] = true;}}});



            model.patterns.forEach(function (patternInfo) {
               model.settings.patterns[patternInfo.name] = true;});

            context.features.filter.hidePatterns.forEach(function (pattern) {
               model.settings.patterns[pattern] = false;});

            context.features.filter.hideSources.forEach(function (pattern) {
               model.settings.sources[pattern] = false;});

            context.features.filter.hideInteractions.forEach(function (pattern) {
               model.settings.interactions[pattern] = false;});}, 


         clearFilters: function clearFilters() {
            model.settings.namePattern = '';
            model.settings.visibleEventsLimit = null;
            context.commands.setAll(true);}, 

         // select: function( eventInfo ) {
         //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
         //    runFilters();
         // },
         discard: function discard() {
            model.eventInfos = [];
            model.selectionEventInfo = null;
            runFilters();
            refreshProblemSummary();}, 

         runFilters: runFilters };


      commands.setDefaults();

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (context.features.events.stream) {
         context.eventBus.subscribe('didProduce.' + context.features.events.stream, function (event) {
            if (Array.isArray(event.data) && event.data.length) {
               event.data.forEach(addEvent);} else 

            {
               addEvent(event.data);}

            runFilters();});}



      //context.$watch( 'model.settings', runFilters, true );

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      var 
      PatternsHtmlIcon = (function (_React$Component) {_inherits(PatternsHtmlIcon, _React$Component);

         function PatternsHtmlIcon(props) {_classCallCheck(this, PatternsHtmlIcon);
            _get(Object.getPrototypeOf(PatternsHtmlIcon.prototype), 'constructor', this).call(this, props);
            this.props = props;

            switch (props.name) {
               case 'lifecycle':
                  this.iconClass = 'fa fa-recycle';
                  break;
               case 'navigation':
                  this.iconClass = 'fa fa-location-arrow';
                  break;
               case 'resources':
                  this.iconClass = 'fa fa-file-text-o';
                  break;
               case 'actions':
                  this.iconClass = 'fa fa-rocket';
                  break;
               case 'flags':
                  this.iconClass = 'fa fa-flag';
                  break;
               case 'i18n':
                  this.iconClass = 'fa fa-globe';
                  break;
               case 'visibility':
                  this.iconClass = 'fa fa-eye';
                  break;
               default:
                  this.iconClass = '';}}











         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(PatternsHtmlIcon, [{ key: 'render', value: function render() {return _React['default'].createElement('i', { className: this.iconClass });} }]);return PatternsHtmlIcon;})(_React['default'].Component);
      function addEvent(eventInfo) {

         var completeEventInfo = { 
            index: ++model.index, 
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


         model.eventInfos.unshift(completeEventInfo);
         if (completeEventInfo.problems.length) {
            refreshProblemSummary();}


         if (model.eventInfos.length > context.features.events.bufferSize) {
            var removedInfo = model.eventInfos.pop();
            if (removedInfo.problems.length) {
               refreshProblemSummary();}}



         function pattern(eventName) {
            var matchingPatthern = model.patterns.filter(function (pattern) {
               return pattern.eventTypes.some(function (eventType) {
                  return eventName.indexOf(eventType.toLowerCase()) !== -1;});});


            return matchingPatthern.length ? matchingPatthern[0].name : 'other';}}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function refreshProblemSummary() {
         var eventInfos = model.eventInfos.filter(function (info) {
            return info.problems.length > 0;});


         model.problemSummary = { 
            hasProblems: eventInfos.length > 0, 
            eventInfos: eventInfos };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function matchesSearchExpression(eventInfo, searchRegExp) {
         return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target].
         some(function (field) {
            var matches = searchRegExp.test(field);
            searchRegExp.lastIndex = 0;
            return !!matches;});}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      var patternTopics = { 
         RESOURCE: ['didReplace', 'didUpdate'], 
         ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'], 
         FLAG: ['didChangeFlag'], 
         CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function matchesFilterResource(eventInfo) {
         if (!context.resources.filter) {
            return true;}


         var filterTopics = context.resources.filter.topics || [];
         var filterParticipants = context.resources.filter.participants || [];
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

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function isSuffixOf(value) {
            return function (_) {
               var tail = '#' + _;
               return value.length >= tail.length && value.indexOf(tail) === value.length - tail.length;};}}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function htmlValue(value, searchRegExp, splitCharacter) {
         return value;
         var html = value; //$sanitize( value );
         var wasSplit = false;
         if (!searchRegExp) {
            return wrap(split(html, false));}


         var parts = [];
         var match = undefined;
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



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function inSelection(eventInfo, selectionEventInfo) {
         if (!selectionEventInfo) {
            return false;}


         return eventInfo === selectionEventInfo || 
         eventInfo.cycleId === selectionEventInfo.cycleId && 
         eventInfo.source === selectionEventInfo.source && 
         eventInfo.name === selectionEventInfo.name;}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {

         function affix() {
            return _React['default'].createElement('div', null, _React['default'].createElement('p', null, 'affix calling'));
            /*
             const eventInfoList = model.problemSummary.eventInfos.map( ( event ) => {
             return (
             <li key={event.name}>
             <h5><strong>{ event.name }</strong> <em>(source: { event.source })</em></h5>
             <ul>
             {
             event.problems.map( ( problems ) => {
             return (
             <li key={problem.description}
             className="ax-event-problem">
             <i className="fa fa-warning ax-error"/> { problem.description }
             </li>
             );
             } )
             }
             </ul>
             </li>
             )
             } );
              class FiltersForm extends React.Component {
             constructor( props ) {
             super( props );
             this.state = {value: this.props.name};
              this.handleChange = this.handleChange.bind( this );
             }
              handleChange( event ) {
             this.setState( {value: event.target.value} );
             }
              render() {
             return (
             <form>
             <label ax-for="'search'">
             <small>Filters:</small>
             </label>
             <input className="form-control input-sm"
             placeholder="Search (RegExp)"
             ax-id="'search'"
             type="text"
             value={this.state.value}
             onChange={this.handleChange}/>
             </form>
             );
             }
             }
              const filters = <FiltersForm name="model.settings.namePattern"/>;
              const limit = (
             <form>
             <label ax-for="'limit'">
             <small>Limit:</small>
             </label>
             <input className="form-control input-sm"
             ax-id="'limit'"
             ng-model="model.settings.visibleEventsLimit"
             ng-model-options="{ updateOn: 'default' }"
             ax-input="integer"
             ax-input-minimum-value="0"
             ax-input-maximum-value="features.events.bufferSize"
             placeholder="0-{{ features.events.bufferSize }}"
             maxlength="4"/>
             </form>
             );
             return {filters};
             */






            /*   const filterMenu = (
             <div className="btn-group btn-group-sm"
             ng-className="{ 'open': view.showPatterns }"
             ng-mouseenter="view.showPatterns = true"
             ng-mouseleave="view.showPatterns = false">
             <button type="button"
             className="btn btn-default dropdown-toggle"
             data-toggle="dropdown"
             aria-expanded="{{ view.showPatterns }}">
             More <span className="caret"></span>
             </button>
             <div className="dropdown-menu container col-lg-6" role="menu">
              <div className="row">
             <div className="ax-event-settings-col first">
             <h4>Patterns</h4>
             <div ng-repeat="pattern in model.patterns track by pattern.name">
             <button
             type="button"
             className="btn btn-link ax-event-setting-toggle"
             ng-click="model.settings.patterns[ pattern.name ] = !model.settings.patterns[ pattern.name ]">
             <span className="ax-event-pattern" ng-bind-html="pattern.htmlIcon"></span>
             {{ pattern.name }}
             <i className="fa pull-right ax-event-setting-toggle"
             ng-class="{ 'fa-toggle-off': !model.settings.patterns[ pattern.name ], 'fa-toggle-on': model.settings.patterns[ pattern.name ] }"></i>
             </button>
             </div>
             </div>
              <div className="ax-event-settings-col last">
             <h4>Interactions</h4>
             <div ng-repeat="(interaction, enabled) in model.settings.interactions track by interaction">
             <button
             type="button"
             className="btn btn-link ax-event-setting-toggle"
             ng-click="model.settings.interactions[ interaction ] = !enabled"
             >{{ interaction }}<i className="fa pull-right ax-event-setting-toggle"
             ng-className="{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }"></i>
             </button>
             </div>
              <br>
             <h4>Sources</h4>
             <div ng-repeat="(source, enabled) in model.settings.sources track by source">
             <button
             type="button"
             className="btn btn-link ax-event-setting-toggle"
             ng-click="model.settings.sources[ source ] = !enabled"
             >{{ source }}<i className="fa pull-right ax-event-setting-toggle"
             ng-class="{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }"></i>
             </button>
             </div>
             </div>
              </div>
              <div className="row">
             <div className="ax-event-settings-col first">&nbsp;</div>
             <div className="ax-event-settings-col last">
             <div className="pull-right">
             <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( true )">All On</button>
             <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( false )">All Off</button>
             <button type="button" className="btn btn-xs" ng-click="commands.setDefaults()">Defaults</button>
             </div>
             </div>
             </div>
              </div>
             </div>
             );*/







            /*  return
             <div className="ax-affix-area"
             ax-affix
             ax-affix-offset-top="100">
             { !model.eventInfos.length &&
             <div className="text-large">
             <h4 className="text-primary">Empty Events List</h4>
             <p><i className="fa fa-clock-o"></i> Waiting for events from host application...</p>
             </div>
             }
             { model.eventInfos.length && !model.visibleEventInfos.length &&
             <div className="text-large">
             <h4 className="text-primary">0/{ model.eventInfos.length } Event Items</h4>
             <p>No events matching current filters.</p>
             <p><button type="button"
             className="btn btn-sm btn-primary"
             onClick="commands.clearFilters">Show All</button></p>
             </div>
             }
              { model.problemSummary.hasProblems &&
             <div className="text-large">
             <h4 className="text-primary ax-error">{ model.problemSummary.eventInfos.length }/{ model.eventInfos.length } Events with Problems</h4>
             <ul>{eventInfoList}</ul>
             <p className="ax-event-problems-explanation">
             Events with problems are marked <strong className="ax-error">red</strong> in the events table.
             Filter by event/source as needed.
             </p>
             </div>
             }
             { model.visibleEventInfos.length &&
             <div className="text-large">
             <h4 className="text-primary">{ model.visibleEventInfos.length }/{ model.eventInfos.length } Events</h4>
             </div>
             }
             <div className="ax-button-wrapper form-inline">
             <div className="form-group form-group-sm">
             {filters}
             {limit}
             </div>
               {filterMenu}
              <button className="btn btn-primary btn-sm"
             type="button"
             ng-class="{ 'ax-disabled': !model.eventInfos.length }"
             ng-click="commands.discard()">Discard Events</button>
             </div>
              <div className="form-inline events-display-filter-items" ng-if="resources.filter.topics.length || resources.filter.participants.length">
             <a className="btn btn-xs btn-link" href="#/tools/page">Page selection</a>
             <span className="btn btn-xs btn-info"
             ng-repeat="item in resources.filter.topics track by item.topic"
             ng-className="'ax-events-display-pattern-' + item.pattern">
             {{item.topic}}
             </span><span className="btn btn-xs btn-info"
             ng-repeat="item in resources.filter.participants track by item.participant"
             ng-className="'ax-events-display-kind-' + item.kind">
             {{item.participant}}
             </span>
             </div>
             </div>*/}







         ////////////////////////////////////////////////////////////////////////////////////////////////////////
         var 
         ShowDetailsButton = (function (_React$Component2) {_inherits(ShowDetailsButton, _React$Component2);
            function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
               _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.handleClick = this.handleClick.bind(this);}
















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onNameChanged(!this.props.showDetails);e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('button', { type: 'button', className: 'btn-link btn-info', onClick: this.handleClick }, _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 
         EventCell = (function (_React$Component3) {_inherits(EventCell, _React$Component3);
            function EventCell(props) {_classCallCheck(this, EventCell);
               _get(Object.getPrototypeOf(EventCell.prototype), 'constructor', this).call(this, props);
               this.props = props;}















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventCell, [{ key: 'render', value: function render() {var splitPoint = this.props.content.indexOf(this.props.separator);if (splitPoint === -1) {return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content));}return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content.substring(0, splitPoint)), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.content.substring(splitPoint + 1, this.props.content.length)));} }]);return EventCell;})(_React['default'].Component);var 
         EventBody = (function (_React$Component4) {_inherits(EventBody, _React$Component4);
            function EventBody(props) {_classCallCheck(this, EventBody);
               _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { 
                  showDetails: false };

               this.handleName = this.handleName.bind(this);
               this.handleClick = this.handleClick.bind(this);}


























































































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventBody, [{ key: 'handleName', value: function handleName() {this.setState({ showDetails: !this.state.showDetails });} }, { key: 'handleClick', value: function handleClick(e) {this.props.onSelection(this.props.event);} //////////////////////////////////////////////////////////////////////////////////////////////////
            }, { key: 'render', value: function render() {var cssClassName = 'ax-event-pattern-' + this.props.event.pattern + ' ax-event-interaction-' + this.props.event.interaction + (this.props.selected ? ' ax-event-selected' : '') + (this.props.event.problems.length ? ' ax-event-has-problems' : '');var eventSummaryRow = _React['default'].createElement('tr', { className: 'ax-event-summary' }, _React['default'].createElement('td', { className: 'ax-col-pattern-icon', title: this.props.event.pattern }, _React['default'].createElement(PatternsHtmlIcon, { name: this.props.event.pattern })), _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction), _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, this.props.event.interaction == 'publish' && _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), _React['default'].createElement(EventCell, { content: this.props.event.name, separator: '.' }), _React['default'].createElement(EventCell, { content: this.props.event.source, separator: '#' }), _React['default'].createElement(EventCell, { content: this.props.event.target, separator: '#' }), _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId), _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.event.formattedTime.upper), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.event.formattedTime.lower))); ///////////////////////////////////////////////////////////////////////////////////////////////
                  function detailsRow(show, formattedEvent) {if (!show) {return _React['default'].createElement('tr', null);}return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('pre', null, formattedEvent)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                  //TODO: Test display of problems
                  function eventProblems(problems) {var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }, problem.description));});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, this.props.event.problems.length && eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component5) {_inherits(EventListTable, _React$Component5);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}














































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventListTable, [{ key: 'render', value: function render() {var _this = this;var events = this.props.events.map(function (event) {return _React['default'].createElement(EventBody, { event: event, key: event.index, viewPatternsByName: view.patternsByName, selectionEventInfo: _this.props.selectionEventInfo, onSelection: _this.props.onSelection, selected: event.selected });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var EventDisplayElement = (function (_React$Component6) {_inherits(EventDisplayElement, _React$Component6);
            function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);
               _get(Object.getPrototypeOf(EventDisplayElement.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { selectionEventInfo: null };
               this.handleSelection = this.handleSelection.bind(this);}




















































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventDisplayElement, [{ key: 'handleSelection', value: function handleSelection(selectedEvent) {var _this2 = this;var selectionEventInfoIndex = this.state.selectionEventInfo && this.state.selectionEventInfo.index;if (selectedEvent.index === selectionEventInfoIndex) {this.setState({ selectionEventInfo: null });this.props.events.forEach(function (event) {event.selected = false;});return;}this.props.events.forEach(function (event) {if (event.index === selectedEvent.index) {_this2.setState({ selectionEventInfo: event });event.selected = true;return;}if (inSelection(event, selectedEvent)) {event.selected = true;} else {event.selected = false;}});function inSelection(eventInfo, selectionEventInfo) {if (!selectionEventInfo) {return false;}return eventInfo === selectionEventInfo || eventInfo.cycleId === selectionEventInfo.cycleId && eventInfo.source === selectionEventInfo.source && eventInfo.name === selectionEventInfo.name;}} }, { key: 'render', value: function render() {if (this.props.visibleEventInfosLength === 0) {return _React['default'].createElement('div', null);}return _React['default'].createElement(EventListTable, { selectionEventInfo: this.state.selectionEventInfo, onSelection: this.handleSelection, events: this.props.events });} }]);return EventDisplayElement;})(_React['default'].Component);
         reactRender(
         _React['default'].createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length, 
            events: model.visibleEventInfos }));}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7QUFFYixVQUFJLGFBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7Ozs7QUFJNUQsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLDZCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsMkJBQTJCLENBQUUsUUFBUSxFQUFFO0FBQy9FLHdCQUFlLEVBQUUsVUFBVTtBQUMzQixtQkFBVSxFQUFFLElBQUksRUFDbEIsQ0FBRSxDQUFDOzs7OztBQUlKLGVBQVMsVUFBVSxHQUFHO0FBQ25CLGFBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDOUIsYUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixhQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsYUFBSSxRQUFRLENBQUMsV0FBVyxFQUFHO0FBQ3hCLGdCQUFJO0FBQ0QsMkJBQVksR0FBRyxJQUFJLE1BQU0sQ0FBRSxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBRSxDQUFDLENBQzFEOztBQUNELG1CQUFPLENBQUMsRUFBRyxxQ0FBdUMsQ0FDcEQ7O0FBQ0QsYUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7O0FBRWxELGNBQUssQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBRSxVQUFVLFNBQVMsRUFBRztBQUN0RSxnQkFBSSxRQUFRLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLFVBQVUsSUFBSSxRQUFRLENBQUMsa0JBQWtCLEVBQUc7QUFDckYsc0JBQU8sS0FBSyxDQUFDLENBQ2Y7O0FBQ0QsZ0JBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRztBQUNqRCxzQkFBTyxLQUFLLENBQUMsQ0FDZjs7QUFDRCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFHO0FBQ3pDLHNCQUFPLEtBQUssQ0FBQyxDQUNmOztBQUNELGdCQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUc7QUFDM0Msc0JBQU8sS0FBSyxDQUFDLENBQ2Y7O0FBQ0QsZ0JBQUksQ0FBQyxxQkFBcUIsQ0FBRSxTQUFTLENBQUUsRUFBRztBQUN2QyxzQkFBTyxLQUFLLENBQUMsQ0FDZjs7QUFDRCxnQkFBSSxDQUFDLHVCQUF1QixDQUFFLFNBQVMsRUFBRSxZQUFZLENBQUUsRUFBRztBQUN2RCxzQkFBTyxLQUFLLENBQUMsQ0FDZjs7QUFDRCxjQUFFLFVBQVUsQ0FBQztBQUNiLG1CQUFPLElBQUksQ0FBQyxDQUNkLENBQUUsQ0FBQzs7OztBQUdKLGNBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUUsVUFBVSxTQUFTLEVBQUc7QUFDcEQscUJBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBRSxDQUFDO0FBQ3BFLHFCQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBRSxTQUFTLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUUsQ0FBQztBQUN4RSxxQkFBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFFLENBQUM7QUFDeEUscUJBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixJQUFJLFdBQVcsQ0FBRSxTQUFTLEVBQUUsa0JBQWtCLENBQUUsQ0FBQyxDQUM1RixDQUFFLENBQUMsQ0FDTjs7Ozs7O0FBSUQsVUFBSSxLQUFLLEdBQUc7QUFDVCxpQkFBUSxFQUFFO0FBQ1A7QUFDRyxnQkFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsK0JBQStCLEVBQUUsVUFBVSxFQUFFO0FBQzFFLDBCQUFjLEVBQUUsZ0JBQWdCLENBQ2xDLEVBQ0E7OztBQUNEO0FBQ0csZ0JBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLHNDQUFzQyxFQUFFLFVBQVUsRUFBRTtBQUNsRixzQkFBVSxDQUNaLEVBQ0E7OztBQUNEO0FBQ0csZ0JBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLG1DQUFtQyxFQUFFLFVBQVUsRUFBRTtBQUM5RSxxQkFBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUN6QyxFQUNBOzs7QUFDRDtBQUNHLGdCQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSw4QkFBOEIsRUFBRSxVQUFVLEVBQUU7QUFDdkUsd0JBQVksQ0FDZCxFQUNBOzs7QUFDRDtBQUNHLGdCQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxVQUFVLEVBQUU7QUFDbkUsd0JBQVksQ0FDZCxFQUNBOzs7QUFDRDtBQUNHLGdCQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSw2QkFBNkIsRUFBRSxVQUFVLEVBQUU7QUFDbkUsMEJBQWMsQ0FDaEIsRUFDQTs7O0FBQ0Q7QUFDRyxnQkFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUUsVUFBVSxFQUFFO0FBQ3ZFLGtDQUFzQixFQUFFLHdCQUF3QixDQUNsRCxFQUNBOzs7QUFDRCxXQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFDLENBQ3JEOztBQUNELGNBQUssRUFBRSxDQUFDO0FBQ1IsbUJBQVUsRUFBRSxFQUFFO0FBQ2QsMEJBQWlCLEVBQUUsRUFBRTtBQUNyQix1QkFBYyxFQUFFO0FBQ2IsaUJBQUssRUFBRSxDQUFDO0FBQ1Isc0JBQVUsRUFBRSxFQUFFLEVBQ2hCOztBQUNELDJCQUFrQixFQUFFLElBQUk7QUFDeEIsaUJBQVEsRUFBRTtBQUNQLHVCQUFXLEVBQUUsRUFBRTtBQUNmLDhCQUFrQixFQUFFLEdBQUc7QUFDdkIsb0JBQVEsRUFBRSxFQUFFO0FBQ1osd0JBQVksRUFBRTtBQUNYLHdCQUFTLEVBQUUsSUFBSTtBQUNmLHNCQUFPLEVBQUUsSUFBSTtBQUNiLHNCQUFPLEVBQUUsSUFBSTtBQUNiLDBCQUFXLEVBQUUsSUFBSSxFQUNuQjs7QUFDRCxtQkFBTyxFQUFFO0FBQ04sc0JBQU8sRUFBRSxJQUFJO0FBQ2Isc0JBQU8sRUFBRSxJQUFJLEVBQ2YsRUFDSCxFQUNILENBQUM7Ozs7O0FBRUYsVUFBTSxJQUFJLEdBQUc7QUFDVixxQkFBWSxFQUFFLEtBQUssRUFDckIsQ0FBQzs7O0FBRUYsVUFBSSxRQUFRLEdBQUc7QUFDWixlQUFNLEVBQUUsZ0JBQVUsT0FBTyxFQUFHO0FBQ3pCLHlCQUFhLENBQUMsT0FBTyxDQUFFLFVBQVUsU0FBUyxFQUFHO0FBQzFDLG1CQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLG9CQUFLLElBQUksS0FBSSxJQUFJLEtBQUssRUFBRztBQUN0QixzQkFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxFQUFHO0FBQzlCLDBCQUFLLENBQUMsS0FBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQ3hCLENBQ0gsQ0FDSCxDQUFFLENBQUMsQ0FDTjs7Ozs7QUFDRCxvQkFBVyxFQUFFLHVCQUFXO0FBQ3JCLHlCQUFhLENBQUMsT0FBTyxDQUFFLFVBQVUsU0FBUyxFQUFHO0FBQzFDLG1CQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLG9CQUFLLElBQUksTUFBSSxJQUFJLEtBQUssRUFBRztBQUN0QixzQkFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQUksQ0FBQyxFQUFHO0FBQzlCLDBCQUFLLENBQUMsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQ3JCLENBQ0gsQ0FDSCxDQUFFLENBQUM7Ozs7QUFDSixpQkFBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUUsVUFBVSxXQUFXLEVBQUc7QUFDN0Msb0JBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FDbkQsQ0FBRSxDQUFDOztBQUNKLG1CQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFFLFVBQVUsT0FBTyxFQUFHO0FBQy9ELG9CQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FDM0MsQ0FBRSxDQUFDOztBQUNKLG1CQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFFLFVBQVUsT0FBTyxFQUFHO0FBQzlELG9CQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FDMUMsQ0FBRSxDQUFDOztBQUNKLG1CQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUUsVUFBVSxPQUFPLEVBQUc7QUFDbkUsb0JBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUMvQyxDQUFFLENBQUMsQ0FDTjs7O0FBQ0QscUJBQVksRUFBRSx3QkFBVztBQUN0QixpQkFBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLGlCQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUN6QyxtQkFBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FDbEM7Ozs7OztBQUtELGdCQUFPLEVBQUUsbUJBQVc7QUFDakIsaUJBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGlCQUFLLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLHNCQUFVLEVBQUUsQ0FBQztBQUNiLGlDQUFxQixFQUFFLENBQUMsQ0FDMUI7O0FBQ0QsbUJBQVUsRUFBRSxVQUFVLEVBQ3hCLENBQUM7OztBQUVGLGNBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7OztBQUl2QixVQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRztBQUNsQyxnQkFBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUUsYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUssRUFBRztBQUMzRixnQkFBSSxLQUFLLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRztBQUNwRCxvQkFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUUsUUFBUSxDQUFFLENBQUMsQ0FDakM7O0FBQ0k7QUFDRix1QkFBUSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUN6Qjs7QUFDRCxzQkFBVSxFQUFFLENBQUMsQ0FDZixDQUFFLENBQUMsQ0FDTjs7Ozs7Ozs7QUFNSyxzQkFBZ0IsMkNBQWhCLGdCQUFnQjs7QUFFUixrQkFGUixnQkFBZ0IsQ0FFTixLQUFLLEVBQUcsdUJBRmxCLGdCQUFnQjtBQUdoQix1Q0FIQSxnQkFBZ0IsNkNBR1QsS0FBSyxFQUFHO0FBQ2YsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixvQkFBUSxLQUFLLENBQUMsSUFBSTtBQUNmLG9CQUFLLFdBQVc7QUFDYixzQkFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFDakMsd0JBQU07QUFDVCxvQkFBSyxZQUFZO0FBQ2Qsc0JBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFDeEMsd0JBQU07QUFDVCxvQkFBSyxXQUFXO0FBQ2Isc0JBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7QUFDckMsd0JBQU07QUFDVCxvQkFBSyxTQUFTO0FBQ1gsc0JBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ2hDLHdCQUFNO0FBQ1Qsb0JBQUssT0FBTztBQUNULHNCQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztBQUM5Qix3QkFBTTtBQUNULG9CQUFLLE1BQU07QUFDUixzQkFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFDL0Isd0JBQU07QUFDVCxvQkFBSyxZQUFZO0FBQ2Qsc0JBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDO0FBQzdCLHdCQUFNO0FBQ1Q7QUFDRyxzQkFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FDekIsQ0FDSDs7Ozs7Ozs7Ozs7OztzQkEvQkUsZ0JBQWdCLDJCQWlDYixrQkFBRyxDQUNOLE9BQ0csdUNBQUcsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEFBQUMsR0FBRSxDQUNoQyxDQUVKLFlBdENFLGdCQUFnQixJQUFTLGtCQUFNLFNBQVM7QUEyQzlDLGVBQVMsUUFBUSxDQUFFLFNBQVMsRUFBRzs7QUFFNUIsYUFBSSxpQkFBaUIsR0FBRztBQUNyQixpQkFBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDcEIsdUJBQVcsRUFBRSxTQUFTLENBQUMsTUFBTTtBQUM3QixtQkFBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHO0FBQ3pELHVCQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsSUFBSSxFQUFFO0FBQ3hDLDBCQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUU7QUFDaEUseUJBQWEsRUFBRTtBQUNaLG9CQUFLLEVBQUUseUJBQVEsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLE1BQU0sQ0FBRSxPQUFPLENBQUU7QUFDakQsb0JBQUssRUFBRSx5QkFBUSxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBRSxFQUNwRDs7QUFDRCxnQkFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLElBQUksR0FBRztBQUM1QixtQkFBTyxFQUFFLE9BQU8sQ0FBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFBLENBQUUsV0FBVyxFQUFFLENBQUU7QUFDMUQsdUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGtCQUFNLEVBQUUsQ0FBRSxTQUFTLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQSxDQUFHLE9BQU8sQ0FBRSxXQUFXLEVBQUUsRUFBRSxDQUFFO0FBQzlELGtCQUFNLEVBQUUsQ0FBRSxTQUFTLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQSxDQUFHLE9BQU8sQ0FBRSxLQUFLLEVBQUUsRUFBRSxDQUFFO0FBQ3hELGdCQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDcEIsb0JBQVEsRUFBRSxLQUFLO0FBQ2Ysc0JBQVUsRUFBRSxDQUFFLFNBQVMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFBLENBQUcsT0FBTyxDQUFFLFNBQVMsQ0FBRSxLQUFLLENBQUMsR0FBRyxTQUFTLEdBQUcsU0FBUztBQUMxRixvQkFBUSxFQUFFLHFCQUFRLEtBQUssQ0FBRSxTQUFTLENBQUUsRUFDdEMsQ0FBQzs7O0FBRUYsY0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUUsaUJBQWlCLENBQUUsQ0FBQztBQUM5QyxhQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUc7QUFDckMsaUNBQXFCLEVBQUUsQ0FBQyxDQUMxQjs7O0FBRUQsYUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUc7QUFDaEUsZ0JBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekMsZ0JBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUc7QUFDL0Isb0NBQXFCLEVBQUUsQ0FBQyxDQUMxQixDQUNIOzs7O0FBRUQsa0JBQVMsT0FBTyxDQUFFLFNBQVMsRUFBRztBQUMzQixnQkFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxVQUFVLE9BQU8sRUFBRztBQUMvRCxzQkFBTyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxVQUFVLFNBQVMsRUFBRztBQUNuRCx5QkFBTyxTQUFTLENBQUMsT0FBTyxDQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQzdELENBQUUsQ0FBQyxDQUNOLENBQUUsQ0FBQzs7O0FBQ0osbUJBQU8sZ0JBQWdCLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FDdEUsQ0FFSDs7Ozs7OztBQUlELGVBQVMscUJBQXFCLEdBQUc7QUFDOUIsYUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUUsVUFBVSxJQUFJLEVBQUc7QUFDeEQsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQ2xDLENBQUUsQ0FBQzs7O0FBRUosY0FBSyxDQUFDLGNBQWMsR0FBRztBQUNwQix1QkFBVyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUNsQyxzQkFBVSxFQUFFLFVBQVUsRUFDeEIsQ0FBQyxDQUNKOzs7Ozs7QUFJRCxlQUFTLHVCQUF1QixDQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUc7QUFDekQsZ0JBQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNyRSxhQUFJLENBQUUsVUFBVSxLQUFLLEVBQUc7QUFDdEIsZ0JBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFFLENBQUM7QUFDekMsd0JBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLG1CQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDbkIsQ0FBRSxDQUFDLENBQ1o7Ozs7OztBQUlELFVBQUksYUFBYSxHQUFHO0FBQ2pCLGlCQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0FBQ3JDLGVBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztBQUNoRSxhQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDdkIsa0JBQVMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLDBCQUEwQixFQUFFLHlCQUF5QixDQUFDLEVBQ25HLENBQUM7Ozs7O0FBSUYsZUFBUyxxQkFBcUIsQ0FBRSxTQUFTLEVBQUc7QUFDekMsYUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFHO0FBQzdCLG1CQUFPLElBQUksQ0FBQyxDQUNkOzs7QUFFRCxhQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3pELGFBQUksa0JBQWtCLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztBQUNyRSxhQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRztBQUN0RCxtQkFBTyxJQUFJLENBQUMsQ0FDZDs7O0FBRUQsYUFBSSxrQkFBa0IsR0FBRyxZQUFZO0FBQ2pDLGFBQUksQ0FBRSxVQUFVLElBQUksRUFBRztBQUNyQixnQkFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQyxtQkFBTyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQVUsTUFBTSxFQUFHO0FBQ3RDLG1CQUFJLEtBQUssR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEMsc0JBQU8sU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUNqRixDQUFFLENBQUMsQ0FDTixDQUFFLENBQUM7Ozs7QUFFUCxhQUFJLHlCQUF5QixHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFVLEtBQUssRUFBRztBQUMxRSxnQkFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLG1CQUFPLGtCQUFrQjtBQUNyQixlQUFHLENBQUUsVUFBVSxDQUFDLEVBQUcsQ0FBRSxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxDQUFFO0FBQzlDLGdCQUFJLENBQUUsVUFBVSxDQUFFLEtBQUssQ0FBRSxDQUFFLENBQUMsQ0FDbEMsQ0FBRSxDQUFDOzs7QUFFSixnQkFBTyxrQkFBa0IsSUFBSSx5QkFBeUIsQ0FBQzs7OztBQUl2RCxrQkFBUyxVQUFVLENBQUUsS0FBSyxFQUFHO0FBQzFCLG1CQUFPLFVBQVUsQ0FBQyxFQUFHO0FBQ2xCLG1CQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLHNCQUFPLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxLQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUM3RixDQUFDLENBQ0osQ0FDSDs7Ozs7OztBQUlELGVBQVMsU0FBUyxDQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFHO0FBQ3ZELGdCQUFPLEtBQUssQ0FBQztBQUNiLGFBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNqQixhQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDckIsYUFBSSxDQUFDLFlBQVksRUFBRztBQUNqQixtQkFBTyxJQUFJLENBQUUsS0FBSyxDQUFFLElBQUksRUFBRSxLQUFLLENBQUUsQ0FBRSxDQUFDLENBQ3RDOzs7QUFFRCxhQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixhQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsYUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGFBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLGdCQUFPLEtBQUssRUFBRSxJQUFJLENBQUUsS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUEsS0FBTyxJQUFJLEVBQUc7QUFDaEUsZ0JBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLEVBQUc7QUFDM0Isb0JBQUssQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUUsRUFBRSxLQUFLLENBQUUsQ0FBRSxDQUFDLENBQ3pFOztBQUNELGlCQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBRSxDQUFDO0FBQ3BCLGlCQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBRSxLQUFLLENBQUUsQ0FBQyxDQUFFLEVBQUUsSUFBSSxDQUFFLENBQUUsQ0FBQztBQUN4QyxpQkFBSyxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsQ0FBQztBQUNyQixxQkFBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FDckM7O0FBQ0QscUJBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLGNBQUssQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBRSxDQUFFLENBQUM7QUFDaEUsZ0JBQU8sSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFFLENBQUUsQ0FBQzs7QUFFaEMsa0JBQVMsSUFBSSxDQUFFLEtBQUssRUFBRztBQUNwQixtQkFBTyxRQUFRLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUN0Qzs7O0FBRUQsa0JBQVMsS0FBSyxDQUFFLElBQUksRUFBRSxNQUFNLEVBQUc7QUFDNUIsZ0JBQUksQ0FBQyxjQUFjLElBQUksUUFBUSxFQUFHO0FBQy9CLHNCQUFPLElBQUksQ0FBQyxDQUNkOzs7QUFFRCxnQkFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxjQUFjLENBQUUsQ0FBQztBQUNoRCxnQkFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUc7QUFDckIsc0JBQU8sSUFBSSxDQUFDLENBQ2Q7OztBQUVELG9CQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBRTtBQUNqQyxrQkFBTSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUEsQUFBRSxHQUFHLHFCQUFxQixJQUFLLE1BQU0sR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFBLEFBQUU7QUFDMUUsZ0JBQUksQ0FBQyxTQUFTLENBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FDbkQsQ0FDSDs7Ozs7O0FBSUQsZUFBUyxXQUFXLENBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFHO0FBQ25ELGFBQUksQ0FBQyxrQkFBa0IsRUFBRztBQUN2QixtQkFBTyxLQUFLLENBQUMsQ0FDZjs7O0FBRUQsZ0JBQU8sU0FBUyxLQUFLLGtCQUFrQjtBQUNqQyxrQkFBUyxDQUFDLE9BQU8sS0FBSyxrQkFBa0IsQ0FBQyxPQUFPO0FBQ2hELGtCQUFTLENBQUMsTUFBTSxLQUFLLGtCQUFrQixDQUFDLE1BQU07QUFDOUMsa0JBQVMsQ0FBQyxJQUFJLEtBQUssa0JBQWtCLENBQUMsSUFBSSxBQUM1QyxDQUFDLENBQ1A7Ozs7OztBQUlELGVBQVMsUUFBUSxDQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFHO0FBQ2hELGFBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxXQUFXLENBQUM7QUFDaEMsYUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxTQUFTLENBQUUsQ0FBQztBQUMzQyxnQkFBTztBQUNKLGlCQUFLLEVBQUUsVUFBVSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxVQUFVLENBQUU7QUFDOUQsaUJBQUssRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsRUFDakYsQ0FBQyxDQUNKOzs7Ozs7QUFJRCxlQUFTLE1BQU0sR0FBRzs7QUFFZixrQkFBUyxLQUFLLEdBQUc7QUFDZCxtQkFBUyw2Q0FBSywyREFBb0IsQ0FBTSxDQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQTZNN0M7Ozs7Ozs7Ozs7QUFJSywwQkFBaUIsNENBQWpCLGlCQUFpQjtBQUNULHFCQURSLGlCQUFpQixDQUNQLEtBQUssRUFBRyx1QkFEbEIsaUJBQWlCO0FBRWpCLDBDQUZBLGlCQUFpQiw2Q0FFVixLQUFLLEVBQUc7QUFDZixtQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsbUJBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FDbkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFMRSxpQkFBaUIsZ0NBT1QscUJBQUUsQ0FBQyxFQUFHLENBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBRSxDQUFDLEFBQ3BELENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUN0Qiw0QkFFSyxrQkFBRyxDQUNOLE9BQU8sNENBQVEsSUFBSSxFQUFDLFFBQVEsRUFDYixTQUFTLEVBQUMsbUJBQW1CLEVBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDLElBQ3RDLHVDQUFHLFNBQVMsRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxvQkFBb0IsR0FBRyxtQkFBbUIsQUFBRSxRQUFXLENBQ3pGLENBQUMsQ0FDWixZQWxCRSxpQkFBaUIsSUFBUyxrQkFBTSxTQUFTO0FBdUJ6QyxrQkFBUyw0Q0FBVCxTQUFTO0FBQ0QscUJBRFIsU0FBUyxDQUNDLEtBQUssRUFBRyx1QkFEbEIsU0FBUztBQUVULDBDQUZBLFNBQVMsNkNBRUYsS0FBSyxFQUFHO0FBQ2YsbUJBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFKRSxTQUFTLDJCQU1OLGtCQUFHLENBQ04sSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFHLENBQUMsQUFDckUsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUcsQ0FDckIsT0FBTyw0Q0FBSSw4Q0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBUyxDQUFLLENBQUMsQ0FDdEQsQUFDRCxPQUFTLDRDQUNOLDhDQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBRSxDQUFDLEVBQUUsVUFBVSxDQUFFLENBQVMsRUFBQSwyQ0FBTSxFQUNwRSw4Q0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBUyxDQUN4RixDQUFHLENBRVYsWUFoQkUsU0FBUyxJQUFTLGtCQUFNLFNBQVM7QUFxQmpDLGtCQUFTLDRDQUFULFNBQVM7QUFDRCxxQkFEUixTQUFTLENBQ0MsS0FBSyxFQUFHLHVCQURsQixTQUFTO0FBRVQsMENBRkEsU0FBUyw2Q0FFRixLQUFLLEVBQUc7QUFDZixtQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsbUJBQUksQ0FBQyxLQUFLLEdBQUc7QUFDViw2QkFBVyxFQUFFLEtBQUssRUFDcEIsQ0FBQzs7QUFDRixtQkFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUMvQyxtQkFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQyxDQUNuRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBVEUsU0FBUywrQkFXRixzQkFBRyxDQUNWLElBQUksQ0FBQyxRQUFRLENBQUUsRUFBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBQyxDQUFFLENBQUMsQ0FDMUQsaUNBRVUscUJBQUUsQ0FBQyxFQUFHLENBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUM3Qzt1Q0FJSyxrQkFBRyxDQUNOLElBQU0sWUFBWSxHQUFHLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FDcEQsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxvQkFBb0IsR0FBRyxFQUFFLENBQUEsQUFBRSxJQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLHdCQUF3QixHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUMsQUFDcEYsSUFBTSxlQUFlLEdBQ2xCLHdDQUFJLFNBQVMsRUFBQyxrQkFBa0IsSUFDN0Isd0NBQUksU0FBUyxFQUFDLHFCQUFxQixFQUMvQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDLElBQUMsZ0NBQUMsZ0JBQWdCLElBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQyxHQUFFLENBQ25GLEVBQ0wsd0NBQUksU0FBUyxFQUFDLG9CQUFvQixJQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBTSxFQUN0RSx3Q0FBSSxTQUFTLEVBQUMscUJBQXFCLElBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxTQUFTLElBQ3pDLGdDQUFDLGlCQUFpQixJQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxFQUNwQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUFFLENBRXBELEVBQ0wsZ0NBQUMsU0FBUyxJQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUMsRUFBQyxTQUFTLEVBQUMsR0FBRyxHQUFHLEVBQzNELGdDQUFDLFNBQVMsSUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDLEVBQUMsU0FBUyxFQUFDLEdBQUcsR0FBRyxFQUM3RCxnQ0FBQyxTQUFTLElBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQyxFQUFDLFNBQVMsRUFBQyxHQUFHLEdBQUcsRUFDN0Qsd0NBQUksU0FBUyxFQUFDLHlCQUF5QixJQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBTSxFQUN2RSx3Q0FBSSxTQUFTLEVBQUMsWUFBWSxJQUFDLDhDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQVEsRUFBQSwyQ0FBTSxFQUNqRiw4Q0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFRLENBQ2pELENBQ0gsQUFDUCxDQUFDO0FBSUYsMkJBQVMsVUFBVSxDQUFFLElBQUksRUFBRSxjQUFjLEVBQUcsQ0FDekMsSUFBSSxDQUFDLElBQUksRUFBRyxDQUNULE9BQU8sMkNBQU0sQ0FBQyxDQUNoQixBQUNELE9BQVEsd0NBQUksU0FBUyxFQUFDLGtCQUFrQixJQUNyQyx3Q0FBSSxPQUFPLEVBQUMsR0FBRyxHQUFHLEVBQ2xCLHdDQUFJLE9BQU8sRUFBQyxHQUFHLElBQ1osNkNBQU0sY0FBYyxDQUFPLENBQ3pCLENBQ0gsQ0FBRSxDQUNUOztBQU1ELDJCQUFTLGFBQWEsQ0FBRSxRQUFRLEVBQUcsQ0FDaEMsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBRSxVQUFFLE9BQU8sRUFBTSxDQUNqRCxPQUNHLHdDQUFJLEdBQUcsRUFBRSxPQUFPLENBQUMsV0FBVyxBQUFDLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixJQUN2RCx1Q0FBRyxTQUFTLEVBQUMsZUFBZSxJQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUssQ0FDcEQsQ0FDTixDQUNKLENBQUUsQ0FBQyxBQUNKLE9BQ0csd0NBQUksU0FBUyxFQUFDLGtCQUFrQixJQUM3Qix3Q0FBSSxPQUFPLEVBQUMsR0FBRyxHQUFHLEVBQ2xCLHdDQUFJLE9BQU8sRUFBQyxHQUFHLElBQ1osNENBQ0ksY0FBYyxDQUNiLENBQ0gsQ0FDSCxDQUNOLENBQ0o7QUFJRCx5QkFDRywyQ0FBTyxTQUFTLEVBQUcsWUFBWSxBQUFFLEVBQzFCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDLElBQy9CLGVBQWUsRUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLGFBQWEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUUsRUFDOUUsVUFBVSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxDQUMvRCxDQUNULENBQ0osWUFoR0UsU0FBUyxJQUFTLGtCQUFNLFNBQVMsTUFxR2pDLGNBQWMsNENBQWQsY0FBYyxxQkFDTixTQURSLGNBQWMsQ0FDSixLQUFLLEVBQUcsdUJBRGxCLGNBQWMsRUFFZCwyQkFGQSxjQUFjLDZDQUVQLEtBQUssRUFBRyxBQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBSkUsY0FBYywyQkFNWCxrQkFBRyxrQkFDTixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLLEVBQUksQ0FDNUMsT0FDRyxnQ0FBQyxTQUFTLElBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUNiLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxBQUFDLEVBQ2pCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxjQUFjLEFBQUMsRUFDeEMsa0JBQWtCLEVBQUUsTUFBSyxLQUFLLENBQUMsa0JBQWtCLEFBQUMsRUFDbEQsV0FBVyxFQUFFLE1BQUssS0FBSyxDQUFDLFdBQVcsQUFBQyxFQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQUFBQyxHQUNsQyxDQUNILENBQ0osQ0FBRSxDQUFDO0FBSUoseUJBQ0csMkNBQU8sU0FBUyxFQUFDLE9BQU8sSUFDckIsa0RBQ0cseUNBQUssU0FBUyxFQUFDLHFCQUFxQixHQUFFLEVBQ3RDLHlDQUFLLFNBQVMsRUFBQyxvQkFBb0IsR0FBRSxFQUNyQyx5Q0FBSyxTQUFTLEVBQUMscUJBQXFCLEdBQUUsRUFDdEMseUNBQUssU0FBUyxFQUFDLGFBQWEsR0FBRSxFQUM5Qix5Q0FBSyxTQUFTLEVBQUMsZUFBZSxHQUFFLEVBQ2hDLHlDQUFLLFNBQVMsRUFBQyxlQUFlLEdBQUUsRUFDaEMseUNBQUssU0FBUyxFQUFDLGNBQWMsR0FBRSxFQUMvQix5Q0FBSyxTQUFTLEVBQUMsa0JBQWtCLEdBQUUsQ0FDM0IsRUFDWCwrQ0FDQSw0Q0FDRyxnREFBZSxFQUNmLHFEQUFlLEVBQ2YsZ0RBQWUsRUFDZix5REFBbUIsRUFDbkIscURBQWUsRUFDZixxREFBZSxFQUNmLHdDQUFJLFNBQVMsRUFBQyxZQUFZLFlBQVcsRUFDckMsd0NBQUksU0FBUyxFQUFDLFlBQVksWUFBSyx1Q0FBRyxTQUFTLEVBQUMscUJBQXFCLEdBQUUsQ0FBSyxDQUN0RSxDQUNHLEVBQ1AsTUFBTSxDQUNGLENBQ1QsQ0FDSixZQWhERSxjQUFjLElBQVMsa0JBQU0sU0FBUyxNQXFEdEMsbUJBQW1CLDRDQUFuQixtQkFBbUI7QUFDWCxxQkFEUixtQkFBbUIsQ0FDVCxLQUFLLEVBQUcsdUJBRGxCLG1CQUFtQjtBQUVuQiwwQ0FGQSxtQkFBbUIsNkNBRVosS0FBSyxFQUFHO0FBQ2YsbUJBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLG1CQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFDLENBQUM7QUFDeEMsbUJBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FDM0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFORSxtQkFBbUIsb0NBUVAseUJBQUUsYUFBYSxFQUFHLG1CQUM5QixJQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQUFFckcsSUFBSSxhQUFhLENBQUMsS0FBSyxLQUFLLHVCQUF1QixFQUFHLENBQ25ELElBQUksQ0FBQyxRQUFRLENBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBRSxDQUFDLEFBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFFLEtBQUssRUFBTSxDQUNyQyxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUN6QixDQUFFLENBQUMsQUFDSixPQUFPLENBQ1QsQUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBRSxLQUFLLEVBQU0sQ0FDckMsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUcsQ0FDdkMsT0FBSyxRQUFRLENBQUUsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsQ0FBRSxDQUFDLEFBQy9DLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEFBQ3RCLE9BQU8sQ0FDVCxBQUNELElBQUksV0FBVyxDQUFFLEtBQUssRUFBRSxhQUFhLENBQUUsRUFBRyxDQUN2QyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUN4QixNQUNJLENBQ0YsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FDekIsQ0FDSCxDQUFFLENBQUMsQUFFSixTQUFTLFdBQVcsQ0FBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUcsQ0FDbkQsSUFBSSxDQUFDLGtCQUFrQixFQUFHLENBQ3ZCLE9BQU8sS0FBSyxDQUFDLENBQ2YsQUFFRCxPQUFPLFNBQVMsS0FBSyxrQkFBa0IsSUFDakMsU0FBUyxDQUFDLE9BQU8sS0FBSyxrQkFBa0IsQ0FBQyxPQUFPLElBQ2hELFNBQVMsQ0FBQyxNQUFNLEtBQUssa0JBQWtCLENBQUMsTUFBTSxJQUM5QyxTQUFTLENBQUMsSUFBSSxLQUFLLGtCQUFrQixDQUFDLElBQUksQUFDNUMsQ0FBQyxDQUNQLENBQ0gsNEJBRUssa0JBQUcsQ0FDTixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEtBQUssQ0FBQyxFQUFHLENBQzVDLE9BQU8sNENBQVcsQ0FBQyxDQUNyQixBQUNELE9BQVMsZ0NBQUMsY0FBYyxJQUFDLGtCQUFrQixFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEFBQUUsRUFDckQsV0FBVyxFQUFHLElBQUksQ0FBQyxlQUFlLEFBQUUsRUFDcEMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDLEdBQ3hDLENBQ1IsQ0FDSixZQXZERSxtQkFBbUIsSUFBUyxrQkFBTSxTQUFTO0FBNERqRCxvQkFBVztBQUNSLHlDQUFDLG1CQUFtQixJQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEFBQUM7QUFDeEQsa0JBQU0sRUFBRSxLQUFLLENBQUMsaUJBQWlCLEFBQUMsR0FDbkQsQ0FDSixDQUFDLENBQ0o7Ozs7Ozs7QUFJRCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNLEVBQ3hCLENBQUMsQ0FDSjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUU7QUFDN0QsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJldmVudHMtZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcblxuXG5mdW5jdGlvbiBjcmVhdGUoIGNvbnRleHQsIHJlYWN0UmVuZGVyLCBmbG93U2VydmljZSApIHtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgbGV0IHNldHRpbmdHcm91cHMgPSBbJ3BhdHRlcm5zJywgJ2ludGVyYWN0aW9ucycsICdzb3VyY2VzJ107XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNvbnRleHQucmVzb3VyY2VzID0ge307XG5cbiAgIGF4UGF0dGVybnMucmVzb3VyY2VzLmhhbmRsZXJGb3IoIGNvbnRleHQgKS5yZWdpc3RlclJlc291cmNlRnJvbUZlYXR1cmUoICdmaWx0ZXInLCB7XG4gICAgICBvblVwZGF0ZVJlcGxhY2U6IHJ1bkZpbHRlcnMsXG4gICAgICBpc09wdGlvbmFsOiB0cnVlXG4gICB9ICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJ1bkZpbHRlcnMoKSB7XG4gICAgICBsZXQgc2V0dGluZ3MgPSBtb2RlbC5zZXR0aW5ncztcbiAgICAgIGxldCBudW1WaXNpYmxlID0gMDtcblxuICAgICAgbGV0IHNlYXJjaFJlZ0V4cCA9IG51bGw7XG4gICAgICBpZiggc2V0dGluZ3MubmFtZVBhdHRlcm4gKSB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2VhcmNoUmVnRXhwID0gbmV3IFJlZ0V4cCggc2V0dGluZ3MubmFtZVBhdHRlcm4sICdnaScgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGNhdGNoKCBlICkgeyAvKiBpZ25vcmUgaW52YWxpZCBzZWFyY2ggcGF0dGVybiAqLyB9XG4gICAgICB9XG4gICAgICBsZXQgc2VsZWN0aW9uRXZlbnRJbmZvID0gbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvO1xuXG4gICAgICBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcyA9IG1vZGVsLmV2ZW50SW5mb3MuZmlsdGVyKCBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgaWYoIHNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCAhPT0gbnVsbCAmJiBudW1WaXNpYmxlID49IHNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3MuaW50ZXJhY3Rpb25zW2V2ZW50SW5mby5pbnRlcmFjdGlvbl0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIXNldHRpbmdzLnBhdHRlcm5zW2V2ZW50SW5mby5wYXR0ZXJuXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3Muc291cmNlc1tldmVudEluZm8uc291cmNlVHlwZV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIW1hdGNoZXNGaWx0ZXJSZXNvdXJjZSggZXZlbnRJbmZvICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIW1hdGNoZXNTZWFyY2hFeHByZXNzaW9uKCBldmVudEluZm8sIHNlYXJjaFJlZ0V4cCApICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgKytudW1WaXNpYmxlO1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9ICk7XG5cbiAgICAgIC8vIG1vZGlmeSBtYXRjaGVzIGluIHBsYWNlXG4gICAgICBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5mb3JFYWNoKCBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgZXZlbnRJbmZvLmh0bWxOYW1lID0gaHRtbFZhbHVlKCBldmVudEluZm8ubmFtZSwgc2VhcmNoUmVnRXhwLCAnLicgKTtcbiAgICAgICAgIGV2ZW50SW5mby5odG1sU291cmNlID0gaHRtbFZhbHVlKCBldmVudEluZm8uc291cmNlLCBzZWFyY2hSZWdFeHAsICcjJyApO1xuICAgICAgICAgZXZlbnRJbmZvLmh0bWxUYXJnZXQgPSBodG1sVmFsdWUoIGV2ZW50SW5mby50YXJnZXQsIHNlYXJjaFJlZ0V4cCwgJyMnICk7XG4gICAgICAgICBldmVudEluZm8uc2VsZWN0ZWQgPSAhIXNlbGVjdGlvbkV2ZW50SW5mbyAmJiBpblNlbGVjdGlvbiggZXZlbnRJbmZvLCBzZWxlY3Rpb25FdmVudEluZm8gKTtcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgbGV0IG1vZGVsID0ge1xuICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsaWZlY3ljbGUnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtcmVjeWNsZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnZW5kTGlmZWN5Y2xlJywgJ2JlZ2luTGlmZWN5Y2xlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICduYXZpZ2F0aW9uJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWxvY2F0aW9uLWFycm93XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICduYXZpZ2F0ZSdcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncmVzb3VyY2VzJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWZpbGUtdGV4dC1vXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICdyZXBsYWNlJywgJ3VwZGF0ZScsICd2YWxpZGF0ZScsICdzYXZlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdhY3Rpb25zJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLXJvY2tldFwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAndGFrZUFjdGlvbidcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZmxhZ3MnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZmxhZ1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlRmxhZydcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaTE4bicsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1nbG9iZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlTG9jYWxlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd2aXNpYmlsaXR5JywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlQXJlYVZpc2liaWxpdHknLCAnY2hhbmdlV2lkZ2V0VmlzaWJpbGl0eSdcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7bmFtZTogJ290aGVyJywgaHRtbEljb246ICcmbmJzcDsnLCBldmVudFR5cGVzOiBbXX1cbiAgICAgIF0sXG4gICAgICBpbmRleDogMCxcbiAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgIH0sXG4gICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfTtcblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBjb21tYW5kcyA9IHtcbiAgICAgIHNldEFsbDogZnVuY3Rpb24oIHRvVmFsdWUgKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5JbmZvLm5hbWVdID0gdHJ1ZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVQYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5dID0gZmFsc2U7XG4gICAgICAgICB9ICk7XG4gICAgICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnNvdXJjZXNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBjbGVhckZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgbW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm4gPSAnJztcbiAgICAgICAgIG1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCA9IG51bGw7XG4gICAgICAgICBjb250ZXh0LmNvbW1hbmRzLnNldEFsbCggdHJ1ZSApO1xuICAgICAgfSxcbiAgICAgIC8vIHNlbGVjdDogZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgIC8vICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IGV2ZW50SW5mby5zZWxlY3RlZCA/IG51bGwgOiBldmVudEluZm87XG4gICAgICAvLyAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAvLyB9LFxuICAgICAgZGlzY2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ldmVudEluZm9zID0gW107XG4gICAgICAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICB9LFxuICAgICAgcnVuRmlsdGVyczogcnVuRmlsdGVyc1xuICAgfTtcblxuICAgY29tbWFuZHMuc2V0RGVmYXVsdHMoKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgaWYoIGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSApIHtcbiAgICAgIGNvbnRleHQuZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUHJvZHVjZS4nICsgY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggZXZlbnQuZGF0YSApICYmIGV2ZW50LmRhdGEubGVuZ3RoICkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS5mb3JFYWNoKCBhZGRFdmVudCApO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRFdmVudCggZXZlbnQuZGF0YSApO1xuICAgICAgICAgfVxuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvL2NvbnRleHQuJHdhdGNoKCAnbW9kZWwuc2V0dGluZ3MnLCBydW5GaWx0ZXJzLCB0cnVlICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFBhdHRlcm5zSHRtbEljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgICAgICAgc3dpdGNoKCBwcm9wcy5uYW1lICkge1xuICAgICAgICAgICAgY2FzZSAnbGlmZWN5Y2xlJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJlY3ljbGUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduYXZpZ2F0aW9uJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWxvY2F0aW9uLWFycm93JztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVzb3VyY2VzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZpbGUtdGV4dC1vJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWN0aW9ucyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1yb2NrZXQnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmbGFncyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1mbGFnJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaTE4bic6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1nbG9iZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2liaWxpdHknOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZXllJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJyc7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9e3RoaXMuaWNvbkNsYXNzfS8+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGFkZEV2ZW50KCBldmVudEluZm8gKSB7XG5cbiAgICAgIGxldCBjb21wbGV0ZUV2ZW50SW5mbyA9IHtcbiAgICAgICAgIGluZGV4OiArK21vZGVsLmluZGV4LFxuICAgICAgICAgaW50ZXJhY3Rpb246IGV2ZW50SW5mby5hY3Rpb24sXG4gICAgICAgICBjeWNsZUlkOiBldmVudEluZm8uY3ljbGVJZCA+IC0xID8gZXZlbnRJbmZvLmN5Y2xlSWQgOiAnLScsXG4gICAgICAgICBldmVudE9iamVjdDogZXZlbnRJbmZvLmV2ZW50T2JqZWN0IHx8IHt9LFxuICAgICAgICAgZm9ybWF0dGVkRXZlbnQ6IEpTT04uc3RyaW5naWZ5KCBldmVudEluZm8uZXZlbnRPYmplY3QsIG51bGwsIDMgKSxcbiAgICAgICAgIGZvcm1hdHRlZFRpbWU6IHtcbiAgICAgICAgICAgIHVwcGVyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnSEg6bW0nICksXG4gICAgICAgICAgICBsb3dlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ3NzLlNTUycgKVxuICAgICAgICAgfSxcbiAgICAgICAgIG5hbWU6IGV2ZW50SW5mby5ldmVudCB8fCAnPycsXG4gICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuKCAoZXZlbnRJbmZvLmV2ZW50IHx8ICc/JykudG9Mb3dlckNhc2UoKSApLFxuICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlLFxuICAgICAgICAgc291cmNlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkucmVwbGFjZSggL153aWRnZXRcXC4vLCAnJyApLFxuICAgICAgICAgdGFyZ2V0OiAoIGV2ZW50SW5mby50YXJnZXQgfHwgJz8nICkucmVwbGFjZSggL14tJC8sICcnICksXG4gICAgICAgICB0aW1lOiBldmVudEluZm8udGltZSxcbiAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZVR5cGU6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5pbmRleE9mKCAnd2lkZ2V0LicgKSA9PT0gMCA/ICd3aWRnZXRzJyA6ICdydW50aW1lJyxcbiAgICAgICAgIHByb2JsZW1zOiB0cmFja2VyLnRyYWNrKCBldmVudEluZm8gKVxuICAgICAgfTtcblxuICAgICAgbW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggPiBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgbGV0IHJlbW92ZWRJbmZvID0gbW9kZWwuZXZlbnRJbmZvcy5wb3AoKTtcbiAgICAgICAgIGlmKCByZW1vdmVkSW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGF0dGVybiggZXZlbnROYW1lICkge1xuICAgICAgICAgbGV0IG1hdGNoaW5nUGF0dGhlcm4gPSBtb2RlbC5wYXR0ZXJucy5maWx0ZXIoIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4uZXZlbnRUeXBlcy5zb21lKCBmdW5jdGlvbiggZXZlbnRUeXBlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5pbmRleE9mKCBldmVudFR5cGUudG9Mb3dlckNhc2UoKSApICE9PSAtMTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJldHVybiBtYXRjaGluZ1BhdHRoZXJuLmxlbmd0aCA/IG1hdGNoaW5nUGF0dGhlcm5bMF0ubmFtZSA6ICdvdGhlcic7XG4gICAgICB9XG5cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCkge1xuICAgICAgbGV0IGV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGluZm8gKSB7XG4gICAgICAgICByZXR1cm4gaW5mby5wcm9ibGVtcy5sZW5ndGggPiAwO1xuICAgICAgfSApO1xuXG4gICAgICBtb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbZXZlbnRJbmZvLm5hbWUsIGV2ZW50SW5mby5zb3VyY2UsIGV2ZW50SW5mby50YXJnZXRdXG4gICAgICAgICAgICAuc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBzZWFyY2hSZWdFeHAudGVzdCggZmllbGQgKTtcbiAgICAgICAgICAgICAgIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgcmV0dXJuICEhbWF0Y2hlcztcbiAgICAgICAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgbGV0IHBhdHRlcm5Ub3BpY3MgPSB7XG4gICAgICBSRVNPVVJDRTogWydkaWRSZXBsYWNlJywgJ2RpZFVwZGF0ZSddLFxuICAgICAgQUNUSU9OOiBbJ3Rha2VBY3Rpb25SZXF1ZXN0JywgJ3dpbGxUYWtlQWN0aW9uJywgJ2RpZFRha2VBY3Rpb24nXSxcbiAgICAgIEZMQUc6IFsnZGlkQ2hhbmdlRmxhZyddLFxuICAgICAgQ09OVEFJTkVSOiBbJ2NoYW5nZUFyZWFWaXNpYmlsaXR5UmVxdWVzdCcsICd3aWxsQ2hhbmdlQXJlYVZpc2liaWxpdHknLCAnZGlkQ2hhbmdlQXJlYVZpc2liaWxpdHknXVxuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmZpbHRlciApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZmlsdGVyVG9waWNzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB8fCBbXTtcbiAgICAgIGxldCBmaWx0ZXJQYXJ0aWNpcGFudHMgPSBjb250ZXh0LnJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzIHx8IFtdO1xuICAgICAgaWYoICFmaWx0ZXJUb3BpY3MubGVuZ3RoICYmICFmaWx0ZXJQYXJ0aWNpcGFudHMubGVuZ3RoICkge1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXRjaGVzVG9waWNGaWx0ZXIgPSBmaWx0ZXJUb3BpY3NcbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICAgICAgICAgIGxldCBwcmVmaXhlcyA9IHBhdHRlcm5Ub3BpY3NbaXRlbS5wYXR0ZXJuXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbJ3RhcmdldCcsICdzb3VyY2UnXS5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBldmVudEluZm9bZmllbGRdO1xuICAgICAgICAgcmV0dXJuIGZpbHRlclBhcnRpY2lwYW50c1xuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24oIF8gKSB7IHJldHVybiBfLnBhcnRpY2lwYW50OyB9IClcbiAgICAgICAgICAgIC5zb21lKCBpc1N1ZmZpeE9mKCB2YWx1ZSApICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHJldHVybiBtYXRjaGVzVG9waWNGaWx0ZXIgfHwgbWF0Y2hlc1BhcnRpY2lwYW50c0ZpbHRlcjtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaXNTdWZmaXhPZiggdmFsdWUgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF8gKSB7XG4gICAgICAgICAgICBsZXQgdGFpbCA9ICcjJyArIF87XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IHRhaWwubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoIHRhaWwgKSA9PT0gdmFsdWUubGVuZ3RoIC0gdGFpbC5sZW5ndGg7XG4gICAgICAgICB9O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBodG1sVmFsdWUoIHZhbHVlLCBzZWFyY2hSZWdFeHAsIHNwbGl0Q2hhcmFjdGVyICkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgbGV0IGh0bWwgPSB2YWx1ZTsgLy8kc2FuaXRpemUoIHZhbHVlICk7XG4gICAgICBsZXQgd2FzU3BsaXQgPSBmYWxzZTtcbiAgICAgIGlmKCAhc2VhcmNoUmVnRXhwICkge1xuICAgICAgICAgcmV0dXJuIHdyYXAoIHNwbGl0KCBodG1sLCBmYWxzZSApICk7XG4gICAgICB9XG5cbiAgICAgIGxldCBwYXJ0cyA9IFtdO1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgbGV0IGxhc3RJbmRleCA9IDA7XG4gICAgICBsZXQgbGltaXQgPSAxO1xuICAgICAgd2hpbGUoIGxpbWl0LS0gJiYgKCBtYXRjaCA9IHNlYXJjaFJlZ0V4cC5leGVjKCBodG1sICkgKSAhPT0gbnVsbCApIHtcbiAgICAgICAgIGlmKCBtYXRjaC5pbmRleCA+IGxhc3RJbmRleCApIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goIHNwbGl0KCBodG1sLnN1YnN0cmluZyggbGFzdEluZGV4LCBtYXRjaC5pbmRleCApLCBmYWxzZSApICk7XG4gICAgICAgICB9XG4gICAgICAgICBwYXJ0cy5wdXNoKCAnPGI+JyApO1xuICAgICAgICAgcGFydHMucHVzaCggc3BsaXQoIG1hdGNoWyAwIF0sIHRydWUgKSApO1xuICAgICAgICAgcGFydHMucHVzaCggJzwvYj4nICk7XG4gICAgICAgICBsYXN0SW5kZXggPSBzZWFyY2hSZWdFeHAubGFzdEluZGV4O1xuICAgICAgfVxuICAgICAgc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICBwYXJ0cy5wdXNoKCBzcGxpdCggaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCwgaHRtbC5sZW5ndGggKSApICk7XG4gICAgICByZXR1cm4gd3JhcCggcGFydHMuam9pbiggJycgKSApO1xuXG4gICAgICBmdW5jdGlvbiB3cmFwKCB3aG9sZSApIHtcbiAgICAgICAgIHJldHVybiAnPHNwYW4+JyArIHdob2xlICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzcGxpdCggcGFydCwgaXNCb2xkICkge1xuICAgICAgICAgaWYoICFzcGxpdENoYXJhY3RlciB8fCB3YXNTcGxpdCApIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgc3BsaXRQb2ludCA9IHBhcnQuaW5kZXhPZiggc3BsaXRDaGFyYWN0ZXIgKTtcbiAgICAgICAgIGlmKCBzcGxpdFBvaW50ID09PSAtMSApIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgICAgfVxuXG4gICAgICAgICB3YXNTcGxpdCA9IHRydWU7XG4gICAgICAgICByZXR1cm4gcGFydC5zdWJzdHJpbmcoIDAsIHNwbGl0UG9pbnQgKSArXG4gICAgICAgICAgICAoIGlzQm9sZCA/ICc8L2I+JyA6ICcnICkgKyAnPC9zcGFuPjxiciAvPjxzcGFuPicgKyAoIGlzQm9sZCA/ICc8Yj4nIDogJycgKSArXG4gICAgICAgICAgICBwYXJ0LnN1YnN0cmluZyggc3BsaXRQb2ludCArIDEsIHBhcnQubGVuZ3RoICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGluU2VsZWN0aW9uKCBldmVudEluZm8sIHNlbGVjdGlvbkV2ZW50SW5mbyApIHtcbiAgICAgIGlmKCAhc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXZlbnRJbmZvID09PSBzZWxlY3Rpb25FdmVudEluZm8gfHwgKFxuICAgICAgICAgICAgZXZlbnRJbmZvLmN5Y2xlSWQgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5jeWNsZUlkICYmXG4gICAgICAgICAgICBldmVudEluZm8uc291cmNlID09PSBzZWxlY3Rpb25FdmVudEluZm8uc291cmNlICYmXG4gICAgICAgICAgICBldmVudEluZm8ubmFtZSA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLm5hbWVcbiAgICAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHNlcGFyYXRlKCBsYWJlbCwgc2VwYXJhdG9yLCBkZWZhdWx0VGV4dCApIHtcbiAgICAgIGxldCBuYW1lID0gbGFiZWwgfHwgZGVmYXVsdFRleHQ7XG4gICAgICBsZXQgc3BsaXRQb2ludCA9IG5hbWUuaW5kZXhPZiggc2VwYXJhdG9yICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgdXBwZXI6IHNwbGl0UG9pbnQgPT09IC0xID8gbmFtZSA6IG5hbWUuc3Vic3RyKCAwLCBzcGxpdFBvaW50ICksXG4gICAgICAgICBsb3dlcjogc3BsaXRQb2ludCA9PT0gLTEgPyBkZWZhdWx0VGV4dCA6IG5hbWUuc3Vic3RyKCBzcGxpdFBvaW50LCBuYW1lLmxlbmd0aCApXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFmZml4KCkge1xuICAgICAgICAgcmV0dXJuICggPGRpdj48cD5hZmZpeCBjYWxsaW5nPC9wPjwvZGl2PiApO1xuICAgICAgICAgLypcbiAgICAgICAgICBjb25zdCBldmVudEluZm9MaXN0ID0gbW9kZWwucHJvYmxlbVN1bW1hcnkuZXZlbnRJbmZvcy5tYXAoICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkga2V5PXtldmVudC5uYW1lfT5cbiAgICAgICAgICA8aDU+PHN0cm9uZz57IGV2ZW50Lm5hbWUgfTwvc3Ryb25nPiA8ZW0+KHNvdXJjZTogeyBldmVudC5zb3VyY2UgfSk8L2VtPjwvaDU+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtcbiAgICAgICAgICBldmVudC5wcm9ibGVtcy5tYXAoICggcHJvYmxlbXMgKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkga2V5PXtwcm9ibGVtLmRlc2NyaXB0aW9ufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS13YXJuaW5nIGF4LWVycm9yXCIvPiB7IHByb2JsZW0uZGVzY3JpcHRpb24gfVxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKTtcbiAgICAgICAgICB9IClcbiAgICAgICAgICB9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIClcbiAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICBjbGFzcyBGaWx0ZXJzRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMucHJvcHMubmFtZX07XG5cbiAgICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoYW5kbGVDaGFuZ2UoIGV2ZW50ICkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxsYWJlbCBheC1mb3I9XCInc2VhcmNoJ1wiPlxuICAgICAgICAgIDxzbWFsbD5GaWx0ZXJzOjwvc21hbGw+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCAoUmVnRXhwKVwiXG4gICAgICAgICAgYXgtaWQ9XCInc2VhcmNoJ1wiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJzID0gPEZpbHRlcnNGb3JtIG5hbWU9XCJtb2RlbC5zZXR0aW5ncy5uYW1lUGF0dGVyblwiLz47XG5cbiAgICAgICAgICBjb25zdCBsaW1pdCA9IChcbiAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ2xpbWl0J1wiPlxuICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgYXgtaWQ9XCInbGltaXQnXCJcbiAgICAgICAgICBuZy1tb2RlbD1cIm1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdFwiXG4gICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cInsgdXBkYXRlT246ICdkZWZhdWx0JyB9XCJcbiAgICAgICAgICBheC1pbnB1dD1cImludGVnZXJcIlxuICAgICAgICAgIGF4LWlucHV0LW1pbmltdW0tdmFsdWU9XCIwXCJcbiAgICAgICAgICBheC1pbnB1dC1tYXhpbXVtLXZhbHVlPVwiZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMC17eyBmZWF0dXJlcy5ldmVudHMuYnVmZmVyU2l6ZSB9fVwiXG4gICAgICAgICAgbWF4bGVuZ3RoPVwiNFwiLz5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4ge2ZpbHRlcnN9O1xuICAgICAgICAgICovXG4gICAgICAgICAvKiAgIGNvbnN0IGZpbHRlck1lbnUgPSAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdvcGVuJzogdmlldy5zaG93UGF0dGVybnMgfVwiXG4gICAgICAgICAgbmctbW91c2VlbnRlcj1cInZpZXcuc2hvd1BhdHRlcm5zID0gdHJ1ZVwiXG4gICAgICAgICAgbmctbW91c2VsZWF2ZT1cInZpZXcuc2hvd1BhdHRlcm5zID0gZmFsc2VcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxuICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ7eyB2aWV3LnNob3dQYXR0ZXJucyB9fVwiPlxuICAgICAgICAgIE1vcmUgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51IGNvbnRhaW5lciBjb2wtbGctNlwiIHJvbGU9XCJtZW51XCI+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGZpcnN0XCI+XG4gICAgICAgICAgPGg0PlBhdHRlcm5zPC9oND5cbiAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cInBhdHRlcm4gaW4gbW9kZWwucGF0dGVybnMgdHJhY2sgYnkgcGF0dGVybi5uYW1lXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgbmctY2xpY2s9XCJtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gPSAhbW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4ubmFtZSBdXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF0dGVyblwiIG5nLWJpbmQtaHRtbD1cInBhdHRlcm4uaHRtbEljb25cIj48L3NwYW4+XG4gICAgICAgICAge3sgcGF0dGVybi5uYW1lIH19XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgbmctY2xhc3M9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIW1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSwgJ2ZhLXRvZ2dsZS1vbic6IG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSB9XCI+PC9pPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgIDxoND5JbnRlcmFjdGlvbnM8L2g0PlxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKGludGVyYWN0aW9uLCBlbmFibGVkKSBpbiBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnMgdHJhY2sgYnkgaW50ZXJhY3Rpb25cIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLmludGVyYWN0aW9uc1sgaW50ZXJhY3Rpb24gXSA9ICFlbmFibGVkXCJcbiAgICAgICAgICA+e3sgaW50ZXJhY3Rpb24gfX08aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIWVuYWJsZWQsICdmYS10b2dnbGUtb24nOiBlbmFibGVkIH1cIj48L2k+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPGg0PlNvdXJjZXM8L2g0PlxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKHNvdXJjZSwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3Muc291cmNlcyB0cmFjayBieSBzb3VyY2VcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLnNvdXJjZXNbIHNvdXJjZSBdID0gIWVuYWJsZWRcIlxuICAgICAgICAgID57eyBzb3VyY2UgfX08aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGFzcz1cInsgJ2ZhLXRvZ2dsZS1vZmYnOiAhZW5hYmxlZCwgJ2ZhLXRvZ2dsZS1vbic6IGVuYWJsZWQgfVwiPjwvaT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBmaXJzdFwiPiZuYnNwOzwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGxhc3RcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1wcmltYXJ5XCIgbmctY2xpY2s9XCJjb21tYW5kcy5zZXRBbGwoIHRydWUgKVwiPkFsbCBPbjwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldEFsbCggZmFsc2UgKVwiPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXhzXCIgbmctY2xpY2s9XCJjb21tYW5kcy5zZXREZWZhdWx0cygpXCI+RGVmYXVsdHM8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICk7Ki9cblxuICAgICAgICAgLyogIHJldHVyblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYWZmaXgtYXJlYVwiXG4gICAgICAgICAgYXgtYWZmaXhcbiAgICAgICAgICBheC1hZmZpeC1vZmZzZXQtdG9wPVwiMTAwXCI+XG4gICAgICAgICAgeyAhbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+RW1wdHkgRXZlbnRzIExpc3Q8L2g0PlxuICAgICAgICAgIDxwPjxpIGNsYXNzTmFtZT1cImZhIGZhLWNsb2NrLW9cIj48L2k+IFdhaXRpbmcgZm9yIGV2ZW50cyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgfVxuICAgICAgICAgIHsgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiYgIW1vZGVsLnZpc2libGVFdmVudEluZm9zLmxlbmd0aCAmJlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj4wL3sgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfSBFdmVudCBJdGVtczwvaDQ+XG4gICAgICAgICAgPHA+Tm8gZXZlbnRzIG1hdGNoaW5nIGN1cnJlbnQgZmlsdGVycy48L3A+XG4gICAgICAgICAgPHA+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICBvbkNsaWNrPVwiY29tbWFuZHMuY2xlYXJGaWx0ZXJzXCI+U2hvdyBBbGw8L2J1dHRvbj48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtcyAmJlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnkgYXgtZXJyb3JcIj57IG1vZGVsLnByb2JsZW1TdW1tYXJ5LmV2ZW50SW5mb3MubGVuZ3RoIH0veyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9IEV2ZW50cyB3aXRoIFByb2JsZW1zPC9oND5cbiAgICAgICAgICA8dWw+e2V2ZW50SW5mb0xpc3R9PC91bD5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJheC1ldmVudC1wcm9ibGVtcy1leHBsYW5hdGlvblwiPlxuICAgICAgICAgIEV2ZW50cyB3aXRoIHByb2JsZW1zIGFyZSBtYXJrZWQgPHN0cm9uZyBjbGFzc05hbWU9XCJheC1lcnJvclwiPnJlZDwvc3Ryb25nPiBpbiB0aGUgZXZlbnRzIHRhYmxlLlxuICAgICAgICAgIEZpbHRlciBieSBldmVudC9zb3VyY2UgYXMgbmVlZGVkLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgeyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+eyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggfS97IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH0gRXZlbnRzPC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1idXR0b24td3JhcHBlciBmb3JtLWlubGluZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtXCI+XG4gICAgICAgICAge2ZpbHRlcnN9XG4gICAgICAgICAge2xpbWl0fVxuICAgICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgICB7ZmlsdGVyTWVudX1cblxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgbmctY2xhc3M9XCJ7ICdheC1kaXNhYmxlZCc6ICFtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XCJcbiAgICAgICAgICBuZy1jbGljaz1cImNvbW1hbmRzLmRpc2NhcmQoKVwiPkRpc2NhcmQgRXZlbnRzPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0taW5saW5lIGV2ZW50cy1kaXNwbGF5LWZpbHRlci1pdGVtc1wiIG5nLWlmPVwicmVzb3VyY2VzLmZpbHRlci50b3BpY3MubGVuZ3RoIHx8IHJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzLmxlbmd0aFwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLWxpbmtcIiBocmVmPVwiIy90b29scy9wYWdlXCI+UGFnZSBzZWxlY3Rpb248L2E+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgbmctcmVwZWF0PVwiaXRlbSBpbiByZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB0cmFjayBieSBpdGVtLnRvcGljXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXktcGF0dGVybi0nICsgaXRlbS5wYXR0ZXJuXCI+XG4gICAgICAgICAge3tpdGVtLnRvcGljfX1cbiAgICAgICAgICA8L3NwYW4+PHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgbmctcmVwZWF0PVwiaXRlbSBpbiByZXNvdXJjZXMuZmlsdGVyLnBhcnRpY2lwYW50cyB0cmFjayBieSBpdGVtLnBhcnRpY2lwYW50XCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXkta2luZC0nICsgaXRlbS5raW5kXCI+XG4gICAgICAgICAge3tpdGVtLnBhcnRpY2lwYW50fX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+Ki9cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCAhdGhpcy5wcm9wcy5zaG93RGV0YWlscyApO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IHRoaXMucHJvcHMuc2hvd0RldGFpbHMgPyBcImZhIGZhLW1pbnVzLXNxdWFyZVwiIDogXCJmYSBmYS1wbHVzLXNxdWFyZVwiIH0+Jm5ic3A7PC9pPlxuICAgICAgICAgICAgPC9idXR0b24+O1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBFdmVudENlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGxldCBzcGxpdFBvaW50ID0gdGhpcy5wcm9wcy5jb250ZW50LmluZGV4T2YoIHRoaXMucHJvcHMuc2VwYXJhdG9yICApO1xuICAgICAgICAgICAgaWYoIHNwbGl0UG9pbnQgPT09IC0xICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIDx0ZD48c3Bhbj57IHRoaXMucHJvcHMuY29udGVudCB9PC9zcGFuPjwvdGQ+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICggPHRkPlxuICAgICAgICAgICAgICAgPHNwYW4+eyB0aGlzLnByb3BzLmNvbnRlbnQuc3Vic3RyaW5nKCAwLCBzcGxpdFBvaW50ICkgfTwvc3Bhbj48YnIgLz5cbiAgICAgICAgICAgICAgIDxzcGFuPnsgdGhpcy5wcm9wcy5jb250ZW50LnN1YnN0cmluZyggc3BsaXRQb2ludCArIDEsIHRoaXMucHJvcHMuY29udGVudC5sZW5ndGggKSB9PC9zcGFuPlxuICAgICAgICAgICAgPC90ZD4gKTtcblxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBFdmVudEJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVOYW1lID0gdGhpcy5oYW5kbGVOYW1lLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaGFuZGxlTmFtZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHtzaG93RGV0YWlsczogIXRoaXMuc3RhdGUuc2hvd0RldGFpbHN9ICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbiggdGhpcy5wcm9wcy5ldmVudCApO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBjc3NDbGFzc05hbWUgPSAnYXgtZXZlbnQtcGF0dGVybi0nICsgdGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICcgYXgtZXZlbnQtaW50ZXJhY3Rpb24tJyArIHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLnNlbGVjdGVkID8gJyBheC1ldmVudC1zZWxlY3RlZCcgOiAnJyApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICggdGhpcy5wcm9wcy5ldmVudC5wcm9ibGVtcy5sZW5ndGggPyAnIGF4LWV2ZW50LWhhcy1wcm9ibGVtcycgOiAnJyApO1xuICAgICAgICAgICAgY29uc3QgZXZlbnRTdW1tYXJ5Um93ID0gKFxuICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXN1bW1hcnlcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJufT48UGF0dGVybnNIdG1sSWNvbiBuYW1lPXt0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm59Lz5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCI+e3RoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmXG4gICAgICAgICAgICAgICAgICAgICAgIDxTaG93RGV0YWlsc0J1dHRvbiBzaG93RGV0YWlscz17dGhpcy5zdGF0ZS5zaG93RGV0YWlsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTmFtZUNoYW5nZWQ9e3RoaXMuaGFuZGxlTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDxFdmVudENlbGwgY29udGVudD17dGhpcy5wcm9wcy5ldmVudC5uYW1lfSBzZXBhcmF0b3I9XCIuXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxFdmVudENlbGwgY29udGVudD17dGhpcy5wcm9wcy5ldmVudC5zb3VyY2V9IHNlcGFyYXRvcj1cIiNcIiAvPlxuICAgICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50LnRhcmdldH0gc2VwYXJhdG9yPVwiI1wiIC8+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlIHRleHQtcmlnaHRcIj57dGhpcy5wcm9wcy5ldmVudC5jeWNsZUlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPjxzcGFuPnt0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS5sb3dlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRldGFpbHNSb3coIHNob3csIGZvcm1hdHRlZEV2ZW50ICkge1xuICAgICAgICAgICAgICAgaWYoICFzaG93ICkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiAoPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxwcmU+e2Zvcm1hdHRlZEV2ZW50fTwvcHJlPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy9UT0RPOiBUZXN0IGRpc3BsYXkgb2YgcHJvYmxlbXNcblxuICAgICAgICAgICAgZnVuY3Rpb24gZXZlbnRQcm9ibGVtcyggcHJvYmxlbXMgKSB7XG4gICAgICAgICAgICAgICBjb25zdCBsaXN0T2ZQcm9ibGVtcyA9IHByb2JsZW1zLm1hcCggKCBwcm9ibGVtICkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Byb2JsZW0uZGVzY3JpcHRpb259IGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXdhcm5pbmdcIj57cHJvYmxlbS5kZXNjcmlwdGlvbn08L2k+XG4gICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpc3RPZlByb2JsZW1zfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzc05hbWU9eyBjc3NDbGFzc05hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgICAgeyBldmVudFN1bW1hcnlSb3cgfVxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zLmxlbmd0aCAmJiBldmVudFByb2JsZW1zKCB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zICkgfVxuICAgICAgICAgICAgICAgeyBkZXRhaWxzUm93KCB0aGlzLnN0YXRlLnNob3dEZXRhaWxzLCB0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZEV2ZW50ICkgfVxuICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGNsYXNzIEV2ZW50TGlzdFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudHMgPSB0aGlzLnByb3BzLmV2ZW50cy5tYXAoIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8RXZlbnRCb2R5IGV2ZW50PXtldmVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtldmVudC5pbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1BhdHRlcm5zQnlOYW1lPXt2aWV3LnBhdHRlcm5zQnlOYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FdmVudEluZm89e3RoaXMucHJvcHMuc2VsZWN0aW9uRXZlbnRJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17dGhpcy5wcm9wcy5vblNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2V2ZW50LnNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXNvdXJjZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRhcmdldFwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGltZXN0YW1wXCIvPlxuICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cbiAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+Jm5ic3A7PC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5FdmVudCBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5Tb3VyY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPlRhcmdldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPkN5Y2xlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+VGltZTxpIGNsYXNzTmFtZT1cImZhIGZhLWxvbmctYXJyb3ctdXBcIi8+PC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAge2V2ZW50c31cbiAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBFdmVudERpc3BsYXlFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtzZWxlY3Rpb25FdmVudEluZm86IG51bGx9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb24gPSB0aGlzLmhhbmRsZVNlbGVjdGlvbi5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZVNlbGVjdGlvbiggc2VsZWN0ZWRFdmVudCApIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbkV2ZW50SW5mb0luZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8gJiYgdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8uaW5kZXg7XG5cbiAgICAgICAgICAgIGlmKCBzZWxlY3RlZEV2ZW50LmluZGV4ID09PSBzZWxlY3Rpb25FdmVudEluZm9JbmRleCApIHtcbiAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHsgc2VsZWN0aW9uRXZlbnRJbmZvOiBudWxsIH0gKTtcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZXZlbnRzLmZvckVhY2goICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICBldmVudC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb3BzLmV2ZW50cy5mb3JFYWNoKCAoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgICAgICAgaWYoIGV2ZW50LmluZGV4ID09PSBzZWxlY3RlZEV2ZW50LmluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSggeyBzZWxlY3Rpb25FdmVudEluZm86IGV2ZW50IH0gKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGlmKCBpblNlbGVjdGlvbiggZXZlbnQsIHNlbGVjdGVkRXZlbnQgKSApIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICAgICAgICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYoIHRoaXMucHJvcHMudmlzaWJsZUV2ZW50SW5mb3NMZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gPGRpdj48L2Rpdj47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKCA8RXZlbnRMaXN0VGFibGUgc2VsZWN0aW9uRXZlbnRJbmZvPXsgdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb249eyB0aGlzLmhhbmRsZVNlbGVjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM9e3RoaXMucHJvcHMuZXZlbnRzfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8RXZlbnREaXNwbGF5RWxlbWVudCB2aXNpYmxlRXZlbnRJbmZvc0xlbmd0aD17bW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzPXttb2RlbC52aXNpYmxlRXZlbnRJbmZvc31cbiAgICAgICAgIC8+XG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ2V2ZW50cy1kaXNwbGF5LXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBbICdheENvbnRleHQnLCAnYXhSZWFjdFJlbmRlcicsICdheEZsb3dTZXJ2aWNlJyBdLFxuICAgY3JlYXRlXG59O1xuIl19
