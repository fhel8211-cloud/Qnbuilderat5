'use client';

import React, { useEffect, useState } from 'react';
import { useQuestionGeneratorStore } from '@/store/questionGeneratorStore';
import { supabase } from '@/lib/supabase';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import RadioGroup from '@/components/ui/RadioGroup';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import {
  FaGraduationCap, FaBook, FaLayerGroup, FaCube, FaFileAlt, FaTag, FaClock, FaPuzzlePiece, FaPlus, FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineQuestionMark } from 'react-icons/md';

interface SelectOption {
  value: string;
  label: string;
}

const questionTypeOptions = [
  { value: 'MCQ', label: 'MCQ (Single Correct)' },
  { value: 'MSQ', label: 'MSQ (Multiple Correct)' },
  { value: 'NAT', label: 'NAT (Numerical Answer Type)' },
  { value: 'SUB', label: 'SUB (Subjective)' },
];

const generationModeOptions = [
  { value: 'new_questions', label: 'Generate New Questions' },
  { value: 'pyq_solutions', label: 'Generate PYQ Solutions' },
];

export default function QuestionGeneratorPage() {
  const {
    exams, setExams,
    courses, setCourses,
    subjects, setSubjects,
    units, setUnits,
    chapters, setChapters,
    topics, setTopics,
    parts, setParts,
    slots, setSlots,
    selectedExam, setSelectedExam,
    selectedCourse, setSelectedCourse,
    selectedSubject, setSelectedSubject,
    selectedUnit, setSelectedUnit,
    selectedChapter, setSelectedChapter,
    selectedTopic, setSelectedTopic,
    selectedPart, setSelectedPart,
    selectedSlot, setSelectedSlot,
    generationMode, setGenerationMode,
    questionType, setQuestionType,
    numberOfQuestions, setNumberOfQuestions,
    timeMinutes, setTimeMinutes,
    correctMarks, setCorrectMarks,
    incorrectMarks, setIncorrectMarks,
    skippedMarks, setSkippedMarks,
    partialMarks, setPartialMarks,
    newQuestionsGeneratedCount,
    pyqSolutionsGeneratedCount,
    incrementNewQuestionsGenerated,
    incrementPyqSolutionsGenerated,
  } = useQuestionGeneratorStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch initial data (Exams)
  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('exams').select('id, name');
      if (error) {
        toast.error('Failed to load exams.');
        console.error('Error fetching exams:', error);
      } else {
        setExams(data.map(item => ({ value: item.id, label: item.name })));
      }
      setIsLoading(false);
    };
    fetchExams();
  }, [setExams]);

  // Fetch Courses based on selected Exam
  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedExam) {
        setIsLoading(true);
        const { data, error } = await supabase.from('courses').select('id, name').eq('exam_id', selectedExam.value);
        if (error) {
          toast.error('Failed to load courses.');
          console.error('Error fetching courses:', error);
        } else {
          setCourses(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [selectedExam, setCourses]);

  // Fetch Subjects based on selected Course
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        const { data, error } = await supabase.from('subjects').select('id, name').eq('course_id', selectedCourse.value);
        if (error) {
          toast.error('Failed to load subjects.');
          console.error('Error fetching subjects:', error);
        } else {
          setSubjects(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [selectedCourse, setSubjects]);

  // Fetch Units based on selected Subject
  useEffect(() => {
    const fetchUnits = async () => {
      if (selectedSubject) {
        setIsLoading(true);
        const { data, error } = await supabase.from('units').select('id, name').eq('subject_id', selectedSubject.value);
        if (error) {
          toast.error('Failed to load units.');
          console.error('Error fetching units:', error);
        } else {
          setUnits(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [selectedSubject, setUnits]);

  // Fetch Chapters based on selected Unit
  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedUnit) {
        setIsLoading(true);
        const { data, error } = await supabase.from('chapters').select('id, name').eq('unit_id', selectedUnit.value);
        if (error) {
          toast.error('Failed to load chapters.');
          console.error('Error fetching chapters:', error);
        } else {
          setChapters(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setChapters([]);
      }
    };
    fetchChapters();
  }, [selectedUnit, setChapters]);

  // Fetch Topics based on selected Chapter
  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapter) {
        setIsLoading(true);
        const { data, error } = await supabase.from('topics').select('id, name').eq('chapter_id', selectedChapter.value);
        if (error) {
          toast.error('Failed to load topics.');
          console.error('Error fetching topics:', error);
        } else {
          setTopics(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setTopics([]);
      }
    };
    fetchTopics();
  }, [selectedChapter, setTopics]);

  // Fetch Parts based on selected Course
  useEffect(() => {
    const fetchParts = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        const { data, error } = await supabase.from('parts').select('id, name').eq('course_id', selectedCourse.value);
        if (error) {
          toast.error('Failed to load parts.');
          console.error('Error fetching parts:', error);
        } else {
          setParts(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setParts([]);
      }
    };
    fetchParts();
  }, [selectedCourse, setParts]);

  // Fetch Slots based on selected Course
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        const { data, error } = await supabase.from('slots').select('id, name').eq('course_id', selectedCourse.value);
        if (error) {
          toast.error('Failed to load slots.');
          console.error('Error fetching slots:', error);
        } else {
          setSlots(data.map(item => ({ value: item.id, label: item.name })));
        }
        setIsLoading(false);
      } else {
        setSlots([]);
      }
    };
    fetchSlots();
  }, [selectedCourse, setSlots]);


  const handleGenerateQuestions = async () => {
    if (!selectedExam || !selectedCourse || !selectedSubject || !selectedUnit || !selectedChapter || !selectedTopic) {
      toast.error('Please select Exam, Course, Subject, Unit, Chapter, and Topic.');
      return;
    }

    setIsGenerating(true);
    const loadingToastId = toast.loading('Generating questions...');

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: selectedExam.value,
          courseId: selectedCourse.value,
          subjectId: selectedSubject.value,
          unitId: selectedUnit.value,
          chapterId: selectedChapter.value,
          topicId: selectedTopic.value,
          partId: selectedPart?.value || null,
          slotId: selectedSlot?.value || null,
          examName: selectedExam.label,
          courseName: selectedCourse.label,
          subjectName: selectedSubject.label,
          unitName: selectedUnit.label,
          chapterName: selectedChapter.label,
          topicName: selectedTopic.label,
          partName: selectedPart?.label || null,
          slotName: selectedSlot?.label || null,
          questionType,
          numberOfQuestions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      toast.success(`${data.count} questions generated and saved!`, { id: loadingToastId });
      incrementNewQuestionsGenerated(data.count);

    } catch (error: any) {
      toast.error(error.message || 'An error occurred during generation.', { id: loadingToastId });
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isGenerateButtonDisabled = !selectedExam || !selectedCourse || !selectedSubject || !selectedUnit || !selectedChapter || !selectedTopic || isGenerating;

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-10">AI Question Generator</h1>

        {/* Selection Configuration */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-6">Selection Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Select
              label="Select Exam"
              options={exams}
              value={selectedExam}
              onChange={setSelectedExam}
              placeholder="Select an exam"
              isDisabled={isLoading}
            />
            <Select
              label="Select Course"
              options={courses}
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="Select a course"
              isDisabled={isLoading || !selectedExam}
            />
            <Select
              label="Select Subject"
              options={subjects}
              value={selectedSubject}
              onChange={setSelectedSubject}
              placeholder="Select a subject"
              isDisabled={isLoading || !selectedCourse}
            />
            <Select
              label="Select Unit"
              options={units}
              value={selectedUnit}
              onChange={setSelectedUnit}
              placeholder="Select a unit"
              isDisabled={isLoading || !selectedSubject}
            />
            <Select
              label="Select Chapter"
              options={chapters}
              value={selectedChapter}
              onChange={setSelectedChapter}
              placeholder="Select a chapter"
              isDisabled={isLoading || !selectedUnit}
            />
            <Select
              label="Select Topic"
              options={topics}
              value={selectedTopic}
              onChange={setSelectedTopic}
              placeholder="Select a topic"
              isDisabled={isLoading || !selectedChapter}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <RadioGroup
              label="Generation Mode"
              name="generationMode"
              options={generationModeOptions}
              selectedValue={generationMode}
              onChange={setGenerationMode}
              className="flex-grow"
            />
          </div>
        </Card>

        {/* Paper Configuration (Optional) */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-6">Paper Configuration (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Slot"
              options={slots}
              value={selectedSlot}
              onChange={setSelectedSlot}
              placeholder="Select a slot (optional)"
              isDisabled={isLoading || !selectedCourse}
            />
            <Select
              label="Part"
              options={parts}
              value={selectedPart}
              onChange={setSelectedPart}
              placeholder="Select a part (optional)"
              isDisabled={isLoading || !selectedCourse}
            />
          </div>
        </Card>

        {/* Question Configuration */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-6">Question Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RadioGroup
              label="Question Type"
              name="questionType"
              options={questionTypeOptions}
              selectedValue={questionType}
              onChange={setQuestionType}
              className="col-span-full md:col-span-1"
            />
            <Input
              id="numberOfQuestions"
              label="Number of Questions"
              type="number"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 0)}
              min={1}
              max={100}
            />
            <Input
              id="timeMinutes"
              label="Time (minutes)"
              type="number"
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(parseInt(e.target.value) || 0)}
              min={1}
            />
            <Input
              id="correctMarks"
              label="Correct Marks"
              type="number"
              value={correctMarks}
              onChange={(e) => setCorrectMarks(parseInt(e.target.value) || 0)}
            />
            <Input
              id="incorrectMarks"
              label="Incorrect Marks"
              type="number"
              value={incorrectMarks}
              onChange={(e) => setIncorrectMarks(parseInt(e.target.value) || 0)}
            />
            <Input
              id="skippedMarks"
              label="Skipped Marks"
              type="number"
              value={skippedMarks}
              onChange={(e) => setSkippedMarks(parseInt(e.target.value) || 0)}
            />
            <Input
              id="partialMarks"
              label="Partial Marks"
              type="number"
              value={partialMarks}
              onChange={(e) => setPartialMarks(parseInt(e.target.value) || 0)}
            />
          </div>
        </Card>

        {/* Topic Distribution Preview (Placeholder as per request) */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-6">Topic Distribution Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example Topic Cards - these would be dynamically loaded in a real app */}
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Definite Integrals</p>
                <p className="text-textSecondary text-sm">Questions: 3</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 1900.0%</span>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Exponential Series</p>
                <p className="text-textSecondary text-sm">Questions: 2</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 781.0%</span>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Combinations</p>
                <p className="text-textSecondary text-sm">Questions: 2</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 620.0%</span>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Arithmetic Progression (AP)</p>
                <p className="text-textSecondary text-sm">Questions: 1</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 510.0%</span>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Derivatives of Functions of One Variable</p>
                <p className="text-textSecondary text-sm">Questions: 1</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 481.0%</span>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="text-text font-medium">Determinants</p>
                <p className="text-textSecondary text-sm">Questions: 1</p>
              </div>
              <span className="text-primary text-sm font-semibold">↑ 464.0%</span>
            </div>
          </div>
          <p className="text-center text-textSecondary text-sm mt-4">And 78 more topics...</p>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleGenerateQuestions}
            isLoading={isGenerating}
            disabled={isGenerateButtonDisabled}
            icon={<FaPuzzlePiece />}
            className="min-w-[250px]"
          >
            Generate {numberOfQuestions} Questions
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex items-center gap-4 border-l-4 border-primary">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <FaPlus size={24} />
            </div>
            <div>
              <p className="text-textSecondary text-sm">New Questions Generated</p>
              <p className="text-3xl font-bold text-text">{newQuestionsGeneratedCount}</p>
              <p className="text-textSecondary text-xs">Ready for practice</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-success">
            <div className="p-3 rounded-full bg-success/20 text-success">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <p className="text-textSecondary text-sm">PYQ Solutions Generated</p>
              <p className="text-3xl font-bold text-text">{pyqSolutionsGeneratedCount}</p>
              <p className="text-textSecondary text-xs">Solutions completed</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
