import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Table,
    Space,
    Popconfirm,
    Input,
    Button,
    Row,
    Col,
    Image,
    Card
} from "antd";
import { UserOutlined, MailOutlined, UploadOutlined, ReconciliationOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import ActCategory from "../Category/ActCategory";
import axios from 'axios';
import helper from '../../Helper/helper';
import Cookies from "js-cookie";

const { Search } = Input;
const CategoryList = ({}) => {
    const [loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState("");

    let navigate = useNavigate();

    const config = {
        headers: { Authorization: `${Cookies.get("token")}` }
    };

    useEffect(() => { 
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Categories/v2`, config)
        .then(res => {
            const result = res.data;
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
            axios.get(`http://localhost:8080/api/v1/Categories/v2`, config) 
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

    const remove = (record) => {
        console.log(record.id);
        axios.delete(`http://localhost:8080/api/v1/Categories/` + record.id, config)
            .then(res => {
                helper.Noti('success', '[Category] Delete', res.data.message);
                setRefresh(new Date());
            })
            .catch(error => {
                helper.Noti('error', '[Category] Delete', error.message);
            })
            .finally(() => {
        });
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 50,
            fixed: "left",
            align: "center",
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: 200,
            render: (_, record) => {
                let source =  record['link']? record['link'] : "";
                var src = "";
                let ip = source.substring(7,18);
                if(source.indexOf('localhost')  < 0) {
                    if(source != "") src =  source.replace(ip, "localhost");
                } else src = source;
               return (
                    <Image 
                        width={100}
                        // height={50}
                        src={src}
                    />
               )
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            ellipsis: true,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
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
                            Edit
                        </Button>
                        <>||</>
                        <Popconfirm
                            title="Sure to delete?"
                            placement="leftTop"
                            onConfirm={() => remove(record)}
                        >
                            <Button type="link" size="small" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

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
            <Card title="Category list" bordered={false} >
                <div >
                    <Table
                        title={(() => (
                            <Row gutter={[8, 8]}>
                                <Col xs={24} xl={12}>
                                    <Button type="primary" onClick={() => openDraw()} >Add category</Button>
                                </Col>
                                <Col xs={24} xl={12}>
                                    <Search placeholder="Search by name !!!" 
                                        />
                                </Col>
                            </Row>
                        ))}
                        columns={columns}
                        bordered={true}
                        loading={loading}
                        scroll={{ x: 800 }}
                        dataSource={data}
                        rowKey='id'
                    />
                </div>
            </Card>
            <ActCategory visible={visible} setDraw={setVisible} item={item} resetItem={setItem} reload={setRefresh}/>
        </>
    );
}
export default CategoryList;

