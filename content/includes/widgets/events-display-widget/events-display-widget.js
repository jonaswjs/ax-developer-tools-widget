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
         isOptional: true });var 


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
                  this.iconClass = '';}}_createClass(PatternsHtmlIcon, [{ key: 'render', value: 



            function render() {
               return (
                  _React['default'].createElement('i', { className: this.iconClass }));} }]);return PatternsHtmlIcon;})(_React['default'].Component);





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

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (context.features.events.stream) {
         context.eventBus.subscribe('didProduce.' + context.features.events.stream, function (event) {
            if (Array.isArray(event.data) && event.data.length) {
               event.data.forEach(addEvent);} else 

            {
               addEvent(event.data);}

            runFilters();});}



      //context.$watch( 'model.settings', runFilters, true );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

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
         // let html = $sanitize( value );
         // let wasSplit = false;
         // if( !searchRegExp ) {
         //    return wrap( split( html, false ) );
         // }
         //
         // let parts = [];
         // let match;
         // let lastIndex = 0;
         // let limit = 1;
         // while( limit-- && ( match = searchRegExp.exec( html ) ) !== null ) {
         //    if( match.index > lastIndex ) {
         //       parts.push( split( html.substring( lastIndex, match.index ), false ) );
         //    }
         //    parts.push( '<b>' );
         //    parts.push( split( match[ 0 ], true ) );
         //    parts.push( '</b>' );
         //    lastIndex = searchRegExp.lastIndex;
         // }
         // searchRegExp.lastIndex = 0;
         // parts.push( split( html.substring( lastIndex, html.length ) ) );
         // return wrap( parts.join( '' ) );
         //
         // function wrap( whole ) {
         //    return '<span>' + whole + '</span>';
         // }
         //
         // function split( part, isBold ) {
         //    if( !splitCharacter || wasSplit ) {
         //       return part;
         //    }
         //
         //    let splitPoint = part.indexOf( splitCharacter );
         //    if( splitPoint === -1 ) {
         //       return part;
         //    }
         //
         //    wasSplit = true;
         //    return part.substring( 0, splitPoint ) +
         //       ( isBold ? '</b>' : '' ) + '</span><br /><span>' + ( isBold ? '<b>' : '' ) +
         //       part.substring( splitPoint + 1, part.length );
         // }
      }

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
         EventBody = (function (_React$Component3) {_inherits(EventBody, _React$Component3);
            function EventBody(props) {_classCallCheck(this, EventBody);
               _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { 
                  showDetails: false };

               this.handleName = this.handleName.bind(this);
               this.handleClick = this.handleClick.bind(this);}


























































































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventBody, [{ key: 'handleName', value: function handleName() {this.setState({ showDetails: !this.state.showDetails });} }, { key: 'handleClick', value: function handleClick(e) {this.props.onSelection(this.props.event);} //////////////////////////////////////////////////////////////////////////////////////////////////
            }, { key: 'render', value: function render() {var cssClassName = 'ax-event-pattern-' + this.props.event.pattern + ' ax-event-interaction-' + this.props.event.interaction + (this.props.selected ? ' ax-event-selected' : '') + (this.props.event.problems.length ? ' ax-event-has-problems' : '');var eventSummaryRow = _React['default'].createElement('tr', { className: 'ax-event-summary' }, _React['default'].createElement('td', { className: 'ax-col-pattern-icon', title: this.props.event.pattern }, _React['default'].createElement(PatternsHtmlIcon, { name: this.props.event.pattern })), _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction), _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, this.props.event.interaction == 'publish' && _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), _React['default'].createElement('td', null, this.props.event.htmlName), _React['default'].createElement('td', null, this.props.event.htmlSource), _React['default'].createElement('td', null, this.props.event.htmlTarget), _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId), _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.event.formattedTime.upper), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.event.formattedTime.lower))); ///////////////////////////////////////////////////////////////////////////////////////////////
                  function detailsRow(show, formattedEvent) {if (!show) {return _React['default'].createElement('tr', null);}return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('pre', null, formattedEvent)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                  //TODO: Test display of problems
                  function eventProblems(problems) {var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }, problem.description));});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, this.props.event.problems.length && eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component4) {_inherits(EventListTable, _React$Component4);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}














































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventListTable, [{ key: 'render', value: function render() {var _this = this;var events = this.props.events.map(function (event, key) {return _React['default'].createElement(EventBody, { event: event, key: key, viewPatternsByName: view.patternsByName, selectionEventInfo: _this.props.selectionEventInfo, onSelection: _this.props.onSelection, selected: event.selected });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var EventDisplayElement = (function (_React$Component5) {_inherits(EventDisplayElement, _React$Component5);
            function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);
               _get(Object.getPrototypeOf(EventDisplayElement.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { selectionEventInfo: null };
               this.handleSelection = this.handleSelection.bind(this);}








































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventDisplayElement, [{ key: 'handleSelection', value: function handleSelection(selectedEvent) {var _this2 = this; // TODO select related events
                  // select: function( eventInfo ) {
                  //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
                  //    runFilters();
                  // },
                  this.props.events.forEach(function (event) {if (event.index !== selectedEvent.index) {event.selected = false;return;}var selectionEventInfoIndex = _this2.state.selectionEventInfo && _this2.state.selectionEventInfo.index;if (event.index === selectionEventInfoIndex) {_this2.setState({ selectionEventInfo: null });event.selected = false;} else {_this2.setState({ selectionEventInfo: event });event.selected = true;}});} }, { key: 'render', value: function render() {if (this.props.visibleEventInfosLength === 0) {return _React['default'].createElement('div', null);}return _React['default'].createElement(EventListTable, { selectionEventInfo: this.state.selectionEventInfo, onSelection: this.handleSelection, events: this.props.events });} }]);return EventDisplayElement;})(_React['default'].Component);reactRender(_React['default'].createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length, events: model.visibleEventInfos }));}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7QUFFYixVQUFJLGFBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7Ozs7QUFJNUQsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLDZCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsMkJBQTJCLENBQUUsUUFBUSxFQUFFO0FBQy9FLHdCQUFlLEVBQUUsVUFBVTtBQUMzQixtQkFBVSxFQUFFLElBQUksRUFDbEIsQ0FBRSxDQUFDOzs7QUFFRSxzQkFBZ0IsMkNBQWhCLGdCQUFnQjs7QUFFUixrQkFGUixnQkFBZ0IsQ0FFTixLQUFLLEVBQUcsdUJBRmxCLGdCQUFnQjtBQUdoQix1Q0FIQSxnQkFBZ0IsNkNBR1QsS0FBSyxFQUFHO0FBQ2YsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixvQkFBUSxLQUFLLENBQUMsSUFBSTtBQUNmLG9CQUFLLFdBQVc7QUFDYixzQkFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFDakMsd0JBQU07QUFDVCxvQkFBSyxZQUFZO0FBQ2Qsc0JBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFDeEMsd0JBQU07QUFDVCxvQkFBSyxXQUFXO0FBQ2Isc0JBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7QUFDckMsd0JBQU07QUFDVCxvQkFBSyxTQUFTO0FBQ1gsc0JBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ2hDLHdCQUFNO0FBQ1Qsb0JBQUssT0FBTztBQUNULHNCQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztBQUM5Qix3QkFBTTtBQUNULG9CQUFLLE1BQU07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QUFlLEFBQUUsRUFDcEMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDLEdBQ3hDLENBQ1IsQ0FDSixZQTNDRSxtQkFBbUIsSUFBUyxrQkFBTSxTQUFTLEVBZ0RqRCxXQUFXLENBQ1IsZ0NBQUMsbUJBQW1CLElBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQUFBQyxFQUN4RCxNQUFNLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixBQUFDLEdBQ25ELENBQ0osQ0FBQyxDQUNKOzs7OztBQUlELGFBQU87QUFDSix1QkFBYyxFQUFFLE1BQU0sRUFDeEIsQ0FBQyxDQUNKOzs7O0FBRWM7QUFDWixVQUFJLEVBQUUsdUJBQXVCO0FBQzdCLGdCQUFVLEVBQUUsQ0FBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBRTtBQUM3RCxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vbGF4YXJqcy5vcmcvbGljZW5zZVxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXhQYXR0ZXJucyBmcm9tICdsYXhhci1wYXR0ZXJucyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgdHJhY2tlciBmcm9tICcuL3RyYWNrZXInO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZSggY29udGV4dCwgcmVhY3RSZW5kZXIsIGZsb3dTZXJ2aWNlICkge1xuICAgJ3VzZSBzdHJpY3QnO1xuXG4gICBsZXQgc2V0dGluZ0dyb3VwcyA9IFsncGF0dGVybnMnLCAnaW50ZXJhY3Rpb25zJywgJ3NvdXJjZXMnXTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY29udGV4dC5yZXNvdXJjZXMgPSB7fTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogcnVuRmlsdGVycyxcbiAgICAgIGlzT3B0aW9uYWw6IHRydWVcbiAgIH0gKTtcblxuICAgY2xhc3MgUGF0dGVybnNIdG1sSWNvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgICAgICBzd2l0Y2goIHByb3BzLm5hbWUgKSB7XG4gICAgICAgICAgICBjYXNlICdsaWZlY3ljbGUnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtcmVjeWNsZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25hdmlnYXRpb24nOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtbG9jYXRpb24tYXJyb3cnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZXNvdXJjZXMnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZmlsZS10ZXh0LW8nO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhY3Rpb25zJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJvY2tldCc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZsYWdzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZsYWcnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpMThuJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWdsb2JlJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmlzaWJpbGl0eSc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1leWUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnJztcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17dGhpcy5pY29uQ2xhc3N9Lz5cbiAgICAgICAgICk7XG5cbiAgICAgIH1cbiAgIH1cblxuICAgbGV0IG1vZGVsID0ge1xuICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsaWZlY3ljbGUnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtcmVjeWNsZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnZW5kTGlmZWN5Y2xlJywgJ2JlZ2luTGlmZWN5Y2xlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICduYXZpZ2F0aW9uJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWxvY2F0aW9uLWFycm93XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICduYXZpZ2F0ZSdcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncmVzb3VyY2VzJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWZpbGUtdGV4dC1vXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICdyZXBsYWNlJywgJ3VwZGF0ZScsICd2YWxpZGF0ZScsICdzYXZlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdhY3Rpb25zJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLXJvY2tldFwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAndGFrZUFjdGlvbidcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZmxhZ3MnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZmxhZ1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlRmxhZydcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaTE4bicsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1nbG9iZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlTG9jYWxlJ1xuICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd2aXNpYmlsaXR5JywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlQXJlYVZpc2liaWxpdHknLCAnY2hhbmdlV2lkZ2V0VmlzaWJpbGl0eSdcbiAgICAgICAgIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7bmFtZTogJ290aGVyJywgaHRtbEljb246ICcmbmJzcDsnLCBldmVudFR5cGVzOiBbXX1cbiAgICAgIF0sXG4gICAgICBpbmRleDogMCxcbiAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgIH0sXG4gICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfTtcblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBjb21tYW5kcyA9IHtcbiAgICAgIHNldEFsbDogZnVuY3Rpb24oIHRvVmFsdWUgKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5JbmZvLm5hbWVdID0gdHJ1ZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVQYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5dID0gZmFsc2U7XG4gICAgICAgICB9ICk7XG4gICAgICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnNvdXJjZXNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBjbGVhckZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgbW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm4gPSAnJztcbiAgICAgICAgIG1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCA9IG51bGw7XG4gICAgICAgICBjb250ZXh0LmNvbW1hbmRzLnNldEFsbCggdHJ1ZSApO1xuICAgICAgfSxcbiAgICAgIC8vIHNlbGVjdDogZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgIC8vICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IGV2ZW50SW5mby5zZWxlY3RlZCA/IG51bGwgOiBldmVudEluZm87XG4gICAgICAvLyAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAvLyB9LFxuICAgICAgZGlzY2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ldmVudEluZm9zID0gW107XG4gICAgICAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICB9LFxuICAgICAgcnVuRmlsdGVyczogcnVuRmlsdGVyc1xuICAgfTtcblxuICAgY29tbWFuZHMuc2V0RGVmYXVsdHMoKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgaWYoIGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSApIHtcbiAgICAgIGNvbnRleHQuZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUHJvZHVjZS4nICsgY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggZXZlbnQuZGF0YSApICYmIGV2ZW50LmRhdGEubGVuZ3RoICkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS5mb3JFYWNoKCBhZGRFdmVudCApO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRFdmVudCggZXZlbnQuZGF0YSApO1xuICAgICAgICAgfVxuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvL2NvbnRleHQuJHdhdGNoKCAnbW9kZWwuc2V0dGluZ3MnLCBydW5GaWx0ZXJzLCB0cnVlICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGFkZEV2ZW50KCBldmVudEluZm8gKSB7XG5cbiAgICAgIGxldCBjb21wbGV0ZUV2ZW50SW5mbyA9IHtcbiAgICAgICAgIGluZGV4OiArK21vZGVsLmluZGV4LFxuICAgICAgICAgaW50ZXJhY3Rpb246IGV2ZW50SW5mby5hY3Rpb24sXG4gICAgICAgICBjeWNsZUlkOiBldmVudEluZm8uY3ljbGVJZCA+IC0xID8gZXZlbnRJbmZvLmN5Y2xlSWQgOiAnLScsXG4gICAgICAgICBldmVudE9iamVjdDogZXZlbnRJbmZvLmV2ZW50T2JqZWN0IHx8IHt9LFxuICAgICAgICAgZm9ybWF0dGVkRXZlbnQ6IEpTT04uc3RyaW5naWZ5KCBldmVudEluZm8uZXZlbnRPYmplY3QsIG51bGwsIDMgKSxcbiAgICAgICAgIGZvcm1hdHRlZFRpbWU6IHtcbiAgICAgICAgICAgIHVwcGVyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnSEg6bW0nICksXG4gICAgICAgICAgICBsb3dlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ3NzLlNTUycgKVxuICAgICAgICAgfSxcbiAgICAgICAgIG5hbWU6IGV2ZW50SW5mby5ldmVudCB8fCAnPycsXG4gICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuKCAoZXZlbnRJbmZvLmV2ZW50IHx8ICc/JykudG9Mb3dlckNhc2UoKSApLFxuICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlLFxuICAgICAgICAgc291cmNlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkucmVwbGFjZSggL153aWRnZXRcXC4vLCAnJyApLFxuICAgICAgICAgdGFyZ2V0OiAoIGV2ZW50SW5mby50YXJnZXQgfHwgJz8nICkucmVwbGFjZSggL14tJC8sICcnICksXG4gICAgICAgICB0aW1lOiBldmVudEluZm8udGltZSxcbiAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZVR5cGU6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5pbmRleE9mKCAnd2lkZ2V0LicgKSA9PT0gMCA/ICd3aWRnZXRzJyA6ICdydW50aW1lJyxcbiAgICAgICAgIHByb2JsZW1zOiB0cmFja2VyLnRyYWNrKCBldmVudEluZm8gKVxuICAgICAgfTtcblxuICAgICAgbW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggPiBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgbGV0IHJlbW92ZWRJbmZvID0gbW9kZWwuZXZlbnRJbmZvcy5wb3AoKTtcbiAgICAgICAgIGlmKCByZW1vdmVkSW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGF0dGVybiggZXZlbnROYW1lICkge1xuICAgICAgICAgbGV0IG1hdGNoaW5nUGF0dGhlcm4gPSBtb2RlbC5wYXR0ZXJucy5maWx0ZXIoIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4uZXZlbnRUeXBlcy5zb21lKCBmdW5jdGlvbiggZXZlbnRUeXBlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5pbmRleE9mKCBldmVudFR5cGUudG9Mb3dlckNhc2UoKSApICE9PSAtMTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJldHVybiBtYXRjaGluZ1BhdHRoZXJuLmxlbmd0aCA/IG1hdGNoaW5nUGF0dGhlcm5bMF0ubmFtZSA6ICdvdGhlcic7XG4gICAgICB9XG5cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCkge1xuICAgICAgbGV0IGV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGluZm8gKSB7XG4gICAgICAgICByZXR1cm4gaW5mby5wcm9ibGVtcy5sZW5ndGggPiAwO1xuICAgICAgfSApO1xuXG4gICAgICBtb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBydW5GaWx0ZXJzKCkge1xuICAgICAgbGV0IHNldHRpbmdzID0gbW9kZWwuc2V0dGluZ3M7XG4gICAgICBsZXQgbnVtVmlzaWJsZSA9IDA7XG5cbiAgICAgIGxldCBzZWFyY2hSZWdFeHAgPSBudWxsO1xuICAgICAgaWYoIHNldHRpbmdzLm5hbWVQYXR0ZXJuICkge1xuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoIHNldHRpbmdzLm5hbWVQYXR0ZXJuLCAnZ2knICk7XG4gICAgICAgICB9XG4gICAgICAgICBjYXRjaCggZSApIHsgLyogaWdub3JlIGludmFsaWQgc2VhcmNoIHBhdHRlcm4gKi8gfVxuICAgICAgfVxuICAgICAgbGV0IHNlbGVjdGlvbkV2ZW50SW5mbyA9IG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbztcblxuICAgICAgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgICAgIGlmKCBzZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgIT09IG51bGwgJiYgbnVtVmlzaWJsZSA+PSBzZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIXNldHRpbmdzLmludGVyYWN0aW9uc1tldmVudEluZm8uaW50ZXJhY3Rpb25dICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5wYXR0ZXJuc1tldmVudEluZm8ucGF0dGVybl0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIXNldHRpbmdzLnNvdXJjZXNbZXZlbnRJbmZvLnNvdXJjZVR5cGVdICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFtYXRjaGVzRmlsdGVyUmVzb3VyY2UoIGV2ZW50SW5mbyApICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgICsrbnVtVmlzaWJsZTtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSApO1xuXG4gICAgICAvLyBtb2RpZnkgbWF0Y2hlcyBpbiBwbGFjZVxuICAgICAgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MuZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgICAgIGV2ZW50SW5mby5odG1sTmFtZSA9IGh0bWxWYWx1ZSggZXZlbnRJbmZvLm5hbWUsIHNlYXJjaFJlZ0V4cCwgJy4nICk7XG4gICAgICAgICBldmVudEluZm8uaHRtbFNvdXJjZSA9IGh0bWxWYWx1ZSggZXZlbnRJbmZvLnNvdXJjZSwgc2VhcmNoUmVnRXhwLCAnIycgKTtcbiAgICAgICAgIGV2ZW50SW5mby5odG1sVGFyZ2V0ID0gaHRtbFZhbHVlKCBldmVudEluZm8udGFyZ2V0LCBzZWFyY2hSZWdFeHAsICcjJyApO1xuICAgICAgICAgZXZlbnRJbmZvLnNlbGVjdGVkID0gISFzZWxlY3Rpb25FdmVudEluZm8gJiYgaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICk7XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG1hdGNoZXNTZWFyY2hFeHByZXNzaW9uKCBldmVudEluZm8sIHNlYXJjaFJlZ0V4cCApIHtcbiAgICAgIHJldHVybiAhc2VhcmNoUmVnRXhwIHx8IFtldmVudEluZm8ubmFtZSwgZXZlbnRJbmZvLnNvdXJjZSwgZXZlbnRJbmZvLnRhcmdldF1cbiAgICAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICAgICAgICBsZXQgbWF0Y2hlcyA9IHNlYXJjaFJlZ0V4cC50ZXN0KCBmaWVsZCApO1xuICAgICAgICAgICAgICAgc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICByZXR1cm4gISFtYXRjaGVzO1xuICAgICAgICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVyblRvcGljcyA9IHtcbiAgICAgIFJFU09VUkNFOiBbJ2RpZFJlcGxhY2UnLCAnZGlkVXBkYXRlJ10sXG4gICAgICBBQ1RJT046IFsndGFrZUFjdGlvblJlcXVlc3QnLCAnd2lsbFRha2VBY3Rpb24nLCAnZGlkVGFrZUFjdGlvbiddLFxuICAgICAgRkxBRzogWydkaWRDaGFuZ2VGbGFnJ10sXG4gICAgICBDT05UQUlORVI6IFsnY2hhbmdlQXJlYVZpc2liaWxpdHlSZXF1ZXN0JywgJ3dpbGxDaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eSddXG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzRmlsdGVyUmVzb3VyY2UoIGV2ZW50SW5mbyApIHtcbiAgICAgIGlmKCAhY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyICkge1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBmaWx0ZXJUb3BpY3MgPSBjb250ZXh0LnJlc291cmNlcy5maWx0ZXIudG9waWNzIHx8IFtdO1xuICAgICAgbGV0IGZpbHRlclBhcnRpY2lwYW50cyA9IGNvbnRleHQucmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMgfHwgW107XG4gICAgICBpZiggIWZpbHRlclRvcGljcy5sZW5ndGggJiYgIWZpbHRlclBhcnRpY2lwYW50cy5sZW5ndGggKSB7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IG1hdGNoZXNUb3BpY0ZpbHRlciA9IGZpbHRlclRvcGljc1xuICAgICAgICAgLnNvbWUoIGZ1bmN0aW9uKCBpdGVtICkge1xuICAgICAgICAgICAgbGV0IHByZWZpeGVzID0gcGF0dGVyblRvcGljc1tpdGVtLnBhdHRlcm5dO1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeGVzLnNvbWUoIGZ1bmN0aW9uKCBwcmVmaXggKSB7XG4gICAgICAgICAgICAgICBsZXQgdG9waWMgPSBwcmVmaXggKyAnLicgKyBpdGVtLnRvcGljO1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50SW5mby5uYW1lID09PSB0b3BpYyB8fCBldmVudEluZm8ubmFtZS5pbmRleE9mKCB0b3BpYyArICcuJyApID09PSAwO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuXG4gICAgICBsZXQgbWF0Y2hlc1BhcnRpY2lwYW50c0ZpbHRlciA9IFsndGFyZ2V0JywgJ3NvdXJjZSddLnNvbWUoIGZ1bmN0aW9uKCBmaWVsZCApIHtcbiAgICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50SW5mb1tmaWVsZF07XG4gICAgICAgICByZXR1cm4gZmlsdGVyUGFydGljaXBhbnRzXG4gICAgICAgICAgICAubWFwKCBmdW5jdGlvbiggXyApIHsgcmV0dXJuIF8ucGFydGljaXBhbnQ7IH0gKVxuICAgICAgICAgICAgLnNvbWUoIGlzU3VmZml4T2YoIHZhbHVlICkgKTtcbiAgICAgIH0gKTtcblxuICAgICAgcmV0dXJuIG1hdGNoZXNUb3BpY0ZpbHRlciB8fCBtYXRjaGVzUGFydGljaXBhbnRzRmlsdGVyO1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBpc1N1ZmZpeE9mKCB2YWx1ZSApIHtcbiAgICAgICAgIHJldHVybiBmdW5jdGlvbiggXyApIHtcbiAgICAgICAgICAgIGxldCB0YWlsID0gJyMnICsgXztcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gdGFpbC5sZW5ndGggJiYgdmFsdWUuaW5kZXhPZiggdGFpbCApID09PSB2YWx1ZS5sZW5ndGggLSB0YWlsLmxlbmd0aDtcbiAgICAgICAgIH07XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGh0bWxWYWx1ZSggdmFsdWUsIHNlYXJjaFJlZ0V4cCwgc3BsaXRDaGFyYWN0ZXIgKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAvLyBsZXQgaHRtbCA9ICRzYW5pdGl6ZSggdmFsdWUgKTtcbiAgICAgIC8vIGxldCB3YXNTcGxpdCA9IGZhbHNlO1xuICAgICAgLy8gaWYoICFzZWFyY2hSZWdFeHAgKSB7XG4gICAgICAvLyAgICByZXR1cm4gd3JhcCggc3BsaXQoIGh0bWwsIGZhbHNlICkgKTtcbiAgICAgIC8vIH1cbiAgICAgIC8vXG4gICAgICAvLyBsZXQgcGFydHMgPSBbXTtcbiAgICAgIC8vIGxldCBtYXRjaDtcbiAgICAgIC8vIGxldCBsYXN0SW5kZXggPSAwO1xuICAgICAgLy8gbGV0IGxpbWl0ID0gMTtcbiAgICAgIC8vIHdoaWxlKCBsaW1pdC0tICYmICggbWF0Y2ggPSBzZWFyY2hSZWdFeHAuZXhlYyggaHRtbCApICkgIT09IG51bGwgKSB7XG4gICAgICAvLyAgICBpZiggbWF0Y2guaW5kZXggPiBsYXN0SW5kZXggKSB7XG4gICAgICAvLyAgICAgICBwYXJ0cy5wdXNoKCBzcGxpdCggaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCwgbWF0Y2guaW5kZXggKSwgZmFsc2UgKSApO1xuICAgICAgLy8gICAgfVxuICAgICAgLy8gICAgcGFydHMucHVzaCggJzxiPicgKTtcbiAgICAgIC8vICAgIHBhcnRzLnB1c2goIHNwbGl0KCBtYXRjaFsgMCBdLCB0cnVlICkgKTtcbiAgICAgIC8vICAgIHBhcnRzLnB1c2goICc8L2I+JyApO1xuICAgICAgLy8gICAgbGFzdEluZGV4ID0gc2VhcmNoUmVnRXhwLmxhc3RJbmRleDtcbiAgICAgIC8vIH1cbiAgICAgIC8vIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgLy8gcGFydHMucHVzaCggc3BsaXQoIGh0bWwuc3Vic3RyaW5nKCBsYXN0SW5kZXgsIGh0bWwubGVuZ3RoICkgKSApO1xuICAgICAgLy8gcmV0dXJuIHdyYXAoIHBhcnRzLmpvaW4oICcnICkgKTtcbiAgICAgIC8vXG4gICAgICAvLyBmdW5jdGlvbiB3cmFwKCB3aG9sZSApIHtcbiAgICAgIC8vICAgIHJldHVybiAnPHNwYW4+JyArIHdob2xlICsgJzwvc3Bhbj4nO1xuICAgICAgLy8gfVxuICAgICAgLy9cbiAgICAgIC8vIGZ1bmN0aW9uIHNwbGl0KCBwYXJ0LCBpc0JvbGQgKSB7XG4gICAgICAvLyAgICBpZiggIXNwbGl0Q2hhcmFjdGVyIHx8IHdhc1NwbGl0ICkge1xuICAgICAgLy8gICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgICAvLyAgICB9XG4gICAgICAvL1xuICAgICAgLy8gICAgbGV0IHNwbGl0UG9pbnQgPSBwYXJ0LmluZGV4T2YoIHNwbGl0Q2hhcmFjdGVyICk7XG4gICAgICAvLyAgICBpZiggc3BsaXRQb2ludCA9PT0gLTEgKSB7XG4gICAgICAvLyAgICAgICByZXR1cm4gcGFydDtcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vXG4gICAgICAvLyAgICB3YXNTcGxpdCA9IHRydWU7XG4gICAgICAvLyAgICByZXR1cm4gcGFydC5zdWJzdHJpbmcoIDAsIHNwbGl0UG9pbnQgKSArXG4gICAgICAvLyAgICAgICAoIGlzQm9sZCA/ICc8L2I+JyA6ICcnICkgKyAnPC9zcGFuPjxiciAvPjxzcGFuPicgKyAoIGlzQm9sZCA/ICc8Yj4nIDogJycgKSArXG4gICAgICAvLyAgICAgICBwYXJ0LnN1YnN0cmluZyggc3BsaXRQb2ludCArIDEsIHBhcnQubGVuZ3RoICk7XG4gICAgICAvLyB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGluU2VsZWN0aW9uKCBldmVudEluZm8sIHNlbGVjdGlvbkV2ZW50SW5mbyApIHtcbiAgICAgIGlmKCAhc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXZlbnRJbmZvID09PSBzZWxlY3Rpb25FdmVudEluZm8gfHwgKFxuICAgICAgICAgICAgZXZlbnRJbmZvLmN5Y2xlSWQgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5jeWNsZUlkICYmXG4gICAgICAgICAgICBldmVudEluZm8uc291cmNlID09PSBzZWxlY3Rpb25FdmVudEluZm8uc291cmNlICYmXG4gICAgICAgICAgICBldmVudEluZm8ubmFtZSA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLm5hbWVcbiAgICAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHNlcGFyYXRlKCBsYWJlbCwgc2VwYXJhdG9yLCBkZWZhdWx0VGV4dCApIHtcbiAgICAgIGxldCBuYW1lID0gbGFiZWwgfHwgZGVmYXVsdFRleHQ7XG4gICAgICBsZXQgc3BsaXRQb2ludCA9IG5hbWUuaW5kZXhPZiggc2VwYXJhdG9yICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgdXBwZXI6IHNwbGl0UG9pbnQgPT09IC0xID8gbmFtZSA6IG5hbWUuc3Vic3RyKCAwLCBzcGxpdFBvaW50ICksXG4gICAgICAgICBsb3dlcjogc3BsaXRQb2ludCA9PT0gLTEgPyBkZWZhdWx0VGV4dCA6IG5hbWUuc3Vic3RyKCBzcGxpdFBvaW50LCBuYW1lLmxlbmd0aCApXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFmZml4KCkge1xuICAgICAgICAgcmV0dXJuICggPGRpdj48cD5hZmZpeCBjYWxsaW5nPC9wPjwvZGl2PiApO1xuICAgICAgICAgLypcbiAgICAgICAgICBjb25zdCBldmVudEluZm9MaXN0ID0gbW9kZWwucHJvYmxlbVN1bW1hcnkuZXZlbnRJbmZvcy5tYXAoICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkga2V5PXtldmVudC5uYW1lfT5cbiAgICAgICAgICA8aDU+PHN0cm9uZz57IGV2ZW50Lm5hbWUgfTwvc3Ryb25nPiA8ZW0+KHNvdXJjZTogeyBldmVudC5zb3VyY2UgfSk8L2VtPjwvaDU+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtcbiAgICAgICAgICBldmVudC5wcm9ibGVtcy5tYXAoICggcHJvYmxlbXMgKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkga2V5PXtwcm9ibGVtLmRlc2NyaXB0aW9ufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS13YXJuaW5nIGF4LWVycm9yXCIvPiB7IHByb2JsZW0uZGVzY3JpcHRpb24gfVxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKTtcbiAgICAgICAgICB9IClcbiAgICAgICAgICB9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIClcbiAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICBjbGFzcyBGaWx0ZXJzRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMucHJvcHMubmFtZX07XG5cbiAgICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoYW5kbGVDaGFuZ2UoIGV2ZW50ICkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxsYWJlbCBheC1mb3I9XCInc2VhcmNoJ1wiPlxuICAgICAgICAgIDxzbWFsbD5GaWx0ZXJzOjwvc21hbGw+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCAoUmVnRXhwKVwiXG4gICAgICAgICAgYXgtaWQ9XCInc2VhcmNoJ1wiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJzID0gPEZpbHRlcnNGb3JtIG5hbWU9XCJtb2RlbC5zZXR0aW5ncy5uYW1lUGF0dGVyblwiLz47XG5cbiAgICAgICAgICBjb25zdCBsaW1pdCA9IChcbiAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ2xpbWl0J1wiPlxuICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgYXgtaWQ9XCInbGltaXQnXCJcbiAgICAgICAgICBuZy1tb2RlbD1cIm1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdFwiXG4gICAgICAgICAgbmctbW9kZWwtb3B0aW9ucz1cInsgdXBkYXRlT246ICdkZWZhdWx0JyB9XCJcbiAgICAgICAgICBheC1pbnB1dD1cImludGVnZXJcIlxuICAgICAgICAgIGF4LWlucHV0LW1pbmltdW0tdmFsdWU9XCIwXCJcbiAgICAgICAgICBheC1pbnB1dC1tYXhpbXVtLXZhbHVlPVwiZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMC17eyBmZWF0dXJlcy5ldmVudHMuYnVmZmVyU2l6ZSB9fVwiXG4gICAgICAgICAgbWF4bGVuZ3RoPVwiNFwiLz5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4ge2ZpbHRlcnN9O1xuICAgICAgICAgICovXG4gICAgICAgICAvKiAgIGNvbnN0IGZpbHRlck1lbnUgPSAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdvcGVuJzogdmlldy5zaG93UGF0dGVybnMgfVwiXG4gICAgICAgICAgbmctbW91c2VlbnRlcj1cInZpZXcuc2hvd1BhdHRlcm5zID0gdHJ1ZVwiXG4gICAgICAgICAgbmctbW91c2VsZWF2ZT1cInZpZXcuc2hvd1BhdHRlcm5zID0gZmFsc2VcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxuICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ7eyB2aWV3LnNob3dQYXR0ZXJucyB9fVwiPlxuICAgICAgICAgIE1vcmUgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51IGNvbnRhaW5lciBjb2wtbGctNlwiIHJvbGU9XCJtZW51XCI+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGZpcnN0XCI+XG4gICAgICAgICAgPGg0PlBhdHRlcm5zPC9oND5cbiAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cInBhdHRlcm4gaW4gbW9kZWwucGF0dGVybnMgdHJhY2sgYnkgcGF0dGVybi5uYW1lXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgbmctY2xpY2s9XCJtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gPSAhbW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4ubmFtZSBdXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF0dGVyblwiIG5nLWJpbmQtaHRtbD1cInBhdHRlcm4uaHRtbEljb25cIj48L3NwYW4+XG4gICAgICAgICAge3sgcGF0dGVybi5uYW1lIH19XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgbmctY2xhc3M9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIW1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSwgJ2ZhLXRvZ2dsZS1vbic6IG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSB9XCI+PC9pPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgIDxoND5JbnRlcmFjdGlvbnM8L2g0PlxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKGludGVyYWN0aW9uLCBlbmFibGVkKSBpbiBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnMgdHJhY2sgYnkgaW50ZXJhY3Rpb25cIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLmludGVyYWN0aW9uc1sgaW50ZXJhY3Rpb24gXSA9ICFlbmFibGVkXCJcbiAgICAgICAgICA+e3sgaW50ZXJhY3Rpb24gfX08aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIWVuYWJsZWQsICdmYS10b2dnbGUtb24nOiBlbmFibGVkIH1cIj48L2k+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPGg0PlNvdXJjZXM8L2g0PlxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKHNvdXJjZSwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3Muc291cmNlcyB0cmFjayBieSBzb3VyY2VcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLnNvdXJjZXNbIHNvdXJjZSBdID0gIWVuYWJsZWRcIlxuICAgICAgICAgID57eyBzb3VyY2UgfX08aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICBuZy1jbGFzcz1cInsgJ2ZhLXRvZ2dsZS1vZmYnOiAhZW5hYmxlZCwgJ2ZhLXRvZ2dsZS1vbic6IGVuYWJsZWQgfVwiPjwvaT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBmaXJzdFwiPiZuYnNwOzwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGxhc3RcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1wcmltYXJ5XCIgbmctY2xpY2s9XCJjb21tYW5kcy5zZXRBbGwoIHRydWUgKVwiPkFsbCBPbjwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldEFsbCggZmFsc2UgKVwiPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXhzXCIgbmctY2xpY2s9XCJjb21tYW5kcy5zZXREZWZhdWx0cygpXCI+RGVmYXVsdHM8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICk7Ki9cblxuICAgICAgICAgLyogIHJldHVyblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYWZmaXgtYXJlYVwiXG4gICAgICAgICAgYXgtYWZmaXhcbiAgICAgICAgICBheC1hZmZpeC1vZmZzZXQtdG9wPVwiMTAwXCI+XG4gICAgICAgICAgeyAhbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+RW1wdHkgRXZlbnRzIExpc3Q8L2g0PlxuICAgICAgICAgIDxwPjxpIGNsYXNzTmFtZT1cImZhIGZhLWNsb2NrLW9cIj48L2k+IFdhaXRpbmcgZm9yIGV2ZW50cyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgfVxuICAgICAgICAgIHsgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiYgIW1vZGVsLnZpc2libGVFdmVudEluZm9zLmxlbmd0aCAmJlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj4wL3sgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfSBFdmVudCBJdGVtczwvaDQ+XG4gICAgICAgICAgPHA+Tm8gZXZlbnRzIG1hdGNoaW5nIGN1cnJlbnQgZmlsdGVycy48L3A+XG4gICAgICAgICAgPHA+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICBvbkNsaWNrPVwiY29tbWFuZHMuY2xlYXJGaWx0ZXJzXCI+U2hvdyBBbGw8L2J1dHRvbj48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtcyAmJlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnkgYXgtZXJyb3JcIj57IG1vZGVsLnByb2JsZW1TdW1tYXJ5LmV2ZW50SW5mb3MubGVuZ3RoIH0veyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9IEV2ZW50cyB3aXRoIFByb2JsZW1zPC9oND5cbiAgICAgICAgICA8dWw+e2V2ZW50SW5mb0xpc3R9PC91bD5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJheC1ldmVudC1wcm9ibGVtcy1leHBsYW5hdGlvblwiPlxuICAgICAgICAgIEV2ZW50cyB3aXRoIHByb2JsZW1zIGFyZSBtYXJrZWQgPHN0cm9uZyBjbGFzc05hbWU9XCJheC1lcnJvclwiPnJlZDwvc3Ryb25nPiBpbiB0aGUgZXZlbnRzIHRhYmxlLlxuICAgICAgICAgIEZpbHRlciBieSBldmVudC9zb3VyY2UgYXMgbmVlZGVkLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgeyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+eyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggfS97IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH0gRXZlbnRzPC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1idXR0b24td3JhcHBlciBmb3JtLWlubGluZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtXCI+XG4gICAgICAgICAge2ZpbHRlcnN9XG4gICAgICAgICAge2xpbWl0fVxuICAgICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgICB7ZmlsdGVyTWVudX1cblxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgbmctY2xhc3M9XCJ7ICdheC1kaXNhYmxlZCc6ICFtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XCJcbiAgICAgICAgICBuZy1jbGljaz1cImNvbW1hbmRzLmRpc2NhcmQoKVwiPkRpc2NhcmQgRXZlbnRzPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0taW5saW5lIGV2ZW50cy1kaXNwbGF5LWZpbHRlci1pdGVtc1wiIG5nLWlmPVwicmVzb3VyY2VzLmZpbHRlci50b3BpY3MubGVuZ3RoIHx8IHJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzLmxlbmd0aFwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLWxpbmtcIiBocmVmPVwiIy90b29scy9wYWdlXCI+UGFnZSBzZWxlY3Rpb248L2E+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgbmctcmVwZWF0PVwiaXRlbSBpbiByZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB0cmFjayBieSBpdGVtLnRvcGljXCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXktcGF0dGVybi0nICsgaXRlbS5wYXR0ZXJuXCI+XG4gICAgICAgICAge3tpdGVtLnRvcGljfX1cbiAgICAgICAgICA8L3NwYW4+PHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgbmctcmVwZWF0PVwiaXRlbSBpbiByZXNvdXJjZXMuZmlsdGVyLnBhcnRpY2lwYW50cyB0cmFjayBieSBpdGVtLnBhcnRpY2lwYW50XCJcbiAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXkta2luZC0nICsgaXRlbS5raW5kXCI+XG4gICAgICAgICAge3tpdGVtLnBhcnRpY2lwYW50fX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+Ki9cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCAhdGhpcy5wcm9wcy5zaG93RGV0YWlscyApO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IHRoaXMucHJvcHMuc2hvd0RldGFpbHMgPyBcImZhIGZhLW1pbnVzLXNxdWFyZVwiIDogXCJmYSBmYS1wbHVzLXNxdWFyZVwiIH0+Jm5ic3A7PC9pPlxuICAgICAgICAgICAgPC9idXR0b24+O1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBFdmVudEJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVOYW1lID0gdGhpcy5oYW5kbGVOYW1lLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaGFuZGxlTmFtZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHtzaG93RGV0YWlsczogIXRoaXMuc3RhdGUuc2hvd0RldGFpbHN9ICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbiggdGhpcy5wcm9wcy5ldmVudCApO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBjc3NDbGFzc05hbWUgPSAnYXgtZXZlbnQtcGF0dGVybi0nICsgdGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICcgYXgtZXZlbnQtaW50ZXJhY3Rpb24tJyArIHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLnNlbGVjdGVkID8gJyBheC1ldmVudC1zZWxlY3RlZCcgOiAnJyApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICggdGhpcy5wcm9wcy5ldmVudC5wcm9ibGVtcy5sZW5ndGggPyAnIGF4LWV2ZW50LWhhcy1wcm9ibGVtcycgOiAnJyApO1xuICAgICAgICAgICAgY29uc3QgZXZlbnRTdW1tYXJ5Um93ID0gKFxuICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXN1bW1hcnlcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJufT48UGF0dGVybnNIdG1sSWNvbiBuYW1lPXt0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm59Lz5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCI+e3RoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmXG4gICAgICAgICAgICAgICAgICAgICAgIDxTaG93RGV0YWlsc0J1dHRvbiBzaG93RGV0YWlscz17dGhpcy5zdGF0ZS5zaG93RGV0YWlsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTmFtZUNoYW5nZWQ9e3RoaXMuaGFuZGxlTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5ldmVudC5odG1sTmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPnt0aGlzLnByb3BzLmV2ZW50Lmh0bWxTb3VyY2V9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5ldmVudC5odG1sVGFyZ2V0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlIHRleHQtcmlnaHRcIj57dGhpcy5wcm9wcy5ldmVudC5jeWNsZUlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPjxzcGFuPnt0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS5sb3dlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRldGFpbHNSb3coIHNob3csIGZvcm1hdHRlZEV2ZW50ICkge1xuICAgICAgICAgICAgICAgaWYoICFzaG93ICkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiAoPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxwcmU+e2Zvcm1hdHRlZEV2ZW50fTwvcHJlPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy9UT0RPOiBUZXN0IGRpc3BsYXkgb2YgcHJvYmxlbXNcblxuICAgICAgICAgICAgZnVuY3Rpb24gZXZlbnRQcm9ibGVtcyggcHJvYmxlbXMgKSB7XG4gICAgICAgICAgICAgICBjb25zdCBsaXN0T2ZQcm9ibGVtcyA9IHByb2JsZW1zLm1hcCggKCBwcm9ibGVtICkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Byb2JsZW0uZGVzY3JpcHRpb259IGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXdhcm5pbmdcIj57cHJvYmxlbS5kZXNjcmlwdGlvbn08L2k+XG4gICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpc3RPZlByb2JsZW1zfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzc05hbWU9eyBjc3NDbGFzc05hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgICAgeyBldmVudFN1bW1hcnlSb3cgfVxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zLmxlbmd0aCAmJiBldmVudFByb2JsZW1zKCB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zICkgfVxuICAgICAgICAgICAgICAgeyBkZXRhaWxzUm93KCB0aGlzLnN0YXRlLnNob3dEZXRhaWxzLCB0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZEV2ZW50ICkgfVxuICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGNsYXNzIEV2ZW50TGlzdFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudHMgPSB0aGlzLnByb3BzLmV2ZW50cy5tYXAoICggZXZlbnQsIGtleSApID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8RXZlbnRCb2R5IGV2ZW50PXtldmVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQYXR0ZXJuc0J5TmFtZT17dmlldy5wYXR0ZXJuc0J5TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uRXZlbnRJbmZvPXt0aGlzLnByb3BzLnNlbGVjdGlvbkV2ZW50SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb249e3RoaXMucHJvcHMub25TZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtldmVudC5zZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSApO1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XG4gICAgICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1wYXR0ZXJuLWljb25cIi8+XG4gICAgICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1pbnRlcmFjdGlvblwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXBheWxvYWQtaWNvblwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLW5hbWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1zb3VyY2VcIi8+XG4gICAgICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC10YXJnZXRcIi8+XG4gICAgICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1jeWNsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRpbWVzdGFtcFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XG4gICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+Jm5ic3A7PC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPiZuYnNwOzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+RXZlbnQgTmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+U291cmNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5UYXJnZXQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5DeWNsZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlRpbWU8aSBjbGFzc05hbWU9XCJmYSBmYS1sb25nLWFycm93LXVwXCIvPjwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgIHtldmVudHN9XG4gICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgRXZlbnREaXNwbGF5RWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7c2VsZWN0aW9uRXZlbnRJbmZvOiBudWxsfTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uID0gdGhpcy5oYW5kbGVTZWxlY3Rpb24uYmluZCggdGhpcyApO1xuICAgICAgICAgfVxuXG4gICAgICAgICBoYW5kbGVTZWxlY3Rpb24oIHNlbGVjdGVkRXZlbnQgKSB7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gc2VsZWN0IHJlbGF0ZWQgZXZlbnRzXG4gICAgICAgICAgICAvLyBzZWxlY3Q6IGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICAgICAvLyAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBldmVudEluZm8uc2VsZWN0ZWQgPyBudWxsIDogZXZlbnRJbmZvO1xuICAgICAgICAgICAgLy8gICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgICAgLy8gfSxcblxuICAgICAgICAgICAgdGhpcy5wcm9wcy5ldmVudHMuZm9yRWFjaCggKCBldmVudCApID0+IHtcbiAgICAgICAgICAgICAgIGlmKCBldmVudC5pbmRleCAhPT0gc2VsZWN0ZWRFdmVudC5pbmRleCApIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25FdmVudEluZm9JbmRleD0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8gJiYgdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8uaW5kZXg7XG4gICAgICAgICAgICAgICBpZiggZXZlbnQuaW5kZXggPT09IHNlbGVjdGlvbkV2ZW50SW5mb0luZGV4ICkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSggeyBzZWxlY3Rpb25FdmVudEluZm86IG51bGwgfSApO1xuICAgICAgICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSggeyBzZWxlY3Rpb25FdmVudEluZm86IGV2ZW50IH0gKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBpZiggdGhpcy5wcm9wcy52aXNpYmxlRXZlbnRJbmZvc0xlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgIHJldHVybiA8ZGl2PjwvZGl2PjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoIDxFdmVudExpc3RUYWJsZSBzZWxlY3Rpb25FdmVudEluZm89eyB0aGlzLnN0YXRlLnNlbGVjdGlvbkV2ZW50SW5mbyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17IHRoaXMuaGFuZGxlU2VsZWN0aW9uIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxFdmVudERpc3BsYXlFbGVtZW50IHZpc2libGVFdmVudEluZm9zTGVuZ3RoPXttb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM9e21vZGVsLnZpc2libGVFdmVudEluZm9zfVxuICAgICAgICAgLz5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZXZlbnRzLWRpc3BsYXktd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheFJlYWN0UmVuZGVyJywgJ2F4Rmxvd1NlcnZpY2UnIF0sXG4gICBjcmVhdGVcbn07XG4iXX0=
