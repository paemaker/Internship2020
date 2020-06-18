import {
  ApiOutlined,
  BarsOutlined,
  IdcardOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Layout, Row, Space, Typography, notification } from 'antd';
import React, { Component } from 'react';

import { AddMember } from './imandex';
import { Link } from 'react-router-dom';
import axios from 'axios';

const {Text} = Typography; 
const { Header, Content } = Layout;
const Token = localStorage.getItem('lgtoken');

export default class Homefront extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            memberD: false,
            person: [],
            username: '',
            firstname: '',
            lastname: '',
            nickname: '',
            email: '',
            position: '',
            fileList: [],
            uploading: false
        }
        this.toggleMemberD  = this.toggleMemberD.bind(this);
    }
    toggleMemberD() 
    {
        this.setState
        ({
            memberD: !this.state.memberD,
        })
    }
    componentDidMount()
    {
        console.log(Token)
        axios.get('http://192.168.1.46:3000/admin/showmember', {headers: {'Authorization': Token}})
        .then(res => {
        this.setState({person: res.data})
        // console.log(res.data)
        })
        .catch(e => {
        console.log(e,'= Error')
      })
    }   
    Logout = () =>
    {
        axios.get('http://192.168.1.46:3000/admin/logout', {headers: {'Authorization': Token}})
        .then(res => {
            console.log(res.data);
            localStorage.removeItem('lgtoken')
            console.log(localStorage.getItem('lgtoken'))
            window.location=('/LogIn')
        })
    }

    handleSubmit = values =>
    {
        this.setState
        ({
            username    : values.username,
            firstname   : values.firstname,
            lastname    : values.lastname,
            nickname    : values.nickname,
            email       : values.email,
            position    : values.position,
        })
        const user = 
        {
            'username'      : this.state.username,
            'firstname'     : this.state.firstname,
            'lastname'      : this.state.lastname,
            'nickname'      : this.state.nickname,
            'email'         : this.state.email,
            'position'      : this.state.position,
        }
        
        axios.post('http://192.168.1.46:3000/admin/addmember', user, {headers: {'Authorization': Token}})
        .then(res => {
            console.log(res.data.message)
            if(res.data.message === 'add member sucessfull')
            {
                notification.success({
                    duration: 0,
                    message: 'Done!',
                    description: <Text>Added member successfully. <br/> Password : "{res.data.password}"</Text>
                }) 
                setTimeout(() => {
                   window.location=('/Homefront') 
                }, 6000);                
            }
        })
        .catch(e => {
            console.log('Error =', e)
        })
    } 
    handleChange = el =>
    {
        const {name, value} = el.target
        console.log(name, '=', value)
        this.setState({ [name]: value });
    }
    handleUpload = () => 
    {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => 
        {
            formData.append('files[]', file);
        });
        this.setState({ uploading: true });
    }
    handleSelect = value =>
    {
        this.setState({
            position: value
        })
    }

    render()
    {
        return(
            <div className="HomeProDashBG">

                <Layout>
                    <Header style={{backgroundColor: '#002766'}}>
                        <Row>
                            <Col span={8}>
                            </Col>
                            <Col span={8} style={{textAlign: 'center'}}>
                                <Text strong style={{fontSize: '40px', color: '#ffff'}}>Forex City</Text>
                            </Col>
                            <Col span={8}>
                                <Link to="/LogIn" onClick={this.Logout}>
                                    <Button danger type='primary' style={{float: 'right', margin: '15px'}}>
                                        <ApiOutlined />Log Out
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Header>

                    <Content style={{ padding: '0 50px' }} >
                        <Button type='primary' onClick={this.toggleMemberD} className="addmemButt">
                            <UserAddOutlined /> Add new member 
                        </Button>
                        <Breadcrumb separator="" style={{ margin: '20px 0' }}>
                            <Breadcrumb.Item>Location</Breadcrumb.Item>
                            <Breadcrumb.Separator>:</Breadcrumb.Separator>
                                <Breadcrumb.Item>
                                    <Link to="/Dashboard">
                                        <Text strong style={{color: '#40a9ff'}}><BarsOutlined /> Dashboard </Text>
                                    </Link>
                                </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Text strong><IdcardOutlined /> Member</Text>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="content_Home">
                            <Space align='start' size='large'>
                                <Row gutter={[38, 30]} align='middle'>
                                    {this.state.person.map(item => (
                                        <Link to={{ pathname: '/Profile', profile: item}}>
                                            <Col span={24} >
                                                <Card
                                                hoverable
                                                class="row"
                                                style={{ width: 'auto', height: 'auto' }}
                                                cover={<img alt="Eiloy" src={'http://192.168.1.46:3000/' + item.image} style={{height: 250, width: 250}}/>}
                                                >
                                                    <p>
                                                        Username    : {item.username} <br />
                                                        Name        : {item.firstname} {item.lastname} <br />
                                                        Position    : {item.position} <br />
                                                        
                                                    </p>
                                                </Card>
                                            </Col>
                                        </Link>
                                    ))}
                                </Row>
                            </Space>
                        </div>
                    </Content>
                </Layout>

                <AddMember openMember={this.state.memberD} closeMember={this.toggleMemberD} 
                addSubmit={this.handleSubmit} addInput={this.handleChange}
                addUpload={this.handleUpload} addSelect={this.handleSelect}
                />
                
            </div>
        );
    }
}