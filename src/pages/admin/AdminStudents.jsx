import { useState, useMemo, useEffect } from 'react'
import { Search, Eye, Trash2, Plus, Users, X, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../utils/api'

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
        <Users size={32} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No students found</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
    </div>
  )
}

export default function AdminStudents() {
  const navigate = useNavigate()
  const { setUser, setAuthenticated, darkMode } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [students, setStudents] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 'Grade 6',
    status: 'Active',
  })

  useEffect(() => {
    apiRequest('/admin/students')
      .then(setStudents)
      .catch((error) => setFormError(error.message))
  }, [])

  const filteredStudents = useMemo(() => {
    let result = [...students]

    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterGrade !== 'All') {
      result = result.filter((s) => s.grade === filterGrade)
    }

    if (filterStatus !== 'All') {
      result = result.filter((s) => s.status === filterStatus)
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'score') return b.avgScore - a.avgScore
      if (sortBy === 'tests') return b.tests - a.tests
      return 0
    })

    return result
  }, [students, searchTerm, filterGrade, filterStatus, sortBy])

  const getStatusColor = (status) => {
    return status === 'Active'
      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
  }

  const handleAddStudent = (event) => {
    event.preventDefault()

    const email = formData.email.trim().toLowerCase()

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    if (students.some((student) => student.email.toLowerCase() === email)) {
      setFormError('A student with this email already exists.')
      return
    }

    apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify({ name: formData.name, email, password: formData.password, grade: formData.grade, status: formData.status }),
    })
      .then((newStudent) => {
        setStudents((prev) => [newStudent, ...prev])
        setFormData({ name: '', email: '', password: '', confirmPassword: '', grade: 'Grade 6', status: 'Active' })
        setFormError('')
        setShowAddModal(false)
      })
      .catch((error) => setFormError(error.message))
  }

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId))
  }

  const handleStartStudentTest = (student) => {
    setUser({
      name: student.name,
      email: student.email,
      fatherName: '',
      age: '',
      grade: student.grade,
      actualGrade: student.grade,
      role: 'student',
    })
    setAuthenticated(true)
    navigate('/start-test')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Students</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Manage all registered students and their academic profiles</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Grades</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden backdrop-blur-sm">
        {filteredStudents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tests</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-bold text-sm shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">{student.grade}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{student.tests}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-800/50 px-3 py-1 font-bold text-sky-700 dark:text-sky-300 text-sm">
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{student.joinedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartStudentTest(student)}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 transition"
                          title="Start test"
                        >
                          <PlayCircle size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                          title="View student"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition"
                          title="Delete student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredStudents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredStudents.length}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{students.length}</span> students
          </p>
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 dark:border-slate-700/80 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Previous
            </button>
            <button className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">1</button>
            <button className="rounded-xl border border-slate-200 dark:border-slate-700/80 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Next
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Student</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="e.g. Ayesha Khan"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="student@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <input
                    type="password"
                    minLength="6"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                  <input
                    type="password"
                    minLength="6"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Repeat password"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

              </div>

              {formError && <p className="text-sm font-medium text-red-500">{formError}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student View Details Modal - Simple, Attractive & Light */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Avatar & Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-bold text-base shadow-md shadow-sky-500/20">
                  {selectedStudent.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedStudent.grade}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tests</span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">{selectedStudent.tests || 0}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Score</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedStudent.avgScore || 0}%</span>
              </div>
            </div>

            {/* Info Details List */}
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 px-3.5 py-1 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(selectedStudent.status)}`}>
                  {selectedStudent.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Joined Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedStudent.joinedDate || 'Recent'}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Curriculum</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Adaptive Math</span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
