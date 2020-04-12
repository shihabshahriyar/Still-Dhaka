import React from 'react';
import { Menu, Dropdown, Button, Container } from 'semantic-ui-react';
 

class Navbar extends React.Component {
    render = () => (
              <Menu size='large' pointing secondary>
                <Menu.Item
                name='Still Dhaka'
                />

                <Menu.Menu position='right'>
                    <Menu.Item
                    name='Explore'
                    />
                    <Menu.Item
                    name='License'
                    />
                    <Dropdown item text='More'>
                        <Dropdown.Menu>
                        <Dropdown.Item>English</Dropdown.Item>
                        <Dropdown.Item>Russian</Dropdown.Item>
                        <Dropdown.Item>Spanish</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
    )
}

export default Navbar;