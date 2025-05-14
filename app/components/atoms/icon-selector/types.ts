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
  | 'aws-documentdb'
  | 'aws-quantum-ledger-database'
  | 'aws-keyspaces'
  | 'aws-rds-on-vmware'
  // Iconos AWS App Integration
  | 'aws-api-gateway'
  | 'aws-app-sync'
  | 'aws-step-functions'
  | 'aws-sns'
  | 'aws-sqs'
  | 'aws-eventbridge'
  // Iconos AWS Networking
  | 'aws-cloudfront'
  | 'aws-route53'
  | 'aws-vpc'
  | 'aws-direct-connect'
  | 'aws-elastic-load-balancing'
  | 'aws-transit-gateway'
  // Iconos AWS Storage
  | 'aws-s3'
  | 'aws-efs'
  | 'aws-glacier'
  | 'aws-ebs'
  | 'aws-backup'
  | 'aws-fsx'
  | 'aws-storage-gateway'
  | 'aws-cloudendure-disaster-recovery'
  | 'aws-s3-on-outposts'
  | 'aws-fsx-for-lustre'
  | 'aws-fsx-for-windows-file-server'
  | 'aws-snowmobile'
  | 'aws-snowcone'
  | 'aws-snowball'
  | 'aws-snowball-edge'
  // Iconos AWS Security
  | 'aws-waf'
  | 'aws-shield'
  | 'aws-network-firewall'
  | 'aws-secrets-manager'
  | 'aws-cognito'
  // Iconos AWS Management & Governance
  | 'aws-cloudwatch'
  | 'aws-cloudformation'
  | 'aws-cloudtrail'
  | 'aws-auto-scaling'
  | 'aws-config'
  | 'aws-organizations'
  | 'aws-systems-manager'
  | 'aws-service-catalog'
  | 'aws-trusted-advisor'
  | 'aws-well-architected-tool'
  | 'aws-launch-wizard'
  | 'aws-opsworks'
  | 'aws-systems-manager-incident-manager'
  | 'aws-personal-health-dashboard'
  | 'aws-management-console'
  | 'aws-license-manager'
  | 'aws-fault-injection-simulator'
  | 'aws-appconfig'
  | 'aws-managed-prometheus'
  | 'aws-managed-grafana'
  | 'aws-proton'
  | 'aws-control-tower'
  | 'aws-distro-for-opentelemetry'
  | 'aws-chatbot'
  | 'aws-application-auto-scaling'
  // Iconos AWS IoT
  | 'aws-iot-core'
  | 'aws-iot-analytics'
  | 'aws-iot-greengrass'
  | 'aws-iot-sitewise'
  | 'aws-freertos'
  | 'aws-iot-things-graph'
  | 'aws-iot-events'
  | 'aws-iot-device-defender'
  | 'aws-iot-device-management'
  | 'aws-iot-button'
  | 'aws-iot-1-click'
  // Iconos AWS Machine Learning
  | 'aws-sagemaker'
  | 'aws-rekognition'
  | 'aws-comprehend'
  | 'aws-personalize'
  | 'aws-polly'
  | 'aws-translate'
  // Iconos AWS Analytics
  | 'aws-athena'
  | 'aws-glue'
  // Iconos AWS Migration & Transfer
  | 'aws-datasync'
  | 'aws-transfer-family'
  | 'aws-migration-hub'
  | 'aws-cloudendure-migration'
  | 'aws-server-migration-service'
  | 'aws-migration-evaluator'
  | 'aws-application-discovery-service'
  // Iconos AWS Developer Tools
  | 'aws-codepipeline'
  | 'aws-codecommit'
  | 'aws-codebuild'
  | 'aws-cloud9'
  | 'aws-corretto'
  | 'aws-xray'
  | 'aws-cli'
  | 'aws-tools-and-sdks'
  | 'aws-codestar'
  | 'aws-codedeploy'
  | 'aws-codeartifact'
  | 'aws-cloudshell'
  | 'aws-cdk'
  // New AWS Networking & Content Delivery
  | 'aws-global-accelerator'
  | 'aws-client-vpn'
  | 'aws-app-mesh'
  | 'aws-cloud-map'
  | 'aws-site-to-site-vpn'
  | 'aws-privatelink'
  // New AWS Security, Identity & Compliance
  | 'aws-inspector'
  | 'aws-macie'
  | 'aws-guardduty'
  | 'aws-security-hub'
  | 'aws-kms'
  | 'aws-directory-service'
  | 'aws-firewall-manager'
  | 'aws-certificate-manager'
  | 'aws-sso'
  | 'aws-detective'
  | 'aws-signer'
  | 'aws-resource-access-manager'
  | 'aws-iam'
  | 'aws-cloudhsm'
  | 'aws-audit-manager'
  | 'aws-artifact'
  // New AWS Media Services
  | 'aws-kinesis-video-streams'
  | 'aws-interactive-video-service'
  | 'aws-medialive'
  | 'aws-mediaconvert'
  | 'aws-mediapackage'
  | 'aws-nimble-studio'
  | 'aws-elastic-transcoder'
  | 'aws-elemental-mediatailor'
  | 'aws-elemental-server'
  | 'aws-elemental-mediastore'
  | 'aws-elemental-mediaconnect'
  | 'aws-elemental-live'
  | 'aws-elemental-link'
  | 'aws-elemental-conductor'
  | 'aws-elemental-delta'
  | 'aws-elemental-appliances-software'
  // AWS Front-End Web Mobile
  | 'aws-location-service'
  | 'aws-device-farm'
  | 'aws-amplify'
  // AWS End User Computing
  | 'aws-workspaces'
  | 'aws-worklink'
  | 'aws-appstream'
  // AWS Game Tech
  | 'aws-gamelift'
  | 'aws-lumberyard'
  | 'aws-robomaker'
  // AWS Quantum Technologies
  | 'aws-braket'
  // AWS Satellite
  | 'aws-ground-station'
  // AWS Specialized Services
  | 'aws-cloud-directory'
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
  { id: 'aws-documentdb', name: 'AWS DocumentDB', category: 'AWS Database', tags: ['aws', 'amazon', 'documentdb', 'mongodb', 'nosql', 'document'] },
  { id: 'aws-quantum-ledger-database', name: 'AWS QLDB', category: 'AWS Database', tags: ['aws', 'amazon', 'qldb', 'ledger', 'blockchain', 'inmutable'] },
  { id: 'aws-keyspaces', name: 'AWS Keyspaces', category: 'AWS Database', tags: ['aws', 'amazon', 'keyspaces', 'cassandra', 'nosql', 'wide column'] },
  { id: 'aws-rds-on-vmware', name: 'AWS RDS on VMware', category: 'AWS Database', tags: ['aws', 'amazon', 'rds', 'vmware', 'database', 'on-premise'] },
  
  // AWS App Integration
  { id: 'aws-api-gateway', name: 'AWS API Gateway', category: 'AWS App Integration', tags: ['aws', 'amazon', 'api', 'gateway', 'rest', 'http'] },
  { id: 'aws-app-sync', name: 'AWS App Sync', category: 'AWS App Integration', tags: ['aws', 'amazon', 'app', 'sync', 'database', 'graphql'] },
  { id: 'aws-step-functions', name: 'AWS Step Functions', category: 'AWS App Integration', tags: ['aws', 'amazon', 'step', 'functions', 'workflow', 'serverless'] },
  { id: 'aws-sns', name: 'AWS SNS', category: 'AWS App Integration', tags: ['aws', 'amazon', 'sns', 'notification', 'service', 'messaging'] },
  { id: 'aws-sqs', name: 'AWS SQS', category: 'AWS App Integration', tags: ['aws', 'amazon', 'sqs', 'queue', 'messaging', 'service'] },
  { id: 'aws-eventbridge', name: 'AWS EventBridge', category: 'AWS App Integration', tags: ['aws', 'amazon', 'eventbridge', 'event', 'serverless', 'integration', 'bus'] },
  
  // AWS Networking
  { id: 'aws-cloudfront', name: 'AWS CloudFront', category: 'AWS Networking', tags: ['aws', 'amazon', 'cloudfront', 'cdn', 'distribución', 'edge'] },
  { id: 'aws-route53', name: 'AWS Route 53', category: 'AWS Networking', tags: ['aws', 'amazon', 'route53', 'dns', 'dominio', 'nombre'] },
  { id: 'aws-vpc', name: 'AWS VPC', category: 'AWS Networking', tags: ['aws', 'amazon', 'vpc', 'red', 'private', 'cloud'] },
  { id: 'aws-direct-connect', name: 'AWS Direct Connect', category: 'AWS Networking', tags: ['aws', 'amazon', 'direct', 'connect', 'conexión', 'dedicada'] },
  { id: 'aws-elastic-load-balancing', name: 'AWS Elastic Load Balancing', category: 'AWS Networking', tags: ['aws', 'amazon', 'elb', 'alb', 'nlb', 'load', 'balancer', 'balanceador', 'carga'] },
  { id: 'aws-transit-gateway', name: 'AWS Transit Gateway', category: 'AWS Networking', tags: ['aws', 'amazon', 'transit', 'gateway', 'red', 'conectividad', 'vpc'] },
  
  // AWS Storage
  { id: 'aws-s3', name: 'AWS S3', category: 'AWS Storage', tags: ['aws', 'amazon', 's3', 'storage', 'bucket', 'object'] },
  { id: 'aws-efs', name: 'AWS EFS', category: 'AWS Storage', tags: ['aws', 'amazon', 'efs', 'elastic', 'file', 'system'] },
  { id: 'aws-glacier', name: 'AWS Glacier', category: 'AWS Storage', tags: ['aws', 'amazon', 'glacier', 'archive', 'backup', 'storage'] },
  { id: 'aws-ebs', name: 'AWS EBS', category: 'AWS Storage', tags: ['aws', 'amazon', 'ebs', 'elastic', 'block', 'store', 'volume'] },
  { id: 'aws-backup', name: 'AWS Backup', category: 'AWS Storage', tags: ['aws', 'amazon', 'backup', 'respaldo', 'copia', 'seguridad'] },
  { id: 'aws-fsx', name: 'AWS FSx', category: 'AWS Storage', tags: ['aws', 'amazon', 'fsx', 'file', 'system', 'windows', 'lustre'] },
  { id: 'aws-storage-gateway', name: 'AWS Storage Gateway', category: 'AWS Storage', tags: ['aws', 'amazon', 'storage', 'gateway', 'hybrid', 'on-premise'] },
  { id: 'aws-cloudendure-disaster-recovery', name: 'CloudEndure Disaster Recovery', category: 'AWS Storage', tags: ['aws', 'amazon', 'cloudendure', 'disaster', 'recovery', 'dr', 'backup'] },
  { id: 'aws-s3-on-outposts', name: 'Amazon S3 on Outposts', category: 'AWS Storage', tags: ['aws', 'amazon', 's3', 'outposts', 'on-premise', 'storage', 'hybrid'] },
  { id: 'aws-fsx-for-lustre', name: 'Amazon FSx for Lustre', category: 'AWS Storage', tags: ['aws', 'amazon', 'fsx', 'lustre', 'file', 'system', 'hpc'] },
  { id: 'aws-fsx-for-windows-file-server', name: 'Amazon FSx for Windows File Server', category: 'AWS Storage', tags: ['aws', 'amazon', 'fsx', 'windows', 'file', 'server', 'smb'] },
  { id: 'aws-snowmobile', name: 'AWS Snowmobile', category: 'AWS Storage', tags: ['aws', 'amazon', 'snowmobile', 'data', 'transfer', 'migration', 'petabyte'] },
  { id: 'aws-snowcone', name: 'AWS Snowcone', category: 'AWS Storage', tags: ['aws', 'amazon', 'snowcone', 'edge', 'computing', 'storage', 'portable'] },
  { id: 'aws-snowball', name: 'AWS Snowball', category: 'AWS Storage', tags: ['aws', 'amazon', 'snowball', 'data', 'transfer', 'migration', 'storage'] },
  { id: 'aws-snowball-edge', name: 'AWS Snowball Edge', category: 'AWS Storage', tags: ['aws', 'amazon', 'snowball', 'edge', 'computing', 'storage', 'hybrid'] },

  // AWS Security
  { id: 'aws-waf', name: 'AWS WAF', category: 'AWS Security', tags: ['aws', 'amazon', 'waf', 'firewall', 'seguridad', 'web', 'aplicación'] },
  { id: 'aws-shield', name: 'AWS Shield', category: 'AWS Security', tags: ['aws', 'amazon', 'shield', 'ddos', 'protección', 'seguridad'] },
  { id: 'aws-network-firewall', name: 'AWS Network Firewall', category: 'AWS Security', tags: ['aws', 'amazon', 'network', 'firewall', 'seguridad', 'red'] },
  { id: 'aws-secrets-manager', name: 'AWS Secrets Manager', category: 'AWS Security', tags: ['aws', 'amazon', 'secrets', 'manager', 'security', 'credentials', 'password'] },
  { id: 'aws-cognito', name: 'AWS Cognito', category: 'AWS Security', tags: ['aws', 'amazon', 'cognito', 'identity', 'authentication', 'user', 'pool'] },

  // AWS Management & Governance
  { id: 'aws-cloudwatch', name: 'AWS CloudWatch', category: 'AWS Management', tags: ['aws', 'amazon', 'cloudwatch', 'monitoreo', 'logs', 'métricas', 'alarmas'] },
  { id: 'aws-cloudformation', name: 'AWS CloudFormation', category: 'AWS Management', tags: ['aws', 'amazon', 'cloudformation', 'iac', 'infraestructura', 'código', 'plantilla'] },
  { id: 'aws-cloudtrail', name: 'AWS CloudTrail', category: 'AWS Management', tags: ['aws', 'amazon', 'cloudtrail', 'auditoría', 'logs', 'seguridad'] },
  { id: 'aws-auto-scaling', name: 'AWS Auto Scaling', category: 'AWS Management', tags: ['aws', 'amazon', 'auto', 'scaling', 'escalado', 'automático', 'grupo'] },
  { id: 'aws-config', name: 'AWS Config', category: 'AWS Management', tags: ['aws', 'amazon', 'config', 'compliance', 'auditoría', 'gestión'] },
  { id: 'aws-organizations', name: 'AWS Organizations', category: 'AWS Management', tags: ['aws', 'amazon', 'organizations', 'multi-account', 'gestión'] },
  { id: 'aws-systems-manager', name: 'AWS Systems Manager', category: 'AWS Management', tags: ['aws', 'amazon', 'systems manager', 'gestión', 'automatización'] },
  { id: 'aws-service-catalog', name: 'AWS Service Catalog', category: 'AWS Management', tags: ['aws', 'amazon', 'service catalog', 'catálogo', 'servicios'] },
  { id: 'aws-trusted-advisor', name: 'AWS Trusted Advisor', category: 'AWS Management', tags: ['aws', 'amazon', 'trusted advisor', 'recomendaciones', 'optimización'] },
  { id: 'aws-well-architected-tool', name: 'AWS Well-Architected Tool', category: 'AWS Management', tags: ['aws', 'amazon', 'well-architected', 'tool', 'mejores prácticas'] },
  { id: 'aws-launch-wizard', name: 'AWS Launch Wizard', category: 'AWS Management', tags: ['aws', 'amazon', 'launch wizard', 'despliegue', 'automatización'] },
  { id: 'aws-opsworks', name: 'AWS OpsWorks', category: 'AWS Management', tags: ['aws', 'amazon', 'opsworks', 'gestión', 'configuración'] },
  { id: 'aws-systems-manager-incident-manager', name: 'AWS Systems Manager Incident Manager', category: 'AWS Management', tags: ['aws', 'amazon', 'incident manager', 'gestión', 'incidentes'] },
  { id: 'aws-personal-health-dashboard', name: 'AWS Personal Health Dashboard', category: 'AWS Management', tags: ['aws', 'amazon', 'personal health dashboard', 'salud', 'monitorización'] },
  { id: 'aws-management-console', name: 'AWS Management Console', category: 'AWS Management', tags: ['aws', 'amazon', 'management console', 'consola', 'gestión'] },
  { id: 'aws-license-manager', name: 'AWS License Manager', category: 'AWS Management', tags: ['aws', 'amazon', 'license manager', 'licencias', 'gestión'] },
  { id: 'aws-fault-injection-simulator', name: 'AWS Fault Injection Simulator', category: 'AWS Management', tags: ['aws', 'amazon', 'fault injection', 'simulator', 'resiliencia'] },
  { id: 'aws-appconfig', name: 'AWS AppConfig', category: 'AWS Management', tags: ['aws', 'amazon', 'appconfig', 'configuración', 'aplicaciones'] },
  { id: 'aws-managed-prometheus', name: 'AWS Managed Prometheus', category: 'AWS Management', tags: ['aws', 'amazon', 'prometheus', 'managed service', 'monitoring', 'metrics'] },
  { id: 'aws-managed-grafana', name: 'AWS Managed Grafana', category: 'AWS Management', tags: ['aws', 'amazon', 'grafana', 'managed service', 'visualization', 'dashboards'] },
  { id: 'aws-proton', name: 'AWS Proton', category: 'AWS Management', tags: ['aws', 'amazon', 'proton', 'deployment', 'containers', 'serverless', 'automation'] },
  { id: 'aws-control-tower', name: 'AWS Control Tower', category: 'AWS Management', tags: ['aws', 'amazon', 'control tower', 'governance', 'multi-account', 'landing zone'] },
  { id: 'aws-distro-for-opentelemetry', name: 'AWS Distro for OpenTelemetry', category: 'AWS Management', tags: ['aws', 'amazon', 'opentelemetry', 'tracing', 'metrics', 'logs', 'monitoring'] },
  { id: 'aws-chatbot', name: 'AWS Chatbot', category: 'AWS Management', tags: ['aws', 'amazon', 'chatbot', 'notifications', 'slack', 'chime', 'devops'] },
  { id: 'aws-application-auto-scaling', name: 'AWS Application Auto Scaling', category: 'AWS Management', tags: ['aws', 'amazon', 'application', 'auto scaling', 'ecs', 'ec2 spot', 'dynamodb'] },
  
  // AWS IoT
  { id: 'aws-iot-core', name: 'AWS IoT Core', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'internet', 'things', 'dispositivos', 'conectados'] },
  { id: 'aws-iot-analytics', name: 'AWS IoT Analytics', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'analytics', 'análisis', 'datos', 'sensores'] },
  { id: 'aws-iot-greengrass', name: 'AWS IoT Greengrass', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'greengrass', 'edge', 'computing', 'local'] },
  { id: 'aws-iot-sitewise', name: 'AWS IoT SiteWise', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'sitewise', 'industrial', 'data'] },
  { id: 'aws-freertos', name: 'AWS FreeRTOS', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'freertos', 'real-time', 'microcontrollers'] },
  { id: 'aws-iot-things-graph', name: 'AWS IoT Things Graph', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'things graph', 'visual', 'workflow'] },
  { id: 'aws-iot-events', name: 'AWS IoT Events', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'events', 'detector', 'alerts'] },
  { id: 'aws-iot-device-defender', name: 'AWS IoT Device Defender', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'device defender', 'security', 'audit'] },
  { id: 'aws-iot-device-management', name: 'AWS IoT Device Management', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'device management', 'fleet', 'organization'] },
  { id: 'aws-iot-button', name: 'AWS IoT Button', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', 'button', 'hardware', 'trigger'] },
  { id: 'aws-iot-1-click', name: 'AWS IoT 1-Click', category: 'AWS IoT', tags: ['aws', 'amazon', 'iot', '1-click', 'lambda', 'trigger'] },

  // AWS Machine Learning
  { id: 'aws-sagemaker', name: 'AWS SageMaker', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'sagemaker', 'ml', 'machine learning', 'modelos', 'ai'] },
  { id: 'aws-rekognition', name: 'AWS Rekognition', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'rekognition', 'visión', 'imágenes', 'video', 'facial'] },
  { id: 'aws-comprehend', name: 'AWS Comprehend', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'comprehend', 'nlp', 'text', 'lenguaje natural'] },
  { id: 'aws-personalize', name: 'AWS Personalize', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'personalize', 'recomendación', 'personalización'] },
  { id: 'aws-polly', name: 'AWS Polly', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'polly', 'text-to-speech', 'voz', 'audio'] },
  { id: 'aws-translate', name: 'AWS Translate', category: 'AWS Machine Learning', tags: ['aws', 'amazon', 'translate', 'traducción', 'idiomas', 'lenguajes'] },

  // AWS Analytics
  { id: 'aws-athena', name: 'AWS Athena', category: 'AWS Analytics', tags: ['aws', 'amazon', 'athena', 'query', 'sql', 's3', 'data', 'analytics'] },
  { id: 'aws-glue', name: 'AWS Glue', category: 'AWS Analytics', tags: ['aws', 'amazon', 'glue', 'etl', 'data', 'catalog', 'integration'] },

  // AWS Migration & Transfer
  { id: 'aws-datasync', name: 'AWS DataSync', category: 'AWS Migration', tags: ['aws', 'amazon', 'datasync', 'sincronización', 'transferencia', 'datos'] },
  { id: 'aws-transfer-family', name: 'AWS Transfer Family', category: 'AWS Migration', tags: ['aws', 'amazon', 'transfer', 'sftp', 'ftps', 'ftp'] },
  { id: 'aws-migration-hub', name: 'AWS Migration Hub', category: 'AWS Migration', tags: ['aws', 'amazon', 'migration', 'migracion', 'hub', 'tracking'] },
  { id: 'aws-cloudendure-migration', name: 'CloudEndure Migration', category: 'AWS Migration', tags: ['aws', 'amazon', 'cloudendure', 'migration', 'server migration', 'disaster recovery'] },
  { id: 'aws-server-migration-service', name: 'AWS Server Migration Service', category: 'AWS Migration', tags: ['aws', 'amazon', 'server migration service', 'sms', 'vm migration', 'automate'] },
  { id: 'aws-migration-evaluator', name: 'AWS Migration Evaluator', category: 'AWS Migration', tags: ['aws', 'amazon', 'migration evaluator', 'assessment', 'cost estimation', 'planning'] },
  { id: 'aws-application-discovery-service', name: 'AWS Application Discovery Service', category: 'AWS Migration', tags: ['aws', 'amazon', 'application discovery', 'inventory', 'planning', 'migration'] },

  // AWS Developer Tools
  { id: 'aws-codepipeline', name: 'AWS CodePipeline', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codepipeline', 'ci/cd', 'pipeline', 'despliegue'] },
  { id: 'aws-codecommit', name: 'AWS CodeCommit', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codecommit', 'git', 'repositorio', 'código'] },
  { id: 'aws-codebuild', name: 'AWS CodeBuild', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codebuild', 'build', 'compilación', 'ci'] },
  { id: 'aws-cloud9', name: 'AWS Cloud9', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'cloud9', 'ide', 'desarrollo', 'editor'] },
  { id: 'aws-corretto', name: 'Amazon Corretto', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'corretto', 'java', 'jdk', 'runtime'] },
  { id: 'aws-xray', name: 'AWS X-Ray', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'xray', 'trace', 'debug', 'monitoring', 'performance'] },
  { id: 'aws-cli', name: 'AWS CLI', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'cli', 'command', 'line', 'interface', 'terminal'] },
  { id: 'aws-tools-and-sdks', name: 'AWS Tools & SDKs', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'tools', 'sdk', 'software', 'development', 'kit'] },
  { id: 'aws-codestar', name: 'AWS CodeStar', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codestar', 'develop', 'build', 'deploy', 'project'] },
  { id: 'aws-codedeploy', name: 'AWS CodeDeploy', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codedeploy', 'deploy', 'deployment', 'automation'] },
  { id: 'aws-codeartifact', name: 'AWS CodeArtifact', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'codeartifact', 'repository', 'maven', 'npm', 'python', 'artifact'] },
  { id: 'aws-cloudshell', name: 'AWS CloudShell', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'cloudshell', 'shell', 'terminal', 'cli', 'browser'] },
  { id: 'aws-cdk', name: 'AWS CDK', category: 'AWS Developer Tools', tags: ['aws', 'amazon', 'cdk', 'cloud', 'development', 'kit', 'iac', 'infrastructure'] },
  
  // New AWS Networking & Content Delivery
  { id: 'aws-global-accelerator', name: 'AWS Global Accelerator', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'global', 'accelerator', 'cdn', 'traffic'] },
  { id: 'aws-client-vpn', name: 'AWS Client VPN', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'client', 'vpn', 'remote', 'access'] },
  { id: 'aws-app-mesh', name: 'AWS App Mesh', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'app', 'mesh', 'service', 'mesh'] },
  { id: 'aws-cloud-map', name: 'AWS Cloud Map', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'cloud', 'map', 'service', 'discovery'] },
  { id: 'aws-site-to-site-vpn', name: 'AWS Site-to-Site VPN', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'site-to-site', 'vpn', 'connectivity'] },
  { id: 'aws-privatelink', name: 'AWS PrivateLink', category: 'Networking & Content Delivery', tags: ['aws', 'amazon', 'privatelink', 'vpc', 'endpoint', 'service'] },

  // New AWS Security, Identity & Compliance
  { id: 'aws-inspector', name: 'AWS Inspector', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'inspector', 'security', 'vulnerabilities'] },
  { id: 'aws-macie', name: 'AWS Macie', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'macie', 'security', 'data', 'privacy'] },
  { id: 'aws-guardduty', name: 'AWS GuardDuty', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'guardduty', 'threat', 'detection', 'security'] },
  { id: 'aws-security-hub', name: 'AWS Security Hub', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'security', 'hub', 'centralized', 'security'] },
  { id: 'aws-kms', name: 'AWS KMS', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'kms', 'key', 'management', 'security'] },
  { id: 'aws-directory-service', name: 'AWS Directory Service', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'directory', 'service', 'identity', 'management'] },
  { id: 'aws-firewall-manager', name: 'AWS Firewall Manager', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'firewall', 'manager', 'security', 'rules'] },
  { id: 'aws-certificate-manager', name: 'AWS Certificate Manager', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'certificate', 'manager', 'ssl', 'tls'] },
  { id: 'aws-sso', name: 'AWS SSO', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'sso', 'single', 'sign-on', 'identity'] },
  { id: 'aws-detective', name: 'Amazon Detective', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'detective', 'investigate', 'security', 'threats'] },
  { id: 'aws-signer', name: 'AWS Signer', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'signer', 'code signing', 'security', 'trust'] },
  { id: 'aws-resource-access-manager', name: 'AWS Resource Access Manager', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'ram', 'resource sharing', 'security', 'accounts'] },
  { id: 'aws-iam', name: 'AWS IAM', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'iam', 'identity', 'access management', 'security', 'users', 'roles'] },
  { id: 'aws-cloudhsm', name: 'AWS CloudHSM', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'cloudhsm', 'hardware security module', 'kms', 'encryption', 'keys'] },
  { id: 'aws-audit-manager', name: 'AWS Audit Manager', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'audit manager', 'compliance', 'audit', 'evidence'] },
  { id: 'aws-artifact', name: 'AWS Artifact', category: 'Security, Identity & Compliance', tags: ['aws', 'amazon', 'artifact', 'compliance reports', 'security', 'documents'] },
  
  // New AWS Media Services
  { id: 'aws-kinesis-video-streams', name: 'AWS Kinesis Video Streams', category: 'Media Services', tags: ['aws', 'amazon', 'kinesis', 'video', 'streams', 'media'] },
  { id: 'aws-interactive-video-service', name: 'AWS Interactive Video Service', category: 'Media Services', tags: ['aws', 'amazon', 'interactive', 'video', 'service', 'live'] },
  { id: 'aws-medialive', name: 'AWS MediaLive', category: 'Media Services', tags: ['aws', 'amazon', 'medialive', 'live', 'streaming', 'encoding'] },
  { id: 'aws-mediaconvert', name: 'AWS MediaConvert', category: 'Media Services', tags: ['aws', 'amazon', 'mediaconvert', 'video', 'conversion', 'encoding'] },
  { id: 'aws-mediapackage', name: 'AWS MediaPackage', category: 'Media Services', tags: ['aws', 'amazon', 'mediapackage', 'video', 'packaging', 'delivery'] },
  { id: 'aws-nimble-studio', name: 'Amazon Nimble Studio', category: 'Media Services', tags: ['aws', 'amazon', 'nimble', 'studio', 'content creation', 'animation', 'vfx'] },
  { id: 'aws-elastic-transcoder', name: 'Amazon Elastic Transcoder', category: 'Media Services', tags: ['aws', 'amazon', 'elastic', 'transcoder', 'video', 'conversion', 'format'] },
  { id: 'aws-elemental-mediatailor', name: 'AWS Elemental MediaTailor', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'mediatailor', 'ad insertion', 'personalization', 'video'] },
  { id: 'aws-elemental-server', name: 'AWS Elemental Server', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'server', 'on-premises', 'video processing', 'live', 'file-based'] },
  { id: 'aws-elemental-mediastore', name: 'AWS Elemental MediaStore', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'mediastore', 'storage', 'video origination', 'live', 'vod'] },
  { id: 'aws-elemental-mediaconnect', name: 'AWS Elemental MediaConnect', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'mediaconnect', 'video transport', 'live video', 'distribution'] },
  { id: 'aws-elemental-live', name: 'AWS Elemental Live', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'live', 'on-premises', 'live encoding', 'video processing'] },
  { id: 'aws-elemental-link', name: 'AWS Elemental Link', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'link', 'video contribution', 'live video', 'sdi', 'hdmi'] },
  { id: 'aws-elemental-conductor', name: 'AWS Elemental Conductor', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'conductor', 'on-premises', 'live video', 'management', 'automation'] },
  { id: 'aws-elemental-delta', name: 'AWS Elemental Delta', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'delta', 'on-premises', 'video delivery', 'just-in-time packaging'] },
  { id: 'aws-elemental-appliances-software', name: 'AWS Elemental Appliances & Software', category: 'Media Services', tags: ['aws', 'amazon', 'elemental', 'appliances', 'software', 'on-premises', 'video processing', 'solutions'] },

  // AWS Front-End Web Mobile
  { id: 'aws-location-service', name: 'AWS Location Service', category: 'AWS Front-End Web Mobile', tags: ['aws', 'amazon', 'location', 'service', 'maps', 'geospatial'] },
  { id: 'aws-device-farm', name: 'AWS Device Farm', category: 'AWS Front-End Web Mobile', tags: ['aws', 'amazon', 'device', 'farm', 'testing', 'mobile', 'app'] },
  { id: 'aws-amplify', name: 'AWS Amplify', category: 'AWS Front-End Web Mobile', tags: ['aws', 'amazon', 'amplify', 'develop', 'deploy', 'mobile', 'web', 'app'] },

  // AWS End User Computing
  { id: 'aws-workspaces', name: 'AWS WorkSpaces', category: 'AWS End User Computing', tags: ['aws', 'amazon', 'workspaces', 'desktop', 'virtual', 'dass'] },
  { id: 'aws-worklink', name: 'AWS WorkLink', category: 'AWS End User Computing', tags: ['aws', 'amazon', 'worklink', 'mobile', 'access', 'secure', 'internal'] },
  { id: 'aws-appstream', name: 'AWS AppStream', category: 'AWS End User Computing', tags: ['aws', 'amazon', 'appstream', 'application', 'streaming', 'desktop'] },

  // AWS Game Tech
  { id: 'aws-gamelift', name: 'AWS GameLift', category: 'AWS Game Tech', tags: ['aws', 'amazon', 'gamelift', 'game', 'server', 'hosting'] },
  { id: 'aws-lumberyard', name: 'AWS Lumberyard', category: 'AWS Game Tech', tags: ['aws', 'amazon', 'lumberyard', 'game', 'engine', 'development'] },
  { id: 'aws-robomaker', name: 'AWS RoboMaker', category: 'AWS Robotics', tags: ['aws', 'amazon', 'robomaker', 'robotics', 'simulation', 'ros'] },

  // AWS Quantum Technologies
  { id: 'aws-braket', name: 'Amazon Braket', category: 'AWS Quantum Technologies', tags: ['aws', 'amazon', 'braket', 'quantum', 'computing', 'algorithms'] },

  // AWS Satellite
  { id: 'aws-ground-station', name: 'AWS Ground Station', category: 'AWS Satellite', tags: ['aws', 'amazon', 'ground', 'station', 'satellite', 'communication'] },

  // AWS Specialized Services
  { id: 'aws-cloud-directory', name: 'AWS Cloud Directory', category: 'AWS Specialized Services', tags: ['aws', 'amazon', 'cloud', 'directory', 'hierarchical', 'data', 'identity'] },

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