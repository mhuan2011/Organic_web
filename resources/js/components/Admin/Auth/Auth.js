import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import Cookies from 'js-cookie';
import Login from './Login';



const Auth = () => {
    const [loadingStatus, setLoadingStatus] = useState(false);
    return (
        <Card
            title="Organic web admin"
            className="loginPageContainer"
            style={{boxShadow: '-30px 30px 50px rgb(0 0 0 / 32%)'}}
        >
            <Login 
            />
        </Card>
    );
}
export default Auth;
if (document.getElementById('login-container')) {
    ReactDOM.render(<Auth />, document.getElementById('login-container'));
}