import React from "react";
import {
  Calendar,
  Search,
  Filter,
  Percent,
  Tag,
} from "lucide-react";

/**
 * ApproverManagement.jsx
 * - Updated: removed requests/participants stats
 * - Footer buttons: justify-between, bold color styles for View/Approve/Reject
 * - Search area: all icons small and compact
 */

const ApproverCard = ({ item }) => (
  <div className="bg-white py-3 px-4 rounded-lg shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 w-full max-w-[420px]">
    {/* Top row: icon + title + status */}
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-slate-100 text-[#16A34A] flex items-center justify-center text-base">
          <Percent size={14} />
        </div>

        <div className="leading-tight">
          <h3 className="font-semibold text-sm text-gray-800 leading-[18px]">
            {item.title}
          </h3>
          <span className="text-[10px] text-gray-400 uppercase block mt-[1px]">
            {item.type}
          </span>
        </div>
      </div>

      <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
        {item.status}
      </span>
    </div>

    {/* description */}
    <p className="text-xs text-gray-500 mb-3 leading-snug">{item.description}</p>

    {/* details row (value, date, merchant, category) */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-3">
      <div className="flex items-center gap-2">
        <Tag size={14} className="text-gray-400" />
        <span>Value: {item.value}</span>
      </div>

      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400" />
        <span>{item.expiry}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* small neutral icon for visual parity */}
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{item.merchant}</span>
      </div>

      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{item.category}</span>
      </div>
    </div>

    {/* (removed the old stats row per your request) */}

  {/* Footer actions */}
<div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-[10px]">
  <button
    className="w-[80px] h-[32px] rounded-[8px] bg-[#F0FDF4] text-[#16A34A] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px]"
  >

    View
  </button>

  <button
    className="w-[80px] h-[32px] rounded-[6px] bg-[#EFF6FF]  text-[#2563EB] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px]"
  >

    Approve
  </button>

  <button
    className="w-[80px] h-[32px] rounded-[6px] bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px]"
  >

    Reject
  </button>
</div>

  </div>
);

const Approver = () => {
  const items = [
    {
      title: "Weekend Sale Discount",
      type: "DISCOUNT",
      description:
        "Get instant discount on all purchases during weekends. Valid for all card types.",
      value: "10%",
      expiry: "12/31/2024",
      merchant: "ABC Electronics",
      category: "Gold",
      status: "Active",
    },
    {
      title: "Premium Card Cashback",
      type: "CASHBACK",
      description:
        "Earn cashback on premium card transactions. Minimum transaction amount ₹1000.",
      value: "5%",
      expiry: "6/15/2024",
      merchant: "Fashion Hub",
      category: "Gold",
      status: "Active",
    },
    {
      title: "Loyalty Points Program",
      type: "POINTS",
      description: "Earn loyalty points on every purchase. 1 point per ₹100 spent.",
      value: "1",
      expiry: "8/1/2024",
      merchant: "Food Palace",
      category: "Gold",
      status: "Active",
    },
    // duplicates to fill grid
    {
      title: "Weekend Sale Discount",
      type: "DISCOUNT",
      description:
        "Get instant discount on all purchases during weekends. Valid for all card types.",
      value: "10%",
      expiry: "12/31/2024",
      merchant: "ABC Electronics",
      category: "Gold",
      status: "Active",
    },
    {
      title: "Premium Card Cashback",
      type: "CASHBACK",
      description:
        "Earn cashback on premium card transactions. Minimum transaction amount ₹1000.",
      value: "5%",
      expiry: "6/15/2024",
      merchant: "Fashion Hub",
      category: "Gold",
      status: "Active",
    },
    {
      title: "Loyalty Points Program",
      type: "POINTS",
      description: "Earn loyalty points on every purchase. 1 point per ₹100 spent.",
      value: "1",
      expiry: "8/1/2024",
      merchant: "Food Palace",
      category: "Gold",
      status: "Active",
    },
  ];

  return (
    <div className=" min-h-screen p-5">
      <div className="max-w-[1250px] mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="head mb-2">Approver Management</h1>
            <p className="text-sm text-gray-500">
              Manage campaign approvals with accuracy and transparency
            </p>
          </div>

        
        </header>

        {/* Top stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Request</p>
              <span className="text-[14px] font-medium text-gray-800">6</span>
            </div>
            <Calendar size={18} className="text-gray-400" />
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500">Approved</p>
              <span className="text-[14px] font-medium text-gray-800">3</span>
            </div>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Live
            </span>
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500">Pending</p>
              <span className="text-[14px] font-medium text-gray-800">1</span>
            </div>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              Review
            </span>
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500">Rejected</p>
              <span className="text-[14px] font-medium text-gray-800">1</span>
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
              Blocked
            </span>
          </div>
        </section>

       {/* Search & Filter Section — Final Refined Version */}
<div className="bg-[#FEFFFF] border border-[#F2F3F5] rounded-lg shadow-[0px_4px_8px_0px_#00000006] p-2 mb-6 flex items-center justify-between">
  {/* Left side: Search + Filters */}
  <div className="flex items-center gap-2">
    {/* Search box (fixed width) */}
    <div className="relative w-[180px]">
      <Search
        size={12}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
      />
      <input
        type="text"
        placeholder="Search..."
        className="pl-8 pr-3 py-[6px] w-full rounded-md text-xs font-normal text-[#64748B] border border-[#E5E7EB] bg-[#F9FAFB]
                   focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        style={{
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0%",
          lineHeight: "100%",
        }}
      />
    </div>

    {/* Type Filter */}
    <button className="flex items-center gap-1.5 px-3 py-[6px] rounded-md text-xs font-medium text-[#8B5563] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6]">
      <Filter size={12} className="text-[#8B5563]" />
      <span>Type</span>
    </button>

    {/* Date Range */}
    <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">
      Date Range
    </button>

    {/* Merchant */}
    <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">
      Merchant
    </button>
  </div>

  {/* Right side: Campaign count */}
  <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">
    2 of 2 campaigns
  </span>
</div>


        {/* cards grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <ApproverCard key={idx} item={it} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default Approver;
