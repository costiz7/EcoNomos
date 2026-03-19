function FoodIcon({ className }) {
    return (
        <>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18">
                <path fill="currentColor" d="M13.5,18l-1.5-13h2.23L13.1.46l1.74-.46,1.25,5h3.91l-1.5,13h-5M3,8h5c1.66,0,3,1.34,3,3H0c0-1.66,1.34-3,3-3M11,15c0,1.66-1.34,3-3,3H3c-1.66,0-3-1.34-3-3h11M1,12h5l1.5,1.5,1.5-1.5h1c.55,0,1,.45,1,1s-.45,1-1,1H1c-.55,0-1-.45-1-1s.45-1,1-1Z"/>
            </svg>
        </>
    );
}

export default FoodIcon;