import React, {Fragment, Component, useState } from 'react';
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Layout, Row, Col, Card} from 'antd';
import SaleChart from './SaleChart';
import CategoryChart from './CategoryChart';
const ViewChart = () => {
    
    return(
        <div className="mg-t-8">
            {/* <div className="mg-t-8">
            <Row gutter={[8, 8]}>
                <Col xs={24} lg={24}>
                        <SaleChart/>
                </Col>
            </Row>
            </div> */}
            <div className="mg-t-8">
                <Row gutter={[8, 8]}>
                        <Col xs={24} lg={12}>
                            <SaleChart/>
                        </Col>
                        <Col xs={24} lg={12}>
                            <CategoryChart/>
                        </Col>
                </Row>
            </div>
        </div>
    )
}
export default ViewChart;