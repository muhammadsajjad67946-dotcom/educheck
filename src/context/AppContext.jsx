import { createContext, useContext, useEffect, useState } from 'react'
import { getInitialDarkMode, applyTheme, THEME_STORAGE_KEY } from '../utils/theme'
import { getUserStorageKey } from '../utils/userStorage'

const AppContext = createContext(null)
const PAYMENT_STATUS_STORAGE_KEY = 'educheck_paymentStatus_v2'
const PAYMENT_ID_STORAGE_KEY = 'educheck_paymentId_v2'

const defaultUser = {
  name: 'Haroon',
  email: 'haroon@student.educheck.com',
  fatherName: '',
  age: '',
  grade: 'Grade 6',
  actualGrade: '',
  role: 'student',
}

function readStoredAssessment(baseKey, account) {
  const candidateKeys = [
    getUserStorageKey(baseKey, account),
    account?.email ? getUserStorageKey(baseKey, { email: account.email }) : null,
    baseKey,
  ].filter(Boolean)

  for (const key of candidateKeys) {
    const storedValue = localStorage.getItem(key)
    if (storedValue) return JSON.parse(storedValue)
  }

  return null
}

const defaultTestState = {
  currentQuestion: 0,
  answers: {},
  score: 0,
  questions: [],
  adaptiveState: null,
  testKey: '',
  retakeMode: false,
  focusTopics: [],
  startFresh: false,  // Flag to force fresh question generation on retake
}

function getPaymentStorageKey(baseKey, account) {
  return getUserStorageKey(baseKey, account || defaultUser)
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('educheck_user')
      const parsedUser = storedUser ? JSON.parse(storedUser) : null
      return parsedUser ? { ...defaultUser, ...parsedUser } : defaultUser
    } catch (error) {
      console.error('Failed to parse stored user:', error)
      return defaultUser
    }
  })
  const [authenticated, setAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('educheck_authenticated')
    return storedAuth === 'true'
  })
  const [paymentStatus, setPaymentStatus] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('educheck_user') || 'null')
      return localStorage.getItem(getPaymentStorageKey(PAYMENT_STATUS_STORAGE_KEY, storedUser)) || 'pending'
    } catch (error) {
      return 'pending'
    }
  })
  const [paymentId, setPaymentId] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('educheck_user') || 'null')
      return localStorage.getItem(getPaymentStorageKey(PAYMENT_ID_STORAGE_KEY, storedUser)) || ''
    } catch (error) {
      return ''
    }
  })
  const [feedback, setFeedback] = useState([])
  const [testState, setTestState] = useState(defaultTestState)
  const [assessmentResult, setAssessmentResult] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('educheck_user') || 'null')
      return readStoredAssessment('educheck_assessmentResult', storedUser || defaultUser)
    } catch (error) {
      console.error('Failed to parse stored assessment result:', error)
      return null
    }
  })
  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('educheck_user') || 'null')
      return readStoredAssessment('educheck_assessmentHistory', storedUser || defaultUser) || []
    } catch (error) {
      console.error('Failed to parse stored assessment history:', error)
      return []
    }
  })
  const [pendingRetake, setPendingRetake] = useState(() => localStorage.getItem('educheck_pendingRetake') === 'true')
  const [darkMode, setDarkMode] = useState(() => getInitialDarkMode())

  useEffect(() => {
    applyTheme(darkMode)
    localStorage.setItem(THEME_STORAGE_KEY, String(darkMode))
  }, [darkMode])

  useEffect(() => {
    const storedStatus = localStorage.getItem(getPaymentStorageKey(PAYMENT_STATUS_STORAGE_KEY, user)) || 'pending'
    const storedId = localStorage.getItem(getPaymentStorageKey(PAYMENT_ID_STORAGE_KEY, user)) || ''
    setPaymentStatus(storedStatus)
    setPaymentId(storedId)
  }, [user.id, user.email])

  useEffect(() => {
    localStorage.setItem('educheck_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    try {
      setAssessmentResult(readStoredAssessment('educheck_assessmentResult', user))
      setAssessmentHistory(readStoredAssessment('educheck_assessmentHistory', user) || [])
    } catch (error) {
      console.error('Failed to load user assessment data:', error)
      setAssessmentResult(null)
      setAssessmentHistory([])
    }
  }, [user.id, user.email])

  useEffect(() => {
    localStorage.setItem('educheck_authenticated', String(authenticated))
  }, [authenticated])

  useEffect(() => {
    localStorage.setItem(getPaymentStorageKey(PAYMENT_STATUS_STORAGE_KEY, user), paymentStatus)
  }, [paymentStatus, user])

  useEffect(() => {
    const paymentIdKey = getPaymentStorageKey(PAYMENT_ID_STORAGE_KEY, user)
    if (paymentId) {
      localStorage.setItem(paymentIdKey, paymentId)
    } else {
      localStorage.removeItem(paymentIdKey)
    }
  }, [paymentId, user])

  useEffect(() => {
    localStorage.setItem('educheck_pendingRetake', String(pendingRetake))
  }, [pendingRetake])

  const resetAppState = () => {
    const resultKey = getUserStorageKey('educheck_assessmentResult', user)
    const historyKey = getUserStorageKey('educheck_assessmentHistory', user)
    setUser(defaultUser)
    setAuthenticated(false)
    setPaymentStatus('pending')
    setPaymentId('')
    setFeedback([])
    setTestState(defaultTestState)
    setAssessmentResult(null)
    setAssessmentHistory([])
    setPendingRetake(false)
    localStorage.removeItem('educheck_user')
    localStorage.removeItem('educheck_authenticated')
    localStorage.removeItem(getPaymentStorageKey(PAYMENT_STATUS_STORAGE_KEY, user))
    localStorage.removeItem(getPaymentStorageKey(PAYMENT_ID_STORAGE_KEY, user))
    localStorage.removeItem(resultKey)
    localStorage.removeItem(historyKey)
    localStorage.removeItem('educheck_pendingRetake')
  }

  const updateProfile = (updates) => {
    setUser((prev) => ({
      ...defaultUser,
      ...prev,
      ...updates,
      role: updates.role ?? prev.role ?? 'student',
    }))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authenticated,
        setAuthenticated,
        paymentStatus,
        setPaymentStatus,
        paymentId,
        setPaymentId,
        feedback,
        setFeedback,
        testState,
        setTestState,
        assessmentResult,
        setAssessmentResult,
        assessmentHistory,
        setAssessmentHistory,
        pendingRetake,
        setPendingRetake,
        darkMode,
        setDarkMode,
        resetAppState,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }

  return context
}
