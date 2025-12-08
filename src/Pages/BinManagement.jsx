import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Calendar, CreditCard, Check } from "lucide-react";
import api from "../utils/api"; 
import Pagination from "../Components/Pagination";

const BinManagement = () => {
  const [bins, setBins] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6; 

  // Form State
  const [segmentName, setSegmentName] = useState("");
  const [description, setDescription] = useState("");
  const [binRanges, setBinRanges] = useState([{ id: Date.now(), fromBin: "", toBin: "" }]);
  const [tokens, setTokens] = useState([]); 
  const [tokenInput, setTokenInput] = useState("");
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const storedUid = Number(localStorage.getItem("uid")); 

  useEffect(() => {
    fetchSegments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // --- 🔄 REUSABLE FETCH FUNCTION ---
  const fetchSegments = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      
      const res = await api.get("/dmsapi/segments", {
        params: { 
            skip, 
            limit: itemsPerPage, 
            sort: "id",       
            direction: "desc" 
        }
      });
      
      setTotalItems(res.data?.total || 0);
      const rawList = res.data?.rows || res.data?.data || (Array.isArray(res.data) ? res.data : []);

      const transformed = rawList.map((s) => ({
        id: s.id, 
        segmentName: s.segment_name,
        description: s.description || "",
        binRanges: (s.bin_ranges || []).map((br, i) => ({
          id: br.id || i + 1, 
          fromBin: br.start_bin, 
          toBin: br.end_bin, 
        })),
        tokens: (s.apple_tokens || []).map((t) => ({ 
          value: t.token_value, 
          checked: t.is_active 
        })),
        status: s.is_active ? "Active" : "Inactive",
      }));

      setBins(transformed);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Handler ---
  // The complex logic (getPageNumbers) is removed because the component handles it.
  // We just need to update state when the component tells us to change page.
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- Handlers ---
  const resetForm = () => {
    setSegmentName("");
    setDescription("");
    setBinRanges([{ id: Date.now(), fromBin: "", toBin: "" }]);
    setTokens([]);
    setTokenInput("");
    setEditingId(null);
    setIsFormVisible(false);
  };

  const openNew = () => { resetForm(); setIsFormVisible(true); };

  const openEdit = (segment) => {
    setSegmentName(segment.segmentName || "");
    setDescription(segment.description || "");
    setBinRanges(
      (segment.binRanges || []).map((r, i) => ({ id: r.id || i + 1, fromBin: r.fromBin, toBin: r.toBin }))
    );
    setTokens((segment.tokens || []).map((t) => ({ value: t.value, checked: !!t.checked })));
    setTokenInput("");
    setEditingId(segment.id);
    setIsFormVisible(true);
  };

  const handleAddBinRange = () => { setBinRanges([...binRanges, { id: Date.now(), fromBin: "", toBin: "" }]); };
  const handleRemoveBinRange = (id) => setBinRanges(binRanges.filter((b) => b.id !== id));
  const handleChangeBin = (e, id, type) => setBinRanges(binRanges.map((bin) => (bin.id === id ? { ...bin, [type]: e.target.value } : bin)));

  const handleAddTokens = () => {
    if (!tokenInput.trim()) return;
    const raw = tokenInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    setTokens((prev) => {
      const existing = prev.map((p) => p.value);
      const additions = [];
      raw.forEach((val) => { if (!existing.includes(val)) additions.push({ value: val, checked: true }); });
      return [...prev, ...additions];
    });
    setTokenInput("");
  };
  const handleTokenKeyDown = (e) => { if (e.key === "Enter" || (e.key === "," && tokenInput.trim())) { e.preventDefault(); handleAddTokens(); } };
  const toggleTokenChecked = (value) => { setTokens((prev) => prev.filter((t) => t.value !== value)); };

  // --- 🔄 SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!segmentName.trim()) return alert("Segment Name is required.");
    const validRanges = binRanges.filter((r) => r.fromBin.trim() && r.toBin.trim());
    if (!validRanges.length) return alert("Add at least one BIN range.");
    
    // Validation Logic
    const sixDigitRegex = /^\d{6}$/;
    for (let i = 0; i < validRanges.length; i++) {
        const row = validRanges[i];
        if (!sixDigitRegex.test(row.fromBin) || !sixDigitRegex.test(row.toBin)) {
            return alert(`Row ${i + 1}: Start and End BINs must be exactly 6-digit numbers.`);
        }
        if (parseInt(row.fromBin, 10) > parseInt(row.toBin, 10)) {
            return alert(`Row ${i + 1}: Start BIN must be less than or equal to End BIN.`);
        }
    }
    const sortedRanges = [...validRanges].sort((a, b) => parseInt(a.fromBin) - parseInt(b.fromBin));
    for (let i = 0; i < sortedRanges.length - 1; i++) {
        if (parseInt(sortedRanges[i].toBin) >= parseInt(sortedRanges[i + 1].fromBin)) {
            return alert(`Input Error: Ranges overlap (${sortedRanges[i].fromBin}-${sortedRanges[i].toBin} and ${sortedRanges[i + 1].fromBin}-${sortedRanges[i + 1].toBin}).`);
        }
    }
    if (tokens.some(t => !t.value.trim())) {
        return alert("Invalid Token: Cannot contain empty values.");
    }

    const finalBankId = storedUid > 0 ? storedUid : 1;

    const payload = {
      bank_id: finalBankId, 
      segment_name: segmentName,
      description: description,
      is_active: true,
      bin_ranges: validRanges.map((r) => ({ start_bin: r.fromBin, end_bin: r.toBin, is_active: true })),
      apple_tokens: tokens.map((t) => ({ token_value: t.value, is_active: !!t.checked })),
    };

    try {
      setLoading(true);
      if (editingId == null) {
        await api.post("/dmsapi/segments", payload);
        alert("Segment Created Successfully!");
        if (currentPage !== 1) setCurrentPage(1); 
        else fetchSegments(); 
      } else {
        await api.put(`/dmsapi/segments/${editingId}`, payload);
        alert("Segment Updated Successfully!");
        fetchSegments(); 
      }
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      const responseData = err?.response?.data;
      if (responseData?.field && responseData?.message) {
         const cleanField = responseData.field.includes("bin_ranges") ? "BIN Range" : responseData.field.includes("apple_tokens") ? "Token" : responseData.field;
         alert(`Error in ${cleanField}: ${responseData.message}`);
      } else {
         const msg = responseData?.message || "Failed to save segment.";
         alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBin = async (id) => {
    if (!window.confirm("Delete this segment permanently?")) return;
    try {
      setLoading(true);
      await api.delete(`/dmsapi/segments/${id}`);
      if (bins.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1); 
      else fetchSegments(); 
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete segment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] pl-5 pr-5 pt-5">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="head">{editingId ? "Edit Segment" : "Create New Segment"}</h1>
            <p className="para mt-3">Manage card BIN ranges, eligibility, and restrictions</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 btn-primary-violet">
            <Plus className="w-4 h-4" /> New Segment
          </button>
        </div>

        {/* Form View */}
        {isFormVisible && (
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="bg-white p-0 rounded-lg shadow-md space-y-0 mt-4 border border-[#E2E8F0]">
              <div className="p-6">
                <h1 className="inside-head mb-4">BIN Configuration</h1>
                <div className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-md p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name <span className="text-red-500">*</span></label>
                    <input type="text" value={segmentName} onChange={(e) => setSegmentName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7B3FE4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  </div>
                </div>

                <div className="mt-4 bg-[#F7F9FB] border border-[#E2E8F0] rounded-md p-4 space-y-6">
                  <div className="bg-white p-6 rounded-md border border-[#FFFFFF] overflow-y-auto" style={{ maxHeight: 280 }}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="card-inside-head">BIN Ranges</h2>
                      <button type="button" onClick={handleAddBinRange} className="btn-primary-violet flex items-center"><Plus className="w-4 h-4 mr-2" /><span className="text-sm">Add</span></button>
                    </div>
                    {binRanges.map((bin, index) => (
                      <div key={bin.id} className="flex items-center space-x-6 mb-6 border-b border-gray-200 pb-4">
                        <span className="bg-[#7747EE] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">{index + 1}</span>
                        <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-2">From BIN</label><input type="text" value={bin.fromBin} onChange={(e) => handleChangeBin(e, bin.id, "fromBin")} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none" /></div>
                        <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-2">To BIN</label><input type="text" value={bin.toBin} onChange={(e) => handleChangeBin(e, bin.id, "toBin")} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none" /></div>
                        <button type="button" onClick={() => handleRemoveBinRange(bin.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-[#F7F9FB] border border-[#E2E8F0] rounded-md p-4 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    <div className="p-3">
                      <label className="block text-sm text-gray-700 mb-2">Apple Tokens</label>
                      <textarea value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} onKeyDown={handleTokenKeyDown} className="w-full h-28 resize-none border border-[#B0B2F7] rounded p-2 text-sm focus:outline-none" />
                      <button type="button" onClick={handleAddTokens} className="mt-3 px-8 h-9 bg-[#7747EE] text-white rounded-full text-sm">ADD</button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-md p-4 min-h-[160px]">
                      <div className="max-h-[120px] overflow-auto">
                        <ul className="space-y-2">
                          {tokens.map((t) => (
                            <li key={t.value} className="flex items-center justify-between"><label className="relative flex items-center gap-3 py-1 cursor-pointer select-none text-sm"><input type="checkbox" checked={t.checked} onChange={() => toggleTokenChecked(t.value)} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 w-4 h-4" /><span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${t.checked ? "border-[#7747EE]" : "border-gray-300 bg-white"}`}><svg className={`${t.checked ? "opacity-100" : "opacity-0"} w-3 h-3 text-[#7747EE] transition-opacity`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></span><span className="text-xs text-gray-700 pl-1">{t.value}</span></label></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white rounded-b-lg flex items-center justify-between">
                <div><button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6F57F2] text-white text-sm"><Check className="w-4 h-4" /> <span className="text-sm">Active</span></button></div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md bg-[#F8F9FC] text-[#000000] border border-[#E2E8F0]">Cancel</button>
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-[#6F57F2] text-white flex items-center gap-2"><span>{editingId ? "Update" : "Save"}</span></button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard */}
        {!isFormVisible && (
          <div className="flex flex-col flex-1 relative">
            
            {/* 1. Statistics Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
                <div><p className="card-head">Total BIN</p><span className="card-para">{totalItems}</span></div>
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
                <div><p className="card-head">Active</p><span className="card-para">{totalItems}</span></div>
                <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
                <div><p className="card-head">Pending</p><span className="card-para">0</span></div>
                <span className="text-xs font-bold bg-[#DCFCE7] text-[#5C6534] px-3 py-1 rounded-full">Review</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
                <div><p className="card-head">Suspended</p><span className="card-para">0</span></div>
                <span className="text-xs font-bold bg-[#F3F4F6] text-[#4B5563] px-3 py-1 rounded-full">Blocked</span>
              </div>
            </section>

            {/* 2. Segments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
              {bins.map((b) => (
                <div key={b.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative">
                  <div className="flex items-start justify-between">
                    <div><div className="card-inside-head">{b.segmentName}</div></div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === "Active" ? "bg-[#DCFCE7] text-[#1D6A3A]" : "bg-gray-200 text-gray-700"}`}>{b.status}</span>
                    </div>
                  </div>
                
                {/* BIN Ranges */}
                <div className="mt-4 text-sm text-gray-600">
                  <div className="card-inside-head mb-3" style={{ fontSize: "14px" }}>
                    BIN Ranges
                  </div>

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

                {/* Apple Tokens */}
                {b.tokens && b.tokens.length > 0 && (
                  <div className="mt-3">
                    <div className="card-inside-head mb-2" style={{ fontSize: "14px" }}>Apple Tokens</div>
                    <div className="flex flex-wrap gap-2">
                      {b.tokens.map((t, idx) => (
                        <div key={idx} className="text-xs bg-[#F3F4F6] px-2 py-1 rounded-full border border-gray-200 text-gray-700">
                          {t.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  <div className="border-t border-gray-300 mt-4"></div>
                  <div className="flex justify-end gap-3 mt-3">
                    <button onClick={() => openEdit(b)} className="p-1 rounded-md hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-600" /></button>
                    <button onClick={() => handleDeleteBin(b.id)} className="p-1 rounded-md hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Pagination Component */}
            <Pagination 
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage} 
                onPageChange={handlePageChange}
                
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BinManagement;