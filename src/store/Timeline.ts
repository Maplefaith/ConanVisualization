import { defineStore } from "pinia";
import type { TimelineEvent, TransitionPoint, RGB, ColorMap } from '../types/TimelineType';
export const useTimelineArrowStore = defineStore('Timeline',{

    state:() => ({
        BeforefilteredTimelineData: [
          {
            date: '1994-01-05',
            type: ['begin'],
            title: '漫画首刊',
            description: '《名侦探柯南》漫画连载开始，青山开启二十余年连载',
          },
        
          {
            date: '1996-01-08',
            type: ['begin'],
            title: '云霄飞车杀人事件',
            description: '工藤新一被黑暗组织灌药变小，开启传奇一生',
          },
          {
            date: '1996-01-15',
            type: ['begin'],
            title: '董事长千金绑架事件',
            description: '阿笠博士知道柯南身份；工藤新一化名为江户川柯南，住进毛利侦探事务所',
          },
          
          {
            date: '1997-02-17',
            type: ['begin'],
            title: '外交官杀人事件',
            description: '服部平次初登场，柯南喝下白干第一次变回工藤新一，平次开始怀疑柯南身份',
          },
          
          {
            date: '1997-09-22',
            type: ['begin'],
            title: '柯南VS怪盗基德',
            description: '各类重要人物出场：怪盗基德、园子父母铃木史郎、铃木朋子、中森银三、茶木神太郎初登场',
          },
          {
            date: '1999-01-04',
            type: ['Shelly'],
            title: '黑暗组织来的女子',
            description: '宫野志保初登场，在阿笠博士家门口昏倒后被阿笠博士捡到，取名为灰原哀。',
          },
          {
            date: '2000-01-31',
            type: ['Shelly'],
            title: '与黑暗组织再次相逢',
            description: '柯南、灰原和黑暗组织的直接对抗开始，皮斯科出场后被琴酒灭口',
          },
          {
            date: '2001-01-08',
            type: ['Boss'],
            title: '被召集的名侦探！',
            description: '乌丸连耶被提及：139年前乌丸莲耶出生，家族很有钱。40年前，99岁高龄的乌丸莲耶去世。',
          },
          {
            date: '2002-07-15',
            type: ['Shelly','Rye whiskey'],
            title: '工藤新一的纽约事件',
            description: '贝尔摩德扮成杀人魔初登场，赤井秀一对其进行追踪；毛利兰成为贝尔摩德的Angel，为满月篇作下铺垫；',
          },
          {
            date: '2004-01-05',
            type: ['Shelly'],
            title: '与黑暗组织正面对决',
            description: '红黑双方就灰原哀展开争夺战；贝尔摩德假扮新出医生暴露；柯南得知BOSS邮箱按键音。',
          },
          {
            date: '2008-01-14',
            type: ['Rye whiskey'],
            title: '红与黑的碰撞',
            description: '柯南策划秀一假死，帮助水无怜奈洗清嫌疑，为FBI做钓饵会组织继续卧底',
          },
          {
            date: '2013-07-13',
            type: ['Shelly'],
            title: '漆黑的神秘列车',
            description: '红黑双方就灰原哀再度展开争夺战，最后怪盗基德代替雪莉假死。',
          },
          {
            date: '2015-06-06',
            type: ['Bourbon','Rye whiskey'],
            title: '绯色的序章',
            description: '绯色篇。波本公安警察身份公布，真实名字为降谷零；冲矢昂身份赤井秀一公布，但在组织内未暴露。',
          },
          {
            date: '2017-06-03',
            type: ['Rum'],
            title: '与17年前一样的案发',
            description: '引出朗姆篇的核心谜团羽田浩司案；美国资本家阿曼达与其保镖浅香ASAKA首次出现。',
          },
          {
            date: '2017-11-18',
            type: ['Rye whiskey'],
            title: '涟漪上的魔法师',
            description: '揭露工藤新一、毛利兰小时候曾与赤井秀一、玛丽·世良、羽田秀吉、世良真纯第一次相遇剧情。',
          },
          {
            date: '2018-03-03',
            type: ['Rum'],
            title: '隔壁的江户式推理秀',
            description: '第三位朗姆嫌疑人胁田兼则首次初登场，身份为毛利侦探事务所旁伊吕波寿司店厨师。',
          },
          {
            date: '2021-04-24',
            type: ['Rum','Bourbon'],
            title: '36宫格的完美犯罪',
            description: '胁田、安室、柯南、小五郎一同旅行,破解雪山密室案件。',
          },
          {
            date: '2023-03-25',
            type: ['Rum'],
            title: '黑暗组织的谋略',
            description: '组织与卡迈尔在海猿岛上展开了战斗，而朗姆的真实身份——胁田兼则也正式揭晓。',
          },
          {
            date: '2025-12-31',
            type: ['Boss'],
            title: '漫画完结（预计）',
            description: '《名侦探柯南》漫画将迎来完结，主要谜团得到解答，柯南的故事将画上句号。',
          }
        ].map(item => ({
            ...item,
            progress: 0, // 为每个事件添加默认的 progress 属性
            direction:0,
            anchorPoint:{x:0,y:0}
          })) as TimelineEvent[],  // 在这里定义类型
        timelineData: [] as TimelineEvent[],
        transitionPointData: [] as TransitionPoint[],
        padding:40 as number,
        width:200 as number,
        height:120 as number,
        NumberItemperline:4 as number,
        canvaswidth: 1000 as number, // 画布大小
        canvasheight: 1500 as number,
        isStop:false as boolean,
        speed:10 as number,
        typefilters:[] as string[],
        ColorData: {
          ['begin']:[{ r: 242, g: 211, b: 152},{ r:215, g:133, b:33 }],
          ['Shelly']:[{ r:215, g:135, b:0 },{ r: 242, g: 21, b: 50}],
          ['Boss']:[{r:94, g:101, b:114},{r:28, g:35, b:33}],
          ['Rye whiskey']:[{r:196, g:91, b:170},{r:125, g:56, b:125}],
          ['Bourbon']:[{r:160, g:206, b:217},{r:42, g:98, b:143}]
        }as ColorMap
      })

})