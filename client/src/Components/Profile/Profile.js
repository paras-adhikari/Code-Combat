import React from "react";
import Ellipse from "../../assets/Ellipse 20@1x.png";
import RectangleTop from "../../assets/Rectangle 3@1x.png";
import RectangleBottom from "../../assets/Rectangle 1@3x.png";
import ProfileCard from "./ProfileCard";
import Leaderboard from "./Leaderboard/Leaderboard";
import StatusGraph from "./StatusGraph";

const Profile = () => {
  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={Ellipse}
          alt="Decorative Ellipse"
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vh] opacity-20 blur-2xl"
        />
        <img
          src={RectangleTop}
          alt="Decorative Rectangle"
          className="absolute top-[-15%] left-[-5%] w-[40vw] h-[40vh] opacity-10 blur-3xl"
        />
        <img
          src={RectangleBottom}
          alt="Decorative Rectangle"
          className="absolute bottom-[-30%] left-[-10%] w-[50vw] h-[50vh] opacity-10 blur-3xl"
        />
      </div>

      {/* Main Content - normal flow layout so nothing overlaps or gets hidden */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Profile Card (name, github/linkedin, stats) */}
        <ProfileCard />

        {/* Chart + Leaderboard side by side on large screens, stacked on small screens */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-1/2 flex justify-center">
            <StatusGraph />
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
