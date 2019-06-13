def cf_dist = [
    nyfw: [
        dev: 'E27GVEZTWYC64P',
        dev_bucket: 'dev-nyfw.bkstg.com',
        prod: 'E35H1XW38E76P5',
        prod_bucket: 'nyfwexperience.com',
    ],
    frieze_la: [
        dev: 'E1HMTTXHPVPHC7',
        dev_bucket: 'dev-frieze-la.bkstg.com',
        prod: 'E1EBF8B0DMSWP1',
        prod_bucket: 'friezelaexperince.com',
    ],
    miamiopen: [
        dev: 'E1NV39M0PZDON2',
        dev_bucket: 'dev-miamiopen.ee.bkstg.it',
        prod: 'E3G2PVNM2JTPI8',
        prod_bucket: 'prod-miamiopen.ee.bkstg.it',
    ],
    cwexperiences: [
        dev: 'E10V4VGN1ZZY3',
        dev_bucket: 'dev-cwexperiences.ee.bkstg.it',
        prod: 'E2T4KVDP445EKV',
        prod_bucket: 'prod-cwexperiences.ee.bkstg.it',
    ],
    augustaatnight: [
        dev: 'E2E5H9THKNDJ8U',
        dev_bucket: 'dev-augustaatnight.ee.bkstg.it',
        prod: 'E16WVS1XY1SWCS',
        prod_bucket: 'prod-augustaatnight.ee.bkstg.it',
    ],
    ufcexperiences: [
        dev: 'E1NSXGQ2VD9UL2',
        dev_bucket: 'dev-ufcexperiences.ee.bkstg.it',
        prod: 'E28SG5FI6RG0SN',
        prod_bucket: 'prod-ufcexperiences.ee.bkstg.it',
    ],
    demo: [
        demo_1: 'E1UC1EFRQAIINC',
        demo_1_bucket: 'demo-1.ee.bkstg.it',
        demo_2: 'E1MQNNDIQ7LO95',
        demo_2_bucket: 'demo-2.ee.bkstg.it',
    ],
    dev_1: [
        dev: 'E3UF0DYUPHZXJ9',
        dev_bucket: 'dev-1.ee.bkstg.it',
    ],
    dev_2: [
        dev: 'E2T482EKEW0YXW',
        dev_bucket: 'dev-2.ee.bkstg.it',
    ],
    dev_3: [
        dev: 'E2D6FA44LKVTWA',
        dev_bucket: 'dev-3.ee.bkstg.it',
    ],
]

pipeline {
    agent any
    environment {
        workspace = pwd()
    }
    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Build') {
            agent {
                label 'static_build'
            }
            steps {
                cleanWs()
                echo 'Building..'
                checkout scm

                script {
                    currentBuild.displayName = "${BUILD_NUMBER} - ${GIT_BRANCH} - ENV: ${SERVER_ENV}"
                }
                sh "source /opt/rh/rh-nodejs10/enable && npm install"
                sh "source /opt/rh/rh-nodejs10/enable && npm run build:${env.SERVER_ENV}"
            }
        }
        stage('Deploy') {
            agent {
                label "static_build"
            }
            steps {
                echo 'Deploying....'
                //echo "ENV VARS: SCOPE=${env.SCOPE} SERVICE=${env.SERVICE} ENV=${env.SERVER_ENV} PROJECT_NAME=${PROJECT_NAME} PATH_TO_FILES=${PATH_TO_FILES} BUCKET_NAME=${env.BUCKET_NAME}"
                withAWS(credentials: "${env.SCOPE}_${env.SERVICE}_${env.SERVER_ENV}") {

                    //s3Upload(file:"${PROJECT_NAME}/dist/", bucket:"${env.BUCKET_NAME}", path:'/')
                    script {
                        def bucketName = ''
                        if (SERVER_ENV == "prod") {
                            bucketName = "prod_bucket"
                        } else {
                            bucketName = "dev_bucket"
                        }
                        echo "${bucketName}"

                        s3Upload(file:"dist/pbr", bucket:"${cf_dist[env.PROJECT_NAME][bucketName]}")
                        sh """\
                            aws cloudfront create-invalidation \
                                --distribution-id \"${cf_dist[env.PROJECT_NAME][env.SERVER_ENV]}\" \
                                --paths '/*' | jq -r '.Invalidation.Id' > cf_inv_id \
                            """
                        sh "aws cloudfront wait invalidation-completed --distribution-id \"${cf_dist[env.PROJECT_NAME][env.SERVER_ENV]}\" --id `cat cf_inv_id`"
                    }
                }
            }
        }
    }
    post {
        always {
            slackNotify('#jenkins_ci',currentBuild.currentResult)
        }
    }
}

@NonCPS
def slackNotify(channel,result)
{
    def color = 'danger'
    if (result == 'SUCCESS') {
        color = 'good'
    }

    def changeLogSets = currentBuild.changeSets
    def changeLogMsg = "Changes:\n"

    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            changeLogMsg += "- ${entry.msg} [${entry.author}]\n"
        }
    }

    def message = "${env.JOB_NAME} - ${currentBuild.displayName} ${currentBuild.currentResult} after ${currentBuild.durationString} ${changeLogMsg}"
    slackSend channel: channel, color: color, message: message

    if (result == 'FAILURE') {
        slackSend channel: '#frontend', color: color, message: message
    }
}