node {
    podTemplate(label: 'build-application',
        containers: [
            containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat'),
            containerTemplate(name: 'helm', image: '10.52.181.240:8000/51scrum/helm:v1.0', ttyEnabled: true, command: 'cat')
        ],
        volumes: [
            hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
            hostPathVolume(hostPath: '/home/service/.kube', mountPath: '/home/service/.kube')
        ],
        imagePullSecrets: [
            '51scrum'
        ]
    ) {
        node('build-application') {
            def dockerRegistry = '10.52.181.240:8000/51scrum'
            def kubeConfigPath = '/home/service/.kube/config'
            def git
            def commitHash
            def gitRepoName
            def gitBranchName
            def dockerImageName
            def helmChartName
            def templatName = 'helm-template'
            def ingressHost
            def servicePort = 80
            def serviceTargetPort = 8080
            def deploymentPort = 8080

            stage('Checkout') {
                git = checkout scm
                commitHash = git.GIT_COMMIT
                gitRepoName = git.GIT_URL.tokenize("/")[3].replaceAll(".git", "").replaceAll('_', '-')
                gitBranchName = git.GIT_BRANCH.replaceAll("origin/", "");
                dockerImageName = "${gitRepoName}-${gitBranchName.replaceAll('/', '-')}"
                helmChartName = "${gitRepoName}-${gitBranchName.replaceAll('/', '-')}"
                ingressHost = "${gitRepoName}.${gitBranchName.replaceAll('/', '.')}.10.52.181.241.nip.io"
            }
            
            stage('Docker Image Build') {
                container('docker') {
                    sh "docker build -t ${dockerRegistry}/${dockerImageName}:${gitBranchName.replaceAll('/', '-')}-${env.BUILD_NUMBER} ."
                }
            }
            
            stage('Docker Image Push') {
                container('docker') {
                    docker.withRegistry("http://10.52.181.240:8000/51scrum/${gitRepoName}", 'harbor-admin') {
                        sh "docker push ${dockerRegistry}/${dockerImageName}:${gitBranchName.replaceAll('/', '-')}-${env.BUILD_NUMBER}"
                    }
                }
            }

            stage('Remove Build Docker Image') {
                container('docker') {
                    sleep 5
                    sh "docker rmi ${dockerRegistry}/${dockerImageName}:${gitBranchName.replaceAll('/', '-')}-${env.BUILD_NUMBER}"
                }
            }
            
            stage('Kubernetes Helm Deploy') {
                container('helm') {
                    try{
                        retry(20) {
                            sleep 10
                            sh "helm repo update"
                            sleep 10
                            sh "helm pull chartmuseum/${templatName}"
                            sh "tar -xvf ${templatName}*.tgz"
                            sh "sed -i 's/${templatName}/${helmChartName}/g' ./${templatName}/Chart.yaml"
                            sh "sed -i 's/project_description/A helm chart for ${helmChartName}/g' ./${templatName}/Chart.yaml"
                            sh "sed -i 's/0.0.0/${env.BUILD_NUMBER}/g' ./${templatName}/Chart.yaml"
                            sh "helm push ./${templatName}/ --version ${env.BUILD_NUMBER} chartmuseum"
                            sleep 10
                            sh "helm repo update"
                            sleep 5
                        }
                    } catch (e) {
                        error("Error occured in the helm container");
                    }

                    def helmList = sh script: "helm list --kubeconfig ${kubeConfigPath} -q --namespace default", returnStdout: true
                    
                    if(helmList.contains("${helmChartName}")) {
                        echo "Already installed. Upgrade from helm repository!"
                        sh "helm upgrade ${helmChartName} --kubeconfig ${kubeConfigPath} --set name=${helmChartName},configmap.name=configmap-${helmChartName},deployment.name=deployment-${helmChartName},deployment.port=${deploymentPort},service.name=service-${helmChartName},service.port=${servicePort},service.targetPort=${serviceTargetPort},ingress.name=ingress-${helmChartName},ingress.host=${ingressHost},image.tag=${gitBranchName.replaceAll('/', '-')}-${env.BUILD_NUMBER},version=${env.BUILD_NUMBER} --version ${env.BUILD_NUMBER} chartmuseum/${helmChartName}"
                    }else{
                        echo "Install from helm repository!"
                        sh "helm install ${helmChartName} --kubeconfig ${kubeConfigPath} --set name=${helmChartName},configmap.name=configmap-${helmChartName},deployment.name=deployment-${helmChartName},deployment.port=${deploymentPort},service.name=service-${helmChartName},service.port=${servicePort},service.targetPort=${serviceTargetPort},ingress.name=ingress-${helmChartName},ingress.host=${ingressHost},image.tag=${gitBranchName.replaceAll('/', '-')}-${env.BUILD_NUMBER},version=${env.BUILD_NUMBER} --version ${env.BUILD_NUMBER} chartmuseum/${helmChartName}"
                    }
                }
            }

            stage('Clean Up Environment') {
                container('docker') {
                    sh "docker system prune -f -a"
                }
            }
        }
    }
}
