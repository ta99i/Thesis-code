import React from 'react'
import { ConnectButton, Loading } from "@web3uikit/web3";
import bg2 from './bg2.jpg'

function Home() {
  return (
    <div scroll="no" className='flex items-center justify-center h-full  w-full bg-slate-200 fixed' style={{backgroundImage:`url(${bg2})`}}>
       <div>
       <div>
            <h1 className='text-2xl font-bold mb-5 text-white uppercase'>Login with your wallet</h1>
        </div>
         <ConnectButton className='flex justify-center' moralisAuth={false} signingMessage="connected" />
       </div>
    </div>
  )
}

export default Home