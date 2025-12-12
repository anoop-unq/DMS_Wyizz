import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../utils/api"; 
import SegmentForm from "./SegmentForm";
import SegmentList from "./SegmentList";

const BinManagement = () => {
  const [bins, setBins] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6; 

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const storedUid = Number(localStorage.getItem("uid")); 

  useEffect(() => {
    fetchSegments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const res = await api.get("/dmsapi/segments", {
        params: { skip, limit: itemsPerPage, sort: "id", direction: "desc" }
      });
      
      setTotalItems(res.data?.total || 0);
      const rawList = res.data?.rows || res.data?.data || (Array.isArray(res.data) ? res.data : []);

      const transformed = rawList.map((s) => ({
        id: s.id, 
        segmentName: s.segment_name,
        description: s.description || "",
        binRanges: (s.bin_ranges || []).map((br, i) => ({
          id: br.id || i + 1, fromBin: br.start_bin, toBin: br.end_bin, 
        })),
        tokens: (s.apple_tokens || []).map((t) => ({ 
          value: t.token_value, checked: true 
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

  const handleOpenNew = () => {
    setEditingId(null);
    setIsFormVisible(true);
  };

  const handleOpenEdit = (id) => {
    setEditingId(id);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingId(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    if (currentPage === 1) fetchSegments();
    else setCurrentPage(1);
  };

  const handleRefreshDelete = () => {
    if (bins.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
    else fetchSegments();
  };

  // --- Dynamic Header Text Logic ---
  const getHeaderText = () => {
    if (!isFormVisible) return "Segment Management";
    return editingId ? "Edit Segment" : "Create Segment";
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] pl-5 pr-5 pt-5">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col overflow-y-scroll hide-scroll">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="head">{getHeaderText()}</h1>
            <p className="para mt-3">Manage card BIN ranges, eligibility, and restrictions</p>
          </div>
          {/* Hide 'New Segment' button if form is already visible */}
          {!isFormVisible && (
            <button onClick={handleOpenNew} className="inline-flex items-center gap-2 btn-primary-violet">
              <Plus className="w-4 h-4" /> New Segment
            </button>
          )}
        </div>

        {isFormVisible ? (
          <SegmentForm 
            editingId={editingId}
            storedUid={storedUid}
            onCancel={handleCloseForm}
            onSuccess={handleSuccess}
          />
        ) : (
          <SegmentList 
            bins={bins}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onEdit={handleOpenEdit}
            onRefresh={handleRefreshDelete}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default BinManagement;