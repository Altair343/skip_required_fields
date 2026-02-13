pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonarqubeScannerInstallation'
                    withSonarQubeEnv('sonarqubeInstallation') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=skip_required_fields \
                            -Dsonar.projectName=skip_required_fields \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }
    }
}