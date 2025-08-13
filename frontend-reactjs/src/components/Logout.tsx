import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('You have been logged out.');
        navigate('/login');
    }, [dispatch, navigate]);

    return null; // or a spinner/loading text
};

export default Logout;
