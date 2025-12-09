FRONTEND_REPO_URI="$ECR_URI_PREFIX/autoblog-frontend"
BACKEND_REPO_URI="$ECR_URI_PREFIX/autoblog-backend"


echo "Pulling latest changes from Git..."

cd /home/ec2-user/AutoBlog_Docker_Site
git pull origin main

echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI_PREFIX


echo "Pulling latest images from ECR and starting services..."

export FRONTEND_IMAGE_URI="$FRONTEND_REPO_URI:latest"
export BACKEND_IMAGE_URI="$BACKEND_REPO_URI:latest"


docker-compose -f docker-compose.yaml up -d --force-recreate --remove-orphans

echo "Deployment complete! Services are running in detached mode."
