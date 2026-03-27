import { useState, useRef, useEffect } from "react";
import Typed from "typed.js";
import './Home.css';
import LoginForm from "./LoginForm/LoginForm.jsx";
import RegisterForm from "./RegisterForm/RegisterForm.jsx";
import SuccessForm from "./SuccessForm/SuccessForm.jsx";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher.jsx";
import FoodIcon from "../Icons/FoodIcon.jsx";

//Home component. Depending on 'currentForm' it changes the forms between login and register
function Home() {
    const [currentForm, setCurrentForm] = useState('login');
    const mainTitle = useRef(null);
    const subTitle = useRef(null);

    //A cool typing animation for the title
    useEffect(() => {
        const typed = new Typed(mainTitle.current, {
            strings: ['Eco^250Nom^100os'],
            typeSpeed: 50
        });

        return () => {
            typed.destroy();
        };
    }, []);

    //Another cool animation for the sub-title
    useEffect(() => {
        const typed = new Typed(subTitle.current, {
            strings: ['All your ^300expenses, ^150in one ^200place!', 'Set your ^400Goals!'],
            typeSpeed: 50,
            backSpeed: 30,
            startDelay: 1200,
            backDelay: 2000,
            loop: true,
            
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <>
            <div className="upper-section-wrapper">
                <LanguageSwitcher className="home-lang-switcher" />
                <div className="left-section">
                    <div className="title-section">
                        <h1 className="main-title">
                            <span ref={mainTitle}></span>
                        </h1>
                        <p className="sub-title">
                            <span ref={subTitle}></span>
                        </p>
                    </div>
                </div>
                <div className="right-section">
                    {currentForm === 'login' && <LoginForm onSwitchToRegister={() => setCurrentForm('register')}/>}
                    {currentForm === 'register' && <RegisterForm onSwitchToLogin={() => setCurrentForm('login')}
                                                                onSwitchToSuccess={() => setCurrentForm('success')}/>}
                    {currentForm === 'success' && <SuccessForm onSwitchToLogin={() => setCurrentForm('login')} />}
                </div>
            </div>
            <div className="lower-section-wrapper">

            </div>
        </>
    )
}

export default Home;