import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link, withRouter } from 'react-router-dom';

@withRouter
@observer
export default class ClothesDetail extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <div>
        <h2>Hi! This is Clothes Detail Page</h2>
      </div>
    );
  }
}
