import React, {Fragment, Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import ItemStatus from './ItemStatus';
import axios from 'axios';

const Overview = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading ] = useState(false);

    useEffect(() => { 
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Reports/total`)
        .then(res => {
            const result = res.data;
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return(

        <Row gutter={[8, 8]}>
                <Col xs={24} md={12} lg={6}>
                    <ItemStatus 
                        title={'Total Product'}
                        value={data.totalProduct}
                        color={'#f2f2f2'}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ItemStatus 
                        title={'Total Category'}
                        value={data.totalCategory}
                        color={'#f2f2f2'}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ItemStatus 
                        title={'Total Order'}
                        value={data.totalOrder}
                        color={'#f2f2f2'}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ItemStatus 
                        title={'Total Revenue'}
                        value={data.totalRevenue}
                        color={'#f2f2f2'}
                        loading={loading}
                    />
                </Col>
        </Row>
    )
}
export default Overview;