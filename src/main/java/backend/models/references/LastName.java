package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "last_names")
@Getter
@Setter
public class LastName {

    @Id
    private String lastName;

}

