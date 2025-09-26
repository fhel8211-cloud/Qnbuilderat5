/*
  # Fix for "column user_id does not exist" error in new_questions table and RLS policies

  This migration addresses the `column "user_id" does not exist` error by ensuring
  the `new_questions` table and its `user_id` column are correctly created or altered
  before applying RLS policies.

  1.  **Table/Column Check & Creation:**
      - Create `new_questions` table if it doesn't exist.
      - Add `user_id` column to `new_questions` if it doesn't exist.
  2.  **Security:**
      - Enable RLS for `new_questions`, `questions_topic_wise`, `exams`, `courses`, `subjects`, `units`, `chapters`, `topics`, `parts`, `slots`.
      - Add `SELECT` policies for authenticated users on all lookup tables.
      - Add `INSERT` and `SELECT` policies for authenticated users on `new_questions` to manage their own generated content.
*/

-- Ensure the new_questions table exists and has the user_id column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'new_questions') THEN
    -- Create the new_questions table if it doesn't exist
    CREATE TABLE public.new_questions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      exam_id uuid NOT NULL,
      course_id uuid NOT NULL,
      subject_id uuid NOT NULL,
      unit_id uuid NOT NULL,
      chapter_id uuid NOT NULL,
      topic_id uuid NOT NULL,
      part_id uuid,
      slot_id uuid,
      question_statement text NOT NULL,
      options jsonb,
      question_type text NOT NULL,
      answer text NOT NULL,
      solution text,
      generated_at timestamptz DEFAULT now()
    );
  ELSE
    -- If table exists, check if user_id column exists and add it if not
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'new_questions' AND column_name = 'user_id') THEN
      ALTER TABLE public.new_questions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;
    END IF;
  END IF;
END
$$;

-- Enable Row Level Security for new_questions
ALTER TABLE public.new_questions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to insert their own questions
CREATE POLICY "Authenticated users can insert their own new questions"
ON public.new_questions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to select their own questions
ON public.new_questions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Enable RLS and add SELECT policies for existing lookup tables
-- Note: These policies assume the tables already exist as per user's description.
-- If these tables do not exist, the ALTER TABLE statements will fail.

-- exams table
ALTER TABLE IF EXISTS public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view exams" ON public.exams FOR SELECT TO authenticated USING (true);

-- courses table
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view courses" ON public.courses FOR SELECT TO authenticated USING (true);

-- subjects table
ALTER TABLE IF EXISTS public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);

-- units table
ALTER TABLE IF EXISTS public.units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view units" ON public.units FOR SELECT TO authenticated USING (true);

-- chapters table
ALTER TABLE IF EXISTS public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view chapters" ON public.chapters FOR SELECT TO authenticated USING (true);

-- topics table
ALTER TABLE IF EXISTS public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view topics" ON public.topics FOR SELECT TO authenticated USING (true);

-- parts table
ALTER TABLE IF EXISTS public.parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view parts" ON public.parts FOR SELECT TO authenticated USING (true);

-- slots table
ALTER TABLE IF EXISTS public.slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view slots" ON public.slots FOR SELECT TO authenticated USING (true);

-- questions_topic_wise table (for PYQs)
ALTER TABLE IF EXISTS public.questions_topic_wise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view previous year questions" ON public.questions_topic_wise FOR SELECT TO authenticated USING (true);