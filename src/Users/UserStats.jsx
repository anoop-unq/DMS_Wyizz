import React from 'react';

const UserStats = ({ stats }) => (
  <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
    <div className="bg-white py-2 px-3 rounded-md shadow-sm border border-gray-100 flex flex-col justify-center min-h-[50px]">
      <p className="text-[11px] font-normal text-gray-500">Total Users</p>
      <span className="text-[15px] font-normal text-gray-700">{stats.total}</span>
    </div>
    <div className="bg-white py-2 px-3 rounded-md shadow-sm border border-gray-100 flex flex-col justify-center min-h-[50px]">
      <p className="text-[11px] font-normal text-gray-500">Locked</p>
      <span className="text-[15px] font-normal text-gray-700">{stats.locked}</span>
    </div>
  </section>
);

export default UserStats;