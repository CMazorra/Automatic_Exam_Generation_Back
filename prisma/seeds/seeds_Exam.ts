import { PrismaClient, Exam } from '@prisma/client';

export async function seed_exams(prisma: PrismaClient) {
  console.log('🌱 Seed: Exams');

  // =====================================================
  // DATOS BASE
  // =====================================================
  const subjects = await prisma.subject.findMany();
  const teachers = await prisma.teacher.findMany();
  const students = await prisma.student.findMany();
  const headTeachers = await prisma.head_Teacher.findMany();
  const parameters = await prisma.parameters.findMany();
  const questions = await prisma.question.findMany();

  if (
    !subjects.length ||
    !teachers.length ||
    !students.length ||
    !headTeachers.length ||
    !parameters.length ||
    !questions.length
  ) {
    console.log('❌ Falta poblar datos base');
    return;
  }

  // =====================================================
  // EXÁMENES (VARIANTES POR MATERIA)
  // =====================================================
  const examsData = [
    { name: 'Matemáticas A', difficulty: 'medio', questionsCount: 10 },
    { name: 'Matemáticas B', difficulty: 'medio', questionsCount: 6 },
    { name: 'Matemáticas C', difficulty: 'dificil', questionsCount: 8 },

    { name: 'Física A', difficulty: 'dificil', questionsCount: 10 },
    { name: 'Física B', difficulty: 'medio', questionsCount: 5 },

    { name: 'Química A', difficulty: 'facil', questionsCount: 7 },
    { name: 'Química B', difficulty: 'medio', questionsCount: 10 },
  ];

  const createdExams: (Exam & { questionsCount: number })[] = [];

  for (let i = 0; i < examsData.length; i++) {
    const e = examsData[i];
    const subject = subjects[i % subjects.length];

    const exam = await prisma.exam.create({
      data: {
        name: e.name,
        status: 'Pendiente',
        difficulty: e.difficulty,
        subject_id: subject.id,
        teacher_id: teachers[i % teachers.length].id,
        head_teacher_id: headTeachers[i % headTeachers.length].id,
        parameters_id: parameters[i % parameters.length].id,
      },
    });

    createdExams.push({ ...exam, questionsCount: e.questionsCount });
    console.log(`✅ Examen creado: ${exam.name}`);
  }

  // =====================================================
  // ASIGNAR ESTUDIANTES
  // =====================================================
  for (const exam of createdExams) {
    const subject = await prisma.subject.findUnique({
      where: { id: exam.subject_id },
      include: { students: true, teachers: true },
    });

    if (!subject) continue;

    for (const student of subject.students) {
      const teacher =
        subject.teachers[Math.floor(Math.random() * subject.teachers.length)];

      await prisma.exam_Student.create({
        data: {
          exam_id: exam.id,
          student_id: student.id,
          teacher_id: teacher.id,
          score: 0,
        },
      });
    }
  }

  console.log('✅ Exam_Student creados');

  // =====================================================
  // APROBACIÓN DE EXÁMENES
  // =====================================================
  for (const exam of createdExams) {
    await prisma.approved_Exam.create({
      data: {
        exam_id: exam.id,
        head_teacher_id: exam.head_teacher_id,
        guidelines: 'Siga las instrucciones correctamente',
      },
    });

    await prisma.exam.update({
      where: { id: exam.id },
      data: { status: 'Aprobado' },
    });
  }

  console.log('✅ Approved_Exam creados');

  // =====================================================
  // ASIGNAR PREGUNTAS (CANTIDAD VARIABLE)
  // =====================================================
  const examQuestions: { exam_id: number; question_id: number }[] = [];

  for (const exam of createdExams) {
    const selectedQuestions = questions
      .filter(q => q.subject_id === exam.subject_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, exam.questionsCount);

    for (const q of selectedQuestions) {
      await prisma.exam_Question.create({
        data: {
          exam_id: exam.id,
          question_id: q.id,
        },
      });

      examQuestions.push({
        exam_id: exam.id,
        question_id: q.id,
      });
    }
  }

  console.log('✅ Exam_Question creados');

  // =====================================================
  // FUNCIONES AUXILIARES
  // =====================================================
  function normalizeScore(raw: number, max: number): number {
    if (max <= 0) return 0;
    const value = Math.round((raw / max) * 100);
    return Math.min(100, Math.max(0, value));
  }

  const probability = (difficulty: string) =>
    difficulty === 'facil' ? 0.95 : difficulty === 'medio' ? 0.8 : 0.6;

  const wrongMC = (q: any) =>
    ['A', 'B', 'C'].filter(o => o !== q.answer)[
      Math.floor(Math.random() * 2)
    ];

  const wrongVoF = (q: any) => (q.answer === 'V' ? 'F' : 'V');

  const wrongText = (q: any) =>
    `Respuesta incompleta sobre ${q.question_text}`;

  const correctText = (q: any) =>
    `Respuesta desarrollada correctamente sobre ${q.question_text}`;

  const partialScore = (max: number) =>
    max <= 1 ? 0 : Math.floor(Math.random() * (max - 1)) + 1;

  // =====================================================
  // CALCULAR SCORE MÁXIMO POR EXAMEN
  // =====================================================
  const examMaxScore = new Map<number, number>();

  for (const exam of createdExams) {
    const qs = examQuestions.filter(eq => eq.exam_id === exam.id);
    let max = 0;

    for (const q of qs) {
      const question = questions.find(qq => qq.id === q.question_id)!;
      max += question.score;
    }

    examMaxScore.set(exam.id, max);
  }

  // =====================================================
  // CREAR RESPUESTAS
  // =====================================================
  for (const eq of examQuestions) {
    const question = questions.find(q => q.id === eq.question_id)!;
    const exam = createdExams.find(e => e.id === eq.exam_id)!;

    const examStudents = await prisma.exam_Student.findMany({
      where: { exam_id: eq.exam_id },
    });

    for (const es of examStudents) {
      const isCorrect = Math.random() < probability(exam.difficulty);

      let answer = '';
      let score = 0;

      if (question.type === 'Selección Múltiple') {
        answer = isCorrect ? question.answer : wrongMC(question);
        score = isCorrect ? question.score : 1;
      } else if (question.type === 'VoF') {
        answer = isCorrect ? question.answer : wrongVoF(question);
        score = isCorrect ? question.score : 1;
      } else {
        answer = isCorrect ? correctText(question) : wrongText(question);
        score = isCorrect ? question.score : partialScore(question.score);
      }

      await prisma.answer.create({
        data: {
          exam_id: eq.exam_id,
          question_id: eq.question_id,
          student_id: es.student_id,
          answer_text: answer,
          score,
        },
      });

      await prisma.exam_Student.update({
        where: {
          exam_id_student_id: {
            exam_id: eq.exam_id,
            student_id: es.student_id,
          },
        },
        data: {
          score: { increment: score },
        },
      });
    }
  }

  console.log('✅ Answers creadas');

  // =====================================================
  // NORMALIZAR SCORE FINAL (0–100)
  // =====================================================
  const examStudentsFinal = await prisma.exam_Student.findMany();

  for (const es of examStudentsFinal) {
    const maxScore = examMaxScore.get(es.exam_id) ?? 0;
    const normalized = normalizeScore(es.score ?? 0, maxScore);

    await prisma.exam_Student.update({
      where: {
        exam_id_student_id: {
          exam_id: es.exam_id,
          student_id: es.student_id,
        },
      },
      data: {
        score: normalized,
      },
    });
  }

  console.log('✅ Puntajes normalizados (0–100)');

  // =====================================================
  // REEVALUACIONES (ACOTADAS A 100)
  // =====================================================
  const reevaluables = await prisma.exam_Student.findMany({
    include: {
      exam: {
        include: {
          subject: { include: { teachers: true } },
        },
      },
    },
  });

  const selected = reevaluables.sort(() => Math.random() - 0.5).slice(0, 20);

  for (const es of selected) {
    const teachers = es.exam.subject.teachers;
    if (!teachers.length) continue;

    await prisma.reevaluation.create({
      data: {
        exam_id: es.exam_id,
        student_id: es.student_id,
        teacher_id:
          teachers[Math.floor(Math.random() * teachers.length)].id,
        score: Math.min(
          100,
          (es.score ?? 0) + (Math.floor(Math.random() * 5) + 5)
        ),
      },
    });
  }

  console.log('🎉 Seed COMPLETO, consistente y normalizado');
}
