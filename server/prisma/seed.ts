import { PrismaClient, Role, ApplicationStatus, LessonFormat, LessonStatus, HomeworkStatus, PaymentStatus, MaterialType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.payment.deleteMany()
  await prisma.material.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.student.deleteMany()
  await prisma.application.deleteMany()
  await prisma.user.deleteMany()

  const hash = (pwd: string) => bcrypt.hashSync(pwd, 10)

  // Tutor
  await prisma.user.create({
    data: {
      fullName: 'Анна Соколова',
      email: 'tutor@tutor.ru',
      passwordHash: hash('tutor123'),
      phone: '+7 916 123 45 67',
      role: Role.TUTOR,
      avatarUrl: null,
    }
  })

  // Students
  const studentUsers = [
    { fullName: 'Алина Смирнова', email: 'alina@student.ru', phone: '+7 926 234 56 78', subject: 'Математика', level: '9 класс', notes: 'Готовится к ОГЭ. Слабые стороны — геометрия.' },
    { fullName: 'Даниил Петров', email: 'daniil@student.ru', phone: '+7 916 345 67 89', subject: 'Физика', level: '11 класс', notes: 'Поступление в университет. Целевая оценка — 90+.' },
    { fullName: 'Мария Иванова', email: 'maria@student.ru', phone: '+7 905 456 78 90', subject: 'Английский язык', level: 'Upper-Intermediate', notes: 'Готовится к IELTS. Целевой балл 7.0.' },
    { fullName: 'Анастасия Козлова', email: 'nastya@student.ru', phone: '+7 917 567 89 01', subject: 'Химия', level: '10 класс', notes: 'Профильный класс. Олимпиадная подготовка.' },
    { fullName: 'Тимур Волков', email: 'timur@student.ru', phone: '+7 928 678 90 12', subject: 'Математика', level: '8 класс', notes: 'Устраняем пробелы по алгебре.' },
  ]

  const createdStudents = []
  for (const su of studentUsers) {
    const user = await prisma.user.create({
      data: {
        fullName: su.fullName,
        email: su.email,
        passwordHash: hash('student123'),
        phone: su.phone,
        role: Role.STUDENT,
      }
    })
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        subject: su.subject,
        level: su.level,
        notes: su.notes,
      }
    })
    createdStudents.push(student)
  }

  // Applications
  await prisma.application.createMany({
    data: [
      { name: 'Евгений Беляев', phone: '+7 916 111 22 33', email: 'evgeny@mail.ru', subject: 'Математика', level: '10 класс', preferredTime: 'Вечер, будни', message: 'Нужна подготовка к ЕГЭ', status: ApplicationStatus.NEW },
      { name: 'Карина Лебедева', phone: '+7 905 222 33 44', email: 'karina@gmail.com', subject: 'Английский язык', level: 'Beginner', preferredTime: 'Выходные', message: 'Хочу начать с нуля', status: ApplicationStatus.IN_PROGRESS },
      { name: 'Николай Михайлов', phone: '+7 917 333 44 55', email: null, subject: 'Физика', level: '11 класс', preferredTime: 'Утро', message: 'Готовлюсь к ЕГЭ по физике', status: ApplicationStatus.APPROVED },
      { name: 'Диана Соловьёва', phone: '+7 926 444 55 66', email: 'diana@mail.ru', subject: 'Химия', level: '9 класс', preferredTime: 'Любое время', message: null, status: ApplicationStatus.NEW },
      { name: 'Артём Жуков', phone: '+7 928 555 66 77', email: 'artem@mail.ru', subject: 'Математика', level: '7 класс', preferredTime: 'После 16:00', message: 'Нужна помощь с дробями и уравнениями', status: ApplicationStatus.REJECTED },
    ]
  })

  // Lessons for student[0] (Алина, Математика)
  const now = new Date()
  const lessons = []
  const lessonData = [
    { title: 'Тригонометрия: основные формулы', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14), startTime: '16:00', endTime: '17:30', status: LessonStatus.COMPLETED, price: 2500 },
    { title: 'Геометрия: теорема Пифагора', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), startTime: '16:00', endTime: '17:30', status: LessonStatus.COMPLETED, price: 2500 },
    { title: 'Алгебра: квадратные уравнения', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), startTime: '16:00', endTime: '17:30', status: LessonStatus.SCHEDULED, price: 2500 },
    { title: 'Функции и графики', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9), startTime: '16:00', endTime: '17:30', status: LessonStatus.SCHEDULED, price: 2500 },
  ]

  for (const ld of lessonData) {
    const lesson = await prisma.lesson.create({
      data: {
        studentId: createdStudents[0].id,
        title: ld.title,
        date: ld.date,
        startTime: ld.startTime,
        endTime: ld.endTime,
        format: LessonFormat.ONLINE,
        status: ld.status,
        price: ld.price,
      }
    })
    lessons.push(lesson)
  }

  // Lessons for student[1] (Даниил, Физика)
  const lessonData2 = [
    { title: 'Механика: законы Ньютона', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10), startTime: '18:00', endTime: '19:30', status: LessonStatus.COMPLETED, price: 3000 },
    { title: 'Электростатика', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), startTime: '18:00', endTime: '19:30', status: LessonStatus.SCHEDULED, price: 3000 },
  ]
  for (const ld of lessonData2) {
    await prisma.lesson.create({
      data: { studentId: createdStudents[1].id, title: ld.title, date: ld.date, startTime: ld.startTime, endTime: ld.endTime, format: LessonFormat.ONLINE, status: ld.status, price: ld.price }
    })
  }

  // Lessons for student[2] (Мария, English)
  await prisma.lesson.create({
    data: { studentId: createdStudents[2].id, title: 'IELTS Writing Task 2', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), startTime: '10:00', endTime: '11:30', format: LessonFormat.ONLINE, status: LessonStatus.SCHEDULED, price: 3500 }
  })

  // Homework
  await prisma.homework.createMany({
    data: [
      { studentId: createdStudents[0].id, lessonId: lessons[0].id, title: 'Задачи по тригонометрии', description: 'Решить задачи 1–20 из сборника ЕГЭ, стр. 45–48', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), status: HomeworkStatus.REVIEWED },
      { studentId: createdStudents[0].id, lessonId: lessons[1].id, title: 'Геометрия: практика', description: 'Задачи на теорему Пифагора, вариант 3', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), status: HomeworkStatus.SUBMITTED },
      { studentId: createdStudents[0].id, title: 'Подготовка к следующему занятию', description: 'Повторить формулы дискриминанта', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), status: HomeworkStatus.ASSIGNED },
      { studentId: createdStudents[1].id, title: 'Задачи по механике', description: 'Решить 10 задач на 2-й закон Ньютона', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), status: HomeworkStatus.ASSIGNED },
      { studentId: createdStudents[2].id, title: 'Writing practice', description: 'Написать эссе на тему "Technology and education" (250 слов)', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), status: HomeworkStatus.ASSIGNED },
    ]
  })

  // Materials
  await prisma.material.createMany({
    data: [
      { title: 'Сборник задач ЕГЭ по математике 2024', description: 'Официальный сборник тестовых заданий', type: MaterialType.DOCUMENT, url: null, fileUrl: '/uploads/ege_math_2024.pdf', subject: 'Математика', studentId: null },
      { title: 'Формулы тригонометрии — шпаргалка', description: 'Все основные формулы на одном листе', type: MaterialType.DOCUMENT, fileUrl: '/uploads/trig_formulas.pdf', subject: 'Математика', studentId: createdStudents[0].id },
      { title: 'Khan Academy — Физика', description: 'Ссылка на раздел физики Khan Academy', type: MaterialType.LINK, url: 'https://khanacademy.org/science/physics', subject: 'Физика', studentId: createdStudents[1].id },
      { title: 'IELTS Writing Band Descriptors', description: 'Официальные критерии оценки эссе', type: MaterialType.DOCUMENT, fileUrl: '/uploads/ielts_writing.pdf', subject: 'Английский язык', studentId: createdStudents[2].id },
      { title: 'Таблица Менделеева — интерактивная', description: 'Удобная онлайн таблица с описанием элементов', type: MaterialType.LINK, url: 'https://ptable.com', subject: 'Химия', studentId: null },
    ]
  })

  // Payments
  await prisma.payment.createMany({
    data: [
      { studentId: createdStudents[0].id, amount: 5000, paymentDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10), status: PaymentStatus.PAID, comment: '2 занятия' },
      { studentId: createdStudents[0].id, amount: 2500, paymentDate: null, status: PaymentStatus.PENDING, comment: 'Занятие 12 апреля' },
      { studentId: createdStudents[1].id, amount: 3000, paymentDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8), status: PaymentStatus.PAID, comment: '1 занятие' },
      { studentId: createdStudents[1].id, amount: 3000, paymentDate: null, status: PaymentStatus.PENDING, comment: 'Занятие 13 апреля' },
      { studentId: createdStudents[2].id, amount: 7000, paymentDate: null, status: PaymentStatus.OVERDUE, comment: '2 занятия, оплата просрочена' },
      { studentId: createdStudents[3].id, amount: 4000, paymentDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), status: PaymentStatus.PAID, comment: '2 занятия' },
      { studentId: createdStudents[4].id, amount: 2500, paymentDate: null, status: PaymentStatus.PENDING },
    ]
  })

  console.log('✅ Seed completed successfully')
  console.log('📧 Tutor login: tutor@tutor.ru / tutor123')
  console.log('📧 Student login: alina@student.ru / student123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
