import React, { useState } from 'react';
import { MdSupportAgent } from "react-icons/md";

const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage popup visibility

  // Function to toggle the popup visibility
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Help Button */}
      <button
        className="fixed bottom-6 right-6 bg-black text-white p-5 rounded-full text-lg hover:bg-gray-700 hover:scale-105 transition-transform transition-duration:200"
        onClick={togglePopup}
      >
        <MdSupportAgent className='w-full h-full'/>
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-white w-96 p-6 rounded-lg shadow-lg relative">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Help & Support</h2>
              <button
                className="text-lg text-white hover:text-gray-300 hover:scale-105 transition-transform transition-duration:200 font-semibold"
                onClick={togglePopup}
              >
                X
              </button>
            </div>
            <div className="mt-4 text-center">
              <p>
                Powered by{' '}
                <a 
                  href="https://www.glbajajgroup.org/" 
                  class="text-yellow-400 hover:text-yellow-500 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GL Bajaj
                </a>
              </p>

              <p>If you need assistance, please contact us:</p>
              <ul className="mt-4">
                <li>
                  <strong>Email:</strong> shubhsaxena447@gmail.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 (123) 456-7890
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPopup;
