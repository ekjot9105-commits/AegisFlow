# Security & Privacy Architecture

AegisFlow is designed with zero-trust principles and robust AI safeguards suitable for enterprise environments and massive public events like the FIFA World Cup.

## Threat Model & AI Safety

### 1. PII Sanitization
Before any data reaches the Generative AI models, it passes through the `sanitizer.py` middleware. This layer strips out:
- Names
- Phone numbers
- Email addresses
- Financial information
- Exact seat coordinates (when anonymized reporting is required)

*(Architectural Note: The current implementation of `sanitizer.py` utilizes strict regex patterns (for UUIDs, Tickets, Passports, Emails, Phones) combined with a robust Key-Based Masking algorithm that instantly intercepts and redacts JSON payload fields matching sensitive keys (e.g., 'name', 'user'). This approach ensures comprehensive PII masking without relying on heavy Named Entity Recognition (NER) models or cloud services, maintaining maximum efficiency.)*

### 2. Prompt Injection Defense
The backend AI agents utilize strict system prompts and bounded parameter inputs. The API validates all inputs against expected schemas (Pydantic), neutralizing prompt injection attempts before they reach the LLM.

### 3. Input Validation
Every API endpoint employs rigid type checking and constraint validation. Malformed data is immediately rejected with a `422 Unprocessable Entity`.

## Infrastructure Security

### Rate Limiting
API endpoints are rate-limited to prevent DDoS attacks and control LLM token expenditure. (Implemented via Redis or in-memory caches).

### Authentication & Authorization
Role-Based Access Control (RBAC) is implemented via JWTs. 
- **Operators**: Access to AI predictive engine and dashboard.
- **Volunteers**: Scoped access to assigned tasks.
- **Fans**: Public unauthenticated access with strict rate limiting.

### CORS & Network Security
CORS is tightly restricted to the production frontend domain, ensuring malicious domains cannot interact with the backend APIs.

### Safe AI Practices
- Responses strictly bound to factual stadium context.
- Fallback generic safety replies when ambiguous scenarios arise.
- No direct database write access from the AI models.
