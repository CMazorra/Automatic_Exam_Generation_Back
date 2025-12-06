import { PrismaClient } from '@prisma/client';
import { Subject } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed_subjects_questions() {
  console.log('🌱 Cargando datos de materias, subtemas y preguntas...');

  // Crear Topics
  await prisma.topic.createMany({
    data: [
      { name: 'Matemáticas' },
      { name: 'Física' },
      { name: 'Química' },
      { name: 'Historia' },
      { name: 'Biología' },
    ],
  });

  const topics = await prisma.topic.findMany();

  // Crear SubTopics
  for (const topic of topics) {
    await prisma.sub_Topic.createMany({
      data: [
        { name: `${topic.name} Intro`, topic_id: topic.id },
        { name: `${topic.name} Medio`, topic_id: topic.id },
        { name: `${topic.name} Avanzado`, topic_id: topic.id },
      ],
    });
  }

  const subTopics = await prisma.sub_Topic.findMany();

  // Obtener docentes y coordinadores
  const headTeachers = await prisma.head_Teacher.findMany();
  const teachers = await prisma.teacher.findMany();

  // Crear Subjects
  const subjectNames = [
    'Álgebra Lineal',
    'Física Cuántica',
    'Química Orgánica',
    'Historia Mundial',
    'Biología Celular',
  ];

  const createdSubjects: Subject[] = [];

  for (let i = 0; i < subjectNames.length; i++) {
    const s = await prisma.subject.create({
      data: {
        name: subjectNames[i],
        program: 'Ingeniería',
        head_teacher_id: headTeachers[i % headTeachers.length].id,
        teachers: {
          connect: [{ id: teachers[i % teachers.length].id }],
        },
      },
    });
    createdSubjects.push(s);
  }

  console.log('✅ Materias creadas');

  // Parámetros
  await prisma.parameters.createMany({
    data: [
      { proportion: '50% teoría - 50% práctica', amount_quest: '10', quest_topics: 'Mixto' },
      { proportion: '70% práctica - 30% teoría', amount_quest: '8', quest_topics: 'Problemas' },
      { proportion: '100% teórico', amount_quest: '5', quest_topics: 'Conceptos' },
    ],
  });

  console.log('✅ Parámetros creados');

  // === CREAR VARIAS PREGUNTAS POR ASIGNATURA ===
  const questionBank = {
    'Álgebra Lineal': [
      { text: '¿Qué es un vector?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: '¿Qué representa un determinante?', diff: 'Medio', type: 'Selección Múltiple', ans: 'C', score: 5 },
      { text: 'Demuestra que un subespacio...', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },
      { text: '¿Qué es una matriz identidad?', diff: 'Fácil', type: 'VoF', ans: 'VF', score: 2 },
      { text: '¿Condición para invertir una matriz?', diff: 'Medio', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: '¿Base canónica de R2?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: '¿Cuál es el rango de una matriz?', diff: 'Medio', type: 'VoF', ans: 'VVF', score: 5 },
      { text: 'Explica independencia lineal', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un eigenvalor?', diff: 'Medio', type: 'Selección Múltiple', ans: 'C', score: 2 },
      { text: '¿Para qué sirve la diagonalización?', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10},
    ],

    'Física Cuántica': [
      { text: 'Define función de onda', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: 'Principio de incertidumbre', diff: 'Difícil', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: '¿Qué es un fotón?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'VoF sobre dualidad onda-partícula', diff: 'Medio', type: 'VoF', ans: 'VFV', score: 5 },
      { text: 'Propiedades del espín', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un orbital?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 2 },
      { text: 'VoF sobre niveles de energía', diff: 'Fácil', type: 'VoF', ans: 'VF', score: 5 },
      { text: 'Modelo de Bohr', diff: 'Medio', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: '¿Qué es un fermión?', diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'Ecuación de Schrödinger', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
    ],

    'Química Orgánica': [
      { text: 'Define isomería estructural', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un radical libre?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'Condición para reacción SN1', diff: 'Difícil', type: 'Selección Múltiple', ans: 'C', score: 2 },
      { text: 'VoF sobre enlaces covalentes', diff: 'Fácil', type: 'VoF', ans: 'VF', score: 5 },
      { text: '¿Qué es un alqueno?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: 'Explica la reacción de oxidación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un grupo funcional?', diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'VoF sobre aromáticos', diff: 'Medio', type: 'VoF', ans: 'VFV', score: 5 },
      { text: 'Mecanismo de halogenación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un alcohol primario?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 2 },
     ],

     'Historia Mundial': [
      { text: 'Causas de la Primera Guerra Mundial', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Quién fue Napoleón Bonaparte?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'Consecuencias de la Segunda Guerra Mundial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: 'VoF sobre la Guerra Fría', diff: 'Medio', type: 'VoF', ans: 'VVF', score: 5 },
      { text: '¿En qué año cayó el Muro de Berlín?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 2 },
      { text: 'Explica la revolución industrial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué fue la Edad Media?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: 'VoF sobre el Renacimiento', diff: 'Medio', type: 'VoF', ans: 'FVV', score: 5 },
      { text: 'Causas del imperialismo europeo', diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'Describe las revoluciones de 1848', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
     ],

     'Biología Celular': [
      { text: '¿Qué es una célula eucariota?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'Explica la mitocondria', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es la mitosis?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 2 },
      { text: 'VoF sobre ADN y ARN', diff: 'Fácil', type: 'VoF', ans: 'VFV', score: 5 },
      { text: 'Describe la membrana celular', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: 'Rol del retículo endoplásmico', diff: 'Medio', type: 'Selección Múltiple', ans: 'C', score: 2 },
      { text: '¿Qué es la apoptosis?', diff: 'Difícil', type: 'Selección Múltiple', ans: 'A', score: 2 },
      { text: 'VoF sobre ribosomas', diff: 'Fácil', type: 'VoF', ans: 'VF', score: 5 },
      { text: 'Ciclo celular fases', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 10 },
      { text: '¿Qué es un lisosoma?', diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 2 },
     ],
  };

  for (const subj of createdSubjects) {
    const bank = questionBank[subj.name] ?? [];

    for (let i = 0; i < bank.length; i++) {
      const sub = subTopics[i % subTopics.length];

      await prisma.question.create({
        data: {
          question_text: bank[i].text,
          difficulty: bank[i].diff,
          answer: bank[i].ans,
          type: bank[i].type,
          score: bank[i].score,
          subject_id: subj.id,
          topic_id: sub.topic_id,
          sub_topic_id: sub.id,
          teacher_id: teachers[0].id,
        },
      });
    }
  }

  console.log('✅ Preguntas creadas por asignatura');
}
