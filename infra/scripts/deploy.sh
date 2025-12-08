AWS_REGION="<YOUR_AWS_REGION>"
ECR_URI_PREFIX="<YOUR_AWS_ACCOUNT_ID>.dkr.ecr.$AWS_REGION.amazonaws.com"
FRONTEND_REPO_URI="$ECR_URI_PREFIX/autoblog-frontend"
BACKEND_REPO_URI="$ECR_URI_PREFIX/autoblog-backend"

echo "Pulling latest changes from Git..."

cd /path/to/your/app 
git pull origin main 

# Logging in to ECR 
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI_PREFIX

# Running Docker Compose Deployment
echo "Pulling latest images from ECR and starting services..."

# Exporting ECR image URIs to the docker-compose environment for substitution
export FRONTEND_IMAGE_URI="$FRONTEND_REPO_URI:latest"
export BACKEND_IMAGE_URI="$BACKEND_REPO_URI:latest"


docker compose -f docker-compose.yaml up -d --force-recreate --remove-orphans

echo "Deployment complete! Services are running in detached mode."