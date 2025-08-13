### TODO — Odoo Hybrid Integration (Your actions only)

- [ ] Create an integration user in Odoo and generate an API key
  - Keep the API key secret; you will use it as `ODOO_PASSWORD`.
  - Ensure the user has read/write on Maintenance and Assets modules.

- [ ] Provide the 4 required environment variables (preferred; do not hardcode)
```bash
export ODOO_URL=https://odoo.yourdomain.com
export ODOO_DB=your_db_name
export ODOO_USERNAME=api@yourdomain.com
export ODOO_PASSWORD=your_odoo_api_key
```

- [ ] Optional: adjust timeouts via env
```bash
export ODOO_CONNECT_TIMEOUT=8000
export ODOO_READ_TIMEOUT=20000
```

- [ ] Optional: if your frontend origin differs, update Gateway CORS
File: `api-gateway/src/main/resources/application.properties`
```properties
# TODO: Change to your frontend URL if not http://localhost:8082
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins=http://localhost:8082
```

- [ ] Optional: if your Odoo version uses a different asset model name
File: `odoo-integration-service/src/main/java/com/eam/odoo/OdooAssetService.java`
```java
// TODO: If your Odoo uses 'account.asset.asset', update the model name here
Object[] rows = rpc.searchRead(
        "account.asset", // <- change to "account.asset.asset" if needed
        new Object[]{},
        new String[]{"name", "original_value", "acquisition_date", "state"},
        0, limit, "id desc"
);
```

- [ ] Optional: local dev override (use env instead for prod)
File: `odoo-integration-service/src/main/resources/application.properties`
```properties
# TODO (dev only): you may hardcode local values instead of env vars
# odoo.url=https://odoo.yourdomain.com
# odoo.db=your_db_name
# odoo.username=api@yourdomain.com
# odoo.password=your_odoo_api_key
```

- [ ] Optional: self-signed TLS on Odoo
```text
TODO: If Odoo uses a self-signed certificate, import it into the JVM truststore
for the odoo-integration-service container/host.
```

- [ ] Run services and test through the API Gateway
```bash
# Start Eureka, then:
cd odoo-integration-service && mvn spring-boot:run
# Test:
curl 'http://localhost:8080/api/integrations/odoo/assets?limit=5'
```