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
    { name: 'Examen Matemáticas 1', status: 'Asignado', difficulty: 'medio' },
    { name: 'Examen Física 1', status: 'Asignado', difficulty: 'dificil' },
    { name: 'Examen Química 1', status: 'Asignado', difficulty: 'facil' },
    { name: 'Examen Historia 1', status: 'Asignado', difficulty: 'medio' },
    { name: 'Examen Biología 1', status: 'Asignado', difficulty: 'facil' },
  ];

  const createdExams: Exam[] = [];

  for (let i = 0; i < examsData.length; i++) {
    const exam = examsData[i];

    const created = await prisma.exam.create({
      data: {
        name: exam.name,
        status: exam.status,
        difficulty: exam.difficulty,
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
   console.log(`🧑‍🎓 Asignando estudiantes a sus exámenes correspondientes...`);

  for (const exam of createdExams) {
    const subject = await prisma.subject.findUnique({
      where: { id: exam.subject_id },
      include: { students: true, teachers:true }
    });
    if (!subject) continue;

    for (const student of subject!.students) {
      const teacherForStudent = subject!.teachers[Math.floor(Math.random() * subject!.teachers.length)];
      await prisma.exam_Student.create({
        data: {
          exam_id: exam.id,
          student_id: student.id,
          teacher_id: teacherForStudent.id,
          score: 0,
        }
      });
    }

    console.log(`📘 ${subject!.students.length} estudiantes asignados al examen de ${subject!.name}`);
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

    await prisma.exam.update({
    where: { id: exam.id },
    data: {
      status: 'Aprobado',
    },
  });
}
  

  console.log(`✅ Approved_Exam agregados`);

  // Crear 10 preguntas por examen
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


  // ----------------------------
  // 🔥 FUNCIONES DE RESPUESTAS
  // ----------------------------

  // Incorrecta Selección Múltiple
  function getWrongMultipleChoice(q: any): string {
    const options = ["A", "B", "C"];
    return options.filter(o => o !== q.answer)[Math.floor(Math.random() * 2)];
  }

  // Incorrecta VoF
  function getWrongVoF(q: any): string {
    return q.answer === "V" ? "F" : "V";
  }

  // Incorrecta texto
  function getWrongText(q: any): string {
    return `Respuesta incompleta sobre el tema ${q.question_text}`;
  }

  // Correcta texto
  function getCorrectText(q: any): string {
    return `Respuesta desarrollada correctamente relacionada con: ${q.question_text}`;
  }

  // Score incorrecto para texto (1 a score-1)
  function getRandomPartialScore(maxScore: number): number {
    if (maxScore <= 1) return 0;
    return Math.floor(Math.random() * (maxScore - 1)) + 1; // 1..(max-1)
  }

  function getCorrectProbability(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'facil':
      return 0.95; // 95% correctas
    case 'medio':
      return 0.80; // 80% correctas
    case 'dificil':
      return 0.60; // 60% correctas
    default:
      return 0.75;
  }
}

  // ----------------------------
  // 🔥 CREAR RESPUESTAS
  // ----------------------------

  for (const eq of examQuestions) {
    const question = questions.find(q => q.id === eq.question_id)!;
    const examStudents = await prisma.exam_Student.findMany({
      where: { exam_id: eq.exam_id }
    });

    for (const es of examStudents) {
      const exam = createdExams.find(e => e.id === eq.exam_id)!;
      const probability = getCorrectProbability(exam.difficulty);
      const isCorrect = Math.random() < probability;


      let answerText: string = "";
      let score = 0;

      // ===========================
      //   SELECCIÓN MÚLTIPLE
      // ===========================
      if (question.type === "Selección Múltiple") {
        if (isCorrect) {
          answerText = question.answer;
          score = question.score;
        } else {
          answerText = getWrongMultipleChoice(question);
          score = 1;
        }
      }
      // ===========================
      //   VERDADERO O FALSO
      // ===========================
      else if (question.type === "VoF") {
        if (isCorrect) {
          answerText = question.answer;
          score = question.score;
        } else {
          answerText = getWrongVoF(question);
          score = 1;
        }
      }
      // ===========================
      //   TEXTO / ARGUMENTACIÓN
      // ===========================
      else if (question.type === "Texto" || question.type === "Argumentación") {
        if (isCorrect) {
          answerText = getCorrectText(question);
          score = question.score;
        } else {
          answerText = getWrongText(question);
          score = getRandomPartialScore(question.score);
        }
      }
      // ===========================
      //   CASO DESCONOCIDO
      // ===========================
      else {
        answerText = `Respuesta automática para tipo desconocido: ${question.type}`;
        score = 0;
        console.warn("⚠️ Tipo de pregunta desconocido:", question.type);
      }

      // Crear respuesta
      await prisma.answer.create({
        data: {
          exam_id: eq.exam_id,
          question_id: eq.question_id,
          student_id: es.student_id,
          answer_text: answerText ?? "Respuesta no proporcionada",
          score,
        },
      });
      await prisma.exam_Student.update({
        where: {
          exam_id_student_id: { // si tu clave primaria compuesta es exam_id + student_id
            exam_id: eq.exam_id,
            student_id: es.student_id,
  
          },
        },
        data: {
          score: { increment: score } // suma la puntuación de esta respuesta al total
        },
      });

    }  
  }
  console.log(`✅ Answers agregadas (con texto, parciales y correctas)`);

  // Reevaluation
const examStudents = await prisma.exam_Student.findMany({
  include: {
    exam: {
      include: {
        subject: { include: { teachers: true } } // traer los docentes de la materia
      }
    }
  }
});
const shuffledStudents = examStudents.sort(() => Math.random() - 0.5);
const random20Students = shuffledStudents.slice(0, 20);

// Crear reevaluaciones para algunos estudiantes
for (const es of random20Students) { 
  const teachersForSubject = es.exam.subject.teachers;
  if (!teachersForSubject.length) continue;

  // Elegir un profesor aleatorio de la materia
  const randomTeacher = teachersForSubject[Math.floor(Math.random() * teachersForSubject.length)];

  await prisma.reevaluation.create({
    data: {
      exam_id: es.exam_id,
      student_id: es.student_id,
      teacher_id: randomTeacher.id,
      score: (es.score ?? 0) + (Math.floor(Math.random() * 5) + 5), // 5..9
    },
  });
}


  console.log('✅ Reevaluations agregadas');
  console.log('🎉 Seed completo con respuestas realistas.');
}
