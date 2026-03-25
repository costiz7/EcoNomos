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
                    <div className="form-header">
                        <h1>Login</h1>
                    </div>
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
                        <button onClick={onSwitchToRegister} className="login-form-btn">
                            Register
                        </button>
                    </form>
                </div>
                
            </div>
        </>
    );
}

export default LoginForm;