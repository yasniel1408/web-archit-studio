import { useState } from 'react';
import { TemplateType } from '../types';

// Plantillas de ejemplo predefinidas
const serverlessTemplate: TemplateType = {
  id: 'serverless',
  name: 'Arquitectura Serverless',
  description: 'Arquitectura basada en servicios serverless con API Gateway, funciones Lambda y servicios de almacenamiento.',
  image: '/templates/serverless.png',
  version: "1.0",
  nodes: [
    {
      id: "api-gateway",
      type: "square size:490x145",
      position: {
        x: 217,
        y: -14
      },
      size: {
        width: 490,
        height: 145
      },
      text: "API Gateway",
      iconType: "api"
    },
    {
      id: "auth-lambda",
      type: "square size:177x144",
      position: {
        x: 121,
        y: 250
      },
      size: {
        width: 177,
        height: 144
      },
      text: "Auth Lambda",
      iconType: "cloud"
    },
    {
      id: "users-lambda",
      type: "square size:208x142",
      position: {
        x: 329,
        y: 249
      },
      size: {
        width: 208,
        height: 142
      },
      text: "Users Lambda",
      iconType: "cloud"
    },
    {
      id: "dynamo-users",
      type: "square size:192x130",
      position: {
        x: 312,
        y: 503
      },
      size: {
        width: 192,
        height: 130
      },
      text: "DynamoDB Users",
      iconType: "database"
    },
    {
      id: "s3-storage",
      type: "square size:164x142",
      position: {
        x: 657,
        y: 315
      },
      size: {
        width: 164,
        height: 142
      },
      text: "S3 Storage",
      iconType: "database"
    }
  ],
  connections: [
    {
      id: "conn-1",
      sourceId: "api-gateway",
      targetId: "auth-lambda",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 462,
      sourceY: 131,
      targetX: 209.5,
      targetY: 250,
      style: "solid",
      animation: "traveling-dot-fastest",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#6200ee",
      strokeWidth: 2
    },
    {
      id: "conn-2",
      sourceId: "api-gateway",
      targetId: "users-lambda",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 462,
      sourceY: 131,
      targetX: 433,
      targetY: 249,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#6200ee",
      strokeWidth: 2
    },
    {
      id: "conn-3",
      sourceId: "users-lambda",
      targetId: "dynamo-users",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 433,
      sourceY: 391,
      targetX: 408,
      targetY: 503,
      style: "solid",
      animation: "none",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-4",
      sourceId: "users-lambda",
      targetId: "s3-storage",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 537,
      sourceY: 320,
      targetX: 657,
      targetY: 386,
      style: "solid",
      animation: "none",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    }
  ],
  viewport: {
    scale: 0.8499999999999999,
    position: {
      x: 183.55459555555558,
      y: 131.49277291005296
    }
  },
  metadata: {
    exportedAt: "2025-04-20T05:14:56.389Z",
    nodeCount: 5,
    connectionCount: 4
  }
};

