pipeline {
    agent Permanent_agent

    environment {
        TEST_RESULT_FILE = 'test_result.txt'
        REPO_URL = 'https://github.com/nonnosuke/DevOps2_Final.git'
        TESTING_SERVER = '52.70.71.157'
        STAGING_SERVER = '18.212.96.253'
        PRODUCTION_SERVER_1 = '13.222.173.239'
        PRODUCTION_SERVER_2 = '3.90.40.101'
    }

    stages {
        stage('Build') {
            steps {
                echo '🛠️ Building Tic-Tac-Toe application...'
                // If you need npm or dependencies, uncomment below
                // sh 'npm install'
            }
        }

        stage('Deploy to Testing') {
            steps {
                echo '🚀 Deploying to Testing Server...'
                sh """
                ssh ec2-user@$TESTING_SERVER "sudo rm -Rf /var/www/html/*"
                ssh ec2-user@$TESTING_SERVER "sudo git clone $REPO_URL /var/www/html"
                """
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo '🧪 Running Selenium tests on Testing environment...'
                script {
                    try {
                        // Run both Selenium tests
                        sh 'node selenium_tests/test_play_game.js'
                        sh 'node selenium_tests/test_validation.js'
                        writeFile file: env.TEST_RESULT_FILE, text: 'true'
                    } catch (Exception e) {
                        echo "❌ Selenium tests failed: ${e}"
                        writeFile file: env.TEST_RESULT_FILE, text: 'false'
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression {
                    readFile(env.TEST_RESULT_FILE).trim() == 'true'
                }
            }
            steps {
                echo '🚀 Deploying to Staging Server...'
                sh """
                ssh ec2-user@$STAGING_SERVER "sudo rm -Rf /var/www/html/*"
                ssh ec2-user@$STAGING_SERVER "sudo git clone $REPO_URL /var/www/html"
                """
            }
        }

        stage('Run Selenium Tests (Staging)') {
            when {
                expression {
                    readFile(env.TEST_RESULT_FILE).trim() == 'true'
                }
            }
            steps {
                echo '🧪 Running Selenium tests on Staging environment...'
                script {
                    try {
                        sh 'node selenium_tests/test_play_game.js'
                        sh 'node selenium_tests/test_validation.js'
                        writeFile file: env.TEST_RESULT_FILE, text: 'true'
                    } catch (Exception e) {
                        echo "❌ Selenium tests failed on Staging: ${e}"
                        writeFile file: env.TEST_RESULT_FILE, text: 'false'
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    readFile(env.TEST_RESULT_FILE).trim() == 'true'
                }
            }
            steps {
                echo '🚀 Deploying to Production Servers...'
                sh """
                ssh ec2-user@$PRODUCTION_SERVER_1 "sudo rm -Rf /var/www/html/*"
                ssh ec2-user@$PRODUCTION_SERVER_1 "sudo git clone $REPO_URL /var/www/html"
                ssh ec2-user@$PRODUCTION_SERVER_2 "sudo rm -Rf /var/www/html/*"
                ssh ec2-user@$PRODUCTION_SERVER_2 "sudo git clone $REPO_URL /var/www/html"
                """
            }
        }
    }

    post {
        always {
            echo '📦 Pipeline complete!'
            script {
                def result = readFile(env.TEST_RESULT_FILE).trim()
                if (result == 'true') {
                    echo '✅ Deployment successful — all tests passed!'
                } else {
                    echo '❌ Deployment stopped due to test failure.'
                }
            }
        }
    }
}
