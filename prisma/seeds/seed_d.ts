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
    { 
      text: '¿Qué es un vector? A - Magnitud y dirección B - Un número real C - Una matriz',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Magnitud y dirección', score: 10 
    },
    { 
      text: '¿Qué representa un determinante? A - Escala el espacio B - Longitud de un vector C - Área o volumen asociado',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'C - Área o volumen asociado', score: 20 
    },
    { text: 'Demuestra que un subespacio...', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { text: '¿Si un sistema lineal tiene más variables que ecuaciones, siempre tiene infinitas soluciones?', diff: 'Fácil', type: 'VoF', ans: 'F', score: 10 },

    { 
      text: '¿Condición para invertir una matriz? A - Determinante ≠ 0 B - Tener filas iguales C - Ser triangular',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Determinante ≠ 0', score: 10 
    },
    { 
      text: '¿Base canónica de R2? A - (1,0),(0,1) B - (2,2),(1,1) C - (0,1),(1,1)',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - (1,0),(0,1)', score: 10 
    },

    { text: '¿Dos vectores son linealmente dependientes si uno es múltiplo escalar del otro?', diff: 'Medio', type: 'VoF', ans: 'V', score: 20 },

    { text: 'Explica independencia lineal', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un eigenvalor? A - Un escalar asociado a un vector propio B - Un determinante C - Una norma vectorial',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Un escalar asociado a un vector propio', score: 25 
    },

    { text: '¿Para qué sirve la diagonalización?', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 35 },
  ],


  'Física Cuántica': [
    { text: 'Define función de onda', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: 'Principio de incertidumbre A - Mide velocidad exacta B - Relación entre posición y momento C - Limita energía',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'B - Relación entre posición y momento', score: 20 
    },

    { 
      text: '¿Qué es un fotón? A - Partícula de luz B - Núcleo atómico C - Protón libre',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Partícula de luz', score: 10 
    },

    { text: 'Heisenberg dice que no se puede conocer exactamente posición y momento simultáneamente.', diff: 'Medio', type: 'VoF', ans: 'V', score: 10 },

    { text: 'Propiedades del espín', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un orbital? A - Nivel energético B - Trayectoria circular C - Distribución probabilística de electrones',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'C - Distribución probabilística de electrones', score: 10 
    },

    { text: 'Superposición: un electrón puede estar en dos estados energéticos simultáneamente.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 10 },

    { 
      text: 'Modelo de Bohr A - Electrones en órbitas fijas B - Ondas estacionarias C - Núcleo inestable',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Electrones en órbitas fijas', score: 20 
    },

    { 
      text: '¿Qué es un fermión? A - Partícula con espín semientero B - Partícula de fuerza C - Un bosón excitado',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Partícula con espín semientero', score: 20 
    },

    { text: 'Ecuación de Schrödinger', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },
  ],


  'Química Orgánica': [
    { text: 'Define isomería estructural', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: '¿Qué es un radical libre? A - Molécula con electrón desapareado B - Un ácido C - Un ión estable',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Molécula con electrón desapareado', score: 15 
    },

    { 
      text: 'Condición para reacción SN1 A - Base fuerte B - Sustrato primario C - Carbocatión estable',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'C - Carbocatión estable', score: 15 
    },

    { text: 'Los alcanos son hidrocarburos saturados con enlaces simples C–C.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 5 },

    { 
      text: '¿Qué es un alqueno? A - Hidrocarburo saturado B - Hidrocarburo con doble enlace C - Molécula aromática',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'B - Hidrocarburo con doble enlace', score: 15 
    },

    { text: 'Explica la reacción de oxidación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 20 },

    { 
      text: '¿Qué es un grupo funcional? A - Conjunto de átomos reactivos B - Ión positivo C - Enlace triple',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Conjunto de átomos reactivos', score: 15 
    },

    { text: 'Los alquenos reaccionan más por sustitución que adición.', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

    { text: 'Mecanismo de halogenación', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué es un alcohol primario? A - Oxidante fuerte B - Carbono terciario C - Carbono unido a un solo carbono',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'C - Carbono unido a un solo carbono', score: 15 
    },
  ],


  'Historia Mundial': [
    { text: 'Causas de la Primera Guerra Mundial', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 25 },

    { 
      text: '¿Quién fue Napoleón? A - Militar francés B - Rey inglés C - Filósofo griego',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Militar francés', score: 15 
    },

    { text: 'Consecuencias de la Segunda Guerra Mundial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { text: 'La Primera Guerra Mundial empezó en 1914.', diff: 'Medio', type: 'VoF', ans: 'V', score: 5 },

    { 
      text: '¿En qué año cayó el Muro de Berlín? A - 1989 B - 1975 C - 1961',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - 1989', score: 15 
    },

    { text: 'Explica la revolución industrial', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 40 },

    { 
      text: '¿Qué fue la Edad Media? A - Periodo entre siglos V–XV B - Periodo romano C - Renacimiento',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Periodo entre siglos V–XV', score: 15 
    },

    { text: 'La caída del Muro de Berlín ocurrió en 1980', diff: 'Medio', type: 'VoF', ans: 'F', score: 5 },

    { 
      text: 'Causas del imperialismo europeo A - Búsqueda de recursos B - Expansión democrática C - Crisis monetaria',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'A - Búsqueda de recursos', score: 15 
    },

    { text: 'Describe las revoluciones de 1848', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },
  ],


  'Biología Celular': [
    { 
      text: '¿Qué es una célula eucariota? A - Con núcleo definido B - Sin ADN C - Procariota modificada',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - Con núcleo definido', score: 15 
    },

    { text: 'Explica la mitocondria', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: '¿Qué es la mitosis? A - División nuclear B - Síntesis de proteínas C - Respiración celular',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'A - División nuclear', score: 15 
    },

    { text: 'La mitocondria produce ATP.', diff: 'Fácil', type: 'VoF', ans: 'V', score: 20 },

    { text: 'Describe la membrana celular', diff: 'Medio', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: 'Rol del retículo endoplásmico A - Transporte celular B - Síntesis y transporte C - Energía',
      diff: 'Medio', type: 'Selección Múltiple', ans: 'B - Síntesis y transporte', score: 15 
    },

    { 
      text: '¿Qué es la apoptosis? A - Muerte celular programada B - Digestión celular C - Crecimiento celular',
      diff: 'Difícil', type: 'Selección Múltiple', ans: 'A - Muerte celular programada', score: 15 
    },

    { text: 'Todos los organismos tienen más de una célula.', diff: 'Fácil', type: 'VoF', ans: 'F', score: 20 },

    { text: 'Ciclo celular fases', diff: 'Difícil', type: 'Argumentación', ans: 'Texto', score: 30 },

    { 
      text: '¿Qué es un lisosoma? A - Produce energía B - Orgánulo digestivo C - Sintetiza ADN',
      diff: 'Fácil', type: 'Selección Múltiple', ans: 'B - Orgánulo digestivo', score: 15 
    },
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
