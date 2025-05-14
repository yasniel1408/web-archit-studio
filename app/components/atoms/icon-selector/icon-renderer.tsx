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
    case 'aws-documentdb':
      return <img src="/assets/icons/aws/documentdb.svg" className={className} alt="AWS DocumentDB" style={{borderRadius: '7px'}} />;
    case 'aws-quantum-ledger-database':
      return <img src="/assets/icons/aws/quantum-ledger-database.svg" className={className} alt="AWS QLDB" style={{borderRadius: '7px'}} />;
    case 'aws-keyspaces':
      return <img src="/assets/icons/aws/keyspaces.svg" className={className} alt="AWS Keyspaces" style={{borderRadius: '7px'}} />;
    case 'aws-rds-on-vmware':
      return <img src="/assets/icons/aws/rds-on-vmware.svg" className={className} alt="AWS RDS on VMware" style={{borderRadius: '7px'}} />;
      
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
    case 'aws-eventbridge':
      return <img src="/assets/icons/aws/eventbridge.svg" className={className} alt="AWS EventBridge" style={{borderRadius: '7px'}} />;
      
    // Iconos AWS Networking
    case 'aws-cloudfront':
      return <img src="/assets/icons/aws/cloudfront.svg" className={className} alt="AWS CloudFront" style={{borderRadius: '7px'}} />;
    case 'aws-route53':
      return <img src="/assets/icons/aws/route53.svg" className={className} alt="AWS Route 53" style={{borderRadius: '7px'}} />;
    case 'aws-vpc':
      return <img src="/assets/icons/aws/vpc.svg" className={className} alt="AWS VPC" style={{borderRadius: '7px'}} />;
    case 'aws-direct-connect':
      return <img src="/assets/icons/aws/direct-connect.svg" className={className} alt="AWS Direct Connect" />;
    case 'aws-elastic-load-balancing':
      return <img src="/assets/icons/aws/elastic-load-balancing.svg" className={className} alt="AWS Elastic Load Balancing" style={{borderRadius: '7px'}} />;
    case 'aws-transit-gateway':
      return <img src="/assets/icons/aws/transit-gateway.svg" className={className} alt="AWS Transit Gateway" style={{borderRadius: '7px'}} />;
      
    // Iconos AWS Storage
    case 'aws-s3':
      return <img src="/assets/icons/aws/s3.svg" className={className} alt="AWS S3" style={{borderRadius: '7px'}} />;
    case 'aws-efs':
      return <img src="/assets/icons/aws/efs.svg" className={className} alt="AWS EFS" style={{borderRadius: '7px'}} />;
    case 'aws-glacier':
      return <img src="/assets/icons/aws/glacier.svg" className={className} alt="AWS Glacier" style={{borderRadius: '7px'}} />;
    case 'aws-ebs':
      return <img src="/assets/icons/aws/ebs.svg" className={className} alt="AWS EBS" style={{borderRadius: '7px'}} />;
    case 'aws-backup':
      return <img src="/assets/icons/aws/backup.svg" className={className} alt="AWS Backup" style={{borderRadius: '7px'}} />;
    case 'aws-fsx':
      return <img src="/assets/icons/aws/fsx.svg" className={className} alt="AWS FSx" style={{borderRadius: '7px'}} />;
    case 'aws-storage-gateway':
      return <img src="/assets/icons/aws/storage-gateway.svg" className={className} alt="AWS Storage Gateway" style={{borderRadius: '7px'}} />;
    case 'aws-cloudendure-disaster-recovery':
      return <img src="/assets/icons/aws/cloudendure-disaster-recovery.svg" className={className} alt="CloudEndure Disaster Recovery" style={{borderRadius: '7px'}} />;
    case 'aws-s3-on-outposts':
      return <img src="/assets/icons/aws/s3-on-outposts.svg" className={className} alt="Amazon S3 on Outposts" style={{borderRadius: '7px'}} />;
    case 'aws-fsx-for-lustre':
      return <img src="/assets/icons/aws/fsx-for-lustre.svg" className={className} alt="Amazon FSx for Lustre" style={{borderRadius: '7px'}} />;
    case 'aws-fsx-for-windows-file-server':
      return <img src="/assets/icons/aws/fsx-for-windows-file-server.svg" className={className} alt="Amazon FSx for Windows File Server" style={{borderRadius: '7px'}} />;
    case 'aws-snowmobile':
      return <img src="/assets/icons/aws/snowmobile.svg" className={className} alt="AWS Snowmobile" style={{borderRadius: '7px'}} />;
    case 'aws-snowcone':
      return <img src="/assets/icons/aws/snowcone.svg" className={className} alt="AWS Snowcone" style={{borderRadius: '7px'}} />;
    case 'aws-snowball':
      return <img src="/assets/icons/aws/snowball.svg" className={className} alt="AWS Snowball" style={{borderRadius: '7px'}} />;
    case 'aws-snowball-edge':
      return <img src="/assets/icons/aws/snowball-edge.svg" className={className} alt="AWS Snowball Edge" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Security
    case 'aws-waf':
      return <img src="/assets/icons/aws/waf.svg" className={className} alt="AWS WAF" style={{borderRadius: '7px'}} />;
    case 'aws-shield':
      return <img src="/assets/icons/aws/shield.svg" className={className} alt="AWS Shield" style={{borderRadius: '7px'}} />;
    case 'aws-network-firewall':
      return <img src="/assets/icons/aws/network-firewall.svg" className={className} alt="AWS Network Firewall" style={{borderRadius: '7px'}} />;
    case 'aws-secrets-manager':
      return <img src="/assets/icons/aws/secrets-manager.svg" className={className} alt="AWS Secrets Manager" style={{borderRadius: '7px'}} />;
    case 'aws-cognito':
      return <img src="/assets/icons/aws/cognito.svg" className={className} alt="AWS Cognito" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Management & Governance
    case 'aws-cloudwatch':
      return <img src="/assets/icons/aws/cloudwatch.svg" className={className} alt="AWS CloudWatch" style={{borderRadius: '7px'}} />;
    case 'aws-cloudformation':
      return <img src="/assets/icons/aws/cloudformation.svg" className={className} alt="AWS CloudFormation" style={{borderRadius: '7px'}} />;
    case 'aws-cloudtrail':
      return <img src="/assets/icons/aws/cloudtrail.svg" className={className} alt="AWS CloudTrail" style={{borderRadius: '7px'}} />;
    case 'aws-auto-scaling':
      return <img src="/assets/icons/aws/auto-scaling.svg" className={className} alt="AWS Auto Scaling" style={{borderRadius: '7px'}} />;
    case 'aws-config':
      return <img src="/assets/icons/aws/config.svg" className={className} alt="AWS Config" style={{borderRadius: '7px'}} />;
    case 'aws-organizations':
      return <img src="/assets/icons/aws/organizations.svg" className={className} alt="AWS Organizations" style={{borderRadius: '7px'}} />;
    case 'aws-systems-manager':
      return <img src="/assets/icons/aws/systems-manager.svg" className={className} alt="AWS Systems Manager" style={{borderRadius: '7px'}} />;
    case 'aws-service-catalog':
      return <img src="/assets/icons/aws/service-catalog.svg" className={className} alt="AWS Service Catalog" style={{borderRadius: '7px'}} />;
    case 'aws-trusted-advisor':
      return <img src="/assets/icons/aws/trusted-advisor.svg" className={className} alt="AWS Trusted Advisor" style={{borderRadius: '7px'}} />;
    case 'aws-well-architected-tool':
      return <img src="/assets/icons/aws/well-architected-tool.svg" className={className} alt="AWS Well-Architected Tool" style={{borderRadius: '7px'}} />;
    case 'aws-launch-wizard':
      return <img src="/assets/icons/aws/launch-wizard.svg" className={className} alt="AWS Launch Wizard" style={{borderRadius: '7px'}} />;
    case 'aws-opsworks':
      return <img src="/assets/icons/aws/opsworks.svg" className={className} alt="AWS OpsWorks" style={{borderRadius: '7px'}} />;
    case 'aws-systems-manager-incident-manager':
      return <img src="/assets/icons/aws/systems-manager-incident-manager.svg" className={className} alt="AWS Systems Manager Incident Manager" style={{borderRadius: '7px'}} />;
    case 'aws-personal-health-dashboard':
      return <img src="/assets/icons/aws/personal-health-dashboard.svg" className={className} alt="AWS Personal Health Dashboard" style={{borderRadius: '7px'}} />;
    case 'aws-management-console':
      return <img src="/assets/icons/aws/management-console.svg" className={className} alt="AWS Management Console" style={{borderRadius: '7px'}} />;
    case 'aws-license-manager':
      return <img src="/assets/icons/aws/license-manager.svg" className={className} alt="AWS License Manager" style={{borderRadius: '7px'}} />;
    case 'aws-fault-injection-simulator':
      return <img src="/assets/icons/aws/fault-injection-simulator.svg" className={className} alt="AWS Fault Injection Simulator" style={{borderRadius: '7px'}} />;
    case 'aws-appconfig':
      return <img src="/assets/icons/aws/appconfig.svg" className={className} alt="AWS AppConfig" style={{borderRadius: '7px'}} />;
    case 'aws-managed-prometheus':
      return <img src="/assets/icons/aws/managed-prometheus.svg" className={className} alt="AWS Managed Prometheus" style={{borderRadius: '7px'}} />;
    case 'aws-managed-grafana':
      return <img src="/assets/icons/aws/managed-grafana.svg" className={className} alt="AWS Managed Grafana" style={{borderRadius: '7px'}} />;
    case 'aws-proton':
      return <img src="/assets/icons/aws/proton.svg" className={className} alt="AWS Proton" style={{borderRadius: '7px'}} />;
    case 'aws-control-tower':
      return <img src="/assets/icons/aws/control-tower.svg" className={className} alt="AWS Control Tower" style={{borderRadius: '7px'}} />;
    case 'aws-distro-for-opentelemetry':
      return <img src="/assets/icons/aws/distro-for-opentelemetry.svg" className={className} alt="AWS Distro for OpenTelemetry" style={{borderRadius: '7px'}} />;
    case 'aws-chatbot':
      return <img src="/assets/icons/aws/chatbot.svg" className={className} alt="AWS Chatbot" style={{borderRadius: '7px'}} />;
    case 'aws-application-auto-scaling':
      return <img src="/assets/icons/aws/application-auto-scaling.svg" className={className} alt="AWS Application Auto Scaling" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS IoT
    case 'aws-iot-core':
      return <img src="/assets/icons/aws/iot-core.svg" className={className} alt="AWS IoT Core" style={{borderRadius: '7px'}} />;
    case 'aws-iot-analytics':
      return <img src="/assets/icons/aws/iot-analytics.svg" className={className} alt="AWS IoT Analytics" style={{borderRadius: '7px'}} />;
    case 'aws-iot-greengrass':
      return <img src="/assets/icons/aws/iot-greengrass.svg" className={className} alt="AWS IoT Greengrass" style={{borderRadius: '7px'}} />;
    case 'aws-iot-sitewise':
      return <img src="/assets/icons/aws/iot-sitewise.svg" alt="AWS IoT SiteWise" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-freertos':
      return <img src="/assets/icons/aws/freertos.svg" alt="AWS FreeRTOS" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-things-graph':
      return <img src="/assets/icons/aws/iot-things-graph.svg" alt="AWS IoT Things Graph" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-events':
      return <img src="/assets/icons/aws/iot-events.svg" alt="AWS IoT Events" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-device-defender':
      return <img src="/assets/icons/aws/iot-device-defender.svg" alt="AWS IoT Device Defender" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-device-management':
      return <img src="/assets/icons/aws/iot-device-management.svg" alt="AWS IoT Device Management" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-button':
      return <img src="/assets/icons/aws/iot-button.svg" alt="AWS IoT Button" className={className} style={{borderRadius: '7px'}} />;
    case 'aws-iot-1-click':
      return <img src="/assets/icons/aws/iot-1-click.svg" alt="AWS IoT 1-Click" className={className} style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Machine Learning
    case 'aws-sagemaker':
      return <img src="/assets/icons/aws/sagemaker.svg" className={className} alt="AWS SageMaker" style={{borderRadius: '7px'}} />;
    case 'aws-rekognition':
      return <img src="/assets/icons/aws/rekognition.svg" className={className} alt="AWS Rekognition" style={{borderRadius: '7px'}} />;
    case 'aws-comprehend':
      return <img src="/assets/icons/aws/comprehend.svg" className={className} alt="AWS Comprehend" style={{borderRadius: '7px'}} />;
    case 'aws-personalize':
      return <img src="/assets/icons/aws/personalize.svg" className={className} alt="AWS Personalize" style={{borderRadius: '7px'}} />;
    case 'aws-polly':
      return <img src="/assets/icons/aws/polly.svg" className={className} alt="AWS Polly" style={{borderRadius: '7px'}} />;
    case 'aws-translate':
      return <img src="/assets/icons/aws/translate.svg" className={className} alt="AWS Translate" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Analytics
    case 'aws-athena':
      return <img src="/assets/icons/aws/athena.svg" className={className} alt="AWS Athena" style={{borderRadius: '7px'}} />;
    case 'aws-glue':
      return <img src="/assets/icons/aws/glue.svg" className={className} alt="AWS Glue" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Migration & Transfer
    case 'aws-datasync':
      return <img src="/assets/icons/aws/datasync.svg" className={className} alt="AWS DataSync" style={{borderRadius: '7px'}} />;
    case 'aws-transfer-family':
      return <img src="/assets/icons/aws/transfer-family.svg" className={className} alt="AWS Transfer Family" style={{borderRadius: '7px'}} />;
    case 'aws-migration-hub':
      return <img src="/assets/icons/aws/migration-hub.svg" className={className} alt="AWS Migration Hub" style={{borderRadius: '7px'}} />;
    case 'aws-cloudendure-migration':
      return <img src="/assets/icons/aws/cloudendure-migration.svg" className={className} alt="CloudEndure Migration" style={{borderRadius: '7px'}} />;
    case 'aws-server-migration-service':
      return <img src="/assets/icons/aws/server-migration-service.svg" className={className} alt="AWS Server Migration Service" style={{borderRadius: '7px'}} />;
    case 'aws-migration-evaluator':
      return <img src="/assets/icons/aws/migration-evaluator.svg" className={className} alt="AWS Migration Evaluator" style={{borderRadius: '7px'}} />;
    case 'aws-application-discovery-service':
      return <img src="/assets/icons/aws/application-discovery-service.svg" className={className} alt="AWS Application Discovery Service" style={{borderRadius: '7px'}} />;
    
    // Iconos AWS Developer Tools
    case 'aws-codepipeline':
      return <img src="/assets/icons/aws/codepipeline.svg" className={className} alt="AWS CodePipeline" style={{borderRadius: '7px'}} />;
    case 'aws-codecommit':
      return <img src="/assets/icons/aws/codecommit.svg" className={className} alt="AWS CodeCommit" style={{borderRadius: '7px'}} />;
    case 'aws-codebuild':
      return <img src="/assets/icons/aws/codebuild.svg" className={className} alt="AWS CodeBuild" style={{borderRadius: '7px'}} />;
    case 'aws-cloud9':
      return <img src="/assets/icons/aws/cloud9.svg" className={className} alt="AWS Cloud9" style={{borderRadius: '7px'}} />;
    case 'aws-corretto':
      return <img src="/assets/icons/aws/corretto.svg" className={className} alt="Amazon Corretto" style={{borderRadius: '7px'}} />;
    case 'aws-xray':
      return <img src="/assets/icons/aws/xray.svg" className={className} alt="AWS X-Ray" style={{borderRadius: '7px'}} />;
    case 'aws-cli':
      return <img src="/assets/icons/aws/cli.svg" className={className} alt="AWS CLI" style={{borderRadius: '7px'}} />;
    case 'aws-tools-and-sdks':
      return <img src="/assets/icons/aws/tools-and-sdks.svg" className={className} alt="AWS Tools & SDKs" style={{borderRadius: '7px'}} />;
    case 'aws-codestar':
      return <img src="/assets/icons/aws/codestar.svg" className={className} alt="AWS CodeStar" style={{borderRadius: '7px'}} />;
    case 'aws-codedeploy':
      return <img src="/assets/icons/aws/codedeploy.svg" className={className} alt="AWS CodeDeploy" style={{borderRadius: '7px'}} />;
    case 'aws-codeartifact':
      return <img src="/assets/icons/aws/codeartifact.svg" className={className} alt="AWS CodeArtifact" style={{borderRadius: '7px'}} />;
    case 'aws-cloudshell':
      return <img src="/assets/icons/aws/cloudshell.svg" className={className} alt="AWS CloudShell" style={{borderRadius: '7px'}} />;
    case 'aws-cdk':
      return <img src="/assets/icons/aws/cdk.svg" className={className} alt="AWS CDK" style={{borderRadius: '7px'}} />;
    
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
    case 'gcp-contact-center-ai':
      return <img src="/assets/icons/gcp/contact_center_ai/contact_center_ai.svg" className={className} alt="GCP Contact Center AI" style={{borderRadius: '7px'}} />;
    case 'gcp-healthcare-nlp-api':
      return <img src="/assets/icons/gcp/healthcare_nlp_api/healthcare_nlp_api.svg" className={className} alt="GCP Healthcare NLP API" style={{borderRadius: '7px'}} />;
    case 'gcp-recommendations-ai':
      return <img src="/assets/icons/gcp/recommendations_ai/recommendations_ai.svg" className={className} alt="GCP Recommendations AI" style={{borderRadius: '7px'}} />;
    case 'gcp-retail-api':
      return <img src="/assets/icons/gcp/retail_api/retail_api.svg" className={className} alt="GCP Retail API" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-inference-api':
      return <img src="/assets/icons/gcp/cloud_inference_api/cloud_inference_api.svg" className={className} alt="GCP Cloud Inference API" style={{borderRadius: '7px'}} />;
    
    // Iconos GCP Big Data
    case 'gcp-bigquery':
      return <img src="/assets/icons/gcp/bigquery/bigquery.svg" className={className} alt="GCP BigQuery" style={{borderRadius: '7px'}} />;
    case 'gcp-dataflow':
      return <img src="/assets/icons/gcp/dataflow/dataflow.svg" className={className} alt="GCP Dataflow" style={{borderRadius: '7px'}} />;
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
    case 'gcp-artifact-registry':
      return <img src="/assets/icons/gcp/artifact_registry/artifact_registry.svg" className="w-6 h-6" alt="GCP Artifact Registry" style={{ borderRadius: '7px' }} />;
    case 'gcp-cloud-shell':
      return <img src="/assets/icons/gcp/cloud_shell/cloud_shell.svg" className={className} alt="GCP Cloud Shell" style={{borderRadius: '7px'}} />;
    case 'gcp-secret-manager':
      return <img src="/assets/icons/gcp/secret_manager/secret_manager.svg" className={className} alt="GCP Secret Manager" style={{borderRadius: '7px'}} />;
    case 'gcp-batch':
      return <img src="/assets/icons/gcp/batch/batch.svg" className={className} alt="GCP Batch" style={{borderRadius: '7px'}} />;
    case 'gcp-binary-authorization':
      return <img src="/assets/icons/gcp/binary_authorization/binary_authorization.svg" className={className} alt="GCP Binary Authorization" style={{borderRadius: '7px'}} />;
    case 'gcp-cloud-deploy':
      return <img src="/assets/icons/gcp/cloud_deploy/cloud_deploy.svg" className={className} alt="GCP Cloud Deploy" style={{borderRadius: '7px'}} />;
    case 'gcp-web-risk':
      return <img src="/assets/icons/gcp/web_risk/web_risk.svg" className={className} alt="GCP Web Risk" style={{borderRadius: '7px'}} />;
    case 'gcp-web-security-scanner':
      return <img src="/assets/icons/gcp/web_security_scanner/web_security_scanner.svg" className={className} alt="GCP Web Security Scanner" style={{borderRadius: '7px'}} />;
    case 'gcp-workflows':
      return <img src="/assets/icons/gcp/workflows/workflows.svg" className={className} alt="GCP Workflows" style={{borderRadius: '7px'}} />;
    case 'gcp-workload-identity-pool':
      return <img src="/assets/icons/gcp/workload_identity_pool/workload_identity_pool.svg" className={className} alt="GCP Workload Identity Pool" style={{borderRadius: '7px'}} />;
    case 'gcp-virtual-private-cloud':
      return <img src="/assets/icons/gcp/virtual_private_cloud/virtual_private_cloud.svg" className={className} alt="GCP Virtual Private Cloud" style={{borderRadius: '7px'}} />;
    case 'gcp-visual-inspection':
      return <img src="/assets/icons/gcp/visual_inspection/visual_inspection.svg" className={className} alt="GCP Visual Inspection" style={{borderRadius: '7px'}} />;
    case 'gcp-vmware-engine':
      return <img src="/assets/icons/gcp/vmware_engine/vmware_engine.svg" className={className} alt="GCP VMware Engine" style={{borderRadius: '7px'}} />;
    case 'gcp-transfer-appliance':
      return <img src="/assets/icons/gcp/transfer_appliance/transfer_appliance.svg" className={className} alt="GCP Transfer Appliance" style={{borderRadius: '7px'}} />;
    case 'gcp-user-preferences':
      return <img src="/assets/icons/gcp/user_preferences/user_preferences.svg" className={className} alt="GCP User Preferences" style={{borderRadius: '7px'}} />;
    case 'gcp-vertexai':
      return <img src="/assets/icons/gcp/vertexai/vertexai.svg" className={className} alt="GCP Vertex AI" style={{borderRadius: '7px'}} />;
    case 'gcp-video-intelligence-api':
      return <img src="/assets/icons/gcp/video_intelligence_api/video_intelligence_api.svg" className={className} alt="GCP Video Intelligence API" style={{borderRadius: '7px'}} />;
    case 'gcp-trace':
      return <img src="/assets/icons/gcp/trace/trace.svg" className={className} alt="GCP Trace" style={{borderRadius: '7px'}} />;
    case 'gcp-traffic-director':
      return <img src="/assets/icons/gcp/traffic_director/traffic_director.svg" className={className} alt="GCP Traffic Director" style={{borderRadius: '7px'}} />;
    case 'gcp-transfer':
      return <img src="/assets/icons/gcp/transfer/transfer.svg" className={className} alt="GCP Transfer" style={{borderRadius: '7px'}} />;

    // New AWS Networking & Content Delivery
    case 'aws-global-accelerator':
      return <img src="/assets/icons/aws/global-accelerator.svg" className={className} alt="AWS Global Accelerator" style={{borderRadius: '7px'}} />;
    case 'aws-client-vpn':
      return <img src="/assets/icons/aws/client-vpn.svg" className={className} alt="AWS Client VPN" style={{borderRadius: '7px'}} />;
    case 'aws-app-mesh':
      return <img src="/assets/icons/aws/app-mesh.svg" className={className} alt="AWS App Mesh" style={{borderRadius: '7px'}} />;
    case 'aws-cloud-map':
      return <img src="/assets/icons/aws/cloud-map.svg" className={className} alt="AWS Cloud Map" style={{borderRadius: '7px'}} />;
    case 'aws-site-to-site-vpn':
      return <img src="/assets/icons/aws/site-to-site-vpn.svg" className={className} alt="AWS Site-to-Site VPN" style={{borderRadius: '7px'}} />;
    case 'aws-privatelink':
      return <img src="/assets/icons/aws/privatelink.svg" className={className} alt="AWS PrivateLink" style={{borderRadius: '7px'}} />;

    // New AWS Security, Identity & Compliance
    case 'aws-inspector':
      return <img src="/assets/icons/aws/inspector.svg" className={className} alt="AWS Inspector" style={{borderRadius: '7px'}} />;
    case 'aws-macie':
      return <img src="/assets/icons/aws/macie.svg" className={className} alt="AWS Macie" style={{borderRadius: '7px'}} />;
    case 'aws-guardduty':
      return <img src="/assets/icons/aws/guardduty.svg" className={className} alt="AWS GuardDuty" style={{borderRadius: '7px'}} />;
    case 'aws-security-hub':
      return <img src="/assets/icons/aws/security-hub.svg" className={className} alt="AWS Security Hub" style={{borderRadius: '7px'}} />;
    case 'aws-kms':
      return <img src="/assets/icons/aws/kms.svg" className={className} alt="AWS KMS" style={{borderRadius: '7px'}} />;
    case 'aws-directory-service':
      return <img src="/assets/icons/aws/directory-service.svg" className={className} alt="AWS Directory Service" style={{borderRadius: '7px'}} />;
    case 'aws-firewall-manager':
      return <img src="/assets/icons/aws/firewall-manager.svg" className={className} alt="AWS Firewall Manager" style={{borderRadius: '7px'}} />;
    case 'aws-certificate-manager':
      return <img src="/assets/icons/aws/certificate-manager.svg" className={className} alt="AWS Certificate Manager" style={{borderRadius: '7px'}} />;
    case 'aws-sso':
      return <img src="/assets/icons/aws/sso.svg" className={className} alt="AWS SSO" style={{borderRadius: '7px'}} />;
    case 'aws-detective':
      return <img src="/assets/icons/aws/detective.svg" className={className} alt="Amazon Detective" style={{borderRadius: '7px'}} />;
    case 'aws-signer':
      return <img src="/assets/icons/aws/signer.svg" className={className} alt="AWS Signer" style={{borderRadius: '7px'}} />;
    case 'aws-resource-access-manager':
      return <img src="/assets/icons/aws/resource-access-manager.svg" className={className} alt="AWS Resource Access Manager" style={{borderRadius: '7px'}} />;
    case 'aws-iam':
      return <img src="/assets/icons/aws/iam.svg" className={className} alt="AWS IAM" style={{borderRadius: '7px'}} />;
    case 'aws-cloudhsm':
      return <img src="/assets/icons/aws/cloudhsm.svg" className={className} alt="AWS CloudHSM" style={{borderRadius: '7px'}} />;
    case 'aws-audit-manager':
      return <img src="/assets/icons/aws/audit-manager.svg" className={className} alt="AWS Audit Manager" style={{borderRadius: '7px'}} />;
    case 'aws-artifact':
      return <img src="/assets/icons/aws/artifact.svg" className={className} alt="AWS Artifact" style={{borderRadius: '7px'}} />;

    // New AWS Media Services
    case 'aws-kinesis-video-streams':
      return <img src="/assets/icons/aws/kinesis-video-streams.svg" className={className} alt="AWS Kinesis Video Streams" style={{borderRadius: '7px'}} />;
    case 'aws-interactive-video-service':
      return <img src="/assets/icons/aws/interactive-video-service.svg" className={className} alt="AWS Interactive Video Service" style={{borderRadius: '7px'}} />;
    case 'aws-medialive':
      return <img src="/assets/icons/aws/medialive.svg" className={className} alt="AWS MediaLive" style={{borderRadius: '7px'}} />;
    case 'aws-mediaconvert':
      return <img src="/assets/icons/aws/mediaconvert.svg" className={className} alt="AWS MediaConvert" style={{borderRadius: '7px'}} />;
    case 'aws-mediapackage':
      return <img src="/assets/icons/aws/mediapackage.svg" className={className} alt="AWS MediaPackage" style={{borderRadius: '7px'}} />;
    case 'aws-nimble-studio':
      return <img src="/assets/icons/aws/nimble-studio.svg" className={className} alt="Amazon Nimble Studio" style={{borderRadius: '7px'}} />;
    case 'aws-elastic-transcoder':
      return <img src="/assets/icons/aws/elastic-transcoder.svg" className={className} alt="Amazon Elastic Transcoder" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-mediatailor':
      return <img src="/assets/icons/aws/elemental-mediatailor.svg" className={className} alt="AWS Elemental MediaTailor" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-server':
      return <img src="/assets/icons/aws/elemental-server.svg" className={className} alt="AWS Elemental Server" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-mediastore':
      return <img src="/assets/icons/aws/elemental-mediastore.svg" className={className} alt="AWS Elemental MediaStore" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-mediaconnect':
      return <img src="/assets/icons/aws/elemental-mediaconnect.svg" className={className} alt="AWS Elemental MediaConnect" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-live':
      return <img src="/assets/icons/aws/elemental-live.svg" className={className} alt="AWS Elemental Live" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-link':
      return <img src="/assets/icons/aws/elemental-link.svg" className={className} alt="AWS Elemental Link" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-conductor':
      return <img src="/assets/icons/aws/elemental-conductor.svg" className={className} alt="AWS Elemental Conductor" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-delta':
      return <img src="/assets/icons/aws/elemental-delta.svg" className={className} alt="AWS Elemental Delta" style={{borderRadius: '7px'}} />;
    case 'aws-elemental-appliances-software':
      return <img src="/assets/icons/aws/elemental-appliances-software.svg" className={className} alt="AWS Elemental Appliances & Software" style={{borderRadius: '7px'}} />;

    // AWS Front-End Web Mobile
    case 'aws-location-service':
      return <img src="/assets/icons/aws/location-service.svg" className={className} alt="AWS Location Service" style={{borderRadius: '7px'}} />;
    case 'aws-device-farm':
      return <img src="/assets/icons/aws/device-farm.svg" className={className} alt="AWS Device Farm" style={{borderRadius: '7px'}} />;
    case 'aws-amplify':
      return <img src="/assets/icons/aws/amplify.svg" className={className} alt="AWS Amplify" style={{borderRadius: '7px'}} />;

    // AWS End User Computing
    case 'aws-workspaces':
      return <img src="/assets/icons/aws/workspaces.svg" className={className} alt="AWS WorkSpaces" style={{borderRadius: '7px'}} />;
    case 'aws-worklink':
      return <img src="/assets/icons/aws/worklink.svg" className={className} alt="AWS WorkLink" style={{borderRadius: '7px'}} />;
    case 'aws-appstream':
      return <img src="/assets/icons/aws/appstream.svg" className={className} alt="AWS AppStream" style={{borderRadius: '7px'}} />;

    // AWS Game Tech
    case 'aws-gamelift':
      return <img src="/assets/icons/aws/gamelift.svg" className={className} alt="AWS GameLift" style={{borderRadius: '7px'}} />;
    case 'aws-lumberyard':
      return <img src="/assets/icons/aws/lumberyard.svg" className={className} alt="AWS Lumberyard" style={{borderRadius: '7px'}} />;

    // AWS Robotics
    case 'aws-robomaker':
      return <img src="/assets/icons/aws/robomaker.svg" className={className} alt="AWS RoboMaker" style={{borderRadius: '7px'}} />;

    // AWS Quantum Technologies
    case 'aws-braket':
      return <img src="/assets/icons/aws/braket.svg" className={className} alt="Amazon Braket" style={{borderRadius: '7px'}} />;

    // AWS Satellite
    case 'aws-ground-station':
      return <img src="/assets/icons/aws/ground-station.svg" className={className} alt="AWS Ground Station" style={{borderRadius: '7px'}} />;

    // AWS Specialized Services
    case 'aws-cloud-directory':
      return <img src="/assets/icons/aws/cloud-directory.svg" className={className} alt="AWS Cloud Directory" style={{borderRadius: '7px'}} />;

    default:
      return null;
  }
}