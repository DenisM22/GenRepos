package backend.controllers;

import backend.models.metricDocuments.MetricDocument;
import backend.services.MetricDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/metric-document")
@RequiredArgsConstructor
@Slf4j
public class MetricDocumentController {

    private final MetricDocumentService metricDocumentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str) {
        log.info("Отправлен запрос на получение всех документов");
        return ResponseEntity.ok(metricDocumentService.getDocumentsStartingWith(str));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение документа с id {}", id);
        return ResponseEntity.ok(metricDocumentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody MetricDocument metricDocument) {
        try {
            log.info("Отправлен запрос на сохранение документа");
            metricDocumentService.saveDocument(metricDocument);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
