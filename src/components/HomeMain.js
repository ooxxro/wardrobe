import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link } from 'react-router-dom';

@observer
export default class HomeMain extends React.Component {
  static contextType = StoreContext;

  render() {
    const { userStore } = this.context;
    return (
      <div>
        <h2>Hi! I'm HomeMain</h2>
        <h3>You see this page when logged in</h3>

        <div>Your Name: {userStore.currentUser.displayName}</div>

        <div>
          links:
          <ul>
            <li>
              <Link to="/my-wardrobe">My Wardrobe</Link>
            </li>
            <li>
              <Link to="/add-clothes">Add Clothes</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
