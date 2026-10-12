# Security Policy — Alteon Exports Ltd

At **Alteon Exports Ltd**, security and trade integrity are foundational pillars of our global operations. We employ defense-in-depth methodologies ("military-grade" hardening) to safeguard client information, procurement manifests, and communication pipelines across our digital infrastructure.

This document details our vulnerability reporting guidelines, security architecture, and Safe Harbor provisions for ethical security researchers.

---

## 1. Reporting a Vulnerability

If you identify a security vulnerability, configuration flaw, or security issue impacting Alteon Exports Ltd systems, please report it promptly through our dedicated security channels:

- **Security Desk**: [security@alteonexports.com](mailto:security@alteonexports.com)
- **Direct Operational Email**: [alteonexports@gmail.com](mailto:alteonexports@gmail.com)
- **RFC 9116 Endpoint**: [/.well-known/security.txt](file:///.well-known/security.txt)

### Required Report Details
To assist our engineering team in rapid triage, please provide:
1. **Description**: Clear description of the vulnerability (e.g., CSP bypass, CSRF, injection, header misconfiguration).
2. **Impact**: Potential severity and threat impact on users or business integrity.
3. **Reproduction Steps**: Step-by-step instructions or minimal Proof-of-Concept (PoC).
4. **Environment**: Browser, operating system, and HTTP payload details where applicable.

---

## 2. Response & Remediation Timelines (SLA)

| Phase | Target SLA |
| :--- | :--- |
| **Initial Acknowledgment** | Within **24 hours** |
| **Severity Triage & Validation** | Within **72 hours** |
| **Remediation / Patch Deployment** | Critical: **≤ 7 days**<br>High: **≤ 14 days**<br>Medium/Low: **≤ 30 days** |
| **Resolution Notification** | Promptly upon deployment of the security fix |

---

## 3. Coordinated Disclosure & Safe Harbor

We fully support responsible and ethical security research. We commit to the following Safe Harbor protections:

- We will **not** pursue civil or criminal legal action against researchers acting in good faith under this policy.
- We will coordinate with you openly to validate and address findings before public disclosure.
- We request a minimum **90-day coordinated disclosure period** from initial report acknowledgment before any public disclosure.

### Out of Scope Activities
- Distributed Denial of Service (DDoS) attacks or degrading availability of our digital services.
- Physical attacks against Alteon Exports Ltd facilities, warehouses, or personnel.
- Social engineering, phishing, or spear-phishing against staff or trade partners.
- Automated vulnerability scanners that execute thousands of intrusive requests per minute without prior coordination.

---

## 4. Multi-Layered Defense Architecture

Our digital infrastructure is hardened across all architectural tiers:

### A. HTTP Transport & Transport Layer Security
- **Strict-Transport-Security (HSTS)**: Configured with `max-age=63072000; includeSubDomains; preload` to enforce TLS across all endpoints.
- **TLS 1.2 & TLS 1.3**: Exclusive support for authenticated AEAD ciphers (ECDHE-ECDSA/RSA-AES-GCM / CHACHA20-POLY1305).

### B. Content Security Policy (CSP Level 3)
- Strict boundary control (`default-src 'self'`).
- Script execution is strictly isolated to verified local bundles (`script-src 'self' 'sha256-...'`).
- Inline scripts (`'unsafe-inline'`) and evaluation (`'unsafe-eval'`) are strictly prohibited in script contexts.

### C. Anti-Clickjacking & Framing Defense
- `frame-ancestors 'none'` in CSP Level 3.
- `X-Frame-Options: DENY` HTTP response header.
- Client-side DOM Frame Guard script in `js/script.js` preventing hostile iframe nesting.

### D. Input Validation & Form Hardening
- Client-side timing-attack / bot mitigation (rejection of sub-threshold automated submissions).
- Honeypot trap (`_honey_pot`) invisible to standard accessibility trees.
- Cryptographically strong Anti-CSRF pseudo-tokenization via `crypto.getRandomValues()`.
- Rolling session rate-limiting preventing brute-force inquiry flooding.

### E. Privacy & Isolation Policies
- **Permissions-Policy**: All non-essential browser hardware access (camera, microphone, geolocation, USB, Bluetooth, payment) is disabled.
- **Cross-Origin Isolation**: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` enforced.
- **Referrer-Policy**: `strict-origin-when-cross-origin` preventing parameter or path leakage.

---

## 5. Regulatory Compliance & Standards
Alteon Exports Ltd aligns its security practices with leading international standards:
- **ISO/IEC 27001**: Information Security Management System controls.
- **NIST SP 800-53**: Security and Privacy Controls for Federal Information Systems and Organizations.
- **NDPR / GDPR**: Nigeria Data Protection Regulation & General Data Protection Regulation compliance for trade communications.
