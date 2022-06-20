import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Layout, Menu, Card } from 'antd';
import {
} from '@ant-design/icons';
import Overview from './Overview';
import ViewChart from './ViewChart';
import TopSlider from './TopSlider';
import Cookies from 'js-cookie';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Dashboard = () => {

    // console.log("cokkie", Cookies.get("token"));

    return (
        <>
            <Card title="Dashboard" bordered={false} >
                <div >
                    <Overview/>
                    <TopSlider/>
                    <ViewChart/>
                    {/* <ProductTable/> */}
                </div>
            </Card>
        </>
        
    )
}

export default Dashboard;