# Default recipe
default:
  just --list

dev:
  bun run dev

build:
  bun run build

preview:
  bun run preview

test:
  bun run test

test-coverage:
  bun run test:coverage

e2e:
  bun run test:e2e

e2e-ui:
  bun run test:e2e:ui

check:
  bun run lint && bun run typecheck && bun run test:coverage

lighthouse:
  bun run lighthouse
