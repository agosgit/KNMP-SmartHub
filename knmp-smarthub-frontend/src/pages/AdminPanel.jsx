import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import useAppStore from '../store/useAppStore';
import {
  Shield,
  Users,
  MapPin,
  Building2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  AlertTriangle,
  UserPlus,
  Search,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// DELETE CONFIRMATION MODAL
// ============================================================
const DeleteModal = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <AlertTriangle size={22} color="var(--color-critical)" />
        </div>
        <div>
          <h4 className="modal-title">{title}</h4>
        </div>
      </div>
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}
          style={{ padding: '10px 20px', fontSize: '13px' }}>
          Batal
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}
          style={{ padding: '10px 20px' }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          <span>{loading ? 'Menghapus...' : 'Hapus'}</span>
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// TAB 1: USER MANAGEMENT
// ============================================================
const UserManagementTab = ({ knmps }) => {
  const { user: currentUser } = useAppStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Create user form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'PENGELOLA', knmpId: '' });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    const toastId = toast.loading('Memperbarui role...');
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Role berhasil diperbarui.', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah role.', { id: toastId });
    }
  };

  const handleKnmpAssign = async (userId, knmpId) => {
    const toastId = toast.loading('Memperbarui penempatan...');
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { knmpId: knmpId || null });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, knmpId: res.data.user.knmpId, knmp: res.data.user.knmp } : u));
      toast.success('Penempatan KNMP berhasil diperbarui.', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah penempatan.', { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/admin/users/${deleteTarget.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      toast.success('User berhasil dihapus.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    const toastId = toast.loading('Membuat user baru...');
    try {
      const res = await API.post('/admin/users', {
        ...newUser,
        knmpId: newUser.knmpId || null
      });
      setUsers(prev => [res.data.user, ...prev]);
      setNewUser({ email: '', password: '', name: '', role: 'PENGELOLA', knmpId: '' });
      setShowCreateForm(false);
      toast.success('User baru berhasil dibuat.', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat user.', { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const roles = ['ADMIN', 'PENGELOLA', 'TPI', 'KOPERASI', 'PENYULUH', 'PEMDA', 'KKP'];

  if (loading) {
    return (
      <div className="admin-empty-state">
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
        <span>Memuat data user...</span>
      </div>
    );
  }

  return (
    <>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '13px' }}
            />
          </div>
          <span className="admin-stat-pill">
            <Users size={14} />
            {users.length} user
          </span>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ height: '40px', fontSize: '13px', padding: '0 16px' }}>
          {showCreateForm ? <X size={16} /> : <UserPlus size={16} />}
          <span>{showCreateForm ? 'Batal' : 'Tambah User'}</span>
        </button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="glass-card">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>Buat User Baru</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Daftarkan akun baru ke dalam sistem</p>
          </div>
          <form onSubmit={handleCreateUser}>
            <div className="admin-form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-input" placeholder="Nama lengkap" required
                  value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="email@domain.com" required
                  value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-row" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Min. 6 karakter" required minLength={6}
                  value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Role</label>
                <select className="form-input" value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Penempatan KNMP</label>
                <select className="form-input" value={newUser.knmpId}
                  onChange={(e) => setNewUser({ ...newUser, knmpId: e.target.value })}>
                  <option value="">Pusat / Nasional</option>
                  {knmps.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary" disabled={creating}
                style={{ height: '40px', fontSize: '13px', padding: '0 20px' }}>
                {creating ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                <span>{creating ? 'Membuat...' : 'Buat User'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Penempatan KNMP</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty-state">
                      <Database size={32} />
                      <span>Tidak ada user ditemukan.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <span style={{ fontWeight: '600' }}>{u.name}</span>
                      {u.id === currentUser?.id && (
                        <span style={{ fontSize: '10px', color: 'var(--color-primary)', marginLeft: '8px', fontWeight: '600' }}>ANDA</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>
                      {u.id === currentUser?.id ? (
                        <span className={`status-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                      ) : (
                        <select
                          className="admin-select"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      )}
                    </td>
                    <td>
                      {u.id === currentUser?.id ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {u.knmp ? u.knmp.name : 'Pusat'}
                        </span>
                      ) : (
                        <select
                          className="admin-select"
                          value={u.knmpId || ''}
                          onChange={(e) => handleKnmpAssign(u.id, e.target.value)}
                        >
                          <option value="">Pusat / Nasional</option>
                          {knmps.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </select>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      {u.id !== currentUser?.id && (
                        <button className="btn-icon danger" title="Hapus User"
                          onClick={() => setDeleteTarget(u)}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          title="Hapus User"
          message={`Apakah Anda yakin ingin menghapus user "${deleteTarget.name}" (${deleteTarget.email})? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

// ============================================================
// TAB 2: KNMP MANAGEMENT
// ============================================================
const KnmpManagementTab = ({ knmps, setKnmps, regions }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = { name: '', address: '', latitude: '', longitude: '', regionId: '' };
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (knmp) => {
    setEditId(knmp.id);
    setForm({
      name: knmp.name,
      address: knmp.address,
      latitude: knmp.latitude,
      longitude: knmp.longitude,
      regionId: knmp.regionId || knmp.region?.id || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading(editId ? 'Memperbarui KNMP...' : 'Menambahkan KNMP...');

    try {
      if (editId) {
        const res = await API.put(`/admin/knmps/${editId}`, form);
        setKnmps(prev => prev.map(k => k.id === editId ? res.data.knmp : k));
        toast.success('Data KNMP berhasil diperbarui.', { id: toastId });
      } else {
        const res = await API.post('/admin/knmps', form);
        setKnmps(prev => [...prev, res.data.knmp]);
        toast.success('KNMP baru berhasil ditambahkan.', { id: toastId });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data KNMP.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/admin/knmps/${deleteTarget.id}`);
      setKnmps(prev => prev.filter(k => k.id !== deleteTarget.id));
      toast.success('KNMP berhasil dihapus beserta data terkait.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus KNMP.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span className="admin-stat-pill">
          <MapPin size={14} />
          {knmps.length} lokasi
        </span>
        <button className="btn-primary" onClick={() => showForm ? setShowForm(false) : openCreate()}
          style={{ height: '40px', fontSize: '13px', padding: '0 16px' }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Batal' : 'Tambah KNMP'}</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="glass-card">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>
              {editId ? 'Edit Lokasi KNMP' : 'Tambah Lokasi KNMP Baru'}
            </h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Nama KNMP</label>
                <input type="text" className="form-input" placeholder="Contoh: KNMP Brondong" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Wilayah/Region</label>
                <select className="form-input" value={form.regionId} required
                  onChange={(e) => setForm({ ...form, regionId: e.target.value })}>
                  <option value="">Pilih wilayah...</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
              <label className="form-label">Alamat Lengkap</label>
              <input type="text" className="form-input" placeholder="Alamat lengkap lokasi KNMP" required
                value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="admin-form-row" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Latitude</label>
                <input type="number" step="any" className="form-input" placeholder="-6.12345" required
                  value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Longitude</label>
                <input type="number" step="any" className="form-input" placeholder="112.67890" required
                  value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}
                style={{ height: '40px', fontSize: '13px', padding: '0 20px' }}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah KNMP')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KNMP Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama KNMP</th>
                <th>Alamat</th>
                <th>Koordinat</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {knmps.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty-state">
                      <MapPin size={32} />
                      <span>Belum ada lokasi KNMP terdaftar.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                knmps.map(k => (
                  <tr key={k.id}>
                    <td style={{ fontWeight: '600' }}>{k.name}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {k.address}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {k.latitude?.toFixed(4)}, {k.longitude?.toFixed(4)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${(k.status || 'normal').toLowerCase()}`}>
                        {k.status || 'NORMAL'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <div className="admin-actions-row" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn-icon" title="Edit KNMP" onClick={() => openEdit(k)}>
                          <Pencil size={15} />
                        </button>
                        <button className="btn-icon danger" title="Hapus KNMP" onClick={() => setDeleteTarget(k)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          title="Hapus Lokasi KNMP"
          message={`Apakah Anda yakin ingin menghapus "${deleteTarget.name}"? Semua data terkait (fasilitas, produksi, distribusi, KPI, health index, dan ranking TOPSIS) akan ikut terhapus secara permanen.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

// ============================================================
// TAB 3: FACILITY MANAGEMENT
// ============================================================
const FacilityManagementTab = ({ knmps }) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKnmpId, setFilterKnmpId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const facilityTypes = ['COLD_STORAGE', 'TPI', 'PABRIK_ES', 'DERMAGA', 'SPBN', 'LAINNYA'];
  const facilityTypeLabels = {
    COLD_STORAGE: 'Cold Storage',
    TPI: 'TPI',
    PABRIK_ES: 'Pabrik Es',
    DERMAGA: 'Dermaga',
    SPBN: 'SPBN',
    LAINNYA: 'Lainnya'
  };

  const emptyForm = { knmpId: '', name: '', type: 'COLD_STORAGE', capacity: '', status: 'ACTIVE' };
  const [form, setForm] = useState(emptyForm);

  const fetchFacilities = async () => {
    try {
      const query = filterKnmpId ? `?knmpId=${filterKnmpId}` : '';
      const res = await API.get(`/admin/facilities${query}`);
      setFacilities(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data fasilitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFacilities();
  }, [filterKnmpId]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, knmpId: filterKnmpId || '' });
    setShowForm(true);
  };

  const openEdit = (facility) => {
    setEditId(facility.id);
    setForm({
      knmpId: facility.knmpId,
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      status: facility.status
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading(editId ? 'Memperbarui fasilitas...' : 'Menambahkan fasilitas...');

    try {
      if (editId) {
        const res = await API.put(`/admin/facilities/${editId}`, {
          name: form.name, type: form.type, capacity: form.capacity, status: form.status
        });
        setFacilities(prev => prev.map(f => f.id === editId ? res.data.facility : f));
        toast.success('Fasilitas berhasil diperbarui.', { id: toastId });
      } else {
        const res = await API.post('/admin/facilities', form);
        setFacilities(prev => [...prev, res.data.facility]);
        toast.success('Fasilitas baru berhasil ditambahkan.', { id: toastId });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan fasilitas.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/admin/facilities/${deleteTarget.id}`);
      setFacilities(prev => prev.filter(f => f.id !== deleteTarget.id));
      toast.success('Fasilitas berhasil dihapus.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus fasilitas.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select className="form-input" value={filterKnmpId}
            onChange={(e) => setFilterKnmpId(e.target.value)}
            style={{ width: '240px', height: '40px', fontSize: '13px' }}>
            <option value="">Semua KNMP</option>
            {knmps.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>
          <span className="admin-stat-pill">
            <Building2 size={14} />
            {facilities.length} fasilitas
          </span>
        </div>
        <button className="btn-primary" onClick={() => showForm ? setShowForm(false) : openCreate()}
          style={{ height: '40px', fontSize: '13px', padding: '0 16px' }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Batal' : 'Tambah Fasilitas'}</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="glass-card">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>
              {editId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              {!editId && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Lokasi KNMP</label>
                  <select className="form-input" value={form.knmpId} required
                    onChange={(e) => setForm({ ...form, knmpId: e.target.value })}>
                    <option value="">Pilih KNMP...</option>
                    {knmps.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Nama Fasilitas</label>
                <input type="text" className="form-input" placeholder="Contoh: Cold Storage Utama" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-row" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Tipe Fasilitas</label>
                <select className="form-input" value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {facilityTypes.map(t => <option key={t} value={t}>{facilityTypeLabels[t]}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Kapasitas (ton/unit)</label>
                <input type="number" step="any" min="0" className="form-input" placeholder="Contoh: 50" required
                  value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}
                style={{ height: '40px', fontSize: '13px', padding: '0 20px' }}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Fasilitas')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Facilities Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
              <span>Memuat data fasilitas...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Fasilitas</th>
                  <th>Lokasi KNMP</th>
                  <th>Tipe</th>
                  <th>Kapasitas</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {facilities.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty-state">
                        <Building2 size={32} />
                        <span>Tidak ada fasilitas ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  facilities.map(f => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: '600' }}>{f.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.knmp?.name || '-'}</td>
                      <td>
                        <span className="admin-stat-pill" style={{
                          background: 'rgba(79, 172, 254, 0.08)',
                          color: 'var(--color-secondary)',
                          borderColor: 'rgba(79, 172, 254, 0.15)'
                        }}>
                          {facilityTypeLabels[f.type] || f.type}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{f.capacity}</td>
                      <td>
                        <span className={`status-badge ${f.status === 'ACTIVE' ? 'normal' : (f.status === 'MAINTENANCE' ? 'warning' : 'kritis')}`}>
                          {f.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div className="admin-actions-row" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn-icon" title="Edit Fasilitas" onClick={() => openEdit(f)}>
                            <Pencil size={15} />
                          </button>
                          <button className="btn-icon danger" title="Hapus Fasilitas" onClick={() => setDeleteTarget(f)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          title="Hapus Fasilitas"
          message={`Apakah Anda yakin ingin menghapus fasilitas "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

// ============================================================
// MAIN ADMIN PANEL PAGE
// ============================================================
const AdminPanel = () => {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState('users');
  const [knmps, setKnmps] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [knmpRes, regionRes] = await Promise.all([
          API.get('/operational/knmps'),
          API.get('/admin/regions')
        ]);
        setKnmps(knmpRes.data);
        setRegions(regionRes.data);
      } catch (err) {
        toast.error('Gagal memuat data awal admin panel.');
      } finally {
        setLoadingInit(false);
      }
    };
    fetchInitialData();
  }, []);

  // Guard: Non-admin users should not see this page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="main-content">
        <Navbar title="Admin Panel" />
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Shield size={48} color="var(--color-critical)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Akses Ditolak</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Halaman ini hanya dapat diakses oleh <strong>Administrator</strong>.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'users', label: 'Manajemen User', icon: Users },
    { key: 'knmps', label: 'Manajemen KNMP', icon: MapPin },
    { key: 'facilities', label: 'Manajemen Fasilitas', icon: Building2 },
  ];

  return (
    <div className="main-content">
      <Navbar title="Admin Panel" />

      {/* Tab Navigation */}
      <div style={tabStyles.tabsContainer}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...tabStyles.tabButton,
                ...(isActive ? tabStyles.tabButtonActive : {})
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loadingInit ? (
        <div className="admin-empty-state">
          <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
          <span>Memuat Admin Panel...</span>
        </div>
      ) : (
        <>
          {activeTab === 'users' && <UserManagementTab knmps={knmps} />}
          {activeTab === 'knmps' && <KnmpManagementTab knmps={knmps} setKnmps={setKnmps} regions={regions} />}
          {activeTab === 'facilities' && <FacilityManagementTab knmps={knmps} />}
        </>
      )}
    </div>
  );
};

const tabStyles = {
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '6px',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabButtonActive: {
    backgroundColor: 'var(--border-glow)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-primary)',
  },
};

export default AdminPanel;
