import LogicFlow from '@logicflow/core';
// 基础图形
import baseNodes from './basic';
// path绘制的个性化图形
import pathNodes from './path';
// 多边形绘制的箭头
import arrowNodes from './arrow';
// image绘制图片节点
import imageNodes from './image';
// image绘制左上角icon节点
import iconNodes from './icon';
// 注册边
import edges from './edge'
// 流程图注册
import lctNodes from './lct';

import DiagramNode from "@/pages/graph/diagram/node/data/DiagramNode";

export * from './data/basic';

export async function registerCustomElement(lf: LogicFlow): Promise<DiagramNode[]> {
    // 注册基础节点
    baseNodes.forEach(node => lf.register(node));
    // 注册path绘制的个性化图形
    pathNodes.forEach(node => lf.register(node));
    // 注册多边形绘制的箭头
    arrowNodes.forEach(node => lf.register(node));
    // 注册image绘制图片节点
    imageNodes.forEach(node => lf.register(node));
    // 注册image绘制左上角icon节点
    iconNodes.forEach(node => lf.register(node));
    // 注册边
    edges.forEach(edge => lf.register(edge));
    // 注册流程图
    lctNodes.forEach(node => lf.register(node));
    // TODO: 判断是否需要将drauu注入
    return Promise.resolve([]);
}