const microservicesTemplate: TemplateType = {
  id: 'aws-architecture',
  name: 'Arquitectura AWS',
  description: 'Ejemplo de arquitectura completa en AWS con bases de datos, servidores y puntos de integración.',
  image: '/templates/aws-architecture.png',
  version: "1.0",
  nodes: [
    {
      id: "api-gateway",
      position: {
        x: -158,
        y: -78
      },
      text: "API Gateway",
      type: "square",
      size: {
        width: 1087,
        height: 189
      },
      iconType: "api",
      backgroundColor: "#FFCCBC"
    },
    {
      id: "user-db",
      position: {
        x: -234,
        y: 567
      },
      text: "User DB",
      type: "square",
      size: {
        width: 229,
        height: 138
      },
      iconType: "database"
    },
    {
      id: "order-db",
      position: {
        x: 84,
        y: 567
      },
      text: "Order DB",
      type: "square",
      size: {
        width: 235,
        height: 142
      },
      iconType: "database"
    },
    {
      id: "product-db",
      position: {
        x: 426,
        y: 565
      },
      text: "Product DB",
      type: "square",
      size: {
        width: 249,
        height: 143
      },
      iconType: "database"
    },
    {
      id: "message-queue",
      position: {
        x: 746.3125,
        y: 611.3333333333334
      },
      text: "Message Queue",
      type: "square",
      size: {
        width: 599.5,
        height: 145
      },
      backgroundColor: "#BBDEFB",
      iconType: "mq"
    },
    {
      id: "lambda-function",
      position: {
        x: 1108.9791666666667,
        y: 50.666666666666686
      },
      text: "Lambda Function",
      type: "square",
      size: {
        width: 239.75,
        height: 135.75
      },
      iconType: "cloud",
      backgroundColor: "#FFE0B2"
    },
    {
      id: "users-service",
      position: {
        x: -147.35416666666669,
        y: 230.66666666666669
      },
      text: "Users Service",
      type: "square",
      size: {
        width: 178,
        height: 211
      },
      iconType: "service"
    },
    {
      id: "orders-service",
      position: {
        x: 200.3125,
        y: 234.33333333333331
      },
      text: "Orders Service",
      type: "square",
      size: {
        width: 200.5,
        height: 192.5
      },
      iconType: "service"
    },
    {
      id: "products-service",
      position: {
        x: 570.3125,
        y: 231.33333333333331
      },
      text: "Products Service",
      type: "square",
      size: {
        width: 181,
        height: 201
      },
      iconType: "service"
    }
  ],
  connections: [
    {
      id: "conn-1745283292818",
      sourceId: "api-gateway",
      targetId: "lambda-function",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 929,
      sourceY: 16.5,
      targetX: 1108.9791666666667,
      targetY: 118.54166666666669,
      style: "solid",
      animation: "traveling-dot-fastest",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283379820",
      sourceId: "users-service",
      targetId: "user-db",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: -58.354166666666686,
      sourceY: 441.6666666666667,
      targetX: -119.5,
      targetY: 567,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283382630",
      sourceId: "orders-service",
      targetId: "order-db",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 300.5625,
      sourceY: 426.8333333333333,
      targetX: 201.5,
      targetY: 567,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283388754",
      sourceId: "users-service",
      targetId: "message-queue",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: -58.354166666666686,
      sourceY: 441.6666666666667,
      targetX: 1046.0625,
      targetY: 611.3333333333334,
      style: "dotted",
      animation: "dash",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283392241",
      sourceId: "orders-service",
      targetId: "message-queue",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 300.5625,
      sourceY: 426.8333333333333,
      targetX: 1046.0625,
      targetY: 611.3333333333334,
      style: "solid",
      animation: "dash",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283432344",
      sourceId: "products-service",
      targetId: "product-db",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 660.8125,
      sourceY: 432.3333333333333,
      targetX: 550.5,
      targetY: 565,
      style: "solid",
      animation: "traveling-dot-fastest",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283444570",
      sourceId: "api-gateway",
      targetId: "users-service",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 385.5,
      sourceY: 111,
      targetX: -58.354166666666686,
      targetY: 230.66666666666669,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283446940",
      sourceId: "api-gateway",
      targetId: "orders-service",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 385.5,
      sourceY: 111,
      targetX: 300.5625,
      targetY: 234.33333333333331,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283450937",
      sourceId: "api-gateway",
      targetId: "products-service",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 385.5,
      sourceY: 111,
      targetX: 660.8125,
      targetY: 231.33333333333331,
      style: "solid",
      animation: "traveling-dot",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    },
    {
      id: "conn-1745283511874",
      sourceId: "products-service",
      targetId: "message-queue",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 660.8125,
      sourceY: 432.3333333333333,
      targetX: 1046.0625,
      targetY: 611.3333333333334,
      style: "solid",
      animation: "dash",
      startArrowHead: "none",
      endArrowHead: "arrow",
      color: "#000000",
      strokeWidth: 2
    }
  ],
  viewport: {
    scale: 0.75,
    position: {
      x: 346,
      y: 229.16031901041657
    }
  },
  metadata: {
    exportedAt: "2025-04-22T01:00:57.726Z",
    nodeCount: 9,
    connectionCount: 10
  }
};

