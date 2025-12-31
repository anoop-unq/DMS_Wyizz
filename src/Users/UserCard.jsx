import React from 'react';
import { Mail, Phone, MapPin, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';

const UserCard = ({ user, onEdit, onView, onDelete }) => (
  <div className="bg-white py-4 px-5 rounded-lg shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 hover:border-indigo-100 transition-all">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg uppercase">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 className="font-semibold text-[15px] text-gray-800">{user.name}</h3>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{user.usertype}</span>
        </div>
      </div>
      {user.is_locked && (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
          Locked
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-gray-600 font-normal mt-4 mb-4">
      <div className="flex items-center gap-2 truncate">
        <Mail size={14} className="text-gray-400" />
        <span title={user.email} className="truncate">{user.email}</span>
      </div>
      <div className="flex items-center gap-2 truncate">
        <Phone size={14} className="text-gray-400" />
        <span>{user.phone || 'N/A'}</span>
      </div>
      <div className="flex items-center gap-2 truncate">
        <MapPin size={14} className="text-gray-400" />
        <span className="truncate">{user.city || 'Location'}</span>
      </div>
      <div className="flex items-center gap-2 truncate">
        <Calendar size={14} className="text-gray-400" />
        <span>Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
      </div>
    </div>

    <div className="border-t border-gray-100 pt-3 flex justify-end items-center gap-2">
      <button 
        onClick={onView} 
        className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
        title="View Details"
      >
        <Eye size={15} />
      </button>
      <button 
        onClick={onEdit} 
        className="p-1.5 rounded-md hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
        title="Edit User"
      >
        <Pencil size={15} />
      </button>
      <button 
        onClick={() => onDelete(user.id)}
        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete User"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

export default UserCard;