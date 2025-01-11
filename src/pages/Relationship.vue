<template>
  <div class="page-container">
    <div id="main"></div>
  </div>
</template>

<script lang="ts" setup name="Relationship">
import * as echarts from 'echarts';
import { onMounted } from 'vue';

interface Node {
  id: number;
  name: string;
  iscore?: boolean;
  isundercover?: boolean;
  symbol: string;
  symbolSize: number;
  label: { show: boolean };
}

interface Link {
  source: number;
  target: number;
  label: { show: boolean; formatter: string; fontSize: number };
  lineStyle: { color: string; width: number };
}

interface RelationshipType {
  label: string;
  color: string;
}

const relationshipTypes: Record<string, RelationshipType> = {
  love: { label: '恋人', color: '#FF0000' },
  love_before: { label: '前恋人', color: '#FFA500' },
  small: { label: '灌药缩小', color: '#00FF00' },
  teen_zhentan_team: { label: '少年侦探团', color: '#FFFF00' },
  partner: { label: '合作', color: '#FF00AA' },
  friend: { label: '朋友', color: '#00FFFF' },
  relative: { label: '亲人', color: '#FF6000' },
  colleague: { label: '同事', color: '#0880FF' },
  teacher: { label: '老师', color: '#800080' },
  boss: { label: '上司', color: '#008000' },
  false_identity: { label: '真实身份', color: '#AA1200' },
  enemy: { label: '宿敌', color: '#123456' },
  kill: { label: '杀死', color: '#987654' },
  break: { label: '关系破裂', color: '#654321' },
  classmate: { label: '同学', color: '#CCBB00' },
  like: { label: '爱慕', color: '#BBEE91' },
  idol: { label: '偶像', color: '#FF0FFF' },
  investigate: { label: '调查', color: '#FF0F0F' },
  hate: { label: '憎恨', color: '#0F0FFF' },
};

