import React from 'react';
import { IconType } from './types';

interface IconRendererProps {
  iconType: IconType;
  className?: string;
}

export function IconRenderer({ iconType, className = "w-6 h-6 text-gray-600" }: IconRendererProps) {
  // Función para renderizar el icono basado en su tipo
  switch (iconType) {
    case 'none':
      return null;
    
    // Iconos básicos
    case 'server': 
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      );
    case 'database':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case 'cloud':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'user':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'app':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    case 'web':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'api':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'config':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'security':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
      
    // Iconos AWS Compute
    case 'aws-ec2':
      return <img src="/assets/icons/aws/ec2.svg" className={className} alt="AWS EC2" style={{borderRadius: '7px'}} />;
    case 'aws-lambda':
      return <img src="/assets/icons/aws/lambda.svg" className={className} alt="AWS Lambda" style={{borderRadius: '7px'}} />;
    case 'aws-fargate':
      return <img src="/assets/icons/aws/fargate.svg" className={className} alt="AWS Fargate" style={{borderRadius: '7px'}} />;
    case 'aws-batch':
      return <img src="/assets/icons/aws/batch.svg" className={className} alt="AWS Batch" style={{borderRadius: '7px'}} />;
    case 'aws-elastic-beanstalk':
      return <img src="/assets/icons/aws/elastic-beanstalk.svg" className={className} alt="AWS Elastic Beanstalk" style={{borderRadius: '7px'}} />;
    case 'aws-app-runner':
      return <img src="/assets/icons/aws/app-runner.svg" className={className} alt="AWS App Runner" style={{borderRadius: '7px'}} />;
    case 'aws-wavelength':
      return <img src="/assets/icons/aws/wavelength.svg" className={className} alt="AWS Wavelength" style={{borderRadius: '7px'}} />;
    case 'aws-local-zones':
      return <img src="/assets/icons/aws/local-zones.svg" className={className} alt="AWS Local Zones" style={{borderRadius: '7px'}} />;
      
    // Iconos AWS Database
    case 'aws-rds':
      return <img src="/assets/icons/aws/rds.svg" className={className} alt="AWS RDS" style={{borderRadius: '7px'}} />;
    case 'aws-dynamodb':
      return <img src="/assets/icons/aws/dynamodb.svg" className={className} alt="AWS DynamoDB" style={{borderRadius: '7px'}} />;
    case 'aws-aurora':
      return <img src="/assets/icons/aws/aurora.svg" className={className} alt="AWS Aurora" style={{borderRadius: '7px'}} />;
    case 'aws-elasticache':
      return <img src="/assets/icons/aws/elasticache.svg" className={className} alt="AWS ElastiCache" style={{borderRadius: '7px'}} />;
    case 'aws-neptune':
      return <img src="/assets/icons/aws/neptune.svg" className={className} alt="AWS Neptune" style={{borderRadius: '7px'}} />;
    case 'aws-database-migration':
      return <img src="/assets/icons/aws/database-migration.svg" className={className} alt="AWS Database Migration" style={{borderRadius: '7px'}} />;
    case 'aws-timestream':
      return <img src="/assets/icons/aws/timestream.svg" className={className} alt="AWS Timestream" style={{borderRadius: '7px'}} />;
      
    // Iconos AWS App Integration
    case 'aws-api-gateway':
      return <img src="/assets/icons/aws/api-gateway.svg" className={className} alt="AWS API Gateway" style={{borderRadius: '7px'}} />;
    case 'aws-app-sync':
      return <img src="/assets/icons/aws/app-sync.svg" className={className} alt="AWS App Sync" style={{borderRadius: '7px'}} />;
    case 'aws-step-functions':
      return <img src="/assets/icons/aws/step-functions.svg" className={className} alt="AWS Step Functions" style={{borderRadius: '7px'}} />;
    case 'aws-sns':
      return <img src="/assets/icons/aws/sns.svg" className={className} alt="AWS SNS" style={{borderRadius: '7px'}} />;
    case 'aws-sqs':
      return <img src="/assets/icons/aws/sqs.svg" className={className} alt="AWS SQS" style={{borderRadius: '7px'}} />;
      
    // Iconos AWS Networking
    case 'aws-cloudfront':
      return <img src="/assets/icons/aws/cloudfront.svg" className={className} alt="AWS CloudFront" style={{borderRadius: '7px'}} />;
    case 'aws-route53':
      return <img src="/assets/icons/aws/route53.svg" className={className} alt="AWS Route 53" style={{borderRadius: '7px'}} />;
    case 'aws-vpc':
      return <img src="/assets/icons/aws/vpc.svg" className={className} alt="AWS VPC" style={{borderRadius: '7px'}} />;
    case 'aws-direct-connect':
      return <img src="/assets/icons/aws/direct-connect.svg" className={className} alt="AWS Direct Connect" />;
      
    // Iconos AWS Storage
    case 'aws-s3':
      return <img src="/assets/icons/aws/s3.svg" className={className} alt="AWS S3" style={{borderRadius: '7px'}} />;
    case 'aws-efs':
      return <img src="/assets/icons/aws/efs.svg" className={className} alt="AWS EFS" style={{borderRadius: '7px'}} />;
    case 'aws-glacier':
      return <img src="/assets/icons/aws/glacier.svg" className={className} alt="AWS Glacier" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Compute
    case 'gcp-compute-engine':
      return <img src="/assets/icons/gcp/compute_engine/compute_engine.svg" className={className} alt="GCP Compute Engine" style={{borderRadius: '7px'}} />;
    case 'gcp-kubernetes-engine':
      return <img src="/assets/icons/gcp/google_kubernetes_engine/google_kubernetes_engine.svg" className={className} alt="GCP Kubernetes Engine" style={{borderRadius: '7px'}} />;
    case 'gcp-app-engine':
      return <img src="/assets/icons/gcp/app_engine/app_engine.svg" className={className} alt="GCP App Engine" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-functions':
      return <img src="/assets/icons/gcp/cloud_functions/cloud_functions.svg" className={className} alt="GCP Cloud Functions" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-run':
      return <img src="/assets/icons/gcp/cloud_run/cloud_run.svg" className={className} alt="GCP Cloud Run" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Database
    case 'gcp-cloud-sql':
      return <img src="/assets/icons/gcp/cloud_sql/cloud_sql.svg" className={className} alt="GCP Cloud SQL" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-bigtable':
      return <img src="/assets/icons/gcp/bigtable/bigtable.svg" className={className} alt="GCP Cloud Bigtable" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-spanner':
      return <img src="/assets/icons/gcp/cloud_spanner/cloud_spanner.svg" className={className} alt="GCP Cloud Spanner" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-firestore':
      return <img src="/assets/icons/gcp/firestore/firestore.svg" className={className} alt="GCP Cloud Firestore" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-memorystore':
      return <img src="/assets/icons/gcp/memorystore/memorystore.svg" className={className} alt="GCP Cloud Memorystore" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Storage
    case 'gcp-cloud-storage':
      return <img src="/assets/icons/gcp/cloud_storage/cloud_storage.svg" className={className} alt="GCP Cloud Storage" style={{borderRadius: '7px'}} />;
    case 'gcp-persistent-disk':
      return <img src="/assets/icons/gcp/persistent_disk/persistent_disk.svg" className={className} alt="GCP Persistent Disk" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Networking
    case 'gcp-cloud-cdn':
      return <img src="/assets/icons/gcp/cloud_cdn/cloud_cdn.svg" className={className} alt="GCP Cloud CDN" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-load-balancing':
      return <img src="/assets/icons/gcp/cloud_load_balancing/cloud_load_balancing.svg" className={className} alt="GCP Cloud Load Balancing" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-vpn':
      return <img src="/assets/icons/gcp/cloud_vpn/cloud_vpn.svg" className={className} alt="GCP Cloud VPN" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP AI & ML
    case 'gcp-ai-platform':
      return <img src="/assets/icons/gcp/ai_platform/ai_platform.svg" className={className} alt="GCP AI Platform" style={{borderRadius: '7px'}} />;
    case 'gcp-automl':
      return <img src="/assets/icons/gcp/automl/automl.svg" className={className} alt="GCP AutoML" style={{borderRadius: '7px'}} />;
    case 'gcp-vision-ai':
      return <img src="/assets/icons/gcp/vision_ai/vision_ai.svg" className={className} alt="GCP Vision AI" style={{borderRadius: '7px'}} />;
    case 'gcp-speech-to-text':
      return <img src="/assets/icons/gcp/speech-to-text/speech-to-text.svg" className={className} alt="GCP Speech-to-Text" style={{borderRadius: '7px'}} />;
    case 'gcp-text-to-speech':
      return <img src="/assets/icons/gcp/text-to-speech/text-to-speech.svg" className={className} alt="GCP Text-to-Speech" style={{borderRadius: '7px'}} />;
    case 'gcp-natural-language':
      return <img src="/assets/icons/gcp/cloud_natural_language_api/cloud_natural_language_api.svg" className={className} alt="GCP Natural Language" style={{borderRadius: '7px'}} />;
    case 'gcp-translation':
      return <img src="/assets/icons/gcp/cloud_translation_api/cloud_translation_api.svg" className={className} alt="GCP Translation" style={{borderRadius: '7px'}} />;
    case 'gcp-dialogflow':
      return <img src="/assets/icons/gcp/dialogflow/dialogflow.svg" className={className} alt="GCP Dialogflow" style={{borderRadius: '7px'}} />;
    case 'gcp-document-ai':
      return <img src="/assets/icons/gcp/document_ai/document_ai.svg" className={className} alt="GCP Document AI" style={{borderRadius: '7px'}} />;
    case 'gcp-contact-center-ai':
      return <img src="/assets/icons/gcp/contact_center_ai/contact_center_ai.svg" className={className} alt="GCP Contact Center AI" style={{borderRadius: '7px'}} />;
    case 'gcp-healthcare-nlp-api':
      return <img src="/assets/icons/gcp/healthcare_nlp_api/healthcare_nlp_api.svg" className={className} alt="GCP Healthcare NLP API" style={{borderRadius: '7px'}} />;
    case 'gcp-recommendations-ai':
      return <img src="/assets/icons/gcp/recommendations_ai/recommendations_ai.svg" className={className} alt="GCP Recommendations AI" style={{borderRadius: '7px'}} />;
    case 'gcp-retail-api':
      return <img src="/assets/icons/gcp/retail_api/retail_api.svg" className={className} alt="GCP Retail API" style={{borderRadius: '7px'}} />;
    case 'gcp-media-translation-api':
      return <img src="/assets/icons/gcp/media_translation_api/media_translation_api.svg" className={className} alt="GCP Media Translation API" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-inference-api':
      return <img src="/assets/icons/gcp/cloud_inference_api/cloud_inference_api.svg" className={className} alt="GCP Cloud Inference API" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-vision-api':
      return <img src="/assets/icons/gcp/cloud_vision_api/cloud_vision_api.svg" className={className} alt="GCP Cloud Vision API" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Big Data
    case 'gcp-bigquery':
      return <img src="/assets/icons/gcp/bigquery/bigquery.svg" className={className} alt="GCP BigQuery" style={{borderRadius: '7px'}} />;
    case 'gcp-dataflow':
      return <img src="/assets/icons/gcp/dataflow/dataflow.svg" className={className} alt="GCP Dataflow" style={{borderRadius: '7px'}} />;
    case 'gcp-dataproc':
      return <img src="/assets/icons/gcp/dataproc/dataproc.svg" className={className} alt="GCP Dataproc" style={{borderRadius: '7px'}} />;
    case 'gcp-pubsub':
      return <img src="/assets/icons/gcp/pubsub/pubsub.svg" className={className} alt="GCP Pub/Sub" style={{borderRadius: '7px'}} />;
    case 'gcp-data-catalog':
      return <img src="/assets/icons/gcp/data_catalog/data_catalog.svg" className={className} alt="GCP Data Catalog" style={{borderRadius: '7px'}} />;
    case 'gcp-datalab':
      return <img src="/assets/icons/gcp/datalab/datalab.svg" className={className} alt="GCP Datalab" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP IoT
    case 'gcp-iot-core':
      return <img src="/assets/icons/gcp/iot_core/iot_core.svg" className={className} alt="GCP IoT Core" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Security
    case 'gcp-security-command-center':
      return <img src="/assets/icons/gcp/security_command_center/security_command_center.svg" className={className} alt="GCP Security Command Center" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-armor':
      return <img src="/assets/icons/gcp/cloud_armor/cloud_armor.svg" className={className} alt="GCP Cloud Armor" style={{borderRadius: '7px'}} />;
    case 'gcp-identity-platform':
      return <img src="/assets/icons/gcp/identity_platform/identity_platform.svg" className={className} alt="GCP Identity Platform" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP DevOps
    case 'gcp-cloud-build':
      return <img src="/assets/icons/gcp/cloud_build/cloud_build.svg" className={className} alt="GCP Cloud Build" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-source-repositories':
      return <img src="/assets/icons/gcp/cloud_source_repository.svg" className={className} alt="GCP Cloud Source Repositories" style={{borderRadius: '7px'}} />;
      // Nota: Ruta corregida para el icono de Cloud Source Repositories
    case 'gcp-artifact-registry':
      return <img src="/assets/icons/gcp/artifact_registry/artifact_registry.svg" className={className} alt="GCP Artifact Registry" style={{borderRadius: '7px'}} />;
      
    default:
      return null;
  }
}