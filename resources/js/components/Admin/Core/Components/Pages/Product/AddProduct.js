
import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useSearchParams   } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col,
    Switch, Spin, Card, Select, InputNumber, Upload, DatePicker
} from "antd";
import { UserOutlined, UploadOutlined , RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

import { useForm } from "rc-field-form";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import moment from 'moment'
import helper from '../../Helper/helper';
import Cookies from 'js-cookie';

const config = {
    headers: { Authorization: `${Cookies.get("token")}` }
};

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
    categoryId: 41,
    price: 10000,
    display: false
}
const AddProduct = ({}) => {
    const [loading, setLoading ] = useState(false);
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [keyID, setKeyID] = useState("");
    let [searchParams, setSearchParams] = useSearchParams();
    const [uploading, setUploading] = useState([false]);
    const [cateList, setCateList] = useState([]);

    const [fileList, setFileList] = useState([
     
    ]);

    //get key
    const getKeyID = () => {
        console.log();
    }
    const getItem = (id) => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Products/`+id, {
            headers: {"Access-Control-Allow-Origin": "http://organicfood.com"},
            proxy: {
                host: '127.0.0.1',
                port: 8080
            }
            
        })
        .then(res => {
            const result = res.data;
            res.data.data.year = (moment(res.data.data.year, 'YYYY'));
            form.setFieldsValue(res.data.data);

            var source = result.data.image.link;
            var src = "";
                let ip = source.substring(7,18);
                if(source.indexOf('localhost')  < 0) {
                    if(source != "") src =  source.replace(ip, "localhost");
                } else src = source;

            setFileList([{
                uid: result.data.image.id,
                name: result.data.image.name,
                status: 'done',
                url: src,
            }])
            console.log(result)
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }

    const getCategoryList = () => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Categories`, {
            headers: {
                "Access-Control-Allow-Origin": "http://organicfood.com",
                "Authorization": `${Cookies.get("token")}` 
            },
            proxy: {
                host: '127.0.0.1',
                port: 8080
            }
        })
        .then(res => {
            const result = res.data;
            setCateList(result);
            helper.storageItem("category_list", JSON.stringify(result));
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    };
    
    useEffect(()=>{
        var id = searchParams.get("id");
        setKeyID(id);
        var data = helper.getStorage("category_list");
        if(data){
            setCateList(JSON.parse(data));
        }else {
            getCategoryList();
        }
        if(id!="" && id != undefined){
            getItem(id);
        }
    },[]);

      const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };
    
      const setRouter = () => {
        navigate("/admin/product");
    }





    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    
    const onSubmit = () => {
        
        form.validateFields()
        .then((values) => {
            values.year = moment(values.year).format('YYYY');
            values.productId = "";
            var formData = new FormData()
            const product = values;
            
            if(keyID!="" && keyID != null){
                values.id = keyID;
                if( fileList[0].originFileObj != undefined) {
                    formData.append("file", fileList[0].originFileObj);
                }else formData.append("file", fileList[0]);
                
                formData.append("product", new Blob([JSON.stringify(product)], { type: 'application/json'}))
                edit(keyID, formData);
            }else{
                formData.append("file", fileList[0].originFileObj);
                formData.append("product", new Blob([JSON.stringify(product)], { type: 'application/json'}))
                storage(formData);
            }
        }).catch((errorInfo) => {
        }).finally(() => {
        });
    };
    
    const storage = (values) => {
        setLoading(true);
        axios.post(`http://localhost:8080/api/v1/Products/insert/v2`, values)
        .then(res => {
            console.log(res.data.status);
            if(res.data.status == "Ok"){
                helper.Noti('success', '[Product] Insert', res.data.message);
            }else if(res.data.status == 'failed'){
                helper.Noti('error', '[Product] Insert', res.data.message);
            }
            setLoading(false);
            
        })
        .catch(e => {
            helper.Noti('error', '[Product] Insert', e);
            setLoading(false);

        })
    }

    const edit = (id, values) => {
        setLoading(true);
        axios.put(`http://localhost:8080/api/v1/Products/` + id, values)
        .then(res => {
            console.log(res.data.status);
            if(res.data.status === "ok"){
                helper.Noti('success', '[Product] Update', res.data.message);
            }else if(res.data.status == 'failed'){
                helper.Noti('error', '[Product] Update', res.data.message);
            }
            setLoading(false);
        })
        .catch(e => {
            helper.Noti('error', '[Product] Update', e);
            setLoading(false);
        })
        
    }

    const beforUploadImage = (file) => {
        console.log(file);
        return false;
    }


    const header = {
    'Access-Control-Allow-Origin': 'http://organicfood.com',
    }

    
    return(
        <>
        <Card title={ keyID ? "Update product" : "Add new product"} bordered={false} >
            <Spin tip="Loading..." spinning={loading}>
                    <Form
                        form={form}
                        {...layout}
                        layout="horizontal"
                        autoComplete="off"
                        initialValues={intialValue} 
                    >
                        <Row>
                            <Col xs={24} xl={12}>
                                <Form.Item 
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please input name!' }]}
                                    labelAlign="left"
                                >
                                    <Input placeholder="Please input name!" />
                                </Form.Item>

                                <Form.Item 
                                    label="Category"
                                    name="categoryId"
                                    rules={[{ required: true, message: 'Please input alias!' }]}
                                    labelAlign="left"
                                >
                                    <Select>
                                        { 
                                            cateList.map((value) => 
                                                <Option key={value.id} value={value.id}>{value.name}</Option>
                                        )}
                                  
                                    </Select>
                                </Form.Item>
                                <Form.Item 
                                    label="Calculation unit"
                                    name="calculationUnit"
                                    rules={[{ required: true, message: 'Please input calculation unit!' }]}
                                    labelAlign="left"
                                >
                                    <Input placeholder="Please input calculation unit!!" />
                                </Form.Item>
                                
                                <Form.Item 
                                    label="Slug"
                                    name="slug"
                                    labelAlign="left"
                                    rules={[{ required: true, message: 'Please input slug!' }]}
                                >
                                   <Input placeholder="Please input slug!" />
                                </Form.Item>
                                <Form.Item 
                                    label="Discount"
                                    name="discount"
                                    labelAlign="left"
                                    rules={[{ required: true, message: 'Please input discount!' }]}
                                >
                                    <InputNumber min={0} max={100}  style={{width: '100%'}} placeholder="Please input discount!"/>
                                </Form.Item>
                                <Form.Item 
                                    label="Year"
                                    name="year"
                                    labelAlign="left"
                                    rules={[{ required: true, message: 'Please input year!' }]}
                                >
                                   <DatePicker picker="year" style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} xl={12}>
                                
                                <Form.Item 
                                    label="Price"
                                    name="price"
                                    rules={[{ required: true, message: 'Please input price!' }]}
                                    labelAlign="left"
                                >
                                    <InputNumber min={0} max={1000000} style={{width: '100%'}} addonAfter="VND" />
                                </Form.Item>

                                <Form.Item 
                                    label="Total"
                                    name="total"
                                    rules={[{ required: true, message: 'Please input total!' }]}
                                    labelAlign="left"
                                >
                                    <InputNumber min={0} max={1000000} style={{width: '100%'}}/>
                                </Form.Item>

                                <Form.Item 
                                    label="Rate"
                                    name="rate"
                                    labelAlign="left"
                                >
                                     <InputNumber min={0} max={5}  style={{width: '100%'}}/>
                                </Form.Item>
                                <Form.Item 
                                    label="Display"
                                    name="display"
                                    valuePropName="checked"
                                    labelAlign="left"
                                >
                                    <Switch />
                                </Form.Item>
                                <Form.Item 
                                    label="Url"
                                    name="url"
                                    labelAlign="left"
                                >
                                    <Input placeholder="Please input url!" />
                                </Form.Item>
                                
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} xl={12}>
                                <Form.Item 
                                        label="Description"
                                        name="description"
                                        labelAlign="left"
                                    >
                                        <TextArea rows={10} placeholder="Please input description!" />
                                    </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} xl={12}>
                                <Form.Item 
                                        label="Upload"
                                        labelAlign="left"
                                        
                                    >
                                        <ImgCrop rotate>
                                            <Upload
                                                name="image"
                                                listType="picture-card"
                                                beforeUpload={beforUploadImage}
                                                fileList={fileList}
                                                onChange={onChange}
                                                onPreview={onPreview}
                                            >
                                                {fileList.length < 5 && '+ Upload'}
                                            </Upload>
                                        </ImgCrop>
                                </Form.Item>
                            </Col>
                        
                        </Row>
                        
                        <Row>
                            <Col xs={24} xl={12}>
                                <Form.Item  {...tailLayout} >
                                    <Button type="primary"  icon={<SaveOutlined />} onClick={() => onSubmit() }  style={{marginRight:8}} >
                                        Submit
                                    </Button>
                                    <Button htmlType="button" onClick={() => setRouter()}  icon={<RollbackOutlined />}>
                                        Back
                                    </Button>
                                </Form.Item>
                            </Col>
                            
                        </Row>
                    </Form>
                </Spin>
        </Card>
        
        </>
    );
}
export default AddProduct;
