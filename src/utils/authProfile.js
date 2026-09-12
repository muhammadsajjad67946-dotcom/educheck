export function buildStudentRegistrationProfile(currentUser, account, form) {
  return {
    ...currentUser,
    id: account?.id ?? currentUser?.id,
    name: form.name,
    email: form.email,
    fatherName: form.fatherName,
    age: form.age,
    grade: form.grade,
    actualGrade: account?.actualGrade ?? '',
    role: 'student',
  }
}
