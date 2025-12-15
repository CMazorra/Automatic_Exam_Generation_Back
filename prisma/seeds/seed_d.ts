// import { PrismaClient } from '@prisma/client';
// import { Subject } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function seed_subjects_questions(prisma: PrismaClient) {
//   console.log('🌱 Cargando datos de materias, subtemas y preguntas...');

//   // Crear Topics
//   await prisma.topic.createMany({
//     data: [
//       { name: 'Matemáticas' },
//       { name: 'Física' },
//       { name: 'Química' },
//       { name: 'Historia' },
//       { name: 'Biología' },
//     ],
//   });

//   const topics = await prisma.topic.findMany();

//   // Crear SubTopics
//   for (const topic of topics) {
//     await prisma.sub_Topic.createMany({
//       data: [
//         { name: `${topic.name} Intro`, topic_id: topic.id },
//         { name: `${topic.name} Medio`, topic_id: topic.id },
//         { name: `${topic.name} Avanzado`, topic_id: topic.id },
//       ],
//     });
//   }

//   const subTopics = await prisma.sub_Topic.findMany();

//   // Obtener docentes y coordinadores
//   const headTeachers = await prisma.head_Teacher.findMany();
//   const teachers = await prisma.teacher.findMany();

//   // Crear Subjects
//   const subjectNames = [
//     'Álgebra Lineal',
//     'Física Cuántica',
//     'Química Orgánica',
//     'Historia Mundial',
//     'Biología Celular',
//   ];

//   const createdSubjects: Subject[] = [];

//   for (let i = 0; i < subjectNames.length; i++) {
//     const teacherCount = teachers.length;

// const s = await prisma.subject.create({
//   data: {
//     name: subjectNames[i],
//     program: 'Ingeniería',
//     head_teacher_id: headTeachers[i % headTeachers.length].id,
//     teachers: {
//       connect: [
//         { id: teachers[i % teacherCount].id },
//         { id: teachers[(i + 1) % teacherCount].id },
//         { id: teachers[(i + 2) % teacherCount].id },
//       ],
//     },
//   },
// });

//   }

//   console.log('✅ Materias creadas');
//   for (const subj of createdSubjects) {
//   // Mapear manualmente topics por subject
//   let relatedTopics: typeof topics = [];
//   switch (subj.name) {
//     case 'Álgebra Lineal':
//       relatedTopics = topics.filter(t => t.name === 'Matemáticas');
//       break;
//     case 'Física Cuántica':
//       relatedTopics = topics.filter(t => t.name === 'Matemáticas' || t.name === 'Física');
//       break;
//     case 'Biología Celular':
//       relatedTopics = topics.filter(t => t.name === 'Matemáticas' || t.name === 'Química' || t.name === 'Biología');
//       break;
//     case 'Química Orgánica':
//       relatedTopics = topics.filter(t => t.name === 'Matemáticas' || t.name === 'Química' || t.name === 'Física');
//       break;
//     case 'Historia Mundial':
//       relatedTopics = topics.filter(t => t.name === 'Historia');
//       break;
//   }

//   // **Conectar topics al subject**
//   await prisma.subject.update({
//     where: { id: subj.id },
//     data: {
//       topics: {
//         connect: relatedTopics.map(t => ({ id: t.id })),
//       },
//     },
//   });
// }


//   // Parámetros
//   await prisma.parameters.createMany({
//   data: [
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '10',
//       quest_topics: 'Matemáticas',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '10',
//       quest_topics: 'Física',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '10',
//       quest_topics: 'Química',
//     },
//     {
//       proportion: '20-VoF,40-Argumentación,40-Opción Múltiple',
//       amount_quest: '5',
//       quest_topics: 'Historia',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '10',
//       quest_topics: 'Biología',
//     },

//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '5',
//       quest_topics: 'Matemáticas',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '8',
//       quest_topics: 'Matemáticas',
//     },

//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '6',
//       quest_topics: 'Física',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '8',
//       quest_topics: 'Física',
//     },

//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '7',
//       quest_topics: 'Química',
//     },

