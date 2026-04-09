function DashboardIcon({ className, style }) {
    return (
        <svg 
            className={className}
            style={style} 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                fill="currentColor" 
                fillRule="evenodd"
                d="M4,13 L10,13 C10.55,13 11,12.55 11,12 L11,4 C11,3.45 10.55,3 10,3 L4,3 C3.45,3 3,3.45 3,4 L3,12 C3,12.55 3.45,13 4,13 Z M4,21 L10,21 C10.55,21 11,20.55 11,20 L11,16 C11,15.45 10.55,15 10,15 L4,15 C3.45,15 3,15.45 3,16 L3,20 C3,20.55 3.45,21 4,21 Z M14,21 L20,21 C20.55,21 21,20.55 21,20 L21,12 C21,11.45 20.55,11 20,11 L14,11 C13.45,11 13,11.45 13,12 L13,20 C13,20.55 13.45,21 14,21 Z M13,4 L13,8 C13,8.55 13.45,9 14,9 L20,9 C20.55,9 21,8.55 21,8 L21,4 C21,3.45 20.55,3 20,3 L14,3 C13.45,3 13,3.45 13,4 Z" 
            />
        </svg>
    );
}

export default DashboardIcon;