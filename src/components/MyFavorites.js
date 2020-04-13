import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
//import heartImg from '../images/myfavorites_heart.svg';
import firebase from '../firebase';

const Wrapper = styled.div``;
const ContainerCard = styled.div`
  max-width: 1000px;
  height: 700px;
  margin: 10px;
  border-radius: 20px;
  font-size: 26px;
  font-weight: bold;
  border: 1px solid currentColor;
  background-color: #e0dcf4;
`;

const CardHeader = styled.div`
  margin-left: 10%;
  margin-right: 10%;
  padding-top: 2rem;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10%;
  margin-right: 10%;
  .outfit {
    display: flex;
    flex: 0 0 150px;
    position: relative;
  }
  .outfitbg {
    position: absolute;
    height: 200px;
    width: 125px;
    border-radius: 10px;
  }
  .outfithat {
    position: absolute;
    margin-left: 37.5px;
    height: 50px;
    width: 50px;
  }
  .outfitshirt {
    position: absolute;
    margin-left: 37.5px;
    margin-top: 50px;
    height: 50px;
    width: 50px;
  }
  .outfitpants {
    position: absolute;
    margin-left: 37.5px;
    margin-top: 100px;
    height: 50px;
    width: 50px;
  }
  .outfitshoes {
    position: absolute;
    margin-left: 37.5px;
    margin-top: 150px;
    height: 50px;
    width: 50px;
  }
`;

@withRouter
@observer
export default class MyFavorites extends React.Component {
  static contextType = StoreContext;

  state = {
    outfitBgs: [],
    outfitHats: [],
    outfitShirts: [],
    outfitPants: [],
    outfitShoes: [],
    fetched: false,
  };

  componentDidMount() {
    this.getOutfitData();
  }

  getOutfitData = () => {
    if (this.state.fetched) return;

    let db = firebase.firestore();
    let ids = [];
    let bgs = [];
    let hats = [];
    let shirts = [];
    let pants = [];
    let shoes = [];

    const promises = [];
    let promise = db
      .collection('users/' + firebase.auth().currentUser.uid + '/outfits')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          ids.push(doc.id);
          bgs.push(doc.data().bgUrl);
          hats.push(doc.data().hat[1]);
          shirts.push(doc.data().shirt[1]);
          pants.push(doc.data().pants[1]);
          shoes.push(doc.data().shoes[1]);
        });
      });
    promises.push(promise);

    Promise.all(promises).then(() => {
      this.setState({
        outfitIds: ids,
        outfitBgs: bgs,
        outfitHats: hats,
        outfitShirts: shirts,
        outfitPants: pants,
        outfitShoes: shoes,
        fetched: true,
      });
    });
  };

  render() {
    return (
      <Wrapper>
        <ContainerCard>
          <CardHeader>My Favorites</CardHeader>
          <CardContent>
            {(this.state.outfitIds || []).map((id, index) => {
              return (
                <div className="outfit" key={index}>
                  <img className="outfitbg" src={this.state.outfitBgs[index]} />
                  <img className="outfithat" src={this.state.outfitHats[index]} />
                  <img className="outfitshirt" src={this.state.outfitShirts[index]} />
                  <img className="outfitpants" src={this.state.outfitPants[index]} />
                  <img className="outfitshoes" src={this.state.outfitShoes[index]} />
                </div>
              );
            })}
          </CardContent>
        </ContainerCard>
      </Wrapper>
    );
  }
}
