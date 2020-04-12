import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown, message, Card } from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import firebase from '../firebase';

// Data objects
const db = firebase.firestore(); // database object
const userCollection = db.collection('users'); // users collection

// DOM Elements
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContainerCard = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex: 1;
  max-width: 1000px;
  height: 700px;
  margin: 10px;
  border-radius: 20px;
  font-size: 26px;
  font-weight: bold;
  border: 1px solid currentColor;
  background-color: #fff;
`;
const LeftSidePanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  max-width: 200px;
  height: ${ContainerCard.height};
  padding-top: 25px;
  border-right: 1px solid currentColor;
`;
const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 800px;
  height: ${ContainerCard.height};
  padding-left: 20px;
`;
const TabContainer = styled.div`
  flex: 0.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 200px;
  height: ${ContainerCard.height};
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
  max-width: 100px;
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
  justify-content: center;
  align-items: center;
  text-align: center;
  width: ${RightSide.width};
  height: 200px;
  border-bottom: 1px solid currentColor;
`;
const ClothingItem = styled(Card)`
  display: flex;
  flex: 1;
  width: 220px;
  height: 220px;
  margin: 10px;
`;
@withRouter
@observer
export default class ClothesIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      location: 'all',
      items: [],    // Array of data objects for each item
      itemUrls: [], // Urls of each item
      itemPaths: [], // Storage image path for each item
      fetched: false
    };
  }
  static contextType = StoreContext;
  handleClick = (event) =>  {
    this.setState({location: event.key});
    this.setState({fetched: false});
  }
  getCategoryData = location => {
    const {userStore} = this.context;
    return userCollection
      .doc(userStore.currentUser.uid)
      .collection(`categories`)
      .doc(location)
      .get();
  }
  /**
   * This function handles the data returned from getCategoryData
   * such that the Promise returned resolves the data.
   */
  getData = (location) => {
    if (this.state.fetched) return;
    const {userStore} = this.context;
    let imagePaths = [];
    let imageURLs = [];
    this.getCategoryData(location)
    .then((doc) => {
      if (!doc.exists)
        return;
      let data = doc.data();
      this.setState({items: data.clothes});
      let storageRef = firebase.storage().ref();
      const promises = data.clothes.map((imgID) => {
        return userCollection
          .doc(`${userStore.currentUser.uid}`)
          .collection('clothes')
          .doc(imgID)
          .get()
          .then((res) => {
            imagePaths.push(res.data().imagePath);
            return storageRef
            .child(res.data().imagePath)
            .getDownloadURL()
            .then((url) => {
              return imageURLs.push(url);
            });
          });
        });
      
      Promise.all(promises).then(() => {
        this.setState({itemPaths: imagePaths, itemUrls: imageURLs.sort(), fetched: true}); // sort imageURLs so content always appears in the same order by link
      })
    })
    .catch(error => {
      message.error(error.message);
    });
  }

  /**
   * Function defines how clothing is displayed
   */
  displayData() {
    let numItems = this.state.items.length;
    let $items = this.state.itemUrls;
    if (numItems / 3 === 0) {
      if ($items[0] != null) {
        return (
          <>
        {this.state.itemUrls.map((url, i) => (
          <ClothingItem cover={<img src={url} style={{width: 220, height: 220}}/>} hoverable={true} key={i}/>
        ))}
        </>
        );
      }
      else {
        return <p>Sorry, there are no items saved in this category</p>
      }
    }
    else {
      let content = [];
        for (let j = 0; j < numItems / 3; j++) {
          content[j] = $items.slice(j * 3, 3 * (j + 1));
        }
        return (
          <>
          {content.map((item, i) => (
            <ClothingRow key={i}>
              {item.map((url, j) => (
                <ClothingItem cover={<img src={url} style={{width: 220, height: 220}}/>} hoverable={true} key={j} />
              ))}
            </ClothingRow>
          ))}
          </>
        );
    }
  }
  componentDidMount() {
    this.setState({ location: this.props.match.params.type }); // set current location
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
    this.getData(this.props.match.params.type);
    return (
      <Wrapper>
        <ContainerCard>
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
              {this.state.items.length} {this.state.items.length === 1 ? `item` : `items`}
              <Dropdown overlay={sortMenu} placement="bottomCenter">
                <SortButton>Sort By</SortButton>
              </Dropdown>
            </CardHeader>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1}}>
            {
              this.state.fetched ? // Only load if all the images have been set in itemUrls
              this.displayData()
               : <LoadingOutlined style={{fontSize:100}} />
            }
            </div>
          </RightSide>
        </ContainerCard>
      </Wrapper>
    );
  }
}
