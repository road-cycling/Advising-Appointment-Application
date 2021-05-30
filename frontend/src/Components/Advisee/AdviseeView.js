import React, { Component } from 'react'
import AdviseeCalendar from './AdviseeCalendar'
import CenteredTabs from './Tabs'


class AdviseeView extends Component {

    state = {
        boolvalue : false
    }
    render() {
        let { match: { params: { advisor_id } } } = this.props
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '2px',
            }}>
                <div style={{ flex: 1, paddingRight: '10px' }}>
                    <CenteredTabs />
                </div>
                <div style={{ flex: 5 }}>
                    <AdviseeCalendar 
                        advisor_id={advisor_id}
                    />
                </div>
            </div>
        )
    }
}

export default AdviseeView;

