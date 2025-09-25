import React, { useState } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from 'reactstrap';

import ComponentCard from '../../components/ComponentCard';

import AccountSettingsComponent from '../settings/AccountSettings';
import PersonalSettingsComponent from '../settings/PersonalSettings';

const JumbotronComponent = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <ComponentCard title="Settings">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active' : ''}
              onClick={() => {
                toggle('1');
              }}
            >
              Personal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active' : ''}
              onClick={() => {
                toggle('2');
              }}
            >
              Account
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
            <PersonalSettingsComponent />
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="6">
                <AccountSettingsComponent />
              </Col>
              <Col sm="6" style={{ fontSize: "14px"}}>
              <ComponentCard title="Password Requirements">
                  <ul>
                  <li>At least one digit [0-9].</li>
                  <li>At least one lowercase character [a-z].</li>
                  <li>At least one uppercase character [A-Z].</li>
                  <li>At least one special character [*!@#$%].</li>
                  <li>At least 8 characters in length, but no more than 32.</li>
                  </ul>
              </ComponentCard>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default JumbotronComponent;
