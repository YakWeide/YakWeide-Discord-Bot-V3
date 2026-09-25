build:
    npm ci
    docker build -t yakweide-discord-bot .

check:
    npm run format
    npm run lint
    npm run check:syntax
    npm test
    npm audit --audit-level=high

clean:
    rm -rf node_modules dist build coverage .nyc_output .cache .npm .eslintcache .prettiercache
    -docker image rm yakweide-discord-bot:latest
