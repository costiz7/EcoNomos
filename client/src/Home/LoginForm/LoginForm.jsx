import { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        //BACKEND CALL
    }

    return (
        <>
            <div className="login-form-wrapper">
                <h1>Welcome!</h1>
                <div className="login-card-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="form-input">
                            <label htmlFor="email">Email</label>
                            <input type="text" 
                                    id="email" 
                                    value={email}
                                    onChange={ (e) => setEmail(e.target.value) } />
                        </div>
                        <div className="form-input">
                            <label htmlFor="password">Password</label>
                            <input type="password"  
                                    id="password"
                                    value={password}
                                    onChange={ (e) => setPassword(e.target.value) } />
                        </div>
                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>
                    <div className="switch-form-text">
                        Don't have an account?{' '}
                        <span className="switch-link" onClick={onSwitchToRegister}>
                            Register
                        </span>
                    </div>
                </div>
                
            </div>
        </>
    );
}

export default LoginForm;