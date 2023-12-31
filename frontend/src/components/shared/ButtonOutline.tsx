import { Link } from "react-router-dom";
import { IButtonOutline } from "../../types";

const ButtonOutline:React.FC<IButtonOutline> = ({ title, url }) => {
    return (
        <Link to={url || ''} className="font-medium tracking-wide py-2 px-5 sm:px-8 border border-orange-500 outline-none rounded-l-full rounded-r-full capitalize bg-orange-500 text-white-500 transition-all hover:shadow-orange ">
            {title}
        </Link>
    );
};

export default ButtonOutline;