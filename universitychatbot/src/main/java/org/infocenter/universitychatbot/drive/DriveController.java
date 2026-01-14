package org.infocenter.universitychatbot.drive;

import com.google.api.services.drive.model.File;
import jakarta.servlet.http.HttpServletResponse;
import org.infocenter.universitychatbot.repository.DocumentRequestRepository;
import org.infocenter.universitychatbot.dto.DriveFileResponse;
import org.infocenter.universitychatbot.model.DocumentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/drive")
public class DriveController {

    @Autowired
    private GoogleDriveService googleDriveService;

    @Autowired
    private DocumentRequestRepository requestRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) String folderId,
            @RequestParam(value = "requestId", required = false) Long requestId
    ) {
        try {
            String fileId = googleDriveService.uploadFile(file, folderId);

            if (requestId != null) {
                DocumentRequest request = requestRepository.findById(requestId)
                        .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
                request.setDriveFileId(fileId);
                requestRepository.save(request);
            }

            return ResponseEntity.ok("File uploaded successfully. File ID: " + fileId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileId}")
    public void downloadFile(@PathVariable String fileId, HttpServletResponse response) throws IOException, GeneralSecurityException {
        // 1. Get file metadata to set the correct filename and content type
        File fileMetadata = googleDriveService.getFileMetadata(fileId);

        // 2. Set response headers
        response.setContentType(fileMetadata.getMimeType());
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileMetadata.getName() + "\"");

        // 3. Stream the file content directly to the response output stream
        googleDriveService.downloadFile(fileId, response.getOutputStream());
    }

    @GetMapping("/list")
    public ResponseEntity<List<DriveFileResponse>> listFiles(@RequestParam("folderId") String folderId) {
        try {
            List<DriveFileResponse> files = googleDriveService.listFiles(folderId);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
