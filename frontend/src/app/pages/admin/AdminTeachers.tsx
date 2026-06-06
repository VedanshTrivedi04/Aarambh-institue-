import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, BarChart, Upload } from "lucide-react";
import api from "../../../lib/api";

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showEditTeacher, setShowEditTeacher] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', username: '', password: '', qualification: '', specialization: ''
  });
  
  const [editFormData, setEditFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', qualification: '', specialization: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [editFormStatus, setEditFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users/?role=teacher');
      const payload = res.data.data !== undefined ? res.data.data : res.data;
      const data = Array.isArray(payload) ? payload : (payload?.results || []);
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*.,?+-]/.test(password)) return 'Password must contain at least one special character.';
    return '';
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pwdErr = validatePassword(formData.password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      return;
    }
    setPasswordError('');
    setIsSubmitting(true);
    setFormStatus('');
    
    try {
      await api.post('/users/create-teacher/', formData);
      setFormStatus('success:Teacher created successfully!');
      fetchTeachers();
      setTimeout(() => {
        setShowAddTeacher(false);
        setFormStatus('');
        setFormData({
          first_name: '', last_name: '', email: '', phone: '', username: '', password: '', qualification: '', specialization: ''
        });
      }, 1500);
    } catch (error: any) {
      setFormStatus('error:' + (error.response?.data?.detail || 'Failed to create teacher.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    
    setIsSubmitting(true);
    setEditFormStatus('');
    
    try {
      await api.patch(`/users/${selectedTeacher.id}/update-teacher/`, editFormData);
      setEditFormStatus('success:Teacher updated successfully!');
      fetchTeachers();
      setTimeout(() => {
        setShowEditTeacher(false);
        setEditFormStatus('');
        setSelectedTeacher(null);
      }, 1500);
    } catch (error: any) {
      setEditFormStatus('error:' + (error.response?.data?.detail || 'Failed to update teacher.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (teacher: any) => {
    setSelectedTeacher(teacher);
    setEditFormData({
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      qualification: teacher.teacher_profile?.qualification || '',
      specialization: teacher.teacher_profile?.specialization || ''
    });
    setEditFormStatus('');
    setShowEditTeacher(true);
  };

  const openAnalyticsModal = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowAnalytics(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const downloadSampleCSV = (e: React.MouseEvent) => {
    e.preventDefault();
    const headers = ["Name", "Email", "Phone", "Qualification", "Specialization"];
    const sampleData = ["Jane Smith", "jane.smith@example.com", "9876543211", "M.Sc Mathematics", "Calculus"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.join(",");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "teacher_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleBulkUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please select a CSV file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        if (lines.length < 2) {
          setUploadStatus('File is empty or missing data.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
          });
          return obj;
        });

        setUploadStatus('Uploading...');
        const res = await api.post('/users/bulk-upload-teachers/', data);
        setUploadStatus(res.data.detail || 'Upload successful!');
        if (res.data.errors && res.data.errors.length > 0) {
          setUploadStatus(`Uploaded ${res.data.created_count} teachers. Errors: \n` + res.data.errors.join('\n'));
        }
        
        if (res.data.created_count > 0) {
           setSelectedFile(null);
           fetchTeachers();
        }
      } catch (error: any) {
        setUploadStatus(error.response?.data?.detail || 'An error occurred during upload.');
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Teacher Management</h1>
          <p className="text-gray-500 text-sm">Manage faculty and instructors</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
               setShowBulkUpload(!showBulkUpload);
               setShowAddTeacher(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
               setShowAddTeacher(true);
               setShowBulkUpload(false);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all"
            style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Add Teacher Modal (Hover Card) */}
      {showAddTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Add New Teacher</h3>
              <button 
                onClick={() => setShowAddTeacher(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Defaults to Email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 transition-colors ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'}`} />
                    {passwordError && <p className="text-red-500 text-xs mt-1.5 font-medium">{passwordError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. M.Sc Mathematics" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="e.g. Calculus" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </div>
                
                {formStatus && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${formStatus.startsWith('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {formStatus.replace('success:', '').replace('error:', '')}
                  </div>
                )}
                
                <div className="flex justify-end pt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTeacher(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bulk Upload Teachers</h3>
          <label className="block border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 text-center mb-4 transition-colors hover:border-orange-300 cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">
              {selectedFile ? `Selected File: ${selectedFile.name}` : "Click to browse CSV file here"}
            </p>
            <p className="text-gray-500 text-sm">CSV must have columns: Name, Email, Phone, Qualification, Specialization</p>
          </label>
          {uploadStatus && (
            <div className="mb-4 p-3 rounded-lg bg-orange-50 text-orange-800 text-sm whitespace-pre-wrap font-medium">
              {uploadStatus}
            </div>
          )}
          <div className="flex items-center justify-between">
            <a 
              href="#" 
              onClick={downloadSampleCSV}
              className="text-orange-600 hover:text-orange-700 text-sm font-semibold transition-colors"
            >
              Download Sample CSV Template →
            </a>
            <button
              onClick={handleBulkUpload}
              className="px-5 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
              disabled={!selectedFile}
            >
              Upload & Create Accounts
            </button>
          </div>
        </motion.div>
      )}

      {/* Teacher Cards Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Loading teachers...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-medium">No teachers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => {
            const initials = (teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '');
            return (
              <motion.div
                key={teacher.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-300 transition-all shadow-sm border-t-4 border-t-orange-500"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-sm">
                    {initials || "T"}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg">{teacher.first_name} {teacher.last_name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                      {teacher.email}
                    </span>
                  </div>
                </div>

                {/* Qualification */}
                <p className="text-gray-600 text-sm mb-4 font-medium">Joined: {new Date(teacher.date_joined).toLocaleDateString()}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
                  <div className="text-center">
                    <div className="text-gray-900 font-bold text-lg">0</div>
                    <div className="text-gray-500 text-xs font-medium">Notes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-bold text-lg">0</div>
                    <div className="text-gray-500 text-xs font-medium">Batches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-bold text-lg">N/A</div>
                    <div className="text-gray-500 text-xs font-medium">Rating</div>
                  </div>
                </div>

                {/* Last Active */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Active User</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => openAnalyticsModal(teacher)} className="flex-1 px-3 py-2 rounded-lg text-orange-600 hover:text-orange-700 transition-colors text-sm font-bold border border-gray-200 hover:bg-gray-50 shadow-sm">
                    View Analytics
                  </button>
                  <button onClick={() => openEditModal(teacher)} className="flex-1 px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 transition-colors text-sm font-bold border border-gray-200 hover:bg-gray-50 shadow-sm">
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacher && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Edit Teacher Profile</h3>
              <button 
                onClick={() => setShowEditTeacher(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleEditTeacher} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required type="text" name="first_name" value={editFormData.first_name} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required type="text" name="last_name" value={editFormData.last_name} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" name="phone" value={editFormData.phone} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input type="text" name="qualification" value={editFormData.qualification} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input type="text" name="specialization" value={editFormData.specialization} onChange={handleEditInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </div>
                
                {editFormStatus && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${editFormStatus.startsWith('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {editFormStatus.replace('success:', '').replace('error:', '')}
                  </div>
                )}
                
                <div className="flex justify-end pt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditTeacher(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Performance Analytics</h3>
              <button 
                onClick={() => setShowAnalytics(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-sm">
                  {(selectedTeacher.first_name?.[0] || '') + (selectedTeacher.last_name?.[0] || '') || "T"}
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">{selectedTeacher.first_name} {selectedTeacher.last_name}</h4>
                  <p className="text-gray-500 text-sm font-medium">{selectedTeacher.teacher_profile?.specialization || 'General Faculty'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div className="text-orange-500 mb-1">
                    <BarChart className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">98%</div>
                  <div className="text-gray-600 text-sm font-medium">Student Satisfaction</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="text-blue-500 mb-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-2xl font-black text-gray-900">24</div>
                  <div className="text-gray-600 text-sm font-medium">Total Batches</div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="text-green-500 mb-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-black text-gray-900">100%</div>
                  <div className="text-gray-600 text-sm font-medium">Syllabus Completion</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="text-purple-500 mb-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-black text-gray-900">4.9</div>
                  <div className="text-gray-600 text-sm font-medium">Average Rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
