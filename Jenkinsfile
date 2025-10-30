pipeline {
    agent any
        

    environment {
        TEST_RESULT_FILE = 'test_result.txt'
        TOKENAWS = credentials('ssh-credentials')
        REPO_URL = 'https://github.com/nonnosuke/DevOps2_Final.git'
        TESTING_SERVER = '23.20.189.207'
        STAGING_SERVER = '98.81.144.173'
        PRODUCTION_SERVER_1 = '54.166.238.106'
        PRODUCTION_SERVER_2 = '35.171.184.80'
    }

    stages {
        stage('Build') {
            steps {
                echo '🛠️ Building Tic-Tac-Toe application...'
                // If you need npm or dependencies, uncomment below
                // sh 'npm install'
                sh"""
                sudo dnf update -y
                sudo dnf install -y nodejs
                sudo dnf install -y npm
                sudo dnf install -y java-21-amazon-corretto git
                sudo yum install -y wget
                wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
                sudo yum -y localinstall google-chrome-stable_current_x86_64.rpm
                sudo dnf install -y google-chrome-stable
                mkdir -p selenium-tests && cd selenium-tests
                npm init -y
                npm install selenium-webdriver chromedriver
                sudo dnf install -y httpd
                sudo systemctl enable httpd
                sudo systemctl start httpd
                """
            }
        }

        stage('Deploy to Testing') {
            steps {
                echo '🚀 Deploying to Testing Server...'
                sh """
                ssh -T -oStrictHostKeyChecking=no -i "$TOKENAWS" ec2-user@$TESTING_SERVER "
                sudo dnf update -y; 
                sudo dnf install git -y; 
                sudo dnf install -y httpd; 
                sudo systemctl start httpd; 
                sudo rm -Rf /var/www/html; 
                sudo git clone $REPO_URL /var/www/html"
                """
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo '🧪 Running Selenium tests on Testing environment...'
                script {
                    try {
                        // Run both Selenium tests
                        //sh 'node selenium-tests/test_form.js'
                        sh 'node selenium_tests/test_validation.js'

                        //def output = sh(script: 'node selenium-tests/test_form.js', returnStdout: true).trim()
                        //Debugging printing the output
                        //echo "Test Output: ${output}"
                        writeFile file: env.TEST_RESULT_FILE, text: 'true'

                        /*if(output.contains('Test Success')){
                            writeFile file: env.TEST_RESULT_FILE, text: 'true'
                        }else{
                            writeFile file: env.TEST_RESULT_FILE, text: 'false'
                        }*/
                        
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
                    def result = readFile(env.TEST_RESULT_FILE).trim()
                    return result == 'true'
                }
            }
            steps {
                echo '🚀 Deploying to Staging Server...'
                sh """
                ssh -T -oStrictHostKeyChecking=no -i "$TOKENAWS" ec2-user@$STAGING_SERVER "
                sudo dnf update -y; 
                sudo dnf install git -y; 
                sudo dnf install -y httpd; 
                sudo systemctl start httpd; 
                sudo rm -Rf /var/www/html; 
                sudo git clone $REPO_URL /var/www/html"
                """
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    def result = readFile(env.TEST_RESULT_FILE).trim()
                    return result == 'true'
                }
            }
            steps {
                echo '🚀 Deploying to Production Servers...'
                sh """
                ssh -T -oStrictHostKeyChecking=no -i "$TOKENAWS" ec2-user@$PRODUCTION_SERVER_1 "
                sudo dnf update -y; 
                sudo dnf install git -y; 
                sudo dnf install -y httpd; 
                sudo systemctl start httpd; 
                sudo rm -Rf /var/www/html; 
                sudo git clone $REPO_URL /var/www/html"
                ssh -T -oStrictHostKeyChecking=no -i "$TOKENAWS" ec2-user@$PRODUCTION_SERVER_2 "
                sudo dnf update -y; 
                sudo dnf install git -y; 
                sudo dnf install -y httpd; 
                sudo systemctl start httpd; 
                sudo rm -Rf /var/www/html; 
                sudo git clone $REPO_URL /var/www/html"
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
