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
            return true;});}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      //TODO delete model object, its duplicated in affixarea component
      var model = { 
         patterns: [
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
            eventTypes: [] }], 


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

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {var 

         NumberOfEvents = (function (_React$Component2) {_inherits(NumberOfEvents, _React$Component2);
            function NumberOfEvents(props) {_classCallCheck(this, NumberOfEvents);
               _get(Object.getPrototypeOf(NumberOfEvents.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.clearFilters = this.clearFilters.bind(this);}












































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(NumberOfEvents, [{ key: 'clearFilters', value: function clearFilters() {} }, { key: 'render', value: function render() {if (this.props.numberOfEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, 'Empty Events List'), _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...'));}if (this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, '0/', this.props.numberOfEvents, ' Event Items'), _React['default'].createElement('p', null, 'No events matching current filters.'), _React['default'].createElement('p', null, _React['default'].createElement('button', { type: 'button', className: 'btn btn-sm btn-primary', onClick: 'clearFilters' }, 'Show All')));} // TODO: ng-if="model.problemSummary.hasProblems
                  return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, this.props.numberOfVisibleEvents, '/', this.props.numberOfEvents, ' Events'));} }]);return NumberOfEvents;})(_React['default'].Component);var FiltersInput = (function (_React$Component3) {_inherits(FiltersInput, _React$Component3);
            function FiltersInput(props) {_classCallCheck(this, FiltersInput);
               _get(Object.getPrototypeOf(FiltersInput.prototype), 'constructor', this).call(this, props);
               this.state = { value: this.props.name };
               this.handleChange = this.handleChange.bind(this);}


















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(FiltersInput, [{ key: 'handleChange', value: function handleChange(event) {this.setState({ value: event.target.value });} }, { key: 'render', value: function render() {return _React['default'].createElement('input', { className: 'form-control input-sm', placeholder: 'Search (RegExp)', 'ax-id': '\'search\'', type: 'text', value: this.state.value, onChange: this.handleChange });} }]);return FiltersInput;})(_React['default'].Component);var 
         LimitInput = (function (_React$Component4) {_inherits(LimitInput, _React$Component4);
            function LimitInput(props) {_classCallCheck(this, LimitInput);
               _get(Object.getPrototypeOf(LimitInput.prototype), 'constructor', this).call(this, props);
               this.state = { value: this.props.name };
               this.handleChange = this.handleChange.bind(this);}




























            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(LimitInput, [{ key: 'handleChange', value: function handleChange(event) {if (event.target.value === '') {this.setState({ value: value });}var value = Number(event.target.value);if (!Number.isInteger(value)) {return;}if (value >= 0 && value <= 5000) {this.setState({ value: value });}} }, { key: 'render', value: function render() {return _React['default'].createElement('input', { className: 'form-control input-sm', type: 'text', 'ax-id': '\'limit\'', placeholder: '0-' + this.props.placeholder, maxLength: 4, value: this.state.value, onChange: this.handleChange });} }]);return LimitInput;})(_React['default'].Component);var 
         FiltersAndLimitForm = (function (_React$Component5) {_inherits(FiltersAndLimitForm, _React$Component5);
            function FiltersAndLimitForm(props) {_classCallCheck(this, FiltersAndLimitForm);
               _get(Object.getPrototypeOf(FiltersAndLimitForm.prototype), 'constructor', this).call(this, props);
               this.state = { value: this.props.name };
               this.handleChange = this.handleChange.bind(this);}






















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(FiltersAndLimitForm, [{ key: 'handleChange', value: function handleChange(event) {this.setState({ value: event.target.value });} }, { key: 'render', value: function render() {return _React['default'].createElement('div', { className: 'form-group form-group-sm' }, _React['default'].createElement('label', { 'ax-for': '\'search\'' }, _React['default'].createElement('small', null, 'Filters:')), _React['default'].createElement(FiltersInput, null), _React['default'].createElement('label', { 'ax-for': '\'limit\'' }, _React['default'].createElement('small', null, 'Limit:')), _React['default'].createElement(LimitInput, { placeholder: 5000 }));} }]);return FiltersAndLimitForm;})(_React['default'].Component);var 
         SettingsToggleButton = (function (_React$Component6) {_inherits(SettingsToggleButton, _React$Component6);
            function SettingsToggleButton(props) {_classCallCheck(this, SettingsToggleButton);
               _get(Object.getPrototypeOf(SettingsToggleButton.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.handleClick = this.handleClick.bind(this);}

























            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(SettingsToggleButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onSettingsChanged(this.props.type, this.props.text, this.props.enabled); //model.settings.patterns[ pattern.name ] = !model.settings.patterns[ pattern.name ]
                  //model.settings.interactions[ interaction ] = !enabled
                  // model.settings[ a ][b] = !c
                  e.stopPropagation();} }, { key: 'render', value: function render() {var toggleClassNames = 'fa pull-right ax-event-setting-toggle' + (this.props.enabled ? ' fa-toggle-on' : ' fa-toggle-off');return _React['default'].createElement('button', { type: 'button', className: 'btn btn-link ax-event-setting-toggle', onClick: this.handleClick }, this.props.icon && _React['default'].createElement('span', { className: 'ax-event-pattern' }, this.props.icon), this.props.text, ' ', _React['default'].createElement('i', { className: toggleClassNames }));} }]);return SettingsToggleButton;})(_React['default'].Component);var SelectFiltersButton = (function (_React$Component7) {_inherits(SelectFiltersButton, _React$Component7);function SelectFiltersButton(props) {_classCallCheck(this, SelectFiltersButton);_get(Object.getPrototypeOf(SelectFiltersButton.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { showPatterns: false };}



























































































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(SelectFiltersButton, [{ key: 'render', value: function render() {var _this = this;var handleMouseEnter = function handleMouseEnter() {return _this.setState({ showPatterns: true });};var handleMouseLeave = function handleMouseLeave() {return _this.setState({ showPatterns: false });};var patternsButtons = this.props.patterns.map(function (pattern) {return _React['default'].createElement(SettingsToggleButton, { key: pattern.name, type: 'patterns', text: pattern.name, icon: pattern.icon, enabled: _this.props.settings.patterns[pattern.name], onSettingsChanged: _this.props.onSettingsChanged });});var interactionsButtons = Object.keys(this.props.settings.interactions).map(function (interaction) {return _React['default'].createElement(SettingsToggleButton, { key: interaction, type: 'interactions', text: interaction, enabled: _this.props.settings.interactions[interaction], onSettingsChanged: _this.props.onSettingsChanged });});var sourceButtons = Object.keys(this.props.settings.sources).map(function (source) {return _React['default'].createElement(SettingsToggleButton, { key: source, type: 'sources', text: source, enabled: _this.props.settings.sources[source], onSettingsChanged: _this.props.onSettingsChanged });});var commandBar = _React['default'].createElement('div', { className: 'pull-right' }, _React['default'].createElement('button', { type: 'button', className: 'btn btn-xs btn-primary' }, 'All On'), _React['default'].createElement('button', { type: 'button', className: 'btn btn-xs btn-primary' }, 'All Off'), _React['default'].createElement('button', { type: 'button', className: 'btn btn-xs' }, 'Defaults')); /*<button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( true )">All On</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( false )">All Off</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <button type="button" className="btn btn-xs" ng-click="commands.setDefaults()">Defaults</button>*/return _React['default'].createElement('div', { className: this.state.showPatterns ? 'btn-group btn-group-sm open' : 'btn-group btn-group-sm', onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, _React['default'].createElement('button', { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': view.showPatterns }, 'More ', _React['default'].createElement('span', { className: 'caret' })), _React['default'].createElement('div', { className: 'dropdown-menu container col-lg-6', role: 'menu' }, _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, _React['default'].createElement('h4', null, 'Patterns'), _React['default'].createElement('div', null, patternsButtons)), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, _React['default'].createElement('h4', null, 'Interactions'), _React['default'].createElement('div', null, interactionsButtons), _React['default'].createElement('br', null), _React['default'].createElement('h4', null, 'Sources'), _React['default'].createElement('div', null, sourceButtons))), _React['default'].createElement('div', { className: 'row' }, _React['default'].createElement('div', { className: 'ax-event-settings-col first' }, ' '), _React['default'].createElement('div', { className: 'ax-event-settings-col last' }, commandBar))));} }]);return SelectFiltersButton;})(_React['default'].Component);var Filters = (function (_React$Component8) {_inherits(Filters, _React$Component8);function Filters(props) {_classCallCheck(this, Filters);
               _get(Object.getPrototypeOf(Filters.prototype), 'constructor', this).call(this, props);
               this.props = props;}























            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(Filters, [{ key: 'render', value: function render() {if (!model.eventInfos.length) {return _React['default'].createElement('div', { className: 'text-large' }, _React['default'].createElement('h4', { className: 'text-primary' }, 'Empty Events List'), _React['default'].createElement('p', null, _React['default'].createElement('i', { className: 'fa fa-clock-o' }), ' Waiting for events from host application...'));}return _React['default'].createElement('div', { className: 'ax-button-wrapper form-inline' }, _React['default'].createElement(FiltersAndLimitForm, { name: 'model.settings.namePattern' }), _React['default'].createElement(SelectFiltersButton, { patterns: this.props.patterns, settings: this.props.settings, onSettingsChanged: this.props.onSettingsChanged }));} }]);return Filters;})(_React['default'].Component);var 
         DiscardEventsButton = (function (_React$Component9) {_inherits(DiscardEventsButton, _React$Component9);
            function DiscardEventsButton(props) {_classCallCheck(this, DiscardEventsButton);
               _get(Object.getPrototypeOf(DiscardEventsButton.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.handleClick = this.handleClick.bind(this);}











            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(DiscardEventsButton, [{ key: 'handleClick', value: function handleClick(e) {e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('div', null, _React['default'].createElement('h4', null, 'DiscardEventsButton'));} }]);return DiscardEventsButton;})(_React['default'].Component);var 
         AffixArea = (function (_React$Component10) {_inherits(AffixArea, _React$Component10);

            function AffixArea(props) {_classCallCheck(this, AffixArea);
               _get(Object.getPrototypeOf(AffixArea.prototype), 'constructor', this).call(this, props);
               this.state = { 
                  patterns: [
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
                     eventTypes: [] }], 


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
                        runtime: true } } };}


































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(AffixArea, [{ key: 'render', value: function render() {var onSettingsChanged = function onSettingsChanged(a, b, c) {var settings = this.state.settings;settings[a][b] = !c;this.setState({ settings: settings });};return _React['default'].createElement('div', { className: 'ax-affix-area', 'ax-affix': true, 'ax-affix-offset-top': '100' }, _React['default'].createElement(NumberOfEvents, { numberOfVisibleEvents: 1, numberOfEvents: 1 }), _React['default'].createElement(Filters, { patterns: this.state.patterns, settings: this.state.settings, onSettingsChanged: onSettingsChanged }), _React['default'].createElement(DiscardEventsButton, null));} }]);return AffixArea;})(_React['default'].Component);var 
         ShowDetailsButton = (function (_React$Component11) {_inherits(ShowDetailsButton, _React$Component11);
            function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
               _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.handleClick = this.handleClick.bind(this);}
















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onNameChanged();e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('button', { type: 'button', className: 'btn-link btn-info', onClick: this.handleClick }, _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 
         EventCell = (function (_React$Component12) {_inherits(EventCell, _React$Component12);
            function EventCell(props) {_classCallCheck(this, EventCell);
               _get(Object.getPrototypeOf(EventCell.prototype), 'constructor', this).call(this, props);
               this.props = props;}















            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventCell, [{ key: 'render', value: function render() {var splitPoint = this.props.content.indexOf(this.props.separator);if (splitPoint === -1) {return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content));}return _React['default'].createElement('td', null, _React['default'].createElement('span', null, this.props.content.substring(0, splitPoint)), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.content.substring(splitPoint + 1, this.props.content.length)));} }]);return EventCell;})(_React['default'].Component);var 
         EventBody = (function (_React$Component13) {_inherits(EventBody, _React$Component13);
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
                  function eventProblems(problems) {if (problems.length === 0) {return _React['default'].createElement('tr', null);}var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }, problem.description));});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('tbody', { className: cssClassName, onClick: this.handleClick }, eventSummaryRow, eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var EventListTable = (function (_React$Component14) {_inherits(EventListTable, _React$Component14);function EventListTable(props) {_classCallCheck(this, EventListTable);_get(Object.getPrototypeOf(EventListTable.prototype), 'constructor', this).call(this, props);this.props = props;}














































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventListTable, [{ key: 'render', value: function render() {var _this2 = this;var events = this.props.events.map(function (event) {return _React['default'].createElement(EventBody, { event: event, key: event.index, viewPatternsByName: view.patternsByName, selectionEventInfo: _this2.props.selectionEventInfo, onSelection: _this2.props.onSelection, selected: event.selected });}); /////////////////////////////////////////////////////////////////////////////////////////////////////
                  return _React['default'].createElement('table', { className: 'table' }, _React['default'].createElement('colgroup', null, _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), _React['default'].createElement('col', { className: 'ax-col-interaction' }), _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), _React['default'].createElement('col', { className: 'ax-col-name' }), _React['default'].createElement('col', { className: 'ax-col-source' }), _React['default'].createElement('col', { className: 'ax-col-target' }), _React['default'].createElement('col', { className: 'ax-col-cycle' }), _React['default'].createElement('col', { className: 'ax-col-timestamp' })), _React['default'].createElement('thead', null, _React['default'].createElement('tr', null, _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Action'), _React['default'].createElement('th', null, ' '), _React['default'].createElement('th', null, 'Event Name'), _React['default'].createElement('th', null, 'Source'), _React['default'].createElement('th', null, 'Target'), _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), events);} }]);return EventListTable;})(_React['default'].Component);var EventDisplayElement = (function (_React$Component15) {_inherits(EventDisplayElement, _React$Component15);
            function EventDisplayElement(props) {_classCallCheck(this, EventDisplayElement);
               _get(Object.getPrototypeOf(EventDisplayElement.prototype), 'constructor', this).call(this, props);
               this.props = props;
               this.state = { selectionEventInfo: null };
               this.handleSelection = this.handleSelection.bind(this);}




















































            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            _createClass(EventDisplayElement, [{ key: 'handleSelection', value: function handleSelection(selectedEvent) {var _this3 = this;var selectionEventInfoIndex = this.state.selectionEventInfo && this.state.selectionEventInfo.index;if (selectedEvent.index === selectionEventInfoIndex) {this.setState({ selectionEventInfo: null });this.props.events.forEach(function (event) {event.selected = false;});return;}this.props.events.forEach(function (event) {if (event.index === selectedEvent.index) {_this3.setState({ selectionEventInfo: event });event.selected = true;return;}if (inSelection(event, selectedEvent)) {event.selected = true;} else {event.selected = false;}});function inSelection(eventInfo, selectionEventInfo) {if (!selectionEventInfo) {return false;}return eventInfo === selectionEventInfo || eventInfo.cycleId === selectionEventInfo.cycleId && eventInfo.source === selectionEventInfo.source && eventInfo.name === selectionEventInfo.name;}} }, { key: 'render', value: function render() {if (this.props.visibleEventInfosLength === 0) {return _React['default'].createElement('div', null);}return _React['default'].createElement(EventListTable, { selectionEventInfo: this.state.selectionEventInfo, onSelection: this.handleSelection, events: this.props.events });} }]);return EventDisplayElement;})(_React['default'].Component);
         reactRender(
         _React['default'].createElement('div', null, 
         _React['default'].createElement(AffixArea, null), 
         _React['default'].createElement(EventDisplayElement, { visibleEventInfosLength: model.visibleEventInfos.length, 
            events: model.visibleEventInfos })));}





      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7QUFFYixVQUFJLGFBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7Ozs7QUFJNUQsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLDZCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsMkJBQTJCLENBQUUsUUFBUSxFQUFFO0FBQy9FLHdCQUFlLEVBQUUsVUFBVTtBQUMzQixtQkFBVSxFQUFFLElBQUksRUFDbEIsQ0FBRSxDQUFDOzs7OztBQUlKLGVBQVMsVUFBVSxHQUFHO0FBQ25CLGFBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDOUIsYUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixhQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsYUFBSSxRQUFRLENBQUMsV0FBVyxFQUFHO0FBQ3hCLGdCQUFJO0FBQ0QsMkJBQVksR0FBRyxJQUFJLE1BQU0sQ0FBRSxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBRSxDQUFDLENBQzFEOztBQUNELG1CQUFPLENBQUMsRUFBRyxxQ0FBdUMsQ0FDcEQ7O0FBQ0QsYUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7O0FBRWxELGNBQUssQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBRSxVQUFVLFNBQVMsRUFBRztBQUN0RSxnQkFBSSxRQUFRLENBQUMsa0JBQWtCLEtBQUssSUFBSSxJQUFJLFVBQVUsSUFBSSxRQUFRLENBQUMsa0JBQWtCLEVBQUc7QUFDckYsc0JBQU8sS0FBSyxDQUFDLENBQ2Y7O0FBQ0QsZ0JBQUksQ0FB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QVcsQ0FBQyxDQUNyQixBQUNELE9BQVMsZ0NBQUMsY0FBYyxJQUFDLGtCQUFrQixFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEFBQUUsRUFDckQsV0FBVyxFQUFHLElBQUksQ0FBQyxlQUFlLEFBQUUsRUFDcEMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDLEdBQ3hDLENBQ1IsQ0FDSixZQXZERSxtQkFBbUIsSUFBUyxrQkFBTSxTQUFTO0FBNERqRCxvQkFBVztBQUNSO0FBQ0cseUNBQUMsU0FBUyxPQUFHO0FBQ2IseUNBQUMsbUJBQW1CLElBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQUFBQztBQUN4RCxrQkFBTSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQUFBQyxHQUNuRCxDQUNDLENBQ1IsQ0FBQyxDQUNKOzs7Ozs7OztBQUlELGFBQU87QUFDSix1QkFBYyxFQUFFLE1BQU0sRUFDeEIsQ0FBQyxDQUNKOzs7O0FBRWM7QUFDWixVQUFJLEVBQUUsdUJBQXVCO0FBQzdCLGdCQUFVLEVBQUUsQ0FBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBRTtBQUM3RCxZQUFNLEVBQU4sTUFBTSxFQUNSIiwiZmlsZSI6ImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgYWl4aWdvIEFHXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vbGF4YXJqcy5vcmcvbGljZW5zZVxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXhQYXR0ZXJucyBmcm9tICdsYXhhci1wYXR0ZXJucyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgdHJhY2tlciBmcm9tICcuL3RyYWNrZXInO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZSggY29udGV4dCwgcmVhY3RSZW5kZXIsIGZsb3dTZXJ2aWNlICkge1xuICAgJ3VzZSBzdHJpY3QnO1xuXG4gICBsZXQgc2V0dGluZ0dyb3VwcyA9IFsncGF0dGVybnMnLCAnaW50ZXJhY3Rpb25zJywgJ3NvdXJjZXMnXTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY29udGV4dC5yZXNvdXJjZXMgPSB7fTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogcnVuRmlsdGVycyxcbiAgICAgIGlzT3B0aW9uYWw6IHRydWVcbiAgIH0gKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcnVuRmlsdGVycygpIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IG1vZGVsLnNldHRpbmdzO1xuICAgICAgbGV0IG51bVZpc2libGUgPSAwO1xuXG4gICAgICBsZXQgc2VhcmNoUmVnRXhwID0gbnVsbDtcbiAgICAgIGlmKCBzZXR0aW5ncy5uYW1lUGF0dGVybiApIHtcbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKCBzZXR0aW5ncy5uYW1lUGF0dGVybiwgJ2dpJyApO1xuICAgICAgICAgfVxuICAgICAgICAgY2F0Y2goIGUgKSB7IC8qIGlnbm9yZSBpbnZhbGlkIHNlYXJjaCBwYXR0ZXJuICovIH1cbiAgICAgIH1cbiAgICAgIGxldCBzZWxlY3Rpb25FdmVudEluZm8gPSBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm87XG5cbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbZXZlbnRJbmZvLmludGVyYWN0aW9uXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3MucGF0dGVybnNbZXZlbnRJbmZvLnBhdHRlcm5dICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5zb3VyY2VzW2V2ZW50SW5mby5zb3VyY2VUeXBlXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gKTtcblxuXG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAvL1RPRE8gZGVsZXRlIG1vZGVsIG9iamVjdCwgaXRzIGR1cGxpY2F0ZWQgaW4gYWZmaXhhcmVhIGNvbXBvbmVudFxuICAgY29uc3QgbW9kZWwgPSB7XG4gICAgICBwYXR0ZXJuczogW1xuICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2xpZmVjeWNsZScsXG4gICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1yZWN5Y2xlXCIgLz4sXG4gICAgICAgICAgICBldmVudFR5cGVzOiBbICdlbmRMaWZlY3ljbGUnLCAnYmVnaW5MaWZlY3ljbGUnIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbmF2aWdhdGlvbicsXG4gICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1sb2NhdGlvbi1hcnJvd1wiIC8+LFxuICAgICAgICAgICAgZXZlbnRUeXBlczogWyAnbmF2aWdhdGUnIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncmVzb3VyY2VzJyxcbiAgICAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWZpbGUtdGV4dC1vXCIgLz4sXG4gICAgICAgICAgICBldmVudFR5cGVzOiBbICdyZXBsYWNlJywgJ3VwZGF0ZScsICd2YWxpZGF0ZScsICdzYXZlJyBdXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtcm9ja2V0XCIgLz4sXG4gICAgICAgICAgICBldmVudFR5cGVzOiBbICd0YWtlQWN0aW9uJyBdXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2ZsYWdzJyxcbiAgICAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWZsYWdcIiAvPixcbiAgICAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2NoYW5nZUZsYWcnIF1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaTE4bicsXG4gICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1nbG9iZVwiIC8+LFxuICAgICAgICAgICAgZXZlbnRUeXBlczogWyAnY2hhbmdlTG9jYWxlJyBdXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtZXllXCIgLz4sXG4gICAgICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdjaGFuZ2VXaWRnZXRWaXNpYmlsaXR5JyBdXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ290aGVyJyxcbiAgICAgICAgICAgIGljb246IDxpIC8+LFxuICAgICAgICAgICAgZXZlbnRUeXBlczogW11cbiAgICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBpbmRleDogMCxcbiAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgIH0sXG4gICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfTtcblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBjb21tYW5kcyA9IHtcbiAgICAgIHNldEFsbDogZnVuY3Rpb24oIHRvVmFsdWUgKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1tncm91cE5hbWVdO1xuICAgICAgICAgICAgZm9yKCBsZXQgbmFtZSBpbiBncm91cCApIHtcbiAgICAgICAgICAgICAgIGlmKCBncm91cC5oYXNPd25Qcm9wZXJ0eVtuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgIGdyb3VwW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5JbmZvLm5hbWVdID0gdHJ1ZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVQYXR0ZXJucy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5dID0gZmFsc2U7XG4gICAgICAgICB9ICk7XG4gICAgICAgICBjb250ZXh0LmZlYXR1cmVzLmZpbHRlci5oaWRlU291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnNvdXJjZXNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbcGF0dGVybl0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBjbGVhckZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgbW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm4gPSAnJztcbiAgICAgICAgIG1vZGVsLnNldHRpbmdzLnZpc2libGVFdmVudHNMaW1pdCA9IG51bGw7XG4gICAgICAgICBjb250ZXh0LmNvbW1hbmRzLnNldEFsbCggdHJ1ZSApO1xuICAgICAgfSxcbiAgICAgIC8vIHNlbGVjdDogZnVuY3Rpb24oIGV2ZW50SW5mbyApIHtcbiAgICAgIC8vICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IGV2ZW50SW5mby5zZWxlY3RlZCA/IG51bGwgOiBldmVudEluZm87XG4gICAgICAvLyAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAvLyB9LFxuICAgICAgZGlzY2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5ldmVudEluZm9zID0gW107XG4gICAgICAgICBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm8gPSBudWxsO1xuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICB9LFxuICAgICAgcnVuRmlsdGVyczogcnVuRmlsdGVyc1xuICAgfTtcblxuICAgY29tbWFuZHMuc2V0RGVmYXVsdHMoKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgaWYoIGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLnN0cmVhbSApIHtcbiAgICAgIGNvbnRleHQuZXZlbnRCdXMuc3Vic2NyaWJlKCAnZGlkUHJvZHVjZS4nICsgY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggZXZlbnQuZGF0YSApICYmIGV2ZW50LmRhdGEubGVuZ3RoICkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS5mb3JFYWNoKCBhZGRFdmVudCApO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGRFdmVudCggZXZlbnQuZGF0YSApO1xuICAgICAgICAgfVxuICAgICAgICAgcnVuRmlsdGVycygpO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvL2NvbnRleHQuJHdhdGNoKCAnbW9kZWwuc2V0dGluZ3MnLCBydW5GaWx0ZXJzLCB0cnVlICk7XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGNsYXNzIFBhdHRlcm5zSHRtbEljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgICAgICAgc3dpdGNoKCBwcm9wcy5uYW1lICkge1xuICAgICAgICAgICAgY2FzZSAnbGlmZWN5Y2xlJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJlY3ljbGUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduYXZpZ2F0aW9uJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWxvY2F0aW9uLWFycm93JztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVzb3VyY2VzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZpbGUtdGV4dC1vJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWN0aW9ucyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1yb2NrZXQnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmbGFncyc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1mbGFnJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaTE4bic6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1nbG9iZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2liaWxpdHknOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZXllJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJyc7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9e3RoaXMuaWNvbkNsYXNzfS8+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGFkZEV2ZW50KCBldmVudEluZm8gKSB7XG5cbiAgICAgIGxldCBjb21wbGV0ZUV2ZW50SW5mbyA9IHtcbiAgICAgICAgIGluZGV4OiArK21vZGVsLmluZGV4LFxuICAgICAgICAgaW50ZXJhY3Rpb246IGV2ZW50SW5mby5hY3Rpb24sXG4gICAgICAgICBjeWNsZUlkOiBldmVudEluZm8uY3ljbGVJZCA+IC0xID8gZXZlbnRJbmZvLmN5Y2xlSWQgOiAnLScsXG4gICAgICAgICBldmVudE9iamVjdDogZXZlbnRJbmZvLmV2ZW50T2JqZWN0IHx8IHt9LFxuICAgICAgICAgZm9ybWF0dGVkRXZlbnQ6IEpTT04uc3RyaW5naWZ5KCBldmVudEluZm8uZXZlbnRPYmplY3QsIG51bGwsIDMgKSxcbiAgICAgICAgIGZvcm1hdHRlZFRpbWU6IHtcbiAgICAgICAgICAgIHVwcGVyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnSEg6bW0nICksXG4gICAgICAgICAgICBsb3dlcjogbW9tZW50KCBldmVudEluZm8udGltZSApLmZvcm1hdCggJ3NzLlNTUycgKVxuICAgICAgICAgfSxcbiAgICAgICAgIG5hbWU6IGV2ZW50SW5mby5ldmVudCB8fCAnPycsXG4gICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuKCAoZXZlbnRJbmZvLmV2ZW50IHx8ICc/JykudG9Mb3dlckNhc2UoKSApLFxuICAgICAgICAgc2hvd0RldGFpbHM6IGZhbHNlLFxuICAgICAgICAgc291cmNlOiAoIGV2ZW50SW5mby5zb3VyY2UgfHwgJz8nICkucmVwbGFjZSggL153aWRnZXRcXC4vLCAnJyApLFxuICAgICAgICAgdGFyZ2V0OiAoIGV2ZW50SW5mby50YXJnZXQgfHwgJz8nICkucmVwbGFjZSggL14tJC8sICcnICksXG4gICAgICAgICB0aW1lOiBldmVudEluZm8udGltZSxcbiAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgIHNvdXJjZVR5cGU6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5pbmRleE9mKCAnd2lkZ2V0LicgKSA9PT0gMCA/ICd3aWRnZXRzJyA6ICdydW50aW1lJyxcbiAgICAgICAgIHByb2JsZW1zOiB0cmFja2VyLnRyYWNrKCBldmVudEluZm8gKVxuICAgICAgfTtcblxuICAgICAgbW9kZWwuZXZlbnRJbmZvcy51bnNoaWZ0KCBjb21wbGV0ZUV2ZW50SW5mbyApO1xuICAgICAgaWYoIGNvbXBsZXRlRXZlbnRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgfVxuXG4gICAgICBpZiggbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggPiBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplICkge1xuICAgICAgICAgbGV0IHJlbW92ZWRJbmZvID0gbW9kZWwuZXZlbnRJbmZvcy5wb3AoKTtcbiAgICAgICAgIGlmKCByZW1vdmVkSW5mby5wcm9ibGVtcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGF0dGVybiggZXZlbnROYW1lICkge1xuICAgICAgICAgbGV0IG1hdGNoaW5nUGF0dGhlcm4gPSBtb2RlbC5wYXR0ZXJucy5maWx0ZXIoIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm4uZXZlbnRUeXBlcy5zb21lKCBmdW5jdGlvbiggZXZlbnRUeXBlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5pbmRleE9mKCBldmVudFR5cGUudG9Mb3dlckNhc2UoKSApICE9PSAtMTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIHJldHVybiBtYXRjaGluZ1BhdHRoZXJuLmxlbmd0aCA/IG1hdGNoaW5nUGF0dGhlcm5bMF0ubmFtZSA6ICdvdGhlcic7XG4gICAgICB9XG5cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCkge1xuICAgICAgbGV0IGV2ZW50SW5mb3MgPSBtb2RlbC5ldmVudEluZm9zLmZpbHRlciggZnVuY3Rpb24oIGluZm8gKSB7XG4gICAgICAgICByZXR1cm4gaW5mby5wcm9ibGVtcy5sZW5ndGggPiAwO1xuICAgICAgfSApO1xuXG4gICAgICBtb2RlbC5wcm9ibGVtU3VtbWFyeSA9IHtcbiAgICAgICAgIGhhc1Byb2JsZW1zOiBldmVudEluZm9zLmxlbmd0aCA+IDAsXG4gICAgICAgICBldmVudEluZm9zOiBldmVudEluZm9zXG4gICAgICB9O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbZXZlbnRJbmZvLm5hbWUsIGV2ZW50SW5mby5zb3VyY2UsIGV2ZW50SW5mby50YXJnZXRdXG4gICAgICAgICAgICAuc29tZSggZnVuY3Rpb24oIGZpZWxkICkge1xuICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBzZWFyY2hSZWdFeHAudGVzdCggZmllbGQgKTtcbiAgICAgICAgICAgICAgIHNlYXJjaFJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgcmV0dXJuICEhbWF0Y2hlcztcbiAgICAgICAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgbGV0IHBhdHRlcm5Ub3BpY3MgPSB7XG4gICAgICBSRVNPVVJDRTogWydkaWRSZXBsYWNlJywgJ2RpZFVwZGF0ZSddLFxuICAgICAgQUNUSU9OOiBbJ3Rha2VBY3Rpb25SZXF1ZXN0JywgJ3dpbGxUYWtlQWN0aW9uJywgJ2RpZFRha2VBY3Rpb24nXSxcbiAgICAgIEZMQUc6IFsnZGlkQ2hhbmdlRmxhZyddLFxuICAgICAgQ09OVEFJTkVSOiBbJ2NoYW5nZUFyZWFWaXNpYmlsaXR5UmVxdWVzdCcsICd3aWxsQ2hhbmdlQXJlYVZpc2liaWxpdHknLCAnZGlkQ2hhbmdlQXJlYVZpc2liaWxpdHknXVxuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSB7XG4gICAgICBpZiggIWNvbnRleHQucmVzb3VyY2VzLmZpbHRlciApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZmlsdGVyVG9waWNzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnRvcGljcyB8fCBbXTtcbiAgICAgIGxldCBmaWx0ZXJQYXJ0aWNpcGFudHMgPSBjb250ZXh0LnJlc291cmNlcy5maWx0ZXIucGFydGljaXBhbnRzIHx8IFtdO1xuICAgICAgaWYoICFmaWx0ZXJUb3BpY3MubGVuZ3RoICYmICFmaWx0ZXJQYXJ0aWNpcGFudHMubGVuZ3RoICkge1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXRjaGVzVG9waWNGaWx0ZXIgPSBmaWx0ZXJUb3BpY3NcbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICAgICAgICAgIGxldCBwcmVmaXhlcyA9IHBhdHRlcm5Ub3BpY3NbaXRlbS5wYXR0ZXJuXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbJ3RhcmdldCcsICdzb3VyY2UnXS5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBldmVudEluZm9bZmllbGRdO1xuICAgICAgICAgcmV0dXJuIGZpbHRlclBhcnRpY2lwYW50c1xuICAgICAgICAgICAgLm1hcCggZnVuY3Rpb24oIF8gKSB7IHJldHVybiBfLnBhcnRpY2lwYW50OyB9IClcbiAgICAgICAgICAgIC5zb21lKCBpc1N1ZmZpeE9mKCB2YWx1ZSApICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHJldHVybiBtYXRjaGVzVG9waWNGaWx0ZXIgfHwgbWF0Y2hlc1BhcnRpY2lwYW50c0ZpbHRlcjtcblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgZnVuY3Rpb24gaXNTdWZmaXhPZiggdmFsdWUgKSB7XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF8gKSB7XG4gICAgICAgICAgICBsZXQgdGFpbCA9ICcjJyArIF87XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IHRhaWwubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoIHRhaWwgKSA9PT0gdmFsdWUubGVuZ3RoIC0gdGFpbC5sZW5ndGg7XG4gICAgICAgICB9O1xuICAgICAgfVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBzZXBhcmF0ZSggbGFiZWwsIHNlcGFyYXRvciwgZGVmYXVsdFRleHQgKSB7XG4gICAgICBsZXQgbmFtZSA9IGxhYmVsIHx8IGRlZmF1bHRUZXh0O1xuICAgICAgbGV0IHNwbGl0UG9pbnQgPSBuYW1lLmluZGV4T2YoIHNlcGFyYXRvciApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIHVwcGVyOiBzcGxpdFBvaW50ID09PSAtMSA/IG5hbWUgOiBuYW1lLnN1YnN0ciggMCwgc3BsaXRQb2ludCApLFxuICAgICAgICAgbG93ZXI6IHNwbGl0UG9pbnQgPT09IC0xID8gZGVmYXVsdFRleHQgOiBuYW1lLnN1YnN0ciggc3BsaXRQb2ludCwgbmFtZS5sZW5ndGggKVxuICAgICAgfTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICBjbGFzcyBOdW1iZXJPZkV2ZW50cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJGaWx0ZXJzID0gdGhpcy5jbGVhckZpbHRlcnMuYmluZCggdGhpcyApO1xuICAgICAgICAgfVxuXG4gICAgICAgICBjbGVhckZpbHRlcnMoKSB7XG5cbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYoIHRoaXMucHJvcHMubnVtYmVyT2ZFdmVudHMgPT09IDAgICkge1xuICAgICAgICAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+RW1wdHkgRXZlbnRzIExpc3Q8L2g0PlxuICAgICAgICAgICAgICAgICAgPHA+PGkgY2xhc3NOYW1lPVwiZmEgZmEtY2xvY2stb1wiIC8+IFdhaXRpbmcgZm9yIGV2ZW50cyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLnByb3BzLm51bWJlck9mRXZlbnRzID4gMCAmJiB0aGlzLnByb3BzLm51bWJlck9mVmlzaWJsZUV2ZW50cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+MC97IHRoaXMucHJvcHMubnVtYmVyT2ZFdmVudHMgfSBFdmVudCBJdGVtczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICA8cD5ObyBldmVudHMgbWF0Y2hpbmcgY3VycmVudCBmaWx0ZXJzLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9XCJjbGVhckZpbHRlcnNcIj5TaG93IEFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE86IG5nLWlmPVwibW9kZWwucHJvYmxlbVN1bW1hcnkuaGFzUHJvYmxlbXNcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLm51bWJlck9mVmlzaWJsZUV2ZW50cyB9L3sgdGhpcy5wcm9wcy5udW1iZXJPZkV2ZW50cyB9IEV2ZW50c1xuICAgICAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBGaWx0ZXJzSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge3ZhbHVlOiB0aGlzLnByb3BzLm5hbWV9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNoYW5nZSggZXZlbnQgKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKCB7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSApO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggKFJlZ0V4cClcIlxuICAgICAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ3NlYXJjaCdcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuc3RhdGUudmFsdWUgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsgdGhpcy5oYW5kbGVDaGFuZ2UgfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBMaW1pdElucHV0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucHJvcHMubmFtZSB9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNoYW5nZSggZXZlbnQgKSB7XG4gICAgICAgICAgICBpZiggZXZlbnQudGFyZ2V0LnZhbHVlID09PSAnJyApIHtcbiAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogdmFsdWV9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlciggZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgICAgICBpZiggIU51bWJlci5pc0ludGVnZXIoIHZhbHVlICkgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgaWYoIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gNTAwMCApIHtcbiAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHt2YWx1ZTogdmFsdWV9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiXG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICBheC1pZD1cIidsaW1pdCdcIlxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9eyAnMC0nICsgdGhpcy5wcm9wcy5wbGFjZWhvbGRlciB9XG4gICAgICAgICAgICAgICAgICBtYXhMZW5ndGg9eyA0IH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXsgdGhpcy5zdGF0ZS52YWx1ZSB9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cbiAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBGaWx0ZXJzQW5kTGltaXRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucHJvcHMubmFtZSB9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNoYW5nZSggZXZlbnQgKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKCB7dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZX0gKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgYXgtZm9yPVwiJ3NlYXJjaCdcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD5GaWx0ZXJzOjwvc21hbGw+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPEZpbHRlcnNJbnB1dCAvPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidsaW1pdCdcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxMaW1pdElucHV0IHBsYWNlaG9sZGVyPXsgNTAwMCB9Lz5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgU2V0dGluZ3NUb2dnbGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZCggdGhpcy5wcm9wcy50eXBlLCB0aGlzLnByb3BzLnRleHQsIHRoaXMucHJvcHMuZW5hYmxlZCAgKTtcbiAgICAgICAgICAgIC8vbW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4ubmFtZSBdID0gIW1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXVxuICAgICAgICAgICAgLy9tb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGludGVyYWN0aW9uIF0gPSAhZW5hYmxlZFxuICAgICAgICAgICAgLy8gbW9kZWwuc2V0dGluZ3NbIGEgXVtiXSA9ICFjXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCB0b2dnbGVDbGFzc05hbWVzID0gJ2ZhIHB1bGwtcmlnaHQgYXgtZXZlbnQtc2V0dGluZy10b2dnbGUnICsgKFxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5lbmFibGVkPyAnIGZhLXRvZ2dsZS1vbicgOiAnIGZhLXRvZ2dsZS1vZmYnICk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYXgtZXZlbnQtc2V0dGluZy10b2dnbGVcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT57IHRoaXMucHJvcHMuaWNvbiAmJlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF0dGVyblwiPnsgdGhpcy5wcm9wcy5pY29uIH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnRleHQgfSA8aSBjbGFzc05hbWU9eyB0b2dnbGVDbGFzc05hbWVzIH0+PC9pPjwvYnV0dG9uPlxuXG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBTZWxlY3RGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgc2hvd1BhdHRlcm5zOiBmYWxzZSB9O1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUVudGVyID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSggeyBzaG93UGF0dGVybnMgOiB0cnVlIH0gKTtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZU1vdXNlTGVhdmUgPSAoKSA9PiB0aGlzLnNldFN0YXRlKCB7IHNob3dQYXR0ZXJucyA6IGZhbHNlIH0gKTtcblxuICAgICAgICAgICAgY29uc3QgcGF0dGVybnNCdXR0b25zID0gdGhpcy5wcm9wcy5wYXR0ZXJucy5tYXAoIHBhdHRlcm4gPT4ge1xuICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBwYXR0ZXJuLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJwYXR0ZXJuc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17IHBhdHRlcm4ubmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbj17IHBhdHRlcm4uaWNvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZD17IHRoaXMucHJvcHMuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4ubmFtZSBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGludGVyYWN0aW9uc0J1dHRvbnMgPSBPYmplY3Qua2V5cyggdGhpcy5wcm9wcy5zZXR0aW5ncy5pbnRlcmFjdGlvbnMgKS5tYXAoIGludGVyYWN0aW9uID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8U2V0dGluZ3NUb2dnbGVCdXR0b24ga2V5PXsgaW50ZXJhY3Rpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJpbnRlcmFjdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9eyBpbnRlcmFjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZD17IHRoaXMucHJvcHMuc2V0dGluZ3MuaW50ZXJhY3Rpb25zWyBpbnRlcmFjdGlvbiBdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNldHRpbmdzQ2hhbmdlZD17dGhpcy5wcm9wcy5vblNldHRpbmdzQ2hhbmdlZH1cbiAgICAgICAgICAgICAgICAgIC8+ICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUJ1dHRvbnMgPSBPYmplY3Qua2V5cyggdGhpcy5wcm9wcy5zZXR0aW5ncy5zb3VyY2VzICkubWFwKCBzb3VyY2UgPT4ge1xuICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbiBrZXk9eyBzb3VyY2UgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzb3VyY2VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXsgc291cmNlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkPXsgdGhpcy5wcm9wcy5zZXR0aW5ncy5zb3VyY2VzWyBzb3VyY2UgXSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZXR0aW5nc0NoYW5nZWQ9e3RoaXMucHJvcHMub25TZXR0aW5nc0NoYW5nZWR9XG4gICAgICAgICAgICAgICAgICAvPiApO1xuICAgICAgICAgICAgfSApO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRCYXIgPSAoXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIj5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIj5BbGwgT2ZmPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXhzXCI+RGVmYXVsdHM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8qPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiIG5nLWNsaWNrPVwiY29tbWFuZHMuc2V0QWxsKCB0cnVlIClcIj5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldEFsbCggZmFsc2UgKVwiPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHNcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldERlZmF1bHRzKClcIj5EZWZhdWx0czwvYnV0dG9uPiovXG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IHRoaXMuc3RhdGUuc2hvd1BhdHRlcm5zID8gJ2J0bi1ncm91cCBidG4tZ3JvdXAtc20gb3Blbic6ICdidG4tZ3JvdXAgYnRuLWdyb3VwLXNtJyB9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17IGhhbmRsZU1vdXNlRW50ZXIgfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyBoYW5kbGVNb3VzZUxlYXZlIH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9eyB2aWV3LnNob3dQYXR0ZXJucyB9PlxuICAgICAgICAgICAgICAgICAgICAgTW9yZSA8c3BhbiBjbGFzc05hbWU9XCJjYXJldFwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudSBjb250YWluZXIgY29sLWxnLTZcIiByb2xlPVwibWVudVwiPlxuXG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoND5QYXR0ZXJuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PnsgcGF0dGVybnNCdXR0b25zIH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQ+SW50ZXJhY3Rpb25zPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+eyBpbnRlcmFjdGlvbnNCdXR0b25zIH08L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQ+U291cmNlczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pnsgc291cmNlQnV0dG9ucyB9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWV2ZW50LXNldHRpbmdzLWNvbCBmaXJzdFwiPiZuYnNwOzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAge2NvbW1hbmRCYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgRmlsdGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYoICFtb2RlbC5ldmVudEluZm9zLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGFyZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5FbXB0eSBFdmVudHMgTGlzdDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICA8cD48aSBjbGFzc05hbWU9XCJmYSBmYS1jbG9jay1vXCIgLz4gV2FpdGluZyBmb3IgZXZlbnRzIGZyb20gaG9zdCBhcHBsaWNhdGlvbi4uLjwvcD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWJ1dHRvbi13cmFwcGVyIGZvcm0taW5saW5lXCI+XG4gICAgICAgICAgICAgICAgICA8RmlsdGVyc0FuZExpbWl0Rm9ybSBuYW1lPVwibW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm5cIi8+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0RmlsdGVyc0J1dHRvbiBwYXR0ZXJucz17IHRoaXMucHJvcHMucGF0dGVybnMgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M9eyB0aGlzLnByb3BzLnNldHRpbmdzIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0dGluZ3NDaGFuZ2VkPXt0aGlzLnByb3BzLm9uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgRGlzY2FyZEV2ZW50c0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdj48aDQ+RGlzY2FyZEV2ZW50c0J1dHRvbjwvaDQ+PC9kaXY+O1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBBZmZpeEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2xpZmVjeWNsZScsXG4gICAgICAgICAgICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1yZWN5Y2xlXCIgLz4sXG4gICAgICAgICAgICAgICAgICAgICBldmVudFR5cGVzOiBbICdlbmRMaWZlY3ljbGUnLCAnYmVnaW5MaWZlY3ljbGUnIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiAnbmF2aWdhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1sb2NhdGlvbi1hcnJvd1wiIC8+LFxuICAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlczogWyAnbmF2aWdhdGUnIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiAncmVzb3VyY2VzJyxcbiAgICAgICAgICAgICAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWZpbGUtdGV4dC1vXCIgLz4sXG4gICAgICAgICAgICAgICAgICAgICBldmVudFR5cGVzOiBbICdyZXBsYWNlJywgJ3VwZGF0ZScsICd2YWxpZGF0ZScsICdzYXZlJyBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtcm9ja2V0XCIgLz4sXG4gICAgICAgICAgICAgICAgICAgICBldmVudFR5cGVzOiBbICd0YWtlQWN0aW9uJyBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ZsYWdzJyxcbiAgICAgICAgICAgICAgICAgICAgIGljb246IDxpIGNsYXNzTmFtZT1cImZhIGZhLWZsYWdcIiAvPixcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZXM6IFsgJ2NoYW5nZUZsYWcnIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaTE4bicsXG4gICAgICAgICAgICAgICAgICAgICBpY29uOiA8aSBjbGFzc05hbWU9XCJmYSBmYS1nbG9iZVwiIC8+LFxuICAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlczogWyAnY2hhbmdlTG9jYWxlJyBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICAgICAgaWNvbjogPGkgY2xhc3NOYW1lPVwiZmEgZmEtZXllXCIgLz4sXG4gICAgICAgICAgICAgICAgICAgICBldmVudFR5cGVzOiBbICdjaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdjaGFuZ2VXaWRnZXRWaXNpYmlsaXR5JyBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ290aGVyJyxcbiAgICAgICAgICAgICAgICAgICAgIGljb246IDxpIC8+LFxuICAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlczogW11cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgICAgICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgICAgICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICAgICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgfVxuXG5cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3Qgb25TZXR0aW5nc0NoYW5nZWQgPSBmdW5jdGlvbiAoYSxiLGMpIHtcbiAgICAgICAgICAgICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc3RhdGUuc2V0dGluZ3M7XG4gICAgICAgICAgICAgICBzZXR0aW5nc1sgYSBdWyBiIF0gPSAhYztcbiAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF4LWFmZml4LWFyZWFcIlxuICAgICAgICAgICAgICAgICAgICBheC1hZmZpeFxuICAgICAgICAgICAgICAgICAgICBheC1hZmZpeC1vZmZzZXQtdG9wPVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICA8TnVtYmVyT2ZFdmVudHMgbnVtYmVyT2ZWaXNpYmxlRXZlbnRzPXsxfSBudW1iZXJPZkV2ZW50cz17MX0gLz5cbiAgICAgICAgICAgICAgICAgIDxGaWx0ZXJzIHBhdHRlcm5zPXsgdGhpcy5zdGF0ZS5wYXR0ZXJucyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncz17IHRoaXMuc3RhdGUuc2V0dGluZ3MgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZXR0aW5nc0NoYW5nZWQ9e29uU2V0dGluZ3NDaGFuZ2VkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxEaXNjYXJkRXZlbnRzQnV0dG9uIC8+XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG5cblxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBTaG93RGV0YWlsc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaGFuZGxlQ2xpY2soIGUgKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uTmFtZUNoYW5nZWQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWxpbmsgYnRuLWluZm9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9eyB0aGlzLnByb3BzLnNob3dEZXRhaWxzID8gXCJmYSBmYS1taW51cy1zcXVhcmVcIiA6IFwiZmEgZmEtcGx1cy1zcXVhcmVcIiB9PiZuYnNwOzwvaT5cbiAgICAgICAgICAgIDwvYnV0dG9uPjtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgRXZlbnRDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBsZXQgc3BsaXRQb2ludCA9IHRoaXMucHJvcHMuY29udGVudC5pbmRleE9mKCB0aGlzLnByb3BzLnNlcGFyYXRvciAgKTtcbiAgICAgICAgICAgIGlmKCBzcGxpdFBvaW50ID09PSAtMSApIHtcbiAgICAgICAgICAgICAgIHJldHVybiA8dGQ+PHNwYW4+eyB0aGlzLnByb3BzLmNvbnRlbnQgfTwvc3Bhbj48L3RkPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoIDx0ZD5cbiAgICAgICAgICAgICAgIDxzcGFuPnsgdGhpcy5wcm9wcy5jb250ZW50LnN1YnN0cmluZyggMCwgc3BsaXRQb2ludCApIH08L3NwYW4+PGJyIC8+XG4gICAgICAgICAgICAgICA8c3Bhbj57IHRoaXMucHJvcHMuY29udGVudC5zdWJzdHJpbmcoIHNwbGl0UG9pbnQgKyAxLCB0aGlzLnByb3BzLmNvbnRlbnQubGVuZ3RoICkgfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvdGQ+ICk7XG5cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgY2xhc3MgRXZlbnRCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgIHNob3dEZXRhaWxzOiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTmFtZSA9IHRoaXMuaGFuZGxlTmFtZS5iaW5kKCB0aGlzICk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZU5hbWUoKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKCB7c2hvd0RldGFpbHM6ICF0aGlzLnN0YXRlLnNob3dEZXRhaWxzfSApO1xuICAgICAgICAgfVxuXG4gICAgICAgICBoYW5kbGVDbGljayggZSApIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Rpb24oIHRoaXMucHJvcHMuZXZlbnQgKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3QgY3NzQ2xhc3NOYW1lID0gJ2F4LWV2ZW50LXBhdHRlcm4tJyArIHRoaXMucHJvcHMuZXZlbnQucGF0dGVybiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnIGF4LWV2ZW50LWludGVyYWN0aW9uLScgKyB0aGlzLnByb3BzLmV2ZW50LmludGVyYWN0aW9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICggdGhpcy5wcm9wcy5zZWxlY3RlZCA/ICcgYXgtZXZlbnQtc2VsZWN0ZWQnIDogJycgKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoIHRoaXMucHJvcHMuZXZlbnQucHJvYmxlbXMubGVuZ3RoID8gJyBheC1ldmVudC1oYXMtcHJvYmxlbXMnIDogJycgKTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50U3VtbWFyeVJvdyA9IChcbiAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1zdW1tYXJ5XCI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuZXZlbnQucGF0dGVybn0+PFBhdHRlcm5zSHRtbEljb24gbmFtZT17dGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJufS8+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1pbnRlcmFjdGlvblwiPnt0aGlzLnByb3BzLmV2ZW50LmludGVyYWN0aW9ufTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLXBheWxvYWQtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLmV2ZW50LmludGVyYWN0aW9uID09ICdwdWJsaXNoJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICA8U2hvd0RldGFpbHNCdXR0b24gc2hvd0RldGFpbHM9e3RoaXMuc3RhdGUuc2hvd0RldGFpbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk5hbWVDaGFuZ2VkPXt0aGlzLmhhbmRsZU5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8RXZlbnRDZWxsIGNvbnRlbnQ9e3RoaXMucHJvcHMuZXZlbnQubmFtZX0gc2VwYXJhdG9yPVwiLlwiIC8+XG4gICAgICAgICAgICAgICAgICA8RXZlbnRDZWxsIGNvbnRlbnQ9e3RoaXMucHJvcHMuZXZlbnQuc291cmNlfSBzZXBhcmF0b3I9XCIjXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxFdmVudENlbGwgY29udGVudD17dGhpcy5wcm9wcy5ldmVudC50YXJnZXR9IHNlcGFyYXRvcj1cIiNcIiAvPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1jeWNsZSB0ZXh0LXJpZ2h0XCI+e3RoaXMucHJvcHMuZXZlbnQuY3ljbGVJZH08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj48c3Bhbj57dGhpcy5wcm9wcy5ldmVudC5mb3JtYXR0ZWRUaW1lLnVwcGVyfTwvc3Bhbj48YnIgLz5cbiAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZFRpbWUubG93ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXRhaWxzUm93KCBzaG93LCBmb3JtYXR0ZWRFdmVudCApIHtcbiAgICAgICAgICAgICAgIGlmKCAhc2hvdyApIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiA8dHIgLz47XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICByZXR1cm4gKDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCI+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjNcIiAvPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCI1XCI+XG4gICAgICAgICAgICAgICAgICAgICA8cHJlPntmb3JtYXR0ZWRFdmVudH08L3ByZT5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICA8L3RyPik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vVE9ETzogVGVzdCBkaXNwbGF5IG9mIHByb2JsZW1zXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGV2ZW50UHJvYmxlbXMoIHByb2JsZW1zICkge1xuICAgICAgICAgICAgICAgaWYoIHByb2JsZW1zLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiA8dHIgLz47XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBjb25zdCBsaXN0T2ZQcm9ibGVtcyA9IHByb2JsZW1zLm1hcCggKCBwcm9ibGVtICkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Byb2JsZW0uZGVzY3JpcHRpb259IGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXdhcm5pbmdcIj57cHJvYmxlbS5kZXNjcmlwdGlvbn08L2k+XG4gICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpc3RPZlByb2JsZW1zfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzc05hbWU9eyBjc3NDbGFzc05hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgICAgeyBldmVudFN1bW1hcnlSb3cgfVxuICAgICAgICAgICAgICAgeyBldmVudFByb2JsZW1zKCB0aGlzLnByb3BzLmV2ZW50LnByb2JsZW1zICkgfVxuICAgICAgICAgICAgICAgeyBkZXRhaWxzUm93KCB0aGlzLnN0YXRlLnNob3dEZXRhaWxzLCB0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZEV2ZW50ICkgfVxuICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGNsYXNzIEV2ZW50TGlzdFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgfVxuXG4gICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudHMgPSB0aGlzLnByb3BzLmV2ZW50cy5tYXAoIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8RXZlbnRCb2R5IGV2ZW50PXtldmVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtldmVudC5pbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1BhdHRlcm5zQnlOYW1lPXt2aWV3LnBhdHRlcm5zQnlOYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FdmVudEluZm89e3RoaXMucHJvcHMuc2VsZWN0aW9uRXZlbnRJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbj17dGhpcy5wcm9wcy5vblNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2V2ZW50LnNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXNvdXJjZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRhcmdldFwiLz5cbiAgICAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGltZXN0YW1wXCIvPlxuICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cbiAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+Jm5ic3A7PC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5FdmVudCBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5Tb3VyY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPlRhcmdldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPkN5Y2xlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+VGltZTxpIGNsYXNzTmFtZT1cImZhIGZhLWxvbmctYXJyb3ctdXBcIi8+PC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAge2V2ZW50c31cbiAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBjbGFzcyBFdmVudERpc3BsYXlFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtzZWxlY3Rpb25FdmVudEluZm86IG51bGx9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb24gPSB0aGlzLmhhbmRsZVNlbGVjdGlvbi5iaW5kKCB0aGlzICk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGhhbmRsZVNlbGVjdGlvbiggc2VsZWN0ZWRFdmVudCApIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbkV2ZW50SW5mb0luZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8gJiYgdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8uaW5kZXg7XG5cbiAgICAgICAgICAgIGlmKCBzZWxlY3RlZEV2ZW50LmluZGV4ID09PSBzZWxlY3Rpb25FdmVudEluZm9JbmRleCApIHtcbiAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoIHsgc2VsZWN0aW9uRXZlbnRJbmZvOiBudWxsIH0gKTtcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZXZlbnRzLmZvckVhY2goICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICBldmVudC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb3BzLmV2ZW50cy5mb3JFYWNoKCAoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgICAgICAgaWYoIGV2ZW50LmluZGV4ID09PSBzZWxlY3RlZEV2ZW50LmluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSggeyBzZWxlY3Rpb25FdmVudEluZm86IGV2ZW50IH0gKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGlmKCBpblNlbGVjdGlvbiggZXZlbnQsIHNlbGVjdGVkRXZlbnQgKSApIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZXZlbnQuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgICAgICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICAgICAgICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYoIHRoaXMucHJvcHMudmlzaWJsZUV2ZW50SW5mb3NMZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gPGRpdj48L2Rpdj47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKCA8RXZlbnRMaXN0VGFibGUgc2VsZWN0aW9uRXZlbnRJbmZvPXsgdGhpcy5zdGF0ZS5zZWxlY3Rpb25FdmVudEluZm8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb249eyB0aGlzLmhhbmRsZVNlbGVjdGlvbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM9e3RoaXMucHJvcHMuZXZlbnRzfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEFmZml4QXJlYSAvPlxuICAgICAgICAgICAgPEV2ZW50RGlzcGxheUVsZW1lbnQgdmlzaWJsZUV2ZW50SW5mb3NMZW5ndGg9e21vZGVsLnZpc2libGVFdmVudEluZm9zLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cz17bW9kZWwudmlzaWJsZUV2ZW50SW5mb3N9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ2V2ZW50cy1kaXNwbGF5LXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBbICdheENvbnRleHQnLCAnYXhSZWFjdFJlbmRlcicsICdheEZsb3dTZXJ2aWNlJyBdLFxuICAgY3JlYXRlXG59O1xuIl19
