import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Battle from '../Components/Battle/Battle'
import HelpPopup from '../Components/Help/HelpPopup'
import AIChatBot from "../Components/Chat/AIChatBot";
import Ellipse from "../assets/Ellipse 20@1x.png";
import RectangleTop from "../assets/Rectangle 3@1x.png";
import RectangleBottom from "../assets/Rectangle 1@3x.png";

const BattlePage = () => {
  return (
    <div className='overflow-x-hidden bg-gray-900'>
       <div className="relative w-full h-full overflow-hidden">
        {/* Background Decorations */}
        <img
          src={Ellipse}
          alt="decorative ellipse"
          className="absolute bottom-0 -right-40 w-[1200px] opacity-20"
        />
        <img
          src={RectangleTop}
          alt="top rectangle"
          className="absolute -top-[60%] -left-[15%] w-[900px] opacity-30"
        />
        <img
          src={RectangleBottom}
          alt="bottom rectangle"
          className="absolute -bottom-[80%] -left-[10%] w-[1100px] opacity-30"
        />
      </div>
        <Navbar/>
        <Battle/>
        <HelpPopup/>
        <AIChatBot/>

    </div>
  )
}

export default BattlePage