// Template de Analítica de Datos AWS
export const analyticaAWS: TemplateType = {
  id: "analitica-aws",
  name: "Analítica de Datos AWS",
  description: "Flujo de procesamiento de datos con servicios AWS.",
  image: "/templates/analitica-aws.png",
  version: "1.0.0",
  nodes: [
    {
      id: "s3-bucket",
      position: { x: 100, y: 100 },
      size: { width: 120, height: 60 },
      text: "Amazon S3",
      type: "rounded",
      icon: { type: "aws", name: "S3" },
      backgroundColor: "#FFD58C"
    },
    {
      id: "kinesis",
      position: { x: 300, y: 100 },
      size: { width: 120, height: 60 },
      text: "Kinesis Data Streams",
      type: "rounded",
      icon: { type: "aws", name: "Kinesis" },
      backgroundColor: "#C8E6CA"
    },
    {
      id: "glue",
      position: { x: 500, y: 100 },
      size: { width: 120, height: 60 },
      text: "AWS Glue",
      type: "rounded",
      icon: { type: "aws", name: "Glue" },
      backgroundColor: "#B3DBF0"
    },
    {
      id: "athena",
      position: { x: 300, y: 250 },
      size: { width: 120, height: 60 },
      text: "Amazon Athena",
      type: "rounded",
      icon: { type: "aws", name: "Athena" },
      backgroundColor: "#E9E6FF"
    },
    {
      id: "quicksight",
      position: { x: 500, y: 250 },
      size: { width: 120, height: 60 },
      text: "QuickSight",
      type: "rounded",
      icon: { type: "aws", name: "QuickSight" },
      backgroundColor: "#FFD0D0"
    },
    {
      id: "redshift",
      position: { x: 100, y: 250 },
      size: { width: 120, height: 60 },
      text: "Redshift",
      type: "rounded",
      icon: { type: "aws", name: "Redshift" },
      backgroundColor: "#D8CAFA"
    }
  ],
  connections: [
    {
      id: "s3-to-kinesis",
      sourceId: "s3-bucket",
      targetId: "kinesis",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 220,
      sourceY: 130,
      targetX: 300,
      targetY: 130,
      style: "solid",
      animation: "traveling-dot-fast",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "kinesis-to-glue",
      sourceId: "kinesis",
      targetId: "glue",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 420,
      sourceY: 130,
      targetX: 500,
      targetY: 130,
      style: "solid",
      animation: "pulse",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "s3-to-redshift",
      sourceId: "s3-bucket",
      targetId: "redshift",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 160,
      sourceY: 160,
      targetX: 160,
      targetY: 250,
      style: "dashed",
      animation: "flow",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "glue-to-athena",
      sourceId: "glue",
      targetId: "athena",
      sourcePosition: "bottom",
      targetPosition: "top",
      sourceX: 560,
      sourceY: 160,
      targetX: 360,
      targetY: 250,
      style: "solid",
      animation: "dash",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "athena-to-quicksight",
      sourceId: "athena",
      targetId: "quicksight",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 420,
      sourceY: 280,
      targetX: 500,
      targetY: 280,
      style: "solid",
      animation: "traveling-dot",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "redshift-to-quicksight",
      sourceId: "redshift",
      targetId: "quicksight",
      sourcePosition: "right",
      targetPosition: "bottom",
      sourceX: 220,
      sourceY: 280,
      targetX: 560,
      targetY: 310,
      style: "dotted",
      animation: "traveling-dot-fastest",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    }
  ],
  viewport: {
    scale: 1,
    position: { x: 0, y: 0 }
  },
  metadata: {
    exportedAt: new Date().toISOString(),
    nodeCount: 8,
    connectionCount: 7
  }
};

