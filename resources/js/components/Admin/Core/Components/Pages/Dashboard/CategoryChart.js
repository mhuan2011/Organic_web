import React, {Fragment, Component, useState, useEffect } from 'react';
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Layout, Row, Spin, Card} from 'antd';
import axios from 'axios';
import helper from "../../Helper/helper";
import Cookies from 'js-cookie';

const CategoryChart = () => {

    const [loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const [data, setData] = useState([]);

    const config = {
        headers: { Authorization: `${Cookies.get("token")}` }
    };
    useEffect(() => { 
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Categories/number-of-product`, config)
        .then(res => {
            const result = res.data;
            setData(formatDataSource(result));
        })
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const formatDataSource = (data) => {
        let dataSource = [];
        data.map(item => {
            var temp = [];
            temp.push(item.categoryName);
            temp.push(item.quantityProduct);
            dataSource.push(temp);
        })
            return dataSource;
    }

    const options = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: 'Number product of category'
        },
        subtitle: {
            text: '3D donut in Highcharts'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Delivered amount',
            data: data
        }]
    }
    return(
        <Card>
            <Spin spinning = {loading} tip ={'Loading...'}> 
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
            </Spin>
        </Card>
                    
    )
}
export default CategoryChart;