package backend.controllers;

import backend.models.Document;
import backend.services.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final DocumentService documentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str) {
        log.info("Отправлен запрос на получение всех документов");
        return ResponseEntity.ok(documentService.getAllDocuments(str));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение документа с id {}", id);
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody Document document) {
        log.info("Отправлен запрос на сохранение документа");
        documentService.saveDocument(document);
        return ResponseEntity.ok().build();
    }

}
