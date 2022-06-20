import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Checkbox, Alert, Row, Spin, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../../../css/index.css';

const Login = () => {
    
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [visible, setVisible] = useState(false);

    const onFinish = (values) => {
        setLoadingStatus(true);

        axios.post(`http://localhost:8080/api/auth/signin`, { 
            username: values["username"], 
            password:  values["password"],
            name: "asdasd",
            roles: ["ROLE_ADMIN"]
        })
        .then(res => {
            console.log(res.data.data.roles[0].name);
            if(res.data.status === "Ok"){
                if(res.data.data.roles[0].name == 'ROLE_ADMIN') {
                    document.cookie = "name="+res.data.data.name;
                    document.cookie = "id="+res.data.data.id;
                    document.cookie = "token="+res.data.data.rememberToken;
                    window.location = "/admin/dashboard";
                }
                else {
                    setLoadingStatus(false);
                    setVisible(true);
                }
            }
            
        })
        .catch(e => {
            setLoadingStatus(false);
            setVisible(true);
        })
        
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Fragment>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: false
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
                {visible ? <><Alert
                message="Login failed"
                className='mb-10'
                type="error"
                showIcon
                closable
                /></> : <></>}
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,                            
                        }
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,                    
                        }
                    ]}
                >
                    <Input.Password
                        prefix={
                            <LockOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item className="inline-flex">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>
                <Row justify="center">
                    <Form.Item>
                        {loadingStatus == true ? (
                            <div style={{ textAlign: "center" }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Button type="primary" htmlType="submit">
                            Login
                            </Button>
                        )}
                    </Form.Item>
                </Row>
            </Form>
        </Fragment>
    )
    
}
export default Login;
if (document.getElementById('login-container')) {
    ReactDOM.render(<Login />, document.getElementById('login-container'));
}