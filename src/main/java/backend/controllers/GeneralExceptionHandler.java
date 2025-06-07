package backend.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GeneralExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<?> exceptionHandler(Exception e) {
        log.error(e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationHandler(MethodArgumentNotValidException e) {

        StringBuilder errors = new StringBuilder();

        e.getBindingResult().getFieldErrors().forEach(error ->
                errors.append(error.getDefaultMessage()).append("; "));
        errors.delete(errors.length() - 2, errors.length());

        log.error(errors.toString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors.toString());
    }

}
