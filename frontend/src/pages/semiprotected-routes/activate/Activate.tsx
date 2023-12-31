import { useState } from "react";
import { Navigation } from "../../../components/shared";
import { StepAvatar, StepName } from "../../../components/steps"
import { ISteps } from "../../../types";

const steps: ISteps = {
  1: StepName,
  2: StepAvatar
}

const Activate = () => {

  const [step, setStep] = useState<number>(1);
  const Step = steps[step];
  const onNext = (): void => {
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

export default Activate
