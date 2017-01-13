import React from 'react';

export default class AxWidgetArea extends React.Component {

   constructor( props ) {
      super( props );
      this.props = props;
   }

   render() {
      return (
         <div data-ax-widget-area={ this.props.name }><p>widgetarea</p>{ this.props.children }</div>
      );

   }
}
