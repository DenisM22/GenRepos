package backend.controllers;

import backend.models.revisionDocuments.RevisionDocument;
import backend.services.RevisionDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document/revision")
@RequiredArgsConstructor
@Slf4j
public class RevisionDocumentController {

    private final RevisionDocumentService revisionDocumentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str,
                                             @RequestParam(name = "from", required = false) Short from,
                                             @RequestParam(name = "to", required = false) Short to) {
        log.info("Отправлен запрос на получение всех ревизских сказок");
        return ResponseEntity.ok(revisionDocumentService.getAllDocuments(str, from, to));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение ревизской сказки с id {}", id);
        return ResponseEntity.ok(revisionDocumentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody RevisionDocument revisionDocument) {
        try {
            log.info("Отправлен запрос на сохранение ревизской сказки");
            revisionDocumentService.saveDocument(revisionDocument);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
