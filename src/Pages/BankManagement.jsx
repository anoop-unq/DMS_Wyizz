import React, { useState } from "react";
import { Plus, Trash2, Edit, Calendar, CreditCard } from "lucide-react";

const BankManagement = () => {
  const [bins, setBins] = useState([
    {
      id: 1,
      bankName: "HDFC Bank",
      bankCode: "HDFC001",
      binRanges: [
        { id: 1, fromBin: "410000", toBin: "429999" },
        { id: 2, fromBin: "424000", toBin: "425999" },
      ],
      status: "Active",
    },
    {
      id: 2,
      bankName: "HDFC Bank",
      bankCode: "HDFC001",
      binRanges: [{ id: 1, fromBin: "520000", toBin: "529999" }],
      status: "Active",
    },
    {
      id: 3,
      bankName: "HDFC Bank",
      bankCode: "HDFC001",
      binRanges: [{ id: 1, fromBin: "410000", toBin: "429999" }],
      status: "Active",
    },
  ]);

  // unified names
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [binRanges, setBinRanges] = useState([{ id: 1, fromBin: "420000", toBin: "429999" }]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openNew = () => {
    setBankName("");
    setBankCode("");
    setBinRanges([{ id: 1, fromBin: "", toBin: "" }]);
    setEditingId(null);
    setIsFormVisible(true);
  };

  const openEdit = (bin) => {
    setBankName(bin.bankName || "");
    setBankCode(bin.bankCode || "");
    // preserve the original ids to avoid key issues
    setBinRanges(bin.binRanges.map((r) => ({ id: r.id, fromBin: r.fromBin, toBin: r.toBin })));
    setEditingId(bin.id);
    setIsFormVisible(true);
  };

  const handleAddBinRange = () => {
    const nextId = binRanges.length ? Math.max(...binRanges.map((b) => b.id)) + 1 : 1;
    setBinRanges([...binRanges, { id: nextId, fromBin: "", toBin: "" }]);
  };

  const handleRemoveBinRange = (id) => {
    setBinRanges(binRanges.filter((b) => b.id !== id));
  };

  const handleChangeBin = (e, id, type) => {
    const newBinRanges = binRanges.map((bin) => (bin.id === id ? { ...bin, [type]: e.target.value } : bin));
    setBinRanges(newBinRanges);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bankName.trim()) {
      alert("Bank Name is required.");
      return;
    }
    if (!bankCode.trim()) {
      alert("Bank Code is required.");
      return;
    }
    const validRanges = binRanges.filter((r) => r.fromBin.trim() && r.toBin.trim());
    if (!validRanges.length) {
      alert("Add at least one BIN range with both From and To filled.");
      return;
    }

    if (editingId === null) {
      const newBin = {
        id: Date.now(),
        bankName,
        bankCode,
        binRanges: validRanges,
        status: "Active",
      };
      setBins([newBin, ...bins]);
    } else {
      setBins(bins.map((b) => (b.id === editingId ? { ...b, bankName, bankCode, binRanges: validRanges } : b)));
    }

    // reset form
    setBankName("");
    setBankCode("");
    setBinRanges([{ id: 1, fromBin: "", toBin: "" }]);
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setBankName("");
    setBankCode("");
    setBinRanges([{ id: 1, fromBin: "", toBin: "" }]);
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleDeleteBin = (id) => {
    if (!window.confirm("Delete this BIN configuration?")) return;
    setBins(bins.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="head">Bank Management</h1>
            <p className="para mt-3">Manage card BIN ranges, eligibility, and restrictions</p>
          </div>

          <button onClick={openNew} className="inline-flex items-center gap-2 btn-primary-violet">
            <Plus className="w-4 h-4" /> New Bank
          </button>
        </div>

       

        {/* Inline form */}
        {isFormVisible && (
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F7F9FB] p-6 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="HDFC"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Code *</label>
                <input
                  type="text"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  placeholder="e.g., HDFC001"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 mt-4">
              <h1 className="head mb-6">Bank Configuration</h1>

              <div className="bg-[#F7F9FB] p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="card-inside-head">BIN Ranges</h2>
                  <button type="button" onClick={handleAddBinRange} className="btn-primary-violet flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm">Add</span>
                  </button>
                </div>

                {binRanges.map((bin) => (
                  <div key={bin.id} className="flex items-center space-x-6 mb-6 border-b border-gray-300 pb-4">
                    <span className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">{bin.id}</span>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">From BIN</label>
                      <input
                        type="text"
                        value={bin.fromBin}
                        onChange={(e) => handleChangeBin(e, bin.id, "fromBin")}
                        placeholder="e.g., 420000"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">To BIN</label>
                      <input
                        type="text"
                        value={bin.toBin}
                        onChange={(e) => handleChangeBin(e, bin.id, "toBin")}
                        placeholder="e.g., 429999"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button type="button" onClick={() => handleRemoveBinRange(bin.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-md bg-[#F8F9FC] text-[#000000]">Cancel</button>
                <button type="submit" className="btn-primary-indigo text-white px-4 py-2 rounded-md">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* CARD GRID */}

         {/* summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="card-head">Total Bank</p>
              <span className="card-para">{bins.length}</span>
            </div>
            <Calendar size={20} className="text-gray-400" />
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="card-head">Active</p>
              <span className="card-para">{bins.filter((b) => b.status === "Active").length}</span>
            </div>
            <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Live</span>
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="card-head">Pending</p>
              <span className="card-para">0</span>
            </div>
            <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Review</span>
          </div>

          <div className="bg-white py-3 px-4 rounded-md shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200 flex justify-between items-center">
            <div>
              <p className="card-head">Suspended</p>
              <span className="card-para">0</span>
            </div>
            <span className="text-xs font-bold bg-[#F3F4F6] text-[#4B5563] px-3 py-1 rounded-full">Blocked</span>
          </div>
        </section>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bins.map((b) => (
            <div key={b.id} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="card-inside-head">{b.bankName}</div>
                  <div className="card-inside-para mt-2">{b.bankCode}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === "Active" ? "bg-[#DCFCE7] text-[#1D6A3A]" : "bg-gray-200 text-gray-700"}`}>
                    {b.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="card-inside-head mb-3" style={{ fontSize: "14px" }}>
                  BIN Ranges
                </div>

                <div className="flex flex-wrap gap-4 mt-2 lg:flex-nowrap lg:justify-between lg:gap-0">
                  {b.binRanges.map((r) => (
                    <div key={r.id} className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#8B5563]/60 lg:w-3.5 lg:h-3.5" />
                      <span className="card-inside-range">{`${r.fromBin} - ${r.toBin}`}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-300 mt-4"></div>

              <div className="flex justify-end gap-3 mt-3">
                <button title="Edit" onClick={() => openEdit(b)} className="p-1 rounded-md hover:bg-gray-100">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button title="Delete" onClick={() => handleDeleteBin(b.id)} className="p-1 rounded-md hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankManagement;
