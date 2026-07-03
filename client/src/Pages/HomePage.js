import React from "react";
import HomeTopCard from "../Components/Home/HomeTopCard";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';
import HelpPopup from '../Components/Help/HelpPopup';
import AIChatBot from "../Components/Chat/AIChatBot";
import _75 from '../HomeContent/75sheet.pdf';
import DBMS from '../HomeContent/DBMS.pdf';
import SOFT from '../HomeContent/SOFT.pdf';
import DSA from '../HomeContent/DSA.pdf';
import DSA_ from '../HomeContent/DSA_.pdf';
import CN from '../HomeContent/CN.pdf';
import Navbar from "../Components/Navbar/Navbar";
import Ellipse from "../assets/Ellipse 20@1x.png";
import RectangleTop from "../assets/Rectangle 3@1x.png";
import RectangleBottom from "../assets/Rectangle 1@3x.png";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser(); 

  const topCardsData = [
    {
      title: "75 Days DSA Sheet",
      description: "A structured 75-day roadmap to ace DSA with daily questions.",
      buttonLabel: "Download",
      color: "green",
      fileUrl: _75, 
    },
    {
      title: "Complete DSA Sheet",
      description: "A comprehensive sheet covering all important DSA topics.",
      buttonLabel: "Download",
      color: "green",
      fileUrl: DSA, 
    },
    {
      title: "DSA Roadmap",
      description: "Step-by-step guidance to understand and master DSA.",
      buttonLabel: "Download",
      color: "green",
      fileUrl: DSA_, 
    },
  ];

  const bottomCardsData = [
    {
      title: "Design and Analysis of Algorithms",
      buttonLabel: "Handwritten Notes",
      color:"",
      description: "Complete handwritten notes of Design and Analysis of Algorithms.",
      fileUrl: DSA, 
    },
    {
      title: "Operating System",
      buttonLabel: "Handwritten Notes",
      color:"",
      description: "Complete handwritten notes of Operating System.",
      fileUrl: SOFT, 
    },
    {
      title: "Computer Networks",
      buttonLabel: "Handwritten Notes",
      color:"",
      description: "Complete handwritten notes of Computer Networks.",
      fileUrl: CN, 
    },
    {
      title: "Database Management Systems",
      buttonLabel: "Handwritten Notes",
      color:"",
      description: "Complete handwritten notes of Database Management System.",
      fileUrl: DBMS, 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
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

      <div className="container mx-auto px-6 py-4 flex-grow">        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">Welcome to DSA & CS Learning Hub</h1>
          <p className="text-lg text-gray-200 mt-2">Explore curated content to master Data Structures, Algorithms, and Core CS subjects.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-3">
          {topCardsData.map((card, index) => (
            <HomeTopCard key={index} {...card} />
          ))}
        </div>

        <div>
          <h2 className="text-4xl font-bold text-indigo-600 text-center">Core Subjects</h2>
          <p className="text-lg text-gray-200 mt-2 text-center pb-5">Explore curated content to master Data Structures, Algorithms, and Core CS subjects.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bottomCardsData.map((card, index) => (
              <HomeTopCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
      <HelpPopup />
      <AIChatBot />
    </div>
  );
};

export default HomePage;