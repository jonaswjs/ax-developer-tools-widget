define( [
   'laxar-application/includes/widgets/events-display-widget/events-display-widget',
   'laxar-application/includes/widgets/host-connector-widget/host-connector-widget'
], function() {
   'use strict';

   var modules = [].slice.call( arguments );
   return {
      'react': modules.slice( 0, 1 ),
      'plain': modules.slice( 1, 2 )
   };
} );
