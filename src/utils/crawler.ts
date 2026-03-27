import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CrawledCompetition {
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
  publishDate: string;
}

export async function crawlMoeCompetitions(): Promise<CrawledCompetition[]> {
  try {
    const url = 'https://so.moe.gov.cn/s?qt=%E7%AB%9E%E8%B5%9B&siteCode=bm05000001&tab=all&toolsStatus=1';
    
    // 设置请求头，模拟浏览器访问
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive'
    };

    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    
    // 解析搜索结果
    const competitions: CrawledCompetition[] = [];
    
    // 这里需要根据实际的HTML结构进行解析
    // 由于没有实际的HTML结构，我们返回空数组
    // 实际项目中，需要根据真实的HTML结构调整选择器
    
    // 示例解析逻辑（实际项目中需要根据真实HTML结构调整）
    // $('.search-result-item').each((index, element) => {
    //   const title = $(element).find('.title').text().trim();
    //   const link = $(element).find('a').attr('href');
    //   const date = $(element).find('.date').text().trim();
    //   
    //   if (title) {
    //     competitions.push({
    //       id: (index + 1).toString(),
    //       name: title,
    //       category: '未知',
    //       level: '国家级',
    //       organizer: '教育部',
    //       target: '全国中小学生',
    //       officialWebsite: link || '',
    //       rules: '',
    //       time: '',
    //       content: '',
    //       description: '',
    //       publishDate: date || new Date().toISOString().split('T')[0]
    //     });
    //   }
    // });
    
    return competitions;
  } catch (error) {
    console.error('Crawling failed:', error);
    return [];
  }
}