//     {
//       proportion: '20-VoF,40-Argumentación,40-Opción Múltiple',
//       amount_quest: '8',
//       quest_topics: 'Historia',
//     },

//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '6',
//       quest_topics: 'Biología',
//     },
//     {
//       proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
//       amount_quest: '9',
//       quest_topics: 'Biología',
//     },
//   ],
// });

//   console.log('✅ Parámetros creados');

//   // === CREAR VARIAS PREGUNTAS POR ASIGNATURA ===
//   const questionBank = {
//   'Álgebra Lineal': [
//     { 
//       text: '¿Qué es un vector? A - Magnitud y dirección B - Un número real C - Una matriz',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
//     },
//     { 
//       text: '¿Qué representa un determinante? A - Escala el espacio B - Longitud de un vector C - Área o volumen asociado',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'C', score: 20 
//     },
//     { text: 'Demuestra que un subespacio...', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { text: '¿Si un sistema lineal tiene más variables que ecuaciones, siempre tiene infinitas soluciones?', diff: 'Fácil', type: 'VoF', ans: 'F', score: 10 },

//     { 
//       text: '¿Condición para invertir una matriz? A - Determinante ≠ 0 B - Tener filas iguales C - Ser triangular',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 10 
//     },
//     { 
//       text: '¿Base canónica de R2? A - (1,0),(0,1) B - (2,2),(1,1) C - (0,1),(1,1)',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
//     },

//     { text: '¿Dos vectores son linealmente dependientes si uno es múltiplo escalar del otro?', diff: 'Medio', type: 'VoF', ans: 'V', score: 20 },

//     { text: 'Explica independencia lineal', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { 
//       text: '¿Qué es un eigenvalor? A - Un escalar asociado a un vector propio B - Un determinante C - Una norma vectorial',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 25 
//     },

//     { text: '¿Para qué sirve la diagonalización?', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 35 },
//   ],


//   'Física Cuántica': [
//     { text: 'Define función de onda', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

//     { 
//       text: 'Principio de incertidumbre A - Mide velocidad exacta B - Relación entre posición y momento C - Limita energía',
//       diff: 'Difícil', type: 'Selección Múltiple', ans: 'B', score: 20 
//     },

//     { 
//       text: '¿Qué es un fotón? A - Partícula de luz B - Núcleo atómico C - Protón libre',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
//     },

//     { text: 'Heisenberg dice que no se puede conocer exactamente posición y momento simultáneamente.', diff: 'Medio', type: 'VoF', ans: 'V', score: 10 },

//     { text: 'Propiedades del espín', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { 
//       text: '¿Qué es un orbital? A - Nivel energético B - Trayectoria circular C - Distribución probabilística de electrones',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 10 
//     },

//     { text: 'Superposición: un electrón puede estar en dos estados energéticos simultáneamente.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 10 },

//     { 
//       text: 'Modelo de Bohr A - Electrones en órbitas fijas B - Ondas estacionarias C - Núcleo inestable',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 20 
//     },

//     { 
//       text: '¿Qué es un fermión? A - Partícula con espín semientero B - Partícula de fuerza C - Un bosón excitado',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 20 
//     },

//     { text: 'Ecuación de Schrödinger', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },
//   ],


//   'Química Orgánica': [
//     { text: 'Define isomería estructural', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

//     { 
//       text: '¿Qué es un radical libre? A - Molécula con electrón desapareado B - Un ácido C - Un ión estable',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { 
//       text: 'Condición para reacción SN1 A - Base fuerte B - Sustrato primario C - Carbocatión estable',
//       diff: 'Difícil', type: 'Selección Múltiple', ans: 'C', score: 15 
//     },

//     { text: 'Los alcanos son hidrocarburos saturados con enlaces simples C–C.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 5 },

//     { 
//       text: '¿Qué es un alqueno? A - Hidrocarburo saturado B - Hidrocarburo con doble enlace C - Molécula aromática',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 15 
//     },

//     { text: 'Explica la reacción de oxidación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 20 },

//     { 
//       text: '¿Qué es un grupo funcional? A - Conjunto de átomos reactivos B - Ión positivo C - Enlace triple',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Los alquenos reaccionan más por sustitución que adición.', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

