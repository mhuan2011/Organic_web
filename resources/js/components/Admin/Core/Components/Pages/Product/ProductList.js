import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Table, Image,
    Space,
    Popconfirm,
    Input,
    Button,
    Row,
    Col,
    Switch,
    Breadcrumb,
    Card
} from "antd";
import { EyeInvisibleTwoTone, EyeTwoTone, EyeInvisibleOutlined, EyeOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import axios from 'axios';
import helper from '../../Helper/helper';
import Cookies from 'js-cookie';

const config = {
    headers: { Authorization: `${Cookies.get("token")}` }
};

const { Search } = Input;
const ProductList = ({}) => {
    const [loading, setLoading ] = useState(false);
    const [data, setData] = useState([]);
    let navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [refresh, setRefresh] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Products`)
        .then(res => {
            const result = res.data;
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
        
    },[refresh])

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Products`)
        .then(res => {
            const result = res.data;
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
        

            
       
    }, []);
    const setRouter = (str) => {
        navigate("/admin/product/" + str);
    }

    function onChange(checked) {
        console.log(`switch to ${checked}`);
      }
    const columns = [
        {
            title: "ID",
            dataIndex: "productId",
            key: "productId",
            width: 50,
            fixed: "left",
            align: "center",
        }
        ,
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: 70,
            render: (_, record) => {
                let source =  record.image ? record.image.link : "";
                var src = "";
                let ip = source.substring(7,18);
                if(source.indexOf('localhost')  < 0) {
                    if(source != "") src =  source.replace(ip, "localhost");
                } else src = source;
               return (
                    <Image 
                        width={50}
                        src={src}
                    />
               )
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 100,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            align: "center",
            width: 100,
            render: category => (
                <>
                     {category.name}
                </>
            )
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 200,
            align: "center",
        },
        {
            title: "Calculation_unit",
            dataIndex: "calculationUnit",
            key: "calculationUnit",
            width: 200,
            
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 100,
            
        },
        {
            title: "Display",
            dataIndex: "display",
            key: "display",
            width: 80,
            align: 'center',
            ellipsis: true,
            render: (_, record) => {
                const check = record['display'] == 1 ? true : 0;
                const displayIcon = () => {
                    if(check) return <EyeOutlined />
                    else return <EyeInvisibleOutlined />
                }
               return (
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked={check}
                            onChange={() => updateStateDisplay(record)}
                        />
                    
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

    const remove = (record) => {
        axios.delete(`http://localhost:8080/api/v1/Products/` + record.productId)
            .then(res => {
                helper.Noti('success', '[Product] Deleted', res.data.message);
                setRefresh(new Date());
            })
            .catch(error => {
                helper.Noti('error', '[Product] Deleted', error.message);
            })
            .finally(() => {
        });
    }

    const updateStateDisplay = (record) => {
        axios.put(`http://localhost:8080/api/v1/Products/display/` + record.productId)
        .then(res => {
            helper.Noti('success', '[Product] Update', res.data.message);
        })
        .catch(error => {
            helper.Noti('error', '[Product] Update', error.message);
        })
        .finally(() => {

        });
    }

    const update = (record) => {
        setRouter("add-product?id="+record['productId']);
    }

    const getdata = () => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Products`)
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
        axios.get(`http://localhost:8080/api/v1/Products/searchProductsByName/` + value)
        .then(res => {
            const result = res.data;
            setData(result.data);
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

    return(
        <Card title="Product List" bordered={false} >
            <div >
                <Table
                    title={(() => (
                        <Row gutter={[8, 8]}>
                            <Col xs={24} xl={12}>
                                <Button type="primary" onClick={() => setRouter("add-product")}>Add product</Button>
                            </Col>
                            <Col xs={24} xl={12}>
                                <Search placeholder="Search by name !!!" onSearch={onSearch}/>
                            </Col>
                        </Row>
                    ))}
                    columns={columns}
                    bordered={true}
                    loading={loading}
                    scroll={{ x: 800 }}
                    dataSource={data}
                    rowKey='productId'
                />
            </div>
        </Card>
    );
}
export default ProductList;

