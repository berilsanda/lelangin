# Lelangin

Auction app built with Expo SDK 54, React Native 0.81, and Firebase.

## Getting Started

```bash
yarn install
yarn start
```

## E2E Testing

Lelangin uses [Maestro](https://maestro.mobile.dev) for end-to-end testing.

### Install Maestro

```bash
# macOS (Homebrew)
brew install maestro

# Manual install (all platforms)
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Set Environment Variables

```bash
export TEST_EMAIL="your-test-account@example.com"
export TEST_PASSWORD="your-test-password"
```

### Run E2E Tests

1. Start the app on a simulator/emulator:

```bash
yarn ios
# or
yarn android
```

2. Run the full E2E suite:

```bash
yarn test:e2e
```

3. Run a single flow:

```bash
maestro test .maestro/auth/login_success.yaml
```

All test flows are located in the `.maestro/` directory. Each flow uses `appId: com.lelangin.app`.
