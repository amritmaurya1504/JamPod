import { Button, Card, Navigation } from '../../../components/shared'
import { Link, useNavigate } from 'react-router-dom';

const GetStarted = () => {

  
  const router = useNavigate();
  const handleRegister = () => {
    router("/authenticate");
  }

  return (
    <>
      <Navigation />
      <div className='flex items-center justify-center mt-24'>
        <Card title="Welcome to JamPod!" icon="images/small_logo.png">
          <p className='leading-[1.6] text-sm md:text-[16px] text-white-400 mb-8'>We’re working hard to get Codershouse ready for everyone! While we wrap up the finishing youches, we’re adding people gradually to make sure nothing breaks :)</p>
          <div>
            <Button title="Let's Go" icon="arrow-forward.png" onClick={handleRegister} />
          </div>
          <div className='mt-4'>
            <span className='text-indigo-500 text-xs mr-1' >Have an invite text?</span>
            <Link className='text-indigo-500 text-xs font-bold' to="/authenticate">Sign In</Link>
          </div>
        </Card>
      </div>
    </>
  )
}

export default GetStarted
