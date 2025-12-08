import React from 'react';
import {
  Plus,
  Calendar,
  Search,
  Filter,
  Mail,
  MapPin,
  Phone,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

const UserCard = ({ user }) => (
  <div className="bg-white py-2 px-5 rounded-lg shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-800">{user.name}</h3>
          <span className="text-xs text-gray-400 uppercase">{user.role}</span>
        </div>
      </div>
      <span className="text-xs font-medium bg-[#DCFCE7] text-[#1D6A3A] px-2 py-0.5 rounded-full">
        {user.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 font-normal mb-2">
      <div className="flex items-center gap-2 truncate mb-2 mt-2">
        <Mail size={14} className="text-gray-400" />
        <span title={user.email} className="truncate">{user.email}</span>
      </div>

      <div className="flex items-center gap-2 truncate">
        <Phone size={14} className="text-gray-400" />
        <span>{user.phone}</span>
      </div>
      <div className="flex items-center gap-2 truncate">
        <MapPin size={14} className="text-gray-400" />
        <span>{user.location}</span>
      </div>
      <div className="flex items-center gap-2 truncate">
        <Calendar size={14} className="text-gray-400" />
        <span>Joined {user.joined}</span>
      </div>
    </div>

    <div className="border-t border-gray-100 pt-2 flex justify-end items-center gap-2">
      <button className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100">
        <Eye size={16} />
      </button>
      <button className="text-gray-400 hover:text-green-600 p-1 rounded-md hover:bg-gray-100">
        <Pencil size={16} />
      </button>
      <button className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-100">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const UserManagement = () => {
  const users = Array(6).fill({
    name: 'Sarah Ahmed',
    role: 'ADMIN',
    email: 'sarah.ahmed@email.com',
    phone: '+92-301-7890123',
    location: 'Mumbai, India',
    joined: '8/22/2023',
    status: 'Active',
  });

  return (
    <div className="p-5">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="head">User Management</h1>
          <p className="para mt-3">
            Manage user accounts, roles, and activity securely
          </p>
        </div>
        <button className="flex items-center gap-2 btn-primary-violet">
          <Plus size={18} />
          New User
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white h-15 py-2 px-2 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500">Total User</p>
            <span className="text-[14px] font-medium text-gray-800">6</span>
          </div>
          <Calendar size={20} className="text-gray-400" />
        </div>

        <div className="bg-white h-15 py-2 px-2 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500">Active</p>
            <span className="text-[14px] font-medium text-gray-800">3</span>
          </div>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Live
          </span>
        </div>

        <div className="bg-white h-15 py-2 px-2 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500">Pending</p>
            <span className="text-[14px] font-medium text-gray-800">6</span>
          </div>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            Pending
          </span>
        </div>

        <div className="bg-white h-15 py-2 px-2 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500">Suspended</p>
            <span className="text-[14px] font-medium text-gray-800">1</span>
          </div>
          <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Ended
          </span>
        </div>
      </section>

      <div className="bg-white p-4 rounded-lg shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by Name..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16} />
            <span>Type</span>
          </button>
        </div>
        <span className="text-sm text-gray-500">2 of 2 campaigns</span>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </main>
    </div>
  );
};

export default UserManagement;