//     { text: 'Mecanismo de halogenación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { 
//       text: '¿Qué es un alcohol primario? A - Oxidante fuerte B - Carbono terciario C - Carbono unido a un solo carbono',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 15 
//     },
//   ],


//   'Historia Mundial': [
//     { text: 'Causas de la Primera Guerra Mundial', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 25 },

//     { 
//       text: '¿Quién fue Napoleón? A - Militar francés B - Rey inglés C - Filósofo griego',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Consecuencias de la Segunda Guerra Mundial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { text: 'La Primera Guerra Mundial empezó en 1914.', diff: 'Medio', type: 'VoF', ans: 'V', score: 5 },

//     { 
//       text: '¿En qué año cayó el Muro de Berlín? A - 1989 B - 1975 C - 1961',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Explica la revolución industrial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

//     { 
//       text: '¿Qué fue la Edad Media? A - Periodo entre siglos V–XV B - Periodo romano C - Renacimiento',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'La caída del Muro de Berlín ocurrió en 1980', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

//     { 
//       text: 'Causas del imperialismo europeo A - Búsqueda de recursos B - Expansión democrática C - Crisis monetaria',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Describe las revoluciones de 1848', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },
//   ],


//   'Biología Celular': [
//     { 
//       text: '¿Qué es una célula eucariota? A - Con núcleo definido B - Sin ADN C - Procariota modificada',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Explica la mitocondria', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

//     { 
//       text: '¿Qué es la mitosis? A - División nuclear B - Síntesis de proteínas C - Respiración celular',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'La mitocondria produce ATP.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 20 },

//     { text: 'Describe la membrana celular', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

//     { 
//       text: 'Rol del retículo endoplásmico A - Transporte celular B - Síntesis y transporte C - Energía',
//       diff: 'Medio', type: 'Selección Múltiple', ans: 'B', score: 15 
//     },

//     { 
//       text: '¿Qué es la apoptosis? A - Muerte celular programada B - Digestión celular C - Crecimiento celular',
//       diff: 'Difícil', type: 'Selección Múltiple', ans: 'A', score: 15 
//     },

//     { text: 'Todos los organismos tienen más de una célula.', diff: 'Fácil', type: 'VoF', ans: 'F', score: 20 },

//     { text: 'Ciclo celular fases', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },

//     { 
//       text: '¿Qué es un lisosoma? A - Produce energía B - Orgánulo digestivo C - Sintetiza ADN',
//       diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 15 
//     },
//   ],
// };

//   const students = await prisma.student.findMany();

// console.log('👨‍🎓 Asignando asignaturas aleatorias a los estudiantes...');

// for (const student of students) {
//   // Número aleatorio de materias (3–5)
//   const numSubjects = Math.floor(Math.random() * 3) + 3;

//   // Selecciona asignaturas aleatorias
//   const randomSubjects = [...createdSubjects]
//     .sort(() => Math.random() - 0.5)
//     .slice(0, numSubjects);

//   // Actualiza la relación muchos a muchos
//   await prisma.student.update({
//     where: { id: student.id },
//     data: {
//       subjects: {
//         connect: randomSubjects.map((s) => ({ id: s.id })),
//       },
//     },
//   });

//   console.log(
//     `→ ${student.id} recibió ${numSubjects} asignatura(s): ${randomSubjects
//       .map((s) => s.name)
//       .join(', ')}`
//   );
// }

// console.log('✅ Asignación aleatoria completada.');
// for (const subj of createdSubjects) {
//   const bank = questionBank[subj.name] ?? [];

//   // Obtener los topics ya conectados a este subject
//   const relatedTopics = await prisma.subject
//     .findUnique({
//       where: { id: subj.id },
//       select: { topics: true, teachers:true },
//     })
//     .then(s => s?? {topics:[], teachers:[]});

//   // Obtener subtopics relacionados
//   const topicsForSubj = relatedTopics.topics;
//   const teachersForSubj = relatedTopics.teachers;

