import './LoadingOverlay.css';
import LogoIcon from '../Icons/LogoIcon';

function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner-text">
               <LogoIcon /> 
            </div>
        </div>
    );
}

export default LoadingOverlay;