const nodes: Node[] = [
  // 节点数据
  { id: 0, name: '江户川柯南', iscore: true, symbol: 'image://https://www.conanpedia.com/images/d/d8/CHARACTER_LIST_%E6%B1%9F%E6%88%B7%E5%B7%9D%E6%9F%AF%E5%8D%97.png', symbolSize: 60, label: { show: false } },
  { id: 1, name: '工藤新一', iscore:true,symbol: 'image://https://www.conanpedia.com/images/4/43/CHARACTER_LIST_%E5%B7%A5%E8%97%A4%E6%96%B0%E4%B8%80.png', symbolSize: 60, label: { show: false }},
  { id: 2, name: '毛利兰', symbol: 'image://https://www.conanpedia.com/images/1/15/CHARACTER_LIST_%E6%AF%9B%E5%88%A9%E5%85%B0.png',symbolSize: 60 , label: { show: false }},
  { id: 3, name: '毛利小五郎', symbol: 'image://https://www.conanpedia.com/images/4/4a/CHARACTER_LIST_%E6%AF%9B%E5%88%A9%E5%B0%8F%E4%BA%94%E9%83%8E.png',symbolSize: 60 , label: { show: false }},
  { id: 4, name: '阿笠博士', symbol: 'image://https://www.conanpedia.com/images/f/fc/CHARACTER_LIST_%E9%98%BF%E7%AC%A0%E5%8D%9A%E5%A3%AB.png',symbolSize: 60 , label: { show: false }},
  { id: 5, name: '灰原哀', symbol: 'image://https://www.conanpedia.com/images/8/8d/CHARACTER_LIST_%E7%81%B0%E5%8E%9F%E5%93%80.png',symbolSize: 60 , label: { show: false }},
  { id: 6, name: '吉田步美', symbol: 'image://https://www.conanpedia.com/images/2/2a/CHARACTER_LIST_%E5%90%89%E7%94%B0%E6%AD%A5%E7%BE%8E.png',symbolSize: 60 , label: { show: false }},
  { id: 7, name: '圆谷光彦', symbol: 'image://https://www.conanpedia.com/images/8/83/CHARACTER_LIST_%E5%9C%86%E8%B0%B7%E5%85%89%E5%BD%A6.png',symbolSize: 60, label: { show: false }},
  { id: 8, name: '小岛元太', symbol: 'image://https://www.conanpedia.com/images/7/71/CHARACTER_LIST_%E5%B0%8F%E5%B2%9B%E5%85%83%E5%A4%AA.png',symbolSize: 60, label: { show: false }},
  { id: 9, name: '铃木园子', symbol: 'image://https://www.conanpedia.com/images/f/fe/CHARACTER_LIST_%E9%93%83%E6%9C%A8%E5%9B%AD%E5%AD%90.png',symbolSize: 60, label: { show: false }},
  { id: 10, name: '京极真', symbol: 'image://https://www.conanpedia.com/images/1/13/CHARACTER_LIST_%E4%BA%AC%E6%9E%81%E7%9C%9F.png',symbolSize: 60, label: { show: false }},
  { id: 11, name: '服部平次', symbol: 'image://https://www.conanpedia.com/images/2/2b/CHARACTER_LIST_%E6%9C%8D%E9%83%A8%E5%B9%B3%E6%AC%A1.png',symbolSize: 60, label: { show: false }},
  { id: 12, name: '远山和叶', symbol: 'image://https://www.conanpedia.com/images/f/fb/%E8%BF%9C%E5%B1%B1%E5%92%8C%E5%8F%B6.png',symbolSize: 60, label: { show: false }},
  { id: 13, name: '世良真纯', symbol: 'image://https://www.conanpedia.com/images/8/8e/CHARACTER_LIST_%E4%B8%96%E8%89%AF%E7%9C%9F%E7%BA%AF_1.png',symbolSize: 60, label: { show: false }},
  { id: 14, name: '赤井秀一', iscore:true,isundercover:true, symbol: 'image://https://www.conanpedia.com/images/a/a3/CHARACTER_LIST_%E8%B5%A4%E4%BA%95%E7%A7%80%E4%B8%80_1.png',symbolSize: 60, label: { show: false }},
  { id: 15, name: '安室透', iscore:true,isundercover:true, symbol: 'image://https://www.conanpedia.com/images/4/44/CHARACTER_LIST_%E9%99%8D%E8%B0%B7%E9%9B%B6.png',symbolSize: 60, label: { show: false }},
  { id: 16, name: '怪盗基德', iscore:true,symbol: 'image://https://www.conanpedia.com/images/7/7b/CHARACTER_LIST_%E6%80%AA%E7%9B%97%E5%9F%BA%E5%BE%B7.png',symbolSize: 60, label: { show: false }},
  { id: 17, name: '工藤优作', symbol: 'image://https://www.conanpedia.com/images/d/db/CHARACTER_LIST_%E5%B7%A5%E8%97%A4%E4%BC%98%E4%BD%9C.png',symbolSize: 60, label: { show: false }},
  { id: 18, name: '工藤有希子', symbol: 'image://https://www.conanpedia.com/images/b/bd/%E5%B7%A5%E8%97%A4%E6%9C%89%E5%B8%8C%E5%AD%90.png',symbolSize: 60, label: { show: false }},
  { id: 19, name: '妃英理', symbol: 'image://https://www.conanpedia.com/images/7/78/%E5%A6%83%E8%8B%B1%E7%90%86.png',symbolSize: 60, label: { show: false }},
  { id: 20, name: '宫野志保', symbol: 'image://https://www.conanpedia.com/images/3/3e/%E5%AE%AB%E9%87%8E%E5%BF%97%E4%BF%9D1.png',symbolSize: 60, label: { show: false }},
  { id: 21, name: '宫野明美', symbol: 'image://https://www.conanpedia.com/images/4/49/CHARACTER_LIST_%E5%AE%AB%E9%87%8E%E6%98%8E%E7%BE%8E.png',symbolSize: 60, label: { show: false }},
  { id: 22, name: '茱蒂·斯泰琳', symbol: 'image://https://www.conanpedia.com/images/4/40/CHARACTER_LIST_%E8%8C%B1%E8%92%82%C2%B7%E6%96%AF%E6%B3%B0%E7%90%B3.png',symbolSize: 60, label: { show: false }},
  { id: 23, name: '詹姆斯·布莱克', symbol: 'image://https://www.conanpedia.com/images/5/56/CHARACTER_LIST_%E8%A9%B9%E5%A7%86%E6%96%AF%C2%B7%E5%B8%83%E8%8E%B1%E5%85%8B.png',symbolSize: 60, label: { show: false }},
  { id: 24, name: '安德雷·卡迈尔', symbol: 'image://https://www.conanpedia.com/images/e/e5/CHARACTER_LIST_%E5%AE%89%E5%BE%B7%E9%9B%B7%C2%B7%E5%8D%A1%E8%BF%88%E5%B0%94.png',symbolSize: 60, label: { show: false }},
  { id: 25, name: '冲矢昴', symbol: 'image://https://www.conanpedia.com/images/d/dd/CHARACTER_LIST_%E5%86%B2%E7%9F%A2%E6%98%B4.png',symbolSize: 60, label: { show: false }},
  { id: 26, name: '黑羽盗一', symbol: 'image://https://www.conanpedia.com/images/d/d1/%E9%BB%91%E7%BE%BD%E7%9B%97%E4%B8%80.png',symbolSize: 60, label: { show: false }},
  { id: 27, name: '黑羽快斗', symbol: 'image://https://www.conanpedia.com/images/5/5f/%E9%BB%91%E7%BE%BD%E5%BF%AB%E6%96%97.png',symbolSize: 60, label: { show: false }},
  { id: 28, name: '黑田兵卫', symbol: 'image://https://www.conanpedia.com/images/f/fe/CHARACTER_LIST_%E9%BB%91%E7%94%B0%E5%85%B5%E5%8D%AB.png',symbolSize: 60, label: { show: false }},
  { id: 29, name: '目暮十三', symbol: 'image://https://www.conanpedia.com/images/f/f8/CHARACTER_LIST_%E7%9B%AE%E6%9A%AE%E5%8D%81%E4%B8%89.png',symbolSize: 60, label: { show: false }},
  { id: 30, name: '白鸟任三郎', symbol: 'image://https://www.conanpedia.com/images/f/f2/%E7%99%BD%E9%B8%9F%E4%BB%BB%E4%B8%89%E9%83%8E.png',symbolSize: 60, label: { show: false }},
  { id: 31, name: '佐藤美和子', symbol: 'image://https://www.conanpedia.com/images/e/e2/%E4%BD%90%E8%97%A4%E7%BE%8E%E5%92%8C%E5%AD%90.png',symbolSize: 60, label: { show: false }},
  { id: 32, name: '高木涉', symbol: 'image://https://www.conanpedia.com/images/e/eb/CHARACTER_LIST_%E9%AB%98%E6%9C%A8%E6%B6%89.png',symbolSize: 60, label: { show: false }},
  { id: 33, name: '千叶和伸', symbol: 'image://https://www.conanpedia.com/images/a/a6/CHARACTER_LIST_%E5%8D%83%E5%8F%B6%E5%92%8C%E4%BC%B8.png',symbolSize: 60, label: { show: false }},
  { id: 34, name: '服部平藏', symbol: 'image://https://www.conanpedia.com/images/0/08/CHARACTER_LIST_%E6%9C%8D%E9%83%A8%E5%B9%B3%E8%97%8F.png',symbolSize: 60, label: { show: false }},
  { id: 35, name: '远山银司郎', symbol: 'image://https://www.conanpedia.com/images/b/bc/%E8%BF%9C%E5%B1%B1%E9%93%B6%E5%8F%B8%E9%83%8E.png',symbolSize: 60, label: { show: false }},
  { id: 36, name: '大泷悟郎', symbol: 'image://https://www.conanpedia.com/images/0/00/%E5%A4%A7%E6%B3%B7%E6%82%9F%E9%83%8E.png',symbolSize: 60, label: { show: false }},
  { id: 37, name: '乌丸莲耶', symbol: 'image://https://www.conanpedia.com/images/8/8a/CHARACTER_LIST_%E4%B9%8C%E4%B8%B8%E8%8E%B2%E8%80%B6.png',symbolSize: 60, label: { show: false }},
  { id: 38, name: '朗姆', symbol: 'image://https://www.conanpedia.com/images/3/31/%E6%9C%97%E5%A7%86.png',symbolSize: 60, label: { show: false }},
  { id: 39, name: '琴酒', iscore:true,symbol: 'image://https://www.conanpedia.com/images/1/1e/CHARACTER_LIST_%E7%90%B4%E9%85%92.png',symbolSize: 60, label: { show: false }},
  { id: 40, name: '伏特加', symbol: 'image://https://www.conanpedia.com/images/7/77/CHARACTER_Vodka.png',symbolSize: 60, label: { show: false }},
  { id: 41, name: '贝尔摩德', symbol: 'image://https://www.conanpedia.com/images/a/a3/CHARACTER_LIST_%E8%B4%9D%E5%B0%94%E6%91%A9%E5%BE%B7.png',symbolSize: 60, label: { show: false }},
  { id: 42, name: '基安蒂', symbol: 'image://https://www.conanpedia.com/images/5/51/CHARACTER_LIST_%E5%9F%BA%E5%AE%89%E8%92%82.png',symbolSize: 60, label: { show: false }},
  { id: 43, name: '科恩', symbol: 'image://https://www.conanpedia.com/images/e/e1/CHARACTER_LIST_%E7%A7%91%E6%81%A9.png',symbolSize: 60, label: { show: false }},
  { id: 44, name: '宫野厚司', symbol: 'image://https://www.conanpedia.com/images/1/1b/CHARACTER_LIST_%E5%AE%AB%E9%87%8E%E5%8E%9A%E5%8F%B8.png',symbolSize: 60, label: { show: false }},
  { id: 45, name: '宫野艾莲娜', symbol: 'image://https://www.conanpedia.com/images/e/e4/CHARACTER_LIST_%E5%AE%AB%E9%87%8E%E8%89%BE%E8%8E%B2%E5%A8%9C.png',symbolSize: 60, label: { show: false }},
  { id: 46, name: '水无怜奈', isundercover:true, symbol: 'image://https://www.conanpedia.com/images/6/67/CHARACTER_LIST_%E6%B0%B4%E6%97%A0%E6%80%9C%E5%A5%88.png',symbolSize: 60, label: { show: false }},
  { id: 47, name: '胁田兼则', symbol: 'image://https://www.conanpedia.com/images/3/31/CHARACTER_LIST_%E8%83%81%E7%94%B0%E5%85%BC%E5%88%99.png',symbolSize: 60, label: { show: false }},
  { id: 48, name: '赤井玛丽', symbol: 'image://https://www.conanpedia.com/images/0/01/CHARACTER_LIST_%E8%B5%A4%E4%BA%95%E7%8E%9B%E4%B8%BD.png',symbolSize: 60, label: { show: false }},
  { id: 49, name: '皮斯克', symbol: 'image://https://www.conanpedia.com/images/8/85/CHARACTER_LIST_%E7%9A%AE%E6%96%AF%E5%85%8B.png',symbolSize: 60, label: { show: false }},
  { id: 50, name: '伊森本堂', symbol: 'image://https://www.conanpedia.com/images/a/a1/CHARACTER_LIST_%E4%BC%8A%E6%A3%AE%C2%B7%E6%9C%AC%E5%A0%82.png',symbolSize: 60, label: { show: false }},
  { id: 51, name: '中森银三', symbol: 'image://https://www.conanpedia.com/images/b/bd/%E4%B8%AD%E6%A3%AE%E9%93%B6%E4%B8%89.png',symbolSize: 60, label: { show: false }},
  { id: 52, name: '中森青子', symbol: 'image://https://www.conanpedia.com/images/a/ad/%E4%B8%AD%E6%A3%AE%E9%9D%92%E5%AD%90.png',symbolSize: 60, label: { show: false }},
  { id: 53, name: '赤井务武', symbol: 'image://https://www.conanpedia.com/images/9/9c/CHARACTER_LIST_%E8%B5%A4%E4%BA%95%E5%8A%A1%E6%AD%A6.png',symbolSize: 60, label: { show: false }},
  { id: 54, name: '冲田总司', symbol: 'image://https://www.conanpedia.com/images/7/70/%E5%86%B2%E7%94%B0%E6%80%BB%E5%8F%B8.png',symbolSize: 60, label: { show: false }},
  { id: 55, name: '大冈红叶', symbol: 'image://https://www.conanpedia.com/images/5/53/Momiji.png',symbolSize: 60, label: { show: false }},
  { id: 56, name: '宫本由美', symbol: 'image://https://www.conanpedia.com/images/e/ed/CHARACTER_LIST_%E5%AE%AB%E6%9C%AC%E7%94%B1%E7%BE%8E.png',symbolSize: 60, label: { show: false }},
  { id: 57, name: '三池苗子', symbol: 'image://https://www.conanpedia.com/images/8/8d/%E4%B8%89%E6%B1%A0%E8%8B%97%E5%AD%90_1.png',symbolSize: 60, label: { show: false }},
  { id: 58, name: '羽田秀吉', symbol: 'image://https://www.conanpedia.com/images/b/b2/CHARACTER_Haneda_Shukichi.png',symbolSize: 60, label: { show: false }},
  { id: 59, name: '铃木次郎吉', symbol: 'image://https://www.conanpedia.com/images/e/ea/%E9%93%83%E6%9C%A8%E6%AC%A1%E9%83%8E%E5%90%89.png',symbolSize: 60, label: { show: false }},
  { id: 60, name: '冲野洋子', symbol: 'image://https://www.conanpedia.com/images/9/91/CHARACTER_LIST_%E5%86%B2%E9%87%8E%E6%B4%8B%E5%AD%90.png',symbolSize: 60, label: { show: false }},
  { id: 61, name: '鬼冢八藏', symbol: 'image://https://www.conanpedia.com/images/3/3d/CHARACTER_LIST_%E9%AC%BC%E5%86%A2%E5%85%AB%E8%97%8F.png',symbolSize: 60, label: { show: false }},
  { id: 62, name: '诸伏景光', symbol: 'image://https://www.conanpedia.com/images/8/85/CHARACTER_LIST_%E8%AF%B8%E4%BC%8F%E6%99%AF%E5%85%89.png',symbolSize: 60, label: { show: false }},
  { id: 63, name: '松田阵平', symbol: 'image://https://www.conanpedia.com/images/6/69/CHARACTER_LIST_%E6%9D%BE%E7%94%B0%E9%98%B5%E5%B9%B3.png',symbolSize: 60, label: { show: false }},
  { id: 64, name: '萩原研二', symbol: 'image://https://www.conanpedia.com/images/f/f1/CHARACTER_LIST_%E8%90%A9%E5%8E%9F%E7%A0%94%E4%BA%8C.png',symbolSize: 60, label: { show: false }},
  { id: 65, name: '伊达航', symbol: 'image://https://www.conanpedia.com/images/a/a3/CHARACTER_LIST_%E4%BC%8A%E8%BE%BE%E8%88%AA.png',symbolSize: 60, label: { show: false }},
];

