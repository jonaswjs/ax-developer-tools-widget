/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import React from 'react';
import ax from 'laxar';
import moment from 'moment';

function create( context, eventBus, reactRender ) {
   'use strict';

   var model = {
      messages: []
   };

   var commands = {
      discard: function() {
         model.messages.length = 0;
      }
   };

   if( context.features.log.stream ) {
      eventBus.subscribe(  'didProduce.' + context.features.log.stream, function( event ) {
         if( Array.isArray( event.data ) ) {
            event.data.forEach( displayLogMessage );
         }
         else {
            displayLogMessage( event.data );
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function displayLogMessage( message ) {
      model.messages.unshift( {
         text: ax.string.format( message.text, message.replacements ),
         level: message.level,
         time: message.time,
         location: message.sourceInfo.file + ':' + message.sourceInfo.line
      } );

      while( model.messages.length > context.features.log.bufferSize ) {
         model.messages.pop();
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function render() {

      function formatTime( date ) {
         return moment( date ).format( 'YYYY-MM-DD HH:mm:ss.SSS' )
      }

      const messages = model.messages.map( ( message ) =>
         <tr>
            <td>{message.level}</td>
            <td>{message.text}</td>
            <td>{message.location}</td>
            <td>{formatTime( message.time )}</td>
         </tr>
      );

      reactRender(
         <div>
            <div className="ax-affix-area"
                 ax-affix
                 ax-affix-offset-top="100">
               <div className="ax-button-wrapper">
                  <button
                     type="button"
                     className={ ( !model.messages.length ? 'ax-disabled' : '' ) + "btn btn-primary btn-sm" }
                     onClick="commands.discard"
                     >Clear</button>
               </div>
            </div>

            { !model.messages.length &&
               <div className="text-large">
                  <h4 className="text-primary">No Log Messages</h4>
                  <p><i className="fa fa-clock-o"></i> Waiting for messages from host application...</p>
               </div>
            }

            { model.messages.length &&
               <table className="table table-striped table-hover">
                  <thead>
                     <tr>
                        <th>Level</th>
                        <th>Message</th>
                        <th>Location</th>
                        <th>Time</th>
                     </tr>
                  </thead>
                  <tbody>
                     { messages }
                  </tbody>
               </table>
            }
         </div>
      );

   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      onDomAvailable: render
   };
}

export default {
   name: 'log-display-widget',
   injections: [ 'axContext', 'axEventBus', 'axReactRender' ],
   create
};
