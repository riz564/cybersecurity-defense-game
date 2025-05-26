# Cyber Defense Game

A fun and interactive game where players drag and drop bombs to eliminate cybersecurity threats. Test your reflexes and knowledge of cybersecurity in this engaging defense game!

---

## 🚀 How to Play
1. **Drag and Drop:** Select a bomb (Antivirus, Web Application Firewall(WAF), Bot Manager(Bot-Mgr)) and drag it near the matching threat.
2. **Destroy Threats:** Drop the bomb to create an explosion and eliminate threats within its range.
3. **Score Points:** Each successful match earns you 10 points. On multiple of 100 score game level increases.
4. **Health:** Watch out! Letting threats reach the bottom will decrease health by 20% which is 100% at start.
5. **Game Over:** The game ends when your health reaches 0.

---

## 🌟 Features
- **Interactive Gameplay:** Real-time drag-and-drop mechanics.
- **Counter Measure of Attacks: Three Defensive Bomb Types which will target all attacks:** 
  1. **Antivirus**
  2. **Web App Firewall(WAF)**
  3. **Bot Manager(Bot-Mgr)**
- **Dynamic Threats:Twelve Different types of attack spawn randomly and fall toward the bottom of the screen**
  1. **Malware**
  2. **Ransomware**
  3. **Trojan**
  4. **Worms**
  5. **SpamBot**
  6. **Scraping**
  7. **Botnet**
  8. **Account Takeover(ATO)**
  9. **Sql Injection(SQLi)**
  10. **Cross Site Scripting(XSS)**
  11. **Distributed Denial of Service(DDoS)**
  12. **Server Side Request Forgery(SSRF)**
---


---

## 🌐 Play the Game
Click the link below to play the game:
[Play Cybersecurity Defense Game](https://riz564.github.io/cybersecurity-defense-game/login.html)

Or scan the QR code to access it directly:

![QR Code](./qr-code.png)

---

## 📜 License
This project is open-source and licensed under the MIT License.

Here’s a summary of the commands you executed, their purpose, and explanations of the Dockerfile and deployment.yaml files:

Commands For Execution
1. Build the Docker Image : docker build -t cybersecurity-defense-game
Purpose: Builds a Docker image using the Dockerfile in the current directory.
Explanation: The -t flag tags the image with the name cybersecurity-defense-game. This image contains your static files and Nginx configuration.

2. Tag the Docker Image for ECR: docker tag cybersecurity-defense-game:latest 485067906330.dkr.ecr.us-east-1.amazonaws.com/cybersecurity-defense-game:latest
Purpose: Tags the Docker image with the ECR repository URI.
Explanation: This prepares the image for pushing to Amazon ECR by associating it with the correct repository.

3. Push the Docker Image to ECR: docker push <Account_ID>.dkr.ecr.<region>.amazonaws.com/cybersecurity-defense-game:latest
Purpose: Pushes the Docker image to the Amazon Elastic Container Registry (ECR).
Explanation: This makes the image available for Kubernetes to pull during deployment.

4. Create an ECR Authentication Secret:
aws ecr get-login-password --region us-east-1 | kubectl create secret docker-registry ecr-secret \
  --docker-server=<Account_ID>.dkr.ecr.<region>.amazonaws.com \
  --docker-username=AWS \
  --docker-password=-
Purpose: Creates a Kubernetes secret for authenticating with ECR.
Explanation: Kubernetes uses this secret to pull the Docker image from ECR.

5. Apply the Kubernetes Deployment: kubectl apply -f deployment.yaml
Purpose: Deploys the application to the Kubernetes cluster.
Explanation: The deployment.yaml file defines the deployment and service configuration for your application.

6. Check the Status of Pods
Purpose: Lists all pods in the Kubernetes cluster.
Explanation: This command helps verify if the pods are running or if there are any issues (e.g., ErrImagePull).

7. Describe a Pod: kubectl get pods
Purpose: Provides detailed information about a specific pod.
Explanation: This command is useful for debugging issues like ErrImagePull or ImagePullBackOff.

8. Delete All Pods: kubectl describe pod <pod_name>
Purpose: Deletes all pods in the cluster.
Explanation: This forces Kubernetes to recreate the pods, which is useful after updating the Docker image or fixing configuration issues.

9. Check the Status of Services: kubectl get services
Purpose: Lists all services in the Kubernetes cluster.
Explanation: This command helps verify the external IP or DNS name of the load balancer created for your application.
Explanation of the Dockerfile

# Use a lightweight base image with Nginx
FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy your local static files (HTML, CSS, JS) into the container
COPY . /usr/share/nginx/html

# Set proper permissions for the files
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

Key Points:
Base Image: nginx:alpine is a lightweight Nginx image.
Remove Default Files: Deletes the default Nginx HTML files to avoid conflicts.
Copy Static Files: Copies your application files (e.g., login.html, styles.css) into the Nginx document root (/usr/share/nginx/html).
Set Permissions: Ensures the files have the correct permissions for Nginx to serve them.
Expose Port: Exposes port 80 for HTTP traffic.
Explanation of the deployment.yaml
Key Points:
Deployment Section:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cybersecurity-defense-game
  labels:
    app: cybersecurity-defense-game
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cybersecurity-defense-game
  template:
    metadata:
      labels:
        app: cybersecurity-defense-game
    spec:
      containers:
      - name: cybersecurity-defense-game
        image: 485067906330.dkr.ecr.us-east-1.amazonaws.com/cybersecurity-defense-game:latest
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: ecr-secret
---
apiVersion: v1
kind: Service
metadata:
  name: cybersecurity-defense-game-service
spec:
  type: LoadBalancer
  selector:
    app: cybersecurity-defense-game
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80

Replicas: Specifies 2 replicas (pods) for high availability.
Image: Specifies the Docker image to use (cybersecurity-defense-game:latest from ECR).
Ports: Exposes port 80 inside the container.
imagePullSecrets: References the ecr-secret for authenticating with ECR.
Service Section:

Type: LoadBalancer creates an external load balancer to expose the application to the internet.
Selector: Matches pods with the label app: cybersecurity-defense-game.
Ports: Maps port 80 of the service to port 80 of the pods.
