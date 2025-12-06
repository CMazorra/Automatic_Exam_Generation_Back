import { PrismaClient } from '@prisma/client';
import { Exam } from '@prisma/client';

export async function seed_exams(prisma: PrismaClient) {
  console.log('🌱 Seed: Exams');

  // Traer IDs existentes
  const subjects = await prisma.subject.findMany();
  const teachers = await prisma.teacher.findMany();
  const students = await prisma.student.findMany();
  const headTeachers = await prisma.head_Teacher.findMany();
  const parameters = await prisma.parameters.findMany();
  const questions = await prisma.question.findMany({
    include: { subject: true }
  });

  if (!subjects.length || !teachers.length || !students.length ||
    !headTeachers.length || !parameters.length || !questions.length) {
    console.log('❌ Falta poblar datos base');
    return;
  }

  // Crear varios exámenes
  const examsData = [
    { name: 'Examen Matemáticas 1', status: 'Pendiente', difficulty: 'medio' },
    { name: 'Examen Física 1', status: 'Pendiente', difficulty: 'dificil' },
    { name: 'Examen Química 1', status: 'Pendiente', difficulty: 'facil' },
    { name: 'Examen Historia 1', status: 'Pendiente', difficulty: 'medio' },
  ];

  const createdExams: Exam[] = [];

  for (let i = 0; i < examsData.length; i++) {
    const exam = examsData[i];

    const created = await prisma.exam.create({
      data: {
        ...exam,
        subject_id: subjects[i % subjects.length].id,
        teacher_id: teachers[i % teachers.length].id,
        head_teacher_id: headTeachers[i % headTeachers.length].id,
        parameters_id: parameters[i % parameters.length].id,
      },
    });

    console.log(`✅ Exam agregado: ${created.name}`);
    createdExams.push(created);
  }

  // Exam_Student
  for (const exam of createdExams) {
    for (const student of students) {
      await prisma.exam_Student.create({
        data: {
          exam_id: exam.id,
          student_id: student.id,
          teacher_id: exam.teacher_id,
          score: 0,
        },
      });
    }
  }

  console.log(`✅ Exam_Student agregados`);

  // Approved_Exam
  for (const exam of createdExams) {
    await prisma.approved_Exam.create({
      data: {
        exam_id: exam.id,
        head_teacher_id: exam.head_teacher_id,
        guidelines: 'Siga las instrucciones correctamente',
      },
    });
  }

  console.log(`✅ Approved_Exam agregados`);

  // Crear 10 preguntas por examen (del banco de la materia)
  const examQuestions: { exam_id: number; question_id: number }[] = [];

  for (const exam of createdExams) {
    const subjectQuestions = questions.filter(q => q.subject_id === exam.subject_id);

    const selected = subjectQuestions.slice(0, 10);

    for (const q of selected) {
      examQuestions.push({ exam_id: exam.id, question_id: q.id });

      await prisma.exam_Question.create({
        data: { exam_id: exam.id, question_id: q.id }
      });
    }
  }

  console.log(`✅ Exam_Question (10 por examen) agregados`);

  // Respuestas — algunas correctas y otras incorrectas
  function randomWrongAnswer(q: any): string {
    if (q.type === "Selección Múltiple") {
      const options = ["A", "B", "C", "D"];
      return options.filter(o => o !== q.answer)[Math.floor(Math.random() * 3)];
    }

    if (q.type === "VoF") {
      const wrong = q.answer === "V" ? "F" : "V";
      return wrong;
    }

    return "Respuesta incorrecta";
  }

  for (const eq of examQuestions) {
    const question = questions.find(q => q.id === eq.question_id)!;

    for (const student of students) {
      const isCorrect = Math.random() < 0.6; // 60% de probabilidad de responder bien

      const answerText =
        isCorrect && question.answer !== "Texto"
          ? question.answer
          : randomWrongAnswer(question);

      await prisma.answer.create({
        data: {
          exam_id: eq.exam_id,
          question_id: eq.question_id,
          student_id: student.id,
          answer_text: answerText,
          score: isCorrect ? 1 : 0,
        },
      });
    }
  }

  console.log(`✅ Answers agregadas (correctas e incorrectas)`);

  // Reevaluation
  const examStudents = await prisma.exam_Student.findMany();

  for (const es of examStudents.slice(0, 5)) {
    await prisma.reevaluation.create({
      data: {
        exam_id: es.exam_id,
        student_id: es.student_id,
        teacher_id: es.teacher_id,
        score: Math.floor(Math.random() * 5) + 5,
      },
    });
  }

  console.log('✅ Reevaluations agregadas');
  console.log('🎉 Seed completo con respuestas reales.');
}
