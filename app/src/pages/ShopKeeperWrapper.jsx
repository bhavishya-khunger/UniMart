import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopKeeperWrapper = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isShopVerified = user?.isShopVerified;
  const isShopkeeper = user?.role === 'Shopkeeper';

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    if (isShopkeeper) {
      if (!isShopVerified) {
        navigate('/shopdetails');
      }
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default ShopKeeperWrapper;
