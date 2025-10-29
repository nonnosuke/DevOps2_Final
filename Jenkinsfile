pipeline {
    agent any

    environment {
        TEST_RESULT_FILE = 'test_result.txt'
        REPO_URL = 'https://github.com/eduval/FinalExamSQA114-G1'
        TESTING_SERVER = '<Testing-Server-IP>'
        STAGING_SERVER = '<Staging-Server-IP>'
        PRODUCTION_SERVER_1 = '<Production-Server1-IP>'
        PRODUCTION_SERVER_2 = '<Production-Server2-IP>'
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
                ssh ec2-user@$TESTING_SERVER "sudo rm -rf /var/www/html/*"
                ssh ec2-user@$TESTING_SERVER "git clone $REPO_URL /var/www/html"
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
                ssh ec2-user@$STAGING_SERVER "sudo rm -rf /var/www/html/*"
                ssh ec2-user@$STAGING_SERVER "git clone $REPO_URL /var/www/html"
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
                ssh ec2-user@$PRODUCTION_SERVER_1 "sudo rm -rf /var/www/html/*"
                ssh ec2-user@$PRODUCTION_SERVER_1 "git clone $REPO_URL /var/www/html"
                ssh ec2-user@$PRODUCTION_SERVER_2 "sudo rm -rf /var/www/html/*"
                ssh ec2-user@$PRODUCTION_SERVER_2 "git clone $REPO_URL /var/www/html"
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
