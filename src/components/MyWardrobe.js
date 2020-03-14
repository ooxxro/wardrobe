import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link } from 'react-router-dom';

@observer
export default class MyWardrobe extends React.Component {
  static contextType = StoreContext;

  render() {
    const links = [
      { to: 'all', text: 'All' },
      { to: 'hats', text: 'Hats' },
      { to: 'shirts', text: 'Shirts' },
      { to: 'pants', text: 'Pants' },
      { to: 'shoes', text: 'Shoes' },
    ];
    return (
      <div>
        <h2>Hi! This is MyWardrobe Page</h2>

        <div>
          links:
          <ul>
            {links.map((link, i) => (
              <li key={i}>
                <Link to={`/my-wardrobe/${link.to}`}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
