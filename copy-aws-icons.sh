#!/bin/bash

# Crear la estructura de directorios
mkdir -p public/assets/icons/aws

# AWS Compute
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_Amazon-EC2_64.svg" "public/assets/icons/aws/ec2.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Lambda_64.svg" "public/assets/icons/aws/lambda.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Fargate_64.svg" "public/assets/icons/aws/fargate.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Batch_64.svg" "public/assets/icons/aws/batch.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Elastic-Beanstalk_64.svg" "public/assets/icons/aws/elastic-beanstalk.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-App-Runner_64.svg" "public/assets/icons/aws/app-runner.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Wavelength_64.svg" "public/assets/icons/aws/wavelength.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Compute/64/Arch_AWS-Local-Zones_64.svg" "public/assets/icons/aws/local-zones.svg"

# AWS Database
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-RDS_64.svg" "public/assets/icons/aws/rds.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg" "public/assets/icons/aws/dynamodb.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-Aurora_64.svg" "public/assets/icons/aws/aurora.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-ElastiCache_64.svg" "public/assets/icons/aws/elasticache.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-Neptune_64.svg" "public/assets/icons/aws/neptune.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_AWS-Database-Migration-Service_64.svg" "public/assets/icons/aws/database-migration.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Database/64/Arch_Amazon-Timestream_64.svg" "public/assets/icons/aws/timestream.svg"

# AWS App Integration - Corregido con la ruta correcta
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_App-Integration/Arch_64/Arch_Amazon-API-Gateway_64.svg" "public/assets/icons/aws/api-gateway.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_App-Integration/Arch_64/Arch_AWS-AppSync_64.svg" "public/assets/icons/aws/app-sync.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_App-Integration/Arch_64/Arch_AWS-Step-Functions_64.svg" "public/assets/icons/aws/step-functions.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_App-Integration/Arch_64/Arch_Amazon-Simple-Notification-Service_64.svg" "public/assets/icons/aws/sns.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_App-Integration/Arch_64/Arch_Amazon-Simple-Queue-Service_64.svg" "public/assets/icons/aws/sqs.svg"

# AWS Networking
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg" "public/assets/icons/aws/cloudfront.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.svg" "public/assets/icons/aws/route53.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.svg" "public/assets/icons/aws/vpc.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Networking-Content-Delivery/64/Arch_AWS-Direct-Connect_64.svg" "public/assets/icons/aws/direct-connect.svg"

# AWS Storage
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg" "public/assets/icons/aws/s3.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Storage/64/Arch_Amazon-Elastic-File-System_64.svg" "public/assets/icons/aws/efs.svg"
cp "public/Asset-AWS/Architecture-Service-Icons_07302021/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service-Glacier_64.svg" "public/assets/icons/aws/glacier.svg"

echo "Iconos AWS copiados exitosamente a public/assets/icons/aws/" 