## 📘 1-Week Full Stack Exercise: Simple Task Manager

## 🎬 Demo

Watch the working app demo: [Task Manager.mp4](https://drive.google.com/file/d/1b_cW6QVvTEeeZv9mLGx0gXL9YRAKpZKe/view?usp=drive_link)

### Core Requirements (Must complete in 5 days)

#### Backend (.NET 8+)
- [x] REST API with 3 endpoints:
  - `GET /api/tasks` – get all tasks
  - `POST /api/tasks` – create task (title only)
  - `DELETE /api/tasks/{id}` – delete task
- [x] In-memory storage (List<Task>) – no database needed
- [x] Task entity: `Id`, `Title`, `IsComplete` (bool)

#### Frontend (Angular 17+)
- [x] Display list of tasks
- [x] Form to add new task
- [x] Delete button per task
- [x] Checkbox to mark task complete
- [x] Basic styling (CSS or Tailwind)

#### Docker
- [x] Dockerfile for backend
- [x] Dockerfile for frontend (nginx serving Angular build)
- [x] `docker-compose.yml` to run both services together

---

## 📅 Suggested Weekly Breakdown

| Day | Focus | Deliverable |
|-----|-------|-------------|
| **Day 1** | Setup + Backend | ASP.NET Core project, Task model, 3 endpoints working (test with Swagger/Postman) |
| **Day 2** | Angular setup + API integration | Angular app, service to call backend, display tasks, add task form |
| **Day 3** | Complete Angular features | Delete button, check/uncheck toggle, basic CSS layout |
| **Day 4** | Docker setup | Dockerfiles for both projects, docker-compose working locally |
| **Day 5** | Polish + Documentation | README, testing, fixing CORS issues, final working demo |

---

## 🎯 Stretch Goals (If ahead of schedule)
- Add due date field
- Error handling with user notifications
- Environment-specific configs (dev/prod)
- Volume mounting for live reload in Docker

---

## 📦 Tech Stack (Specified)

```
Backend:  .NET 8 Web API + Swagger
Frontend: Angular 18 + HttpClientModule
Container: Docker + Docker Compose
```

---

## ✅ Success Criteria

By end of week, developer can:
1. Run `docker-compose up` and access app at `http://localhost:8080`
2. Add tasks via UI
3. Mark tasks complete/incomplete
4. Delete tasks
5. Changes persist in memory until container restart

---

## 🔧 Starter Tips

**CORS setup in backend** (very common pain point):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:8080")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

**Angular Dockerfile (multi-stage)**:
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/task-manager /usr/share/nginx/html
EXPOSE 80
```

---

## 📝 Deliverables to Review

- GitHub repo with clean commit history
- `README.md` with setup instructions
- [Demo video](https://drive.google.com/file/d/1b_cW6QVvTEeeZv9mLGx0gXL9YRAKpZKe/view?usp=drive_link)
- `docker-compose up` works on clean machine
