package org.infocenter.universitychatbot.drive.dto;

import java.time.LocalDateTime;

public class DriveFileResponse {
    private String id;
    private String name;
    private Long size;
    private LocalDateTime createdTime;
    private String webViewLink;

    public DriveFileResponse(String id, String name, Long size, LocalDateTime createdTime, String webViewLink) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.createdTime = createdTime;
        this.webViewLink = webViewLink;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public String getWebViewLink() {
        return webViewLink;
    }

    public void setWebViewLink(String webViewLink) {
        this.webViewLink = webViewLink;
    }
}
