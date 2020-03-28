import React from 'react'
import { Result, Button } from 'antd'
import { withRouter } from "react-router";

function PageNotFound(props) {
    return (
        <div className="page-not-found--main-container" style={{ padding: '20px 10px' }}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => props.history.push('/home')}>Back Home</Button>}
            />
        </div>
    )
}

export default withRouter(PageNotFound)
