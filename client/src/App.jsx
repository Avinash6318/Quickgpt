import React,{useState} from 'react'
import {Routes,Route, useLocation} from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Chatbox from './components/ChatbOX.JSX'
import Credit from './pages/Credit'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { useAppContext } from './context/Appcontext'

const App = () => {

  const [isMenuOpen,setIsMenuOpen] = useState(false)
  const{pathname} = useLocation()
  if(pathname==='/loading')return <Loading/>

  const {user}=useAppContext()
  return (
    <>
     {!isMenuOpen&& <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'
     onClick={()=>{setIsMenuOpen(true)}}/>
     }
     {user?(
      <div className='dark:bg-linear-to from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen '>
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          <Routes>
          <Route path='/' element={<Chatbox/>}/> 
          <Route path='/credits' element={<Credit/>}/>
          <Route path='/community' element={<Community/>}/>
          </Routes>
        </div>
      </div>
     ):(
      <div><Login/></div>
     )}
      
    </>
  )
}

export default App