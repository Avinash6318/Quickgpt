import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { assets } from '../assets/assets'
import Message from './Message'

const chatbox = () => {
  const {selectedChat,theme} =useAppContext()
  const[messages,setMessages]=useState([])
  const[loading,setLoading]=useState(false)
  const[prompt,setPrompt] =useState('')
  const[mode,setMode] =useState('text')
  const[isPublished,setIsPublished]=useState(false)

  const containerRef = useRef(null)


  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({top:containerRef.current.scrollHeight, behavior:'smooth'})
    }
  },[messages])




  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* chat messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length===0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img className='w-full max-w-56 sm:max-w-68'
            src={theme==='dark'? assets.logo_full: assets.logo_full_dark} alt="" />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>
              Ask Me Anythiing
            </p>

          </div>
        )}

        {messages.map((message,index)=>(
          <Message key={index} message={message}/>
        ))}

        {loading&&
         <div className='loader flex item-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
         </div>
         }
      </div>

      {mode==='image'&&(
        <label className='inline-flex items-center gp-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'> publish generated image to community </p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished}
           onChange={(e)=>setIsPublished(e.target.value)} />
        </label>
      )}

      {/* prompt input box */}
      <form   className="mx-auto flex gap-4 items-center rounded-full w-full max-w-2xl
       p-3 pl-4 border border-primary dark:border-[#80607F]/30 bg-primary/20 dark:bg-[#583C7F]/30">
        <select className='textsm pt-3 pr-2 outline-none' onChange={(e)=>setMode(e.target.value)} value={mode}>
          <option value="text" className='dark:bg-purple-900'>Text</option>
          <option value="image" className='dark:bg-purple-900'>Image</option>
        </select>
        <input type="text" placeholder='Type your prompt here' onChange={(e)=>setPrompt(e.target.value)} value={prompt} 
        className='flex-1 w-full text-sm outline-none' required/>
        <button disabled={loading}>
          <img src={loading?assets.stop_icon:assets.send_icon} alt="" className='w-8 cursor-pointer' />
        </button>
      </form>

    </div>
  )
}

export default chatbox