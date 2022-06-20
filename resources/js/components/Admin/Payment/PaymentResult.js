import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
    Button, Result, Typography, Input
} from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import helper from "../Core/Components/Helper/helper";
const { Paragraph, Text } = Typography;


const { Search } = Input;
const PaymentResult = ({}) => {
    const [status, setStatus] = useState("");
    const [infor, setInfor] = useState({});
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const amount = queryParams.get('vnp_Amount');
        const statusUrl = queryParams.get('vnp_TransactionStatus');
        const orderId = queryParams.get('vnp_TxnRef');
        const hash = queryParams.get('vnp_SecureHash');
        const code  = queryParams.get('vnp_ResponseCode');
        var getInfor = {
            amount: amount,
            orderId: orderId,
            hash: hash,
            code
        }

        setInfor(getInfor);
        setStatus(statusUrl);
    }, [])

    const setRouter = () => {
        window.location = "/admin/order";
    }
    const success = () => {
        return (
            <Result
            status="success"
            title="Payment successful"
            subTitle= {`Order number: ${infor.orderId}  Amount: ${helper.formatCurrency(infor.amount/100)}`}
            extra={[
              <Button key="buy" onClick={setRouter}>Back Home</Button>,
            ]}>

            </Result>

        )
    }
    const failed = () => {
        var mess ="";
        if(infor.code == 24) mess = "Giao dịch không thành công do: Khách hàng hủy giao dịch";
        return (
            <Result
                status="error"
                title="Payment Failed"
                subTitle="Please check and modify the following information before resubmitting."
                extra={[
                <Button key="buy" onClick={setRouter}> Back Home</Button>,
                ]}
            >
                <div className="desc">
                <Paragraph>
                    <Text
                    strong
                    style={{
                        fontSize: 16,
                    }}
                    >
                    The content you submitted has the following error:
                    </Text>
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon" /> 
                    {mess};
                </Paragraph>
            
                </div>
            </Result>

        )
    }

    return(
       <>
        { status == "00" ? success() : failed() }
       </>
    );
}
export default PaymentResult;
if (document.getElementById('payment-container')) {
    ReactDOM.render(<PaymentResult />, document.getElementById('payment-container'));
}

