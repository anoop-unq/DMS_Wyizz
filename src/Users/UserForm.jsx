import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Lock, Phone, Calendar, 
  MapPin, Building2, ShieldCheck, Image as ImageIcon,
  Hash, Globe, Save, Loader2, UserCircle, ShieldAlert,
  Eye, EyeOff, ChevronDown
} from 'lucide-react';
import { userManagementApi } from "../utils/metadataApi";
import Swal from 'sweetalert2';

const UserForm = ({ onCancel, onSuccess, initialData = null }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isEdit = !!initialData;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentUserRole = (localStorage.getItem('userType') || 'admin').toLowerCase();

  // --- BORDER CLASS LOGIC ---
  const getBorderClass = (field) => {
    return errors[field]
      ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 relative z-10"
      : "border-gray-300 focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10";
  };

  // --- CLEAR ERROR ON FOCUS ---
  const handleInputFocus = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserTypeOptions = () => {
    const adminRoles = [
      { label: 'Merchant', value: 'merchant' },
      { label: 'Bank', value: 'bank' },
      { label: 'Discount Maker', value: 'discountmaker' },
      { label: 'Discount Checker', value: 'discountchecker' },
      { label: 'Company Manager', value: 'companymanager' },
      { label: 'HQ Manager', value: 'hqmanager' },
      { label: 'BU Manager', value: 'bumanager' },
      { label: 'Store Manager', value: 'storemanager' },
      { label: 'Terminal Manager', value: 'terminalmanager' },
      { label: 'Merchant Onboarder', value: 'merchantonboarder' }
    ];
    return currentUserRole === 'admin' ? adminRoles : adminRoles.slice(2, 4);
  };

  const allowedOptions = getUserTypeOptions();

  const [formData, setFormData] = useState({
    user_name: initialData?.name || '',
    user_email: initialData?.email || '',
    password: '',
    usertype: initialData?.usertype || '', 
    phone: initialData?.phone || '',
    countrycode: initialData?.countrycode || '+965',
    date_of_birth: initialData?.date_of_birth || '',
    company_name: initialData?.company_name || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    postal_code: initialData?.postal_code || '',
    marketing_opt_in: initialData?.marketing_opt_in ?? true,
    terms_accepted: initialData?.terms_accepted ?? true,
    must_reset_password: initialData?.must_reset_password ?? false,
    profile_image: '', 
    store_id: initialData?.store_id || '',
    business_unit_id: initialData?.business_unit_id || '',
    ...(isEdit && { is_locked: initialData?.is_locked ?? false })
  });

  const [preview, setPreview] = useState(
    initialData?.profile_image ? `https://uat-api.marhabaqr.com/file/${initialData.profile_image}` : null
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectRole = (value) => {
    setFormData(prev => ({ ...prev, usertype: value }));
    handleInputFocus('usertype');
    setIsDropdownOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_image: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.user_name) newErrors.user_name = true;
    if (!formData.user_email) newErrors.user_email = true;
    if (!formData.usertype) newErrors.usertype = true;
    if (!isEdit && !formData.password) newErrors.password = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      ['store_id', 'business_unit_id'].forEach(field => {
        if (payload[field] === "" || payload[field] === null) delete payload[field];
        else payload[field] = parseInt(payload[field], 10);
      });
      if (isEdit && !payload.password) delete payload.password;
      if (!payload.date_of_birth) delete payload.date_of_birth;

      if (isEdit) {
        await userManagementApi.update(initialData.id, payload);
      } else {
        await userManagementApi.create(payload);
      }
      Swal.fire("Success", `User ${isEdit ? 'updated' : 'created'} successfully`, "success");
      onSuccess();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.detail || "Action Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-[14px]">
      {/* --- FIXED HEADER --- */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onCancel} className="group flex items-center gap-2 text-gray-500 hover:text-[#7747EE] transition-colors">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F9FB] border border-[#E2E8F0] transition-all group-hover:bg-[#F3F0FF]">
                <ArrowLeft size={16} />
              </div>
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-black text-slate-900 leading-none">{isEdit ? 'Update User' : 'Register New User'}</h1>
              {/* <span className="text-[10px] font-bold text-slate-400 mt-1  ">User Management System</span> */}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto w-full p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col items-center shadow-sm">
              <div className="relative group mb-6">
                <div className="w-36 h-36 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-[#7747EE] transition-all">
                  {preview ? <img src={preview} className="w-full h-full object-contain" alt="Profile" /> : <UserCircle size={64} className="text-slate-200" />}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                  <ImageIcon className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              {/* --- CUSTOM BLUE DROPDOWN --- */}
              <div className="w-full space-y-2" ref={dropdownRef}>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Assign User Role</label>
                <div className="relative">
                  <div 
                    onClick={() => { setIsDropdownOpen(!isDropdownOpen); handleInputFocus('usertype'); }}
                    className={`w-full bg-white rounded p-2.5 px-4 text-sm font-semibold cursor-pointer border flex items-center justify-between transition-all ${getBorderClass('usertype')}`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className={formData.usertype ? "text-[#7747EE]" : "text-gray-400"} />
                      <span className={formData.usertype ? "text-slate-900" : "text-gray-400"}>
                        {allowedOptions.find(o => o.value === formData.usertype)?.label || "Select User Role"}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                      <div className="max-h-60 overflow-y-auto">
                        {allowedOptions.map((opt) => (
                          <div
                            key={opt.value}
                            onClick={() => handleSelectRole(opt.value)}
                            className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                              formData.usertype === opt.value 
                                ? 'bg-indigo-50 text-[#7747EE]' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-[#7747EE]'
                            }`}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-xl text-white space-y-4 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 border-b border-slate-700 pb-3 flex items-center gap-2"><ShieldAlert size={14} /> Security Controls</h3>
              <ToggleRow label="Must Reset Password" name="must_reset_password" checked={formData.must_reset_password} onChange={handleChange} />
              <ToggleRow label="Marketing Alerts" name="marketing_opt_in" checked={formData.marketing_opt_in} onChange={handleChange} />
              <ToggleRow label="Accept Terms" name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} />
              {isEdit && <ToggleRow label="Account Locked" name="is_locked" checked={formData.is_locked} onChange={handleChange} danger />}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <FormSection title="Account Identity" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Full Name" name="user_name" value={formData.user_name} onChange={handleChange} onFocus={() => handleInputFocus('user_name')} borderClass={getBorderClass('user_name')} placeholder="Jane Smith" />
                <FormInput label="Email Address" name="user_email" type="email" value={formData.user_email} onChange={handleChange} onFocus={() => handleInputFocus('user_email')} borderClass={getBorderClass('user_email')} placeholder="jane@example.com" />
                <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
                <FormInput label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Login Password</label>
                  <div className="relative group">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus('password')}
                      placeholder="••••••••"
                      className={`w-full bg-[#ffffff] rounded p-2.5 pr-12 text-sm outline-none border transition-all ${getBorderClass('password')}`}
                    />
                    {/* Constant clickable Eye icon */}
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7747EE] z-20 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="Localization" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Acme Corp" />
                <FormInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Los Angeles" />
              </div>
            </FormSection>

            <div className="flex justify-end gap-4 pt-4 pb-10">
              <button type="submit" disabled={isSubmitting} className="bg-[#7747EE] hover:bg-[#6339cc] text-white px-12 py-3 rounded-lg text-sm font-black shadow-none flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isEdit ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
    <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
      <div className="p-2 bg-[#F3F0FF] rounded-lg text-[#7747EE]"><Icon size={18} /></div>
      <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-widest">{title}</h3>
    </div>
    {children}
  </div>
);

const FormInput = ({ label, borderClass, onFocus, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">{label}</label>
    <input {...props} onFocus={onFocus} className={`w-full bg-[#ffffff] rounded p-2.5 text-sm outline-none border transition-all ${borderClass || "border-gray-300 focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE]"}`} />
  </div>
);

const ToggleRow = ({ label, name, checked, onChange, danger = false }) => (
  <div className="flex items-center justify-between group">
    <span className={`text-[10px] font-bold uppercase tracking-wide ${danger ? 'text-rose-400' : 'text-slate-300'}`}>{label}</span>
    <button type="button" onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })} className={`relative inline-flex h-5 w-10 rounded-full transition-colors duration-200 focus:outline-none ${checked ? (danger ? 'bg-rose-500' : 'bg-[#7747EE]') : 'bg-slate-700'}`}>
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'} mt-[2px]`} />
    </button>
  </div>
);

export default UserForm;