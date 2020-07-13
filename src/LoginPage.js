import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { AdminContext } from './AdminContextProvider'

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

export const LoginPage = () => {
    const adminContext = useContext(AdminContext)

    const [redirect, setRedirect] = useState(adminContext.isAdmin)

    const handleFinish = values => {
        fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error();
                }
                return res.json()
            })
            .then(data => {
                const jwt_token = data
                window.localStorage.setItem('admin', true)
                window.localStorage.setItem('auth_token', jwt_token.access)
                window.localStorage.setItem('refresh_token', jwt_token.refresh)
                adminContext.changeAdmin(true)
                setRedirect(true)
            })
            .catch(() => {
                message.error("Username or Password does not exist")
            })
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            {redirect && <Redirect push to="/admin" />}
            <h1>Login</h1>
            <Form
                {...layout}
                name='Login Form'
                onFinish={handleFinish}
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
                <Form.Item {...tailLayout} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}