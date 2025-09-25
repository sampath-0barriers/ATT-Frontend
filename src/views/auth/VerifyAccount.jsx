import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import { errorNotification, successNotification } from '../../utils';
import { useAxios } from '../../utils/AxiosProvider';

export default function VerifyAccount() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const client = useAxios();
  const navigate = useNavigate();

  const handleVerifyAccount = () => {
    if (!token) {
      setMessage('Invalid verification link');
      return errorNotification('Error', 'Please use a valid verification link sent to your email');
    }
    setLoading(true);
    // send put request with token and validate account
    client
      .put('user/verify', { verificationToken: token })
      .then((data) => {
        console.log('user verified', data);
        successNotification('Success', 'Account verified successfully.Redirecting to login...');
        setMessage('Account verified successfully.');
        setLoading(false);
        navigate('/auth/login');
      })
      .catch((err) => {
        console.log('failed to verify user', err);
        errorNotification('Error', "Couldn't verify your account. Invalid or expired token");
        setMessage("Couldn't verify your account. Invalid or expired link");
        setLoading(false);
      });
  };

  useEffect(() => {
    handleVerifyAccount();
  }, []);

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <div style={{ textAlign: 'center', padding: '20%' }}>
        <h3>Verifying your account. Please Wait...</h3>
        {message && <h4>{message}</h4>}
        {loading && <Spinner color="primary" />}
      </div>
    </div>
  );
}
