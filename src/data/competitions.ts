interface Competition {
  id: string;
  name: string;
  category: string;
  level: string;
  organizer: string;
  target: string;
  officialWebsite: string;
  rules: string;
  time: string;
  content: string;
  description: string;
}

export const competitions: Competition[] = [
  {
    id: '1',
    name: '全国青少年科技创新大赛',
    category: '科技创新',
    level: '国家级',
    organizer: '中国科学技术协会、教育部、科学技术部等',
    target: '全国中小学生',
    officialWebsite: 'https://www.cyscc.org/',
    rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：科技创新作品、科技实践活动、科幻画\n3. 评选标准：创新性、科学性、实用性\n4. 报名时间：每年3-4月\n5. 比赛时间：每年7-8月',
    time: '每年7-8月',
    content: '包括科技创新作品展示、科技实践活动汇报、科幻画评选等环节，旨在培养青少年的科学创新精神和实践能力。',
    description: '全国青少年科技创新大赛是由中国科学技术协会、教育部、科学技术部等部门共同主办的全国性青少年科技竞赛活动。'
  },
  {
    id: '2',
    name: '全国中小学生电脑制作活动',
    category: '信息技术',
    level: '国家级',
    organizer: '教育部',
    target: '全国中小学生',
    officialWebsite: 'https://www.wacc.edu.cn/',
    rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：电脑绘画、电脑动画、网页设计、程序设计等\n3. 评选标准：创意性、技术性、艺术性\n4. 报名时间：每年1-3月\n5. 比赛时间：每年5-6月',
    time: '每年5-6月',
    content: '包括电脑绘画、电脑动画、网页设计、程序设计等多个类别，旨在提高青少年的信息技术应用能力和创新能力。',
    description: '全国中小学生电脑制作活动是由教育部主办的全国性信息技术教育应用成果展示活动。'
  },
  {
    id: '3',
    name: '全国青少年机器人竞赛',
    category: '机器人',
    level: '国家级',
    organizer: '中国科学技术协会',
    target: '全国中小学生',
    officialWebsite: 'https://www.crc.org.cn/',
    rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：机器人创意设计、机器人足球赛、机器人综合技能赛等\n3. 评选标准：创新性、技术难度、完成度\n4. 报名时间：每年3-4月\n5. 比赛时间：每年7-8月',
    time: '每年7-8月',
    content: '包括机器人创意设计、机器人足球赛、机器人综合技能赛等多个项目，旨在培养青少年的科技创新能力和团队协作精神。',
    description: '全国青少年机器人竞赛是由中国科学技术协会主办的全国性青少年机器人竞赛活动。'
  },
  {
    id: '4',
    name: '全国青少年信息学奥林匹克竞赛',
    category: '信息学',
    level: '国家级',
    organizer: '中国计算机学会',
    target: '全国中学生',
    officialWebsite: 'https://www.noi.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：程序设计\n3. 评选标准：算法正确性、程序效率、代码质量\n4. 报名时间：每年3-4月\n5. 比赛时间：每年7-8月',
    time: '每年7-8月',
    content: '主要考察学生的算法设计、程序编写能力，分为初赛、复赛和决赛三个阶段。',
    description: '全国青少年信息学奥林匹克竞赛是由中国计算机学会主办的全国性青少年信息学竞赛活动。'
  },
  {
    id: '5',
    name: '全国青少年数学奥林匹克竞赛',
    category: '数学',
    level: '国家级',
    organizer: '中国数学会',
    target: '全国中学生',
    officialWebsite: 'https://www.cmo.org.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：数学解题\n3. 评选标准：解题正确性、方法创新性\n4. 报名时间：每年9-10月\n5. 比赛时间：每年11月',
    time: '每年11月',
    content: '主要考察学生的数学思维能力和解题能力，分为预赛、联赛和决赛三个阶段。',
    description: '全国青少年数学奥林匹克竞赛是由中国数学会主办的全国性青少年数学竞赛活动。'
  },
  {
    id: '6',
    name: '全国青少年物理奥林匹克竞赛',
    category: '物理',
    level: '国家级',
    organizer: '中国物理学会',
    target: '全国中学生',
    officialWebsite: 'https://www.cpho.org.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：物理实验和理论考试\n3. 评选标准：实验操作能力、理论知识掌握程度\n4. 报名时间：每年9-10月\n5. 比赛时间：每年10-11月',
    time: '每年10-11月',
    content: '主要考察学生的物理实验操作能力和理论知识掌握程度，分为预赛、复赛和决赛三个阶段。',
    description: '全国青少年物理奥林匹克竞赛是由中国物理学会主办的全国性青少年物理竞赛活动。'
  },
  {
    id: '7',
    name: '全国青少年化学奥林匹克竞赛',
    category: '化学',
    level: '国家级',
    organizer: '中国化学会',
    target: '全国中学生',
    officialWebsite: 'https://www.chemsoc.org.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：化学实验和理论考试\n3. 评选标准：实验操作能力、理论知识掌握程度\n4. 报名时间：每年9-10月\n5. 比赛时间：每年10-11月',
    time: '每年10-11月',
    content: '主要考察学生的化学实验操作能力和理论知识掌握程度，分为预赛、复赛和决赛三个阶段。',
    description: '全国青少年化学奥林匹克竞赛是由中国化学会主办的全国性青少年化学竞赛活动。'
  },
  {
    id: '8',
    name: '全国青少年生物奥林匹克竞赛',
    category: '生物',
    level: '国家级',
    organizer: '中国动物学会、中国植物学会',
    target: '全国中学生',
    officialWebsite: 'https://www.cbo.org.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：生物实验和理论考试\n3. 评选标准：实验操作能力、理论知识掌握程度\n4. 报名时间：每年9-10月\n5. 比赛时间：每年10-11月',
    time: '每年10-11月',
    content: '主要考察学生的生物实验操作能力和理论知识掌握程度，分为预赛、复赛和决赛三个阶段。',
    description: '全国青少年生物奥林匹克竞赛是由中国动物学会、中国植物学会主办的全国性青少年生物竞赛活动。'
  },
  {
    id: '9',
    name: '全国青少年地理奥林匹克竞赛',
    category: '地理',
    level: '国家级',
    organizer: '中国地理学会',
    target: '全国中学生',
    officialWebsite: 'https://www.cgs.org.cn/',
    rules: '1. 参赛对象：全国中学生\n2. 参赛项目：地理知识竞赛、地理实践活动\n3. 评选标准：知识掌握程度、实践能力\n4. 报名时间：每年9-10月\n5. 比赛时间：每年11-12月',
    time: '每年11-12月',
    content: '主要考察学生的地理知识掌握程度和地理实践能力，分为初赛、复赛和决赛三个阶段。',
    description: '全国青少年地理奥林匹克竞赛是由中国地理学会主办的全国性青少年地理竞赛活动。'
  },
  {
    id: '10',
    name: '全国青少年英语能力竞赛',
    category: '外语',
    level: '国家级',
    organizer: '中国教育学会外语教学专业委员会',
    target: '全国中小学生',
    officialWebsite: 'https://www.english竞赛.com/',
    rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：英语听力、口语、阅读、写作\n3. 评选标准：语言能力、表达能力\n4. 报名时间：每年9-10月\n5. 比赛时间：每年11-12月',
    time: '每年11-12月',
    content: '主要考察学生的英语听力、口语、阅读和写作能力，分为初赛、复赛和决赛三个阶段。',
    description: '全国青少年英语能力竞赛是由中国教育学会外语教学专业委员会主办的全国性青少年英语竞赛活动。'
  }
];
