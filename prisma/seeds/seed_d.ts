import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed_subjects_questions() {
  console.log('🌱 Cargando datos de materias, temas y preguntas...');

  // === 1️⃣ CREAR TOPICS ===
  const topics = await prisma.topic.createMany({
    data: [
      { name: 'Matemáticas' },
      { name: 'Física' },
      { name: 'Química' },
      { name: 'Historia' },
      { name: 'Biología' },
    ],
  });

  console.log('✅ Temas creados');

  // === 2️⃣ CREAR SUB-TOPICS ===
  const allTopics = await prisma.topic.findMany();
  for (const topic of allTopics) {
    await prisma.sub_Topic.createMany({
      data: [
        { id: 1, name: `${topic.name} - Introducción`, topic_id: topic.id },
        { id: 2, name: `${topic.name} - Nivel Medio`, topic_id: topic.id },
        { id: 3, name: `${topic.name} - Avanzado`, topic_id: topic.id },
      ],
    });
  }

  console.log('✅ Subtemas creados');

  // === 3️⃣ CREAR SUBJECTS ===
  const headTeachers = await prisma.head_Teacher.findMany();
  const teachers = await prisma.teacher.findMany();

  const subjects = [
    {
      name: 'Álgebra Lineal',
      program: 'Ingeniería',
      head_teacher_id: headTeachers[0].id,
    },
    {
      name: 'Física Cuántica',
      program: 'Ciencias',
      head_teacher_id: headTeachers[1 % headTeachers.length].id,
    },
    {
      name: 'Química Orgánica',
      program: 'Ciencias',
      head_teacher_id: headTeachers[2 % headTeachers.length].id,
    },
    {
      name: 'Historia Mundial',
      program: 'Humanidades',
      head_teacher_id: headTeachers[0].id,
    },
    {
      name: 'Biología Celular',
      program: 'Ciencias',
      head_teacher_id: headTeachers[1 % headTeachers.length].id,
    },
  ];

  for (const s of subjects) {
    await prisma.subject.create({
      data: {
        name: s.name,
        program: s.program,
        head_teacher_id: s.head_teacher_id,
        teachers: {
          connect: [
            { id: teachers[Math.floor(Math.random() * teachers.length)].id },
          ],
        },
      },
    });
  }

  console.log('✅ Materias creadas');

  // === 4️⃣ CREAR PARAMETERS ===
  await prisma.parameters.createMany({
    data: [
      {
        proportion: '50% teoría - 50% práctica',
        amount_quest: '10',
        quest_topics: 'Subtemas variados',
      },
      {
        proportion: '70% práctica - 30% teoría',
        amount_quest: '8',
        quest_topics: 'Problemas de aplicación',
      },
      {
        proportion: '100% teórico',
        amount_quest: '5',
        quest_topics: 'Conceptos básicos',
      },
    ],
  });

  console.log('✅ Parámetros creados');

  // === 5️⃣ CREAR QUESTIONS ===
  const subs = await prisma.sub_Topic.findMany();
  const subjectsDB = await prisma.subject.findMany();
  const teachersDB = await prisma.teacher.findMany();

  const questionSamples = [
    {
      question_text: '¿Cuál es la ecuación de una recta?',
      difficulty: 'Fácil',
      answer: 'y = mx + b',
      type: 'Teórico',
    },
    {
      question_text: '¿Qué es la constante de Planck?',
      difficulty: 'Medio',
      answer: '6.626×10⁻³⁴ J·s',
      type: 'Teórico',
    },
    {
      question_text: '¿Qué caracteriza a un enlace covalente?',
      difficulty: 'Fácil',
      answer: 'Compartición de electrones',
      type: 'Teórico',
    },
    {
      question_text: '¿En qué año comenzó la Segunda Guerra Mundial?',
      difficulty: 'Fácil',
      answer: '1939',
      type: 'Memoria',
    },
    {
      question_text: '¿Qué orgánulo celular contiene el ADN?',
      difficulty: 'Fácil',
      answer: 'El núcleo',
      type: 'Teórico',
    },
  ];

  for (let i = 0; i < questionSamples.length; i++) {
    const sample = questionSamples[i];
    await prisma.question.create({
      data: {
        question_text: sample.question_text,
        difficulty: sample.difficulty,
        answer: sample.answer,
        type: sample.type,
        subject_id: subjectsDB[i % subjectsDB.length].id,
        sub_topic_id: subs[i % subs.length].id,
        topic_id: subs[i % subs.length].topic_id,
        teacher_id: teachersDB[i % teachersDB.length].id,
      },
    });
  }

  console.log('✅ Preguntas creadas');

  // === 6️⃣ CREAR FECHAS ===
  const dates = [
    new Date('2024-03-01'),
    new Date('2024-04-10'),
    new Date('2024-05-15'),
    new Date('2024-06-20'),
    new Date('2024-07-30'),
  ];

  await prisma.date.createMany({
    data: dates.map((d) => ({ date: d })),
  });

  console.log('✅ Fechas creadas');
  console.log('🎉 Seed completado correctamente.');
}
