import React from 'react';

// Using React.createElement to avoid JSX in .ts file.

const createIcon = (children: React.ReactNode[]) => () => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ...children)
);

export const Icons = {
  Store: createIcon([
    React.createElement('path', { key: '1', d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" }),
    React.createElement('path', { key: '2', d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }),
    React.createElement('path', { key: '3', d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" }),
    React.createElement('path', { key: '4', d: "M2 7h20" }),
    React.createElement('path', { key: '5', d: "M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" })
  ]),
  LayoutDashboard: createIcon([
    React.createElement('rect', { key: '1', width: "7", height: "9", x: "3", y: "3", rx: "1" }),
    React.createElement('rect', { key: '2', width: "7", height: "5", x: "14", y: "3", rx: "1" }),
    React.createElement('rect', { key: '3', width: "7", height: "9", x: "14", y: "12", rx: "1" }),
    React.createElement('rect', { key: '4', width: "7", height: "5", x: "3", y: "16", rx: "1" })
  ]),
  Users: createIcon([
    React.createElement('path', { key: '1', d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement('circle', { key: '2', cx: "9", cy: "7", r: "4" }),
    React.createElement('path', { key: '3', d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement('path', { key: '4', d: "M16 3.13a4 4 0 0 1 0 7.75" })
  ]),
  LogOut: createIcon([
    React.createElement('path', { key: '1', d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
    React.createElement('polyline', { key: '2', points: "16 17 21 12 16 7" }),
    React.createElement('line', { key: '3', x1: "21", x2: "9", y1: "12", y2: "12" })
  ]),
  MessageCircle: createIcon([
    React.createElement('path', { key: '1', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" })
  ]),
  X: createIcon([
    React.createElement('path', { key: '1', d: "M18 6 6 18" }),
    React.createElement('path', { key: '2', d: "m6 6 12 12" })
  ]),
  Send: createIcon([
    React.createElement('path', { key: '1', d: "m22 2-7 20-4-9-9-4Z" }),
    React.createElement('path', { key: '2', d: "M22 2 11 13" })
  ]),
  Plus: createIcon([
    React.createElement('path', { key: '1', d: "M5 12h14" }),
    React.createElement('path', { key: '2', d: "M12 5v14" })
  ]),
  Check: createIcon([
    React.createElement('polyline', { key: '1', points: "20 6 9 17 4 12" })
  ]),
  Edit: createIcon([
    React.createElement('path', { key: '1', d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
    React.createElement('path', { key: '2', d: "m15 5 4 4" })
  ]),
  Trash2: createIcon([
    React.createElement('path', { key: '1', d: "M3 6h18" }),
    React.createElement('path', { key: '2', d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    React.createElement('path', { key: '3', d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    React.createElement('line', { key: '4', x1: "10", x2: "10", y1: "11", y2: "17" }),
    React.createElement('line', { key: '5', x1: "14", x2: "14", y1: "11", y2: "17" })
  ]),
  Shield: createIcon([
    React.createElement('path', { key: '1', d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" })
  ])
};