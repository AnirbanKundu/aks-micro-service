# Azure Kubernetes Micro Service 
This repository will walk you through on how to setup your AKS cluster, create your own Azure Registry, create a service principal so that AKS cluster can access the Azure Registry.
Once the RBAC is created, you can upload your local Docker Image to the Registry. And then instruct AKS to deploy image. 

### Step-1
Once you have created your "Free Trial" account through https://portal.azure.com switch to azure-cli 

  `az account show`
  
If you have more than one subscription in your account (like I have) use to following to swtich to reight subscription:

  `az account set -s "Free Trial"`
  
### Step-2 
Before creating AKS cluster, you need to create resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

  `az group create --name myResourceGroup --location eastus`  `myResourceGroup` is the name of my group
  
Once the resource group is created, create  Azure Container registry with the az acr create command. The registry name must be unique within Azure. 

  `az acr create --resource-group myResourceGroup --name myResourceG  --sku Basic`  `myResourceG` is the name of my Registry
### Step-3
Login to the newly created container 

  `az acr login --name myResourceG`
  
Create a service principal with az ad sp create-for-rbac. 

  `az ad sp create-for-rbac --skip-assignment`
  
The output of the above command produces the following output. 

      {
       "appId": "XXXXXXXXXXXXXXXXXX",
       "displayName": "azure-cli-2018-07-24-17-15-19",
       "name": "http://azure-cli-2018-07-24-17-15-19",
       "password": "XXXXXXXXXXXXX",
       "tenant": "15ccb6d1-d335-4996-b6f9-7b6925f08121"
      }

Now to access images that will be pushed in the ACR from the AKS, use the above `appId` and `password` to create a role assignment. Using the following command: 

    `az acr show --name myResourceG --resource-group myResourceGroup` 
    
gather the `acrId`. It should be something like: *"/subscriptions/2b4a6dde-bc39-4d82-a08d-651133df1609/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myResourceG"*

  `az role assignment create --assignee <appId> --role Reader --scope <acrId>` 
  
### Step-4  
Now create an AKS cluster with clustername `cluster-1`  

  `az aks create     --name cluster-1     --resource-group myResourceGroup     --node-count 1     --generate-ssh-keys     --service-principal "c41d4e40-9800-4128-addc-36d877e9ab58"     --client-secret "7f8f10b1-74f9-4469-8eb8-ece3f79380c1"`
  
  This will probably take around 5-6 minutes to setup the cluster.*
  
  Once the cluster is created, to connect with *kubectl* gets credentials for the AKS cluster name `cluster-1` in the `myResourceGroup`.*
  
  `az aks get-credentials --name cluster-1 --resource-group myResourceGroup`
  
  To verify the connection to your cluster, run
  
  `kubectl get nodes`


