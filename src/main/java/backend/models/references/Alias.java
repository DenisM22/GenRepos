package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aliases")
@Getter
@Setter
public class Alias {

    @Id
    private String alias;

    @ManyToOne
    @JoinColumn(name = "first_name")
    private FirstName firstName;

}
