import { NextApiRequest, NextApiResponse } from 'next';

// 模拟数据库连接和查询
const executeSql = async (query: string) => {
  // 实际项目中，这里应该使用真实的数据库连接
  console.log('Executing SQL:', query);
  
  // 模拟返回数据
  return [
    {
      id: '1',
      name: '全国青少年科技创新大赛',
      category: '科技创新',
      level: '国家级',
      organizer: '中国科学技术协会、教育部、科学技术部等',
      target: '全国中小学生',
      official_website: 'https://www.cyscc.org/',
      rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：科技创新作品、科技实践活动、科幻画\n3. 评选标准：创新性、科学性、实用性\n4. 报名时间：每年3-4月\n5. 比赛时间：每年7-8月',
      time: '每年7-8月',
      content: '包括科技创新作品展示、科技实践活动汇报、科幻画评选等环节，旨在培养青少年的科学创新精神和实践能力。',
      description: '全国青少年科技创新大赛是由中国科学技术协会、教育部、科学技术部等部门共同主办的全国性青少年科技竞赛活动。',
      publish_date: '2026-03-20',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: '全国中小学生电脑制作活动',
      category: '信息技术',
      level: '国家级',
      organizer: '教育部',
      target: '全国中小学生',
      official_website: 'https://www.wacc.edu.cn/',
      rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：电脑绘画、电脑动画、网页设计、程序设计等\n3. 评选标准：创意性、技术性、艺术性\n4. 报名时间：每年1-3月\n5. 比赛时间：每年5-6月',
      time: '每年5-6月',
      content: '包括电脑绘画、电脑动画、网页设计、程序设计等多个类别，旨在提高青少年的信息技术应用能力和创新能力。',
      description: '全国中小学生电脑制作活动是由教育部主办的全国性信息技术教育应用成果展示活动。',
      publish_date: '2026-03-15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: '全国青少年机器人竞赛',
      category: '机器人',
      level: '国家级',
      organizer: '中国科学技术协会',
      target: '全国中小学生',
      official_website: 'https://www.crc.org.cn/',
      rules: '1. 参赛对象：全国中小学生\n2. 参赛项目：机器人创意设计、机器人足球赛、机器人综合技能赛等\n3. 评选标准：创新性、技术难度、完成度\n4. 报名时间：每年3-4月\n5. 比赛时间：每年7-8月',
      time: '每年7-8月',
      content: '包括机器人创意设计、机器人足球赛、机器人综合技能赛等多个项目，旨在培养青少年的科技创新能力和团队协作精神。',
      description: '全国青少年机器人竞赛是由中国科学技术协会主办的全国性青少年机器人竞赛活动。',
      publish_date: '2026-03-10',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ success: false, error: 'Query is required' });
      }
      
      const result = await executeSql(query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Error executing SQL:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
