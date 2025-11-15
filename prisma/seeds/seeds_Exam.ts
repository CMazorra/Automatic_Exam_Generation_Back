import { PrismaClient } from '@prisma/client';

export async function seed_exams(prisma: PrismaClient) {
  console.log('🌱 Seed: Exams');

  // Traer IDs existentes
  const subjects = await prisma.subject.findMany();
  const teachers = await prisma.teacher.findMany();
  const students = await prisma.student.findMany();
  const headTeachers = await prisma.head_Teacher.findMany();
  const parameters = await prisma.parameters.findMany();
  const questions = await prisma.question.findMany();

  if (!subjects.length || !teachers.length || !students.length || !headTeachers.length || !parameters.length || !questions.length ) {
    console.log('❌ Falta poblar datos base (Subjects, Teachers, Students, HeadTeachers, Parameters, Questions)');
    return;
  }

  // Crear varios exámenes
  const examsData = [
    { name: 'Examen Matemáticas 1', status: 'activo', difficulty: 'medio' },
    { name: 'Examen Física 1', status: 'activo', difficulty: 'dificil' },
    { name: 'Examen Química 1', status: 'inactivo', difficulty: 'facil' },
    { name: 'Examen Historia 1', status: 'activo', difficulty: 'medio' },
  ];

  const createdExams: Awaited<ReturnType<typeof prisma.exam.create>>[] = [];
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
  const examStudents: { exam_id: number; student_id: number; teacher_id: number; score: number }[] = [];
  for (const exam of createdExams) {
    for (const student of students) {
      examStudents.push({
        exam_id: exam.id,
        student_id: student.id,
        teacher_id: exam.teacher_id,
        score: 0,
      });
    }
  }

  for (const es of examStudents) {
    await prisma.exam_Student.create({ data: es });
  }
  console.log(`✅ Exam_Student agregados: ${examStudents.length}`);

  // Approved_Exam
  const approvedExams = createdExams.map((exam, idx) => ({
    exam_id: exam.id,
    head_teacher_id: exam.head_teacher_id,
    guidelines: 'Siga las instrucciones correctamente',
  }));

  for (const ae of approvedExams) {
    await prisma.approved_Exam.create({ data: ae });
  }
  console.log(`✅ Approved_Exam agregados: ${approvedExams.length}`);

  // Exam_Question
  const examQuestions: { exam_id: number; question_id: number }[] = [];
  for (const exam of createdExams) {
    for (const q of questions.slice(0, 3)) { // tomar 3 preguntas por examen
      examQuestions.push({ exam_id: exam.id, question_id: q.id });
    }
  }

  for (const eq of examQuestions) {
    await prisma.exam_Question.create({ data: eq });
  }
  console.log(`✅ Exam_Question agregados: ${examQuestions.length}`);

  // Answer
  const answers: { exam_id: number; question_id: number; student_id: number; answer_text: string }[] = [];
  for (const eq of examQuestions) {
    for (const student of students) {
      answers.push({
        exam_id: eq.exam_id,
        question_id: eq.question_id,
        student_id: student.id,
        answer_text: 'Respuesta de prueba',
      });
    }
  }

  for (const a of answers) {
    await prisma.answer.create({ data: a });
  }
  console.log(`✅ Answers agregadas: ${answers.length}`);

  // Reevaluation
  const reevaluations: { exam_id: number; student_id: number; teacher_id: number; score: number }[] = [];
  for (const es of examStudents.slice(0, 5)) { // solo algunos para ejemplo
    reevaluations.push({
      exam_id: es.exam_id,
      student_id: es.student_id,
      teacher_id: es.teacher_id,
      score: Math.floor(Math.random() * 5) + 5, // puntaje aleatorio entre 5 y 9
    });
  }

  for (const r of reevaluations) {
    await prisma.reevaluation.create({ data: r });
  }
  console.log(`✅ Reevaluations agregadas: ${reevaluations.length}`);

  console.log('✅ Todas las semillas de Exámenes se ejecutaron correctamente.');
}
