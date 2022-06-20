import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  UploadOutlined,
  InboxOutlined,
  PieChartOutlined,
  PercentageOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const SiderBar = ({collapsed}) => {
  const history  = useNavigate();
  const location = useLocation();
  

  let pathname = location.pathname
  let arrPath = pathname.split("/");

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" >Organic Food</div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={arrPath[2]}
        >
          <Menu.Item key="dashboard" icon={<PieChartOutlined />}>
            <Link to={"/admin/dashboard"}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="product" icon={<InboxOutlined />}>
            <Link to={"/admin/product"}>Product</Link>
          </Menu.Item>
          <Menu.Item key="category" icon={<UnorderedListOutlined />}>
            <Link to={"/admin/category"}>Category</Link>
          </Menu.Item>
          <Menu.Item key="discount" icon={<PercentageOutlined />}>
            <Link to={"/admin/discount"}>Discount</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Order">
            <Menu.Item key="7"><Link to={"/admin/order"}>Order List</Link></Menu.Item>
            {/* <Menu.Item key="3">Add Category</Menu.Item> */}
          </SubMenu>
          <Menu.Item key="8" icon={<UploadOutlined />}>
            API
          </Menu.Item>
        </Menu>
      </Sider>
  );
}
export default SiderBar;