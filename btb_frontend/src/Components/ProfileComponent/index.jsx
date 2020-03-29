import React from 'react'
import { withRouter } from "react-router";
import { useEffect } from 'react';
import { makeRequest } from '@utils/makeRequest';
import { Form, Input, Button,InputNumber, notification } from 'antd';
import { useState } from 'react';
function ProfileComponent(props) {
  const [form] = Form.useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const [updateProfileLoader, setProfileLoader] = useState(false)
  const [userDetails,setUserDetails]=useState({})
  useEffect(() => {
    makeRequest.getAuth('user-info')
      .then(response => {
        console.log(response.data.user)

        setUserDetails(response.data.user)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const updateProfile = (data) => {
    setProfileLoader(true)
    // console.log(data)
    makeRequest.postAuth('update-profile',data)
      .then(response => {
        if(response.data.status.code==409){
          setProfileLoader(false)
          notification["success"]({
            message: 'Success',
            description:
              'Profile updated successfully !!!',
          })
        }
        
      })
      .catch(err => {
        console.log(err)
        setProfileLoader(false)
      })
    
  }
  return (
    <div className="profile-component">
      <Form
        name="Profile"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={updateProfile}
        form={form}
        onFieldsChange={() => {
          if (errorMessage.length) {
            setErrorMessage('')
          }
        }}
      >
        <Form.Item
          name="name"
          label="Name"
        >
          <Input placeholder="Name" size="large" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"

        >
          <Input placeholder="Username" size="large" />
        </Form.Item>
        <Form.Item
          name="mobile_number"
          label="Phone"
        >
          <InputNumber
            placeholder="Phone"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
        >
          <Input
            placeholder="Address"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="login-button" loading={updateProfileLoader}>
            Update Profile
                </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default withRouter(ProfileComponent)
