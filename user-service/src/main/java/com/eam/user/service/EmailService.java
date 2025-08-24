package com.eam.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.emailjs.user-id}")
    private String emailjsUserId;

    @Value("${app.emailjs.service-id}")
    private String emailjsServiceId;

    @Value("${app.emailjs.template-id-verification}")
    private String verificationTemplateId;

    @Value("${app.emailjs.template-id-reset}")
    private String resetTemplateId;

    @Value("${app.from-email}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendAccountVerificationEmail(String toEmail, String userName, String verificationToken) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        log.debug("Sending verification email to: {}", toEmail);
        String verificationUrl = baseUrl + "/api/auth/verify?token=" + verificationToken;
        Map<String, String> templateParams = new HashMap<>();
        templateParams.put("email", toEmail.trim());
        templateParams.put("from_name", fromEmail);
        templateParams.put("user_name", userName);
        templateParams.put("verification_url", verificationUrl);

        sendEmail(verificationTemplateId, templateParams);
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        log.debug("Sending password reset email to: {}", toEmail);
        // MODIFICATION ICI : Pointe directement vers le chemin frontend /reset-password
        String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
        Map<String, String> templateParams = new HashMap<>();
        templateParams.put("email", toEmail.trim());
        templateParams.put("from_name", fromEmail);
        templateParams.put("user_name", userName);
        templateParams.put("reset_url", resetUrl);

        sendEmail(resetTemplateId, templateParams);
    }

    public void resendVerificationEmail(String toEmail, String userName, String verificationToken) {
        sendAccountVerificationEmail(toEmail, userName, verificationToken);
    }

    private void sendEmail(String templateId, Map<String, String> templateParams) {
        String url = "https://api.emailjs.com/api/v1.0/email/send";
        Map<String, Object> requestBody = new HashMap<>( );
        requestBody.put("service_id", emailjsServiceId);
        requestBody.put("template_id", templateId);
        requestBody.put("user_id", emailjsUserId);
        requestBody.put("template_params", templateParams);

        try {
            restTemplate.postForObject(url, requestBody, String.class);
            String toEmail = templateParams.get("email");
            log.info("Email sent successfully to: {}", toEmail);
            log.debug("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            String toEmail = templateParams.get("email");
            log.error("Error sending email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Error sending email via EmailJS", e);
        }
    }

    public void sendTestEmail(String toEmail) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        log.debug("Sending test email to: {}", toEmail);
        Map<String, String> templateParams = new HashMap<>();
        templateParams.put("email", toEmail.trim());
        templateParams.put("from_name", fromEmail);
        templateParams.put("message", "This is a test email from your Spring Boot application.");

        sendEmail(verificationTemplateId, templateParams);
    }
}
