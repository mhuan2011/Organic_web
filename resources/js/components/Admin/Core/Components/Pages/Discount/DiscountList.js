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
    Image, Tag, Popover, 
    Card, Modal
} from "antd";
import { UserOutlined, MailOutlined, UploadOutlined, ReconciliationOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import ActDiscount from "../Discount/ActDiscount";
import axios from 'axios';
import QRCode from "react-qr-code";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const { Search } = Input;
const DiscountList = ({}) => {
    const [loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [codeQR, setCodeQR] = useState("");
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    let navigate = useNavigate();

    
    useEffect(() => { 
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Discounts`)
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
            axios.get(`http://localhost:8080/api/v1/Discounts`)
            .then(res => {
                const result = res.data;
                setData(result);
            })
            .catch(error => console.log(error))
            .finally(() => {
                setLoading(false);
            });

        }
    },[refresh]);

    const setRouter = () => {
        navigate("/admin/product/add-product");
    }

    const openModelDiscount = (code) => {
        setCodeQR(code)
        setModalVisible(true);
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 150,
            fixed: "left",
            align: "center",
            render: (id) => {
               return (
                    <Button onClick={() => openModelDiscount(id)}>
                        <h4>{id}</h4>
                    </Button>
               )
            },
        },
        {
            title: "Image",
            dataIndex: "imageDiscount",
            key: "imageDiscount",
            render: (_, record) => {
                const source =  record['imageDiscount']['link']? record['imageDiscount']['link'] : "";
                var src = "";
                let ip = source.substring(7,18);
                if(source.indexOf('localhost')  < 0) {
                    if(source != "") src =  source.replace(ip, "localhost");
                } else src = source;

               return (
                    <Image 
                        width={100}
                        height={50}
                        src={src}
                    />
               )
            },
        },
        {
            title: "Percent",
            dataIndex: "percent",
            key: "percent",
            ellipsis: true,
            render: (percent) => {
                return(
                    <>
                        <Tag color="success">{percent*100}%</Tag>
                    </>
                )
            }
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            ellipsis: true,
        },
        {
            title: "Start date",
            dataIndex: "startDate",
            key: "startDate",
            ellipsis: true,
        },
        {
            title: "End date",
            dataIndex: "endDate",
            key: "endDate",
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
                            Detail
                        </Button>
                        {/* <>||</>
                        <Popconfirm
                            title="Sure to delete?"
                            placement="leftTop"
                            onConfirm={() => remove(record)}
                        >
                            <Button type="link" size="small" danger>
                                Delete
                            </Button>
                        </Popconfirm> */}
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

    const discountModel = () => {
        
    }
    const hide = () => {
        setClicked(false);
        setHovered(false);
      };
    
      const handleHoverChange = (visible) => {
        setHovered(visible);
        setClicked(false);
      };
    
      const handleClickChange = (visible) => {
        setHovered(false);
        setClicked(visible);
      };
    const hoverContent = <div>Click to copy to clipboard.</div>;
    const clickContent = <div>Copied !</div>;

    return(
        <>
            <Card title="Discount list" bordered={false} >
                <div >
                    <Table
                        title={(() => (
                            <Row gutter={[8, 8]}>
                                <Col xs={24} xl={12}>
                                    <Button type="primary" onClick={() => openDraw()} >Add discount</Button>
                                </Col>
                                <Col xs={24} xl={12}>
                                    <Search placeholder="Search by ID !!!" 
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
            <Modal
                centered
                title="Discount QR Code"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Popover
                    style={{ width: 500 }}
                    content={hoverContent}
                    trigger="hover"
                    visible={hovered}
                    onVisibleChange={handleHoverChange}
                    >
                    <Popover
                        content={
                        <div>
                            {clickContent}
                        </div>
                        }
                        trigger="click"
                        visible={clicked}
                        onVisibleChange={handleClickChange}
                    >
                        
                        <CopyToClipboard text={codeQR}>
                            <Button onClick={handleClickChange}>
                            Copy
                            </Button>
                        </CopyToClipboard>

                    </Popover>
                    </Popover>
                    
                ]}
            >
                <Row>
                    <Col span={12} offset={6}>
                        <QRCode value={codeQR} />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={24} style={{textAlign: 'center'}}>Use the QR code scanner to get the discount code, or press copy to get the code : <h3>{codeQR}</h3></Col>
                    
                </Row>
            </Modal>
            <ActDiscount visible={visible} setDraw={setVisible}  item={item} resetItem={setItem}  reload={setRefresh}/>
        </>
    );
}
export default DiscountList;

