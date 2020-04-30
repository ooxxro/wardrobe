import React from 'react';
import { observer } from 'mobx-react';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { StoreContext } from '../stores';
import firebase from '../firebase';
import DesignComponent from './DesignComponent';
import Loading from './Loading';

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

@withRouter
@observer
export default class Design extends React.Component {
  static contextType = StoreContext;

  state = {
    loading: true,
    categories: null,
    tags: null,
  };

  componentDidMount() {
    this.getClothesData()
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

  getClothesData = () => {
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

        this.setState({
          categories,
          tags,
        });
      });
  };

  render() {
    const { loading, categories, tags } = this.state;

    return loading ? (
      <LoadingWrapper>
        <Loading loading={loading} backdrop={false} />
      </LoadingWrapper>
    ) : (
      <DesignComponent from="design" categories={categories} tags={tags} />
    );
  }
}
