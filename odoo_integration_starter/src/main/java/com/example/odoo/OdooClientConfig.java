package com.example.odoo;

import org.apache.xmlrpc.client.XmlRpcClient;
import org.apache.xmlrpc.client.XmlRpcClientConfigImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.net.URL;

@Configuration
public class OdooClientConfig {

    @Value("${odoo.url}")
    private String odooUrl;

    @Bean(name = "odooCommonClient")
    public XmlRpcClient commonClient() throws MalformedURLException {
        XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
        config.setServerURL(new URL(odooUrl + "/xmlrpc/2/common"));
        XmlRpcClient client = new XmlRpcClient();
        client.setConfig(config);
        return client;
    }

    @Bean(name = "odooObjectClient")
    public XmlRpcClient objectClient() throws MalformedURLException {
        XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
        config.setServerURL(new URL(odooUrl + "/xmlrpc/2/object"));
        XmlRpcClient client = new XmlRpcClient();
        client.setConfig(config);
        return client;
    }
}
