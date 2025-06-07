package backend.controllers;

import backend.dto.UserDto;
import backend.models.User;
import backend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @GetMapping("/get/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        log.info("Отправлен запрос на получение пользователя с username {}", username);
        return ResponseEntity.ok().body(userService.getUserByUsername(username));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        log.info("Отправлен запрос на получение текущего пользователя");
        if (user == null) {
            throw new BadCredentialsException("Текущий пользователь не найден");
        }
        UserDto userDto = modelMapper.map(user, UserDto.class);
        userDto.setPassword(null);
        return ResponseEntity.ok().body(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody @Valid UserDto user) {
        log.info("Отправлен запрос на сохранение пользователя с username {}", user.getUsername());
        userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/edit")
    public ResponseEntity<Object> editUser(@AuthenticationPrincipal User user, @RequestBody @Valid UserDto newUser) {
        log.info("Отправлен запрос на редактирование пользователя с username {}", user.getUsername());
        userService.editUser(user, newUser);
        return ResponseEntity.ok().build();
    }

}
