pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_NAMESPACE   = 'yourdockerhubuser'
        BACKEND_IMAGE         = "${DOCKERHUB_NAMESPACE}/findx-backend"
        FRONTEND_IMAGE        = "${DOCKERHUB_NAMESPACE}/findx-frontend"
        IMAGE_TAG             = "${env.BUILD_NUMBER}"
        EC2_HOST              = credentials('findx-ec2-host')
        EC2_SSH_KEY           = credentials('findx-ec2-ssh-key')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'mvn -B clean compile'
                }
            }
        }

        stage('Backend Unit Tests') {
            steps {
                dir('backend') {
                    sh 'mvn -B test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend Package') {
            steps {
                dir('backend') {
                    sh 'mvn -B package -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['findx-ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                            cd /opt/findx &&
                            docker compose pull &&
                            docker compose up -d --remove-orphans
                        '
                    """
                }
            }
        }

        stage('Restart Containers') {
            steps {
                sshagent(credentials: ['findx-ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                            docker compose -f /opt/findx/docker-compose.yml restart
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'FindX deployed successfully.'
        }
        failure {
            echo 'FindX pipeline failed — check stage logs above.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}
