import React from 'react'
import Profile from '../Components/Profile/Profile'
import Navbar from '../Components/Navbar/Navbar'
import HelpPopup from '../Components/Help/HelpPopup'
import AIChatBot from "../Components/Chat/AIChatBot";
const ProfilePage = () => {
  return (
    <div className='overflow-hidden bg-gray-900'>
      <Navbar/>
      <Profile/>
      <HelpPopup/>
      <AIChatBot/>

    </div>
  )
}

export default ProfilePage
