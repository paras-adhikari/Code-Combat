import React from 'react';
import UserPic from '../../../assets/user.png'
import { MdDeleteOutline } from 'react-icons/md';

const LeadCard = ({ user, index, canDelete, onDelete, deleting }) => {

  const colors = ['bg-purple-600', 'bg-indigo-600', 'bg-blue-600', 'bg-violet-600'];

  const cardColor = colors[index % colors.length]; // This will loop through colors

  return (
    <div className={`h-20 w-full ${cardColor} rounded-2xl flex gap-2 items-center p-3`}>
      <div className={`profile ${cardColor} h-[50px] w-[50px] rounded-full overflow-hidden flex-shrink-0`}><img src={UserPic} alt='img' /></div>
      <div className='info h-full w-full flex justify-between items-center py-3 px-5'>
        <p className='text-gray-100 font-bold'>{user.username}</p>
        <p className='text-gray-100 font-medium'>{Math.ceil(user.statistics?.rating || 0)}</p>
      </div>
      {canDelete && (
        <button
          onClick={onDelete}
          disabled={deleting}
          title="Delete my profile"
          className="text-gray-200 hover:text-red-400 disabled:opacity-50 transition-colors p-2 flex-shrink-0"
        >
          <MdDeleteOutline size={22} />
        </button>
      )}
    </div>
  );
}

export default LeadCard;
