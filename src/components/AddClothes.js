import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link, withRouter } from 'react-router-dom';

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <div>
        <h2>Hi! This is Add Clothes Page</h2>

        <div>
          go to
          <Link to="/clothes-detail">Clothes Detail Page</Link>
        </div>
      </div>
    );
  }
}
