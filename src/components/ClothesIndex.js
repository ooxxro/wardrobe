import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import firebase from 'firebase';

// Data objects
const db = firebase.firestore(); // database object
const userCollection = db.collection('users'); // users collection
const auth = firebase.auth();

// DOM Elements
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Card = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex: 1;
  max-width: 1000px;
  height: 800px;
  margin: 10px;
  border-radius: 20px;
  font-size: 26px;
  font-weight: bold;
  border: 1px solid currentColor;
  background: #fff;
`;
const LeftSidePanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  max-width: 200px;
  height: ${Card.height};
  padding-top: 25px;
  border-right: 1px solid currentColor;
`;
const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  max-width: 800px;
  height: ${Card.height};
  padding-top: 25px;
  padding-left: 25px;
`;
const TabContainer = styled.div`
  flex: 0.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 200px;
  height: ${Card.height};
`;
const Tab = styled(Menu.Item)`
  flex: 0.5;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: currentColor;
  height: 100px;
  max-width: ${TabContainer.maxWidth};
  border-bottom: 1px solid currentColor;
`;
const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${RightSide.width};
  font-size: 20px;
  font-weight: 600;
  height: 150px;
  flex: 0.3;
`;
const SortButton = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100px;
  height: 40px;
  padding: 5px;
  margin: 25px;
  border: 1px solid currentColor;
  border-radius: 10px;
  &:hover {
    background: #baaaff;
    color: white;
  }
`;
const ClothingRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${RightSide.width};
  height: 200px;
  border-bottom: 1px solid currentColor;
`;
@withRouter
@observer
export default class ClothesIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      location: 'all'
    };
  }
  static contextType = StoreContext;
  handleClick = (event) =>  {
    this.setState({location: event.key});
  }
  async getCategoryData() {
    await this.setState({location: this.props.location.pathname.split('/')[2]}); // set current location
    userCollection.doc(`${auth.currentUser.uid}`).collection(`categories`).doc(this.state.location)
    .onSnapshot(function(doc) {
      console.log("Current data: ", doc.data())
    });
  }
  componentDidMount() {
    this.getCategoryData();
  }
  render() {
    const links = [
      { to: 'all', text: 'All' },
      { to: 'hats', text: 'Hats' },
      { to: 'shirts', text: 'Shirts' },
      { to: 'pants', text: 'Pants' },
      { to: 'shoes', text: 'Shoes' },
    ];
    const sortMenu = (
      <Menu>
        <Menu.Item>Date Modified</Menu.Item>
        <Menu.Divider/>
        <Menu.Item>Date Added</Menu.Item>
        <Menu.Divider/>
        <Menu.Item>Color</Menu.Item>
      </Menu>
    );
    return (
      <Wrapper>
        <Card>
          <LeftSidePanel>
            <TabContainer>
              <Menu onClick={(event) => this.handleClick(event)} style={{ maxWidth: 200 }}>
                {links.map((link) => (
                  <Tab style={{ height: 100, fontSize: 26}} key={link.to}>
                    <Link to={`/my-wardrobe/${link.to}`}>{link.text}</Link>
                  </Tab>
                ))}
              </Menu>
            </TabContainer>
          </LeftSidePanel>
          <RightSide>
            <CardHeader>
              # of total items
              <Dropdown overlay={sortMenu} placement="bottomCenter">
                <SortButton>Sort By</SortButton>
              </Dropdown>
            </CardHeader>
            <ClothingRow></ClothingRow>
            <ClothingRow></ClothingRow>
            <ClothingRow></ClothingRow>
          </RightSide>
        </Card>
        {/* <h2>Hi! This is Clothes Index Page</h2>

        <div>
          go to
          <Link to="/clothes-detail">Clothes Detail Page</Link>
        </div>*/}

        {/* <div>
          links to other categories:
          <ul>
            {links.map((link, i) => (
              <li key={i}>
                <Link to={`/my-wardrobe/${link.to}`}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </div> */}
      </Wrapper>
    );
  }
}
