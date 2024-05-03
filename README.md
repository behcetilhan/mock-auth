# Mock-Auth Server

For an optimal testing experience with [ReactRover](https://github.com/behcetilhan/reactrover), you can use this simple mock server. This server is specifically designed to complement ReactRover by providing a minimalistic backend environment for authentication and authorization. By using this server, you can effectively test secure login flows, token refresh mechanisms, and access controls as implemented in [ReactRover](https://github.com/behcetilhan/reactrover).

**Key features include**:
- JWT-based authentication and HttpOnly cookie management.
- Secure refresh token implementation for maintaining sessions.
- HTTPS and HTTP configurations.
- Pre-configured protected routes to simulate access control.


**Pre-configured endpoints**: 
- `POST`  /login: Authenticates a user and returns an access token and a refresh token.
- `POST`  /logout: Clears the refresh token cookie.
- `POST`  /public/refresh: Refreshes an access token using a valid refresh token.
- `GET`   /protected: Returns protected data that requires a valid access token to access.

## Prerequisites

Before installing ReactRover, ensure that your system meets the following requirements:
- **Node.js**: You'll need [Node.js](https://nodejs.org/) version 16 or newer installed on your system.

## Installation

```sh
git clone https://github.com/behcetilhan/mock-auth.git mock-auth
cd mock-auth
npm install
```

If you are planning to test the flow with HTTP protocol only, you can update the `USE_SSL` defined in `.env` file as `false`

If you also want to test with SSL, you can follow the steps described below.

## SSL Certificate Setup with mkcert

To secure your local development environment with HTTPS, you'll need SSL certificates. mkcert is a simple tool that makes it easy to create valid SSL certificates for local development. Here’s how you can use mkcert to generate these certificates

### Prerequisites for mkcert

Before you start, make sure you have mkcert installed on your machine. If you don't have it installed, follow these steps:

1. Install mkcert
    - On macOS: Run `brew install mkcert`
    - On Windows: Install Chocolatey, then run `choco install mkcert`
    - On Linux: Install using your package manager, or download it from GitHub.

2. Install a local CA (Certificate Authority):
    - Run `mkcert -install`
    - This step modifies your system trust store to trust certificates created by mkcert.

Once mkcert is installed and configured, navigate to your project directory and create certificates

`mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1`

- This command generates a localhost-key.pem (private key) and a localhost.pem (certificate) in your current directory
- These files are configured to work for localhost, 127.0.0.1, and ::1

For more details you can visit [mkcert repo](https://github.com/FiloSottile/mkcert)

## Running the Server

```sh
npm start
```


## Points to consider

- You need a valid `.env` file, which you can create by copying `.env.dist`
- You should update the running port if you don't want to use `:3001`
- As this server is just for testing purposes, three mock users are available which you can see in `index.js`

```sh
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    username: 'user2',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    username: 'user3',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=3'
  }
]
```