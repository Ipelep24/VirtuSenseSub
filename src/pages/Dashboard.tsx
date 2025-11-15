// pages/Dashboard.tsx
import React from 'react';
import { SidebarLayout } from './layout/SidebarLayout';
import Time from '../components/Time';
import homeImage from '../assets/home.jpg'
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC & {
    layout?: (page: React.ReactNode) => JSX.Element;
} = () => {
    const history = useHistory()

    return (
        <div className='h-full w-full flex flex-col gap-15 lg:flex-row text-white p-4 bg-[#1c1c1b]'>
            <div className='w-full h-full lg:w-1/2 lg:flex flex-col space-y-7 justify-around'>
                <Time />
                <div className='flex flex-col gap-3'>
                    <div>
                        <h1 className='text-3xl sm:text-[40px] tracking-wide leading-12 [word-spacing:0.2em] whitespace-break-spaces'>Video calls and emotion-aware learning for all.</h1>
                    </div>
                    <div>
                        <h1 className='text-2xl sm:text-3xl tracking-normal sm:tracking-wide text-gray-500 leading-11'>Engage, interact, and<br /> understand with VirtuSense.</h1>
                    </div>
                </div>
                <div className='flex w-full justify-center lg:justify-start'>
                    <button
                        className='bg-[#1a7368] w-1/2 md:w-1/3 px-4 py-2 rounded-md cursor-pointer hover:bg-[#165b53]'
                        onClick={() => history.push('/create')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <div className='w-full h-full lg:w-1/2 gap-15 py-4 flex flex-col justify-center items-center'>
                <img
                    src={homeImage}
                    alt='Image'
                    className='w-3/4 h-auto rounded-md'
                />
                <div className='w-2/3'>
                    <h1 className='text-center text-xl sm:text-2xl font-light'>Host or join a video conference with people around the world</h1>
                    <h1 className='text-center sm:text-md text-gray-600'>Join or host virtual meetings with anyone, anywhere.</h1>
                </div>
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Dashboard;