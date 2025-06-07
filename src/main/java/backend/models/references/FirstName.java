package backend.models.references;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "first_names")
@Getter
@Setter
@NoArgsConstructor
public class FirstName {

    public FirstName(String firstName) {
        this.firstName = firstName;
    }

    @Id
    private String firstName;

    @OneToMany(mappedBy = "firstName", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alias> aliases;
}
