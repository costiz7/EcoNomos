import EntertainmentIcon from "./EntertainmentIcon.jsx";
import FoodIcon from "./FoodIcon.jsx";
import HealthIcon from "./HealthIcon.jsx";
import SalaryIcon from "./SalaryIcon.jsx";
import ShoppingIcon from "./ShoppingIcon.jsx";
import TransportIcon from "./TransportIcon.jsx";
import UtilitiesIcon from "./UtilitiesIcon.jsx";

function CategoryIcon({ iconFile, className, style }) {
    switch(iconFile) {
        case "icon_food":
            return <FoodIcon className={ className } style={ style } />
        case "icon_transport":
            return <TransportIcon className={ className } style={ style } /> 
        case "icon_utilities":
            return <UtilitiesIcon className={ className } style={ style } /> 
        case "icon_entertainment":
            return <EntertainmentIcon className={ className } style={ style } /> 
        case "icon_shopping":
            return <ShoppingIcon className={ className } style={ style } /> 
        case "icon_health":
            return <HealthIcon className={ className } style={ style } /> 
        case "icon_salary":
            return <SalaryIcon className={ className } style={ style } />
        default:
            return null;  
    }
}

export default CategoryIcon;