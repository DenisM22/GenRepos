package backend.services;

import backend.dto.UserDto;
import backend.models.User;
import backend.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    @Test
    void getUserByUsername_shouldReturnUser() {
        String username = "test";
        User user = new User();

        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        assertEquals(user, userService.getUserByUsername(username));
    }

    @Test
    void getUserByUsername_shouldThrowException() {
        String username = "test";

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userService.getUserByUsername(username)
        );

        assertEquals("Пользователь с именем " + username + " не найден", exception.getMessage());
    }

    @Test
    void loadUserByUsername_shouldReturnUser() {
        String username = "test";
        User user = new User();

        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        assertEquals(user, userService.loadUserByUsername(username));
    }

    @Test
    void loadUserByUsername_shouldThrowException() {
        String username = "test";

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userService.loadUserByUsername(username)
        );

        assertEquals("Пользователь с именем " + username + " не найден", exception.getMessage());
    }

    @Test
    void saveUser_shouldSaveUser() {
        String username = "test";
        String password = "password";
        String email = "email";

        User user = new User(username, password, email);
        UserDto userDto = new UserDto(username, password, email);

        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");

        userService.saveUser(userDto);

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(userDto.getUsername());
        Mockito.verify(userRepository, Mockito.times(1)).save(user);
    }

    @Test
    void saveUser_shouldThrowException() {
        String username = "test";
        String password = "password";
        String email = "email";

        User user = new User(username, password, email);
        UserDto userDto = new UserDto(username, password, email);

        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.saveUser(userDto)
        );

        assertEquals("Пользователь с таким именем уже существует", exception.getMessage());
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }

    @Test
    void editUser_shouldEditUser() {
        String password = "password";
        String email = "email";

        User user = new User("username", password, email);
        UserDto newUser = new UserDto("newUsername", password, email);

        Mockito.when(userRepository.findByUsername(newUser.getUsername())).thenReturn(Optional.empty());
        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");

        userService.editUser(user, newUser);

        Mockito.verify(userRepository, Mockito.times(1)).save(user);
    }

    @Test
    void editUser_whenUsernameExists_shouldThrowException() {
        String password = "password";
        String email = "email";

        User user = new User("username", password, email);
        UserDto newUser = new UserDto("newUsername", password, email);

        Mockito.when(userRepository.findByUsername(newUser.getUsername())).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.editUser(user, newUser)
        );
        assertEquals("Пользователь с таким именем уже существует", exception.getMessage());
    }

    @Test
    void editUser_whenNoValidPassword_shouldThrowException() {
        String password = "pass";
        String email = "email";

        User user = new User("username", password, email);
        UserDto newUser = new UserDto("newUsername", password, email);

        Mockito.when(userRepository.findByUsername(newUser.getUsername())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.editUser(user, newUser)
        );
        assertEquals("Пароль должен быть от 6 до 100 символов", exception.getMessage());
    }

}
