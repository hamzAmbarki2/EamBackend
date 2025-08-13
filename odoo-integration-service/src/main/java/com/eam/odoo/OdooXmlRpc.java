package com.eam.odoo;

import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.client.XmlRpcClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OdooXmlRpc {

    private final XmlRpcClient objectClient;
    private final OdooAuthService authService;

    public OdooXmlRpc(@Qualifier("odooObjectClient") XmlRpcClient objectClient, OdooAuthService authService) {
        this.objectClient = objectClient;
        this.authService = authService;
    }

    @SuppressWarnings("unchecked")
    public Object[] searchRead(String model, Object[] domain, String[] fields, Integer offset, Integer limit, String order) {
        int uid = authService.authenticate();
        Map<String, Object> kwargs = new HashMap<>();
        if (fields != null) kwargs.put("fields", fields);
        if (offset != null) kwargs.put("offset", offset);
        if (limit != null) kwargs.put("limit", limit);
        if (order != null) kwargs.put("order", order);

        try {
            return (Object[]) objectClient.execute("execute_kw", new Object[]{
                    authService.getDb(), uid, authService.getPassword(),
                    model, "search_read",
                    new Object[]{domain == null ? new Object[]{} : domain},
                    kwargs
            });
        } catch (XmlRpcException e) {
            throw new RuntimeException("Odoo search_read failed: " + e.getMessage(), e);
        }
    }

    public Integer create(String model, Map<String, Object> vals) {
        int uid = authService.authenticate();
        try {
            Object id = objectClient.execute("execute_kw", new Object[]{
                    authService.getDb(), uid, authService.getPassword(),
                    model, "create",
                    new Object[]{vals}
            });
            if (id instanceof Integer) return (Integer) id;
            if (id instanceof Number) return ((Number) id).intValue();
            throw new RuntimeException("Unexpected ID type from create: " + id);
        } catch (XmlRpcException e) {
            throw new RuntimeException("Odoo create failed: " + e.getMessage(), e);
        }
    }

    public Boolean write(String model, Integer id, Map<String, Object> vals) {
        int uid = authService.authenticate();
        try {
            Object ok = objectClient.execute("execute_kw", new Object[]{
                    authService.getDb(), uid, authService.getPassword(),
                    model, "write",
                    new Object[]{new Object[]{id}, vals}
            });
            return Boolean.TRUE.equals(ok);
        } catch (XmlRpcException e) {
            throw new RuntimeException("Odoo write failed: " + e.getMessage(), e);
        }
    }

    public Boolean unlink(String model, Integer id) {
        int uid = authService.authenticate();
        try {
            Object ok = objectClient.execute("execute_kw", new Object[]{
                    authService.getDb(), uid, authService.getPassword(),
                    model, "unlink",
                    new Object[]{new Object[]{id}}
            });
            return Boolean.TRUE.equals(ok);
        } catch (XmlRpcException e) {
            throw new RuntimeException("Odoo unlink failed: " + e.getMessage(), e);
        }
    }
}