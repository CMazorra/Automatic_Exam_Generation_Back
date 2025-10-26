// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export async function seeds_Exams(prismaClient?: PrismaClient){
//     const db = prismaClient || prisma;
    
//     const subjects = await db.subject.findMany();
//     const teachers = await db.teacher.findMany();
//     const head_teachers = await db.head_Teacher.findMany();
//     const parameters = await db.parameters.findMany();
//     const students = await db.student.findMany();
//     const questions = await db.question.findMany();
//     const dates = await db.date.findMany();

//     if(
//         !subjects.length ||
//         !teachers.length ||
//         !head_teachers.length ||
//         !parameters.length ||
//         !students.length ||
//         !questions.length ||
//         !dates.length
//     ){
//         console.log("Faltan datos en la BD");
//         return;
//     }
//     for (let i = 1; i<= 3; i++){
//         const subject = subjects[i % subjects.length]
//         const teacher = teachers[i % teachers.length]
//         const head_teacher = head_teachers[i % head_teachers.length]
//         const parameter = parameters[i % parameters.length]
//         const date = dates[i % dates.length]

//         const exam = await db.exam.create({
//         data: {
//             name: `Examen ${i} - ${subject.name}`,
//             status: i === 1 ? 'aprobado' : i === 2 ? 'pendiente' : 'no_asignado',
//             difficulty: i === 1 ? 'facil' : i === 2 ? 'media' : 'dificil',
//             subject_id: subject.id,
//             teacher_id: teacher.id,
//             head_teacher_id: head_teacher.id,
//             parameters_id: parameter.id,
//         },
//     })
//     console.log(`Examen creado: ${exam.name}`);

//     const exam_questions = questions.slice(0, Math.min(3,questions.length))
//     for (const q of exam_questions){
//         await db.exam_Question.create({
//             data:{
//                 exam_id: exam.id,
//                 question_id: q.id,
//             },
//         })
//     }

//     const exam_students = students.slice(0, Math.min(5,students.length))
//     for (const student of exam_students) {
//             await db.exam_Student.create({
//             data: {
//                 exam_id: exam.id,
//                 student_id: student.id,
//                 teacher_id: teacher.id,
//                 score: Math.round(Math.random() * 50 + 50),
//             },
//         })
//     }

//     for (const q of exam_questions){
//         await db.answer.create({
//             data: {
//                 exam_id: exam.id,
//                 question_id: q.id,
//                 student_id: exam_students[0].id,
//                 answer_text: `Respuesta del estudiante ${exam_students[0].id} para la pregunta ${q.id}`,
//             },
//         })
//     }

//     await db.reevaluation.create({
//         data: {
//             exam_id: exam.id,
//             student_id: students.id,
//             teacher_id: teacher.id,
//             score : exam_students.[0].score + 5,
//         },
//     })

//     await db.approved_Exam.create({
//         data:{
//             date_id: date.id,
//             exam_id: exam.id,
//             head_teacher_id: head_teacher.id,
//             guidelines: 'Revisado y aprobado por jefe de asigantura.',
//         },
//     })
//     }

//     console.log('semillas creadas.')
// }
