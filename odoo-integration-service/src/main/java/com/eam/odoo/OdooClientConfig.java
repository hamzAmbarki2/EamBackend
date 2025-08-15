package com.eam.odoo;

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

	@Value("${odooClient.connectTimeout:8000}")
	private int connectTimeout;

	@Value("${odooClient.readTimeout:20000}")
	private int readTimeout;

	private String normalizeBaseUrl(String url) {
		if (url == null) return null;
		int i = url.length();
		while (i > 0 && url.charAt(i - 1) == '/') {
			i--;
		}
		return url.substring(0, i);
	}

	@Bean(name = "odooCommonClient")
	public XmlRpcClient commonClient() throws MalformedURLException {
		XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
		String base = normalizeBaseUrl(odooUrl);
		config.setServerURL(new URL(base + "/xmlrpc/2/common"));
		config.setConnectionTimeout(connectTimeout);
		config.setReplyTimeout(readTimeout);
		XmlRpcClient client = new XmlRpcClient();
		client.setConfig(config);
		return client;
	}

	@Bean(name = "odooObjectClient")
	public XmlRpcClient objectClient() throws MalformedURLException {
		XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
		String base = normalizeBaseUrl(odooUrl);
		config.setServerURL(new URL(base + "/xmlrpc/2/object"));
		config.setConnectionTimeout(connectTimeout);
		config.setReplyTimeout(readTimeout);
		XmlRpcClient client = new XmlRpcClient();
		client.setConfig(config);
		return client;
	}
}