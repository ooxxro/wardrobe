import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import DesignComponent from './DesignComponent';

@withRouter
@observer
export default class MyFavoritesEdit extends React.Component {
  static contextType = StoreContext;

  render() {
    // console.log(this.props.match.params.outfitId);
    return <DesignComponent from="edit" />;
  }
}
