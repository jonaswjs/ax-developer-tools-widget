define( [
   'laxar-affix-control/ax-affix-control',
   'laxar-input-control/ax-input-control',
   'laxar-application/includes/widgets/events-display-widget/events-display-widget',
   'laxar-application/includes/widgets/log-display-widget/log-display-widget',
   'laxar-application/includes/widgets/developer-toolbar-widget/developer-toolbar-widget',
   'laxar-application/includes/widgets/page-inspector-widget/page-inspector-widget',
   'laxar-application/includes/widgets/host-connector-widget/host-connector-widget'
], function() {
   'use strict';

   var modules = [].slice.call( arguments );
   return {
      'angular': modules.slice( 0, 4 ),
      'react': modules.slice( 4, 6 ),
      'plain': modules.slice( 6, 7 )
   };
} );
