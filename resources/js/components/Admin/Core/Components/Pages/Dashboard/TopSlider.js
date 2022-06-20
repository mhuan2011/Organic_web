import React, {useEffect, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link } from 'react-router-dom';
import { Layout, Row, Col, Carousel, Image, Table, Pagination, Card, Spin  } from 'antd';
import ItemStatus from './ItemStatus';
import axios from 'axios';
import helper from '../../Helper/helper';
const TopSlider = () => {

    const [loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => { 
        // setLoading(true);
        axios.get(`http://localhost:8080/api/v1/Discounts`)
        .then(res => {
            const result = res.data;
            setData(result);
        })
        .catch(error => console.log(error))
        .finally(() => {
            // setLoading(false);
        });

            
       
    }, []);

    useEffect(() => { 
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/Products/top5`)
      .then(res => {
          const result = res.data;
          setDataSource(result);
      })
      .catch(error => console.log(error))
      .finally(() => {
          setLoading(false);
      });

          
     
  }, []);


    const columns = [
        {
          title: 'Prroduct ID',
          dataIndex: 'productId',
          width: '30%',
          key: "productId",
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: "name",
        }
        ,
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          render: (price) => {
            return (
                <>{helper.formatCurrency(price)}</>
            )
          }
        }
      ];
      
    


    const contentStyle = {
        width: '100%',
        color: '#fff',
        // lineHeight: '160px',
        // textAlign: 'center',
        background: '#364d79',
        justify: "center",
      };
    return(
        <div className="mg-t-8">
        
        <Row gutter={[8,8]} style={{height: '380px'}}>
            <Col span={12}>
                <Card title="Discount banner" bordered={true} bodyStyle={{padding: 0}}>
                    <Carousel autoplay >
                        {data.map((item, index) => {
                            const source =  item.imageDiscount.link? item.imageDiscount.link : "";
                            var src = "";
                            let ip = source.substring(7,18);
                            if(source.indexOf('localhost')  < 0) {
                                if(source != "") src =  source.replace(ip, "localhost");
                            } else src = source;
                            
                            return (
                                <div key={index} style={contentStyle} className="slider">
                                    <Image src={src} style={{ width: "100%", height: '380px'}}></Image>
                                </div>
                            )
                        })}
                    </Carousel>
                </Card>
            </Col>

            <Col span={12}>
                <Spin spinning={loading} tip="loading...">
                  <Card title="Top product" bordered={true} bodyStyle={{padding: 0}}>
                      <Table columns={columns} dataSource={dataSource} style={{height: '100%'}} pagination={false} rowKey={record => record.productId}/>
                  </Card>
                </Spin>
            </Col>

        </Row>
        </div>        
    )
}
export default TopSlider;