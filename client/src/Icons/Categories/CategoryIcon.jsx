import EntertainmentIcon from "./EntertainmentIcon.jsx";
import FoodIcon from "./FoodIcon.jsx";
import HealthIcon from "./HealthIcon.jsx";
import SalaryIcon from "./SalaryIcon.jsx";
import ShoppingIcon from "./ShoppingIcon.jsx";
import TransportIcon from "./TransportIcon.jsx";
import UtilitiesIcon from "./UtilitiesIcon.jsx";
import HousingIcon from "./HousingIcon.jsx";
import TravelIcon from "./TravelIcon.jsx";
import EducationIcon from "./EducationIcon.jsx";
import PersonalCareIcon from "./PersonalCareIcon.jsx";
import PetsIcon from "./PetsIcon.jsx";
import GiftsIcon from "./GiftsIcon.jsx";
import InvestmentsIcon from "./InvestmentsIcon.jsx";
import FreelanceIcon from "./FreelanceIcon.jsx";
import DividendsIcon from "./DividendsIcon.jsx";
import RefundsIcon from "./RefundsIcon.jsx";

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
        case "icon_housing":
            return <HousingIcon className={ className } style={ style } />
        case "icon_travel":
            return <TravelIcon className={ className } style={ style } />
        case "icon_education":
            return <EducationIcon className={ className } style={ style } />
        case "icon_personal_care":
            return <PersonalCareIcon className={ className } style={ style } />
        case "icon_pets":
            return <PetsIcon className={ className } style={ style } />
        case "icon_gifts":
            return <GiftsIcon className={ className } style={ style } />
        case "icon_investments":
            return <InvestmentsIcon className={ className } style={ style } />
        case "icon_salary":
            return <SalaryIcon className={ className } style={ style } />
        case "icon_freelance":
            return <FreelanceIcon className={ className } style={ style } />
        case "icon_dividends":
            return <DividendsIcon className={ className } style={ style } />
        case "icon_refunds":
            return <RefundsIcon className={ className } style={ style } />
        default:
            return null;  
    }
}

export default CategoryIcon;