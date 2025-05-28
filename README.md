Here is a clean, professional, and step-by-step `README.md` file for your **Coding Playground** deployment on AWS EC2 using Docker and Docker Compose.

---

# 🚀 Coding Playground - Deployment Guide

This guide provides a complete walkthrough for deploying the Coding Playground application on an AWS EC2 instance using Docker and Docker Compose.

---

## 🛠️ Prerequisites

- AWS EC2 Ubuntu Instance (20.04 or newer)
- Security Group allowing ports: `22`, `80`, and `443`
- GitHub repository access
- SSH access to EC2 instance

---

## 🔧 Step 1: Initial EC2 Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install unzip
sudo apt install unzip -y

# Logout and login again for Docker group permissions
exit
````

---

## 📁 Step 2: Clone the Repository

```bash
git clone https://github.com/himanshusingla123/coding-playground.git
cd coding-playground
```

---

## 🧠 Step 3: Update Frontend API Configuration

```bash
sed -i "s|http://localhost:5000/api|/api|g" frontend/src/services/api.js
```

---

## 📦 Step 4: Install Application Dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## 🚀 Step 5: Deploy the Application

```bash
# Run deployment
./deploy.sh

# Check containers
docker ps

# View logs
docker-compose logs -f
```

---

## 🌐 Step 6: Access the Application

1. Open [AWS Console → EC2 → Instances](https://console.aws.amazon.com/ec2/)
2. Select your instance
3. Copy the **Public IPv4 Address**
4. Visit in browser: `http://<your-ec2-public-ip>`

---

## 🌍 Step 7: Set Up Custom Domain (Optional)

### 7.1 Get a Domain

* Buy from AWS Route 53 (paid) or use a free provider like Freenom or No-IP.

### 7.2 Point Domain to EC2

* Add an **A Record** in your domain DNS settings pointing to your EC2 IP.

### 7.3 Install SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

---

## 🔁 Step 8: Set Up Auto-Restart on Reboot

```bash
sudo cat > /etc/systemd/system/coding-playground.service << 'EOF'
[Unit]
Description=Coding Playground
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/coding-playground
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable coding-playground
sudo systemctl start coding-playground
```

---

## 🪵 Step 9: View Logs (From Windows via PowerShell or PuTTY)

```bash
# All logs
docker-compose logs

# Specific services
docker-compose logs frontend
docker-compose logs backend

# Real-time logs
docker-compose logs -f
```

---

## ✅ Deployment Complete!

Visit your application in the browser at:

```text
http://<your-ec2-public-ip>
```

Or

```text
https://yourdomain.com
```

---

> 💡 Tip: Always keep your Docker, Node, and application dependencies up to date for better security and performance.

```

---

Let me know if you'd like to **add badges**, **CI/CD**, or **GitHub Actions deployment** steps too!
