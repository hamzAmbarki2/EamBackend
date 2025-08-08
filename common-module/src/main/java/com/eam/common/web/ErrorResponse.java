package com.eam.common.web;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.OffsetDateTime;
import java.util.Map;

public class ErrorResponse {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private OffsetDateTime timestamp;
    private String path;
    private ApiErrorCode errorCode;
    private String message;
    private String correlationId;
    private Map<String, Object> details;

    public ErrorResponse() {}

    public ErrorResponse(OffsetDateTime timestamp, String path, ApiErrorCode errorCode, String message, String correlationId, Map<String, Object> details) {
        this.timestamp = timestamp;
        this.path = path;
        this.errorCode = errorCode;
        this.message = message;
        this.correlationId = correlationId;
        this.details = details;
    }

    public OffsetDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public ApiErrorCode getErrorCode() { return errorCode; }
    public void setErrorCode(ApiErrorCode errorCode) { this.errorCode = errorCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}