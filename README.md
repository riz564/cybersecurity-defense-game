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

🚀 How to Deploy Static or Dynamic Websites on AWS Using Docker and Kubernetes

Whether you’re building a static site or a full-featured web app, containerizing your code and deploying it with Kubernetes gives you a scalable, cloud-native architecture. In this post, I’ll show how to do this using Docker, Amazon Elastic Container Registry (ECR), and Kubernetes (EKS) — with an example based on a cybersecurity defense game I deployed.

🧐 Why Docker + Kubernetes + AWS?

Docker packages your app (static or dynamic) and dependencies into a portable image.

Amazon ECR securely stores Docker images.

Kubernetes (via AWS EKS or Minikube) orchestrates your containers, allowing scaling, healing, and easy rollouts.

Nginx or Node.js/Express (depending on your app type) can serve your content.

This stack is powerful and flexible enough for both static HTML/CSS/JS sites and full dynamic backends.

📦 Step 1: Dockerize Your Application

Static Website (e.g., HTML/CSS/JS)

Dockerfile:

FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80

Dynamic Website (e.g., Node.js + Express)

Dockerfile:

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

Build your image:

docker build -t my-web-app .

☁️ Step 2: Push Image to Amazon ECR

1. Create an ECR Repository

aws ecr create-repository --repository-name my-web-app

2. Tag the Image

docker tag my-web-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/my-web-app:latest

3. Authenticate and Push

aws ecr get-login-password --region <region> | \
docker login --username AWS \
--password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/my-web-app:latest

☘️ Step 3: Deploy with Kubernetes

Organize your YAML files in a k8s/ folder.

deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-web-app
  template:
    metadata:
      labels:
        app: my-web-app
    spec:
      containers:
      - name: my-web-app
        image: <account-id>.dkr.ecr.<region>.amazonaws.com/my-web-app:latest
        ports:
        - containerPort: 80 # Or 3000 for dynamic apps
      imagePullSecrets:
      - name: ecr-secret

service.yaml

apiVersion: v1
kind: Service
metadata:
  name: my-web-app-service
spec:
  type: LoadBalancer
  selector:
    app: my-web-app
  ports:
  - port: 80
    targetPort: 80 # Or 3000 if dynamic

🔐 Step 4: Create Secret for ECR Access

aws ecr get-login-password --region <region> | \
kubectl create secret docker-registry ecr-secret \
--docker-server=<account-id>.dkr.ecr.<region>.amazonaws.com \
--docker-username=AWS \
--docker-password=-

▶️ Step 5: Apply and Test

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

kubectl get pods
kubectl get service my-web-app-service

For Minikube:

minikube service my-web-app-service

✅ Example: Cybersecurity Defense Game

In my case, I deployed a static game app with HTML, CSS, and JavaScript. I:

Used nginx:alpine as the Docker base

Pushed the image to ECR

Set up EKS with a LoadBalancer service

Used IAM permissions to allow image pulls from ECR

Worked flawlessly — and the same pattern applies to full-stack apps too.

🔺 Conclusion

Using Docker and Kubernetes to deploy on AWS makes your site production-ready from day one. Whether you're building a simple portfolio site or a complex app, this workflow is scalable, secure, and cloud-native.

If you'd like a ready-to-use template repo for static or dynamic sites, let me know — I’d be happy to share one!