// Template de Arquitectura Híbrida AWS
export const arquitecturaHibridaAWS: TemplateType = {
  id: "arquitectura-hibrida-aws",
  name: "Arquitectura Híbrida AWS",
  description: "Conexión entre infraestructura on-premise y servicios AWS.",
  image: "/templates/arquitectura-hibrida-aws.png",
  version: "1.0.0",
  nodes: [
    {
      id: "datacenter",
      position: { x: 100, y: 150 },
      size: { width: 140, height: 70 },
      text: "Data Center",
      type: "rectangle",
      icon: { type: "general", name: "datacenter" },
      backgroundColor: "#E1E1FF"
    },
    {
      id: "vpn-gateway",
      position: { x: 300, y: 150 },
      size: { width: 120, height: 60 },
      text: "VPN Gateway",
      type: "rounded",
      icon: { type: "aws", name: "VPNGateway" },
      backgroundColor: "#C8FFF2"
    },
    {
      id: "vpc",
      position: { x: 500, y: 150 },
      size: { width: 120, height: 60 },
      text: "Amazon VPC",
      type: "rounded",
      icon: { type: "aws", name: "VPC" },
      backgroundColor: "#FDFFCD"
    },
    {
      id: "ec2-instances",
      position: { x: 650, y: 80 },
      size: { width: 120, height: 60 },
      text: "EC2 Instances",
      type: "rounded",
      icon: { type: "aws", name: "EC2" },
      backgroundColor: "#FFD8D0"
    },
    {
      id: "rds",
      position: { x: 650, y: 220 },
      size: { width: 120, height: 60 },
      text: "Amazon RDS",
      type: "rounded",
      icon: { type: "aws", name: "RDS" },
      backgroundColor: "#D0F0FF"
    },
    {
      id: "direct-connect",
      position: { x: 300, y: 280 },
      size: { width: 120, height: 60 },
      text: "Direct Connect",
      type: "rounded",
      icon: { type: "aws", name: "DirectConnect" },
      backgroundColor: "#FFDECE"
    },
    {
      id: "s3-backup",
      position: { x: 500, y: 280 },
      size: { width: 120, height: 60 },
      text: "S3 Backup",
      type: "rounded",
      icon: { type: "aws", name: "S3" },
      backgroundColor: "#FFD58C"
    }
  ],
  connections: [
    {
      id: "datacenter-to-vpn",
      sourceId: "datacenter",
      targetId: "vpn-gateway",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 240,
      sourceY: 185,
      targetX: 300,
      targetY: 180,
      style: "solid",
      animation: "pulse",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "vpn-to-vpc",
      sourceId: "vpn-gateway",
      targetId: "vpc",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 420,
      sourceY: 180,
      targetX: 500,
      targetY: 180,
      style: "solid",
      animation: "traveling-dot",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "vpc-to-ec2",
      sourceId: "vpc",
      targetId: "ec2-instances",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 620,
      sourceY: 165,
      targetX: 650,
      targetY: 110,
      style: "solid",
      animation: "flow",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "vpc-to-rds",
      sourceId: "vpc",
      targetId: "rds",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 620,
      sourceY: 195,
      targetX: 650,
      targetY: 250,
      style: "solid",
      animation: "dash",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "datacenter-to-direct-connect",
      sourceId: "datacenter",
      targetId: "direct-connect",
      sourcePosition: "bottom",
      targetPosition: "left",
      sourceX: 170,
      sourceY: 220,
      targetX: 300,
      targetY: 310,
      style: "dashed",
      animation: "traveling-dot-fast",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "direct-connect-to-vpc",
      sourceId: "direct-connect",
      targetId: "vpc",
      sourcePosition: "top",
      targetPosition: "bottom",
      sourceX: 360,
      sourceY: 280,
      targetX: 560,
      targetY: 210,
      style: "solid",
      animation: "traveling-dot-fastest",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    },
    {
      id: "direct-connect-to-s3",
      sourceId: "direct-connect",
      targetId: "s3-backup",
      sourcePosition: "right",
      targetPosition: "left",
      sourceX: 420,
      sourceY: 310,
      targetX: 500,
      targetY: 310,
      style: "dotted",
      animation: "flow",
      color: "#6B7280",
      strokeWidth: 2,
      endArrowHead: "arrow"
    }
  ],
  viewport: {
    scale: 1,
    position: { x: 0, y: 0 }
  },
  metadata: {
    exportedAt: new Date().toISOString(),
    nodeCount: 7,
    connectionCount: 7
  }
};

// Export the templates array
export const useTemplates = () => {
  return { templates: [serverlessTemplate, microservicesTemplate, analyticaAWS, arquitecturaHibridaAWS] };
}; 