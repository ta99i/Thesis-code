import React from 'react'
import { ConnectButton, Loading } from "@web3uikit/web3";
function Home() {
  return (
    <div className='flex items-center justify-center h-96 absolute w-full bg-slate-200'>
       <div>
       <div>
            <h1 className='text-lg font-bold mb-5'>Login with your wallet</h1>
        </div>
         <ConnectButton moralisAuth={false} signingMessage="connected" />
       </div>
    </div>
  )
}

export default Home