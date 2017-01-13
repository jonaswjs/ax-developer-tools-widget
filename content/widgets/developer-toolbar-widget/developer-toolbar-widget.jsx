/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://www.laxarjs.org
 */

import React from 'react';
import { resources, flags, visibility } from 'laxar-patterns';

import '../../lib/laxar-developer-tools/grid';
import '../../lib/laxar-developer-tools/widget-outline';

function create( context, eventBus, reactRender, flowService ) {
   'use strict';
   let visible = false;
   var HINT_NO_LAXAR_EXTENSION = 'Reload page to enable LaxarJS developer tools!';
   var HINT_DISABLE_TOGGLE_GRID = 'Configure grid settings in application to enable this feature!';
   var HINT_NO_LAXAR_ANYMORE_WIDGET = 'Cannot access LaxarJS host window (or tab).' +
                                       ' Reopen laxar-developer-tools from LaxarJS host window.';
   var HINT_CONFIGURE_GRID = 'Configure grid settings in application to enable this feature!';

   var TABS = [
      { name: 'events', label: 'Events' },
      { name: 'page', label: 'Page' },
      { name: 'log', label: 'Log' }
   ];

   var model = {
      laxar: true,
      tabs: TABS,
      activeTab: null,
      gridOverlay: false,
      widgetOverlay: false,
      toggleGridTitle: HINT_DISABLE_TOGGLE_GRID,
      noLaxar: HINT_NO_LAXAR_EXTENSION
   };


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

   context.resources = {};

   if( window.opener ) {
      model.noLaxar = HINT_NO_LAXAR_ANYMORE_WIDGET;
   }

   resources.handlerFor( context ).registerResourceFromFeature(
      'grid',
      {
         onReplace: function( event ) {
            if( event.data === null ) {
               model.toggleGridTitle = HINT_CONFIGURE_GRID;
               model.gridOverlay = false;
            }
            else {
               model.toggleGridTitle = '';
            }
         }
      }
   );

   flags.handlerFor( context ).registerFlag( context.features.detailsOn, {
      initialState: model.laxar,
      onChange: function( newState ) {
         model.laxar = newState;
      }
   } );

   if( isBrowserWebExtension ) {
      chrome.devtools.network.onNavigated.addListener( function() {
         model.gridOverlay = false;
         model.widgetOverlay = false;
         render()
      } );
   }

   visibility.handlerFor( context, { onAnyAreaRequest: function( event ) {
      var prefix = context.id() + '.';
      var activeTab = model.activeTab;
      return event.visible && activeTab !== null && event.area === prefix + activeTab.name;
   } } );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   eventBus.subscribe( 'didNavigate', function( event ) {
      var newName = event.data[ context.features.tabs.parameter ];

      var newTab = TABS.filter( function( _ ) { return _.name === newName; } )[ 0 ];
      if( !newTab ) {
         return;
      }

      if( model.activeTab !== newTab ) {
         publishVisibility( model.activeTab, false );
         publishVisibility( newTab, true );
      }
      model.activeTab = newTab;

      function publishVisibility( tab, visible ) {
         if( tab ) {
            var area = context.id() + '.' + tab.name;
            visibility.requestPublisherForArea( context, area )( visible );
         }
      }
      render();
   } );

   eventBus.subscribe( `didChangeAreaVisibility.${context.widget.area}`, (event, meta) => {
     if( !visible && event.visible ) {
        visible = true;
        render();
     }
  } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   eventBus.subscribe( 'takeActionRequest.navigation', function( event ) {
      eventBus.publish( 'willTakeAction.navigation', {
         action: 'navigation'
      } );
      if( model.gridOverlay ) {
         toggleGrid();
      }
      if( model.widgetOverlay ) {
         toggleWidgetOutline();
      }
      eventBus.publish( 'didTakeAction.navigation', {
         action: 'navigation'
      } );
      render();
   } );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function onClickToggleGrid() {
      if( !context.resources.grid ){ return; }
      toggleGrid();
      model.gridOverlay = !model.gridOverlay;
      render();
   };

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function onClickToggleWidgetOutline() {
      toggleWidgetOutline();
      model.widgetOverlay = !model.widgetOverlay;
      render();
   };

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function toggleGrid() {
      if( window.opener ) {
         /* global axDeveloperToolsToggleGrid */
         axDeveloperToolsToggleGrid( context.resources.grid );
         return;
      }
      if( isBrowserWebExtension ) {
         var event;
         event = new CustomEvent( 'toogleGrid', {
            detail: JSON.stringify( context.resources.grid )
         } );
         window.dispatchEvent( event );
      }
      else if( firefoxExtensionMessagePort ) {
         var message = { text: 'toogleGrid', data: context.resources.grid };
         firefoxExtensionMessagePort.postMessage( JSON.stringify( message ) );
      }
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function toggleWidgetOutline() {
      if( window.opener ) {
         /* global axDeveloperToolsToggleWidgetOutline */
         axDeveloperToolsToggleWidgetOutline();
         return;
      }
      if( isBrowserWebExtension ) {
         var event;
         event = new CustomEvent( 'widgetOutline', { } );
         window.dispatchEvent( event );
      }
      else if( firefoxExtensionMessagePort ) {
         var message = { text: 'widgetOutline', data: {} };
         firefoxExtensionMessagePort.postMessage( JSON.stringify( message ) );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function render() {
      let gridButton = '';
      if( context.resources.grid ) {
         gridButton = (
            <button className="btn btn-link"
                 title={model.toggleGridTitle}
                 type="button"
                 onClick={onClickToggleGrid}
            ><i className={ 'fa fa-toggle-' + ( model.gridOverlay ? 'on' : 'off' ) }
            ></i>&nbsp;{model.gridOverlay ? 'Turn off grid overlay' : 'Turn on grid overlay'}</button>
         );
      }

      const widgetOutlineButton = (
         <button
            className="btn btn-link"
            type="button"
            onClick={onClickToggleWidgetOutline}
            ><i className={ 'fa fa-toggle-' + ( model.widgetOverlay ? 'on' : 'off' ) }
            ></i>&nbsp;{model.widgetOverlay ? 'Turn off widget outline' : 'Turn on widget outline'}</button>
      );

      let optionButtons = '';
      if( model.laxar ) {
         optionButtons = <div className="pull-right">
            { gridButton } { widgetOutlineButton }
         </div>;
      }

      let widgetArea = '';
      if( model.laxar ) {
         const tab = model.tabs.find( ( tab ) => model.activeTab === tab );
         const name = tab ? tab.name : 'noTab';
         widgetArea = (
            <div className="app-tab app-tab-page"
                    data-ax-widget-area={name}>
            </div>
         );
      }

      const tabListItems = model.tabs.map( ( tab ) => {
         const url = flowService.constructAbsoluteUrl( 'tools', { 'tab': tab.name } )
         if( model.activeTab && model.activeTab.name === tab.name ) {
            return(
               <li key={tab.name} className='ax-active'
                  ><a href={url}
                  >{tab.label}</a></li>
            );
         }
         else {
            return(
               <li key={tab.name}
                  ><a href={url}
                  >{tab.label}</a></li>
            );
         }
      } );

      const navTab = (
         <ul className="nav nav-tabs" role="tablist">
            <li><a className="developer-toolbar-icon"
                   title="LaxarJS Documentation"
                   href="http://www.laxarjs.org/docs"
                   target="_blank"></a>
            </li>
            { tabListItems }
            { model.laxar === false &&
               <li className="developer-toolbar-hint">{model.noLaxar}</li>
            }
         </ul>
      );

      reactRender(
         <div>
            { optionButtons }
            { navTab }
            { widgetArea }
         </div>
      );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      onDomAvailable: render
   };
}

export default {
   name: 'developer-toolbar-widget',
   injections: [ 'axContext', 'axEventBus', 'axReactRender', 'axFlowService' ],
   create
};
