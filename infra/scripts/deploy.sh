if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found. Deployment aborted."
    exit 1
fi

ECR_URI_PREFIX="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

FRONTEND_REPO_URI="$ECR_URI_PREFIX/${FRONTEND_IMAGE_NAME}"
BACKEND_REPO_URI="$ECR_URI_PREFIX/${BACKEND_IMAGE_NAME}"

echo "Pulling latest changes from Git..."

cd /home/ec2-user/Autoblog 
git pull origin main


echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI_PREFIX


echo "Pulling latest images from ECR and starting services..."

export FRONTEND_IMAGE_URI="${FRONTEND_REPO_URI}:latest"
export BACKEND_IMAGE_URI="${BACKEND_REPO_URI}:latest"

# Run Docker Compose
docker-compose up -d --force-recreate --remove-orphans

echo "Deployment complete! Services are running in detached mode."