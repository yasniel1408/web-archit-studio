import { useState } from 'react';
import { TemplateType } from '../types';

export function useTemplates() {
  // Plantillas de ejemplo predefinidas
  const [templates] = useState<TemplateType[]>([
    {
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
    },
    {
      id: 'microservices',
      name: 'Arquitectura de Microservicios',
      description: 'Patrón de arquitectura de microservicios con API Gateway, servicios y bases de datos separadas.',
      image: '/templates/microservices.png',
      version: "1.0",
      nodes: [
        {
          id: "api-gateway",
          type: "square size:300x120",
          position: {
            x: 350,
            y: 50
          },
          size: {
            width: 300,
            height: 120
          },
          text: "API Gateway",
          iconType: "api"
        },
        {
          id: "user-service",
          type: "square size:180x120",
          position: {
            x: 150,
            y: 250
          },
          size: {
            width: 180,
            height: 120
          },
          text: "User Service",
          iconType: "service"
        },
        {
          id: "order-service",
          type: "square size:180x120",
          position: {
            x: 410,
            y: 250
          },
          size: {
            width: 180,
            height: 120
          },
          text: "Order Service",
          iconType: "service"
        },
        {
          id: "product-service",
          type: "square size:180x120",
          position: {
            x: 670,
            y: 250
          },
          size: {
            width: 180,
            height: 120
          },
          text: "Product Service",
          iconType: "service"
        },
        {
          id: "user-db",
          type: "square size:180x100",
          position: {
            x: 150,
            y: 450
          },
          size: {
            width: 180,
            height: 100
          },
          text: "User DB",
          iconType: "database"
        },
        {
          id: "order-db",
          type: "square size:180x100",
          position: {
            x: 410,
            y: 450
          },
          size: {
            width: 180,
            height: 100
          },
          text: "Order DB",
          iconType: "database"
        },
        {
          id: "product-db",
          type: "square size:180x100",
          position: {
            x: 670,
            y: 450
          },
          size: {
            width: 180,
            height: 100
          },
          text: "Product DB",
          iconType: "database"
        },
        {
          id: "event-bus",
          type: "square size:700x80",
          position: {
            x: 150,
            y: 600
          },
          size: {
            width: 700,
            height: 80
          },
          text: "Event Bus / Message Queue",
          iconType: "mq"
        }
      ],
      connections: [
        {
          id: "conn-1",
          sourceId: "api-gateway",
          targetId: "user-service",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 500,
          sourceY: 170,
          targetX: 240,
          targetY: 250,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-2",
          sourceId: "api-gateway",
          targetId: "order-service",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 500,
          sourceY: 170,
          targetX: 500,
          targetY: 250,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-3",
          sourceId: "api-gateway",
          targetId: "product-service",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 500,
          sourceY: 170,
          targetX: 760,
          targetY: 250,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-4",
          sourceId: "user-service",
          targetId: "user-db",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 240,
          sourceY: 370,
          targetX: 240,
          targetY: 450,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-5",
          sourceId: "order-service",
          targetId: "order-db",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 500,
          sourceY: 370,
          targetX: 500,
          targetY: 450,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-6",
          sourceId: "product-service",
          targetId: "product-db",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 760,
          sourceY: 370,
          targetX: 760,
          targetY: 450,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2
        },
        {
          id: "conn-7",
          sourceId: "user-service",
          targetId: "event-bus",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 240,
          sourceY: 370,
          targetX: 500,
          targetY: 600,
          style: "dashed",
          animation: "pulse",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#0066cc",
          strokeWidth: 2
        },
        {
          id: "conn-8",
          sourceId: "order-service",
          targetId: "event-bus",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 500,
          sourceY: 370,
          targetX: 500,
          targetY: 600,
          style: "dashed",
          animation: "pulse",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#0066cc",
          strokeWidth: 2
        },
        {
          id: "conn-9",
          sourceId: "product-service",
          targetId: "event-bus",
          sourcePosition: "bottom",
          targetPosition: "top",
          sourceX: 760,
          sourceY: 370,
          targetX: 500,
          targetY: 600,
          style: "dashed",
          animation: "pulse",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#0066cc",
          strokeWidth: 2
        }
      ],
      viewport: {
        scale: 0.75,
        position: {
          x: 100,
          y: 50
        }
      },
      metadata: {
        exportedAt: "2023-05-20T12:30:56.389Z",
        nodeCount: 8,
        connectionCount: 9
      }
    }
  ]);

  return { templates };
} 