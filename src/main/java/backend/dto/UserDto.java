package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {

    public UserDto(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    private Long id;

    @NotBlank(message = "Имя пользователя не может быть пустым")
    @Size(min = 2, max = 50, message = "Имя пользователя должно быть от 2 до 50 символов")
    private String username;

    @Size(min = 6, max = 100, message = "Пароль должен быть от 6 до 100 символов")
    private String password;

    @NotBlank(message = "Почта не может быть пустой")
    @Email(message = "Почта должна быть корректной")
    @Size(min = 2, max = 50, message = "Почта должна быть от 2 до 50 символов")
    private String email;

    private PersonLightDto person;

}
