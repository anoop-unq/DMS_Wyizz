import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search as LucideSearch, Loader2 } from 'lucide-react';
import { userManagementApi } from "../utils/metadataApi";
import Pagination from "../Components/Pagination";
import UserCard from './UserCard';
import UserForm from './UserForm';
import UserStats from './UserStats';
import ViewUser from './Viewuser';

export default function UserManagement() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, locked: 0 });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const skipValue = (currentPage - 1) * itemsPerPage;
      const params = {
        skip: skipValue,
        limit: itemsPerPage,
        sort: "id",
        direction: "asc",
      };

      if (searchKeyword.trim() !== "") {
        const isEmail = searchKeyword.includes("@");
        if (isEmail) params.email = searchKeyword;
        else params.name = searchKeyword;
      }

      const res = await userManagementApi.getAll(params);
      const responseData = res?.data || {};
      const rows = responseData?.rows || [];
      
      setUsers(rows);
      setTotalItems(responseData?.total || 0);
      setStats({
        total: responseData?.total || 0,
        locked: rows.filter(u => u.is_locked).length
      });
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchKeyword]);

  const fetchUserDetails = useCallback(async (userId, targetMode) => {
    setLoading(true);
    try {
      const res = await userManagementApi.getById(userId);
      setSelectedUser(res.data);
      setView(targetMode); 
    } catch (error) {
      console.error("Error fetching user details", error);
      navigate('/user-management');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.endsWith('create-user')) {
      setSelectedUser(null);
      setView('form');
    } else if (id) {
      const mode = location.state?.mode === 'edit' ? 'form' : 'view';
      fetchUserDetails(id, mode);
    } else {
      setView('list');
      fetchUsers();
    }
  }, [id, location.pathname, location.state, fetchUserDetails, fetchUsers]);

  const handleCreate = () => navigate('/user-management/create-user');
  const handleView = (userId) => navigate(`/user-management/${userId}`, { state: { mode: 'view' } });
  const handleEdit = (userId) => navigate(`/user-management/${userId}`, { state: { mode: 'edit' } });
  
  const handleBack = () => {
    setSelectedUser(null);
    navigate('/user-management');
  };

  // --- VIEW RENDER LOGIC ---
  // REMOVED 'p-5' wrapper to ensure the sticky header touches the edges properly
  if (view === 'view') {
    return <ViewUser user={selectedUser} onBack={handleBack} />;
  }

  if (view === 'form') {
    return (
      <UserForm 
        initialData={selectedUser}
        onCancel={handleBack} 
        onSuccess={() => {
          handleBack(); 
          fetchUsers(); 
        }} 
      />
    );
  }

  return (
    // Removed duplicate padding here to match your dashboard's main container
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-full space-y-6 w-full flex-1 flex flex-col overflow-y-auto hide-scroll">
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">User Management</h1>
            <p className="text-[12px] text-slate-400 font-medium mt-3">
              Manage user accounts and roles securely
            </p>
          </div>
          <button 
            onClick={handleCreate} 
            className="bg-[#7747EE] hover:bg-[#6339cc] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-purple-100 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={16} /> New User
          </button>
        </div>

        <UserStats stats={stats} />

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <LucideSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => { 
                    setSearchKeyword(e.target.value); 
                    setCurrentPage(1); 
                }}
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 w-[320px] rounded-xl text-[12px] font-medium border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {totalItems} Total Records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.length > 0 ? (
                users.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    onEdit={() => handleEdit(user.id)} 
                    onView={() => handleView(user.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-400 font-medium italic">
                  No user records found.
                </div>
              )}
            </div>
            
            <div className="mt-auto py-4 border-t border-slate-100">
                <Pagination 
                  currentPage={currentPage} 
                  totalItems={totalItems} 
                  itemsPerPage={itemsPerPage} 
                  onPageChange={setCurrentPage} 
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}