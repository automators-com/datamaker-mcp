#!/bin/sh
# Don't use set -e here - we want to continue even if certificate setup fails
# The script should always execute the application command at the end

# Certificate handling: Support multiple ways to provide CA certificate
# 1. Environment variable specified by CERT_ENV_VAR_NAME (e.g., CERT_ENV_VAR_NAME=HUGO_BOSS_CERT)
# 2. Environment variable matching pattern *_CERT or *_CA_CERT
# 3. Mounted file at /app/certs/ca.crt
# 4. NODE_EXTRA_CA_CERTS already set (use as-is)

# Ensure certs directory exists
mkdir -p /app/certs

# Function to set NODE_EXTRA_CA_CERTS from certificate content
set_cert_from_content() {
  local cert_content="$1"
  if [ -n "$cert_content" ]; then
    echo "$cert_content" > /app/certs/ca.crt
    export NODE_EXTRA_CA_CERTS=/app/certs/ca.crt
    return 0
  fi
  return 1
}

# Method 1: Check if CERT_ENV_VAR_NAME is set, then read that variable
if [ -n "$CERT_ENV_VAR_NAME" ]; then
  cert_var_name="$CERT_ENV_VAR_NAME"
  # Safely get variable content (handles case where variable doesn't exist)
  cert_content=$(eval "echo \$${cert_var_name:-}" 2>/dev/null || echo "")
  if set_cert_from_content "$cert_content"; then
    echo "✓ Using certificate from environment variable: $cert_var_name"
  fi
fi

# Method 2: Look for environment variables matching *_CERT or *_CA_CERT pattern
# Only if NODE_EXTRA_CA_CERTS is not already set
if [ -z "$NODE_EXTRA_CA_CERTS" ]; then
  # Get all environment variable names
  for var_name in $(env | cut -d= -f1); do
    # Check if variable name ends with _CERT or _CA_CERT
    case "$var_name" in
      *_CERT|*_CA_CERT)
        # Safely get variable content
        cert_content=$(eval "echo \$${var_name:-}" 2>/dev/null || echo "")
        if set_cert_from_content "$cert_content"; then
          echo "✓ Using certificate from environment variable: $var_name"
          break
        fi
        ;;
    esac
  done
fi

# Method 3: Check if certificate file is mounted
# Only if NODE_EXTRA_CA_CERTS is not already set
if [ -z "$NODE_EXTRA_CA_CERTS" ] && [ -f /app/certs/ca.crt ] && [ -s /app/certs/ca.crt ]; then
  export NODE_EXTRA_CA_CERTS=/app/certs/ca.crt
  echo "✓ Using certificate from mounted file: /app/certs/ca.crt"
fi

# Method 4: NODE_EXTRA_CA_CERTS is already set (use as-is)
if [ -n "$NODE_EXTRA_CA_CERTS" ]; then
  echo "✓ Using certificate from NODE_EXTRA_CA_CERTS: $NODE_EXTRA_CA_CERTS"
else
  echo "ℹ No custom CA certificate configured"
fi

# Execute the original command
exec "$@"

