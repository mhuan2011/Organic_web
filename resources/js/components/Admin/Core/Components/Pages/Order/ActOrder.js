
import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col, Avatar, Typography, Skeleton, Steps, Popconfirm, message, Card,
    Drawer, Spin, Tag, Select, Space, Image, List, Divider, Descriptions 
} from "antd";
import { UserOutlined, UploadOutlined , RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { create, delay } from "lodash";
import { useForm } from "rc-field-form";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import helper from '../../Helper/helper';
const { Step } = Steps;
const { Search, TextArea } = Input;
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 17 },
};
const { Option } = Select;

const intialValue = {
    name: "",
    description: "",
}
// const { Text, Link } = Typography;
const ActOrder = ({visible, setDraw, item, resetItem, reload}) => {
    const [loadingForm, setLoadingForm ] = useState(false);
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("");
    const [requiredField, setRequiredField] = useState(true);
    const [orderDetail, setOrderDetail] = useState({});
    const [userInfor, setUserInfor] = useState({});
    const [orderList, setOrderList] = useState([]);
    const [current, setCurrent] = useState(1);
    const [stateOrder, setStateOrder] = useState("");
    const [discount, setDiscount] = useState({});
    const [paymentSt, setPaymentSt] = useState(false);

    const setRouter = () => {
        navigate("/admin/product?id=1");
    }

    useEffect(() => {
        if(item.id != undefined) {
            getDetailOrder(item.id );
        }
        
    }, [item]);


    function getDetailOrder(orderId) {
        setLoadingForm(true);
        axios.get(`http://localhost:8080/api/v1/Orders/`+orderId)
        .then(res => {
            const result = res.data.data;

            if(result.state === "Đã giao") {
                setCurrent(3);
                setPaymentSt(false);
                
            }
            else if(result.state === "Đang giao") {
                setCurrent(2);
                setPaymentSt(false);
                
            }
            else if(result.state === "Đã hủy") {
                setStateOrder("error");
                setPaymentSt(true);
            }else {
                setPaymentSt(true);
            }
            console.log("result state: ", result.state)
            setOrderDetail(result);
            setDiscount(result.discount == null ? {} : result.discount);
            setUserInfor(result.user);
            setOrderList(result.orderDetails);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoadingForm(false);
        });
    }

    function onsubmit() {
        console.log(fileList);
    }

    const onChange = (value) => {
        if(["Đã hủy", "Đã giao"].includes(orderDetail.state)) return;
        if(value == 0) return;  
        if(value == 3) {
            axios.put(`http://localhost:8080/api/v1/Orders/updateState/`+orderDetail.id+`?state=Đã giao`)
            .then(res => {
                var result = res.data;
                if(result.status == 'OK') {
                    helper.Noti('success', '[Order] Update state', result.message);
                    reload(new Date());
                }
            })
            .catch(error => {
                helper.Noti('error', '[Order] Update state', result.message);
            })
            .finally(() => {
                setLoadingForm(false);
            });
        } 
        if(value == 2) {
            axios.put(`http://localhost:8080/api/v1/Orders/updateState/`+orderDetail.id+`?state=Đang giao`)
            .then(res => {
                var result = res.data;
                if(result.status == 'OK') {
                    helper.Noti('success', '[Order] Update state', result.message);
                    reload(new Date());
                }
            })
            .catch(error => {
                helper.Noti('error', '[Order] Update state', result.message);
            })
            .finally(() => {
                setLoadingForm(false);
            });
        }
        setCurrent(value);
    };

    const onClose = () => {
        setCurrent(1);
        resetItem({});
        setStateOrder("");
        setPaymentSt(true);
        setOrderDetail([]);
        setOrderList([]);
        setDraw(false);
    };

    const onSave = () => {
        form.validateFields()
        .then((values) => {
            var formData = new FormData()
            const category = {
                name: values.name,
                description: values.description ? values.description : ""
            }
            if(item.name != undefined){
                edit(category);
            }else {
                formData.append("file", values.image.file)
                formData.append("category", new Blob([JSON.stringify(category)], { type: 'application/json'}))
                storage(formData);
            }
        }).catch((errorInfo) => {
            console.log(errorInfo);
        }).finally(() => {
        });
    }

    const storage = (category) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };
        setLoadingForm(true);
        axios.post(`http://localhost:8080/api/v1/Categories/insert/v2`, category, axiosConfig
        ).then(function (response) {
            var result = response.data;
            if(result.status == "ok") {
                helper.Noti('success', '[Category] Insert', result.message);
                reload(new Date());
                onClose(true);
                setLoadingForm(false);
            }
            else {
                helper.Noti('error', '[Category] Insert', result.message);
            }
        }).catch(function (response) { 
            helper.Noti('error', '[Category] Insert', result.message);
            setLoadingForm(false);
        });

        
    }

    const edit = (formData) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "http://organicfood.com/",
            }
        };
        setLoadingForm(true);
        axios.put(`http://localhost:8080/api/v1/Categories/`+item.id, formData, axiosConfig
        ).then(function (response) {
            var result = response.data;
            if(result.status == "ok") {
                helper.Noti('success', '[Category] Update', result.message);
                reload(new Date());
                setLoadingForm(false);
                onClose(true);
            }
            else {
                helper.Noti('error', '[Category] Update', result.message);
            }
        }).catch(function (response) { 
            helper.Noti('error', '[Category] Update', result.message);
            setLoadingForm(false);
        });

        
    }

    const beforUploadImage = (file) => {
        var src = URL.createObjectURL(file);
        setUrl(src);
        return false;
    }

    const onPreview = (file) => {
        console.log("preview");
    };
    const confirm = () => {
        cancelOrder();
    };
    const cancelOrder = () => {
        if( ['Đã giao', 'Đã hủy', 'Đang giao'].includes(orderDetail.state)) {
            helper.Noti('warning', '[Order] Cancel', "Can not cancel this order");
        }
        else {
            axios.put(`http://localhost:8080/api/v1/Orders/updateState/`+orderDetail.id+`?state=Đã hủy`)
            .then(res => {
                var result = res.data;
                console.log(result);
                if(result.status == 'OK') {
                    helper.Noti('success', '[Order] Cancel', result.message);
                    reload(new Date());
                }
            })
            .catch(error => {
                helper.Noti('error', '[Order] Cancel', result.message);
            })
            .finally(() => {
                setLoadingForm(false);
            });
        }
        
    }

    const dataSource = [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
    ];

    function formartURL(source){
        var src = "";
        let ip = source.substring(7,18);
        if(source.indexOf('localhost')  < 0) {
            if(source != "") src =  source.replace(ip, "localhost");
        } else src = source;
        return src;
    }

    const totalPrice =( record ) => {
        var totalPrice = 0;
        record.map((item) => {
            totalPrice += item.price * item.quantity * (1 - item.discount);
        })
        return totalPrice
    }

    const payment = () => {
        var order_id = orderDetail.id + "";
        var amount = totalPrice(orderList) * (discount.percent != null &&  discount.percent != undefined? (1-discount.percent) : 1);

        var paymentVNpay = {
            order_id: order_id,
            amount: amount 
        }
        axios.post(`http://organicfood.com/api/payment`, paymentVNpay
        ).then(function (response) {
            var result = response.data;
            if(result.code == "00") {
                window.location = result.data;
            }
            else {
                helper.Noti('error', '[Order] payment', result.message);
            }
        }).catch(function (response) { 
            helper.Noti('error', '[Order] Cancel', response.message);
        });
    }
    return(
        <Drawer
            title="Order detail"
            width={600}
            onClose={onClose}
            visible={visible}
            extra={
            <Space> 
                {/* <Button onClick={onClose}>Close</Button> */}

                <Popconfirm placement="bottomRight" title={"Cancel order have ID: " + orderDetail.id} onConfirm={confirm} okText="Yes" cancelText="No">
                    <Button type="primary" danger>
                        Cancel an order
                    </Button>
                </Popconfirm>
                
            </Space>
            }
        >   
            <Spin tip="Loading..." spinning={false}>
            <h2>ORDER ID: <strong>{orderDetail.id}</strong></h2>
            <Divider orientation="left" orientationMargin="0">Customer Info</Divider>
            <Descriptions title="" column={2}>
                <Descriptions.Item label="Name">{userInfor.name}</Descriptions.Item>
                <Descriptions.Item label="Telephone">{userInfor.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{userInfor.email}</Descriptions.Item>
                <Descriptions.Item label="Address">
                {userInfor.address}
                </Descriptions.Item>
            </Descriptions>
            {/* <Descriptions title="Order detail"></Descriptions> */}
            <Divider orientation="left" orientationMargin="0">Order detail</Divider>
                <Skeleton
                    loading = {loadingForm}
                    avatar
                    active
                    paragraph={{
                    rows: 4,
                }}
                />
                <List
                itemLayout="horizontal"
                dataSource={orderList}
                renderItem={(item, index) => (
                <List.Item>
                    {  
                        <List.Item.Meta
                            key={index}
                            avatar={<Avatar size="large" src={formartURL(item.product.image.link)} />}
                            title={<a>{item.quantity + " x " + item.product.name} <Tag color="green">Sale {item.discount * 100}%</Tag></a>}
                            description= {
                                <>
                                    <Row justify="space-between">
                                        <Col>
                                            <Typography.Text delete>{ helper.formatCurrency(item.price *  item.quantity)} </Typography.Text>
                                            
                                        </Col>
                                        <Col>
                                            <h3>{ helper.formatCurrency(item.price * item.quantity * (1 - item.discount)) }</h3>
                                        </Col>
                                    </Row>
                                </>
                            }
                        />
                    }
                    
                </List.Item>
                )}

            />
            <Divider orientation="left" orientationMargin="0"></Divider>
            <Row justify="space-between">
                <Col>
                    
                    <Button onClick={payment} type="primary" disabled={paymentSt}>VNPAY payment</Button> 
                    
                </Col>
                <Col>
                    <Card
                        title="Total"
                        extra={<></>}
                        style={{
                            width: 300,
                        }}
                        >
                        <p>Total: {helper.formatCurrency(totalPrice(orderList))}</p>
                        <p>Discount: {discount.percent != null &&  (discount.percent != undefined? (discount.percent) : 0 )* 100} % </p>
                        <p>Total after discount: {helper.formatCurrency(totalPrice(orderList) * (discount.percent != null &&  discount.percent != undefined? (1-discount.percent) : 1))}</p>
                    </Card>
                </Col>
                
            </Row>
            <Spin tip="Loading..." spinning={loadingForm}>
                    <Divider orientation="left" orientationMargin="0">Progress delivery</Divider>
                    <Steps current={current} onChange={onChange} status={stateOrder}> 
                        <Step title="Order" description="Customer order" />
                        <Step title="Approve" subTitle="" description="Approve order" />
                        <Step title="Delivery" description="Delivery" />
                        <Step title="Done" description="Finish" />
                    </Steps>
                </Spin>
            </Spin>
        </Drawer>
    );
}
export default ActOrder;
