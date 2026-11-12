pipeline {
  agent any

  environment {
    K8S_SERVER = 'https://127.0.0.1:62594'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy Next App') {
      steps {
        withCredentials([string(credentialsId: 'kubernetes-jenkis-server-account', variable: 'api_token')]) {
          bat '''
            kubectl --token %api_token% --server %K8S_SERVER% --insecure-skip-tls-verify=true apply -f k8s/app/deployment-next.yaml --validate=false
            kubectl --token %api_token% --server %K8S_SERVER% --insecure-skip-tls-verify=true apply -f k8s/app/service-next.yaml --validate=false
            kubectl --token %api_token% --server %K8S_SERVER% --insecure-skip-tls-verify=true rollout restart deployment/teatrop-nextjs-deployment
            kubectl --token %api_token% --server %K8S_SERVER% --insecure-skip-tls-verify=true rollout status deployment/teatrop-nextjs-deployment
          '''
        }
      }
    }
  }
}