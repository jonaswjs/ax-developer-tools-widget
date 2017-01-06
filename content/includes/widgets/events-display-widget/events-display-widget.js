define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker', 'laxar'], function (exports, module, _react, _laxarPatterns, _moment, _tracker, _laxar) {/**
                                                                                                                                                                         * Copyright 2016 aixigo AG
                                                                                                                                                                         * Released under the MIT license.
                                                                                                                                                                         * http://laxarjs.org/license
                                                                                                                                                                         */'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);var _ax = _interopRequireDefault(_laxar);







   function create(context, reactRender, flowService) {
      'use strict';


      var view = { 
         showPatterns: false };


      var settingGroups = ['patterns', 'interactions', 'sources'];

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      var patternTopics = { 
         RESOURCE: ['didReplace', 'didUpdate'], 
         ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'], 
         FLAG: ['didChangeFlag'], 
         CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      context.resources = {};

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      var patterns = [
      { 
         name: 'lifecycle', 
         eventTypes: ['endLifecycle', 'beginLifecycle'] }, 

      { 
         name: 'navigation', 
         eventTypes: ['navigate'] }, 

      { 
         name: 'resources', 
         eventTypes: ['replace', 'update', 'validate', 'save'] }, 

      { 
         name: 'actions', 
         eventTypes: ['takeAction'] }, 

      { 
         name: 'flags', 
         eventTypes: ['changeFlag'] }, 

      { 
         name: 'i18n', 
         eventTypes: ['changeLocale'] }, 

      { 
         name: 'visibility', 
         eventTypes: ['changeAreaVisibility', 'changeWidgetVisibility'] }, 

      { 
         name: 'other', 
         eventTypes: [] }];



      var settings = setDefaults({ 
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
            runtime: true } }, 

      patterns);

      var model = { 
         patterns: patterns, 
         index: 0, 
         eventInfos: [], 
         visibleEventInfos: [], 
         problemSummary: { 
            count: 0, 
            eventInfos: [] }, 

         selectionEventInfo: null, 
         settings: settings };


      _axPatterns['default'].resources.handlerFor(context).registerResourceFromFeature('filter', { 
         onUpdateReplace: function onUpdateReplace() {runFilters();render();}, 
         isOptional: true });


      if (context.features.events.stream) {
         context.eventBus.subscribe('didProduce.' + context.features.events.stream, function (event) {
            if (Array.isArray(event.data) && event.data.length) {
               event.data.forEach(addEvent);} else 

            {
               addEvent(event.data);}

            runFilters();
            render();});}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setDefaults(settings, patterns) {
         settingGroups.forEach(function (groupName) {
            var group = settings[groupName];
            for (var _name2 in group) {
               if (group.hasOwnProperty(_name2)) {
                  group[_name2] = true;}}});



         patterns.forEach(function (patternInfo) {
            settings.patterns[patternInfo.name] = true;});

         context.features.filter.hidePatterns.forEach(function (pattern) {
            settings.patterns[pattern] = false;});

         context.features.filter.hideSources.forEach(function (pattern) {
            settings.sources[pattern] = false;});

         context.features.filter.hideInteractions.forEach(function (pattern) {
            settings.interactions[pattern] = false;});

         return settings;}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

      function runFilters() {
         var settings = model.settings;
         var numVisible = 0;

         var searchRegExp = null;
         if (settings.namePattern) {
            try {
               searchRegExp = new RegExp(settings.namePattern, 'gi');} 

            catch (e) {/* ignore invalid search pattern */}}


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
            return true;});}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function filterBySearch(event) {
         settings.namePattern = event.target.value;
         runFilters();
         render();}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function limitEvents(event) {
         if (event.target.value === '') {
            settings.visibleEventsLimit = null;}

         var value = Number(event.target.value);
         if (!Number.isInteger(value)) {return;}
         if (value >= 0 && value <= 5000) {
            settings.visibleEventsLimit = event.target.value;}

         runFilters();
         render();}


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

      function onSettingsChanged(type, group, name, state) {
         var settings = model.settings;
         var patterns = model.patterns;
         switch (type) {
            case 'ONE':
               settings[group][name] = !state;
               break;
            case 'ON':
               changeAll(true);
               break;
            case 'OFF':
               changeAll(false);
               break;
            case 'DEFAULTS':
               settings = setDefaults(settings, patterns);
               break;}


         runFilters();

         render();

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function changeAll(enable) {
            ['patterns', 'interactions', 'sources'].forEach(function (_group) {
               Object.keys(settings[_group]).forEach(function (_name) {
                  settings[_group][_name] = enable;});});}}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function clearFilters() {
         model.settings.namePattern = '';
         model.settings.visibleEventsLimit = null;
         onSettingsChanged('ON');}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function discardEvents() {
         model.eventInfos = [];
         model.selectionEventInfo = null;
         runFilters();
         refreshProblemSummary();
         render();}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function handleSelection(selectedEvent) {
         if (selectedEvent.selected) {
            model.selectionEventInfo = null;
            model.visibleEventInfos.forEach(function (event) {
               event.selected = false;});

            render();
            return;}


         model.visibleEventInfos.forEach(function (event) {
            if (event.index === selectedEvent.index) {
               model.selectionEventInfo = event;
               event.selected = true;
               return;}

            event.selected = inSelection(event, selectedEvent);});


         render();

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function inSelection(eventInfo, selectionEventInfo) {
            if (!selectionEventInfo) {
               return false;}


            return eventInfo === selectionEventInfo || 
            eventInfo.cycleId === selectionEventInfo.cycleId && 
            eventInfo.source === selectionEventInfo.source && 
            eventInfo.name === selectionEventInfo.name;}}




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
         _createClass(PatternsHtmlIcon, [{ key: 'render', value: function render() {return _React['default'].createElement('i', { className: this.iconClass });} }]);return PatternsHtmlIcon;})(_React['default'].Component);var 
      NumberOfEvents = (function (_React$Component2) {_inherits(NumberOfEvents, _React$Component2);
         function NumberOfEvents(props) {_classCallCheck(this, NumberOfEvents);
            _get(Object.getPrototypeOf(NumberOfEvents.prototype), 'constructor', this).call(this, props);
            this.props = props;}








































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(NumberOfEvents, [{ key: 'render', value: function render() {if (this.props.numberOfEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, 'Empty Events List'), _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...'));}if (this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, '0/', this.props.numberOfEvents, ' Event Items'), _React['default'].createElement('p', null, 'No events matching current filters.'), _React['default'].createElement('p', null, _React['default'].createElement('button', { type: 'button', className: 'btn btn-sm btn-primary', onClick: this.props.clearFilters }, 'Show All')));} // TODO: ng-if="model.problemSummary.hasProblems
               return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, this.props.numberOfVisibleEvents, '/', this.props.numberOfEvents, ' Events'));} }]);return NumberOfEvents;})(_React['default'].Component);var FiltersAndLimitForm = (function (_React$Component3) {_inherits(FiltersAndLimitForm, _React$Component3);
         function FiltersAndLimitForm(props) {_classCallCheck(this, FiltersAndLimitForm);
            _get(Object.getPrototypeOf(FiltersAndLimitForm.prototype), 'constructor', this).call(this, props);}
































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(FiltersAndLimitForm, [{ key: 'render', value: function render() {return _React['default'].createElement('div', { className: 'form-group form-group-sm' }, this.props.searchRegExp, _React['default'].createElement('label', { 'ax-for': '\'search\'' }, _React['default'].createElement('small', null, 'Filters:')), _React['default'].createElement('input', { className: 'form-control input-sm', placeholder: 'Search (RegExp)', 'ax-id': '\'search\'', type: 'text', value: this.props.searchRegExp, onChange: this.props.filterBySearch }), _React['default'].createElement('label', { 'ax-for': '\'limit\'' }, _React['default'].createElement('small', null, 'Limit:')), _React['default'].createElement('input', { className: 'form-control input-sm', type: 'text', 'ax-id': '\'limit\'', placeholder: '0-5000', maxLength: 4, value: this.props.limit, onChange: this.props.limitEvents }));} }]);return FiltersAndLimitForm;})(_React['default'].Component);var 
      SettingsToggleButton = (function (_React$Component4) {_inherits(SettingsToggleButton, _React$Component4);
         function SettingsToggleButton(props) {_classCallCheck(this, SettingsToggleButton);
            _get(Object.getPrototypeOf(SettingsToggleButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}






















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(SettingsToggleButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onSettingsChanged('ONE', this.props.type, this.props.text, this.props.enabled);e.stopPropagation();} }, { key: 'render', value: function render() {var toggleClassNames = 'fa pull-right ax-event-setting-toggle' + (this.props.enabled ? ' fa-toggle-on' : ' fa-toggle-off');return _React['default'].createElement('button', { type: 'button', className: 'btn btn-link ax-event-setting-toggle', onClick: this.handleClick }, this.props.icon && _React['default'].createElement('span', { className: 'ax-event-pattern' }, _React['default'].createElement(PatternsHtmlIcon, { name: this.props.text })), this.props.text, ' ', _React['default'].createElement('i', { className: toggleClassNames }));} }]);return SettingsToggleButton;})(_React['default'].Component);var 
      SelectFiltersButton = (function (_React$Component5) {_inherits(SelectFiltersButton, _React$Component5);
         function SelectFiltersButton(props) {_classCallCheck(this, SelectFiltersButton);
            _get(Object.getPrototypeOf(SelectFiltersButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.state = { showPatterns: false };
            this.allOnClick = this.allOnClick.bind(this);
            this.allOffClick = this.allOffClick.bind(this);
            this.defaultsClick = this.defaultsClick.bind(this);}
















































































































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(SelectFiltersButton, [{ key: 'allOnClick', value: function allOnClick(e) {this.props.onSettingsChanged('ON');e.stopPropagation();} }, { key: 'allOffClick', value: function allOffClick(e) {this.props.onSettingsChanged('OFF');e.stopPropagation();} }, { key: 'defaultsClick', value: function defaultsClick(e) {this.props.onSettingsChanged('DEFAULTS');e.stopPropagation();} }, { key: 'render', value: function render() {var _this = this;var handleMouseEnter = function handleMouseEnter() {return _this.setState({ showPatterns: true });};var handleMouseLeave = function handleMouseLeave() {return _this.setState({ showPatterns: false });};var patternsButtons = this.props.patterns.map(function (pattern) {return _React['default'].createElement(SettingsToggleButton, { key: pattern.name, type: 'patterns', text: pattern.name, icon: true, enabled: _this.props.settings.patterns[pattern.name], onSettingsChanged: _this.props.onSettingsChanged });});var interactionsButtons = Object.keys(this.props.settings.interactions).map(function (interaction) {return _React['default'].createElement(SettingsToggleButton, { key: interaction, type: 'interactions', text: interaction, enabled: _this.props.settings.interactions[interaction], onSettingsChanged: _this.props.onSettingsChanged });});var sourceButtons = Object.keys(this.props.settings.sources).map(function (source) {return _React['default'].createElement(SettingsToggleButton, { key: source, type: 'sources', text: source, enabled: _this.props.settings.sources[source], onSettingsChanged: _this.props.onSettingsChanged });});var commandBar = _React['default'].createElement('div', { className: 'pull-right' }, _React['default'].createElement('button', { type: 'button', onClick: this.allOnClick, className: 'btn btn-xs btn-primary' }, 'All On'), _React['default'].createElement('button', { type: 'button', onClick: this.allOffClick, className: 'btn btn-xs btn-primary' }, 'All Off'), _React['default'].createElement('button', { type: 'button', onClick: this.defaultsClick, className: 'btn btn-xs' }, 'Defaults'));return _React['default'].createElement('div', { className: this.state.showPatterns ? 'btn-group btn-group-sm open' : 'btn-group btn-group-sm', onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, _React['default'].createElement('button', { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': view.showPatterns }, 'More ', _React['default'].createElement('span', { className: 'caret' })), _React['default'].createElement('div', { className: 'dropdown-menu container col-lg-6', role: 'menu' }, _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, _React['default'].createElement('h4', null, 'Patterns'), _React['default'].createElement('div', null, patternsButtons)), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, _React['default'].createElement('h4', null, 'Interactions'), _React['default'].createElement('div', null, interactionsButtons), _React['default'].createElement('br', null), _React['default'].createElement('h4', null, 'Sources'), _React['default'].createElement('div', null, sourceButtons))), _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, ' '), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, commandBar))));} }]);return SelectFiltersButton;})(_React['default'].Component);var 
      DiscardEventsButton = (function (_React$Component6) {_inherits(DiscardEventsButton, _React$Component6);
         function DiscardEventsButton(props) {_classCallCheck(this, DiscardEventsButton);
            _get(Object.getPrototypeOf(DiscardEventsButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}



















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(DiscardEventsButton, [{ key: 'handleClick', value: function handleClick(e) {e.stopPropagation();this.props.onDiscard();} }, { key: 'render', value: function render() {var classNames = 'btn btn-primary btn-sm';if (this.props.eventInfosLength === 0) {classNames = classNames + ' ax-disabled';}return _React['default'].createElement('button', { className: classNames, type: 'button', onClick: this.handleClick }, 'Discard Events');} }]);return DiscardEventsButton;})(_React['default'].Component);var 
      ShowDetailsButton = (function (_React$Component7) {_inherits(ShowDetailsButton, _React$Component7);
         function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
            _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}
















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onNameChanged();e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('button', { type: 'button', className: 'btn-link btn-info', onClick: this.handleClick }, _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 
      EventCell = (function (_React$Component8) {_inherits(EventCell, _React$Component8);
         function EventCell(props) {_classCallCheck(this, EventCell);
            _get(Object.getPrototypeOf(EventCell.prototype), 'constructor', this).call(this, props);
            this.props = props;}















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventCell, [{ key: 'render', value: function render() {var splitPoint = this.props.content.indexOf(this.props.separator);if (splitPoint === -1) {return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content));}return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content.substring(0, splitPoint)), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.content.substring(splitPoint + 1, this.props.content.length)));} }]);return EventCell;})(_React['default'].Component);var 
      EventBody = (function (_React$Component9) {_inherits(EventBody, _React$Component9);
         function EventBody(props) {_classCallCheck(this, EventBody);
            _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.state = { 
               showDetails: false };

            this.handleName = this.handleName.bind(this);
            this.handleClick = this.handleClick.bind(this);}





























































































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventBody, [{ key: 'handleName', value: function handleName() {this.setState({ showDetails: !this.state.showDetails });} }, { key: 'handleClick', value: function handleClick(e) {this.props.onSelection(this.props.event);} //////////////////////////////////////////////////////////////////////////////////////////////////
         }, { key: 'render', value: function render() {var cssClassName = 'ax-event-pattern-' + this.props.event.pattern + ' ax-event-interaction-' + this.props.event.interaction + (this.props.event.selected ? ' ax-event-selected' : '') + (this.props.event.problems.length ? ' ax-event-has-problems' : '');var eventSummaryRow = _React['default'].createElement('tr', { className: 'ax-event-summary' }, _React['default'].createElement('td', { className: 'ax-col-pattern-icon', title: this.props.event.pattern }, _React['default'].createElement(PatternsHtmlIcon, { name: this.props.event.pattern })), _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction), _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, this.props.event.interaction == 'publish' && _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), _React['default'].createElement(EventCell, { content: this.props.event.name, separator: '.' }), _React['default'].createElement(EventCell, { content: this.props.event.source, separator: '#' }), _React['default'].createElement(EventCell, { content: this.props.event.target, separator: '#' }), _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId), _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.event.formattedTime.upper), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.event.formattedTime.lower))); ///////////////////////////////////////////////////////////////////////////////////////////////
               function detailsRow(show, formattedEvent) {if (!show) {return _React['default'].createElement('tr', null);}return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('pre', null, formattedEvent)));} ///////////////////////////////////////////////////////////////////////////////////////////////
               //TODO: Test display of problems
               function eventProblems(problems) {if (problems.length === 0) {return _React['default'].createElement('tr', null);}var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }, problem.description));});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component10) {_inherits(EventListTable, _React$Component10);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}













































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventListTable, [{ key: 'render', value: function render() {var _this2 = this;var events = this.props.events.map(function (event) {return _React['default'].createElement(EventBody, { event: event, key: event.index, viewPatternsByName: view.patternsByName, selectionEventInfo: _this2.props.selectionEventInfo, onSelection: _this2.props.onSelection });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var EventDisplayElement = (function (_React$Component11) {_inherits(EventDisplayElement, _React$Component11);
         function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);
            _get(Object.getPrototypeOf(EventDisplayElement.prototype), 'constructor', this).call(this, props);
            this.props = props;}














         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventDisplayElement, [{ key: 'render', value: function render() {if (this.props.visibleEventInfosLength === 0) {return _React['default'].createElement('div', null);}return _React['default'].createElement(EventListTable, { selectionEventInfo: this.props.selectionEventInfo, onSelection: this.props.onSelection, events: this.props.events });} }]);return EventDisplayElement;})(_React['default'].Component);
      function render() {
         reactRender(
         _React['default'].createElement('div', null, 
         _React['default'].createElement('div', { className: 'ax-affix-area', 
            'ax-affix': true, 
            'ax-affix-offset-top': '100' }, 
         _React['default'].createElement(NumberOfEvents, { numberOfVisibleEvents: model.visibleEventInfos.length, 
            numberOfEvents: model.eventInfos.length, 
            clearFilters: clearFilters }), 

         _React['default'].createElement('div', { className: 'ax-button-wrapper form-inline' }, 
         _React['default'].createElement(FiltersAndLimitForm, { name: settings.namePattern, 
            filterBySearch: filterBySearch, 
            limit: settings.visibleEventsLimit, 
            limitEvents: limitEvents }), 

         _React['default'].createElement(SelectFiltersButton, { patterns: model.patterns, 
            settings: model.settings, 
            onSettingsChanged: onSettingsChanged }), 

         _React['default'].createElement(DiscardEventsButton, { eventInfosLength: model.eventInfos.length, 
            onDiscard: discardEvents }))), 




         _React['default'].createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length, 
            events: model.visibleEventInfos, 
            onSelection: handleSelection, 
            selectionEventInfo: model.selectionEventInfo })));}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7O0FBR2IsVUFBTSxJQUFJLEdBQUc7QUFDVixxQkFBWSxFQUFFLEtBQUssRUFDckIsQ0FBQzs7O0FBRUYsVUFBSSxhQUFhLEdBQUcsQ0FBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBRSxDQUFDOzs7O0FBSTlELFVBQUksYUFBYSxHQUFHO0FBQ2pCLGlCQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0FBQ3JDLGVBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztBQUNoRSxhQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDdkIsa0JBQVMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLDBCQUEwQixFQUFFLHlCQUF5QixDQUFDLEVBQ25HLENBQUM7Ozs7O0FBSUYsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7QUFJdkIsVUFBSSxRQUFRLEdBQUc7QUFDWjtBQUNHLGFBQUksRUFBRSxXQUFXO0FBQ2pCLG1CQUFVLEVBQUUsQ0FBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUUsRUFDbEQ7O0FBQ0Q7QUFDRyxhQUFJLEVBQUUsWUFBWTtBQUNsQixtQkFBVSxFQUFFLENBQUUsVUFBVSxDQUFFLEVBQzVCOztBQUNEO0FBQ0csYUFBSSxFQUFFLFdBQVc7QUFDakIsbUJBQVUsRUFBRSxDQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBRSxFQUN6RDs7QUFDRDtBQUNHLGFBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVUsRUFBRSxDQUFFLFlBQVksQ0FBRSxFQUM5Qjs7QUFDRDtBQUNHLGFBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQVUsRUFBRSxDQUFFLFlB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QzNCLG9CQUFRLEVBQUcsS0FBSyxDQUFDLFFBQVEsQUFBRTtBQUMzQiw2QkFBaUIsRUFBRyxpQkFBaUIsQUFBRSxHQUMxRDs7QUFDRix5Q0FBQyxtQkFBbUIsSUFBQyxnQkFBZ0IsRUFBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQUFBRTtBQUM1QyxxQkFBUyxFQUFHLGFBQWEsQUFBRSxHQUM5QyxDQUVDLENBQ0g7Ozs7O0FBQ04seUNBQUMsbUJBQW1CLElBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQUFBQztBQUN4RCxrQkFBTSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQUFBQztBQUNoQyx1QkFBVyxFQUFHLGVBQWUsQUFBRTtBQUMvQiw4QkFBa0IsRUFBRyxLQUFLLENBQUMsa0JBQWtCLEFBQUUsR0FDbEUsQ0FDQyxDQUNSLENBQUMsQ0FDSjs7Ozs7Ozs7QUFJRCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNLEVBQ3hCLENBQUMsQ0FDSjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUU7QUFDN0QsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJldmVudHMtZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcbmltcG9ydCBheCBmcm9tICdsYXhhcic7XG5cbmZ1bmN0aW9uIGNyZWF0ZSggY29udGV4dCwgcmVhY3RSZW5kZXIsIGZsb3dTZXJ2aWNlICkge1xuICAgJ3VzZSBzdHJpY3QnO1xuXG5cbiAgIGNvbnN0IHZpZXcgPSB7XG4gICAgICBzaG93UGF0dGVybnM6IGZhbHNlXG4gICB9O1xuXG4gICBsZXQgc2V0dGluZ0dyb3VwcyA9IFsgJ3BhdHRlcm5zJywgJ2ludGVyYWN0aW9ucycsICdzb3VyY2VzJyBdO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVyblRvcGljcyA9IHtcbiAgICAgIFJFU09VUkNFOiBbJ2RpZFJlcGxhY2UnLCAnZGlkVXBkYXRlJ10sXG4gICAgICBBQ1RJT046IFsndGFrZUFjdGlvblJlcXVlc3QnLCAnd2lsbFRha2VBY3Rpb24nLCAnZGlkVGFrZUFjdGlvbiddLFxuICAgICAgRkxBRzogWydkaWRDaGFuZ2VGbGFnJ10sXG4gICAgICBDT05UQUlORVI6IFsnY2hhbmdlQXJlYVZpc2liaWxpdHlSZXF1ZXN0JywgJ3dpbGxDaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eSddXG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjb250ZXh0LnJlc291cmNlcyA9IHt9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVybnMgPSBbXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnbGlmZWN5Y2xlJyxcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2VuZExpZmVjeWNsZScsICdiZWdpbkxpZmVjeWNsZScgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICduYXZpZ2F0aW9uJyxcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ25hdmlnYXRlJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ3Jlc291cmNlcycsXG4gICAgICAgICBldmVudFR5cGVzOiBbICdyZXBsYWNlJywgJ3VwZGF0ZScsICd2YWxpZGF0ZScsICdzYXZlJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICAgZXZlbnRUeXBlczogWyAndGFrZUFjdGlvbicgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICdmbGFncycsXG4gICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VGbGFnJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ2kxOG4nLFxuICAgICAgICAgZXZlbnRUeXBlczogWyAnY2hhbmdlTG9jYWxlJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ3Zpc2liaWxpdHknLFxuICAgICAgICAgZXZlbnRUeXBlczogWyAnY2hhbmdlQXJlYVZpc2liaWxpdHknLCAnY2hhbmdlV2lkZ2V0VmlzaWJpbGl0eScgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICdvdGhlcicsXG4gICAgICAgICBldmVudFR5cGVzOiBbXVxuICAgICAgfVxuICAgXTtcblxuICAgbGV0IHNldHRpbmdzID0gc2V0RGVmYXVsdHMoIHtcbiAgICAgIG5hbWVQYXR0ZXJuOiAnJyxcbiAgICAgIHZpc2libGVFdmVudHNMaW1pdDogMTAwLFxuICAgICAgcGF0dGVybnM6IHt9LFxuICAgICAgaW50ZXJhY3Rpb25zOiB7XG4gICAgICAgICBzdWJzY3JpYmU6IHRydWUsXG4gICAgICAgICBwdWJsaXNoOiB0cnVlLFxuICAgICAgICAgZGVsaXZlcjogdHJ1ZSxcbiAgICAgICAgIHVuc3Vic2NyaWJlOiB0cnVlXG4gICAgICB9LFxuICAgICAgc291cmNlczoge1xuICAgICAgICAgd2lkZ2V0czogdHJ1ZSxcbiAgICAgICAgIHJ1bnRpbWU6IHRydWVcbiAgICAgIH1cbiAgIH0sIHBhdHRlcm5zICk7XG5cbiAgIGxldCBtb2RlbCA9IHtcbiAgICAgIHBhdHRlcm5zOiBwYXR0ZXJucyxcbiAgICAgIGluZGV4OiAwLFxuICAgICAgZXZlbnRJbmZvczogW10sXG4gICAgICB2aXNpYmxlRXZlbnRJbmZvczogW10sXG4gICAgICBwcm9ibGVtU3VtbWFyeToge1xuICAgICAgICAgY291bnQ6IDAsXG4gICAgICAgICBldmVudEluZm9zOiBbXVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvbkV2ZW50SW5mbzogbnVsbCxcbiAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgfTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogKCkgPT4geyBydW5GaWx0ZXJzKCk7IHJlbmRlcigpOyB9LFxuICAgICAgaXNPcHRpb25hbDogdHJ1ZVxuICAgfSApO1xuXG4gICBpZiggY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtICkge1xuICAgICAgY29udGV4dC5ldmVudEJ1cy5zdWJzY3JpYmUoICdkaWRQcm9kdWNlLicgKyBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5zdHJlYW0sIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBldmVudC5kYXRhICkgJiYgZXZlbnQuZGF0YS5sZW5ndGggKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goIGFkZEV2ZW50ICk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBldmVudC5kYXRhICk7XG4gICAgICAgICB9XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc2V0RGVmYXVsdHMoIHNldHRpbmdzLCBwYXR0ZXJucyApIHtcbiAgICAgIHNldHRpbmdHcm91cHMuZm9yRWFjaCggZnVuY3Rpb24oIGdyb3VwTmFtZSApIHtcbiAgICAgICAgIGxldCBncm91cCA9IHNldHRpbmdzWyBncm91cE5hbWUgXTtcbiAgICAgICAgIGZvciggbGV0IG5hbWUgaW4gZ3JvdXAgKSB7XG4gICAgICAgICAgICBpZiggZ3JvdXAuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcbiAgICAgICAgICAgICAgIGdyb3VwWyBuYW1lIF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfSApO1xuICAgICAgcGF0dGVybnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm5JbmZvICkge1xuICAgICAgICAgc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm5JbmZvLm5hbWUgXSA9IHRydWU7XG4gICAgICB9ICk7XG4gICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlUGF0dGVybnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICBzZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybiBdID0gZmFsc2U7XG4gICAgICB9ICk7XG4gICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgIHNldHRpbmdzLnNvdXJjZXNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgfSApO1xuICAgICAgY29udGV4dC5mZWF0dXJlcy5maWx0ZXIuaGlkZUludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgIHNldHRpbmdzLmludGVyYWN0aW9uc1sgcGF0dGVybiBdID0gZmFsc2U7XG4gICAgICB9ICk7XG4gICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGFkZEV2ZW50KCBldmVudEluZm8gKSB7XG4gICAgICBsZXQgY29tcGxldGVFdmVudEluZm8gPSB7XG4gICAgICAgICBpbmRleDogKyttb2RlbC5pbmRleCxcbiAgICAgICAgIGludGVyYWN0aW9uOiBldmVudEluZm8uYWN0aW9uLFxuICAgICAgICAgY3ljbGVJZDogZXZlbnRJbmZvLmN5Y2xlSWQgPiAtMSA/IGV2ZW50SW5mby5jeWNsZUlkIDogJy0nLFxuICAgICAgICAgZXZlbnRPYmplY3Q6IGV2ZW50SW5mby5ldmVudE9iamVjdCB8fCB7fSxcbiAgICAgICAgIGZvcm1hdHRlZEV2ZW50OiBKU09OLnN0cmluZ2lmeSggZXZlbnRJbmZvLmV2ZW50T2JqZWN0LCBudWxsLCAzICksXG4gICAgICAgICBmb3JtYXR0ZWRUaW1lOiB7XG4gICAgICAgICAgICB1cHBlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ0hIOm1tJyApLFxuICAgICAgICAgICAgbG93ZXI6IG1vbWVudCggZXZlbnRJbmZvLnRpbWUgKS5mb3JtYXQoICdzcy5TU1MnIClcbiAgICAgICAgIH0sXG4gICAgICAgICBuYW1lOiBldmVudEluZm8uZXZlbnQgfHwgJz8nLFxuICAgICAgICAgcGF0dGVybjogcGF0dGVybiggKGV2ZW50SW5mby5ldmVudCB8fCAnPycpLnRvTG93ZXJDYXNlKCkgKSxcbiAgICAgICAgIHNob3dEZXRhaWxzOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZTogKCBldmVudEluZm8uc291cmNlIHx8ICc/JyApLnJlcGxhY2UoIC9ed2lkZ2V0XFwuLywgJycgKSxcbiAgICAgICAgIHRhcmdldDogKCBldmVudEluZm8udGFyZ2V0IHx8ICc/JyApLnJlcGxhY2UoIC9eLSQvLCAnJyApLFxuICAgICAgICAgdGltZTogZXZlbnRJbmZvLnRpbWUsXG4gICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICBzb3VyY2VUeXBlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkuaW5kZXhPZiggJ3dpZGdldC4nICkgPT09IDAgPyAnd2lkZ2V0cycgOiAncnVudGltZScsXG4gICAgICAgICBwcm9ibGVtczogdHJhY2tlci50cmFjayggZXZlbnRJbmZvIClcbiAgICAgIH07XG5cbiAgICAgIG1vZGVsLmV2ZW50SW5mb3MudW5zaGlmdCggY29tcGxldGVFdmVudEluZm8gKTtcbiAgICAgIGlmKCBjb21wbGV0ZUV2ZW50SW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgIH1cblxuICAgICAgaWYoIG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoID4gY29udGV4dC5mZWF0dXJlcy5ldmVudHMuYnVmZmVyU2l6ZSApIHtcbiAgICAgICAgIGxldCByZW1vdmVkSW5mbyA9IG1vZGVsLmV2ZW50SW5mb3MucG9wKCk7XG4gICAgICAgICBpZiggcmVtb3ZlZEluZm8ucHJvYmxlbXMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBhdHRlcm4oIGV2ZW50TmFtZSApIHtcbiAgICAgICAgIGxldCBtYXRjaGluZ1BhdHRoZXJuID0gbW9kZWwucGF0dGVybnMuZmlsdGVyKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIHJldHVybiBwYXR0ZXJuLmV2ZW50VHlwZXMuc29tZSggZnVuY3Rpb24oIGV2ZW50VHlwZSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudE5hbWUuaW5kZXhPZiggZXZlbnRUeXBlLnRvTG93ZXJDYXNlKCkgKSAhPT0gLTE7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9ICk7XG4gICAgICAgICByZXR1cm4gbWF0Y2hpbmdQYXR0aGVybi5sZW5ndGggPyBtYXRjaGluZ1BhdHRoZXJuWzBdLm5hbWUgOiAnb3RoZXInO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBydW5GaWx0ZXJzKCkge1xuICAgICAgbGV0IHNldHRpbmdzID0gbW9kZWwuc2V0dGluZ3M7XG4gICAgICBsZXQgbnVtVmlzaWJsZSA9IDA7XG5cbiAgICAgIGxldCBzZWFyY2hSZWdFeHAgPSBudWxsO1xuICAgICAgaWYoIHNldHRpbmdzLm5hbWVQYXR0ZXJuICkge1xuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoIHNldHRpbmdzLm5hbWVQYXR0ZXJuLCAnZ2knICk7XG4gICAgICAgICB9XG4gICAgICAgICBjYXRjaCggZSApIHsgLyogaWdub3JlIGludmFsaWQgc2VhcmNoIHBhdHRlcm4gKi8gfVxuICAgICAgfVxuXG4gICAgICBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcyA9IG1vZGVsLmV2ZW50SW5mb3MuZmlsdGVyKCBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgaWYoIHNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCAhPT0gbnVsbCAmJiBudW1WaXNpYmxlID49IHNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3MuaW50ZXJhY3Rpb25zWyBldmVudEluZm8uaW50ZXJhY3Rpb24gXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3MucGF0dGVybnNbIGV2ZW50SW5mby5wYXR0ZXJuIF0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIXNldHRpbmdzLnNvdXJjZXNbIGV2ZW50SW5mby5zb3VyY2VUeXBlIF0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIW1hdGNoZXNGaWx0ZXJSZXNvdXJjZSggZXZlbnRJbmZvICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICBpZiggIW1hdGNoZXNTZWFyY2hFeHByZXNzaW9uKCBldmVudEluZm8sIHNlYXJjaFJlZ0V4cCApICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgKytudW1WaXNpYmxlO1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGZpbHRlckJ5U2VhcmNoKCBldmVudCApIHtcbiAgICAgIHNldHRpbmdzLm5hbWVQYXR0ZXJuID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgcmVuZGVyKCk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGxpbWl0RXZlbnRzKCBldmVudCApIHtcbiAgICAgIGlmKCBldmVudC50YXJnZXQudmFsdWUgPT09ICcnICkge1xuICAgICAgICAgc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKCBldmVudC50YXJnZXQudmFsdWUgKTtcbiAgICAgIGlmKCAhTnVtYmVyLmlzSW50ZWdlciggdmFsdWUgKSApIHsgcmV0dXJuOyB9XG4gICAgICBpZiggdmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSA1MDAwICkge1xuICAgICAgICAgc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgfVxuICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgcmVuZGVyKCk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpIHtcbiAgICAgIGxldCBldmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBpbmZvICkge1xuICAgICAgICAgcmV0dXJuIGluZm8ucHJvYmxlbXMubGVuZ3RoID4gMDtcbiAgICAgIH0gKTtcblxuICAgICAgbW9kZWwucHJvYmxlbVN1bW1hcnkgPSB7XG4gICAgICAgICBoYXNQcm9ibGVtczogZXZlbnRJbmZvcy5sZW5ndGggPiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogZXZlbnRJbmZvc1xuICAgICAgfTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkge1xuICAgICAgcmV0dXJuICFzZWFyY2hSZWdFeHAgfHwgW2V2ZW50SW5mby5uYW1lLCBldmVudEluZm8uc291cmNlLCBldmVudEluZm8udGFyZ2V0XVxuICAgICAgICAgICAgLnNvbWUoIGZ1bmN0aW9uKCBmaWVsZCApIHtcbiAgICAgICAgICAgICAgIGxldCBtYXRjaGVzID0gc2VhcmNoUmVnRXhwLnRlc3QoIGZpZWxkICk7XG4gICAgICAgICAgICAgICBzZWFyY2hSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgIHJldHVybiAhIW1hdGNoZXM7XG4gICAgICAgICAgICB9ICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG1hdGNoZXNGaWx0ZXJSZXNvdXJjZSggZXZlbnRJbmZvICkge1xuICAgICAgaWYoICFjb250ZXh0LnJlc291cmNlcy5maWx0ZXIgKSB7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZpbHRlclRvcGljcyA9IGNvbnRleHQucmVzb3VyY2VzLmZpbHRlci50b3BpY3MgfHwgW107XG4gICAgICBsZXQgZmlsdGVyUGFydGljaXBhbnRzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnBhcnRpY2lwYW50cyB8fCBbXTtcbiAgICAgIGlmKCAhZmlsdGVyVG9waWNzLmxlbmd0aCAmJiAhZmlsdGVyUGFydGljaXBhbnRzLmxlbmd0aCApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgbWF0Y2hlc1RvcGljRmlsdGVyID0gZmlsdGVyVG9waWNzXG4gICAgICAgICAuc29tZSggZnVuY3Rpb24oIGl0ZW0gKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ZXMgPSBwYXR0ZXJuVG9waWNzW2l0ZW0ucGF0dGVybl07XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ZXMuc29tZSggZnVuY3Rpb24oIHByZWZpeCApIHtcbiAgICAgICAgICAgICAgIGxldCB0b3BpYyA9IHByZWZpeCArICcuJyArIGl0ZW0udG9waWM7XG4gICAgICAgICAgICAgICByZXR1cm4gZXZlbnRJbmZvLm5hbWUgPT09IHRvcGljIHx8IGV2ZW50SW5mby5uYW1lLmluZGV4T2YoIHRvcGljICsgJy4nICkgPT09IDA7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgIGxldCBtYXRjaGVzUGFydGljaXBhbnRzRmlsdGVyID0gWyd0YXJnZXQnLCAnc291cmNlJ10uc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgbGV0IHZhbHVlID0gZXZlbnRJbmZvW2ZpZWxkXTtcbiAgICAgICAgIHJldHVybiBmaWx0ZXJQYXJ0aWNpcGFudHNcbiAgICAgICAgICAgIC5tYXAoIGZ1bmN0aW9uKCBfICkgeyByZXR1cm4gXy5wYXJ0aWNpcGFudDsgfSApXG4gICAgICAgICAgICAuc29tZSggaXNTdWZmaXhPZiggdmFsdWUgKSApO1xuICAgICAgfSApO1xuXG4gICAgICByZXR1cm4gbWF0Y2hlc1RvcGljRmlsdGVyIHx8IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXI7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGlzU3VmZml4T2YoIHZhbHVlICkge1xuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBfICkge1xuICAgICAgICAgICAgbGV0IHRhaWwgPSAnIycgKyBfO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSB0YWlsLmxlbmd0aCAmJiB2YWx1ZS5pbmRleE9mKCB0YWlsICkgPT09IHZhbHVlLmxlbmd0aCAtIHRhaWwubGVuZ3RoO1xuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gb25TZXR0aW5nc0NoYW5nZWQoIHR5cGUsIGdyb3VwLCBuYW1lLCBzdGF0ZSApIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IG1vZGVsLnNldHRpbmdzO1xuICAgICAgY29uc3QgcGF0dGVybnMgPSBtb2RlbC5wYXR0ZXJucztcbiAgICAgIHN3aXRjaCggdHlwZSApIHtcbiAgICAgICAgIGNhc2UgJ09ORSc6XG4gICAgICAgICAgICBzZXR0aW5nc1sgZ3JvdXAgXVsgbmFtZSBdID0gIXN0YXRlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdPTic6XG4gICAgICAgICAgICBjaGFuZ2VBbGwoIHRydWUgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgY2FzZSAnT0ZGJzpcbiAgICAgICAgICAgIGNoYW5nZUFsbCggZmFsc2UgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgY2FzZSAnREVGQVVMVFMnOlxuICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXREZWZhdWx0cyggc2V0dGluZ3MsIHBhdHRlcm5zICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcnVuRmlsdGVycygpO1xuXG4gICAgICByZW5kZXIoKTtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gY2hhbmdlQWxsKCBlbmFibGUgKSB7XG4gICAgICAgICBbICdwYXR0ZXJucycsICdpbnRlcmFjdGlvbnMnLCAnc291cmNlcycgXS5mb3JFYWNoKCAoIF9ncm91cCApID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBzZXR0aW5nc1sgX2dyb3VwIF0gKS5mb3JFYWNoKCAoIF9uYW1lICkgPT4ge1xuICAgICAgICAgICAgICAgc2V0dGluZ3NbIF9ncm91cCBdWyBfbmFtZSBdID0gZW5hYmxlO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBjbGVhckZpbHRlcnMoKSB7XG4gICAgICBtb2RlbC5zZXR0aW5ncy5uYW1lUGF0dGVybiA9ICcnO1xuICAgICAgbW9kZWwuc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ID0gbnVsbDtcbiAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkKCAnT04nICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGRpc2NhcmRFdmVudHMoKSB7XG4gICAgICBtb2RlbC5ldmVudEluZm9zID0gW107XG4gICAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0aW9uKCBzZWxlY3RlZEV2ZW50ICkge1xuICAgICAgaWYoIHNlbGVjdGVkRXZlbnQuc2VsZWN0ZWQgKSB7XG4gICAgICAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgICAgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MuZm9yRWFjaCggKCBldmVudCApID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICB9ICk7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MuZm9yRWFjaCggKCBldmVudCApID0+IHtcbiAgICAgICAgIGlmKCBldmVudC5pbmRleCA9PT0gc2VsZWN0ZWRFdmVudC5pbmRleCApIHtcbiAgICAgICAgICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IGV2ZW50O1xuICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSBpblNlbGVjdGlvbiggZXZlbnQsIHNlbGVjdGVkRXZlbnQgKTtcbiAgICAgIH0gKTtcblxuICAgICAgcmVuZGVyKCk7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGluU2VsZWN0aW9uKCBldmVudEluZm8sIHNlbGVjdGlvbkV2ZW50SW5mbyApIHtcbiAgICAgICAgIGlmKCAhc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gZXZlbnRJbmZvID09PSBzZWxlY3Rpb25FdmVudEluZm8gfHwgKFxuICAgICAgICAgICAgICAgZXZlbnRJbmZvLmN5Y2xlSWQgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5jeWNsZUlkICYmXG4gICAgICAgICAgICAgICBldmVudEluZm8uc291cmNlID09PSBzZWxlY3Rpb25FdmVudEluZm8uc291cmNlICYmXG4gICAgICAgICAgICAgICBldmVudEluZm8ubmFtZSA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLm5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFBhdHRlcm5zSHRtbEljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgICAgICAgc3dpdGNoKCBwcm9wcy5uYW1lICkge1xuICAgICAgICAgICAgY2FzZSAnbGlmZWN5Y2xlJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJlY3ljbGUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduYXZpZ2F0aW9uJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWxvY2F0aW9uLWFycm93JztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVzb3VyY2VzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZpbGUtdGV4dC1vJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWN0aW9ucyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1yb2NrZXQnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmbGFncyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1mbGFnJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaTE4bic6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1nbG9iZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2liaWxpdHknOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZXllJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJyc7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9e3RoaXMuaWNvbkNsYXNzfS8+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIE51bWJlck9mRXZlbnRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICBpZiggdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyA9PT0gMCAgKSB7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5FbXB0eSBFdmVudHMgTGlzdDwvaDQ+XG4gICAgICAgICAgICAgICA8cD48aSBjbGFzc05hbWU9XCJmYSBmYS1jbG9jay1vXCIgLz4gV2FpdGluZyBmb3IgZXZlbnRzIGZyb20gaG9zdCBhcHBsaWNhdGlvbi4uLjwvcD5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoIHRoaXMucHJvcHMubnVtYmVyT2ZFdmVudHMgPiAwICYmIHRoaXMucHJvcHMubnVtYmVyT2ZWaXNpYmxlRXZlbnRzID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj4wL3sgdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyB9IEV2ZW50IEl0ZW1zPC9oND5cbiAgICAgICAgICAgICAgICAgIDxwPk5vIGV2ZW50cyBtYXRjaGluZyBjdXJyZW50IGZpbHRlcnMuPC9wPlxuICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5jbGVhckZpbHRlcnN9PlNob3cgQWxsXG4gICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gVE9ETzogbmctaWY9XCJtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtc1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMubnVtYmVyT2ZWaXNpYmxlRXZlbnRzIH0veyB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzIH0gRXZlbnRzXG4gICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEZpbHRlcnNBbmRMaW1pdEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbVwiPlxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnNlYXJjaFJlZ0V4cCB9XG4gICAgICAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ3NlYXJjaCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5GaWx0ZXJzOjwvc21hbGw+XG4gICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggKFJlZ0V4cClcIlxuICAgICAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ3NlYXJjaCdcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMucHJvcHMuc2VhcmNoUmVnRXhwIH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMucHJvcHMuZmlsdGVyQnlTZWFyY2ggfSAvPlxuICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidsaW1pdCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ2xpbWl0J1wiXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAtNTAwMFwiXG4gICAgICAgICAgICAgICAgICBtYXhMZW5ndGg9eyA0IH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy5wcm9wcy5saW1pdCB9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMucHJvcHMubGltaXRFdmVudHMgfVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2V0dGluZ3NUb2dnbGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ09ORScsIHRoaXMucHJvcHMudHlwZSwgdGhpcy5wcm9wcy50ZXh0LCB0aGlzLnByb3BzLmVuYWJsZWQgKTtcbiAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IHRvZ2dsZUNsYXNzTmFtZXMgPSAnZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZScgKyAoXG4gICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuYWJsZWQ/ICcgZmEtdG9nZ2xlLW9uJyA6ICcgZmEtdG9nZ2xlLW9mZicgKTtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PnsgdGhpcy5wcm9wcy5pY29uICYmXG4gICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJheC1ldmVudC1wYXR0ZXJuXCI+PFBhdHRlcm5zSHRtbEljb24gbmFtZT17IHRoaXMucHJvcHMudGV4dCB9Lz48L3NwYW4+fVxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnRleHQgfSA8aSBjbGFzc05hbWU9eyB0b2dnbGVDbGFzc05hbWVzIH0gLz48L2J1dHRvbj5cblxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2VsZWN0RmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuc3RhdGUgPSB7IHNob3dQYXR0ZXJuczogZmFsc2UgfTtcbiAgICAgICAgIHRoaXMuYWxsT25DbGljayA9IHRoaXMuYWxsT25DbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB0aGlzLmFsbE9mZkNsaWNrID0gdGhpcy5hbGxPZmZDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB0aGlzLmRlZmF1bHRzQ2xpY2sgPSB0aGlzLmRlZmF1bHRzQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICBhbGxPbkNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ09OJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgYWxsT2ZmQ2xpY2soIGUgKSB7XG4gICAgICAgICB0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkKCAnT0ZGJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuXG4gICAgICBkZWZhdWx0c0NsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ0RFRkFVTFRTJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgY29uc3QgaGFuZGxlTW91c2VFbnRlciA9ICgpID0+IHRoaXMuc2V0U3RhdGUoIHsgc2hvd1BhdHRlcm5zIDogdHJ1ZSB9ICk7XG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSggeyBzaG93UGF0dGVybnMgOiBmYWxzZSB9ICk7XG5cbiAgICAgICAgIGNvbnN0IHBhdHRlcm5zQnV0dG9ucyA9IHRoaXMucHJvcHMucGF0dGVybnMubWFwKCBwYXR0ZXJuID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8U2V0dGluZ3NUb2dnbGVCdXR0b24ga2V5PXsgcGF0dGVybi5uYW1lIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGF0dGVybnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBwYXR0ZXJuLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb249eyB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXt0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgLz4gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25zQnV0dG9ucyA9IE9iamVjdC5rZXlzKCB0aGlzLnByb3BzLnNldHRpbmdzLmludGVyYWN0aW9ucyApLm1hcCggaW50ZXJhY3Rpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBpbnRlcmFjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImludGVyYWN0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17IGludGVyYWN0aW9uIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGludGVyYWN0aW9uIF0gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXt0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgICAgLz4gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgY29uc3Qgc291cmNlQnV0dG9ucyA9IE9iamVjdC5rZXlzKCB0aGlzLnByb3BzLnNldHRpbmdzLnNvdXJjZXMgKS5tYXAoIHNvdXJjZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPFNldHRpbmdzVG9nZ2xlQnV0dG9uIGtleT17IHNvdXJjZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInNvdXJjZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBzb3VyY2UgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ9eyB0aGlzLnByb3BzLnNldHRpbmdzLnNvdXJjZXNbIHNvdXJjZSBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIGNvbnN0IGNvbW1hbmRCYXIgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmFsbE9uQ2xpY2sgfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgID5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmFsbE9mZkNsaWNrIH1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICA+QWxsIE9mZjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17IHRoaXMuZGVmYXVsdHNDbGljayB9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4teHNcIlxuICAgICAgICAgICAgICAgPkRlZmF1bHRzPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG5cbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IHRoaXMuc3RhdGUuc2hvd1BhdHRlcm5zID8gJ2J0bi1ncm91cCBidG4tZ3JvdXAtc20gb3Blbic6ICdidG4tZ3JvdXAgYnRuLWdyb3VwLXNtJyB9XG4gICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17IGhhbmRsZU1vdXNlRW50ZXIgfVxuICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyBoYW5kbGVNb3VzZUxlYXZlIH0+XG4gICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9eyB2aWV3LnNob3dQYXR0ZXJucyB9PlxuICAgICAgICAgICAgICAgICAgTW9yZSA8c3BhbiBjbGFzc05hbWU9XCJjYXJldFwiIC8+XG4gICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudSBjb250YWluZXIgY29sLWxnLTZcIiByb2xlPVwibWVudVwiPlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5QYXR0ZXJuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PnsgcGF0dGVybnNCdXR0b25zIH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDQ+SW50ZXJhY3Rpb25zPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+eyBpbnRlcmFjdGlvbnNCdXR0b25zIH08L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQ+U291cmNlczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pnsgc291cmNlQnV0dG9ucyB9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBmaXJzdFwiPiZuYnNwOzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbW1hbmRCYXJ9XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgRGlzY2FyZEV2ZW50c0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgdGhpcy5wcm9wcy5vbkRpc2NhcmQoKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSAnYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSc7XG5cbiAgICAgICAgIGlmKCB0aGlzLnByb3BzLmV2ZW50SW5mb3NMZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcyArICcgYXgtZGlzYWJsZWQnXG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9eyBjbGFzc05hbWVzIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+RGlzY2FyZCBFdmVudHM8L2J1dHRvbj5cbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCk7XG4gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICByZXR1cm4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi1saW5rIGJ0bi1pbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPXsgdGhpcy5wcm9wcy5zaG93RGV0YWlscyA/IFwiZmEgZmEtbWludXMtc3F1YXJlXCIgOiBcImZhIGZhLXBsdXMtc3F1YXJlXCIgfT4mbmJzcDs8L2k+XG4gICAgICAgICA8L2J1dHRvbj47XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEV2ZW50Q2VsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgbGV0IHNwbGl0UG9pbnQgPSB0aGlzLnByb3BzLmNvbnRlbnQuaW5kZXhPZiggdGhpcy5wcm9wcy5zZXBhcmF0b3IgICk7XG4gICAgICAgICBpZiggc3BsaXRQb2ludCA9PT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gPHRkPjxzcGFuPnsgdGhpcy5wcm9wcy5jb250ZW50IH08L3NwYW4+PC90ZD47XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gKCA8dGQ+XG4gICAgICAgICAgICA8c3Bhbj57IHRoaXMucHJvcHMuY29udGVudC5zdWJzdHJpbmcoIDAsIHNwbGl0UG9pbnQgKSB9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgPHNwYW4+eyB0aGlzLnByb3BzLmNvbnRlbnQuc3Vic3RyaW5nKCBzcGxpdFBvaW50ICsgMSwgdGhpcy5wcm9wcy5jb250ZW50Lmxlbmd0aCApIH08L3NwYW4+XG4gICAgICAgICA8L3RkPiApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEV2ZW50Qm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzaG93RGV0YWlsczogZmFsc2VcbiAgICAgICAgIH07XG4gICAgICAgICB0aGlzLmhhbmRsZU5hbWUgPSB0aGlzLmhhbmRsZU5hbWUuYmluZCggdGhpcyApO1xuICAgICAgICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVOYW1lKCkge1xuICAgICAgICAgdGhpcy5zZXRTdGF0ZSgge3Nob3dEZXRhaWxzOiAhdGhpcy5zdGF0ZS5zaG93RGV0YWlsc30gKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uKCB0aGlzLnByb3BzLmV2ZW50ICk7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IGNzc0NsYXNzTmFtZSA9ICdheC1ldmVudC1wYXR0ZXJuLScgKyB0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyBheC1ldmVudC1pbnRlcmFjdGlvbi0nICsgdGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHRoaXMucHJvcHMuZXZlbnQuc2VsZWN0ZWQgPyAnIGF4LWV2ZW50LXNlbGVjdGVkJyA6ICcnICkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zLmxlbmd0aCA/ICcgYXgtZXZlbnQtaGFzLXByb2JsZW1zJyA6ICcnICk7XG4gICAgICAgICBjb25zdCBldmVudFN1bW1hcnlSb3cgPSAoXG4gICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc3VtbWFyeVwiPlxuICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1wYXR0ZXJuLWljb25cIlxuICAgICAgICAgICAgICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm59PjxQYXR0ZXJuc0h0bWxJY29uIG5hbWU9e3RoaXMucHJvcHMuZXZlbnQucGF0dGVybn0vPlxuICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtaW50ZXJhY3Rpb25cIj57dGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1wYXlsb2FkLWljb25cIj5cbiAgICAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbiA9PSAncHVibGlzaCcgJiZcbiAgICAgICAgICAgICAgICAgICAgPFNob3dEZXRhaWxzQnV0dG9uIHNob3dEZXRhaWxzPXt0aGlzLnN0YXRlLnNob3dEZXRhaWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25OYW1lQ2hhbmdlZD17dGhpcy5oYW5kbGVOYW1lfS8+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50Lm5hbWV9IHNlcGFyYXRvcj1cIi5cIiAvPlxuICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50LnNvdXJjZX0gc2VwYXJhdG9yPVwiI1wiIC8+XG4gICAgICAgICAgICAgICA8RXZlbnRDZWxsIGNvbnRlbnQ9e3RoaXMucHJvcHMuZXZlbnQudGFyZ2V0fSBzZXBhcmF0b3I9XCIjXCIgLz5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtY3ljbGUgdGV4dC1yaWdodFwiPnt0aGlzLnByb3BzLmV2ZW50LmN5Y2xlSWR9PC90ZD5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+PHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS51cHBlcn08L3NwYW4+PGJyIC8+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5ldmVudC5mb3JtYXR0ZWRUaW1lLmxvd2VyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgKTtcblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgZnVuY3Rpb24gZGV0YWlsc1Jvdyggc2hvdywgZm9ybWF0dGVkRXZlbnQgKSB7XG4gICAgICAgICAgICBpZiggIXNob3cgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gPHRyIC8+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuKCA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCIgLz5cbiAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgPHByZT57Zm9ybWF0dGVkRXZlbnR9PC9wcmU+XG4gICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgPC90cj4gKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgLy9UT0RPOiBUZXN0IGRpc3BsYXkgb2YgcHJvYmxlbXNcblxuICAgICAgICAgZnVuY3Rpb24gZXZlbnRQcm9ibGVtcyggcHJvYmxlbXMgKSB7XG4gICAgICAgICAgICBpZiggcHJvYmxlbXMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxpc3RPZlByb2JsZW1zID0gcHJvYmxlbXMubWFwKCAoIHByb2JsZW0gKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn0gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPntwcm9ibGVtLmRlc2NyaXB0aW9ufTwvaT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCI+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjNcIiAvPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCI1XCI+XG4gICAgICAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bGlzdE9mUHJvYmxlbXN9XG4gICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHRib2R5IGNsYXNzTmFtZT17IGNzc0NsYXNzTmFtZSB9XG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgICB7IGV2ZW50U3VtbWFyeVJvdyB9XG4gICAgICAgICAgICB7IGV2ZW50UHJvYmxlbXMoIHRoaXMucHJvcHMuZXZlbnQucHJvYmxlbXMgKSB9XG4gICAgICAgICAgICB7IGRldGFpbHNSb3coIHRoaXMuc3RhdGUuc2hvd0RldGFpbHMsIHRoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkRXZlbnQgKSB9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgRXZlbnRMaXN0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMucHJvcHMuZXZlbnRzLm1hcCggZXZlbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxFdmVudEJvZHkgZXZlbnQ9e2V2ZW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2V2ZW50LmluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3UGF0dGVybnNCeU5hbWU9e3ZpZXcucGF0dGVybnNCeU5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkV2ZW50SW5mbz17dGhpcy5wcm9wcy5zZWxlY3Rpb25FdmVudEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uPXt0aGlzLnByb3BzLm9uU2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgIDxjb2xncm91cD5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXNvdXJjZVwiLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRhcmdldFwiLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGltZXN0YW1wXCIvPlxuICAgICAgICAgICAgICAgPC9jb2xncm91cD5cbiAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+Jm5ic3A7PC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD5FdmVudCBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD5Tb3VyY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlRhcmdldDwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPkN5Y2xlPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+VGltZTxpIGNsYXNzTmFtZT1cImZhIGZhLWxvbmctYXJyb3ctdXBcIi8+PC90aD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAge2V2ZW50c31cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBFdmVudERpc3BsYXlFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICBpZiggdGhpcy5wcm9wcy52aXNpYmxlRXZlbnRJbmZvc0xlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2PjwvZGl2PjtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybiAoIDxFdmVudExpc3RUYWJsZSBzZWxlY3Rpb25FdmVudEluZm89eyB0aGlzLnByb3BzLnNlbGVjdGlvbkV2ZW50SW5mbyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17IHRoaXMucHJvcHMub25TZWxlY3Rpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzPXt0aGlzLnByb3BzLmV2ZW50c31cbiAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYWZmaXgtYXJlYVwiXG4gICAgICAgICAgICAgICAgIGF4LWFmZml4XG4gICAgICAgICAgICAgICAgIGF4LWFmZml4LW9mZnNldC10b3A9XCIxMDBcIj5cbiAgICAgICAgICAgICAgIDxOdW1iZXJPZkV2ZW50cyBudW1iZXJPZlZpc2libGVFdmVudHM9eyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlck9mRXZlbnRzPXsgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyRmlsdGVycz17Y2xlYXJGaWx0ZXJzfVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYnV0dG9uLXdyYXBwZXIgZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgIDxGaWx0ZXJzQW5kTGltaXRGb3JtIG5hbWU9eyBzZXR0aW5ncy5uYW1lUGF0dGVybiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJCeVNlYXJjaD17IGZpbHRlckJ5U2VhcmNoIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0PXsgc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0RXZlbnRzPXsgbGltaXRFdmVudHMgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RGaWx0ZXJzQnV0dG9uIHBhdHRlcm5zPXsgbW9kZWwucGF0dGVybnMgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M9eyBtb2RlbC5zZXR0aW5ncyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17IG9uU2V0dGluZ3NDaGFuZ2VkIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8RGlzY2FyZEV2ZW50c0J1dHRvbiBldmVudEluZm9zTGVuZ3RoPXsgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25EaXNjYXJkPXsgZGlzY2FyZEV2ZW50cyB9XG4gICAgICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEV2ZW50RGlzcGxheUVsZW1lbnQgdmlzaWJsZUV2ZW50SW5mb3NMZW5ndGg9e21vZGVsLnZpc2libGVFdmVudEluZm9zLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cz17bW9kZWwudmlzaWJsZUV2ZW50SW5mb3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17IGhhbmRsZVNlbGVjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FdmVudEluZm89eyBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdldmVudHMtZGlzcGxheS13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4UmVhY3RSZW5kZXInLCAnYXhGbG93U2VydmljZScgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
