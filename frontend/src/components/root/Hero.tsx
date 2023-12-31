import { listUser } from '../../constants'
import { ButtonPrimary } from '../shared'

const Hero:React.FC = () => {
  return (
    <div
      className="max-w-screen-xl mt-20 px-8 xl:px-16 mx-auto"
      id="about"
    >
      <div
        className="py-10 mt-10 lg:mt-24 lg:py-12 lg:grid lg:grid-flow-col lg:grid-cols-2 lg:gap-5"
      >
        {/*     className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-12 md:pt-24" */}
        <div className=" flex flex-col justify-center items-start row-start-2 sm:row-start-1">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-[#fff] leading-normal">
            Where voices unite and melodies <strong>take flight.</strong>
          </h1>
          <em className="text-black-500 sm:md-2 md:mt-4">
            Feel the rhythm, join the rhyme – live in the moment, one song at a time.
          </em>
          <p className="text-white-400 mt-4 mb-6">
            Jampod: Where Music Jams and Podcasts Collide! Experience the fusion of live jams and insightful podcasts in one dynamic platform. Join musicians for spontaneous sessions or tune into engaging discussions – Jampod is your space for sonic exploration!
          </p>
          <ButtonPrimary title="Get Started" url='/get-started' />
        </div>
        <div className="hidden lg:block">
          <div className="h-full w-full" >
            <img
              src="/images/Illustration1.png"
              alt="VPN Illustrasi"
              width={612}
              height={383}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full flex">
        <div
          className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-7 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-black-700 z-10">
          {listUser.map((listUsers, index) => (
            <div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}

            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-white-500 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-gray-100">{listUsers.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div>
    </div>
  )
}

export default Hero
