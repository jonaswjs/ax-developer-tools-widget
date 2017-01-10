define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker'], function (exports, module, _react, _laxarPatterns, _moment, _tracker) {/**
                                                                                                                                                        * Copyright 2016 aixigo AG
                                                                                                                                                        * Released under the MIT license.
                                                                                                                                                        * http://laxarjs.org/license
                                                                                                                                                        */'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);






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
         _createClass(NumberOfEvents, [{ key: 'render', value: function render() {if (this.props.numberOfEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, 'Empty Events List'), _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...'));}if (this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, '0/', this.props.numberOfEvents, ' Event Items'), _React['default'].createElement('p', null, 'No events matching current filters.'), _React['default'].createElement('p', null, _React['default'].createElement('button', { type: 'button', className: 'btn btn-sm btn-primary', onClick: this.props.clearFilters }, 'Show All')));}return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, this.props.numberOfVisibleEvents, '/', this.props.numberOfEvents, ' Events'));} }]);return NumberOfEvents;})(_React['default'].Component);var 
      FiltersAndLimitForm = (function (_React$Component3) {_inherits(FiltersAndLimitForm, _React$Component3);
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
               function eventProblems(problems) {if (problems.length === 0) {return _React['default'].createElement('tr', null);}var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }), ' ', problem.description);});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component10) {_inherits(EventListTable, _React$Component10);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}














































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventListTable, [{ key: 'render', value: function render() {var _this2 = this;var events = this.props.events.map(function (event) {return _React['default'].createElement(EventBody, { event: event, key: event.index, viewPatternsByName: view.patternsByName, selectionEventInfo: _this2.props.selectionEventInfo, onSelection: _this2.props.onSelection });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var ProblemListTable = (function (_React$Component11) {_inherits(ProblemListTable, _React$Component11);
         function ProblemListTable(props) {_classCallCheck(this, ProblemListTable);
            _get(Object.getPrototypeOf(ProblemListTable.prototype), 'constructor', this).call(this, props);
            this.props = props;}






































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(ProblemListTable, [{ key: 'render', value: function render() {var eventList = this.props.problemSummary.eventInfos.map(function (event) {var problemList = event.problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning ax-error' }), problem.description);});return _React['default'].createElement('li', { key: event.index }, _React['default'].createElement('h5', null, _React['default'].createElement('strong', null, event.name), ' ', _React['default'].createElement('em', null, '(source: ', event.source, ')')), _React['default'].createElement('ul', null, problemList));});return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary ax-error' }, this.props.problemSummary.eventInfos.length, '/', this.props.eventInfos.length, ' Events with Problems'), _React['default'].createElement('ul', null, eventList), _React['default'].createElement('p', { className: 'ax-event-problems-explanation' }, 'Events with problems are marked ', _React['default'].createElement('strong', { className: 'ax-error' }, 'red'), ' in the events table. Filter by event/source as needed.'));} }]);return ProblemListTable;})(_React['default'].Component);var 
      EventDisplayElement = (function (_React$Component12) {_inherits(EventDisplayElement, _React$Component12);
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




         model.problemSummary.hasProblems && 
         _React['default'].createElement(ProblemListTable, { problemSummary: model.problemSummary, 
            eventInfos: model.eventInfos }), 

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQSxZQUFTLE1BQU0sQ0FBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRztBQUNsRCxrQkFBWSxDQUFDOzs7QUFHYixVQUFNLElBQUksR0FBRztBQUNWLHFCQUFZLEVBQUUsS0FBSyxFQUNyQixDQUFDOzs7QUFFRixVQUFJLGFBQWEsR0FBRyxDQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFFLENBQUM7Ozs7QUFJOUQsVUFBSSxhQUFhLEdBQUc7QUFDakIsaUJBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7QUFDckMsZUFBTSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDO0FBQ2hFLGFBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQztBQUN2QixrQkFBUyxFQUFFLENBQUMsNkJBQTZCLEVBQUUsMEJBQTBCLEVBQUUseUJBQXlCLENBQUMsRUFDbkcsQ0FBQzs7Ozs7QUFJRixhQUFPLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7OztBQUl2QixVQUFJLFFBQVEsR0FBRztBQUNaO0FBQ0csYUFBSSxFQUFFLFdBQVc7QUFDakIsbUJBQVUsRUFBRSxDQUFFLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBRSxFQUNsRDs7QUFDRDtBQUNHLGFBQUksRUFBRSxZQUFZO0FBQ2xCLG1CQUFVLEVBQUUsQ0FBRSxVQUFVLENBQUUsRUFDNUI7O0FBQ0Q7QUFDRyxhQUFJLEVBQUUsV0FBVztBQUNqQixtQkFBVSxFQUFFLENBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFFLEVBQ3pEOztBQUNEO0FBQ0csYUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBVSxFQUFFLENBQUUsWUFBWSxDQUFFLEVBQzlCOztBQUNEO0FBQ0csYUFBSSxFQUFFLE9BQU87QUFDYixtQkFBVSxFQUFFLENBQUUsWUFB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QVcsQUFBRSxHQUM5Qzs7QUFDRix5Q0FBQyxtQkFBbUIsSUFBQyxRQUFRLEVBQUcsS0FBSyxDQUFDLFFBQVEsQUFBRTtBQUMzQixvQkFBUSxFQUFHLEtBQUssQ0FBQyxRQUFRLEFBQUU7QUFDM0IsNkJBQWlCLEVBQUcsaUJBQWlCLEFBQUUsR0FDMUQ7O0FBQ0YseUNBQUMsbUJBQW1CLElBQUMsZ0JBQWdCLEVBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEFBQUU7QUFDNUMscUJBQVMsRUFBRyxhQUFhLEFBQUUsR0FDOUMsQ0FFQyxDQUNIOzs7OztBQUNKLGNBQUssQ0FBQyxjQUFjLENBQUMsV0FBVztBQUNsQyx5Q0FBQyxnQkFBZ0IsSUFBQyxjQUFjLEVBQUcsS0FBSyxDQUFDLGNBQWMsQUFBRTtBQUN2QyxzQkFBVSxFQUFHLEtBQUssQ0FBQyxVQUFVLEFBQUUsR0FDL0M7O0FBQ0YseUNBQUMsbUJBQW1CLElBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQUFBQztBQUN4RCxrQkFBTSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQUFBQztBQUNoQyx1QkFBVyxFQUFHLGVBQWUsQUFBRTtBQUMvQiw4QkFBa0IsRUFBRyxLQUFLLENBQUMsa0JBQWtCLEFBQUUsR0FDbEUsQ0FDQyxDQUNSLENBQUMsQ0FDSjs7Ozs7Ozs7QUFJRCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNLEVBQ3hCLENBQUMsQ0FDSjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUU7QUFDN0QsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJldmVudHMtZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCByZWFjdFJlbmRlciwgZmxvd1NlcnZpY2UgKSB7XG4gICAndXNlIHN0cmljdCc7XG5cblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBzZXR0aW5nR3JvdXBzID0gWyAncGF0dGVybnMnLCAnaW50ZXJhY3Rpb25zJywgJ3NvdXJjZXMnIF07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGxldCBwYXR0ZXJuVG9waWNzID0ge1xuICAgICAgUkVTT1VSQ0U6IFsnZGlkUmVwbGFjZScsICdkaWRVcGRhdGUnXSxcbiAgICAgIEFDVElPTjogWyd0YWtlQWN0aW9uUmVxdWVzdCcsICd3aWxsVGFrZUFjdGlvbicsICdkaWRUYWtlQWN0aW9uJ10sXG4gICAgICBGTEFHOiBbJ2RpZENoYW5nZUZsYWcnXSxcbiAgICAgIENPTlRBSU5FUjogWydjaGFuZ2VBcmVhVmlzaWJpbGl0eVJlcXVlc3QnLCAnd2lsbENoYW5nZUFyZWFWaXNpYmlsaXR5JywgJ2RpZENoYW5nZUFyZWFWaXNpYmlsaXR5J11cbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNvbnRleHQucmVzb3VyY2VzID0ge307XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGxldCBwYXR0ZXJucyA9IFtcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICdsaWZlY3ljbGUnLFxuICAgICAgICAgZXZlbnRUeXBlczogWyAnZW5kTGlmZWN5Y2xlJywgJ2JlZ2luTGlmZWN5Y2xlJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ25hdmlnYXRpb24nLFxuICAgICAgICAgZXZlbnRUeXBlczogWyAnbmF2aWdhdGUnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAncmVzb3VyY2VzJyxcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ3JlcGxhY2UnLCAndXBkYXRlJywgJ3ZhbGlkYXRlJywgJ3NhdmUnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnYWN0aW9ucycsXG4gICAgICAgICBldmVudFR5cGVzOiBbICd0YWtlQWN0aW9uJyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ2ZsYWdzJyxcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2NoYW5nZUZsYWcnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnaTE4bicsXG4gICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VMb2NhbGUnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAndmlzaWJpbGl0eScsXG4gICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdjaGFuZ2VXaWRnZXRWaXNpYmlsaXR5JyBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgbmFtZTogJ290aGVyJyxcbiAgICAgICAgIGV2ZW50VHlwZXM6IFtdXG4gICAgICB9XG4gICBdO1xuXG4gICBsZXQgc2V0dGluZ3MgPSBzZXREZWZhdWx0cygge1xuICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICBwYXR0ZXJuczoge30sXG4gICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgIH0sXG4gICAgICBzb3VyY2VzOiB7XG4gICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgfVxuICAgfSwgcGF0dGVybnMgKTtcblxuICAgbGV0IG1vZGVsID0ge1xuICAgICAgcGF0dGVybnM6IHBhdHRlcm5zLFxuICAgICAgaW5kZXg6IDAsXG4gICAgICBldmVudEluZm9zOiBbXSxcbiAgICAgIHZpc2libGVFdmVudEluZm9zOiBbXSxcbiAgICAgIHByb2JsZW1TdW1tYXJ5OiB7XG4gICAgICAgICBjb3VudDogMCxcbiAgICAgICAgIGV2ZW50SW5mb3M6IFtdXG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uRXZlbnRJbmZvOiBudWxsLFxuICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICB9O1xuXG4gICBheFBhdHRlcm5zLnJlc291cmNlcy5oYW5kbGVyRm9yKCBjb250ZXh0ICkucmVnaXN0ZXJSZXNvdXJjZUZyb21GZWF0dXJlKCAnZmlsdGVyJywge1xuICAgICAgb25VcGRhdGVSZXBsYWNlOiAoKSA9PiB7IHJ1bkZpbHRlcnMoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBpc09wdGlvbmFsOiB0cnVlXG4gICB9ICk7XG5cbiAgIGlmKCBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5zdHJlYW0gKSB7XG4gICAgICBjb250ZXh0LmV2ZW50QnVzLnN1YnNjcmliZSggJ2RpZFByb2R1Y2UuJyArIGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSwgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIGV2ZW50LmRhdGEgKSAmJiBldmVudC5kYXRhLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEuZm9yRWFjaCggYWRkRXZlbnQgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWRkRXZlbnQoIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgICAgIHJlbmRlcigpO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzZXREZWZhdWx0cyggc2V0dGluZ3MsIHBhdHRlcm5zICkge1xuICAgICAgc2V0dGluZ0dyb3Vwcy5mb3JFYWNoKCBmdW5jdGlvbiggZ3JvdXBOYW1lICkge1xuICAgICAgICAgbGV0IGdyb3VwID0gc2V0dGluZ3NbIGdyb3VwTmFtZSBdO1xuICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xuICAgICAgICAgICAgICAgZ3JvdXBbIG5hbWUgXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgICBwYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybkluZm8gKSB7XG4gICAgICAgICBzZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybkluZm8ubmFtZSBdID0gdHJ1ZTtcbiAgICAgIH0gKTtcbiAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVQYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgIHNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuIF0gPSBmYWxzZTtcbiAgICAgIH0gKTtcbiAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVTb3VyY2VzLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgc2V0dGluZ3Muc291cmNlc1sgcGF0dGVybiBdID0gZmFsc2U7XG4gICAgICB9ICk7XG4gICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgc2V0dGluZ3MuaW50ZXJhY3Rpb25zWyBwYXR0ZXJuIF0gPSBmYWxzZTtcbiAgICAgIH0gKTtcbiAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gYWRkRXZlbnQoIGV2ZW50SW5mbyApIHtcbiAgICAgIGxldCBjb21wbGV0ZUV2ZW50SW5mbyA9IHtcbiAgICAgICAgIGluZGV4OiArK21vZGVsLmluZGV4LFxuICAgICAgICAgaW50ZXJhY3Rpb246IGV2ZW50SW5mby5hY3Rpb24sXG4gICAgICAgICBjeWNsZUlkOiBldmVudEluZm8uY3ljbGVJZCA+IC0xID8gZXZlbnRJbmZvLmN5Y2xlSWQgOiAnLScsXG4gICAgICAgICBldmVudE9iamVjdDogZXZlbnRJbmZvLmV2ZW50T2JqZWN0IHx8IHt9LFxuICAgICAgICAgZm9ybWF0dGVkRXZlbnQ6IEpTT04uc3RyaW5naWZ5KCBldmVudEluZm8uZXZlbnRPYmplY3QsIG51bGwsIDMgKSxcbiAgICAgICAgIGZvcm1hdHRlZFRpbWU6IHtcbiAgICAgICAgICAgIHVwcGVyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnSEg6bW0nICksXG4gICAgICAgICAgICBsb3dlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ3NzLlNTUycgKVxuICAgICAgICAgfSxcbiAgICAgICAgIG5hbWU6IGV2ZW50SW5mby5ldmVudCB8fCAnPycsXG4gICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuKCAoZXZlbnRJbmZvLmV2ZW50IHx8ICc/JykudG9Mb3dlckNhc2UoKSApLFxuICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlLFxuICAgICAgICAgc291cmNlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkucmVwbGFjZSggL153aWRnZXRcXC4vLCAnJyApLFxuICAgICAgICAgdGFyZ2V0OiAoIGV2ZW50SW5mby50YXJnZXQgfHwgJz8nICkucmVwbGFjZSggL14tJC8sICcnICksXG4gICAgICAgICB0aW1lOiBldmVudEluZm8udGltZSxcbiAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZVR5cGU6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5pbmRleE9mKCAnd2lkZ2V0LicgKSA9PT0gMCA/ICd3aWRnZXRzJyA6ICdydW50aW1lJyxcbiAgICAgICAgIHByb2JsZW1zOiB0cmFja2VyLnRyYWNrKCBldmVudEluZm8gKVxuICAgICAgfTtcblxuICAgICAgbW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggPiBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgbGV0IHJlbW92ZWRJbmZvID0gbW9kZWwuZXZlbnRJbmZvcy5wb3AoKTtcbiAgICAgICAgIGlmKCByZW1vdmVkSW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGF0dGVybiggZXZlbnROYW1lICkge1xuICAgICAgICAgbGV0IG1hdGNoaW5nUGF0dGhlcm4gPSBtb2RlbC5wYXR0ZXJucy5maWx0ZXIoIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4uZXZlbnRUeXBlcy5zb21lKCBmdW5jdGlvbiggZXZlbnRUeXBlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5pbmRleE9mKCBldmVudFR5cGUudG9Mb3dlckNhc2UoKSApICE9PSAtMTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJldHVybiBtYXRjaGluZ1BhdHRoZXJuLmxlbmd0aCA/IG1hdGNoaW5nUGF0dGhlcm5bMF0ubmFtZSA6ICdvdGhlcic7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJ1bkZpbHRlcnMoKSB7XG4gICAgICBsZXQgc2V0dGluZ3MgPSBtb2RlbC5zZXR0aW5ncztcbiAgICAgIGxldCBudW1WaXNpYmxlID0gMDtcblxuICAgICAgbGV0IHNlYXJjaFJlZ0V4cCA9IG51bGw7XG4gICAgICBpZiggc2V0dGluZ3MubmFtZVBhdHRlcm4gKSB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2VhcmNoUmVnRXhwID0gbmV3IFJlZ0V4cCggc2V0dGluZ3MubmFtZVBhdHRlcm4sICdnaScgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGNhdGNoKCBlICkgeyAvKiBpZ25vcmUgaW52YWxpZCBzZWFyY2ggcGF0dGVybiAqLyB9XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGV2ZW50SW5mby5pbnRlcmFjdGlvbiBdICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5wYXR0ZXJuc1sgZXZlbnRJbmZvLnBhdHRlcm4gXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3Muc291cmNlc1sgZXZlbnRJbmZvLnNvdXJjZVR5cGUgXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gZmlsdGVyQnlTZWFyY2goIGV2ZW50ICkge1xuICAgICAgc2V0dGluZ3MubmFtZVBhdHRlcm4gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbGltaXRFdmVudHMoIGV2ZW50ICkge1xuICAgICAgaWYoIGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gJycgKSB7XG4gICAgICAgICBzZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoIGV2ZW50LnRhcmdldC52YWx1ZSApO1xuICAgICAgaWYoICFOdW1iZXIuaXNJbnRlZ2VyKCB2YWx1ZSApICkgeyByZXR1cm47IH1cbiAgICAgIGlmKCB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDUwMDAgKSB7XG4gICAgICAgICBzZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9XG4gICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCkge1xuICAgICAgbGV0IGV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGluZm8gKSB7XG4gICAgICAgICByZXR1cm4gaW5mby5wcm9ibGVtcy5sZW5ndGggPiAwO1xuICAgICAgfSApO1xuXG4gICAgICBtb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbZXZlbnRJbmZvLm5hbWUsIGV2ZW50SW5mby5zb3VyY2UsIGV2ZW50SW5mby50YXJnZXRdXG4gICAgICAgICAgICAuc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBzZWFyY2hSZWdFeHAudGVzdCggZmllbGQgKTtcbiAgICAgICAgICAgICAgIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgcmV0dXJuICEhbWF0Y2hlcztcbiAgICAgICAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmZpbHRlciApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZmlsdGVyVG9waWNzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB8fCBbXTtcbiAgICAgIGxldCBmaWx0ZXJQYXJ0aWNpcGFudHMgPSBjb250ZXh0LnJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzIHx8IFtdO1xuICAgICAgaWYoICFmaWx0ZXJUb3BpY3MubGVuZ3RoICYmICFmaWx0ZXJQYXJ0aWNpcGFudHMubGVuZ3RoICkge1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXRjaGVzVG9waWNGaWx0ZXIgPSBmaWx0ZXJUb3BpY3NcbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICAgICAgICAgIGxldCBwcmVmaXhlcyA9IHBhdHRlcm5Ub3BpY3NbaXRlbS5wYXR0ZXJuXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbJ3RhcmdldCcsICdzb3VyY2UnXS5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBldmVudEluZm9bZmllbGRdO1xuICAgICAgICAgcmV0dXJuIGZpbHRlclBhcnRpY2lwYW50c1xuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24oIF8gKSB7IHJldHVybiBfLnBhcnRpY2lwYW50OyB9IClcbiAgICAgICAgICAgIC5zb21lKCBpc1N1ZmZpeE9mKCB2YWx1ZSApICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHJldHVybiBtYXRjaGVzVG9waWNGaWx0ZXIgfHwgbWF0Y2hlc1BhcnRpY2lwYW50c0ZpbHRlcjtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaXNTdWZmaXhPZiggdmFsdWUgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF8gKSB7XG4gICAgICAgICAgICBsZXQgdGFpbCA9ICcjJyArIF87XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IHRhaWwubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoIHRhaWwgKSA9PT0gdmFsdWUubGVuZ3RoIC0gdGFpbC5sZW5ndGg7XG4gICAgICAgICB9O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBvblNldHRpbmdzQ2hhbmdlZCggdHlwZSwgZ3JvdXAsIG5hbWUsIHN0YXRlICkge1xuICAgICAgbGV0IHNldHRpbmdzID0gbW9kZWwuc2V0dGluZ3M7XG4gICAgICBjb25zdCBwYXR0ZXJucyA9IG1vZGVsLnBhdHRlcm5zO1xuICAgICAgc3dpdGNoKCB0eXBlICkge1xuICAgICAgICAgY2FzZSAnT05FJzpcbiAgICAgICAgICAgIHNldHRpbmdzWyBncm91cCBdWyBuYW1lIF0gPSAhc3RhdGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ09OJzpcbiAgICAgICAgICAgIGNoYW5nZUFsbCggdHJ1ZSApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdPRkYnOlxuICAgICAgICAgICAgY2hhbmdlQWxsKCBmYWxzZSApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdERUZBVUxUUyc6XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNldERlZmF1bHRzKCBzZXR0aW5ncywgcGF0dGVybnMgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBydW5GaWx0ZXJzKCk7XG5cbiAgICAgIHJlbmRlcigpO1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBjaGFuZ2VBbGwoIGVuYWJsZSApIHtcbiAgICAgICAgIFsgJ3BhdHRlcm5zJywgJ2ludGVyYWN0aW9ucycsICdzb3VyY2VzJyBdLmZvckVhY2goICggX2dyb3VwICkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNldHRpbmdzWyBfZ3JvdXAgXSApLmZvckVhY2goICggX25hbWUgKSA9PiB7XG4gICAgICAgICAgICAgICBzZXR0aW5nc1sgX2dyb3VwIF1bIF9uYW1lIF0gPSBlbmFibGU7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICB9ICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGNsZWFyRmlsdGVycygpIHtcbiAgICAgIG1vZGVsLnNldHRpbmdzLm5hbWVQYXR0ZXJuID0gJyc7XG4gICAgICBtb2RlbC5zZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgPSBudWxsO1xuICAgICAgb25TZXR0aW5nc0NoYW5nZWQoICdPTicgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gZGlzY2FyZEV2ZW50cygpIHtcbiAgICAgIG1vZGVsLmV2ZW50SW5mb3MgPSBbXTtcbiAgICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IG51bGw7XG4gICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBoYW5kbGVTZWxlY3Rpb24oIHNlbGVjdGVkRXZlbnQgKSB7XG4gICAgICBpZiggc2VsZWN0ZWRFdmVudC5zZWxlY3RlZCApIHtcbiAgICAgICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IG51bGw7XG4gICAgICAgICBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5mb3JFYWNoKCAoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5mb3JFYWNoKCAoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgaWYoIGV2ZW50LmluZGV4ID09PSBzZWxlY3RlZEV2ZW50LmluZGV4ICkge1xuICAgICAgICAgICAgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG4gICAgICAgICBldmVudC5zZWxlY3RlZCA9IGluU2VsZWN0aW9uKCBldmVudCwgc2VsZWN0ZWRFdmVudCApO1xuICAgICAgfSApO1xuXG4gICAgICByZW5kZXIoKTtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgUGF0dGVybnNIdG1sSWNvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgICAgICBzd2l0Y2goIHByb3BzLm5hbWUgKSB7XG4gICAgICAgICAgICBjYXNlICdsaWZlY3ljbGUnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtcmVjeWNsZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25hdmlnYXRpb24nOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtbG9jYXRpb24tYXJyb3cnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZXNvdXJjZXMnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZmlsZS10ZXh0LW8nO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhY3Rpb25zJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJvY2tldCc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZsYWdzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZsYWcnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpMThuJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWdsb2JlJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmlzaWJpbGl0eSc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1leWUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnJztcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17dGhpcy5pY29uQ2xhc3N9Lz5cbiAgICAgICAgICk7XG5cbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgTnVtYmVyT2ZFdmVudHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGlmKCB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzID09PSAwICApIHtcbiAgICAgICAgICAgIHJldHVybihcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPkVtcHR5IEV2ZW50cyBMaXN0PC9oND5cbiAgICAgICAgICAgICAgIDxwPjxpIGNsYXNzTmFtZT1cImZhIGZhLWNsb2NrLW9cIiAvPiBXYWl0aW5nIGZvciBldmVudHMgZnJvbSBob3N0IGFwcGxpY2F0aW9uLi4uPC9wPlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiggdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyA+IDAgJiYgdGhpcy5wcm9wcy5udW1iZXJPZlZpc2libGVFdmVudHMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybihcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPjAveyB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzIH0gRXZlbnQgSXRlbXM8L2g0PlxuICAgICAgICAgICAgICAgICAgPHA+Tm8gZXZlbnRzIG1hdGNoaW5nIGN1cnJlbnQgZmlsdGVycy48L3A+XG4gICAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmNsZWFyRmlsdGVyc30+U2hvdyBBbGxcbiAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMubnVtYmVyT2ZWaXNpYmxlRXZlbnRzIH0veyB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzIH0gRXZlbnRzXG4gICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEZpbHRlcnNBbmRMaW1pdEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbVwiPlxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnNlYXJjaFJlZ0V4cCB9XG4gICAgICAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ3NlYXJjaCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5GaWx0ZXJzOjwvc21hbGw+XG4gICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggKFJlZ0V4cClcIlxuICAgICAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ3NlYXJjaCdcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMucHJvcHMuc2VhcmNoUmVnRXhwIH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMucHJvcHMuZmlsdGVyQnlTZWFyY2ggfSAvPlxuICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidsaW1pdCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ2xpbWl0J1wiXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAtNTAwMFwiXG4gICAgICAgICAgICAgICAgICBtYXhMZW5ndGg9eyA0IH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy5wcm9wcy5saW1pdCB9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMucHJvcHMubGltaXRFdmVudHMgfVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2V0dGluZ3NUb2dnbGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ09ORScsIHRoaXMucHJvcHMudHlwZSwgdGhpcy5wcm9wcy50ZXh0LCB0aGlzLnByb3BzLmVuYWJsZWQgKTtcbiAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IHRvZ2dsZUNsYXNzTmFtZXMgPSAnZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZScgKyAoXG4gICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuYWJsZWQ/ICcgZmEtdG9nZ2xlLW9uJyA6ICcgZmEtdG9nZ2xlLW9mZicgKTtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PnsgdGhpcy5wcm9wcy5pY29uICYmXG4gICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJheC1ldmVudC1wYXR0ZXJuXCI+PFBhdHRlcm5zSHRtbEljb24gbmFtZT17IHRoaXMucHJvcHMudGV4dCB9Lz48L3NwYW4+fVxuICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnRleHQgfSA8aSBjbGFzc05hbWU9eyB0b2dnbGVDbGFzc05hbWVzIH0gLz48L2J1dHRvbj5cblxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2VsZWN0RmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuc3RhdGUgPSB7IHNob3dQYXR0ZXJuczogZmFsc2UgfTtcbiAgICAgICAgIHRoaXMuYWxsT25DbGljayA9IHRoaXMuYWxsT25DbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB0aGlzLmFsbE9mZkNsaWNrID0gdGhpcy5hbGxPZmZDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB0aGlzLmRlZmF1bHRzQ2xpY2sgPSB0aGlzLmRlZmF1bHRzQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICBhbGxPbkNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ09OJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgYWxsT2ZmQ2xpY2soIGUgKSB7XG4gICAgICAgICB0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkKCAnT0ZGJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuXG4gICAgICBkZWZhdWx0c0NsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ0RFRkFVTFRTJyApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgY29uc3QgaGFuZGxlTW91c2VFbnRlciA9ICgpID0+IHRoaXMuc2V0U3RhdGUoIHsgc2hvd1BhdHRlcm5zIDogdHJ1ZSB9ICk7XG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSggeyBzaG93UGF0dGVybnMgOiBmYWxzZSB9ICk7XG5cbiAgICAgICAgIGNvbnN0IHBhdHRlcm5zQnV0dG9ucyA9IHRoaXMucHJvcHMucGF0dGVybnMubWFwKCBwYXR0ZXJuID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8U2V0dGluZ3NUb2dnbGVCdXR0b24ga2V5PXsgcGF0dGVybi5uYW1lIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGF0dGVybnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBwYXR0ZXJuLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb249eyB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXt0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgLz4gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25zQnV0dG9ucyA9IE9iamVjdC5rZXlzKCB0aGlzLnByb3BzLnNldHRpbmdzLmludGVyYWN0aW9ucyApLm1hcCggaW50ZXJhY3Rpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBpbnRlcmFjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImludGVyYWN0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17IGludGVyYWN0aW9uIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGludGVyYWN0aW9uIF0gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXt0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgICAgLz4gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgY29uc3Qgc291cmNlQnV0dG9ucyA9IE9iamVjdC5rZXlzKCB0aGlzLnByb3BzLnNldHRpbmdzLnNvdXJjZXMgKS5tYXAoIHNvdXJjZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPFNldHRpbmdzVG9nZ2xlQnV0dG9uIGtleT17IHNvdXJjZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInNvdXJjZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBzb3VyY2UgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ9eyB0aGlzLnByb3BzLnNldHRpbmdzLnNvdXJjZXNbIHNvdXJjZSBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIGNvbnN0IGNvbW1hbmRCYXIgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmFsbE9uQ2xpY2sgfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgID5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmFsbE9mZkNsaWNrIH1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICA+QWxsIE9mZjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17IHRoaXMuZGVmYXVsdHNDbGljayB9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4teHNcIlxuICAgICAgICAgICAgICAgPkRlZmF1bHRzPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG5cbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IHRoaXMuc3RhdGUuc2hvd1BhdHRlcm5zID8gJ2J0bi1ncm91cCBidG4tZ3JvdXAtc20gb3Blbic6ICdidG4tZ3JvdXAgYnRuLWdyb3VwLXNtJyB9XG4gICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17IGhhbmRsZU1vdXNlRW50ZXIgfVxuICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyBoYW5kbGVNb3VzZUxlYXZlIH0+XG4gICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9eyB2aWV3LnNob3dQYXR0ZXJucyB9PlxuICAgICAgICAgICAgICAgICAgTW9yZSA8c3BhbiBjbGFzc05hbWU9XCJjYXJldFwiIC8+XG4gICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudSBjb250YWluZXIgY29sLWxnLTZcIiByb2xlPVwibWVudVwiPlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5QYXR0ZXJuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PnsgcGF0dGVybnNCdXR0b25zIH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDQ+SW50ZXJhY3Rpb25zPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+eyBpbnRlcmFjdGlvbnNCdXR0b25zIH08L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQ+U291cmNlczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pnsgc291cmNlQnV0dG9ucyB9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBmaXJzdFwiPiZuYnNwOzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbW1hbmRCYXJ9XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgRGlzY2FyZEV2ZW50c0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgdGhpcy5wcm9wcy5vbkRpc2NhcmQoKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSAnYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSc7XG5cbiAgICAgICAgIGlmKCB0aGlzLnByb3BzLmV2ZW50SW5mb3NMZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcyArICcgYXgtZGlzYWJsZWQnXG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9eyBjbGFzc05hbWVzIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+RGlzY2FyZCBFdmVudHM8L2J1dHRvbj5cbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCk7XG4gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICByZXR1cm4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi1saW5rIGJ0bi1pbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPXsgdGhpcy5wcm9wcy5zaG93RGV0YWlscyA/IFwiZmEgZmEtbWludXMtc3F1YXJlXCIgOiBcImZhIGZhLXBsdXMtc3F1YXJlXCIgfT4mbmJzcDs8L2k+XG4gICAgICAgICA8L2J1dHRvbj47XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEV2ZW50Q2VsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgbGV0IHNwbGl0UG9pbnQgPSB0aGlzLnByb3BzLmNvbnRlbnQuaW5kZXhPZiggdGhpcy5wcm9wcy5zZXBhcmF0b3IgICk7XG4gICAgICAgICBpZiggc3BsaXRQb2ludCA9PT0gLTEgKSB7XG4gICAgICAgICAgICByZXR1cm4gPHRkPjxzcGFuPnsgdGhpcy5wcm9wcy5jb250ZW50IH08L3NwYW4+PC90ZD47XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gKCA8dGQ+XG4gICAgICAgICAgICA8c3Bhbj57IHRoaXMucHJvcHMuY29udGVudC5zdWJzdHJpbmcoIDAsIHNwbGl0UG9pbnQgKSB9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgPHNwYW4+eyB0aGlzLnByb3BzLmNvbnRlbnQuc3Vic3RyaW5nKCBzcGxpdFBvaW50ICsgMSwgdGhpcy5wcm9wcy5jb250ZW50Lmxlbmd0aCApIH08L3NwYW4+XG4gICAgICAgICA8L3RkPiApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEV2ZW50Qm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzaG93RGV0YWlsczogZmFsc2VcbiAgICAgICAgIH07XG4gICAgICAgICB0aGlzLmhhbmRsZU5hbWUgPSB0aGlzLmhhbmRsZU5hbWUuYmluZCggdGhpcyApO1xuICAgICAgICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVOYW1lKCkge1xuICAgICAgICAgdGhpcy5zZXRTdGF0ZSgge3Nob3dEZXRhaWxzOiAhdGhpcy5zdGF0ZS5zaG93RGV0YWlsc30gKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0aW9uKCB0aGlzLnByb3BzLmV2ZW50ICk7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IGNzc0NsYXNzTmFtZSA9ICdheC1ldmVudC1wYXR0ZXJuLScgKyB0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyBheC1ldmVudC1pbnRlcmFjdGlvbi0nICsgdGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHRoaXMucHJvcHMuZXZlbnQuc2VsZWN0ZWQgPyAnIGF4LWV2ZW50LXNlbGVjdGVkJyA6ICcnICkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zLmxlbmd0aCA/ICcgYXgtZXZlbnQtaGFzLXByb2JsZW1zJyA6ICcnICk7XG4gICAgICAgICBjb25zdCBldmVudFN1bW1hcnlSb3cgPSAoXG4gICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc3VtbWFyeVwiPlxuICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1wYXR0ZXJuLWljb25cIlxuICAgICAgICAgICAgICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm59PjxQYXR0ZXJuc0h0bWxJY29uIG5hbWU9e3RoaXMucHJvcHMuZXZlbnQucGF0dGVybn0vPlxuICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtaW50ZXJhY3Rpb25cIj57dGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1wYXlsb2FkLWljb25cIj5cbiAgICAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5ldmVudC5pbnRlcmFjdGlvbiA9PSAncHVibGlzaCcgJiZcbiAgICAgICAgICAgICAgICAgICAgPFNob3dEZXRhaWxzQnV0dG9uIHNob3dEZXRhaWxzPXt0aGlzLnN0YXRlLnNob3dEZXRhaWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25OYW1lQ2hhbmdlZD17dGhpcy5oYW5kbGVOYW1lfS8+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50Lm5hbWV9IHNlcGFyYXRvcj1cIi5cIiAvPlxuICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50LnNvdXJjZX0gc2VwYXJhdG9yPVwiI1wiIC8+XG4gICAgICAgICAgICAgICA8RXZlbnRDZWxsIGNvbnRlbnQ9e3RoaXMucHJvcHMuZXZlbnQudGFyZ2V0fSBzZXBhcmF0b3I9XCIjXCIgLz5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtY3ljbGUgdGV4dC1yaWdodFwiPnt0aGlzLnByb3BzLmV2ZW50LmN5Y2xlSWR9PC90ZD5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+PHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS51cHBlcn08L3NwYW4+PGJyIC8+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5wcm9wcy5ldmVudC5mb3JtYXR0ZWRUaW1lLmxvd2VyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgKTtcblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgZnVuY3Rpb24gZGV0YWlsc1Jvdyggc2hvdywgZm9ybWF0dGVkRXZlbnQgKSB7XG4gICAgICAgICAgICBpZiggIXNob3cgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gPHRyIC8+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuKCA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCIgLz5cbiAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgPHByZT57Zm9ybWF0dGVkRXZlbnR9PC9wcmU+XG4gICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgPC90cj4gKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgZnVuY3Rpb24gZXZlbnRQcm9ibGVtcyggcHJvYmxlbXMgKSB7XG4gICAgICAgICAgICBpZiggcHJvYmxlbXMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxpc3RPZlByb2JsZW1zID0gcHJvYmxlbXMubWFwKCAoIHByb2JsZW0gKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn0gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiIC8+IHtwcm9ibGVtLmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtsaXN0T2ZQcm9ibGVtc31cbiAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPXsgY3NzQ2xhc3NOYW1lIH1cbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgIHsgZXZlbnRTdW1tYXJ5Um93IH1cbiAgICAgICAgICAgIHsgZXZlbnRQcm9ibGVtcyggdGhpcy5wcm9wcy5ldmVudC5wcm9ibGVtcyApIH1cbiAgICAgICAgICAgIHsgZGV0YWlsc1JvdyggdGhpcy5zdGF0ZS5zaG93RGV0YWlscywgdGhpcy5wcm9wcy5ldmVudC5mb3JtYXR0ZWRFdmVudCApIH1cbiAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBFdmVudExpc3RUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgY29uc3QgZXZlbnRzID0gdGhpcy5wcm9wcy5ldmVudHMubWFwKCBldmVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPEV2ZW50Qm9keSBldmVudD17ZXZlbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17ZXZlbnQuaW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQYXR0ZXJuc0J5TmFtZT17dmlldy5wYXR0ZXJuc0J5TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uRXZlbnRJbmZvPXt0aGlzLnByb3BzLnNlbGVjdGlvbkV2ZW50SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb249e3RoaXMucHJvcHMub25TZWxlY3Rpb259XG4gICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtaW50ZXJhY3Rpb25cIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1wYXlsb2FkLWljb25cIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1uYW1lXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtc291cmNlXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGFyZ2V0XCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtY3ljbGVcIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC10aW1lc3RhbXBcIi8+XG4gICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxuICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRoPiZuYnNwOzwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPkV2ZW50IE5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlNvdXJjZTwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+VGFyZ2V0PC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+Q3ljbGU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5UaW1lPGkgY2xhc3NOYW1lPVwiZmEgZmEtbG9uZy1hcnJvdy11cFwiLz48L3RoPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICB7ZXZlbnRzfVxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFByb2JsZW1MaXN0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IGV2ZW50TGlzdCA9IHRoaXMucHJvcHMucHJvYmxlbVN1bW1hcnkuZXZlbnRJbmZvcy5tYXAoIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2JsZW1MaXN0ID0gZXZlbnQucHJvYmxlbXMubWFwKCBmdW5jdGlvbiggcHJvYmxlbSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGkga2V5PXsgcHJvYmxlbS5kZXNjcmlwdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZyBheC1lcnJvclwiIC8+e3Byb2JsZW0uZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8bGkgIGtleT17ZXZlbnQuaW5kZXh9ID5cbiAgICAgICAgICAgICAgICAgIDxoNT48c3Ryb25nPnsgZXZlbnQubmFtZSB9PC9zdHJvbmc+IDxlbT4oc291cmNlOiB7IGV2ZW50LnNvdXJjZSB9KTwvZW0+PC9oNT5cbiAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgIHtwcm9ibGVtTGlzdH1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeSBheC1lcnJvclwiPnsgdGhpcy5wcm9wcy5wcm9ibGVtU3VtbWFyeS5ldmVudEluZm9zLmxlbmd0aCB9L3sgdGhpcy5wcm9wcy5ldmVudEluZm9zLmxlbmd0aCB9IEV2ZW50cyB3aXRoIFByb2JsZW1zPC9oND5cbiAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgIHtldmVudExpc3R9XG4gICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbXMtZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICAgICAgICAgIEV2ZW50cyB3aXRoIHByb2JsZW1zIGFyZSBtYXJrZWQgPHN0cm9uZyBjbGFzc05hbWU9XCJheC1lcnJvclwiPnJlZDwvc3Ryb25nPiBpbiB0aGUgZXZlbnRzIHRhYmxlLlxuICAgICAgICAgICAgICAgICAgRmlsdGVyIGJ5IGV2ZW50L3NvdXJjZSBhcyBuZWVkZWQuXG4gICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgRXZlbnREaXNwbGF5RWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgaWYoIHRoaXMucHJvcHMudmlzaWJsZUV2ZW50SW5mb3NMZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdj48L2Rpdj47XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEV2ZW50TGlzdFRhYmxlIHNlbGVjdGlvbkV2ZW50SW5mbz17IHRoaXMucHJvcHMuc2VsZWN0aW9uRXZlbnRJbmZvIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17IHRoaXMucHJvcHMub25TZWxlY3Rpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1hZmZpeC1hcmVhXCJcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXhcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXgtb2Zmc2V0LXRvcD1cIjEwMFwiPlxuICAgICAgICAgICAgICAgPE51bWJlck9mRXZlbnRzIG51bWJlck9mVmlzaWJsZUV2ZW50cz17IG1vZGVsLnZpc2libGVFdmVudEluZm9zLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZFdmVudHM9eyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXJzPXtjbGVhckZpbHRlcnN9XG4gICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1idXR0b24td3JhcHBlciBmb3JtLWlubGluZVwiPlxuICAgICAgICAgICAgICAgICAgPEZpbHRlcnNBbmRMaW1pdEZvcm0gbmFtZT17IHNldHRpbmdzLm5hbWVQYXR0ZXJuIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckJ5U2VhcmNoPXsgZmlsdGVyQnlTZWFyY2ggfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ9eyBzZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXQgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRFdmVudHM9eyBsaW1pdEV2ZW50cyB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEZpbHRlcnNCdXR0b24gcGF0dGVybnM9eyBtb2RlbC5wYXR0ZXJucyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncz17IG1vZGVsLnNldHRpbmdzIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXsgb25TZXR0aW5nc0NoYW5nZWQgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxEaXNjYXJkRXZlbnRzQnV0dG9uIGV2ZW50SW5mb3NMZW5ndGg9eyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRpc2NhcmQ9eyBkaXNjYXJkRXZlbnRzIH1cbiAgICAgICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7IG1vZGVsLnByb2JsZW1TdW1tYXJ5Lmhhc1Byb2JsZW1zICYmXG4gICAgICAgICAgICA8UHJvYmxlbUxpc3RUYWJsZSBwcm9ibGVtU3VtbWFyeT17IG1vZGVsLnByb2JsZW1TdW1tYXJ5IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW5mb3M9eyBtb2RlbC5ldmVudEluZm9zIH1cbiAgICAgICAgICAgIC8+IH1cbiAgICAgICAgICAgIDxFdmVudERpc3BsYXlFbGVtZW50IHZpc2libGVFdmVudEluZm9zTGVuZ3RoPXttb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM9e21vZGVsLnZpc2libGVFdmVudEluZm9zfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb249eyBoYW5kbGVTZWxlY3Rpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uRXZlbnRJbmZvPXsgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIHJldHVybiB7XG4gICAgICBvbkRvbUF2YWlsYWJsZTogcmVuZGVyXG4gICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZXZlbnRzLWRpc3BsYXktd2lkZ2V0JyxcbiAgIGluamVjdGlvbnM6IFsgJ2F4Q29udGV4dCcsICdheFJlYWN0UmVuZGVyJywgJ2F4Rmxvd1NlcnZpY2UnIF0sXG4gICBjcmVhdGVcbn07XG4iXX0=
