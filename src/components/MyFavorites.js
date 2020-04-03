import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
export default class MyFavorites extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <div>
        <h2>Hi! This is My Favorites Page</h2>
      </div>
    );
  }
}
