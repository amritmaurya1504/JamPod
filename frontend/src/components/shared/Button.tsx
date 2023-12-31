import { IButton } from "../../types"


const Button: React.FC<IButton> = ({ title, onClick, icon, iconPosition }) => {
    return (
        <button onClick={onClick} className='flex items-center justify-center gap-2 font-medium tracking-wide py-2 px-4 sm:px-8 border border-orange-500 outline-none rounded-l-full rounded-r-full capitalize bg-orange-500 text-white-500 transition-all hover:shadow-orange text-xs md:text-sm mx-auto'>
            {
                iconPosition === "left" ? (
                    <>
                        {
                            icon && (
                                <img
                                    src={`/images/${icon}`}
                                    alt="arrow"
                                    width={20}
                                    height={20}
                                />
                            )
                        }
                        <span>{title}</span>
                    </>
                ) : (
                    <>
                        <span>{title}</span>
                        {
                            icon && (
                                <img
                                    src={`/images/${icon}`}
                                    alt="arrow"
                                    width={20}
                                    height={20}
                                />
                            )
                        }
                    </>
                )
            }
        </button >
    )
}

export default Button
