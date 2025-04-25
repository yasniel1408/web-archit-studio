export type IconType = 
  | 'none' 
  | 'server' 
  | 'database' 
  | 'cloud' 
  | 'user' 
  | 'mobile' 
  | 'app' 
  | 'web' 
  | 'api' 
  | 'config' 
  | 'security' 
  | 'analytics'
  // Iconos AWS Compute
  | 'aws-ec2'
  | 'aws-lambda'
  | 'aws-fargate'
  | 'aws-batch'
  | 'aws-elastic-beanstalk'
  | 'aws-app-runner'
  | 'aws-wavelength'
  | 'aws-local-zones'
  // Iconos AWS Database
  | 'aws-rds'
  | 'aws-dynamodb'
  | 'aws-aurora'
  | 'aws-elasticache'
  | 'aws-neptune'
  | 'aws-database-migration'
  | 'aws-timestream'
  // Iconos AWS App Integration
  | 'aws-api-gateway'
  | 'aws-app-sync'
  | 'aws-step-functions'
  | 'aws-sns'
  | 'aws-sqs'
  // Iconos AWS Networking
  | 'aws-cloudfront'
  | 'aws-route53'
  | 'aws-vpc'
  | 'aws-direct-connect'
  // Iconos AWS Storage
  | 'aws-s3'
  | 'aws-efs'
  | 'aws-glacier'
  // Iconos GCP Compute
  | 'gcp-compute-engine'
  | 'gcp-kubernetes-engine'
  | 'gcp-app-engine'
  | 'gcp-cloud-functions'
  | 'gcp-cloud-run'
  // Iconos GCP Database
  | 'gcp-cloud-sql'
  | 'gcp-cloud-bigtable'
  | 'gcp-cloud-spanner'
  | 'gcp-cloud-firestore'
  | 'gcp-cloud-memorystore'
  // Iconos GCP Storage
  | 'gcp-cloud-storage'
  | 'gcp-persistent-disk'
  // Iconos GCP Networking
  | 'gcp-cloud-cdn'
  | 'gcp-cloud-load-balancing'
  | 'gcp-cloud-vpn'
  // Iconos GCP AI & ML
  | 'gcp-ai-platform'
  | 'gcp-automl'
  | 'gcp-vision-ai'
  | 'gcp-speech-to-text'
  | 'gcp-text-to-speech'
  | 'gcp-natural-language'
  | 'gcp-translation'
  | 'gcp-dialogflow'
  | 'gcp-document-ai'
  | 'gcp-contact-center-ai'
  | 'gcp-healthcare-nlp-api'
  | 'gcp-recommendations-ai'
  | 'gcp-retail-api'
  | 'gcp-media-translation-api'
  | 'gcp-cloud-inference-api'
  | 'gcp-cloud-vision-api'
  // Iconos GCP Big Data
  | 'gcp-bigquery'
  | 'gcp-dataflow'
  | 'gcp-dataproc'
  | 'gcp-pubsub'
  | 'gcp-data-catalog'
  | 'gcp-datalab'
  // Iconos GCP IoT
  | 'gcp-iot-core'
  // Iconos GCP Security
  | 'gcp-security-command-center'
  | 'gcp-cloud-armor'
  | 'gcp-identity-platform'
  // Iconos GCP DevOps
  | 'gcp-cloud-build'
  | 'gcp-cloud-source-repositories'
  | 'gcp-artifact-registry';

// Metadatos de los iconos para búsqueda y etiquetas
export interface IconMetadata {
  id: IconType;
  name: string;
  category: string;
  tags: string[];
}

