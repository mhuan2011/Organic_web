import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Table, Space, Popconfirm, Avatar,
    Input, Button, Row, Tag, Steps,
    Col, Spin, 
    Image,
    Card
} from "antd";
import { UserOutlined, MailOutlined, UploadOutlined, ReconciliationOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import ActOrder from "../Order/ActOrder";
import axios from 'axios';
import helper from "../../Helper/helper";

const { Step } = Steps;
const { Search } = Input;
const OrderList = ({}) => {
    const [loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState("");
   

    let navigate = useNavigate();

    useEffect(() => { 
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Orders/sort?type=DESC`)
        .then(res => {
            const result = res.data;
            console.log(result);
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });

            
       
    }, []);

    useEffect(() => {
        if(refresh) {
            setLoading(true);
            axios.get(`http://localhost:8080/api/v1/Orders/sort?type=DESC`)
            .then(res => {
                const result = res.data;
                setData(result);
            })
            .catch(error => console.log(error))
            .finally(() => {
                setLoading(false);
            });
        }
    },[refresh])

    const setRouter = () => {
        navigate("/admin/product/add-product");
    }

    const getdata = () => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Orders/sort?type=DESC`)
        .then(res => {
            const result = res.data;
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }

    const getDataSearch = (value) => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Orders/` + value)
        .then(res => {
            const result = res.data;
            var arrayTemp = [];
            arrayTemp.push(result.data);
            console.log(arrayTemp);
            setData(arrayTemp);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }

    const onSearch = (value) => {
        if(value != "") {
            getDataSearch(value);
        }else {
            getdata();
        }
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 100,
            fixed: "left",
            align: "center",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Customer",
            dataIndex: "user",
            key: "dsscount",
            ellipsis: true,
            width: 200,
            render: (user) => {
                var source = "http://localhost:8080/images/uploads/avt.jpg";
                if(user.imageUser!= null){
                    source =  user.imageUser.link != null? user.imageUser.link : "";
                }
                var src = "";
                let ip = source.substring(7,18);
                if(source.indexOf('localhost')  < 0) {
                    if(source != "") src =  source.replace(ip, "localhost");
                } else src = source;
               return (
                    <>
                        <Avatar src={<Image src={src} style={{ width: 45 }} />} /> {user.name}
                    </>
               )
            },
        },
        {
            title: "Create at",
            dataIndex: "createAt",
            key: "createAt",
            width: 150,
            ellipsis: true,
        },
        {
            title: "State",
            dataIndex: "state",
            key: "state",
            width: 150,
            ellipsis: true,
            filters: [
                {
                  text: 'Đã giao',
                  value: 'Đã giao',
                },
                {
                  text: 'Chưa duyệt',
                  value: 'Chưa duyệt',
                },
                {
                    text: 'Đã hủy',
                    value: 'Đã hủy',
                  },
            ],
            onFilter: (value, record) => record.state.indexOf(value) === 0,
            render: state => {
                let color = state == "Đã giao" ? color = 'green' : 'volcano';
                if (state == "Chưa duyệt") color = 'geekblue';
                if (state == "Đang giao") color = 'cyan';
                return (
                    <Tag color={color} key={state}>
                        {state.toUpperCase()}
                    </Tag>
                )
            }
            
        },
        {
            title: "Total Price (Not discount)",
            dataIndex: "orderDetails",
            key: "orderDetails",
            ellipsis: true,
            render: (_, record) => {
                var total = totalPrice(record.orderDetails);
               return (
                    <>
                        {helper.formatCurrency(total)}
                    </>
               )
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 150,
            align: "center",
            render: (_, record) => {
                return (
                    <Space size={5}>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => update(record)}
                        >
                            Detail
                        </Button>
                
                    </Space>
                );
            },
        },
    ];


    const totalPrice =( record ) => {
        var totalPrice = 0;
        record.map((item) => {
            totalPrice += item.price * item.quantity * (1 - item.discount);
        })
        return totalPrice
    }

    const update = (record) => {
        setItem(record);
        setVisible(true);

    }
    const openDraw = () =>{
        setItem({});
        setVisible(true);
    }

   

    return(
        <>
            <Card title="Order list" bordered={false} >
                <div >
                    <Spin tip="Loading..." spinning={loading}> 
                        <Table
                            title={(() => (
                                <Row gutter={[8, 8]}>
                                    <Col xs={24} xl={12}>
                                        {/* <Button type="primary" onClick={() => openDraw()} >Add Order</Button> */}
                                    </Col>
                                    <Col xs={24} xl={12}>
                                        <Search placeholder="Search by name !!!"  onSearch={onSearch}
                                            />
                                    </Col>
                                </Row>
                            ))}
                            columns={columns}
                            bordered={true}
                            scroll={{ x: 800 }}
                            dataSource={data}
                            rowKey='id'
                        />
                    </Spin> 
                </div>
            </Card>
            <ActOrder visible={visible} setDraw={setVisible} item={item} resetItem={setItem} reload={setRefresh}/>
        </>
    );
}
export default OrderList;

