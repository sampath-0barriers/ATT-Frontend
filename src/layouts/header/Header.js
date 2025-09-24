import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Alert,
  ButtonGroup
} from 'reactstrap';
import { MessageSquare } from 'react-feather';
import * as Icon from 'react-feather';
import { ReactComponent as LogoWhite } from '../../assets/images/logos/xtreme-white-icon.svg';
import MessageDD from './MessageDD';
import MegaDD from './MegaDD';
import NotificationDD from './NotificationDD';
import user1 from '../../assets/images/users/user1.jpg';

import { ToggleMiniSidebar, ToggleMobileSidebar, ChangeDarkMode } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';
import { getUserInfo } from '../../utils';

const { isLicenseExpired, isFreeTrial } = getUserInfo();

const Header = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const [isLoggedin, setIsLoggedin] = useState(true);
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    setIsLoggedin(false);
  };

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
    >
      {/* Toggle Buttons */}
      <div className="d-flex align-items-center ms-4">
        <Button
          color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
          aria-label='Navigation Menu'
        >
          <i className="bi bi-list" />
        </Button>
        <NavbarBrand href="/" className="d-sm-block d-lg-none">
          <LogoWhite />
        </NavbarBrand>
        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
          aria-label='Navigation Menu'
        >
          <i className="bi bi-list" />
        </Button>
      </div>

      {/* Left Nav Bar */}
      <Nav className="me-auto d-none d-lg-flex" navbar>
        {/* <NavItem>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </NavItem> */}
      </Nav>

      {/* Warning for Expired/No License */}
      {(isLicenseExpired || isFreeTrial) && (
        <div className="flex-grow-1 d-flex justify-content-center">
          <Alert color={isLicenseExpired ? "danger" : "warning"} className="mb-0 me-3">
            {isLicenseExpired && (
              <>
                No active license found or expired.{' '}
                <Link to="/license/pricing" className="text-decoration-underline">
                  Purchase a plan
                </Link>
              </>
            )}
            {isFreeTrial && !isLicenseExpired && (
              <>
                You are currently on a free trial.{' '}
                <Link to="/license/pricing" className="text-decoration-underline">
                  Upgrade your plan
                </Link>
              </>
            )}
          </Alert>
        </div >
      )}

      {/* Right-Side Dropdowns */}
      <div className="d-flex">
        {/* Mode Switch */}
        <ButtonGroup className="mx-2 m-1" style={{ height: '34px' }}>
          <Button
            outline={!!isDarkMode}
            color="primary"
            size="sm"
            onClick={() => dispatch(ChangeDarkMode(false)) && window.location.reload(false)}
          >
            Light
          </Button>
          <Button
            color="primary"
            size="sm"
            outline={!isDarkMode}
            onClick={() => dispatch(ChangeDarkMode(true))}
          >
            Dark
          </Button>
        </ButtonGroup>

        {/* Mega Dropdown */}
        <UncontrolledDropdown className="mega-dropdown mx-1">
          <DropdownToggle className="bg-transparent border-0" color={topbarColor} aria-label='Feature'>
            <Icon.Grid size={18} />
          </DropdownToggle>
          <DropdownMenu>
            <MegaDD />
          </DropdownMenu>
        </UncontrolledDropdown>

        {/* Notifications Dropdown */}
        {/* <UncontrolledDropdown>
          <DropdownToggle color={topbarColor} aria-label='Notification'>
            <Icon.Bell size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Notifications</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <NotificationDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown> */}

        {/* Messages Dropdown */}
        {/* <UncontrolledDropdown className="mx-1">
          <DropdownToggle color={topbarColor} aria-label='Messages'>
            <MessageSquare size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Messages</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <MessageDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown> */}

        {/* Profile Dropdown */}
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor} aria-label='Profile'>
            <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <ProfileDD />
            <div className="p-2 px-3">
              <Button color="danger" size="sm" onClick={logout}>
                <Link to="/auth/login" className="text-light text-decoration-none">
                  Logout
                </Link>
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar >
  );
};

export default Header;
