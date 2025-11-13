# ⚠️ Port Reference - Always Use 54321

## Correct Port Information

**Default Port:** `54321` (not 3000 or 8080)

This was changed because port 3000 is commonly used by many applications.

---

## Correct URLs

### Local Development
```
http://localhost:54321
```

### Unraid Access
```
http://YOUR_UNRAID_IP:54321
```

### Network Access
```
http://192.168.x.x:54321
```

---

## ⚠️ Documentation Note

Some older documentation files may reference port 3000 or 8080. These were from earlier versions.

**Always use port 54321** unless you specifically changed it.

---

## Where Port is Configured

### server.js
```javascript
const PORT = process.env.PORT || process.argv[2] || 54321;
```

### docker-compose.yml
```yaml
ports:
  - "54321:54321"
environment:
  - PORT=54321
```

### Dockerfile
```dockerfile
EXPOSE 54321
ENV PORT=54321
```

---

## Changing the Port (If Needed)

If port 54321 is already in use, change it in:

### 1. docker-compose.yml
```yaml
ports:
  - "55555:54321"  # Change left number only
```

### 2. Or change both
```yaml
environment:
  - PORT=55555
ports:
  - "55555:55555"
```

### 3. Rebuild
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## Quick Reference

| What | Port |
|------|------|
| **Default** | **54321** |
| Old docs may say | 3000 or 8080 |
| What you should use | **54321** |

---

## If You See Wrong Port in Docs

Just mentally replace:
- `3000` → `54321`
- `8080` → `54321`
- `http://localhost:3000` → `http://localhost:54321`
- `http://[unraid-ip]:3000` → `http://[unraid-ip]:54321`

---

## Verifying Your Port

```bash
# Check what port is configured
grep "PORT" docker-compose.yml

# Check what's running
docker ps

# Test access
curl http://localhost:54321/api/setup/status
```

---

## Summary

**✅ Use port 54321** for everything
**❌ Ignore references to 3000 or 8080** in old docs
**🔧 Easy to change** if needed (see above)

**Your app is configured for 54321!** All the actual code files are correct.
