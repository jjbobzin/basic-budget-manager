# ⚠️ Port Changed to 54321

## Why the Change?

You asked: **"Why port 3000? That's a fairly common port. Why not something like 54321?"**

**You're absolutely right!** Port 3000 is used by:
- React dev servers
- Grafana
- Many Node.js apps
- Various development tools

**New default port: 54321**
- Much less likely to conflict
- Easy to remember
- Still easily changeable if needed

---

## What Changed

All references to port 3000 have been updated to 54321:

✅ **server.js** - Default port: 54321
✅ **docker-compose.yml** - Port mapping: 54321:54321
✅ **Dockerfile** - Exposed port: 54321
✅ **unraid-template.xml** - Default port: 54321
✅ **All documentation** - Updated URLs

---

## Access URLs (Updated)

**Local:**
- `http://localhost:54321` (was 3000)

**Unraid:**
- `http://[unraid-ip]:54321` (was 3000)

**Network:**
- `http://192.168.x.x:54321` (was 3000)

---

## If You Want a Different Port

### Change in docker-compose.yml:

```yaml
ports:
  - "8080:54321"  # External:Internal
  # Change 8080 to whatever you want
  # Keep 54321 as the internal port
```

### Or change both:

```yaml
environment:
  - PORT=8080  # Internal port
ports:
  - "8080:8080"  # Must match
```

### Then rebuild:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## Still Works the Same Way

**Nothing else changed!** Just the port number.

The workflow is still:
1. Extract
2. Git init, commit, push to GitHub
3. Deploy to Unraid
4. Make changes
5. Push updates
6. Pull on Unraid and rebuild

See **WORKFLOW.md** for the complete step-by-step guide.

---

## Quick Test

After extracting:

```bash
cd budget-app-server
docker-compose up -d
```

Open: `http://localhost:54321`

You should see the Budget Manager app!

---

## Port Conflict?

If 54321 is somehow already in use (unlikely!):

```bash
# Check what's using it
netstat -an | grep 54321

# Or change the port
nano docker-compose.yml
# Edit the port, save

docker-compose up -d
```

---

## Summary

| Before | After |
|--------|-------|
| Port 3000 (common) | Port 54321 (unique) |
| Potential conflicts | Very unlikely conflicts |
| Same everywhere | Still configurable |

**Everything else stays the same!** 🎉
