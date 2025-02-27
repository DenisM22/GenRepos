package backend.controllers;

import backend.models.revisionDocuments.RevisionDocument;
import backend.services.RevisionDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/revision-document")
@RequiredArgsConstructor
@Slf4j
public class RevisionDocumentController {

    private final RevisionDocumentService revisionDocumentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str) {
        log.info("Отправлен запрос на получение всех документов");
        return ResponseEntity.ok(revisionDocumentService.getDocumentsStartingWith(str));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение документа с id {}", id);
        return ResponseEntity.ok(revisionDocumentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody RevisionDocument revisionDocument) {
        try {
            log.info("Отправлен запрос на сохранение документа");
            revisionDocumentService.saveDocument(revisionDocument);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