const links: Link[] = [
  // 链接数据
  { source: 1, target: 0, label: { show: false, formatter: relationshipTypes.small.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.small.color, width: 1 } },
  { source: 1, target: 2, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 2, target: 3, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 4, target: 5, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 4, target: 0, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 0, target: 5, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 2, target: 9, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 9, target: 10, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 1, target: 11, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 11, target: 12, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 2, target: 12, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 9, target: 12, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 17, target: 18, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 1, target: 17, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 1, target: 18, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 3, target: 19, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 2, target: 19, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 20, target: 5, label: { show: false, formatter: relationshipTypes.small.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.small.color, width: 1 } },
  { source: 14, target: 13, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 14, target: 20, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 0, target: 16, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 20, target: 21, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 14, target: 21, label: { show: false, formatter: relationshipTypes.love_before.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love_before.color, width: 1 } },
  { source: 14, target: 22, label: { show: false, formatter: relationshipTypes.love_before.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love_before.color, width: 1 } },
  // { source: 22, target: 14, label: { show: false, formatter: relationshipTypes.colleague.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.colleague.color, width: 1 } },
  { source: 22, target: 2, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 22, target: 9, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 23, target: 14, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 23, target: 22, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 23, target: 24, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 25, target: 14, label: { show: false, formatter: relationshipTypes.false_identity.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.false_identity.color, width: 1 } },
  { source: 25, target: 4, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 16, target: 27, label: { show: false, formatter: relationshipTypes.false_identity.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.false_identity.color, width: 1 } },
  { source: 26, target: 27, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 26, target: 17, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 28, target: 29, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 29, target: 30, label: { show: false, formatter: relationshipTypes.colleague.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.colleague.color, width: 1 } },
  { source: 29, target: 31, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 29, target: 32, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 29, target: 33, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 31, target: 32, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 3, target: 29, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 34, target: 35, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 34, target: 36, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 34, target: 11, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 35, target: 12, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 47, target: 38, label: { show: false, formatter: relationshipTypes.false_identity.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.false_identity.color, width: 1 } },
  { source: 37, target: 38, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 37, target: 39, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 39, target: 40, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 39, target: 46, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 37, target: 41, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 26, target: 41, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 18, target: 41, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 39, target: 41, label: { show: false, formatter: relationshipTypes.colleague.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.colleague.color, width: 1 } },
  { source: 39, target: 14, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 39, target: 14, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 39, target: 21, label: { show: false, formatter: relationshipTypes.kill.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.kill.color, width: 1 } },
  { source: 39, target: 20, label: { show: false, formatter: relationshipTypes.break.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.break.color, width: 1 } },
  { source: 42, target: 43, label: { show: false, formatter: relationshipTypes.colleague.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.colleague.color, width: 1 } },
  { source: 44, target: 45, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 44, target: 20, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 44, target: 21, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 45, target: 20, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 45, target: 21, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 48, target: 45, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 48, target: 13, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 48, target: 14, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 38, target: 15, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 28, target: 15, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 3, target: 15, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 13, target: 2, label: { show: false, formatter: relationshipTypes.classmate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.classmate.color, width: 1 } },
  { source: 13, target: 1, label: { show: false, formatter: relationshipTypes.classmate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.classmate.color, width: 1 } },
  { source: 13, target: 0, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 37, target: 49, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 49, target: 44, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 49, target: 45, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 39, target: 49, label: { show: false, formatter: relationshipTypes.kill.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.kill.color, width: 1 } },
  { source: 46, target: 50, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 51, target: 16, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 51, target: 52, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 27, target: 52, label: { show: false, formatter: relationshipTypes.classmate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.classmate.color, width: 1 } },
  { source: 16, target: 0, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 53, target: 48, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 53, target: 13, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 53, target: 14, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 54, target: 55, label: { show: false, formatter: relationshipTypes.classmate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.classmate.color, width: 1 } },
  { source: 54, target: 11, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 55, target: 11, label: { show: false, formatter: relationshipTypes.like.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.like.color, width: 1 } },
  { source: 56, target: 57, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 56, target: 31, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 57, target: 33, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 58, target: 13, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 58, target: 14, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 53, target: 58, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 58, target: 48, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 58, target: 56, label: { show: false, formatter: relationshipTypes.love.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.love.color, width: 1 } },
  { source: 59, target: 9, label: { show: false, formatter: relationshipTypes.relative.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.relative.color, width: 1 } },
  { source: 59, target: 51, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 59, target: 16, label: { show: false, formatter: relationshipTypes.enemy.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.enemy.color, width: 1 } },
  { source: 60, target: 46, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 3, target: 60, label: { show: false, formatter: relationshipTypes.idol.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.idol.color, width: 1 } },
  { source: 5, target: 60, label: { show: false, formatter: relationshipTypes.idol.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.idol.color, width: 1 } },
  { source: 9, target: 16, label: { show: false, formatter: relationshipTypes.idol.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.idol.color, width: 1 } },
  { source: 61, target: 62, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 61, target: 63, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 61, target: 64, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 61, target: 65, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 61, target: 15, label: { show: false, formatter: relationshipTypes.teacher.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.teacher.color, width: 1 } },
  { source: 47, target: 3, label: { show: false, formatter: relationshipTypes.investigate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.investigate.color, width: 1 } },
  { source: 0, target: 48, label: { show: false, formatter: relationshipTypes.investigate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.investigate.color, width: 1 } },
  { source: 0, target: 15, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 15, target: 3, label: { show: false, formatter: relationshipTypes.investigate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.investigate.color, width: 1 } },
  { source: 15, target: 14, label: { show: false, formatter: relationshipTypes.hate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.hate.color, width: 1 } },
  { source: 6, target: 7, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 6, target: 8, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 7, target: 8, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 5, target: 6, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 5, target: 7, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 5, target: 8, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 0, target: 25, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 0, target: 39, label: { show: false, formatter: relationshipTypes.hate.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.hate.color, width: 1 } },
  { source: 0, target: 6, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 0, target: 7, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 0, target: 8, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 37, target: 43, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 38, target: 42, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 39, target: 42, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 35, target: 36, label: { show: false, formatter: relationshipTypes.boss.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.boss.color, width: 1 } },
  { source: 2, target: 4, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 2, target: 11, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 0, target: 3, label: { show: false, formatter: relationshipTypes.partner.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.partner.color, width: 1 } },
  { source: 18, target: 19, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
  { source: 1, target: 9, label: { show: false, formatter: relationshipTypes.friend.label, fontSize: 12 }, lineStyle: { color: relationshipTypes.friend.color, width: 1 } },
          
];

const groups: Record<string, number[]> = {
  少年侦探团: [0, 5, 6, 7, 8],
  FBI: [14, 22, 23, 24],
  警视厅刑事部搜查一课: [28, 29, 30, 31, 32, 33],
  大阪府警: [34, 35, 36],
  CIA: [46, 50],
  军情六处: [53, 48],
  警视厅交通部: [56, 57],
  警校五人组: [15, 62, 63, 64, 65],
  黑衣组织: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 14, 15, 20, 21, 49],
};