//   if (!teachersForSubj.length) {
//     console.warn(`⚠️ La materia ${subj.name} no tiene docentes asignados`);
//     continue;
//   }
//   // Obtener subtopics relacionados
//   const relatedSubTopics = subTopics.filter(st =>
//     topicsForSubj.some(t => t.id === st.topic_id)
//   );
//   const difficultyMap: Record<string, string> = {
//     'Fácil': 'Intro',
//     'Medio': 'Medio',
//     'Difícil': 'Avanzado',
//   };
//   for (const q of bank) {
//   // 1️⃣ Topic principal de la asignatura
//   let mainTopicName: string;
//   switch (subj.name) {
//     case 'Álgebra Lineal':
//       mainTopicName = 'Matemáticas';
//       break;
//     case 'Física Cuántica':
//       mainTopicName = 'Física';
//       break;
//     case 'Química Orgánica':
//       mainTopicName = 'Química';
//       break;
//     case 'Historia Mundial':
//       mainTopicName = 'Historia';
//       break;
//     case 'Biología Celular':
//       mainTopicName = 'Biología';
//       break;
//     default:
//       mainTopicName = 'General';
//   }

//   // 2️⃣ Subtopics del topic principal
//   const subtopicsForTopic = relatedSubTopics.filter(st => 
//     topicsForSubj.some(t => t.name === mainTopicName && t.id === st.topic_id)
//   );

//   // 3️⃣ Nombre del subtema según dificultad
//   const subtopicName = `${mainTopicName} ${difficultyMap[q.diff]}`;

//   // 4️⃣ Buscar subtema
//   let sub = subtopicsForTopic.find(st => st.name === subtopicName);

//   // 5️⃣ Si no existe, elegir aleatorio solo dentro del topic
//   if (!sub) {
//     sub = subtopicsForTopic[Math.floor(Math.random() * subtopicsForTopic.length)];
//     console.warn(`⚠️ No se encontró subtema exacto para ${subtopicName}, se asigna uno aleatorio de ${mainTopicName}`);
//   }

//   const randomTeacher = teachersForSubj[Math.floor(Math.random() * teachersForSubj.length)];

//   // 6️⃣ Crear pregunta
//   await prisma.question.create({
//     data: {
//       question_text: q.text,
//       difficulty: q.diff,
//       answer: q.ans,
//       type: q.type,
//       score: q.score,
//       subject_id: subj.id,
//       topic_id: sub.topic_id,
//       sub_topic_id: sub.id,
//       teacher_id: randomTeacher.id,
//     },
//   });
// }}


// }

