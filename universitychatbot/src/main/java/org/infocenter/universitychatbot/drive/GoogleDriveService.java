package org.infocenter.universitychatbot.drive;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.FileList;
import org.infocenter.universitychatbot.dto.DriveFileResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveService {

    @Value("${google.drive.application-name}")
    private String applicationName;

    @Value("${google.drive.credentials-file-path}")
    private String credentialsFilePath;

    @Value("${google.drive.tokens-directory-path}")
    private String tokensDirectoryPath;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);

    public Drive getDriveService() throws IOException, GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // Load client secrets.
        InputStream in = GoogleDriveService.class.getResourceAsStream("/" + credentialsFilePath);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + credentialsFilePath);
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(tokensDirectoryPath)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

        return new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(applicationName)
                .build();
    }

    public String uploadFile(org.springframework.web.multipart.MultipartFile multipartFile, String folderId) throws IOException, GeneralSecurityException {
        Drive driveService = getDriveService();

        com.google.api.services.drive.model.File fileMetadata = new com.google.api.services.drive.model.File();
        fileMetadata.setName(multipartFile.getOriginalFilename());

        if (folderId != null && !folderId.isEmpty()) {
            fileMetadata.setParents(Collections.singletonList(folderId));
        }

        com.google.api.client.http.InputStreamContent mediaContent = new com.google.api.client.http.InputStreamContent(
                multipartFile.getContentType(),
                multipartFile.getInputStream()
        );

        com.google.api.services.drive.model.File file = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        return file.getId();
    }

    public com.google.api.services.drive.model.File getFileMetadata(String fileId) throws IOException, GeneralSecurityException {
        Drive service = getDriveService();
        return service.files().get(fileId).execute();
    }

    public void downloadFile(String fileId, OutputStream outputStream) throws IOException, GeneralSecurityException {
        Drive service = getDriveService();
        service.files().get(fileId).executeMediaAndDownloadTo(outputStream);
    }

    public List<DriveFileResponse> listFiles(String folderId) throws IOException, GeneralSecurityException {
        Drive service = getDriveService();
        String query = "'" + folderId + "' in parents and trashed = false";

        FileList result = service.files().list()
                .setQ(query).setFields("nextPageToken, files(id, name, size, createdTime, webViewLink)")
                .execute();

        List<DriveFileResponse> files = new ArrayList<>();
        if (result.getFiles() != null) {
            for (com.google.api.services.drive.model.File file : result.getFiles()) {
                LocalDateTime createdTime = null;
                if (file.getCreatedTime() != null) {
                    createdTime = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(file.getCreatedTime().getValue()),
                            ZoneId.systemDefault());
                }

                files.add(new DriveFileResponse(
                        file.getId(),
                        file.getName(),
                        file.getSize(),
                        createdTime,
                        file.getWebViewLink()
                ));
            }
        }
        return files;
    }
}
