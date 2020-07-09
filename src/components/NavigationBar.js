import React from 'react';
import { Link } from "react-router-dom";
import { Menu, Row, Col } from 'antd';
import logo from '../assets/CAHLLogo.png'
import logoText from '../assets/CAHLLogoText.png'
import { MenuOutlined } from '@ant-design/icons'
import { IsAdmin } from '../AdminContextProvider'

export const NavigationBar = () => {
  return (
    <>
      <Row className="gradient">
        <Col xs={22} md={9} lg={8}>
          <Link to="/">
            <img
              alt=""
              src={logo}
              width="50px"
              height="50px"
            />
            <img
              alt="Logo Text"
              src={logoText}
              height="50px"
              width="200px"
            />
          </Link>
        </Col>
        <Col xs={2} md={15}>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px', background: "none" }}
            className="navbar"
            overflowedIndicator={
              <MenuOutlined />
            }
          >
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/stats">
              <Link to="/stats">Stats</Link>
            </Menu.Item>
            <Menu.Item key="/teams">
              <Link to="/teams">Teams</Link>
            </Menu.Item>
            <Menu.Item key="/gameRecap">
              <Link to="/gameRecap">Recap</Link>
            </Menu.Item>
            {IsAdmin() &&
              <Menu.Item key="/logout">
                <Link to="/admin">Admin</Link>
              </Menu.Item>
            }
          </Menu>
        </Col>
      </Row>
    </>
  )
}

