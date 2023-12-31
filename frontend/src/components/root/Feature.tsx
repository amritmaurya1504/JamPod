import { features } from "../../constants";


const Feature:React.FC = () => {

    return (
        <div
            className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
            id="feature"
        >
            <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12" >
                <div className="flex w-full justify-end">
                    <div className="h-full w-full p-4" >
                        <img
                            src="/images/Illustration2.png"
                            alt="VPN Illustrasi"
                            height={414}
                            width={508}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center ml-auto w-full lg:w-9/12" >
                    <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-white-500">
                    Harmonize collaboration at JamPod – <strong>where music knows no limits.</strong>
                    </h3>
                    <p className="my-2 text-white-400">
                    Unleash your musical prowess on JamPod, a platform that harmonizes community, creativity, and collaboration. 
                    </p>
                    <ul className="text-black-500 self-start list-inside ml-8">
                        {features.map((feature, index) => (
                            <li
                                className="relative circle-check custom-list flex gap-4"
                                key={feature}>
                                <img src="/images/jam_check.svg" alt="checked" width={24} height={24} />
                                {feature}
                            </li>
                        )
                        )}
                    </ul>
                </div >
            </div >
        </div >
    );
};

export default Feature;