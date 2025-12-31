
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Plus, Calendar, Search as LucideSearch, Mail, MapPin, 
//   Phone, Eye, Pencil, Trash2, ArrowLeft, Loader2 
// } from 'lucide-react';
// import { userManagementApi } from "../utils/metadataApi";
// import Pagination from "../Components/Pagination";

// // ✅ 1. UserCard Component
// const UserCard = ({ user, onEdit }) => (
//   <div className="bg-white py-4 px-5 rounded-lg shadow-[0px_2px_4px_0px_#0000001A] border border-gray-200">
//     <div className="flex justify-between items-start mb-2">
//       <div className="flex items-center gap-3">
//         <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">
//           {user.name?.charAt(0) || 'U'}
//         </div>
//         <div>
//           <h3 className="font-semibold text-[15px] text-gray-800">{user.name}</h3>
//           <span className="text-[10px] text-gray-400 uppercase tracking-wide">{user.usertype}</span>
//         </div>
//       </div>
//       {/* <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${user.is_locked ? 'bg-red-100 text-red-700' : 'bg-[#DCFCE7] text-[#1D6A3A]'}`}>
//         {user.is_locked ? 'Locked' : ''}
//       </span> */}

//       {user.is_locked && (
//   <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
//     Locked
//   </span>
// )}
//     </div>

//     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-gray-600 font-normal mt-4 mb-4">
//       <div className="flex items-center gap-2 truncate">
//         <Mail size={14} className="text-gray-400" />
//         <span title={user.email} className="truncate">{user.email}</span>
//       </div>
//       <div className="flex items-center gap-2 truncate">
//         <Phone size={14} className="text-gray-400" />
//         <span>{user.phone || 'N/A'}</span>
//       </div>
//       <div className="flex items-center gap-2 truncate">
//         <MapPin size={14} className="text-gray-400" />
//         <span className="truncate">{user.city || 'Location'}</span>
//       </div>
//       <div className="flex items-center gap-2 truncate">
//         <Calendar size={14} className="text-gray-400" />
//         <span>Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
//       </div>
//     </div>

//     <div className="border-t border-gray-100 pt-3 flex justify-end items-center gap-2">
//       <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
//         <Eye size={15} />
//       </button>
//       <button 
//         onClick={() => onEdit(user)}
//         className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-green-600 transition-colors"
//       >
//         <Pencil size={15} />
//       </button>
//       <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors">
//         <Trash2 size={15} />
//       </button>
//     </div>
//   </div>
// );

// // ✅ 2. UserForm Component
// const UserForm = ({ onCancel, onSuccess, initialData = null }) => {
//   const isEdit = !!initialData;
//   const currentUserRole = localStorage.getItem('userType') || 'admin'; 

//   const getUserTypeOptions = () => {
//     // Admin permissions [cite: 185]
//     if (currentUserRole === 'admin') {
//       return [
//         { label: 'Merchant', value: 'merchant' },
//         { label: 'Bank', value: 'bank' },
//         { label: 'Discount Maker', value: 'discountmaker' },
//         { label: 'Discount Checker', value: 'discountchecker' },
//         { label: 'Company Manager', value: 'companymanager' },
//         { label: 'HQ Manager', value: 'hqmanager' },
//         { label: 'BU Manager', value: 'bumanager' },
//         { label: 'Store Manager', value: 'storemanager' },
//         { label: 'Terminal Manager', value: 'terminalmanager' },
//         { label: 'Merchant Onboarder', value: 'merchantonboarder' }
//       ];
//     } else if (currentUserRole === 'bank') {
//       // Bank permissions [cite: 186]
//       return [
//         { label: 'Discount Maker', value: 'discountmaker' },
//         { label: 'Discount Checker', value: 'discountchecker' }
//       ];
//     }
//     return [];
//   };

//   const allowedOptions = getUserTypeOptions();

