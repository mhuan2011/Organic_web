import React, {Fragment, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Statistic, Card, Row, Col, Typography, Spin} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, BgColorsOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const ItemStatus = ({title, value, color, loading}) => {
    var prefix =  title == "Total Revenue" ? "VND" : ""
    return(
        <Spin spinning={loading}>
          <Card style={{backgroundColor: color, border: 0 }}>
            
              <Statistic
                title={<Title level={5} strong={true} color={'#222'}>{title}</Title>}
                value={value }
                // precision={2}
                valueStyle={{ color: '#222' , fontSize: 20}}
                // prefix={<ArrowUpOutlined />}
                suffix={prefix}
              />
          
          </Card>
        </Spin>
    )
}
export default ItemStatus;