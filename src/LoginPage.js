import React, { useState } from 'react'
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 2,
        span: 16,
    },
};

// TODO: change the fetch to ES7
export const LoginPage = (props) => {
    const [ redirect, setRedirect ] = useState(false)
    const [ unsuccessfulSubmission, setUnsuccessfulSubmission ] = useState(false)
    
    const handleFinish = async values => {
        //TODO: Do not redirect if username and pass do not match
        const response = await fetch(`http://127.0.0.1:8000/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
        .then(res => {
            // TODO: add back when figuring out authentication
            // if (!res.ok) {
            //     throw new Error();
            // }
            return res.json()
        })
        .then(data => {
            const jwt_token = data
            window.localStorage.setItem('admin', true)
            window.localStorage.setItem('auth_token', jwt_token.access)
            window.localStorage.setItem('refresh_token', jwt_token.refresh)
            props.setAdmin(true)
            setRedirect(true)
        })
        .catch(error => {
            console.error(error)
            setUnsuccessfulSubmission(true)
        })
    };

    //TODO: want to do something when user fails?

    const handleFinishFail = errorInfo => {
        console.log('Failed', errorInfo)
    }
    //TODO: handle if user is already logged in

    //TODO: fix widths to make it more mobile friendly

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            {redirect && <Redirect push to = "/admin" />}
            <h1>Login</h1>
            <Form 
                {...layout}
                name='Login Form' 
                onFinish={handleFinish} 
                onFinishFailed={handleFinishFail}
            >
                <Form.Item
                    label='Username'
                    name='username'
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                    prefix={<UserOutlined style={{ verticalAlign: '0.125em', color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                    />
                </Form.Item>
                <Form.Item 
                    label='Password'
                    name='password'
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                    prefix={<LockOutlined style={{ verticalAlign: '0.125em', color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item {...tailLayout} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
            {unsuccessfulSubmission && 
            <Alert 
                message="Username or Password does not exist" 
                type="error"
                closable
                showIcon
            />
            }
        </>
    )
}