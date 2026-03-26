import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../LoadingOverlay/LoadingOverlay.jsx';
import './LoginForm.css';

function LoginForm({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //state for sliding-animation when the form appears
    const [isExiting, setIsExiting] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        //BACKEND CALL
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if(!response.ok) {
                setErrorMessage(data.message);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (error) {
            setErrorMessage('Can\'t connect to server. Try again later!');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSwitchClick = (e) => {
        e.preventDefault();
        setIsExiting(true);

        setTimeout(() => {
            onSwitchToRegister();
        }, 300);
    }

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className={`login-form-wrapper ${isExiting ? 'slide-out-up' : 'slide-in-up'}`}>
                <h1>Welcome!</h1>
                <div className="login-card-wrapper">
                    <div className="form-header">
                        <h1>Login</h1>
                    </div>
                    {errorMessage && (
                        <div className="form-error-message">
                            {errorMessage}
                        </div>
                    )}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-input">
                            <input type="text" 
                                    id="email" 
                                    value={email}
                                    onChange={ (e) => setEmail(e.target.value) }
                                    placeholder=' ' />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="form-input">
                            <input type="password"  
                                    id="password"
                                    value={password}
                                    onChange={ (e) => setPassword(e.target.value) }
                                    placeholder=' ' />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button type="submit" className="login-form-btn">
                            Login
                        </button>
                        <div className="horizontal-login-form-line"><span>OR</span></div>
                        <button onClick={handleSwitchClick} className="login-form-btn">
                            Register
                        </button>
                    </form>
                </div>
                
            </div>
        </>
    );
}

export default LoginForm;