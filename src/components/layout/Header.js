import React, { Component } from "react";
import styled from "styled-components";

import { MenuProvider } from "../../contexts/MenuContext";
import Toolbar from "../Toolbar/Toolbar";
import SideDrawer from "../SideDrawer/SideDrawer";
import Backdrop from "../Backdrop/Backdrop";

export default class Header extends Component {
  state = {
    sideDrawerOpen: false
  };
  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };
  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <Container>
        <MenuProvider
          value={{
            sideDrawerOpen: this.state.sideDrawerOpen,
            drawerToggle: (this.drawerToggleClickHandler = () => {
              this.setState(prevState => {
                return { sideDrawerOpen: !prevState.sideDrawerOpen };
              });
            })
          }}
        >
          <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
          <SideDrawer show={this.state.sideDrawerOpen} />
          {backdrop}
        </MenuProvider>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
`;
