import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router , Routes, Route} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Row, Col, Avatar, Dropdown   } from 'antd';
import Dashboard from "./Components/Pages/Dashboard/Dashboard"
import ProductList from "./Components/Pages/Product/ProductList"
import AddProduct from "./Components/Pages/Product/AddProduct"
import CategoryList from './Components/Pages/Category/CategoryList';
import DiscountList from './Components/Pages/Discount/DiscountList';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  AppstoreOutlined,
  UploadOutlined,
  InboxOutlined
} from '@ant-design/icons';
import '../../../../css/index.css'
import SiderBar from "./Components/Layout/SiderBar"
import '../../../../sass/style.scss';
import Cookies from 'js-cookie';
import OrderList from './Components/Pages/Order/OrderList';


const { Header, Sider, Content, Footer} = Layout;

const { SubMenu } = Menu;
class SiderLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  
  

  render() {
    function onLogout() {
        Cookies.remove('token', { path: '' })
        Cookies.remove('name', { path: '' })
        window.location = "/admin/login"
     
    }
    const menu = (
      <Menu>
        <Menu.Item key={1} onClick={() => onLogout()}>Logout</Menu.Item>
      </Menu>
    );
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <SiderBar collapsed={this.state.collapsed}/>
          
          <Layout className="site-layout" style={{ padding: '0 24px 24px' }}>
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <Row justify='space-between'>
                <Col>
                  {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: this.toggle,
                  })}
                </Col>
                <Col>
                  <Row align='middle' gutter={[8,8]} style={{ paddingRight: '22px' }}>
                    <Col>Nguyen Minh Huan</Col>
                    <Col>
                      <Dropdown overlay={menu} placement="bottomLeft" arrow>
                        <Avatar icon={<UserOutlined />} />
                      </Dropdown>
                    </Col>
                  </Row>
                   
                </Col>
              </Row>

              
            </Header>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
            <Content
              className="site-layout-background"
              style={{
               
              }}
            >
              <Routes>
                <Route path='/admin/dashboard' element={<Dashboard/>}/>
                <Route path='/admin/product' element={<ProductList/>}/>
                <Route path='/admin/product/add-product' element={<AddProduct/>}/>
                <Route path='/admin/category' element={<CategoryList/>}/>
                <Route path='/admin/discount' element={<DiscountList/>}/>
                <Route path='/admin/order/' element={<OrderList/>}/>
              </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Group 14 - PTIT - Design 2022</Footer>
          </Layout>
        </Layout>
    );
  }
}

export default SiderLayout;


if (document.getElementById('root')) {
    ReactDOM.render(
        <Router>
          <SiderLayout />
        </Router>
    , 
    document.getElementById('root'));
}