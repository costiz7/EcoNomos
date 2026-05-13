import './Dropdown.css';
import { useState } from 'react';

function Dropdown({ 
    dataArr=[], 
    width=200, 
    height=50, 
    displayLabel="Select", 
    labelKey = 'denumire', 
    onSelect,
    disabled = false
}) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsOpen(false); 
        
        if (onSelect) {
            onSelect(item.id);
        }
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown-component-wrapper" style={{ width, height, position: 'relative' }}>
            { isOpen && 
            <div className={`dropdown-content-wrapper ${isOpen ? 'dropdown-slide-in' : ''}`} 
                style={{ width, height: 'auto', position: 'absolute', top: height, left: '0px', zIndex: 10 }} >
                {dataArr.length > 0 ? (
                    dataArr.map((item) => (
                        <div key={item.id} className="dropdown-item" onClick={() => handleItemClick(item)}>
                            {item[labelKey]}
                        </div>
                    ))
                ) : (
                    <div className="dropdown-item empty">--------</div>
                )}
            </div>}
            
            <div 
                className={`dropdown-input-wrapper ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}`} 
                onClick={handleToggle}
            >
                <span className='displayLabel'>
                    {selectedItem ? selectedItem[labelKey] : displayLabel}
                </span>
                <span className="dropdownArrow">v</span>
            </div>
        </div>
    );
}

export default Dropdown;