package backend.controllers;

import backend.models.Document;
import backend.models.Person;
import backend.services.DocumentService;
import backend.services.PersonService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str,
                                             @RequestParam(name = "page") int page) {
        return ResponseEntity.ok(documentService.getAllDocuments(str, page));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody Document document) {
        documentService.saveDocument(document);
        return ResponseEntity.ok().build();
    }

}
