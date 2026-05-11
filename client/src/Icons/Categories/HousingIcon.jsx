function HousingIcon({ className, style }) {
    return (
        <svg 
            className={className} 
            style={style} 
            viewBox="0 0 32 32" 
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--dark-orange-color)"
        >
            <path d="M29.52,11.15L16.52,3.15c-.32-.2-.73-.2-1.05,0L2.48,11.15c-.47.29-.62.91-.33,1.38s.9.62,1.38.33l1.48-.91v14.06c0,1.65,1.44,3,3.22,3h4.78c.55,0,1-.45,1-1v-8c0-1.1.9-2,2-2s2,.9,2,2v8c0,.55.45,1,1,1h4.78c1.78,0,3.22-1.35,3.22-3v-14.06l1.48.91c.16.1.34.15.52.15.34,0,.66-.17.85-.48.29-.47.14-1.09-.33-1.38Z" />
        </svg>
    );
}

export default HousingIcon;