/*
  # Create new_questions table and RLS policies

  This migration sets up the `new_questions` table for storing AI-generated questions
  and establishes Row Level Security (RLS) for all relevant tables.

  1.  **New Tables:**
      - `new_questions`: Stores generated questions with details like statement, options, type, answer, solution, and links to topic, exam, course, etc.
  2.  **Security:**
      - Enable RLS for `new_questions`, `questions_topic_wise`, `exams`, `courses`, `subjects`, `units`, `chapters`, `topics`, `parts`, `slots`.
      - Add `SELECT` policies for authenticated users on all lookup tables.
      - Add `INSERT` and `SELECT` policies for authenticated users on `new_questions` to manage their own generated content.
*/

-- Create the new_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS new_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exam_id uuid NOT NULL, -- Assuming FK to exams.id, but not explicitly added to avoid issues if table structure differs
  course_id uuid NOT NULL, -- Assuming FK to courses.id
  subject_id uuid NOT NULL, -- Assuming FK to subjects.id
  unit_id uuid NOT NULL, -- Assuming FK to units.id
  chapter_id uuid NOT NULL, -- Assuming FK to chapters.id
  topic_id uuid NOT NULL, -- Assuming FK to topics.id
  part_id uuid, -- Assuming FK to parts.id, nullable
  slot_id uuid, -- Assuming FK to slots.id, nullable
  question_statement text NOT NULL,
  options jsonb, -- For MCQ/MSQ, null for NAT/SUB
  question_type text NOT NULL, -- 'MCQ', 'MSQ', 'NAT', 'SUB'
  answer text NOT NULL, -- String for MCQ/NAT/SUB, JSONB for MSQ (e.g., '["Option A", "Option C"]')
  solution text,
  generated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security for new_questions
ALTER TABLE new_questions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to insert their own questions
CREATE POLICY "Authenticated users can insert their own new questions"
ON new_questions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to select their own questions
CREATE POLICY "Authenticated users can view their own new questions"
ON new_questions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Enable RLS and add SELECT policies for existing lookup tables
-- Note: These policies assume the tables already exist as per user's description.
-- If these tables do not exist, the ALTER TABLE statements will fail.

-- exams table
ALTER TABLE IF EXISTS exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view exams" ON exams FOR SELECT TO authenticated USING (true);

-- courses table
ALTER TABLE IF EXISTS courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view courses" ON courses FOR SELECT TO authenticated USING (true);

-- subjects table
ALTER TABLE IF EXISTS subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view subjects" ON subjects FOR SELECT TO authenticated USING (true);

-- units table
ALTER TABLE IF EXISTS units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view units" ON units FOR SELECT TO authenticated USING (true);

-- chapters table
ALTER TABLE IF EXISTS chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view chapters" ON chapters FOR SELECT TO authenticated USING (true);

-- topics table
ALTER TABLE IF EXISTS topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view topics" ON topics FOR SELECT TO authenticated USING (true);

-- parts table
ALTER TABLE IF EXISTS parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view parts" ON parts FOR SELECT TO authenticated USING (true);

-- slots table
ALTER TABLE IF EXISTS slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view slots" ON slots FOR SELECT TO authenticated USING (true);

-- questions_topic_wise table (for PYQs)
ALTER TABLE IF EXISTS questions_topic_wise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view previous year questions" ON questions_topic_wise FOR SELECT TO authenticated USING (true);