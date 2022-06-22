##TYPES OF CONFIGURATION UPDATES

###How to build a project locally
At the `root of the project`, execute:
- To build
```shell
npm i
cd client
npm i
cd ../
```
- To run (from `the root of the project`)
```shell
npm run dev
```
- Go to `http://localhost:30000`
###How to build a Docker image
```shell
docker build -t test-kube .
```
###How to deploy the image to Kubernetes
1. Create a ConfigMap based on the config JSON
```shell
cd config
kubectl create configmap kubeconfigmap --from-file=default.json
```
2. Deploy an image and create the required service to manage the network connections

`Should be executed from the project root` 
```shell
kubectl apply -f test-kube.yaml
```
3. Go to `http://localhost:30000`
###How to update the config and deliver changes to Kubernetes
1. Go to the config folder
2. Make required changes in the file `default.json`
3. Deploy changes to the Kubernetes cluster
```shell
kubectl create configmap kubeconfigmap --from-file=default.json --dry-run=client -o json | kubectl apply -f -
```
