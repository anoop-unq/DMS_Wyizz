import React, { useState, useEffect } from "react";
import {
  Plus,
  Percent,
  Search as LucideSearch,
  Calendar,
  Box,
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
  X,
  Pause, 
  Play,  
} from "lucide-react";

import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { campaignDiscountApi } from "../utils/metadataApi";
import CampaignForm from "./CampaignForm";
import Pagination from "../Components/Pagination";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";

// ✅ CampaignCard Component
function CampaignCard({ c, onEdit, onDelete, onView, onPause, onResume, userType }) {
  const used = c.budgetUsed || 0;
  const total = c.totalBudget || 1;
  const percentUsed = Math.round(Math.min(100, (used / total) * 100));

  const isDiscountChecker = userType === "discountchecker";
  const isDiscountMaker = userType === "discountmaker";
  
  // ✅ Check if user is allowed to Pause/Resume (Maker, Bank, Admin)
  const canPauseResume = ["discountmaker", "bank", "admin"].includes(userType);

  const rawStatus = (c.rawStatus || "").toLowerCase();

  // ✅ EDIT BUTTON VISIBILITY LOGIC
  // Logic: Show Edit ONLY if Draft or Rejected. 
  // Hidden for: Approved, Paused, Submitted, etc.
  let showEditButton = true;
  if (isDiscountMaker) {
    if (!["draft", "rejected"].includes(rawStatus)) {
      showEditButton = false;
    }
  }

  // ✅ Status Color Logic
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "active") return "bg-green-100 text-green-800"; // Display 'Active' for Draft sometimes
    if (s === "approved") return "bg-green-100 text-green-800";
    if (s === "paused") return "bg-orange-100 text-orange-700";
    if (s === "inactive") return "bg-gray-100 text-gray-600";
    if (s === "submitted") return "bg-blue-100 text-blue-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_6px_18px_rgba(13,38,59,0.04)] w-full ">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-100 bg-green-50 text-green-700">
            <Percent size={15} />
          </div>
          <div>
            <h3 className="campaign-inside-head text-[15px] leading-tight">
              {c.title}
            </h3>
            <div className="text-[10px] tracking-wide text-gray-700 mt-[2px]">
              {c.type?.charAt(0).toUpperCase() + c.type?.slice(1).toLowerCase()}
            </div>
          </div>
        </div>
        <div>
          <span
            className={`inline-block px-5 py-[3px] text-[11px] font-medium rounded-full ${getStatusColor(
              c.status
            )}`}
          >
            {c.status}
          </span>
        </div>
      </div>

      <p
        className="mt-3 card-inside-para text-[#7C3F44] truncate"
        style={{ lineHeight: "1.4", fontSize: "12px" }}
      >
        {c.description || "No description provided."}
      </p>

      {/* Middle Details Section */}
      <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-[#7C3F44]">
        {/* Left Column */}
        <div className="space-y-2">
       
            <div className="flex items-center gap-2">
              <img
                src={assets.TargetValue}
                className="w-3.5 h-3.5 object-contain"
                alt="Target Value"
              />
              <div>
                Value:{" "}
                <span className="font-medium text-[#7C3F44]">{c.value}</span>
              </div>
            </div>
     

          <div className="flex items-center gap-2">
            <img
              src={assets.Shop}
              className="w-3.5 h-3.5 object-contain"
              alt="Shop"
            />
            <div className="font-medium">{c.meta.merchant}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <img
              src={assets.sideCalendar}
              className="w-3.5 h-3.5 object-contain"
              alt="Calendar"
            />
            <div className="font-medium">{c.meta.ends}</div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {c.meta.card && (
              <>
                <img
                  src={assets.ColorCreditCard}
                  className="w-3.5 h-3.5 object-contain"
                  alt="card"
                />
                <div className="font-medium">
                  {c.meta.card && c.meta.card.length > 10
                    ? `${c.meta.card.substring(0, 15)}...`
                    : c.meta.card}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Budget Used Header */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-[#8B5563]">Budget Used</div>
        <div className="text-[13px] font-medium text-[#8B5563]">
          ${c.budgetUsed.toLocaleString()} / ${c.totalBudget.toLocaleString()}
        </div>
      </div>

      {/* Progress Bar & Footer */}
      <div className="mt-1">
        <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${
                c.totalBudget > 0 ? (c.budgetUsed / c.totalBudget) * 100 : 0
              }%`,
              background: "linear-gradient(90deg,#8b5cf6,#c084fc)",
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <div>
            {c.totalBudget > 0
              ? Math.round((c.budgetUsed / c.totalBudget) * 100)
              : 0}
            % Used
          </div>
          <div>
            {c.transactions.toLocaleString()} transaction
            {c.transactions <= 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
        {isDiscountChecker ? (
          <button
            onClick={() => onView(c.id)}
            className="w-[80px] h-[32px] rounded-[8px] bg-[#F0FDF4] text-[#16A34A] text-[12px] font-semibold flex items-center justify-center hover:bg-[#DCFCE7] transition-colors"
          >
            View
          </button>
        ) : (
          <>
            {/* View Button */}
            <button
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-[#7747EE] transition-colors"
              aria-label="view"
              onClick={() => onView(c.id)}
            >
              <Eye size={15} />
            </button>

            {/* Edit Button - Hidden if Approved/Paused */}
            {showEditButton && (
              <button
                className="p-1.5 rounded-md hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="edit"
                onClick={() => onEdit(c.id)}
              >
                <Edit size={15} />
              </button>
            )}

            {/* ✅ PAUSE BUTTON - Only if Approved */}
            {canPauseResume && rawStatus === "approved" && (
              <button
                className="p-1.5 rounded-md hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
                aria-label="pause"
                onClick={() => onPause(c.id)}
                title="Pause Campaign"
              >
                <Pause size={15} />
              </button>
            )}

            {/* ✅ RESUME BUTTON - Only if Paused */}
            {canPauseResume && rawStatus === "paused" && (
              <button
                className="p-1.5 rounded-md hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                aria-label="resume"
                onClick={() => onResume(c.id)}
                title="Resume Campaign"
              >
                <Play size={15} />
              </button>
            )}

            {/* Delete Button */}
            <button
              className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="delete"
              onClick={() => onDelete(c.id)}
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useAuthContext();

  console.log("Current userType from Context:", userType);

  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isStep1Completed, setIsStep1Completed] = useState(false);

  // Initialize currentPage from location state
  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const LOCAL_STORAGE_KEY = "campaignFormData";

  const isDiscountChecker = userType === "discountchecker";
  const showNewCampaignButton = !isDiscountChecker;


  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const res = await campaignDiscountApi.getAll({
        limit: itemsPerPage,
        skip: skip,
        sort: "id",
        direction: "desc",
      });
      
      // ✅ Correctly access response structure
      const responseData = res.data || {};
      const rows = responseData.rows || [];
      const total = responseData.total || 0; // Total count from API
      
      setTotalItems(total);

      // ✅ STATS LOGIC (Based on visible rows)
      let activeCount = 0;
      let rejectedCount = 0;
      let pendingCount = 0;

      rows.forEach((row) => {
        // Access nested campaign object safely
        const s = (row.campaign?.status_name || "").toLowerCase();

        if (s === "approved" || s === "active" || s === "resumed") {
          activeCount++;
        } else if (s === "rejected") {
          rejectedCount++;
        } else {
          // Covers: Draft, Submitted, Pending Delete, Paused
          pendingCount++; 
        }
      });

      setStats({ 
        total: total, // Use global total from API
        active: activeCount, 
        pending: pendingCount, 
        rejected: rejectedCount 
      });

      const mappedData = rows.map((item, index) => {
        const c = item.campaign || {};
        // ✅ Handle null discount safely
        const d = item.discount || {}; 

        let realValue = "";
        // Check if discount_amounts exists before accessing length
        if (d.discount_amounts && d.discount_amounts.length > 0) {
          const amt = d.discount_amounts[0];
          if (amt.is_percentage) {
            realValue = `${amt.discount_percentage}%`;
          } else {
            realValue = `${amt.discount_amount}`;
          }
        }

        let realCardInfo = "";
        if (d.discount_card_types && d.discount_card_types.length > 0) {
          realCardInfo = d.discount_card_types
            .map((t) => t.card_type_name)
            .join(", ");
        } else if (
          d.discount_card_networks &&
          d.discount_card_networks.length > 0
        ) {
          realCardInfo = d.discount_card_networks
            .map((n) => n.card_network_name)
            .join(", ");
        }

        let displayStatus =
          c.status_name || (c.status === 1 ? "Active" : "Inactive");

        if (displayStatus.toLowerCase() === "draft") {
          displayStatus = "Active"; 
        } else if (displayStatus.toLowerCase() === "pending_delete") {
          displayStatus = "Inactive"; 
        }

        return {
          id: c.id || `temp-${index}`,
          title: c.name || "",
          type: (c.type || "").toUpperCase(),
          description: c.description || "",
          status: displayStatus, 
          rawStatus: c.status_name, 
          budgetDisplay: `${(c.budget_used || 0).toLocaleString()} / ${(
            c.total_budget || 0
          ).toLocaleString()}`,
          budgetUsed: c.budget_used || 0,
          totalBudget: c.total_budget || 1,
          transactions: c.transactions_count || 0,
          value: realValue,
          meta: {
            merchant: c.company_name || c.bank_name || "",
            card: realCardInfo,
            ends: c.end_date ? new Date(c.end_date).toLocaleDateString() : "",
          },
        };
      });
      setCampaigns(mappedData);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage]);



  const handleFormClose = (needsRefresh = false) => {
    if (needsRefresh) {
      if (!editingCampaign) localStorage.removeItem(LOCAL_STORAGE_KEY);
      setShowForm(false);
      setEditingCampaign(null);
      setIsStep1Completed(false);
      if (currentPage === 1) fetchCampaigns();
      else setCurrentPage(1);
      return;
    }
    if (isStep1Completed && !editingCampaign) {
      Swal.fire({
        title: "Unsaved Progress",
        text: "You have an incomplete campaign. Do you want to discard it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Close",
        cancelButtonText: "Keep Editing",
      }).then(async (result) => {
        if (result.isConfirmed) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setShowForm(false);
          setEditingCampaign(null);
          setIsStep1Completed(false);
          if (currentPage === 1) fetchCampaigns();
        }
      });
    } else {
      setShowForm(false);
      setEditingCampaign(null);
      setIsStep1Completed(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = async (id) => {
    setIsFetchingDetails(true);
    try {
      const res = await campaignDiscountApi.getById(id);
      setEditingCampaign(res.data);
      setIsStep1Completed(false);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch campaign details", err);
      alert("Could not load campaign details.");
    } finally {
      setIsFetchingDetails(false);
    }
  };

 const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await campaignDiscountApi.delete(id);
          Swal.fire("Deleted!", "Your campaign has been deleted.", "success");
          
          if (campaigns.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          } else {
            fetchCampaigns();
          }
        } catch (err) {
          console.error("Failed to delete campaign", err);

          // ✅ FIX: Extract the specific message from API response
          const errorMessage = err.response?.data?.detail || "Failed to delete campaign.";

          Swal.fire({
            icon: "error",
            title: "Cannot Delete",
            text: errorMessage, // This will show your specific API message
            confirmButtonColor: "#d33"
          });
        }
      }
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/view-campaign-details/${id}`, { 
      state: { page: currentPage } 
    });
  };

  // ✅ Handle Pause API (Softer Error UI)
  const handlePause = async (id) => {
    Swal.fire({
      title: "Pause Campaign?",
      text: "Are you sure you want to pause this campaign?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // Orange color
      confirmButtonText: "Yes, Pause it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await campaignDiscountApi.makerPause(id);
          Swal.fire("Paused!", "Campaign has been paused.", "success");
          fetchCampaigns(); 
        } catch (err) {
          console.error("Failed to pause", err);
          
          // Get the specific message
          const errorMessage = err.response?.data?.detail || "Action could not be completed.";
          
          // ✅ SOFTER UI: Use 'warning' icon and a neutral title
          Swal.fire({
            icon: "warning", // Yellow/Orange instead of Red
            title: "Unable to Pause", // Friendly title
            text: errorMessage, // "Campaign must be running..."
            confirmButtonColor: "#7747EE"
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // ✅ Handle Resume API (Softer Error UI)
  const handleResume = async (id) => {
    Swal.fire({
      title: "Resume Campaign?",
      text: "Are you sure you want to resume this campaign?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // Green color
      confirmButtonText: "Yes, Resume it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await campaignDiscountApi.makerResume(id);
          Swal.fire("Resumed!", "Campaign is now active.", "success");
          fetchCampaigns(); 
        } catch (err) {
          console.error("Failed to resume", err);

          // Get the specific message
          const errorMessage = err.response?.data?.detail || "Action could not be completed.";

          // ✅ SOFTER UI: Use 'warning' icon and a neutral title
          Swal.fire({
            icon: "warning", 
            title: "Unable to Resume", 
            text: errorMessage,
            confirmButtonColor: "#7747EE"
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] pl-5 pr-5 pt-5">
      {isFetchingDetails && (
        <div className=" fixed inset-0 bg-white/50 z-[60] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto space-y-6 w-full flex-1 flex flex-col overflow-y-scroll hide-scroll">
        <div className="flex items-start justify-between ">
          <div>
            <h1 className="head">Campaign Management</h1>
            <p className="para mt-3" style={{ fontSize: "12px" }}>
              Manage discount campaigns, loyalty programs, and promotional
              offers
            </p>
          </div>

          {showNewCampaignButton && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm ${
                showForm
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "btn-primary-violet"
              }`}
              onClick={() => {
                if (showForm) {
                  handleFormClose(false);
                } else {
                  setEditingCampaign(null);
                  setIsStep1Completed(false);
                  setShowForm(true);
                }
              }}
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Close" : "New Campaign"}
            </button>
          )}
        </div>

        <CampaignForm
          visible={showForm}
          initialData={editingCampaign}
          onRefresh={fetchCampaigns}
          onClose={() => handleFormClose(false)}
          onSuccess={() => handleFormClose(true)}
          onStep1Complete={() => setIsStep1Completed(true)}
        />

        {!showForm && (
          <div className="flex flex-col flex-1">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Stats Cards (Keep as is) */}
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Request</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.total}</span>
                </div>
                <Calendar size={18} className="text-gray-400" />
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Approved</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.active}</span>
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Pending</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.pending}</span>
                </div>
                <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Review</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Rejected</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.rejected}</span>
                </div>
                <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">Blocked</span>
              </div>
            </section>

            <div className="bg-[#FEFFFF] border border-[#F2F3F5] rounded-lg shadow-[0px_4px_8px_0px_#00000006] p-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-[180px]">
                  <LucideSearch
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-3 py-[6px] w-full rounded-md text-xs font-normal text-[#64748B] border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">
                {totalItems} campaigns
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <span className="text-gray-500 text-sm">
                  Loading campaigns...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {campaigns.length > 0 ? (
                  campaigns.map((c) => (
                    <CampaignCard
                      c={c}
                      key={c.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleViewDetails}
                      // ✅ Pass new handlers
                      onPause={handlePause}
                      onResume={handleResume}
                      userType={userType}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                    No campaigns found.
                  </div>
                )}
              </div>
            )}

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
}