package com.eam.odoo;

import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.client.XmlRpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class OdooAuthService {

    private static final Logger log = LoggerFactory.getLogger(OdooAuthService.class);

    private final XmlRpcClient commonClient;

    @Value("${odoo.db}")
    private String db;
    @Value("${odoo.username}")
    private String username;
    @Value("${odoo.password}")
    private String password;

    public OdooAuthService(@Qualifier("odooCommonClient") XmlRpcClient commonClient) {
        this.commonClient = commonClient;
    }

    /**
     * Authenticate and return uid.
     */
    public int authenticate() {
        try {
            Object uid = commonClient.execute("authenticate",
                    new Object[]{db, username, password, Collections.emptyMap()});
            if (uid == null || Boolean.FALSE.equals(uid)) {
                throw new RuntimeException("Failed to authenticate to Odoo: invalid credentials or database name");
            }
            if (uid instanceof Integer) {
                return (Integer) uid;
            } else if (uid instanceof Number) {
                return ((Number) uid).intValue();
            }
            throw new RuntimeException("Failed to authenticate to Odoo: unexpected uid type " + uid.getClass());
        } catch (XmlRpcException e) {
            log.error("Odoo authentication XML-RPC error: {}", e.getMessage());
            throw new RuntimeException("Failed to authenticate to Odoo: " + e.getMessage(), e);
        }
    }

    public String getDb() {
        return db;
    }

    public String getPassword() {
        return password;
    }
}