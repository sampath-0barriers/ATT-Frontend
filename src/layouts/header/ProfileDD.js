import React from 'react';
import { DropdownItem } from 'reactstrap';
import { User, Settings, Key, Calendar } from 'react-feather';
import { useNavigate, Link } from 'react-router-dom';
import user1 from '../../assets/images/users/user1.jpg'; // Default user avatar
const { read, clear } = require('../../utils/LocalStorageEncryption');

const ProfileDD = () => {
  const navigate = useNavigate();

  // Fetch user data from local storage
  const user = read('user') || {};

  // Destructure necessary fields
  const {
    first_name,
    last_name,
    username,
    license: { plan, expiresOn } = {}
  } = user;

  const goToTabs = () => {
    navigate('/ui/tabs');
  };

  return (
    <div>
      <div className="d-flex gap-3 p-3 pt-2 align-items-center">
        <img src={user?.avatar || user1} alt="user" className="rounded-circle" width="60" />
        <span>
          <h6 className="mb-0">{`${first_name} ${last_name}`}</h6>
          <small>{username || 'info@wrappixel.com'}</small>
        </span>
      </div>

      {/* License plan info */}
      <Link to="/license/pricing" className="text-decoration-none text-dark">
        <div className="d-flex gap-4 justify-content-center align-items-center py-2 border-bottom">
          <div className="d-flex align-items-center">
            <Key size={18} className="text-warning me-2" />
            <span>{plan?.name || "No License"}</span>
          </div>
          <div className="d-flex align-items-center">
            <Calendar size={18} className="text-info me-2" />
            <span>{expiresOn ? new Date(expiresOn).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
      </Link>

      <DropdownItem className="px-4 py-3">
        <User size={20} />
        &nbsp; My Profile
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem className="px-4 py-3" onClick={goToTabs}>
        <Settings size={20} />
        &nbsp; Settings
      </DropdownItem>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
