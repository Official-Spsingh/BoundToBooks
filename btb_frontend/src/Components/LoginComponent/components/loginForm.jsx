import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { makeRequest } from '@utils/makeRequest'
import { setItemInLocalStorage } from '@utils/localStorage'
import { withRouter } from "react-router";

const LoginForm = (props) => {
    const [form] = Form.useForm()
    const [loginLoading, setloginLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const verifyLogin = (values) => {
        setloginLoading(true)
        makeRequest.post('login', values)
            .then(response => {
                setloginLoading(false)
                if (response.data.status.code == 401) {
                    setErrorMessage('User not found')
                    form.validateFields(['email'])
                }
                else if (response.data.status.code == 400) {
                    setErrorMessage('Invalid email or password')
                    form.validateFields(['email'])
                }
                else if (response.data.status.code == 200) {
                    setItemInLocalStorage('accessToken', response.data.data.access_token)
                    setItemInLocalStorage('refreshToken', response.data.data.refresh_token)
                    props.history.push('/home')
                }
            })
            .catch(err => {
                setloginLoading(false)
                console.log(err)
            })
    }
    const loginValidator = (err, value) => {
        if (errorMessage.length) {
            return Promise.reject(errorMessage)
        }
        else {
            return Promise.resolve()
        }
    }
    return (
        <Form
            name="Login_Form"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={verifyLogin}
            form={form}
            onFieldsChange={() => {
                if (errorMessage.length) {
                    setErrorMessage('')
                }
            }}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your Email',
                    },
                    {
                        type: 'email',
                        message: 'Please enter valid Email Id',
                    },
                    {
                        validator: loginValidator
                    }
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your Password',
                    },
                ]}
                onChange={() => { form.validateFields(['email']) }}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    size="large"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="login-button" loading={loginLoading}>
                    Log in
                </Button>
                <h3>Forgot Password ?</h3>
            </Form.Item>
        </Form>
    )
}

export default withRouter(LoginForm)
