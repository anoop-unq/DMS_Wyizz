import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, ShieldAlert, Briefcase, 
  Clock, User as UserIcon, Globe, Hash,
  Landmark, Store, Monitor, Building2, CheckCircle, XCircle,
  Fingerprint, ShieldQuestion, FileCheck, Megaphone
} from 'lucide-react';

/**
 * Helper to capitalize titles (Title Case)
 */
const formatTitle = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const DataField = ({ icon: Icon, label, value, color = "text-slate-400" }) => {
  const isBoolean = typeof value === 'boolean';
  const displayValue = (value === null || value === undefined || value === "" || value === "None") 
    ? "None" 
    : (isBoolean ? (value ? "Yes" : "No") : value);
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group h-full">
      <div className={`p-2 rounded-lg shrink-0 bg-slate-50 ${color} group-hover:bg-indigo-50 transition-colors`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-[13px] font-semibold text-slate-700 truncate leading-tight">
          {displayValue}
        </p>
      </div>
    </div>
  );
};

const ViewUser = ({ user, onBack }) => {
  const navigate = useNavigate();
  if (!user) return null;

  const profileImageUrl = user.profile_image 
    ? `https://uat-api.marhabaqr.com/file/${user.profile_image}`
    : null;

  const titleLabel = formatTitle(user.usertype ? `${user.usertype} Profile` : "User Profile");
  const breadcrumbLabel = formatTitle(user.name || "User Details");

  const formatDate = (dateString) => {
    if (!dateString || dateString === "None") return "None";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-0 font-sans text-[14px]">
      
      {/* --- HEADER: EXACT LOGIC EXTRACTED FROM VIEWCAMPAIGN --- */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Exact Back Button from ViewCampaign */}
            <button
              onClick={onBack || (() => navigate(-1))}
              className="group flex items-center gap-2 text-gray-500 hover:text-[#7747EE] transition-colors text-[11px] font-bold uppercase tracking-wider"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F9FB] border border-[#E2E8F0] transition-all group-hover:border-[#7747EE]/30 group-hover:bg-[#F3F0FF]">
                <ArrowLeft size={16} className="text-gray-500 group-hover:text-[#7747EE]" />
              </div>
            </button>

            {/* Title and breadcrumb extracted logic */}
            <div className="flex flex-col text-left">
              <h1 className="text-base font-black text-slate-900 leading-none">
                {titleLabel}
              </h1>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                {breadcrumbLabel}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest shadow-sm ${
            user.is_locked ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {user.is_locked ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
            {user.is_locked ? "Locked" : "Active"}
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER: Aligned to 1400px Max-Width --- */}
      <div className="max-w-[1400px] mx-auto p-4 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Sidebar Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center flex-1">
              <div className="relative w-24 h-24 mx-auto mb-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={user.name} className="w-full h-full object-contain" />
                ) : (
                  <UserIcon size={40} className="text-slate-200" />
                )}
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">{user.name}</h2>
              <div className="mt-2">
                <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {user.usertype}
                </span>
              </div>
              <div className="mt-6 space-y-2 text-left">
                <StatusRow label="Email Verified" status={user.email_verified} />
                <StatusRow label="Phone Verified" status={user.phone_verified} />
                <StatusRow label="Marketing Status" status={user.marketing_opt_in} />
                <StatusRow label="Terms Accepted" status={user.terms_accepted} />
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 text-left">
                <Fingerprint size={14} className="text-indigo-400" /> System Metadata
              </h3>
              <div className="space-y-4">
                <SystemInfo label="User UID" value={user.uid} />
                <SystemInfo label="Account Created" value={formatDate(user.created_at)} />
                <SystemInfo label="Last Modification" value={formatDate(user.updated_at)} />
              </div>
            </div>
          </div>

          {/* Identity & Org Sections */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <DataSection title="Identity & Contact Information">
              <DataField icon={Mail} label="Email Address" value={user.email} color="text-blue-500" />
              <DataField icon={Phone} label="Contact Number" value={user.phone ? `${user.countrycode || ""} ${user.phone}` : "None"} color="text-emerald-500" />
              <DataField icon={Calendar} label="Date of Birth" value={user.date_of_birth} color="text-orange-400" />
              <DataField icon={ShieldQuestion} label="Password Reset" value={user.must_reset_password ? "Required" : "Not Required"} color="text-rose-400" />
              <DataField icon={FileCheck} label="Terms Accepted" value={user.terms_accepted} color="text-indigo-400" />
              <DataField icon={Megaphone} label="Marketing Opt-In" value={user.marketing_opt_in} color="text-sky-400" />
            </DataSection>

            <DataSection title="Organizational Mapping" className="flex-1">
              <DataField icon={Building2} label="Company" value={user.company_name} color="text-indigo-500" />
              <DataField icon={Landmark} label="Headquarter" value={user.headquarter_name} color="text-violet-500" />
              <DataField icon={Briefcase} label="Business Unit" value={user.business_unit_name} color="text-pink-500" />
              <DataField icon={Store} label="Store" value={user.store_name} color="text-sky-500" />
              <DataField icon={Landmark} label="Bank Branch" value={user.bank_name} color="text-cyan-500" />
              <DataField icon={Monitor} label="Terminal ID" value={user.terminal_identifier} color="text-slate-500" />
              <DataField icon={Building2} label="Merchant Label" value={user.merchant_name} color="text-amber-500" />
              <DataField icon={Hash} label="ID Reference" value={user.id} color="text-slate-400" />
            </DataSection>
          </div>
        </div>

        {/* Global Location Details */}
        <section className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-4">
          <div className="flex items-center gap-2 mb-4 text-left">
            <div className="h-5 w-1.5 bg-indigo-600 rounded-full" />
            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Global Location Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            <DataField icon={MapPin} label="Street Address" value={user.street} color="text-rose-400" />
            <DataField icon={Globe} label="City / Country" value={user.city && user.country && user.city !== "None" ? `${user.city}, ${user.country}` : "None"} color="text-blue-600" />
            <DataField icon={Hash} label="Postal Code" value={user.postal_code} color="text-slate-400" />
          </div>
        </section>

      </div>
    </div>
  );
};

/* --- Helpers --- */

const StatusRow = ({ label, status }) => (
  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100">
    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{label}</span>
    {status ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-slate-300" />}
  </div>
);

const SystemInfo = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-2 tracking-tighter text-left">{label}</p>
    <p className="text-[11px] font-mono text-slate-200 truncate leading-tight bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 text-left">{value}</p>
  </div>
);

const DataSection = ({ title, children, className = "" }) => (
  <section className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full ${className}`}>
    <div className="flex items-center gap-2 mb-4 text-left">
      <div className="h-5 w-1.5 bg-indigo-600 rounded-full" />
      <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">{children}</div>
  </section>
);

export default ViewUser;