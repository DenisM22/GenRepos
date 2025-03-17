package backend.controllers;

import backend.models.metricDocuments.MetricDocument;
import backend.services.MetricDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document/metric")
@RequiredArgsConstructor
@Slf4j
public class MetricDocumentController {

    private final MetricDocumentService metricDocumentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str,
                                             @RequestParam(name = "from", required = false) Short from,
                                             @RequestParam(name = "to", required = false) Short to) {
        log.info("Отправлен запрос на получение всех метрических книг");
        return ResponseEntity.ok(metricDocumentService.getAllDocuments(str, from, to));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение метрической книги с id {}", id);
        return ResponseEntity.ok(metricDocumentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody MetricDocument metricDocument) {
        try {
            log.info("Отправлен запрос на сохранение метрической книги");
            metricDocumentService.saveDocument(metricDocument);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
