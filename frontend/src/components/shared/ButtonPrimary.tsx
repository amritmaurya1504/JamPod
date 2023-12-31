import { Link } from "react-router-dom";
import { IButtonPrimary } from "../../types";


const ButtonPrimary:React.FC<IButtonPrimary> = ({ title, onClick, addClass, url }) => {
  return (
    <Link to={url || ''}
      className={
        "py-2 lg:py-4 px-10 text-[14px] lg:text-[17px] lg:px-16 text-white-500 font-semibold rounded-lg bg-orange-500 hover:shadow-orange-md transition-all outline-none " +
        addClass
      } onClick={onClick}
    >
      {title}
    </Link>
  );
};

export default ButtonPrimary;