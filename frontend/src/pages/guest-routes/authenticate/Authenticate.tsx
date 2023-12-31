import { useState } from 'react';
import { Navigation } from '../../../components/shared'
import { StepEmail, StepOTP } from '../../../components/steps';
import { ISteps } from '../../../types';


const steps: ISteps = {
  1: StepEmail,
  2: StepOTP
}

const Authenticate:React.FC = () => {

  const [step, setStep] = useState<number>(1);
  const Step = steps[step];
  const onNext = () => {
    setStep(step + 1);
  }

  return (
    <>
      <Navigation />
      <div>
        <Step onNext={onNext} />
      </div>
    </>
  )
}

export default Authenticate
