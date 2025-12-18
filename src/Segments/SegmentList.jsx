import React from "react";
import { Edit, Trash2, Calendar, CreditCard } from "lucide-react";
import Pagination from "../Components/Pagination";
import Swal from "sweetalert2";
import api from "../utils/api";
import { assets } from "../assets/assets";

const SegmentList = ({ bins, totalItems, currentPage, itemsPerPage, onPageChange, onEdit, onRefresh, setLoading }) => {
  
  const handleDelete = async (id) => {
    // SweetAlert Confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to permanently delete this segment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete(`/dmsapi/segments/${id}`);
        Swal.fire('Deleted!', 'The segment has been deleted.', 'success');
        onRefresh(); // Trigger refresh in parent
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete segment.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 relative">
      {/* 1. Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-8">
        <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
          <div><p className="card-head">Total BIN</p><span className="card-para">{totalItems}</span></div>
          <Calendar size={20} className="text-gray-400" />
        </div>
        <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
          <div><p className="card-head">Active</p><span className="card-para">{totalItems}</span></div>
          <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Live</span>
        </div>
        {/* Placeholders for Pending/Suspended */}
        {/* <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
           <div><p className="card-head">Pending</p><span className="card-para">0</span></div>
           <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Review</span>
        </div>
        <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
           <div><p className="card-head">Suspended</p><span className="card-para">0</span></div>
           <span className="text-xs font-bold bg-[#F3F4F6] text-[#4B5563] px-3 py-1 rounded-full">Blocked</span>
        </div> */}
      </section>

      {/* 2. Segments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {bins.map((b) => (
          <div key={b.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative">
            <div className="flex items-start justify-between">
              <div><div className="card-inside-head">{b.segmentName}</div></div>
              <div className="flex flex-col items-end gap-2">
                <span className={` px-4 py-0.5 rounded-full font-medium text-[10px] ${b.status === "Active" ? "bg-[#DCFCE7] border border-[#BDF7D1] text-[#1D6A3A] " : "bg-gray-200 text-gray-700"}`}>{b.status}</span>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <div className="card-inside-head mb-3" style={{ fontSize: "14px" }}>BIN Ranges</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-2 overflow-y-scroll hide-scrollbar" style={{ maxHeight: "75px" }}>
                {b.binRanges.map((r, idx) => (
                  <div key={idx} className="flex items-center space-x-2 min-w-0">
                    <CreditCard className="w-4 h-4 text-[#8B5563]/60" />
                    <span className="card-inside-range text-sm whitespace-nowrap truncate" title={`${r.fromBin} - ${r.toBin}`}>
                      {`${r.fromBin} - ${r.toBin}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>


            {b.tokens && b.tokens.length > 0 && (
  <div className="mt-4 text-sm text-gray-600">
    <div className="card-inside-head mb-3" style={{ fontSize: "14px" }}>
      Apple Tokens
    </div>

    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-2 hide-scrollbar"
      style={{ maxHeight: "65px", overflowY: "auto" }}
    >
      {b.tokens.map((t, idx) => (
        <div key={idx} className="flex items-center space-x-2 min-w-0">
          <img src={assets.apple} className="w-4 h-4" alt="apple" />
          <span
            className="card-inside-range text-sm whitespace-nowrap truncate"
            title={t.value}
          >
            {t.value}
          </span>
        </div>
      ))}
    </div>
  </div>
)}


            <div className="border-t border-gray-300 mt-4"></div>
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={() => onEdit(b.id)} className="p-1 rounded-md hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-600" /></button>
              <button onClick={() => handleDelete(b.id)} className="p-1 rounded-md hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage} 
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SegmentList;