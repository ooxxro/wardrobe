import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import styled from 'styled-components';

import { StoreContext } from '../stores';
import DesignComponent from './DesignComponent';
import firebase from '../firebase';
import Loading from './Loading';

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

@withRouter
@observer
export default class MyFavoritesEdit extends React.Component {
  static contextType = StoreContext;

  state = {
    loading: true,
    outfit: null,
    categories: null,
    tags: null,
    selectedClothes: null,
  };

  componentDidMount() {
    this.getOutfitData()
      .then(outfit => this.getClothesData(outfit))
      .then(() => {
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  }

  getOutfitData = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const { outfitId } = this.props.match.params;

    const db = firebase.firestore();
    return db
      .collection('users')
      .doc(uid)
      .collection('outfits')
      .doc(outfitId)
      .get()
      .then(doc => {
        const outfit = {
          id: doc.id,
          ...doc.data(),
        };

        this.setState({ outfit });

        return outfit;
      });
  };

  getClothesData = outfit => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const db = firebase.firestore();

    return db
      .collection('users')
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
        const selectedIds = outfit.clothes.map(c => c.id);
        const selectedClothes = [...outfit.clothes];

        querySnapshot.forEach(doc => {
          const c = {
            id: doc.id,
            ...doc.data(),
          };
          categories[c.category].push(c);

          const index = selectedIds.indexOf(doc.id);
          if (index !== -1) {
            selectedClothes[index] = c;
          }
          // add tag to tags Set
          c.tags.forEach(tag => tagSet.add(tag));
        });

        const tags = [...tagSet];
        tags.sort();

        this.setState({
          categories,
          tags,
          selectedClothes,
        });
      });
  };

  render() {
    const { loading, outfit, categories, tags, selectedClothes } = this.state;

    return loading ? (
      <LoadingWrapper>
        <Loading loading={loading} backdrop={false} />
      </LoadingWrapper>
    ) : (
      <DesignComponent
        from="edit"
        categories={categories}
        tags={tags}
        editOutfit={outfit}
        editSelectedClothes={selectedClothes}
      />
    );
  }
}