//   const [formData, setFormData] = useState({
//     user_name: initialData?.name || '',
//     user_email: initialData?.email || '',
//     password: '',
//     usertype: initialData?.usertype || allowedOptions[0]?.value || 'storemanager',
//     phone: initialData?.phone || '',
//     countrycode: '+1',
//     city: initialData?.city || '',
//     must_reset_password: false
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEdit) {
//         await userManagementApi.update(initialData.id, formData);
//       } else {
//         await userManagementApi.create(formData);
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Operation failed", error);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg border border-gray-200">
//       <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-800">
//         <ArrowLeft size={18} /> Back to List
//       </button>
//       <h2 className="text-lg font-semibold mb-6">{isEdit ? 'Update User' : 'Create New User'}</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-medium text-gray-600">Full Name</label>
//           <input required value={formData.user_name} className="border p-2 rounded-md text-sm outline-none focus:border-[#7747EE]" 
//                  onChange={e => setFormData({...formData, user_name: e.target.value})} />
//         </div>
//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-medium text-gray-600">Email Address</label>
//           <input required type="email" value={formData.user_email} className="border p-2 rounded-md text-sm outline-none focus:border-[#7747EE]" 
//                  onChange={e => setFormData({...formData, user_email: e.target.value})} />
//         </div>
//         {!isEdit && (
//           <div className="flex flex-col gap-1">
//             <label className="text-xs font-medium text-gray-600">Password</label>
//             <input required type="password" placeholder="••••••••" className="border p-2 rounded-md text-sm outline-none focus:border-[#7747EE]" 
//                    onChange={e => setFormData({...formData, password: e.target.value})} />
//           </div>
//         )}
//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-medium text-gray-600">User Type</label>
//           <select value={formData.usertype} className="border p-2 rounded-md text-sm outline-none focus:border-[#7747EE]" 
//                   onChange={e => setFormData({...formData, usertype: e.target.value})}>
//             {allowedOptions.map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div className="md:col-span-2 mt-4">
//           <button type="submit" className="btn-primary-violet w-full md:w-auto px-10">
//             {isEdit ? 'Update User' : 'Save User'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // ✅ 3. Main UserManagement Component
// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [view, setView] = useState('list');
//   const [editingUser, setEditingUser] = useState(null);
//   const [stats, setStats] = useState({ total: 0, active: 0, locked: 0 });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const itemsPerPage = 6;
//   const [searchKeyword, setSearchKeyword] = useState("");

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const skipValue = (currentPage - 1) * itemsPerPage; // [cite: 16]
//       const params = {
//         skip: skipValue,
//         limit: itemsPerPage, // [cite: 17, 57]
//         direction: "desc", // [cite: 19]
//       };

//       if (searchKeyword.trim() !== "") {
//         const isEmail = searchKeyword.includes("@");
//         const isPhone = /^\+?[\d\s-]+$/.test(searchKeyword);

//         if (isEmail) {
//           params.email = searchKeyword; // 
//         } else if (isPhone) {
//           params.phone = searchKeyword; // 
//         } else {
//           params.name = searchKeyword; // 
//         }
//       }

//       const res = await userManagementApi.getAll(params); // [cite: 10]
//       const responseData = res?.data || {};
//       const rows = responseData?.rows || []; // [cite: 23]
      
//       setUsers(rows);
//       setTotalItems(responseData?.total || 0); // [cite: 55]
      
//       setStats({
//         total: responseData?.total || 0, // [cite: 55]
//         active: rows.filter(u => !u.is_locked).length, // [cite: 49]
//         locked: rows.filter(u => u.is_locked).length // [cite: 49]
//       });
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, itemsPerPage, searchKeyword]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setView('form');
//   };

//   if (view === 'form') {
//     return (
//       <div className="p-5 flex-1 overflow-y-auto">
//         <UserForm 
//           initialData={editingUser}
//           onCancel={() => { setView('list'); setEditingUser(null); }} 
//           onSuccess={() => { setView('list'); setEditingUser(null); fetchUsers(); }} 
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full min-h-[calc(100vh-80px)] pl-5 pr-5 pt-5">
//       <div className="max-w-full space-y-6 w-full flex-1 flex flex-col overflow-y-scroll hide-scroll">
        
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="head">User Management</h1>
//             <p className="para mt-3" style={{ fontSize: "12px" }}>
//               Manage user accounts, roles, and activity securely
//             </p>
//           </div>
//           <button onClick={() => setView('form')} className="flex items-center gap-2 btn-primary-violet px-4 py-2">
//             <Plus size={16} /> New User
//           </button>
//         </div>

//         <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
//           <div className="bg-white py-2 px-3 rounded-md shadow-sm border border-gray-100 flex flex-col justify-center min-h-[50px]">
//             <p className="text-[11px] font-normal text-gray-500">Total Users</p>
//             <span className="text-[15px] font-normal text-gray-700">{stats.total}</span>
//           </div>
      
//           <div className="bg-white py-2 px-3 rounded-md shadow-sm border border-gray-100 flex flex-col justify-center min-h-[50px]">
//             <p className="text-[11px] font-normal text-gray-500">Locked</p>
//             <span className="text-[15px] font-normal text-gray-700">{stats.locked}</span>
//           </div>
//         </section>

//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 mb-6 flex items-center justify-between transition-all duration-300">
//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <LucideSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7747EE] z-20" />
//               <input
//                 type="text"
//                 value={searchKeyword}
//                 onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
//                 placeholder="Search by name, email, or phone..."
//                 className="pl-9 pr-4 py-2 w-[320px] rounded-lg text-[12px] font-medium text-slate-600 border border-[#E2E8F0] bg-white outline-none transition-all focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] placeholder:text-slate-300"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-2 pr-2">
//             <div className="h-4 w-[1px] bg-slate-200 mr-2" />
//             <span className="text-[11px] font-normal text-[#64748B] pr-2">{totalItems} Users</span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex flex-1 items-center justify-center py-10">
//             <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
//           </div>
//         ) : (
//           <div className="flex flex-col flex-1 justify-between pb-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
//               {users.length > 0 ? (
//                 users.map((user) => <UserCard key={user.uid} user={user} onEdit={handleEdit} />)
//               ) : (
//                 <div className="col-span-full text-center py-10 text-gray-500 text-sm">No users found.</div>
//               )}
//             </div>
            
//             <div className="flex justify-end mt-auto">
//               <Pagination
//                 currentPage={currentPage}
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={setCurrentPage}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }