// 时间轴数据结构
export interface TimelineEvent {
  // id: number;
  date: string; // 日期，格式为 YYYY-MM-DD
  type: string[]; // 事件类型，可以多个标签
  title: string; // 标题
  description: string; // 描述
  width?: number; // item渲染宽度
  height?: number; // item渲染高度
  progress?: number; // 渲染进度
  startPoint?: Point; // item渲染起始点坐标
  endPoint?: Point; // item渲染终点坐标
  anchorPoint?: Point; // 方框渲染起始点
  direction?: number // 渲染方向
  startcolor?: string // 渲染起始颜色
  endcolor?: string // 渲染终止颜色
}

// svg 坐标点
export interface Point {
  x: number
  y: number
}

// 过渡时间轴数据结构
export interface TransitionPoint {
  startPoint: Point; // 过渡轴起始点坐标
  endPoint: Point; // 过渡轴终点坐标
  progress?: number, // 过渡轴渲染进度
  anchorPoint?: Point; // 立柱渲染点
  direction?: number // 渲染方向
}

// 颜色结构
export interface RGB {
  r: number;
  g: number;
  b: number;
};

// 颜色映射结构
export interface ColorMap {
  [key: string]: [RGB,RGB]; 
};