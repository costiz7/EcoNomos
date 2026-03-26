function RoIcon({ className }) {
    return (
        <>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <defs>
                    <style>{`.cls-ro-1{fill:none;}.cls-ro-2{clip-path:url(#clip-path-ro);}.cls-ro-3{fill:#fdce24;}.cls-ro-4{fill:#c7483d;}.cls-ro-5{fill:#25477c;}`}</style>
                    <clipPath id="clip-path-ro"><circle className="cls-ro-1" cx="20" cy="20" r="20"/></clipPath>
                </defs>
                <g id="Capa_2" data-name="Capa 2">
                    <g id="Capa_1-2" data-name="Capa 1">
                        <g className="cls-ro-2">
                            <path className="cls-ro-3" d="M11.41-1.37H28.24a.8.8,0,0,1,.15,0A2.85,2.85,0,0,1,28.55.08q0,14.27,0,28.53V40.1a2.56,2.56,0,0,1-.17,1.27l-.54,0H11.41a2.39,2.39,0,0,1-.19-1.34V21.59q0-10.77,0-21.54A2.5,2.5,0,0,1,11.41-1.37Z"/>
                            <path className="cls-ro-4" d="M28.39,41.37V-1.35c1.68,0,3.36,0,5,0,3.13,0,6.27,0,9.4,0,1.53,0,2.42,1.69,2.41,3.88-.05,11.79,0,23.58,0,35.38,0,2.09-.84,3.53-2.14,3.53-4.87,0-9.73,0-14.59,0A.29.29,0,0,1,28.39,41.37Z"/>
                            <path className="cls-ro-5" d="M11.41-1.37q0,19.63,0,39.28c0,1.16,0,2.32,0,3.48q-7.24,0-14.49,0c-1.3,0-2.16-1.43-2.16-3.51V2.12c0-2.07.86-3.5,2.16-3.5Q4.17-1.39,11.41-1.37Z"/>
                        </g>
                    </g>
                </g>
            </svg>
        </>
    );
}

export default RoIcon;