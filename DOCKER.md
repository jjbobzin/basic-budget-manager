# Docker Deployment Guide

## Overview

This guide covers deploying Budget Manager as a Docker container on Unraid or any Docker host.

---

## Quick Start with Docker

### Option 1: Docker Compose (Recommended)

```bash
# Clone or extract the app
cd budget-app-server

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at: `http://localhost:3000`

### Option 2: Docker CLI

```bash
# Build the image
docker build -t budget-manager .

# Run the container
docker run -d \
  --name budget-manager \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  budget-manager

# View logs
docker logs -f budget-manager

# Stop
docker stop budget-manager
docker rm budget-manager
```

---

## Unraid Deployment

### Method 1: Docker Compose (Recommended)

1. **Install Compose Manager plugin** (if not already installed):
   - Go to Apps tab
   - Search "Compose Manager"
   - Install

2. **Create compose directory**:
   ```bash
   mkdir -p /mnt/user/appdata/budget-manager
   ```

3. **Upload files**:
   - Use Unraid's file browser or WinSCP
   - Upload entire `budget-app-server` folder to `/mnt/user/appdata/budget-manager/`

4. **Deploy via Compose Manager**:
   - Open Compose Manager
   - Click "Add New Stack"
   - Name: `budget-manager`
   - Compose File Path: `/mnt/user/appdata/budget-manager/docker-compose.yml`
   - Click "Compose Up"

5. **Access your app**:
   - `http://[unraid-ip]:3000`

### Method 2: Unraid Docker Template

1. **Go to Docker tab** in Unraid
2. **Click "Add Container"**
3. **Fill in the settings**:

```
Name: budget-manager
Repository: budget-manager:latest
Network Type: Bridge
Port Mappings:
  - Container Port: 3000
  - Host Port: 3000
  - Protocol: TCP
Path Mappings:
  - Container Path: /app/data
  - Host Path: /mnt/user/appdata/budget-manager/data
  - Mode: Read/Write
```

4. **Apply and start**

---

## Configuration Options

### Change Port

**Docker Compose** - Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Access on port 8080
```

**Docker CLI**:
```bash
docker run -d -p 8080:3000 budget-manager
```

**Unraid**: Change Host Port in container settings

### Persistent Data

The database is stored in `/app/data/budget.db` inside the container.

**Volume Mapping**:
- **Host**: `./data` (or `/mnt/user/appdata/budget-manager/data` on Unraid)
- **Container**: `/app/data`

This ensures your budget data persists even if the container is recreated.

### Environment Variables

Available environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | production | Node environment |

**Example**:
```yaml
environment:
  - PORT=8080
  - NODE_ENV=production
```

---

## Building from GitHub

Once you push to GitHub:

```bash
# Clone the repo
git clone https://github.com/yourusername/budget-manager.git
cd budget-manager

# Build and run
docker-compose up -d
```

Or pull a pre-built image (if you set up Docker Hub):

```bash
docker pull yourusername/budget-manager:latest
docker run -d -p 3000:3000 -v ./data:/app/data yourusername/budget-manager
```

---

## Unraid-Specific Tips

### Networking

**Bridge Mode** (default):
- Access: `http://[unraid-ip]:3000`
- Isolated from other containers

**Host Mode** (alternative):
- Network Type: Host
- Access: `http://[unraid-ip]:3000`
- Shares Unraid's network directly

### Reverse Proxy

To access via domain name (e.g., `budget.local`):

1. **Install Nginx Proxy Manager** or **Swag** from Community Apps

2. **Add proxy host**:
   - Domain: `budget.local`
   - Forward to: `budget-manager:3000`

3. **Update DNS** or add to your router's hosts file

### Backup Strategy

**Option 1: Appdata Backup**
- Budget data is in `/mnt/user/appdata/budget-manager/data/`
- Use Appdata Backup plugin to include this path

**Option 2: Manual Backup**
- Copy `budget.db` file periodically
- Or use the Export feature in the app

**Option 3: Scheduled Script**
```bash
#!/bin/bash
# Add to User Scripts plugin
cp /mnt/user/appdata/budget-manager/data/budget.db \
   /mnt/user/backups/budget-backup-$(date +%Y%m%d).db
```

---

## Updating the Container

### Docker Compose

```bash
# Pull new code/image
git pull  # if from GitHub
docker-compose build --no-cache
docker-compose up -d
```

### Unraid

1. **With Docker Template**:
   - Go to Docker tab
   - Click container's icon
   - Select "Update Container"
   - Click "Apply"

2. **With Compose Manager**:
   - Select your stack
   - Click "Compose Down"
   - Update files if needed
   - Click "Compose Up"

---

## Troubleshooting

### Container won't start

**Check logs**:
```bash
docker logs budget-manager
```

**Common issues**:
- Port already in use → Change host port
- Permission issues → Check volume permissions
- Missing node_modules → Rebuild: `docker-compose build --no-cache`

### Can't access from other devices

**Checklist**:
1. Container is running: `docker ps`
2. Port is mapped correctly
3. Firewall allows traffic (Unraid usually allows local network)
4. Using correct IP address

### Database not persisting

**Check volume mapping**:
```bash
docker inspect budget-manager | grep -A 10 Mounts
```

Should show: `/app/data` → `[host path]`

### Unraid-specific: Can't access via IP

1. Check Docker is in Bridge mode (not Host)
2. Verify port mapping in container settings
3. Test from Unraid terminal:
   ```bash
   curl http://localhost:3000/api/settings
   ```

---

## Health Checks

The container includes automatic health checks:

**View health status**:
```bash
docker ps  # Shows health status
docker inspect budget-manager | grep -A 5 Health
```

**Health check tests**:
- Runs every 30 seconds
- Tests if API is responding
- Marks unhealthy after 3 failures

---

## Resource Usage

**Typical usage**:
- RAM: ~50-100 MB
- CPU: <1% idle, <5% under load
- Disk: ~10 MB app + database size

**Very lightweight!** Perfect for Unraid.

---

## Security Considerations

**For Local Network Use** (default):
- ✅ Perfect as-is
- ✅ No authentication needed
- ✅ Access only from local network

**For Internet Access** (requires modifications):
- Add authentication (not included)
- Use HTTPS (via reverse proxy)
- Implement rate limiting
- Consider VPN instead

---

## Advanced: Multi-Instance

Run multiple budget apps (e.g., personal + household):

```bash
# Instance 1
docker run -d --name budget-personal \
  -p 3000:3000 \
  -v $(pwd)/data-personal:/app/data \
  budget-manager

# Instance 2
docker run -d --name budget-household \
  -p 3001:3000 \
  -v $(pwd)/data-household:/app/data \
  budget-manager
```

Each has its own database and port.

---

## Monitoring

**Check if running**:
```bash
docker ps | grep budget-manager
```

**View resource usage**:
```bash
docker stats budget-manager
```

**Follow logs**:
```bash
docker logs -f budget-manager
```

---

## Complete Unraid Installation Example

```bash
# 1. SSH into Unraid
ssh root@[unraid-ip]

# 2. Create directory
mkdir -p /mnt/user/appdata/budget-manager
cd /mnt/user/appdata/budget-manager

# 3. Download/extract your app files here
# (Use WinSCP or wget from GitHub)

# 4. Build the image
docker build -t budget-manager .

# 5. Run the container
docker run -d \
  --name budget-manager \
  -p 3000:3000 \
  -v /mnt/user/appdata/budget-manager/data:/app/data \
  --restart unless-stopped \
  budget-manager

# 6. Access at http://[unraid-ip]:3000
```

Done! Your budget manager is now running as a container on Unraid.
