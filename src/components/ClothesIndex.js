import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import intersection from 'lodash/intersection';
import { Menu, Dropdown, message } from 'antd';
import { StoreContext } from '../stores';
import firebase from '../firebase';
import Loading from './Loading';

// Data objects
const db = firebase.firestore(); // database object

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
  width: 800px;
  height: ${ContainerCard.height};
  padding: 0 20px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    height: 100px;
  }

  .imgs-wrapper {
    flex: 1;
    overflow: auto;
    a {
      display: inline-block;
      margin: 10px;
      width: calc(${100 / 4}% - ${2 * 10}px);
      position: relative;
      border: 2px solid #46a0fc;
      background: #fff;
      .img-wrapper {
        padding-top: 100%;

        img {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      }
    }
  }
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

@withRouter
@observer
export default class ClothesIndex extends React.Component {
  static contextType = StoreContext;
  state = {
    loading: false,
    categories: {
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    },
    filteredCategories: {
      all: [],
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    },
    tags: [],
    filteredTags: [],
  };

  componentDidMount() {
    this.getData();
  }

  handleClick = event => {
    this.setState({ location: event.key });
    this.setState({ fetched: false });
  };

  /**
   * Sorts images by time created or by last modified time
   */
  handleSort = event => {
    console.log('handleSort', event.key);
    // sort clothes by createdAt or updatedAt
    // TODO: do this in updateFiltered together
    const filteredCategories = {
      ...this.state.filteredCategories,
    };

    Object.keys(filteredCategories).forEach(category => {
      const clonedArray = [...filteredCategories[category]];
      clonedArray.sort((a, b) => b[event.key].toDate() - a[event.key].toDate());

      filteredCategories[category] = clonedArray;
    });

    this.setState({ filteredCategories });
  };

  getData = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;

    this.setState({ loading: true });

    db.collection('users')
      .doc(uid)
      .collection('clothes')
      .get()
      .then(querySnapshot => {
        const categories = {
          hats: [],
          shirts: [],
          pants: [],
          shoes: [],
        };
        const tagSet = new Set();
        querySnapshot.forEach(doc => {
          const c = doc.data();
          categories[c.category].push({
            id: doc.id,
            ...c,
          });
          // add tag to tags Set
          c.tags.forEach(tag => tagSet.add(tag));
        });

        const tags = [...tagSet];
        tags.sort();

        this.setState(
          {
            loading: false,
            categories,
            tags,
          },
          () => {
            // also need to update filtered result
            this.updateFiltered();
          }
        );
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  };

  // apply filter to all clothes in categories and save to filteredCategories
  // call this method everytime filteredTags changes
  updateFiltered = () => {
    const { categories, filteredTags } = this.state;
    const filteredCategories = {
      all: [],
    };

    Object.keys(categories).forEach(category => {
      filteredCategories[category] = categories[category].filter(c => {
        if (filteredTags.length === 0) return true; // no filters
        // filter by all tags in filteredTags:
        // the intersection needs to be the same length
        return intersection(c.tags, filteredTags).length === filteredTags.length;
      });
      filteredCategories.all = filteredCategories.all.concat(filteredCategories[category]);
    });
    this.setState({ filteredCategories });
  };

  render() {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    const { loading, filteredCategories } = this.state;

    const links = [
      { to: 'all', text: 'All' },
      { to: 'hats', text: 'Hats' },
      { to: 'shirts', text: 'Shirts' },
      { to: 'pants', text: 'Pants' },
      { to: 'shoes', text: 'Shoes' },
    ];
    const sortMenu = (
      <Menu onClick={this.handleSort}>
        <Menu.Item key="updatedAt">Date Modified</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="createdAt">Date Added</Menu.Item>
      </Menu>
    );
    return (
      <Wrapper>
        <Loading loading={loading} />

        <ContainerCard>
          <LeftSidePanel>
            <TabContainer>
              <Menu onClick={this.handleClick} style={{ maxWidth: 200 }}>
                {links.map(link => (
                  <Tab style={{ height: 100, fontSize: 26 }} key={link.to}>
                    <Link to={`/my-wardrobe/${link.to}`}>{link.text}</Link>
                  </Tab>
                ))}
              </Menu>
            </TabContainer>
          </LeftSidePanel>
          <RightSide>
            <div className="header">
              {filteredCategories[type].length}{' '}
              {filteredCategories[type].length === 1 ? `item` : `items`}
              <Dropdown overlay={sortMenu} placement="bottomCenter">
                <SortButton>Sort By</SortButton>
              </Dropdown>
            </div>
            <div className="imgs-wrapper">
              {filteredCategories[type].map((clothes, i) => (
                <Link key={i} to={`/clothes-detail/${clothes.id}`}>
                  <div className="img-wrapper">
                    <img src={clothes.url} />
                  </div>
                </Link>
              ))}
            </div>
          </RightSide>
        </ContainerCard>
      </Wrapper>
    );
  }
}
