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

      var patterns = [
      { 
         name: 'lifecycle', 
         icon: _React['default'].createElement('i', { className: 'fa fa-recycle' }), 
         eventTypes: ['endLifecycle', 'beginLifecycle'] }, 

      { 
         name: 'navigation', 
         icon: _React['default'].createElement('i', { className: 'fa fa-location-arrow' }), 
         eventTypes: ['navigate'] }, 

      { 
         name: 'resources', 
         icon: _React['default'].createElement('i', { className: 'fa fa-file-text-o' }), 
         eventTypes: ['replace', 'update', 'validate', 'save'] }, 

      { 
         name: 'actions', 
         icon: _React['default'].createElement('i', { className: 'fa fa-rocket' }), 
         eventTypes: ['takeAction'] }, 

      { 
         name: 'flags', 
         icon: _React['default'].createElement('i', { className: 'fa fa-flag' }), 
         eventTypes: ['changeFlag'] }, 

      { 
         name: 'i18n', 
         icon: _React['default'].createElement('i', { className: 'fa fa-globe' }), 
         eventTypes: ['changeLocale'] }, 

      { 
         name: 'visibility', 
         icon: _React['default'].createElement('i', { className: 'fa fa-eye' }), 
         eventTypes: ['changeAreaVisibility', 'changeWidgetVisibility'] }, 

      { 
         name: 'other', 
         icon: _React['default'].createElement('i', null), 
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

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      function setDefaults(settings, patterns) {
         settingGroups.forEach(function (groupName) {
            var group = settings[groupName];
            for (var _name2 in group) {
               if (group.hasOwnProperty[_name2]) {
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

         model.settings = settings;

         runFilters();

         render();

         function changeAll(enable) {
            ['patterns', 'interactions', 'sources'].forEach(function (_group) {
               Object.keys(settings[_group]).forEach(function (_name) {
                  settings[_group][_name] = enable;});});}}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function clearFilters() {
         model.settings.namePattern = '';
         model.settings.visibleEventsLimit = null;
         context.commands.setAll(true);}


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function discardEvents() {
         model.eventInfos = [];
         model.selectionEventInfo = null;
         runFilters();
         refreshProblemSummary();
         render();}


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
         _createClass(NumberOfEvents, [{ key: 'render', value: function render() {if (this.props.numberOfEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, 'Empty Events List'), _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...'));}if (this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, '0/', this.props.numberOfEvents, ' Event Items'), _React['default'].createElement('p', null, 'No events matching current filters.'), _React['default'].createElement('p', null, _React['default'].createElement('button', { type: 'button', className: 'btn btn-sm btn-primary', onClick: 'clearFilters' }, 'Show All')));} // TODO: ng-if="model.problemSummary.hasProblems
               return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, this.props.numberOfVisibleEvents, '/', this.props.numberOfEvents, ' Events'));} }]);return NumberOfEvents;})(_React['default'].Component);var FiltersInput = (function (_React$Component3) {_inherits(FiltersInput, _React$Component3);
         function FiltersInput(props) {_classCallCheck(this, FiltersInput);
            _get(Object.getPrototypeOf(FiltersInput.prototype), 'constructor', this).call(this, props);
            this.state = { value: this.props.name };
            this.handleChange = this.handleChange.bind(this);}


















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(FiltersInput, [{ key: 'handleChange', value: function handleChange(event) {this.setState({ value: event.target.value });} }, { key: 'render', value: function render() {return _React['default'].createElement('input', { className: 'form-control input-sm', placeholder: 'Search (RegExp)', 'ax-id': '\'search\'', type: 'text', value: this.state.value, onChange: this.handleChange });} }]);return FiltersInput;})(_React['default'].Component);var 
      LimitInput = (function (_React$Component4) {_inherits(LimitInput, _React$Component4);
         function LimitInput(props) {_classCallCheck(this, LimitInput);
            _get(Object.getPrototypeOf(LimitInput.prototype), 'constructor', this).call(this, props);
            this.state = { value: this.props.name };
            this.handleChange = this.handleChange.bind(this);}




























         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(LimitInput, [{ key: 'handleChange', value: function handleChange(event) {if (event.target.value === '') {this.setState({ value: value });}var value = Number(event.target.value);if (!Number.isInteger(value)) {return;}if (value >= 0 && value <= 5000) {this.setState({ value: value });}} }, { key: 'render', value: function render() {return _React['default'].createElement('input', { className: 'form-control input-sm', type: 'text', 'ax-id': '\'limit\'', placeholder: '0-' + this.props.placeholder, maxLength: 4, value: this.state.value, onChange: this.handleChange });} }]);return LimitInput;})(_React['default'].Component);var 
      FiltersAndLimitForm = (function (_React$Component5) {_inherits(FiltersAndLimitForm, _React$Component5);
         function FiltersAndLimitForm(props) {_classCallCheck(this, FiltersAndLimitForm);
            _get(Object.getPrototypeOf(FiltersAndLimitForm.prototype), 'constructor', this).call(this, props);
            this.state = { value: this.props.name };
            this.handleChange = this.handleChange.bind(this);}





























         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(FiltersAndLimitForm, [{ key: 'handleChange', value: function handleChange(event) {this.setState({ value: event.target.value });render();} }, { key: 'render', value: function render() {return _React['default'].createElement('div', { className: 'form-group form-group-sm' }, this.props.searchRegExp, _React['default'].createElement('label', { 'ax-for': '\'search\'' }, _React['default'].createElement('small', null, 'Filters:')), _React['default'].createElement('input', { className: 'form-control input-sm', placeholder: 'Search (RegExp)', 'ax-id': '\'search\'', type: 'text', value: this.props.searchRegExp, onChange: this.handleChange }), _React['default'].createElement('label', { 'ax-for': '\'limit\'' }, _React['default'].createElement('small', null, 'Limit:')), _React['default'].createElement(LimitInput, { placeholder: 5000 }));} }]);return FiltersAndLimitForm;})(_React['default'].Component);var 
      SettingsToggleButton = (function (_React$Component6) {_inherits(SettingsToggleButton, _React$Component6);
         function SettingsToggleButton(props) {_classCallCheck(this, SettingsToggleButton);
            _get(Object.getPrototypeOf(SettingsToggleButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}






















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(SettingsToggleButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onSettingsChanged('ONE', this.props.type, this.props.text, this.props.enabled);e.stopPropagation();} }, { key: 'render', value: function render() {var toggleClassNames = 'fa pull-right ax-event-setting-toggle' + (this.props.enabled ? ' fa-toggle-on' : ' fa-toggle-off');return _React['default'].createElement('button', { type: 'button', className: 'btn btn-link ax-event-setting-toggle', onClick: this.handleClick }, this.props.icon && _React['default'].createElement('span', { className: 'ax-event-pattern' }, this.props.icon), this.props.text, ' ', _React['default'].createElement('i', { className: toggleClassNames }));} }]);return SettingsToggleButton;})(_React['default'].Component);var 
      SelectFiltersButton = (function (_React$Component7) {_inherits(SelectFiltersButton, _React$Component7);
         function SelectFiltersButton(props) {_classCallCheck(this, SelectFiltersButton);
            _get(Object.getPrototypeOf(SelectFiltersButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.state = { showPatterns: false };
            this.allOnClick = this.allOnClick.bind(this);
            this.allOffClick = this.allOffClick.bind(this);
            this.defaultsClick = this.defaultsClick.bind(this);}

















































































































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(SelectFiltersButton, [{ key: 'allOnClick', value: function allOnClick(e) {this.props.onSettingsChanged('ON');e.stopPropagation();} }, { key: 'allOffClick', value: function allOffClick(e) {this.props.onSettingsChanged('OFF');e.stopPropagation();} }, { key: 'defaultsClick', value: function defaultsClick(e) {this.props.onSettingsChanged('DEFAULTS');e.stopPropagation();} }, { key: 'render', value: function render() {var _this = this;console.log(this.props.settings);var handleMouseEnter = function handleMouseEnter() {return _this.setState({ showPatterns: true });};var handleMouseLeave = function handleMouseLeave() {return _this.setState({ showPatterns: false });};var patternsButtons = this.props.patterns.map(function (pattern) {return _React['default'].createElement(SettingsToggleButton, { key: pattern.name, type: 'patterns', text: pattern.name, icon: pattern.icon, enabled: _this.props.settings.patterns[pattern.name], onSettingsChanged: _this.props.onSettingsChanged });});var interactionsButtons = Object.keys(this.props.settings.interactions).map(function (interaction) {return _React['default'].createElement(SettingsToggleButton, { key: interaction, type: 'interactions', text: interaction, enabled: _this.props.settings.interactions[interaction], onSettingsChanged: _this.props.onSettingsChanged });});var sourceButtons = Object.keys(this.props.settings.sources).map(function (source) {return _React['default'].createElement(SettingsToggleButton, { key: source, type: 'sources', text: source, enabled: _this.props.settings.sources[source], onSettingsChanged: _this.props.onSettingsChanged });});var commandBar = _React['default'].createElement('div', { className: 'pull-right' }, _React['default'].createElement('button', { type: 'button', onClick: this.allOnClick, className: 'btn btn-xs btn-primary' }, 'All On'), _React['default'].createElement('button', { type: 'button', onClick: this.allOffClick, className: 'btn btn-xs btn-primary' }, 'All Off'), _React['default'].createElement('button', { type: 'button', onClick: this.defaultsClick, className: 'btn btn-xs' }, 'Defaults'));return _React['default'].createElement('div', { className: this.state.showPatterns ? 'btn-group btn-group-sm open' : 'btn-group btn-group-sm', onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, _React['default'].createElement('button', { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': view.showPatterns }, 'More ', _React['default'].createElement('span', { className: 'caret' })), _React['default'].createElement('div', { className: 'dropdown-menu container col-lg-6', role: 'menu' }, _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, _React['default'].createElement('h4', null, 'Patterns'), _React['default'].createElement('div', null, patternsButtons)), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, _React['default'].createElement('h4', null, 'Interactions'), _React['default'].createElement('div', null, interactionsButtons), _React['default'].createElement('br', null), _React['default'].createElement('h4', null, 'Sources'), _React['default'].createElement('div', null, sourceButtons))), _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, ' '), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, commandBar))));} }]);return SelectFiltersButton;})(_React['default'].Component);var 
      DiscardEventsButton = (function (_React$Component8) {_inherits(DiscardEventsButton, _React$Component8);
         function DiscardEventsButton(props) {_classCallCheck(this, DiscardEventsButton);
            _get(Object.getPrototypeOf(DiscardEventsButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}



















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(DiscardEventsButton, [{ key: 'handleClick', value: function handleClick(e) {e.stopPropagation();this.props.onDiscard();} }, { key: 'render', value: function render() {var classNames = 'btn btn-primary btn-sm';if (this.props.eventInfosLength === 0) {classNames = classNames + ' ax-disabled';}return _React['default'].createElement('button', { className: classNames, type: 'button', onClick: this.handleClick }, 'Discard Events');} }]);return DiscardEventsButton;})(_React['default'].Component);var 
      ShowDetailsButton = (function (_React$Component9) {_inherits(ShowDetailsButton, _React$Component9);
         function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
            _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.handleClick = this.handleClick.bind(this);}
















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onNameChanged();e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('button', { type: 'button', className: 'btn-link btn-info', onClick: this.handleClick }, _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 
      EventCell = (function (_React$Component10) {_inherits(EventCell, _React$Component10);
         function EventCell(props) {_classCallCheck(this, EventCell);
            _get(Object.getPrototypeOf(EventCell.prototype), 'constructor', this).call(this, props);
            this.props = props;}















         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventCell, [{ key: 'render', value: function render() {var splitPoint = this.props.content.indexOf(this.props.separator);if (splitPoint === -1) {return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content));}return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content.substring(0, splitPoint)), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.content.substring(splitPoint + 1, this.props.content.length)));} }]);return EventCell;})(_React['default'].Component);var 
      EventBody = (function (_React$Component11) {_inherits(EventBody, _React$Component11);
         function EventBody(props) {_classCallCheck(this, EventBody);
            _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.state = { 
               showDetails: false };

            this.handleName = this.handleName.bind(this);
            this.handleClick = this.handleClick.bind(this);}





























































































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventBody, [{ key: 'handleName', value: function handleName() {this.setState({ showDetails: !this.state.showDetails });} }, { key: 'handleClick', value: function handleClick(e) {this.props.onSelection(this.props.event);} //////////////////////////////////////////////////////////////////////////////////////////////////
         }, { key: 'render', value: function render() {var cssClassName = 'ax-event-pattern-' + this.props.event.pattern + ' ax-event-interaction-' + this.props.event.interaction + (this.props.selected ? ' ax-event-selected' : '') + (this.props.event.problems.length ? ' ax-event-has-problems' : '');var eventSummaryRow = _React['default'].createElement('tr', { className: 'ax-event-summary' }, _React['default'].createElement('td', { className: 'ax-col-pattern-icon', title: this.props.event.pattern }, _React['default'].createElement(PatternsHtmlIcon, { name: this.props.event.pattern })), _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction), _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, this.props.event.interaction == 'publish' && _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), _React['default'].createElement(EventCell, { content: this.props.event.name, separator: '.' }), _React['default'].createElement(EventCell, { content: this.props.event.source, separator: '#' }), _React['default'].createElement(EventCell, { content: this.props.event.target, separator: '#' }), _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId), _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.event.formattedTime.upper), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.event.formattedTime.lower))); ///////////////////////////////////////////////////////////////////////////////////////////////
               function detailsRow(show, formattedEvent) {if (!show) {return _React['default'].createElement('tr', null);}return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('pre', null, formattedEvent)));} ///////////////////////////////////////////////////////////////////////////////////////////////
               //TODO: Test display of problems
               function eventProblems(problems) {if (problems.length === 0) {return _React['default'].createElement('tr', null);}var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }, problem.description));});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component12) {_inherits(EventListTable, _React$Component12);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}














































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventListTable, [{ key: 'render', value: function render() {var _this2 = this;var events = this.props.events.map(function (event) {return _React['default'].createElement(EventBody, { event: event, key: event.index, viewPatternsByName: view.patternsByName, selectionEventInfo: _this2.props.selectionEventInfo, onSelection: _this2.props.onSelection, selected: event.selected });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
               return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var EventDisplayElement = (function (_React$Component13) {_inherits(EventDisplayElement, _React$Component13);
         function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);
            _get(Object.getPrototypeOf(EventDisplayElement.prototype), 'constructor', this).call(this, props);
            this.props = props;
            this.state = { selectionEventInfo: null };
            this.handleSelection = this.handleSelection.bind(this);}















































         ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         _createClass(EventDisplayElement, [{ key: 'handleSelection', value: function handleSelection(selectedEvent) {var _this3 = this;var selectionEventInfoIndex = this.state.selectionEventInfo && this.state.selectionEventInfo.index;if (selectedEvent.index === selectionEventInfoIndex) {this.setState({ selectionEventInfo: null });this.props.events.forEach(function (event) {event.selected = false;});return;}this.props.events.forEach(function (event) {if (event.index === selectedEvent.index) {_this3.setState({ selectionEventInfo: event });event.selected = true;return;}return inSelection(event, selectedEvent);});function inSelection(eventInfo, selectionEventInfo) {if (!selectionEventInfo) {return false;}return eventInfo === selectionEventInfo || eventInfo.cycleId === selectionEventInfo.cycleId && eventInfo.source === selectionEventInfo.source && eventInfo.name === selectionEventInfo.name;}} }, { key: 'render', value: function render() {if (this.props.visibleEventInfosLength === 0) {return _React['default'].createElement('div', null);}return _React['default'].createElement(EventListTable, { selectionEventInfo: this.state.selectionEventInfo, onSelection: this.handleSelection, events: this.props.events });} }]);return EventDisplayElement;})(_React['default'].Component);
      function render() {
         reactRender(
         _React['default'].createElement('div', null, 
         _React['default'].createElement('div', { className: 'ax-affix-area', 
            'ax-affix': true, 
            'ax-affix-offset-top': '100' }, 
         _React['default'].createElement(NumberOfEvents, { numberOfVisibleEvents: model.visibleEventInfos.length, 
            numberOfEvents: model.eventInfos.length }), 

         _React['default'].createElement('div', { className: 'ax-button-wrapper form-inline' }, 
         _React['default'].createElement(FiltersAndLimitForm, { name: settings.namePattern }), 
         _React['default'].createElement(SelectFiltersButton, { patterns: model.patterns, 
            settings: model.settings, 
            onSettingsChanged: onSettingsChanged }), 

         _React['default'].createElement(DiscardEventsButton, { eventInfosLength: model.eventInfos.length, 
            onDiscard: discardEvents }))), 




         _React['default'].createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length, 
            events: model.visibleEventInfos })));}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7O0FBR2IsVUFBTSxJQUFJLEdBQUc7QUFDVixxQkFBWSxFQUFFLEtBQUssRUFDckIsQ0FBQzs7O0FBRUYsVUFBSSxhQUFhLEdBQUcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDOzs7O0FBSTVELFVBQUksYUFBYSxHQUFHO0FBQ2pCLGlCQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0FBQ3JDLGVBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztBQUNoRSxhQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDdkIsa0JBQVMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLDBCQUEwQixFQUFFLHlCQUF5QixDQUFDLEVBQ25HLENBQUM7Ozs7O0FBSUYsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLFVBQUksUUFBUSxHQUFHO0FBQ1o7QUFDRyxhQUFJLEVBQUUsV0FBVztBQUNqQixhQUFJLEVBQUUsdUNBQUcsU0FBUyxFQUFDLGVBQWUsR0FBRztBQUNyQyxtQkFBVSxFQUFFLENBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFFLEVBQ2xEOztBQUNEO0FBQ0csYUFBSSxFQUFFLFlBQVk7QUFDbEIsYUFBSSxFQUFFLHVDQUFHLFNBQVMsRUFBQyxzQkFBc0IsR0FBRztBQUM1QyxtQkFBVSxFQUFFLENBQUUsVUFBVSxDQUFFLEVBQzVCOztBQUNEO0FBQ0csYUFBSSxFQUFFLFdBQVc7QUFDakIsYUFBSSxFQUFFLHVDQUFHLFNBQVMsRUFBQyxtQkFBbUIsR0FBRztBQUN6QyxtQkFBVSxFQUFFLENBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUs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QkFBaUIsQ0FBQyxNQUFNLEFBQUU7QUFDeEQsMEJBQWMsRUFBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQUFBRSxHQUN4RDs7QUFDRixrREFBSyxTQUFTLEVBQUMsK0JBQStCO0FBQzNDLHlDQUFDLG1CQUFtQixJQUFDLElBQUksRUFBRyxRQUFRLENBQUMsV0FBVyxBQUFFLEdBQUU7QUFDcEQseUNBQUMsbUJBQW1CLElBQUMsUUFBUSxFQUFHLEtBQUssQ0FBQyxRQUFRLEFBQUU7QUFDM0Isb0JBQVEsRUFBRyxLQUFLLENBQUMsUUFBUSxBQUFFO0FBQzNCLDZCQUFpQixFQUFHLGlCQUFpQixBQUFFLEdBQzFEOztBQUNGLHlDQUFDLG1CQUFtQixJQUFDLGdCQUFnQixFQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxBQUFFO0FBQzVDLHFCQUFTLEVBQUcsYUFBYSxBQUFFLEdBQzlDLENBRUMsQ0FDSDs7Ozs7QUFDTix5Q0FBQyxtQkFBbUIsSUFBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxBQUFDO0FBQ3hELGtCQUFNLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixBQUFDLEdBQ25ELENBQ0MsQ0FDUixDQUFDLENBQ0o7Ozs7Ozs7O0FBSUQsYUFBTztBQUNKLHVCQUFjLEVBQUUsTUFBTSxFQUN4QixDQUFDLENBQ0o7Ozs7QUFFYztBQUNaLFVBQUksRUFBRSx1QkFBdUI7QUFDN0IsZ0JBQVUsRUFBRSxDQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFFO0FBQzdELFlBQU0sRUFBTixNQUFNLEVBQ1IiLCJmaWxlIjoiZXZlbnRzLWRpc3BsYXktd2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBhaXhpZ28gQUdcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9sYXhhcmpzLm9yZy9saWNlbnNlXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBheFBhdHRlcm5zIGZyb20gJ2xheGFyLXBhdHRlcm5zJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB0cmFja2VyIGZyb20gJy4vdHJhY2tlcic7XG5cblxuZnVuY3Rpb24gY3JlYXRlKCBjb250ZXh0LCByZWFjdFJlbmRlciwgZmxvd1NlcnZpY2UgKSB7XG4gICAndXNlIHN0cmljdCc7XG5cblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBzZXR0aW5nR3JvdXBzID0gWydwYXR0ZXJucycsICdpbnRlcmFjdGlvbnMnLCAnc291cmNlcyddO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVyblRvcGljcyA9IHtcbiAgICAgIFJFU09VUkNFOiBbJ2RpZFJlcGxhY2UnLCAnZGlkVXBkYXRlJ10sXG4gICAgICBBQ1RJT046IFsndGFrZUFjdGlvblJlcXVlc3QnLCAnd2lsbFRha2VBY3Rpb24nLCAnZGlkVGFrZUFjdGlvbiddLFxuICAgICAgRkxBRzogWydkaWRDaGFuZ2VGbGFnJ10sXG4gICAgICBDT05UQUlORVI6IFsnY2hhbmdlQXJlYVZpc2liaWxpdHlSZXF1ZXN0JywgJ3dpbGxDaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdkaWRDaGFuZ2VBcmVhVmlzaWJpbGl0eSddXG4gICB9O1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjb250ZXh0LnJlc291cmNlcyA9IHt9O1xuXG4gICBsZXQgcGF0dGVybnMgPSBbXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnbGlmZWN5Y2xlJyxcbiAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLXJlY3ljbGVcIiAvPixcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2VuZExpZmVjeWNsZScsICdiZWdpbkxpZmVjeWNsZScgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICduYXZpZ2F0aW9uJyxcbiAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWxvY2F0aW9uLWFycm93XCIgLz4sXG4gICAgICAgICBldmVudFR5cGVzOiBbICduYXZpZ2F0ZScgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICdyZXNvdXJjZXMnLFxuICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtZmlsZS10ZXh0LW9cIiAvPixcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ3JlcGxhY2UnLCAndXBkYXRlJywgJ3ZhbGlkYXRlJywgJ3NhdmUnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnYWN0aW9ucycsXG4gICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1yb2NrZXRcIiAvPixcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ3Rha2VBY3Rpb24nIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnZmxhZ3MnLFxuICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtZmxhZ1wiIC8+LFxuICAgICAgICAgZXZlbnRUeXBlczogWyAnY2hhbmdlRmxhZycgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgIG5hbWU6ICdpMThuJyxcbiAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWdsb2JlXCIgLz4sXG4gICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VMb2NhbGUnIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAndmlzaWJpbGl0eScsXG4gICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1leWVcIiAvPixcbiAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2NoYW5nZUFyZWFWaXNpYmlsaXR5JywgJ2NoYW5nZVdpZGdldFZpc2liaWxpdHknIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICBuYW1lOiAnb3RoZXInLFxuICAgICAgICAgaWNvbjogPGkgLz4sXG4gICAgICAgICBldmVudFR5cGVzOiBbXVxuICAgICAgfVxuICAgXTtcblxuICAgbGV0IHNldHRpbmdzID0gc2V0RGVmYXVsdHMoIHtcbiAgICAgIG5hbWVQYXR0ZXJuOiAnJyxcbiAgICAgIHZpc2libGVFdmVudHNMaW1pdDogMTAwLFxuICAgICAgcGF0dGVybnM6IHt9LFxuICAgICAgaW50ZXJhY3Rpb25zOiB7XG4gICAgICAgICBzdWJzY3JpYmU6IHRydWUsXG4gICAgICAgICBwdWJsaXNoOiB0cnVlLFxuICAgICAgICAgZGVsaXZlcjogdHJ1ZSxcbiAgICAgICAgIHVuc3Vic2NyaWJlOiB0cnVlXG4gICAgICB9LFxuICAgICAgc291cmNlczoge1xuICAgICAgICAgd2lkZ2V0czogdHJ1ZSxcbiAgICAgICAgIHJ1bnRpbWU6IHRydWVcbiAgICAgIH1cbiAgIH0sIHBhdHRlcm5zICk7XG5cbiAgIGxldCBtb2RlbCA9IHtcbiAgICAgIHBhdHRlcm5zOiBwYXR0ZXJucyxcbiAgICAgIGluZGV4OiAwLFxuICAgICAgZXZlbnRJbmZvczogW10sXG4gICAgICB2aXNpYmxlRXZlbnRJbmZvczogW10sXG4gICAgICBwcm9ibGVtU3VtbWFyeToge1xuICAgICAgICAgY291bnQ6IDAsXG4gICAgICAgICBldmVudEluZm9zOiBbXVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvbkV2ZW50SW5mbzogbnVsbCxcbiAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgfTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogKCkgPT4geyBydW5GaWx0ZXJzKCk7IHJlbmRlcigpOyB9LFxuICAgICAgaXNPcHRpb25hbDogdHJ1ZVxuICAgfSApO1xuXG4gICBpZiggY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtICkge1xuICAgICAgY29udGV4dC5ldmVudEJ1cy5zdWJzY3JpYmUoICdkaWRQcm9kdWNlLicgKyBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5zdHJlYW0sIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBldmVudC5kYXRhICkgJiYgZXZlbnQuZGF0YS5sZW5ndGggKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goIGFkZEV2ZW50ICk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBldmVudC5kYXRhICk7XG4gICAgICAgICB9XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gYWRkRXZlbnQoIGV2ZW50SW5mbyApIHtcbiAgICAgIGxldCBjb21wbGV0ZUV2ZW50SW5mbyA9IHtcbiAgICAgICAgIGluZGV4OiArK21vZGVsLmluZGV4LFxuICAgICAgICAgaW50ZXJhY3Rpb246IGV2ZW50SW5mby5hY3Rpb24sXG4gICAgICAgICBjeWNsZUlkOiBldmVudEluZm8uY3ljbGVJZCA+IC0xID8gZXZlbnRJbmZvLmN5Y2xlSWQgOiAnLScsXG4gICAgICAgICBldmVudE9iamVjdDogZXZlbnRJbmZvLmV2ZW50T2JqZWN0IHx8IHt9LFxuICAgICAgICAgZm9ybWF0dGVkRXZlbnQ6IEpTT04uc3RyaW5naWZ5KCBldmVudEluZm8uZXZlbnRPYmplY3QsIG51bGwsIDMgKSxcbiAgICAgICAgIGZvcm1hdHRlZFRpbWU6IHtcbiAgICAgICAgICAgIHVwcGVyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnSEg6bW0nICksXG4gICAgICAgICAgICBsb3dlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ3NzLlNTUycgKVxuICAgICAgICAgfSxcbiAgICAgICAgIG5hbWU6IGV2ZW50SW5mby5ldmVudCB8fCAnPycsXG4gICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuKCAoZXZlbnRJbmZvLmV2ZW50IHx8ICc/JykudG9Mb3dlckNhc2UoKSApLFxuICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlLFxuICAgICAgICAgc291cmNlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkucmVwbGFjZSggL153aWRnZXRcXC4vLCAnJyApLFxuICAgICAgICAgdGFyZ2V0OiAoIGV2ZW50SW5mby50YXJnZXQgfHwgJz8nICkucmVwbGFjZSggL14tJC8sICcnICksXG4gICAgICAgICB0aW1lOiBldmVudEluZm8udGltZSxcbiAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZVR5cGU6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5pbmRleE9mKCAnd2lkZ2V0LicgKSA9PT0gMCA/ICd3aWRnZXRzJyA6ICdydW50aW1lJyxcbiAgICAgICAgIHByb2JsZW1zOiB0cmFja2VyLnRyYWNrKCBldmVudEluZm8gKVxuICAgICAgfTtcblxuICAgICAgbW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggPiBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgbGV0IHJlbW92ZWRJbmZvID0gbW9kZWwuZXZlbnRJbmZvcy5wb3AoKTtcbiAgICAgICAgIGlmKCByZW1vdmVkSW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGF0dGVybiggZXZlbnROYW1lICkge1xuICAgICAgICAgbGV0IG1hdGNoaW5nUGF0dGhlcm4gPSBtb2RlbC5wYXR0ZXJucy5maWx0ZXIoIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4uZXZlbnRUeXBlcy5zb21lKCBmdW5jdGlvbiggZXZlbnRUeXBlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5pbmRleE9mKCBldmVudFR5cGUudG9Mb3dlckNhc2UoKSApICE9PSAtMTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJldHVybiBtYXRjaGluZ1BhdHRoZXJuLmxlbmd0aCA/IG1hdGNoaW5nUGF0dGhlcm5bMF0ubmFtZSA6ICdvdGhlcic7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJ1bkZpbHRlcnMoKSB7XG4gICAgICBsZXQgc2V0dGluZ3MgPSBtb2RlbC5zZXR0aW5ncztcbiAgICAgIGxldCBudW1WaXNpYmxlID0gMDtcblxuICAgICAgbGV0IHNlYXJjaFJlZ0V4cCA9IG51bGw7XG4gICAgICBpZiggc2V0dGluZ3MubmFtZVBhdHRlcm4gKSB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2VhcmNoUmVnRXhwID0gbmV3IFJlZ0V4cCggc2V0dGluZ3MubmFtZVBhdHRlcm4sICdnaScgKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGNhdGNoKCBlICkgeyAvKiBpZ25vcmUgaW52YWxpZCBzZWFyY2ggcGF0dGVybiAqLyB9XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbZXZlbnRJbmZvLmludGVyYWN0aW9uXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3MucGF0dGVybnNbZXZlbnRJbmZvLnBhdHRlcm5dICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5zb3VyY2VzW2V2ZW50SW5mby5zb3VyY2VUeXBlXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCkge1xuICAgICAgbGV0IGV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGluZm8gKSB7XG4gICAgICAgICByZXR1cm4gaW5mby5wcm9ibGVtcy5sZW5ndGggPiAwO1xuICAgICAgfSApO1xuXG4gICAgICBtb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbZXZlbnRJbmZvLm5hbWUsIGV2ZW50SW5mby5zb3VyY2UsIGV2ZW50SW5mby50YXJnZXRdXG4gICAgICAgICAgICAuc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBzZWFyY2hSZWdFeHAudGVzdCggZmllbGQgKTtcbiAgICAgICAgICAgICAgIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgcmV0dXJuICEhbWF0Y2hlcztcbiAgICAgICAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmZpbHRlciApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZmlsdGVyVG9waWNzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB8fCBbXTtcbiAgICAgIGxldCBmaWx0ZXJQYXJ0aWNpcGFudHMgPSBjb250ZXh0LnJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzIHx8IFtdO1xuICAgICAgaWYoICFmaWx0ZXJUb3BpY3MubGVuZ3RoICYmICFmaWx0ZXJQYXJ0aWNpcGFudHMubGVuZ3RoICkge1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXRjaGVzVG9waWNGaWx0ZXIgPSBmaWx0ZXJUb3BpY3NcbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICAgICAgICAgIGxldCBwcmVmaXhlcyA9IHBhdHRlcm5Ub3BpY3NbaXRlbS5wYXR0ZXJuXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbJ3RhcmdldCcsICdzb3VyY2UnXS5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBldmVudEluZm9bZmllbGRdO1xuICAgICAgICAgcmV0dXJuIGZpbHRlclBhcnRpY2lwYW50c1xuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24oIF8gKSB7IHJldHVybiBfLnBhcnRpY2lwYW50OyB9IClcbiAgICAgICAgICAgIC5zb21lKCBpc1N1ZmZpeE9mKCB2YWx1ZSApICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHJldHVybiBtYXRjaGVzVG9waWNGaWx0ZXIgfHwgbWF0Y2hlc1BhcnRpY2lwYW50c0ZpbHRlcjtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaXNTdWZmaXhPZiggdmFsdWUgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF8gKSB7XG4gICAgICAgICAgICBsZXQgdGFpbCA9ICcjJyArIF87XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IHRhaWwubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoIHRhaWwgKSA9PT0gdmFsdWUubGVuZ3RoIC0gdGFpbC5sZW5ndGg7XG4gICAgICAgICB9O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzZXBhcmF0ZSggbGFiZWwsIHNlcGFyYXRvciwgZGVmYXVsdFRleHQgKSB7XG4gICAgICBsZXQgbmFtZSA9IGxhYmVsIHx8IGRlZmF1bHRUZXh0O1xuICAgICAgbGV0IHNwbGl0UG9pbnQgPSBuYW1lLmluZGV4T2YoIHNlcGFyYXRvciApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIHVwcGVyOiBzcGxpdFBvaW50ID09PSAtMSA/IG5hbWUgOiBuYW1lLnN1YnN0ciggMCwgc3BsaXRQb2ludCApLFxuICAgICAgICAgbG93ZXI6IHNwbGl0UG9pbnQgPT09IC0xID8gZGVmYXVsdFRleHQgOiBuYW1lLnN1YnN0ciggc3BsaXRQb2ludCwgbmFtZS5sZW5ndGggKVxuICAgICAgfTtcbiAgIH1cblxuICAgZnVuY3Rpb24gc2V0RGVmYXVsdHMoIHNldHRpbmdzLCBwYXR0ZXJucyApIHtcbiAgICAgIHNldHRpbmdHcm91cHMuZm9yRWFjaCggZnVuY3Rpb24oIGdyb3VwTmFtZSApIHtcbiAgICAgICAgIGxldCBncm91cCA9IHNldHRpbmdzW2dyb3VwTmFtZV07XG4gICAgICAgICBmb3IoIGxldCBuYW1lIGluIGdyb3VwICkge1xuICAgICAgICAgICAgaWYoIGdyb3VwLmhhc093blByb3BlcnR5WyBuYW1lIF0gKSB7XG4gICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0gKTtcbiAgICAgIHBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgIHNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5JbmZvLm5hbWVdID0gdHJ1ZTtcbiAgICAgIH0gKTtcbiAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVQYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgIHNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5dID0gZmFsc2U7XG4gICAgICB9ICk7XG4gICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgIHNldHRpbmdzLnNvdXJjZXNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgIH0gKTtcbiAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICBzZXR0aW5ncy5pbnRlcmFjdGlvbnNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgIH0gKTtcbiAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gb25TZXR0aW5nc0NoYW5nZWQoIHR5cGUsIGdyb3VwLCBuYW1lLCBzdGF0ZSApIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IG1vZGVsLnNldHRpbmdzO1xuICAgICAgY29uc3QgcGF0dGVybnMgPSBtb2RlbC5wYXR0ZXJucztcbiAgICAgIHN3aXRjaCggdHlwZSApIHtcbiAgICAgICAgIGNhc2UgJ09ORSc6XG4gICAgICAgICAgICBzZXR0aW5nc1sgZ3JvdXAgXVsgbmFtZSBdID0gIXN0YXRlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdPTic6XG4gICAgICAgICAgICBjaGFuZ2VBbGwoIHRydWUgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgY2FzZSAnT0ZGJzpcbiAgICAgICAgICAgIGNoYW5nZUFsbCggZmFsc2UgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgY2FzZSAnREVGQVVMVFMnOlxuICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXREZWZhdWx0cyggc2V0dGluZ3MsIHBhdHRlcm5zICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1vZGVsLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cbiAgICAgIHJ1bkZpbHRlcnMoKTtcblxuICAgICAgcmVuZGVyKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGNoYW5nZUFsbCggZW5hYmxlICkge1xuICAgICAgICAgWyAncGF0dGVybnMnLCAnaW50ZXJhY3Rpb25zJywgJ3NvdXJjZXMnIF0uZm9yRWFjaCggKCBfZ3JvdXAgKSA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggc2V0dGluZ3NbIF9ncm91cCBdICkuZm9yRWFjaCggKCBfbmFtZSApID0+IHtcbiAgICAgICAgICAgICAgIHNldHRpbmdzWyBfZ3JvdXAgXVsgX25hbWUgXSA9IGVuYWJsZTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gY2xlYXJGaWx0ZXJzKCkge1xuICAgICAgbW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm4gPSAnJztcbiAgICAgIG1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCA9IG51bGw7XG4gICAgICBjb250ZXh0LmNvbW1hbmRzLnNldEFsbCggdHJ1ZSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBkaXNjYXJkRXZlbnRzKCkge1xuICAgICAgbW9kZWwuZXZlbnRJbmZvcyA9IFtdO1xuICAgICAgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvID0gbnVsbDtcbiAgICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgcmVuZGVyKCk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFBhdHRlcm5zSHRtbEljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgICAgICAgc3dpdGNoKCBwcm9wcy5uYW1lICkge1xuICAgICAgICAgICAgY2FzZSAnbGlmZWN5Y2xlJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJlY3ljbGUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduYXZpZ2F0aW9uJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWxvY2F0aW9uLWFycm93JztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVzb3VyY2VzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZpbGUtdGV4dC1vJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWN0aW9ucyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1yb2NrZXQnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmbGFncyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1mbGFnJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaTE4bic6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1nbG9iZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2liaWxpdHknOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZXllJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJyc7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9e3RoaXMuaWNvbkNsYXNzfS8+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIE51bWJlck9mRXZlbnRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICBpZiggdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyA9PT0gMCAgKSB7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5FbXB0eSBFdmVudHMgTGlzdDwvaDQ+XG4gICAgICAgICAgICAgICA8cD48aSBjbGFzc05hbWU9XCJmYSBmYS1jbG9jay1vXCIgLz4gV2FpdGluZyBmb3IgZXZlbnRzIGZyb20gaG9zdCBhcHBsaWNhdGlvbi4uLjwvcD5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoIHRoaXMucHJvcHMubnVtYmVyT2ZFdmVudHMgPiAwICYmIHRoaXMucHJvcHMubnVtYmVyT2ZWaXNpYmxlRXZlbnRzID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj4wL3sgdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyB9IEV2ZW50IEl0ZW1zPC9oND5cbiAgICAgICAgICAgICAgICAgIDxwPk5vIGV2ZW50cyBtYXRjaGluZyBjdXJyZW50IGZpbHRlcnMuPC9wPlxuICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz1cImNsZWFyRmlsdGVyc1wiPlNob3cgQWxsXG4gICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gVE9ETzogbmctaWY9XCJtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtc1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMubnVtYmVyT2ZWaXNpYmxlRXZlbnRzIH0veyB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzIH0gRXZlbnRzXG4gICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEZpbHRlcnNJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMucHJvcHMubmFtZX07XG4gICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2hhbmdlKCBldmVudCApIHtcbiAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9ICk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCAoUmVnRXhwKVwiXG4gICAgICAgICAgICAgICAgICAgYXgtaWQ9XCInc2VhcmNoJ1wiXG4gICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy5zdGF0ZS52YWx1ZSB9XG4gICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZSB9IC8+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBMaW1pdElucHV0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucHJvcHMubmFtZSB9O1xuICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNoYW5nZSggZXZlbnQgKSB7XG4gICAgICAgICBpZiggZXZlbnQudGFyZ2V0LnZhbHVlID09PSAnJyApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogdmFsdWV9ICk7XG4gICAgICAgICB9XG4gICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlciggZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgICBpZiggIU51bWJlci5pc0ludGVnZXIoIHZhbHVlICkgKSB7IHJldHVybjsgfVxuICAgICAgICAgaWYoIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gNTAwMCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogdmFsdWV9ICk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICBheC1pZD1cIidsaW1pdCdcIlxuICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9eyAnMC0nICsgdGhpcy5wcm9wcy5wbGFjZWhvbGRlciB9XG4gICAgICAgICAgICAgICBtYXhMZW5ndGg9eyA0IH1cbiAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy5zdGF0ZS52YWx1ZSB9XG4gICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBGaWx0ZXJzQW5kTGltaXRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucHJvcHMubmFtZSB9O1xuICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNoYW5nZSggZXZlbnQgKSB7XG4gICAgICAgICB0aGlzLnNldFN0YXRlKCB7dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZX0gKTtcbiAgICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc21cIj5cbiAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5zZWFyY2hSZWdFeHAgfVxuICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidzZWFyY2gnXCI+XG4gICAgICAgICAgICAgICAgICA8c21hbGw+RmlsdGVyczo8L3NtYWxsPlxuICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIlxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIChSZWdFeHApXCJcbiAgICAgICAgICAgICAgICAgICAgICBheC1pZD1cIidzZWFyY2gnXCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9eyB0aGlzLnByb3BzLnNlYXJjaFJlZ0V4cCB9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZSB9IC8+XG4gICAgICAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ2xpbWl0J1wiPlxuICAgICAgICAgICAgICAgICAgPHNtYWxsPkxpbWl0Ojwvc21hbGw+XG4gICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgPExpbWl0SW5wdXQgcGxhY2Vob2xkZXI9eyA1MDAwIH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICB0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkKCAnT05FJywgdGhpcy5wcm9wcy50eXBlLCB0aGlzLnByb3BzLnRleHQsIHRoaXMucHJvcHMuZW5hYmxlZCApO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgY29uc3QgdG9nZ2xlQ2xhc3NOYW1lcyA9ICdmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlJyArIChcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZW5hYmxlZD8gJyBmYS10b2dnbGUtb24nIDogJyBmYS10b2dnbGUtb2ZmJyApO1xuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmhhbmRsZUNsaWNrIH0+eyB0aGlzLnByb3BzLmljb24gJiZcbiAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBhdHRlcm5cIj57IHRoaXMucHJvcHMuaWNvbiB9PC9zcGFuPn1cbiAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy50ZXh0IH0gPGkgY2xhc3NOYW1lPXsgdG9nZ2xlQ2xhc3NOYW1lcyB9IC8+PC9idXR0b24+XG5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFNlbGVjdEZpbHRlcnNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLnN0YXRlID0geyBzaG93UGF0dGVybnM6IGZhbHNlIH07XG4gICAgICAgICB0aGlzLmFsbE9uQ2xpY2sgPSB0aGlzLmFsbE9uQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgICAgdGhpcy5hbGxPZmZDbGljayA9IHRoaXMuYWxsT2ZmQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgICAgdGhpcy5kZWZhdWx0c0NsaWNrID0gdGhpcy5kZWZhdWx0c0NsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgYWxsT25DbGljayggZSApIHtcbiAgICAgICAgIHRoaXMucHJvcHMub25TZXR0aW5nc0NoYW5nZWQoICdPTicgKTtcbiAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGFsbE9mZkNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggJ09GRicgKTtcbiAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cblxuICAgICAgZGVmYXVsdHNDbGljayggZSApIHtcbiAgICAgICAgIHRoaXMucHJvcHMub25TZXR0aW5nc0NoYW5nZWQoICdERUZBVUxUUycgKTtcbiAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMuc2V0dGluZ3MpXG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUVudGVyID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSggeyBzaG93UGF0dGVybnMgOiB0cnVlIH0gKTtcbiAgICAgICAgIGNvbnN0IGhhbmRsZU1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKCB7IHNob3dQYXR0ZXJucyA6IGZhbHNlIH0gKTtcblxuICAgICAgICAgY29uc3QgcGF0dGVybnNCdXR0b25zID0gdGhpcy5wcm9wcy5wYXR0ZXJucy5tYXAoIHBhdHRlcm4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBwYXR0ZXJuLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJwYXR0ZXJuc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17IHBhdHRlcm4ubmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbj17IHBhdHRlcm4uaWNvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZD17IHRoaXMucHJvcHMuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4ubmFtZSBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIGNvbnN0IGludGVyYWN0aW9uc0J1dHRvbnMgPSBPYmplY3Qua2V5cyggdGhpcy5wcm9wcy5zZXR0aW5ncy5pbnRlcmFjdGlvbnMgKS5tYXAoIGludGVyYWN0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8U2V0dGluZ3NUb2dnbGVCdXR0b24ga2V5PXsgaW50ZXJhY3Rpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJpbnRlcmFjdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBpbnRlcmFjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZD17IHRoaXMucHJvcHMuc2V0dGluZ3MuaW50ZXJhY3Rpb25zWyBpbnRlcmFjdGlvbiBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIGNvbnN0IHNvdXJjZUJ1dHRvbnMgPSBPYmplY3Qua2V5cyggdGhpcy5wcm9wcy5zZXR0aW5ncy5zb3VyY2VzICkubWFwKCBzb3VyY2UgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBzb3VyY2UgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzb3VyY2VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXsgc291cmNlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5zb3VyY2VzWyBzb3VyY2UgXSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZXR0aW5nc0NoYW5nZWQ9e3RoaXMucHJvcHMub25TZXR0aW5nc0NoYW5nZWR9XG4gICAgICAgICAgICAgICAvPiApO1xuICAgICAgICAgfSApO1xuXG4gICAgICAgICBjb25zdCBjb21tYW5kQmFyID0gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgdGhpcy5hbGxPbkNsaWNrIH1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICA+QWxsIE9uPC9idXR0b24+XG4gICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgdGhpcy5hbGxPZmZDbGljayB9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLmRlZmF1bHRzQ2xpY2sgfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzXCJcbiAgICAgICAgICAgICAgID5EZWZhdWx0czwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICApO1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyB0aGlzLnN0YXRlLnNob3dQYXR0ZXJucyA/ICdidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIG9wZW4nOiAnYnRuLWdyb3VwIGJ0bi1ncm91cC1zbScgfVxuICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyBoYW5kbGVNb3VzZUVudGVyIH1cbiAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsgaGFuZGxlTW91c2VMZWF2ZSB9PlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPXsgdmlldy5zaG93UGF0dGVybnMgfT5cbiAgICAgICAgICAgICAgICAgIE1vcmUgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIiAvPlxuICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnUgY29udGFpbmVyIGNvbC1sZy02XCIgcm9sZT1cIm1lbnVcIj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGZpcnN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDQ+UGF0dGVybnM8L2g0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj57IHBhdHRlcm5zQnV0dG9ucyB9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0PkludGVyYWN0aW9uczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PnsgaW50ZXJhY3Rpb25zQnV0dG9ucyB9PC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0PlNvdXJjZXM8L2g0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj57IHNvdXJjZUJ1dHRvbnMgfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj4mbmJzcDs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21tYW5kQmFyfVxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIERpc2NhcmRFdmVudHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgIHRoaXMucHJvcHMub25EaXNjYXJkKCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGxldCBjbGFzc05hbWVzID0gJ2J0biBidG4tcHJpbWFyeSBidG4tc20nO1xuXG4gICAgICAgICBpZiggdGhpcy5wcm9wcy5ldmVudEluZm9zTGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMgKyAnIGF4LWRpc2FibGVkJ1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIDxidXR0b24gY2xhc3NOYW1lPXsgY2xhc3NOYW1lcyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PkRpc2NhcmQgRXZlbnRzPC9idXR0b24+XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFNob3dEZXRhaWxzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVDbGljayggZSApIHtcbiAgICAgICAgIHRoaXMucHJvcHMub25OYW1lQ2hhbmdlZCgpO1xuICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgcmV0dXJuIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IHRoaXMucHJvcHMuc2hvd0RldGFpbHMgPyBcImZhIGZhLW1pbnVzLXNxdWFyZVwiIDogXCJmYSBmYS1wbHVzLXNxdWFyZVwiIH0+Jm5ic3A7PC9pPlxuICAgICAgICAgPC9idXR0b24+O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBFdmVudENlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGxldCBzcGxpdFBvaW50ID0gdGhpcy5wcm9wcy5jb250ZW50LmluZGV4T2YoIHRoaXMucHJvcHMuc2VwYXJhdG9yICApO1xuICAgICAgICAgaWYoIHNwbGl0UG9pbnQgPT09IC0xICkge1xuICAgICAgICAgICAgcmV0dXJuIDx0ZD48c3Bhbj57IHRoaXMucHJvcHMuY29udGVudCB9PC9zcGFuPjwvdGQ+O1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuICggPHRkPlxuICAgICAgICAgICAgPHNwYW4+eyB0aGlzLnByb3BzLmNvbnRlbnQuc3Vic3RyaW5nKCAwLCBzcGxpdFBvaW50ICkgfTwvc3Bhbj48YnIgLz5cbiAgICAgICAgICAgIDxzcGFuPnsgdGhpcy5wcm9wcy5jb250ZW50LnN1YnN0cmluZyggc3BsaXRQb2ludCArIDEsIHRoaXMucHJvcHMuY29udGVudC5sZW5ndGggKSB9PC9zcGFuPlxuICAgICAgICAgPC90ZD4gKTtcblxuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBjbGFzcyBFdmVudEJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlXG4gICAgICAgICB9O1xuICAgICAgICAgdGhpcy5oYW5kbGVOYW1lID0gdGhpcy5oYW5kbGVOYW1lLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlTmFtZSgpIHtcbiAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHtzaG93RGV0YWlsczogIXRoaXMuc3RhdGUuc2hvd0RldGFpbHN9ICk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdGlvbiggdGhpcy5wcm9wcy5ldmVudCApO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICBjb25zdCBjc3NDbGFzc05hbWUgPSAnYXgtZXZlbnQtcGF0dGVybi0nICsgdGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgYXgtZXZlbnQtaW50ZXJhY3Rpb24tJyArIHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLnNlbGVjdGVkID8gJyBheC1ldmVudC1zZWxlY3RlZCcgOiAnJyApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICggdGhpcy5wcm9wcy5ldmVudC5wcm9ibGVtcy5sZW5ndGggPyAnIGF4LWV2ZW50LWhhcy1wcm9ibGVtcycgOiAnJyApO1xuICAgICAgICAgY29uc3QgZXZlbnRTdW1tYXJ5Um93ID0gKFxuICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXN1bW1hcnlcIj5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCJcbiAgICAgICAgICAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJufT48UGF0dGVybnNIdG1sSWNvbiBuYW1lPXt0aGlzLnByb3BzLmV2ZW50LnBhdHRlcm59Lz5cbiAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCI+e3RoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb259PC90ZD5cbiAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCI+XG4gICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmXG4gICAgICAgICAgICAgICAgICAgIDxTaG93RGV0YWlsc0J1dHRvbiBzaG93RGV0YWlscz17dGhpcy5zdGF0ZS5zaG93RGV0YWlsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTmFtZUNoYW5nZWQ9e3RoaXMuaGFuZGxlTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDxFdmVudENlbGwgY29udGVudD17dGhpcy5wcm9wcy5ldmVudC5uYW1lfSBzZXBhcmF0b3I9XCIuXCIgLz5cbiAgICAgICAgICAgICAgIDxFdmVudENlbGwgY29udGVudD17dGhpcy5wcm9wcy5ldmVudC5zb3VyY2V9IHNlcGFyYXRvcj1cIiNcIiAvPlxuICAgICAgICAgICAgICAgPEV2ZW50Q2VsbCBjb250ZW50PXt0aGlzLnByb3BzLmV2ZW50LnRhcmdldH0gc2VwYXJhdG9yPVwiI1wiIC8+XG4gICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlIHRleHQtcmlnaHRcIj57dGhpcy5wcm9wcy5ldmVudC5jeWNsZUlkfTwvdGQ+XG4gICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPjxzcGFuPnt0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS5sb3dlcn08L3NwYW4+XG4gICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICk7XG5cbiAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgIGZ1bmN0aW9uIGRldGFpbHNSb3coIHNob3csIGZvcm1hdHRlZEV2ZW50ICkge1xuICAgICAgICAgICAgaWYoICFzaG93ICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiM1wiIC8+XG4gICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICAgIDxwcmU+e2Zvcm1hdHRlZEV2ZW50fTwvcHJlPlxuICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDwvdHI+KTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgLy9UT0RPOiBUZXN0IGRpc3BsYXkgb2YgcHJvYmxlbXNcblxuICAgICAgICAgZnVuY3Rpb24gZXZlbnRQcm9ibGVtcyggcHJvYmxlbXMgKSB7XG4gICAgICAgICAgICBpZiggcHJvYmxlbXMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIDx0ciAvPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxpc3RPZlByb2JsZW1zID0gcHJvYmxlbXMubWFwKCAoIHByb2JsZW0gKSA9PiB7XG4gICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn0gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPntwcm9ibGVtLmRlc2NyaXB0aW9ufTwvaT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCI+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjNcIiAvPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCI1XCI+XG4gICAgICAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bGlzdE9mUHJvYmxlbXN9XG4gICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHRib2R5IGNsYXNzTmFtZT17IGNzc0NsYXNzTmFtZSB9XG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgICB7IGV2ZW50U3VtbWFyeVJvdyB9XG4gICAgICAgICAgICB7IGV2ZW50UHJvYmxlbXMoIHRoaXMucHJvcHMuZXZlbnQucHJvYmxlbXMgKSB9XG4gICAgICAgICAgICB7IGRldGFpbHNSb3coIHRoaXMuc3RhdGUuc2hvd0RldGFpbHMsIHRoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkRXZlbnQgKSB9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY2xhc3MgRXZlbnRMaXN0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMucHJvcHMuZXZlbnRzLm1hcCggZXZlbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxFdmVudEJvZHkgZXZlbnQ9e2V2ZW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2V2ZW50LmluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3UGF0dGVybnNCeU5hbWU9e3ZpZXcucGF0dGVybnNCeU5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkV2ZW50SW5mbz17dGhpcy5wcm9wcy5zZWxlY3Rpb25FdmVudEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uPXt0aGlzLnByb3BzLm9uU2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17ZXZlbnQuc2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtaW50ZXJhY3Rpb25cIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1wYXlsb2FkLWljb25cIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1uYW1lXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtc291cmNlXCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGFyZ2V0XCIvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtY3ljbGVcIi8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC10aW1lc3RhbXBcIi8+XG4gICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxuICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRoPiZuYnNwOzwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPkV2ZW50IE5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlNvdXJjZTwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+VGFyZ2V0PC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+Q3ljbGU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5UaW1lPGkgY2xhc3NOYW1lPVwiZmEgZmEtbG9uZy1hcnJvdy11cFwiLz48L3RoPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICB7ZXZlbnRzfVxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIEV2ZW50RGlzcGxheUVsZW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICB0aGlzLnN0YXRlID0ge3NlbGVjdGlvbkV2ZW50SW5mbzogbnVsbH07XG4gICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvbiA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uLmJpbmQoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlU2VsZWN0aW9uKCBzZWxlY3RlZEV2ZW50ICkge1xuICAgICAgICAgY29uc3Qgc2VsZWN0aW9uRXZlbnRJbmZvSW5kZXggPSB0aGlzLnN0YXRlLnNlbGVjdGlvbkV2ZW50SW5mbyAmJiB0aGlzLnN0YXRlLnNlbGVjdGlvbkV2ZW50SW5mby5pbmRleDtcblxuICAgICAgICAgaWYoIHNlbGVjdGVkRXZlbnQuaW5kZXggPT09IHNlbGVjdGlvbkV2ZW50SW5mb0luZGV4ICkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSggeyBzZWxlY3Rpb25FdmVudEluZm86IG51bGwgfSApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5ldmVudHMuZm9yRWFjaCggKCBldmVudCApID0+IHtcbiAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucHJvcHMuZXZlbnRzLmZvckVhY2goICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICBpZiggZXZlbnQuaW5kZXggPT09IHNlbGVjdGVkRXZlbnQuaW5kZXggKSB7XG4gICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKCB7IHNlbGVjdGlvbkV2ZW50SW5mbzogZXZlbnQgfSApO1xuICAgICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluU2VsZWN0aW9uKCBldmVudCwgc2VsZWN0ZWRFdmVudCApO1xuICAgICAgICAgfSApO1xuXG4gICAgICAgICBmdW5jdGlvbiBpblNlbGVjdGlvbiggZXZlbnRJbmZvLCBzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICAgICBpZiggIXNlbGVjdGlvbkV2ZW50SW5mbyApIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50SW5mbyA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvIHx8IChcbiAgICAgICAgICAgICAgICAgIGV2ZW50SW5mby5jeWNsZUlkID09PSBzZWxlY3Rpb25FdmVudEluZm8uY3ljbGVJZCAmJlxuICAgICAgICAgICAgICAgICAgZXZlbnRJbmZvLnNvdXJjZSA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLnNvdXJjZSAmJlxuICAgICAgICAgICAgICAgICAgZXZlbnRJbmZvLm5hbWUgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5uYW1lXG4gICAgICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgICBpZiggdGhpcy5wcm9wcy52aXNpYmxlRXZlbnRJbmZvc0xlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2PjwvZGl2PjtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybiAoIDxFdmVudExpc3RUYWJsZSBzZWxlY3Rpb25FdmVudEluZm89eyB0aGlzLnN0YXRlLnNlbGVjdGlvbkV2ZW50SW5mbyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17IHRoaXMuaGFuZGxlU2VsZWN0aW9uIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XG4gICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWFmZml4LWFyZWFcIlxuICAgICAgICAgICAgICAgICBheC1hZmZpeFxuICAgICAgICAgICAgICAgICBheC1hZmZpeC1vZmZzZXQtdG9wPVwiMTAwXCI+XG4gICAgICAgICAgICAgICA8TnVtYmVyT2ZFdmVudHMgbnVtYmVyT2ZWaXNpYmxlRXZlbnRzPXsgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkV2ZW50cz17IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH1cbiAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWJ1dHRvbi13cmFwcGVyIGZvcm0taW5saW5lXCI+XG4gICAgICAgICAgICAgICAgICA8RmlsdGVyc0FuZExpbWl0Rm9ybSBuYW1lPXsgc2V0dGluZ3MubmFtZVBhdHRlcm4gfS8+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0RmlsdGVyc0J1dHRvbiBwYXR0ZXJucz17IG1vZGVsLnBhdHRlcm5zIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzPXsgbW9kZWwuc2V0dGluZ3MgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZXR0aW5nc0NoYW5nZWQ9eyBvblNldHRpbmdzQ2hhbmdlZCB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPERpc2NhcmRFdmVudHNCdXR0b24gZXZlbnRJbmZvc0xlbmd0aD17IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRGlzY2FyZD17IGRpc2NhcmRFdmVudHMgfVxuICAgICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxFdmVudERpc3BsYXlFbGVtZW50IHZpc2libGVFdmVudEluZm9zTGVuZ3RoPXttb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM9e21vZGVsLnZpc2libGVFdmVudEluZm9zfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdldmVudHMtZGlzcGxheS13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4UmVhY3RSZW5kZXInLCAnYXhGbG93U2VydmljZScgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
