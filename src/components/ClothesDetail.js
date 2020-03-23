import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { /*Link,*/ withRouter } from 'react-router-dom';
import styled from 'styled-components';
import placeholderImg from '../images/mywardrobe-tshirt.png';
import backImg from '../images/back.png';
import deleteImg from '../images/delete.png';
import editImg from '../images/pen.png';
import { Button } from 'antd';

const Wrapper = styled.div`
  width: 75%;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  width: 100%;
  background-color: #e9e9e9;
  border-radius: 30px;
`;

const Top = styled.div`
  padding: 1rem 1rem;

  .backButton {
    background: url(${backImg}) center/60% no-repeat;
    background-color: #e2dcfe;
  }

  .editButton {
    float: right;
    background: url(${editImg}) center/60% no-repeat;
    background-color: #e2dcfe;
  }

  .deleteButton {
    float: right;
    background: url(${deleteImg}) center/60% no-repeat;
    background-color: #e2dcfe;
    margin-left: 10px;
  }
`;
const Bottom = styled.div`
  padding: 3rem 3rem;
  .saveButton {
    float: right;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
  }
`;

const ClothingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;
const Left = styled.div`
  width: 50%;
  text-align: center;
  img {
    width: 80%;
  }
`;
const Right = styled.div`
  width: 50%;
  font-size: 20px;
  .label {
    font-size: 14px;
    color: #838383;
  }
  .addTagButton {
    border-radius: 10px;
    background-color: #e2dcfe;
  }
`;

@withRouter
@observer
export default class ClothesDetail extends React.Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = { isEdit: false };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  delete() {}

  edit = () => {
    this.setState({ isEdit: true });
  };

  save = () => {
    this.setState({ isEdit: false });
  };

  render() {
    return (
      <Wrapper>
        <Card>
          <Top>
            <div className="topButtons">
              <Button className="backButton" shape="circle" size="large" onClick={this.goBack} />
              <Button className="deleteButton" shape="circle" size="large" />
              <Button
                className="editButton"
                shape="circle"
                size="large"
                onClick={this.edit}
                style={{ display: this.state.isEdit ? 'none' : 'block' }}
              />
            </div>
          </Top>

          <ClothingContent>
            <Left>
              <div className="clothingImage">
                <img src={placeholderImg} />
              </div>
            </Left>

            <Right>
              <div className="dateAdded">
                <div className="label">Date added:</div>
                <div>02/27/2020 21:05</div>
              </div>
              <br />
              <div className="dateModified">
                <div className="label">Date modified:</div>
                <div>02/27/2020 21:05</div>
              </div>
              <br />
              <div className="categories">
                <div className="label">Categories:</div>
                <div>
                  <Button
                    className="addTagButton"
                    style={{ display: this.state.isEdit ? 'block' : 'none' }}
                  >
                    + Add New Tags
                  </Button>
                </div>
              </div>
              <br />
            </Right>
          </ClothingContent>

          <Bottom>
            <Button
              type="primary"
              className="saveButton"
              onClick={this.save}
              style={{ display: this.state.isEdit ? 'block' : 'none' }}
            >
              Save
            </Button>
          </Bottom>
        </Card>
      </Wrapper>
    );
  }
}
