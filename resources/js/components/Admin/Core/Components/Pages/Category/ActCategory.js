
import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col,
    Drawer, Spin, Upload, Select, Space, Image
} from "antd";
import { UserOutlined, UploadOutlined , RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { create, delay } from "lodash";
import { useForm } from "rc-field-form";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import helper from '../../Helper/helper';
import Cookies from "js-cookie";
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
const ActCategory = ({visible, setDraw, item, resetItem, reload}) => {
    const [loadingForm, setLoadingForm ] = useState(false);
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("");
    const [requiredField, setRequiredField] = useState(true);

    const setRouter = () => {
        navigate("/admin/product?id=1");
    }

    useEffect(() => {
        if(item.name != undefined) {
            setRequiredField(false);
            setTimeout(function () {
                form.setFieldsValue({ name: item.name, description: item.description });
            },0);
            var src = "";
            let ip = item.link.substring(7,18);
            if(item.link.indexOf('localhost')  < 0) {
                if(item.link != "") src =  item.link.replace(ip, "localhost");
            } else src = item.link;
            setUrl(src);
        }else {
            setRequiredField(true);
            setUrl("");

            
            
        }
        
    }, [item]);

    function onsubmit() {
       
        console.log(fileList);
    }

    const onClose = () => {
        localStorage.removeItem("category_list");
        resetItem({});
        setTimeout(function () {
            form.resetFields();
        },0);
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
                'Authorization': `${Cookies.get("token")}`
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
                setLoadingForm(false);
            }
        }).catch(function (response) { 
            console.log(response);
            helper.Noti('error', '[Category] Insert', response.message);
            setLoadingForm(false);
        });

        
    }

    const edit = (formData) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "http://organicfood.com/",
                'Authorization': `${Cookies.get("token")}`
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

    
    return(
        <Drawer
            title="Category"
            width={500}
            onClose={onClose}
            visible={visible}
            extra={
            <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" onClick={onSave}>
                Save
                </Button>
            </Space>
            }
        >   
            <Spin tip="Loading..." spinning={loadingForm}>
            <Form
                layout="vertical" 
                form={form}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input category name!' }]}
                >
                    <Input placeholder="Please input name !"/>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <TextArea  placeholder="Please input description!" rows={15}/>   
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: requiredField, message: 'Please input image!' }]}
                >
                    <Upload
                        beforeUpload={beforUploadImage}
                        fileList={fileList}
                        listType="picture"
                        className="upload-list-inline"
                        maxCount={1}
                        onPreview={onPreview}
                        >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                {/* <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please input image!' }]}
                >
                    <Input type="file" onChange={handleChange}></Input>
                </Form.Item> */}

                <Image
                    width={200}
                    src={url ? url : "http://localhost:8080/images/uploads/default/upload.png"}
                />
            </Form>
            </Spin>
        </Drawer>
    );
}
export default ActCategory;
