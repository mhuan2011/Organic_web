
import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col, InputNumber,
    Drawer, Spin, Upload, Select, Space, Image, DatePicker
} from "antd";
import { UserOutlined, UploadOutlined , RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { create, delay } from "lodash";
import { useForm } from "rc-field-form";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import helper from '../../Helper/helper';
import moment from 'moment'

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
const { RangePicker } = DatePicker;
const ActDiscount = ({visible, setDraw, item, resetItem,  reload}) => {
    const [loading, setLoading ] = useState(false);
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("");
    const [requiredField, setRequiredField] = useState(true);


    // const setRouter = () => {
    //     navigate("/admin/product?id=1");
    // }
    const dateFormat = 'YYYY-MM-DD';
    useEffect(() => {
        if(item.id != undefined) {
            setRequiredField(false);
            var range = [moment(item.startDate, dateFormat), moment(item.endDate, dateFormat)];
            console.log(range)
            setTimeout(function () {
                form.setFieldsValue({ 
                    id: item.id, 
                    percent: item.percent, 
                    quantity: item.quantity, 
                    rangeDate: range
                });
            },0);
            var src = "";
            let ip = item.imageDiscount.link.substring(7,18);
            if(item.imageDiscount.link.indexOf('localhost')  < 0) {
                if(item.imageDiscount.link != "") src =  item.imageDiscount.link.replace(ip, "localhost");
            } else src = item.imageDiscount.link;
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
        resetItem({});
        setTimeout(function () {
            form.resetFields();
        },0);
        setDraw(false);
    };

    const onSave = () => {
        
        setLoading(true);
        form.validateFields()
        .then((values) => {
            var formData = new FormData()
            const discount = {
                id: values.id,
                quantity: values.quantity ? values.quantity : 0,
                percent: (values.percent/100),
                startDate:  moment(values.rangeDate[0]).format('YYYY-MM-DD'),
                endDate: moment(values.rangeDate[1]).format('YYYY-MM-DD'),
            }
            if(item.name != undefined){
                edit(discount);
            }else {
                formData.append("file", values.image.file)
                formData.append("discount", new Blob([JSON.stringify(discount)], { type: 'application/json'}))
                storage(formData);
            }
            

        }).catch((errorInfo) => {
            console.log(errorInfo);
        }).finally(() => {
            setLoading(false);
        });
    }

    const storage = (discount) => {
        setLoading(true);
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };

        axios.post(`http://localhost:8080/api/v1/Discounts/insert/v2`, discount, axiosConfig
        ).then(function (response) {
            var result = response.data;
            if(result.status == "Ok") {
                helper.Noti('success', '[Discount] Insert', result.message);
                
                
            }
            else {
                helper.Noti('error', '[Discount] Insert', result.message);
            }
        }).catch(function (response) { 
            helper.Noti('error', '[Discount] Insert', result.message);
        }).finally(() => {
            reload(new Date());
            setLoading(false);
            onClose(true);
        });

        
    }

    const edit = (formData) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "http://organicfood.com/",
            }
        };
        axios.put(`http://localhost:8080/api/v1/Categories/`+item.id, formData, axiosConfig
        ).then(function (response) {
            var result = response.data;
            if(result.status == "ok") {
                helper.Noti('success', '[Category] Update', result.message);
                onClose(true);
            }
            else {
                helper.Noti('error', '[Category] Update', result.message);
            }
        }).catch(function (response) { 
            helper.Noti('error', '[Category] Update', result.message);
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

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() < Date.now();
      }
    return(
        <Drawer
            title="Discount"
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
            <Spin spinning={loading} tip="Loading...">
            <Form
                layout="vertical" 
                form={form}
            >
                <Form.Item
                    label="Discount code"
                    name="id"
                    rules={[{ required: true, message: 'Please input discount id!' }]}
                >
                    <Input placeholder="Please input discount id!"/>
                </Form.Item>
                <Form.Item
                    label="Range date"
                    name="rangeDate"
                    rules={[{ required: true, message: 'Please input range date!' }]}
                >
                    <RangePicker
                        disabledDate={disabledDate}
                     />
                </Form.Item>
                <Form.Item
                    label="Percent"
                    name="percent"
                    rules={[{ required: true, message: 'Please input percent!' }]}
                >
                   
                    <InputNumber formatter={value => `${value}%`}  style={{width: '100%'}}/> 
                </Form.Item>
                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Please input quantity!' }]}
                >
                     <InputNumber min={0} max={1000} style={{width: '100%'}}/> 
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
export default ActDiscount;
