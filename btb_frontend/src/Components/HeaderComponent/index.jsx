import React from 'react'
import { Drawer, Avatar } from 'antd';
import { BellOutlined, ReadOutlined, UserOutlined, CreditCardOutlined, ShoppingCartOutlined, GiftOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { withRouter } from "react-router";
import { logout } from "@utils/auth"
function HeaderComponent(props) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const showDrawer = () => {
        setDrawerVisible(true)
    };

    const onClose = () => {
        setDrawerVisible(false)
    };
    const headerRedirect = (path) => {
        setDrawerVisible(false);
        props.history.push(path)
    }
    const logoutUser = () => {
       logout().then(response=>{
           if(response=="succesfully logged out"){
            props.history.push("/login")
           }
       }).catch(err=>{
           console.log(err)
       })
        
    }
    const title = <div className="header"><ReadOutlined /><div className="header-title">Bound To Books</div></div>
    return (
        <div className="header-component-wrapper">
            <div className="header-component">
                <div className="left-content">
                    <div className="logo" onClick={() => props.history.push('/home')}>
                        Bound To Books
</div>
                </div>
                <div className="right-content">
                    <div className="icon-container">
                        <div className="notification">
                            <BellOutlined />
                        </div>
                        <div className="profile" onClick={showDrawer}>
                            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
                        </div>
                        <Drawer
                            title={title}
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={drawerVisible}
                        >
                            <div className="list-collection">
                                <div className="list-item" onClick={() => headerRedirect('/profile')}>
                                    <UserOutlined /><span className="list-item-label">Profile</span>
                                </div>
                                <div className="list-item">
                                    <CreditCardOutlined /><span className="list-item-label">Sell</span>
                                </div>
                                <div className="list-item">
                                    <ShoppingCartOutlined /><span className="list-item-label">Buy</span>
                                </div>
                                <div className="list-item">
                                    <GiftOutlined /><span className="list-item-label">Donate</span>
                                </div>
                                <div className="list-item" onClick={() => logoutUser()}>
                                    <LockOutlined /><span className="list-item-label">Logout</span>
                                </div>
                            </div>
                        </Drawer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(HeaderComponent);
