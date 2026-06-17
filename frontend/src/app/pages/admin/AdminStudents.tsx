import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, Plus, Search, Filter } from "lucide-react";
import api from "../../../lib/api";

export function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', username: '', password: '', class_grade: '10', batch: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users/?role=student');
      const payload = res.data.data !== undefined ? res.data.data : res.data;
      const data = Array.isArray(payload) ? payload : (payload?.results || []);
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const name = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (student.phone && student.phone.includes(searchTerm));
    
    const sClass = student.student_profile?.class_grade || "N/A";
    const matchesClass = selectedClass === "all" || sClass === selectedClass;

    return matchesSearch && matchesClass;
  });

  const downloadSampleCSV = (e: React.MouseEvent) => {
    e.preventDefault();
    const headers = ["Name", "Email", "Phone", "Batch", "Class", "FeeStatus"];
    const sampleData = ["John Doe", "john.doe@example.com", "9876543210", "Batch A", "10", "Paid"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.join(",");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_upload_template.csv");
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
        const res = await api.post('/users/bulk-upload/', data);
        setUploadStatus(res.data.detail || 'Upload successful!');
        if (res.data.errors && res.data.errors.length > 0) {
          setUploadStatus(`Uploaded ${res.data.created_count} students. Errors: \n` + res.data.errors.join('\n'));
        }
        
        if (res.data.created_count > 0) {
           setSelectedFile(null);
           fetchStudents(); // Refresh the list
        }
      } catch (error: any) {
        setUploadStatus(error.response?.data?.detail || 'An error occurred during upload.');
      }
    };
    reader.readAsText(selectedFile);
  };

  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*.,?+-]/.test(password)) return 'Password must contain at least one special character.';
    return '';
  };

  const handleAddStudent = async (e: React.FormEvent) => {
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
      await api.post('/users/create-student/', formData);
      setFormStatus('success:Student created successfully!');
      fetchStudents();
      setTimeout(() => {
        setShowAddStudent(false);
        setFormStatus('');
        setFormData({
          first_name: '', last_name: '', email: '', phone: '', username: '', password: '', class_grade: '10', batch: ''
        });
      }, 1500);
    } catch (error: any) {
      setFormStatus('error:' + (error.response?.data?.detail || 'Failed to create student.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordError(''); // clear error when typing
    }
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
          <h1 className="text-2xl font-black text-gray-900 mb-1">Student Management</h1>
          <p className="text-gray-500 text-sm">Manage all enrolled students</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
               setShowBulkUpload(!showBulkUpload);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
               setShowAddStudent(true);
               setShowBulkUpload(false);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/40 transition-all"
            style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Add Student Modal (Hover Card) */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Add New Student</h3>
              <button 
                onClick={() => setShowAddStudent(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Defaults to Email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 transition-colors ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-red-600 focus:ring-red-600/20'}`} />
                    {passwordError && <p className="text-red-500 text-xs mt-1.5 font-medium">{passwordError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Grade</label>
                    <select name="class_grade" value={formData.class_grade} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20">
                      <option value="10">10th</option>
                      <option value="11">11th</option>
                      <option value="12">12th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <select name="batch" value={formData.batch} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20">
                      <option value="">Select a Batch</option>
                      <option value="Morning Batch">Morning Batch</option>
                      <option value="Evening Batch">Evening Batch</option>
                      <option value="Weekend Batch">Weekend Batch</option>
                      <option value="Crash Course">Crash Course</option>
                    </select>
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
                    onClick={() => setShowAddStudent(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all disabled:opacity-50"
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
          className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bulk Upload Students</h3>
          <label className="block border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 text-center mb-4 transition-colors hover:border-red-300 cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">
              {selectedFile ? `Selected File: ${selectedFile.name}` : "Click to browse CSV file here"}
            </p>
            <p className="text-gray-500 text-sm">CSV must have columns: Name, Email, Phone, Batch, Class, FeeStatus</p>
          </label>
          {uploadStatus && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-900 text-sm whitespace-pre-wrap font-medium">
              {uploadStatus}
            </div>
          )}
          <div className="flex items-center justify-between">
            <a 
              href="#" 
              onClick={downloadSampleCSV}
              className="text-red-700 hover:text-red-800 text-sm font-semibold transition-colors"
            >
              Download Sample CSV Template →
            </a>
            <button
              onClick={handleBulkUpload}
              className="px-5 py-2.5 rounded-xl font-semibold text-white shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
              disabled={!selectedFile}
            >
              Upload & Create Accounts
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm cursor-pointer"
        >
          <option value="all">All Classes</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Student</th>
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Phone</th>
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Class</th>
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Joined</th>
                <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 font-medium">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 font-medium">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => {
                  const initials = (student.first_name?.[0] || '') + (student.last_name?.[0] || '');
                  return (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                            {initials || "ST"}
                          </div>
                          <span className="text-gray-900 font-bold">{student.first_name} {student.last_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm font-medium">{student.email || "N/A"}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm font-medium">{student.phone || "N/A"}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm font-medium">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-md text-gray-700">
                          Class {student.student_profile?.class_grade || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm font-medium">{new Date(student.date_joined).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <button className="text-red-700 hover:text-red-800 transition-colors text-sm font-bold">
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-gray-500 text-sm font-medium">
            Showing <span className="text-gray-900 font-bold">{filteredStudents.length}</span> of <span className="text-gray-900 font-bold">{students.length}</span> students
          </div>
        </div>
      </div>
    </motion.div>
  );
}

