# Odoo Integration Starter (Spring Boot)

This bundle wires a clean **Odoo Integration Layer** into your existing Spring Boot app using **XML-RPC**.
It exposes safe, backend-only endpoints so your React/Angular frontend never touches Odoo directly.

## What’s inside
- `OdooClientConfig` — configures XML-RPC clients (`/xmlrpc/2/common` and `/xmlrpc/2/object`)
- `OdooAuthService` — authenticates and returns `uid`
- `OdooXmlRpc` — helper for `search_read`, `create`, `write`, `unlink`
- `OdooAssetService` — lists and creates `account.asset` (adjust model name to your Odoo version)
- `OdooMaintenanceService` — lists and creates `maintenance.request`
- `OdooProxyController` — REST endpoints under `/api/integrations/odoo/...`
- `DTOs` — `AssetDTO`, `MaintenanceRequestDTO`
- `POM_SNIPPET.xml` — dependencies to add to your pom
- `application.yml` — config keys (fill with your Odoo env)

## Quick start
1. Copy `src/main/java/com/example/odoo/**` into your project (change the package if needed).
2. Add the dependencies from `POM_SNIPPET.xml` to your `pom.xml`.
3. Merge `src/main/resources/application.yml` into your config and set real values:
   ```yaml
   odoo:
     url: https://your-odoo.example.com
     db: your_db
     username: api_user@example.com
     password: ${ODOO_PASSWORD}
   ```
4. Run your app and hit endpoints:
   - `GET  /api/integrations/odoo/assets?limit=20`
   - `POST /api/integrations/odoo/assets` body: `{ "name": "MacBook Pro", "value": 2400, "acquisitionDate": "2024-01-10" }`
   - `GET  /api/integrations/odoo/maintenance/requests?limit=20`
   - `POST /api/integrations/odoo/maintenance/requests` body: `{ "title": "Battery replacement", "equipmentId": 12, "description": "Not holding charge" }`

## Notes & Mapping
- Assets: model name can vary by Odoo version (`account.asset` or `account.asset.asset`). Adjust in `OdooAssetService` if needed.
- Many2one values return arrays like `[id, "Display Name"]` — see parsing in services.
- Add more services the same way for `maintenance.equipment`, `res.partner`, etc.

## Error handling & retries
This starter throws `RuntimeException` on XML-RPC errors. For production, wrap with a `@ControllerAdvice` and implement retries/backoff as needed.

## Security
Keep Odoo credentials in env vars or a vault (e.g., Spring Cloud Config + Vault). Never expose Odoo directly to the frontend.

## Switching to REST later
If your Odoo has REST enabled, you can replace `OdooXmlRpc` with a `WebClient`-based REST client and keep the same service & controller interfaces.
