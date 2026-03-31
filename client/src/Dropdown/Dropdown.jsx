import './Dropdown.css';
import { useState, useEffect } from 'react';

function Dropdown({ dataArr=[], width=200, height=50, displayLabel="Select", labelKey = 'label' }) {
    const [ isOpen, setIsOpen ] = useState(false);
    return (
        <>
            <div className="dropdown-component-wrapper" style={{ width, height }}>
                { isOpen && 
                <div className={`dropdown-content-wrapper ${isOpen ? 'slide-in-down' : 'slide-out-up'}`} style={{ width, height: 'auto', 
                                                                                                                    position: 'absolute',
                                                                                                                    top: height, left: '0px',
                                                                                                                    zIndex: 10 }} >
                {dataArr.length > 0 ? (
                        dataArr.map((item, index) => (
                            <div 
                                key={index} 
                                className="dropdown-item"
                                onClick={() => {
                                    console.log("Ai selectat:", item[labelKey]);
                                    // Aici vei pune funcția de selectare mai târziu
                                    setIsOpen(false); 
                                }}
                            >
                                {item[labelKey]}
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item empty">Nu există date</div>
                    )}

                </div>}
                <div className={`dropdown-input-wrapper ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}>
                    <span className='displayLabel'>{displayLabel}</span>
                    <span className="dropdownArrow">v</span>
                </div>
                
            </div>
        </>
    );
}

export default Dropdown;