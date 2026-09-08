# Brute Force and Credential Attacks

## Overview

A brute-force attack is an attempt to gain unauthorized access by repeatedly trying different passwords or authentication credentials.

Credential stuffing is a related attack where attackers use previously leaked username and password combinations against other services.

## Common Indicators

- Multiple failed authentication attempts
- Repeated login requests from the same IP address
- Login attempts against multiple user accounts
- Authentication requests from unknown or suspicious IP addresses
- Unusual geographic login activity
- Repeated requests within a short period

## Potential Impact

Successful attacks may result in:
- Unauthorized account access
- Account takeover
- Exposure of sensitive information
- User account lockouts
- Increased authentication-service load

## Defensive Response

1. Review authentication and access logs.
2. Identify source IP addresses and targeted accounts.
3. Apply rate limiting to authentication endpoints.
4. Enforce multi-factor authentication (MFA).
5. Configure appropriate account lockout policies.
6. Monitor for distributed login attempts.
7. Reset credentials when compromise is suspected.
