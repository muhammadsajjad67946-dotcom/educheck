CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  father_name VARCHAR(120) NULL,
  age TINYINT UNSIGNED NULL,
  grade VARCHAR(30) NOT NULL DEFAULT 'Grade 5',
  current_difficulty ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low',
  actual_grade VARCHAR(30) NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_student_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject_id BIGINT UNSIGNED NOT NULL,
  parent_topic_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  parent_topic_key BIGINT UNSIGNED AS (COALESCE(parent_topic_id, 0)) STORED,
  UNIQUE KEY uq_topic_parent_name (subject_id, parent_topic_key, name),
  CONSTRAINT fk_topic_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_chapter_subject_name (subject_id, name),
  CONSTRAINT fk_chapter_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subtopics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chapter_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_subtopic_chapter_name (chapter_id, name),
  CONSTRAINT fk_subtopic_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  subtopic_id BIGINT UNSIGNED NULL,
  subtopic_name VARCHAR(160) NULL,
  question_text TEXT NOT NULL,
  grade TINYINT UNSIGNED NOT NULL,
  difficulty ENUM('Low', 'Medium', 'High') NOT NULL,
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  explanation TEXT NULL,
  status ENUM('active', 'draft', 'archived') NOT NULL DEFAULT 'active',
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_question_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT fk_question_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT fk_question_subtopic FOREIGN KEY (subtopic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT fk_question_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT fk_question_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_question_filter (grade, difficulty, status)
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  started_at DATETIME NULL,
  submitted_at DATETIME NULL,
  total_questions SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  correct_answers SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  wrong_answers SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  score DECIMAL(8,2) NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  estimated_grade VARCHAR(30) NULL,
  status ENUM('in_progress', 'submitted', 'abandoned') NOT NULL DEFAULT 'in_progress',
  difficulty_level ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low',
  CONSTRAINT fk_attempt_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_attempt_student (student_id, submitted_at)
);

CREATE TABLE IF NOT EXISTS attempt_questions (
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attempt_id, question_id),
  KEY idx_attempt_questions_attempt (attempt_id),
  CONSTRAINT fk_attempt_question_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_attempt_question_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempt_answers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  selected_answer ENUM('A', 'B', 'C', 'D') NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at DATETIME NULL,
  UNIQUE KEY uq_attempt_question (attempt_id, question_id),
  CONSTRAINT fk_answer_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  overall_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  grade_letter VARCHAR(5) NULL,
  strong_topics LONGTEXT NULL,
  weak_topics LONGTEXT NULL,
  topic_breakdown LONGTEXT NULL,
  recommendations LONGTEXT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reports_assessment_id (assessment_id),
  KEY idx_reports_student_id (student_id),
  CONSTRAINT fk_report_attempt FOREIGN KEY (assessment_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  stripe_payment_id VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
  status ENUM('pending', 'completed', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  description TEXT NULL,
  payment_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payments_stripe_payment_id (stripe_payment_id),
  KEY idx_payments_user_id (user_id),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  plan_name VARCHAR(120) NOT NULL,
  stripe_subscription_id VARCHAR(255) NULL,
  price DECIMAL(10,2) NOT NULL,
  start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  KEY idx_subscriptions_user (user_id),
  KEY idx_subscriptions_active (user_id, is_active, end_date),
  CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_feedback_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'resolved', 'archived') NOT NULL DEFAULT 'new',
  admin_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_status_created (status, created_at),
  INDEX idx_contact_email (email),
  CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO subjects (name, description) VALUES
  ('Math', 'Mathematics'), ('Science', 'General Science'), ('English', 'English Language'), ('History', 'World History');

INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
  ('Admin', 'admin@educheck.com', '$2b$12$9rrPfz.0noeC0idIC1zDXuCdGFOvIpOannaJrwFxUMZUTY0EDSKDi', 'admin');
