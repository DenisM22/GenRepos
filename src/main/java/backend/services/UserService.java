package backend.services;

import backend.dto.UserDto;
import backend.models.Person;
import backend.models.User;
import backend.repositories.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Пользователь с именем " + username + " не найден"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUserByUsername(username);
    }

    public void saveUser(UserDto user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent())
            throw new IllegalArgumentException("Пользователь с таким именем уже существует");

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setEmail(user.getEmail());

        userRepository.save(newUser);
    }

    public void editUser(User user, UserDto newUser) {
        if (!user.getUsername().equals(newUser.getUsername()) && userRepository.findByUsername(newUser.getUsername()).isPresent())
            throw new IllegalArgumentException("Пользователь с таким именем уже существует");
        if (newUser.getPassword() != null) {
            if (newUser.getPassword().length() < 6 || newUser.getPassword().length() > 100) {
                throw new IllegalArgumentException("Пароль должен быть от 6 до 100 символов");
            }
            user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        }

        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());

        userRepository.save(user);
    }

    public void refreshAuthentication(Person person) {
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = currentAuth.getPrincipal() instanceof User ? (User) currentAuth.getPrincipal() : null;

        if (currentUser == null) {
            throw new UsernameNotFoundException("Текущий пользователь не был найден");
        }

        currentUser.setPerson(person);
        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                currentUser,
                currentAuth.getCredentials(),
                currentAuth.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(newAuth);
    }


}
