import React from 'react'
import {
    Button,
    Dropdown,
    Menu,
} from 'semantic-ui-react'

const DropDown = () => (
    <Dropdown text = 'Alice'>
        <Dropdown.Menu>
            <Dropdown.Item text = 'Account Details'/>
            <Dropdown.Item text = 'My Ratings'/>
            <Dropdown.Item text = 'Logout'/>
        </Dropdown.Menu>
    </Dropdown>
)

const RiderMenuBar = () => (
    <Menu secondary>
        <Menu.Menu position='right'>
            <Button
                size={'tiny'}
                icon={'eye'}
                content={'Schedule'}
            />

            <Button basic
                size={'tiny'}
                icon={'dollar'}
                content={'My Earnings'}
            />

            <Menu.Item>
                <DropDown/>
            </Menu.Item>
        </Menu.Menu>
    </Menu>
)

export default RiderMenuBar