import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SimpleDialog from './SimpleDialog';
import {
  Button,
  SvgIcon,
  IconButton,
  Zoom,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Popover,
} from '@material-ui/core';
import userBgImg from '../images/userBgImg.jpg';
import IOSSwitch from './IOSSwitch';
import { ReactComponent as UndoIcon } from '../images/undo.svg';
import { ReactComponent as LockIcon } from '../images/lock.svg';
import { ReactComponent as FilterIcon } from '../images/filter.svg';
import { ReactComponent as GoBackIcon } from '../images/goback.svg';
import { ReactComponent as EditPicIcon } from '../images/editpic.svg';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  display: flex;
  justify-content: center;
  padding: 50px 40px 55px;
  position: relative;
`;

const GoBack = styled.div`
  position: absolute;
  top: 25px;
  left: 25px;
  .goBack {
    background: #e3ddff;
    &:hover {
      background: #d7cffc;
    }
  }
`;

const Random = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 25px;
  .random {
    padding: 0;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #8ff2b8;
    border-radius: 50%;
    /* padding: 44px 20px; */
    width: 70px;
    height: 70px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 70px;
    color: #212121;
    &:hover {
      background: #75eda7;
      color: #212121;
    }
  }
`;
const Picture = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  &:hover {
    .editPic {
      transition: 0.4s;
      opacity: 1;
    }
  }
`;

const EditPic = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  .editPic {
    opacity: 0;
    transition: 0.4s;
    background: #e3ddff;
    font-size: 16px;
    padding: 5px;
    &:hover {
      background: #d7cffc;
    }
  }
`;
const ImgWrapper = styled.div`
  width: 300px;
  height: 400px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`;
const IconCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-left: 25px;
`;

const Save = styled.div`
  .save {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    border-radius: 50%;
    color: #212121;
    padding: 0;
    min-width: 60px;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const UpperIcon = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  .undo {
    background: #f7d49e;
    margin-bottom: 10px;
    &:hover {
      background: #fcce88;
    }
  }
  .lock {
    margin-left: 10px;
    background: #fecdda;
    &:hover {
      background: #fcbbcc;
    }
  }
`;

const Lock = styled.div`
  background: #fecdda;
  padding: 6px;
  .lockItem {
    padding: 5px 10px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #ff7298;
    }
    .MuiSwitch-root {
      margin: 0;
      margin-right: 10px;
    }
  }
`;

const ChooseClothes = styled.div`
  margin-left: 25px;
  width: 250px;
  height: 400px;
  background: #cde6fe;
  border-radius: 20px;
  .filter {
    background: #d8d0fc;
    border: 0.5px solid white;
    &:hover {
      background: #cbbfff;
    }
  }
`;
const CheckboxoxList = styled.div`
  padding: 0 6px;
  background: #d8d0fc;
  .filterItem {
    padding-right: 11px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #8c72ff;
    }
    span {
      font-size: 14px;
    }
  }
  .MuiFormControlLabel-root {
    margin: 0;
  }
  .MuiSvgIcon-root {
    color: #7d64e1;
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;

@withRouter
@observer
export default class DesignComponent extends React.Component {
  static contextType = StoreContext;

  state = {
    open: false,
    // filter
    turnon: false,
    summer: false,
    pink: false,
    // dialogs
    dialogOpen: false,
    goBackDialogOpen: false,
  };

  onSave = () => {
    this.setState({ dialogOpen: true });
  };

  onEditDone = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const { from } = this.props;
    const { dialogOpen, goBackDialogOpen } = this.state;
    let buttonsZone;
    let goBackButtonsZone = [
      { text: 'Cancel, Continue Editing', onClick: () => {} },
      { text: 'Exit without Saving', exit: true, onClick: () => {} },
    ];
    // let description;

    if (from === 'design') {
      buttonsZone = [
        { text: 'Download', onClick: () => {} },
        { text: 'Save to My Favorites', onClick: () => {} },
        { text: 'Exit without Saving', exit: true, onClick: () => {} },
      ];
    } else {
      buttonsZone = [
        { text: 'Download', onClick: () => {} },
        { text: 'Save to Current', onClick: () => {} },
        { text: 'Save as New', onClick: () => {} },
        { text: 'Exit without Saving', exit: true, onClick: () => {} },
      ];
    }

    return (
      <Wrapper>
        {from === 'edit' && (
          <GoBack>
            <Tooltip arrow title="Go back" TransitionComponent={Zoom} placement="top">
              <IconButton
                className="goBack"
                onClick={() => this.setState({ goBackDialogOpen: true })}
              >
                <SvgIcon fontSize="small">
                  <GoBackIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </GoBack>
        )}
        <Random>
          <Button className="random" variant="contained">
            Random
          </Button>
        </Random>
        <Picture>
          <ImgWrapper>
            <img src={userBgImg} />
          </ImgWrapper>
          <EditPic>
            <Tooltip arrow title="Change background" TransitionComponent={Zoom} placement="top">
              <IconButton className="editPic" size="small">
                <SvgIcon fontSize="inherit">
                  <EditPicIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </EditPic>
        </Picture>
        <IconCol>
          <UpperIcon>
            <Tooltip arrow title="Undo" TransitionComponent={Zoom} placement="top">
              <IconButton className="undo">
                <SvgIcon fontSize="small">
                  <UndoIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Lock categories" TransitionComponent={Zoom} placement="top">
              <IconButton
                ref={el => (this.lockBtnRef = el)}
                className="lock"
                onClick={() => this.setState({ open: true })}
              >
                <SvgIcon fontSize="small">
                  <LockIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Popover
              open={this.state.open}
              anchorEl={this.lockBtnRef}
              onClose={() => this.setState({ open: false })}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Lock>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Hat
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Shirt
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Pants
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Shoes
                </div>
              </Lock>
            </Popover>
          </UpperIcon>

          <Save>
            {from === 'design' ? (
              <Button className="save" variant="contained" onClick={this.onSave}>
                Save
              </Button>
            ) : (
              <Button className="save" variant="contained" onClick={this.onEditDone}>
                Done
              </Button>
            )}
          </Save>
        </IconCol>
        <ChooseClothes>
          <Tooltip arrow title="Filter categories" TransitionComponent={Zoom} placement="top">
            <IconButton
              className="filter"
              ref={el => (this.filterBtnRef = el)}
              onClick={() => this.setState({ turnon: true })}
            >
              <SvgIcon fontSize="small">
                <FilterIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
          <Popover
            open={this.state.turnon}
            anchorEl={this.filterBtnRef}
            onClose={() => this.setState({ turnon: false })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* TODO: show all user defined tags */}
            <CheckboxoxList>
              <div className="filterItem">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.summer}
                      onChange={() => this.setState(state => ({ summer: !state.summer }))}
                      name="summer"
                      color="primary"
                    />
                  }
                  label="Summer"
                />
              </div>
              <div className="filterItem">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.pink}
                      onChange={() => this.setState(state => ({ pink: !state.pink }))}
                      name="pink"
                      color="primary"
                    />
                  }
                  label="Pink"
                />
              </div>
            </CheckboxoxList>
          </Popover>
        </ChooseClothes>

        <SimpleDialog
          open={dialogOpen}
          type="success"
          buttons={buttonsZone}
          onClose={() => this.setState({ dialogOpen: false })}
        />
        <SimpleDialog
          open={goBackDialogOpen}
          type="warning"
          description={
            <span>
              Are you sure
              <br />
              you want to exit without saving?
            </span>
          }
          buttons={goBackButtonsZone}
          onClose={() => this.setState({ goBackDialogOpen: false })}
        />
      </Wrapper>
    );
  }
}
