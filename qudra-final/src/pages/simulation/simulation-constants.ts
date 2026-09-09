export interface TaskItem {
  skill: string
  question: string
  hint: string
}

export const SIM_TASKS: TaskItem[] = [
  {
    skill: 'Product Thinking',
    question: 'ما أول شيء ستبنيه، ولماذا؟',
    hint: 'اكتب بمنطقك. لا نبحث عن مصطلحات — نبحث عن ترتيب أولويات مبرَّر.',
  },
  {
    skill: 'UI/UX',
    question: 'صف الشاشة الرئيسية للطالب: ماذا تعرض، وبأي ترتيب، ولماذا؟',
    hint: 'ما الذي يجب أن يراه الطالب في أول ثانيتين؟ ولماذا هذا وليس غيره؟',
  },
  {
    skill: 'Backend',
    question: 'ما البيانات التي ستخزّنها، وكيف تربط الطالب بمواده ومواعيدها؟',
    hint: 'لا نحتاج كودًا. نحتاج بنية واضحة والعلاقات بينها.',
  },
]

export const INITIAL_SIM_SECONDS = 15 * 60 - 28
