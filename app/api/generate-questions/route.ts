import { NextResponse } from 'next/server';
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { model } from '@/lib/gemini';

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      examId,
      courseId,
      subjectId,
      unitId,
      chapterId,
      topicId,
      partId,
      slotId,
      examName,
      courseName,
      subjectName,
      unitName,
      chapterName,
      topicName,
      partName,
      slotName,
      questionType,
      numberOfQuestions,
    } = await req.json();

    if (!examId || !courseId || !subjectId || !unitId || !chapterId || !topicId || !questionType || !numberOfQuestions) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Fetch Previous Year Questions (PYQs)
    let pyqsQuery = supabase
      .from('questions_topic_wise')
      .select('question_statement, options, question_type, answer, solution')
      .eq('topic_id', topicId)
      .eq('course_id', courseId)
      .eq('exam_id', examId);

    if (partId) {
      pyqsQuery = pyqsQuery.eq('part_id', partId);
    }
    if (slotId) {
      pyqsQuery = pyqsQuery.eq('slot_id', slotId);
    }

    const { data: pyqs, error: pyqsError } = await pyqsQuery;

    if (pyqsError) {
      console.error('Error fetching PYQs:', pyqsError);
      return NextResponse.json({ error: 'Failed to fetch previous year questions' }, { status: 500 });
    }

    // 2. Fetch Already Generated Questions
    let existingQuestionsQuery = supabase
      .from('new_questions')
      .select('question_statement, options, question_type, answer, solution')
      .eq('topic_id', topicId)
      .eq('user_id', userId); // Only fetch user's own generated questions

    if (partId) {
      existingQuestionsQuery = existingQuestionsQuery.eq('part_id', partId);
    }
    if (slotId) {
      existingQuestionsQuery = existingQuestionsQuery.eq('slot_id', slotId);
    }

    const { data: existingQuestions, error: existingQuestionsError } = await existingQuestionsQuery;

    if (existingQuestionsError) {
      console.error('Error fetching existing questions:', existingQuestionsError);
      return NextResponse.json({ error: 'Failed to fetch existing generated questions' }, { status: 500 });
    }

    // 3. Construct AI Prompt
    let prompt = `You are an expert question generator for competitive exams. Your task is to create high-quality, challenging questions that are highly likely to appear in exams, similar to or more difficult than the provided previous year questions (PYQs).

**Context:**
- Exam: ${examName}
- Course: ${courseName}
- Subject: ${subjectName}
- Unit: ${unitName}
- Chapter: ${chapterName}
- Topic: ${topicName}
- Question Type: ${questionType}
- Number of Questions to Generate: ${numberOfQuestions}`;

    if (partName) {
      prompt += `\n- Part: ${partName}`;
    }
    if (slotName) {
      prompt += `\n- Slot: ${slotName}`;
    }

    prompt += `\n\n**Previous Year Questions (PYQs) for this Topic (Reference for style, difficulty, and important concepts):**\n`;
    if (pyqs && pyqs.length > 0) {
      pyqs.forEach((q, index) => {
        prompt += `\n${index + 1}. Question: ${q.question_statement}\n`;
        if (q.options) prompt += `   Options: ${JSON.stringify(q.options)}\n`;
        prompt += `   Answer: ${JSON.stringify(q.answer)}\n`;
        if (q.solution) prompt += `   Solution: ${q.solution}\n`;
      });
    } else {
      prompt += `No specific PYQs found for this topic. Generate questions based on general importance for the given context.\n`;
    }

    prompt += `\n**Already Generated Questions for this Topic (DO NOT repeat similar questions or concepts):**\n`;
    if (existingQuestions && existingQuestions.length > 0) {
      existingQuestions.forEach((q, index) => {
        prompt += `\n${index + 1}. Question: ${q.question_statement}\n`;
        if (q.options) prompt += `   Options: ${JSON.stringify(q.options)}\n`;
        prompt += `   Answer: ${JSON.stringify(q.answer)}\n`;
      });
    } else {
      prompt += `No previously generated questions found for this topic.\n`;
    }

    prompt += `\n**Instructions:**
1.  Generate ${numberOfQuestions} new, unique questions of type ${questionType}.
2.  The questions should be at the same or higher difficulty level than the provided PYQs.
3.  Focus on concepts and problem-solving patterns that have a high probability of repeating in the exam.
4.  Ensure the questions are clear, unambiguous, and well-formed.
5.  For MCQ/MSQ, provide 4-5 distinct options. For MSQ, clearly indicate multiple correct options.
6.  For NAT, specify the expected numerical answer format (e.g., "answer to two decimal places").
7.  For SUB, provide a clear question statement.
8.  Provide a detailed solution for each question, explaining the steps and reasoning.
9.  The output MUST be a JSON array of objects, where each object represents a question and has the following structure:
    \`\`\`json
    [
      {
        "question_statement": "...",
        "options": ["Option A", "Option B", "Option C", "Option D"], // Array of strings for MCQ/MSQ, null for NAT/SUB
        "question_type": "MCQ", // or "MSQ", "NAT", "SUB"
        "answer": "Option B", // or ["Option A", "Option C"] for MSQ, "42.50" for NAT, "Detailed answer text" for SUB
        "solution": "..."
      },
      // ... more questions
    ]
    \`\`\`
    Ensure \`options\` is an array of strings for MCQ/MSQ, and \`answer\` is a string for MCQ/NAT/SUB, or an array of strings for MSQ.
    If the AI cannot generate the requested number of questions, it should generate as many as possible following the format.
    Double check the JSON format for correctness.
`;

    // 4. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    let generatedContent = response.text();

    // Attempt to extract JSON from the response, as Gemini might wrap it in markdown
    const jsonMatch = generatedContent.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      generatedContent = jsonMatch[1];
    }

    let generatedQuestions: any[] = [];
    try {
      generatedQuestions = JSON.parse(generatedContent);
      if (!Array.isArray(generatedQuestions)) {
        throw new Error('AI response is not a JSON array.');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', generatedContent);
      return NextResponse.json({ error: 'Failed to parse AI generated questions. Please try again.' }, { status: 500 });
    }

    // 5. Save Generated Questions to Supabase
    const questionsToInsert = generatedQuestions.map(q => ({
      user_id: userId,
      exam_id: examId,
      course_id: courseId,
      subject_id: subjectId,
      unit_id: unitId,
      chapter_id: chapterId,
      topic_id: topicId,
      part_id: partId,
      slot_id: slotId,
      question_statement: q.question_statement,
      options: q.options || null, // Ensure null if not present
      question_type: q.question_type,
      answer: typeof q.answer === 'object' ? JSON.stringify(q.answer) : q.answer, // Store array answers as JSON string
      solution: q.solution || null,
    }));

    const { error: insertError } = await supabase
      .from('new_questions')
      .insert(questionsToInsert);

    if (insertError) {
      console.error('Error inserting new questions:', insertError);
      return NextResponse.json({ error: 'Failed to save generated questions' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Questions generated and saved successfully!', count: questionsToInsert.length });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during question generation.' }, { status: 500 });
  }
}
