import { PuffLoader  } from 'react-spinners'
import Card from './Card'

interface ILoader {
    message: string
}

const Loader:React.FC<ILoader> = ({message}) => {
    return (
        <div className='flex items-center justify-center mt-24'>
            <Card>
                <div className='flex flex-col mt-16 items-center justify-center'>
                    <PuffLoader  color="#F44336" />
                    <span className='mt-3' >{message}</span>
                </div>
            </Card>
        </div>
    )
}

export default Loader
