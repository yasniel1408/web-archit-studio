"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconType, IconRenderer, IconSelector } from '../icon-selector';

// Estilos personalizados para la barra de desplazamiento
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  @media (max-width: 640px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
  }
`;

// Definir metadatos para todos los iconos disponibles
const iconsMetadata = [
  { id: 'none', name: 'Sin icono', category: 'General', tags: ['vacío', 'ninguno', 'empty'] },
  { id: 'server', name: 'Servidor', category: 'Infraestructura', tags: ['server', 'hardware', 'máquina'] },
  { id: 'database', name: 'Base de datos', category: 'Infraestructura', tags: ['database', 'db', 'datos', 'storage'] },
  { id: 'cloud', name: 'Nube', category: 'Infraestructura', tags: ['cloud', 'servicio', 'aws', 'azure'] },
  { id: 'user', name: 'Usuario', category: 'Actores', tags: ['user', 'persona', 'actor', 'cliente'] },
  { id: 'mobile', name: 'Móvil', category: 'Dispositivos', tags: ['mobile', 'teléfono', 'smartphone', 'celular'] },
  { id: 'app', name: 'Aplicación', category: 'Software', tags: ['app', 'software', 'programa', 'aplicación'] },
  { id: 'web', name: 'Web', category: 'Software', tags: ['web', 'sitio', 'página', 'browser'] },
  { id: 'api', name: 'API', category: 'Software', tags: ['api', 'interfaz', 'rest', 'servicio'] },
  { id: 'config', name: 'Configuración', category: 'General', tags: ['config', 'settings', 'ajustes', 'preferencias'] },
  { id: 'security', name: 'Seguridad', category: 'General', tags: ['security', 'seguridad', 'protección', 'shield'] },
  { id: 'analytics', name: 'Analítica', category: 'General', tags: ['analytics', 'estadísticas', 'métricas', 'datos'] },
  
  // AWS Compute
  { id: 'aws-ec2', name: 'AWS EC2', category: 'AWS Compute', tags: ['aws', 'amazon', 'ec2', 'compute', 'servidor', 'instancia', 'virtual'] },
  { id: 'aws-lambda', name: 'AWS Lambda', category: 'AWS Compute', tags: ['aws', 'amazon', 'lambda', 'serverless', 'function', 'función'] },
  { id: 'aws-fargate', name: 'AWS Fargate', category: 'AWS Compute', tags: ['aws', 'amazon', 'fargate', 'container', 'contenedor', 'docker'] },
  { id: 'aws-batch', name: 'AWS Batch', category: 'AWS Compute', tags: ['aws', 'amazon', 'batch', 'procesamiento', 'lotes', 'jobs'] },
  { id: 'aws-elastic-beanstalk', name: 'AWS Elastic Beanstalk', category: 'AWS Compute', tags: ['aws', 'amazon', 'beanstalk', 'paas', 'platform'] },
  { id: 'aws-app-runner', name: 'AWS App Runner', category: 'AWS Compute', tags: ['aws', 'amazon', 'app', 'runner', 'contenedor', 'servicio'] },
  { id: 'aws-wavelength', name: 'AWS Wavelength', category: 'AWS Compute', tags: ['aws', 'amazon', 'wavelength', 'edge', 'baja latencia', '5g'] },
  { id: 'aws-local-zones', name: 'AWS Local Zones', category: 'AWS Compute', tags: ['aws', 'amazon', 'local', 'zones', 'latencia', 'regional'] },
  
  // AWS Database
  { id: 'aws-rds', name: 'AWS RDS', category: 'AWS Database', tags: ['aws', 'amazon', 'rds', 'database', 'relational', 'sql'] },
  { id: 'aws-dynamodb', name: 'AWS DynamoDB', category: 'AWS Database', tags: ['aws', 'amazon', 'dynamodb', 'nosql', 'database', 'document'] },
  { id: 'aws-aurora', name: 'AWS Aurora', category: 'AWS Database', tags: ['aws', 'amazon', 'aurora', 'database', 'mysql', 'postgresql'] },
  { id: 'aws-elasticache', name: 'AWS ElastiCache', category: 'AWS Database', tags: ['aws', 'amazon', 'elasticache', 'redis', 'memcached', 'cache'] },
  { id: 'aws-neptune', name: 'AWS Neptune', category: 'AWS Database', tags: ['aws', 'amazon', 'neptune', 'graph', 'database', 'grafo'] },
  { id: 'aws-database-migration', name: 'AWS Database Migration', category: 'AWS Database', tags: ['aws', 'amazon', 'migration', 'dms', 'database', 'migración'] },
  { id: 'aws-timestream', name: 'AWS Timestream', category: 'AWS Database', tags: ['aws', 'amazon', 'timestream', 'serie temporal', 'database', 'time series'] },
  
  // AWS App Integration
  { id: 'aws-api-gateway', name: 'AWS API Gateway', category: 'AWS App Integration', tags: ['aws', 'amazon', 'api', 'gateway', 'rest', 'http'] },
  { id: 'aws-app-sync', name: 'AWS App Sync', category: 'AWS App Integration', tags: ['aws', 'amazon', 'app', 'sync', 'database', 'graphql'] },
  { id: 'aws-step-functions', name: 'AWS Step Functions', category: 'AWS App Integration', tags: ['aws', 'amazon', 'step', 'functions', 'workflow', 'serverless'] },
  { id: 'aws-sns', name: 'AWS SNS', category: 'AWS App Integration', tags: ['aws', 'amazon', 'sns', 'notification', 'service', 'messaging'] },
  { id: 'aws-sqs', name: 'AWS SQS', category: 'AWS App Integration', tags: ['aws', 'amazon', 'sqs', 'queue', 'messaging', 'service'] },
  
  // AWS Networking
  { id: 'aws-cloudfront', name: 'AWS CloudFront', category: 'AWS Networking', tags: ['aws', 'amazon', 'cloudfront', 'cdn', 'distribución', 'edge'] },
  { id: 'aws-route53', name: 'AWS Route 53', category: 'AWS Networking', tags: ['aws', 'amazon', 'route53', 'dns', 'dominio', 'nombre'] },
  { id: 'aws-vpc', name: 'AWS VPC', category: 'AWS Networking', tags: ['aws', 'amazon', 'vpc', 'red', 'private', 'cloud'] },
  { id: 'aws-direct-connect', name: 'AWS Direct Connect', category: 'AWS Networking', tags: ['aws', 'amazon', 'direct', 'connect', 'conexión', 'dedicada'] },
  
  // AWS Storage
  { id: 'aws-s3', name: 'AWS S3', category: 'AWS Storage', tags: ['aws', 'amazon', 's3', 'simple', 'storage', 'service'] },
  { id: 'aws-efs', name: 'AWS EFS', category: 'AWS Storage', tags: ['aws', 'amazon', 'efs', 'elastic', 'file', 'system'] },
  { id: 'aws-glacier', name: 'AWS Glacier', category: 'AWS Storage', tags: ['aws', 'amazon', 'glacier', 'archivo', 'backup', 'largo plazo'] },
];

// Función para obtener categorías únicas
const getCategories = (): string[] => {
  const categories = new Set<string>();
  iconsMetadata.forEach(icon => categories.add(icon.category));
  return Array.from(categories);
};

interface SquareProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  onIconChange?: (icon: IconType) => void;
}

export function Square({ 
  className = "", 
  text = "", 
  editable = false,
  initialText = "",
  icon = "none",
  onIconChange
}: SquareProps) {
  const [innerText, setInnerText] = useState(initialText || text);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(icon);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerText(e.target.value);
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    // Detener la propagación para que el clic en el input no inicie el arrastre
    e.stopPropagation();
  };

  const handleIconClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
      setShowIconSelector(true);
    }
  };

  const handleIconChange = (newIcon: IconType) => {
    setSelectedIcon(newIcon);
    if (onIconChange) {
      onIconChange(newIcon);
    }
  };

  return (
    <div 
      className={`w-full h-full ${className}`}
    >
      {/* Icono */}
      {selectedIcon !== 'none' && (
        <div 
          className={`absolute top-1.5 left-1.5 ${editable ? 'cursor-pointer hover:opacity-80' : ''}`} 
          onClick={handleIconClick}
        >
          <IconRenderer iconType={selectedIcon} className="w-9 h-9" />
        </div>
      )}
      
      {/* Botón para mostrar selector si no hay icono */}
      {selectedIcon === 'none' && editable && (
        <div 
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
          onClick={handleIconClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )} 
       
      <div className="w-full h-full flex items-center justify-center">
        {editable ? (
          <input
            type="text"
            value={innerText}
            onChange={handleTextChange}
            onClick={handleInputClick}
            onMouseDown={e => e.stopPropagation()}
            className="w-auto max-w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent px-2 py-1 pointer-events-auto"
            placeholder="Texto aquí"
          />
        ) : (
          <div className="text-center w-auto max-w-full overflow-hidden text-black px-2 py-1 pointer-events-none">
            {innerText || text}
          </div>
        )}
      </div>
      
      {/* Selector de iconos (modal) */}
      <IconSelector 
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={handleIconChange}
        initialIcon={selectedIcon}
      />
    </div>
  );
}
