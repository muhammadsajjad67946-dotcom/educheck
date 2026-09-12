export function getStudentCountSql() {
  return "SELECT COUNT(*) AS total FROM users WHERE role = 'student'"
}

export async function getStudentCount(pool) {
  const [rows] = await pool.query(getStudentCountSql())
  return Number(rows[0]?.total || 0)
}