import { PrismaClient, Subject } from '@prisma/client';
import { Topic } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed_subjects_questions(prisma) {
  console.log('🌱 Seed: Subjects, Topics, Questions');

  /* =========================
     1️⃣ TOPICS
  ========================= */
  await prisma.topic.createMany({
    data: [
      { name: 'Matemáticas' },
      { name: 'Física' },
      { name: 'Química' },
      { name: 'Historia' },
      { name: 'Biología' },
    ],
    skipDuplicates: true,
  });

  const topics = await prisma.topic.findMany();

  /* =========================
     2️⃣ SUBTOPICS
  ========================= */
  for (const topic of topics) {
    await prisma.sub_Topic.createMany({
      data: [
        { name: `${topic.name} Intro`, topic_id: topic.id },
        { name: `${topic.name} Medio`, topic_id: topic.id },
        { name: `${topic.name} Avanzado`, topic_id: topic.id },
      ],
      skipDuplicates: true,
    });
  }

  const subTopics = await prisma.sub_Topic.findMany();

  /* =========================
     3️⃣ TEACHERS / HEADTEACHERS
  ========================= */
  const teachers = await prisma.teacher.findMany();
  const headTeachers = await prisma.head_Teacher.findMany();

  if (!teachers.length) {
    throw new Error('❌ No hay Teachers. Ejecuta primero seed_users.');
  }

  if (!headTeachers.length) {
    throw new Error('❌ No hay HeadTeachers. Ejecuta primero seed_users.');
  }

  /* =========================
     4️⃣ SUBJECTS
  ========================= */
  const subjectNames = [
    'Matemáticas',
    'Física',
    'Química',
    'Historia Mundial',
    'Biología Celular',
  ];

  const createdSubjects: Subject[] = [];

  for (let i = 0; i < subjectNames.length; i++) {
    const subject = await prisma.subject.create({
      data: {
        name: subjectNames[i],
        program: 'Ingeniería',
        head_teacher_id: headTeachers[i % headTeachers.length].id,
        teachers: {
          connect: [
            { id: teachers[i % teachers.length].id },
            { id: teachers[(i + 1) % teachers.length].id },
            { id: teachers[(i + 2) % teachers.length].id },
          ],
        },
      },
    });

    createdSubjects.push(subject);
  }

  console.log('✅ Subjects creados');

  /* =========================
     5️⃣ CONECTAR TOPICS A SUBJECTS
  ========================= */
  for (const subj of createdSubjects) {
    let relatedTopics: Topic[] = [];

    switch (subj.name) {
      case 'Matemáticas':
        relatedTopics = topics.filter(t => t.name === 'Matemáticas');
        break;
      case 'Física':
        relatedTopics = topics.filter(t => ['Matemáticas', 'Física'].includes(t.name));
        break;
      case 'Química':
        relatedTopics = topics.filter(t => ['Matemáticas', 'Física', 'Química'].includes(t.name));
        break;
      case 'Historia Mundial':
        relatedTopics = topics.filter(t => t.name === 'Historia');
        break;
      case 'Biología Celular':
        relatedTopics = topics.filter(t => ['Biología', 'Química'].includes(t.name));
        break;
    }

    await prisma.subject.update({
      where: { id: subj.id },
      data: {
        topics: {
          connect: relatedTopics.map(t => ({ id: t.id })),
        },
      },
    });
  }

  /* =========================
     6️⃣ PARAMETERS
  ========================= */
  await prisma.parameters.createMany({
    data: [
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '10',
      quest_topics: 'Matemáticas',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '10',
      quest_topics: 'Física',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '10',
      quest_topics: 'Química',
    },
    {
      proportion: '20-VoF,40-Argumentación,40-Opción Múltiple',
      amount_quest: '5',
      quest_topics: 'Historia',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '10',
      quest_topics: 'Biología',
    },

    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '5',
      quest_topics: 'Matemáticas',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '8',
      quest_topics: 'Matemáticas',
    },

    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '6',
      quest_topics: 'Física',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '8',
      quest_topics: 'Física',
    },

    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '7',
      quest_topics: 'Química',
    },

    {
      proportion: '20-VoF,40-Argumentación,40-Opción Múltiple',
      amount_quest: '8',
      quest_topics: 'Historia',
    },

    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '6',
      quest_topics: 'Biología',
    },
    {
      proportion: '20-VoF,30-Argumentación,50-Opción Múltiple',
      amount_quest: '9',
      quest_topics: 'Biología',
    },
  ],
    skipDuplicates: true,
  });

  console.log('✅ Parameters creados');

  /* =========================
     7️⃣ QUESTIONS
  ========================= */
  const questionBank = {
  'Álgebra Lineal': [
    { 
      text: '¿Qué es un vector? A - Magnitud y dirección B - Un número real C - Una matriz',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
    },
    { 
      text: '¿Qué representa un determinante? A - Escala el espacio B - Longitud de un vector C - Área o volumen asociado',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'C', score: 20 
    },
    { text: 'Demuestra que un subespacio...', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { text: '¿Si un sistema lineal tiene más variables que ecuaciones, siempre tiene infinitas soluciones?', diff: 'Fácil', type: 'VoF', ans: 'F', score: 10 },

    { 
      text: '¿Condición para invertir una matriz? A - Determinante ≠ 0 B - Tener filas iguales C - Ser triangular',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 10 
    },
    { 
      text: '¿Base canónica de R2? A - (1,0),(0,1) B - (2,2),(1,1) C - (0,1),(1,1)',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
    },

    { text: '¿Dos vectores son linealmente dependientes si uno es múltiplo escalar del otro?', diff: 'Medio', type: 'VoF', ans: 'V', score: 20 },

    { text: 'Explica independencia lineal', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un eigenvalor? A - Un escalar asociado a un vector propio B - Un determinante C - Una norma vectorial',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 25 
    },

    { text: '¿Para qué sirve la diagonalización?', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 35 },
  ],


  'Física Cuántica': [
    { text: 'Define función de onda', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: 'Principio de incertidumbre A - Mide velocidad exacta B - Relación entre posición y momento C - Limita energía',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'B', score: 20 
    },

    { 
      text: '¿Qué es un fotón? A - Partícula de luz B - Núcleo atómico C - Protón libre',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 10 
    },

    { text: 'Heisenberg dice que no se puede conocer exactamente posición y momento simultáneamente.', diff: 'Medio', type: 'VoF', ans: 'V', score: 10 },

    { text: 'Propiedades del espín', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un orbital? A - Nivel energético B - Trayectoria circular C - Distribución probabilística de electrones',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 10 
    },

    { text: 'Superposición: un electrón puede estar en dos estados energéticos simultáneamente.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 10 },

    { 
      text: 'Modelo de Bohr A - Electrones en órbitas fijas B - Ondas estacionarias C - Núcleo inestable',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 20 
    },

    { 
      text: '¿Qué es un fermión? A - Partícula con espín semientero B - Partícula de fuerza C - Un bosón excitado',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 20 
    },

    { text: 'Ecuación de Schrödinger', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },
  ],


  'Química Orgánica': [
    { text: 'Define isomería estructural', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: '¿Qué es un radical libre? A - Molécula con electrón desapareado B - Un ácido C - Un ión estable',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { 
      text: 'Condición para reacción SN1 A - Base fuerte B - Sustrato primario C - Carbocatión estable',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'C', score: 15 
    },

    { text: 'Los alcanos son hidrocarburos saturados con enlaces simples C–C.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 5 },

    { 
      text: '¿Qué es un alqueno? A - Hidrocarburo saturado B - Hidrocarburo con doble enlace C - Molécula aromática',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 15 
    },

    { text: 'Explica la reacción de oxidación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: '¿Qué es un grupo funcional? A - Conjunto de átomos reactivos B - Ión positivo C - Enlace triple',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Los alquenos reaccionan más por sustitución que adición.', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

    { text: 'Mecanismo de halogenación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un alcohol primario? A - Oxidante fuerte B - Carbono terciario C - Carbono unido a un solo carbono',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'C', score: 15 
    },
  ],


  'Historia Mundial': [
    { text: 'Causas de la Primera Guerra Mundial', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 25 },

    { 
      text: '¿Quién fue Napoleón? A - Militar francés B - Rey inglés C - Filósofo griego',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Consecuencias de la Segunda Guerra Mundial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { text: 'La Primera Guerra Mundial empezó en 1914.', diff: 'Medio', type: 'VoF', ans: 'V', score: 5 },

    { 
      text: '¿En qué año cayó el Muro de Berlín? A - 1989 B - 1975 C - 1961',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Explica la revolución industrial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué fue la Edad Media? A - Periodo entre siglos V–XV B - Periodo romano C - Renacimiento',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'La caída del Muro de Berlín ocurrió en 1980', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

    { 
      text: 'Causas del imperialismo europeo A - Búsqueda de recursos B - Expansión democrática C - Crisis monetaria',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Describe las revoluciones de 1848', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },
  ],


  'Biología Celular': [
    { 
      text: '¿Qué es una célula eucariota? A - Con núcleo definido B - Sin ADN C - Procariota modificada',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Explica la mitocondria', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: '¿Qué es la mitosis? A - División nuclear B - Síntesis de proteínas C - Respiración celular',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'La mitocondria produce ATP.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 20 },

    { text: 'Describe la membrana celular', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: 'Rol del retículo endoplásmico A - Transporte celular B - Síntesis y transporte C - Energía',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'B', score: 15 
    },

    { 
      text: '¿Qué es la apoptosis? A - Muerte celular programada B - Digestión celular C - Crecimiento celular',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'A', score: 15 
    },

    { text: 'Todos los organismos tienen más de una célula.', diff: 'Fácil', type: 'VoF', ans: 'F', score: 20 },

    { text: 'Ciclo celular fases', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: '¿Qué es un lisosoma? A - Produce energía B - Orgánulo digestivo C - Sintetiza ADN',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'B', score: 15 
    },
  ],
};

console.log('👨‍🎓 Asignando asignaturas aleatorias a los estudiantes...');

const students = await prisma.student.findMany();
for (const student of students) {
  // Número aleatorio de materias (3–5)
  const numSubjects = Math.floor(Math.random() * 3) + 3;

  // Selecciona asignaturas aleatorias
  const randomSubjects = [...createdSubjects]
    .sort(() => Math.random() - 0.5)
    .slice(0, numSubjects);

  // Actualiza la relación muchos a muchos
  await prisma.student.update({
    where: { id: student.id },
    data: {
      subjects: {
        connect: randomSubjects.map((s) => ({ id: s.id })),
      },
    },
  });

  console.log(
    `→ ${student.id} recibió ${numSubjects} asignatura(s): ${randomSubjects
      .map((s) => s.name)
      .join(', ')}`
  );
}

console.log('✅ Asignación aleatoria completada.');
  for (const subj of createdSubjects) {
  const bank = questionBank[subj.name] ?? [];

  // Obtener los topics ya conectados a este subject
  const relatedTopics = await prisma.subject
    .findUnique({
      where: { id: subj.id },
      select: { topics: true, teachers:true },
    })
    .then(s => s?? {topics:[], teachers:[]});

  // Obtener subtopics relacionados
  const topicsForSubj = relatedTopics.topics;
  const teachersForSubj = relatedTopics.teachers;

  if (!teachersForSubj.length) {
    console.warn("⚠️ La materia ${subj.name} no tiene docentes asignados");
    continue;
  }
  // Obtener subtopics relacionados
  const relatedSubTopics = subTopics.filter(st =>
    topicsForSubj.some(t => t.id === st.topic_id)
  );
  const difficultyMap: Record<string, string> = {
    'Fácil': 'Intro',
    'Medio': 'Medio',
    'Difícil': 'Avanzado',
  };
  for (const q of bank) {
  // 1️⃣ Topic principal de la asignatura
  let mainTopicName: string;
  switch (subj.name) {
    case 'Álgebra Lineal':
      mainTopicName = 'Matemáticas';
      break;
    case 'Física Cuántica':
      mainTopicName = 'Física';
      break;
    case 'Química Orgánica':
      mainTopicName = 'Química';
      break;
    case 'Historia Mundial':
      mainTopicName = 'Historia';
      break;
    case 'Biología Celular':
      mainTopicName = 'Biología';
      break;
    default:
      mainTopicName = 'General';
  }

  // 2️⃣ Subtopics del topic principal
  const subtopicsForTopic = relatedSubTopics.filter(st => 
    topicsForSubj.some(t => t.name === mainTopicName && t.id === st.topic_id)
  );

  // 3️⃣ Nombre del subtema según dificultad
  const subtopicName = ${mainTopicName} ${difficultyMap[q.diff]};

  // 4️⃣ Buscar subtema
  let sub = subtopicsForTopic.find(st => st.name === subtopicName);

  // 5️⃣ Si no existe, elegir aleatorio solo dentro del topic
  if (!sub) {
    sub = subtopicsForTopic[Math.floor(Math.random() * subtopicsForTopic.length)];
    console.warn(⚠️ No se encontró subtema exacto para ${subtopicName}, se asigna uno aleatorio de ${mainTopicName});
  }

  const randomTeacher = teachersForSubj[Math.floor(Math.random() * teachersForSubj.length)];

  // 6️⃣ Crear pregunta
  await prisma.question.create({
    data: {
      question_text: q.text,
      difficulty: q.diff,
      answer: q.ans,
      type: q.type,
      score: q.score,
      subject_id: subj.id,
      topic_id: sub.topic_id,
      sub_topic_id: sub.id,
      teacher_id: randomTeacher.id,
    },
  });
}}
}
