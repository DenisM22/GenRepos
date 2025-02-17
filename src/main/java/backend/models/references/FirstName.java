package backend.models.references;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.context.properties.bind.Name;

import java.util.List;

@Entity
@Table(name = "first_names")
@Getter
@Setter
public class FirstName {

    @Id
    private String firstName;

    @OneToMany(mappedBy = "firstName", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alias> aliases;
}

