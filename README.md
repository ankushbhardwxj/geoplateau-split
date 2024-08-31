## Backend Assignment

### System Design 

- API: We assume client uses HTTP polling, therefore, service is an express server
- Validation: GeoJSON input validation must be done before processing, therefore, we do it at a route middleware
- Database: We choose NoSQL (mongodb). Inbuilt support for GeoJSON data, and optimistic concurrency control
  - Conflict Resolution: We use async-retry package, to retry gracefully if there's a conflict/error.

### Getting Started

```bash
# install dependencies
npm install

# run development server
npm run dev

# build and run production server 
npm run build
npm run start

# lint/format
npm run lint
npm run lint:fix
npm run format
```

### Testing

We use vitest for running tests. 
```
npm run test
```
We test concurrency and performance using K6. 
```
brew install k6
k6 run script.js
```

### Benchmarks

### CI/CD, Hosting

On every push to master, we run lint checks, build server, and run all tests.
Server hosted on Render at URL: https://geoplateau-split.onrender.com

Swagger API docs at: https://geoplateau-split.onrender.com