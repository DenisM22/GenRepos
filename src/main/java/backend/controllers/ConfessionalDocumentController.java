package backend.controllers;

import backend.models.confessionalDocuments.ConfessionalDocument;
import backend.services.ConfessionalDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document/confessional")
@RequiredArgsConstructor
@Slf4j
public class ConfessionalDocumentController {

    private final ConfessionalDocumentService confessionalDocumentService;
    private final ModelMapper modelMapper;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllDocuments(@RequestParam(name = "str", required = false) String str,
                                             @RequestParam(name = "from", required = false) Short from,
                                             @RequestParam(name = "to", required = false) Short to) {
        log.info("Отправлен запрос на получение всех исповедных ведомостей");
        return ResponseEntity.ok(confessionalDocumentService.getAllDocuments(str, from, to));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение исповедной ведомости с id {}", id);
        return ResponseEntity.ok(confessionalDocumentService.getDocumentById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDocument(@RequestBody ConfessionalDocument confessionalDocument) {
        try {
            log.info("Отправлен запрос на сохранение исповедной ведомости");
            confessionalDocumentService.saveDocument(confessionalDocument);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
