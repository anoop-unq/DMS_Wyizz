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

// Replace the original UserCard component with this one
// Updated UserCard: wider and slightly shorter
const UserCard = ({ user }) => (
  <div className="bg-white py-4 px-3 rounded-lg shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 max-w-[380px] w-full">
    {/* Top: avatar + name + status */}
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-base">
          {/* small brand icon placeholder or logo */}
          {user.logo ? (
            <img src={user.logo} alt={user.name} className="w-9 h-9 object-cover rounded-md" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
      <div className="leading-tight">
  <h3 className="font-semibold text-sm text-gray-800 leading-[14px]">
    {user.name}
  </h3>
  <span className="text-[10px] text-gray-400 uppercase block mt-[5px]">
    {user.role}
  </span>
</div>

      </div>

      <span className="text-xs font-medium bg-[#DCFCE7] text-[#1D6A3A] px-2 py-0.5 rounded-full">
        {user.status}
      </span>
    </div>

    {/* Contact info grid */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 font-normal mb-2">
      <div className="flex items-center gap-2 truncate">
        <Mail size={13} className="text-gray-400" />
        <span title={user.email} className="truncate">{user.email}</span>
      </div>

      <div className="flex items-center gap-2 truncate">
        <Phone size={13} className="text-gray-400" />
        <span>{user.phone}</span>
      </div>

      <div className="flex items-center gap-2 truncate">
        <MapPin size={13} className="text-gray-400" />
        <span>{user.location}</span>
      </div>

      <div className="flex items-center gap-2 truncate">
        <Calendar size={13} className="text-gray-400" />
        <span>Joined {user.joined}</span>
      </div>
    </div>

    {/* Stats row */}
    <div className="flex items-center justify-between mt-4 gap-4 mt-2 mb-1">
      <div className="w-[110px]">
        <div className="bg-[#EFF6FF] rounded-md py-2.5 text-center border border-[#E0E7FF]">
          <div className="text-[18px] font-semibold text-[#1E3A8A] leading-none">{user.offers}</div>
          <div className="text-[11px] text-[#475569] mt-1">Active Offers</div>
        </div>
      </div>

      <div className="w-[110px]">
        <div className="bg-[#ECFDF5] rounded-md py-2.5 text-center border border-[#BBF7D0]">
          <div className="text-[18px] font-semibold text-green-700 leading-none">{user.transactions}</div>
          <div className="text-[11px] text-[#475569] mt-1">Transactions</div>
        </div>
      </div>
    </div>

    {/* Footer actions */}
    <div className="border-t border-gray-300 mt-3 pt-2 flex justify-end items-center gap-2">
      <button
        className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-gray-50"
        aria-label="view"
      >
        <Eye size={15} />
      </button>
      <button
        className="text-gray-400 hover:text-green-600 p-1 rounded-md hover:bg-gray-50"
        aria-label="edit"
      >
        <Pencil size={15} />
      </button>
      <button
        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-50"
        aria-label="delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

const MerchantManagement = () => {
  // Updated sample data: company name + industry instead of 'ADMIN'
  const users = Array(6).fill({
    name: 'ABC Electronics',      // company name shown in card title
    role: 'ELECTRONICS',          // subtitle (uppercase) shown under company
    email: 'contact@abcelectronics.com',
    phone: '+91 12345-12345',
    location: 'Mumbai, India',
    joined: '8/22/2023',
    status: 'Active',
    offers: 6,
    transactions: 892,
    logo: null, // put logo url here if available
  });

  return (
    <div className="p-5">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="head">Merchant Management</h1>
          <p className="para mt-3">
            Manage and monitor merchant partners
          </p>
        </div>
        <button className="flex items-center gap-2 btn-primary-violet">
          <Plus size={18} />
          New Merchant
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white h-15 py-2 px-2 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500">Total Merchants</p>
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
            Blocked
          </span>
        </div>
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </main>
    </div>
  );
};

export default MerchantManagement;