// Definir metadatos para todos los iconos disponibles
export const iconsMetadata: IconMetadata[] = [
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
  { id: 'aws-s3', name: 'AWS S3', category: 'AWS Storage', tags: ['aws', 'amazon', 's3', 'storage', 'bucket', 'object'] },
  { id: 'aws-efs', name: 'AWS EFS', category: 'AWS Storage', tags: ['aws', 'amazon', 'efs', 'elastic', 'file', 'system'] },
  { id: 'aws-glacier', name: 'AWS Glacier', category: 'AWS Storage', tags: ['aws', 'amazon', 'glacier', 'archive', 'backup', 'storage'] },
  
  // GCP Compute
  { id: 'gcp-compute-engine', name: 'GCP Compute Engine', category: 'GCP Compute', tags: ['gcp', 'google', 'compute', 'engine', 'vm', 'virtual machine'] },
  { id: 'gcp-kubernetes-engine', name: 'GCP Kubernetes Engine', category: 'GCP Compute', tags: ['gcp', 'google', 'kubernetes', 'gke', 'container', 'k8s'] },
  { id: 'gcp-app-engine', name: 'GCP App Engine', category: 'GCP Compute', tags: ['gcp', 'google', 'app', 'engine', 'paas', 'platform'] },
  { id: 'gcp-cloud-functions', name: 'GCP Cloud Functions', category: 'GCP Compute', tags: ['gcp', 'google', 'cloud', 'functions', 'serverless', 'function'] },
  { id: 'gcp-cloud-run', name: 'GCP Cloud Run', category: 'GCP Compute', tags: ['gcp', 'google', 'cloud', 'run', 'container', 'serverless'] },
  
  // GCP Database
  { id: 'gcp-cloud-sql', name: 'GCP Cloud SQL', category: 'GCP Database', tags: ['gcp', 'google', 'cloud', 'sql', 'database', 'relational'] },
  { id: 'gcp-cloud-bigtable', name: 'GCP Cloud Bigtable', category: 'GCP Database', tags: ['gcp', 'google', 'cloud', 'bigtable', 'nosql', 'database'] },
  { id: 'gcp-cloud-spanner', name: 'GCP Cloud Spanner', category: 'GCP Database', tags: ['gcp', 'google', 'cloud', 'spanner', 'database', 'sql'] },
  { id: 'gcp-cloud-firestore', name: 'GCP Cloud Firestore', category: 'GCP Database', tags: ['gcp', 'google', 'cloud', 'firestore', 'nosql', 'database'] },
  { id: 'gcp-cloud-memorystore', name: 'GCP Cloud Memorystore', category: 'GCP Database', tags: ['gcp', 'google', 'cloud', 'memorystore', 'redis', 'cache'] },
  
  // GCP Storage
  { id: 'gcp-cloud-storage', name: 'GCP Cloud Storage', category: 'GCP Storage', tags: ['gcp', 'google', 'cloud', 'storage', 'bucket', 'object'] },
  { id: 'gcp-persistent-disk', name: 'GCP Persistent Disk', category: 'GCP Storage', tags: ['gcp', 'google', 'persistent', 'disk', 'storage', 'volume'] },
  
  // GCP Networking
  { id: 'gcp-cloud-cdn', name: 'GCP Cloud CDN', category: 'GCP Networking', tags: ['gcp', 'google', 'cloud', 'cdn', 'content', 'delivery'] },
  { id: 'gcp-cloud-load-balancing', name: 'GCP Cloud Load Balancing', category: 'GCP Networking', tags: ['gcp', 'google', 'cloud', 'load', 'balancing', 'traffic'] },
  { id: 'gcp-cloud-vpn', name: 'GCP Cloud VPN', category: 'GCP Networking', tags: ['gcp', 'google', 'cloud', 'vpn', 'virtual', 'private'] },

  // GCP AI & ML
  { id: 'gcp-ai-platform', name: 'GCP AI Platform', category: 'GCP AI & ML', tags: ['gcp', 'google', 'ai', 'machine learning', 'ml', 'platform'] },
  { id: 'gcp-automl', name: 'GCP AutoML', category: 'GCP AI & ML', tags: ['gcp', 'google', 'automl', 'machine learning', 'ml', 'automatic'] },
  { id: 'gcp-vision-ai', name: 'GCP Vision AI', category: 'GCP AI & ML', tags: ['gcp', 'google', 'vision', 'ai', 'image', 'recognition'] },
  { id: 'gcp-speech-to-text', name: 'GCP Speech-to-Text', category: 'GCP AI & ML', tags: ['gcp', 'google', 'speech', 'text', 'recognition', 'audio'] },
  { id: 'gcp-text-to-speech', name: 'GCP Text-to-Speech', category: 'GCP AI & ML', tags: ['gcp', 'google', 'text', 'speech', 'audio', 'synthesis'] },
  { id: 'gcp-natural-language', name: 'GCP Natural Language', category: 'GCP AI & ML', tags: ['gcp', 'google', 'natural', 'language', 'nlp', 'text'] },
  { id: 'gcp-translation', name: 'GCP Translation', category: 'GCP AI & ML', tags: ['gcp', 'google', 'translation', 'language', 'translate', 'multilingual'] },
  { id: 'gcp-dialogflow', name: 'GCP Dialogflow', category: 'GCP AI & ML', tags: ['gcp', 'google', 'dialogflow', 'chatbot', 'conversation', 'ai'] },
  { id: 'gcp-document-ai', name: 'GCP Document AI', category: 'GCP AI & ML', tags: ['gcp', 'google', 'document', 'ai', 'ocr', 'procesamiento'] },
  { id: 'gcp-contact-center-ai', name: 'GCP Contact Center AI', category: 'GCP AI & ML', tags: ['gcp', 'google', 'contact', 'center', 'ai', 'customer service'] },
  { id: 'gcp-healthcare-nlp-api', name: 'GCP Healthcare NLP API', category: 'GCP AI & ML', tags: ['gcp', 'google', 'healthcare', 'nlp', 'medical', 'salud'] },
  { id: 'gcp-recommendations-ai', name: 'GCP Recommendations AI', category: 'GCP AI & ML', tags: ['gcp', 'google', 'recommendations', 'ai', 'retail', 'sugerencias'] },
  { id: 'gcp-retail-api', name: 'GCP Retail API', category: 'GCP AI & ML', tags: ['gcp', 'google', 'retail', 'api', 'commerce', 'tienda'] },
  { id: 'gcp-media-translation-api', name: 'GCP Media Translation API', category: 'GCP AI & ML', tags: ['gcp', 'google', 'media', 'translation', 'audio', 'streaming'] },
  { id: 'gcp-cloud-inference-api', name: 'GCP Cloud Inference API', category: 'GCP AI & ML', tags: ['gcp', 'google', 'cloud', 'inference', 'ai', 'predicción'] },
  { id: 'gcp-cloud-vision-api', name: 'GCP Cloud Vision API', category: 'GCP AI & ML', tags: ['gcp', 'google', 'cloud', 'vision', 'api', 'imagen'] },

  // GCP Big Data
  { id: 'gcp-bigquery', name: 'GCP BigQuery', category: 'GCP Big Data', tags: ['gcp', 'google', 'bigquery', 'data', 'warehouse', 'analytics'] },
  { id: 'gcp-dataflow', name: 'GCP Dataflow', category: 'GCP Big Data', tags: ['gcp', 'google', 'dataflow', 'stream', 'batch', 'processing'] },
  { id: 'gcp-dataproc', name: 'GCP Dataproc', category: 'GCP Big Data', tags: ['gcp', 'google', 'dataproc', 'hadoop', 'spark', 'processing'] },
  { id: 'gcp-pubsub', name: 'GCP Pub/Sub', category: 'GCP Big Data', tags: ['gcp', 'google', 'pubsub', 'messaging', 'events', 'streaming'] },
  { id: 'gcp-data-catalog', name: 'GCP Data Catalog', category: 'GCP Big Data', tags: ['gcp', 'google', 'data', 'catalog', 'metadata', 'discovery'] },
  { id: 'gcp-datalab', name: 'GCP Datalab', category: 'GCP Big Data', tags: ['gcp', 'google', 'datalab', 'jupyter', 'notebook', 'analysis'] },

  // GCP IoT
  { id: 'gcp-iot-core', name: 'GCP IoT Core', category: 'GCP IoT', tags: ['gcp', 'google', 'iot', 'core', 'internet', 'things'] },

  // GCP Security
  { id: 'gcp-security-command-center', name: 'GCP Security Command Center', category: 'GCP Security', tags: ['gcp', 'google', 'security', 'command', 'center', 'protection'] },
  { id: 'gcp-cloud-armor', name: 'GCP Cloud Armor', category: 'GCP Security', tags: ['gcp', 'google', 'cloud', 'armor', 'ddos', 'protection'] },
  { id: 'gcp-identity-platform', name: 'GCP Identity Platform', category: 'GCP Security', tags: ['gcp', 'google', 'identity', 'platform', 'authentication', 'auth'] },

  // GCP DevOps
  { id: 'gcp-cloud-build', name: 'GCP Cloud Build', category: 'GCP DevOps', tags: ['gcp', 'google', 'cloud', 'build', 'ci', 'cd'] },
  { id: 'gcp-cloud-source-repositories', name: 'GCP Cloud Source Repositories', category: 'GCP DevOps', tags: ['gcp', 'google', 'cloud', 'source', 'repositories', 'git'] },
  { id: 'gcp-artifact-registry', name: 'GCP Artifact Registry', category: 'GCP DevOps', tags: ['gcp', 'google', 'artifact', 'registry', 'container', 'repository'] },
];

// Función para obtener categorías únicas
export const getCategories = (): string[] => {
  const categories = new Set<string>();
  iconsMetadata.forEach(icon => categories.add(icon.category));
  return Array.from(categories);
};