import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  FileText,
  ArrowRight,
  Globe,
  Calendar,
  Clock,
  CreditCard,
  Hash,
  Wallet,
  Percent,
  Download,
  Coins,
  Building2,
  Store,
  Users,
  Repeat,
  TerminalSquare,
  Layers,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Trash
} from "lucide-react";
// ✅ Import discountCheckerApi
import { campaignDiscountApi, discountCheckerApi } from "../utils/metadataApi";
import { assets } from "../assets/assets";
import Swal from "sweetalert2";

// --- UI HELPERS ---

const Card = ({ title, icon: Icon, children, className = "", action }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full ${className}`}
  >
    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-xl shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-[#F3F0FF] rounded-lg text-[#7747EE]">
          {Icon && <Icon size={18} />}
        </div>
        <h3 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-4 flex-1 flex flex-col gap-5 min-h-0">{children}</div>
  </div>
);

const DetailRow = ({ label, value, icon: Icon, className = "" }) => (
  <div
    className={`flex justify-between items-center text-[13px]  ${className}`}
  >
    <div className="flex items-center gap-2 text-gray-500 font-medium">
      {Icon && <Icon size={15} className="text-gray-400" />}
      <span>{label}</span>
    </div>
    <span
      className={`text-right font-bold break-words pl-4 ${
        !value || value === "-" ? "text-gray-400 font-normal" : "text-gray-900"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

const ListBadge = ({ items, emptyText = "-" }) => {
  if (!items || items.length === 0)
    return <span className="text-gray-400 italic text-xs">{emptyText}</span>;
  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] font-medium rounded shadow-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const ScrollableList = ({
  items,
  renderItem,
  emptyText = "None configured",
  maxHeight = "max-h-35",
}) =>
  items && items.length > 0 ? (
    <div
      className={`${maxHeight} overflow-y-auto pr-2 hide-scroll space-y-2`}
    >
      {items.map((item, idx) => renderItem(item, idx))}
    </div>
  ) : (
    <div className="text-right text-xs text-gray-400 italic">{emptyText}</div>
  );

// --- MAIN PAGE ---

const ViewCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  
  // ✅ State for Approval Logic
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("usertype") || "";
    setUserType(role.toLowerCase());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await campaignDiscountApi.getById(id);
        setData(res.data || res);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load campaign", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validateRemarks = () => {
    if (!remarks || remarks.trim().length < 11) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter comments with at least 10 characters.",
        confirmButtonColor: "#7747EE",
      });
      return false;
    }
    return true;
  };




  // ✅ NEW: Handle Delete Approval (Confirm Deletion)
  const handleDeleteApprove = async () => {
    // 1. Validation
    if (!remarks || remarks.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter remarks with at least 10 characters to confirm deletion.",
        confirmButtonColor: "#7747EE",
      });
      return;
    }

    // 2. API Call
    try {
      setIsSubmitting(true);
      await discountCheckerApi.approveDelete(id, remarks);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Campaign deletion has been approved.",
        confirmButtonColor: "#7747EE",
      }).then(() => {
        navigate("/campaign");
      });
    } catch (error) {
      console.error("Delete Approval failed", error);
      Swal.fire("Error", "Failed to approve deletion.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ NEW: Handle Delete Rejection (Restore Campaign)
  const handleDeleteReject = async () => {
    // 1. Validation
    if (!remarks || remarks.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter remarks with at least 10 characters to reject deletion.",
        confirmButtonColor: "#7747EE",
      });
      return;
    }

    // 2. API Call
    try {
      setIsSubmitting(true);
      await discountCheckerApi.rejectDelete(id, remarks);

      Swal.fire({
        icon: "info",
        title: "Restored",
        text: "Deletion rejected. Campaign has been restored to previous state.",
        confirmButtonColor: "#7747EE",
      }).then(() => {
        navigate("/campaign");
      });
    } catch (error) {
      console.error("Delete Rejection failed", error);
      Swal.fire("Error", "Failed to reject deletion.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ HANDLE APPROVE
  const handleApprove = async () => {
    if (!validateRemarks()) return;

    try {
      setIsSubmitting(true);
      await discountCheckerApi.approve(id, remarks);

      Swal.fire({
        icon: "success",
        title: "Approved",
        text: "Campaign has been successfully approved.",
        confirmButtonColor: "#7747EE",
      }).then(() => {
        navigate("/campaign"); 
      });
    } catch (error) {
      console.error("Approval failed", error);
      Swal.fire("Error", "Failed to approve campaign. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ HANDLE REJECT
  const handleReject = async () => {
    if (!validateRemarks()) return;

    try {
      setIsSubmitting(true);
      await discountCheckerApi.reject(id, remarks);

      Swal.fire({
        icon: "info",
        title: "Rejected",
        text: "Campaign has been rejected and sent back for corrections.",
        confirmButtonColor: "#7747EE",
      }).then(() => {
        navigate("/campaign"); 
      });
    } catch (error) {
      console.error("Rejection failed", error);
      Swal.fire("Error", "Failed to reject campaign. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7747EE]" />
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center text-gray-500">
        Campaign data unavailable.
      </div>
    );

  // -------------------------------------------------------------------------
  // ✅ FIX: Safe Destructuring with Fallbacks
  // -------------------------------------------------------------------------
  const { campaign } = data;
  // If data.discount is null, default to empty object to prevent crashes
  const discount = data.discount || {}; 

  // --- DATA TRANSFORMATION ---
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "-");

  // Safe Array Access: Use (array || []) pattern
  const sponsors = discount.discount_sponsors || [];
  
  const bankShare = sponsors.find((s) => s.name === "Bank")?.fund_percentage || 0;
  const merchShare = sponsors.find((s) => s.name === "Merchant")?.fund_percentage || 0;
  const extraShares = sponsors.filter(
      (s) => s.name !== "Bank" && s.name !== "Merchant"
    ) || [];

  const segments = discount.discount_segments || [];
  // Use Optional Chaining (?.) inside flatMap or map is risky if the parent array is undefined
  // So we default segments to [] above.
  const allBins = segments.flatMap((s) => s.discount_bins || []);
  const allTokens = segments.flatMap((s) => s.discount_apple_tokens || []);

  const cardNetworks = (discount.discount_card_networks || []).map((n) => n.card_network_name);
  const cardTypes = (discount.discount_card_types || []).map((t) => t.card_type_name);

  const mccs = (discount.discount_mccs || []).map((mcc) => mcc.mcc_code);
  const timeRules = discount.discount_dates || [];
  const supportedCurrencies = campaign.currencies || [];

  const merchantScopes = discount.discount_mids || [];
  const discountAmounts = discount.discount_amounts || [];
  const discountDocs = discount.discount_docs || [];
  // -------------------------------------------------------------------------

  // ✅ LOGIC FOR CHECKER VIEW
  const isChecker = userType === "discountchecker";
  const statusName = campaign?.status_name || "";
  const isSubmitted = statusName.toLowerCase() === "submitted";
  const isDraft = statusName.toLowerCase() === "draft";
  const isApproved = statusName.toLowerCase() === "approved";
  const isRejected = statusName.toLowerCase() === "rejected";

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-0 font-sans text-[14px]">
      {/* --- HEADER --- */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-gray-500 hover:text-[#7747EE] transition-colors text-[11px] font-bold uppercase tracking-wider"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F9FB] border border-[#E2E8F0]  transition-all">
                <ArrowLeft
                  size={16}
                  className="text-gray-500"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-[1400px] mx-auto p-4 space-y-6">
        {/* --- ROW 1: DETAILS & FUNDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* CAMPAIGN DETAILS */}

          <Card title="Campaign Details" icon={FileText}>
            {(() => {
              // --- Helper: Description Logic ---
              const processDesc = (text) => {
                if (!text) return null;
                const cap = text.charAt(0).toUpperCase() + text.slice(1);
                return cap.length > 250 ? cap.substring(0, 250) + "..." : cap;
              };

              // --- Helper: Status Color Logic ---
              const getStatusStyle = (status) => {
                const s = status ? status.toLowerCase() : "";
                if (s === "active")
                  return "bg-emerald-100 text-emerald-700 border-emerald-200";
                if (s === "draft")
                  return "bg-slate-100 text-slate-600 border-slate-200";
                if (s === "expired")
                  return "bg-red-50 text-red-700 border-red-100";
                return "bg-blue-50 text-blue-700 border-blue-100";
              };

              return (
                <div className="flex flex-col gap-3">
                  {/* --- HEADER: Name & Status --- */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-slate-800 capitalize truncate leading-tight">
                      {campaign?.name || "Untitled"}
                    </h3>

                    {campaign?.status_name && (
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border capitalize tracking-wide ${getStatusStyle(
                          campaign.status_name
                        )}`}
                      >
                        {campaign.status_name}
                      </span>
                    )}
                  </div>

                  {/* --- GRID: Type (Violet), Start (Teal), End (Orange) --- */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* 1. TYPE (Violet - Label Removed, Value Only) */}
                    <div className="flex items-center justify-center p-2 rounded border border-violet-100 bg-violet-50 text-violet-700">
                      <span className="text-xs font-bold capitalize truncate">
                        {campaign?.type}
                      </span>
                    </div>

                    {/* 2. START DATE (Teal/Green) */}
                    <div className="flex flex-col items-center justify-center p-1.5 rounded border border-teal-100 bg-teal-50">
                      <span className="text-[9px] font-bold text-teal-500 uppercase tracking-wider mb-0.5">
                        Start
                      </span>
                      <span className="text-[11px] font-bold text-teal-800 truncate">
                        {campaign?.start_date
                          ? formatDate(campaign.start_date)
                          : "-"}
                      </span>
                    </div>

                    {/* 3. END DATE (Orange/Red) */}
                    <div className="flex flex-col items-center justify-center p-1.5 rounded border border-orange-100 bg-orange-50">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">
                        End
                      </span>
                      <span className="text-[11px] font-bold text-orange-800 truncate">
                        {campaign?.end_date
                          ? formatDate(campaign.end_date)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  {/* --- DESCRIPTION --- */}
                  <div className="p-2.5 rounded border border-dashed border-slate-200 bg-white">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                      {processDesc(campaign?.description) || (
                        <span className="italic text-slate-300">
                          No description provided.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* FUND SETUP */}
          <Card title="Fund Setup" icon={Wallet}>
            {/* Budget Header */}
            <div
              className={`grid gap-4 mb-2 ${
                supportedCurrencies.length > 0
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {/* Total Budget Card */}
              <div className="flex justify-between items-center p-4 bg-[#F8F9FC] rounded-xl border border-gray-100 h-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F3F0FF] rounded-lg text-[#7747EE]">
                    <Coins size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-700 block">
                      Total Budget
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-[#7747EE]">
                  {Number(campaign.total_budget).toLocaleString()}{" "}
                  <span className="text-sm font-semibold text-green-400">
                    {campaign.base_currency_code}
                  </span>
                </span>
              </div>

              {/* Convertible Currencies Card */}
              {supportedCurrencies.length > 0 && (
                <div className="flex flex-col justify-center p-4 bg-[#F8F9FC] rounded-xl border border-gray-100 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Repeat size={14} className="text-gray-400" />
                    <p className="text-[11px] font-bold text-gray-500 uppercase">
                      Convertible Currencies
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supportedCurrencies.map((c) => (
                      <div
                        key={c.currency_id}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-md shadow-sm"
                      >
                        <span className="text-xs font-bold text-gray-700">
                          {c.currency_code}
                        </span>
                        <span className="text-[10px] text-gray-400 border-l pl-1.5 ml-0.5">
                          {c.currency_symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sponsors Grid */}
            <div
              className={`grid gap-4 ${
                extraShares.length > 0
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {/* Primary Sponsors */}
              <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm h-full">
                <p className="text-[11px] font-bold text-gray-400 uppercase mb-3">
                  Primary Sponsors
                </p>
                <div className="space-y-2">
                  <DetailRow
                    label="Bank Share"
                    value={`${bankShare}%`}
                    icon={Building2}
                  />
                  <div className="border-t border-gray-100"></div>
                  <DetailRow
                    label="Merchant Share"
                    value={`${merchShare}%`}
                    icon={Store}
                  />
                </div>
              </div>

              {/* Third Party Sponsors */}
              {extraShares.length > 0 && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 h-full">
                  <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
                    Third-Party Sponsors
                  </p>
                  <div
                    className="space-y-1 overflow-y-auto pr-1 hide-scroll"
                    style={{ maxHeight: "80px" }}
                  >
                    {extraShares.map((s, i) => (
                      <DetailRow
                        key={i}
                        label={s.name}
                        value={`${s.fund_percentage}%`}
                        icon={Users}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* --- ROW 2: RESTRICTIONS & BIN --- */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* RESTRICTIONS */}
          <Card title="Restrictions & Scope" icon={Globe}>
            <div className="space-y-4">
              <DetailRow
                label="Merchant Scope"
                value={
                  merchantScopes?.length > 0
                    ? "Specific Merchants"
                    : "Global (All)"
                }
              />

              {/* TIME SCHEDULE */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
                  Time Schedule
                </p>
                {timeRules.length > 0 ? (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto pr-1 hide-scroll"
                    style={{ maxHeight: "175px" }}
                  >
                    {timeRules.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between text-xs bg-[#F0F9FF] border border-[#E0F2FE] px-3 py-2.5 rounded-lg gap-2"
                      >
                        <div className="flex items-center gap-2 text-sky-800 font-semibold">
                          <Calendar
                            size={12}
                            className="text-sky-500 shrink-0"
                          />
                          <span className="truncate">
                            {formatDate(d.start_date)} —{" "}
                            {formatDate(d.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-100 self-start">
                          <Clock size={11} className="shrink-0" />
                          <span className="font-mono text-[11px] whitespace-nowrap">
                            {d.discount_times?.length > 0
                              ? `${d.discount_times[0].start_time.slice(
                                  0,
                                  5
                                )} - ${d.discount_times[0].end_time.slice(
                                  0,
                                  5
                                )}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-900 font-semibold">
                    No discount date selected
                  </span>
                )}
              </div>

              {/* CARDS & MCCs - GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Left Column: Card Networks & Types (Stacked) */}
                <div className="flex flex-col gap-4">
                  {/* Card Networks */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={10} className="text-blue-500" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Card Networks
                      </p>
                    </div>
                    <div className=" pr-10">
                      <ListBadge items={cardNetworks} emptyText="No Card Networks Selected" />
                    </div>

                    {/* Card Types */}
                    <div className="flex items-center gap-2 mb-2 mt-3">
                      <CreditCard size={10} className="text-purple-500" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Card Types
                      </p>
                    </div>
                    <div className=" pr-1 ">
                      <ListBadge items={cardTypes} emptyText="No Card Types Selected" />
                    </div>
                  </div>
                </div>

                {/* Right Column: MCC Codes (Full Height) */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash size={10} className="text-emerald-500" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      MCC Codes
                    </p>
                  </div>
                  <div className=" pr-1 hide-scroll">
                    {mccs.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-start">
                        {mccs.map((code, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white text-gray-700 border border-gray-200 text-[10px] font-mono font-medium rounded shadow-sm"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        No Mcc Code Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {/* BIN CONFIGURATION - PRO UI */}
          <Card title="BIN Configuration" icon={Hash}>
            {/* Header: Target Segments */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Discount Segments
              </span>
              {segments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {segments.map((s, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        i % 2 === 0
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {s.segment_name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-xs">-</span>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="flex flex-col gap-3 h-full">
                {/* --- Header --- */}
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-slate-400" />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    BIN Ranges
                  </p>
                </div>

                {/* --- Content Box --- */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 h-full flex flex-col">
                  {allBins.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1 hide-scroll">
                      {allBins.map((bin, i) => (
                        <div
                          key={i}
                          className="group flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#E4EAF1]"
                        >
                          {/* Start Bin */}
                          <span className="font-mono text-[11px] font-bold text-slate-700 tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                            {bin.start_bin}
                          </span>

                          {/* Clean Icon Arrow (Replaces the CSS arrow) */}
                          <ArrowRight
                            size={12}
                            className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
                          />

                          {/* End Bin */}
                          <span className="font-mono text-[11px] font-bold text-slate-700 tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                            {bin.end_bin}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* --- Empty State --- */
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-6">
                      <Globe size={20} className="opacity-50" />
                      <span className="text-xs font-medium italic">
                        No specific ranges (Global)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Apple Pay Tokens */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.apple}
                    className="w-3.5 h-3.5 opacity-60 grayscale"
                    alt="apple"
                  />
                  <p className="text-[11px] font-bold text-gray-500 uppercase">
                    Apple Tokens
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 h-full flex flex-col">
                  {allTokens.length > 0 ? (
                    <div className="grid grid-cols-1  gap-2 max-h-[210px] overflow-y-auto pr-1 hide-scroll">
                      {allTokens.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                            <img
                              src={assets.apple}
                              className="w-3 h-3 object-contain"
                              alt="apple"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                              Token
                            </p>
                            <p
                              className="text-xs font-mono font-medium text-gray-700 truncate"
                              title={t.token_value}
                            >
                              {t.token_value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic py-6">
                      No tokens configured
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* --- MERCHANT SCOPE CARD --- */}
      {/* --- MERCHANT SCOPE CARD --- */}
<Card title="Merchant Scope" icon={Store}>
  <div className="flex flex-col gap-3 h-full">
    {/* Header inside content */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Layers size={14} className="text-slate-400" />
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Connected MIDs
        </p>
      </div>

      {/* Global Badge (If applicable) */}
      {merchantScopes.length === 0 && (
        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
          <Globe size={10} />
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Global Access
          </span>
        </div>
      )}
    </div>

    {/* Scrollable Content Box */}
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 h-full flex flex-col min-h-[160px]">
      {merchantScopes.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 hide-scroll">
          {merchantScopes.map((mid, i) => (
            /* Individual Brand Card */
            <div
              key={i}
              className="flex flex-col bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group"
            >
              {/* Brand Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Logo / Avatar Logic */}
                  <div className="relative shrink-0">
                    {mid.brand_logo ? (
                      <img
                        src={mid.brand_logo}
                        alt={mid.brand_name}
                        className="w-6 h-6 object-contain rounded-md bg-white border border-slate-100"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Fallback Avatar */}
                    <div
                      className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600"
                      style={{ display: mid.brand_logo ? "none" : "flex" }}
                    >
                      {mid.brand_name?.charAt(0)}
                    </div>
                  </div>

                  {/* Brand Name */}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 leading-none">
                      {mid.brand_name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium mt-1">
                      MID Component
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border  
                  ${
                    mid.all_tids
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  {mid.all_tids ? "ALL TERMINALS" : "RESTRICTED"}
                </span>
              </div>

              {/* ✅ Nested Terminal List - Logic updated to show identifiers always */}
              {mid.discount_tids && mid.discount_tids.length > 0 && (
                <div className="relative pl-3 mt-1 ml-3 border-l-2 border-slate-100">
                  <div className="flex flex-wrap gap-2 pt-1 pl-1">
                    {mid.discount_tids.map((tid, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded hover:border-slate-300 transition-colors"
                      >
                        <TerminalSquare
                          size={10}
                          className="text-slate-400"
                        />
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                          {tid.terminal_identifier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-6 text-center">
          <div className="p-3 bg-white rounded-full border border-dashed border-slate-200 shadow-sm">
            <Globe size={20} className="text-blue-300" />
          </div>
          <div>
            <p className="text-xs italic font-medium text-slate-500">
             No MIDS/TIDS Selected 
            </p>
           
          </div>
        </div>
      )}
    </div>
  </div>
</Card>

        {/* DISCOUNT CONFIGURATION */}
      <Card title="Discount Configuration" icon={Percent}>
  {discountAmounts.length > 0 ? (
    <div
      className={`grid gap-6 ${
        discountAmounts.length > 1
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1"
      } max-h-[400px] overflow-y-auto hide-scroll pr-2`}
    >
      {discountAmounts.map((amt, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col"
        >
          {/* Slab Header */}
          <div className="bg-gray-50 px-4 py-2.5 flex justify-between items-center border-b border-gray-100 shrink-0">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              Slab {idx + 1}
            </span>
            <div className="flex gap-2">
              {/* ✅ Added Tax Percentage Badge */}
              {amt.tax_percentage && (
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">
                  Tax: {amt.tax_percentage}%
                </span>
              )}
              {amt.max_discount_cap && (
                <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-100 font-bold uppercase">
                  Capped Offer
                </span>
              )}
            </div>
          </div>

          <div className="p-5 flex flex-col justify-between flex-1 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Discount Value */}
              <div className="flex flex-col items-center justify-center min-w-[100px]">
                <div className="text-3xl font-extrabold text-[#7747EE] leading-none">
                  {amt.is_percentage
                    ? `${amt.discount_percentage}%`
                    : amt.discount_amount}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
                  {amt.is_percentage ? "Discount" : "Fixed Amount"}
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-12 bg-gray-200 border-r border-dashed"></div>

              {/* Rules Grid */}
              <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                    Min Spend
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {Number(amt.min_txn_amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                    Max Spend
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {Number(amt.max_txn_amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col items-center p-1.5 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-[9px] font-bold text-purple-400 uppercase mb-0.5">
                    Max Cap
                  </span>
                  <span className="text-xs font-bold text-[#7747EE]">
                    {amt.max_discount_cap ? (
                      Number(amt.max_discount_cap).toLocaleString()
                    ) : (
                      <span className="text-lg leading-none">∞</span>
                    )}
                  </span>
                </div>
                {/* ✅ Added Tax Detail in Grid for better visibility */}
                <div className="flex flex-col items-center p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-[9px] font-bold text-blue-400 uppercase mb-0.5">
                    Tax
                  </span>
                  <span className="text-xs font-bold text-blue-800">
                    {amt.tax_percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Usage Limits Section */}
            {(amt.daily || amt.weekly || amt.monthly) && (
              <div className="pt-3 border-t border-dashed border-gray-200">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
                  Usage Limits
                </p>
                <div className="flex flex-wrap gap-2">
                  {amt.daily && (
                    <span className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600 font-medium">
                      <span className="font-bold text-gray-800">Daily:</span>{" "}
                      {amt.daily}
                    </span>
                  )}
                  {amt.weekly && (
                    <span className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600 font-medium">
                      <span className="font-bold text-gray-800">Weekly:</span>{" "}
                      {amt.weekly}
                    </span>
                  )}
                  {amt.monthly && (
                    <span className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600 font-medium">
                      <span className="font-bold text-gray-800">Monthly:</span>{" "}
                      {amt.monthly}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-gray-400 text-center italic py-4 bg-gray-50 rounded border border-dashed border-gray-200">
      No discount rules configured
    </div>
  )}
</Card>
        {/* DOCUMENTS */}
        <Card title="Documentation" icon={FileText}>
          <ScrollableList
            items={discountDocs}
            emptyText="No documents attached"
            renderItem={(doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#F3F0FF] rounded-lg text-[#7747EE] shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {doc.doc_name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {doc.doc_text}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-600 px-3 py-1.5 rounded transition-all font-medium shadow-sm">
                  <Download size={13} /> View
                </button>
              </div>
            )}
          />
        </Card>
      </div>
      {/* --- 3. ACTION FOOTER (CHECKER ONLY) --- */}
   {/* --- 3. ACTION FOOTER (CHECKER ONLY) --- */}
     {/* --- 3. ACTION FOOTER (CHECKER ONLY) --- */}
      {isChecker && (
        <div className="max-w-[1400px] mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            
            {/* ---------------------------------------------------------- */}
            {/* SCENARIO 1: PENDING DELETE (Special Delete Actions)       */}
            {/* ---------------------------------------------------------- */}
            {statusName.toLowerCase() === "pending delete" || statusName.toLowerCase() === "pending_delete" ? (
              <>
                {/* Input Area - Exact same UI as Approval */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Deletion Remarks{" "}
                    <span className="font-normal normal-case italic">
                      (Min 10 chars)
                    </span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#dc2626] transition-colors">
                      <Trash2 size={16} />
                    </div>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks for deletion..."
                      maxLength={250}
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#7747EE] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Buttons - Same Layout */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  {/* Reject Delete (Restore) */}
                  <button
                    onClick={handleDeleteReject}
                    disabled={isSubmitting}
                    className="w-auto h-[32px] rounded-[6px] bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px] hover:bg-gray-200 transition-colors disabled:opacity-50"

                  >
                    Reject (Restore)
                  </button>

                  {/* Approve Delete (Red Button for Danger) */}
                  <button
                    onClick={handleDeleteApprove}
                    disabled={isSubmitting}
                    className="w-auto h-[32px] rounded-[6px] bg-[#EFF6FF] text-[#2563EB] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px] hover:bg-blue-100 transition-colors disabled:opacity-50"


                  >
                    {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Approve Deletion"}
                  </button>
                </div>
              </>
            ) : isSubmitted ? (
              /* ---------------------------------------------------------- */
              /* SCENARIO 2: SUBMITTED (Normal Approval Flow)               */
              /* ---------------------------------------------------------- */
              <>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Approval / Rejection{" "}
                    <span className="font-normal normal-case italic">
                      (Max 250 chars)
                    </span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
                      <FileText size={16} />
                    </div>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter your remarks here (Minimum 10 characters)..."
                      maxLength={250}
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#7747EE] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="w-[80px] h-[32px] rounded-[6px] bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px] hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-[80px] h-[32px] rounded-[6px] bg-[#EFF6FF] text-[#2563EB] text-[12px] font-semibold flex items-center justify-center gap-2 px-[14px] py-[10px] hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Approve"}
                  </button>
                </div>
              </>
            ) : (
              /* ---------------------------------------------------------- */
              /* SCENARIO 3: STATUS MESSAGES (ReadOnly)                     */
              /* ---------------------------------------------------------- */
              <div className="flex items-center justify-center py-4">
                {isDraft && (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <AlertCircle size={32} className="text-gray-300" />
                    <p className="text-sm font-medium">Campaign is currently in Draft.</p>
                  </div>
                )}
                {isApproved && (
                  <div className="flex flex-col items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                    <p className="text-sm font-bold">This Campaign has been Approved.</p>
                  </div>
                )}
                {isRejected && (
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <XCircle size={32} className="text-red-500" />
                    <p className="text-sm font-bold">This Campaign has been Rejected.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCampaign;