import React from 'react'
import { Drawer, Avatar } from 'antd';
import { BellOutlined, ReadOutlined, UserOutlined, CreditCardOutlined, ShoppingCartOutlined, GiftOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react';
function HeaderComponent(props) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const showDrawer = () => {
        setDrawerVisible(true)
    };

    const onClose = () => {
        setDrawerVisible(false)
    };
    const title = <div className="header"><ReadOutlined /><div className="header-title">Bound To Books</div></div>
    return (
        <div className="header-component-wrapper">
            <div className="header-component">
                <div className="left-content">
                    <div className="logo">
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
                                <div className="list-item">
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
                                <div className="list-item">
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

export default HeaderComponent