onMounted(() => {
  initChart();
});

function initChart() {
  const myChart = echarts.init(document.getElementById('main'));

  const option = {
    tooltip: {
      formatter: function (params: any) {
        if (params.dataType === 'node') {
          return params.data.name;
        } else if (params.dataType === 'edge') {
          return `${params.data.label.formatter}`;
        }
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        symbolSize: 50,
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: nodes,
        links: links,
        lineStyle: {
          color: 'gray',
          width: 1,
          curveness: 0.2
        },
        force: {
          repulsion: 3000,
          edgeLength: [100, 900],
        }
      }
    ]
  };

  myChart.setOption(option);

  // 鼠标悬停处理
  myChart.on('mouseover', function (params: any) {
    if (params.dataType === 'node') {
      const nodeId = params.data.id;
      const connectedNodes = new Set<number>();
      links.forEach(function (link) {
        if (link.source === nodeId) connectedNodes.add(link.target);
        if (link.target === nodeId) connectedNodes.add(link.source);
      });

      if (nodeId === 0 || nodeId === 1) {
        links.forEach(function (link) {
          if (link.source === 1 || link.source === 0) connectedNodes.add(link.target);
          if (link.target === 1 || link.target === 0) connectedNodes.add(link.source);
        });
      }

      let groupName: string | null = null;
      for (const key in groups) {
        if (groups[key].includes(nodeId)) {
          groupName = key;
          break;
        }
      }

      const updatedNodes = nodes.map(function (node) {
        const isUndercover = node.isundercover && groupName === "黑衣组织";
        const inBlackOrg = groupName === "黑衣组织" && groups[groupName].includes(node.id);
        const newSize = (groupName && groups[groupName].includes(node.id)) || connectedNodes.has(node.id) || node.id === nodeId ? (node.iscore ? node.symbolSize * 2.3 : node.symbolSize * 1.5) : node.symbolSize;
        return {
          ...node,
          symbolSize: newSize,
          itemStyle: inBlackOrg ? {
            color: 'rgba(255,255,255,0.1)',
            shadowBlur: 15,
            shadowColor: isUndercover ? 'red' : 'black'
          } : {},
          label: {
            show: (groupName && groups[groupName].includes(node.id)) || connectedNodes.has(node.id) || node.id === nodeId,
            formatter: groupName && groups[groupName].includes(node.id) ? groupName : '{b}',
            fontSize: 18,
          }
        };
      });

      const updatedLinks = links.map(function (link) {
        const newColor = ((nodeId === 0 || nodeId === 1) ? ((link.source === 1 || link.source === 0) || (link.target === 1 || link.source === 0)) : (link.source === nodeId || link.target === nodeId)) ? link.lineStyle.color : '#ddd';
        const showLabel = (nodeId === 0 || nodeId === 1) ? ((link.source === 1 || link.source === 0) || (link.target === 1 || link.source === 0)) : (link.source === nodeId || link.target === nodeId);
        return {
          ...link,
          lineStyle: {
            color: newColor,
            width: showLabel ? 3 : 1,
          },
          label: {
            show: showLabel,
            formatter: link.label.formatter,
            fontSize: 16,
            color: 'black',
            fontWeight: 'bold',
          }
        };
      });

      myChart.setOption({
        series: [{
          data: updatedNodes,
          links: updatedLinks
        }]
      });
    }
  });

  myChart.on('mouseout', function () {
    myChart.setOption({
      series: [{
        data: nodes,
        links: links
      }]
    });
  });
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.page-container {
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 100%;
  height: 100vh;
  position: relative;
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 40%, rgba(255, 255, 255, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 40%, rgba(255, 255, 255, 1) 100%);
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 1) 80%);
  z-index: -1;
  pointer-events: none;
}

#main {
  width: 100%;
  height: 100vh;
  margin: 0;
}
</style>