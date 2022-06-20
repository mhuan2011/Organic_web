import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Result } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import Cookies from 'js-cookie';



const ErrorPage = () => {
    const setRouter = () => {
        console.log("backhome")
        window.location = "/admin/dashboard";
    }

    return (
        <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={setRouter}>Back Home</Button>}
      />    
    );
}
export default ErrorPage;
if (document.getElementById('error-container')) {
    ReactDOM.render(<ErrorPage />, document.getElementById('error-container'));
}